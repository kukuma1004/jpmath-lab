import * as THREE from 'three';

// 전시자가 만든 해설 도해. 학생의 실행 결과나 실측 자료가 아니다.
export const inquiry3D=kind=>['space-points','ellipsoid','line-plane','point-projection'].includes(kind);
export function makeInquiry3D(view){
  const v=view,k=v.kind,accent=0xe1eea4,pale=0xc4d7b3;
  const label=document.createElement('div');label.className='scene-live-label';v.host.append(label);
  const point=(p,r=.055)=>{const m=v.mesh(new THREE.SphereGeometry(r,14,10),accent,1);m.position.set(...p);return m};
  if(k==='space-points'){
    const A=[-1.5,-.9,-.8],B=[1.5,1.05,.9];point(A);point(B);
    v.line([A,B],accent,1);v.line([A,[B[0],A[1],A[2]],[B[0],B[1],A[2]],B],pale,.5,true);
    const P=point(A,.09);
    for(let i=0;i<3;i++){const end=[...A];end[i]+=3.3;v.line([A,end],pale,.2)}
    v.updates.push(t=>{const u=.5+.43*Math.sin(t*.38);P.position.set(...A.map((a,i)=>(1-u)*a+u*B[i]));label.textContent='AP : PB = '+u.toFixed(2)+' : '+(1-u).toFixed(2);});
  }else if(k==='ellipsoid'){
    const a=2,b=1.6,f=1.2,m=v.mesh(new THREE.SphereGeometry(1,56,36),0x719b75,.28);m.scale.set(a,b,b);
    const wire=new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(1,24,16)),new THREE.LineBasicMaterial({color:pale,transparent:true,opacity:.15}));wire.scale.copy(m.scale);v.group.add(wire);
    point([-f,0,0]);point([f,0,0]);const moving=point([a,0,0],.075),left=v.line([[-f,0,0],[a,0,0]],accent,.9),right=v.line([[f,0,0],[a,0,0]],accent,.9),ring=v.line([[0,0,0],[0,0,0]],pale,.7);
    v.updates.push(t=>{const phi=t*.25+.5,theta=t*.15+.5,P=[a*Math.cos(phi),b*Math.sin(phi)*Math.cos(theta),b*Math.sin(phi)*Math.sin(theta)];moving.position.set(...P);v.updateLine(left,[[-f,0,0],P]);v.updateLine(right,[[f,0,0],P]);const pts=[];for(let i=0;i<=128;i++){const q=i/128*2*Math.PI;pts.push([a*Math.cos(q),b*Math.sin(q)*Math.cos(theta),b*Math.sin(q)*Math.sin(theta)])}v.updateLine(ring,pts);label.textContent='두 초점을 포함하는 단면 · PF₁ + PF₂ = 4';});
  }else if(k==='line-plane'){
    const plane=v.mesh(new THREE.PlaneGeometry(4.2,3.1),0x8fa77e,.23);plane.rotation.x=-Math.PI/2;
    const line=v.line([[-2,1,0],[2,-1,0]],accent,1),P=point([0,1,0]);v.group.add(new THREE.ArrowHelper(new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,0),1.5,pale,.18,.08));
    v.updates.push(t=>{const mode=Math.floor(t/5)%3,y=mode===2?0:1,dy=mode===0?-.7:0,A=[-2,y-2*dy,-.5],B=[2,y+2*dy,.5];v.updateLine(line,[A,B]);P.position.set(0,y,0);label.textContent=['교차 · v·n ≠ 0','평행 · v·n = 0, P는 평면 밖','포함 · v·n = 0, P는 평면 위'][mode]});
  }else if(k==='point-projection'){
    const plane=v.mesh(new THREE.PlaneGeometry(4.2,3.1),0x8fa77e,.23);plane.rotation.x=-Math.PI/2;
    const A=[-.8,.9,.3],B=[.8,-.9,.3],pa=point(A),pb=point(B),qa=point([0,0,0],.08),qb=point([0,0,0],.08),rays=[v.line([A,A],pale,.6,true),v.line([B,B],pale,.6,true)];
    v.line([A,B],pale,.3);v.updates.push(t=>{const theta=-Math.atan2(1.6,1.8)+.65*Math.sin(t*.25),n=new THREE.Vector3(Math.sin(theta),Math.cos(theta),0);plane.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),n);[A,B].forEach((p,i)=>{const P=new THREE.Vector3(...p),Q=P.clone().addScaledVector(n,-P.dot(n));(i?qb:qa).position.copy(Q);v.updateLine(rays[i],[p,Q.toArray()])});label.textContent='차벡터가 관찰 방향과 평행하면 정사영이 겹칩니다';});
  }
}

