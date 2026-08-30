<!-- 문서-권한 -->
> **아이디어 원천**  현재 기준은 [`JP_MATH_LAB_2.0_MASTER_SPEC.md`](JP_MATH_LAB_2.0_MASTER_SPEC.md) 하나다.
> 만들 것을 정한 문서가 아니다. 소재를 고를 때 참고한다.
> _(2026-08-31 문서 권한 정리)_

# JP Math Lab 2022 콘텐츠 아이디어 뱅크 v13
## CURRENT CANON UPDATE — Seed 확장: 교육과정은 뼈대, 경계는 아님

> **v13의 가장 중요한 추가 결정**
>
> JP Math Lab의 Seed DB는 2022 개정 수학 교육과정을 중심 뼈대로 삼되,
> **교육과정 안에만 갇히지 않는다.**
>
> 학생이 고등학교 수학을 출발점으로 이해할 수 있고,
> 실제 현상·역사·과학·게임·AI·경제·예술·대학수학 등으로
> 확장할 수 있다면 적극적으로 Seed 후보로 수집한다.

---

# 0. 현재 핵심 구조 한눈에 보기

```text
LOGIN
→ 캐릭터/프로필
→ PLAY
   → 기존 개념·연산 수학게임
   → 게임별 기록/EXP/Gold
   → Challenge
   → Boss Battle 2.0
      → 제한시간
      → Damage
      → HP
      → Boss Skill
      → Phase
      → Clear 가능
→ DISCOVER
   → 질문/영상
→ EXPLORE
   → Lab / Graph / 3D / Simulation
→ RESEARCH
   → Seed 기반 탐구
```

그리고 이 모든 것의 가장 아래에는:

```text
CURRICULUM CONCEPT MAP
        +
VERIFIED SEED DB
        +
CONNECTION GRAPH
```

가 존재한다.

---

# 1. Seed DB의 최종 목적

Seed DB의 목적은 탐구주제를 많이 쌓는 것 자체가 아니다.

> **수학 개념과 세상의 흥미로운 현상 사이의
> 검증된 연결을 장기 자산으로 축적하는 것**

이다.

좋은 Seed는 다음으로 확장될 수 있다.

```text
SEED
├─ Question
├─ Discover
├─ Concept Lite
├─ Concept Full
├─ Game
├─ Boss Rule
├─ Lab
├─ Data Activity
├─ Research
└─ Teacher Activity
```

따라서:

> **Seed = 완성 콘텐츠가 아니라 여러 경험으로 자랄 수 있는 원천 아이디어**

이다.

---

# 2. 교육과정은 뼈대다

JP Math Lab의 기본 탐색 축은
2022 개정 수학 교육과정의 과목과 개념이다.

예:

```text
공통수학
대수
미적분 I
확률과 통계
기하
미적분 II
경제 수학
인공지능 수학
이산수학
수학과 문화
실용통계
수학과제 탐구
직무 수학
기본수학
고급/전문 수학
```

각 과목은 가능한 한 Concept ID로 쪼갠다.

예:

```text
GEO-VEC-BASIC
GEO-VEC-DOT
CAL-DER-INSTANT
CAL-DER-OPT
PROB-COND
STAT-SAMPLING
ALG-LOG
ECON-COMPOUND
```

모든 Seed는 가능하면 하나 이상의 Math Concept ID와 연결한다.

---

# 3. 그러나 교육과정은 경계가 아니다

JP Math Lab은 교과서 요약 서비스가 아니다.

고등학교 수학을 출발점으로
조금 더 멀리 가는 경험을 적극적으로 포함한다.

Seed의 교육과정 관계를 다음처럼 분류한다.

| Level | 의미 |
|---|---|
| CORE | 현행 교육과정 안에 직접 포함 |
| ADJACENT | 교육과정 개념으로 바로 접근 가능 |
| EXTENSION | 한두 단계 확장하면 도달 |
| ADVANCED | 대학수학/고급수학까지 연결 |
| OUTSIDE | 교과 밖이지만 수학적으로 강하게 흥미로운 주제 |

---

# 4. Curriculum Relation 예시

## 미분

```text
CORE
→ 순간변화율
→ 도함수
→ 극대/극소

ADJACENT
→ 자동차 순간속도
→ 경제의 한계비용
→ 스포츠 속도 변화

EXTENSION
→ Newton Method
→ Logistic Growth
→ Gradient Descent

ADVANCED
→ 다변수 미분
→ Gradient Vector
→ 편미분

OUTSIDE
→ Chaos
→ Butterfly Effect
```

## 기하 / 벡터

```text
CORE
→ 벡터
→ 내적
→ 정사영

ADJACENT
→ 게임 Field of View
→ 자율주행 방향 판정
→ 3D 물체 방향

EXTENSION
→ Normal Vector
→ Lambertian Shading
→ Ray Casting

ADVANCED
→ 3D Transform
→ Matrix Representation
→ Linear Algebra

OUTSIDE
→ Ray Tracing
→ Computer Graphics Pipeline
```

---

# 5. Entry Difficulty와 Ceiling Difficulty를 구분한다

어떤 주제는 끝까지 파면 대학 수준이지만,
입구는 고등학생도 충분히 이해할 수 있다.

따라서 Seed마다 두 난이도를 구분한다.

```yaml
entry_difficulty: highschool
ceiling_difficulty: undergraduate_intro
```

예: Gradient Descent

입구:
> AI는 어떻게 틀린 방향을 줄여가며 더 나은 답을 찾을까?

고교 연결:
```text
함수
기울기
증가/감소
미분
극값
```

더 깊이 가면:
```text
다변수 함수
Gradient
Partial Derivative
Optimization
```

까지 이어진다.

이런 Seed는 매우 가치가 높다.

---

# 6. Seed 수집 광산

Seed를 특정 분야에서만 찾지 않는다.

각 수학 개념을 아래 렌즈로 반복해서 탐색한다.

```text
수학사
과학사
물리
우주
천문
생명과학
의학
경제
금융
건축
예술
음악
게임
CG
AI
프로그래밍
암호
네트워크
스포츠
지도
교통
사회
데이터
자연
퍼즐
역설
전쟁/전략
일상생활
현대기술
대학수학 맛보기
```

목적:

> 같은 수학 개념을 전혀 다른 세계에서 다시 만나는 경험 만들기

---

# 7. Seed 하나의 기본 구조

권장 형태:

```yaml
seed_id: GEO-VEC-DOT-FOV-001

title: 게임은 적이 내 앞에 있는지 어떻게 알까?

status: verified

curriculum_relation:
  level: ADJACENT

math_concepts:
  - GEO-VEC-DOT
  - GEO-VEC-ANGLE

domain:
  - 게임
  - 프로그래밍
  - 3D

phenomenon:
  "Field of View 판정"

question:
  "게임은 캐릭터가 적을 바라보고 있는지 어떻게 계산할까?"

entry_difficulty: highschool
ceiling_difficulty: undergraduate_intro

potential:
  question: 5
  visual: 5
  game: 5
  lab: 5
  research: 5
  data: 3
  boss_rule: 4
  connection: 5

assets:
  discover: null
  game: null
  lab: null
  research: null

verification:
  math_checked: true
  fact_checked: true

connections:
  prerequisites:
    - vector-basic
  related:
    - projection
    - normal-vector
    - game-ai
```

---

# 8. Seed Candidate와 Verified Seed를 구분한다

인터넷에서 발견했거나 AI가 생성한 아이디어는 바로 자산으로 확정하지 않는다.

```text
FOUND / AI GENERATED
        ↓
CANDIDATE
        ↓
DUPLICATE CHECK
        ↓
MATH CHECK
        ↓
FACT CHECK
        ↓
CURRICULUM LINK
        ↓
EXPERIENCE FEASIBILITY
        ↓
HUMAN REVIEW
        ↓
VERIFIED SEED
```

특히 역사·과학 일화는:

```text
verified
disputed
legend
```

상태를 구분한다.

---

# 9. Seed 평가 축

| 코드 | 평가 |
|---|---|
| Q | 질문의 힘 |
| M | 수학적 깊이 |
| V | 시각화 가능성 |
| G | 게임화 가능성 |
| L | Lab 가능성 |
| R | 탐구 확장성 |
| D | 데이터 활용성 |
| B | Boss Rule 가능성 |
| C | 다른 Seed와 연결성 |
| F | 사실/수학 검증 신뢰도 |

활용 예:

```text
Q ≥ 4 + V ≥ 4
→ DISCOVER 후보

G ≥ 4
→ GAME 후보

L ≥ 4
→ LAB 후보

R ≥ 4 + D ≥ 3
→ RESEARCH 후보

B ≥ 4
→ Boss Rule 후보
```

---

# 10. Seed Graph

Seed의 진짜 가치는 개별 개수보다 연결망에서 커진다.

예:

```text
포물선
├─ 농구 슛
├─ 위성 안테나
├─ 자동차 헤드라이트
├─ 투사체 운동
└─ 게임 물리
```

그리고:

```text
농구 슛
→ 포물선
→ 최적 발사각
→ 변화율
→ 미분
→ 최적화
```

또는:

```text
벡터 내적
→ 방향
→ 게임 FOV
→ 법선벡터
→ 3D 조명
→ Ray Tracing
```

학생이 하나를 경험했을 때 다음 연결을 추천할 수 있다.

---

# 11. Seed DB 목표는 '수만 개'가 아니다

잘못된 목표:

```text
주제 100,000개 만들기
```

권장 목표:

```text
교육과정 Concept Map 완성
↓
Verified Seed 500개
↓
연결 강화
↓
1,000개
↓
Experience 확장
```

> **허술한 10,000개보다 연결된 500개가 더 강하다.**

---

# 12. Seed의 복리 효과

예:

```text
Seed: 포물선 × 농구 슛
```

여기서:

```text
Question
→ 왜 슛은 포물선을 그릴까?

Discover
→ 1분 콘텐츠

Concept
→ 이차함수

Lab
→ 각도/속도 조절

Game
→ 최적 슛 각도 맞히기

Data
→ 실제 슛 영상 좌표 분석

Research
→ 발사각과 성공확률 탐구

Boss Rule
→ 궤적 왜곡/중력 변화 규칙
```

이 하나의 Seed가 여러 제품 경험을 만든다.

---

# 13. JP Math Lab의 장기 자산 우선순위

```text
1. Verified Seed DB
2. Seed Connection Graph
3. Math Concept Map
4. 실제 Math Games
5. Interactive Labs
6. Content Family
7. Student Activity History
8. Boss Rule Library
9. Discover Video Library
10. AI Routing Logic
```

AI 모델 자체는 자산이 아니다.

> **Seed + Experience + Connection + History가 자산이다.**

---

# 14. APP / WEB과 Seed의 관계

```text
SEED
 ↓
CONTENT FAMILY
 ├─ App Concept Lite
 ├─ App Quick Game
 ├─ App Discover
 ├─ Web Concept Full
 ├─ Web Lab
 ├─ Web Research Full
 └─ Boss Rule
```

같은 Seed를 다른 깊이로 보여준다.

---

# 15. Boss Battle 2.0 현재 기준

기존 일부 보스:
```text
3연속 공격 성공
→ Clear
```

장기적으로는 다음으로 전환한다.

> **제한시간 안에 최대 Damage를 넣는 기록 도전 + 실제 Clear 가능**

구성:
```text
TIME LIMIT
BOSS HP
DAMAGE
COMBO
BOSS SKILL
PHASE
CLEAR / TIME OVER
```

핵심:
> **Boss Skill = Rule Modifier**

보스가 다르면 같은 수학게임도 플레이 전략이 달라진다.

---

# 16. Boss Engine은 공통화한다

미적분과 기하를 각각 전면 수정하지 않는다.

```text
COMMON BOSS ENGINE
+
GAME ADAPTER
+
BOSS CONFIG
```

첫 번째 보스 하나만 Boss Engine 2.0으로 실험하고
재미가 확인되면 점진적으로 이전한다.

---

# 17. 영상의 현재 위치

영상은 중요하지만 아직 생산 시스템을 확정하지 않는다.

```text
시제품 1개
↓
완성도/제작비/생산속도 평가
↓
계속할지 판단
```

영상 생성 도구가 병목이어도 게임·Seed·Lab 개발은 계속한다.

---

# 18. 현재 제품 개발의 우선순위

```text
1. Seed 구조 제대로 설계
2. 기존 Math Game 보존
3. Login / Profile / Character
4. 게임별 기록 / EXP / Gold
5. Retry Loop
6. Boss Engine 2.0 한 보스
7. Seed → Game/Lab/Research 연결
8. Discover 영상 시제품
9. Rewarded Ad
10. Native App
```

---

# 19. 현재 최종 선언

JP Math Lab에서 교육과정은 매우 중요하다.

하지만 교육과정은:

> **출발점이지 경계선이 아니다.**

학생이 고등학교 수학을 통해
AI, 게임, 우주, 금융, 생명과학, 그래픽,
현대수학, 대학수학의 입구까지 볼 수 있어야 한다.

좋은 Seed는:

> **“이게 수학으로 연결된다고?”**

라는 반응을 만들고,

그 뒤에:

> **“그런데 내가 배운 수학으로 여기까지 이해할 수 있네.”**

를 남겨야 한다.

따라서 JP Math Lab의 Seed DB는:

> **2022 개정 수학 교육과정을 중심축으로 하되,
> 교육과정 밖의 흥미로운 수학까지 연결하는
> 검증된 수학 아이디어 그래프**

로 구축한다.

---

# 20. v13 변경사항 요약

v12에서 유지:
- APP / WEB 역할 분리
- 공통 로그인
- PLAY 중심
- 기존 개념/연산게임 유지
- Rewarded Ads
- 학생 직접 보고서
- AI Router
- Connected Experience
- Seed 최상위 자산
- 공통 Boss Engine 2.0

v13에서 추가:
- 교육과정은 Seed의 경계가 아니라 뼈대
- CORE / ADJACENT / EXTENSION / ADVANCED / OUTSIDE 분류
- Entry Difficulty / Ceiling Difficulty 분리
- 교과 밖 Seed 적극 수집
- 현대기술/AI/게임/CG/대학수학까지 Seed 광산 확장
- Seed 수량보다 검증도·연결도 우선
- 500개 → 1,000개 Verified Seed를 단계적으로 구축하는 전략

---

# 21. LEGACY ARCHIVE 안내

아래는 v12까지의 전체 누적 기록이다.

충돌 시 우선순위:

```text
v13 CURRENT CANON
> v12 CURRENT CANON
> v11
> 이전 버전
```

단, 오래된 섹션의 좋은 Seed와 아이디어는 폐기하지 않는다.

# JP Math Lab 2022 콘텐츠 아이디어 뱅크 v12
## CURRENT CANON · 씨앗 자산 · Boss Engine 2.0 · AI 인수인계판

> **이 문서의 맨 앞 `CURRENT CANON`이 현재 기준이다.**
> 아래쪽에는 v1~v11의 사고 과정과 폐기된 안도 역사 보존 목적으로 남아 있다.
> 서로 충돌하는 내용이 있으면 반드시 이 v12의 CURRENT CANON을 우선한다.

---

# 0. AI가 이 문서를 읽을 때 가장 먼저 알아야 할 것

이 문서는 단순한 콘텐츠 목록이 아니다.

JP Math Lab은 긴 고민 과정에서 다음처럼 변화했다.

```text
수학 콘텐츠 모음
→ 1분 영상 아이디어 뱅크
→ 영상 + 인터랙티브 Lab
→ 게임 + Lab + Research
→ 앱 생태계
→ Meta Game / Research Generator
→ 학생·교사 분리
→ 학생 유료안 검토
→ 학생 유료안 폐기
→ APP + WEB 역할 분리
→ Connected Experience
→ 공통 Boss Engine
→ Seed Asset 중심 플랫폼
```

따라서 오래된 섹션의 한 문장만 떼어내 현재 방향이라고 판단하면 안 된다.

## 읽기 우선순위

1. `CURRENT CANON`
2. `SEED ASSET`
3. `CONNECTED EXPERIENCE`
4. `BOSS ENGINE 2.0`
5. `FIRST PROTOTYPE`
6. 필요할 때만 아래의 v1~v11 역사/아이디어 섹션 탐색

---

# 1. CURRENT CANON — 현재 확정된 방향

## 1.1 제품 정의

> **JP Math Lab은 학생이 수학을 게임으로 반복하고,
> 질문으로 발견하고,
> 직접 조작하며 이해하고,
> 자신의 관심사로 탐구까지 확장하는 경험을
> 하나의 계정과 콘텐츠 DB로 연결하는 플랫폼이다.**

핵심 단어:

> **CONNECTED EXPERIENCE**

JP Math Lab의 경쟁력은 텍스트 생성량이 아니라
서로 연결된 수학 경험이다.

---

## 1.2 APP과 WEB은 경쟁 관계가 아니다

```text
APP = 자주 들어오는 곳
WEB = 깊이 들어가는 곳
```

### MOBILE APP

- PLAY
- DISCOVER
- Concept Lite
- Quick Explore
- Research Entry
- EXP / Gold / 기록 / 시즌 / 랭킹

### WEB

- Concept Full
- Graph Lab
- 3D Geometry / Vector Lab
- Probability Lab
- Economy Simulator
- Data Lab
- Research Full
- 향후 Teacher Studio

둘은 동일 계정과 동일 콘텐츠 DB를 사용한다.

---

## 1.3 로그인

정식 구조에서는 계정이 필요하다.

권장:

```text
Google Sign-in
Apple Sign-in
```

계정은 다음을 앱과 웹에서 공유한다.

- 기록
- EXP
- Gold
- Skill
- Unlock
- Saved Research
- Activity History
- Recommendation

초기 수집 정보는 최소화한다.

```text
nickname
grade
interests[]
```

학교/학급 연결은 필요한 경우 나중에 추가한다.

---

## 1.4 학생 수익모델 — 현재 기준

초기 학생용 결제/크레딧 모델은 **폐기**한다.

```text
학생 기본 사용 = FREE
선택형 추가 보상 = REWARDED ADS
```

### PLAY

기본 보상은 무료.

선택:

```text
광고 시청
→ Bonus Gold / Continue / Special Reward
```

### RESEARCH

```text
주제 검색 = 무료
Basic Guide = 무료
Deep Dive = Rewarded Ad로 해금
```

가능하면:

```text
광고 1회
→ 해당 Deep Dive 영구 해금
```

을 우선 검토한다.

기본적인 수학 학습을 광고로 막지 않는다.

---

## 1.5 보고서

> **학생 보고서는 학생이 직접 작성한다.**

JP Math Lab은 학생 대신 보고서를 완성하지 않는다.

대신 다음을 제공할 수 있다.

- 좋은 질문
- 핵심 수학
- 실험 방법
- 데이터 수집 방법
- 추천 그래프
- 탐구 순서
- 확장 질문
- 흔한 오류
- 관련 게임/Lab

AI는 evidence를 만들어내지 않는다.

> **AI는 evidence를 만들지 않고, evidence를 구조화하고 연결한다.**

---

## 1.6 AI의 위치

범용 AI가 쉽게 하는 것 자체를 JP Math Lab의 핵심 상품으로 삼지 않는다.

AI의 핵심 역할:

> **ROUTER / MATCHER / TRANSFORMER**

예:

```text
학생 관심: 농구
수학 개념: 이차함수
       ↓
AI / Rule Engine
       ↓
농구 슛 궤적
       ↓
Discover
       ↓
Trajectory Lab
       ↓
Angle Game
       ↓
Research Seed
```

AI는 경험을 연결한다.

---

## 1.7 영상

AI 영상은 제품 개발의 필수 선행 단계가 아니다.

```text
GAME / LAB / WEB 개발 ─────→ 계속 진행
             │
             └──── AI VIDEO는 별도 제작 트랙
```

Grok 등 생성형 영상이 느리거나 병목이어도
전체 JP Math Lab 제작이 멈추면 안 된다.

영상은 DISCOVER를 강화하는 자산이다.

---

# 2. 절대 잃어버리면 안 되는 것 — 기존 수학게임

현재 웹앱에 이미 존재하는 연산·개념게임은
새로운 RPG나 Meta Game으로 교체하지 않는다.

```text
Math Game = 본체
Meta Game = 반복 플레이를 돕는 층
```

기존 게임의 수학적 재미를 보존하면서
입구와 출구를 표준화한다.

```text
GAME
 ↓
score
accuracy
combo
playTime
difficulty
 ↓
COMMON RESULT SYSTEM
 ↓
record
EXP
Gold
skill
season
boss
```

---

# 3. SEED ASSET — 씨앗은 JP Math Lab의 핵심 자산이다

## 3.1 씨앗의 정의

씨앗은 완성된 영상 제목이나 완성된 보고서 주제가 아니다.

> **여러 종류의 수학 경험으로 변환될 가능성을 가진,
> 검증되고 태깅된 최소 콘텐츠 단위**

이다.

하나의 좋은 씨앗은 다음으로 자랄 수 있다.

```text
SEED
 ├─ Question
 ├─ Discover
 ├─ Concept
 ├─ Game
 ├─ Lab
 ├─ Boss Rule
 ├─ Research
 ├─ Data Activity
 └─ Teacher Activity
```

따라서 아이디어 뱅크의 수많은 질문·현상·역사·게임 연결은
단순 메모가 아니라 **원천 자산**이다.

---

## 3.2 씨앗이 중요한 이유

범용 AI는 그 순간 주제를 수십 개 생성할 수 있다.

하지만 다음을 축적하기는 어렵다.

- 실제 수학 개념과 정확히 연결됨
- 교과과정 위치가 확인됨
- 학생에게 강한 질문이 됨
- 실제 조작 가능한 Lab으로 변환 가능
- 게임 규칙으로 변환 가능
- 데이터/실험이 가능
- 탐구로 확장 가능
- 이미 제작된 콘텐츠와 연결됨
- 학생 활동 기록과 연결됨
- 역사적 사실 여부가 검증됨

JP Math Lab의 씨앗 DB는 시간이 지날수록
이 연결 정보를 축적한다.

> **씨앗의 개수보다 연결의 밀도와 검증도가 중요하다.**

---

## 3.3 Seed Types

씨앗을 한 종류로 보지 않는다.

### QUESTION_SEED

학생을 멈춰 세우는 질문.

예:

```text
π도 계산기도 없던 시대에
원의 둘레는 어떻게 계산했을까?
```

### PHENOMENON_SEED

현실/자연/기술에서 발견되는 현상.

```text
농구 슛 궤적
위성 접시
복리
GPS 위치
게임 시야각
```

### HISTORY_SEED

수학이 필요해진 역사적 문제.

### PARADOX_SEED

직관과 결과가 충돌하는 문제.

### VISUAL_SEED

보여주는 순간 이해가 발생하는 시각적 장면.

### GAME_SEED

수학 행동 자체를 게임 규칙으로 바꿀 수 있는 씨앗.

### LAB_SEED

학생이 변수나 대상을 직접 조작할 수 있는 씨앗.

### DATA_SEED

측정·수집·통계·그래프 분석이 가능한 씨앗.

### RESEARCH_SEED

학생이 자신의 질문으로 확장할 수 있는 씨앗.

### BOSS_RULE_SEED

수학 개념의 성질을 Boss Skill로 바꿀 수 있는 씨앗.

### CONNECTION_SEED

서로 다른 콘텐츠 사이의 이동 경로.

예:

```text
벡터 내적
→ 게임 시야각
→ 3D Vector Lab
→ AI/게임 개발 탐구
```

---

# 4. Seed Registry — 씨앗을 DB 자산처럼 관리한다

향후 씨앗은 가능한 한 안정적인 ID를 가진다.

예:

```yaml
seed_id: VEC-DOT-FOV-001

status: verified

math:
  course:
    - 기하
  concepts:
    - 벡터의 내적
    - 방향
    - 코사인

question:
  "게임은 적이 내 앞에 있는지 어떻게 계산할까?"

phenomenon:
  "게임 캐릭터의 field of view 판정"

interest_tags:
  - 게임
  - 프로그래밍
  - AI

experience_potential:
  discover: 5
  game: 5
  lab: 5
  research: 5
  boss_rule: 4

assets:
  video: null
  game: "fov-quick-game"
  lab: "vector-dot-lab"
  research: "game-fov-research"

verification:
  math_checked: true
  history_checked: null
  caution: null

connections:
  prerequisites:
    - vector-basic
  next:
    - projection
    - angle-between-vectors
```

완성 콘텐츠는 이 Seed ID를 참조한다.

---

# 5. Seed Lifecycle — 씨앗이 자라는 과정

```text
CAPTURE
 ↓
TAG
 ↓
VERIFY
 ↓
SCORE
 ↓
CONNECT
 ↓
PROTOTYPE
 ↓
PUBLISH
 ↓
MEASURE
 ↓
EXPAND
```

### CAPTURE

좋은 질문/현상을 놓치지 않고 저장.

### TAG

교과, 개념, 흥미, 난이도, 직업, 시각성 태그.

### VERIFY

수학적 정확성, 역사적 사실, 데이터 가능성 확인.

### SCORE

영상성 / 게임성 / Lab성 / 탐구성 / 재사용성 평가.

### CONNECT

기존 Seed 및 Content Family와 연결.

### PROTOTYPE

가장 적합한 경험 한 개로 먼저 제작.

### PUBLISH

학생에게 제공.

### MEASURE

학생이 실제로 클릭하고 플레이하고 저장하는지 기록.

### EXPAND

반응이 좋은 Seed를 다른 경험으로 확장.

---

# 6. Seed는 '주제 수'와 다르다

목표를:

> 탐구주제 100,000개 만들기

로 잡지 않는다.

더 중요한 목표는:

> 강한 Seed 1,000개를
> 서로 수천·수만 개의 경험으로 연결하기

이다.

예:

```text
Seed: 포물선
```

하나에서:

```text
위성 안테나
농구 슛
자동차 헤드라이트
포물선 반사
분수 궤적
투사체 게임
건축 아치 비교
```

가 나올 수 있다.

그리고 각각이:

```text
Video
Game
Lab
Research
Boss Skill
```

로 확장될 수 있다.

이것이 Seed Asset의 복리 효과다.

---

# 7. Seed를 AI에게 함부로 재생성시키지 않는다

AI에게 매번:

> "새로운 수학주제 30개 생성해줘"

라고 해서 DB를 채우는 방식은 피한다.

AI가 만든 후보는 **candidate seed**일 뿐이다.

```text
AI Candidate
 ↓
duplicate check
 ↓
math check
 ↓
visual/game/lab feasibility
 ↓
human review
 ↓
verified seed
```

검증된 Seed는 장기 자산으로 보존한다.

---

# 8. CONTENT FAMILY — 씨앗에서 경험으로

Seed와 완성 콘텐츠를 구분한다.

```text
SEED
 ↓
CONTENT FAMILY
```

예:

```text
SEED
게임은 적이 내 앞에 있는지 어떻게 알까?
       │
       ├─ Discover Short
       ├─ Concept Lite
       ├─ Concept Full
       ├─ FOV Quick Game
       ├─ Vector Dot Lab
       ├─ Boss Skill
       └─ Research Deep Dive
```

Content Family ID 예:

```text
family_id: vector-dot-fov
```

---

# 9. CONNECTED EXPERIENCE

좋은 JP Math Lab 콘텐츠는 하나만 소비되고 끝나지 않는다.

예:

```text
PLAY
벡터 방향 게임
 ↓
RESULT
"각도 판단이 자주 틀려요"
 ↓
CONCEPT LITE
내적과 방향
 ↓
EXPLORE
3D Vector Lab
 ↓
DISCOVER
게임은 적이 앞에 있는지 어떻게 알까?
 ↓
RESEARCH
게임 FOV 탐구
```

반대로:

```text
DISCOVER
 ↓
LAB
 ↓
GAME
 ↓
RESEARCH
```

도 가능하다.

학생마다 다른 입구를 허용한다.

---

# 10. BOSS ENGINE 2.0 — 보스를 진짜 게임 규칙으로 만든다

## 10.1 기존 문제

현재 미적분/기하 보스전은
일부가 다음과 같은 구조다.

```text
3번 연속 공격 성공
→ CLEAR
```

문제:

- 보스 HP의 의미가 약함
- 제한시간 압박이 약함
- 개인 기록 경쟁이 약함
- 보스마다 플레이 경험이 비슷함
- 결국 연속 정답 미션처럼 느껴짐

따라서 보스전 자체를 버리지 않고
정의를 바꾼다.

---

# 11. Boss Battle의 새 정의

> **Boss Battle = 제한시간 안에 자신의 수학 실력을 DAMAGE로 바꾸는 기록 도전**

기본:

```text
TIME LIMIT
+
BOSS HP
+
DAMAGE
+
COMBO
+
BOSS SKILL
+
PHASE
```

예:

```text
60초
 ↓
문제
 ↓
정답
 ↓
Damage
 ↓
Combo
 ↓
Boss HP 감소
 ↓
Boss Skill
 ↓
Phase 2
 ↓
TIME OVER / CLEAR
```

---

# 12. Boss의 정체성

> **Boss = 외형 + 수학 영역 + Boss Skill + Rule Change**

보스 이미지만 바꾸는 것은 의미가 없다.

보스가 달라지면
학생의 플레이 전략도 달라져야 한다.

---

# 13. Boss Skill = Rule Modifier

예:

## 시간의 마녀 — Time Drain

```text
15초마다
TIME -3 sec
```

수학적으로 빠르게 판단하는 능력이 중요.

## 콤보 리퍼 — Combo Break

```text
오답
→ Combo Multiplier Reset
```

정확성이 중요.

## 철벽 골렘 — Iron Guard

```text
Easy 문제 damage 50%
Hard 문제 damage 200%
```

난이도 선택 전략이 중요.

## 카오스 — Chaos Shift

```text
15초마다
문제 유형 변경
```

개념 전환 능력이 중요.

## 미러 팬텀 — Mirror

```text
그래프/도형 조건 변형
```

시각적 판단 능력이 중요.

---

# 14. Boss Skill은 수학 개념과 연결한다

장기적으로 가장 좋은 Boss는
스킬 자체가 그 과목의 성질을 드러낸다.

### 미적분

- 시간 조작
- 변화율 증가
- 구간 축소
- 누적
- 임계점

### 기하

- 회전
- 반사
- 정사영
- 방향 반전
- 차원 전환

### 확률

- 확률 왜곡
- 독립/종속
- 반복 시행
- 분포 변화

### 경제수학

- 이자 누적
- 인플레이션
- 위험/보상
- 시간가치

즉:

> **보스의 스킬을 보면
> 그 보스가 어떤 수학을 지배하는지 느껴져야 한다.**

---

# 15. Boss Telegraph / Counter

보스가 갑자기 시스템을 망가뜨리기만 하면
억울하게 느껴질 수 있다.

따라서 스킬 전에 예고한다.

```text
WARNING

BOSS SKILL
TIME DRAIN

3
2
1
```

일부 스킬은 학생이 막을 수 있다.

예:

```text
Special Question
 ↓
Correct
→ PERFECT GUARD
→ Skill Cancel
→ Counter Damage +500
```

실패:

```text
Skill Activated
→ TIME -5 sec
```

공격과 방어 모두 수학 활동이 된다.

---

# 16. Boss Phase

보스 HP에 따라 규칙이 변한다.

```text
HP 100~50%
→ PHASE 1

HP < 50%
→ PHASE 2
```

예:

```text
PHASE 2
Boss Skill interval
15 sec → 10 sec
```

또는:

```text
Iron Armor
→ Easy Damage 0
→ Hard 3연속 성공 시 Break
→ 8초 동안 Damage ×2
```

이렇게 하면
보스가 살아 있는 느낌이 생긴다.

---

# 17. 두 종류의 Boss Battle

## DAMAGE ATTACK

보스를 꼭 죽이지 않아도 된다.

```text
60초 동안
TOTAL DAMAGE 최고 기록
```

결과:

```text
TOTAL DAMAGE 12,840
Correct 17
Max Combo 9
Average 2.4 sec
Personal Best
Weekly Percentile
```

재도전 목적:

> 기록 갱신

## CLEAR CHALLENGE

특별 보스.

```text
HP 30,000
TIME 90 sec
```

HP를 0으로 만들면 Clear.

실패 시:

```text
BOSS HP 840
남음

97% 도달
```

다시 도전하게 만든다.

---

# 18. 공통 Boss Engine으로 만든다

미적분과 기하의 보스전을
각각 다시 만드는 방식은 피한다.

```text
                  BOSS ENGINE
                       │
       ┌───────────────┼───────────────┐
       │               │               │
     TIMER            HP             COMBO
       │               │               │
    SKILLS          DAMAGE           PHASE
       │               │               │
       └───────────────┼───────────────┘
                       │
                  GAME ADAPTER
                 ↙            ↘
              미적분           기하
```

게임이 Boss Engine에 전달하는 최소 정보:

```text
answerCorrect
answerWrong
answerTime
difficulty
score
```

Boss Engine이 처리:

```text
damage
combo
bossHP
skills
phase
timer
result
```

---

# 19. Boss는 가능한 한 DATA로 만든다

예:

```yaml
boss_id: calculus-time-witch

name: 시간의 마녀

battle:
  type: damage_attack
  hp: 30000
  time_limit: 60

damage:
  base: 300
  speed_bonus: true
  combo_multiplier: true

phase:
  threshold: 0.5

skills:
  - id: time-drain
    interval: 15
    effect:
      time: -3

phase2:
  skill_interval_multiplier: 0.7
```

새 보스를 만들 때
엔진을 복사하지 않는다.

```text
Engine 1개
+
Boss Config N개
```

를 목표로 한다.

---

# 20. 기존 미적분/기하 Boss의 이전 전략

전부 한 번에 고치지 않는다.

### STEP 1

현재 보스전은 그대로 둔다.

### STEP 2

미적분 또는 기하에서
한 보스를 Boss Engine 2.0 테스트베드로 선택.

### STEP 3

최소 기능만 구현.

