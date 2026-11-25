'use strict';

const ForgeDuelCombat = (() => {
  const HP = 240000;
  const LIMIT = 165000;
  const DODGE_WINDOW = 430;
  const DODGE_TIME = 200;
  const bounds = [7, 93];
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const reach = 19;
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
      player: { x: 50, y: 78, hp: 100, maxHp: 100, fx: 0 },
      boss: { x: 50, y: 35, hp: HP, maxHp: HP },
      effects, magic, count, power, attacks: 0, hits: 0, evades: 0, damageTaken: 0,
      attack: null, nextAt: 1250, recoverUntil: 0, nextPattern: 0,
      zones: [], shots: [], events: [], eventId: 0,
      lockUntil: 0, immunityUntil: 0, exposedUntil: 0, stunUntil: 0,
      dodgeReadyAt: 0, dash: null, swing: null, evasion: null,
      burn: null, chillUntil: 0, chillReadyAt: 0,
    };
  }

  function emit(f, type, target, label, value = 0) {
    f.events.push({ id: ++f.eventId, time: f.time, type, x: target.x, y: target.y, label, value });
    if (f.events.length > 32) f.events.shift();
  }

  function ready(f, kind) {
    if (f.status !== 'active' || f.time < f.stunUntil) return false;
    if (kind === 'attack') return f.time >= f.lockUntil;
    return kind === 'dodge' && f.time >= f.dodgeReadyAt;
  }

  function dodgeCue(f) {
    return !!f.attack && f.attack.at - f.time <= DODGE_WINDOW &&
      f.attack.shapes.some(shape => contains(shape, f.player));
  }

  function dodgeDestination(f) {
    const p = f.player;
    const danger = [...(f.attack?.shapes ?? []), ...f.zones.map(zone => zone.shape)];
    const startingAngle = toward(f.boss, p);
    let best = null;
    let bestScore = Infinity;
    for (let index = 0; index < 16; index++) {
      const angle = startingAngle + index * Math.PI / 8;
      const point = { x: clamp(p.x + Math.cos(angle) * 25, ...bounds), y: clamp(p.y + Math.sin(angle) * 25, ...bounds) };
      const covered = danger.filter(shape => contains(shape, point)).length;
      const shots = f.shots.filter(shot => distance(shot, point) < 7).length;
      const toBoss = distance(f.boss, point);
      const score = 100 * covered + 80 * shots + Math.abs(toBoss - 30) + (distance(p, point) < 8 ? 35 : 0);
      if (score < bestScore) {
        best = point;
        bestScore = score;
      }
    }
    return best;
  }

  function act(f, kind) {
    if (!ready(f, kind)) return false;
    const p = f.player;
    if (kind === 'dodge') {
      f.evasion = dodgeCue(f) ? f.attack : null;
      f.swing = null;
      f.dash = { fromX: p.x, fromY: p.y, ...dodgeDestination(f), from: f.time, until: f.time + DODGE_TIME };
      f.immunityUntil = Math.max(f.immunityUntil, f.time + DODGE_TIME);
      f.lockUntil = f.dash.until;
      f.dodgeReadyAt = f.time + 550;
      emit(f, 'dodge', p, '회피 중');
    } else {
      f.attacks++;
      const travel = Math.max(0, distance(p, f.boss) - 14);
      const at = f.time + 155 + travel * 8.5;
      f.swing = { at };
      f.lockUntil = at + 270 - f.count.storm * 22;
      emit(f, 'swing', p, '');
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
    f.swing = null;
    const { player: p, boss: b, count, magic } = f;
    if (distance(p, b) > reach) {
      emit(f, 'miss', p, '검이 닿지 않음');
      return;
    }
    f.hits++;
    const exposed = f.time < f.exposedUntil;
    const recovering = f.time < f.recoverUntil;
    let scale = 1.9 + .1 * count.solar;
    if (recovering) scale *= 1.45 + .08 * count.lunar;
    if (exposed) {
      scale *= 1.75;
      f.exposedUntil = 0;
    }
    const critical = count.astral > 0 && f.hits % 4 === 0;
    if (critical) scale *= 1 + .17 * count.astral;
    const element = magic?.id;
    if (element === 'void' && (recovering || exposed)) scale *= 1.22 + .035 * magic.tier;
    damageBoss(f, f.power * scale, exposed ? '회피 반격' : critical ? '별빛 치명타' : recovering ? '빈틈 타격' : '', exposed ? 'heavy' : 'hit');
    if (f.status !== 'active') return;

    if (count.verdant) f.dodgeReadyAt = Math.max(f.time, f.dodgeReadyAt - count.verdant * 32);
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

  function hurt(f, damage, label) {
    if (f.time < f.immunityUntil || f.status !== 'active') return false;
    const p = f.player;
    const amount = Math.round(damage * (1 + (f.phase - 1) * .07));
    p.hp = Math.max(0, p.hp - amount);
    f.damageTaken += amount;
    f.immunityUntil = f.time + 340;
    f.stunUntil = f.lockUntil = f.time + 220;
    f.swing = null;
    f.dash = null;
    f.evasion = null;
    emit(f, 'hurt', p, label, amount);
    if (!p.hp) f.status = 'lost';
    return true;
  }

  function rewardEvade(f) {
    f.evades++;
    f.exposedUntil = f.time + 1800;
    if (f.magic?.id === 'radiance') {
      f.player.hp = Math.min(f.player.maxHp, f.player.hp + 6 + f.magic.tier);
      emit(f, 'effect', f.player, '성광 · 회복');
    }
    emit(f, 'evade', f.player, '회피 성공 · 반격 기회');
  }

  function telegraph(f, id, followup = false) {
    const p = f.player, b = f.boss;
    const angle = toward(b, p);
    const line = (width, length) => ({ type: 'line', x: b.x, y: b.y, angle, width, length });
    const shotCount = f.phase === 3 ? 7 : 5;
    const shotAngles = Array.from({ length: shotCount }, (_, i) => angle + (i - (shotCount - 1) / 2) * .235);
    const patterns = {
      sweep: ['화염 휩쓸기', '붉은 범위가 빛날 때 회피', 1050, 31, [{ type: 'cone', x: b.x, y: b.y, angle, spread: 2.15, r: 37 }]],
      crush: ['망치 내려찍기', '찍히기 전에 원 밖으로', 980, 40, [circle(p.x, p.y, 14)]],
      rush: ['용광로 돌진', '돌진 경로 옆으로 회피', 900, 36, [line(17, 76)]],
      magma: ['용암 균열', '붉은 자리를 벗어나고 장판을 피하기', 1130, 25, [
        circle(p.x, p.y, 12), circle(clamp(p.x - 18, 12, 88), clamp(p.y + 15, 12, 88), 10),
        circle(clamp(p.x + 18, 12, 88), clamp(p.y - 15, 12, 88), 10),
      ]],
      volley: ['불씨 산탄', '불씨가 날아갈 경로 사이로 이동', 940, 24,
        shotAngles.map(angle => ({ ...line(3, 105), angle }))],
      ring: ['용광로 파동', '고리 안쪽이나 바깥쪽으로', 1080, 39, [
        { type: 'ring', x: b.x, y: b.y, inner: 15, r: 44 },
      ]],
      double: ['연속 강타', followup ? '두 번째 강타 · 한 번 더 회피' : '두 번 내려쳐요 · 후속 공격 주의',
        followup ? 630 : 1020, 32, [circle(p.x, p.y, followup ? 15 : 13)]],
      meteor: ['불꽃 낙하', '붉은 원과 떨어진 자리를 피하기', 1030, 43, [
        circle(p.x, p.y, 15), circle(26, 35, 13), circle(73, 64, 13), circle(55, 31, 10),
      ]],
    };
    const [name, cue, windup, damage, shapes] = patterns[id];
    const delay = (followup ? windup : windup - (f.phase - 1) * 95) + (f.time < f.chillUntil ? 170 : 0);
    f.attack = { id, name, cue, at: f.time + delay, damage, shapes, angle, followup,
      shotAngles: id === 'volley' ? shotAngles : [] };
    emit(f, 'warning', b, name);
  }

  function impact(f) {
    const a = f.attack, b = f.boss, p = f.player;
    f.attack = null;
    emit(f, 'impact', a.shapes[0] || b, a.name);
    const hit = a.id !== 'volley' && a.shapes.some(shape => contains(shape, p)) && hurt(f, a.damage, a.name);
    if (!hit && f.evasion === a) rewardEvade(f);
    f.evasion = null;
    if (f.status !== 'active') return;
    if (a.id === 'double' && !a.followup) {
      telegraph(f, 'double', true);
      return;
    }
    if (a.id === 'rush') {
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
    f.recoverUntil = f.time + (a.id === 'meteor' ? 1050 : 1030 - f.phase * 95);
    f.nextAt = f.recoverUntil + 370 - f.phase * 55;
  }

  function move(f, dt) {
    const p = f.player, b = f.boss;
    if (f.dash) {
      const d = f.dash;
      const ratio = clamp((f.time - d.from) / DODGE_TIME, 0, 1);
      p.x = d.fromX + (d.x - d.fromX) * ratio;
      p.y = d.fromY + (d.y - d.fromY) * ratio;
      if (ratio === 1) f.dash = null;
    } else if (f.swing) {
      const distanceToBoss = distance(p, b);
      if (distanceToBoss > 14) {
        const fraction = Math.min(distanceToBoss - 14, dt * .13) / distanceToBoss;
        p.x += (b.x - p.x) * fraction;
        p.y += (b.y - p.y) * fraction;
      }
    }
    p.fx = Math.sign(b.x - p.x);
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

  function step(f, ms) {
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
      move(f, dt);
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

  return { create, step, act, ready, reach, dodgeCue, contains, names, limit: LIMIT };
})();