export function inquiryArt(kind){
  const cases={
    riemann:'<path d="M65 215 H295 M75 215 V70"/><path d="M80 215V206H120V179H160V134H200V71H240V215" opacity=".4"/><path d="M80 215 Q160 215 240 71" stroke-width="2"/>',
    'signed-area':'<path d="M60 138H300 M180 38V230" opacity=".3"/><path d="M80 205L280 71"/><path d="M80 205V138H180Z M180 138H280V71Z" fill="currentColor" fill-opacity=".13"/>',
    parabola:'<path d="M65 55 Q180 320 295 55"/><path d="M65 222H295" opacity=".5"/><circle cx="180" cy="141" r="4" fill="currentColor"/><path d="M180 141L255 156V222" stroke-dasharray="4 4"/>',
    rolle:'<path d="M55 80H305 M75 133H285 M100 185H260" opacity=".3"/>'+[55,115,180,235,305].map(x=>'<circle cx="'+x+'" cy="80" r="4"/>').join('')+[85,145,210,275].map(x=>'<circle cx="'+x+'" cy="133" r="4"/>').join('')+[115,180,245].map(x=>'<circle cx="'+x+'" cy="185" r="4"/>').join(''),
    ellipsoid:'<ellipse cx="180" cy="135" rx="123" ry="78"/><ellipse cx="180" cy="135" rx="123" ry="30" opacity=".5"/><ellipse cx="180" cy="135" rx="45" ry="78" opacity=".3"/><path d="M105 135L205 60L255 135"/><circle cx="105" cy="135" r="3"/><circle cx="255" cy="135" r="3"/>',
    rotation:'<path d="M55 176H305 M180 50V231" opacity=".3"/><path d="M75 230L285 57 M98 54L274 235" stroke-dasharray="4 4" opacity=".55"/><path d="M80 68Q180 300 280 68" stroke-width="2"/>',
    compound:'<path d="M60 218H305 M70 218V43" opacity=".3"/><path d="M90 65Q120 179 292 198" stroke-width="2"/><path d="M90 55Q120 173 292 195" stroke-dasharray="5 5" opacity=".6"/>',
    'tangent-conic':'<ellipse cx="180" cy="135" rx="104" ry="67"/><path d="M284 40V232"/><circle cx="284" cy="135" r="4" fill="currentColor"/>',
    restore:'<path d="M70 195C150 20 200 247 292 62 M70 218C150 43 200 270 292 85 M70 172C150 -3 200 224 292 39" opacity=".7"/>',
    'restore-quadratic':'<path d="M65 65Q180 280 295 65 M65 100Q180 315 295 100 M65 30Q180 245 295 30" opacity=".7"/>',
    model:'<path d="M65 215H300 M80 215V48" opacity=".3"/><path d="M85 210L285 60 M85 210Q250 195 285 60 M85 210C175 210 175 60 285 60" opacity=".7"/>',
    curvature:'<path d="M70 222C150 222 206 50 290 50" stroke-width="2"/><path d="M100 228L260 45" stroke-dasharray="5 5" opacity=".5"/><circle cx="180" cy="137" r="5"/>',
    ratio:'<path d="M62 200C128 -40 205 300 298 60"/><path d="M114 222H245 M114 215V229 M180 215V229 M245 215V229" opacity=".5"/><circle cx="114" cy="105" r="4"/><circle cx="180" cy="135" r="4"/><circle cx="245" cy="165" r="4"/>',
    chain:'<path d="M58 55Q133 300 208 55"/><path d="M165 220C220 220 240 55 299 55"/><circle cx="133" cy="178" r="4"/><circle cx="233" cy="135" r="4"/>',
    'tangent-count':'<path d="M63 213C123 -15 213 285 300 52"/><path d="M55 180L300 80 M68 230L285 36 M60 108L300 158" opacity=".5"/><circle cx="207" cy="118" r="5" fill="currentColor"/>',
    'mean-value':'<path d="M70 195Q180 225 285 63"/><path d="M70 195L285 63 M95 230L280 116" opacity=".6"/>',
    'space-points':'<path d="M78 196L180 155L280 72 M78 196H280V72 M180 155V44 M180 155L285 222" opacity=".65"/><circle cx="78" cy="196" r="5"/><circle cx="280" cy="72" r="5"/><circle cx="180" cy="155" r="5" fill="currentColor"/>',
    'line-plane':'<path d="M55 175L214 113L305 164L145 225Z" opacity=".4"/><path d="M91 70L268 208 M180 166V45"/><circle cx="180" cy="141" r="5"/>',
    'point-projection':'<path d="M60 191L214 132L302 181L146 240Z" opacity=".4"/><path d="M110 70L170 186 M205 55L215 167" stroke-dasharray="4 4"/><circle cx="110" cy="70" r="5"/><circle cx="205" cy="55" r="5"/><circle cx="170" cy="186" r="3"/><circle cx="215" cy="167" r="3"/>'
  };
  const art=cases[kind];return art?'<svg viewBox="0 0 360 270" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.4">'+art+'</g></svg>':null;
}

