import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { classifySeed } from './seed-classify.mjs';

const ROOT = process.cwd();
const TOPIC_DIR = path.join(ROOT, '주제탐구');

function loadBrowserData(file, context) {
  const source = fs.readFileSync(path.join(TOPIC_DIR, file), 'utf8');
  vm.runInContext(source, context, { filename: file });
}

const context = vm.createContext({ window: {} });
loadBrowserData('seeds-bank.js', context);
loadBrowserData('seeds.js', context);

const originalSeeds = context.window.JPSeeds.seeds || [];
const bankSeeds = context.window.JPSeedsBank || [];

const GROUPS = {
  algebra: [
    ['common', '등식 변형은 어디까지 자유로운가', '등식,동치변형', '양변에 가하는 연산'],
    ['common', '0으로 나눌 수 없는 이유', '나눗셈,역원', '분모와 나누는 수'],
    ['common', '0.999…와 1이 같은 수인 이유', '무한소수,극한', '소수의 자리 수'],
    ['algebra', '음수의 제곱근에서 복소수가 태어나는 과정', '복소수,방정식', '제곱근의 범위'],
    ['common', '유리수와 무리수의 소수 표현', '유리수,무리수', '순환 여부와 자리 수'],
    ['calc', '자연상수 e를 정의하는 서로 다른 방법', '자연상수 e,수열의 극한', '극한식과 급수'],
    ['culture', '원주율 π의 끝없는 소수와 기하적 의미', '원주율,무리수', '원의 크기'],
    ['algebra', 'n제곱근의 개수와 값의 선택', '거듭제곱근,복소수', '지수와 정의역'],
    ['algebra', '인수정리가 근을 찾아내는 방식', '인수정리,다항식', '근과 인수'],
    ['algebra', '나머지정리가 대입 한 번으로 나눗셈을 대신하는 이유', '나머지정리,다항식', '나누는 식'],
    ['algebra', '다항식의 차수와 근의 개수', '다항방정식,근', '차수와 계수'],
    ['calc', '중근의 차수와 그래프의 통과·접촉', '중근,함수의 그래프', '근의 중복도'],
    ['algebra', '근과 계수의 관계가 방정식을 압축하는 방식', '근과 계수의 관계,대칭식', '근의 합과 곱'],
    ['algebra', '판별식이 교점과 근의 개수를 알려 주는 이유', '판별식,이차방정식', '계수와 매개변수'],
    ['algebra', '다항함수의 대칭성과 계수의 관계', '다항함수,대칭', '홀수항과 짝수항'],
    ['algebra', '합성함수에서 순서가 중요한 이유', '합성함수,함수', '합성 순서'],
    ['algebra', '역함수가 존재하기 위한 정확한 조건', '역함수,일대일대응', '정의역과 치역'],
    ['common', '절댓값이 만드는 구간과 꺾임', '절댓값,구간', '기준점과 부호'],
    ['algebra', '가우스 함수의 계단과 불연속', '가우스 함수,불연속', '정수 경계'],
    ['algebra', '조각함수가 한 함수가 되는 연결 조건', '조각함수,연속', '경계점의 식'],
    ['algebra', '지수함수의 배가 시간과 성장률', '지수함수,성장', '밑과 증가율'],
    ['algebra', '로그가 지수의 역연산이 되는 구조', '로그함수,역함수', '밑과 진수'],
    ['culture', '로그 눈금이 큰 범위를 압축하는 방식', '로그,척도', '밑과 단위'],
    ['common', '등차수열에서 일정한 차이가 만드는 직선성', '등차수열,일차함수', '공차와 항 번호'],
    ['common', '등비수열에서 일정한 비가 만드는 지수성', '등비수열,지수함수', '공비와 항 번호'],
    ['algebra', '점화식과 일반항이 같은 수열을 보는 두 방식', '점화식,일반항', '초기값과 규칙'],
    ['algebra', '망원급수에서 중간항이 사라지는 이유', '급수,부분분수', '부분합의 항 수'],
    ['common', '수학적 귀납법이 무한히 많은 명제를 증명하는 방식', '수학적 귀납법,자연수', '시작점과 귀납 단계'],
    ['algebra', '이항정리의 계수가 조합과 만나는 이유', '이항정리,조합', '지수와 항 번호'],
    ['algebra', '파스칼 삼각형 속 여러 수열', '파스칼 삼각형,조합', '행과 열'],
    ['algebra', '유한차분으로 다항식의 차수를 읽는 방법', '유한차분,다항식', '차분 횟수'],
    ['ai', '나머지 연산이 만드는 주기와 시계 산술', '합동식,나머지', '법과 나머지'],
    ['ai', '유클리드 호제법이 최대공약수를 보존하는 이유', '최대공약수,유클리드 호제법', '두 자연수'],
    ['algebra', '소수의 분포에서 규칙과 불규칙이 공존하는 이유', '소수,수론', '수의 범위'],
    ['algebra', '정수해를 갖는 방정식의 특별한 조건', '디오판토스 방정식,정수해', '계수와 범위'],
    ['algebra', '산술평균과 기하평균 부등식의 등호 조건', '산술기하평균,부등식', '두 수의 비'],
    ['algebra', '코시-슈바르츠 부등식의 기하적 의미', '코시-슈바르츠 부등식,벡터', '벡터의 방향'],
    ['calc', '볼록성이 평균과 함수값의 순서를 정하는 이유', '볼록함수,젠센 부등식', '점의 위치와 가중치'],
    ['geo', '삼각부등식이 거리의 기본 규칙이 되는 이유', '삼각부등식,거리', '세 점의 위치'],
    ['algebra', '연립방정식의 해와 그래프의 교점', '연립방정식,교점', '계수와 상수항'],
    ['geo', '행렬식이 넓이와 해의 유일성을 동시에 말하는 이유', '행렬식,넓이', '행렬의 성분'],
    ['ai', '고유벡터가 변환 뒤에도 방향을 지키는 이유', '고유벡터,선형변환', '변환 행렬'],
    ['algebra', '복소수의 곱셈이 회전과 확대가 되는 이유', '복소평면,극형식', '편각과 절댓값'],
    ['algebra', '1의 거듭제곱근이 원 위에 놓이는 이유', '복소수,단위원', '근의 차수'],
    ['algebra', '셀 수 있는 무한과 셀 수 없는 무한', '집합,무한', '대응 방법']
  ],
  calculus: [
    ['calc', '순간변화율을 평균변화율의 극한으로 정의하는 이유', '미분계수,극한', '시간 간격'],
    ['calc', '극한의 엄밀한 정의에서 오차를 통제하는 방법', '극한,오차', '허용 오차'],
    ['calc', '무한히 가까워진다는 말의 수학적 의미', '수열의 극한,함수의 극한', '접근 방향'],
    ['calc', '0/0과 무한/무한 꼴이 값을 정하지 못하는 이유', '부정형,극한', '분자와 분모의 속도'],
    ['calc', '연속이라는 조건이 그래프에 보장하는 것', '연속함수,극한', '경계점'],
    ['calc', '미분 가능하면 연속이지만 역은 아닌 이유', '미분가능성,연속성', '접속 방식'],
    ['calc', '모서리·첨점·수직접선에서 미분이 실패하는 방식', '미분가능성,접선', '좌우 기울기'],
    ['calc', '중간값정리가 해의 존재를 보장하는 방식', '중간값정리,연속함수', '구간과 함수값'],
    ['calc', '닫힌구간에서 최댓값과 최솟값이 존재하는 이유', '최대최소정리,연속함수', '구간의 닫힘'],
    ['calc', '도함수가 국소적인 일차근사가 되는 이유', '도함수,선형근사', '확대 배율'],
    ['calc', '미분하면 다항식의 차수가 하나 내려가는 이유', '거듭제곱 미분,다항함수', '지수와 차수'],
    ['calc', '곱의 미분법에 교차항이 생기는 이유', '곱의 미분법,증분', '두 함수의 변화량'],
    ['calc', '몫의 미분법에서 분모가 제곱되는 이유', '몫의 미분법,비율', '분자와 분모'],
    ['calc', '합성함수 미분법이 변화율을 곱하는 이유', '연쇄법칙,합성함수', '안쪽 함수의 변화'],
    ['calc', '역함수의 미분계수가 역수가 되는 조건', '역함수 미분,일대일함수', '접선의 기울기'],
    ['calc', '할선이 접선으로 가까워지는 과정', '할선,접선', '두 점 사이 간격'],
    ['calc', '삼차함수 밖의 한 점에서 그은 접선의 개수', '삼차함수,접선', '점의 위치'],
    ['calc', '접선과 곡선의 교점 중복도가 말해 주는 것', '접선,중근', '접촉 차수'],
    ['calc', '도함수의 부호만으로 원함수의 모양을 복원하는 방법', '도함수의 부호,증가감소', '부호 구간'],
    ['calc', '도함수가 0이어도 극값이 아닐 수 있는 이유', '정지점,극값', '부호 변화'],
    ['calc', '변곡점과 이계도함수 0이 서로 다른 조건인 이유', '변곡점,이계도함수', '오목과 볼록'],
    ['calc', '삼차함수의 계수가 그래프 모양을 바꾸는 방식', '삼차함수,도함수', '계수'],
    ['calc', '사차함수가 가질 수 있는 극값의 개수', '사차함수,극값', '도함수의 근'],
    ['calc', '롤의 정리에서 양 끝 함수값이 같아야 하는 이유', '롤의 정리,접선', '끝점의 함수값'],
    ['calc', '평균값정리가 평균 기울기와 순간 기울기를 연결하는 방식', '평균값정리,미분', '구간'],
    ['calc', '뉴턴 방법이 접선으로 근을 찾아가는 원리', '뉴턴 방법,접선', '초기값'],
    ['calc', '최적화 문제에서 경계와 임계점을 모두 보는 이유', '최대최소,최적화', '제약조건'],
    ['calc', '서로 변하는 양의 관계를 미분으로 추적하는 방법', '관련변화율,미분', '시간과 변수'],
    ['calc', '위치·속도·가속도 그래프가 서로 정보를 주고받는 방식', '속도,가속도', '시간'],
    ['calc', '가속도의 부호와 속력의 증가가 일치하지 않는 이유', '가속도,속력', '속도의 방향'],
    ['calc', '누적함수의 순간변화율이 원래 함수가 되는 이유', '누적함수,미적분의 기본정리', '누적 상한'],
    ['calc', '리만합이 넓이를 수로 바꾸는 과정', '리만합,정적분', '분할 개수'],
    ['calc', '미분과 적분이 서로 역연산이 되는 이유', '미적분의 기본정리,누적', '적분 구간'],
    ['calc', '부호 있는 넓이와 실제 도형의 넓이가 다른 이유', '정적분,넓이', '함수의 부호'],
    ['calc', '변위와 이동거리가 적분에서 달라지는 이유', '속도 적분,이동거리', '방향 전환'],
    ['calc', '함수의 평균값이 그래프 위 한 높이로 나타나는 이유', '적분의 평균값,넓이', '구간 길이'],
    ['calc', '대칭함수의 정적분이 단순해지는 이유', '짝함수,홀함수,정적분', '대칭 구간'],
    ['calc', '치환적분이 좌표축을 바꾸는 것과 같은 이유', '치환적분,합성함수', '치환 변수'],
    ['calc', '부분적분이 곱의 미분법을 거꾸로 쓰는 방식', '부분적분,곱의 미분법', '함수 선택'],
    ['calc', '무한구간의 넓이가 유한할 수 있는 이유', '이상적분,극한', '꼬리의 감소 속도'],
    ['calc', '수열의 극한에서 자연상수 e가 나타나는 이유', '자연상수 e,수열의 극한', '복리 횟수'],
    ['calc', '테일러 다항식이 함수를 가까이 흉내 내는 방식', '테일러 전개,다항근사', '근사 차수'],
    ['calc', '삼각함수의 기본 극한이 기하와 연결되는 이유', '삼각함수의 극한,호도법', '각의 크기'],
    ['calc', '자기 자신을 미분해도 변하지 않는 지수함수', '지수함수,미분', '밑'],
    ['calc', '로지스틱 함수가 성장과 포화를 함께 나타내는 이유', '로지스틱 함수,변화율', '수용 한계'],
    ['calc', '변화율 식만으로 함수의 미래를 정하는 방법', '미분방정식,초기조건', '초기값'],
    ['calc', '다변수 함수에서 기울기가 한 숫자가 아닌 이유', '편미분,그래디언트', '이동 방향'],
    ['geo', '곡률이 곡선의 휘어짐을 수로 나타내는 방식', '곡률,접선', '매개변수'],
    ['geo', '곡선의 길이를 작은 선분의 합으로 구하는 방법', '호의 길이,적분', '분할 간격'],
    ['calc', '수치미분과 수치적분의 오차가 생기는 이유', '수치해석,근사오차', '간격과 분할 수']
  ],
  geometry: [
    ['geo', '조건을 만족하는 점들의 자취가 도형이 되는 과정', '자취,좌표', '조건과 움직이는 점'],
    ['geo', '원의 방정식이 거리 조건을 압축하는 방식', '원의 방정식,거리', '중심과 반지름'],
    ['geo', '포물선의 초점과 준선 정의가 곡선을 만드는 이유', '포물선,초점과 준선', '초점과 준선의 위치'],
    ['geo', '타원의 두 초점까지 거리 합이 일정한 이유', '타원,거리의 합', '두 초점의 간격'],
    ['geo', '쌍곡선의 두 초점까지 거리 차가 일정한 이유', '쌍곡선,거리의 차', '두 초점의 간격'],
    ['geo', '원뿔을 자르는 각도에 따라 이차곡선이 달라지는 이유', '원뿔곡선,평면', '절단 각도'],
    ['geo', '이차곡선의 접선 방정식이 닮은꼴로 나타나는 이유', '이차곡선,접선', '접점'],
    ['geo', '포물선·타원·쌍곡선의 반사 성질', '이차곡선,반사', '입사 방향'],
    ['geo', '매개변수로 이차곡선 위의 점을 표현하는 방법', '매개변수,이차곡선', '매개변수 값'],
    ['geo', '좌표축 이동과 회전으로 이차곡선을 단순화하는 방법', '좌표변환,이차곡선', '이동량과 회전각'],
    ['geo', '벡터 덧셈이 이동의 합성이 되는 이유', '벡터의 덧셈,평행사변형', '두 벡터의 방향'],
    ['geo', '벡터의 실수배가 방향과 크기를 바꾸는 방식', '벡터의 실수배,방향', '실수배 값'],
    ['geo', '위치벡터가 점을 벡터로 바꾸는 방식', '위치벡터,좌표', '원점의 선택'],
    ['geo', '벡터의 내적이 각도와 길이를 한 수로 담는 이유', '벡터의 내적,각', '벡터 사이 각'],
    ['geo', '정사영이 그림자 길이와 내적으로 연결되는 이유', '정사영,내적', '투영 방향'],
    ['geo', '벡터의 외적이 수직 방향과 넓이를 만드는 이유', '외적,넓이', '두 벡터의 순서'],
    ['geo', '행렬식으로 평행사변형의 넓이를 구하는 이유', '행렬식,벡터', '두 벡터'],
    ['geo', '직선의 매개변수 방정식이 움직임을 나타내는 방식', '직선의 방정식,매개변수', '시작점과 방향벡터'],
    ['geo', '평면의 법선벡터가 방정식을 정하는 이유', '평면의 방정식,법선벡터', '법선 방향'],
    ['geo', '직선과 평면의 교점 개수를 분류하는 방법', '직선과 평면,교점', '방향벡터와 법선벡터'],
    ['geo', '구와 평면의 교집합이 원이 되는 이유', '구,평면,교선', '중심과 평면 거리'],
    ['geo', '두 구가 만나 만드는 원의 위치와 크기', '두 구의 교선,원', '중심 거리와 반지름'],
    ['geo', '공간에서 만나지 않는 두 직선의 관계', '꼬인 위치,공간직선', '두 직선의 방향과 위치'],
    ['geo', '점과 직선 사이 최단거리가 수선인 이유', '점과 직선의 거리,수선', '점의 위치'],
    ['geo', '점과 평면 사이 거리 공식의 벡터 해석', '점과 평면의 거리,정사영', '법선벡터'],
    ['geo', '3차원 두 점 사이 거리와 구의 관계', '공간좌표,구', '중심과 반지름'],
    ['geo', '사면체의 부피가 세 벡터의 곱으로 표현되는 이유', '사면체,부피,벡터', '세 벡터'],
    ['geo', '다면체의 꼭짓점·모서리·면 사이 오일러 관계', '다면체,오일러 공식', '면의 분할'],
    ['geo', '대칭이동이 거리와 각을 보존하는 이유', '대칭이동,합동변환', '대칭축과 대칭점'],
    ['geo', '회전변환을 행렬과 복소수로 표현하는 방법', '회전변환,행렬', '회전각'],
    ['geo', '반전기하에서 원과 직선이 서로 바뀌는 이유', '반전,원', '반전 중심과 반지름'],
    ['culture', '원근법에서 평행선이 소실점에서 만나는 이유', '원근법,투영', '관찰점'],
    ['geo', '두 점까지 거리의 비가 일정한 아폴로니오스 원', '아폴로니오스 원,자취', '거리의 비'],
    ['geo', '세바 정리가 삼각형의 세 선분 동시교점을 판정하는 방식', '세바 정리,삼각형', '변의 분할비'],
    ['geo', '메넬라우스 정리가 세 점의 공선성을 판정하는 방식', '메넬라우스 정리,삼각형', '분할비와 방향'],
    ['geo', '프톨레마이오스 정리가 원에 내접한 사각형을 알아보는 방식', '프톨레마이오스 정리,원', '네 변과 대각선'],
    ['culture', '정다각형으로 평면을 빈틈없이 채우는 조건', '테셀레이션,정다각형', '내각과 꼭짓점'],
    ['geo', '격자다각형의 넓이를 내부점과 경계점으로 구하는 픽 정리', '픽 정리,격자점', '내부점과 경계점'],
    ['geo', '가장 가까운 점을 나누는 보로노이와 들로네 구조', '보로노이 다이어그램,들로네 삼각분할', '점들의 위치'],
    ['geo', '평행선 공리가 달라지면 만들어지는 비유클리드 기하', '비유클리드 기하,평행선', '곡률']
  ],
  probability: [
    ['prob', '합의 법칙과 곱의 법칙을 구분하는 기준', '경우의 수,합의 법칙,곱의 법칙', '선택 단계'],
    ['prob', '같은 것이 있는 순열에서 중복을 나누는 이유', '중복순열,순열', '같은 원소의 개수'],
    ['prob', '조합과 이항계수가 같은 수를 세는 이유', '조합,이항계수', '전체와 선택 수'],
    ['prob', '비둘기집 원리가 존재를 보장하는 방식', '비둘기집 원리,경우의 수', '물건과 상자 수'],
    ['prob', '포함배제 원리에서 겹친 부분을 다시 더하는 이유', '포함배제 원리,집합', '집합의 개수'],
    ['prob', '카탈란 수가 서로 다른 문제에 반복해서 나타나는 이유', '카탈란 수,재귀', '구조의 크기'],
    ['prob', '아무도 제자리를 갖지 않는 순열의 개수', '완전순열,포함배제', '원소 수'],
    ['prob', '점화식으로 경우의 수를 세는 방법', '점화식,경우의 수', '문제의 크기'],
    ['prob', '확률의 세 공리가 모든 계산의 출발점이 되는 이유', '확률의 공리,사건', '표본공간'],
    ['prob', '조건부확률에서 표본공간이 바뀌는 이유', '조건부확률,표본공간', '주어진 정보'],
    ['prob', '베이즈 정리가 원인과 결과의 방향을 뒤집는 방식', '베이즈 정리,조건부확률', '사전확률'],
    ['prob', '독립사건과 서로 배반인 사건이 다른 이유', '독립사건,배반사건', '교집합 확률'],
    ['prob', '몬티홀 문제에서 문을 바꾸는 것이 유리한 이유', '조건부확률,몬티홀 문제', '공개된 정보'],
    ['prob', '생일 문제에서 충돌이 예상보다 빨리 생기는 이유', '생일 문제,여사건', '사람 수'],
    ['prob', '기댓값이 실제로 가능한 값이 아닐 수 있는 이유', '기댓값,확률분포', '시행 횟수'],
    ['prob', '분산이 평균에서 떨어진 정도를 제곱하는 이유', '분산,표준편차', '자료의 흩어짐'],
    ['prob', '공분산의 부호가 두 변수의 움직임을 나타내는 방식', '공분산,상관', '두 변수의 변화'],
    ['prob', '큰 수의 법칙이 반복 실험을 안정시키는 이유', '큰 수의 법칙,표본평균', '시행 횟수'],
    ['prob', '중심극한정리에서 정규분포가 나타나는 이유', '중심극한정리,정규분포', '표본 크기'],
    ['prob', '표본을 뽑는 방식이 통계 결과를 바꾸는 이유', '표본추출,편향', '표본 구성'],
    ['prob', '상관관계가 인과관계를 뜻하지 않는 이유', '상관관계,인과관계', '숨은 변수'],
    ['prob', '회귀직선이 오차 제곱합을 최소화하는 이유', '회귀분석,최소제곱법', '자료점의 위치'],
    ['prob', '심슨의 역설에서 전체와 부분의 결론이 뒤집히는 이유', '심슨의 역설,조건부비율', '집단 비율'],
    ['prob', '신뢰구간의 95%가 뜻하는 것과 뜻하지 않는 것', '신뢰구간,표본분포', '신뢰수준'],
    ['prob', 'p값이 가설이 참일 확률이 아닌 이유', '가설검정,p값', '유의수준'],
    ['prob', '무작위 걸음이 확산과 연결되는 방식', '확률보행,분포', '걸음 수'],
    ['prob', '마르코프 연쇄에서 현재만으로 미래를 계산하는 조건', '마르코프 연쇄,상태전이', '전이확률'],
    ['prob', '쿠폰을 모두 모으는 데 마지막 하나가 오래 걸리는 이유', '쿠폰 수집가 문제,기댓값', '쿠폰 종류 수'],
    ['ai', '모든 간선을 한 번씩 지나는 오일러 경로의 조건', '그래프이론,오일러 경로', '정점의 차수'],
    ['ai', '모든 정점을 한 번씩 지나는 해밀턴 경로의 어려움', '그래프이론,해밀턴 경로', '연결 구조'],
    ['ai', '최단경로 알고리즘이 모든 경로를 직접 보지 않는 이유', '최단경로,그래프', '간선 가중치'],
    ['ai', '그래프 색칠에서 필요한 최소 색의 수', '그래프 색칠,색수', '그래프의 연결'],
    ['ai', '두 집단을 겹치지 않게 짝짓는 최적 매칭', '이분그래프,매칭', '가능한 연결'],
    ['ai', '시간표 만들기에서 제약조건이 폭발하는 이유', '스케줄링,조합최적화', '수업과 교실의 제약'],
    ['econ', '게임이론에서 서로의 최선이 균형이 되는 조건', '게임이론,내시균형', '보상표']
  ],
  economy: [
    ['econ', '복리에서 시간이 돈의 배수가 되는 방식', '복리,지수함수', '이율과 기간'],
    ['econ', '현재가치가 미래의 돈을 오늘로 옮기는 방식', '현재가치,할인율', '기간과 할인율'],
    ['econ', '명목금액과 실질구매력이 다르게 움직이는 이유', '물가,실질가치', '물가상승률'],
    ['econ', '환율 변화가 수출과 수입에 반대로 작용하는 이유', '환율,비율', '환율과 거래 방향'],
    ['econ', '수요의 가격탄력성이 매출 변화를 결정하는 방식', '탄력성,변화율', '가격과 수요량'],
    ['econ', '손익분기점이 고정비와 변동비를 가르는 기준', '손익분기점,일차함수', '가격과 비용'],
    ['econ', '한계수익과 한계비용으로 생산량을 정하는 방법', '한계분석,최적화', '생산량'],
    ['econ', '분산투자가 평균수익과 위험을 바꾸는 방식', '가중평균,분산투자', '자산 배분'],
    ['econ', '수익률이 같아도 위험이 다를 수 있는 이유', '수익률,분산', '변동성'],
    ['econ', '대출 상환 방식에 따라 총이자가 달라지는 이유', '대출,등비수열', '상환 기간과 방식'],
    ['econ', '누진세에서 평균세율과 한계세율이 다른 이유', '누진세,조각함수', '소득 구간'],
    ['econ', '경매 규칙이 입찰 전략을 바꾸는 방식', '경매,게임이론', '입찰가와 규칙'],
    ['econ', '가격 경쟁에서 개인의 최선과 전체의 결과가 어긋나는 이유', '게임이론,죄수의 딜레마', '보상 구조'],
    ['econ', '로렌츠곡선과 지니계수가 불평등을 수로 압축하는 방식', '로렌츠곡선,지니계수', '소득 분포'],
    ['econ', '물가지수가 서로 다른 장바구니를 한 숫자로 만드는 방식', '지수,가중평균', '품목 가중치']
  ],
  computingCulture: [
    ['ai', '이진법이 모든 디지털 정보를 표현하는 방식', '이진법,정보표현', '비트 수'],
    ['ai', '공개키 암호가 열쇠를 공유하지 않고 비밀을 만드는 방식', '암호,모듈러 연산', '키의 크기'],
    ['ai', '해시함수가 긴 정보를 짧은 지문으로 바꾸는 방식', '해시함수,충돌', '출력 길이'],
    ['ai', '데이터 압축에서 반복과 예측을 이용하는 방법', '정보이론,압축', '패턴의 반복'],
    ['ai', '오류정정코드가 틀린 비트를 찾아 고치는 방법', '오류정정,해밍거리', '중복 비트'],
    ['ai', '탐색 알고리즘이 후보를 줄여 가는 방식', '탐색,알고리즘', '자료의 정렬 여부'],
    ['ai', '계산 복잡도가 입력 크기와 시간을 연결하는 방식', '시간복잡도,알고리즘', '입력 크기'],
    ['ai', 'AI에서 단어와 이미지를 벡터로 표현하는 이유', '벡터,임베딩', '차원과 거리'],
    ['ai', '경사하강법이 기울기를 따라 손실을 줄이는 방식', '경사하강법,미분', '학습률'],
    ['ai', '훈련 점수는 높은데 새 문제를 못 푸는 과적합', '과적합,모델', '모델 복잡도'],
    ['ai', '추천시스템이 사람과 콘텐츠의 비슷함을 계산하는 방식', '유사도,벡터', '특징과 가중치'],
    ['culture', '원근법이 평면에 깊이를 만드는 방식', '원근법,투영', '소실점'],
    ['culture', '옥타브와 음계에서 로그가 나타나는 이유', '음계,로그', '주파수 비'],
    ['culture', '건축 곡선에서 힘과 형태가 만나는 방식', '곡선,최적화', '하중과 지지점'],
    ['culture', '투표 방식에 따라 당선 결과가 달라지는 이유', '사회선택이론,투표', '선호 순서']
  ]
};

