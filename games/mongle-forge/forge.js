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
  const labels = { success: '강화 성공', reset: '+0 초기화', shatter: '검 파괴', reforge: '새 검 제작', enchant: '특수 강화 성공', 'enchant-fail': '특수 강화 실패', protected: '보호권 발동', protection: '보호권 구매', sell: '무기 판매', reroll: '효과 리롤' };
  let state = Forge.restore(null);
  let storageOkay = true;
  let busy = false;
  let wardrobe;
  let lastHistory = '';
  let shownWeapon = '';
  let shownEffects = null;
  let outcomeTimer;
  let ranking;
  let saleToken;
  let renderedOffers;
  let updatePending = false;
  let updater;
  let magicVisual;
  let automatic;

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
    if (!storageOkay) return { next: state, reset: false };
    try {
      const previous = localStorage.getItem(Forge.wardrobeSaveKey) ?? localStorage.getItem(Forge.previousSaveKey) ?? localStorage.getItem(Forge.magicSaveKey) ?? localStorage.getItem(Forge.storageSaveKey) ?? localStorage.getItem(Forge.riskSaveKey) ?? localStorage.getItem(Forge.rainbowSaveKey) ?? localStorage.getItem(Forge.marketSaveKey) ?? localStorage.getItem(Forge.olderSaveKey);
      const original = localStorage.getItem(Forge.saveKey) ?? previous;
      const raw = original ? JSON.parse(original) : null;
      return { next: Forge.loadSeason(raw), reset: previous !== null || (!!raw && raw.season !== Forge.seasonId) || localStorage.getItem(Forge.legacySaveKey) !== null };
    } catch {
      storageOkay = false;
      return { next: state, reset: false };
    }
  }

  function persist(next, reset) {
    try {
      localStorage.setItem(Forge.saveKey, Forge.serialize(next));
      if (reset) {
        localStorage.removeItem(Forge.legacySaveKey);
        localStorage.removeItem(Forge.wardrobeSaveKey);
        localStorage.removeItem(Forge.previousSaveKey);
        localStorage.removeItem(Forge.magicSaveKey);
        localStorage.removeItem(Forge.storageSaveKey);
        localStorage.removeItem(Forge.riskSaveKey);
        localStorage.removeItem(Forge.rainbowSaveKey);
        localStorage.removeItem(Forge.marketSaveKey);
        localStorage.removeItem(Forge.olderSaveKey);
        localStorage.removeItem(Forge.backupKey);
      }
    } catch {
      storageOkay = false;
    }
    $('storage-status').textContent = storageOkay ? '이 브라우저에 자동 저장돼요.' : '브라우저 저장 공간을 사용할 수 없어요. 현재 탭에서 플레이할 수 있어요.';
  }

  async function transaction(action) {
    const update = () => {
      const { next, reset } = loadStored();
      Forge.collectPassive(next);
      const event = action?.(next);
      persist(next, reset);
      state = next;
      render();
      ranking?.changed();
      return event;
    };
    return navigator.locks ? navigator.locks.request(Forge.saveKey, update) : update();
  }

  function renderWeapon() {
    const form = Forge.formAt(state.level);
    const display = Forge.appearanceAt(state.appearance, state.level);
    const { enchantment, effects, numerator, denominator, levelTenths, base, value, magic, magicBonus } = Forge.appraisal(state);
    magicVisual?.update(magic);
    stage.dataset.boundMagic = magic?.id ?? 'none';
    stage.style.setProperty('--bound', magic?.color ?? '#d9ba78');
    const boundArt = document.querySelector('.bound-plumes');
    if (magic && boundArt.dataset.magic !== magic.id) { boundArt.src = 'assets/magic-' + magic.id + '-plumes.webp'; boundArt.dataset.magic = magic.id; }
    $('bound-seal').hidden = !magic;
    $('bound-name').textContent = magic ? '고유 마법 · ' + magic.name : '';
    $('bound-detail').textContent = magic ? magic.title + ' · 제' + fmt(magic.rank) + '마력' : '';
    $('bound-seal').title = magic?.detail ?? '';
    $('magic-value').hidden = !magic;
    $('magic-value').textContent = magic ? '고유 마법 보너스  +' + fmt(magicBonus) + ' G' : '';
    $('bound-hint').textContent = magic ? magic.name + ' 영혼 결속 · 강화할수록 마력과 가치가 자라요.' : '100강부터 강화 성공 시 아주 드물게 고유 마법이 깃들어요. 속성은 이 검에 결속돼요.';
    const multiplier = (Number(numerator) / Number(denominator)).toLocaleString('ko-KR', { maximumFractionDigits: 3 });
    stage.dataset.enchantment = enchantment?.id ?? 'none';
    $('enchantment-card').dataset.enchantment = enchantment?.id ?? 'none';
    $('enchantment-card').hidden = state.broken;
    $('magic-tag').hidden = state.broken;
    $('magic-tag').textContent = !effects.length ? '' : effects.length === 1 ? enchantment.mark + ' ' + enchantment.name : effects.map(entry => entry.mark).join(' ') + ' ' + effects.length + '중 각인';
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
      const totalWeight = Forge.enchantments.reduce((total, entry) => total + entry.weight, 0);
      const reroll = effects.length === Forge.enchantmentLimit;
      $('special-pool').replaceChildren(...Forge.enchantments.map(effect => {
        const owned = state.enchantments.filter(id => id === effect.id).length;
        const chance = reroll ? effects.reduce((total, current) => total + (current.id === effect.id ? 0 : effect.weight / (totalWeight - current.weight)) / effects.length, 0) : effect.weight / totalWeight;
        return node('li', '', effect.mark + ' ' + effect.name + ' · ' + effect.rank + ' ×' + Number(effect.tenths) / 10 + ' · ' +
          (owned ? '보유 ' + owned + '개 · ' : '') + (reroll ? '변환 결과 ' : '성공 시 ') + (chance * 100).toLocaleString('ko-KR', { maximumFractionDigits: 1 }) + '%');
      }));
    }
    $('sword-value').textContent = fmt(value) + ' G';
    $('sword-value').title = number.format(value) + ' G';
    $('appraisal-label').textContent = state.broken ? '감정가' : '감정가 · 강화 ×' + fmt(levelTenths / 10n) + (levelTenths % 10n ? '.' + levelTenths % 10n : '');
    $('value-formula').textContent = state.broken ? '파괴된 검' : '기본 ' + fmt(base) + effects.map(entry => ' × ' + Number(entry.tenths) / 10).join('');
    const name = state.sold ? '무기 판매 완료' : state.broken ? '깨진 검' : (magic ? magic.name + ' · ' : '') + display.name;
    const src = asset(state.broken ? 'broken-sword' : 'sword-' + display.level);
    if (src !== shownWeapon) {
      weapon.src = src;
      shownWeapon = src;
    }
    weapon.alt = name;
    weapon.title = [display.name,display.owner,display.release,display.variant].filter(Boolean).join(' · ');
    $('weapon-name').textContent = name;
    $('weapon-name').title = weapon.title;
    $('level').textContent = state.sold ? '판매 완료' : state.broken ? '파괴' : level(state.level);
    stage.dataset.sold = String(state.sold);
    $('sold-stage').hidden = !state.sold;
    $('best').textContent = level(state.bestLevel);
    $('best').title = '+' + state.bestLevel;
    stage.dataset.broken = String(state.broken);
    stage.dataset.motif = display.effect;
    stage.style.setProperty('--spark', display.color);
    stage.dataset.appearance = state.appearance;
    $('appearance-status').textContent = state.appearance === 'auto' ? '외형 자동 변경' : '선택한 외형 고정';
    stage.style.setProperty('--aura-angle', Number(state.level % 12n) * 7 + 'deg');
    stage.dataset.awakened = String(form.awakening > 0n);
    $('awakening').hidden = state.broken || form.awakening === 0n;
    $('awakening').textContent = '각성 ' + fmt(form.awakening);
    $('stage-state').textContent = state.broken ? '새 검 제작 필요' : Forge.protectionOffer(state).owned ? '보호권 적용 중' : '끝없는 강화';
    const nextForm = Forge.formAt(form.next);
    $('next-form').textContent = state.broken ? '특수효과 0개 · 새 검을 제작해 주세요.' :
      level(form.next) + '에서 ' + nextForm.name + (nextForm.awakening > 0n ? ' · 각성 ' + fmt(nextForm.awakening) : '');
    const discovered = Forge.forms.filter(entry => entry.level <= state.bestLevel).length;
    $('book-count').textContent = discovered + '/' + Forge.forms.length;
  }

  function renderControls() {
    const offer = Forge.preview(state);
    const rate = Forge.income(state);
    const capacity = Forge.passiveCapacity(state);
    const full = state.shards >= capacity;
    const affordable = state.shards >= offer.cost;
    const cooling = Date.now() - state.lastAt < Forge.cooldown;
    const special = Forge.enchantPreview(state);
    const protection = Forge.protectionOffer(state);
    renderedOffers = { normal: offer, special, protection };
    const happy = Forge.discountInfo();
    $('happy-hours').textContent = happy.active ? '한국시간 할인 중 · 모든 별철 지출 50% · ' + (happy.endHour === 24 ? '자정' : happy.endHour + '시') + '까지' : '별철 50% 할인 · 한국시간 07~08 · 12~14 · 21~24시';
    $('happy-hours').dataset.active = String(happy.active);
    const parts = Forge.incomeBreakdown(state);
    $('buy-protection').disabled = !!busy || updatePending || cooling || !protection.eligible || protection.owned || state.shards < protection.cost;
    $('protection-label').textContent = protection.owned ? level(protection.target) + ' 보호권 적용 중' : state.broken ? '강화 보호권' : level(protection.target) + ' 강화 보호권';
    $('protection-price').textContent = protection.owned ? '보유 1장 · 자동 사용' : protection.eligible ? fmt(protection.cost) + ' 별철' + (protection.discount ? ' · 50%' : '') : state.broken ? '새 검 제작 후 구매' : '확정 성공 단계';
    $('protection-price').title = '원가 ' + fmt(protection.originalCost) + ' 별철';
    $('protection-note').textContent = state.level >= 100n ? '현재 +100 이상: 실패 시 1강 하락 · 효과 유지·파괴 방지 · 실패할 때만 1장 사용' : '실패 시 단계·효과 유지 · 현재 +100부터는 1강 하락 · 파괴 방지 · 성공하면 보관';
    const tickets = Object.keys(state.protections).sort((a, b) => BigInt(a) < BigInt(b) ? -1 : 1);
    $('protection-stock').hidden = tickets.length === 0;
    $('protection-stock').textContent = '보관 중: ' + tickets.slice(0, 6).map(target => '+' + fmt(BigInt(target)) + ' 도전권').join(' · ') + (tickets.length > 6 ? ' 외 ' + (tickets.length - 6) + '종' : '');
    $('open-sale').disabled = !!busy || updatePending || cooling || state.broken;
    $('sale-price').textContent = state.broken ? '판매할 무기 없음' : '+' + fmt(Forge.saleOffer(state).shards) + ' 별철';
    $('income-breakdown').textContent = '기본 ' + fmt(parts.base) + ' · 최고 +' + fmt(parts.record) + ' · 현재 +' + fmt(parts.current) + (state.rankBonus && rate > Forge.baseIncome(state) ? ' · 랭킹 +' + fmt(Forge.rankReward(state.rankBonus.rank)) : '');
    specialButton.disabled = !!busy || updatePending || cooling || state.broken || state.shards < special.cost;
    $('special-label').textContent = busy === 'special' ? special.reroll ? '변환 중…' : '각인 중…' : special.reroll ? '효과 리롤' : '특수 강화';
    document.querySelector('.special-rules').hidden = state.broken;
    $('special-chance').textContent = state.broken ? '제작 필요' : special.reroll ? '무작위 1개 확정 변환' : '성공 ' + percent(special.success);
    $('special-cost').textContent = state.broken ? '' : fmt(special.cost) + ' 별철' + (special.discount ? ' · 50%' : '');
    $('special-cost').title = '원가 ' + fmt(special.originalCost) + ' 별철';
    $('special-copy').textContent = special.reroll ? '현재 단계 기준 · 무작위 1개 교체 · 감정가 상승·하락' : '현재 단계 기준 · 실패해도 단계와 효과는 유지돼요.';
    $('special-waiting').textContent = state.broken ? '새 검을 제작하면 다시 각인할 수 있어요.' :
      state.shards < special.cost ? '별철이 모이고 있어요 · 약 ' + fmt((special.cost - state.shards + rate - 1n) / rate) + '초 뒤 ' + (special.reroll ? '리롤' : '각인') :
      special.reroll ? '강화 단계와 나머지 두 효과는 유지돼요.' : '';
    $('wallet').textContent = fmt(state.shards);
    $('wallet').title = state.shards.toString();
    $('income').textContent = full ? '가득 참 · 제련 멈춤' : '+' + fmt(rate) + ' /초';
    $('income').title = '제련 중 생산량 +' + fmt(rate) + ' /초';
    $('smelter').dataset.full = String(full);
    $('income-capacity').textContent = '자동 수급 한도 ' + fmt(capacity) + ' 별철 · ' + (full ? '사용하면 다시 차요' : '가득 차면 멈춰요');
    $('income-capacity').title = '최고 기록 기준 보호권과 강화 3회분 · 기존 보유분과 판매 대금은 차감하지 않아요.';
    $('attempt-cost').textContent = fmt(offer.cost) + ' 별철' + (offer.discount ? ' · 50%' : '');
    $('attempt-cost').title = '원가 ' + fmt(offer.originalCost) + ' 별철';
    $('attempt-title').textContent = state.broken ? '다시, 나무검부터' : level(offer.target) + '에 도전';
    $('probabilities').hidden = state.broken;
    $('broken-copy').hidden = !state.broken || state.sold;
    $('button-label').textContent = busy ? '벼리는 중…' : state.broken ? '새 검 제작' : '강화하기';
    $('button-icon').textContent = state.broken ? '↻' : '✦';
    button.disabled = busy || updatePending || cooling || !affordable;
    button.dataset.reforge = String(state.broken);
    $('chance-success').textContent = percent(offer.success);
    $('chance-reset-label').textContent = protection.owned ? offer.protectionDrop ? '1강 하락' : '단계 유지' : '+0 초기화';
    $('chance-reset').textContent = percent(protection.owned ? offer.reset + offer.shatter : offer.reset);
    $('chance-shatter').textContent = percent(protection.owned ? 0 : offer.shatter);
    $('chance-bar').style.gridTemplateColumns = [offer.success, protection.owned ? offer.reset + offer.shatter : offer.reset, protection.owned ? 0 : offer.shatter].map(weight => weight + 'fr').join(' ');
    $('risk-copy').textContent = protection.owned ? offer.protectionDrop ? '보호권 적용 중 · 실패하면 ' + level(state.level - 1n) + ' · 효과 유지 · 파괴 방지' : '보호권 적용 중 · 실패해도 현재 단계와 효과를 지켜요.' : offer.success === 10000 ? '이번 단계는 확정 성공이에요.' : '초기화는 +0에서 바로 재강화 · 파괴는 제작비를 내고 새 검 제작';
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
    $('protection-uses').textContent = fmt(state.protectionUses);
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
        node('strong', '', entry.magicAwakened ? '고유 마법 발현' : labels[entry.kind]),
        node('span', 'history-levels', entry.kind === 'reroll' ? entry.slot + '번 · ' + (Forge.enchantments.find(effect => effect.id === entry.replaced)?.name ?? '이전 효과') + ' → ' + (Forge.enchantments.find(effect => effect.id === entry.enchantment)?.name ?? '새 효과') : entry.kind === 'protected' ? entry.to !== undefined && BigInt(entry.to) < from ? level(from) + ' → ' + level(BigInt(entry.to)) : level(from) + ' 유지' : entry.kind === 'protection' ? level(target) + ' 전용 · ' + fmt(BigInt(entry.amount ?? 0)) + ' 별철' : entry.kind === 'sell' ? '+' + fmt(BigInt(entry.amount ?? 0)) + ' 별철' : entry.kind === 'reforge' ? '새 검 +0' : entry.kind === 'enchant' ?
          (Forge.enchantments.find(effect => effect.id === entry.enchantment)?.name ?? '효과 추가') : entry.kind === 'enchant-fail' ? level(from) + ' · 효과 유지' :
          level(from) + ' → ' + (entry.kind === 'success' ? level(target) : entry.kind === 'shatter' ?
            '파괴' + (entry.lostEffects ? ' · 효과 ' + entry.lostEffects + '개 소멸' : '') : '+0')),
      );
      if (entry.magicAwakened) item.append(node('small', 'history-magic', Forge.magics.find(magic => magic.id === entry.magicAwakened)?.name + ' 영혼 결속'));
      return item;
    }));
  }

  function renderBook() {
    wardrobe?.render();
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
    delete $('enchantment-card').dataset.rerollSlot;
    if (event.kind === 'reroll') $('enchantment-card').dataset.rerollSlot = String(event.slot);
    fx.replaceChildren();
    $('forge-fx').replaceChildren();
    if (!reducedMotion.matches) {
      const form = Forge.appearanceAt(state.appearance, state.level);
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
      delete $('enchantment-card').dataset.rerollSlot;
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
    } else if (event.kind === 'protected') {
      const dropped = event.to !== undefined && BigInt(event.to) < BigInt(event.from);
      title = dropped ? '파괴 방어! ' + level(BigInt(event.from)) + ' → ' + level(BigInt(event.to)) : '보호권 발동! ' + level(BigInt(event.from)) + ' 유지';
      copy = (dropped ? '현재 +100 이상에서는 보호권을 써도 1강 하락해요. 효과는 그대로예요.' : '보호권 1장으로 초기화와 파괴를 막았어요. 효과도 그대로예요.') + ' 재도전 보정 +' + percent(Forge.recoveryBonus).replace('%', '%p');
    } else if (event.kind === 'protection') {
      title = level(target) + ' 도전 보호권 구매 완료';
      copy = fmt(BigInt(event.amount)) + ' 별철 사용 · 실패할 때만 자동으로 한 장을 사용해요.';
    } else if (event.kind === 'sell') {
      title = '무기 판매 · +' + fmt(BigInt(event.amount)) + ' 별철';
      copy = '감정가의 10%를 받았어요. 새 검을 제작해 다시 시작할 수 있어요.';
    } else if (event.kind === 'reset') {
      title = '강화 실패 · +0으로';
      copy = '효과는 모두 유지돼요. 나무검 +0에서 바로 다시 강화할 수 있어요. ' + level(target) + ' 재도전 보정 +' + percent(Forge.recoveryBonus).replace('%', '%p');
    } else if (event.kind === 'shatter') {
      title = '쨍그랑! 검이 깨졌어요.';
      copy = (event.lostEffects ? '특수효과 ' + event.lostEffects + '개가 모두 사라졌어요. ' : '붙어 있던 효과가 모두 사라졌어요. ') +
        '강화비 ' + fmt(BigInt(event.spent ?? Forge.cost(target))) + ' 별철 소모 · 제작비 ' + fmt(Forge.preview(state).cost) + ' 별철로 새 검을 만드세요.';
    } else if (event.kind === 'enchant') {
      const effect = Forge.enchantments.find(entry => entry.id === event.enchantment);
      title = '특수 강화 성공! ' + (effect?.mark ?? '✧');
      copy = (effect?.name ?? '새 효과') + ' 추가 · 각 효과의 배율이 곱해져 감정가가 올라가요.';
    } else if (event.kind === 'reroll') {
      const previous = Forge.enchantments.find(effect => effect.id === event.replaced);
      const next = Forge.enchantments.find(effect => effect.id === event.enchantment);
      title = '효과 리롤 완료 · ' + event.slot + '번 각인';
      copy = previous.name + ' → ' + next.name + ' · 감정가 ' + fmt(BigInt(event.valueBefore)) + ' → ' + fmt(BigInt(event.valueAfter)) + ' G';
    } else if (event.kind === 'enchant-fail') {
      title = '특수 강화 실패 · 효과 보존';
      copy = '별철만 소모했어요. 기존 강화 단계와 붙어 있던 효과는 그대로예요.';
    } else {
      title = '새 검이 준비됐어요.';
      copy = '새 효과 하나를 가진 검 +0으로 시작해요. 최고 기록 ' + level(state.bestLevel);
    }
    if (event.magicAwakened) {
      const magic = Forge.magics.find(entry => entry.id === event.magicAwakened);
      title = magic.name + '이 검에 깃들었어요!';
      copy = level(state.level) + ' · ' + magic.title + '. 이 검의 고유 마법은 바뀌지 않으며, 감정가와 이펙트가 강화에 따라 자라요.';
    }
    $('outcome-title').textContent = title;
    $('outcome-copy').textContent = copy;
    if (animate) animateEvent(event);
  }

  async function attempt(action = 'forge', guard) {
    if (busy || updatePending) return;
    const displayed = renderedOffers;
    const specialOffer = action === 'special' ? displayed.special : null;
    busy = action;
    renderControls();
    let event;
    try {
      if (!await updater.check()) return;
      if (guard && !guard()) return;
      event = await transaction(next => guard && !guard() ? null : action === 'special' ? specialOffer.reroll ? Forge.reroll(next, Date.now(), Math.random, specialOffer.token) : Forge.enchant(next, Date.now(), Math.random, specialOffer.token) : action === 'protection' ? Forge.buyProtection(next, Date.now(), displayed.protection.token) : action === 'sell' ? Forge.sell(next, Date.now(), saleToken) : Forge.act(next, Date.now(), Math.random, displayed.normal.token));
      if (event) showOutcome(event, !['protection', 'sell'].includes(event.kind));
      else if (action !== 'sell') $('waiting').textContent = '비용이나 무기 상태가 바뀌었어요. 표시를 확인하고 다시 눌러 주세요.';
      if (action === 'sell') {
        if (event) $('sale-dialog').close();
        else $('sale-error').textContent = '무기가 바뀌었거나 거래 중이에요. 닫은 뒤 판매 가격을 다시 확인해 주세요.';
      }
      return event;
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
    for (const control of [button, specialButton, $('buy-protection'), $('open-sale')]) {
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
  specialButton.addEventListener('click', () => attempt('special'));
  $('buy-protection').addEventListener('click', () => attempt('protection'));
  $('open-sale').addEventListener('click', () => {
    const offer = Forge.saleOffer(state);
    saleToken = offer.token;
    $('sale-weapon').textContent = Forge.formAt(state.level).name + ' ' + level(state.level);
    $('sale-value').textContent = fmt(offer.value) + ' G';
    $('sale-reward').textContent = '+' + fmt(offer.shards);
    $('sale-error').textContent = '';
    $('sale-dialog').showModal();
  });
  $('confirm-sale').addEventListener('click', () => attempt('sell'));
  $('open-book').addEventListener('click', () => {
    wardrobe?.open();
    book.showModal();
    magicVisual?.pause(true);
  });
  book.addEventListener('close', () => magicVisual?.pause(false));
  $('open-wardrobe').addEventListener('click', () => $('open-book').click());
  document.addEventListener('keydown', event => {
    if (event.code !== 'Space' || event.repeat || event.ctrlKey || event.altKey || event.metaKey || book.open || $('ranking').open || $('sale-dialog').open) return;
    if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLInputElement) return;
    event.preventDefault();
    if (!button.disabled) attempt();
  });
  addEventListener('storage', event => {
    if (event.key !== Forge.saveKey || !event.newValue) return;
    try {
      state = Forge.loadSeason(JSON.parse(event.newValue));
      render();
      ranking?.changed();
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

  magicVisual = ForgeMagic.mount($('bound-canvas'), weapon);
  updater = ForgeUpdate.mount({
    revision: Forge.clientRevision,
    onPending: () => { updatePending = true; automatic?.suspend(); renderControls(); },
    beforeReload: async () => {
      if (busy) return false;
      await transaction();
      try { return localStorage.getItem(Forge.saveKey) === Forge.serialize(state); }
      catch { return false; }
    },
    onStatus: (message, retry) => {
      $('update-status').textContent = message;
      $('update-retry').hidden = !retry;
    },
  });
  $('update-retry').addEventListener('click', () => updater.retry());
  ranking = ForgeRanking.mount({
    getState: () => state, fmt, asset,
    capture: (nickname, weaponName) => transaction(next => { Forge.rememberWeapon(next); return Forge.rankingRecord(next, nickname, weaponName); }),
    onBonus: rank => transaction(next => Forge.setRankBonus(next, rank)),
    onGrant: grant => transaction(next => {
      const before = next.shards;
      const applied = Forge.applyAdminGrant(next, grant);
      if (next.shards > before) {
        $('outcome-title').textContent = '운영자 별철 지급';
        $('outcome-copy').textContent = '별철 ' + fmt(next.shards - before) + '개가 추가됐어요.';
      }
      return applied;
    }),
    beforePublish: () => updater.check(),
  });
  wardrobe = ForgeWardrobe.mount({ getState: () => state, asset, fmt,
    select: async choice => {
      if (updatePending || !await updater.check()) return false;
      return transaction(next => !updatePending && Forge.selectAppearance(next, choice));
    },
  });
  transaction(next => { if (next.rankingBest) Forge.rememberWeapon(next); }).then(() => {
    automatic = ForgeAuto.mount({ getState: () => state, step: action => attempt(action, () => automatic?.active()), canAct: () => !busy && !updatePending, fmt });
  });
})();