```text
HP
60초
Damage
Combo
Skill 1개
Phase 2
```

### STEP 4

직접 플레이 / 학생 테스트.

기존 3연속 성공 방식보다
명확하게 재미있을 때만 확장.

### STEP 5

기하 보스를 같은 Engine에 연결.

### STEP 6

새 과목은 처음부터 공통 Engine 사용.

즉:

> **전면 재개발이 아니라 점진적 migration**

이다.

---

# 21. 첫 Boss Engine 2.0의 성공 기준

다음 반응을 만드는가?

```text
"한 번만 더 하면 기록 깰 것 같은데."
```

또는:

```text
"보스 스킬 때문에 이번에는 다르게 해야겠다."
```

단순 Clear 여부보다
재도전 의지가 더 중요하다.

---

# 22. Ranking Fairness

카드/아이템 효과가 수학 실력보다 강해지면 안 된다.

따라서 공식 경쟁 모드는:

```text
STANDARD RULE
```

로 통일할 수 있다.

예:

- 카드 비활성
- 동일 시간
- 동일 난이도
- 동일 Boss Config

Casual Mode에서는
카드와 특수 효과를 허용할 수 있다.

---

# 23. Meta Game의 현재 위치

Meta Game은 유지한다.

하지만 중심은:

```text
PLAY
→ RECORD
→ GROWTH
→ COLLECTION
→ CHALLENGE
→ REPLAY
```

이다.

보스는 중요한 Challenge 중 하나지
앱 전체 목적은 아니다.

---

# 24. FIRST PROTOTYPE — 현재 가장 먼저 만들 것

전체 생태계를 설계했지만
첫 구현은 작게 한다.

## 최소 제품 루프

```text
LOGIN
 ↓
HOME
 ↓
PLAY
 ↓
기존 게임 1개
 ↓
RESULT
 ↓
EXP / GOLD
 ↓
PERSONAL BEST
 ↓
RETRY
```

Boss Engine은
기본 게임 루프가 안정된 후
같은 프로토타입 가지에서 추가한다.

```text
PLAY
 ↓
BOSS CHALLENGE
 ↓
60초 Damage Attack
 ↓
Skill 1개
 ↓
Phase 2
 ↓
Record
 ↓
Retry
```

---

# 25. 지금 만들지 않아도 되는 것

- 모든 보스 교체
- 모든 게임 모바일화
- 대규모 영상 제작
- 수만 개 AI Deep Dive 실시간 생성
- 학생 유료 결제
- 복잡한 가챠
- Teacher Studio 완성
- 글로벌 랭킹
- 모든 과목 완성

먼저 작은 재미를 검증한다.

---

# 26. 개발 우선순위

```text
1. 기존 게임 하나의 재미 확인
2. 모바일 HOME / PLAY 흐름
3. 로그인 / 기록
4. Result / EXP / Gold / Personal Best
5. Retry Loop
6. Boss Engine 2.0 한 보스
7. 두 번째 게임 연결
8. 두 번째 보스 연결
9. Content Family 연결
10. Discover / Explore / Research 확장
```

---

# 27. 다른 AI에게 절대 오해시키면 안 되는 결정

## 폐기됨

```text
학생용 유료 Deep Dive
학생용 Credit Pack
AI가 학생 보고서를 완성
RPG가 기존 수학게임을 대체
영상이 완성되어야 앱 개발 가능
과목마다 별도 Boss Engine
3연속 공격 성공이 보스전의 장기 기본 규칙
```

## 현재 유지

```text
기존 수학게임 보존
APP + WEB 분리
공통 로그인
공통 Content DB
씨앗 DB
PLAY 중심 retention
Rewarded Ad
학생 직접 보고서
AI Router
Connected Experience
공통 Boss Engine
점진적 migration
```

---

# 28. Claude / 다른 AI 작업 규칙

이 문서를 읽고 후속 작업을 할 AI는 다음 원칙을 따른다.

1. 기존 게임을 임의로 버리거나 전면 재작성하지 않는다.
2. 최신 결정과 충돌하는 옛 버전의 아이디어는 역사적 기록으로 취급한다.
3. Seed를 단순 텍스트 주제 목록으로 축소하지 않는다.
4. 새 콘텐츠를 만들 때 어떤 Seed/Content Family와 연결되는지 먼저 찾는다.
5. AI 생성 텍스트보다 실제 Game/Lab/Interaction을 우선한다.
6. 영상 생성이 막혀도 제품 개발을 멈추지 않는다.
7. 새 보스는 가능하면 공통 Boss Engine의 config로 설계한다.
8. 학생이 직접 해야 하는 탐구/보고서 활동을 AI가 대신했다고 가정하지 않는다.
9. 앱과 웹은 같은 서비스의 서로 다른 깊이로 설계한다.
10. 새 기능 제안 전 반드시 "재방문 또는 연결 경험을 강화하는가?"를 묻는다.

---

# 29. 현재 JP Math Lab의 가장 중요한 자산 순서

현재 기준으로 장기 가치가 큰 자산은:

```text
1. SEED DB
2. 실제 Math Games
3. Interactive Labs
4. Content Family 연결망
5. Student Activity History
6. 검증된 Concept Content
7. Boss / Challenge Rule Library
8. Discover Video Library
9. Research Deep Dive Library
10. AI Prompt / Routing Logic
```

AI 모델 자체는 자산이 아니다.

모델은 바뀔 수 있다.

> **씨앗과 경험과 연결 기록이 자산이다.**

---

# 30. v12 핵심 선언

> **JP Math Lab은 AI가 콘텐츠를 무한 생성하는 서비스가 아니다.**

좋은 씨앗을 발견하고,
검증하고,
여러 수학 경험으로 변환하고,
학생이 그 경험 사이를 자연스럽게 이동하도록 만드는 시스템이다.

```text
SEED
 ↓
EXPERIENCE
 ↓
ACTIVITY
 ↓
HISTORY
 ↓
RECOMMENDATION
 ↓
NEXT EXPERIENCE
```

이 순환이 쌓일수록
JP Math Lab의 가치도 쌓인다.

그리고 PLAY에서는:

```text
MATH GAME
 ↓
RECORD
 ↓
CHALLENGE
 ↓
BOSS SKILL
 ↓
RETRY
```

가 반복된다.

최종적으로:

> **좋은 씨앗은 한 번 쓰고 사라지는 아이디어가 아니라
> 영상·게임·Lab·탐구·보스·수업으로 계속 증식하는 원천 자산이다.**

---

# 31. VERSION MAP — 사고의 변화 기록

## v1
과목별 콘텐츠 아이디어 대량 수집.

## v2
교과 × 역사/과학/게임/경제/AI 등 수평 렌즈 확장.

## v3
Discovery Loop 및 재사용 가능한 Lab Engine 개념.

## v4
Hero Shot / 생성형 영상 활용 전략.

## v5
감정 곡선과 Prediction Gap.

## v6
1분 영상 자체 완결 원칙.

## v7
영상 제작 시스템과 자동화 구조.

## v8
PLAY / DISCOVER / EXPLORE / RESEARCH 앱 생태계.

## v9
기존 수학게임 보존 + Meta Game + 대규모 Seed 조합 구조.

## v10
학생/교사 분리 및 초기 수익모델 검토.

## v11
학생 결제 폐기, Rewarded Ad 중심, APP/WEB 역할 분리,
공통 계정과 Connected Experience 확립.

## v12
Seed를 최상위 핵심 자산으로 명시.
CURRENT CANON을 문서 최상단에 고정.
기존 미적분/기하 보스를 공통 Boss Engine 2.0으로 점진 이전.
Boss Skill을 수학적 Rule Modifier로 재정의.
Claude/다른 AI가 옛 결정을 현재안으로 오해하지 않도록 인수인계 구조 강화.

---

# 32. LEGACY ARCHIVE 안내

아래 내용은 v1~v11까지의 아이디어와 사고 과정을 보존하기 위한 누적 아카이브다.

중요:

> **아래의 오래된 결정이 이 v12 CURRENT CANON과 충돌하면
> v12가 우선한다.**

좋은 아이디어/씨앗은 옛 섹션에서도 계속 발굴한다.

오래된 전략은 폐기할 수 있지만,
좋은 Seed는 폐기하지 않는다.

---

# JP Math Lab × 2022 개정 교육과정 콘텐츠 아이디어 뱅크

> 목적: **흥미 → 질문 → 조작 → 개념 → 문제 해결**로 이어지는 수학
> 콘텐츠의 원천 데이터베이스\
> 버전: v1.0 / 2026-08-29\
> 원칙: 공식부터 설명하지 않는다. 먼저 "왜?", "어떻게?", "정말?"을
> 만든다.

## 사용법

-   **🔥 S**: 영상성이 강하고, 30\~60초 훅과 인터랙티브 활동을 모두
    만들기 좋은 최우선 후보
-   **⭐ A**: 좋은 소재. 연출이나 맥락을 조금 더 다듬으면 강해지는 후보
-   영상은 완결형으로 만들되, JP Math Lab에서는 같은 소재를 **직접
    조작하는 학습 장면**으로 이어간다.
-   역사적 일화는 제작 전 사료 검증을 거친다. 특히 유명한 일화 중에는
    후대에 과장된 이야기가 있으므로 "재미있는 이야기"와 "확인된 역사"를
    구분한다.

## 공통 영상 문법

1.  **0\~5초 --- 이상한 질문**: 상식과 충돌하는 장면을 먼저 보여준다.
2.  **5\~15초 --- 문제의 탄생**: 인간이 왜 이 문제를 풀어야 했는지
    보여준다.
3.  **15\~40초 --- 수학적 발견**: 도형·숫자·그래프가 움직이며 원리가
    드러난다.
4.  **40\~55초 --- 현대 연결**: 오늘날 기술·과학·경제·생활과 연결한다.
5.  **55\~60초 --- 조작으로 넘기기**: "이번엔 직접 움직여 보자."

## 제작 파이프라인

-   영화적 세계/분위기 컷: 생성형 영상
-   정확한 수학: HTML/SVG/Canvas/Three.js
-   실제 역사: 검증된 사료·퍼블릭도메인 자료
-   편집·합성: FFmpeg
-   최종 학습: JP Math Lab 인터랙션

------------------------------------------------------------------------

# 공통수학1

  ------------------------------------------------------------------------------------------
  우선   핵심 수학    영상 첫 질문 /  이야기 방향            핵심 장면     JP Math Lab 연결
                      훅                                                   
  ------ ------------ --------------- ---------------------- ------------- -----------------
  ⭐ A   다항식       **왜 복잡한     고대 계산에서 현대     식의 항을     식 블록
                      식을 굳이 한    컴퓨터 대수까지,       블록처럼      드래그·인수분해
                      덩어리로        반복되는 계산을 구조로 합치고 분해   퍼즐
                      묶을까?**       압축하는 이야기                      

  🔥 S   인수분해     **큰 수를       곱셈을 거꾸로 읽어     벽돌 구조가   식 타일 조립·분해
                      곱하지 않고도   숨은 구조를 찾는 수학  분해되며 공통 
                      구조를 보면                            구조 노출     
                      답이                                                 
                      보인다고?**                                          

  ⭐ A   나머지정리   **엄청 긴       전체 계산 대신 특정 값 거대한        나머지 예측 게임
                      계산을 하지     하나로 나머지를 읽는   다항식이 한   
                      않고 나머지를   아이디어               점으로 압축   
                      알아낼 수                                            
                      있을까?**                                            

  🔥 S   복소수       **제곱해서 -1이 방정식을 풀기 위해     실수축이      복소평면 회전
                      되는 수를 왜    '없는 수'를 받아들인   평면으로      인터랙션
                      만들었을까?**   역사                   펼쳐짐        

  🔥 S   이차방정식   **포물선과      대수의 해와 그래프의   식이          근·교점 동시 조작
                      방정식의 근은   교점이 만나는 순간     포물선으로    
                      왜 같은                                변환          
                      이야기를                                             
                      할까?**                                              

  🔥 S   이차함수와   **대포를 쏘면   운동의 궤적과 이차식의 포물선 궤적과 발사각·계수 조절
         방정식       왜 포물선이     연결                   좌표 오버레이 
                      나타날까?**                                          

  ⭐ A   부등식       **정답이 하나가 조건을 만족하는 세계   허용/금지     부등식 영역
                      아니라 '구간'일 전체를 표현하는 언어   영역이 빛으로 페인팅
                      수 있다고?**                           분리          

  🔥 S   경우의 수    **비밀번호      선택이 겹칠 때 생기는  선택 트리가   경우의 수 트리
                      4자리만 늘어도  조합 폭발              급격히 확장   탐험
                      경우가 왜                                            
                      폭발할까?**                                          

  ⭐ A   순열과 조합  **자리만 바꾸는 순서가 정보를 만드는   좌석·카드가   순열/조합 판별
                      것과 뽑기만     순간                   재배열        게임
                      하는 것은 왜                                         
                      다를까?**                                            

  🔥 S   행렬         **AI는 사진을   이미지·변환·데이터를   사진이 픽셀   행렬 변환으로
                      어떻게 숫자     행렬로 표현하는 현대   행렬로 분해   이미지 조작
                      표로 볼까?**    수학                                 
  ------------------------------------------------------------------------------------------

# 공통수학2

  ---------------------------------------------------------------------------------------------------
  우선   핵심 수학       영상 첫 질문 / 훅      이야기 방향           핵심 장면          JP Math Lab
                                                                                         연결
  ------ --------------- ---------------------- --------------------- ------------------ ------------
  ⭐ A   내분            **지도 위 두 도시 사이 비율이 위치를         지도 선분 위 점    비율
                         '정확히 3:2 지점'은    결정하는 좌표의 원리  이동               슬라이더로
                         어디일까?**                                                     내분점 이동

  ⭐ A   직선의          **도로와 건물은 어떻게 기울기라는 숫자로     도시 평면 위 도로  기울기 조절
         평행·수직       정확히 평행하고 직각을 방향을 통제           생성               건축 게임
                         유지할까?**                                                     

  🔥 S   점과 직선 사이  **비행기는 위험구역    가장 짧은 거리는 왜   레이더와 비행경로  최단거리
         거리            경계에서 얼마나 떨어져 수선인가                                 드래그
                         있어야 할까?**                                                  

  🔥 S   원의 방정식     **GPS는 왜 원을 여러   거리 조건이 원이 되고 지도 위 원 3개가   기지국 위치
                         개 그려 내 위치를      교점이 위치가 되는    겹침               조절 GPS
                         찾을까?**              원리                                     게임

  ⭐ A   도형의 이동     **게임 캐릭터를        평행이동·대칭이동을   캐릭터/도형이      변환 명령
                         움직였는데 모양이 안   좌표로 표현           좌표공간 이동      게임
                         변하는 이유는?**                                                

  🔥 S   집합            **검색엔진은           집합과 논리로 검색    검색 결과가        조건 필터
                         '그리고/또는/아닌'을   조건을 만드는 이야기  벤다이어그램으로   실험
                         어떻게 이해할까?**                           분류               

  🔥 S   명제            **한 번의 반례가 왜    참을 증명하는 것과    검은 백조 한 마리  반례 사냥
                         수천 번의 성공을       거짓을 깨는 것의      등장               게임
                         무너뜨릴까?**          비대칭                                   

  ⭐ A   필요·충분조건   **우산을 썼다고 비가   원인처럼 보이는       조건 화살표가      필요/충분
                         온다고 말할 수         조건을 논리적으로     뒤집히며 오류 발생 판별
                         있을까?**              분리                                     

  ⭐ A   함수            **자판기에 돈을 넣으면 입력과 출력의         입력→기계→출력     함수 머신
                         왜 '함수'라고 볼 수    규칙으로 세상을                          만들기
                         있을까?**              모델링                                   

  🔥 S   유리·무리함수   **가까이 갈수록 영원히 점근선과 제한된       카메라가           그래프 추적
                         닿지 않는 선이 있다?** 세계를 시각화         점근선으로 끝없이  레이스
                                                                      접근               
  ---------------------------------------------------------------------------------------------------

# 대수

  --------------------------------------------------------------------------------------------
  우선   핵심 수학  영상 첫 질문 / 훅          이야기 방향       핵심 장면    JP Math Lab 연결
  ------ ---------- -------------------------- ----------------- ------------ ----------------
  🔥 S   지수       **종이를 42번 접으면 정말  선형 직관을       종이 두께가  배가 성장
                    달에 닿을까?**             무너뜨리는        도시·우주    시뮬레이터
                                               지수성장          규모로 폭증  

  🔥 S   복리       **돈은 왜 시간이 지나면    복리와 지수적     동전 더미가  금리·기간 조절
                    '속도까지' 빨라질까?**     성장              가속 성장    

  🔥 S   로그       **계산기 없던 천문학자는   로그가 곱셈을     천문표와     로그 계산기 체험
                    거대한 곱셈을 어떻게       덧셈으로 바꾼     로그표       
                    했을까?**                  계산 혁명                      

  🔥 S   로그척도   **지진 규모 1 차이는 정말  큰 범위를         진폭이       선형/로그 축
                    1만큼의 차이일까?**        압축하는 로그     폭발적으로   전환
                                               스케일            확대         

  🔥 S   삼각함수   **갈 수 없는 별까지의      각도와 길이로     관측소 두    기선·각도 조절
                    거리를 어떻게 쟀을까?**    접근 불가능한     곳과 별      측량
                                               거리를 측정                    

  🔥 S   주기성     **소리·파도·심장박동은 왜  반복 현상을       파동들이     주기·진폭·위상
                    같은 곡선으로 그려질까?**  사인·코사인으로   하나의       믹서
                                               표현              그래프로     
                                                                 겹침         

  🔥 S   삼각함수   **관람차 좌석의 높이는     원운동을 펼치면   회전 원이    관람차-그래프
         그래프     시간에 따라 어떻게         사인곡선이 되는   그래프로     동기화
                    변할까?**                  장면              흔적 남김    

  ⭐ A   등차수열   **계단을 한 칸씩 늘리면    일정한 차이가     계단형 블록  수열 생성기
                    전체 블록 수는 어떻게      만드는 규칙       성장         
                    변할까?**                                                 

  🔥 S   등비수열   **감염·조회수·세포분열은   일정한 비율의     점들이       공비 조절
                    왜 초반엔 조용하다가       반복              분열하며     시뮬레이터
                    폭발할까?**                                  화면을 채움  

  🔥 S   수학적     **도미노 첫 장과 규칙만    무한히 많은       끝없는       귀납 증명 퍼즐
         귀납법     확인하면 끝까지 믿어도     명제를 유한한     도미노       
                    될까?**                    논리로 묶는 방법               
  --------------------------------------------------------------------------------------------

# 미적분Ⅰ

  ------------------------------------------------------------------------------------------
  우선   핵심 수학       영상 첫 질문 /   이야기 방향          핵심 장면       JP Math Lab
                         훅                                                    연결
  ------ --------------- ---------------- -------------------- --------------- -------------
  🔥 S   함수의 극한     **아킬레우스는   제논의 역설에서      거리 구간이     극한 레이스
                         정말 거북이를    극한으로             끝없이 분할     
                         영원히 못                                             
                         따라잡을까?**                                         

  🔥 S   좌극한·우극한   **한 지점에      두 방향의 접근이     두 카메라가 한  좌우 접근
                         왼쪽과 오른쪽의  일치해야 하는 이유   점으로 접근     조작
                         미래가 다르면                                         
                         값은 존재할까?**                                      

  ⭐ A   연속            **엘리베이터가   끊김 없는 변화의     움직임이        그래프 끊김
                         순간이동하지     수학적 표현          점프/연속 비교  복원
                         않는다는 걸                                           
                         수학은 어떻게                                         
                         말할까?**                                             

  🔥 S   미분계수        **자동차의 '바로 평균속도의 시간      할선이 접선으로 두 점 드래그
                         지금 속도'를     간격을 0에 가깝게    변함            미분
                         어떻게                                                
                         측정할까?**                                           

  🔥 S   접선            **곡선을 100만   국소 선형성의 직관   곡선에 끝없이   확대율
                         배 확대하면 정말                      줌인            슬라이더
                         직선처럼                                              
                         보일까?**                                             

  ⭐ A   도함수          **왜 다항함수를  변화율이 원래 함수의 넓이/기울기     함수-도함수
                         미분하면 차수가  구조를 한 단계       패턴 비교       페어링
                         하나 내려갈까?** 낮추는 이유                          

  🔥 S   증가·감소       **올라가고       값의 변화와 변화율의 충전량과        두 그래프
                         있지만 점점      차이                 충전속도 동시   동기화
                         느려지는 것도                         그래프          
                         '증가'일까?**                                         

  🔥 S   극대·극소       **롤러코스터의   방향이 바뀌는 순간의 코스터 카메라와 트랙 최적점
                         꼭대기는 왜      기울기               접선            찾기
                         미분값 0과                                            
                         연결될까?**                                           

  🔥 S   정적분          **적분이 없던    소진법·분할·넓이의   다각형/조각이   분할 수 조절
                         시대,            누적                 점점 촘촘       적분
                         아르키메데스는                                        
                         넓이를 어떻게                                         
                         구했을까?**                                           

  🔥 S   미적분의        **넓이를 재는    두 전혀 다른 문제가  누적 넓이가     누적함수
         기본정리        적분과 기울기를  하나의 정리로 만나는 함수로 솟고     인터랙션
                         재는 미분은 왜   순간                 다시 미분       
                         서로 반대일까?**                                      
  ------------------------------------------------------------------------------------------

# 확률과 통계

  --------------------------------------------------------------------------------------------
  우선   핵심 수학    영상 첫 질문 / 훅    이야기 방향          핵심 장면        JP Math Lab
                                                                                 연결
  ------ ------------ -------------------- -------------------- ---------------- -------------
  🔥 S   경우의 수    **생일이 같은 사람이 생일 문제와 인간의   학생 아이콘이    학급 인원
                      교실에 있을 확률은   확률 직관            늘며 충돌 발생   슬라이더
                      왜 생각보다                                                
                      높을까?**                                                  

  🔥 S   조건부확률   **검사 결과가        기저율과             1000명 점 배열   베이즈 직관
                      양성이면 정말 병일   조건부확률의 함정    분류             시뮬레이션
                      확률이 99%일까?**                                          

  🔥 S   독립사건     **동전을 다섯 번     도박사의 오류        동전 기록과 다음 연속 시행
                      앞면으로 던졌다면                         시행             실험
                      다음은 뒷면일까?**                                         

  ⭐ A   확률변수     **불확실한 미래를    결과와 확률을 하나의 가능한 미래들이  확률질량 조절
                      어떻게 숫자 하나가   변수로 표현          갈라짐           
                      아니라 '분포'로                                            
                      말할까?**                                                  

  🔥 S   이항분포     **100번 던진 동전은  반복 시행이 만드는   동전 결과가      시행 횟수
                      왜 대체로 가운데     분포                 히스토그램으로   조절
                      몰릴까?**                                 쌓임             

  🔥 S   정규분포     **키·오차·측정값은   많은 작은 요인의     다양한 작은      분포 생성
                      왜 자꾸 종 모양을    합과 종 모양         요인이 합쳐짐    실험
                      만들까?**                                                  

  🔥 S   표본         **전 국민에게 묻지   표본으로 모집단을    거대한 군중에서  표본 추출
                      않고 선거 결과를     추론                 일부 추출        게임
                      어떻게 예측할까?**                                         

  ⭐ A   표본평균     **표본을 계속 뽑으면 표집분포의 직관      표본평균 점들이  표본크기 조절
                      평균들은 왜 더                            모임             
                      얌전해질까?**                                              

  🔥 S   신뢰구간     **여론조사 ±3%p는    추정의 불확실성을    여러 구간이      신뢰구간
                      정확히 무슨          구간으로 표현        참값을 포획      시뮬레이션
                      뜻일까?**                                                  

  🔥 S   통계적 오해  **평균 연봉이        평균·분포·이상치의   한 초고소득자가  평균/중앙값
                      올랐는데 대부분      함정                 평균을 끌어올림  비교
                      사람의 월급은                                              
                      그대로일 수                                                
                      있을까?**                                                  
  --------------------------------------------------------------------------------------------

# 기하

  --------------------------------------------------------------------------------
  우선   핵심 수학  영상 첫 질문 / 훅         이야기     핵심 장면        JP Math
                                              방향                        Lab 연결
  ------ ---------- ------------------------- ---------- ---------------- --------
  🔥 S   포물선     **위성 안테나는 왜 접시   포물선의   평행 광선이      초점
                    모양일까?**               반사 성질  초점으로 모임    드래그
                                                                          반사
                                                                          실험

  🔥 S   타원       **속삭임이 멀리 있는      타원의 두  속삭임 파동이 두 타원
                    사람에게 전달되는 방이    초점과     초점 연결        갤러리
                    있다고?**                 반사 성질                   실험

  🔥 S   쌍곡선     **두 기지국의 신호        거리 차가  신호 파동과 위치 기지국
                    도착시간 차이만으로       일정한     곡선             추적
                    위치를 찾을 수 있을까?**  점의 자취                   게임

  🔥 S   이차곡선   **원뿔을 자르는 각도만    하나의     빛나는 평면이    절단면
                    바꿨는데                  입체에서   원뿔 절단        3D 조작
                    원·타원·포물선·쌍곡선이   태어나는                    
                    모두 나온다?**            네 곡선                     

  🔥 S   벡터       **왜 힘과 속도는 숫자     크기와     바람 속 드론     벡터
                    하나로 말할 수 없을까?**  방향을                      직접
                                              동시에                      잡아
                                              가진 양                     늘리기

  🔥 S   벡터 합    **강을 건너는 배는 왜     속도 벡터  강물과 배의 벡터 강
                    목표 방향으로 똑바로 가면 합성                        건너기
                    안 될까?**                                            게임

  🔥 S   내적       **게임 캐릭터는 적이      두 방향의  시야 콘과 적     내적
                    '앞에 있는지' 어떻게      유사도를   위치             기반
                    판단할까?**               숫자로                      시야
                                              바꾸는                      게임
                                              내적                        

  ⭐ A   공간좌표   **GPS는 지구 위의 한 점을 3차원      공간 격자와 위성 3D 좌표
                    어떻게 세 숫자로          위치의                      탐색
                    표현할까?**               좌표화                      

  🔥 S   평면·구    **3D 게임에서 총알이      공간의     레이와 평면/구   충돌
                    벽이나 구체에 맞았는지    방정식과   충돌             판정
                    어떻게 알까?**            충돌                        실험

  🔥 S   정사영     **그림자만으로 지붕의     3차원을    빛·지붕·그림자   지붕
                    실제 구조를 이해할 수     평면으로                    정사영
                    있을까?**                 투영하는                    3D 조작
                                              원리                        
  --------------------------------------------------------------------------------

# 미적분Ⅱ

  -------------------------------------------------------------------------------
  우선   핵심 수학    영상 첫 질문 / 이야기 방향       핵심 장면       JP Math
                      훅                                               Lab 연결
  ------ ------------ -------------- ----------------- --------------- ----------
  🔥 S   수열의 극한  **0.999...는   끝없이 가까워지는 9가 무한히      수열 줌인
                      정말 1일까?**  수열과 극한       붙으며 간격     
                                                       소멸            

  🔥 S   무한급수     **무한히 많은  무한합의 역설적   조각들이 한     급수 블록
                      것을 더했는데  직관              공간을 채움     쌓기
                      왜 유한한 값이                                   
                      될까?**                                          

  🔥 S   지수·로그    **세균이       자기 자신이       세포 분열과     성장률
         미분         늘어나는       변화율이 되는     그래프          조절
                      속도는 왜 세균 지수함수                          
                      수 자체에                                        
                      비례할까?**                                      

  🔥 S   삼각함수     **원운동의     회전과 변화율의   회전점과        원운동
         미분         그림자를       기하적 연결       그림자·그래프   미분
                      따라가면 왜                                      시각화
                      사인의 미분이                                    
                      코사인이                                         
                      될까?**                                          

  ⭐ A   합성함수     **변화가 변화  연쇄법칙을 기계의 기어/함수 머신  함수 체인
         미분         속에 들어가면  연속 연결로 이해  연쇄            조작
                      속도는 어떻게                                    
                      계산할까?**                                      

  🔥 S   매개변수     **곡선을 x와   시간을 매개로 한  점이 궤적을     매개변수
         미분         y가 아니라     운동과 곡선       그림            경로 편집
                      '시간'으로                                       
                      그릴 수                                          
                      있을까?**                                        

  ⭐ A   음함수 미분  **원을         관계 자체를       원이 식으로     원 위 점
                      y=f(x)로       미분하는 아이디어 변하고 접선     이동 접선
                      깔끔하게 못                      등장            
                      써도 접선을                                      
                      구할 수                                          
                      있을까?**                                        

  ⭐ A   여러 적분법  **왜 어떤      치환·부분적분을   복잡한 영역이   적분 전략
                      넓이는 한 번에 관점 전환으로     변형            퍼즐
                      못 구하고                                        
                      쪼개거나                                         
                      바꿔야 할까?**                                   

  🔥 S   속도와 거리  **속도계       변화율을 누적해   속도 그래프가   주행 기록
                      기록만 있으면  원래 양 복원      거리로 채워짐   적분
                      지나온 거리를                                    
                      복원할 수                                        
                      있을까?**                                        

  🔥 S   미분방정식   **미래의 값을  변화율 규칙에서   방향장 위 궤적  간단한
         맛보기       몰라도 '변하는 현상을 복원                       성장 모델
                      법칙'만 알면                                     
                      미래를 그릴 수                                   
                      있을까?**                                        
  -------------------------------------------------------------------------------

# 경제 수학

  -------------------------------------------------------------------------------------------
  우선   핵심 수학        영상 첫 질문  이야기 방향              핵심 장면    JP Math Lab
                          / 훅                                                연결
  ------ ---------------- ------------- ------------------------ ------------ ---------------
  🔥 S   화폐의 시간가치  **오늘의      이자·현재가치·미래가치   지폐가       현재/미래가치
                          100만원과                              시간축을     계산기
                          10년 뒤                                이동하며     
                          100만원은 왜                           가치 변화    
                          같은 돈이                                           
                          아닐까?**                                           

  🔥 S   단리·복리        **은행은 왜   시간에 따른 금융 성장의  두 자산      금리 비교 게임
                          '복리'라는    차이                     그래프가     
                          말을                                   벌어짐       
                          강조할까?**                                         

  🔥 S   할인             **50% 할인 후 퍼센트 변화의 비대칭     가격표가     할인·인상 실험
                          50% 인상하면                           내려갔다     
                          원래                                   올라감       
                          가격일까?**                                         

  ⭐ A   환율             **환율이 5%   비율·환전·수수료         공항 환전판  환율 시뮬레이터
                          움직였는데                                          
                          해외여행                                            
                          비용은 얼마나                                       
                          달라질까?**                                         

  🔥 S   수요와 공급      **가격이      함수와 균형가격          시장 두      수요·공급 충격
                          오르면 왜                              곡선이 교차  게임
                          사고 싶은                                           
                          사람과 팔고                                         
                          싶은 사람이                                         
                          반대로                                              
                          움직일까?**                                         

  🔥 S   탄력성           **가격을 1%   변화율과 탄력성          가격         탄력성 실험
                          올렸는데                               슬라이더와   
                          매출이 늘                              매출 반응    
                          수도 줄 수도                                        
                          있는                                                
                          이유는?**                                           

  🔥 S   비용·수익·이익   **많이 팔수록 함수의 교점과 최적화     공장         손익분기점 게임
                          무조건 이익이                          생산량과     
                          커질까?**                              비용/수익    

  ⭐ A   세금             **세율을      함수 모델과 가정의       세율         모델 비교
                          올리면 세금은 중요성                   다이얼과     
                          항상 더 많이                           세수 변화    
                          걷힐까?**                                           

  🔥 S   대출             **같은 3억원  등비적 구조와 현금흐름   상환표가     대출 상환
                          대출인데 상환                          시간축에     시뮬레이터
                          방식에 따라                            펼쳐짐       
                          왜 총이자가                                         
                          달라질까?**                                         

  🔥 S   투자 위험        **평균        기댓값·분산과 의사결정   두 자산의    포트폴리오 실험
                          수익률이 같은                          서로 다른    
                          두 투자 중                             흔들림       
                          하나가 더                                           
                          위험한                                              
                          이유는?**                                           
  -------------------------------------------------------------------------------------------

# 인공지능 수학

  --------------------------------------------------------------------------
  우선     핵심 수학  영상 첫 질문 /  이야기 방향   핵심 장면    JP Math Lab
                      훅                                         연결
  -------- ---------- --------------- ------------- ------------ -----------
  🔥 S     데이터     **AI에게 사진은 벡터·행렬로   얼굴이 픽셀  픽셀/벡터
           표현       사진이 아니라   데이터를 표현 숫자로 분해  탐색
                      숫자                                       
                      덩어리라고?**                              

  🔥 S     거리와     **AI는 '비슷한  벡터 사이     노래들이     추천 공간
           유사도     노래'를 어떻게  거리와 유사도 공간에       탐색
                      찾을까?**                     점으로 배치  

  🔥 S     분류       **스팸메일과    데이터 공간의 점 구름 사이 분류선 직접
                      정상메일 사이에 경계          경계선       그리기
                      선 하나를 그을                             
                      수 있을까?**                               

  🔥 S     회귀       **점들이        오차와 최적   점들과       최소오차 선
                      제멋대로        적합          움직이는     맞추기
                      흩어졌는데                    직선         
                      '가장 그럴듯한                             
                      선'은                                      
                      무엇일까?**                                

  🔥 S     손실함수   **AI는 자신이   오차를 하나의 예측-정답    손실 지형
                      얼마나 틀렸는지 함수로 만드는 간격이       탐색
                      어떻게 숫자로   방법          손실로 누적  
                      알까?**                                    

  🔥 S     경사하강   **AI는 정답을   기울기를 따라 산악         학습률 게임
                      모르면서 어떻게 손실을 줄이는 지형에서     
                      더 나은 답을    최적화        공이 하강    
                      찾아갈까?**                                

  🔥 S     과적합     **시험문제를    훈련 데이터   구불구불한   복잡도
                      통째로 외운     암기와 일반화 경계가 모든  슬라이더
                      학생은 정말                   점을 암기    
                      공부를 잘한                                
                      걸까?**                                    

  ⭐ A     확률적     **AI가 '고양이  확률과 분류의 확률         임계값 조절
           예측       87%'라고 말할   불확실성      게이지와     
                      때 87%는                      이미지       
                      무엇일까?**                                

  🔥 S     편향       **데이터가      표본·데이터   한쪽         데이터 균형
                      편향되면        편향          데이터만     실험
                      수학적으로                    많은         
                      정확한 AI도                   학습장면     
                      불공정할 수                                
                      있을까?**                                  

  🔥 S     신경망     **수많은 단순   선형결합과    노드 층을    미니 신경망
           직관       계산을 겹치면   비선형 변환의 통과하며     조작
                      어떻게 얼굴을   층            특징 변화    
                      알아볼까?**                                
  --------------------------------------------------------------------------

