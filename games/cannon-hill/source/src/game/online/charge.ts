import { PLAYER_CHARGE_TIME } from '../config/constants';
import { MAX_CHARGE_HOLD_MS } from './protocol';

const chargeRampMs = PLAYER_CHARGE_TIME * 1000;
const holdToleranceMs = 300;

export function onlineChargePower(holdMs: number): number {
  const cycle = (Math.max(0, holdMs) / chargeRampMs) % 2;
  return Math.round((1 - Math.abs(1 - cycle)) * 1000) / 10;
}

export function confirmedChargePower(holdMs: number, observedMs: number): number {
  const observed = Math.min(MAX_CHARGE_HOLD_MS, Math.max(0, observedMs));
  const inRange = Number.isInteger(holdMs) && holdMs >= 0 && holdMs <= MAX_CHARGE_HOLD_MS;
  return onlineChargePower(inRange && Math.abs(holdMs - observed) <= holdToleranceMs ? holdMs : observed);
}
