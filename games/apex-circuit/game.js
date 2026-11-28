import { sampleDriver } from './bypass.js?v=14';
import * as T from './vendor/three.module.min.js';
import { tracks, courseRecordId, rankedTrack } from './track.js?v=19';
import { createRace, vehicleSpecs } from './race.js?v=19';
import { buildWorld } from './world.js?v=19';
import { buildCars, driveCar, selectVehicle } from './cars.js?v=20';
import { drivingKeys, resolveDrivingKey } from './input.js?v=10';
import { createAudio } from './audio.js?v=20';
import { createEffects, createBoostStreaks } from './effects.js?v=20';
import { bindGarage } from './garage.js?v=21';
import { bindRanking, formatTime } from './ranking.js?v=19';
import { officialEvent } from './official-event.js?v=19';
import { bindOfficialRanking } from './official-ranking.js?v=19';

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
  return recordLapKey(courseRecordId(courseId));
}
function recordLapKey(id) {
  return id === tracks[0].id ? recordKey : `${recordKey}:${id}`;
}
function readBestLap(courseId) {
  return readBestRecord(courseRecordId(courseId));
}
function readBestRecord(id) {
  const best = Number(read(recordLapKey(id)));
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
    for (const route of track.shortcuts) {
      ctx.beginPath();
      for (let i=0;i<=32;i++) {
        const p=route.sample(route.length*i/32);
        if(i) ctx.lineTo(x(p.x),y(p.z)); else ctx.moveTo(x(p.x),y(p.z));
      }
      ctx.strokeStyle='#ffcd68'; ctx.lineWidth=1.8; ctx.setLineDash([3,2]); ctx.stroke(); ctx.setLineDash([]);
    }
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
      const p = sampleDriver(track, car, car.distance);
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
  const subject = new T.Vector3(), screenSubject = new T.Vector3(), cameraDelta = new T.Vector3();
  const p = {}, preview = {}, trailing = {};
  const shortGarage = window.matchMedia('(max-height: 620px) and (orientation: landscape)');
  const tallGarage = window.matchMedia('(min-height: 700px)');
  let ready = false;
  function update(track, race, vehicle, state, animateTime, dt, reduced, snap = false, player = race.cars[0]) {
    const portrait = camera.aspect < .95;
    const isMenu = state === 'menu';
    sampleDriver(track, player, player.distance, p);
    let fov;
    if (isMenu) {
      const drift = reduced ? 0 : Math.sin(animateTime * .35) * .62;
      const roadCar = vehicle.cosmetic;
      let ahead = roadCar ? 6.2 : 8.4;
      let flank = roadCar ? 6.65 : 6.4;
      let height = roadCar ? 3.15 : 3.8;
      let offset = roadCar ? 1.75 : 3.06;
      let aimHeight = roadCar ? .77 : .37;
      fov = roadCar ? 44 : 46;
      if (portrait) {
        const roomy = tallGarage.matches;
        ahead = roadCar ? (roomy ? 9.35 : 10.65) : 9.5;
        flank = roadCar ? 7.4 : 6.75;
        height = roadCar ? 4.6 : 4.2;
        offset = .10;
        aimHeight = roomy ? -1.55 : (roadCar ? -2.92 : -2.7);
        fov = 49;
      } else if (shortGarage.matches) {
        if (roadCar) {
          ahead = 7.65;
          flank = 7.5;
        }
        offset = 3.8;
        aimHeight = -1.10;
      }
      flank += drift;
      desired.set(p.x + p.dx * ahead - p.dz * flank, p.y + height,
        p.z + p.dz * ahead + p.dx * flank);
      const rightX = desired.z - p.z;
      const rightZ = p.x - desired.x;
      const scale = offset / Math.hypot(rightX, rightZ);
      aim.set(p.x - rightX * scale, p.y + aimHeight, p.z - rightZ * scale);
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
      const follow = portrait ? 9.6 : 7.7;
      const shoulder = portrait ? .15 : .32;
      const height = portrait ? 4.25 : 2.95;
      const laneFollow = player.lane * (portrait ? 1 : .8);
      const carY = p.y + p.bank * laneFollow + player.air;
      sampleDriver(track, player, player.distance - follow*(player.shortcut?.ratio || 1), trailing);
      sampleDriver(track, player, player.distance + T.MathUtils.lerp(9, 19, dropView)*(player.shortcut?.ratio || 1), preview);
      desired.set(trailing.x - trailing.dz * (laneFollow - shoulder), Math.max(carY + height, trailing.y + 2.65),
        trailing.z + trailing.dx * (laneFollow - shoulder));
      const upcoming = T.MathUtils.clamp(preview.y + .95, carY - 5.6, carY + 9);
      const thrustFraming = !reduced && state === 'racing' && race.boosting ? (portrait ? .58 : .80) : 0;
      const aimY = T.MathUtils.lerp(upcoming + (portrait ? .32 : .55) - thrustFraming,
        carY - height * .68, dropView);
      // A narrow portrait frustum needs a closer subject anchor in hairpins.
      // Keep the same camera distance/FOV; reduce only the horizontal lookahead.
      const lookahead = portrait ? .45 : 1;
      aim.set(T.MathUtils.lerp(p.x, preview.x, lookahead) - p.dz * laneFollow, aimY,
        T.MathUtils.lerp(p.z, preview.z, lookahead) + p.dx * laneFollow);
      fov = portrait ? 54 : 49;
    }
    const blend = snap || !ready ? 1 : 1 - Math.exp(-(isMenu ? 3.6 : 14.2) * dt);
    if (!isMenu && ready && !snap) {
      cameraDelta.copy(desired).sub(camera.position).multiplyScalar(blend)
        .clampLength(0, Math.max(.12, player.speed * dt * 2 + .08));
      camera.position.add(cameraDelta);
    } else camera.position.lerp(desired, blend);
    target.lerp(aim, blend);
    camera.lookAt(target);
    if (!isMenu) {
      // Keep the close chase view safe through tight bends and branch merges.
      // Correct the aim, never the field of view or the player's steering.
      subject.set(p.x - p.dz * player.lane, p.y + p.bank * player.lane + player.air + .55,
        p.z + p.dx * player.lane);
      for (let guard = 0; guard < 4; guard++) {
        camera.updateMatrixWorld();
        screenSubject.copy(subject).project(camera);
        if (Math.abs(screenSubject.x) < (portrait ? .62 : .78) &&
            screenSubject.y > -.60 && screenSubject.y < .72) break;
        target.lerp(subject, .5);
        camera.lookAt(target);
      }
    }
    if (!isMenu && !reduced) {
      camera.rotateZ(-player.slip * .025);
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
  const worldCacheLimit = innerWidth < 850 || matchMedia('(pointer: coarse)').matches ? 1 : 2;
  // Keep course switching quick without retaining all seven worlds on tablets.
  function resources(scene) {
    const geometries = new Set(), materials = new Set(), textures = new Set();
    scene.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      const list = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
      for (const material of list) {
        materials.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
        for (const uniform of Object.values(material.uniforms || {})) if (uniform.value?.isTexture) textures.add(uniform.value);
      }
    });
    return {geometries, materials, textures};
  }
  function trimWorldCache() {
    while (worldCache.size > worldCacheLimit) {
      const [id, retired] = worldCache.entries().next().value;
      worldCache.delete(id);
      const keep = {geometries: new Set(), materials: new Set(), textures: new Set()};
      for (const cached of worldCache.values()) {
        const used = resources(cached.scene);
        for (const kind of Object.keys(keep)) for (const item of used[kind]) keep[kind].add(item);
      }
      const unused = resources(retired.scene);
      for (const kind of Object.keys(keep)) for (const item of unused[kind]) {
        if (!keep[kind].has(item) && !item.isRenderTargetTexture) item.dispose();
      }
      retired.reflections.dispose();
      retired.sun.shadow.map?.dispose();
      retired.sun.shadow.mapPass?.dispose();
      renderer.renderLists.dispose();
    }
  }
  const wetTarget = new T.WebGLRenderTarget(560, 350, {type:T.HalfFloatType});
  const mirrorCamera = new T.PerspectiveCamera();
  const roadPlane = new T.Plane();
  const mirrorAim = new T.Vector3();
  const mirrorCenter = new T.Vector3();
  const mirrorTangent = new T.Vector3();
  const mirrorNormal = new T.Vector3();
  const mirrorSample = {};
  const reflectedSky = new T.Color(0x202c49);
  let lastMirror = -Infinity;
  function reflectRoad(scene, camera, player, refresh) {
    const mirror = scene.userData.wetMirror;
    if (!mirror) return;
    const now = performance.now();
    const mirrorInterval = state === 'menu' ? 100 : renderScale < 1 ? 220 : 140;
    if (!refresh && mirror.wetView.value && now - lastMirror < mirrorInterval) return;
    lastMirror = now;
    const p = sampleDriver(track, player, player.distance, mirrorSample);
    mirrorCenter.set(p.x, p.y, p.z);
    mirrorTangent.set(p.dx, p.slope, p.dz);
    const normal = mirrorNormal.set(-p.dz, p.bank, p.dx).cross(mirrorTangent).normalize();
    if (normal.y < 0) normal.negate();
    roadPlane.setFromNormalAndCoplanarPoint(normal, mirrorCenter);
    camera.updateMatrixWorld();
    mirrorCamera.copy(camera, false);
    mirrorCamera.layers.set(1);
    mirrorCamera.zoom *= .88;
    mirrorCamera.far = 155;
    mirrorCamera.updateProjectionMatrix();
    mirrorCamera.position.addScaledVector(normal, -2 * roadPlane.distanceToPoint(camera.position));
    camera.getWorldDirection(mirrorAim).reflect(normal).add(mirrorCamera.position);
    mirrorCamera.up.copy(camera.up).reflect(normal);
    mirrorCamera.lookAt(mirrorAim);
    mirrorCamera.updateMatrixWorld();
    mirror.wetProjection.value.multiplyMatrices(mirrorCamera.projectionMatrix, mirrorCamera.matrixWorldInverse);
    // The showroom mirror includes the hero. In a race the road only needs
    // broad building silhouettes and lights.
    showroomReflection(state === 'menu');
    const oldPlanes = renderer.clippingPlanes;
    const oldTarget = renderer.getRenderTarget();
    const oldBackground = scene.background;
    const updateShadows = renderer.shadowMap.needsUpdate;
    try {
      scene.background = reflectedSky;
      renderer.shadowMap.needsUpdate = false;
      renderer.clippingPlanes = [roadPlane];
      renderer.setRenderTarget(wetTarget);
      renderer.render(scene, mirrorCamera);
    } finally {
      renderer.setRenderTarget(oldTarget);
      renderer.clippingPlanes = oldPlanes;
      renderer.shadowMap.needsUpdate = updateShadows;
      scene.background = oldBackground;
    }
    mirror.wetView.value = wetTarget.texture;
    mirror.wetStrength.value = state === 'menu' ? 1 : .72;
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
      // The curved roof and rear glass see high floors above the street lamps.
      // Borrow the same office atlas that is already resident for the skyline.
      const windows = scene.userData.officeGlazing;
      if (windows?.image) {
        for (const [run,lane,height,width,rise,tint] of [
          [-9,-7,9,14,16,0xffdec3], [6,8,11,10,19,0xc4d9ff],
          [10,-6,13,8,12,0xffe8d8], [-12,5,8,8,11,0xc8dcff]
        ]) {
          const source = new T.MeshBasicMaterial({map:windows,color:tint,side:T.DoubleSide});
          source.color.multiplyScalar(3.4);
          const wall = new T.Mesh(plane,source);
          wall.position.copy(course.point(run,lane,height));
          wall.lookAt(probe.position.x,wall.position.y,probe.position.z);
          wall.scale.set(width,rise,1);
          practicals.add(wall);
        }
      }
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
  const boostStreaks = createBoostStreaks(byId('boost-streaks'));
  const garageKey = new T.DirectionalLight(0xffe2c2, 2.1);
  garageKey.position.set(45, 54, 40);
  carLayer.add(garageKey);
  const view = createCamera();
  const audio = createAudio(read(soundKey) !== 'off');
  let track = tracks.find(course => course.id === read(courseKey)) || tracks[0];
  let vehicle = vehicleSpecs.find(spec => spec.id === read(vehicleKey)) || vehicleSpecs[0];
  let race, map, activeWorld;
  let garageSelection, officialName, runNumber = 0;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nodes = Object.fromEntries(['start', 'pause', 'resume', 'retry', 'play-again', 'menu', 'sound', 'rank',
    'lap', 'race-time', 'speed', 'boost-fill', 'boost-value', 'countdown', 'feedback', 'result-rank',
    'result-time', 'result-lap', 'result-best', 'result-course', 'menu-best'].map(id => [id, byId(id)]));
  const measured = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && new URLSearchParams(location.search).has('qa');
  const controls = [...document.querySelectorAll('[data-control]')];
  const keyControls = drivingKeys;
  const keys = new Set();
  const pointers = new Map();
  const input = { steer: 0, brake: false, boost: false };
  const fixed = 1 / 60;
  const poseFields = ['distance', 'lane', 'air', 'pitch', 'slip', 'speed'];
  const previousPoses = vehicles.map(() => ({}));
  const screenPoses = vehicles.map(() => ({}));
  let renderScale = 1, slowTime = 0, steadyTime = 0, resolutionPending = false;
  let state = 'loading', pausedState = 'racing';
  let best = null;
  let countdown = 3, previousBeat = 0, startFlash = 0;
  let feedbackTime = 0, feedbackPriority = 0, worldTime = 0, signalTime = 0;
  let accumulator = 0, lastFrame = performance.now(), frame = 0;
  let manual = false, snap = true, resizePending = true, visualOnly = false;
  let lastHUD = '', lastMapUpdate = -1, lastStateRendered;
  const projected = new T.Vector3();
  const boostLabel = byId('boost-label');

  function showroomReflection(enabled) {
    vehicles[0].model.traverse(object => {
      if (enabled) object.layers.enable(1);
      else object.layers.disable(1);
    });
  }

  function rememberPoses() {
    race.cars.forEach((car, index) => {
      const previous = previousPoses[index];
      for (const field of poseFields) previous[field] = car[field];
      previous.shortcut = car.shortcut;
      previous.shortcutBase = car.shortcutBase;
    });
  }

  function screenPose(car, index, fraction) {
    if (fraction === 1) return car;
    const previous = previousPoses[index], pose = screenPoses[index];
    for (const field of poseFields) pose[field] = T.MathUtils.lerp(previous[field], car[field], fraction);
    pose.flight = car.flight;
    // Both sides of the gate share the shortcut's lateral origin while
    // interpolating across it. Race progress stays in the simulation.
    pose.shortcut = car.shortcut || previous.shortcut;
    pose.shortcutBase = car.shortcut ? car.shortcutBase : previous.shortcutBase;
    if (car.shortcut !== previous.shortcut) {
      const offset = pose.shortcut.entryLane;
      pose.lane -= offset * (car.shortcut ? 1 - fraction : fraction);
    }
    return pose;
  }

  const recordFinish = bindRanking({
    tracks, vehicleSpecs, read, save, canPublish: !measured,
    getCourse: () => track.id,
    getBest: id => id === courseRecordId(track.id) ? best : readBestRecord(id)
  });
  const recordOfficial = bindOfficialRanking({
    read, save, canPublish: !measured,
    onStart(name) {
      if (!track.official) garageSelection = { track, vehicle };
      officialName = name;
      track = rankedTrack;
      vehicle = vehicleSpecs.find(spec => spec.id === officialEvent.vehicle);
      if (!race || document.body.dataset.mode !== 'official') loadSelection();
      start();
    }
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
      scene.userData.assetsReady?.then(loaded => {
        if (loaded && worldCache.get(course.id) === nextWorld) refreshReflections(nextWorld, course);
      });
    }
    // Touch an existing entry so eviction follows the user's recent selections.
    worldCache.delete(track.id);
    worldCache.set(track.id, nextWorld);
    if (activeWorld !== nextWorld) {
      activeWorld = nextWorld;
      activeWorld.scene.add(carLayer);
      activeWorld.sun.shadow.needsUpdate = true;
      renderer.shadowMap.needsUpdate = true;
      map = drawMap(byId('minimap'), track);
    }
    trimWorldCache();
    selectVehicle(vehicles, vehicle, roadRoster);
    audio.select(vehicle);
    document.body.style.setProperty('--thrust', '#' + vehicle.boostColor.toString(16).padStart(6, '0'));
    race = createRace(track, vehicle);
    document.body.dataset.mode = track.official ? 'official' : 'arcade';
    setText(byId('lap-count'), `/ ${race.laps}`);
    rememberPoses();
    best = readBestLap(track.id);
    lastMapUpdate = -1;
    lastHUD = '';
    worldTime = 0;
    setText(nodes['result-course'], track.name);
    showMenu();
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
    const cap = width < 850 ? 1.45 : 1.65;
    const pixelRatio = Math.min(devicePixelRatio || 1, cap, Math.sqrt(3300000 / Math.max(width * height, 1)));
    // setPixelRatio also resizes the drawing buffer using the current size.
    const targetRatio = pixelRatio * renderScale;
    if (renderer.getPixelRatio() !== targetRatio) renderer.setPixelRatio(targetRatio);
    if (resizePending) {
      renderer.setSize(width, height, false);
      boostStreaks.resize(width, height);
    }
    view.camera.aspect = width / Math.max(height, 1);
    view.camera.updateProjectionMatrix();
    if (resizePending) snap = true;
    resizePending = resolutionPending = false;
  }

  function adjustResolution(dt) {
    if (state !== 'racing') {
      slowTime = steadyTime = 0;
      return;
    }
    slowTime = dt > .022 ? slowTime + dt : Math.max(0, slowTime - dt * .6);
    steadyTime = dt < .0185 ? steadyTime + dt : 0;
    if (slowTime > .65 && renderScale > .72) {
      renderScale = Math.max(.72, renderScale - .14);
    } else if (steadyTime > 7 && renderScale < 1) {
      renderScale = Math.min(1, renderScale + .14);
    } else return;
    slowTime = steadyTime = 0;
    resolutionPending = true;
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
  function focusDriving() {
    world.focus({ preventScroll: true });
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
    if (!['countdown', 'racing'].includes(next)) audio.drive();
  }
  function showMenu() {
    race.reset();
    effects.reset();
    clearControls();
    clearMessage();
    setText(nodes['menu-best'], formatTime(best));
    setText(nodes.countdown, '');
    signalTime = 0;
    snap = true;
    change('menu');
  }
  function start() {
    runNumber++;
    audio.unlock();
    race.reset();
    rememberPoses();
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
    focusDriving();
  }
  function openGarage() {
    if (!['paused', 'results'].includes(state)) return;
    if (track.official) {
      ({ track, vehicle } = garageSelection);
      garageSelection = null;
      loadSelection();
      byId('official-ranking-open').focus({ preventScroll: true });
      return;
    }
    showMenu();
    garage.focus();
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
    focusDriving();
  }
  function finish() {
    const official = track.official === true;
    const message = byId('official-result-message');
    message.hidden = byId('official-result-board').hidden = !official;
    byId('result-ranking').hidden = official;
    setText(byId('result-best-label'), official ? '내 최고 완주' : '내 최고 랩');
    if (official) {
      const finishedRun = runNumber;
      setText(message, '완주 기록 확인 중…');
      setText(nodes['result-best'], '—');
      recordOfficial(race, officialName, (status, record) => {
        if (runNumber !== finishedRun || state !== 'results' || !track.official) return;
        setText(message, status);
        setText(nodes['result-best'], formatTime(record ? record.time / 100 : null));
      });
    } else {
      if (race.bestLap !== null && (best === null || race.bestLap < best)) {
        best = race.bestLap;
        save(lapKey(track.id), best);
      }
      recordFinish(track.id, vehicle.id, race.time, race.bestLap);
      setText(nodes['result-best'], formatTime(best));
    }
    setText(nodes['result-rank'], race.place);
    setText(nodes['result-time'], formatTime(race.time));
    setText(nodes['result-lap'], formatTime(race.bestLap));
    change('results');
    nodes.menu.focus({ preventScroll: true });
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
    if (event !== 'boost') effects.event(event, race.cars[0], motion.matches, track, vehicle.boostColor);
    switch (event) {
      case 'shortcut': note(race.cars[0].shortcut?.name || '지름길 진입', 1.2); break;
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
      rememberPoses();
      race.step(dt, input);
      for (const event of race.events) playEvent(event);
    }
  }
  function hud() {
    if (!['racing', 'countdown', 'paused'].includes(state)) return;
    const speed = Math.round(race.cars[0].speed * 3.6);
    const percent = Math.round(race.boost * 100);
    const display = [race.place, race.lap, formatTime(race.time), speed, percent];
    setText(boostLabel, race.drifting ? (percent < 100 ? '드리프트 충전' : '충전 완료') : '부스터');
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
  function render(dt, fraction = 1) {
    renderer.info.reset();
    if (resizePending || resolutionPending) resize();
    if (!['paused', 'results'].includes(state) && !motion.matches && !visualOnly) worldTime += dt;
    const { waves, lights, scene } = activeWorld;
    waves.value = worldTime;
    scene.userData.moveCabins?.forEach(move => move());
    const boosting = state === 'racing' && race.boosting;
    document.body.classList.toggle('is-boosting', boosting);
    document.body.classList.toggle('is-drifting', state === 'racing' && race.drifting);
    document.body.classList.toggle('is-drafting', state === 'racing' && race.drafting);
    effects.update(race, state === 'racing' && !visualOnly ? dt : 0, worldTime, motion.matches, state === 'racing', track, vehicle.boostColor);
    boostStreaks.update(boosting, visualOnly ? 0 : dt, motion.matches);
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
    if (state !== 'racing') fraction = 1;
    const player = screenPose(race.cars[0], 0, fraction);
    vehicles.forEach((visual, index) => {
      const car = race.cars[index];
      const visible = !!car && (state !== 'menu' || index === 0);
      visual.model.visible = visual.shadow.visible = visible;
      if (visible) driveCar(visual, index === 0 ? player : screenPose(car, index, fraction),
        index === 0 ? boosting : state === 'racing' && car.boosting, motion.matches ? 0 : worldTime, track);
    });
    if (state !== 'paused' || snap) view.update(track, race, vehicle, state === 'paused' ? pausedState : state, worldTime, dt, motion.matches, snap, player);
    reflectRoad(scene, view.camera, player, snap || state !== lastStateRendered);
    snap = false;
    audio.drive(player.speed, {
      boosting, drifting: state === 'racing' && race.drifting, airborne: player.air > .18,
      running: state === 'racing' || state === 'countdown'
    });
    hud();
    const mirrorCalls = renderer.info.render.calls;
    const mirrorTriangles = renderer.info.render.triangles;
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
        playerExhaust: { visible: vehicles[0].jets.visible, style: vehicles[0].boostProfile.style, meshes: vehicles[0].jets.children.length },
        boostStreaks: boostStreaks.active,
        projected: { x: (1 + projected.x) * .5, y: (1 - projected.y) * .5 },
        camera: { fov: view.camera.fov, position: view.camera.position.toArray() },
        grounded: { modelY: vehicles[0].model.position.y, shadowOffset: vehicles[0].shadow.position.distanceTo(vehicles[0].model.position),
          rivalExhaust: vehicles.slice(1).map(v => ({visible: v.jets.visible, meshes: v.jets.children.length})) },
        render: { ...renderer.info.render }, memory: { ...renderer.info.memory },
        presentation: { distance: player.distance, scale: renderScale, mirrorCalls, mirrorTriangles },
      };
    }
  }
  function animate(now) {
    const dt = Math.max(0, Math.min(.12, (now - lastFrame) / 1000));
    lastFrame = now;
    if (!manual) {
      adjustResolution(dt);
      accumulator = Math.min(.12, accumulator + dt);
      while (accumulator >= fixed) {
        tick(fixed);
        accumulator -= fixed;
      }
      const rests = state === 'paused' || state === 'results' || (state === 'menu' && motion.matches);
      if (!rests || resizePending || lastStateRendered !== state) render(dt, accumulator / fixed);
    }
    requestAnimationFrame(animate);
  }

  nodes.start.addEventListener('click', start);
  byId('garage-help').addEventListener('click', () => byId('driving-help').showModal());
  nodes.pause.addEventListener('click', pause);
  nodes.resume.addEventListener('click', resume);
  nodes.retry.addEventListener('click', start);
  nodes['play-again'].addEventListener('click', start);
  nodes.menu.addEventListener('click', openGarage);
  byId('pause-menu').addEventListener('click', openGarage);
  nodes.sound.addEventListener('click', () => {
    audio.setEnabled(!audio.enabled);
    save(soundKey, audio.enabled ? 'on' : 'off');
    updateSound();
  });
  for (const button of controls) {
    button.addEventListener('pointerdown', event => {
      if (!['racing', 'countdown'].includes(state) || event.button !== 0) return;
      event.preventDefault();
      focusDriving();
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
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    const code = resolveDrivingKey(event);
    if (code === 'Space' && event.repeat && ['paused', 'results'].includes(state)) {
      event.preventDefault();
      return;
    }
    if (code === 'Escape' && !event.repeat && state === 'results' && !document.querySelector('dialog[open]')) {
      event.preventDefault();
      openGarage();
      return;
    }
    if (['KeyP', 'Escape'].includes(code) && !event.repeat) {
      if (!['racing', 'countdown', 'paused'].includes(state)) return;
      event.preventDefault();
      if (state === 'paused') resume();
      else pause();
      return;
    }
    if (!['racing', 'countdown'].includes(state) || !keyControls.has(code)) return;
    event.preventDefault();
    keys.add(code);
    updateControls();
  });
  window.addEventListener('keyup', event => {
    const code = resolveDrivingKey(event);
    let changed = keys.delete(code);
    if (code === 'ShiftLeft' && !keyControls.has(event.code)) changed = keys.delete('ShiftRight') || changed;
    if (changed) {
      if (code === 'Space' && ['paused', 'results'].includes(state)) event.preventDefault();
      updateControls();
    }
  });
  world.addEventListener('pointerdown', () => {
    if (['racing', 'countdown'].includes(state)) focusDriving();
  });
  // Cancel native two-finger zoom without cancelling the independent pointer controls.
  const stopPinch = event => {
    if (['racing', 'countdown'].includes(state) && (event.type.startsWith('gesture') || event.touches?.length > 1)) event.preventDefault();
  };
  for (const name of ['touchstart', 'touchmove', 'gesturestart', 'gesturechange'])
    document.addEventListener(name, stopPinch, {passive: false});
  document.addEventListener('wheel', event => {
    if (event.ctrlKey && ['racing', 'countdown'].includes(state)) event.preventDefault();
  }, {passive: false});
  window.addEventListener('blur', clearControls);
  window.addEventListener('resize', () => { resizePending = true; });
  new ResizeObserver(() => { resizePending = true; }).observe(world);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
  });
  world.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    pause();
  });
  world.addEventListener('webglcontextrestored', () => {
    for (const course of [...tracks, rankedTrack]) {
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
      ready() { return activeWorld.scene.userData.assetsReady || Promise.resolve(); },
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
  garage.select(vehicle.id, track.id);
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
