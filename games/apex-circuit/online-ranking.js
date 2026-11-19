const config = {
  projectId: 'jpmathlab',
  apiKey: 'AIzaSyD9mHiQ8Cyh4zJKbyhW_oYZkcu3WPMYw3k',
  authDomain: 'jpmathlab.firebaseapp.com',
  appId: '1:1061208248935:web:839fa3cc986bc687cebac2'
};
const base = 'https://jpmathlab-default-rtdb.asia-southeast1.firebasedatabase.app/apexCircuitV1';
let session;

async function identity() {
  if (!session) {
    session = (async () => {
      const [appSdk, authSdk] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js')
      ]);
      const app = appSdk.getApps().find(app => app.name === 'apex-circuit-v1') ||
        appSdk.initializeApp(config, 'apex-circuit-v1');
      const auth = authSdk.getAuth(app);
      await auth.authStateReady();
      if (!auth.currentUser) await authSdk.signInAnonymously(auth);
      return auth.currentUser;
    })().catch(() => {
      session = null;
      throw new Error('랭킹 로그인에 연결하지 못했어요. 다시 등록해 주세요.');
    });
  }
  return session;
}

async function request(url, options = {}) {
  try {
    const response = await fetch(url, { ...options, signal: AbortSignal.timeout(12000) });
    if (!response.ok && response.status !== 412) throw new Error();
    return response;
  } catch {
    throw new Error('랭킹 연결에 실패했어요. 다시 시도해 주세요.');
  }
}

export async function loadOnline(course, metric) {
  const query = new URLSearchParams({
    orderBy: JSON.stringify(metric === 'total' ? 'time' : 'lap'),
    limitToFirst: '100'
  });
  const response = await request(`${base}/${course}/${metric}.json?${query}`);
  return Object.entries(await response.json() || {}).map(([uid, record]) => ({
    ...record, uid, total: record.time
  }));
}

async function putBest(user, course, metric, run, nickname) {
  const token = await user.getIdToken();
  const url = `${base}/${course}/${metric}/${encodeURIComponent(user.uid)}.json?auth=${encodeURIComponent(token)}`;
  const value = metric === 'total' ? 'time' : 'lap';
  const record = { nickname, model: run.model, time: run.total, lap: run.lap, submittedAt: { '.sv': 'timestamp' } };
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await request(url, { headers: { 'X-Firebase-ETag': 'true' } });
    const previous = await response.json();
    const keepPrevious = previous && previous[value] <= record[value];
    if (keepPrevious && previous.nickname === nickname) return;
    const payload = keepPrevious ? {
      nickname, model: previous.model, time: previous.time, lap: previous.lap,
      submittedAt: { '.sv': 'timestamp' }
    } : record;
    const update = await request(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'if-match': response.headers.get('etag') },
      body: JSON.stringify(payload)
    });
    if (update.status !== 412) return;
  }
  throw new Error('다른 창에서 기록이 갱신됐어요. 다시 등록해 주세요.');
}

export async function publishOnline(course, runs, nickname, onOwner) {
  const user = await identity();
  onOwner(user.uid);
  const total = runs.reduce((best, run) => run.total < best.total ? run : best);
  const lap = runs.reduce((best, run) => run.lap < best.lap ? run : best);
  await putBest(user, course, 'total', total, nickname);
  await putBest(user, course, 'lap', lap, nickname);
  return user.uid;
}

export async function deleteOnline(course) {
  const user = await identity();
  const token = await user.getIdToken();
  for (const metric of ['total', 'lap']) {
    await request(`${base}/${course}/${metric}/${encodeURIComponent(user.uid)}.json?auth=${encodeURIComponent(token)}`, { method: 'DELETE' });
  }
}
