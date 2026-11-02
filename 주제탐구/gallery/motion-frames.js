import {motionDesignFor} from './motion-designs.js';
import {enhanceMotionSVG} from './motion-effects.js';

// All coordinates below are explanatory models, never a student's measured output.
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=x=>Number(x.toFixed(3));
const P=(x,y)=>[380+x*78,254-y*48];
const path=(d,cls='primary',extra='')=>'<path d="'+d+'" class="'+cls+'" '+(cls==='guide'?'':'data-draw="" pathLength="1" ')+extra+'/>';
const line=(a,b,cls='primary',key='')=>path('M'+a.map(n).join(' ')+'L'+b.map(n).join(' '),cls,key?'data-morph="'+key+'"':'');
const poly=(pts,cls='primary',closed=false,key='')=>path(pts.map((p,i)=>(i?'L':'M')+p.map(n).join(' ')).join(' ')+(closed?'Z':''),cls,key?'data-morph="'+key+'"':'');
const circle=(x,y,r,cls='primary')=>'<circle cx="'+n(x)+'" cy="'+n(y)+'" r="'+n(r)+'" class="'+cls+'" data-pop=""/>';
const ellipse=(x,y,rx,ry,cls='primary',extra='')=>'<ellipse cx="'+n(x)+'" cy="'+n(y)+'" rx="'+n(rx)+'" ry="'+n(ry)+'" class="'+cls+'" data-pop="" '+extra+'/>';
const dot=(p,text='',dx=12,dy=-12,key='')=>circle(...p,5,'node').replace('data-pop=""',key?'data-pop="" data-morph="'+key+'"':'data-pop=""')+(text?label(text,p[0]+dx,p[1]+dy):'');
const label=(text,x,y,cls='label',anchor='start')=>'<text x="'+n(x)+'" y="'+n(y)+'" text-anchor="'+anchor+'" class="'+cls+'" data-label="">'+esc(text)+'</text>';
const group=(content,i=0)=>'<g data-stage-group="" data-order="'+i+'">'+content+'</g>';
const arrow=(a,b,cls='primary',key='')=>{const theta=Math.atan2(b[1]-a[1],b[0]-a[0]),p=[b[0]-13*Math.cos(theta-.38),b[1]-13*Math.sin(theta-.38)],q=[b[0]-13*Math.cos(theta+.38),b[1]-13*Math.sin(theta+.38)];return line(a,b,cls,key?key+'-shaft':'')+poly([p,b,q],cls,false,key?key+'-head':'')};
const plot=(fn,min=-3,max=3,cls='primary',mapper=P)=>{let content='',pts=[];for(let i=0;i<=150;i++){const x=min+(max-min)*i/150,y=fn(x),p=mapper(x,y);if(!Number.isFinite(y)||p[1]<30||p[1]>407){if(pts.length>1)content+=poly(pts,cls);pts=[]}else pts.push(p)}if(pts.length>1)content+=poly(pts,cls);return content};
const axes=()=>group(line([68,254],[697,254],'axis')+line([380,43],[380,402],'axis')+label('x',700,245,'tiny')+label('y',391,48,'tiny'),0);
const metric=(text,sub='')=>label(text,380,428,'metric','middle')+(sub?label(sub,380,451,'tiny','middle'):'');
const framePair=(left,right,leftTitle,rightTitle)=>'<g transform="translate(35 45) scale(.46)">'+left+'</g><g transform="translate(375 45) scale(.46)">'+right+'</g>'+label(leftTitle,207,335,'label','middle')+label(rightTitle,555,335,'label','middle')+line([380,78],[380,340],'axis');
const baseCurve=(kind,x)=>kind==='quadratic'?x*x:kind==='cubic'?x*x*x/3-x:kind==='wave'?-Math.cos(x):x*x*x-3*x;

export function newtonSteps(start=1.8,count=4){let x=start;const values=[];for(let i=0;i<count;i++){if(Math.abs(2*x)<1e-10)break;const next=x-(x*x-2)/(2*x);values.push({x,y:x*x-2,next});x=next}return values}
export function derivativeCoefficients(coeff){return coeff.slice(0,-1).map((x,i)=>x*(coeff.length-i-1))}
export function polynomialValue(coeff,x){return coeff.reduce((value,c)=>value*x+c,0)}
export function interlacedRoots(coeff,roots){const d=derivativeCoefficients(coeff);return roots.slice(0,-1).map((a,i)=>{let b=roots[i+1];for(let j=0;j<55;j++){const mid=(a+b)/2;if(polynomialValue(d,a)*polynomialValue(d,mid)<=0)b=mid;else a=mid}return(a+b)/2})}

function riemann(s){const count=[4,4,12,6,24,40,16][s],x0=114,y0=347,W=530,H=255,dx=W/count;let bars='';for(let i=0;i<count;i++){const z=(s===3?i+.5:i)/count,h=z*z*H;bars+=group('<rect x="'+n(x0+i*dx)+'" y="'+n(y0-h)+'" width="'+n(dx-1)+'" height="'+n(h)+'" class="wash" data-rise=""/>'+line([x0+i*dx,y0-h],[x0+(i+1)*dx,y0-h],'secondary'),i)}const curve=plot(x=>x*x,0,1,'primary',(x,y)=>[x0+x*W,y0-y*H]);const lo=(count-1)*(2*count-1)/(6*count*count),hi=(count+1)*(2*count+1)/(6*count*count);return line([100,y0],[665,y0],'axis')+bars+group(curve,2)+(s>0?label('f(x) = x²',528,76)+label('n = '+count,113,76):'')+(s===4||s===5?line([114,392],[644,392],'secondary')+dot([114+lo*900,392],'Lₙ',-25,-14)+dot([414,392],'1/3',-10,-14)+dot([114+hi*900,392],'Rₙ',0,-14):'')+metric(s===3?'표본점 변경 · 중점 모형':'좌합 '+lo.toFixed(4)+'  ≤  1/3  ≤  우합 '+hi.toFixed(4))}

