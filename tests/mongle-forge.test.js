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

test('same-level appraisal reflects the actual persistent magical affix', () => {
  const expected = {
    cinder: 646416n,
    frost: 861888n,
    storm: 1023492n,
    astral: 1292832n,
    lunar: 1723776n,
  };
  for (const [enchantment, value] of Object.entries(expected)) {
    const state = Forge.restore({ version: 2, level: '32', bestLevel: '32', shards: '9000000', enchantment }, 100000);
    assert.equal(Forge.appraisal(state).base, 538680n);
    assert.equal(Forge.appraisal(state).value, value);
    Forge.collectPassive(state, 102000);
    assert.equal(state.enchantment, enchantment);
    const saved = Forge.restore(JSON.parse(Forge.serialize(state)), 102000, () => 0.99);
    assert.equal(saved.enchantment, enchantment);
    const before = Forge.appraisal(saved).value;
    Forge.act(saved, 103000, () => 0);
    assert(Forge.appraisal(saved).value > before);
    assert.equal(saved.enchantment, enchantment);
  }
});

test('magical affinity survives a reset and is drawn again when a broken sword is reforged', () => {
  const state = Forge.restore({ version: 2, level: '31', bestLevel: '31', shards: '9000000', enchantment: 'astral' }, 100000);
  const odds = Forge.preview(state);
  const reset = Forge.act(state, 100000, () => odds.success / 10000);
  assert.equal(reset.kind, 'reset');
  assert.equal(state.enchantment, 'astral');
  assert.equal(Forge.appraisal(state).value, 288n);

  state.level = 31n;
  const nextOdds = Forge.preview(state);
  const broken = Forge.act(state, 101000, () => (nextOdds.success + nextOdds.reset) / 10000);
  assert.equal(broken.kind, 'shatter');
  assert.equal(Forge.appraisal(state).value, 0n);
  const newSword = Forge.act(state, 102000, () => 0.99);
  assert.equal(newSword.kind, 'reforge');
  assert.equal(state.enchantment, 'lunar');
  assert.equal(Forge.appraisal(state).value, 384n);
  assert.equal(state.bestLevel, 31n);
});

test('affix creation respects draw boundaries and old-save migration is stable', () => {
  for (const [roll, expected] of [[0,'cinder'],[0.38,'frost'],[0.66,'storm'],[0.84,'astral'],[0.96,'lunar']]) {
    assert.equal(Forge.restore(null, 100000, () => roll).enchantment, expected);
  }
  const old = { version: 2, level: '32', bestLevel: '32', shards: '100000' };
  assert.equal(Forge.restore(old, 100000, () => 0).enchantment, 'astral');
  assert.equal(Forge.restore(old, 100000, () => 0.99).enchantment, 'astral');
  const veryHigh = Forge.restore({ level: '900719925474099312345678901234567890', enchantment: 'lunar' }, 100000);
  const appraisal = Forge.appraisal(veryHigh);
  assert(appraisal.value > appraisal.base);
  assert.equal(Forge.restore(JSON.parse(Forge.serialize(veryHigh)),100000).enchantment,'lunar');
});

test('special enhancement adds distinct effects up to three without changing the sword level', () => {
  const state = Forge.restore({ version: 2, level: '32', shards: '9000000', enchantment: 'astral' }, 100000);
  const first = Forge.enchantPreview(state);
  assert.equal(first.success, 6000);
  const draws = [0.5999, 0.9999];
  const added = Forge.enchant(state, 100000, () => draws.shift());
  assert.equal(added.kind, 'enchant');
  assert.equal(added.enchantment, 'lunar');
  assert.deepEqual(state.enchantments, ['astral', 'lunar']);
  assert.equal(state.enchantment, 'astral');
  assert.equal(state.level, 32n);
  assert.equal(state.shards, 9000000n - first.cost);
  assert.equal(Forge.enchantPreview(state).success, 3000);
  assert(Forge.enchantPreview(state).cost > first.cost);
  Forge.enchant(state, 101000, () => 0);
  assert.deepEqual(state.enchantments, ['astral', 'lunar', 'cinder']);
  assert.equal(Forge.enchantPreview(state).full, true);
  const snapshot = Forge.serialize(state);
  assert.equal(Forge.enchant(state, 102000, () => { throw Error('must not draw at capacity'); }), null);
  assert.equal(Forge.serialize(state), snapshot);
  assert.deepEqual(Forge.restore(JSON.parse(snapshot), 102000).enchantments, state.enchantments);
});

