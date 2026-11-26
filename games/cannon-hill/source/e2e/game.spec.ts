import { expect, test, type Page } from '@playwright/test';
import { MAX_LAUNCH_SPEED } from '../src/game/config/constants';

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
      weapon: b.fighters.every((f) => t.exists(`art_wpn_${f.charId}`) || (['hwacha','alchemist','driller'].includes(f.charId) && t.exists(`wpn_${f.charId}`))),
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

test('낮은 둔턱은 이동 키로 넘고 경사에서 실제 발사각을 보여준다', async ({page}) => {
  await openBattle(page, 'local', ['general', 'archer'], 'quarry');
  await waitAim(page);
  await wr(page, `(() => {
    const b = __wr.battle;
    b.current=0; b.phase='AIM'; b.timeLeft=30; b.wind=0;
    const f=b.cur;
    for (let x=470;x<650;x+=2) {
      let height = x<500 ? 900 : 880;
      if (x>=530) height -= Math.floor((x-530)/8)*2;
      for (let y=380;y<920;y+=2) b.terrain.set(x/2,y/2,y<height?0:2);
    }
    f.x=491; f.y=900; f.onGround=true; f.airPeakY=900; f.angle=45;
  })()`);
  await page.keyboard.down('d');
  await page.waitForFunction(() => (window as any).__wr.battle.cur.x >= 558, undefined, {polling:'raf'});
  await page.keyboard.up('d');
  const hud = page.locator('[data-s=hud]');
  await expect(hud.locator('.angle-read small')).toHaveText(/발사 →\d+°/);
  expect(await wr(page, '__wr.battle.cur.y')).toBeLessThan(880);
  const launchAngle = await wr(page, '__wr.battle.launchAngle(__wr.battle.cur)');
  expect(launchAngle).toBeGreaterThan(55);
  await page.keyboard.down('Space');
  await page.waitForFunction(() => (window as any).__wr.battle.cur.power >= 40, undefined, {polling:'raf'});
  await page.keyboard.up('Space');
  await expect.poll(() => wr(page, '__wr.battle.projectiles.length')).toBe(1);
  const { power, vx } = await wr(page, '({power: __wr.battle.cur.lastPower, vx: __wr.battle.projectiles[0].vx})');
  // Wind is zero, so waiting a frame to read the projectile cannot change its horizontal speed.
  expect(vx).toBeCloseTo(MAX_LAUNCH_SPEED * power / 100 * Math.cos(launchAngle * Math.PI / 180), 5);
});

test('힘 막대와 미세 조정 단추로 고른 소수점 힘 그대로 발사한다', async ({page}) => {
  await openBattle(page, 'local', ['general', 'archer'], 'quarry');
  await waitAim(page);
  const hud = page.locator('[data-s=hud]');
  const power = hud.getByRole('slider', { name: '발사 힘 직접 설정' });
  await power.focus();
  await power.press('ArrowRight');
  await hud.getByRole('button', { name: '힘 0.1 높이기' }).click();
  await expect(hud.locator('.power span')).toHaveText('힘 70.2');
  await hud.getByRole('button', { name: '설정한 힘으로 발사' }).click();
  expect(await wr(page, '__wr.battle.cur.lastPower')).toBeCloseTo(70.2, 8);
  expect(await wr(page, '__wr.battle.cur.stats.shots')).toBe(1);
});