# 이산수학

  ---------------------------------------------------------------------------------------
  우선   핵심 수학  영상 첫 질문 /   이야기 방향      핵심 장면              JP Math Lab
                    훅                                                       연결
  ------ ---------- ---------------- ---------------- ---------------------- ------------
  🔥 S   그래프     **지하철         거리보다 연결이  실제 지도→노선 그래프  노선 설계
                    노선도는 왜 실제 중요한 그래프    변환                   게임
                    지도를                                                   
                    찌그러뜨려도 쓸                                          
                    수 있을까?**                                             

  🔥 S   최단경로   **내비게이션은   그래프 탐색과    도로망이 탐색되며 경로 최단경로
                    수백만 길 중     최단경로         확정                   퍼즐
                    어떻게 가장 빠른                                         
                    길을 찾을까?**                                           

  🔥 S   오일러     **모든 다리를 딱 쾨니히스베르크   고지도에서 그래프로    한붓그리기
         경로       한 번씩 건널 수  다리 문제        전환                   게임
                    있을까?**                                                

  ⭐ A   트리       **회사 조직도와  계층 구조를      폴더·가계도·토너먼트   트리 구축
                    컴퓨터 폴더는 왜 표현하는 트리    변환                   
                    같은 모양일까?**                                         

  🔥 S   네트워크   **한 사람의      연결망과 전파    학생 네트워크에 빛이   전파
                    소문이 학교                       퍼짐                   시뮬레이션
                    전체로 퍼지는 데                                         
                    몇 단계가                                                
                    필요할까?**                                              

  ⭐ A   의사결정   **최선의 선택을  의사결정 트리와  선택지가 가지로 갈라짐 결정 트리
                    찾는 문제를      경우 분기                               게임
                    나무로 그리면                                            
                    뭐가 달라질까?**                                         

  🔥 S   게임이론   **둘 다 이기고   전략과 보수 구조 두 플레이어 선택       반복 게임
         맛보기     싶을 때 왜 둘 다                  매트릭스               
                    손해 보는 선택을                                         
                    할까?**                                                  

  🔥 S   암호       **인터넷에서     이산 구조와      자물쇠·키 교환         간단 암호
                    비밀번호를 직접  암호의 아이디어                         퍼즐
                    보내지 않고도                                            
                    안전할 수                                                
                    있을까?**                                                

  🔥 S   스케줄링   **수업시간표는   제약조건과 조합  과목 블록 충돌         시간표
                    왜 생각보다      최적화                                  최적화 게임
                    만들기                                                   
                    어려울까?**                                              

  🔥 S   색칠 문제  **지도에서 이웃  그래프 색칠      지도가 그래프로 변환   최소 색칠
                    나라끼리 다른                                            도전
                    색을 쓰려면 몇                                           
                    색이 필요할까?**                                         
  ---------------------------------------------------------------------------------------

# 수학과 문화

  -----------------------------------------------------------------------------
  우선    핵심     영상 첫 질문 /  이야기 방향        핵심 장면    JP Math Lab
          수학     훅                                              연결
  ------- -------- --------------- ------------------ ------------ ------------
  🔥 S    건축     **고딕 성당은   기하·비례·대칭과   성당 도면 위 비례 설계
                   왜 비례와       건축               기하선       
                   대칭에                                          
                   집착했을까?**                                   

  🔥 S    원근법   **평평한        투영과 원근법      르네상스     원근법 조작
                   캔버스가 어떻게                    그림의       
                   깊이를                             소실점       
                   속일까?**                                       

  🔥 S    음악     **옥타브는 왜   비율·로그와 음악   현의 진동과  주파수 믹서
                   주파수가 정확히                    음계         
                   두 배일까?**                                    

  ⭐ A    리듬     **3박자와       최소공배수와 주기  두 리듬 파형 폴리리듬
                   4박자가 겹치면                                  실험
                   언제 다시                                       
                   만날까?**                                       

  🔥 S    패턴     **이슬람 타일은 대칭·테셀레이션    문양이 무한  타일 제작기
                   왜 끝없이                          확장         
                   이어져도 빈틈이                                 
                   없을까?**                                       

  🔥 S    프랙탈   **나무와        자기유사성과 반복  가지가 반복  프랙탈
                   해안선은 왜                        생성         생성기
                   확대해도 비슷해                                 
                   보일까?**                                       

  🔥 S    투표     **가장 공정한   순위·집계와 사회적 같은 표가    투표 방식
                   투표 방식은     선택               방식에 따라  비교
                   정말                               다른 승자    
                   하나뿐일까?**                                   

  ⭐ A    스포츠   **승률 60% 팀이 확률과 경기 구조   플레이오프   시리즈
                   7전제에서                          트리         시뮬레이터
                   우승할                                          
                   확률은?**                                       

  🔥 S    환경     **탄소배출이    지수·비율과        탄소         감축
                   매년 몇 %씩     지속가능성         카운터와     시나리오
                   줄어야 목표에                      시간축       
                   도달할까?**                                     

  🔥 S    디지털   **컴퓨터는      이산화·좌표·근사   곡선에 픽셀  해상도 조절
          이미지   곡선을 어떻게                      격자 확대    
                   네모난 픽셀로                                   
                   그릴까?**                                       
  -----------------------------------------------------------------------------

# 실용 통계

  ------------------------------------------------------------------------------------------
  우선   핵심 수학    영상 첫 질문 / 훅         이야기 방향        핵심 장면    JP Math Lab
                                                                                연결
  ------ ------------ ------------------------- ------------------ ------------ ------------
  🔥 S   그래프 왜곡  **같은 데이터인데         축·비율·시각화의   같은 데이터  그래프 조작
                      그래프만 바꿔도 완전히    함정               두 그래프    탐지
                      다른 이야기처럼 보일까?**                    비교         

  🔥 S   설문         **질문 한 문장만 바꿔도   측정과 설문 편향   두 설문      문항 설계
                      응답이 달라질까?**                           결과가       실험
                                                                   갈라짐       

  🔥 S   표본편향     **온라인 투표 10만 명이   대표성과 표본추출  큰 편향표본  표본 게임
                      여론조사 1000명보다 항상                     vs 작은      
                      정확할까?**                                  무작위표본   

  🔥 S   상관과 인과  **아이스크림 판매가 늘면  숨은 변수와 인과   두 그래프    교란변수
                      익사 사고도               오류               동반 상승 후 찾기
                      늘어난다---아이스크림이                      기온 등장    
                      원인일까?**                                               

  🔥 S   이상치       **한 명의 데이터가 전체   이상치와 요약통계  점 하나가    이상치
                      결론을 뒤집을 수                             그래프를     온오프
                      있을까?**                                    끌어당김     

  ⭐ A   예측         **어제까지의 데이터로     추세와 예측        미래 구간이  예측 범위
                      내일을 어디까지 믿을 수   불확실성           퍼짐         조절
                      있을까?**                                                 

  🔥 S   가설검정     **우연처럼 보이는 차이가  가설·증거·판단     동전/실험    유의성 직관
                      정말 우연일까?**                             결과 누적    실험

  🔥 S   A/B 테스트   **버튼 색 하나 바꿨더니   실험 설계와 비교   두 웹페이지  A/B 테스트
                      매출이 올랐다---진짜                         사용자 흐름  시뮬레이션
                      효과일까?**                                               

  🔥 S   생존자편향   **총알 자국이 많은 곳을   보이지 않는        귀환         편향 탐정
                      보강하면 왜 틀릴 수       데이터의 중요성    비행기와     게임
                      있을까?**                                    사라진       
                                                                   비행기       

  🔥 S   데이터 윤리  **숫자는 거짓말하지       선택·표현·맥락의   뉴스         팩트체크
                      않지만 숫자로 거짓말할 수 윤리               그래프가     모드
                      있을까?**                                    편집됨       
  ------------------------------------------------------------------------------------------

# 수학과제 탐구

  ----------------------------------------------------------------------------
  우선     핵심 수학  영상 첫 질문  이야기 방향      핵심 장면  JP Math Lab
                      / 훅                                      연결
  -------- ---------- ------------- ---------------- ---------- --------------
  🔥 S     질문       **좋은 수학   탐구 가능한      막연한     질문 리파이너
           만들기     탐구는 답이   질문의 조건      질문이     
                      아니라                         측정       
                      질문에서                       가능한     
                      갈린다?**                      질문으로   
                                                     변환       

  🔥 S     모델링     **현실을      가정과 수학적    복잡한     모델 단순화
                      정확히        모델             도시가 몇  게임
                      복사하지 않고                  변수로     
                      일부러                         축약       
                      단순하게                                  
                      만드는                                    
                      이유는?**                                 

  ⭐ A     자료수집   **원하는      자료의 타당성과  선택된     샘플링 설계
                      결론이 나오게 편향             데이터만   
                      자료를 모으면                  남는 장면  
                      왜 탐구가                                 
                      무너질까?**                               

  ⭐ A     변수       **무엇을      독립·종속·통제   실험실     변수 통제 실험
                      바꾸고 무엇을 변수             다이얼     
                      고정해야                                  
                      원인을 볼 수                              
                      있을까?**                                 

  🔥 S     패턴 발견  **우연한      추측·검증·반례   점들       패턴 검증
                      규칙과 진짜                    사이에     
                      규칙을 어떻게                  여러 패턴  
                      구별할까?**                    후보       

  🔥 S     반례       **명제를      증명과 반례      수천 개 흰 반례 사냥
                      무너뜨리는 데                  점 사이    
                      왜 단 하나의                   검은 점    
                      사례면                         하나       
                      충분할까?**                               

  ⭐ A     공학도구   **컴퓨터가    계산과 해석의    그래프     도구 결과 해석
                      답을 보여주면 차이             자동생성   
                      탐구는 끝난                    후 질문    
                      걸까?**                        등장       

  ⭐ A     의사소통   **같은 결과도 수학적 표현과    같은       프레젠테이션
                      그래프와      논증             결과의     빌더
                      문장에 따라                    여러 표현  
                      설득력이                                  
                      달라질까?**                               

  🔥 S     재현성     **다른 사람이 절차·기록·검증   두 실험이  재현성 체크
                      똑같이 했는데                  다른 결과  
                      결과가 안                                 
                      나오면                                    
                      과학일까?**                               

  🔥 S     탐구 윤리  **결과가      정직한 탐구와    데이터     윤리 선택
                      마음에 안     데이터 윤리      삭제 버튼  시나리오
                      든다고                         앞에서     
                      데이터를 빼도                  멈춤       
                      될까?**                                   
  ----------------------------------------------------------------------------

# 직무 수학

  -----------------------------------------------------------------------------------
  우선   핵심 수학   영상 첫 질문  이야기 방향              핵심 장면    JP Math Lab
                     / 훅                                                연결
  ------ ----------- ------------- ------------------------ ------------ ------------
  🔥 S   단위        **NASA        단위 변환의 실제 위험    우주선       단위 변환
                     우주선이 단위                          경로가       미션
                     하나 때문에                            어긋남       
                     사라질 수                                           
                     있다고?**                                           

  🔥 S   어림        **정확한      페르미 추정과 현장 판단  창고 물량을  어림 챌린지
                     계산보다                               빠르게 추정  
                     10초짜리                                            
                     어림이 더                                           
                     중요한                                              
                     순간은?**                                           

  ⭐ A   비율        **레시피      비례와 스케일링          주방 재료가  배합 계산기
                     4인분을                                확대         
                     37인분으로                                          
                     바꾸려면?**                                         

  🔥 S   도면        **평면 도면만 겨냥도·전개도·공간감각   도면이       전개도 조립
                     보고 완성된                            입체로 접힘  
                     물체를 상상할                                       
                     수 있을까?**                                        

  🔥 S   포장        **같은 부피를 넓이·부피·최적화         상자 형태    포장 설계
                     담으면서                               변화         게임
                     포장재를 가장                                       
                     적게                                                
                     쓰려면?**                                           

  ⭐ A   재고        **얼마나      자료·비율·의사결정       창고 재고    재고 운영
                     주문해야                               게이지       게임
                     남지도                                              
                     모자라지도                                          
                     않을까?**                                           

  🔥 S   품질관리    **1000개를 다 표본과 품질관리          생산라인     검사 전략
                     검사하지 않고                          일부 샘플링  게임
                     불량률을 알                                         
                     수 있을까?**                                        

  ⭐ A   공정시간    **한 작업이   시간·비율·병목           생산라인     공정 최적화
                     1분 줄면 공장                          병목 표시    
                     전체는 얼마나                                       
                     빨라질까?**                                         

  ⭐ A   임금·세금   **시급이      비율·구간·공제           급여명세서   급여 계산기
                     올랐는데                               분해         
                     실수령액은 왜                                       
                     그만큼 안                                           
                     오를까?**                                           

  🔥 S   자료판단    **매출은      여러 지표를 함께 읽는 법 대시보드     의사결정
                     올랐는데 회사                          지표 충돌    시뮬레이션
                     상황이 나빠질                                       
                     수도                                                
                     있을까?**                                           
  -----------------------------------------------------------------------------------

------------------------------------------------------------------------

# 우선 제작 추천 TOP 25

1.  적분이 없던 시대, 아르키메데스는 넓이를 어떻게 구했을까? --- 미적분Ⅰ
2.  자동차의 '바로 지금 속도'를 어떻게 측정할까? --- 미적분Ⅰ
3.  아킬레우스는 정말 거북이를 영원히 못 따라잡을까? --- 미적분Ⅰ
4.  곡선을 100만 배 확대하면 정말 직선처럼 보일까? --- 미적분Ⅰ
5.  넓이를 재는 적분과 기울기를 재는 미분은 왜 서로 반대일까? ---
    미적분Ⅰ
6.  위성 안테나는 왜 접시 모양일까? --- 기하
7.  속삭임이 멀리 있는 사람에게 전달되는 방이 있다고? --- 기하
8.  원뿔 하나에서 네 개의 전혀 다른 곡선이 태어난다고? --- 기하
9.  강을 건너는 배는 왜 목표 방향으로 똑바로 가면 안 될까? --- 기하
10. 게임 캐릭터는 적이 앞에 있는지 어떻게 판단할까? --- 기하/벡터
11. 그림자만으로 지붕의 실제 구조를 이해할 수 있을까? --- 기하/정사영
12. 계산기 없던 천문학자는 거대한 곱셈을 어떻게 했을까? --- 대수/로그
13. 종이를 42번 접으면 정말 달에 닿을까? --- 대수/지수
14. 소리·파도·심장박동은 왜 같은 곡선으로 그려질까? --- 대수/삼각함수
15. GPS는 왜 원을 여러 개 그려 내 위치를 찾을까? --- 공통수학2
16. 한 번의 반례가 왜 수천 번의 성공을 무너뜨릴까? --- 공통수학2
17. AI에게 사진은 사진이 아니라 숫자 덩어리라고? --- 공통수학1/인공지능
    수학
18. AI는 정답을 모르면서 어떻게 더 나은 답을 찾아갈까? --- 인공지능 수학
19. 시험문제를 통째로 외운 학생은 정말 공부를 잘한 걸까? --- 인공지능
    수학/과적합
20. 생일이 같은 사람이 교실에 있을 확률은 왜 생각보다 높을까? --- 확률과
    통계
21. 동전을 다섯 번 앞면으로 던졌다면 다음은 뒷면일까? --- 확률과 통계
22. 같은 데이터인데 그래프만 바꿔도 완전히 다른 이야기처럼 보일까? ---
    실용 통계
23. 내비게이션은 수백만 길 중 어떻게 가장 빠른 길을 찾을까? --- 이산수학
24. 오늘의 100만원과 10년 뒤 100만원은 왜 같은 돈이 아닐까? --- 경제
    수학
25. 평평한 캔버스가 어떻게 깊이를 속일까? --- 수학과 문화

# 시리즈 묶음 아이디어

## 1. 인간은 어떻게 '무한'을 길들였나

제논의 역설 → 0.999... → 무한급수 → 아르키메데스 → 극한 → 적분

## 2. 인간은 어떻게 보이지 않는 것을 측정했나

별의 거리 → 삼각함수 → 그림자 → 정사영 → GPS → 쌍곡선 위치추정

## 3. 인간은 어떻게 '순간'을 계산했나

평균속도 → 순간속도 → 접선 → 미분 → 최적화 → 운동

## 4. 인간은 어떻게 불확실한 미래를 숫자로 만들었나

도박 → 확률 → 보험 → 표본 → 여론조사 → AI의 확률적 예측

## 5. 수학이 컴퓨터 안으로 들어간 순간

이진적 선택 → 행렬 → 그래프 → 최단경로 → 데이터 벡터 → 신경망

## 6. 돈은 왜 수학 없이는 움직이지 못하나

퍼센트 → 복리 → 현재가치 → 대출 → 수요·공급 → 위험과 수익

## 7. 3차원 세계를 평면에 가두는 법

원근법 → 좌표 → 벡터 → 평면 → 정사영 → 3D 그래픽

# 확장 규칙

새 아이디어를 추가할 때는 반드시 다음 6가지를 기록한다.

`과목 / 핵심개념 / 첫 질문 / 이야기의 갈등 / 영상으로 보여줄 장면 / 직접 조작할 수 있는 것`

좋은 아이디어의 판별 질문: - 첫 3초만 보고도 "왜?"가 생기는가? - 말
없이도 그림으로 절반 이상 설명 가능한가? - 수학 개념이 억지로 붙은 것이
아니라 문제 해결의 핵심인가? - 학생이 직접 값을 바꾸거나 물체를 움직여
결과를 확인할 수 있는가? - 영상이 끝났을 때 답보다 새로운 질문이 하나 더
생기는가?

# 교육과정 기준 메모

이 아이디어 뱅크는 2022 개정 고등학교 수학의
공통·일반선택·진로선택·융합선택 과목 구조를 기준으로 설계했다.\
정확한 성취기준 코드별 매핑이 필요한 제작 단계에서는 교육부 고시
제2022-33호 수학과 교육과정(별책 8)의 해당 성취기준과 대조하여 태깅한다.

총 아이디어 수: **140개**

------------------------------------------------------------------------

# v2 사고 확장 --- "한 개념 = 한 소재"에서 벗어나기

v1의 약점은 명확하다. **교육과정 전체 지도를 빠르게 만드는 데
성공했지만, 한 핵심개념에 대표 훅 하나를 붙인 경우가 많다.** 실제 콘텐츠
제작에서는 같은 개념도 학생의 관심사와 영상 문법에 따라 완전히 다른
입구를 가져야 한다.

따라서 v2부터는 한 개념을 다음 **8개의 렌즈**로 다시 본다.

1.  **역사** --- 인간은 왜 이것을 발명했나?
2.  **역설·미스터리** --- 상식과 충돌하는 장면은 무엇인가?
3.  **생활** --- 학생이 이미 매일 겪고 있는 현상은 무엇인가?
4.  **과학·우주** --- 자연을 설명하는 데 어디에 쓰이는가?
5.  **건축·예술** --- 눈으로 강하게 보여줄 수 있는가?
6.  **게임·스포츠** --- 직접 조작하거나 승패를 만들 수 있는가?
7.  **경제·사회** --- 돈과 선택, 위험에 어떤 영향을 주는가?
8.  **AI·기술** --- 현대 기술 내부에서 이 수학은 무슨 일을 하는가?

## S+급 판별 기준

다음 다섯 조건 중 4개 이상이면 **S+ 후보**로 본다.

-   첫 문장이 수학을 몰라도 궁금하다.
-   말 없이도 5초 이상 화면으로 보여줄 수 있다.
-   중간에 '아!' 하는 시각적 반전이 있다.
-   핵심 수학을 제거하면 이야기가 성립하지 않는다.
-   영상 뒤에 학생이 직접 조작할 대상이 있다.

# S+ 후보 --- 다시 비틀어 만든 핵심 주제 64

## 극한·미분·적분

### 1. 극한 --- 제논보다 더 직접적으로

-   **"목표까지 남은 거리의 절반씩만 간다면, 영원히 도착하지 못할까?"**
-   화면: 복도 끝 문까지 절반 → 절반 → 절반. 카메라는 실제로 문에
    도착한다.
-   반전: 무한히 많은 과정과 유한한 결과가 동시에 가능하다.
-   Lab: 분할 비율을 학생이 바꾸고 총 이동거리 관찰.
-   **S+**

### 2. 극한 --- 픽셀

-   **"화면을 계속 확대하면 원은 언제부터 원이 아니게 될까?"**
-   화면: 매끈한 원 → 확대 → 계단 모양 픽셀.
-   연결: 연속적인 수학과 이산적인 디지털 세계.
-   Lab: 해상도와 확대율 조절.
-   **S+**

### 3. 미분 --- 순간속도

-   **"속도계는 1초 뒤를 보지 않고 어떻게 지금 속도를 알까?"**
-   화면: 자동차 → 시간창 1초/0.1초/0.01초 → 접선.
-   Lab: 시간 간격을 직접 0에 접근.
-   **S+**

### 4. 미분 --- 확대

-   **"곡선은 가까이서 보면 정말 직선일까?"**
-   화면: 거대한 곡면 위 카메라 → 끝없는 줌 → 직선처럼 변함.
-   연결: 국소 선형성.
-   **S+**

### 5. 미분 --- 롤러코스터

-   **"롤러코스터 꼭대기에서 딱 한순간, 기울기는 어디로 사라질까?"**
-   화면: 1인칭 트랙 → 정상에서 정지한 듯한 순간 → 접선 수평.
-   Lab: 트랙 제어점 이동, 극값 변화.
-   **S+**

### 6. 미분 --- 최적화

-   **"피자 상자를 만들 때 종이를 가장 적게 쓰는 모양은?"**
-   화면: 같은 부피의 상자들이 형태를 바꾸며 표면적 숫자 변화.
-   Lab: 치수 드래그로 최소값 찾기.
-   **S+**

### 7. 적분 --- 아르키메데스

-   **"적분도 π도 없던 시대에 원을 어떻게 계산했을까?"**
-   화면: 양피지 → 6 → 12 → 24 → 48 → 96각형 → 가장자리 초근접.
-   Lab: 다각형 변 수 증가와 오차 확인.
-   **S+**

### 8. 적분 --- 속도계

-   **"자동차의 속도 기록만 남아 있다면, 어디까지 갔는지 복원할 수
    있을까?"**
-   화면: 속도 그래프 아래 면적이 실제 도로 거리로 변환.
-   **S+**

### 9. 기본정리

-   **"기울기를 재는 미분과 넓이를 재는 적분이 왜 서로 취소될까?"**
-   화면: 곡선 아래 물이 차오름 → 누적 높이 그래프 → 그 그래프의
    기울기와 원래 함수가 포개짐.
-   **S+**

## 지수·로그·수열

### 10. 지수 --- 종이

-   **"종이를 42번 접으면 달에 닿는다. 계산은 맞다. 그런데 왜
    불가능할까?"**
-   수학과 물리적 현실의 차이까지 다룬다.
-   **S+**

### 11. 지수 --- 감염

-   **"처음 10명일 때는 아무도 신경 쓰지 않았다."**
-   화면: 지도에 점 10개 → 20 → 40 → 도시 전체.
-   핵심: 지수성장은 초반에 직관을 속인다.
-   **S+**

### 12. 로그 --- 별

-   **"별의 밝기는 왜 그냥 숫자로 쓰지 않고 등급으로 말할까?"**
-   엄청난 크기 범위를 압축하는 로그.
-   **S+**

### 13. 로그 --- 계산 혁명

-   **"계산기 하나 없던 천문학자가 8자리 곱셈을 수천 번 해야 했다."**
-   곱셈 → 로그표 → 덧셈 → 역로그.
-   **S+**

### 14. 로그 --- 데시벨

-   **"소리가 10dB 커졌다는 건 10만큼 커졌다는 뜻이 아니다."**
-   소리 파동과 로그척도.
-   **S+**

### 15. 등비수열 --- 조회수

-   **"조회수 100짜리 영상이 어느 순간 100만이 되는 과정은 선형이
    아니다."**
-   공유 한 명이 몇 명에게 전달하는지에 따른 확산.
-   **S+**

### 16. 귀납법

-   **"무한히 많은 도미노를 직접 확인하지 않고 전부 쓰러진다고 어떻게
    증명할까?"**
-   **S+**

## 기하·벡터·공간

### 17. 포물선 --- 안테나

-   **"하늘 어디서 온 전파든 왜 접시 한 점으로 모일까?"**
-   평행선 → 반사 → 초점.
-   **S+**

### 18. 포물선 --- 자동차 헤드라이트

-   **"전구 하나의 빛을 어떻게 거의 평행하게 앞으로 보낼까?"**
-   안테나와 정확히 반대 방향의 포물선 반사.
-   **S+**

### 19. 타원 --- 속삭이는 방

-   **"수십 미터 떨어진 사람의 속삭임이 바로 귀 옆에서 들린다면?"**
-   두 초점.
-   **S+**

### 20. 타원 --- 행성

-   **"왜 행성은 태양을 중심으로 완벽한 원을 그리지 않을까?"**
-   케플러와 타원.
-   **S+**

### 21. 쌍곡선 --- 위치추적

-   **"신호가 어디서 왔는지 방향을 몰라도 도착 시간 차이만 알면 찾을 수
    있다."**
-   **S+**

### 22. 원뿔곡선

-   **"원을 비스듬히 자르기 시작했을 뿐인데 네 종류의 곡선이
    태어났다."**
-   3D 원뿔을 카메라가 돌며 절단.
-   **S+**

### 23. 벡터 --- 강 건너기

-   **"목적지를 향해 똑바로 노를 저으면 목적지에 도착하지 못한다."**
-   **S+**

### 24. 벡터 --- 비행기

-   **"비행기는 옆을 보고 날면서도 직진할 수 있다."**
-   측풍 + 기수 방향 + 실제 이동 방향.
-   **S+**

### 25. 내적 --- 게임 AI

-   **"적이 내 앞에 있는지 게임은 눈도 없이 어떻게 알까?"**
-   캐릭터 시선 벡터와 적 방향 벡터.
-   **S+**

### 26. 내적 --- 조명

-   **"게임 속 벽은 빛을 정면으로 받을수록 왜 밝아질까?"**
-   법선 벡터와 빛 벡터의 내적.
-   **S+**

### 27. 정사영 --- 지붕

-   **"3차원 지붕을 도면 한 장에 정확히 눌러 담을 수 있을까?"**
-   실제 지붕 → 빛 → 투영 → 평면도.
-   **S+**

### 28. 정사영 --- 그림자

-   **"같은 물체의 그림자가 길어졌다 짧아졌다 하는 건 무엇이 바뀐
    걸까?"**
-   태양 벡터와 투영.
-   **S+**

### 29. 공간좌표 --- 드론

-   **"드론에게 '오른쪽으로 가'라고 말하는 것만으로 부족한 이유는?"**
-   3축 위치와 방향.
-   **S+**

### 30. 평면 --- 충돌

-   **"총알이 벽을 뚫었는지 게임은 매 프레임 어떻게 계산할까?"**
-   직선과 평면의 교점.
-   **S+**

## 확률·통계

### 31. 생일 문제

-   **"23명만 모여도 생일이 같은 두 사람이 있을 확률이 절반을 넘는다?"**
-   사람 아이콘이 하나씩 들어오며 확률 상승.
-   **S+**

### 32. 도박사의 오류

-   **"앞면이 10번 연속 나왔다. 이제 뒷면에 걸어야 할까?"**
-   **S+**

### 33. 조건부확률

-   **"정확도 99% 검사에서 양성이 나왔다. 정말 99% 확률로 맞을까?"**
-   기저율을 점 1,000개로 시각화.
-   **S+**

### 34. 몬티홀

-   **"문 하나를 열어 보여줬는데, 왜 선택을 바꾸는 게 유리할까?"**
-   게임쇼 연출.
-   **S+**

### 35. 정규분포

-   **"서로 상관없어 보이는 수많은 측정값이 왜 자꾸 같은 종 모양이
    될까?"**
-   작은 오차들이 합쳐지는 장면.
-   **S+**

### 36. 표본

-   **"1,000명에게 잘 물으면 5,000만 명의 생각을 알 수 있을까?"**
-   **S+**

### 37. 표본편향

-   **"10만 명이 참여한 투표가 1,000명 조사보다 틀릴 수 있다."**
-   숫자의 크기보다 뽑는 방식.
-   **S+**

### 38. 상관·인과

-   **"아이스크림이 많이 팔릴수록 익사 사고가 늘어난다. 아이스크림을
    금지해야 할까?"**
-   숨은 변수 '기온' 등장.
-   **S+**

### 39. 평균의 함정

-   **"회사 평균연봉이 크게 올랐는데 직원 대부분은 한 푼도 더 못
    받았다."**
-   한 명의 극단값.
-   **S+**

### 40. 생존자편향

-   **"총알 자국이 많은 곳을 보강하면 비행기가 더 위험해진다?"**
-   돌아온 비행기와 돌아오지 못한 비행기.
-   **S+**

## 공통수학·논리·대수

### 41. 복소수

-   **"존재하지 않는 수를 만들었더니 현실의 전기와 파동을 더 쉽게
    계산하게 됐다."**
-   수직선이 복소평면으로 열리는 장면.
-   **S+**

### 42. 이차함수

-   **"농구공·분수·대포알은 왜 비슷한 곡선을 그릴까?"**
-   세 장면의 궤적이 하나의 포물선으로 포개짐.
-   **S+**

### 43. 원의 방정식 --- GPS

-   **"위성 하나는 내 위치를 모른다. 여러 개가 만나면 안다."**
-   거리 구/원의 교차.
-   **S+**

### 44. 명제 --- 반례

-   **"백조를 100만 마리 봐도 '모든 백조는 희다'를 증명할 수 없다.
    그런데 검은 백조 한 마리면 끝난다."**
-   **S+**

### 45. 필요충분조건

-   **"도로가 젖어 있다. 비가 왔다고 결론 내려도 될까?"**
-   스프링클러라는 반례 등장.
-   **S+**

### 46. 행렬

-   **"사진을 숫자표로 바꾸면 회전·확대·AI 인식까지 가능해진다."**
-   실제 사진 → 격자 → 숫자 → 변환.
-   **S+**

### 47. 경우의 수

-   **"비밀번호 한 자리만 늘렸는데 해킹 시간이 왜 10배가 될까?"**
-   조합 폭발.
-   **S+**

### 48. 함수

-   **"세상을 '입력 하나를 넣으면 무엇이 나오는가'로 보면 갑자기 같은
    구조가 보인다."**
-   자판기·환율·온도변환·게임 데미지가 하나의 함수 머신으로.
-   **S+**

## 경제수학

### 49. 복리

-   **"연 7%라는 작은 숫자가 30년 뒤에는 왜 이렇게 무서울까?"**
-   시간축에서 두 자산이 갈라짐.
-   **S+**

### 50. 현재가치

-   **"지금 1억과 30년 뒤 1억 중 어느 쪽이 더 큰 돈일까?"**
-   돈이 시간축을 이동하며 가치 변화.
-   **S+**

### 51. 할인

-   **"50% 할인한 뒤 50% 올리면 왜 원래 가격이 아니지?"**
-   같은 50이라는 숫자가 다른 기준값에 적용.
-   **S+**

### 52. 대출

-   **"같은 3억을 빌렸는데 누구는 이자를 수천만 원 더 낸다."**
-   상환 방식별 현금흐름.
-   **S+**

### 53. 손익분기점

-   **"잘 팔리는데도 망하는 가게가 있다."**
-   매출과 이익은 같은 것이 아님.
-   **S+**

### 54. 탄력성

-   **"가격을 올렸는데 매출이 오르는 상품과 떨어지는 상품의 차이는?"**
-   **S+**

## AI·컴퓨터·이산수학

### 55. AI와 벡터

-   **"AI에게 '왕-남자+여자' 같은 계산이 가능하다는 건 무슨 뜻일까?"**
-   단어가 공간의 점/벡터가 되는 장면.
-   실제 모델의 동작을 과장해 단정하지 않고 '임베딩 공간의 직관'으로
    설명.
-   **S+**

### 56. 경사하강

-   **"AI는 정답 위치를 모르는데 어떻게 산 아래로 내려갈까?"**
-   손실 지형과 기울기.
-   **S+**

### 57. 과적합

-   **"100점을 맞았는데 처음 보는 문제는 하나도 못 푼다면?"**
-   학생 비유 → AI의 훈련/검증 데이터.
-   **S+**

### 58. 그래프이론

-   **"지하철 노선도는 지리를 틀리게 그렸는데 왜 더 유용할까?"**
-   공간의 정확성보다 연결 구조.
-   **S+**

### 59. 최단경로

-   **"내비게이션은 모든 길을 직접 가보지 않고 어떻게 최단길을
    찾을까?"**
-   탐색 파동이 도로망을 퍼짐.
-   **S+**

