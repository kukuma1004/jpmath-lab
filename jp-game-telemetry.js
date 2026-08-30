(function () {
  'use strict';

  const STORE_KEY = 'jp-game-telemetry-v1';
  const PROFILE_KEY = 'jp-play-profile-v1';
  const MAX_LOCAL_PLAYS = 300;
  const SDK_VERSION = '12.16.0';
  let firebaseServices = null;
  let firebasePromise = null;
  const syncChains = new Map();

  function nowIso() {
    return new Date().toISOString();
  }

  function makeId(prefix) {
    const id = globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    return `${prefix}-${id}`;
  }

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === 'object' ? value : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  }

  function normalizeName(value) {
    return String(value || '')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 12);
  }

  function getProfile() {
    const profile = readJson(PROFILE_KEY, null);
    if (!profile || !profile.userId || !profile.displayName) return null;
    return profile;
  }

  function saveProfile(displayName) {
    const name = normalizeName(displayName);
    if (!name) return null;
    const old = getProfile();
    const profile = {
      userId: old && old.userId ? old.userId : makeId('user'),
      displayName: name,
      createdAt: old && old.createdAt ? old.createdAt : nowIso(),
      updatedAt: nowIso()
    };
    writeJson(PROFILE_KEY, profile);
    return profile;
  }

  function clearProfile() {
    try { localStorage.removeItem(PROFILE_KEY); } catch (_) {}
  }

  function readStore() {
    const store = readJson(STORE_KEY, { version: 1, plays: [] });
    if (!Array.isArray(store.plays)) store.plays = [];
    return store;
  }

  function writeStore(store) {
    store.version = 1;
    store.updatedAt = nowIso();
    store.plays = store.plays.slice(-MAX_LOCAL_PLAYS);
    writeJson(STORE_KEY, store);
  }

  function updateLocal(playId, patch) {
    const store = readStore();
    const index = store.plays.findIndex(item => item.playId === playId);
    if (index < 0) return null;
    store.plays[index] = { ...store.plays[index], ...patch };
    writeStore(store);
    return store.plays[index];
  }

  function databaseUrl(config) {
    const urls = [config.databaseURL, ...(config.databaseURLs || [])].filter(Boolean);
    return String(urls[0] || '').replace(/\/$/, '');
  }

  async function connectFirebase() {
    if (firebaseServices) return firebaseServices;
    if (firebasePromise) return firebasePromise;
    firebasePromise = (async function () {
      const config = window.JPFirebaseConfig || window.JPEconomyFirebaseConfig;
      if (!config || !config.apiKey || !config.projectId || !databaseUrl(config)) throw new Error('firebase-config-missing');
      const [appSdk, authSdk] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-auth.js`)
      ]);
      const app = appSdk.getApps().length ? appSdk.getApp() : appSdk.initializeApp(config);
      const auth = authSdk.getAuth(app);
      if (!auth.currentUser) await authSdk.signInAnonymously(auth);
      firebaseServices = { auth, databaseURL: databaseUrl(config) };
      return firebaseServices;
    }()).catch(error => {
      firebasePromise = null;
      throw error;
    });
    return firebasePromise;
  }

  function remoteRecord(record, uid) {
    return {
      userId: uid,
      gameId: String(record.gameId || '').slice(0, 50),
      sessionId: String(record.sessionId || '').slice(0, 80),
      playId: String(record.playId || '').slice(0, 80),
      startedAt: String(record.startedAt || ''),
      endedAt: String(record.endedAt || ''),
      score: Number(record.score || 0),
      accuracy: Number(record.accuracy || 0),
      playTime: Number(record.playTime || 0),
      retry: Boolean(record.retry),
      sessionPlayIndex: Number(record.sessionPlayIndex || 1),
      personalBest: Boolean(record.personalBest),
      completed: Boolean(record.completed),
      dateKey: String(record.dateKey || '').slice(0, 10),
      appVersion: 'first-playable-v1'
    };
  }

  async function syncPlay(record) {
    if (!record) return false;
    try {
      const { auth, databaseURL } = await connectFirebase();
      const uid = auth.currentUser.uid;
      const value = remoteRecord(record, uid);
      const token = await auth.currentUser.getIdToken();
      const path = `gameTelemetry/${uid}/plays/${record.playId}`;
      const response = await fetch(`${databaseURL}/${path}.json?auth=${encodeURIComponent(token)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(value),
        cache: 'no-store'
      });
      if (!response.ok) throw new Error(`telemetry-${response.status}`);
      updateLocal(record.playId, { syncState: 'synced', syncedAt: nowIso() });
      return true;
    } catch (_) {
      updateLocal(record.playId, { syncState: 'pending' });
      return false;
    }
  }

  function queueSync(record) {
    if (!record || !record.playId) return Promise.resolve(false);
    const previous = syncChains.get(record.playId) || Promise.resolve();
    const next = previous
      .catch(() => false)
      .then(() => syncPlay(record));
    syncChains.set(record.playId, next);
    next.finally(() => {
      if (syncChains.get(record.playId) === next) syncChains.delete(record.playId);
    });
    return next;
  }

  function startPlay(input) {
    const profile = getProfile() || saveProfile('PLAYER');
    const record = {
      userId: profile.userId,
      gameId: String(input.gameId || 'unknown'),
      sessionId: String(input.sessionId || makeId('session')),
      playId: makeId('play'),
      startedAt: nowIso(),
      endedAt: '',
      score: 0,
      accuracy: 0,
      playTime: 0,
      retry: Boolean(input.retry),
      sessionPlayIndex: Math.max(1, Number(input.sessionPlayIndex || 1)),
      personalBest: false,
      completed: false,
      labInteractions: 0,      // 그래프·슬라이더를 실제로 만진 횟수
      nextExperienceClick: false,
      researchOpen: false,
      dateKey: String(input.dateKey || '').slice(0, 10),
      syncState: 'pending'
    };
    const store = readStore();
    store.plays.push(record);
    writeStore(store);
    queueSync(record);
    return record;
  }

  function finishPlay(playId, result) {
    const patch = {
      endedAt: String(result.endedAt || nowIso()),
      score: Math.max(0, Number(result.score || 0)),
      accuracy: Math.max(0, Math.min(100, Number(result.accuracy || 0))),
      playTime: Math.max(0, Number(result.playTime || 0)),
      retry: Boolean(result.retry),
      sessionPlayIndex: Math.max(1, Number(result.sessionPlayIndex || 1)),
      personalBest: Boolean(result.personalBest),
      completed: true,
      syncState: 'pending'
    };
    const record = updateLocal(playId, patch);
    queueSync(record);
    return record;
  }

  // 한 판 안에서 일어난 행동을 표시한다.
  // 이 실험이 검증하려는 것은 점수가 아니라 "다음 행동으로 이어지는가" 이므로,
  // 조작했는지 · 다음 경험을 눌렀는지 · 탐구를 열었는지를 판 기록에 함께 남긴다.
  function mark(playId, event) {
    if (!playId) return null;
    const store = readStore();
    const record = store.plays.filter(item => item.playId === playId)[0];
    if (!record) return null;
    if (event === 'lab_interaction') record.labInteractions = Number(record.labInteractions || 0) + 1;
    else if (event === 'next_experience_click') record.nextExperienceClick = true;
    else if (event === 'research_open') record.researchOpen = true;
    else return null;
    record.syncState = 'pending';
    writeStore(store);
    queueSync(record);
    return record;
  }

  async function flush() {
    const pending = readStore().plays.filter(item => item.syncState !== 'synced');
    const results = await Promise.all(pending.map(queueSync));
    return results.filter(Boolean).length;
  }

  function summarize(records) {
    const plays = Array.isArray(records) ? records : readStore().plays;
    const starts = plays.length;
    const completed = plays.filter(play => play.completed);
    const userIds = [...new Set(plays.map(play => play.userId).filter(Boolean))];
    const sessionIds = [...new Set(plays.map(play => play.sessionId).filter(Boolean))];
    const dateSets = new Map();
    plays.forEach(play => {
      if (!play.userId || !play.startedAt) return;
      const set = dateSets.get(play.userId) || new Set();
      set.add(String(play.startedAt).slice(0, 10));
      dateSets.set(play.userId, set);
    });
    const returningUsers = [...dateSets.values()].filter(set => set.size > 1).length;
    return {
      startedUsers: userIds.length,
      starts,
      completionRate: starts ? Math.round(completed.length / starts * 1000) / 10 : 0,
      immediateRetryRate: completed.length ? Math.round(plays.filter(play => play.retry).length / completed.length * 1000) / 10 : 0,
      averagePlaysPerStudent: userIds.length ? Math.round(starts / userIds.length * 100) / 100 : 0,
      averagePlaysPerSession: sessionIds.length ? Math.round(starts / sessionIds.length * 100) / 100 : 0,
      personalBestRate: completed.length ? Math.round(completed.filter(play => play.personalBest).length / completed.length * 1000) / 10 : 0,
      // 이 실험의 핵심 질문 — 조작했는가, 다음으로 넘어갔는가
      labInteractionRate: starts ? Math.round(plays.filter(play => Number(play.labInteractions || 0) > 0).length / starts * 1000) / 10 : 0,
      averageLabInteractions: starts ? Math.round(plays.reduce((sum, play) => sum + Number(play.labInteractions || 0), 0) / starts * 100) / 100 : 0,
      nextExperienceRate: completed.length ? Math.round(completed.filter(play => play.nextExperienceClick).length / completed.length * 1000) / 10 : 0,
      researchOpenRate: completed.length ? Math.round(completed.filter(play => play.researchOpen).length / completed.length * 1000) / 10 : 0,
      returningUsers
    };
  }

  window.JPGameTelemetry = {
    getProfile,
    saveProfile,
    clearProfile,
    startPlay,
    finishPlay,
    mark,
    flush,
    summarize,
    readLocalPlays: function () { return readStore().plays.slice(); },
    makeSessionId: function () { return makeId('session'); }
  };
}());