test('바로 한 판: 선공으로 직접 쏘고 지난 포격을 본 뒤 같은 방식으로 재대전한다', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('jpml.warureu.settings.v1', JSON.stringify({difficulty:'hard', turnTime:20, turnLimit:30, battleRules:2})));
  await page.goto('./?qa=1');
  const title = page.locator('[data-s=title]');
  await expect(title).toHaveClass(/on/);
  await title.getByRole('button', {name:/바로 한 판/}).click();
  await waitAim(page, 0);
  const cfg = await wr(page, '__wr.battle.cfg');
  expect(cfg).toMatchObject({difficulty:'easy', turnLimit:0, turnTime:45, starterMatch:true});
  expect(await wr(page, '__wr.battle.wind')).toBe(0);
  expect(await wr(page, 'JSON.parse(localStorage.getItem("jpml.warureu.settings.v1")).difficulty')).toBe('hard');
  const hud = page.locator('[data-s=hud]');
  await expect(hud.locator('.power .suggested')).toBeVisible();
  const shots = (await state(page)).shots[0];
  await page.keyboard.down('Space');
  await expect.poll(async () => (await state(page)).phase).toBe('CHARGE');
  await page.waitForTimeout(450);
  await page.keyboard.up('Space');
  await expect.poll(async () => (await state(page)).shots[0]).toBe(shots + 1);
  await waitAim(page, 0, 45000);
  await expect(hud.locator('.status')).toHaveText(/지난 포격 [←→]\d+° · 힘 \d+ · 바람 잔잔/);
  await wr(page, '__wr.kill(1); __wr.skip()');
  const result = page.locator('[data-s=result]');
  await expect(result.getByRole('heading', {name:'승리!'})).toBeVisible();
  await result.getByRole('button', {name:'다시 한 판'}).click();
  await waitAim(page, 0);
  expect(await wr(page, '__wr.battle.cfg.starterMatch')).toBe(true);
  expect((await state(page)).shots).toEqual([0,0]);
  await expect(hud.locator('.status')).not.toContainText('지난 포격');
});

test('조준 도움: 정확한 값 대신 각도·힘 범위와 힘 게이지 띠를 보여준다',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await openBattle(page,'local',['driller','archer'],'bridge');await waitAim(page);
  const initialAngle=await wr(page,'__wr.battle.cur.angle');
  const hud=page.locator('[data-s=hud]'),angle=hud.locator('.angle-hint'),power=hud.locator('.power-hint'),band=hud.locator('.power .suggested');
  await expect(angle).toHaveText(/[←→] 추천 각도 \d+~\d+°/);await expect(power).toHaveText(/추천 힘 \d+~\d+/);await expect(band).toBeVisible();
  const angles=(await angle.innerText()).match(/(\d+)~(\d+)/)!;expect(Number(angles[2])-Number(angles[1])).toBe(10);
  const powers=(await power.innerText()).match(/(\d+)~(\d+)/)!;expect(Number(powers[2])-Number(powers[1])).toBe(15);
  expect(await wr(page,'__wr.battle.cur.angle')).toBe(initialAngle);expect(await wr(page,'__wr.battle.cur.stats.shots')).toBe(0);
  await page.keyboard.press('2');await expect(band).toHaveAttribute('data-slot','1');await expect(band).toBeVisible();
  await wr(page,'__wr.scene.app.settings.aimHints=false');await expect(band).toBeHidden();await expect(angle).toHaveText('각도');
  await wr(page,'__wr.scene.app.settings.aimHints=true');await expect(band).toBeVisible();expect(errors).toEqual([]);
});

test('조준 도움은 AI 차례에는 표시하지 않는다',async({page})=>{
  await openBattle(page,'ai',['general','archer'],'bridge');
  await wr(page,"__wr.scene.paused=true;__wr.battle.current=0;__wr.battle.phase='AIM';__wr.battle.timeLeft=30;");
  const band=page.locator('[data-s=hud] .power .suggested');await expect(band).toBeVisible();
  await wr(page,'__wr.battle.current=1');await expect(band).toBeHidden();await expect(page.locator('[data-s=hud] .angle-hint')).toHaveText('각도');
});

