export type HeroId = 'rin' | 'golem' | 'ryu';
export type Phase = 'menu' | 'playing' | 'paused' | 'gameover' | 'victory';
export type Difficulty = 'normal' | 'story';
export type EnemyKind = 'drone' | 'wing' | 'turret' | 'brute' | 'kite' | 'ember' | 'frost' | 'storm'
  | 'boss1' | 'boss2' | 'boss3' | 'boss4' | 'boss5';
export type BulletStyle = 'orb' | 'rice' | 'big' | 'needle';
export type ShotKind = 'shot' | 'charge' | 'homing' | 'wave';

export interface InputIntent { x:number; y:number; focus:boolean; charge:boolean; ultimate:boolean; dash:boolean; drag?:{dx:number;dy:number}; }

export interface Player {
  x:number; y:number; hp:number; maxHp:number; invulnerable:number; charge:number; power:number; shotTimer:number;
  gauge:number; ultimateTimer:number; nearTimer:number;
  dashCharges:number; dashRecharge:number; dashTime:number; dashVX:number; dashVY:number; dashIframes:number; perfectThisDash:boolean;
  faceX:number; faceY:number; moving:number; missileTimer:number;
}

export interface EnemyPath {
  type:'line'|'dive'|'arc'|'chase'|'ground'|'boss';
  speed:number; sineAmp?:number; sineFreq?:number; stopX?:number; stopY?:number; hold?:number; exit?:'up'|'down'|'left'|'back';
  sx?:number; sy?:number; cx?:number; cy?:number; ex?:number; ey?:number; duration?:number;
}
export interface FirePattern {
  type:'aim'|'fan'|'ring'|'spiral'|'stream'|'none';
  n?:number; spread?:number; speed?:number; style?:BulletStyle; color?:string; every?:number; delay?:number; count?:number; gap?:number;
}
export interface Enemy {
  id:number; kind:EnemyKind; x:number; y:number; vx:number; vy:number; hp:number; maxHp:number; age:number;
  shotTimer:number; flash:number; seed:number; tint:string; boss:boolean; mid:boolean; scale:number;
  path:EnemyPath; fire?:FirePattern; fireCount:number; drop?:'power'|'life'|'gauge';
  // Boss bookkeeping (unused on small enemies).
  phase:number; attack:number; attackTime:number; tx:number; ty:number; shield:number; spin:number;
}

/** Enemy bullet in polar motion (angle a, speed v) plus an optional falling component gy. */
export interface Bullet {
  id:number; x:number; y:number; a:number; v:number; gy:number; r:number; style:BulletStyle; color:string; age:number; grazed:boolean;
  accel:number; turn:number; maxSpeed:number; gravity:number; wait:number; reaim:number; reaimSpeed:number; split:number; splitSpeed:number;
}
export interface Shot {id:number; kind:ShotKind; x:number; y:number; vx:number; vy:number; r:number; damage:number; age:number; life:number; pierce:boolean;}
export interface Laser {id:number; x:number; y:number; angle:number; length:number; width:number; warn:number; life:number; age:number; color:string; spin:number; owner?:number; ox:number; oy:number; grazeTick:number;}
export interface Pickup {id:number; kind:'power'|'gold'|'life'|'gauge'; x:number; y:number; vx:number; vy:number; age:number; magnet:boolean;}

export type EventKind = 'shot'|'hit'|'kill'|'hurt'|'graze'|'pickup'|'charge'|'ultimate'|'boss'|'victory'|'gameover'|'near'
  |'dash'|'perfect'|'phase'|'attack'|'stage'|'stageclear'|'cancel'|'strike'|'extend'|'explode'|'warning'|'bloom';
export interface GameEvent {kind:EventKind; x:number; y:number; value?:number; text?:string; sub?:string; enemy?:EnemyKind; big?:boolean;}

