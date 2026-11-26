import type { TableConfig } from './types';

/** All distances in metres, mass in kilograms, time in seconds, angular speed in radians/s. */
export const FIXED_DT = 1 / 240;
export const TABLE: TableConfig = { width: 2.84, height: 1.42, ballRadius: 0.03075, ballMass: 0.21 };
/** A wider stroke range keeps firm caroms and pool breaks accessible on the same meter. */
export const SHOT_SPEED_LIMITS = Object.freeze({ carom: 6.5, pool: 9.5 });
/** Human shots, AI rollouts and forecasts must use the same physical impulse range. */
export const shotSpeedLimit = (table: TableConfig): number => table.kind === 'pool' ? SHOT_SPEED_LIMITS.pool : SHOT_SPEED_LIMITS.carom;
export interface PhysicsConfig {
  gravity: number;
  slidingFriction: number;
  rollingFriction: number;
  spinDeceleration: number;
  ballRestitution: number;
  cushionRestitution: number;
  ballFriction: number;
  cushionFriction: number;
  maxShotSpeed: number;
  restSpeed: number;
  restAngularSpeed: number;
}
export const DEFAULT_PHYSICS: Readonly<PhysicsConfig> = Object.freeze({
  gravity: 9.81,
  slidingFriction: 0.20,
  rollingFriction: 0.012,
  spinDeceleration: 12,
  ballRestitution: 0.95,
  cushionRestitution: 0.80,
  ballFriction: 0.035,
  cushionFriction: 0.16,
  maxShotSpeed: SHOT_SPEED_LIMITS.carom,
  restSpeed: 0.0008,
  restAngularSpeed: 0.03,
});
