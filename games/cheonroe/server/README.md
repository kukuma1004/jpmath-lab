# 천뢰 시즌 1 공개 랭킹

Firebase 프로젝트 `jpmathlab`의 Realtime Database 중 `cheonroeV1/season-20261120-1/{difficulty}/{hero}/{anonymousUid}`만 사용합니다. 난이도는 `normal`과 `story`, 전사는 `rin`, `golem`, `ryu`입니다. `cheonroe-ranking-v1`이라는 별도 Firebase 앱에서 사용자가 직접 등록/삭제를 누를 때만 익명 인증합니다. 공개 목록을 볼 때는 인증 계정을 만들지 않습니다.

각 보드는 점수 정렬로 최대 100개만 공개 조회합니다. 본인 UID만 기록을 읽고 쓰거나 삭제할 수 있습니다. 서버 시각, 10초 갱신 간격, 닉네임, 필드 허용 목록, 숫자 범위, 경로 일치, 최고 점수 보전을 검사합니다. 동점 갱신은 당시 통계와 클리어 여부를 유지하며 닉네임을 바꿀 수 있습니다. 클라이언트는 ETag 조건부 쓰기로 동시 갱신을 보호합니다.

`ranking.rules.fragment.json`은 천뢰 분기만 포함하는 **부분 규칙**입니다. `deploy-rules.mjs`는 현재 운영 규칙을 읽어 해당 분기만 병합하고, 다른 모든 분기의 정렬된 SHA-256이 유지되는지 확인합니다. 기본 동작은 dry-run이며 `--apply`에서만 배포합니다. 운영 규칙 API는 ETag를 제공하지 않아 배포 직전 재조회·전체 해시 대조와 배포 후 readback을 사용합니다. 변경 경합을 발견하면 중단하며 자동 재배포하지 않습니다. 비공개 전체 규칙 사본은 Git에서 제외하는 `.dream-loop/cheonroe/server/`에 보관합니다.

```powershell
node games/cheonroe/server/deploy-rules.mjs --dry-run
node games/cheonroe/server/deploy-rules.mjs --apply
node --test tests/cheonroe-ranking-model.test.mjs
```

도구는 기존 Firebase CLI 로그인을 사용하며 인증 정보를 출력하거나 저장소에 넣지 않습니다. 설치 경로를 자동으로 찾지 못하면 `CHEONROE_FIREBASE_TOOLS`에 설치된 `firebase-tools` 패키지 경로를 지정하세요.

운영과 같은 전체 규칙에 천뢰 분기를 병합한 별도 Auth/Database Emulator에서 `tests/cheonroe-ranking-rules.mjs`를 실행합니다. 두 `FIREBASE_*_EMULATOR_HOST`가 루프백 주소가 아니면 테스트를 중단합니다. 기존 운영 데이터는 테스트 fixture로 복사하지 않습니다.

이 랭킹은 제출 데이터의 형식과 소유권을 검증하는 자율 랭킹이며 플레이 전체의 부정행위를 판별하지 않습니다. 운영 검증에서 생성한 임시 익명 계정과 해당 계정의 기록은 검증 후 삭제합니다. 기존 학생·교사·다른 게임 계정과 기록은 수정하지 않습니다.

Firebase 공식 근거: [query 조건과 규칙](https://firebase.google.com/docs/database/security/rules-conditions), [조건부 쓰기](https://firebase.google.com/docs/database/rest/save-data), [운영 규칙 REST 관리](https://firebase.google.com/docs/database/rest/app-management).