export interface GameState {
  phase:Phase; hero:HeroId; difficulty:Difficulty; time:number; score:number; combo:number; comboTimer:number; graze:number;
  stage:number; stageTime:number; startStage:number; bossActive:boolean; bossDefeated:boolean; clearTimer:number; transition:number;
  attackName:string; attackTime:number; bossName:string; bossTitle:string; bossPhases:number;
  player:Player; enemies:Enemy[]; shots:Shot[]; bullets:Bullet[]; lasers:Laser[]; pickups:Pickup[]; events:GameEvent[];
  slow:number; hitstop:number; worldW:number; nextExtend:number;
  stats:{kills:number;shots:number;damageTaken:number;ultimates:number;chargeShots:number;nearKills:number;perfects:number;dashes:number;cancels:number;stagesCleared:number};
}

/** World height. The camera always shows exactly this height, so a smaller world is a closer view. */
export const HEIGHT=720;
/** World clock relative to real time: bullets, enemies, stage timeline and boss attacks. The player keeps real time. */
export const TEMPO=.66;
export const GAUGE_PER_STOCK=100, GAUGE_MAX=300;
/** Real hit radius of the player core. The drawn white core is exactly this size. */
export const PLAYER_R=4, GRAZE_R=30;
export const SCORE_CAP=9999999;

export interface HeroDefinition {
  id:HeroId; name:string; epithet:string; english:string; role:string; weapon:string; ultimate:string; ultimateEn:string;
  description:string; ability:string; color:string; glow:string; asset:string; speed:number;
  /** Sprite height in world pixels and the normalized image point that is the real hit core. */
  spriteH:number; core:[number,number]; muzzle:[number,number];
}
export const HEROES:HeroDefinition[]=[
 {id:'rin',name:'린',epithet:'홍련의 무녀',english:'홍련 무녀',role:'광역 · 기동형',weapon:'홍련 부채',ultimate:'홍련만개',ultimateEn:'붉은 연꽃이 하늘을 덮는다',
  description:'흩날리는 꽃잎처럼, 피할 틈 없이.',ability:'넓게 퍼지는 부채탄 · 따라가는 꽃잎 · 전장을 뒤덮는 꽃잎 폭풍',color:'#ff7d72',glow:'#ffb3a6',asset:'rin.webp',speed:430,
  spriteH:140,core:[.45,.33],muzzle:[.84,.13]},
 {id:'golem',name:'철귀',epithet:'깨어난 전쟁 병기',english:'철갑 장수',role:'관통 · 중장갑형',weapon:'천공 광선포',ultimate:'천공멸살포',ultimateEn:'하늘을 가르는 한 줄기 빛',
  description:'천 년의 침묵을 깨는 한 발.',ability:'적을 꿰뚫는 직선탄 · 유도 미사일 · 화면을 가르는 거대 광선',color:'#6fe3ee',glow:'#c4fbff',asset:'golem.webp',speed:370,
  spriteH:148,core:[.48,.24],muzzle:[.97,.18]},
 {id:'ryu',name:'무진',epithet:'폭뢰의 권왕',english:'벼락 권사',role:'근접 · 폭발형',weapon:'폭뢰 권갑',ultimate:'패왕뇌격',ultimateEn:'적마다 벼락이 내리꽂힌다',
  description:'길이 없다면, 주먹으로 연다.',ability:'묵직한 파동탄 · 강력한 근접 연타 · 적마다 내리꽂는 낙뢰',color:'#f5bd62',glow:'#fff0b8',asset:'ryu.webp',speed:400,
  spriteH:144,core:[.44,.26],muzzle:[.86,.15]}
];
export const heroDef=(id:HeroId)=>HEROES.find(h=>h.id===id)!;

