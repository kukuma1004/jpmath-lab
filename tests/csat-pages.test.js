/* 수능 기출 탐구 페이지(학생용·교사용)를 지킨다.

   이 폴더는 여러 도구(사람, 뮤즈, 클로드)가 번갈아 채운다. 그러다 보니
   쪽마다 뼈대가 달라져서 이런 일이 실제로 있었다.

     · 스타일·스크립트를 같은 폴더 경로("jp-dark.css")로 불러 와 404 가 되고,
       배경은 흰색인데 글자색은 어두운 테마용이라 밝은 글자가 흰 바탕에 놓였다.
     · 교사용 자료에 수업창고 잠금(auth.js)이 빠져 비밀번호 없이 열렸다.
     · 문제를 시험지 캡처로 넣었는데, 위에 머리글이 잘려 남고 아래는 큰 여백이었다.
     · KaTeX 를 외부 CDN 에서 받아 학교 망이 막으면 수식이 통째로 사라진다.
     · 학생용에서 교사용으로 가는 길이 있었다.

   여기서는 그런 것들을 모두 막는다. 수식이 맞는지는 이 파일의 일이 아니다. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const STUDENT_DIR = '수능문제/미적분1';
const TEACHER_DIR = '수업창고/수능문제/미적분1';

const html = (dir) => fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.html')).map((f) => path.join(dir, f));
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

const students = html(STUDENT_DIR);
const teachers = html(TEACHER_DIR);
assert.ok(students.length >= 10, `학생용 탐구실이 열 쪽은 넘어야 한다 — 지금 ${students.length}쪽`);
assert.ok(teachers.length >= 10, `교사용 수업자료가 열 쪽은 넘어야 한다 — 지금 ${teachers.length}쪽`);

/* 페이지가 불러오는 자기 저장소 안의 파일은 모두 실제로 있어야 한다 */
function localRefs(page) {
  const src = read(page);
  const refs = [];
  for (const m of src.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const u = m[1];
    if (/^(https?:|\/\/|data:|mailto:|javascript:)/.test(u)) continue;
    if (/\.(css|js|json|png|jpg|jpeg|webp|svg)$/i.test(u)) refs.push(u);
  }
  return refs;
}
for (const page of [...students, ...teachers]) {
  for (const ref of localRefs(page)) {
    const target = path.join(ROOT, path.dirname(page), decodeURIComponent(ref));
    assert.ok(fs.existsSync(target), `${page} 가 없는 파일을 불러온다 — ${ref}`);
  }
}

