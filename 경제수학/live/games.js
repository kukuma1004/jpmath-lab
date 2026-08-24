(function () {
  const strategies = [
    { id: 'safe', name: '안정 방어형', copy: '예금과 채권을 중심으로 변동을 줄입니다.', allocation: { deposit: 50, bond: 30, stock: 10, fx: 10 } },
    { id: 'balanced', name: '균형 분산형', copy: '네 자산에 위험을 나누어 담습니다.', allocation: { deposit: 30, bond: 25, stock: 30, fx: 15 } },
    { id: 'growth', name: '성장 집중형', copy: '경제성장과 기업 실적에 무게를 둡니다.', allocation: { deposit: 10, bond: 15, stock: 60, fx: 15 } },
    { id: 'currency', name: '환율 방어형', copy: '원화 가치 하락에 대비해 외화 비중을 높입니다.', allocation: { deposit: 20, bond: 15, stock: 15, fx: 50 } }
  ];

  const events = [
    {
      id: 'oil', title: '국제 유가 급등, 수입 물가에 비상',
      copy: '산유국의 감산 발표로 원유 가격이 크게 올랐습니다. 생산비와 생활물가가 함께 오를 가능성이 커졌습니다.',
      signals: ['물가 +2.0%p', '성장률 −0.8%p', '환율 +4.5%'],
      delta: { rate: 0, inflation: 2, growth: -0.8, exchangePct: 4.5, stockBoost: -1.5, bondBoost: 0 },
      explainTitle: '물가 충격은 현금의 실질가치와 기업 이익을 함께 압박합니다.',
      explainCopy: '예금의 명목이자가 그대로여도 물가가 더 빠르게 오르면 실제 구매력은 줄 수 있습니다. 수입 비용 증가는 기업 이익에도 부담이고, 원화 가치가 하락하면 외화의 원화 환산 가치는 오릅니다.',
      formula: '실질수익률 ≈ 명목수익률 − 물가상승률'
    },
    {
      id: 'rate', title: '한국은행, 기준금리 0.5%p 인상',
      copy: '물가를 안정시키기 위해 기준금리가 올랐습니다. 새 예금 금리는 높아지지만 기존 채권과 성장주의 가격에는 부담이 될 수 있습니다.',
      signals: ['금리 +0.5%p', '성장률 −0.5%p', '환율 −1.5%'],
      delta: { rate: 0.5, inflation: -0.2, growth: -0.5, exchangePct: -1.5, stockBoost: -1, bondBoost: 0 },
      explainTitle: '금리 상승은 자산마다 반대 방향의 힘을 줍니다.',
      explainCopy: '새 예금의 이자는 높아지지만, 기존 채권은 상대적으로 매력이 줄어 가격이 하락할 수 있습니다. 기업의 자금 조달 비용도 커져 주식에는 부담이 됩니다.',
      formula: '금리 ↑ → 새 예금 수익 ↑ · 기존 채권 가격 ↓'
    },
    {
      id: 'ai', title: 'AI 산업 투자 확대, 생산성 기대 상승',
      copy: '기업의 설비 투자와 생산성 개선 기대가 커졌습니다. 성장률 전망과 기술 기업의 예상 이익이 함께 올랐습니다.',
      signals: ['성장률 +2.0%p', '주식 추가효과 +3.5%', '물가 +0.3%p'],
      delta: { rate: 0, inflation: 0.3, growth: 2, exchangePct: -0.5, stockBoost: 3.5, bondBoost: -0.5 },
      explainTitle: '성장 기대는 미래 기업 이익의 현재 평가를 높입니다.',
      explainCopy: '생산성과 매출이 늘 것이라는 전망은 주식 수익률에 긍정적입니다. 다만 기대가 실제 이익으로 이어지는지는 이후 지표와 함께 판단해야 합니다.',
      formula: '주식 기대수익 ≈ 성장 효과 − 금리 부담 + 산업 효과'
    },
    {
      id: 'export', title: '수출 호조, 달러 수입이 크게 증가',
      copy: '해외 주문이 늘며 수출 기업의 실적이 개선됐습니다. 달러 수요와 공급의 변화로 환율도 움직였습니다.',
      signals: ['성장률 +1.2%p', '주식 추가효과 +2.0%', '환율 +2.5%'],
      delta: { rate: 0, inflation: 0.2, growth: 1.2, exchangePct: 2.5, stockBoost: 2, bondBoost: 0 },
      explainTitle: '환율 변화는 수출기업과 외화 자산에 서로 다른 경로로 작용합니다.',
      explainCopy: '원·달러 환율이 오르면 같은 달러를 더 많은 원으로 바꿀 수 있어 외화 자산의 원화 가치가 오릅니다. 수출기업 매출에도 유리할 수 있지만 수입 비용은 커집니다.',
      formula: '원화 환산액 = 달러 금액 × 원·달러 환율'
    },
    {
      id: 'cooling', title: '물가 안정, 기준금리 인하 기대 확대',
      copy: '소비자물가 상승률이 낮아지며 시장은 금리 인하 가능성을 예상합니다. 채권과 주식의 평가가 다시 달라지고 있습니다.',
      signals: ['물가 −1.0%p', '금리 −0.5%p', '채권 추가효과 +2.5%'],
      delta: { rate: -0.5, inflation: -1, growth: 0.6, exchangePct: 1, stockBoost: 1.5, bondBoost: 2.5 },
      explainTitle: '금리 하락 기대는 기존 채권의 상대적 가치를 높입니다.',
      explainCopy: '새로 발행되는 채권의 금리가 낮아질 것으로 예상되면 높은 이자를 약속한 기존 채권이 더 매력적으로 보입니다. 물가가 낮아지면 같은 명목수익의 실질가치도 커집니다.',
      formula: '실질가치 효과 = 명목수익 − 물가상승 효과'
    }
  ];

  window.JPEconomyGames = { investmentKing: { id: 'investment-king', rounds: 5, startingMoney: 10000000, strategies, events } };
}());