function volume(s){let content='';const count=[1,3,9,8,16,23,12][s];for(let i=0;i<count;i++){const z=count===1?0:-1+2*i/(count-1),r=Math.sqrt(Math.max(0,1-z*z));content+=group(ellipse(380,233+z*135,155*r,38*r,'secondary')+(s>1?ellipse(380,233+z*135,155*r,38*r,'wash'):'') ,i)}content+=ellipse(380,233,155,147,'ghost');if(s===1||s===4||s===5){content+=line([380,233],[510,233],'primary')+line([380,233],[380,135],'guide')+dot([380,233],'O')+label('r² = R² − x²',428,130)}if(s===3){content+=path('M230 175 Q380 130 530 175 L530 197 Q380 157 230 197Z','warning-fill')+label('곡면의 띠 ≠ 원판의 넓이',380,63,'warning-label','middle')}return content+metric(s===3?'겉넓이는 곡면의 경사 폭을 반영한다.':'A(x) = π(R² − x²) · 얇은 단면의 합')}

function signed(s){const map=(x,y)=>[380+x*123,240-y*75],end=[.8,2,1.2,2,2,2,1.6][s];let fill='';if(s>0)fill+=poly([map(-2,0),map(-2,-2),map(0,0)],'negative-fill',true);fill+=poly([map(0,0),map(end,end),map(end,0)],'positive-fill',true,'positive-area');let content=line([78,240],[694,240],'axis')+group(fill,0)+group(plot(x=>x,-2,2,'primary',map),1);if(s===3||s>=4){content+=arrow([210,350],[333,375],'secondary')+arrow([550,127],[427,375],'primary')+label('−2',225,301,'label','middle')+label('+2',535,180,'label','middle')}return content+metric(s===3?'상쇄'+'되어도 영역은 남는다.':s>=4?'정적분 = 0    /    전체 넓이 = 4':'기준선 위는 +, 아래는 −')}

