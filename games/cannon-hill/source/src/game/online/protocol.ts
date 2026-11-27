import type { BattleConfig, WeaponSlot } from '../combat/types';

export const ONLINE_API = '/api/warureu/v1';
export const STARTING_RATING = 1000;
export const RECONNECT_MS = 45_000;
export type MatchKind = 'friendly' | 'ranked';
export type ReplayCommand = { s: number; c: string; a: number[] };
export type Control =
  | { kind: 'input'; move: -1 | 0 | 1; aim: -1 | 0 | 1 }
  | { kind: 'slot'; slot: WeaponSlot }
  | { kind: 'fire'; step: number }
  | { kind: 'flip' | 'cancel' };

export interface Profile {
  nickname: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface RatingChange {
  before: number;
  after: number;
  opponent: number;
}

export interface OnlineRoom {
  code: string;
  kind: MatchKind;
  you: 0 | 1;
  names: string[];
  config: BattleConfig | null;
  turn: number;
  step: number;
  cursor: number;
  commands: ReplayCommand[];
  opponentConnected: boolean;
  done: boolean;
  rating: RatingChange | null;
}

export interface OnlineState {
  profile: Profile;
  queued: boolean;
  room: OnlineRoom | null;
}
