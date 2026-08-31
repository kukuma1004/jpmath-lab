/* 탐구 씨앗 저장소.
   출처: JP_MATH_LAB_수학_주제_마이닝_1차.md (12개)
   구조: 아이디어 뱅크 v13 §7 Seed 기본 구조 · §3 교육과정 관계 · §5 입구/천장 난이도

   상태는 모두 candidate 다. 아이디어 뱅크 §8 에 따라 수학·사실 검증과
   교사 검토를 통과해야 verified 가 된다. 화면에도 그대로 적는다.

   점수는 마이닝 문서가 매긴 상위 6개만 갖고 있다. 나머지는 비워 둔다.
   없는 점수를 지어내면 이 표가 쓸모없어진다. */
(function () {
  'use strict';

  // 아이디어 뱅크 §3 — 교육과정은 뼈대이되 경계는 아니다.
  var RELATION = {
    CORE:      { label: '교육과정 안', desc: '현행 교육과정에 직접 포함' },
    ADJACENT:  { label: '바로 옆',     desc: '교육과정 개념으로 바로 접근 가능' },
    EXTENSION: { label: '한 걸음 더',  desc: '한두 단계 확장하면 도달' },
    ADVANCED:  { label: '대학까지',    desc: '대학수학·고급수학까지 연결' },
    OUTSIDE:   { label: '교과 밖',     desc: '교과 밖이지만 수학적으로 강하게 흥미로운 주제' }
  };

  // 아이디어 뱅크 §5 — 입구는 낮고 천장은 높은 씨앗이 값지다.
  var LEVEL = {
    highschool:            { label: '고교',      rank: 1 },
    highschool_advanced:   { label: '고교 심화', rank: 2 },
    undergraduate_intro:   { label: '대학 입문', rank: 3 },
    undergraduate:         { label: '대학',      rank: 4 }
  };

  // 과목 색은 흰 글자를 얹으므로 모두 4.5:1 을 넘긴다.
  var SUBJECT = {
    calc:    { label: '미적분Ⅰ',      color: '#176b5b' },
    geo:     { label: '기하',          color: '#b04a1c' },
    econ:    { label: '경제수학',      color: '#315e8c' },
    algebra: { label: '대수',          color: '#6b4780' },
    prob:    { label: '확률과 통계',   color: '#7a4a63' },
    common:  { label: '공통수학',      color: '#4a5a2e' },
    ai:      { label: '인공지능·이산', color: '#2f5f6b' },
    culture: { label: '수학과 문화',   color: '#8a5a12' }
  };

  // 급. 문서마다 다른 말을 쓰므로 각 씨앗의 출처를 함께 보인다.
  var GRADE = {
    'S++':      { rank: 1, desc: '학생이 수학을 발명할 수밖에 없는 상황 (아이디어 뱅크)' },
    'S+':       { rank: 2, desc: '다시 비틀어 만든 핵심 주제 (아이디어 뱅크)' },
    '상위 후보': { rank: 3, desc: '마이닝 1차의 상위 제작 후보 6개' },
    '후보':     { rank: 4, desc: '마이닝 1차 후보' }
  };

  var SOURCE = {
    mining: '주제 마이닝 1차',
    moment: '아이디어 뱅크 · 수학이 필요한 순간',
    splus:  '아이디어 뱅크 · S+ 후보 64'
  };

  // 마이닝 문서 §2 의 7축. H 첫 질문의 힘 · V 시각화 · M 수학이 핵심인가 ·
  // I 조작 가능성 · T 전이 · R 엔진 재사용 · C 제작 비용 효율.
  var AXES = [
    { key: 'H', label: '첫 질문의 힘' },
    { key: 'V', label: '시각화' },
    { key: 'M', label: '수학이 핵심' },
    { key: 'I', label: '직접 조작' },
    { key: 'T', label: '전이' },
    { key: 'R', label: '엔진 재사용' },
    { key: 'C', label: '제작 효율' }
  ];

  var SEEDS = [
    {
      id: 'CAL-DER-SIGN-TRACK-001',
      subject: 'calc',
      title: '도함수 부호 추적',
      question: '그래프 없이 도함수의 부호만으로 원래 함수의 움직임을 복원할 수 있을까?',
      phenomenon: '함수의 그래프를 지우고 도함수의 부호만 남겨도, 어디서 올라가고 어디서 꺾이는지가 남는다. 부호는 모양보다 적은 정보인데 모양을 되살린다.',
      concepts: ['증가와 감소', '극대와 극소', '도함수의 부호'],
      domain: ['퍼즐', '데이터'],
      relation: 'CORE',
      entry: 'highschool',
      ceiling: 'undergraduate_intro',
      status: 'candidate',
      act: '수직선에 +, 0, − 를 배치하면 함수 그래프가 실시간으로 만들어진다.',
      misstep: '중근에서도 부호가 반드시 바뀐다고 판단하는 경우.',
      next: '도함수의 근 개수만 알면 원래 함수의 극값 개수도 항상 정해질까?',
      asset: { label: '극대·극소 경기장', href: '../미적분1/미적분1_극대극소.html' },
      score: { H: 5, V: 5, M: 5, I: 5, T: 5, R: 5, C: 5, total: 35, rank: 1 }
    },
    {
      id: 'CAL-ROOT-MULTIPLICITY-001',
      subject: 'calc',
      title: '통과하는 근과 되돌아가는 근',
      question: '그래프는 왜 어떤 근에서는 축을 뚫고 어떤 근에서는 튕겨 나올까?',
      phenomenon: '같은 "근"인데 어떤 곳에서는 그래프가 x축을 가로지르고 어떤 곳에서는 닿았다가 되돌아간다. 겹친 횟수가 그 차이를 만든다.',
      concepts: ['인수분해', '중근', '부호 변화'],
      domain: ['퍼즐', '게임'],
      relation: 'CORE',
      entry: 'highschool',
      ceiling: 'highschool_advanced',
      status: 'candidate',
      act: '근을 겹치거나 떼며 x축 통과와 접촉을 비교한다.',
      next: '세 번 겹친 근은 한 번 겹친 근과 그래프 모양이 완전히 같을까?',
      asset: { label: '삼차함수 그래프', href: '../미적분1/미적분1_삼차함수그래프.html' },
      score: { H: 5, V: 5, M: 5, I: 5, T: 5, R: 5, C: 4, total: 34, rank: 5 }
    },
    {
      id: 'CAL-CUBIC-SHAPE-CONTROL-001',
      subject: 'calc',
      title: '삼차함수 모양 조종실',
      question: '최고차항 계수와 도함수의 판별식 중 무엇이 전체 모양을 결정할까?',
      phenomenon: '삼차함수는 계수 네 개로 정해지는데, 눈에 보이는 모양을 바꾸는 것은 그중 일부다. 어떤 계수는 모양을 바꾸고 어떤 계수는 위치만 옮긴다.',
      concepts: ['삼차함수', '도함수의 판별식', '극점의 조건'],
      domain: ['퍼즐', '프로그래밍'],
      relation: 'CORE',
      entry: 'highschool',
      ceiling: 'highschool_advanced',
      status: 'candidate',
      act: '계수와 극점 조건을 바꾸며 원함수와 도함수를 함께 본다.',
      next: '같은 두 극점을 가진 삼차함수는 몇 개나 만들 수 있을까?',
      asset: { label: '삼차함수 그래프', href: '../미적분1/미적분1_삼차함수그래프.html' }
    },
    {
      id: 'CAL-ACCUMULATION-REVERSE-001',
      subject: 'calc',
      title: '속도에서 이동 경로 복원',
      question: '속도계 기록만 남은 자동차의 위치를 다시 그릴 수 있을까?',
      phenomenon: '자동차에는 속도 기록만 남고 위치 기록은 없을 수 있다. 그런데 속도를 시간 순으로 쌓으면 위치가 되살아난다.',
      concepts: ['정적분', '속도와 이동거리', '누적'],
      domain: ['교통', '데이터', '물리'],
      relation: 'CORE',
      entry: 'highschool',
      ceiling: 'undergraduate_intro',
      status: 'candidate',
      act: '속도 그래프 아래 넓이를 시간 순서대로 누적해 위치 그래프를 만든다.',
      next: '속도가 음수일 때 이동거리와 위치 변화는 왜 달라질까?',
      asset: { label: '속도와 이동거리', href: '../미적분1/미적분1_속도이동거리.html' }
    },
    {
      id: 'GEO-VEC-DOT-FOV-001',
      subject: 'geo',
      title: '시야 판정',
      question: '게임 캐릭터는 적이 앞에 있는지 어떻게 숫자 하나로 판단할까?',
      phenomenon: '게임 속 적은 플레이어가 등을 돌리면 쫓아오지 않는다. "앞"과 "뒤"라는 말이 하나의 수, 내적의 부호로 바뀐다.',
      concepts: ['벡터의 내적', '두 벡터가 이루는 각'],
      domain: ['게임', '프로그래밍', 'AI'],
      relation: 'ADJACENT',
      entry: 'highschool',
      ceiling: 'undergraduate_intro',
      status: 'candidate',
      act: '캐릭터 방향과 적 위치를 움직이며 내적의 부호·크기와 시야 범위를 비교한다.',
      next: '가까운 뒤쪽 적과 먼 정면 적 중 누구를 먼저 감지해야 할까?',
      asset: { label: '벡터의 내적', href: '../기하/기하_벡터의내적.html' },
      score: { H: 5, V: 5, M: 5, I: 5, T: 5, R: 5, C: 4, total: 34, rank: 2 }
    },
    {
      id: 'GEO-PROJ-SHADOW-001',
      subject: 'geo',
      title: '그림자로 3D 복원',
      question: '그림자만 보고 3차원 물체의 방향을 알아낼 수 있을까?',
      phenomenon: '그림자는 3차원을 2차원으로 눌러 담은 것이라 정보를 잃는다. 그런데 빛의 방향을 알면 잃은 것의 일부가 되돌아온다.',
      concepts: ['정사영', '수선의 발', '평면과 직선'],
      domain: ['CG', '건축', '천문'],
      relation: 'ADJACENT',
      entry: 'highschool',
      ceiling: 'undergraduate_intro',
      status: 'candidate',
      act: '빛 방향, 물체 각도, 투영면을 바꾸며 그림자 길이를 비교한다.',
      next: '그림자 두 개가 있으면 3차원 정보를 어디까지 복원할 수 있을까?',
      asset: { label: '정사영', href: '../기하/기하_정사영.html' },
      score: { H: 5, V: 5, M: 5, I: 5, T: 5, R: 5, C: 4, total: 34, rank: 4 }
    },
    {
      id: 'GEO-HYPERBOLA-TDOA-001',
      subject: 'geo',
      title: '신호 도착시간으로 위치 찾기',
      question: '두 기지국까지의 거리 차만으로 신호 출발 위치를 찾을 수 있을까?',
      phenomenon: '거리를 직접 재지 않고 도착시간의 차이만 알아도, 가능한 위치가 하나의 곡선으로 좁혀진다. 그 곡선이 쌍곡선이다.',
      concepts: ['쌍곡선의 정의', '거리의 차', '자취'],
      domain: ['네트워크', '지도', '현대기술'],
      relation: 'EXTENSION',
      entry: 'highschool',
      ceiling: 'undergraduate',
      status: 'candidate',
      act: '도착시간 차의 자취를 그리고 세 번째 기지국으로 위치를 좁힌다.',
      next: '기지국이 세 개면 위치가 하나로 정해질까?',
      caution: '실제 위치추정 방식을 고교 수학으로 어디까지 단순화할지 확인이 필요하다.',
      asset: { label: '쌍곡선', href: '../기하/기하_쌍곡선.html' }
    },
    {
      id: 'GEO-RAY-COLLISION-001',
      subject: 'geo',
      title: '총알과 벽의 충돌',
      question: '3D 게임은 총알이 평면이나 구에 맞았는지 어떻게 판정할까?',
      phenomenon: '게임은 총알을 실제로 날리지 않는다. 직선과 도형의 교점이 있는지를 계산할 뿐이다.',
      concepts: ['직선의 매개변수 표현', '평면의 방정식', '구의 방정식'],
      domain: ['게임', 'CG', '프로그래밍'],
      relation: 'ADJACENT',
      entry: 'highschool',
      ceiling: 'undergraduate_intro',
      status: 'candidate',
      act: '발사 위치와 방향을 바꾸며 교점의 존재와 첫 충돌점을 찾는다.',
      next: '교점이 두 개일 때 실제 첫 충돌점은 어떻게 고를까?',
      asset: { label: '벡터로 표현한 평면과 구', href: '../기하/기하_벡터로표현한평면과구.html' }
    },
    {
      id: 'ECON-FX-TWO-SIDES-001',
      subject: 'econ',
      title: '환율의 두 얼굴',
      question: '환율 상승은 왜 어떤 사람에게는 이익이고 다른 사람에게는 손해일까?',
      phenomenon: '같은 환율 뉴스를 두고 수출 회사와 수입 회사의 표정이 정반대다. 하나의 수가 매출 쪽과 비용 쪽에 반대로 붙는다.',
      concepts: ['비율', '변화율', '환산'],
      domain: ['경제', '금융', '사회'],
      relation: 'CORE',
      entry: 'highschool',
      ceiling: 'highschool_advanced',
      status: 'candidate',
      act: '수출·수입·헤지·현금 비율을 1% 단위로 배분하고 매출과 비용을 따로 본다.',
      next: '환율이 원래 수준으로 돌아오면 이전 손익도 자동으로 사라질까?',
      asset: { label: '환율 전쟁', href: '../경제수학/live/games.html?game=currency-war' },
      score: { H: 5, V: 4, M: 5, I: 5, T: 5, R: 5, C: 5, total: 34, rank: 3 }
    },
    {
      id: 'ECON-PORTFOLIO-MIX-001',
      subject: 'econ',
      title: '한 자산에 전부 걸지 않는 이유',
      question: '최고 수익 자산 하나에 전부 걸지 않는 이유를 숫자로 설명할 수 있을까?',
      phenomenon: '평균 수익이 가장 높은 것 하나만 고르는 편이 이득처럼 보인다. 그런데 나누어 담으면 평균은 그대로인데 흔들림이 줄어든다.',
      concepts: ['가중평균', '수익률', '흩어진 정도'],
      domain: ['금융', '데이터'],
      relation: 'ADJACENT',
      entry: 'highschool',
      ceiling: 'undergraduate_intro',
      status: 'candidate',
      act: '네 자산의 배분을 만들고 같은 평균수익·다른 흔들림을 비교한다.',
      next: '자산 수가 많기만 하면 반드시 위험이 줄어들까?',
      asset: { label: '펀드매니저', href: '../경제수학/live/games.html?game=fund-manager' },
      score: { H: 5, V: 4, M: 5, I: 5, T: 5, R: 5, C: 4, total: 33, rank: 6 }
    },
    {
      id: 'ECON-COMPOUND-INFLATION-001',
      subject: 'econ',
      title: '불어난 돈과 줄어든 구매력',
      question: '통장 잔액이 늘었는데 살 수 있는 것은 왜 줄어들 수 있을까?',
      phenomenon: '이자가 붙어 잔액이 커졌는데 장바구니는 가벼워진다. 늘어나는 수와 줄어드는 수가 같은 기간에 함께 곱해진다.',
      concepts: ['복리', '지수적 증가', '실질과 명목'],
      domain: ['경제', '금융', '일상생활'],
      relation: 'CORE',
      entry: 'highschool',
      ceiling: 'highschool_advanced',
      status: 'candidate',
      act: '금리·물가·기간을 바꾸며 명목금액과 구매력 그래프를 함께 본다.',
      next: '물가가 해마다 다르면 평균 물가상승률만으로 정확히 계산할 수 있을까?',
      asset: { label: '인플레이션 생존', href: '../경제수학/live/games.html?game=inflation-survival' }
    },
    {
      id: 'ECON-BREAK-EVEN-DECISION-001',
      subject: 'econ',
      title: '많이 팔수록 좋은가',
      question: '판매량을 늘렸는데도 현금이 더 빨리 사라질 수 있을까?',
      phenomenon: '많이 팔면 이익이 난다고 배운다. 그런데 팔 때마다 먼저 나가는 돈이 있으면 매출이 늘수록 현금이 먼저 마른다.',
      concepts: ['일차함수', '손익분기점', '고정비와 변동비'],
      domain: ['경제', '사회'],
      relation: 'CORE',
      entry: 'highschool',
      ceiling: 'highschool_advanced',
      status: 'candidate',
      act: '가격·생산량·고정비·변동비를 바꾸며 손익분기점과 현금흐름을 본다.',
      next: '손익분기점을 넘겼는데 회사가 파산할 수 있는 이유는 무엇일까?',
      asset: { label: '스타트업 CEO', href: '../경제수학/live/games.html?game=startup-ceo' }
    }
  ];

  // 마이닝 씨앗의 급은 문서가 상위 6개를 따로 뽑아 둔 것을 그대로 쓴다.
  SEEDS.forEach(function (s) {
    s.src = 'mining';
    s.grade = s.score ? '상위 후보' : '후보';
  });

  window.JPSeeds = {
    seeds: SEEDS,
    RELATION: RELATION,
    LEVEL: LEVEL,
    SUBJECT: SUBJECT,
    GRADE: GRADE,
    SOURCE: SOURCE,
    AXES: AXES,
    // 뱅크에서 뽑은 96개는 seeds-bank.js 가 따로 싣는다. 없으면 마이닝 것만 쓴다.
    all: function () { return SEEDS.concat(window.JPSeedsBank || []); },
    source: 'JP_MATH_LAB_수학_주제_마이닝_1차.md'
  };
}());
