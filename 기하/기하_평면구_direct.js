(function(){
  'use strict';
  const G=window.GeoLab,lab=document.querySelector('[data-page="lab"]'),oldSvg=document.getElementById('genericLabSvg');
  if(!G||!lab||!oldSvg)return;

  lab.classList.add('plane-sphere-direct-lab');
  lab.querySelector('.eyebrow').textContent='평면과 구 LAB · DIRECT MANIPULATION';
  lab.querySelector('h1').textContent='법선의 방향과 중심에서의 거리로 공간도형을 만드세요';
  lab.querySelector('.desc').textContent='평면은 기준점 P와 법선 끝점 N을, 구는 중심 C와 표면점 S를 직접 움직여 만듭니다. 좌표·벡터식·좌표방정식이 같은 순간 함께 바뀌는 과정을 확인하세요.';

  const layout=lab.querySelector('.lab-layout'),visual=layout.querySelector('.visual-card'),readouts=layout.querySelector('[data-readouts]'),controls=layout.querySelector('[data-controls]'),oldChips=lab.querySelector('[data-mode-chips]'),chips=oldChips.cloneNode(false);
  oldChips.replaceWith(chips);chips.innerHTML='<button type="button" class="chip active" data-ps-mode="plane">평면</button><button type="button" class="chip" data-ps-mode="sphere">구</button>';
  const tabs=document.createElement('div');tabs.className='ps-mission-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','평면과 구 실험 모드');tabs.innerHTML='<button type="button" class="ps-mission-tab active" data-ps-mission="free">자유 탐구</button><button type="button" class="ps-mission-tab" data-ps-mission="plane">목표 평면</button><button type="button" class="ps-mission-tab" data-ps-mission="point">점 통과</button><button type="button" class="ps-mission-tab" data-ps-mission="sphere">목표 구</button>';
  const brief=document.createElement('div');brief.className='ps-mission-brief';brief.setAttribute('aria-live','polite');brief.innerHTML='<div class="ps-mission-kicker" data-ps-kicker>FREE LAB</div><div class="ps-mission-copy"><div><strong data-ps-title>P와 N을 직접 움직여 보세요.</strong><p data-ps-copy>N−P가 평면에 수직인 법선벡터가 됩니다.</p></div><button type="button" class="ps-next hidden" data-ps-next>다음 목표</button></div><div class="ps-meter" data-ps-meter></div>';
  const planeBar=document.createElement('div');planeBar.className='ps-plane-bar';planeBar.innerHTML='<div class="ps-plane-buttons" role="group" aria-label="점 이동 평면"><button type="button" class="ps-plane-button" data-ps-plane="xy">xy 평면</button><button type="button" class="ps-plane-button active" data-ps-plane="xz">xz 평면</button><button type="button" class="ps-plane-button" data-ps-plane="yz">yz 평면</button></div><span class="ps-plane-note">점은 선택한 평면에서 이동하고, 빈 공간을 끌면 시점이 회전합니다.</span>';
  chips.before(tabs,brief);chips.after(planeBar);

  const svg=oldSvg.cloneNode(false);oldSvg.replaceWith(svg);svg.classList.add('ps-direct-stage');svg.classList.remove('orbit');svg.setAttribute('aria-label','평면의 기준점과 법선벡터 또는 구의 중심과 표면점을 직접 움직이는 3차원 실험');visual.classList.add('ps-stage-card');const guide=document.createElement('div');guide.className='ps-drag-guide';guide.innerHTML='<span>●</span> 점은 조작 · 빈 공간은 회전';visual.prepend(guide);
  const legend=visual.querySelector('.legend');if(legend)legend.innerHTML='<span><i class="swatch" style="background:#c1442d"></i>기준점·중심</span><span><i class="swatch" style="background:#2b6ca3"></i>법선·표면점</span><span><i class="swatch" style="background:#7557a8"></i>목표 도형</span>';
  readouts.classList.add('ps-readout');readouts.innerHTML='<div class="readout-box"><div class="readout-label" data-ps-label="0">기준 요소</div><div class="readout-value" id="psBase"></div></div><div class="readout-box"><div class="readout-label" data-ps-label="1">정의 벡터</div><div class="readout-value" id="psVector"></div></div><div class="readout-box"><div class="readout-label" data-ps-label="2">스칼라 조건</div><div class="readout-value" id="psScalar"></div></div><div class="readout-box"><div class="readout-label" data-ps-label="3">벡터 표현</div><div class="readout-value" id="psVectorEquation"></div></div><div class="readout-box"><div class="readout-label" data-ps-label="4">좌표방정식</div><div class="readout-value" id="psCoordinateEquation"></div></div>';
  controls.className='ps-controls';controls.innerHTML='<button type="button" class="ps-reset" data-ps-reset>처음 상태</button><button type="button" class="ps-reset" data-ps-view>시점 초기화</button>';const genericReset=layout.querySelector('[data-reset-view]');if(genericReset)genericReset.remove();

  const targetPlanes=[
    {plane:'xy',P:[0,0,1],n:[1,1,0],startP:[-1,1,1],startN:[1,0,1]},
    {plane:'xz',P:[1,0,-1],n:[1,0,1],startP:[-1,0,-1],startN:[0,0,1]},
    {plane:'yz',P:[1,-1,0],n:[0,1,1],startP:[1,1,-1],startN:[1,2,1]}
  ];
  const pointTargets=[
    {plane:'xy',Q:[2,1,1],P:[0,0,1],n:[1,1,1]},
    {plane:'xz',Q:[-2,1,2],P:[0,1,0],n:[1,1,-1]},
    {plane:'yz',Q:[1,-2,1],P:[1,0,0],n:[2,1,1]}
  ];
  const sphereTargets=[
    {plane:'xz',C:[1,-1,1],r:2,startC:[-1,-1,1],startS:[0,-1,1]},
    {plane:'xy',C:[-2,1,0],r:3,startC:[0,1,0],startS:[1,1,0]},
    {plane:'yz',C:[1,-2,-1],r:2,startC:[1,0,-1],startS:[1,1,-1]}
  ];
  const state={mode:'plane',mission:'free',missionIndex:0,P:[-1,0,0],n:[1,1,1],C:[1,-1,1],S:[3,-1,1],plane:'xz',targetPlane:null,targetPoint:null,targetSphere:null,view:{yaw:-.7,pitch:.45,scale:54,cx:320,cy:190}};
  const colors={base:'#c1442d',definition:'#2b6ca3',surface:'#2f7d58',ghost:'#7557a8',soft:'#91a19a'};let action=null,last=null;

  function N(){return state.P.map(function(x,i){return x+state.n[i];});}
  function radius(){return Math.hypot.apply(null,state.S.map(function(x,i){return x-state.C[i];}));}
  function fmt(a,digits){return '('+a.map(function(x){const q=digits===undefined?Math.round(x*100)/100:+x.toFixed(digits);return Object.is(q,-0)?0:q;}).join(', ')+')';}
  function project(p){return G.project3(p,state.view);}
  function add(tag,attrs,text){const n=G.s(tag,attrs,text);svg.appendChild(n);return n;}
  function line3(a,b,attrs){const p=project(a),q=project(b);add('line',Object.assign({x1:p.x,y1:p.y,x2:q.x,y2:q.y},attrs||{}));}
  function math(id,tex){const el=document.getElementById(id);if(window.katex){try{window.katex.render(tex,el,{displayMode:false,throwOnError:false,strict:false});return;}catch(error){console.warn('[Plane Sphere Lab] 수식을 일반 텍스트로 표시합니다.',error);}}el.textContent=tex;}
  function dot(a,b){return a.reduce(function(sum,x,i){return sum+x*b[i];},0);}
  function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
  function norm(a){return Math.hypot.apply(null,a);}
  function normalized(a){const l=norm(a);return l?a.map(function(x){return x/l;}):[0,0,0];}
  function defs(){const d=G.s('defs');[['psNormal',colors.definition],['psRadius',colors.surface],['psGhost',colors.ghost]].forEach(function(pair){const marker=G.s('marker',{id:pair[0],viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'});marker.appendChild(G.s('path',{d:'M0 0L10 5L0 10Z',fill:pair[1]}));d.appendChild(marker);});d.appendChild(G.solid.gradient('psSphereBody',['#e8f0f8','#a8c4de','#4f7ba8','#22405c']));const glow=G.s('filter',{id:'psGlow',x:'-90%',y:'-90%',width:'280%',height:'280%'});glow.appendChild(G.s('feGaussianBlur',{stdDeviation:5,result:'blur'}));const merge=G.s('feMerge');merge.appendChild(G.s('feMergeNode',{in:'blur'}));merge.appendChild(G.s('feMergeNode',{in:'SourceGraphic'}));glow.appendChild(merge);d.appendChild(glow);svg.appendChild(d);}
  function activePlane(){return state.plane==='xy'?[0,1,2]:state.plane==='xz'?[0,2,1]:[1,2,0];}
  function drawMovementPlane(){const ij=activePlane(),i=ij[0],j=ij[1],k=ij[2],corners=[[-4,-4],[4,-4],[4,4],[-4,4]].map(function(pair){const p=[0,0,0];p[i]=pair[0];p[j]=pair[1];p[k]=0;return project(p);});add('polygon',{points:corners.map(function(p){return p.x+','+p.y;}).join(' '),fill:'#2b6ca3',opacity:.035,stroke:'#2b6ca3','stroke-width':1,'stroke-dasharray':'6 7','pointer-events':'none'});}
  function drawAxes(){const o=[0,0,0];[[[4.5,0,0],colors.base,'x'],[[0,4.5,0],colors.surface,'y'],[[0,0,4.5],colors.definition,'z']].forEach(function(item){line3(o,item[0],{stroke:item[1],'stroke-width':2,opacity:.75,'pointer-events':'none'});const q=project(item[0]);add('text',{x:q.x+5,y:q.y-4,fill:item[1],'font-size':11,'font-weight':900,'pointer-events':'none'},item[2]);});}
  function planeBasis(n){const unit=normalized(n),helper=Math.abs(unit[2])<.82?[0,0,1]:[0,1,0],u=normalized(cross(unit,helper)),w=normalized(cross(unit,u));return[u,w];}
  function drawPlanePatch(p,n,color,opacity,ghost){
    if(norm(n)<.001)return;
    const basis=planeBasis(n);
    G.solid.planePatch(add,project,{p:p,u:basis[0],w:basis[1],size:3.1,color:color,opacity:opacity,ghost:ghost});
  }
  function drawSphere(c,r,color,opacity,ghost){
    G.solid.sphere(add,project,{center:c,r:r,color:color,scale:state.view.scale,
      gradientId:ghost?null:'psSphereBody',ghost:ghost,opacity:opacity});
  }
  function handle(name,p,color){const q=project(p);add('circle',{cx:q.x,cy:q.y,r:44,fill:'transparent',stroke:'transparent','data-ps-point':name,class:'ps-point-hit',tabindex:0,role:'slider','aria-label':'점 '+name+' '+fmt(p)});add('circle',{cx:q.x,cy:q.y,r:17,fill:color,opacity:.2,'data-ps-point':name,class:'ps-point-halo',filter:'url(#psGlow)'});add('circle',{cx:q.x,cy:q.y,r:11,fill:color,stroke:'#fff','stroke-width':3,'data-ps-point':name,class:'ps-point-handle'});add('circle',{cx:q.x,cy:q.y,r:3,fill:'#fff','pointer-events':'none'});add('text',{x:q.x+(name==='P'||name==='C'?-13:13),y:q.y-12,'text-anchor':name==='P'||name==='C'?'end':'start',fill:color,'font-size':12,'font-weight':900,'pointer-events':'none'},name);}

  function drawPlaneMode(){
    if(state.mission==='plane'&&state.targetPlane){drawPlanePatch(state.targetPlane.P,state.targetPlane.n,colors.ghost,.07,true);const a=state.targetPlane.P,b=a.map(function(x,i){return x+state.targetPlane.n[i];});line3(a,b,{stroke:colors.ghost,'stroke-width':3,'stroke-dasharray':'6 5','marker-end':'url(#psGhost)','pointer-events':'none'});}
    drawPlanePatch(state.P,state.n,colors.definition,.14,false);if(norm(state.n)>.001)line3(state.P,N(),{stroke:colors.definition,'stroke-width':4,'marker-end':'url(#psNormal)','pointer-events':'none'});
    if(state.mission==='point'&&state.targetPoint){const q=project(state.targetPoint);add('circle',{cx:q.x,cy:q.y,r:16,fill:'none',stroke:colors.ghost,'stroke-width':3,'stroke-dasharray':'6 5','pointer-events':'none'});add('circle',{cx:q.x,cy:q.y,r:4,fill:colors.ghost,'pointer-events':'none'});add('text',{x:q.x+12,y:q.y+18,fill:colors.ghost,'font-size':11,'font-weight':900,'pointer-events':'none'},'Q '+fmt(state.targetPoint));if(norm(state.n)>.001){const residual=dot(state.n,state.targetPoint.map(function(x,i){return x-state.P[i];})),den=dot(state.n,state.n),foot=state.targetPoint.map(function(x,i){return x-residual/den*state.n[i];});line3(state.targetPoint,foot,{stroke:colors.ghost,'stroke-width':2,'stroke-dasharray':'5 5','pointer-events':'none'});}}
    handle('P',state.P,colors.base);handle('N',N(),colors.definition);
  }
  function drawSphereMode(){if(state.mission==='sphere'&&state.targetSphere)drawSphere(state.targetSphere.C,state.targetSphere.r,colors.ghost,.75,true);drawSphere(state.C,radius(),colors.definition,.85,false);line3(state.C,state.S,{stroke:colors.surface,'stroke-width':4,'marker-end':'url(#psRadius)','pointer-events':'none'});handle('C',state.C,colors.base);handle('S',state.S,colors.surface);}
  function draw(){G.clear(svg);defs();drawMovementPlane();drawAxes();if(state.mode==='plane')drawPlaneMode();else drawSphereMode();}

  function planeStatus(){if(!state.targetPlane||norm(state.n)<.001)return{success:false,direction:9,distance:9};const target=state.targetPlane,crossGap=norm(cross(state.n,target.n))/(norm(state.n)*norm(target.n)||1),side=Math.abs(dot(state.n,target.P.map(function(x,i){return x-state.P[i];})))/(norm(state.n)||1);return{success:crossGap<.001&&side<.001,direction:crossGap,distance:side};}
  function pointResidual(){if(!state.targetPoint||norm(state.n)<.001)return 99;return Math.abs(dot(state.n,state.targetPoint.map(function(x,i){return x-state.P[i];})))/(norm(state.n)||1);}
  function sphereStatus(){if(!state.targetSphere)return{success:false,center:99,radius:99};const cgap=norm(state.C.map(function(x,i){return x-state.targetSphere.C[i];})),rgap=Math.abs(radius()-state.targetSphere.r);return{success:cgap<.01&&rgap<.01,center:cgap,radius:rgap};}
  function success(){if(state.mission==='plane')return planeStatus().success;if(state.mission==='point')return pointResidual()<.001;if(state.mission==='sphere')return sphereStatus().success;return false;}
  function updateMission(ok){const kicker=brief.querySelector('[data-ps-kicker]'),title=brief.querySelector('[data-ps-title]'),copy=brief.querySelector('[data-ps-copy]'),next=brief.querySelector('[data-ps-next]'),meter=brief.querySelector('[data-ps-meter]');let progress=0;next.classList.toggle('hidden',state.mission==='free');brief.classList.toggle('success',ok);svg.classList.toggle('mission-success',ok);
    if(state.mission==='free'){if(state.mode==='plane'){kicker.textContent=norm(state.n)>.001?'FREE LAB · PLANE':'NORMAL UNDEFINED';title.textContent=norm(state.n)>.001?'P와 N을 직접 움직여 보세요.':'P와 N이 같으면 평면을 정할 수 없습니다.';copy.textContent=norm(state.n)>.001?'N−P가 평면에 수직인 법선벡터가 됩니다.':'N을 P 밖으로 옮겨 0이 아닌 법선벡터를 만드세요.';}else{kicker.textContent=radius()>.001?'FREE LAB · SPHERE':'RADIUS ZERO';title.textContent=radius()>.001?'C와 S를 직접 움직여 보세요.':'C와 S가 같으면 반지름이 0입니다.';copy.textContent='중심 C에서 표면점 S까지의 거리가 구의 반지름이 됩니다.';}}
    else if(state.mission==='plane'){const status=planeStatus();progress=Math.max(5,100-(status.direction*55+status.distance/5*45));kicker.textContent=ok?'PLANE LOCKED':'PLANE MATCH';title.textContent=ok?'서로 다른 표현으로 같은 평면을 만들었습니다!':'현재 평면을 보라색 목표 평면과 겹치세요.';copy.textContent=ok?'기준점이 달라도 목표 평면 위에 있고 법선벡터가 실수배이면 같은 평면입니다.':'법선 방향을 평행하게 만든 뒤 P를 목표 평면 위로 옮겨 보세요.';}
    else if(state.mission==='point'){const residual=pointResidual();progress=Math.max(5,100-residual/6*100);kicker.textContent=ok?'POINT ON PLANE':'POINT PASS';title.textContent=ok?'점 Q가 현재 평면 위에 놓였습니다!':'평면이 Q'+fmt(state.targetPoint)+'를 지나게 만드세요.';copy.textContent=ok?'n·(Q−P)=0이므로 Q−P는 평면 위 방향이고 법선벡터와 수직입니다.':'현재 평면까지의 법선 방향 거리 약 '+residual.toFixed(2)+' · P 또는 N을 움직여 보세요.';}
    else{const status=sphereStatus();progress=Math.max(5,100-(status.center/7*55+status.radius/4*45));kicker.textContent=ok?'SPHERE LOCKED':'SPHERE MATCH';title.textContent=ok?'중심과 반지름이 목표 구와 일치했습니다!':'현재 구를 보라색 목표 구와 겹치세요.';copy.textContent=ok?'중심에서 같은 거리만큼 떨어진 점들의 집합이 하나의 구를 만듭니다.':'중심 차이 '+status.center.toFixed(2)+' · 반지름 차이 '+status.radius.toFixed(2)+'. C와 S를 움직여 보세요.';}
    meter.style.width=(ok?100:progress)+'%';}

  function signedTerm(variable,c){if(c===0)return variable+'^2';return c>0?'('+variable+'-'+c+')^2':'('+variable+'+'+Math.abs(c)+')^2';}
  function linearExpression(n){const vars=['x','y','z'];let out='';n.forEach(function(c,i){if(!c)return;const abs=Math.abs(c),term=(abs===1?'':abs)+vars[i];if(!out)out=(c<0?'-':'')+term;else out+=(c<0?'-':'+')+term;});return out||'0';}
  function updateReadouts(){const labels=[...readouts.querySelectorAll('[data-ps-label]')];if(state.mode==='plane'){const d=dot(state.n,state.P);['기준점','법선벡터','평면 상수','벡터 표현','좌표방정식'].forEach(function(x,i){labels[i].textContent=x;});math('psBase','P='+fmt(state.P));math('psVector','\\vec n=N-P='+fmt(state.n));math('psScalar','d=\\vec n\\cdot P='+d);math('psVectorEquation','\\vec n\\cdot(\\vec x-\\vec p)=0');math('psCoordinateEquation',linearExpression(state.n)+'='+d);}else{const r=radius();['중심과 표면점','반지름 벡터','거리 조건','벡터 표현','좌표방정식'].forEach(function(x,i){labels[i].textContent=x;});math('psBase','C='+fmt(state.C)+',\\quad S='+fmt(state.S));math('psVector','\\overrightarrow{CS}='+fmt(state.S.map(function(x,i){return x-state.C[i];})));math('psScalar','r=|\\overrightarrow{CS}|\\approx '+r.toFixed(2));math('psVectorEquation','|\\vec x-\\vec c|='+r.toFixed(2));math('psCoordinateEquation',signedTerm('x',state.C[0])+'+'+signedTerm('y',state.C[1])+'+'+signedTerm('z',state.C[2])+'='+(r*r).toFixed(2));}}
  function render(focusName){draw();updateReadouts();updateMission(success());if(focusName)requestAnimationFrame(function(){const el=svg.querySelector('.ps-point-hit[data-ps-point="'+focusName+'"]');if(el)el.focus();});}

  function setPlane(name,doRender){state.plane=name;planeBar.querySelectorAll('[data-ps-plane]').forEach(function(b){b.classList.toggle('active',b.dataset.psPlane===name);});if(doRender!==false)render();}
  function resetView(){state.view={yaw:-.7,pitch:.45,scale:54,cx:320,cy:190};render();}
  function resetMission(){state.targetPlane=null;state.targetPoint=null;state.targetSphere=null;state.view={yaw:-.7,pitch:.45,scale:54,cx:320,cy:190};
    if(state.mission==='free'){if(state.mode==='plane'){state.P=[-1,0,0];state.n=[1,1,1];setPlane('xz',false);}else{state.C=[1,-1,1];state.S=[3,-1,1];setPlane('xz',false);}}
    if(state.mission==='plane'){const q=targetPlanes[state.missionIndex%targetPlanes.length];state.mode='plane';state.P=q.startP.slice();state.n=q.startN.map(function(x,i){return x-q.startP[i];});state.targetPlane={P:q.P.slice(),n:q.n.slice()};setPlane(q.plane,false);}
    if(state.mission==='point'){const q=pointTargets[state.missionIndex%pointTargets.length];state.mode='plane';state.P=q.P.slice();state.n=q.n.slice();state.targetPoint=q.Q.slice();setPlane(q.plane,false);}
    if(state.mission==='sphere'){const q=sphereTargets[state.missionIndex%sphereTargets.length];state.mode='sphere';state.C=q.startC.slice();state.S=q.startS.slice();state.targetSphere={C:q.C.slice(),r:q.r};setPlane(q.plane,false);}
    chips.querySelectorAll('[data-ps-mode]').forEach(function(b){b.classList.toggle('active',b.dataset.psMode===state.mode);});chips.classList.toggle('mission-locked',state.mission!=='free');render();}
  function setMission(name){state.mission=name;state.missionIndex=0;tabs.querySelectorAll('[data-ps-mission]').forEach(function(b){const active=b.dataset.psMission===name;b.classList.toggle('active',active);b.setAttribute('aria-selected',active?'true':'false');});resetMission();}
  function setMode(name){if(state.mission!=='free')return;state.mode=name;chips.querySelectorAll('[data-ps-mode]').forEach(function(b){b.classList.toggle('active',b.dataset.psMode===name);});resetMission();}
  tabs.querySelectorAll('[data-ps-mission]').forEach(function(b){b.addEventListener('click',function(){setMission(b.dataset.psMission);});});chips.querySelectorAll('[data-ps-mode]').forEach(function(b){b.addEventListener('click',function(){setMode(b.dataset.psMode);});});planeBar.querySelectorAll('[data-ps-plane]').forEach(function(b){b.addEventListener('click',function(){setPlane(b.dataset.psPlane);});});brief.querySelector('[data-ps-next]').addEventListener('click',function(){state.missionIndex++;resetMission();});controls.querySelector('[data-ps-reset]').addEventListener('click',resetMission);controls.querySelector('[data-ps-view]').addEventListener('click',resetView);

  function pointer(event){const r=svg.getBoundingClientRect();return{x:(event.clientX-r.left)/r.width*640,y:(event.clientY-r.top)/r.height*400};}
  function pointsNow(){return state.mode==='plane'?[['P',state.P],['N',N()]]:[['C',state.C],['S',state.S]];}
  function nearestPoint(event){const q=pointer(event),points=pointsNow().map(function(item){return[item[0],project(item[1])];});points.sort(function(a,b){return Math.hypot(q.x-a[1].x,q.y-a[1].y)-Math.hypot(q.x-b[1].x,q.y-b[1].y);});return points[0][0];}
  function moveEndpoint(event,name){const current=name==='P'?state.P:name==='N'?N():name==='C'?state.C:state.S,ij=activePlane(),i=ij[0],j=ij[1],k=ij[2],base=[0,0,0];base[k]=current[k];const o=project(base),ui=base.slice(),uj=base.slice();ui[i]=1;uj[j]=1;const pi=project(ui),pj=project(uj),vi={x:pi.x-o.x,y:pi.y-o.y},vj={x:pj.x-o.x,y:pj.y-o.y},q=pointer(event),dx=q.x-o.x,dy=q.y-o.y,det=vi.x*vj.y-vi.y*vj.x;if(Math.abs(det)<.001)return;const ni=(dx*vj.y-dy*vj.x)/det,nj=(vi.x*dy-vi.y*dx)/det,next=current.slice();next[i]=G.clamp(Math.round(ni),-4,4);next[j]=G.clamp(Math.round(nj),-4,4);if(name==='P')state.P=next;else if(name==='N')state.n=next.map(function(x,index){return x-state.P[index];});else if(name==='C'){const radial=state.S.map(function(x,index){return x-state.C[index];});state.C=next;state.S=next.map(function(x,index){return x+radial[index];});}else state.S=next;render();}
  svg.addEventListener('pointerdown',function(event){const name=event.target.dataset.psPoint;if(name){action=nearestPoint(event);svg.classList.add('is-dragging');}else{action='orbit';svg.classList.add('is-orbiting');}last=[event.clientX,event.clientY];svg.setPointerCapture(event.pointerId);});svg.addEventListener('pointermove',function(event){if(!action)return;if(action==='orbit'){state.view.yaw+=(event.clientX-last[0])*.009;state.view.pitch=G.clamp(state.view.pitch+(event.clientY-last[1])*.009,-1.1,1.1);last=[event.clientX,event.clientY];render();}else moveEndpoint(event,action);});function end(){action=null;svg.classList.remove('is-dragging','is-orbiting');}svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
  svg.addEventListener('keydown',function(event){const advertised=event.target.dataset.psPoint;if(!advertised||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;event.preventDefault();const name=advertised,current=name==='P'?state.P.slice():name==='N'?N().slice():name==='C'?state.C.slice():state.S.slice(),ij=activePlane(),i=ij[0],j=ij[1];if(event.key==='ArrowLeft')current[i]--;if(event.key==='ArrowRight')current[i]++;if(event.key==='ArrowUp')current[j]++;if(event.key==='ArrowDown')current[j]--;current[i]=G.clamp(current[i],-4,4);current[j]=G.clamp(current[j],-4,4);if(name==='P')state.P=current;else if(name==='N')state.n=current.map(function(x,index){return x-state.P[index];});else if(name==='C'){const radial=state.S.map(function(x,index){return x-state.C[index];});state.C=current;state.S=current.map(function(x,index){return x+radial[index];});}else state.S=current;render(name);});
  document.addEventListener('jp:math-ready',function(){render();},{once:true});setMission('free');
})();
