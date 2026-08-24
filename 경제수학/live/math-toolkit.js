(function () {
  const definitions = [
    { id: 'percent', name: '% 변화', short: '증감률', fields: [['before', '이전 값', 100], ['after', '이후 값', 108]], calculate: values => ({ value: values.before ? (values.after - values.before) / values.before * 100 : 0, suffix: '%', formula: '(이후 값 − 이전 값) ÷ 이전 값 × 100' }) },
    { id: 'compound', name: '복리', short: '미래가치', fields: [['principal', '현재 금액(원)', 10000000], ['rate', '연이율(%)', 4.1], ['years', '기간(년)', 3]], calculate: values => ({ value: values.principal * (1 + values.rate / 100) ** values.years, suffix: '원', formula: '현재 금액 × (1 + 이율)ⁿ' }) },
    { id: 'present', name: '현재가치', short: '지금의 가치', fields: [['future', '미래 금액(원)', 12000000], ['rate', '할인율(%)', 4], ['years', '기간(년)', 3]], calculate: values => ({ value: values.future / (1 + values.rate / 100) ** values.years, suffix: '원', formula: '미래 금액 ÷ (1 + 할인율)ⁿ' }) },
    { id: 'exchange', name: '환율', short: '원화 환산', fields: [['dollar', '외화 금액($)', 1000], ['rate', '원·달러 환율', 1320]], calculate: values => ({ value: values.dollar * values.rate, suffix: '원', formula: '외화 금액 × 원·달러 환율' }) },
    { id: 'loan', name: '대출', short: '월 상환액', fields: [['principal', '대출 원금(원)', 300000000], ['rate', '연이율(%)', 3.8], ['years', '상환 기간(년)', 30]], calculate: values => { const months = Math.max(1, values.years * 12); const rate = values.rate / 1200; const payment = rate ? values.principal * rate * (1 + rate) ** months / ((1 + rate) ** months - 1) : values.principal / months; return { value: payment, suffix: '원/월', formula: '원리금균등상환 월 납입액' }; } },
    { id: 'real', name: '실질가치', short: '물가 반영', fields: [['nominal', '명목 변화율(%)', 6], ['inflation', '물가상승률(%)', 3]], calculate: values => ({ value: ((1 + values.nominal / 100) / (1 + values.inflation / 100) - 1) * 100, suffix: '%', formula: '(1 + 명목 변화율) ÷ (1 + 물가상승률) − 1' }) },
    { id: 'breakEven', name: '손익분기', short: '필요 판매량', fields: [['fixed', '고정비(원)', 5000000], ['price', '판매가격(원)', 50000], ['variable', '단위변동비(원)', 30000]], calculate: values => ({ value: values.price > values.variable ? values.fixed / (values.price - values.variable) : NaN, suffix: '개', formula: '고정비 ÷ (판매가격 − 단위변동비)' }) },
    { id: 'weighted', name: '가중평균', short: '비중별 결과', fields: [['weightA', 'A 비중(%)', 60], ['returnA', 'A 변화율(%)', 8], ['returnB', 'B 변화율(%)', 2]], calculate: values => ({ value: values.weightA / 100 * values.returnA + (1 - values.weightA / 100) * values.returnB, suffix: '%', formula: 'A 비중 × A 변화율 + B 비중 × B 변화율' }) }
  ];

  const profiles = {
    'investment-king': {
      brief: '수익률만 보지 말고 물가·복리·환율을 함께 계산해 자산 배분을 설계합니다.',
      pool: ['percent', 'real', 'compound', 'exchange', 'weighted'],
      presets: { percent: { before: 100, after: 108 }, real: { nominal: 7, inflation: 3.2 }, compound: { principal: 10000000, rate: 4.2, years: 3 }, exchange: { dollar: 2000, rate: 1320 }, weighted: { weightA: 55, returnA: 8, returnB: 3 } }
    },
    'bank-ceo': {
      brief: '예금금리·대출금리·상환액을 비교해 수익성과 건전성의 균형을 찾습니다.',
      pool: ['percent', 'compound', 'loan', 'present', 'weighted'],
      presets: { percent: { before: 2.4, after: 3.2 }, compound: { principal: 30000000, rate: 3.6, years: 3 }, loan: { principal: 100000000, rate: 4.5, years: 10 }, present: { future: 120000000, rate: 4.2, years: 5 }, weighted: { weightA: 70, returnA: 5.5, returnB: -2 } }
    },
    'home-plan': {
      brief: '집값보다 자기자본·월 상환액·미래 돈의 현재가치를 함께 비교합니다.',
      pool: ['percent', 'loan', 'present', 'compound', 'real'],
      presets: { percent: { before: 500000000, after: 540000000 }, loan: { principal: 350000000, rate: 4.1, years: 30 }, present: { future: 600000000, rate: 3.5, years: 10 }, compound: { principal: 80000000, rate: 3.8, years: 5 }, real: { nominal: 5, inflation: 3 } }
    },
    'currency-war': {
      brief: '환율 변화율과 원화 환산액을 직접 비교해 수출·수입·헤지 비율을 정합니다.',
      pool: ['exchange', 'percent', 'weighted', 'real', 'present'],
      presets: { exchange: { dollar: 10000, rate: 1340 }, percent: { before: 1280, after: 1370 }, weighted: { weightA: 65, returnA: 7, returnB: -4 }, real: { nominal: 7, inflation: 2.8 }, present: { future: 15000000, rate: 4, years: 2 } }
    },
    'inflation-survival': {
      brief: '명목 금액이 아니라 실제 구매력과 개인의 지출 비중을 기준으로 판단합니다.',
      pool: ['real', 'percent', 'weighted', 'compound', 'present'],
      presets: { real: { nominal: 5, inflation: 7 }, percent: { before: 100, after: 107 }, weighted: { weightA: 45, returnA: 12, returnB: 3 }, compound: { principal: 30000000, rate: 4.5, years: 5 }, present: { future: 40000000, rate: 6, years: 5 } }
    },
    'startup-ceo': {
      brief: '가격·변동비·고정비를 넣어 손익분기점과 현금 생존 가능성을 확인합니다.',
      pool: ['breakEven', 'percent', 'present', 'loan', 'compound'],
      presets: { breakEven: { fixed: 12000000, price: 65000, variable: 35000 }, percent: { before: 35000, after: 42000 }, present: { future: 100000000, rate: 8, years: 3 }, loan: { principal: 50000000, rate: 6, years: 5 }, compound: { principal: 30000000, rate: 12, years: 3 } }
    },
    'fund-manager': {
      brief: '자산별 수익률을 비중대로 합치고 물가와 환율까지 반영해 성과를 비교합니다.',
      pool: ['weighted', 'percent', 'real', 'exchange', 'compound'],
      presets: { weighted: { weightA: 60, returnA: 12, returnB: -3 }, percent: { before: 100, after: 112 }, real: { nominal: 8, inflation: 3 }, exchange: { dollar: 5000, rate: 1360 }, compound: { principal: 50000000, rate: 6.5, years: 5 } }
    },
    'policy-lab': {
      brief: '성장·물가·고용 지표를 비중 있게 결합해 정책의 편익과 부담을 함께 봅니다.',
      pool: ['weighted', 'percent', 'real', 'present', 'loan'],
      presets: { weighted: { weightA: 55, returnA: 4.2, returnB: -2.5 }, percent: { before: 100, after: 106 }, real: { nominal: 5, inflation: 4 }, present: { future: 10000000000, rate: 3.5, years: 5 }, loan: { principal: 5000000000, rate: 3.2, years: 10 } }
    }
  };

  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
  function roundValue(value, digits = 1) { const scale = 10 ** digits; return Math.round(Number(value) * scale) / scale; }
  function format(value, suffix) {
    if (!Number.isFinite(value)) return '값을 확인하세요';
    if (suffix.includes('원') || suffix === '개') return `${Math.round(value).toLocaleString('ko-KR')}${suffix}`;
    return `${roundValue(value, 2)}${suffix}`;
  }
  function profileFor(game) {
    return profiles[game && game.id] || { brief: '상황에 맞는 수학 도구를 골라 의사결정을 점검합니다.', pool: definitions.map(item => item.id), presets: {} };
  }
  function inferTool(event) {
    const text = `${event && event.title || ''} ${event && event.formula || ''} ${event && event.explain || ''}`;
    if (/손익분기|고정비|변동비|생존기간/.test(text)) return 'breakEven';
    if (/포트폴리오|가중|지출비중|Σ|분산 효과/.test(text)) return 'weighted';
    if (/실질|물가|구매력/.test(text)) return 'real';
    if (/대출|상환|원리금|부채상환/.test(text)) return 'loan';
    if (/환율|외화|달러|원화수익/.test(text)) return 'exchange';
    if (/현재가치|할인|기업가치/.test(text)) return 'present';
    if (/복리|미래가치|원리합계|연금/.test(text)) return 'compound';
    return 'percent';
  }
  function recommendedFor(game, event) {
    const profile = profileFor(game);
    const inferred = inferTool(event);
    if (profile.pool.includes(inferred)) return inferred;
    const text = `${event && event.title || ''} ${event && event.formula || ''}`;
    if (game.id === 'bank-ceo' && /금리|이자/.test(text)) return 'compound';
    if (game.id === 'policy-lab' && /성장|고용|만족|균형/.test(text)) return 'weighted';
    return profile.pool[0];
  }
  function unlockedTools(game, round, recommended) {
    const pool = profileFor(game).pool;
    const count = Math.min(pool.length, 1 + Math.floor((Number(round) + 1) / 2));
    const unlocked = new Set(pool.slice(0, count));
    unlocked.add(recommended);
    if (round >= 7) pool.forEach(id => unlocked.add(id));
    return unlocked;
  }
  function unlockRound(game, id) {
    const pool = profileFor(game).pool;
    const index = Math.max(0, pool.indexOf(id));
    return Math.min(8, Math.max(1, index * 2));
  }
  function presetFor(game, event, round, tool) {
    const factor = Math.min(1.4, Math.max(.65, Number(event && event.factor) || 1));
    const defaults = Object.fromEntries(tool.fields.map(([key, , value]) => [key, value]));
    const values = { ...defaults, ...(profileFor(game).presets[tool.id] || {}) };
    const rateKeys = ['rate', 'nominal', 'inflation', 'returnA', 'returnB'];
    const has = key => Object.prototype.hasOwnProperty.call(values, key);
    rateKeys.forEach(key => { if (has(key)) values[key] = roundValue(values[key] * factor, 1); });
    if (has('after') && has('before')) {
      const baseChange = values.before ? (values.after - values.before) / values.before : 0;
      values.after = roundValue(values.before * (1 + baseChange * factor), Math.abs(values.before) < 100 ? 2 : 0);
    }
    if (has('rate') && tool.id === 'exchange') values.rate = Math.round(values.rate * (1 + (factor - 1) * .35));
    if (has('years')) values.years = Math.max(1, Math.round(values.years + Number(round || 0) / 4));
    return values;
  }

  function mount(host, options) {
    if (!host) return { getUsedTools: () => [] };
    const game = options.game;
    const round = Number(options.round) || 0;
    const event = options.event || {};
    const profile = profileFor(game);
    const recommended = recommendedFor(game, event);
    const unlocked = unlockedTools(game, round, recommended);
    const used = new Set(options.initialUsed || []);
    let active = unlocked.has(recommended) ? recommended : profile.pool[0];

    function render() {
      host.innerHTML = `<section class="math-toolkit" aria-label="${escapeHtml(game.title)} 수학 도구함">
        <header><div><span>${escapeHtml(game.title)} 수학 도구함 · ROUND ${round + 1}</span><h3>${escapeHtml(profile.brief)}</h3></div><p>이번 상황 추천 <b>${escapeHtml(label(recommended))}</b></p></header>
        <div class="toolkit-tabs" role="tablist">${profile.pool.map(id => definitions.find(tool => tool.id === id)).map(tool => {
          const locked = !unlocked.has(tool.id);
          return `<button type="button" role="tab" data-tool-tab="${tool.id}" class="${active === tool.id ? 'active' : ''} ${used.has(tool.id) ? 'used' : ''}" ${locked ? 'disabled' : ''}><span>${tool.name}</span><small>${locked ? `R${unlockRound(game, tool.id)} 해제` : tool.short}</small></button>`;
        }).join('')}</div>
        <div class="toolkit-panel" data-tool-panel></div>
        <footer><span>사용한 도구</span><div data-tool-used>${used.size ? Array.from(used).map(id => `<b>${label(id)}</b>`).join('') : '<small>아직 없음 · 도구 사용은 선택입니다.</small>'}</div></footer>
      </section>`;
      host.querySelectorAll('[data-tool-tab]').forEach(button => button.addEventListener('click', () => { active = button.dataset.toolTab; render(); }));
      renderPanel();
    }

    function renderPanel() {
      const panel = host.querySelector('[data-tool-panel]');
      const tool = definitions.find(item => item.id === active) || definitions[0];
      const presets = presetFor(game, event, round, tool);
      panel.innerHTML = `<div class="toolkit-fields">${tool.fields.map(([key, name]) => `<label><span>${name}</span><input type="number" inputmode="decimal" data-tool-input="${key}" value="${presets[key]}"></label>`).join('')}</div><button type="button" data-tool-calculate>${tool.name} 분석하기</button><output data-tool-result><span>${tool.calculate(presets).formula}</span><strong>뉴스 수치를 바꿔 직접 비교해 보세요.</strong></output>`;
      panel.querySelector('[data-tool-calculate]').addEventListener('click', () => {
        const values = Object.fromEntries(Array.from(panel.querySelectorAll('[data-tool-input]')).map(input => [input.dataset.toolInput, Number(input.value)]));
        const result = tool.calculate(values);
        used.add(tool.id);
        panel.querySelector('[data-tool-result]').innerHTML = `<span>${escapeHtml(result.formula)}</span><strong>${format(result.value, result.suffix)}</strong>`;
        const usedBox = host.querySelector('[data-tool-used]');
        usedBox.innerHTML = Array.from(used).map(id => `<b>${label(id)}</b>`).join('');
        host.querySelector(`[data-tool-tab="${tool.id}"]`).classList.add('used');
        if (options.onUse) options.onUse(tool.id, Array.from(used));
      });
    }
    render();
    return { getUsedTools: () => Array.from(used) };
  }

  function label(id) { return (definitions.find(item => item.id === id) || { name: id }).name; }
  function calculate(id, values) {
    const tool = definitions.find(item => item.id === id);
    if (!tool) throw new Error(`unknown-tool:${id}`);
    return tool.calculate(values);
  }
  window.JPEconomyMathToolkit = { mount, label, inferTool, calculate, profileFor, presetFor, recommendedFor };
}());
