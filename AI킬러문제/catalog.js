/* AI 킬러문제 목록 분류기
   세트 번호는 오래된 주소를 살리는 내부 식별자로만 남긴다.
   학생 화면은 과목 → 대단원 → 난이도 → 문제 순서로만 보여 준다. */
(function () {
  'use strict';

  const subjects = [
    { key: 'calculus', label: '미적분Ⅰ', short: '미적분', ready: true },
    { key: 'algebra', label: '대수', short: '대수', ready: false },
    { key: 'probability', label: '확률과 통계', short: '확통', ready: false }
  ];
  const difficulties = [
    { key: 'semi', label: '준킬러', caption: '조건을 한 번 바꾸어 읽는 문제' },
    { key: 'killer', label: '킬러', caption: '두 개 이상의 전환을 잇는 문제' },
    { key: 'extreme', label: '극킬러', caption: '경계와 예외까지 끝까지 확인하는 문제' }
  ];
  const domains = [
    { key: 'limit', label: '극한·연속', caption: '극한의 존재와 함수가 이어지는 조건을 읽는 문제' },
    { key: 'derivative', label: '미분', caption: '접선·변화율·극값을 도함수의 언어로 바꾸는 문제' },
    { key: 'integral', label: '적분', caption: '넓이와 누적된 변화를 함수로 되돌리는 문제' }
  ];

  /* 기존 문항은 공개 주소를 바꾸지 않기 위해 여기에서 난이도만 다시 분류한다. */
  const legacyDifficulty = {
    '1-1': 'semi', '1-2': 'killer', '1-3': 'extreme', '1-4': 'semi', '1-5': 'killer',
    '2-1': 'semi', '2-2': 'semi', '2-3': 'killer', '2-4': 'extreme',
    '3-1': 'extreme', '3-2': 'extreme'
  };
  const legacyDomain = {
    '1-1': 'derivative', '1-2': 'derivative', '1-3': 'integral', '1-4': 'integral', '1-5': 'derivative',
    '2-1': 'limit', '2-2': 'derivative', '2-3': 'derivative', '2-4': 'derivative',
    '3-1': 'limit', '3-2': 'limit',
    '4-1': 'derivative', '4-2': 'integral', '4-3': 'derivative', '4-4': 'derivative', '4-5': 'integral', '4-6': 'derivative'
  };
  const subjectKey = (name) => name === '대수' ? 'algebra' : name === '확률과 통계' ? 'probability' : 'calculus';
  const sets = (window.JPKillerSets || []).slice().sort((a, b) => a.id - b.id);
  let serial = 0;
  const problems = [];
  sets.forEach((set) => set.problems.forEach((problem) => {
    serial += 1;
    const difficulty = problem.difficulty || legacyDifficulty[`${set.id}-${problem.no}`] || 'killer';
    const domain = problem.domain || legacyDomain[`${set.id}-${problem.no}`] || 'derivative';
    problems.push(Object.assign({}, problem, {
      setId: set.id,
      subject: set.subject,
      subjectKey: subjectKey(set.subject),
      domain,
      difficulty,
      code: problem.code || `CALC-${String(serial).padStart(2, '0')}`,
      href: `문제.html?set=${set.id}&no=${problem.no}`
    }));
  }));

  window.JPKillerCatalog = { subjects, domains, difficulties, problems };
})();
