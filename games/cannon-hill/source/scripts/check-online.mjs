import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { chromium } from '@playwright/test';

const data = await mkdtemp(join(tmpdir(),'warureu-online-'));
let url;
const spawnServer = () => spawn(process.execPath,['online-dist/server.mjs'],{
  env:{...process.env,PORT:'0',WARUREU_HOST:'127.0.0.1',WARUREU_DATA_DIR:data},stdio:['ignore','pipe','inherit'],
});
let server = spawnServer();
const sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));
const password = 'online-test-2026';
let browser;
async function battle(page) {
  await page.waitForFunction(()=>window.__wr?.battle.isPlayerPhase());
  return page.evaluate(()=>({
    current:window.__wr.battle.current, turn:window.__wr.battle.turnNo,
    map:window.__wr.battle.cfg.mapId, poses:window.__wr.battle.fighters.map(f=>[f.x,f.y,f.hp]),
  }));
}
async function account(page,id,nickname) {
  await page.goto(url+'?qa=1');
  await page.getByRole('button',{name:/온라인 1:1/}).click();
  await page.getByRole('button',{name:'계정 만들기'}).click();
  await page.getByLabel('아이디').fill(id);
  await page.getByLabel('비밀번호').fill(password);
  await page.getByLabel('닉네임').fill(nickname);
  await page.getByRole('button',{name:'가입하고 시작'}).click();
  await page.getByRole('button',{name:'방 만들기'}).waitFor();
}
async function openLobby(page) {
  await page.getByRole('button',{name:'온라인 대기실'}).click();
  await page.getByRole('button',{name:'상대 찾기'}).waitFor();
}
async function forfeit(page) {
  page.once('dialog',dialog=>dialog.accept());
  await page.locator('.pausebtn').click();
  await page.getByRole('button',{name:'처음 화면으로'}).click();
  await page.getByRole('button',{name:/온라인 1:1/}).waitFor();
}
async function ready() {
  const lines=createInterface({input:server.stdout});
  for await (const line of lines) {
    const address=line.match(/http:\/\/127\.0\.0\.1:\d+\//)?.[0];
    if(address) {
      url=address;
      assert.equal((await fetch(url+'api/warureu/v1/health')).status,200);
      return;
    }
  }
  throw new Error('온라인 서버가 열리지 않았어요.');
}
async function stop() {
  if(server.exitCode!==null || server.signalCode!==null) return;
  const ended = new Promise(resolve=>server.once('exit',resolve));
  if(server.kill()) await ended;
}
try {
  await ready();
  browser=await chromium.launch({executablePath:process.env.PW_CHROME || undefined});
  const aContext=await browser.newContext({viewport:{width:1440,height:900}});
  const bContext=await browser.newContext({viewport:{width:430,height:760},isMobile:true,hasTouch:true});
  const [a,b]=await Promise.all([aContext.newPage(),bContext.newPage()]);
  const errors=[];
  for(const page of [a,b]) page.on('pageerror',error=>errors.push(error.message));
  await Promise.all([account(a,'warureu_test_a','산들'),account(b,'warureu_test_b','가람')]);
  await a.getByLabel('전장').selectOption('quarry');
  await a.getByRole('button',{name:'방 만들기'}).click();
  const code=await a.locator('[data-code]').filter({hasText:/^[A-Z2-9]{6}$/}).innerText();
  await b.getByLabel('방 코드').fill(code.toLowerCase());
  await b.getByRole('button',{name:'방 참가'}).click();
  const start=await battle(a);
  assert.deepEqual(await battle(b),start);
  const [shot,watcher]=start.current===0?[a,b]:[b,a];
  await watcher.keyboard.press('Space');
  await sleep(250);
  assert.equal((await battle(shot)).turn,start.turn);
  assert.equal(await shot.evaluate(()=>window.__wr.battle.cur.stats.shots),0);
  const fire=shot.getByRole('button',{name:'힘 모아 발사'});
  await fire.click();
  await watcher.waitForFunction(()=>window.__wr?.battle.phase==='CHARGE');
  await sleep(700);
  await fire.click();
  await watcher.waitForFunction(()=>window.__wr?.battle.projectiles.length>0);
  for(const page of [a,b]) await page.waitForFunction(()=>window.__wr?.battle.turnNo>1 && window.__wr.battle.isPlayerPhase());
  const getHash=page=>page.evaluate(()=>window.__wr.battle.hash());
  assert.equal(await getHash(a),await getHash(b));

  await bContext.setOffline(true);
  await a.locator('.status').getByText(/상대의 재접속/).waitFor({timeout:10_000});
  await bContext.setOffline(false);
  await b.reload();
  await b.getByRole('button',{name:/온라인 1:1/}).click();
  await battle(b);
  assert.equal(await getHash(a),await getHash(b));
  await forfeit(b);
  await a.getByRole('heading',{name:'승리!'}).waitFor();
  assert.equal(await a.locator('.online-rating').count(),0);
  await openLobby(a);
  await b.getByRole('button',{name:/온라인 1:1/}).click();
  await a.getByRole('button',{name:'상대 찾기'}).click();
  await a.getByText('랭킹전 상대를 기다리는 중').waitFor();
  await b.getByRole('button',{name:'상대 찾기'}).click();
  await Promise.all([battle(a),battle(b)]);
  await forfeit(b);
  await a.locator('.online-rating').getByText(/1000 → 1016 \(\+16\)/).waitFor();
  await openLobby(a);
  await a.getByRole('button',{name:'누적 순위'}).click();
  await a.locator('.online-board li').first().waitFor();
  assert.match(await a.locator('.online-board').innerText(),/산들 · 1016점 · 1승[\s\S]*가람 · 984점 · 0승 0무 1패/);
  await a.getByRole('button',{name:'로그아웃'}).click();
  await a.getByLabel('아이디').fill('warureu_test_a');
  await a.getByLabel('비밀번호').fill(password);
  await a.getByRole('button',{name:'로그인',exact:true}).click();
  await a.getByText('산들 · 1016점',{exact:true}).waitFor();
  const nextDevice=await bContext.newPage();
  await nextDevice.goto(url);
  await nextDevice.getByRole('button',{name:/온라인 1:1/}).click();
  await nextDevice.getByText('가람 · 984점',{exact:true}).waitFor();

  await stop();
  server=spawnServer();
  await ready();
  const restarted=await aContext.newPage();
  await restarted.goto(url);
  await restarted.getByRole('button',{name:/온라인 1:1/}).click();
  await restarted.getByLabel('아이디').fill('warureu_test_a');
  await restarted.getByLabel('비밀번호').fill(password);
  await restarted.getByRole('button',{name:'로그인',exact:true}).click();
  await restarted.getByText('산들 · 1016점',{exact:true}).waitFor();
  assert.deepEqual(errors,[]);
  console.log('두 브라우저에서 가입, 친선전, 발사·턴 동기화, 재접속, 공개 매칭, 서버 점수, 재로그인과 서버 재시작 뒤 순위 보존 확인');
} finally {
  await browser?.close();
  await stop();
  await rm(data,{recursive:true,force:true});
}
