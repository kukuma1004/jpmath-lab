'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Forge = require('../games/mongle-forge/forge-engine.js');

test('engine, release manifest and ranking submissions agree on the release protocol', () => {
  const manifest=require('../games/mongle-forge/release.json');
  assert.equal(Forge.clientRevision,manifest.revision);
  assert.equal(Forge.rankingProtocol,manifest.rankingProtocol);
  const row=Forge.rankingRecord(Forge.restore(null,100000,()=>0),'대장장이','나무검');
  assert.equal(row.rulesVersion,manifest.rankingProtocol);
});

test('passive storage covers three protected attempts at the highest level and never shrinks on a broken weapon', () => {
  const now=Date.UTC(2026,10,23,0);let previous=0n;
  for(const [level,expected] of [[0n,10000n],[32n,2261000n],[100n,85538000n],[1000n,81542867000n],[9007199254740993123n,null]]) {
    const s=Forge.restore({level:level.toString(),shards:'0'},now),cap=Forge.passiveCapacity(s);
    if(expected!==null)assert.equal(cap,expected);
    assert(cap>=previous);previous=cap;
    assert(cap>=3n*(Forge.preview(s,now).originalCost+Forge.protectionOffer(s,now).originalCost));
    s.level=0n;s.broken=true;assert.equal(Forge.passiveCapacity(s),cap);
    Forge.setRankBonus(s,1,now);assert.equal(Forge.passiveCapacity(s),cap);
  }
});

test('passive storage pays only remaining room and never banks full time for later spending', () => {
  const now=Date.UTC(2026,10,23,0);
  const s=Forge.restore({shards:'9999',paidAt:now},now);
  Forge.setRankBonus(s,1,now);
  assert.equal(Forge.collectPassive(s,now+1500),1n);assert.equal(s.shards,10000n);assert.equal(s.paidAt,now+1500);
  assert.equal(Forge.collectPassive(s,now+86400000),0n);assert.equal(s.shards,10000n);
  const event=Forge.act(s,now+86400000,()=>0);assert(event);assert.equal(s.shards,10000n-event.spent);
  assert.equal(Forge.collectPassive(s,now+86400000+999),0n);
  assert.equal(Forge.collectPassive(s,now+86400000+1000),4n);
  const offline=Forge.restore({level:32,shards:'0',paidAt:now},now);
  assert.equal(Forge.collectPassive(offline,now+86400000),2261000n);
  assert.equal(Forge.collectPassive(offline,now+172800000),0n);
  const saved=Forge.restore(JSON.parse(Forge.serialize(offline)),now+172800000);
  assert.equal(saved.shards,2261000n);assert.equal(Forge.collectPassive(saved,now+172800000),0n);
});

test('legacy excess and full-price sale rewards are preserved while passive income stays stopped', () => {
  const now=Date.UTC(2026,10,23,0);
  const legacy=Forge.restore({level:32,shards:'9000000000',paidAt:now},now);
  assert.equal(Forge.collectPassive(legacy,now+86400000),0n);assert.equal(legacy.shards,9000000000n);
  assert.equal(Forge.restore(JSON.parse(Forge.serialize(legacy)),now+86400000).shards,9000000000n);
  const sold=Forge.restore({level:100,enchantments:['lunar','lunar','lunar'],shards:'0',paidAt:now},now);
  sold.shards=Forge.passiveCapacity(sold);
  const before=sold.shards,offer=Forge.saleOffer(sold);
  assert(Forge.sell(sold,now,offer.token));assert.equal(sold.shards,before+offer.value/10n);
  assert.equal(Forge.collectPassive(sold,now+86400000),0n);assert.equal(sold.shards,before+offer.shards);
});

