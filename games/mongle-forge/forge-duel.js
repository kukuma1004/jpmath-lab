const ForgeDuel = (() => {
  'use strict';
  const number = new Intl.NumberFormat('ko-KR');
  const seconds = ms => (ms / 1000).toFixed(1) + '초';
  const actionKeys = { KeyJ: 'attack', Space: 'dodge' };
  const feedbackEvents = new Set(['dodge', 'miss', 'hit', 'heavy', 'hurt', 'evade', 'effect', 'phase']);
  const effectColors = { cinder: '#ffad72', solar: '#ffdb79', astral: '#c7dfff', verdant: '#b9ef96', frost: '#a7efff', storm: '#bad5ff', lunar: '#e6b5ff' };

  function mount({ getState, asset, fmt, canEnter, onToggle, onVictory, onExchangeGuide }) {
    const $ = id => document.getElementById(id);
    const modal = $('boss-duel');
    const overlay = modal.querySelector('.duel-overlay');
    const arena = modal.querySelector('.duel-arena');
    const field = modal.querySelector('.duel-field');
    const guardian = modal.querySelector('.duel-enemy');
    const blade = modal.querySelector('.duel-blade');
    const start = $('duel-start');
    const pauseButton = $('duel-pause');
    const controls = modal.querySelector('.duel-controls');
    const buttons = [...controls.querySelectorAll('button')];
    const dodgeButton = $('duel-dodge');
    const attackButton = $('duel-attack');
    const attackLabel = $('duel-attack-label');
    const bossHpLabel = $('duel-hp');
    const playerHpLabel = $('duel-hearts');
    const phaseLabel = $('duel-phase');
    const timerLabel = $('duel-time');
    const warningLabel = $('duel-warning');
    const clockLabel = $('duel-clock');
    const hintLabel = $('duel-hint');
    const floor = $('duel-danger').getContext('2d');
    const fx = $('duel-effects').getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = matchMedia('(pointer: coarse)');
    const ember = makeEmber();
    let fight, pendingFrame, prev, run = 0, active = false, paused = false;
    let width = 0, height = 0, ratio = 1;
    let marks = [], seenId = null, lastAction = null, impact = null, lastStrike = null;
    let attackShapeMemo = null, rejected = null, lastFeedback = null;
    let floorDirty = true, paintedAttack = null, paintedUrgent = false, paintedZones = [];
    let fxPaintTime = -Infinity, hadEffects = false;
    let lastBossHp, lastPlayerHp, lastPhase, lastRemaining;

    function makeEmber() {
      const sprite = document.createElement('canvas');
      sprite.width = sprite.height = 48;
      const ctx = sprite.getContext('2d');
      if (!ctx) return sprite;
      const glow = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);
      glow.addColorStop(0, '#fff7c1');
      glow.addColorStop(.25, '#ffcb49');
      glow.addColorStop(.45, '#ff641be8');
      glow.addColorStop(1, '#fa350000');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, 48, 48);
      ctx.fillStyle = '#fff7c1';
      ctx.beginPath();
      ctx.ellipse(24, 24, 6, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      return sprite;
    }

    function layout() {
      if (!modal.open) return;
      width = field.clientWidth; height = field.clientHeight;
      ratio = Math.min(devicePixelRatio || 1, coarse.matches ? 1.25 : 1.5);
      for (const ctx of [floor, fx]) {
        if (!ctx) continue;
        ctx.canvas.width = Math.max(1, Math.round(width * ratio));
        ctx.canvas.height = Math.max(1, Math.round(height * ratio));
      }
      floorDirty = true;
      fxPaintTime = -Infinity;
      hadEffects = false;
      if (fight) draw();
    }
    new ResizeObserver(layout).observe(field);

    function worldX(x) { return x * width / 100; }
    function worldY(y) { return y * height / 100; }

    function shapePath(ctx, shape) {
      const x = shape.x, y = shape.y;
      const { angle, spread, r, type } = shape;
      ctx.beginPath();
      if (type === 'line') {
        const dx = Math.cos(angle), dy = Math.sin(angle), w = shape.width / 2;
        const endX = x + dx * shape.length, endY = y + dy * shape.length;
        ctx.moveTo(worldX(x - dy * w), worldY(y + dx * w));
        ctx.lineTo(worldX(endX - dy * w), worldY(endY + dx * w));
        ctx.lineTo(worldX(endX + dy * w), worldY(endY - dx * w));
        ctx.lineTo(worldX(x + dy * w), worldY(y - dx * w));
      } else if (type === 'cone') {
        ctx.moveTo(worldX(x), worldY(y));
        ctx.ellipse(worldX(x), worldY(y), worldX(r), worldY(r), 0, angle - spread / 2, angle + spread / 2);
      } else {
        ctx.ellipse(worldX(x), worldY(y), worldX(r), worldY(r), 0, 0, Math.PI * 2);
        if (type === 'ring') {
          ctx.moveTo(worldX(x + shape.inner), worldY(y));
          ctx.ellipse(worldX(x), worldY(y), worldX(shape.inner), worldY(shape.inner), 0, 0, Math.PI * 2, true);
        }
      }
      ctx.closePath();
    }

    function hatch(ctx, alpha, color) {
      ctx.save();
      ctx.clip('evenodd');
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = -height; x < width; x += 9) {
        ctx.moveTo(x, height);
        ctx.lineTo(x + height, 0);
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawShape(ctx, shape, { urgent = false, pool = false, released = false } = {}) {
      const sweeping = shape.type === 'cone';
      shapePath(ctx, shape);
      ctx.fillStyle = pool ? '#8f1f24b0' : released ? '#fff2ac80' : sweeping ? '#db531e70' : '#ae202975';
      ctx.fill('evenodd');
      if (!released) {
        hatch(ctx, pool ? .53 : sweeping ? .22 : .44, pool ? '#ff5147' : '#ffaf70');
        shapePath(ctx, shape);
      }
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#3e1412d9';
      ctx.stroke();
      ctx.lineWidth = released || urgent ? 2.5 : 1.5;
      ctx.strokeStyle = pool ? '#ff7954' : released ? '#fffad3' : urgent ? '#ffe387' : '#ff9753';
      ctx.stroke();
    }

    function drawSwordReach(f) {
      const timeSinceStrike = lastStrike ? f.time - lastStrike.time : Infinity;
      if (!f.swing && timeSinceStrike >= 220) return;
      const radius = ForgeDuelCombat.reach;
      const center = f.swing ? f.player : lastStrike.player;
      shapePath(fx, { type: 'circle', x: center.x, y: center.y, r: radius });
      fx.save();
      fx.globalAlpha = f.swing ? .78 : .78 * (1 - timeSinceStrike / 220);
      fx.setLineDash([4, 4]);
      fx.lineWidth = 3.5;
      fx.strokeStyle = '#092e36';
      fx.stroke();
      fx.lineWidth = 1.4;
      fx.strokeStyle = '#ccfcff';
      fx.stroke();
      fx.restore();
    }

    function canvasStart(ctx) {
      if (!ctx || !width || !height) return false;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);
      return true;
    }

    function drawFloor(f) {
      const attack = f.attack;
      const urgent = !!attack && attack.at - f.time <= 150;
      if (!floorDirty && paintedAttack === attack && paintedUrgent === urgent &&
        paintedZones.length === f.zones.length && f.zones.every((zone, index) => zone === paintedZones[index])) return;
      if (!canvasStart(floor)) return;
      floorDirty = false;
      paintedAttack = attack;
      paintedUrgent = urgent;
      paintedZones = f.zones.slice();
      for (const zone of paintedZones) drawShape(floor, zone.shape, { pool: true });
      if (attack) for (const shape of attack.shapes) drawShape(floor, shape, { urgent });
    }

    function drawShots(f) {
      for (const shot of f.shots) {
        const x = worldX(shot.x), y = worldY(shot.y), radius = Math.max(4, worldX(shot.r));
        const glow = radius * 2.5;
        fx.drawImage(ember, x - glow, y - glow, glow * 2, glow * 2);
      }
    }

    function drawArc(f) {
      if (!lastStrike) return;
      const dt = f.time - lastStrike.time;
      if (dt > 300) return;
      const p = lastStrike.player, b = lastStrike.boss;
      const x = worldX(p.x), y = worldY(p.y) - 11;
      const angle = Math.atan2(worldY(b.y - p.y), worldX(b.x - p.x));
      const length = Math.max(24, width * (lastStrike.heavy ? .22 : .16));
      fx.globalAlpha = 1 - dt / 300;
      fx.lineCap = 'round';
      fx.beginPath();
      fx.ellipse(x, y, length, length * .74, angle, -.86, 1.1);
      fx.lineWidth = lastStrike.heavy ? 5 : 3;
      fx.strokeStyle = f.magic?.color || '#ffb849';
      fx.stroke();
      fx.lineWidth = 1.6;
      fx.strokeStyle = '#fff5d1';
      fx.stroke();
      drawElement(f, angle, length, x, y, Math.min(1, dt / 300));
      if (lastStrike.hit && dt < 175) {
        const hitX = worldX(b.x), hitY = worldY(b.y) - 13;
        const extent = reduced.matches ? 12 : 8 + dt * .07;
        fx.beginPath();
        fx.moveTo(hitX - extent, hitY);
        fx.lineTo(hitX + extent, hitY);
        fx.moveTo(hitX, hitY - extent);
        fx.lineTo(hitX, hitY + extent);
        fx.moveTo(hitX - extent * .57, hitY - extent * .57);
        fx.lineTo(hitX + extent * .57, hitY + extent * .57);
        fx.moveTo(hitX + extent * .57, hitY - extent * .57);
        fx.lineTo(hitX - extent * .57, hitY + extent * .57);
        fx.stroke();
      }
      fx.globalAlpha = 1;
    }

    function drawElement(f, angle, length, x, y, life) {
      const magic = f.magic?.id;
      const lunar = f.count.lunar;
      fx.save();
      fx.translate(x, y);
      fx.rotate(angle);
      fx.strokeStyle = f.magic?.color || '#ffd279';
      fx.lineWidth = 2;
      if (magic === 'thunder') {
        fx.beginPath();
        fx.moveTo(length * .46, -length * .74);
        fx.lineTo(length * .78, -length * .25);
        fx.lineTo(length * .59, -length * .2);
        fx.lineTo(length * 1.23, length * .45);
        fx.lineTo(length * .89, length * .22);
        fx.lineTo(length * 1.03, length * .7);
        fx.stroke();
      } else if (magic === 'void' || magic === 'radiance') {
        for (const side of [-1, 1]) {
          fx.beginPath();
          fx.ellipse(length * .56, side * length * .27, length * .53, length * .21,
            side * .51, -.67, .96 * Math.PI);
          if (magic === 'void') { fx.fillStyle = '#1b0c28d9'; fx.fill(); }
          fx.stroke();
        }
      } else if (magic === 'fire' || magic === 'ice') {
        for (let i = 0; i < 5; i++) {
          const point = -.85 + i * .41;
          const radius = length * (1 + life * .33);
          const spark = radius * Math.cos(point), offset = radius * Math.sin(point);
          fx.beginPath();
          fx.moveTo(spark - 8, offset + 2);
          fx.quadraticCurveTo(spark + 2, offset - 7, spark + 6, offset - 11);
          fx.lineTo(spark + 4, offset + 3);
          fx.closePath();
          fx.fillStyle = magic === 'fire' ? '#ff9430' : '#a0e9ff';
          fx.fill(); fx.stroke();
        }
      }
      if (lunar) {
        fx.strokeStyle = '#e6b5ff';
        fx.shadowColor = '#bf65ff';
        fx.lineWidth = 1.6;
        for (let i = 0; i < lunar; i++) {
          fx.beginPath();
          fx.ellipse(length * .64, (i - (lunar - 1) / 2) * length * .38,
            length * .64, length * .32, -.32, .6, Math.PI * 1.73);
          fx.stroke();
        }
      }
      fx.restore();
    }

    function drawEffects(f) {
      const flashing = impact && f.time - impact.time < 170;
      const swinging = lastStrike && f.time - lastStrike.time < 300;
      const visible = !!(flashing || swinging || f.swing || f.shots.length || marks.length);
      if (!visible && !hadEffects) return;
      if (visible && hadEffects && coarse.matches && f.time - fxPaintTime < 31) return;
      if (!canvasStart(fx)) return;
      fxPaintTime = f.time;
      hadEffects = visible;
      if (!visible) return;
      if (flashing) {
        fx.globalAlpha = reduced.matches ? .6 : 1 - (f.time - impact.time) / 170;
        for (const shape of impact.shapes) drawShape(fx, shape, { released: true });
        fx.globalAlpha = 1;
      }
      drawSwordReach(f);
      drawShots(f);
      drawArc(f);
      for (const mark of marks) {
        const elapsed = f.time - mark.time;
        const x = Math.min(width - 24, Math.max(24, worldX(mark.x)));
        const y = Math.max(12, worldY(mark.y) - 25 - (reduced.matches ? 0 : elapsed * .045));
        const hurt = mark.type === 'hurt';
        const text = mark.text;
        fx.globalAlpha = Math.min(1, (850 - elapsed) / 240);
        fx.font = '900 ' + (hurt ? 17 : 21) + 'px Georgia, serif';
        fx.textAlign = 'center'; fx.textBaseline = 'middle';
        fx.lineWidth = 4;
        fx.strokeStyle = '#30150b'; fx.strokeText(text, x, y);
        fx.fillStyle = hurt ? '#ff8b90' : mark.type === 'evade' ? '#fff5a2' : '#ffdaa0';
        fx.fillText(text, x, y);
        fx.globalAlpha = 1;
      }
    }

    function actor(node, unit, front) {
      const x = Math.round(worldX(unit.x) * 100) / 100;
      const y = Math.round(worldY(unit.y) * 100) / 100;
      const scale = Math.round(700 + unit.y * 4.5) / 1000;
      const transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
      if (node.style.transform !== transform) node.style.transform = transform;
      const depth = front ? '3' : '2';
      if (node.style.zIndex !== depth) node.style.zIndex = depth;
    }

    function stats(f) {
      if (lastBossHp !== f.boss.hp) {
        lastBossHp = f.boss.hp;
        modal.style.setProperty('--boss-hp', f.boss.hp / f.boss.maxHp * 100 + '%');
        bossHpLabel.textContent = number.format(Math.ceil(f.boss.hp)) + ' / ' + number.format(f.boss.maxHp);
      }
      if (lastPlayerHp !== f.player.hp) {
        lastPlayerHp = f.player.hp;
        modal.style.setProperty('--player-hp', f.player.hp / f.player.maxHp * 100 + '%');
        playerHpLabel.textContent = Math.ceil(f.player.hp) + ' / ' + f.player.maxHp;
      }
      if (lastPhase !== f.phase) {
        lastPhase = f.phase;
        phaseLabel.textContent = f.phase + '페이즈 · ' + ForgeDuelCombat.names[f.phase - 1];
      }
      const remaining = Math.ceil(Math.max(0, ForgeDuelCombat.limit - f.time) / 1000);
      if (lastRemaining !== remaining) {
        lastRemaining = remaining;
        timerLabel.textContent = Math.floor(remaining / 60) + ':' + String(remaining % 60).padStart(2, '0');
      }
    }

    function setText(node, text) { if (node.textContent !== text) node.textContent = text; }
    function setData(node, key, value) {
      const text = String(value);
      if (node.dataset[key] !== text) node.dataset[key] = text;
    }
    function setStyle(node, key, value) {
      if (node.style.getPropertyValue(key) !== value) node.style.setProperty(key, value);
    }

    function act(kind) {
      if (!active) return;
      if (ForgeDuelCombat.act(fight, kind)) {
        rejected = null;
        lastAction = { kind, time: fight.time };
      } else {
        const message = fight.time < fight.stunUntil ? '피격에서 회복 중' : kind === 'dodge' ? '회피 준비 중' : '공격 준비 중';
        rejected = { message, until: fight.time + 650 };
      }
      draw();
    }

    function draw() {
      const f = fight, attack = f.attack;
      if (attackShapeMemo && (!attack || attack.at !== attackShapeMemo.at)) {
        if (f.time >= attackShapeMemo.at && f.time - attackShapeMemo.at < 170) {
          impact = { shapes: attackShapeMemo.shapes, time: f.time };
        }
        attackShapeMemo = null;
      }
      if (attack && attack.at !== attackShapeMemo?.at) attackShapeMemo = { shapes: attack.shapes, at: attack.at };
      const events = f.events;
      if (events.length && events.at(-1).id !== seenId) {
        for (const event of events) {
          if (event.id <= seenId) continue;
          if (event.label && feedbackEvents.has(event.type)) lastFeedback = event;
          if (Number.isFinite(event.x) && Number.isFinite(event.y) && (event.value || event.type === 'evade')) {
            const text = event.value ? (event.type === 'hurt' ? '−' : '') + number.format(Math.abs(event.value)) : '회피';
            marks.push({ ...event, text, time: f.time });
          }
          if (event.type === 'miss' || event.type === 'hit' || event.type === 'heavy') {
            lastStrike = {
              player: { ...f.player }, boss: { ...f.boss }, time: event.time,
              heavy: event.type === 'heavy', hit: event.type !== 'miss',
            };
          }
        }
        seenId = events.at(-1).id;
      }
      while (marks.length && (f.time - marks[0].time >= 850 || marks.length > 12)) marks.shift();
      const remaining = attack ? Math.max(0, attack.at - f.time) : 0;
      const recovery = !attack && f.time < f.recoverUntil;
      const windup = f.swing || (lastAction && f.time - lastAction.time < 210);
      const exposed = f.time < f.exposedUntil;
      const inReach = Math.hypot(f.boss.x - f.player.x, f.boss.y - f.player.y) <= ForgeDuelCombat.reach;
      setData(modal, 'phase', f.status === 'active' ? attack ? 'warning' : recovery ? 'recovery' : 'chase' : f.status);
      setData(modal, 'pattern', attack?.id || '');
      setData(modal, 'stage', f.phase);
      const dodgeNow = ForgeDuelCombat.dodgeCue(f);
      const dodgeReady = ForgeDuelCombat.ready(f, 'dodge');
      setData(modal, 'flash', dodgeNow);
      setData(modal, 'inReach', inReach);
      setData(modal, 'invulnerable', f.time < f.immunityUntil);
      setData(modal, 'action', windup ? lastAction?.kind || '' : '');
      setData(modal, 'chilled', f.time < f.chillUntil);
      stats(f);
      actor(guardian, f.boss, f.boss.y > f.player.y);
      actor(blade, f.player, f.player.y >= f.boss.y);
      setStyle(guardian, '--actor-face', f.player.x + 5 < f.boss.x ? '-1' : '1');
      setStyle(blade, '--actor-face', f.player.fx < -.16 ? '-1' : '1');
      const warning = attack ? attack.name : exposed ? '반격 기회' : recovery ? '파수꾼의 빈틈' : '파수꾼이 접근 중';
      setText(warningLabel, warning);
      setText(clockLabel, attack ? (remaining / 1000).toFixed(1) : recovery ? '✦' : '◇');
      const feedback = rejected?.until > f.time ? rejected.message :
        lastFeedback && f.time - lastFeedback.time < 625 ? lastFeedback.label : '';
      const cue = attack?.cue || (exposed ? '빈틈이에요 · 공격을 눌러 반격' :
        recovery ? '공격을 눌러 보스의 빈틈을 노리세요' : '공격을 누르면 내 검이 다가가 베어요.');
      setText(hintLabel, dodgeNow && dodgeReady ? '지금 회피!' : feedback || cue);
      for (const button of buttons) {
        setData(button, 'unavailable', !ForgeDuelCombat.ready(f, button.id.slice(5)));
      }
      setData(dodgeButton, 'ready', dodgeNow && dodgeReady);
      setData(attackButton, 'counter', exposed && ForgeDuelCombat.ready(f, 'attack'));
      setText(attackLabel, exposed ? '반격' : '공격');
      drawFloor(f);
      drawEffects(f);
    }

    function equip() {
      const state = getState(), app = Forge.appearanceAt(state.appearance, state.level);
      fight = ForgeDuelCombat.create(state);
      marks = [];
      seenId = lastAction = impact = lastStrike = attackShapeMemo = rejected = lastFeedback = null;
      fxPaintTime = -Infinity;
      floorDirty = true;
      $('duel-sword').src = asset('sword-' + app.level);
      const bound = fight.magic;
      $('duel-magic-art').hidden = !bound;
      if (bound) $('duel-magic-art').src = 'assets/magic-' + bound.id + '-plumes.webp';
      modal.dataset.magic = bound?.id || 'none';
      modal.dataset.guardianAura = String(Forge.duelRewards(state).aura);
      modal.style.setProperty('--magic-color', bound?.color || '#ffd475');
      const weapon = $('duel-weapon');
      weapon.textContent = '+' + fmt(state.level) + ' ' + app.name;
      weapon.title = '내 검 +' + state.level + ' ' + app.name + ' · 기본 공격력 ' + number.format(fight.power);
      weapon.style.setProperty('--equipped-art', 'url("' + $('duel-sword').src + '")');
      const affixes = $('duel-affixes');
      affixes.replaceChildren();
      const group = new Map();
      for (const effect of fight.effects) {
        if (!group.has(effect.id)) group.set(effect.id, { ...effect, count: 0 });
        group.get(effect.id).count++;
      }
      const names = [];
      for (const effect of group.values()) {
        const icon = document.createElement('span');
        icon.style.color = effectColors[effect.id];
        icon.textContent = effect.mark + (group.size === 1 ? ' ' + effect.name.split(' ')[0] : '') + (effect.count > 1 ? '×' + effect.count : '');
        names.push(effect.name + (effect.count > 1 ? ' ×' + effect.count : ''));
        affixes.append(icon);
      }
      if (bound) {
        const icon = document.createElement('span');
        icon.className = 'duel-bound';
        icon.style.color = bound.color;
        icon.textContent = bound.mark + ' ' + bound.name;
        names.push(bound.name + ' ' + bound.title);
        affixes.append(icon);
      }
      affixes.title = names.join(' · ');
      affixes.setAttribute('aria-label', affixes.title || '특수 효과 없음');
      draw();
    }

    function showOverlay(chapter, title, detail, label) {
      active = false;
      pauseButton.disabled = true;
      controls.inert = true;
      $('duel-reward-guide').hidden = true;
      $('duel-token-guide').hidden = true;
      $('duel-exchange-guide').hidden = true;
      $('duel-chapter').textContent = chapter;
      $('duel-result').textContent = title;
      $('duel-detail').textContent = detail;
      start.textContent = label;
      overlay.hidden = false;
      start.focus({ preventScroll: true });
    }

    function showRewardGuide(rewards, linkToExchange = false) {
      $('duel-reward-guide').hidden = false;
      $('duel-token-guide').hidden = false;
      $('duel-exchange-guide').hidden = !linkToExchange || !rewards.tokens;
      const rules = [
        ['duel-token-reward', rewards.bestMs !== null, rewards.bestMs === null ? '파수꾼의 증표 ×3' : '받음 · 증표 ' + rewards.tokens + '개 보유'],
        ['duel-title-reward', rewards.flawless, (rewards.flawless ? '획득 · ' : '칭호 · ') + '불길을 걷는 자'],
        ['duel-aura-reward', rewards.aura, (rewards.aura ? '획득 · ' : '검 이펙트 · ') + '황혼의 검륜'],
      ];
      for (const [id, earned, text] of rules) {
        $(id).parentElement.dataset.earned = String(earned);
        $(id).textContent = text;
      }
    }

    async function finish(f, runId) {
      active = false;
      const won = f.status === 'won', ms = Math.max(1, Math.round(f.time));
      showOverlay('잿불의 파수꾼', won ? '시련 돌파' : '파수꾼의 승리',
        won ? '돌파 ' + seconds(ms) + ' · 보상 확인 중…' : f.time >= ForgeDuelCombat.limit ? '제한 시간 안에 파수꾼을 쓰러뜨려야 해요.' :
          '붉은 예고에는 회피, 보스의 빈틈에는 공격을 눌러요.', '다시 도전');
      if (!won) return;
      const award = await onVictory({ ms, damageTaken: f.damageTaken }).catch(() => null);
      if (runId !== run || !modal.open) return;
      if (!award?.saved) {
        $('duel-detail').textContent = '돌파 ' + seconds(ms) + '\n이 기기에 기록과 보상을 저장하지 못했어요.';
        return;
      }
      $('duel-result').textContent = award.earnedTokens ? '첫 승리!' : award.newBest ? '새 기록!' : '시련 돌파';
      const earned = [];
      if (award.earnedTokens) earned.push('파수꾼의 증표 +' + award.earnedTokens);
      if (award.newTitle) earned.push('칭호 획득');
      if (award.newAura) earned.push('검 이펙트 획득');
      $('duel-detail').textContent = '돌파 ' + seconds(ms) + ' · 내 최고 ' + seconds(award.bestMs) +
        (earned.length ? '\n' + earned.join(' · ') : '');
      modal.dataset.guardianAura = String(award.aura);
      showRewardGuide(award, true);
    }

    function tick(now) {
      if (!active || !modal.open) return;
      if (document.hidden) { pause(); return; }
      const delta = Math.min(75, Math.max(0, now - prev));
      prev = now;
      ForgeDuelCombat.step(fight, delta);
      draw();
      if (fight.status !== 'active') { void finish(fight, run); return; }
      pendingFrame = requestAnimationFrame(tick);
    }

    function pause() {
      if (!modal.open || !active) return;
      paused = true;
      cancelAnimationFrame(pendingFrame);
      showOverlay('잿불의 파수꾼', '잠시 멈춤', '준비되면 전투를 이어가세요.', '계속하기');
    }

    $('open-duel').onclick = () => {
      const state = getState();
      if (!canEnter() || state.broken || state.sold) return;
      paused = false;
      equip();
      modal.showModal();
      onToggle(true);
      layout();
      const keysHelp = matchMedia('(pointer: fine)').matches ? '\nSpace 회피 · J 공격' : '';
      const rewards = Forge.duelRewards(state);
      const best = rewards.bestMs;
      showOverlay('권장 강화 +100', '잿불의 파수꾼',
        '붉은 예고에 회피, 빈틈이 보이면 공격! 내 검이 다가가 베어요.' + (best ? '\n내 최고 기록 ' + seconds(best) : '') + keysHelp, '전투 시작');
      showRewardGuide(rewards, true);
    };

    start.onclick = () => {
      if (document.hidden) return;
      if (!paused) {
        const state = getState();
        if (!canEnter() || state.broken || state.sold) { modal.close(); return; }
        equip();
        run++;
      }
      paused = false;
      active = true;
      overlay.hidden = true;
      controls.inert = false;
      pauseButton.disabled = false;
      prev = performance.now();
      arena.focus({ preventScroll: true });
      draw();
      pendingFrame = requestAnimationFrame(tick);
    };

    pauseButton.onclick = pause;
    $('duel-exchange-guide').onclick = () => {
      modal.addEventListener('close', onExchangeGuide, { once: true });
      modal.close();
    };
    $('duel-return').onclick = $('duel-exit').onclick = () => modal.close();
    modal.addEventListener('cancel', event => {
      if (active) { event.preventDefault(); pause(); }
    });
    modal.addEventListener('close', () => {
      cancelAnimationFrame(pendingFrame);
      active = paused = false;
      run++;
      onToggle(false);
      $('open-duel').focus({ preventScroll: true });
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    window.addEventListener('pagehide', pause);

    for (const button of buttons) {
      const kind = button.id.slice(5);
      let lastTouch = -Infinity;
      button.addEventListener('pointerdown', event => {
        if (event.pointerType !== 'touch') {
          lastTouch = -Infinity;
          return;
        }
        lastTouch = event.timeStamp;
        event.preventDefault();
        act(kind);
      });
      button.addEventListener('click', event => {
        // Some browsers still emit a click after a touch pointerdown.
        if (event.pointerType === 'touch' || event.sourceCapabilities?.firesTouchEvents ||
          (event.detail > 0 && !event.pointerType && event.timeStamp - lastTouch < 700)) return;
        act(kind);
      });
      button.addEventListener('pointerup', event => {
        if (event.pointerType !== 'mouse') arena.focus({ preventScroll: true });
      });
    }
    document.addEventListener('keydown', event => {
      if (!active || !modal.open || event.altKey || event.metaKey || event.ctrlKey) return;
      const action = actionKeys[event.code];
      if (!action || (event.code === 'Space' && event.target instanceof HTMLButtonElement)) return;
      event.preventDefault();
      if (!event.repeat) act(action);
    });
  }

  return { mount };
})();
