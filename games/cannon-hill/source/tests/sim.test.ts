import { describe, expect, it } from 'vitest';
import { CELL, COLS, DT, ROWS, SETTLE_LIMIT, WORLD_H } from '../src/game/config/constants';
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { AIActor, AIPlanner } from '../src/game/ai/ai';
import { MAPS } from '../src/game/data/maps';
import { Mat, Terrain } from '../src/game/terrain/terrain';
import type { BattleConfig } from '../src/game/combat/types';

/** 지형을 손으로 짠 전투(맵 생성 없이) */
function blank(partial: Partial<BattleConfig> = {}): Battle {
  const b = new Battle(defaultConfig(partial), true);
  b.terrain = new Terrain();
  b.wind = 0;
  return b;
}

function fillRect(t: Terrain, x0: number, y0: number, x1: number, y1: number, m: number) {
  for (let cy = Math.floor(y0 / CELL); cy < Math.ceil(y1 / CELL); cy++)
    for (let cx = Math.floor(x0 / CELL); cx < Math.ceil(x1 / CELL); cx++) t.set(cx, cy, m);
}

function place(b: Battle, idx: 0 | 1, x: number) {
  const f = b.fighters[idx];
  f.x = x;
  f.y = b.terrain.topSurface(x);
  f.onGround = true;
}

/** 바닥 기반암 + 흙으로 된 평지 */
function flatGround(b: Battle, top = 900) {
  fillRect(b.terrain, 0, top, 2400, WORLD_H - 40, Mat.Dirt);
  fillRect(b.terrain, 0, WORLD_H - 40, 2400, WORLD_H, Mat.Bedrock);
}

function aim(b: Battle) {
  b.phase = 'AIM';
  b.phaseT = 0;
  b.timeLeft = 30;
}

function runUntil(b: Battle, pred: () => boolean, maxSteps = 6000) {
  let n = 0;
  while (!pred() && n < maxSteps) {
    b.step();
    n++;
  }
  return n;
}

describe('포탄 물리', () => {
  it('1. 같은 발사 조건이면 같은 궤적이 나온다', () => {
    const a = new Battle(defaultConfig({ seed: 7 }));
    const b = new Battle(defaultConfig({ seed: 7 }));
    const pa = a.dryShot(0, 0, 48, 73);
    const pb = b.dryShot(0, 0, 48, 73);
    expect(pa).toEqual(pb);
    expect(a.previewPath(2, 73)).toEqual(b.previewPath(2, 73));
  });

  it('2. 바람 방향에 따라 탄착점이 달라진다', () => {
    const b = blank();
    flatGround(b);
    place(b, 0, 400);
    place(b, 1, 2200);
    b.wind = 8;
    const right = b.dryShot(0, 0, 55, 70).impacts[0]!;
    b.wind = -8;
    const left = b.dryShot(0, 0, 55, 70).impacts[0]!;
    b.wind = 0;
    const calm = b.dryShot(0, 0, 55, 70).impacts[0]!;
    expect(right.x).toBeGreaterThan(calm.x + 40);
    expect(left.x).toBeLessThan(calm.x - 40);
  });

  it('3. 빠른 포탄이 얇은 벽을 뚫고 지나가지 않는다', () => {
    const b = blank({ chars: ['archer', 'turtle'] });
    flatGround(b, 1000);
    fillRect(b.terrain, 1000, 300, 1004, 1000, Mat.Rock); // 두께 4px
    place(b, 0, 300);
    place(b, 1, 2000);
    // 관통 화살이 아니라 일반 포탄으로(화포장군)
    b.fighters[0].charId = 'general';
    const r = b.dryShot(0, 0, 15, 100);
    expect(r.impacts.length).toBeGreaterThan(0);
    expect(r.impacts[0]!.x).toBeLessThan(1006);
    expect(r.impacts[0]!.x).toBeGreaterThan(995);
  });
});

