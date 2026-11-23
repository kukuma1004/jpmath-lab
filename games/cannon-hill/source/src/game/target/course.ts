export const DAY_MS = 86_400_000;
export const KOREA_OFFSET_MS = 32_400_000;
export const FINISH_GRACE_MS = 600_000;
// Power and points are stored in tenths of the numbers shown to the player.
export const MAX_POWER = 1000;
export const MAX_SHOT_SCORE = 1000;
export const MAX_SCORE = 10000;
export const CHARGE_MS = 2000;
export const DISTANCE_SCALE = MAX_POWER ** 2;
export const BASE_RANGE = 2160;
export const WIND_RANGE = 27;
export const DAY_DISTANCE_SHIFT = 12;
export const DAY_DISTANCE_PERIOD = 13;
export const DAY_WIND_PERIOD = 5;

export const ROUNDS = [
  [510, 0], [720, 0], [825, 2], [960, -3], [1110, 4],
  [1245, -4], [1060, 5], [1440, -5], [1520, 6], [1670, -6],
] as const;
export const BANDS = [20, 50, 100] as const;
export const CENTER_SCORE = MAX_SHOT_SCORE - BANDS[0] * 10;

export interface Target {
  distance: number;
  wind: number;
}

export interface TargetShot {
  power: number;
  points: number;
  offset: number;
  distanceTenths: number;
}

export interface TargetResult {
  day: number;
  score: number;
  centers: number;
  rank: number;
  shots: TargetShot[];
}

export function koreaDay(now = Date.now()): number {
  return Math.floor((now + KOREA_OFFSET_MS) / DAY_MS);
}

export function playableDay(day: number, now = Date.now()): boolean {
  return Number.isInteger(day) && day > 0 && (day === koreaDay(now) ||
    (day === koreaDay(now) - 1 && (now + KOREA_OFFSET_MS) % DAY_MS < FINISH_GRACE_MS));
}

export function courseDate(day: number): string {
  return new Date(day * DAY_MS).toISOString().slice(0, 10);
}

export function targetFor(day: number, round: number): Target {
  const [distance, wind] = ROUNDS[round]!;
  return {
    distance: distance + (day % DAY_DISTANCE_PERIOD - 6) * DAY_DISTANCE_SHIFT,
    wind: wind === 0 ? 0 : wind + day % DAY_WIND_PERIOD - 2,
  };
}

/** At 45° the shot returns to muzzle height. Rendering and scoring share the same landing position. */
export function shotPosition(power: number, wind: number, progress: number): {x: number; height: number} {
  const strength = power * power / DISTANCE_SCALE;
  return {
    x: strength * (BASE_RANGE * progress + WIND_RANGE * wind * progress * progress),
    height: strength * BASE_RANGE * progress * (1 - progress),
  };
}

export function scoreShot(target: Target, power: number): TargetShot {
  const delta = power * power * (BASE_RANGE + WIND_RANGE * target.wind) - target.distance * DISTANCE_SCALE;
  const distanceTenths = Math.round(Math.abs(delta) * 10 / DISTANCE_SCALE);
  const points = Math.max(0, MAX_SHOT_SCORE - distanceTenths);
  return {power, points, offset: delta / DISTANCE_SCALE, distanceTenths};
}

export function formatTenths(value: number): string {
  return (value / 10).toFixed(1);
}

export function isCenter(shot: TargetShot): boolean {
  return shot.points >= CENTER_SCORE;
}

export function summarize(day: number, powers: readonly number[]): TargetResult | null {
  if (!Number.isSafeInteger(day) || day <= 0 || powers.length !== ROUNDS.length ||
    powers.some(power => !Number.isInteger(power) || power < 0 || power > MAX_POWER)) return null;
  const shots = powers.map((power, index) => scoreShot(targetFor(day, index), power));
  const score = shots.reduce((sum, shot) => sum + shot.points, 0);
  const centers = shots.filter(isCenter).length;
  return {day, score, centers, rank: score * (ROUNDS.length + 1) + centers, shots};
}

export function validNickname(name: string): boolean {
  return /^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 _.-]{1,12}$/.test(name) && name.trim().length > 0;
}