function curve(family,s){
  let content=axes(),fn=x=>baseCurve('cubic',x),extra='',result='';
  if(['restore-quadratic','restore','antiderivative'].includes(family)){
    const type=family==='restore-quadratic'?'quadratic':family==='antiderivative'?'wave':'cubic';fn=x=>baseCurve(type,x);const shifts=s===0?[0]:s===1?[0]:s===2?[-1.5,0,1.5]:s===3?[-2,-1,0,1,2]:s===4?[2]:s===5?[-1.5,0,1.5]:[-.8,.8];for(const [i,C]of shifts.entries())content+=group(plot(x=>fn(x)+C,-2.35,2.35,i===Math.floor(shifts.length/2)?'primary':'secondary'),i);
    if(s===4&&family==='restore-quadratic')extra=dot(P(1,3),'(1, 3)')+label('C = 2',543,115);
    if((s===1||s===4)&&family!=='restore-quadratic'){extra=plot(x=>type==='wave'?Math.sin(x):x*x-1,-2.1,2.1,'guide')+label('점선: 도함수',75,72,'tiny')}
    result=family==='restore-quadratic'?(s===4?'f(1)=3 → f(x)=x²+2':'같은 도함수 2x · 서로 다른 상수 C'):family==='antiderivative'?'모형: 도함수 sin x → 원함수 −cos x + C':'모형: 도함수 x²−1 → 원함수 x³/3−x+C';
  }else if(family==='zoom'||family==='secant'){
    const zoom=family==='zoom',h=[1.4,1.2,.5,.15,.1,.04,.3][s],a=.45;fn=x=>x*x;const delta=zoom?[2,1.5,.65,1,.2,.09,.4][s]:1,mp=(x,y)=>[380+(x-a)/delta*135,245-(y-a*a)/delta*95];content=line([70,245],[690,245],'axis')+line([380,53],[380,400],'axis')+plot(fn,a-delta*2.1,a+delta*2.1,'primary',mp)+plot(x=>a*a+2*a*(x-a),a-delta*2,a+delta*2,'guide',mp)+dot(mp(a,a*a),'A');
    if(zoom){extra=line(mp(a+delta,fn(a+delta)),mp(a+delta,a*a+2*a*delta),'warning')+dot(mp(a+delta,fn(a+delta)),'곡선')+label('δ = '+delta,79,80);result='이차함수 예시 · |h|≤δ에서 최대 차이 = δ² = '+(delta*delta).toFixed(4)}else{const b=a+h,slope=a+b;extra=plot(x=>a*a+slope*(x-a),-1.8,2.1,'secondary')+dot(P(b,b*b),'B',12,-12,'secant-point')+line(P(a,0),P(b,0),'warning')+label('h = '+h,90,80);content=axes()+plot(fn,-1.7,2.05)+plot(x=>a*a+2*a*(x-a),-2,2.5,'guide')+dot(P(a,a*a),'A');result=s===3?'h는 0이 아닌 상태로 가까워진다.':'할선 기울기 '+slope.toFixed(2)+' → 접선 기울기 '+(2*a).toFixed(2)}
  }else if(family==='join'){
    const shift=s===0?1.5:0,m=[-.5,-.5,.5,-.8,2,2,2][s];content+=plot(x=>x*x,-2.1,1)+plot(x=>1+shift+m*(x-1),1,3.3,'secondary')+dot(P(1,1),'s');if(s>=2)extra=line(P(.3,-.4),P(1.8,2.6),s<4?'warning':'guide')+label('왼쪽'+' 기울기 2',80,83)+label('오른쪽 기울기 '+m,450,83);if(s===6)extra+=dot(P(1.6,2.2),'같은 기울기');if(s===5)extra+=circle(...P(1,1),25,'secondary')+line(P(.8,0),P(.8,1),'guide')+line(P(1.2,0),P(1.2,1.4),'guide');result=s===0?'먼저 함숫값의 끊김을 본다.':s<4?'값은 같아도 기울기는 다르다.':'P(s)=Q(s), P′(s)=Q′(s)';
  }else if(family==='ratio'){
    const A=[.65,.8,1.25,.9,1.1,.75,1.05][s];fn=x=>A*(x*x*x-3*x);content+=plot(fn,-1.9,1.9)+[-1,0,1].map(x=>dot(P(x,fn(x)))).join('');extra=line([302,355],[458,355],'secondary')+label('1',341,382)+label('1',419,382)+line([380,345],[380,365],'secondary');if(s===3)extra+=line(P(-1,fn(-1)),P(0,0),'warning')+label('수평 거리와 사선 길이는 다르다.',380,68,'warning-label','middle');result='모형: a(x³−3x) · 두 극점의 가운데에 변곡점';
  }else if(family==='mean-value'){
    if(s===3){content+=plot(x=>Math.abs(x),-2,2)+line(P(-2,2),P(2,2),'secondary')+circle(...P(0,0),18,'warning');result='반례 모형 |x| · 구간 안에서 미분 가능하지 않다.'}else{const c=[-1,.1,.5,.5,.5,.5,.8][s];fn=x=>x*x/2;content+=plot(fn,-1.6,2.3)+line(P(-1,.5),P(2,2),'secondary');extra=plot(x=>c*c/2+c*(x-c),-2.5,2.5,'guide')+dot(P(c,fn(c)),'c');result='모형 x²/2, [−1,2] · c=1/2에서 같은 기울기'}
  }else if(family==='chain'||family==='curvature'){
    const first=family==='chain'?x=>x*x:x=>x*x*x/2,second=family==='chain'?x=>x*x*x/2:x=>x**4/3;if(s===3||s===4){content=framePair(axes()+plot(first,-1.7,1.7)+dot(P(0,0)),axes()+plot(second,-1.7,1.7)+dot(P(0,0)),family==='chain'?'x² · − → +':'x³ · f″: − → +',family==='chain'?'x³ · + → +':'x⁴ · f″: + → +');result=family==='chain'?'도함수의 영점 이후, 부호 변화를 확인한다.':'이계도함수 0 이후, 부호 변화를 확인한다.'}else{const a=[-1.4,-.8,0,0,.2,.8,1.2][s];fn=family==='chain'?x=>x*x*x/2:x=>x*x*x/2;const m=1.5*a*a;content+=plot(fn,-1.7,1.7)+plot(x=>fn(a)+m*(x-a),-2,2,'secondary')+dot(P(a,fn(a)));result=family==='chain'?'합성함수 도함수의 곱 · 영점과 극값은 별도 판정':'모형 x³ · 접선의 기울기가 줄다가 늘어난다.'}
  }else{
    const k=s===6?5:3;fn=x=>x*x*x-k*x;content+=plot(fn,-1.9,1.9);if(s===1)content+=plot(x=>3*x*x-k,-1.5,1.5,'guide');if(s===4)content+=plot(x=>3*x*x-k,-1.5,1.5,'secondary');if(s===5)content+=line(P(0,-3),P(0,3),'guide')+dot(P(0,0));if(s>=1)extra=[-Math.sqrt(k/3),Math.sqrt(k/3)].map(x=>dot(P(x,fn(x)))).join('');if(s>=2)extra+=arrow(P(-1.8,1),P(-1.3,1),'secondary')+arrow(P(-.6,-.5),P(.1,-.5),'warning')+arrow(P(1.3,-1),P(1.8,-1),'secondary');if(s===3){content=framePair(axes()+plot(fn,-1.9,1.9),axes()+plot(x=>x**3/2,-1.8,1.8)+dot(P(0,0)),'극점: 부호가 바뀜','정지점: 부호가 안 바뀜');extra=''}result=s===3?'f′(x)=0만으로는 극값을 판단할 수 없다.':'모형 x³−'+k+'x · 극점의 양쪽 부호를 읽는다.';
  }
  return content+group(extra,3)+metric(result);
}

function newton(s){let content=axes()+plot(x=>x*x-2,-1.9,2.45),steps=newtonSteps(s===0?2.1:1.8,[1,1,3,0,4,5,3][s]);if(s===3)return content+dot(P(0,-2),'f′(0)=0')+line(P(-2,-2),P(2,-2),'warning')+metric('출발점 0 · 접선이 x축과 만나지 않는다.');steps.forEach((q,i)=>{content+=group(poly([P(q.x,q.y),P(q.next,0),P(q.next,q.next*q.next-2)],i===steps.length-1?'primary':'secondary')+dot(P(q.x,q.y)),i)});return content+metric('모형 x²−2 · xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ)')}

function tangents(family,s){const b=family==='tangent-merge'?[.6,.8,.5,1,1,.7,.4][s]:[.35,.5,.7,1.3,.25,.35,.9][s],a=1,H=t=>2*t*t*t-3*a*t*t+b,roots=[];for(const t of [0,1])if(Math.abs(H(t))<1e-10)roots.push(t);for(const [l,r]of[[-2,0],[0,1],[1,3]]){let lo=l,hi=r;if(H(lo)*H(hi)>=0)continue;for(let j=0;j<50;j++){const mid=(lo+hi)/2;if(H(lo)*H(mid)<=0)hi=mid;else lo=mid}roots.push((lo+hi)/2)}let content=axes()+plot(x=>x**3,-1.45,1.6),chosen=s===0?roots.slice(0,1):roots;chosen.forEach((t,i)=>content+=group(plot(x=>3*t*t*x-2*t**3,-2.5,2.8,'secondary')+dot(P(t,t**3)),i));content+=dot(P(a,b),'P(1, '+b+')',14,24);if(s===4){content+=line([180,380],[620,380],'axis');roots.forEach(t=>content+=dot([340+t*110,380]));}return content+metric(s===3&&family==='tangent-merge'?'경계'+' · 서로 다른 접점 2개 · 한 접점은 중근':'서로 다른 접점 '+roots.length+'개 · 2t³−3t²+b=0')}