describe('지형 파괴', () => {
  it('4. 폭발 반경 안의 흙만 정확히 지운다', () => {
    const t = new Terrain();
    fillRect(t, 0, 400, 2400, 1200, Mat.Dirt);
    const removed = t.carveCircle(1200, 600, 40, 1);
    expect(t.solidAt(1200, 600)).toBe(false);
    expect(t.solidAt(1200 + 36, 600)).toBe(false);
    expect(t.solidAt(1200 + 44, 600)).toBe(true);
    expect(t.solidAt(1200, 600 - 44)).toBe(true);
    const expected = (Math.PI * 40 * 40) / (CELL * CELL);
    expect(Math.abs(removed - expected) / expected).toBeLessThan(0.05);
  });

  it('5. 기반암과 구조물은 부서지지 않는다', () => {
    const t = new Terrain();
    fillRect(t, 1000, 1000, 1400, 1200, Mat.Bedrock);
    fillRect(t, 1400, 1000, 1600, 1200, Mat.Core);
    const before = t.countSolid();
    t.carveCircle(1200, 1050, 80, 1);
    t.carveCircle(1500, 1050, 80, 1);
    expect(t.countSolid()).toBe(before);
  });

  it('6. 지지점을 잃은 지형은 떨어져 나와 무너진다', () => {
    const b = blank();
    flatGround(b, 1000);
    // 기둥 위에 가로로 얹힌 흙 판
    fillRect(b.terrain, 1180, 700, 1220, 1000, Mat.Dirt);
    fillRect(b.terrain, 1080, 660, 1320, 700, Mat.Dirt);
    place(b, 0, 300);
    place(b, 1, 2100);
    b.phase = 'PHYSICS_SETTLING';
    // 기둥 밑동을 끊는다
    b.terrain.carveCircle(1200, 960, 40, 1);
    b.step();
    expect(b.chunks.length).toBeGreaterThan(0);
    expect(b.terrain.solidAt(1300, 680)).toBe(false); // 원래 자리는 비었다
    runUntil(b, () => b.chunks.length === 0, 600);
    // 덩어리째 아래로 내려앉았다(판의 윗면이 원래보다 낮다)
    expect(b.terrain.topSurface(1300)).toBeGreaterThan(720);
  });

  it('6-1. 실제 전장에서 폭발 뒤 붕괴가 생긴다', () => {
    const b = new Battle(defaultConfig({ mapId: 'baekdu', seed: 3 }));
    let comps = 0;
    for (let x = 700; x <= 1700 && comps === 0; x += 20) {
      const y = b.terrain.topSurface(x);
      b.terrain.carveCircle(x, y + 30, 70, 1);
      const got = b.terrain.extractUnsupported(b.terrain.pending.splice(0));
      comps += got.length;
    }
    expect(comps).toBeGreaterThan(0);
  });
});

