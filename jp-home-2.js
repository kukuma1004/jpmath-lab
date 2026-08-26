(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const palette = {
    ink: '#19312d', grid: 'rgba(25,49,45,.11)', orange: '#cc6845', yellow: '#edc85f',
    green: '#6fc7aa', blue: '#8fa3ff', white: '#f6f2e8'
  };

  function setupCanvas(canvas) {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    return { ctx, width, height };
  }

  function drawGrid(ctx, width, height, color = palette.grid, step = 34) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = step; x < width; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
    for (let y = step; y < height; y += step) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
    ctx.stroke();
  }

  function dot(ctx, x, y, color, radius = 7) {
    ctx.beginPath();
    ctx.arc(x, y, radius + 8, 0, Math.PI * 2);
    ctx.fillStyle = color.replace('1)', '.14)');
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  const scenes = [...document.querySelectorAll('[data-scene]')];
  if ('IntersectionObserver' in window) {
    const sceneObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    }, { threshold: .28 });
    scenes.forEach(scene => sceneObserver.observe(scene));
  } else {
    scenes.forEach(scene => scene.classList.add('is-visible'));
  }

  const globalHeader = document.querySelector('[data-global-header]');
  if (globalHeader) globalHeader.dataset.theme = scenes[0]?.dataset.headerTheme || 'dark';
  if ('IntersectionObserver' in window && globalHeader) {
    const headerObserver = new IntersectionObserver(entries => {
      const centered = entries.find(entry => entry.isIntersecting);
      if (centered) globalHeader.dataset.theme = centered.target.dataset.headerTheme || 'light';
    }, { rootMargin: '-46% 0px -46% 0px', threshold: 0 });
    scenes.forEach(scene => headerObserver.observe(scene));
  } else if (globalHeader) {
    globalHeader.dataset.theme = 'dark';
  }

  const introCanvas = document.getElementById('introCanvas');
  let introPointer = { x: .5, y: .5 };
  let introFrame = 0;
  let introActive = true;

  function drawIntro(time = 0) {
    const stage = setupCanvas(introCanvas);
    if (!stage) return;
    const { ctx, width, height } = stage;
    const t = reducedMotion ? 0 : time / 1800;
    const centerY = height * (.5 + (introPointer.y - .5) * .08);
    const amplitude = height * (.17 + introPointer.x * .06);
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, 'rgba(237,200,95,.15)');
    gradient.addColorStop(.45, 'rgba(237,200,95,.95)');
    gradient.addColorStop(1, 'rgba(111,199,170,.7)');
    ctx.lineWidth = 3;
    ctx.strokeStyle = gradient;
    ctx.beginPath();
    for (let i = 0; i <= 180; i++) {
      const px = i / 180 * width;
      const phase = i / 180 * Math.PI * 3.2;
      const py = centerY + Math.sin(phase + t) * amplitude * (.4 + i / 240) + Math.cos(phase * .45 - t) * height * .05;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();

    const count = 22;
    for (let i = 0; i < count; i++) {
      const a = i / count * Math.PI * 2 + t * .22;
      const rx = width * (.2 + (i % 3) * .03);
      const ry = height * (.31 + (i % 4) * .018);
      const x = width * .55 + Math.cos(a) * rx;
      const y = height * .5 + Math.sin(a) * ry;
      ctx.beginPath(); ctx.arc(x, y, i % 5 === 0 ? 3 : 1.5, 0, Math.PI * 2);
      ctx.fillStyle = i % 5 === 0 ? 'rgba(237,200,95,.8)' : 'rgba(246,242,232,.28)'; ctx.fill();
    }
  }

  function animateIntro(time) {
    if (introActive) drawIntro(time);
    introFrame = window.requestAnimationFrame(animateIntro);
  }

  introCanvas?.addEventListener('pointermove', event => {
    const rect = introCanvas.getBoundingClientRect();
    introPointer = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
  });

  const introScene = document.getElementById('intro');
  if ('IntersectionObserver' in window && introScene) {
    new IntersectionObserver(([entry]) => { introActive = entry.isIntersecting; }, { threshold: .05 }).observe(introScene);
  }
  if (reducedMotion) drawIntro(0); else introFrame = window.requestAnimationFrame(animateIntro);

  const dailyFunctions = [
    { formula: 'f(x) = 0.38x³ − 1.1x', f: x => .38*x*x*x - 1.1*x, d: x => 1.14*x*x - 1.1, scale: .19 },
    { formula: 'f(x) = 0.72x² − 1.4', f: x => .72*x*x - 1.4, d: x => 1.44*x, scale: .22 },
    { formula: 'f(x) = 1.7sin(x)', f: x => 1.7*Math.sin(x), d: x => 1.7*Math.cos(x), scale: .22 },
    { formula: 'f(x) = 0.16x⁴ − 0.9x²', f: x => .16*x**4 - .9*x*x, d: x => .64*x**3 - 1.8*x, scale: .18 }
  ];
  const dayNumber = Math.floor(Date.now() / 86400000);
  const daily = dailyFunctions[((dayNumber % dailyFunctions.length) + dailyFunctions.length) % dailyFunctions.length];
  const calculusCanvas = document.getElementById('calculusCanvas');
  const dailyFormula = document.getElementById('dailyFormula');
  const calcX = document.getElementById('calcX');
  const calcY = document.getElementById('calcY');
  const calcSlope = document.getElementById('calcSlope');
  let calcPosition = .58;
  if (dailyFormula) dailyFormula.textContent = daily.formula;

  function drawCalculus() {
    const stage = setupCanvas(calculusCanvas);
    if (!stage) return;
    const { ctx, width, height } = stage;
    drawGrid(ctx, width, height, 'rgba(104,61,43,.09)', 34);
    const pad = Math.min(42, width * .08);
    const mapX = x => pad + (x + 3) / 6 * (width - pad * 2);
    const mapY = y => height * .5 - y * height * daily.scale;
    ctx.strokeStyle = 'rgba(25,49,45,.38)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, height*.5); ctx.lineTo(width-pad, height*.5); ctx.moveTo(mapX(0), 18); ctx.lineTo(mapX(0), height-18); ctx.stroke();
    ctx.strokeStyle = palette.orange; ctx.lineWidth = 3; ctx.beginPath();
    for (let i = 0; i <= 180; i++) {
      const x = -3 + i / 180 * 6;
      const y = daily.f(x);
      i ? ctx.lineTo(mapX(x), mapY(y)) : ctx.moveTo(mapX(x), mapY(y));
    }
    ctx.stroke();
    const x = -3 + calcPosition * 6;
    const y = daily.f(x);
    const slope = daily.d(x);
    const span = 1.2;
    ctx.strokeStyle = '#8f6820'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(mapX(x-span), mapY(y-slope*span)); ctx.lineTo(mapX(x+span), mapY(y+slope*span)); ctx.stroke();
    dot(ctx, mapX(x), mapY(y), 'rgba(204,104,69,1)', 6);
    if (calcX) calcX.textContent = `x = ${x.toFixed(2)}`;
    if (calcY) calcY.textContent = `f(x) = ${y.toFixed(2)}`;
    if (calcSlope) calcSlope.textContent = `f′(x) = ${slope.toFixed(2)}`;
  }

  function setCalcFromPointer(event) {
    const rect = calculusCanvas.getBoundingClientRect();
    calcPosition = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    drawCalculus();
  }

  calculusCanvas?.addEventListener('pointerdown', event => {
    calculusCanvas.setPointerCapture(event.pointerId);
    setCalcFromPointer(event);
  });
  calculusCanvas?.addEventListener('pointermove', event => { if (event.buttons) setCalcFromPointer(event); });
  calculusCanvas?.addEventListener('keydown', event => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    calcPosition = Math.max(0, Math.min(1, calcPosition + (event.key === 'ArrowRight' ? .025 : -.025)));
    drawCalculus();
  });

  const spaceCanvas = document.getElementById('spaceCanvas');
  const vectorFormula = document.getElementById('vectorFormula');
  const vectorLength = document.getElementById('vectorLength');
  const vectorAngle = document.getElementById('vectorAngle');
  let vector = { x: 2, y: 1, z: 1.5 };

  function project3d(point, width, height) {
    const scale = Math.min(width, height) * .13;
    return {
      x: width * .48 + (point.x - point.y) * scale * .86,
      y: height * .60 - point.z * scale + (point.x + point.y) * scale * .32
    };
  }

  function arrow3d(ctx, from, to, color) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
    const a = Math.atan2(to.y-from.y, to.x-from.x);
    ctx.beginPath(); ctx.moveTo(to.x,to.y); ctx.lineTo(to.x-13*Math.cos(a-.5),to.y-13*Math.sin(a-.5)); ctx.lineTo(to.x-13*Math.cos(a+.5),to.y-13*Math.sin(a+.5)); ctx.closePath(); ctx.fill();
  }

  function drawSpace() {
    const stage = setupCanvas(spaceCanvas);
    if (!stage) return;
    const { ctx, width, height } = stage;
    drawGrid(ctx, width, height, 'rgba(255,255,255,.045)', 38);
    const origin = project3d({x:0,y:0,z:0}, width, height);
    const axes = [
      [{x:3.1,y:0,z:0}, '#6fc7aa', 'x'], [{x:0,y:3.1,z:0}, '#edc85f', 'y'], [{x:0,y:0,z:3.1}, '#8fa3ff', 'z']
    ];
    ctx.font = '600 12px IBM Plex Mono';
    axes.forEach(([point,color,label]) => {
      const end = project3d(point,width,height); arrow3d(ctx,origin,end,color); ctx.fillStyle=color; ctx.fillText(label,end.x+7,end.y-5);
    });
    const floor = [{x:0,y:0,z:0},{x:3,y:0,z:0},{x:3,y:3,z:0},{x:0,y:3,z:0}].map(p=>project3d(p,width,height));
    ctx.fillStyle='rgba(111,199,170,.045)'; ctx.beginPath(); floor.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)); ctx.closePath(); ctx.fill();
    const end = project3d(vector,width,height);
    arrow3d(ctx,origin,end,'#f6f2e8');
    ctx.setLineDash([4,5]); ctx.strokeStyle='rgba(246,242,232,.24)'; ctx.lineWidth=1;
    const floorEnd=project3d({x:vector.x,y:vector.y,z:0},width,height);
    ctx.beginPath(); ctx.moveTo(end.x,end.y); ctx.lineTo(floorEnd.x,floorEnd.y); ctx.stroke(); ctx.setLineDash([]);
    dot(ctx,end.x,end.y,'rgba(143,163,255,1)',7);
    const length=Math.hypot(vector.x,vector.y,vector.z);
    const angle=Math.atan2(vector.z,Math.hypot(vector.x,vector.y))*180/Math.PI;
    if(vectorFormula) vectorFormula.textContent=`v = (${vector.x.toFixed(1)}, ${vector.y.toFixed(1)}, ${vector.z.toFixed(1)})`;
    if(vectorLength) vectorLength.textContent=length.toFixed(2);
    if(vectorAngle) vectorAngle.textContent=`${angle.toFixed(1)}°`;
  }

  function setVectorFromPointer(event) {
    const rect=spaceCanvas.getBoundingClientRect();
    const nx=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
    const ny=Math.max(0,Math.min(1,(event.clientY-rect.top)/rect.height));
    vector.x=.2+nx*2.8; vector.y=.2+(1-nx)*2.1; vector.z=.2+(1-ny)*2.8;
    drawSpace();
  }
  spaceCanvas?.addEventListener('pointerdown',event=>{spaceCanvas.setPointerCapture(event.pointerId);setVectorFromPointer(event);});
  spaceCanvas?.addEventListener('pointermove',event=>{if(event.buttons)setVectorFromPointer(event);});
  spaceCanvas?.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
    event.preventDefault();
    if(event.key==='ArrowLeft')vector.x-=.1;if(event.key==='ArrowRight')vector.x+=.1;
    if(event.key==='ArrowUp')vector.z+=.1;if(event.key==='ArrowDown')vector.z-=.1;
    vector.x=Math.max(.1,Math.min(3,vector.x));vector.z=Math.max(.1,Math.min(3,vector.z));drawSpace();
  });

  const economyCanvas=document.getElementById('economyCanvas');
  const priceRange=document.getElementById('priceRange');
  const priceValue=document.getElementById('priceValue');
  const demandValue=document.getElementById('demandValue');
  const revenueValue=document.getElementById('revenueValue');
  const economyFeedback=document.getElementById('economyFeedback');

  function economicValues(price){const demand=Math.max(0,120-6*price);return{demand,revenue:price*demand};}
  function drawEconomy(){
    const stage=setupCanvas(economyCanvas);if(!stage)return;
    const{ctx,width,height}=stage;drawGrid(ctx,width,height,'rgba(93,68,20,.075)',34);
    const pad={l:34,r:18,t:20,b:30},gw=width-pad.l-pad.r,gh=height-pad.t-pad.b;
    const px=p=>pad.l+(p-4)/14*gw,py=r=>height-pad.b-r/600*gh;
    ctx.strokeStyle='rgba(93,68,20,.38)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad.l,pad.t);ctx.lineTo(pad.l,height-pad.b);ctx.lineTo(width-pad.r,height-pad.b);ctx.stroke();
    ctx.strokeStyle='#8f6820';ctx.lineWidth=3;ctx.beginPath();
    for(let i=0;i<=100;i++){const p=4+i/100*14;const r=economicValues(p).revenue;i?ctx.lineTo(px(p),py(r)):ctx.moveTo(px(p),py(r));}ctx.stroke();
    const price=Number(priceRange?.value||10),values=economicValues(price),x=px(price),y=py(values.revenue);
    ctx.setLineDash([4,5]);ctx.strokeStyle='rgba(93,68,20,.34)';ctx.beginPath();ctx.moveTo(x,height-pad.b);ctx.lineTo(x,y);ctx.stroke();ctx.setLineDash([]);dot(ctx,x,y,'rgba(204,104,69,1)',6);
    if(priceValue)priceValue.textContent=price.toFixed(1);
    if(demandValue)demandValue.textContent=`${values.demand.toFixed(0)}개`;
    if(revenueValue)revenueValue.textContent=values.revenue.toFixed(0);
    if(economyFeedback){const distance=Math.abs(price-10);economyFeedback.textContent=distance<1?'매출이 가장 높은 구간':price<10?'수요는 많지만 단가가 낮아요':'단가는 높지만 수요가 줄어요';}
  }
  priceRange?.addEventListener('input',drawEconomy);

  function drawAll(){drawIntro(0);drawCalculus();drawSpace();drawEconomy();}
  let resizeFrame=0;
  window.addEventListener('resize',()=>{window.cancelAnimationFrame(resizeFrame);resizeFrame=window.requestAnimationFrame(drawAll);},{passive:true});
  drawCalculus();drawSpace();drawEconomy();

  window.addEventListener('pagehide',()=>window.cancelAnimationFrame(introFrame),{once:true});
})();
