import * as THREE from 'three'
import { formation, makePreview, newCombat, tickCombat, WEAPONS } from './combat.js'
import { loadCleared, saveCleared, STAGES } from './campaign.js'
import { createEffects, createHazard, createPickups } from './field-effects.js'
import { createAudio } from './sound.js'
import { createCrowd, createWorld } from './world.js'

const el = id => document.getElementById(id)
const viewport = el('viewport')
const canvas = el('canvas')
const ui = {
  overlay: el('overlay'), title: el('overlay-title'), kicker: el('overlay-kicker'),
  copy: el('overlay-copy'), action: el('action'), restart: el('restart'), pause: el('pause'),
  sound: el('sound'), squad: el('squad'), weapon: el('weapon'), wave: el('wave'),
  progress: el('progress'), hint: el('hint'), toast: el('toast'), boss: el('boss-hud'),
  bossHealth: el('boss-health'), stageLabel: el('stage-label'), stagePicker: el('stage-picker'), stageMenu: el('stage-menu'),
  recruitCue: el('reward-recruit'), weaponCue: el('reward-weapon'),
}
const stageButtons = [...ui.stagePicker.querySelectorAll('button')]

const overlays = {
  ready: ['성문 전선', '해협 돌파', '좌우로 움직여 병사를 모으고 무기 상자를 쏘세요.', '전투 시작'],
  paused: ['성문 전선', '일시정지', '준비되면 전투를 이어가세요.', '계속하기'],
  won: ['작전 성공', '성문 돌파', '', '다시 도전'],
  lost: ['작전 종료', '대열이 무너졌습니다', '', '다시 도전'],
  error: ['실행 오류', '3D 화면을 열 수 없어요', 'WebGL 2를 지원하는 브라우저에서 새로 열어 주세요.', '다시 불러오기'],
}

