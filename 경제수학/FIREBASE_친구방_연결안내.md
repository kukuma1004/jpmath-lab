# 경제수학 실시간 친구방 Firebase 연결 안내

## 현재 상태

경제수학 LIVE에는 다음 구조가 구현되어 있다.

- 진행자: 게임 선택 → 방 만들기 → 6자리 코드 공유
- 참가자: 방 코드와 닉네임으로 입장
- 익명 인증: 학생 Google 계정이나 이메일을 수집하지 않음
- 참가자 목록 실시간 반영
- 각 휴대폰에서 전략 선택
- 선택 내용은 결과 공개 전까지 진행자만 읽을 수 있음
- 모두 제출하면 진행자가 점수를 계산해 결과 동시 공개
- 진행자만 다음 라운드와 재대결을 시작할 수 있음
- 8개 게임이 같은 친구방 구조를 공유

코드는 준비되었지만 현재 JP Math Lab 저장소에는 Firebase 프로젝트 연결 정보가 없어서 실제 실시간 서버는 비활성 상태다. 연결 전에도 `games.html`의 한 기기 체험판 8개는 모두 작동한다.

## 선생님이 Firebase 콘솔에서 할 일

### 1. 프로젝트와 웹 앱 준비

1. [Firebase 콘솔](https://console.firebase.google.com/)에서 프로젝트를 만든다.
2. 웹 앱을 추가한다.
3. 발급된 `firebaseConfig`의 값을 확인한다.

### 2. 익명 로그인과 Realtime Database 켜기

1. Authentication의 로그인 방식에서 `익명`을 활성화한다.
2. Realtime Database를 만든다.
3. 처음부터 공개 테스트 규칙을 쓰지 말고, 이 폴더의 `firebase-database.rules.json`을 규칙 화면에 붙여 넣는다.

Firebase 공식 문서:

- https://firebase.google.com/docs/auth/web/anonymous-auth
- https://firebase.google.com/docs/database/web/start
- https://firebase.google.com/docs/database/security

### 3. 웹 연결 정보 넣기

`firebase-config.example.js`를 참고해 `firebase-config.js`의 `null`을 실제 설정으로 바꾼다.

```js
window.JPEconomyFirebaseConfig = {
  apiKey: '...',
  authDomain: '...',
  databaseURL: '...',
  projectId: '...',
  appId: '...'
};
```

Firebase 웹 구성 값은 브라우저에서 사용하는 프로젝트 식별 정보이며 비밀번호가 아니다. 실제 데이터 보호는 Authentication과 Realtime Database 보안 규칙이 담당한다.

## 저장 구조

```text
economyRooms/{roomCode}
├─ hostId
├─ gameId
├─ status
├─ round
├─ eventOrder
├─ submittedCount
├─ players/{uid}
│  ├─ nickname
│  ├─ score
│  └─ connected
└─ results/{uid}
   ├─ strategyId
   ├─ delta
   └─ score

economyChoices/{roomCode}/{round}/{uid}
├─ strategyId
└─ submittedAt
```

`economyChoices`는 진행자만 읽을 수 있고 각 참가자는 자기 선택만 쓸 수 있다. 결과 공개 단계에서 진행자가 계산한 결과만 `economyRooms`에 공개한다.

## 개인정보 원칙

- 실명, 학번, 이메일, Google 계정을 게임 데이터에 저장하지 않는다.
- 닉네임은 최대 12자로 제한한다.
- 방은 2~6명으로 제한한다.
- 채팅과 무작위 상대 찾기는 넣지 않는다.
- 수업 후 오래된 방을 정리하는 자동 만료 기능은 Firebase 연결 이후 추가한다.

## 연결 후 검증할 내용

1. 휴대폰 두 대에서 같은 코드로 입장
2. 참가자 수와 닉네임이 동시에 반영되는지 확인
3. 서로 다른 전략을 제출해도 공개 전에는 보이지 않는지 확인
4. 모든 참가자 제출 후 결과가 동시에 나타나는지 확인
5. 진행자가 아닌 참가자는 라운드를 넘길 수 없는지 확인
6. 새로고침과 일시적인 연결 끊김 뒤 재접속 확인
7. 6명 동시 제출과 8개 게임 전체 회귀 확인
