const HALF_ROAD = 3.45
const MAX_SQUAD = 13
const GATE_Z = -25
const BOSS_TIME = 37
const PLAYER_Z = 0

export const LANES = { recruit: -2.13, upgrade: 2.13 }
export const WEAPONS = ['단발', '부채꼴 3발', '관통 5발']

const units = {
  grunt: { hp: 2, speed: 4.85, radius: 0.32, loss: 1 },
  runner: { hp: 1, speed: 7.25, radius: 0.29, loss: 1 },
  armor: { hp: 6, speed: 4.4, radius: 0.48, loss: 2 },
  boss: { hp: 172, speed: 5.9, radius: 1.6, loss: 2 },
}

// Rows enter at a known time. Open gaps can be traversed without firing through them.
const arrivals = [
  [1.2, 'grunt', [-3.35, -2.55, -1.72, -0.8, 0.05]],
  [4.5, 'grunt', [-2.95, -1.98, -1.01, 0.06, 1.11]],
  [6.6, 'grunt', [-3.32, -2.33, -1.3, -0.15, 1.15, 2.4, 3.32]],
  [8.5, 'runner', [-2.9, -1.1, 0.4, 2.9]],
  [10.3, 'grunt', [-3.3, -2.18, -1.06, 0, 1.06, 2.18, 3.3]],
  [11.1, 'armor', [-2.9, 0.05]],
  [14.5, 'grunt', [-3.35, -2.2, -1.04, 0.1, 1.21]],
  [17.7, 'runner', [-3.35, -1.92, -0.55, 0.95, 2.6]],
  [19.4, 'grunt', [-3.3, -2.48, -1.62, -0.68, 0.45, 1.4, 2.45, 3.42]],
  [21, 'armor', [-2.8, -0.9, 1.0, 2.92]],
  [23, 'grunt', [-3.2, -2.19, -1.38, -0.36, 0.65, 1.74, 2.95]],
  [25.4, 'runner', [-3.32, -1.6, 0.45, 2.06, 3.35]],
  [28.2, 'grunt', [-3.2, -2.3, -1.34, -0.45, 0.49, 1.4, 2.34, 3.3]],
  [30.2, 'runner', [-3.31, -2.03, -0.75, 0.6]],
  [31.2, 'armor', [-2.67, -0.67, 1.4]],
  [32.3, 'grunt', [-3.28, -2.4, -1.5, -0.52, 0.51, 1.48, 2.42, 3.33]],
  [34.5, 'runner', [-3.05, -1.7, -0.55, 0.8, 1.89, 3.0]],
]
// Each approaching three-unit file leaves a broad opening to weave through.
const files = [
  [-3.12, -1.85, -0.53], [0.35, 1.64, 3.05], [-2.81, -1.36, 2.74],
  [-3.19, 0.64, 2.17], [-2.46, -0.94, 0.52], [-0.16, 1.21, 2.88],
]
function sendFile(run, index, z) {
  const lanes = files[index % files.length]
  lanes.forEach((lane, column) => {
    const kind = column === 1 && index % 5 === 4 ? 'armor' : 'grunt'
    spawnEnemy(run, kind, lane, z - (column + index) % 3 * 1.04, index * 1.7 + column)
  })
}

const choices = [
  { at: 0.08, people: 3, hp: 11 },
  { at: 12.15, people: 4, hp: 19 },
  { at: 26.2, people: 5, hp: 24 },
]

const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

export function formation(count, x) {
  const members = [{ x, z: PLAYER_Z }]
  const offsets = [-0.52, 0.52, -0.91, 0, 0.91, -1.18, -0.4, 0.4, 1.18, -0.81, 0, 0.81]
  for (let index = 0; index < count - 1; index += 1) {
    const row = index < 2 ? 1 : index < 5 ? 2 : index < 9 ? 3 : 4
    const center = clamp(x, -HALF_ROAD + row * 0.26, HALF_ROAD - row * 0.26)
    members.push({ x: clamp(center + offsets[index], -3.78, 3.78), z: row * 0.5 })
  }
  return members
}

export function newCombat() {
  const run = {
    x: 0, time: 0, distance: 0, count: 1, weapon: 0, power: 0,
    kills: 0, recruited: 0, wave: 1, state: 'playing', traveled: 0,
    volley: 0.07, volleyIndex: 0, protection: 0, arrival: 0, choice: 0, serial: 0,
    enemies: [], shots: [], pair: null, boss: null, alarm: null, file: 0, nextFile: 0.7,
  }
  for (; run.file < 6; run.file++) sendFile(run, run.file, -35 - run.file * 5)
  return run
}

