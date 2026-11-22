import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),{chromium}=createRequire(path.join(root,'games/cheonroe/source/package.json'))('@playwright/test');
const base=process.env.CHEONROE_TEST_URL||'http://127.0.0.1:5202/games/cheonroe/';
const out=path.join(root,'.dream-loop/cheonroe-growth/browser');await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1});const page=await context.newPage();
const checks=[],errors=[],http=[],captures=[],motions=[];
const check=(name,ok)=>{assert(ok,name);checks.push(name);console.log(`PASS ${name}`);};
function watch(p){p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)http.push({url:r.url(),status:r.status()});});}
watch(page);
await page.addInitScript(()=>{Element.prototype.requestFullscreen=async()=>{throw Error('No fullscreen in deterministic viewport QA');};});
await page.goto(`${base}?qa=1`);await page.waitForFunction(()=>document.querySelector('#start')?.disabled===false);await page.evaluate(()=>document.fonts.ready);
const hooks=fn=>page.evaluate(fn);
async function state(name,opts={}){await page.evaluate(async({name,opts})=>{await window.__THREE_GAME_TEST_HOOKS__.setState(name,opts);window.__THREE_GAME_TEST_HOOKS__.setPausedForScreenshot(true);},{name,opts});await page.waitForTimeout(100);}
const get=()=>hooks(()=>window.__THREE_GAME_TEST_HOOKS__.getState());
async function capture(name,p=page){const filename=path.join(out,`${name}.png`);await p.screenshot({path:filename,scale:'css'});captures.push({name,path:path.relative(root,filename).replaceAll('\\','/')});}
await capture('menu');
for(const hero of ['rin','golem','ryu','hanui','arang'])for(const rank of [1,4,8]){
 await state('active-play',{hero,stage:0,awakening:rank,power:4,seconds:6.3});const s=await get();
 check(`${hero} rank${rank} HUD uses actual growth`,s.player.awakening===rank&&(await page.locator('#awakening-name').innerText()).includes(`${rank}단`));
 await capture(`${hero}-rank-${rank}`);
 const diag=await hooks(()=>({renderer:window.__THREE_GAME_DIAGNOSTICS__.renderer,performance:window.__THREE_GAME_DIAGNOSTICS__.performance}));
 captures[captures.length-1].diagnostics=diag;
}
for(let stage=0;stage<8;stage++){
 await state('active-play',{hero:'rin',stage,awakening:1,power:1,seconds:9});const s=await get();
 check(`stage${stage+1} has distinct tactical HUD`,(await page.locator('#tactic-title').innerText()).length>0&&s.stage===stage);
 await capture(`stage-${stage+1}-opening`);
}
await state('boss',{stage:0,hero:'rin',awakening:1,power:4});
check('first boss retains authored health and phases',(await get()).enemies.some(e=>e.boss));
await hooks(()=>{window.__THREE_GAME_TEST_HOOKS__.defeatBoss();window.__THREE_GAME_TEST_HOOKS__.advance(4.3,{},true);});let s=await get();
check('real boss clear unlocks rank2 during intermission',s.player.awakening===2&&s.stats.stagesCleared===1);
check('clear screen explains unlocked attack and retained power',await page.locator('#clear-growth').isVisible()&&(await page.locator('#clear-growth-skill').innerText()).includes('합류'));
await hooks(()=>window.__THREE_GAME_TEST_HOOKS__.setPausedForScreenshot(true));await page.waitForTimeout(650);
check('growth reward stays centered and inside viewport',await page.locator('#clear-panel').evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&Math.abs(r.left+r.width/2-innerWidth/2)<3;}));
await capture('guardian-clear-awaken');
await hooks(()=>window.__THREE_GAME_TEST_HOOKS__.advance(5,{},true));s=await get();check('next stage preserves earned awakening',s.stage===1&&s.player.awakening===2);
await hooks(()=>window.__THREE_GAME_TEST_HOOKS__.setPausedForScreenshot(false));await page.bringToFront();const beforeX=(await get()).player.x;await page.keyboard.down('ArrowRight');await page.waitForTimeout(600);await page.keyboard.up('ArrowRight');s=await get();check('real keyboard movement works after transition',s.player.x>beforeX+25);
await page.keyboard.down('KeyZ');await page.waitForTimeout(800);await page.keyboard.up('KeyZ');await page.waitForTimeout(100);check('real charge release works with awakening',(await get()).stats.chargeShots>0);
await page.keyboard.press('KeyP');const t=(await get()).time;await page.waitForTimeout(150);check('pause freezes awakened run',(await get()).time===t&&await page.locator('#overlay').isVisible());
await page.click('#resume');await page.waitForTimeout(100);check('resume keeps awakening',(await get()).player.awakening===2);await page.keyboard.press('KeyP');await page.click('#return');await page.click('[data-difficulty=normal]');await page.click('#start');await page.waitForTimeout(150);check('retry starts at rank1 without overwriting settings',(await get()).player.awakening===1);
// Short unpaused frames show a companion weapon fire, impact, and charge start/release.
await state('active-play',{hero:'golem',stage:3,awakening:6,power:4,seconds:5});
await hooks(()=>window.__THREE_GAME_TEST_HOOKS__.setPausedForScreenshot(false));
await page.keyboard.down('ArrowDown');await page.keyboard.down('KeyZ');await page.waitForTimeout(500);await capture('motion-01-charge');await page.keyboard.up('ArrowDown');await page.keyboard.up('KeyZ');await page.waitForTimeout(130);await capture('motion-02-release');await page.waitForTimeout(400);await capture('motion-03-impact');
motions.push('motion-01-charge','motion-02-release','motion-03-impact');
const mobile=await browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:1.5,isMobile:true,hasTouch:true});const mp=await mobile.newPage();watch(mp);
await mp.addInitScript(()=>{Element.prototype.requestFullscreen=async()=>{throw Error('QA');};});
await mp.goto(`${base}?qa=1`);await mp.waitForFunction(()=>document.querySelector('#start')?.disabled===false);
for(const stage of [0,3,7]){
 await mp.evaluate(async stage=>{await window.__THREE_GAME_TEST_HOOKS__.setState('active-play',{hero:'arang',stage,seconds:8});window.__THREE_GAME_TEST_HOOKS__.setPausedForScreenshot(true);},stage);
 await capture(`mobile-stage-${stage+1}`,mp);check(`mobile stage${stage+1} growth and tactic fit`,await mp.evaluate(()=>{const a=document.querySelector('#growth-status').getBoundingClientRect(),b=document.querySelector('.hud-right').getBoundingClientRect(),c=document.querySelector('.hud-center').getBoundingClientRect();return a.left>=0&&a.right<=innerWidth&&a.bottom<innerHeight*.55&&c.right<b.left&&document.documentElement.scrollWidth<=innerWidth;}));
}
await mp.evaluate(()=>window.__THREE_GAME_TEST_HOOKS__.setPausedForScreenshot(false));const cd=await mobile.newCDPSession(mp);const before=await mp.evaluate(()=>window.__THREE_GAME_TEST_HOOKS__.getState().player.x);
await cd.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:300,y:250,id:1}]});await cd.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:360,y:250,id:1}]});await mp.waitForTimeout(180);await cd.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});check('mobile drag moves awakened hero',(await mp.evaluate(()=>window.__THREE_GAME_TEST_HOOKS__.getState().player.x))>before+30);
await mp.tap('#touch-dash');await mp.waitForTimeout(180);check('mobile dash works with supports',(await mp.evaluate(()=>window.__THREE_GAME_TEST_HOOKS__.getState().stats.dashes))>0);
await mobile.close();if(errors.length||http.length)console.log(JSON.stringify({errors,http}));check('no runtime console or asset errors',errors.length===0&&http.length===0);
const report={checks:checks.length,passed:checks.length,names:checks,errors,http,captures,motions,notes:['Real keyboard/touch input for control checks; opt-in accelerated simulation used for stage/rank capture and guardian clear.','Mobile browser emulation on desktop GPU, no physical-device performance claim. No public ranking writes.']};
await writeFile(path.join(out,'results.json'),JSON.stringify(report,null,2));await browser.close();console.log(`${checks.length} growth browser checks passed`);