for(const teamSize of [1,2])test(`무작위 ${teamSize}:${teamSize} 배치는 같은 높이의 좌우 거울 위치다`,async({page})=>{
  if(teamSize===1)await openBattle(page,'local',['driller','mudang'],'bridge');
  else await openTeamBattle(page,['driller','mudang','general','alchemist'],'quarry');
  await waitAim(page);
  const points=await page.evaluate(()=>(window as any).__wr.battle.fighters.map((f:any)=>({x:f.x,y:f.y,onGround:f.onGround})));
  for(let i=0;i<points.length;i+=2){expect(points[i].x+points[i+1].x).toBe(2400);expect(points[i].y).toBe(points[i+1].y);expect(points[i].onGround&&points[i+1].onGround).toBe(true);}
  if(teamSize===2)expect(Math.abs(points[0].x-points[2].x)).toBe(Math.abs(points[1].x-points[3].x));
});

test('굴착대장: 전용 몸·회전 드릴을 불러오고 실제 땅속 굴착이 보인다',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await openBattle(page,'local',['driller','mudang'],'quarry');await waitAim(page);
  await wr(page,`const b=__wr.battle;b.current=0;b.phase='AIM';b.timeLeft=30;b.wind=0;for(const [i,x] of [300,2100].entries()){const f=b.fighters[i];f.x=x;f.y=b.terrain.topSurface(x);f.airPeakY=f.y;f.vx=f.vy=0;f.onGround=true;} __wr.fire(45,42,0);`);
  await page.waitForFunction(()=> (window as any).__wr.battle.projectiles.some((p:any)=>p.drilling),undefined,{polling:'raf'});
  expect(await wr(page,`__wr.scene.textures.exists('proj_drill')`)).toBe(true);
  await page.waitForFunction(()=> (window as any).__wr.battle.fighters[0].stats.cellsDestroyed>100,undefined,{polling:'raf'});
  await page.screenshot({path:'test-results/driller-quarry.png'});
  await waitAim(page,1,20_000);expect(errors).toEqual([]);
});

test('굴착대장: 2번 철편을 선택하면 세 갈래가 나가 옆탄으로 명중한다', async ({page}) => {
  await openBattle(page, 'local', ['driller', 'archer'], 'forest');
  await waitAim(page);
  await wr(page, `(() => {
    const {scene, battle} = __wr;
    scene.scene.restart({cfg:{...battle.cfg, seed:27, starterMatch:true}, mode:'local'});
  })()`);
  await page.waitForFunction(() => (window as any).__wr?.battle.cfg.seed === 27);
  await waitAim(page, 0);
  await wr(page, `(() => {
    const b = __wr.battle;
    b.wind = 2;
    for (const [i, x] of [300, 1950].entries()) {
      const f = b.fighters[i];
      f.x = x;
      f.y = f.airPeakY = b.terrain.topSurface(x);
      f.vx = f.vy = 0;
      f.onGround = true;
    }
    b.setAngle(36);
  })()`);
  const hud = page.locator('[data-s=hud]');
  const slot = hud.getByRole('button', {name: /철편 삼연탄/});
  await slot.click();
  await expect(slot).toHaveClass(/on/);
  const power = hud.getByRole('slider', {name: '발사 힘 직접 설정'});
  await power.evaluate((input: HTMLInputElement) => {
    input.value = '84';
    input.dispatchEvent(new Event('input', {bubbles:true}));
  });
  await hud.getByRole('button', {name: '설정한 힘으로 발사'}).click();
  await expect.poll(async () => (await state(page)).projectiles).toBe(3);
  await page.waitForFunction(() => (window as any).__wr.battle.projectiles.every((p: {x: number}) => p.x > 780));
  await page.screenshot({path:'test-results/driller-scatter.png'});
  await expect.poll(async () => (await state(page)).hp[1]).toBe(680);
});

