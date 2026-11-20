import { describe, expect, it } from 'vitest';
import { GameManager } from '../src/game/GameManager';
import { FIXED_DT } from '../src/physics/config';

const finish = (game: GameManager) => {
  for (let i = 0; i < 240 * 60 && game.busy; i++) game.update(FIXED_DT);
  expect(game.phase).toBe('aiming');
  expect(game.engine.settled).toBe(true);
};

describe('shot lifecycle and replay', () => {
  it('blocks shots before start and duplicate shots throughout stroke and motion', () => {
    const game = new GameManager();
    expect(game.shoot()).toBe(false);
    game.start();
    expect(game.shoot()).toBe(true);
    expect(game.shoot()).toBe(false);
    for (let i = 0; i < 130; i++) game.update(FIXED_DT);
    expect(game.phase).toBe('moving');
    expect(game.shoot()).toBe(false);
    expect(game.replay()).toBe(false);
    finish(game);
    expect(game.shotCount).toBe(1);
  });

  it('pause freezes cue animation and physics without losing a pending shot', () => {
    const game = new GameManager(); game.start(); game.shoot();
    game.update(.1);
    game.paused = true;
    const stroke = game.strokeProgress;
    game.update(.1);
    expect(game.strokeProgress).toBe(stroke);
    expect(game.engine.time).toBe(0);
    expect(game.shoot()).toBe(false);
    game.paused = false;
    for (let i = 0; i < 130; i++) game.update(FIXED_DT);
    game.paused = true;
    const state = game.engine.snapshot();
    for (let i = 0; i < 20; i++) game.update(.1);
    expect(game.engine.snapshot()).toEqual(state);
    game.paused = false; finish(game);
    expect(game.shotCount).toBe(1);
  });

  it('replays the same input from the same positions and spin without adding a shot', () => {
    const game = new GameManager(); game.reset('spin');
    game.tip = { x: .2, y: -.55 }; game.power = .42;
    game.shoot(); finish(game);
    const last = game.lastShot!;
    const finalBalls = game.engine.snapshot().balls;
    expect(game.replay()).toBe(true); finish(game);
    expect(game.engine.snapshot().balls).toEqual(finalBalls);
    expect(game.lastShot).toBe(last);
    expect(game.shotCount).toBe(1);
    expect(game.replaying).toBe(false);
  });

  it('a second shot has a fresh relative event timeline and isolated snapshots', () => {
    const game = new GameManager(); game.reset('collision');
    game.shoot(); finish(game);
    const first = structuredClone(game.lastShot!);
    const firstAfter = game.engine.snapshot().balls;
    game.angle = 1.3; game.power = .35;
    game.shoot(); finish(game);
    expect(game.shotCount).toBe(2);
    expect(game.lastShot!.events[0]).toMatchObject({ type: 'shot', time: 0 });
    expect(game.lastShot!.before.balls).toEqual(firstAfter);
    expect(first.after.balls).toEqual(firstAfter);
    const events = game.lastShot!.events;
    for (let i = 1; i < events.length; i++) expect(events[i].time).toBeGreaterThanOrEqual(events[i - 1].time);
  });

  it('reset cancels an in-flight shot and clears its history without a ghost finish', () => {
    const game = new GameManager(); let finishes = 0;
    game.onFinished = () => finishes++;
    game.start(); game.shoot();
    for (let i = 0; i < 130; i++) game.update(FIXED_DT);
    expect(game.phase).toBe('moving');
    game.reset('three');
    for (let i = 0; i < 240; i++) game.update(FIXED_DT);
    expect(game.engine.balls).toHaveLength(3);
    expect(game.phase).toBe('aiming');
    expect(game.lastShot).toBeNull();
    expect(game.shotCount).toBe(0);
    expect(finishes).toBe(0);
  });
});
