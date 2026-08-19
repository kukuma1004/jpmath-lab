(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
  const pick=a=>a[ri(0,a.length-1)];
  const nonzero=(a,b)=>{let n=0;while(n===0)n=ri(a,b);return n};
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=ri(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
  const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){const t=a%b;a=b;b=t}return a||1};
  const frac=(n,d=1)=>{if(d<0){n=-n;d=-d}const g=gcd(n,d);n/=g;d/=g;return d===1?String(n):`${n}/${d}`};
  const sign=n=>n<0?`−${Math.abs(n)}`:`+${n}`;
  const factor=a=>a===0?'x':a>0?`(x−${a})`:`(x+${Math.abs(a)})`;
  const pow=(x,n)=>n===0?'1':n===1?x:`${x}${['','¹','²','³','⁴','⁵','⁶'][n]||`^${n}`}`;
  const poly2=(A,B,C)=>{let out=A===1?'x²':A===-1?'−x²':`${A}x²`;if(B)out+=B>0?`+${B===1?'':B}x`:`−${Math.abs(B)===1?'':Math.abs(B)}x`;if(C)out+=sign(C);return out};
  const lineEq=(m,c)=>`y=${m===1?'':m===-1?'−':m}x${c?sign(c):''}`;
  const choices=(correct,wrong)=>{const out=[];[correct,...wrong].forEach(v=>{v=String(v);if(!out.includes(v))out.push(v)});let n=1;while(out.length<4){const raw=Number(correct);const v=Number.isFinite(raw)?String(raw+n):`다른 값 ${n}`;if(!out.includes(v))out.push(v);n++}return shuffle(out.slice(0,4))};
  const Q=(type,equation,prompt,correct,wrong,explanation)=>({type,equation,prompt,correct:String(correct),choices:choices(correct,wrong),explanation});

  const groups={
    limit:{name:'극한·연속 계산',color:'#C1442D',dark:'#71301F'},
    differentiate:{name:'미분 계산',color:'#2B6CA3',dark:'#173E5E'},
    graph:{name:'도함수·그래프 실전',color:'#176B5B',dark:'#123F34'},
    integral:{name:'적분·변화량 계산',color:'#7A4E8C',dark:'#493055'}
  };
  const S=(id,code,title,desc,group,tag,formula,routine,trap)=>({id,code,title,desc,group,tag,formula,routine,trap});
  const skillList=[
    S('limit_factor','L01','0/0꼴 인수분해','공통인수 (x−a)를 찾아 약분하는 루틴','limit','교과 핵심','0/0 → 인수분해 → 약분 → 대입',['먼저 그대로 대입해 0/0인지 확인','분자와 분모에서 (x−a)를 찾기','약분한 뒤 x=a를 대입'],'0/0을 곧바로 0으로 판단하지 마세요.'),
    S('limit_rationalize','L02','0/0꼴 유리화','근호식에 켤레식을 곱하는 루틴','limit','교과 핵심','(√A−√B)(√A+√B)=A−B',['근호 차의 켤레식을 확인','분자·분모에 같은 켤레식 곱하기','인수를 약분한 뒤 대입'],'켤레식은 부호만 반대로 바꿉니다.'),
    S('limit_infinity_ratio','L03','∞/∞꼴 최고차항 비교','분자·분모의 최고차항만 남기는 루틴','limit','교과 핵심','같은 차수 → 최고차항 계수의 비',['분자와 분모의 최고차수 확인','가장 높은 차수로 나누기','낮은 차수 항은 0으로 보내기'],'차수가 다르면 계수의 비만 볼 수 없습니다.'),
    S('limit_infinity_diff','L04','∞−∞꼴 정리','통분 또는 유리화로 한 덩어리 만들기','limit','수능 실전','∞−∞ → 통분/유리화 → 0/0 또는 상수',['두 항을 바로 따로 계산하지 않기','근호면 유리화, 분수면 통분','정리된 식에서 최고차항 비교'],'∞−∞는 0이 아니라 미정형입니다.'),
    S('limit_one_sided','L05','좌극한·우극한과 절댓값','다가가는 방향에 따른 부호 판정','limit','교과 핵심','|x|/x = −1 (x<0), 1 (x>0)',['기준점의 왼쪽과 오른쪽을 분리','절댓값 안의 부호를 먼저 결정','두 극한이 같을 때만 양쪽 극한 존재'],'좌극한과 우극한 중 하나만 구하고 끝내지 마세요.'),
    S('continuity_parameter','L06','연속 조건과 미정계수','극한값과 함숫값을 일치시키기','limit','교과 핵심','lim f(x) = f(a)',['좌우극한이 존재하는지 확인','극한값을 간단히 계산','그 값을 f(a)와 같게 놓기'],'함숫값만 정해져 있어도 극한이 다르면 불연속입니다.'),
    S('squeeze_limit','L07','샌드위치 정리 계산','양쪽에서 끼워 극한을 결정','limit','교과 심화','|g(x)|≤M, h(x)→0 ⇒ h(x)g(x)→0',['곱해진 함수 g(x)의 절댓값 범위 확인','전체 식을 쉬운 두 식 사이에 끼우기','양쪽 극한이 같음을 확인'],'미적분Ⅱ의 삼각함수를 사용하지 않고 유계 조건만으로 판단합니다.'),
    S('lhopital','L08','로피탈 정리','다항함수의 0/0꼴 극한을 빠르게 검산하는 보조 도구','limit','교육과정 밖 검산','0/0 또는 ∞/∞에서 lim f/g = lim f′/g′',['먼저 대입해 0/0 또는 ∞/∞인지 확인','분자와 분모를 각각 한 번 미분','검산값을 인수분해·유리화 풀이와 비교'],'학교 시험과 수능의 풀이에는 인수분해·유리화 등 교육과정 안의 방법을 먼저 사용하세요.'),
    S('derivative_definition','D08','미분계수의 정의','차분몫의 극한을 도함수 값으로 연결','differentiate','교과 핵심',"f′(a)=lim[h→0]{f(a+h)−f(a)}/h",['분자에 f(a+h)와 f(a)를 정확히 대입','전개 후 h를 공통인수로 묶기','h를 약분한 뒤 h→0'],'분모 h를 약분하기 전에 h=0을 대입하지 마세요.'),
    S('differentiate_polynomial','D09','다항함수 빠른 미분','계수×지수, 지수는 하나 내리기','differentiate','교과 핵심',"(axⁿ)′=anxⁿ⁻¹",['각 항을 따로 미분','계수에 기존 지수를 곱하기','상수항은 0으로 처리'],'지수만 내리고 계수에 곱하지 않는 실수를 조심하세요.'),
    S('product_rule','D10','곱의 미분법','앞미분×뒤 + 앞×뒤미분','differentiate','교과 핵심',"(fg)′=f′g+fg′",['두 함수를 앞과 뒤로 구분','앞만 미분한 항 작성','뒤만 미분한 항을 더하기'],'두 함수를 동시에 미분한 f′g′가 아닙니다.'),
    S('tangent_equation','D11','접선의 방정식','기울기와 접점을 한 번에 대입','differentiate','교과 핵심',"y−f(a)=f′(a)(x−a)",['접점의 y좌표 f(a) 계산','접선 기울기 f′(a) 계산','점-기울기 공식에 대입'],'접점의 x좌표 a를 기울기로 착각하지 마세요.'),
    S('monotonic_interval','G12','증가·감소 구간','도함수의 부호표를 구간으로 읽기','graph','교과 핵심',"f′>0 증가, f′<0 감소",['도함수의 근으로 수직선을 분할','각 구간에서 도함수 부호 판정','양수 구간과 음수 구간을 기록'],'f의 부호가 아니라 f′의 부호를 봅니다.'),
    S('extrema_sign','G13','극대·극소 부호 변화','+→−와 −→+를 즉시 판정','graph','교과 핵심',"+→− 극대, −→+ 극소",['임계점 왼쪽 부호 확인','오른쪽 부호 확인','증가·감소의 전환으로 이름 결정'],'f′(a)=0만으로 극값이라고 단정할 수 없습니다.'),
    S('cubic_extrema','G14','삼차함수의 극값 조건',"f′의 판별식으로 개형 결정",'graph','수능 실전','ax³+bx²+cx+d: b²−3ac>0',['삼차함수를 한 번 미분','이차 도함수의 판별식 계산','서로 다른 두 실근 조건 D>0 적용'],'D=0이면 수평접선은 있지만 극값은 없습니다.'),
    S('quartic_shape','G15','사차함수와 도함수','세 임계점의 극대·극소 배열','graph','수능 실전',"f′의 부호: − + − + ⇒ 극소·극대·극소",['삼차 도함수의 실근을 순서대로 표시','각 구간의 부호를 번갈아 기록','원함수의 오르내림으로 개형 결정'],'도함수의 그래프와 원함수의 그래프를 혼동하지 마세요.'),
    S('real_roots','G16','방정식의 실근 개수','그래프와 수평선의 교점 세기','graph','수능 실전','f(x)=k의 실근 수 = y=f(x)와 y=k의 교점 수',['함수의 극댓값과 극솟값 확인','수평선 y=k의 높이 비교','접하는 경우 중근까지 포함해 서로 다른 근 세기'],'중근은 교점 하나이므로 서로 다른 실근은 한 개로 셉니다.'),
    S('mean_value','G17','평균값 정리·롤의 정리','평균변화율과 같은 순간기울기','graph','교과 핵심',"f′(c)={f(b)−f(a)}/{b−a}",['구간에서 연속·내부에서 미분가능 확인','양 끝점으로 평균변화율 계산','f′(c)와 같게 놓아 c 찾기'],'c는 반드시 열린구간 (a,b) 안에 있어야 합니다.'),
    S('motion_rate','G18','속도와 가속도','위치→속도→가속도 순서','graph','교과 핵심',"v(t)=s′(t), a(t)=v′(t)",['다항식 위치함수를 한 번 미분해 속도','속도를 한 번 더 미분해 가속도','묻는 시각을 마지막에 대입'],'속력은 |v|이고 속도 v와 구분해야 합니다.'),
    S('horizontal_tangent','G19','수평접선과 접선 개수','도함수의 근을 그래프 조건으로 변환','graph','수능 실전',"수평접선 ⇔ f′(x)=0",['접선의 기울기 조건을 도함수 식으로 변환','도함수 방정식의 서로 다른 실근 계산','각 근이 실제 접점이 되는지 확인'],'중근에서는 수평접선이 하나만 생깁니다.'),
    S('antiderivative','I20','부정적분 기본','지수를 하나 올리고 새 지수로 나누기','integral','교과 핵심','∫xⁿdx=xⁿ⁺¹/(n+1)+C',['각 항의 지수를 하나 올리기','올라간 새 지수로 계수 나누기','마지막에 적분상수 C 붙이기'],'부정적분에서 +C를 빠뜨리지 마세요.'),
    S('initial_antiderivative','I21','조건으로 원함수 결정','적분상수 C를 주어진 값으로 결정','integral','교과 핵심',"F′=f, F(a)=b로 C 결정",['도함수를 부정적분','원함수에 조건의 x값 대입','등식으로 적분상수 C 계산'],'조건을 적용하기 전에 C를 임의로 0으로 두지 마세요.'),
    S('definite_integral','I22','정적분 계산','원시함수에 위끝−아래끝 대입','integral','교과 핵심','∫[a→b]f(x)dx=F(b)−F(a)',['먼저 원시함수 F 찾기','위끝값 F(b) 계산','아래끝값 F(a)를 빼기'],'아래끝값 앞의 마이너스를 분배하세요.'),
    S('integral_symmetry','I23','정적분의 대칭성','홀함수·짝함수를 구간과 함께 판정','integral','수능 실전','홀함수: ∫[−a→a]f=0',['적분구간이 원점 대칭인지 확인','함수가 홀함수인지 짝함수인지 판정','홀함수면 0, 짝함수면 두 배'],'함수의 대칭성과 구간의 대칭이 모두 필요합니다.'),
    S('area_axis','I24','곡선과 x축 사이 넓이','부호가 바뀌는 지점에서 구간 분할','integral','교과 핵심','넓이=∫|f(x)|dx',['x축과 만나는 점을 먼저 찾기','부호가 바뀌는 곳에서 구간 나누기','음수 구간 적분값은 부호를 바꾸어 더하기'],'정적분값과 넓이는 음수 구간에서 다릅니다.'),
    S('area_between','I25','두 곡선 사이 넓이','위 함수−아래 함수의 정적분','integral','수능 실전','넓이=∫|f(x)−g(x)|dx',['두 곡선의 교점으로 구간 확인','각 구간에서 위아래 함수 판정','위−아래를 적분해 양수 넓이로 합하기'],'그래프의 위아래가 바뀌면 식의 순서도 바뀝니다.'),
    S('distance_velocity','I26','속도에서 이동거리','속도의 부호가 바뀌면 절댓값 적분','integral','수능 실전','이동거리=∫|v(t)|dt',['v(t)=0인 시각 찾기','속도의 부호가 바뀌는 구간 분할','각 구간의 변위를 절댓값으로 더하기'],'이동거리는 전체 변위의 절댓값과 다를 수 있습니다.'),
    S('fundamental_theorem','I27','정적분으로 정의된 함수','적분으로 정의된 함수의 미분','integral','수능 실전',"F(x)=∫[a→x]f(t)dt ⇒ F′(x)=f(x)",['적분의 위끝이 x인지 확인','적분 안의 변수 t를 임시 변수로 읽기','F′(x)에 위끝 x를 대입해 마무리'],'미적분Ⅱ의 합성함수 미분을 섞지 않고 위끝이 x인 경우만 다룹니다.')
  ];
  const skills=Object.fromEntries(skillList.map(s=>[s.id,s]));

  function makeQuestion(id){
    let a,b,c,n,k,q,t,A,B,roots,mode,correct,m,p;
    switch(id){
      case'limit_factor':
        a=nonzero(-4,4);do{b=nonzero(-4,4)}while(b===a);correct=a-b;
        return Q('FACTOR 0/0',`lim x→${a}  (${poly2(1,-(a+b),a*b)})/${factor(a)}`,'극한값은?',correct,[a+b,b-a,a*b],`분자는 ${factor(a)}${factor(b)}이므로 약분 후 x−${b}에 x=${a}를 대입합니다.`);
      case'limit_rationalize':
        q=ri(2,5);a=ri(1,5);c=q*q-a;correct=frac(1,2*q);
        return Q('RATIONALIZE',`lim x→${a}  (√(x${sign(c)})−${q})/(x−${a})`,'극한값은?',correct,[frac(1,q),String(2*q),frac(-1,2*q)],`켤레식을 곱하면 1/(√(x${sign(c)})+${q})가 되어 ${correct}입니다.`);
      case'limit_infinity_ratio':
        A=ri(1,7);B=ri(1,6);correct=frac(A,B);
        return Q('∞/∞',`lim x→∞  (${A}x²${sign(ri(-5,5))})/(${B}x²${sign(ri(-5,5))}x+1)`,'극한값은?',correct,[frac(B,A),String(A),String(B)],`분자와 분모를 x²으로 나누면 최고차항 계수의 비 ${correct}만 남습니다.`);
      case'limit_infinity_diff':
        k=2*ri(1,5);correct=k/2;
        return Q('∞−∞',`lim x→∞  {√(x²+${k}x)−x}`,'극한값은?',correct,[k,0,-correct],`켤레식으로 유리화하면 ${k}x/(√(x²+${k}x)+x)이므로 ${correct}입니다.`);
      case'limit_one_sided':
        mode=pick(['0−','0+']);correct=mode==='0−'?-1:1;
        return Q('ONE-SIDED',`lim x→${mode}  |x|/x`,'극한값은?',correct,[-correct,0,'존재하지 않음'],`${mode==='0−'?'x<0에서 |x|=−x':'x>0에서 |x|=x'}이므로 ${correct}입니다.`);
      case'continuity_parameter':
        a=ri(1,6);correct=2*a;
        return Q('CONTINUITY',`f(x)=(x²−${a*a})/${factor(a)} (x≠${a}),  f(${a})=k`,'x='+a+'에서 연속이 되게 하는 k는?',correct,[a,a*a,-correct],`x≠${a}에서 f(x)=x+${a}이므로 극한값은 ${correct}입니다.`);
      case'squeeze_limit':
        n=pick([2,4,6]);A=ri(2,5);
        return Q('SQUEEZE',`|g(x)|≤${A}일 때  lim x→0  x${['','','²','³','⁴','⁵','⁶'][n]}g(x)`,'극한값은?',0,[1,-1,'판정 불가'],`|x${['','','²','³','⁴','⁵','⁶'][n]}g(x)|≤${A}|x|${['','','²','³','⁴','⁵','⁶'][n]}이고 오른쪽이 0으로 갑니다.`);
      case'lhopital':
        a=nonzero(-4,4);n=pick([2,3,4]);A=Math.pow(a,n);correct=n*Math.pow(a,n-1);
        return Q('L’HÔPITAL CHECK',`lim x→${a}  (${pow('x',n)}${A>=0?`−${A}`:`+${Math.abs(A)}`})/${factor(a)}`,'로피탈 정리로 검산한 극한값은?',correct,[Math.pow(a,n-1),n*a,A],`0/0꼴이므로 분자와 분모를 각각 미분하면 ${n}${pow('x',n-1)}/1입니다. x=${a}를 대입하면 ${correct}입니다.`);
      case'derivative_definition':
        a=ri(-3,3);b=ri(-4,4);correct=2*a+b;
        return Q('DEFINITION',`f(x)=x²${b?sign(b)+'x':''},  f′(${a})=?`,'미분계수는?',correct,[a+b,2*a-b,a*a+b],`f′(x)=2x${b?sign(b):''}이므로 f′(${a})=${correct}입니다.`);
      case'differentiate_polynomial':
        A=ri(1,6);n=ri(2,5);correct=A*n;
        return Q('POWER RULE',`f(x)=${A}${pow('x',n)}`,'f′(1)의 값은?',correct,[A+n,A*(n-1),n],`f′(x)=${A*n}${pow('x',n-1)}이므로 x=1에서 ${correct}입니다.`);
      case'product_rule':
        a=nonzero(-4,4);b=nonzero(-4,4);t=ri(-2,2);correct=2*t+a+b;
        return Q('PRODUCT RULE',`f(x)=${factor(-a)}${factor(-b)}`,'f′('+t+')의 값은?',correct,[t+a+b,2*t-a-b,a*b],`전개하거나 곱의 미분법을 쓰면 f′(x)=2x${sign(a+b)}입니다.`);
      case'tangent_equation':
        a=nonzero(-3,3);b=ri(-4,4);m=2*a;c=b-a*a;correct=lineEq(m,c);
        return Q('TANGENT',`f(x)=x²${b?sign(b):''},  x=${a}`,'접선의 방정식은?',correct,[lineEq(a,c),lineEq(m,b+a*a),lineEq(-m,c)],`접점은 (${a},${a*a+b}), 기울기는 ${m}이므로 ${correct}입니다.`);
      case'monotonic_interval':
        a=ri(-4,-1);b=ri(1,4);correct=`(−∞,${a}) ∪ (${b},∞)`;
        return Q('SIGN CHART',`f′(x)=${factor(a)}${factor(b)}`,'f가 증가하는 구간은?',correct,[`(${a},${b})`,`(−∞,${b})`,`(${a},∞)`],`위로 열린 이차식은 두 근의 바깥에서 양수이므로 ${correct}입니다.`);
      case'extrema_sign':
        a=ri(-3,3);mode=pick(['max','min']);correct=mode==='max'?'극대':'극소';
        return Q('SIGN CHANGE',`x=${a}에서 f′의 부호: ${mode==='max'?'+ → −':'− → +'}`,'x='+a+'에서 f의 상태는?',correct,[mode==='max'?'극소':'극대','변곡점','판정 불가'],`${mode==='max'?'증가에서 감소로':'감소에서 증가로'} 바뀌므로 ${correct}입니다.`);
      case'cubic_extrema':
        return Q('CUBIC EXTREMA',`f(x)=x³−3mx+1`,'f가 극대와 극소를 모두 갖기 위한 m의 조건은?','m>0',['m≥0','m<0','m≤0'],`f′(x)=3(x²−m)이 서로 다른 두 실근을 가져야 하므로 m>0입니다.`);
      case'quartic_shape':
        roots=pick([[-2,0,2],[-3,-1,2],[-1,1,3]]);correct='극대';
        return Q('QUARTIC SHAPE',`f′(x)=4${factor(roots[0])}${factor(roots[1])}${factor(roots[2])}`,'가운데 임계점 x='+roots[1]+'에서 f는? ',correct,['극소','변곡점','판정 불가'],`도함수 부호가 +에서 −로 바뀌므로 가운데 임계점은 극대입니다.`);
      case'real_roots':
        k=pick([-3,-2,-1,0,1,2,3]);correct=Math.abs(k)<2?'3개':Math.abs(k)===2?'2개':'1개';
        return Q('REAL ROOTS',`x³−3x=${k}`,'서로 다른 실근의 개수는?',correct,['1개','2개','3개'].filter(x=>x!==correct).concat(['0개']),`y=x³−3x의 극댓값은 2, 극솟값은 −2이므로 수평선 y=${k}와의 교점을 셉니다.`);
      case'mean_value':
        a=ri(0,3);b=a+2*ri(1,3);correct=(a+b)/2;
        return Q('MEAN VALUE',`f(x)=x²,  [${a},${b}]`,'평균값 정리의 조건을 만족하는 c는?',correct,[a+b,b-a,2*correct],`평균변화율은 ${a+b}이고 f′(c)=2c이므로 c=${correct}입니다.`);
      case'motion_rate':
        A=ri(1,3);B=ri(1,4);t=ri(1,3);correct=3*A*t*t+2*B*t;
        return Q('VELOCITY',`s(t)=${A}t³+${B}t²`,'t='+t+'에서 속도는?',correct,[A*t*t+B*t,6*A*t+2*B,3*A*t+2*B],`v(t)=3·${A}t²+2·${B}t이므로 ${correct}입니다.`);
      case'horizontal_tangent':
        k=ri(-2,2);correct=k>0?'2개':k===0?'1개':'0개';
        return Q('HORIZONTAL TANGENT',`f(x)=x³−3(${k})x`,'수평접선의 개수는?',correct,['0개','1개','2개'].filter(x=>x!==correct).concat(['3개']),`f′(x)=3(x²−${k})의 서로 다른 실근 수가 수평접선의 개수입니다.`);
      case'antiderivative':
        n=ri(1,4);m=ri(1,4);A=m*(n+1);correct=`${m===1?'':m}${pow('x',n+1)}+C`;
        return Q('ANTIDERIVATIVE',`∫ ${A}${pow('x',n)} dx`,'부정적분은?',correct,[`${A}${pow('x',n+1)}+C`,`${m}${pow('x',n)}+C`,`${A*n}${pow('x',Math.max(1,n-1))}+C`],`지수를 ${n+1}로 올리고 ${n+1}로 나누면 ${correct}입니다.`);
      case'initial_antiderivative':
        A=2*ri(1,5);c=ri(-4,4);correct=A/2+c;
        return Q('INITIAL VALUE',`F′(x)=${A}x,  F(0)=${c}`,'F(1)의 값은?',correct,[A+c,A/2,c],`F(x)=${A/2}x²+C이고 F(0)=${c}이므로 C=${c}, F(1)=${correct}입니다.`);
      case'definite_integral':
        A=2*ri(1,4);b=ri(1,5);correct=A*b*b/2;
        return Q('DEFINITE INTEGRAL',`∫[0→${b}] ${A}x dx`,'정적분의 값은?',correct,[A*b,A*b*b,correct-b],`원시함수 ${A/2}x²에 ${b}와 0을 대입하면 ${correct}입니다.`);
      case'integral_symmetry':
        n=pick([1,3,5]);a=ri(1,5);
        return Q('SYMMETRY',`∫[−${a}→${a}] ${pow('x',n)} dx`,'정적분의 값은?',0,[a,2*a,frac(2*Math.pow(a,n+1),n+1)],`${pow('x',n)}은 홀함수이고 구간이 원점 대칭이므로 0입니다.`);
      case'area_axis':
        k=ri(1,4);a=ri(1,4);correct=k*a*a;
        return Q('AREA & SIGN',`y=${k}(x−${a}),  0≤x≤${2*a}`,'그래프와 x축 사이 넓이는?',correct,[2*correct,frac(correct,2),0],`x=${a}에서 나누면 합동인 두 삼각형의 넓이 합은 ${correct}입니다.`);
      case'area_between':
        A=ri(2,6);B=ri(1,A-1);c=ri(1,4);correct=frac((A-B)*c*c,2);
        return Q('BETWEEN CURVES',`y=${A}x, y=${B}x,  0≤x≤${c}`,'두 직선 사이 넓이는?',correct,[frac((A+B)*c*c,2),(A-B)*c,frac((A-B)*c,2)],`차이는 ${(A-B)}x이므로 0부터 ${c}까지 적분하면 ${correct}입니다.`);
      case'distance_velocity':
        k=ri(1,4);correct=2*k*k;
        return Q('TOTAL DISTANCE',`v(t)=2t−${2*k},  0≤t≤${2*k}`,'이동거리는?',correct,[0,4*k*k,k*k],`t=${k}에서 속도 부호가 바뀝니다. 두 삼각형 넓이의 합은 ${correct}입니다.`);
      case'fundamental_theorem':
        A=ri(1,4);B=ri(-3,3);c=ri(1,4);correct=A*c*c+B;
        return Q('FTC',`F(x)=∫[0→x] (${A}t²${B?sign(B):''}) dt`,'F′('+c+')의 값은?',correct,[frac(A*c*c*c,3)+B*c,A*c+B,2*A*c+B],`미적분의 기본정리에 따라 F′(x)=${A}x²${B?sign(B):''}이므로 ${correct}입니다.`);
      default:return Q('BASIC','1+1','값은?',2,[0,1,3],'기본 계산입니다.');
    }
  }

  const excluded={
    quotient_rule:'몫의 미분법 · 미적분Ⅱ',
    chain_rule:'합성함수의 미분법 · 미적분Ⅱ',
    higher_derivative:'고계도함수 · 미적분Ⅰ 범위 밖',
    implicit_derivative:'음함수 미분 · 미적분Ⅱ'
  };
  const params=new URLSearchParams(location.search),requestedId=params.get('id'),skill=skills[requestedId];
  const app=$('#calcSkillApp');
  if(!skill){const moved=excluded[requestedId];app.innerHTML=`<div class="not-found"><h1>${moved?'미적분Ⅰ에서 분리했어요.':'계산 스킬을 찾을 수 없어요.'}</h1><p>${moved?`${moved} 내용이어서 2022 개정 미적분Ⅰ 계산 지도에서는 제외했습니다.`:'미적분 스킬 지도에서 다시 선택해 주세요.'}</p><a href="미적분1.html#skills">미적분Ⅰ 스킬 지도로 돌아가기</a></div>`;return}
  const group=groups[skill.group];
  document.documentElement.style.setProperty('--skill',group.color);
  document.documentElement.style.setProperty('--skill-dark',group.dark);
  document.title=`${skill.title} · 미적분 계산 스킬`;
  app.innerHTML=`<div class="calc-skill-page">
    <nav class="skill-nav"><div class="skill-nav-inner"><a class="skill-back" href="미적분1.html#skills-${skill.group}" aria-label="스킬 지도로 돌아가기">←</a><button class="skill-tab active" data-tab="concept"><span>01</span>원리</button><button class="skill-tab" data-tab="drill"><span>02</span>5문제</button><button class="skill-tab rush" data-tab="rush"><span>03</span>60초</button><button class="skill-tab boss" data-tab="boss"><span>04</span>보스</button></div></nav>
    <main class="skill-wrap">
      <section data-panel="concept">
        <header class="skill-hero"><div><p class="skill-kicker">${skill.code} · ${group.name}</p><h1>${skill.title}</h1><p>${skill.desc}</p></div><div class="mastery-card"><span>MASTERY</span><strong data-stars>☆☆☆</strong><small>5문제 · 러시 · 보스</small></div></header>
        <div class="rule-strip"><span>CORE RULE</span><strong>${skill.formula}</strong><em>${skill.tag}</em></div>
        <div class="concept-layout"><div class="formula-card"><div><div class="formula-orbit"><div class="formula-main">${skill.formula}</div></div><p>식을 외우기 전에 계산 순서를 고정하세요.</p></div></div><aside class="routine-card"><h2>3단계 계산 루틴</h2><div class="routine-list">${skill.routine.map((x,i)=>`<div class="routine-step"><span>${i+1}</span><div><b>${x}</b><small>${i===0?'문제의 형태를 먼저 읽습니다.':i===1?'핵심 변형을 한 줄씩 적용합니다.':'마지막에 값과 조건을 확인합니다.'}</small></div></div>`).join('')}</div><div class="trap-box"><span>COMMON TRAP</span><p>${skill.trap}</p></div><div class="example-box"><div class="example-label">QUICK EXAMPLE</div><div class="example-equation" data-example-equation></div><div class="example-prompt" data-example-prompt></div><div class="example-answer hidden" data-example-answer></div><div class="example-actions"><button data-new-example>새 예시</button><button data-reveal-example>정답 보기</button></div></div></aside></div>
        <div class="launch-row"><button class="launch-card" data-open="drill"><span>5 QUESTIONS</span><b>정확도 훈련</b><small>다섯 문제로 계산 루틴을 고정합니다.</small></button><button class="launch-card hot" data-open="rush"><span>60 SECOND RUSH</span><b>시간 압박 훈련</b><small>콤보 점수와 2초 페널티가 적용됩니다.</small></button><button class="launch-card dark" data-open="boss"><span>3 STREAK BOSS</span><b>연속 정답 보스</b><small>한 번 틀리면 첫 단계부터 다시 시작합니다.</small></button></div>
      </section>
      <section class="hidden" data-panel="drill"><header class="mode-header"><div><p class="skill-kicker">ACCURACY DRILL</p><h1>${skill.title} 5문제</h1><p>천천히 계산하고, 틀린 이유까지 확인하세요.</p></div><div class="mode-stat"><span>BEST</span><strong data-drill-best>0 / 5</strong></div></header><div class="question-shell"><div data-drill-start-copy><div class="boss-start-copy"><strong>준비됐나요?</strong><p>보기 중 정답을 고르면 바로 해설이 나옵니다.</p></div><button class="primary-action" data-drill-start>5문제 시작</button></div><div class="hidden" data-drill-play><div class="question-topline"><span data-drill-type>TYPE</span><span data-drill-progress>1 / 5</span></div><div class="question-equation" data-drill-equation></div><div class="question-prompt" data-drill-prompt></div><div class="answer-grid" data-drill-answers></div><div class="answer-feedback hidden" data-drill-feedback></div></div><div class="result-card hidden" data-drill-result></div></div></section>
      <section class="hidden" data-panel="rush"><header class="mode-header"><div><p class="skill-kicker">60 SECOND RUSH</p><h1>${skill.title} 러시</h1><p>빠른 판단과 정확한 계산을 함께 훈련합니다.</p></div><div class="mode-stat"><span>HIGH SCORE</span><strong data-rush-best>0</strong></div></header><div class="rush-stage"><div class="rush-hud"><div><span>TIME</span><strong data-rush-time>60.0</strong></div><div><span>SCORE</span><strong data-rush-score>0</strong></div><div><span>COMBO</span><strong data-rush-combo>×1.0</strong></div></div><div class="rush-track"><div data-rush-bar></div></div><div class="rush-question" data-rush-question><div class="rush-ready">⚡</div><h2>60초 러시</h2><p>오답은 2초가 줄어듭니다.</p></div><div class="answer-grid" data-rush-answers></div><button class="primary-action" data-rush-start>러시 시작</button><div class="result-card hidden" data-rush-result></div><div class="rush-flash" data-rush-flash></div></div></section>
      <section class="hidden" data-panel="boss"><header class="mode-header"><div><p class="skill-kicker">THREE STREAK BOSS</p><h1>${skill.title} 보스</h1><p>세 문제를 한 번도 틀리지 않고 연속으로 해결하세요.</p></div><div class="mode-stat"><span>CLEARS</span><strong data-boss-clears>0</strong></div></header><div class="boss-stage"><div class="boss-progress"><i class="boss-node"></i><i class="boss-node"></i><i class="boss-node"></i></div><div data-boss-body><div class="boss-start-copy"><strong>3연속 정답</strong><p>한 번 틀리면 보스의 체력이 모두 회복됩니다.</p></div></div><div class="boss-status hidden" data-boss-status></div><button class="primary-action" data-boss-start>보스 도전</button></div></section>
    </main></div>`;

  const storageKey=`jp-calc-skill-${skill.id}`;
  let saved={drillBest:0,rushBest:0,bossClears:0};
  try{saved={...saved,...JSON.parse(localStorage.getItem(storageKey)||'{}')}}catch(e){}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(saved))}catch(e){}}
  function updateStats(){
    $('[data-drill-best]').textContent=`${saved.drillBest} / 5`;
    $('[data-rush-best]').textContent=saved.rushBest;
    $('[data-boss-clears]').textContent=saved.bossClears;
    const stars=(saved.drillBest===5?1:0)+(saved.rushBest>=800?1:0)+(saved.bossClears>0?1:0);
    $('[data-stars]').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);
  }
  let rush={running:false,raf:0};
  function showPanel(name){
    if(name!=='rush'&&rush.running){rush.running=false;cancelAnimationFrame(rush.raf)}
    $$('[data-panel]').forEach(p=>p.classList.toggle('hidden',p.dataset.panel!==name));
    $$('.skill-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
    window.scrollTo({top:0,behavior:'smooth'});
  }
  $$('.skill-tab').forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.tab)));
  $$('[data-open]').forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.open)));

  let example;
  function newExample(){example=makeQuestion(skill.id);$('[data-example-equation]').textContent=example.equation;$('[data-example-prompt]').textContent=example.prompt;$('[data-example-answer]').textContent=`정답: ${example.correct} · ${example.explanation}`;$('[data-example-answer]').classList.add('hidden')}
  $('[data-new-example]').addEventListener('click',newExample);
  $('[data-reveal-example]').addEventListener('click',()=>$('[data-example-answer]').classList.remove('hidden'));
  newExample();
  function fillAnswers(box,q,handler){box.innerHTML='';q.choices.forEach(v=>{const b=document.createElement('button');b.className='answer-btn';b.textContent=v;b.addEventListener('click',()=>handler(v,b));box.appendChild(b)})}
  function markAnswers(box,q,selected,btn){$$('.answer-btn',box).forEach(x=>{x.disabled=true;if(x.textContent===q.correct)x.classList.add('correct')});if(String(selected)!==q.correct)btn.classList.add('wrong')}

  let drill={index:0,correct:0,q:null};
  function startDrill(){drill={index:0,correct:0,q:null};$('[data-drill-start-copy]').classList.add('hidden');$('[data-drill-result]').classList.add('hidden');$('[data-drill-play]').classList.remove('hidden');nextDrill()}
  function nextDrill(){if(drill.index>=5){finishDrill();return}drill.q=makeQuestion(skill.id);$('[data-drill-type]').textContent=drill.q.type;$('[data-drill-progress]').textContent=`${drill.index+1} / 5`;$('[data-drill-equation]').textContent=drill.q.equation;$('[data-drill-prompt]').textContent=drill.q.prompt;$('[data-drill-feedback]').className='answer-feedback hidden';const box=$('[data-drill-answers]');fillAnswers(box,drill.q,(v,b)=>{const ok=String(v)===drill.q.correct;markAnswers(box,drill.q,v,b);if(ok)drill.correct++;const f=$('[data-drill-feedback]');f.textContent=(ok?'정답! ':'다시 기억하기: ')+drill.q.explanation;f.className=`answer-feedback ${ok?'good':'bad'}`;drill.index++;setTimeout(nextDrill,650)})}
  function finishDrill(){saved.drillBest=Math.max(saved.drillBest,drill.correct);save();updateStats();$('[data-drill-play]').classList.add('hidden');const b=$('[data-drill-result]');b.innerHTML=`<strong>${drill.correct} / 5</strong><p>${drill.correct===5?'정확도 훈련 완료! 이제 시간 압박에 도전하세요.':drill.correct>=3?'좋습니다. 한 번 더 풀어 완성도를 높여보세요.':'원리 탭에서 계산 순서를 다시 확인하세요.'}</p><button data-retry>다시 훈련</button>`;b.classList.remove('hidden');$('[data-retry]',b).addEventListener('click',startDrill)}
  $('[data-drill-start]').addEventListener('click',startDrill);

  function startRush(){rush={running:true,time:60,score:0,combo:0,correct:0,q:null,last:performance.now(),raf:0};$('[data-rush-start]').classList.add('hidden');$('[data-rush-result]').classList.add('hidden');nextRush();rush.raf=requestAnimationFrame(tickRush)}
  function tickRush(now){if(!rush.running)return;rush.time=Math.max(0,rush.time-(now-rush.last)/1000);rush.last=now;renderRush();if(rush.time<=0){finishRush();return}rush.raf=requestAnimationFrame(tickRush)}
  function renderRush(){$('[data-rush-time]').textContent=rush.time.toFixed(1);$('[data-rush-score]').textContent=rush.score;$('[data-rush-combo]').textContent=`×${(1+Math.floor(rush.combo/3)*.5).toFixed(1)}`;$('[data-rush-bar]').style.width=`${rush.time/60*100}%`}
  function nextRush(){if(!rush.running)return;rush.q=makeQuestion(skill.id);$('[data-rush-question]').innerHTML=`<div class="rush-eq"></div><div class="rush-prompt"></div>`;$('.rush-eq').textContent=rush.q.equation;$('.rush-prompt').textContent=rush.q.prompt;fillAnswers($('[data-rush-answers]'),rush.q,v=>{if(!rush.running)return;const ok=String(v)===rush.q.correct;if(ok){rush.combo++;rush.correct++;rush.score+=100+Math.min(300,rush.combo*20)}else{rush.combo=0;rush.time=Math.max(0,rush.time-2)}flashRush(ok);renderRush();nextRush()})}
  function flashRush(ok){const f=$('[data-rush-flash]');f.textContent=ok?'+ SCORE':'− 2 SEC';f.className=`rush-flash show ${ok?'good':'bad'}`;setTimeout(()=>f.className='rush-flash',330)}
  function finishRush(){if(!rush.running)return;rush.running=false;cancelAnimationFrame(rush.raf);saved.rushBest=Math.max(saved.rushBest,rush.score);save();updateStats();$('[data-rush-answers]').innerHTML='';$('[data-rush-question]').innerHTML='<div class="rush-ready">🏁</div><h2>러시 종료!</h2>';const b=$('[data-rush-result]');b.innerHTML=`<strong>${rush.score}점</strong><p>${rush.correct}문제 성공 · 최고 기록 ${saved.rushBest}점</p><button data-retry>다시 도전</button>`;b.classList.remove('hidden');$('[data-retry]',b).addEventListener('click',startRush)}
  $('[data-rush-start]').addEventListener('click',startRush);

  let boss={index:0,questions:[]};
  function startBoss(){boss={index:0,questions:Array.from({length:3},()=>makeQuestion(skill.id))};$('[data-boss-start]').classList.add('hidden');$('[data-boss-status]').className='boss-status hidden';renderBoss()}
  function renderBoss(){const q=boss.questions[boss.index];$$('.boss-node').forEach((x,i)=>x.className='boss-node '+(i<boss.index?'done':i===boss.index?'active':''));const body=$('[data-boss-body]');body.innerHTML='<div class="question-equation"></div><div class="question-prompt"></div><div class="answer-grid"></div>';$('div.question-equation',body).textContent=q.equation;$('div.question-prompt',body).textContent=q.prompt;const box=$('.answer-grid',body);fillAnswers(box,q,(v,b)=>{const ok=String(v)===q.correct;markAnswers(box,q,v,b);const st=$('[data-boss-status]');if(ok){st.textContent=`${boss.index+1}단계 통과! ${q.explanation}`;st.className='boss-status good';boss.index++;if(boss.index>=3)setTimeout(clearBoss,650);else setTimeout(()=>{st.className='boss-status hidden';renderBoss()},650)}else{st.textContent=`보스가 회복했습니다. ${q.explanation}`;st.className='boss-status bad';$('[data-boss-start]').textContent='처음부터 다시 도전';$('[data-boss-start]').classList.remove('hidden')}})}
  function clearBoss(){saved.bossClears++;save();updateStats();$$('.boss-node').forEach(x=>x.className='boss-node done');$('[data-boss-body]').innerHTML='<div class="boss-start-copy"><strong>보스 클리어!</strong><p>세 문제를 연속으로 해결했습니다. 이 계산 루틴은 실전에서 사용할 준비가 됐습니다.</p></div>';$('[data-boss-status]').className='boss-status hidden';$('[data-boss-start]').textContent='새 보스 소환';$('[data-boss-start]').classList.remove('hidden')}
  $('[data-boss-start]').addEventListener('click',startBoss);
  updateStats();
})();
