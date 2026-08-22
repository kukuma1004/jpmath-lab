const won = value => `${Math.round(value).toLocaleString('ko-KR')}원`;

const tabs = document.querySelectorAll('[data-game]');
const panels = document.querySelectorAll('[data-panel]');
tabs.forEach(tab => tab.addEventListener('click', () => {
  const selected = tab.dataset.game;
  tabs.forEach(button => {
    const on = button === tab;
    button.classList.toggle('active', on);
    button.setAttribute('aria-selected', String(on));
  });
  panels.forEach(panel => {
    const on = panel.dataset.panel === selected;
    panel.classList.toggle('active', on);
    panel.hidden = !on;
  });
}));

const terms = [
  {name:'영리기업', group:'조직', plain:'물건이나 서비스를 팔아 이익을 내고, 그 이익을 소유자나 주주에게 나눌 수 있는 기업입니다.', example:'동네 카페가 비용을 빼고 남긴 이익을 사장이나 투자자에게 배분할 수 있어요.'},
  {name:'비영리조직', group:'조직', plain:'사회적 목적을 위해 운영되며, 남은 돈을 소유자에게 나누지 않고 목적 사업에 다시 사용하는 조직입니다.', example:'돈을 벌면 안 된다는 뜻이 아니에요. 유료 공연이나 판매로 수입과 잉여가 생길 수 있지만 다시 목적에 써요.'},
  {name:'매출', group:'기업', plain:'상품이나 서비스를 팔아서 들어온 돈의 전체 금액입니다. 아직 비용을 빼지 않은 숫자입니다.', example:'빵 40개를 4,000원에 팔면 매출은 160,000원이에요.'},
  {name:'비용', group:'기업', plain:'생산하고 판매하고 운영하기 위해 쓴 돈입니다.', example:'재료비, 임차료, 직원 급여, 전기료가 모두 비용에 들어가요.'},
  {name:'이익과 잉여', group:'기업', plain:'수입에서 비용을 빼고 남은 돈입니다. 영리기업에서는 보통 이익, 비영리조직에서는 잉여라는 표현을 자주 씁니다.', example:'같은 계산 결과라도 누구에게 배분할 수 있는지가 중요한 차이예요.'},
  {name:'수요', group:'시장', plain:'어떤 가격에서 소비자가 사고 싶고 실제로 살 수 있는 수량입니다.', example:'가격이 너무 오르면 사고 싶은 사람이 줄어 수요량도 줄 수 있어요.'},
  {name:'공급', group:'시장', plain:'어떤 가격에서 생산자가 팔고 싶고 실제로 팔 수 있는 수량입니다.', example:'가격이 생산비보다 충분히 높으면 더 많이 만들어 팔려는 경우가 많아요.'},
  {name:'균형가격', group:'시장', plain:'사려는 양과 팔려는 양이 같아지는 가격입니다.', example:'품절도 재고도 생기지 않는 시장의 만남 지점이라고 생각하면 쉬워요.'},
  {name:'효용', group:'선택', plain:'상품이나 서비스를 소비하면서 얻는 만족이나 유용함을 수학적으로 나타낸 개념입니다.', example:'같은 5,000원을 써도 사람마다 얻는 만족은 다를 수 있어요.'},
  {name:'경제지표', group:'수와 경제', plain:'경제의 상태나 변화를 한눈에 살피기 위해 계산한 숫자입니다.', example:'물가지수, 경제성장률, 실업률 같은 숫자가 있어요.'},
  {name:'퍼센트포인트', group:'수와 경제', plain:'두 퍼센트 값의 단순한 차이를 나타내는 단위입니다.', example:'금리가 4%에서 6%가 되면 2%포인트 상승, 처음보다 50% 상승입니다.'},
  {name:'현재가치', group:'금융', plain:'미래에 받을 돈을 오늘의 가치로 바꾸어 생각한 금액입니다.', example:'1년 뒤 105만 원과 지금 100만 원이 이자율 5%에서 같은 가치인지 비교할 때 써요.'},
  {name:'행렬', group:'행렬', plain:'여러 숫자를 행과 열에 맞추어 직사각형으로 정리한 것입니다.', example:'행을 지점, 열을 상품으로 두면 여러 지점의 판매량을 한꺼번에 계산하기 편해져요.'},
  {name:'한계', group:'미분', plain:'무언가를 한 단위 더 늘렸을 때 결과가 얼마나 변하는지를 보는 관점입니다.', example:'빵을 한 개 더 만들 때 추가되는 비용이 한계비용이에요.'},
  {name:'탄력성', group:'미분', plain:'가격이나 소득이 1% 변할 때 수요량 같은 결과가 몇 % 변하는지를 나타냅니다.', example:'가격을 조금 올렸는데 수요가 크게 줄면 가격에 민감하고 탄력적이라고 해요.'}
];

const dialog = document.querySelector('#glossaryDialog');
const termList = document.querySelector('[data-term-list]');
const termSearch = document.querySelector('[data-term-search]');

function renderTerms(query = '') {
  const keyword = query.trim().toLowerCase();
  const filtered = terms.filter(term => `${term.name} ${term.group} ${term.plain} ${term.example}`.toLowerCase().includes(keyword));
  termList.innerHTML = filtered.length ? filtered.map(term => `
    <details class="term-item" data-term-name="${term.name}">
      <summary><span>${term.name}</span><small>${term.group}</small></summary>
      <div class="term-copy"><p>${term.plain}</p><small><b>생활 예시</b> · ${term.example}</small></div>
    </details>`).join('') : '<p class="term-empty">해당하는 용어가 없어요. 다른 낱말로 찾아보세요.</p>';
}

function openGlossary(focusTerm = '') {
  renderTerms(focusTerm);
  termSearch.value = focusTerm;
  dialog.showModal();
  if (focusTerm) {
    const match = [...termList.querySelectorAll('.term-item')].find(item => item.dataset.termName.includes(focusTerm));
    if (match) match.open = true;
  }
  setTimeout(() => termSearch.focus(), 40);
}

