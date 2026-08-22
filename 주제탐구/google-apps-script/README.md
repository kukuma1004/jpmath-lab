# Google Apps Script 학생 질문함

이 폴더의 `Code.gs`와 `Index.html`은 비공개 Google Sheet에 연결되는 학생용 질문함 소스입니다.

## 연결되는 시트

- `학생발문`: 학생 코드, 탐구 주제, 현재 질문, 발문 3개
- `학생답변`: 학생이 제출할 때마다 새 행으로 누적
- `설정`: 제출 허용 여부와 기본 설정

## 배포 원칙

1. Google Sheet의 `확장 프로그램 → Apps Script`에서 바운드 스크립트를 엽니다.
2. 기본 `Code.gs`를 이 폴더의 파일로 교체합니다.
3. HTML 파일 `Index`를 추가하고 `Index.html`의 내용을 붙여 넣습니다.
4. `배포 → 새 배포 → 웹 앱`을 선택합니다.
5. 실행 사용자는 교사, 접근 사용자는 수업 상황에 맞는 Google 계정 사용자 범위로 설정합니다.

## 현재 배포

- 학생 질문함: <https://script.google.com/macros/s/AKfycbyYJW6ky8BG42cTKOf2Wc0eWAhESrD3gep_oCzRGV6M4woWyoMPSpV257Oi206G-CerBg/exec>
- 실행 사용자: 교사 계정
- 접근 범위: Google 계정으로 로그인한 모든 사용자
- 학생은 웹앱에서 자신의 학생 코드만 입력하며, Google Sheet는 공유하지 않습니다.

학생 답변에는 스프레드시트 수식 삽입을 방지하는 처리가 적용되어 있습니다. 학생 코드는 공개 전시 JSON에 넣지 않습니다.
