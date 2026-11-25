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
const tick = (fight, ms, input) => {
  for (let remaining = ms; remaining > 0 && fight.status === 'active'; remaining -= 10) {
    Duel.step(fight, Math.min(remaining, 10), input);
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

test('melee range, startup and recovery make position and attack timing matter', () => {
  const fight = Duel.create(blade(100));
  assert(Duel.act(fight, 'heavy'));
  assert.equal(Duel.act(fight, 'dodge'), false);
  tick(fight, 345);
  assert.equal(fight.boss.hp, fight.boss.maxHp);
  assert(fight.events.some(e => e.type === 'miss'));
  tick(fight, 500);
  inRange(fight);
  assert(Duel.act(fight, 'attack'));
  tick(fight, 120);
  assert.equal(fight.hits, 1);
  assert(fight.boss.hp < fight.boss.maxHp);
});

test('a well-timed parry protects HP and opens a manual counter, and evasion spends stamina', () => {
  const fight = Duel.create(blade(100));
  tick(fight, 1250);
  const attack = fight.attack;
  assert(attack.parryable);
  tick(fight, attack.at - fight.time - 120);
  assert(Duel.act(fight, 'parry'));
  tick(fight, 120);
  assert.equal(fight.player.hp, 100);
  assert.equal(fight.boss.hp, fight.boss.maxHp);
  assert.equal(fight.parries, 1);
  assert.equal(Duel.act(fight, 'parry'), false);
  inRange(fight);
  assert(Duel.act(fight, 'heavy'));
  tick(fight, 345);
  assert(fight.events.some(e => e.label === '패링 반격' && e.value > fight.power * 4));
  tick(fight, 480);
  const before = fight.player.x;
  const stamina = fight.player.stamina;
  assert(Duel.act(fight, 'dodge', { x: -1, y: 0 }));
  tick(fight, 150);
  assert(fight.player.x < before - 9);
  assert(fight.player.stamina < stamina);
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
    tick(f, 120);
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
  tick(ice, 150);
  assert(ice.chillUntil > ice.time);
  const thunder = inRange(Duel.create(blade(100, ['lunar'], 'thunder')));
  thunder.hits = 2;
  assert(Duel.act(thunder, 'attack'));
  tick(thunder, 150);
  assert(thunder.events.some(e => e.label === '전격 연쇄'));
  const normal = inRange(Duel.create(blade(100, ['lunar'])));
  const voidFight = inRange(Duel.create(blade(100, ['lunar'], 'void')));
  for (const f of [normal, voidFight]) {
    Duel.act(f, 'heavy');
    tick(f, 350);
  }
  assert(voidFight.boss.hp < normal.boss.hp);
  const radiance = Duel.create(blade(100, ['lunar'], 'radiance'));
  radiance.player.hp = 50;
  tick(radiance, 1250);
  tick(radiance, radiance.attack.at - radiance.time - 100);
  assert(Duel.act(radiance, 'parry'));
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
  tick(fight, 130);
  assert.equal(fight.phase, 2);
  tick(fight, 1120);
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
  assert.equal(later.attack.parryable, false);
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
  assert.equal(Duel.act(fight, 'heavy'), false);
});