function rolle(s){const coeff=[1,2,-67,-68,672,0],roots=[-8,-4,0,3,7],rows=[roots];let c=coeff;for(let i=0;i<4;i++){rows.push(interlacedRoots(c,rows.at(-1)));c=derivativeCoefficients(c)}let content='';const show=[1,2,4,2,5,5,4][s];rows.slice(0,show).forEach((row,i)=>{const y=96+i*62;content+=line([91,y],[665,y],'axis')+label(i===0?'f':('f'+'′'.repeat(i)),50,y+5,'tiny');row.forEach((x,j)=>{const p=[380+x*30,y];content+=group(dot(p,i===0?String(x):''),i+j);if(i>0)content+=poly([[380+rows[i-1][j]*30,y-62],p,[380+rows[i-1][j+1]*30,y-62]],'guide')})});if(s===3)content+=circle(380,96,17,'warning')+label('서로 다른 실근 조건',380,309,'warning-label','middle');return content+metric('예시: (x+8)(x+4)x(x−3)(x−7) · 근의 위치를 따로 계산')}

function areaScale(s){
  const scale=[.65,.65,1,.75,1.12,.9,.85][s],mp=(x,y)=>[380+x*114*scale,235-y*46*scale],f=x=>x*(x*x-1);let content='';
  const region=(lo,hi,cls)=>poly([mp(lo,0),...Array.from({length:51},(_,i)=>{const x=lo+(hi-lo)*i/50;return mp(x,f(x))}),mp(hi,0)],cls,true);
  content+=region(-1,0,'positive-fill')+region(0,1,'negative-fill')+plot(f,-1.5,1.5,'primary',mp)+line(mp(-2,0),mp(2,0),'axis');
  if(s>=1)content+=label('삼차함수의 표준화 모형',380,67,'label','middle');
  if(s===3)content+=label('같은 경계를 유지해야 같은 비율을 비교한다.',380,102,'warning-label','middle');
  if(s>=4){[4,4,5,3,8,7,1].forEach((ratio,i)=>content+=group('<rect x="'+(225+i*44)+'" y="'+(385-ratio*6)+'" width="27" height="'+ratio*6+'" class="wash" data-rise=""/>'+label(String(ratio),238+i*44,404,'tiny','middle'),i));content+=label('학생 기록에 제시한 일곱 넓이비 · 경계와 함께 읽기',380,302,'tiny','middle')}
  return content+metric('삼차함수의 가로 n · 세로 |a|n³ → 넓이 공통 배율 |a|n⁴');
}

function limits(s){
  const valid=x=>x+1,invalid=x=>(x+1)/(x-1),map=(x,y)=>[110+(x-1)*370,345-y*48];
  const chart=(fn,warn=false)=>line([100,345],[650,345],'axis')+line([110,65],[110,365],'guide')+plot(fn,1.02,2.45,warn?'warning':'primary',map);
  let content=chart(s===3?invalid:valid,s===3);
  const samples=[[],[1.5,1.25],[1.2,1.1,1.05,1.01],[1.5,1.2,1.1],[1.25,1.125,1.0625],[1.4],[1.6,1.05]][s];
  samples.forEach((x,i)=>content+=group(dot(map(x,s===3?invalid(x):valid(x))),i));
  if(s===5)content=framePair(chart(valid),chart(invalid,true),'0/0 → 2','2/0⁺ → +∞');
  else if(s===3)content+=label('(x+1)/(x−1)',418,98,'warning-label')+label('미분한 비 1 ≠ 원래 극한 +∞',380,78,'warning-label','middle');
  else content+=label('(x²−1)/(x−1) = x+1',295,82)+line([110,249],[645,249],'guide')+circle(110,249,6,'primary');
  if(s===4)content+=poly([[190,325],[325,325],[460,325]],'secondary')+circle(190,325,17,'secondary')+circle(325,325,17,'secondary')+circle(460,325,17,'secondary');
  return content+metric(s===3?'2/0형 · 같은 미분 계산을 적용할 수 없다.':s===5?'형태 확인 → 적용 조건 확인 → 독립적인 검산':'0/0형 · 조건 확인 뒤, 극한값 2');
}

function model(s){
  const xs=[.2,.7,1.2,1.7,2.2,2.7],ys=xs.map(x=>.7+.6*x+.09*Math.sin(4*x)),map=(x,y)=>[140+x*170,350-y*110],models=[x=>.7+.6*x,x=>.65*Math.exp(.6*x),x=>2.8/(1+Math.exp(-2*(x-1.2)))];let content=line([115,350],[667,350],'axis')+line([140,54],[140,368],'axis');
  const show=s===0||s===5?1:s===1||s===3||s===4?3:2,index=s===3?2:s===5?0:1;
  models.slice(0,show).forEach((fn,i)=>content+=group(plot(fn,0,2.9,i===0?'primary':'secondary',map),i));
  xs.forEach((x,i)=>{content+=dot(map(x,ys[i]));if(s>=2)content+=line(map(x,ys[i]),map(x,models[index](x)),'warning');if(s===4){const h=Math.abs(ys[i]-models[1](x))*35;content+='<rect x="'+(174+i*74)+'" y="'+(390-h)+'" width="25" height="'+h+'" class="wash" data-rise=""/>'}});
  return content+label('전시 설명을 위한 가상 자료',380,68,'tiny','middle')+metric(s>=4?'잔차 → 같은 오차 기준으로 비교':'일차 · 지수 · 로지스틱 후보 · 실제 측정 자료 아님');
}

