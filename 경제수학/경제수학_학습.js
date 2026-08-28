const topics = {
  indicator:{n:'01',chapter:'Ⅰ. 수와 경제',code:'ECONOMIC INDICATOR',title:'경제지표',lede:'경제의 상태를 숫자로 요약한 지표를 읽고, 퍼센트와 퍼센트포인트를 정확하게 구분합니다.',terms:[['경제지표','복잡한 경제 상황을 한눈에 비교하려고 만든 대표 숫자예요.','성적표의 평균처럼 물가·실업·성장 상태를 요약해요.'],['퍼센트포인트','두 퍼센트 값 사이의 단순한 차이예요.','금리 4%→6%는 2%포인트 상승이에요.']],principle:'차이와 변화율은 기준이 달라요',copy:'퍼센트 값끼리 빼면 퍼센트포인트, 처음 값과 비교하려면 차이를 처음 값으로 나눕니다.',formula:[['차이 = 새 값 − 이전 값','\\text{차이}=\\text{새 값}-\\text{이전 값}'],['변화율 = 차이 ÷ 이전 값 × 100','\\text{변화율}=\\dfrac{\\text{차이}}{\\text{이전 값}}\\times 100']],example:'4%에서 6%가 되면 차이는 2%p이고, 이전 4%에 비해서는 50% 상승한 것입니다.',warning:'“2% 상승”이라고만 쓰면 단순한 차이인지 변화율인지 모호합니다. 경제 기사에서는 %와 %p를 구분해야 합니다.',lab:'indicator',quiz:['금리가 4%에서 6%가 되었다. 가장 정확한 표현은?',['2% 상승했다.','2%포인트, 처음보다 50% 상승했다.','처음보다 150% 상승했다.'],1,'6−4=2%포인트이고, 2÷4×100=50%입니다.']},
  exchange:{n:'02',chapter:'Ⅰ. 수와 경제',code:'EXCHANGE RATE',title:'환율',lede:'서로 다른 나라의 돈을 바꾸는 비율을 계산하고 환율 변화의 의미를 생활 속 가격과 연결합니다.',terms:[['환율','한 나라 돈을 다른 나라 돈으로 바꾸는 교환 비율이에요.','1달러=1,400원이라면 1달러를 사는 데 1,400원이 필요해요.'],['원화 가치','원화 한 단위로 살 수 있는 외국 돈의 양이에요.','원/달러 환율이 오르면 같은 달러를 사는 데 원화가 더 들어요.']],principle:'통화의 단위를 보고 곱할지 나눌지 결정해요',copy:'원/달러 환율은 “1달러당 몇 원”이라는 뜻입니다. 달러를 원화로 바꿀 때는 달러 금액에 환율을 곱합니다.',formula:[['필요한 원화 = 달러 × 원/달러 환율','\\text{필요한 원화}=\\text{달러}\\times\\text{(원/달러 환율)}']],example:'100달러를 1달러당 1,380원에 바꾸면 100×1,380=138,000원이 필요합니다.',warning:'원/달러 환율 상승은 달러 가치 상승이자 원화 가치 하락을 뜻합니다. 숫자가 올랐다고 원화가 강해진 것은 아닙니다.',lab:'exchange',quiz:['같은 100달러를 살 때 환율이 1,300원에서 1,400원으로 오르면?',['필요한 원화가 10,000원 늘어난다.','필요한 원화가 10,000원 줄어든다.','필요한 원화는 변하지 않는다.'],0,'100×(1,400−1,300)=10,000원이 더 필요합니다.']},
  tax:{n:'03',chapter:'Ⅰ. 수와 경제',code:'TAX',title:'세금',lede:'세율을 소수로 바꾸어 세금과 세후 금액을 계산하고 세금이 가격에 미치는 영향을 살펴봅니다.',terms:[['세금','공공서비스에 필요한 돈을 마련하기 위해 국가나 지방자치단체에 내는 돈이에요.','도로·학교·소방 같은 공동 서비스를 운영하는 재원이 돼요.'],['세율','과세 대상 금액 중 세금으로 내는 비율이에요.','세율 10%는 금액 100원당 10원이라는 뜻이에요.']],principle:'퍼센트를 소수로 바꾸어 곱해요',copy:'세율 10%는 0.1입니다. 과세 전 금액에 세율을 곱하면 세금, 둘을 더하면 세후 금액입니다.',formula:[['세금 = 과세 전 금액 × 세율','\\text{세금}=\\text{과세 전 금액}\\times\\text{세율}'],['세후 금액 = 과세 전 금액 + 세금','\\text{세후 금액}=\\text{과세 전 금액}+\\text{세금}']],example:'8,000원의 10%는 800원이고 세후 금액은 8,800원입니다.',warning:'10%를 그대로 10으로 곱하지 않습니다. 10%=10÷100=0.1로 바꾸어 계산합니다.',lab:'tax',quiz:['공급가액 15,000원에 세율 10%를 적용한 세후 금액은?',['15,150원','16,500원','25,000원'],1,'세금은 15,000×0.1=1,500원, 세후 금액은 16,500원입니다.']},
  sequence:{n:'04',chapter:'Ⅰ. 수와 경제',code:'SEQUENCE',title:'수열',lede:'일정하게 늘거나 일정한 비율로 늘어나는 경제 자료를 수열로 표현합니다.',terms:[['수열','일정한 순서와 규칙에 따라 나열한 수의 모임이에요.','매달 1만 원씩 늘어나는 저축액을 차례로 적을 수 있어요.'],['공차·공비','각 항이 더해지는 일정한 값, 또는 곱해지는 일정한 비율이에요.','10, 15, 20의 공차는 5이고 10, 20, 40의 공비는 2예요.']],principle:'같은 차이는 등차, 같은 비율은 등비예요',copy:'등차수열은 일정한 금액이 더해지고, 등비수열은 이전 항에 일정한 배수가 곱해집니다.',formula:[['등차: aₙ = a₁+(n−1)d','\\text{등차}:\\;a_n=a_1+(n-1)d'],['등비: aₙ = a₁rⁿ⁻¹','\\text{등비}:\\;a_n=a_1 r^{\\,n-1}']],example:'첫 달 10만 원에서 매달 2만 원씩 늘면 6개월째 금액은 10+5×2=20만 원입니다.',warning:'“매달 5만 원 증가”와 “매달 5% 증가”는 전혀 다릅니다. 앞은 등차, 뒤는 등비입니다.',lab:'sequence',quiz:['첫 달 20만 원, 매달 3만 원씩 늘어날 때 5개월째 금액은?',['29만 원','32만 원','35만 원'],1,'20+(5−1)×3=32만 원입니다.']},
  finance:{n:'05',chapter:'Ⅰ. 수와 경제',code:'SEQUENCE & FINANCE',title:'수열과 금융',lede:'단리와 복리를 비교하고, 미래의 돈을 오늘의 가치로 바꾸어 봅니다.',terms:[['단리','처음 맡긴 원금에만 이자가 붙는 방식이에요.','원금 100만 원, 5%라면 해마다 5만 원씩 늘어요.'],['복리','원금뿐 아니라 앞서 생긴 이자에도 다시 이자가 붙는 방식이에요.','눈덩이처럼 시간이 길수록 단리와 차이가 커져요.'],['현재가치','미래에 받을 돈을 오늘 시점의 가치로 바꾼 금액이에요.','1년 뒤 105만 원과 오늘 100만 원을 같은 기준에서 비교해요.']],principle:'복리는 등비수열로 커져요',copy:'이자율이 r이고 기간이 n일 때 복리 원리합계는 매 기간 (1+r)배가 됩니다.',formula:[['복리 미래가치 = 원금 × (1+r)ⁿ','\\text{미래가치}=\\text{원금}\\times(1+r)^{n}'],['현재가치 = 미래금액 ÷ (1+r)ⁿ','\\text{현재가치}=\\dfrac{\\text{미래금액}}{(1+r)^{n}}']],example:'100만 원을 연 5% 복리로 3년 두면 약 115만 7,625원이 됩니다.',warning:'연 이자율과 월 이자율, 기간의 단위를 맞춰야 합니다. 연 6%를 무조건 월 6%로 계산하면 안 됩니다.',lab:'finance',quiz:['같은 원금·양의 이자율·3년 조건에서 일반적으로 더 큰 금액은?',['단리 원리합계','복리 원리합계','항상 같다'],1,'복리는 앞서 생긴 이자에도 이자가 붙으므로 2년 이후부터 단리보다 커집니다.']},
  cost:{n:'06',chapter:'Ⅱ. 함수와 경제',code:'PRODUCTION & COST',title:'생산함수와 비용함수',lede:'생산량에 따라 달라지는 비용·매출·이익을 함수로 연결합니다.',terms:[['고정비용','생산량이 0이어도 드는 비용이에요.','가게 임대료나 기계 대여료가 대표적이에요.'],['변동비용','생산량이 늘면 함께 늘어나는 비용이에요.','빵 한 개마다 드는 밀가루와 포장지 비용이에요.'],['이익','판매로 들어온 매출에서 모든 비용을 뺀 금액이에요.','매출이 커도 비용이 더 크면 이익은 음수가 될 수 있어요.']],principle:'매출과 비용의 차이가 이익이에요',copy:'생산량 q, 한 개 가격 p, 단위당 변동비 v, 고정비 F라면 각 함수를 간단히 표현할 수 있습니다.',formula:[['R(q)=pq','R(q)=pq'],['C(q)=F+vq','C(q)=F+vq'],['P(q)=R(q)−C(q)','P(q)=R(q)-C(q)']],example:'50개를 4,000원에 팔고 고정비 5만 원, 개당 비용 1,500원이면 이익은 75,000원입니다.',warning:'매출은 들어온 돈 전체이고 이익은 비용을 뺀 뒤 남은 돈입니다. 매출이 곧 이익은 아닙니다.',lab:'cost',quiz:['매출 30만 원, 고정비 5만 원, 변동비 18만 원일 때 이익은?',['7만 원','13만 원','23만 원'],0,'이익=30−5−18=7만 원입니다.']},
  market:{n:'07',chapter:'Ⅱ. 함수와 경제',code:'DEMAND & SUPPLY',title:'수요함수와 공급함수',lede:'가격에 따라 소비자가 사려는 양과 생산자가 팔려는 양이 어떻게 달라지는지 그래프로 봅니다.',terms:[['수요량','특정 가격에서 소비자가 사려는 상품의 양이에요.','가격이 낮아지면 보통 더 많이 사려고 해요.'],['공급량','특정 가격에서 생산자가 팔려는 상품의 양이에요.','가격이 높아지면 보통 더 많이 공급하려고 해요.']],principle:'보통 수요는 내려가고 공급은 올라가요',copy:'다른 조건이 같다면 가격이 오를수록 수요량은 감소하고 공급량은 증가하는 관계를 일차함수로 단순화할 수 있습니다.',formula:[['수요 Qd = a−bp','\\text{수요}\\;\\;Q_d=a-bp'],['공급 Qs = c+dp','\\text{공급}\\;\\;Q_s=c+dp']],example:'Qd=100−p, Qs=20+p라면 p=40에서 둘 다 60이 됩니다.',warning:'수요와 수요량은 다릅니다. 가격만 바뀌면 곡선 위에서 수요량이 움직이고, 소득·선호 등이 바뀌면 수요곡선 자체가 이동합니다.',lab:'market',quiz:['다른 조건이 같을 때 가격이 오르면 일반적인 수요량은?',['증가한다.','감소한다.','반드시 그대로다.'],1,'일반적인 수요법칙에서는 가격이 오를수록 수요량이 감소합니다.']},
  utility:{n:'08',chapter:'Ⅱ. 함수와 경제',code:'UTILITY',title:'효용함수',lede:'한정된 예산으로 여러 상품을 소비할 때 얻는 만족을 함수로 표현합니다.',terms:[['효용','상품이나 서비스를 소비하며 느끼는 만족의 정도를 수로 표현한 개념이에요.','같은 돈으로 어떤 조합을 고를 때 더 만족스러운지 비교해요.'],['예산제약','쓸 수 있는 돈 때문에 가능한 소비 조합이 제한되는 조건이에요.','가격×수량의 합이 가진 돈을 넘을 수 없어요.']],principle:'만족은 크되 예산 안에 있어야 해요',copy:'두 상품 x, y의 간단한 효용을 √(xy)로 두면 한 상품에만 몰기보다 두 상품을 적절히 섞을 때 만족이 커질 수 있습니다.',formula:[['효용 U(x,y)=√(xy)','\\text{효용}\\;\\;U(x,y)=\\sqrt{xy}'],['예산: pₓx+pᵧy ≤ M','\\text{예산}:\\;p_x x+p_y y\\le M']],example:'두 상품 가격이 같고 예산이 10이면 x=5, y=5에서 √25=5의 효용을 얻습니다.',warning:'효용의 숫자는 사람 사이의 행복을 직접 비교하는 점수가 아니라, 한 소비자의 선택 순서를 표현하기 위한 도구로 봅니다.',lab:'utility',quiz:['예산제약이 뜻하는 것은?',['만족은 언제나 최대여야 한다.','소비 지출이 가진 예산을 넘을 수 없다.','두 상품 수량은 반드시 같아야 한다.'],1,'예산제약은 가격×수량의 합이 사용 가능한 예산 이하여야 한다는 조건입니다.']},
  equilibrium:{n:'09',chapter:'Ⅱ. 함수와 경제',code:'MARKET EQUILIBRIUM',title:'균형가격',lede:'수요량과 공급량이 같아져 초과수요나 초과공급이 사라지는 가격을 찾습니다.',terms:[['균형가격','사려는 양과 팔려는 양이 같아지는 가격이에요.','줄을 서도 물건이 모자라지 않고, 재고가 쌓이지도 않는 만남점이에요.'],['초과수요·초과공급','수요가 공급보다 많거나, 공급이 수요보다 많은 상태예요.','가격이 너무 낮으면 품절, 너무 높으면 재고가 생기기 쉬워요.']],principle:'두 함수가 같은 곳이 균형점이에요',copy:'수요함수와 공급함수를 같다고 놓아 가격을 구하고, 그 가격을 어느 함수에 대입해 균형거래량을 구합니다.',formula:[['Qd = Qs','Q_d=Q_s'],['a−bp = c+dp','a-bp=c+dp']],example:'Qd=100−p, Qs=20+p이면 100−p=20+p에서 p=40, Q=60입니다.',warning:'균형은 “모두가 원하는 최고의 가격”이라는 뜻이 아니라 수요량과 공급량이 일치하는 시장의 상태입니다.',lab:'equilibrium',quiz:['현재 가격에서 수요량 80, 공급량 50이라면?',['30의 초과수요','30의 초과공급','균형'],0,'사려는 양이 팔려는 양보다 30 많으므로 30의 초과수요입니다.']},
  feasible:{n:'10',chapter:'Ⅱ. 함수와 경제',code:'FEASIBLE REGION',title:'균형 변화와 부등식 영역',lede:'소득·세금 변화가 균형을 움직이는 원리와 여러 조건을 동시에 만족하는 선택을 살펴봅니다.',terms:[['외생변수','모형 바깥에서 주어져 결과에 영향을 주는 조건이에요.','소득 증가나 세금 부과가 수요·공급곡선을 움직여요.'],['가능영역','여러 부등식을 동시에 만족하는 점들의 모임이에요.','예산·시간·재료 조건을 모두 지킨 생산 조합이에요.']],principle:'가능한 점 중 목적에 가장 맞는 점을 찾아요',copy:'생산량 x, y가 재료와 시간의 제한을 모두 만족해야 합니다. 각 부등식은 경계선의 한쪽 영역을 뜻합니다.',formula:[['x ≥ 0, y ≥ 0','x\\ge 0,\\quad y\\ge 0'],['2x+y ≤ 재료','2x+y\\le\\text{재료}'],['x+2y ≤ 시간','x+2y\\le\\text{시간}']],example:'재료 18, 시간 16일 때 x=6, y=5는 17≤18이고 16≤16이므로 가능한 조합입니다.',warning:'한 조건만 만족해서는 안 됩니다. 가능영역의 점은 모든 부등식을 동시에 만족해야 합니다.',lab:'feasible',quiz:['x=6, y=5일 때 2x+y≤18, x+2y≤16을 모두 만족하는가?',['만족한다.','첫 번째만 만족한다.','어느 것도 만족하지 않는다.'],0,'2×6+5=17≤18이고 6+2×5=16≤16이므로 모두 만족합니다.']},
  matrix:{n:'11',chapter:'Ⅲ. 행렬과 경제',code:'MATRIX',title:'행렬과 경제 현상',lede:'지점과 상품이 많은 자료를 행과 열로 정리하고 행렬의 곱으로 매출을 한꺼번에 계산합니다.',terms:[['행렬','수를 직사각형 모양으로 배열해 한 덩어리로 다루는 방법이에요.','행을 지점, 열을 상품으로 두면 판매표가 행렬이 돼요.'],['행렬의 곱','앞 행렬의 행과 뒤 행렬의 열을 짝지어 곱하고 더하는 계산이에요.','각 지점의 상품 수량과 가격을 묶어 총매출을 계산해요.']],principle:'행과 열에 붙인 의미를 먼저 확인해요',copy:'판매량 행렬의 한 행과 가격 열행렬을 곱하면 그 지점의 총매출이 됩니다.',formula:[['[수량 행렬] × [가격 열행렬] = [지점별 매출]','\\begin{bmatrix}q_{11}&q_{12}\\\\q_{21}&q_{22}\\end{bmatrix}\\begin{bmatrix}p_1\\\\p_2\\end{bmatrix}=\\begin{bmatrix}r_1\\\\r_2\\end{bmatrix}'],['수량 × 가격 = 지점별 매출','\\text{수량}\\times\\text{가격}=\\text{지점별 매출}']],example:'학교점이 A 30개, B 20개를 팔고 가격이 3,000원, 5,000원이면 매출은 190,000원입니다.',warning:'행렬의 곱은 같은 위치끼리만 곱하는 계산이 아닙니다. 앞 행의 값과 뒤 열의 값을 짝지어 곱한 뒤 더합니다.',lab:'matrix',quiz:['판매량 행렬의 행이 지점, 열이 상품이라면 2행 1열은?',['1번 지점의 2번 상품','2번 지점의 1번 상품','상품 가격'],1,'행은 지점, 열은 상품이므로 2행 1열은 2번 지점의 1번 상품 수량입니다.']},
  inverse:{n:'12',chapter:'Ⅲ. 행렬과 경제',code:'INVERSE MATRIX',title:'역행렬과 활용',lede:'행렬의 곱셈을 되돌리는 역행렬로 알려진 결과에서 미지의 값을 구합니다.',terms:[['역행렬','어떤 행렬과 곱했을 때 단위행렬이 되어 원래 계산을 되돌리는 행렬이에요.','곱셈에서 나눗셈과 비슷한 역할을 해요.'],['행렬식','2×2 행렬이 역행렬을 갖는지 알려주는 값이에요.','ad−bc가 0이면 정보를 되돌릴 수 없어요.']],principle:'행렬식이 0이 아니어야 되돌릴 수 있어요',copy:'A=[[a,b],[c,d]]의 행렬식 ad−bc가 0이 아니면 역행렬이 존재합니다.',formula:[['det(A) = ad−bc','\\det(A)=ad-bc'],['A⁻¹ = 1/(ad−bc) × [[d, −b], [−c, a]]','A^{-1}=\\dfrac{1}{ad-bc}\\begin{bmatrix}d&-b\\\\-c&a\\end{bmatrix}']],example:'A=[[2,1],[1,1]]이면 det(A)=1이고 역행렬은 [[1,−1],[−1,2]]입니다.',warning:'행렬식이 0이면 역행렬이 없습니다. 서로 다른 정보처럼 보이는 두 식이 실제로 같은 관계를 나타낼 수 있기 때문입니다.',lab:'inverse',quiz:['2×2 행렬의 행렬식 ad−bc가 0이면?',['항상 역행렬이 있다.','역행렬이 없다.','모든 원소가 0이다.'],1,'행렬식이 0인 행렬은 역행렬을 갖지 않습니다.']},
  derivative:{n:'13',chapter:'Ⅳ. 미분과 경제',code:'MARGINAL CHANGE',title:'미분과 그래프 개형',lede:'경제함수의 순간변화율을 한계량으로 해석하고 증가·감소를 그래프와 연결합니다.',terms:[['한계','어떤 양을 한 단위 더 늘릴 때 결과가 얼마나 변하는지 보는 관점이에요.','빵 한 개를 더 만들 때 추가되는 비용이 한계비용이에요.'],['한계이익','생산량을 아주 조금 늘릴 때 이익이 얼마나 변하는지 나타내요.','양수면 더 만들수록 이익이 늘고, 음수면 줄어들어요.']],principle:'도함수의 부호가 원래 함수의 방향을 알려줘요',copy:'이익함수 P(q)를 미분한 P′(q)는 생산량 q 근처의 한계이익입니다.',formula:[['한계이익 = P′(q)','\\text{한계이익}=P\'(q)'],['P′(q)>0 증가, P′(q)<0 감소','P\'(q)>0\\Rightarrow\\text{증가},\\quad P\'(q)<0\\Rightarrow\\text{감소}']],example:'P(q)=−q²+80q−400이면 P′(q)=−2q+80이고 q=40에서 0입니다.',warning:'도함수가 0인 모든 점이 반드시 최대는 아닙니다. 앞뒤에서 도함수의 부호가 +에서 −로 바뀌는지 확인해야 합니다.',lab:'derivative',quiz:["P′(q)가 양수인 구간에서 생산량 q가 늘어나면 이익 P(q)는?",['증가한다.','감소한다.','항상 0이다.'],0,'도함수가 양수이면 원래 함수는 그 구간에서 증가합니다.']},
  elasticity:{n:'14',chapter:'Ⅳ. 미분과 경제',code:'ELASTICITY',title:'탄력성',lede:'가격의 상대적 변화에 수요량이 얼마나 민감하게 반응하는지 비율로 측정합니다.',terms:[['가격탄력성','가격이 1% 변할 때 수요량이 몇 % 변하는지 나타내는 민감도예요.','가격을 조금 올렸는데 수요가 크게 줄면 탄력적이에요.'],['탄력적·비탄력적','탄력성의 절댓값이 1보다 크거나 작은 상태예요.','필수품은 비교적 비탄력적, 대체품이 많으면 탄력적일 수 있어요.']],principle:'단위가 아니라 퍼센트 변화끼리 비교해요',copy:'가격 변화율에 대한 수요량 변화율의 비가 가격탄력성입니다. 수요는 대체로 가격과 반대로 움직여 음수가 되므로 절댓값을 자주 사용합니다.',formula:[['E = 수요량 변화율 ÷ 가격 변화율','E=\\dfrac{\\text{수요량 변화율}}{\\text{가격 변화율}}']],example:'가격이 10% 오를 때 수요량이 20% 줄면 E=−2, 절댓값 2로 탄력적입니다.',warning:'가격이 100원 변한 것과 수요량이 100개 변한 것을 바로 나누면 단위에 따라 값이 달라집니다. 반드시 변화율을 비교합니다.',lab:'elasticity',quiz:['가격 5% 상승, 수요량 15% 감소라면 탄력성의 절댓값은?',['0.33','3','10'],1,'|−15%÷5%|=3이므로 탄력적입니다.']},
  optimization:{n:'15',chapter:'Ⅳ. 미분과 경제',code:'OPTIMIZATION',title:'최적화',lede:'함수와 미분을 이용해 이익이 가장 큰 가격이나 생산량을 찾습니다.',terms:[['최적화','주어진 조건 안에서 목적함수를 가장 크게 또는 작게 만드는 선택을 찾는 과정이에요.','같은 재료로 이익이 가장 큰 생산량을 찾는 일이에요.'],['목적함수','최대화하거나 최소화하려는 결과를 나타낸 함수예요.','기업의 이익, 소비자의 효용, 운송비용 등이 될 수 있어요.']],principle:'꼭대기 후보를 찾고 조건 안에서 비교해요',copy:'미분 가능한 이익함수에서는 도함수가 0인 지점이 최대 후보입니다. 정의역의 끝점도 함께 비교해야 합니다.',formula:[['P′(q)=0인 후보 찾기','P\'(q)=0\\;\\text{인 후보 찾기}'],['후보와 끝점의 P(q) 비교','\\text{후보와 끝점의}\\;P(q)\\;\\text{비교}']],example:'P(q)=−q²+80q−400은 q=40에서 최대 이익 1,200을 갖습니다.',warning:'수학적 최대점이 현실에서 항상 가능한 것은 아닙니다. 생산능력, 정수 수량, 법과 윤리 같은 조건도 확인해야 합니다.',lab:'optimization',quiz:['아래로 열린 이차 이익함수의 도함수가 q=40에서 0이라면 최대 후보 생산량은?',['0','40','80'],1,'아래로 열린 이차함수의 꼭짓점이므로 q=40이 최대 후보입니다.']}
};