describe('낙석과 낙하', () => {
  it('7. 낙석이 캐릭터에게 피해를 준다', () => {
    const b = blank();
    flatGround(b, 900);
    place(b, 0, 1200);
    place(b, 1, 2000);
    b.phase = 'PHYSICS_SETTLING';
    b.boulders.push({ id: 99, x: 1200, y: 700, vx: 0, vy: 200, r: 14, rot: 0, restT: 0, age: 0, cool: [0, 0], dead: false });
    const hp = b.fighters[0].hp;
    runUntil(b, () => b.boulders.length === 0, 600);
    expect(b.fighters[0].hp).toBeLessThan(hp);
  });

  it('7-1. 떨어지는 덩어리가 캐릭터를 덮치면 피해를 준다', () => {
    const b = blank();
    flatGround(b, 900);
    // 오른쪽 벽에 팔 하나로 매달린 바위판
    fillRect(b.terrain, 1300, 400, 1320, 900, Mat.Rock);
    fillRect(b.terrain, 1250, 500, 1300, 510, Mat.Rock);
    fillRect(b.terrain, 1150, 480, 1250, 540, Mat.Dirt);
    place(b, 0, 1200);
    place(b, 1, 2100);
    const hp = b.fighters[0].hp;
    b.phase = 'PHYSICS_SETTLING';
    b.terrain.carveCircle(1275, 505, 14, 1); // 팔을 끊는다
    b.step();
    expect(b.chunks.length).toBe(1);
    runUntil(b, () => b.chunks.length === 0 && b.boulders.length === 0, 900);
    expect(b.fighters[0].hp).toBeLessThan(hp);
  });

  it('8. 지형 아래로 떨어지면 패배한다', () => {
    const b = blank({ mapId: 'cloud' });
    fillRect(b.terrain, 100, 700, 700, 760, Mat.Dirt);
    fillRect(b.terrain, 380, 760, 420, 800, Mat.Core);
    fillRect(b.terrain, 1700, 700, 2300, 760, Mat.Dirt);
    fillRect(b.terrain, 1980, 760, 2020, 800, Mat.Core);
    place(b, 0, 300);
    place(b, 1, 1800);
    aim(b);
    b.current = 0;
    // 2P 발밑을 통째로 지운다
    b.terrain.carveCircle(1800, 730, 90, 1);
    b.skipTurn();
    runUntil(b, () => b.phase === 'GAME_OVER', 4000);
    expect(b.phase).toBe('GAME_OVER');
    expect(b.winner).toBe(0);
    expect(b.endReason).toBe('fall');
  });

  it('8-1. 높은 곳에서 떨어지면 낙하 피해를 받는다', () => {
    const b = blank();
    flatGround(b, 1100);
    fillRect(b.terrain, 1100, 500, 1300, 540, Mat.Core);
    place(b, 0, 1200);
    place(b, 1, 2100);
    b.phase = 'PHYSICS_SETTLING';
    b.terrain.cells.fill(0, (500 / CELL) * COLS, (540 / CELL) * COLS); // 발판 제거
    b.fighters[0].onGround = true;
    const hp = b.fighters[0].hp;
    runUntil(b, () => b.fighters[0].onGround && b.stepNo > 5, 600);
    expect(b.fighters[0].hp).toBeLessThan(hp);
  });
});

it('8-2. 벽에 붙어 떨어져도 벽을 바닥으로 착각하지 않고 아래 땅에 내려앉는다', () => {
  const b = blank();
  flatGround(b, 900);
  fillRect(b.terrain, 1206, 500, 1240, 900, Mat.Rock); // 오른쪽에 선 벽
  place(b, 0, 300);
  place(b, 1, 2100);
  const f = b.fighters[0];
  f.x = 1201; // 오른쪽 탐침(+6)이 벽 속
  f.y = 600;
  f.onGround = false;
  f.vy = 50;
  b.phase = 'PHYSICS_SETTLING';
  runUntil(b, () => f.onGround && f.y > 880, 600);
  expect(f.y).toBeGreaterThan(880);
  for (let i = 0; i < 30; i++) b.step();
  expect(f.onGround).toBe(true);
  expect(Math.round(f.y)).toBe(900);
});

