'use strict';

const ForgeRanking = (() => {
  const config = {
    projectId: 'jpmathlab', apiKey: 'AIzaSyD9mHiQ8Cyh4zJKbyhW_oYZkcu3WPMYw3k',
    authDomain: 'jpmathlab.firebaseapp.com', appId: '1:1061208248935:web:839fa3cc986bc687cebac2',
  };
  const base = 'https://jpmathlab-default-rtdb.asia-southeast1.firebasedatabase.app/mongleForgeV1/';
  const profileKey = 'jp-math-lab:mongle-forge:ranking-profile';
  let session;
  const knownUses = value => typeof value === 'string' && /^(0|[1-9][0-9]{0,127})$/.test(value);
  const recordCore = record => ['value', 'level', 'effect1', 'effect2', 'effect3'].map(key => record[key]).concat(record.magic ?? 'none', record.magicPeak ?? '0').join(':');

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
      (record.protectionUses == null || knownUses(record.protectionUses)) &&
      (record.magic == null || record.magic === 'none' && record.magicPeak === '0' || Forge.magics.some(magic => magic.id === record.magic) &&
        typeof record.magicPeak === 'string' && /^[1-9][0-9]{2,127}$/.test(record.magicPeak)) &&
      [record.effect1, record.effect2, record.effect3].every(id => id === 'none' || Forge.enchantments.some(effect => effect.id === id));
  }

  async function list() {
    const query = new URLSearchParams({ orderBy: '"value"', limitToLast: '100' });
    const response = await request(base + Forge.seasonId + '.json?' + query);
    return Object.entries(await response.json() || {}).filter(([, record]) => validRecord(record))
      .map(([uid, record]) => ({ ...record, uid })).sort((a, b) => a.value === b.value ?
        a.uid === b.uid ? 0 : a.uid > b.uid ? -1 : 1 : a.value > b.value ? -1 : 1);
  }

  async function publish(record, onOwner) {
    const user = await identity();
    const token = await user.getIdToken();
    await onOwner(user.uid, token);
    const url = base + Forge.seasonId + '/' + encodeURIComponent(user.uid) + '.json?auth=' + encodeURIComponent(token);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await request(url, { headers: { 'X-Firebase-ETag': 'true' } });
      const previous = await response.json();
      if (previous && previous.value > record.value) return { kept: true, record: previous };
      const payload = previous && previous.value === record.value ? {
        ...previous, nickname: record.nickname, weaponName: record.weaponName,
      } : record;
      payload.rulesVersion = Forge.rankingProtocol;
      payload.magic ??= 'none'; payload.magicPeak ??= '0';
      if (Forge.sameWeaponRecord(previous, record) && knownUses(record.protectionUses) &&
          (!knownUses(previous.protectionUses) || BigInt(record.protectionUses) >= BigInt(previous.protectionUses))) payload.protectionUses = record.protectionUses;
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

  function mount({ getState, capture, fmt, asset, onBonus, onGrant, beforePublish }) {
    const $ = id => document.getElementById(id);
    const dialog = $('ranking');
    let profile = {};
    try {
      const saved = JSON.parse(localStorage.getItem(profileKey) || '{}');
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) profile = saved;
    } catch {}
    if (!profile.nickname) profile.nickname = '몽글' + String(crypto.getRandomValues(new Uint32Array(1))[0] % 10000).padStart(4, '0');
    if (profile.auto !== false) profile.auto = true;
    if (typeof profile.syncedValue !== 'string' || !/^[0-9]{512}$/.test(profile.syncedValue)) profile.syncedValue = null;
    if (!knownUses(profile.syncedProtectionUses)) profile.syncedProtectionUses = null;
    if (typeof profile.syncedCore !== 'string' || profile.syncedCore.split(':').length !== 7) profile.syncedCore = null;
    let busy = false;
    let generation = 0;
    let verifiedUid;
    let nextTry = 0;
    let benefitRequest = 0;
    let grantOwner;
    function saveProfile() {
      try { localStorage.setItem(profileKey, JSON.stringify(profile)); } catch {}
    }
    saveProfile();
    function pending() {
      const best = getState().rankingBest;
      return profile.auto && best && (!profile.syncedValue || best.value > profile.syncedValue || best.value === profile.syncedValue &&
        (!profile.syncedCore || recordCore(best) === profile.syncedCore) && knownUses(best.protectionUses) &&
        (!knownUses(profile.syncedProtectionUses) || BigInt(best.protectionUses) > BigInt(profile.syncedProtectionUses)));
    }
    function autoStatus() {
      $('auto-ranking-name').textContent = (profile.auto ? '자동 등록 · ' : '자동 등록 꺼짐 · ') + profile.nickname;
      $('auto-ranking-status').textContent = !profile.auto ? '이름·설정 변경' : pending() ? nextTry > Date.now() ? '기록 보관 중 · 연결 후 재전송' : '최고 무기 전송 대기' : '파괴 전 기록 자동 보관';
    }
    async function owner(uid, token) {
      verifiedUid = uid; profile.uid = uid; saveProfile();
      if (grantOwner === uid) return;
      try {
        const response = await request(base + 'adminGrants/' + encodeURIComponent(uid) + '.json?auth=' + encodeURIComponent(token));
        const grant = await response.json();
        if (grant) await onGrant(grant);
        grantOwner = uid;
      } catch {}
    }
    async function applyBenefits(rows) {
      const index = verifiedUid ? rows.findIndex(row => row.uid === verifiedUid) : -1;
      await onBonus(index >= 0 && index < 10 ? index + 1 : 0);
    }
    async function syncBenefits() {
      if (!verifiedUid || document.hidden) return;
      const current = ++benefitRequest;
      try {
        const rows = await list();
        if (current === benefitRequest) await applyBenefits(rows);
      } catch { if (current === benefitRequest) await onBonus(0); }
    }
    async function pump() {
      if (busy || !pending() || Date.now() < nextTry) return;
      busy = true; controls(); autoStatus();
      try {
        if (!await beforePublish()) return;
        const best = { ...getState().rankingBest };
        const record = { ...best, rulesVersion: Forge.rankingProtocol, nickname: Forge.rankingName(profile.nickname, 12),
          weaponName: Forge.rankingName(profile.weaponName || Forge.formAt(BigInt(best.level)).name, 16) };
        const result = await publish(record, owner);
        profile.syncedValue = result.record.value; profile.syncedCore = recordCore(result.record);
        profile.syncedProtectionUses = knownUses(result.record.protectionUses) ? result.record.protectionUses : null; saveProfile(); nextTry = 0;
        await syncBenefits();
        if (dialog.open) await refresh(false);
      } catch { nextTry = Date.now() + 10000; }
      finally { busy = false; controls(); autoStatus(); }
    }
    function changed() { autoStatus(); queueMicrotask(pump); }
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
      $('ranking-list').replaceChildren(...rows.map((record, index) => {
        const rank = index + 1;
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
        const magic = Forge.magicAt({ broken: false, level: BigInt(record.level), magic: { id: record.magic, peak: record.magicPeak } });
        if (magic) {
          const seal = element('span', 'ranking-bound', magic.mark + ' ' + magic.name + ' 결속 · 제' + fmt(magic.rank) + '마력');
          seal.style.setProperty('--bound', magic.color); info.append(seal);
          image.dataset.bound = magic.id; image.style.setProperty('--bound', magic.color);
        }
        const uses = element('small', 'ranking-protection', knownUses(record.protectionUses) ? '보호권 ' + fmt(BigInt(record.protectionUses)) + '장 사용' : '보호권 미기록');
        uses.title = knownUses(record.protectionUses) ? '이 무기 기록 시점까지 누적 사용한 보호권 수' : '이전 기록에는 보호권 사용량이 저장되지 않았어요.';
        info.append(uses);
        const value = element('div', 'ranking-value');
        value.append(element('strong', '', fmt(BigInt(record.value)) + ' G'), element('span', '', '+' + fmt(BigInt(record.level))));
        if (rank <= 10) value.append(element('small', 'ranking-reward', '별철 +' + fmt(Forge.rankReward(rank)) + '/초'));
        value.title = new Intl.NumberFormat('ko-KR').format(BigInt(record.value)) + ' G';
        row.append(element('span', 'ranking-place', String(rank)), image, info, value);
        return row;
      }));
      $('ranking-empty').hidden = rows.length > 0;
    }
    async function refresh(announce = true) {
      const current = ++generation;
      const benefit = ++benefitRequest;
      if (announce) status('무기 랭킹을 불러오는 중이에요.');
      try {
        const rows = await list();
        if (current !== generation) return;
        renderRows(rows);
        if (benefit === benefitRequest) await applyBenefits(rows);
        if (announce) status(rows.length ? '상위 10명은 현재 순위에 따라 별철 보너스를 받아요.' : '이번 시즌의 첫 무기를 등록해 보세요.');
      } catch (error) {
        if (current === generation) status(error.message);
      }
    }
    function openRanking() {
      $('ranking-nickname').value = typeof profile.nickname === 'string' ? profile.nickname : '';
      $('ranking-weapon-name').value = typeof profile.weaponName === 'string' ? profile.weaponName : Forge.formAt(getState().level).name;
      $('auto-ranking-enabled').checked = profile.auto;
      preview(); dialog.showModal(); refresh();
    }
    $('open-ranking').addEventListener('click', openRanking);
    $('auto-ranking-name').addEventListener('click', openRanking);
    $('auto-ranking-enabled').addEventListener('change', () => {
      profile.auto = $('auto-ranking-enabled').checked; nextTry = 0; saveProfile(); changed();
    });
    $('ranking-refresh').addEventListener('click', () => { preview(); refresh(); });
    $('ranking-form').addEventListener('submit', async event => {
      event.preventDefault();
      if (busy) return;
      busy = true; controls();
      ++generation;
      status('무기를 등록하고 있어요.');
      try {
        if (!await beforePublish()) { status('새 버전을 적용한 뒤 다시 등록해 주세요.'); return; }
        const record = await capture($('ranking-nickname').value, $('ranking-weapon-name').value);
        profile.nickname = record.nickname; profile.weaponName = record.weaponName;
        const result = await publish(record, owner);
        profile.syncedValue = result.record.value;
        profile.syncedCore = recordCore(result.record);
        profile.syncedProtectionUses = knownUses(result.record.protectionUses) ? result.record.protectionUses : null;
        saveProfile();
        status(result.kept ? '등록된 최고 무기의 감정가가 더 높아 기존 기록을 유지했어요.' : '무기를 등록했어요! 더 가치 높은 검으로 기록을 갱신해 보세요.');
        await refresh(false);
      } catch (error) {
        status(error.message);
      } finally {
        busy = false; preview(); changed();
      }
    });
    $('ranking-delete').addEventListener('click', async () => {
      if (busy) return;
      busy = true; controls(); ++generation;
      profile.auto = false; saveProfile();
      try {
        await remove(); delete profile.uid; profile.syncedValue = null; profile.syncedCore = null; profile.syncedProtectionUses = null; saveProfile();
        status('내 공개 무기 기록을 삭제했어요.');
        await refresh(false);
      } catch (error) { status(error.message); }
      finally { busy = false; controls(); autoStatus(); }
    });
    if (profile.uid) identity().then(async user => { await owner(user.uid, await user.getIdToken()); syncBenefits(); }).catch(() => onBonus(0));
    setInterval(() => { pump(); }, 10000);
    setInterval(syncBenefits, 30000);
    addEventListener('online', () => { nextTry = 0; pump(); syncBenefits(); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { pump(); syncBenefits(); } });
    changed();
    return { changed };
  }
  return { mount };
})();