const extraPractice = {
  indicator: [
    ['물가상승률이 8%에서 10%가 되었다. 차이와 처음 값 대비 변화율은?', ['2%포인트와 20%', '2%포인트와 25%', '25%포인트와 2%'], 1, '차이는 10−8=2%포인트이고, 처음 값 대비 변화율은 2÷8×100=25%입니다.'],
    ['실업률이 5%에서 4%로 낮아졌다는 기사를 정확히 쓰면?', ['1%포인트 하락, 처음보다 20% 감소', '1% 하락, 처음보다 1% 감소', '20%포인트 하락'], 0, '단순한 차이는 1%포인트, 처음 5%를 기준으로 한 감소율은 1÷5×100=20%입니다.']
  ],
  exchange: [
    ['환율이 1달러당 1,400원일 때 250달러를 사려면?', ['175,000원', '350,000원', '3,500,000원'], 1, '250×1,400=350,000원입니다.'],
    ['원/달러 환율이 오를 때 일반적으로 같은 달러 물건을 수입하는 사람은?', ['더 많은 원화가 필요하다.', '더 적은 원화가 필요하다.', '환율과 관계가 없다.'], 0, '1달러를 사는 데 필요한 원화가 늘어나므로 같은 달러 가격의 물건을 들여오는 원화 비용도 커집니다.']
  ],
  tax: [
    ['과세 전 금액 24,000원에 세율 10%를 적용한 세금은?', ['240원', '2,400원', '26,400원'], 1, '24,000×0.1=2,400원입니다.'],
    ['세율 10%가 포함된 총액이 11,000원이라면 과세 전 금액은?', ['9,900원', '10,000원', '10,900원'], 1, '과세 전 금액을 x라 하면 1.1x=11,000이므로 x=10,000원입니다.']
  ],
  sequence: [
    ['5, 10, 20, 40, …인 등비수열의 여섯째 항은?', ['80', '120', '160'], 2, '공비가 2이므로 다섯째 항은 80, 여섯째 항은 160입니다.'],
    ['첫 달 10만 원부터 매달 2만 원씩 늘려 6개월 저축한다. 총 저축액은?', ['60만 원', '90만 원', '120만 원'], 1, '10+12+14+16+18+20=90만 원입니다.']
  ],
  finance: [
    ['100만 원을 연 10% 복리로 2년 두면?', ['110만 원', '120만 원', '121만 원'], 2, '100만×1.1²=121만 원입니다.'],
    ['연 10% 복리일 때 2년 뒤 121만 원의 현재가치는?', ['100만 원', '110만 원', '121만 원'], 0, '121만÷1.1²=100만 원입니다.']
  ],
  cost: [
    ['고정비 4만 원, 개당 변동비 2천 원일 때 30개의 총비용은?', ['6만 원', '10만 원', '12만 원'], 1, '총비용은 40,000+2,000×30=100,000원입니다.'],
    ['가격 5천 원, 개당 변동비 2천 원, 고정비 6만 원일 때 손익분기 생산량은?', ['12개', '20개', '30개'], 1, '한 개당 고정비 회수에 기여하는 금액은 3천 원이므로 60,000÷3,000=20개입니다.']
  ],
  market: [
    ['Qd=120−2p, Qs=10+p일 때 p=30에서 시장 상태는?', ['20의 초과수요', '20의 초과공급', '균형'], 0, '수요량은 60, 공급량은 40이므로 20의 초과수요입니다.'],
    ['가격은 그대로인데 소비자의 소득 증가로 상품을 더 사려 한다면?', ['수요곡선 자체가 이동한다.', '같은 수요곡선 위에서만 움직인다.', '공급곡선만 이동한다.'], 0, '가격 이외의 조건인 소득이 변했으므로 수요량의 단순 이동이 아니라 수요곡선 자체가 이동합니다.']
  ],
  utility: [
    ['상품 A 가격 2, B 가격 1, 예산 12일 때 x=4, y=4는 가능한가?', ['가능하다.', '1만큼 초과한다.', '4만큼 초과한다.'], 0, '지출은 2×4+1×4=12이므로 예산을 정확히 사용한 가능한 조합입니다.'],
    ['효용 U=√(xy)일 때 (1,9), (4,4), (9,1) 중 효용이 가장 큰 조합은?', ['(1,9)', '(4,4)', '(9,1)'], 1, '각 효용은 3, 4, 3이므로 (4,4)가 가장 큽니다.']
  ],
  equilibrium: [
    ['Qd=120−2p, Qs=30+p일 때 균형가격과 거래량은?', ['p=20, Q=80', 'p=30, Q=60', 'p=40, Q=40'], 1, '120−2p=30+p에서 p=30이고, 어느 식에 대입해도 Q=60입니다.'],
    ['현재 가격이 균형가격보다 낮다면 일반적으로 나타나는 것은?', ['초과수요', '초과공급', '항상 균형'], 0, '낮은 가격에서는 사려는 양이 늘고 팔려는 양은 줄어 초과수요가 생기기 쉽습니다.']
  ],
  feasible: [
    ['x=4, y=5는 2x+y≤18, x+2y≤16을 만족하는가?', ['둘 다 만족한다.', '첫 조건만 만족한다.', '둘 다 만족하지 않는다.'], 0, '2×4+5=13, 4+2×5=14이므로 두 조건을 모두 만족합니다.'],
    ['이익이 3x+4y일 때 가능한 세 점 (0,8), (6,5), (9,0) 중 이익이 가장 큰 점은?', ['(0,8)', '(6,5)', '(9,0)'], 1, '이익은 각각 32, 38, 27이므로 (6,5)가 가장 큽니다.']
  ],
  matrix: [
    ['한 지점의 판매량이 [10, 4], 가격이 [3000, 5000]ᵀ일 때 매출은?', ['32,000원', '50,000원', '80,000원'], 1, '10×3,000+4×5,000=50,000원입니다.'],
    ['2×2 수량 행렬에 2×1 가격 열행렬을 곱한 결과의 크기는?', ['1×1', '2×1', '2×2'], 1, '안쪽 크기 2가 같고 바깥 크기가 남으므로 결과는 2×1 행렬입니다.']
  ],
  inverse: [
    ['행렬 [[3,1],[2,1]]의 행렬식은?', ['−1', '0', '1'], 2, '3×1−1×2=1입니다.'],
    ['행렬 [[1,2],[2,4]]로 결과를 유일하게 되돌릴 수 없는 이유는?', ['행렬식이 0이기 때문이다.', '모든 원소가 양수이기 때문이다.', '2×2 행렬이기 때문이다.'], 0, '행렬식 1×4−2×2=0이므로 역행렬이 없고 두 관계가 독립적이지 않습니다.']
  ],
  derivative: [
    ["P′(q)=60−2q일 때 q=20에서 한계이익은?", ['−20', '0', '20'], 2, 'P′(20)=60−40=20으로 양수입니다.'],
    ['어떤 지점의 앞에서는 P′>0, 뒤에서는 P′<0이라면 그 지점은?', ['이익의 최대 후보', '이익의 최소 후보', '이익이 항상 0인 점'], 0, '이익이 증가하다 감소하므로 그 지점은 최대 후보입니다.']
  ],
  elasticity: [
    ['가격이 8% 오를 때 수요량이 4% 감소하면 탄력성의 절댓값은?', ['0.5', '2', '4'], 0, '|−4%÷8%|=0.5로 비탄력적입니다.'],
    ['수요가 비탄력적인 구간에서 가격이 조금 오르면 총수입은 일반적으로?', ['늘어나는 경향이 있다.', '반드시 0이 된다.', '항상 절반이 된다.'], 0, '수요량 감소 비율보다 가격 상승 비율이 커서 다른 조건이 같다면 총수입이 늘어나는 경향이 있습니다.']
  ],
  optimization: [
    ["P(q)=−q²+60q−500일 때 P′(q)=0인 생산량은?", ['20', '30', '60'], 1, 'P′(q)=−2q+60이므로 q=30입니다.'],
    ['위 이익함수의 생산능력이 0≤q≤25라면 실제 최대 후보는?', ['q=0', 'q=25', 'q=30'], 1, '수학적 꼭짓점 q=30은 조건 밖입니다. 구간에서는 q=25까지 증가하므로 끝점 q=25가 최대 후보입니다.']
  ]
};

