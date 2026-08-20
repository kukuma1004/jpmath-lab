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
  {title:'학교 축제 주간', copy:'평소보다 손님이 많아 예상 수요가 12개 늘어납니다.', demand:12, variable:0, fixed:0},
  {title:'밀가루 가격 상승', copy:'재료 가격이 올라 한 개를 만들 때 드는 비용이 300원 늘어납니다.', demand:0, variable:300, fixed:0},
  {title:'장대비가 내린 주', copy:'외출하는 사람이 줄어 예상 수요가 10개 감소합니다.', demand:-10, variable:0, fixed:0},
  {title:'지역 상생 지원금', copy:'지역 기여 활동을 조건으로 고정비 15,000원을 지원받습니다.', demand:4, variable:0, fixed:-15000}
];

const sim = {week:0, org:'profit', score:0, history:[]};
const priceRange = document.querySelector('#priceRange');
const quantityRange = document.querySelector('#quantityRange');
const runWeekButton = document.querySelector('[data-run-week]');

function simulationNumbers() {
  const event = events[sim.week] || events[events.length - 1];
  const price = Number(priceRange.value);
  const quantity = Number(quantityRange.value);
  const demand = Math.max(8, Math.round(105 - price / 100 + event.demand));
  const sold = Math.min(demand, quantity);
  const revenue = sold * price;
  const variableCost = 1300 + event.variable;
  const fixedCost = Math.max(20000, 45000 + event.fixed);
  const cost = fixedCost + variableCost * quantity;
  const profit = revenue - cost;
  return {price, quantity, demand, sold, revenue, cost, profit, unsold:Math.max(0, quantity - sold), missed:Math.max(0, demand - sold)};
}

