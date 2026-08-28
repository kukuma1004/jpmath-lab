(function(){
  'use strict';
  const G=window.GeoLab,lab=document.querySelector('[data-page="lab"]'),oldSvg=document.getElementById('genericLabSvg');
  if(!G||!lab||!oldSvg)return;
  lab.classList.add('sphere-direct-lab');
  lab.querySelector('.eyebrow').textContent='구의 방정식 LAB · DIRECT MANIPULATION';
  lab.querySelector('h1').textContent='중심 C를 옮기고 표면점 P로 구를 키워 보세요';
  lab.querySelector('.desc').textContent='중심을 끌면 괄호 안 숫자가 바뀌고, 표면점을 당기면 반지름과 방정식의 우변이 함께 변합니다. 빈 공간을 끌면 시점이 회전합니다.';

  const layout=lab.querySelector('.lab-layout'),visual=layout.querySelector('.visual-card'),readouts=layout.querySelector('[data-readouts]'),controls=layout.querySelector('[data-controls]');
  const tabs=document.createElement('div');
  tabs.className='sphere-mission-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','구의 방정식 실험 모드');
  tabs.innerHTML='<button class="sphere-mission-tab active" data-sphere-mission="free">자유 실험</button><button class="sphere-mission-tab" data-sphere-mission="target">목표 구</button><button class="sphere-mission-tab" data-sphere-mission="through">점 통과</button>';
  const brief=document.createElement('div');
  brief.className='sphere-mission-brief';brief.innerHTML='<div class="sphere-mission-kicker" data-sphere-kicker>FREE LAB</div><div class="sphere-mission-copy"><div><strong data-sphere-title>중심과 표면점을 직접 움직여 보세요.</strong><p data-sphere-copy>C는 선택한 평면에서 이동하고 P는 중심에서 같은 거리를 유지하며 구의 크기를 바꿉니다.</p></div><button class="sphere-next hidden" data-sphere-next>새 목표</button></div><div class="sphere-meter" data-sphere-meter></div>';
  const planeBar=document.createElement('div');
  planeBar.className='sphere-plane-bar';planeBar.innerHTML='<div class="sphere-plane-buttons" role="group" aria-label="구의 중심 이동 평면"><button class="sphere-plane-button" data-sphere-plane="xy">xy 평면</button><button class="sphere-plane-button active" data-sphere-plane="xz">xz 평면</button><button class="sphere-plane-button" data-sphere-plane="yz">yz 평면</button></div><span class="sphere-plane-note">C와 P는 선택한 좌표평면에서 움직입니다.</span>';
  layout.before(tabs,brief,planeBar);

  const svg=oldSvg.cloneNode(false);oldSvg.replaceWith(svg);svg.classList.add('sphere-direct-stage');svg.classList.remove('orbit');svg.setAttribute('aria-label','중심 C와 표면점 P를 직접 끌어 구의 방정식을 확인하는 3차원 실험');
  visual.classList.add('sphere-stage-card');const guide=document.createElement('div');guide.className='sphere-drag-guide';guide.innerHTML='<span>●</span> C는 이동 · P는 크기 · 빈 공간은 회전';visual.prepend(guide);
  readouts.classList.add('sphere-readout');readouts.innerHTML='<div class="readout-box"><div class="readout-label">구의 중심</div><div class="readout-value" id="sphereCenter"></div></div><div class="readout-box"><div class="readout-label">반지름과 표면점</div><div class="readout-value" id="sphereRadius"></div></div><div class="readout-box"><div class="readout-label">거리 조건</div><div class="readout-value" id="sphereDistance"></div></div><div class="readout-box"><div class="readout-label">구의 방정식</div><div class="readout-value" id="sphereEquation"></div></div>';
  controls.className='sphere-controls';controls.innerHTML='<div class="range-row"><div class="range-head"><span>반지름 r</span><span data-sphere-r-label>2.00</span></div><input data-sphere-r type="range" min="0.5" max="4" step="0.05" value="2" aria-label="구의 반지름"></div><div class="sphere-radius-actions"><button type="button" data-sphere-minus aria-label="반지름 0.25 줄이기">−</button><button type="button" data-sphere-plus aria-label="반지름 0.25 늘리기">+</button></div><div class="sphere-control-note">표면점 P를 직접 끌거나 −/+ 버튼으로 정밀하게 조절할 수 있습니다.</div>';
  const oldReset=layout.querySelector('[data-reset-view]'),resetView=oldReset.cloneNode(true);oldReset.replaceWith(resetView);

  const sphereTargets=[
    {plane:'xz',center:[2,-1,2],start:[-2,-1,-1],radius:3},
    {plane:'xy',center:[-2,2,1],start:[2,-2,1],radius:2},
    {plane:'yz',center:[1,-2,2],start:[1,2,-2],radius:2.5},
    {plane:'xz',center:[-1,1,-2],start:[2,1,2],radius:1.5}
  ];
  const throughTargets=[
    {plane:'xz',center:[0,0,0],point:[3,0,0],start:1},
    {plane:'xy',center:[-1,1,0],point:[1,3,0],start:1},
    {plane:'yz',center:[1,-1,1],point:[1,2,1],start:1.5},
    {plane:'xz',center:[-1,0,-1],point:[1,0,1],start:1}
  ];
  const state={center:[1,-1,1],radius:2,dir:[1,0,0],plane:'xz',mission:'free',targetIndex:0,target:null,through:null,view:{yaw:-.7,pitch:.45,scale:54,cx:320,cy:190}};
  const colors={center:'#c1442d',surface:'#7557a8',axisX:'#c1442d',axisY:'#2f7d58',axisZ:'#2b6ca3',gold:'#b8882e',soft:'#96a39d'};let action=null,last=null;

  function project(p){return G.project3(p,state.view);}
  function surface(){return state.center.map(function(x,i){return x+state.dir[i]*state.radius;});}
  function fmt(v,d){return '('+v.map(function(x){const q=d===undefined?Math.round(x*100)/100:+x.toFixed(d);return Object.is(q,-0)?0:q;}).join(', ')+')';}
  function add(tag,attrs,text){const n=G.s(tag,attrs,text);svg.appendChild(n);return n;}
  function line3(a,b,attrs){const p=project(a),q=project(b);return add('line',Object.assign({x1:p.x,y1:p.y,x2:q.x,y2:q.y},attrs||{}));}
  function text3(p,value,color,dx,dy,anchor){const q=project(p);return add('text',{x:q.x+(dx||0),y:q.y+(dy||0),'text-anchor':anchor||'start',fill:color,'font-size':12,'font-weight':900,'pointer-events':'none'},value);}
  function defs(){const d=G.s('defs'),glow=G.s('filter',{id:'sphereGlow',x:'-90%',y:'-90%',width:'280%',height:'280%'});glow.appendChild(G.s('feGaussianBlur',{stdDeviation:5,result:'blur'}));const merge=G.s('feMerge');merge.appendChild(G.s('feMergeNode',{in:'blur'}));merge.appendChild(G.s('feMergeNode',{in:'SourceGraphic'}));glow.appendChild(merge);d.appendChild(glow);const g=G.s('radialGradient',{id:'sphereBody',cx:'.34',cy:'.30',r:'.82'});g.appendChild(G.s('stop',{offset:'0%','stop-color':'#efeaf7','stop-opacity':'.95'}));g.appendChild(G.s('stop',{offset:'46%','stop-color':'#b9a5da','stop-opacity':'.55'}));g.appendChild(G.s('stop',{offset:'82%','stop-color':'#6f52a3','stop-opacity':'.34'}));g.appendChild(G.s('stop',{offset:'100%','stop-color':'#3d2c60','stop-opacity':'.22'}));d.appendChild(g);svg.appendChild(d);}
  function activePlane(){return state.plane==='xy'?[0,1,2]:state.plane==='xz'?[0,2,1]:[1,2,0];}
  function drawGrid(){const ij=activePlane(),i=ij[0],j=ij[1];for(let v=-4;v<=4;v++){const a=[0,0,0],b=[0,0,0],c=[0,0,0],d=[0,0,0];a[i]=-4;a[j]=v;b[i]=4;b[j]=v;c[i]=v;c[j]=-4;d[i]=v;d[j]=4;line3(a,b,{stroke:'#c5cfc9','stroke-width':.75,opacity:.52,'pointer-events':'none'});line3(c,d,{stroke:'#c5cfc9','stroke-width':.75,opacity:.52,'pointer-events':'none'});}}
  function drawAxes(){const O=[0,0,0];[[[4.6,0,0],colors.axisX,'x'],[[0,4.6,0],colors.axisY,'y'],[[0,0,4.6],colors.axisZ,'z']].forEach(function(a){line3(O,a[0],{stroke:a[1],'stroke-width':2,opacity:.8,'pointer-events':'none'});text3(a[0],a[2],a[1],5,-5);});}
  function circlePath(center,r,plane){let d='';for(let n=0;n<=96;n++){const t=n/96*Math.PI*2,p=center.slice();if(plane==='xy'){p[0]+=r*Math.cos(t);p[1]+=r*Math.sin(t);}else if(plane==='xz'){p[0]+=r*Math.cos(t);p[2]+=r*Math.sin(t);}else{p[1]+=r*Math.cos(t);p[2]+=r*Math.sin(t);}const q=project(p);d+=(n?'L':'M')+q.x+' '+q.y;}return d;}
  // ── 구 그리기 ────────────────────────────────────────────────────────
  // 큰 원 세 개만으로는 구로 보이지 않는다. 세 가지를 더한다.
  //  1) 빛 방향이 있는 음영 (왼쪽 위가 밝고 가장자리로 갈수록 어두워짐)
  //  2) 위도·경도 격자 (지구본처럼 곡률을 읽게 함)
  //  3) 앞뒤 구분 — 뒤로 넘어간 반쪽은 흐리고 점선으로 그린다
  const SPHERE_LATS=[-60,-30,0,30,60];
  const SPHERE_LONS=[0,30,60,90,120,150];

  // 극축은 화면 위쪽과 가까운 월드 y축으로 둔다 (지구본과 같은 인상)
  function ringPoints(center,r,kind,deg){
    const ang=deg*Math.PI/180,pts=[],N=112;
    for(let n=0;n<=N;n++){
      const t=n/N*Math.PI*2;
      if(kind==='lat'){
        const rr=r*Math.cos(ang),yy=r*Math.sin(ang);
        pts.push([center[0]+rr*Math.cos(t),center[1]+yy,center[2]+rr*Math.sin(t)]);
      }else{
        pts.push([center[0]+r*Math.cos(t)*Math.cos(ang),center[1]+r*Math.sin(t),center[2]+r*Math.cos(t)*Math.sin(ang)]);
      }
    }
    return pts;
  }

  // 시점 기준 깊이로 앞/뒤 구간을 나눈다. project3 의 z는 화면 앞쪽이 큰 값이다.
  function splitByDepth(points,centerZ){
    const runs=[];let cur=null;
    points.forEach(function(p){
      const q=project(p),front=q.z>=centerZ;
      if(!cur||cur.front!==front){
        if(cur)cur.d+='L'+q.x+' '+q.y;      // 구간 사이가 벌어지지 않게 경계점을 공유한다
        cur={front:front,d:'M'+q.x+' '+q.y};
        runs.push(cur);
      }else cur.d+='L'+q.x+' '+q.y;
    });
    return runs;
  }

  function drawSphere(center,r,color,ghost){
    const q=project(center),R=r*state.view.scale;
    if(ghost){
      // 목표 구는 실루엣만 점선으로 보여 준다
      add('circle',{cx:q.x,cy:q.y,r:R,fill:'none',stroke:color,'stroke-width':2,'stroke-dasharray':'8 7',opacity:.7,'pointer-events':'none'});
      ['lat','lon'].forEach(function(kind){
        [0,90].forEach(function(deg){
          splitByDepth(ringPoints(center,r,kind,deg),q.z).forEach(function(run){
            add('path',{d:run.d,fill:'none',stroke:color,'stroke-width':1.3,opacity:run.front?.5:.2,'stroke-dasharray':'6 6','pointer-events':'none'});
          });
        });
      });
      return;
    }
    // 1) 몸통 — 왼쪽 위에서 빛이 오는 것처럼 채운다
    add('circle',{cx:q.x,cy:q.y,r:R,fill:'url(#sphereBody)','pointer-events':'none'});
    // 2) 뒤쪽 격자를 먼저, 앞쪽 격자를 나중에 그려 앞뒤가 겹쳐 보이게 한다
    const rings=[];
    SPHERE_LATS.forEach(function(d){rings.push({pts:ringPoints(center,r,'lat',d),main:d===0})});
    SPHERE_LONS.forEach(function(d){rings.push({pts:ringPoints(center,r,'lon',d),main:false})});
    [false,true].forEach(function(wantFront){
      rings.forEach(function(ring){
        splitByDepth(ring.pts,q.z).forEach(function(run){
          if(run.front!==wantFront)return;
          add('path',{d:run.d,fill:'none',stroke:color,
            'stroke-width':run.front?(ring.main?1.9:1.15):.9,
            opacity:run.front?(ring.main?.9:.5):.16,
            'stroke-dasharray':run.front?'':'3 4','pointer-events':'none'});
        });
      });
    });
    // 3) 실루엣 — 구의 가장자리를 또렷하게 닫아 준다
    add('circle',{cx:q.x,cy:q.y,r:R,fill:'none',stroke:color,'stroke-width':2.2,opacity:.85,'pointer-events':'none'});
  }
  function drawHandle(name,p,color,enabled){const q=project(p),locked=!enabled;add('circle',{cx:q.x,cy:q.y,r:44,fill:'transparent','data-sphere-point':name,class:'sphere-point-hit'+(locked?' sphere-locked':'')});add('circle',{cx:q.x,cy:q.y,r:17,fill:color,opacity:.2,'data-sphere-point':name,class:'sphere-point-halo'+(locked?' sphere-locked':''),filter:'url(#sphereGlow)'});add('circle',{cx:q.x,cy:q.y,r:11,fill:color,stroke:'#fff','stroke-width':3,'data-sphere-point':name,class:'sphere-point-handle'+(locked?' sphere-locked':'')});add('circle',{cx:q.x,cy:q.y,r:3,fill:'#fff','pointer-events':'none'});text3(p,name,color,name==='C'?-14:14,-13,name==='C'?'end':'start');}
  function draw(){
    G.clear(svg);defs();drawGrid();drawAxes();
    if(state.mission==='target'&&state.target)drawSphere(state.target.center,state.target.radius,'#2b6ca3',true);
    drawSphere(state.center,state.radius,colors.surface,false);const P=surface();line3(state.center,P,{stroke:colors.gold,'stroke-width':3,'stroke-linecap':'round','pointer-events':'none'});
    if(state.mission==='through'&&state.through){const q=project(state.through.point);add('circle',{cx:q.x,cy:q.y,r:8,fill:colors.gold,stroke:'#fff','stroke-width':3,'pointer-events':'none'});add('circle',{cx:q.x,cy:q.y,r:16,fill:'none',stroke:colors.gold,'stroke-width':2,'stroke-dasharray':'4 4','pointer-events':'none'});text3(state.through.point,'Q',colors.gold,13,-12);line3(state.center,state.through.point,{stroke:colors.gold,'stroke-width':2,'stroke-dasharray':'6 5','pointer-events':'none'});}
    const free=state.mission==='free',allowCenter=free||state.mission==='target';drawHandle('C',state.center,colors.center,allowCenter);drawHandle('P',P,colors.surface,true);return P;
  }
  function term(v,c){if(c===0)return v+'^2';return c>0?'('+v+'-'+c+')^2':'('+v+'+'+Math.abs(c)+')^2';}
  function math(id,tex){const el=document.getElementById(id);el.innerHTML='\\('+tex+'\\)';if(window.renderMathInElement)window.renderMathInElement(el,{delimiters:[{left:'\\(',right:'\\)',display:false}],throwOnError:false});}
  function updateReadouts(P){math('sphereCenter','C'+fmt(state.center));math('sphereRadius','r='+state.radius.toFixed(2)+'\\quad P'+fmt(P,2));math('sphereDistance','CP=r='+state.radius.toFixed(2));math('sphereEquation',term('x',state.center[0])+'+'+term('y',state.center[1])+'+'+term('z',state.center[2])+'='+(state.radius*state.radius).toFixed(2));controls.querySelector('[data-sphere-r]').value=state.radius;controls.querySelector('[data-sphere-r-label]').textContent=state.radius.toFixed(2);}
  function updateMission(){const kicker=brief.querySelector('[data-sphere-kicker]'),title=brief.querySelector('[data-sphere-title]'),copy=brief.querySelector('[data-sphere-copy]'),next=brief.querySelector('[data-sphere-next]'),meter=brief.querySelector('[data-sphere-meter]');let success=false,progress=0;next.classList.toggle('hidden',state.mission==='free');
    if(state.mission==='free'){kicker.textContent='FREE LAB';title.textContent='중심과 표면점을 직접 움직여 보세요.';copy.textContent='C는 선택한 평면에서 이동하고 P는 중심에서 같은 거리를 유지하며 구의 크기를 바꿉니다.';}
    else if(state.mission==='target'){const dc=Math.hypot.apply(null,state.center.map(function(x,i){return x-state.target.center[i];})),dr=Math.abs(state.radius-state.target.radius);success=dc<.01&&dr<.06;progress=Math.max(5,100-(dc*12+dr*18));kicker.textContent=success?'SPHERE LOCKED':'SPHERE BUILDER';title.textContent=success?'목표 구와 정확히 겹쳤습니다!':'중심 '+fmt(state.target.center)+', 반지름 '+state.target.radius+'인 구를 만드세요.';copy.textContent=success?'중심 좌표와 반지름이 방정식의 모든 숫자를 결정했습니다.':'현재 C'+fmt(state.center)+', r='+state.radius.toFixed(2)+' · C와 P를 차례로 움직여 보세요.';}
    else{const needed=Math.hypot.apply(null,state.through.point.map(function(x,i){return x-state.center[i];})),gap=Math.abs(state.radius-needed);success=gap<.06;progress=Math.max(5,100-gap/3.5*100);kicker.textContent=success?'POINT ON SPHERE':'PASS THROUGH';title.textContent=success?'점 Q가 구의 표면 위에 놓였습니다!':'구가 점 Q'+fmt(state.through.point)+'를 지나게 하세요.';copy.textContent=success?'CQ=r이므로 Q의 좌표는 구의 방정식을 만족합니다.':'CQ='+needed.toFixed(2)+', 현재 r='+state.radius.toFixed(2)+' · P를 당겨 CQ와 같은 반지름을 만드세요.';}
    brief.classList.toggle('success',success);svg.classList.toggle('mission-success',success);meter.style.width=progress+'%';}
  function render(){const P=draw();updateReadouts(P);updateMission();}
  function normalizeDir(){const ij=activePlane(),next=[0,0,0];next[ij[0]]=state.dir[ij[0]];next[ij[1]]=state.dir[ij[1]];const n=Math.hypot(next[ij[0]],next[ij[1]]);if(n<.01)next[ij[0]]=1;else{next[ij[0]]/=n;next[ij[1]]/=n;}state.dir=next;}
  function setPlane(name){state.plane=name;normalizeDir();planeBar.querySelectorAll('[data-sphere-plane]').forEach(function(b){b.classList.toggle('active',b.dataset.spherePlane===name);});render();}
  function restoreView(){state.view={yaw:-.7,pitch:.45,scale:54,cx:320,cy:190};render();}
  function resetMission(){state.view={yaw:-.7,pitch:.45,scale:54,cx:320,cy:190};state.dir=[1,0,0];
    if(state.mission==='free'){state.center=[1,-1,1];state.radius=2;state.target=null;state.through=null;setPlane('xz');return;}
    if(state.mission==='target'){const q=sphereTargets[state.targetIndex%sphereTargets.length];state.center=q.start.slice();state.radius=1;state.target={center:q.center.slice(),radius:q.radius};state.through=null;setPlane(q.plane);return;}
    const q=throughTargets[state.targetIndex%throughTargets.length];state.center=q.center.slice();state.radius=q.start;state.through={point:q.point.slice()};state.target=null;setPlane(q.plane);
  }
  function setMission(name){state.mission=name;state.targetIndex=0;tabs.querySelectorAll('[data-sphere-mission]').forEach(function(b){b.classList.toggle('active',b.dataset.sphereMission===name);});resetMission();}
  function pointerInSvg(event){const r=svg.getBoundingClientRect();return{x:(event.clientX-r.left)/r.width*640,y:(event.clientY-r.top)/r.height*400};}
  function planePoint(event,fixed){const ij=activePlane(),i=ij[0],j=ij[1],k=ij[2],base=[0,0,0];base[k]=fixed[k];const o=project(base),ui=base.slice(),uj=base.slice();ui[i]=1;uj[j]=1;const pi=project(ui),pj=project(uj),vi={x:pi.x-o.x,y:pi.y-o.y},vj={x:pj.x-o.x,y:pj.y-o.y},p=pointerInSvg(event),dx=p.x-o.x,dy=p.y-o.y,det=vi.x*vj.y-vi.y*vj.x;if(Math.abs(det)<.001)return null;const out=fixed.slice();out[i]=(dx*vj.y-dy*vj.x)/det;out[j]=(vi.x*dy-vi.y*dx)/det;return out;}
  function moveCenter(event){const p=planePoint(event,state.center);if(!p)return;const ij=activePlane();state.center[ij[0]]=G.clamp(Math.round(p[ij[0]]),-3,3);state.center[ij[1]]=G.clamp(Math.round(p[ij[1]]),-3,3);render();}
  function moveSurface(event){const p=planePoint(event,state.center);if(!p)return;const ij=activePlane(),v=[0,0,0];v[ij[0]]=p[ij[0]]-state.center[ij[0]];v[ij[1]]=p[ij[1]]-state.center[ij[1]];const n=Math.hypot(v[ij[0]],v[ij[1]]);if(n<.05)return;state.radius=G.clamp(Math.round(n*20)/20,.5,4);state.dir[ij[0]]=v[ij[0]]/n;state.dir[ij[1]]=v[ij[1]]/n;state.dir[ij[2]]=0;render();}
  tabs.querySelectorAll('[data-sphere-mission]').forEach(function(button){button.addEventListener('click',function(){setMission(button.dataset.sphereMission);});});brief.querySelector('[data-sphere-next]').addEventListener('click',function(){state.targetIndex++;resetMission();});planeBar.querySelectorAll('[data-sphere-plane]').forEach(function(button){button.addEventListener('click',function(){setPlane(button.dataset.spherePlane);});});controls.querySelector('[data-sphere-r]').addEventListener('input',function(event){state.radius=+event.target.value;render();});controls.querySelector('[data-sphere-minus]').addEventListener('click',function(){state.radius=G.clamp(Math.round((state.radius-.25)*20)/20,.5,4);render();});controls.querySelector('[data-sphere-plus]').addEventListener('click',function(){state.radius=G.clamp(Math.round((state.radius+.25)*20)/20,.5,4);render();});resetView.addEventListener('click',restoreView);
  svg.addEventListener('pointerdown',function(event){const name=event.target.dataset.spherePoint;if(name){const allowed=name==='P'||(name==='C'&&state.mission!=='through');if(!allowed)return;action=name;}else action='orbit';last=[event.clientX,event.clientY];svg.classList.add(action==='orbit'?'is-orbiting':'is-dragging');svg.setPointerCapture(event.pointerId);if(action==='C')moveCenter(event);if(action==='P')moveSurface(event);});svg.addEventListener('pointermove',function(event){if(!action)return;if(action==='C')moveCenter(event);else if(action==='P')moveSurface(event);else{state.view.yaw+=(event.clientX-last[0])*.009;state.view.pitch=G.clamp(state.view.pitch+(event.clientY-last[1])*.009,-1.1,1.1);last=[event.clientX,event.clientY];render();}});function end(){action=null;svg.classList.remove('is-orbiting','is-dragging');}svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);render();
})();