function boot() {
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  const camera = new THREE.PerspectiveCamera(49, 1, 0.17, 155)
  const world = createWorld(scene)
  const crowd = createCrowd(scene)
  const pickups = createPickups(scene)
  const hazards = [createHazard(), createHazard()]
  const effects = createEffects(scene)
  for (const hazard of hazards) scene.add(hazard.root)
  const allies = []
  const audio = createAudio()
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
  const keys = new Set()
  const left = ['ArrowLeft', 'KeyA']
  const right = ['ArrowRight', 'KeyD']
  const movementKeys = new Set([...left, ...right])
  const fixedStep = 1 / 60
  const lastStage = STAGES.length - 1
  let cleared = loadCleared()
  let stageIndex = Math.min(cleared, lastStage)
  let state = 'ready'
  let run = makePreview(stageIndex)
  let desiredX = 0
  let pointer = null
  let viewWidth = 400
  let viewAspect = 0.5
  let previous = performance.now()
  let accumulator = 0
  let artTime = 0
  let toastEnd = 0
  const rewardEnd = { recruitCue: 0, weaponCue: 0 }
  let shake = 0
  let cameraPull = 0
  let cameraLean = 0
  let lastCameraX = 0
  let frame = 0
  let stopped = false
  let screenshotPaused = false
  let testRate = 1
  let reduceEffects = reducedMotion.matches

  function showStage() {
    world.setStage?.(stageIndex)
    crowd.setStage?.(stageIndex)
    setText(ui.stageLabel, `${stageIndex + 1}/${STAGES.length} ${STAGES[stageIndex].name}`)
    canvas.setAttribute('aria-label', `3D 전투 화면 · ${STAGES[stageIndex].name}`)
    setText(ui.boss.querySelector('span'), STAGES[stageIndex].boss)
  }

  function refreshStagePicker() {
    stageButtons.forEach((button, index) => {
      button.disabled = index > cleared
      button.setAttribute('aria-pressed', String(index === stageIndex))
      button.querySelector('small').textContent = index < cleared ? '돌파 완료' : button.disabled ? '잠김' : '진입 가능'
    })
  }

  function setText(node, value) {
    const text = String(value)
    if (node.textContent !== text) node.textContent = text
  }

  function setHidden(node, value) {
    if (node.hidden !== value) node.hidden = value
  }

  function updateMute() {
    ui.sound.setAttribute('aria-pressed', String(audio.muted))
    ui.sound.setAttribute('aria-label', audio.muted ? '소리 켜기' : '소리 끄기')
  }

  function clearInput() {
    if (pointer && canvas.hasPointerCapture(pointer.id)) canvas.releasePointerCapture(pointer.id)
    pointer = null
    keys.clear()
    desiredX = run.x
  }

  function stateTo(next) {
    state = next
    viewport.dataset.state = next
    const active = next === 'playing'
    setHidden(ui.overlay, active)
    setHidden(ui.pause, !active)
    setHidden(ui.restart, next !== 'paused')
    setHidden(ui.stageMenu, next !== 'won' && next !== 'lost' && next !== 'paused')
    setHidden(ui.stagePicker, next !== 'ready')
    if (active) return
    clearInput()
    setHidden(ui.hint, true)
    setHidden(ui.toast, true)
    const [, title, message, action] = overlays[next]
    const lastVictory = next === 'won' && stageIndex === lastStage
    if (next === 'won' && stageIndex + 1 > cleared) {
      cleared = saveCleared(stageIndex + 1)
    }
    setText(ui.kicker, `${stageIndex + 1} / ${STAGES.length} · ${STAGES[stageIndex].name}`)
    setText(ui.title, lastVictory ? '전 전선 돌파' : next === 'won' ? '전장 돌파' : title)
    setText(ui.copy, message || (next === 'won'
      ? `적 ${run.kills}명 격파 · 병사 ${run.count}명 생존`
      : battlefieldLoss()))
    if (next === 'ready') {
      setText(ui.copy, STAGES[stageIndex].plan)
      refreshStagePicker()
    }
    setText(ui.action, next === 'won' && !lastVictory ? '다음 전장' : action)
    if (next === 'paused' || next === 'won' || next === 'lost') ui.action.focus({ preventScroll: true })
    if (next === 'won' || next === 'lost') audio.play(next)
  }

  function battlefieldLoss() {
    if (lastDamageWasBoss) return '바닥에 표시된 공격 범위를 피하면 대열을 지킬 수 있어요.'
    if (run.time < 12) return '첫 증원문을 통과하면 일곱 명이 함께 싸워요.'
    return '측면 기습이 오면 반대편으로 움직여 대열을 지키세요.'
  }

  let lastDamageWasBoss = false

  function resetBattle() {
    clearInput()
    desiredX = 0
    accumulator = 0
    shake = 0
    cameraPull = 0
    cameraLean = 0
    lastCameraX = 0
    toastEnd = 0
    rewardEnd.recruitCue = 0
    rewardEnd.weaponCue = 0
    lastDamageWasBoss = false
    allies.length = 0
    pickups.update([], artTime)
    effects.reset()
  }

  function start(unlockAudio = true) {
    resetBattle()
    run = newCombat(stageIndex)
    showStage()
    if (unlockAudio) audio.unlock()
    stateTo('playing')
    updateHud()
  }

  function prepare(index) {
    resetBattle()
    stageIndex = index
    run = makePreview(stageIndex)
    showStage()
    stateTo('ready')
    updateHud()
  }

  function updateHud() {
    setText(ui.squad, run.count)
    setText(ui.weapon, WEAPONS[run.weapon])
    setText(ui.wave, state === 'ready' ? '준비' : run.boss ? '보스전' : `${run.wave} / 3 공세`)
    const progress = run.boss ? 82 + (1 - Math.max(0, run.boss.hp) / run.boss.maxHp) * 18
      : 82 * Math.min(1, run.time / run.bossTime)
    ui.progress.style.width = `${progress.toFixed(1)}%`
    setHidden(ui.boss, !run.boss || (state !== 'playing' && state !== 'paused'))
    if (run.boss) ui.bossHealth.style.width = `${100 * Math.max(0, run.boss.hp) / run.boss.maxHp}%`
    setHidden(ui.toast, state !== 'playing' || artTime >= toastEnd)
    for (const key of ['recruitCue', 'weaponCue']) {
      if (ui[key]) setHidden(ui[key], state !== 'playing' || artTime >= rewardEnd[key])
    }
    setHidden(ui.hint, state !== 'playing' || run.time > 3.55 || run.x < -1.1)
  }

  function showToast(message, tone, duration = 1.36) {
    setText(ui.toast, message)
    ui.toast.dataset.tone = tone
    toastEnd = artTime + duration
  }

  function showReward(key, message) {
    if (!ui[key]) return
    setText(ui[key], message)
    rewardEnd[key] = artTime + 2.25
  }

  function event(type, data) {
    audio.play(type, data)
    switch (type) {
      case 'shoot':
        effects.burst(data.x, 0.7, data.z - 0.51, data.level ? 0xffce83 : 0x72efff, 2, 1.3)
        return
      case 'target':
        effects.burst(data.x, 1.02, data.z + 0.26, 0xffd099, 5, 2.3)
        return
      case 'impact':
        effects.burst(data.x, 0.79, data.z + 0.15, 0xffc985, 2, 2.2)
        return
      case 'blast':
        effects.pulse(data.x, data.z, 0xff9c4b, 1.65)
        effects.burst(data.x, 0.44, data.z, 0xffaa58, 14, 4.2)
        return
      case 'destroy': {
        const boss = data.kind === 'boss'
        effects.burst(data.x, boss ? 2 : 0.82, data.z, 0xff804d, boss ? 85 : 9, boss ? 9.2 : 3.7)
        effects.burst(data.x, boss ? 2.3 : 0.65, data.z, 0xffe4a5, boss ? 56 : 4, boss ? 7.5 : 2.1)
        effects.pulse(data.x, data.z, 0xffa372, boss ? 5.7 : 0.84)
        shake = Math.max(shake, boss ? 0.73 : 0.035)
        return
      }
      case 'hurt':
        lastDamageWasBoss = data.boss
        effects.burst(data.x, 0.82, 0, 0xff916d, 16, 4.2)
        showToast(`병력 −${data.loss}`, 'danger')
        shake = 0.6
        return
      case 'recruit':
        effects.pulse(data.x, data.z, 0x4ff6b1, 2.55)
        effects.burst(data.x, 0.76, data.z, 0x7affc7, 30, 4.6)
        showReward('recruitCue', data.people ? `+${data.people}명 증원` : '최대 병력')
        for (let index = 0; index < data.people; index += 1) {
          allies.push({ x: data.x + ((index % 5) - 2) * 0.18, z: 0.7 + Math.floor(index / 5) * 0.13 })
        }
        return
      case 'upgrade':
        effects.pulse(data.x, data.z, 0xffbc67, 2.35)
        effects.pulse(run.x, 0, 0xffbc67, 1.9)
        effects.burst(data.x, 1.18, data.z, 0xffba69, 38, 5.7)
        showReward('weaponCue', `무기 강화 · ${data.level + 1}/${WEAPONS.length}`)
        return
      case 'boss':
        showToast(`${STAGES[stageIndex].boss} 접근`, 'danger', 1.8)
        return
      case 'flank':
        showToast(data.side < 0 ? '왼쪽 기습 접근' : '오른쪽 기습 접근', 'danger', 1.4)
        return
      case 'alarm':
        showToast(({ outer: '양옆 위험 · 가운데로', center: '가운데 위험 · 양옆으로', left: '왼쪽 위험 · 오른쪽으로', right: '오른쪽 위험 · 왼쪽으로' })[data.attack]
          ?? '바닥의 공격 범위를 피하세요', 'danger', 1.5)
        return
      case 'strike':
        for (let i = 0; i < 6; i += 1) effects.burst(data.x, 0.17, -i * 2, 0xff7c4c, 10, 5.1)
        shake = Math.max(shake, 0.28)
    }
  }

  function updateModels(dt) {
    const people = formation(run.count, run.x)
    for (let i = 0; i < people.length; i += 1) {
      const member = people[i]
      const unit = allies[i] ?? (allies[i] = { x: run.x, z: 0 })
      unit.x = THREE.MathUtils.damp(unit.x, member.x, 25, dt)
      unit.z = THREE.MathUtils.damp(unit.z, member.z, 19, dt)
    }
    allies.length = people.length
    crowd.update({
      allies, enemies: run.enemies, bossAlarm: run.alarm,
      time: artTime, moving: state === 'playing',
    })
    pickups.update(run.pickups, artTime)
    for (const [index, hazard] of hazards.entries()) {
      const zone = run.alarm?.zones[index]
      hazard.update(zone && { ...zone, ttl: run.alarm.ttl }, artTime)
    }
    effects.update(run.shots, dt)
  }

  function resize() {
    const bounds = viewport.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return
    viewWidth = bounds.width
    viewAspect = bounds.width / bounds.height
    const dprLimit = viewWidth <= 600 ? 1.5 : 1.65
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprLimit))
    renderer.setSize(Math.round(bounds.width), Math.round(bounds.height), false)
    camera.aspect = viewAspect
    camera.fov = THREE.MathUtils.clamp(50.5 + Math.max(0, 0.55 - viewAspect) * 34, 49, 63)
    camera.updateProjectionMatrix()
  }

  function cameraUpdate(dt) {
    const offset = reduceEffects ? 0 : shake * shake
    const spread = THREE.MathUtils.smoothstep(run.count, 12, 34) * 1.55
    cameraPull = THREE.MathUtils.damp(cameraPull, spread, 4.2, dt)
    camera.position.set(run.x * 0.47 + offset * 0.27 * Math.sin(46 * artTime), 9.1 + cameraPull * 0.33 + offset * 0.16 * Math.cos(55 * artTime), 11.9 + cameraPull)
    camera.lookAt(run.x * 0.32, 0.45, -8.6)
    const lateralSpeed = (run.x - lastCameraX) / Math.max(dt, 0.01)
    const lean = state === 'playing' && !reduceEffects ? THREE.MathUtils.clamp(lateralSpeed * -0.0022, -0.019, 0.019) : 0
    cameraLean = THREE.MathUtils.damp(cameraLean, lean, 9, dt)
    camera.rotateZ(cameraLean)
    lastCameraX = run.x
  }

  function render(now) {
    if (stopped) return
    const dt = Math.min(0.12, (now - previous) / 1000)
    previous = now
    if (state !== 'paused' && !screenshotPaused) artTime += dt
    if (state === 'playing' && !screenshotPaused) {
      const direction = Number(right.some(key => keys.has(key))) - Number(left.some(key => keys.has(key)))
      accumulator += dt * (import.meta.env.DEV ? testRate : 1)
      while (accumulator >= fixedStep && run.state === 'playing') {
        tickCombat(run, fixedStep, desiredX, direction, event)
        if (direction) desiredX = run.x
        accumulator -= fixedStep
      }
      if (run.state !== 'playing') stateTo(run.state)
    }
    if (!screenshotPaused) shake = Math.max(0, shake - dt * 1.66)
    cameraUpdate(dt)
    world.update(artTime, run.distance)
    updateModels(state === 'paused' || screenshotPaused ? 0 : dt)
    updateHud()
    renderer.render(scene, camera)
    frame += 1
    requestAnimationFrame(render)
  }

  canvas.addEventListener('pointerdown', e => {
    if (state !== 'playing' || pointer || (e.pointerType === 'mouse' && e.button !== 0)) return
    pointer = { id: e.pointerId, origin: e.clientX, startingX: desiredX }
    canvas.setPointerCapture(e.pointerId)
  })

  canvas.addEventListener('pointermove', e => {
    if (pointer?.id !== e.pointerId || state !== 'playing') return
    desiredX = THREE.MathUtils.clamp(pointer.startingX + (e.clientX - pointer.origin) / viewWidth * 10.6, -3.45, 3.45)
  })

  function endPointer(e) {
    if (pointer?.id !== e.pointerId) return
    pointer = null
  }

  for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(name, endPointer)
  window.addEventListener('keydown', e => {
    if (movementKeys.has(e.code) && state === 'playing') {
      e.preventDefault()
      keys.add(e.code)
    }
    if (e.code === 'Escape' && !e.repeat) {
      if (state === 'playing') stateTo('paused')
      else if (state === 'paused') {
        audio.unlock()
        stateTo('playing')
      }
    }
  })
  window.addEventListener('keyup', e => keys.delete(e.code))
  window.addEventListener('blur', clearInput)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state === 'playing') stateTo('paused')
  })
  ui.action.addEventListener('click', () => {
    if (state === 'error') location.reload()
    else if (state === 'paused') {
      audio.unlock()
      stateTo('playing')
      ui.action.blur()
    } else {
      if (state === 'won' && stageIndex < lastStage) stageIndex += 1
      start()
      ui.action.blur()
    }
  })
  ui.restart.addEventListener('click', () => start())
  ui.stageMenu.addEventListener('click', () => prepare(Math.min(cleared, lastStage)))
  for (const [index, button] of stageButtons.entries()) {
    button.addEventListener('click', () => { if (index <= cleared) prepare(index) })
  }
  ui.pause.addEventListener('click', () => stateTo('paused'))
  ui.sound.addEventListener('click', () => {
    audio.toggle()
    updateMute()
  })
  canvas.addEventListener('webglcontextlost', e => {
    e.preventDefault()
    stopped = true
    stateTo('error')
  })
  reducedMotion.addEventListener('change', event => { reduceEffects = event.matches })
  new ResizeObserver(resize).observe(viewport)

  if (import.meta.env.DEV && new URLSearchParams(location.search).has('qa')) {
    window.__THREE_GAME_DIAGNOSTICS__ = {
      renderer: renderer.info,
      get state() {
        return {
          frame, state, stage: stageIndex, cleared, x: run.x, time: run.time, squad: run.count, weapon: run.weapon, kills: run.kills,
          pickups: run.pickups, boss: run.boss && { x: run.boss.x, z: run.boss.z, hp: run.boss.hp },
          alarm: run.alarm, enemies: run.enemies.map(({ kind, x, z, hp }) => ({ kind, x, z, hp })),
          traveled: run.traveled, muted: audio.muted, shots: run.shots.length, dpr: renderer.getPixelRatio(),
        }
      },
    }
    window.__THREE_GAME_TEST_HOOKS__ = {
      setPausedForScreenshot(paused) { screenshotPaused = paused },
      setReducedMotion(reduced) { reduceEffects = reduced },
      setClockRate(rate) { testRate = THREE.MathUtils.clamp(rate, 1, 3) },
      setState(name, { index, at, turns = [] } = {}) {
        if (!STAGES[index] || !Number.isFinite(at)) throw new Error(`Unknown capture state: ${name}`)
        stageIndex = index
        start(false)
        let x = 0
        let turnIndex = 0
        while (run.time < at && run.state === 'playing') {
          while (turns[turnIndex]?.[0] <= run.time) x = turns[turnIndex++][1]
          artTime = run.time
          tickCombat(run, fixedStep, x, 0, (type, data) => {
            if (at - run.time < 2.25 && (type === 'upgrade' || type === 'recruit')) event(type, data)
          })
        }
        if (run.state !== 'playing') throw new Error(`Failed to enter ${name}`)
        desiredX = run.x
        artTime = run.time
        cameraUpdate(1)
        updateModels(1)
        updateHud()
        return { state: name }
      },
    }
  }
  resize()
  updateMute()
  showStage()
  stateTo('ready')
  requestAnimationFrame(render)
}

try {
  boot()
} catch (error) {
  console.error(error)
  viewport.dataset.state = 'error'
  const [kicker, title, text, action] = overlays.error
  ui.kicker.textContent = kicker
  ui.title.textContent = title
  ui.copy.textContent = text
  ui.action.textContent = action
  ui.action.addEventListener('click', () => location.reload())
  ui.pause.hidden = true
  ui.sound.hidden = true
  ui.stagePicker.hidden = true
}
