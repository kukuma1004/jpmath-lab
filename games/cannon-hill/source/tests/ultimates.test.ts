import { describe, expect, it } from 'vitest';
import { Battle, defaultConfig, ULTIMATE_TURN } from '../src/game/combat/battle';
import { CHARACTERS } from '../src/game/data/characters';
import { weapon } from '../src/game/data/weapons';
import { Mat } from '../src/game/terrain/terrain';

function battle(chars = ['mukyeong', 'archer']) {
  const b = new Battle(defaultConfig({ chars, starterMatch: true }), true);
  for (let x = 0; x < 1200; x++) {
    for (let y = 450; y < 600; y++) b.terrain.set(x, y, Mat.Bedrock);
  }
  b.terrain.pending = [];
  b.fighters.forEach((f, i) => { f.x = 380 + i * 480; f.y = f.airPeakY = 900; });
  return b;
}

function stepUntil(b: Battle, ready: () => boolean) {
  for (let i = 0; i < 1000 && !ready(); i++) b.step();
  expect(ready()).toBe(true);
}

describe('장수마다 자기 세 번째 차례에 궁극기가 열린다', () => {
  it('2:2에서도 각자 따로 충전하고, 선택이나 취소가 아닌 발사에서 한 번 사용한다', () => {
    const b = battle(['mukyeong', 'archer', 'yeonhwa', 'dolbi']);
    stepUntil(b, () => b.phase === 'AIM');
    b.selectWeapon(2);
    expect(b.cur.slot).toBe(0);
    while (b.cur.idx !== 0 || b.cur.turnsTaken < ULTIMATE_TURN) {
      b.skipTurn();
      stepUntil(b, () => b.phase === 'AIM');
    }
    expect(b.fighters.map(f => b.ultimateReady(f))).toEqual([true, false, false, false]);
    b.selectWeapon(2);
    b.setCharge(true);
    b.cancelCharge();
    expect(b.phase).toBe('AIM');
    expect(b.ultimateReady(b.cur)).toBe(true);
    b.setAngle(50);
    b.fireNow(60);
    expect(b.ultimateReady(b.fighters[0]!)).toBe(false);
    expect(b.fighters[0]!.slot).toBe(0);
    expect(b.projectiles.map(p => p.weaponId)).toEqual(['inkAmbush', 'inkAmbush', 'inkAmbush']);
    expect(b.drainEvents().filter(e => e.type === 'ultimate')).toHaveLength(1);
    expect(Battle.deserialize(b.serialize()).fighters[0]!.ultimateUsed).toBe(true);
  });

  it('그림자 위치 사이에 벽이 있으면 적을 관통해 복제하지 않는다', () => {
    const b = battle();
    b.phase = 'AIM';
    b.setAngle(50);
    b.selectWeapon(1);
    for (let y = 320; y < 450; y++) b.terrain.set(175, y, Mat.Core);
    b.fireNow(70);
    expect(b.projectiles).toHaveLength(1);
    expect(b.drainEvents().some(e => e.type === 'shadow')).toBe(false);
  });

  it('장수별 시작 체력과 이름 있는 궁극기가 데이터와 일치한다', () => {
    const b = battle(CHARACTERS.map(c => c.id));
    expect(b.fighters.map(f => f.hp)).toEqual(CHARACTERS.map(c => c.hp));
    expect(new Set(CHARACTERS.map(c => c.hp)).size).toBeGreaterThan(8);
    expect(new Set(CHARACTERS.map(c => weapon(c.ultimate).name)).size).toBe(CHARACTERS.length);
    expect(b.fighters.find(f => f.charId === 'turtle')!.hp).toBeGreaterThan(b.cur.hp);
  });
});
