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
  // √4 는 2 다. 근호 안이 완전제곱이면 풀어서 적는다 — 학교 시험지에
  // √4 라고 적힌 문제는 없다. a+c 가 4나 9가 되는 경우가 다섯에 하나였다.
  const rad=n=>{const r=Math.sqrt(n);return Number.isInteger(r)?String(r):`√${n}`};
  const twoRad=n=>{const r=Math.sqrt(n);return Number.isInteger(r)?String(2*r):`2√${n}`};
  const invTwoRad=n=>{const r=Math.sqrt(n);return Number.isInteger(r)?frac(1,2*r):`1/(2√${n})`};
  const poly2=(A,B,C)=>{let out=A===1?'x²':A===-1?'−x²':`${A}x²`;if(B)out+=B>0?`+${B===1?'':B}x`:`−${Math.abs(B)===1?'':Math.abs(B)}x`;if(C)out+=sign(C);return out};
  // 기울기도 num() 을 거친다. 안 그러면 y=-22x−22 처럼 한 식 안에서
  // 빼기 기호가 ASCII 와 유니코드로 갈린다.
  const lineEq=(m,c)=>`y=${m===1?'':m===-1?'−':num(m)}x${c?sign(c):''}`;
  // 보기를 네 개로 채운다.
  // 예전에는 Number(정답)이 NaN이면 '다른 값 1'이라는 글자를 그대로 버튼에
  // 올렸다. 정답이 1/32 같은 분수면 Number()는 늘 NaN이라, 켤레의 연금술사
  // 심화에서는 열 문제 중 여섯 문제에 그 글자가 답안으로 나왔다.
  // 이제는 정답을 분수로 읽어 그 언저리 값을 만들어 채운다.
  const sameKey=v=>String(v).replace(/−/g,'-');   // −1 과 -1 은 화면에서 같은 글자다
  const asRatio=v=>{const t=sameKey(v);const m=/^(-?\d+)\/(\d+)$/.exec(t);
    if(m)return[Number(m[1]),Number(m[2])];
    return /^-?\d+$/.test(t)?[Number(t),1]:null};
  const nearbyValues=correct=>{const r=asRatio(correct),out=[];
    if(r){const[n,d]=r;
      for(const[p,q]of[[n+1,d],[n-1,d],[n,d+1],[n,d===1?2:d-1],[-n,d],[d,n||1],[n*2,d],[n,d*2]])
        if(q)out.push(frac(p,q))}
    return out.concat(['0','1','-1','2','-2'])};
  const choices=(correct,wrong)=>{
    const out=[],seen=[];
    const add=v=>{v=String(v);const k=sameKey(v);if(seen.includes(k))return;seen.push(k);out.push(v)};
    [correct,...wrong].forEach(add);
    for(const v of nearbyValues(correct)){if(out.length>=4)break;add(v)}
    return shuffle(out.slice(0,4))};
  const Q=(type,equation,prompt,correct,wrong,explanation,meta={})=>({type,equation,prompt,correct:String(correct),choices:choices(correct,wrong),explanation,...meta});

  const groups={
    limit:{name:'극한·연속 계산',color:'#C1442D',dark:'#71301F'},
    differentiate:{name:'미분 계산',color:'#2B6CA3',dark:'#173E5E'},
    graph:{name:'도함수·그래프 실전',color:'#176B5B',dark:'#123F34'},
    integral:{name:'적분·변화량 계산',color:'#7A4E8C',dark:'#493055'},
    // 대단원 보스. 한 갈래의 색이 아니라 단원 전체를 두르는 색이다.
    unit:{name:'대단원 총력전',color:'#8A5A2B',dark:'#4E3319'}
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
,
    /* 대단원 보스. 스킬 보스 스물여덟은 하나씩 잘게 쪼개져 있어 짧게 붙기는
       좋은데, 단원 전체를 한 번에 겨루는 자리가 없었다. 셋을 둔다. */
    S('unit_limit','U1','극한과 연속 총력전','극한과 연속 여덟 스킬을 뒤섞어 겨룬다','unit','대단원','극한과 연속 전 범위',['극한과 연속의 모든 스킬이 섞여 나옵니다','한 묶음 안에서 같은 스킬은 두 번 나오지 않습니다','약한 갈래가 있으면 반드시 걸립니다'],'한 갈래만 파고들면 묶음을 못 채웁니다'),
    S('unit_differentiate','U2','미분 총력전','미분법과 도함수의 활용 열두 스킬을 뒤섞어 겨룬다','unit','대단원','미분 전 범위',['미분의 모든 스킬이 섞여 나옵니다','한 묶음 안에서 같은 스킬은 두 번 나오지 않습니다','약한 갈래가 있으면 반드시 걸립니다'],'한 갈래만 파고들면 묶음을 못 채웁니다'),
    S('unit_integral','U3','적분 총력전','적분 여덟 스킬을 뒤섞어 겨룬다','unit','대단원','적분 전 범위',['적분의 모든 스킬이 섞여 나옵니다','한 묶음 안에서 같은 스킬은 두 번 나오지 않습니다','약한 갈래가 있으면 반드시 걸립니다'],'한 갈래만 파고들면 묶음을 못 채웁니다')
  ];
  const skills=Object.fromEntries(skillList.map(s=>[s.id,s]));


  // ── 다항식 도구 ──────────────────────────────────────────────────────
  // 계수 배열 [a0,a1,a2,…] 하나에서 표시 문자열과 값을 함께 만든다.
  // 식과 답이 따로 놀아서 생기는 오류를 원천적으로 막기 위한 것이다.
  const P={
    // 변수 이름을 받는다. 시간을 다루는 문제는 s(t)=… 라고 써 놓고
    // 식은 x 로 나오면 안 된다. 기본값은 x 라 나머지 호출은 그대로다.
    text(c,name='x'){
      let out='';
      for(let i=c.length-1;i>=0;i--){
        const v=c[i]; if(!v) continue;
        const body=i===0?String(Math.abs(v)):(Math.abs(v)===1?pow(name,i):Math.abs(v)+pow(name,i));
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
    {id:'basic', name:'기본', tag:'BASIC', desc:'직접 계산형을 반복해 한 가지 핵심 루틴을 굳힙니다.'},
    {id:'applied', name:'응용', tag:'APPLIED', desc:'식의 위치와 조건이 달라지는 2단계 변형을 해결합니다.'},
    {id:'deep', name:'심화', tag:'DEEP', desc:'역조건·부호·풀이 선택까지 판단하는 다른 구조의 문제를 해결합니다.'}
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
        /* 예전에는 양 끝의 상수항을 늘 1로 두어 답이 언제나 1이었다.
           아이들이 식을 읽지 않고 1만 눌러도 통과했다. 끼인 값 L 과
           다가가는 자리 p 를 함께 굴린다.

           두 끝은 a(x−p)+L 과 (x−p)²+a(x−p)+L 이다. 화면에는 P.text 로 펼쳐
           적는다 — 4(x+1) 처럼 곱셈 기호를 생략하면 검산기가 못 읽는다. */
        const a=ri(1,4),L=ri(-4,5),p=pick([0,0,1,-1,2]);
        const lo=P.text([L-a*p,a],'x');
        const hi=P.text([p*p-a*p+L,a-2*p,1],'x');
        return Q('SQUEEZE · 두 함수 사이',`${lo} ≤ f(x) ≤ ${hi},  x→${num(p)}`,
          'lim f(x)의 값은?',L,[L+a,0,'판정 불가'],
          `x→${num(p)}에서 두 끝이 모두 ${num(L)}이 됩니다. 사이에 낀 f(x)의 극한도 ${num(L)}입니다.`);
      },
      deep(){
        const A=ri(1,5),B=ri(1,5),c=ri(2,6),correct=A-B,limit=2*correct+A;
        return Q('SQUEEZE · 역조건',`2k+${A}−${c}/x ≤ f(x) ≤ 3k+${B}+${c}/x  (x>0)`,'x→∞에서 샌드위치 정리로 극한을 하나로 결정할 수 있게 하는 k는?',correct,
          [B-A,limit,0],`양 끝의 극한 2k+${A}와 3k+${B}가 같아야 합니다. 2k+${A}=3k+${B}에서 k=${correct}이고, 이때 f(x)의 극한은 ${limit}입니다.`);
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
        const a=ri(2,5),mode=pick(['reciprocal','mixed']);
        if(mode==='reciprocal'){
          const correct=frac(-1,a*a);
          return Q('L’HÔPITAL · 방법과 값 연결',`lim x→${a}  (1/x−1/${a})/(x−${a})`,'교육과정 안의 첫 변형과 극한값을 바르게 연결한 것은?',`통분 → ${correct}`,
            [`인수분해 → ${correct}`,`통분 → ${frac(1,a*a)}`,'로피탈 정리 → 검산만'],`분자를 통분하면 (${a}−x)/(${a}x)입니다. x−${a}와 약분하면 −1/(${a}x)가 남으므로 극한값은 ${correct}입니다.`);
        }
        const p=nonzero(-4,4),q=nonzero(-4,4),correct=frac(p,q);
        return Q('L’HÔPITAL · 지배항 판별',`lim x→0  (${ri(2,6)}x²${tail(p,'x')})/(${ri(2,6)}x²${tail(q,'x')})`,'약분 뒤 극한을 결정하는 항과 극한값의 짝은?',`일차항 → ${correct}`,
          [`이차항 → ${correct}`,`일차항 → ${frac(q,p)}`,'로피탈 정리 → 검산만'],`분자와 분모에서 x를 약분하면 x→0에서 일차항 계수 p와 q가 남습니다. 따라서 극한값은 ${correct}입니다.`);
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
      // x=p 에서 극값을 가지려면 f′(p)=0 이고, f′ 의 다른 근이 p 와 달라야 한다.
      // a=−3p 를 고르면 f′=3(x−p)² 라서 0 에 닿기만 하고 부호가 안 바뀐다.
      // 그건 극값이 아니라 접선만 수평인 자리이므로 그 a 는 뺀다.
      const p=nonzero(-3,3);
      let a=nonzero(-4,4); while(a===-3*p)a=nonzero(-4,4);
      const b=-3*p*p-2*a*p;                          // f′(p)=3p²+2ap+b=0
      const other=-2*a/3-p;                          // f′ 의 다른 근 — p 와 다르다
      const q=Q('CUBIC EXTREMA · 계수 되묻기',`f(x)=x³${tail(a,'x²')}+bx`,`f가 x=${num(p)}에서 극값을 갖게 하는 b는?`,b,[-b,p,3*p],
        `f′(x)=3x²${tail(2*a,'x')}+b이고 f′(${num(p)})=${3*p*p}${tail(2*a*p,'')}+b=0이므로 b=${num(b)}입니다. `+
        `이때 f′ 의 다른 근은 ${num(Math.round(other*1000)/1000)}이라 ${num(p)}에서 부호가 바뀌어 실제로 극값입니다.`);
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
      const q=Q('VELOCITY · 가속도',`s(t)=${P.text(s,'t')}`,`t=${t}에서 가속도는?`,correct,[P.at(v,t),correct+t,-correct],
        `v(t)=${P.text(v,'t')}, a(t)=${P.text(acc,'t')}이므로 t=${t}에서 ${correct}입니다.`);
      q.check={k:'deriv2',c:s,at:t};return q;
    },
    deep(){
      const r=ri(1,4);                              // v(t)=3(t−r)(t+r) 형태를 피하고 정수 해를 보장
      const v=P.fromRoots(3,[r,-r]),s=P.i(v).map(x=>Math.round(x*6)/6);
      const correct=r;
      const q=Q('VELOCITY · 운동 방향이 바뀌는 시각',`s(t)=${P.text(s,'t')}  (t ≥ 0)`,'물체의 운동 방향이 바뀌는 시각 t는?',correct,[2*r,0,r*r],
        `v(t)=${P.text(v,'t')}=3(t−${r})(t+${r})이고 t ≥ 0에서 부호가 바뀌는 것은 t=${r}뿐입니다.`);
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
        `F가 f의 부정적분일 때, lim x→${num(a)} (F(x)−F(${num(a)}))/(${lin(a)}) 의 값은?`,correct,[P.at(c,-a),P.at(P.d(c),a),0],
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
      const q=Q('TOTAL DISTANCE · 이차 속도',`v(t)=${P.text(v,'t')},  0≤t≤${T}`,'이동거리는?',correct,[frac(-2*r*r*r,3),'0',frac(r*r*r,3)],
        `구간 내내 v ≤ 0이므로 이동거리는 −∫v dt = ${correct}입니다.`);
      q.check={k:'absint',c:v,a:0,b:T};return q;
    },
    deep(){
      /* 예전에는 구간을 늘 [0,2k] 로 잡아 변위가 언제나 0이었다.
         t=k 에서 방향이 바뀌는 것은 그대로 두되, 끝을 굴려 답이 달라지게 한다.
           변위    = (T−k)² − k²
           이동거리 = (T−k)² + k²                  */
      const k=ri(1,3),T=k*pick([1,2,3]);            // v(t)=2t−2k : t=k 에서 부호가 바뀐다
      const v=[-2*k,2];
      const gap=(T-k)*(T-k);
      const displacement=gap-k*k, distance=gap+k*k;
      const askDistance=pick([true,false]);
      const correct=askDistance?distance:displacement;
      const q=Q('DISPLACEMENT vs DISTANCE',`v(t)=${P.text(v,'t')},  0≤t≤${T}`,
        askDistance?'이동거리는?':'위치의 변화량(변위)은?',correct,
        [askDistance?displacement:distance,-correct,k*k],
        `t=${k}에서 방향이 바뀝니다. 변위는 ${num(displacement)}, 이동거리는 ${num(distance)}입니다. ${askDistance?'이동거리는 되돌아온 만큼도 더합니다.':'변위는 되돌아온 만큼이 상쇄됩니다.'}`);
      q.check={k:askDistance?'absint':'defint',c:v,a:0,b:T};return q;
    }
  };

  levelMakers.fundamental_theorem={
    applied(){
      const c=[nonzero(-3,3),nonzero(-3,3),pick([1,2,-1])],t=nonzero(-2,2);
      const correct=P.at(c,t);
      const q=Q('FTC · 위끝이 x인 누적함수',`F(x)=∫[0→x] (${P.text(c).replace(/x/g,'t')}) dt`,`F′(${num(t)})의 값은?`,correct,[P.at(c,-t),P.at(P.d(c),t),0],
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
  /* 대단원 보스가 어느 스킬에서 문제를 뽑는지. 보스 설정보다 앞에 둔다 —
     설정은 파일 아래쪽에 있어서, 문제를 만드는 쪽에서 그것을 바로 보면
     아직 만들어지기 전이라 터진다. 설정 쪽이 이 명단을 가져다 쓴다. */
  const UNIT_MEMBERS={
    unit_limit:['limit_factor','limit_rationalize','limit_infinity_ratio','limit_infinity_diff','limit_one_sided','continuity_parameter','squeeze_limit','lhopital'],
    unit_differentiate:['derivative_definition','differentiate_polynomial','product_rule','tangent_equation','monotonic_interval','extrema_sign','cubic_extrema','quartic_shape','real_roots','mean_value','motion_rate','horizontal_tangent'],
    unit_integral:['antiderivative','initial_antiderivative','definite_integral','integral_symmetry','area_axis','area_between','distance_velocity','fundamental_theorem'],
  };

  function makeQuestion(id,level=currentLevel,forcedSide=null){
    /* 대단원 보스는 제 문제가 없다. 그 단원의 스킬에서 하나 골라 낸다.
       보스뿐 아니라 예제·드릴·러시도 이 길로 오므로 여기서 갈라 준다 —
       여기서 안 갈라 주면 그 탭들이 빈 기본 문제를 내놓는다. */
    const members=UNIT_MEMBERS[id];
    if(members)return makeQuestion(pick(members),level,forcedSide);
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
      case'squeeze_limit':{
        /* x^n·g(x) 만 물으면 답이 언제나 0이라, 아이들이 식을 안 보고 0을 눌렀다.
           끼우는 자리를 0이 아닌 값으로도 두어 양 끝을 실제로 읽게 한다. */
        const sup=['','','²','³','⁴','⁵','⁶'];
        n=pick([2,3,4]);A=ri(2,5);k=ri(-4,5);
        if(pick([0,1])){
          // |f(x) − L| ≤ A·xⁿ 꼴 — 끼인 값이 그대로 답이 된다
          // k=0 이면 |f(x)−0| 이 되어 보기 흉하다
          const head=k===0?'|f(x)|':`|f(x)${tail(-k,'')}|`;
          return Q('SQUEEZE',`${head} ≤ ${A}x${sup[n]},  x→0`,'lim f(x)의 값은?',k,[k+A,k===0?1:-k,'판정 불가'],
            `${A}x${sup[n]}→0이므로 f(x)−${num(k)}→0, 곧 lim f(x)=${num(k)}입니다.`);
        }
        // xⁿ·g(x)→0 에 상수를 얹어 둔다. 0으로 가는 것은 뒤 항뿐이다.
        return Q('SQUEEZE',`|g(x)|≤${A},  lim x→0  [${num(k)} + x${sup[n]}g(x)]`,'주어진 유계 조건에서 극한값은?',k,[0,k+A,'판정 불가'],
          `|x${sup[n]}g(x)|≤${A}|x${sup[n]}|→0이므로 남는 것은 상수 ${num(k)}입니다.`);
      }
      case'lhopital':
        a=nonzero(-4,4);n=pick([2,3,4]);A=Math.pow(a,n);correct=n*Math.pow(a,n-1);
        return Q('L’HÔPITAL CHECK',`lim x→${a}  (${pow('x',n)}${A>=0?`−${A}`:`+${Math.abs(A)}`})/${factor(a)}`,'로피탈 정리로 검산한 극한값은?',correct,[Math.pow(a,n-1),n*a,A],`0/0꼴이므로 분자와 분모를 각각 미분하면 ${n}${pow('x',n-1)}/1입니다. x=${a}를 대입하면 ${correct}입니다.`);
      case'derivative_definition':
        a=ri(-3,3);b=ri(-4,4);correct=2*a+b;
        return Q('DEFINITION',`f(x)=x²${tail(b,'x')},  f′(${num(a)})=?`,'미분계수는?',correct,[a+b,2*a-b,a*a+b*a],`f′(x)=2x${tail(b,'')}이므로 f′(${num(a)})=${num(correct)}입니다.`);
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
      case'cubic_extrema':{
        /* 예전에는 문제가 한 가지뿐이라 답이 늘 'm>0' 이었다.
           부호와 묻는 방향을 굴린다 — 조건식을 세우는 힘은 그대로 쓰인다. */
        const minus=pick([true,false]),wantBoth=pick([true,false]);
        k=ri(1,5);
        // f′=0 이 서로 다른 두 실근을 가질 조건 : − 는 m>0, + 는 m<0
        const both=minus?'m>0':'m<0', none=minus?'m≤0':'m≥0';
        const ans=wantBoth?both:none;
        return Q('CUBIC EXTREMA',`f(x)=x³${minus?'−':'+'}3mx+${k}`,
          wantBoth?'f가 극대와 극소를 모두 갖기 위한 m의 조건은?':'f가 극값을 갖지 않기 위한 m의 조건은?',
          ans,['m>0','m<0','m≥0','m≤0'].filter(x=>x!==ans),
          `f′(x)=3(x²${minus?'−':'+'}m)입니다. 서로 다른 두 실근을 가지면 극대·극소가 모두 생기고(${both}), 아니면 극값이 없습니다(${none}).`);
      }
      case'quartic_shape':{
        /* 예전에는 늘 가운데 임계점을 물었다. 세 근짜리 f′ 에서 가운데는
           언제나 극대라 답이 고정이었다. 어느 임계점을 묻는지 굴린다. */
        roots=pick([[-2,0,2],[-3,-1,2],[-1,1,3],[-2,1,3]]);
        const i=ri(0,2);
        // f′=4(x−r₀)(x−r₁)(x−r₂) 의 부호는 왼쪽부터 −,+,−,+ 이다
        correct=i===1?'극대':'극소';
        return Q('QUARTIC SHAPE',`f′(x)=4${factor(roots[0])}${factor(roots[1])}${factor(roots[2])}`,
          `x=${num(roots[i])}에서 f는?`,correct,[correct==='극대'?'극소':'극대','변곡점','판정 불가'],
          `f′의 부호가 왼쪽부터 −, +, −, + 로 바뀝니다. x=${num(roots[i])}에서는 ${correct==='극대'?'+에서 −로 바뀌어 극대':'−에서 +로 바뀌어 극소'}입니다.`);
      }
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
      case'integral_symmetry':{
        /* 예전에는 홀함수만 물어 답이 언제나 0이었다. 아이들이 적분을 하지 않고
           0을 눌렀다. 홀함수에 상수를 얹거나 짝함수를 섞는다. */
        a=ri(1,4);
        const shape=ri(0,2);
        if(shape===0){
          n=pick([1,3,5]);
          return Q('SYMMETRY',`∫[−${a}→${a}] ${pow('x',n)} dx`,'정적분의 값은?',0,[a,2*a,frac(2*Math.pow(a,n+1),n+1)],
            `${pow('x',n)}은 홀함수이고 구간이 원점 대칭이므로 0입니다.`);
        }
        if(shape===1){
          // 홀함수 + 상수 : 홀함수 쪽만 사라지고 상수의 넓이가 남는다
          n=pick([1,3]);k=nonzero(-4,4);correct=2*a*k;
          return Q('SYMMETRY',`∫[−${a}→${a}] (${pow('x',n)}${tail(k,'')}) dx`,'정적분의 값은?',correct,[0,a*k,4*a*k],
            `${pow('x',n)}은 홀함수라 0이 되고, 상수 ${num(k)}의 적분 ${num(k)}×${2*a}=${num(correct)}만 남습니다.`);
        }
        // 짝함수 : 반쪽의 두 배
        n=pick([2,4]);correct=frac(2*Math.pow(a,n+1),n+1);
        return Q('SYMMETRY',`∫[−${a}→${a}] ${pow('x',n)} dx`,'정적분의 값은?',correct,[0,frac(Math.pow(a,n+1),n+1),frac(4*Math.pow(a,n+1),n+1)],
          `${pow('x',n)}은 짝함수이므로 2∫[0→${a}]=${correct}입니다.`);
      }
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
        return Q('FTC',`F(x)=∫[0→x] (${A}t²${B?sign(B):''}) dt`,'F′('+c+')의 값은?',correct,[frac(A*c*c*c+3*B*c,3),A*c+B,2*A*c+B],`미적분의 기본정리에 따라 F′(x)=${A}x²${B?sign(B):''}이므로 ${correct}입니다.`);
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
    unit_limit:{name:'무한의 관문지기',theme:'unit',art:'../assets/bosses/infinity-gatekeeper.jpg',alt:'무한으로 뻗은 탑과 여덟 개의 극한 구슬을 두른 무한의 관문지기',accent:'#8d5aa8',hp:4200,baseTime:100,minTime:70,baseDamage:230,mechanic:'step-lock',lockLabel:'관문',lockSteps:4,tapDamage:110,finishMultiplier:3,finishText:'여덟 관문 관통!',breakText:'관문 재봉인 · 처음부터',moodStart:'관문 4단계 · 0/4',defeatText:'여덟 관문 관통',unitOf:UNIT_MEMBERS.unit_limit,gameId:'calculus-unit-boss-limit',intro:'극한과 연속 8개 스킬이 뒤섞여 나옵니다. 관문을 4단계까지 끊지 않고 통과해야 본체에 닿습니다.',start:'4문제를 연속으로 맞히면 마지막 한 방이 마무리 공격이 됩니다. 한 묶음 안에서 같은 스킬은 두 번 나오지 않으므로 약한 갈래가 있으면 반드시 걸립니다. 한 번이라도 틀리면 관문이 처음으로 돌아가고 시간 3초를 잃습니다.'},
    unit_differentiate:{name:'도함수의 대군주',theme:'unit',art:'../assets/bosses/derivative-overlord.jpg',alt:'손끝에 접선과 곡선을 띄운 도함수의 대군주',accent:'#1f8f82',hp:4200,baseTime:100,minTime:70,baseDamage:230,mechanic:'step-lock',lockLabel:'봉인',lockSteps:4,tapDamage:110,finishMultiplier:3,finishText:'열두 봉인 절단!',breakText:'봉인 복원 · 처음부터',moodStart:'봉인 4단계 · 0/4',defeatText:'열두 봉인 절단',unitOf:UNIT_MEMBERS.unit_differentiate,gameId:'calculus-unit-boss-differentiate',intro:'미분 12개 스킬이 뒤섞여 나옵니다. 봉인을 4단계까지 끊지 않고 통과해야 본체에 닿습니다.',start:'4문제를 연속으로 맞히면 마지막 한 방이 마무리 공격이 됩니다. 한 묶음 안에서 같은 스킬은 두 번 나오지 않으므로 약한 갈래가 있으면 반드시 걸립니다. 한 번이라도 틀리면 봉인이 처음으로 돌아가고 시간 3초를 잃습니다.'},
    unit_integral:{name:'누적의 대제',theme:'unit',art:'../assets/bosses/accumulation-emperor.jpg',alt:'겹겹이 쌓인 적분 계단 위에 앉은 누적의 대제',accent:'#76598f',hp:4200,baseTime:100,minTime:70,baseDamage:230,mechanic:'step-lock',lockLabel:'누적',lockSteps:4,tapDamage:110,finishMultiplier:3,finishText:'여덟 겹 누적 붕괴!',breakText:'누적 재시작 · 처음부터',moodStart:'누적 4단계 · 0/4',defeatText:'여덟 겹 누적 붕괴',unitOf:UNIT_MEMBERS.unit_integral,gameId:'calculus-unit-boss-integral',intro:'적분 8개 스킬이 뒤섞여 나옵니다. 누적을 4단계까지 끊지 않고 통과해야 본체에 닿습니다.',start:'4문제를 연속으로 맞히면 마지막 한 방이 마무리 공격이 됩니다. 한 묶음 안에서 같은 스킬은 두 번 나오지 않으므로 약한 갈래가 있으면 반드시 걸립니다. 한 번이라도 틀리면 누적이 처음으로 돌아가고 시간 3초를 잃습니다.'},
    limit_factor:{name:'인수분해의 문지기',theme:'factor',art:'../assets/bosses/factor-gate-guardian.jpg',alt:'공통인수 코어와 석문 갑옷을 지닌 인수분해의 문지기',hp:2100,baseTime:42,minTime:28,baseDamage:190,mechanic:'factor-shield',gameId:'calculus-skill-boss-limit-factor',intro:'공통인수를 찾아 석문 보호막을 먼저 깨세요. 페이즈가 바뀌면 보호막이 다시 닫히며, 오답은 보호막 한 칸을 복구합니다.',start:'정답으로 보호막 3칸을 깨면 공통인수 코어가 열립니다. 열린 동안 콤보 공격으로 큰 피해를 주세요.'},
    limit_rationalize:{name:'켤레의 연금술사',theme:'conjugate',art:'../assets/bosses/conjugate-alchemist.jpg',alt:'은빛과 금빛 켤레 수정을 든 네 팔의 켤레의 연금술사',hp:2300,baseTime:40,minTime:26,baseDamage:185,mechanic:'conjugate-reflect',gameId:'calculus-skill-boss-limit-rationalize',intro:'정답으로 은빛·금빛 거울을 차례로 충전하세요. 두 거울이 모두 켜지면 켤레 반사가 발동해 큰 피해가 들어가고, 오답이면 충전이 사라지며 시간 3초를 빼앗깁니다.',start:'첫 정답은 거울을 충전하고 두 번째 연속 정답은 켤레 반사 공격이 됩니다. 두 문제씩 정확하게 연결하는 것이 핵심입니다.'},
    limit_infinity_ratio:{name:'무한비의 거신',theme:'ratio',art:'../assets/bosses/infinite-ratio-colossus.jpg',alt:'끝없이 높아지는 탑 왕관과 비율 코어를 지닌 무한비의 거신',hp:1900,baseTime:45,minTime:29,baseDamage:210,mechanic:'degree-grade',gameId:'calculus-skill-boss-limit-infinity-ratio',intro:'기본 문제는 거신의 하위 차수 갑옷에 막혀 피해가 줄어듭니다. 페이즈가 올라가 응용·심화 문제를 해결하면 B·A등급 최고차항 관통 공격이 들어갑니다.',start:'C등급 공격은 55%, B등급은 100%, A등급은 180% 피해입니다. 강해지는 문제를 정확히 해결해 공격 등급을 올리세요.'},
    limit_infinity_diff:{name:'미정형의 혼돈수',theme:'chaos',art:'../assets/bosses/indeterminate-chaos-beast.jpg',alt:'붉은 무한과 푸른 무한으로 갈라지는 미정형의 혼돈수',hp:2200,baseTime:42,minTime:27,baseDamage:178,mechanic:'chaos-split',gameId:'calculus-skill-boss-limit-infinity-diff',intro:'문제를 오래 붙잡으면 혼돈수가 분열하며 남은 시간을 빼앗습니다. 빠르게 정리해 맞히면 분신을 다시 합치고 시간을 되찾을 수 있습니다.',start:'한 몸으로 시작합니다. 페이즈별 예고 시간 안에 맞히면 융합 공격과 시간 +1초, 늦거나 틀리면 최대 네 몸까지 분열하며 더 많은 시간을 빼앗습니다.'},
    limit_one_sided:{name:'양면의 경계자',theme:'boundary',art:'../assets/bosses/two-faced-boundary-warden.jpg',alt:'인디고 좌측 가면과 금빛 우측 가면을 지닌 양면의 경계자',hp:2250,baseTime:41,minTime:27,baseDamage:165,mechanic:'side-switch',gameId:'calculus-skill-boss-limit-one-sided',intro:'문제의 접근 방향에 따라 경계자가 왼쪽 또는 오른쪽 가면을 내밉니다. 좌극한과 우극한을 번갈아 정확히 읽으면 경계 관통 공격이 발동합니다.',start:'첫 가면은 왼쪽입니다. 화면의 ← 좌극한과 우극한 → 표시를 확인하세요. 오답이면 같은 가면이 다시 봉인되고 시간 3초를 빼앗깁니다.'},
    continuity_parameter:{name:'연속의 봉합사',theme:'stitch',art:'../assets/bosses/continuity-stitcher.jpg',alt:'끊어진 청록 곡선을 금실로 꿰매는 네 팔의 연속의 봉합사',hp:2300,baseTime:42,minTime:28,baseDamage:200,regenRate:10,mechanic:'continuity-stitch',gameId:'calculus-skill-boss-continuity-parameter',intro:'상처가 열려 있는 동안 봉합사는 매초 체력을 회복합니다. 연속 조건을 세 번 연속으로 맞혀 금실 3칸을 모두 잇고 재생축을 멈추세요.',start:'정답마다 봉합 1칸, 세 번째 정답은 재생 차단과 큰 피해를 줍니다. 오답이면 봉합이 전부 뜯기고 체력이 즉시 회복됩니다.'},
    squeeze_limit:{name:'압착의 쌍벽',theme:'squeeze',art:'../assets/bosses/squeeze-twin-walls.jpg',mobileArt:'../assets/bosses/squeeze-twin-walls-mobile-v3.jpg',alt:'냉청색 상한 수호자와 황동색 하한 수호자가 중앙의 극한핵을 압착하는 쌍벽',hp:2350,baseTime:43,minTime:29,baseDamage:195,safeWindows:[5.5,4.7,4],mechanic:'squeeze-walls',gameId:'calculus-skill-boss-squeeze-limit',intro:'상한과 하한의 쌍벽이 문제마다 중앙으로 좁혀 옵니다. 두 경계가 같은 값으로 모이는 것을 시간 창 안에 읽어 벽을 밀어내세요.',start:'벽 간격은 100%에서 시작합니다. 충돌 전에 맞히면 압착 회피와 시간 +1.2초, 늦으면 쌍벽 충돌로 시간 2초를 잃고 공격력이 약해집니다.'},
    lhopital:{name:'금단의 미분술사',theme:'forbidden',art:'../assets/bosses/forbidden-differentiation-warlock.jpg',mobileArt:'../assets/bosses/forbidden-differentiation-warlock-mobile.jpg',alt:'검붉은 두루마리와 황금 봉인 사슬로 극한핵을 가둔 금단의 미분술사',hp:2450,baseTime:44,minTime:30,baseDamage:190,sealSize:3,mechanic:'forbidden-seal',gameId:'calculus-skill-boss-lhopital',intro:'0/0꼴을 보자마자 교육과정 밖의 로피탈 지름길을 고르면 술사가 회복합니다. 인수분해·유리화·통분을 읽어 세 겹의 정석 봉인을 해제하세요.',start:'정석 방법을 세 번 연속으로 선택하면 봉인이 깨지며 큰 피해가 들어갑니다. 로피탈 정리를 고르면 금단 마력과 체력이 함께 회복됩니다.'},
    derivative_definition:{name:'차분몫의 원형',theme:'difference',art:'../assets/bosses/difference-quotient-origin.jpg',mobileArt:'../assets/bosses/difference-quotient-origin-mobile.jpg',alt:'세 겹의 할선 고리가 작은 청록색 접선 코어를 감싼 차분몫의 원형',hp:2500,baseTime:45,minTime:30,baseDamage:185,mechanic:'h-collapse',gameId:'calculus-skill-boss-derivative-definition',intro:'차분몫을 정확히 계산할 때마다 두 점 사이의 h 거리가 1에서 0.1, 0.01로 수축합니다. 세 번째 정답으로 h가 0에 가까워지면 접선 코어가 드러나 큰 피해를 줄 수 있습니다.',start:'정답 세 개를 연속으로 연결해 h→0을 완성하세요. 오답이면 할선 고리가 다시 벌어지고 한 단계 전의 거리로 밀려납니다.'},
    product_rule:{name:'쌍날 곱셈귀',theme:'product',art:'../assets/bosses/twin-blade-product-fiend.jpg',mobileArt:'../assets/bosses/twin-blade-product-fiend-mobile.jpg',alt:'청록 왼날과 금빛 오른날을 교차해 초록 곱 코어를 지키는 쌍날 곱셈귀',hp:2700,baseTime:44,minTime:29,baseDamage:205,mechanic:'product-blades',gameId:'calculus-skill-boss-product-rule',intro:'곱의 미분법 u′v+uv′의 두 항은 서로 다른 칼날입니다. 먼저 청록 왼날 u′v를 맞히고 이어서 금빛 오른날 uv′를 맞혀야 교차 베기가 완성됩니다.',start:'왼날→오른날 순서로 두 문제를 연결하세요. 오답이면 두 칼날의 충전이 모두 사라지고 다시 왼날부터 시작합니다.'},
    tangent_equation:{name:'접선의 저격수',theme:'sniper',art:'../assets/bosses/tangent-sniper.jpg',mobileArt:'../assets/bosses/tangent-sniper-mobile.jpg',alt:'빛나는 곡선의 한 점을 접선 레이저와 좌표 조준경으로 겨누는 기계 저격수',hp:2550,baseTime:46,minTime:30,baseDamage:195,mechanic:'sniper-lock',gameId:'calculus-skill-boss-tangent-equation',intro:'접선은 접점과 기울기 두 값이 모두 있어야 그을 수 있습니다. 저격수의 조준 보호막도 그 둘을 차례로 맞혀야 열립니다.',start:'같은 곡선과 같은 x=a 로 세 문제가 이어집니다. 접점 f(a) → 기울기 f′(a) → 두 값을 합친 접선의 방정식 순서로 조준을 완성하세요. 한 번이라도 틀리면 조준이 풀려 처음부터입니다.'},
    monotonic_interval:{name:'부호표의 순찰자',theme:'step',art:'../assets/bosses/monotonic-interval-patrol-warden.jpg',alt:'증가와 감소 구간을 번갈아 순찰하는 부호표의 순찰자',accent:'#3e8469',hp:2400,baseTime:43,minTime:28,baseDamage:190,mechanic:'step-lock',lockLabel:'순찰',lockSteps:2,tapDamage:96,finishMultiplier:2.35,finishText:'부호표 관통!',breakText:'순찰 이탈 · 처음 구간부터',moodStart:'두 구간 순찰 · 0/2',defeatText:'부호표 붕괴',gameId:'calculus-skill-boss-monotonic-interval',intro:'증가 구간과 감소 구간을 이어서 정확히 읽어야 순찰선이 뚫립니다. 한 구간이라도 부호를 틀리면 순찰자가 처음 구간으로 되돌아갑니다.',start:'두 문제를 연속으로 맞히면 두 번째 공격이 부호표를 관통합니다. 오답이면 순찰이 처음부터 다시 시작하고 시간 3초를 잃습니다.'},
    extrema_sign:{name:'극점의 전환자',theme:'step',art:'../assets/bosses/turning-point-shapeshifter.jpg',alt:'상승과 하강이 뒤바뀌는 순간에만 모습을 드러내는 극점의 전환자',accent:'#4e8d72',hp:2400,baseTime:43,minTime:28,baseDamage:195,mechanic:'step-lock',lockLabel:'전환',lockSteps:3,tapDamage:90,finishMultiplier:2.8,finishText:'전환점 포착 · 치명타!',breakText:'전환 흐트러짐 · 처음부터',moodStart:'전환 추적 · 0/3',defeatText:'전환축 절단',gameId:'calculus-skill-boss-extrema-sign',intro:'전환자는 상승이 하강으로 바뀌는 그 순간에만 약점을 드러냅니다. 부호가 바뀌는 자리를 세 번 연속으로 짚어야 그 순간을 잡을 수 있습니다.',start:'세 문제를 연속으로 맞히면 세 번째 공격이 전환점을 관통합니다. 오답이면 추적이 끊기고 시간 3초를 잃습니다.'},
    cubic_extrema:{name:'판별식의 삼두룡',theme:'step',art:'../assets/bosses/discriminant-tri-dragon.jpg',alt:'판별식의 부호에 따라 세 머리가 다른 공격을 쓰는 삼두룡',accent:'#365c8d',hp:2600,baseTime:45,minTime:29,baseDamage:200,mechanic:'step-lock',lockLabel:'머리',lockSteps:3,tapDamage:88,finishMultiplier:2.9,finishText:'삼두 동시 절단!',breakText:'머리 재생 · 처음부터',moodStart:'세 머리 각성 · 0/3',defeatText:'삼두 코어 절단',gameId:'calculus-skill-boss-cubic-extrema',intro:'머리 하나를 베어도 판별식이 살아 있는 한 다시 자랍니다. 세 머리를 끊지 않고 이어서 베어야 본체에 닿습니다.',start:'세 문제를 연속으로 맞히면 세 머리가 한 번에 잘립니다. 오답이면 벤 머리가 모두 되살아나고 시간 3초를 잃습니다.'},
    quartic_shape:{name:'사차의 봉우리왕',theme:'step',art:'../assets/bosses/quartic-peak-king.jpg',alt:'세 임계점의 봉우리로 중앙 왕관을 지키는 사차의 봉우리왕',accent:'#5a568f',hp:2650,baseTime:45,minTime:29,baseDamage:198,mechanic:'step-lock',lockLabel:'봉우리',lockSteps:3,tapDamage:92,finishMultiplier:2.85,finishText:'중앙 왕관 강타!',breakText:'봉우리 재건 · 처음부터',moodStart:'세 봉우리 전개 · 0/3',defeatText:'중앙 왕관 붕괴',gameId:'calculus-skill-boss-quartic-shape',intro:'사차함수의 임계점 세 개가 중앙의 왕관을 둘러싸고 있습니다. 세 봉우리를 순서대로 무너뜨려야 왕관이 드러납니다.',start:'세 문제를 연속으로 맞히면 세 번째 공격이 왕관을 칩니다. 오답이면 봉우리가 다시 서고 시간 3초를 잃습니다.'},
    real_roots:{name:'교점의 군주',theme:'step',art:'../assets/bosses/intersection-lord.jpg',alt:'수평선 높이를 바꾸며 가짜 교점 환영을 부리는 교점의 군주',accent:'#5c6f9b',hp:2500,baseTime:44,minTime:29,baseDamage:194,mechanic:'step-lock',lockLabel:'교점',lockSteps:3,tapDamage:90,finishMultiplier:2.8,finishText:'진짜 교점 관통!',breakText:'환영에 속음 · 처음부터',moodStart:'교점 추적 · 0/3',defeatText:'교점 좌표 붕괴',gameId:'calculus-skill-boss-real-roots',intro:'군주는 수평선의 높이를 바꿔 가며 가짜 교점 환영을 세웁니다. 실근의 개수를 세 번 연속으로 정확히 세야 진짜 교점이 드러납니다.',start:'세 문제를 연속으로 맞히면 세 번째 공격이 진짜 교점을 관통합니다. 오답이면 환영에 속아 처음부터 다시 세고 시간 3초를 잃습니다.'},
    mean_value:{name:'평균값의 추적자',theme:'step',art:'../assets/bosses/mean-value-tracker.jpg',alt:'평균 기울기와 같아지는 순간까지 모습을 감추는 평균값의 추적자',accent:'#2f7791',hp:2450,baseTime:44,minTime:28,baseDamage:192,mechanic:'step-lock',lockLabel:'추적',lockSteps:3,tapDamage:90,finishMultiplier:2.8,finishText:'평균 기울기 일치 · 포착!',breakText:'자취 놓침 · 처음부터',moodStart:'자취 추적 · 0/3',defeatText:'평균값 자취 절단',gameId:'calculus-skill-boss-mean-value',intro:'추적자는 순간변화율이 평균변화율과 같아지는 그 지점에서만 모습을 드러냅니다. 자취를 세 번 연속으로 이어야 그 순간에 닿습니다.',start:'세 문제를 연속으로 맞히면 세 번째 공격이 추적자를 붙잡습니다. 오답이면 자취가 끊기고 시간 3초를 잃습니다.'},
    motion_rate:{name:'가속의 폭주마',theme:'step',art:'../assets/bosses/acceleration-rampage-steed.jpg',alt:'연속 정답마다 속도가 오르고 오답이면 돌진하는 가속의 폭주마',accent:'#b45a3f',hp:2350,baseTime:42,minTime:27,baseDamage:186,mechanic:'step-lock',lockLabel:'가속',lockSteps:2,tapDamage:98,finishMultiplier:2.3,finishText:'가속 붕괴 · 정면 강타!',breakText:'돌진 반격 · 가속 초기화',moodStart:'가속 축적 · 0/2',defeatText:'가속축 파괴',gameId:'calculus-skill-boss-motion-rate',intro:'폭주마는 달릴수록 빨라집니다. 속도와 가속도를 이어서 정확히 읽어야 가속이 끊기고, 놓치면 그대로 돌진해 옵니다.',start:'두 문제를 연속으로 맞히면 두 번째 공격이 가속을 끊습니다. 오답이면 폭주마가 돌진해 시간 3초를 빼앗습니다.'},
    horizontal_tangent:{name:'수평접선의 사냥꾼',theme:'step',art:'../assets/bosses/horizontal-tangent-hunter.jpg',alt:'기울기가 0이 되는 순간에만 약점을 드러내는 수평접선의 사냥꾼',accent:'#477e84',hp:2450,baseTime:44,minTime:28,baseDamage:193,mechanic:'step-lock',lockLabel:'조준',lockSteps:2,tapDamage:100,finishMultiplier:2.35,finishText:'기울기 0 · 약점 관통!',breakText:'약점 은폐 · 처음부터',moodStart:'약점 탐색 · 0/2',defeatText:'수평접선 절단',gameId:'calculus-skill-boss-horizontal-tangent',intro:'사냥꾼의 약점은 기울기가 정확히 0이 되는 순간에만 열립니다. 두 번 연속으로 그 순간을 짚어야 창이 닿습니다.',start:'두 문제를 연속으로 맞히면 두 번째 공격이 약점을 관통합니다. 오답이면 약점이 다시 닫히고 시간 3초를 잃습니다.'},
    antiderivative:{name:'원시함수의 수집가',theme:'step',art:'../assets/bosses/antiderivative-collector.jpg',alt:'잃어버린 지수와 적분상수 조각을 모아 몸을 재생하는 원시함수의 수집가',accent:'#76598f',hp:2450,baseTime:43,minTime:28,baseDamage:190,mechanic:'step-lock',lockLabel:'회수',lockSteps:3,tapDamage:90,finishMultiplier:2.75,finishText:'조각 전부 회수 · 본체 노출!',breakText:'조각 흩어짐 · 처음부터',moodStart:'조각 회수 · 0/3',defeatText:'수집품 붕괴',gameId:'calculus-skill-boss-antiderivative',intro:'수집가는 잃어버린 지수 조각을 흡수해 몸을 되살립니다. 지수를 올리고 그 수로 나누는 절차를 세 번 연속으로 정확히 밟아야 조각을 되찾습니다.',start:'세 문제를 연속으로 맞히면 세 번째 공격이 본체에 닿습니다. 오답이면 회수한 조각이 흩어지고 시간 3초를 잃습니다.'},
    initial_antiderivative:{name:'상수 C의 봉인자',theme:'step',art:'../assets/bosses/constant-seal-keeper.jpg',alt:'적분상수 C를 봉인해 본체를 지키는 상수 C의 봉인자',accent:'#8c5d99',hp:2500,baseTime:44,minTime:29,baseDamage:196,mechanic:'step-lock',lockLabel:'봉인',lockSteps:3,tapDamage:88,finishMultiplier:2.85,finishText:'C 봉인 해제 · 본체 강타!',breakText:'봉인 재구성 · 처음부터',moodStart:'C 봉인 · 0/3',defeatText:'C 봉인 소멸',gameId:'calculus-skill-boss-initial-antiderivative',intro:'부정적분만으로는 함수가 하나로 정해지지 않습니다. 봉인자는 그 틈에 숨습니다. 초기조건을 세 번 연속으로 풀어야 C가 정해지고 본체가 드러납니다.',start:'세 문제를 연속으로 맞히면 세 번째 공격이 봉인을 깹니다. 오답이면 봉인이 다시 세워지고 시간 3초를 잃습니다.'},
    definite_integral:{name:'구간의 판관',theme:'step',art:'../assets/bosses/interval-judge.jpg',alt:'위끝과 아래끝의 순서를 뒤집어 부호로 반격하는 구간의 판관',accent:'#6f558b',hp:2500,baseTime:44,minTime:29,baseDamage:195,mechanic:'step-lock',lockLabel:'판결',lockSteps:3,tapDamage:89,finishMultiplier:2.8,finishText:'판결 확정 · 구간 절단!',breakText:'부호 반격 · 처음부터',moodStart:'판결 진행 · 0/3',defeatText:'판결문 파기',gameId:'calculus-skill-boss-definite-integral',intro:'판관은 위끝과 아래끝의 순서를 뒤집어 부호로 반격합니다. F(b)−F(a)의 차례를 세 번 연속으로 지켜야 판결이 확정됩니다.',start:'세 문제를 연속으로 맞히면 세 번째 공격이 구간을 절단합니다. 오답이면 부호 반격을 맞고 시간 3초를 잃습니다.'},
    integral_symmetry:{name:'대칭적분의 거울왕',theme:'step',art:'../assets/bosses/symmetric-integral-mirror-king.jpg',alt:'짝함수와 홀함수의 대칭으로 복제체를 세우는 대칭적분의 거울왕',accent:'#735c9e',hp:2400,baseTime:43,minTime:28,baseDamage:188,mechanic:'step-lock',lockLabel:'거울',lockSteps:2,tapDamage:96,finishMultiplier:2.4,finishText:'복제체 소멸 · 두 배 강타!',breakText:'거울 재생 · 처음부터',moodStart:'거울 대치 · 0/2',defeatText:'거울면 파쇄',gameId:'calculus-skill-boss-integral-symmetry',intro:'거울왕은 좌우 대칭으로 복제체를 세웁니다. 짝함수인지 홀함수인지 읽어 내면 복제체가 사라지고 공격이 두 배가 됩니다.',start:'두 문제를 연속으로 맞히면 두 번째 공격이 두 배로 들어갑니다. 오답이면 거울이 다시 서고 시간 3초를 잃습니다.'},
    area_axis:{name:'절댓값의 재단사',theme:'step',art:'../assets/bosses/absolute-value-tailor.jpg',alt:'x축 아래 영역을 접어 올리지 않으면 잘못된 넓이를 흡수하는 절댓값의 재단사',accent:'#99577d',hp:2450,baseTime:43,minTime:28,baseDamage:191,mechanic:'step-lock',lockLabel:'재단',lockSteps:3,tapDamage:90,finishMultiplier:2.78,finishText:'재단 완성 · 넓이 절단!',breakText:'천 되감김 · 처음부터',moodStart:'재단 진행 · 0/3',defeatText:'재단선 절단',gameId:'calculus-skill-boss-area-axis',intro:'재단사는 x축 아래 영역을 그대로 두면 잘못된 넓이만큼 힘을 얻습니다. 부호를 뒤집어 접어 올리는 재단을 세 번 연속으로 해내야 합니다.',start:'세 문제를 연속으로 맞히면 세 번째 공격이 재단을 끝냅니다. 오답이면 천이 되감기고 시간 3초를 잃습니다.'},
    area_between:{name:'교차영역의 포식자',theme:'step',art:'../assets/bosses/crossing-region-devourer.jpg',alt:'위아래 함수가 뒤바뀌는 교점에서 공격 순서를 뒤집는 교차영역의 포식자',accent:'#7b4f83',hp:2550,baseTime:45,minTime:29,baseDamage:197,mechanic:'step-lock',lockLabel:'교차',lockSteps:3,tapDamage:88,finishMultiplier:2.85,finishText:'교차영역 절단!',breakText:'위아래 뒤집힘 · 처음부터',moodStart:'교차 추적 · 0/3',defeatText:'교차영역 소멸',gameId:'calculus-skill-boss-area-between',intro:'두 곡선이 만나는 자리에서 위아래가 뒤바뀝니다. 포식자는 그 순간을 노립니다. 어느 쪽이 위인지를 세 번 연속으로 지켜 내야 합니다.',start:'세 문제를 연속으로 맞히면 세 번째 공격이 교차영역을 절단합니다. 오답이면 위아래가 뒤집히고 시간 3초를 잃습니다.'},
    distance_velocity:{name:'속도누적의 질주귀',theme:'step',art:'../assets/bosses/velocity-accumulation-runner.jpg',alt:'방향 전환점을 놓치면 이동거리를 흡수해 가속하는 속도누적의 질주귀',accent:'#a34e69',hp:2400,baseTime:43,minTime:28,baseDamage:189,mechanic:'step-lock',lockLabel:'전환',lockSteps:2,tapDamage:97,finishMultiplier:2.35,finishText:'전환점 포착 · 질주 차단!',breakText:'이동거리 흡수 · 처음부터',moodStart:'전환점 감시 · 0/2',defeatText:'질주선 절단',gameId:'calculus-skill-boss-distance-velocity',intro:'질주귀는 방향이 바뀌는 지점을 놓치면 그만큼의 이동거리를 흡수해 더 빨라집니다. 위치 변화와 이동거리를 구분해 이어서 읽어야 합니다.',start:'두 문제를 연속으로 맞히면 두 번째 공격이 질주를 끊습니다. 오답이면 이동거리를 흡수하고 시간 3초를 빼앗습니다.'},
    fundamental_theorem:{name:'미적분의 문지기',theme:'step',art:'../assets/bosses/calculus-gatekeeper.jpg',alt:'미분과 적분을 번갈아 써야 열리는 최종 관문을 지키는 미적분의 문지기',accent:'#674d8e',hp:2700,baseTime:46,minTime:30,baseDamage:204,mechanic:'step-lock',lockLabel:'관문',lockSteps:3,tapDamage:86,finishMultiplier:2.95,finishText:'최종 관문 개방 · 관통!',breakText:'관문 폐쇄 · 처음부터',moodStart:'관문 세 겹 · 0/3',defeatText:'최종 관문 붕괴',gameId:'calculus-skill-boss-fundamental-theorem',intro:'적분한 것을 미분하면 원래로 돌아옵니다. 문지기의 관문은 그 왕복을 세 번 이어서 보여야 열립니다.',start:'세 문제를 연속으로 맞히면 세 번째 공격이 최종 관문을 관통합니다. 오답이면 관문이 다시 닫히고 시간 3초를 잃습니다.'},
    differentiate_polynomial:{name:'미분의 철갑수',theme:'iron',art:'../assets/bosses/derivative-iron-beast.webp',alt:'곡선 갑옷과 빛나는 미분 코어를 지닌 미분의 철갑수',hp:2600,baseTime:38,minTime:24,baseDamage:170,mechanic:'iron-armor',gameId:'calculus-skill-boss-differentiate-polynomial',intro:'기본 → 응용 → 심화로 문제가 강해집니다. 클리어할수록 문제는 더 어려워지는 대신 다음 전투의 시간만 2초씩 줄어듭니다.',start:'정답은 수식 공격으로 바뀝니다. 3단계까지 문제 난도가 올라가며 오답은 콤보 초기화와 시간 −2초입니다.'}
  };
  const fallbackBossNames={limit:'극한의 파수꾼',differentiate:'미분의 철갑수',graph:'그래프의 심연왕',integral:'적분의 수문장'};
  const bossConfig=BOSS_V2_CONFIGS[skill.id]||null;
  const bossV2=!!bossConfig;
  /* 난이도를 고르면 그것이 곧 시작 PHASE 다(bossStartPhase 참고).
     그런데 체력과 제한시간은 난이도와 무관하게 고정이라 두 가지가 어긋났다.
       ① 무한비의 거신은 공격력이 난이도를 탄다(C 55% · B 100% · A 180%).
          그래서 심화를 고르면 다섯 문제 만에 끝났다 — 기본의 1.8배 빠르다.
       ② 나머지 보스는 필요한 정답 수가 난이도와 상관없이 같아서,
          심화 문제를 기본과 똑같이 5초 안에 풀어야 했다.
     그래서 공격력이 커지는 보스만 체력을 올린다. 나머지는 체력을
     건드리지 않는다 — 난이도를 올렸다고 전투를 짧게 만들 이유가 없다.
     대신 시간을 난이도에 따라 늘려 문제당 생각할 시간을 맞춘다.
     기본 5.0초 · 응용 6.0초 · 심화 7.3초(중앙값). */
  const bossIntro=bossV2?bossConfig.intro:'세 번 공격해 보스의 체력을 모두 깎으세요. 클리어마다 문제 제한시간이 0.5초씩 줄어듭니다.';
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
      <section class="hidden" data-panel="boss"><header class="mode-header"><div><p class="skill-kicker">${bossV2?'BOSS BATTLE 2.2':'TIMED BOSS BATTLE'}</p><h1>${skill.title} 보스전</h1><p>${bossIntro}</p></div><div class="mode-stat"><span>CLEARS</span><strong data-boss-clears>0</strong></div></header><div data-boss-mount></div></section>
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
  const telemetry=window.JPGameTelemetry||null;
  const bossSessionId=telemetry?telemetry.makeSessionId():'';
  let bossSessionPlayIndex=0,bossActivePlay=null;

  /* 보스 전투는 공용 엔진이 맡는다(보스전/boss-engine.js).
     페이지는 문제를 만들어 주고 조판·선택지 그리기만 넘긴다.
     생성기들이 모듈 스코프의 boss 를 읽어 왔으므로, 엔진이 넘겨주는
     상태를 그 이름으로 받아 둔다. */
  // 문제 생성기들이 이 이름으로 전투 상태를 읽는다. 실제 상태는 엔진이 갖고,
  // 문제를 만들 때마다 엔진이 넘겨주는 것을 여기에 받아 둔다.
  let boss={};
  /* 대단원 보스는 한 묶음 안에서 같은 스킬을 두 번 내지 않는다.
     한 갈래만 파고든 학생이 통과하지 못하게 하려는 것이다. */
  let unitSeen=[];
  function pickUnitSkill(list,state){
    if((state.lockStep||0)===0)unitSeen=[];
    const left=list.filter(x=>!unitSeen.includes(x));
    const from=left.length?left:list;
    const chosen=from[Math.floor(Math.random()*from.length)];
    unitSeen.push(chosen);
    return chosen;
  }

  function makeBossQuestion(level,state){
    boss=state;
    if(bossConfig&&bossConfig.unitOf){
      const id=pickUnitSkill(bossConfig.unitOf,state);
      const q=makeQuestion(id,level);
      /* 어느 갈래에서 나온 문제인지 물음 앞에 달아 준다. 무대의 머리글은
         엔진이 만들므로 q.type 을 고쳐도 화면에 안 나온다. 물음은 페이지
         것이라 여기서 붙일 수 있다. 틀린 뒤 어디를 다시 볼지 알게 된다. */
      const from=skills[id];
      if(from)q.prompt=`[${from.code} ${from.title}] ${q.prompt}`;
      return q;
    }                                   // 생성기들이 이 이름으로 읽는다
    const m=bossConfig.mechanic;
    if(m==='sniper-lock')return makeSniperQuestion(level);
    if(m==='forbidden-seal')return makeForbiddenQuestion(level);
    if(m==='h-collapse')return makeDifferenceQuestion(level);
    if(m==='product-blades')return makeProductBossQuestion(level,state.nextBlade);
    return makeQuestion(skill.id,level,m==='side-switch'?state.nextSide:null);
  }
  const engine=bossV2&&window.JPBossEngine?window.JPBossEngine.create({
    root:app,config:bossConfig,skillId:skill.id,skillTitle:skill.title,
    levels:LEVELS,level:()=>currentLevel,
    makeBossQuestion:makeBossQuestion,
    setMath:(el,v)=>setMath(el,v),
    fillAnswers:(box,q,h)=>fillAnswers(box,q,h),
    markAnswers:(box,q,v,b)=>markAnswers(box,q,v,b),
    rec:()=>rec(),save:()=>save(),updateStats:()=>updateStats(),telemetry:telemetry
  }):null;
  if(engine){$('[data-boss-mount]').innerHTML=engine.stageHtml();engine.mount()}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(saved))}catch(e){}}
  function updateStats(){
    const r=rec();
    $('[data-drill-best]').textContent=`${r.drillBest} / 5`;
    $('[data-rush-best]').textContent=r.rushBest;
    $('[data-boss-clears]').textContent=r.bossClears;
    const stars=(r.drillBest===5?1:0)+(r.rushBest>=800?1:0)+(r.bossClears>0?1:0);
    $('[data-stars]').textContent='★'.repeat(stars)+'☆'.repeat(3-stars);
  }
  let rush={running:false,raf:0};
  function showPanel(name){
    if(name!=='rush'&&rush.running){rush.running=false;cancelAnimationFrame(rush.raf)}
    if(name!=='boss'&&engine)engine.stop();
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

  // 전투 PHASE와 학생이 고른 문제 난이도를 분리한다.
  // 미분의 철갑수만 "갑옷이 깨질수록 문제도 강해지는" 고유 능력을 유지한다.
  // 공통 단계잠금. 몇 단계짜리인지는 보스 설정에 적혀 있다.
  /* ── 보스 전용 문제 생성기 시작 ──────────────────────────────
     보스마다 고유한 문제를 만드는 곳이다. 전투 자체는 공용 엔진이
     맡고(보스전/boss-engine.js), 여기서는 문제만 만든다.
     검산 테스트가 이 표식 사이를 잘라 내어 돌리므로, 새 보스의
     생성기는 반드시 이 안에 둔다. */
  function buildSniperTarget(level){
    for(let guard=0;guard<80;guard+=1){
      let c,a;
      if(level==='deep'){c=[nonzero(-5,5),nonzero(-4,4),nonzero(-3,3),pick([1,2,-1])];a=nonzero(-2,2)}
      else if(level==='applied'){c=[nonzero(-4,4),nonzero(-3,3),0,1];a=nonzero(-2,2)}
      else{c=[0,nonzero(-4,4),1];a=nonzero(-3,3)}
      const d=P.d(c),y=P.at(c,a),m=P.at(d,a);
      // 기울기가 0이면 y=0x 라는 이상한 식이 되고, 기울기가 접점의
      // x좌표와 같으면 "a를 기울기로 착각" 오답이 정답과 겹친다.
      if(m===0||m===a)continue;
      return{c:c,d:d,a:a,y:y,m:m,k:y-m*a,level:level};
    }
    const c=[0,1,1],d=P.d(c);                       // f(x)=x²+x, a=1
    return{c:c,d:d,a:1,y:2,m:3,k:-1,level:level};
  }
  function makeSniperQuestion(level){
    const keep=boss.sniperLock>0&&boss.sniperTarget&&boss.sniperTarget.level===level;
    const t=keep?boss.sniperTarget:buildSniperTarget(level);
    boss.sniperTarget=t;
    let q;
    if(boss.sniperLock===0){
      q=Q('조준 1 · 접점',`f(x)=${P.text(t.c)},  x=${num(t.a)}`,`접점의 y좌표 f(${num(t.a)})의 값은?`,t.y,
        [t.m,t.a,-t.y],`f(${num(t.a)})=${num(t.y)}입니다. 기울기 f′(${num(t.a)})=${num(t.m)}과 헷갈리지 않게 합니다.`);
      q.sniperStep='접점';return q
    }
    if(boss.sniperLock===1){
      q=Q('조준 2 · 기울기',`f(x)=${P.text(t.c)},  x=${num(t.a)}`,`접선의 기울기 f′(${num(t.a)})의 값은?`,t.m,
        [t.y,t.a,-t.m],`f′(x)=${P.text(t.d)}이므로 f′(${num(t.a)})=${num(t.m)}입니다. 접점의 x좌표 ${num(t.a)}를 기울기로 쓰지 않습니다.`);
      q.sniperStep='기울기';return q
    }
    q=Q('발사 · 접선의 방정식',`접점 (${num(t.a)}, ${num(t.y)}),  기울기 ${num(t.m)}`,'접선의 방정식은?',lineEq(t.m,t.k),
      [lineEq(t.m,t.y),lineEq(t.a,t.k),lineEq(-t.m,t.k)],
      `y−(${num(t.y)})=${num(t.m)}(x−(${num(t.a)}))를 정리하면 ${lineEq(t.m,t.k)}입니다.`);
    q.sniperStep='발사';return q
  }
  function makeDifferenceQuestion(level){
    let q,a,b,c,d,correct,k,mode;
    if(level==='deep'){
      c=[0,nonzero(-4,4),nonzero(-3,3),pick([1,2,-1])];a=nonzero(-2,2);d=P.d(c);mode=pick(['scale','symmetric']);
      if(mode==='scale'){
        k=ri(2,4);correct=k*P.at(d,a);q=Q('h 수축 · 배율 차분몫',`lim h→0  (f(${num(a)}+${k}h)−f(${num(a)}))/h`,`f(x)=${P.text(c)}일 때 극한값은?`,correct,[P.at(d,a),correct+k,-correct],`분모를 ${k}h로 맞추면 ${k}f′(${num(a)})입니다. f′(x)=${P.text(d)}이므로 ${correct}입니다.`);q.hMode='배율';return q
      }
      correct=2*P.at(d,a);q=Q('h 수축 · 대칭 차분몫',`lim h→0  (f(${num(a)}+h)−f(${num(a)}−h))/h`,`f(x)=${P.text(c)}일 때 극한값은?`,correct,[P.at(d,a),0,-correct],`가운데 f(${num(a)})를 더하고 빼면 좌우 두 차분몫의 합이 되어 2f′(${num(a)})=${correct}입니다.`);q.hMode='대칭';return q
    }
    if(level==='applied'){
      c=[nonzero(-4,4),nonzero(-3,3),nonzero(-2,2),pick([1,2,-1])];a=nonzero(-2,2);d=P.d(c);correct=P.at(d,a);q=Q('h 수축 · 삼차함수',`lim h→0  (f(${num(a)}+h)−f(${num(a)}))/h`,`f(x)=${P.text(c)}일 때 차분몫의 극한값은?`,correct,[P.at(c,a),correct+a,-correct],`f(${num(a)}+h)−f(${num(a)})를 전개해 h로 묶고 약분하면 f′(${num(a)})입니다. f′(x)=${P.text(d)}이므로 ${correct}입니다.`);q.hMode='삼차';return q
    }
    a=nonzero(-3,3);b=nonzero(-4,4);correct=2*a+b;q=Q('h 수축 · 이차함수',`lim h→0  (f(${num(a)}+h)−f(${num(a)}))/h`,`f(x)=x²${tail(b,'x')}일 때 차분몫의 극한값은?`,correct,[a+b,2*a-b,a*a+b*a],`분자를 전개하면 h(${2*a+b}+h)이고 h를 약분한 뒤 h→0을 적용하면 ${correct}입니다.`);q.hMode='이차';return q
  }
  function buildProductPair(level){
    let uText,vText,t,p,a,b,r,s,uValue,vValue,uPrime,vPrime;
    if(level==='deep'){
      p=nonzero(-3,3);a=nonzero(-4,4);r=nonzero(-3,3);s=nonzero(-4,4);t=nonzero(-2,2);uText=`x²${tail(p,'x')}${tail(a,'')}`;vText=`x³${tail(r,'x')}${tail(s,'')}`;uValue=t*t+p*t+a;vValue=t*t*t+r*t+s;uPrime=2*t+p;vPrime=3*t*t+r
    }else if(level==='applied'){
      p=pick([2,3,-2]);a=nonzero(-4,4);r=nonzero(-4,4);t=nonzero(-2,2);uText=`${lead(p,'x')}${tail(a,'')}`;vText=`x²${tail(r,'')}`;uValue=p*t+a;vValue=t*t+r;uPrime=p;vPrime=2*t
    }else{
      a=nonzero(-4,4);do{b=nonzero(-4,4)}while(b===a);t=nonzero(-2,2);uText=lin(a);vText=lin(b);uValue=t-a;vValue=t-b;uPrime=1;vPrime=1
    }
    const leftTerm=uPrime*vValue,rightTerm=uValue*vPrime;
    return{level,uText,vText,t,uValue,vValue,uPrime,vPrime,leftTerm,rightTerm,total:leftTerm+rightTerm}
  }
  function makeProductBossQuestion(level,blade){
    const pair=blade==='right'&&boss.productPair?.level===level?boss.productPair:buildProductPair(level);
    if(blade==='left')boss.productPair=pair;
    const {uText,vText,t,uValue,vValue,uPrime,vPrime,leftTerm,rightTerm,total}=pair,isLeft=blade==='left';let q;
    if(level==='deep'&&!isLeft){
      q=Q('RIGHT BLADE · 역으로 항 복원',`w(x)=u(x)v(x),  w′(${num(t)})=${total}`,`청록 왼날 u′v=${leftTerm}일 때 금빛 오른날 uv′의 값은?`,rightTerm,
        [leftTerm,total,-rightTerm],`곱의 미분법 w′=u′v+uv′에서 오른날은 ${total}−(${leftTerm})=${rightTerm}입니다.`)
    }else{
      const correct=isLeft?leftTerm:rightTerm,other=isLeft?rightTerm:leftTerm,bladeName=isLeft?'청록 왼날 u′(x)v(x)':'금빛 오른날 u(x)v′(x)';
      q=Q(`${isLeft?'LEFT':'RIGHT'} BLADE · ${level==='deep'?'두 다항식 분해':level==='applied'?'일차×이차':'두 일차식'}`,`u(x)=${uText},  v(x)=${vText}`,`x=${num(t)}에서 ${bladeName}의 값은?`,correct,
        [other,total,-correct],`${isLeft?`u′(${num(t)})=${uPrime}, v(${num(t)})=${vValue}`:`u(${num(t)})=${uValue}, v′(${num(t)})=${vPrime}`}이므로 ${bladeName}=${correct}입니다.`)
    }
    q.blade=blade;q.leftTerm=leftTerm;q.rightTerm=rightTerm;q.productPair=pair;return q
  }
  function makeForbiddenQuestion(level){
    let q,a,n,c;
    if(level==='deep'){
      a=ri(2,5);const mode=pick(['reciprocal','cube']);
      if(mode==='reciprocal'){
        const value=frac(-1,a*a),correct=`통분 → ${value}`;
        q=Q('정석 봉인 · 방법과 값',`lim x→${a}  (1/x−1/${a})/(x−${a})`,'첫 변형과 극한값을 바르게 연결한 것은?',correct,
          [`인수분해 → ${value}`,`통분 → ${frac(1,a*a)}`,'로피탈 정리 → 검산만'],`분자를 통분하면 (${a}−x)/(${a}x)입니다. x−${a}를 약분하면 −1/(${a}x)가 남아 극한값은 ${value}입니다.`);q.sealMethod='통분+값';return q
      }
      n=pick([3,4]);const value=n*Math.pow(a,n-1),correct=`인수분해 → ${value}`;
      q=Q('정석 봉인 · 구조와 값',`lim x→${a}  (${pow('x',n)}−${Math.pow(a,n)})/(x−${a})`,'교육과정 안의 첫 변형과 극한값을 바르게 연결한 것은?',correct,
        [`유리화 → ${value}`,`인수분해 → ${Math.pow(a,n-1)}`,'로피탈 정리 → 검산만'],`${pow('x',n)}−${Math.pow(a,n)}을 인수분해해 x−${a}를 약분합니다. 남은 항의 합은 ${n}·${a}${n>2?`^${n-1}`:''}=${value}입니다.`);q.sealMethod='인수분해+값';return q
    }
    if(level==='applied'){
      a=ri(1,4);c=ri(1,5);const root=a+c,correct=`유리화 → ${invTwoRad(root)}`;q=Q('정석 봉인 · 변형 연결',`lim x→${a}  (√(x+${c})−${rad(root)})/(x−${a})`,'첫 변형과 약분 뒤 남는 값을 바르게 연결한 것은?',correct,
        [`인수분해 → ${invTwoRad(root)}`,`유리화 → ${twoRad(root)}`,'로피탈 정리 → 바로 답'],`켤레식 √(x+${c})+${rad(root)}을 곱하면 x−${a}가 생겨 약분되고, x=${a}에서 ${invTwoRad(root)}이 남습니다.`);q.sealMethod='유리화+값';return q
    }
    a=ri(1,4);n=pick([2,3,4]);q=Q('정석 봉인 · 인수분해',`lim x→${a}  (${pow('x',n)}−${Math.pow(a,n)})/(x−${a})`,'학교 시험 풀이에서 가장 먼저 사용할 방법은?','인수분해',['로피탈 정리','분자·분모 따로 대입','최고차항 비교'],`${pow('x',n)}−${Math.pow(a,n)}에서 x−${a}를 인수로 꺼내 약분합니다. 교육과정 안의 인수분해 풀이가 먼저입니다.`);q.sealMethod='인수분해';return q
  }

  /* ── 보스 전용 문제 생성기 끝 ── */
  function resetModes(){
    if(rush.running){rush.running=false;cancelAnimationFrame(rush.raf)}
    $('[data-drill-play]').classList.add('hidden');
    $('[data-drill-result]').classList.add('hidden');
    $('[data-drill-start-copy]').classList.remove('hidden');
    $('[data-rush-answers]').innerHTML='';
    $('[data-rush-result]').classList.add('hidden');
    $('[data-rush-start]').classList.remove('hidden');
    $('[data-rush-question]').innerHTML='<div class="rush-ready">⚡</div><h2>60초 러시</h2><p>오답은 2초가 줄어듭니다.</p>';
    if(engine)engine.reset();
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
