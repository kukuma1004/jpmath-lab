import * as T from './vendor/three.module.min.js';
import { track } from './track.js';

const sparkEvents = new Set(['wall', 'bump', 'land', 'drift', 'boost']);
const sparkCount = 72;
const smokeCount = 64;

// Fixed pools keep drift and impact effects bounded on phones.
export function createEffects(scene) {
  const root = new T.Group();
  scene.add(root);
  const dummy = new T.Object3D();
  const sparkMat = new T.MeshBasicMaterial({
    color: 0xffd56d, transparent: true, blending: T.AdditiveBlending, depthWrite: false
  });
  const sparks = new T.InstancedMesh(new T.SphereGeometry(1, 4, 3), sparkMat, sparkCount);
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
  let sparkIndex = 0, trailIndex = 0, cloudIndex = 0, timer = 0;
  const p = {};
  function event(name, car, reduced) {
    if (reduced || !sparkEvents.has(name)) return;
    track.sample(car.distance, p);
    const x = p.x - p.dz * car.lane;
    const z = p.z + p.dx * car.lane;
    const amount = name === 'land' ? 24 : 16;
    for (let i = 0; i < amount; i++) {
      const particle = particles[sparkIndex++ % sparkCount];
      const angle = i * 2.399;
      Object.assign(particle, {
        life: .32 + (i % 4) * .08, x, y: p.y + .45 + car.air, z,
        vx: Math.sin(angle) * 7 - p.dx * 8,
        vy: 2 + (i % 5),
        vz: Math.cos(angle) * 7 - p.dz * 8
      });
    }
  }
  function update(race, dt, time, reduced, active) {
    root.visible = active && !reduced;
    if (!root.visible) return;
    const car = race.cars[0];
    timer += dt;
    if (timer > .032) {
      timer = 0;
      for (const driver of race.cars) {
        if (driver.air >= .25 || driver.speed < 18) continue;
        track.sample(driver.distance - 1.5, p);
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
      dummy.rotation.set(0, time * 3 + i, 0);
      dummy.scale.set(particle.life * .12, particle.life * .12, particle.life * .65);
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
    sparkIndex = trailIndex = cloudIndex = timer = 0;
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