export function moveCombat(run, target, direction, dt) {
  const next = direction ? run.x + direction * dt * 10.1 : target
  const previous = run.x
  run.x += (clamp(next, -HALF_ROAD, HALF_ROAD) - run.x) * (1 - Math.exp(-dt * (direction ? 96 : 22)))
  run.traveled += Math.abs(run.x - previous)
}

function spawnEnemy(run, kind, x, z, phase = 0) {
  const { hp, speed, radius, loss } = units[kind]
  const enemy = { id: ++run.serial, kind, x, lane: x, z, phase, hp, maxHp: hp, speed, radius, loss, flash: 0 }
  run.enemies.push(enemy)
  return enemy
}

function addShot(run, member, dx, level, side = false) {
  run.shots.push({
    id: ++run.serial, x: member.x + (side ? 0.06 : 0), z: member.z - 0.65, startZ: member.z - 0.65,
    dx, level, damage: 1 + (run.power && !side ? run.power : 0),
    pierce: level === 2 && !side ? 2 : 0, lastHit: 0,
  })
}

function shoot(run, emit) {
  const members = formation(run.count, run.x)
  const captain = members[0]
  const angles = run.weapon === 0 ? [0] : run.weapon === 1 ? [-0.115, 0, 0.115] : [-0.18, -0.085, 0, 0.085, 0.18]
  for (const angle of angles) addShot(run, captain, angle, run.weapon)
  for (let i = 1; i < members.length; i += 1) {
    if (i % 2 === run.volleyIndex % 2) addShot(run, members[i], 0, run.weapon, true)
  }
  emit('shoot', { ...captain, level: run.weapon, wide: run.count > 3 })
  run.volleyIndex += 1
}

function takeLoss(run, incoming, x, emit) {
  if (run.protection > 0) return
  const loss = Math.min(run.count, incoming)
  run.count -= loss
  run.protection = 0.64
  emit('hurt', { x, z: 0, loss })
  if (run.count === 0) run.state = 'lost'
}

function advanceChoice(run, dt, emit) {
  const next = choices[run.choice]
  if (next && run.time >= next.at) {
    run.pair = { id: ++run.serial, z: GATE_Z, time: run.time, ...next, hit: 0 }
    run.choice += 1
    emit('choice', run.pair)
  }
  const pair = run.pair
  if (!pair) return
  pair.z += dt * 4.22
  pair.hit = Math.max(0, pair.hit - dt)
  if (pair.z < 0) return
  if (Math.abs(run.x - LANES.recruit) < 1.68) {
    const increase = Math.min(MAX_SQUAD - run.count, pair.people)
    run.count += increase
    run.recruited += increase
    emit('recruit', { x: LANES.recruit, z: pair.z, people: increase })
  } else {
    emit('miss', pair)
  }
  run.pair = null
}

function upgrade(run, emit) {
  const pair = run.pair
  run.pair = null
  if (run.weapon < WEAPONS.length - 1) run.weapon += 1
  else run.power = 1
  emit('upgrade', { x: LANES.upgrade, z: pair.z, level: run.weapon, power: run.power })
}

function advanceShots(run, dt, emit) {
  for (const shot of run.shots) {
    const front = shot.z - 33 * dt
    let hitAt = front - 0.001
    let hit = null
    for (const enemy of run.enemies) {
      if (enemy.hp <= 0 || shot.lastHit === enemy.id || enemy.z > shot.z + 0.02 || enemy.z < hitAt) continue
      const aimX = shot.x + (shot.z - enemy.z) * shot.dx
      if (Math.abs(enemy.x - aimX) > enemy.radius + 0.06) continue
      hit = enemy
      hitAt = enemy.z
    }
    const pair = run.pair
    if (pair && pair.z <= shot.z + 0.02 && pair.z >= hitAt &&
        Math.abs(shot.x + (shot.z - pair.z) * shot.dx - LANES.upgrade) < 1.23) {
      pair.hp -= shot.damage
      pair.hit = 0.14
      shot.dead = true
      if (pair.hp <= 0) upgrade(run, emit)
      else emit('target', { x: LANES.upgrade, z: pair.z })
    } else if (hit) {
      hit.hp -= shot.damage
      hit.flash = 0.11
      shot.lastHit = hit.id
      if (shot.pierce > 0) {
        shot.pierce -= 1
      } else {
        shot.dead = true
      }
      if (hit.hp <= 0) {
        run.kills += hit.kind === 'boss' ? 0 : 1
        emit('destroy', hit)
        if (hit.kind === 'boss') run.state = 'won'
      } else if (hit.kind !== 'boss' || shot.level === 0) {
        emit('impact', hit)
      }
    }
    shot.x += 33 * dt * shot.dx
    shot.z = front
  }
  run.shots = run.shots.filter(shot => !shot.dead && shot.z > -46 && Math.abs(shot.x) < 5.6)
}