export function drawInquiry2D({kind:k,t,phase,c,path,dot,green,pale}){
  const supported=['riemann','signed-area','parabola','rolle','restore','restore-quadratic','ratio','mean-value','chain','model','compound','tangent-conic','tangent-count','rotation','curvature'];
  if(!supported.includes(k))return false;
  const text=(s,x=-200,y=122)=>{c.font='12px sans-serif';c.fillStyle=pale;c.fillText(s,x,y)};
  const plot=(f,min=-2,max=2,sx=85,sy=35,color=green,width=2)=>{const ps=[];for(let x=min;x<=max+.0001;x+=(max-min)/150)ps.push([x*sx,35-f(x)*sy]);path(ps,color,width)};
  const dashed=(pts,color=pale)=>{c.setLineDash([5,5]);path(pts,color,1);c.setLineDash([])};
  if(k==='riemann'){
    const n=4+Math.floor(18*(.5+.5*Math.sin(t*.28))),dx=300/n,base=35,left=-150;
    for(let i=0;i<n;i++){const low=(i/n)**2*185,high=((i+1)/n)**2*185;c.fillStyle='#ddec9d15';c.fillRect(left+i*dx,base-high,dx,high);c.strokeStyle='#c4d7b355';c.strokeRect(left+i*dx,base-high,dx,high);c.strokeStyle=green;c.strokeRect(left+i*dx,base-low,dx,low)}
    const ps=[];for(let i=0;i<=120;i++){const x=i/120;ps.push([left+300*x,base-185*x*x])}path(ps);path([[left,base],[150,base]],pale,1);text('n = '+n+'   L = '+((n-1)*(2*n-1)/(6*n*n)).toFixed(4)+'   R = '+((n+1)*(2*n+1)/(6*n*n)).toFixed(4),-190,104);text('f(x)=x² · [0,1] · ∫f = 1/3',-190,128);
  }else if(k==='signed-area'){
    const end=-2+4*(.5+.5*Math.sin(t*.25));for(let x=-2;x<end;x+=.025){const yy=x*55;c.fillStyle=x<0?'#b9ceb52b':'#ddec9d44';c.fillRect(x*85,Math.min(35,35-yy),2.5,Math.abs(yy));}plot(x=>x,-2,2,85,55);dot(end*85,35-end*55,5);text('∫ f = '+((end*end-4)/2).toFixed(2)+'   ∫ |f| = '+(end<0?(4-end*end)/2:2+end*end/2).toFixed(2));text('f(x)=x · 시작점 −2',-200,144);
  }else if(k==='parabola'){
    const p=.6+.55*(.5+.5*Math.sin(t*.3)),x=1.5*Math.sin(t*.3+.7),y=x*x/(4*p),sx=62,F=[0,35-p*sx],P=[x*sx,35-y*sx],H=[x*sx,35+p*sx];plot(x=>x*x/(4*p),-2.4,2.4,sx,sx);dashed([[-200,35+p*sx],[200,35+p*sx]]);path([F,P,H],pale,1.2);dot(...F,5);dot(...P,5);text('F',F[0]+10,F[1]);text('d(P,F) = d(P,준선)',-200,-145);
  }else if(k==='rolle'){
    const roots=[-2,-1,0,1,2],inner=[-Math.sqrt((15+Math.sqrt(145))/10),-Math.sqrt((15-Math.sqrt(145))/10),Math.sqrt((15-Math.sqrt(145))/10),Math.sqrt((15+Math.sqrt(145))/10)];
    plot(x=>x**5-5*x**3+4*x,-2.12,2.12,85,15);roots.forEach(x=>dot(x*85,35,4));const alpha=.45+.4*Math.sin(t*.3);for(let i=0;i<4;i++){path([[roots[i]*85,77],[roots[i+1]*85,77]],'#c2d4b060',1);dot(inner[i]*85,95,5,'rgba(221,236,157,'+alpha+')')}text('f의 근 5개 → f′의 근 4개',-185,132);
  }else if(k==='restore'||k==='restore-quadratic'){
    const f=k==='restore'?x=>x**3/3-x:x=>x*x;[-1.2,0,1.2].forEach((C,i)=>plot(x=>f(x)+C,-1.8,1.8,86,32,i===1?green:'#c2d4b055',i===1?2:1));const C=.9*Math.sin(t*.3);plot(x=>f(x)+C,-1.8,1.8,86,32,'#e1eea4b0',2);dot(86,35-(f(1)+C)*32,5);text(k==='restore'?'같은 도함수 x²−1, 달라지는 적분상수 C':'같은 도함수 2x, 달라지는 적분상수 C',-205,132);
  }else if(k==='ratio'){
    plot(x=>x**3-3*x,-1.85,1.85,85,28);[[-1,2],[0,0],[1,-2]].forEach(p=>dot(p[0]*85,35-p[1]*28,5));path([[-85,105],[0,105],[85,105]],pale,1);[-85,0,85].forEach(x=>path([[x,100],[x,110]],pale,1));text('1',-46,126);text('1',39,126);text('변곡점을 기준으로 나눈 수평 거리',-180,-138);
  }else if(k==='mean-value'){
    plot(x=>x*x,-1.5,2.1,80,35);path([[-80,0],[160,-105]],pale,1.5);const a=.5+.8*Math.sin(t*.27);path([[-120,35-(a*a+2*a*(-1.5-a))*35],[172,35-(a*a+2*a*(2.15-a))*35]],green,1.3);dot(a*80,35-a*a*35,5);text('평균 기울기 1 = f′(1/2)',-185,130);text('f(x)=x², 구간 [−1,2]',-185,151);
  }else if(k==='chain'){
    const mode=Math.floor(t/6)%3,f=[x=>x*x,x=>x**3,x=>x**4][mode];plot(f,-1.5,1.5,90,32);dot(0,35,5);text(['x² · 도함수 부호 − → + · 극소','x³ · 도함수 부호 + → + · 극값 아님','x⁴ · 두 조건이 겹쳐도 부호 확인'][mode],-205,130);text('h′(0)=0 다음에, 양쪽 부호를 읽습니다.',-205,-140);
  }else if(k==='model'){
    plot(x=>1+.3*x,-2,2,80,55,pale,1.4);plot(x=>Math.exp(.5*x),-2,2,80,55,green,1.7);plot(x=>2/(1+Math.exp(-x)),-2,2,80,55,'#aac782',1.4);text('일차 · 지수 · 로지스틱 후보 함수',-200,120);text('전시용 함수 도해 · 학생 실측 자료 아님',-200,144);
  }else if(k==='compound'){
    const X=r=>-180+(r-1)/14*360,Y=y=>35-y*2.6,exact=r=>Math.log(2)/Math.log(1+r/100),ps=[],qs=[];for(let r=1.5;r<=15;r+=.07){ps.push([X(r),Y(exact(r))]);qs.push([X(r),Y(72/r)])}path(ps);dashed(qs);const r=3+9*(.5+.5*Math.sin(t*.24));dot(X(r),Y(exact(r)),5);text('r='+r.toFixed(1)+'%  정확값 '+exact(r).toFixed(2)+'년  72/r '+(72/r).toFixed(2)+'년',-205,118);text('연 1회 복리 · 일정한 이율의 수학 모형',-205,142);
  }else if(k==='tangent-conic'){
    const a=2,b=1,theta=t*.23,ps=[];for(let i=0;i<=160;i++){const q=i/160*Math.PI*2;ps.push([a*Math.cos(q)*80,35-b*Math.sin(q)*80])}path(ps);const P=[a*Math.cos(theta),b*Math.sin(theta)],D=[-a*Math.sin(theta),b*Math.cos(theta)];path([[80*(P[0]-2*D[0]),35-80*(P[1]-2*D[1])],[80*(P[0]+2*D[0]),35-80*(P[1]+2*D[1])]],pale,1.2);dot(P[0]*80,35-P[1]*80,5);text('수직인 경우에도 접점과 중근은 남습니다.',-205,145);
  }else if(k==='tangent-count'){
    const b=[-.12,0,.3,1,1.12][Math.floor(t/5)%5],H=x=>2*x**3-3*x*x+b,roots=[];const add=x=>{if(!roots.some(r=>Math.abs(r-x)<1e-5))roots.push(x)};for(const x of [0,1])if(Math.abs(H(x))<1e-8)add(x);for(const [l,r]of[[-3,0],[0,1],[1,3]]){let lo=l,hi=r;if(H(lo)*H(hi)>=0)continue;for(let i=0;i<45;i++){const mid=(lo+hi)/2;if(H(lo)*H(mid)<=0)hi=mid;else lo=mid}add((lo+hi)/2)}plot(x=>x**3,-1.3,1.75,85,28);roots.forEach(a=>{path([[-110,35-(3*a*a*(-110/85)-2*a**3)*28],[180,35-(3*a*a*(180/85)-2*a**3)*28]],'#c2d4b08f',1);dot(a*85,35-a**3*28,4)});dot(85,35-b*28,6);text('P(1, '+b+') · 서로 다른 접선 '+roots.length+'개',-205,136);
  }else if(k==='rotation'){
    plot(x=>x*x,-1.55,1.55,60,60);const theta=.7*Math.sin(t*.22),co=Math.cos(theta),si=Math.sin(theta);path([[-200*co,35+200*si],[200*co,35-200*si]],green,1.2);path([[200*si,35+200*co],[-200*si,35-200*co]],pale,1.2);dot(60,-25,5);text('점은 그대로 · 좌표축이 회전합니다.',-205,130);text('XY항의 계수 = −a sin(2θ)',-205,151);
  }else if(k==='curvature'){
    plot(x=>x**3,-1.8,1.8,85,26);const a=1.4*Math.sin(t*.3),m=3*a*a;path([[-180,35-(a**3+m*(-180/85-a))*26],[180,35-(a**3+m*(180/85-a))*26]],pale,1.1);dot(a*85,35-a**3*26,5);text('f(x)=x³ · f′′(x)=6x · '+(a<0?'기울기가 작아집니다':'기울기가 커집니다'),-205,136);
  }
  return true;
}
