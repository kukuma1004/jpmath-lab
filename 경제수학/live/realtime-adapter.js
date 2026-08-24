(function () {
  const SDK_VERSION = '12.16.0';
  let services = null;

  function randomCode() {
    const data = new Uint32Array(1);
    crypto.getRandomValues(data);
    return String(100000 + data[0] % 900000);
  }

  function databaseCandidates(config) {
    const urls = [config.databaseURL, ...(config.databaseURLs || [])].filter(Boolean);
    if (config.projectId) {
      urls.push(
        `https://${config.projectId}-default-rtdb.asia-southeast1.firebasedatabase.app`,
        `https://${config.projectId}-default-rtdb.firebaseio.com`
      );
    }
    return [...new Set(urls.map(url => String(url).replace(/\/$/, '')))];
  }

  async function findDatabaseURL(config, token) {
    const candidates = databaseCandidates(config);
    if (!candidates.length) throw new Error('database-url-missing');
    for (const url of candidates) {
      try {
        const response = await fetch(`${url}/.json?shallow=true&auth=${encodeURIComponent(token)}`, {
          cache: 'no-store'
        });
        if ([200, 401, 403].includes(response.status)) return url;
      } catch (error) {
        // 다음 지역의 Realtime Database 주소를 확인합니다.
      }
    }
    throw new Error('database-not-created');
  }

  async function connect() {
    const config = window.JPEconomyFirebaseConfig;
    if (!config || !config.apiKey || !config.projectId) return { available: false, reason: 'config-missing' };
    if (services) return { available: true, uid: services.auth.currentUser && services.auth.currentUser.uid };
    try {
      const appSdk = await import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-app.js`);
      const authSdk = await import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-auth.js`);
      const dbSdk = await import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-database.js`);
      const app = appSdk.initializeApp(config);
      const auth = authSdk.getAuth(app);
      if (!auth.currentUser) await authSdk.signInAnonymously(auth);
      const token = await auth.currentUser.getIdToken();
      const databaseURL = await findDatabaseURL(config, token);
      const database = dbSdk.getDatabase(app, databaseURL);
      services = { auth, database, dbSdk, databaseURL };
      return { available: true, uid: auth.currentUser.uid, databaseURL };
    } catch (error) {
      return { available: false, reason: error.code || error.message || 'connection-failed' };
    }
  }

  async function ready() {
    const status = await connect();
    if (!status.available) throw new Error(status.reason);
    return services;
  }

  async function createRoom(gameId, nickname) {
    const { auth, database, dbSdk } = await ready();
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const code = randomCode();
      const roomRef = dbSdk.ref(database, `economyRooms/${code}`);
      const reserved = await dbSdk.runTransaction(roomRef, current => current || {
        hostId: auth.currentUser.uid,
        gameId,
        status: 'lobby',
        round: 0,
        createdAt: dbSdk.serverTimestamp(),
        updatedAt: dbSdk.serverTimestamp(),
        players: {
          [auth.currentUser.uid]: { nickname, score: 100, connected: true, joinedAt: dbSdk.serverTimestamp() }
        }
      }, { applyLocally: false });
      if (reserved.committed && reserved.snapshot.val().hostId === auth.currentUser.uid) {
        await dbSdk.onDisconnect(dbSdk.ref(database, `economyRooms/${code}/players/${auth.currentUser.uid}/connected`)).set(false);
        return { code, uid: auth.currentUser.uid, room: reserved.snapshot.val(), isHost: true };
      }
    }
    throw new Error('room-code-exhausted');
  }

  async function joinRoom(code, nickname) {
    const { auth, database, dbSdk } = await ready();
    const normalized = String(code).replace(/\D/g, '').slice(0, 6);
    const roomRef = dbSdk.ref(database, `economyRooms/${normalized}`);
    const snapshot = await dbSdk.get(roomRef);
    if (!snapshot.exists()) throw new Error('room-not-found');
    const room = snapshot.val();
    if (room.status !== 'lobby') throw new Error('game-already-started');
    const players = room.players || {};
    if (Object.keys(players).length >= 6 && !players[auth.currentUser.uid]) throw new Error('room-full');
    await dbSdk.set(dbSdk.ref(database, `economyRooms/${normalized}/players/${auth.currentUser.uid}`), {
      nickname, score: 100, connected: true, joinedAt: dbSdk.serverTimestamp()
    });
    await dbSdk.onDisconnect(dbSdk.ref(database, `economyRooms/${normalized}/players/${auth.currentUser.uid}/connected`)).set(false);
    return { code: normalized, uid: auth.currentUser.uid, room, isHost: room.hostId === auth.currentUser.uid };
  }

  async function watchRoom(code, callback) {
    const { database, dbSdk } = await ready();
    return dbSdk.onValue(dbSdk.ref(database, `economyRooms/${code}`), snapshot => callback(snapshot.val()));
  }

  async function submitChoice(code, round, choice) {
    const { auth, database, dbSdk } = await ready();
    const value = typeof choice === 'string' ? { strategyId: choice } : choice;
    const payload = {
      strategyId: String(value.strategyId || 'mix').slice(0, 30),
      allocation: Object.fromEntries(Object.entries(value.allocation || {}).map(([key, amount]) => [key, Math.max(0, Math.min(100, Number(amount) || 0))])),
      reason: String(value.reason || '').slice(0, 100),
      question: String(value.question || '').slice(0, 160),
      submittedAt: dbSdk.serverTimestamp()
    };
    await dbSdk.set(dbSdk.ref(database, `economyChoices/${code}/${round}/${auth.currentUser.uid}`), {
      ...payload
    });
  }

  async function watchChoices(code, round, callback) {
    const { database, dbSdk } = await ready();
    return dbSdk.onValue(dbSdk.ref(database, `economyChoices/${code}/${round}`), snapshot => callback(snapshot.val() || {}));
  }

  async function hostUpdate(code, patch) {
    const { database, dbSdk } = await ready();
    await dbSdk.update(dbSdk.ref(database, `economyRooms/${code}`), { ...patch, updatedAt: dbSdk.serverTimestamp() });
  }

  async function clearRoundChoices(code, round) {
    const { database, dbSdk } = await ready();
    await dbSdk.remove(dbSdk.ref(database, `economyChoices/${code}/${round}`));
  }

  async function leaveRoom(code) {
    const { auth, database, dbSdk } = await ready();
    await dbSdk.remove(dbSdk.ref(database, `economyRooms/${code}/players/${auth.currentUser.uid}`));
  }

  window.JPEconomyRealtime = { connect, createRoom, joinRoom, watchRoom, submitChoice, watchChoices, hostUpdate, clearRoundChoices, leaveRoom };
}());