test('무당: 고각 사격 후 하강 중 적을 추적하여 맞힌다',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await openBattle(page,'local',['mudang','driller'],'bridge');await waitAim(page);
  await wr(page,`const b=__wr.battle;b.terrain.cells.fill(0);for(let y=450;y<600;y++)for(let x=0;x<1200;x++)b.terrain.set(x,y,4);b.terrain.pending=[];b.current=0;b.phase='AIM';b.timeLeft=30;b.wind=0;for(const [i,x] of [400,1700].entries()){const f=b.fighters[i];f.x=x;f.y=900;f.airPeakY=900;f.vx=f.vy=0;f.onGround=true;} __wr.fire(65,80,0);`);
  await page.waitForFunction(()=> (window as any).__wr.battle.projectiles.some((p:any)=>p.seekTarget===1),undefined,{polling:'raf'});
  await page.screenshot({path:'test-results/loft-guidance.png'});
  await page.waitForFunction(()=> (window as any).__wr.battle.fighters[1].hp<800,undefined,{polling:'raf'});
  expect(errors).toEqual([]);
});

test('첫 차례의 자유 탄 선택: 2번 발사 후 1번으로 돌아간다', async ({page}) => {
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await openBattle(page,'local',['hwacha','alchemist'],'sanseong');
  await waitAim(page);
  const before=await state(page),who=before.current;
  const hud=page.locator('[data-s=hud]');
  await expect(hud.locator('.gauge')).toHaveCount(0);
  await expect(hud.locator('[data-w="0"]')).toBeEnabled();
  await expect(hud.locator('[data-w="1"]')).toBeEnabled();
  await page.keyboard.press('2');
  await expect.poll(()=>wr(page,'__wr.battle.cur.slot')).toBe(1);
  await expect(hud.locator('[data-w="1"]')).toHaveClass(/on/);
  await page.keyboard.down('Space');await page.waitForTimeout(850);await page.keyboard.up('Space');
  await expect.poll(async()=>(await state(page)).shots[who]).toBe(before.shots[who]!+1);
  await waitAim(page,1-who,45_000);
  await expect(hud.locator('[data-w="1"]')).toBeEnabled();
  await page.keyboard.press('2');await expect.poll(()=>wr(page,'__wr.battle.cur.slot')).toBe(1);
  await page.keyboard.press('1');await expect.poll(()=>wr(page,'__wr.battle.cur.slot')).toBe(0);
  expect(errors).toEqual([]);
});

test('새 장수 고르기: 9장 카드, 전용 그림과 두 탄 용도가 보인다', async({page})=>{
  await page.goto('./?qa=1');await expect(page.locator('[data-s=title]')).toHaveClass(/on/);
  await page.getByRole('button',{name:/둘이서 하기/}).click();
  const screen=page.locator('[data-s=chars]');
  await expect(screen.locator('.card')).toHaveCount(9);
  for(const id of ['hwacha','alchemist','driller']){
    await screen.locator(`.card[data-id=${id}]`).click();
    await expect(screen).toContainText(id==='hwacha'?'구룡 화차':id==='alchemist'?'자욱한 독무':'지반 붕괴탄');
    await expect(screen).toContainText('두 탄 모두 매 차례 자유롭게');
  }
  await expect(screen).not.toContainText('가득 차면');
});

test('기본 체력 800 끝장전: 40턴 뒤에도 계속하고 쓰러뜨려야 끝난다',async({page})=>{
  await openBattle(page,'local',['general','archer'],'sanseong');await waitAim(page);
  expect((await state(page)).hp).toEqual([800,800]);
  expect(await wr(page,'__wr.battle.cfg.turnLimit')).toBe(0);
  await expect(page.locator('[data-s=hud] .tno')).toContainText('끝장전');
  await wr(page,'__wr.battle.turnNo=40; __wr.skip();');await waitAim(page);
  const s=await state(page);expect(s.turnNo).toBe(41);expect(s.winner).toBeNull();
  await wr(page,`__wr.kill(${1-s.current}); __wr.skip();`);
  await expect(page.locator('[data-s=result]')).toHaveClass(/on/);
  expect(await wr(page,'__wr.battle.endReason')).toBe('hp');
});