const plane=(cy=280,cls='wash')=>poly([[148,cy+30],[450,cy-58],[631,cy+25],[330,cy+113]],cls,true);
function planeScene(family,s){let content=plane(),result='';const pointY=family==='plane-distance'?[99,137,90,174,122,151,110][s]:99,A=[355-(286-pointY)*.13,pointY],H=[355,286];
  if(family==='line-plane'){
    const mode=s===0?0:s===1?0:s===2?0:s===3?1:s===4?2:s===5?2:1,dy=mode===0?100:0,offset=mode===2?83:0;if(s>=1)content+=arrow([465,293],[465,100],'secondary')+label('n',475,111);const tilt=s===2?145:dy;content+=line([190,174+offset-tilt],[597,174+offset+tilt],'primary','line-direction')+dot([380,174+offset],'P',12,-12,'line-anchor');if(s===5)content+=line([220,184],[565,184],'warning')+dot([440,184],'평면 밖',12,-12);if(s===3)content+=line([170,283],[627,283],'guide');result=['교차 · n·v ≠ 0','평행 · n·v = 0, P는 평면 밖','포함 · n·v = 0, P는 평면 위'][mode];
  }else if(family==='overlap'){
    const gap=[145,110,55,0,0,0,60][s],B=[330+gap,176],K=[355+gap,286];content+=dot(A,'A')+dot(B,'B')+line(A,H,'guide')+line(B,K,'guide')+dot(H,'A′',-30,25)+(gap>0?dot(K,'B′',12,25):circle(...H,14,'secondary'))+arrow([595,98],[620,210],'secondary');if(s===3||s===4)content+=line(A,B,'warning')+label('다른 두 점',375,65,'warning-label','middle');result=gap===0?'차벡터가 관찰 방향과 나란해져 투영이 겹친다.':'관찰 방향은 고정 · 두 점의 투영 위치를 비교';
  }else{
    const qx=[485,485,560,465,355,355,440][s],Q=[qx,286+.1*(qx-355)];content+=dot(A,'P')+dot(H,'H',-24,26)+(s>=1?line(A,H,'guide','distance-drop'):'');if(family==='minimum')content+=dot(Q,'Q',10,20)+line(A,Q,s===4?'secondary':'primary')+line(H,Q,'secondary');else content+=arrow(H,[332,110],'secondary','normal-vector')+label('법선 n',402,126)+(s>=2?line(A,[520,300],'ghost'):'');content+=poly([[352,265],[371,270],[374,288]],'secondary');if(s===3)content+=label(family==='minimum'?'빗변 ≥ 수선':'법선 벡터를 단위 길이로',380,63,'warning-label','middle');result=family==='minimum'?'PQ² = PH² + HQ² ≥ PH²':family==='plane-distance'?'법선 방향 성분 ÷ 법선의 크기 = 거리':'한 방향으로 분리하면 수선이 남는다.';
  }
  return content+metric(result);
}

function spacePoints(s){const A=[170,325],B=[610,105],u=[.3,.3,.65,1.16,.5,.75,.4][s],Q=A.map((v,i)=>(1-u)*v+u*B[i]);let content=poly([A,[610,325],B],'guide')+line(A,B)+dot(A,'A',-24,25)+dot(B,'B')+dot(Q,'P',12,25,'space-moving-point');if(s>=1)content+=poly([A,[Q[0],325],Q],'secondary')+label('x · y · z 를 같은 비율로',380,65,'label','middle');if(s===3)content+=line(B,Q,'warning');return content+metric('λ = '+u+' · '+(u>1?'외분: 선분 밖':'내분: 선분 안'))}

function sphere(family,s){const cx=380,cy=224,R=141,d=family==='sphere-slice'?[.2,.45,.65,1.13,.5,.72,.3][s]:family==='dimension'?[0,.25,.5,1,.6,.75,.4][s]:[.2,.4,.7,-.65,.9,1,.45][s];let content=circle(cx,cy,R,'ghost')+ellipse(cx,cy,R,39,'ghost')+ellipse(cx,cy,51,R,'ghost'),result='';
  if(family==='sphere-extreme'){
    const theta=[2.6,2.1,1.4,.9,.3,0,1][s],Q=[cx+R*Math.cos(theta),cy-R*Math.sin(theta)],F=[Q[0],365];content+=arrow([180,365],[580,365],'secondary')+line([cx,cy],Q)+dot(Q,'P',12,-12,'sphere-point')+line(Q,F,'guide','sphere-shadow')+dot(F,'사영',-15,30)+line([cx,365],F,'primary')+dot([cx,cy],'C');if(s===3)content+=ellipse(cx,cy,R*1.3,R*.7,'warning')+label('타원체로 그대로 확장할 수 있을까?',380,54,'warning-label','middle');result='구의 반지름 방향을 고정축에 정사영한다.';
  }else{
    const y=cy-d*R,r=Math.sqrt(Math.max(0,1-d*d))*R;content+=plane(y-50,'plane-wash');if(d<=1){content+=ellipse(cx,y,r,r*.26,'primary','data-morph="slice-ring"')+(s>=2?ellipse(cx,y,r,r*.26,'wash'):'')+line([cx,cy],[cx,y],'guide','slice-depth')+line([cx,y],[cx+r,y],'secondary','slice-radius')+line([cx,cy],[cx+r,y],'secondary','slice-hypotenuse')+dot([cx,cy],'O')+dot([cx,y],'H',-25,-12);if(s===2||s===4)for(let i=0;i<8;i++)content+=group(dot([cx+r*Math.cos(i*Math.PI/4),y+r*.26*Math.sin(i*Math.PI/4)]),i)}if(s===3&&family==='sphere-slice'){content+=circle(cx,cy-R,5,'warning')+label('d=R: 한 점 / d>R: 만나지 않음',380,64,'warning-label','middle')}result=family==='dimension'?'해설 모형: 한 좌표 고정 → 반지름 √(R²−d²)의 낮은 차원 구':d>1?'d > R · 실수 반지름을 갖는 단면이 없다.':'d/R = '+d+' · r/R = '+Math.sqrt(1-d*d).toFixed(3);
  }
  return content+metric(result);
}

