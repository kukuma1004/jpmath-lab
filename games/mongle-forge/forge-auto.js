'use strict';

const ForgeAuto = (() => {
  function mount({ getState, step, canAct, fmt }) {
    const key = 'jp-math-lab:mongle-forge:auto-goal:v1';
    const $ = id => document.getElementById(id);
    let plan = { running: false, target: getState().level >= 100n ? Forge.formAt(getState().level).next.toString() : '100', protect: true };
    let leader = false, claiming = false, release, executing = false, pausedUntil = 0;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (saved && /^[1-9][0-9]{0,127}$/.test(saved.target)) plan = { running: saved.running === true, target: saved.target, protect: saved.protect !== false };
    } catch {}
    function status(message) { if ($('auto-goal-status').textContent !== message) $('auto-goal-status').textContent = message; }
    function save() { try { localStorage.setItem(key, JSON.stringify(plan)); return true; } catch { return false; } }
    function relinquish() { if (!executing) { release?.(); release = null; leader = false; } }
    function render() {
      $('auto-target').value = plan.target;
      $('auto-protection').checked = plan.protect;
      $('auto-target').disabled = plan.running;
      $('auto-protection').disabled = plan.running;
      $('auto-toggle').textContent = plan.running ? '자동 강화 정지' : '자동 강화 시작';
      $('auto-goal').dataset.running = String(plan.running);
    }
    function stop(message) {
      plan.running = false; save(); relinquish(); render(); status(message);
    }
    async function claim() {
      if (leader || claiming || !plan.running || document.hidden) return;
      if (!navigator.locks) { leader = true; return; }
      claiming = true;
      navigator.locks.request(key + ':runner', { ifAvailable: true }, async lock => {
        claiming = false;
        if (!lock) { status('다른 탭에서 목표 강화를 진행하고 있어요.'); return; }
        if (!plan.running || document.hidden) return;
        leader = true;
        await new Promise(resolve => { release = resolve; });
        leader = false;
      }).catch(() => { claiming = false; stop('자동 강화를 시작하지 못했어요. 다시 눌러 주세요.'); });
    }
    async function tick() {
      if (!plan.running || document.hidden) { relinquish(); return; }
      await claim();
      if (!leader || executing || !canAct() || Date.now() < pausedUntil) return;
      const state = getState(), target = BigInt(plan.target), now = Date.now();
      if (state.level >= target) { stop('목표 +' + fmt(target) + ' 달성! 자동 강화를 마쳤어요.'); return; }
      if (state.broken) { stop('검이 깨져 자동 강화를 멈췄어요. 새 검을 만든 뒤 다시 시작해 주세요.'); return; }
      if (now - state.lastAt < Forge.cooldown) return;
      const normal = Forge.preview(state, now), protection = Forge.protectionOffer(state, now);
      const buying = plan.protect && protection.eligible && !protection.owned;
      const required = normal.cost + (buying ? protection.cost : 0n);
      if (state.shards < required) {
        const rate = Forge.income(state, now);
        status('별철 기다림 · 약 ' + fmt((required - state.shards + rate - 1n) / rate) + '초 후 자동으로 이어가요.');
        return;
      }
      executing = true;
      status((buying ? '보호권 구매 중' : '자동 강화 중') + ' · 목표 +' + fmt(target));
      try {
        const event = await step(buying ? 'protection' : 'forge');
        if (event?.magicAwakened) {
          pausedUntil = Date.now() + 3600;
          status('고유 마법 발현! 잠시 감상한 뒤 목표 강화를 이어가요.');
        }
        if (getState().level >= target) stop('목표 +' + fmt(target) + ' 달성! 자동 강화를 마쳤어요.');
        else if (getState().broken) stop('검이 깨져 자동 강화를 멈췄어요.');
      } finally { executing = false; if (!plan.running || document.hidden) relinquish(); }
    }
    $('auto-toggle').addEventListener('click', () => {
      if (plan.running) { stop('자동 강화를 멈췄어요.'); return; }
      const target = $('auto-target').value.trim();
      if (!/^[1-9][0-9]{0,127}$/.test(target) || BigInt(target) <= getState().level) { status('현재보다 높은 목표 단계를 정해 주세요.'); return; }
      if (getState().broken) { status('새 검을 제작한 뒤 시작해 주세요.'); return; }
      plan = { running: true, target, protect: $('auto-protection').checked };
      if (!save()) { plan.running = false; status('자동 강화 설정을 저장하지 못했어요.'); return; }
      pausedUntil = 0; render(); tick();
    });
    addEventListener('storage', event => {
      if (event.key !== key) return;
      try {
        const saved = JSON.parse(event.newValue);
        if (saved && /^[1-9][0-9]{0,127}$/.test(saved.target)) { plan = saved; if (!plan.running) relinquish(); render(); }
      } catch {}
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) relinquish(); else tick(); });
    addEventListener('pagehide', relinquish);
    setInterval(tick, 250);
    render(); status(plan.running ? '저장한 목표 강화를 이어갈 준비 중이에요.' : '목표까지 진행 · 별철 부족 시 자동 대기');
    return { suspend: relinquish, active: () => plan.running && leader && !document.hidden };
  }
  return { mount };
})();