test('protected failures at current +100 and above drop exactly one, consume once and preserve effects and best', () => {
  const now=Date.UTC(2026,10,22,0);
  for(const level of [99n,100n,101n,9007199254740993123n]) {
    const s=Forge.restore({level:level.toString(),shards:(10n**90n).toString(),enchantments:['lunar','lunar','lunar'],protections:{[level+1n]:true}},now);
    const quote=Forge.preview(s,now),wallet=s.shards;
    assert.equal(quote.protectionDrop,level>=100n?1n:0n);
    const result=Forge.act(s,now,()=>.99999,quote.token);
    assert.equal(result.kind,'protected');assert.equal(result.to,(level-quote.protectionDrop).toString());
    assert.equal(s.level,level-quote.protectionDrop);assert.equal(s.bestLevel,level);assert.equal(s.broken,false);
    assert.deepEqual(s.enchantments,['lunar','lunar','lunar']);assert.equal(s.protectionUses,1n);
    assert.equal(s.shards,wallet-quote.cost);assert.equal(s.protections[(level+1n).toString()],undefined);
    assert.equal(s.rankingBest.level,level.toString());assert.equal(s.pity[(level+1n).toString()],800);
    if(level>=100n)assert.equal(s.pity[level.toString()],undefined);
    const saved=Forge.serialize(s);assert.equal(Forge.act(s,now+1,()=>0,quote.token),null);assert.equal(Forge.serialize(s),saved);
    assert.equal(Forge.restore(JSON.parse(saved),now+2000).history[0].to,result.to);
    const success=Forge.restore({level:level.toString(),shards:(10n**90n).toString(),protections:{[level+1n]:true}},now);
    assert.equal(Forge.act(success,now,()=>0).kind,'success');assert.equal(success.level,level+1n);
    assert.equal(success.protections[(level+1n).toString()],true);assert.equal(success.protectionUses,0n);
  }
  const old=Forge.restore({level:104,history:[{kind:'protected',from:'104',target:'105',at:now}]},now);
  assert.equal(old.history[0].to,undefined);
});

test('operator effects apply once to the matching pre-existing weapon and never resurrect or change a new sword', () => {
  const now=Date.UTC(2026,10,22,0),effects=['astral','lunar','lunar'];
  const seed=()=>Forge.restore({level:78,enchantments:effects,lastAt:now-1000,protectionUses:'135'},now);
  const grant={id:'test-lunar-20261122',season:Forge.seasonId,issuedAt:now,source:Forge.weaponSnapshot(seed()),effects:['lunar','lunar','lunar']};
  const state=seed();assert(Forge.applyAdminGrant(state,grant));assert.deepEqual(state.enchantments,grant.effects);
  assert.equal(state.rankingBest.effect1,'lunar');assert.equal(state.rankingBest.protectionUses,'135');
  const saved=Forge.serialize(state);assert.equal(Forge.applyAdminGrant(state,grant),false);assert.equal(Forge.serialize(state),saved);
  const restored=Forge.restore(JSON.parse(saved),now);assert.equal(restored.appliedGrant,grant.id);assert.equal(Forge.applyAdminGrant(restored,grant),false);
  for(const change of [{broken:true},{sold:true,broken:true},{lastAt:now+1},{level:0},{enchantments:['frost','lunar','lunar']}]) {
    const s=Forge.restore({...JSON.parse(Forge.serialize(seed())),...change},now+2000),before=[...s.enchantments];
    assert(Forge.applyAdminGrant(s,grant));assert.deepEqual(s.enchantments,before);assert.equal(s.rankingBest.effect1,'lunar');
    assert.equal(s.broken,change.broken===true);
  }
  const stronger=Forge.restore({level:110,enchantments:['lunar','lunar','lunar']},now);Forge.rememberWeapon(stronger);
  const best=stronger.rankingBest.value;Forge.applyAdminGrant(stronger,grant);assert.equal(stronger.rankingBest.value,best);
  for(const invalid of [{...grant,season:'wrong'},{...grant,id:null},{...grant,effects:['lunar']},{...grant,source:null},{...grant,effects:['fake','lunar','lunar']}]) {
    const s=seed(),before=Forge.serialize(s);assert.equal(Forge.applyAdminGrant(s,invalid),false);assert.equal(Forge.serialize(s),before);
  }
});