const pick=randomItems=>randomItems[Math.floor(Math.random()*randomItems.length)];
const shuffle=randomItems=>[...randomItems].sort(()=>Math.random()-.5);
const fmtMoney=value=>`${Math.round(value).toLocaleString('ko-KR')}원`;
function makeQuestion(question,answer,distractors,explain){
  const pool=[String(answer),...distractors.map(String)].filter((value,index,array)=>array.indexOf(value)===index);
  ['계산할 수 없다.','0','조건이 부족하다.'].forEach(value=>{if(pool.length<3&&!pool.includes(value))pool.push(value)});
  const choices=shuffle(pool).slice(0,3);
  return [question,choices,choices.indexOf(String(answer)),explain];
}

const practiceGenerators={
  indicator(){
    const [a,b]=pick([[5,7],[8,10],[10,13],[12,15]]),d=b-a,r=d/a*100;
    const [c,e]=pick([[6,5],[8,6],[10,8],[15,12]]),drop=c-e,rr=drop/c*100;
    return [
      makeQuestion(`경제지표가 ${a}%에서 ${b}%가 되었다. 차이와 변화율은?`,`${d}%포인트와 ${Number(r.toFixed(1))}%`,[`${d}%와 ${d}%`,`${Number(r.toFixed(1))}%포인트와 ${d}%`],`${b}−${a}=${d}%포인트이고, ${d}÷${a}×100=${Number(r.toFixed(1))}%입니다.`),
      makeQuestion(`실업률이 ${c}%에서 ${e}%로 낮아졌다. 정확한 표현은?`,`${drop}%포인트 하락, 처음보다 ${Number(rr.toFixed(1))}% 감소`,[`${drop}% 하락, 처음보다 ${drop}% 감소`,`${Number(rr.toFixed(1))}%포인트 하락`],`단순 차이는 ${drop}%포인트이고 처음 값 ${c}%를 기준으로 한 감소율은 ${Number(rr.toFixed(1))}%입니다.`)
    ];
  },
  exchange(){
    const dollars=pick([50,100,150,200,250]),rate=pick([1250,1300,1350,1400,1450]),krw=dollars*rate,delta=pick([50,100]);
    return [
      makeQuestion(`환율이 1달러당 ${rate.toLocaleString()}원일 때 ${dollars}달러를 사려면?`,fmtMoney(krw),[fmtMoney(krw/rate),fmtMoney(krw*10)],`${dollars}×${rate.toLocaleString()}=${krw.toLocaleString()}원입니다.`),
      makeQuestion(`같은 ${dollars}달러를 살 때 환율이 ${rate.toLocaleString()}원에서 ${(rate+delta).toLocaleString()}원으로 오르면 추가 금액은?`,fmtMoney(dollars*delta),[fmtMoney(delta),fmtMoney(dollars+delta)],`${dollars}×${delta.toLocaleString()}=${(dollars*delta).toLocaleString()}원이 더 필요합니다.`)
    ];
  },
  tax(){
    const price=pick([12000,18000,24000,35000,48000]),rate=pick([5,10,20]),tax=price*rate/100,total=price+tax;
    return [
      makeQuestion(`과세 전 금액 ${fmtMoney(price)}에 세율 ${rate}%를 적용한 세금은?`,fmtMoney(tax),[fmtMoney(price+tax),fmtMoney(tax/10)],`${price.toLocaleString()}×${rate/100}=${tax.toLocaleString()}원입니다.`),
      makeQuestion(`과세 전 금액 ${fmtMoney(price)}에 세율 ${rate}%를 적용한 세후 금액은?`,fmtMoney(total),[fmtMoney(price-tax),fmtMoney(tax)],`과세 전 금액과 세금 ${fmtMoney(tax)}을 더해 ${fmtMoney(total)}입니다.`)
    ];
  },
  sequence(){
    const a=pick([5,10,15,20]),d=pick([2,3,5]),n=pick([5,6,7]),term=a+(n-1)*d,sum=n*(a+term)/2;
    const first=pick([2,3,5]),ratio=pick([2,3]),nth=pick([4,5]),geo=first*Math.pow(ratio,nth-1);
    return [
      makeQuestion(`첫째 항 ${a}, 공차 ${d}인 등차수열의 ${n}번째 항은?`,term,[term-d,term+d],`${a}+(${n}−1)×${d}=${term}입니다.`),
      makeQuestion(`첫째 항 ${first}, 공비 ${ratio}인 등비수열의 ${nth}번째 항은?`,geo,[geo/ratio,geo+ratio],`${first}×${ratio}^${nth-1}=${geo}입니다. 참고로 앞의 등차수열 ${n}항의 합은 ${sum}입니다.`)
    ];
  },
  finance(){
    const principal=pick([500000,1000000,2000000]),rate=pick([5,10]),years=pick([2,3]),compound=Math.round(principal*Math.pow(1+rate/100,years)),simple=principal*(1+rate/100*years);
    return [
      makeQuestion(`${fmtMoney(principal)}을 연 ${rate}% 복리로 ${years}년 두면?`,fmtMoney(compound),[fmtMoney(simple),fmtMoney(principal*(1+rate/100))],`복리 미래가치는 ${principal.toLocaleString()}×${1+rate/100}^${years}=${compound.toLocaleString()}원입니다.`),
      makeQuestion(`연 ${rate}% 복리일 때 ${years}년 뒤 ${fmtMoney(compound)}의 현재가치는?`,fmtMoney(principal),[fmtMoney(simple),fmtMoney(compound-principal)],`${compound.toLocaleString()}÷${1+rate/100}^${years}=${principal.toLocaleString()}원입니다.`)
    ];
  },
  cost(){
    const fixed=pick([40000,60000,80000]),variable=pick([1000,1500,2000]),quantity=pick([20,30,40]),cost=fixed+variable*quantity;
    const margin=pick([2000,3000,4000]),breakEven=pick([15,20,25]),fixed2=margin*breakEven;
    return [
      makeQuestion(`고정비 ${fmtMoney(fixed)}, 개당 변동비 ${fmtMoney(variable)}일 때 ${quantity}개의 총비용은?`,fmtMoney(cost),[fmtMoney(variable*quantity),fmtMoney(fixed+variable)],`총비용은 ${fixed.toLocaleString()}+${variable.toLocaleString()}×${quantity}=${cost.toLocaleString()}원입니다.`),
      makeQuestion(`개당 판매가격과 변동비의 차이가 ${fmtMoney(margin)}, 고정비가 ${fmtMoney(fixed2)}라면 손익분기 판매량은?`,`${breakEven}개`,[`${breakEven-5}개`,`${breakEven+10}개`],`${fixed2.toLocaleString()}÷${margin.toLocaleString()}=${breakEven}개입니다.`)
    ];
  },
  market(){
    const a=pick([100,110,120]),c=pick([10,20,30]),p=pick([20,30,40]),qd=a-p,qs=c+p,gap=qd-qs;
    const state=gap>0?`${gap}의 초과수요`:gap<0?`${-gap}의 초과공급`:'균형';
    return [
      makeQuestion(`Qd=${a}−p, Qs=${c}+p일 때 p=${p}에서 시장 상태는?`,state,[gap>=0?`${gap}의 초과공급`:`${-gap}의 초과수요`,'항상 균형'],`수요량 ${qd}, 공급량 ${qs}이므로 ${state}입니다.`),
      pick([
        ['소비자 소득 증가로 같은 가격에서 더 많이 사려 한다면?',['수요곡선 자체가 오른쪽으로 이동한다.','같은 수요곡선 위에서만 움직인다.','공급곡선만 이동한다.'],0,'가격 이외의 조건인 소득이 변했으므로 수요곡선 자체가 이동합니다.'],
        ['생산기술 개선으로 같은 가격에서 더 많이 팔 수 있다면?',['공급곡선 자체가 오른쪽으로 이동한다.','수요곡선만 이동한다.','공급량은 반드시 감소한다.'],0,'생산기술은 가격 이외의 공급 조건이므로 공급곡선 자체를 이동시킵니다.']
      ])
    ];
  },
  utility(){
    const x=pick([2,3,4,5]),y=pick([3,4,5,6]),px=pick([2,3]),py=1,budget=px*x+py*y;
    const n=pick([3,4,5]);
    return [
      makeQuestion(`A 가격 ${px}, B 가격 ${py}, 예산 ${budget}일 때 x=${x}, y=${y}는 가능한가?`,'가능하다.',['예산을 1만큼 초과한다.','두 상품 수량이 달라 불가능하다.'],`지출은 ${px}×${x}+${py}×${y}=${budget}으로 예산을 정확히 사용합니다.`),
      makeQuestion(`U=√(xy)일 때 (1,${n*n}), (${n},${n+1}), (${n*n},1) 중 효용이 가장 큰 조합은?`,`(${n},${n+1})`,[`(1,${n*n})`,`(${n*n},1)`],`곱 xy가 각각 ${n*n}, ${n*(n+1)}, ${n*n}이므로 가운데 조합의 효용이 가장 큽니다.`)
    ];
  },
  equilibrium(){
    const pe=pick([20,30,40]),c=pick([10,20]),a=c+3*pe,q=c+pe;
    const low=pe-10,qd=a-2*low,qs=c+low;
    return [
      makeQuestion(`Qd=${a}−2p, Qs=${c}+p일 때 균형가격과 거래량은?`,`p=${pe}, Q=${q}`,[`p=${pe-10}, Q=${q+10}`,`p=${pe+10}, Q=${q-10}`],`${a}−2p=${c}+p에서 p=${pe}, Q=${q}입니다.`),
      makeQuestion(`위 시장에서 가격이 ${low}라면?`,`${qd-qs}의 초과수요`,[`${qd-qs}의 초과공급`,'균형'],`수요량 ${qd}, 공급량 ${qs}이므로 ${qd-qs}의 초과수요입니다.`)
    ];
  },
  feasible(){
    const point=pick([[3,4],[4,5],[6,5],[8,1],[9,0]]),x=point[0],y=point[1],m=2*x+y,h=x+2*y,ok=m<=18&&h<=16;
    const candidates=shuffle([[0,8],[6,5],[9,0]]),profits=candidates.map(([cx,cy])=>3*cx+4*cy),best=Math.max(...profits),bestPoint=candidates[profits.indexOf(best)];
    return [
      makeQuestion(`x=${x}, y=${y}는 2x+y≤18, x+2y≤16을 모두 만족하는가?`,ok?'만족한다.':'만족하지 않는다.',[ok?'첫 번째만 만족한다.':'항상 만족한다.',ok?'어느 것도 만족하지 않는다.':'x,y가 양수라서 판단할 수 없다.'],`두 식의 왼쪽은 각각 ${m}, ${h}이므로 ${ok?'두 조건을 모두 만족합니다.':'적어도 한 조건을 넘습니다.'}`),
      makeQuestion(`이익이 3x+4y일 때 세 점 ${candidates.map(p=>`(${p[0]},${p[1]})`).join(', ')} 중 가장 큰 점은?`,`(${bestPoint[0]},${bestPoint[1]})`,candidates.filter(p=>p!==bestPoint).map(p=>`(${p[0]},${p[1]})`),`각 점을 3x+4y에 대입해 비교하면 최댓값은 ${best}입니다.`)
    ];
  },
  matrix(){
    const q1=pick([8,10,12,15]),q2=pick([3,4,5,6]),p1=pick([2000,3000,4000]),p2=pick([5000,6000]),revenue=q1*p1+q2*p2;
    return [
      makeQuestion(`판매량 [${q1}, ${q2}], 가격 [${p1}, ${p2}]ᵀ일 때 매출은?`,fmtMoney(revenue),[fmtMoney(q1*p1),fmtMoney(q2*p2)],`${q1}×${p1.toLocaleString()}+${q2}×${p2.toLocaleString()}=${revenue.toLocaleString()}원입니다.`),
      pick([
        ['3×2 수량 행렬에 2×1 가격 열행렬을 곱하면 결과의 크기는?',['3×1','2×2','3×2'],0,'안쪽 크기 2가 같고 바깥 크기 3과 1이 남습니다.'],
        ['2×3 수량 행렬에 곱할 수 있는 가격 열행렬의 크기는?',['3×1','2×1','1×3'],0,'앞 행렬의 열 수 3과 뒤 행렬의 행 수 3이 같아야 합니다.']
      ])
    ];
  },
  inverse(){
    const a=pick([2,3,4]),b=pick([1,2]),c=pick([1,2,3]),d=pick([1,2,3]),det=a*d-b*c;
    const aa=det===0?a+1:a,safeDet=aa*d-b*c;
    return [
      makeQuestion(`행렬 [[${aa},${b}],[${c},${d}]]의 행렬식은?`,safeDet,[safeDet+1,safeDet-1],`${aa}×${d}−${b}×${c}=${safeDet}입니다.`),
      pick([
        ['행렬 [[1,2],[2,4]]에 역행렬이 없는 이유는?',['행렬식이 0이기 때문이다.','모든 원소가 양수이기 때문이다.','정사각행렬이기 때문이다.'],0,'두 번째 행이 첫 번째 행의 2배라 독립적인 정보가 아니며 행렬식도 0입니다.'],
        ['행렬식이 0이 아닌 행렬로 결과를 되돌릴 때 필요한 것은?',['역행렬','전치행렬만','모든 원소의 합'],0,'역행렬을 곱하면 행렬 곱셈 관계를 되돌릴 수 있습니다.']
      ])
    ];
  },
  derivative(){
    const a=pick([40,60,80,100]),q=pick([10,15,20,25]),m=a-2*q;
    return [
      makeQuestion(`P′(q)=${a}−2q일 때 q=${q}에서 한계이익은?`,m,[m+10,m-10],`${a}−2×${q}=${m}입니다.`),
      pick([
        ['어떤 점의 앞에서 P′>0, 뒤에서 P′<0이라면?',['이익의 최대 후보','이익의 최소 후보','이익이 항상 0인 점'],0,'이익이 증가하다 감소하므로 최대 후보입니다.'],
        ['현재 생산량에서 한계이익이 음수라면 생산량을 조금 늘릴 때?', ['총이익이 감소한다.','총이익이 반드시 0이다.','총이익이 항상 증가한다.'],0,'도함수가 음수인 구간에서는 원래 이익함수가 감소합니다.']
      ])
    ];
  },
  elasticity(){
    const p=pick([4,5,8,10]),ratio=pick([.5,1,2,3]),q=p*ratio,kind=ratio>1?'탄력적':ratio<1?'비탄력적':'단위탄력적';
    return [
      makeQuestion(`가격이 ${p}% 오를 때 수요량이 ${q}% 감소하면 탄력성의 절댓값은?`,ratio,[ratio+1,Math.abs(ratio-0.5)],`|−${q}%÷${p}%|=${ratio}로 ${kind}입니다.`),
      makeQuestion(`가격탄력성의 절댓값이 ${ratio}라면 판정은?`,kind,['탄력성과 무관',kind==='탄력적'?'비탄력적':'탄력적'],`절댓값이 1보다 크면 탄력적, 작으면 비탄력적, 같으면 단위탄력적입니다.`)
    ];
  },
  optimization(){
    const optimum=pick([20,30,40,50]),a=2*optimum,capacity=optimum-pick([5,10]);
    return [
      makeQuestion(`P(q)=−q²+${a}q−500일 때 P′(q)=0인 생산량은?`,optimum,[optimum/2,a],`P′(q)=−2q+${a}이므로 q=${optimum}입니다.`),
      makeQuestion(`위 이익함수의 생산능력이 0≤q≤${capacity}라면 실제 최대 후보는?`,capacity,[optimum,0],`수학적 꼭짓점 ${optimum}은 조건 밖이고, 허용 구간에서는 ${capacity}까지 증가하므로 끝점이 최대 후보입니다.`)
    ];
  }
};

