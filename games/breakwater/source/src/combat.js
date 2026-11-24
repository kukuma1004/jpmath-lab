const HALF_ROAD = 3.52
const MAX_SQUAD = 36
const MARCH_SPEED = 4.3
const ARROW_SPEED = 34
export const BOSS_TIME = 38
export const LANES = { recruit: -2.13, upgrade: 2.13 }
export const WEAPONS = ['석궁', '삼연발', '관통 화살', '폭발 화살']

const units = {
  grunt: { hp: 2, speed: 5.35, radius: 0.29, loss: 1 },
  runner: { hp: 2, speed: 6.6, radius: 0.24, loss: 1 },
  armor: { hp: 8, speed: 4.95, radius: 0.39, loss: 2 },
  boss: { hp: 710, speed: 5.45, radius: 1.46, loss: 7 },
}

const schedule = [
  { at: 0, z: -15, kind: 'recruit', amount: 6 },
  { at: 1.35, z: -24, kind: 'upgrade', hp: 12 },
  { at: 5.6, z: -23, kind: 'recruit', amount: 2, multiply: true },
  { at: 9.85, z: -26, kind: 'upgrade', hp: 27 },
  { at: 14.1, z: -23, kind: 'recruit', amount: 9 },
  { at: 18.25, z: -27, kind: 'upgrade', hp: 44 },
  { at: 23.1, z: -27, kind: 'recruit', amount: 2, multiply: true },
  { at: 30.5, z: -19, kind: 'recruit', amount: 8 },
]

