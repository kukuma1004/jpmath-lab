(function(){
  'use strict';
  const G=window.GeoLab,root=document.getElementById('lessonApp'),lab=root&&root.querySelector('[data-page="lab"]'),oldSvg=document.getElementById('genericLabSvg');
  if(!G||!lab||!oldSvg)return;
  lab.classList.add('projection-direct-lab');
  lab.querySelector('.eyebrow').textContent='정사영 LAB · DIRECT MANIPULATION';
  lab.querySelector('.title').textContent='끝점 B를 잡아 그림자의 길이를 바꾸세요';
  lab.querySelector('.desc').textContent='빛나는 끝점을 끌면 원래 길이·평면과의 각·정사영 길이·cos 비율이 같은 순간 함께 변합니다. 빈 공간을 끌면 시점이 회전합니다.';
  const modeChips=lab.querySelector('[data-mode-chips]');
  const tabs=document.createElement('div');
  tabs.className='projection-mission-tabs';
  tabs.setAttribute('role','tablist');
  tabs.setAttribute('aria-label','정사영 실험 모드');
  tabs.innerHTML='<button class="projection-mission-tab active" data-projection-mission="free">자유 실험</button><button class="projection-mission-tab" data-projection-mission="shadow">목표 그림자</button><button class="projection-mission-tab" data-projection-mission="angle">목표 각도</button>';
  const brief=document.createElement('div');
  brief.className='projection-mission-brief';
  brief.setAttribute('aria-live','polite');
  brief.innerHTML='<div><span data-projection-kicker>FREE LAB</span><strong data-projection-title>선분의 끝을 자유롭게 움직여 보세요.</strong><p data-projection-copy>선분이 눕거나 일어설 때 그림자가 어떻게 달라지는지 관찰합니다.</p></div><button class="btn projection-next hidden" type="button" data-projection-next>새 목표</button><div class="projection-meter" aria-hidden="true"><i data-projection-meter></i></div>';
  lab.insertBefore(tabs,modeChips);
  lab.insertBefore(brief,modeChips);
  const roofBar=document.createElement('div');
  roofBar.className='projection-roof-bar';
  roofBar.innerHTML='<button class="projection-roof-button" type="button" data-projection-roof aria-pressed="false">지붕으로 보기</button><span class="projection-roof-note">건축 도면은 위에서 내려다본 그림이라 경사 지붕이 cos&#920; 배로 줄어 그려집니다.</span>';
  modeChips.parentNode.insertBefore(roofBar,modeChips.nextSibling);
  const roofButton=roofBar.querySelector('[data-projection-roof]');
  // 지붕은 면이 있어야 넓이 이야기가 된다. 선분 모드로 가면 함께 꺼야
  // 지붕면도 없는데 지붕 넓이만 남는 일이 없다.
  function setRoof(on){
    state.roof=on;
    roofButton.classList.toggle('active',on);
    roofButton.setAttribute('aria-pressed',String(on));
  }
  const visualCard=lab.querySelector('.visual-card');
  visualCard.classList.add('projection-direct-stage-card');
  const guide=document.createElement('div');
  guide.className='projection-drag-guide';
  guide.innerHTML='<span>●</span> 끝점은 조작 · 빈 공간은 회전';
  visualCard.insertBefore(guide,oldSvg);
  const svg=oldSvg.cloneNode(false);
  oldSvg.replaceWith(svg);
  svg.classList.add('projection-direct-stage');
  svg.classList.remove('orbit');
  svg.setAttribute('aria-label','끝점 B를 직접 끌어 선분의 정사영과 각도를 확인하는 3차원 실험');
  const readout=lab.querySelector('[data-readouts]');
  readout.classList.add('projection-readout');
  const controls=lab.querySelector('[data-controls]');
  const controlInputs=[...controls.querySelectorAll('input[type="range"]')];
  const resetView=lab.querySelector('[data-reset-view]');
  const state={theta:45,length:4,mode:'segment',roof:false,mission:'free',targetShadow:3,targetAngle:30,targetIndex:0,view:{yaw:-.7,pitch:.48,scale:46,cx:320,cy:286}};
  const shadowTargets=[3,4,2.5,3.5],angleTargets=[30,45,60];
  let action=null,last=[0,0];

  function p(point){return G.project3(point,state.view);}
  function line(a,b,color,width,dash,opacity){
    const attrs={x1:a.x,y1:a.y,x2:b.x,y2:b.y,stroke:color,'stroke-width':width||2,'stroke-linecap':'round',opacity:opacity==null?1:opacity};
    if(dash)attrs['stroke-dasharray']=dash;
    svg.appendChild(G.s('line',attrs));
  }
  function text(point,value,color,anchor){
    svg.appendChild(G.s('text',{x:point.x,y:point.y,fill:color||'#1E2B26','font-size':12,'font-weight':750,'text-anchor':anchor||'start','pointer-events':'none'},value));
  }
  function defs(){
    const d=G.s('defs');
    const glow=G.s('filter',{id:'projectionGlow',x:'-90%',y:'-90%',width:'280%',height:'280%'});
    glow.appendChild(G.s('feGaussianBlur',{stdDeviation:6,result:'blur'}));
    const merge=G.s('feMerge');merge.appendChild(G.s('feMergeNode',{in:'blur'}));merge.appendChild(G.s('feMergeNode',{in:'SourceGraphic'}));glow.appendChild(merge);d.appendChild(glow);
    const gradient=G.s('linearGradient',{id:'projectionPlane',x1:'0',y1:'0',x2:'1',y2:'1'});
    gradient.appendChild(G.s('stop',{offset:'0%','stop-color':'#D8EEF3','stop-opacity':.78}));
    gradient.appendChild(G.s('stop',{offset:'100%','stop-color':'#AFCED8','stop-opacity':.28}));
    d.appendChild(gradient);svg.appendChild(d);
  }
  function polygon(points,fill,stroke,opacity){
    const q=points.map(p);
    svg.appendChild(G.s('polygon',{points:q.map(function(x){return x.x+','+x.y;}).join(' '),fill:fill,stroke:stroke,'stroke-width':1.6,opacity:opacity==null?1:opacity}));
  }
  function scene(){
    G.clear(svg);defs();
    svg.appendChild(G.s('rect',{x:0,y:0,width:640,height:400,fill:'#F8FBFB'}));
    const plane=[[-3,0,-2],[3,0,-2],[3,0,2],[-3,0,2]];
    polygon(plane,'url(#projectionPlane)','#77A9B9',1);
    for(let x=-3;x<=3;x++)line(p([x,0,-2]),p([x,0,2]),'#9EC1CB',1,null,.35);
    for(let z=-2;z<=2;z++)line(p([-3,0,z]),p([3,0,z]),'#9EC1CB',1,null,.35);
    const rad=state.theta*Math.PI/180,L=state.length,A=[-2,0,0],B=[-2+L*Math.cos(rad),L*Math.sin(rad),0],H=[B[0],0,0];
    if(state.mode==='triangle'){
      const topA=[-2,0,1.7],topB=[B[0],B[1],1.7],topH=[H[0],0,1.7];
      polygon([A,B,topB,topA],'#EFAF9F','#C1442D',.24);
      polygon([A,H,topH,topA],'#A8CFDA','#2B6CA3',.28);
      line(p(topB),p(topH),'#F0A937',2,'5 5',.85);
      // 햇빛은 바로 위에서 내려온다. 지붕 위의 점이 도면 위 어디에 찍히는지 보여 준다.
      if(state.roof)for(let i=0;i<=3;i++){
        const t=i/3,top=[A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,1.7];
        line(p(top),p([top[0],0,1.7]),'#E0A93B',1.6,'4 4',.9);
      }
    }
    if(state.mission==='shadow'){
      const T=[-2+state.targetShadow,0,0];
      line(p(A),p(T),'#7557A8',6,'9 7',.7);
      text({x:p(T).x+7,y:p(T).y+18},'목표 '+state.targetShadow.toFixed(1),'#7557A8');
    }
    if(state.mission==='angle'){
      const tr=state.targetAngle*Math.PI/180,T=[-2+L*Math.cos(tr),L*Math.sin(tr),0];
      line(p(A),p(T),'#7557A8',3,'9 7',.72);
      text({x:p(T).x+7,y:p(T).y-8},'목표 '+state.targetAngle+'°','#7557A8');
    }
    line(p(A),p(B),'#C1442D',6,null,1);
    line(p(A),p(H),'#2B6CA3',7,null,1);
    line(p(B),p(H),'#F0A937',3,'6 5',.95);
    line(p([B[0],0,-.12]),p([B[0],0,.35]),'#2B6CA3',2,null,.8);
    const arcPoints=[];for(let i=0;i<=24;i++){const t=rad*i/24;arcPoints.push([-2+.72*Math.cos(t),.72*Math.sin(t),0]);}
    let arc='';arcPoints.map(p).forEach(function(q,i){arc+=(i?'L':'M')+q.x+' '+q.y;});
    svg.appendChild(G.s('path',{d:arc,fill:'none',stroke:'#7557A8','stroke-width':2.5}));
    const mid=p([-2+.92*Math.cos(rad/2),.92*Math.sin(rad/2),0]);text({x:mid.x,y:mid.y},state.theta.toFixed(0)+'°','#7557A8','middle');
    const bp=p(B);
    svg.appendChild(G.s('circle',{cx:bp.x,cy:bp.y,r:44,fill:'transparent','data-projection-handle':'true',class:'projection-end-hit'}));
    svg.appendChild(G.s('circle',{cx:bp.x,cy:bp.y,r:17,fill:'#C1442D',opacity:.2,'data-projection-handle':'true',class:'projection-end-halo',filter:'url(#projectionGlow)'}));
    svg.appendChild(G.s('circle',{cx:bp.x,cy:bp.y,r:11,fill:'#C1442D',stroke:'#fff','stroke-width':3,'data-projection-handle':'true',class:'projection-end-handle'}));
    svg.appendChild(G.s('circle',{cx:bp.x,cy:bp.y,r:3,fill:'#fff','pointer-events':'none'}));
    [['A',A,'#1E2B26'],['B',B,'#C1442D'],['H',H,'#2B6CA3']].forEach(function(item){const q=p(item[1]);text({x:q.x+8,y:q.y-8},item[0],item[2]);});
    return{shadow:L*Math.cos(rad),ratio:Math.cos(rad)};
  }
  function math(id,value){
    const el=document.getElementById(id);if(!el)return;el.innerHTML=value;
    if(window.renderMathInElement)window.renderMathInElement(el,{delimiters:[{left:'\\(',right:'\\)',display:false}],throwOnError:false});
  }
  function setReadouts(values){
    readout.innerHTML='<div class="readout-box"><div class="readout-label">원래 선분</div><div class="readout-value" id="projectionLength"></div></div><div class="readout-box"><div class="readout-label">평면과의 각</div><div class="readout-value" id="projectionAngle"></div></div><div class="readout-box"><div class="readout-label">정사영 길이</div><div class="readout-value" id="projectionShadow"></div></div><div class="readout-box"><div class="readout-label">축소 비율</div><div class="readout-value" id="projectionRatio"></div></div>'+(state.roof?'<div class="readout-box"><div class="readout-label">지붕 넓이와 도면 넓이</div><div class="readout-value" id="projectionRoof"></div></div>':'');
    math('projectionLength','\\(L='+state.length.toFixed(1)+'\\)');
    math('projectionAngle','\\(\\theta='+state.theta.toFixed(0)+'^\\circ\\)');
    math('projectionShadow','\\(L\\cos\\theta='+values.shadow.toFixed(2)+'\\)');
    math('projectionRatio','\\(\\cos\\theta='+values.ratio.toFixed(3)+'\\)');
    if(state.roof){const S=state.length*1.7;
      math('projectionRoof','\\(S='+S.toFixed(1)+'\\; S\\cos\\theta='+(S*values.ratio).toFixed(1)+'\\; \\text{모자라는 양 }'+(S-S*values.ratio).toFixed(1)+'\\)');}
  }
  function missionStatus(values){
    const kicker=brief.querySelector('[data-projection-kicker]'),title=brief.querySelector('[data-projection-title]'),copy=brief.querySelector('[data-projection-copy]'),meter=brief.querySelector('[data-projection-meter]'),next=brief.querySelector('[data-projection-next]');
    let ok=false,progress=0;
    next.classList.toggle('hidden',state.mission==='free');
    if(state.mission==='free'){
      kicker.textContent='FREE LAB';title.textContent='선분의 끝을 자유롭게 움직여 보세요.';copy.textContent='선분이 눕거나 일어설 때 그림자가 어떻게 달라지는지 관찰합니다.';
    }else if(state.mission==='shadow'){
      const gap=Math.abs(values.shadow-state.targetShadow);ok=gap<=.08;progress=Math.max(4,100-gap/5*100);
      kicker.textContent=ok?'SHADOW LOCKED':'SHADOW MATCH';title.textContent=ok?'목표 그림자와 정확히 일치했습니다!':'길이 5인 선분의 그림자를 '+state.targetShadow.toFixed(1)+'로 만드세요.';
      copy.textContent=ok?'각도를 바꾸어 L cosθ가 목표 길이를 만들었습니다.':'현재 그림자 '+values.shadow.toFixed(2)+' · 끝점 B를 원호를 따라 움직여 보세요.';
    }else{
      const gap=Math.abs(state.theta-state.targetAngle);ok=gap<=1;progress=Math.max(4,100-gap/80*100);
      kicker.textContent=ok?'ANGLE LOCKED':'ANGLE HUNT';title.textContent=ok?'목표 각도를 정확히 만들었습니다!':'선분과 평면의 각을 '+state.targetAngle+'°로 만드세요.';
      copy.textContent=ok?'각도가 정해지면 그림자 비율 cosθ도 함께 결정됩니다.':'현재 '+state.theta.toFixed(0)+'° · 끝점 B를 원호를 따라 움직여 보세요.';
    }
    brief.classList.toggle('success',ok);svg.classList.toggle('mission-success',ok);meter.style.width=progress+'%';
  }
  function syncControls(){
    if(controlInputs[0]){controlInputs[0].value=state.theta;controlInputs[0].closest('.range-row').querySelector('[data-value]').textContent=state.theta.toFixed(0);}
    if(controlInputs[1]){controlInputs[1].value=state.length;controlInputs[1].closest('.range-row').querySelector('[data-value]').textContent=state.length.toFixed(1);}
    controls.classList.toggle('projection-controls-locked',state.mission!=='free');
  }
  function render(){const values=scene();setReadouts(values);missionStatus(values);syncControls();}
  function resetState(){state.theta=45;state.length=state.mission==='free'?4:5;state.view={yaw:-.7,pitch:.48,scale:46,cx:320,cy:286};}
  function setMission(name){
    state.mission=name;resetState();
    if(name==='shadow')state.targetShadow=shadowTargets[state.targetIndex%shadowTargets.length];
    if(name==='angle')state.targetAngle=angleTargets[state.targetIndex%angleTargets.length];
    state.mode=name==='free'&&modeChips.querySelectorAll('.chip')[1].classList.contains('active')?'triangle':'segment';
    if(name!=='free'){state.mode='segment';setRoof(false);modeChips.querySelectorAll('.chip').forEach(function(b,i){b.classList.toggle('active',i===0);});}
    modeChips.classList.toggle('projection-mode-locked',name!=='free');
    tabs.querySelectorAll('[data-projection-mission]').forEach(function(b){b.classList.toggle('active',b.dataset.projectionMission===name);});
    render();
  }
  tabs.querySelectorAll('[data-projection-mission]').forEach(function(button){button.addEventListener('click',function(){setMission(button.dataset.projectionMission);});});
  brief.querySelector('[data-projection-next]').addEventListener('click',function(){state.targetIndex++;resetState();if(state.mission==='shadow')state.targetShadow=shadowTargets[state.targetIndex%shadowTargets.length];if(state.mission==='angle')state.targetAngle=angleTargets[state.targetIndex%angleTargets.length];render();});
  modeChips.querySelectorAll('.chip').forEach(function(button,index){button.addEventListener('click',function(){if(state.mission!=='free')return;state.mode=index===0?'segment':'triangle';if(index===0)setRoof(false);render();});});
  controlInputs.forEach(function(input,index){input.addEventListener('input',function(){if(index===0)state.theta=+input.value;else if(state.mission==='free')state.length=+input.value;render();});});
  roofButton.addEventListener('click',function(){
    setRoof(!state.roof);
    // 켜면 넓이 모드로 함께 옮긴다
    if(state.roof&&state.mission==='free'){state.mode='triangle';
      modeChips.querySelectorAll('.chip').forEach(function(b,i){b.classList.toggle('active',i===1);});}
    render();
  });
  resetView.addEventListener('click',function(){state.view={yaw:-.7,pitch:.48,scale:46,cx:320,cy:286};render();});
  function endpointFromPointer(event){
    const rect=svg.getBoundingClientRect(),screen={x:(event.clientX-rect.left)/rect.width*640,y:(event.clientY-rect.top)/rect.height*400},A=[-2,0,0],pa=p(A),px=p([-1,0,0]),pz=p([-2,1,0]);
    const ux={x:px.x-pa.x,y:px.y-pa.y},uz={x:pz.x-pa.x,y:pz.y-pa.y},v={x:screen.x-pa.x,y:screen.y-pa.y},det=ux.x*uz.y-ux.y*uz.x;
    if(Math.abs(det)<.001)return;
    let dx=(v.x*uz.y-v.y*uz.x)/det,dz=(ux.x*v.y-ux.y*v.x)/det;
    let theta=G.clamp(Math.atan2(Math.max(0,dz),Math.max(.01,dx))*180/Math.PI,0,80),length=Math.hypot(dx,dz);
    if(state.mission!=='free')length=5;else length=G.clamp(Math.round(length*10)/10,1,6);
    state.theta=Math.round(theta);state.length=length;render();
  }
  svg.addEventListener('pointerdown',function(event){last=[event.clientX,event.clientY];action=event.target.dataset.projectionHandle?'endpoint':'orbit';svg.classList.add(action==='orbit'?'is-orbiting':'is-dragging');svg.setPointerCapture(event.pointerId);if(action==='endpoint')endpointFromPointer(event);});
  svg.addEventListener('pointermove',function(event){if(!action)return;if(action==='endpoint')endpointFromPointer(event);else{state.view.yaw+=(event.clientX-last[0])*.009;state.view.pitch=G.clamp(state.view.pitch+(event.clientY-last[1])*.009,-1.1,1.1);last=[event.clientX,event.clientY];render();}});
  function end(){action=null;svg.classList.remove('is-orbiting','is-dragging');}
  svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
  render();
})();
