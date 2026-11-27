# 에이펙스 서킷 공개 랭킹

Realtime Database의 `apexCircuitV1/{course}/{total|lap}/{anonymousUid}`에 닉네임·차량·완주 시간·최고 랩·서버 등록 시각을 저장합니다. 순위표는 코스별 상위 100개를 조회합니다. 참가자가 완주 뒤 등록 버튼을 누르면 해당 코스의 최고 완주 기록과 최고 랩을 각각 갱신합니다.

코스 ID는 `sunset`, `summit`, `metro`, `frost`, `redrock`, `windway`, `foundry`입니다. 새 코스는 기존 기록 경로를 유지한 채 허용 목록에 추가합니다.

해상·제철소 슬라럼 개편 이후 기록은 `windway-slalom`, `foundry-slalom`에 저장합니다. 기존 `windway`, `foundry` 기록과 로컬 최고 랩은 보존하며 순위표의 `이전 배치` 항목에서 조회할 수 있습니다. 나머지 다섯 코스의 저장 키는 동일합니다.

장거리 도심·해상 연결교 개편 기록은 `metro-marina`, `windway-offshore`에 저장합니다. 기존 `metro`, `windway-slalom`, `windway` 기록은 별도 항목으로 보존하며 새 배치 기록과 합산하지 않습니다.

Firebase 앱 이름은 `apex-circuit-v1`입니다. 기록은 익명 UID 소유자만 개선·삭제할 수 있습니다. 조건부 요청으로 동시에 제출한 최고 기록의 손실을 방지합니다. 브라우저의 주행 결과를 제출하며 서버는 소유권·필드·시간 범위를 검사합니다. 주행 진위 검증은 브라우저의 제출 기록에 의존합니다.

`ranking.rules.fragment.json`은 부분 규칙입니다. 운영 규칙 최신본에 `apexCircuitV1`을 병합한 뒤 기존 분기와 게시 후 readback을 비교합니다. 조회 상한과 조건부 쓰기는 Firebase 문서를 참고했습니다. [조회 조건](https://firebase.google.com/docs/database/security/rules-conditions), [조건부 쓰기](https://firebase.google.com/docs/database/rest/save-data#section-conditional-requests)

공식 항만 그랑프리 타임어택은 `apexCircuitRankedV1/board/{anonymousUid}`를 사용합니다. Model 3으로 2랩을 완주하면 0.01초 단위 구간 기록과 합계가 자동 제출됩니다. `official-ranking.rules.fragment.json`은 기존 분기와 함께 병합합니다. 서버 규칙은 익명 UID 소유권과 최고 기록 갱신, 고정 차량 및 구간 합계를 검사합니다. 코스나 공용 차량의 공식전 주행 성능이 바뀌면 새 버전 경로를 사용합니다.
