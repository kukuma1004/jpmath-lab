import { TABLE } from '../physics/config';
import { makeBall } from '../physics/presets';
import type { BallState } from '../physics/types';
import type { Discipline, PlayerIndex } from './types';

/** UMB spots on the long axis; either of the ±18.25 cm start-side spots is allowed. */
export function createCaromOpening(shooter: PlayerIndex = 0, discipline: Discipline = 'three-cushion'): BallState[] {
  const head = -TABLE.width / 4, foot = TABLE.width / 4;
  const white = makeBall('white', 'white', head, shooter === 0 ? .1825 : 0);
  const yellow = makeBall('yellow', 'yellow', head, shooter === 1 ? .1825 : 0);
  const balls = [white, yellow, makeBall('red', 'red', foot, 0)];
  // A named domestic four-ball layout; the second red has its own unoccupied practice spot.
  if (discipline === 'four-ball') balls.push(makeBall('red2', 'red2', foot, -.365));
  return balls;
}