const flankWaves = [
  { time: 15.8, side: -1 },
  { time: 22.4, side: 1 },
  { time: 30.7, side: -1 },
  { time: 34.5, side: 1 },
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

// A broad wedge stays inside the stone rails, even when following the commander to an edge.
export function formation(count, x) {
  if (count < 1) return []
  const ranks = [{ x, z: 0 }]
  const columns = [2, 3, 4, 5, 5, 5, 5, 5, 1]
  for (let row = 0; row < columns.length && ranks.length < count; row += 1) {
    const width = Math.min(columns[row], count - ranks.length)
    const interval = 0.59
    const span = (width - 1) * interval / 2
    const center = clamp(x, -3.83 + span, 3.83 - span)
    for (let i = 0; i < width; i += 1) {
      ranks.push({ x: center + i * interval - span, z: (row + 1) * 0.48 })
    }
  }
  return ranks
}

function spawnEnemy(run, kind, lane, z, phase) {
  const enemy = { ...units[kind], kind, lane, x: lane, z, phase, id: ++run.serial, flash: 0 }
  enemy.maxHp = enemy.hp
  run.enemies.push(enemy)
  return enemy
}

function marchRank(run, index, z, wave) {
  const size = wave === 1 ? 6 : wave === 2 ? 8 : 9
  const span = wave === 1 ? 2.54 : wave === 2 ? 5.2 : 6.36
  const center = [0.24, -0.35, 0.46, -0.54, 0.05, 0.7][index % 6]
  for (let i = 0; i < size; i += 1) {
    const phase = index * 2.89 + i * 1.73
    const lane = clamp(center + span * (i / (size - 1) - 0.5) + Math.sin(phase) * 0.13, -3.75, 3.75)
    const kind = wave >= 2 && i === 3 && index % 3 === 0 ? 'armor'
      : wave >= 2 && (i + index) % 8 === 4 ? 'runner' : 'grunt'
    spawnEnemy(run, kind, lane, z - (i % 3) * 0.46, phase)
  }
}

function sendFlank(run, wave, emit) {
  const lanes = [2.42, 3.14, 3.64, 2.8]
  for (let i = 0; i < lanes.length; i += 1) {
    const armored = i % 2 === 0
    spawnEnemy(run, armored ? 'armor' : 'runner', wave.side * lanes[i],
      armored ? -20 - i * 0.95 : -24 - i * 0.95, wave.time + i)
  }
  emit('flank', wave)
}

export function newCombat() {
  const run = {
    x: 0, time: 0, distance: 0, count: 1, weapon: 0, kills: 0, recruited: 0,
    wave: 1, state: 'playing', traveled: 0, volley: 0.07, volleyIndex: 0,
    protection: 0, nextRank: 0.65, rank: 0, nextPickup: 0, nextFlank: 0, serial: 0,
    enemies: [], shots: [], pickups: [], boss: null, alarm: null,
  }
  for (let i = 0; i < 8; i += 1) marchRank(run, run.rank++, -17 - i * 4.55, i < 5 ? 1 : 2)
  return run
}

function takeLoss(run, incoming, x, emit, boss = false) {
  if (run.protection > 0) return
  const loss = Math.min(run.count, incoming)
  run.count -= loss
  run.protection = 0.31
  emit('hurt', { x, z: 0, loss, boss })
  if (!run.count) run.state = 'lost'
}

function approachPickups(run, dt, emit) {
  while (schedule[run.nextPickup]?.at <= run.time) {
    const entry = schedule[run.nextPickup++]
    run.pickups.push({ ...entry, id: ++run.serial, x: LANES[entry.kind], flash: 0 })
  }
  for (const pickup of run.pickups) {
    pickup.z += dt * MARCH_SPEED
    pickup.flash = Math.max(0, pickup.flash - dt)
    if (pickup.z < 0) continue
    pickup.used = true
    if (pickup.kind !== 'recruit' || Math.abs(run.x - pickup.x) > 1.65) continue
    const next = pickup.multiply ? run.count * pickup.amount : run.count + pickup.amount
    const increase = Math.min(MAX_SQUAD, next) - run.count
    run.count += increase
    run.recruited += increase
    emit('recruit', { x: pickup.x, z: pickup.z, people: increase, multiply: pickup.multiply })
  }
}

function shoot(run, emit) {
  const members = formation(run.count, run.x)
  const leader = members[0]
  const tier = run.weapon
  const angles = tier === 0 ? [0] : tier === 1 ? [-0.09, 0, 0.09] : [-0.12, 0, 0.12]
  const fire = (member, dx, side) => {
    const damage = side ? 1 + Math.floor(run.count / 15) : tier >= 2 ? 2 : 1
    run.shots.push({
      id: ++run.serial, x: member.x, z: member.z - 0.48, startZ: member.z - 0.48,
      dx, damage, level: tier, pierce: tier === 2 && !side ? 2 : 0,
      blast: tier === 3 && !side && dx === 0, lastHit: 0,
    })
  }
  for (const angle of angles) fire(leader, angle, false)
  const stride = Math.max(2, Math.ceil(members.length / 10))
  for (let i = 1 + run.volleyIndex % stride; i < members.length; i += stride) fire(members[i], 0, true)
  emit('shoot', { ...leader, level: tier, wide: run.count >= 6 })
  run.volleyIndex += 1
}

function damageEnemy(run, enemy, damage, emit) {
  enemy.hp -= damage
  enemy.flash = 0.11
  if (enemy.hp > 0) {
    if (enemy.kind !== 'boss') emit('impact', enemy)
    return
  }
  emit('destroy', enemy)
  if (enemy.kind === 'boss') run.state = 'won'
  else run.kills += 1
}

function advanceShots(run, dt, emit) {
  for (const shot of run.shots) {
    const front = shot.z - ARROW_SPEED * dt
    let hitAt = front - 0.001
    let target
    for (const enemy of run.enemies) {
      if (enemy.hp <= 0 || enemy.passed || shot.lastHit === enemy.id || enemy.z > shot.z + 0.02 || enemy.z < hitAt) continue
      const x = shot.x + (shot.z - enemy.z) * shot.dx
      if (Math.abs(enemy.x - x) <= enemy.radius + 0.075) {
        hitAt = enemy.z
        target = enemy
      }
    }
    let rack
    for (const pickup of run.pickups) {
      if (pickup.used || pickup.kind !== 'upgrade' || pickup.z > shot.z + 0.02 || pickup.z < hitAt) continue
      const x = shot.x + (shot.z - pickup.z) * shot.dx
      if (Math.abs(pickup.x - x) < 1.11) {
        hitAt = pickup.z
        rack = pickup
      }
    }
    if (rack) {
      rack.hp -= shot.damage
      rack.flash = 0.14
      shot.dead = true
      emit('target', rack)
      if (rack.hp <= 0) {
        rack.used = true
        run.weapon = Math.min(WEAPONS.length - 1, run.weapon + 1)
        emit('upgrade', { x: rack.x, z: rack.z, level: run.weapon })
      }
    } else if (target) {
      damageEnemy(run, target, shot.damage, emit)
      if (shot.blast) {
        emit('blast', target)
        for (const nearby of run.enemies) {
          if (nearby !== target && nearby.kind !== 'boss' && nearby.hp > 0 &&
              Math.hypot(nearby.x - target.x, nearby.z - target.z) < 1.36) {
            damageEnemy(run, nearby, 2, emit)
          }
        }
      }
      shot.lastHit = target.id
      if (shot.pierce > 0) shot.pierce -= 1
      else shot.dead = true
    }
    shot.x += ARROW_SPEED * dt * shot.dx
    shot.z = front
  }
  run.shots = run.shots.filter(shot => !shot.dead && shot.z > -52 && Math.abs(shot.x) < 5.3)
}

function advanceBoss(run, enemy, dt, emit) {
  enemy.z = Math.min(-10.7, enemy.z + dt * enemy.speed)
  enemy.x = Math.sin((run.time - BOSS_TIME) * 0.81) * 1.38
  if (enemy.z < -14) return
  const angry = enemy.hp < enemy.maxHp / 2
  if (!run.alarm && run.time >= enemy.nextAttack) {
    run.alarm = { x: clamp(run.x, -2.9, 2.9), width: angry ? 3.3 : 2.4, ttl: angry ? 1.0 : 1.12 }
    emit('alarm', run.alarm)
  }
  if (!run.alarm) return
  run.alarm.ttl -= dt
  if (run.alarm.ttl > 0) return
  const strike = run.alarm
  run.alarm = null
  enemy.nextAttack = run.time + (angry ? 1.0 : 1.55)
  emit('strike', strike)
  if (Math.abs(run.x - strike.x) < strike.width / 2) takeLoss(run, enemy.loss, strike.x, emit, true)
}

export function tickCombat(run, dt, target, direction, emit) {
  if (run.state !== 'playing') return
  const next = direction ? run.x + direction * dt * 10.1 : target
  const previous = run.x
  run.x += (clamp(next, -HALF_ROAD, HALF_ROAD) - run.x) * (1 - Math.exp(-dt * (direction ? 96 : 22)))
  run.traveled += Math.abs(run.x - previous)
  run.time += dt
  run.distance += dt * (run.boss ? 2.05 : MARCH_SPEED)
  run.wave = run.time < 12 ? 1 : run.time < 25 ? 2 : 3
  run.protection = Math.max(0, run.protection - dt)
  approachPickups(run, dt, emit)

  if (run.time >= run.nextRank && run.time < BOSS_TIME - 2) {
    marchRank(run, run.rank++, -55, run.wave)
    run.nextRank += run.wave === 1 ? 0.86 : run.wave === 2 ? 0.8 : 0.70
  }
  const flank = flankWaves[run.nextFlank]
  if (flank && run.time >= flank.time) {
    sendFlank(run, flank, emit)
    run.nextFlank += 1
  }
  if (!run.boss && run.time >= BOSS_TIME) {
    run.boss = spawnEnemy(run, 'boss', 0, -29, 0)
    run.boss.nextAttack = run.time + 3.55
    emit('boss', run.boss)
  }

  for (const enemy of run.enemies) {
    enemy.flash = Math.max(0, enemy.flash - dt)
    if (enemy.kind === 'boss') {
      advanceBoss(run, enemy, dt, emit)
      continue
    }
    enemy.z += enemy.speed * dt
    enemy.x = enemy.lane + Math.sin(run.time * 2.1 + enemy.phase) * 0.12
    if (enemy.z < 0.16) continue
    enemy.passed = true
    const width = Math.min(1.48, 0.2 + Math.sqrt(run.count) * 0.21)
    if (Math.abs(enemy.x - run.x) < enemy.radius + width) takeLoss(run, enemy.loss, enemy.x, emit)
  }
  run.enemies = run.enemies.filter(enemy => !enemy.passed && enemy.hp > 0)
  if (run.state !== 'playing') return
  run.volley -= dt
  if (run.volley <= 0) {
    shoot(run, emit)
    run.volley += run.weapon >= 1 ? 0.22 : 0.24
  }
  advanceShots(run, dt, emit)
  run.enemies = run.enemies.filter(enemy => enemy.hp > 0)
  run.pickups = run.pickups.filter(pickup => !pickup.used)
}

export function makePreview() {
  const run = newCombat()
  run.count = 9
  run.x = -1.1
  const recruits = schedule[0]
  const rack = schedule[1]
  run.pickups = [
    { ...recruits, id: ++run.serial, x: LANES.recruit, z: -10.8, flash: 0 },
    { ...rack, id: ++run.serial, x: LANES.upgrade, z: -16, flash: 0 },
  ]
  return run
}
