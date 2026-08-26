(function(){
  'use strict';
  const G=window.GeoLab,lab=document.querySelector('[data-page="lab"]'),oldSvg=document.getElementById('genericLabSvg');
  if(!G||!lab||!oldSvg)return;

  lab.classList.add('line-direct-lab');
  lab.querySelector('.eyebrow').textContent='벡터 직선 LAB · DIRECT MANIPULATION';
  lab.querySelector('h1').textContent='한 점과 한 방향으로 직선 전체를 만들어 보세요';
  lab.querySelector('.desc').textContent='기준점 P와 방향 끝점 D를 움직여 직선을 만들고, 초록 점 X(t)를 끌어 매개변수 t가 직선 전체를 훑는 과정을 확인하세요. 3차원에서는 이동 평면과 관찰 방향도 바꿀 수 있습니다.';

  const layout=lab.querySelector('.lab-layout'),visual=layout.querySelector('.visual-card'),readouts=layout.querySelector('[data-readouts]'),controls=layout.querySelector('[data-controls]'),oldChips=lab.querySelector('[data-mode-chips]'),chips=oldChips.cloneNode(false);
  oldChips.replaceWith(chips);
  chips.innerHTML='<button type="button" class="chip active" data-line-mode="2d">좌표평면</button><button type="button" class="chip" data-line-mode="3d">좌표공간</button>';

  const tabs=document.createElement('div');
  tabs.className='line-mission-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','벡터 직선 실험 모드');
  tabs.innerHTML='<button type="button" class="line-mission-tab active" data-line-mission="free">자유 탐구</button><button type="button" class="line-mission-tab" data-line-mission="point">목표점 통과</button><button type="button" class="line-mission-tab" data-line-mission="same">같은 직선</button><button type="button" class="line-mission-tab" data-line-mission="space">3차원 직선</button>';
  const brief=document.createElement('div');
  brief.className='line-mission-brief';brief.setAttribute('aria-live','polite');
  brief.innerHTML='<div class="line-mission-kicker" data-line-kicker>FREE LAB</div><div class="line-mission-copy"><div><strong data-line-title>P, D, X(t)를 직접 움직여 보세요.</strong><p data-line-copy>D−P가 방향벡터가 되고 X(t)는 같은 직선 위를 움직입니다.</p></div><button type="button" class="line-next hidden" data-line-next>다음 목표</button></div><div class="line-meter" data-line-meter></div>';
  const planeBar=document.createElement('div');
  planeBar.className='line-plane-bar hidden';
  planeBar.innerHTML='<div class="line-plane-buttons" role="group" aria-label="3차원 점 이동 평면"><button type="button" class="line-plane-button" data-line-plane="xy">xy 평면</button><button type="button" class="line-plane-button active" data-line-plane="xz">xz 평면</button><button type="button" class="line-plane-button" data-line-plane="yz">yz 평면</button></div><span class="line-plane-note">점은 선택한 평면에서 이동하고, 빈 공간을 끌면 시점이 회전합니다.</span>';
  chips.before(tabs,brief);chips.after(planeBar);

  const svg=oldSvg.cloneNode(false);oldSvg.replaceWith(svg);svg.classList.add('line-direct-stage');svg.classList.remove('orbit');svg.setAttribute('aria-label','기준점과 방향벡터, 매개점을 직접 움직이는 벡터 직선 실험');
  visual.classList.add('line-stage-card');const guide=document.createElement('div');guide.className='line-drag-guide';guide.innerHTML='<span>●</span> P·D·X(t)를 직접 끌어 보세요';visual.prepend(guide);
  const legend=visual.querySelector('.legend');if(legend)legend.innerHTML='<span><i class="swatch" style="background:#c1442d"></i>기준점 P</span><span><i class="swatch" style="background:#2b6ca3"></i>방향 끝점 D</span><span><i class="swatch" style="background:#2f7d58"></i>이동점 X(t)</span>';

  readouts.classList.add('line-readout');
  readouts.innerHTML='<div class="readout-box"><div class="readout-label">기준점과 방향벡터</div><div class="readout-value" id="lineBase"></div></div><div class="readout-box"><div class="readout-label">매개변수</div><div class="readout-value" id="lineParameter"></div></div><div class="readout-box"><div class="readout-label">t배 한 방향 이동</div><div class="readout-value" id="lineMove"></div></div><div class="readout-box"><div class="readout-label">현재 점 X(t)</div><div class="readout-value" id="linePoint"></div></div><div class="readout-box"><div class="readout-label">직선의 벡터방정식</div><div class="readout-value" id="lineEquation"></div></div>';
  controls.className='line-controls';
  controls.innerHTML='<div class="range-row"><div class="range-head"><span>매개변수 t</span><span data-line-t-label>1.00</span></div><input data-line-t type="range" min="-3" max="3" step="0.25" value="1" aria-label="매개변수 t"></div><div class="line-control-note">초록 X(t)를 직선 위에서 직접 끌거나 슬라이더로 정밀하게 조절할 수 있습니다.</div><div class="line-control-actions"><button type="button" class="line-reset" data-line-reset>처음 상태</button><button type="button" class="line-reset" data-line-view>시점 초기화</button></div>';
  const genericReset=layout.querySelector('[data-reset-view]');if(genericReset)genericReset.remove();

  const pointTargets=[
    {P:[-2,-1],v:[2,1],target:[2,1]},
    {P:[1,-2],v:[-1,2],target:[-1,2]},
    {P:[-3,2],v:[2,-1],target:[3,-1]}
  ];
  const sameTargets=[
    {P:[-3,-1],v:[2,1],startP:[-2,2],startV:[1,2]},
    {P:[-2,2],v:[1,-2],startP:[2,2],startV:[2,1]},
    {P:[0,-2],v:[3,1],startP:[-2,1],startV:[1,3]}
  ];
  const spaceTargets=[
    {plane:'xz',P:[-1,1,0],v:[2,1,1],target:[1,2,1]},
    {plane:'yz',P:[1,-2,-1],v:[1,2,2],target:[2,0,1]},
    {plane:'xy',P:[-2,-1,1],v:[2,1,-1],target:[2,1,-1]}
  ];
  const state={mode:'2d',mission:'free',missionIndex:0,P2:[-2,1],v2:[2,1],P3:[-1,1,0],v3:[2,1,1],t:.5,plane:'xz',target:null,targetLine:null,view:{yaw:-.7,pitch:.45,scale:70,cx:320,cy:215}};
  const colors={P:'#c1442d',D:'#2b6ca3',X:'#2f7d58',ghost:'#7557a8',soft:'#91a19a'};let action=null,last=null;

  function P(){return state.mode==='2d'?state.P2:state.P3;}
  function v(){return state.mode==='2d'?state.v2:state.v3;}
  function D(){return P().map(function(x,i){return x+v()[i];});}
  function X(t){const q=t===undefined?state.t:t;return P().map(function(x,i){return x+q*v()[i];});}
  function fmt(a,digits){return '('+a.map(function(x){const q=digits===undefined?Math.round(x*100)/100:+x.toFixed(digits);return Object.is(q,-0)?0:q;}).join(', ')+')';}
  function nonzero(){return Math.hypot.apply(null,v())>.001;}
  function add(tag,attrs,text){const n=G.s(tag,attrs,text);svg.appendChild(n);return n;}
  function math(id,tex){const el=document.getElementById(id);if(window.katex){try{window.katex.render(tex,el,{displayMode:false,throwOnError:false,strict:false});return;}catch(error){console.warn('[Vector Line Lab] 수식을 일반 텍스트로 표시합니다.',error);}}el.textContent=tex;}
  function defs(){const d=G.s('defs');[['lineDirection',colors.D],['lineMove',colors.X],['lineGhost',colors.ghost]].forEach(function(pair){const marker=G.s('marker',{id:pair[0],viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'});marker.appendChild(G.s('path',{d:'M0 0L10 5L0 10Z',fill:pair[1]}));d.appendChild(marker);});const glow=G.s('filter',{id:'lineGlow',x:'-90%',y:'-90%',width:'280%',height:'280%'});glow.appendChild(G.s('feGaussianBlur',{stdDeviation:5,result:'blur'}));const merge=G.s('feMerge');merge.appendChild(G.s('feMergeNode',{in:'blur'}));merge.appendChild(G.s('feMergeNode',{in:'SourceGraphic'}));glow.appendChild(merge);d.appendChild(glow);svg.appendChild(d);}
  function handle(name,q,color,label){add('circle',{cx:q.x,cy:q.y,r:44,fill:'transparent',stroke:'transparent','data-line-point':name,class:'line-point-hit',tabindex:0,role:'slider','aria-label':label});add('circle',{cx:q.x,cy:q.y,r:17,fill:color,opacity:.2,'data-line-point':name,class:'line-point-halo',filter:'url(#lineGlow)'});add('circle',{cx:q.x,cy:q.y,r:name==='X'?10:11,fill:color,stroke:'#fff','stroke-width':3,'data-line-point':name,class:'line-point-handle'});add('circle',{cx:q.x,cy:q.y,r:3,fill:'#fff','pointer-events':'none'});add('text',{x:q.x+(name==='P'?-13:13),y:q.y+(name==='X'?25:-12),'text-anchor':name==='P'?'end':name==='X'?'middle':'start',fill:color,'font-size':12,'font-weight':900,'pointer-events':'none'},name==='X'?'X(t)':name);}

  function draw2D(){
    const g=G.cartesian(svg,{xmin:-6,xmax:6,ymin:-5,ymax:5});g.grid();const p=P(),dir=v(),d=D(),x=X();
    if(state.mission==='same'&&state.targetLine){const a=state.targetLine.P.map(function(q,i){return q-8*state.targetLine.v[i];}),b=state.targetLine.P.map(function(q,i){return q+8*state.targetLine.v[i];});add('line',{x1:g.sx(a[0]),y1:g.sy(a[1]),x2:g.sx(b[0]),y2:g.sy(b[1]),stroke:colors.ghost,'stroke-width':5,'stroke-dasharray':'9 7',opacity:.55,'pointer-events':'none'});add('circle',{cx:g.sx(state.targetLine.P[0]),cy:g.sy(state.targetLine.P[1]),r:5,fill:colors.ghost,'pointer-events':'none'});}
    if(state.target&&state.mission==='point'){add('circle',{cx:g.sx(state.target[0]),cy:g.sy(state.target[1]),r:16,fill:'none',stroke:colors.ghost,'stroke-width':3,'stroke-dasharray':'6 5','pointer-events':'none'});add('circle',{cx:g.sx(state.target[0]),cy:g.sy(state.target[1]),r:4,fill:colors.ghost,'pointer-events':'none'});add('text',{x:g.sx(state.target[0])+10,y:g.sy(state.target[1])-12,fill:colors.ghost,'font-size':11,'font-weight':900,'pointer-events':'none'},'목표 '+fmt(state.target));}
    if(nonzero()){const a=p.map(function(q,i){return q-9*dir[i];}),b=p.map(function(q,i){return q+9*dir[i];});add('line',{x1:g.sx(a[0]),y1:g.sy(a[1]),x2:g.sx(b[0]),y2:g.sy(b[1]),stroke:colors.soft,'stroke-width':3,'stroke-linecap':'round','pointer-events':'none'});add('line',{x1:g.sx(p[0]),y1:g.sy(p[1]),x2:g.sx(d[0]),y2:g.sy(d[1]),stroke:colors.D,'stroke-width':4,'marker-end':'url(#lineDirection)','pointer-events':'none'});add('line',{x1:g.sx(p[0]),y1:g.sy(p[1]),x2:g.sx(x[0]),y2:g.sy(x[1]),stroke:colors.X,'stroke-width':3,'stroke-dasharray':'6 5','marker-end':'url(#lineMove)','pointer-events':'none'});}
    handle('P',{x:g.sx(p[0]),y:g.sy(p[1])},colors.P,'기준점 P '+fmt(p));handle('D',{x:g.sx(d[0]),y:g.sy(d[1])},colors.D,'방향 끝점 D '+fmt(d));handle('X',{x:g.sx(x[0]),y:g.sy(x[1])},colors.X,'이동점 X '+fmt(x));
  }

  function project(q){return G.project3(q,state.view);}
  function line3(a,b,attrs){const p=project(a),q=project(b);add('line',Object.assign({x1:p.x,y1:p.y,x2:q.x,y2:q.y},attrs||{}));}
  function activePlane(){return state.plane==='xy'?[0,1,2]:state.plane==='xz'?[0,2,1]:[1,2,0];}
  function drawPlane3(){const ij=activePlane(),i=ij[0],j=ij[1],k=ij[2],corners=[[-4,-4],[4,-4],[4,4],[-4,4]].map(function(pair){const p=[0,0,0];p[i]=pair[0];p[j]=pair[1];p[k]=0;return project(p);});add('polygon',{points:corners.map(function(p){return p.x+','+p.y;}).join(' '),fill:'#2b6ca3',opacity:.05,stroke:'#2b6ca3','stroke-width':1.2,'stroke-dasharray':'6 6','pointer-events':'none'});}
  function drawAxes3(){const o=[0,0,0];[[[4.5,0,0],colors.P,'x'],[[0,4.5,0],colors.X,'y'],[[0,0,4.5],colors.D,'z']].forEach(function(item){line3(o,item[0],{stroke:item[1],'stroke-width':2,opacity:.78,'pointer-events':'none'});const q=project(item[0]);add('text',{x:q.x+5,y:q.y-4,fill:item[1],'font-size':11,'font-weight':900,'pointer-events':'none'},item[2]);});}
  function draw3D(){
    drawPlane3();drawAxes3();const p=P(),dir=v(),d=D(),x=X();
    if(state.target&&state.mission==='space'){const q=project(state.target);add('circle',{cx:q.x,cy:q.y,r:16,fill:'none',stroke:colors.ghost,'stroke-width':3,'stroke-dasharray':'6 5','pointer-events':'none'});add('circle',{cx:q.x,cy:q.y,r:4,fill:colors.ghost,'pointer-events':'none'});add('text',{x:q.x+11,y:q.y+18,fill:colors.ghost,'font-size':11,'font-weight':900,'pointer-events':'none'},'목표 '+fmt(state.target));}
    if(nonzero()){line3(p.map(function(q,i){return q-5*dir[i];}),p.map(function(q,i){return q+5*dir[i];}),{stroke:colors.soft,'stroke-width':3,'stroke-linecap':'round','pointer-events':'none'});line3(p,d,{stroke:colors.D,'stroke-width':4,'marker-end':'url(#lineDirection)','pointer-events':'none'});line3(p,x,{stroke:colors.X,'stroke-width':3,'stroke-dasharray':'6 5','marker-end':'url(#lineMove)','pointer-events':'none'});}
    handle('P',project(p),colors.P,'기준점 P '+fmt(p));handle('D',project(d),colors.D,'방향 끝점 D '+fmt(d));handle('X',project(x),colors.X,'이동점 X '+fmt(x));
  }
  function draw(){G.clear(svg);defs();svg.classList.toggle('mode-3d',state.mode==='3d');if(state.mode==='2d')draw2D();else draw3D();}

  function sameLineStatus(){if(!state.targetLine||state.mode!=='2d'||!nonzero())return{success:false,direction:9,distance:9};const target=state.targetLine,dir=v(),cross=dir[0]*target.v[1]-dir[1]*target.v[0],offset=[P()[0]-target.P[0],P()[1]-target.P[1]],side=offset[0]*target.v[1]-offset[1]*target.v[0],targetLen=Math.hypot.apply(null,target.v);return{success:cross===0&&side===0,direction:Math.abs(cross)/(Math.hypot.apply(null,dir)*targetLen||1),distance:Math.abs(side)/targetLen};}
  function success(){if(!nonzero())return false;if(state.mission==='point'||state.mission==='space')return state.target&&Math.hypot.apply(null,X().map(function(q,i){return q-state.target[i];}))<.06;if(state.mission==='same')return sameLineStatus().success;return false;}
  function updateMission(ok){
    const kicker=brief.querySelector('[data-line-kicker]'),title=brief.querySelector('[data-line-title]'),copy=brief.querySelector('[data-line-copy]'),next=brief.querySelector('[data-line-next]'),meter=brief.querySelector('[data-line-meter]');let progress=0;next.classList.toggle('hidden',state.mission==='free');brief.classList.toggle('success',ok);svg.classList.toggle('mission-success',ok);
    if(state.mission==='free'){kicker.textContent=nonzero()?'FREE LAB · '+state.mode.toUpperCase():'DIRECTION UNDEFINED';title.textContent=nonzero()?'P, D, X(t)를 직접 움직여 보세요.':'P와 D가 같으면 방향벡터가 영벡터입니다.';copy.textContent=nonzero()?'D−P가 방향벡터가 되고 X(t)는 같은 직선 위를 움직입니다.':'D를 P 밖으로 옮겨야 하나의 방향과 직선을 만들 수 있습니다.';}
    else if(state.mission==='point'||state.mission==='space'){const gap=Math.hypot.apply(null,X().map(function(q,i){return q-state.target[i];}));progress=Math.max(5,100-gap/10*100);kicker.textContent=ok?'POINT LOCKED':state.mission==='space'?'3D POINT HUNT':'POINT HUNT';title.textContent=ok?'X(t)가 목표점을 정확히 통과했습니다!':'초록 X(t)를 목표 '+fmt(state.target)+'에 겹치세요.';copy.textContent=ok?'기준점에 t배 한 방향벡터를 더한 결과가 목표 좌표와 일치합니다.':'현재 X'+fmt(X(),2)+' · P와 D를 바꾸거나 X(t)를 직선 위에서 끌어 보세요.';}
    else{const status=sameLineStatus();progress=Math.max(5,100-(status.direction*55+status.distance/5*45));kicker.textContent=ok?'SAME LINE':'LINE MATCH';title.textContent=ok?'서로 다른 식으로 같은 직선을 만들었습니다!':'현재 직선을 보라색 점선과 완전히 겹치세요.';copy.textContent=ok?'기준점이 달라도 같은 직선 위에 있고 방향벡터가 실수배이면 같은 직선입니다.':'방향을 먼저 평행하게 만든 뒤 P를 보라색 직선 위로 옮겨 보세요.';}
    meter.style.width=(ok?100:progress)+'%';
  }

  function updateReadouts(){const p=P(),dir=v(),x=X(),move=dir.map(function(q){return q*state.t;});math('lineBase','\\vec p='+fmt(p)+',\\quad \\vec v='+fmt(dir));math('lineParameter','t='+state.t.toFixed(2));math('lineMove','t\\vec v='+fmt(move,2));math('linePoint','\\vec x(t)=\\vec p+t\\vec v='+fmt(x,2));math('lineEquation','\\vec x='+fmt(p)+'+t'+fmt(dir));controls.querySelector('[data-line-t]').value=state.t;controls.querySelector('[data-line-t-label]').textContent=state.t.toFixed(2);}
  function render(focusName){draw();updateReadouts();updateMission(success());planeBar.classList.toggle('hidden',state.mode!=='3d');controls.querySelector('[data-line-view]').classList.toggle('hidden',state.mode!=='3d');if(focusName)requestAnimationFrame(function(){const el=svg.querySelector('.line-point-hit[data-line-point="'+focusName+'"]');if(el)el.focus();});}

  function resetView(){state.view={yaw:-.7,pitch:.45,scale:70,cx:320,cy:215};render();}
  function resetMission(){state.view={yaw:-.7,pitch:.45,scale:70,cx:320,cy:215};state.target=null;state.targetLine=null;
    if(state.mission==='free'){if(state.mode==='2d'){state.P2=[-2,1];state.v2=[2,1];}else{state.P3=[-1,1,0];state.v3=[2,1,1];}state.t=.5;}
    if(state.mission==='point'){const q=pointTargets[state.missionIndex%pointTargets.length];state.mode='2d';state.P2=q.P.slice();state.v2=q.v.slice();state.t=.5;state.target=q.target.slice();}
    if(state.mission==='same'){const q=sameTargets[state.missionIndex%sameTargets.length];state.mode='2d';state.P2=q.startP.slice();state.v2=q.startV.slice();state.t=.5;state.targetLine={P:q.P.slice(),v:q.v.slice()};}
    if(state.mission==='space'){const q=spaceTargets[state.missionIndex%spaceTargets.length];state.mode='3d';state.P3=q.P.slice();state.v3=q.v.slice();state.t=.25;state.target=q.target.slice();setPlane(q.plane,false);}
    chips.querySelectorAll('[data-line-mode]').forEach(function(b){b.classList.toggle('active',b.dataset.lineMode===state.mode);});chips.classList.toggle('mission-locked',state.mission!=='free');render();
  }
  function setMission(name){state.mission=name;state.missionIndex=0;tabs.querySelectorAll('[data-line-mission]').forEach(function(b){const active=b.dataset.lineMission===name;b.classList.toggle('active',active);b.setAttribute('aria-selected',active?'true':'false');});resetMission();}
  function setMode(name){if(state.mission!=='free')return;state.mode=name;chips.querySelectorAll('[data-line-mode]').forEach(function(b){b.classList.toggle('active',b.dataset.lineMode===name);});resetMission();}
  function setPlane(name,doRender){state.plane=name;planeBar.querySelectorAll('[data-line-plane]').forEach(function(b){b.classList.toggle('active',b.dataset.linePlane===name);});if(doRender!==false)render();}

  tabs.querySelectorAll('[data-line-mission]').forEach(function(b){b.addEventListener('click',function(){setMission(b.dataset.lineMission);});});chips.querySelectorAll('[data-line-mode]').forEach(function(b){b.addEventListener('click',function(){setMode(b.dataset.lineMode);});});planeBar.querySelectorAll('[data-line-plane]').forEach(function(b){b.addEventListener('click',function(){setPlane(b.dataset.linePlane);});});brief.querySelector('[data-line-next]').addEventListener('click',function(){state.missionIndex++;resetMission();});controls.querySelector('[data-line-t]').addEventListener('input',function(e){state.t=+e.target.value;render();});controls.querySelector('[data-line-reset]').addEventListener('click',resetMission);controls.querySelector('[data-line-view]').addEventListener('click',resetView);

  function pointer(event){const r=svg.getBoundingClientRect();return{x:(event.clientX-r.left)/r.width*640,y:(event.clientY-r.top)/r.height*400};}
  function nearestPoint(event){const q=pointer(event);let points;if(state.mode==='2d'){const g=G.cartesian(svg,{xmin:-6,xmax:6,ymin:-5,ymax:5});points=[['P',{x:g.sx(P()[0]),y:g.sy(P()[1])}],['D',{x:g.sx(D()[0]),y:g.sy(D()[1])}],['X',{x:g.sx(X()[0]),y:g.sy(X()[1])}]];}else points=[['P',project(P())],['D',project(D())],['X',project(X())]];points.sort(function(a,b){return Math.hypot(q.x-a[1].x,q.y-a[1].y)-Math.hypot(q.x-b[1].x,q.y-b[1].y);});return points[0][0];}
  function move2D(event,name){const q=pointer(event),g=G.cartesian(svg,{xmin:-6,xmax:6,ymin:-5,ymax:5}),logical=[G.clamp(Math.round(g.xOf(q.x)),-5,5),G.clamp(Math.round(g.yOf(q.y)),-4,4)];if(name==='P')state.P2=logical;else if(name==='D')state.v2=[logical[0]-state.P2[0],logical[1]-state.P2[1]];else{const dir=state.v2,den=dir[0]*dir[0]+dir[1]*dir[1];if(den)state.t=G.clamp(Math.round(((logical[0]-state.P2[0])*dir[0]+(logical[1]-state.P2[1])*dir[1])/den*4)/4,-3,3);}render();}
  function move3D(event,name){if(name==='X'){const q=pointer(event),a=project(state.P3),b=project(D()),vx=b.x-a.x,vy=b.y-a.y,den=vx*vx+vy*vy;if(den)state.t=G.clamp(Math.round(((q.x-a.x)*vx+(q.y-a.y)*vy)/den*4)/4,-3,3);render();return;}const current=name==='P'?state.P3:D(),ij=activePlane(),i=ij[0],j=ij[1],k=ij[2],base=[0,0,0];base[k]=current[k];const o=project(base),ui=base.slice(),uj=base.slice();ui[i]=1;uj[j]=1;const pi=project(ui),pj=project(uj),vi={x:pi.x-o.x,y:pi.y-o.y},vj={x:pj.x-o.x,y:pj.y-o.y},q=pointer(event),dx=q.x-o.x,dy=q.y-o.y,det=vi.x*vj.y-vi.y*vj.x;if(Math.abs(det)<.001)return;const ni=(dx*vj.y-dy*vj.x)/det,nj=(vi.x*dy-vi.y*dx)/det,next=current.slice();next[i]=G.clamp(Math.round(ni),-4,4);next[j]=G.clamp(Math.round(nj),-4,4);if(name==='P')state.P3=next;else state.v3=next.map(function(x,index){return x-state.P3[index];});render();}
  svg.addEventListener('pointerdown',function(event){const name=event.target.dataset.linePoint;if(name){action=nearestPoint(event);svg.classList.add('is-dragging');}else if(state.mode==='3d'){action='orbit';svg.classList.add('is-orbiting');}else return;last=[event.clientX,event.clientY];svg.setPointerCapture(event.pointerId);});
  svg.addEventListener('pointermove',function(event){if(!action)return;if(action==='orbit'){state.view.yaw+=(event.clientX-last[0])*.009;state.view.pitch=G.clamp(state.view.pitch+(event.clientY-last[1])*.009,-1.1,1.1);last=[event.clientX,event.clientY];render();}else if(state.mode==='2d')move2D(event,action);else move3D(event,action);});
  function end(){action=null;svg.classList.remove('is-dragging','is-orbiting');}svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
  svg.addEventListener('keydown',function(event){const name=event.target.dataset.linePoint;if(!name||name==='X'||state.mode!=='2d'||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();const p=name==='P'?state.P2.slice():D().slice();if(event.key==='ArrowLeft')p[0]--;if(event.key==='ArrowRight')p[0]++;if(event.key==='ArrowUp')p[1]++;if(event.key==='ArrowDown')p[1]--;p[0]=G.clamp(p[0],-5,5);p[1]=G.clamp(p[1],-4,4);if(name==='P')state.P2=p;else state.v2=[p[0]-state.P2[0],p[1]-state.P2[1]];render(name);});
  document.addEventListener('jp:math-ready',function(){render();},{once:true});setMission('free');
})();
