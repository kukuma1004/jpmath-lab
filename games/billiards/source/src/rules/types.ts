import type { ShotResult } from '../physics/types';

export type PlayerIndex = 0 | 1;
export type BallGroup = 'solid' | 'stripe';
export type Discipline = 'four-ball' | 'three-cushion' | 'eight-ball';
export type BreakOption = 'accept' | 'ball-in-hand' | 'spot' | 'rerack-self' | 'rerack-opponent';
export interface MatchConfig {
  discipline: Discipline;
  mode: 'practice' | 'local' | 'ai';
  target: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  profile: 'domestic' | 'wpa' | 'casual';
  fourBallFoul: 'off' | 'turn' | 'penalty';
  equalInnings: boolean;
  callShots: boolean;
  playerNames: [string, string];
}
export interface PlayerState {
  name: string;
  score: number;
  innings: number;
  shots: number;
  highRun: number;
  run: number;
  fouls: number;
  group: BallGroup | null;
}
export interface PendingChoice {
  kind: 'illegal-break' | 'break-eight' | 'break-eight-foul' | 'break-foul';
  /** The person entitled to select. The current player is set to this person while pending. */
  player: PlayerIndex;
  breaker: PlayerIndex;
  options: { id: BreakOption; label: string }[];
}
export interface MatchState {
  players: [PlayerState, PlayerState];
  currentPlayer: PlayerIndex;
  inning: number;
  shotNumber: number;
  status: 'playing' | 'finished';
  winner: PlayerIndex | 'draw' | null;
  breakShot: boolean;
  openTable: boolean;
  ballInHand: boolean;
  ballInHandZone: 'anywhere' | 'head-string';
  /** Survives confirmPlacement until that shot is adjudicated. */
  headStringRestriction: boolean;
  openingRequired: boolean;
  equalizing: boolean;
  pendingChoice: PendingChoice | null;
  message: string;
}
export interface RuleOutcome {
  scored: boolean;
  points: number;
  foul: string | null;
  retainTurn: boolean;
  message: string;
  respots: string[];
  rerack?: boolean;
  openingLayoutFor?: PlayerIndex;
  ballInHand?: boolean;
  ballInHandZone?: 'anywhere' | 'head-string';
  winner?: PlayerIndex | 'draw';
  choice?: PendingChoice;
  /** The group selected on an open table (including WPA temporary claim). */
  assignedGroup?: BallGroup;
}
export interface RuleContext {
  config: MatchConfig;
  state: MatchState;
  cueBall: string;
}
export interface DisciplineRules {
  evaluate(result: ShotResult, context: RuleContext): RuleOutcome;
}
export const otherPlayer = (player: PlayerIndex): PlayerIndex => player === 0 ? 1 : 0;
export const oppositeGroup = (group: BallGroup): BallGroup => group === 'solid' ? 'stripe' : 'solid';
export const outcome = (changes: Partial<RuleOutcome> = {}): RuleOutcome => ({
  scored: false, points: 0, foul: null, retainTurn: false, respots: [], message: '득점 없이 공격을 마쳤습니다.', ...changes,
});
