import{launchBrowser}from'./browser.mjs';
import{mkdir,readFile,writeFile}from'node:fs/promises';
import path from'node:path';
const url=process.env.BILLIARDS_URL??'http://127.0.0.1:5196/games/billiards/?qa=1';
const out=path.resolve(process.env.BILLIARDS_EVIDENCE??'../.dream-loop/usability/round1');await mkdir(out,{recursive:true});
const browser=await launchBrowser(),checks=[],failures=[],errors=[],observations=[];
const check=(name,ok,data)=>{(ok?checks:failures).push({name,...(data?{data}:{})});console.log(`${ok?'PASS':'FAIL'} ${name}`);};
const diag=p=>p.evaluate(()=>window.__THREE_GAME_DIAGNOSTICS__);
const bind=p=>{p.setDefaultTimeout(12000);p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});};
const reset=async(p,config={discipline:'four-ball',mode:'practice'})=>{await p.evaluate(c=>{const h=window.__THREE_GAME_TEST_HOOKS__;for(const d of document.querySelectorAll('dialog[open]'))d.close();h.newMatch(c);h.freezeAI(true);},config);await p.waitForTimeout(300);};
try{
 const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),p=await c.newPage();bind(p);await p.goto(url);await p.waitForFunction(()=>!!window.__THREE_GAME_DIAGNOSTICS__);await reset(p);
 const cdp=await c.newCDPSession(p),touch=(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(q=>({...q,radiusX:3,radiusY:3,force:1}))});
 let box=await p.locator('#world').boundingBox(),x=box.x+box.width*.5,y=box.y+box.height*.5;
 const before=await diag(p);
 await touch('touchStart',[{id:1,x:x-30,y},{id:2,x:x+30,y}]);await touch('touchMove',[{id:1,x:x-55,y},{id:2,x:x+55,y}]);await touch('touchEnd',[{id:2,x:x+55,y}]);await touch('touchMove',[{id:2,x:x+75,y}]);await touch('touchEnd',[]);const after=await diag(p);
 check('Pinch with staggered release preserves aim',Math.abs(after.angle-before.angle)<1e-9,{before:before.angle,after:after.angle});
 check('Pinch actually changes zoom',Math.abs(after.renderer.zoom-before.renderer.zoom)>.01);check('Pinch cannot fire',after.shotCount===0);
 await touch('touchStart',[{id:1,x,y}]);await touch('touchCancel',[]);const afterCancel=(await diag(p)).angle;await touch('touchStart',[{id:1,x,y}]);await touch('touchMove',[{id:1,x:x+25,y}]);await touch('touchEnd',[]);check('Canceled touch does not leave aiming stuck',Math.abs((await diag(p)).angle-afterCancel)>.05);
 // Chromium suppresses synthetic clicks briefly after CDP touch gestures.
 await p.waitForTimeout(1600);await p.locator('#reset-camera').tap();await p.waitForTimeout(300);
 const fine=await p.locator('#aim-left,#aim-right').evaluateAll(els=>els.map(e=>{const r=e.getBoundingClientRect();return{id:e.id,visible:!!e.getClientRects().length,width:r.width,height:r.height};}));
 check('Fine aim is visible without opening details',fine.length===2&&fine.every(e=>e.visible));check('Fine aim has 44px targets',fine.every(e=>e.width>=44&&e.height>=44),fine);
 if(fine.every(e=>e.visible)){const beforeFine=await diag(p);await p.locator('#aim-right').tap();check('Fine aim changes physical shot input',(await diag(p)).angle!==beforeFine.angle);check('Fine aim preserves selected camera and zoom',(await diag(p)).cameraMode===beforeFine.cameraMode&&(await diag(p)).renderer.zoom===beforeFine.renderer.zoom);}
 await p.locator('#camera-top').tap();await p.waitForTimeout(1000);
 await p.screenshot({path:path.join(out,'mobile.png')});
 const shotBox=await p.locator('#shoot').boundingBox();await p.locator('#shoot').tap();await p.waitForTimeout(350);const charging=await diag(p),chargingBox=await p.locator('#shoot').boundingBox();
 check('First press charges without physics motion',charging.gameState==='charging'&&charging.shotCount===0&&charging.physics.settled);
 check('Second press target stays under same finger',shotBox&&chargingBox&&Math.abs(shotBox.y-chargingBox.y)<2&&Math.abs(shotBox.x-chargingBox.x)<2,{before:shotBox,charging:chargingBox});
 await p.screenshot({path:path.join(out,'mobile-charging.png')});await p.locator('#cancel-charge').tap();check('Cancel never starts a shot',(await diag(p)).shotCount===0);
 await p.locator('#camera-top').tap();await p.locator('#collapse').tap();await p.waitForTimeout(1000);await p.screenshot({path:path.join(out,'mobile-expanded.png')});
 for(const [width,height]of[[360,740],[390,844],[768,1024],[844,390],[1366,768]]){
  await p.setViewportSize({width,height});await p.waitForTimeout(300);
  const layout=await p.evaluate(()=>{const r=document.querySelector('#shoot').getBoundingClientRect(),c=document.querySelector('#world').getBoundingClientRect(),score=document.querySelector('.scoreboard').getBoundingClientRect(),status=document.querySelector('.game-status').getBoundingClientRect();return{shot:r.toJSON(),canvas:c.toJSON(),score:score.toJSON(),status:status.toJSON(),pageWidth:document.documentElement.scrollWidth,width:innerWidth,height:innerHeight};});
  check(`${width}x${height} expanded primary control fits`,layout.shot.top>=0&&layout.shot.bottom<=height+1&&layout.pageWidth<=width&&layout.canvas.height>=120,layout);
  check(`${width}x${height} score and status do not overlap`,layout.score.bottom<=layout.status.top+1,layout);
 }
 await p.setViewportSize({width:390,height:844});if(await p.locator('#collapse').getAttribute('aria-expanded')==='true')await p.locator('#collapse').tap();
 await reset(p,{discipline:'eight-ball',mode:'local'});await p.screenshot({path:path.join(out,'mobile-placement.png')});await p.locator('#confirm-placement').tap();check('Pool placement can be confirmed on touch',(await diag(p)).gameState==='aiming');
 const sameSpot=await p.locator('#shoot').boundingBox(),sx=sameSpot.x+sameSpot.width/2,sy=sameSpot.y+sameSpot.height/2;
 await p.touchscreen.tap(sx,sy);await p.waitForTimeout(400);await p.touchscreen.tap(sx,sy);await p.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.gameState==='moving');check('Second touch at identical coordinates launches a physical shot',!(await diag(p)).physics.settled&&(await diag(p)).shotCount===1);
 const fixture=JSON.parse(await readFile(new URL('../../artifacts/bot-matches/eight-ball.json',import.meta.url),'utf8'));
 await p.evaluate(data=>{const h=window.__THREE_GAME_TEST_HOOKS__;h.newMatch(data.config);h.freezeAI(true);h.setMatch(data.finalTurnState);h.fixture(data.finalShot.before.balls,data.finalShot.input);},fixture);
 await p.locator('#called-ball').selectOption('');await p.locator('#called-pocket').selectOption('');await p.locator('#shoot').tap();check('Pool call warning prevents accidental charge',(await diag(p)).gameState==='aiming');
 await p.locator('#called-ball').selectOption(fixture.finalShot.input.calledBall);await p.locator('#called-pocket').selectOption(fixture.finalShot.input.calledPocket);await p.waitForTimeout(600);await p.screenshot({path:path.join(out,'mobile-pool-calls.png')});
 check('Pool calls and shot fit portrait viewport',await p.locator('#shoot').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight+1)&&await p.locator('#called-pocket').isVisible());
 await p.setViewportSize({width:844,height:390});await p.waitForTimeout(400);await p.screenshot({path:path.join(out,'landscape-pool-calls.png')});check('Landscape pool calls keep strike reachable',await p.locator('#shoot').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight+1;}));
 await c.close();
 const desktop=await browser.newContext({viewport:{width:1440,height:900}}),d=await desktop.newPage();bind(d);await d.goto(url);await d.waitForFunction(()=>!!window.__THREE_GAME_DIAGNOSTICS__);await reset(d);await d.screenshot({path:path.join(out,'desktop.png')});
 await d.locator('#camera-top').click();await d.locator('#world').focus();const angle=(await diag(d)).angle;await d.keyboard.press('ArrowRight');check('Keyboard fine aim works',(await diag(d)).angle!==angle);
 await d.keyboard.press('Space');await d.waitForTimeout(300);check('Space starts meter',(await diag(d)).gameState==='charging');await d.keyboard.press('Escape');check('Escape cancels charging without firing',(await diag(d)).gameState==='aiming'&&(await diag(d)).shotCount===0);
 await d.keyboard.press('Space');await d.waitForTimeout(250);await d.keyboard.press('Space');await d.waitForFunction(()=>window.__THREE_GAME_DIAGNOSTICS__.gameState==='moving');await d.keyboard.press('Space');check('Duplicate input while moving is blocked',(await diag(d)).shotCount===1);
 await reset(d,{discipline:'four-ball',mode:'ai'});await d.evaluate(()=>window.__THREE_GAME_TEST_HOOKS__.setMatch({currentPlayer:1}));const aiAngle=(await diag(d)).angle;await d.locator('#world').focus();await d.keyboard.press('ArrowRight');await d.keyboard.press('Space');check('Human input blocked on AI turn',(await diag(d)).angle===aiAngle&&(await diag(d)).shotCount===0&&await d.locator('#shoot').isDisabled());
 observations.push({renderer:(await diag(d)).renderer.renderer,limits:'Real browser pointer/key/touch input in touch emulation. Not a physical phone or human usability study.'});await desktop.close();
 check('No page or console errors',errors.length===0,errors);await writeFile(path.join(out,'result.json'),JSON.stringify({url,checks,failures,errors,observations},null,2));if(failures.length)process.exitCode=1;
}catch(error){await writeFile(path.join(out,'error.json'),JSON.stringify({checks,failures,errors,error:String(error)},null,2));throw error;}finally{await browser.close();}