const BASES = Object.values(GROUPS).flat();

if (BASES.length !== 200) {
  throw new Error(`Expected 200 base topics, received ${BASES.length}`);
}

function hasBatchim(text) {
  const chars = Array.from(String(text || '')).filter(char => /[가-힣]/.test(char));
  if (!chars.length) return false;
  return (chars.at(-1).charCodeAt(0) - 0xAC00) % 28 !== 0;
}

function josa(text, pair) {
  const [withBatchim, withoutBatchim] = pair.split('/');
  return `${text}${hasBatchim(text) ? withBatchim : withoutBatchim}`;
}

const LENSES = [
  {
    id: 'WHY', label: '왜 그런가',
    question: b => `${josa(`‘${b.topic}’`, '이라는/라는')} 질문에 ${b.concepts[0]}의 정의만으로 답할 수 있을까?`,
    act: b => `${b.concepts[0]}의 정의에서 출발해 대표적인 예를 계산하고, 공통 구조를 한 문장과 그림으로 설명한다.`,
    next: () => '설명에 사용한 조건 중 하나를 바꾸어도 같은 결론이 여전히 성립할까?'
  },
  {
    id: 'CONDITION', label: '조건 해부',
    question: b => `‘${b.topic}’에서 어떤 조건이 필요하고, 어떤 조건이면 충분할까?`,
    act: b => `${b.knob}에 관한 조건을 하나씩 켜고 끄며 결론이 성립하는 경우를 표로 분류한다.`,
    next: b => `필요조건을 충분조건으로 바꾸려면 어떤 조건을 더 붙여야 할까?`
  },
  {
    id: 'CONVERSE', label: '거꾸로 묻기',
    question: b => `‘${b.topic}’에서 얻은 결론을 거꾸로 말하면 언제 참이고 언제 거짓일까?`,
    act: b => `원래 명제와 역·이·대우를 분리하고, 각각에 예와 반례를 찾아 진리표처럼 정리한다.`,
    next: b => `역이 성립하도록 ${b.knob}의 범위를 가장 작게 제한할 수 있을까?`
  },
  {
    id: 'COUNTER', label: '반례 찾기',
    question: b => `‘${b.topic}’에서 ${b.knob}에 관한 조건 하나를 없애면 결론은 어떻게 달라질까? 가장 단순한 반례는 무엇일까?`,
    act: () => '가장 단순한 값과 구조부터 탐색해 결론을 깨뜨리는 최소 반례를 설계한다.',
    next: b => `찾은 반례를 막으면서도 지나치게 강하지 않은 조건은 무엇일까?`
  },
  {
    id: 'PARAMETER', label: '움직여 보기',
    question: b => `${josa(b.knob, '을/를')} 바꿀 때 ‘${b.topic}’에서 결론이나 모양이 달라지는 지점은 어디일까?`,
    act: b => `${josa(b.knob, '을/를')} 여러 단계로 바꾸고 식·표·그래프의 변화를 함께 기록해 전환 지점을 추측한다.`,
    next: () => '전환 지점을 지난 뒤 결과가 달라지는 이유를 수학적으로 설명할 수 있을까?'
  },
  {
    id: 'CLASSIFY', label: '경우 분류',
    question: b => `${josa(`‘${b.topic}’`, '과/와')} 관련된 경우를 중복과 누락 없이 분류하면 몇 가지가 나올까?`,
    act: b => `중복과 누락이 없도록 분류 기준을 먼저 세우고, 각 경우의 대표 예를 하나씩 만든다.`,
    next: b => `분류 기준의 순서를 바꾸어도 같은 경우들이 나올까?`
  },
  {
    id: 'REPRESENT', label: '표현 번역',
    question: b => `${josa(`‘${b.topic}’`, '을/를')} 설명하는 식·표·그래프·도형은 각각 어떤 정보를 보여 줄까?`,
    act: b => `같은 대상을 네 가지 표현으로 만들고, 각 표현에서 즉시 보이는 정보와 숨는 정보를 비교한다.`,
    next: b => `문제의 조건마다 가장 유리한 표현을 자동으로 선택하는 기준을 만들 수 있을까?`
  },
  {
    id: 'EXPERIMENT', label: '수치 실험',
    question: b => `${josa(b.knob, '을/를')} 여러 값이나 경우로 바꾸어 ${josa(`‘${b.topic}’`, '을/를')} 확인하면 어떤 패턴과 예외가 나타날까?`,
    act: b => `${josa(b.knob, '을/를')} 체계적으로 바꾼 데이터를 만들고, 예상과 어긋나는 사례를 따로 표시한다.`,
    next: b => `실험 범위를 더 넓혔을 때도 패턴이 유지된다고 보장할 방법은 무엇일까?`
  },
  {
    id: 'GENERALIZE', label: '한 단계 확장',
    question: b => `‘${b.topic}’에서 조건이나 변수의 수를 하나 늘리면 무엇이 유지되고 무엇이 깨질까?`,
    act: b => `가장 단순한 경우에서 출발해 복잡도를 한 단계씩 높이며 변하지 않는 구조와 새 예외를 기록한다.`,
    next: b => `확장된 상황을 하나의 일반식이나 알고리즘으로 표현할 수 있을까?`
  },
  {
    id: 'DESIGN', label: '직접 설계',
    question: b => `‘${b.topic}’의 결론이 성립하는 예와 거의 성립하지만 실패하는 예를 직접 만들 수 있을까?`,
    act: b => `먼저 결과를 정한 뒤 ${josa(b.knob, '을/를')} 역으로 조정해 성공 예·경계 예·실패 예를 각각 제작한다.`,
    next: b => `다른 사람이 만든 예의 성패를 한눈에 판정하는 규칙을 만들 수 있을까?`
  }
];

