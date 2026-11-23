'use strict';

const ForgeUpdate = (() => {
  function mount({ revision, onPending, beforeReload, onStatus }) {
    const markerKey = 'jp-math-lab:mongle-forge:update-attempt';
    let pending = null;
    let checking;
    let lastCheck = -Infinity;
    let applying = false;
    let refreshing = false;
    const notify = (message, retry = false) => onStatus(message, retry);

    async function apply(manual = false) {
      if (!pending || applying || refreshing) return;
      applying = true;
      try {
        let marker = {};
        try { marker = JSON.parse(sessionStorage.getItem(markerKey) || '{}'); } catch {}
        if (!manual && marker.revision === pending && marker.count >= 2) {
          notify('새 버전을 준비하고 있어요. 잠시 후 다시 받아 주세요.', true);
          return;
        }
        if (!await beforeReload()) {
          notify('진행을 자동 저장한 뒤 새 버전을 적용해요.', true);
          return;
        }
        try {
          sessionStorage.setItem(markerKey, JSON.stringify({ revision: pending, count: marker.revision === pending ? (marker.count || 0) + 1 : 1 }));
        } catch {
          notify('새 버전을 받으려면 브라우저 저장 공간을 확인해 주세요.', true);
          return;
        }
        notify('저장 완료 · 새 버전을 적용하고 있어요.');
        const target = new URL(location.href);
        target.searchParams.set('v', 'forge-' + pending);
        target.searchParams.set('updated', String(pending));
        refreshing = true;
        location.replace(target.href);
      } finally { applying = false; }
    }

    async function check(force = false) {
      if (pending) { await apply(); return false; }
      if (checking) return checking;
      if (!force && performance.now() - lastCheck < 15000) return true;
      checking = (async () => {
        try {
          const url = new URL('release.json', location.href);
          url.searchParams.set('check', crypto.getRandomValues(new Uint32Array(1))[0].toString(36));
          const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
          if (!response.ok) throw new Error();
          const release = await response.json();
          if (!Number.isSafeInteger(release.revision) || release.revision <= 0) throw new Error();
          if (release.revision > revision) {
            pending = release.revision;
            onPending();
            notify('새 버전을 찾았어요. 진행을 저장하고 적용합니다.');
            await apply();
            return false;
          }
          if (release.revision === revision) {
            try { sessionStorage.removeItem(markerKey); } catch {}
            notify('최신 버전 · 진행은 자동 저장돼요.');
          }
          return true;
        } catch {
          notify('버전 확인 대기 · 연결되면 다시 확인해요.');
          // Offline play remains available; the ranking server separately rejects old clients.
          return true;
        } finally { lastCheck = performance.now(); checking = null; }
      })();
      return checking;
    }

    setInterval(() => { if (!document.hidden) check(true); }, 60000);
    setInterval(() => { if (pending && !document.hidden) apply(); }, 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(true); });
    addEventListener('online', () => check(true));
    check(true);
    return { check, retry: () => apply(true), pending: () => pending !== null };
  }
  return { mount };
})();
