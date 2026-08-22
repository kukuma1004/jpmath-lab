# 2026 Mathematical Inquiry Project 공개 전시

이 폴더에는 웹에 공개해도 되는 자료만 둡니다.

## 구성

```text
주제탐구/
├─ index.html              전체 전시 홈페이지
├─ inquiry.html            학생별 큐레이터형 공통 페이지
├─ exhibition.css
├─ exhibition.js
├─ data/inquiries.json     익명화된 공개 데이터
└─ apps/                   검수·공개 승인된 학생 웹앱
```

## 공개 데이터 갱신

1. 별도 로컬 작업 폴더에서 학생 원본을 정리합니다.
2. 성취기준 코드·학생 원문·수학적 정확성·공개 동의를 확인합니다.
3. 실명, 교사 관찰, 평가, 세특 메모를 제거합니다.
4. 검수한 공개본만 `data/inquiries.json`에 반영합니다.
5. 학생 웹앱은 `apps/학생ID/과목/index.html` 경로로 복사하고 JSON의 `studentApp.entry`를 연결합니다.

## 보안 주의

`수업창고`의 브라우저 비밀번호는 화면 접근을 가리는 장치일 뿐, GitHub Pages에 올라간 파일을 암호화하지 않습니다. PRIVATE JSON은 이 저장소 어디에도 두지 않습니다.
