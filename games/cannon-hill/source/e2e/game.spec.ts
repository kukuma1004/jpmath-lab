import { expect, test, type Page } from '@playwright/test';

type State = {
  phase: string; current: number; turnNo: number; winner: number | null; hp: number[]; shots: number[];
  controllers: string[]; projectiles: number;
};

const state = (page: Page) => page.evaluate(() => (window as unknown as { __wr: { state(): State } }).__wr.state());
const wr = (page: Page, code: string) => page.evaluate(code);

async function openBattle(page: Page, mode: 'ai' | 'local', chars?: [string, string], map?: string) {
  await page.goto('./?qa=1');
  await expect(page.locator('[data-s=title]')).toHaveClass(/on/, { timeout: 20_000 });
  await page.getByRole('button', { name: mode === 'ai' ? /AI와 겨루기/ : /둘이서 하기/ }).click();
  const chars$ = page.locator('[data-s=chars]');
  await expect(chars$).toHaveClass(/on/);
  if (chars) await chars$.locator(`.card[data-id=${chars[0]}]`).click();
  await chars$.getByRole('button', { name: /이 장수로/ }).click();
  if (chars) await chars$.locator(`.card[data-id=${chars[1]}]`).click();
  await chars$.getByRole('button', { name: /전장 고르기/ }).click();
  const maps$ = page.locator('[data-s=maps]');
  await expect(maps$).toHaveClass(/on/);
  if (map) await maps$.locator(`.card[data-id=${map}]`).click();
  await maps$.getByRole('button', { name: /싸움 시작/ }).click();
  await expect(page.locator('[data-s=hud]')).toHaveClass(/on/);
  await page.waitForFunction(() => !!(window as unknown as { __wr?: unknown }).__wr);
  // 그려 받은 그림(장수 몸·무기·전장 배경)을 실제로 불러왔는지. 못 불러오면 코드 그림으로 조용히 바뀌므로 여기서 잡는다
  const art = await page.evaluate(() => {
    const w = (window as unknown as { __wr: { scene: { textures: { exists(k: string): boolean } }; battle: { cfg: { mapId: string }; fighters: { charId: string }[] } } }).__wr;
    const t = w.scene.textures, b = w.battle;
    return {
      body: b.fighters.every((f) => t.exists(`art_char_${f.charId}`)),
      weapon: b.fighters.every((f) => t.exists(`art_wpn_${f.charId}`)),
      bg: t.exists(`art_bg_${b.cfg.mapId}`),
    };
  });
  expect(art).toEqual({ body: true, weapon: true, bg: true });
}

async function waitAim(page: Page, who?: number, timeout = 30_000) {
  await expect.poll(async () => {
    const s = await state(page);
    return s.phase === 'AIM' && (who === undefined || s.current === who);
  }, { timeout }).toBe(true);
}

test('AI 대전: 타이틀 → 장수 → 전장 → 전투, AI가 실제로 쏜다', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await openBattle(page, 'ai');
  await expect(page.locator('.pcard.p1 .nm')).toContainText('나');
  await wr(page, '__wr.speed(3)');
  // 내 차례면 넘기고, AI가 직접 쏠 때까지 기다린다
  await expect.poll(async () => {
    const s = await state(page);
    if (s.phase === 'AIM' && s.current === 0) await wr(page, '__wr.skip()');
    return s.shots[1];
  }, { timeout: 60_000, intervals: [300] }).toBeGreaterThan(0);
  // AI의 포탄이 끝나면 다시 내 차례가 온다
  await waitAim(page, 0, 60_000);
  expect(errors).toEqual([]);
});

test('로컬 대전: 1P 발사 → 2P 발사, 키보드로 턴이 번갈아 바뀐다', async ({ page }) => {
  await openBattle(page, 'local', ['general', 'dokkaebi'], 'sanseong');
  await wr(page, '__wr.speed(2)');
  for (let k = 0; k < 2; k++) {
    await waitAim(page);
    const before = await state(page);
    const who = before.current;
    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(150);
    await page.keyboard.up('ArrowUp');
    await page.keyboard.down('Space');
    await expect.poll(async () => (await state(page)).phase).toBe('CHARGE');
    await page.waitForTimeout(500);
    await page.keyboard.up('Space');
    await expect.poll(async () => (await state(page)).shots[who]).toBe(before.shots[who]! + 1);
    // 다음 사람 차례로
    await expect.poll(async () => {
      const s = await state(page);
      return s.phase === 'AIM' && s.current !== who;
    }, { timeout: 40_000 }).toBe(true);
  }
});

test('게임 끝 → 결과 화면 → 재대전', async ({ page }) => {
  await openBattle(page, 'local', ['archer', 'gumiho'], 'cloud');
  await waitAim(page);
  const s = await state(page);
  const other = 1 - s.current;
  await wr(page, `__wr.kill(${other}); __wr.skip();`);
  const result = page.locator('[data-s=result]');
  await expect(result).toHaveClass(/on/, { timeout: 20_000 });
  await expect(result.locator('h2')).toContainText('승리');
  await expect(result.locator('.table')).toContainText('명중률');
  await result.getByRole('button', { name: '다시 한 판' }).click();
  await expect(result).not.toHaveClass(/on/);
  await expect.poll(async () => {
    const n = await state(page);
    return n.winner === null && n.hp[0] === 1000 && n.hp[1] === 1000 && n.turnNo <= 1 && n.shots[0] === 0;
  }).toBe(true);
  await waitAim(page);
});

