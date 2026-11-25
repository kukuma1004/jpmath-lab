'use strict';

const ForgeDuelCombat = (() => {
  const HP = 240000;
  const LIMIT = 165000;
  const bounds = [7, 93];
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const direction = (x, y) => {
    const d = Math.hypot(x, y);
    return d > 1 ? { x: x / d, y: y / d } : { x, y };
  };
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const reach = heavy => heavy ? 24 : 19;
  const toward = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
  const circle = (x, y, r) => ({ type: 'circle', x, y, r });
  const names = ['불씨', '용광로', '최후의 불꽃'];
  const phases = [
    ['sweep', 'crush', 'rush', 'magma'],
    ['volley', 'rush', 'ring', 'magma', 'sweep', 'double'],
    ['ring', 'meteor', 'double', 'volley', 'magma', 'rush', 'sweep'],
  ];

  function contains(shape, point) {
    const x = point.x - shape.x, y = point.y - shape.y;
    const d = Math.hypot(x, y);
    if (shape.type === 'circle') return d <= shape.r;
    if (shape.type === 'ring') return d >= shape.inner && d <= shape.r;
    if (shape.type === 'cone') {
      const a = Math.atan2(y, x) - shape.angle;
      return d <= shape.r && (d < 1 || Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= shape.spread / 2);
    }
    const along = Math.cos(shape.angle) * x + Math.sin(shape.angle) * y;
    const side = Math.cos(shape.angle) * y - Math.sin(shape.angle) * x;
    return along >= 0 && along <= shape.length && Math.abs(side) <= shape.width / 2;
  }

  function create(state) {
    const { effects, magic } = Forge.appraisal(state);
    const count = Object.fromEntries(Forge.enchantments.map(effect => [effect.id, effects.filter(e => e.id === effect.id).length]));
    const level = Number(state.level > 10000n ? 10000n : state.level);
    // Forge levels near +100 cut through the armor. Post-100 scaling is softer.
    const quality = level <= 100 ? (level / 100) ** 5.5 : 1 + Math.log1p((level - 100) / 45) * .48;
    const engraving = effects.reduce((sum, effect) => sum + Number(effect.tenths - 10n) * .004, 0);
    const power = Math.round((45 + 1660 * quality) * (1 + engraving) * (magic ? 1.09 + .025 * magic.tier : 1));
    return {
      time: 0, status: 'active', phase: 1,
      player: { x: 50, y: 78, hp: 100, maxHp: 100, stamina: 100, fx: 0, fy: -1 },
      boss: { x: 50, y: 35, hp: HP, maxHp: HP },
      effects, magic, count, power, attacks: 0, hits: 0, parries: 0, damageTaken: 0,
      attack: null, nextAt: 1250, recoverUntil: 0, nextPattern: 0,
      zones: [], shots: [], events: [], eventId: 0,
      lockUntil: 0, immunityUntil: 0, parryUntil: 0, exposedUntil: 0,
      parryReadyAt: 0, dodgeReadyAt: 0, staminaAt: 0, dash: null, swing: null,
      burn: null, chillUntil: 0, chillReadyAt: 0,
    };
  }

  function emit(f, type, target, label, value = 0) {
    f.events.push({ id: ++f.eventId, time: f.time, type, x: target.x, y: target.y, label, value });
    if (f.events.length > 32) f.events.shift();
  }

  function spend(f, cost) {
    if (f.player.stamina < cost) return false;
    f.player.stamina -= cost;
    f.staminaAt = f.time + 430;
    return true;
  }

  function ready(f, kind) {
    if (f.status !== 'active' || f.time < f.lockUntil) return false;
    if (kind === 'attack') return f.player.stamina >= 6;
    if (kind === 'heavy') return f.player.stamina >= 23;
    if (kind === 'dodge') return f.player.stamina >= 17 && f.time >= f.dodgeReadyAt;
    return kind === 'parry' && f.player.stamina >= 13 && f.time >= f.parryReadyAt;
  }

  function act(f, kind, input = { x: 0, y: 0 }) {
    if (!ready(f, kind)) return false;
    const p = f.player;
    if (kind === 'parry') {
      spend(f, 13);
      f.parryUntil = f.time + 215;
      f.lockUntil = f.time + 315;
      f.parryReadyAt = f.time + 800;
      emit(f, 'guard', p, '패링 자세');
    } else if (kind === 'dodge') {
      spend(f, 17);
      const move = direction(input.x, input.y);
      const active = Math.hypot(move.x, move.y) > .1;
      f.dash = { x: active ? move.x : p.fx, y: active ? move.y : p.fy, until: f.time + 205 };
      f.immunityUntil = f.time + 205;
      f.lockUntil = f.time + 250;
      f.dodgeReadyAt = f.time + 580;
      emit(f, 'dodge', p, '회피');
    } else {
      const heavy = kind === 'heavy';
      spend(f, heavy ? 23 : 6);
      f.attacks++;
      f.lockUntil = f.time + (heavy ? 805 : 455) - f.count.storm * 22;
      f.swing = { heavy, at: f.time + (heavy ? 345 : 120) };
      emit(f, heavy ? 'windup' : 'swing', p, heavy ? '강공격 준비' : '');
    }
    return true;
  }

  function nextPhase(f) {
    const health = f.boss.hp / f.boss.maxHp;
    const phase = health <= .30 ? 3 : health <= .65 ? 2 : 1;
    if (f.status !== 'active' || phase === f.phase) return;
    f.phase = phase;
    f.nextPattern = 0;
    emit(f, 'phase', f.boss, phase + '페이즈 · ' + names[phase - 1]);
  }

  function damageBoss(f, damage, label, type = 'hit') {
    const b = f.boss;
    const dealt = Math.min(b.hp, Math.max(1, Math.round(damage)));
    b.hp -= dealt;
    emit(f, type, b, label, dealt);
    if (b.hp === 0) f.status = 'won';
    else nextPhase(f);
  }

  function resolveSwing(f) {
    const { heavy } = f.swing;
    f.swing = null;
    const { player: p, boss: b, count, magic } = f;
    if (heavy) emit(f, 'swing', p, '');
    if (distance(p, b) > reach(heavy)) {
      emit(f, 'miss', p, '검이 닿지 않음');
      return;
    }
    f.hits++;
    const exposed = f.time < f.exposedUntil;
    const recovering = f.time < f.recoverUntil;
    let scale = heavy ? 2.65 + .15 * count.solar : 1;
    if (recovering) scale *= 1.45 + .08 * count.lunar;
    if (exposed) {
      scale *= 1.75;
      f.exposedUntil = 0;
    }
    const critical = count.astral > 0 && f.hits % 4 === 0;
    if (critical) scale *= 1 + .17 * count.astral;
    const element = magic?.id;
    if (element === 'void' && (heavy || exposed)) scale *= 1.22 + .035 * magic.tier;
    damageBoss(f, f.power * scale, exposed ? '패링 반격' : critical ? '별빛 치명타' : heavy ? '강공격' : recovering ? '빈틈 타격' : '', heavy ? 'heavy' : 'hit');
    if (f.status !== 'active') return;

    if (count.verdant) p.stamina = Math.min(100, p.stamina + count.verdant * 2);
    if (count.cinder || element === 'fire') {
      const burn = .055 * count.cinder + (element === 'fire' ? .18 + .025 * magic.tier : 0);
      f.burn = { at: f.burn?.at ?? f.time + 430, until: f.time + 1550, damage: f.power * burn };
    }
    if ((count.frost || element === 'ice') && f.time >= f.chillReadyAt) {
      f.chillUntil = f.time + 1600 + 210 * count.frost;
      f.chillReadyAt = f.time + 3200;
      emit(f, 'effect', b, element === 'ice' ? '빙결 · 감속' : '서리꽃 · 감속');
    }
    if (element === 'thunder' && f.hits % 3 === 0) {
      damageBoss(f, f.power * (.8 + .16 * magic.tier), '전격 연쇄', 'effect');
    }
  }

  function hurt(f, damage, label, parryable = false) {
    if (f.time < f.immunityUntil || f.status !== 'active') return false;
    const p = f.player;
    if (parryable && f.time < f.parryUntil) {
      f.parryUntil = 0;
      f.immunityUntil = f.time + 175;
      f.lockUntil = f.time;
      f.exposedUntil = f.time + 1800;
      f.parries++;
      p.stamina = Math.min(100, p.stamina + 18);
      if (f.magic?.id === 'radiance') {
        p.hp = Math.min(p.maxHp, p.hp + 6 + f.magic.tier);
        emit(f, 'effect', p, '성광 · 회복');
      }
      emit(f, 'parry', p, '패링 성공 · 공격으로 반격');
      return true;
    }
    const amount = Math.round(damage * (1 + (f.phase - 1) * .07));
    p.hp = Math.max(0, p.hp - amount);
    f.damageTaken += amount;
    f.immunityUntil = f.time + 340;
    f.lockUntil = f.time + 220;
    f.swing = null;
    f.dash = null;
    f.parryUntil = 0;
    emit(f, 'hurt', p, label, amount);
    if (!p.hp) f.status = 'lost';
    return false;
  }

  function telegraph(f, id, followup = false) {
    const p = f.player, b = f.boss;
    const angle = toward(b, p);
    const line = (width, length) => ({ type: 'line', x: b.x, y: b.y, angle, width, length });
    const shotCount = f.phase === 3 ? 7 : 5;
    const shotAngles = Array.from({ length: shotCount }, (_, i) => angle + (i - (shotCount - 1) / 2) * .235);
    const patterns = {
      sweep: ['화염 휩쓸기', '옆으로 빠지거나 섬광에 패링', 1050, 31, true, [{ type: 'cone', x: b.x, y: b.y, angle, spread: 2.15, r: 37 }]],
      crush: ['망치 내려찍기', '찍히기 전에 원 밖으로', 980, 40, true, [circle(p.x, p.y, 14)]],
      rush: ['용광로 돌진', '돌진 경로 옆으로 회피', 900, 36, true, [line(17, 76)]],
      magma: ['용암 균열', '붉은 자리를 벗어나고 장판을 피하기', 1130, 25, false, [
        circle(p.x, p.y, 12), circle(clamp(p.x - 18, 12, 88), clamp(p.y + 15, 12, 88), 10),
        circle(clamp(p.x + 18, 12, 88), clamp(p.y - 15, 12, 88), 10),
      ]],
      volley: ['불씨 산탄', '불씨가 날아갈 경로 사이로 이동', 940, 24, false,
        shotAngles.map(angle => ({ ...line(3, 105), angle }))],
      ring: ['용광로 파동', '고리 안쪽이나 바깥쪽으로', 1080, 39, false, [
        { type: 'ring', x: b.x, y: b.y, inner: 15, r: 44 },
      ]],
      double: ['연속 강타', followup ? '두 번째 강타 · 한 번 더 회피' : '두 번 내려쳐요 · 후속 공격 주의',
        followup ? 630 : 1020, 32, true, [circle(p.x, p.y, followup ? 15 : 13)]],
      meteor: ['불꽃 낙하', '붉은 원과 떨어진 자리를 피하기', 1030, 43, false, [
        circle(p.x, p.y, 15), circle(26, 35, 13), circle(73, 64, 13), circle(55, 31, 10),
      ]],
    };
    const [name, cue, windup, damage, parryable, shapes] = patterns[id];
    const delay = (followup ? windup : windup - (f.phase - 1) * 95) + (f.time < f.chillUntil ? 170 : 0);
    f.attack = { id, name, cue, at: f.time + delay, damage, parryable, shapes, angle, followup,
      shotAngles: id === 'volley' ? shotAngles : [] };
    emit(f, 'warning', b, name);
  }

  function impact(f) {
    const a = f.attack, b = f.boss, p = f.player;
    f.attack = null;
    emit(f, 'impact', a.shapes[0] || b, a.name);
    const parried = a.id !== 'volley' && a.shapes.some(shape => contains(shape, p)) && hurt(f, a.damage, a.name, a.parryable);
    if (f.status !== 'active') return;
    if (a.id === 'double' && !a.followup && !parried) {
      telegraph(f, 'double', true);
      return;
    }
    if (a.id === 'rush' && !parried) {
      const travel = clamp(distance(b, p), 16, 31);
      b.x = clamp(b.x + Math.cos(a.angle) * travel, ...bounds);
      b.y = clamp(b.y + Math.sin(a.angle) * travel, ...bounds);
    }
    if (a.id === 'magma' || a.id === 'meteor') {
      f.zones.push(...a.shapes.map(shape => ({ shape, until: f.time + (a.id === 'meteor' ? 2300 : 3200) })));
    }
    for (const angle of a.shotAngles) {
      f.shots.push({ x: b.x, y: b.y, r: 2.75, dx: Math.cos(angle), dy: Math.sin(angle), until: f.time + 3000, damage: a.damage });
    }
    f.recoverUntil = f.time + (parried ? 1420 : a.id === 'meteor' ? 1050 : 920 - f.phase * 95);
    f.nextAt = f.recoverUntil + 370 - f.phase * 55;
  }

  function move(f, dt, input) {
    const p = f.player, b = f.boss;
    const dashing = f.dash && f.time < f.dash.until;
    const vec = dashing ? f.dash : direction(input.x, input.y);
    if (Math.hypot(vec.x, vec.y) > .05) {
      if (!dashing) {
        p.fx = vec.x;
        p.fy = vec.y;
      }
      const speed = dashing ? 84 : f.time < f.lockUntil ? 8 : 31;
      p.x = clamp(p.x + vec.x * speed * dt / 1000, ...bounds);
      p.y = clamp(p.y + vec.y * speed * dt / 1000, ...bounds);
    }
    if (!f.attack && f.time >= f.recoverUntil && distance(b, p) > 16) {
      const angle = toward(b, p);
      const speed = (13 + f.phase * 2) * (f.time < f.chillUntil ? .53 : 1);
      b.x = clamp(b.x + Math.cos(angle) * speed * dt / 1000, ...bounds);
      b.y = clamp(b.y + Math.sin(angle) * speed * dt / 1000, ...bounds);
    }
    if (distance(b, p) < 8) {
      const a = toward(b, p);
      p.x = clamp(b.x + 8 * Math.cos(a), ...bounds);
      p.y = clamp(b.y + 8 * Math.sin(a), ...bounds);
    }
  }

  function step(f, ms, input = { x: 0, y: 0 }) {
    if (f.status !== 'active' || !Number.isFinite(ms) || ms <= 0) return;
    // Substeps keep movement and projectile impacts stable across render rates.
    for (let remaining = Math.min(ms, 100); remaining > 0 && f.status === 'active';) {
      const dt = Math.min(remaining, 16);
      remaining -= dt;
      f.time += dt;
      if (f.time >= LIMIT) {
        f.status = 'lost';
        emit(f, 'timeout', f.player, '시간 초과 · 용광로 붕괴');
        break;
      }
      move(f, dt, input);
      if (f.time > f.staminaAt) f.player.stamina = Math.min(100, f.player.stamina + dt * .031);
      if (f.attack && f.time >= f.attack.at) impact(f);
      if (f.status !== 'active') break;
      if (f.swing && f.time >= f.swing.at) resolveSwing(f);
      if (f.status !== 'active') break;
      if (f.burn && f.time >= f.burn.at) {
        if (f.time > f.burn.until) f.burn = null;
        else {
          damageBoss(f, f.burn.damage, f.magic?.id === 'fire' ? '화염 연소' : '잿불 연소', 'burn');
          f.burn.at += 430;
        }
      }
      if (f.status !== 'active') break;
      f.zones = f.zones.filter(zone => zone.until > f.time);
      if (f.zones.some(zone => contains(zone.shape, f.player))) hurt(f, 13, '용암 장판');
      f.shots = f.shots.filter(shot => {
        shot.x += shot.dx * dt * .042;
        shot.y += shot.dy * dt * .042;
        if (shot.until <= f.time || shot.x < 0 || shot.x > 100 || shot.y < 0 || shot.y > 100) return false;
        if (distance(shot, f.player) > shot.r + 1.4) return true;
        hurt(f, shot.damage, '불씨 산탄');
        return false;
      });
      if (f.status === 'active' && !f.attack && f.time >= f.nextAt) {
        const order = phases[f.phase - 1];
        telegraph(f, order[f.nextPattern++ % order.length]);
      }
    }
  }

  return { create, step, act, ready, reach, contains, names, limit: LIMIT };
})();
