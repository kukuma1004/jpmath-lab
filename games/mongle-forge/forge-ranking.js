'use strict';

const ForgeRanking = (() => {
  const config = {
    projectId: 'jpmathlab', apiKey: 'AIzaSyD9mHiQ8Cyh4zJKbyhW_oYZkcu3WPMYw3k',
    authDomain: 'jpmathlab.firebaseapp.com', appId: '1:1061208248935:web:839fa3cc986bc687cebac2',
  };
  const base = 'https://jpmathlab-default-rtdb.asia-southeast1.firebasedatabase.app/mongleForgeV1/';
  const profileKey = 'jp-math-lab:mongle-forge:ranking-profile';
  let session;

  async function identity() {
    if (!session) session = (async () => {
      const [appSdk, authSdk] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js'),
      ]);
      const app = appSdk.getApps().find(entry => entry.name === 'mongle-forge-ranking-v1') ||
        appSdk.initializeApp(config, 'mongle-forge-ranking-v1');
      const auth = authSdk.getAuth(app);
      await auth.authStateReady();
      if (!auth.currentUser) await authSdk.signInAnonymously(auth);
      return auth.currentUser;
    })().catch(() => {
      session = null;
      throw new Error('랭킹 등록에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.');
    });
    return session;
  }

  async function request(url, options = {}) {
    try {
      const response = await fetch(url, { ...options, signal: AbortSignal.timeout(12000) });
      if (!response.ok && response.status !== 412) throw new Error();
      return response;
    } catch {
      throw new Error('랭킹에 연결하지 못했어요. 연결을 확인한 뒤 다시 시도해 주세요.');
    }
  }

  function validRecord(record) {
    return record && typeof record.value === 'string' && /^[0-9]{512}$/.test(record.value) &&
      typeof record.level === 'string' && /^(0|[1-9][0-9]{0,127})$/.test(record.level) &&
      typeof record.nickname === 'string' && record.nickname.length <= 12 &&
      typeof record.weaponName === 'string' && record.weaponName.length <= 16 &&
      [record.effect1, record.effect2, record.effect3].every(id => id === 'none' || Forge.enchantments.some(effect => effect.id === id));
  }

  async function list() {
    const query = new URLSearchParams({ orderBy: '"value"', limitToLast: '100' });
    const response = await request(base + Forge.seasonId + '.json?' + query);
    return Object.entries(await response.json() || {}).filter(([, record]) => validRecord(record))
      .map(([uid, record]) => ({ ...record, uid })).sort((a, b) => a.value === b.value ?
        a.submittedAt - b.submittedAt || a.uid.localeCompare(b.uid) : a.value > b.value ? -1 : 1);
  }

  async function publish(record, onOwner) {
    const user = await identity();
    onOwner(user.uid);
    const token = await user.getIdToken();
    const url = base + Forge.seasonId + '/' + encodeURIComponent(user.uid) + '.json?auth=' + encodeURIComponent(token);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await request(url, { headers: { 'X-Firebase-ETag': 'true' } });
      const previous = await response.json();
      if (previous && previous.value > record.value) return { kept: true, record: previous };
      const payload = previous && previous.value === record.value ? {
        ...previous, nickname: record.nickname, weaponName: record.weaponName,
      } : record;
      const update = await request(url, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'if-match': response.headers.get('etag') },
        body: JSON.stringify({ ...payload, submittedAt: { '.sv': 'timestamp' } }),
      });
      if (update.status !== 412) return { kept: false, record: payload };
    }
    throw new Error('다른 창에서 기록이 갱신됐어요. 다시 등록해 주세요.');
  }

  async function remove() {
    const user = await identity();
    const token = await user.getIdToken();
    await request(base + Forge.seasonId + '/' + encodeURIComponent(user.uid) + '.json?auth=' + encodeURIComponent(token), { method: 'DELETE' });
  }

  function mount({ getState, capture, fmt, asset }) {
    const $ = id => document.getElementById(id);
    const dialog = $('ranking');
    let profile = {};
    try {
      const saved = JSON.parse(localStorage.getItem(profileKey) || '{}');
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) profile = saved;
    } catch {}
    let busy = false;
    let generation = 0;
    function saveProfile() {
      try { localStorage.setItem(profileKey, JSON.stringify(profile)); } catch {}
    }
    function element(tag, className, text) {
      const item = document.createElement(tag);
      item.className = className;
      if (text !== undefined) item.textContent = text;
      return item;
    }
    function status(text) { $('ranking-status').textContent = text; }
    function controls() {
      $('ranking-submit').disabled = busy || getState().broken;
      $('ranking-delete').disabled = busy;
      $('ranking-delete').hidden = !profile.uid;
      $('ranking-refresh').disabled = busy;
      $('ranking-submit').textContent = busy ? '연결 중…' : '현재 무기 등록';
    }
    function preview() {
      const state = getState();
      const form = Forge.formAt(state.level);
      $('ranking-preview-image').src = asset(state.broken ? 'broken-sword' : 'sword-' + form.level);
      $('ranking-preview-title').textContent = state.broken ? '깨진 검은 등록할 수 없어요.' : form.name + ' +' + fmt(state.level);
      $('ranking-preview-value').textContent = fmt(Forge.appraisal(state).value) + ' G';
      controls();
    }
    function renderRows(rows) {
      let lastValue;
      let rank;
      $('ranking-list').replaceChildren(...rows.map((record, index) => {
        if (record.value !== lastValue) rank = index + 1;
        lastValue = record.value;
        const row = element('li', 'ranking-row' + (record.uid === profile.uid ? ' ranking-mine' : ''));
        const form = Forge.formAt(BigInt(record.level));
        const image = element('img', 'ranking-weapon');
        image.src = asset('sword-' + form.level);
        image.width = 64; image.height = 64; image.alt = form.name; image.loading = 'lazy';
        const info = element('div', 'ranking-weapon-info');
        info.append(element('strong', '', record.weaponName), element('span', 'ranking-nickname', record.nickname + (record.uid === profile.uid ? ' · 내 무기' : '')));
        const effects = element('div', 'ranking-effects');
        for (const id of [record.effect1, record.effect2, record.effect3]) {
          const effect = Forge.enchantments.find(entry => entry.id === id);
          if (!effect) continue;
          const chip = element('span', '', effect.mark + ' ' + effect.name);
          chip.dataset.enchantment = id;
          effects.append(chip);
        }
        info.append(effects);
        const value = element('div', 'ranking-value');
        value.append(element('strong', '', fmt(BigInt(record.value)) + ' G'), element('span', '', '+' + fmt(BigInt(record.level))));
        value.title = new Intl.NumberFormat('ko-KR').format(BigInt(record.value)) + ' G';
        row.append(element('span', 'ranking-place', String(rank)), image, info, value);
        return row;
      }));
      $('ranking-empty').hidden = rows.length > 0;
    }
    async function refresh(announce = true) {
      const current = ++generation;
      if (announce) status('무기 랭킹을 불러오는 중이에요.');
      try {
        const rows = await list();
        if (current !== generation) return;
        renderRows(rows);
        if (announce) status(rows.length ? '감정가가 같은 무기는 공동 순위예요.' : '이번 시즌의 첫 무기를 등록해 보세요.');
      } catch (error) {
        if (current === generation) status(error.message);
      }
    }
    $('open-ranking').addEventListener('click', () => {
      $('ranking-nickname').value = typeof profile.nickname === 'string' ? profile.nickname : '';
      $('ranking-weapon-name').value = typeof profile.weaponName === 'string' ? profile.weaponName : Forge.formAt(getState().level).name;
      preview(); dialog.showModal(); refresh();
    });
    $('ranking-refresh').addEventListener('click', () => { preview(); refresh(); });
    $('ranking-form').addEventListener('submit', async event => {
      event.preventDefault();
      if (busy) return;
      busy = true; controls();
      ++generation;
      status('무기를 등록하고 있어요.');
      try {
        const record = await capture($('ranking-nickname').value, $('ranking-weapon-name').value);
        const result = await publish(record, uid => { profile.uid = uid; saveProfile(); });
        profile = { uid: profile.uid, nickname: result.record.nickname, weaponName: result.record.weaponName };
        saveProfile();
        status(result.kept ? '등록된 최고 무기의 감정가가 더 높아 기존 기록을 유지했어요.' : '무기를 등록했어요! 더 가치 높은 검으로 기록을 갱신해 보세요.');
        await refresh(false);
      } catch (error) {
        status(error.message);
      } finally {
        busy = false; preview();
      }
    });
    $('ranking-delete').addEventListener('click', async () => {
      if (busy) return;
      busy = true; controls(); ++generation;
      try {
        await remove(); delete profile.uid; saveProfile();
        status('내 공개 무기 기록을 삭제했어요.');
        await refresh(false);
      } catch (error) { status(error.message); }
      finally { busy = false; controls(); }
    });
  }
  return { mount };
})();
