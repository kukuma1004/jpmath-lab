import * as T from './vendor/three.module.min.js';
import { track } from './track.js';
import { createRace } from './race.js';
import { buildWorld } from './world.js';
import { buildCars, driveCar } from './cars.js';
import { createAudio } from './audio.js';

const byId = id => document.getElementById(id);
const formatTime = seconds => {
  if (seconds === null) return '—';
  const centis = Math.floor(seconds * 100 + 1e-6);
  const part = number => String(number).padStart(2, '0');
  return `${Math.floor(centis / 6000)}:${part(Math.floor(centis / 100) % 60)}.${part(centis % 100)}`;
};
const recordKey = 'jp-apex-circuit-lap';
const soundKey = 'jp-apex-circuit-sound';
function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function save(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Play remains available in private contexts. */ }
}
function setText(element, text) {
  const value = String(text);
  if (element.textContent !== value) element.textContent = value;
}

function drawMap(canvas) {
  const ctx = canvas.getContext('2d');
  const samples = Array.from({ length: 161 }, (_, i) => track.sample(i * track.length / 160));
  const minX = Math.min(...samples.map(p => p.x));
  const maxX = Math.max(...samples.map(p => p.x));
  const minZ = Math.min(...samples.map(p => p.z));
  const maxZ = Math.max(...samples.map(p => p.z));
  const scale = Math.min((canvas.width - 17) / (maxX - minX), (canvas.height - 15) / (maxZ - minZ));
  const x = world => (world - (minX + maxX) * 0.5) * scale + canvas.width * 0.5;
  const y = world => (world - (minZ + maxZ) * 0.5) * scale + canvas.height * 0.5;
  const course = new Path2D();
  samples.forEach((p, i) => i ? course.lineTo(x(p.x), y(p.z)) : course.moveTo(x(p.x), y(p.z)));
  course.closePath();
  return cars => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#95acb7';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.stroke(course);
    const origin = samples[0];
    ctx.fillStyle = '#f7f0d8';
    ctx.fillRect(x(origin.x) - 1.3, y(origin.z) - 4.3, 2.6, 8.6);
    for (const pad of track.pads) {
      const p = track.sample(pad.distance);
      ctx.fillStyle = '#43f5ce';
      ctx.fillRect(x(p.x) - 1.5, y(p.z) - 1.5, 3, 3);
    }
    for (let i = cars.length - 1; i >= 0; i--) {
      const car = cars[i];
      const p = track.sample(car.distance);
      ctx.beginPath();
      ctx.arc(x(p.x - p.dz * car.lane), y(p.z + p.dx * car.lane), i ? 3.2 : 5, 0, Math.PI * 2);
      ctx.fillStyle = i ? ['#fff', '#ff9e88', '#61d2ee', '#c6a7fa', '#bcca85'][i] : '#ffe34c';
      ctx.fill();
      ctx.strokeStyle = '#142434';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  };
}

function createCamera() {
  const camera = new T.PerspectiveCamera(48, 1, .1, 2200);
  const target = new T.Vector3();
  const desired = new T.Vector3();
  const aim = new T.Vector3();
  const menuPosition = new T.Vector3(-106, 35, 66);
  const p = {}, preview = {};
  let ready = false;
  function update(race, state, animateTime, dt, reduced, snap = false) {
    const portrait = camera.aspect < .95;
    const isMenu = state === 'menu';
    const player = race.cars[0];
    let fov;
    if (isMenu) {
      const drift = reduced ? 0 : Math.sin(animateTime * .31) * 1.3;
      desired.copy(menuPosition);
      desired.x += drift;
      if (portrait) {
        desired.set(-99 + drift, 36, 63);
        aim.set(-64, -3, 43);
      } else {
        aim.set(-74, 3.5, 17);
      }
      fov = portrait ? 51 : 48;
    } else {
      track.sample(player.distance, p);
      track.sample(player.distance + (portrait ? 10.8 : 12.7), preview);
      const follow = portrait ? 15.5 : 16.0;
      const height = portrait ? 29.0 : 28.7;
      desired.set(p.x - p.dx * follow + p.dz * 1.4, p.y + height + player.air * .25,
        p.z - p.dz * follow - p.dx * 1.4);
      aim.set(preview.x, preview.y + 0.9, preview.z);
      fov = (portrait ? 54 : 48) + (race.boosting && !reduced ? 4.0 : 0);
    }
    const blend = snap || !ready ? 1 : 1 - Math.exp(-(isMenu ? 3.6 : 14.2) * dt);
    camera.position.lerp(desired, blend);
    target.lerp(aim, blend);
    camera.lookAt(target);
    const next = T.MathUtils.lerp(camera.fov, fov, blend);
    if (Math.abs(next - camera.fov) > .01) {
      camera.fov = next;
      camera.updateProjectionMatrix();
    }
    ready = true;
  }
  return { camera, update };
}

