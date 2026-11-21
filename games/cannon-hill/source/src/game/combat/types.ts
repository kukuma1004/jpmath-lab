export type Phase =
  | 'BATTLE_START'
  | 'TURN_START'
  | 'MOVE'
  | 'AIM'
  | 'CHARGE'
  | 'PROJECTILE_FLIGHT'
  | 'EXPLOSION'
  | 'TERRAIN_COLLAPSE'
  | 'PHYSICS_SETTLING'
  | 'TURN_END'
  | 'GAME_OVER';

export type Controller = 'human' | 'ai';
export type Difficulty = 'easy' | 'normal' | 'hard';

export interface BattleConfig {
  mapId: string;
  seed: number;
  chars: [string, string];
  controllers: [Controller, Controller];
  difficulty: Difficulty;
  turnTime: number;
  turnLimit: number;
}

export type AnimState = 'idle' | 'aim' | 'charge' | 'fire' | 'hit' | 'fall' | 'victory' | 'defeat';

export interface FighterStats {
  shots: number;
  hits: number;
  damageDealt: number;
  damageTaken: number;
  maxHit: number;
  cellsDestroyed: number;
}

export interface Fighter {
  idx: 0 | 1;
  charId: string;
  x: number;
  y: number; // 발 위치
  vx: number;
  vy: number;
  onGround: boolean;
  angle: number; // 0..180, 0은 오른쪽, 90은 위
  power: number;
  lastPower: number;
  chargeDir: 1 | -1;
  slot: 0 | 1;
  hp: number;
  maxHp: number;
  gauge: number;
  moveLeft: number;
  alive: boolean;
  deathCause: '' | 'hp' | 'fall';
  anim: AnimState;
  animT: number;
  slope: number; // 화면 기울기(도)
  airPeakY: number;
  stats: FighterStats;
}

export interface Projectile {
  id: number;
  owner: 0 | 1;
  shot: number;
  weaponId: string;
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  age: number;
  bounces: number;
  pierced: number;
  carveAcc: number;
  child: '' | 'split' | 'frag';
  stuck: boolean;
  fuse: number;
  split: boolean;
  dead: boolean;
}

export interface Boulder {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  restT: number;
  age: number;
  cool: [number, number];
  dead: boolean;
}

export interface Chunk {
  id: number;
  cells: Int32Array;
  mats: Uint8Array;
  bottom: Int32Array; // cells 안에서 바로 아래가 비어 있는 셀의 위치
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  dRow: number;
  acc: number;
  vy: number;
  hit: [boolean, boolean];
  hard: number;
  dead: boolean;
}

export interface Scheduled {
  t: number;
  kind: 'salvo' | 'strike';
  owner: 0 | 1;
  shot: number;
  weaponId: string;
  x: number;
  angle: number;
  power: number;
}

export type DamageCause = 'blast' | 'fall' | 'rock' | 'crush' | 'lightning';

export type SimEvent =
  | { type: 'battleStart'; first: 0 | 1 }
  | { type: 'turn'; player: 0 | 1; turnNo: number; wind: number; prevWind: number }
  | { type: 'fire'; owner: 0 | 1; weaponId: string; x: number; y: number; angle: number; power: number }
  | { type: 'launch'; id: number; weaponId: string }
  | { type: 'explode'; x: number; y: number; radius: number; weaponId: string; big: boolean }
  | { type: 'damage'; target: 0 | 1; amount: number; x: number; y: number; crit: boolean; cause: DamageCause }
  | { type: 'bounce'; x: number; y: number; weaponId: string }
  | { type: 'lightning'; x: number; y: number }
  | { type: 'split'; x: number; y: number }
  | { type: 'fuse'; x: number; y: number }
  | { type: 'debris'; x: number; y: number; count: number; mat: number }
  | { type: 'chunk'; id: number }
  | { type: 'chunkLand'; id: number; x: number; y: number; speed: number; size: number }
  | { type: 'boulder'; id: number }
  | { type: 'rockHit'; x: number; y: number; speed: number }
  | { type: 'land'; target: 0 | 1; speed: number }
  | { type: 'death'; target: 0 | 1; cause: 'hp' | 'fall' }
  | { type: 'timeout'; player: 0 | 1 }
  | { type: 'forced' }
  | { type: 'gameOver'; winner: 0 | 1 | -1; reason: 'hp' | 'fall' | 'limit' | 'draw' };
