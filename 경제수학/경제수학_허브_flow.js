(() => {
  const scenarios = [
    {
      label: '상황 1 · 금리',
      title: '기준금리 0.5%p 인상',
      description: '예금 이자는 오르지만 기업과 가계의 이자 부담도 커질 전망입니다.',
      chips: ['예금금리 +0.4%p', '채권가격 하락 압력', '원화가치 상승 가능'],
      question: '안정성과 기회를 함께 보려면 어떤 비중이 좋을까요?',
      returns: [3.2, -1.8, -3.6, 4.5],
      hint: '금리가 오르면 예금 수익은 좋아질 수 있지만 채권 가격과 기업 부담도 함께 살펴야 합니다.'
    },
    {
      label: '상황 2 · 산업',
      title: 'AI 설비투자 확대, 생산성 기대 상승',
      description: '기술 기업의 예상 이익은 커졌지만 시장의 기대가 이미 가격에 반영됐다는 분석도 나옵니다.',
      chips: ['성장률 +1.1%p', '기술주 변동성 확대', '기업투자 증가'],
      question: '성장 가능성과 가격 변동을 어떻게 나눌까요?',
      returns: [1.8, 1.1, 7.4, 2.2],
      hint: '높은 기대수익에는 큰 변동이 따릅니다. 한 자산에 집중했는지도 함께 확인해 보세요.'
    },
    {
      label: '상황 3 · 경기',
      title: '소비 둔화 전망, 경기 하방 위험 확대',
      description: '가계 소비가 줄고 기업의 매출 전망도 낮아지면서 안전자산 선호가 커지고 있습니다.',
      chips: ['소비 -1.3%', '채권 수요 증가', '주가 변동성 확대'],
      question: '손실 위험을 낮추면서 기회를 남길 수 있을까요?',
      returns: [2.1, 4.2, -5.8, 1.3],
      hint: '경기 둔화기에는 방어가 중요하지만, 모든 위험자산을 없애면 회복의 기회도 놓칠 수 있습니다.'
    }
  ];
  const assets = [
    { name: '예금', color: '#12735d' },
    { name: '채권', color: '#3f5c86' },
    { name: '주식', color: '#a94f28' },
    { name: '외화', color: '#7a5a0d' }
  ];
  let scenarioIndex = 0;
  let allocation = [25, 25, 25, 25];

  const list = document.querySelector('#allocationList');
  const result = document.querySelector('#decisionResult');
  if (!list || !result) return;

  const renderAllocation = () => {
    list.innerHTML = assets.map((asset, index) => `
      <div class="allocation-row" style="--asset:${asset.color}">
        <span>${asset.name}</span>
        <button type="button" data-change="-5" data-index="${index}" aria-label="${asset.name} 비중 5% 줄이기">−</button>
        <div class="allocation-track" aria-hidden="true"><i style="--value:${allocation[index]}"></i></div>
        <button type="button" data-change="5" data-index="${index}" aria-label="${asset.name} 비중 5% 늘리기">+</button>
        <b class="allocation-value">${allocation[index]}%</b>
      </div>`).join('');
    document.querySelector('#allocationTotal').textContent = allocation.reduce((sum, value) => sum + value, 0);
  };

  const moveShare = (index, amount) => {
    if (amount > 0) {
      const donor = allocation.reduce((best, value, current) => current !== index && value > allocation[best] ? current : best, index === 0 ? 1 : 0);
      if (allocation[donor] < amount || allocation[index] > 100 - amount) return;
      allocation[index] += amount;
      allocation[donor] -= amount;
    } else {
      if (allocation[index] < Math.abs(amount)) return;
      const receiver = allocation.reduce((best, value, current) => current !== index && value < allocation[best] ? current : best, index === 0 ? 1 : 0);
      allocation[index] += amount;
      allocation[receiver] -= amount;
    }
    result.hidden = true;
    renderAllocation();
  };

  const renderScenario = () => {
    const scenario = scenarios[scenarioIndex];
    document.querySelector('#scenarioLabel').textContent = scenario.label;
    document.querySelector('#scenarioTitle').textContent = scenario.title;
    document.querySelector('#scenarioDescription').textContent = scenario.description;
    document.querySelector('#scenarioQuestion').textContent = scenario.question;
    document.querySelector('#marketChips').innerHTML = scenario.chips.map(chip => `<span>${chip}</span>`).join('');
    result.hidden = true;
  };

  list.addEventListener('click', event => {
    const button = event.target.closest('button[data-change]');
    if (!button) return;
    moveShare(Number(button.dataset.index), Number(button.dataset.change));
  });

  document.querySelector('#nextScenario').addEventListener('click', () => {
    scenarioIndex = (scenarioIndex + 1) % scenarios.length;
    renderScenario();
  });

  document.querySelector('#decisionSubmit').addEventListener('click', () => {
    const scenario = scenarios[scenarioIndex];
    const expected = allocation.reduce((sum, value, index) => sum + value * scenario.returns[index] / 100, 0);
    const concentration = Math.max(...allocation);
    document.querySelector('#expectedReturn').textContent = `${expected >= 0 ? '+' : ''}${expected.toFixed(1)}%`;
    document.querySelector('#resultMessage').textContent = `${scenario.hint}${concentration >= 60 ? ' 한 자산이 60% 이상이므로 집중 위험도 큽니다.' : ' 여러 자산으로 나누어 한 번의 판단이 전체 결과를 결정하지 않게 했습니다.'}`;
    result.hidden = false;
  });

  renderAllocation();
  renderScenario();
})();
