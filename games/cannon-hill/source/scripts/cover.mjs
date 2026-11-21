// 게임 목록 표지: 실제 플레이 화면을 1200×800으로 찍는다(개발 서버 5212가 떠 있어야 함)
import { chromium } from '@playwright/test';
import { join } from 'node:path';
const exe = join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium_headless_shell-1243', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
const out = process.argv[2] ?? 'cover.png';
const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
await page.goto('http://127.0.0.1:5212/?qa=1');
await page.waitForFunction(() => window.__app && document.querySelector('[data-s=title].on'));
await page.waitForTimeout(800);
await page.evaluate(async () => {
  window.__app.startBattle('local', ['gumiho', 'general'], 'cloud');
  await new Promise((r) => setTimeout(r, 600));
  const w = window.__wr;
  const until = (fn, max = 4000) => { let n = 0; while (!fn() && n < max) { w.frames(4); n += 4; } };
  until(() => w.state().phase === 'AIM');
  if (w.state().current !== 0) { w.skip(); until(() => w.state().phase === 'AIM'); }
  w.battle.wind = 3;
  w.aimFire(1);
  // 장수 그림이 보이도록 쏜 사람 가까이에서, 포탄이 막 날아오를 때
  const me = w.battle.fighters[0];
  // 여우불이 다섯 갈래로 갈라진 직후, 쏜 사람과 함께 보이게
  until(() => w.battle.projectiles.length >= 5, 900);
  const pr = w.battle.projectiles[0];
  w.look((me.x + pr.x) / 2 + 40, Math.min(me.y - 120, (me.y + pr.y) / 2 + 60), 0.85);
  w.frames(1);
  document.getElementById('ui').style.display = 'none';
  w.frames(2);
});
await page.waitForTimeout(300);
await page.screenshot({ path: out });
await browser.close();
console.log('saved', out);