const order=Object.keys(topics);const params=new URLSearchParams(location.search);const id=topics[params.get('id')]?params.get('id'):'indicator';const t=topics[id];document.title=`${t.title} · 경제수학 · JP Math Lab`;
const $=s=>document.querySelector(s);$('[data-code]').textContent=`${t.n} · ${t.code}`;$('[data-title]').textContent=t.title;$('[data-lede]').textContent=t.lede;$('[data-chapter]').textContent=t.chapter;$('[data-principle-title]').textContent=t.principle;$('[data-principle-copy]').textContent=t.copy;$('[data-formula]').innerHTML=t.formula.map(line=>`<span class="formula-line" data-tex-raw="${line[1].replace(/"/g,'&quot;')}">${line[0]}</span>`).join('');$('[data-example]').textContent=t.example;$('[data-warning]').textContent=t.warning;$('[data-lab-title]').textContent=`${t.title} 실험실`;
$('[data-terms]').innerHTML=t.terms.map((x,i)=>`<article class="term-card"><header><h3>${x[0]}</h3><span>WORD ${String(i+1).padStart(2,'0')}</span></header><p>${x[1]}</p><aside><b>생활 장면</b> · ${x[2]}</aside></article>`).join('');

function showTab(key){document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===key));document.querySelectorAll('[data-panel]').forEach(p=>{const on=p.dataset.panel===key;p.hidden=!on;p.classList.toggle('active',on)});scrollTo({top:document.querySelector('.tabs').offsetTop-12,behavior:'smooth'})}document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>showTab(b.dataset.go));
const won=n=>`${Math.round(n).toLocaleString('ko-KR')}원`;const num=n=>Number(n).toLocaleString('ko-KR',{maximumFractionDigits:2});const lab=$('[data-lab]');
const range=(label,name,min,max,value,step=1,suffix='')=>`<label class="control"><span>${label}<output data-o="${name}">${num(value)}${suffix}</output></span><input type="range" min="${min}" max="${max}" value="${value}" step="${step}" data-i="${name}"></label>`;
const number=(label,name,value,min=0,step=1)=>`<label class="control"><span>${label}</span><input type="number" value="${value}" min="${min}" step="${step}" data-i="${name}"></label>`;
const board=(items)=>`<div class="result-board">${items.map((x,i)=>`<div${i===items.length-1?' class="accent"':''}><small>${x[0]}</small><strong data-r="${x[1]}">-</strong></div>`).join('')}</div><p class="coach" data-coach></p>`;
function bind(calc){lab.querySelectorAll('[data-i]').forEach(input=>input.addEventListener('input',()=>{const out=lab.querySelector(`[data-o="${input.dataset.i}"]`);if(out)out.textContent=num(input.value)+(input.dataset.i==='rate'||input.dataset.i==='growth'?'%':'');calc()}));calc()}
function setR(k,v){const e=lab.querySelector(`[data-r="${k}"]`);if(e)e.textContent=v}function val(k){return Number(lab.querySelector(`[data-i="${k}"]`).value)||0}function coach(s){lab.querySelector('[data-coach]').textContent=s}