function projection(s){const theta=[.15,.3,.85,Math.PI/2,Math.PI/3,.65,.45][s],h=150*Math.cos(theta),top=[[230,105],[530,105],[570,105+h],[270,105+h]],bottom=[[230,290],[530,290],[570,290+h*.4],[270,290+h*.4]];let content=poly(bottom,'wash',true,'shadow-face')+poly(top,'primary',true,'original-face');top.forEach((p,i)=>content+=group(line(p,bottom[i],'guide','projection-ray-'+i)+dot(p),i));content+=label('원래 면',570,106)+label('정사영',570,337)+arrow([145,130],[145,320],'secondary');return content+metric('θ = '+Math.round(theta*180/Math.PI)+'° · 그림자 넓이 / 원래 넓이 = '+Math.abs(Math.cos(theta)).toFixed(3))}

function conics(family,s){const boundary=family==='conic-boundary',hyper=family==='focal'&&s>=3||boundary&&s===2,degenerate=boundary&&s===3,a=2.25,c=1.45,b=Math.sqrt(a*a-c*c),angle=[.4,.7,1.05,.2,1.4,1.1,.55][s];let content='';const F1=P(-c,0),F2=P(c,0);if(degenerate){content=line(F1,F2,'warning')+label('거리의 합 = 초점 사이 거리',380,93,'warning-label','middle')}else if(hyper){content+=plot(x=>Math.sqrt(c*c-1.1*1.1)*Math.sqrt(Math.max(0,x*x/(1.1*1.1)-1)),1.1,2.8)+plot(x=>-Math.sqrt(c*c-1.1*1.1)*Math.sqrt(Math.max(0,x*x/(1.1*1.1)-1)),1.1,2.8)+plot(x=>Math.sqrt(c*c-1.1*1.1)*Math.sqrt(Math.max(0,x*x/(1.1*1.1)-1)),-2.8,-1.1)+plot(x=>-Math.sqrt(c*c-1.1*1.1)*Math.sqrt(Math.max(0,x*x/(1.1*1.1)-1)),-2.8,-1.1);const u=[.2,.4,.5,.3,.65,.9,.45][s],Q=P(1.1*Math.cosh(u),Math.sqrt(c*c-1.1*1.1)*Math.sinh(u));content+=line(F1,Q,'secondary')+line(Q,F2,'primary')+dot(Q,'P')}else{content+=ellipse(380,254,a*78,b*48);const Q=P(a*Math.cos(angle),b*Math.sin(angle));if(s>0)content+=group(line(F1,Q,'secondary')+line(Q,F2,'primary')+dot(Q,'P'),2)}content+=dot(F1,'F₁',-12,26)+dot(F2,'F₂',-12,26);return content+metric(degenerate?'경계에서는 선분으로 퇴화한다.':hyper?'예시 쌍곡선 · |PF₁−PF₂| = 일정':'예시 타원 · PF₁+PF₂ = 일정')}

function parabola(s){const p=[.65,.8,.8,.8,.8,1,.65][s],t=[1.2,1.1,.6,-1.2,1.5,1.1,.5][s],fn=x=>x*x/(4*p),Q=P(t,fn(t)),F=P(0,p),H=P(t,-p);let content=axes()+plot(fn,-2.55,2.55)+dot(F,'F')+line(P(-3.1,-p),P(3.1,-p),'guide')+label('준선 y=−p',75,254+p*48+26);if(s>=1)content+=group(line(F,Q,'primary')+line(Q,H,'secondary')+dot(Q,'P')+dot(H,'H',8,25),2);if(s===3)content+=line(Q,P(-2,-p),'warning')+label('준선 위 임의 점까지의 거리와는 다르다.',380,66,'warning-label','middle');return content+metric('초점 거리 = 준선까지의 수직 거리 · x² = 4py')}

function ellipsoid(s){const a=[2.25,2.25,2.25,1.3,2.25,2.25,2.25][s],c=1.3,b=Math.sqrt(Math.max(0,a*a-c*c)),theta=[.3,.5,1.1,.1,1.8,2.1,.8][s],Q=[380+a*95*Math.cos(theta),232-b*65*Math.sin(theta)],F1=[380-c*95,232],F2=[380+c*95,232];let content=ellipse(380,232,a*95,b*65,'primary','data-morph="ellipsoid-section"')+ellipse(380,232,a*95,b*24,'ghost')+ellipse(380,232,a*30,b*65,'ghost')+dot(F1,'F₁',-12,25)+dot(F2,'F₂',-12,25);if(s>=1)content+=group(line(F1,Q,'secondary')+line(F2,Q,'primary')+dot(Q,'P'),2);if(s===4)content+=ellipse(380,232,a*95,b*30,'secondary','transform="rotate(-25 380 232)"');return content+metric(s===3?'a=c · 회전타원체'+'가 선분으로 퇴화한다.':'예시 회전타원체 · 두 초점까지 거리의 합 = 2a')}

