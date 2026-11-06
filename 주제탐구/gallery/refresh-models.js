// Exhibition explanations. These computed examples are separate from student measurements.
export const REFRESH_FAMILIES=new Set(['composite-limit','ellipse-rotation','continuity','tetrahedron','newton-cycle','reconstruction']);
export function cubicNewton(start,count=5){
  const out=[start];for(let i=0;i<count;i++){const x=out.at(-1),d=3*x*x-2;if(Math.abs(d)<1e-10)break;const next=x-(x*x*x-2*x+2)/d;if(!Number.isFinite(next))break;out.push(next)}return out;
}
export function refreshMathFrame(family,time=0,phase=0){
  if(!REFRESH_FAMILIES.has(family))return null;
  const paths=[],dots=[],labels=[],values={},s=Math.max(0,Math.min(6,Math.round(phase))),wave=.5-.5*Math.cos(time*.28);
  const line=(points,role='primary',closed=false)=>paths.push({points,role,closed});
  const dot=(point,text='',role='primary')=>{dots.push({point,role});if(text)label(text,[point[0]+10,point[1]-13])};
  const label=(text,point)=>labels.push({text,point});
  const ellipse=(x,y,rx,ry,role='primary')=>line(Array.from({length:97},(_,i)=>{const a=i/96*2*Math.PI;return[x+rx*Math.cos(a),y+ry*Math.sin(a)]}),role);
  const plot=(f,min,max,map,role='primary')=>{let p=[];for(let i=0;i<=100;i++){const x=min+(max-min)*i/100,q=map(x,f(x));if(q.every(Number.isFinite)&&q[1]>55&&q[1]<392)p.push(q);else{if(p.length>1)line(p,role);p=[]}}if(p.length>1)line(p,role)};
  let metric='',description='';
  if(family==='composite-limit'){
    const mode=[0,1,1,2,2,2,0][s],eps=.08+.95*wave;
    const L=(x,y)=>[200+x*65,268-y*50],R=(x,y)=>[555+x*65,268-y*50];
    for(const map of[L,R]){line([map(-2,0),map(2,0)],'axis');line([map(0,-1.5),map(0,3)],'axis')}
    const g=mode===2?x=>x*x:x=>x;plot(g,-1.5,1.5,L);label(mode===2?'g(x) = x²':'g(x) = x',[90,65]);label('h(x) = f(g(x))',[440,65]);
    for(const x of[-eps,eps]){dot(L(x,g(x)));line([L(x,g(x)),L(0,g(x))],'guide')}
    if(mode===0){plot(x=>x+1,-1.6,1.6,R);for(const x of[-eps,eps])dot(R(x,x+1));metric='전시 예시 f(t)=t+1 · 좌우극한 1 = h(0)';}
    if(mode===1){plot(()=>-1,-1.7,-.001,R);plot(()=>1,.001,1.7,R);dot(R(0,-1),'','hole');dot(R(0,1),'','hole');dot(R(0,0),'h(0)=0');dot(R(-eps,-1));dot(R(eps,1));metric='f는 부호함수 · 좌극한 −1 ≠ 우극한 1';}
    if(mode===2){plot(()=>2,-1.7,-.001,R);plot(()=>2,.001,1.7,R);dot(R(0,2),'극한 2','hole');dot(R(0,-1),'h(0)=−1');dot(R(-eps,2));dot(R(eps,2));metric='x≠0이면 x²>0 · 좌우극한 2 ≠ h(0)=−1';}
    Object.assign(values,{mode,epsilon:eps});description='안쪽 함수의 접근 방향과 합성함수의 극한·함숫값을 나누어 봅니다.';
  }else if(family==='ellipse-rotation'){
    const theta=([0,30,45,45,30,0,45][s]+8*Math.sin(time*.18))*Math.PI/180,co=Math.cos(theta),si=Math.sin(theta),map=(x,y)=>[380+x*85,245-y*62];
    ellipse(380,245,255,124);line([map(-3.3,0),map(3.3,0)],'axis');line([map(0,-2.7),map(0,2.7)],'axis');
    const rot=(x,y)=>map(co*x-si*y,si*x+co*y);line([rot(-3.3,0),rot(3.3,0)],'secondary');line([rot(0,-2.7),rot(0,2.7)],'secondary');label('X',rot(3.3,0));label('Y',rot(0,2.7));
    const p=[3*Math.cos(.7),2*Math.sin(.7)],X=co*p[0]+si*p[1],Y=-si*p[0]+co*p[1];dot(map(...p),'P');line([map(...p),rot(X,0)],'guide');line([map(...p),rot(0,Y)],'guide');
    const B=5/36*Math.sin(2*theta);Object.assign(values,{theta,B,X,Y,distance:Math.hypot(...p),rotatedDistance:Math.hypot(X,Y)});
    metric='x²/9+y²/4=1 · θ='+ (theta*180/Math.PI).toFixed(1)+'° · XY항 계수 B′='+B.toFixed(4);description='타원과 점은 고정하고 좌표축을 회전합니다. 방정식의 표현이 바뀌어도 거리는 같습니다.';
  }else if(family==='continuity'){
    const mode=[0,0,1,2,2,3,3][s],map=(x,y)=>[290+(x-1)*115,340-y*48],eps=.045+.8*wave;
    line([[70,340],[690,340]],'axis');line([[175,55],[175,385]],'axis');line([map(1,-.7),map(1,5.5)],'guide');label('x = 1',[300,378]);
    const left=mode===1?x=>x:x=>x+1,right=x=>x+1;
    plot(left,-.7,.999,map);plot(right,1.001,3.8,map);dot(map(1,mode===1?1:2),'','hole');if(mode===1)dot(map(1,2),'f(1)=2');else if(mode===2)dot(map(1,5),'f(1)=5');else if(mode===3)dot(map(1,2),'f(1)=2');
    dot(map(1-eps,left(1-eps)));dot(map(1+eps,right(1+eps)));
    metric=['함숫값 없음 · 극한 2 · 일치 조건은 확인 불가','함숫값 2 · 좌극한 1 ≠ 우극한 2','함숫값 5 · 극한 2 · 서로 다름','함숫값 2 = 좌우극한 2 · 연속'][mode];Object.assign(values,{mode,leftLimit:mode===1?1:2,rightLimit:2,functionValue:mode===0?null:mode===2?5:2});description='빈 점과 찬 점을 구별하고 함숫값·극한 존재·일치의 순서로 판단합니다.';
  }else if(family==='tetrahedron'){
    const height=s<3?1:s<6?2:1+.5*wave,A=[1,1,1],B=[1,-1,-1],C=[-1,1,-1],D=[-1,-1,height],G=[1/3,1/3,-1/3],q=(3+height)/3,H=[-1+q,-1+q,height-q],k=-(height*height-1)/(2*(height+3)),O=[k,k,-k];
    const angle=.55+.15*Math.sin(time*.15),co=Math.cos(angle),si=Math.sin(angle),map=p=>{const x=p[0]*co-p[1]*si,y=p[0]*si+p[1]*co;return[380+x*95,255+y*37-p[2]*65]};
    const vertices=[A,B,C,D];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)line([map(vertices[i]),map(vertices[j])]);line([map(A),map(B),map(C)],'wash',true);vertices.forEach((p,i)=>dot(map(p),'ABCD'[i]));
    line([map(D),map(H)],'secondary');line([map(D),map(G)],'guide');if(height===1)dot(map(G),'H=G');else{dot(map(G),'G');dot(map(H),'H','secondary')}dot(map(O),'O');for(const p of vertices)line([map(O),map(p)],'ghost');
    const dist=(a,b)=>Math.hypot(...a.map((v,i)=>v-b[i])),radii=vertices.map(p=>dist(p,O));Object.assign(values,{height,G,H,O,radii,footDistance:dist(G,H)});metric=height===1?'정사면체 · H=G · OA=OB=OC=OD=√3':'일반 사면체 · H와 G의 거리 '+dist(G,H).toFixed(3)+' · 네 외접반지름 '+radii[0].toFixed(3);description='정사면체에서 일치하던 무게중심과 수선의 발을, 꼭짓점 하나를 옮긴 사면체와 비교합니다.';
  }else if(family==='newton-cycle'){
    const starts=[0,.1,.5],steps=starts.map(x=>cubicNewton(x)),u=time*.34,index=Math.floor(u)%5,fraction=u-Math.floor(u),map=(x,row)=>[95+(Math.max(-2,Math.min(2,x))+2)*142,115+row*100];
    for(let row=0;row<3;row++){const pts=steps[row].map((x,n)=>{const p=map(x,row);return[p[0],p[1]+(n%2?15:-15)]});line([map(-2,row),map(2,row)],'axis');label('x₀ = '+starts[row],[70,pts[0][1]-30]);for(let i=0;i<5;i++)line([pts[i],pts[i+1]],i===index?'secondary':'ghost');pts.forEach((p,i)=>dot(p,i<3?String(i):''));const a=pts[index],b=pts[index+1];dot([a[0]+(b[0]-a[0])*fraction,a[1]+(b[1]-a[1])*fraction]);label('x'+(index+1)+' = '+steps[row][index+1].toFixed(5),[480,pts[0][1]-30])}
    Object.assign(values,{starts,steps,index});metric='f(x)=x³−2x+2 · x₀=0은 0↔1의 정확한 2주기';description='같은 함수의 세 초기값을 다섯 번 계산한 전시 예시입니다. 유한 번의 경로만으로 무한 반복의 결과를 확정하지 않습니다.';
  }else if(family==='reconstruction'){
    if(s<3){label(s<2?'구':'구의 yz 정사영',[150,70]);label(s<2?'원기둥':'원기둥의 yz 정사영',[450,70]);ellipse(220,220,90,90);line([[460,130],[640,130],[640,310],[460,310]],'primary',true);if(s<2){ellipse(550,130,90,23,'guide');ellipse(550,310,90,23,'guide')}
      if(s<2)for(const x of[220,550])ellipse(x,360,65,23,'secondary');
      if(s===2){ellipse(220,220,90,90,'secondary');line([[460,130],[640,130],[640,310],[460,310]],'secondary',true)}metric=s<2?'xy 방향: 모두 원판 · 같은 그림자가 같은 입체를 뜻하지 않는다.':'yz 방향: 구는 원판 · 원기둥은 직사각형';
    }else if(s===3){const theta=(25+65*wave)*Math.PI/180,half=90*Math.cos(theta);line([[170,130],[350,130],[350,310],[170,310]],'primary',true);line([[460,220-half],[640,220-half],[640,220+half],[460,220+half]],'wash',true);label('원래 정사각형',[190,90]);label('기울어진 정사영',[465,90]);Object.assign(values,{theta,area:4*Math.cos(theta)});metric='S=4 · θ='+(theta*180/Math.PI).toFixed(1)+'° · 정사영 넓이 '+values.area.toFixed(3);
    }else{const cube=(x,cavity)=>{line([[x,150],[x+130,150],[x+175,105],[x+45,105],[x,150],[x,295],[x+130,295],[x+175,250],[x+175,105]],'primary');line([[x+130,150],[x+130,295]],'secondary');if(cavity)ellipse(x+87,200,31,31,'guide')};cube(110,false);cube(425,true);label('속이 찬 입체',[105,75]);label('내부에 빈 공간',[420,75]);for(const x of[145,460])line([[x,330],[x+95,330],[x+95,385],[x,385]],'wash',true);metric='완전히 갇힌 빈 공간 · 모든 방향의 실루엣은 같아도 내부는 다르다.';}
    description='서로 다른 방향은 정보를 보완하지만 실루엣에 드러나지 않는 내부까지 결정하지는 못합니다.';
  }
  return{family,paths,dots,labels,values,metric,description};
}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function refreshFrameDrawing(frame){
  return frame.paths.map(p=>'<path class="'+(p.role==='negative'?'negative-fill':p.role)+'" d="'+p.points.map((q,i)=>(i?'L':'M')+q.map(v=>v.toFixed(3)).join(' ')).join(' ')+(p.closed?'Z':'')+'" data-draw="" pathLength="1"/>').join('')+frame.dots.map(p=>'<circle cx="'+p.point[0]+'" cy="'+p.point[1]+'" r="5" class="'+(p.role==='hole'?'secondary':'node')+'" '+(p.role==='hole'?'fill="none"':'')+' data-pop=""/>').join('')+frame.labels.map(p=>'<text x="'+p.point[0]+'" y="'+p.point[1]+'" class="label" data-label="">'+esc(p.text)+'</text>').join('')+'<text x="380" y="437" text-anchor="middle" class="metric">'+esc(frame.metric)+'</text>';
}
export function refreshArtSVG(family){const f=refreshMathFrame(family,0,2);return f?'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 470" aria-hidden="true"><style>.primary,.secondary,.guide,.ghost,.axis{fill:none;stroke:currentColor;stroke-width:2}.guide,.ghost,.axis{opacity:.3}.wash{fill:currentColor;fill-opacity:.08;stroke:currentColor}.node{fill:currentColor}.label,.metric{fill:currentColor;font:16px sans-serif}</style>'+refreshFrameDrawing(f)+'</svg>':null}
