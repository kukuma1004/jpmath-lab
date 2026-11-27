# 와르르 온라인 1:1

계정을 만든 뒤 방 코드로 친선전을 열거나 공개 랭킹전에 참가합니다. 친선전 승패는 순위에 반영하지 않습니다. 랭킹 점수는 1000에서 시작하고 서버가 상대 점수와 승패로 계산합니다.

## 로컬 실행

`games/cannon-hill/source`에서 Node.js 22 이상을 사용합니다.

```sh
npm ci
npm run build:online
npm run start:online
```

브라우저에서 `http://127.0.0.1:8787/`을 엽니다. `npm run check:online`은 별도 테스트 서버와 브라우저 두 개를 띄워 친선전, 포격 동기화, 재접속, 랭킹전, 재로그인을 확인합니다.

## 공개 서버

빌드 결과인 `dist/`와 `online-dist/server.mjs`를 서비스에 올립니다. 서버는 하나의 Node.js 프로세스로 실행하고, HTTPS 프록시 뒤에 둡니다. `PORT`와 `WARUREU_HOST`로 사용할 주소를 지정하고, `WARUREU_DATA_DIR`는 영속 디스크의 비공개 디렉터리로 지정합니다. 계정과 순위는 그 경로에 저장됩니다. 진행 중인 방과 로그인 세션은 프로세스를 재시작하면 초기화됩니다.

같은 서버에서 게임을 여는 경우 기본 빌드를 사용합니다. 기존 GitHub Pages 화면에서 서버를 연결하는 경우 게임 빌드의 `VITE_WARUREU_ONLINE_URL`을 공개 HTTPS 주소의 `/api/warureu/v1`까지 지정하고, 서버의 `WARUREU_WEB_ORIGIN`을 `https://kukuma1004.github.io`로 설정합니다. 서버 주소 없이 빌드한 Pages에서는 일반전과 표적전을 이용할 수 있습니다.
