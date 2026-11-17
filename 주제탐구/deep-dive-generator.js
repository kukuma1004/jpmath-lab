/* 모든 탐구 씨앗을 수업에서 시작할 수 있는 설계안으로 바꾼다.
   결과를 만들어 내는 생성기가 아니라, 학생이 직접 확인할 질문·변인·
   기록표·반례를 제안하는 생성기다. 교사가 쓴 deep-dives 항목이 있으면
   deep-dive.js가 그 글을 우선 사용한다. */
(function () {
  'use strict';

  var SUBJECT = {
    calc: { label: '미적분Ⅰ', icon: '∫', relation: '변화량과 누적량의 관계', formula: '평균 변화율 → 순간 변화율 → 누적', graph: '가로축에 바꾼 값, 세로축에 변화율 또는 누적값을 놓은 그래프' },
    geo: { label: '기하', icon: '△', relation: '거리·각·좌표 사이의 불변 관계', formula: '조건 → 좌표화 → 거리·각의 관계', graph: '조건을 바꾼 도형을 겹쳐 그리고 보존되는 길이·각을 표시한 그림' },
    econ: { label: '경제수학', icon: '↗', relation: '선택과 비용·수익·위험 사이의 관계', formula: '변화율 = 결과의 변화량 ÷ 원인의 변화량', graph: '선택값에 따른 비용·수익·위험을 함께 비교하는 그래프' },
    algebra: { label: '대수', icon: 'x²', relation: '식의 구조와 해·그래프 사이의 관계', formula: '조건 → 식의 변형 → 해의 구조', graph: '계수나 매개변수를 바꿀 때 해와 그래프가 달라지는 모습' },
    prob: { label: '확률과 통계', icon: 'P', relation: '우연한 결과의 분포와 자료의 변동', formula: '상대도수 → 확률 추정 → 오차 비교', graph: '시행 횟수에 따른 상대도수와 이론값을 함께 나타낸 그래프' },
    common: { label: '공통수학', icon: 'Σ', relation: '수·식·함수·도형을 잇는 기본 구조', formula: '예 → 규칙 → 식·표·그래프의 연결', graph: '같은 규칙을 표·식·그래프로 나란히 번역한 그림' },
    ai: { label: '인공지능·이산', icon: '⌘', relation: '규칙·연결·알고리즘과 계산 결과의 관계', formula: '입력 → 규칙 또는 알고리즘 → 출력', graph: '입력 크기나 기준값에 따른 정확도·시간·연결 변화를 나타낸 그래프' },
    culture: { label: '수학과 문화', icon: '◇', relation: '문화 속 패턴과 수학적 표현의 관계', formula: '관찰한 패턴 → 수학적 표현 → 비교 가능한 기준', graph: '작품·기록·규칙에서 찾은 패턴을 수치와 도형으로 비교한 그림' }
  };

  var LENS = {
    WHY: { label: '왜 그런가', action: '정의에서 출발해 대표 예 세 개를 계산한다', check: '설명에 쓰지 않은 조건을 하나 빼도 결론이 유지되는지 확인한다' },
    CONDITION: { label: '조건 해부', action: '조건을 하나씩 켜고 끄며 성립 여부를 표에 기록한다', check: '필요조건과 충분조건을 바꾸어 말하지 않았는지 확인한다' },
    CONVERSE: { label: '거꾸로 묻기', action: '원래 명제와 역·이·대우를 나누어 예와 반례를 찾는다', check: '원래 명제가 참이라고 역도 참이라고 가정하지 않았는지 확인한다' },
    COUNTER: { label: '반례 찾기', action: '가장 단순한 값부터 결론을 깨뜨리는 최소 반례를 찾는다', check: '찾은 사례가 정말 모든 조건을 만족하는지 다시 대입한다' },
    PARAMETER: { label: '움직여 보기', action: '움직일 값을 일정한 간격으로 바꾸고 전환점을 기록한다', check: '간격 사이에서 중요한 변화가 빠지지 않았는지 더 촘촘히 확인한다' },
    CLASSIFY: { label: '경우 분류', action: '중복과 누락이 없는 분류 기준을 먼저 세운다', check: '같은 사례가 두 칸에 들어가거나 어느 칸에도 못 들어가는지 확인한다' },
    REPRESENT: { label: '표현 번역', action: '같은 대상을 식·표·그래프·도형으로 각각 나타낸다', check: '표현을 바꿀 때 정의역과 단위가 사라지지 않았는지 확인한다' },
    EXPERIMENT: { label: '수치 실험', action: '범위를 정해 여러 값을 반복 계산하고 예외를 따로 표시한다', check: '계산 몇 번의 패턴을 증명처럼 단정하지 않았는지 확인한다' },
    GENERALIZE: { label: '한 단계 확장', action: '가장 단순한 경우에서 변수나 차원을 하나씩 늘린다', check: '확장 전에는 없던 예외와 새 조건을 따로 기록한다' },
    DESIGN: { label: '직접 설계', action: '성공 예·경계 예·실패 예를 결과에서 거꾸로 설계한다', check: '만든 예가 질문의 조건을 정확히 만족하는지 다른 방법으로 검산한다' }
  };

  function clean(value, fallback) {
    var text = String(value == null ? '' : value).trim();
    return text || fallback || '';
  }

  function build(seed) {
    var subject = SUBJECT[seed.subject] || SUBJECT.common;
    var lens = LENS[seed.lens] || LENS.EXPERIMENT;
    var concepts = Array.isArray(seed.concepts) && seed.concepts.length ? seed.concepts.slice(0, 3) : [seed.title];
    var concept = clean(concepts[0], '핵심 개념');
    var second = clean(concepts[1], '조건');
    var knob = clean(seed.baseTopic ? seed.baseTopic.replace(/에서 .+$/, '') : '', second);
    var question = clean(seed.question, seed.title + '에서 무엇이 달라질까?');
    var firstAction = clean(seed.act || seed.lab, lens.action);
    var why = clean(seed.phenomenon || seed.situation,
      question + '은(는) 한 번의 계산보다 조건을 바꾸며 구조를 비교할 때 더 잘 보이는 질문이다.');

    return {
      generated: true,
      seedId: seed.id,
      subject: seed.subject,
      lens: seed.lens || 'EXPERIMENT',
      badge: subject.label + ' · ' + lens.label,
      icon: subject.icon,
      title: clean(seed.title, question),
      subtitle: '정답을 미리 주지 않고, 직접 움직이고 기록하며 결론을 만드는 탐구 설계 가이드',
      refinedQuestion: question,
      why: why + ' 핵심은 ' + concept + ' 및 ' + second + ' 사이의 관계를 근거로 설명하는 데 있다.',
      firstAction: firstAction,
      questionLadder: [
        { label: '01 관찰', text: '가장 단순한 예에서 보이는 ' + concept + '의 모습은 무엇일까?' },
        { label: '02 측정', text: '변화 기준을 ' + knob + '으로 정할 때 무엇을 숫자·표·그림으로 기록할까?' },
        { label: '03 검증', text: '예상과 다른 사례나 경계값에서도 같은 설명이 통할까?' },
        { label: '04 확장', text: clean(seed.next, '조건이나 변수의 수를 하나 늘리면 무엇이 유지되고 무엇이 달라질까?') }
      ],
      coreMath: {
        formula: subject.formula,
        normalized: concept + ' ↔ ' + second,
        rule: '주요 관계인 ' + subject.relation + '을 식·표·그래프 중 두 가지 이상으로 확인한다.',
        note: '이 식은 탐구의 결론이 아니라 확인할 관계를 정리한 출발점이다. 기호의 뜻과 적용 조건을 먼저 적는다.'
      },
      plan: [
        '질문의 핵심 낱말인 ' + concepts.join('·') + '의 정의와 적용 조건을 교과서에서 확인한다.',
        '변화 기준을 ' + knob + '으로 정하고, 기준 사례와 비교 사례를 최소 세 가지 만든다.',
        firstAction,
        '결과를 같은 단위의 표로 정리한다. 그래프 제안: ' + subject.graph + '.',
        lens.check + '.',
        '관찰한 사실, 수학으로 설명한 이유, 남은 질문을 구분해 결론을 쓴다.'
      ],
      variables: [
        { kind: '바꿀 것', text: knob + ' — 한 번에 하나씩, 범위와 간격을 먼저 정한다.' },
        { kind: '기록할 것', text: concept + ' 관련 값·모양·성립 여부를 같은 기준으로 기록한다.' },
        { kind: '같게 둘 것', text: '비교에 영향을 줄 수 있는 ' + second + '의 조건과 단위를 일정하게 둔다.' }
      ],
      dataColumns: ['사례', '바꾼 조건', '예상', '관찰·계산 결과', '설명 또는 예외'],
      dataRows: [
        ['기준 사례', '기본값', '먼저 예상 쓰기', '직접 계산·측정', '정의와 연결'],
        ['비교 사례 A', '한 단계 변화', '↑ · ↓ · 유지', '직접 계산·측정', '달라진 이유'],
        ['경계·반례', '극단값 또는 조건 제거', '성립 · 실패', '직접 계산·측정', '새 조건 제안']
      ],
      graphIdeas: [
        subject.graph,
        '예상과 실제 결과를 다른 기호로 표시해 어긋난 지점을 강조한다.',
        '경계값 앞뒤를 확대해 결론이 바뀌는 순간을 보여 준다.'
      ],
      checks: [
        lens.check + '.',
        '단위·정의역·표본 수처럼 결론의 범위를 제한하는 조건을 적었는가?',
        '계산기·그래프·다른 풀이 중 하나로 대표 사례를 다시 검산했는가?'
      ],
      mistakes: [
        '몇 개 사례가 맞는다는 이유로 모든 경우에 참이라고 단정하는 것',
        knob + '뿐 아니라 다른 조건까지 함께 바꾸어 원인을 구분하지 못하는 것',
        '그래프의 모양만 보고 정의·식·단위로 설명하지 않는 것',
        '예상과 다른 값을 지우고 성공한 자료만 결론에 사용하는 것'
      ],
      extensions: [
        clean(seed.next, '조건의 범위를 더 넓히면 같은 결론이 유지될까?'),
        '식·표·그래프 가운데 하나를 감추고도 나머지 표현만으로 결과를 예측할 수 있을까?',
        '같은 구조가 다른 교과나 생활 장면에서도 나타나는 사례를 찾을 수 있을까?',
        '친구가 만든 반례를 막는 가장 약한 조건은 무엇일까?'
      ],
      report: [
        '질문을 고른 이유와 처음 예상',
        '핵심 개념의 정의와 질문에 필요한 조건',
        '사례·변인·자료 수집 또는 계산 방법',
        '표와 그래프에서 발견한 패턴 및 예외',
        '수학적 설명, 결론의 범위, 새로 생긴 질문'
      ],
      levels: [
        { label: 'START · 30분', text: '기준 사례와 비교 사례 한 개를 만들어 표 한 줄씩 채운다.' },
        { label: 'BUILD · 2차시', text: '경계·반례까지 포함해 그래프를 만들고 개념으로 설명한다.' },
        { label: 'DEEP · 프로젝트', text: '조건의 범위를 넓히고 일반화 또는 다른 분야 연결까지 검증한다.' }
      ]
    };
  }

  window.JPDeepDiveGenerator = { build: build, SUBJECT: SUBJECT, LENS: LENS };
}());
