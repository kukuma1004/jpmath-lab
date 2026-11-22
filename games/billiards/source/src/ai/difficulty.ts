import type { MatchConfig } from '../rules/types';

export interface DifficultyConfig {
  candidates: number;
  refine: number;
  cushionDepth: number;
  spinVariants: number;
  placementSamples: number;
  positionWeight: number;
  foulWeight: number;
  angleError: number;
  powerError: number;
  // This is a cap on simulated time, not a wall-clock cutoff which would alter shot choice.
  simulationSeconds: number;
}
/** Search scope and strategic evaluation change as well as execution accuracy. */
export const DIFFICULTY: Readonly<Record<MatchConfig['difficulty'], DifficultyConfig>> = Object.freeze({
  easy: { candidates: 18, refine: 0, cushionDepth: 0, spinVariants: 0, placementSamples: 3, positionWeight: .04, foulWeight: .7, angleError: .009, powerError: .08, simulationSeconds: 35 },
  normal: { candidates: 40, refine: 4, cushionDepth: 1, spinVariants: 1, placementSamples: 7, positionWeight: .18, foulWeight: 1, angleError: .003, powerError: .035, simulationSeconds: 35 },
  hard: { candidates: 76, refine: 10, cushionDepth: 3, spinVariants: 3, placementSamples: 12, positionWeight: .4, foulWeight: 1.25, angleError: .0007, powerError: .012, simulationSeconds: 35 },
  expert: { candidates: 120, refine: 20, cushionDepth: 4, spinVariants: 5, placementSamples: 20, positionWeight: .7, foulWeight: 1.6, angleError: .00015, powerError: .004, simulationSeconds: 35 },
});
