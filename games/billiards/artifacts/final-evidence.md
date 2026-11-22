# 3D BILLIARDS 1.0 · 구현과 검증

4구·3쿠션·8볼, AI 4단계·2인 로컬·연습, 왕복 파워 게이지를 실제 실행 코드로 구현했다. **한 번 눌러 게이지 시작, 다시 눌러 타격**하며 세부 당점은 기본으로 접힌다. 이전 Phase 1 자료는 과거 기록이며 현재 검증은 아래 complete-* 자료를 사용한다.

## 실행한 검증

- `npm test`: 10개 파일, **120개 통과**. 수식/보존량/고속 충돌/회전/마찰/정지, 3종 규칙, 경기 상태, 파워, AI, 실제 물리 전체 경기를 포함한다.
- `npm run build`: TypeScript 검사와 프로덕션 빌드 통과. 현재 정적 파일은 [build-manifest](../build-manifest.json)의 6개. Three.js 분리 번들 542.77 kB(압축 138.12 kB)는 Vite의 500 kB 안내를 초과하지만 런타임 CDN·원격 에셋·외부 폰트를 사용하지 않는다.
- `npm run test:browser`: [41개 통과](complete-browser/result.json). 실제 마우스/Space/터치 샷, 게이지 시작·취소·일시정지, 중복 입력 차단, 정지, 세 종목 승패/재생, Worker AI, 설정/기록, WPA 콜 누락 방지·배치·선택, 5종 화면 크기, 일반 URL의 QA 비노출. 콘솔/페이지/HTTP 오류 0, 서버/계정 쓰기 0.
- `node scripts/control-regression.mjs`: [14개 통과](control-regression/result.json). CDP의 실제 터치 이벤트로 드래그·핀치·취소 복구·무단 샷 방지, 연습 수구 전환/공 재배치, 화면 회전. Web Audio 생성 노드를 계측해 사용자 제스처 해제, 타격/굴림 소스, pause/mute와 반복 토글의 단일 루프를 확인했다. 실제 스피커 청음 검사는 아니다.
- `npm run inspect:canvas`: [manifest](evidence.json)의 데스크톱/터치 화면 **9개 상태 통과**. 움직이는 캐롬/포켓, 큐 시점, 게이지, 실제 종료, pause를 각각 적용하고 캡처했다. GPU는 AMD Radeon 780M D3D11. 자원 예산 초과·빈 캔버스·페이지 오류 없음.
- `node scripts/performance-check.mjs`: [측정](performance/result.json). 1440×900, DPR1, 실제 이동 중 캐롬 102.90FPS / 8볼 102.48FPS, p95 10.1ms. 전문가 4구 Worker 탐색 394ms. 워밍업 이후 테이블 24회 교체의 geometry/texture 증가 0/0. 이 값은 이 PC의 native new-headless Chrome 측정이다.
- [포켓 렌더 개별 검증](pool-render-pass/result.json): 6개 실제 천 구멍·쿠션 형상 일치, 낙하 pause/숨김/복구, 24회 교체. 해당 과거 개별 검사는 SwiftShader이며 FPS 근거로 쓰지 않는다.

## 경기·AI 증거

[초기 배치부터 물리 샷만 사용한 경기](bot-matches/)에서 4구 2샷, 3쿠션 3샷, WPA 8볼 16샷 후 실제 승패로 종료했다. 목표 1점의 캐롬과 전체 15개 목적구 랙의 8볼이며, 모든 샷은 실제 공이 정지할 때까지 적분했다. safetyStops=0. 유리한 마지막 배치를 직접 만든 전체 경기라고 표시하지 않는다. 브라우저의 종료 검사는 이 경기의 마지막 샷 전 상태를 로드한 후 **마지막 샷을 물리로 다시 실행**한 제한된 시나리오다. 전체 경기 증거는 별도의 원시 trace다.

AI는 공개된 현재 상태에서 후보를 생성하고 사람과 동일한 PhysicsEngine/ShotInput으로 평가한다. 난이도는 후보 수·쿠션 탐색·회전·볼 인 핸드 탐색·위치/파울 가중치와 실행 오차를 바꾼다. Worker를 사용해 렌더와 분리한다. [설계 및 예산](ai-design.md). ‘전문가’는 게임 내 난이도 이름이며 실제 선수와의 실력 대조는 없다.

