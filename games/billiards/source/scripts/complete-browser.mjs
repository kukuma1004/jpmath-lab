import {chromium,expect} from '@playwright/test';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {launchBrowser} from './browser.mjs';
const url=process.env.BILLIARDS_URL??'http://127.0.0.1:5192/games/billiards/?qa=1';
const out=path.resolve(process.env.BILLIARDS_EVIDENCE??'../artifacts/complete-browser');await mkdir(out,{recursive:true});
const browser=await launchBrowser();const checks=[],errors=[],requests=[],observations=[];
const check=(name,ok)=>{if(!ok)throw new Error(name);checks.push(name);console.log(`PASS ${name}`);};
const bind=page=>{page.setDefaultTimeout(20000);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});page.on('request',r=>{if(!['GET','HEAD'].includes(r.method()))requests.push(r.method()+' '+r.url());});};
const diag=p=>p.evaluate(()=>window.__THREE_GAME_DIAGNOSTICS__);
const done=p=>p.waitForFunction(()=>!['stroking','moving','charging','ai-aim'].includes(window.__THREE_GAME_DIAGNOSTICS__.gameState),null,{timeout:65000});
const closeAll=p=>p.evaluate(()=>{for(const d of document.querySelectorAll('dialog[open]'))d.close();});
const fixture=async(p,discipline)=>{const data=JSON.parse(await readFile(`../artifacts/bot-matches/${discipline}.json`,'utf8'));await closeAll(p);await p.evaluate(data=>{const h=window.__THREE_GAME_TEST_HOOKS__;h.freezeAI(true);h.newMatch(data.config);h.freezeAI(true);h.setMatch(data.finalTurnState);h.fixture(data.finalShot.before.balls,data.finalShot.input);},data);return data;};
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:out,size:{width:960,height:600}}});const page=await context.newPage();bind(page);
 await page.goto(url);await page.waitForFunction(()=>!!window.__THREE_GAME_DIAGNOSTICS__);await page.screenshot({path:path.join(out,'desktop-menu.png')});
 await page.locator('[data-mode=local]').click();await page.locator('#target-preset').selectOption('custom');await page.locator('#target-custom').fill('3');await page.locator('#start').click();
 check('Menu applies local mode and custom target',(await diag(page)).config.mode==='local'&&(await diag(page)).config.target===3);
 check('Advanced controls start folded',await page.locator('#advanced-controls').isHidden());
 await page.locator('#shoot').click();await expect(page.locator('#shoot-label')).toHaveText('지금 타격!');
 await page.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.power>.3);const power=(await diag(page)).power;check('First press starts gauge without hitting',(await diag(page)).gameState==='charging'&&(await diag(page)).physics.time===0);
 await page.screenshot({path:path.join(out,'desktop-charging.png')});
 await page.locator('#menu').click();const paused=(await diag(page)).power;await page.waitForTimeout(300);check('Pause freezes gauge',(await diag(page)).power===paused);await page.locator('#resume').click();await page.locator('#cancel-charge').click();check('Cancel gauge never fires',(await diag(page)).shotCount===0);
 await page.locator('#world').focus();await page.keyboard.press('Space');await page.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.power>.23);await page.keyboard.press('Space');
 await page.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.gameState==='moving');check('Second Space strikes and double input locks',(await diag(page)).shotCount===1&&!(await diag(page)).physics.settled);await page.keyboard.press('Space');check('Shot in motion cannot repeat',(await diag(page)).shotCount===1);
 await page.screenshot({path:path.join(out,'desktop-moving.png')});await done(page);check('Shot settles before next input',(await diag(page)).physics.settled);
 await page.locator('#open-record').click();await expect(page.locator('#record-dialog')).toBeVisible();check('Shot report includes rule outcome',await page.locator('#record-dialog-summary').textContent().then(t=>t.includes('샷 1')));await page.locator('#record-done').click();
 for(const discipline of ['four-ball','three-cushion','eight-ball']){
  const data=await fixture(page,discipline);const before=await diag(page);await page.screenshot({path:path.join(out,`${discipline}-before.png`)});
  if(discipline==='eight-ball'){await page.locator('#called-ball').selectOption('');await page.locator('#called-pocket').selectOption('');await page.locator('#shoot').click();check('Missing 8-ball call cannot accidentally start a shot',(await diag(page)).gameState==='aiming');await page.locator('#called-ball').selectOption(data.finalShot.input.calledBall);await page.locator('#called-pocket').selectOption(data.finalShot.input.calledPocket);check('8-ball call controls select ball and pocket',(await diag(page)).renderer.calledPocket===data.finalShot.input.calledPocket);}
  await page.evaluate(input=>window.__THREE_GAME_TEST_HOOKS__.shot(input),data.finalShot.input);await page.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.gameState==='moving');await done(page);await page.waitForTimeout(300);
  check(`${discipline} physically ends with expected winner`,(await diag(page)).match.status==='finished'&&(await diag(page)).match.winner===data.final.winner);
  await expect(page.locator('#result-dialog')).toBeVisible();await page.screenshot({path:path.join(out,`${discipline}-result.png`)});observations.push({discipline,...(await diag(page))});
  await closeAll(page);const final=await diag(page);await page.locator('#replay').click();await page.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.gameState==='moving');await done(page);
  check(`${discipline} replay preserves score and final balls`,JSON.stringify((await diag(page)).match)===JSON.stringify(final.match)&&JSON.stringify((await diag(page)).simulationState.balls)===JSON.stringify(final.simulationState.balls));
 }
 await closeAll(page);await page.evaluate(()=>{window.__THREE_GAME_TEST_HOOKS__.newMatch({discipline:'four-ball',mode:'ai',difficulty:'normal'});window.__THREE_GAME_TEST_HOOKS__.freezeAI(false);const g=window.__THREE_GAME_TEST_HOOKS__.game;g.angle=Math.PI;g.power=.2;g.shoot();});
 await page.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.gameState==='thinking',null,{timeout:60000});const frame=(await diag(page)).frameCount;await page.waitForTimeout(250);check('AI thinking does not freeze rendering',(await diag(page)).frameCount>frame);
 check('Human shot disabled during AI turn',await page.locator('#shoot').isDisabled());await page.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.match.shotNumber>=2,null,{timeout:70000});check('AI executes a real second shot',(await diag(page)).shotCount>=2&&(await diag(page)).lastAI?.simulated>0);
 await page.screenshot({path:path.join(out,'ai-play.png')});
 await page.evaluate(()=>{const h=window.__THREE_GAME_TEST_HOOKS__;h.freezeAI(true);h.newMatch({discipline:'four-ball',mode:'practice'});h.freezeAI(true);});await page.locator('#collapse').click();await page.locator('#layout').selectOption('spin');
 const pad=await page.locator('#tip-pad').boundingBox();await page.mouse.click(pad.x+pad.width*.5,pad.y+pad.height*.72);check('Expanded panel adjusts backspin',(await diag(page)).tip.y<-.4);
 await page.locator('#reset-tip').click();check('Tip reset returns to center',(await diag(page)).tip.y===0);await page.locator('#edit-balls').click();check('Practice editor can open',await page.locator('#edit-ball').isVisible());
 await page.locator('#edit-balls').click();await page.locator('#camera-cue').click();await page.locator('#world').focus();await page.keyboard.press('v');await expect(page.locator('#camera-top')).toHaveAttribute('aria-pressed','true');check('V camera switch',true);
 await page.locator('#menu').click();await page.locator('#auto-camera').uncheck();await page.locator('#quality').selectOption('low');await page.locator('#sound-setting').check();await page.locator('#resume').click();await page.reload();await page.waitForFunction(()=>!!window.__THREE_GAME_DIAGNOSTICS__);await page.locator('#menu').click();check('Settings persist after reload',!(await page.locator('#auto-camera').isChecked())&&await page.locator('#quality').inputValue()==='low');await page.locator('#resume').click();
 await page.locator('#history').click();check('Completed matches are stored',await page.locator('.history-entry').count()>=3);await closeAll(page);await context.close();

 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,recordVideo:{dir:out,size:{width:390,height:844}}});const phone=await mobile.newPage();bind(phone);await phone.goto(url);await phone.waitForFunction(()=>!!window.__THREE_GAME_DIAGNOSTICS__);
 await phone.locator('[data-discipline=eight-ball]').tap();await phone.locator('[data-mode=local]').tap();await phone.screenshot({path:path.join(out,'mobile-menu.png')});await phone.locator('#start').tap();check('Pool has sixteen correctly configured balls and six pockets',(await diag(phone)).physics.balls===16&&(await diag(phone)).renderer.pockets===6);
 check('Ball in hand starts before break',(await diag(phone)).gameState==='placing');await phone.locator('#confirm-placement').tap();check('Valid initial pool placement accepted',(await diag(phone)).gameState==='aiming'&&!(await diag(phone)).match.ballInHand);
 await phone.screenshot({path:path.join(out,'mobile-pool.png')});
 await phone.locator('#shoot').tap();await phone.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.power>.36);check('Touch starts swinging gauge without accidental shot',(await diag(phone)).shotCount===0);await phone.locator('#shoot').tap();await phone.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.gameState==='moving');check('Second touch actually shoots',!(await diag(phone)).physics.settled);await done(phone);
 if((await diag(phone)).gameState==='choosing'){const options=phone.locator('#choice-controls button');await options.first().tap();check('WPA break choice is actionable',true);}
 const data=await fixture(phone,'eight-ball');await phone.locator('#called-ball').selectOption(data.finalShot.input.calledBall);await phone.locator('#called-pocket').selectOption(data.finalShot.input.calledPocket);
 for(const [width,height] of [[360,740],[390,844],[768,1024],[844,390],[1366,768]]){await phone.setViewportSize({width,height});await phone.waitForTimeout(250);check(`${width}x${height} primary shot fits`,await phone.locator('#shoot').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+1&&r.right<=innerWidth&&r.left>=0&&document.documentElement.scrollWidth<=innerWidth;}));await phone.screenshot({path:path.join(out,`layout-${width}x${height}.png`)});}
 await phone.setViewportSize({width:390,height:844});await phone.locator('#open-record').tap();await expect(phone.locator('#record-dialog')).toBeVisible();check('Mobile record dialog reachable',true);await phone.locator('#record-done').tap();
 await phone.goto(url.replace('?qa=1',''));await expect(phone.locator('#start')).toBeVisible();check('Normal entry exposes no QA hooks',await phone.evaluate(()=>!window.__THREE_GAME_TEST_HOOKS__&&!window.__THREE_GAME_DIAGNOSTICS__));await mobile.close();
 check('No page, console, HTTP errors',errors.length===0);check('No server/account writes',requests.length===0);
 await writeFile(path.join(out,'result.json'),JSON.stringify({url,checks,errors,requests,observations,limits:'Desktop browser and touch-emulated phone; this run does not establish physical-phone performance. Result fixtures come from complete physical initial-layout bot matches.'},null,2));console.log(`${checks.length} checks passed`);
}catch(error){await writeFile(path.join(out,'failure.json'),JSON.stringify({checks,errors,error:String(error)},null,2));throw error;}finally{await browser.close();}
