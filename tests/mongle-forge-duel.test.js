'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const Forge = require('../games/mongle-forge/forge-engine.js');
const source = fs.readFileSync(path.join(__dirname, '../games/mongle-forge/forge-duel-combat.js'), 'utf8');
const Duel = vm.runInNewContext(source + ';ForgeDuelCombat', { Forge });
const blade = (level, enchantments = ['lunar', 'lunar', 'lunar'], magic) =>
  Forge.restore({ level, bestLevel: level, enchantments, ...(magic && { magic: { id: magic, peak: level } }) });
const tick = (fight, ms) => {
  for (let remaining = ms; remaining > 0 && fight.status === 'active'; remaining -= 10) {
    Duel.step(fight, Math.min(remaining, 10));
  }
};
const inRange = fight => {
  fight.player.x = fight.boss.x;
  fight.player.y = fight.boss.y + 13;
  return fight;
};

test('manual combat can be lost without dealing any damage, even with a +100 magic sword', () => {
  const state = blade(100, undefined, 'fire');
  const saved = Forge.serialize(state);
  const fight = Duel.create(state);
  tick(fight, 15000);
  assert.equal(fight.boss.hp, 240000);
  assert.equal(fight.hits, 0);
  assert.equal(fight.status, 'lost');
  assert.equal(Forge.serialize(state), saved);
});

test('one attack tap approaches the boss and lands one strike', () => {
  const fight = Duel.create(blade(100));
  const startY = fight.player.y;
  assert(Duel.act(fight, 'attack'));
  assert.equal(Duel.act(fight, 'attack'), false);
  tick(fight, 150);
  assert(fight.player.y < startY);
  assert.equal(fight.boss.hp, fight.boss.maxHp);
  tick(fight, 600);
  assert.equal(fight.hits, 1);
  assert(fight.boss.hp < fight.boss.maxHp);
});

test('a timed dodge interrupts a swing, moves to safety and strengthens the next attack', () => {
  const fight = Duel.create(blade(100));
  tick(fight, 1250);
  const attack = fight.attack;
  assert.equal(Duel.dodgeCue(fight), false);
  tick(fight, attack.at - fight.time - 190);
  assert.equal(Duel.dodgeCue(fight), true);
  assert(Duel.act(fight, 'attack'));
  assert(Duel.act(fight, 'dodge'));
  assert.equal(fight.swing, null);
  assert.equal(Duel.act(fight, 'dodge'), false);
  assert.equal(Duel.act(fight, 'attack'), false);
  tick(fight, 210);
  assert.equal(fight.player.hp, 100);
  assert.equal(fight.boss.hp, fight.boss.maxHp);
  assert.equal(fight.evades, 1);
  assert(!attack.shapes.some(shape => Duel.contains(shape, fight.player)));
  assert(Duel.act(fight, 'attack'));
  tick(fight, 750);
  assert(fight.events.some(e => e.label === '회피 반격' && e.value > fight.power * 3));
  assert.equal(fight.exposedUntil, 0);
});

test('early dodging creates space without earning a counter press', () => {
  const fight = Duel.create(blade(100));
  tick(fight, 1250);
  const start = { ...fight.player };
  assert(Duel.act(fight, 'dodge'));
  tick(fight, 210);
  assert(Math.hypot(fight.player.x - start.x, fight.player.y - start.y) > 12);
  tick(fight, 950);
  assert.equal(fight.evades, 0);
  assert.equal(fight.player.hp, 100);
});

test('three identical engravings contribute individually and leave the stored weapon untouched', () => {
  const state = blade(100, ['lunar', 'lunar', 'lunar']);
  const before = Forge.serialize(state);
  const triple = inRange(Duel.create(state));
  const single = inRange(Duel.create(blade(100, ['lunar'])));
  assert.equal(triple.effects.length, 3);
  assert(triple.power > single.power);
  for (const f of [triple, single]) {
    f.recoverUntil = 2000;
    Duel.act(f, 'attack');
    tick(f, 155);
  }
  assert(triple.boss.hp < single.boss.hp);
  assert.equal(Forge.serialize(state), before);
});

test('an earned element has a distinct combat outcome, and higher magic stage increases potency', () => {
  const fire = inRange(Duel.create(blade(100, ['lunar'], 'fire')));
  assert(Duel.act(fire, 'attack'));
  tick(fire, 600);
  assert(fire.events.some(e => e.type === 'burn' && e.label === '화염 연소'));
  const ice = inRange(Duel.create(blade(100, ['lunar'], 'ice')));
  assert(Duel.act(ice, 'attack'));
  tick(ice, 155);
  assert(ice.chillUntil > ice.time);
  const thunder = inRange(Duel.create(blade(100, ['lunar'], 'thunder')));
  thunder.hits = 2;
  assert(Duel.act(thunder, 'attack'));
  tick(thunder, 155);
  assert(thunder.events.some(e => e.label === '전격 연쇄'));
  const normal = inRange(Duel.create(blade(100, ['lunar'])));
  const voidFight = inRange(Duel.create(blade(100, ['lunar'], 'void')));
  for (const f of [normal, voidFight]) {
    f.recoverUntil = 1000;
    Duel.act(f, 'attack');
    tick(f, 180);
  }
  assert(voidFight.boss.hp < normal.boss.hp);
  const radiance = Duel.create(blade(100, ['lunar'], 'radiance'));
  radiance.player.hp = 50;
  tick(radiance, 1250);
  tick(radiance, radiance.attack.at - radiance.time - 100);
  assert(Duel.act(radiance, 'dodge'));
  tick(radiance, 100);
  assert(radiance.player.hp > 50);
  const highPeak = Duel.create(Forge.restore({ level: 100, magic: { id: 'fire', peak: 200 }, enchantments: ['lunar'] }));
  assert(highPeak.power > fire.power);
});

test('HP thresholds add patterns without scaling boss HP to player strength', () => {
  const fight = inRange(Duel.create(blade(100)));
  assert(fight.power > Duel.create(blade(80)).power);
  assert.equal(fight.boss.maxHp, Duel.create(blade(0)).boss.maxHp);
  fight.boss.hp = 156100;
  Duel.act(fight, 'attack');
  tick(fight, 160);
  assert.equal(fight.phase, 2);
  tick(fight, 1090);
  assert.equal(fight.attack.id, 'volley');
  const hpBefore = fight.player.hp;
  tick(fight, fight.attack.at - fight.time);
  assert.equal(fight.player.hp, hpBefore);
  assert(fight.shots.length >= 5);
  const later = inRange(Duel.create(blade(100)));
  later.boss.hp = 72100;
  Duel.act(later, 'attack');
  tick(later, 1250);
  assert.equal(later.phase, 3);
  assert.equal(later.attack.id, 'ring');
  assert.equal(later.attack.shapes[0].type, 'ring');
});

test('win is terminal and huge saved enhancement values keep combat finite', () => {
  const fight = inRange(Duel.create(blade(10n ** 120n, undefined, 'void')));
  assert(Number.isFinite(fight.power));
  fight.boss.hp = 1;
  Duel.act(fight, 'attack');
  tick(fight, 200);
  assert.equal(fight.status, 'won');
  const time = fight.time;
  Duel.step(fight, 100);
  assert.equal(fight.time, time);
  assert.equal(Duel.act(fight, 'attack'), false);
});
