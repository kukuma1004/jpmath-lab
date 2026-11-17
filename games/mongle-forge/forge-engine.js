'use strict';

const Forge = (() => {
  const seconds = 25;
  const saveKey = 'jp-math-lab:mongle-forge:v1';
  const intervalMs = 5000;
  const offlineLimit = 8 * 60 * 60 * 1000;
  const maxShards = 1_000_000_000_000;
  const prices = [16, 32, 56, 88, 135, 190, 275, 390, 530, 710, 940, 1230];
  const damage = [1, 2, 3, 4, 5, 7, 9, 11, 14, 18, 23, 30, 38];

  const forms = [
    { level: 0, name: '연습용 나무검', perk: '누른 대상에게 기본 베기', pattern: 'single', color: '#ffe3ad' },
    { level: 2, name: '클로버 잎새검', perk: '잎새 베기 · 옆칸 한 곳을 함께 타격', pattern: 'side', color: '#bcffac' },
    { level: 4, name: '꽃비 초승검', perk: '꽃비 베기 · 같은 줄을 통째로 타격', pattern: 'row', color: '#ffb4d6' },
    { level: 6, name: '서리수정 대검', perk: '서리 파동 · 붙어 있는 상하좌우 타격', pattern: 'near', color: '#a7e7ff' },
    { level: 9, name: '달그림자 월검', perk: '달빛 파동 · 가로와 세로를 통째로 타격', pattern: 'cross', color: '#d2bcff' },
    { level: 12, name: '별꼬리 성검', perk: '별비 베기 · 원정장 전체를 타격', pattern: 'all', color: '#fff2b0' },
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
    const level = integer(stored.level, prices.length);
    const region = integer(stored.region, regions.length - 1);
    const cleared = regions.map((_, i) => Boolean(stored.cleared?.[i]));
    return {
      shards: integer(stored.shards, maxShards),
      level,
      region: regions[region].level <= level ? region : 0,
      cleared,
      polish: integer(stored.polish, upgrades.polish.prices.length),
      echo: level < 2 ? 0 : integer(stored.echo, upgrades.echo.prices.length),
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

  function purchase(state, id, now = Date.now()) {
    const levels = id === 'level' ? prices : upgrades[id]?.prices;
    const cost = levels?.[state[id]];
    if (cost === undefined || state.shards < cost || state.level < (upgrades[id]?.unlock ?? 0)) return false;
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
    const strength = power(state);
    const hits = targets.map((target, order) => {
      const enemy = run.spots[target];
      const points = order === 0 ? strength : Math.max(1, Math.ceil(strength * 0.6));
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
    return { total, hits, chain, color: form.color };
  }

  function finish(state, run) {
    const bonus = run.kills >= run.region.goal ? run.region.bonus : 0;
    credit(state, bonus);
    run.earned += bonus;
    return bonus;
  }

  return {
    seconds, saveKey, prices, forms, regions, upgrades,
    restore, collectPassive, formIndex, power, chainEvery, purchase, begin, strike, finish,
  };
})();

if (typeof module !== 'undefined') module.exports = Forge;