function cone(family,s){
  const disc=family==='cone-discriminant',m=disc?[.35,.65,.92,1,1.25,1.15,.7][s]:[0,.4,.7,1,1.28,.9,.3][s],h=.5,project=(x,y,z)=>[380+75*x+35*y,224-70*z+18*y];let content='';
  for(const sign of [-1,1]){const ring=[];for(let i=0;i<=120;i++){const t=i/120*Math.PI*2;ring.push(project(2*Math.cos(t),2*Math.sin(t),2*sign))}content+=poly(ring,'ghost');for(const t of[Math.atan2(35,75),Math.atan2(35,75)+Math.PI])content+=line(project(0,0,0),project(2*Math.cos(t),2*Math.sin(t),2*sign),'ghost')}
  content+=poly([project(-2,-2,-2*m+h),project(2,-2,2*m+h),project(2,2,2*m+h),project(-2,2,-2*m+h)],'plane-wash',true,'cut-plane');
  for(const sign of[1,-1]){let pts=[];for(let i=0;i<=360;i++){const t=i/360*Math.PI*2,r=sign*h/(1-sign*m*Math.cos(t));if(r>0&&r<2){pts.push(project(r*Math.cos(t),r*Math.sin(t),sign*r))}else if(pts.length){if(pts.length>1)content+=poly(pts);pts=[]}}if(pts.length>1)content+=poly(pts)}
  const type=m===0?'원':m<1?'타원':m===1?'포물선':'쌍곡선';
  if(s>=3)content+=label('절단 조건: '+type,380,47,s===3?'warning-label':'label','middle');
  return content+metric(disc?'예시 k=1 · 1−m² = '+(1-m*m).toFixed(3)+' · '+type:'원뿔과 절단평면의 교선 · '+type);
}

function conicTangent(s){const theta=[.65,.65,1.1,0,.55,.8,.3][s],a=2.2,b=1.4,Q=P(a*Math.cos(theta),b*Math.sin(theta)),v=[-a*Math.sin(theta),b*Math.cos(theta)];let content=ellipse(380,254,a*78,b*48)+dot(Q,'P',12,-12,'tangent-point');if(s>=1)content+=group(line([Q[0]-v[0]*156,Q[1]+v[1]*96],[Q[0]+v[0]*156,Q[1]-v[1]*96],'secondary'),2);if(s===3)content+=label('x=a · 수직 접선',380,75,'warning-label','middle');if(s>=4)content+=circle(...Q,22,'secondary')+label('D=0 · 같은 교점이 두 번',380,354,'label','middle');return content+metric(s===3?'기울기로 표현할 수 없어도 중근 조건은 남는다.':'타원 위 접점 · xx₁/a² + yy₁/b² = 1')}

function vectors(s){const theta=[.55,.7,Math.PI/2,2.2,2.6,2.05,1.2][s],O=[320,289],Q=[320+210*Math.cos(theta),289-170*Math.sin(theta)],H=[Q[0],289];let content=arrow(O,[620,289],'secondary')+arrow(O,Q,'primary','moving-vector')+dot(O,'O',-25,25);if(s>=1)content+=line(Q,H,'guide','vector-drop')+line(O,H,s>2?'warning':'primary','vector-component')+dot(H);content+=label('u',640,294)+label('v',Q[0]+14,Q[1]-14);return content+metric('θ = '+Math.round(theta*180/Math.PI)+'° · cos θ = '+Math.cos(theta).toFixed(3)+' · 내적 '+(Math.abs(Math.cos(theta))<1e-8?'0':theta>Math.PI/2?'음수':'양수'))}

function rotation(s){const theta=[0,Math.PI/12,Math.PI/4,Math.PI/2,Math.PI/4,Math.PI/6,Math.PI/5][s],co=Math.cos(theta),si=Math.sin(theta);let content=axes()+plot(x=>x*x,-1.75,1.75,'ghost');const origin=P(0,0),rot=(x,y)=>P(co*x-si*y,si*x+co*y);content+=arrow(rot(-2.5,0),rot(2.5,0),'primary','axis-x')+arrow(rot(0,-2.5),rot(0,3.3),'secondary','axis-y');const Q=P(1,1);content+=dot(Q,'고정된 점')+line(origin,Q,'guide');if(s>=2)content+=label('X',...rot(2.6,0))+label('Y',...rot(0,3.5));return content+metric('좌표축 회전 '+Math.round(theta*180/Math.PI)+'° · XY 계수 −sin(2θ) = '+(-Math.sin(2*theta)).toFixed(3))}

function reflection(s){const p=.9,map=(x,y)=>[380+x*92,340-y*68],fn=x=>x*x/(4*p),F=map(0,p);let content=plot(fn,-2.8,2.8,'primary',map)+dot(F,'F');const xs=s===0?[-1.6]:s===1?[-1.6]:s===2?[-2,-1,1,2]:s===3?[0]:[-2.3,-1.2,.8,2];xs.forEach((x,i)=>{const Q=map(x,fn(x));content+=group(line([Q[0],57],Q,'secondary')+(s>=2?arrow(Q,F):'')+dot(Q),i);if(s===1){const m=x/(2*p);content+=line([Q[0]-70,Q[1]+70*m*68/92],[Q[0]+70,Q[1]-70*m*68/92],'guide')}});return content+metric(s===3?'꼭짓점에서는 입사광과 반사광이 축 위에서 겹친다.':'포물선의 축과 평행한 입사광 → 초점 F')}

function asymptote(s){const a=[1.6,2.1,2.8,2.1,3.7,4.4,2.8][s],map=(x,y)=>[380+x*57,260-y*43];let content=line(map(-4.8,-4.8),map(4.8,4.8),'guide')+line(map(-4.8,4.8),map(4.8,-4.8),'guide');if(s===3){content=axes()+plot(x=>.5*x*x,-2.5,2.5)+plot(x=>x+1,-2.5,2.5,'warning')+metric('한 직선과 몇 점의 거리만으로 일반화할 수 없다.');return content}for(const sign of[-1,1])for(const side of[-1,1])content+=plot(x=>sign*Math.sqrt(x*x-1),side<0?-4.6:1,side<0?-1:4.6,'primary',map);const Q=map(a,Math.sqrt(a*a-1)),F=map(a,a);content+=dot(Q,'곡선',15,16)+line(Q,F,'warning')+dot(F,'직선',15,-12);return content+metric('예시 x²−y²=1 · 수직 틈 x−√(x²−1) = '+(a-Math.sqrt(a*a-1)).toFixed(4))}

