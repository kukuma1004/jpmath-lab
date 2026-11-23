import { describe, expect, it } from 'vitest';
import { CELL, WORLD_H, WORLD_W } from '../src/game/config/constants';
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { AIActor } from '../src/game/ai/ai';
import { MAPS } from '../src/game/data/maps';
import { Mat, Terrain } from '../src/game/terrain/terrain';
import type { BattleConfig } from '../src/game/combat/types';

/** 2:2 규칙 시험. 장수 순서는 [1팀, 2팀, 1팀, 2팀] */
const FOUR = ['general', 'archer', 'mudang', 'gumiho'];

function runUntil(b: Battle, cond: () => boolean, max = 6000): number {
  let n = 0;
  while (!cond() && n < max) { b.step(); n++; }
  return n;
}

function blank4(partial: Partial<BattleConfig> = {}): Battle {
  const b = new Battle(defaultConfig({ chars: FOUR, controllers: ['human', 'human', 'human', 'human'], ...partial }), true);
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

function aim(b: Battle, who: number) {
  b.current = who;
  b.phase = 'AIM';
  b.phaseT = 0;
  b.timeLeft = 30;
}

describe('2:2 대전', () => {
  it('편이 번갈아 쏘고, 같은 편 안에서는 차례가 돌아간다', () => {
    const b = new Battle(defaultConfig({ seed: 31, chars: FOUR, controllers: ['human', 'human', 'human', 'human'] }));
    expect(b.fighters.map((f) => f.team)).toEqual([0, 1, 0, 1]);
    const order: number[] = [];
    for (let k = 0; k < 6; k++) {
      runUntil(b, () => b.phase === 'AIM');
      order.push(b.current);
      b.skipTurn();
      runUntil(b, () => b.phase === 'TURN_START' || b.phase === 'GAME_OVER');
    }
    const teams = order.map((i) => i % 2);
    for (let k = 1; k < teams.length; k++) expect(teams[k]).not.toBe(teams[k - 1]);
    // 같은 편의 두 장수가 번갈아 나온다
    const team0 = order.filter((i) => i % 2 === 0);
    expect(team0[0]).not.toBe(team0[1]);
    expect(team0[0]).toBe(team0[2]);
  });

  it('쓰러진 장수는 건너뛰고 같은 편의 남은 장수가 쏜다', () => {
    const b = new Battle(defaultConfig({ seed: 32, chars: FOUR, controllers: ['human', 'human', 'human', 'human'] }));
    runUntil(b, () => b.phase === 'AIM');
    // 상대 편의 한 명을 쓰러뜨린다
    const enemyTeam = 1 - b.cur.team;
    const dead = b.fighters.find((f) => f.team === enemyTeam)!;
    b.applyDamage(dead, 9999, dead.x, dead.y, false, 'blast', -1);
    expect(dead.alive).toBe(false);
    const seen: number[] = [];
    for (let k = 0; k < 6; k++) {
      b.skipTurn();
      runUntil(b, () => b.phase === 'AIM' || b.phase === 'GAME_OVER');
      if (b.phase === 'GAME_OVER') break;
      seen.push(b.current);
      expect(b.cur.alive).toBe(true);
    }
    expect(seen).not.toContain(dead.idx);
    expect(b.phase).not.toBe('GAME_OVER');
  });

  it('한 편이 모두 쓰러지면 다른 편이 이긴다', () => {
    const b = blank4();
    for (const [i, x] of [[0, 400], [1, 2000], [2, 600], [3, 1800]] as const) place(b, i, x);
    for (const f of b.fighters) if (f.team === 1) b.applyDamage(f, 9999, f.x, f.y, false, 'blast', 0);
    aim(b, 0);
    b.skipTurn();
    runUntil(b, () => b.phase === 'GAME_OVER', 1200);
    expect(b.winner).toBe(0);
    expect(b.endReason).toBe('hp');
    expect(b.fighters[0]!.anim).toBe('victory');
    expect(b.fighters[2]!.anim).toBe('victory');
  });

  it('두 편이 한꺼번에 모두 쓰러지면 무승부다', () => {
    const b = blank4();
    // 넷이 한곳에 모여 있고 체력이 조금씩만 남았다
    for (const [i, x] of [[0, 1160], [1, 1200], [2, 1180], [3, 1220]] as const) place(b, i, x);
    for (const f of b.fighters) f.hp = 5;
    aim(b, 0);
    b.setAngle(90);
    b.fireNow(25);
    runUntil(b, () => b.phase === 'GAME_OVER', 3000);
    expect(b.phase).toBe('GAME_OVER');
    expect(b.winner).toBe(-1);
  });

  it('같은 편을 맞혀도 피해는 들어가지만 쏜 사람의 공(피해량·명중)으로 치지 않는다', () => {
    const b = blank4();
    for (const [i, x] of [[0, 400], [1, 2100], [2, 470], [3, 1900]] as const) place(b, i, x);
    const ally = b.fighters[2]!;
    const shooter = b.fighters[0]!;
    const hp0 = ally.hp;
    b.applyDamage(ally, 120, ally.x, ally.y, false, 'blast', shooter.idx, 7);
    expect(ally.hp).toBe(hp0 - 120);
    expect(shooter.stats.damageDealt).toBe(0);
    expect(shooter.stats.hits).toBe(0);
    // 상대를 맞히면 공으로 친다
    const foe = b.fighters[1]!;
    b.applyDamage(foe, 100, foe.x, foe.y, false, 'blast', shooter.idx, 8);
    expect(shooter.stats.damageDealt).toBe(100);
    expect(shooter.stats.hits).toBe(1);
  });

  it('턴을 다 쓰면 편의 남은 체력 합 비율로 판정한다', () => {
    const b = new Battle(defaultConfig({ seed: 33, chars: FOUR, controllers: ['human', 'human', 'human', 'human'], turnLimit: 2 }));
    runUntil(b, () => b.phase === 'AIM');
    // 2편 한 명만 크게 다쳤다 → 1편이 이긴다
    b.fighters[1]!.hp = 300;
    b.skipTurn();
    runUntil(b, () => b.phase === 'AIM');
    b.skipTurn();
    runUntil(b, () => b.phase === 'GAME_OVER');
    expect(b.endReason).toBe('limit');
    expect(b.winner).toBe(0);
    expect(b.teamHpRatio(0)).toBeGreaterThan(b.teamHpRatio(1));
  });

  it('넷이어도 같은 입력이면 결과가 같다(기록 재생·직렬화)', () => {
    const cfg = defaultConfig({ seed: 5150, mapId: 'forest', chars: FOUR, controllers: ['human', 'human', 'human', 'human'] });
    const a = new Battle(cfg);
    for (let k = 0; k < 4; k++) {
      runUntil(a, () => a.phase === 'AIM' || a.phase === 'GAME_OVER');
      if (a.phase === 'GAME_OVER') break;
      a.setAngle(a.cur.team === 0 ? 55 + k : 125 - k);
      a.fireNow(62 + k * 3);
      runUntil(a, () => a.phase === 'TURN_START' || a.phase === 'GAME_OVER');
    }
    const b = new Battle(cfg);
    const log = [...a.log];
    let li = 0;
    while (b.stepNo < a.stepNo) {
      while (li < log.length && log[li]!.s === b.stepNo) { b.applyCommand(log[li]!.c, log[li]!.a); li++; }
      b.step();
    }
    expect(b.hash()).toBe(a.hash());
    const c = Battle.deserialize(a.serialize());
    for (let i = 0; i < 600; i++) { a.step(); c.step(); }
    expect(c.hash()).toBe(a.hash());
    expect(c.current).toBe(a.current);
  });

  it('모든 전장에서 넷이 안전하게 서고 양 편이 충분히 떨어져 출발한다', () => {
    for (const m of MAPS) {
      for (const seed of [1, 2, 3, 4]) {
        const b = new Battle(defaultConfig({ mapId: m.id, seed, chars: FOUR, controllers: ['human', 'human', 'human', 'human'] }));
        for (const f of b.fighters) {
          expect(b.terrain.solidAt(f.x, f.y), `${m.id}/${seed} ${f.idx} 발밑`).toBe(true);
          for (const foe of b.fighters) if (foe.team !== f.team) expect(Math.abs(f.x-foe.x)).toBeGreaterThanOrEqual(280);
        }
        // 같은 편끼리 너무 붙어 서지 않는다
        expect(Math.abs(b.fighters[0]!.x - b.fighters[2]!.x)).toBeGreaterThan(100);
        expect(Math.abs(b.fighters[1]!.x - b.fighters[3]!.x)).toBeGreaterThan(100);
        for (let i = 0; i < 30; i++) b.step();
        expect(b.fighters.every((f) => f.onGround), `${m.id}/${seed} 서 있기`).toBe(true);
      }
    }
  });

  it('AI는 같은 편을 피해 상대 편을 노린다', () => {
    const b = new Battle(defaultConfig({ seed: 41, mapId: 'sanseong', chars: FOUR, controllers: ['ai', 'ai', 'ai', 'ai'] }));
    const actors = b.fighters.map((f) => new AIActor(f.idx, 'normal', 0));
    let friendly = 0, enemy = 0;
    for (let i = 0; i < 60 * 60 * 3 && b.turnNo < 9 && b.phase !== 'GAME_OVER'; i++) {
      for (const a of actors) a.update(b, 1e9);
      const shooter = b.cur;
      b.step();
      for (const e of b.drainEvents()) {
        if (e.type !== 'damage' || e.cause !== 'blast') continue;
        const t = b.fighters[e.target]!;
        if (t.team === shooter.team) friendly += e.amount; else enemy += e.amount;
      }
    }
    expect(enemy).toBeGreaterThan(friendly * 3);
  });
});
