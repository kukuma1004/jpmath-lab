# 3D BILLIARDS · Phase 1

제이피매쓰랩에 추가하는 3D 당구 게임의 첫 단계입니다. 현재는 **포켓 없는 캐롬 테이블의 자유 연습**을 플레이할 수 있습니다. 3구·4구의 공 배치는 연습용이며 경기 규칙·점수·승리 판정은 아직 없습니다.

## 실행

이 저장소 루트에서 `python -m http.server 5190 --bind 127.0.0.1`을 실행한 뒤 <http://127.0.0.1:5190/games/billiards/>를 엽니다. 실행 파일은 `index.html`과 `assets/`이며 CDN이나 별도 계정, 서버 API가 필요하지 않습니다. `file://`로 직접 여는 방식은 모듈·Worker 보안 제한으로 지원하지 않습니다.

개발은 `games/billiards/source/`에서 진행합니다.

```powershell
npm ci
npm run dev
npm test
npm run build
npm run test:browser
npm run inspect:canvas
```

개발 서버는 5191번 포트를 사용합니다. 빌드는 타입 검사를 거친 뒤 `source/dist/`에 생성하고, 빌드가 성공하면 게임 폴더에 필요한 정적 파일만 복사합니다. 다른 게임과 기존 저장 데이터는 읽거나 변경하지 않습니다. 로컬 설정은 `jpmath-billiards-settings-v1` 키에만 저장합니다. 브라우저 검증 명령은 위의 5190번 정적 서버를 켠 상태에서 사용합니다.

## 조작

- 당구대에서 좌우 드래그: 조준. 방향키: 0.1도 미세 조준, Shift를 누르면 0.01도.
- 파워: 슬라이더. 당점: 공 패널을 누르거나 드래그. 패널에 포커스 후 방향키도 지원.
- Space 또는 샷 버튼: 타격. 움직이는 동안 재타격·수구 교체·배치 변경 차단.
- V: 탑뷰/큐 시점. R: 탑뷰 초기화. 휠/두 손가락: 확대. 우클릭 드래그: 카메라 회전.
- Esc: 일시정지. 메뉴에서 자동 카메라·소리·품질·움직임 줄이기 설정.
- 배치 메뉴: 기본 4공, 정면 충돌, 쿠션, 밀기/끌기, 3공 연습.
- 이전 샷 재생: 샷 직전 상태·입력을 재사용하며 샷 수를 늘리지 않습니다.
- 샷 기록: 공/쿠션 접촉의 시간 순서. 모바일에서도 별도 창으로 열 수 있습니다.

## 구현과 확장 경계

- `src/physics/`: Three.js에 의존하지 않는 SI 단위의 전용 물리. 240Hz 업데이트, 구면 swept time-of-impact, 선속도/각속도, 접촉 충격량, Coulomb 마찰, 구름/미끄럼/정지, 물리 이벤트와 스냅샷.
- `src/game/GameManager.ts`: 조준→큐 스트로크→운동→정지 상태, 일시정지, 재생. 고정 스텝 누적기는 여기에만 존재합니다.
- `src/game/PredictionWorker.ts`: 같은 엔진을 Worker에서 실행하는 **최대 10초** 경로 보조. 득점이나 AI는 수행하지 않습니다.
- `src/render/`: 실제 규격 테이블과 공, 절차적 재질, 큐·카메라·그림자. 물리 상태를 수정하지 않습니다.
- `src/physics/types.ts`: 종목별 테이블과 순서 기록을 소비할 `RuleEngine` 계약. 경기 규칙 구현을 가장하지 않습니다.
- `src/game/AudioManager.ts`: Web Audio로 합성하는 교체 가능한 충돌음. 실제 녹음 에셋은 아직 없습니다.

물리 계수는 `src/physics/config.ts`에서 조정합니다. 모델·수식과 실제 장비 보정 여부는 [physics-model.md](artifacts/physics-model.md)를 확인하세요. 정면/비스듬/다중/고속 충돌, 에너지·운동량, 미끄럼→구름, 밀기/끌기, 쿠션 회전, 정지와 결정성을 자동 검증합니다. **실제 당구대 고속 촬영 데이터에 대한 보정·오차 검증은 아직 하지 않았습니다.** 쿠션은 평면 강체 접촉 근사이며 점프·마세·스쿼트·미스큐·유한 질량 큐 충돌은 포함하지 않습니다.

## 다음 단계

1. Phase 2: 국내식 4구 규칙 프로필, 2인 대전, 점수·턴·이닝·승리 판정.
2. Phase 3: 순서 이벤트에 기반한 3쿠션 판정과 경기 규칙.
3. Phase 4: 별도 테이블·포켓/낙하 물리와 WPA 8볼, 볼 인 핸드·콜샷.
4. Phase 5: 샷 입력과 물리 복제를 공유하는 Worker AI, 종목 전략·4단계 예산.
5. Phase 6: 실제 물리 보정, 녹음 사운드, 실기기 성능·입력 검수 및 최종 완성도.

현재 상태와 검증 증거는 [game-progress.md](artifacts/game-progress.md), [final-evidence.md](artifacts/final-evidence.md)에 기록합니다. 로컬 검증과 공개 배포·실기기 검증은 별개입니다. 이번 작업에는 공개 배포가 포함되지 않습니다.

## 기술 참고와 라이선스

- [Three.js](https://threejs.org/): MIT. Vite npm 번들에 포함, 원문 라이선스는 `THIRD_PARTY_NOTICES.txt`.
- 물리 공식 참고: [Evan Kiefl의 billiards physics](https://ekiefl.github.io/2020/04/24/pooltool-theory/), [pooltool 접촉 모델 문서](https://pooltool.readthedocs.io/en/latest/autoapi/pooltool/physics/index.html). 해당 구현 코드를 복사하지 않았습니다.
- 재질·모델·텍스처·충돌음은 이 프로젝트에서 코드로 생성합니다. 외부 이미지·모델·음원 다운로드가 없습니다.