function compound(s){const exact=r=>Math.log(2)/Math.log(1+r/100),map=(x,y)=>[105+(x-1)*40,367-y*4.3],r=[8,8,4,1.5,12,8,6][s];let content=line([100,367],[694,367],'axis')+plot(exact,1.1,15,'primary',map)+plot(x=>72/x,1.1,15,'guide',map)+dot(map(r,exact(r)),'정확값',16,25);if(s>=1)content+=line(map(r,exact(r)),map(r,72/r),'warning')+dot(map(r,72/r),'72/r',16,-12);if(s===4)for(const x of[2,4,6,8,10,12,14])content+=line(map(x,exact(x)),map(x,72/x),'warning');return content+metric('r='+r+'% · 정확 '+exact(r).toFixed(3)+'년 / 72의 법칙 '+(72/r).toFixed(3)+'년')}

function surface(s){
  const z=[-.9,-.9,.2,.7,.7,-.4,.3][s],map=(x,y,h)=>[380+x*80+y*35,320+y*30-h*18],f=(x,y)=>x*x+2*y*y;let content='';
  for(let y=-2;y<=2;y+=.4){const ps=[];for(let x=-2.1;x<=2.1;x+=.06)ps.push(map(x,y,f(x,y)));content+=poly(ps,'ghost')}
  for(let x=-2;x<=2;x+=.4){const ps=[];for(let y=-2;y<=2;y+=.06)ps.push(map(x,y,f(x,y)));content+=poly(ps,'ghost')}
  const ps=[];for(let x=-2.1;x<=2.1;x+=.05)ps.push(map(x,z,f(x,z)));content+=group(poly(ps),2);
  if(s>=1)content+=poly([map(-2.2,z,-1),map(2.2,z,-1),map(2.2,z,8),map(-2.2,z,8)],'plane-wash',true,'slice-plane');
  if(s>=4){const a=.85,Q=map(a,z,f(a,z)),m=2*a;content+=line(map(-.5,z,f(a,z)+m*(-.5-a)),map(2,z,f(a,z)+m*(2-a)),'secondary','slice-tangent')+dot(Q)}
  return content+metric('z=x²+2y² · y='+z+'를 고정한 단면 · x 방향 기울기 2x');
}

export function motionFrameFor(work,phase){
  const design=motionDesignFor(work),s=Math.max(0,Math.min(6,Math.trunc(phase))),family=design.family;
  let drawing;
  if(['zoom','secant','join','ratio','mean-value','chain','curvature','extrema','restore','restore-quadratic','antiderivative'].includes(family))drawing=curve(family,s);
  else if(['line-plane','overlap','minimum','plane-distance'].includes(family))drawing=planeScene(family,s);
  else if(['sphere-slice','sphere-extreme','dimension'].includes(family))drawing=sphere(family,s);
  else if(['focal','conic-boundary'].includes(family))drawing=conics(family,s);
  else if(['cone-cut','cone-discriminant'].includes(family))drawing=cone(family,s);
  else if(['tangents','tangent-merge'].includes(family))drawing=tangents(family,s);
  else {const renderers={riemann,volume,signed,newton,rolle,'area-scale':areaScale,limits,model,'space-points':spacePoints,projection,parabola,ellipsoid,'conic-tangent':conicTangent,dot:vectors,rotation,reflection,asymptote,compound,surface};if(!renderers[family])throw Error('도해가 없는 장면 '+family);drawing=renderers[family](s)}
  const light={calculus:'#ffb47f',geometry:'#b5c5ff',economics:'#91e5c6'}[work.subjectKey]||'#b5c5ff';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 470" aria-hidden="true" focusable="false" data-family="'+family+'" data-phase="'+s+'"><style>.primary,.secondary,.guide,.axis,.ghost,.warning{fill:none;stroke-linecap:round;stroke-linejoin:round}.primary{stroke:'+light+';stroke-width:2.5}.secondary{stroke:#e2ebfa;stroke-width:1.5;opacity:.8}.guide{stroke:#a5b3cd;stroke-width:1.2;stroke-dasharray:5 7;opacity:.7}.axis{stroke:#a5b3cd;stroke-width:.8;opacity:.25}.ghost{stroke:#b6c4df;stroke-width:1;opacity:.23}.warning{stroke:#ffd593;stroke-width:2;stroke-dasharray:4 5}.node{fill:'+light+';stroke:#fff4e5;stroke-width:1.1}.wash{fill:'+light+';fill-opacity:.12;stroke:'+light+';stroke-width:1}.plane-wash{fill:#b5c5ff;fill-opacity:.07;stroke:#c1cbdf;stroke-opacity:.4;stroke-width:1}.positive-fill{fill:'+light+';fill-opacity:.26;stroke:'+light+';stroke-width:1}.negative-fill{fill:#86b2ef;fill-opacity:.27;stroke:#86b2ef;stroke-width:1}.warning-fill{fill:#ffd593;fill-opacity:.25;stroke:#ffd593;stroke-width:1}.label,.metric,.tiny,.warning-label{font-family:"Malgun Gothic","Apple SD Gothic Neo",sans-serif;fill:#e3ebfa;font-weight:400}.label{font-size:15px}.metric{font-size:15px;fill:#f5f6fb}.tiny{font-size:12px;fill:#a9bad5}.warning-label{font-size:15px;fill:#ffd593}</style>'+drawing+'</svg>';
  const encoded=drawing.match(/class="metric"[^>]*>([^<]+)</)?.[1]||design.focus;
  const annotation=encoded.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
  return {svg:enhanceMotionSVG(svg,{id:work.id+'-'+s,light}),phase:s,family,headline:design.beats[s],focus:design.focus,annotation};
}