/* 학생용 */
for (const page of students) {
  const src = read(page);
  const body = src.slice(src.indexOf('<body'));
  assert.doesNotMatch(src, /cdn\.jsdelivr\.net\/npm\/katex/, `${page} 가 KaTeX 를 외부 CDN 에서 받는다 — vendor/katex 를 써야 한다.`);
  assert.match(src, /vendor\/katex\/katex\.min\.js/, `${page} 에 저장소 안의 KaTeX 가 없다.`);
  /* 디자인 시스템이 둘 있다(jp-dark 계열, jp-explore 계열). 어느 쪽이든 저장소 안의 공통 스타일을 써야 한다. */
  assert.match(src, /href="\.\.\/\.\.\/jp-[a-z-]+\.css/, `${page} 에 저장소의 공통 스타일(jp-*.css)이 없다.`);
  assert.doesNotMatch(src, /auth\.js/, `${page} 는 학생용이라 수업창고 잠금이 있으면 안 된다.`);
  assert.doesNotMatch(src, /수업창고|교사용_/, `${page} 에서 교사용 자료로 가는 길이 있다.`);
}

/* 이번에 다시 짠 여섯 쪽은 문제를 캡처가 아니라 조판한 글로 싣는다.
   (앞서 만든 쪽 가운데 원문 이미지를 쓰는 것은 따로 있으므로 여기서만 요구한다.) */
const TYPESET = ['2022수능14번', '2022수능22번', '2021수능나형20번', '2021수능나형30번', '2020수능나형20번', '2020수능나형30번'];
for (const id of TYPESET) {
  const page = path.join(STUDENT_DIR, id + '_탐구실.html');
  assert.ok(fs.existsSync(path.join(ROOT, page)), `${page} 가 없다.`);
  const src = read(page);
  const body = src.slice(src.indexOf('<body'));
  assert.doesNotMatch(body, /<img\b/i, `${page}: 문제를 캡처 이미지로 넣지 말고 조판한 글로 싣는다.`);
  assert.match(body, /class="qtext"/, `${page}: 조판한 문제 본문(qtext)이 없다.`);
  assert.match(body, /<div class="cnt-lab"/, `${page}: 손으로 움직이는 판이 하나도 없다.`);
  assert.match(src, /jp-nav-2\.js/, `${page}: 사이트 공통 메뉴가 없다.`);
  assert.match(src, /href="\.\.\/\.\.\/jp-dark\.css/, `${page}: 공통 스타일(jp-dark.css)이 저장소 경로로 걸려 있지 않다.`);
  assert.match(src, /src="\.\.\/\.\.\/jp-lab-dark\.js/, `${page}: 수식·실험실 스크립트(jp-lab-dark.js)가 저장소 경로로 걸려 있지 않다.`);
  // 문제를 먼저 풀어 보고 마지막에 다시 확인하는 흐름
  assert.match(body, /id="nav"/, `${page}: 단계 이동 막대가 없다.`);
  const chapters = (body.match(/<section class="ch/g) || []).length;
  assert.ok(chapters >= 4 && chapters <= 6, `${page}: 단계가 ${chapters}개 — 넷에서 여섯 사이여야 한다.`);
}

/* 교사용 */
for (const page of teachers) {
  const src = read(page);
  assert.match(src, /auth\.js[^>]*data-classroom-protected/, `${page}: 수업창고 잠금(auth.js data-classroom-protected)이 없다.`);
  assert.doesNotMatch(src, /cdn\.jsdelivr\.net\/npm\/katex/, `${page} 가 KaTeX 를 외부 CDN 에서 받는다.`);
  assert.match(src, /noindex/, `${page}: 검색에 잡히지 않게 noindex 가 있어야 한다.`);
}
for (const id of TYPESET) {
  const stem = id.startsWith('2022') ? id : id;
  const page = path.join(TEACHER_DIR, '교사용_' + stem + '_수업자료.html');
  assert.ok(fs.existsSync(path.join(ROOT, page)), `${page} 가 없다.`);
  const src = read(page);
  assert.match(src, /jp-deck\.js/, `${page}: 발표 스크립트가 없다.`);
  assert.doesNotMatch(src.slice(src.indexOf('<body')), /<img\b/i, `${page}: 캡처 이미지가 들어 있다.`);
  assert.ok((src.match(/<section class="slide/g) || []).length >= 8, `${page}: 슬라이드가 여덟 장은 되어야 한다.`);
  // 수업의 흐름: 문제 → 지도 → 관문 → 회수 → 교사 체크 → 결론
  for (const part of ['문제와 만나기', '수업의 지도', '회수', '교사 체크', '수업의 결론']) {
    assert.ok(src.includes(`data-title="${part}"`), `${page}: "${part}" 슬라이드가 없다.`);
  }
}

/* 두 목록의 카드가 실제 파일을 가리키고, 빠진 쪽이 없어야 한다 */
for (const [indexPage, dir, label] of [['수능문제/index.html', STUDENT_DIR, '학생용'], ['수업창고/수능문제/index.html', TEACHER_DIR, '교사용']]) {
  const src = read(indexPage);
  const linked = [...src.matchAll(/href="(미적분1\/[^"]+\.html)"/g)].map((m) => decodeURIComponent(m[1]));
  for (const l of linked) {
    assert.ok(fs.existsSync(path.join(ROOT, path.dirname(indexPage), l)), `${label} 목록이 없는 파일을 가리킨다 — ${l}`);
  }
  for (const f of html(dir).map((p) => path.basename(p))) {
    if (f.startsWith('_')) continue;
    assert.ok(linked.some((l) => l.endsWith(f)), `${label} 목록에 빠진 쪽이 있다 — ${f}`);
  }
}

console.log(`수능 기출 페이지 검사 통과 — 학생용 ${students.length}쪽 · 교사용 ${teachers.length}쪽 · 다시 짠 ${TYPESET.length}문제(캡처 없음·잠금·경로·메뉴·목록)`);
