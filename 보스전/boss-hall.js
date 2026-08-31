(function(){
  'use strict';
  const catalog=window.JPBossCatalog;
  if(!catalog)return;
  const bosses=catalog.bosses;
  const counts={calculus:bosses.filter(x=>x.subject==='calculus').length,geometry:bosses.filter(x=>x.subject==='geometry').length};
  document.querySelectorAll('[data-boss-total]').forEach(el=>{el.textContent=catalog.total});
  document.querySelectorAll('[data-calculus-total]').forEach(el=>{el.textContent=counts.calculus});
  document.querySelectorAll('[data-geometry-total]').forEach(el=>{el.textContent=counts.geometry});

  const grid=document.querySelector('[data-boss-grid]');
  const tabs=[...document.querySelectorAll('[data-boss-filter]')];
  if(!grid)return;

  function render(filter='all'){
    const list=filter==='all'?bosses:bosses.filter(x=>x.subject===filter);
    grid.innerHTML=list.map((boss,index)=>`<article class="archive-card ${boss.status}" style="--boss-accent:${boss.palette}">
      <div class="archive-number">${String(index+1).padStart(2,'0')}</div>
      <div class="archive-meta"><span>${boss.subject==='calculus'?'미적분Ⅰ':'기하'} · ${boss.code}</span><b>${boss.status==='playable'?'PLAYABLE':'설계 확정'}</b></div>
      <h3>${boss.name}</h3>
      <p>${boss.skillTitle}</p>
      <dl><div><dt>고유 규칙</dt><dd>${boss.mechanic}</dd></div><div><dt>외형 모티프</dt><dd>${boss.visual}</dd></div></dl>
      ${boss.status==='playable'?`<a href="${boss.href}">지금 전투하기 <span>→</span></a>`:'<button type="button" disabled>순차 제작 예정</button>'}
    </article>`).join('');
  }

  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    tabs.forEach(x=>{const active=x===tab;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active))});
    render(tab.dataset.bossFilter);
  }));
  render();
})();
