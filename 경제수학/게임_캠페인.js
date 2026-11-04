/* Offline-first expansion. No account, network storage, or student identifiers. */
(() => {
  'use strict';
  const shuffle = values => { const a=[...values]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; };
  const el=(tag,cls,html)=>{const n=document.createElement(tag);n.className=cls;n.innerHTML=html;return n;};
  const library=document.querySelector('.game-library'); if(!library)return;
  const settings=el('div','business-settings','<label>업종 <select data-business><option value="bakery">동네빵 연구소</option><option value="cafe">동네 찻집</option><option value="repair">수리 공방</option></select></label><label>난이도 <select data-difficulty><option value="intro">입문 · 낮은 고정비</option><option value="standard" selected>표준</option><option value="challenge">도전 · 비용과 변동 확대</option></select></label><p>업종마다 기본 수요·가격 민감도·생산비가 달라요. 첫 운영 전에 선택하세요.</p>');
  document.querySelector('#game-sim .game-intro').after(settings);
  settings.querySelectorAll('select').forEach(s=>s.addEventListener('change',()=>{if(sim.week||sim.running)return;sim.business=settings.querySelector('[data-business]').value;sim.difficulty=settings.querySelector('[data-difficulty]').value;document.querySelector('.bakery-building>b').textContent=businessModels[sim.business].name;updateSimulation();}));
  document.querySelector('[data-run-week]').addEventListener('click',()=>settings.querySelectorAll('select').forEach(s=>s.disabled=true));
  document.querySelector('[data-reset-sim]').addEventListener('click',()=>settings.querySelectorAll('select').forEach(s=>s.disabled=false));
  const extraCases=[
    ['연속 할인','10% 할인 뒤 다시 10% 할인하면 총 20% 할인이다.','10,000×0.9×0.9','8,100원 · 총 19% 할인','8,000원 · 총 20% 할인','9,000원 · 총 10% 할인','두 번째 할인은 이미 낮아진 가격을 기준으로 계산합니다.'],
    ['가격 회복','20% 내린 가격은 20% 올리면 원래 가격이다.','100→80→원래 100','25% 올려야 한다','20% 올려야 한다','40% 올려야 한다','20÷80=25%입니다. 변화율의 기준이 달라졌습니다.'],
    ['세금 포함 가격','부가세 포함 11,000원의 공급가액은?','공급가액×1.1=11,000','10,000원','9,900원','11,000원','총액을 1.1로 나눕니다. 총액의 10%를 빼면 안 됩니다.'],
    ['명목과 실질','임금 5% 증가, 물가 5% 증가라면 구매력은?','1.05÷1.05','변하지 않는다','5% 증가한다','10% 증가한다','임금과 물가가 같은 비율로 올라 살 수 있는 양은 같습니다.'],
    ['물가지수','기준년 100인 물가지수가 120이 되었다.','(120−100)÷100','기준년보다 20% 상승','기준년보다 120% 상승','기준년보다 2% 상승','지수 자체와 상승률을 구별해야 합니다.'],
    ['실업률의 분모','실업자 10명, 취업자 90명, 비경제활동인구 50명이다.','실업자÷경제활동인구','실업률 10%','실업률 약 6.7%','실업률 약 11.1%','경제활동인구는 취업자와 실업자의 합 100명입니다.'],
    ['가중평균','2,000원 상품 3개, 5,000원 상품 1개의 평균 단가는?','총금액÷총수량','2,750원','3,500원','7,000원','가격의 단순 평균이 아니라 수량을 가중치로 사용합니다.'],
    ['환전 방향','1달러 1,250원일 때 50,000원으로 살 수 있는 달러는?','원화÷원/달러','40달러','62.5달러','625달러','같은 단위가 약분되는지 확인하세요. 수수료는 없는 모형입니다.'],
    ['환전 수수료','100달러 환전에 기본 환율 1,400원, 수수료 1%가 붙는다.','140,000×1.01','141,400원','140,100원','138,600원','수수료는 환전 원금 140,000원의 1%인 1,400원입니다.'],
    ['단리 이자','200만 원, 연 3% 단리, 3년의 이자는?','2,000,000×0.03×3','180,000원','60,000원','185,454원','단리는 매년 최초 원금에만 이자가 붙습니다.'],
    ['현재가치','1년 뒤 110만 원을 할인율 10%로 현재가치 계산하면?','1,100,000÷1.1','1,000,000원','990,000원','1,210,000원','미래 금액을 이자 성장 배율로 나눕니다.'],
    ['손익분기점','고정비 3만 원, 가격 3천 원, 단위비용 1천 원이다.','30,000÷(3,000−1,000)','15개 판매','10개 판매','30개 판매','개당 공헌이익 2,000원으로 고정비를 충당해야 합니다. 모두 판매한다고 가정합니다.'],
    ['매출과 이익','매출 20만 원, 비용 16만 원이다.','매출−비용','이익 4만 원','이익 20만 원','이익 36만 원','들어온 돈 전체가 이익은 아닙니다.'],
    ['매출 변화','가격 10% 인상, 판매량 10% 감소 시 매출은?','1.1×0.9','1% 감소','변화 없음','1% 증가','두 변화율은 더하지 않고 배율을 곱합니다.'],
    ['평균비용','10개 총비용 5만 원, 11개 총비용 5만 2천 원이다.','추가 비용 52,000−50,000','11번째 한계비용 2,000원','11번째 한계비용 5,000원','11번째 한계비용 52,000원','한계비용은 추가 한 단위 때문에 늘어난 비용입니다.'],
    ['기회비용','시간이 겹치는 두 활동 중 무료 강연 대신 2만 원 아르바이트를 골랐다.','포기한 가장 좋은 대안','강연에서 얻을 가치가 기회비용','기회비용은 언제나 0원','받은 2만 원 자체가 기회비용','기회비용에는 포기한 경험의 가치도 포함될 수 있습니다.'],
    ['매몰비용','환불 불가 영화표를 샀지만 지금 몸이 아프다.','돌려받을 수 없는 과거 비용','앞으로의 편익과 비용으로 결정','표값이 아까우니 반드시 관람','이미 쓴 돈만 비교','매몰비용은 지금의 선택으로 바꿀 수 없어 미래 판단에서 구분합니다.'],
    ['시장 균형','수요 Q=100−2P, 공급 Q=20+2P이다.','100−2P=20+2P','균형가격 20','균형가격 40','균형가격 80','80=4P, P=20이며 균형거래량은 60입니다.'],
    ['초과공급','현재 가격에서 수요 30, 공급 45이다.','공급−수요','초과공급 15','초과수요 15','거래량 45','사려는 양보다 팔려는 양이 15 많습니다.'],
    ['행렬 곱','수량 [2,3], 가격 [1,000;2,000]의 곱은?','2×1,000+3×2,000','매출 8,000원','매출 5,000원','매출 6,000원','같은 상품의 수량과 가격을 각각 곱한 뒤 더합니다.'],
    ['탄력성과 매출','가격 1% 상승에 수요량 3% 감소한다.','변화율의 비율','탄력적이며 매출 감소 방향','비탄력적이며 매출 증가 방향','수요는 가격과 무관','수요 감소 비율이 가격 상승 비율보다 큽니다.'],
    ['최적화 조건','추가 생산의 한계수입 4천 원, 한계비용 5천 원이다.','4,000−5,000','추가 생산은 이익 1천 원 감소','추가 생산은 이익 1천 원 증가','총이익은 반드시 적자','한계이익과 총이익의 부호는 다른 정보입니다.']
  ];
  extraCases.forEach((x,i)=>cases.push({source:`경제 자료실 · 확장 사건 ${i+9}`,title:x[0],claim:x[1],clue:x[2],question:'자료를 가장 정확하게 해석한 것은?',answers:[x[3],x[4],x[5]],correct:0,explain:x[6]}));
  // Shuffle answer positions with the answer key, not only the case sequence.
  cases.forEach(c=>{const correct=c.answers[c.correct];c.answers=shuffle(c.answers);c.correct=c.answers.indexOf(correct);});
  const caseDeck=shuffle(cases);cases.splice(0,cases.length,...caseDeck);caseOffset=0;renderCase();
  document.querySelector('#tab-detective .gt-len').textContent='30사건';
  document.querySelector('.hero-copy .eyebrow').textContent='7 GENRES · THINK, PLAY, REFLECT';
  document.querySelector('.hero-copy>p:last-child').textContent='일곱 가지 게임에서 결정하고 결과를 비교하세요. 무작위 개념 연습과 결과 카드로 배움을 이어갑니다.';
  events.push(
    {title:'단체 예약 주문',copy:'동아리 단체 주문으로 수요 18개 증가, 포장 고정비 6,000원 추가.',demand:18,variable:0,fixed:6000,weather:'📋'},
    {title:'재사용 용기 주간',copy:'포장 재료비가 개당 150원 줄지만 세척 설비비 8,000원이 발생합니다.',demand:2,variable:-150,fixed:8000,weather:'♻️'},
    {title:'배송 경로 공사',copy:'수요 6개 감소, 임시 배송비가 개당 200원 증가합니다.',demand:-6,variable:200,fixed:0,weather:'🚧'},
    {title:'지역 공동 구매',copy:'재료를 공동 구매해 단위비용 200원을 절약합니다.',demand:0,variable:-200,fixed:3000,weather:'📦'},
    {title:'새 학기 시작',copy:'새 손님이 늘어 수요 9개 증가, 안내 비용 4,000원 추가.',demand:9,variable:0,fixed:4000,weather:'🎒'},
    {title:'시설 점검',copy:'안전 점검비 18,000원이 들고 영업시간 감소로 수요 5개 감소.',demand:-5,variable:0,fixed:18000,weather:'🔧'});
  eventOrder=shuffledEventOrder();updateSimulation();
  matrixMissions.push(
    {name:'도서관 시험 기간',demand:[45,20,15,30],price:[3900,5900],cost:[1500,2200],waste:1300,fixed:18000,target:270000,condition:'학교점 간식이 인기입니다. 지점별 수요 차이에 주목하세요.'},
    {name:'지역 마라톤',demand:[20,46,18,48],price:[3700,5600],cost:[1600,2400],waste:1000,fixed:25000,target:320000,condition:'두 지점 모두 음료 수요가 높습니다.'},
    {name:'원재료 부족',demand:[25,28,24,26],price:[4100,6400],cost:[2200,3300],waste:1600,fixed:20000,target:210000,condition:'가격이 높아도 비용을 빼면 얼마나 남는지 확인하세요.'},
    {name:'주말 공원 나들이',demand:[18,15,45,43],price:[4000,5800],cost:[1700,2300],waste:1400,fixed:22000,target:300000,condition:'공원점이 붐빕니다. 균등 배분이 최선일까요?'},
    {name:'저포장 공동 배송',demand:[36,32,34,30],price:[4300,6100],cost:[1850,2500],waste:2000,fixed:20000,target:350000,condition:'폐기를 줄이고 배송 방식까지 비교하세요.'});
  matrixMissionOrder=shuffle(matrixMissions.map((_,i)=>i));loadMatrixMission();calculateMatrix(false);
  document.querySelector('#tab-matrix .gt-len').textContent='10미션';
  const gardenVariants=[
    ['겨울 온실','당근','시금치',[18,15,12,9,6,3,2,1,0,0],[14,12,10,8,6,4,3,2,1,0]],
    ['봄비 뒤','오이','완두',[12,12,11,10,8,6,4,3,1,0],[17,13,10,7,5,3,2,1,0,0]],
    ['모래 토양','감자','콩',[20,15,10,5,3,2,1,0,0,0],[11,10,9,8,7,6,5,4,3,2]],
    ['그늘 정원','민트','케일',[10,10,10,9,9,8,5,3,1,0],[16,14,12,8,5,3,1,0,0,0]],
    ['여름 열매','수박','가지',[22,18,14,10,6,3,1,0,0,0],[15,13,11,9,7,5,3,2,1,0]],
    ['공동체 정원','옥수수','완두',[15,14,13,12,8,4,2,1,0,0],[15,14,11,8,7,6,5,4,3,2]]
  ];
  gardenVariants.forEach(v=>{const optimal=Math.max(...Array.from({length:11},(_,a)=>sumFirst(v[3],a)+sumFirst(v[4],10-a)));gardenMissions.push({name:v[0],aName:`A 밭 · ${v[1]}`,bName:`B 밭 · ${v[2]}`,a:v[3],b:v[4],start:[9,1],target:optimal});});
  gardenOrder=shuffle(gardenMissions.map((_,i)=>i));resetGardenMission();document.querySelector('#tab-garden .gt-len').textContent='9미션';
  // Alternate market stories broaden replay without changing the eight-stop map.
  const additionalScenes=[
    {speaker:'자전거 수리점',line:'“통학 자전거 수리는 밀리는데 기술자가 부족해요.”',d:76,s:46,choices:[['임시 수리 교육과 인력을 지원한다',0,25,'서비스 공급이 늘어 대기 수요를 줄였습니다.'],['수리 할인권만 더 배포한다',12,0,'이미 부족한 수리 수요가 더 늘었습니다.'],['영업일을 줄인다',0,-8,'서비스 공급이 더 줄었습니다.']]},
    {speaker:'중고 교복 장터',line:'“졸업생 교복은 많은데 장터를 아는 학생이 적어요.”',d:30,s:65,choices:[['학교에 장터 정보를 알린다',28,0,'찾는 사람이 늘어 재사용이 활발해졌습니다.'],['수거 물량만 더 늘린다',0,20,'공급 과잉이 커졌습니다.'],['가격을 올린다',-8,6,'수요가 줄고 공급이 늘어 차이가 커졌습니다.']]},
    {speaker:'폭설 뒤 배달센터',line:'“주문은 쌓였는데 배송 차량이 움직이기 어려워요.”',d:84,s:51,choices:[['안전한 공동 수령 장소를 마련한다',-3,24,'중복 배송을 줄여 이용 가능한 공급을 늘렸습니다.'],['주문 할인권을 준다',15,0,'수요만 증가했습니다.'],['배송 인력을 줄인다',0,-10,'공급이 더 줄었습니다.']]},
    {speaker:'재사용 컵 대여소',line:'“행사가 끝나 컵은 많은데 빌리는 사람이 적어요.”',d:25,s:54,choices:[['다른 행사와 대여를 연계한다',22,-4,'수요를 넓히고 준비량도 조절했습니다.'],['컵을 더 주문한다',0,18,'남는 물량이 늘었습니다.'],['대여료를 올린다',-8,3,'수요가 감소했습니다.']]}
  ];
  storyScenes.push(...additionalScenes);storyScenes.forEach(s=>s.choices=shuffle(s.choices));storyOrder=shuffle(storyScenes.map((_,i)=>i));renderStory();
  document.querySelector('#tab-village .gt-len').textContent='12장면 중 8장';
  // A cash-flow campaign complements the original compound-interest board.
  const household=el('details','household-campaign','<summary>확장 캠페인 · 우리 집 12개월 살림</summary><div data-household></div>');document.querySelector('#game-assets').append(household);
  const householdEvents=[['겨울 난방비',18],['신학기 준비',12],['가전 수리',25],['가족 행사',15],['교통비 증가',8],['교육비',20],['여름 냉방비',14],['갑작스러운 진료비',30],['명절 준비',18],['자전거 정비',9],['보험 갱신',16],['연말 지출',22]];
  let home;
  function resetHome(){home={month:0,cash:80,debt:100,saving:0,wellbeing:60,log:[],events:shuffle(householdEvents),ended:false};renderHome();}
  function renderHome(){const event=home.events[Math.min(home.month,11)],host=household.querySelector('[data-household]');host.innerHTML=`<h4>${home.ended?'12개월 결산':`${home.month+1}월 · ${event[0]}`}</h4><p>단위: 만 원. 매월 소득 240, 필수생활비 150, 이번 추가 지출 ${event[1]}. 대출 월 이율 0.5%, 저축 월 이율 0.2%인 학습 모형입니다.</p><div class="home-kpis"><span>현금 <b>${home.cash.toFixed(1)}</b></span><span>저축 <b>${home.saving.toFixed(1)}</b></span><span>대출 <b>${home.debt.toFixed(1)}</b></span><span>생활 만족 <b>${home.wellbeing}</b></span></div><div class="home-controls"><label>이번 달 저축 <input data-home-save type="number" min="0" max="100" step="5" value="25"></label><label>대출 원금 상환 <input data-home-repay type="number" min="0" max="100" step="5" value="20"></label><label>여가·휴식 지출 <select data-home-life><option value="10">10 · 만족 -3</option><option value="25" selected>25 · 만족 +1</option><option value="40">40 · 만족 +4</option></select></label></div><p data-home-preview aria-live="polite"></p><button data-home-next ${home.ended?'disabled':''}>이번 달 살림 마무리</button><button data-home-reset>새 12개월 시작</button><p>현금이 모자라면 저축에서 먼저 꺼내고, 그래도 부족하면 추가 대출합니다. 저축·상환을 크게 잡기 전에 비상 현금을 남기세요.</p><ol>${home.log.map(x=>`<li>${x}</li>`).join('')}</ol>${home.ended?`<p><b>${home.debt===0&&home.cash>=50&&home.wellbeing>=60?'안정적인 살림 설계':home.debt>0?'부채와 비상금 재점검':'생활 만족과 현금 여유 재점검'}</b> · 순자산 ${(home.cash+home.saving-home.debt).toFixed(1)}만 원. 저축만 늘리는 것과 생활을 지속할 수 있는 계획의 차이를 돌아보세요.</p>`:''}`;
    function preview(){const save=Math.max(0,Math.min(100,Number(host.querySelector('[data-home-save]').value)||0)),repay=Math.min(home.debt,Math.max(0,Math.min(100,Number(host.querySelector('[data-home-repay]').value)||0))),life=Number(host.querySelector('[data-home-life]').value),interest=home.debt*.005,remaining=home.cash+240-150-event[1]-interest-save-repay-life;host.querySelector('[data-home-preview]').textContent=`예상 월말 현금 ${remaining.toFixed(1)}만 원 · 대출 이자 ${interest.toFixed(1)}만 원${remaining<0?' · 부족분은 저축 인출 / 추가 대출':''}`;return{save,repay,life,interest,remaining};}
    host.querySelectorAll('input,select').forEach(n=>{n.disabled=home.ended;n.oninput=preview;});preview();host.querySelector('[data-home-reset]').onclick=resetHome;host.querySelector('[data-home-next]').onclick=()=>{if(home.ended)return;const p=preview();home.cash=p.remaining;home.saving=home.saving*1.002+p.save;home.debt-=p.repay;let borrow=0;if(home.cash<0){const withdrawal=Math.min(home.saving,-home.cash);home.saving-=withdrawal;home.cash+=withdrawal;if(home.cash<0){borrow=-home.cash;home.debt+=borrow;home.cash=0;}}home.wellbeing=Math.max(0,Math.min(100,home.wellbeing+(p.life===10?-3:p.life===25?1:4)));home.log.push(`${home.month+1}월 ${event[0]}: 저축 ${p.save}, 상환 ${p.repay}, 이자 ${p.interest.toFixed(1)}, 추가 대출 ${borrow.toFixed(1)}. 현금 ${home.cash.toFixed(1)}, 순자산 ${(home.cash+home.saving-home.debt).toFixed(1)}.`);home.month++;home.ended=home.month===12;renderHome();};}
  resetHome();
  const deck=[
    ['지역 상점',4,3,2,2,4,'🏪','동네에서 사고팔 기회가 함께 늘어납니다.'],
    ['공급망 회복',3,0,6,1,1,'🚢','배송이 회복되면 판매 가능한 상품이 늘어납니다.'],
    ['광고 캠페인',3,6,0,1,2,'📣','알려진 상품을 찾는 사람이 늘어납니다. 공급도 살펴보세요.'],
    ['공동 작업장',5,1,7,3,3,'🏭','설비를 함께 쓰면 생산 능력이 커집니다.'],
    ['금리 조정',2,-5,-1,0,1,'🏦','이 모형에서는 금리 인상으로 소비와 투자가 둔화됩니다.'],
    ['생활 지원',3,5,0,3,0,'🧺','구매 여력을 보완하지만 상품이 충분한지 확인해야 합니다.'],
    ['수리 협동조합',2,-2,3,3,1,'🛠️','고쳐 쓰기는 새 상품 수요를 낮추고 이용 가능한 자원을 늘립니다.'],
    ['직거래 장터',3,2,4,2,3,'🥕','유통 경로를 줄여 지역의 거래를 돕습니다.'],
    ['직업 교육',4,0,5,4,2,'📚','사람의 역량에 투자해 생산과 신뢰를 높입니다.'],
    ['에너지 절약',2,-1,2,2,2,'☀️','낭비를 줄여 자원 여유를 만듭니다.'],
    ['문화 축제',4,7,1,3,4,'🎪','방문객이 늘지만 공급 부족을 주의하세요.'],
    ['비상 비축',3,-2,5,1,0,'📦','비축 물자를 풀어 부족한 공급을 보완합니다.']
  ].map((c,id)=>({id,name:c[0],cost:c[1],d:c[2],s:c[3],trust:c[4],gain:c[5],icon:c[6],why:c[7]}));
  const scenarios=[{name:'지역 상권 활성화',d:58,s:43,goal:'부족한 공급을 회복하고 상점을 살려 보세요.'},{name:'풍년 뒤의 시장',d:38,s:64,goal:'남는 상품을 줄이고 소비와 생산의 균형을 되찾으세요.'},{name:'축제 이후 재정비',d:65,s:48,goal:'급증한 방문객에 맞추어 생산과 신뢰를 함께 지키세요.'}];
  const tab=el('button','game-tab','<span class="gt-top"><i class="gt-num">07</i><i class="gt-genre">ECONOMY CARD STRATEGY</i></span><span class="gt-ico">🃏</span><b class="gt-title">경제 전략 카드배틀</b><span class="gt-desc">나만의 정책 덱으로 시장의 균형을 만든다</span><span class="gt-foot">12종 카드 · 3개 시나리오 · 8턴</span>');
  Object.assign(tab,{type:'button',id:'tab-cards'}); tab.dataset.game='cards';tab.setAttribute('role','tab');tab.setAttribute('aria-controls','game-cards');tab.setAttribute('aria-selected','false');document.querySelector('.game-tabs').append(tab);
  const panel=el('section','game-panel economy-battle','');panel.id='game-cards';panel.dataset.panel='cards';panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby','tab-cards');panel.hidden=true;library.append(panel);
  let state;
  const balance=()=>Math.max(0,Math.round(100-Math.abs(state.d-state.s)/Math.max(state.d,state.s,1)*100));
  function start(index=0){const scenario=scenarios[index];state={scenario:index,turn:1,d:scenario.d,s:scenario.s,capital:12,trust:8,hp:20,ai:20,played:[],hand:shuffle(deck).slice(0,5),logs:['학습용 단순 모형입니다. 실제 경제를 예측하는 자료가 아닙니다.'],ended:false,selected:null,collection:new Set()};render();}
  function card(c,slot=false){return `<button type="button" class="econ-card ${!slot&&state.selected===c.id?'picked':''}" ${slot?'':`data-card="${c.id}"`} ${slot||state.ended?'disabled':''} aria-label="${c.name}, 비용 ${c.cost}" aria-pressed="${!slot&&state.selected===c.id}"><span class="card-cost">비용 ${c.cost}</span><span class="card-art art-${c.id%4}" aria-hidden="true">${c.icon}<i></i><i></i></span><b>${c.name}</b><span>🛒 수요 <strong>${c.d>=0?'+':''}${c.d}</strong></span><span>📦 공급 <strong>${c.s>=0?'+':''}${c.s}</strong></span><span>🤝 신뢰 <strong>+${c.trust}</strong></span><span>🪙 수입 <strong>+${c.gain}</strong></span></button>`;}
  function render(){const sc=scenarios[state.scenario],selected=deck[state.selected];panel.innerHTML=`<div class="battle-title"><div><h3>경제 전략 카드배틀</h3><p>카드로 생산, 소비, 신뢰를 조절해 시장의 균형과 지역의 회복력을 지키세요.</p></div><strong>턴 ${Math.min(state.turn,8)} / 8</strong></div><div class="battle-world"><aside class="battle-objectives"><h4>🚩 게임 목표</h4><p>8턴이 끝날 때 아래 목표 중 하나를 달성하세요.</p><div>⚖️ <b>시장 균형 달성</b><p>균형도 90% 이상</p></div><div>🛡️ <b>지역 회복력 보호</b><p>회복력 20 이상</p></div><h4>🏘️ 이번 시나리오</h4><b>${sc.name}</b><p>${sc.goal}</p><label>새 캠페인<select data-scenario>${scenarios.map((s,i)=>`<option value="${i}" ${i===state.scenario?'selected':''}>${s.name}</option>`).join('')}</select></label><button data-new-battle>다시 시작</button><details><summary>규칙 · 전체 카드 보기</summary><p>턴마다 자본 +5, 손패 5장까지 보충합니다. 한 턴 최대 3장. 카드 비용은 즉시 내고 수입은 턴 종료 때 받습니다. 불균형이 15%를 넘으면 회복력이 2 감소하고, 균형도 90% 이상이면 2 회복합니다. 신뢰 16 이상이면 매 턴 1 회복합니다.</p>${deck.map(c=>`<p>${c.icon} ${c.name} · 비용 ${c.cost}<br>${c.why}</p>`).join('')}</details></aside><div class="battle-table"><div class="market-ai"><span>🤖</span><div><b>시장 AI</b><small>안정성 ${state.ai}</small></div><p>수요와 공급의 차이를 줄이는<br>정책을 선택할게요.</p></div><div class="ai-cards">${[deck[1],deck[2],deck[4]].map(c=>card(c,true)).join('')}</div><div class="battle-center"><div class="played-slots">${[0,1,2].map(i=>state.played[i]?`<div class="played-mini">${state.played[i].icon}<b>${state.played[i].name}</b></div>`:'<div class="empty-slot">⌂<small>정책 놓는 곳</small></div>').join('')}</div><div class="market-meter"><b>시장의 현재 상황</b><div class="market-bars"><span>🛒 수요<strong>${state.d}</strong><i style="height:${Math.min(90,state.d)}px"></i></span><span>📦 공급<strong>${state.s}</strong><i style="height:${Math.min(90,state.s)}px"></i></span></div><small>시장 균형도</small><strong>${balance()}%</strong><meter min="0" max="100" value="${balance()}">${balance()}%</meter></div></div><div class="player-guide"><b>🧑‍🌾 경제 설계자 <span>🛡 회복력 ${state.hp}</span></b><p>${state.ended?'캠페인을 마쳤어요. 결과를 저장하고 다른 시나리오에 도전하세요.':'카드를 고르고 효과를 확인한 뒤 시장에 내세요.'}</p></div><div class="player-hand">${state.hand.map(c=>card(c)).join('')}</div><div class="card-inspector" aria-live="polite">${selected?`<b>${selected.name}</b> · ${selected.why}<button data-play-card ${state.ended||state.capital<selected.cost||state.played.length>=3?'disabled':''}>자본 ${selected.cost} 사용 · 시장에 내기</button>`:'손패에서 카드 한 장을 선택하세요. 비용과 효과를 미리 읽을 수 있어요.'}</div></div><aside class="battle-log"><h4>📖 학습 로그</h4><div aria-live="polite">${state.logs.slice(-5).reverse().map(l=>`<article>${l}</article>`).join('')}</div><details><summary>전체 턴 기록 (${state.logs.length})</summary>${state.logs.map(l=>`<p>${l}</p>`).join('')}</details></aside></div><div class="battle-footer"><span>🪙 자본 <b>${state.capital}</b></span><span>🤝 신뢰 <b>${state.trust}</b></span><span>🃏 사용한 카드 <b>${state.collection.size}/12종</b></span><button data-end-turn ${state.ended?'disabled':''}>▶ 턴 종료 · 시장 반응 보기</button></div><p class="battle-disclaimer">학습용 단순 모형입니다. 실제 시장에서는 효과의 크기와 방향이 조건에 따라 달라집니다. 로그인 없이 이 화면에서만 진행됩니다.</p>`;
    const gap=state.d-state.s;
    const reason=el('section','market-reason',`<b>💡 왜 이렇게 변할까요?</b>${gap>0?`수요가 공급보다 ${gap} 많아요. 살 사람에 비해 상품이 부족하니 공급을 늘리는 정책을 비교해 보세요.`:gap<0?`공급이 수요보다 ${-gap} 많아요. 남는 상품이 있으니 소비를 돕거나 생산을 조절하는 정책을 비교해 보세요.`:'수요와 공급이 같아요. 이제 자본과 신뢰를 함께 지키는 선택을 생각해 보세요.'}<br><small>균형도 = 작은 값 ÷ 큰 값 × 100</small>`);
    panel.querySelector('.battle-log').append(reason);
    const sequence=el('div','battle-sequence',`<b>${state.ended?'캠페인 완료':`이번 턴 ${state.played.length} / 3장 사용`}</b><span class="${!selected&&!state.ended?'current':''}">① 카드 선택</span><span class="${selected&&!state.ended?'current':''}">② 효과 예측 · 실행</span><span>③ 턴 종료 · 비교</span>`);
    panel.querySelector('.player-hand').before(sequence);
    panel.querySelector('.player-hand').setAttribute('aria-label','내 손패 · 카드를 선택하면 아래에 예상 효과가 표시됩니다');
    if(selected){
      const demand=Math.max(1,state.d+selected.d),supply=Math.max(1,state.s+selected.s);
      const predicted=Math.round(Math.min(demand,supply)/Math.max(demand,supply)*100);
      const preview=el('div','card-preview',`<span>수요 / 공급<b>${demand} / ${supply}</b></span><span>균형도<b>${balance()} → ${predicted}%</b></span><span>남는 자본<b>${state.capital-selected.cost}</b></span>`);
      const inspector=panel.querySelector('.card-inspector');
      inspector.insertBefore(preview,inspector.querySelector('button'));
      const unavailable=state.capital<selected.cost?'자본이 부족해요. 다른 카드를 고르거나 턴을 마치세요.':state.played.length>=3?'이번 턴의 카드 3장을 모두 냈어요. 턴을 마치세요.':'카드를 낸 직후의 예상입니다. 턴 종료 때 AI 정책과 시장 사건으로 다시 변해요.';
      inspector.append(el('small','forecast-note',unavailable));
    }
    panel.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>{state.selected=Number(b.dataset.card);render();panel.querySelector(`[data-card="${state.selected}"]`)?.focus({preventScroll:true});});
    panel.querySelector('[data-play-card]')?.addEventListener('click',()=>{const c=deck[state.selected];if(state.ended||!c||state.capital<c.cost||state.played.length>=3)return;state.capital-=c.cost;state.d=Math.max(1,state.d+c.d);state.s=Math.max(1,state.s+c.s);state.trust+=c.trust;state.played.push(c);state.collection.add(c.id);state.hand=state.hand.filter(x=>x.id!==c.id);state.logs.push(`<b>턴 ${state.turn} · ${c.name}</b><p>${c.why}</p><small>수요 ${state.d} · 공급 ${state.s} · 신뢰 ${state.trust}</small>`);state.selected=null;render();});
    panel.querySelector('[data-end-turn]').onclick=endTurn;panel.querySelector('[data-new-battle]').onclick=()=>start(Number(panel.querySelector('[data-scenario]').value));
  }
  function endTurn(){if(state.ended)return;const before=balance();const action=state.d>state.s?deck[1]:deck[2];state.d=Math.max(1,state.d+action.d);state.s=Math.max(1,state.s+action.s);const shock=shuffle([{d:4,s:0,name:'주말 방문객 증가'},{d:0,s:-3,name:'배송 지연'},{d:-3,s:0,name:'소비 계획 조정'},{d:0,s:4,name:'생산 회복'}])[0];state.d=Math.max(1,state.d+shock.d);state.s=Math.max(1,state.s+shock.s);const b=balance(),change=(b>=90?2:b<85?-2:0)+(state.trust>=16?1:0);state.hp=Math.max(0,state.hp+change);state.ai=Math.max(0,state.ai+(b>=90?2:-1));const income=state.played.reduce((n,c)=>n+c.gain,0);state.capital+=income+5;state.logs.push(`<b>턴 ${state.turn} · 시장 반응</b><p>AI: ${action.name}. ${shock.name}: 수요 ${shock.d>=0?'+':''}${shock.d}, 공급 ${shock.s>=0?'+':''}${shock.s}.</p><p>균형도 ${before}% → ${b}%, 회복력 ${change>=0?'+':''}${change}. 카드 수입 ${income} + 다음 운영 지원 5.</p>`);if(state.turn===8||state.hp===0){state.ended=true;state.logs.push(`<b>${b>=90||state.hp>=20?'목표 달성!':'다시 설계해 봐요'}</b><p>최종 균형도 ${b}% · 회복력 ${state.hp}. 공급만 늘리는 것보다 부족한 쪽을 먼저 보완하는 전략이 유리합니다.</p>`);}else{state.turn++;state.played=[];state.selected=null;state.hand=shuffle([...state.hand,...shuffle(deck.filter(c=>!state.hand.some(h=>h.id===c.id))).slice(0,5-state.hand.length)]);}render();}
  document.querySelectorAll('.game-tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.game-tab').forEach(t=>{const on=t===b;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));});document.querySelectorAll('[data-panel]').forEach(p=>{const on=p.dataset.panel===b.dataset.game;p.hidden=!on;p.classList.toggle('active',on);});}));
  start();
  // Shareable session cards contain only visible learning outcomes, never names.
  const exportBar=el('div','session-export','<b>이번 활동 결과 카드</b><span>로그인·서버 저장 없이 다운로드하거나 인쇄하세요.</span><button data-save-session>결과 카드 다운로드</button><button data-print-session>인쇄 / PDF</button>');library.append(exportBar);
  function report(){const active=document.querySelector('.game-panel.active');return `경제수학 · 세션 결과\n${new Date().toLocaleString('ko-KR')}\n${active.querySelector('h3')?.textContent||'학습 활동'}\n\n${active.dataset.panel==='cards'?state.logs.map(l=>{const n=document.createElement('div');n.innerHTML=l;return n.textContent;}).join('\n\n'):active.innerText}\n\n돌아보기\n1. 가장 효과적이었던 결정은?\n2. 결과가 달라진 수학적 이유는?\n3. 다음에는 무엇을 바꿀까?\n\n학습용 모형이며 실제 투자·경제 예측 자료가 아닙니다.`;}
  exportBar.querySelector('[data-save-session]').onclick=()=>{const url=URL.createObjectURL(new Blob([report()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='경제수학-결과카드.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  exportBar.querySelector('[data-print-session]').onclick=()=>{document.querySelector('#session-print')?.remove();const pre=el('pre','session-print','');pre.id='session-print';pre.textContent=report();document.body.append(pre);window.print();};
  // A short randomized retrieval-practice set accompanies every genre.
  const practice=el('details','campaign-practice','<summary>개념 훈련실 · 무작위 5문제</summary><div data-practice></div>');library.append(practice);let quiz=[],qi=0,score=0;
  function newQuiz(){quiz=shuffle(terms).slice(0,5).map(t=>({t,answers:shuffle([t,...shuffle(terms.filter(x=>x!==t)).slice(0,2)])}));qi=0;score=0;showQuiz();}
  function showQuiz(){const host=practice.querySelector('[data-practice]');if(qi===5){host.innerHTML=`<h4>5문제 중 ${score}문제 해결</h4><p>설명과 생활 예시를 함께 읽고 게임 속 결정에 적용해 보세요.</p><button data-again>새 문제 5개</button>`;host.querySelector('button').onclick=newQuiz;return;}const q=quiz[qi];host.innerHTML=`<small>${qi+1}/5 · ${q.t.group}</small><p>${q.t.plain}</p><div>${q.answers.map((a,i)=>`<button data-q="${i}">${a.name}</button>`).join('')}</div><p data-q-feedback aria-live="polite"></p>`;host.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const ok=q.answers[Number(b.dataset.q)]===q.t;if(ok)score++;host.querySelectorAll('button').forEach(x=>x.disabled=true);host.querySelector('[data-q-feedback]').textContent=`${ok?'맞았어요!':'정답: '+q.t.name} ${q.t.example}`;const next=el('button','','다음 문제');next.onclick=()=>{qi++;showQuiz();};host.append(next);});}newQuiz();
})();