const labs={
indicator(){lab.innerHTML=`<div class="control-grid two">${range('이전 퍼센트','old',1,20,4,.5,'%')}${range('새 퍼센트','new',1,20,6,.5,'%')}</div>${board([['단순한 차이','point'],['처음 값 대비 변화율','change']])}`;bind(()=>{const a=val('old'),b=val('new'),d=b-a;setR('point',`${num(d)}%p`);setR('change',`${num(d/a*100)}%`);coach(`${a}%에서 ${b}%로 변하면 ${num(d)}%포인트, 처음 값에 비해서는 ${num(d/a*100)}% 변화입니다.`)})},
exchange(){lab.innerHTML=`<div class="control-grid two">${range('환전할 달러','dollar',10,1000,100,10,'달러')}${range('1달러당 환율','ratex',900,1800,1380,10,'원')}</div>${board([['필요한 원화','krw'],['환율 100원 상승 시 추가금','extra']])}`;bind(()=>{const d=val('dollar'),r=val('ratex');setR('krw',won(d*r));setR('extra',won(d*100));coach(`환율 ${num(r)}원에서 ${num(d)}달러를 사려면 ${won(d*r)}이 필요합니다.`)})},
tax(){lab.innerHTML=`<div class="control-grid two">${range('세전 가격','price',1000,100000,8000,1000,'원')}${range('세율','rate',0,30,10,1,'%')}</div>${board([['세금','tax'],['세후 가격','total']])}`;bind(()=>{const p=val('price'),r=val('rate')/100;setR('tax',won(p*r));setR('total',won(p*(1+r)));coach(`${p.toLocaleString()}×${r}=${(p*r).toLocaleString()}이므로 세후 가격은 ${won(p*(1+r))}입니다.`)})},
sequence(){lab.innerHTML=`<div class="control-grid">${range('첫째 항','first',1,100,10,1)}${range('공차','diff',-10,20,2,1)}${range('몇 번째 항','nth',1,20,6,1)}</div>${board([['n번째 항','term'],['첫 항부터 n항까지 합','sum']])}`;bind(()=>{const a=val('first'),d=val('diff'),n=val('nth');setR('term',num(a+(n-1)*d));setR('sum',num(n*(2*a+(n-1)*d)/2));coach(`${n}번째 항은 ${a}+(${n}−1)×${d}=${a+(n-1)*d}입니다.`)})},
finance(){lab.innerHTML=`<div class="control-grid">${range('원금','principal',100000,5000000,1000000,100000,'원')}${range('연 이자율','rate',1,15,5,.5,'%')}${range('기간','years',1,20,3,1,'년')}</div>${board([['단리 원리합계','simple'],['복리 원리합계','compound'],['복리의 추가 이자','gap']])}`;bind(()=>{const p=val('principal'),r=val('rate')/100,n=val('years'),s=p*(1+r*n),c=p*(1+r)**n;setR('simple',won(s));setR('compound',won(c));setR('gap',won(c-s));coach(`${n}년 뒤 복리는 ${won(c)}으로, 같은 조건의 단리보다 ${won(c-s)} 더 큽니다.`)})},
cost(){lab.innerHTML=`<div class="control-grid">${range('생산·판매량','q',0,150,50,5,'개')}${range('한 개 가격','unitprice',1000,8000,4000,100,'원')}${range('한 개 변동비','variable',500,5000,1500,100,'원')}</div>${board([['매출','revenue'],['총비용 (고정비 5만원)','cost'],['이익','profit']])}`;bind(()=>{const q=val('q'),p=val('unitprice'),v=val('variable'),r=q*p,c=50000+q*v;setR('revenue',won(r));setR('cost',won(c));setR('profit',won(r-c));coach(r-c>=0?`매출에서 비용을 빼면 ${won(r-c)}이 남습니다.`:`비용이 매출보다 ${won(c-r)} 큽니다. 손익분기점을 넘지 못했습니다.`)})},
market(){marketLab(false)},equilibrium(){marketLab(true)},
utility(){lab.innerHTML=`<div class="control-grid two">${range('상품 A 수량 (개당 2)','x',0,10,5,1,'개')}${range('상품 B 수량 (개당 1)','y',0,20,10,1,'개')}</div>${board([['총지출','spend'],['예산 20의 남은 돈','left'],['효용 <span data-tex-raw="\\sqrt{xy}">√(xy)</span>','utility']])}`;bind(()=>{const x=val('x'),y=val('y'),s=2*x+y;setR('spend',num(s));setR('left',num(20-s));setR('utility',num(Math.sqrt(x*y)));coach(s<=20?`예산 안의 소비 조합입니다. 효용은 ${num(Math.sqrt(x*y))}입니다.`:`예산을 ${num(s-20)}만큼 초과했습니다. 가능한 소비 조합이 아닙니다.`)})},
feasible(){lab.innerHTML=`<div class="control-grid two">${range('상품 A 생산량 x','x',0,12,6,1,'개')}${range('상품 B 생산량 y','y',0,12,5,1,'개')}</div>${board([['재료 사용 <span data-tex-raw="2x+y">2x+y</span> / 18','material'],['시간 사용 <span data-tex-raw="x+2y">x+2y</span> / 16','time'],['예상 이익 <span data-tex-raw="3x+4y">3x+4y</span>','profit']])}`;bind(()=>{const x=val('x'),y=val('y'),m=2*x+y,h=x+2*y,ok=m<=18&&h<=16;setR('material',num(m));setR('time',num(h));setR('profit',num(3*x+4*y));coach(ok?'두 제약을 모두 만족하는 가능영역 안의 점입니다.':'적어도 한 제약을 넘었습니다. 가능영역 밖의 점입니다.')})},
matrix(){lab.innerHTML=`<div class="matrix-row"><div class="matrix-label"><small>판매량 Q</small><div class="matrix"><input data-i="a" type="number" value="30"><input data-i="b" type="number" value="20"><input data-i="c" type="number" value="18"><input data-i="d" type="number" value="28"></div></div><span class="op">×</span><div class="matrix-label"><small>가격 P</small><div class="matrix one-col"><input data-i="p1" type="number" value="3000"><input data-i="p2" type="number" value="5000"></div></div><span class="op">=</span><div class="matrix-label"><small>지점별 매출</small><div class="matrix one-col"><output data-r="r1"></output><output data-r="r2"></output></div></div></div><p class="coach" data-coach></p>`;bind(()=>{const r1=val('a')*val('p1')+val('b')*val('p2'),r2=val('c')*val('p1')+val('d')*val('p2');setR('r1',won(r1));setR('r2',won(r2));coach(`첫째 행은 1번 지점 매출 ${won(r1)}, 둘째 행은 2번 지점 매출 ${won(r2)}이 됩니다.`)})},
inverse(){lab.innerHTML=`<div class="matrix-row"><div class="matrix-label"><small>행렬 A</small><div class="matrix"><input data-i="a" type="number" value="2"><input data-i="b" type="number" value="1"><input data-i="c" type="number" value="1"><input data-i="d" type="number" value="1"></div></div><span class="op">→</span><div class="matrix-label"><small>역행렬 <span data-tex-raw="A^{-1}">A⁻¹</span></small><div class="matrix"><output data-r="i1"></output><output data-r="i2"></output><output data-r="i3"></output><output data-r="i4"></output></div></div></div>${board([['행렬식 <span data-tex-raw="ad-bc">ad−bc</span>','det']])}`;bind(()=>{const a=val('a'),b=val('b'),c=val('c'),d=val('d'),det=a*d-b*c;setR('det',num(det));if(det){[['i1',d/det],['i2',-b/det],['i3',-c/det],['i4',a/det]].forEach(x=>setR(x[0],num(x[1])));coach(`행렬식이 ${det}로 0이 아니므로 역행렬이 있습니다.`)}else{['i1','i2','i3','i4'].forEach(k=>setR(k,'없음'));coach('행렬식이 0이므로 역행렬이 없습니다.')}})},
derivative(){curveLab(false)},optimization(){curveLab(true)},
elasticity(){lab.innerHTML=`<div class="control-grid">${range('가격 변화율','pchange',-30,30,10,1,'%')}${range('수요량 변화율','qchange',-50,50,-20,1,'%')}</div>${board([['탄력성 E','e'],['탄력성 절댓값','abs'],['판정','type']])}`;bind(()=>{const p=val('pchange'),q=val('qchange');if(!p){setR('e','정의 안 됨');setR('abs','-');setR('type','-');coach('가격 변화율이 0이면 이 비율로 탄력성을 계산할 수 없습니다.');return}const e=q/p,a=Math.abs(e);setR('e',num(e));setR('abs',num(a));setR('type',a>1?'탄력적':a<1?'비탄력적':'단위탄력적');coach(`수요량 변화율 ${q}%를 가격 변화율 ${p}%로 나눈 값은 ${num(e)}입니다.`)})}
};
function marketLab(equilibrium){lab.innerHTML=`<div class="control-grid two">${range('수요 절편 a','demanda',70,140,100,5)}${range('공급 절편 c','supplyc',0,60,20,5)}</div><canvas class="math-canvas" width="820" height="300" data-canvas></canvas>${board([['균형가격','ep'],['균형거래량','eq']])}`;const draw=()=>{const a=val('demanda'),c=val('supplyc'),p=(a-c)/2,q=(a+c)/2;setR('ep',num(p));setR('eq',num(q));coach(equilibrium?`Qd=Qs가 되는 가격은 ${num(p)}, 거래량은 ${num(q)}입니다.`:`수요곡선은 내려가고 공급곡선은 올라가며 (${num(q)}, ${num(p)})에서 만납니다.`);const cv=lab.querySelector('canvas'),x=cv.getContext('2d'),W=cv.width,H=cv.height,pad=45;x.clearRect(0,0,W,H);x.strokeStyle='#d9ded9';x.lineWidth=1;for(let i=0;i<6;i++){const yy=pad+i*(H-2*pad)/5;x.beginPath();x.moveTo(pad,yy);x.lineTo(W-pad,yy);x.stroke()}x.strokeStyle='#44534b';x.lineWidth=2;x.beginPath();x.moveTo(pad,H-pad);x.lineTo(W-pad,H-pad);x.moveTo(pad,H-pad);x.lineTo(pad,pad);x.stroke();const sx=v=>pad+v/140*(W-2*pad),sy=v=>H-pad-v/100*(H-2*pad);x.strokeStyle='#c25f34';x.lineWidth=4;x.beginPath();x.moveTo(sx(Math.max(0,a-100)),sy(100));x.lineTo(sx(a),sy(0));x.stroke();x.strokeStyle='#168068';x.beginPath();x.moveTo(sx(Math.max(0,c)),sy(0));x.lineTo(sx(Math.min(140,c+100)),sy(100));x.stroke();x.fillStyle='#17211d';x.beginPath();x.arc(sx(q),sy(p),7,0,Math.PI*2);x.fill();x.font='600 13px IBM Plex Sans KR';x.fillText('균형',sx(q)+11,sy(p)-10)};bind(draw)}
function curveLab(opt){lab.innerHTML=`<div class="control-grid two">${range('생산량 q','q',0,80,opt?40:25,1,'개')}${range('수요 강도 a','strength',60,100,80,5)}</div><canvas class="math-canvas" width="820" height="300" data-canvas></canvas>${board([['현재 이익 <span data-tex-raw="P(q)">P(q)</span>','profit'],['한계이익 <span data-tex-raw="P\'(q)">P′(q)</span>','marginal'],['최적 생산량','optimal']])}`;const draw=()=>{const q=val('q'),a=val('strength'),P=x=>-x*x+a*x-400,M=x=>-2*x+a,o=a/2;setR('profit',num(P(q)));setR('marginal',num(M(q)));setR('optimal',num(o));coach(Math.abs(q-o)<2?'한계이익이 0에 가까운 이익의 꼭대기입니다.':q<o?'한계이익이 양수라 생산량을 늘리면 이익이 증가합니다.':'한계이익이 음수라 생산량을 더 늘리면 이익이 감소합니다.');const cv=lab.querySelector('canvas'),c=cv.getContext('2d'),W=cv.width,H=cv.height,pad=45,min=-500,max=1800,sx=x=>pad+x/80*(W-2*pad),sy=y=>H-pad-(y-min)/(max-min)*(H-2*pad);c.clearRect(0,0,W,H);c.strokeStyle='#d9ded9';c.lineWidth=1;for(let i=0;i<6;i++){let yy=pad+i*(H-2*pad)/5;c.beginPath();c.moveTo(pad,yy);c.lineTo(W-pad,yy);c.stroke()}c.strokeStyle='#168068';c.lineWidth=4;c.beginPath();for(let x=0;x<=80;x++){const X=sx(x),Y=sy(P(x));x?c.lineTo(X,Y):c.moveTo(X,Y)}c.stroke();c.fillStyle='#c25f34';c.beginPath();c.arc(sx(q),sy(P(q)),7,0,Math.PI*2);c.fill();c.fillStyle='#17211d';c.font='600 13px IBM Plex Sans KR';c.fillText(`q=${q}`,sx(q)+10,sy(P(q))-9)};bind(draw)}
(labs[t.lab]||labs.indicator)();

