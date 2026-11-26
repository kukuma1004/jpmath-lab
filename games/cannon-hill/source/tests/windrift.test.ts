import { describe, expect, it } from 'vitest';
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { CELL, WORLD_W } from '../src/game/config/constants';
import { generateTerrain, mapDef } from '../src/game/data/maps';
import type { Terrain } from '../src/game/terrain/terrain';

function gapWidth(terrain: Terrain): number {
  for (let x = WORLD_W / 2 - CELL / 2; x >= 0; x -= CELL) {
    if (terrain.topSurface(x) >= 0) return WORLD_W - 2 * (x + CELL / 2);
  }
  return WORLD_W;
}

describe('바람칼 협곡의 장거리 포격', () => {
  it.each([1, 27, 71])('채석장보다 열린 간격이 넓고 발판이 얇다 (지형 %s)', seed => {
    const rift = generateTerrain(mapDef('windrift'), seed);
    const quarry = generateTerrain(mapDef('quarry'), seed);
    expect(gapWidth(rift)).toBe(1120);
    expect(gapWidth(rift)).toBeGreaterThan(gapWidth(quarry) * 4);
    for (const x of [350, 560, WORLD_W - 350, WORLD_W - 560]) {
      const top = rift.topSurface(x);
      const shelf = rift.shelfTopAndBottom(x, top, 42);
      expect(shelf, `발판 x=${x}`).not.toBeNull();
      expect(shelf!.bottom - shelf!.top).toBeLessThanOrEqual(40);
      expect(shelf!.bottom - shelf!.top).toBeLessThan(quarry.shelfTopAndBottom(x, quarry.topSurface(x), 96)!.bottom - quarry.topSurface(x));
    }
  });

  it.each([
    { from: 301, to: 2099, wind: -10 },
    { from: 2099, to: 301, wind: 10 },
    { from: 533, to: 2099, wind: -10 },
    { from: 1867, to: 301, wind: 10 },
  ])('강한 맞바람에도 최대 힘으로 맞힌다 ($from → $to)', ({from, to, wind}) => {
    const b = new Battle(defaultConfig({ mapId: 'windrift', chars: ['general', 'archer'], seed: 27, starterMatch: true }));
    [from, to].forEach((x, i) => {
      const f = b.fighters[i]!;
      f.x = x;
      f.y = f.airPeakY = b.terrain.topSurface(x);
    });
    b.phase = 'AIM';
    b.timeLeft = 30;
    b.wind = wind;
    const angles = Array.from({ length: 45 }, (_, i) => from < to ? 22 + i : 158 - i);
    const angle = angles.find(value => b.dryShot(0, 0, value, 100).damage[1]! > 75);
    expect(angle).toBeDefined();
    b.setAngle(angle!);
    b.fireNow(100);
    for (let i = 0; i < 300 && b.fighters[1]!.hp === b.fighters[1]!.maxHp; i++) b.step();
    expect(b.fighters[1]!.maxHp - b.fighters[1]!.hp).toBeGreaterThan(75);
  });

  it('아래가 비어 있어 발판을 끊으면 체력이 가득 찬 상대도 떨어진다', () => {
    const b = new Battle(defaultConfig({ mapId: 'windrift', seed: 27, starterMatch: true }));
    const foe = b.fighters[1]!;
    foe.x = 2040;
    foe.y = foe.airPeakY = b.terrain.topSurface(foe.x);
    b.phase = 'TERRAIN_COLLAPSE';
    b.terrain.carveCircle(foe.x, foe.y, 43, 1);
    for (let i = 0; i < 420 && b.winner === null; i++) b.step();
    expect(foe.deathCause).toBe('fall');
    expect(b.winner).toBe(0);
  });
});
