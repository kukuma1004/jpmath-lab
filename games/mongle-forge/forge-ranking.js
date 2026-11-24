'use strict';

const ForgeRanking = (() => {
  const config = {
    projectId: 'jpmathlab', apiKey: 'AIzaSyD9mHiQ8Cyh4zJKbyhW_oYZkcu3WPMYw3k',
    authDomain: 'jpmathlab.firebaseapp.com', appId: '1:1061208248935:web:839fa3cc986bc687cebac2',
  };
  const base = 'https://jpmathlab-default-rtdb.asia-southeast1.firebasedatabase.app/mongleForgeV1/';
  const profileKey = Forge.rankingProfileKey;
  const legacyProfileKey = 'jp-math-lab:mongle-forge:ranking-profile';
  let session;
  const knownUses = value => typeof value === 'string' && /^(0|[1-9][0-9]{0,127})$/.test(value);
  const knownAppearance = value => value === 'auto' || Forge.forms.some(form => form.level.toString() === value);
  const recordCore = record => ['value', 'level', 'effect1', 'effect2', 'effect3'].map(key => record[key]).concat(record.magic ?? 'none', record.magicPeak ?? '0').join(':');
  const recordSignature = record => record ? JSON.stringify([recordCore(record), record.appearance ?? 'auto', record.protectionUses ?? null, record.nickname, record.weaponName, record.rulesVersion]) : 'none';

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
    return record && record.rulesVersion === Forge.rankingProtocol && typeof record.value === 'string' && /^[0-9]{512}$/.test(record.value) &&
      typeof record.level === 'string' && /^(0|[1-9][0-9]{0,127})$/.test(record.level) &&
      typeof record.nickname === 'string' && record.nickname.length <= 12 &&
      typeof record.weaponName === 'string' && record.weaponName.length <= 16 &&
      (record.protectionUses == null || knownUses(record.protectionUses)) &&
      (record.appearance == null || knownAppearance(record.appearance)) &&
      (record.magic == null || record.magic === 'none' && record.magicPeak === '0' || Forge.magics.some(magic => magic.id === record.magic) &&
        typeof record.magicPeak === 'string' && /^[1-9][0-9]{2,127}$/.test(record.magicPeak)) &&
      [record.effect1, record.effect2, record.effect3].every(id => id === 'none' || Forge.enchantments.some(effect => effect.id === id));
  }

  async function list() {
    const query = new URLSearchParams({ orderBy: '"value"', limitToLast: '100' });
    const response = await request(base + Forge.rankingBoard + '.json?' + query);
    return Object.entries(await response.json() || {}).filter(([, record]) => validRecord(record))
      .map(([uid, record]) => ({ ...record, uid })).sort((a, b) => a.value === b.value ?
        a.uid === b.uid ? 0 : a.uid > b.uid ? -1 : 1 : a.value > b.value ? -1 : 1);
  }

  async function publish(currentRecord, onOwner) {
    const user = await identity();
    const token = await user.getIdToken();
    await onOwner(user.uid, token);
    const url = base + Forge.rankingBoard + '/' + encodeURIComponent(user.uid) + '.json?auth=' + encodeURIComponent(token);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await request(url, { headers: { 'X-Firebase-ETag': 'true' } });
      const previous = await response.json();
      // Capture after identity/grants and after each ETag read. A weaker or new
      // weapon replaces the row; a missing weapon removes it.
      const record = currentRecord();
      if (!record && !previous) return { record: null };
      const update = await request(url, {
        method: record ? 'PUT' : 'DELETE', headers: { 'Content-Type': 'application/json', 'if-match': response.headers.get('etag') },
        ...(record ? { body: JSON.stringify({ ...record, submittedAt: { '.sv': 'timestamp' } }) } : {}),
      });
      if (update.status !== 412) return { record };
    }
    throw new Error('다른 창에서 기록이 갱신됐어요. 다시 등록해 주세요.');
  }

  async function remove() {
    const user = await identity();
    const token = await user.getIdToken();
    await request(base + Forge.rankingBoard + '/' + encodeURIComponent(user.uid) + '.json?auth=' + encodeURIComponent(token), { method: 'DELETE' });
  }

  function mount({ getState, fmt, asset, onBonus, onGrant, beforePublish }) {
    const $ = id => document.getElementById(id);
    const dialog = $('ranking');
    let profile = {};
    try {
      const saved = JSON.parse(localStorage.getItem(profileKey) || localStorage.getItem(legacyProfileKey) || '{}');
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) profile = saved;
    } catch {}
    if (!profile.nickname) profile.nickname = '몽글' + String(crypto.getRandomValues(new Uint32Array(1))[0] % 10000).padStart(4, '0');
    if (profile.auto !== false) profile.auto = true;
    if (typeof profile.syncedValue !== 'string' || !/^[0-9]{512}$/.test(profile.syncedValue)) profile.syncedValue = null;
    if (!knownUses(profile.syncedProtectionUses)) profile.syncedProtectionUses = null;
    if (!knownAppearance(profile.syncedAppearance)) profile.syncedAppearance = null;
    if (typeof profile.syncedCore !== 'string' || profile.syncedCore.split(':').length !== 7) profile.syncedCore = null;
    const migrated = profile.rankingBoard !== Forge.rankingBoard;
    if (migrated) profile.syncedSignature = null;
    profile.rankingBoard = Forge.rankingBoard;
    let busy = false;
    let generation = 0;
    let verifiedUid;
    let nextTry = 0;
    let benefitRequest = 0;
    let grantOwner;
    function saveProfile(settings = false) {
      try {
        const shared = JSON.parse(localStorage.getItem(profileKey) || 'null');
        if (!settings && shared?.rankingBoard === Forge.rankingBoard) {
          profile.auto = shared.auto !== false;
          profile.nickname = shared.nickname || profile.nickname;
          profile.weaponName = shared.weaponName;
        }
        localStorage.setItem(profileKey, JSON.stringify(profile));
      } catch {}
    }
    saveProfile(migrated);
    function currentRecord(validate = false) {
      const state = getState();
      if (!profile.auto || !Forge.weaponSnapshot(state)) return null;
      const nickname = profile.nickname;
      const weaponName = profile.weaponName || Forge.appearanceAt(state.appearance, state.level).name;
      return validate ? Forge.rankingRecord(state, nickname, weaponName) : {
        ...Forge.weaponSnapshot(state), nickname, weaponName, rulesVersion: Forge.rankingProtocol,
      };
    }
    function pending() {
      const state = getState();
      const eligible = profile.uid || profile.auto && (state.attempts > 0n || state.rankingBest);
      return !!eligible && recordSignature(currentRecord()) !== profile.syncedSignature;
    }
    function autoStatus() {
      $('auto-ranking-name').textContent = (profile.auto ? '현재 검 자동 등록 · ' : '랭킹 참여 꺼짐 · ') + profile.nickname;
      $('auto-ranking-status').textContent = pending() ? nextTry > Date.now() ? '연결 후 현재 검 반영' : '현재 검 동기화 중' : !profile.auto ? '이름·설정 변경' : getState().broken ? '검이 없어 랭킹 제외' : '현재 검 감정가 기준';
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
      const current = currentRecord();
      const index = verifiedUid && current && recordSignature(current) === profile.syncedSignature ?
        rows.findIndex(row => row.uid === verifiedUid && recordCore(row) === recordCore(current)) : -1;
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
        if (!await beforePublish()) { nextTry = Date.now() + 1000; return; }
        const result = await publish(() => currentRecord(true), owner);
        acknowledge(result.record); nextTry = 0;
        await syncBenefits();
        if (dialog.open) await refresh(false);
      } catch { nextTry = Date.now() + 10000; }
      finally { busy = false; controls(); autoStatus(); if (pending() && Date.now() >= nextTry) queueMicrotask(pump); }
    }
    function acknowledge(record) {
      profile.syncedValue = record?.value ?? null;
      profile.syncedCore = record ? recordCore(record) : null;
      profile.syncedAppearance = record?.appearance ?? null;
      profile.syncedProtectionUses = knownUses(record?.protectionUses) ? record.protectionUses : null;
      profile.syncedSignature = recordSignature(record); saveProfile();
    }
    function changed() {
      if (getState().rankBonus && (!verifiedUid || !profile.auto || getState().broken || recordSignature(currentRecord()) !== profile.syncedSignature)) onBonus(0);
      if (dialog.open) preview();
      autoStatus(); queueMicrotask(pump);
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
      const form = Forge.appearanceAt(state.appearance,state.level);
      $('ranking-preview-image').src = asset(state.broken ? 'broken-sword' : 'sword-' + form.level);
      $('ranking-preview-title').textContent = state.broken ? '깨진 검은 등록할 수 없어요.' : [form.name,form.release,form.variant].filter(Boolean).join(' · ') + ' +' + fmt(state.level);
      $('ranking-preview-value').textContent = fmt(Forge.appraisal(state).value) + ' G';
      controls();
    }
    function renderRows(rows) {
      $('ranking-list').replaceChildren(...rows.map((record, index) => {
        const rank = index + 1;
        const row = element('li', 'ranking-row' + (record.uid === profile.uid ? ' ranking-mine' : ''));
        const form = Forge.appearanceAt(record.appearance,BigInt(record.level));
        const image = element('img', 'ranking-weapon');
        image.src = asset('sword-' + form.level);
        image.width = 64; image.height = 64; image.alt = [form.name,form.release,form.variant].filter(Boolean).join(' · '); image.loading = 'lazy';
        const info = element('div', 'ranking-weapon-info');
        info.append(element('strong', '', record.weaponName), element('span', 'ranking-nickname', record.nickname + (record.uid === profile.uid ? ' · 내 무기' : '')));
        if(form.release)info.append(element('span','ranking-nickname',form.name+' · '+form.release+' · '+form.variant));
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
        uses.title = knownUses(record.protectionUses) ? '현재 동기화 시점까지 누적 사용한 보호권 수' : '이 기록에는 보호권 사용량이 저장되지 않았어요.';
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
        if (announce) status(rows.length ? '현재 검 감정가 순위예요. 상위 10명은 별철 보너스를 받아요.' : '접속 후 현재 검을 등록하면 랭킹에 표시돼요.');
      } catch (error) {
        if (current === generation) status(error.message);
      }
    }
    function openRanking() {
      $('ranking-nickname').value = typeof profile.nickname === 'string' ? profile.nickname : '';
      $('ranking-weapon-name').value = typeof profile.weaponName === 'string' ? profile.weaponName : Forge.appearanceAt(getState().appearance,getState().level).name;
      $('auto-ranking-enabled').checked = profile.auto;
      preview(); dialog.showModal(); refresh();
    }
    $('open-ranking').addEventListener('click', openRanking);
    $('auto-ranking-name').addEventListener('click', openRanking);
    $('auto-ranking-enabled').addEventListener('change', () => {
      profile.auto = $('auto-ranking-enabled').checked; nextTry = 0; saveProfile(true); changed();
    });
    $('ranking-refresh').addEventListener('click', () => { preview(); refresh(); });
    $('ranking-form').addEventListener('submit', async event => {
      event.preventDefault();
      if (busy) return;
      busy = true; controls();
      ++generation;
      status('무기를 등록하고 있어요.');
      try {
        if (!await beforePublish()) { nextTry = Date.now() + 1000; status('새 버전을 적용한 뒤 다시 등록해 주세요.'); return; }
        const nickname = Forge.rankingName($('ranking-nickname').value, 12);
        const weaponName = Forge.rankingName($('ranking-weapon-name').value, 16);
        profile.nickname = nickname; profile.weaponName = weaponName; profile.auto = true;
        $('auto-ranking-enabled').checked = true; saveProfile(true);
        const result = await publish(() => currentRecord(true), owner);
        acknowledge(result.record); nextTry = 0;
        status(result.record ? '현재 검을 등록했어요. 가치가 바뀌면 순위도 갱신돼요.' : '현재 검이 없어 랭킹에서 제외했어요.');
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
      profile.auto = false; saveProfile(true); changed();
      try {
        await remove(); acknowledge(null);
        status('내 공개 무기 기록을 삭제했어요.');
        await refresh(false);
      } catch (error) { status(error.message); }
      finally { busy = false; controls(); changed(); }
    });
    addEventListener('storage', event => {
      if (event.key !== profileKey || !event.newValue) return;
      try {
        const shared = JSON.parse(localStorage.getItem(profileKey) || 'null');
        if (!shared || shared.rankingBoard !== Forge.rankingBoard) return;
        profile = shared; nextTry = 0;
        $('auto-ranking-enabled').checked = profile.auto !== false;
        changed();
      } catch {}
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
