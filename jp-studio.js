/* JP Math Lab · 실제 값에서 시작하는 세 과목의 입구. */
(() => {
  'use strict';
  const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
  function model(subject,value){
    if(subject==='calculus'){const x=clamp(Number(value)||0,-1.8,1.8);return{x,y:x*x*x/3-x,slope:x*x-1}}
    if(subject==='geometry'){const d=clamp(Number(value)||0,-1.1,1.1),r=Math.abs(d)<=1?Math.sqrt(Math.max(0,1-d*d)):null;return{d,r,R:1}}
    const rate=clamp(Number(value)||0,0,12),principal=100,years=8,simple=principal*(1+rate/100*years),compound=principal*(1+rate/100)**years;return{rate,principal,years,simple,compound,gap:compound-simple};
  }
  const project=(p,yaw,pitch=.35)=>{const x=p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw),z=-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw);return[x,p[1]*Math.cos(pitch)-z*Math.sin(pitch),p[1]*Math.sin(pitch)+z*Math.cos(pitch)]};
  if(typeof module==='object'&&module.exports)module.exports={model,project};
  if(typeof document==='undefined')return;
  const script=document.currentScript,root=new URL('./',script.src),home=document.body.classList.contains('jp-home'),path=decodeURIComponent(location.pathname);
  const subject=home?'calculus':path.includes('/미적분1/')?'calculus':path.includes('/기하/')?'geometry':path.includes('/경제수학/')?'economics':null;
  if(!subject)return;
  const mount=document.querySelector(home?'.intro-object':subject==='calculus'?'.hero-motion-map':subject==='geometry'?'.hero-space-map':'.econ-hero-visual');if(!mount)return;
  const config={
    calculus:{label:'미적분Ⅰ',title:'점을 옮기면, 기울기가 달라집니다.',help:'접점을 움직이며 곡선과 접선을 함께 보세요.',min:-1.8,max:1.8,step:.01,value:.65,input:'접점의 x좌표',formula:'f(x) = x³/3 − x',route:'미적분1/미적분1_접선의방정식.html#lab',action:'접선 실험 이어가기',color:'#efc3a0'},
    geometry:{label:'기하',title:'평면이 지나간 자리에, 원이 남습니다.',help:'평면의 높이를 바꾸어 단면의 크기를 비교하세요.',min:-1.1,max:1.1,step:.01,value:.35,input:'평면의 높이 d',formula:'r² + d² = R² · R = 1',route:'기하/기하_구의방정식.html#lab',action:'구의 단면 더 살펴보기',color:'#c4cef2'},
    economics:{label:'경제수학',title:'같은 이율, 쌓이는 방식은 다릅니다.',help:'이율을 바꾸어 8년 뒤 두 금액의 차이를 보세요.',min:0,max:12,step:.2,value:6,input:'연 이율',formula:'원금 100 · 8년 · 매년 같은 이율의 예시',route:'경제수학/교과서학습.html',action:'경제수학 개념 더 보기',color:'#bbd4bb'}
  };
  const frame=document.createElement('section');frame.className='studio-frame';frame.setAttribute('aria-label','직접 움직여 보는 수학');
  frame.innerHTML=(home?'<div class="studio-subjects" role="group" aria-label="실험할 과목">'+Object.entries(config).map(([key,c])=>'<button type="button" data-studio-subject="'+key+'" aria-pressed="'+(key===subject)+'">'+c.label+'</button>').join('')+'</div>':'<div class="studio-plaque"><span>손으로 시작하는 수학</span><b>01 / 작은 실험</b></div>')+'<div class="studio-canvas-wrap"><canvas aria-hidden="true"></canvas><span class="studio-formula"></span></div><div class="studio-controls"><div class="studio-control-label"><label for="studioParameter"></label><output for="studioParameter"></output></div><input id="studioParameter" type="range"><p class="studio-observation" aria-live="off"></p></div><div class="studio-next"><span class="studio-help"></span><a></a></div>';
  mount.replaceWith(frame);document.documentElement.classList.add('jp-studio');document.body.classList.add('jp-studio-hub');document.body.dataset.studioSubject=subject;
  if(home){document.querySelectorAll('[data-scene]').forEach(s=>s.classList.add('is-visible'));document.querySelector('[data-global-header]')?.setAttribute('data-theme','light')}
  const canvas=frame.querySelector('canvas'),ctx=canvas.getContext('2d'),range=frame.querySelector('input'),output=frame.querySelector('output'),observation=frame.querySelector('.studio-observation'),label=frame.querySelector('label');
  if(!ctx){frame.remove();return}
  let active=subject,value=config[subject].value,target=value,time=0,raf=0,last=0,visible=true,closed=false;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const link=frame.querySelector('.studio-next a'),formula=frame.querySelector('.studio-formula');
  function select(key){active=key;const c=config[key];value=target=c.value;document.body.dataset.studioSubject=key;frame.dataset.subject=key;frame.style.setProperty('--studio-line',c.color);range.min=c.min;range.max=c.max;range.step=c.step;range.value=value;range.setAttribute('aria-label',c.input);label.textContent=c.input;formula.textContent=c.formula;frame.querySelector('.studio-help').textContent=c.help;link.href=new URL(c.route,root);link.textContent=c.action+' →';frame.querySelectorAll('[data-studio-subject]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.studioSubject===key)));paint();start()}
  function fit(){const b=canvas.getBoundingClientRect(),w=Math.max(1,b.width),h=Math.max(1,b.height),dpr=Math.min(devicePixelRatio||1,1.8);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);return{w,h}}
  function line(points,color,width=1,dash=[]){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([])}
  function dot(p,color,r=4){ctx.beginPath();ctx.arc(p[0],p[1],r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
  function text(s,x,y,color='#c6c7bf',size=11){ctx.font='400 '+size+'px "IBM Plex Sans KR",sans-serif';ctx.fillStyle=color;ctx.fillText(s,x,y)}
  function calculus(w,h,m){
    const X=x=>30+(x+2.2)/4.4*(w-60),Y=y=>h*.5-y*(h*.32),f=x=>x*x*x/3-x;
    for(const x of[-2,-1,0,1,2])line([[X(x),25],[X(x),h-22]],'#efd4b90d');line([[24,Y(0)],[w-24,Y(0)]],'#dfcebd38');line([[X(0),24],[X(0),h-22]],'#dfcebd25');
    const points=Array.from({length:141},(_,i)=>{const x=-2.15+4.3*i/140;return[X(x),Y(f(x))]});line(points,'#efdfcc',2.1);
    const from=m.x-1.0,to=m.x+1.0;line([[X(from),Y(m.y+m.slope*(from-m.x))],[X(to),Y(m.y+m.slope*(to-m.x))]],'#eab398',1.6);line([[X(m.x),Y(0)],[X(m.x),Y(m.y)]],'#cfb39d66',1,[3,5]);dot([X(m.x),Y(m.y)],'#f4dfb9',5);dot([X(m.x),Y(m.y)],'#fff8e9',2);text('x',w-22,Y(0)-8);text('f(x)',X(-2.0),Y(f(-2.0))-13,'#d7d7c9');
    output.textContent='x = '+m.x.toFixed(2);observation.textContent='순간 기울기 f′(x) = '+m.slope.toFixed(2)+' · '+(Math.abs(m.slope)<.03?'접선이 수평에 가까워졌어요.':m.slope>0?'오른쪽으로 갈수록 올라갑니다.':'오른쪽으로 갈수록 내려갑니다.');
  }
  function geometry(w,h,m){
    const size=Math.min(w*.28,h*.40),cx=w*.5,cy=h*.51,yaw=.5+time*.055,P=p=>{const q=project(p,yaw);return[cx+q[0]*size,cy-q[1]*size,q[2]]};
    const wire=(axis,k,front)=>{let pts=[];for(let i=0;i<=90;i++){const q=i/90*Math.PI*2,p=axis==='lat'?[Math.cos(k)*Math.cos(q),Math.sin(k),Math.cos(k)*Math.sin(q)]:[Math.cos(q)*Math.cos(k),Math.sin(q),Math.cos(q)*Math.sin(k)],v=P(p);if((v[2]>=0)===front)pts.push(v);else{if(pts.length>1)line(pts,front?'#b6c8e17a':'#9aaad42b',front?1.1:.8);pts=[]}}if(pts.length>1)line(pts,front?'#b6c8e17a':'#9aaad42b',front?1.1:.8)};
    for(const front of[false,true]){if(front){const plane=[[-1.25,m.d,-1.15],[1.25,m.d,-1.15],[1.25,m.d,1.15],[-1.25,m.d,1.15]].map(P);ctx.beginPath();plane.forEach((p,i)=>i?ctx.lineTo(...p.slice(0,2)):ctx.moveTo(...p.slice(0,2)));ctx.closePath();ctx.fillStyle='#a4b5e119';ctx.fill();line([...plane,plane[0]],'#acbbe446')}
      for(const k of[-Math.PI/3,-Math.PI/6,0,Math.PI/6,Math.PI/3])wire('lat',k,front);for(const k of[0,Math.PI/4,Math.PI/2,Math.PI*.75])wire('lon',k,front)}
    const O=P([0,0,0]),C=P([0,m.d,0]);line([O,C],'#d2dcf180',1,[3,5]);dot(O,'#d3d9ec',2.5);
    if(m.r!==null){const ring=Array.from({length:101},(_,i)=>{const a=i/100*Math.PI*2;return P([m.r*Math.cos(a),m.d,m.r*Math.sin(a)])});line(ring,'#e2e5f0',2.2);const Q=P([m.r,m.d,0]);line([C,Q],'#e4c899',1.5);dot(C,'#e5e5e9',2.5);text('r',(C[0]+Q[0])/2+6,(C[1]+Q[1])/2-7,'#e4c899',12)}
    output.textContent='d = '+m.d.toFixed(2);observation.textContent=m.r===null?'|d| > R · 평면이 구를 벗어나 단면이 없습니다.':'단면의 반지름 r = '+m.r.toFixed(3)+' · '+(Math.abs(m.d)<.05?'중심을 지나면 가장 큰 원이 됩니다.':'중심에서 멀어질수록 원이 작아집니다.');
  }
  function economics(w,h,m){
    const X=t=>34+t/8*(w-82),Y=v=>h-23-(v-90)/170*(h-48),end=m.compound;
    line([[30,Y(100)],[w-30,Y(100)]],'#c2d0bc45');const comp=[],simple=[];for(let i=0;i<=100;i++){const t=i/100*8;comp.push([X(t),Y(100*(1+m.rate/100)**t)]);simple.push([X(t),Y(100*(1+m.rate/100*t))])}
    ctx.beginPath();comp.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));[...simple].reverse().forEach(p=>ctx.lineTo(...p));ctx.closePath();ctx.fillStyle='#c8ddaf26';ctx.fill();line(simple,'#bdc2a4a0',1.3,[4,5]);line(comp,'#dce5bf',2.2);line([[X(8),Y(m.simple)],[X(8),Y(end)]],'#e3c78c',2);dot([X(8),Y(end)],'#eff1d7');text('복리',X(8)+8,Y(end)+4,'#e2e7cb',11);text('단리',X(8)+8,Y(m.simple)+15,'#bfc6b7',11);text('0년',X(0),h-7);text('8년',X(8)-12,h-7);text('100',6,Y(100)+4);
    output.textContent=m.rate.toFixed(1)+'%';observation.textContent='8년 뒤 · 단리 '+m.simple.toFixed(1)+' / 복리 '+m.compound.toFixed(1)+' · 차이 '+m.gap.toFixed(1);
  }
  function paint(){const {w,h}=fit(),m=model(active,value);ctx.save();ctx.beginPath();ctx.rect(0,0,w,h);ctx.clip();if(active==='calculus')calculus(w,h,m);else if(active==='geometry')geometry(w,h,m);else economics(w,h,m);ctx.restore()}
  function stop(){cancelAnimationFrame(raf);raf=0;last=0}
  function start(){if(raf||closed||!visible||document.hidden||motion.matches)return;const tick=now=>{if(closed||!visible||document.hidden||motion.matches){stop();return}const dt=last?Math.min((now-last)/1000,.08):0;if(!last||now-last>=32){last=now;time+=dt;value+=(target-value)*(1-Math.exp(-dt*12));if(Math.abs(target-value)<.002)value=target;paint()}if(active==='geometry'||value!==target)raf=requestAnimationFrame(tick);else{raf=0;last=0}};raf=requestAnimationFrame(tick)}
  range.addEventListener('input',()=>{target=Number(range.value);if(motion.matches){value=target;paint()}else start()});frame.querySelectorAll('[data-studio-subject]').forEach(b=>b.addEventListener('click',()=>{stop();select(b.dataset.studioSubject)}));
  const resize=new ResizeObserver(()=>paint());resize.observe(frame);
  const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible){paint();start()}else stop()},{threshold:.05});visibility.observe(frame);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else{paint();start()}});motion.addEventListener('change',()=>{stop();value=target;paint();start()});window.addEventListener('pagehide',()=>{closed=true;stop()});window.addEventListener('pageshow',()=>{closed=false;paint();start()});
  select(subject);
  if(!home){const trail=document.createElement('aside');trail.className='studio-trail';trail.innerHTML='<div><span>개념에서 나만의 질문으로</span><p>이 과목을 탐구한 학생들의 시도와 발견을 만나 보세요.</p></div><a href="'+new URL('주제탐구/gallery/#/collection?subject='+subject,root)+'">'+config[subject].label+' 탐구 전시 <b aria-hidden="true">↗</b></a>';frame.closest('header').after(trail)}
})();