### 60. 오일러

-   **"도시의 모든 다리를 딱 한 번씩만 건널 수 있을까?"**
-   실제 지도 → 점과 선만 남음 → 그래프이론 탄생.
-   **S+**

### 61. 암호

-   **"비밀 열쇠를 상대에게 보내지 않고도 둘만 같은 비밀을 가질 수
    있을까?"**
-   공개 정보와 비밀 정보의 분리.
-   **S+**

### 62. 스케줄링

-   **"학교 시간표는 왜 컴퓨터에게도 생각보다 어려운 문제일까?"**
-   교사·교실·과목 제약이 겹치며 조합 폭발.
-   **S+**

## 수학과 문화·시각

### 63. 원근법

-   **"평평한 그림 한 장이 뇌에게 '깊다'고 거짓말하는 방법."**
-   르네상스 거리 → 소실점과 투영선 노출.
-   **S+**

### 64. 음악과 로그

-   **"한 옥타브 올라갔는데 왜 주파수는 '더하기'가 아니라 두 배가
    될까?"**
-   건반이 주파수 축과 겹쳐지고 로그 간격으로 정렬.
-   **S+**

# 추가로 만들 가치가 큰 '질문 문법' 20개

주제를 계속 생산하려면 개별 아이디어보다 **질문 생성 문법**을 갖는 것이
더 중요하다.

1.  \*\*"\_**도 없던 시대에 사람들은 **\_을 어떻게 했을까?"\*\*
2.  \*\*"왜 서로 전혀 달라 보이는 \_**와 **\_가 같은 그래프를
    만들까?"\*\*
3.  \*\*"\_**을 계속 무한히 하면 정말 **\_이 될까?"\*\*
4.  **"숫자 하나가 바뀌었을 뿐인데 왜 결과가 폭발할까?"**
5.  \*\*"우리가 당연하다고 믿는 \_\_\_은 정말 항상 참일까?"\*\*
6.  \*\*"갈 수 없는 곳의 \_\_\_을 어떻게 측정할까?"\*\*
7.  \*\*"보이지 않는 \_\_\_을 숫자로 만들 수 있을까?"\*\*
8.  **"정답을 모르는데 어떻게 최선의 답을 찾아갈까?"**
9.  **"같은 데이터인데 왜 결론이 반대로 보일까?"**
10. \*\*"\_\_\_을 평면 한 장에 어떻게 담을까?"\*\*
11. **"아무리 가까워져도 닿지 않는데 왜 같은 값이라고 할까?"**
12. **"한 번의 반례가 왜 수백만 번의 성공보다 강할까?"**
13. **"평균은 좋아졌는데 왜 아무도 좋아지지 않았을까?"**
14. **"무한히 많은 것을 더했는데 왜 끝이 있을까?"**
15. **"움직이는 것의 '바로 지금'을 어떻게 측정할까?"**
16. **"가장 짧은 길/가장 큰 값/가장 싼 방법은 어떻게 찾을까?"**
17. \*\*"게임은 눈도 귀도 없는데 어떻게 \_\_\_을 판단할까?"\*\*
18. \*\*"AI에게 \_\_\_은 실제로 무엇처럼 보일까?"\*\*
19. **"돈의 숫자는 그대로인데 왜 가치가 달라질까?"**
20. **"자연은 왜 하필 이 모양을 반복해서 만들까?"**

# v2에서 얻은 핵심 결론

콘텐츠의 단위는 **'단원'이 아니라 '질문'**이어야 한다.

예를 들어 '벡터'라는 단원 하나에서 - 강 건너기 - 측풍 속 비행기 - 게임
캐릭터 시야 - 3D 조명 - 드론 이동 - 정사영 - 충돌 판정

처럼 서로 다른 콘텐츠가 나온다.

따라서 최종 아이디어 뱅크는 교육과정 목차를 따라가는 **세로축**과,
역사·미스터리·게임·건축·경제·AI 같은 **가로축**이 교차하는 구조가 되어야
한다.

이 구조로 확장하면 140개에서 끝나는 것이 아니라 **300\~500개의 질문
후보를 체계적으로 생산**할 수 있다.

------------------------------------------------------------------------

# v3 사고 확장 --- "재미있는 수학 영상"이 아니라 '수학적 경험'을 설계한다

v2까지는 좋은 **질문**을 찾는 데 집중했다.\
v3에서는 한 단계 더 나아간다.

좋은 콘텐츠의 목적은 학생에게 "재밌다"는 감정을 주는 것이 아니라,

> **예측하게 하고 → 틀리게 하고 → 직접 움직이게 하고 → 패턴을 발견하게
> 하고 → 수학적 언어가 필요해지는 순간을 만드는 것**

이다.

따라서 JP Math Lab 콘텐츠의 기본 구조를 다음처럼 재정의한다.

## JP Math Lab Discovery Loop

### 1. WONDER --- 이상한 장면

학생이 아직 수학을 몰라도 궁금해야 한다.

### 2. PREDICT --- 먼저 선택

설명 전에 학생에게 결과를 예상하게 한다.

### 3. BREAK --- 직관을 깨뜨린다

예측과 실제 결과가 충돌한다.

### 4. PLAY --- 직접 조작

변수 하나를 학생 손에 넘긴다.

### 5. NOTICE --- 패턴 발견

수치·도형·그래프가 동시에 반응한다.

### 6. NAME --- 그제야 수학의 이름을 붙인다

"방금 네가 발견한 것이 미분/정사영/내적/조건부확률이다."

### 7. TRANSFER --- 새로운 상황

겉모습이 다른 문제에서도 같은 구조를 찾게 한다.

이 순서를 지키면 영상은 '설명 영상'이 아니라 **탐구의 첫 30초**가 된다.

# 콘텐츠를 5종으로 나눈다

모든 개념을 역사 영상으로 만들 필요는 없다. 개념에 가장 강한 경험 형식을
선택한다.

## Type A --- CINEMA / 발견의 역사

인간이 실제 문제를 해결하며 수학을 만든 이야기. - 아르키메데스와
소진법 - 로그와 천문 계산 - 오일러와 쾨니히스베르크 - 확률론과 도박 -
원근법과 르네상스

## Type B --- PARADOX / 직관 붕괴

학생의 첫 예측을 일부러 틀리게 만드는 콘텐츠. - 생일 문제 - 몬티홀 -
0.999... - 무한급수 - 50% 할인 후 50% 인상 - 표본편향

## Type C --- SIMULATION / 움직이는 세계

현상을 조작하다가 수학 구조를 발견. - 롤러코스터와 미분 - 강 건너기와
벡터 - 위성 안테나와 포물선 - 복리와 지수 - 감염과 등비성장

## Type D --- GAME / 목표와 실패

수학을 써야만 더 잘할 수 있는 게임. - 측풍 속 비행기 착륙 - 최단경로 -
정사영 지붕 맞추기 - 손익분기점 가게 운영 - 확률 게임 - 함수 머신

## Type E --- LENS / 세상을 보는 수학적 렌즈

현실 장면 위에 수학을 겹쳐 보이게 한다. - 농구공 위 포물선 - 건물 위
소실점 - 얼굴 위 좌표 - 게임 장면 위 벡터 - 주가/매출 위 변화율 - 음악
위 파형

# '수학이 필요한 순간' 32개

아래는 단순 훅이 아니라 **학생이 수학을 발명할 수밖에 없는 상황**으로
다시 설계한 후보들이다.

## 1. 순간을 측정할 수 없는 문제

**상황:** 자동차가 카메라 앞을 통과한다. 사진 한 장에는 위치만 있다.\
**질문:** "사진 한 장에서 속도를 어떻게 알아낼까?"\
**학생 예측:** 앞뒤 사진을 사용한다.\
**충돌:** 그러면 그것은 순간속도가 아니라 평균속도다.\
**필요한 수학:** 극한 → 미분계수.\
**발견 문장:** "시간 간격을 없애는 것이 아니라, 0에 가까워질 때의 패턴을
본다."\
**형식:** CINEMA + SIMULATION\
**등급:** S++

## 2. 곡선 위의 방향

**상황:** 게임 자동차가 곡선 도로 위를 달린다.\
**질문:** "지금 자동차가 바라봐야 하는 정확한 방향은?"\
두 점으로 방향을 잡고 두 번째 점을 가까이 이동.\
**필요한 수학:** 할선 → 접선 → 미분.\
**형식:** GAME\
**등급:** S++

## 3. 속도만 남은 자동차

**상황:** GPS 기록은 사라지고 속도계 기록만 남았다.\
**질문:** "차가 얼마나 멀리 갔는지 복원할 수 있을까?"\
**필요한 수학:** 정적분.\
**반전:** 그래프 아래 '넓이'가 실제 '거리'가 된다.\
**등급:** S++

## 4. 그림자로 3차원을 복원

**상황:** 정체불명의 입체가 있고 그림자만 보인다.\
빛의 방향을 바꾸면 그림자가 달라진다.\
**질문:** "그림자 몇 장이면 원래 입체를 추측할 수 있을까?"\
**필요한 수학:** 정사영·공간벡터.\
**형식:** MYSTERY GAME\
**등급:** S++

## 5. 지붕 위 태양광

**상황:** 경사진 지붕에 태양광 패널을 설치한다.\
**질문:** "패널 넓이가 같아도 왜 받는 에너지가 달라질까?"\
**필요한 수학:** 정사영 + 내적의 직관.\
**조작:** 태양 방향과 지붕 각도.\
**등급:** S++

## 6. 보이지 않는 적

**상황:** 게임 캐릭터 뒤에 적이 있다. 거리만으로는 앞/뒤를 구별할 수
없다.\
**질문:** "게임은 어떻게 시야 안의 적만 발견할까?"\
**필요한 수학:** 벡터·내적.\
**등급:** S++

## 7. 측풍 착륙

**상황:** 활주로는 정면인데 강한 옆바람이 분다.\
**질문:** "비행기 기수를 활주로 정면으로 두면 어디에 도착할까?"\
학생이 직접 조종하고 실패.\
**필요한 수학:** 벡터 합.\
**등급:** S++

## 8. 접시가 신호를 모으는 이유

**상황:** 수많은 평행 전파가 접시 위 여러 곳에 닿는다.\
**질문:** "모두 같은 수신기로 보내는 모양은?"\
학생이 곡률을 바꿔 직접 맞춤.\
**필요한 수학:** 포물선.\
**등급:** S++

## 9. 속삭이는 방

**상황:** 두 학생이 멀리 떨어져 벽을 보고 속삭인다.\
**질문:** "왜 특정 위치에서만 또렷하게 들릴까?"\
**필요한 수학:** 타원의 초점.\
**등급:** S++

## 10. 신호의 출발지를 찾아라

**상황:** 세 수신기에 신호가 서로 다른 시각에 도착한다.\
**질문:** "방향을 몰라도 발신지를 찾을 수 있을까?"\
**필요한 수학:** 쌍곡선/거리차.\
**등급:** S++

## 11. 42번의 종이

학생에게 먼저 선택시킨다. - 교실 천장 - 에베레스트 - 우주정거장 - 달

그 후 지수성장을 재생.\
**핵심:** 결과를 알려주는 것이 아니라 **예측을 기록한 뒤 깨뜨린다.**\
**등급:** S++

## 12. 바이럴 버튼

**상황:** 한 사람이 평균 1.0명, 1.1명, 1.5명에게 공유한다.\
**질문:** "0.1명 차이가 정말 중요할까?"\
시간을 빠르게 돌리면 세계가 갈린다.\
**필요한 수학:** 등비·지수.\
**등급:** S++

## 13. 로그를 직접 발명하게 하기

**상황:** 학생에게 거대한 곱셈 20개를 제한시간 안에 준다.\
곱셈을 덧셈으로 바꿀 수 있는 표를 발견.\
**질문:** "이 표가 있다면 계산 세계가 어떻게 바뀔까?"\
**필요한 수학:** 로그의 탄생 이유.\
**등급:** S++

## 14. 50%의 함정

100,000원 상품. 50% 할인 → 50% 인상. 학생에게 "원래 가격?" YES/NO를 먼저
누르게 한다.\
**필요한 수학:** 기준량·비율.\
**등급:** S++

## 15. 복리 타임머신

학생이 월 저축액보다 **시작 시점**을 조작한다.\
20세/30세/40세 시작을 비교.\
**질문:** "돈보다 시간이 더 강력한 변수가 될 수 있을까?"\
**필요한 수학:** 지수·등비수열·현재/미래가치.\
**등급:** S++

## 16. 대출 상환 레이스

같은 원금·금리에서 상환 구조만 바꾼다.\
매달 남은 원금이 3D 블록처럼 깎인다.\
**필요한 수학:** 수열·금융수학.\
**등급:** S++

## 17. 생일 버튼

"우리 반에서 생일이 겹칠 확률은 몇 %?"\
학생이 5/20/50/80% 중 선택.\
사람을 한 명씩 방에 넣는다.\
**필요한 수학:** 여사건.\
**등급:** S++

## 18. 몬티홀 실제 게임

설명 금지. 먼저 10번 플레이.\
'유지'와 '변경' 승률을 학생 자신의 데이터로 보여준다.\
그 후 전체 시뮬레이션 10,000회.\
**필요한 수학:** 조건부확률.\
**등급:** S++

## 19. 99% 정확한 검사

학생에게 10,000명의 사람 점을 보여준다.\
질병 유병률을 슬라이더로 조절.\
**질문:** "같은 99% 검사인데 양성의 의미가 왜 달라질까?"\
**필요한 수학:** 조건부확률·기저율.\
**등급:** S++

## 20. 여론조사 전쟁

A: 자발적 온라인 투표 100,000명\
B: 무작위 표본 1,000명\
"어느 쪽을 믿을 것인가?" 먼저 선택.\
실제 모집단을 공개하고 반복 샘플링.\
**필요한 수학:** 표본·편향.\
**등급:** S++

## 21. 평균연봉 회사

직원 9명의 연봉은 그대로. CEO 연봉만 폭증.\
"우리 회사 평균연봉 40% 상승!" 광고 등장.\
**필요한 수학:** 평균·중앙값·분포.\
**등급:** S++

## 22. 총알 자국

돌아온 비행기의 총알 구멍을 학생이 직접 클릭해 장갑을 보강한다.\
그 선택대로 다음 비행을 시뮬레이션.\
**반전:** 구멍 없는 부분이 치명적이었다.\
**필요한 수학:** 선택편향.\
**등급:** S++

## 23. GPS 미스터리

지도에 플레이어 위치를 숨긴다.\
기지국 하나의 거리 → 원 하나.\
두 개 → 두 후보.\
세 개 → 한 위치.\
**필요한 수학:** 원의 방정식·교점.\
**등급:** S++

## 24. 검은 백조

화면에 흰 백조가 계속 등장한다.\
10 → 100 → 10,000마리. "모든 백조는 희다" 버튼이 점점 유혹적이 된다.
마지막에 검은 백조 한 마리.\
**필요한 수학:** 명제·반례.\
**등급:** S++

## 25. 비밀번호 우주

4자리 → 6자리 → 8자리.\
모든 후보가 실제 공간의 문처럼 복제되어 카메라가 뒤로 빠진다.\
**필요한 수학:** 곱의 법칙·경우의 수.\
**등급:** S++

## 26. AI의 단어 지도

'고양이, 강아지, 자동차, 버스...'가 공간의 점으로 나타난다.\
비슷한 단어가 군집.\
**질문:** "컴퓨터에게 의미를 거리로 만들 수 있을까?"\
**필요한 수학:** 벡터·거리·유사도.\
**등급:** S++

## 27. AI 산 내려가기

학생이 학습률을 선택. 너무 작음 → 느림. 너무 큼 → 골짜기를 튕겨나감.
적당함 → 최솟값 도착.\
**필요한 수학:** 미분·기울기·최적화.\
**등급:** S++

## 28. 과적합 드로잉

점 두 무리가 있다. 학생이 분류 경계를 직접 그린다.\
훈련점 하나하나를 완벽하게 피해가는 괴상한 선 vs 단순한 선.\
새 데이터 공개.\
**질문:** "100점짜리 모델이 왜 더 못할까?"\
**등급:** S++

## 29. 내비게이션 탐색

지도 전체 경로를 보여주지 않는다.\
알고리즘이 교차로를 하나씩 탐색하는 모습을 파동처럼 보여준다.\
학생은 탐색 전략을 선택.\
**필요한 수학:** 그래프·최단경로.\
**등급:** S++

## 30. 쾨니히스베르크

처음에는 실제 도시처럼 보여준다.\
학생이 직접 다리를 걷는다. 실패 반복. 그 후 건물·강·거리 모두 사라지고
**점과 선만 남는다.**\
"문제에 필요 없는 것을 버렸더니 새로운 수학이 태어났다."\
**필요한 수학:** 그래프이론.\
**등급:** S++

## 31. 원근법 해킹

학생에게 평면 화면에 두 개의 같은 크기 사람을 놓게 한다.\
소실점과 투영선을 켜는 순간 뒤쪽 사람이 '커야' 같은 크기로 보이는 이유
발견.\
**필요한 수학:** 투영·닮음·비례.\
**등급:** S++

## 32. 음계의 비밀

건반을 '주파수 간격이 같은 자' 위에 놓으면 음계가 이상하게 벌어진다.\
로그 축으로 바꾸면 옥타브가 규칙적으로 정렬된다.\
**필요한 수학:** 지수·로그·비율.\
**등급:** S++

# 영상과 Lab을 분리하지 않는 설계

앞으로 S++ 콘텐츠는 아래 한 묶음으로 저장한다.

    CONTENT_ID
    교육과정 태그
    핵심 개념
    대표 질문
    콘텐츠 타입
    첫 3초
    학생의 예상 선택
    직관이 깨지는 장면
    30~60초 영상 시놉시스
    정확한 수학 오버레이
    Lab에서 조작할 변수
    Lab의 목표
    발견 후 붙일 수학 용어
    첫 연습문제
    전이 문제
    역사/과학 팩트 검증 필요사항
    필요 에셋
    제작 난이도
    예상 제작시간
    재사용 가능한 컴포넌트

이 구조의 장점은 **영상 아이디어와 웹앱 아이디어가 따로 놀지 않는
것**이다.

# 재사용 가능한 JP Math Lab 엔진

300개의 콘텐츠를 300번 새로 코딩하면 프로젝트가 무너진다.\
따라서 콘텐츠보다 먼저 **재사용 엔진**을 생각해야 한다.

## Engine 1 --- Graph Explorer

점 드래그 / 접선 / 할선 / 넓이 / 극한 / 함수 비교. - 극한 - 미분 -
적분 - 함수 - 경제 그래프 - 통계 일부

## Engine 2 --- Geometry Stage

Three.js 기반 3D 공간 + 카메라 + 벡터 + 빛 + 투영. - 공간벡터 - 정사영 -
평면 - 구 - 원뿔곡선 - 드론 - 게임 그래픽

## Engine 3 --- Probability Lab

반복 시행을 빠르게 시뮬레이션하고 분포를 시각화. - 생일 문제 - 몬티홀 -
동전 - 이항분포 - 표본추출 - 조건부확률

## Engine 4 --- Growth Simulator

시간 / 증가율 / 공비 / 금리 등을 조작. - 지수 - 등비수열 - 복리 - 대출 -
감염 - 바이럴

## Engine 5 --- Network Playground

노드·간선·탐색·전파. - 최단경로 - 오일러 - 네트워크 - AI 일부 - 스케줄링

## Engine 6 --- Data Story Lab

같은 데이터를 다양한 방법으로 표현하고 조작. - 평균/중앙값 - 표본편향 -
그래프 왜곡 - 상관/인과 - A/B 테스트

즉, **140개 아이디어를 140개 앱으로 만드는 것이 아니라 6\~10개의 강력한
엔진 위에 수백 개의 시나리오를 얹는 구조**가 장기적으로 가장 가치 있다.

# 새로운 우선순위 평가식

콘텐츠 제작 우선순위는 단순 재미가 아니라 다음을 각각 5점으로 평가한다.

-   **H --- Hook**: 첫 질문의 힘
-   **V --- Visual**: 영상으로 보여줄 힘
-   **M --- Math Necessity**: 수학이 이야기의 핵심인가
-   **I --- Interaction**: 학생 조작 가능성
-   **T --- Transfer**: 다른 문제로 전이 가능성
-   **R --- Reuse**: 기존 엔진/에셋 재사용성
-   **C --- Cost**: 제작 비용과 시간 (낮을수록 높은 점수)

`JP Value = H + V + M + I + T + R + C`

35점 만점으로 관리한다.

**30점 이상:** 바로 제작 후보\
**26\~29점:** 좋은 후보\
**21\~25점:** 수업 도입/보조 콘텐츠\
**20점 이하:** 아이디어 보관

# v3 최종 방향

JP Math Lab의 진짜 자산은 영상의 개수도, 웹앱의 개수도 아니다.

1.  **질문 데이터베이스**
2.  **Discovery Loop라는 수업 문법**
3.  **재사용 가능한 인터랙션 엔진**
4.  **영상 → 조작 → 개념 → 문제로 이어지는 연결 구조**
5.  **각 콘텐츠의 교육과정 태그와 제작 메타데이터**

이 다섯 가지가 쌓이면 새 단원을 만들 때마다 처음부터 기획할 필요가 없다.

> **좋은 질문을 고른다 → 적합한 엔진을 선택한다 → 시나리오를 입힌다 →
> 영상 훅을 만든다 → 수학을 발견하게 한다.**

이것이 JP Math Lab 콘텐츠 시스템의 v3 구조다.

------------------------------------------------------------------------

# v4 --- 영상에 돈을 쓸 이유: "설명"이 아니라 '경험할 수 없는 순간'을 산다

짧은 생성형 영상에 비용을 지불할 가치가 생기는 기준은 **예쁘기 때문이
아니다.**

> **코드·슬라이드·교실 촬영으로는 만들기 어려운 '세계, 시간, 규모,
> 시점'을 5\~15초 안에 학생에게 실제처럼 경험시키는가?**

이 기준을 통과하지 못하면 유료 생성형 영상을 쓰지 않는다.

## 영상의 역할을 4개로 제한한다

### 1. IMPOSSIBLE CAMERA --- 갈 수 없는 곳으로 데려가기

-   고대 아르키메데스의 작업실
-   우주에서 바라보는 행성 궤도
-   포물면 안으로 들어가 반사되는 전파 따라가기
-   곡선 표면을 현미경처럼 무한 확대
-   데이터/벡터 공간 안을 날아가기

### 2. IMPOSSIBLE SCALE --- 인간이 체감 못 하는 크기 보여주기

-   종이 42번의 두께가 도시 → 지구 → 우주 규모로 성장
-   바이럴/감염이 10명 → 도시 전체로 폭증
-   8자리 비밀번호의 모든 경우가 거대한 공간을 채움
-   무한분할을 극단적 클로즈업으로 체험

### 3. IMPOSSIBLE TIME --- 수백 년/수십 년을 몇 초로 압축

-   로그표 이전과 이후의 계산 세계
-   복리 30년
-   천문 관측의 축적
-   수학 아이디어가 시대를 건너 현대 기술로 변하는 장면

### 4. IMPOSSIBLE WORLD --- 수학 자체를 물리적 세계로 만들기

-   함수 그래프 위를 달리는 롤러코스터
-   손실함수 산맥을 내려가는 AI
-   확률의 여러 미래가 갈라지는 방
-   벡터들이 바람처럼 실제 공간을 밀어내는 세계
-   적분 면적이 실제 액체처럼 차오르는 공간

**이 네 가지가 아니면 우선 코드/실사/이미지/모션그래픽으로 해결한다.**

# Paid Shot Rule

유료 AI 영상 한 컷은 다음 질문 중 최소 3개에 YES여야 한다.

1.  이 장면이 없으면 첫 질문의 힘이 크게 약해지는가?
2.  코드만으로 만들면 '설명 화면'처럼 보이는가?
3.  현실 촬영이 어렵거나 불가능한가?
4.  공간감·빛·인물·시대감이 중요한가?
5.  이 컷을 여러 콘텐츠에서 재사용할 수 있는가?
6.  학생이 이 장면을 기억할 가능성이 높은가?

3개 미만 → **돈 쓰지 않기**\
3\~4개 → **선택적 사용**\
5\~6개 → **Hero Shot 후보**

# 60초 전체를 AI로 만들지 않는다

추천 구조:

-   **0\~6초 HERO SHOT** --- 생성형 영상: 세계에 던져 넣는다.
-   **6\~12초 QUESTION** --- 생성형/실사 + 짧은 질문.
-   **12\~35초 DISCOVERY** --- 코드 기반 정확한 수학.
-   **35\~48초 REVEAL** --- 코드 + 필요시 생성형 영상 한 컷.
-   **48\~60초 HANDOFF** --- JP Math Lab 인터랙션으로 자연스럽게 전환.

즉, 60초 중 유료 생성형 영상은 **6\~15초 정도만 써도 충분하다.**
나머지는 정확성과 재사용성이 높은 코드 기반 장면이 담당한다.

# '돈을 써도 아깝지 않은' Hero Shot 후보 24

## 1. 아르키메데스 --- 촛불 아래 원

어두운 고대 작업실. 양피지 위 원. 손과 컴퍼스. 카메라가 종이 가까이
내려간다. 그 원의 가장자리로 들어가면서 실제 수학 오버레이로 전환.
**유료 가치: 매우 높음**

## 2. 제논 --- 끝나지 않는 복도

문을 향해 달리지만 공간이 계속 절반으로 접히는 초현실적 복도. 코드
화면으로 전환해 거리 합을 계산. **유료 가치: 매우 높음**

## 3. 곡선 위를 걷기

거대한 곡선 표면 위에 사람이 서 있다. 멀리서는 굽었지만 발밑은 평평하다.
카메라가 우주적 거리 → 발밑 극근접으로 이동. **미분/국소선형성 Hero
Shot**

## 4. 순간속도의 정지된 세계

질주하는 자동차 주변 시간이 멈춘다. 빗방울과 먼지가 공중 정지. "멈춘 한
순간의 속도를 어떻게 측정하지?" **미분 Hero Shot**

## 5. 적분의 물

그래프 아래 공간이 실제 거대한 수조처럼 물로 채워진다. 면적이
누적량이라는 감각을 먼저 준다. **적분 Hero Shot**

## 6. 포물면 안으로 들어가는 전파

위성 안테나 위로 떨어지는 빛/전파와 함께 카메라가 날아가 모든 선이
초점으로 모이는 순간을 통과. **기하 Hero Shot**

## 7. 속삭이는 타원 방

거대한 어두운 타원형 홀 양끝에 두 사람. 한 사람의 속삭임이 벽을 따라
빛의 파동처럼 반사. **타원 Hero Shot**

## 8. 원뿔 내부 여행

카메라가 거대한 빛의 원뿔 안으로 진입. 절단 평면이 회전할 때
원→타원→포물선→쌍곡선 세계가 바뀐다. **이차곡선 Hero Shot**

## 9. 측풍 속 착륙

폭풍 속 활주로. 비행기 기수는 비스듬한데 실제 이동은 활주로 방향. 공중에
바람 벡터가 나타나며 코드 인터랙션으로 전환. **벡터 Hero Shot**

## 10. 그림자의 방

보이지 않는 물체가 중앙에 있고 벽에는 거대한 그림자만 움직인다. 빛이
회전하며 서로 다른 투영. **정사영 Hero Shot**

## 11. 종이 42번

종이 두께의 단면을 따라 카메라가 올라간다. 책상 → 건물 → 산 → 대기권 →
우주. **지수 Hero Shot**

## 12. 바이럴 도시

밤의 도시. 처음 한 창문에 불이 켜지고 두 개, 네 개, 수백, 수만 개로
번진다. **등비/지수 Hero Shot**

## 13. 로그 이전의 천문대

촛불 아래 계산표와 숫자에 파묻힌 천문학자. 수많은 곱셈. 화면이 로그표 한
장으로 정리된다. **로그 Hero Shot**

## 14. 복리의 시간

같은 두 사람이 서로 다른 나이에 작은 동전을 넣는다. 시간이 30년을 몇 초
만에 지나며 자산 구조가 뒤집힌다. **경제수학 Hero Shot**

## 15. 확률의 복도

한 선택에서 수백 개의 미래 복도가 갈라진다. 카메라가 그중 하나를
지나가다 위로 올라가 전체 분포를 본다. **확률변수 Hero Shot**

## 16. 생일의 방

빈 어두운 홀에 사람이 한 명씩 들어오며 각자의 날짜가 작은 빛으로 떠
있다. 두 날짜가 처음 겹치는 순간 전체 조명이 반응. **확률 Hero Shot**

## 17. 생존자편향

총알 자국투성이의 폭격기가 어둠 속 격납고로 돌아온다. 카메라가 구멍 없는
엔진 부분을 오래 바라본다. **통계 Hero Shot**

## 18. GPS의 지구

밤의 지구 위 한 사람이 서 있고 위성에서 빛의 구가 하나씩 퍼진다. 교차점
하나만 남는다. **원의 방정식/공간좌표 Hero Shot**

## 19. 복소평면의 탄생

끝없는 수직선 위에서 카메라가 멈춘다. 선이 갈라지며 두 번째 축이 솟고
세계가 평면으로 열린다. **복소수 Hero Shot**

## 20. AI의 의미 공간

어두운 3D 공간에 단어·이미지들이 별처럼 떠 있고 비슷한 것끼리 은하처럼
군집. 카메라가 '의미의 거리'를 여행. **벡터/AI Hero Shot**

## 21. 손실함수 산맥

AI가 거대한 산맥 위 작은 빛으로 존재한다. 정답 위치는 보이지 않고 발밑
경사만 보고 이동. **경사하강 Hero Shot**

## 22. 오일러의 도시가 사라지는 순간

18세기 도시를 걷다가 건물과 강이 서서히 사라지고 다리와 육지만 점·선으로
변한다. **그래프이론 Hero Shot**

## 23. 원근법의 탄생

르네상스 거리에서 카메라가 화가의 캔버스로 이동. 현실의 건물 모서리가
소실점으로 연결되며 평면 그림으로 압축. **투영/닮음 Hero Shot**

## 24. 수학 렌즈

평범한 학교 복도를 걷는다. 카메라가 학생의 '수학 렌즈'를 켜자 계단에는
수열, 공에는 포물선, 창문에는 비율, 사람 움직임에는 벡터가 나타난다.
**JP Math Lab 브랜드 Hero Shot**

# 영상 제작 전 반드시 만드는 3단계

## A. 6초 무음 Animatic

정지 이미지 + 카메라 움직임만으로 질문이 전달되는지 본다. **여기서
약하면 생성형 영상에 돈을 쓰지 않는다.**

## B. Hero Frame

영상에서 가장 기억에 남아야 할 단 한 프레임을 먼저 만든다. Hero Frame이
약하면 프롬프트를 다시 설계한다.

## C. Paid Generation

Hero Frame과 카메라 움직임이 확정된 뒤에만 유료 생성한다. 한 번 생성할
때 "예쁜 영상"이 아니라 **정확한 컷의 역할**을 요구한다.

# 비용을 줄이는 자산화 전략

한 번 돈을 쓴 컷은 한 영상에서 끝내지 않는다.

예: **고대 수학자 작업실 세트** - 아르키메데스 - 무리수 - 원주율 - 고대
기하

**천문대 세트** - 로그 - 삼각함수 - 케플러 - 측량

**미래 데이터 공간 세트** - 벡터 - 행렬 - AI - 그래프 - 확률

**3D 수학 세계 세트** - 미분 - 적분 - 극한 - 함수

같은 세계관/세트를 재사용하면 영상마다 새 세계를 생성하는 비용과 디자인
불일치를 줄일 수 있다.

# JP Math Lab 영상의 브랜드 문법

영상마다 스타일을 새로 만들지 않는다.

공통적으로: - 첫 1초에는 로고 설명 없음 - 자막은 최소화 - 질문은 한
문장 - 수학 용어는 뒤에 등장 - 영상에서 정답을 모두 말하지 않음 - 마지막
장면의 카메라/도형 상태가 Lab 첫 화면과 이어짐 - 생성형 영상의 마지막
프레임과 웹 인터랙션의 첫 프레임을 최대한 동일하게 설계

이 마지막 규칙이 중요하다.

> **영상 속 세계가 갑자기 웹페이지로 끊기는 것이 아니라, 영상이 멈추고
> 학생에게 조작권이 넘어온 것처럼 보여야 한다.**

예: 영상에서 비행기가 측풍 속에서 정지\
→ "네가 착륙시켜봐."\
→ 같은 구도의 Three.js 장면\
→ 학생이 바람/기수 벡터를 조작.

영상에서 아르키메데스의 손이 12각형을 그리려는 순간 정지\
→ Lab\
→ 학생이 직접 12→24→48→96으로 늘림.

이것이 **유료 영상의 가치를 학습 경험으로 회수하는 방법**이다.

# v4 결론

영상에 돈을 쓰는 기준은 화질이 아니다.

**"이 6초가 학생을 수학 문제 안으로 데려다 놓는가?"**

YES라면 생성형 영상은 가치가 있다.

NO라면 아무리 아름다워도 JP Math Lab에는 불필요하다.

따라서 앞으로는 콘텐츠마다 **Hero Shot 1개 + 정확한 수학 장면 + 조작권
이양** 을 기본 단위로 설계한다.

> **영화처럼 시작하고, 게임처럼 넘겨주고, 수학으로 끝낸다.**

------------------------------------------------------------------------

# v5 --- 학생의 감정곡선을 설계한다

지금까지는 - 좋은 질문 - 좋은 장면 - 좋은 인터랙션 - 유료 영상의 가치 를
설계했다.

v5에서는 한 단계 더 들어간다.

> **학생이 어떤 감정을 거쳐야 수학을 '듣는 상태'가 되는가?**

짧은 콘텐츠의 목적은 지식을 전달하는 것이 아니라\
**학생의 인지 상태를 바꾸는 것**이다.

