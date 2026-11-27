import { loadOnline, publishOnline, deleteOnline } from './online-ranking.js?v=19';
import { courseRecordId } from './track.js?v=19';

const prefix = 'jp-apex-circuit-times:';
const limit = 20;

function toCentiseconds(seconds) {
  return Math.floor(seconds * 100 + 1e-6);
}

export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '—';
  const centis = toCentiseconds(seconds);
  const part = number => String(number).padStart(2, '0');
  return `${Math.floor(centis / 6000)}:${part(Math.floor(centis / 100) % 60)}.${part(centis % 100)}`;
}

function compare(metric) {
  const other = metric === 'total' ? 'lap' : 'total';
  return (a, b) => a[metric] - b[metric] || a[other] - b[other];
}

export function bindRanking({ tracks, vehicleSpecs, getCourse, getBest, read, save, canPublish }) {
  const byId = id => document.getElementById(id);
  const dialog = byId('ranking');
  const course = byId('ranking-course');
  const table = byId('ranking-table');
  const listbox = byId('ranking-list');
  const rows = table.tBodies[0];
  const empty = byId('ranking-empty');
  const best = byId('ranking-best');
  const status = byId('ranking-status');
  const publish = byId('ranking-publish');
  const nickname = byId('ranking-nickname');
  const submit = byId('ranking-submit');
  const remove = byId('ranking-delete');
  const buttons = Array.from(dialog.querySelectorAll('[data-order]'));
  const scopes = Array.from(dialog.querySelectorAll('[data-scope]'));
  const models = new Map(vehicleSpecs.map(spec => [spec.id, spec.name]));
  const temporary = new Map();
  let metric = 'total';
  let scope = 'online';
  let online = [];
  let requestId = 0;
  let busy = false;
  let ownUid = read('jp-apex-circuit-ranking-uid');
  nickname.value = read('jp-apex-circuit-nickname') || '레이서' +
    crypto.getRandomValues(new Uint32Array(1))[0].toString(36).slice(0, 5).toUpperCase();

  function isTime(value) {
    return Number.isSafeInteger(value) && value > 0;
  }

  function readTimes(key) {
    if (temporary.has(key)) return temporary.get(key);
    try {
      const list = JSON.parse(read(key));
      if (!Array.isArray(list)) return [];
      return list.filter(row => row && models.has(row.model) &&
        isTime(row.total) && isTime(row.lap) && row.lap <= row.total);
    } catch {
      return [];
    }
  }

  function record(trackId, model, totalSeconds, lapSeconds) {
    trackId = courseRecordId(trackId);
    const total = toCentiseconds(totalSeconds);
    const lap = toCentiseconds(lapSeconds);
    if (!models.has(model) || !isTime(total) || !isTime(lap) || lap > total) return;
    const key = prefix + trackId;
    const store = () => {
      const list = [...readTimes(key), { model, total, lap }];
      const fastestRuns = list.slice().sort(compare('total')).slice(0, limit);
      const fastestLaps = list.sort(compare('lap')).slice(0, limit);
      const kept = [...new Set([...fastestRuns, ...fastestLaps])];
      if (save(key, JSON.stringify(kept))) temporary.delete(key);
      else temporary.set(key, kept);
    };
    const refresh = () => {
      if (dialog.open && course.value === trackId) render();
    };
    if (navigator.locks?.request) navigator.locks.request(key, store).catch(store).then(refresh);
    else {
      store();
      refresh();
    }
  }

  function render() {
    const local = readTimes(prefix + course.value);
    const list = (scope === 'online' ? online.filter(run => run && models.has(run.model) &&
      isTime(run.total) && isTime(run.lap) && typeof run.nickname === 'string') : local)
      .slice().sort(compare(metric)).slice(0, scope === 'online' ? 100 : limit);
    const bestLap = getBest(course.value);
    best.textContent = bestLap === null ? '' : `내 최고 랩  ${formatTime(bestLap)}`;
    best.hidden = bestLap === null;
    table.hidden = !list.length;
    table.dataset.scope = scope;
    empty.hidden = !!list.length || (scope === 'online' && !!status.textContent);
    empty.textContent = scope === 'online' ? '아직 공개 기록이 없어요. 첫 번째 기록에 도전해 보세요.' :
      '이 코스를 완주하면 순위표에 기록이 남아요.';
    byId('ranking-driver-heading').hidden = scope !== 'online';
    byId('ranking-scope').textContent = scope === 'online' ? '코스별 상위 100명 · 닉네임으로 참가' : '이 브라우저에서 달린 기록';
    publish.hidden = scope !== 'online';
    nickname.disabled = busy;
    submit.disabled = busy || !local.length || !canPublish;
    remove.hidden = !ownUid;
    remove.disabled = busy;
    byId('ranking-publish-note').textContent = local.length ? '닉네임·차량·기록이 공개돼요.' : '이 코스를 완주한 뒤 기록을 등록해 보세요.';
    for (const button of scopes) button.setAttribute('aria-pressed', String(button.dataset.scope === scope));
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.order === metric));
    for (const heading of table.querySelectorAll('[data-metric]')) {
      if (heading.dataset.metric === metric) heading.setAttribute('aria-sort', 'ascending');
      else heading.removeAttribute('aria-sort');
    }
    let lastTime, rank;
    rows.replaceChildren(...list.map((run, index) => {
      if (run[metric] !== lastTime) rank = index + 1;
      lastTime = run[metric];
      const row = document.createElement('tr');
      if (rank <= 3) row.dataset.podium = rank;
      if (run.uid === ownUid) row.classList.add('ranking-mine');
      const values = [['rank', rank]];
      if (scope === 'online') values.push(['nickname', run.nickname + (run.uid === ownUid ? ' · 나' : '')]);
      values.push(['model', models.get(run.model)], ['time', formatTime(run.total / 100)], ['lap', formatTime(run.lap / 100)]);
      for (const [column, value] of values) {
        const cell = row.insertCell();
        cell.dataset.column = column;
        cell.textContent = value;
      }
      return row;
    }));
  }

  async function showTop() {
    const id = ++requestId;
    listbox.scrollTop = 0;
    status.textContent = '';
    if (scope === 'local') {
      render();
      return;
    }
    online = [];
    status.textContent = '공개 랭킹을 불러오는 중';
    render();
    try {
      const records = await loadOnline(course.value, metric);
      if (id !== requestId || !dialog.open) return;
      online = records;
      status.textContent = '';
    } catch (error) {
      if (id !== requestId || !dialog.open) return;
      status.textContent = error.message;
    }
    render();
  }
  byId('ranking-refresh').addEventListener('click', showTop);
  for (const button of scopes) button.addEventListener('click', () => {
    scope = button.dataset.scope;
    showTop();
  });
  publish.addEventListener('submit', async event => {
    event.preventDefault();
    const name = nickname.value.trim();
    const courseId = course.value;
    const runs = readTimes(prefix + courseId);
    nickname.setCustomValidity(name ? '' : '공개 닉네임을 입력해 주세요.');
    if (!canPublish || busy || !runs.length || !publish.reportValidity()) return;
    busy = true;
    status.textContent = '최고 기록을 등록하는 중';
    render();
    try {
      await publishOnline(courseId, runs, name, uid => {
        ownUid = uid;
        save('jp-apex-circuit-ranking-uid', uid);
      });
      save('jp-apex-circuit-nickname', name);
      if (dialog.open && course.value === courseId) await showTop();
    } catch (error) {
      status.textContent = error.message;
    } finally {
      busy = false;
      render();
    }
  });
  nickname.addEventListener('input', () => nickname.setCustomValidity(''));
  remove.addEventListener('click', async () => {
    if (busy || !canPublish) return;
    const courseId = course.value;
    busy = true;
    status.textContent = '공개 기록을 삭제하는 중';
    render();
    try {
      await deleteOnline(courseId);
      if (dialog.open && course.value === courseId) await showTop();
    } catch (error) {
      status.textContent = error.message;
    } finally {
      busy = false;
      render();
    }
  });
  for (const track of tracks) {
    course.add(new Option(track.name, courseRecordId(track.id)));
    for (const previous of track.previousRecords || []) course.add(new Option(previous.name, previous.id));
  }
  course.addEventListener('change', showTop);
  for (const button of buttons) button.addEventListener('click', () => {
    metric = button.dataset.order;
    showTop();
  });
  for (const id of ['menu-ranking', 'result-ranking']) byId(id).addEventListener('click', () => {
    course.value = courseRecordId(getCourse());
    metric = 'total';
    dialog.showModal();
    showTop();
  });
  window.addEventListener('storage', event => {
    if (dialog.open && event.key === prefix + course.value) render();
  });
  return record;
}
