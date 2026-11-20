import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const out=path.resolve('../artifacts/final-input-pass');await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});const errors=[];const checks=[];const samples=[];
const check=(name,ok)=>{if(!ok)throw new Error(name);checks.push(name);console.log(`PASS ${name}`);};
const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:out,size:{width:960,height:600}}});
const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
try{
  await page.goto('http://127.0.0.1:5190/games/billiards/?qa=1');await page.waitForFunction(()=>!!window.__THREE_GAME_DIAGNOSTICS__);
  await page.locator('#start').click();await page.locator('#assist').selectOption('advanced');await page.waitForTimeout(400);
  await page.locator('#world').screenshot({path:'../cover.png'});
  check('Static bundle initializes under /games/billiards',true);
  await page.locator('#layout').selectOption('spin');const pad=await page.locator('#tip-pad').boundingBox();await page.mouse.click(pad.x+pad.width*.5,pad.y+pad.height*.73);await page.locator('#power').fill('30');
  await page.locator('#camera-cue').click();await page.waitForTimeout(800);await page.screenshot({path:path.join(out,'cue-backspin.png')});
  await page.locator('#shoot').click();
  for(let i=0;i<18;i++){samples.push(await page.evaluate(()=>{const d=window.__THREE_GAME_DIAGNOSTICS__;return{state:d.gameState,t:d.physics.time,settled:d.physics.settled,balls:d.simulationState.balls.map(b=>({id:b.id,p:b.position,v:b.velocity,w:b.angularVelocity,q:b.orientation}))};}));await page.waitForTimeout(130);}
  check('Current cue motion drives a real spinning shot',samples.some(s=>s.state==='stroking')&&samples.some(s=>s.state==='moving'&&s.balls.some(b=>Math.hypot(b.w.x,b.w.z)>1)));
  // Narrow viewport/landscape regression after touch-target sizing changes.
  for(const [width,height] of [[390,844],[360,740],[768,1024],[844,390],[1366,768]]){
    await page.setViewportSize({width,height});await page.waitForTimeout(250);
    const fits=await page.evaluate(()=>{const b=document.querySelector('#shoot').getBoundingClientRect();return b.top>=0&&b.bottom<=innerHeight+1&&b.left>=0&&b.right<=innerWidth&&document.documentElement.scrollWidth<=innerWidth;});
    check(`${width}x${height} shot control fits`,fits);await page.screenshot({path:path.join(out,`layout-${width}x${height}.png`)});
  }
  await page.goto('http://127.0.0.1:5190/games/');await expect(page.locator('#billiards-title')).toBeVisible();check('Game room card links practice',await page.locator('.billiards-card .play-button').getAttribute('href')==='billiards/');check('Game room cover loads',await page.locator('.billiards-card img').evaluate(e=>e.complete&&e.naturalWidth>0));
  await page.locator('.billiards-card').screenshot({path:path.join(out,'game-room-card.png')});await page.locator('.billiards-card .play-button').click();await expect(page.locator('#start')).toBeVisible();check('Game room navigation opens billiards',true);
  check('No page errors after final changes',errors.length===0);
  const video=page.video();await context.close();const videoPath=await video.path();
  await writeFile('../artifacts/final-motion.json',JSON.stringify({checks,errors,video:path.relative(path.resolve('..'),videoPath),samples},null,2)+'\n');
}finally{await browser.close();}
