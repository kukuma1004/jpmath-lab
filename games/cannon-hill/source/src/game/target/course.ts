// Authoritative inputs and scores use integers. Power 735 means 73.5.
export const MAX_POWER = 1000;
export const MIN_SLOPE = 28;
export const MAX_SLOPE = 270;
export const SLOPE_SCALE = 100;
export const MAX_SHOT_SCORE = 1000;
export const MAX_SCORE = 10000;
export const BASE_RANGE = 2160;
export const WIND_RANGE = 27;
export const FLOOR_HEIGHT = -92;
export const WALL_SPAN = 52;
export const BANDS = [20, 50, 100] as const;
export const CENTER_SCORE = MAX_SHOT_SCORE - BANDS[0] * 10;

// Distances and elevations from the muzzle. A wall has a distance and a top height.
export const ROUNDS = [
  { distance: 510, height: 0, wind: 0 },
  { distance: 635, height: 110, wind: 0 },
  { distance: 825, height: -44, wind: 2 },
  { distance: 960, height: 36, wind: -3, wall: { distance: 488, height: 129 } },
  { distance: 1060, height: 142, wind: 4 },
  { distance: 1215, height: -60, wind: -4 },
  { distance: 1145, height: 20, wind: 5, wall: { distance: 694, height: 174 } },
  { distance: 1380, height: 124, wind: -5 },
  { distance: 1520, height: -28, wind: 6, wall: { distance: 944, height: 196 } },
  { distance: 1600, height: 56, wind: -6, wall: { distance: 780, height: 228 } },
] as const satisfies readonly Target[];

export interface Target {
  distance: number;
  height: number;
  wind: number;
  wall?: { distance: number; height: number };
}

export interface TargetAim {
  power: number;
  slope: number;
}

export interface TargetShot extends TargetAim {
  points: number;
  offset: number;
  distanceTenths: number;
  impactX: number;
  impactHeight: number;
  stop: 'floor' | 'wall' | 'target';
}

export interface TargetResult {
  score: number;
  centers: number;
  rank: number;
  shots: TargetShot[];
}

export function angleDegrees(slope: number): number {
  return Math.atan(slope / SLOPE_SCALE) * 180 / Math.PI;
}

function curvature({power, slope}: TargetAim, wind: number): number {
  const tangent = slope / SLOPE_SCALE;
  // Wind changes the effective horizontal reach. The same parabola is used by the renderer and the rules.
  return (1 + tangent * tangent) /
    (2 * (BASE_RANGE + WIND_RANGE * wind) * (power / MAX_POWER) * (power / MAX_POWER));
}

export function heightAt(x: number, aim: TargetAim, wind: number): number {
  if (aim.power === 0) return FLOOR_HEIGHT;
  return x * (aim.slope / SLOPE_SCALE) - x * x * curvature(aim, wind);
}

export function scoreShot(target: Target, aim: TargetAim): TargetShot {
  const height = heightAt(target.distance, aim, target.wind);
  const arc = curvature(aim, target.wind);
  const tangent = aim.slope / SLOPE_SCALE;
  const descendingX = (level: number) => (tangent + Math.sqrt(Math.max(0, tangent * tangent - 4 * arc * level))) / (2 * arc);
  const floorX = aim.power === 0 ? 0 : descendingX(FLOOR_HEIGHT);
  let wallX = Infinity;
  if (target.wall && floorX >= target.wall.distance) {
    const front = target.wall.distance;
    if (heightAt(front, aim, target.wind) <= target.wall.height) wallX = front;
    else if (heightAt(front + WALL_SPAN, aim, target.wind) <= target.wall.height) wallX = descendingX(target.wall.height);
  }
  const stop = wallX < floorX ? 'wall' : aim.power === 0 || height < FLOOR_HEIGHT ? 'floor' : 'target';
  const offset = height - target.height;
  const distanceTenths = Math.round(Math.abs(offset) * 10);
  const points = stop === 'target' ? Math.max(0, MAX_SHOT_SCORE - distanceTenths) : 0;
  return {
    ...aim, points, offset, distanceTenths, stop,
    impactX: stop === 'floor' ? floorX : stop === 'wall' ? wallX : target.distance,
    impactHeight: stop === 'floor' ? FLOOR_HEIGHT : stop === 'wall' ? heightAt(wallX, aim, target.wind) : height,
  };
}

export function formatTenths(value: number): string {
  return (value / 10).toFixed(1);
}

export function isCenter(shot: TargetShot): boolean {
  return shot.points >= CENTER_SCORE;
}

export function summarize(aims: readonly TargetAim[]): TargetResult | null {
  if (aims.length !== ROUNDS.length || aims.some(aim => !aim ||
    !Number.isInteger(aim.power) || aim.power < 0 || aim.power > MAX_POWER ||
    !Number.isInteger(aim.slope) || aim.slope < MIN_SLOPE || aim.slope > MAX_SLOPE)) return null;
  const shots = aims.map((aim, index) => scoreShot(ROUNDS[index]!, aim));
  const score = shots.reduce((sum, shot) => sum + shot.points, 0);
  const centers = shots.filter(isCenter).length;
  return {score, centers, rank: score * (ROUNDS.length + 1) + centers, shots};
}

export function validNickname(name: string): boolean {
  return /^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9 _.-]{1,12}$/.test(name) && name.trim().length > 0;
}
