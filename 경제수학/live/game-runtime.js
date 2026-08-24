(function () {
  const factors = [0.72, 0.84, 0.93, 1, 1.08, 1.18, 1.3];
  const tones = [
    { label: '현장', copy: '초기 신호가 확인됐습니다.' },
    { label: '속보', copy: '시장 반응이 예상보다 빠르게 번지고 있습니다.' },
    { label: '긴급', copy: '충격의 폭이 커져 추가 대응이 필요합니다.' }
  ];

  function hash(text) {
    return Array.from(String(text)).reduce((value, char) => (value * 33 + char.charCodeAt(0)) >>> 0, 5381);
  }

  function seededOrder(items, seedText) {
    let seed = hash(seedText);
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const target = seed % (index + 1);
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function createScenario(game, seedText) {
    const rounds = game.rounds || 8;
    const candidates = [];
    game.events.forEach((event, eventIndex) => {
      for (let tone = 0; tone < 3; tone += 1) {
        const value = hash(`${seedText}-${game.id}-${event.id || eventIndex}-${tone}`);
        const factor = factors[value % factors.length];
        const questions = event.questions || game.questions || [];
        const question = questions.length ? value % questions.length : 0;
        candidates.push(`${eventIndex}|${tone}|${Math.round(factor * 100)}|${question}`);
      }
    });
    const selected = seededOrder(candidates, `${seedText}-${game.id}-scenario`).slice(0, rounds);
    const questionOffset = hash(`${seedText}-${game.id}-questions`);
    return selected.map((code, round) => {
      const [eventIndex, tone, factor] = code.split('|');
      const event = game.events[Number(eventIndex) % game.events.length];
      const questions = event.questions || game.questions || [];
      const question = questions.length ? (questionOffset + round) % questions.length : 0;
      return `${eventIndex}|${tone}|${factor}|${question}`;
    });
  }

  function varyNumber(raw, factor) {
    const normalized = raw.replace('−', '-');
    const value = Number(normalized);
    if (!Number.isFinite(value) || value === 0) return raw;
    const changed = value * factor;
    const rounded = Math.abs(changed) >= 10 ? Math.round(changed) : Math.round(changed * 10) / 10;
    return String(rounded).replace('-', raw.startsWith('−') ? '−' : '-');
  }

  function varyText(text, factor) {
    return String(text || '').replace(/[+−-]?\d+(?:\.\d+)?(?=\s*(?:%p|%|배|점|원))/g, value => varyNumber(value, factor));
  }

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }

  function resolveEvent(game, scenarioCode, round) {
    const [indexText, toneText, factorText, questionText] = String(scenarioCode || `${round % game.events.length}|1|100|0`).split('|');
    const rawEventIndex = Number(indexText);
    const rawToneIndex = Number(toneText);
    const eventIndex = Number.isFinite(rawEventIndex) ? Math.abs(rawEventIndex) % game.events.length : round % game.events.length;
    const toneIndex = Number.isFinite(rawToneIndex) ? Math.abs(rawToneIndex) % tones.length : 1;
    const factor = clamp(Number(factorText) / 100 || 1, 0.65, 1.4);
    const base = game.events[eventIndex];
    const tone = tones[toneIndex];
    const questions = base.questions || game.questions || ['어떤 수치와 관계를 근거로 이 비율을 정했나요?'];
    const rawQuestionIndex = Number(questionText);
    const questionIndex = Number.isFinite(rawQuestionIndex) ? Math.abs(rawQuestionIndex) % questions.length : round % questions.length;
    const question = questions[questionIndex];
    const payoffs = {};
    Object.entries(base.payoffs || {}).forEach(([key, value]) => {
      const jitter = (hash(`${scenarioCode}-${game.id}-${key}`) % 3) - 1;
      payoffs[key] = Math.round(clamp(Number(value) * factor + jitter, -18, 18) * 10) / 10;
    });
    const delta = {};
    Object.entries(base.delta || {}).forEach(([key, value]) => {
      delta[key] = Math.round(Number(value) * factor * 100) / 100;
    });
    return {
      ...base,
      id: `${base.id || eventIndex}-${toneIndex}-${Math.round(factor * 100)}`,
      title: `[${tone.label}] ${varyText(base.title, factor)}`,
      copy: `${varyText(base.copy, factor)} ${tone.copy}`,
      signals: [...(base.signals || []).map(signal => varyText(signal, factor)), `충격 강도 ${Math.round(factor * 100)}`],
      payoffs,
      delta,
      question,
      factor,
      baseIndex: eventIndex,
      scenarioCode
    };
  }

  function equalAllocation(game) {
    const keys = game.strategies.map(strategy => strategy.id);
    const base = Math.floor(100 / keys.length / 5) * 5;
    const allocation = Object.fromEntries(keys.map(key => [key, base]));
    allocation[keys[0]] += 100 - base * keys.length;
    return allocation;
  }

  function allocationTotal(allocation) {
    return Object.values(allocation || {}).reduce((sum, value) => sum + Number(value || 0), 0);
  }

  function weightedScore(event, allocation) {
    const total = allocationTotal(allocation);
    if (total !== 100) return 0;
    const value = Object.entries(allocation).reduce((sum, [key, weight]) => sum + Number(weight) / 100 * Number(event.payoffs[key] || 0), 0);
    return Math.round(value * 10) / 10;
  }

  function dominant(game, allocation) {
    const entry = Object.entries(allocation || {}).sort((a, b) => b[1] - a[1])[0] || [game.strategies[0].id, 0];
    const strategy = game.strategies.find(item => item.id === entry[0]) || game.strategies[0];
    return { id: strategy.id, name: strategy.name, value: Number(entry[1]) || 0 };
  }

  window.JPEconomyGameRuntime = {
    createScenario,
    resolveEvent,
    equalAllocation,
    allocationTotal,
    weightedScore,
    dominant,
    seededOrder
  };
}());
