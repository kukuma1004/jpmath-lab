import { officialEvent } from './official-event.js?v=19';
import { identity, request } from './online-ranking.js?v=19';
import { formatTime } from './ranking.js?v=19';

const board = 'https://jpmathlab-default-rtdb.asia-southeast1.firebasedatabase.app/' + officialEvent.board;
const nicknameKey = 'jp-apex-circuit-official-nickname-v1';
const bestKey = 'jp-apex-circuit-official-best-v1';
const validName = name => typeof name === 'string' && name.trim() === name &&
  /^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 _.-]{1,12}$/.test(name);
const validSplit = time => Number.isSafeInteger(time) && time >= 850 && time <= 8640000;
const validRun = run => run && validName(run.nickname) && run.model === officialEvent.vehicle &&
  validSplit(run.lap1) && validSplit(run.lap2) && run.time === run.lap1 + run.lap2;
const clock = centiseconds => formatTime(centiseconds / 100);

async function publish(run) {
  const user = await identity();
  const token = await user.getIdToken();
  const url = `${board}/${encodeURIComponent(user.uid)}.json?auth=${encodeURIComponent(token)}`;
  const { nickname, model, time, lap1, lap2 } = run;
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await request(url, { headers: { 'X-Firebase-ETag': 'true' } });
    const previous = await response.json();
    if (previous && previous.time <= time) return { ...previous, uid: user.uid };
    const etag = response.headers.get('etag');
    if (!etag) break;
    const update = await request(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'if-match': etag },
      body: JSON.stringify({ nickname, model, time, lap1, lap2, submittedAt: { '.sv': 'timestamp' } })
    });
    if (update.status !== 412) return { nickname, model, time, lap1, lap2, uid: user.uid };
  }
  throw new Error('공식 기록 등록을 다시 시도해야 해요.');
}

export function bindOfficialRanking({ read, save, onStart, canPublish }) {
  const byId = id => document.getElementById(id);
  const dialog = byId('official-ranking');
  const table = byId('official-table');
  const empty = byId('official-empty');
  const bestLine = byId('official-best');
  const nickname = byId('official-nickname');
  const feedback = byId('official-feedback');
  let offlineBest = null;
  let inFlight;
  let refreshNumber = 0;

  function readBest() {
    try {
      const saved = JSON.parse(read(bestKey));
      if (validRun(saved) && (!offlineBest || saved.time <= offlineBest.time)) return saved;
    } catch { /* A malformed local record can be replaced after the next finish. */ }
    return offlineBest;
  }

  function store(run) {
    // Keep an in-memory copy when storage is blocked by the browser.
    offlineBest = save(bestKey, JSON.stringify(run)) ? null : run;
  }

  function transaction(work) {
    return navigator.locks ? navigator.locks.request(bestKey, work) : Promise.resolve(work());
  }

  function updateBest() {
    const run = readBest();
    bestLine.textContent = '내 최고 기록 ' + (run ? clock(run.time) + (run.pending ? ' · 등록 대기' : '') : '—');
  }

  function sync() {
    if (!canPublish) return Promise.resolve(false);
    inFlight ??= (async () => {
      let run = readBest();
      while (run?.pending) {
        const accepted = await publish(run);
        await transaction(() => {
          const latest = readBest();
          if (!latest || accepted.time <= latest.time) store({ ...accepted, pending: false });
        });
        run = readBest();
      }
      return true;
    })().catch(() => false).finally(() => {
      inFlight = null;
      updateBest();
    });
    return inFlight;
  }

  async function refresh() {
    const current = ++refreshNumber;
    updateBest();
    const waiting = readBest()?.pending;
    feedback.textContent = waiting ? '저장한 기록을 등록하는 중이에요.' : '';
    const connected = waiting ? await sync() : true;
    if (current !== refreshNumber) return;
    feedback.textContent = connected ? '' : '기록은 이 브라우저에 보관했어요. 연결되면 다시 등록합니다.';
    const query = new URLSearchParams({ orderBy: '"time"', limitToFirst: '100' });
    try {
      const response = await request(`${board}.json?${query}`);
      const rows = Object.entries(await response.json() || {})
        .filter(([, run]) => validRun(run)).sort((a, b) => a[1].time - b[1].time);
      if (current !== refreshNumber) return;
      const own = readBest()?.uid;
      let position = 1;
      table.tBodies[0].replaceChildren(...rows.map(([uid, run], index) => {
        if (index && run.time !== rows[index - 1][1].time) position = index + 1;
        const row = document.createElement('tr');
        if (uid === own) row.className = 'ranking-mine';
        if (position <= 3) row.dataset.podium = position;
        [position, run.nickname + (uid === own ? ' (나)' : ''), clock(run.time)].forEach((value, column) => {
          const cell = row.insertCell();
          cell.dataset.column = ['rank', 'nickname', 'time'][column];
          cell.textContent = value;
        });
        return row;
      }));
      table.hidden = !rows.length;
      empty.hidden = !!rows.length;
      empty.textContent = '첫 공식 기록에 도전해 보세요.';
    } catch {
      if (current !== refreshNumber) return;
      table.hidden = true;
      empty.hidden = false;
      empty.textContent = '순위표에 연결하지 못했어요. 새로고침을 눌러 주세요.';
    }
  }

  function open() {
    nickname.value = read(nicknameKey) || readBest()?.nickname || read('jp-apex-circuit-nickname') || '';
    dialog.showModal();
    refresh();
  }

  byId('official-ranking-open').addEventListener('click', open);
  byId('official-result-board').addEventListener('click', open);
  byId('official-refresh').addEventListener('click', refresh);
  byId('official-start-form').addEventListener('submit', event => {
    event.preventDefault();
    const name = nickname.value.trim();
    if (!validName(name)) {
      nickname.setCustomValidity('한글, 영문, 숫자, 공백, 점, 밑줄, 하이픈으로 1~12글자를 입력해 주세요.');
      nickname.reportValidity();
      return;
    }
    save(nicknameKey, name);
    dialog.close();
    onStart(name);
  });
  nickname.addEventListener('input', () => nickname.setCustomValidity(''));
  window.addEventListener('online', () => dialog.open ? refresh() : sync());
  if (readBest()?.pending) sync();

  return async function record(race, name, show) {
    const [lap1, end] = race.lapEnds.map(seconds => Math.floor(seconds * 100 + 1e-6));
    const run = { nickname: name, model: race.cars[0].vehicleId, time: end, lap1, lap2: end - lap1 };
    if (!race.finished || !validRun(run)) {
      show('공식 기록을 등록할 수 없어요.', readBest());
      return;
    }
    const improved = await transaction(() => {
      const previous = readBest();
      if (previous && previous.time <= run.time) return false;
      store({ ...run, pending: true });
      return true;
    });
    show(improved ? '새 개인 최고 기록 등록 중…' : '내 최고 기록을 유지했어요.', readBest());
    const connected = await sync();
    const best = readBest();
    const message = !canPublish ? '테스트 기록을 이 브라우저에 저장했어요.' :
      !connected ? '기록을 보관했어요. 연결되면 자동 등록합니다.' :
      improved && best?.time === run.time ? '공식 랭킹에 새 개인 최고 기록을 등록했어요.' :
        '내 최고 기록을 유지했어요.';
    show(message, best);
    if (dialog.open) refresh();
  };
}