------------------------------------------------------------------------

# 1. JP Math Lab Emotion Curve

가장 이상적인 흐름은 다음과 같다.

## ① 호기심 --- "뭐지?"

익숙한 세계에서 이상한 장면을 하나 던진다.

예: - 자동차는 멈춰 있는데 속도가 있다. - 비행기는 옆을 보고 직진한다. -
10만 명 조사보다 1,000명 조사가 더 정확하다. - 그림자만 보고 3차원
물체를 맞힌다.

이 단계에서 수학 용어를 말하지 않는다.

------------------------------------------------------------------------

## ② 예상 --- "아마 이럴 것 같은데?"

학생에게 **먼저 선택권**을 준다.

중요: 설명을 듣기 전에 반드시 자기 예측을 만든다.

예: - "다음 동전은 앞면/뒷면?" - "50% 할인 후 50% 인상 = 원래 가격?" -
"비행기 기수를 어디로 향하게 할까?" - "생일이 겹칠 확률 20% / 50% /
80%?"

예측이 있어야 이후의 반전이 감정적으로 작동한다.

------------------------------------------------------------------------

## ③ 자신감 --- "이건 알겠는데?"

너무 어렵게 시작하면 학생은 방어적으로 변한다.

따라서 첫 질문은 **수학 실력과 무관하게 답할 수 있는 형태**가 좋다.

좋은 시작: - 선택 - 드래그 - 예상 - 비교 - 직관 판단

나쁜 시작: - 식을 세워라 - 정의를 써라 - 공식을 적용하라

------------------------------------------------------------------------

## ④ 충돌 --- "어? 왜?"

학생의 예상과 실제 결과를 일부러 어긋나게 한다.

이 순간이 가장 중요하다.

콘텐츠 가치가 생기는 지점은 **정답을 알려주는 순간이 아니라, 기존 생각이
흔들리는 순간**이다.

이를 "Prediction Gap"이라고 정의한다.

### Prediction Gap이 강한 콘텐츠

-   몬티홀
-   생일 문제
-   50% 할인 후 인상
-   복리
-   표본편향
-   생존자편향
-   극한
-   벡터 합성

------------------------------------------------------------------------

## ⑤ 통제권 --- "내가 바꿔볼래."

충돌 직후 설명을 시작하면 안 된다.

바로 **조작권**을 넘긴다.

학생이 바꿀 수 있는 것: - 시간 간격 - 빛의 방향 - 벡터의 크기/방향 -
금리 - 표본 크기 - 시행 횟수 - 곡률 - 함수 계수

이 단계에서 학생은 수동적 시청자에서 탐구자로 바뀐다.

------------------------------------------------------------------------

## ⑥ 발견 --- "아, 이게 계속 이렇게 되네."

수학적 패턴을 학생 눈앞에 반복해서 보여준다.

중요: 정답을 문장으로 먼저 설명하지 않는다.

화면에서 - 수치 - 도형 - 그래프 - 움직임 이 동시에 같은 패턴을 말하게
한다.

예: 할선이 접선으로 접근\
숫자도 특정 값으로 접근\
그래프도 같은 변화\
→ 학생이 먼저 규칙을 눈치챈다.

------------------------------------------------------------------------

## ⑦ 명명 --- "아, 이걸 미분이라고 하는구나."

수학 용어는 **발견 뒤에 등장**한다.

"오늘은 미분을 배워보겠습니다"가 아니라

> "방금 네가 한 일을 수학에서는 미분이라고 부른다."

이 문장은 학습의 느낌을 완전히 바꾼다.

------------------------------------------------------------------------

## ⑧ 쾌감 --- "내가 알아냈다."

학생이 스스로 발견했다고 느끼게 해야 한다.

이를 위해 결과 화면은 정답 표시보다 **발견을 강조**한다.

예: - "정답!" 대신 "패턴을 찾았다." - "성공!" 대신 "이제 이유가
보인다." - 점수보다 '내가 바꾼 변수 → 결과'를 시각적으로 기억하게 한다.

------------------------------------------------------------------------

## ⑨ 전이 --- "그럼 이것도?"

가장 좋은 콘텐츠는 마지막에 질문 하나를 더 만든다.

예: 정사영을 이해한 뒤: \> "그럼 태양의 위치가 바뀌면 태양광 패널의 실제
효율도 달라질까?"

미분을 이해한 뒤: \> "그럼 롤러코스터의 가장 가파른 지점은 어디일까?"

확률을 이해한 뒤: \> "그럼 의료검사 결과도 같은 함정이 있을까?"

이 마지막 질문이 다음 학습으로 이어진다.

------------------------------------------------------------------------

# 2. 감정곡선의 시간 배치

## 60초형

0\~4초\
**호기심** - 이상한 장면

4\~8초\
**예상** - 질문 + 선택

8\~13초\
**충돌** - 예상과 다른 결과

13\~18초\
**통제권** - "직접 바꿔보자."

18\~38초\
**조작 + 발견** - 변수 변화 - 패턴 반복

38\~48초\
**명명** - 수학 개념 등장

48\~56초\
**쾌감** - 발견을 한 문장으로 압축

56\~60초\
**전이** - 다음 질문

------------------------------------------------------------------------

# 3. 15초 영상도 가능하다

모든 콘텐츠가 60초일 필요는 없다.

## 15초 Teaser 구조

0\~3초\
이상한 장면

3\~7초\
질문

7\~11초\
반전

11\~15초\
"직접 해보세요."

이후 바로 Lab.

### 예: 벡터

비행기가 활주로를 향해 날고 있다. 그런데 기수는 오른쪽을 본다.

"잘못 날고 있는 걸까?"

바람 벡터 등장.

"직접 착륙시켜 보세요."

끝.

짧을수록 영상 생성 비용도 줄고\
Lab의 가치가 커진다.

------------------------------------------------------------------------

# 4. 모든 콘텐츠에 반전이 필요한 것은 아니다

감정 구조는 최소 4종류로 나눌 수 있다.

## Pattern A --- Surprise

예상 → 틀림 → 왜? - 몬티홀 - 생일 - 할인 - 평균의 함정

## Pattern B --- Mystery

모름 → 단서 → 추적 → 발견 - GPS - 쌍곡선 위치추적 - 정사영 그림자 -
오일러 다리

## Pattern C --- Awe

와 → 어떻게? → 구조 발견 - 아르키메데스 - 종이 42번 - 우주 규모 -
원뿔곡선

## Pattern D --- Challenge

할 수 있을 것 같음 → 실패 → 전략 변경 → 성공 - 측풍 착륙 - 최단경로 -
정사영 퍼즐 - 함수 최적화 - 확률 게임

개념에 맞는 감정 패턴을 고른다.

------------------------------------------------------------------------

# 5. "설명 중독"을 막는 규칙

교사는 이해시키고 싶어서 설명을 빨리 시작하는 경향이 있다.

하지만 이 시스템에서는 다음 규칙을 둔다.

## Rule 1

첫 10초 안에 정의 금지.

## Rule 2

학생이 예측하기 전 정답 금지.

## Rule 3

학생이 한 번 조작하기 전 공식 금지.

## Rule 4

그래프만 보여주지 않는다. 현실 장면 + 수치 + 그래프가 함께 반응해야
한다.

## Rule 5

한 영상에는 핵심 질문 하나만.

## Rule 6

영상에서 완전히 이해시키려 하지 않는다. 영상은 학습의 시작점이다.

------------------------------------------------------------------------

# 6. 좋은 짧은 영상의 진짜 KPI

조회수나 화질만으로 판단하지 않는다.

교육적 관점에서 더 중요한 것은:

### Q1. Stop

학생이 멈춰 보는가?

### Q2. Predict

자기 답을 떠올리는가?

### Q3. Gap

예상과 결과 사이 차이를 느끼는가?

### Q4. Touch

직접 만져보고 싶은가?

### Q5. Notice

패턴을 발견하는가?

### Q6. Name

개념 이름이 자연스럽게 들어오는가?

### Q7. Transfer

다른 상황에 적용해보고 싶은가?

이를 **SPG-TNT 지표**로 관리할 수 있다.

Stop / Predict / Gap / Touch / Notice / Transfer

실제 학생 반응 데이터를 쌓으면 어떤 콘텐츠가 강한지 비교할 수 있다.

------------------------------------------------------------------------

# 7. 영상 비용을 감정 곡선에 연결한다

돈을 쓰는 장면은 정보를 많이 전달하는 장면이 아니라

**감정 변화가 큰 장면**이어야 한다.

가장 돈을 써도 되는 구간:

### A. 호기심 폭발

첫 3\~6초 Hero Shot

### B. 충돌

학생의 직관이 깨지는 장면

### C. Awe Reveal

수학 구조가 거대한 세계처럼 드러나는 순간

반대로 돈을 아껴야 하는 구간:

-   정의
-   공식
-   계산
-   그래프
-   수치
-   정확한 도형

이 부분은 코드가 담당한다.

------------------------------------------------------------------------

# 8. 유료 영상 한 컷의 가치 계산

기존 JP Value에 감정 효과를 추가한다.

## Emotion Value

-   Curiosity 0\~5
-   Prediction 0\~5
-   Surprise 0\~5
-   Agency 0\~5
-   Discovery 0\~5
-   Memory 0\~5

30점 만점.

### 해석

26\~30: Hero Shot 제작 가치 매우 높음\
21\~25: 유료 생성 고려\
16\~20: 저비용/무료 방식 우선\
15 이하: 영상보다 인터랙션에 투자

------------------------------------------------------------------------

# 9. 실제 제작 예시 --- 정사영

## 0\~4초 --- Mystery

어두운 방. 정체불명의 물체는 보이지 않고 벽 그림자만 보인다.

## 4\~7초 --- Predict

"안에 있는 물체는 무엇일까?"

3개 후보를 보여준다.

## 7\~11초 --- Gap

빛이 움직이며 그림자가 전혀 다른 모양으로 바뀐다.

## 11초

영상 정지.

> "빛을 직접 움직여 보세요."

## Lab

학생이 광원을 드래그. 물체를 회전. 투영면을 변경.

## Notice

같은 물체도 방향에 따라 투영 결과가 달라짐.

## Name

"3차원 도형을 한 평면에 내려놓은 이 결과를 정사영이라고 한다."

## Transfer

"그럼 태양광 패널은 왜 방향이 중요할까?"

이 하나의 콘텐츠로 - 공간벡터 - 정사영 - 내적 - 태양광 까지 확장 가능.

------------------------------------------------------------------------

# 10. 실제 제작 예시 --- 미분

## 0\~4초 --- Awe/Mystery

질주 자동차. 시간이 정지한다.

## 4\~7초

"멈춘 이 순간의 속도는?"

## 7\~11초

두 사진으로 평균속도 계산. "하지만 이건 1초 동안의 속도다."

## 11\~15초

"그럼 0.1초라면?"

## Lab

Δt 슬라이더.

1 0.5 0.1 0.01 0.001

할선 → 접선.

## Name

"시간 간격을 0으로 만든 게 아니다. 0에 가까워질 때의 값을 본 것이다."

→ 미분계수.

## Transfer

"그러면 곡선 위 자동차의 방향도 구할 수 있을까?"

------------------------------------------------------------------------

# 11. 실제 제작 예시 --- 조건부확률

## 시작

검사 정확도 99%.

"양성입니다."

## Predict

"질병일 확률은?" 99% / 90% / 50% / 10%

## Gap

10,000명 등장.

유병률 0.1%.

실제 환자와 거짓 양성을 색으로 표시.

예상보다 훨씬 낮은 비율.

## Lab

유병률 / 민감도 / 특이도 슬라이더.

## Name

"우리가 알고 싶었던 것은 P(질병\|양성)이지 P(양성\|질병)가 아니다."

## Transfer

스팸 필터 / 범죄 탐지 / AI 분류.

------------------------------------------------------------------------

# 12. JP Math Lab의 브랜드 감정

모든 콘텐츠가 같은 감정을 줄 필요는 없지만, 사이트 전체가 주는 핵심
감정은 하나여야 한다.

> **"수학은 외우는 것이 아니라, 내가 발견할 수 있는 것이다."**

학생이 JP Math Lab에 들어왔을 때 기대해야 하는 경험:

"이번엔 무슨 이상한 문제가 나오지?" "내 예상이 맞을까?" "한번 움직여
보고 싶다." "아 그래서 이 수학이 필요한 거였구나."

이 기대 자체가 브랜드 자산이 된다.

------------------------------------------------------------------------

# v5 결론

영상의 완성도보다 더 중요한 것은 **감정의 순서**다.

좋은 콘텐츠는

> 궁금하게 만들고\
> 먼저 생각하게 하고\
> 살짝 틀리게 만들고\
> 손을 쓰게 하고\
> 스스로 패턴을 발견하게 하고\
> 마지막에 수학의 이름을 붙여준다.

그래서 JP Math Lab의 가장 중요한 설계 원칙을 다음 한 문장으로 정리한다.

> **정답을 보여주기 전에, 정답이 필요해지는 마음부터 만든다.**

------------------------------------------------------------------------

# v6 --- 최종 방향 재정렬: "1분 안에 하나의 수학적 통찰을 완결한다"

v5까지의 흐름에서 중요한 수정이 필요하다.

JP Math Lab은 영상의 필수 목적지가 아니다. 영상은 **그 자체로 완결된
학습 콘텐츠**여야 한다.

JP Math Lab은 오직 \> "더 만져보고 싶은 학생" \> "숫자를 직접 바꿔보고
싶은 학생" \> "수업에서 확장 탐구를 하고 싶은 학생"

을 위한 선택적 두 번째 층이다.

따라서 앞으로 영상의 기본 질문은 이것이다.

> **"이 영상을 딱 1분만 본 학생이, 1분 뒤 무엇을 새롭게 알고 있어야
> 하는가?"**

------------------------------------------------------------------------

# 1. 영상의 최소 완성 단위는 '개념'이 아니라 '통찰 한 문장'

영상 하나에 많은 것을 넣지 않는다.

예:

## 미분

나쁜 목표: - 평균변화율 - 순간변화율 - 미분계수 - 도함수 - 접선 -
증가감소를 모두 설명

좋은 목표: \> **"순간의 변화는 아주 짧은 구간의 평균변화를 끝없이
좁혀가며 잡아낸다."**

------------------------------------------------------------------------

## 적분

> **"복잡한 전체는 계산 가능한 작은 조각으로 나누고 다시 합쳐서 구할 수
> 있다."**

------------------------------------------------------------------------

## 로그

> **"로그는 큰 곱셈을 쉬운 덧셈으로 바꾸기 위해 탄생한 계산
> 기술이었다."**

------------------------------------------------------------------------

## 정사영

> **"정사영은 3차원의 길이와 모양을 한 방향으로 평면에 눌러 옮기는
> 방법이다."**

------------------------------------------------------------------------

## 내적

> **"내적은 두 방향이 얼마나 같은 쪽을 향하는지를 하나의 숫자로
> 바꾼다."**

------------------------------------------------------------------------

## 조건부확률

> **"A일 때 B일 확률과 B일 때 A일 확률은 서로 다른 질문이다."**

------------------------------------------------------------------------

## 표본

> **"조사의 신뢰도는 사람 수보다 누구를 어떻게 뽑았는지가 더 중요할 수
> 있다."**

------------------------------------------------------------------------

## 지수

> **"같은 양을 더하는 성장과 같은 비율로 커지는 성장은 시간이 지나면
> 완전히 다른 세계를 만든다."**

------------------------------------------------------------------------

# 2. 좋은 1분 영상은 '설명'이 아니라 '증명된 느낌'을 남긴다

학생은 영상을 보고 "그렇대"가 아니라 "아, 그래서 그렇구나"를 느껴야
한다.

그러려면 영상은 통찰 한 문장을 단순히 말하는 것이 아니라 **시각적으로
납득시키는 과정**을 보여줘야 한다.

구조:

### 질문

왜 이런 일이 생기지?

### 문제

기존 방식으로는 해결이 안 된다.

### 아이디어

누군가 관점을 바꾼다.

### 시각적 전개

아이디어가 작동하는 모습을 보여준다.

### 결론

처음 질문에 답한다.

### 한 문장

수학적 통찰을 기억에 남긴다.

------------------------------------------------------------------------

# 3. 60초의 기본 서사 구조

모든 영상을 억지로 동일하게 만들지는 않지만, 기본 문법은 다음이 가장
안정적이다.

## 0\~5초 --- HOOK

수학을 모르는 사람도 궁금한 질문.

## 5\~15초 --- PROBLEM

왜 이 문제가 쉽지 않은지 보여준다.

## 15\~35초 --- IDEA

핵심 수학 아이디어가 등장한다.

## 35\~50초 --- REVEAL

그 아이디어가 실제로 문제를 해결하는 장면.

## 50\~58초 --- INSIGHT

오늘 가져갈 한 문장.

## 58\~60초 --- AFTERTASTE

짧은 여운 또는 다음 질문.

------------------------------------------------------------------------

# 4. 영상은 '정답 전달'보다 '관점 이동'을 보여줘야 한다

가장 가치 있는 수학 콘텐츠는 새 공식을 알려주는 것이 아니라 **문제를
보는 방법이 바뀌는 순간**을 보여주는 콘텐츠다.

예:

### 원의 넓이

"원은 계산하기 어렵다." ↓ "그럼 계산 가능한 다각형으로 바꿔보자."

### 순간속도

"한 순간에는 이동거리가 없다." ↓ "그 순간을 직접 재지 말고 주변 평균을
좁혀가자."

### 로그

"곱셈이 너무 어렵다." ↓ "곱셈을 다른 세계에서 덧셈으로 바꾸자."

### 그래프이론

"도시의 모양이 너무 복잡하다." ↓ "건물과 길을 버리고 연결만 남겨보자."

### 조건부확률

"검사가 99% 정확하다." ↓ "하지만 우리가 묻는 확률의 방향이 반대다."

이 '관점 이동'이 영상의 핵심 사건이다.

------------------------------------------------------------------------

# 5. 유료 AI 영상은 '관점 이동 전후의 세계'를 보여주는 데 쓴다

유료 영상의 가치가 높은 장면은 설명 장면이 아니라 **수학적 아이디어가
등장하기 전과 후의 세계 차이**를 보여주는 장면이다.

예:

## 아르키메데스

전: 원을 바라보며 막막함.

후: 원 위에 다각형들이 겹겹이 생기며 계산 가능한 대상으로 변함.

## 로그

전: 숫자와 계산표에 파묻힌 천문학자.

후: 복잡한 곱셈이 단순한 덧셈으로 접히는 시각적 변환.

## 그래프이론

전: 복잡한 도시.

후: 도시가 사라지고 점과 선만 남음.

## 복소수

전: 수직선 끝에서 더 이상 갈 곳이 없음.

후: 두 번째 축이 솟으며 평면이 열림.

즉 생성형 영상의 역할은 **수학의 '세계관 전환'을 영화적으로 보여주는
것**이다.

------------------------------------------------------------------------

# 6. 1분 영상의 6가지 대표 형식

## A. ORIGIN --- 왜 만들어졌는가

사람과 문제를 따라간다. - 아르키메데스 - 로그 - 확률론 - 그래프이론 -
원근법

핵심 질문: \> "사람들은 왜 이런 수학을 필요로 했을까?"

------------------------------------------------------------------------

## B. MYSTERY --- 어떻게 가능한가

현상을 먼저 보여준다. - GPS - 속삭이는 타원방 - 포물면 안테나 - 쌍곡선
위치추적 - 게임 시야 판정

핵심 질문: \> "도대체 어떻게 알아낸 거지?"

------------------------------------------------------------------------

## C. PARADOX --- 왜 내 직관과 다른가

예상과 결과를 충돌시킨다. - 생일 문제 - 몬티홀 - 0.999... - 50% 할인 후
50% 인상 - 평균의 함정

핵심 질문: \> "분명 이럴 것 같은데 왜 아니지?"

------------------------------------------------------------------------

## D. SCALE --- 인간이 체감 못 하는 크기

-   종이 42번
-   복리 30년
-   지수성장
-   비밀번호 경우의 수
-   무한분할

핵심 질문: \> "작은 차이가 시간이 지나면 얼마나 커질까?"

------------------------------------------------------------------------

## E. LENS --- 평범한 현실에서 수학을 발견

-   농구공의 포물선
-   건물의 원근법
-   그림자의 정사영
-   음악의 로그
-   게임 조명의 내적

핵심 질문: \> "우리가 매일 보는 이 장면 안에 어떤 수학이 숨어 있을까?"

------------------------------------------------------------------------

## F. IDEA --- 한 아이디어의 아름다움

역사나 실생활이 없어도 수학 자체가 강한 경우. - 무한급수 - 미적분
기본정리 - 수학적 귀납법 - 복소평면 - 원뿔곡선

핵심 질문: \> "이 생각 하나가 왜 그렇게 강력할까?"

------------------------------------------------------------------------

# 7. 모든 소재가 1분 영상에 적합한 것은 아니다

좋은 교육 내용과 좋은 짧은 영상은 다르다.

1분 영상으로 만들 가치가 높은 소재는:

### ① 질문이 즉시 이해된다

"멈춘 순간의 속도는?"

### ② 눈으로 보여줄 수 있다

다각형 → 원 할선 → 접선

### ③ 한 번의 관점 이동이 있다

복잡한 도시 → 점과 선

### ④ 결론을 한 문장으로 말할 수 있다

"로그는 곱셈을 덧셈으로 바꾼다."

### ⑤ 1분 안에 충분한 근거를 보여줄 수 있다

이 중 4개 이상을 만족해야 Short Video 후보로 둔다.

그렇지 않은 소재는 - 긴 영상 - 글 - 웹앱 - 수업 활동 쪽으로 보내는 것이
낫다.

------------------------------------------------------------------------

# 8. '1분 안에 끝낼 수 있는가?' 체크리스트

영상 기획 전에 반드시 작성한다.

## Question

처음 5초 질문은 무엇인가?

## Takeaway

60초 뒤 남길 단 한 문장은 무엇인가?

## Obstacle

그 문장을 이해하기 어려운 이유는 무엇인가?

## Pivot

문제를 해결하는 핵심 관점 변화는 무엇인가?

## Visual Proof

말 대신 화면으로 납득시킬 수 있는 장면은 무엇인가?

## Ending

처음 질문에 정확히 답했는가?

이 6개가 명확하지 않으면 제작하지 않는다.

------------------------------------------------------------------------

# 9. '멋있지만 가치 없는 영상'을 걸러내는 기준

## 탈락 1

영상은 멋있는데 보고 나서 배운 것이 없다.

## 탈락 2

내레이션을 빼면 무슨 내용인지 알 수 없다.

## 탈락 3

1분 동안 개념을 세 개 이상 욕심낸다.

## 탈락 4

역사적 인물이 등장하지만 수학적 아이디어와 관계가 약하다.

## 탈락 5

AI 영상이 정확한 수학을 대신하려 한다.

## 탈락 6

마지막이 "더 알아보세요"로 끝나고 본편의 질문에는 답하지 않는다.

특히 6번은 금지한다.

영상은 반드시 **처음 던진 질문에 최소한 하나의 명확한 답을 준다.**

------------------------------------------------------------------------

# 10. JP Math Lab과의 정확한 관계

앞으로 구조는:

## 1차 콘텐츠

### 완결형 1분 영상

영상을 본 것만으로 하나를 이해한다.

그리고 선택적으로:

## 2차 콘텐츠

### Explore More

"직접 숫자를 바꿔보고 싶다면" "직접 96각형까지 늘려보고 싶다면" "직접
바람 방향을 바꿔보고 싶다면"

JP Math Lab으로 연결.

즉 Lab은 **영상의 결말이 아니라 영상의 확장 기능**이다.

------------------------------------------------------------------------

# 11. 1분 영상 대표 설계 예시 8개

## ① 미분 --- 순간속도

### Hook

"멈춘 한 순간의 속도를 어떻게 측정할까?"

### Problem

두 시점으로 계산하면 평균속도일 뿐이다.

### Idea

시간 간격을 계속 줄인다.

### Visual

1초 → 0.1초 → 0.01초. 할선이 접선으로 변한다.

### Takeaway

> **"순간변화율은 아주 짧은 구간의 평균변화를 한없이 좁혀 얻는다."**

### 60초 안에서 완결

YES.

------------------------------------------------------------------------

## ② 로그 --- 계산을 바꾼 발명

### Hook

"계산기 없이 8자리 곱셈을 수천 번 해야 한다면?"

### Problem

옛 천문 계산.

### Idea

곱셈을 덧셈으로 바꾸는 대응표.

### Reveal

123×456 → 로그값의 합 → 원래 수.

### Takeaway

> **"로그는 곱셈을 덧셈으로 바꾸기 위해 만들어진 계산의 지름길이었다."**

------------------------------------------------------------------------

## ③ 정사영 --- 그림자

### Hook

"3차원 물체를 종이 한 장에 정확히 옮길 수 있을까?"

### Problem

보는 방향에 따라 모양이 달라진다.

### Idea

한 방향으로 모두 눌러 평면에 내린다.

### Reveal

입체 → 평행한 선 → 평면 도형.

### Takeaway

> **"정사영은 3차원의 정보를 한 방향으로 평면에 옮긴 것이다."**

------------------------------------------------------------------------

## ④ 내적 --- 게임의 시야

### Hook

"게임 캐릭터는 눈도 없는데 적이 앞에 있는지 어떻게 알까?"

### Problem

거리만으로는 앞/뒤를 모른다.

### Idea

시선 방향과 적 방향을 비교한다.

### Reveal

각도 작음 → 양의 큰 값. 90도 → 0. 뒤 → 음수.

### Takeaway

> **"내적은 두 방향이 얼마나 같은 쪽을 향하는지를 숫자로 만든다."**

------------------------------------------------------------------------

## ⑤ 생일 문제

### Hook

"23명 중 생일이 같은 두 사람이 있을 확률은?"

### 예상

매우 낮아 보인다.

### Idea

'내 생일과 같은 사람'이 아니라 '모든 두 사람의 쌍'을 생각한다.

### Reveal

비교해야 할 쌍이 급격히 늘어난다.

### Takeaway

> **"확률은 사건 하나보다 가능한 비교의 수가 얼마나 빨리 늘어나는지가
> 중요할 때가 있다."**

------------------------------------------------------------------------

## ⑥ 그래프이론

### Hook

"이 도시의 모든 다리를 한 번씩만 건널 수 있을까?"

### Problem

실제 지도를 보고 계속 길을 찾는다.

### Idea

도시 모양을 버린다.

### Reveal

육지 → 점. 다리 → 선.

### Takeaway

> **"문제에 필요 없는 정보를 버리고 연결만 남기자 그래프이론이
> 시작됐다."**

------------------------------------------------------------------------

## ⑦ 복리

### Hook

"연 7%는 정말 작은 숫자일까?"

### Problem

1년 차이는 작다.

### Visual

1년 → 10년 → 20년 → 30년.

### Reveal

선형 증가와 지수 증가가 크게 갈라진다.

### Takeaway

> **"복리는 돈이 아니라 이전에 불어난 돈까지 다시 성장시키기 때문에
> 시간이 가장 강력한 변수가 된다."**

------------------------------------------------------------------------

## ⑧ 원뿔곡선

### Hook

"원·타원·포물선·쌍곡선은 왜 한 가족일까?"

### Idea

하나의 원뿔을 자르는 평면만 바꾼다.

### Visual

평면 회전 → 네 곡선이 순서대로 등장.

### Takeaway

> **"네 곡선은 서로 다른 도형이 아니라 하나의 원뿔을 자르는 방식이 만든
> 네 얼굴이다."**

------------------------------------------------------------------------

# 12. 앞으로 아이디어 뱅크의 구조도 바꾼다

기존: 과목 / 개념 / Hook / Lab

앞으로: 과목\
→ 개념\
→ **60초 질문**\
→ **60초 Takeaway**\
→ 문제\
→ 관점 이동\
→ 핵심 장면\
→ 영상 형식\
→ Hero Shot\
→ 정확한 코드 장면\
→ 역사 검증\
→ 선택적 Lab 확장\
→ 제작비 가치

이렇게 관리한다.

------------------------------------------------------------------------

# 13. 콘텐츠 우선순위 v6

영상 제작 우선순위는 다음 7개 항목을 각각 5점으로 평가한다.

### H --- Hook

첫 5초가 강한가?

### T --- Takeaway

남길 한 문장이 강한가?

### P --- Pivot

관점 이동이 있는가?

### V --- Visual Proof

말보다 화면으로 설명 가능한가?

### C --- Closure

60초 안에 처음 질문을 완결할 수 있는가?

### M --- Memory

하루 뒤에도 장면/아이디어가 남을 가능성이 높은가?

### \$ --- Paid Value

생성형 영상에 비용을 써서 얻는 가치가 큰가?

총 35점.

-   31\~35: **S++ --- 바로 영상화**
-   27\~30: **S --- 강력한 후보**
-   23\~26: **A --- 보강 후 제작**
-   22 이하: 영상 외 형식 검토

------------------------------------------------------------------------

# 14. 가장 중요한 최종 원칙 10

1.  **영상 하나에는 통찰 하나만.**
2.  **첫 질문은 수학을 몰라도 이해할 수 있어야 한다.**
3.  **영상은 처음 질문에 반드시 답한다.**
4.  **수학의 이름보다 수학이 필요했던 이유를 먼저 보여준다.**
5.  **공식보다 관점 이동을 보여준다.**
6.  **말할 수 있는 것은 가능하면 화면으로 보여준다.**
7.  **AI는 세계와 감정을 만들고, 코드는 정확한 수학을 만든다.**
8.  **역사는 장식이 아니라 수학적 아이디어가 탄생한 이유일 때만
    사용한다.**
9.  **JP Math Lab 없이도 영상은 완결되어야 한다.**
10. **60초 뒤 학생 머릿속에 남을 한 문장을 먼저 쓰고 제작을 시작한다.**

------------------------------------------------------------------------

# v6 핵심 선언

JP Math Lab 영상 프로젝트의 목적은 '수학을 재미있게 보이게 하는 것'이
아니다.

> **한 번도 생각해보지 않았던 질문을 던지고,\
> 60초 안에 그 질문을 바라보는 새로운 수학적 관점 하나를 학생에게 남기는
> 것.**

좋은 영상은 수학을 많이 가르치는 영상이 아니다.

> **하나의 아이디어를 잊기 어렵게 만드는 영상이다.**

그리고 제작비를 지불할 가치가 있는 영상은

> **교과서의 한 문장을 영화적 장면과 정확한 수학적 시각화로 바꾸어,\
> 학생이 '외운 것'이 아니라 '이해한 장면'으로 기억하게 만드는
> 영상이다.**


---

# v7 — 영상제작시스템: "영화처럼 보여야 한다"보다 "계속 궁금해야 한다"

> 업데이트: 2026-08-30  
> 이 장은 v1~v6의 아이디어를 삭제하지 않고, 실제 1분 영상 제작·자동화·YouTube 운영까지 연결하기 위해 추가한다.

## 0. v7 한 문장

> **강한 질문으로 붙잡고, 화면에서 5초마다 새로운 일이 일어나게 하며, 60초 안에 하나의 수학적 발견을 완결한다.**

v6의 "한 영상 = 한 통찰" 원칙은 유지한다.  
v7에서 달라지는 것은 **그 통찰을 끝까지 보게 만드는 화면의 리듬과 실제 제작 시스템**이다.

---

# 1. 가장 큰 방향 수정

처음에는 "영화 같은 수학 영상"을 강하게 상상했다. 그러나 60초 전체를 영화처럼 유지하려 하면 제작 난도가 급격히 올라간다.

따라서 목표를 다음처럼 바꾼다.

### 이전에 위험했던 생각
생성형 영상으로 영화적 몰입 → 수학 설명 화면 → 영화적 엔딩

### v7
**시각적 Hook → 계속 변하는 수학 → 결정적 발견 → 짧고 명확한 결론**

영화적 장면은 학생을 처음 붙잡는 강력한 도구이지만, 영상 전체의 필수 조건은 아니다.

학생이 계속 보는 이유는 "영화 같아서"만이 아니라,

- 다음 숫자가 어떻게 변할지
- 두 점이 어디까지 가까워질지
- 틈이 정말 사라질지
- 예상이 맞는지
- 선택을 바꾸면 결과가 달라지는지
- 마지막에 무엇이 드러날지

가 궁금하기 때문이다.

> **수학이 나와서 이탈하는 것이 아니라, 화면에서 더 이상 궁금한 일이 일어나지 않을 때 이탈한다.**

---

# 2. 5초 변화 규칙 — v7의 핵심 제작 규칙

## Five-Second Change Rule

**약 5초마다 화면에서 의미 있는 변화가 하나 이상 일어나야 한다.**

변화의 종류:

1. 물체가 움직인다.
2. 카메라가 확대/축소/이동한다.
3. 숫자가 변한다.
4. 비교 대상이 등장한다.
5. 예상이 깨진다.
6. 선택지가 주어진다.
7. 결과가 공개된다.
8. 공간/스케일이 바뀐다.
9. 그래프·도형의 형태가 변한다.
10. 현실 장면 위에 수학적 구조가 드러난다.

단, 변화 자체를 위한 현란한 편집은 금지한다.  
모든 변화는 **질문 → 발견**을 전진시켜야 한다.

### 추가 규칙

- 10초 이상 같은 설명 상태를 유지하지 않는다.
- 공식만 떠 있는 정지 화면을 만들지 않는다.
- 그래프가 나오면 그래프의 어떤 요소가 반드시 움직이거나 비교되어야 한다.
- 수학 용어는 학생이 현상을 본 뒤 붙인다.
- 다음 장면을 보고 싶은 이유가 없는 구간은 다시 설계한다.

---

# 3. 60초 표준 리듬 v7

