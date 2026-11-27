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
export type EndReason = 'hp' | 'fall' | 'limit' | 'draw' | 'forfeit';

/**
 * 팀전의 장수 순서는 [1팀, 2팀, 1팀, 2팀]. 개인전에서는 각 장수가 별도 편이다.
 */
export interface BattleConfig {
  mapId: string;
  seed: number;
  chars: string[];
  controllers: Controller[];
  difficulty: Difficulty;
  starterMatch?: boolean;
  freeForAll?: boolean;
  legacyPoison?: boolean;
  turnTime: number;
  turnLimit: number; // 0은 상대 편 전멸까지 계속하는 끝장전
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

export type Team = 0 | 1 | 2 | 3;
export type WeaponSlot = 0 | 1 | 2;

export interface Fighter {
  idx: number;
  team: Team;
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
  slot: WeaponSlot;
  turnsTaken: number;
  nextUltimateTurn: number;
  hp: number;
  maxHp: number;
  moveLeft: number;
  /** 이번 차례에 걸었는가(화포장군 특기) */
  moved: boolean;
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
  owner: number;
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
  /** 특기로 붙은 피해 배수(화포장군이 자리 잡고 쏘면 1보다 크다) */
  boost: number;
  stuck: boolean;
  fuse: number;
  split: boolean;
  /** 기본 포물선 뒤 발동하는 특수 동작. 구형 저장에는 없을 수 있다. */
  seekTarget?: number;
  /** 유도로 속도가 바뀌면 표적을 놓친 뒤에도 유지한다. */
  homingAdjusted: boolean;
  drilling?: boolean;
  drillExitAt?: number;
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
  cool: number[];
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
  hit: boolean[];
  hard: number;
  dead: boolean;
}

export interface Scheduled {
  t: number;
  kind: 'salvo' | 'strike';
  owner: number;
  shot: number;
  weaponId: string;
  x: number;
  angle: number;
  power: number;
}

export interface PoisonCloud {
  id: number;
  owner: number;
  shot: number;
  x: number;
  y: number;
  radius: number;
  damage: number;
  turns: number[];
}

export type DamageCause = 'blast' | 'fall' | 'rock' | 'crush' | 'lightning' | 'poison';

export type SimEvent =
  | { type: 'battleStart'; first: number }
  | { type: 'turn'; player: number; turnNo: number; wind: number; prevWind: number }
  | { type: 'fire'; owner: number; weaponId: string; x: number; y: number; angle: number; power: number; shot: number; wind: number }
  | { type: 'ultimate'; owner: number; weaponId: string; x: number; y: number }
  | { type: 'shadow'; owner: number; x: number; y: number; facing: 1 | -1 }
  | { type: 'launch'; id: number; weaponId: string }
  | { type: 'explode'; x: number; y: number; radius: number; weaponId: string; big: boolean }
  | { type: 'drillBreak'; x: number; y: number; kind: 'exit' | 'shelf' }
  | { type: 'seekLock'; x: number; y: number }
  | { type: 'damage'; target: number; amount: number; x: number; y: number; crit: boolean; cause: DamageCause }
  | { type: 'bounce'; x: number; y: number; weaponId: string }
  | { type: 'lightning'; x: number; y: number }
  | { type: 'split'; x: number; y: number }
  | { type: 'fuse'; x: number; y: number }
  | { type: 'debris'; x: number; y: number; count: number; mat: number }
  | { type: 'chunk'; id: number }
  | { type: 'chunkLand'; id: number; x: number; y: number; speed: number; size: number }
  | { type: 'boulder'; id: number }
  | { type: 'rockHit'; x: number; y: number; speed: number }
  | { type: 'land'; target: number; speed: number }
  | { type: 'death'; target: number; cause: 'hp' | 'fall' }
  | { type: 'timeout'; player: number }
  | { type: 'heal'; target: number; amount: number; x: number; y: number }
  | { type: 'trait'; who: number; kind: 'steady' | 'eagle' | 'shove' | 'iron'; x: number; y: number }
  | { type: 'forced' }
  /** winner는 이긴 편, 무승부는 -1 */
  | { type: 'gameOver'; winner: Team | -1; reason: EndReason };