test('벼랑 외나무다리: 새 배경을 읽고 다리를 끊어 체력 800 상대를 낙사시킨다',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await openBattle(page,'local',['general','turtle'],'bridge');await waitAim(page);
  await wr(page,`(()=>{const b=__wr.battle,a=b.fighters[0],f=b.fighters[1];a.x=280;a.y=b.terrain.topSurface(280);a.airPeakY=a.y;f.x=1200;f.y=b.terrain.topSurface(1200);f.airPeakY=f.y;b.current=0;b.terrain.carveCircle(f.x,f.y,70,1);b.setPhase('TERRAIN_COLLAPSE');})()`);
  await expect(page.locator('[data-s=result]')).toHaveClass(/on/,{timeout:10_000});
  expect(await wr(page,'__wr.battle.endReason')).toBe('fall');
  expect(await wr(page,'__wr.battle.winner')).toBe(0);expect(errors).toEqual([]);
});

test('착탄 후 남은 물리는 빠르게 정착하고 1.8초 안에 다음 조작이 열린다',async({page})=>{
  await openBattle(page,'local',['general','archer'],'quarry');await waitAim(page);
  const turn=(await state(page)).turnNo;
  const t0=await wr(page,`(()=>{const b=__wr.battle;b.boulders.push({id:9999,x:1200,y:220,vx:30,vy:0,r:18,rot:0,restT:0,age:0,cool:[0,0],dead:false});b.setPhase('TERRAIN_COLLAPSE');return performance.now();})()`);
  await page.waitForFunction(t=>__wr.battle.phase==='AIM'&&__wr.battle.turnNo>t,turn,{timeout:8000});
  const elapsed=Number(await wr(page,'performance.now()'))-Number(t0);
  console.log('POST_IMPACT_GAP_MS',Math.round(elapsed));expect(elapsed).toBeLessThan(1800);
});

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
    return n.winner === null && n.hp[0] === 800 && n.hp[1] === 800 && n.turnNo <= 1 && n.shots[0] === 0;
  }).toBe(true);
  await waitAim(page);
});

for (const vp of [{ name: '가로', width: 844, height: 390 }, { name: '세로', width: 390, height: 844 }]) {
  test(`모바일 ${vp.name} 화면: 조작 단추가 손가락 크기로 화면 안에 있고 누르면 쏜다`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: true, isMobile: true, baseURL: 'http://127.0.0.1:5213/' });
    const page = await ctx.newPage();
    await openBattle(page, 'local', ['mudang', 'turtle'], 'forest');
    await waitAim(page);
    await expect(page.locator('[data-s=hud] .angle-hint')).toBeVisible();
    await expect(page.locator('[data-s=hud] .power-hint')).toBeVisible();
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

test('화면 끌기로 둘러보고 「내 장수로」로 돌아온다', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await openBattle(page, 'local', ['general', 'archer'], 'baekdu');
  await waitAim(page);
  await page.waitForTimeout(650);
  const camX = () => page.evaluate(() => (window as unknown as { __wr: { scene: { camX: number; free: boolean } } }).__wr.scene.camX);
  const x0 = await camX();
  // HUD가 끌기를 가로채지 않고 전장으로 넘기는지: 실제 마우스로 끈다
  await page.mouse.move(800, 300);
  await page.mouse.down();
  const panSign=x0>1200?1:-1;
  await page.mouse.move(800+panSign*100, 310, { steps: 4 });
  await page.mouse.move(800+panSign*300, 320, { steps: 6 });
  await page.mouse.up();
  await expect.poll(async () => Math.abs((await camX()) - x0)).toBeGreaterThan(150);
  const home = page.locator('[data-s=hud] .cambtn.home');
  await expect(home).toBeVisible();
  await home.click();
  await expect(home).toBeHidden();
  await expect.poll(async () => Math.abs((await camX()) - x0), { timeout: 15_000 }).toBeLessThan(40);
});

