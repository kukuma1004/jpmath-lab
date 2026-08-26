(function(){
  'use strict';
  const G=window.GeoLab,lab=document.querySelector('[data-page="lab"]'),oldSvg=document.getElementById('genericLabSvg');
  if(!G||!lab||!oldSvg)return;

  lab.classList.add('dot-direct-lab');
  lab.querySelector('.eyebrow').textContent='벡터의 내적 LAB · DIRECT MANIPULATION';
  lab.querySelector('h1').textContent='두 화살표의 방향 관계를 하나의 수로 읽어 보세요';
  lab.querySelector('.desc').textContent='두 끝점을 직접 끌면 성분 계산, 사이각, 정사영과 내적의 부호가 같은 순간 함께 변합니다. 영벡터에서는 각과 수직을 말할 수 없다는 점도 확인해 보세요.';

  const layout=lab.querySelector('.lab-layout'),visual=layout.querySelector('.visual-card'),readouts=layout.querySelector('[data-readouts]'),controls=layout.querySelector('[data-controls]');
  const tabs=document.createElement('div');
  tabs.className='dot-mission-tabs';
  tabs.setAttribute('role','tablist');
  tabs.setAttribute('aria-label','벡터의 내적 실험 모드');
  tabs.innerHTML='<button type="button" class="dot-mission-tab active" data-dot-mission="free">자유 실험</button><button type="button" class="dot-mission-tab" data-dot-mission="perp">수직 만들기</button><button type="button" class="dot-mission-tab" data-dot-mission="target">목표 내적</button><button type="button" class="dot-mission-tab" data-dot-mission="sign">부호 미션</button>';
  const brief=document.createElement('div');
  brief.className='dot-mission-brief';
  brief.setAttribute('aria-live','polite');
  brief.innerHTML='<div class="dot-mission-kicker" data-dot-kicker>FREE LAB</div><div class="dot-mission-copy"><div><strong data-dot-title>두 벡터를 직접 움직여 보세요.</strong><p data-dot-copy>파랑 벡터가 빨강 벡터와 같은 쪽을 향할수록 내적은 양수가 됩니다.</p></div><button type="button" class="dot-next hidden" data-dot-next>다음 목표</button></div><div class="dot-meter" data-dot-meter></div>';
  layout.before(tabs,brief);

  const svg=oldSvg.cloneNode(false);
  oldSvg.replaceWith(svg);
  svg.classList.add('dot-direct-stage');
  svg.setAttribute('aria-label','두 벡터의 끝점을 끌어 내적과 사이각을 확인하는 좌표 실험');
  visual.classList.add('dot-stage-card');
  const guide=document.createElement('div');
  guide.className='dot-drag-guide';
  guide.innerHTML='<span>●</span> 빨강과 파랑 끝점을 직접 끌어 보세요';
  visual.prepend(guide);
  const legend=visual.querySelector('.legend');
  if(legend)legend.innerHTML='<span><i class="swatch" style="background:#c1442d"></i>벡터 a</span><span><i class="swatch" style="background:#2b6ca3"></i>벡터 b</span><span><i class="swatch" style="background:#7557a8"></i>b의 정사영</span>';

  readouts.classList.add('dot-readout');
  readouts.innerHTML='<div class="readout-box"><div class="readout-label">두 벡터</div><div class="readout-value" id="dotVectors"></div></div><div class="readout-box"><div class="readout-label">성분으로 계산</div><div class="readout-value" id="dotComponents"></div></div><div class="readout-box"><div class="readout-label">길이와 사이각</div><div class="readout-value" id="dotAngleForm"></div></div><div class="readout-box"><div class="readout-label">사이각</div><div class="readout-value" id="dotAngle"></div></div><div class="readout-box"><div class="readout-label">부호 해석</div><div class="readout-value dot-sign-word" id="dotSign"></div></div>';
  controls.className='dot-controls';
  controls.innerHTML='<button type="button" class="dot-reset" data-dot-reset>처음 벡터로 되돌리기</button>';

  const colors={a:'#c1442d',b:'#2b6ca3',projection:'#7557a8',positive:'#2f7d58',negative:'#c1442d'};
  const targetDots=[6,-4,8,-6,3,0],targetSigns=['negative','zero','positive'];
  const state={a:[4,1],b:[2,3],mission:'free',missionIndex:0,targetDot:6,targetSign:'negative',trails:{a:[],b:[]}};
  let dragging=null;

  function dot(){return state.a[0]*state.b[0]+state.a[1]*state.b[1];}
  function lengths(){return[Math.hypot.apply(null,state.a),Math.hypot.apply(null,state.b)];}
  function angle(){const lens=lengths(),den=lens[0]*lens[1];return den?Math.acos(G.clamp(dot()/den,-1,1))*180/Math.PI:null;}
  function signName(value){return value>0?'positive':value<0?'negative':'zero';}
  function signKorean(name){return name==='positive'?'양수 · 예각':name==='negative'?'음수 · 둔각':'0 · 직각';}
  function fmt(v){return '('+v.join(', ')+')';}
  function signed(v){return v<0?'('+v+')':String(v);}
  function add(tag,attrs,text){const node=G.s(tag,attrs,text);svg.appendChild(node);return node;}
  function math(id,tex){const el=document.getElementById(id);if(window.katex){try{window.katex.render(tex,el,{displayMode:false,throwOnError:false,strict:false});return;}catch(error){console.warn('[Dot Lab] 수식을 일반 텍스트로 표시합니다.',error);}}el.textContent=tex;}

  function defs(){
    const node=G.s('defs');
    [['dotArrowA',colors.a],['dotArrowB',colors.b],['dotProjection',colors.projection]].forEach(function(pair){const marker=G.s('marker',{id:pair[0],viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'});marker.appendChild(G.s('path',{d:'M0 0L10 5L0 10Z',fill:pair[1]}));node.appendChild(marker);});
    const glow=G.s('filter',{id:'dotGlow',x:'-90%',y:'-90%',width:'280%',height:'280%'});glow.appendChild(G.s('feGaussianBlur',{stdDeviation:5,result:'blur'}));const merge=G.s('feMerge');merge.appendChild(G.s('feMergeNode',{in:'blur'}));merge.appendChild(G.s('feMergeNode',{in:'SourceGraphic'}));glow.appendChild(merge);node.appendChild(glow);svg.appendChild(node);
  }

  function trail(g,list,color){list.forEach(function(p,i){add('circle',{cx:g.sx(p[0]),cy:g.sy(p[1]),r:2.5+i*.5,fill:color,opacity:(i+1)/(list.length+1)*.3,'pointer-events':'none'});});}
  function arrow(g,name,p,color,marker){
    add('line',{x1:g.sx(0),y1:g.sy(0),x2:g.sx(p[0]),y2:g.sy(p[1]),stroke:color,'stroke-width':4,'stroke-linecap':'round','marker-end':'url(#'+marker+')','pointer-events':'none'});
    add('circle',{cx:g.sx(p[0]),cy:g.sy(p[1]),r:44,fill:'transparent',stroke:'transparent','data-dot-vector':name,class:'dot-hit-area',tabindex:0,role:'slider','aria-label':'벡터 '+name+' 끝점 '+fmt(p),'aria-valuetext':fmt(p)});
    add('circle',{cx:g.sx(p[0]),cy:g.sy(p[1]),r:17,fill:color,opacity:.2,'data-dot-vector':name,class:'dot-halo',filter:'url(#dotGlow)'});
    add('circle',{cx:g.sx(p[0]),cy:g.sy(p[1]),r:11,fill:color,stroke:'#fff','stroke-width':3,'data-dot-vector':name,class:'dot-handle'});
    add('circle',{cx:g.sx(p[0]),cy:g.sy(p[1]),r:3,fill:'#fff','pointer-events':'none'});
    add('text',{x:g.sx(p[0])+12,y:g.sy(p[1])-12,fill:color,'font-size':14,'font-weight':900,'pointer-events':'none'},name);
  }

  function separator(g){
    const la=Math.hypot.apply(null,state.a);if(!la)return;
    const u=[state.a[0]/la,state.a[1]/la],perp=[-u[1],u[0]];
    add('line',{x1:g.sx(-perp[0]*8),y1:g.sy(-perp[1]*8),x2:g.sx(perp[0]*8),y2:g.sy(perp[1]*8),stroke:'#9aaba4','stroke-width':1.5,'stroke-dasharray':'6 6','pointer-events':'none'});
    add('text',{x:g.sx(u[0]*4),y:g.sy(u[1]*4)-8,fill:colors.positive,'font-size':10,'font-weight':800,'text-anchor':'middle','pointer-events':'none'},'내적 +');
    add('text',{x:g.sx(-u[0]*4),y:g.sy(-u[1]*4)-8,fill:colors.negative,'font-size':10,'font-weight':800,'text-anchor':'middle','pointer-events':'none'},'내적 −');
  }

  function projection(g){
    const aa=state.a[0]*state.a[0]+state.a[1]*state.a[1];if(!aa)return;
    const scale=dot()/aa,foot=[scale*state.a[0],scale*state.a[1]];
    add('line',{x1:g.sx(state.b[0]),y1:g.sy(state.b[1]),x2:g.sx(foot[0]),y2:g.sy(foot[1]),stroke:colors.projection,'stroke-width':2,'stroke-dasharray':'6 5','pointer-events':'none'});
    add('line',{x1:g.sx(0),y1:g.sy(0),x2:g.sx(foot[0]),y2:g.sy(foot[1]),stroke:colors.projection,'stroke-width':4,'stroke-linecap':'round','marker-end':'url(#dotProjection)','pointer-events':'none'});
    add('circle',{cx:g.sx(foot[0]),cy:g.sy(foot[1]),r:4,fill:colors.projection,'pointer-events':'none'});
  }

  function angleArc(g){
    const theta=angle(),lens=lengths();if(theta===null||!lens[0]||!lens[1])return;
    const start=Math.atan2(state.a[1],state.a[0]);let delta=Math.atan2(state.a[0]*state.b[1]-state.a[1]*state.b[0],dot());
    const radius=.9,steps=28;let path='';
    for(let i=0;i<=steps;i++){const t=start+delta*i/steps,x=radius*Math.cos(t),y=radius*Math.sin(t);path+=(i?'L':'M')+g.sx(x)+' '+g.sy(y);}
    add('path',{d:path,fill:'none',stroke:'#d29a35','stroke-width':3,'stroke-linecap':'round','pointer-events':'none'});
    const mid=start+delta/2;add('text',{x:g.sx(1.2*Math.cos(mid)),y:g.sy(1.2*Math.sin(mid))-5,fill:'#9b6817','font-size':11,'font-weight':900,'text-anchor':'middle','pointer-events':'none'},theta.toFixed(1)+'°');
  }

  function draw(){
    G.clear(svg);const g=G.cartesian(svg,{xmin:-6,xmax:6,ymin:-5,ymax:5});g.grid();defs();separator(g);trail(g,state.trails.a,colors.a);trail(g,state.trails.b,colors.b);projection(g);angleArc(g);arrow(g,'a',state.a,colors.a,'dotArrowA');arrow(g,'b',state.b,colors.b,'dotArrowB');add('circle',{cx:g.sx(0),cy:g.sy(0),r:5,fill:'#17211e','pointer-events':'none'});
  }

  function isSuccess(value,theta){
    const lens=lengths();
    if(state.mission==='perp')return value===0&&lens[0]>0&&lens[1]>0;
    if(state.mission==='target')return value===state.targetDot;
    if(state.mission==='sign')return signName(value)===state.targetSign&&(state.targetSign!=='zero'||(lens[0]>0&&lens[1]>0&&theta!==null));
    return false;
  }

  function updateMission(value,theta,success){
    const kicker=brief.querySelector('[data-dot-kicker]'),title=brief.querySelector('[data-dot-title]'),copy=brief.querySelector('[data-dot-copy]'),next=brief.querySelector('[data-dot-next]'),meter=brief.querySelector('[data-dot-meter]'),currentSign=signName(value);
    next.classList.toggle('hidden',state.mission==='free');brief.classList.toggle('success',success);svg.classList.toggle('mission-success',success);
    if(state.mission==='free'){
      kicker.textContent='FREE LAB · '+(theta===null?'ANGLE UNDEFINED':currentSign.toUpperCase());
      title.textContent=theta===null?'영벡터에서는 사이각을 정할 수 없습니다.':currentSign==='positive'?'두 벡터가 예각을 이루고 있습니다.':currentSign==='negative'?'두 벡터가 둔각을 이루고 있습니다.':'내적이 0입니다.';
      copy.textContent=theta===null?'한 벡터의 끝점을 원점 밖으로 옮기면 각과 방향 관계가 다시 나타납니다.':'파란 끝점을 점선 경계 너머로 옮기며 내적의 부호가 바뀌는 순간을 찾아보세요.';meter.style.width='0%';
    }else if(state.mission==='perp'){
      const gap=theta===null?90:Math.abs(90-theta);kicker.textContent=success?'90° LOCKED':'PERPENDICULAR';title.textContent=success?'내적이 0이고 두 벡터가 수직입니다!':'두 벡터의 사이각을 정확히 90°로 만드세요.';copy.textContent=success?'두 벡터가 영벡터가 아니므로 내적 0과 수직을 연결할 수 있습니다.':'현재 내적 '+value+' · 90°까지 '+gap.toFixed(1)+'° 남았습니다.';meter.style.width=(success?100:Math.max(5,100-gap/90*100))+'%';
    }else if(state.mission==='target'){
      const diff=Math.abs(value-state.targetDot);kicker.textContent=success?'DOT LOCKED':'TARGET DOT';title.textContent=success?'목표 내적 '+state.targetDot+'을 만들었습니다!':'두 벡터의 내적을 '+state.targetDot+'으로 만드세요.';copy.textContent=success?'같은 내적을 만드는 서로 다른 두 벡터도 찾을 수 있습니다.':'현재 내적 '+value+' · 목표와의 차이 '+diff+'. 두 끝점을 모두 움직여 보세요.';meter.style.width=(success?100:Math.max(5,100-diff/18*100))+'%';
    }else{
      const targetLabel=state.targetSign==='positive'?'양수':state.targetSign==='negative'?'음수':'0(수직)',currentLabel=theta===null&&value===0?'0 · 영벡터(수직 판단 불가)':signKorean(currentSign);kicker.textContent=success?'SIGN FOUND':'SIGN MISSION';title.textContent=success?'내적이 '+targetLabel+'가 되는 방향을 찾았습니다!':'내적이 '+targetLabel+'가 되도록 벡터 b를 옮기세요.';copy.textContent=success?'성분 계산을 하지 않아도 사이각과 점선 경계로 부호를 예측할 수 있습니다.':'현재 '+currentLabel+' · 영벡터로 0을 만드는 것은 수직 정답으로 인정하지 않습니다.';meter.style.width=(success?100:12)+'%';
    }
  }

  function render(focusVector){
    draw();const value=dot(),theta=angle(),lens=lengths(),currentSign=signName(value),success=isSuccess(value,theta);
    math('dotVectors','\\vec a='+fmt(state.a)+',\\quad \\vec b='+fmt(state.b));
    math('dotComponents','\\vec a\\cdot\\vec b='+signed(state.a[0])+'\\cdot '+signed(state.b[0])+'+'+signed(state.a[1])+'\\cdot '+signed(state.b[1])+'='+value);
    math('dotAngleForm',theta===null?'\\text{영벡터가 포함되어 }\\theta\\text{는 정의되지 않음}':'|\\vec a||\\vec b|\\cos\\theta='+lens[0].toFixed(2)+'\\times '+lens[1].toFixed(2)+'\\times \\cos\\theta='+value);
    math('dotAngle',theta===null?'\\text{정의되지 않음}':'\\theta\\approx '+theta.toFixed(1)+'^\\circ');
    document.getElementById('dotSign').textContent=theta===null&&value===0?'0 · 영벡터가 포함되어 수직 판단 불가':signKorean(currentSign);readouts.dataset.dotSign=currentSign;updateMission(value,theta,success);
    if(focusVector)requestAnimationFrame(function(){const target=svg.querySelector('.dot-hit-area[data-dot-vector="'+focusVector+'"]');if(target)target.focus();});
  }

  function setupMission(name){
    state.mission=name;state.trails={a:[],b:[]};
    if(name==='free'){state.a=[4,1];state.b=[2,3];}
    if(name==='perp'){state.a=[3,1];state.b=[2,3];}
    if(name==='target'){state.a=[3,1];state.b=[1,2];state.targetDot=targetDots[state.missionIndex%targetDots.length];}
    if(name==='sign'){state.a=[4,1];state.b=[1,3];state.targetSign=targetSigns[state.missionIndex%targetSigns.length];}
    tabs.querySelectorAll('[data-dot-mission]').forEach(function(button){const active=button.dataset.dotMission===name;button.classList.toggle('active',active);button.setAttribute('aria-selected',active?'true':'false');});render();
  }

  tabs.querySelectorAll('[data-dot-mission]').forEach(function(button){button.addEventListener('click',function(){state.missionIndex=0;setupMission(button.dataset.dotMission);});});
  brief.querySelector('[data-dot-next]').addEventListener('click',function(){state.missionIndex++;setupMission(state.mission);});
  controls.querySelector('[data-dot-reset]').addEventListener('click',function(){setupMission(state.mission);});

  function moveVector(name,next,keepFocus){if(next[0]===state[name][0]&&next[1]===state[name][1])return;state.trails[name].push(state[name].slice());state.trails[name]=state.trails[name].slice(-7);state[name]=next;render(keepFocus?name:null);}
  svg.addEventListener('pointerdown',function(event){const name=event.target.dataset.dotVector;if(!name)return;dragging=name;svg.setPointerCapture(event.pointerId);svg.classList.add('is-dragging');});
  svg.addEventListener('pointermove',function(event){if(!dragging)return;const rect=svg.getBoundingClientRect(),px=(event.clientX-rect.left)/rect.width*640,py=(event.clientY-rect.top)/rect.height*400,g=G.cartesian(svg,{xmin:-6,xmax:6,ymin:-5,ymax:5}),next=[G.clamp(Math.round(g.xOf(px)),-5,5),G.clamp(Math.round(g.yOf(py)),-4,4)];moveVector(dragging,next,false);});
  function endDrag(){dragging=null;svg.classList.remove('is-dragging');}
  svg.addEventListener('pointerup',endDrag);svg.addEventListener('pointercancel',endDrag);
  svg.addEventListener('keydown',function(event){const name=event.target.dataset.dotVector;if(!name||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();const next=state[name].slice();if(event.key==='ArrowLeft')next[0]--;if(event.key==='ArrowRight')next[0]++;if(event.key==='ArrowUp')next[1]++;if(event.key==='ArrowDown')next[1]--;next[0]=G.clamp(next[0],-5,5);next[1]=G.clamp(next[1],-4,4);moveVector(name,next,true);});
  document.addEventListener('jp:math-ready',function(){render();},{once:true});
  setupMission('free');
})();