renderTerms();
document.querySelectorAll('[data-open-glossary]').forEach(button => button.addEventListener('click', () => openGlossary()));
document.querySelectorAll('[data-term]').forEach(button => button.addEventListener('click', () => openGlossary(button.dataset.term)));
document.querySelector('[data-close-glossary]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
termSearch.addEventListener('input', event => renderTerms(event.target.value));

const events = [
  {title:'학교 축제 주간', copy:'평소보다 손님이 많아 예상 수요가 12개 늘어납니다.', demand:12, variable:0, fixed:0, weather:'🎉'},
  {title:'밀가루 가격 상승', copy:'재료 가격이 올라 한 개를 만들 때 드는 비용이 300원 늘어납니다.', demand:0, variable:300, fixed:0, weather:'📈'},
  {title:'장대비가 내린 주', copy:'외출하는 사람이 줄어 예상 수요가 10개 감소합니다.', demand:-10, variable:0, fixed:0, weather:'🌧️'},
  {title:'지역 상생 지원금', copy:'지역 기여 활동을 조건으로 고정비 15,000원을 지원받습니다.', demand:4, variable:0, fixed:-15000, weather:'🤝'},
  {title:'SNS 입소문', copy:'학생의 후기 영상이 퍼져 예상 수요가 15개 늘어납니다.', demand:15, variable:0, fixed:5000, weather:'📱'},
  {title:'전기요금 인상', copy:'오븐 운영비가 늘어 이번 주 고정비가 12,000원 증가합니다.', demand:0, variable:0, fixed:12000, weather:'⚡'},
  {title:'경쟁 가게 할인', copy:'근처 가게의 할인 행사로 예상 수요가 8개 줄어듭니다.', demand:-8, variable:0, fixed:0, weather:'🏷️'},
  {title:'지역 축제 마지막 주', copy:'주말 방문객이 늘지만 재료 배송비도 150원 오릅니다.', demand:10, variable:150, fixed:0, weather:'🎪'}
];

const simStrategies = {
  quality:{label:'품질 강화',demand:5,variable:250,fixed:0,trust:3},
  promotion:{label:'홍보 집중',demand:10,variable:0,fixed:15000,trust:1},
  community:{label:'지역 나눔',demand:4,variable:0,fixed:8000,trust:6}
};
let eventOrder=events.map((_,index)=>index).sort(()=>Math.random()-.5);
const sim = {week:0, org:'profit', strategy:'quality', trust:50, score:0, history:[]};
const priceRange = document.querySelector('#priceRange');
const quantityRange = document.querySelector('#quantityRange');
const runWeekButton = document.querySelector('[data-run-week]');

function simulationNumbers() {
  const event = events[eventOrder[Math.min(sim.week,eventOrder.length-1)]];
  const strategy = simStrategies[sim.strategy];
  const price = Number(priceRange.value);
  const quantity = Number(quantityRange.value);
  const demand = Math.max(8, Math.round(105 - price / 100 + event.demand + strategy.demand));
  const sold = Math.min(demand, quantity);
  const revenue = sold * price;
  const variableCost = 1300 + event.variable + strategy.variable;
  const fixedCost = Math.max(20000, 45000 + event.fixed + strategy.fixed);
  const cost = fixedCost + variableCost * quantity;
  const profit = revenue - cost;
  return {price, quantity, demand, sold, revenue, cost, profit, strategy, unsold:Math.max(0, quantity - sold), missed:Math.max(0, demand - sold)};
}

function updateSimulation() {
  const data = simulationNumbers();
  const event = events[eventOrder[Math.min(sim.week,eventOrder.length-1)]];
  document.querySelector('[data-price-output]').textContent = won(data.price);
  document.querySelector('[data-quantity-output]').textContent = `${data.quantity}개`;
  document.querySelector('[data-demand]').textContent = `${data.demand}개`;
  document.querySelector('[data-sold]').textContent = `${data.sold}개`;
  document.querySelector('[data-revenue]').textContent = won(data.revenue);
  document.querySelector('[data-cost]').textContent = won(data.cost);
  document.querySelector('[data-trust]').textContent = `${sim.trust}점 (+${data.strategy.trust})`;
  document.querySelector('[data-profit-label]').textContent = sim.org === 'profit' ? '이익' : '잉여';
  const profitNode = document.querySelector('[data-profit]');
  profitNode.textContent = `${data.profit >= 0 ? '+' : '−'}${won(Math.abs(data.profit))}`;
  profitNode.classList.toggle('negative', data.profit < 0);
  document.querySelector('[data-event-title]').textContent = event.title;
  document.querySelector('[data-event-copy]').textContent = event.copy;
  document.querySelector('[data-score-label]').textContent = sim.org === 'profit' ? '누적 기업가치' : '누적 사회가치';
  document.querySelector('[data-score]').textContent = `${Math.round(sim.score).toLocaleString('ko-KR')}점`;
  document.querySelector('[data-week]').textContent = Math.min(sim.week + 1, 8);
  runWeekButton.textContent = sim.week < 8 ? `이 결정으로 ${sim.week + 1}주 운영하기` : '8주 운영 완료';
  document.querySelector('[data-scene-weather]').textContent = event.weather;
  const coach = document.querySelector('[data-coach] p');
  if (data.profit < 0) coach.textContent = '판매로 들어오는 돈보다 비용이 큽니다. 가격·생산량·수요 중 무엇이 원인인지 살펴보세요.';
  else if (data.unsold > 0) coach.textContent = `${data.unsold}개가 남을 예상입니다. 수요보다 많이 생산하면 비용은 들지만 매출은 늘지 않아요.`;
  else if (data.missed >= 8) coach.textContent = `완판이지만 ${data.missed}개의 수요를 놓칠 수 있어요. 생산량을 조금 늘릴 여지가 있습니다.`;
  else coach.textContent = '예상 수요와 생산량이 가깝습니다. 가격과 생산량의 균형이 안정적이에요.';
}

priceRange.addEventListener('input', updateSimulation);
quantityRange.addEventListener('input', updateSimulation);
document.querySelectorAll('[data-org]').forEach(button => button.addEventListener('click', () => {
  if (sim.week > 0) return;
  sim.org = button.dataset.org;
  document.querySelectorAll('[data-org]').forEach(item => item.classList.toggle('selected', item === button));
  updateSimulation();
}));
document.querySelectorAll('[data-sim-strategy]').forEach(button => button.addEventListener('click', () => {
  if (sim.running) return;
  sim.strategy = button.dataset.simStrategy;
  document.querySelectorAll('[data-sim-strategy]').forEach(item => item.classList.toggle('selected', item === button));
  updateSimulation();
}));

runWeekButton.addEventListener('click', () => {
  if (sim.week >= 8 || sim.running) return;
  sim.running = true;
  const data = simulationNumbers();
  const valueGain = sim.org === 'profit'
    ? data.profit / 1000 - data.unsold * 1.2 + data.strategy.trust * .8
    : data.sold * 2 + Math.max(0, data.profit) / 1800 - Math.max(0, -data.profit) / 1000 + data.strategy.trust * 2;
  const scene=document.querySelector('[data-operation-scene]');
  scene.classList.remove('running');void scene.offsetWidth;scene.classList.add('running');
  document.querySelector('[data-scene-title]').textContent=`${sim.week+1}주 운영 중 · 빵을 굽고 손님을 맞는 중`;
  document.querySelector('[data-scene-subtitle]').textContent=`예상 ${data.demand}명 · 생산 ${data.quantity}개`;
  runWeekButton.disabled=true;priceRange.disabled=true;quantityRange.disabled=true;document.querySelectorAll('[data-sim-strategy]').forEach(button=>button.disabled=true);runWeekButton.textContent='가게 운영 중…';
  setTimeout(()=>{
    sim.score += valueGain;
    const trustChange=data.strategy.trust-(data.missed>=10?2:0)-(data.unsold>=15?1:0);
    sim.trust=Math.max(0,Math.min(100,sim.trust+trustChange));
    sim.history.push({...data, valueGain, trustChange});
    const report = document.querySelector('[data-week-report]');
    report.hidden = false;
    report.innerHTML = `<b>${sim.week + 1}주 보고 · ${data.strategy.label} · ${data.sold}개 판매</b><p>${sim.org === 'profit' ? `이익 ${won(data.profit)}, 재고 ${data.unsold}개, 신뢰 ${trustChange>=0?'+':''}${trustChange}점을 기업가치에 반영했습니다.` : `빵 ${data.sold}개로 지역에 기여했고, 잉여 ${won(data.profit)}은 목적 사업에 다시 사용합니다. 신뢰는 ${trustChange>=0?'+':''}${trustChange}점입니다.`}</p>`;
    document.querySelector('[data-scene-title]').textContent=`${sim.week+1}주 영업 종료 · ${data.sold}개 판매`;
    document.querySelector('[data-scene-subtitle]').textContent=data.unsold?`재고 ${data.unsold}개가 남았습니다.`:`준비한 상품을 모두 판매했습니다.`;
    sim.week += 1;sim.running=false;
    document.querySelectorAll('[data-org]').forEach(button => button.disabled = true);
    priceRange.disabled=false;quantityRange.disabled=false;document.querySelectorAll('[data-sim-strategy]').forEach(button=>button.disabled=false);
    if (sim.week >= 8) {
      runWeekButton.disabled = true;
      document.querySelectorAll('[data-sim-strategy]').forEach(button=>button.disabled=true);
      const profile=sim.trust>=75&&sim.score>=500?'지속가능 경영자':sim.score>=500?'수익 집중 경영자':sim.trust>=75?'지역 신뢰 경영자':'도전 중인 경영자';
      report.innerHTML = `<b>8주 운영 완료 · ${profile}</b><p>최종 ${sim.org === 'profit' ? '기업가치' : '사회가치'} ${Math.round(sim.score)}점 · 신뢰 ${sim.trust}점입니다. 이익과 재고뿐 아니라 선택한 전략의 비용과 신뢰 효과도 비교해 보세요.</p>`;
    } else runWeekButton.disabled=false;
    updateSimulation();
  },2850);
});

document.querySelector('[data-reset-sim]').addEventListener('click', () => {
  sim.week = 0; sim.org = 'profit'; sim.strategy='quality'; sim.trust=50; sim.score = 0; sim.history = []; sim.running=false;eventOrder=events.map((_,index)=>index).sort(()=>Math.random()-.5);
  priceRange.value = 4500; quantityRange.value = 50;
  document.querySelectorAll('[data-org]').forEach(button => {button.disabled = false; button.classList.toggle('selected', button.dataset.org === 'profit');});
  document.querySelectorAll('[data-sim-strategy]').forEach(button => {button.disabled=false;button.classList.toggle('selected',button.dataset.simStrategy==='quality')});
  runWeekButton.disabled = false;
  priceRange.disabled=false;quantityRange.disabled=false;
  document.querySelector('[data-week-report]').hidden = true;
  const scene=document.querySelector('[data-operation-scene]');scene.classList.remove('running');document.querySelector('[data-scene-title]').textContent='가게 문을 열 준비 중';document.querySelector('[data-scene-subtitle]').textContent='결정을 마치면 손님과 빵이 움직입니다.';
  updateSimulation();
});

const cases = [
  {source:'교내 경제신문', title:'금리가 4%에서 6%로 올랐다', claim:'“금리가 2% 상승했습니다.”', clue:'퍼센트 값끼리의 차이와 처음 값에 대한 변화율은 서로 다른 숫자입니다.', question:'이 문장을 가장 정확하게 고치면?', answers:['금리가 2%포인트, 처음보다 50% 상승했다.','금리가 2%포인트, 처음보다 2% 상승했다.','금리가 처음보다 150% 상승했다.'], correct:0, explain:'6%−4%=2%포인트이고, 처음 4%에 비해 2%포인트가 늘었으므로 변화율은 2÷4=50%입니다.'},
  {source:'해외 체험학습 견적서', title:'100달러를 환전하려고 한다', claim:'“환율이 1달러당 1,300원에서 1,400원이 되면 1만 원이 더 필요하다.”', clue:'필요한 원화 = 달러 금액 × 1달러당 원화 환율', question:'견적서의 계산은 맞을까?', answers:['맞다. 100×(1,400−1,300)=10,000원이다.','아니다. 100원이 더 필요하다.','아니다. 환율이 오르면 필요한 원화는 줄어든다.'], correct:0, explain:'같은 100달러를 사려면 환율 차이 100원에 100달러를 곱한 10,000원이 더 필요합니다.'},
  {source:'동아리 설립 회의록', title:'비영리조직의 바자회', claim:'“비영리조직은 돈을 벌면 안 되므로 물건을 팔 수 없다.”', clue:'수입이나 잉여가 생기는 것과 그 돈을 소유자에게 나누는 것은 다른 문제입니다.', question:'가장 정확한 판단은?', answers:['맞다. 비영리는 모든 판매가 금지된다.','틀리다. 판매와 잉여는 가능하지만 목적 사업에 다시 사용해야 한다.','틀리다. 비영리도 잉여를 회원에게 똑같이 나눌 수 있다.'], correct:1, explain:'비영리조직도 목적을 위해 유료 서비스나 판매 활동을 할 수 있습니다. 핵심은 잉여를 소유자에게 분배하지 않는다는 점입니다.'},
  {source:'카페 영수증', title:'공급가액 8,000원인 음료', claim:'“부가가치세 10%는 80원이므로 총액은 8,080원이다.”', clue:'10%는 0.1입니다. 8,000에 0.1을 곱해 보세요.', question:'올바른 세액과 총액은?', answers:['세액 80원, 총액 8,080원','세액 800원, 총액 8,800원','세액 8,000원, 총액 16,000원'], correct:1, explain:'8,000×0.1=800원이므로 총액은 8,000+800=8,800원입니다.'},
  {source:'은행 적금 안내문', title:'100만 원을 연 5% 복리로 2년', claim:'“2년 뒤 금액은 정확히 110만 원입니다.”', clue:'복리는 첫해 이자에도 둘째 해 이자가 붙습니다.', question:'2년 뒤 금액은?', answers:['1,100,000원','1,102,500원','1,150,000원'], correct:1, explain:'1,000,000×1.05²=1,102,500원입니다. 단리와 달리 첫해 이자에도 이자가 붙습니다.'},
  {source:'시장 조사 보고서', title:'가격이 10% 올랐더니 판매량이 20% 감소', claim:'“가격탄력성의 절댓값은 0.5입니다.”', clue:'수요량 변화율을 가격 변화율로 나눕니다.', question:'가격탄력성의 절댓값은?', answers:['0.5','2','10'], correct:1, explain:'|−20%÷10%|=2이므로 가격 변화에 수요가 비교적 민감한 탄력적 상태입니다.'},
  {source:'두 지점 매출표', title:'학교점과 공원점의 판매량', claim:'“행렬에서 행은 상품, 열은 지점을 뜻한다.”', clue:'이번 표는 행을 지점, 열을 상품으로 정했습니다.', question:'2행 1열은 무엇을 뜻할까?', answers:['학교점의 두 번째 상품','공원점의 첫 번째 상품','첫 번째 상품의 가격'], correct:1, explain:'행은 지점, 열은 상품이므로 2행 1열은 공원점의 첫 번째 상품 판매량입니다.'},
  {source:'공장 생산회의', title:'한계이익이 음수가 된 생산구간', claim:'“한 개 더 만들수록 총이익이 계속 커진다.”', clue:'한계이익은 생산량을 한 단위 늘릴 때 총이익의 변화입니다.', question:'한계이익이 음수라면?', answers:['생산량을 늘리면 총이익이 감소한다.','총이익은 반드시 0이다.','생산량과 총이익은 관계없다.'], correct:0, explain:'한계이익이 음수인 구간에서는 한 단위 더 생산할 때 총이익이 줄어듭니다.'}
];

let caseIndex = 0;
let caseScore = 0;
let caseStreak = 0;
let bestCaseStreak = 0;
let caseOffset = Math.floor(Math.random()*cases.length);
function renderCase() {
  const item = cases[(caseIndex+caseOffset)%cases.length];
  const caseLayout=document.querySelector('.case-layout');caseLayout.classList.remove('case-changing');void caseLayout.offsetWidth;caseLayout.classList.add('case-changing');
  document.querySelector('[data-case-number]').textContent = String(caseIndex + 1).padStart(2, '0');
  document.querySelector('[data-case-source]').textContent = item.source;
  document.querySelector('[data-case-title]').textContent = item.title;
  document.querySelector('[data-case-claim]').textContent = item.claim;
  document.querySelector('[data-case-clue]').textContent = item.clue;
  document.querySelector('[data-case-question]').textContent = item.question;
  const answers = document.querySelector('[data-case-answers]');
  answers.innerHTML = item.answers.map((answer, index) => `<button class="answer-option" type="button" data-answer="${index}">${String.fromCharCode(65 + index)}. ${answer}</button>`).join('');
  const feedback = document.querySelector('[data-case-feedback]');
  feedback.hidden = true; feedback.className = 'case-feedback';
  document.querySelector('[data-next-case]').hidden = true;
  answers.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => answerCase(Number(button.dataset.answer))));
}

