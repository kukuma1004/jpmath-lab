import { sampleDriver } from './bypass.js?v=14';
import * as T from './vendor/three.module.min.js';

const sparkEvents = new Set(['wall', 'bump', 'land', 'drift', 'boost']);
const sparkCount = 72;
const smokeCount = 64;

// Fixed pools keep drift and impact effects bounded on phones.
export function createEffects(scene) {
  const root = new T.Group();
  scene.add(root);
  const dummy = new T.Object3D();
  const sparkMat = new T.MeshBasicMaterial({
    transparent: true, blending: T.AdditiveBlending, depthWrite: false
  });
  const impactColor = new T.Color(0xffd56d);
  const jetColor = new T.Color();
  const sparks = new T.InstancedMesh(new T.SphereGeometry(1, 4, 3), sparkMat, sparkCount);
  sparks.renderOrder = 4;
  const flat = new T.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const rubber = new T.MeshBasicMaterial({ color: 0x15141b, transparent: true, opacity: .33, depthWrite: false });
  const skid = new T.InstancedMesh(flat, rubber, 180);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 1, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(222,213,200,.5)');
  gradient.addColorStop(1, 'rgba(222,213,200,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  const haze = new T.MeshBasicMaterial({
    map: new T.CanvasTexture(canvas), transparent: true, depthWrite: false
  });
  const smoke = new T.InstancedMesh(flat, haze, smokeCount);
  root.add(sparks, skid, smoke);
  const pools = [sparks, skid, smoke];
  for (const mesh of pools) {
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
  }
  const particles = Array.from({ length: sparkCount }, () => ({ life: 0, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 }));
  const clouds = Array.from({ length: smokeCount }, () => ({ life: 0, x: 0, y: 0, z: 0 }));
  let sparkIndex = 0, trailIndex = 0, cloudIndex = 0, timer = 0, jetTimer = 0;
  const p = {};
  function event(name, car, reduced, track, boostColor) {
    if (reduced || !sparkEvents.has(name)) return;
    sampleDriver(track, car, car.distance, p);
    const x = p.x - p.dz * car.lane;
    const z = p.z + p.dx * car.lane;
    const thrust = name === 'boost';
    const amount = thrust ? 9 : name === 'land' ? 24 : 16;
    if (thrust) jetColor.setHex(boostColor).lerp(impactColor, .12);
    for (let i = 0; i < amount; i++) {
      const index = sparkIndex++ % sparkCount;
      const particle = particles[index];
      const angle = i * 2.399;
      const side = i % 2 ? -.57 : .57;
      const rear = thrust ? 2.5 + (i % 4) * .19 : 0;
      Object.assign(particle, {
        life: (thrust ? .22 : .32) + (i % 4) * .07,
        x: x - p.dx * rear - (thrust ? p.dz * side : 0),
        y: p.y + p.bank * car.lane + .48 + car.air,
        z: z - p.dz * rear + (thrust ? p.dx * side : 0),
        vx: Math.sin(angle) * (thrust ? 1.9 : 7) - p.dx * (thrust ? 14 : 8),
        vy: thrust ? .8 + (i % 5) * .28 : 2 + (i % 5),
        vz: Math.cos(angle) * (thrust ? 1.9 : 7) - p.dz * (thrust ? 14 : 8),
        heading: thrust ? Math.atan2(p.dx, p.dz) : null
      });
      sparks.setColorAt(index, thrust ? jetColor : impactColor);
    }
    sparks.instanceColor.needsUpdate = true;
  }
  function update(race, dt, time, reduced, active, track, boostColor) {
    root.visible = active && !reduced;
    if (!root.visible) return;
    const car = race.cars[0];
    jetTimer = Math.max(0, jetTimer - dt);
    if (race.boosting && jetTimer === 0 && dt > 0) {
      event('boost', car, reduced, track, boostColor);
      jetTimer = .086;
    }
    timer += dt;
    if (timer > .032) {
      timer = 0;
      for (const driver of race.cars) {
        if (driver.air >= .25 || driver.speed < 18) continue;
        sampleDriver(track, driver, driver.distance - 1.5, p);
        const sliding = driver === car
          ? race.drifting || Math.abs(driver.slip) > .23
          : Math.abs(p.curve) * driver.speed * driver.speed > 29;
        if (!sliding) continue;
        for (const side of [-1, 1]) {
          const lane = driver.lane + side * .94;
          const x = p.x - p.dz * lane;
          const z = p.z + p.dx * lane;
          const surface = p.y + p.bank * lane;
          dummy.position.set(x, surface + .038, z);
          dummy.rotation.set(-Math.atan(p.slope), Math.atan2(p.dx, p.dz) - driver.slip, Math.atan(-p.bank), 'YXZ');
          dummy.scale.set(.18, 1, driver.speed * .047);
          dummy.updateMatrix();
          skid.setMatrixAt(trailIndex++ % skid.count, dummy.matrix);
          if (driver === car || side === Math.sign(p.curve)) {
            Object.assign(clouds[cloudIndex++ % smokeCount], { life: 1, x, y: surface + .24, z });
          }
        }
        skid.instanceMatrix.needsUpdate = true;
      }
    }
    particles.forEach((particle, i) => {
      if (particle.life <= 0) return;
      particle.life = Math.max(0, particle.life - dt);
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.z += particle.vz * dt;
      particle.vy -= 14 * dt;
      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.rotation.set(0, particle.heading ?? time * 3 + i, 0);
      dummy.scale.set(particle.life * .12, particle.life * .12, particle.life * (particle.heading === null ? .65 : 1.8));
      dummy.updateMatrix();
      sparks.setMatrixAt(i, dummy.matrix);
    });
    clouds.forEach((cloud, i) => {
      if (cloud.life <= 0) return;
      cloud.life = Math.max(0, cloud.life - dt * 1.6);
      cloud.y += dt * .35;
      const size = cloud.life > 0 ? (1 - cloud.life) * 2 + .4 : 0;
      dummy.position.set(cloud.x, cloud.y, cloud.z);
      dummy.rotation.set(0, i, 0);
      dummy.scale.set(size, cloud.life, size);
      dummy.updateMatrix();
      smoke.setMatrixAt(i, dummy.matrix);
    });
    sparks.instanceMatrix.needsUpdate = true;
    smoke.instanceMatrix.needsUpdate = true;
  }
  function reset() {
    for (const particle of particles) particle.life = 0;
    for (const cloud of clouds) cloud.life = 0;
    sparkIndex = trailIndex = cloudIndex = timer = jetTimer = 0;
    dummy.position.set(0, 0, 0);
    dummy.scale.setScalar(0);
    dummy.updateMatrix();
    for (const mesh of pools) {
      for (let i = 0; i < mesh.count; i++) mesh.setMatrixAt(i, dummy.matrix);
      mesh.instanceMatrix.needsUpdate = true;
    }
  }
  reset();
  return { event, update, reset };
}

