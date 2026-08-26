(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[ri(0,a.length-1)];
  const vec=v=>`(${v.join(', ')})`, point=vec;
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=ri(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
  const sqTerm=(x,a)=>a===0?`${x}²`:`(${x}${a<0?'+':'−'}${Math.abs(a)})²`;
  const equationSphere=(c,r)=>`${sqTerm('x',c[0])}+${sqTerm('y',c[1])}+${sqTerm('z',c[2])}=${r*r}`;
  const choices=(correct,wrong)=>{const out=[];[correct,...wrong].forEach(v=>{v=String(v);if(!out.includes(v))out.push(v)});let n=1;while(out.length<4){const text=String(correct),tuple=text.match(/^\((-?\d+)(?:,\s*(-?\d+))?(?:,\s*(-?\d+))?\)$/),raw=Number(correct);let v;if(tuple){const nums=tuple.slice(1).filter(x=>x!==undefined).map(Number);v=vec(nums.map((x,i)=>x+(i===((n-1)%nums.length)?n:0)))}else if(Number.isFinite(raw))v=String(raw+n);else v=`조건 불일치 ${n}`;if(!out.includes(v))out.push(v);n++}return shuffle(out.slice(0,4))};
  const Q=(type,equation,prompt,correct,wrong,explanation)=>({type,equation,prompt,correct:String(correct),choices:choices(correct,wrong),explanation});
  const triples=[[5,4,3],[5,3,4],[10,8,6],[10,6,8],[13,12,5],[13,5,12]];
  const diffTriples=[[[1,2,2],3],[[2,3,6],7],[[2,6,9],11],[[4,4,7],9]];
  const projectionValue=(L,a)=>a===0?String(L):a===60?String(L/2):a===30?(L===2?'√3':`${L/2}√3`):(L===2?'√2':`${L/2}√2`);
  const groupTraps={
    conic:[['제곱과 길이 혼동','분모 a²와 실제 길이 a를 구분하세요.'],['부호를 한 종류로 암기','타원은 빼기, 쌍곡선은 더하기 관계입니다.'],['축 방향 확인 생략','큰 분모 또는 제곱된 변수로 열린 방향을 먼저 확인하세요.']],
    space:[['그림의 모양만 믿기','공간 그림의 평행·수직은 조건과 정리로 판단해야 합니다.'],['좌표 차를 제곱하지 않기','공간거리도 각 좌표 차를 제곱해 더합니다.'],['각도의 기준 혼동','정사영에서는 원래 도형과 투영면 사이의 각을 확인하세요.']],
    vector:[['종점−시점 순서 반대','AB벡터는 반드시 B의 좌표에서 A의 좌표를 뺍니다.'],['성분별 계산 누락','x, y, z 성분을 같은 자리끼리 계산하세요.'],['방향과 위치 혼동','기준점과 방향벡터는 서로 다른 역할을 합니다.']]
  };

  function makeQuestion(id){
    let a,b,c,p,t,k,s,axis,A,B,P,v,w,ans,type,n,m,d,r,angle,L;
    switch(id){
      case'parabola_form':
        p=ri(1,4);s=pick([-1,1]);axis=pick(['x','y']);k=4*p*s;
        return Q('OPEN DIRECTION',axis==='x'?`y²=${k}x`:`x²=${k}y`,'포물선이 열리는 방향은?',axis==='x'?`x축의 ${s>0?'양':'음'}의 방향`:`y축의 ${s>0?'양':'음'}의 방향`,['x축의 양의 방향','x축의 음의 방향','y축의 양의 방향','y축의 음의 방향'],`제곱되지 않은 변수와 계수 ${k}의 부호를 함께 봅니다.`);
      case'parabola_focus':
        p=ri(1,5);s=pick([-1,1]);axis=pick(['x','y']);type=pick(['focus','line']);k=4*p*s;
        if(axis==='x')return Q(type==='focus'?'FOCUS':'DIRECTRIX',`y²=${k}x`,type==='focus'?'초점의 좌표는?':'준선의 방정식은?',type==='focus'?point([s*p,0]):`x=${-s*p}`,[point([-s*p,0]),point([0,s*p]),`x=${s*p}`],`y²=4px에서 초점은 (p,0), 준선은 x=−p입니다.`);
        return Q(type==='focus'?'FOCUS':'DIRECTRIX',`x²=${k}y`,type==='focus'?'초점의 좌표는?':'준선의 방정식은?',type==='focus'?point([0,s*p]):`y=${-s*p}`,[point([0,-s*p]),point([s*p,0]),`y=${s*p}`],`x²=4py에서 초점은 (0,p), 준선은 y=−p입니다.`);
      case'parabola_point':
        p=ri(1,4);s=pick([-1,1]);t=ri(1,3)*pick([-1,1]);A=[s*p*t*t,2*p*t];
        return Q('POINT CONDITION',`y²=${4*s*p}x, y=${A[1]}`,'이 포물선 위 점의 x좌표는?',A[0],[A[0]+p,A[1],-A[0]],`x=y²/(4p)이므로 x=${A[1]*A[1]}/${4*s*p}=${A[0]}입니다.`);
      case'ellipse_abc':
        [a,b,c]=pick(triples);type=pick(['c2','c','focus']);
        if(type==='c2')return Q('C² CALC',`x²/${a*a}+y²/${b*b}=1`,'c²의 값은?',c*c,[a*a+b*b,c,2*a],`c²=a²−b²=${a*a}−${b*b}=${c*c}`);
        if(type==='c')return Q('C CALC',`x²/${a*a}+y²/${b*b}=1`,'c의 값은?',c,[c*c,b,a],`c=√(${a*a}−${b*b})=${c}`);
        return Q('FOCUS',`x²/${a*a}+y²/${b*b}=1`,'두 초점의 좌표는?',`(±${c}, 0)`,[`(0, ±${c})`,`(±${a}, 0)`,`(±${b}, 0)`],`큰 분모가 x² 아래이므로 초점은 x축 위 (±c,0)입니다.`);
      case'ellipse_distance':
        [a,b,c]=pick(triples);type=ri(0,1);
        if(type===0)return Q('DISTANCE SUM',`x²/${a*a}+y²/${b*b}=1`,'타원 위 점 P에서 PF₁+PF₂는?',2*a,[a,2*b,2*c],`타원의 거리 합은 장축의 길이 2a=${2*a}입니다.`);
        k=ri(1,2*a-1);return Q('MISSING DISTANCE',`PF₁=${k}, PF₁+PF₂=${2*a}`,'PF₂의 길이는?',2*a-k,[2*a+k,a-k,k],`PF₂=2a−PF₁=${2*a}−${k}=${2*a-k}`);
      case'ellipse_equation':
        a=ri(3,6);b=ri(1,a-1);axis=pick(['x','y']);ans=axis==='x'?`x²/${a*a}+y²/${b*b}=1`:`x²/${b*b}+y²/${a*a}=1`;
        return Q('BUILD EQUATION',`장반경 ${a}, 단반경 ${b}, 장축은 ${axis}축`,'타원의 방정식은?',ans,[axis==='x'?`x²/${b*b}+y²/${a*a}=1`:`x²/${a*a}+y²/${b*b}=1`,`x²/${a*a}−y²/${b*b}=1`,`x²/${a}+y²/${b}=1`],`장축 방향 변수 아래에 큰 분모 a²=${a*a}을 놓습니다.`);
      case'hyperbola_abc':
        a=ri(1,4);do{b=ri(1,4)}while(a===b);c=a*a+b*b;type=ri(0,1);
        return type===0?Q('C² CALC',`x²/${a*a}−y²/${b*b}=1`,'c²의 값은?',c,[a*a,b*b,c+1],`쌍곡선에서는 c²=a²+b²=${a*a}+${b*b}=${c}`):Q('VERTEX',`x²/${a*a}−y²/${b*b}=1`,'두 꼭짓점은?',`(±${a}, 0)`,[`(0, ±${a})`,`(±${b}, 0)`,`(±${c}, 0)`],`양의 항이 x²이므로 꼭짓점은 x축 위 (±a,0)입니다.`);
      case'hyperbola_asymptote':
        a=ri(2,5);do{b=ri(1,4)}while(a===b);axis=pick(['x','y']);ans=axis==='x'?`y=±${b}/${a}x`:`y=±${a}/${b}x`;
        return Q('ASYMPTOTE',axis==='x'?`x²/${a*a}−y²/${b*b}=1`:`y²/${a*a}−x²/${b*b}=1`,'두 점근선의 방정식은?',ans,[axis==='x'?`y=±${a}/${b}x`:`y=±${b}/${a}x`,`y=±${b*b}/${a*a}x`,`y=${b}/${a}x`],`양의 항의 반경을 분모 기준으로 두고 두 부호 ±를 모두 씁니다.`);
      case'hyperbola_distance':
        a=ri(1,5);k=ri(1,6);return Q('DISTANCE DIFFERENCE',`|PF₁−PF₂|=2a, a=${a}`,'두 초점까지 거리 차의 절댓값은?',2*a,[a,2*k,a+k],`쌍곡선의 정의에 따라 |PF₁−PF₂|=2a=${2*a}입니다.`);
      case'tangent_parabola':
        p=ri(1,3);t=pick([-2,-1,1,2]);A=[p*t*t,2*p*t];ans=`${A[1]}y=${2*p}(x+${A[0]})`;
        return Q('PARABOLA TANGENT',`y²=${4*p}x, P${point(A)}`,'점 P에서의 접선은?',ans,[`${A[1]}y=${2*p}(x−${A[0]})`,`y=${A[1]}x+${A[0]}`,`${A[1]}y=${4*p}(x+${A[0]})`],`yy₁=2p(x+x₁)에 P의 좌표를 대입합니다.`);
      case'tangent_ellipse':
        a=ri(3,6);b=ri(1,a-1);axis=pick(['x','y']);s=pick([-1,1]);A=axis==='x'?[s*a,0]:[0,s*b];ans=axis==='x'?`x=${s*a}`:`y=${s*b}`;
        return Q('ELLIPSE TANGENT',`x²/${a*a}+y²/${b*b}=1, P${point(A)}`,'점 P에서의 접선은?',ans,[axis==='x'?`y=${s*a}`:`x=${s*b}`,axis==='x'?`x=${-s*a}`:`y=${-s*b}`,axis==='x'?`x=${s*b}`:`y=${s*a}`],`xx₁/a²+yy₁/b²=1에 꼭짓점 좌표를 넣으면 ${ans}입니다.`);
      case'tangent_hyperbola':
        a=ri(2,5);do{b=ri(1,4)}while(a===b);axis=pick(['x','y']);s=pick([-1,1]);A=axis==='x'?[s*a,0]:[0,s*a];ans=axis==='x'?`x=${s*a}`:`y=${s*a}`;
        return Q('HYPERBOLA TANGENT',axis==='x'?`x²/${a*a}−y²/${b*b}=1, P${point(A)}`:`y²/${a*a}−x²/${b*b}=1, P${point(A)}`,'점 P에서의 접선은?',ans,[axis==='x'?`y=${s*a}`:`x=${s*a}`,axis==='x'?`x=${-s*a}`:`y=${-s*a}`,axis==='x'?`x=${s*b}`:`y=${s*b}`],`꼭짓점에서의 접선은 열린 축에 수직이며 ${ans}입니다.`);
      case'relation_lines':
        type=ri(0,2);return [Q('LINE · LINE','두 직선이 한 점에서 만난다.','위치 관계는?','한 점에서 만남',['평행','꼬인 위치','일치'],'공통점이 하나면 두 직선은 한 점에서 만납니다.'),Q('LINE · LINE','두 직선이 같은 평면 위에 있고 만나지 않는다.','위치 관계는?','평행',['꼬인 위치','수직','일치'],'한 평면 위에서 만나지 않는 두 직선은 평행입니다.'),Q('LINE · LINE','두 직선이 한 평면 위에 놓이지 않는다.','위치 관계는?','꼬인 위치',['평행','수직','일치'],'같은 평면 위에 놓이지 않는 두 직선은 꼬인 위치입니다.')][type];
      case'relation_line_plane':
        type=ri(0,2);return [Q('LINE · PLANE','직선과 평면의 공통점이 없다.','위치 관계는?','평행',['한 점에서 만남','직선이 평면에 포함','수직'],'공통점이 없으면 직선과 평면은 평행입니다.'),Q('LINE · PLANE','직선 위 서로 다른 두 점이 평면 위에 있다.','반드시 성립하는 것은?','직선이 평면에 포함된다',['평행','한 점에서만 만난다','꼬인 위치'],'직선의 서로 다른 두 점이 평면 위에 있으면 직선 전체가 포함됩니다.'),Q('LINE · PLANE','직선과 평면의 공통점이 정확히 하나다.','위치 관계는?','한 점에서 만남',['평행','직선이 평면에 포함','일치'],'공통점이 하나면 직선이 평면을 가로질러 만납니다.')][type];
      case'relation_planes':
        type=ri(0,2);return [Q('PLANE · PLANE','서로 다른 두 평면의 공통점이 없다.','위치 관계는?','평행',['한 직선에서 만남','일치','꼬인 위치'],'서로 다른 두 평면이 만나지 않으면 평행입니다.'),Q('PLANE · PLANE','서로 다른 두 평면이 한 점을 공유한다.','반드시 성립하는 것은?','한 직선에서 만난다',['한 점에서만 만난다','평행','일치'],'두 평면이 만나면 교선 하나를 공유합니다.'),Q('PLANE · PLANE','두 평면이 서로 다른 세 공선점이 아닌 점을 공유한다.','위치 관계는?','일치',['평행','수직','한 직선에서 만남'],'한 직선 위에 있지 않은 세 점은 하나의 평면을 결정합니다.')][type];
      case'threeperp_conclusion':
        return Q('THREE PERPENDICULARS','PO⊥평면 α, OQ⊥직선 ℓ (OQ⊂α)','삼수선의 정리로 얻는 결론은?','PQ⊥ℓ',['PQ∥ℓ','PO∥ℓ','OQ⊥PQ'],'평면에 내린 수선 PO와 평면 위 수선 OQ로부터 PQ⊥ℓ을 얻습니다.');
      case'threeperp_distance':
        [[a,b],c]=pick([[[3,4],5],[[6,8],10],[[5,12],13]]);return Q('RIGHT TRIANGLE',`PO=${a}, OQ=${b}, ∠POQ=90°`,'PQ의 길이는?',c,[a+b,Math.abs(a-b),a*a+b*b],`PQ=√(PO²+OQ²)=√${a*a+b*b}=${c}`);
      case'projection_length':
        angle=pick([0,30,45,60]);L=angle===0?ri(2,7):pick([2,4,6]);ans=projectionValue(L,angle);return Q('PROJECTED LENGTH',`L=${L}, θ=${angle}°`,'선분의 정사영 길이는?',ans,[String(L),projectionValue(L,angle===60?30:60),String(L*2)],`정사영 길이는 Lcosθ=${ans}입니다.`);
      case'projection_area':
        angle=pick([0,30,45,60]);L=angle===0?ri(2,8):pick([2,4,6]);ans=projectionValue(L,angle);return Q('PROJECTED AREA',`원래 넓이 S=${L}, θ=${angle}°`,'정사영의 넓이는?',ans,[String(L),projectionValue(L,angle===60?30:60),String(L*2)],`정사영 넓이는 S cosθ=${ans}입니다.`);
      case'space_distance':
        [d,c]=pick(diffTriples);A=[ri(-2,2),ri(-2,2),ri(-2,2)];B=A.map((x,i)=>x+d[i]*pick([-1,1]));return Q('3D DISTANCE',`A${point(A)}, B${point(B)}`,'두 점 사이의 거리는?',c,[c*c,d.reduce((x,y)=>x+y,0),c+1],`좌표 차의 제곱합은 ${c*c}이므로 거리는 ${c}입니다.`);
      case'space_division':
        m=pick([1,2]);n=pick([1,2]);A=[ri(-3,2),ri(-3,2),ri(-3,2)];d=[ri(1,2),ri(-2,2),ri(1,2)];B=A.map((x,i)=>x+(m+n)*d[i]);P=A.map((x,i)=>x+m*d[i]);return Q('INTERNAL DIVISION',`A${point(A)}, B${point(B)}, AP:PB=${m}:${n}`,'내분점 P의 좌표는?',point(P),[point(A),point(B),point(P.map(x=>x+1))],`P=(nA+mB)/(m+n)=${point(P)}입니다.`);
      case'sphere_read':
        A=[ri(-3,3),ri(-3,3),ri(-3,3)];if(A.every(x=>x===0))A[0]=1;r=ri(1,5);type=ri(0,1);return type===0?Q('READ CENTER',equationSphere(A,r),'구의 중심은?',point(A),[point(A.map(x=>-x)),point([0,0,0]),point(A.map(x=>x+1))],`괄호 안 부호를 반대로 읽어 중심 ${point(A)}를 얻습니다.`):Q('READ RADIUS',equationSphere(A,r),'구의 반지름은?',r,[r*r,2*r,r+1],`우변은 r²=${r*r}이므로 반지름은 ${r}입니다.`);
      case'sphere_build':
        A=[ri(-2,2),ri(-2,2),ri(-2,2)];if(A.every(x=>x===0))A[0]=1;r=ri(1,4);ans=equationSphere(A,r);return Q('BUILD SPHERE',`중심 C${point(A)}, 반지름 ${r}`,'구의 방정식은?',ans,[equationSphere(A.map(x=>-x),r),equationSphere(A,r+1),`${sqTerm('x',A[0])}+${sqTerm('y',A[1])}+${sqTerm('z',A[2])}=${r}`],`중심 좌표의 부호를 반대로 괄호에 넣고 우변은 r²로 씁니다.`);
      case'vector_addsub':
        v=[ri(-4,4),ri(-4,4)];w=[ri(-4,4),ri(-4,4)];type=ri(0,1);ans=type===0?v.map((x,i)=>x+w[i]):v.map((x,i)=>x-w[i]);return Q('ADD · SUBTRACT',`a=${vec(v)}, b=${vec(w)}`,type===0?'a+b는?':'a−b는?',vec(ans),[vec([ans[0]+1,ans[1]]),vec([ans[0],ans[1]+1]),vec([ans[0]+1,ans[1]-1])],`같은 위치의 성분끼리 ${type===0?'더':'빼'}면 ${vec(ans)}입니다.`);
      case'vector_scalar':
        v=[ri(-3,3),ri(-3,3)];k=pick([-3,-2,2,3]);ans=v.map(x=>k*x);return Q('SCALAR MULTIPLE',`a=${vec(v)}, k=${k}`,'ka는?',vec(ans),[vec([ans[0]+1,ans[1]]),vec([ans[0],ans[1]+1]),vec([ans[0]+1,ans[1]-1])],`모든 성분에 ${k}를 곱하면 ${vec(ans)}입니다.`);
      case'vector_linear':
        v=[ri(-3,3),ri(-3,3)];w=[ri(-3,3),ri(-3,3)];m=pick([-2,-1,1,2]);n=pick([-2,-1,1,2]);ans=v.map((x,i)=>m*x+n*w[i]);return Q('LINEAR COMBINATION',`a=${vec(v)}, b=${vec(w)}`,`${m}a+${n}b는?`,vec(ans),[vec([ans[0]+1,ans[1]]),vec([ans[0],ans[1]+1]),vec([ans[0]+1,ans[1]-1])],`각 벡터를 실수배한 뒤 성분별로 더하면 ${vec(ans)}입니다.`);
      case'vector_component':
        A=[ri(-4,3),ri(-4,3)];B=[ri(-3,4),ri(-3,4)];ans=B.map((x,i)=>x-A[i]);return Q('AB COMPONENT',`A${point(A)}, B${point(B)}`,'AB벡터의 성분은?',vec(ans),[vec(A),vec(B),vec(ans.map(x=>-x))],`종점−시점, 즉 B−A=${vec(ans)}입니다.`);
      case'position_point':
        P=[ri(-5,5),ri(-5,5)];return Q('POSITION VECTOR',`OP벡터=${vec(P)}`,'점 P의 좌표는?',point(P),[point(P.map(x=>-x)),point([P[1],P[0]]),point(P.map(x=>x+1))],`원점에서 시작한 위치벡터의 성분이 점의 좌표입니다.`);
      case'vector_division':
        m=pick([1,2]);n=pick([1,2]);A=[ri(-3,2),ri(-3,2)];d=[ri(1,3),ri(-2,2)];B=A.map((x,i)=>x+(m+n)*d[i]);P=A.map((x,i)=>x+m*d[i]);return Q('VECTOR DIVISION',`A${point(A)}, B${point(B)}, AP:PB=${m}:${n}`,'P의 위치벡터는?',vec(P),[vec(A),vec(B),vec(P.map(x=>x+1))],`OP=(n·OA+m·OB)/(m+n)=${vec(P)}입니다.`);
      case'dot_component':
        v=[ri(-3,3),ri(-3,3)];w=[ri(-3,3),ri(-3,3)];ans=v[0]*w[0]+v[1]*w[1];return Q('DOT PRODUCT',`a=${vec(v)}, b=${vec(w)}`,'a·b는?',ans,[v[0]*w[1]+v[1]*w[0],-ans,ans+2],`같은 위치의 성분끼리 곱해 더하면 ${ans}입니다.`);
      case'dot_angle':
        type=pick(['acute','right','obtuse']);v=[ri(1,4),0];w=type==='acute'?[ri(1,4),ri(1,3)]:type==='right'?[0,ri(1,4)]:[-ri(1,4),ri(1,3)];ans=type==='acute'?'예각':type==='right'?'직각':'둔각';return Q('ANGLE SIGN',`a=${vec(v)}, b=${vec(w)}, a·b=${v[0]*w[0]}`,'두 벡터의 사이각은?',ans,['예각','직각','둔각','평각'],`내적이 ${type==='acute'?'양수':type==='right'?'0':'음수'}이므로 사이각은 ${ans}입니다.`);
      case'dot_length':
        a=pick([4,9,16]);b=pick([4,9,16]);c=ri(-2,3);type=ri(0,1);ans=type===0?a+b+2*c:a+b-2*c;return Q('LENGTH IDENTITY',`|a|²=${a}, |b|²=${b}, a·b=${c}`,type===0?'|a+b|²은?':'|a−b|²은?',ans,[a+b,Math.abs(a-b),type===0?a+b-2*c:a+b+2*c],`|a${type===0?'+':'−'}b|²=|a|²+|b|²${type===0?'+':'−'}2a·b=${ans}`);
      case'line_point_direction':
        P=[ri(-3,3),ri(-3,3)];v=[ri(1,4),ri(-3,3)||1];type=ri(0,1);return type===0?Q('DIRECTION VECTOR',`x=${vec(P)}+t${vec(v)}`,'계수로 바로 읽은 방향벡터는?',vec(v),[vec(P),vec([v[1],v[0]]),vec([v[0]+1,v[1]])],`매개변수 t의 계수벡터가 방향벡터입니다.`):Q('BASE POINT',`x=${vec(P)}+t${vec(v)}`,'t=0일 때 지나는 점은?',point(P),[point(v),point(P.map(x=>-x)),point(P.map(x=>x+1))],`t=0을 대입하면 기준점 ${point(P)}를 얻습니다.`);
      case'line_parameter':
        P=[ri(-3,3),ri(-3,3)];v=[ri(1,4),ri(-3,3)||1];t=ri(-2,3);ans=P.map((x,i)=>x+t*v[i]);return Q('PARAMETER',`x=${vec(P)}+t${vec(v)}, t=${t}`,'직선 위 점의 좌표는?',point(ans),[point(P),point(v),point(ans.map(x=>x+1))],`기준점에 ${t}배한 방향벡터를 더하면 ${point(ans)}입니다.`);
      case'plane_normal':
        n=[ri(1,4),ri(-3,3)||1,ri(1,4)];k=ri(-5,5);return Q('NORMAL VECTOR',`${n[0]}x${n[1]>=0?'+':''}${n[1]}y+${n[2]}z=${k}`,'계수로 바로 읽은 법선벡터는?',vec(n),[vec([n[0]+1,n[1],n[2]]),vec([n[0],n[1]+1,n[2]]),vec([n[0],n[1],n[2]+1])],`x,y,z의 계수를 순서대로 읽으면 ${vec(n)}입니다.`);
      case'sphere_vector':
        A=[ri(-2,2),ri(-2,2),ri(-2,2)];if(A.every(x=>x===0))A[0]=1;r=ri(1,5);type=ri(0,1);return type===0?Q('VECTOR SPHERE',`|x−${vec(A)}|=${r}`,'이 도형의 중심과 반지름은?',`중심 ${point(A)}, 반지름 ${r}`,[`중심 ${point(A.map(x=>-x))}, 반지름 ${r}`,`중심 ${point(A)}, 반지름 ${r*r}`,'하나의 평면'],`중심벡터에서 거리가 ${r}인 점의 집합입니다.`):Q('COORDINATE FORM',`|x−${vec(A)}|=${r}`,'좌표 방정식은?',equationSphere(A,r),[equationSphere(A.map(x=>-x),r),equationSphere(A,r+1),`${sqTerm('x',A[0])}+${sqTerm('y',A[1])}+${sqTerm('z',A[2])}=${r}`],`벡터 거리식을 세 좌표 차의 제곱합으로 바꿉니다.`);
      default:return Q('BASIC','a²=b²+c²','c²은?','a²−b²',['a²+b²','a−b','2a'],'타원에서는 c²=a²−b²입니다.');
    }
  }

  const defs=[
    ['parabola_form','conic','S01','포물선 표준형과 방향','식의 모양과 부호만 보고 열리는 축과 방향을 즉시 판별합니다.','y²=4px 또는 x²=4py','parabola',['제곱된 변수 확인','제곱되지 않은 축 찾기','4p의 부호로 방향 결정'],'기하_포물선.html'],
    ['parabola_focus','conic','S02','포물선 초점·준선 역산','4p를 읽어 초점과 준선의 위치를 서로 반대 방향으로 찾습니다.','초점 (p,0) · 준선 x=−p','parabola',['4p에서 p 계산','열리는 축 확인','초점과 준선을 반대쪽에 배치'],'기하_포물선.html'],
    ['parabola_point','conic','S03','포물선 위 점의 조건','점의 좌표를 방정식에 대입해 빠진 좌표와 매개변수를 계산합니다.','y²=4px에 P(x,y) 대입','parabola',['주어진 좌표 대입','제곱과 부호 계산','나머지 좌표 정리'],'기하_포물선.html'],
    ['ellipse_abc','conic','S04','타원 a·b·c 계산','장반경·단반경·초점거리의 제곱 관계를 빠르게 계산합니다.','a²=b²+c²','ellipse',['큰 분모에서 a 찾기','c²=a²−b² 계산','큰 분모의 축에 초점 배치'],'기하_타원.html'],
    ['ellipse_distance','conic','S05','타원의 거리 합','타원 위 점에서 두 초점까지 거리의 합이 항상 2a임을 이용합니다.','PF₁+PF₂=2a','ellipse',['장반경 a 확인','거리 합 2a 계산','한 거리를 빼서 나머지 계산'],'기하_타원.html'],
    ['ellipse_equation','conic','S06','조건으로 타원 방정식','장축 방향과 두 반경을 읽어 표준형의 분모를 정확히 배치합니다.','x²/a²+y²/b²=1','ellipse',['장축 방향 결정','a²와 b² 계산','해당 변수 아래에 분모 배치'],'기하_타원.html'],
    ['hyperbola_abc','conic','S07','쌍곡선 a·b·c 계산','쌍곡선의 초점거리 관계와 꼭짓점을 부호 실수 없이 계산합니다.','c²=a²+b²','hyperbola',['양의 항에서 a 찾기','c²=a²+b² 계산','열린 축에 꼭짓점 배치'],'기하_쌍곡선.html'],
    ['hyperbola_asymptote','conic','S08','쌍곡선의 점근선','두 반경의 비와 열린 축을 이용해 두 점근선을 구합니다.','y=±(b/a)x','hyperbola',['양의 항의 축 확인','반경의 비 계산','± 두 직선을 모두 쓰기'],'기하_쌍곡선.html'],
    ['hyperbola_distance','conic','S09','쌍곡선의 거리 차','두 초점까지 거리 차의 절댓값이 2a임을 바로 적용합니다.','|PF₁−PF₂|=2a','hyperbola',['a의 위치 확인','2a 계산','거리 차에 절댓값 유지'],'기하_쌍곡선.html'],
    ['tangent_parabola','conic','S10','포물선의 접선','포물선 위 한 점의 좌표를 접선 공식에 정확히 대입합니다.','yy₁=2p(x+x₁)','tangent',['4p에서 p 계산','접점 좌표 확인','x+x₁ 부호 유지'],'기하_이차곡선의접선.html'],
    ['tangent_ellipse','conic','S11','타원의 접선','타원 위 점을 표준 접선 공식에 대입해 직선의 식을 만듭니다.','xx₁/a²+yy₁/b²=1','tangent',['a²,b² 분모 유지','접점 좌표 대입','양변을 정리해 직선식 완성'],'기하_이차곡선의접선.html'],
    ['tangent_hyperbola','conic','S12','쌍곡선의 접선','쌍곡선 접선에서 두 항 사이의 마이너스 부호를 지킵니다.','xx₁/a²−yy₁/b²=1','tangent',['양의 항과 열린 축 확인','접점 좌표 대입','가운데 마이너스 유지'],'기하_이차곡선의접선.html'],
    ['relation_lines','space','S13','직선과 직선의 위치 관계','공통점과 한 평면 위 존재 여부로 평행·교차·꼬인 위치를 분류합니다.','공통점 · 동일평면 여부','space',['한 평면 위인지 확인','공통점 개수 확인','평행·교차·꼬인 위치 결정'],'기하_공간에서의위치관계.html'],
    ['relation_line_plane','space','S14','직선과 평면의 위치 관계','공통점의 개수로 포함·평행·한 점에서 만남을 판별합니다.','교점 0 · 1 · 무한개','space',['직선 위 두 점 확인','평면과 공통점 확인','포함·평행·교차 결정'],'기하_공간에서의위치관계.html'],
    ['relation_planes','space','S15','평면과 평면의 위치 관계','두 평면의 교선과 평행·일치 조건을 정확히 구분합니다.','평행 · 교선 · 일치','space',['공통점 존재 확인','교선 여부 확인','평행 또는 일치 구분'],'기하_공간에서의위치관계.html'],
    ['threeperp_conclusion','space','S16','삼수선 정리 수선 찾기','주어진 두 수선에서 공간의 세 번째 수직 관계를 찾아냅니다.','PO⊥α, OQ⊥ℓ ⇒ PQ⊥ℓ','space',['평면에 내린 수선 확인','평면 위 수선 확인','공간의 결론 PQ⊥ℓ 연결'],'기하_삼수선정리.html'],
    ['threeperp_distance','space','S17','삼수선과 최단거리','삼수선으로 만든 직각삼각형에서 피타고라스 계산을 수행합니다.','PQ²=PO²+OQ²','space',['삼수선으로 직각 확인','두 직각변 제곱','제곱합의 양의 제곱근'],'기하_삼수선정리.html'],
    ['projection_length','space','S18','선분의 정사영','원래 길이에 cosθ를 곱해 투영된 선분의 길이를 계산합니다.','L′=Lcosθ','projection',['원래 길이 L 확인','평면과 이루는 각 θ 확인','Lcosθ 계산'],'기하_정사영.html'],
    ['projection_area','space','S19','넓이의 정사영','도형의 넓이에 cosθ를 곱해 투영된 넓이를 계산합니다.','S′=Scosθ','projection',['원래 넓이 S 확인','두 평면 사이 각 확인','Scosθ 계산'],'기하_정사영.html'],
    ['space_distance','space','S20','공간의 두 점 사이 거리','세 좌표 차의 제곱합으로 공간거리를 계산합니다.','AB=√(Δx²+Δy²+Δz²)','coordinate',['B−A로 좌표 차 계산','세 차를 각각 제곱','제곱합의 제곱근'],'기하_공간좌표와내분점.html'],
    ['space_division','space','S21','공간좌표의 내분점','세 좌표에 같은 내분 공식을 적용해 공간의 내분점을 구합니다.','P=(nA+mB)/(m+n)','coordinate',['AP:PB=m:n 확인','반대쪽 비율로 가중합','m+n으로 나누기'],'기하_공간좌표와내분점.html'],
    ['sphere_read','space','S22','구의 중심·반지름 읽기','표준형의 괄호 부호와 우변에서 중심과 반지름을 읽습니다.','(x−a)²+(y−b)²+(z−c)²=r²','sphere',['괄호 부호 반대로 읽기','우변에서 양의 제곱근','중심과 반지름 함께 기록'],'기하_구의방정식.html'],
    ['sphere_build','space','S23','조건으로 구의 방정식','주어진 중심과 반지름을 구의 표준형에 정확히 넣습니다.','|PC|=r','sphere',['중심 좌표를 괄호에 배치','반지름을 제곱','세 좌표 항을 더하기'],'기하_구의방정식.html'],
    ['vector_addsub','vector','S24','벡터의 덧셈·뺄셈','같은 위치의 성분끼리 더하고 빼는 기본 연산을 자동화합니다.','(a,b)±(c,d)=(a±c,b±d)','vector',['연산 부호 확인','x성분끼리 계산','y성분끼리 계산'],'기하_벡터와연산.html'],
    ['vector_scalar','vector','S25','벡터의 실수배','하나의 실수를 모든 벡터 성분에 빠짐없이 곱합니다.','k(a,b)=(ka,kb)','vector',['실수 k의 부호 확인','모든 성분에 k 곱하기','방향 변화 확인'],'기하_벡터와연산.html'],
    ['vector_linear','vector','S26','벡터의 일차결합','실수배와 덧셈을 순서대로 적용해 복합 벡터를 계산합니다.','ma+nb','vector',['각 벡터 먼저 실수배','같은 성분끼리 더하기','최종 성분 검산'],'기하_벡터와연산.html'],
    ['vector_component','vector','S27','AB벡터의 성분','종점에서 시점 좌표를 빼서 두 점 사이 벡터를 구합니다.','AB=B−A','coordinate',['시점 A와 종점 B 확인','B−A 순서 유지','성분별로 빼기'],'기하_위치벡터와성분.html'],
    ['position_point','vector','S28','위치벡터와 점의 좌표','원점에서 시작하는 위치벡터를 점의 좌표와 대응시킵니다.','P(x,y,z) ⇔ OP=(x,y,z)','coordinate',['시점이 원점인지 확인','벡터 성분 읽기','같은 좌표의 점으로 대응'],'기하_위치벡터와성분.html'],
    ['vector_division','vector','S29','위치벡터로 내분점','두 위치벡터의 가중평균으로 내분점의 위치벡터를 구합니다.','OP=(nOA+mOB)/(m+n)','coordinate',['내분비 m:n 확인','반대편 비율로 가중합','전체 비율로 나누기'],'기하_위치벡터와성분.html'],
    ['dot_component','vector','S30','성분으로 벡터 내적','같은 위치 성분의 곱을 모두 더해 내적을 계산합니다.','a·b=a₁b₁+a₂b₂','dot',['같은 자리끼리 곱하기','모든 곱을 더하기','내적은 하나의 수임을 확인'],'기하_벡터의내적.html'],
    ['dot_angle','vector','S31','내적으로 각·수직 판별','내적의 부호와 0 여부로 예각·직각·둔각을 판별합니다.','a·b=|a||b|cosθ','dot',['내적 계산','양수·0·음수 판별','예각·직각·둔각 연결'],'기하_벡터의내적.html'],
    ['dot_length','vector','S32','내적으로 벡터 길이 계산','내적 항등식을 이용해 합·차 벡터의 길이를 계산합니다.','|a±b|²=|a|²+|b|²±2a·b','dot',['합인지 차인지 확인','2a·b 부호 결정','제곱길이 또는 길이 구분'],'기하_벡터의내적.html'],
    ['line_point_direction','vector','S33','직선의 기준점·방향벡터','벡터방정식에서 기준점과 방향벡터를 즉시 읽습니다.','x=p+tv','line',['t가 없는 벡터에서 기준점','t의 계수에서 방향벡터','두 역할을 바꾸지 않기'],'기하_벡터로표현한직선.html'],
    ['line_parameter','vector','S34','직선의 매개변수 계산','매개변수 값을 대입해 직선 위 점의 좌표를 계산합니다.','x(t)=p+tv','line',['주어진 t 확인','방향벡터를 t배','기준점에 성분별로 더하기'],'기하_벡터로표현한직선.html'],
    ['plane_normal','vector','S35','평면의 법선벡터','평면 방정식의 세 계수에서 법선벡터를 읽고 만듭니다.','ax+by+cz=d ⇒ n=(a,b,c)','plane',['x,y,z 계수 확인','상수항과 구분','법선벡터의 성분으로 기록'],'기하_벡터로표현한평면과구.html'],
    ['sphere_vector','vector','S36','구의 벡터식과 좌표식','중심벡터와 거리 조건을 좌표 방정식으로 변환합니다.','|x−c|=r','sphere',['중심벡터 c 확인','거리 r 확인','세 좌표 차의 제곱합으로 변환'],'기하_벡터로표현한평면과구.html']
  ];
  const skills=Object.fromEntries(defs.map((x,i)=>[x[0],{id:x[0],index:i+1,group:x[1],code:x[2],title:x[3],desc:x[4],formula:x[5],visual:x[6],steps:x[7],lesson:x[8]}]));

  const params=new URLSearchParams(location.search),id=params.get('id')||'parabola_form',skill=skills[id];
  const root=document.getElementById('skillApp');
  if(!skill){root.innerHTML='<div class="skill-not-found"><h1>스킬을 찾을 수 없습니다.</h1><p>기하 메인에서 다시 선택해주세요.</p><a href="index.html">기하 메인으로 돌아가기</a></div>';return}
  document.title=`${skill.title} · JP Math Lab 기하`;
  const groupName=skill.group==='conic'?'이차곡선':skill.group==='space'?'공간도형·좌표':'벡터';
  const color=skill.group==='conic'?'#7557A8':skill.group==='space'?'#2B6CA3':'#176B5B';
  root.style.setProperty('--skill',color);
  root.innerHTML=`<div class="skill-page"><nav class="skill-nav"><div class="skill-nav-inner"><a class="skill-back" href="index.html" aria-label="기하 목록으로 돌아가기">←</a><button class="skill-tab active" data-skill-tab="concept"><span>01</span> 원리</button><button class="skill-tab" data-skill-tab="drill"><span>02</span> 5문제</button><button class="skill-tab rush-tab" data-skill-tab="rush"><span>03</span> 60초</button><button class="skill-tab boss-tab" data-skill-tab="boss"><span>04</span> 보스</button></div></nav><main class="skill-wrap">
  <section class="skill-panel" data-skill-panel="concept"><header class="skill-hero"><div><p class="skill-kicker">SCHOOL SKILL ${String(skill.index).padStart(2,'0')} · ${groupName}</p><h1>${skill.title}</h1><p>${skill.desc}</p><div class="skill-code-row"><span>${skill.code}</span><span>내신 연산</span><span>60초 배틀</span></div></div><div class="mastery-card"><span>MASTERY</span><strong data-mastery-stars>☆☆☆☆☆</strong><small data-mastery-note>첫 도전을 기다리는 중</small></div></header><div class="rule-strip"><span class="rule-label">핵심 공식</span><strong>${skill.formula}</strong><span>${groupName} 내신에서 반복되는 계산 루틴</span></div><div class="concept-layout"><div class="skill-visual-card"><svg id="ellipseSkillSvg" class="generic-visual" viewBox="0 0 680 430" role="img" aria-label="${skill.title} 개념 그림"></svg><div class="visual-legend"><span><i class="legend-a"></i>조건</span><span><i class="legend-b"></i>계산</span><span><i class="legend-c"></i>결론</span></div></div><aside class="control-card"><div class="control-head"><span>3단계 계산 루틴</span><b>${skill.code}</b></div><div class="routine-list">${skill.steps.map((x,i)=>`<div class="routine-step"><span>${i+1}</span><div><b>${x}</b><small>${i===0?'문제의 핵심 조건을 먼저 표시합니다.':i===1?'공식에 값을 넣고 성분별로 계산합니다.':'부호·축·단위를 마지막으로 검산합니다.'}</small></div></div>`).join('')}</div><div class="example-box"><div class="example-label">RANDOM EXAMPLE</div><div class="example-equation" data-example-equation></div><div class="example-prompt" data-example-prompt></div><div class="example-answer hidden" data-example-answer></div><div class="example-actions"><button data-new-example>새 예시</button><button data-reveal-example>정답 확인</button></div></div></aside></div><div class="mistake-grid">${groupTraps[skill.group].map((x,i)=>`<article><span>실수 0${i+1}</span><b>${x[0]}</b><p>${x[1]}</p></article>`).join('')}</div><div class="launch-row"><button class="launch-card" data-launch="drill"><span>STEP 02</span><b>5문제 정확도 훈련</b><small>시간제한 없이 계산 루틴 만들기</small></button><button class="launch-card hot" data-launch="rush"><span>STEP 03</span><b>60초 러시</b><small>콤보를 쌓고 오답 시 2초 차감</small></button><button class="launch-card boss" data-launch="boss"><span>STEP 04</span><b>3연속 내신 보스</b><small>한 번 틀리면 처음부터 다시</small></button></div><div class="skill-links"><a href="${skill.lesson}">관련 개념 실험실</a><span>·</span><a href="index.html">36개 스킬 지도</a></div></section>
  <section class="skill-panel hidden" data-skill-panel="drill"><header class="mode-header"><div><p class="skill-kicker">ACCURACY DRILL · ${skill.code}</p><h1>${skill.title}</h1><p>시간제한 없이 다섯 문제를 풀며 계산 순서를 고정하세요.</p></div><div class="mode-stat"><span>진행</span><strong data-drill-progress>0 / 5</strong></div></header><div class="question-shell"><div class="question-topline"><span data-drill-type>READY</span><b data-drill-score>정답 0</b></div><div class="question-equation" data-drill-equation>준비되면 시작하세요.</div><h2 class="question-prompt" data-drill-prompt>다섯 문제로 계산 습관을 점검합니다.</h2><div class="answer-grid" data-drill-answers></div><div class="answer-feedback hidden" data-drill-feedback></div><button class="primary-action" data-drill-start>훈련 시작</button></div><div class="result-card hidden" data-drill-result></div></section>
  <section class="skill-panel hidden" data-skill-panel="rush"><header class="mode-header rush-heading"><div><p class="skill-kicker">60 SECOND RUSH · ${skill.code}</p><h1>멈추면 점수를 빼앗긴다</h1><p>정답은 콤보 보너스, 오답은 2초 차감. 가능한 많이 해결하세요.</p></div><div class="best-card"><span>BEST</span><strong data-rush-best>0</strong></div></header><div class="rush-stage"><div class="rush-hud"><div><span>TIME</span><strong data-rush-time>60.0</strong></div><div><span>SCORE</span><strong data-rush-score>0</strong></div><div><span>COMBO</span><strong data-rush-combo>×1</strong></div></div><div class="rush-track"><div data-rush-bar></div></div><div class="rush-question" data-rush-question><span class="rush-ready-icon">⚡</span><h2>60초 동안 몇 문제까지 갈 수 있을까요?</h2><p>틀리면 시간이 줄어듭니다. 정확도와 속도를 함께 잡으세요.</p></div><div class="answer-grid rush-answers" data-rush-answers></div><button class="danger-action" data-rush-start>60초 러시 시작</button><div class="rush-flash" data-rush-flash aria-live="polite"></div></div><div class="result-card hidden" data-rush-result></div></section>
  <section class="skill-panel hidden" data-skill-panel="boss"><header class="mode-header boss-heading"><div><p class="skill-kicker">THREE STREAK BOSS · ${skill.code}</p><h1>세 문제를 연속으로 돌파하라</h1><p>한 문제라도 틀리면 보스의 체력이 회복됩니다.</p></div><div class="boss-clears"><span>CLEAR</span><strong data-boss-clears>0</strong></div></header><div class="boss-stage"><div class="boss-warning"><span>FINAL BOSS</span><b>3연속 정답만 클리어로 인정</b></div><div class="boss-progress"><i class="boss-node"></i><i class="boss-node"></i><i class="boss-node"></i></div><div data-boss-body><div class="boss-start-copy"><strong>${skill.title}</strong><p>계산 루틴을 세 번 연속 유지하면 이 스킬을 정복합니다.</p></div></div><button class="boss-action" data-boss-start>보스전 시작</button><div class="boss-status hidden" data-boss-status></div></div></section>
  </main></div>`;

  const KEY=`jp_geo_skill_${skill.id}_v1`;let saved={bestRush:0,bossClears:0,drillBest:0};try{saved={...saved,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){}const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(e){}};
  let rush={running:false,time:60,score:0,combo:0,correct:0,q:null,last:0,raf:0};
  function updateMastery(){const lv=(saved.drillBest>=3?1:0)+(saved.drillBest===5?1:0)+(saved.bestRush>=600?1:0)+(saved.bestRush>=1200?1:0)+(saved.bossClears>0?1:0);$('[data-mastery-stars]').textContent='★'.repeat(lv)+'☆'.repeat(5-lv);$('[data-mastery-note]').textContent=lv===0?'첫 도전을 기다리는 중':lv===5?'완전 정복! 다음 스킬로 이동하세요.':`5단계 중 ${lv}단계 달성`;$('[data-rush-best]').textContent=saved.bestRush;$('[data-boss-clears]').textContent=saved.bossClears}
  function showPanel(x){if(rush.running&&x!=='rush')finishRush();$$('[data-skill-panel]').forEach(p=>p.classList.toggle('hidden',p.dataset.skillPanel!==x));$$('[data-skill-tab]').forEach(b=>b.classList.toggle('active',b.dataset.skillTab===x));window.scrollTo({top:0,behavior:'smooth'})}
  $$('[data-skill-tab]').forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.skillTab)));$$('[data-launch]').forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.launch)));

  function svgEl(svg,n,attrs,text){const x=document.createElementNS('http://www.w3.org/2000/svg',n);Object.entries(attrs||{}).forEach(([k,v])=>x.setAttribute(k,v));if(text)x.textContent=text;svg.appendChild(x);return x}
  function drawVisual(){const svg=$('#ellipseSkillSvg'),W=680,H=430;svg.innerHTML='';svgEl(svg,'rect',{width:W,height:H,rx:20,fill:'#F8FAF9'});for(let x=50;x<W;x+=45)svgEl(svg,'line',{x1:x,y1:25,x2:x,y2:H-25,stroke:'#E7ECE9'});for(let y=45;y<H;y+=45)svgEl(svg,'line',{x1:25,y1:y,x2:W-25,y2:y,stroke:'#E7ECE9'});const line=(x1,y1,x2,y2,c='#1E2B26',w=3,d='')=>svgEl(svg,'line',{x1,y1,x2,y2,stroke:c,'stroke-width':w,'stroke-linecap':'round',...(d?{'stroke-dasharray':d}:{})});const txt=(x,y,t,c='#1E2B26',a='middle')=>svgEl(svg,'text',{x,y,fill:c,'font-size':15,'font-weight':700,'text-anchor':a},t);const dot=(x,y,c)=>svgEl(svg,'circle',{cx:x,cy:y,r:7,fill:c,stroke:'#fff','stroke-width':3});
    if(skill.visual==='parabola'||skill.visual==='tangent'){line(55,215,625,215,'#8A9892',1);line(250,40,250,390,'#8A9892',1);let d='';for(let i=-150;i<=150;i+=3){const x=250+i*i/110,y=215+i;d+=(i===-150?'M':'L')+x+' '+y}svgEl(svg,'path',{d,fill:'none',stroke:color,'stroke-width':5});dot(310,215,'#C58B25');line(205,55,205,375,'#C1442D',3,'7 6');txt(310,196,'F','#9A6A15');txt(190,70,'준선','#C1442D','end');if(skill.visual==='tangent'){line(300,330,555,75,'#C1442D',4);txt(530,62,'접선','#C1442D')}}
    else if(skill.visual==='ellipse'){line(55,215,625,215,'#8A9892',1);line(340,45,340,385,'#8A9892',1);svgEl(svg,'ellipse',{cx:340,cy:215,rx:245,ry:125,fill:color,'fill-opacity':.08,stroke:color,'stroke-width':5});dot(190,215,'#C58B25');dot(490,215,'#C58B25');line(340,215,585,215,'#C1442D',4);line(340,215,340,90,'#2B6CA3',4);txt(465,201,'a','#C1442D');txt(355,150,'b','#2B6CA3');txt(415,242,'c','#9A6A15')}
    else if(skill.visual==='hyperbola'){line(55,215,625,215,'#8A9892',1);line(340,45,340,385,'#8A9892',1);line(80,360,600,70,'#9AA7A1',2,'7 6');line(80,70,600,360,'#9AA7A1',2,'7 6');['M410 70 C365 120 365 310 410 360','M270 70 C315 120 315 310 270 360'].forEach(d=>svgEl(svg,'path',{d,fill:'none',stroke:color,'stroke-width':5}));dot(200,215,'#C58B25');dot(480,215,'#C58B25');txt(530,90,'점근선','#5E6D66')}
    else if(skill.visual==='projection'){svgEl(svg,'polygon',{points:'90,315 520,315 610,235 180,235',fill:'#2B6CA3','fill-opacity':.1,stroke:'#2B6CA3','stroke-width':2});line(170,260,470,80,'#C1442D',6);line(170,260,470,260,'#2B6CA3',6);line(470,80,470,260,'#8A9892',2,'7 6');txt(315,150,'L','#C1442D');txt(320,285,'L cosθ','#2B6CA3');txt(205,245,'θ','#C58B25')}
    else if(skill.visual==='sphere'){svgEl(svg,'circle',{cx:340,cy:215,r:145,fill:color,'fill-opacity':.07,stroke:color,'stroke-width':4});svgEl(svg,'ellipse',{cx:340,cy:215,rx:145,ry:42,fill:'none',stroke:color,'stroke-width':2,'stroke-opacity':.65});svgEl(svg,'ellipse',{cx:340,cy:215,rx:48,ry:145,fill:'none',stroke:color,'stroke-width':2,'stroke-opacity':.5});dot(340,215,'#C1442D');line(340,215,458,132,'#C58B25',4);txt(405,160,'r','#9A6A15');txt(325,240,'C','#C1442D')}
    else if(skill.visual==='space'){svgEl(svg,'polygon',{points:'95,310 465,310 585,225 215,225',fill:'#2B6CA3','fill-opacity':.1,stroke:'#2B6CA3','stroke-width':2});line(245,90,245,255,'#C1442D',5);line(245,255,455,255,'#2B6CA3',5);line(245,90,455,255,'#176B5B',5);line(150,255,545,255,'#C58B25',3);txt(232,80,'P','#C1442D');txt(235,280,'O');txt(465,280,'Q','#2B6CA3')}
    else if(skill.visual==='coordinate'){const o=[300,250];line(o[0],o[1],590,250,'#C1442D',3);line(o[0],o[1],115,340,'#176B5B',3);line(o[0],o[1],300,55,'#2B6CA3',3);txt(603,255,'x','#C1442D');txt(100,350,'y','#176B5B');txt(300,45,'z','#2B6CA3');dot(430,135,'#7557A8');line(430,135,430,250,'#8A9892',2,'6 5');txt(447,125,'P(x,y,z)','#7557A8','start')}
    else if(skill.visual==='dot'){const o=[240,290];line(o[0],o[1],520,290,'#C1442D',6);line(o[0],o[1],430,105,'#2B6CA3',6);svgEl(svg,'path',{d:'M320 290 A80 80 0 0 0 297 234',fill:'none',stroke:'#C58B25','stroke-width':4});txt(400,315,'a','#C1442D');txt(355,175,'b','#2B6CA3');txt(315,250,'θ','#9A6A15')}
    else if(skill.visual==='line'){line(75,340,610,75,'#2B6CA3',5);dot(270,245,'#C1442D');line(270,245,390,185,'#176B5B',6);txt(255,275,'p','#C1442D');txt(355,198,'v','#176B5B')}
    else if(skill.visual==='plane'){svgEl(svg,'polygon',{points:'105,305 410,350 585,170 280,125',fill:'#2B6CA3','fill-opacity':.13,stroke:'#2B6CA3','stroke-width':3});line(340,240,340,65,'#C1442D',6);txt(360,85,'n=(a,b,c)','#C1442D','start');txt(475,300,'ax+by+cz=d','#2B6CA3')}
    else{const o=[250,280];line(o[0],o[1],500,160,'#C1442D',6);line(o[0],o[1],420,315,'#2B6CA3',6);line(420,315,580,195,'#176B5B',5);txt(380,205,'a','#C1442D');txt(335,315,'b','#2B6CA3');txt(520,245,'a+b','#176B5B')}
  }
  drawVisual();

  let example;
  function newExample(){example=makeQuestion(skill.id);$('[data-example-equation]').textContent=example.equation;$('[data-example-prompt]').textContent=example.prompt;$('[data-example-answer]').textContent=`정답: ${example.correct} · ${example.explanation}`;$('[data-example-answer]').classList.add('hidden')}
  $('[data-new-example]').addEventListener('click',newExample);$('[data-reveal-example]').addEventListener('click',()=>$('[data-example-answer]').classList.remove('hidden'));newExample();
  const setMath=(el,value)=>{el.textContent=String(value);if(window.JPMath)window.JPMath.render(el)};
  function fillAnswers(box,q,handler){box.innerHTML='';q.choices.forEach(v=>{const b=document.createElement('button');b.className='answer-btn';b.dataset.value=String(v);setMath(b,v);b.addEventListener('click',()=>handler(v,b));box.appendChild(b)})}
  function markAnswers(box,q,selected,btn){$$('.answer-btn',box).forEach(x=>{x.disabled=true;if(x.dataset.value===q.correct)x.classList.add('correct')});if(String(selected)!==q.correct&&btn)btn.classList.add('wrong')}

  let drill={index:0,correct:0,q:null};
  function startDrill(){drill={index:0,correct:0,q:null};$('[data-drill-start]').classList.add('hidden');$('[data-drill-result]').classList.add('hidden');nextDrill()}
  function nextDrill(){if(drill.index>=5){finishDrill();return}drill.q=makeQuestion(skill.id);$('[data-drill-progress]').textContent=`${drill.index+1} / 5`;$('[data-drill-score]').textContent=`정답 ${drill.correct}`;$('[data-drill-type]').textContent=drill.q.type;$('[data-drill-equation]').textContent=drill.q.equation;$('[data-drill-prompt]').textContent=drill.q.prompt;$('[data-drill-feedback]').className='answer-feedback hidden';const box=$('[data-drill-answers]');fillAnswers(box,drill.q,(v,b)=>{const ok=String(v)===drill.q.correct;markAnswers(box,drill.q,v,b);if(ok)drill.correct++;const f=$('[data-drill-feedback]');f.textContent=(ok?'정답! ':'다시 기억하기: ')+drill.q.explanation;f.className=`answer-feedback ${ok?'good':'bad'}`;drill.index++;setTimeout(nextDrill,700)})}
  function finishDrill(){saved.drillBest=Math.max(saved.drillBest,drill.correct);save();updateMastery();$('[data-drill-answers]').innerHTML='';const b=$('[data-drill-result]');b.innerHTML=`<strong>${drill.correct} / 5</strong><p>${drill.correct===5?'계산 루틴 완성! 이제 60초 압박에 도전하세요.':drill.correct>=3?'좋습니다. 한 번 더 풀어 완벽하게 고정해보세요.':'원리 탭에서 계산 순서를 다시 확인하세요.'}</p><button data-retry>다시 훈련</button>`;b.classList.remove('hidden');if(window.jpMotionFeedback)window.jpMotionFeedback('success',`5문제 훈련 완료 · ${drill.correct}문제 정답`);$('[data-retry]',b).addEventListener('click',startDrill)}
  $('[data-drill-start]').addEventListener('click',startDrill);

  function startRush(){rush={running:true,time:60,score:0,combo:0,correct:0,q:null,last:performance.now(),raf:0};$('[data-rush-start]').classList.add('hidden');$('[data-rush-result]').classList.add('hidden');nextRush();rush.raf=requestAnimationFrame(tickRush)}
  function tickRush(now){if(!rush.running)return;rush.time=Math.max(0,rush.time-(now-rush.last)/1000);rush.last=now;renderRush();if(rush.time<=0){finishRush();return}rush.raf=requestAnimationFrame(tickRush)}
  function renderRush(){$('[data-rush-time]').textContent=rush.time.toFixed(1);$('[data-rush-score]').textContent=rush.score;$('[data-rush-combo]').textContent=`×${1+Math.floor(rush.combo/3)*.5}`;$('[data-rush-bar]').style.width=`${rush.time/60*100}%`}
  function nextRush(){if(!rush.running)return;rush.q=makeQuestion(skill.id);$('[data-rush-question]').innerHTML=`<div class="rush-eq">${rush.q.equation}</div><div class="rush-prompt">${rush.q.prompt}</div>`;fillAnswers($('[data-rush-answers]'),rush.q,v=>{if(!rush.running)return;const ok=String(v)===rush.q.correct;if(ok){rush.combo++;rush.correct++;rush.score+=100+Math.min(300,rush.combo*20)}else{rush.combo=0;rush.time=Math.max(0,rush.time-2)}flashRush(ok);renderRush();nextRush()})}
  function flashRush(ok){const f=$('[data-rush-flash]');f.textContent=ok?'+ SCORE':'− 2 SEC';f.className=`rush-flash show ${ok?'good':'bad'}`;setTimeout(()=>f.className='rush-flash',330)}
  function finishRush(){if(!rush.running)return;rush.running=false;cancelAnimationFrame(rush.raf);saved.bestRush=Math.max(saved.bestRush,rush.score);save();updateMastery();$('[data-rush-answers]').innerHTML='';$('[data-rush-question]').innerHTML='<span class="rush-ready-icon">🏁</span><h2>러시 종료!</h2>';const b=$('[data-rush-result]');b.innerHTML=`<strong>${rush.score}점</strong><p>${rush.correct}문제 성공 · 최고 기록 ${saved.bestRush}점</p><button data-retry>다시 도전</button>`;b.classList.remove('hidden');if(window.jpMotionFeedback)window.jpMotionFeedback('success',`60초 러시 종료 · ${rush.score}점`);$('[data-retry]',b).addEventListener('click',startRush)}
  $('[data-rush-start]').addEventListener('click',startRush);

  let boss={index:0,questions:[],active:false};
  function startBoss(){boss={index:0,questions:Array.from({length:3},()=>makeQuestion(skill.id)),active:true};$('[data-boss-start]').classList.add('hidden');$('[data-boss-status]').className='boss-status hidden';renderBoss()}
  function renderBoss(){const q=boss.questions[boss.index];$$('.boss-node').forEach((x,i)=>x.className='boss-node '+(i<boss.index?'done':i===boss.index?'active':''));const body=$('[data-boss-body]');body.innerHTML=`<div class="boss-question-card"><div class="boss-eq"></div><h2></h2></div><div class="boss-answer-grid"></div>`;setMath($('.boss-eq',body),q.equation);$('h2',body).textContent=q.prompt;const box=$('.boss-answer-grid',body);fillAnswers(box,q,(v,b)=>{const ok=String(v)===q.correct;markAnswers(box,q,v,b);const st=$('[data-boss-status]');if(ok){st.textContent=`${boss.index+1}단계 통과! ${q.explanation}`;st.className='boss-status good';boss.index++;if(boss.index>=3){setTimeout(clearBoss,650)}else setTimeout(()=>{st.className='boss-status hidden';renderBoss()},650)}else{boss.active=false;st.textContent=`보스가 회복했습니다. ${q.explanation}`;st.className='boss-status bad';$('[data-boss-start]').textContent='처음부터 다시 도전';$('[data-boss-start]').classList.remove('hidden')}})}
  function clearBoss(){saved.bossClears++;save();updateMastery();$$('.boss-node').forEach(x=>x.className='boss-node done');$('[data-boss-body]').innerHTML='<div class="boss-start-copy"><strong>보스 클리어!</strong><p>세 문제를 연속으로 해결했습니다. 이 계산 루틴은 실전에서 사용할 준비가 됐습니다.</p></div>';$('[data-boss-status]').className='boss-status hidden';$('[data-boss-start]').textContent='새 보스 소환';$('[data-boss-start]').classList.remove('hidden');if(window.jpMotionFeedback)window.jpMotionFeedback('success','보스 클리어 · 계산 루틴을 저장했습니다.')}
  $('[data-boss-start]').addEventListener('click',startBoss);
  updateMastery();
})();
