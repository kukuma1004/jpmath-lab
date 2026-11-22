# 요구 사항 대조

| 요청 | 구현 위치 | 검증 |
|---|---|---|
| 첫 누름 게이지·둘째 누름 샷 | PowerMeter, GameManager.pressShot, main.ts | power-meter/gauge-lifecycle + browser Space/touch |
| 공 충돌·쿠션·회전·마찰·정지·관통·에너지 | physics 모듈; table별 SI 설정 | physics/pocket-physics 40개, seeded 매 tick 검사 |
| 4구 국내식·3구 시간순 3쿠션 | rules/FourBallRules, ThreeCushionRules, MatchController | rules/match 53개, 물리 전체 경기 |
| 8볼 WPA/캐주얼·브레이크·그룹·콜·8번·배치 | EightBallRules, MatchController, pool.ts | 53개 규칙/경기군 + 19개 포켓 물리 + 16샷 전체 랙 |
| AI4단계, 3종 전략, 같은 물리, Worker | ai/candidates, ShotPlanner, difficulty, Worker | ai 8개 + 초기 배치 전체 경기 + 브라우저 실제 Worker 샷 |
| 2인·AI·연습·제한·결과·재대결 | GameManager, main.ts, HTML | game/physical-matches + 브라우저 |
| 탑뷰·큐·자동 전환·휠·핀치·우클릭·키 | SceneManager/main | 실제 입력/9개 상태/회전5종 |
| 당점·기본/고급 보조·실제 예측 | impulse/collision + PredictionWorker | draw/follow/sidespin 물리, 브라우저 당점 |
| 고급 테이블/공/6포켓/다이아몬드/낙하 | render 모듈 | 실제 형상 unit/ray/pixel 캡처, 낙하 pause |
| 메뉴·한국어HUD·모바일·접기·설정 | HTML/CSS/main | 브라우저41 + control14 |
| 사운드·충돌 속도·뮤트·pause | AudioManager | 실제 Web Audio 노드 계측; 합성, 청음 미검증 |
| 연습 공 배치·샷 분석·재생·최근 기록 | GameManager/main local storage | 상태 동일성·실제 편집·브라우저 이력/설정 |
| 60FPS·AI UI 분리·자원 유지 | native GPU + Worker | performance/result 실제 이동 약102FPS, 24회 전환증가0 |
| 확장성과 수치 분리 | rules/types, physics/config, ai/difficulty | TS 타입 검사·9볼은 구조만, 실제 종목 아님 |
| 배포·학생/저장·타 작업 보존 | 전용 worktree, 정적 게임 경로만 | 최신 origin 반영/공개 수신증으로 최종 확인 |

공식 규칙의 물리적으로 관찰할 수 없는 심판 항목, 실제 당구대 영상에 대한 수치 보정, 점프/마세/미스큐, 실제 휴대폰 및 실제 음향 청음은 미검증/미구현 경계다. ‘정확한 실제 당구장 전체 모델 검증 완료’로 확대 해석하지 않는다. 실험적 모델의 설명은 physics-model.md, 원문 규칙은 rules-reference.md에 있다.