function answerCase(choice) {
  const item = cases[(caseIndex+caseOffset)%cases.length];
  const correct = choice === item.correct;
  if (correct) {caseScore += 1;caseStreak += 1;bestCaseStreak=Math.max(bestCaseStreak,caseStreak)} else caseStreak=0;
  document.querySelector('[data-case-score]').textContent = caseScore;
  const rank=caseScore>=7?'수석 분석관':caseScore>=5?'경제 기자':caseScore>=3?'자료 조사관':'신입 탐정';
  document.querySelector('[data-case-rank]').textContent=`${rank} · 연속 ${caseStreak}`;
  document.querySelectorAll('[data-answer]').forEach((button, index) => {
    button.disabled = true;
    button.classList.toggle('correct', index === item.correct);
    button.classList.toggle('wrong', index === choice && !correct);
  });
  const feedback = document.querySelector('[data-case-feedback]');
  feedback.hidden = false;
  feedback.classList.toggle('wrong', !correct);
  feedback.innerHTML = `<b>${correct ? '사건 해결!' : '단서를 한 번 더 연결해 봅시다.'}</b><p>${item.explain}</p>${caseIndex===cases.length-1?`<p><strong>최종 역할: ${rank}</strong> · 최고 연속 해결 ${bestCaseStreak}건</p>`:''}`;
  const next = document.querySelector('[data-next-case]');
  next.hidden = false;
  next.textContent = caseIndex === cases.length - 1 ? '다른 순서로 다시 수사하기' : '다음 사건 열기';
}

