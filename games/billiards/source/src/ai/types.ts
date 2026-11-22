import type { BallState, ShotInput, TableConfig, Vec2 } from '../physics/types';
import type { BreakOption, MatchConfig, MatchState } from '../rules/types';

export interface AIRequest {
  requestId: number;
  balls: BallState[];
  table: TableConfig;
  config: MatchConfig;
  state: MatchState;
  seed: number;
}
export interface AIResponse {
  requestId: number;
  shot: ShotInput;
  placement?: Vec2;
  choice?: BreakOption;
  candidates: number;
  simulated: number;
  elapsedMs: number;
  score: number;
  rationale: string;
  error?: string;
}
export interface Candidate { shot: ShotInput; placement?: Vec2; priority: number; rationale: string }
