import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {chromium}=createRequire(path.join(root,'games/cheonroe/source/package.json'))('@playwright/test');
const base=(process.env.CHEONROE_TEST_URL||'http://127.0.0.1:5201/games/cheonroe/').replace(/\/?$/,'/');
const out=path.join(root,'.dream-loop/cheonroe/browser');await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:850},deviceScaleFactor:1});
const page=await context.newPage(),errors=[],checks=[],requests=[];let authImports=0;
const pass=(name,condition)=>{assert(condition,name);checks.push(name);console.log(`PASS ${name}`);};
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const run={hero:'rin',difficulty:'normal',score:45000,durationMs:85000,kills:42,graze:8,cleared:true};
const fixture=(hero,score,nickname)=>({...run,hero,score,nickname,submittedAt:1700000000000});
const boards={'normal:rin':{alpha:fixture('rin',10000,'꽃바람'),beta:fixture('rin',10000,'별바람')},'normal:golem':{gamma:fixture('golem',15000,'철산')},'normal:ryu':{},'story:rin':{story: {...fixture('rin',7000,'수련전사'),difficulty:'story'}},'story:golem':{},'story:ryu':{}};
const cors={'access-control-allow-origin':'*','access-control-expose-headers':'ETag,Date','access-control-allow-methods':'GET,PUT,DELETE,OPTIONS','access-control-allow-headers':'content-type,if-match,x-firebase-etag'};
await page.addInitScript(({run})=>{localStorage.setItem('jp-math-lab:cheonroe:v1:runs',JSON.stringify({'normal:rin':run}));},{run});
await page.route('https://www.gstatic.com/firebasejs/**',async route=>{
 const auth=route.request().url().includes('firebase-auth');if(auth)authImports++;
 const body=auth?`const user={uid:'QA_BROWSER',getIdToken:async()=> 'MOCK_ONLY'};export function getAuth(){return {currentUser:user,authStateReady:async()=>{}}}export async function signInAnonymously(){return {user}}`:`export function getApps(){return []}export function initializeApp(config,name){return {name}}`;
 await route.fulfill({status:200,contentType:'application/javascript',headers:cors,body});
});
await page.route('https://jpmathlab-default-rtdb.asia-southeast1.firebasedatabase.app/cheonroeV1/**',async route=>{
 const request=route.request(),url=new URL(request.url()),parts=url.pathname.split('/').filter(Boolean),mode=parts[2],hero=parts[3]?.replace('.json',''),uid=parts[4]?.replace('.json',''),key=`${mode}:${hero}`;
 if(request.method()==='OPTIONS'){await route.fulfill({status:204,headers:cors});return;}
 requests.push({method:request.method(),mode,hero,uid,auth:url.searchParams.has('auth'),orderBy:url.searchParams.get('orderBy'),limit:url.searchParams.get('limitToLast')});
 const board=boards[key]||{};let data=uid?board[uid]||null:board;
 if(request.method()==='PUT'){assert.equal(request.headers()['if-match'],'"v1"');data={...request.postDataJSON(),submittedAt:Date.now()};board[uid]=data;boards[key]=board;}
 if(request.method()==='DELETE'){delete board[uid];data=null;}
 await route.fulfill({status:200,contentType:'application/json',headers:{...cors,etag:'"v1"',date:new Date().toUTCString()},body:JSON.stringify(data)});
});
await page.goto(base);await page.waitForFunction(()=>!document.querySelector('#start').disabled);
pass('published game loads all artwork under nested path',await page.locator('[data-hero]').count()===3);
await page.click('#open-ranking');await page.waitForFunction(()=>document.querySelector('#rank-rows').children.length===3);
pass('public ranking reads without creating auth account',authImports===0&&requests.every(r=>!r.auth));
pass('all-hero board performs exactly three bounded score queries',requests.length===3&&requests.every(r=>r.orderBy==='"score"'&&r.limit==='100'));
pass('highest score and shared ranks display correctly',(await page.locator('#rank-rows .rank-place').allTextContents()).join(',')==='01,02,02');
pass('stored local best is offered',await page.locator('#rank-best').innerText().then(t=>t.includes('45,000')));
await page.locator('#rank-nickname').fill('<bad>');await page.locator('#rank-submit').click();pass('invalid nickname cannot authenticate or submit',authImports===0&&requests.every(r=>r.method==='GET'));
await page.locator('#rank-nickname').fill('검수전사');await page.locator('#rank-submit').click();await page.waitForFunction(()=>document.querySelector('#rank-status').textContent.includes('등록했어요'));
pass('explicit registration starts independent auth',authImports===1);
pass('registration writes only the scoped own record',requests.filter(r=>r.method==='PUT').length===1&&boards['normal:rin'].QA_BROWSER.score===45000&&boards['normal:rin'].QA_BROWSER.nickname==='검수전사');
pass('owner row is highlighted',await page.locator('#rank-rows .rank-own').count()===1);
await page.locator('#rank-submit').click();await page.waitForFunction(()=>document.querySelector('#rank-status').textContent.includes('기존 점수'));
pass('repeat equal record keeps existing run without another write',requests.filter(r=>r.method==='PUT').length===1);
await page.selectOption('#rank-hero','rin');await page.waitForFunction(()=>document.querySelector('#rank-rows').children.length===3);await page.click('#rank-delete');await page.waitForFunction(()=>document.querySelector('#rank-status').textContent.includes('삭제했어요'));
pass('delete removes only own selected board record',!boards['normal:rin'].QA_BROWSER&&Object.keys(boards['normal:rin']).length===2&&boards['normal:golem'].gamma.score===15000);
await page.selectOption('#rank-difficulty','story');await page.waitForFunction(()=>document.querySelector('#rank-rows').children.length===1);
pass('difficulty filter isolates story board',await page.locator('#rank-rows').innerText().then(t=>t.includes('수련전사')&&!t.includes('철산')));
await page.click('[data-rank-scope=local]');pass('local board keeps arcade records separate',await page.locator('#rank-table').isHidden());
await page.selectOption('#rank-difficulty','normal');await page.waitForTimeout(100);pass('public deletion preserves local best',await page.locator('#rank-rows').innerText().then(t=>t.includes('45,000')));
await page.click('[data-rank-scope=online]');await page.waitForFunction(()=>document.querySelector('#rank-rows').children.length===2);
await page.screenshot({path:path.join(out,'ranking-desktop.png'),fullPage:true});
for(const width of [390,320]){await page.setViewportSize({width,height:844});await page.waitForTimeout(100);pass(`ranking layout fits ${width}px`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.querySelector('#ranking-dialog').scrollWidth<=document.querySelector('#ranking-dialog').clientWidth+1));await page.screenshot({path:path.join(out,`ranking-${width}.png`),fullPage:true});}
await page.click('#rank-close');await page.setViewportSize({width:1280,height:850});await page.click('#start');await page.waitForTimeout(300);await page.keyboard.down('ArrowRight');await page.waitForTimeout(300);await page.keyboard.up('ArrowRight');await page.keyboard.press('KeyX');await page.waitForTimeout(160);await page.click('#open-ranking');
pass('ranking pauses live game',await page.locator('#result-title').innerText()==='멈춘 시간.');await page.click('#rank-close');pass('closing ranking resumes live game',await page.locator('#overlay').isHidden());
await page.keyboard.press('KeyP');await page.click('#return');
await page.goto(`${base}?qa=1`);await page.waitForFunction(()=>!!window.__THREE_GAME_TEST_HOOKS__);await page.evaluate(()=>window.__THREE_GAME_TEST_HOOKS__.setState('gameover'));await page.click('#result-ranking');await page.waitForTimeout(100);
pass('result screen opens ranking',await page.locator('#ranking-dialog').isVisible());pass('QA mode never enables publishing',await page.locator('#rank-submit').isDisabled());
await page.screenshot({path:path.join(out,'result-ranking.png'),fullPage:true});
await page.goto(new URL('../',base).href);await page.locator('#cheonroe-title').waitFor();pass('game hub contains live Cheonroe entry',await page.locator('.cheonroe-card .play-button').getAttribute('href')==='cheonroe/');pass('existing game cards remain',await page.locator('.game-card').count()===6);await page.screenshot({path:path.join(out,'hub-desktop.png'),fullPage:true});
for(const width of [390,320]){await page.setViewportSize({width,height:844});await page.waitForTimeout(100);pass(`hub layout fits ${width}px`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(out,`hub-${width}.png`),fullPage:true});}
await page.click('.cheonroe-card .play-button');await page.waitForFunction(()=>document.querySelector('#start')?.disabled===false);pass('gallery card opens working game',await page.locator('#open-ranking').isVisible());
pass('no browser runtime or console errors',errors.length===0);
await writeFile(path.join(out,'results.json'),JSON.stringify({checks:checks.length,passed:checks.length,names:checks,errors,notes:['Public REST and SDK calls intercepted with isolated fictional fixtures. No production writes.','Real keyboard/browser UI events used; mobile viewports emulated.']},null,2));
await browser.close();console.log(`${checks.length} integration checks passed`);