export function createBoostStreaks(canvas) {
  const ctx = canvas.getContext('2d');
  // Repeatable streaks follow the periphery, leaving the center and next turn clear.
  const rays = Array.from({ length: 23 }, (_, i) => {
    const angle = i * 2.399963;
    return {
      x: Math.cos(angle), y: Math.sin(angle), start: (i * .618) % 1,
      speed: 1.36 + (i % 5) * .17, length: .09 + (i % 4) * .025
    };
  });
  let time = 0, impact = 0, visible = false;
  return {
    get active() { return visible; },
    resize(width, height) {
      canvas.width = Math.max(1, Math.round(width * .70));
      canvas.height = Math.max(1, Math.round(height * .70));
    },
    update(boosting, dt, reduced) {
      if (!ctx) return;
      if (!boosting || reduced) {
        if (visible) ctx.clearRect(0, 0, canvas.width, canvas.height);
        time = impact = 0;
        visible = false;
        return;
      }
      const { width, height } = canvas;
      if (!visible) impact = 1;
      visible = true;
      time += dt;
      impact *= Math.exp(-dt * 10);
      const cx = width * .5, cy = height * .43;
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';
      for (const ray of rays) {
        const progress = (ray.start + time * ray.speed) % 1;
        const distance = .53 + progress * .58;
        const length = ray.length * (.72 + progress * .9 + impact * .50);
        const dx = ray.x * width * .64, dy = ray.y * height * .65;
        ctx.strokeStyle = '#e8f8ff';
        ctx.globalAlpha = Math.sin(progress * Math.PI) * (.50 + impact * .29);
        ctx.lineWidth = .75 + progress * 1.1 + impact * .42;
        ctx.beginPath();
        ctx.moveTo(cx + dx * distance, cy + dy * distance);
        ctx.lineTo(cx + dx * (distance + length), cy + dy * (distance + length));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  };
}