for (const vp of [{ name: '가로', width: 844, height: 390 }, { name: '세로', width: 390, height: 844 }]) {
  test(`모바일 ${vp.name} 화면: 조작 단추가 손가락 크기로 화면 안에 있고 누르면 쏜다`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: true, isMobile: true, baseURL: 'http://127.0.0.1:5213/' });
    const page = await ctx.newPage();
    await openBattle(page, 'local', ['mudang', 'turtle'], 'forest');
    await waitAim(page);
    const ids = ['[data-hold=left]', '[data-hold=right]', '[data-hold=aimUp]', '[data-hold=aimDown]', '[data-act=flip]', '[data-hold=charge]', '[data-w="0"]', '[data-w="1"]', '.pausebtn'];
    const boxes = [];
    for (const sel of ids) {
      const b = await page.locator(`[data-s=hud] ${sel}`).boundingBox();
      expect(b, sel).not.toBeNull();
      expect(b!.width, `${sel} 너비`).toBeGreaterThanOrEqual(36);
      expect(b!.height, `${sel} 높이`).toBeGreaterThanOrEqual(36);
      expect(b!.x, `${sel} 왼쪽`).toBeGreaterThanOrEqual(0);
      expect(b!.y, `${sel} 위`).toBeGreaterThanOrEqual(0);
      expect(b!.x + b!.width, `${sel} 오른쪽`).toBeLessThanOrEqual(vp.width + 1);
      expect(b!.y + b!.height, `${sel} 아래`).toBeLessThanOrEqual(vp.height + 1);
      boxes.push({ sel, ...b! });
    }
    // 단추끼리 겹치지 않는다
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i]!, c = boxes[j]!;
      const overlap = a.x < c.x + c.width - 1 && c.x < a.x + a.width - 1 && a.y < c.y + c.height - 1 && c.y < a.y + a.height - 1;
      expect(overlap, `${a.sel} / ${c.sel} 겹침`).toBe(false);
    }
    // 발사 단추를 누르고 있다가 떼면 쏜다
    const s0 = await state(page);
    const fire = page.locator('[data-s=hud] [data-hold=charge]');
    await fire.dispatchEvent('pointerdown', { pointerId: 7, pointerType: 'touch', isPrimary: true });
    await page.waitForTimeout(500);
    await fire.dispatchEvent('pointerup', { pointerId: 7, pointerType: 'touch', isPrimary: true });
    await expect.poll(async () => (await state(page)).shots[s0.current]).toBe(s0.shots[s0.current]! + 1);
    // 문서가 가로로 넘치지 않는다
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    expect(overflow).toBe(false);
    // 판이 끝나면 결과 화면의 단추가 화면 안에 들어온다
    await waitAim(page);
    const s1 = await state(page);
    await wr(page, `__wr.kill(${1 - s1.current}); __wr.skip();`);
    const result = page.locator('[data-s=result]');
    await expect(result).toHaveClass(/on/, { timeout: 20_000 });
    await page.waitForTimeout(700);
    for (const name of ['다시 한 판', '장수 다시 고르기', '처음 화면으로']) {
      const b = await result.getByRole('button', { name }).boundingBox();
      expect(b, name).not.toBeNull();
      expect(b!.y + b!.height, `${name} 아래`).toBeLessThanOrEqual(vp.height + 1);
      expect(b!.y, `${name} 위`).toBeGreaterThanOrEqual(0);
    }
    await page.screenshot({ path: `test-results/mobile-${vp.width}x${vp.height}-result.png` });
    await ctx.close();
  });
}

test('성능: 큰 폭발·붕괴 직후 시뮬레이션과 한 프레임 비용(보통·CPU 4배 감속)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openBattle(page, 'local', ['general', 'turtle'], 'baekdu');
  const out: Record<string, number> = {};
  for (const [label, rate] of [['보통', 1], ['CPU4배감속', 4]] as const) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    await waitAim(page, undefined, 60_000);
    const t0 = await page.evaluate(() => (window as unknown as { __wr: { battle: { time: number } } }).__wr.battle.time);
    await wr(page, '__wr.aimFire(1)');
    await page.waitForFunction((t) => (window as unknown as { __wr: { battle: { lastBlastT: number } } }).__wr.battle.lastBlastT >= t, t0, { polling: 'raf', timeout: 30_000 });
    // 폭발 직후: 시뮬레이션만 30걸음, 그다음 그리기까지 포함한 프레임 30개
    const r = await page.evaluate(() => {
      const w = (window as unknown as { __wr: { battle: { step(): void; chunks: unknown[]; boulders: unknown[] }; frames(n: number): void } }).__wr;
      const bodies = w.battle.chunks.length + w.battle.boulders.length;
      let t = performance.now();
      for (let i = 0; i < 30; i++) w.battle.step();
      const sim = (performance.now() - t) / 30;
      t = performance.now();
      w.frames(30);
      const frame = (performance.now() - t) / 30;
      return { sim, frame, bodies };
    });
    out[`${label}-시뮬1걸음ms`] = r.sim;
    out[`${label}-한프레임ms(소프트웨어 그리기)`] = r.frame;
    out[`${label}-떨어지는물체`] = r.bodies;
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  }
  console.log('PERF', JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Math.round(v * 100) / 100]))));
  // 시뮬레이션은 60fps 한 프레임(16.7ms) 안에서 넉넉해야 한다
  expect(out['보통-시뮬1걸음ms']).toBeLessThan(4);
});