const SUBJECT_LABEL = {
  calc: '미적분Ⅰ', geo: '기하', econ: '경제수학', algebra: '대수',
  prob: '확률과 통계', common: '공통수학', ai: '인공지능·이산', culture: '수학과 문화'
};

function asQuestion(text) {
  const clean = String(text || '').trim();
  if (!clean) return '조건을 바꾸면 결론은 어떻게 달라질까?';
  return /[?？]$/.test(clean) ? clean : `${clean}?`;
}

function normalizeBank(seed) {
  const notes = Array.isArray(seed.notes) ? seed.notes.join(' ') : '';
  const math = String(seed.math || '').replace(/[.。]+$/, '');
  const concepts = math
    ? math.split(/\s*(?:→|\+|·|,|\/|와|과)\s*/).filter(Boolean).slice(0, 4)
    : [seed.title];
  const phenomenon = seed.situation || seed.twist || seed.discovery || notes ||
    `${seed.question}에서 출발해 수학적 구조를 찾아가는 탐구 씨앗이다.`;
  const act = seed.act || seed.predict ||
    '조건과 수치를 바꾸며 여러 사례를 만들고, 성립하는 경우와 실패하는 경우를 비교한다.';
  const next = seed.conflict
    ? asQuestion(seed.conflict)
    : '조건 하나를 바꾸거나 결론을 거꾸로 말하면 어떤 새로운 질문이 생길까?';

  const bankQuestion = seed.question || `${seed.title}에서 가장 먼저 확인해야 할 수학적 조건은 무엇일까?`;

  return {
    ...seed,
    question: asQuestion(bankQuestion),
    phenomenon,
    concepts,
    domain: [seed.category || SUBJECT_LABEL[seed.subject] || '수학', '수학 탐구'],
    relation: ['ai', 'culture'].includes(seed.subject) ? 'EXTENSION' : 'CORE',
    entry: 'highschool',
    ceiling: seed.grade === 'S++' ? 'undergraduate_intro' : 'highschool_advanced',
    status: seed.status || 'candidate',
    act,
    next,
    origin: 'curated',
    asset: seed.asset || { label: '이 씨앗으로 탐구 시작', href: `inquiry.html?seed=${encodeURIComponent(seed.id)}` }
  };
}

