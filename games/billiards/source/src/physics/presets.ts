import type { BallColor, BallState } from './types';

export function makeBall(id: string, color: BallColor, x: number, z: number): BallState {
  return { id, color, position: { x, z }, velocity: { x: 0, z: 0 },
    angularVelocity: { x: 0, y: 0, z: 0 }, orientation: { x: 0, y: 0, z: 0, w: 1 } };
}

/** Practice drills, deliberately not advertised as a sanctioned competition opening. */
export function createLayout(name: 'opening'|'collision'|'cushion'|'spin', count: 3|4 = 4): BallState[] {
  const points = {
    opening: [[-0.71, 0.28], [-0.71, -0.28], [0.71, 0], [0.45, -0.32]],
    collision: [[-0.74, 0], [0.66, -0.36], [-0.05, 0], [0.58, 0.22]],
    cushion: [[-0.65, 0.20], [0.62, -0.24], [0.65, 0.38], [0.10, -0.36]],
    spin: [[-0.70, 0], [0.76, -0.38], [-0.39, 0], [0.58, 0.30]],
  }[name];
  return points.slice(0, count).map(([x, z], i) => makeBall(
    ['white', 'yellow', 'red', 'red2'][i], (['white', 'yellow', 'red', 'red2'] as const)[i], x, z));
}