document.querySelector('[data-next-case]').addEventListener('click', () => {
  if (caseIndex === cases.length - 1) {caseIndex = 0; caseScore = 0;caseStreak=0;bestCaseStreak=0;caseOffset=(caseOffset+3)%cases.length; document.querySelector('[data-case-score]').textContent = 0;document.querySelector('[data-case-rank]').textContent='신입 탐정 · 연속 0';}
  else caseIndex += 1;
  renderCase();
});

const matrixInputs = [...document.querySelectorAll('[data-matrix-input]')];
const deliveryPlans={
  standard:{label:'일반 배송',cost:12000,demand:0,waste:.0},
  fast:{label:'신선 배송',cost:26000,demand:2,waste:.0},
  shared:{label:'공동 배송',cost:8000,demand:0,waste:.2}
};
let deliveryPlan='standard';
const matrixMissions = [
  {name:'등굣길 기본 시장',demand:[32,24,20,36],price:[3500,5500],cost:[1400,2100],waste:1000,fixed:15000,target:238000,condition:'기본 수요에서 폐기와 운송비를 줄이세요.'},
  {name:'운동회 음료 특수',demand:[28,40,18,45],price:[3600,5200],cost:[1450,2200],waste:1100,fixed:18000,target:300000,condition:'운동회로 음료 수요가 크게 늘었습니다.'},
  {name:'비 오는 공원',demand:[35,20,12,18],price:[3800,5700],cost:[1550,2300],waste:1400,fixed:16000,target:190000,condition:'공원점 수요가 줄고 폐기비용이 올랐습니다.'},
  {name:'지역축제 주말',demand:[38,34,32,46],price:[4000,6000],cost:[1650,2450],waste:900,fixed:26000,target:415000,condition:'두 지점 모두 붐비지만 고정비도 높습니다.'},
  {name:'친환경 포장 도전',demand:[30,30,28,38],price:[4200,6200],cost:[1900,2750],waste:1800,fixed:22000,target:330000,condition:'단위비용과 폐기비가 높은 마지막 미션입니다.'}
];
let matrixMissionIndex=0;
let matrixMissionOrder=matrixMissions.map((_,index)=>index).sort(()=>Math.random()-.5);
function loadMatrixMission(){
  const mission=matrixMissions[matrixMissionOrder[matrixMissionIndex]];
  document.querySelector('[data-matrix-mission]').textContent=matrixMissionIndex+1;
  document.querySelector('[data-matrix-condition]').textContent=`${mission.name} · ${mission.condition}`;
  document.querySelector('[data-price-one]').textContent=won(mission.price[0]);document.querySelector('[data-price-two]').textContent=won(mission.price[1]);document.querySelector('[data-price-matrix]').innerHTML=`${mission.price[0].toLocaleString('ko-KR')}<br>${mission.price[1].toLocaleString('ko-KR')}`;
  document.querySelector('[data-demand-row-one]').textContent=`수요 ${mission.demand[0]} · ${mission.demand[1]}`;document.querySelector('[data-demand-row-two]').textContent=`수요 ${mission.demand[2]} · ${mission.demand[3]}`;document.querySelector('[data-school-demand]').textContent=`수요 ${mission.demand[0]} · ${mission.demand[1]}`;document.querySelector('[data-park-demand]').textContent=`수요 ${mission.demand[2]} · ${mission.demand[3]}`;
  document.querySelector('[data-flow-message]').textContent=`${mission.name} · 목표 ${won(mission.target)}`;
  const suggestions=mission.demand.map(v=>Math.max(0,v-2));matrixInputs.forEach((input,index)=>input.value=suggestions[index]);
  const next=document.querySelector('[data-next-matrix]');next.disabled=true;next.textContent=matrixMissionIndex===matrixMissions.length-1?'다섯 미션 다시 하기':'다음 시장 미션 →';
}
function calculateMatrix(unlock=true) {
  const mission=matrixMissions[matrixMissionOrder[matrixMissionIndex]],delivery=deliveryPlans[deliveryPlan],demandCaps=mission.demand.map(value=>value+delivery.demand),prices=[mission.price[0],mission.price[1],mission.price[0],mission.price[1]],unitCosts=[mission.cost[0],mission.cost[1],mission.cost[0],mission.cost[1]];
  const quantities = matrixInputs.map(input => Math.max(0, Math.min(50, Number(input.value) || 0)));
  matrixInputs.forEach((input, index) => input.value = quantities[index]);
  const sold = quantities.map((quantity, index) => Math.min(quantity, demandCaps[index]));
  const wasteCount = quantities.reduce((sum, quantity, index) => sum + Math.max(0, quantity - demandCaps[index]), 0);
  const branchRevenue = [sold[0] * prices[0] + sold[1] * prices[1], sold[2] * prices[2] + sold[3] * prices[3]];
  const revenue = branchRevenue[0] + branchRevenue[1];
  const productionCost = quantities.reduce((sum, quantity, index) => sum + quantity * unitCosts[index], 0);
  const wasteCost = Math.round(wasteCount * mission.waste * (1-delivery.waste));
  const profit = revenue - productionCost - mission.fixed - wasteCost-delivery.cost;
  document.querySelector('[data-q-matrix]').innerHTML = `${quantities[0]}　${quantities[1]}<br>${quantities[2]}　${quantities[3]}`;
  document.querySelector('[data-r-matrix]').innerHTML = `${branchRevenue[0].toLocaleString('ko-KR')}<br>${branchRevenue[1].toLocaleString('ko-KR')}`;
  document.querySelector('[data-matrix-revenue]').textContent = won(revenue);
  document.querySelector('[data-matrix-waste]').textContent = won(wasteCost);
  document.querySelector('[data-matrix-delivery]').textContent = won(delivery.cost);
  document.querySelector('[data-matrix-profit]').textContent = won(profit);
  const feedback = document.querySelector('[data-matrix-feedback]');
  const success = profit >= mission.target;
  feedback.classList.toggle('bad', !success);
  feedback.innerHTML = success
    ? `<b>${matrixMissionIndex+1}번 미션 달성 · ${delivery.label}</b><p>${wasteCount ? `폐기 ${wasteCount}개와 운송비를 포함하고도` : '폐기 없이 운송비까지 빼고'} 목표 순수익을 넘겼습니다.</p>`
    : `<b>목표까지 ${won(mission.target - profit)}</b><p>${wasteCount ? `수요를 넘긴 ${wasteCount}개와 ${delivery.label} 비용이 함께 듭니다.` : `수량 행렬뿐 아니라 ${delivery.label}의 비용·수요 효과도 비교해 보세요.`}</p>`;
  if(unlock){const scene=document.querySelector('[data-branch-scene]');scene.classList.remove('dispatching');void scene.offsetWidth;scene.classList.add('dispatching');document.querySelector('[data-flow-message]').textContent=`학교점 ${won(branchRevenue[0])} · 공원점 ${won(branchRevenue[1])}`;document.querySelector('[data-next-matrix]').disabled=false;}
}