| 시간 | 역할 | 학생 머릿속 |
|---|---|---|
| 0–5초 | Hook | "뭐지?" |
| 5–15초 | Problem / Prediction | "나는 이렇게 될 것 같은데?" |
| 15–40초 | Moving Math | "어? 계속 변하네." |
| 40–52초 | Reveal / Pivot | "아! 이렇게 보는 거구나." |
| 52–60초 | Insight | "그래서 이 수학이 필요한 거였네." |

이 시간은 고정 템플릿이 아니라 기본 리듬이다. 소재에 따라 조정한다.

---

# 4. 영화 → 수학 전환 문제를 해결하는 법

가장 피해야 할 장면:

> 멋진 생성형 영상 6초 → 흰 배경 → 공식 → 교과서식 설명

이 순간 학생은 "이제 수업이구나"라고 느낄 수 있다.

따라서 전환은 가능한 한 다음 세 방식 중 하나를 사용한다.

## A. Object Match

현실 속 물체를 그대로 수학적 대상으로 바꾼다.

- 양피지의 원 → 정확한 코드 원
- 건물의 그림자 → 정사영 도형
- 자동차의 이동 → 위치-시간 그래프
- 위성 접시 → 포물선
- 게임 캐릭터의 시선 → 방향벡터

## B. Overlay Reveal

현실 화면은 유지하고 수학이 그 위에 나타난다.

- 실제 건물 위에 벡터
- 도로 위에 좌표
- 사람 사이에 네트워크 edge
- 게임 화면 위에 내적 값
- 설문 화면 위에 표본 편향 표시

## C. Dive Into Math

카메라가 현실의 한 대상 속으로 들어가며 Math World로 전환한다.

- 원의 가장자리로 줌인
- 종이 두께 속으로 진입
- 그래프의 한 점으로 확대
- 픽셀 하나 속으로 진입
- 확률 선택 순간 여러 미래로 분기

전환 자체가 복잡한 영화 VFX일 필요는 없다.  
**같은 위치·같은 모양·같은 움직임을 이어 붙이는 것만으로도 충분하다.**

---

# 5. 생성형 영상의 역할 — Grok 우선 테스트

## 원칙

생성형 영상은 **정확한 수학을 그리는 도구가 아니다.**

### 맡길 것
- 시대와 공간
- 인물
- 분위기
- 자연
- 건축
- 우주
- 게임풍 세계
- 카메라 움직임
- 현실에서 촬영하기 어려운 스케일

### 맡기지 않을 것
- 정확한 함수 그래프
- 정확한 다각형
- 정확한 벡터
- 정확한 숫자
- 정확한 좌표
- 증명 과정
- 수식 타이포그래피

## 현재 테스트 전략

Grok을 우선 Hero Shot 생성기로 시험한다.

- 480p급 결과도 **5–8초의 분위기/현실 컷**이라면 우선 실전 테스트한다.
- 최종 영상은 1080×1920으로 제작한다.
- 자막과 수학 그래픽은 처음부터 네이티브 1080p로 만든다.
- 생성형 영상은 업스케일 후 필요하면 약한 샤프닝/그레인을 적용한다.
- 480p가 실제 휴대폰 Shorts에서 거슬릴 때만 720p 이상으로 올린다.
- 생성형 영상의 비중은 첫 프로토타입에서 전체의 약 10–20%부터 시작한다.

> **해상도는 샘플 프레임으로 판단하지 않고 완성된 60초 영상에서 판단한다.**

## 생성기 교체 가능 구조

제작 시스템에서 영상 생성기는 고정하지 않는다.

`generator = grok`

을 기본으로 시작하되 필요하면 향후 다른 생성기로 교체할 수 있게 한다.

콘텐츠 DB와 수학 렌더러, TTS, 편집, YouTube 업로드는 생성기와 분리한다.

---

# 6. 수학 장면은 "설명 화면"이 아니라 두 번째 특수효과다

수학 장면의 목표는 영화적 사실성이 아니다.

> **학생이 변화의 끝을 보고 싶게 만드는 것.**

예:

### 아르키메데스
6각형 → 12 → 24 → 48 → 96  
원의 가장자리 확대 → 틈 감소 → 수치 수렴 → 안팎에서 π를 가둠

### 미분
두 점 → 할선 → 두 점 접근 → 할선 회전 → 접선

### 지수
1 → 2 → 4 → 8 → 16 → 인간이 체감할 수 없는 스케일까지 상승

### 조건부확률
전체 집단 → 실제 환자 → 양성 집단 → 거짓 양성 등장 → 직관 반전

### 정사영
3D 길이 → 빛의 방향 변화 → 그림자 변화 → 벡터 성분만 남김

### 그래프 이론
복잡한 도시 지도 → 길의 모양 삭제 → 점과 선만 남음 → 문제 해결

수학 애니메이션의 핵심 연출 도구는 거창하지 않다.

- 줌
- 이동
- 변형
- 누적
- 비교
- 강조
- 숫자 카운트
- 레이어 등장/소멸
- 카메라 시점 변경

이 정도를 높은 완성도로 반복 사용한다.

---

# 7. 콘텐츠 형식은 소재가 결정한다

모든 영상을 역사 다큐처럼 만들지 않는다.

| 소재 | 적합한 연출 |
|---|---|
| 아르키메데스, 로그 | 역사 미스터리 |
| 순간속도 | 추적/측정 |
| 생일 문제, 몬티홀 | 확률 게임 |
| 내적 | 게임 판정 |
| 정사영 | 건축/빛 실험 |
| 지수 | 스케일 쇼 |
| GPS | 위치 추적 미스터리 |
| 그래프 이론 | 도시 퍼즐 |
| AI 벡터 | 데이터 공간 탐험 |
| 복리 | 시간 여행/경제 시뮬레이션 |

따라서 채널의 통일성은 "모든 영상이 같은 영화 스타일"에서 만들지 않는다.

통일성은 다음에서 만든다.

- 질문 문법
- 자막 디자인
- 내레이션 톤
- 수학 그래픽 디자인
- 발견의 리듬
- 엔딩 Takeaway
- 썸네일 디자인

---

# 8. 실제 자동 제작 파이프라인

```text
IDEA BANK
   ↓
주제 선택
   ↓
60초 설계
Question / Takeaway / Obstacle / Pivot / Visual Proof
   ↓
장면표 + 내레이션
   ↓
생성형 Hero Shot
   ↓
정확한 수학 렌더
   ↓
TTS
   ↓
자막
   ↓
BGM / SFX
   ↓
FFmpeg 합성
   ↓
1080×1920 최종 영상
   ↓
썸네일
   ↓
제목 / 설명 / 태그
   ↓
YouTube 비공개 업로드
   ↓
사람 검수
   ↓
공개
```

## 자동화 가능한 것

- 대본 초안
- 장면표
- 생성형 영상 프롬프트
- 수학 렌더 파라미터
- TTS 생성
- TTS 타이밍 기반 자막
- 자막 스타일 적용
- BGM/SFX 배치 규칙
- FFmpeg 편집
- Hero Shot 프레임 추출
- 썸네일 타이포그래피
- 제목/설명/태그 후보
- YouTube 비공개 업로드

## 사람이 반드시 검수할 것

1. 수학적으로 정확한가?
2. 역사/과학 사실이 정확한가?
3. 60초 안에 처음 질문에 답했는가?
4. 이번 영상만의 통찰이 있는가?
5. 다른 영상의 템플릿 복제품처럼 보이지 않는가?
6. 음악·음성·이미지·영상의 상업 이용 권리가 확인되었는가?

---

# 9. TTS · 자막 · 썸네일 원칙

## TTS

같은 화자를 지속 사용해 채널의 "고정 내레이터"처럼 느끼게 한다.

대본은 글 읽기용 문장이 아니라 **듣기 좋은 짧은 문장**으로 쓴다.

## 자막

전체 대본을 화면 가득 적지 않는다.

- 한 화면 한 메시지
- 핵심 숫자와 단어 강조
- 수학 그래픽을 가리지 않음
- TTS 타이밍과 동기화
- 9:16 모바일 안전영역 고려

## 썸네일

생성 AI에게 글자까지 맡기지 않는다.

**Hero Shot/대표 프레임 + 코드 기반 정확한 한글 타이포그래피**를 기본으로 한다.

문구는 설명이 아니라 질문/긴장감을 만든다.

예:
- `π도 없던 시대`
- `한 순간의 속도?`
- `99% 정확한데 틀린다?`
- `42번이면 달까지?`

---

# 10. YouTube 수익화 관점의 제작 원칙

AI 사용 자체를 피하는 것이 목표가 아니다.

피해야 할 것은 **교육적 차이가 거의 없는 대량 템플릿 콘텐츠**다.

따라서:

- 영상마다 Question과 Takeaway가 달라야 한다.
- 수학적 Visual Proof가 달라야 한다.
- 동일한 Hero Shot 구조를 기계적으로 반복하지 않는다.
- 자동화는 제작 노동을 줄이는 데 쓰고, 콘텐츠의 사고까지 동일하게 복제하지 않는다.
- 현실적으로 보이는 합성/생성 콘텐츠는 플랫폼의 관련 표시 정책을 따른다.
- 최종 공개 전 사람 검수 단계를 둔다.

---

# 11. v7 콘텐츠 레코드 — 제작 DB 표준

앞으로 하나의 아이디어는 다음 구조로 저장한다.

```yaml
CONTENT_ID: CALC_001
COURSE: 미적분Ⅰ
CONCEPT: 순간변화율
QUESTION: 멈춘 한 순간의 속도를 어떻게 측정할까?
TAKEAWAY: 순간의 변화는 주변 평균변화를 계속 좁혀 잡아낸다.
FORMAT: Mystery
OBSTACLE: 한 순간에는 시간 간격이 없어 평균속도를 바로 계산할 수 없다.
PREDICTION_GAP: 학생은 속도계가 그냥 순간속도를 직접 측정한다고 생각하기 쉽다.
PIVOT: 한 순간을 직접 재지 않고 주변 두 시점의 간격을 계속 줄인다.
VISUAL_PROOF: secant_to_tangent
FIVE_SECOND_CHANGES:
  - 자동차 정지
  - 두 시점 표시
  - 시간 간격 감소
  - 할선 회전
  - 접선 등장
  - 순간변화율 명명
GEN_VIDEO:
  needed: true
  role: opening_world
  target_seconds: 5
  low_res_test: true
MATH_RENDER:
  native_resolution: 1080x1920
  reusable_engine: Graph Explorer
TTS: fixed_channel_voice
SUBTITLE: JP_SHORTS_V1
THUMBNAIL: frozen_car_plus_question
FACT_CHECK: required
LAB: optional
AUTOMATION_DIFFICULTY: medium
STATUS: idea
```

---

# 12. 새 우선순위 평가식 v7

각 항목 5점, 총 40점.

| 코드 | 평가 |
|---|---|
| H | Hook — 3초 안에 질문이 이해되는가 |
| T | Takeaway — 1분 뒤 남는 문장이 강한가 |
| P | Pivot — 관점 이동이 있는가 |
| V | Visual Proof — 말보다 화면으로 증명 가능한가 |
| R | Rhythm — 5초마다 의미 있는 변화가 가능한가 |
| C | Closure — 처음 질문에 명확히 답하는가 |
| M | Memory — 장면으로 기억될 가능성이 높은가 |
| A | Automation — 반복 제작 시스템에 넣기 좋은가 |

- **35–40: S++** — 첫 제작군
- **31–34: S** — 강한 제작 후보
- **27–30: A** — 연출 보강 후 제작
- **26 이하: 보류/재설계**

별도로 `GEN_COST`와 `FACT_RISK`를 기록한다. 점수에는 섞지 않는다.

---

# 13. 아르키메데스 첫 프로토타입 v7

## Question
**"π도 계산기도 없던 시대, 원의 둘레를 어떻게 계산했을까?"**

## Takeaway
**"곡선을 직접 계산하기 어렵다면, 계산 가능한 직선 도형으로 가까이 가며 값을 가둘 수 있다."**

## 60초 장면

### 0–5초 — Hook
생성형 영상. 어두운 고대 작업실, 양피지, 원, 컴퍼스.

내레이션:
"π도 계산기도 없던 시대, 원의 둘레를 어떻게 계산했을까?"

### 5–10초 — Pivot 시작
양피지의 원 위치를 맞춰 정확한 코드 원으로 전환.

6각형 등장.

`3.0000`

내레이션:
"아르키메데스는 원부터 계산하지 않았다."

### 10–18초 — 첫 발견
원의 한 모서리로 확대.

원과 6각형 사이의 틈을 보여준다.

12각형으로 변하며 틈 감소.

### 18–30초 — Moving Math
`12 → 24 → 48 → 96`

같은 부분을 계속 확대해 직선 조각이 원에 가까워지는 모습을 보여준다.

### 30–40초 — 숫자도 따라간다
대표 근삿값이 한 방향으로 모이는 모습을 시각화한다.

주의: 영상의 수치는 역사적 계산과 현대적 단순 근사값을 혼동하지 않게 제작 전 검증한다.

### 40–50초 — 진짜 Reveal
내접·외접 다각형을 동시에 보여준다.

역사적으로 알려진 아르키메데스의 경계:

`223/71 < π < 22/7`

즉 약

`3.140845... < π < 3.142857...`

원 하나를 **안과 밖에서 가둔다.**

### 50–58초 — Insight
다각형이 점점 원처럼 보이고 다시 완전한 원만 남는다.

"계산하기 어려운 곡선을, 계산 가능한 것들로 점점 더 가까이 간다."

### 58–60초 — Aftertaste
"훗날 극한과 적분으로 이어지는 생각이다."

JP Math Lab 연결은 선택적 Explore More로 둔다.

---

# 14. 첫 프로토타입에서 반드시 측정할 것

아르키메데스 한 편을 만든 뒤 다음을 기록한다.

- 생성형 영상 총 사용 초
- 생성 횟수
- 쓸 수 있었던 생성 결과 비율
- 480p → 1080p 업스케일 체감 품질
- 모바일 전체화면에서 화질이 거슬리는지
- 수학 렌더 제작 시간
- TTS 제작 시간
- 자막 자동화 성공률
- 최종 편집 시간
- 썸네일 제작 시간
- 한 편 총비용
- 사람이 실제로 손댄 시간
- 5초 변화 규칙이 지켜졌는지
- 영화 → 수학 전환에서 몰입이 깨지는지

이 데이터로 2편부터 자동화 수준을 결정한다.

---

# 15. 2022 개정 교육과정 아이디어뱅크 보완 트랙

기존 v1~v6의 핵심 아이디어는 공통수학1·2, 대수, 미적분Ⅰ, 확률과 통계, 기하, 미적분Ⅱ, 경제 수학, 인공지능 수학, 이산수학, 수학과 문화, 실용 통계, 수학과제 탐구, 직무 수학 중심이었다.

v7에서는 누락되었던 과목군도 **아이디어 탐색 트랙**에 포함한다. 아래는 제작 아이디어 후보이며, 실제 성취기준 코드와 세부 내용 연결은 제작 전 공식 교육과정 원문으로 재검증한다.

## 기본수학1 — 접근성 높은 생활 수학

| 주제 | 60초 질문 | 핵심 장면 |
|---|---|---|
| 식과 계산 | 긴 계산은 왜 묶는 순서만 바꿔도 쉬워질까? | 계산 블록 재배열 |
| 방정식 | 저울 한쪽의 값을 모른다면 어떻게 찾을까? | 실제 저울 → 등식 |
| 부등식 | "최소"와 "최대"는 왜 답이 하나가 아닐까? | 허용 구간 확장 |
| 좌표 | 지도에서 주소 없이 위치를 숫자로 말할 수 있을까? | 도시 → 좌표평면 |
| 함수 | 자판기는 왜 함수처럼 생각할 수 있을까? | 입력→출력 |
| 경우의 수 | 비밀번호 네 자리에는 정말 몇 개의 세계가 있을까? | 조합 폭발 |
| 비율 | 50% 할인 후 50% 인상하면 원래 가격일까? | 가격 막대 반전 |
| 데이터 | 평균 하나만 보고 반 전체를 알 수 있을까? | 같은 평균 다른 분포 |

## 기본수학2 — 변화·도형·자료의 직관

| 주제 | 60초 질문 | 핵심 장면 |
|---|---|---|
| 그래프 | 같은 이야기를 그래프로 바꾸면 무엇이 보일까? | 상황→그래프 |
| 변화 | 속도계 숫자는 왜 계속 바뀔까? | 위치→변화 |
| 도형 | 피자를 정확히 반으로 자르는 선은 몇 개일까? | 대칭/분할 |
| 거리 | 지도에서 가장 가까운 곳은 어떻게 찾을까? | 거리 원 확장 |
| 닮음 | 사진 한 장으로 건물 높이를 잴 수 있을까? | 그림자/닮음 |
| 확률 | 동전 10번이면 앞면이 꼭 5번 나올까? | 반복 실험 |
| 표본 | 반 친구 3명에게 물어본 결과를 믿어도 될까? | 표본 변화 |
| 최적화 직관 | 같은 끈으로 가장 넓은 공간을 만들 수 있을까? | 도형 변형 |

## 전문 수학 — 모델링과 연결의 심화

| 주제 | 60초 질문 | 핵심 장면 |
|---|---|---|
| 모델 | 현실을 수식으로 바꾸면 무엇을 버려야 할까? | 현실→변수 |
| 근사 | 정확한 답보다 좋은 근사가 더 유용할 때가 있을까? | 오차 축소 |
| 수치 계산 | 컴퓨터는 답을 모른 채 어떻게 답에 가까워질까? | 반복법 |
| 변화 모델 | 전염은 왜 처음엔 느리다가 폭발할까? | 성장 곡선 |
| 최적화 | 수천 개 선택지에서 최선을 어떻게 찾을까? | 탐색 지형 |
| 불확실성 | 예측값 하나보다 범위가 더 정직한 이유는? | 예측 구간 |
| 네트워크 | 연결 몇 개가 전체 시스템을 바꿀 수 있을까? | 네트워크 붕괴 |
| 시뮬레이션 | 현실에서 못 하는 실험을 수학으로 할 수 있을까? | 가상 실험 |

## 고급 기하 — 공간을 보는 새로운 눈

| 주제 | 60초 질문 | 핵심 장면 |
|---|---|---|
| 공간벡터 | 3차원에서 "같은 방향"을 숫자로 판단할 수 있을까? | 벡터 회전 |
| 평면 | 점 세 개가 왜 하나의 평면을 결정할까? | 3점→평면 |
| 거리 | 우주에서 점과 평면 사이 최단거리는? | 수선 낙하 |
| 투영 | 3D 물체의 정보를 2D 그림자에 얼마나 남길 수 있을까? | 카메라 투영 |
| 회전 | 물체를 돌렸는데 왜 길이는 그대로일까? | 3D 회전 |
| 곡면 | 지구 위 최단길은 왜 지도에서 휘어 보일까? | 구면 경로 |
| 좌표계 | 같은 점인데 좌표가 달라질 수 있을까? | 축 회전 |
| 컴퓨터 그래픽 | 게임 카메라는 3D를 어떻게 화면에 눌러 담을까? | 월드→스크린 |

## 고급 대수 — 구조와 변환

| 주제 | 60초 질문 | 핵심 장면 |
|---|---|---|
| 행렬 변환 | 숫자 표 하나가 그림을 회전시킬 수 있을까? | 격자 변환 |
| 역변환 | 찌그러진 그림을 원래대로 되돌릴 수 있을까? | 변환 역재생 |
| 연립 시스템 | 수백 개 조건을 동시에 만족시키는 값을 어떻게 찾을까? | 평면 교차 |
| 고유방향 | 변환해도 방향이 바뀌지 않는 특별한 화살표가 있을까? | 벡터 변환 |
| 복소평면 | √-1을 그리면 회전이 된다고? | 실수선→평면 |
| 대칭 | 서로 다른 모양 속에 같은 구조가 숨어 있을까? | 변환 반복 |
| 수열 구조 | 반복 규칙만으로 복잡한 패턴이 생길 수 있을까? | 재귀 성장 |
| 암호 | 숫자의 구조가 비밀을 잠글 수 있을까? | 키/변환 |

## 고급 미적분 — 변화와 누적의 심화

| 주제 | 60초 질문 | 핵심 장면 |
|---|---|---|
| 무한급수 | 끝없이 더했는데 유한한 값이 될 수 있을까? | 조각 누적 |
| 테일러 관점 | 복잡한 곡선을 다항식으로 흉내 낼 수 있을까? | 근사 차수 증가 |
| 미분방정식 | 미래의 값이 아니라 "변하는 법"만 알면 미래를 그릴 수 있을까? | 기울기장 |
| 다변수 변화 | 산 위에서 가장 가파른 방향은 어떻게 찾을까? | 지형+gradient |
| 편미분 | 변수가 여러 개면 하나만 바꿔 볼 수 있을까? | 축별 변화 |
| 다중 적분 | 부피가 들쭉날쭉한 물체를 어떻게 합칠까? | 작은 기둥 누적 |
| 벡터장 | 보이지 않는 바람을 수학으로 볼 수 있을까? | 화살표장 |
| 최적화 | 산의 가장 낮은 곳을 눈을 감고 찾아갈 수 있을까? | gradient descent |

---

# 16. v7에서 우선 실험할 제작 후보

## 1차 프로토타입
**아르키메데스와 π**

검증 목표:
- 생성형 영상 저해상도 허용 범위
- 현실 → 수학 전환
- 5초 변화 규칙
- TTS/자막/음악/FFmpeg 전체 파이프라인

## 그다음 후보

1. 순간속도 — 두 점이 접선이 되는 순간
2. 생일 문제 — 사람이 늘어날수록 직관이 무너지는 확률
3. 게임 시야와 내적 — 캐릭터는 적이 앞에 있는지 어떻게 아는가
4. 종이 42번 — 지수적 성장의 스케일
5. 정사영 — 3D 길이가 그림자로 바뀌는 과정
6. GPS — 거리만으로 위치를 찾는 방법
7. 조건부확률 — 99% 정확한 검사에서도 생기는 반전
8. 로그 — 곱셈을 덧셈으로 바꾼 계산 기술
9. 쾨니히스베르크 — 도시를 점과 선으로 바꾸는 순간
10. 포물선 — 위성 접시가 신호를 한 점에 모으는 이유

---

# 17. v7 제작 전 30초 체크

영상 하나를 만들기 전에 다음 질문에 YES가 나와야 한다.

1. 첫 질문을 중학생도 이해할 수 있는가?
2. 60초 뒤 남길 Takeaway가 한 문장인가?
3. 설명보다 화면으로 보여줄 수 있는가?
4. 중간에 최소 한 번의 관점 이동이 있는가?
5. 약 5초마다 의미 있는 변화가 가능한가?
6. 마지막에 첫 질문에 답하는가?
7. 생성형 영상 없이도 수학 부분 자체가 볼 만한가?
8. 정확한 수학은 코드/검증 가능한 방식으로 만들 수 있는가?
9. 이 영상이 이전 영상의 단순 복제품은 아닌가?
10. 학생이 보고 난 뒤 "아 그래서!"라고 말할 지점이 있는가?

7번이 특히 중요하다.

> **Hero Shot을 지워도 수학 장면이 재미있어야 한다.**

---

# v7 핵심 선언

> **JP Math Lab 영상은 60초짜리 영화를 만드는 프로젝트가 아니다.**

> **한 번도 생각하지 않았던 질문을 던지고,  
> 화면에서 계속 무언가가 변하게 하며,  
> 학생이 그 변화를 따라가는 동안  
> 하나의 수학적 관점을 스스로 발견하게 만드는 프로젝트다.**

생성형 영상은 세계를 만든다.  
코드는 수학을 정확하게 만든다.  
TTS와 자막은 이야기를 전달한다.  
편집은 리듬을 만든다.  
자동화는 반복 노동을 줄인다.

그러나 최종적으로 남아야 하는 것은 기술이 아니다.

> **"아, 그래서 그런 거였구나."**

그 한 번의 발견이다.


---

# v8 — 앱 생태계와 멀티유즈 콘텐츠 전략

> 업데이트: 2026-08-30
> 목적: 하나의 수학 아이디어가 영상, 게임, 인터랙티브 Lab, 탐구주제, 교사용 활동으로 확장되는 구조를 설계한다.

# 1. v8 핵심 선언

JP Math Lab의 핵심 자산은 개별 영상이나 개별 게임이 아니다.

> **가장 중요한 자산은 ‘수학 아이디어를 여러 경험으로 변환할 수 있는 콘텐츠 원천 DB’다.**

하나의 좋은 아이디어는 다음으로 분기될 수 있다.

```text
CONTENT IDEA
 ├─ VIDEO
 ├─ GAME
 ├─ LAB
 ├─ RESEARCH
 └─ TEACHER
```

예:

`내적`

- VIDEO: 게임 캐릭터는 적이 앞에 있는지 어떻게 판단할까?
- GAME: 제한시간 안에 올바른 방향벡터를 선택
- LAB: 벡터를 직접 회전시키며 내적값 변화 관찰
- RESEARCH: 게임 시야 판정과 내적의 관계
- TEACHER: 벡터 단원 도입 활동

즉, 아이디어 하나를 콘텐츠 하나로 끝내지 않는다.

> **아이디어 하나를 ‘콘텐츠 패밀리’로 만든다.**

---

# 2. 모바일 앱의 역할

웹은 긴 탐구와 시각화에 강하다.

앱은 반복 접속과 짧은 플레이에 강하다.

따라서 앱의 중심 역할은 다음처럼 분리한다.

## PLAY
반복 접속을 만드는 공간.

- 연산스킬
- 30~90초 미니게임
- 최고기록
- 콤보
- 연속 정답
- 랭크
- 일일 도전

## DISCOVER
호기심을 만드는 공간.

- 오늘의 질문
- 1분 영상
- 짧은 수학 미스터리
- 신기한 수학 카드

## EXPLORE
직접 움직이는 공간.

- 그래프
- 벡터
- 공간도형
- 확률
- 경제 시뮬레이션

## RESEARCH
탐구주제를 찾는 공간.

- 관심사
- 과목
- 난이도
- 진로
- 수학 개념

을 선택해서 주제를 추천받는다.

---

# 3. 앱 첫 화면은 단순해야 한다

첫 화면에 모든 기능을 나열하지 않는다.

권장 구조:

```text
PLAY
DISCOVER
EXPLORE
RESEARCH
```

사용자는 네 가지 행동만 이해하면 된다.

기존 웹앱에서도 같은 정보 구조를 활용할 수 있다.

---

# 4. 연산스킬 게임은 ‘앱 재방문 엔진’이다

연산 게임의 목표는 문제 수를 늘리는 것이 아니다.

> **짧은 시간에 반복 성공 경험을 만드는 것.**

권장 한 판 길이:

- 30초
- 60초
- 최대 90초

학생의 행동:

```text
앱 실행
→ 한 판
→ 점수
→ 기록 갱신
→ 한 판 더
```

공부를 오래 하게 만드는 것보다

> **공부하려고 들어오지 않았는데 수학을 반복하게 만드는 것**

이 더 중요하다.

---

# 5. 연산스킬 게임 설계 원칙

좋은 연산게임은 단순 객관식 퀴즈가 아니다.

## A. 조작형

예:
- 인수분해 블록 결합
- 벡터 드래그
- 함수 그래프 이동
- 분수 크기 맞추기

## B. 속도형

예:
- 지수법칙 연속 처리
- 미분값 즉시 판단
- 삼각함수 값 빠르게 선택

## C. 패턴형

예:
- 수열 다음 항
- 함수 변화 패턴
- 확률 반복 패턴

## D. 공간형

예:
- 정사영 맞히기
- 벡터 방향
- 좌표 이동

## E. 전략형

예:
- 확률 선택
- 경제 의사결정
- 최단경로

---

# 6. 게임화 요소는 최소한으로 시작한다

처음부터 RPG식 시스템을 넣지 않는다.

1차 버전:

- 점수
- 최고기록
- 콤보
- 난이도 상승
- 결과 화면

2차 버전:

- 일일 도전
- 연속 접속
- 스킬 레벨

3차 버전:

- 배지
- 시즌
- 친구 기록 비교

게임 시스템이 수학보다 복잡해지면 안 된다.

---

# 7. 광고 모델 — Rewarded 중심

학생 앱에서 가장 위험한 구조:

> 문제 몇 개 풀 때마다 강제 광고

이 방식은 학습 흐름과 신뢰를 모두 깨뜨릴 수 있다.

따라서 광고는 가능하면 ‘보상형’으로 설계한다.

예:

- 이어하기
- 힌트
- 보너스 스테이지
- 탐구 Deep Dive
- 추가 탐구 카드
- 오늘의 특별 문제

사용자가 선택해서 보는 구조를 기본으로 한다.

---

# 8. 탐구주제 추천의 핵심 UX

탐구주제 제목 자체는 무료로 탐색할 수 있게 한다.

예:

```text
과목: 기하
관심: 게임
난이도: 중

→ 게임 캐릭터는 적이 앞에 있는지 어떻게 판단할까?
→ 3D 게임에서 카메라는 어떻게 물체를 화면에 표시할까?
→ 총알과 벽이 부딪혔는지 게임은 어떻게 계산할까?
```

학생이 하나를 선택하면:

`이 주제로 탐구하기`

버튼을 누른다.

이때 Deep Dive를 연다.

---

# 9. Deep Dive 탐구카드

광고를 본 뒤 단순 제목 하나를 주지 않는다.

하나의 탐구 패키지를 제공한다.

구성:

- 탐구 질문
- 핵심 수학
- 왜 흥미로운가
- 탐구 순서
- 직접 해볼 실험
- 데이터/그래프 아이디어
- 확장 질문
- 보고서 구조
- 흔한 오류
- 참고할 개념
- 난이도 조절 방법

이렇게 해야 광고가 ‘잠금 해제 비용’처럼 느껴지고
사용자 만족도가 올라갈 수 있다.

---

# 10. 탐구 추천 엔진의 차별점

단순 AI 질문 생성기와 경쟁하면 안 된다.

JP Math Lab의 장점은:

> **질문이 실제 수학 개념, 시각화, 게임, 데이터와 연결되어 있다는 것**

이다.

추천은 다음 축을 사용한다.

```text
교과
수학 개념
학생 관심사
난이도
진로
탐구 형태
필요한 도구
시각화 가능성
데이터 수집 가능성
보고서 완성 난이도
```

---

# 11. 관심사 기반 탐구 추천

예:

## 게임
벡터 / 좌표 / 확률 / 그래프 / 충돌 판정 / 최단경로

## 경제
복리 / 함수 / 최적화 / 통계 / 확률

## 스포츠
포물선 / 속도 / 미분 / 통계 / 최적화

## 건축
기하 / 벡터 / 정사영 / 비율 / 곡선

## AI
행렬 / 벡터 / 거리 / 확률 / 최적화

## 우주
삼각함수 / 좌표 / 원뿔곡선 / 미분 / 수치 계산

## 음악
삼각함수 / 주기 / 로그 / 비율

이 관심사 태그를 아이디어뱅크에 넣는다.

---

# 12. 멀티유즈 점수

각 콘텐츠에 다음 점수를 추가한다.

| 코드 | 의미 |
|---|---|
| VID | 영상화 가능성 |
| GAM | 게임화 가능성 |
| LAB | 인터랙티브화 가능성 |
| RES | 탐구주제화 가능성 |
| TCH | 수업 활용성 |

5점 만점.

예:

`내적`

VID 5
GAM 5
LAB 5
RES 4
TCH 5

→ 매우 강한 핵심 콘텐츠.

반대로 한 형태에서만 강한 콘텐츠도 괜찮다.

---

# 13. ‘콘텐츠 패밀리’ 우선순위

최우선 콘텐츠는 단순히 영상성이 높은 콘텐츠가 아니다.

다음 조건을 만족하면 가치가 매우 높다.

- 영상으로 강하다
- 게임으로도 가능하다
- Lab에서도 조작 가능하다
- 탐구주제로 확장 가능하다

이런 콘텐츠를 Core Content로 분류한다.

초기 Core 후보:

- 벡터/내적
- 순간변화율
- 지수성장
- 확률/조건부확률
- GPS/좌표
- 정사영
- 그래프 이론
- 포물선
- 복리
- 평균/통계 왜곡

---

# 14. 앱용 연산스킬 후보

## 공통수학
- 인수분해 콤보
- 방정식 균형 맞추기
- 함수 입력/출력
- 좌표 이동

## 대수
- 지수법칙 스피드런
- 로그 변환
- 수열 패턴

## 미적분
- 증가/감소 판정
- 접선 기울기 맞히기
- 미분값 빠른 판단
- 넓이 추정

## 확률과 통계
- 확률 선택
- 평균/중앙값 판정
- 분포 읽기
- 조건부확률 반전

## 기하
- 벡터 조준
- 내적 FOV
- 정사영 맞히기
- 공간좌표 회전

## 경제수학
- 복리 성장
- 할인율
- 환율
- 대출 상환
- 수익/비용 의사결정

---

# 15. ‘한 판 더’가 나오게 하는 심리 구조

수학게임은 다음 루프를 노린다.

```text
쉽게 시작
→ 조금 성공
→ 난이도 상승
→ 실수
→ 최고기록 근처
→ 재도전
```

사용자가

“공부해야지”

가 아니라

“이번엔 100점 넘길 수 있는데”

라고 생각하게 만드는 것이 목표다.

---

# 16. 난이도 적응 시스템

학생마다 같은 게임이어도 문제가 달라져야 한다.

기본 구조:

- 최근 10문제 정답률
- 평균 반응시간
- 연속 오답 개념
- 연속 정답 개념

을 이용해 난이도를 조절한다.

예:

정답률 90% 이상 + 빠름
→ 난이도 상승

정답률 60% 이하
→ 한 단계 하락 + 힌트

이렇게 하면
단순 학년 고정 난이도보다 훨씬 오래 쓸 수 있다.

---

# 17. 학생 프로필은 ‘성적표’보다 ‘스킬맵’

앱에서 학생에게 등급표처럼 보여주지 않는다.

예:

```text
함수        Lv.7
지수        Lv.5
미분        Lv.3
벡터        Lv.8
확률        Lv.4
```

그리고

`다음 Lv까지 120XP`

처럼 보여준다.

이것은 게임의 성장감과 학습 진단을 동시에 제공한다.

---

# 18. 교사 버전의 가능성

학생 앱 광고 모델과 교사 모델은 분리할 수 있다.

교사에게 가치가 있는 기능:

- 학급 생성
- 게임 배정
- 학생 스킬맵
- 취약 개념
- 탐구주제 배정
- 탐구 진행률
- 학생 결과물
- 수업용 Lab 실행

교사 기능은 광고가 아니라
향후 학교/교사 구독 모델 가능성을 검토할 수 있다.

---

# 19. 학생 콘텐츠와 교사 데이터는 분리한다

게임 자체는 가볍게 유지한다.

교사용 분석은 별도 계층으로 둔다.

학생 앱 화면에 너무 많은 평가 정보를 보여주면
게임의 즐거움이 사라질 수 있다.

학생:
`성장/기록`

교사:
`진단/분석`

으로 역할을 분리한다.

---

# 20. 앱과 웹의 관계

앱이 웹을 대체할 필요는 없다.

권장 구조:

## 앱
- 짧은 게임
- 영상
- 탐구주제 발견
- 간단한 Lab
- 반복 사용

## 웹
- 깊은 인터랙션
- 3D
- 긴 탐구
- 보고서
- 교사 관리
- 복잡한 편집

같은 계정/콘텐츠 DB를 공유할 수 있다.

---

# 21. 개발 전략

처음부터 모든 것을 앱으로 만들지 않는다.

### Phase 1
웹에서 게임 프로토타입 제작

### Phase 2
모바일 화면 최적화

### Phase 3
Capacitor 등으로 앱 패키징

### Phase 4
푸시/광고/기기 기능 연결

### Phase 5
스토어 배포

이렇게 하면 기존 HTML/JS/Canvas/Three.js 자산을 최대한 살릴 수 있다.

---

# 22. 아이디어뱅크의 데이터 구조 v8

기존 레코드에 다음을 추가한다.

```yaml
INTEREST_TAGS:
  - game
  - AI

MULTI_USE:
  VIDEO: 5
  GAME: 5
  LAB: 5
  RESEARCH: 4
  TEACHER: 5

GAME:
  possible: true
  game_type: aiming
  session_seconds: 60
  core_action: vector_rotate
  scoring: accuracy_plus_speed

RESEARCH:
  possible: true
  deep_dive: true
  difficulty: medium
  experiment: adjustable_vector_simulation

APP:
  discovery_card: true
  rewarded_unlock: true
  offline_possible: true
```

---

# 23. 사용자 흐름

이상적인 흐름 하나:

```text
게임 플레이
→ 결과 화면
→ "오늘의 발견"
→ 짧은 질문
→ 1분 영상
→ 관심 생김
→ 직접 움직여보기
→ 탐구주제 저장
```

또 다른 흐름:

```text
주제탐구 필요
→ 관심사 선택
→ 후보 무료 탐색
→ 주제 선택
→ Deep Dive 해금
→ Lab 실험
→ 보고서 준비
```

같은 DB가 두 흐름을 모두 지원한다.

---

# 24. 광고보다 중요한 첫 번째 지표

초기에는 광고수익을 최적화하지 않는다.

먼저 확인해야 할 것:

- 다시 앱을 켜는가?
- 게임을 한 판 더 하는가?
- 영상 끝까지 보는가?
- 탐구주제를 저장하는가?
- Lab을 직접 만지는가?

사용이 생기지 않으면 광고 최적화는 의미가 없다.

---

# 25. 핵심 지표

초기 앱에서 볼 지표:

## PLAY
- 평균 게임 세션
- 한 번 실행 후 플레이 횟수
- 7일 재방문

## DISCOVER
- 영상 클릭률
- 영상 완주율

## EXPLORE
- Lab 실행률
- 평균 조작 시간

## RESEARCH
- 주제 후보 클릭
- Deep Dive 선택률
- 저장률

---

# 26. 가장 중요한 제품 전략

JP Math Lab을

“수학 공부 앱”

이라고만 정의하지 않는다.

더 강한 정의:

> **학생이 수학을 ‘연습하고, 발견하고, 가지고 놀고, 자기 주제로 확장하는 공간’.**

PLAY는 연습.
DISCOVER는 호기심.
EXPLORE는 이해.
RESEARCH는 자기화.

이 네 단계가 서로 다른 학생을 끌어들인다.

---

# 27. 아이디어뱅크의 진짜 가치

아이디어뱅크는 앞으로 영상 주제 목록이 아니다.

다음의 원천 데이터다.

- Shorts 주제
- 게임 설계
- Lab 설계
- 수행평가 아이디어
- 주제탐구
- 세특 탐구 소재
- 수업 도입
- 교사용 활동
- 앱 Discovery 카드

따라서 새 아이디어를 추가할 때

“영상이 되나?”

만 묻지 않는다.

> **“이 아이디어는 몇 개의 경험으로 확장될 수 있는가?”**

를 묻는다.

---

# 28. 추가 전략 — 하나의 콘텐츠를 단계별로 소비하게 한다

같은 주제를 난이도별로 별도 제작하지 않고
‘깊이 단계’로 만들 수 있다.

예: 벡터 내적

### Level 0
게임: 적이 앞인지 맞히기

### Level 1
1분 영상: 게임이 앞/뒤를 판단하는 방법

### Level 2
Lab: 벡터 직접 회전

### Level 3
개념: 내적과 cos

### Level 4
탐구: 게임 FOV 구현

이 구조는 한 콘텐츠를
초보자부터 상위권 학생까지 사용할 수 있게 한다.

---

# 29. 추가 전략 — 게임에서 탐구주제를 자동 발견하게 한다

학생이 특정 게임을 많이 하면
관련 탐구주제를 추천한다.

예:

벡터 게임을 많이 플레이
→

`게임에서 방향 판정은 어떻게 구현할까?`

확률 게임을 많이 플레이
→

`왜 확률 게임에서는 직관이 자주 틀릴까?`

지수 게임을 많이 플레이
→

`바이러스 확산은 언제 폭발적으로 보이기 시작할까?`

즉 게임 활동이
탐구 추천의 개인화 신호가 된다.

---

# 30. 추가 전략 — ‘게임 결과 → 수학 설명’ 순서를 뒤집지 않는다

게임 전 긴 설명을 하지 않는다.

먼저 플레이.

학생이 실패하거나 궁금해지면
설명을 제공한다.

```text
PLAY
→ 실패/궁금증
→ 짧은 설명
→ 다시 PLAY
```

이 구조가 앱의 기본 학습 루프가 될 수 있다.

---

# 31. 추가 전략 — 앱의 가장 강한 진입점은 한 가지가 아닐 수 있다

학생 유형별 진입:

- 게임 좋아함 → PLAY
- 영상 좋아함 → DISCOVER
- 수행평가 필요 → RESEARCH
- 수학 좋아함 → EXPLORE

하나의 앱이지만
사용 이유는 학생마다 다르다.

이것이 오히려 강점이다.

---

# 32. v8 최종 선언

> **JP Math Lab은 콘텐츠를 쌓는 프로젝트가 아니라,  
> 하나의 수학 아이디어를 여러 경험으로 변환하는 시스템을 만드는 프로젝트다.**

영상은 기억을 만든다.

게임은 반복을 만든다.

Lab은 이해를 만든다.

탐구는 자기화를 만든다.

교사 도구는 수업과 연결한다.

그리고 이 모든 것의 중심에는

> **아이디어뱅크**

가 있다.


---

# v9 — 기존 수학게임 유지 + 성장/경쟁 시스템 + 탐구 생성엔진 + 앱 출시 로드맵

> 업데이트: 2026-08-30
> 목적: 기존 JP Math Lab의 연산·개념 게임을 보존하면서, 그 위에 성장·수집·확률·리더보드 시스템을 추가하고, 탐구 아이디어뱅크를 대규모 주제 생성 시스템으로 확장하며, 실제 모바일 앱 출시와 광고수익화까지 연결한다.

# 1. 가장 중요한 방향 수정

기존 웹앱에 이미 존재하거나 제작 중인

- 연산스킬 게임
- 개념 게임
- 그래프 게임
- 벡터/기하 인터랙션
- 확률 게임
- 경제수학 게임

은 그대로 핵심 콘텐츠로 유지한다.

새로운 RPG/수집 요소는 기존 수학게임을 대체하지 않는다.

> **기존 수학게임 = 실제 플레이**
>
> **RPG·수집·성장·경쟁 = 계속 플레이하게 만드는 메타게임**

---

# 2. 앱의 게임 구조는 두 층으로 본다

## 1층 — Math Play

실제로 수학을 하는 게임.

예:

- 인수분해 스피드런
- 지수법칙 콤보
- 로그 변환
- 수열 패턴
- 증가·감소 판정
- 순간변화율 찾기
- 벡터 조준
- 내적 FOV
- 정사영
- 조건부확률
- 복리
- 환율
- 비용/수익 최적화

## 2층 — Meta Game

수학게임을 반복하게 만드는 시스템.

- 경험치
- 골드
- 캐릭터
- 카드
- 장비
- 강화
- 보스
- 시즌
- 리더보드
- 업적
- 도감

---

# 3. 수학게임 결과를 성장 시스템에 연결

예:

```text
미분 스피드런 60초
점수: 2,430

획득:
EXP +120
GOLD +85
카드팩 조각 +1
```

학생은

"미분 문제를 더 풀어야지"

보다는

"보스 체력이 조금 남았으니까 한 판 더"

라는 이유로 다시 플레이할 수 있다.

---

# 4. 사냥과 수학게임 연결

보스 전투를 복잡한 별도 게임으로 만들 필요는 없다.

예:

```text
보스 HP = 10,000

벡터 게임 점수 2,100
→ DAMAGE 2,100

미분 게임 점수 2,850
→ DAMAGE 2,850
```

이렇게 하면 기존 게임이 그대로 전투 시스템이 된다.

---

# 5. 캐릭터/카드 시스템

캐릭터가 꼭 수학자일 필요는 없다.

게임은 게임답게 보이는 것이 중요하다.

가능한 방향:

- 판타지
- SF
- 탐험
- 우주
- 몬스터
- 마법
- 수학 세계관

카드 효과 예:

- 연속정답 콤보 +5%
- 제한시간 +3초
- 특정 스킬 EXP +10%
- 보스전 피해량 +5%
- 실패 시 1회 보호
- 확률게임 보상 +10%

단, 능력 차이가 너무 커져서
수학 실력보다 카드가 점수를 결정하면 안 된다.

---

# 6. 확률게임은 별도의 강력한 콘텐츠다

학생들이 실제 게임에서 익숙한

- 카드뽑기
- 강화
- 확률 성공
- 아이템 드롭

을 수학 학습과 연결할 수 있다.

예:

```text
+5 → +6 성공률 70%
+6 → +7 성공률 50%
+7 → +8 성공률 30%
```

학생 개인의 실제 성공률과
전체 서버 결과를 비교한다.

개인:

```text
20번 시도
성공 4번
실제 성공률 20%
```

전체:

```text
100,000번 시도
성공률 30.1%
```

이를 통해

- 확률
- 독립시행
- 이항분포
- 기대값
- 큰 수의 법칙

등으로 자연스럽게 연결할 수 있다.

---

# 7. 카드뽑기도 확률 실험으로 만든다

예:

```text
SSR 등장확률 3%
```

학생 개인은 20번 뽑아도 0개일 수 있다.

그러나 전체 사용자 데이터는
시행 횟수가 증가할수록 약 3%에 접근한다.

게임 UI 자체가
확률 실험실 역할을 할 수 있다.

---

# 8. 확률형 시스템의 안전한 초기 원칙

초기에는

> 현금 → 무작위 보상

구조를 피한다.

권장:

```text
수학게임 플레이
→ 무료 게임 재화
→ 무료 뽑기
```

광고는 가능하면

- 확정 EXP
- 확정 골드
- 확정 도전권
- 확정 카드 조각
- 탐구 Deep Dive

처럼 확정 보상에 사용한다.

학생 대상 앱이므로
광고·확률형 시스템은 스토어 정책과 연령 정책을 보수적으로 적용한다.

---

# 9. 리더보드는 핵심 재방문 시스템

리더보드는 누적 총점 하나로 끝내지 않는다.

권장:

- 오늘
- 이번 주
- 게임별
- 학교
- 학년
- 친구방
- 전체

예:

```text
이번 주 벡터 조준

1위 12,840
2위 12,610
3위 12,570

나: 12,430
상위 7%
```

학생은

"1등 해야겠다"

보다

"한 번만 더 하면 상위 5%"

라는 목표를 가질 수 있다.

---

# 10. 주간 시즌제를 기본으로 고려

누적 리더보드는
늦게 설치한 사용자가 불리하다.

따라서:

- 주간 랭킹
- 월간 시즌
- 시즌 배지

등을 사용한다.

전체 누적 기록은 별도 명예의 전당으로 남길 수 있다.

---

# 11. 수학을 하나의 능력으로 줄 세우지 않는다

게임별 리더보드를 분리한다.

예:

- 인수분해왕
- 벡터왕
- 확률왕
- 미분왕
- 경제수학왕

학생마다 잘하는 영역이 달라질 수 있게 한다.

이는 게임적 재미뿐 아니라
수학에 대한 자기효능감에도 긍정적인 구조가 될 수 있다.

---

# 12. 개인정보와 경쟁

학생 앱에서는 실명보다는 닉네임을 기본으로 한다.

학교 단위 경쟁은

- 초대 코드
- 학급 코드
- 교사 생성 방

방식을 고려한다.

리더보드 점수는 서버에서 검증해야
점수 조작을 막을 수 있다.

---

# 13. 탐구주제는 10,000개를 직접 작성하지 않는다

완성 주제 10,000개를 직접 쓰는 구조는 비효율적이다.

대신:

> **많은 좋은 씨앗 + 생성축 + 품질검사 + 중복검사**

를 만든다.

목표:

- 씨앗 1,000~3,000개 이상
- 유효 조합 수만~수십만
- 학생별 실제 추천은 품질 필터 통과한 소수

---

# 14. 씨앗은 수학개념만 의미하지 않는다

## 수학 씨앗

- 극한
- 미분
- 적분
- 벡터
- 확률
- 통계
- 행렬
- 지수
- 로그
- 그래프

## 현상 씨앗

- 자동차 제동
- 야구공 회전
- SNS 확산
- 배터리 충전
- 위성 궤도
- 게임 충돌
- 음원 파형
- 주가 변화

## 대상 씨앗

- 자동차
- 로봇
- 게임 캐릭터
- 항공기
- 스마트폰
- 건축물
- 스포츠선수
- 위성

## 행동 씨앗

- 측정
- 예측
- 비교
- 최적화
- 분류
- 복원
- 시뮬레이션
- 판단

## 데이터 씨앗

- 시간
- 위치
- 속도
- 가격
- 거리
- 온도
- 확률
- 점수

---

# 15. 주제 생성 예

```text
미분
× 자동차
× 제동
× 속도 데이터
× 최적화

→ 차량의 제동거리와 속도의 변화율을 이용해
안전한 제동 조건을 분석할 수 있을까?
```

```text
미분
× 야구
× 타구
× 영상 데이터
× 순간변화

→ 야구 영상의 프레임별 위치로
타구의 순간속도를 추정할 수 있을까?
```

---

# 16. 최종 추천 전 AI 검증

생성된 모든 조합을 학생에게 보여주지 않는다.

필터:

1. 수학적 타당성
2. 실제 탐구 가능성
3. 학생 수준 적합성
4. 데이터 확보 가능성
5. 보고서 완성 가능성
6. 기존 주제와 의미 중복
7. 지나치게 넓거나 좁지 않은가
8. 단순 검색형 주제는 아닌가

---

# 17. 중복판정은 제목이 아니라 의미로 한다

예:

A.
"야구공의 순간속도를 영상으로 측정할 수 있을까?"

B.
"야구공의 프레임별 위치를 이용해 순간 구속을 계산할 수 있을까?"

표현은 다르지만
사실상 같은 주제다.

따라서 CONTENT FINGERPRINT를 저장한다.

예:

```yaml
MATH: derivative
DOMAIN: baseball
OBJECT: ball
VARIABLE: position_time
METHOD: video_analysis
QUESTION_TYPE: instantaneous_rate
```

새 후보가 들어오면
이 지문과 의미 유사도를 함께 검사한다.

---

# 18. 학급 단위 중복 방지

교사가

`2학년 3반 미적분 주제탐구`

공간을 만든다.

학생이 주제를 확정하면
해당 탐구방에 Fingerprint가 등록된다.

다음 학생 추천 시:

- 동일 주제 제거
- 지나치게 유사한 주제 제거
- 다른 변수/다른 방법으로 확장된 주제는 허용

이를 통해 같은 학급에서도
겹침을 크게 줄일 수 있다.

---

# 19. 아이디어뱅크의 목표가 바뀐다

기존:

> 좋은 주제를 많이 저장한다.

확장:

> **좋은 주제를 계속 만들어낼 수 있는 씨앗과 규칙을 저장한다.**

그래도 씨앗 자체는 많을수록 좋다.

따라서 앞으로도 적극적으로

- 역사
- 건축
- 게임
- 스포츠
- 경제
- 우주
- 자연
- 전쟁/전략
- 지도
- 음악
- 예술
- AI
- 컴퓨터그래픽
- 교통
- 기후
- 사회현상

등에서 씨앗을 계속 수집한다.

---

# 20. 실제 모바일 앱 제작 전체 과정

JP Math Lab의 현재 웹 자산을 최대한 살리는 것을 기본 전략으로 한다.

```text
현재 웹앱
→ 모바일 UI 최적화
→ Capacitor 등으로 앱 패키징
→ Firebase 계정/데이터/랭킹
→ 광고 SDK
→ Android/iOS 테스트
→ 스토어 심사
→ 출시
→ 데이터 분석
```

---

# 21. STEP 1 — 웹앱을 모바일 친화적으로 만든다

먼저 브라우저에서 휴대폰 화면으로 완성한다.

확인:

- 9:16 세로 화면
- 터치 크기
- 작은 글씨
- 스크롤
- 가로 회전
- 3D 성능
- Canvas 성능
- 로딩시간
- 저사양 기기

웹에서 먼저 잘 돌아가면
앱으로 옮기는 난도가 크게 낮아진다.

---

# 22. STEP 2 — 앱 껍데기

기존 HTML/CSS/JS를 버리지 않고
Capacitor 계열 구조로 감싼다.

앱 프로젝트:

```text
JP Math Lab Web Core
 ├─ Android
 └─ iOS
```

필요하면 이후

- 카메라
- 알림
- 진동
- 파일
- 기기 저장소

같은 네이티브 기능을 연결한다.

---

# 23. STEP 3 — 백엔드

공통 계정과 데이터를 서버에서 관리한다.

가능한 구조:

```text
users
profiles
skills
game_scores
leaderboards
inventory
cards
characters
research_topics
research_rooms
achievements
```

Firebase를 활용하면
기존 경험을 살리기 좋다.

---

# 24. STEP 4 — Android 빌드

Android Studio에서

- 실제 기기 실행
- 서명
- 빌드
- 테스트

를 진행한다.

Google Play 배포용 패키지를 만든다.

---

# 25. STEP 5 — iOS 빌드

Xcode에서

- 실제 iPhone 테스트
- 인증서/서명
- Archive
- TestFlight 업로드

를 진행한다.

iOS 빌드와 스토어 배포 단계에서는
Mac/Xcode 환경이 필요하다.

---

# 26. STEP 6 — 베타 테스트

정식 출시 전에 소수 학생으로 테스트한다.

확인:

- 설치 오류
- 로그인
- 저장
- 점수
- 랭킹
- 광고
- 발열
- 배터리
- 터치
- 게임 재미
- 난이도

처음에는 정식 공개보다
베타 테스트가 중요하다.

---

# 27. STEP 7 — 광고 연결

초기 광고는 Rewarded 중심을 고려한다.

적합 후보:

- 이어하기
- 추가 도전권
- 확정 보너스
- 탐구 Deep Dive
- 특별 스테이지

피해야 할 초기 형태:

- 문제마다 광고
- 매 게임 종료 강제 전면광고
- 학습 중간 광고

광고가 학습 흐름을 깨지 않아야 한다.

---

# 28. STEP 8 — 스토어 제출

준비할 것:

- 앱 이름
- 아이콘
- 스크린샷
- 앱 설명
- 개인정보처리방침
- 연령등급
- 데이터 수집 설명
- 광고 여부
- 테스트 계정
- 지원 연락처

Android:

Google Play Console

iOS:

App Store Connect

에서 심사를 진행한다.

---

# 29. STEP 9 — 출시 후

출시가 끝이 아니다.

초기 핵심 지표:

- D1 재방문
- D7 재방문
- 평균 게임 횟수
- 한 세션 길이
- 게임별 재도전률
- 리더보드 확인률
- 탐구주제 저장률
- Deep Dive 전환
- 광고 시청 선택률

광고수익보다
먼저 ‘다시 들어오는 앱인가’를 확인한다.

---

# 30. 첫 앱의 범위

처음부터 전체 JP Math Lab을 앱에 넣지 않는다.

권장 MVP:

```text
연산/개념 게임 3~5개
+
EXP/GOLD
+
캐릭터 또는 카드 수집
+
보스 1개
+
주간 리더보드
```

이것만으로 실제 학생 반응을 본다.

재미가 확인되면:

```text
게임 추가
→ DISCOVER
→ EXPLORE
→ RESEARCH
```

순서로 확장한다.

---

# 31. 장기 구조

```text
                  JP MATH LAB
                       │
         ┌─────────────┼─────────────┐
         │             │             │
       PLAY        DISCOVER       RESEARCH
         │             │             │
 Math Games        Videos        Topic Engine
         │                           │
     Meta Game                    Deep Dive
         │
 EXP / Cards / Boss
         │
   Leaderboards

         + EXPLORE / LAB
```

웹과 앱은 별개의 프로젝트가 아니다.

> **같은 콘텐츠 DB와 같은 학습 시스템을
> 서로 다른 화면에서 사용하는 구조**

로 본다.

---

# 32. v9 핵심 결론

JP Math Lab 앱은
기존 수학게임을 버리고 RPG를 만드는 프로젝트가 아니다.

> **좋은 수학게임을 계속 플레이하고 싶게 만드는 게임 시스템을 추가하는 프로젝트다.**

그리고 아이디어뱅크는
완성 주제 목록을 쌓는 데 그치지 않는다.

> **수많은 서로 다른 탐구주제를 안정적으로 생성할 수 있는
> 수학적 씨앗 저장소이자 생성 엔진으로 발전한다.**

두 축을 요약하면:

```text
PLAY:
수학게임 → 성장 → 수집 → 경쟁 → 재방문

RESEARCH:
씨앗 → 조합 → 검증 → 중복제거 → 개인화 → 탐구
```

장기적으로 JP Math Lab의 강점은
게임 하나나 영상 하나가 아니라

> **수학 콘텐츠를 계속 만들고,
> 학생마다 다른 방식으로 경험하게 하는 시스템**

그 자체가 된다.


---

# v10 — 수익모델 재설계: 광고는 보조, 회당 결제는 가치 기능, 학생/교사 기능은 분리

> 업데이트: 2026-08-30
> 배경: Grok과의 추가 논의를 검토하여 JP Math Lab의 수익화 구조를 재설계함.
> 핵심: 게임의 리텐션과 탐구의 희소가치를 결합하되, 학생 대상 "세특 완성본 판매"는 피하고 학생용 탐구 코치와 교사용 기록 보조를 분리한다.

# 1. Grok 논의에서 받아들일 부분

다음 판단은 JP Math Lab 방향과 잘 맞는다.

1. 광고는 주 수익원이 아니라 보조 수익원으로 본다.
2. 교육 앱은 자발적 재방문이 약할 가능성이 높으므로, 게임 루프와 리더보드가 먼저 검증되어야 한다.
3. 탐구주제·탐구설계·보고서 피드백처럼 '필요한 순간 가치가 명확한 기능'은 광고보다 지불의사가 높을 수 있다.
4. 이 기능은 구독보다 회당 결제 또는 크레딧 방식이 자연스럽다.
5. 첫 MVP는 여전히 작게 시작한다.

---

# 2. 반드시 수정할 부분 — "세특 판매"로 가면 안 된다

학생에게

> "세특을 완성해드립니다"

를 판매하는 제품은 피한다.

이유:

- 세부능력 및 특기사항은 교사가 수업과 평가 과정에서 직접 관찰·평가한 내용을 중심으로 작성하는 공식 학교 기록이다.
- 학생이 외부 앱에서 생성한 문장은 세특 그 자체가 아니다.
- 학생의 외부 활동이나 생성형 AI가 만든 내용이 실제 활동인 것처럼 보이면 신뢰성과 진위성 문제가 생긴다.
- 특정 보고서를 만들었다는 사실 자체가 곧 세특 기재 근거가 되는 것도 아니다.

따라서 Student App에서 '세특 생성'이라는 메뉴명을 사용하지 않는 것을 기본 원칙으로 한다.

---

# 3. 학생용과 교사용을 분리한다

## STUDENT

학생이 실제 탐구를 잘 수행하도록 돕는다.

가능한 이름:

- 탐구 코치
- Research Coach
- 탐구 설계
- 탐구 기록 정리
- 자기평가 정리
- 보고서 피드백
- 탐구 리플렉션

학생 기능의 목적:

> 결과물을 대신 써주는 것이 아니라,
> 학생이 한 생각과 활동을 더 좋은 탐구로 만드는 것.

## TEACHER

교사가 실제 관찰 기록을 정리하도록 돕는다.

가능한 기능:

- 학생 활동 누가기록
- 관찰 포인트 정리
- 학생별 변화 추적
- 수업산출물 요약
- 성취기준 매핑
- 교사 관찰기록 기반 세특 초안
- 교사 최종 검토/수정

교사용 기능은 기존 세특 작성 스킬의 더 자연스러운 사용처가 될 수 있다.

---

# 4. 학생용 유료 기능은 "완성본"보다 "코칭 단계"를 판다

권장 유료 단위:

## A. 탐구 Deep Dive 1회

제공:

- 탐구 질문 정교화
- 핵심 수학
- 탐구 순서
- 필요한 데이터
- 시뮬레이션/실험 아이디어
- 확장 질문
- 흔한 오류

## B. 탐구 설계 코치 1회

학생의 선택 주제를 입력받아:

- 범위 좁히기
- 변수 정하기
- 가설/질문 구분
- 사용할 수학 선택
- 실제 실행 가능성 검사

## C. 데이터/그래프 코치 1회

학생이 가진 데이터를 바탕으로:

- 어떤 그래프가 적절한지
- 어떤 값을 비교해야 하는지
- 해석에서 무엇을 조심해야 하는지
- 추가 데이터가 필요한지

를 피드백한다.

## D. 보고서 피드백 1회

학생이 먼저 작성한 내용을 바탕으로:

- 논리 흐름
- 수학적 오류
- 근거 부족
- 데이터 해석
- 표현
- 결론 과장

을 피드백한다.

## E. 탐구 기록 정리 1회

학생이 실제 한 활동을 입력하면:

- 무엇을 시도했는지
- 무엇을 발견했는지
- 어디서 실패했는지
- 무엇이 바뀌었는지
- 다음 탐구 질문

으로 구조화한다.

---

# 5. AI가 절대 만들어내면 안 되는 것

AI는 다음을 임의로 창작하지 않는다.

- 하지 않은 실험
- 수집하지 않은 데이터
- 하지 않은 발표
- 실제로 없었던 질문/토론
- 학생이 느끼지 않은 변화
- 교사가 관찰하지 않은 행동
- 존재하지 않는 참고자료

핵심 원칙:

> **AI는 evidence를 만들지 않고, evidence를 구조화한다.**

---

# 6. 보고서 생성은 "대필"보다 "Guided Authoring"

전체 보고서를 한 번에 생성하는 버튼보다 단계형 작성이 낫다.

예:

```text
1. 왜 이 주제를 골랐나?
2. 처음 예상은 무엇이었나?
3. 무엇을 측정/계산했나?
4. 결과가 예상과 달랐나?
5. 어떤 수학이 필요했나?
6. 가장 중요한 그래프/식은?
7. 한계는?
8. 다음 질문은?
```

학생 답변을 받은 뒤 AI가:

- 구조를 정리하고
- 수학 오류를 잡고
- 문장을 개선하고
- 빈 논리를 질문으로 되돌려준다.

이것이 JP Math Lab의 교육적 차별점이 된다.

---

# 7. 최종 제출물보다 "과정 기록"이 더 중요한 자산

RESEARCH에서 저장할 데이터:

```yaml
topic
why_chosen
initial_prediction
math_concepts
attempts
data
graphs
mistakes
revisions
findings
limitations
reflection
next_question
```

이 데이터는:

- 학생 보고서 작성
- 자기평가
- 교사의 수업 관찰
- 교사 피드백
- 다음 탐구 추천

에 재활용할 수 있다.

---

# 8. 학생 앱의 수익 구조 v10

권장 구조:

```text
FREE
 ├─ Math Games
 ├─ Leaderboard
 ├─ Basic Videos
 ├─ Topic Browsing
 └─ Basic Lab

REWARDED AD
 ├─ 확정 게임 보상
 ├─ 추가 도전권
 └─ 제한적 Deep Dive 체험

ONE-TIME / CREDIT
 ├─ Deep Dive
 ├─ Topic Design Coach
 ├─ Data/Graph Coach
 ├─ Report Feedback
 └─ Research Record Organizer
```

광고와 결제는 서로 다른 역할을 한다.

광고:
> 시간을 지불하고 작은 가치를 얻는다.

회당 결제:
> 중요한 순간에 더 높은 품질의 도움을 얻는다.

---

# 9. 구독보다 회당 결제가 어울리는 이유

탐구·보고서 기능은 매일 쓰는 서비스가 아닐 수 있다.

사용 시점:

- 수행평가 직전
- 탐구 시작 시점
- 보고서 작성 시점
- 발표 준비
- 자기평가 작성

따라서 매월 비용을 내는 구독보다

> 필요한 순간 한 번 결제

가 심리적으로 자연스러울 수 있다.

---

# 10. 내부적으로는 크레딧, 외부에서는 이해하기 쉬운 단위

사용자에게는:

- 탐구 코치 1회
- 보고서 피드백 1회

처럼 보여준다.

백엔드에서는 CREDIT으로 관리한다.

예:

```text
Research Credit = 1
Feedback Credit = 1
Deep Dive Credit = 0.5
```

실제 API 비용과 기능 복잡도에 따라 추후 조정할 수 있다.

---

# 11. 패키지는 구독이 아니라 묶음

필요하면:

- 1회
- 5회 팩
- 10회 팩

처럼 확장한다.

자동 갱신은 하지 않는다.

학생/학부모가 무엇을 구매하는지 명확해야 한다.

---

# 12. 앱스토어 결제 구조

앱 안에서 소비되는 디지털 기능이나 콘텐츠를 판매한다면
스토어 결제 정책을 전제로 설계한다.

예:

- 탐구 코치
- Deep Dive
- 디지털 크레딧
- 추가 앱 기능

초기 설계는
iOS In-App Purchase / Google Play Billing을 기본으로 보는 것이 가장 단순하다.

스토어 정책과 한국의 대체결제 프로그램은 출시 직전 다시 확인한다.

---

# 13. 수수료를 가격 설계에 반영한다

스토어 판매는 판매가 전체가 개발자 수익이 아니다.

따라서 회당 가격은:

```text
판매가
- 스토어 수수료
- 세금/정산
- LLM API
- 이미지/영상 API (사용 시)
- 서버 비용
= 실제 기여이익
```

으로 계산한다.

먼저 API 1회 원가를 측정한 뒤 가격을 정한다.

---

# 14. 학생 대상 광고는 더욱 보수적으로

JP Math Lab이 고등학생 중심이라도
미성년 사용 가능성을 전제로 한다.

원칙:

- 행동 타깃 광고를 핵심 모델로 삼지 않기
- 강제 광고 최소화
- 학습/게임 중간 광고 금지에 가깝게 운영
- 광고 보상은 명확히 고지
- 오클릭 유도 금지
- 연령 및 개인정보 정책 준수

광고 매출 최대화보다 브랜드 신뢰가 우선이다.

---

# 15. 탐구 Deep Dive의 새로운 가치

Deep Dive는 단순 자료묶음이 아니다.

다음처럼 행동해야 한다.

학생:
> "축구 프리킥과 미적분을 하고 싶어."

시스템:

1. 질문이 너무 넓은지 판단
2. 사용할 수 있는 데이터 제안
3. 실제 측정 가능한 변수 결정
4. 수학 수준에 맞게 질문 좁힘
5. 유사 탐구와 중복 검사
6. 실행 가능한 탐구 계획 생성

결과:

> "프리킥 영상의 프레임별 위치 데이터를 이용해 공의 속도 변화가 가장 큰 구간을 추정할 수 있을까?"

이것이 제목 생성기와 다른 점이다.

---

# 16. '돈을 낼 이유'를 명확하게 만든다

무료 AI와 경쟁하는 기능에 돈을 받으면 안 된다.

학생이 일반 ChatGPT에
"미적분 탐구주제 알려줘"
라고 하면 나오는 수준은 무료여야 한다.

유료가 되려면:

- 기존 수천 개 씨앗 활용
- 과목/성취수준 연결
- 유사주제 중복 검사
- 실행 가능성 평가
- 맞춤형 데이터 방법
- JP Math Lab 시뮬레이션 연결
- 단계별 기록
- 수학 오류 검사
- 결과물 피드백

이 함께 제공되어야 한다.

즉:

> **AI 문장 생성에 돈을 받는 것이 아니라,
> JP Math Lab의 구조화된 탐구 시스템에 돈을 받는다.**