function normalizeOriginal(seed) {
  return {
    ...seed,
    question: asQuestion(seed.question),
    origin: 'curated',
    asset: seed.asset || { label: '이 씨앗으로 탐구 시작', href: `inquiry.html?seed=${encodeURIComponent(seed.id)}` }
  };
}

function normalizeKey(value) {
  return String(value || '')
    .toLocaleLowerCase('ko')
    .replace(/[\s\p{P}\p{S}]/gu, '');
}

const curated = [
  ...originalSeeds.map(normalizeOriginal),
  ...bankSeeds.map(normalizeBank)
];

const curatedIds = new Set();
const curatedQuestions = new Set();
for (const seed of curated) {
  if (curatedIds.has(seed.id)) throw new Error(`Duplicate curated id: ${seed.id}`);
  curatedIds.add(seed.id);
  curatedQuestions.add(normalizeKey(seed.question));
}

const baseObjects = BASES.map((row, index) => ({
  code: String(index + 1).padStart(3, '0'),
  subject: row[0],
  topic: row[1],
  concepts: row[2].split(',').map(x => x.trim()).filter(Boolean),
  knob: row[3],
  origin: ['econ', 'ai', 'culture'].includes(row[0]) ? 'connected' : 'internal'
}));

const generatedPool = [];
for (let lensIndex = 0; lensIndex < LENSES.length; lensIndex += 1) {
  const lens = LENSES[lensIndex];
  for (const base of baseObjects) {
    const question = lens.question(base);
    if (curatedQuestions.has(normalizeKey(question))) continue;
    const id = `JP2K-${base.subject.toUpperCase()}-${base.code}-${lens.id}`;
    generatedPool.push({
      id,
      src: 'seed2000',
      grade: 'B',
      subject: base.subject,
      title: `${lens.label} · ${base.topic}`,
      question,
      phenomenon: `${base.topic}을 하나의 정답으로 끝내지 않고 ‘${lens.label}’의 관점에서 다시 여는 수학 내부형 탐구다.`,
      concepts: base.concepts,
      domain: [base.origin === 'internal' ? '수학 내부' : '현상 연결', lens.label],
      relation: ['econ', 'ai', 'culture'].includes(base.subject) ? 'ADJACENT' : 'CORE',
      entry: 'highschool',
      ceiling: ['GENERALIZE', 'CONVERSE', 'COUNTER'].includes(lens.id)
        ? 'undergraduate_intro'
        : 'highschool_advanced',
      status: 'candidate',
      act: lens.act(base),
      next: lens.next(base),
      origin: base.origin,
      lens: lens.id,
      baseTopic: base.topic,
      sourceNote: '2022 개정 교육과정, JP Math Lab 아이디어뱅크, 랑데뷰 세미나의 주제 유형을 참고해 새 질문으로 재구성',
      asset: { label: '이 씨앗으로 탐구 시작', href: `inquiry.html?seed=${encodeURIComponent(id)}` }
    });
  }
}