document.querySelector('[data-calc-matrix]').addEventListener('click',()=>calculateMatrix(true));
matrixInputs.forEach(input => input.addEventListener('change',()=>calculateMatrix(true)));
document.querySelectorAll('[data-delivery]').forEach(button=>button.addEventListener('click',()=>{deliveryPlan=button.dataset.delivery;document.querySelectorAll('[data-delivery]').forEach(item=>item.classList.toggle('selected',item===button));calculateMatrix(true)}));
document.querySelector('[data-next-matrix]').addEventListener('click',()=>{if(matrixMissionIndex===matrixMissions.length-1){matrixMissionIndex=0;matrixMissionOrder=matrixMissions.map((_,index)=>index).sort(()=>Math.random()-.5)}else matrixMissionIndex+=1;loadMatrixMission();calculateMatrix(false)});

// 04 · 가계 자산 보드게임
const assetEvents = [
  {title:'첫 급여를 받았습니다', copy:'생활비를 제외한 돈 중 얼마를 미래로 보낼지 정하세요.', shock:0},
  {title:'비상금 통장을 만듭니다', copy:'안전한 비상금을 마련하면 갑작스러운 지출에 대비할 수 있습니다.', shock:50000},
  {title:'주거 보증금이 필요합니다', copy:'예상하지 못한 주거비 20만 원이 자산에서 빠집니다.', shock:-200000},
  {title:'성과 보너스를 받았습니다', copy:'보너스 15만 원이 자산에 더해집니다.', shock:150000},
  {title:'가족 구성원이 늘었습니다', copy:'생활비 변화로 이번 구간에 12만 원이 추가로 필요합니다.', shock:-120000},
  {title:'교육 지원금을 받았습니다', copy:'목표를 꾸준히 지킨 덕분에 10만 원의 지원금을 받았습니다.', shock:100000},
  {title:'갑작스러운 병원비', copy:'의료비 10만 원을 지출하며 위험 관리의 필요성을 배웁니다.', shock:-100000},
  {title:'미래 준비 마지막 구간', copy:'마지막 저축을 결정하고 원금과 복리 효과를 비교하세요.', shock:0}
];
const assetPlans={
  safe:{label:'안정형',rate:-2,loss:.5,gain:.8},
  balanced:{label:'균형형',rate:0,loss:1,gain:1},
  growth:{label:'성장형',rate:2,loss:1.4,gain:1.1}
};
const assetState = {round:0,total:0,principal:0,interest:0,history:[],plan:'balanced'};
const assetSave = document.querySelector('[data-asset-save]');
const assetRate = document.querySelector('[data-asset-rate]');
const assetRun = document.querySelector('[data-run-assets]');
function updateAssetBoard(){
  const event=assetEvents[Math.min(assetState.round,7)];
  document.querySelector('[data-asset-round]').textContent=Math.min(assetState.round+1,8);
  document.querySelector('[data-asset-event]').textContent=event.title;
  document.querySelector('[data-asset-copy]').textContent=event.copy;
  document.querySelector('[data-asset-save-output]').textContent=won(Number(assetSave.value));
  document.querySelector('[data-asset-rate-output]').textContent=`${assetRate.value}%`;
  document.querySelector('[data-asset-total]').textContent=won(assetState.total);
  document.querySelector('[data-asset-principal]').textContent=won(assetState.principal);
  document.querySelector('[data-asset-interest]').textContent=won(assetState.interest);
  [...document.querySelectorAll('[data-life-board] span')].forEach((node,index)=>{node.classList.toggle('done',index<assetState.round);node.classList.toggle('active',index===assetState.round&&assetState.round<8)});
  const max=Math.max(1,...assetState.history);document.querySelector('[data-asset-history]').innerHTML=assetState.history.map(value=>`<i style="--h:${Math.max(8,value/max*100)}%" title="${won(value)}"></i>`).join('');
  const world=document.querySelector('.asset-world');world.style.setProperty('--pawn-x',`${4+Math.min(assetState.round,8)*11.5}%`);const growth=Math.min(100,18+assetState.total/40000);document.querySelectorAll('[data-wealth-city] i').forEach((tower,index)=>tower.style.setProperty('--h',`${Math.min(100,growth*(.45+index*.16))}%`));
}
assetSave.addEventListener('input',updateAssetBoard);assetRate.addEventListener('input',updateAssetBoard);
document.querySelectorAll('[data-asset-plan]').forEach(button=>button.addEventListener('click',()=>{if(assetState.moving)return;assetState.plan=button.dataset.assetPlan;document.querySelectorAll('[data-asset-plan]').forEach(item=>item.classList.toggle('selected',item===button));updateAssetBoard()}));
assetRun.addEventListener('click',()=>{
  if(assetState.round>=8||assetState.moving)return;
  assetState.moving=true;assetRun.disabled=true;assetSave.disabled=true;assetRate.disabled=true;document.querySelectorAll('[data-asset-plan]').forEach(button=>button.disabled=true);assetRun.textContent='주사위가 움직이는 중…';const world=document.querySelector('.asset-world');world.classList.remove('moving');void world.offsetWidth;world.classList.add('moving');
  const save=Number(assetSave.value),plan=assetPlans[assetState.plan],rate=Math.max(0,Number(assetRate.value)+plan.rate)/100,event=assetEvents[assetState.round],shock=Math.round(event.shock*(event.shock<0?plan.loss:plan.gain));
  const before=assetState.total;
  setTimeout(()=>{
    assetState.total=Math.max(0,Math.round(assetState.total*Math.pow(1+rate,3)+save+shock));assetState.principal+=save;const growth=Math.max(0,Math.round(before*Math.pow(1+rate,3)-before));assetState.interest+=growth;assetState.round+=1;assetState.history.push(assetState.total);assetState.moving=false;
    const feedback=document.querySelector('[data-asset-feedback]');feedback.innerHTML=`<b>${assetState.round}번째 칸 · ${plan.label} · 자산 ${won(assetState.total)}</b><p>적용 수익률 ${(rate*100).toFixed(1)}%, 복리 증가 ${won(growth)}, 사건 효과 ${shock>=0?'+':''}${won(shock)}가 반영됐습니다.</p>`;
    assetSave.disabled=false;assetRate.disabled=false;document.querySelectorAll('[data-asset-plan]').forEach(button=>button.disabled=false);if(assetState.round>=8){assetRun.disabled=true;document.querySelectorAll('[data-asset-plan]').forEach(button=>button.disabled=true);assetRun.textContent='8칸 보드게임 완료';feedback.classList.add('success');const profile=assetState.interest>assetState.principal*.3?'성장 설계형':assetState.total>=assetState.principal*.9?'균형 축적형':'안전망 보완형';feedback.innerHTML=`<b>${profile} · 최종 자산 ${won(assetState.total)}</b><p>원금 ${won(assetState.principal)}, 복리 증가 ${won(assetState.interest)}, 사건 효과의 합성 결과를 비교하고 위험을 키웠을 때 손실 충격도 함께 커졌다는 점을 확인하세요.</p>`}else{assetRun.disabled=false;assetRun.textContent='주사위를 굴리고 다음 칸으로'}updateAssetBoard();
  },1300);
});
document.querySelector('[data-reset-assets]').addEventListener('click',()=>{assetState.round=0;assetState.total=0;assetState.principal=0;assetState.interest=0;assetState.history=[];assetState.plan='balanced';assetState.moving=false;assetSave.value=300000;assetRate.value=5;assetSave.disabled=false;assetRate.disabled=false;document.querySelectorAll('[data-asset-plan]').forEach(button=>{button.disabled=false;button.classList.toggle('selected',button.dataset.assetPlan==='balanced')});assetRun.disabled=false;assetRun.textContent='주사위를 굴리고 다음 칸으로';const f=document.querySelector('[data-asset-feedback]');f.classList.remove('success');f.innerHTML='<b>첫 결정을 기다립니다.</b><p>현재 소비와 미래 준비 사이의 균형을 생각해 보세요.</p>';updateAssetBoard()});