const practiceLevels=['01 · 기본 개념','02 · 계산 연습','03 · 상황 적용'];
const createPracticeSet=()=>[t.quiz,...(practiceGenerators[id]?practiceGenerators[id]():extraPractice[id])];
let practice=createPracticeSet();
const answers=$('[data-answers]');
let practiceIndex=0;
let practiceChoices=Array(practice.length).fill(null);

function paintPracticeAnswer(){
  const [,choices,correct,explain]=practice[practiceIndex];
  const selected=practiceChoices[practiceIndex];
  answers.innerHTML=choices.map((choice,index)=>`<button type="button" data-choice="${index}">${String.fromCharCode(65+index)}. ${choice}</button>`).join('');
  const feedback=$('[data-feedback]');
  feedback.hidden=selected===null;
  feedback.classList.toggle('wrong',selected!==null&&selected!==correct);
  if(selected!==null){
    answers.querySelectorAll('button').forEach((button,index)=>{
      button.disabled=true;
      button.classList.toggle('correct',index===correct);
      button.classList.toggle('wrong',index===selected&&selected!==correct);
    });
    feedback.innerHTML=`<b>${selected===correct?'정답입니다!':'원리를 다시 연결해 봅시다.'}</b><br>${explain}`;
  }else{
    answers.querySelectorAll('button').forEach(button=>button.onclick=()=>answerPractice(Number(button.dataset.choice)));
  }
  $('[data-practice-next]').disabled=selected===null;
}

