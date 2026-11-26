import {launchBrowser} from './browser.mjs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const url=process.env.BILLIARDS_URL??'http://127.0.0.1:5196/games/billiards/?qa=1';
const out=path.resolve(process.env.BILLIARDS_EVIDENCE??'../artifacts/power-20261126/browser');await mkdir(out,{recursive:true});
const manifest=JSON.parse(await readFile('../build-manifest.json','utf8'));
const prediction=manifest.files.find(f=>f.includes('PredictionWorker-'));
const browser=await launchBrowser(),checks=[],observations=[],errors=[];
const check=(name,ok)=>{if(!ok)throw Error(name);checks.push(name);console.log(`PASS ${name}`);};
try{
 for(const [discipline,limit,previous,mobile]of[['four-ball',6.5,4.5,false],['three-cushion',6.5,4.5,false],['eight-ball',9.5,7.5,true]]){
  const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1366,height:768},isMobile:mobile,hasTouch:mobile}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(url);await page.waitForFunction(()=>!!window.__THREE_GAME_DIAGNOSTICS__);
  await page.evaluate(d=>{const h=window.__THREE_GAME_TEST_HOOKS__;h.newMatch({discipline:d,mode:'practice'});h.freezeAI(true);const g=h.game;if(g.phase==='placing')g.placeCue({x:-.85,z:0});g.angle=.12;g.tip={x:0,y:0};},discipline);
  const button=page.locator('#shoot');if(mobile)await button.tap();else await button.click();
  check(`${discipline} first press only starts power meter`,await page.evaluate(()=>{const g=window.__THREE_GAME_TEST_HOOKS__.game;return g.phase==='charging'&&g.shotCount===0&&g.engine.settled;}));
  await page.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.power>.94);if(mobile)await button.tap();else await button.click();
  await page.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.gameState==='moving');
  const shot=await page.evaluate(()=>{const g=window.__THREE_GAME_TEST_HOOKS__.game;return{power:g.power,speed:g.engine.events.find(e=>e.type==='shot').speed,maximum:g.engine.config.maxShotSpeed};});
  check(`${discipline} high meter produces a stronger real stroke`,shot.speed>previous&&Math.abs(shot.speed-shot.power*limit)<1e-9&&shot.maximum===limit);
  await page.screenshot({path:path.join(out,`${discipline}-strong-shot.png`)});observations.push({discipline,...shot});
  const forecast=await page.evaluate(async({workerURL,discipline})=>{
   const h=window.__THREE_GAME_TEST_HOOKS__;h.newMatch({discipline,mode:'practice'});h.freezeAI(true);const g=h.game;
   const cue=structuredClone(g.engine.balls.find(b=>b.id==='white'));cue.position={x:0,z:.2};
   const Engine=g.engine.constructor,reference=new Engine([cue],g.engine.table),input={ballId:'white',angle:0,power:1,tip:{x:0,y:0}};
   reference.strike(input);reference.step(1/240);const expected=reference.snapshot().balls[0].position;
   const output=await new Promise((resolve,reject)=>{const w=new Worker(workerURL,{type:'module'}),timer=setTimeout(()=>{w.terminate();reject(Error('Prediction timeout'));},15000);w.onmessage=e=>{clearTimeout(timer);w.terminate();resolve(e.data);};w.onerror=e=>{clearTimeout(timer);w.terminate();reject(Error(e.message));};w.postMessage({requestId:1,balls:[cue],table:g.engine.table,shot:input});});
   return{expected,actual:output.paths.find(p=>p.id==='white').points[1]};
  },{workerURL:new URL(prediction,url).href,discipline});
  check(`${discipline} prediction Worker uses the same stronger physics`,Math.hypot(forecast.actual.x-forecast.expected.x,forecast.actual.z-forecast.expected.z)<1e-10);
  await context.close();
 }
 check('No browser errors',errors.length===0);await writeFile(path.join(out,'result.json'),JSON.stringify({url,checks,observations,errors,limits:'Actual browser clicks/taps and shot events; phone is touch emulation. Stronger speed is game tuning, not calibration against a real table.'},null,2));
}catch(error){await writeFile(path.join(out,'failure.json'),JSON.stringify({checks,observations,errors,error:String(error)},null,2));throw error;}finally{await browser.close();}