function setup() {
  const world = byId('world');
  const renderer = new T.WebGLRenderer({ canvas: world, antialias: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.NeutralToneMapping;
  renderer.toneMappingExposure = .97;
  const scene = new T.Scene();
  const { waves, lights } = buildWorld(scene);
  const vehicles = buildCars(scene);
  const view = createCamera();
  const race = createRace(track);
  const audio = createAudio(read(soundKey) !== 'off');
  const map = drawMap(byId('minimap'));
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nodes = Object.fromEntries(['start', 'pause', 'resume', 'retry', 'play-again', 'menu', 'sound', 'rank',
    'lap', 'race-time', 'speed', 'boost-fill', 'boost-value', 'countdown', 'feedback', 'result-rank',
    'result-time', 'result-lap', 'result-best', 'menu-best'].map(id => [id, byId(id)]));
  const measured = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && new URLSearchParams(location.search).has('qa');
  const controls = [...document.querySelectorAll('[data-control]')];
  const keyControls = new Map([['ArrowLeft', 'left'], ['KeyA', 'left'], ['ArrowRight', 'right'], ['KeyD', 'right'],
    ['ArrowDown', 'brake'], ['KeyS', 'brake'], ['Space', 'boost']]);
  const keys = new Set();
  const pointers = new Map();
  const input = { steer: 0, brake: false, boost: false };
  const fixed = 1 / 60;
  let state = 'loading', pausedState = 'racing';
  let best = Number(read(recordKey)) || null;
  let countdown = 3, previousBeat = 0, startFlash = 0;
  let feedbackTime = 0, worldTime = 0, signalTime = 0;
  let accumulator = 0, lastFrame = performance.now(), frame = 0;
  let manual = false, snap = true, resizePending = true, visualOnly = false;
  let lastHUD = '', lastMapUpdate = -1, lastStateRendered;
  const projected = new T.Vector3();

  function updateSound() {
    nodes.sound.setAttribute('aria-pressed', String(audio.enabled));
  }
  function resize() {
    const width = world.clientWidth;
    const height = world.clientHeight;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, width < 850 ? 1.45 : 1.65));
    renderer.setSize(width, height, false);
    view.camera.aspect = width / Math.max(height, 1);
    view.camera.updateProjectionMatrix();
    resizePending = false;
    snap = true;
  }
  function updateControls() {
    const active = new Set(pointers.values());
    for (const key of keys) active.add(keyControls.get(key));
    input.steer = Number(active.has('right')) - Number(active.has('left'));
    input.brake = active.has('brake');
    input.boost = active.has('boost');
    for (const button of controls) button.classList.toggle('is-held', active.has(button.dataset.control));
  }
  function clearControls() {
    keys.clear();
    pointers.clear();
    updateControls();
  }
  function clearMessage() {
    feedbackTime = 0;
    setText(nodes.feedback, '');
  }
  function change(next) {
    state = next;
    document.body.dataset.state = next;
    document.body.classList.toggle('is-boosting', next === 'racing' && race.boosting);
    if (!['countdown', 'racing'].includes(next)) audio.drive(0, false, false);
  }
  function showMenu(focus) {
    race.reset();
    clearControls();
    clearMessage();
    setText(nodes['menu-best'], formatTime(best));
    setText(nodes.countdown, '');
    signalTime = 0;
    snap = true;
    change('menu');
    if (focus) nodes.start.focus({ preventScroll: true });
  }
  function start() {
    audio.unlock();
    race.reset();
    clearControls();
    clearMessage();
    accumulator = 0;
    previousBeat = 0;
    countdown = 3;
    startFlash = 0;
    signalTime = 0;
    lastMapUpdate = -1;
    change('countdown');
    showCountdown(3);
    snap = true;
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }
  function pause() {
    if (state !== 'racing' && state !== 'countdown') return;
    pausedState = state;
    clearControls();
    change('paused');
    nodes.resume.focus({ preventScroll: true });
  }
  function resume() {
    if (state !== 'paused') return;
    audio.unlock();
    change(pausedState);
    nodes.resume.blur();
  }
  function finish() {
    if (race.bestLap !== null && (best === null || race.bestLap < best)) {
      best = race.bestLap;
      save(recordKey, best);
    }
    setText(nodes['result-rank'], race.place);
    setText(nodes['result-time'], formatTime(race.time));
    setText(nodes['result-lap'], formatTime(race.bestLap));
    setText(nodes['result-best'], formatTime(best));
    change('results');
    nodes['play-again'].focus({ preventScroll: true });
  }
  function showCountdown(beat) {
    if (previousBeat === beat) return;
    previousBeat = beat;
    setText(nodes.countdown, beat);
    audio.signal('ready');
  }
  function note(message, duration = .94) {
    feedbackTime = duration;
    setText(nodes.feedback, message);
  }
  function playEvent(event) {
    audio.signal(event);
    switch (event) {
      case 'charge': note('부스터 충전'); break;
      case 'boost': note('부스터 작동', .58); break;
      case 'wall': note('가드레일 접촉', .68); break;
      case 'bump': note('차량 접촉', .64); break;
      case 'lap': note(race.lap === race.laps ? '마지막 바퀴' : '2랩 진입', 1.2); break;
      case 'finish': finish(); break;
    }
  }
  function tick(dt) {
    if (state === 'countdown') {
      countdown -= dt;
      if (countdown <= 0) {
        change('racing');
        setText(nodes.countdown, 'GO!');
        startFlash = .65;
        signalTime = .85;
        audio.signal('go');
      } else {
        showCountdown(Math.ceil(countdown));
      }
    } else if (state === 'racing') {
      startFlash = Math.max(0, startFlash - dt);
      if (!startFlash) setText(nodes.countdown, '');
      feedbackTime = Math.max(0, feedbackTime - dt);
      if (!feedbackTime) clearMessage();
      signalTime = Math.max(0, signalTime - dt);
      race.step(dt, input);
      for (const event of race.events) playEvent(event);
    }
  }
  function hud() {
    if (!['racing', 'countdown', 'paused'].includes(state)) return;
    const speed = Math.round(race.cars[0].speed * 3.6);
    const percent = Math.round(race.boost * 100);
    const display = [race.place, race.lap, formatTime(race.time), speed, percent];
    const next = display.join(',');
    if (lastHUD !== next) {
      lastHUD = next;
      ['rank', 'lap', 'race-time', 'speed', 'boost-value'].forEach((id, i) => setText(nodes[id], display[i]));
      nodes['boost-fill'].style.setProperty('--charge', percent / 100);
    }
    if (lastMapUpdate < 0 || Math.abs(lastMapUpdate - race.time) >= .032) {
      map(race.cars);
      lastMapUpdate = race.time;
    }
  }
  function render(dt) {
    if (resizePending) resize();
    if (!['paused', 'results'].includes(state) && !motion.matches && !visualOnly) worldTime += dt;
    waves.value = worldTime;
    const boosting = state === 'racing' && race.boosting;
    document.body.classList.toggle('is-boosting', boosting);
    for (const [i, material] of lights.entries()) {
      const lit = state === 'countdown' && i < previousBeat * 2;
      material.color.set(signalTime > 0 ? 0x30fcc0 : lit ? 0xff622d : 0x4f2f34);
    }
    race.cars.forEach((car, index) => driveCar(vehicles[index], car, boosting && index === 0, motion.matches ? 0 : worldTime));
    if (state !== 'paused' || snap) view.update(race, state === 'paused' ? pausedState : state, worldTime, dt, motion.matches, snap);
    snap = false;
    audio.drive(race.cars[0].speed, boosting, state === 'racing' || state === 'countdown');
    hud();
    renderer.render(scene, view.camera);
    frame++;
    lastStateRendered = state;
    if (measured) {
      projected.copy(vehicles[0].model.position).project(view.camera);
      window.__THREE_GAME_DIAGNOSTICS__ = {
        frame, score: race.progress, complete: race.finished, state, time: race.time, place: race.place,
        player: { ...race.cars[0] }, boost: race.boost, boosting, lap: race.lap, input: { ...input },
        projected: { x: (1 + projected.x) * .5, y: (1 - projected.y) * .5 },
        render: { ...renderer.info.render }, memory: { ...renderer.info.memory },
      };
    }
  }
  function animate(now) {
    const dt = Math.max(0, Math.min(.12, (now - lastFrame) / 1000));
    lastFrame = now;
    if (!manual) {
      accumulator = Math.min(.12, accumulator + dt);
      while (accumulator >= fixed) {
        tick(fixed);
        accumulator -= fixed;
      }
      const rests = state === 'paused' || state === 'results' || (state === 'menu' && motion.matches);
      if (!rests || resizePending || lastStateRendered !== state) render(dt);
    }
    requestAnimationFrame(animate);
  }

  nodes.start.addEventListener('click', start);
  nodes.pause.addEventListener('click', pause);
  nodes.resume.addEventListener('click', resume);
  nodes.retry.addEventListener('click', start);
  nodes['play-again'].addEventListener('click', start);
  nodes.menu.addEventListener('click', () => showMenu(true));
  nodes.sound.addEventListener('click', () => {
    audio.setEnabled(!audio.enabled);
    save(soundKey, audio.enabled ? 'on' : 'off');
    updateSound();
  });
  for (const button of controls) {
    button.addEventListener('pointerdown', event => {
      if (!['racing', 'countdown'].includes(state) || event.button !== 0) return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, button.dataset.control);
      updateControls();
    });
    function end(event) {
      pointers.delete(event.pointerId);
      updateControls();
    }
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(name, end);
  }
  window.addEventListener('keydown', event => {
    if (event.altKey || event.metaKey || event.ctrlKey) return;
    if (['KeyP', 'Escape'].includes(event.code) && !event.repeat) {
      if (state === 'paused') resume();
      else pause();
      return;
    }
    if (!['racing', 'countdown'].includes(state) || !keyControls.has(event.code)) return;
    if (event.code === 'Space' && event.target instanceof HTMLButtonElement) return;
    event.preventDefault();
    keys.add(event.code);
    updateControls();
  });
  window.addEventListener('keyup', event => {
    if (keys.delete(event.code)) updateControls();
  });
  window.addEventListener('blur', clearControls);
  window.addEventListener('resize', () => { resizePending = true; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
  });
  world.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    pause();
  });
  world.addEventListener('webglcontextrestored', () => { resizePending = true; });

  if (measured) {
    window.__apexQA = {
      track, race,
      freeze(value = true) { manual = value; },
      step(frames = 1, snapCamera = false) {
        for (let i = 0; i < frames; i++) tick(fixed);
        if (snapCamera) snap = true;
        render(Math.min(frames, 6) * fixed);
      },
      visualOnly() { visualOnly = true; },
    };
  }
  updateSound();
  showMenu(false);
  render(0);
  requestAnimationFrame(animate);
}

try {
  setup();
} catch (error) {
  console.error('Apex Circuit initialization failed', error);
  document.body.dataset.state = 'error';
  setText(byId('loading-message'), '3D 화면을 열 수 없어요. WebGL 2를 지원하는 브라우저에서 다시 열어 주세요.');
}