const TARGET = 2000;
const generatedNeeded = TARGET - curated.length;
if (generatedPool.length < generatedNeeded) {
  throw new Error(`Not enough generated seeds: need ${generatedNeeded}, have ${generatedPool.length}`);
}

const nineLensCore = generatedPool.filter(seed => seed.lens !== 'DESIGN');
const designCandidates = generatedPool.filter(seed => seed.lens === 'DESIGN');
const designNeeded = generatedNeeded - nineLensCore.length;
const priorityDesignTopics = new Set([
  '미분하면 다항식의 차수가 하나 내려가는 이유',
  '자연상수 e를 정의하는 서로 다른 방법',
  '삼차함수 밖의 한 점에서 그은 접선의 개수'
]);
const balancedDesign = designCandidates.filter(seed => priorityDesignTopics.has(seed.baseTopic));
const chosenDesignIds = new Set(balancedDesign.map(seed => seed.id));
const balancedSlots = designNeeded - balancedDesign.length;
for (let i = 0; i < balancedSlots; i += 1) {
  const index = Math.floor(i * designCandidates.length / balancedSlots);
  const candidate = designCandidates[index];
  if (candidate && !chosenDesignIds.has(candidate.id)) {
    balancedDesign.push(candidate);
    chosenDesignIds.add(candidate.id);
  }
}
for (const candidate of designCandidates) {
  if (balancedDesign.length >= designNeeded) break;
  if (!chosenDesignIds.has(candidate.id)) {
    balancedDesign.push(candidate);
    chosenDesignIds.add(candidate.id);
  }
}
const generated = [...nineLensCore, ...balancedDesign];
const catalog = [...curated, ...generated];