async function openTeamBattle(page: Page, chars: string[], map: string) {
  await page.goto('./?qa=1');
  await expect(page.locator('[data-s=title]')).toHaveClass(/on/, { timeout: 20_000 });
  await page.getByRole('button', { name: /둘이서 하기/ }).click();
  const chars$ = page.locator('[data-s=chars]');
  await expect(chars$).toHaveClass(/on/);
  await chars$.locator('[data-size="2"]').click();
  for (let k = 0; k < 4; k++) {
    await chars$.locator(`.card[data-id=${chars[k]}]`).click();
    await chars$.getByRole('button', { name: k < 3 ? /이 장수로/ : /전장 고르기/ }).click();
  }
  const maps$ = page.locator('[data-s=maps]');
  await expect(maps$).toHaveClass(/on/);
  await maps$.locator(`.card[data-id=${map}]`).click();
  await maps$.getByRole('button', { name: /싸움 시작/ }).click();
  await expect(page.locator('[data-s=hud]')).toHaveClass(/on/);
  await page.waitForFunction(() => !!(window as unknown as { __wr?: unknown }).__wr);
}

for (const vp of [{ name: '가로', width: 844, height: 390 }, { name: '세로', width: 390, height: 844 }]) {
  test(`2:2 모바일 ${vp.name}: 장수 넷의 체력판이 화면 안에, 단추와 겹치지 않고, 끝나면 결과가 보인다`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, hasTouch: true, isMobile: true, baseURL: 'http://127.0.0.1:5213/' });
    const page = await ctx.newPage();
    // 고른 순서: 1팀 첫째·둘째, 2팀 첫째·둘째
    await openTeamBattle(page, ['general', 'mudang', 'archer', 'turtle'], 'sanseong');
    await waitAim(page);
    const n = await page.evaluate(() => (window as unknown as { __wr: { battle: { fighters: unknown[] } } }).__wr.battle.fighters.length);
    expect(n).toBe(4);
    const cards = page.locator('[data-s=hud] .pcard');
    await expect(cards).toHaveCount(4);
    const boxes = [];
    for (let i = 0; i < 4; i++) {
      const b = (await cards.nth(i).boundingBox())!;
      expect(b.x, `카드 ${i} 왼쪽`).toBeGreaterThanOrEqual(0);
      expect(b.y, `카드 ${i} 위`).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width, `카드 ${i} 오른쪽`).toBeLessThanOrEqual(vp.width + 1);
      boxes.push(b);
    }
    for (const sel of ['.pausebtn', '.cambtn']) {
      const c = (await page.locator(`[data-s=hud] ${sel}`).first().boundingBox())!;
      for (const [i, a] of boxes.entries()) {
        const overlap = a.x < c.x + c.width - 1 && c.x < a.x + a.width - 1 && a.y < c.y + c.height - 1 && c.y < a.y + a.height - 1;
        expect(overlap, `카드 ${i} / ${sel} 겹침`).toBe(false);
      }
    }
    // 상대 편을 모두 쓰러뜨리면 결과
    const s = await state(page);
    const foeTeam = 1 - (s.current % 2);
    await wr(page, `__wr.battle.fighters.filter((f) => f.team === ${foeTeam}).forEach((f) => __wr.kill(f.idx)); __wr.skip();`);
    const result = page.locator('[data-s=result]');
    await expect(result).toHaveClass(/on/, { timeout: 20_000 });
    await expect(result.locator('.table th')).toHaveCount(5);
    await page.waitForTimeout(700);
    const again = (await result.getByRole('button', { name: '다시 한 판' }).boundingBox())!;
    expect(again.y + again.height).toBeLessThanOrEqual(vp.height + 1);
    await page.screenshot({ path: `test-results/team-${vp.width}x${vp.height}.png` });
    await ctx.close();
  });
}
