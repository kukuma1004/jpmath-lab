'use strict';

const Forge = (() => {
  const clientRevision = 2026112402;
  const rankingProtocol = 'forge-magic-1';
  const legacySaveKey = 'jp-math-lab:mongle-forge:v1';
  const backupKey = legacySaveKey + ':before-infinite';
  const seasonId = 'season-20261120-1';
  // Isolate the season from older tabs that still write the previous save format.
  const olderSaveKey = legacySaveKey + ':' + seasonId;
  const marketSaveKey = olderSaveKey + ':market-1';
  const rainbowSaveKey = olderSaveKey + ':rainbow-1';
  const riskSaveKey = olderSaveKey + ':risk-1';
  const storageSaveKey = olderSaveKey + ':storage-1';
  const previousSaveKey = olderSaveKey + ':magic-1';
  const saveKey = olderSaveKey + ':credits-1';
  const creditIdPattern = /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/;
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
    { level: 56n, name: '룬서약 대검', effect: 'gravity', color: '#b6d7ec', detail: '북방의 서약을 품은 묵직한 룬 대검' },
    { level: 64n, name: '용월 언월도', effect: 'leaf', color: '#a0e4b0', detail: '용의 수염처럼 갈라진 초승달 언월도' },
    { level: 72n, name: '해신의 삼지창', effect: 'anchor', color: '#7fe8e5', detail: '파도의 세 갈래를 품은 해신의 창' },
    { level: 80n, name: '번개벼림 망치', effect: 'lightning', color: '#d2e8ff', detail: '각진 쇳덩이와 짧은 자루에 담긴 천둥' },
    { level: 90n, name: '여의 천금봉', effect: 'clockwork', color: '#f7ca6b', detail: '구름 금테와 붉은 옻칠로 완성한 신묘한 봉' },
    { level: 100n, name: '성약의 왕검', effect: 'dawn', color: '#ffdca1', detail: '날개 모양 황금 가드와 붉은 보석의 왕검' },
    { level: 120n, name: '흑조 쌍날검', effect: 'eclipse', color: '#b4bcf5', detail: '검은 백조의 날개처럼 양쪽으로 펼쳐진 날' },
    { level: 150n, name: '태양수레 차크람', effect: 'keylight', color: '#ffd482', detail: '텅 빈 중심을 둘러싼 여덟 개의 태양 칼날' },
    { level: 180n, name: '구름가름 대도', effect: 'comet', color: '#b8d9eb', detail: '구름을 가르는 거대한 직선 철판 칼날' },
    { level: 220n, name: '달그림자 쌍도', effect: 'aurora', color: '#c6bcff', detail: '서로 다른 곡률로 포개진 한 쌍의 월도' },
    { level: 270n, name: '운명가름 대낫', effect: 'galaxy', color: '#d6bcf5', detail: '긴 자루 끝을 가로지르는 운명의 검은 낫' },
    { level: 330n, name: '별을꿰는 신창', effect: 'phoenix', color: '#fff0b7', detail: '세 겹의 궤도 고리에 떠 있는 별빛 창끝' },
  ];

  const enchantments = [
    { id: 'cinder', name: '잿불의 숨결', rank: '일반', mark: '♨', tenths: 12n, weight: 38 },
    { id: 'solar', name: '노을의 불꽃', rank: '희귀', mark: '☀', tenths: 14n, weight: 22 },
    { id: 'astral', name: '별빛의 축복', rank: '영웅', mark: '✦', tenths: 24n, weight: 12 },
    { id: 'verdant', name: '숲의 가호', rank: '희귀', mark: '❧', tenths: 21n, weight: 14 },
    { id: 'frost', name: '서리꽃 각인', rank: '희귀', mark: '❄', tenths: 16n, weight: 28 },
    { id: 'storm', name: '폭풍의 맹세', rank: '희귀', mark: 'ϟ', tenths: 19n, weight: 18 },
    { id: 'lunar', name: '월식의 계약', rank: '전설', mark: '☾', tenths: 32n, weight: 4 },
  ];

  const magics = [
    { id: 'fire', name: '화염', title: '불꽃의 서약', mark: '♨', color: '#ff9e3d', detail: '검날을 타고 오르는 불꽃과 흩날리는 불씨' },
    { id: 'ice', name: '빙결', title: '영원의 서리', mark: '❄', color: '#9ce9ff', detail: '서리꽃과 공중에 부서지는 투명한 얼음 결정' },
    { id: 'thunder', name: '전격', title: '뇌명의 심장', mark: 'ϟ', color: '#c6d8ff', detail: '칼날 사이를 가르는 번개와 떠 있는 전하 고리' },
    { id: 'void', name: '공허', title: '심연의 부름', mark: '◈', color: '#d2a8ff', detail: '빛을 삼키는 검은 궤도와 안으로 빨려드는 별가루' },
    { id: 'radiance', name: '성광', title: '여명의 축복', mark: '✧', color: '#fff0a6', detail: '검을 감싸는 날개빛과 겹겹이 펼쳐지는 성환' },
  ];

  function normalizeMagic(raw, level = 0n) {
    if (!raw || !magics.some(entry => entry.id === raw.id)) return null;
    const peak = natural(raw.peak);
    if (peak < 100n) return null;
    return { id: raw.id, peak: peak > level ? peak : level };
  }

  function magicAt(state) {
    const bound = state.broken ? null : normalizeMagic(state.magic, state.level);
    if (!bound) return null;
    const rank = 1n + (bound.peak - 100n) / 25n;
    return { ...magics.find(entry => entry.id === bound.id), peak: bound.peak, rank,
      tier: Number(rank > 5n ? 5n : rank), tenths: 17n + rank };
  }

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
    const rawBase = state.broken ? 0n : 120n + 15n * state.level * (state.level + 1n) * (state.level + 2n);
    const levelTenths = 10n + state.level;
    const base = rawBase * levelTenths / 10n;
    const engravedValue = base * numerator / denominator;
    const magic = magicAt(state);
    const value = magic ? engravedValue * magic.tenths / 10n : engravedValue;
    return { enchantment: effects[0], effects, numerator, denominator, rawBase, levelTenths, base, engravedValue, magic, magicBonus: value - engravedValue, value };
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
      entry && ['success', 'reset', 'shatter', 'reforge', 'enchant', 'enchant-fail', 'protected', 'protection', 'sell', 'reroll'].includes(entry.kind) &&
      /^\d+$/.test(String(entry.from)) && /^\d+$/.test(String(entry.target)) && Number.isFinite(entry.at) &&
      (!['protection', 'sell'].includes(entry.kind) || /^\d+$/.test(String(entry.amount))) &&
      (entry.kind !== 'reroll' || Number.isInteger(entry.slot) && entry.slot >= 1 && entry.slot <= enchantmentLimit &&
        enchantments.some(effect => effect.id === entry.enchantment) && enchantments.some(effect => effect.id === entry.replaced) &&
        entry.enchantment !== entry.replaced && /^\d+$/.test(String(entry.valueBefore)) && /^\d+$/.test(String(entry.valueAfter)))
    ).slice(0, 12).map(entry => ({
      kind: entry.kind, from: String(entry.from), target: String(entry.target), at: entry.at,
      ...(/^\d+$/.test(String(entry.spent)) ? { spent: String(entry.spent) } : {}),
      ...(['enchant', 'reroll'].includes(entry.kind) && enchantments.some(effect => effect.id === entry.enchantment) ? { enchantment: entry.enchantment } : {}),
      ...(entry.kind === 'reroll' ? { replaced: entry.replaced, slot: entry.slot, valueBefore: String(entry.valueBefore), valueAfter: String(entry.valueAfter) } : {}),
      ...(entry.kind === 'shatter' && Number.isInteger(entry.lostEffects) && entry.lostEffects >= 0 && entry.lostEffects <= enchantmentLimit ? { lostEffects: entry.lostEffects } : {}),
      ...(['protection', 'sell'].includes(entry.kind) && /^\d+$/.test(String(entry.amount)) ? { amount: String(entry.amount) } : {}),
      ...(entry.kind === 'protected' && /^\d+$/.test(String(entry.to)) ? { to: String(entry.to) } : {}),
      ...(magics.some(magic => magic.id === entry.magicAwakened) ? { magicAwakened: entry.magicAwakened } : {}),
    })) : [];
    const protections = {};
    if (old.protections && typeof old.protections === 'object') {
      for (const [target, owned] of Object.entries(old.protections)) {
        if (/^[1-9]\d*$/.test(target) && owned === true) protections[target] = true;
      }
    }
    const savedEffects = !broken && Array.isArray(old.enchantments) ? old.enchantments.filter(id =>
      enchantments.some(entry => entry.id === id)).slice(0, enchantmentLimit) : [];
    if (!broken && !savedEffects.length) savedEffects.push(enchantments.some(entry => entry.id === old.enchantment) ? old.enchantment :
      raw ? ['cinder', 'frost', 'storm', 'astral', 'lunar'][Number((level / 8n + 4n) % 5n)] : rollEnchantment(random));

    return {
      version: 2,
      season: seasonId,
      level,
      bestLevel,
      enchantment: savedEffects[0] ?? null,
      enchantments: savedEffects,
      magic: broken ? null : normalizeMagic(old.magic, level),
      shards: natural(old.shards, startingShards),
      broken,
      sold: broken && old.sold === true,
      generation: natural(old.generation),
      protections,
      protectionUses: natural(old.protectionUses, BigInt(history.filter(entry => entry.kind === 'protected').length)),
      rankingBest: normalizeSnapshot(old.rankingBest),
      appliedGrant: typeof old.appliedGrant === 'string' && /^[A-Za-z0-9_-]{1,80}$/.test(old.appliedGrant) ? old.appliedGrant : null,
      creditReceipts: Object.fromEntries(Object.entries(old.creditReceipts && typeof old.creditReceipts === 'object' ? old.creditReceipts : {}).filter(([id, applied]) => creditIdPattern.test(id) && applied === true)),
      rankBonus: old.rankBonus && Number.isInteger(old.rankBonus.rank) && old.rankBonus.rank >= 1 && old.rankBonus.rank <= 10 &&
        Number.isFinite(old.rankBonus.since) && old.rankBonus.since >= 0 && old.rankBonus.since <= now &&
        Number.isFinite(old.rankBonus.until) && old.rankBonus.until >= old.rankBonus.since && old.rankBonus.until <= old.rankBonus.since + 60000 ? { ...old.rankBonus } : null,
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
    const snapshot = weaponSnapshot(state);
    if (!snapshot) throw new Error('이 무기는 랭킹의 표시 범위를 넘었어요. 강화는 계속할 수 있어요.');
    return {
      nickname: rankingName(nickname, 12), weaponName: rankingName(weaponName, 16),
      rulesVersion: rankingProtocol,
      ...snapshot,
    };
  }

  function weaponSnapshot(state) {
    if (state.broken) return null;
    const value = appraisal(state).value.toString();
    if (value.length > 512 || state.level.toString().length > 128) return null;
    return { level: state.level.toString(), value: value.padStart(512, '0'),
      effect1: state.enchantments[0], effect2: state.enchantments[1] ?? 'none', effect3: state.enchantments[2] ?? 'none',
      magic: magicAt(state)?.id ?? 'none', magicPeak: magicAt(state)?.peak.toString() ?? '0',
      ...(typeof state.protectionUses === 'bigint' && state.protectionUses.toString().length <= 128 ? { protectionUses: state.protectionUses.toString() } : {}),
    };
  }

  function normalizeSnapshot(row) {
    if (!row || typeof row.level !== 'string' || !/^(0|[1-9][0-9]{0,127})$/.test(row.level) ||
        typeof row.value !== 'string' || !/^[0-9]{512}$/.test(row.value)) return null;
    const ids = [row.effect1, row.effect2, row.effect3];
    if (ids[0] === 'none' || (ids[1] === 'none' && ids[2] !== 'none')) return null;
    const effects = ids.filter(id => id !== 'none');
    if (effects.some(id => !enchantments.some(effect => effect.id === id))) return null;
    return weaponSnapshot({ level: BigInt(row.level), enchantments: effects, broken: false,
      magic: row.magic === 'none' || row.magic == null ? null : normalizeMagic({ id: row.magic, peak: row.magicPeak }, BigInt(row.level)),
      protectionUses: typeof row.protectionUses === 'string' && /^(0|[1-9][0-9]{0,127})$/.test(row.protectionUses) ? BigInt(row.protectionUses) : undefined });
  }

  function sameWeaponRecord(a, b) {
    return !!a && !!b && ['value', 'level', 'effect1', 'effect2', 'effect3'].every(key => a[key] === b[key]) &&
      (a.magic ?? 'none') === (b.magic ?? 'none') && (a.magicPeak ?? '0') === (b.magicPeak ?? '0');
  }

  function applyAdminGrant(state, grant) {
    const credited = applyCredits(state, grant?.credits);
    return applyWeaponGrant(state, grant) || credited;
  }

  function applyCredits(state, credits) {
    if (!credits || typeof credits !== 'object' || Array.isArray(credits)) return false;
    let applied = false;
    for (const [id, credit] of Object.entries(credits)) {
      if (!creditIdPattern.test(id) || state.creditReceipts[id] === true || !credit || credit.season !== seasonId ||
          typeof credit.amount !== 'string' || !/^[1-9][0-9]{0,17}$/.test(credit.amount) ||
          !Number.isFinite(credit.issuedAt) || credit.issuedAt < 0) continue;
      state.shards += BigInt(credit.amount);
      state.creditReceipts[id] = true;
      applied = true;
    }
    return applied;
  }

  function applyWeaponGrant(state, grant) {
    if (!grant || grant.season !== seasonId || typeof grant.id !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/.test(grant.id) ||
        state.appliedGrant === grant.id || !Number.isFinite(grant.issuedAt) ||
        !Array.isArray(grant.effects) || grant.effects.length !== enchantmentLimit ||
        grant.effects.some(id => !enchantments.some(effect => effect.id === id))) return false;
    const source = normalizeSnapshot(grant.source);
    if (!source) return false;
    // An authenticated owner may receive a one-time correction of an existing record.
    // Never resurrect a destroyed weapon or grant its effects to a subsequently made sword.
    if (!state.broken && state.lastAt <= grant.issuedAt && state.level >= BigInt(source.level) &&
        ['effect1', 'effect2', 'effect3'].every((key, index) => source[key] === (state.enchantments[index] ?? 'none'))) {
      state.enchantments = [...grant.effects]; state.enchantment = grant.effects[0];
    }
    const corrected = weaponSnapshot({ level: BigInt(source.level), enchantments: grant.effects, broken: false,
      magic: source.magic === 'none' ? null : { id: source.magic, peak: source.magicPeak },
      protectionUses: source.protectionUses === undefined ? undefined : BigInt(source.protectionUses) });
    if (!state.rankingBest || corrected.value > state.rankingBest.value) state.rankingBest = corrected;
    rememberWeapon(state);
    state.appliedGrant = grant.id;
    return true;
  }

  function rememberWeapon(state) {
    const snapshot = weaponSnapshot(state);
    if (snapshot && (!state.rankingBest || snapshot.value > state.rankingBest.value)) state.rankingBest = snapshot;
    else if (sameWeaponRecord(snapshot, state.rankingBest) && snapshot.protectionUses !== undefined &&
        (state.rankingBest.protectionUses === undefined || BigInt(snapshot.protectionUses) >= BigInt(state.rankingBest.protectionUses))) state.rankingBest.protectionUses = snapshot.protectionUses;
  }

  function formAt(level) {
    const last = forms.at(-1).level;
    if (level <= last) {
      const index = forms.findLastIndex(form => level >= form.level);
      return { ...forms[index], index, awakening: 0n, next: forms[index + 1]?.level ?? last + 1n };
    }
    const step = (level - last - 1n) / 10n;
    const index = 20 + Number(step % 12n);
    return { ...forms[index], index, awakening: step / 12n + 1n, next: last + 1n + (step + 1n) * 10n };
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

  function incomeBreakdown(state) {
    const rate = productionBase(state) / 20n;
    const previous = (rate < 2n ? 2n : rate) * 2n;
    return { base: 4n, record: (previous - 4n) * 2n, current: state.broken ? 0n : state.level ** 2n / 2n };
  }

  function baseIncome(state) {
    const parts = incomeBreakdown(state);
    return parts.base + parts.record + parts.current;
  }

  function passiveCapacity(state) {
    const target = state.bestLevel + 1n;
    const attempt = cost(target);
    const protection = 1000n + target ** 2n * 100n + attempt * 8n;
    const capacity = (protection + attempt) * 3n;
    // Three full-price protected attempts, rounded up; a broken sword keeps its capacity.
    return capacity < startingShards ? startingShards : (capacity + 999n) / 1000n * 1000n;
  }

  function discountInfo(now = Date.now()) {
    const shifted = now + 9 * 60 * 60 * 1000;
    const day = Math.floor(shifted / 86400000) * 86400000 - 9 * 60 * 60 * 1000;
    for (const [start, end] of [[7, 8], [12, 14], [21, 24]]) {
      if (now >= day + start * 3600000 && now < day + end * 3600000) return { active: true, until: day + end * 3600000, endHour: end };
    }
    return { active: false };
  }

  function priceQuote(originalCost, now) {
    const discount = discountInfo(now).active;
    return { originalCost, cost: discount ? (originalCost + 1n) / 2n : originalCost, discount };
  }

  function rankReward(rank) {
    return Number.isInteger(rank) && rank >= 1 && rank <= 10 ? 100n - BigInt(rank - 1) * 5n : 0n;
  }

  function income(state, now = Date.now()) {
    const bonus = state.rankBonus;
    return baseIncome(state) + (bonus && now >= bonus.since && now < bonus.until ? rankReward(bonus.rank) : 0n);
  }

  function setRankBonus(state, rank, now = Date.now()) {
    state.rankBonus = rankReward(rank) ? { rank, since: now, until: now + 60000 } : null;
  }

  function collectPassive(state, now = Date.now()) {
    if (now < state.paidAt) {
      state.paidAt = now;
      return 0n;
    }
    const room = passiveCapacity(state) - state.shards;
    if (room <= 0n) {
      state.paidAt = now;
      return 0n;
    }
    const elapsed = Math.min(offlineLimit, now - state.paidAt);
    const seconds = Math.floor(elapsed / 1000);
    const start = now - state.paidAt > offlineLimit ? now - offlineLimit : state.paidAt;
    const end = start + seconds * 1000;
    const bonus = state.rankBonus;
    const eligible = bonus ? Math.max(0, Math.min(end, bonus.until) - Math.max(start, bonus.since)) : 0;
    const earned = BigInt(seconds) * baseIncome(state) + BigInt(Math.floor(eligible / 1000)) * (bonus ? rankReward(bonus.rank) : 0n);
    const credited = earned > room ? room : earned;
    state.shards += credited;
    // Time spent full is discarded, including fractions, so spending cannot claim it later.
    state.paidAt = credited === room || now - state.paidAt > offlineLimit ? now : state.paidAt + seconds * 1000;
    return credited;
  }

  function preview(state, now = Date.now()) {
    if (state.broken) {
      const quote = priceQuote(reforgeCost(state), now);
      return { ...quote, token: state.generation + ':reforge:' + quote.cost, target: 0n, success: 0, reset: 0, shatter: 0, bonus: 0 };
    }
    const target = state.level + 1n;
    const base = target <= 32n ? chances[Number(target - 1n)] : Math.max(800, 2000 - Number(target - 32n > 48n ? 48n : target - 32n) * 25);
    const bonus = state.pity[target.toString()] ?? 0;
    const success = base === 10000 ? base : Math.min(9500, base + bonus);
    const failure = 10000 - success;
    const destructionShare = target < 6n ? 0 : Math.min(40, 10 + Number(target > 36n ? 36n : target) - 6);
    const shatter = Math.floor(failure * destructionShare / 100);
    const quote = priceQuote(cost(target), now);
    return { target, ...quote, token: state.generation + ':' + target + ':' + quote.cost + ':' + !!state.protections[target.toString()], success, reset: failure - shatter, shatter, bonus: success - base,
      protectionDrop: state.level >= 100n ? 1n : 0n };
  }

  function enchantPreview(state, now = Date.now()) {
    const slots = state.enchantments.length;
    const full = slots >= enchantmentLimit;
    const baseCost = 100n + 10n * (state.level + 1n) ** 2n;
    const quote = priceQuote(state.broken ? 0n : baseCost * BigInt(full ? 3 : slots === 1 ? 1 : 2), now);
    return {
      slots, full, reroll: full && !state.broken,
      token: state.generation + ':' + state.level + ':' + state.bestLevel + ':' + state.enchantments.join(',') + ':' + quote.cost,
      // Price the held weapon; a previous high record must not penalize a fresh sword.
      ...quote,
      success: state.broken ? 0 : full ? 10000 : slots === 1 ? 6000 : 3000,
    };
  }

  function enchant(state, now = Date.now(), random = Math.random, expectedToken) {
    const offer = enchantPreview(state, now);
    if (state.broken || offer.full || now - state.lastAt < cooldown || state.shards < offer.cost || expectedToken !== undefined && expectedToken !== offer.token) return null;
    rememberWeapon(state);
    const success = Math.floor(random() * 10000) < offer.success;
    const effect = success ? rollEnchantment(random) : null;
    if (effect) state.enchantments.push(effect);
    rememberWeapon(state);
    state.shards -= offer.cost;
    state.lastAt = now;
    const event = {
      kind: success ? 'enchant' : 'enchant-fail', from: state.level.toString(), target: state.level.toString(), at: now,
      spent: offer.cost.toString(),
      ...(effect ? { enchantment: effect } : {}),
    };
    state.history.unshift(event);
    state.history.length = Math.min(state.history.length, 12);
    return { ...event, spent: offer.cost };
  }

  function act(state, now = Date.now(), random = Math.random, expectedToken) {
    if (now - state.lastAt < cooldown) return null;
    const offer = preview(state, now);
    if (state.shards < offer.cost || expectedToken !== undefined && expectedToken !== offer.token) return null;
    rememberWeapon(state);
    const from = state.level;
    const effectCount = state.enchantments.length;
    let kind;
    if (state.broken) {
      kind = 'reforge';
      state.enchantment = rollEnchantment(random);
      state.enchantments = [state.enchantment];
      state.magic = null;
      state.broken = false;
      state.sold = false;
      state.generation += 1n;
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
        kind = state.protections[offer.target.toString()] ? 'protected' : roll < offer.success + offer.reset ? 'reset' : 'shatter';
        state.pity[offer.target.toString()] = Math.min(9000, (state.pity[offer.target.toString()] ?? 0) + recoveryBonus);
        if (kind === 'protected') {
          delete state.protections[offer.target.toString()]; state.protectionUses += 1n;
          state.level -= offer.protectionDrop;
        }
        else state.level = 0n;
        state.broken = kind === 'shatter';
        if (state.broken) {
          state.shattered += 1n;
          state.enchantments = [];
          state.enchantment = null;
          state.magic = null;
        }
      }
    }
    let magicAwakened;
    if (kind === 'success' && state.level >= 100n && !state.magic && random() < 1 / 4096) {
      const element = magics[Math.min(magics.length - 1, Math.floor(random() * magics.length))];
      state.magic = { id: element.id, peak: state.level };
      magicAwakened = element.id;
    }
    if (state.magic && state.level > state.magic.peak) state.magic.peak = state.level;
    state.shards -= offer.cost;
    state.lastAt = now;
    rememberWeapon(state);
    const event = { kind, from: from.toString(), target: offer.target.toString(), at: now, spent: offer.cost.toString(),
      ...(kind === 'protected' ? { to: state.level.toString() } : {}),
      ...(magicAwakened ? { magicAwakened } : {}),
      ...(kind === 'shatter' ? { lostEffects: effectCount } : {}),
    };
    state.history.unshift(event);
    state.history.length = Math.min(state.history.length, 12);
    return { ...event, spent: offer.cost };
  }

  function reroll(state, now = Date.now(), random = Math.random, expectedToken) {
    const offer = enchantPreview(state, now);
    if (!offer.reroll || now - state.lastAt < cooldown || state.shards < offer.cost ||
        expectedToken !== undefined && expectedToken !== offer.token) return null;
    rememberWeapon(state);
    const valueBefore = appraisal(state).value;
    const index = Math.min(enchantmentLimit - 1, Math.floor(random() * enchantmentLimit));
    const replaced = state.enchantments[index];
    const enchantment = rollEnchantment(random, [replaced]);
    state.enchantments[index] = enchantment;
    state.enchantment = state.enchantments[0];
    state.shards -= offer.cost;
    state.lastAt = now;
    rememberWeapon(state);
    const event = { kind: 'reroll', from: state.level.toString(), target: state.level.toString(), at: now,
      spent: offer.cost.toString(),
      slot: index + 1, replaced, enchantment, valueBefore: valueBefore.toString(), valueAfter: appraisal(state).value.toString() };
    state.history.unshift(event); state.history.length = Math.min(state.history.length, 12);
    return { ...event, spent: offer.cost };
  }

  function protectionOffer(state, now = Date.now()) {
    const offer = preview(state, now);
    const quote = priceQuote(offer.target ? 1000n + offer.target ** 2n * 100n + cost(offer.target) * 8n : 0n, now);
    return { target: offer.target, ...quote, token: state.generation + ':' + offer.target + ':' + quote.cost,
      owned: state.protections[offer.target.toString()] === true, eligible: !state.broken && offer.success < 10000 };
  }

  function buyProtection(state, now = Date.now(), expectedToken) {
    const offer = protectionOffer(state, now);
    if (!offer.eligible || offer.owned || state.shards < offer.cost || now - state.lastAt < cooldown || expectedToken !== undefined && expectedToken !== offer.token) return null;
    state.protections[offer.target.toString()] = true;
    state.shards -= offer.cost;
    state.lastAt = now;
    const event = { kind: 'protection', from: state.level.toString(), target: offer.target.toString(), at: now, amount: offer.cost.toString() };
    state.history.unshift(event); state.history.length = Math.min(state.history.length, 12);
    return event;
  }

  function saleOffer(state) {
    const value = appraisal(state).value;
    return { value, shards: value / 10n, token: state.generation + ':' + state.level + ':' + state.enchantments.join(',') };
  }

  function sell(state, now = Date.now(), token) {
    const offer = saleOffer(state);
    if (state.broken || token !== offer.token || now - state.lastAt < cooldown) return null;
    rememberWeapon(state);
    const event = { kind: 'sell', from: state.level.toString(), target: '0', at: now, amount: offer.shards.toString() };
    state.shards += offer.shards;
    state.broken = true; state.sold = true; state.level = 0n;
    state.enchantments = []; state.enchantment = null; state.lastAt = now;
    state.magic = null;
    state.history.unshift(event); state.history.length = Math.min(state.history.length, 12);
    return event;
  }

  return { clientRevision, rankingProtocol, saveKey, previousSaveKey, storageSaveKey, riskSaveKey, rainbowSaveKey, marketSaveKey, olderSaveKey, legacySaveKey, backupKey, seasonId, startingShards, cooldown, recoveryBonus, offlineLimit, enchantmentLimit, forms, enchantments, magics, magicAt, appraisal, restore, loadSeason, serialize, rankingName, rankingRecord, weaponSnapshot, sameWeaponRecord, applyAdminGrant, rememberWeapon, formAt, cost, incomeBreakdown, discountInfo, passiveCapacity, baseIncome, income, rankReward, setRankBonus, preview, protectionOffer, buyProtection, saleOffer, sell, enchantPreview, collectPassive, act, enchant, reroll };
})();

if (typeof module !== 'undefined') module.exports = Forge;