describe('승패와 턴', () => {
  it('9. 양쪽이 동시에 쓰러지면 무승부다', () => {
    const b = blank({ chars: ['general', 'general'] });
    flatGround(b, 900);
    place(b, 0, 1170);
    place(b, 1, 1230);
    b.fighters[0].hp = 5;
    b.fighters[1].hp = 5;
    b.current = 0;
    aim(b);
    b.setAngle(90);
    b.fireNow(25); // 바로 위로 쏘면 두 사람 사이에 떨어진다
    runUntil(b, () => b.phase === 'GAME_OVER', 3000);
    expect(b.phase).toBe('GAME_OVER');
    expect(b.winner).toBe(-1);
  });

  it('11. 로컬 대전에서 턴이 정확히 번갈아 바뀐다', () => {
    const b = new Battle(defaultConfig({ seed: 11 }));
    const order: number[] = [];
    for (let k = 0; k < 4; k++) {
      runUntil(b, () => b.phase === 'AIM');
      order.push(b.current);
      b.setAngle(b.current === 0 ? 60 : 120);
      b.fireNow(40);
      runUntil(b, () => b.phase === 'TURN_START' || b.phase === 'GAME_OVER');
    }
    expect(order[1]).toBe(1 - order[0]!);
    expect(order[2]).toBe(order[0]);
    expect(order[3]).toBe(order[1]);
    expect(b.turnNo).toBe(5);
  });

  it('턴 제한에 닿으면 남은 체력 비율로 판정한다', () => {
    const b = new Battle(defaultConfig({ seed: 5, turnLimit: 2 }));
    runUntil(b, () => b.phase === 'AIM');
    b.fighters[1 - b.current]!.hp = 400;
    b.skipTurn();
    runUntil(b, () => b.phase === 'AIM');
    b.skipTurn();
    runUntil(b, () => b.phase === 'GAME_OVER');
    expect(b.endReason).toBe('limit');
    expect(b.winner).toBe(b.fighters[0].hp > b.fighters[1].hp ? 0 : 1);
  });

  it('12. 물리 안정화가 끝없이 이어지지 않는다', () => {
    const b = blank();
    flatGround(b, 900);
    place(b, 0, 300);
    place(b, 1, 2100);
    aim(b);
    b.current = 0;
    b.setAngle(60);
    b.fireNow(50);
    // 버그로 늘 '아직 움직이는 중'이라고 답하게 만든다
    b.isQuiet = () => false;
    const n = runUntil(b, () => b.phase === 'TURN_END', 5000);
    expect(b.phase).toBe('TURN_END');
    expect(n * DT).toBeLessThan(14 + SETTLE_LIMIT + 3);
  });

  it('12-1. 큰 붕괴가 나도 정착 시간 한도 안에 턴이 끝난다', () => {
    for (const m of MAPS) {
      const b = new Battle(defaultConfig({ mapId: m.id, seed: 21, chars: ['general', 'turtle'] }));
      runUntil(b, () => b.phase === 'AIM');
      const f = b.cur;
      b.selectWeapon(1);
      b.setAngle(f.x < 1200 ? 62 : 118);
      b.fireNow(78);
      const n = runUntil(b, () => b.phase === 'TURN_END' || b.phase === 'GAME_OVER', 3000);
      expect(n * DT, m.id).toBeLessThan(14 + SETTLE_LIMIT + 2);
    }
  });
});

describe('AI', () => {
  it('10. AI가 유효한 발사 값을 계산하고, 그 값이 상대 근처에 떨어진다', () => {
    let near = 0;
    for (const seed of [1, 2, 3, 4]) {
      const b = new Battle(defaultConfig({ seed, mapId: MAPS[seed % MAPS.length]!.id, controllers: ['ai', 'ai'], difficulty: 'hard' }));
      runUntil(b, () => b.phase === 'AIM');
      const plan = new AIPlanner(b, b.current, 'hard').runToEnd();
      expect(plan.angle).toBeGreaterThanOrEqual(0);
      expect(plan.angle).toBeLessThanOrEqual(180);
      expect(plan.power).toBeGreaterThanOrEqual(5);
      expect(plan.power).toBeLessThanOrEqual(100);
      const actor = { ...b.cur, stats: { ...b.cur.stats } };
      for(let i=0;i<plan.walkSteps;i++) b.walk(actor,plan.walkDir*70*DT);
      const r = b.dryShot(b.current, plan.slot, plan.exact.angle, plan.exact.power, {x:actor.x,y:actor.y});
      const foe = b.enemy;
      const d = Math.min(...r.impacts.map((p) => Math.hypot(p.x - foe.x, p.y - foe.y)));
      if (r.damage[foe.idx] > 0 || d < 120) near++;
    }
    expect(near).toBeGreaterThanOrEqual(3);
  });

  it('AI가 실제 입력으로 쏘고 턴을 넘긴다', () => {
    const b = new Battle(defaultConfig({ seed: 9, controllers: ['ai', 'ai'], difficulty: 'normal' }));
    const actors = [new AIActor(0, 'normal', 0), new AIActor(1, 'normal', 0)];
    let shots = 0;
    for (let i = 0; i < 6000 && b.turnNo < 4 && b.phase !== 'GAME_OVER'; i++) {
      for (const a of actors) a.update(b, 1e9);
      b.step();
      shots = b.fighters[0].stats.shots + b.fighters[1].stats.shots;
    }
    expect(shots).toBeGreaterThanOrEqual(3);
  });
});

