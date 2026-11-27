import type { BattleConfig, Team, WeaponSlot } from '../combat/types';

export const ONLINE_API = '/api/warureu/v1';
export const STARTING_RATING = 1000;
export const RECONNECT_MS = 45_000;
export const FRIEND_BRANCH = 'warureuFriendV1';
export const FRIEND_RULESET = 2;
export const FRIEND_MEADOW_RULESET = 3;
export const DUEL_ACCOUNT_DOMAIN = 'id.warureu.example';
export const ROOM_DURATION_MS = 7_200_000;
export const ROOM_WAIT_MS = 900_000;
export const ROOM_LIST_LIMIT = 30;
export const FRIEND_MODES = {
  duel: {title:'1:1', seats:2, freeForAll:false},
  teams: {title:'2:2 팀전', seats:4, freeForAll:false},
  solo3: {title:'3인 개인전', seats:3, freeForAll:true},
  solo4: {title:'4인 개인전', seats:4, freeForAll:true},
} as const;
export type FriendMode = keyof typeof FRIEND_MODES;
export function isFriendMode(value: unknown): value is FriendMode {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(FRIEND_MODES, value);
}
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
  you: Team;
  names: string[];
  map: string;
  listed: boolean;
  mode?: FriendMode;
  connectedSeats?: boolean[];
  config: BattleConfig | null;
  turn: number;
  step: number;
  cursor: number;
  commands: ReplayCommand[];
  opponentConnected: boolean;
  done: boolean;
  rating: RatingChange | null;
}

export interface PublicRoom {
  code: string;
  nickname: string;
  map: string;
  created: number;
  mode?: FriendMode;
}

export interface OnlineState {
  profile: Profile;
  queued: boolean;
  room: OnlineRoom | null;
  rooms: PublicRoom[];
}

export class OnlineError extends Error {
  readonly status: number;
  constructor(status: number, message: string) { super(message); this.status=status; }
}
