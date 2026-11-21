# 와르르 (고개 너머 포싸움)

JP Math Lab의 오리지널 2D 턴제 포격 대전입니다. 바람을 읽고 각도와 힘을 맞춰 고개 너머 상대에게 포탄을 넘깁니다. 땅은 폭발로 파이고, 받침을 잃은 덩어리는 무너지고, 바위는 낙석이 되어 굴러갑니다.

- 공개 경로: `/jpmath-lab/games/cannon-hill/` (표시 이름은 `source/src/game/config/constants.ts`의 `GAME_TITLE` 한 곳에서만 바꿉니다. 폴더 이름과 묶여 있지 않습니다.)
- 모드: AI 대전(쉬움·보통·어려움), 둘이서 하기(한 기기 번갈아)
- 장수 여섯: 화포장군(화포탄/대폭발 진천뢰), 신궁(관통 화살/삼연시), 도깨비(도깨비 폭탄/튕기는 도깨비불), 무당(부적탄/낙뢰 부적), 거북선 장수(철갑 포탄/연속 화포), 구미호(여우불/분열 여우불)
- 전장 다섯: 백두산 화산지대, 조선 산성, 도깨비 숲, 구름 궁궐, 저승의 강(뒤의 둘은 떨어지면 끝)

## 조작

- PC: `A`/`D` 이동, `←`/`→` 포신 돌리기, `↑`/`↓` 올리기·내리기, `Space` 꾹 눌러 힘 모으고 떼면 발사, `1`/`2` 무기, `Tab` 카메라, `Esc` 정지, 마우스 끌기·휠로 둘러보기
- 휴대폰: 화면 아래 ◀ ▶ 이동, ▲ ▼ 각도, ⇄ 방향, 큰 발사 단추를 누르고 있다 떼기. 화면을 끌거나 두 손가락으로 확대

## 구조

개발 원본은 `source/`, 공개 파일은 이 폴더의 `index.html`과 `assets/`입니다.

- `src/game/combat/battle.ts`: 순수 시뮬레이션(고정 1/60초 걸음, 시드 난수, Phaser 없음). 포탄·폭발·지형 붕괴·낙석·캐릭터 낙하·턴 상태 기계.
- `src/game/terrain/terrain.ts`: 2px 셀 격자. 기반암·구조물만 지지점이고, 폭발한 둘레에서만 연결 요소를 찾아 지지점과 끊긴 덩어리를 떼어 냅니다.
- `src/game/ai/ai.ts`: 실제 포탄 물리(`dryShot`)로 후보를 거르고, 상위 후보는 전투를 통째로 복제해 붕괴·낙사까지 돌려 본 뒤 고릅니다. 프레임마다 시간 예산만큼만 생각합니다.
- `src/game/data/*.ts`: 장수·무기·전장 표. 수치는 여기서만 고칩니다.
- `src/game/render/*`, `effects/*`, `scenes/*`: Phaser 3 화면. 지형은 240px 조각으로 나눠 바뀐 조각만 다시 그립니다.
- `src/game/art/*`: 그림. 장수 몸 6장·무기 6장·전장 배경 5장은 ChatGPT로 그려 받은 그림(`source/public/art/*.webp`)을 쓰고, 입자·포탄·지형은 코드로 그립니다. 그림 파일을 못 불러오면 그 자리는 코드로 그린 예전 임시 그림으로 대신합니다.
  - `artAssets.ts`: 장수별 화면 키·앞손 위치(`CHAR_RIG`), 무기별 너비·쥐는 곳(`WEAPON_RIG`). 그림을 바꾸면 이 숫자만 맞추면 됩니다.
  - `artData.ts`: 그림 처리 스크립트가 만든 크기·발 위치(손으로 고치지 않음).
  - 원본과 처리 스크립트는 저장소 밖 `Documents/Claude/2026-11-21/warureu-art`(raw/ 원본, `process.py`: 초록 배경 지우기·자르기·WebP, `prompts.md`: 요청 문구).
  - 고르기 화면·전투 화면 초상은 게임이 몸·무기 그림을 겹쳐 바로 만듭니다.
- `src/game/audio/audio.ts`: 외부 음원 없이 Web Audio로 만든 효과음과 장구 장단 배경음.

## 명령

```powershell
cd games/cannon-hill/source
npm ci
npm test                 # 시뮬레이션 시험(Vitest)
npm run e2e              # 빌드판 브라우저 시험(Playwright, 먼저 npm run build)
npm run bot -- --rounds=2 --diff=normal   # AI끼리 붙여 승률·끼임·턴 정지 확인
npm run build:publish    # 빌드 후 이 폴더로 복사
```

`?qa=1`을 붙이면 시험용 손잡이 `window.__wr`(상태 읽기, 프레임 진행, 직접 발사)가 열립니다. 숨은 미리보기 창은 화면 갱신이 느리니 `__wr.frames(n)`으로 돌려 봅니다.

저장값은 브라우저 localStorage의 `jpml.warureu.` 접두어 아래에만 둡니다.
