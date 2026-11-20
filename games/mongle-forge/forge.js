'use strict';

(() => {
  const $ = id => document.getElementById(id);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const number = new Intl.NumberFormat('ko-KR');
  const percent = value => (value / 100).toLocaleString('ko-KR', { maximumFractionDigits: 2 }) + '%';
  const asset = name => 'assets/' + (name === 'sword-32' ? 'sword-32-appraisal' : name) + '.webp';
  const stage = $('weapon-stage');
  const weapon = $('weapon');
  const button = $('strengthen');
  const specialButton = $('special-strengthen');
  const book = $('book');
  const fx = $('technique-fx');
  const labels = { success: '강화 성공', reset: '+0 초기화', shatter: '검 파괴', reforge: '새 검 제작', enchant: '특수 강화 성공', 'enchant-fail': '특수 강화 실패' };
  let state = Forge.restore(null);
  let storageOkay = true;
  let busy = false;
  let bookSignature = '';
  let lastHistory = '';
  let shownWeapon = '';
  let shownEffects = '';
  let outcomeTimer;

  function fmt(value) {
    const digits = value.toString();
    if (digits.length <= 12) return number.format(value);
    return digits[0] + '.' + digits.slice(1, 3) + 'e' + (digits.length - 1);
  }

  function level(value) {
    return '+' + fmt(value);
  }

  function node(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function loadStored() {
    if (!storageOkay) return { next: state, original: null };
    try {
      const original = localStorage.getItem(Forge.saveKey);
      const raw = original ? JSON.parse(original) : null;
      return { next: Forge.restore(raw), original: raw && raw.version !== 2 ? original : null };
    } catch {
      storageOkay = false;
      return { next: state, original: null };
    }
  }

  function persist(next, original) {
    try {
      if (original && !localStorage.getItem(Forge.backupKey)) localStorage.setItem(Forge.backupKey, original);
      localStorage.setItem(Forge.saveKey, Forge.serialize(next));
    } catch {
      storageOkay = false;
    }
    $('storage-status').textContent = storageOkay ? '이 브라우저에 자동 저장돼요.' : '브라우저 저장 공간을 사용할 수 없어요. 현재 탭에서 플레이할 수 있어요.';
  }

  async function transaction(action) {
    const update = () => {
      const { next, original } = loadStored();
      Forge.collectPassive(next);
      const event = action?.(next);
      persist(next, original);
      state = next;
      render();
      return event;
    };
    return navigator.locks ? navigator.locks.request(Forge.saveKey, update) : update();
  }

  function renderWeapon() {
    const form = Forge.formAt(state.level);
    const { enchantment, effects, numerator, denominator, base, value } = Forge.appraisal(state);
    const multiplier = (Number(numerator) / Number(denominator)).toLocaleString('ko-KR', { maximumFractionDigits: 3 });
    stage.dataset.enchantment = enchantment.id;
    $('enchantment-card').dataset.enchantment = enchantment.id;
    $('enchantment-card').hidden = state.broken;
    $('magic-tag').hidden = state.broken;
    $('magic-tag').textContent = effects.length === 1 ? enchantment.mark + ' ' + enchantment.name : effects.map(entry => entry.mark).join(' ') + ' ' + effects.length + '중 마법';
    $('magic-tag').title = effects.map(entry => entry.name).join(' + ');
    $('magic-slots').textContent = effects.length + ' / ' + Forge.enchantmentLimit;
    $('magic-multiplier').textContent = '가치 ×' + multiplier;
    const effectSignature = state.enchantments.join(',');
    if (effectSignature !== shownEffects) {
      shownEffects = effectSignature;
      $('magic-effects').replaceChildren(...Array.from({ length: Forge.enchantmentLimit }, (_, index) => {
        const effect = effects[index];
        const slot = node('li', 'magic-slot' + (effect ? '' : ' empty'));
        if (effect) {
          slot.dataset.enchantment = effect.id;
          slot.title = effect.name + ' · ' + effect.rank + ' · 가치 ×' + Number(effect.tenths) / 10;
          slot.append(node('span', 'slot-mark', effect.mark), node('span', '', effect.name));
        } else {
          slot.textContent = '＋ 빈 각인';
        }
        return slot;
      }));
      $('enchantment-fx').replaceChildren(...effects.map((effect, index) => {
        const layer = node('div', 'enchantment-fx');
        layer.dataset.enchantment = effect.id;
        layer.style.setProperty('--layer', index);
        layer.append(...Array.from({ length: 5 }, () => node('i', '')));
        return layer;
      }));
      const remaining = Forge.enchantments.filter(entry => !state.enchantments.includes(entry.id));
      const totalWeight = remaining.reduce((total, entry) => total + entry.weight, 0);
      $('special-pool').replaceChildren(...Forge.enchantments.map(effect => {
        const owned = state.enchantments.includes(effect.id);
        return node('li', '', effect.mark + ' ' + effect.name + ' · ' + effect.rank + ' ×' + Number(effect.tenths) / 10 + ' · ' +
          (owned ? '보유 중' : '성공 시 ' + (effect.weight / totalWeight * 100).toLocaleString('ko-KR', { maximumFractionDigits: 1 }) + '%'));
      }));
    }
    $('sword-value').textContent = fmt(value) + ' G';
    $('sword-value').title = number.format(value) + ' G';
    $('value-formula').textContent = state.broken ? '파괴된 검' : '기본 ' + fmt(base) + effects.map(entry => ' × ' + Number(entry.tenths) / 10).join('');
    const name = state.broken ? '깨진 검' : form.name;
    const src = asset(state.broken ? 'broken-sword' : 'sword-' + form.level);
    if (src !== shownWeapon) {
      weapon.src = src;
      shownWeapon = src;
    }
    weapon.alt = name;
    $('weapon-name').textContent = name;
    $('level').textContent = state.broken ? '파괴' : level(state.level);
    $('best').textContent = level(state.bestLevel);
    $('best').title = '+' + state.bestLevel;
    stage.dataset.broken = String(state.broken);
    stage.dataset.motif = form.effect;
    stage.style.setProperty('--spark', form.color);
    stage.style.setProperty('--aura-angle', Number(state.level % 12n) * 7 + 'deg');
    stage.dataset.awakened = String(form.awakening > 0n);
    $('awakening').hidden = state.broken || form.awakening === 0n;
    $('awakening').textContent = '각성 ' + fmt(form.awakening);
    $('stage-state').textContent = state.broken ? '새 검 제작 필요' : '끝없는 강화';
    const nextForm = Forge.formAt(form.next);
    $('next-form').textContent = state.broken ? '다시 벼릴 불꽃이 남아 있어요.' :
      level(form.next) + '에서 ' + nextForm.name + (nextForm.awakening > 0n ? ' · 각성 ' + fmt(nextForm.awakening) : '');
    const discovered = Forge.forms.filter(entry => entry.level <= state.bestLevel).length;
    $('book-count').textContent = discovered + '/' + Forge.forms.length;
  }

  function renderControls() {
    const offer = Forge.preview(state);
    const rate = Forge.income(state);
    const affordable = state.shards >= offer.cost;
    const cooling = Date.now() - state.lastAt < Forge.cooldown;
    const special = Forge.enchantPreview(state);
    specialButton.disabled = !!busy || cooling || state.broken || special.full || state.shards < special.cost;
    $('special-label').textContent = busy === 'special' ? '각인 중…' : !state.broken && special.full ? '3중 마법 완성' : '특수 강화';
    document.querySelector('.special-rules').hidden = state.broken;
    $('special-chance').textContent = state.broken ? '제작 필요' : special.full ? '3 / 3' : '성공 ' + percent(special.success);
    $('special-cost').textContent = state.broken || special.full ? '' : fmt(special.cost) + ' 별철';
    $('special-waiting').textContent = state.broken ? '새 검을 제작하면 다시 각인할 수 있어요.' : special.full ? '효과 세 가지의 이펙트와 가치 배율이 함께 적용돼요.' :
      state.shards < special.cost ? '별철이 모이고 있어요 · 약 ' + fmt((special.cost - state.shards + rate - 1n) / rate) + '초 뒤 각인' : '';
    $('wallet').textContent = fmt(state.shards);
    $('wallet').title = state.shards.toString();
    $('income').textContent = '+' + fmt(rate) + ' /초';
    $('attempt-cost').textContent = fmt(offer.cost) + ' 별철';
    $('attempt-title').textContent = state.broken ? '다시, 나무검부터' : level(offer.target) + '에 도전';
    $('probabilities').hidden = state.broken;
    $('broken-copy').hidden = !state.broken;
    $('button-label').textContent = busy ? '벼리는 중…' : state.broken ? '새 검 제작' : '강화하기';
    $('button-icon').textContent = state.broken ? '↻' : '✦';
    button.disabled = busy || cooling || !affordable;
    button.dataset.reforge = String(state.broken);
    $('chance-success').textContent = percent(offer.success);
    $('chance-reset').textContent = percent(offer.reset);
    $('chance-shatter').textContent = percent(offer.shatter);
    $('chance-bar').style.gridTemplateColumns = [offer.success, offer.reset, offer.shatter].map(weight => weight + 'fr').join(' ');
    $('risk-copy').textContent = offer.success === 10000 ? '이번 단계는 확정 성공이에요.' : '초기화는 +0에서 바로 재강화 · 파괴는 제작비를 내고 새 검 제작';
    $('forge-bonus').hidden = offer.bonus === 0 || state.broken;
    $('forge-bonus').textContent = '이 단계의 실패 보정 +' + percent(offer.bonus).replace('%', '%p');
    if (!affordable) {
      const seconds = (offer.cost - state.shards + rate - 1n) / rate;
      $('waiting').textContent = '별철이 모이고 있어요 · 약 ' + fmt(seconds) + '초 뒤 도전';
    } else {
      $('waiting').textContent = busy || cooling ? '불꽃이 가라앉는 중이에요.' : '스페이스바로도 ' + (state.broken ? '제작' : '강화') + '할 수 있어요.';
    }
  }

  function renderHistory() {
    $('attempts').textContent = fmt(state.attempts);
    $('shattered').textContent = fmt(state.shattered);
    const signature = JSON.stringify(state.history);
    if (lastHistory === signature) return;
    lastHistory = signature;
    $('empty-history').hidden = state.history.length > 0;
    if (state.history[0]) showOutcome(state.history[0], false);
    $('history').replaceChildren(...state.history.map(entry => {
      const item = node('li', 'history-item ' + entry.kind);
      const from = BigInt(entry.from);
      const target = BigInt(entry.target);
      item.append(
        node('span', 'history-symbol', entry.kind === 'success' || entry.kind === 'enchant' ? '✦' : entry.kind === 'shatter' ? '✕' : '↻'),
        node('strong', '', labels[entry.kind]),
        node('span', 'history-levels', entry.kind === 'reforge' ? '새 검 +0' : entry.kind === 'enchant' ?
          (Forge.enchantments.find(effect => effect.id === entry.enchantment)?.name ?? '효과 추가') : entry.kind === 'enchant-fail' ? level(from) + ' · 효과 유지' :
          level(from) + ' → ' + (entry.kind === 'success' ? level(target) : entry.kind === 'shatter' ? '파괴' : '+0')),
      );
      return item;
    }));
  }

  function renderBook() {
    const signature = state.bestLevel.toString();
    if (signature === bookSignature) return;
    bookSignature = signature;
    $('sword-book').replaceChildren(...Forge.forms.map(form => {
      const unlocked = state.bestLevel >= form.level;
      const item = node('li', 'collection-item' + (unlocked ? '' : ' undiscovered'));
      const image = node('img', '');
      image.src = asset('sword-' + form.level);
      image.alt = '';
      image.width = 140;
      image.height = 120;
      image.loading = 'lazy';
      item.append(image, node('span', 'book-level', level(form.level)), node('strong', '', unlocked ? form.name : '미발견'), node('small', '', unlocked ? form.detail : '이 단계에 도달하면 발견해요.'));
      return item;
    }));
  }

  function render() {
    renderWeapon();
    renderControls();
    renderHistory();
    if (book.open) renderBook();
  }

  function animateEvent(event) {
    clearTimeout(outcomeTimer);
    stage.dataset.outcome = event.kind;
    fx.replaceChildren();
    $('forge-fx').replaceChildren();
    if (!reducedMotion.matches) {
      const form = Forge.formAt(state.level);
      if (event.kind === 'success') {
        const effect = node('span', 'technique ' + form.effect);
        effect.append(node('i', 'technique-shape'), node('i', 'technique-shape'), node('i', 'technique-shape'));
        fx.append(effect);
        effect.addEventListener('animationend', action => {
          if (action.target === effect) effect.remove();
        });
      }
      const particles = node('span', 'forge-particles ' + event.kind);
      for (let index = 0; index < 8; index += 1) {
        const particle = node('i', '');
        particle.style.setProperty('--angle', (index * 45 + 15) + 'deg');
        particles.append(particle);
      }
      $('forge-fx').append(particles);
      particles.addEventListener('animationend', action => {
        if (action.target === particles) particles.remove();
      });
    }
    outcomeTimer = setTimeout(() => {
      delete stage.dataset.outcome;
      fx.replaceChildren();
      $('forge-fx').replaceChildren();
    }, 1100);
  }

  function showOutcome(event, animate = true) {
    const target = BigInt(event.target);
    const box = $('outcome');
    box.dataset.kind = event.kind;
    let title;
    let copy;
    if (event.kind === 'success') {
      const form = Forge.formAt(state.level);
      title = level(target) + ' 강화 성공!';
      const previous = Forge.formAt(BigInt(event.from));
      copy = form.index !== previous.index || form.awakening !== previous.awakening ? form.name + (form.awakening > 0n ? ' · 각성 ' + fmt(form.awakening) : '') + '을 발견했어요.' : '한 번 더 벼릴 준비가 됐어요.';
    } else if (event.kind === 'reset') {
      title = '강화 실패 · +0으로';
      copy = '효과는 모두 유지돼요. 나무검 +0에서 바로 다시 강화할 수 있어요. ' + level(target) + ' 재도전 보정 +' + percent(Forge.recoveryBonus).replace('%', '%p');
    } else if (event.kind === 'shatter') {
      title = '쨍그랑! 검이 깨졌어요.';
      copy = '붙어 있던 효과도 사라졌어요. 강화비 ' + fmt(event.spent ?? Forge.cost(target)) + ' 별철 소모 · 제작비 ' + fmt(Forge.preview(state).cost) + ' 별철로 새 검을 만드세요.';
    } else if (event.kind === 'enchant') {
      const effect = Forge.enchantments.find(entry => entry.id === event.enchantment);
      title = '특수 강화 성공! ' + (effect?.mark ?? '✧');
      copy = (effect?.name ?? '새 효과') + ' 추가 · 각 효과의 배율이 곱해져 감정가가 올라가요.';
    } else if (event.kind === 'enchant-fail') {
      title = '특수 강화 실패 · 효과 보존';
      copy = '별철만 소모했어요. 기존 강화 단계와 붙어 있던 효과는 그대로예요.';
    } else {
      title = '새 검이 준비됐어요.';
      copy = '+0에서 다시 시작해요. 최고 기록 ' + level(state.bestLevel);
    }
    $('outcome-title').textContent = title;
    $('outcome-copy').textContent = copy;
    if (animate) animateEvent(event);
  }

  async function attempt(special = false) {
    if (busy) return;
    busy = special ? 'special' : 'normal';
    renderControls();
    let event;
    try {
      event = await transaction(next => special ? Forge.enchant(next) : Forge.act(next));
      if (event) showOutcome(event);
    } finally {
      const delay = event ? Math.max(0, Forge.cooldown - (Date.now() - event.at)) : 0;
      setTimeout(() => {
        busy = false;
        renderControls();
      }, delay);
    }
  }

  const forgePanel = document.querySelector('.forge-panel');
  let tapStart = null;

  forgePanel.addEventListener('touchstart', event => {
    tapStart = null;
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    for (const control of [button, specialButton]) {
      const bounds = control.getBoundingClientRect();
      if (touch.clientX >= bounds.left && touch.clientX <= bounds.right &&
          touch.clientY >= bounds.top && touch.clientY <= bounds.bottom) {
        tapStart = { x: touch.clientX, y: touch.clientY, identifier: touch.identifier, control };
        break;
      }
    }
  }, { passive: true, capture: true });

  forgePanel.addEventListener('touchmove', event => {
    if (!tapStart) return;
    const touch = event.touches[0];
    if (event.touches.length !== 1 || Math.hypot(touch.clientX - tapStart.x, touch.clientY - tapStart.y) > 12) {
      tapStart = null;
    }
  }, { passive: true, capture: true });

  forgePanel.addEventListener('touchcancel', () => { tapStart = null; }, { passive: true, capture: true });
  forgePanel.addEventListener('touchend', event => {
    const start = tapStart;
    tapStart = null;
    if (!start || event.touches.length !== 0 || !event.cancelable) return;
    const touch = Array.from(event.changedTouches).find(point => point.identifier === start.identifier);
    if (!touch || Math.hypot(touch.clientX - start.x, touch.clientY - start.y) > 12) return;
    event.preventDefault();
    if (!start.control.disabled) start.control.click();
  }, { passive: false, capture: true });

  button.addEventListener('click', () => attempt());
  specialButton.addEventListener('click', () => attempt(true));
  $('open-book').addEventListener('click', () => {
    renderBook();
    book.showModal();
  });
  document.addEventListener('keydown', event => {
    if (event.code !== 'Space' || event.repeat || event.ctrlKey || event.altKey || event.metaKey || book.open) return;
    if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLInputElement) return;
    event.preventDefault();
    if (!button.disabled) attempt();
  });
  addEventListener('storage', event => {
    if (event.key !== Forge.saveKey || !event.newValue) return;
    try {
      state = Forge.restore(JSON.parse(event.newValue));
      render();
    } catch {
      $('storage-status').textContent = '다른 탭의 저장 내용을 읽을 수 없어요.';
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) transaction();
  });
  setInterval(() => {
    if (!document.hidden) transaction();
  }, 1000);

  transaction();
})();
