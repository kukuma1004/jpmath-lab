/* 씨앗 확장기 — 200개 기본 주제와 10개 렌즈로 확장 씨앗을 만든다.

   확장 씨앗 1892개는 (기본 주제, 렌즈) 한 쌍에서 계산되는 값이다.
   그래서 본문을 파일에 담아 보내지 않고 여기서 만든다.
   담아 보내면 2.5 MB, 만들면 130 KB 다.

   이 파일은 scripts/make-seed-expand.py 가 생성기에서 떼어 만든다.
   직접 고치지 말고 scripts/build-seed-catalog.mjs 의 LENSES 를 고친 뒤
   다시 뽑는다. 생성기도 이 파일을 읽어 쓰므로 둘은 항상 같은 글자다. */
(function () {
  'use strict';

  function hasBatchim(text) {
    var chars = Array.from(String(text || '')).filter(char => /[가-힣]/.test(char));
    if (!chars.length) return false;
    return (chars.at(-1).charCodeAt(0) - 0xAC00) % 28 !== 0;
  }

  function josa(text, pair) {
    var [withBatchim, withoutBatchim] = pair.split('/');
    return `${text}${hasBatchim(text) ? withBatchim : withoutBatchim}`;
  }

  var LENSES = [
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

  /* ── 학교급과 출발점 ──────────────────────────────────────────
     규칙은 이 한 곳에 있다. 낱말을 고치면 씨앗의 분류가 바뀐다. */

  var HIGH_ONLY = [
    // 미적분
    '극한', '미분', '적분', '도함수', '미분계수', '순간변화율', '평균변화율',
    '연속', '급수', '수렴', '발산', '변곡', '누적', '리만', '최적화', '접선',
    // 대수
    '수열', '등차', '등비', '점화', '귀납', '시그마',
    '지수함수', '지수법칙', '로그', '삼각함수', '호도법', '사인법칙', '코사인법칙',
    '무리함수', '유리함수', '합성함수', '역함수', '가우스 함수', '자연상수',
    '판별식', '나머지정리', '인수정리', '근과 계수', '절대부등식',
    '복소수', '허수', '행렬', '역행렬', '다항방정식', '삼차', '사차', '조각함수',
    // 확률과 통계
    '순열', '조합', '이항', '확률분포', '정규분포', '이항분포', '기댓값',
    '조건부', '독립시행', '표본', '신뢰구간', '모평균', '통계적 추정',
    // 기하
    '벡터', '내적', '정사영', '공간좌표', '공간벡터', '공간도형',
    '이차곡선', '타원', '쌍곡선', '준선', '초점', '점근선', '원의 방정식',
    // 공통수학
    '집합', '명제', '필요충분', '대우', '전칭', '존재명제',
    // 경제수학
    '현재가치', '복리', '연금', '할인율', '탄력성', '손익분기'
    ];

  var MIDDLE_OK = [
    '소인수분해', '최대공약수', '최소공배수', '정수', '유리수', '무리수',
    '제곱근', '실수', '근호', '거듭제곱',
    '일차식', '일차방정식', '연립방정식', '부등식', '일차부등식',
    '곱셈공식', '인수분해', '이차방정식', '근의 공식', '이차함수',
    '좌표평면', '정비례', '반비례', '일차함수', '기울기', '절편',
    '작도', '평면도형', '다각형', '내각', '외각', '부채꼴', '원주각',
    '원의 성질', '원의 넓이', '입체도형', '겉넓이', '부피', '전개도',
    '삼각형의 성질', '사각형의 성질', '닮음', '피타고라스', '삼각비',
    '경우의 수', '확률', '여사건',
    '도수분포', '히스토그램', '평균', '중앙값', '최빈값', '대푯값',
    '분산', '표준편차', '산포도', '상관관계', '산점도',
    '비율', '백분율', '비례식', '기준량'
    ];

  var REAL_WORLD = [
    '게임', '캐릭터', '총알', '충돌', '시야', '조명', '픽셀', '화면', '카메라', '사진', '영상',
    '자동차', '속도계', '비행기', '기수', '활주로', '바람', '드론', '로봇', '배가',
    '지붕', '태양', '햇빛', '그림자', '패널', '건물', '도시', '다리', '지하철', '내비게이션', '지도',
    '안테나', '접시', '헤드라이트', '전구', '신호', '기지국', '위성', 'GPS', '전파', '통신',
    '소리', '음악', '건반', '옥타브', '데시벨', '소음', '별의', '행성', '궤도', '천문', '우주',
    '이자', '대출', '가격', '할인', '매출', '이익', '환율', '주식', '투자', '자산',
    '물가', '연봉', '저축', '판매', '손익', '기업', '가게', '광고', '조회수', '수익률',
    '감염', '인구', '확산', '검사', '양성', '여론', '투표', '조사', '설문', '의료',
    '종이', '상자', '피자', '포장', '롤러코스터', '놀이기구', '스포츠', '농구', '대포',
    'AI', '인공지능', '컴퓨터', '알고리즘', '암호', '비밀번호', '해킹', '시간표', '학습률',
    '온도', '날씨', '전기', '에너지', '교통', '물류', '요금', '강을', '강 건너',
    '속삭', '바이럴', '공유', '유행', '교실', '학교', '실제로'
    ];

  function hit(text, words) {
    for (var i = 0; i < words.length; i += 1) {
      if (text.indexOf(words[i]) > -1) return true;
    }
    return false;
  }

  function classifySeed(seed) {
    // 개념만으로는 모자란다. 뱅크 씨앗은 개념 칸에 제목이 들어 있는
    // 경우가 있어서 제목과 질문까지 함께 본다.
    var evidence = [
      (seed.concepts || []).join(' '), seed.title, seed.question, seed.baseTopic
    ].filter(Boolean).join(' ');
    var stage = hit(evidence, HIGH_ONLY)
      ? 'high'
      : (hit(evidence, MIDDLE_OK) ? 'middle' : 'high');

    var surface = [
      seed.title, seed.question, seed.baseTopic, seed.phenomenon, seed.situation,
      (seed.domain || []).join(' ')
    ].filter(Boolean).join(' ');
    var track = hit(surface, REAL_WORLD) ? 'connected' : 'internal';

    return { stage: stage, track: track };
  }

  /* ── 기본 주제와 씨앗 만들기 ───────────────────────────────── */

  // BASES 한 줄은 [과목, 주제, '개념,개념', 움직일 것] 이다.
  function toBase(row, index) {
    var num = String(index + 1);
    while (num.length < 3) num = '0' + num;
    return {
      code: num,
      subject: row[0],
      topic: row[1],
      concepts: row[2].split(',').map(function (x) { return x.trim(); }).filter(Boolean),
      knob: row[3],
      origin: ['econ', 'ai', 'culture'].indexOf(row[0]) > -1 ? 'connected' : 'internal'
    };
  }

  function buildSeed(base, lens) {
    var seed = {
      id: 'JP2K-' + base.subject.toUpperCase() + '-' + base.code + '-' + lens.id,
      src: 'seed2000',
      grade: 'B',
      subject: base.subject,
      title: lens.label + ' \u00b7 ' + base.topic,
      question: lens.question(base),
      phenomenon: base.topic + '\uc744 \ud558\ub098\uc758 \uc815\ub2f5\uc73c\ub85c \ub05d\ub0b4\uc9c0 \uc54a\uace0 \u2018' + lens.label +
        '\u2019\uc758 \uad00\uc810\uc5d0\uc11c \ub2e4\uc2dc \uc5ec\ub294 \uc218\ud559 \ub0b4\ubd80\ud615 \ud0d0\uad6c\ub2e4.',
      concepts: base.concepts,
      domain: [base.origin === 'internal' ? '\uc218\ud559 \ub0b4\ubd80' : '\ud604\uc0c1 \uc5f0\uacb0', lens.label],
      relation: ['econ', 'ai', 'culture'].indexOf(base.subject) > -1 ? 'ADJACENT' : 'CORE',
      entry: 'highschool',
      ceiling: ['GENERALIZE', 'CONVERSE', 'COUNTER'].indexOf(lens.id) > -1
        ? 'undergraduate_intro'
        : 'highschool_advanced',
      status: 'candidate',
      act: lens.act(base),
      next: lens.next(base),
      origin: base.origin,
      lens: lens.id,
      baseTopic: base.topic,
      sourceNote: SOURCE_NOTE,
      asset: {
        label: '\uc774 \uc528\uc557\uc73c\ub85c \ud0d0\uad6c \uc2dc\uc791',
        href: 'inquiry.html?seed=' + encodeURIComponent('JP2K-' + base.subject.toUpperCase() +
          '-' + base.code + '-' + lens.id)
      }
    };
    var cls = classifySeed(seed);
    seed.stage = cls.stage;
    seed.track = cls.track;
    return seed;
  }

  var SOURCE_NOTE = '2022 \uac1c\uc815 \uad50\uc721\uacfc\uc815, JP Math Lab ' +
    '\uc544\uc774\ub514\uc5b4\ubc45\ud06c, \ub791\ub370\ubdf0 \uc138\ubbf8\ub098\uc758 ' +
    '\uc8fc\uc81c \uc720\ud615\uc744 \ucc38\uace0\ud574 \uc0c8 \uc9c8\ubb38\uc73c\ub85c \uc7ac\uad6c\uc131';

  var LENS_BY_ID = {};
  for (var li = 0; li < LENSES.length; li += 1) LENS_BY_ID[LENSES[li].id] = LENSES[li];

  // picks 는 [기본 주제 번호, 렌즈 id] 짝이다. 어느 쌍이 뽑혔는지는
  // 생성기가 정하고, 본문은 여기서 만든다.
  function expand(bases, picks) {
    var baseObjects = bases.map(toBase);
    var out = [];
    for (var i = 0; i < picks.length; i += 1) {
      var base = baseObjects[picks[i][0]];
      var lens = LENS_BY_ID[picks[i][1]];
      if (base && lens) out.push(buildSeed(base, lens));
    }
    return out;
  }

  window.JPSeedExpand = {
    LENSES: LENSES,
    toBase: toBase,
    buildSeed: buildSeed,
    classifySeed: classifySeed,
    expand: expand
  };
}());
