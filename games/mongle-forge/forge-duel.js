const ForgeDuel = (() => {
  'use strict';
  const guardians = ['잿불의 파수꾼', '용광로의 기사', '불꽃왕의 수문장'];
  const lanes = ['왼쪽', '가운데', '오른쪽'];
  const cap = 30;
  const recordKey = tier => 'mongle-forge-duel-v1:' + tier;
  const guardian = tier => guardians[(tier - 1) % guardians.length];
  function makeFight(state, tier = 1) {
    const level = Number(state.level > 1000000n ? 1000000n : state.level);
    const magic = Forge.appraisal(state).magic;
    const power = Math.round((10 + 2 * level + level * level * .08) * (magic ? 1.3 + Math.min(1, Number(magic.rank) * .04) : 1));
    const maxHp = Math.round(160 * 1.54 ** (tier - 1));
    return { tier, power, magic, maxHp, hp: maxHp, hearts: 3, lane: 1, elapsed: 0, sequence: 0,
      phase: 'warning', impact: 2300, nextAttack: 700, parryUntil: -1, readyAt: 0, moveAt: 0,
      danger: [1], event: '', strikes: 0, hits: 0 };
  }
  function action(f, kind) {
    if (!['warning','recovery'].includes(f.phase)) return false;
    if (kind === 'parry') {
      if (f.elapsed < f.readyAt) return false;
      f.parryUntil = f.elapsed + 310;
      f.readyAt = f.elapsed + 940;
      f.event = '패링 자세';
    } else {
      if (!['left','right'].includes(kind) || f.elapsed < f.moveAt) return false;
      const dest = Math.max(0, Math.min(2, f.lane + (kind === 'left' ? -1 : 1)));
      if (dest === f.lane) return false;
      f.lane = dest; f.moveAt = f.elapsed + 125; f.event = lanes[dest] + ' 이동';
    }
    return true;
  }
  function advance(f, delta) {
    if (!['warning','recovery'].includes(f.phase)) return;
    f.elapsed += delta;
    if (f.elapsed >= f.nextAttack) {
      f.nextAttack += 810; f.hp = Math.max(0, f.hp - f.power); f.strikes++;
    }
    if (f.hp && f.elapsed >= f.impact) {
      if (f.phase === 'warning') {
        if (!f.danger.includes(f.lane)) f.event = '회피 성공';
        else if (f.elapsed <= f.parryUntil) {
          f.hp = Math.max(0, f.hp - f.power * 3); f.event = '패링 성공 · 3배 반격'; f.strikes++;
        } else { f.hearts--; f.hits++; f.event = '피격'; }
        f.phase = 'recovery'; f.impact = f.elapsed + 650;
      } else {
        f.sequence++; f.phase = 'warning';
        const target = f.lane;
        f.danger = f.sequence % 3 === 2 ? [target, (target + 1) % 3] : [target];
        f.impact = f.elapsed + Math.max(850, 1710 - f.tier * 32 - (f.hp < f.maxHp / 2 ? 210 : 0));
        f.event = '';
      }
    }
    if (!f.hp) f.phase = 'won';
    else if (!f.hearts) f.phase = 'lost';
  }
  function readBest(tier) {
    try {
      const value = Number(localStorage.getItem(recordKey(tier)));
      return Number.isSafeInteger(value) && value > 0 ? value : null;
    } catch { return null; }
  }
  async function saveBest(tier, ms) {
    const write = () => localStorage.setItem(recordKey(tier), String(Math.min(ms, readBest(tier) || Infinity)));
    try {
      if (navigator.locks) await navigator.locks.request(recordKey(tier), write);
      else write();
      return true;
    } catch { return false; }
  }
  function mount({getState, asset, fmt, canEnter, onToggle}) {
    const $ = id => document.getElementById(id);
    const modal = $('boss-duel'), overlay = modal.querySelector('.duel-overlay'), paths = [...modal.querySelectorAll('.duel-paths i')];
    const tierSelect = $('duel-tier'), parry = $('duel-parry'), seconds = ms => (ms / 1000).toFixed(1) + '초';
    let fight, frame, prev, paused = false, run = 0;
    function tiers(selected) {
      let unlocked = 1;
      while (unlocked < cap && readBest(unlocked)) unlocked++;
      tierSelect.replaceChildren(...Array.from({length:unlocked}, (_, i) => new Option((i + 1) + '단계 · ' + guardian(i + 1), String(i + 1))));
      tierSelect.value = String(Math.min(selected || unlocked, unlocked));
    }
    function preview() {
      const tier = Number(tierSelect.value), best = readBest(tier);
      $('duel-chapter').textContent = '시련 ' + tier + '단계';
      $('duel-detail').textContent = best ? '내 최고 기록 ' + seconds(best) : '붉은 길에서 벗어나거나 섬광 순간 패링하세요. 첫 승리로 다음 시련을 열어요.';
      $('duel-result').textContent = guardian(tier);
    }
    function draw() {
      const f = fight, left = Math.max(0, f.impact - f.elapsed);
      modal.dataset.phase = paused ? 'paused' : f.phase;
      modal.dataset.lane = String(f.lane);
      modal.dataset.guarding = String(!paused && f.elapsed <= f.parryUntil);
      modal.dataset.flash = String(f.phase === 'warning' && left <= 310);
      modal.style.setProperty('--blade-x', [23,50,77][f.lane] + '%');
      modal.style.setProperty('--boss-hp', f.hp / f.maxHp * 100 + '%');
      $('duel-hp').textContent = f.hp.toLocaleString('ko-KR') + ' / ' + f.maxHp.toLocaleString('ko-KR');
      $('duel-hearts').textContent = '♥'.repeat(f.hearts) + '♡'.repeat(3 - f.hearts);
      $('duel-hearts').ariaLabel = '남은 체력 ' + f.hearts;
      $('duel-lane').textContent = lanes[f.lane] + ' 위치';
      paths.forEach((p,i) => { p.dataset.danger = String(f.phase === 'warning' && f.danger.includes(i)); p.dataset.current = String(i === f.lane); });
      $('duel-clock').textContent = f.phase === 'warning' ? (left / 1000).toFixed(1) : '✦';
      $('duel-warning').textContent = f.phase === 'warning' ? left <= 310 ? '✦ 지금 패링' : '⚠ ' + f.danger.map(i=>lanes[i]).join('·') + ' 위험' : f.event || '승부 종료';
      const hint = f.event || '붉은 예고를 피해요 · 섬광 순간 패링';
      if ($('duel-hint').textContent !== hint) $('duel-hint').textContent = hint;
      parry.disabled = f.elapsed < f.readyAt;
      $('duel-left').disabled = f.lane === 0;
      $('duel-right').disabled = f.lane === 2;
    }
    async function finish(f, id) {
      const won = f.phase === 'won', ms = Math.round(f.elapsed), old = readBest(f.tier);
      const saved = won && await saveBest(f.tier, ms);
      if (id !== run || !modal.open) return;
      tiers(saved && !old ? f.tier + 1 : f.tier);
      $('duel-chapter').textContent = f.tier + '단계 · ' + guardian(f.tier);
      $('duel-result').textContent = won ? old ? '시련 돌파' : '첫 승리!' : '파수꾼의 승리';
      $('duel-detail').textContent = won ? '돌파 ' + seconds(ms) + (saved ? ' · 최고 ' + seconds(readBest(f.tier)) : ' · 이 기기에 기록을 저장하지 못했어요.') : '검과 강화 단계는 그대로예요. 붉은 길을 확인하고 다시 도전하세요.';
      $('duel-start').textContent = saved && !old && f.tier < cap ? '다음 시련 도전' : '다시 도전';
      tierSelect.parentElement.hidden = false;
      overlay.hidden = false; $('duel-start').focus();
    }
    function tick(now) {
      if (paused || !modal.open) return;
      const before = fight.strikes, hits = fight.hits;
      advance(fight, Math.min(90, now - prev)); prev = now;
      if (before !== fight.strikes) modal.dataset.swing = String(fight.strikes % 2);
      if (hits !== fight.hits) modal.dataset.hit = String(fight.hits % 2);
      draw();
      if (['won','lost'].includes(fight.phase)) { finish(fight, run); return; }
      frame = requestAnimationFrame(tick);
    }
    function equip(tier) {
      const state = getState(), appearance = Forge.appearanceAt(state.appearance, state.level);
      fight = makeFight(state, tier);
      $('duel-boss-name').textContent = guardian(tier);
      $('duel-power').textContent = fight.power < 100000 ? fight.power.toLocaleString('ko-KR') :
        new Intl.NumberFormat('ko-KR', { notation: 'compact', maximumFractionDigits: 1 }).format(fight.power);
      $('duel-power').title = fight.power.toLocaleString('ko-KR');
      $('duel-weapon').textContent = '+' + fmt(state.level) + ' ' + (fight.magic ? fight.magic.name + ' ' : '') + appearance.name;
      $('duel-weapon').title = '+' + state.level + ' ' + appearance.name;
      $('duel-sword').src = asset('sword-' + appearance.level);
      $('duel-weapon').style.setProperty('--equipped-art', 'url(' + $('duel-sword').src + ')');
      modal.dataset.magic = fight.magic?.id || 'none';
      modal.style.setProperty('--magic-color', fight.magic?.color || '#ffd475');
      $('duel-magic-art').hidden = !fight.magic;
      if (fight.magic) $('duel-magic-art').src = 'assets/magic-' + fight.magic.id + '-plumes.webp';
      modal.querySelector('.duel-strike').textContent = fight.magic?.mark || '✦';
      draw();
    }
    function pause() {
      if (!modal.open || !overlay.hidden || !fight) return;
      paused = true; cancelAnimationFrame(frame); draw();
      $('duel-chapter').textContent = '시련 ' + fight.tier + '단계';
      $('duel-result').textContent = '잠시 멈춤'; $('duel-detail').textContent = '준비되면 전투를 이어가세요.';
      $('duel-start').textContent = '계속하기'; tierSelect.parentElement.hidden = true; overlay.hidden = false;
      $('duel-start').focus();
    }
    function input(kind) {
      if (!overlay.hidden || paused) return;
      if (action(fight,kind)) draw();
    }
    $('open-duel').onclick = () => {
      if (!canEnter() || getState().broken || getState().sold) return;
      tiers(); paused = false; tierSelect.parentElement.hidden = false; equip(Number(tierSelect.value)); preview();
      $('duel-start').textContent = '전투 시작'; overlay.hidden = false;
      modal.showModal(); onToggle(true); $('duel-start').focus();
    };
    tierSelect.onchange = () => { equip(Number(tierSelect.value)); preview(); $('duel-start').textContent = '전투 시작'; };
    $('duel-start').onclick = () => {
      if (!paused) { if (getState().broken || getState().sold || !canEnter()) {modal.close(); return;} equip(Number(tierSelect.value)); run++; delete modal.dataset.swing; delete modal.dataset.hit; }
      paused = false; overlay.hidden = true; prev = performance.now(); draw(); parry.focus(); frame = requestAnimationFrame(tick);
    };
    $('duel-return').onclick = $('duel-exit').onclick = () => modal.close();
    modal.addEventListener('close', () => { cancelAnimationFrame(frame); run++; paused = false; onToggle(false); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    window.addEventListener('pagehide',pause);
    for (const kind of ['left','right','parry']) $('duel-' + kind).onclick = () => input(kind);
    document.addEventListener('keydown', e => {
      const kind = { ArrowLeft:'left', KeyA:'left', ArrowRight:'right', KeyD:'right', Space:'parry', KeyF:'parry' }[e.code];
      if (!modal.open || !kind || !overlay.hidden || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.code === 'Space' && e.target === $('duel-exit')) return;
      e.preventDefault(); if (!e.repeat) input(kind);
    });
  }
  return { mount, makeFight, advance, action };
})();