// 학교급과 출발점을 씨앗마다 붙인다. 규칙은 seed-classify.mjs 한 곳에 있다.
for (const seed of catalog) {
  const { stage, track } = classifySeed(seed);
  seed.stage = stage;
  seed.track = track;
}
const seenIds = new Set();
const seenQuestions = new Set();
for (const seed of catalog) {
  if (!seed.id || seenIds.has(seed.id)) throw new Error(`Duplicate or missing id: ${seed.id}`);
  seenIds.add(seed.id);
  const q = normalizeKey(seed.question);
  if (!q || seenQuestions.has(q)) throw new Error(`Duplicate or missing question: ${seed.question}`);
  seenQuestions.add(q);
  for (const field of ['subject', 'title', 'phenomenon', 'act', 'next', 'relation', 'entry', 'ceiling', 'status', 'stage', 'track']) {
    if (!seed[field]) throw new Error(`Missing ${field} in ${seed.id}`);
  }
  if (!Array.isArray(seed.concepts) || seed.concepts.length === 0) throw new Error(`Missing concepts in ${seed.id}`);
  if (!Array.isArray(seed.domain) || seed.domain.length === 0) throw new Error(`Missing domain in ${seed.id}`);
}

const counts = catalog.reduce((acc, seed) => {
  acc.subject[seed.subject] = (acc.subject[seed.subject] || 0) + 1;
  acc.origin[seed.origin] = (acc.origin[seed.origin] || 0) + 1;
  acc.grade[seed.grade || '후보'] = (acc.grade[seed.grade || '후보'] || 0) + 1;
  acc.stage[seed.stage] = (acc.stage[seed.stage] || 0) + 1;
  acc.track[seed.track] = (acc.track[seed.track] || 0) + 1;
  return acc;
}, { subject: {}, origin: {}, grade: {}, stage: {}, track: {} });

