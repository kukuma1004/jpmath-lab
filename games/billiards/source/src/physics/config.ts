import type { TableConfig } from './types';

/** All distances in metres, mass in kilograms, time in seconds, angular speed in radians/s. */
export const FIXED_DT = 1 / 240;
export const TABLE: TableConfig = { width: 2.84, height: 1.42, ballRadius: 0.03075, ballMass: 0.21 };
/** Pool's break needs a wider impulse range; every player, AI and forecast shares this cap. */
export const shotSpeedLimit = (table: TableConfig): number => table.kind === 'pool' ? 7.5 : 4.5;
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
  maxShotSpeed: 4.5,
  restSpeed: 0.0008,
  restAngularSpeed: 0.03,
});