---

# 17. 교사용 제품은 별도의 큰 가능성

Teacher Studio는 학생 앱과 다른 제품 가치가 있다.

예:

```text
학생별 활동 기록
→ 수업 중 교사 체크
→ 학생 산출물 연결
→ 성취기준 연결
→ 변화/성장 자동 탐지
→ 세특 초안 후보
→ 교사 직접 수정/확정
```

여기서는 기존 세특 스킬의 가치가 훨씬 커진다.

교사는 실제 관찰자인 동시에 최종 기록 작성자이기 때문이다.

---

# 18. 교사용 수익모델은 나중에 별도 검증

가능성:

- 교사 개인 라이선스
- 학교 라이선스
- 학년/과목 패키지
- 사용량 기반 크레딧

학생용 수익모델과 섞지 않는다.

Student App:
> 재미 + 탐구

Teacher Studio:
> 기록 + 진단 + 수업 운영

---

# 19. 가장 위험한 제품 문구

피한다:

- "세특 자동 완성"
- "생기부 대신 써드립니다"
- "입시에 유리한 세특 생성"
- "보고서 자동 대필"
- "AI가 활동내용을 만들어줍니다"

대신:

- "내 탐구를 정리해보세요"
- "수학적 탐구 질문을 더 정교하게"
- "내 데이터와 결과를 분석해보세요"
- "작성한 보고서의 논리와 수학을 점검하세요"
- "교사의 실제 관찰기록을 정리하세요"

---

# 20. v10 수익 플라이휠

```text
PLAY
게임이 재방문을 만든다.
        ↓
DISCOVER
호기심이 새로운 개념을 만난다.
        ↓
RESEARCH
자기 관심사로 주제를 찾는다.
        ↓
COACH
중요한 순간 회당 결제
        ↓
EXPLORE
Lab으로 직접 확인한다.
        ↓
RECORD
실제 탐구과정이 데이터로 남는다.
        ↓
다음 추천 품질 상승
```

교사용에서는:

```text
학생 실제 활동
→ 교사 관찰
→ 기록 축적
→ Teacher Studio
→ 교사 초안 보조
→ 교사 최종 판단
```

---

# 21. MVP에는 유료 기능을 너무 빨리 넣지 않는다

MVP 1:

- 게임 3~5개
- 점수/EXP
- 리더보드
- 간단한 탐구 검색

검증:

> 학생이 다시 오는가?

MVP 2:

- 탐구 Seed Engine
- 중복검사
- Deep Dive

검증:

> 학생이 이 추천을 실제로 쓰고 싶어 하는가?

MVP 3:

- Report/Research Coach
- 회당 결제

검증:

> 돈을 내고 사용할 정도의 가치가 있는가?

순서가 중요하다.

---

# 22. 새로운 핵심 지표

## GAME
- D1 / D7 retention
- 세션당 게임 수
- 리더보드 재도전

## RESEARCH
- 검색 → 주제 저장률
- 주제 후보 → 확정률
- 중복 재추천 만족도

## PAID COACH
- 무료 Deep Dive → 유료 전환
- 첫 구매
- 재구매
- 1회 처리 원가
- 구매 후 실제 완성률

## QUALITY
- 수학 오류율
- 주제 중복률
- 학생이 실제 수행 가능한 비율

---

# 23. v10 최종 판단

Grok 논의가 추가해준 가장 좋은 포인트:

> 광고만으로 사업을 생각하지 말자.

JP Math Lab의 본질적인 가치는 광고 노출이 아니라
수학 콘텐츠 시스템 자체에 있다.

그러나:

> "세특을 써준다"

를 유료상품으로 만드는 것이 아니라,

학생에게는:

> **좋은 탐구를 실제로 해낼 수 있게 돕는 도구**

교사에게는:

> **실제 관찰과 산출물을 정확하게 정리하는 도구**

로 분리한다.

최종 수익 구조 후보:

```text
1. 무료 게임/콘텐츠 → 사용자 유입
2. 선택형 보상 광고 → 보조수익
3. 탐구/피드백 크레딧 → 학생 회당 수익
4. Teacher Studio → 장기 별도 비즈니스
```

핵심 문장:

> **광고에 돈을 받는 앱이 아니라,
> 무료로 재미와 발견을 주고,
> 정말 어려운 순간에 고품질 수학적 도움을 판매하는 앱.**

그리고 AI의 역할은:

> **학생의 활동을 대신 만드는 것이 아니라,
> 학생이 실제로 한 생각과 활동을 더 정확하고 깊게 만드는 것.**


---

# v11 — 앱·웹 통합 제품 구조: 공통 계정, 다른 깊이, 광고 중심 학생 모델

> **v11은 v10의 학생 유료 코치/크레딧 구조를 폐기하고,  
> 앱과 웹을 하나의 JP Math Lab 생태계로 다시 정의한 현재 기준안이다.**

---

# 1. 왜 v11이 필요한가

v10까지는 주로 다음 질문을 다뤘다.

- 게임을 어떻게 반복 플레이하게 만들 것인가
- 탐구주제를 어떻게 생성할 것인가
- 학생과 교사의 기능을 어떻게 분리할 것인가
- 광고와 유료 기능을 어떻게 조합할 것인가

그 이후 중요한 판단이 바뀌었다.

첫째,

> 학생이 ChatGPT, Claude 등 범용 AI로 쉽게 얻을 수 있는 텍스트 결과물에
> 별도 결제를 요구하는 것은 방어력이 약하다.

둘째,

> 학생 보고서는 학생이 직접 작성하는 것이 맞다.

셋째,

> JP Math Lab이 실제로 가져야 하는 경쟁력은
> 보고서를 대신 써주는 AI가 아니라
> 수학을 직접 조작하고 경험하는 게임·Lab·시뮬레이션·콘텐츠 연결망이다.

넷째,

> 첫 제품의 목표는 매출 극대화가 아니라
> 학생이 다시 들어오는가를 확인하는 것이다.

다섯째,

> 현재 웹앱에는 이미 개념 설명과 비교적 깊은 학습 경험이 존재한다.
> 따라서 웹을 버리고 앱으로 대체하는 것이 아니라
> 웹과 앱의 역할을 나누어야 한다.

이 판단을 반영하여 v11에서는 제품 전체 구조를 다시 정의한다.

---

# 2. v11의 한 문장 정의

> **JP Math Lab은 학생이 모바일에서는 짧게 플레이하고 발견하며,
> 웹에서는 깊게 공부하고 조작하고 탐구하는,
> 하나의 계정과 콘텐츠 DB로 연결된 수학 경험 플랫폼이다.**

더 짧게 표현하면:

> **APP = 자주 들어오는 곳  
> WEB = 깊이 들어가는 곳**

둘은 별도의 서비스가 아니다.

같은 JP Math Lab의 서로 다른 인터페이스다.

---

# 3. JP Math Lab의 전체 제품 구조

```text
                         JP MATH LAB
                              │
                       COMMON ACCOUNT
                              │
                Google / Apple Sign-in
                              │
             ┌────────────────┴────────────────┐
             │                                 │
         MOBILE APP                         WEB APP
             │                                 │
        짧고 반복적                         깊고 확장적
             │                                 │
      PLAY / DISCOVER                  CONCEPT FULL
      CONCEPT LITE                     INTERACTIVE LAB
      QUICK EXPLORE                    3D / GRAPH / DATA
      RESEARCH ENTRY                   RESEARCH FULL
             │                                 │
             └────────────────┬────────────────┘
                              │
                     COMMON CONTENT DB
                              │
                     COMMON USER DATA
                              │
      Progress / Score / EXP / Skill / Saved Topics
      Activity History / Unlocks / Recommendations
```

가장 중요한 원칙:

> **앱과 웹이 콘텐츠를 각각 따로 만드는 구조가 되어서는 안 된다.**

원본 콘텐츠는 하나다.

앱과 웹은 같은 콘텐츠를 서로 다른 깊이와 인터페이스로 보여준다.

---

# 4. 로그인은 선택 기능이 아니라 플랫폼의 기반이다

JP Math Lab이 단순한 문제풀이 사이트라면 로그인 없이도 가능하다.

그러나 다음 기능을 사용하려면 계정이 필요하다.

- 최고 점수
- EXP
- Gold
- Skill Level
- 카드/수집
- 보스 진행도
- 연속 접속
- 리더보드
- 탐구주제 저장
- Deep Dive 해금
- 최근 학습
- 앱↔웹 이어하기
- 개인화 추천

따라서 정식 구조에서는 로그인 시스템을 초기에 설계한다.

권장 기본 로그인:

```text
Google로 계속하기
Apple로 계속하기
```

가능하면 자체 ID/PW 회원가입을 중심에 두지 않는다.

학생 입장에서 계정 생성 마찰을 최소화한다.

---

# 5. 로그인 직후 받는 정보도 최소화한다

처음 가입할 때부터 개인정보를 많이 받지 않는다.

초기 프로필:

```text
nickname
grade
interests[]
```

예:

```text
nickname: MathKing
grade: 고2
interests:
  - 게임
  - AI
  - 우주
```

학교/학급 정보는 필수가 아니다.

리더보드나 Teacher Room 같은 기능을 사용할 때만
별도로 연결할 수 있도록 한다.

원칙:

> **서비스 이용에 필요하지 않은 학생 정보를 미리 수집하지 않는다.**

---

# 6. 모바일 앱의 역할

모바일 앱의 목적은:

> **학생이 다시 JP Math Lab을 열게 하는 것**

따라서 모바일의 핵심 속성은:

- 짧다
- 빠르다
- 터치 중심이다
- 반복할 수 있다
- 즉시 결과가 나온다
- 성장감이 있다

모바일 앱의 4개 중심 영역은 유지한다.

```text
PLAY
DISCOVER
EXPLORE
RESEARCH
```

그러나 네 영역의 비중은 동일하지 않다.

초기 우선순위:

```text
PLAY >>> DISCOVER > EXPLORE > RESEARCH
```

초기 앱의 진입 엔진은 PLAY다.

---

# 7. 앱 HOME은 기능 목록이 아니라 행동 유도 화면이다

기존 웹앱에서 느꼈던 문제 중 하나는
첫 화면에 많은 것이 동시에 보이면 조잡해진다는 것이다.

따라서 모바일 HOME에서
모든 기능을 나열하지 않는다.

권장 구조:

```text
안녕, MathKing

Lv. 7        🔥 4일 연속

[ 오늘의 미션 ]
미분 게임 3판
2 / 3

────────────────────

[ PLAY ]       [ DISCOVER ]

[ EXPLORE ]    [ RESEARCH ]
```

필요하다면 하단 navigation:

```text
HOME
PLAY
EXPLORE
PROFILE
```

정도로 단순화할 수 있다.

홈의 목적은:

> 기능 설명이 아니라 다음 행동 선택

이다.

---

# 8. PLAY는 두 층으로 구성한다

v9의 핵심 판단은 유지한다.

## 1층 — Math Play

실제 수학 활동.

예:

- 연산 스피드런
- 함수 그래프 판단
- 미분 게임
- 극한 판정
- 확률 판단
- 벡터 방향
- 공간 감각
- 경제수학 계산
- 개념 선택 게임

## 2층 — Meta Game

반복 플레이를 유도하는 성장 장치.

예:

- EXP
- Gold
- Level
- Boss
- Character
- Cards
- Collection
- Weekly Challenge
- Leaderboard

중요:

> **Meta Game은 Math Play를 대체하지 않는다.**

학생의 수학 실력이 게임의 중심이어야 한다.

---

# 9. 게임 하나의 표준 흐름

첫 프로토타입에서 검증해야 할 핵심 loop:

```text
HOME
 ↓
PLAY
 ↓
게임 선택
 ↓
30~90초 플레이
 ↓
RESULT
 ↓
Score
Accuracy
Combo
 ↓
EXP / GOLD
 ↓
Boss Damage
 ↓
Personal Best
 ↓
다시하기
```

핵심 지표:

> **결과 화면 이후 '한 판 더'를 누르는가?**

이것이 첫 번째 제품 검증이다.

---

# 10. 기존 웹게임을 전부 다시 만들 필요는 없다

기존 게임 내부 로직을 가능한 한 보존한다.

대신 게임의 시작과 종료 규격을 통일한다.

예:

```text
Game Input
- userId
- gameId
- difficulty

Game Output
- score
- accuracy
- combo
- playTime
- result
```

게임 종료 후 공통 시스템이 처리한다.

```text
score
 ↓
EXP
Gold
Record
Boss Damage
Skill Update
Leaderboard
```

따라서 향후 게임을 추가할수록
공통 시스템을 다시 만드는 일이 줄어든다.

---

# 11. DISCOVER의 역할

DISCOVER는 공부 메뉴가 아니다.

역할은:

> **궁금증 생성**

이다.

구성 후보:

- 오늘의 질문
- 1분 수학
- 수학 미스터리
- 역사 속 문제
- 생활 속 이상한 현상
- 짧은 시각 실험

예:

> π도 계산기도 없던 시대에
> 원의 둘레는 어떻게 구했을까?

> 종이를 42번 접으면
> 정말 달까지 갈까?

> 게임은 어떻게 적이 내 앞에 있는지 알까?

DISCOVER에서 중요한 것은
개념을 모두 설명하는 것이 아니다.

관심을 만들고
PLAY 또는 EXPLORE로 넘긴다.

---

# 12. Grok/AI 영상은 더 이상 필수 경로가 아니다

현재 제작에서 생성형 영상이 병목이 될 수 있다.

따라서 제품 개발 pipeline에서 AI 영상 생성을 분리한다.

잘못된 구조:

```text
영상 제작 완료
 ↓
콘텐츠 완성
 ↓
앱 개발
```

권장 구조:

```text
게임 / Lab / 개념 개발 ─────────→ 제품 진행
        │
        │
        └──── AI 영상은 별도 제작 트랙
```

영상이 없어도:

- PLAY 개발 가능
- EXPLORE 개발 가능
- 개념 개발 가능
- RESEARCH 개발 가능

하다.

영상은 DISCOVER 콘텐츠를 강화하는 자산이지
제품 제작을 멈추게 하는 prerequisite가 아니다.

---

# 13. EXPLORE의 역할

EXPLORE는 JP Math Lab의 가장 중요한 장기 경쟁력 중 하나다.

범용 AI가 잘하지 못하는 것은:

> **학생이 수학 대상을 직접 만지고 변화시키는 경험**

이다.

예:

### Graph Lab
점, 슬라이더, 계수를 움직이면 그래프가 실시간 변화.

### Vector Lab
벡터 끝점을 직접 잡고 늘이거나 회전.

### Geometry 3D
카메라 회전, 정사영, 단면, 공간 관계 조작.

### Probability Lab
수백·수천 회 실험을 즉시 실행하고 분포 확인.

### Economy Simulator
이자율, 물가, 투자기간, 대출조건 등을 조절해 결과 비교.

### Data Lab
실제 데이터를 그래프와 통계량으로 탐색.

이것들은 단순 설명 텍스트보다
JP Math Lab의 훨씬 강한 자산이 된다.

---

# 14. Concept는 앱과 웹에서 깊이를 다르게 한다

현재 웹앱에는 개념 설명이 존재한다.

이 자산을 버리지 않는다.

다만 모바일과 웹에서 표현을 다르게 한다.

## APP — Concept Lite

목적:

> 게임 전에 빠르게 이해하거나,
> 게임 후 틀린 개념을 짧게 보완

구조:

```text
핵심 질문
 ↓
짧은 애니메이션
 ↓
핵심 개념 한 문장
 ↓
예시 하나
 ↓
PLAY
```

30초~2분 수준.

## WEB — Concept Full

목적:

> 제대로 이해하고 공부

구조:

```text
개념
 ↓
직관적 설명
 ↓
다양한 예
 ↓
그래프 / 3D / 시뮬레이션
 ↓
문제
 ↓
Lab
 ↓
탐구 확장
```

따라서:

> **APP = Concept Lite  
> WEB = Concept Full**

이다.

---

# 15. 앱과 웹을 연결하는 핵심 — Activity Continuity

예:

학생이 앱에서 벡터 게임을 한다.

```text
Vector Game
Score 7,820
 ↓
Vector Skill Lv.4
```

그 후 PC 웹에 로그인한다.

웹 HOME:

```text
최근 활동
벡터 게임 최고점수 7,820

추천:
"내적이 방향을 판단하는 이유"

[3D Vector Lab 이어하기]
```

반대로 웹에서 미분 개념을 공부했다면
모바일 앱에서는:

```text
최근 공부:
순간변화율

추천 PLAY:
Secant → Tangent Challenge
```

처럼 이어질 수 있다.

이것이 단순한 앱+웹보다 강하다.

---

# 16. 콘텐츠는 하나의 'Content Family'로 관리한다

v8의 핵심 개념을 제품 구조에 본격 적용한다.

예:

```text
CONTENT: 벡터의 내적

├─ conceptLite
├─ conceptFull
├─ video
├─ quickGame
├─ lab3D
├─ researchSeeds
├─ teacherNotes
└─ relatedContent
```

즉,

> 하나의 개념을 앱용, 웹용으로 각각 따로 제작하는 것이 아니라
> 하나의 수학 아이디어에서 여러 경험이 파생된다.

---

# 17. Content ID가 생태계의 중심이 된다

예:

```text
contentId: vector-dot-product-001
```

이 Content ID에 다음이 연결된다.

```text
course
concept
difficulty
tags

conceptLite
conceptFull

games[]
labs[]
videos[]
researchSeeds[]

prerequisites[]
nextConcepts[]
relatedContent[]
```

그러면 학생의 활동도:

```text
userId
contentId
activityType
score
timestamp
```

형식으로 연결할 수 있다.

이 구조가 쌓이면
추천 시스템을 만들기 쉬워진다.

---

# 18. RESEARCH는 '보고서 생성기'가 아니다

v11에서 명확히 한다.

학생이 해야 할 것:

> **보고서는 학생이 직접 작성한다.**

JP Math Lab은 보고서를 대신 작성하지 않는다.

RESEARCH의 역할은:

- 좋은 질문 발견
- 수학적 핵심 확인
- 실험 방향 제안
- 데이터 수집 방법
- 그래프 후보
- 변수 설정
- 탐구 순서
- 확장 질문
- 흔한 오류
- 관련 Lab 연결

이다.

---

# 19. RESEARCH의 사용자 흐름

```text
RESEARCH
 ↓
관심분야 선택
 ↓
주제 후보 탐색
 ↓
주제 선택
 ↓
Basic Guide
 ↓
[Deep Dive 열기]
 ↓
Rewarded Ad
 ↓
Deep Dive Unlock
 ↓
Lab / Data / Experiment
 ↓
학생이 직접 탐구
 ↓
학생이 직접 보고서 작성
```

---

# 20. 학생 유료 크레딧 구조는 v11에서 폐기한다

v10에서는:

- Deep Dive 유료
- 설계 코치
- 데이터 코치
- 보고서 피드백
- 크레딧

등을 검토했다.

v11에서는 초기 학생 제품에서 이를 제거한다.

이유:

1. 범용 AI와 직접 경쟁하게 된다.
2. 결제 UX가 복잡해진다.
3. 앱스토어 결제 정책을 초기부터 고려해야 한다.
4. 결제보다 retention 검증이 먼저다.
5. 학생에게 금전적 장벽을 만들 필요가 없다.

따라서 학생 초기 모델:

```text
FREE
+
REWARDED ADS
```

로 단순화한다.

---

# 21. 광고의 역할

광고는 기본 학습을 막는 벽이 되어서는 안 된다.

기본 원칙:

> **기본 학습은 광고 없이 가능  
> 추가 보상과 깊은 선택 기능은 Rewarded Ad**

예:

### PLAY

```text
게임 끝
 ↓
기본 EXP / Gold 지급

선택:
광고 보고 Bonus Gold 받기
```

### RESEARCH

```text
주제 검색
 ↓
Basic Guide 무료

선택:
광고 보고 Deep Dive 해금
```

강제 전면 광고를 자주 삽입하는 구조는 피한다.

---

# 22. Deep Dive는 '광고 1회 = 영구 해금'을 우선 검토한다

학생 입장에서 같은 콘텐츠를 다시 볼 때마다
광고를 보게 하면 사용 경험이 나빠질 수 있다.

권장:

```text
Deep Dive
 ↓
Rewarded Ad 1회
 ↓
userId + contentId unlock 저장
 ↓
이후 자유롭게 다시 열람
```

이는 광고를 학습 방해 요소가 아니라
선택적 unlock으로 만든다.

---

# 23. AI 비용 전략

텍스트 AI의 비용 자체보다 중요한 것은 호출 구조다.

가장 나쁜 방식:

```text
광고 1회
 ↓
항상 긴 AI 생성 1회
```

더 좋은 구조:

```text
Verified Seed DB
 ↓
Pre-generated Deep Dive
 ↓
Cache
 ↓
학생에게 제공
```

AI는 필요한 경우에만 사용한다.

예:

- 관심사 매칭
- 난이도 변환
- 질문 변형
- 중복 탐지
- 개인화 추천

즉:

> **AI는 콘텐츠 그 자체가 아니라 콘텐츠를 연결하는 두뇌**

로 둔다.

---

# 24. AI의 핵심 역할 — Router

예:

학생 관심:

```text
농구
```

수학:

```text
이차함수
```

AI/추천 엔진:

```text
농구 슛 궤적
 ↓
포물선 Discover
 ↓
Shot Trajectory Lab
 ↓
각도 조절 Game
 ↓
Research Seed
```

이렇게 연결한다.

이것이 단순한:

> "농구와 이차함수로 탐구주제 써줘"

보다 훨씬 강하다.

---

# 25. JP Math Lab의 진짜 경쟁력

범용 AI가 쉽게 복제할 수 있는 것:

- 개념 설명
- 주제 20개
- 보고서 목차
- 질문 생성
- 요약
- 일반적인 예시

JP Math Lab이 구축해야 하는 것:

- 실제 게임
- 직접 조작하는 Lab
- 3D 공간
- 실험 시뮬레이션
- 실제 데이터 도구
- 검증된 수학 콘텐츠
- 콘텐츠 간 연결
- 학생 활동 기록
- 실력/관심 기반 다음 활동 추천

따라서 moat는:

> **TEXT가 아니라 EXPERIENCE + CONNECTION + HISTORY**

다.

---

# 26. 사용자 데이터 구조의 기본 틀

초기에는 지나치게 복잡하게 만들 필요가 없다.

예:

```text
users/{uid}

profile
  nickname
  grade
  interests

progress
  totalExp
  level
  gold
  streak

skillMap
  algebra
  calculus
  geometry
  probability
  statistics

records
  gameId
  highScore

unlocks
  contentId
  deepDiveUnlocked

saved
  researchTopics

history
  activity
  timestamp
```

나중에 확장한다.

---

# 27. 인증 구조의 기본 방향

하나의 계정이 앱과 웹에서 동일하게 작동해야 한다.

```text
Google Login ┐
             ├─ Auth UID
Apple Login ─┘
                  │
                  ↓
               USER DB
                  │
           APP ↔ WEB 공유
```

동일한 사용자가 로그인 방식만 달라져
계정이 중복 생성되지 않도록
계정 linking 전략도 이후 설계한다.

---

# 28. 첫 프로토타입에서는 무엇을 만들 것인가

전체 구조를 설계하되
전체를 구현하지 않는다.

첫 프로토타입의 목적:

> **Math Play + Meta Game loop가 재미있는가?**

따라서:

```text
LOGIN
 ↓
HOME
 ↓
PLAY
 ↓
기존 게임 1개
 ↓
RESULT
 ↓
EXP / GOLD
 ↓
BOSS DAMAGE
 ↓
PERSONAL BEST
 ↓
RETRY
```

여기까지.

---

# 29. 첫 프로토타입에서 만들지 않아도 되는 것

처음부터 필요 없음:

- 영상 대량 제작
- 모든 개념 이전
- 카드 수십 장
- 완전한 가챠
- 글로벌 랭킹
- 학교 랭킹
- 탐구 AI 전체
- 교사용 Studio
- 광고 실제 연결
- iOS/Android Store 출시
- 모든 게임 모바일 최적화

구조만 확장 가능하게 잡는다.

---

# 30. 1차 개발 단계

## Phase 0 — Structure

- 공통 User 구조
- Content 구조
- Game Result 규격
- 앱 HOME 구조

## Phase 1 — Playable Prototype

- Google 로그인
- 테스트용 계정 구조
- 기존 게임 1개
- 모바일 UI
- 결과 화면
- EXP
- Gold
- Boss
- 최고점수
- Retry

목표:

> 한 판 더 하는가?

## Phase 2 — Meta Game

- 게임 3~5개
- 카드/캐릭터 최소버전
- Weekly Challenge
- Skill Map
- Firebase 기록

## Phase 3 — Ecosystem

- Discover
- Concept Lite
- Web Concept Full 연결
- Explore Lab 연결
- Research entry

## Phase 4 — Revenue Test

- Rewarded Ad
- Deep Dive unlock
- Game bonus
- 광고 수익 / AI 비용 / 서버 비용 측정

## Phase 5 — Native App

- Capacitor
- Android
- iOS
- Push
- Store submission

---

# 31. 웹앱은 무엇을 고쳐야 하는가

웹 전체를 앱처럼 바꿀 필요는 없다.

수정 우선순위:

### 1. 공통 로그인

앱과 동일 UID 사용.

### 2. 공통 콘텐츠 ID

현재 개념/게임/Lab을
Content Family로 연결.

### 3. 모바일 링크

앱에서 웹의 Deep Experience를 열 수 있게 한다.

### 4. 최근 활동

앱에서 한 활동이 웹에서 보이게 한다.

### 5. UI 정리

첫 화면 기능 과다 노출을 줄이고
메뉴형 구조로 정돈.

즉:

> **웹을 버리는 리뉴얼이 아니라
> 생태계에 연결하는 리팩터링**

이다.

---

# 32. 모바일과 웹의 대표 경험 비교

| 기능 | 모바일 APP | WEB |
|---|---|---|
| 로그인 | Google / Apple | 동일 계정 |
| 게임 | 핵심 | 가능 |
| EXP/성장 | 핵심 | 확인 가능 |
| Concept | Lite | Full |
| 영상 | 핵심 접근 | 아카이브 |
| Graph | 간단 조작 | 깊은 조작 |
| 3D Geometry | 간단 | Full Lab |
| Research | 주제 발견 | 깊은 탐구 |
| Report | 직접 작성 | 직접 작성 지원 자료 |
| Teacher | 거의 없음 | 향후 Studio |

---

# 33. 학생 경험의 이상적인 장기 흐름

### 게임에서 시작하는 학생

```text
PLAY
 ↓
게임 실패
 ↓
Concept Lite
 ↓
다시 PLAY
 ↓
성공
 ↓
관련 Lab
 ↓
관심 저장
 ↓
Research Seed
```

### 호기심에서 시작하는 학생

```text
DISCOVER
 ↓
"왜?"
 ↓
Concept Lite
 ↓
Lab
 ↓
Game
 ↓
Research
```

### 수행평가에서 시작하는 학생

```text
RESEARCH
 ↓
관심분야
 ↓
주제 후보
 ↓
Deep Dive
 ↓
Experiment / Lab
 ↓
학생 탐구
 ↓
학생 직접 보고서
```

세 경로는 서로 연결된다.

---

# 34. 추천 시스템의 미래 방향

초기에는 AI 추천이 없어도 된다.

규칙 기반으로 충분하다.

예:

```text
미분 게임 3회 실패
→ 순간변화율 Concept Lite 추천

Vector Game 최고점 갱신
→ Dot Product Lab 추천

경제수학 관심 + 복리 게임
→ 장기 투자 Research Seed 추천
```

데이터가 쌓인 후 AI를 추가한다.

AI를 먼저 만들고
사용자를 기다리는 순서를 피한다.

---

# 35. Teacher 영역은 학생 앱과 분리한다

학생 앱의 목적:

> 학습 / 플레이 / 발견 / 탐구

Teacher Studio의 목적:

> 관찰 / 진단 / 수업 운영 / 실제 자료 정리

향후 교사 영역은 주로 WEB에서 구현하는 것이 자연스럽다.

예:

```text
Class
Assignments
Activity
Skill Map
Research Progress
Observation Notes
Student Outputs
```

그리고 실제 관찰과 학생 산출물에 기반하여
교사 업무를 보조한다.

학생 앱의 UX와
Teacher Studio UX를 억지로 합치지 않는다.

---

# 36. 광고만으로 서버를 유지할 수 있는가에 대한 제품적 판단

초기 단계에서는
정확한 광고 수익보다 비용구조를 단순하게 만드는 것이 중요하다.

비용을 낮추는 핵심:

- 게임은 클라이언트 실행
- 그래프/Lab도 가능한 한 클라이언트 실행
- Deep Dive는 캐시/DB 재사용
- AI 실시간 호출 최소화
- 영상은 미리 제작
- 이미지도 미리 제작
- 사용자 데이터만 서버 저장

즉:

> **서버가 수학을 계산하는 구조가 아니라
> 학생의 상태를 저장하는 구조**

로 만든다.

그러면 사용자가 늘어도
비용 증가를 비교적 통제하기 쉽다.

---

# 37. 지금 가장 중요한 것은 수익화가 아니다

v11에서 제품 우선순위를 다시 고정한다.

```text
1. 재미
2. 재방문
3. 수학적 가치
4. 콘텐츠 연결
5. 운영비
6. 수익화
```

광고 위치와 eCPM을 최적화하는 것은
사용자가 생긴 이후다.

지금 질문은:

> **학생이 이걸 두 번째로 열 것인가?**

이다.

---

# 38. 첫 번째 성공 기준

첫 프로토타입을 학생에게 보여줬을 때
가장 좋은 반응은:

> "이거 또 해도 돼요?"

이다.

아직 다음은 중요하지 않다.

- 영상 몇 개인가
- 탐구주제 몇 개인가
- 광고 얼마 버나
- 앱스토어 출시했나
- AI가 얼마나 고급인가

첫 loop에서 학생이 다시 플레이한다면
나머지는 확장할 근거가 생긴다.

---

# 39. v10에서 v11로 변경된 결정 정리

### 유지

- 기존 수학게임 유지
- Meta Game 추가
- 탐구 Seed Engine
- 학생/교사 분리
- Rewarded Ad
- AI는 활동을 대신하지 않음
- Teacher Studio 장기 가능성

### 변경

```text
학생 유료 Deep Dive
→ Rewarded Ad Deep Dive

학생 크레딧
→ 제거

AI Report Coach 중심
→ 학생 직접 작성

AI 텍스트 가치 중심
→ 게임/Lab/경험 중심

웹을 앱으로 전환
→ APP + WEB 역할 분리

영상 제작 선행
→ 영상 제작 별도 트랙
```

---

# 40. v11의 제품 원칙 10개

1. **PLAY가 초기 재방문 엔진이다.**
2. **수학게임을 RPG가 덮어버리지 않는다.**
3. **앱은 짧고, 웹은 깊다.**
4. **계정과 데이터는 하나다.**
5. **콘텐츠 원본도 하나다.**
6. **Concept는 Lite와 Full로 깊이를 나눈다.**
7. **학생 보고서는 학생이 직접 쓴다.**
8. **광고는 기본 학습을 막지 않고 선택적 보상에 쓴다.**
9. **AI는 콘텐츠를 대신 만드는 제품이 아니라 경험을 연결하는 Router다.**
10. **첫 성공 기준은 결제가 아니라 재플레이다.**

---

# 41. v11의 최종 아키텍처

```text
                           JP MATH LAB
                                │
                       ┌────────┴────────┐
                       │  COMMON ACCOUNT │
                       └────────┬────────┘
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
              MOBILE                          WEB
                 │                             │
          ┌──────┼──────┐                 DEEP LEARNING
          │      │      │                      │
        PLAY  DISCOVER EXPLORE             CONCEPT FULL
          │      │      │                  GRAPH / 3D
          │      │      │                  SIMULATION
          └──────┬──────┘                  RESEARCH FULL
                 │                             │
              RESEARCH                         │
                 └─────────────┬───────────────┘
                               │
                      CONTENT FAMILY DB
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
       GAME                   LAB                  CONTENT
         │                     │                     │
      Score                 Activity              Concept
      EXP                   Progress              Video
      Gold                  Skill                 Research
         └─────────────────────┬─────────────────────┘
                               │
                           USER HISTORY
                               │
                        RECOMMENDATION
                               │
                         NEXT EXPERIENCE
```

---

# 42. v11 최종 선언

JP Math Lab은

> **모든 기능이 들어 있는 거대한 수학 웹사이트**

를 만드는 프로젝트가 아니다.

또한

> **AI가 학생 대신 과제를 만들어주는 서비스**

도 아니다.

JP Math Lab은:

> **학생이 수학을 게임으로 반복하고,
> 짧은 질문으로 발견하고,
> 직접 조작하며 이해하고,
> 자기 관심사로 탐구까지 확장하는 경험을
> 하나의 계정 아래 연결하는 플랫폼**

이다.

모바일은 학생을 다시 데려온다.

> **PLAY → 반복**

DISCOVER는 질문을 만든다.

> **왜?**

EXPLORE는 직접 만지게 한다.

> **아, 이렇게 되는구나.**

WEB은 깊게 이해하게 한다.

> **왜 그런지 제대로 보자.**

RESEARCH는 자기 문제로 확장한다.

> **이걸 내가 한번 탐구해볼까?**

그리고 그 모든 활동이 하나의 기록으로 이어진다.

최종적으로 JP Math Lab의 중심은:

> **CONTENT가 아니라 CONNECTED EXPERIENCE**

다.

그리고 첫 번째 제작 목표는 아주 작게 잡는다.

> **로그인 → 게임 1개 → 점수 → EXP/Gold → 보스 → 다시하기**

이 한 줄을 실제 학생이 반복해서 누르게 만들 수 있다면,
JP Math Lab의 나머지 구조는 그 위에 쌓을 수 있다.
