/* Presentation layer: keep the six existing game engines and their mathematics. */
(() => {
  const panel = document.querySelector('#game-sim');
  if (!panel) return;
  const board = panel.querySelector('.result-board');
  const decision = panel.querySelector('.decision-card');
  const event = panel.querySelector('.event-card');
  event.classList.add('market-forecast');
  event.querySelector('span').textContent = '시장 예보';
  board.prepend(event);
  board.querySelector('.result-title span').textContent = '예상 결과';
  board.querySelector('.result-title small').textContent = '이 결정으로 1주를 운영했을 때';
  const title = document.createElement('h4');
  title.className = 'decision-heading';
  title.innerHTML = '<span>1</span> 이번 주 결정 <small>가격 · 생산량 · 운영 전략을 선택해 보세요.</small>';
  decision.prepend(title);
  const firstLabel = decision.querySelector('.step-label');
  firstLabel.classList.add('purpose-label');
  firstLabel.querySelector('small').textContent = '조직의 목적은 첫 주에만 선택할 수 있어요.';
  const orgIcons = ['🪙', '♥'];
  decision.querySelectorAll('.org-card').forEach((card, i) => {
    const icon = document.createElement('i'); icon.className = 'org-icon'; icon.textContent = orgIcons[i]; icon.setAttribute('aria-hidden', 'true'); card.prepend(icon);
  });
  const stepIcons = ['','🏷️','🥐','⚙️'];
  decision.querySelectorAll('.step-label > span').forEach((node, i) => { if (i) node.textContent = stepIcons[i]; });
  panel.querySelectorAll('.range-line').forEach(row => {
    const input = row.querySelector('input');
    const output = row.querySelector('output');
    const stepper = document.createElement('div'); stepper.className = 'value-stepper';
    const label = input.id === 'priceRange' ? '가격' : '생산량';
    [-1, 1].forEach(direction => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = direction < 0 ? '−' : '+';
      button.setAttribute('aria-label', `${label} ${direction < 0 ? '줄이기' : '늘리기'}`);
      button.addEventListener('click', () => {
        if (input.disabled) return;
        direction < 0 ? input.stepDown() : input.stepUp();
        input.dispatchEvent(new Event('input', {bubbles:true}));
      });
      stepper.append(button);
    });
    stepper.insertBefore(output, stepper.lastChild); row.append(stepper);
    const update = () => {
      const pct = (Number(input.value)-Number(input.min))/(Number(input.max)-Number(input.min))*100;
      input.style.setProperty('--range-fill', `${pct}%`);
      stepper.firstChild.disabled = input.disabled || Number(input.value) <= Number(input.min);
      stepper.lastChild.disabled = input.disabled || Number(input.value) >= Number(input.max);
    };
    input.addEventListener('input', update); update();
    new MutationObserver(update).observe(input, {attributes:true, attributeFilter:['disabled']});
  });
  const inventory = document.createElement('div');
  inventory.innerHTML = '<dt>재고</dt><dd data-studio-inventory>0개</dd><small>생산량 − 판매량</small>';
  const kpis = board.querySelector('.kpi-grid'); kpis.insertBefore(inventory, kpis.children[2]);
  const demandHint = document.createElement('small');
  const soldHint = document.createElement('small');
  kpis.children[0].append(demandHint); kpis.children[1].append(soldHint);
  const icons = ['🧑‍🤝‍🧑','🛍️','📦','🪙','💰','♥'];
  kpis.querySelectorAll(':scope > div').forEach((cell, index) => { const icon=document.createElement('i'); icon.textContent=icons[index]; icon.setAttribute('aria-hidden','true'); cell.prepend(icon); });
  const profit = board.querySelector('.profit-line');
  const formula = board.querySelector('.formula-note'); profit.append(formula);
  board.append(panel.querySelector('[data-run-week]'));
  const reflection = document.createElement('details');
  reflection.className = 'studio-reflection';
  const reflectionTitle = document.createElement('summary');
  reflectionTitle.textContent = '운영 코치 · 누적 성과 보기';
  reflection.append(reflectionTitle, board.querySelector('.coach-note'), board.querySelector('.score-row'));
  board.append(reflection);
  const note = document.createElement('p'); note.className='decision-hint'; note.textContent='선택 → 운영 → 결과 확인 → 다음 주에 개선'; board.append(note);
  const scene = panel.querySelector('.operation-scene');
  const chatter = document.createElement('div'); chatter.className = 'bakery-chatter'; chatter.setAttribute('aria-hidden','true');
  chatter.innerHTML = '<span>갓 구운 빵 있나요?</span><span>오늘도 좋은 하루!</span>';
  scene.append(chatter);
  const news = document.createElement('div'); news.className='scene-news'; news.innerHTML='<span>동네 소식</span><b data-studio-news></b>'; scene.append(news);
  const update = () => {
    panel.querySelectorAll('.range-line input').forEach(input => input.style.setProperty('--range-fill', `${(Number(input.value)-Number(input.min))/(Number(input.max)-Number(input.min))*100}%`));
    const quantity=Number(panel.querySelector('#quantityRange').value);
    const sold=parseInt(panel.querySelector('[data-sold]').textContent,10);
    const demand=parseInt(panel.querySelector('[data-demand]').textContent,10);
    demandHint.textContent=demand>quantity ? `미충족 수요 ${demand-quantity}개` : '수요를 모두 충족할 수 있어요';
    soldHint.textContent=`수요의 ${demand ? Math.round(sold/demand*100) : 0}% 충족`;
    inventory.querySelector('small').textContent=quantity>sold ? '팔리지 않아도 생산비 발생' : '남는 재고 없음';
    panel.querySelector('[data-studio-inventory]').textContent=`${Math.max(0,quantity-sold)}개`;
    panel.querySelector('[data-studio-news]').textContent=panel.querySelector('[data-event-title]').textContent;
    if (!scene.classList.contains('running')) {
      panel.querySelector('[data-scene-title]').textContent=panel.querySelector('[data-event-title]').textContent;
      panel.querySelector('[data-scene-subtitle]').textContent=panel.querySelector('[data-event-copy]').textContent;
    }
    panel.querySelectorAll('[data-org], [data-sim-strategy]').forEach(button=>button.setAttribute('aria-pressed', String(button.classList.contains('selected'))));
  };
  new MutationObserver(update).observe(panel.querySelector('[data-demand]'),{childList:true,characterData:true,subtree:true});
  new MutationObserver(update).observe(panel.querySelector('[data-sold]'),{childList:true,characterData:true,subtree:true});
  update();
  document.querySelectorAll('.game-tab').forEach(tab=>tab.addEventListener('keydown', e=>{
    const list=[...document.querySelectorAll('.game-tab')]; let next;
    if(e.key==='ArrowRight') next=(list.indexOf(tab)+1)%list.length;
    if(e.key==='ArrowLeft') next=(list.indexOf(tab)+list.length-1)%list.length;
    if(e.key==='Home') next=0; if(e.key==='End') next=list.length-1;
    if(next!==undefined){e.preventDefault();list[next].focus();list[next].click();}
  }));
})();