## 시각 검수

[데스크톱 캐롬](complete-visual/desktop-active.png), [8볼 이동](complete-visual/desktop-pool.png), [큐](complete-visual/desktop-cue.png), [게이지](complete-visual/desktop-gauge.png), [종료](complete-visual/desktop-result.png), [모바일](complete-visual/mobile-active.png), [모바일 포켓 큐](complete-visual/mobile-pool-cue.png), [pause](complete-visual/mobile-pause.png). 실제 샷/전환 모션 영상은 complete-browser의 로컬 webm으로 보존하고 사이트 소스에서 제외했다.

장르 대응은 Hero=당구대/공/큐, Obstacles=쿠션·포켓, Interactables=공/조준/타격이다. 점수는 패키지의 1/2/3 앵커를 기준으로 현재 전체 캡처를 직접 관찰했다. 이전 전체 게임의 비교 캡처는 없어 before는 not captured다.

| 항목 | Before | After | 관찰 근거 |
|---|---|---:|---|
| 아트 방향 | not captured | 2.5 | 월넛·브라스·푸른 천, 게임과 메뉴의 동일한 재질·색·타이포 계층 |
| Hero | not captured | 2.5 | 규격 테이블, 분할 쿠션·마커·프레임, 회전 번호공과 큐 스트로크 |
| 장애물/제약 | not captured | 2.5 | 6개 천 구멍과 실제 jaws, 캐롬/포켓 외형과 물리 형상 일치 |
| 상호작용 | not captured | 2.5 | 타격 대기/게이지/콜 포켓/배치 유효 상태와 결과 안내 |
| 환경 | not captured | 2 | 바닥·의자·사이드 테이블, 불필요한 장식 대신 테이블 읽기 우선 |
| 재질 | not captured | 2.5 | 천 결·목재·금속·번호/줄무늬, 공유 재질과 자원 측정 |
| 조명 | not captured | 2 | 노출/톤매핑·구 반사·접촉 그림자, 낮은 품질의 그림자 비용 절약 |
| 모션 | not captured | 2 | 준비-타격-충돌·카메라 보간·포켓 낙하, pause 일관성. 과장된 이펙트 제외 |
| UI | not captured | 2.5 | 스포츠 점수판·큰 2회 샷·접힌 세부·별도 특수 조작과 화면 회전 |
| 성능 증거 | not captured | 2.5 | 하드웨어 renderer/프레임/AI/자원, 9개 캡처와 5종 레이아웃 |

평균 **2.35**, 최저2. 플레이 캡처의 entropy 3.16~4.54, edge 0.075~0.148, contrast 80.8~118.5. pause/종료는 의도적으로 어두운 배경과 대화상자를 사용하므로 픽셀 값이 플레이 화면보다 낮다. 시각 점수는 판단 자료이며 물리 정확도의 증명이 아니다.

## 한계와 배포

수식과 불변량 기반 검증을 통과한 **평면 점접촉 모델**이다. 실제 당구대 고속 영상에 대한 계수 보정/오차 측정, 실제 휴대폰, 점프·마세·스쿼트·미스큐, 쿠션 변형 모델 및 사람의 발/의복/큐 접촉 심판 판정은 구현·검증하지 않았다. 임의 굴절로 회전을 흉내 내지 않지만 실제 프로 경기 장비와의 동일성은 주장하지 않는다. 9볼은 확장 구조만 제공한다. 소리는 교체 가능한 합성 효과음이다.

배포 대상은 [공개 게임](https://kukuma1004.github.io/jpmath-lab/games/billiards/). 배포 완료는 현재 릴리스 SHA와 일치하는 Pages 성공, 공개 파일 SHA-256, 공개 URL의 브라우저 플레이를 함께 확인해야 한다. 최종 수신증은 로컬 `C:/Users/이소아빠/Documents/Codex/2026-11-20/billiards-deployment/full-game-public/`에 저장해 커밋 자체의 해시를 파일 안에 넣는 순환을 피한다. 학생 자료·다른 게임·다른 저장 키는 수정하지 않는다.
