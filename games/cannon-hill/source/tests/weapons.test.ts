import { describe, expect, it } from 'vitest';
import { CELL, DT, WORLD_H } from '../src/game/config/constants';
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { Mat, Terrain } from '../src/game/terrain/terrain';
import type { SimEvent } from '../src/game/combat/types';

/** 평지에서 한 장수에게 지정한 무기로 한 발 쏘고 사건을 모은다 */
function shoot(charId: string, slot: 0 | 1, angle: number, power: number, seconds = 8) {
  const b = new Battle(defaultConfig({ chars: [charId, 'turtle'] }), true);
  b.terrain = new Terrain();
  for (let cy = 900 / CELL; cy < WORLD_H / CELL; cy++) for (let cx = 0; cx < 1200; cx++) b.terrain.set(cx, cy, cy > (WORLD_H - 40) / CELL ? Mat.Bedrock : Mat.Dirt);
  const [a, c] = b.fighters;
  a.x = 400; a.y = 900; c.x = 2000; c.y = 900;
  b.wind = 0;
  b.current = 0;
  b.phase = 'AIM';
  b.timeLeft = 30;
  b.selectWeapon(slot);
  b.setAngle(angle);
  b.fireNow(power);
  const afterFire = { proj: b.projectiles.length, sched: b.scheduled.length };
  const events: SimEvent[] = [...b.drainEvents()];
  let maxProj = b.projectiles.length;
  for (let t = 0; t < seconds / DT; t++) {
    b.step();
    maxProj = Math.max(maxProj, b.projectiles.length);
    events.push(...b.drainEvents());
  }
  const count = (type: SimEvent['type']) => events.filter((e) => e.type === type).length;
  return { b, events, afterFire, maxProj, count };
}

describe('무기 여섯 종이 서로 다르게 작동한다', () => {
  it('화포장군 집중탄: 짧은 심지 뒤 한 번 터지고 후속 쇳조각을 기다리지 않는다', () => {
    const r = shoot('general', 1, 60, 55);
    expect(r.count('fuse')).toBe(1);
    const big = r.events.find((e) => e.type === 'explode' && e.big);
    expect(big).toBeTruthy();
    expect(r.count('explode')).toBe(1);
    expect(r.maxProj).toBe(1);
  });

  it('신궁 관통 화살: 지면을 뚫고 들어가 땅속에서 터진다', () => {
    const r = shoot('archer', 0, 40, 60);
    const e = r.events.find((x) => x.type === 'explode') as Extract<SimEvent, { type: 'explode' }>;
    expect(e).toBeTruthy();
    expect(e.y).toBeGreaterThan(900 + 15);
  });

  it('신궁 삼연시: 화살 세 대가 한꺼번에 나간다', () => {
    const r = shoot('archer', 1, 45, 60);
    expect(r.afterFire.proj).toBe(3);
    expect(r.count('launch')).toBe(3);
  });

  it('도깨비 폭탄: 두 번 튄 뒤 터지고, 도깨비불은 튈 때마다 작게 터진다', () => {
    const bomb = shoot('dokkaebi', 0, 50, 45);
    expect(bomb.count('bounce')).toBe(2);
    expect(bomb.count('explode')).toBe(1);
    const fire = shoot('dokkaebi', 1, 50, 45);
    expect(fire.count('bounce')).toBeGreaterThanOrEqual(2);
    expect(fire.count('explode')).toBe(fire.count('bounce') + 1);
  });

  it('무당 낙뢰 부적: 떨어진 자리 둘레로 벼락이 세 번 내리친다', () => {
    const r = shoot('mudang', 1, 50, 55);
    expect(r.count('lightning')).toBe(3);
  });

  it('거북선 장수 연속 화포: 시간차를 두고 세 발을 쏜다', () => {
    const r = shoot('turtle', 1, 45, 60);
    expect(r.afterFire.proj).toBe(1);
    expect(r.afterFire.sched).toBe(2);
    expect(r.count('launch')).toBe(3);
  });

  it('구미호 분열 여우불: 가장 높은 곳에서 다섯 갈래로 갈라진다', () => {
    const r = shoot('gumiho', 1, 60, 60);
    expect(r.count('split')).toBe(1);
    expect(r.maxProj).toBe(5);
    expect(r.count('explode')).toBe(5);
  });

  it('화차장인: 1번 세 발 집중 연사와 2번 아홉 발 확산이 서로 다르다', () => {
    const focused=shoot('hwacha',0,45,60),wide=shoot('hwacha',1,45,60);
    expect(focused.afterFire).toEqual({proj:1,sched:2});
    expect(focused.count('launch')).toBe(3);
    expect(wide.afterFire).toEqual({proj:9,sched:0});
    expect(wide.count('launch')).toBe(9);
    expect(wide.count('explode')).toBe(9);
  });

  it('독술사: 1번은 즉시 폭발, 2번은 실제 독구름을 남긴다', () => {
    const one=shoot('alchemist',0,45,45),two=shoot('alchemist',1,45,45);
    expect(one.b.clouds).toHaveLength(0);
    expect(two.b.clouds).toHaveLength(1);
    expect(two.b.clouds[0]!.owner).toBe(0);
  });

  it('철갑 포탄은 바위를 흙처럼 부수고, 화포탄은 바위를 덜 판다', () => {
    const t1 = new Terrain(), t2 = new Terrain();
    for (const t of [t1, t2]) for (let cy = 400; cy < 600; cy++) for (let cx = 0; cx < 1200; cx++) t.set(cx, cy, Mat.Rock);
    const iron = t1.carveCircle(1200, 1000, 42, 1.0);
    const hwapo = t2.carveCircle(1200, 1000, 42, 0.62);
    expect(iron).toBeGreaterThan(hwapo * 2);
  });
});