test('special prices stay affordable after a high record and charge exact current-level quotes', () => {
  const full = Date.UTC(2026,10,21,0), happy = Date.UTC(2026,10,21,3);
  for (const [level, prices] of [[0,[110n,220n,330n]],[12,[1790n,3580n,5370n]],[32,[10990n,21980n,32970n]]]) {
    for (let slots=1;slots<=3;slots++) {
      const state=Forge.restore({level,bestLevel:1000,shards:'9000000',enchantments:Array(slots).fill('cinder')},full);
      const quote=Forge.enchantPreview(state,full);
      assert.equal(quote.cost,prices[slots-1]);
      assert.equal(Forge.enchantPreview(state,happy).cost,(prices[slots-1]+1n)/2n);
      const fresh=Forge.restore({level,enchantments:Array(slots).fill('cinder')},full);
      assert.equal(Forge.enchantPreview(fresh,full).cost,quote.cost);
      const before=state.shards;
      const event=slots===3?Forge.reroll(state,full,()=>0,quote.token):Forge.enchant(state,full,()=>0,quote.token);
      assert(event);assert.equal(event.spent,quote.cost);assert.equal(state.shards,before-quote.cost);
    }
  }
  const state=Forge.restore({level:'9007199254740993123',enchantments:['cinder']},full);
  assert.equal(Forge.enchantPreview(state,full).cost,100n+10n*9007199254740993124n**2n);
});

test('ranked protection usage follows that weapon record and survives destruction and reload', () => {
  const now=Date.UTC(2026,10,21,0);
  const state=Forge.restore({level:32,shards:'9000000',enchantments:['cinder'],protections:{33:true},protectionUses:'2'},now);
  Forge.rememberWeapon(state);assert.equal(state.rankingBest.protectionUses,'2');
  assert.equal(Forge.act(state,now,()=>.99999).kind,'protected');
  assert.equal(state.rankingBest.protectionUses,'3');
  assert.equal(Forge.act(state,now+1000,()=>.99999).kind,'shatter');
  assert.equal(state.rankingBest.protectionUses,'3');
  const restored=Forge.restore(JSON.parse(Forge.serialize(state)),now+2000);
  assert.equal(restored.rankingBest.protectionUses,'3');
  restored.broken=false;restored.level=0n;restored.enchantments=['cinder'];restored.protectionUses=20n;
  Forge.rememberWeapon(restored);assert.equal(restored.rankingBest.protectionUses,'3');
});

test('legacy ranked usage stays unknown unless the currently held weapon matches the record', () => {
  const now=Date.UTC(2026,10,21,0);
  const current=Forge.restore({level:32,enchantments:['cinder'],protectionUses:'7'},now);
  const record=Forge.weaponSnapshot(current);delete record.protectionUses;
  const legacy=Forge.restore({...JSON.parse(Forge.serialize(current)),rankingBest:record},now);
  assert.equal(legacy.rankingBest.protectionUses,undefined);
  Forge.rememberWeapon(legacy);assert.equal(legacy.rankingBest.protectionUses,'7');
  const weaker=Forge.restore({...JSON.parse(Forge.serialize(current)),level:'0',rankingBest:record},now);
  Forge.rememberWeapon(weaker);assert.equal(weaker.rankingBest.protectionUses,undefined);
  assert.equal(Forge.rankingRecord(weaker,'몽글','검').protectionUses,'7');
});

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
  const offer = Forge.preview(state,100000);
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
  const offer = Forge.preview(state,100000);
  const event = Forge.act(state, 100000, () => (offer.success + offer.reset) / 10000);
  assert.equal(event.kind, 'shatter');
  assert.equal(state.broken, true);
  assert.equal(state.shattered, 1n);
  const restored = Forge.restore(JSON.parse(Forge.serialize(state)), 100000);
  assert.equal(restored.broken, true);
  const price = Forge.preview(restored,100000).cost;
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
  state.shards = 0n;
  state.broken = true;
  state.level = 0n;
  const rate = Forge.income(state);
  const now = 100000 + 24 * 60 * 60 * 1000;
  assert.equal(Forge.collectPassive(state, now), Forge.passiveCapacity(state));
  assert.equal(Forge.collectPassive(state, now), 0n);
  assert.equal(Forge.income(state), rate);
});

test('strengthening continues above JavaScript safe integer precision without rounding', () => {
  const current = 900719925474099312345678901234567890n;
  const wallet = Forge.cost(current + 1n) * 4n;
  const state = Forge.restore({ level: current.toString(), bestLevel: current.toString(), shards: wallet.toString(), paidAt: 100000 }, 100000);
  const offer = Forge.preview(state,100000);
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
  assert.equal(Forge.preview(state,100000).success, 9500);
  assert(Forge.preview(state,100000).shatter > 0);
  Forge.act(state, 100000, () => 0.9999);
  assert.equal(state.bestLevel, 80n);
  assert.equal(Forge.forms.filter(form => form.level <= state.bestLevel).length, 20);
});

