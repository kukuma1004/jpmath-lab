'use strict';

(() => {
  const $ = id => document.getElementById(id);
  const number = new Intl.NumberFormat('ko-KR');
  const fmt = value => number.format(value);
  const art = name => 'assets/' + name + '.webp';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const keyboard = ['1', '2', '3', 'q', 'w', 'e', 'a', 's', 'd'];
  const spots = [];
  const choices = [];
  const shopButtons = new Map();
  const levelMarkers = [];
  const scene = $('scene');
  const roundButton = $('round-button');
  const strengthen = $('strengthen');
  const status = $('status');
  const book = $('book');
  const timeBar = $('time-bar');
  let storageFailed = false;
  let visibleForm = -1;
  let endingShown = false;
  let run = null;
  let pauseTime = null;
  let result = null;
  let state = readSave();
  const returnedWith = Forge.collectPassive(state);

  function readSave() {
    try {
      return Forge.restore(JSON.parse(localStorage.getItem(Forge.saveKey)));
    } catch {
      return Forge.restore(null);
    }
  }

  function save() {
    try {
      localStorage.setItem(Forge.saveKey, JSON.stringify(state));
      storageFailed = false;
    } catch {
      storageFailed = true;
      status.textContent = '이 브라우저에서 저장할 수 없어요. 현재 탭에서 플레이할 수 있어요.';
    }
  }

  function tell(message) {
    status.textContent = storageFailed ? message + ' · 브라우저 저장 불가' : message;
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function image(name, alt = '') {
    const img = element('img', '');
    img.src = art(name);
    img.alt = alt;
    img.draggable = false;
    return img;
  }

  Forge.regions.forEach((region, index) => {
    const button = element('button', 'location');
    button.type = 'button';
    const name = element('span', '', region.name);
    const requirement = element('small', '');
    button.append(name, requirement);
    button.addEventListener('click', () => {
      if (run || state.level < region.level || state.region === index) return;
      state.region = index;
      result = null;
      save();
      render();
    });
    $('locations').append(button);
    choices.push({ button, requirement });
  });

  Forge.forms.forEach(form => {
    const marker = element('span', '', '+' + form.level);
    $('level-track').append(marker);
    levelMarkers.push(marker);
  });

  for (const [id, upgrade] of Object.entries(Forge.upgrades)) {
    const button = element('button', 'shop-item');
    button.type = 'button';
    button.append(image(upgrade.art));
    const copy = element('span', 'shop-copy');
    const name = element('b', '', upgrade.name);
    const effect = element('small', '', upgrade.text);
    copy.append(name, effect);
    const cost = element('span', 'shop-cost');
    button.append(copy, cost);
    button.addEventListener('click', () => buy(id));
    $('upgrades').append(button);
    shopButtons.set(id, { button, cost, name });
  }

  for (let index = 0; index < 9; index += 1) {
    const button = element('button', 'foe');
    button.type = 'button';
    button.style.setProperty('--bob', (-index * 0.38) + 's');
    const img = image('sprout');
    const key = element('kbd', 'spot-key', keyboard[index].toUpperCase());
    key.setAttribute('aria-hidden', 'true');
    const hp = element('span', 'hp');
    const bar = element('span', 'hp-fill');
    hp.append(bar);
    button.append(img, hp, key);
    button.addEventListener('click', () => attack(index));
    $('spots').append(button);
    spots.push({ button, img, hp, bar, art: 'sprout' });
  }

  function renderWeapon() {
    const index = Forge.formIndex(state.level);
    const form = Forge.forms[index];
    if (index !== visibleForm) {
      visibleForm = index;
      $('weapon').src = art('sword-' + form.level);
      $('weapon').alt = form.name;
      $('weapon-name').textContent = form.name;
      $('weapon-stage').dataset.form = form.pattern;
      $('weapon-stage').style.setProperty('--spark', form.color);
      $('book-count').textContent = (index + 1) + '/' + Forge.forms.length;
      $('weapon-perk').textContent = form.perk;
    }
    $('level').textContent = '+' + state.level;
    $('power').textContent = '공격력 ' + Forge.power(state);
    levelMarkers.forEach((marker, i) => {
      marker.classList.toggle('unlocked', i <= index);
      marker.classList.toggle('current', i === index);
    });
    const next = Forge.forms[index + 1];
    $('next-form').textContent = next
      ? '+' + next.level + '에서 ' + next.name + '으로 변해요'
      : '모든 검의 형태를 발견했어요!';
  }

  function renderMoney() {
    $('wallet').textContent = fmt(state.shards);
    const swordPrice = Forge.prices[state.level];
    strengthen.disabled = Boolean(run) || swordPrice === undefined || state.shards < swordPrice;
    $('forge-link').hidden = strengthen.disabled;
    strengthen.textContent = swordPrice === undefined ? '최고 강화 +12' : '+' + (state.level + 1) + ' 강화 · ' + fmt(swordPrice) + ' 별철';
    $('passive').textContent = '자동 채굴 ' + (24 * state.miner) + '/분';
    for (const [id, row] of shopButtons) {
      const upgrade = Forge.upgrades[id];
      const level = state[id];
      const price = upgrade.prices[level];
      const locked = state.level < (upgrade.unlock ?? 0);
      row.name.textContent = upgrade.name + (level ? ' +' + level : '');
      row.button.disabled = Boolean(run) || locked || price === undefined || state.shards < price;
      row.cost.textContent = locked ? '검 +' + upgrade.unlock : price === undefined ? '완료' : fmt(price);
    }
  }

  function renderBoard() {
    const region = Forge.regions[state.region];
    const active = Boolean(run);
    scene.className = 'scene ' + region.texture + (active ? ' active' : '');
    $('field-title').textContent = region.name;
    $('field-factor').textContent = state.cleared[state.region] ? '문지기 격파' : ['첫 원정지', '두 번째 원정지', '마지막 원정지'][state.region];
    $('ready-card').hidden = active;
    $('run-stats').hidden = !active;
    choices.forEach(({ button, requirement }, i) => {
      const locked = state.level < Forge.regions[i].level;
      button.disabled = active || locked;
      button.setAttribute('aria-pressed', String(i === state.region));
      requirement.textContent = locked ? '검 +' + Forge.regions[i].level : state.cleared[i] ? '✓' : '';
    });

    if (run) {
      $('round-note').textContent = state.level < 2 ? '말랑이를 눌러 검을 휘둘러요.' : '타격 ' + Forge.chainEvery(state) + '회마다 연계 베기가 나가요.';
      roundButton.textContent = '원정 마치기';
      renderHits();
      tick();
      return;
    }

    timeBar.style.transform = 'scaleX(1)';
    $('remaining').textContent = Forge.seconds + '초';
    scene.style.setProperty('--wave', '#fff1ad');
    for (const [index, slot] of spots.entries()) {
      const nearCenter = index === 4;
      const enemy = region.enemies[index % 2];
      showSpot(slot, enemy, false);
      slot.button.classList.toggle('preview-hole', nearCenter);
    }

    const won = state.level === 12 && state.cleared[2];
    $('welcome-art').src = art(won ? 'sword-12' : result?.won ? 'meteor' : 'ore');
    $('ready-title').textContent = won ? '별꼬리 성검 완성!' : result ? '별철 +' + fmt(result.earned) : '별철을 찾아 출발!';
    $('ready-copy').textContent = won ? '마지막 문지기를 넘어 최고의 대장장이가 됐어요.' :
      result ? (result.won ? '문지기를 쓰러뜨렸어요!' : '모은 별철로 검을 강화해 보세요.') :
        Forge.seconds + '초 동안 말랑이를 눌러 검을 휘둘러요.';
    $('round-note').textContent = result ? (result.bonus ? '목표 달성 보너스 +' + fmt(result.bonus) + ' 별철' : '모은 별철은 바로 보관돼요.') : '말랑이를 쓰러뜨려 별철을 모아요.';
    roundButton.replaceChildren(document.createTextNode(result ? '다시 원정 ' : '원정 시작 '), element('span', 'arrow', '→'));
    roundButton.lastChild.setAttribute('aria-hidden', 'true');
  }

  function showSpot(slot, enemy, active) {
    if (slot.art !== enemy.art) {
      slot.art = enemy.art;
      slot.img.src = art(enemy.art);
    }
    slot.button.disabled = !active;
    slot.button.classList.toggle('boss', Boolean(enemy.boss));
    slot.hp.hidden = !active || enemy.maxHp <= 1;
    if (active) {
      slot.button.setAttribute('aria-label', enemy.name + ', 체력 ' + enemy.hp + ' / ' + enemy.maxHp);
      slot.bar.style.transform = 'scaleX(' + enemy.hp / enemy.maxHp + ')';
    }
  }

  function renderHits() {
    run.spots.forEach((enemy, index) => {
      spots[index].button.classList.remove('preview-hole');
      showSpot(spots[index], enemy, true);
    });
    $('earned').textContent = fmt(run.earned);
    $('goal-label').firstChild.textContent = run.bossAppeared ? '문지기 ' : '문지기까지 ';
    $('goal').textContent = run.bossDefeated ? '격파!' : run.bossAppeared ? '등장!' : Math.max(0, run.region.goal - run.kills) + '마리';
  }

  function render() {
    renderWeapon();
    renderMoney();
    renderBoard();
  }

  function buy(id) {
    if (run) return;
    const prior = Forge.formIndex(state.level);
    if (!Forge.purchase(state, id)) return;
    save();
    render();
    if (id !== 'level') {
      tell(Forge.upgrades[id].name + ' +' + state[id] + ' 완료!');
      return;
    }
    const next = Forge.formIndex(state.level);
    const unlocked = Forge.regions.find(region => region.level === state.level);
    const changed = next !== prior;
    const form = Forge.forms[next];
    tell(changed ? '+' + state.level + ' 강화 성공! ' + form.name + ' 획득' + (unlocked ? ' · ' + unlocked.name + ' 개방' : '') :
      '+' + state.level + ' 강화 성공' + (unlocked ? ' · ' + unlocked.name + ' 개방' : ''));
    animateForge(changed);
    checkEnding();
  }

  function animateForge(changed) {
    if (reduced.matches) return;
    const duration = changed ? 720 : 350;
    $('weapon').getAnimations().forEach(animation => animation.cancel());
    $('weapon').animate([
      { transform: 'translateY(0) scale(1) rotate(0)' },
      { transform: 'translateY(4px) scale(.89) rotate(-8deg)', offset: 0.18 },
      { transform: 'translateY(-11px) scale(1.1) rotate(8deg)', offset: 0.48 },
      { transform: 'translateY(0) scale(1) rotate(0)' },
    ], { duration, easing: 'cubic-bezier(.2,.75,.32,1)' });
    const effect = element('span', changed ? 'forge-burst evolved' : 'forge-burst', '✧');
    $('forge-fx').replaceChildren(effect);
    effect.addEventListener('animationend', () => effect.remove(), { once: true });
  }

  function animateHit(hit, chain) {
    const slot = spots[hit.target];
    const img = slot.img;
    if (!reduced.matches) {
      img.getAnimations().forEach(animation => animation.cancel());
      img.animate([
        { transform: 'scale(1) rotate(0)' },
        { transform: 'scale(.82,1.06) rotate(-12deg) translateX(-4px)', offset: 0.25 },
        { transform: 'scale(1.1,.95) rotate(4deg)', offset: 0.62 },
        { transform: 'scale(1) rotate(0)' },
      ], { duration: 235, easing: 'cubic-bezier(.2,.7,.3,1)' });
    }
    if (reduced.matches) return;
    const fx = element('span', chain ? 'hit-flare chain' : 'hit-flare');
    const col = hit.target % 3;
    const row = Math.floor(hit.target / 3);
    fx.style.left = (100 / 3 * (col + 0.5)) + '%';
    fx.style.top = (100 / 3 * (row + 0.5)) + '%';
    fx.append(element('i', 'slash'), element('i', 'spark'), element('b', 'gain', hit.reward ? '+' + hit.reward : '−' + hit.points));
    $('fx').append(fx);
    fx.addEventListener('animationend', event => {
      if (event.target === fx) fx.remove();
    });
  }

  function attack(index) {
    if (!run || pauseTime !== null) return;
    if (Date.now() >= run.until) {
      finishRun();
      return;
    }
    const hit = Forge.strike(state, run, index);
    if (!hit) return;
    if (hit.total) save();
    renderMoney();
    renderHits();
    scene.style.setProperty('--wave', hit.color);
    scene.dataset.pattern = Forge.forms[Forge.formIndex(state.level)].pattern;
    hit.hits.forEach((target, i) => animateHit(target, hit.chain && i > 0));
  }

  function checkEnding() {
    if (endingShown || state.level < 12 || !state.cleared[2]) return;
    endingShown = true;
    tell('별꼬리 성검을 완성하고 달빛 문지기를 격파했어요!');
  }

  function finishRun() {
    if (!run) return;
    const bonus = Forge.finish(state, run);
    result = { earned: run.earned, bonus, won: run.bossDefeated };
    const restoreFocus = $('spots').contains(document.activeElement);
    run = null;
    pauseTime = null;
    save();
    render();
    if (restoreFocus) roundButton.focus({ preventScroll: true });
    tell('원정 종료 · 별철 ' + fmt(result.earned) + '개 획득' + (result.won ? ' · 문지기 격파' : ''));
    checkEnding();
  }

  function tick() {
    if (!run) return;
    const remaining = run.until - (pauseTime ?? Date.now());
    if (remaining <= 0) {
      finishRun();
      return;
    }
    const seconds = Math.ceil(remaining / 1000);
    const time = seconds + '초';
    if ($('remaining').textContent !== time) $('remaining').textContent = time;
    timeBar.style.transform = 'scaleX(' + (remaining / (Forge.seconds * 1000)) + ')';
  }

  roundButton.addEventListener('click', () => {
    if (run) {
      finishRun();
      return;
    }
    run = Forge.begin(state, Date.now());
    render();
    tell('원정 시작! 말랑이를 눌러 공격하세요.');
  });
  strengthen.addEventListener('click', () => buy('level'));

  function showBook() {
    const visible = Forge.formIndex(state.level);
    $('sword-book').replaceChildren(...Forge.forms.map((form, index) => {
      const item = element('li', 'collection-item');
      const discovered = index <= visible;
      item.classList.toggle('undiscovered', !discovered);
      item.append(
        image('sword-' + form.level),
        element('span', 'book-level', '+' + form.level),
        element('strong', '', discovered ? form.name : '미발견'),
        element('small', '', discovered ? form.perk : '강화하면 도감에 등록돼요'),
      );
      return item;
    }));
    book.showModal();
    updatePause();
  }
  $('open-book').addEventListener('click', showBook);
  book.addEventListener('close', updatePause);

  document.addEventListener('keydown', event => {
    if (!run || event.repeat || event.altKey || event.ctrlKey || event.metaKey || book.open) return;
    const key = event.key.toLowerCase();
    const numeric = '123456789'.indexOf(key);
    const mapped = keyboard.indexOf(key);
    const index = key.length === 1 && numeric !== -1 ? numeric : mapped;
    if (index < 0) return;
    event.preventDefault();
    attack(index);
  });

  function updatePause() {
    if (document.hidden || book.open) {
      if (run && pauseTime === null) pauseTime = Date.now();
      return;
    }
    if (run && pauseTime !== null) run.until += Date.now() - pauseTime;
    pauseTime = null;
  }

  document.addEventListener('visibilitychange', () => {
    updatePause();
    if (document.hidden) return;
    const income = Forge.collectPassive(state);
    if (income > 0) {
      save();
      renderMoney();
      tell('채굴기가 별철 ' + fmt(income) + '개를 모았어요.');
    }
    tick();
  });

  addEventListener('storage', event => {
    if (event.key !== Forge.saveKey) return;
    const latest = readSave();
    if (run && ['level', 'polish', 'echo', 'region'].every(id => state[id] === latest[id])) {
      state = latest;
      renderMoney();
      return;
    }
    run = null;
    pauseTime = null;
    result = null;
    state = latest;
    render();
    tell('다른 탭에 저장된 진행 상황을 불러왔어요.');
  });

  setInterval(() => {
    if (document.hidden) return;
    tick();
    if (Forge.collectPassive(state) > 0) {
      save();
      renderMoney();
    }
  }, 100);

  render();
  if (returnedWith > 0) {
    save();
    tell('쉬는 동안 채굴기가 별철 ' + fmt(returnedWith) + '개를 모았어요.');
  }
})();
