import{launchBrowser}from'./browser.mjs';
import{mkdir,writeFile}from'node:fs/promises';
const url=process.env.BILLIARDS_URL??'http://127.0.0.1:5192/games/billiards/?qa=1';
const browser=await launchBrowser(),page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1}),errors=[],scenarios=[];
page.on('pageerror',e=>errors.push(e.message));
const diagnostics=()=>page.evaluate(()=>window.__THREE_GAME_DIAGNOSTICS__);
async function sample(name,discipline){
 await page.evaluate(d=>{const h=window.__THREE_GAME_TEST_HOOKS__;h.freezeAI(true);h.newMatch({discipline:d,mode:'practice'});h.freezeAI(true);const g=h.game;if(g.phase==='placing')g.placeCue({x:-.85,z:0});},discipline);
 await page.waitForTimeout(500);
 await page.evaluate(()=>{window.__THREE_GAME_TEST_HOOKS__.shot({ballId:'white',angle:0,power:.85,tip:{x:.15,y:.12}});});
 await page.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.gameState==='moving');
 const frames=await page.evaluate(()=>new Promise(resolve=>{const rows=[];let last=performance.now(),start=last;function tick(t){rows.push({ms:t-last,state:window.__THREE_GAME_DIAGNOSTICS__.gameState});last=t;if(t-start>=3500)resolve(rows);else requestAnimationFrame(tick);}requestAnimationFrame(tick);}));
 const active=frames.filter(f=>f.state==='moving'&&f.ms>0).map(f=>f.ms).sort((a,b)=>a-b),d=await diagnostics();
 if(active.length<20)throw new Error(`${name}: insufficient active frames`);
 const mean=active.reduce((a,b)=>a+b,0)/active.length;
 scenarios.push({name,viewport:{width:1440,height:900,deviceScaleFactor:1},renderer:d.renderer,frames:active.length,meanMs:mean,medianMs:active[Math.floor(active.length*.5)],p95Ms:active[Math.floor(active.length*.95)],fps:1000/mean});
}
try{
 await page.goto(url);await page.waitForFunction(()=>!!window.__THREE_GAME_DIAGNOSTICS__);
 await sample('active-carom','four-ball');await sample('active-full-pool','eight-ball');
 await page.evaluate(()=>{const h=window.__THREE_GAME_TEST_HOOKS__;h.newMatch({discipline:'four-ball',mode:'ai',difficulty:'expert'});h.freezeAI(true);h.setMatch({currentPlayer:1});h.freezeAI(false);});
 await page.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.lastAI!==null,null,{timeout:30000});
 const ai=(await diagnostics()).lastAI;
 await page.evaluate(()=>{const h=window.__THREE_GAME_TEST_HOOKS__;h.freezeAI(true);h.newMatch({discipline:'eight-ball',mode:'practice'});h.freezeAI(true);});await page.waitForTimeout(300);const before=(await diagnostics()).renderer;
 for(let i=0;i<24;i++)await page.evaluate(i=>{const h=window.__THREE_GAME_TEST_HOOKS__;h.newMatch({discipline:i%2?'eight-ball':'four-ball',mode:'practice'});h.freezeAI(true);},i);
 await page.waitForTimeout(500);const after=(await diagnostics()).renderer;
 if(after.geometries>before.geometries+5||after.textures>before.textures+3)throw new Error('Table switching grows renderer resources');
 const software=/swiftshader|llvmpipe|software|basic render/i.test(scenarios[0].renderer.renderer);
 await mkdir('../artifacts/performance',{recursive:true});await writeFile('../artifacts/performance/result.json',JSON.stringify({url,scenarios,ai,resources:{before,after},errors,softwareRendered:software,limits:software?'Software rasterizer: FPS not valid hardware evidence.':'Native new-headless Chrome with AMD/driver renderer above. Active local desktop GPU measurement; touch emulation does not establish physical-phone performance.'},null,2));
 console.log(JSON.stringify({scenarios:scenarios.map(s=>({name:s.name,fps:s.fps,p95Ms:s.p95Ms,renderer:s.renderer.renderer})),resourceGrowth:{geometries:after.geometries-before.geometries,textures:after.textures-before.textures},aiMs:ai.elapsedMs,softwareRendered:software,errors}));
 if(errors.length)throw new Error('Performance run had page errors');
}finally{await browser.close();}
