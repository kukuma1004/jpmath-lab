import type { BallState } from './types';
import type { PhysicsConfig } from './config';

/** Cloth contact r=(0,-R,0): slip = v + omega × r. */
export function clothSlip(ball: BallState, radius: number): { x: number; z: number } {
  return { x: ball.velocity.x + radius * ball.angularVelocity.z,
    z: ball.velocity.z - radius * ball.angularVelocity.x };
}

/**
 * Analytic sliding/rolling transitions for a homogeneous sphere (I=2mR²/5).
 * A sliding impulse reduces slip at 7/2 μg; never overshoot through zero slip.
 */
export function applyCloth(ball: BallState, dt: number, radius: number, config: PhysicsConfig): void {
  const v = ball.velocity, w = ball.angularVelocity;
  const slip = clothSlip(ball, radius);
  const slipSpeed = Math.hypot(slip.x, slip.z);
  let rollingTime = dt;
  if (slipSpeed > 1e-10) {
    const acceleration = config.slidingFriction * config.gravity;
    if (acceleration <= 0) rollingTime = 0;
    else {
      const slideTime = Math.min(dt, slipSpeed / (3.5 * acceleration));
      const delta = acceleration * slideTime;
      const dx = -delta * slip.x / slipSpeed, dz = -delta * slip.z / slipSpeed;
      v.x += dx; v.z += dz;
      // Torque at the bottom of a sphere: Δωx=-5Δvz/(2R), Δωz=5Δvx/(2R).
      w.x -= 2.5 * dz / radius;
      w.z += 2.5 * dx / radius;
      rollingTime = dt - slideTime;
      if (rollingTime > 0 || Math.hypot(v.x+radius*w.z,v.z-radius*w.x) < 1e-9) {
        w.x = v.z / radius;
        w.z = -v.x / radius;
      }
    }
  }
  if (rollingTime > 0) {
    const speed = Math.hypot(v.x, v.z);
    if (speed > 0) {
      const next = Math.max(0, speed - config.rollingFriction * config.gravity * rollingTime);
      v.x *= next / speed; v.z *= next / speed;
    }
    w.x = v.z / radius; w.z = -v.x / radius;
  }
  w.y = Math.sign(w.y) * Math.max(0, Math.abs(w.y) - config.spinDeceleration * dt);
  if (Math.hypot(v.x, v.z) <= config.restSpeed && Math.hypot(w.x, w.z) <= config.restAngularSpeed && Math.abs(w.y) <= config.restAngularSpeed) {
    v.x = v.z = w.x = w.y = w.z = 0;
  }
}

/** World-space exponential quaternion step; a sphere's inertia is isotropic. */
export function integrateOrientation(ball: BallState, dt: number): void {
  const w = ball.angularVelocity;
  const speed = Math.hypot(w.x, w.y, w.z);
  if (speed < 1e-14 || dt === 0) return;
  const a = speed * dt * 0.5, s = Math.sin(a) / speed;
  const x = w.x * s, y = w.y * s, z = w.z * s, c = Math.cos(a);
  const q = ball.orientation;
  const nx = c*q.x + x*q.w + y*q.z - z*q.y;
  const ny = c*q.y - x*q.z + y*q.w + z*q.x;
  const nz = c*q.z + x*q.y - y*q.x + z*q.w;
  const nw = c*q.w - x*q.x - y*q.y - z*q.z;
  const inverseNorm = 1 / Math.hypot(nx, ny, nz, nw);
  q.x = nx*inverseNorm; q.y = ny*inverseNorm; q.z = nz*inverseNorm; q.w = nw*inverseNorm;
}
