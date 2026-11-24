import { describe, expect, it } from 'vitest';
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { WORLD_W } from '../src/game/config/constants';
import { generateTerrain, mapDef } from '../src/game/data/maps';

function quarryBattle(seed = 27, chars = ['general', 'archer']) {
  const battle = new Battle(defaultConfig({ mapId: 'quarry', seed, chars, starterMatch: true }));
  for (let frame = 0; frame < 180 && battle.phase !== 'AIM'; frame++) battle.step();
  return battle;
}

describe('층층 채석장의 네 단 절벽', () => {
  it('아래로 갈수록 노출된 발판이 짧고 중앙은 추락선까지 비어 있다', () => {
    const def = mapDef('quarry');
    const terrain = generateTerrain(def, 5);
    const levels = new Map<number, number>();
    for (let x = 1; x < WORLD_W / 2; x += 2) {
      const top = terrain.topSurface(x);
      expect(terrain.topSurface(WORLD_W - x)).toBe(top);
      if (top >= 0) levels.set(top, (levels.get(top) ?? 0) + 2);
    }
    expect([...levels.values()]).toEqual([640, 218, 136, 88]);
    for (const [x, gapY, nextTop] of [[530, 538, 568], [759, 654, 692], [950, 776, 822]]) {
      expect(terrain.solidAt(x!, gapY!)).toBe(false);
      expect(terrain.surfaceBelow(x!, gapY!)).toBe(nextTop);
    }
    expect(terrain.surfaceBelow(WORLD_W / 2, 0)).toBe(-1);
    expect(def.ringOutY).toBeGreaterThan([...levels.keys()].at(-1)!);
  });

  it.each([false, true])('걸어서 네 단을 내려가며 살아남고 마지막 선반을 벗어나면 탈락한다 (거울 %s)', mirror => {
    const battle = quarryBattle();
    const fighter = battle.cur;
    const dir = mirror ? -1 : 1;
    const worldX = (leftX: number) => mirror ? WORLD_W - leftX : leftX;
    battle.fighters[1]!.x = worldX(1900);
    battle.fighters[1]!.y = battle.terrain.topSurface(worldX(1900));
    for (const [index, edge] of [640, 858, 994, 1082].entries()) {
      const startX = worldX(edge - 12);
      fighter.x = startX;
      fighter.y = battle.terrain.topSurface(startX);
      fighter.onGround = true;
      fighter.airPeakY = fighter.y;
      let leftGround = false;
      for (let frame = 0; frame < 150 && fighter.alive; frame++) {
        battle.setMove(leftGround ? 0 : dir);
        battle.step();
        leftGround ||= !fighter.onGround;
        if (leftGround && fighter.onGround) break;
      }
      expect(leftGround).toBe(true);
      if (index < 3) {
        expect(fighter.alive).toBe(true);
        expect(fighter.onGround).toBe(true);
        expect(fighter.y).toBe(battle.terrain.topSurface(worldX(edge + 32)));
        expect(fighter.hp).toBeGreaterThan(650);
      } else {
        expect(fighter.alive).toBe(false);
        expect(fighter.deathCause).toBe('fall');
        expect(fighter.y).toBeGreaterThan(battle.ringOutY);
      }
    }
  });

  it('2:2는 높은 단과 중간 단에 한 쌍씩 시작한다', () => {
    for (const seed of [1, 27, 104729]) {
      const battle = quarryBattle(seed, ['general', 'archer', 'gumiho', 'driller']);
      const [a, b, c, d] = battle.fighters;
      expect(a!.y).toBe(b!.y);
      expect(c!.y).toBe(d!.y);
      expect(a!.y).not.toBe(c!.y);
      expect(a!.x + b!.x).toBe(WORLD_W);
      expect(c!.x + d!.x).toBe(WORLD_W);
    }
  });

  it.each([
    { x: 620, impact: 578, survives: true },
    { x: 1062, impact: 1020, survives: false },
  ])('폭발로 발판 끝에서 밀리면 위치에 따라 아래 단에 착지하거나 탈락한다 ($x)', ({ x, impact, survives }) => {
    const battle = quarryBattle();
    const [shooter, foe] = battle.fighters;
    shooter!.x = 1900;
    shooter!.y = battle.terrain.topSurface(shooter!.x);
    foe!.x = x;
    foe!.y = battle.terrain.topSurface(x);
    foe!.airPeakY = foe!.y;
    battle.phase = 'PROJECTILE_FLIGHT';
    battle.projectiles.push(battle.newProjectile(0, 1, 'hwapo', impact, foe!.y, 0, 0));
    for (let frame = 0; frame < 240; frame++) battle.step();
    expect(foe!.alive).toBe(survives);
    if (survives) {
      expect(foe!.onGround).toBe(true);
      expect(foe!.y).toBe(568);
      expect(foe!.hp).toBeLessThan(800);
    } else {
      expect(foe!.deathCause).toBe('fall');
    }
  });
});
