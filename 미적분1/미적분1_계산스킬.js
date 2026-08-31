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
  const Q=(type,equation,prompt,correct,wrong,explanation,meta={})=>({type,equation,prompt,correct:String(correct),choices:choices(correct,wrong),explanation,...meta});

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


  // ── 다항식 도구 ──────────────────────────────────────────────────────
  // 계수 배열 [a0,a1,a2,…] 하나에서 표시 문자열과 값을 함께 만든다.
  // 식과 답이 따로 놀아서 생기는 오류를 원천적으로 막기 위한 것이다.
  const P={
    text(c){
      let out='';
      for(let i=c.length-1;i>=0;i--){
        const v=c[i]; if(!v) continue;
        const body=i===0?String(Math.abs(v)):(Math.abs(v)===1?pow('x',i):Math.abs(v)+pow('x',i));
        out+= out? (v>0?'+':'−')+body : (v>0?body:'−'+body);
      }
      return out||'0';
    },
    at(c,x){return c.reduce((s,v,i)=>s+v*Math.pow(x,i),0)},
    d(c){return c.length<2?[0]:c.slice(1).map((v,i)=>v*(i+1))},
    i(c){return [0].concat(c.map((v,i)=>v/(i+1)))},
    // 구간 [a,b] 의 정적분
    def(c,a,b){const F=P.i(c);return P.at(F,b)-P.at(F,a)},
    // 근이 r 인 일차식들의 곱을 계수 배열로 (선행계수 p)
    fromRoots(p,roots){
      let c=[p];
      roots.forEach(r=>{
        const n=new Array(c.length+1).fill(0);
        c.forEach((v,i)=>{n[i+1]+=v;n[i]-=v*r});
        c=n;
      });
      return c;
    }
  };

  // ── 난이도 ────────────────────────────────────────────────────────────
  // 기본은 지금까지의 문제를 그대로 둔다. 응용·심화는 "계수와 차수가 늘 같아서
  // 답이 그대로 나오는" 문제를 깨는 데 목적이 있다.
  const LEVELS=[
    {id:'basic', name:'기본', tag:'BASIC', desc:'한 가지 형태를 반복해 계산 순서를 굳힙니다.'},
    {id:'applied', name:'응용', tag:'APPLIED', desc:'계수와 차수가 바뀝니다. 형태를 먼저 판별해야 합니다.'},
    {id:'deep', name:'심화', tag:'DEEP', desc:'조건을 거꾸로 묻거나 부호가 뒤집히는 경우까지 다룹니다.'}
  ];
  let currentLevel='basic';

  // 최고차항 계수가 1이 아닌 이차식 p(x−r)(x−s) 를 전개해 문자열로 만든다
  const quadFrom=(p,r,s)=>poly2(p,-p*(r+s),p*r*s);
  // 표기 다듬기: 1x, +0x, x−-4, √(x+0) 같은 어색한 식이 나오지 않게 한다
  const num=n=>String(n).replace('-','−');                       // -4 → −4
  const lin=a=>a===0?'x':a>0?`x−${a}`:`x+${Math.abs(a)}`;         // 괄호 없는 일차식
  const lead=(c,v)=>c===1?v:c===-1?`−${v}`:`${c}${v}`;            // 최고차항
  const tail=(c,v)=>c===0?'':v===''?(c>0?`+${c}`:`−${Math.abs(c)}`):c===1?`+${v}`:c===-1?`−${v}`:c>0?`+${c}${v}`:`−${Math.abs(c)}${v}`;
  const sqrtShift=c=>c===0?'√x':`√(${lin(-c)})`;                  // √(x+5) / √x
  const coefText=p=>p===1?'':p===-1?'−':String(p);
  const inf='∞';

  const levelMakers={
    // 0/0 인수분해 · 최고차항 계수와 분모의 차수를 바꾼다
    limit_factor:{
      applied(){
        const p=pick([2,3,-2,-3]);
        const a=nonzero(-4,4);let b=nonzero(-4,4);while(b===a)b=nonzero(-4,4);
        const correct=p*(a-b);
        return Q('FACTOR 0/0 · 계수',`lim x→${a}  (${quadFrom(p,a,b)})/${factor(a)}`,'극한값은?',correct,[a-b,p*(b-a),p],
          `분자는 ${coefText(p)}${factor(a)}${factor(b)}이므로 약분하면 ${coefText(p)}(${lin(b)})입니다. x=${num(a)}를 대입하면 ${correct}입니다.`);
      },
      deep(){
        const a=nonzero(-4,4);let b=nonzero(-4,4),c=nonzero(-4,4);
        while(b===a)b=nonzero(-4,4);
        while(c===a||c===b)c=nonzero(-4,4);
        const correct=frac(a-b,a-c);
        return Q('FACTOR 0/0 · 분모도 인수분해',`lim x→${a}  (${quadFrom(1,a,b)})/(${quadFrom(1,a,c)})`,'극한값은?',correct,[frac(a-c,a-b),String(a-b),'1'],
          `분자와 분모 모두 ${factor(a)}를 인수로 가지므로 약분하면 (${lin(b)})/(${lin(c)})입니다. x=${num(a)}를 대입하면 ${correct}입니다.`);
      }
    },
    // 유리화 · 근호의 위치와 분모의 차수를 바꾼다
    limit_rationalize:{
      applied(){
        const q=ri(2,5),a=ri(1,5),c=q*q-a,correct=2*q;
        return Q('RATIONALIZE · 분모에 근호',`lim x→${a}  (x−${a})/(${sqrtShift(c)}−${q})`,'극한값은?',correct,[frac(1,2*q),String(q),frac(-1,2*q)],
          `분자와 분모에 (${sqrtShift(c)}+${q})를 곱하면 ${sqrtShift(c)}+${q}가 남습니다. x=${a}에서 ${correct}입니다.`);
      },
      deep(){
        const q=ri(2,5),a=ri(1,4),c=q*q-a,correct=frac(1,4*a*q);
        return Q('RATIONALIZE · 분모가 이차',`lim x→${a}  (${sqrtShift(c)}−${q})/(x²−${a*a})`,'극한값은?',correct,[frac(1,2*q),frac(1,2*a),frac(1,a*q)],
          `유리화하면 1/((x+${a})(${sqrtShift(c)}+${q}))이고, x=${a}에서 1/(${2*a}×${2*q})=${correct}입니다.`);
      }
    },
    // ∞/∞ · 차수가 늘 같지 않도록 세 경우를 섞는다
    limit_infinity_ratio:{
      applied(){
        const A=ri(2,7),B=ri(2,6),mode=pick(['same','low','high']);
        if(mode==='same'){
          const correct=frac(A,B);
          return Q('∞/∞ · 차수 판별',`lim x→∞  (${A}x²${tail(nonzero(-5,5),'x')})/(${B}x²${tail(nonzero(-5,5),'')})`,'극한값은?',correct,['0',inf,frac(B,A)],
            `분자와 분모가 모두 이차이므로 최고차항 계수의 비 ${correct}입니다.`);
        }
        if(mode==='low'){
          return Q('∞/∞ · 차수 판별',`lim x→∞  (${A}x${tail(nonzero(-5,5),'')})/(${B}x²${tail(nonzero(-5,5),'x')})`,'극한값은?','0',[frac(A,B),inf,frac(B,A)],
            `분모의 차수가 더 높습니다. x²으로 나누면 분자가 0으로 가므로 극한값은 0이고, 계수의 비 ${frac(A,B)}가 아닙니다.`);
        }
        return Q('∞/∞ · 차수 판별',`lim x→∞  (${A}x²${tail(nonzero(-5,5),'')})/(${B}x${tail(nonzero(-5,5),'')})`,'극한값은?',inf,[frac(A,B),'0','−∞'],
          `분자의 차수가 더 높으므로 발산합니다. 계수의 비 ${frac(A,B)}로 답하지 않도록 주의하세요.`);
      },
      deep(){
        const sq=pick([[4,2],[9,3],[16,4],[25,5]]),A=sq[0],rootA=sq[1],B=ri(2,6);
        const toMinus=pick([true,false]);
        const correct=toMinus?frac(-rootA,B):frac(rootA,B);
        return Q('∞/∞ · 근호와 부호',`lim x→${toMinus?'−∞':'∞'}  √(${A}x²${tail(nonzero(-6,6),'x')})/(${B}x${tail(nonzero(-4,4),'')})`,'극한값은?',correct,
          [toMinus?frac(rootA,B):frac(-rootA,B),frac(A,B),'0'],
          toMinus
            ? `x→−∞에서는 √(x²)=|x|=−x이므로 분자를 −${rootA}x로 보아야 합니다. 따라서 ${correct}입니다.`
            : `x→∞에서 √(${A}x²…)는 ${rootA}x와 같은 속도로 커지므로 ${correct}입니다.`);
      }
    },
    // ∞−∞ · 유리화 뒤 남는 값이 늘 k/2가 되지 않게 한다
    limit_infinity_diff:{
      applied(){
        const k=2*ri(1,5);let m=2*ri(1,5);while(m===k)m=2*ri(1,5);
        const correct=(k-m)/2;
        return Q('∞−∞ · 두 근호',`lim x→∞  {√(x²${sign(k)}x)−√(x²${sign(m)}x)}`,'극한값은?',correct,[k-m,(k+m)/2,0],
          `유리화하면 (${k}x−${m}x)/(√(x²${sign(k)}x)+√(x²${sign(m)}x))이고 분모는 2x와 같은 속도로 커지므로 ${correct}입니다.`);
      },
      deep(){
        const k=2*ri(1,5),c=ri(1,9),correct=-k/2;
        return Q('∞−∞ · x→−∞',`lim x→−∞  {√(x²${sign(k)}x${sign(c)})+x}`,'극한값은?',correct,[k/2,0,-k],
          `x→−∞에서 √(x²${sign(k)}x${sign(c)})는 −x−${k/2}에 가까워지므로 x를 더하면 ${correct}입니다. 상수항 ${c}는 결과에 영향을 주지 않습니다.`);
      }
    },
    // 좌·우극한 · 기준점과 분자의 차수를 바꾼다
    limit_one_sided:{
      applied(forcedSide){
        const a=nonzero(-4,4),side=forcedSide?(forcedSide==='right'?'+':'−'):pick(['+','−']),correct=side==='+'?1:-1;
        return Q('ONE-SIDED · 기준점 이동',`lim x→${num(a)}${side}  |${lin(a)}|/(${lin(a)})`,'극한값은?',correct,[-correct,0,'존재하지 않음'],
          `x→${num(a)}${side}에서 ${lin(a)}는 ${side==='+'?'양수':'음수'}이므로 |${lin(a)}|=${side==='+'?lin(a):`−(${lin(a)})`}입니다. 따라서 ${correct}입니다.`,{side:side==='+'?'right':'left'});
      },
      deep(forcedSide){
        const a=ri(1,5),side=forcedSide?(forcedSide==='right'?'+':'−'):pick(['+','−']),correct=side==='+'?2*a:-2*a;
        return Q('ONE-SIDED · 이차식과 절댓값',`lim x→${a}${side}  (x²−${a*a})/|x−${a}|`,'극한값은?',correct,[-correct,0,'존재하지 않음'],
          `분자는 ${factor(a)}(x+${a})이고 |x−${a}|=${side==='+'?`x−${a}`:`−(x−${a})`}이므로 ${side==='+'?'':'−'}(x+${a})가 남습니다. x=${a}에서 ${correct}입니다.`,{side:side==='+'?'right':'left'});
      }
    },
    // 연속 조건 · 유형서의 "미정계수의 결정"을 거꾸로 묻는다
    continuity_parameter:{
      applied(){
        const a=ri(1,6);let m=nonzero(-5,5);while(m===a)m=nonzero(-5,5);
        const correct=a-m;
        return Q('CONTINUITY · 일반 인수',`f(x)=(${quadFrom(1,a,m)})/${factor(a)} (x≠${a}),  f(${a})=k`,`x=${a}에서 연속이 되게 하는 k는?`,correct,[a+m,a*m,-correct],
          `x≠${a}에서 f(x)=${lin(m)}이므로 극한값은 ${correct}입니다. 함숫값이 이 값과 같아야 연속입니다.`);
      },
      deep(){
        const a=ri(1,5);let L=nonzero(-6,6);while(a-L===0)L=nonzero(-6,6);
        const b=a-L,correct=-(a+b);
        return Q('미정계수 결정',`lim x→${a}  (x²${tail(correct,'x')}${tail(a*b,'')}) / ${factor(a)} = ${num(L)}`,'일차항의 계수 p의 값은?',correct,[L,-correct,a+L],
          `분모가 0으로 가고 극한값이 존재하므로 분자도 x=${a}에서 0이어야 합니다. 분자를 ${factor(a)}(${lin(b)})로 두면 극한값은 ${a}−(${num(b)})=${num(L)}이 되고, 일차항 계수 p는 ${num(correct)}입니다.`);
      }
    },
    // 샌드위치 · 유계 조건의 형태를 바꾼다
    squeeze_limit:{
      applied(){
        const a=ri(1,4);
        return Q('SQUEEZE · 두 함수 사이',`${2*a}x+1 ≤ f(x) ≤ x²${sign(2*a)}x+1,  x→0`,'lim f(x)의 값은?',1,[2*a+1,0,'판정 불가'],
          `양 끝 함수의 x→0 극한이 모두 1이므로 사이에 낀 f(x)의 극한도 1입니다.`);
      },
      deep(){
        const c=ri(2,6);
        return Q('SQUEEZE · x→∞',`1−${c}/x ≤ f(x) ≤ 1+${c}/x  (x>0),  x→∞`,'lim f(x)의 값은?',1,['0',String(c),'판정 불가'],
          `x→∞에서 ${c}/x가 0으로 가므로 양 끝이 모두 1로 수렴합니다. 따라서 f(x)의 극한도 1입니다.`);
      }
    },
    // 로피탈 검산 · 분모도 다항식으로 만들고 0/0 판정을 먼저 하게 한다
    lhopital:{
      applied(){
        const a=nonzero(-3,3);const n=pick([2,3]);let m=pick([2,3]);while(m===n)m=pick([2,3]);
        const An=Math.pow(a,n),Am=Math.pow(a,m);
        const correct=frac(n*Math.pow(a,n-1),m*Math.pow(a,m-1));
        return Q('L’HÔPITAL · 분모도 다항식',`lim x→${a}  (${pow('x',n)}${sign(-An)})/(${pow('x',m)}${sign(-Am)})`,'로피탈 정리로 검산한 극한값은?',correct,
          [frac(m*Math.pow(a,m-1),n*Math.pow(a,n-1)),String(n*Math.pow(a,n-1)),'1'],
          `0/0꼴이므로 분자와 분모를 각각 미분하면 ${n}${pow('x',n-1)}/(${m}${pow('x',m-1)})입니다. x=${a}를 대입하면 ${correct}입니다.`);
      },
      deep(){
        const A=ri(2,6),B=ri(2,6),p=nonzero(-4,4),q=nonzero(-4,4);
        const correct=frac(p,q);
        return Q('L’HÔPITAL · 일차항이 살아 있는 0/0',`lim x→0  (${A}x²${tail(p,'x')})/(${B}x²${tail(q,'x')})`,'극한값은?',correct,[frac(A,B),'1','0'],
          `분자와 분모를 x로 약분하면 (${A}x${tail(p,'')})/(${B}x${tail(q,'')})이고 x=0에서 ${correct}입니다. 이차항 계수의 비 ${frac(A,B)}가 아닙니다.`);
      }
    }
  };

  // ── 미분 ─────────────────────────────────────────────────────────────
  levelMakers.derivative_definition={
    applied(){
      const c=[0,nonzero(-4,4),nonzero(-3,3),pick([1,2,-1,-2])],t=nonzero(-2,2);
      const d=P.d(c),correct=P.at(d,t);
      const q=Q('DEFINITION · 삼차함수',`f(x)=${P.text(c)}`,`f′(${num(t)})의 값은?`,correct,[P.at(c,t),correct+t,-correct],
        `f′(x)=${P.text(d)}이므로 x=${num(t)}를 넣으면 ${correct}입니다.`);
      q.check={k:'deriv',c:c,at:t};return q;
    },
    deep(){
      const c=[0,nonzero(-4,4),nonzero(-3,3),pick([1,2,-1])],a=nonzero(-2,2);
      const mode=pick(['scale','sym']),d=P.d(c),fa=P.at(d,a);
      if(mode==='scale'){
        const k=ri(2,4),correct=k*fa;
        const q=Q('DEFINITION · 계수가 붙은 h',`f(x)=${P.text(c)}`,`lim h→0 (f(${num(a)}+${k}h)−f(${num(a)}))/h 의 값은?`,correct,[fa,correct+k,-correct],
          `분자와 분모에 ${k}를 맞추면 ${k}f′(${num(a)})입니다. f′(x)=${P.text(d)}이므로 ${k}×${fa}=${correct}입니다.`);
        q.check={k:'deriv',c:c,at:a,mul:k};return q;
      }
      const correct=2*fa;
      const q=Q('DEFINITION · 양쪽에서 다가가기',`f(x)=${P.text(c)}`,`lim h→0 (f(${num(a)}+h)−f(${num(a)}−h))/h 의 값은?`,correct,[fa,0,-correct],
        `f(${num(a)}+h)−f(${num(a)}−h)를 f(${num(a)})를 더하고 빼서 두 조각으로 나누면 2f′(${num(a)})입니다. f′(${num(a)})=${fa}이므로 ${correct}입니다.`);
      q.check={k:'deriv',c:c,at:a,mul:2};return q;
    }
  };

  levelMakers.differentiate_polynomial={
    applied(){
      const c=[nonzero(-5,5),nonzero(-4,4),nonzero(-3,3),pick([1,2,3,-1,-2])],t=nonzero(-2,2);
      const d=P.d(c),correct=P.at(d,t);
      const q=Q('POWER RULE · 여러 항',`f(x)=${P.text(c)}`,`f′(${num(t)})의 값은?`,correct,[P.at(c,t),correct-t,2*correct],
        `각 항을 따로 미분하면 f′(x)=${P.text(d)}입니다. x=${num(t)}에서 ${correct}입니다.`);
      q.check={k:'deriv',c:c,at:t};return q;
    },
    deep(){
      // f′(t)=0 이 되도록 미지의 계수를 되묻는다
      const t=nonzero(-3,3),b=nonzero(-5,5),correct=-(3*t*t+b)/(2*t);
      if(!Number.isInteger(correct))return levelMakers.differentiate_polynomial.deep();
      const c=[0,b,correct,1];
      const q=Q('POWER RULE · 계수 되묻기',`f(x)=x³+ax²${tail(b,'x')}`,`f′(${num(t)})=0 이 되게 하는 상수 a는?`,correct,[-correct,b,t],
        `f′(x)=3x²+2ax${tail(b,'')}이고 f′(${num(t)})=${3*t*t}${tail(2*t,'a')}${tail(b,'')}=0이므로 a=${correct}입니다.`);
      q.check={k:'deriv',c:c,at:t,expect:0};return q;
    }
  };

  levelMakers.product_rule={
    applied(){
      const p=pick([2,3,-2]),q0=nonzero(-4,4),r=nonzero(-4,4),t=nonzero(-2,2);
      // f(x)=(px+q)(x²+r)
      const c=[q0*r,p*r,q0,p];
      const d=P.d(c),correct=P.at(d,t);
      const q=Q('PRODUCT RULE · 계수가 있는 곱',`f(x)=(${lead(p,'x')}${tail(q0,'')})(x²${tail(r,'')})`,`f′(${num(t)})의 값은?`,correct,[P.at(c,t),correct-t,-correct],
        `곱의 미분법으로 f′(x)=${p}(x²${tail(r,'')})+(${lead(p,'x')}${tail(q0,'')})·2x = ${P.text(d)}입니다. x=${num(t)}에서 ${correct}입니다.`);
      q.check={k:'deriv',c:c,at:t};return q;
    },
    deep(){
      const a=nonzero(-3,3);let b=nonzero(-3,3);while(b===a)b=nonzero(-3,3);
      const c=P.fromRoots(1,[a,a,b]),d=P.d(c);
      const t=pick([a,b]),correct=P.at(d,t);
      const q=Q('PRODUCT RULE · 중근이 있는 곱',`f(x)=(${lin(a)})²(${lin(b)})`,`f′(${num(t)})의 값은?`,correct,[-correct,0===correct?1:0,P.at(c,t)],
        t===a?`중근 x=${num(a)}에서는 f와 f′이 모두 0이 되므로 ${correct}입니다.`
             :`f′(x)=2(${lin(a)})(${lin(b)})+(${lin(a)})²이고 x=${num(b)}에서 (${num(b-a)})²=${correct}입니다.`);
      q.check={k:'deriv',c:c,at:t};return q;
    }
  };

  levelMakers.tangent_equation={
    applied(){
      const c=[nonzero(-4,4),nonzero(-3,3),0,1],a=nonzero(-2,2);
      const d=P.d(c),m=P.at(d,a),y=P.at(c,a),k=y-m*a;
      const correct=lineEq(m,k);
      const q=Q('TANGENT · 삼차함수',`f(x)=${P.text(c)},  x=${num(a)}`,'접선의 방정식은?',correct,[lineEq(m,y),lineEq(-m,k),lineEq(a,k)],
        `접점은 (${num(a)}, ${y}), 기울기는 f′(${num(a)})=${m}이므로 ${correct}입니다.`);
      q.check={k:'tangent',c:c,at:a};return q;
    },
    deep(){
      // 기울기가 주어진 접선의 접점을 찾는다
      const s=nonzero(-3,3),cc=[nonzero(-4,4),0,-3*s,1];   // f′(x)=3x²−6sx 이므로 접점은 중근
      const d=P.d(cc),m=P.at(d,s),correct=s;
      const q=Q('TANGENT · 기울기로 접점 찾기',`f(x)=${P.text(cc)}`,`기울기가 ${num(m)}인 접선의 접점 x좌표는?`,correct,[-s,m,0],
        `f′(x)=${P.text(d)}이고 f′(x)=${num(m)}을 정리하면 3(${lin(s)})²=0이므로 접점은 x=${num(s)} 하나뿐입니다.`);
      q.check={k:'derivEq',c:cc,at:s,value:m};return q;
    }
  };

  // ── 도함수·그래프 ────────────────────────────────────────────────────
  levelMakers.monotonic_interval={
    applied(){
      const a=ri(-4,-1);let b=ri(1,4);
      const d=P.fromRoots(6,[a,b]);                 // 6으로 두면 적분해도 계수가 정수로 떨어진다
      const c=P.i(d);
      const correct=`(−∞,${num(a)}) ∪ (${num(b)},∞)`;
      const q=Q('SIGN CHART · 함수에서 출발',`f(x)=${P.text(c)}`,'f가 증가하는 구간은?',correct,
        [`(${num(a)},${num(b)})`,`(−∞,${num(b)})`,`(${num(a)},∞)`],
        `f′(x)=${P.text(d)}=6(${lin(a)})(${lin(b)})이고, 위로 열린 이차식은 두 근의 바깥에서 양수입니다.`);
      q.check={k:'increase',d:d,roots:[a,b]};return q;
    },
    deep(){
      // f(x)=x³+ax²+bx 가 항상 증가할 조건 → 판별식
      const a=pick([3,6,-3,-6]),correct=`b ≥ ${a*a/3}`;
      const q=Q('SIGN CHART · 항상 증가할 조건',`f(x)=x³${tail(a,'x²')}+bx`,'모든 실수에서 f가 증가하기 위한 b의 조건은?',correct,
        [`b > ${a*a/3}`,`b ≤ ${a*a/3}`,`b ≥ ${a}`],
        `f′(x)=3x²${tail(2*a,'x')}+b가 항상 0 이상이어야 하므로 판별식 ${4*a*a}−12b ≤ 0, 즉 b ≥ ${a*a/3}입니다.`);
      q.check={k:'discriminant',A:3,B:2*a,bound:a*a/3,want:'none'};return q;
    }
  };

  levelMakers.extrema_sign={
    applied(){
      const p=nonzero(-3,3);let r=nonzero(-3,3);while(r===p)r=nonzero(-3,3);
      const lo=Math.min(p,r),hi=Math.max(p,r);
      const d=P.fromRoots(6,[lo,hi]),c=P.i(d);
      const correct=P.at(c,lo);                     // 위로 열린 f′ → 작은 근에서 극대
      const q=Q('SIGN CHANGE · 극댓값 구하기',`f(x)=${P.text(c)}`,'f의 극댓값은?',correct,[P.at(c,hi),lo,hi],
        `f′(x)=${P.text(d)}=6(${lin(lo)})(${lin(hi)})이므로 x=${num(lo)}에서 극대입니다. f(${num(lo)})=${correct}입니다.`);
      q.check={k:'polyval',c:c,at:lo};return q;
    },
    deep(){
      const p=ri(1,4),correct=`k < ${3*p*p}`;
      const q=Q('SIGN CHANGE · 극값을 가질 조건',`f(x)=x³${tail(-3*p,'x²')}+kx`,'f가 극댓값과 극솟값을 모두 갖기 위한 k의 조건은?',correct,
        [`k > ${3*p*p}`,`k < ${p*p}`,`k ≥ ${3*p*p}`],
        `f′(x)=3x²${tail(-6*p,'x')}+k가 서로 다른 두 실근을 가져야 합니다. 판별식 ${36*p*p}−12k > 0이므로 k < ${3*p*p}입니다.`);
      q.check={k:'discriminant',A:3,B:-6*p,bound:3*p*p,want:'two'};return q;
    }
  };

  levelMakers.cubic_extrema={
    applied(){
      const a=ri(1,4),correct=4*a*a*a;              // f=x³−3a²x 의 극댓값−극솟값 = 4a³
      const q=Q('CUBIC EXTREMA · 극값의 차',`f(x)=x³−${3*a*a}x`,'극댓값과 극솟값의 차는?',correct,[2*a*a*a,a*a*a,2*a],
        `f′(x)=3(x²−${a*a})이므로 x=±${a}에서 극값입니다. f(−${a})=${2*a*a*a}, f(${a})=${-2*a*a*a}이므로 차는 ${correct}입니다.`);
      q.check={k:'extremaGap',c:[0,-3*a*a,0,1]};return q;
    },
    deep(){
      const p=nonzero(-3,3),correct=-3*p*p;         // f=x³+ax²+bx 가 x=p 에서 극값 → 미지 b
      const a=-3*p,b=3*p*p;
      const q=Q('CUBIC EXTREMA · 계수 되묻기',`f(x)=x³${tail(-3*p,'x²')}+bx`,`f가 x=${num(p)}에서 극값을 갖게 하는 b는?`,b,[-b,p,3*p],
        `f′(x)=3x²${tail(-6*p,'x')}+b이고 f′(${num(p)})=${3*p*p}${tail(-6*p*p,'')}+b=0이므로 b=${b}입니다.`);
      q.check={k:'deriv',c:[0,b,a,1],at:p,expect:0};return q;
    }
  };

  levelMakers.quartic_shape={
    applied(){
      // 선행계수와 근 배치에 따라 가운데 임계점이 극대도 극소도 된다
      const up=pick([true,false]),r=pick([[-2,0,2],[-3,-1,2],[-1,1,3],[-3,0,1]]);
      const correct=up?'극대':'극소';
      const q=Q('QUARTIC SHAPE · 부호까지 판단',`f′(x)=${up?'4':'−4'}(${lin(r[0])})(${lin(r[1])})(${lin(r[2])})`,
        `가운데 임계점 x=${num(r[1])}에서 f는?`,correct,[up?'극소':'극대','변곡점','판정 불가'],
        up?`가운데 근의 왼쪽에서는 (+)(−)(−)로 양수, 오른쪽에서는 (+)(+)(−)로 음수입니다. +에서 −로 바뀌므로 극대입니다.`
          :`선행계수가 음수라 부호가 모두 뒤집힙니다. 가운데 근에서 −에서 +로 바뀌므로 극소입니다.`);
      q.check={k:'quartic',up:up,roots:r};return q;
    },
    deep(){
      const mode=pick(['three','one']);
      const correct=mode==='three'?'3개':'1개';
      const q=Q('QUARTIC SHAPE · 극값의 개수',
        mode==='three'?`f′(x)=4x(x−${ri(1,3)})(x+${ri(1,3)})`:`f′(x)=4x(x²+${ri(1,4)})`,
        'f의 극값은 모두 몇 개인가요?',correct,[mode==='three'?'1개':'3개','2개','0개'],
        mode==='three'?`f′의 서로 다른 실근이 3개이고 각각에서 부호가 바뀌므로 극값은 3개입니다.`
                      :`x²+양수는 항상 0보다 크므로 f′의 실근은 x=0 하나뿐이고 극값도 1개입니다.`);
      q.check={k:'skip'};return q;
    }
  };

  levelMakers.real_roots={
    applied(){
      const p=ri(1,3),peak=2*p*p*p;                 // y=x³−3p²x 의 극댓값 2p³, 극솟값 −2p³
      const k=pick([-peak-1,-peak,0,peak,peak+1]);
      const correct=Math.abs(k)<peak?'3개':Math.abs(k)===peak?'2개':'1개';
      const q=Q('REAL ROOTS · 일반 삼차',`x³−${3*p*p}x = ${num(k)}`,'서로 다른 실근의 개수는?',correct,
        ['1개','2개','3개'].filter(x=>x!==correct).concat(['0개']),
        `y=x³−${3*p*p}x의 극댓값은 ${peak}, 극솟값은 ${-peak}입니다. 수평선 y=${num(k)}와의 교점을 셉니다.`);
      q.check={k:'roots',c:[-k,-3*p*p,0,1],expect:correct};return q;
    },
    deep(){
      const p=ri(1,3),peak=2*p*p*p;
      const correct=`−${peak} < k < ${peak}`;
      const q=Q('REAL ROOTS · 조건에서 범위로',`x³−${3*p*p}x = k`,'서로 다른 실근이 3개가 되게 하는 k의 범위는?',correct,
        [`k > ${peak}`,`−${peak} ≤ k ≤ ${peak}`,`k < −${peak}`],
        `극댓값 ${peak}와 극솟값 ${-peak} 사이에 수평선이 있어야 교점이 3개가 됩니다. 등호면 접하여 2개가 됩니다.`);
      q.check={k:'cubicRange',c:[0,-3*p*p,0,1],peak:peak};return q;
    }
  };

  levelMakers.mean_value={
    applied(){
      const a=ri(0,2),b=a+2*ri(1,3),A=pick([1,2,3]),B=nonzero(-4,4);
      const c=[0,B,A],correct=(a+b)/2;             // f=Ax²+Bx 는 c=(a+b)/2
      const q=Q('MEAN VALUE · 계수가 있는 이차',`f(x)=${P.text(c)},  [${a},${b}]`,'평균값 정리를 만족하는 c는?',correct,[a+b,b-a,2*correct],
        `평균변화율은 ${A}(${a}+${b})${tail(B,'')}이고 f′(c)=${2*A}c${tail(B,'')}이므로 c=${correct}입니다.`);
      q.check={k:'mvt',c:c,a:a,b:b};return q;
    },
    deep(){
      const a=nonzero(-3,3);let b=nonzero(-3,3);while(b===a)b=nonzero(-3,3);
      const lo=Math.min(a,b),hi=Math.max(a,b),correct=(lo+hi)/2;
      const c=P.fromRoots(1,[lo,hi]);
      const q=Q('ROLLE · 양 끝 함숫값이 같을 때',`f(x)=${P.text(c)},  [${lo},${hi}]`,`f(${lo})=f(${hi})=0일 때 f′(c)=0인 c는?`,correct,[lo,hi,0],
        `롤의 정리에 따라 구간 안에 f′(c)=0인 c가 있습니다. f′(x)=${P.text(P.d(c))}이므로 c=${correct}입니다.`);
      q.check={k:'deriv',c:c,at:correct,expect:0};return q;
    }
  };

  levelMakers.motion_rate={
    applied(){
      const A=ri(1,2),B=nonzero(-6,-2),t=ri(1,3);
      const s=[0,0,B,A],v=P.d(s),acc=P.d(v);
      const correct=P.at(acc,t);
      const q=Q('VELOCITY · 가속도',`s(t)=${P.text(s)}`,`t=${t}에서 가속도는?`,correct,[P.at(v,t),correct+t,-correct],
        `v(t)=${P.text(v)}, a(t)=${P.text(acc)}이므로 t=${t}에서 ${correct}입니다.`);
      q.check={k:'deriv2',c:s,at:t};return q;
    },
    deep(){
      const r=ri(1,4);                              // v(t)=3(t−r)(t+r) 형태를 피하고 정수 해를 보장
      const v=P.fromRoots(3,[r,-r]),s=P.i(v).map(x=>Math.round(x*6)/6);
      const correct=r;
      const q=Q('VELOCITY · 운동 방향이 바뀌는 시각',`s(t)=${P.text(s)}  (t ≥ 0)`,'물체의 운동 방향이 바뀌는 시각 t는?',correct,[2*r,0,r*r],
        `v(t)=${P.text(v)}=3(t−${r})(t+${r})이고 t ≥ 0에서 부호가 바뀌는 것은 t=${r}뿐입니다.`);
      q.check={k:'signChange',c:v,at:r};return q;
    }
  };

  levelMakers.horizontal_tangent={
    applied(){
      const c=[nonzero(-4,4),3*pick([-3,-1,1,3]),0,1];   // f′(x)=3x²+b
      const b=c[1],correct=b<0?'2개':'0개';
      const q=Q('HORIZONTAL TANGENT · 일반 삼차',`f(x)=${P.text(c)}`,'수평접선의 개수는?',correct,
        ['0개','1개','2개'].filter(x=>x!==correct).concat(['3개']),
        `f′(x)=3x²${tail(b,'')}=0의 서로 다른 실근 수가 수평접선의 개수입니다. ${b<0?`x²=${-b/3}이므로 2개`:'실근이 없으므로 0개'}입니다.`);
      q.check={k:'hTangent',c:c};return q;
    },
    deep(){
      const p=ri(1,3),correct=`k > ${3*p*p}`;
      const q=Q('HORIZONTAL TANGENT · 조건에서 범위로',`f(x)=x³${tail(-3*p,'x²')}+kx`,'수평접선이 하나도 없게 하는 k의 조건은?',correct,
        [`k < ${3*p*p}`,`k > ${p*p}`,`k ≥ 0`],
        `f′(x)=3x²${tail(-6*p,'x')}+k가 실근을 갖지 않아야 합니다. 판별식 ${36*p*p}−12k < 0이므로 k > ${3*p*p}입니다.`);
      q.check={k:'discriminant',A:3,B:-6*p,bound:3*p*p,want:'none'};return q;
    }
  };

  // ── 적분 ─────────────────────────────────────────────────────────────
  levelMakers.antiderivative={
    applied(){
      const d=[nonzero(-5,5),nonzero(-4,4)*2,3*pick([1,2,-1])];
      const F=P.i(d),correct=P.text(F)+'+C';
      const q=Q('ANTIDERIVATIVE · 다항식',`∫ (${P.text(d)}) dx`,'부정적분은?',correct,[P.text(d)+'+C',P.text(P.d(d))+'+C',P.text(F)],
        `각 항의 지수를 하나 올리고 새 지수로 나누면 ${correct}입니다.`);
      q.check={k:'antider',d:d};return q;
    },
    deep(){
      const c=[nonzero(-4,4),nonzero(-3,3),pick([1,2,-1])];
      const d=P.d(c),correct=P.text(c)+'+C';
      const q=Q('ANTIDERIVATIVE · 미분을 거꾸로',`f′(x)=${P.text(d)}`,'f(x)로 가능한 식은?',correct,[P.text(d)+'+C',P.text(P.d(d))+'+C',P.text(P.i(d))],
        `f′(x)를 적분하면 ${P.text(P.i(d))}+C이고, 상수항까지 포함해 ${correct} 꼴입니다.`);
      q.check={k:'antider',d:d};return q;
    }
  };

  levelMakers.initial_antiderivative={
    applied(){
      const d=[nonzero(-4,4),2*nonzero(-3,3),3*pick([1,2,-1])];
      const F0=nonzero(-5,5),t=nonzero(-2,2);
      const F=P.i(d);F[0]=F0;
      const correct=P.at(F,t);
      const q=Q('INITIAL VALUE · 이차 도함수',`F′(x)=${P.text(d)},  F(0)=${F0}`,`F(${num(t)})의 값은?`,correct,[correct-F0,F0,-correct],
        `F(x)=${P.text(F)}이고 x=${num(t)}를 넣으면 ${correct}입니다.`);
      q.check={k:'polyval',c:F,at:t};return q;
    },
    deep(){
      // 부정적분과 미분계수: lim x→a (F(x)−F(a))/(x−a) = F′(a) = f(a)
      const c=[nonzero(-4,4),nonzero(-3,3),pick([1,2,-1,-2])],a=nonzero(-2,2);
      const correct=P.at(c,a);
      // 식 자리에는 함수만 두고 조건은 발문으로 뺀다 (390px에서 넘치지 않게)
      const q=Q('부정적분과 미분계수',`f(x)=${P.text(c)}`,
        `F가 f의 부정적분일 때, lim x→${num(a)} (F(x)−F(${num(a)}))/(${lin(a)}) 의 값은?`,correct,[P.at(P.i(c),a),P.at(P.d(c),a),0],
        `이 극한은 F′(${num(a)})의 정의이고 F′=f이므로 f(${num(a)})=${correct}입니다.`);
      q.check={k:'polyval',c:c,at:a};return q;
    }
  };

  levelMakers.definite_integral={
    applied(){
      const c=[nonzero(-4,4),2*nonzero(-3,3),3*pick([1,2,-1])],a=ri(0,2),b=a+ri(1,3);
      const correct=P.def(c,a,b);
      const q=Q('DEFINITE INTEGRAL · 이차 피적분',`∫[${a}→${b}] (${P.text(c)}) dx`,'정적분의 값은?',correct,[P.at(c,b),correct+b,-correct],
        `원시함수 ${P.text(P.i(c))}에 ${b}와 ${a}를 대입해 빼면 ${correct}입니다.`);
      q.check={k:'defint',c:c,a:a,b:b};return q;
    },
    deep(){
      const c=[nonzero(-3,3),0,3*pick([1,-1]),4*pick([1,-1])],a=-ri(1,2),b=ri(1,2);
      const correct=P.def(c,a,b);
      const q=Q('DEFINITE INTEGRAL · 음수 구간 포함',`∫[${num(a)}→${b}] (${P.text(c)}) dx`,'정적분의 값은?',correct,[-correct,P.at(c,b)-P.at(c,a),0],
        `원시함수 ${P.text(P.i(c))}에 위끝 ${b}와 아래끝 ${num(a)}를 대입해 빼면 ${correct}입니다.`);
      q.check={k:'defint',c:c,a:a,b:b};return q;
    }
  };

  levelMakers.integral_symmetry={
    applied(){
      const a=ri(1,3),even=pick([true,false]);
      const c=even?[0,0,3*pick([1,2])]:[0,0,0,4*pick([1,2])];
      const correct=P.def(c,-a,a);
      const q=Q('SYMMETRY · 홀함수인지 먼저 판정',`∫[−${a}→${a}] (${P.text(c)}) dx`,'정적분의 값은?',correct,[0===correct?a:0,-correct,2*a],
        even?`${P.text(c)}는 짝함수이므로 0이 아니라 0부터 ${a}까지의 두 배인 ${correct}입니다.`
            :`${P.text(c)}는 홀함수이고 구간이 원점 대칭이므로 ${correct}입니다.`);
      q.check={k:'defint',c:c,a:-a,b:a};return q;
    },
    deep(){
      const a=ri(1,3);
      const c=[0,nonzero(-3,3),3*pick([1,2]),4*pick([1,-1])];  // 홀·짝이 섞인 식
      const correct=P.def(c,-a,a);
      const q=Q('SYMMETRY · 홀·짝이 섞인 식',`∫[−${a}→${a}] (${P.text(c)}) dx`,'정적분의 값은?',correct,[0,-correct,2*correct],
        `홀수 차수 항은 0이 되고 짝수 차수 항만 남습니다. 남은 부분을 계산하면 ${correct}입니다.`);
      q.check={k:'defint',c:c,a:-a,b:a};return q;
    }
  };

  levelMakers.area_axis={
    applied(){
      const a=ri(1,3),k=pick([1,2,3]);
      const c=P.fromRoots(-k,[0,a]);               // 위로 볼록, [0,a]에서 f ≥ 0
      const correct=frac(k*a*a*a,6);
      const q=Q('AREA · 포물선과 x축',`y=${P.text(c)},  0≤x≤${a}`,'그래프와 x축 사이 넓이는?',correct,[frac(k*a*a*a,3),frac(k*a*a,2),String(k*a)],
        `구간 안에서 y ≥ 0이므로 그대로 적분하면 ${correct}입니다.`);
      q.check={k:'absint',c:c,a:0,b:a};return q;
    },
    deep(){
      const a=ri(1,3),k=pick([1,2]);
      const c=P.fromRoots(k,[0,a]);                // [0,a]에서 음수 → 정적분값과 넓이가 다르다
      const correct=frac(k*a*a*a,6);
      const q=Q('AREA · 정적분값과 넓이가 다를 때',`y=${P.text(c)},  0≤x≤${a}`,'그래프와 x축 사이 넓이는?',correct,
        [frac(-k*a*a*a,6),'0',frac(k*a*a*a,3)],
        `이 구간에서 y ≤ 0이라 정적분값은 음수 ${frac(-k*a*a*a,6)}입니다. 넓이는 절댓값이므로 ${correct}입니다.`);
      q.check={k:'absint',c:c,a:0,b:a};return q;
    }
  };

  levelMakers.area_between={
    applied(){
      const m=ri(1,4);                              // y=x² 와 y=mx 의 교점 0, m
      const correct=frac(m*m*m,6);
      const q=Q('BETWEEN CURVES · 교점을 먼저',`y=x²,  y=${lead(m,'x')}`,'두 곡선으로 둘러싸인 부분의 넓이는?',correct,[frac(m*m*m,3),frac(m*m,2),String(m)],
        `교점은 x=0과 x=${m}입니다. 이 구간에서 직선이 위이므로 ∫(${lead(m,'x')}−x²)dx=${correct}입니다.`);
      q.check={k:'areaBetween',f:[0,m],g:[0,0,1],a:0,b:m};return q;
    },
    deep(){
      const d=ri(1,3);                              // y=x² 와 y=−x²+2d² 의 교점 ±d
      const correct=frac(8*d*d*d,3);
      const q=Q('BETWEEN CURVES · 두 포물선',`y=x²,  y=−x²+${2*d*d}`,'두 곡선으로 둘러싸인 부분의 넓이는?',correct,[frac(4*d*d*d,3),frac(2*d*d*d,3),String(2*d)],
        `교점은 x=±${d}입니다. 위 곡선에서 아래 곡선을 빼면 ${2*d*d}−2x²이고, −${d}부터 ${d}까지 적분하면 ${correct}입니다.`);
      q.check={k:'areaBetween',f:[2*d*d,0,-1],g:[0,0,1],a:-d,b:d};return q;
    }
  };

  levelMakers.distance_velocity={
    applied(){
      const r=ri(2,4);                              // v(t)=t²−r² , 0≤t≤r+1 은 계산이 지저분해 [0,r] 로 둔다
      const v=[-r*r,0,1],T=r;
      const correct=frac(2*r*r*r,3);
      const q=Q('TOTAL DISTANCE · 이차 속도',`v(t)=${P.text(v)},  0≤t≤${T}`,'이동거리는?',correct,[frac(-2*r*r*r,3),'0',frac(r*r*r,3)],
        `구간 내내 v ≤ 0이므로 이동거리는 −∫v dt = ${correct}입니다.`);
      q.check={k:'absint',c:v,a:0,b:T};return q;
    },
    deep(){
      const k=ri(1,3),T=2*k;                        // v(t)=2t−2k : t=k 에서 부호가 바뀐다
      const v=[-2*k,2];                             // 변위는 0, 이동거리는 2k² — 여기서는 변위를 묻는다
      const q=Q('DISPLACEMENT vs DISTANCE',`v(t)=${P.text(v)},  0≤t≤${T}`,`위치의 변화량(변위)은?`,0,[2*k*k,k*k,-2*k*k],
        `변위는 ∫v dt로 0입니다. 이동거리 ${2*k*k}와 다릅니다. t=${k}에서 방향이 바뀌어 되돌아왔기 때문입니다.`);
      q.check={k:'defint',c:v,a:0,b:T};return q;
    }
  };

  levelMakers.fundamental_theorem={
    applied(){
      const c=[nonzero(-3,3),nonzero(-3,3),pick([1,2,-1])],t=nonzero(-2,2);
      const correct=P.at(c,t);
      const q=Q('FTC · 위끝이 x인 누적함수',`F(x)=∫[0→x] (${P.text(c).replace(/x/g,'t')}) dt`,`F′(${num(t)})의 값은?`,correct,[P.at(P.i(c),t),P.at(P.d(c),t),0],
        `미적분의 기본정리에 따라 F′(x)=${P.text(c)}이므로 ${correct}입니다.`);
      q.check={k:'polyval',c:c,at:t};return q;
    },
    deep(){
      const a=nonzero(-3,3),b=nonzero(-4,4);
      // ∫[a→x] f(t)dt = x²+bx−(a²+ab) 가 되도록 f(t)=2t+b
      const c=[b,2],correct=P.at(c,a);
      const q=Q('FTC · 양변을 미분하기',`∫[${num(a)}→x] f(t) dt = x²${tail(b,'x')}${tail(-(a*a+b*a),'')}`,`f(${num(a)})의 값은?`,correct,[a*a+b*a,2*a,b],
        `양변을 x로 미분하면 f(x)=2x${tail(b,'')}입니다. x=${num(a)}를 넣으면 ${correct}입니다.`);
      q.check={k:'polyval',c:c,at:a};return q;
    }
  };

  const levelIds=Object.keys(levelMakers);
  const hasLevels=id=>levelIds.includes(id);
  function makeQuestion(id,level=currentLevel,forcedSide=null){
    const targetLevel=LEVELS.some(x=>x.id===level)?level:'basic';
    let question;
    if(targetLevel!=='basic'){
      const set=levelMakers[id];
      if(set&&set[targetLevel])question=set[targetLevel](forcedSide);
    }
    if(!question)question=baseQuestion(id,forcedSide);
    question.level=targetLevel;
    return question;
  }

  function baseQuestion(id,forcedSide=null){
    let a,b,c,n,k,q,t,A,B,roots,mode,correct,m,p;
    switch(id){
      case'limit_factor':
        a=nonzero(-4,4);do{b=nonzero(-4,4)}while(b===a);correct=a-b;
        return Q('FACTOR 0/0',`lim x→${a}  (${poly2(1,-(a+b),a*b)})/${factor(a)}`,'극한값은?',correct,[a+b,b-a,a*b],`분자는 ${factor(a)}${factor(b)}이므로 약분 후 ${lin(b)}에 x=${num(a)}를 대입합니다.`);
      case'limit_rationalize':
        q=ri(2,5);a=ri(1,5);c=q*q-a;correct=frac(1,2*q);
        return Q('RATIONALIZE',`lim x→${a}  (${sqrtShift(c)}−${q})/(x−${a})`,'극한값은?',correct,[frac(1,q),String(2*q),frac(-1,2*q)],`켤레식을 곱하면 1/(${sqrtShift(c)}+${q})가 되어 ${correct}입니다.`);
      case'limit_infinity_ratio':
        A=ri(1,7);B=ri(1,6);correct=frac(A,B);
        return Q('∞/∞',`lim x→∞  (${lead(A,'x²')}${tail(nonzero(-5,5),'')})/(${lead(B,'x²')}${tail(nonzero(-5,5),'x')}+1)`,'극한값은?',correct,[frac(B,A),String(A),String(B)],`분자와 분모를 x²으로 나누면 최고차항 계수의 비 ${correct}만 남습니다.`);
      case'limit_infinity_diff':
        k=2*ri(1,5);correct=k/2;
        return Q('∞−∞',`lim x→∞  {√(x²+${k}x)−x}`,'극한값은?',correct,[k,0,-correct],`켤레식으로 유리화하면 ${k}x/(√(x²+${k}x)+x)이므로 ${correct}입니다.`);
      case'limit_one_sided':
        mode=forcedSide?(forcedSide==='right'?'0+':'0−'):pick(['0−','0+']);correct=mode==='0−'?-1:1;
        return Q('ONE-SIDED',`lim x→${mode}  |x|/x`,'극한값은?',correct,[-correct,0,'존재하지 않음'],`${mode==='0−'?'x<0에서 |x|=−x':'x>0에서 |x|=x'}이므로 ${correct}입니다.`,{side:mode==='0−'?'left':'right'});
      case'continuity_parameter':
        a=ri(1,6);correct=2*a;
        return Q('CONTINUITY',`f(x)=(x²−${a*a})/${factor(a)} (x≠${a}),  f(${a})=k`,'x='+a+'에서 연속이 되게 하는 k는?',correct,[a,a*a,-correct],`x≠${a}에서 f(x)=x+${a}이므로 극한값은 ${correct}입니다.`);
      case'squeeze_limit':
        n=pick([2,4,6]);A=ri(2,5);
        return Q('SQUEEZE',`|g(x)|≤${A},  lim x→0  x${['','','²','³','⁴','⁵','⁶'][n]}g(x)`,'주어진 유계 조건에서 극한값은?',0,[1,-1,'판정 불가'],`|x${['','','²','³','⁴','⁵','⁶'][n]}g(x)|≤${A}|x|${['','','²','³','⁴','⁵','⁶'][n]}이고 오른쪽이 0으로 갑니다.`);
      case'lhopital':
        a=nonzero(-4,4);n=pick([2,3,4]);A=Math.pow(a,n);correct=n*Math.pow(a,n-1);
        return Q('L’HÔPITAL CHECK',`lim x→${a}  (${pow('x',n)}${A>=0?`−${A}`:`+${Math.abs(A)}`})/${factor(a)}`,'로피탈 정리로 검산한 극한값은?',correct,[Math.pow(a,n-1),n*a,A],`0/0꼴이므로 분자와 분모를 각각 미분하면 ${n}${pow('x',n-1)}/1입니다. x=${a}를 대입하면 ${correct}입니다.`);
      case'derivative_definition':
        a=ri(-3,3);b=ri(-4,4);correct=2*a+b;
        return Q('DEFINITION',`f(x)=x²${tail(b,'x')},  f′(${num(a)})=?`,'미분계수는?',correct,[a+b,2*a-b,a*a+b],`f′(x)=2x${tail(b,'')}이므로 f′(${num(a)})=${num(correct)}입니다.`);
      case'differentiate_polynomial':
        A=ri(1,6);n=ri(2,5);correct=A*n;
        return Q('POWER RULE',`f(x)=${lead(A,pow('x',n))}`,'f′(1)의 값은?',correct,[A+n,A*(n-1),n],`f′(x)=${lead(A*n,pow('x',n-1))}이므로 x=1에서 ${correct}입니다.`);
      case'product_rule':
        a=nonzero(-4,4);b=nonzero(-4,4);t=ri(-2,2);correct=2*t+a+b;
        return Q('PRODUCT RULE',`f(x)=${factor(-a)}${factor(-b)}`,`f′(${num(t)})의 값은?`,correct,[t+a+b,2*t-a-b,a*b],`전개하거나 곱의 미분법을 쓰면 f′(x)=2x${tail(a+b,'')}입니다.`);
      case'tangent_equation':
        a=nonzero(-3,3);b=ri(-4,4);m=2*a;c=b-a*a;correct=lineEq(m,c);
        return Q('TANGENT',`f(x)=x²${b?sign(b):''},  x=${a}`,'접선의 방정식은?',correct,[lineEq(a,c),lineEq(m,b+a*a),lineEq(-m,c)],`접점은 (${a},${a*a+b}), 기울기는 ${m}이므로 ${correct}입니다.`);
      case'monotonic_interval':
        a=ri(-4,-1);b=ri(1,4);correct=`(−∞,${a}) ∪ (${b},∞)`;
        return Q('SIGN CHART',`f′(x)=${factor(a)}${factor(b)}`,'f가 증가하는 구간은?',correct,[`(${a},${b})`,`(−∞,${b})`,`(${a},∞)`],`위로 열린 이차식은 두 근의 바깥에서 양수이므로 ${correct}입니다.`);
      case'extrema_sign':
        a=ri(-3,3);mode=pick(['max','min']);correct=mode==='max'?'극대':'극소';
        return Q('SIGN CHANGE',`x=${a}:  f′(x)  ${mode==='max'?'+ → −':'− → +'}`,'x='+a+'에서 f의 상태는?',correct,[mode==='max'?'극소':'극대','변곡점','판정 불가'],`${mode==='max'?'증가에서 감소로':'감소에서 증가로'} 바뀌므로 ${correct}입니다.`);
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
        return Q('HORIZONTAL TANGENT',`f(x)=x³${tail(-3*k,'x')}`,'수평접선의 개수는?',correct,['0개','1개','2개'].filter(x=>x!==correct).concat(['3개']),`f′(x)=3(x²${tail(-k,'')})의 서로 다른 실근 수가 수평접선의 개수입니다.`);
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
        return Q('BETWEEN CURVES',`y=${lead(A,'x')}, y=${lead(B,'x')},  0≤x≤${c}`,'두 직선 사이 넓이는?',correct,[frac((A+B)*c*c,2),(A-B)*c,frac((A-B)*c,2)],`차이는 ${lead(A-B,'x')}이므로 0부터 ${c}까지 적분하면 ${correct}입니다.`);
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
  if(!skill){const moved=excluded[requestedId];app.innerHTML=`<div class="not-found"><h1>${moved?'미적분Ⅰ에서 분리했어요.':'계산 스킬을 찾을 수 없어요.'}</h1><p>${moved?`${moved} 내용이어서 2022 개정 미적분Ⅰ 계산 지도에서는 제외했습니다.`:'미적분 스킬 지도에서 다시 선택해 주세요.'}</p><a href="index.html#skills">미적분Ⅰ 스킬 지도로 돌아가기</a></div>`;return}
  const group=groups[skill.group];
  const BOSS_V2_CONFIGS={
    limit_factor:{name:'인수분해의 문지기',theme:'factor',art:'../assets/bosses/factor-gate-guardian.jpg',alt:'공통인수 코어와 석문 갑옷을 지닌 인수분해의 문지기',hp:2100,baseTime:42,minTime:28,baseDamage:190,mechanic:'factor-shield',gameId:'calculus-skill-boss-limit-factor',intro:'공통인수를 찾아 석문 보호막을 먼저 깨세요. 페이즈가 바뀌면 보호막이 다시 닫히며, 오답은 보호막 한 칸을 복구합니다.',start:'정답으로 보호막 3칸을 깨면 공통인수 코어가 열립니다. 열린 동안 콤보 공격으로 큰 피해를 주세요.'},
    limit_rationalize:{name:'켤레의 연금술사',theme:'conjugate',art:'../assets/bosses/conjugate-alchemist.jpg',alt:'은빛과 금빛 켤레 수정을 든 네 팔의 켤레의 연금술사',hp:2300,baseTime:40,minTime:26,baseDamage:185,mechanic:'conjugate-reflect',gameId:'calculus-skill-boss-limit-rationalize',intro:'정답으로 은빛·금빛 거울을 차례로 충전하세요. 두 거울이 모두 켜지면 켤레 반사가 발동해 큰 피해가 들어가고, 오답이면 충전이 사라지며 시간 3초를 빼앗깁니다.',start:'첫 정답은 거울을 충전하고 두 번째 연속 정답은 켤레 반사 공격이 됩니다. 두 문제씩 정확하게 연결하는 것이 핵심입니다.'},
    limit_infinity_ratio:{name:'무한비의 거신',theme:'ratio',art:'../assets/bosses/infinite-ratio-colossus.jpg',alt:'끝없이 높아지는 탑 왕관과 비율 코어를 지닌 무한비의 거신',hp:1900,baseTime:45,minTime:29,baseDamage:210,mechanic:'degree-grade',gameId:'calculus-skill-boss-limit-infinity-ratio',intro:'기본 문제는 거신의 하위 차수 갑옷에 막혀 피해가 줄어듭니다. 페이즈가 올라가 응용·심화 문제를 해결하면 B·A등급 최고차항 관통 공격이 들어갑니다.',start:'C등급 공격은 55%, B등급은 100%, A등급은 180% 피해입니다. 강해지는 문제를 정확히 해결해 공격 등급을 올리세요.'},
    limit_infinity_diff:{name:'미정형의 혼돈수',theme:'chaos',art:'../assets/bosses/indeterminate-chaos-beast.jpg',alt:'붉은 무한과 푸른 무한으로 갈라지는 미정형의 혼돈수',hp:2200,baseTime:42,minTime:27,baseDamage:178,mechanic:'chaos-split',gameId:'calculus-skill-boss-limit-infinity-diff',intro:'문제를 오래 붙잡으면 혼돈수가 분열하며 남은 시간을 빼앗습니다. 빠르게 정리해 맞히면 분신을 다시 합치고 시간을 되찾을 수 있습니다.',start:'한 몸으로 시작합니다. 페이즈별 예고 시간 안에 맞히면 융합 공격과 시간 +1초, 늦거나 틀리면 최대 네 몸까지 분열하며 더 많은 시간을 빼앗습니다.'},
    limit_one_sided:{name:'양면의 경계자',theme:'boundary',art:'../assets/bosses/two-faced-boundary-warden.jpg',alt:'인디고 좌측 가면과 금빛 우측 가면을 지닌 양면의 경계자',hp:2250,baseTime:41,minTime:27,baseDamage:165,mechanic:'side-switch',gameId:'calculus-skill-boss-limit-one-sided',intro:'문제의 접근 방향에 따라 경계자가 왼쪽 또는 오른쪽 가면을 내밉니다. 좌극한과 우극한을 번갈아 정확히 읽으면 경계 관통 공격이 발동합니다.',start:'첫 가면은 왼쪽입니다. 화면의 ← 좌극한과 우극한 → 표시를 확인하세요. 오답이면 같은 가면이 다시 봉인되고 시간 3초를 빼앗깁니다.'},
    continuity_parameter:{name:'연속의 봉합사',theme:'stitch',art:'../assets/bosses/continuity-stitcher.jpg',alt:'끊어진 청록 곡선을 금실로 꿰매는 네 팔의 연속의 봉합사',hp:2300,baseTime:42,minTime:28,baseDamage:200,regenRate:10,mechanic:'continuity-stitch',gameId:'calculus-skill-boss-continuity-parameter',intro:'상처가 열려 있는 동안 봉합사는 매초 체력을 회복합니다. 연속 조건을 세 번 연속으로 맞혀 금실 3칸을 모두 잇고 재생축을 멈추세요.',start:'정답마다 봉합 1칸, 세 번째 정답은 재생 차단과 큰 피해를 줍니다. 오답이면 봉합이 전부 뜯기고 체력이 즉시 회복됩니다.'},
    squeeze_limit:{name:'압착의 쌍벽',theme:'squeeze',art:'../assets/bosses/squeeze-twin-walls.jpg',mobileArt:'../assets/bosses/squeeze-twin-walls-mobile-v3.jpg',alt:'냉청색 상한 수호자와 황동색 하한 수호자가 중앙의 극한핵을 압착하는 쌍벽',hp:2350,baseTime:43,minTime:29,baseDamage:195,safeWindows:[5.5,4.7,4],mechanic:'squeeze-walls',gameId:'calculus-skill-boss-squeeze-limit',intro:'상한과 하한의 쌍벽이 문제마다 중앙으로 좁혀 옵니다. 두 경계가 같은 값으로 모이는 것을 시간 창 안에 읽어 벽을 밀어내세요.',start:'벽 간격은 100%에서 시작합니다. 충돌 전에 맞히면 압착 회피와 시간 +1.2초, 늦으면 쌍벽 충돌로 시간 2초를 잃고 공격력이 약해집니다.'},
    differentiate_polynomial:{name:'미분의 철갑수',theme:'iron',art:'../assets/bosses/derivative-iron-beast.webp',alt:'곡선 갑옷과 빛나는 미분 코어를 지닌 미분의 철갑수',hp:2600,baseTime:38,minTime:24,baseDamage:170,mechanic:'iron-armor',gameId:'calculus-skill-boss-differentiate-polynomial',intro:'기본 → 응용 → 심화로 문제가 강해집니다. 클리어할수록 문제는 더 어려워지는 대신 다음 전투의 시간만 2초씩 줄어듭니다.',start:'정답은 수식 공격으로 바뀝니다. 3단계까지 문제 난도가 올라가며 오답은 콤보 초기화와 시간 −2초입니다.'}
  };
  const fallbackBossNames={limit:'극한의 파수꾼',differentiate:'미분의 철갑수',graph:'그래프의 심연왕',integral:'적분의 수문장'};
  const bossConfig=BOSS_V2_CONFIGS[skill.id]||null;
  const bossV2=!!bossConfig;
  const bossName=bossConfig?bossConfig.name:fallbackBossNames[skill.group];
  const BOSS_V2_HP=bossConfig?.hp||2600,BOSS_V2_BASE_TIME=bossConfig?.baseTime||38,BOSS_V2_MIN_TIME=bossConfig?.minTime||24;
  const bossIntro=bossV2?bossConfig.intro:'세 번 공격해 보스의 체력을 모두 깎으세요. 클리어마다 문제 제한시간이 0.5초씩 줄어듭니다.';
  const bossStartCopy=bossV2?`<strong>HP ${BOSS_V2_HP} · 첫 제한시간 ${BOSS_V2_BASE_TIME}초</strong><p>${bossConfig.start}</p>`:'<strong>보스 체력 3칸</strong><p>정답은 한 칸 공격, 오답이나 시간 초과는 보스 체력을 전부 회복시킵니다.</p>';
  const initialBossStateLabel=bossConfig?.mechanic==='factor-shield'?'SHIELD':bossConfig?.mechanic==='conjugate-reflect'?'MIRROR':bossConfig?.mechanic==='degree-grade'?'GRADE':bossConfig?.mechanic==='chaos-split'?'BODIES':bossConfig?.mechanic==='side-switch'?'방향':bossConfig?.mechanic==='continuity-stitch'?'봉합':bossConfig?.mechanic==='squeeze-walls'?'벽 간격':'PHASE';
  const initialBossStateValue=bossConfig?.mechanic==='factor-shield'?3:bossConfig?.mechanic==='conjugate-reflect'?'0/2':bossConfig?.mechanic==='degree-grade'?'C':bossConfig?.mechanic==='side-switch'?'← 좌':bossConfig?.mechanic==='continuity-stitch'?'0/3':bossConfig?.mechanic==='squeeze-walls'?'100%':1;
  const bossPicture=bossV2&&bossConfig.mobileArt?`<picture class="boss-art-picture"><source media="(max-width:700px)" srcset="${bossConfig.mobileArt}"><img class="boss-art" src="${bossConfig.art}" alt="${bossConfig.alt}"></picture>`:bossV2?`<img class="boss-art" src="${bossConfig.art}" alt="${bossConfig.alt}">`:'';
  const bossVisual=bossV2?`<div class="boss-art-frame">${bossPicture}</div>`:'<svg class="boss-creature" viewBox="0 0 240 190" role="img" aria-hidden="true"><path class="boss-wing" d="M73 73C36 44 16 62 27 91c8 22 29 30 52 27M167 73c37-29 57-11 46 18-8 22-29 30-52 27"/><path class="boss-horn" d="M86 50 63 16l42 23M154 50l23-34-42 23"/><path class="boss-body-shape" d="M120 34c-45 0-70 31-64 75 5 39 27 64 64 64s59-25 64-64c6-44-19-75-64-75Z"/><path class="boss-mask" d="M76 78c29-17 59-17 88 0l-11 47c-22 17-44 17-66 0Z"/><path class="boss-eye" d="m88 87 23 8-25 7Zm64 0-23 8 25 7Z"/><path class="boss-core" d="m120 117 13 18-13 15-13-15Z"/></svg>';
  const levelBar=hasLevels(skill.id)?`<div class="skill-level-bar">
      <span class="skill-level-label">난이도</span>
      <div class="skill-level-seg" role="group" aria-label="난이도 선택">${LEVELS.map(l=>`<button type="button" class="skill-level-btn${l.id===currentLevel?' active':''}" data-level="${l.id}" aria-pressed="${l.id===currentLevel}"><b>${l.name}</b><small>${l.tag}</small></button>`).join('')}</div>
      <p class="skill-level-desc" data-level-desc>${LEVELS.find(l=>l.id===currentLevel).desc}</p>
    </div>`:'';
  document.documentElement.style.setProperty('--skill',group.color);
  document.documentElement.style.setProperty('--skill-dark',group.dark);
  document.title=`${skill.title} · 미적분 계산 스킬`;
  app.innerHTML=`<div class="calc-skill-page">
    <nav class="skill-nav"><div class="skill-nav-inner"><a class="skill-back" href="index.html#skills-${skill.group}" aria-label="스킬 지도로 돌아가기">←</a><button class="skill-tab active" data-tab="concept"><span>01</span>원리</button><button class="skill-tab" data-tab="drill"><span>02</span>5문제</button><button class="skill-tab rush" data-tab="rush"><span>03</span>60초</button><button class="skill-tab boss" data-tab="boss"><span>04</span>보스</button></div></nav>${levelBar}
    <main class="skill-wrap">
      <section data-panel="concept">
        <header class="skill-hero"><div><p class="skill-kicker">${skill.code} · ${group.name}</p><h1>${skill.title}</h1><p>${skill.desc}</p></div><div class="mastery-card"><span>MASTERY</span><strong data-stars>☆☆☆</strong><small>5문제 · 러시 · 보스</small></div></header>
        <div class="rule-strip"><span>CORE RULE</span><strong>${skill.formula}</strong><em>${skill.tag}</em></div>
        <div class="concept-layout"><div class="formula-card"><div><div class="formula-orbit"><div class="formula-main">${skill.formula}</div></div><p>식을 외우기 전에 계산 순서를 고정하세요.</p></div></div><aside class="routine-card"><h2>3단계 계산 루틴</h2><div class="routine-list">${skill.routine.map((x,i)=>`<div class="routine-step"><span>${i+1}</span><div><b>${x}</b><small>${i===0?'문제의 형태를 먼저 읽습니다.':i===1?'핵심 변형을 한 줄씩 적용합니다.':'마지막에 값과 조건을 확인합니다.'}</small></div></div>`).join('')}</div><div class="trap-box"><span>COMMON TRAP</span><p>${skill.trap}</p></div><div class="example-box"><div class="example-label">QUICK EXAMPLE</div><div class="example-equation" data-example-equation></div><div class="example-prompt" data-example-prompt></div><div class="example-answer hidden" data-example-answer></div><div class="example-actions"><button data-new-example>새 예시</button><button data-reveal-example>정답 보기</button></div></div></aside></div>
        <div class="launch-row"><button class="launch-card" data-open="drill"><span>5 QUESTIONS</span><b>정확도 훈련</b><small>다섯 문제로 계산 루틴을 고정합니다.</small></button><button class="launch-card hot" data-open="rush"><span>60 SECOND RUSH</span><b>시간 압박 훈련</b><small>콤보 점수와 2초 페널티가 적용됩니다.</small></button><button class="launch-card dark" data-open="boss"><span>SCALING BOSS</span><b>제한시간 보스전</b><small>클리어할수록 다음 보스의 제한시간이 짧아집니다.</small></button></div>
      </section>
      <section class="hidden" data-panel="drill"><header class="mode-header"><div><p class="skill-kicker">ACCURACY DRILL</p><h1>${skill.title} 5문제</h1><p>천천히 계산하고, 틀린 이유까지 확인하세요.</p></div><div class="mode-stat"><span>BEST</span><strong data-drill-best>0 / 5</strong></div></header><div class="question-shell"><div data-drill-start-copy><div class="boss-start-copy"><strong>준비됐나요?</strong><p>보기 중 정답을 고르면 바로 해설이 나옵니다.</p></div><button class="primary-action" data-drill-start>5문제 시작</button></div><div class="hidden" data-drill-play><div class="question-topline"><span data-drill-type>TYPE</span><span data-drill-progress>1 / 5</span></div><div class="question-equation" data-drill-equation></div><div class="question-prompt" data-drill-prompt></div><div class="answer-grid" data-drill-answers></div><div class="answer-feedback hidden" data-drill-feedback></div></div><div class="result-card hidden" data-drill-result></div></div></section>
      <section class="hidden" data-panel="rush"><header class="mode-header"><div><p class="skill-kicker">60 SECOND RUSH</p><h1>${skill.title} 러시</h1><p>빠른 판단과 정확한 계산을 함께 훈련합니다.</p></div><div class="mode-stat"><span>HIGH SCORE</span><strong data-rush-best>0</strong></div></header><div class="rush-stage"><div class="rush-hud"><div><span>TIME</span><strong data-rush-time>60.0</strong></div><div><span>SCORE</span><strong data-rush-score>0</strong></div><div><span>COMBO</span><strong data-rush-combo>×1.0</strong></div></div><div class="rush-track"><div data-rush-bar></div></div><div class="rush-question" data-rush-question><div class="rush-ready">⚡</div><h2>60초 러시</h2><p>오답은 2초가 줄어듭니다.</p></div><div class="answer-grid" data-rush-answers></div><button class="primary-action" data-rush-start>러시 시작</button><div class="result-card hidden" data-rush-result></div><div class="rush-flash" data-rush-flash></div></div></section>
      <section class="hidden" data-panel="boss"><header class="mode-header"><div><p class="skill-kicker">${bossV2?'BOSS BATTLE 2.2':'TIMED BOSS BATTLE'}</p><h1>${skill.title} 보스전</h1><p>${bossIntro}</p></div><div class="mode-stat"><span>CLEARS</span><strong data-boss-clears>0</strong></div></header><div class="boss-stage${bossV2?` boss-v2 boss-${bossConfig.theme}`:''}" data-boss-stage><div class="boss-arena"><div class="boss-fx-layer" data-boss-fx aria-hidden="true"></div><div class="boss-monster" data-boss-monster aria-label="${bossName}"><div class="boss-aura"></div>${bossVisual}<strong>${bossName}</strong><span data-boss-mood>도전자를 기다리는 중</span></div><div class="boss-dashboard"><div class="boss-hp-label"><span>BOSS HP</span><strong data-boss-hp-text>${bossV2?`${BOSS_V2_HP} / ${BOSS_V2_HP}`:'3 / 3'}</strong></div><div class="boss-hp-track"><div data-boss-hp></div></div><div class="boss-clock"><span>남은 시간</span><strong data-boss-time>${bossV2?`${BOSS_V2_BASE_TIME}.0`:'12.0'}</strong><em>SEC</em></div><div class="boss-timer-track"><div data-boss-timer></div></div>${bossV2?`<div class="boss-combat-stats"><div><span>DAMAGE</span><b data-boss-damage>0</b></div><div><span>COMBO</span><b data-boss-combo>×1.0</b></div><div><span data-boss-state-label>${initialBossStateLabel}</span><b data-boss-phase>${initialBossStateValue}</b></div></div><small class="boss-limit-copy">난도 상승: <b>기본 → 응용 → 심화</b></small>`:'<small class="boss-limit-copy">현재 문제당 <b data-boss-limit>12.0초</b> · 최소 7초</small>'}</div></div><div class="boss-progress"><i class="boss-node"></i><i class="boss-node"></i><i class="boss-node"></i></div><div data-boss-body><div class="boss-start-copy">${bossStartCopy}</div></div><div class="boss-status hidden" data-boss-status></div><button class="primary-action boss-action" data-boss-start>⚔ ${bossV2?`${BOSS_V2_BASE_TIME}초 전투 시작`:'보스전 시작'}</button></div></section>
    </main></div>`;

  const storageKey=`jp-calc-skill-${skill.id}`;
  let saved={drillBest:0,rushBest:0,bossClears:0,level:'basic',byLevel:null};
  try{saved={...saved,...JSON.parse(localStorage.getItem(storageKey)||'{}')}}catch(e){}
  // 난이도가 생기기 전의 기록은 기본 난이도 기록으로 옮긴다
  if(!saved.byLevel||typeof saved.byLevel!=='object'){
    saved.byLevel={basic:{drillBest:saved.drillBest||0,rushBest:saved.rushBest||0,bossClears:saved.bossClears||0}};
  }
  if(!hasLevels(skill.id))saved.level='basic';
  currentLevel=LEVELS.some(l=>l.id===saved.level)?saved.level:'basic';
  const rec=()=>(saved.byLevel[currentLevel]||(saved.byLevel[currentLevel]={drillBest:0,rushBest:0,bossClears:0}));
  const currentBossLimit=()=>Math.max(7,12-rec().bossClears*.5);
  const currentBossV2Limit=()=>Math.max(BOSS_V2_MIN_TIME,BOSS_V2_BASE_TIME-(rec().bossClears||0)*2);
  const telemetry=window.JPGameTelemetry||null;
  const bossSessionId=telemetry?telemetry.makeSessionId():'';
  let bossSessionPlayIndex=0,bossActivePlay=null;
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(saved))}catch(e){}}
  function updateStats(){
    const r=rec();
    $('[data-drill-best]').textContent=`${r.drillBest} / 5`;
    $('[data-rush-best]').textContent=r.rushBest;
    $('[data-boss-clears]').textContent=r.bossClears;
    const limitNode=$('[data-boss-limit]');if(limitNode)limitNode.textContent=`${currentBossLimit().toFixed(1)}초`;
    const stars=(r.drillBest===5?1:0)+(r.rushBest>=800?1:0)+(r.bossClears>0?1:0);
    $('[data-stars]').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);
  }
  let rush={running:false,raf:0};
  function showPanel(name){
    if(name!=='rush'&&rush.running){rush.running=false;cancelAnimationFrame(rush.raf)}
    if(name!=='boss'&&boss.running)stopBossTimer();
    $$('[data-panel]').forEach(p=>p.classList.toggle('hidden',p.dataset.panel!==name));
    $$('.skill-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
    window.scrollTo({top:0,behavior:'smooth'});
  }
  $$('.skill-tab').forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.tab)));
  $$('[data-open]').forEach(b=>b.addEventListener('click',()=>showPanel(b.dataset.open)));

  const setMath=(el,value)=>{el.textContent=String(value);if(window.JPMath)window.JPMath.render(el)};
  let example;
  function newExample(){example=makeQuestion(skill.id);setMath($('[data-example-equation]'),example.equation);$('[data-example-prompt]').textContent=example.prompt;$('[data-example-answer]').textContent=`정답: ${example.correct} · ${example.explanation}`;$('[data-example-answer]').classList.add('hidden')}
  $('[data-new-example]').addEventListener('click',newExample);
  $('[data-reveal-example]').addEventListener('click',()=>$('[data-example-answer]').classList.remove('hidden'));
  newExample();
  function fillAnswers(box,q,handler){box.innerHTML='';q.choices.forEach(v=>{const b=document.createElement('button');b.className='answer-btn';b.dataset.value=String(v);setMath(b,v);b.addEventListener('click',()=>handler(v,b));box.appendChild(b)})}
  function markAnswers(box,q,selected,btn){$$('.answer-btn',box).forEach(x=>{x.disabled=true;if(x.dataset.value===q.correct)x.classList.add('correct')});if(String(selected)!==q.correct&&btn)btn.classList.add('wrong')}

  let drill={index:0,correct:0,q:null};
  function startDrill(){drill={index:0,correct:0,q:null};$('[data-drill-start-copy]').classList.add('hidden');$('[data-drill-result]').classList.add('hidden');$('[data-drill-play]').classList.remove('hidden');nextDrill()}
  function nextDrill(){if(drill.index>=5){finishDrill();return}drill.q=makeQuestion(skill.id);$('[data-drill-type]').textContent=drill.q.type;$('[data-drill-progress]').textContent=`${drill.index+1} / 5`;setMath($('[data-drill-equation]'),drill.q.equation);$('[data-drill-prompt]').textContent=drill.q.prompt;$('[data-drill-feedback]').className='answer-feedback hidden';const box=$('[data-drill-answers]');fillAnswers(box,drill.q,(v,b)=>{const ok=String(v)===drill.q.correct;markAnswers(box,drill.q,v,b);if(ok)drill.correct++;const f=$('[data-drill-feedback]');f.textContent=(ok?'정답! ':'다시 기억하기: ')+drill.q.explanation;f.className=`answer-feedback ${ok?'good':'bad'}`;drill.index++;setTimeout(nextDrill,650)})}
  function finishDrill(){rec().drillBest=Math.max(rec().drillBest,drill.correct);save();updateStats();$('[data-drill-play]').classList.add('hidden');const b=$('[data-drill-result]');b.innerHTML=`<strong>${drill.correct} / 5</strong><p>${drill.correct===5?'정확도 훈련 완료! 이제 시간 압박에 도전하세요.':drill.correct>=3?'좋습니다. 한 번 더 풀어 완성도를 높여보세요.':'원리 탭에서 계산 순서를 다시 확인하세요.'}</p><button data-retry>다시 훈련</button>`;b.classList.remove('hidden');if(window.jpMotionFeedback)window.jpMotionFeedback('success',`5문제 훈련 완료 · ${drill.correct}문제 정답`);$('[data-retry]',b).addEventListener('click',startDrill)}
  $('[data-drill-start]').addEventListener('click',startDrill);

  function startRush(){rush={running:true,time:60,score:0,combo:0,correct:0,q:null,last:performance.now(),raf:0};$('[data-rush-start]').classList.add('hidden');$('[data-rush-result]').classList.add('hidden');nextRush();rush.raf=requestAnimationFrame(tickRush)}
  function tickRush(now){if(!rush.running)return;rush.time=Math.max(0,rush.time-(now-rush.last)/1000);rush.last=now;renderRush();if(rush.time<=0){finishRush();return}rush.raf=requestAnimationFrame(tickRush)}
  function renderRush(){$('[data-rush-time]').textContent=rush.time.toFixed(1);$('[data-rush-score]').textContent=rush.score;$('[data-rush-combo]').textContent=`×${(1+Math.floor(rush.combo/3)*.5).toFixed(1)}`;$('[data-rush-bar]').style.width=`${rush.time/60*100}%`}
  function nextRush(){if(!rush.running)return;rush.q=makeQuestion(skill.id);$('[data-rush-question]').innerHTML=`<div class="rush-eq"></div><div class="rush-prompt"></div>`;setMath($('.rush-eq'),rush.q.equation);$('.rush-prompt').textContent=rush.q.prompt;fillAnswers($('[data-rush-answers]'),rush.q,v=>{if(!rush.running)return;const ok=String(v)===rush.q.correct;if(ok){rush.combo++;rush.correct++;rush.score+=100+Math.min(300,rush.combo*20)}else{rush.combo=0;rush.time=Math.max(0,rush.time-2)}flashRush(ok);renderRush();nextRush()})}
  function flashRush(ok){const f=$('[data-rush-flash]');f.textContent=ok?'+ SCORE':'− 2 SEC';f.className=`rush-flash show ${ok?'good':'bad'}`;setTimeout(()=>f.className='rush-flash',330)}
  function finishRush(){if(!rush.running)return;rush.running=false;cancelAnimationFrame(rush.raf);rec().rushBest=Math.max(rec().rushBest,rush.score);save();updateStats();$('[data-rush-answers]').innerHTML='';$('[data-rush-question]').innerHTML='<div class="rush-ready">🏁</div><h2>러시 종료!</h2>';const b=$('[data-rush-result]');b.innerHTML=`<strong>${rush.score}점</strong><p>${rush.correct}문제 성공 · 최고 기록 ${rec().rushBest}점</p><button data-retry>다시 도전</button>`;b.classList.remove('hidden');if(window.jpMotionFeedback)window.jpMotionFeedback('success',`60초 러시 종료 · ${rush.score}점`);$('[data-retry]',b).addEventListener('click',startRush)}
  $('[data-rush-start]').addEventListener('click',startRush);

  let boss={running:false,raf:0,index:0,questions:[],time:12,limit:12,last:0};
  function stopBossTimer(){boss.running=false;cancelAnimationFrame(boss.raf)}
  function renderBossHud(){
    const stage=$('[data-boss-stage]');
    if(bossV2){
      const hp=Math.max(0,boss.hp);$('[data-boss-hp]').style.width=`${hp/boss.maxHp*100}%`;$('[data-boss-hp-text]').textContent=`${hp} / ${boss.maxHp}`;$('[data-boss-time]').textContent=boss.time.toFixed(1);$('[data-boss-timer]').style.width=`${boss.time/boss.limit*100}%`;
      $('[data-boss-damage]').textContent=boss.damage;$('[data-boss-combo]').textContent=`×${bossMultiplier().toFixed(2)}`;
      const shieldBattle=bossConfig.mechanic==='factor-shield',reflectBattle=bossConfig.mechanic==='conjugate-reflect',gradeBattle=bossConfig.mechanic==='degree-grade',chaosBattle=bossConfig.mechanic==='chaos-split',sideBattle=bossConfig.mechanic==='side-switch',stitchBattle=bossConfig.mechanic==='continuity-stitch',squeezeBattle=bossConfig.mechanic==='squeeze-walls',wallGap=Number.isFinite(boss.wallGap)?boss.wallGap:100;$('[data-boss-state-label]').textContent=shieldBattle?'SHIELD':reflectBattle?'MIRROR':gradeBattle?'GRADE':chaosBattle?'BODIES':sideBattle?'방향':stitchBattle?'봉합':squeezeBattle?'벽 간격':'PHASE';$('[data-boss-phase]').textContent=shieldBattle?boss.shield:reflectBattle?`${boss.reflectCharge}/2`:gradeBattle?boss.attackGrade:chaosBattle?boss.splitCount:sideBattle?(boss.targetSide==='right'?'우 →':'← 좌'):stitchBattle?`${boss.stitches}/3`:squeezeBattle?`${Math.round(wallGap)}%`:boss.phase;
      stage.classList.toggle('boss-reflect-ready',reflectBattle&&boss.reflectCharge===1);
      stage.classList.toggle('boss-chaos-split',chaosBattle&&boss.splitCount>1);if(chaosBattle)stage.dataset.bodies=String(boss.splitCount);else delete stage.dataset.bodies;
      stage.classList.toggle('boss-side-left',sideBattle&&boss.targetSide!=='right');stage.classList.toggle('boss-side-right',sideBattle&&boss.targetSide==='right');
      stage.classList.toggle('boss-stitch-sealed',stitchBattle&&boss.stitches===3);stage.classList.toggle('boss-regenerating',stitchBattle&&boss.stitches<3&&boss.running);
      stage.classList.toggle('boss-walls-danger',squeezeBattle&&wallGap<=35&&boss.running);stage.classList.toggle('boss-walls-crushed',squeezeBattle&&boss.wallCrushed);if(squeezeBattle){const wallShift=8+Math.max(0,Math.min(100,wallGap))*.97;stage.style.setProperty('--wall-left',`-${wallShift}%`);stage.style.setProperty('--wall-right',`${wallShift}%`)}
      stage.classList.toggle('boss-danger',boss.time<=8&&boss.running);stage.classList.toggle('boss-phase-two',boss.phase===2);stage.classList.toggle('boss-phase-three',boss.phase===3);
      const clearedRatio=1-hp/boss.maxHp;$$('.boss-node').forEach((node,index)=>node.className='boss-node '+(clearedRatio>=(index+1)/3?'done':clearedRatio>=index/3?'active':''));
      return;
    }
    const hp=Math.max(0,3-boss.index);$('[data-boss-hp]').style.width=`${hp/3*100}%`;$('[data-boss-hp-text]').textContent=`${hp} / 3`;$('[data-boss-time]').textContent=boss.time.toFixed(1);$('[data-boss-timer]').style.width=`${boss.limit?boss.time/boss.limit*100:0}%`;stage.classList.toggle('boss-danger',boss.time<=Math.min(4,boss.limit*.34)&&boss.running)
  }
  function bossMultiplier(){return 1+Math.min(1.5,Math.floor(Math.max(0,boss.combo-1)/3)*.25)}
  function bossQuestionLevel(){return boss.phase===3?'deep':boss.phase===2?'applied':'basic'}
  function squeezeSafeWindow(){return bossConfig?.safeWindows?.[Math.max(0,Math.min(2,boss.phase-1))]||5}
  function startBoss(){
    if(bossV2){startBossV2();return}
    stopBossTimer();const limit=currentBossLimit();boss={running:false,raf:0,index:0,questions:Array.from({length:3},()=>makeQuestion(skill.id)),time:limit,limit,last:0};$('[data-boss-limit]').textContent=`${limit.toFixed(1)}초`;const monster=$('[data-boss-monster]');monster.classList.remove('boss-hit','boss-attack','boss-defeated');$('[data-boss-mood]').textContent='체력을 모두 깎아 보세요';$('[data-boss-start]').classList.add('hidden');$('[data-boss-status]').className='boss-status hidden';renderBoss()
  }
  function startBossV2(){
    stopBossTimer();bossSessionPlayIndex++;const limit=currentBossV2Limit();boss={running:true,raf:0,time:limit,limit,last:performance.now(),hp:BOSS_V2_HP,maxHp:BOSS_V2_HP,damage:0,combo:0,correct:0,attempts:0,phase:1,shield:bossConfig.mechanic==='factor-shield'?3:0,reflectCharge:0,attackGrade:'C',splitCount:1,nextSide:'left',targetSide:'left',lastSide:null,boundaryStreak:0,stitches:0,regenBuffer:0,healed:0,reopenOnNext:false,wallGap:100,wallCrushed:false,wallEscapes:0,questionStartedAt:0,q:null,locked:false};
    rec().bossAttempts=(rec().bossAttempts||0)+1;save();
    bossActivePlay=telemetry?telemetry.startPlay({gameId:bossConfig.gameId,sessionId:bossSessionId,retry:bossSessionPlayIndex>1,sessionPlayIndex:bossSessionPlayIndex,dateKey:new Date().toISOString().slice(0,10)}):null;
    const monster=$('[data-boss-monster]');monster.classList.remove('boss-hit','boss-attack','boss-defeated');$('[data-boss-mood]').textContent=bossConfig.mechanic==='factor-shield'?'석문 보호막 3칸':bossConfig.mechanic==='conjugate-reflect'?'거울 충전 0 / 2':bossConfig.mechanic==='degree-grade'?'하위 차수 장갑 · C GRADE':bossConfig.mechanic==='chaos-split'?'혼돈 코어 안정 · 1 BODY':bossConfig.mechanic==='side-switch'?'왼쪽 가면 봉인 · ← 좌극한':bossConfig.mechanic==='continuity-stitch'?'재생축 가동 · 봉합 0/3':bossConfig.mechanic==='squeeze-walls'?'상·하한 벽 전개 · 간격 100%':'기본 방어 · PHASE 1';$('[data-boss-start]').classList.add('hidden');$('[data-boss-status]').className='boss-status hidden';renderBossV2();renderBossHud();boss.raf=requestAnimationFrame(tickBoss)
  }
  function startBossTimer(){stopBossTimer();boss.running=true;boss.last=performance.now();boss.raf=requestAnimationFrame(tickBoss)}
  function tickBoss(now){if(!boss.running)return;const elapsed=(now-boss.last)/1000;boss.time=Math.max(0,boss.time-elapsed);boss.last=now;if(bossV2&&bossConfig.mechanic==='continuity-stitch'&&boss.stitches<3&&boss.hp<boss.maxHp){boss.regenBuffer+=elapsed;if(boss.regenBuffer>=1){const ticks=Math.floor(boss.regenBuffer),heal=ticks*(bossConfig.regenRate+Math.max(0,boss.phase-1)*2);boss.regenBuffer-=ticks;const actual=Math.min(heal,boss.maxHp-boss.hp);boss.hp+=actual;boss.healed+=actual;if(actual>0)launchBossHealFx(actual)}}if(bossV2&&bossConfig.mechanic==='squeeze-walls'&&boss.questionStartedAt&&!boss.wallCrushed){const questionElapsed=(now-boss.questionStartedAt)/1000,windowLimit=squeezeSafeWindow();boss.wallGap=Math.max(0,100-questionElapsed/windowLimit*100);if(boss.wallGap<=0){boss.wallCrushed=true;boss.time=Math.max(0,boss.time-2);const stage=$('[data-boss-stage]'),monster=$('[data-boss-monster]');stage.classList.add('boss-wall-slam');monster.classList.remove('boss-hit');monster.classList.add('boss-attack');$('[data-boss-mood]').textContent='쌍벽 충돌 · 시간 −2초';launchBossFx(false,0,2);setTimeout(()=>{stage.classList.remove('boss-wall-slam');monster.classList.remove('boss-attack')},620)}}renderBossHud();if(boss.time<=0){if(bossV2)finishBossV2(false);else resolveBoss(null,null,true);return}boss.raf=requestAnimationFrame(tickBoss)}
  function renderBoss(){const q=boss.questions[boss.index];boss.time=boss.limit;$$('.boss-node').forEach((x,i)=>x.className='boss-node '+(i<boss.index?'done':i===boss.index?'active':''));const body=$('[data-boss-body]');body.innerHTML='<div class="question-equation"></div><div class="question-prompt"></div><div class="answer-grid"></div>';setMath($('div.question-equation',body),q.equation);$('div.question-prompt',body).textContent=q.prompt;const box=$('.answer-grid',body);fillAnswers(box,q,(v,b)=>resolveBoss(v,b,false));$('[data-boss-mood]').textContent=`${boss.index+1}번째 공격을 막는 중`;renderBossHud();startBossTimer()}
  function renderBossV2(){
    if(!boss.running)return;boss.locked=false;const level=bossQuestionLevel(),sideBattle=bossConfig.mechanic==='side-switch',stitchBattle=bossConfig.mechanic==='continuity-stitch',squeezeBattle=bossConfig.mechanic==='squeeze-walls';if(stitchBattle&&boss.reopenOnNext){boss.stitches=0;boss.reopenOnNext=false;boss.regenBuffer=0}if(squeezeBattle){boss.wallGap=100;boss.wallCrushed=false}$('[data-boss-stage]').classList.remove('boss-stitch-complete','boss-wall-slam');boss.q=makeQuestion(skill.id,level,sideBattle?boss.nextSide:null);if(sideBattle)boss.targetSide=boss.q.side||boss.nextSide;boss.attackGrade=level==='deep'?'A':level==='applied'?'B':'C';boss.questionStartedAt=performance.now();const levelName=LEVELS.find(l=>l.id===level).name,directionCue=sideBattle?` · ${boss.targetSide==='left'?'← 좌극한':'우극한 →'}`:stitchBattle?` · 금실 ${boss.stitches}/3`:squeezeBattle?` · 압착 ${squeezeSafeWindow().toFixed(1)}초`:'';const body=$('[data-boss-body]');body.innerHTML=`<div class="question-topline"><span>PHASE ${boss.phase} · ${levelName} 문제${directionCue}</span><span data-live-combo></span></div><div class="question-equation"></div><div class="question-prompt"></div><div class="answer-grid"></div>`;
    setMath($('div.question-equation',body),boss.q.equation);$('div.question-prompt',body).textContent=boss.q.prompt;$('[data-live-combo]').textContent=`COMBO ${boss.combo}`;const box=$('.answer-grid',body);fillAnswers(box,boss.q,(v,b)=>resolveBossV2(v,b));renderBossHud();
  }
  function resolveBoss(value,button,timedOut){if(!boss.running)return;stopBossTimer();const q=boss.questions[boss.index],box=$('.answer-grid',$('[data-boss-body]')),ok=!timedOut&&String(value)===q.correct;markAnswers(box,q,value,button);const st=$('[data-boss-status]'),monster=$('[data-boss-monster]');if(ok){boss.index++;monster.classList.remove('boss-attack');monster.classList.add('boss-hit');$('[data-boss-mood]').textContent='공격 적중!';st.textContent=`보스 체력 −1! ${q.explanation}`;st.className='boss-status good';renderBossHud();setTimeout(()=>{monster.classList.remove('boss-hit');if(boss.index>=3)clearBoss();else{st.className='boss-status hidden';renderBoss()}},850)}else{monster.classList.remove('boss-hit');monster.classList.add('boss-attack');$('[data-boss-mood]').textContent=timedOut?'시간을 빼앗았습니다':'반격 성공';st.textContent=`${timedOut?'시간 초과!':'오답!'} 보스의 체력이 회복됩니다. ${q.explanation}`;st.className='boss-status bad';boss.index=0;renderBossHud();$$('.boss-node').forEach(x=>x.className='boss-node');const start=$('[data-boss-start]');start.textContent='↻ 처음부터 재도전';start.classList.remove('hidden')}}
  function launchBossFx(ok,damage,penalty=2){
    const layer=$('[data-boss-fx]');if(!layer)return;
    const shot=document.createElement('i'),impact=document.createElement('b');
    shot.className=`boss-projectile ${ok?'player-strike':'boss-counter'}`;shot.textContent=ok?(bossConfig?.mechanic==='factor-shield'?'(x−a)':bossConfig?.mechanic==='conjugate-reflect'?'√±':bossConfig?.mechanic==='degree-grade'?'∞/∞':bossConfig?.mechanic==='chaos-split'?'∞−∞':bossConfig?.mechanic==='side-switch'?(boss.q?.side==='left'?'←':'→'):bossConfig?.mechanic==='continuity-stitch'?'∪':bossConfig?.mechanic==='squeeze-walls'?'≤·≤':pick(['f′','Δx','dy','∫'])):'×';
    impact.className=`boss-impact ${ok?'player-impact':'counter-impact'}`;impact.textContent=ok?`−${damage}`:`−${penalty}초`;
    layer.append(shot,impact);setTimeout(()=>{shot.remove();impact.remove()},900);
  }
  function launchBossHealFx(amount){
    const layer=$('[data-boss-fx]'),stage=$('[data-boss-stage]');if(!layer||!amount)return;const impact=document.createElement('b');impact.className='boss-impact boss-heal-impact';impact.textContent=`+${amount} HP`;layer.append(impact);stage.classList.remove('boss-heal-pulse');void stage.offsetWidth;stage.classList.add('boss-heal-pulse');setTimeout(()=>{impact.remove();stage.classList.remove('boss-heal-pulse')},820)
  }
  function resolveBossV2(value,button){
    if(!boss.running||boss.locked)return;boss.locked=true;boss.attempts++;const q=boss.q,box=$('.answer-grid',$('[data-boss-body]')),ok=String(value)===q.correct,answerSeconds=(performance.now()-boss.questionStartedAt)/1000;markAnswers(box,q,value,button);const st=$('[data-boss-status]'),monster=$('[data-boss-monster]');
    if(ok){
      boss.combo++;boss.correct++;
      const shieldBattle=bossConfig.mechanic==='factor-shield',reflectBattle=bossConfig.mechanic==='conjugate-reflect',gradeBattle=bossConfig.mechanic==='degree-grade',chaosBattle=bossConfig.mechanic==='chaos-split',sideBattle=bossConfig.mechanic==='side-switch',stitchBattle=bossConfig.mechanic==='continuity-stitch',squeezeBattle=bossConfig.mechanic==='squeeze-walls',breakingShield=shieldBattle&&boss.shield>0,reflecting=reflectBattle&&boss.reflectCharge===1,chaosLimit=boss.phase===3?3.5:boss.phase===2?4.1:4.8,fastFusion=chaosBattle&&answerSeconds<=chaosLimit,boundaryCrossing=sideBattle&&boss.lastSide&&boss.lastSide!==q.side,completingStitch=stitchBattle&&boss.stitches===2,withinSqueezeWindow=squeezeBattle&&!boss.wallCrushed&&answerSeconds<=squeezeSafeWindow();
      if(breakingShield)boss.shield--;if(reflectBattle)boss.reflectCharge=reflecting?0:1;
      let chaosPenalty=0;if(chaosBattle){if(fastFusion){boss.splitCount=Math.max(1,boss.splitCount-1);boss.time=Math.min(boss.limit,boss.time+1)}else{boss.splitCount=Math.min(4,boss.splitCount+1);chaosPenalty=boss.splitCount;boss.time=Math.max(0,boss.time-chaosPenalty)}}
      if(sideBattle){boss.boundaryStreak++;boss.lastSide=q.side;boss.nextSide=q.side==='left'?'right':'left'}
      if(stitchBattle)boss.stitches=Math.min(3,boss.stitches+1);
      if(squeezeBattle&&withinSqueezeWindow){boss.wallEscapes++;boss.wallGap=100;boss.time=Math.min(boss.limit,boss.time+1.2);$('[data-boss-stage]').classList.add('boss-wall-repel')}
      const gradeMultiplier=gradeBattle?(q.level==='deep'?1.8:q.level==='applied'?1:.55):1;
      const hit=Math.max(1,Math.round((breakingShield?70:reflectBattle?(reflecting?bossConfig.baseDamage*2.15:85):chaosBattle?bossConfig.baseDamage*(fastFusion?1.35:.72):sideBattle?bossConfig.baseDamage*(boundaryCrossing?1.7:.8):stitchBattle?bossConfig.baseDamage*(completingStitch?2.7:.8):squeezeBattle?bossConfig.baseDamage*(withinSqueezeWindow?1.35:.65):bossConfig.baseDamage*gradeMultiplier)*bossMultiplier()));
      const nextHp=boss.hp-hit;boss.hp=stitchBattle&&!completingStitch?Math.max(1,nextHp):Math.max(0,nextHp);boss.damage+=hit;launchBossFx(true,hit);monster.classList.remove('boss-attack');monster.classList.add('boss-hit');if(sideBattle)$('[data-boss-stage]').classList.toggle('boss-boundary-cross',!!boundaryCrossing);if(stitchBattle&&completingStitch)$('[data-boss-stage]').classList.add('boss-stitch-complete');
      st.textContent=breakingShield?`보호막 파괴 · ${boss.shield}칸 남음 · ${q.explanation}`:reflectBattle?(reflecting?`켤레 반사! ${hit} DAMAGE · ${q.explanation}`:`첫 거울 충전 · 다음 정답이 반사 공격이 됩니다. · ${q.explanation}`):gradeBattle?`${boss.attackGrade}등급 ${boss.attackGrade==='A'?'최고차항 관통':boss.attackGrade==='B'?'정규 공격':'감쇠 공격'} · ${hit} DAMAGE · ${q.explanation}`:chaosBattle?(fastFusion?`빠른 융합! ${answerSeconds.toFixed(1)}초 · ${hit} DAMAGE · 시간 +1초 · ${boss.splitCount} ${boss.splitCount===1?'BODY':'BODIES'}`:`분열 발생 · ${answerSeconds.toFixed(1)}초 · ${hit} DAMAGE · 시간 −${chaosPenalty}초 · ${boss.splitCount} BODIES`):sideBattle?(boundaryCrossing?`경계 관통! ${q.side==='left'?'우→좌':'좌→우'} · ${hit} DAMAGE · ${q.explanation}`:`${q.side==='left'?'왼쪽':'오른쪽'} 가면 파괴 · ${hit} DAMAGE · ${q.explanation}`):stitchBattle?(completingStitch?`봉합 완료! 재생 차단 · ${hit} DAMAGE · ${q.explanation}`:`금실 봉합 ${boss.stitches}/3 · ${hit} DAMAGE · ${q.explanation}`):squeezeBattle?(withinSqueezeWindow?`압착 회피! ${answerSeconds.toFixed(1)}초 · ${hit} DAMAGE · 시간 +1.2초 · ${q.explanation}`:`쌍벽 충돌 후 반격 · ${answerSeconds.toFixed(1)}초 · ${hit} DAMAGE · ${q.explanation}`):`${hit} DAMAGE · ${q.explanation}`;if(chaosBattle)st.textContent+=` · ${q.explanation}`;st.className=chaosBattle&&!fastFusion||squeezeBattle&&!withinSqueezeWindow?'boss-status bad':'boss-status good';
      const ratio=boss.hp/boss.maxHp,nextPhase=ratio<=.34?3:ratio<=.67?2:1;
      if(nextPhase!==boss.phase){boss.phase=nextPhase;if(shieldBattle){boss.shield=nextPhase===2?2:1;$('[data-boss-mood]').textContent=`석문 재결합 · 보호막 ${boss.shield}칸`}else if(reflectBattle){boss.reflectCharge=0;$('[data-boss-mood]').textContent=`거울 재정렬 · PHASE ${nextPhase}`}else if(gradeBattle)$('[data-boss-mood]').textContent=`${nextPhase===2?'중간 차수 장갑 균열':'최고차항 코어 노출'} · PHASE ${nextPhase}`;else if(chaosBattle)$('[data-boss-mood]').textContent=`예고 단축 · ${nextPhase===2?'4.1':'3.5'}초 · PHASE ${nextPhase}`;else if(sideBattle)$('[data-boss-mood]').textContent=`가면 격상 · ${boss.nextSide==='left'?'← 좌극한':'우극한 →'} · PHASE ${nextPhase}`;else if(stitchBattle)$('[data-boss-mood]').textContent=`재생축 격상 · 봉합 완료 · PHASE ${nextPhase}`;else if(squeezeBattle)$('[data-boss-mood]').textContent=`쌍벽 가속 · 안전창 ${squeezeSafeWindow().toFixed(1)}초 · PHASE ${nextPhase}`;else $('[data-boss-mood]').textContent=`${nextPhase===2?'응용 장갑 전개':'심화 코어 폭주'} · PHASE ${nextPhase}`}
      else if(shieldBattle)$('[data-boss-mood]').textContent=boss.shield?`공통인수 봉인 · ${boss.shield}칸`:`코어 노출 · ${boss.combo} COMBO`;
      else if(reflectBattle)$('[data-boss-mood]').textContent=reflecting?`켤레 반사 성공 · ${boss.combo} COMBO`:'은빛 거울 충전 · 다음 공격 반사';
      else if(gradeBattle)$('[data-boss-mood]').textContent=`${boss.attackGrade} GRADE · ${hit} DAMAGE`;
      else if(chaosBattle)$('[data-boss-mood]').textContent=fastFusion?`혼돈 융합 · ${boss.splitCount} ${boss.splitCount===1?'BODY':'BODIES'}`:`미정형 분열 · ${boss.splitCount} BODIES`;
      else if(sideBattle)$('[data-boss-mood]').textContent=`다음 가면 · ${boss.nextSide==='left'?'← 좌극한':'우극한 →'}${boundaryCrossing?' · 경계 관통':''}`;
      else if(stitchBattle)$('[data-boss-mood]').textContent=completingStitch?'금실 완성 · 재생 차단':`곡선 봉합 중 · ${boss.stitches}/3`;
      else if(squeezeBattle)$('[data-boss-mood]').textContent=withinSqueezeWindow?`쌍벽 밀어내기 · ${boss.wallEscapes}회 회피`:'압착 후 간신히 반격';
      else $('[data-boss-mood]').textContent=`${boss.combo} COMBO · 공격 적중`;
      if(completingStitch)boss.reopenOnNext=true;if(boss.hp<=0)cancelAnimationFrame(boss.raf);renderBossHud();setTimeout(()=>{monster.classList.remove('boss-hit');$('[data-boss-stage]').classList.remove('boss-boundary-cross','boss-wall-repel');if(!boss.running)return;if(boss.hp<=0)finishBossV2(true);else{st.className='boss-status hidden';renderBossV2()}},620)
    }else{
      boss.combo=0;const reflectBattle=bossConfig.mechanic==='conjugate-reflect',chaosBattle=bossConfig.mechanic==='chaos-split',sideBattle=bossConfig.mechanic==='side-switch',stitchBattle=bossConfig.mechanic==='continuity-stitch',squeezeBattle=bossConfig.mechanic==='squeeze-walls';if(chaosBattle)boss.splitCount=Math.min(4,boss.splitCount+1);if(sideBattle){boss.boundaryStreak=0;boss.lastSide=null;boss.nextSide=q.side;boss.targetSide=q.side}let healBurst=0;if(stitchBattle){boss.stitches=0;boss.reopenOnNext=false;boss.regenBuffer=0;healBurst=Math.min(90+boss.phase*20,boss.maxHp-boss.hp);boss.hp+=healBurst;boss.healed+=healBurst;if(healBurst>0)launchBossHealFx(healBurst)}const penalty=reflectBattle?3:chaosBattle?2+boss.splitCount:sideBattle?3:squeezeBattle?(boss.wallCrushed?3:4):2;boss.time=Math.max(0,boss.time-penalty);if(bossConfig.mechanic==='factor-shield')boss.shield=Math.min(3,boss.shield+1);if(reflectBattle)boss.reflectCharge=0;if(squeezeBattle){boss.wallGap=0;boss.wallCrushed=true;$('[data-boss-stage]').classList.add('boss-wall-slam')}launchBossFx(false,0,penalty);monster.classList.remove('boss-hit');monster.classList.add('boss-attack');
      $('[data-boss-mood]').textContent=bossConfig.mechanic==='factor-shield'?`봉인 복구 · 보호막 ${boss.shield}칸`:reflectBattle?'반사 역류 · 거울 충전 소멸':chaosBattle?`오답 분열 · ${boss.splitCount} BODIES`:sideBattle?`${q.side==='left'?'왼쪽':'오른쪽'} 가면 재봉인`:stitchBattle?'금실 파열 · 재생축 재가동':squeezeBattle?'오답 압착 · 쌍벽 충돌':'철갑 반격 · COMBO RESET';
      st.textContent=`오답 · 시간 −${penalty}초${bossConfig.mechanic==='factor-shield'?' · 보호막 +1':reflectBattle?' · 거울 충전 초기화':chaosBattle?` · ${boss.splitCount}개로 분열`:sideBattle?' · 같은 방향을 다시 공격':stitchBattle?` · 봉합 0/3 · HP +${healBurst}`:squeezeBattle?' · 벽 간격 0%':''} · ${q.explanation}`;st.className='boss-status bad';renderBossHud();setTimeout(()=>{monster.classList.remove('boss-attack');$('[data-boss-stage]').classList.remove('boss-wall-slam');if(!boss.running)return;st.className='boss-status hidden';renderBossV2()},760)
    }
  }
  function finishBossV2(cleared){
    if(!boss.running)return;stopBossTimer();const r=rec(),previousBest=r.bossBestDamage||0,personalBest=boss.damage>previousBest;r.bossBestDamage=Math.max(previousBest,boss.damage);if(cleared)r.bossClears++;save();updateStats();if(telemetry&&bossActivePlay){telemetry.finishPlay(bossActivePlay.playId,{score:boss.damage,accuracy:boss.attempts?Math.round(boss.correct/boss.attempts*100):0,playTime:Math.round((boss.limit-boss.time)*10)/10,retry:bossSessionPlayIndex>1,sessionPlayIndex:bossSessionPlayIndex,personalBest});bossActivePlay=null}const monster=$('[data-boss-monster]');monster.classList.remove('boss-hit','boss-attack');if(cleared)monster.classList.add('boss-defeated');const defeatText=bossConfig.mechanic==='factor-shield'?'석문 붕괴':bossConfig.mechanic==='conjugate-reflect'?'거울 연성 해제':bossConfig.mechanic==='degree-grade'?'최고차항 코어 붕괴':bossConfig.mechanic==='chaos-split'?'혼돈 코어 융합':bossConfig.mechanic==='side-switch'?'경계선 절단':bossConfig.mechanic==='continuity-stitch'?'재생축 정지':bossConfig.mechanic==='squeeze-walls'?'쌍벽 분쇄':'철갑 파괴';$('[data-boss-mood]').textContent=cleared?`${defeatText} · 승리`:'시간 종료 · 전투 기록 저장';if(cleared)$$('.boss-node').forEach(x=>x.className='boss-node done');renderBossHud();const nextLimit=currentBossV2Limit();$('[data-boss-body]').innerHTML=`<div class="boss-result-v2"><span>${cleared?'BOSS CLEAR':'TIME OVER'}</span><strong>${boss.damage} DAMAGE</strong><p>${boss.correct}문제 정답 · 최고 데미지 ${r.bossBestDamage}</p><small>${cleared?`다음 전투 제한시간은 ${nextLimit.toFixed(0)}초입니다. 문제 단계는 다시 기본부터 시작합니다.`:'남은 HP '+Math.max(0,boss.hp)+' · 콤보를 유지하면 더 큰 데미지를 줄 수 있습니다.'}</small></div>`;$('[data-boss-status]').className='boss-status hidden';const start=$('[data-boss-start]');start.textContent=cleared?'더 빠른 보스 도전':'바로 다시 도전';start.classList.remove('hidden');if(window.jpMotionFeedback)window.jpMotionFeedback(cleared?'success':'info',cleared?'보스 클리어!':`${boss.damage} 데미지 · 다시 도전하세요.`)
  }
  function clearBoss(){if(bossV2){finishBossV2(true);return}stopBossTimer();rec().bossClears++;save();updateStats();$$('.boss-node').forEach(x=>x.className='boss-node done');const monster=$('[data-boss-monster]');monster.classList.remove('boss-hit','boss-attack');monster.classList.add('boss-defeated');$('[data-boss-mood]').textContent='체력 소진 · 승리';boss.index=3;boss.time=0;renderBossHud();const next=currentBossLimit();$('[data-boss-body]').innerHTML=`<div class="boss-start-copy"><strong>보스 클리어!</strong><p>다음 보스는 문제당 <b>${next.toFixed(1)}초</b>입니다. 최소 제한시간은 7초입니다.</p></div>`;$('[data-boss-status]').className='boss-status hidden';$('[data-boss-start]').textContent='새 보스 소환';$('[data-boss-start]').classList.remove('hidden');if(window.jpMotionFeedback)window.jpMotionFeedback('success','보스 클리어 · 기록을 저장했습니다.')}
  $('[data-boss-start]').addEventListener('click',startBoss);

  function resetModes(){
    if(rush.running){rush.running=false;cancelAnimationFrame(rush.raf)}
    stopBossTimer();
    $('[data-drill-play]').classList.add('hidden');
    $('[data-drill-result]').classList.add('hidden');
    $('[data-drill-start-copy]').classList.remove('hidden');
    $('[data-rush-answers]').innerHTML='';
    $('[data-rush-result]').classList.add('hidden');
    $('[data-rush-start]').classList.remove('hidden');
    $('[data-rush-question]').innerHTML='<div class="rush-ready">⚡</div><h2>60초 러시</h2><p>오답은 2초가 줄어듭니다.</p>';
    $('[data-boss-body]').innerHTML=`<div class="boss-start-copy">${bossStartCopy}</div>`;
    $('[data-boss-status]').className='boss-status hidden';
    const st=$('[data-boss-start]');st.textContent=`⚔ ${bossV2?`${currentBossV2Limit()}초 전투 시작`:'보스전 시작'}`;st.classList.remove('hidden');
    $$('.boss-node').forEach(x=>x.className='boss-node');
    const monster=$('[data-boss-monster]');monster.classList.remove('boss-hit','boss-attack','boss-defeated');
    $('[data-boss-mood]').textContent='도전자를 기다리는 중';
    if(bossV2){const limit=currentBossV2Limit();boss={running:false,raf:0,time:limit,limit,hp:BOSS_V2_HP,maxHp:BOSS_V2_HP,damage:0,combo:0,correct:0,attempts:0,phase:1,shield:bossConfig.mechanic==='factor-shield'?3:0,reflectCharge:0,attackGrade:'C',splitCount:1,nextSide:'left',targetSide:'left',lastSide:null,boundaryStreak:0,stitches:0,regenBuffer:0,healed:0,reopenOnNext:false,wallGap:100,wallCrushed:false,wallEscapes:0,questionStartedAt:0,q:null,locked:false}}else{boss.index=0;boss.limit=currentBossLimit();boss.time=boss.limit}renderBossHud();
  }
  // 난이도를 바꾸면 진행 중이던 훈련을 접고, 기록도 난이도별로 따로 본다
  function setLevel(id){
    if(id===currentLevel||!LEVELS.some(l=>l.id===id))return;
    currentLevel=id;saved.level=id;save();
    $$('.skill-level-btn').forEach(b=>{const on=b.dataset.level===id;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
    $('[data-level-desc]').textContent=LEVELS.find(l=>l.id===id).desc;
    resetModes();updateStats();newExample();
    if(window.jpMotionFeedback)window.jpMotionFeedback('success',`난이도를 ${LEVELS.find(l=>l.id===id).name}으로 바꿨습니다.`);
  }
  // ?probe 로 열었을 때만 문제 생성기를 밖에서 호출할 수 있게 연다 (검산용)
  if(params.has('probe'))window.JPSkillProbe={id:skill.id,make:()=>makeQuestion(skill.id),setLevel:l=>{currentLevel=l},levels:LEVELS.map(l=>l.id),hasLevels:hasLevels(skill.id)};
  $$('.skill-level-btn').forEach(b=>b.addEventListener('click',()=>setLevel(b.dataset.level)));
  updateStats();
  if(params.get('mode')==='boss')showPanel('boss');
})();
