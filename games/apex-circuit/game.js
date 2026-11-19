import * as T from './vendor/three.module.min.js';
import { tracks } from './track.js?v=5';
import { createRace, vehicleSpecs } from './race.js?v=5';
import { buildWorld } from './world.js?v=7';
import { buildCars, driveCar, selectVehicle } from './cars.js?v=8';
import { createAudio } from './audio.js?v=4';
import { createEffects } from './effects.js?v=4';
import { bindGarage } from './garage.js?v=5';
import { bindRanking, formatTime } from './ranking.js?v=1';

const byId = id => document.getElementById(id);
const recordKey = 'jp-apex-circuit-lap';
const soundKey = 'jp-apex-circuit-sound';
const courseKey = 'jp-apex-circuit-course';
const vehicleKey = 'jp-apex-circuit-vehicle';
const roadRoster = vehicleSpecs.filter(spec => spec.cosmetic);
function read(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function save(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
function lapKey(courseId) {
  return courseId === tracks[0].id ? recordKey : `${recordKey}:${courseId}`;
}
function readBestLap(courseId) {
  const best = Number(read(lapKey(courseId)));
  return Number.isFinite(best) && best > 0 ? best : null;
}
function setText(element, text) {
  const value = String(text);
  if (element.textContent !== value) element.textContent = value;
}

function drawMap(canvas, track) {
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
    for (const gap of track.gaps) {
      const a = track.sample(gap.start);
      const b = track.sample(gap.end);
      ctx.beginPath();
      ctx.moveTo(x(a.x), y(a.z));
      ctx.lineTo(x(b.x), y(b.z));
      ctx.strokeStyle = '#f5b660';
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
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
  const p = {}, preview = {}, trailing = {};
  let ready = false;
  function update(track, race, vehicle, state, animateTime, dt, reduced, snap = false) {
    const portrait = camera.aspect < .95;
    const isMenu = state === 'menu';
    const player = race.cars[0];
    track.sample(player.distance, p);
    let fov;
    if (isMenu) {
      const drift = reduced ? 0 : Math.sin(animateTime * .35) * .62;
      const ahead = vehicle.cosmetic ? (portrait ? 10.65 : 6.2) : (portrait ? 9.5 : 8.4);
      const flank = (vehicle.cosmetic ? (portrait ? 7.4 : 6.65) : (portrait ? 6.75 : 6.4)) + drift;
      const height = vehicle.cosmetic ? (portrait ? 4.6 : 3.15) : (portrait ? 4.2 : 3.8);
      desired.set(p.x + p.dx * ahead - p.dz * flank, p.y + height,
        p.z + p.dz * ahead + p.dx * flank);
      const rightX = desired.z - p.z;
      const rightZ = p.x - desired.x;
      const offset = portrait ? .10 : vehicle.cosmetic ? 1.75 : 3.06;
      const scale = offset / Math.hypot(rightX, rightZ);
      const aimHeight = vehicle.cosmetic ? (portrait ? -1.8 : .77) : (portrait ? -2.0 : .37);
      aim.set(p.x - rightX * scale, p.y + aimHeight, p.z - rightZ * scale);
      fov = vehicle.cosmetic ? (portrait ? 49 : 44) : (portrait ? 49 : 46);
    } else {
      const marker = (player.distance % track.length + track.length) % track.length;
      let dropView = 0;
      if (!reduced) {
        for (const gap of track.gaps) {
          const entry = T.MathUtils.smoothstep(marker, gap.start - 22, gap.start + 2);
          const exit = 1 - T.MathUtils.smoothstep(marker, gap.end + 1, gap.end + 30);
          dropView = Math.max(dropView, entry * exit);
        }
      }
      const follow = T.MathUtils.lerp(portrait ? 12.8 : 13.2, portrait ? 13.0 : 10.7, dropView);
      const shoulder = T.MathUtils.lerp(portrait ? .9 : 1.85, .72, dropView);
      const height = T.MathUtils.lerp(portrait ? 8.6 : 5.5, portrait ? 8.2 : 5.3, dropView);
      const laneFollow = player.lane * (portrait ? 1 : .40 + .54 * dropView);
      const carX = p.x - p.dz * laneFollow;
      const carZ = p.z + p.dx * laneFollow;
      const carY = p.y + p.bank * laneFollow + player.air;
      track.sample(player.distance - follow, trailing);
      track.sample(player.distance + T.MathUtils.lerp(9, 19, dropView), preview);
      desired.set(carX - p.dx * follow + p.dz * shoulder, Math.max(carY + height, trailing.y + 3.6),
        carZ - p.dz * follow - p.dx * shoulder);
      const upcoming = T.MathUtils.clamp(preview.y + .95, carY - 5.6, carY + 9);
      const aimY = T.MathUtils.lerp(upcoming, carY - height * .68, dropView);
      aim.set(preview.x - p.dz * laneFollow, aimY, preview.z + p.dx * laneFollow);
      fov = (portrait ? 54 : 49) + (race.boosting && !reduced ? 4.0 : 0) + dropView * 2;
    }
    const blend = snap || !ready ? 1 : 1 - Math.exp(-(isMenu ? 3.6 : 14.2) * dt);
    camera.position.lerp(desired, blend);
    target.lerp(aim, blend);
    camera.lookAt(target);
    if (!isMenu && !reduced) {
      camera.rotateZ(-player.slip * .065 + Math.sin(animateTime * 58) * race.impact * .009);
      camera.position.y += Math.sin(animateTime * 73) * race.impact * .12;
    }
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
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.info.autoReset = false;
  const worldCache = new Map();
  const wetTarget = new T.WebGLRenderTarget(560, 350, {type:T.HalfFloatType});
  const mirrorCamera = new T.PerspectiveCamera();
  const roadPlane = new T.Plane();
  const mirrorAim = new T.Vector3();
  function reflectGarage(scene, camera) {
    const mirror = scene.userData.wetMirror;
    if (!mirror) return;
    mirror.wetStrength.value = 0;
    if (state !== 'menu') return;
    const distance = race.cars[0].distance;
    const center = track.point(distance);
    const direction = track.point(distance + .25).sub(center);
    const lateral = track.point(distance, 1).sub(center);
    const normal = lateral.cross(direction).normalize();
    if (normal.y < 0) normal.negate();
    roadPlane.setFromNormalAndCoplanarPoint(normal, center);
    camera.updateMatrixWorld();
    mirrorCamera.copy(camera, false);
    mirrorCamera.position.addScaledVector(normal, -2 * roadPlane.distanceToPoint(camera.position));
    camera.getWorldDirection(mirrorAim).reflect(normal).add(mirrorCamera.position);
    mirrorCamera.up.copy(camera.up).reflect(normal);
    mirrorCamera.lookAt(mirrorAim);
    mirrorCamera.updateMatrixWorld();
    mirror.wetProjection.value.multiplyMatrices(mirrorCamera.projectionMatrix, mirrorCamera.matrixWorldInverse);
    const pavement = scene.userData.wetPavement;
    pavement.visible = false;
    const oldPlanes = renderer.clippingPlanes;
    renderer.clippingPlanes = [roadPlane];
    renderer.setRenderTarget(wetTarget);
    renderer.render(scene, mirrorCamera);
    renderer.setRenderTarget(null);
    renderer.clippingPlanes = oldPlanes;
    pavement.visible = true;
    mirror.wetView.value = wetTarget.texture;
    mirror.wetStrength.value = 1;
  }
  const reflectionFilter = new T.PMREMGenerator(renderer);
  function captureCourseLighting(scene, course) {
    // Cache a probe at driver height. Reflections cost no extra scene pass during play.
    const cube = new T.WebGLCubeRenderTarget(course.id === 'metro' ? 256 : 128, { type: T.HalfFloatType });
    const probe = new T.CubeCamera(.3, 780, cube);
    probe.position.copy(course.point(0, 0, 1.45));
    // Photograph long, luminous facade strips into the metro environment probe.
    // Their high dynamic range produces narrow moving highlights on curved panels.
    const practicals = new T.Group();
    if(course.id === 'metro') {
      const plane = new T.PlaneGeometry(1,1);
      for(const [lane,height,run,length,width,color,power] of [
        [-8,6,2,13,.43,0xc9e8ff,3.6], [8,4,-3,9,.80,0xffcf91,3.0],
        [-5,3,-7,4,.48,0xffead1,3.5], [4,10,1,12,.88,0xa2b5ce,1.15]
      ]) {
        const source = new T.MeshBasicMaterial({color,side:T.DoubleSide});
        source.color.multiplyScalar(power);
        const strip = new T.Mesh(plane,source);
        strip.position.copy(course.point(run,lane,height));
        strip.lookAt(probe.position);
        strip.scale.set(length,width,1);
        practicals.add(strip);
      }
      scene.add(practicals);
    }
    try {
      probe.update(renderer, scene);
      const filtered = reflectionFilter.fromCubemap(cube.texture);
      scene.environment = filtered.texture;
      scene.environmentIntensity = course.id === 'metro' ? 1.18 : .58;
      return filtered;
    } finally {
      practicals.removeFromParent();
      practicals.children[0]?.geometry.dispose();
      practicals.children.forEach(strip => strip.material.dispose());
      cube.dispose();
    }
  }
  function refreshReflections(world, course) {
    const previous = world.reflections;
    const visible = carLayer.visible;
    carLayer.visible = false;
    world.scene.environment = null;
    try {
      world.reflections = captureCourseLighting(world.scene, course);
      previous.dispose();
    } catch (error) {
      world.scene.environment = previous.texture;
      console.warn('Apex Circuit reflection refresh failed', error);
    } finally {
      carLayer.visible = visible;
      if (activeWorld === world) snap = true;
    }
  }
  const carLayer = new T.Group();
  const vehicles = buildCars(carLayer);
  const effects = createEffects(carLayer);
  const garageKey = new T.DirectionalLight(0xffe2c2, 2.1);
  garageKey.position.set(45, 54, 40);
  carLayer.add(garageKey);
  const view = createCamera();
  const audio = createAudio(read(soundKey) !== 'off');
  let track = tracks.find(course => course.id === read(courseKey)) || tracks[0];
  let vehicle = vehicleSpecs.find(spec => spec.id === read(vehicleKey)) || vehicleSpecs[0];
  let race, map, activeWorld;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nodes = Object.fromEntries(['start', 'pause', 'resume', 'retry', 'play-again', 'menu', 'sound', 'rank',
    'lap', 'race-time', 'speed', 'boost-fill', 'boost-value', 'countdown', 'feedback', 'result-rank',
    'result-time', 'result-lap', 'result-best', 'result-course', 'menu-best'].map(id => [id, byId(id)]));
  const measured = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && new URLSearchParams(location.search).has('qa');
  const controls = [...document.querySelectorAll('[data-control]')];
  const keyControls = new Map([['ArrowLeft', 'left'], ['KeyA', 'left'], ['ArrowRight', 'right'], ['KeyD', 'right'],
    ['ArrowDown', 'brake'], ['KeyS', 'brake'], ['Space', 'boost']]);
  const keys = new Set();
  const pointers = new Map();
  const input = { steer: 0, brake: false, boost: false };
  const fixed = 1 / 60;
  let state = 'loading', pausedState = 'racing';
  let best = null;
  let countdown = 3, previousBeat = 0, startFlash = 0;
  let feedbackTime = 0, feedbackPriority = 0, worldTime = 0, signalTime = 0;
  let accumulator = 0, lastFrame = performance.now(), frame = 0;
  let manual = false, snap = true, resizePending = true, visualOnly = false;
  let lastHUD = '', lastMapUpdate = -1, lastStateRendered;
  const projected = new T.Vector3();

  const recordFinish = bindRanking({
    tracks, vehicleSpecs, read, save, canPublish: !measured,
    getCourse: () => track.id,
    getBest: id => id === track.id ? best : readBestLap(id)
  });
  function loadSelection() {
    let nextWorld = worldCache.get(track.id);
    if (!nextWorld) {
      const scene = new T.Scene();
      const environment = buildWorld(scene, track);
      if (innerWidth < 850) environment.sun.shadow.mapSize.set(1024, 1024);
      nextWorld = { scene, ...environment, reflections: captureCourseLighting(scene, track) };
      worldCache.set(track.id, nextWorld);
      const course=track;
      scene.userData.facadeReady?.then(loaded => {
        if (loaded) refreshReflections(nextWorld, course);
      });
    }
    if (activeWorld !== nextWorld) {
      activeWorld = nextWorld;
      activeWorld.scene.add(carLayer);
      activeWorld.sun.shadow.needsUpdate = true;
      renderer.shadowMap.needsUpdate = true;
      map = drawMap(byId('minimap'), track);
    }
    selectVehicle(vehicles, vehicle, roadRoster);
    race = createRace(track, vehicle);
    best = readBestLap(track.id);
    lastMapUpdate = -1;
    lastHUD = '';
    worldTime = 0;
    setText(nodes['result-course'], track.name);
    showMenu(false);
    render(0);
  }
  const garage = bindGarage({
    tracks, vehicleSpecs,
    onCourse(id) {
      if (state !== 'menu') return;
      track = tracks.find(course => course.id === id) || track;
      save(courseKey, track.id);
      loadSelection();
    },
    onVehicle(id) {
      if (state !== 'menu') return;
      vehicle = vehicleSpecs.find(spec => spec.id === id) || vehicle;
      save(vehicleKey, vehicle.id);
      loadSelection();
    }
  });

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
    feedbackPriority = 0;
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
    effects.reset();
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
    effects.reset();
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
      save(lapKey(track.id), best);
    }
    recordFinish(track.id, vehicle.id, race.time, race.bestLap);
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
  function note(message, duration = .94, priority = 0) {
    if (feedbackTime > 0 && priority < feedbackPriority) return;
    feedbackTime = duration;
    feedbackPriority = priority;
    setText(nodes.feedback, message);
  }
  function playEvent(event) {
    audio.signal(event);
    effects.event(event, race.cars[0], motion.matches, track);
    switch (event) {
      case 'drift': note('드리프트 충전 + 터보!', .9); break;
      case 'overtake': note('추월!', .65); break;
      case 'launch': {
        const marker = (race.cars[0].distance % track.length + track.length) % track.length;
        const gap = track.gaps.find(item => marker >= item.start - .8 && marker <= item.end);
        note(gap ? `${gap.drop}m 드롭` : '도약!', .94, 1);
        break;
      }
      case 'land': note('착지!', .58, 1); break;
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
    renderer.info.reset();
    if (resizePending) resize();
    if (!['paused', 'results'].includes(state) && !motion.matches && !visualOnly) worldTime += dt;
    const { waves, lights, scene } = activeWorld;
    waves.value = worldTime;
    const boosting = state === 'racing' && race.boosting;
    document.body.classList.toggle('is-boosting', boosting);
    document.body.classList.toggle('is-drifting', state === 'racing' && race.drifting);
    document.body.classList.toggle('is-drafting', state === 'racing' && race.drafting);
    effects.update(race, state === 'racing' && !visualOnly ? dt : 0, worldTime, motion.matches, state === 'racing', track);
    for (const [i, material] of lights.entries()) {
      const lit = state === 'countdown' && i < previousBeat * 2;
      material.color.set(signalTime > 0 ? 0x30fcc0 : lit ? 0xff622d : 0x4f2f34);
    }
    garageKey.visible = state === 'menu';
    if (garageKey.visible) {
      garageKey.target.position.copy(track.point(race.cars[0].distance));
      garageKey.target.updateMatrixWorld();
      garageKey.position.copy(track.point(race.cars[0].distance + 8, 6, 12));
    }
    race.cars.forEach((car, index) => {
      const visual = vehicles[index];
      const visible = state !== 'menu' || index === 0;
      visual.model.visible = visual.shadow.visible = visible;
      if (visible) driveCar(visual, car, boosting && index === 0, motion.matches ? 0 : worldTime, track);
    });
    if (state !== 'paused' || snap) view.update(track, race, vehicle, state === 'paused' ? pausedState : state, worldTime, dt, motion.matches, snap);
    snap = false;
    audio.drive(race.cars[0].speed, boosting, state === 'racing' || state === 'countdown');
    hud();
    reflectGarage(scene, view.camera);
    renderer.render(scene, view.camera);
    frame++;
    lastStateRendered = state;
    if (measured) {
      projected.copy(vehicles[0].model.position).project(view.camera);
      window.__THREE_GAME_DIAGNOSTICS__ = {
        frame, score: race.progress, complete: race.finished, state, time: race.time, place: race.place,
        course: track.id, vehicle: vehicle.id, model: vehicles[0].roadId || vehicles[0].id,
        grid: vehicles.map(visual => visual.roadId || visual.id),
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
  document.addEventListener('contextmenu', event => {
    if (event.target instanceof Element && event.target.closest('button, #world')) event.preventDefault();
  });
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
  world.addEventListener('webglcontextrestored', () => {
    for (const course of tracks) {
      const cached = worldCache.get(course.id);
      if (cached) refreshReflections(cached, course);
    }
    resizePending = true;
    renderer.shadowMap.needsUpdate = true;
    activeWorld.sun.shadow.needsUpdate = true;
  });

  if (measured) {
    window.__apexQA = {
      get track() { return track; },
      get race() { return race; },
      freeze(value = true) { manual = value; },
      step(frames = 1, snapCamera = false) {
        for (let i = 0; i < frames; i++) tick(fixed);
        if (snapCamera) snap = true;
        render(Math.min(frames, 6) * fixed);
      },
      visualOnly() { visualOnly = true; },
      previewBounds() {
        const player = vehicles[0];
        const model = player.roadBody || player.body;
        const corner = new T.Vector3();
        const bounds = { left: 1, right: 0, top: 1, bottom: 0 };
        model.traverse(piece => {
          if (!piece.isMesh) return;
          const positions = piece.geometry.getAttribute('position');
          for (let index = 0; index < positions.count; index++) {
            corner.fromBufferAttribute(positions, index).applyMatrix4(piece.matrixWorld).project(view.camera);
            const x = (1 + corner.x) / 2;
            const y = (1 - corner.y) / 2;
            bounds.left = Math.min(bounds.left, x);
            bounds.right = Math.max(bounds.right, x);
            bounds.top = Math.min(bounds.top, y);
            bounds.bottom = Math.max(bounds.bottom, y);
          }
        });
        return bounds;
      }
    };
  }
  updateSound();
  garage(vehicle.id, track.id);
  loadSelection();
  requestAnimationFrame(animate);
}

try {
  setup();
} catch (error) {
  console.error('Apex Circuit initialization failed', error);
  document.body.dataset.state = 'error';
  setText(byId('loading-message'), '3D 화면을 열 수 없어요. WebGL 2를 지원하는 브라우저에서 다시 열어 주세요.');
}