const metadata = {
  version: '2026.08.31',
  total: catalog.length,
  curated: curated.length,
  generated: catalog.length - curated.length,
  baseTopics: BASES.length,
  lenses: LENSES.map(({ id, label }) => ({ id, label })),
  counts,
  sources: [
    'JP Math Lab 기존 마이닝 씨앗 12개',
    'JP Math Lab 아이디어뱅크 S++/S+ 96개',
    '2022 개정 교육과정의 수학 개념 구조',
    '랑데뷰 세미나의 248개 심화 주제 유형(질문은 새로 재구성)'
  ],
  note: 'candidate는 학생 제안용이다. 공개·수업 확정 전 수학 검증과 교사 검토가 필요하다.'
};

const js = `/* AUTO-GENERATED by scripts/build-seed-catalog.mjs\n` +
  `   총 ${catalog.length}개: 기존 큐레이션 ${curated.length} + 확장 ${catalog.length - curated.length}.\n` +
  `   직접 수정하지 말고 생성기의 BASES/LENSES를 수정한다. */\n` +
  `(function () {\n  'use strict';\n` +
  `  var catalog = ${JSON.stringify(catalog)};\n` +
  `  var metadata = ${JSON.stringify(metadata, null, 2)};\n` +
  `  window.JPSeedCatalog = catalog;\n` +
  `  window.JPSeedCatalogMeta = metadata;\n` +
  `  if (window.JPSeeds) {\n` +
  `    window.JPSeeds.seeds = catalog;\n` +
  `    window.JPSeeds.all = function () { return catalog.slice(); };\n` +
  `    window.JPSeeds.catalogMeta = metadata;\n` +
  `    window.JPSeeds.GRADE.B = { rank: 5, desc: '교사 검토 전 확장 후보' };\n` +
  `    window.JPSeeds.source = 'JP Math Lab Seed Catalog 2000 · 2026.08.31';\n` +
  `  }\n}());\n`;

fs.writeFileSync(path.join(TOPIC_DIR, 'seeds-catalog-2000.js'), js, 'utf8');
fs.writeFileSync(
  path.join(TOPIC_DIR, 'seeds-catalog-2000.meta.json'),
  `${JSON.stringify(metadata, null, 2)}\n`,
  'utf8'
);

console.log(JSON.stringify(metadata, null, 2));