describe('재현과 초기화', () => {
  function script(b: Battle) {
    const out: string[] = [];
    for (let k = 0; k < 3; k++) {
      runUntil(b, () => b.phase === 'AIM' || b.phase === 'GAME_OVER');
      if (b.phase === 'GAME_OVER') break;
      b.setMove(b.current === 0 ? 1 : -1);
      for (let i = 0; i < 30; i++) b.step();
      b.setMove(0);
      b.setAngle(b.current === 0 ? 52 + k : 128 - k);
      b.setCharge(true);
      for (let i = 0; i < 70; i++) b.step();
      b.setCharge(false);
      runUntil(b, () => b.phase === 'TURN_START' || b.phase === 'GAME_OVER');
      out.push(b.hash());
    }
    return out;
  }

  it('13. 새 전투는 이전 전투의 흔적 없이 시작한다', () => {
    const fresh = new Battle(defaultConfig({ seed: 77, mapId: 'forest' })).hash();
    const old = new Battle(defaultConfig({ seed: 5, mapId: 'baekdu' }));
    script(old);
    const again = new Battle(defaultConfig({ seed: 77, mapId: 'forest' }));
    expect(again.hash()).toBe(fresh);
    expect(again.projectiles.length + again.boulders.length + again.chunks.length).toBe(0);
    expect(again.fighters[0].stats.shots).toBe(0);
  });

  it('14. 같은 시드와 입력이면 전투 결과가 같다(기록 재생·직렬화)', () => {
    const cfg = defaultConfig({ seed: 4242, mapId: 'sanseong', chars: ['dokkaebi', 'mudang'] });
    const a = new Battle(cfg);
    const ha = script(a);
    // 같은 입력을 기록에서 다시 재생
    const b = new Battle(cfg);
    const log = [...a.log];
    let li = 0;
    while (b.stepNo < a.stepNo) {
      while (li < log.length && log[li]!.s === b.stepNo) {
        b.applyCommand(log[li]!.c, log[li]!.a);
        li++;
      }
      b.step();
    }
    expect(b.hash()).toBe(a.hash());
    expect(ha.length).toBeGreaterThan(0);
    // 직렬화했다 되살려도 같은 결과
    const c = Battle.deserialize(a.serialize());
    for (let i = 0; i < 400; i++) { a.step(); c.step(); }
    expect(c.hash()).toBe(a.hash());
  });
});

it('모든 전장에서 두 캐릭터가 땅 위에 공정하게 선다', () => {
  for (const m of MAPS) {
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const b = new Battle(defaultConfig({ mapId: m.id, seed }));
      const [p, q] = b.fighters;
      expect(p.y, `${m.id}/${seed}`).toBeGreaterThan(0);
      expect(b.terrain.solidAt(p.x, p.y), `${m.id}/${seed} 1P 발밑`).toBe(true);
      expect(b.terrain.solidAt(q.x, q.y), `${m.id}/${seed} 2P 발밑`).toBe(true);
      expect(Math.abs(p.y - q.y), `${m.id}/${seed} 높이 차`).toBeLessThanOrEqual(420);
      expect(Math.abs(p.x-q.x), `${m.id}/${seed} 거리`).toBeGreaterThanOrEqual(380);
      expect(Math.abs(p.x-q.x), `${m.id}/${seed} 거리`).toBeLessThanOrEqual(1260);
      // 서 있는 동안 떨어지지 않는다
      for (let i = 0; i < 30; i++) b.step();
      expect(b.fighters[0].onGround && b.fighters[1].onGround).toBe(true);
    }
  }
  expect(ROWS).toBe(600);
});
