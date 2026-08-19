(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const KEY='jp_geo_skill_ellipse_abc_v1';
  let saved={bestRush:0,bossClears:0,drillBest:0};
  try{saved={...saved,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(e){}};
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const uniqueChoices=(correct,wrong)=>shuffle([...new Set([String(correct),...wrong.map(String)])].slice(0,4));
  const triples=[[5,4,3],[5,3,4],[10,8,6],[10,6,8],[13,12,5],[13,5,12]];
  const pickTriple=()=>triples[Math.floor(Math.random()*triples.length)];
  const fmtRoot=n=>Number.isInteger(Math.sqrt(n))?String(Math.sqrt(n)):`√${n}`;

  function updateMastery(){
    const levels=(saved.drillBest>=3?1:0)+(saved.drillBest===5?1:0)+(saved.bestRush>=600?1:0)+(saved.bestRush>=1200?1:0)+(saved.bossClears>0?1:0);
    $('[data-mastery-stars]').textContent='★'.repeat(levels)+'☆'.repeat(5-levels);
    $('[data-mastery-note]').textContent=levels===0?'첫 도전을 기다리는 중':levels===5?'완전 정복! 다음 스킬 준비 완료':`5단계 중 ${levels}단계 달성`;
    $('[data-rush-best]').textContent=saved.bestRush;
    $('[data-boss-clears]').textContent=saved.bossClears;
  }

  function showPanel(id){
    if(typeof rush!=='undefined'&&rush.running&&id!=='rush')finishRush();
    $$('[data-skill-panel]').forEach(p=>p.classList.toggle('hidden',p.dataset.skillPanel!==id));
    $$('[data-skill-tab]').forEach(b=>b.classList.toggle('active',b.dataset.skillTab===id));
    window.scrollTo({top:0,behavior:'smooth'});
  }
  $$('[data-skill-tab]').forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.skillTab)));
  $$('[data-launch]').forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.launch)));

  function drawEllipse(svg,a,b,focus=true){
    const W=680,H=430,c=Math.sqrt(a*a-b*b),sx=Math.min(48,260/a),sy=Math.min(42,150/b),cx=W/2,cy=H/2;
    svg.innerHTML='';
    const ns='http://www.w3.org/2000/svg', el=(n,attrs,text)=>{const x=document.createElementNS(ns,n);Object.entries(attrs||{}).forEach(([k,v])=>x.setAttribute(k,v));if(text)x.textContent=text;svg.appendChild(x);return x};
    el('rect',{x:0,y:0,width:W,height:H,rx:20,fill:'#F8FAF9'});
    for(let x=52;x<W;x+=42)el('line',{x1:x,y1:25,x2:x,y2:H-25,stroke:'#E6ECE9','stroke-width':1});
    for(let y=47;y<H;y+=42)el('line',{x1:25,y1:y,x2:W-25,y2:y,stroke:'#E6ECE9','stroke-width':1});
    el('line',{x1:30,y1:cy,x2:W-30,y2:cy,stroke:'#91A09A','stroke-width':1.4});el('line',{x1:cx,y1:25,x2:cx,y2:H-25,stroke:'#91A09A','stroke-width':1.4});
    el('ellipse',{cx,cy,rx:a*sx,ry:b*sy,fill:'#7557A8','fill-opacity':.08,stroke:'#7557A8','stroke-width':4});
    el('line',{x1:cx,y1:cy,x2:cx+a*sx,y2:cy,stroke:'#C1442D','stroke-width':5,'stroke-linecap':'round'});
    el('line',{x1:cx,y1:cy,x2:cx,y2:cy-b*sy,stroke:'#2B6CA3','stroke-width':5,'stroke-linecap':'round'});
    if(focus){el('line',{x1:cx,y1:cy+18,x2:cx+c*sx,y2:cy+18,stroke:'#C58B25','stroke-width':4,'stroke-linecap':'round'});[-1,1].forEach(s=>el('circle',{cx:cx+s*c*sx,cy,r:7,fill:'#C58B25',stroke:'#fff','stroke-width':3}));}
    el('circle',{cx,cy,r:5,fill:'#1E2B26'});el('text',{x:cx+a*sx/2,y:cy-10,fill:'#C1442D','font-size':15,'font-weight':700,'text-anchor':'middle'},'a');el('text',{x:cx+12,y:cy-b*sy/2,fill:'#2B6CA3','font-size':15,'font-weight':700},'b');
    if(focus)el('text',{x:cx+c*sx/2,y:cy+40,fill:'#9A6A15','font-size':15,'font-weight':700,'text-anchor':'middle'},'c');
  }

  const aRange=$('[data-a-range]'),bRange=$('[data-b-range]');
  function renderConcept(){
    const a=+aRange.value;if(+bRange.value>=a)bRange.value=a-1;bRange.max=a-1;const b=+bRange.value,c2=a*a-b*b;
    $('[data-a-value]').textContent=a;$('[data-b-value]').textContent=b;$('[data-a2]').textContent=a*a;$('[data-b2]').textContent=b*b;$('[data-c2]').textContent=c2;
    $('[data-equation-readout]').textContent=`x²/${a*a} + y²/${b*b} = 1`;
    $('[data-focus-readout]').textContent=`따라서 c=${fmtRoot(c2)}, 초점은 (±${fmtRoot(c2)}, 0)`;
    drawEllipse($('#ellipseSkillSvg'),a,b,true);
  }
  aRange.addEventListener('input',renderConcept);bRange.addEventListener('input',renderConcept);renderConcept();

  function makeQuestion(){
    const [a,b,c]=pickTriple(),type=Math.floor(Math.random()*5),a2=a*a,b2=b*b,c2=c*c;
    if(type===0)return{type:'C² CALC',equation:`x²/${a2} + y²/${b2} = 1`,prompt:'c²의 값은?',correct:c2,choices:uniqueChoices(c2,[a2+b2,a2-b,c,2*a]),explanation:`c²=a²−b²=${a2}−${b2}=${c2}`,a,b};
    if(type===1)return{type:'FOCUS',equation:`x²/${a2} + y²/${b2} = 1`,prompt:'양의 x축 위 초점의 x좌표는?',correct:c,choices:uniqueChoices(c,[c2,b,a]),explanation:`c=√(${a2}−${b2})=${c}`,a,b};
    if(type===2)return{type:'DISTANCE SUM',equation:`x²/${a2} + y²/${b2} = 1`,prompt:'타원 위 점 P에 대하여 PF₁+PF₂는?',correct:2*a,choices:uniqueChoices(2*a,[a,2*b,2*c]),explanation:`두 초점까지 거리의 합은 장축의 길이 2a=${2*a}`,a,b};
    if(type===3)return{type:'READ A',equation:`x²/${a2} + y²/${b2} = 1`,prompt:'장반경 a의 값은?',correct:a,choices:uniqueChoices(a,[a2,b,c]),explanation:`큰 분모 ${a2}=a²이므로 a=${a}`,a,b};
    return{type:'REVERSE',equation:`a²=${a2}, c²=${c2}`,prompt:'단반경 b의 값은?',correct:b,choices:uniqueChoices(b,[b2,c,a]),explanation:`b²=a²−c²=${a2}−${c2}=${b2}, 따라서 b=${b}`,a,b};
  }

  function fillAnswers(box,q,onAnswer){
    box.innerHTML='';q.choices.forEach(choice=>{const b=document.createElement('button');b.className='answer-btn';b.textContent=choice;b.addEventListener('click',()=>onAnswer(choice,b));box.appendChild(b)});
  }

  let drill={active:false,index:0,correct:0,q:null};
  function startDrill(){drill={active:true,index:0,correct:0,q:null};$('[data-drill-start]').classList.add('hidden');$('[data-drill-result]').classList.add('hidden');nextDrill()}
  function nextDrill(){
    if(drill.index>=5){finishDrill();return}drill.q=makeQuestion();$('[data-drill-progress]').textContent=`${drill.index+1} / 5`;$('[data-drill-score]').textContent=`정답 ${drill.correct}`;$('[data-drill-type]').textContent=drill.q.type;$('[data-drill-equation]').textContent=drill.q.equation;$('[data-drill-prompt]').textContent=drill.q.prompt;$('[data-drill-feedback]').className='answer-feedback hidden';
    fillAnswers($('[data-drill-answers]'),drill.q,(choice,btn)=>{const ok=String(choice)===String(drill.q.correct);$$('.answer-btn',$('[data-drill-answers]')).forEach(x=>{x.disabled=true;if(x.textContent===String(drill.q.correct))x.classList.add('correct')});if(!ok)btn.classList.add('wrong');if(ok)drill.correct++;const fb=$('[data-drill-feedback]');fb.textContent=(ok?'정답! ':'다시 기억하기: ')+drill.q.explanation;fb.className='answer-feedback '+(ok?'good':'bad');drill.index++;setTimeout(nextDrill,750)});
  }
  function finishDrill(){saved.drillBest=Math.max(saved.drillBest,drill.correct);save();updateMastery();const box=$('[data-drill-result]');box.innerHTML=`<strong>${drill.correct} / 5</strong><p>${drill.correct===5?'계산 루틴 완성! 이제 60초 압박에서도 유지해보세요.':drill.correct>=3?'좋습니다. 틀린 유형을 확인하고 한 번 더 도전해보세요.':'원리 탭에서 a²=b²+c² 관계를 다시 확인해보세요.'}</p><button data-retry-drill>다시 훈련</button>`;box.classList.remove('hidden');$('[data-retry-drill]',box).addEventListener('click',startDrill)}
  $('[data-drill-start]').addEventListener('click',startDrill);

  let rush={running:false,time:60,score:0,combo:0,correct:0,q:null,last:0,raf:0};
  function startRush(){rush={running:true,time:60,score:0,combo:0,correct:0,q:null,last:performance.now(),raf:0};$('[data-rush-start]').classList.add('hidden');$('[data-rush-result]').classList.add('hidden');nextRush();rush.raf=requestAnimationFrame(tickRush)}
  function tickRush(now){if(!rush.running)return;const dt=(now-rush.last)/1000;rush.last=now;rush.time=Math.max(0,rush.time-dt);renderRushHud();if(rush.time<=0){finishRush();return}rush.raf=requestAnimationFrame(tickRush)}
  function renderRushHud(){$('[data-rush-time]').textContent=rush.time.toFixed(1);$('[data-rush-score]').textContent=rush.score;$('[data-rush-combo]').textContent=`×${1+Math.floor(rush.combo/3)*.5}`;$('[data-rush-bar]').style.width=`${rush.time/60*100}%`}
  function nextRush(){if(!rush.running)return;rush.q=makeQuestion();$('[data-rush-question]').innerHTML=`<div class="rush-eq">${rush.q.equation}</div><div class="rush-prompt">${rush.q.prompt}</div>`;fillAnswers($('[data-rush-answers]'),rush.q,(choice)=>{if(!rush.running)return;const ok=String(choice)===String(rush.q.correct);if(ok){rush.combo++;rush.correct++;rush.score+=100+Math.min(300,rush.combo*20)}else{rush.combo=0;rush.time=Math.max(0,rush.time-2)}flashRush(ok);renderRushHud();nextRush()})}
  function flashRush(ok){const f=$('[data-rush-flash]');f.textContent=ok?'+ SCORE':'− 2 SEC';f.className=`rush-flash show ${ok?'good':'bad'}`;setTimeout(()=>f.className='rush-flash',340)}
  function finishRush(){rush.running=false;cancelAnimationFrame(rush.raf);saved.bestRush=Math.max(saved.bestRush,rush.score);save();updateMastery();$('[data-rush-answers]').innerHTML='';$('[data-rush-question]').innerHTML='<span class="rush-ready-icon">🏁</span><h2>러시 종료!</h2>';const box=$('[data-rush-result]');box.innerHTML=`<strong>${rush.score}점</strong><p>${rush.correct}문제 성공 · 최고 기록 ${saved.bestRush}점</p><button data-retry-rush>다시 도전</button>`;box.classList.remove('hidden');$('[data-retry-rush]',box).addEventListener('click',startRush)}
  $('[data-rush-start]').addEventListener('click',startRush);

  let bossQ;
  function newBoss(){const [a,b,c]=pickTriple();bossQ={a,b,c,a2:a*a,b2:b*b,c2:c*c};$('[data-boss-equation]').textContent=`x²/${bossQ.a2} + y²/${bossQ.b2} = 1`;$$('.boss-steps input').forEach(x=>{x.value='';x.classList.remove('correct','wrong')});$('[data-boss-feedback]').className='boss-feedback hidden';drawEllipse($('#bossEllipseSvg'),a,b,false)}
  $('[data-boss-check]').addEventListener('click',()=>{const fields=[$('[data-boss-c2]'),$('[data-boss-c]'),$('[data-boss-sum]')],answers=[bossQ.c2,bossQ.c,2*bossQ.a],ok=fields.every((f,i)=>+f.value===answers[i]);fields.forEach((f,i)=>f.classList.toggle('correct',+f.value===answers[i]));fields.forEach((f,i)=>f.classList.toggle('wrong',+f.value!==answers[i]));const fb=$('[data-boss-feedback]');if(ok){saved.bossClears++;save();updateMastery();fb.innerHTML=`<b>보스 클리어!</b><br>c²=${bossQ.a2}−${bossQ.b2}=${bossQ.c2}, c=${bossQ.c}, 거리의 합 2a=${2*bossQ.a}<br><button class="mini-retry" data-new-boss>새 보스 소환</button>`;fb.className='boss-feedback clear'}else{fb.innerHTML=`<b>아직 클리어가 아닙니다.</b><br>① c²=a²−b² → ② c=√c² → ③ PF₁+PF₂=2a 순서로 다시 확인하세요.`;fb.className='boss-feedback fail'}const next=$('[data-new-boss]',fb);if(next)next.addEventListener('click',newBoss)});

  updateMastery();newBoss();
})();
