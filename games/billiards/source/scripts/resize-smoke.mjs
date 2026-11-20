import { chromium,expect } from '@playwright/test';
import { readFile,writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:900}});const checks=[];const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const check=(name,ok)=>{if(!ok)throw new Error(name);checks.push(name);console.log(`PASS ${name}`);};
const fits=async(name)=>{await page.waitForFunction(()=>{const r=document.querySelector('#world').getBoundingClientRect();const d=window.__THREE_GAME_DIAGNOSTICS__;return Math.abs(d.width-r.width)<1&&Math.abs(d.height-r.height)<1;});check(name,true);};
try{
  await page.goto('http://127.0.0.1:5190/games/billiards/?qa=1');await page.waitForFunction(()=>!!window.__THREE_GAME_DIAGNOSTICS__);await fits('Title canvas uses its real CSS dimensions');
  await page.locator('#start').click();await fits('Starting practice preserves ball aspect ratio');
  await page.locator('#world').focus();await page.keyboard.press('ArrowRight');await expect(page.locator('#camera-cue')).toHaveAttribute('aria-pressed','true');
  await page.locator('#layout').selectOption('collision');await expect(page.locator('#camera-top')).toHaveAttribute('aria-pressed','true');await page.locator('#world').focus();await page.keyboard.press('ArrowRight');await expect(page.locator('#camera-cue')).toHaveAttribute('aria-pressed','true');check('New layout restarts automatic aiming camera',true);
  const before=await page.evaluate(()=>window.__THREE_GAME_DIAGNOSTICS__.renderer.geometries);
  for(let i=0;i<40;i++)await page.keyboard.press('ArrowRight');
  const after=await page.evaluate(()=>window.__THREE_GAME_DIAGNOSTICS__.renderer.geometries);check('Repeated aim updates do not accumulate geometries',after<=before+2);
  await page.locator('#menu').click();await page.locator('#back-title').click();await fits('Returning to title resizes the drawing surface');
  await page.locator('#start').click();await page.setViewportSize({width:390,height:844});await fits('Portrait resize matches renderer to canvas');
  await page.setViewportSize({width:844,height:390});await fits('Landscape resize matches renderer to canvas');
  check('Landscape shot button stays inside the viewport',await page.locator('#shoot').evaluate(e=>{const r=e.getBoundingClientRect();return r.bottom<=innerHeight&&r.right<=innerWidth;}));
  await page.goto('http://127.0.0.1:5190/games/billiards/');await expect(page.locator('#start')).toBeVisible();check('Production entry hides QA hooks',await page.evaluate(()=>!window.__THREE_GAME_TEST_HOOKS__&&!window.__THREE_GAME_DIAGNOSTICS__));
  check('No page errors',errors.length===0);
  const manifest=JSON.parse(await readFile('../build-manifest.json','utf8'));const hashes={};
  for(const f of manifest.files)hashes[f]=createHash('sha256').update(await readFile('../'+f)).digest('hex');
  await writeFile('../artifacts/resize-smoke.json',JSON.stringify({checks,errors,hashes},null,2)+'\n');
}finally{await browser.close();}
