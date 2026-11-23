import { describe, expect, it } from 'vitest';
import { CELL, WORLD_H, WORLD_W } from '../src/game/config/constants';
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { TRAIT } from '../src/game/data/characters';
import { Mat, Terrain } from '../src/game/terrain/terrain';

/** 장수 특기가 실제 규칙(예상 궤적·AI가 쓰는 dryShot 포함)에 들어갔는지 */

function flat(chars: string[]): Battle {
  const b = new Battle(defaultConfig({ chars, controllers: chars.map(() => 'human' as const) }), true);
  b.terrain = new Terrain();
  b.wind = 0;
  for (let cy = Math.floor(900 / CELL); cy < WORLD_H / CELL; cy++)
    for (let cx = 0; cx < WORLD_W / CELL; cx++) b.terrain.set(cx, cy, cy * CELL >= WORLD_H - 40 ? Mat.Bedrock : Mat.Dirt);
  return b;
}

function place(b: Battle, idx: number, x: number) {
  const f = b.fighters[idx]!;
  f.x = x;
  f.y = b.terrain.topSurface(x);
  f.onGround = true;
}

function steps(b: Battle, n: number) {
  for (let i = 0; i < n; i++) b.step();
}

describe('장수 특기', () => {
  it('화포장군: 움직이지 않고 쏘면 더 세고, 걸은 뒤에는 보통이다', () => {
    const b = flat(['general', 'archer']);
    place(b, 0, 600);
    place(b, 1, 1000);
    const f = b.fighters[0]!;
    // 같은 각도·힘으로 상대 근처에 떨어지는 값 찾기
    let best = { a: 45, p: 50, d: 0 };
    for (let a = 30; a <= 70; a += 2) for (let p = 40; p <= 90; p += 2) {
      const r = b.dryShot(0, 0, a, p);
      if (r.damage[1]! > best.d) best = { a, p, d: r.damage[1]! };
    }
    expect(best.d).toBeGreaterThan(0);
    f.moved = true;
    const walked = b.dryShot(0, 0, best.a, best.p).damage[1]!;
    expect(best.d).toBeGreaterThan(walked * 1.1);
    expect(b.steadyReady(f)).toBe(false);
  });

  it('신궁: 몸에 직접 꽂히면 같은 무기를 다른 장수가 맞힐 때보다 세다', () => {
    const b = flat(['archer', 'general']);
    place(b, 0, 600);
    place(b, 1, 700);
    const target = b.fighters[1]!;
    const hit = (ownerChar: string) => {
      const c = flat([ownerChar, 'general']);
      place(c, 0, 600);
      place(c, 1, 700);
      const p = c.newProjectile(0, 1, 'arrow', 640, target.y - 20, 400, 0);
      p.age = 1;
      c.projectiles.push(p);
      const hp0 = c.fighters[1]!.hp;
      steps(c, 30);
      return hp0 - c.fighters[1]!.hp;
    };
    expect(hit('archer')).toBeGreaterThan(hit('dokkaebi') * 1.15);
  });

  it('도깨비: 맞은 상대를 더 멀리 날려 보낸다', () => {
    const push = (ownerChar: string) => {
      const c = flat([ownerChar, 'general']);
      place(c, 0, 400);
      place(c, 1, 700);
      const t = c.fighters[1]!;
      const p = c.newProjectile(0, 1, 'hwapo', 660, t.y - 20, 300, 0);
      p.age = 1;
      c.projectiles.push(p);
      for (let i = 0; i < 20 && Math.abs(t.vx) < 1; i++) c.step();
      return Math.abs(t.vx);
    };
    expect(push('dokkaebi')).toBeGreaterThan(push('archer') * 1.6);
  });

  it('무당: 자기 차례가 시작되면 자신과 가까운 같은 편이 회복된다(먼 편은 아님)', () => {
    const b = flat(['mudang', 'archer', 'general', 'gumiho']);
    place(b,0,400);place(b,1,1800);place(b,2,500);place(b,3,2100);
    const me = b.fighters[0]!, near = b.fighters[2]!, foe = b.fighters[1]!;
    const hurtHp = me.maxHp - 200;
    me.hp = hurtHp;
    near.hp = hurtHp;
    foe.hp = hurtHp;
    // 무당 차례가 올 때까지
    let guard = 0;
    while (!(b.phase === 'AIM' && b.current === 0) && guard++ < 6000) {
      if (b.phase === 'AIM') b.skipTurn();
      b.step();
    }
    expect(me.hp).toBe(hurtHp + TRAIT.blessHeal);
    expect(near.hp).toBe(hurtHp + TRAIT.blessHeal);
    expect(foe.hp).toBe(hurtHp);
  });

  it('무당: 부적탄이 상대 곁을 지나가면 그쪽으로 휜다', () => {
    const land = (weaponId: string) => {
      const c = flat(['mudang', 'general']);
      place(c, 0, 300);
      place(c, 1, 900);
      const t = c.fighters[1]!;
      // 상대 머리 위 90px를 수평으로 지나가는 포탄
      const p = c.newProjectile(0, 1, weaponId, 700, t.y - 110, 420, 0);
      p.age = 1;
      c.projectiles.push(p);
      let at = Infinity;
      for (let i = 0; i < 240 && c.projectiles.length; i++) {
        c.step();
        for (const e of c.drainEvents()) if (e.type === 'explode' && at === Infinity) at = Math.abs(e.x - t.x);
      }
      return at;
    };
    // 부적은 상대 몸에 떨어지고, 같은 길로 날아간 화포탄은 지나쳐 떨어진다
    expect(land('bujeok')).toBeLessThan(25);
    expect(land('hwapo')).toBeGreaterThan(60);
  });

  it('거북선 장수: 떨어지거나 깔리는 피해가 절반이고 잘 밀리지 않는다', () => {
    const b = flat(['turtle', 'general']);
    place(b, 0, 600);
    place(b, 1, 900);
    const t = b.fighters[0]!, g = b.fighters[1]!;
    b.applyDamage(t, 100, t.x, t.y, false, 'fall', -1);
    b.applyDamage(g, 100, g.x, g.y, false, 'fall', -1);
    expect(t.maxHp - t.hp).toBe(Math.round(100 * TRAIT.ironEnv));
    expect(g.maxHp - g.hp).toBe(100);
    // 폭발에 밀리는 정도
    const push = (target: string) => {
      const c = flat(['archer', target]);
      place(c, 0, 400);
      place(c, 1, 700);
      const f = c.fighters[1]!;
      const p = c.newProjectile(0, 1, 'hwapo', 660, f.y - 20, 300, 0);
      p.age = 1;
      c.projectiles.push(p);
      for (let i = 0; i < 20 && Math.abs(f.vx) < 1; i++) c.step();
      return Math.abs(f.vx);
    };
    expect(push('turtle')).toBeLessThan(push('general') * 0.5);
  });

  it('구미호: 여우걸음은 실제 낙하 피해를 40% 줄인다', () => {
    const b = flat(['gumiho', 'general']);
    const fox = b.fighters[0]!, gen = b.fighters[1]!;
    const f0 = fox.hp, g0 = gen.hp;
    b.applyDamage(fox, 100, fox.x, fox.y, false, 'fall', 1, 1);
    b.applyDamage(gen, 100, gen.x, gen.y, false, 'fall', 0, 2);
    expect(f0-fox.hp).toBe(100*TRAIT.foxFall);
    expect(g0-gen.hp).toBe(100);
  });
});