test('special failure boundaries charge once and preserve level, effects and normal pity', () => {
  for (const effects of [['frost'], ['frost', 'storm']]) {
    const state = Forge.restore({ version: 2, level: '32', shards: '9000000', enchantments: effects, pity: { 33: 2400 } }, 100000);
    const offer = Forge.enchantPreview(state);
    const result = Forge.enchant(state, 100000, () => offer.success / 10000);
    assert.equal(result.kind, 'enchant-fail');
    assert.equal(state.shards, 9000000n - offer.cost);
    assert.equal(state.level, 32n);
    assert.deepEqual(state.enchantments, effects);
    assert.deepEqual(state.pity, { 33: 2400 });
    assert.equal(state.attempts, 0n);
    const snapshot = Forge.serialize(state);
    assert.equal(Forge.enchant(state, 100001, () => 0), null);
    assert.equal(Forge.act(state, 100001, () => 0), null);
    assert.equal(Forge.serialize(state), snapshot);
    const restored = Forge.restore(JSON.parse(snapshot), 101000);
    assert.equal(restored.history[0].kind, 'enchant-fail');
    assert.equal(Forge.act(restored, 101000, () => 0).kind, 'success');
    assert.deepEqual(restored.enchantments, effects);
  }
});

test('special enhancement rejects broken, underfunded and cooling states without mutation', () => {
  for (const overrides of [{ broken: true }, { shards: '0' }, { lastAt: 99999 }]) {
    const state = Forge.restore({ version: 2, level: '32', shards: '9000000', enchantment: 'lunar', ...overrides }, 100000);
    const snapshot = Forge.serialize(state);
    assert.equal(Forge.enchant(state, 100000, () => { throw Error('must not draw'); }), null);
    assert.equal(Forge.serialize(state), snapshot);
  }
});

test('stacked appraisal multiplies every effect exactly with one final integer rounding', () => {
  for (const level of ['0', '32', '900719925474099312345678901234567890']) {
    const state = Forge.restore({ level, enchantments: ['astral', 'lunar', 'storm'] }, 100000);
    const value = Forge.appraisal(state);
    assert.equal(value.numerator, 14592n);
    assert.equal(value.denominator, 1000n);
    assert.equal(value.value, value.base * 14592n / 1000n);
    assert.equal(value.effects.length, 3);
  }
});

test('normal reset keeps engravings but shatter clears them immediately, before reforge', () => {
  const state = Forge.restore({ version: 2, level: '31', shards: '9000000', enchantments: ['frost', 'storm', 'lunar'] }, 100000);
  Forge.act(state, 100000, () => Forge.preview(state).success / 10000);
  assert.equal(state.level, 0n);
  assert.deepEqual(state.enchantments, ['frost', 'storm', 'lunar']);
  state.level = 31n;
  const destroyed = Forge.act(state, 101000, () => 0.9999);
  assert.equal(state.broken, true);
  assert.equal(destroyed.lostEffects, 3);
  assert.deepEqual(state.enchantments, []);
  assert.equal(state.enchantment, null);
  assert.equal(Forge.appraisal(state).value, 0n);
  assert.deepEqual(Forge.appraisal(state).effects, []);
  const saved = Forge.restore(JSON.parse(Forge.serialize(state)), 102000);
  assert.deepEqual(saved.enchantments, []);
  assert.equal(saved.enchantment, null);
  assert.equal(saved.history[0].lostEffects, 3);
  Forge.act(saved, 102000, () => 0.85);
  assert.deepEqual(saved.enchantments, ['astral']);
  assert.equal(saved.enchantment, 'astral');
  assert.equal(saved.level, 0n);
});

test('stack migration preserves existing effects and sanitizes invalid or duplicate slots', () => {
  const migrated = Forge.restore({ version: 2, enchantment: 'storm' }, 100000, () => 0);
  assert.deepEqual(migrated.enchantments, ['storm']);
  const restored = Forge.restore({ enchantment: 'cinder', enchantments: ['frost', 'bad', 'frost', null, 'lunar', 'storm', 'astral'] }, 100000);
  assert.deepEqual(restored.enchantments, ['frost', 'lunar', 'storm']);
  assert.equal(restored.enchantment, 'frost');
  assert.deepEqual(Forge.restore({ enchantments: ['bad'], enchantment: 'lunar' }, 100000).enchantments, ['lunar']);
  assert.deepEqual(Forge.restore(JSON.parse(Forge.serialize(restored)), 100000), restored);
});

