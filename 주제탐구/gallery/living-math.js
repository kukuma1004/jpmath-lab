import {newtonSteps,derivativeCoefficients,interlacedRoots} from './motion-frames.js';

// Editorial examples, separate from student records. Coordinates are in one 760 × 470 plane.
export const SPATIAL_FAMILIES=new Set(['volume','surface','space-points','dimension','ellipsoid','projection','cone-cut','line-plane','minimum','plane-distance','overlap','cone-discriminant','dot','sphere-extreme','sphere-slice']);
export const studioWave=(time,speed=.22)=>.5-.5*Math.cos(time*speed);
export function sphereSection(radius,distance){return Math.abs(distance)>radius?null:Math.sqrt(Math.max(0,radius*radius-distance*distance))}
export function focalPoint(a,c,angle){const b=Math.sqrt(a*a-c*c);return[a*Math.cos(angle),b*Math.sin(angle)]}
export function tangentRoots(b){
  const f=x=>2*x*x*x-3*x*x+b,roots=[];
  for(const x of[0,1])if(Math.abs(f(x))<1e-9)roots.push(x);
  for(const [left,right]of[[-4,0],[0,1],[1,4]]){let a=left,z=right;if(f(a)*f(z)>=0)continue;for(let i=0;i<50;i++){const m=(a+z)/2;if(f(a)*f(m)<=0)z=m;else a=m}roots.push((a+z)/2)}
  return roots.sort((a,b)=>a-b);
}
export function liveMathFrame(family,time,phase=0){
  const paths=[],dots=[],labels=[],values={},wave=studioWave(time),angle=time*.18+.55,s=Math.max(0,Math.min(6,Math.round(phase)));
  const at=list=>{const p=Math.max(0,Math.min(6,phase)),i=Math.floor(p),f=p-i;return list[i]*(1-f)+list[Math.min(6,i+1)]*f};
  const map=(x,y)=>[380+x*88,262-y*53];
  const line=(pts,role='primary',closed=false)=>paths.push({points:pts,role,closed});
  const dot=(p,text='',role='primary')=>{dots.push({point:p,role});if(text)labels.push({point:[p[0]+11,p[1]-13],text})};
  const label=(text,p)=>labels.push({text,point:p});
  const plot=(f,min=-2.5,max=2.5,role='primary',mapper=map)=>{let pts=[];for(let i=0;i<=160;i++){const x=min+(max-min)*i/160,p=mapper(x,f(x));if(!p.every(Number.isFinite)||p[1]<38||p[1]>394){if(pts.length>1)line(pts,role);pts=[]}else pts.push(p)}if(pts.length>1)line(pts,role)};
  const curve=(pts,role='primary')=>line(pts.map(p=>map(...p)),role);
  const axes=()=>{line([[80,262],[689,262]],'axis');line([[380,46],[380,391]],'axis')};
  const tangent=(f,df,a,role='secondary',mapper=map)=>{plot(x=>f(a)+df(a)*(x-a),-2.8,2.8,role,mapper);dot(mapper(a,f(a)),'P')};
  const ellipse=(a,b)=>curve(Array.from({length:181},(_,i)=>{const q=i/180*2*Math.PI;return[a*Math.cos(q),b*Math.sin(q)]}));
  let metric='',description='수식으로 계산한 전시 예시 모형';
  if(family==='riemann'){
    const n=Math.max(3,Math.round(at([5,8,18,10,30,45,22])*(.8+.4*wave))),base=353,left=117,W=526,H=255;
    for(let i=0;i<n;i++){const x=left+i*W/n,lo=H*(i/n)**2,hi=H*((i+1)/n)**2;line([[x,base],[x,base-hi],[x+W/n,base-hi],[x+W/n,base]],'wash',true);line([[x,base-lo],[x+W/n,base-lo]],'secondary')}
    plot(x=>x*x,0,1,'primary',(x,y)=>[left+x*W,base-y*H]);line([[105,base],[660,base]],'axis');
    const lower=(n-1)*(2*n-1)/(6*n*n),upper=(n+1)*(2*n+1)/(6*n*n);Object.assign(values,{n,lower,upper,integral:1/3});metric='n = '+n+'   좌합 '+lower.toFixed(4)+'  ≤  1/3  ≤  우합 '+upper.toFixed(4);description='분할 수를 바꾸어 두 합 사이에 적분값이 남는 모습을 봅니다.';
  }else if(family==='signed'){
    axes();const end=s===4||s===5?2:-2+4*wave;plot(x=>x,-2,2);
    if(end<0)line([map(-2,0),map(-2,-2),map(end,end),map(end,0)],'negative',true);
    else{line([map(-2,0),map(-2,-2),map(0,0)],'negative',true);line([map(0,0),map(end,end),map(end,0)],'wash',true)}
    dot(map(end,end),'b');Object.assign(values,{end,integral:(end*end-4)/2,area:end<0?(4-end*end)/2:2+end*end/2});metric='b = '+end.toFixed(2)+'   ∫ f = '+values.integral.toFixed(3)+'   ∫ |f| = '+values.area.toFixed(3);description='기준선 위와 아래를 지나며 부호 있는 누적과 넓이가 달라집니다.';
  }else if(['restore','restore-quadratic','antiderivative'].includes(family)){
    axes();const f=family==='restore-quadratic'?x=>x*x:family==='antiderivative'?x=>-Math.cos(x):x=>x*x*x/3-x,C=family==='restore-quadratic'?at([0,0,0,0,2,0,0])+at([.3,.5,1.25,1.4,0,1.25,.8])*Math.sin(time*.21):at([.4,.6,1.25,.7,1,1.25,.8])*Math.sin(time*.21);
    for(const c of[-1.25,0,1.25])plot(x=>f(x)+c,-2.2,2.2,'ghost');plot(x=>f(x)+C,-2.2,2.2);dot(map(1,f(1)+C));values.C=C;metric='C = '+C.toFixed(2)+'   ·   같은 기울기, 다른 출발 높이';description='적분상수가 달라져도 곡선의 각 지점 기울기는 유지됩니다.';
  }else if(family==='rolle'){
    let coeff=[1,2,-67,-68,672,0],roots=[-8,-4,0,3,7];
    const active=Math.min(3,Math.floor(time/4.5)%4),rows=s<2?2:4;let prev=null;for(let row=0;row<rows;row++){const y=106+row*77;line([[94,y],[667,y]],'axis');if(prev)for(const r of roots){const x=380+r*31;line([[x,y-64],[x,y-6]],row===active?'secondary':'ghost');}for(let i=0;i<roots.length;i++){const p=[380+roots[i]*31,y];dot(p,'',row===active?'primary':'ghost');if(row<3&&i<roots.length-1)line([[p[0],y+13],[380+roots[i+1]*31,y+13]],'guide')}label(row===0?'f':row===1?'f′':row===2?'f″':'f‴',[62,y+6]);if(row<3){prev=roots;roots=interlacedRoots(coeff,roots);coeff=derivativeCoefficients(coeff)}}
    values.coefficients=[1,2,-67,-68,672,0];metric='5 → 4 → 3 → 2   ·   서로 다른 두 근 사이, 도함수의 근';description='세로선은 새로 생긴 근이 윗줄의 어느 두 근 사이에서 나왔는지 가리킵니다.';
  }else if(family==='zoom'||family==='secant'){
    const a=.45,h=at([1.4,1.2,.5,.15,.1,.04,.3])*(.85+.3*wave),delta=family==='zoom'?at([2,1.5,.65,1,.2,.09,.4])*(.85+.3*wave):1,f=x=>x*x;
    const mp=family==='zoom'?(x,y)=>[380+(x-a)/delta*100,235-(y-a*a)/delta*68]:map;
    if(family==='secant')axes();else{line([[82,235],[688,235]],'axis');line([[380,50],[380,390]],'axis')}
    plot(f,a-2.7*delta,a+2.7*delta,'primary',mp);plot(x=>a*a+2*a*(x-a),a-2.6*delta,a+2.6*delta,'guide',mp);dot(mp(a,a*a),'A');
    if(family==='secant'){plot(x=>a*a+(2*a+h)*(x-a),-2.3,2.3,'secondary');dot(map(a+h,f(a+h)),'B');metric='h = '+h.toFixed(3)+'   ·   할선 '+(2*a+h).toFixed(3)+' → 접선 '+(2*a).toFixed(3)}
    else{line([mp(a+delta,f(a+delta)),mp(a+delta,a*a+2*a*delta)],'secondary');metric='관찰 범위 δ = '+delta.toFixed(3)+'   ·   최대 차이 δ² = '+(delta*delta).toFixed(4)}Object.assign(values,{h,delta,slope:2*a+h});description=family==='zoom'?'같은 점을 중심으로 범위를 천천히 좁혀 곡선과 접선의 차이를 봅니다.':'두 번째 점이 접근하면 실제 할선의 기울기가 접선에 가까워집니다.';
  }else if(family==='limits'){
    axes();const h=.035+1.65*wave,x=1+h;plot(x=>x+1,-2.6,2.6);dot(map(1,2),'','hole');dot(map(x,x+1),'x');dot(map(1-h,2-h));values.x=x;metric='(x²−1)/(x−1) = x+1, x≠1   ·   현재 '+(x+1).toFixed(3);description='구멍 난 점에 값을 대입하지 않고 양쪽에서 같은 값으로 접근합니다.';
  }else if(family==='ratio'||family==='extrema'||family==='area-scale'){
    axes();const a=.55+.35*wave,n=.8+.22*Math.sin(time*.17),center=.2*Math.sin(time*.13),f=x=>a*((x-center)**3-3*n*n*(x-center));plot(f,-2.7,2.7);
    for(const x of[center-n,center,center+n])dot(map(x,f(x)));
    if(family==='area-scale'){for(const [lo,hi]of[[center-Math.sqrt(3)*n,center],[center,center+Math.sqrt(3)*n]]){const pts=[map(lo,0)];for(let i=0;i<=65;i++){const x=lo+(hi-lo)*i/65;pts.push(map(x,f(x)))}pts.push(map(hi,0));line(pts,'wash',true)}metric='삼차함수 예시   ·   공통 넓이 배율 |a|n⁴ = '+(a*n**4).toFixed(3)}
    else{line([map(center-n,-2),map(center+n,-2)],'guide');metric=family==='ratio'?'극점 −n, +n   ·   변곡점 0에서 수평 거리 1 : 1':'f′ = 0인 두 점과 그 사이의 기울기 변화를 읽습니다.'}Object.assign(values,{a,n,center,areaScale:a*n**4});description=family==='area-scale'?'모양을 변형해도 넓이의 공통 배율이 어떻게 바뀌는지 봅니다.':'삼차함수의 이동과 확대 속에서 극점과 변곡점의 관계를 읽습니다.';
  }else if(family==='newton'){
    const nmap=(x,y)=>[180+x*150,262-y*26];line([[60,262],[700,262]],'axis');line([[180,46],[180,391]],'axis');plot(x=>x*x-2,-.85,3.35,'primary',nmap);const steps=newtonSteps(2.6,4),u=(time/3)%4,index=Math.floor(u);line([nmap(Math.SQRT2,-.62),nmap(Math.SQRT2,.62)],'guide');label('√2',[nmap(Math.SQRT2,0)[0]-10,296]);label('x₀',[nmap(steps[0].x,0)[0]-8,296]);for(let i=0;i<=index;i++){const q=steps[i];line([nmap(q.x,q.y),nmap(q.next,0),nmap(q.next,q.next*q.next-2)],i===index?'secondary':'ghost');dot(nmap(q.x,q.y),'',i===index?'primary':'ghost');dot(nmap(q.next,0),'',i===index?'primary':'ghost');if(i===index)label('x'+(i+1),[nmap(q.next,0)[0]-7,234])}
    const q=steps[index],p=nmap(q.x+(q.next-q.x)*(u-index),q.y*(1-(u-index)));dot(p);Object.assign(values,{steps,index});metric='x'+(index+1)+' = '+q.next.toFixed(6)+'   ·   √2 = '+Math.SQRT2.toFixed(6);description='접선을 따라 다음 근삿값으로 이동하는 뉴턴 방법의 한 번을 천천히 봅니다.';
  }else if(family==='mean-value'){
    axes();plot(x=>x*x,-1.6,2.1);line([map(-1,1),map(2,4)],'guide');const a=-.8+2.6*wave;tangent(x=>x*x,x=>2*x,a);values.a=a;metric='평균 기울기 1   ·   현재 순간 기울기 '+(2*a).toFixed(3)+'   ·   일치: c=1/2';description='접점을 이동하며 평균 기울기와 나란해지는 순간을 찾습니다.';
  }else if(family==='chain'||family==='curvature'){
    axes();const even=phase===3,f=even?x=>x**4:x=>x**3,df=even?x=>4*x**3:x=>3*x*x,a=1.35*Math.sin(time*.2);plot(f,-1.7,1.7);tangent(f,df,a);values.a=a;metric=family==='chain'?(even?'x⁴ : f′의 부호 − → +':'x³ : f′(0)=0이지만 부호 + → +'):(even?'x⁴ : f″(0)=0이지만 오목·볼록은 유지':'x³ : f″(x)=6x   ·   현재 '+(6*a).toFixed(3));description='0이라는 값 하나보다 좌우에서 실제로 바뀌는 방향을 확인합니다.';
  }else if(family==='tangents'||family==='tangent-merge'){
    axes();plot(x=>x**3,-1.45,1.7);const b=family==='tangent-merge'?1+.2*Math.sin(time*.16):.5+.65*Math.sin(time*.16),roots=tangentRoots(b);
    for(const a of roots){plot(x=>3*a*a*x-2*a**3,-2,2,'secondary');dot(map(a,a**3))}dot(map(1,b),'P');Object.assign(values,{b,roots});metric='P(1, '+b.toFixed(3)+')   ·   서로 다른 접선 '+roots.length+'개';description='같은 점을 지나는 접선을 실제 접점 방정식으로 다시 구합니다.';
  }else if(family==='join'){
    axes();const m=phase>=4?2:2+.85*Math.sin(time*.22);line([map(1,-.55),map(1,2.5)],'guide');plot(x=>x*x,-1.7,1);plot(x=>1+2*(x-1),1,2.5,'guide');plot(x=>m*(x-1)+1,1,2.5,'secondary');dot(map(1,1),'');label('x²',[map(-1.25,1.9)[0],map(-1.25,1.9)[1]]);label(Math.abs(m-2)<.02?'기울기 일치':'기울기 어긋남',[map(1.5,0)[0],map(0,0)[1]+30]);values.slope=m;metric='접합점 (1,1)   ·   왼쪽 기울기 2 / 오른쪽 '+m.toFixed(3)+(Math.abs(m-2)<.02?'   ·   매끄럽게 이어짐':'   ·   꺾임');description='점선은 왼쪽 기울기를 그대로 늘인 선입니다. 오른쪽 조각이 그 위에 올라오면 매끄럽게 이어집니다.';
  }else if(family==='model'){
    axes();const fs=[x=>1+.3*x,x=>Math.exp(.5*x),x=>2/(1+Math.exp(-x))];fs.forEach((f,i)=>plot(f,-2.5,2.5,i===1?'primary':'ghost'));
    const x=-2+4*wave;for(const f of fs)dot(map(x,f(x)));values.x=x;metric='일차 · 지수 · 로지스틱   ·   같은 x에서 예측을 비교';description='세 가지 후보 함수의 예시이며 학생의 실측 자료를 대신하지 않습니다.';
  }else if(family==='parabola'||family==='reflection'){
    axes();const p=.8,f=x=>x*x/(4*p),x=2.2*Math.sin(time*.18),Q=map(x,f(x)),F=map(0,p);plot(f,-2.65,2.65);dot(F,'F');dot(Q,'P');
    if(family==='parabola'){line([map(-2.8,-p),map(2.8,-p)],'guide');line([F,Q,map(x,-p)],'secondary');metric='PF = PH = '+(f(x)+p).toFixed(3)+'   ·   준선 y=−0.8'}
    else{line([[Q[0],48],Q,F],'secondary');const travel=studioWave(time,.7),A=travel<.5?[Q[0],48+(Q[1]-48)*travel*2]:[Q[0]+(F[0]-Q[0])*(travel-.5)*2,Q[1]+(F[1]-Q[1])*(travel-.5)*2];dot(A);metric='축과 평행한 입사광   →   포물선의 초점 F'}Object.assign(values,{p,x,y:f(x)});description=family==='parabola'?'포물선 위의 점이 움직여도 초점과 준선까지의 거리는 같습니다.':'입사광과 반사광의 경로가 접점에 따라 연속해서 달라집니다.';
  }else if(family==='focal'||family==='conic-boundary'){
    axes();const c=1.4,hyper=family==='focal'&&phase>=3,a=family==='conic-boundary'?c+.03+1.0*wave:hyper?1.05:2.2,b=Math.sqrt(Math.abs(a*a-c*c));
    let Q;if(hyper){for(const sign of[-1,1])for(const side of[-1,1])plot(x=>sign*b*Math.sqrt(x*x/(a*a)-1),side<0?-2.8:a,side<0?-a:2.8);Q=[a*Math.cosh(.6*Math.sin(angle)),b*Math.sinh(.6*Math.sin(angle))]}
    else{ellipse(a,b);Q=focalPoint(a,c,angle)}curve([[-c,0],Q,[c,0]],'secondary');dot(map(-c,0),'F₁');dot(map(c,0),'F₂');dot(map(...Q),'P');Object.assign(values,{a,c,Q,hyper});metric=hyper?'|PF₁−PF₂| = 2a = '+(2*a).toFixed(3):'PF₁+PF₂ = 2a = '+(2*a).toFixed(3)+'   ·   2c = '+(2*c).toFixed(1);description='초점까지의 거리 조건을 유지하며 점이 곡선을 따라 움직입니다.';
  }else if(family==='conic-tangent'){
    axes();const a=2.2,b=1.35,Q=[a*Math.cos(angle),b*Math.sin(angle)],D=[-a*Math.sin(angle),b*Math.cos(angle)];ellipse(a,b);curve([[Q[0]-2*D[0],Q[1]-2*D[1]],[Q[0]+2*D[0],Q[1]+2*D[1]]],'secondary');dot(map(...Q),'P');values.Q=Q;metric='xx₁/a² + yy₁/b² = 1   ·   수직 접선에서도 같은 접점 조건';description='접점을 연속해서 이동해도 직선은 타원에 접합니다.';
  }else if(family==='rotation'){
    const theta=.85*Math.sin(time*.15),co=Math.cos(theta),si=Math.sin(theta),rotate=(x,y)=>map(co*x-si*y,si*x+co*y);plot(x=>x*x,-1.8,1.8,'ghost');line([rotate(-2.9,0),rotate(2.9,0)]);line([rotate(0,-2.2),rotate(0,3.6)],'secondary');dot(map(1,1),'고정된 점');values.theta=theta;metric='좌표축 회전 '+(theta*180/Math.PI).toFixed(1)+'°   ·   XY 계수 −sin(2θ) = '+(-Math.sin(2*theta)).toFixed(3);description='점과 곡선은 고정하고 좌표축만 천천히 회전합니다.';
  }else if(family==='asymptote'){
    const mp=(x,y)=>[380+x*48,265-y*35];for(const sign of[-1,1]){line([mp(-5,-5*sign),mp(5,5*sign)],'guide');for(const side of[-1,1])plot(x=>sign*Math.sqrt(x*x-1),side<0?-5:1,side<0?-1:5,'primary',mp)}
    const x=1.1+3.7*wave,y=Math.sqrt(x*x-1);line([mp(x,y),mp(x,x)],'secondary');dot(mp(x,y));values.gap=x-y;metric='x²−y²=1   ·   수직 틈 x−√(x²−1) = '+values.gap.toFixed(4);description='쌍곡선 위의 점이 멀어지며 점근선과의 틈이 줄어듭니다.';
  }else if(family==='compound'){
    const exact=r=>Math.log(2)/Math.log(1+r/100),mp=(r,y)=>[105+(r-1)*39,371-y*4.3],r=2+12*wave;plot(exact,1.2,15,'primary',mp);plot(x=>72/x,1.2,15,'guide',mp);line([mp(r,exact(r)),mp(r,72/r)],'secondary');dot(mp(r,exact(r)));Object.assign(values,{rate:r,exact:exact(r),approx:72/r});metric='r='+r.toFixed(2)+'%   ·   정확 '+exact(r).toFixed(3)+'년 / 72의 법칙 '+(72/r).toFixed(3)+'년';description='연 1회 복리와 일정한 이율 모형에서 근사의 오차를 비교합니다.';
  }else throw new Error('연속 모형이 정의되지 않은 주제: '+family);
  return{family,paths,dots,labels,metric,description,values};
}