// 05 · 시장 균형 스토리 RPG
const storyScenes=[
  {speaker:'빵집 앞 주민',line:'“가격이 너무 낮아 아침마다 빵이 금방 동나요!”',d:80,s:50,choices:[['가격을 조금 올린다',-10,10,'가격 상승은 수요량을 줄이고 공급량을 늘려 차이를 좁혔습니다.'],['소비 쿠폰을 나눠준다',10,0,'수요가 더 늘어 품절이 심해졌습니다.'],['상인 영업시간을 줄인다',0,-10,'공급이 줄어 초과수요가 커졌습니다.']]},
  {speaker:'채소가게 상인',line:'“비가 그치자 채소가 너무 많이 들어와 재고가 쌓였어요.”',d:45,s:70,choices:[['가격을 조금 내린다',10,-8,'가격 하락은 수요량을 늘리고 공급량을 줄여 재고를 완화했습니다.'],['가격을 더 올린다',-8,7,'사려는 양은 줄고 팔려는 양은 늘어 재고가 커졌습니다.'],['생산 보조금을 준다',0,10,'공급이 더 늘어 초과공급이 커졌습니다.']]},
  {speaker:'마을 축제 준비위원',line:'“축제 날 간식 수요가 갑자기 늘어날 것 같아요.”',d:75,s:60,choices:[['임시 판매대를 허용한다',0,14,'공급이 수요 증가에 맞춰 늘어 균형에 가까워졌습니다.'],['구매 쿠폰만 더 지급한다',12,0,'수요가 더 늘어 품절 가능성이 커졌습니다.'],['판매대를 줄인다',0,-10,'공급이 줄어 시장 차이가 커졌습니다.']]},
  {speaker:'청년 주거 상담사',line:'“작은 원룸을 찾는 사람은 많은데 빈집이 거의 없어요.”',d:88,s:55,choices:[['빈 건물의 주거 전환을 지원한다',0,25,'주택 공급이 늘어 초과수요가 크게 줄었습니다.'],['전입 지원금만 늘린다',15,0,'수요만 더 늘어 집을 구하기 어려워졌습니다.'],['신규 주택 허가를 줄인다',0,-12,'공급이 감소해 부족 현상이 심해졌습니다.']]},
  {speaker:'저녁 시장 택시기사',line:'“운행 차량은 많은데 오늘은 손님이 너무 적어요.”',d:40,s:68,choices:[['심야 할인 요금을 적용한다',14,-8,'수요는 늘고 공급은 조금 줄어 균형에 가까워졌습니다.'],['요금을 크게 올린다',-12,8,'수요가 줄고 공급은 늘어 초과공급이 커졌습니다.'],['차량을 더 투입한다',0,15,'공급 과잉이 더 심해졌습니다.']]},
  {speaker:'보건소 담당자',line:'“미세먼지 경보로 마스크를 찾는 주민이 갑자기 많아졌어요.”',d:95,s:62,choices:[['추가 물량의 빠른 배송을 지원한다',0,28,'공급이 늘어 갑작스러운 수요 증가에 대응했습니다.'],['구매 장려 쿠폰을 준다',12,0,'이미 높은 수요가 더 커졌습니다.'],['배송 차량을 줄인다',0,-10,'공급이 줄어 품절이 심해졌습니다.']]},
  {speaker:'전력 관리소 직원',line:'“폭염 때문에 전기 사용량이 공급 능력을 넘어설 것 같아요.”',d:92,s:72,choices:[['피크 시간 절약 보상을 제공한다',-12,4,'수요를 낮추고 예비 공급을 더해 차이를 줄였습니다.'],['전기 사용 쿠폰을 지급한다',14,0,'수요가 더 늘어 공급 부족이 커졌습니다.'],['발전 정비를 동시에 진행한다',0,-15,'공급 능력이 줄어 상황이 나빠졌습니다.']]},
  {speaker:'공예시장 협동조합',line:'“지역 기념품을 많이 만들었는데 창고에 재고가 쌓였어요.”',d:48,s:78,choices:[['축제 체험권과 묶어 할인한다',18,-10,'수요가 늘고 생산을 조절해 재고가 줄었습니다.'],['판매가격을 올린다',-10,6,'수요가 줄고 공급 유인이 늘어 재고가 커졌습니다.'],['생산 장려금을 더 준다',0,15,'공급량이 더 늘어 초과공급이 심해졌습니다.']]}
];
const storyState={round:0,score:0};
let storyOrder=storyScenes.map((_,index)=>index).sort(()=>Math.random()-.5);
function marketDescription(d,s){const gap=d-s;if(Math.abs(gap)<=3)return['거의 균형','수요량과 공급량이 거의 같습니다.'];return gap>0?[`${gap}개의 초과수요`,'사려는 양이 팔려는 양보다 많아 품절이 생깁니다.']:[`${Math.abs(gap)}개의 초과공급`,'팔려는 양이 사려는 양보다 많아 재고가 쌓입니다.']}
function renderStory(){
  const scene=storyScenes[storyOrder[Math.min(storyState.round,7)]],stage=document.querySelector('[data-village-stage]'),storyPanel=document.querySelector('.story-scene');stage.classList.remove('transitioning');storyPanel.classList.remove('changing');void stage.offsetWidth;stage.classList.add('transitioning');storyPanel.classList.add('changing');setTimeout(()=>{stage.classList.remove('transitioning');storyPanel.classList.remove('changing')},1050);
  document.querySelector('[data-story-round]').textContent=Math.min(storyState.round+1,8);document.querySelector('[data-story-score]').textContent=storyState.score;document.querySelector('[data-story-speaker]').textContent=scene.speaker;document.querySelector('[data-story-line]').textContent=scene.line;document.querySelector('[data-story-demand]').textContent=scene.d;document.querySelector('[data-story-supply]').textContent=scene.s;document.querySelector('[data-story-gap]').textContent=Math.abs(scene.d-scene.s);document.querySelector('[data-story-map-progress]').style.setProperty('--map',`${storyState.round/7*100}%`);document.querySelector('[data-story-hero]').style.left=`${8+storyState.round*10.5}%`;
  const desc=marketDescription(scene.d,scene.s);document.querySelector('[data-story-status]').textContent=desc[0];document.querySelector('[data-story-explain]').textContent=desc[1];
  document.querySelector('[data-story-choices]').innerHTML=scene.choices.map((choice,index)=>`<button type="button" data-story-choice="${index}">${choice[0]}</button>`).join('');
  document.querySelectorAll('[data-story-choice]').forEach(button=>button.addEventListener('click',()=>chooseStory(Number(button.dataset.storyChoice))));
}
function chooseStory(index){
  const scene=storyScenes[storyOrder[storyState.round]],choice=scene.choices[index],d=scene.d+choice[1],s=scene.s+choice[2],gap=Math.abs(d-s);storyState.score+=Math.max(0,30-gap);document.querySelector('[data-story-score]').textContent=storyState.score;
  document.querySelector('[data-story-demand]').textContent=d;document.querySelector('[data-story-supply]').textContent=s;document.querySelector('[data-story-gap]').textContent=gap;const desc=marketDescription(d,s);document.querySelector('[data-story-status]').textContent=desc[0];document.querySelector('[data-story-explain]').textContent=desc[1];document.querySelectorAll('[data-story-choice]').forEach(b=>b.disabled=true);
  const feedback=document.querySelector('[data-story-feedback]');feedback.innerHTML=`<b>${choice[0]} · 시장 차이 ${gap}</b><p>${choice[3]}</p>`;
  setTimeout(()=>{storyState.round+=1;if(storyState.round<8){renderStory()}else{document.querySelector('[data-story-map-progress]').style.setProperty('--map','100%');feedback.classList.add('success');const rank=storyState.score>=210?'균형 설계자':storyState.score>=150?'시장 조정관':'시장 관찰자';feedback.innerHTML=`<b>${rank} · 균형 점수 ${storyState.score}점</b><p>같은 사건도 선택에 따라 수요·공급의 차이가 다르게 남습니다. 다시 시작하면 장소 순서도 바뀝니다.</p>`;document.querySelector('[data-story-choices]').innerHTML='<p class="story-end">시장 균형 마을의 여덟 장소를 모두 살펴봤습니다.</p>'}},1150);
}
document.querySelector('[data-reset-story]').addEventListener('click',()=>{storyState.round=0;storyState.score=0;storyOrder=storyScenes.map((_,index)=>index).sort(()=>Math.random()-.5);document.querySelector('[data-story-score]').textContent=0;const f=document.querySelector('[data-story-feedback]');f.classList.remove('success');f.innerHTML='<b>새로운 순서로 이야기를 시작합니다.</b><p>주민과 상인 중 어느 쪽의 양이 부족한지 먼저 판단하세요.</p>';renderStory()});

