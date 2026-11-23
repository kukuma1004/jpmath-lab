import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(path.join(root,'games/cheonroe/source/package.json'));
const {chromium}=require('@playwright/test'),{build}=require('esbuild');
const out=path.join(root,'.dream-loop/cheonroe-melee',process.env.CHEONROE_CAPTURE_LABEL||'browser');await mkdir(out,{recursive:true});
await build({entryPoints:[path.join(root,'games/cheonroe/source/src/engine.ts')],bundle:true,format:'esm',platform:'node',outfile:path.join(out,'geometry.mjs'),logLevel:'error'});
const {hitCircles}=await import(pathToFileURL(path.join(out,'geometry.mjs')));
const base=process.env.CHEONROE_TEST_URL||'http://127.0.0.1:5202/games/cheonroe/';
const browser=await chromium.launch({channel:'msedge',headless:true}),results=[],errors=[],http=[];
try{
 for(const mobile of [false,true]){
  const context=await browser.newContext(mobile?{viewport:{width:844,height:390},isMobile:true,hasTouch:true}:{viewport:{width:1280,height:800}}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)http.push({url:r.url(),status:r.status()});});
  await page.addInitScript(()=>{Element.prototype.requestFullscreen=async()=>{throw Error('Fixed QA viewport');};});
  await page.goto(`${base}?qa=1`);await page.waitForFunction(()=>document.querySelector('#start')?.disabled===false);
  await page.click('#help');const melee=page.locator('#help-dialog dl>div').filter({has:page.locator('dt',{hasText:'근접'})});assert((await melee.innerText()).includes('근접 공격은 탄을 막지 않으니'));
  await melee.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,mobile?'mobile-help.png':'desktop-help.png')});await page.click('#help-play');
  const hero=mobile?'golem':'rin',rank=mobile?8:1;
  await page.evaluate(async({hero,rank})=>{const h=window.__THREE_GAME_TEST_HOOKS__;await h.setState('boss',{hero,stage:0,awakening:rank,power:1});h.setPausedForScreenshot(true);},{hero,rank});
  let nearFrames=0,maxBullets=0,s;
  // A synthetic proximity tracker follows a real authored boss without dodging,
  // charging, ultimates, injected bullets or extra invulnerability.
  for(let i=0;i<180;i++){
   s=await page.evaluate(()=>window.__THREE_GAME_TEST_HOOKS__.getState());if(s.phase!=='playing')break;
   const boss=s.enemies.find(e=>e.boss);if(!boss)break;
   const circle=hitCircles(boss).sort((a,b)=>(a[0]-a[2])-(b[0]-b[2]))[0];
   const dx=circle[0]-circle[2]-28-s.player.x,dy=circle[1]-s.player.y;
   await page.evaluate(({dx,dy})=>{const h=window.__THREE_GAME_TEST_HOOKS__;h.advance(1/120,{drag:{dx,dy}});h.advance(.1);},{dx,dy});
   s=await page.evaluate(()=>window.__THREE_GAME_TEST_HOOKS__.getState());if(s.player.nearTimer>0)nearFrames++;maxBullets=Math.max(maxBullets,s.bullets.length);
  }
  assert(nearFrames>20,'must actually sustain close attacks');assert(s.stats.damageTaken>0,'close attacks cannot provide permanent safety');assert.equal(s.stats.ultimates,0);assert.equal(s.stats.dashes,0);
  await page.screenshot({path:path.join(out,mobile?'mobile-close-pressure.png':'desktop-close-pressure.png')});
  results.push({mobile,hero,rank,nearFrames,hits:s.stats.damageTaken,hp:s.player.hp,phase:s.phase,bullets:maxBullets});console.log(`PASS ${mobile?'mobile':'desktop'} ${hero} rank${rank}: ${nearFrames} close frames, ${s.stats.damageTaken} hits under real boss fire`);
  await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(http,[]);
 await writeFile(path.join(out,'results.json'),JSON.stringify({url:base,results,errors,http,scope:'Synthetic boss tracking in desktop/mobile Edge emulation; no physical-device, human difficulty or public-ranking-write claim.'},null,2));
}finally{await browser.close();}
