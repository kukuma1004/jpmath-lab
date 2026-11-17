'use strict';

const Forge = (() => {
  const seconds = 25;
  const saveKey = 'jp-math-lab:mongle-forge:v1';
  const intervalMs = 5000;
  const offlineLimit = 8 * 60 * 60 * 1000;
  const maxShards = 1_000_000_000_000;
  const upgradesByLevel = [
    { cost: 16, chance: 100 }, { cost: 32, chance: 100 }, { cost: 56, chance: 99 },
    { cost: 88, chance: 98 }, { cost: 135, chance: 96 }, { cost: 190, chance: 93 },
    { cost: 275, chance: 90 }, { cost: 390, chance: 86 }, { cost: 530, chance: 80 },
    { cost: 710, chance: 73 }, { cost: 940, chance: 62 }, { cost: 1230, chance: 45 },
    { cost: 1550, chance: 100 }, { cost: 1950, chance: 98 }, { cost: 2450, chance: 97 },
    { cost: 3100, chance: 95 }, { cost: 3800, chance: 93 }, { cost: 4600, chance: 90 },
    { cost: 5600, chance: 88 }, { cost: 6800, chance: 85 },
  ];
  const maxLevel = upgradesByLevel.length;
  const recoveryBonus = 12;
  const damage = [1, 2, 3, 4, 5, 7, 9, 11, 14, 18, 23, 30, 38, 46, 56, 68, 83, 100, 120, 143, 170];

  const forms = [
    { level: 0, name: '연습용 나무검', perk: '누른 대상에게 기본 베기', pattern: 'single', color: '#ffe3ad' },
    { level: 2, name: '클로버 잎새검', perk: '잎새 베기 · 옆칸 한 곳을 함께 타격', pattern: 'side', color: '#bcffac' },
    { level: 4, name: '꽃비 초승검', perk: '꽃비 베기 · 같은 줄을 통째로 타격', pattern: 'row', color: '#ffb4d6' },
    { level: 6, name: '서리수정 대검', perk: '서리 파동 · 붙어 있는 상하좌우 타격', pattern: 'near', color: '#a7e7ff' },
    { level: 9, name: '달그림자 월검', perk: '달빛 파동 · 가로와 세로를 통째로 타격', pattern: 'cross', color: '#d2bcff' },
    { level: 12, name: '별꼬리 성검', perk: '별비 베기 · 원정장 전체를 타격', pattern: 'all', color: '#fff2b0' },
    { level: 14, name: '혜성 쌍날검', perk: '쌍혜성 · 전체를 베고 같은 가로줄에 공격력 100%', pattern: 'all', effect: 'comet', fullPower: 'row', color: '#ffdb8d' },
    { level: 16, name: '오로라 파도검', perk: '빛의 물결 · 전체를 베고 가로·세로줄에 공격력 100%', pattern: 'all', effect: 'aurora', fullPower: 'cross', color: '#9ef5dc' },
    { level: 18, name: '일식 고리검', perk: '일식 고리 · 원정장 전체에 공격력 100%', pattern: 'all', effect: 'eclipse', fullPower: 'all', color: '#ffd18c' },
    { level: 20, name: '은하 성운검', perk: '은하 소용돌이 · 원정장 전체에 공격력 150%', pattern: 'all', effect: 'galaxy', fullPower: 'all', multiplier: 1.5, color: '#e5c8ff' },
  ];

  const regions = [
    {
      name: '클로버 숲', texture: 'field', level: 0, goal: 8, bonus: 6,
      enemies: [
        { name: '잎싹 말랑이', art: 'sprout', hp: 1, reward: 2 },
        { name: '잎꼬리 말랑이', art: 'fox', hp: 3, reward: 5 },
      ],
      boss: { name: '클로버 문지기', art: 'fox', hp: 14, reward: 20 },
    },
    {
      name: '꽃비 동산', texture: 'orchard', level: 4, goal: 10, bonus: 22,
      enemies: [
        { name: '잎꼬리 말랑이', art: 'fox', hp: 5, reward: 7 },
        { name: '꽃뿔 말랑이', art: 'deer', hp: 11, reward: 15 },
      ],
      boss: { name: '꽃비 문지기', art: 'deer', hp: 50, reward: 70 },
    },
    {
      name: '달빛 골짜기', texture: 'moon', level: 8, goal: 12, bonus: 55,
      enemies: [
        { name: '꽃뿔 말랑이', art: 'deer', hp: 12, reward: 20 },
        { name: '달귀 말랑이', art: 'moonling', hp: 24, reward: 37 },
      ],
      boss: { name: '달빛 문지기', art: 'moonling', hp: 125, reward: 200 },
    },
    {
      name: '혜성 고원', texture: 'comet', level: 12, goal: 14, bonus: 185,
      enemies: [
        { name: '혜성껍질 말랑이', art: 'meteor-fox', hp: 32, reward: 75 },
        { name: '불꽃갈기 말랑이', art: 'comet-lion', hp: 57, reward: 125 },
      ],
      boss: { name: '혜성갈기 문지기', art: 'comet-lion', hp: 360, reward: 680 },
    },
    {
      name: '은하 대장간', texture: 'nebula', level: 16, goal: 18, bonus: 460,
      enemies: [
        { name: '별무늬 해파리', art: 'star-jelly', hp: 72, reward: 155 },
        { name: '별구름 꼬마 용', art: 'nebula-dragon', hp: 110, reward: 240 },
      ],
      boss: { name: '은하 용 문지기', art: 'nebula-dragon', hp: 980, reward: 1480 },
    },
  ];

  const upgrades = {
    polish: { name: '칼날 연마', art: 'ore', text: '공격력 +2', prices: [25, 65, 155, 300, 620] },
    echo: { name: '베기 연습', art: 'meteor', text: '연계 발동에 필요한 타격 −1', unlock: 2, prices: [75, 240] },
    miner: { name: '꼬마 채굴기', art: 'mill', text: '5초마다 별철 +2', prices: [38, 92, 235, 470, 830] },
  };

  function integer(value, max) {
    return Number.isFinite(value) ? Math.min(max, Math.max(0, Math.floor(value))) : 0;
  }

  function restore(raw, now = Date.now()) {
    const stored = raw && typeof raw === 'object' ? raw : {};
    const level = integer(stored.level, maxLevel);
    const bestLevel = Math.max(level, integer(stored.bestLevel, maxLevel));
    const savedMisses = Array.isArray(stored.forgeMissesByLevel) ? stored.forgeMissesByLevel : null;
    const forgeMissesByLevel = upgradesByLevel.map(({ chance }, step) => {
      const maxMisses = Math.ceil((100 - chance) / recoveryBonus);
      const saved = savedMisses ? savedMisses[step] : step === level ? stored.forgeMisses : 0;
      return integer(saved, maxMisses);
    });
    const region = integer(stored.region, regions.length - 1);
    const cleared = regions.map((_, i) => Boolean(stored.cleared?.[i]));
    return {
      shards: integer(stored.shards, maxShards),
      level,
      bestLevel,
      forgeMissesByLevel,
      region: regions[region].level <= bestLevel ? region : 0,
      cleared,
      polish: integer(stored.polish, upgrades.polish.prices.length),
      echo: bestLevel < upgrades.echo.unlock ? 0 : integer(stored.echo, upgrades.echo.prices.length),
      miner: integer(stored.miner, upgrades.miner.prices.length),
      paidAt: Number.isFinite(stored.paidAt) ? Math.min(now, Math.max(0, stored.paidAt)) : now,
    };
  }

  function credit(state, amount) {
    state.shards = Math.min(maxShards, state.shards + amount);
  }

  function collectPassive(state, now = Date.now()) {
    if (state.miner === 0 || now < state.paidAt) {
      state.paidAt = now;
      return 0;
    }
    const elapsed = now - state.paidAt;
    const ticks = Math.floor(Math.min(elapsed, offlineLimit) / intervalMs);
    if (ticks === 0) return 0;
    const income = ticks * state.miner * 2;
    state.paidAt = elapsed > offlineLimit ? now : state.paidAt + ticks * intervalMs;
    credit(state, income);
    return income;
  }

  function formIndex(level) {
    return forms.findLastIndex(form => form.level <= level);
  }

  function power(state) {
    return damage[state.level] + state.polish * 2;
  }

  function chainEvery(state) {
    return 4 - state.echo;
  }

  function enhancement(state, from = state.level) {
    const next = upgradesByLevel[from];
    if (!next) return null;
    const chance = Math.min(100, next.chance + state.forgeMissesByLevel[from] * recoveryBonus);
    return { cost: next.cost, chance, bonus: chance - next.chance };
  }

  function enhance(state, random = Math.random) {
    const from = state.level;
    const offer = enhancement(state, from);
    if (!offer || state.shards < offer.cost) return null;
    state.shards -= offer.cost;
    const succeeded = offer.chance === 100 || random() < offer.chance / 100;
    if (succeeded) {
      state.level = from + 1;
      state.bestLevel = Math.max(state.bestLevel, state.level);
      state.forgeMissesByLevel[from] = 0;
    } else {
      state.forgeMissesByLevel[from] += 1;
      state.level = 0;
    }
    return { succeeded, spent: offer.cost };
  }

  function purchase(state, id, now = Date.now()) {
    const cost = upgrades[id]?.prices[state[id]];
    if (cost === undefined || state.shards < cost || state.bestLevel < (upgrades[id]?.unlock ?? 0)) return false;
    if (id === 'miner') {
      collectPassive(state, now);
      state.paidAt = now;
    }
    state.shards -= cost;
    state[id] += 1;
    return true;
  }

  function randomEnemy(region, random) {
    const enemy = region.enemies[random() < 0.72 ? 0 : 1];
    return { ...enemy, maxHp: enemy.hp };
  }

  function begin(state, now, random = Math.random) {
    const region = regions[state.region];
    return {
      region,
      initial: state.region,
      until: now + seconds * 1000,
      turns: 0,
      kills: 0,
      earned: 0,
      bossAppeared: false,
      bossDefeated: false,
      spots: Array.from({ length: 9 }, (_, index) => randomEnemy(region, index % 3 === 2 ? random : () => 0)),
    };
  }

  function splashTargets(pattern, index) {
    const row = Math.floor(index / 3);
    const column = index % 3;
    const neighbors = Array.from({ length: 9 }, (_, neighbor) => neighbor).filter(neighbor => neighbor !== index);
    if (pattern === 'side') return [column < 2 ? index + 1 : index - 1];
    return neighbors.filter(neighbor => {
      const rowDistance = Math.abs(row - Math.floor(neighbor / 3));
      const columnDistance = Math.abs(column - neighbor % 3);
      if (pattern === 'row') return rowDistance === 0;
      if (pattern === 'near') return rowDistance + columnDistance === 1;
      if (pattern === 'cross') return rowDistance === 0 || columnDistance === 0;
      return pattern === 'all';
    });
  }

  function strike(state, run, index, random = Math.random) {
    if (!run.spots[index]) return null;
    run.turns += 1;
    const form = forms[formIndex(state.level)];
    const chain = form.pattern !== 'single' && run.turns % chainEvery(state) === 0;
    const targets = chain ? [index, ...splashTargets(form.pattern, index)] : [index];
    const basePower = power(state);
    const strength = chain && form.multiplier ? Math.ceil(basePower * form.multiplier) : basePower;
    const fullPowerTargets = chain && form.fullPower ? splashTargets(form.fullPower, index) : [];
    const hits = targets.map((target, order) => {
      const enemy = run.spots[target];
      const fullPowerHit = order === 0 || fullPowerTargets.includes(target);
      const points = fullPowerHit ? strength : Math.max(1, Math.ceil(strength * 0.6));
      enemy.hp = Math.max(0, enemy.hp - points);
      const killed = enemy.hp === 0;
      const reward = killed ? enemy.reward : 0;
      if (killed) {
        run.kills += 1;
        if (enemy.boss) {
          run.bossDefeated = true;
          state.cleared[run.initial] = true;
        }
        run.spots[target] = randomEnemy(run.region, random);
      }
      return { target, reward, points };
    });
    if (!run.bossAppeared && run.kills >= run.region.goal) {
      const boss = run.region.boss;
      const position = hits.find(hit => hit.reward > 0).target;
      run.spots[position] = { ...boss, maxHp: boss.hp, boss: true };
      run.bossAppeared = true;
    }
    const total = hits.reduce((sum, hit) => sum + hit.reward, 0);
    run.earned += total;
    credit(state, total);
    return { total, hits, chain, color: form.color, effect: chain ? form.effect : undefined };
  }

  function finish(state, run) {
    const bonus = run.kills >= run.region.goal ? run.region.bonus : 0;
    credit(state, bonus);
    run.earned += bonus;
    return bonus;
  }

  return {
    seconds, saveKey, forms, regions, upgrades, recoveryBonus, maxLevel,
    restore, collectPassive, formIndex, power, chainEvery, enhancement, enhance, purchase, begin, strike, finish,
  };
})();

if (typeof module !== 'undefined') module.exports = Forge;