// 06 · 한계의 정원 최적화 퍼즐
const gardenMissions=[
  {name:'맑은 날 기본 정원',aName:'A 밭 · 토마토',bName:'B 밭 · 허브',a:[13,11,9,7,5,3,2,1,1,0],b:[12,11,10,9,8,7,5,3,2,1],start:[8,2],target:92},
  {name:'가뭄 뒤 회복 정원',aName:'A 밭 · 파프리카',bName:'B 밭 · 상추',a:[16,13,10,7,4,2,1,0,0,0],b:[10,10,9,8,7,6,5,4,3,2],start:[7,3],target:91},
  {name:'온실 수확 정원',aName:'A 밭 · 딸기',bName:'B 밭 · 바질',a:[11,10,9,8,7,6,5,4,3,2],b:[15,12,9,6,4,3,2,1,0,0],start:[2,8],target:89}
];
let gardenOrder=gardenMissions.map((_,index)=>index).sort(()=>Math.random()-.5);
const firstGarden=gardenMissions[gardenOrder[0]];
const garden={mission:0,a:firstGarden.start[0],b:firstGarden.start[1]};
const sumFirst=(arr,count)=>arr.slice(0,count).reduce((a,b)=>a+b,0);
function updateGarden(){
  const mission=gardenMissions[gardenOrder[garden.mission]],marginalA=mission.a,marginalB=mission.b;
  const ya=sumFirst(marginalA,garden.a),yb=sumFirst(marginalB,garden.b),total=ya+yb;
  document.querySelector('[data-garden-mission]').textContent=garden.mission+1;document.querySelector('[data-garden-target]').textContent=`${mission.target} 이상`;document.querySelector('[data-garden-a-name]').textContent=mission.aName;document.querySelector('[data-garden-b-name]').textContent=mission.bName;
  document.querySelector('[data-water-a-count]').textContent=garden.a;document.querySelector('[data-water-b-count]').textContent=garden.b;document.querySelector('[data-water-total]').textContent=garden.a+garden.b;document.querySelector('[data-garden-a-yield]').textContent=ya;document.querySelector('[data-garden-b-yield]').textContent=yb;document.querySelector('[data-garden-total]').textContent=total;
  document.querySelector('[data-garden-a-dots]').innerHTML=marginalA.slice(0,garden.a).map(v=>`<i style="--h:${v*6}px" title="한계수확 ${v}"></i>`).join('');document.querySelector('[data-garden-b-dots]').innerHTML=marginalB.slice(0,garden.b).map(v=>`<i style="--h:${v*6}px" title="한계수확 ${v}"></i>`).join('');
  const nextA=marginalA[garden.a]??0,nextB=marginalB[garden.b]??0;document.querySelector('[data-next-marginal]').textContent=`A ${nextA} · B ${nextB}`;
  const success=total>=mission.target,feedback=document.querySelector('[data-garden-feedback]'),next=document.querySelector('[data-next-garden]');feedback.classList.toggle('success',success);feedback.classList.toggle('bad',total<mission.target-10);feedback.innerHTML=success?`<b>${mission.name} 목표 달성! 총수확 ${total}</b><p>다음 한 통의 한계수확이 더 큰 밭으로 물을 옮긴 판단이 효과적이었습니다.</p>`:`<b>${mission.name} · 현재 총수확 ${total}</b><p>목표 ${mission.target}까지 ${mission.target-total} 남았습니다. 두 밭의 마지막 한 통과 다음 한 통 효과를 비교하세요.</p>`;next.disabled=!success;next.textContent=garden.mission===gardenMissions.length-1?'세 미션을 새 순서로 다시 하기':'다음 정원 미션 →';
  document.querySelectorAll('.garden-plot').forEach(plot=>{plot.classList.remove('growing');void plot.offsetWidth;plot.classList.add('growing')});
}
document.querySelectorAll('[data-water-a]').forEach(b=>b.addEventListener('click',()=>{const delta=Number(b.dataset.waterA);if(delta>0&&garden.b>0){garden.a++;garden.b--}if(delta<0&&garden.a>0){garden.a--;garden.b++}updateGarden()}));
document.querySelectorAll('[data-water-b]').forEach(b=>b.addEventListener('click',()=>{const delta=Number(b.dataset.waterB);if(delta>0&&garden.a>0){garden.b++;garden.a--}if(delta<0&&garden.b>0){garden.b--;garden.a++}updateGarden()}));
function resetGardenMission(){const mission=gardenMissions[gardenOrder[garden.mission]];garden.a=mission.start[0];garden.b=mission.start[1];updateGarden()}
document.querySelector('[data-reset-garden]').addEventListener('click',resetGardenMission);
document.querySelector('[data-next-garden]').addEventListener('click',()=>{if(garden.mission===gardenMissions.length-1){gardenOrder=gardenMissions.map((_,index)=>index).sort(()=>Math.random()-.5);garden.mission=0}else garden.mission+=1;resetGardenMission()});

updateSimulation();
renderCase();
loadMatrixMission();
calculateMatrix(false);
updateAssetBoard();
renderStory();
updateGarden();