function renderPractice(){
  const [question]=practice[practiceIndex];
  $('[data-question]').textContent=question;
  $('[data-practice-level]').textContent=practiceLevels[practiceIndex];
  $('[data-practice-progress]').textContent=`${practiceIndex+1} / ${practice.length}`;
  $('[data-practice-meter]').style.width=`${(practiceIndex+1)/practice.length*100}%`;
  $('[data-practice-prev]').disabled=practiceIndex===0;
  $('[data-practice-next]').textContent=practiceIndex===practice.length-1?'학습 결과 보기 →':'다음 문제 →';
  paintPracticeAnswer();
}

function answerPractice(choice){
  if(practiceChoices[practiceIndex]!==null)return;
  practiceChoices[practiceIndex]=choice;
  paintPracticeAnswer();
}

function showPracticeSummary(){
  const score=practiceChoices.reduce((sum,choice,index)=>sum+(choice===practice[index][2]?1:0),0);
  const summary=$('[data-practice-summary]');
  summary.hidden=false;
  summary.innerHTML=score===3
    ? `<b>3문제 모두 해결했습니다.</b><p>용어, 계산, 실제 상황을 같은 원리로 연결했습니다. 다음 개념으로 넘어가도 좋습니다.</p>`
    : score===2
      ? `<b>3문제 중 2문제를 해결했습니다.</b><p>틀린 문제의 해설을 한 번 더 읽고, 실험실의 값을 바꾸어 확인하면 개념이 더 단단해집니다.</p>`
      : `<b>3문제 중 ${score}문제를 해결했습니다.</b><p>다음 개념으로 급히 넘어가기보다 용어와 원리 탭을 다시 보고 세 문제를 한 번 더 풀어보세요.</p>`;
  $('[data-finish-actions]').hidden=false;
  summary.scrollIntoView({behavior:'smooth',block:'center'});
}

$('[data-practice-prev]').onclick=()=>{if(practiceIndex>0){practiceIndex-=1;renderPractice()}};
$('[data-practice-next]').onclick=()=>{if(practiceChoices[practiceIndex]===null)return;if(practiceIndex<practice.length-1){practiceIndex+=1;renderPractice()}else showPracticeSummary()};
$('[data-retry]').onclick=()=>{practice=createPracticeSet();practiceIndex=0;practiceChoices=Array(practice.length).fill(null);$('[data-practice-summary]').hidden=true;$('[data-finish-actions]').hidden=true;renderPractice()};
const ni=order.indexOf(id)+1,next=$('[data-next-topic]');if(ni<order.length)next.href=`경제수학_학습.html?id=${order[ni]}`;else{next.href='교과서학습.html';next.textContent='개념 목록으로 →'}
renderPractice();
