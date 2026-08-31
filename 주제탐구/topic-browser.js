/* 오리엔테이션 슬라이드의 차시별 제작 주제 24개.
   이것은 탐구 씨앗이 아니다. 씨앗은 seeds.js 에 있다.
   여기는 "이번 학기에 무엇을 만들 것인가", 씨앗은 "무엇이 궁금한가"다. */
(function () {
  'use strict';

  var TOPICS = [
    {n:3, c:'calc', lv:'easy', t:'Limit Lab',              q:'점에 도달하지 않아도 그 점의 값을 말할 수 있는가?', b:'좌·우 접근값을 표로 보여 주는 극한 시뮬레이터'},
    {n:4, c:'calc', lv:'easy', t:'Continuity Lab',         q:'그래프가 이어져 보인다는 직관은 언제 틀리는가?',    b:'연속의 세 조건을 따로 판정하는 도구'},
    {n:5, c:'calc', lv:'', t:'Differentiability Lab',      q:'연속이면 언제나 미분 가능한가?',                    b:'좌·우 할선 기울기를 비교하는 미분가능성 탐지기'},
    {n:6, c:'calc', lv:'easy', t:'Secant → Tangent',       q:'순간변화율은 어떻게 탄생하는가?',                  b:'할선이 접선으로 수렴하는 시뮬레이터'},
    {n:7, c:'calc', lv:'easy', t:'Derivative Lab',         q:'도함수는 원함수에 대해 무엇을 말해 주는가?',        b:'도함수 생성기 + 수치미분 검산기'},
    {n:8, c:'calc', lv:'', t:'Function Detective',         q:'도함수만 보고 원함수를 알아낼 수 있는가?',          b:'도함수 부호로 그래프를 추리하는 게임'},
    {n:9, c:'calc', lv:'hard', t:'Mean Value Lab',         q:'평균변화율과 순간변화율은 왜 반드시 만나는가?',      b:'평균값정리의 조건을 조작하는 탐구기'},
    {n:10,c:'calc', lv:'hard', t:'Optimization Studio',    q:'최선의 선택은 어떻게 찾는가?',                      b:'제약조건을 넣은 최적화 모델러'},
    {n:11,c:'calc', lv:'easy', t:'Motion Lab',             q:'위치·속도·가속도는 어떻게 연결되는가?',             b:'세 그래프가 연동되는 운동 시뮬레이터'},
    {n:12,c:'calc', lv:'easy', t:'Riemann Sum Lab',        q:'넓이는 어떻게 무한한 합이 되는가?',                 b:'분할 수를 조절하는 리만합 시각화 도구'},
    {n:13,c:'calc', lv:'', t:'Definite Integral Lab',      q:'정적분은 넓이인가, 누적량인가?',                    b:'부호를 포함한 누적량 계산기'},
    {n:14,c:'calc', lv:'hard', t:'Fundamental Theorem Lab',q:'누적함수의 변화율은 왜 원래 함수인가?',             b:'미적분 기본정리를 눈으로 보는 도구'},
    {n:15,c:'calc', lv:'', t:'Integral Modeling',          q:'적분으로 현실의 무엇을 설명할 수 있는가?',          b:'실제 데이터를 누적하는 모델 앱'},
    {n:16,c:'calc', lv:'hard', t:'Calculus Synthesis',     q:'변화와 누적을 하나의 규칙으로 묶을 수 있는가?',      b:'미적분 종합 챌린지 작품'},
    {n:17,c:'geo',  lv:'easy', t:'Parabola Lab',           q:'포물선은 왜 포물선인가?',                          b:'초점·준선에서 자취를 생성하는 도구'},
    {n:18,c:'geo',  lv:'', t:'Ellipse & Hyperbola Lab',    q:'두 초점은 왜 두 종류의 자취를 만드는가?',           b:'거리의 합·차로 곡선을 그리는 생성기'},
    {n:19,c:'geo',  lv:'hard', t:'Conic Tangent Lab',      q:'접선은 곡선의 정보를 어떻게 담는가?',               b:'판별식으로 접선을 판정하는 도구'},
    {n:20,c:'geo',  lv:'', t:'3D Geometry Lab',            q:'공간의 위치 관계를 조건으로 쓸 수 있는가?',         b:'3차원 직선·평면 시각화 도구'},
    {n:21,c:'geo',  lv:'hard', t:'Projection Lab',         q:'정사영과 최단거리는 왜 같은 이야기인가?',           b:'투영 방향에 따른 도형 변화 탐구기'},
    {n:22,c:'geo',  lv:'easy', t:'3D Coordinate Lab',      q:'좌표만으로 공간을 계산할 수 있는가?',               b:'거리·내분점 인터랙션 계산기'},
    {n:23,c:'geo',  lv:'easy', t:'Vector Engine I',        q:'벡터는 이동을 어떻게 규칙으로 만드는가?',           b:'벡터로 움직이는 이동 엔진'},
    {n:24,c:'geo',  lv:'', t:'Vector Engine II',           q:'내적은 방향 관계를 어떻게 판정하는가?',             b:'내적 부호로 방향을 판정하는 도구'},
    {n:25,c:'geo',  lv:'hard', t:'Line & Plane Navigator', q:'직선과 평면을 벡터로 설계할 수 있는가?',            b:'벡터 기반 3D 내비게이터'},
    {n:26,c:'geo',  lv:'hard', t:'Geometry Synthesis',     q:'자취에서 공간 엔진까지 이을 수 있는가?',            b:'기하 종합 챌린지 작품'}
  ];

  // 오리엔테이션 슬라이드가 이 목록을 읽는다. 목록은 여기 한 곳에만 둔다.
  window.JPTopics = TOPICS;
}());
