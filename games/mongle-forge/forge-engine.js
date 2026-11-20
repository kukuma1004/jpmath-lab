'use strict';

const Forge = (() => {
  const legacySaveKey = 'jp-math-lab:mongle-forge:v1';
  const backupKey = legacySaveKey + ':before-infinite';
  const seasonId = 'season-20261120-1';
  // Isolate the season from older tabs that still write the previous save format.
  const saveKey = legacySaveKey + ':' + seasonId;
  const startingShards = 10000n;
  const cooldown = 680;
  const offlineLimit = 8 * 60 * 60 * 1000;
  const recoveryBonus = 800;
  const enchantmentLimit = 3;
  const costs = [
    16, 32, 56, 88, 135, 190, 275, 390, 530, 710, 940, 1230,
    1550, 1950, 2450, 3100, 3800, 4600, 5600, 6800, 8300, 10200,
    12400, 15000, 18000, 21700, 26000, 31000, 37000, 44000, 52500, 62000,
  ];
  const chances = [
    10000, 10000, 10000, 9500, 9000, 8500, 8000, 7500, 7000, 6500,
    6000, 5600, 5200, 4900, 4600, 4300, 4000, 3800, 3600, 3400,
    3200, 3000, 2900, 2800, 2700, 2600, 2500, 2400, 2300, 2200, 2100, 2000,
  ];
  const forms = [
    { level: 0n, name: '연습용 나무검', effect: 'ember', color: '#f5d398', detail: '작은 나무검에서 시작되는 끝없는 도전' },
    { level: 2n, name: '클로버 잎새검', effect: 'leaf', color: '#a7edb7', detail: '새싹을 닮은 칼날과 부드러운 잎빛' },
    { level: 4n, name: '꽃비 초승검', effect: 'blossom', color: '#ffb8ce', detail: '휘어진 칼날에 꽃비가 내려앉아요' },
    { level: 6n, name: '서리수정 대검', effect: 'glacier', color: '#a4e6ff', detail: '묵직한 수정 칼날에 서리가 맺혀요' },
    { level: 9n, name: '달그림자 월검', effect: 'eclipse', color: '#d9baff', detail: '초승달 모양 칼날을 감싸는 달빛' },
    { level: 12n, name: '별꼬리 성검', effect: 'comet', color: '#ffe7a2', detail: '별 모양 손잡이에서 빛이 퍼져요' },
    { level: 14n, name: '혜성 쌍날검', effect: 'comet', color: '#ffd29d', detail: '두 갈래 칼날과 나란히 흐르는 혜성' },
    { level: 16n, name: '오로라 파도검', effect: 'aurora', color: '#a7f7da', detail: '물결 칼날 위에서 넘실거리는 오로라' },
    { level: 18n, name: '일식 고리검', effect: 'eclipse', color: '#ffcd98', detail: '칼날의 빈 고리에서 피어나는 일식' },
    { level: 20n, name: '은하 성운검', effect: 'galaxy', color: '#dfbfff', detail: '떠 있는 수정 조각 주위를 도는 별빛' },
    { level: 22n, name: '뇌운 갈퀴검', effect: 'lightning', color: '#fff2a5', detail: '세 갈래 갈퀴를 따라 뻗는 번개' },
    { level: 24n, name: '심해 닻검', effect: 'anchor', color: '#a2f4e6', detail: '깊은 바다의 닻을 닮은 푸른 칼날' },
    { level: 26n, name: '중력 렌즈검', effect: 'gravity', color: '#eabbff', detail: '텅 빈 렌즈 안으로 모여드는 빛' },
    { level: 28n, name: '빙하 성채검', effect: 'glacier', color: '#bcefff', detail: '작은 성채처럼 층층이 자란 얼음' },
    { level: 30n, name: '시계태엽검', effect: 'clockwork', color: '#ffddaa', detail: '황금 톱니와 두 칼날이 새기는 시간' },
    { level: 32n, name: '새벽 왕관검', effect: 'dawn', color: '#ffcfac', detail: '왕관 모양 깃날에서 열리는 새벽' },
    { level: 36n, name: '별문 열쇠검', effect: 'keylight', color: '#b8f4ff', detail: '별 모양 열쇠가 빛의 문을 열어요' },
    { level: 40n, name: '불사조 톱날검', effect: 'phoenix', color: '#ffb19a', detail: '깃털 톱날을 따라 타오르는 불새' },
    { level: 44n, name: '궤도 부채검', effect: 'fanblade', color: '#dbbfff', detail: '펼쳐진 다섯 칼날 사이로 흐르는 궤도' },
    { level: 48n, name: '무한 매듭검', effect: 'infinity', color: '#c6ffe4', detail: '두 번 휘감긴 칼날로 이어지는 무한' },
  ];

  const enchantments = [
    { id: 'cinder', name: '잿불의 숨결', rank: '일반', mark: '♨', tenths: 12n, weight: 38 },
    { id: 'frost', name: '서리꽃 각인', rank: '희귀', mark: '❄', tenths: 16n, weight: 28 },
    { id: 'storm', name: '폭풍의 맹세', rank: '희귀', mark: 'ϟ', tenths: 19n, weight: 18 },
    { id: 'astral', name: '별빛의 축복', rank: '영웅', mark: '✦', tenths: 24n, weight: 12 },
    { id: 'lunar', name: '월식의 계약', rank: '전설', mark: '☾', tenths: 32n, weight: 4 },
  ];

  function rollEnchantment(random, excluded = []) {
    const available = enchantments.filter(entry => !excluded.includes(entry.id));
    let roll = random() * available.reduce((total, entry) => total + entry.weight, 0);
    for (const enchantment of available) {
      roll -= enchantment.weight;
      if (roll < 0) return enchantment.id;
    }
    return available.at(-1).id;
  }

  function appraisal(state) {
    const effects = state.broken ? [] : state.enchantments.map(id => enchantments.find(entry => entry.id === id));
    const numerator = effects.reduce((product, entry) => product * entry.tenths, 1n);
    const denominator = 10n ** BigInt(effects.length);
    const base = state.broken ? 0n : 120n + 15n * state.level * (state.level + 1n) * (state.level + 2n);
    return { enchantment: effects[0], effects, numerator, denominator, base, value: base * numerator / denominator };
  }

  function natural(value, fallback = 0n) {
    if (typeof value === 'bigint') return value >= 0n ? value : fallback;
    if (typeof value === 'number') return Number.isSafeInteger(value) && value >= 0 ? BigInt(value) : fallback;
    if (typeof value === 'string' && /^\d+$/.test(value)) return BigInt(value);
    return fallback;
  }

  function timestamp(value, now) {
    return Number.isFinite(value) && value >= 0 ? Math.min(value, now) : now;
  }

  function restore(raw, now = Date.now(), random = Math.random) {
    const old = raw && typeof raw === 'object' ? raw : {};
    const broken = old.version === 2 && old.broken === true;
    const level = natural(old.level);
    const priorBest = natural(old.bestLevel);
    const bestLevel = priorBest > level ? priorBest : level;
    const pity = {};
    if (old.version === 2 && old.pity && typeof old.pity === 'object') {
      for (const [key, amount] of Object.entries(old.pity)) {
        if (/^\d+$/.test(key) && Number.isSafeInteger(amount) && amount > 0) pity[BigInt(key).toString()] = Math.min(amount, 9000);
      }
    } else if (Array.isArray(old.forgeMissesByLevel)) {
      old.forgeMissesByLevel.forEach((misses, from) => {
        if (Number.isFinite(misses) && misses > 0) pity[String(from + 1)] = Math.min(9000, Math.floor(misses) * 1200);
      });
    } else if (Number.isFinite(old.forgeMisses) && old.forgeMisses > 0) {
      pity[(level + 1n).toString()] = Math.min(9000, Math.floor(old.forgeMisses) * 1200);
    }
    const history = Array.isArray(old.history) ? old.history.filter(entry =>
      entry && ['success', 'reset', 'shatter', 'reforge', 'enchant', 'enchant-fail'].includes(entry.kind) &&
      /^\d+$/.test(String(entry.from)) && /^\d+$/.test(String(entry.target)) && Number.isFinite(entry.at)
    ).slice(0, 12).map(entry => ({
      kind: entry.kind, from: String(entry.from), target: String(entry.target), at: entry.at,
      ...(entry.kind === 'enchant' && enchantments.some(effect => effect.id === entry.enchantment) ? { enchantment: entry.enchantment } : {}),
      ...(entry.kind === 'shatter' && Number.isInteger(entry.lostEffects) && entry.lostEffects >= 0 && entry.lostEffects <= enchantmentLimit ? { lostEffects: entry.lostEffects } : {}),
    })) : [];
    const savedEffects = !broken && Array.isArray(old.enchantments) ? [...new Set(old.enchantments.filter(id =>
      enchantments.some(entry => entry.id === id)))].slice(0, enchantmentLimit) : [];
    if (!broken && !savedEffects.length) savedEffects.push(enchantments.some(entry => entry.id === old.enchantment) ? old.enchantment :
      raw ? enchantments[Number((level / 8n + 4n) % 5n)].id : rollEnchantment(random));

    return {
      version: 2,
      season: seasonId,
      level,
      bestLevel,
      enchantment: savedEffects[0] ?? null,
      enchantments: savedEffects,
      shards: natural(old.shards, startingShards),
      broken,
      attempts: natural(old.attempts),
      shattered: natural(old.shattered),
      pity,
      history,
      paidAt: timestamp(old.paidAt, now),
      lastAt: old.version === 2 && Number.isFinite(old.lastAt) ? timestamp(old.lastAt, now) : 0,
      legacy: old.version === 2 && old.legacy && typeof old.legacy === 'object' ? old.legacy : {
        region: old.region ?? 0,
        cleared: Array.isArray(old.cleared) ? old.cleared : [],
        polish: old.polish ?? 0,
        echo: old.echo ?? 0,
        miner: old.miner ?? 0,
      },
    };
  }

  function serialize(state) {
    return JSON.stringify(state, (_, value) => typeof value === 'bigint' ? value.toString() : value);
  }

  function loadSeason(raw, now = Date.now(), random = Math.random) {
    return restore(raw?.season === seasonId ? raw : null, now, random);
  }

  function rankingName(value, limit) {
    const name = typeof value === 'string' ? value.trim().normalize('NFC') : '';
    if (!name || name.length > limit || !/^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 _.\-]+$/.test(name)) {
      throw new Error('이름은 한글·영문·숫자·공백과 _ . -로 입력해 주세요.');
    }
    return name;
  }

  function rankingRecord(state, nickname, weaponName) {
    if (state.broken) throw new Error('검이 깨졌어요. 새 검을 만든 뒤 등록해 주세요.');
    const value = appraisal(state).value.toString();
    if (value.length > 512 || state.level.toString().length > 128) throw new Error('이 무기는 랭킹의 표시 범위를 넘었어요. 강화는 계속할 수 있어요.');
    return {
      nickname: rankingName(nickname, 12), weaponName: rankingName(weaponName, 16),
      level: state.level.toString(), value: value.padStart(512, '0'),
      effect1: state.enchantments[0], effect2: state.enchantments[1] ?? 'none', effect3: state.enchantments[2] ?? 'none',
    };
  }

  function formAt(level) {
    if (level <= 48n) {
      const index = forms.findLastIndex(form => level >= form.level);
      return { ...forms[index], index, awakening: 0n, next: forms[index + 1]?.level ?? 49n };
    }
    const step = (level - 49n) / 4n;
    const index = 10 + Number(step % 10n);
    return { ...forms[index], index, awakening: step / 10n + 1n, next: 49n + (step + 1n) * 4n };
  }

  function cost(target) {
    if (target <= 32n) return BigInt(costs[Number(target - 1n)]);
    return 62000n + 3n * (target ** 3n - 32n ** 3n);
  }

  function reforgeCost(state) {
    return 8n + (state.bestLevel + 1n) ** 2n;
  }

  function productionBase(state) {
    const level = state.bestLevel;
    const miner = natural(state.legacy.miner);
    const polish = natural(state.legacy.polish);
    const echo = natural(state.legacy.echo);
    return 12n + level ** 3n / 6n + miner * 4n + polish * 2n + echo * 2n;
  }

  function income(state) {
    const rate = productionBase(state) / 20n;
    return rate < 2n ? 2n : rate;
  }

  function collectPassive(state, now = Date.now()) {
    if (now < state.paidAt) {
      state.paidAt = now;
      return 0n;
    }
    const elapsed = Math.min(offlineLimit, now - state.paidAt);
    const seconds = Math.floor(elapsed / 1000);
    const earned = BigInt(seconds) * income(state);
    state.shards += earned;
    state.paidAt = now - state.paidAt > offlineLimit ? now : state.paidAt + seconds * 1000;
    return earned;
  }

  function preview(state) {
    if (state.broken) return { cost: reforgeCost(state), target: 0n, success: 0, reset: 0, shatter: 0, bonus: 0 };
    const target = state.level + 1n;
    const base = target <= 32n ? chances[Number(target - 1n)] : Math.max(800, 2000 - Number(target - 32n > 48n ? 48n : target - 32n) * 25);
    const bonus = state.pity[target.toString()] ?? 0;
    const success = base === 10000 ? base : Math.min(9500, base + bonus);
    const failure = 10000 - success;
    const destructionShare = target < 6n ? 0 : Math.min(40, 10 + Number(target > 36n ? 36n : target) - 6);
    const shatter = Math.floor(failure * destructionShare / 100);
    return { target, cost: cost(target), success, reset: failure - shatter, shatter, bonus: success - base };
  }

  function enchantPreview(state) {
    const slots = state.enchantments.length;
    const full = slots >= enchantmentLimit;
    return {
      slots, full,
      // Keep engraving prices independent of automatic production balancing.
      cost: full || state.broken ? 0n : 120n * (state.level + 1n) + productionBase(state) * (slots === 1 ? 12n : 36n),
      success: full || state.broken ? 0 : slots === 1 ? 6000 : 3000,
    };
  }

  function enchant(state, now = Date.now(), random = Math.random) {
    const offer = enchantPreview(state);
    if (state.broken || offer.full || now - state.lastAt < cooldown || state.shards < offer.cost) return null;
    const success = Math.floor(random() * 10000) < offer.success;
    const effect = success ? rollEnchantment(random, state.enchantments) : null;
    if (effect) state.enchantments.push(effect);
    state.shards -= offer.cost;
    state.lastAt = now;
    const event = {
      kind: success ? 'enchant' : 'enchant-fail', from: state.level.toString(), target: state.level.toString(), at: now,
      ...(effect ? { enchantment: effect } : {}),
    };
    state.history.unshift(event);
    state.history.length = Math.min(state.history.length, 12);
    return { ...event, spent: offer.cost };
  }

  function act(state, now = Date.now(), random = Math.random) {
    if (now - state.lastAt < cooldown) return null;
    const offer = preview(state);
    if (state.shards < offer.cost) return null;
    const from = state.level;
    const effectCount = state.enchantments.length;
    let kind;
    if (state.broken) {
      kind = 'reforge';
      state.enchantment = rollEnchantment(random);
      state.enchantments = [state.enchantment];
      state.broken = false;
      state.level = 0n;
    } else {
      const roll = Math.floor(random() * 10000);
      state.attempts += 1n;
      if (roll < offer.success) {
        kind = 'success';
        state.level = offer.target;
        if (state.level > state.bestLevel) state.bestLevel = state.level;
        delete state.pity[offer.target.toString()];
      } else {
        kind = roll < offer.success + offer.reset ? 'reset' : 'shatter';
        state.pity[offer.target.toString()] = Math.min(9000, (state.pity[offer.target.toString()] ?? 0) + recoveryBonus);
        state.level = 0n;
        state.broken = kind === 'shatter';
        if (state.broken) {
          state.shattered += 1n;
          state.enchantments = [];
          state.enchantment = null;
        }
      }
    }
    state.shards -= offer.cost;
    state.lastAt = now;
    const event = { kind, from: from.toString(), target: offer.target.toString(), at: now,
      ...(kind === 'shatter' ? { lostEffects: effectCount } : {}),
    };
    state.history.unshift(event);
    state.history.length = Math.min(state.history.length, 12);
    return { ...event, spent: offer.cost };
  }

  return { saveKey, legacySaveKey, backupKey, seasonId, startingShards, cooldown, recoveryBonus, offlineLimit, enchantmentLimit, forms, enchantments, appraisal, restore, loadSeason, serialize, rankingName, rankingRecord, formAt, cost, income, preview, enchantPreview, collectPassive, act, enchant };
})();

if (typeof module !== 'undefined') module.exports = Forge;