function advanceBoss(run, enemy, dt, emit) {
  enemy.z = Math.min(-10.8, enemy.z + dt * enemy.speed)
  enemy.x = Math.sin((run.time - BOSS_TIME) * 0.9) * 1.03
  if (enemy.z < -14) return
  if (!run.alarm && run.time >= enemy.nextAttack) {
    run.alarm = { x: clamp(run.x, -2.8, 2.8), width: enemy.hp <= enemy.maxHp * 0.48 ? 2.85 : 2.3, ttl: 1.26 }
    emit('alarm', run.alarm)
  }
  if (!run.alarm) return
  run.alarm.ttl -= dt
  if (run.alarm.ttl > 0) return
  const attack = run.alarm
  run.alarm = null
  enemy.nextAttack = run.time + (enemy.hp <= enemy.maxHp * 0.48 ? 1.35 : 2.25)
  emit('strike', attack)
  if (Math.abs(run.x - attack.x) < attack.width / 2) takeLoss(run, 2, attack.x, emit)
}

export function tickCombat(run, dt, target, direction, emit) {
  if (run.state !== 'playing') return
  moveCombat(run, target, direction, dt)
  run.time += dt
  run.distance += dt * (run.boss ? 2.15 : 4.22)
  run.wave = run.time < 12.15 ? 1 : run.time < 26.2 ? 2 : 3
  run.protection = Math.max(0, run.protection - dt)
  advanceChoice(run, dt, emit)

  if (run.time >= run.nextFile && run.time < BOSS_TIME - 3) {
    sendFile(run, run.file++, -61)
    run.nextFile += run.wave === 1 ? 1.30 : run.wave === 2 ? 1.11 : 0.98
  }
  let row = arrivals[run.arrival]
  while (row && run.time >= row[0]) {
    const [at, kind, lanes] = row
    lanes.forEach((x, index) => spawnEnemy(run, kind, x, -29 - (index % 3) * 1.29, at + index))
    run.arrival += 1
    row = arrivals[run.arrival]
  }
  if (!run.boss && run.time >= BOSS_TIME) {
    run.boss = spawnEnemy(run, 'boss', 0, -35)
    run.boss.nextAttack = run.time + 4.8
    emit('boss', run.boss)
  }

  for (const enemy of run.enemies) {
    enemy.flash = Math.max(0, enemy.flash - dt)
    if (enemy.kind === 'boss') {
      advanceBoss(run, enemy, dt, emit)
      continue
    }
    enemy.z += enemy.speed * dt
    enemy.x = enemy.lane + Math.sin(run.time * (enemy.kind === 'runner' ? 3.5 : 1.75) + enemy.phase) * 0.17
    if (enemy.z < 0.08) continue
    enemy.passed = true
    if (Math.abs(enemy.x - run.x) < enemy.radius + Math.min(1, 0.28 + (run.count - 1) * 0.07)) {
      takeLoss(run, enemy.loss, enemy.x, emit)
    }
  }

  run.enemies = run.enemies.filter(enemy => enemy.hp > 0 && !enemy.passed)
  if (run.state !== 'playing') return
  run.volley -= dt
  if (run.volley <= 0) {
    shoot(run, emit)
    run.volley += 0.22
  }
  advanceShots(run, dt, emit)
  run.enemies = run.enemies.filter(enemy => enemy.hp > 0)
}

export function makePreview() {
  const run = newCombat()
  run.count = 3
  run.x = -0.2
  const ranks = [-3.2, -2, -0.9, 0.14, 1.2, 2.45, 3.33]
  ranks.forEach((lane, i) => {
    spawnEnemy(run, 'grunt', lane, -19.8 - (i % 3) * 1.8, i)
    spawnEnemy(run, i % 2 ? 'armor' : 'runner', lane * 0.95, -25.4 - (i % 4) * 1.4, i + 1)
  })
  run.pair = { id: ++run.serial, z: -9.8, people: 3, hp: 11, hit: 0 }
  return run
}
