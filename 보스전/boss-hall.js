(function(){
  'use strict';

  /* 보스전 홀의 명단.

     64종을 한 줄로 쏟아내면 카드 하나가 390px 라 모바일에서 스크롤이
     2만 픽셀을 넘었다. 그래서 두 가지를 바꿨다.

       ① 과목을 먼저 고른다. 한 화면에 미적분 28종 아니면 기하 36종만 나온다.
       ② 그 안에서 단원으로 나누고, 단원 띠를 눌러 바로 건너뛴다.

     카드도 줄였다. 고유 규칙과 외형 모티프는 보스 자신의 페이지에서
     전투 직전에 다시 말해 주므로, 고르는 자리에서는 코드·이름·스킬만 보인다. */

  const catalog=window.JPBossCatalog;
  if(!catalog)return;
  const bosses=catalog.bosses;
  const SUBJECTS={calculus:'미적분Ⅰ',geometry:'기하'};
  const counts={calculus:bosses.filter(x=>x.subject==='calculus').length,geometry:bosses.filter(x=>x.subject==='geometry').length};
  const playable=bosses.filter(x=>x.status==='playable').length;

  const setAll=(sel,text)=>document.querySelectorAll(sel).forEach(el=>{el.textContent=text});
  setAll('[data-boss-total]',catalog.total);
  setAll('[data-calculus-total]',counts.calculus);
  setAll('[data-geometry-total]',counts.geometry);
  setAll('[data-boss-playable]',playable);

  const grid=document.querySelector('[data-boss-grid]');
  const unitBar=document.querySelector('[data-unit-bar]');
  const tabs=[...document.querySelectorAll('[data-boss-filter]')];
  if(!grid)return;

  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  // 단원 이름을 id 로 쓸 수 없으므로(공백과 한글) 나온 순서로 번호를 준다
  const unitId=(subject,index)=>`unit-${subject}-${index}`;

  // 과목 안에서 단원을 나온 순서대로 모은다. 순서가 곧 교육과정 순서다.
  function groupsOf(filter){
    const list=filter==='all'?bosses:bosses.filter(x=>x.subject===filter);
    const out=[];
    for(const boss of list){
      const key=`${boss.subject}/${boss.unit}`;
      let group=out.find(g=>g.key===key);
      if(!group){group={key,subject:boss.subject,unit:boss.unit,items:[]};out.push(group)}
      group.items.push(boss);
    }
    return out;
  }

  function cardHtml(boss){
    if(boss.status!=='playable'){
      return `<div class="archive-card planned" style="--boss-accent:${esc(boss.palette)}">
        <span class="archive-code">${esc(boss.code)}</span>
        <b>${esc(boss.name)}</b>
        <span class="archive-skill">${esc(boss.skillTitle)}</span>
        <em>제작 예정</em>
      </div>`;
    }
    return `<a class="archive-card" href="${esc(boss.href)}" style="--boss-accent:${esc(boss.palette)}" title="${esc(boss.name)} — ${esc(boss.mechanic)}">
      <span class="archive-code">${esc(boss.code)}</span>
      <b>${esc(boss.name)}</b>
      <span class="archive-skill">${esc(boss.skillTitle)}</span>
    </a>`;
  }

  function render(filter){
    const groups=groupsOf(filter);

    grid.innerHTML=groups.map((g,i)=>`<section class="archive-unit" id="${unitId(g.subject,i)}">
      <header><h3>${esc(g.unit)}</h3><span>${SUBJECTS[g.subject]} · ${g.items.length}종</span></header>
      <div class="archive-cards">${g.items.map(cardHtml).join('')}</div>
    </section>`).join('');

    // 단원 띠. 여기를 누르면 그 단원으로 바로 간다.
    if(unitBar){
      unitBar.innerHTML=groups.map((g,i)=>`<a href="#${unitId(g.subject,i)}">${esc(g.unit)} <i>${g.items.length}</i></a>`).join('');
      unitBar.hidden=groups.length<2;
    }
  }

  /* 건너뛰기는 직접 굴린다.

     주소만 바꿔도 브라우저가 알아서 가야 하지만, 부드러운 스크롤이 켜져 있으면
     이미 굴러가던 스크롤에 묻혀 그대로 서 있는 일이 있었다. 자리 계산은
     CSS 의 scroll-margin-top 이 이미 해 두었으므로 여기서는 굴리기만 한다. */
  if(unitBar){
    unitBar.addEventListener('click',e=>{
      const link=e.target.closest('a[href^="#"]');
      if(!link)return;
      const target=document.getElementById(link.getAttribute('href').slice(1));
      if(!target)return;
      e.preventDefault();
      target.scrollIntoView({block:'start'});
      history.replaceState(null,'',link.getAttribute('href'));
    });
  }

  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    tabs.forEach(x=>{const active=x===tab;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active))});
    render(tab.dataset.bossFilter);
    // 과목을 바꾸면 명단 첫머리로 돌려 놓는다. 안 그러면 아까 보던 자리에
    // 남아 다른 과목의 한복판이 열린다.
    const roster=document.querySelector('.boss-roadmap');
    if(roster&&roster.getBoundingClientRect().top<0)roster.scrollIntoView({block:'start'});
  }));

  const first=tabs.find(x=>x.classList.contains('active'))||tabs[0];
  render(first?first.dataset.bossFilter:'calculus');
})();
