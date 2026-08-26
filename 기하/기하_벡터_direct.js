(function(){
  'use strict';
  const G=window.GeoLab,oldSvg=document.getElementById('vectorLabSvg');
  if(!G||!oldSvg)return;
  const svg=oldSvg.cloneNode(false);
  oldSvg.replaceWith(svg);
  const state={a:[3,1],b:[1,2],mode:'add',k:2,mission:'free',target:[5,4],missionIndex:0,trails:{a:[],b:[]}};
  const targets=[[5,4],[-2,4],[5,-1],[-3,-2],[1,5]];
  const brief=document.querySelector('[data-mission-brief]');
  const nextButton=document.querySelector('[data-next-mission]');
  const operationChips=document.querySelector('.vector-operation-chips');
  let dragVector=null;

  function tex(id,value){
    const el=document.getElementById(id);
    if(!el)return;
    el.innerHTML=value;
    if(window.renderMathInElement)window.renderMathInElement(el,{delimiters:[{left:'\\(',right:'\\)',display:false}],throwOnError:false});
  }

  function addDefs(){
    const defs=G.s('defs');
    [['directA','#C1442D'],['directB','#2B6CA3'],['directR','#2F7D58'],['directGhost','#7557A8']].forEach(function(pair){
      const marker=G.s('marker',{id:pair[0],viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:7,markerHeight:7,orient:'auto-start-reverse'});
      marker.appendChild(G.s('path',{d:'M 0 0 L 10 5 L 0 10 z',fill:pair[1]}));
      defs.appendChild(marker);
    });
    const glow=G.s('filter',{id:'directGlow',x:'-80%',y:'-80%',width:'260%',height:'260%'});
    glow.appendChild(G.s('feGaussianBlur',{stdDeviation:5,result:'blur'}));
    const merge=G.s('feMerge');
    merge.appendChild(G.s('feMergeNode',{in:'blur'}));
    merge.appendChild(G.s('feMergeNode',{in:'SourceGraphic'}));
    glow.appendChild(merge);
    defs.appendChild(glow);
    svg.appendChild(defs);
  }

  function result(){
    if(state.mode==='add')return[state.a[0]+state.b[0],state.a[1]+state.b[1]];
    if(state.mode==='sub')return[state.a[0]-state.b[0],state.a[1]-state.b[1]];
    return[state.k*state.a[0],state.k*state.a[1]];
  }

  function angle(){
    const den=Math.hypot.apply(null,state.a)*Math.hypot.apply(null,state.b);
    if(!den)return null;
    const dot=state.a[0]*state.b[0]+state.a[1]*state.b[1];
    return Math.acos(G.clamp(dot/den,-1,1))*180/Math.PI;
  }

  function addTrail(g,points,color){
    points.forEach(function(point,index){
      svg.appendChild(G.s('circle',{cx:g.sx(point[0]),cy:g.sy(point[1]),r:2.5+index*.6,fill:color,opacity:(index+1)/(points.length+1)*.32,'pointer-events':'none'}));
    });
  }

  function addArrow(g,from,to,color,marker,label,handle,ghost){
    const attrs={x1:g.sx(from[0]),y1:g.sy(from[1]),x2:g.sx(to[0]),y2:g.sy(to[1]),stroke:color,'stroke-width':ghost?3:4,'stroke-linecap':'round','marker-end':'url(#'+marker+')','pointer-events':'none',opacity:ghost?.82:1};
    if(ghost)attrs['stroke-dasharray']='8 7';
    svg.appendChild(G.s('line',attrs));
    if(handle){
      svg.appendChild(G.s('circle',{cx:g.sx(to[0]),cy:g.sy(to[1]),r:27,fill:'transparent','data-vector':handle,class:'vector-hit-area'}));
      svg.appendChild(G.s('circle',{cx:g.sx(to[0]),cy:g.sy(to[1]),r:15,fill:color,opacity:.2,'data-vector':handle,class:'vector-handle-halo',filter:'url(#directGlow)'}));
      svg.appendChild(G.s('circle',{cx:g.sx(to[0]),cy:g.sy(to[1]),r:10,fill:color,stroke:'white','stroke-width':3,'data-vector':handle,class:'vector-handle'}));
      svg.appendChild(G.s('circle',{cx:g.sx(to[0]),cy:g.sy(to[1]),r:3,fill:'white','pointer-events':'none'}));
    }
    if(label)svg.appendChild(G.s('text',{x:g.sx((from[0]+to[0])/2)+7,y:g.sy((from[1]+to[1])/2)-9,fill:color,'font-size':14,'font-weight':800,'pointer-events':'none'},label));
  }

  function draw(){
    G.clear(svg);
    const g=G.cartesian(svg,{xmin:-6,xmax:6,ymin:-5,ymax:5});
    g.grid();
    addDefs();
    addTrail(g,state.trails.a,'#C1442D');
    addTrail(g,state.trails.b,'#2B6CA3');
    const origin=[0,0],r=result();
    if(state.mission==='match')addArrow(g,origin,state.target,'#7557A8','directGhost','목표',null,true);
    addArrow(g,origin,state.a,'#C1442D','directA','a','a',false);
    addArrow(g,origin,state.b,'#2B6CA3','directB','b','b',false);
    if(state.mode==='add'){
      addArrow(g,state.a,r,'#2B6CA3','directB','b',null,false);
      svg.appendChild(G.s('line',{x1:g.sx(state.b[0]),y1:g.sy(state.b[1]),x2:g.sx(r[0]),y2:g.sy(r[1]),stroke:'#9FADA6','stroke-width':1.5,'stroke-dasharray':'5 5','pointer-events':'none'}));
    }else if(state.mode==='sub'){
      addArrow(g,state.b,state.a,'#2F7D58','directR','a−b',null,false);
    }
    addArrow(g,origin,r,'#2F7D58','directR',state.mode==='scale'?state.k+'a':state.mode==='add'?'a+b':'a−b',null,false);
    if(state.mission==='perp'){
      const denominator=state.a[0]*state.a[0]+state.a[1]*state.a[1],dot=state.a[0]*state.b[0]+state.a[1]*state.b[1];
      const foot=denominator?[dot/denominator*state.a[0],dot/denominator*state.a[1]]:[0,0];
      svg.appendChild(G.s('line',{x1:g.sx(state.b[0]),y1:g.sy(state.b[1]),x2:g.sx(foot[0]),y2:g.sy(foot[1]),stroke:'#7557A8','stroke-width':2,'stroke-dasharray':'6 5','pointer-events':'none'}));
      svg.appendChild(G.s('circle',{cx:g.sx(foot[0]),cy:g.sy(foot[1]),r:4,fill:'#7557A8','pointer-events':'none'}));
    }
    return r;
  }

  function success(r,dot){
    if(state.mission==='match')return r[0]===state.target[0]&&r[1]===state.target[1];
    if(state.mission==='perp')return dot===0&&Math.hypot.apply(null,state.a)>0&&Math.hypot.apply(null,state.b)>0;
    return false;
  }

  function updateMission(r,dot,theta,isSuccess){
    const kicker=brief.querySelector('[data-mission-kicker]'),title=brief.querySelector('[data-mission-title]'),copy=brief.querySelector('[data-mission-copy]'),meter=brief.querySelector('[data-mission-meter]');
    brief.classList.toggle('success',isSuccess);
    nextButton.classList.toggle('hidden',state.mission==='free');
    document.querySelector('[data-target-legend]').classList.toggle('hidden',state.mission!=='match');
    if(state.mission==='free'){
      kicker.textContent='FREE LAB';
      title.textContent='두 벡터를 마음대로 잡아당겨 보세요.';
      copy.textContent='결과 벡터와 내적·각도가 어떻게 함께 바뀌는지 관찰합니다.';
      meter.style.width='0%';
    }else if(state.mission==='match'){
      const distance=Math.hypot(r[0]-state.target[0],r[1]-state.target[1]);
      kicker.textContent=isSuccess?'TARGET LOCKED':'VECTOR MATCH';
      title.textContent=isSuccess?'목표 벡터와 정확히 일치했습니다!':'초록 결과를 목표 ('+state.target.join(', ')+')에 겹쳐 보세요.';
      copy.textContent=isSuccess?'두 입력 벡터의 합이 목표 이동을 만들었습니다. 새 목표에도 도전해 보세요.':'현재 차이 '+distance.toFixed(1)+'칸 · 빨강과 파랑 끝점을 모두 움직일 수 있습니다.';
      meter.style.width=Math.max(4,100-distance/12*100)+'%';
    }else{
      const gap=theta===null?90:Math.abs(90-theta);
      kicker.textContent=isSuccess?'90° LOCKED':'90° LOCK';
      title.textContent=isSuccess?'내적이 0, 두 벡터가 수직입니다!':'두 벡터의 사이각을 정확히 90°로 만드세요.';
      copy.textContent=isSuccess?'성분은 달라도 내적이 0이면 두 방향은 서로 수직입니다.':'현재 내적 '+dot+' · 90°까지 '+gap.toFixed(1)+'° 남았습니다.';
      meter.style.width=Math.max(4,100-gap/90*100)+'%';
    }
  }

  function render(){
    const r=draw(),dot=state.a[0]*state.b[0]+state.a[1]*state.b[1],theta=angle(),isSuccess=success(r,dot);
    tex('vectorInputs','\\(\\vec a=('+state.a.join(',\\,')+'),\\quad\\vec b=('+state.b.join(',\\,')+')\\)');
    tex('vectorOperation',state.mode==='add'?'\\(\\vec a+\\vec b=('+r.join(',\\,')+')\\)':state.mode==='sub'?'\\(\\vec a-\\vec b=('+r.join(',\\,')+')\\)':'\\('+state.k+'\\vec a=('+r.join(',\\,')+')\\)');
    tex('vectorMagnitude','\\(\\sqrt{'+(r[0]*r[0]+r[1]*r[1])+'}\\approx '+Math.hypot.apply(null,r).toFixed(2)+'\\)');
    tex('vectorDot','\\(\\vec a\\cdot\\vec b='+dot+'\\)');
    tex('vectorAngle',theta===null?'정의되지 않음':'\\(\\theta\\approx '+theta.toFixed(1)+'^\\circ\\)');
    document.getElementById('vectorKRow').classList.toggle('hidden',state.mode!=='scale');
    document.getElementById('vectorKLabel').textContent=state.k.toFixed(1);
    svg.classList.toggle('mission-success',isSuccess);
    updateMission(r,dot,theta,isSuccess);
  }

  function reset(){
    state.a=[3,1];
    state.b=[1,2];
    state.k=2;
    state.trails={a:[],b:[]};
    document.getElementById('vectorK').value=2;
  }

  function setMission(name){
    state.mission=name;
    reset();
    if(name==='match'){
      state.mode='add';
      state.target=targets[state.missionIndex%targets.length];
    }else if(name==='perp'){
      state.mode='add';
      state.a=[3,1];
      state.b=[2,3];
    }
    document.querySelectorAll('[data-mission]').forEach(function(button){button.classList.toggle('active',button.dataset.mission===name);});
    document.querySelectorAll('[data-vmode]').forEach(function(button){button.classList.toggle('active',button.dataset.vmode===state.mode);});
    operationChips.classList.toggle('mission-locked',name!=='free');
    render();
  }

  document.querySelectorAll('[data-mission]').forEach(function(button){button.addEventListener('click',function(){setMission(button.dataset.mission);});});
  nextButton.addEventListener('click',function(){
    state.missionIndex++;
    reset();
    if(state.mission==='match')state.target=targets[state.missionIndex%targets.length];
    if(state.mission==='perp'){state.a=[2+(state.missionIndex%3),1];state.b=[1,2+(state.missionIndex%2)];}
    render();
  });
  document.querySelectorAll('[data-vmode]').forEach(function(button){button.addEventListener('click',function(){if(state.mission!=='free')return;state.mode=button.dataset.vmode;render();});});
  document.getElementById('vectorK').addEventListener('input',function(event){state.k=+event.target.value;render();});
  document.getElementById('vectorReset').addEventListener('click',function(){reset();if(state.mission==='perp')state.b=[2,3];render();});
  svg.addEventListener('pointerdown',function(event){
    if(!event.target.dataset.vector)return;
    dragVector=event.target.dataset.vector;
    svg.classList.add('is-dragging');
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener('pointermove',function(event){
    if(!dragVector)return;
    const rect=svg.getBoundingClientRect(),px=(event.clientX-rect.left)/rect.width*640,py=(event.clientY-rect.top)/rect.height*400,g=G.cartesian(svg,{xmin:-6,xmax:6,ymin:-5,ymax:5});
    const next=[G.clamp(Math.round(g.xOf(px)),-5,5),G.clamp(Math.round(g.yOf(py)),-4,4)];
    if(next[0]===state[dragVector][0]&&next[1]===state[dragVector][1])return;
    state.trails[dragVector].push(state[dragVector].slice());
    state.trails[dragVector]=state.trails[dragVector].slice(-7);
    state[dragVector]=next;
    render();
  });
  function endDrag(){dragVector=null;svg.classList.remove('is-dragging');}
  svg.addEventListener('pointerup',endDrag);
  svg.addEventListener('pointercancel',endDrag);
  render();
})();