test('same-level appraisal reflects the actual persistent magical affix', () => {
  const expected = {
    cinder: 2714947n,
    solar: 3167438n,
    verdant: 4751157n,
    frost: 3619929n,
    storm: 4298666n,
    astral: 5429894n,
    lunar: 7239859n,
  };
  for (const [enchantment, value] of Object.entries(expected)) {
    const state = Forge.restore({ version: 2, level: '32', bestLevel: '32', shards: '9000000', enchantment }, 100000);
    assert.equal(Forge.appraisal(state).base, 2262456n);
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
  const odds = Forge.preview(state,100000);
  const reset = Forge.act(state, 100000, () => odds.success / 10000);
  assert.equal(reset.kind, 'reset');
  assert.equal(state.enchantment, 'astral');
  assert.equal(Forge.appraisal(state).value, 288n);

  state.level = 31n;
  const nextOdds = Forge.preview(state,100000);
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
  for (const [roll, expected] of [[0,'cinder'],[(38+.00001)/136,'solar'],[(60+.00001)/136,'astral'],[(72+.00001)/136,'verdant'],[(86+.00001)/136,'frost'],[(114+.00001)/136,'storm'],[(132+.00001)/136,'lunar']]) {
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
  const first = Forge.enchantPreview(state,100000);
  assert.equal(first.success, 6000);
  const draws = [0.5999, 0.9999];
  const added = Forge.enchant(state, 100000, () => draws.shift());
  assert.equal(added.kind, 'enchant');
  assert.equal(added.enchantment, 'lunar');
  assert.deepEqual(state.enchantments, ['astral', 'lunar']);
  assert.equal(state.enchantment, 'astral');
  assert.equal(state.level, 32n);
  assert.equal(state.shards, 9000000n - first.cost);
  assert.equal(Forge.enchantPreview(state,100000).success, 3000);
  assert(Forge.enchantPreview(state,100000).cost > first.cost);
  Forge.enchant(state, 101000, () => 0);
  assert.deepEqual(state.enchantments, ['astral', 'lunar', 'cinder']);
  assert.equal(Forge.enchantPreview(state,100000).full, true);
  const snapshot = Forge.serialize(state);
  assert.equal(Forge.enchant(state, 102000, () => { throw Error('must not draw at capacity'); }), null);
  assert.equal(Forge.serialize(state), snapshot);
  assert.deepEqual(Forge.restore(JSON.parse(snapshot), 102000).enchantments, state.enchantments);
});

test('special failure boundaries charge once and preserve level, effects and normal pity', () => {
  for (const effects of [['frost'], ['frost', 'storm']]) {
    const state = Forge.restore({ version: 2, level: '32', shards: '9000000', enchantments: effects, pity: { 33: 2400 } }, 100000);
    const offer = Forge.enchantPreview(state,100000);
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
  Forge.act(state, 100000, () => Forge.preview(state,100000).success / 10000);
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
  Forge.act(saved, 102000, () => 0.5);
  assert.deepEqual(saved.enchantments, ['astral']);
  assert.equal(saved.enchantment, 'astral');
  assert.equal(saved.level, 0n);
});

test('stack migration preserves existing effects and sanitizes invalid slots while preserving duplicates', () => {
  const migrated = Forge.restore({ version: 2, enchantment: 'storm' }, 100000, () => 0);
  assert.deepEqual(migrated.enchantments, ['storm']);
  const restored = Forge.restore({ enchantment: 'cinder', enchantments: ['frost', 'bad', 'frost', null, 'lunar', 'storm', 'astral'] }, 100000);
  assert.deepEqual(restored.enchantments, ['frost', 'frost', 'lunar']);
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
    assert.equal(Forge.enchantPreview(state,100000).cost, 0n);
    assert.equal(Forge.enchantPreview(state,100000).success, 0);
    assert.deepEqual(Forge.appraisal(state).effects, []);
    assert.deepEqual(Forge.restore(JSON.parse(Forge.serialize(state)), 101000), state);
  }
});

test('record income increments double and the current level adds production', () => {
  for (const [bestLevel, expected] of [['0', 4n], ['12', 128n], ['20', 464n], ['32', 1600n], ['80', 20264n]]) {
    const state = Forge.restore({ version: 2, level: bestLevel, shards: '0', paidAt: 100000, enchantment: 'astral' }, 100000);
    assert.equal(Forge.income(state), expected);
    assert.equal(Forge.collectPassive(state, 105000), expected * 5n);
    assert.equal(state.shards, expected * 5n);
    assert.equal(Forge.collectPassive(state, 105000), 0n);
  }
  const legacy = Forge.restore({ level: '32', miner: 4, polish: 3, echo: 2 }, 100000);
  assert.equal(Forge.income(legacy), 4n + ((12n + 32n ** 3n / 6n + 4n * 4n + 3n * 2n + 2n * 2n) / 20n * 2n - 4n) * 2n + 512n);
  const huge = Forge.restore({ level: '90071992547409931234567890' }, 100000);
  assert.equal(Forge.income(huge), 4n + ((12n + huge.bestLevel ** 3n / 6n) / 20n * 2n - 4n) * 2n + huge.level ** 2n / 2n);
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
  assert.equal(Forge.income(state),4n);assert.equal(state.paidAt,100000);
  Forge.act(state,100000,()=>0);
  const reloaded=Forge.loadSeason(JSON.parse(Forge.serialize(state)),101000,()=>.99);
  assert.equal(reloaded.level,1n);assert.equal(reloaded.shards,9984n);assert.equal(reloaded.attempts,1n);
  assert.equal(Forge.restore(null,100000,()=>0).shards,10000n);
  assert.notEqual(Forge.saveKey,Forge.legacySaveKey);
  assert(Forge.saveKey.includes(Forge.seasonId));
});

test('ranking snapshots use chosen names, every effect and exact sortable BigInt values', () => {
  const state=Forge.restore({level:'32',enchantments:['astral','lunar','storm']},100000);
  const row=Forge.rankingRecord(state,'  몽글대장  ','새벽의 검');
  assert.equal(row.nickname,'몽글대장');assert.equal(row.weaponName,'새벽의 검');
  assert.equal(row.value.length,512);assert.equal(BigInt(row.value),33013757n);
  assert.deepEqual([row.effect1,row.effect2,row.effect3],state.enchantments);
  const huge=Forge.rankingRecord(Forge.restore({level:'9007199254740993123',enchantment:'lunar'},100000),'큰검','무한검');
  assert(huge.value>row.value);
  state.broken=true;state.enchantments=[];state.enchantment=null;
  assert.equal(BigInt(row.value),33013757n);
  assert.throws(()=>Forge.rankingRecord(state,'몽글','깨진 검'),/깨졌/);
  for(const name of ['','   ','<script>','a'.repeat(13)])assert.throws(()=>Forge.rankingName(name,12));
});

test('protection is priced per target and consumed only when a failed attempt is protected', () => {
  const prices=[];
  for (const level of [3,5,11,31,80]) {
    const s=Forge.restore({level,shards:'9999999999',enchantments:['astral','lunar']},100000);
    const offer=Forge.protectionOffer(s,100000);prices.push(offer.cost);
    assert.equal(offer.target,BigInt(level+1));assert(offer.cost>Forge.preview(s,100000).cost*8n);
    const wallet=s.shards;assert.equal(Forge.buyProtection(s,100000).kind,'protection');
    assert.equal(s.shards,wallet-offer.cost);
    assert.equal(Forge.buyProtection(s,101000),null);
    const cost=Forge.preview(s,100000).cost;
    const result=Forge.act(s,101000,()=>.99999);
    assert.equal(result.kind,'protected');assert.equal(s.level,BigInt(level));assert.equal(s.broken,false);
    assert.deepEqual(s.enchantments,['astral','lunar']);assert.equal(s.shattered,0n);
    assert.equal(s.shards,wallet-offer.cost-cost);assert.equal(s.protections[String(level+1)],undefined);
    assert.equal(s.pity[String(level+1)],800);
  }
  assert(prices.every((p,i)=>!i||p>prices[i-1]));
  const s=Forge.restore({level:3,shards:'100000'},100000);Forge.buyProtection(s,100000);
  assert.equal(Forge.act(s,101000,()=>0).kind,'success');assert.equal(s.protections['4'],true);
  assert.equal(Forge.restore(JSON.parse(Forge.serialize(s)),102000).protections['4'],true);
  const safe=Forge.restore(null,100000);const before=Forge.serialize(safe);
  assert.equal(Forge.buyProtection(safe,100000),null);assert.equal(Forge.serialize(safe),before);
});

test('sales return exactly ten percent once, keep the best weapon, and require a new weapon', () => {
  const s=Forge.restore({level:32,shards:'1000000',enchantments:['astral','lunar','storm']},100000);
  const offer=Forge.saleOffer(s);assert.equal(offer.shards,3301375n);
  assert.equal(Forge.sell(s,100000,'stale'),null);
  const event=Forge.sell(s,100000,offer.token);
  assert.equal(event.kind,'sell');assert.equal(s.shards,4301375n);assert.equal(s.sold,true);assert.equal(s.broken,true);
  assert.equal(s.shattered,0n);assert.equal(s.level,0n);assert.deepEqual(s.enchantments,[]);
  assert.equal(BigInt(s.rankingBest.value),33013757n);
  assert.equal(Forge.sell(s,101000,offer.token),null);
  const reload=Forge.restore(JSON.parse(Forge.serialize(s)),101000);assert.equal(reload.sold,true);
  const fee=Forge.preview(reload,100000).cost;Forge.act(reload,101000,()=>0);
  assert.equal(reload.sold,false);assert.equal(reload.shards,4301375n-fee);assert.equal(reload.enchantments.length,1);
  assert.notEqual(Forge.saleOffer(reload).token,offer.token);
});

test('best weapon snapshots survive destruction, reset and reload for automatic publishing', () => {
  const s=Forge.restore({level:32,shards:'999999',enchantments:['astral','lunar','storm']},100000);
  Forge.act(s,100000,()=>.99999);
  assert(s.broken);assert.deepEqual(s.enchantments,[]);assert.equal(s.rankingBest.level,'32');
  assert.equal(BigInt(s.rankingBest.value),33013757n);
  const reload=Forge.restore(JSON.parse(Forge.serialize(s)),101000);
  assert.deepEqual(reload.rankingBest,s.rankingBest);
  Forge.act(reload,101000,()=>0);assert.equal(reload.rankingBest.level,'32');
});

test('top ten rank bonuses are tiered, bounded by verification and never paid retroactively', () => {
  for(let rank=1;rank<=10;rank++)assert.equal(Forge.rankReward(rank),100n-BigInt(rank-1)*5n);
  assert.equal(Forge.rankReward(0),0n);assert.equal(Forge.rankReward(11),0n);
  const s=Forge.restore({shards:'0',paidAt:100000},100000);
  Forge.setRankBonus(s,1,105000);
  assert.equal(Forge.income(s,105000),104n);
  assert.equal(Forge.collectPassive(s,110000),540n); // 10 base seconds, 5 verified bonus seconds.
  assert.equal(Forge.collectPassive(s,110000),0n);
  assert.equal(Forge.collectPassive(s,170000),5740n); // Verification ends at 165000.
  assert.equal(Forge.income(s,170000),4n);
  Forge.setRankBonus(s,10,170000);assert.equal(Forge.income(s,170000),59n);
  Forge.collectPassive(s,171000);Forge.setRankBonus(s,0,171000);assert.equal(Forge.income(s,171000),4n);
  const offline=Forge.restore({shards:'0',paidAt:100000},100000);Forge.setRankBonus(offline,1,100000);
  assert.equal(Forge.collectPassive(offline,100000+24*60*60*1000),Forge.passiveCapacity(offline));
});

test('reroll selects one slot and can match another owned effect', () => {
  const original=['cinder','frost','storm'];
  for(const [slotRoll,slot]of [[0,1],[1/3,2],[2/3,3],[.99999,3]]) {
    for(const [effectRoll,effect]of [[0,slot===1?'solar':'cinder'],[.99999,'lunar']]) {
      const s=Forge.restore({version:2,level:'32',shards:'9000000',enchantments:original,protections:{33:true},pity:{33:2400}},100000);
      const offer=Forge.enchantPreview(s,100000);assert(offer.reroll);assert.equal(offer.cost,32970n);
      const rolls=[slotRoll,effectRoll];const result=Forge.reroll(s,100000,()=>rolls.shift(),offer.token);
      assert.equal(result.kind,'reroll');assert.equal(result.slot,slot);assert.equal(result.replaced,original[slot-1]);assert.equal(result.enchantment,effect);
      assert.equal(s.enchantments.length,3);assert.notEqual(result.enchantment,result.replaced);
      assert.deepEqual(s.enchantments,original.map((id,index)=>index===slot-1?effect:id));
      assert.equal(s.enchantment,s.enchantments[0]);assert.equal(s.shards,9000000n-offer.cost);
      assert.equal(s.level,32n);assert.equal(s.bestLevel,32n);assert.equal(s.broken,false);assert.equal(s.attempts,0n);
      assert.deepEqual(s.protections,{33:true});assert.deepEqual(s.pity,{33:2400});
      assert.equal(BigInt(result.valueAfter),Forge.appraisal(s).value);
      const restored=Forge.restore(JSON.parse(Forge.serialize(s)),101000);
      assert.deepEqual(restored.enchantments,s.enchantments);assert.equal(restored.history[0].slot,slot);
      assert.equal(restored.history[0].replaced,result.replaced);
    }
  }
});

test('reroll rejects missing slots, broken swords, insufficient funds, cooldown and stale offers without drawing', () => {
  for(const changes of [{enchantments:['cinder']},{enchantments:['cinder','storm']},{broken:true},{shards:'0'},{lastAt:99999}]) {
    const s=Forge.restore({version:2,level:'32',shards:'9000000',enchantments:['astral','lunar','storm'],...changes},100000);
    const before=Forge.serialize(s);
    assert.equal(Forge.reroll(s,100000,()=>{throw Error('must not draw')}),null);
    assert.equal(Forge.serialize(s),before);
  }
  const s=Forge.restore({level:'32',shards:'9000000',enchantments:['astral','lunar','storm']},100000);
  const old=Forge.enchantPreview(s,100000);Forge.act(s,100000,()=>0);const before=Forge.serialize(s);
  assert.equal(Forge.reroll(s,101000,()=>{throw Error('must not draw')},old.token),null);assert.equal(Forge.serialize(s),before);
});

test('a lower-value reroll preserves the old ranking snapshot and a stronger reroll records the improvement', () => {
  const s=Forge.restore({level:'32',shards:'9000000',enchantments:['astral','lunar','storm']},100000);
  const oldValue=Forge.appraisal(s).value;const result=Forge.reroll(s,100000,()=>0);
  assert(BigInt(result.valueAfter)<oldValue);assert.equal(BigInt(s.rankingBest.value),oldValue);
  assert.equal(Forge.saleOffer(s).shards,Forge.appraisal(s).value/10n);
  const stronger=Forge.restore({level:'32',shards:'9000000',enchantments:['cinder','frost','storm']},100000);
  const draws=[0,.99];Forge.reroll(stronger,100000,()=>draws.shift());
  assert.equal(stronger.enchantment,'lunar');assert.equal(BigInt(stronger.rankingBest.value),Forge.appraisal(stronger).value);
  const wallet=stronger.shards;assert.equal(Forge.reroll(stronger,100001,()=>0),null);assert.equal(stronger.shards,wallet);
});

test('all seven rainbow effects stack, including three copies of the same effect', () => {
  assert.equal(Forge.enchantments.length,7);
  const s=Forge.restore({level:32,shards:'9000000',enchantments:['lunar','lunar','lunar']},100000);
  const value=Forge.appraisal(s);assert.equal(value.numerator,32768n);assert.equal(value.denominator,1000n);
  assert.equal(value.value,value.base*32768n/1000n);
  const saved=Forge.restore(JSON.parse(Forge.serialize(s)),101000);assert.deepEqual(saved.enchantments,['lunar','lunar','lunar']);
  assert.equal(Forge.rankingRecord(s,'중복검','보라 세 겹').effect3,'lunar');
  const add=Forge.restore({enchantment:'cinder',shards:'999999'},100000);
  Forge.enchant(add,100000,()=>0);assert.deepEqual(add.enchantments,['cinder','cinder']);
  Forge.enchant(add,101000,()=>0);assert.deepEqual(add.enchantments,['cinder','cinder','cinder']);
  const old={level:'32',value:'7860418'.padStart(512,'0'),effect1:'astral',effect2:'lunar',effect3:'storm'};
  const migrated=Forge.restore({version:2,broken:true,rankingBest:old},100000);
  assert.equal(BigInt(migrated.rankingBest.value),33013757n);
});

test('current enhancement income disappears on destruction while record growth remains', () => {
  const s=Forge.restore({version:2,level:32,bestLevel:32,shards:'9000000'},100000);
  assert.deepEqual(Forge.incomeBreakdown(s),{base:4n,record:1084n,current:512n});
  assert.equal(Forge.baseIncome(s),1600n);
  Forge.act(s,100000,()=>.99999);assert.equal(Forge.baseIncome(s),1088n);
  assert.equal(s.bestLevel,32n);
});

test('protection usage counts actual activations and survives reload', () => {
  const s=Forge.restore({version:2,level:31,shards:'9000000',protections:{32:true}},100000);
  Forge.act(s,100000,()=>.99999);assert.equal(s.protectionUses,1n);
  Forge.buyProtection(s,101000);Forge.act(s,102000,()=>0);assert.equal(s.protectionUses,1n);
  const saved=Forge.restore(JSON.parse(Forge.serialize(s)),103000);assert.equal(saved.protectionUses,1n);
  const legacy=Forge.restore({history:[{kind:'protected',from:'5',target:'6',at:1}]},100000);assert.equal(legacy.protectionUses,1n);
});

test('Korean happy hours include starts and exclude ends, and halve every spending type once', () => {
  const at=(h,m=0,s=0)=>Date.UTC(2026,10,20,h-9,m,s);
  for(const [h,m,s,active]of [[6,59,59,false],[7,0,0,true],[7,59,59,true],[8,0,0,false],[11,59,59,false],[12,0,0,true],[13,59,59,true],[14,0,0,false],[20,59,59,false],[21,0,0,true],[23,59,59,true],[24,0,0,false]])assert.equal(Forge.discountInfo(at(h,m,s)).active,active);
  const full=at(9),sale=at(12);
  const s=Forge.restore({version:2,level:31,shards:'9000000',enchantments:['solar','verdant','verdant']},full);
  for(const fn of [Forge.preview,Forge.protectionOffer,Forge.enchantPreview]) {
    const normal=fn(s,full),offer=fn(s,sale);assert.equal(offer.cost,(normal.cost+1n)/2n);assert.equal(offer.originalCost,normal.cost);
  }
  const price=Forge.preview(s,sale).cost;const wallet=s.shards;
  const event=Forge.act(s,sale,()=>0);assert.equal(event.spent,price);assert.equal(s.shards,wallet-price);
  const broken=Forge.restore({version:2,broken:true,bestLevel:0,shards:'1000'},full);
  assert.equal(Forge.preview(broken,sale).cost,5n);assert.equal(Forge.act(broken,sale,()=>0).spent,5n);
  const token=Forge.enchantPreview(s,at(13,59,59)).token;const snapshot=Forge.serialize(s);
  assert.equal(Forge.reroll(s,at(14),()=>{throw Error('must not draw')},token),null);assert.equal(Forge.serialize(s),snapshot);
  const saleValue=Forge.saleOffer(s).shards;assert.equal(saleValue,Forge.appraisal(s).value/10n);
  for(const mode of ['protection','enchant','reroll']) {
    const copy=Forge.restore({version:2,level:31,shards:'9000000',enchantments:mode==='enchant'?['solar']:['solar','solar','verdant']},sale);
    const quote=mode==='protection'?Forge.protectionOffer(copy,sale):Forge.enchantPreview(copy,sale);
    const before=copy.shards;
    const result=mode==='protection'?Forge.buyProtection(copy,sale,quote.token):mode==='enchant'?Forge.enchant(copy,sale,()=>0,quote.token):Forge.reroll(copy,sale,()=>0,quote.token);
    assert(result);assert.equal(copy.shards,before-quote.cost);
  }
});
