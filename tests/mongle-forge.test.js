'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Forge = require('../games/mongle-forge/forge-engine.js');

test('a +32 save migrates its resources, failure correction and earlier records', () => {
  const old = { level: 32, bestLevel: 32, shards: 654321, forgeMissesByLevel: Array(32).fill(0), cleared: [true, true], polish: 3, echo: 2, miner: 4, region: 7, paidAt: 100000 };
  old.forgeMissesByLevel[30] = 2;
  const state = Forge.restore(old, 100000);
  assert.equal(state.level, 32n);
  assert.equal(state.bestLevel, 32n);
  assert.equal(state.shards, 654321n);
  assert.equal(state.pity['31'], 2400);
  assert.deepEqual(state.legacy, { cleared: [true, true], polish: 3, echo: 2, miner: 4, region: 7 });
  assert.deepEqual(Forge.restore(JSON.parse(Forge.serialize(state)), 100000), state);
});

test('every stage has three mutually exclusive outcomes and total probability is 100%', () => {
  for (const level of [0n, 2n, 5n, 11n, 32n, 99n, 123456789012345678901234567890n]) {
    const offer = Forge.preview(Forge.restore({ level: level.toString() }, 100000));
    assert.equal(offer.success + offer.reset + offer.shatter, 10000);
    assert(offer.cost > 0n);
    assert(offer.success > 0 && offer.success <= 10000);
    if (level >= 5n) assert(offer.shatter > 0);
  }
});

function funded(level = 31) {
  return Forge.restore({ level, bestLevel: level, shards: '9999999999999999999999999999999999999', paidAt: 100000 }, 100000);
}

test('the exact success boundary resets the sword and charges a single attempt', () => {
  const state = funded();
  const offer = Forge.preview(state);
  const before = state.shards;
  const event = Forge.act(state, 100000, () => offer.success / 10000);
  assert.equal(event.kind, 'reset');
  assert.equal(state.level, 0n);
  assert.equal(state.broken, false);
  assert.equal(state.shards, before - offer.cost);
  assert.equal(state.bestLevel, 31n);
  assert.equal(state.pity['32'], Forge.recoveryBonus);
  assert.equal(state.attempts, 1n);
});

test('the destruction boundary breaks the sword, survives reload and requires re-forging', () => {
  const state = funded();
  const offer = Forge.preview(state);
  const event = Forge.act(state, 100000, () => (offer.success + offer.reset) / 10000);
  assert.equal(event.kind, 'shatter');
  assert.equal(state.broken, true);
  assert.equal(state.shattered, 1n);
  const restored = Forge.restore(JSON.parse(Forge.serialize(state)), 100000);
  assert.equal(restored.broken, true);
  const price = Forge.preview(restored).cost;
  const wallet = restored.shards;
  assert.equal(Forge.act(restored, 100000 + Forge.cooldown).kind, 'reforge');
  assert.equal(restored.broken, false);
  assert.equal(restored.level, 0n);
  assert.equal(restored.shards, wallet - price);
  assert.equal(restored.bestLevel, 31n);
  assert.equal(restored.attempts, 1n);
});

test('rapid retries and insufficient resources do not consume anything', () => {
  const state = funded();
  Forge.act(state, 100000, () => 0);
  const before = Forge.serialize(state);
  assert.equal(Forge.act(state, 100001, () => 0), null);
  assert.equal(Forge.serialize(state), before);
  state.shards = 0n;
  const empty = Forge.serialize(state);
  assert.equal(Forge.act(state, 110000, () => 0), null);
  assert.equal(Forge.serialize(state), empty);
});

test('income is granted once, capped at eight hours and available with a broken sword', () => {
  const state = funded(32);
  state.broken = true;
  state.level = 0n;
  const rate = Forge.income(state);
  const now = 100000 + 24 * 60 * 60 * 1000;
  assert.equal(Forge.collectPassive(state, now), rate * 28800n);
  assert.equal(Forge.collectPassive(state, now), 0n);
  assert.equal(Forge.income(state), rate);
});

test('strengthening continues above JavaScript safe integer precision without rounding', () => {
  const current = 900719925474099312345678901234567890n;
  const wallet = Forge.cost(current + 1n) * 4n;
  const state = Forge.restore({ level: current.toString(), bestLevel: current.toString(), shards: wallet.toString(), paidAt: 100000 }, 100000);
  const offer = Forge.preview(state);
  assert.equal(offer.target, current + 1n);
  const event = Forge.act(state, 100000, () => 0);
  assert.equal(event.kind, 'success');
  assert.equal(state.level, current + 1n);
  const restored = Forge.restore(JSON.parse(Forge.serialize(state)), 100000);
  assert.equal(restored.level, current + 1n);
  assert.equal(restored.shards, wallet - offer.cost);
  assert(Forge.formAt(restored.level).next > restored.level);
});

test('post +48 forms keep changing and failed attempts cannot erase the collection', () => {
  assert.equal(Forge.formAt(36n).level, 36n);
  assert.equal(Forge.formAt(40n).level, 40n);
  assert.equal(Forge.formAt(44n).level, 44n);
  assert.equal(Forge.formAt(48n).level, 48n);
  assert.notEqual(Forge.formAt(49n).index, Forge.formAt(53n).index);
  assert.equal(Forge.formAt(49n).index, Forge.formAt(89n).index);
  assert(Forge.formAt(89n).awakening > Forge.formAt(49n).awakening);
  const state = funded(80);
  state.pity['81'] = 9000;
  assert.equal(Forge.preview(state).success, 9500);
  assert(Forge.preview(state).shatter > 0);
  Forge.act(state, 100000, () => 0.9999);
  assert.equal(state.bestLevel, 80n);
  assert.equal(Forge.forms.filter(form => form.level <= state.bestLevel).length, 20);
});
