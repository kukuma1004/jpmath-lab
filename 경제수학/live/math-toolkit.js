(function () {
  const definitions = [
    { id: 'percent', name: '% 변화', short: '증감률', fields: [['before', '이전 값', 100], ['after', '이후 값', 108]], calculate: values => ({ value: values.before ? (values.after - values.before) / values.before * 100 : 0, suffix: '%', formula: '(이후 값 − 이전 값) ÷ 이전 값 × 100' }) },
    { id: 'compound', name: '복리', short: '미래가치', fields: [['principal', '현재 금액(원)', 10000000], ['rate', '연이율(%)', 4.1], ['years', '기간(년)', 3]], calculate: values => ({ value: values.principal * (1 + values.rate / 100) ** values.years, suffix: '원', formula: '현재 금액 × (1 + 이율)ⁿ' }) },
    { id: 'present', name: '현재가치', short: '지금의 가치', fields: [['future', '미래 금액(원)', 12000000], ['rate', '할인율(%)', 4], ['years', '기간(년)', 3]], calculate: values => ({ value: values.future / (1 + values.rate / 100) ** values.years, suffix: '원', formula: '미래 금액 ÷ (1 + 할인율)ⁿ' }) },
    { id: 'exchange', name: '환율', short: '원화 환산', fields: [['dollar', '외화 금액($)', 1000], ['rate', '원·달러 환율', 1320]], calculate: values => ({ value: values.dollar * values.rate, suffix: '원', formula: '외화 금액 × 원·달러 환율' }) },
    { id: 'loan', name: '대출', short: '월 상환액', fields: [['principal', '대출 원금(원)', 300000000], ['rate', '연이율(%)', 3.8], ['years', '상환 기간(년)', 30]], calculate: values => { const months = Math.max(1, values.years * 12); const rate = values.rate / 1200; const payment = rate ? values.principal * rate * (1 + rate) ** months / ((1 + rate) ** months - 1) : values.principal / months; return { value: payment, suffix: '원/월', formula: '원리금균등상환 월 납입액' }; } }
  ];
  const gamePools = {
    'investment-king': ['percent', 'compound', 'exchange', 'present', 'loan'],
    'bank-ceo': ['percent', 'compound', 'present', 'loan', 'exchange'],
    'home-plan': ['percent', 'loan', 'present', 'compound', 'exchange'],
    'currency-war': ['percent', 'exchange', 'compound', 'present', 'loan'],
    'inflation-survival': ['percent', 'compound', 'present', 'exchange', 'loan'],
    'startup-ceo': ['percent', 'present', 'compound', 'loan', 'exchange'],
    'fund-manager': ['percent', 'compound', 'exchange', 'present', 'loan'],
    'policy-lab': ['percent', 'present', 'loan', 'compound', 'exchange']
  };

  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
  function format(value, suffix) {
    if (!Number.isFinite(value)) return '값을 확인하세요';
    if (suffix.includes('원')) return `${Math.round(value).toLocaleString('ko-KR')}${suffix}`;
    return `${Math.round(value * 100) / 100}${suffix}`;
  }
  function inferTool(event) {
    const text = `${event && event.title || ''} ${event && event.formula || ''} ${event && event.explain || ''}`;
    if (/대출|상환|원리금/.test(text)) return 'loan';
    if (/환율|외화|달러|원화수익/.test(text)) return 'exchange';
    if (/현재가치|할인/.test(text)) return 'present';
    if (/복리|미래가치|원리합계|연금/.test(text)) return 'compound';
    return 'percent';
  }
  function unlockedTools(game, round, recommended) {
    const pool = gamePools[game.id] || definitions.map(item => item.id);
    const count = Math.min(5, 1 + Math.floor((Number(round) + 1) / 2));
    const unlocked = new Set(pool.slice(0, count));
    unlocked.add('percent');
    unlocked.add(recommended);
    if (round >= 7) definitions.forEach(item => unlocked.add(item.id));
    return unlocked;
  }
  function unlockRound(game, id) {
    const pool = gamePools[game.id] || definitions.map(item => item.id);
    const index = Math.max(0, pool.indexOf(id));
    return Math.min(8, Math.max(1, index * 2));
  }

  function mount(host, options) {
    if (!host) return { getUsedTools: () => [] };
    const game = options.game;
    const round = Number(options.round) || 0;
    const event = options.event || {};
    const recommended = inferTool(event);
    const unlocked = unlockedTools(game, round, recommended);
    const used = new Set(options.initialUsed || []);
    let active = unlocked.has(recommended) ? recommended : 'percent';

    function render() {
      host.innerHTML = `<section class="math-toolkit" aria-label="경제수학 도구함">
        <header><div><span>수학 도구함 · ROUND ${round + 1}</span><h3>계산 문제를 풀지 말고, 필요할 때 수학을 꺼내 쓰세요.</h3></div><p>이번 상황 추천 <b>${escapeHtml((definitions.find(item => item.id === recommended) || definitions[0]).name)}</b></p></header>
        <div class="toolkit-tabs" role="tablist">${definitions.map(tool => {
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
      panel.innerHTML = `<div class="toolkit-fields">${tool.fields.map(([key, name, value]) => `<label><span>${name}</span><input type="number" inputmode="decimal" data-tool-input="${key}" value="${value}"></label>`).join('')}</div><button type="button" data-tool-calculate>${tool.name} 분석하기</button><output data-tool-result><span>${tool.formula || '수치를 입력하고 분석해 보세요.'}</span><strong>수치를 입력하고 분석해 보세요.</strong></output>`;
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
  window.JPEconomyMathToolkit = { mount, label, inferTool, calculate };
}());