export interface EnemyDefinition {
  hp:number; score:number; w:number; asset:string; aspect:number;
  /** Hit circles: normalized centre inside the drawn sprite and radius as a fraction of the drawn width. */
  hit:[number,number,number][];
}
export const ENEMIES:Record<EnemyKind,EnemyDefinition>={
  drone:{hp:48,score:200,w:118,asset:'drone.webp',aspect:.75,hit:[[.3,.52,.1],[.5,.52,.13],[.69,.48,.1]]},
  wing:{hp:75,score:300,w:142,asset:'wing.webp',aspect:.667,hit:[[.42,.5,.11],[.58,.52,.09],[.24,.34,.08],[.74,.32,.08]]},
  turret:{hp:260,score:900,w:196,asset:'turret.webp',aspect:.75,hit:[[.6,.6,.21],[.36,.58,.12],[.2,.26,.07]]},
  brute:{hp:600,score:1800,w:214,asset:'brute.webp',aspect:.75,hit:[[.5,.56,.27],[.24,.62,.1],[.76,.62,.1]]},
  kite:{hp:44,score:220,w:120,asset:'kite.webp',aspect:.75,hit:[[.22,.58,.08],[.42,.5,.13],[.6,.3,.09]]},
  ember:{hp:88,score:350,w:116,asset:'ember.webp',aspect:1,hit:[[.44,.52,.21]]},
  frost:{hp:100,score:380,w:116,asset:'frost.webp',aspect:1,hit:[[.46,.5,.2],[.25,.5,.09]]},
  storm:{hp:120,score:420,w:124,asset:'storm.webp',aspect:1,hit:[[.49,.51,.24]]},
  boss1:{hp:3800,score:30000,w:520,asset:'boss.webp',aspect:.75,hit:[[.5,.44,.17],[.5,.72,.1],[.27,.42,.1],[.73,.42,.1],[.12,.36,.08],[.88,.36,.08]]},
  boss2:{hp:4600,score:40000,w:580,asset:'boss2.webp',aspect:.667,hit:[[0.611,0.25,0.083],[0.389,0.417,0.083],[0.5,0.417,0.083],[0.611,0.417,0.083],[0.722,0.417,0.083],[0.167,0.583,0.083],[0.278,0.583,0.083],[0.389,0.583,0.083],[0.5,0.583,0.083],[0.611,0.583,0.083],[0.722,0.583,0.083],[0.833,0.583,0.083],[0.278,0.75,0.083],[0.389,0.75,0.083],[0.5,0.75,0.083],[0.611,0.75,0.083],[0.722,0.75,0.083],[0.833,0.75,0.083]]},
  boss3:{hp:5200,score:50000,w:540,asset:'boss3.webp',aspect:.667,hit:[[0.312,0.3,0.092],[0.438,0.3,0.092],[0.562,0.3,0.092],[0.688,0.3,0.092],[0.812,0.3,0.092],[0.188,0.5,0.092],[0.312,0.5,0.092],[0.438,0.5,0.092],[0.562,0.5,0.092],[0.688,0.5,0.092],[0.812,0.5,0.092],[0.312,0.7,0.092],[0.438,0.7,0.092],[0.562,0.7,0.092],[0.688,0.7,0.092]]},
  boss4:{hp:5800,score:60000,w:560,asset:'boss4.webp',aspect:.667,hit:[[0.167,0.25,0.083],[0.278,0.25,0.083],[0.389,0.25,0.083],[0.5,0.25,0.083],[0.389,0.417,0.083],[0.5,0.417,0.083],[0.611,0.417,0.083],[0.722,0.417,0.083],[0.833,0.417,0.083],[0.278,0.583,0.083],[0.389,0.583,0.083],[0.611,0.583,0.083],[0.833,0.583,0.083],[0.278,0.75,0.083],[0.389,0.75,0.083],[0.5,0.75,0.083],[0.611,0.75,0.083],[0.833,0.75,0.083]]},
  boss5:{hp:7000,score:90000,w:540,asset:'boss5.webp',aspect:.75,hit:[[0.312,0.25,0.092],[0.438,0.25,0.092],[0.562,0.25,0.092],[0.688,0.25,0.092],[0.812,0.25,0.092],[0.188,0.417,0.092],[0.312,0.417,0.092],[0.438,0.417,0.092],[0.562,0.417,0.092],[0.688,0.417,0.092],[0.812,0.417,0.092],[0.188,0.583,0.092],[0.312,0.583,0.092],[0.438,0.583,0.092],[0.562,0.583,0.092],[0.688,0.583,0.092],[0.812,0.583,0.092],[0.312,0.75,0.092],[0.438,0.75,0.092],[0.562,0.75,0.092],[0.688,0.75,0.092]]}
};
export const enemyHeight=(kind:EnemyKind)=>ENEMIES[kind].w*ENEMIES[kind].aspect;