test('old broken saves discard every stored effect without drawing a replacement', () => {
  for (const old of [
    { enchantment: 'lunar', enchantments: ['lunar', 'storm', 'astral'] },
    { enchantment: 'astral' },
    { enchantment: null, enchantments: [] },
  ]) {
    const state = Forge.restore({ version: 2, broken: true, level: '0', bestLevel: '32', shards: '123456789', ...old }, 100000,
      () => { throw Error('broken swords must not draw effects'); });
    assert.deepEqual(state.enchantments, []);
    assert.equal(state.enchantment, null);
    assert.equal(state.shards, 123456789n);
    assert.equal(state.bestLevel, 32n);
    assert.equal(Forge.enchantPreview(state).cost, 0n);
    assert.equal(Forge.enchantPreview(state).success, 0);
    assert.deepEqual(Forge.appraisal(state).effects, []);
    assert.deepEqual(Forge.restore(JSON.parse(Forge.serialize(state)), 101000), state);
  }
});

test('automatic income is reduced with a playable minimum and engraving prices stay unchanged', () => {
  for (const [bestLevel, expected] of [['0', 2n], ['12', 15n], ['20', 67n], ['32', 273n], ['80', 4267n]]) {
    const state = Forge.restore({ version: 2, level: bestLevel, shards: '123456789', paidAt: 100000, enchantment: 'astral' }, 100000);
    assert.equal(Forge.income(state), expected);
    const oldIncome = 12n + BigInt(bestLevel) ** 3n / 6n;
    assert.equal(Forge.enchantPreview(state).cost, 120n * (BigInt(bestLevel) + 1n) + oldIncome * 12n);
    assert.equal(Forge.collectPassive(state, 105000), expected * 5n);
    assert.equal(state.shards, 123456789n + expected * 5n);
    assert.equal(Forge.collectPassive(state, 105000), 0n);
  }
  const legacy = Forge.restore({ level: '32', miner: 4, polish: 3, echo: 2 }, 100000);
  assert.equal(Forge.income(legacy), (12n + 32n ** 3n / 6n + 4n * 4n + 3n * 2n + 2n * 2n) / 20n);
  const huge = Forge.restore({ level: '90071992547409931234567890' }, 100000);
  assert.equal(Forge.income(huge), (12n + huge.bestLevel ** 3n / 6n) / 20n);
});

test('the new season resets all earlier progress once and starts with exactly 10000 shards', () => {
  const old={version:2,level:'80',bestLevel:'99',shards:'999999999',enchantments:['astral','lunar','storm'],broken:true,
    attempts:'1000',shattered:'100',pity:{81:9000},history:[{kind:'shatter',from:'80',target:'81',at:1}],paidAt:1,legacy:{miner:999,echo:999,polish:999}};
  const state=Forge.loadSeason(old,100000,()=>0);
  assert.equal(state.season,Forge.seasonId);
  assert.equal(state.shards,10000n);
  assert.equal(state.level,0n);assert.equal(state.bestLevel,0n);assert.equal(state.broken,false);
  assert.equal(state.attempts,0n);assert.equal(state.shattered,0n);
  assert.deepEqual(state.enchantments,['cinder']);assert.deepEqual(state.history,[]);assert.deepEqual(state.pity,{});
  assert.equal(Forge.income(state),2n);assert.equal(state.paidAt,100000);
  Forge.act(state,100000,()=>0);
  const reloaded=Forge.loadSeason(JSON.parse(Forge.serialize(state)),101000,()=>.99);
  assert.equal(reloaded.level,1n);assert.equal(reloaded.shards,9984n);assert.equal(reloaded.attempts,1n);
  assert.equal(Forge.restore(null,100000,()=>0).shards,10000n);
  assert.notEqual(Forge.saveKey,Forge.legacySaveKey);
  assert(Forge.saveKey.endsWith(Forge.seasonId));
});

test('ranking snapshots use chosen names, every effect and exact sortable BigInt values', () => {
  const state=Forge.restore({level:'32',enchantments:['astral','lunar','storm']},100000);
  const row=Forge.rankingRecord(state,'  몽글대장  ','새벽의 검');
  assert.equal(row.nickname,'몽글대장');assert.equal(row.weaponName,'새벽의 검');
  assert.equal(row.value.length,512);assert.equal(BigInt(row.value),7860418n);
  assert.deepEqual([row.effect1,row.effect2,row.effect3],state.enchantments);
  const huge=Forge.rankingRecord(Forge.restore({level:'9007199254740993123',enchantment:'lunar'},100000),'큰검','무한검');
  assert(huge.value>row.value);
  state.broken=true;state.enchantments=[];state.enchantment=null;
  assert.equal(BigInt(row.value),7860418n);
  assert.throws(()=>Forge.rankingRecord(state,'몽글','깨진 검'),/깨졌/);
  for(const name of ['','   ','<script>','a'.repeat(13)])assert.throws(()=>Forge.rankingName(name,12));
});
