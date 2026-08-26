(function(){
  'use strict';
  const G=window.GeoLab,lab=document.querySelector('[data-page="lab"]'),oldSvg=document.getElementById('genericLabSvg');
  if(!G||!lab||!oldSvg)return;
  lab.classList.add('spacecoord-direct-lab');
  lab.querySelector('.eyebrow').textContent='공간좌표 LAB · DIRECT MANIPULATION';
  lab.querySelector('h1').textContent='점 A·B·P를 잡아 공간의 좌표를 움직이세요';
  lab.querySelector('.desc').textContent='이동 평면을 고르고 점을 끌면 좌표 차·거리·내분점이 한 순간에 함께 변합니다. 빈 공간을 끌면 시점이 회전합니다.';

  const layout=lab.querySelector('.lab-layout'),visual=layout.querySelector('.visual-card'),readouts=layout.querySelector('[data-readouts]'),controls=layout.querySelector('[data-controls]');
  const missionTabs=document.createElement('div');
  missionTabs.className='spacecoord-mission-tabs';
  missionTabs.setAttribute('role','tablist');
  missionTabs.setAttribute('aria-label','공간좌표 실험 모드');
  missionTabs.innerHTML='<button class="spacecoord-mission-tab active" data-space-mission="free">자유 실험</button><button class="spacecoord-mission-tab" data-space-mission="coordinate">목표 좌표</button><button class="spacecoord-mission-tab" data-space-mission="ratio">내분비 맞추기</button>';
  const brief=document.createElement('div');
  brief.className='spacecoord-mission-brief';
  brief.innerHTML='<div class="spacecoord-mission-kicker" data-space-kicker>FREE LAB</div><div class="spacecoord-mission-copy"><div><strong data-space-title>세 점을 직접 움직여 보세요.</strong><p data-space-copy>A와 B는 선택한 좌표평면에서, P는 선분 AB 위에서 움직입니다.</p></div><button class="spacecoord-next hidden" data-space-next>새 목표</button></div><div class="spacecoord-meter" data-space-meter></div>';
  const planeBar=document.createElement('div');
  planeBar.className='spacecoord-plane-bar';
  planeBar.innerHTML='<div class="spacecoord-plane-buttons" role="group" aria-label="점 이동 평면"><button class="spacecoord-plane-button" data-space-plane="xy">xy 평면</button><button class="spacecoord-plane-button active" data-space-plane="xz">xz 평면</button><button class="spacecoord-plane-button" data-space-plane="yz">yz 평면</button></div><span class="spacecoord-plane-note">선택한 두 좌표만 움직이고 나머지 좌표는 고정됩니다.</span>';
  layout.before(missionTabs,brief,planeBar);

  const svg=oldSvg.cloneNode(false);
  oldSvg.replaceWith(svg);
  svg.classList.add('spacecoord-direct-stage');
  svg.classList.remove('orbit');
  svg.setAttribute('aria-label','점 A와 B, 내분점 P를 직접 끌어 좌표와 거리를 확인하는 3차원 실험');
  visual.classList.add('spacecoord-stage-card');
  const guide=document.createElement('div');
  guide.className='spacecoord-drag-guide';
  guide.innerHTML='<span>●</span> 점은 조작 · 빈 공간은 회전';
  visual.prepend(guide);

  readouts.classList.add('spacecoord-readout');
  readouts.innerHTML='<div class="readout-box"><div class="readout-label">두 점의 좌표</div><div class="readout-value" id="spacePoints"></div></div><div class="readout-box"><div class="readout-label">좌표의 변화량</div><div class="readout-value" id="spaceDelta"></div></div><div class="readout-box"><div class="readout-label">두 점 사이의 거리</div><div class="readout-value" id="spaceDistance"></div></div><div class="readout-box"><div class="readout-label">내분점 P</div><div class="readout-value" id="spacePointP"></div></div>';
  controls.className='spacecoord-controls';
  controls.innerHTML='<div class="range-row"><div class="range-head"><span>A에서 B로 이동한 비율 t</span><span data-space-t-label>0.50</span></div><input data-space-t type="range" min="0" max="1" step="0.01" value="0.5" aria-label="내분점 P의 위치"></div><div class="spacecoord-control-note">P를 선분 위에서 직접 끌거나 슬라이더로 정밀하게 조절할 수 있습니다.</div>';
  const oldReset=layout.querySelector('[data-reset-view]'),resetView=oldReset.cloneNode(true);
  oldReset.replaceWith(resetView);

  const coordinateTargets=[
    {plane:'xz',A:[-2,-1,1],start:[3,-1,-1],target:[2,-1,3]},
    {plane:'xy',A:[-1,-2,1],start:[2,3,1],target:[-3,2,1]},
    {plane:'yz',A:[1,-2,-1],start:[1,3,2],target:[1,1,-3]},
    {plane:'xz',A:[-3,1,-2],start:[1,1,3],target:[3,1,1]}
  ];
  const ratioTargets=[[1,2],[2,1],[3,2],[1,3]];
  const state={A:[-2,-1,1],B:[3,2,4],t:.5,plane:'xz',mission:'free',targetIndex:0,target:null,ratio:[1,2],view:{yaw:-.7,pitch:.45,scale:70,cx:320,cy:215}};
  const colors={A:'#c1442d',B:'#2b6ca3',P:'#2f7d58',ghost:'#7557a8',soft:'#91a19a'};
  let action=null,last=null;

  function point(t){return state.A.map(function(x,i){return x+(state.B[i]-x)*t;});}
  function delta(){return state.B.map(function(x,i){return x-state.A[i];});}
  function fmt(v,digits){return '('+v.map(function(x){const q=digits===undefined?Math.round(x*100)/100:+x.toFixed(digits);return Object.is(q,-0)?0:q;}).join(', ')+')';}
  function project(p){return G.project3(p,state.view);}
  function add(tag,attrs,text){const n=G.s(tag,attrs,text);svg.appendChild(n);return n;}
  function line3(a,b,attrs){const p=project(a),q=project(b);return add('line',Object.assign({x1:p.x,y1:p.y,x2:q.x,y2:q.y},attrs||{}));}
  function text3(p,value,color,dx,dy){const q=project(p);return add('text',{x:q.x+(dx||8),y:q.y+(dy||-9),fill:color||'#23322d','font-size':12,'font-weight':800,'pointer-events':'none'},value);}
  function defs(){const d=G.s('defs'),glow=G.s('filter',{id:'spaceGlow',x:'-90%',y:'-90%',width:'280%',height:'280%'});glow.appendChild(G.s('feGaussianBlur',{stdDeviation:5,result:'blur'}));const merge=G.s('feMerge');merge.appendChild(G.s('feMergeNode',{in:'blur'}));merge.appendChild(G.s('feMergeNode',{in:'SourceGraphic'}));glow.appendChild(merge);d.appendChild(glow);svg.appendChild(d);}
  function activePlane(){return state.plane==='xy'?[0,1,2]:state.plane==='xz'?[0,2,1]:[1,2,0];}
  function drawPlane(){
    const ij=activePlane(),i=ij[0],j=ij[1],k=ij[2],corners=[[-4,-4],[4,-4],[4,4],[-4,4]].map(function(pair){const p=[0,0,0];p[i]=pair[0];p[j]=pair[1];p[k]=0;return project(p);});
    add('polygon',{points:corners.map(function(p){return p.x+','+p.y;}).join(' '),fill:'#2b6ca3',opacity:.055,stroke:'#2b6ca3','stroke-width':1.2,'stroke-dasharray':'6 6','pointer-events':'none'});
    for(let v=-4;v<=4;v++){
      const a=[0,0,0],b=[0,0,0],c=[0,0,0],d=[0,0,0];a[i]=-4;a[j]=v;b[i]=4;b[j]=v;c[i]=v;c[j]=-4;d[i]=v;d[j]=4;
      line3(a,b,{stroke:'#b9c9c2','stroke-width':.75,opacity:.55,'pointer-events':'none'});line3(c,d,{stroke:'#b9c9c2','stroke-width':.75,opacity:.55,'pointer-events':'none'});
    }
  }
  function drawAxes(){
    const O=[0,0,0],axes=[[[4.6,0,0],colors.A,'x'],[[0,4.6,0],colors.P,'y'],[[0,0,4.6],colors.B,'z']];
    axes.forEach(function(item){line3(O,item[0],{stroke:item[1],'stroke-width':2.2,opacity:.82,'pointer-events':'none'});text3(item[0],item[2],item[1],5,-4);});
    [[-4.2,0,0],[0,-4.2,0],[0,0,-4.2]].forEach(function(p){line3(O,p,{stroke:'#aebbb5','stroke-width':1,'stroke-dasharray':'4 5','pointer-events':'none'});});
  }
  function drawPoint(name,p,color,enabled){
    const q=project(p),locked=!enabled;
    add('circle',{cx:q.x,cy:q.y,r:44,fill:'transparent','data-space-point':name,class:'spacecoord-point-hit'+(locked?' spacecoord-locked':''),'aria-label':'점 '+name+' 이동'});
    add('circle',{cx:q.x,cy:q.y,r:17,fill:color,opacity:.2,'data-space-point':name,class:'spacecoord-point-halo'+(locked?' spacecoord-locked':''),filter:'url(#spaceGlow)'});
    add('circle',{cx:q.x,cy:q.y,r:name==='P'?10:11,fill:color,stroke:'#fff','stroke-width':3,'data-space-point':name,class:'spacecoord-point-handle'+(locked?' spacecoord-locked':'')});
    add('circle',{cx:q.x,cy:q.y,r:3,fill:'#fff','pointer-events':'none'});
    const label=name==='A'?{x:q.x-13,y:q.y-12,anchor:'end'}:name==='B'?{x:q.x+13,y:q.y-12,anchor:'start'}:{x:q.x,y:q.y+27,anchor:'middle'};
    add('text',{x:label.x,y:label.y,'text-anchor':label.anchor,fill:color,'font-size':12,'font-weight':900,'pointer-events':'none'},name);
  }
  function draw(){
    G.clear(svg);defs();drawPlane();drawAxes();
    const P=point(state.t),D=delta();
    line3(state.A,state.B,{stroke:colors.soft,'stroke-width':3,'stroke-linecap':'round','pointer-events':'none'});
    const c1=[state.B[0],state.A[1],state.A[2]],c2=[state.B[0],state.B[1],state.A[2]];
    line3(state.A,c1,{stroke:colors.A,'stroke-width':2,'stroke-dasharray':'5 5','pointer-events':'none'});line3(c1,c2,{stroke:colors.P,'stroke-width':2,'stroke-dasharray':'5 5','pointer-events':'none'});line3(c2,state.B,{stroke:colors.B,'stroke-width':2,'stroke-dasharray':'5 5','pointer-events':'none'});
    if(state.mission==='coordinate'&&state.target){const q=project(state.target);add('circle',{cx:q.x,cy:q.y,r:15,fill:'none',stroke:colors.ghost,'stroke-width':3,'stroke-dasharray':'6 5','pointer-events':'none'});add('circle',{cx:q.x,cy:q.y,r:4,fill:colors.ghost,'pointer-events':'none'});text3(state.target,'목표 '+fmt(state.target),colors.ghost,12,18);}
    const free=state.mission==='free';
    drawPoint('A',state.A,colors.A,free);drawPoint('B',state.B,colors.B,free||state.mission==='coordinate');drawPoint('P',P,colors.P,free||state.mission==='ratio');
    const ap=project(state.A),pp=project(P),bp=project(state.B);
    add('text',{x:(ap.x+pp.x)/2,y:(ap.y+pp.y)/2-8,fill:colors.A,'font-size':10,'font-weight':800,'pointer-events':'none'},'AP '+state.t.toFixed(2));
    add('text',{x:(pp.x+bp.x)/2,y:(pp.y+bp.y)/2-8,fill:colors.B,'font-size':10,'font-weight':800,'pointer-events':'none'},'PB '+(1-state.t).toFixed(2));
    return{P:P,D:D,distance:Math.hypot.apply(null,D)};
  }
  function math(id,tex){const el=document.getElementById(id);el.innerHTML='\\('+tex+'\\)';if(window.renderMathInElement)window.renderMathInElement(el,{delimiters:[{left:'\\(',right:'\\)',display:false}],throwOnError:false});}
  function updateReadouts(values){
    math('spacePoints','A'+fmt(state.A)+'\\quad B'+fmt(state.B));
    math('spaceDelta','\\Delta='+fmt(values.D));
    math('spaceDistance','AB=\\sqrt{'+values.D.map(function(x){return x*x;}).join('+')+'}\\approx '+values.distance.toFixed(2));
    math('spacePointP','P'+fmt(values.P,2)+'\\quad(t='+state.t.toFixed(2)+')');
    controls.querySelector('[data-space-t]').value=state.t;controls.querySelector('[data-space-t-label]').textContent=state.t.toFixed(2);
  }
  function updateMission(values){
    const kicker=brief.querySelector('[data-space-kicker]'),title=brief.querySelector('[data-space-title]'),copy=brief.querySelector('[data-space-copy]'),next=brief.querySelector('[data-space-next]'),meter=brief.querySelector('[data-space-meter]');let success=false,progress=0;
    next.classList.toggle('hidden',state.mission==='free');
    if(state.mission==='free'){
      kicker.textContent='FREE LAB';title.textContent='세 점을 직접 움직여 보세요.';copy.textContent='A와 B는 선택한 좌표평면에서, P는 선분 AB 위에서 움직입니다.';
    }else if(state.mission==='coordinate'){
      const error=Math.hypot.apply(null,state.B.map(function(x,i){return x-state.target[i];}));success=error<.01;progress=Math.max(5,100-error/9*100);kicker.textContent=success?'COORDINATE LOCKED':'COORDINATE HUNT';title.textContent=success?'점 B가 목표 좌표에 도착했습니다!':'점 B를 '+fmt(state.target)+'로 옮기세요.';copy.textContent=success?'선택한 평면에서 두 좌표를 동시에 바꾸어 목표를 찾았습니다.':'현재 B'+fmt(state.B)+' · '+state.plane+' 평면에서 빛나는 B를 끌어 보세요.';
    }else{
      const targetT=state.ratio[0]/(state.ratio[0]+state.ratio[1]),error=Math.abs(state.t-targetT);success=error<=.02;progress=Math.max(5,100-error*210);kicker.textContent=success?'RATIO LOCKED':'SECTION POINT';title.textContent=success?'AP:PB='+state.ratio.join(':')+'를 만들었습니다!':'P가 AB를 '+state.ratio.join(':')+'로 내분하게 하세요.';copy.textContent=success?'P의 좌표는 A와 B의 좌표에 같은 내분비를 적용한 결과입니다.':'현재 AP:PB ≈ '+state.t.toFixed(2)+':'+(1-state.t).toFixed(2)+' · 초록 P를 선분 위에서 끌어 보세요.';
    }
    brief.classList.toggle('success',success);svg.classList.toggle('mission-success',success);meter.style.width=progress+'%';
  }
  function render(){const values=draw();updateReadouts(values);updateMission(values);}
  function setPlane(name){state.plane=name;planeBar.querySelectorAll('[data-space-plane]').forEach(function(b){b.classList.toggle('active',b.dataset.spacePlane===name);});render();}
  function restoreView(){state.view={yaw:-.7,pitch:.45,scale:70,cx:320,cy:215};render();}
  function resetMission(){
    state.view={yaw:-.7,pitch:.45,scale:70,cx:320,cy:215};
    if(state.mission==='free'){state.A=[-2,-1,1];state.B=[3,2,4];state.t=.5;state.target=null;setPlane('xz');return;}
    if(state.mission==='coordinate'){const q=coordinateTargets[state.targetIndex%coordinateTargets.length];state.A=q.A.slice();state.B=q.start.slice();state.target=q.target.slice();state.t=.5;setPlane(q.plane);return;}
    state.A=[-3,-2,0];state.B=[3,2,4];state.t=.5;state.ratio=ratioTargets[state.targetIndex%ratioTargets.length].slice();state.target=null;setPlane('xz');
  }
  function setMission(name){state.mission=name;state.targetIndex=0;missionTabs.querySelectorAll('[data-space-mission]').forEach(function(b){b.classList.toggle('active',b.dataset.spaceMission===name);});resetMission();}
  function pointerInSvg(event){const r=svg.getBoundingClientRect();return{x:(event.clientX-r.left)/r.width*640,y:(event.clientY-r.top)/r.height*400};}
  function moveEndpoint(event,name){
    const current=state[name],ij=activePlane(),i=ij[0],j=ij[1],k=ij[2],base=[0,0,0];base[k]=current[k];
    const o=project(base),ui=base.slice(),uj=base.slice();ui[i]=1;uj[j]=1;const pi=project(ui),pj=project(uj),vi={x:pi.x-o.x,y:pi.y-o.y},vj={x:pj.x-o.x,y:pj.y-o.y},p=pointerInSvg(event),dx=p.x-o.x,dy=p.y-o.y,det=vi.x*vj.y-vi.y*vj.x;
    if(Math.abs(det)<.001)return;const ni=(dx*vj.y-dy*vj.x)/det,nj=(vi.x*dy-vi.y*dx)/det,next=current.slice();next[i]=G.clamp(Math.round(ni),-4,4);next[j]=G.clamp(Math.round(nj),-4,4);state[name]=next;render();
  }
  function moveP(event){const p=pointerInSvg(event),a=project(state.A),b=project(state.B),vx=b.x-a.x,vy=b.y-a.y,den=vx*vx+vy*vy;if(!den)return;state.t=G.clamp(Math.round(((p.x-a.x)*vx+(p.y-a.y)*vy)/den*100)/100,0,1);render();}

  missionTabs.querySelectorAll('[data-space-mission]').forEach(function(button){button.addEventListener('click',function(){setMission(button.dataset.spaceMission);});});
  brief.querySelector('[data-space-next]').addEventListener('click',function(){state.targetIndex++;resetMission();});
  planeBar.querySelectorAll('[data-space-plane]').forEach(function(button){button.addEventListener('click',function(){setPlane(button.dataset.spacePlane);});});
  controls.querySelector('[data-space-t]').addEventListener('input',function(event){state.t=+event.target.value;render();});
  resetView.addEventListener('click',restoreView);
  svg.addEventListener('pointerdown',function(event){
    const name=event.target.dataset.spacePoint;if(name){const allowed=state.mission==='free'||(state.mission==='coordinate'&&name==='B')||(state.mission==='ratio'&&name==='P');if(!allowed)return;action=name;}else action='orbit';last=[event.clientX,event.clientY];svg.classList.add(action==='orbit'?'is-orbiting':'is-dragging');svg.setPointerCapture(event.pointerId);if(action==='A'||action==='B')moveEndpoint(event,action);if(action==='P')moveP(event);
  });
  svg.addEventListener('pointermove',function(event){if(!action)return;if(action==='A'||action==='B')moveEndpoint(event,action);else if(action==='P')moveP(event);else{state.view.yaw+=(event.clientX-last[0])*.009;state.view.pitch=G.clamp(state.view.pitch+(event.clientY-last[1])*.009,-1.1,1.1);last=[event.clientX,event.clientY];render();}});
  function end(){action=null;svg.classList.remove('is-orbiting','is-dragging');}
  svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
  render();
})();