function updateSimulation() {
  const data = simulationNumbers();
  const event = events[sim.week] || events[events.length - 1];
  document.querySelector('[data-price-output]').textContent = won(data.price);
  document.querySelector('[data-quantity-output]').textContent = `${data.quantity}개`;
  document.querySelector('[data-demand]').textContent = `${data.demand}개`;
  document.querySelector('[data-sold]').textContent = `${data.sold}개`;
  document.querySelector('[data-revenue]').textContent = won(data.revenue);
  document.querySelector('[data-cost]').textContent = won(data.cost);
  document.querySelector('[data-profit-label]').textContent = sim.org === 'profit' ? '이익' : '잉여';
  const profitNode = document.querySelector('[data-profit]');
  profitNode.textContent = `${data.profit >= 0 ? '+' : '−'}${won(Math.abs(data.profit))}`;
  profitNode.classList.toggle('negative', data.profit < 0);
  document.querySelector('[data-event-title]').textContent = event.title;
  document.querySelector('[data-event-copy]').textContent = event.copy;
  document.querySelector('[data-score-label]').textContent = sim.org === 'profit' ? '누적 기업가치' : '누적 사회가치';
  document.querySelector('[data-score]').textContent = `${Math.round(sim.score).toLocaleString('ko-KR')}점`;
  document.querySelector('[data-week]').textContent = Math.min(sim.week + 1, 4);
  runWeekButton.textContent = sim.week < 4 ? `이 결정으로 ${sim.week + 1}주 운영하기` : '4주 운영 완료';
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

runWeekButton.addEventListener('click', () => {
  if (sim.week >= 4) return;
  const data = simulationNumbers();
  const valueGain = sim.org === 'profit'
    ? data.profit / 1000 - data.unsold * 1.2
    : data.sold * 2 + Math.max(0, data.profit) / 1800 - Math.max(0, -data.profit) / 1000;
  sim.score += valueGain;
  sim.history.push({...data, valueGain});
  const report = document.querySelector('[data-week-report]');
  report.hidden = false;
  report.innerHTML = `<b>${sim.week + 1}주 보고 · ${data.sold}개 판매</b><p>${sim.org === 'profit' ? `이익 ${won(data.profit)}과 재고 ${data.unsold}개를 기업가치에 반영했습니다.` : `빵 ${data.sold}개로 지역에 기여했고, 잉여 ${won(data.profit)}은 다음 목적 사업에 다시 사용합니다.`}</p>`;
  sim.week += 1;
  document.querySelectorAll('[data-org]').forEach(button => button.disabled = true);
  if (sim.week >= 4) {
    runWeekButton.disabled = true;
    report.innerHTML = `<b>4주 운영 완료 · 최종 ${sim.org === 'profit' ? '기업가치' : '사회가치'} ${Math.round(sim.score)}점</b><p>좋은 경영은 가장 큰 숫자 하나를 고르는 일이 아니라, 조직의 목적과 여러 조건을 함께 살피는 일입니다.</p>`;
  }
  updateSimulation();
});

document.querySelector('[data-reset-sim]').addEventListener('click', () => {
  sim.week = 0; sim.org = 'profit'; sim.score = 0; sim.history = [];
  priceRange.value = 4500; quantityRange.value = 50;
  document.querySelectorAll('[data-org]').forEach(button => {button.disabled = false; button.classList.toggle('selected', button.dataset.org === 'profit');});
  runWeekButton.disabled = false;
  document.querySelector('[data-week-report]').hidden = true;
  updateSimulation();
});

const cases = [
  {source:'교내 경제신문', title:'금리가 4%에서 6%로 올랐다', claim:'“금리가 2% 상승했습니다.”', clue:'퍼센트 값끼리의 차이와 처음 값에 대한 변화율은 서로 다른 숫자입니다.', question:'이 문장을 가장 정확하게 고치면?', answers:['금리가 2%포인트, 처음보다 50% 상승했다.','금리가 2%포인트, 처음보다 2% 상승했다.','금리가 처음보다 150% 상승했다.'], correct:0, explain:'6%−4%=2%포인트이고, 처음 4%에 비해 2%포인트가 늘었으므로 변화율은 2÷4=50%입니다.'},
  {source:'해외 체험학습 견적서', title:'100달러를 환전하려고 한다', claim:'“환율이 1달러당 1,300원에서 1,400원이 되면 1만 원이 더 필요하다.”', clue:'필요한 원화 = 달러 금액 × 1달러당 원화 환율', question:'견적서의 계산은 맞을까?', answers:['맞다. 100×(1,400−1,300)=10,000원이다.','아니다. 100원이 더 필요하다.','아니다. 환율이 오르면 필요한 원화는 줄어든다.'], correct:0, explain:'같은 100달러를 사려면 환율 차이 100원에 100달러를 곱한 10,000원이 더 필요합니다.'},
  {source:'동아리 설립 회의록', title:'비영리조직의 바자회', claim:'“비영리조직은 돈을 벌면 안 되므로 물건을 팔 수 없다.”', clue:'수입이나 잉여가 생기는 것과 그 돈을 소유자에게 나누는 것은 다른 문제입니다.', question:'가장 정확한 판단은?', answers:['맞다. 비영리는 모든 판매가 금지된다.','틀리다. 판매와 잉여는 가능하지만 목적 사업에 다시 사용해야 한다.','틀리다. 비영리도 잉여를 회원에게 똑같이 나눌 수 있다.'], correct:1, explain:'비영리조직도 목적을 위해 유료 서비스나 판매 활동을 할 수 있습니다. 핵심은 잉여를 소유자에게 분배하지 않는다는 점입니다.'},
  {source:'카페 영수증', title:'공급가액 8,000원인 음료', claim:'“부가가치세 10%는 80원이므로 총액은 8,080원이다.”', clue:'10%는 0.1입니다. 8,000에 0.1을 곱해 보세요.', question:'올바른 세액과 총액은?', answers:['세액 80원, 총액 8,080원','세액 800원, 총액 8,800원','세액 8,000원, 총액 16,000원'], correct:1, explain:'8,000×0.1=800원이므로 총액은 8,000+800=8,800원입니다.'}
];

let caseIndex = 0;
let caseScore = 0;
function renderCase() {
  const item = cases[caseIndex];
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
  const item = cases[caseIndex];
  const correct = choice === item.correct;
  if (correct) caseScore += 1;
  document.querySelector('[data-case-score]').textContent = caseScore;
  document.querySelectorAll('[data-answer]').forEach((button, index) => {
    button.disabled = true;
    button.classList.toggle('correct', index === item.correct);
    button.classList.toggle('wrong', index === choice && !correct);
  });
  const feedback = document.querySelector('[data-case-feedback]');
  feedback.hidden = false;
  feedback.classList.toggle('wrong', !correct);
  feedback.innerHTML = `<b>${correct ? '사건 해결!' : '단서를 한 번 더 연결해 봅시다.'}</b><p>${item.explain}</p>`;
  const next = document.querySelector('[data-next-case]');
  next.hidden = false;
  next.textContent = caseIndex === cases.length - 1 ? '사건 파일 다시 보기' : '다음 사건 열기';
}

document.querySelector('[data-next-case]').addEventListener('click', () => {
  if (caseIndex === cases.length - 1) {caseIndex = 0; caseScore = 0; document.querySelector('[data-case-score]').textContent = 0;}
  else caseIndex += 1;
  renderCase();
});

const matrixInputs = [...document.querySelectorAll('[data-matrix-input]')];
const demandCaps = [32, 24, 20, 36];
const prices = [3500, 5500, 3500, 5500];
const unitCosts = [1400, 2100, 1400, 2100];
function calculateMatrix() {
  const quantities = matrixInputs.map(input => Math.max(0, Math.min(50, Number(input.value) || 0)));
  matrixInputs.forEach((input, index) => input.value = quantities[index]);
  const sold = quantities.map((quantity, index) => Math.min(quantity, demandCaps[index]));
  const wasteCount = quantities.reduce((sum, quantity, index) => sum + Math.max(0, quantity - demandCaps[index]), 0);
  const branchRevenue = [sold[0] * prices[0] + sold[1] * prices[1], sold[2] * prices[2] + sold[3] * prices[3]];
  const revenue = branchRevenue[0] + branchRevenue[1];
  const productionCost = quantities.reduce((sum, quantity, index) => sum + quantity * unitCosts[index], 0);
  const wasteCost = wasteCount * 1000;
  const profit = revenue - productionCost - 15000 - wasteCost;
  document.querySelector('[data-q-matrix]').innerHTML = `${quantities[0]}　${quantities[1]}<br>${quantities[2]}　${quantities[3]}`;
  document.querySelector('[data-r-matrix]').innerHTML = `${branchRevenue[0].toLocaleString('ko-KR')}<br>${branchRevenue[1].toLocaleString('ko-KR')}`;
  document.querySelector('[data-matrix-revenue]').textContent = won(revenue);
  document.querySelector('[data-matrix-waste]').textContent = won(wasteCost);
  document.querySelector('[data-matrix-profit]').textContent = won(profit);
  const feedback = document.querySelector('[data-matrix-feedback]');
  const success = profit >= 250000;
  feedback.classList.toggle('bad', !success);
  feedback.innerHTML = success
    ? `<b>목표 달성!</b><p>${wasteCount ? `폐기 ${wasteCount}개가 있지만` : '폐기 없이'} 목표 순수익을 넘겼습니다. 더 적은 생산으로 같은 목표를 만들 수 있는지도 살펴보세요.</p>`
    : `<b>목표까지 ${won(250000 - profit)}</b><p>${wasteCount ? `수요를 넘긴 ${wasteCount}개에는 생산비와 폐기비용이 함께 듭니다.` : '지점별 수요 안에서 수익성이 높은 상품 배분을 조정해 보세요.'}</p>`;
}

document.querySelector('[data-calc-matrix]').addEventListener('click', calculateMatrix);
matrixInputs.forEach(input => input.addEventListener('change', calculateMatrix));

// 04 · 가계 자산 보드게임
const assetEvents = [
  {title:'첫 급여를 받았습니다', copy:'생활비를 제외한 돈 중 얼마를 미래로 보낼지 정하세요.', shock:0},
  {title:'주거 보증금이 필요합니다', copy:'예상하지 못한 주거비 20만 원이 자산에서 빠집니다.', shock:-200000},
  {title:'성과 보너스를 받았습니다', copy:'보너스 15만 원이 자산에 더해집니다.', shock:150000},
  {title:'갑작스러운 병원비', copy:'의료비 10만 원을 지출한 뒤 마지막 저축 결정을 합니다.', shock:-100000}
];
const assetState = {round:0,total:0,principal:0};
const assetSave = document.querySelector('[data-asset-save]');
const assetRate = document.querySelector('[data-asset-rate]');
const assetRun = document.querySelector('[data-run-assets]');
function updateAssetBoard(){
  const event=assetEvents[Math.min(assetState.round,3)];
  document.querySelector('[data-asset-round]').textContent=Math.min(assetState.round+1,4);
  document.querySelector('[data-asset-event]').textContent=event.title;
  document.querySelector('[data-asset-copy]').textContent=event.copy;
  document.querySelector('[data-asset-save-output]').textContent=won(Number(assetSave.value));
  document.querySelector('[data-asset-rate-output]').textContent=`${assetRate.value}%`;
  document.querySelector('[data-asset-total]').textContent=won(assetState.total);
  document.querySelector('[data-asset-principal]').textContent=won(assetState.principal);
  document.querySelector('[data-asset-interest]').textContent=won(Math.max(0,assetState.total-assetState.principal));
  [...document.querySelectorAll('[data-life-board] span')].forEach((node,index)=>{node.classList.toggle('done',index<assetState.round);node.classList.toggle('active',index===assetState.round&&assetState.round<4)});
}
assetSave.addEventListener('input',updateAssetBoard);assetRate.addEventListener('input',updateAssetBoard);
assetRun.addEventListener('click',()=>{
  if(assetState.round>=4)return;
  const save=Number(assetSave.value),rate=Number(assetRate.value)/100,event=assetEvents[assetState.round];
  const before=assetState.total;
  assetState.total=Math.max(0,Math.round(assetState.total*Math.pow(1+rate,5)+save+event.shock));
  assetState.principal+=save;
  const growth=Math.max(0,Math.round(before*Math.pow(1+rate,5)-before));
  assetState.round+=1;
  const feedback=document.querySelector('[data-asset-feedback]');
  feedback.innerHTML=`<b>${assetState.round}번째 칸 완료 · 자산 ${won(assetState.total)}</b><p>지난 자산에서 복리로 ${won(growth)} 늘었고, 저축과 사건 금액이 반영됐습니다.</p>`;
  if(assetState.round>=4){assetRun.disabled=true;assetRun.textContent='보드게임 완료';feedback.classList.add('success');feedback.innerHTML=`<b>미래 준비 완료 · 최종 자산 ${won(assetState.total)}</b><p>원금 ${won(assetState.principal)}과 시간의 효과를 비교해 보세요. 수익률이 높을수록 위험도 함께 커질 수 있습니다.</p>`}
  updateAssetBoard();
});
document.querySelector('[data-reset-assets]').addEventListener('click',()=>{assetState.round=0;assetState.total=0;assetState.principal=0;assetSave.value=300000;assetRate.value=5;assetRun.disabled=false;assetRun.textContent='다음 칸으로 이동';const f=document.querySelector('[data-asset-feedback]');f.classList.remove('success');f.innerHTML='<b>첫 결정을 기다립니다.</b><p>현재 소비와 미래 준비 사이의 균형을 생각해 보세요.</p>';updateAssetBoard()});

// 05 · 시장 균형 스토리 RPG
const storyScenes=[
  {speaker:'빵집 앞 주민',line:'“가격이 너무 낮아 아침마다 빵이 금방 동나요!”',d:80,s:50,choices:[['가격을 조금 올린다',-10,10,'가격 상승은 수요량을 줄이고 공급량을 늘려 차이를 좁혔습니다.'],['소비 쿠폰을 나눠준다',10,0,'수요가 더 늘어 품절이 심해졌습니다.'],['상인 영업시간을 줄인다',0,-10,'공급이 줄어 초과수요가 커졌습니다.']]},
  {speaker:'채소가게 상인',line:'“비가 그치자 채소가 너무 많이 들어와 재고가 쌓였어요.”',d:45,s:70,choices:[['가격을 조금 내린다',10,-8,'가격 하락은 수요량을 늘리고 공급량을 줄여 재고를 완화했습니다.'],['가격을 더 올린다',-8,7,'사려는 양은 줄고 팔려는 양은 늘어 재고가 커졌습니다.'],['생산 보조금을 준다',0,10,'공급이 더 늘어 초과공급이 커졌습니다.']]},
  {speaker:'마을 축제 준비위원',line:'“축제 날 간식 수요가 갑자기 늘어날 것 같아요.”',d:75,s:60,choices:[['임시 판매대를 허용한다',0,14,'공급이 수요 증가에 맞춰 늘어 균형에 가까워졌습니다.'],['구매 쿠폰만 더 지급한다',12,0,'수요가 더 늘어 품절 가능성이 커졌습니다.'],['판매대를 줄인다',0,-10,'공급이 줄어 시장 차이가 커졌습니다.']]}
];
const storyState={round:0,score:0};
function marketDescription(d,s){const gap=d-s;if(Math.abs(gap)<=3)return['거의 균형','수요량과 공급량이 거의 같습니다.'];return gap>0?[`${gap}개의 초과수요`,'사려는 양이 팔려는 양보다 많아 품절이 생깁니다.']:[`${Math.abs(gap)}개의 초과공급`,'팔려는 양이 사려는 양보다 많아 재고가 쌓입니다.']}
function renderStory(){
  const scene=storyScenes[Math.min(storyState.round,2)];
  document.querySelector('[data-story-round]').textContent=Math.min(storyState.round+1,3);document.querySelector('[data-story-speaker]').textContent=scene.speaker;document.querySelector('[data-story-line]').textContent=scene.line;document.querySelector('[data-story-demand]').textContent=scene.d;document.querySelector('[data-story-supply]').textContent=scene.s;document.querySelector('[data-story-gap]').textContent=Math.abs(scene.d-scene.s);
  const desc=marketDescription(scene.d,scene.s);document.querySelector('[data-story-status]').textContent=desc[0];document.querySelector('[data-story-explain]').textContent=desc[1];
  document.querySelector('[data-story-choices]').innerHTML=scene.choices.map((choice,index)=>`<button type="button" data-story-choice="${index}">${choice[0]}</button>`).join('');
  document.querySelectorAll('[data-story-choice]').forEach(button=>button.addEventListener('click',()=>chooseStory(Number(button.dataset.storyChoice))));
}
function chooseStory(index){
  const scene=storyScenes[storyState.round],choice=scene.choices[index],d=scene.d+choice[1],s=scene.s+choice[2],gap=Math.abs(d-s);storyState.score+=Math.max(0,30-gap);
  document.querySelector('[data-story-demand]').textContent=d;document.querySelector('[data-story-supply]').textContent=s;document.querySelector('[data-story-gap]').textContent=gap;const desc=marketDescription(d,s);document.querySelector('[data-story-status]').textContent=desc[0];document.querySelector('[data-story-explain]').textContent=desc[1];document.querySelectorAll('[data-story-choice]').forEach(b=>b.disabled=true);
  const feedback=document.querySelector('[data-story-feedback]');feedback.innerHTML=`<b>${choice[0]} · 시장 차이 ${gap}</b><p>${choice[3]}</p>`;
  setTimeout(()=>{storyState.round+=1;if(storyState.round<3){renderStory()}else{feedback.classList.add('success');feedback.innerHTML=`<b>이야기 완료 · 균형 점수 ${storyState.score}점</b><p>수요가 많은지 공급이 많은지 먼저 판단하면 정책의 방향을 고르기 쉬워집니다.</p>`;document.querySelector('[data-story-choices]').innerHTML='<p class="story-end">마을의 세 시장을 모두 살펴봤습니다.</p>'}},850);
}
document.querySelector('[data-reset-story]').addEventListener('click',()=>{storyState.round=0;storyState.score=0;const f=document.querySelector('[data-story-feedback]');f.classList.remove('success');f.innerHTML='<b>첫 대화를 읽어보세요.</b><p>주민과 상인 중 어느 쪽의 양이 부족한지 먼저 판단하세요.</p>';renderStory()});

// 06 · 한계의 정원 최적화 퍼즐
const marginalA=[13,11,9,7,5,3,2,1,1,0],marginalB=[12,11,10,9,8,7,5,3,2,1];
const garden={a:8,b:2};
const sumFirst=(arr,count)=>arr.slice(0,count).reduce((a,b)=>a+b,0);
function updateGarden(){
  const ya=sumFirst(marginalA,garden.a),yb=sumFirst(marginalB,garden.b),total=ya+yb;
  document.querySelector('[data-water-a-count]').textContent=garden.a;document.querySelector('[data-water-b-count]').textContent=garden.b;document.querySelector('[data-water-total]').textContent=garden.a+garden.b;document.querySelector('[data-garden-a-yield]').textContent=ya;document.querySelector('[data-garden-b-yield]').textContent=yb;document.querySelector('[data-garden-total]').textContent=total;
  document.querySelector('[data-garden-a-dots]').innerHTML=marginalA.slice(0,garden.a).map(v=>`<i style="--h:${v*6}px" title="한계수확 ${v}"></i>`).join('');document.querySelector('[data-garden-b-dots]').innerHTML=marginalB.slice(0,garden.b).map(v=>`<i style="--h:${v*6}px" title="한계수확 ${v}"></i>`).join('');
  const nextA=marginalA[garden.a]??0,nextB=marginalB[garden.b]??0;document.querySelector('[data-next-marginal]').textContent=`A ${nextA} · B ${nextB}`;
  const feedback=document.querySelector('[data-garden-feedback]');feedback.classList.toggle('success',total>=92);feedback.classList.toggle('bad',total<82);feedback.innerHTML=total>=92?`<b>목표 달성! 총수확 ${total}</b><p>다음 한 통의 한계수확이 더 큰 밭으로 물을 옮긴 판단이 효과적이었습니다.</p>`:`<b>현재 총수확 ${total}</b><p>이미 물을 많이 받은 밭의 마지막 한 통과, 다른 밭의 다음 한 통 효과를 비교하세요.</p>`;
}
document.querySelectorAll('[data-water-a]').forEach(b=>b.addEventListener('click',()=>{const delta=Number(b.dataset.waterA);if(delta>0&&garden.b>0){garden.a++;garden.b--}if(delta<0&&garden.a>0){garden.a--;garden.b++}updateGarden()}));
document.querySelectorAll('[data-water-b]').forEach(b=>b.addEventListener('click',()=>{const delta=Number(b.dataset.waterB);if(delta>0&&garden.a>0){garden.b++;garden.a--}if(delta<0&&garden.b>0){garden.b--;garden.a++}updateGarden()}));
document.querySelector('[data-reset-garden]').addEventListener('click',()=>{garden.a=8;garden.b=2;updateGarden()});

updateSimulation();
renderCase();
calculateMatrix();
updateAssetBoard();
renderStory();
updateGarden();
