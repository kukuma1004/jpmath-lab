export type HeroId = 'rin' | 'golem' | 'ryu';
export type Phase = 'menu' | 'playing' | 'paused' | 'gameover' | 'victory';
export type Difficulty = 'normal' | 'story';
export type EnemyKind = 'drone' | 'wing' | 'turret' | 'brute' | 'boss';
export type ProjectileKind = 'shot' | 'enemy' | 'charge' | 'missile';
export interface InputIntent { x:number; y:number; focus:boolean; charge:boolean; ultimate:boolean; target?:{x:number;y:number}; }
export interface Player {x:number;y:number;hp:number;maxHp:number;invulnerable:number;charge:number;power:number;shotTimer:number;ultimateStock:number;ultimateTimer:number;nearTimer:number;}
export interface Enemy {id:number;kind:EnemyKind;x:number;y:number;vx:number;vy:number;hp:number;maxHp:number;r:number;age:number;shotTimer:number;phase:number;flash:number;seed:number;}
export interface Projectile {id:number;kind:ProjectileKind;x:number;y:number;vx:number;vy:number;r:number;damage:number;age:number;grazed:boolean;angle:number;}
export interface Pickup {id:number;kind:'power'|'gold'|'health';x:number;y:number;age:number;}
export interface GameEvent {kind:'shot'|'hit'|'kill'|'hurt'|'graze'|'pickup'|'charge'|'ultimate'|'boss'|'victory'|'gameover'|'near';x:number;y:number;value?:number;text?:string;enemy?:EnemyKind;}
export interface GameState {phase:Phase;hero:HeroId;difficulty:Difficulty;time:number;score:number;combo:number;comboTimer:number;graze:number;wave:number;bossActive:boolean;bossDefeated:boolean;player:Player;enemies:Enemy[];bullets:Projectile[];pickups:Pickup[];events:GameEvent[];stats:{kills:number;shots:number;damageTaken:number;ultimates:number;chargeShots:number;nearKills:number};}
export const WIDTH=1600, HEIGHT=900;
export interface HeroDefinition {id:HeroId;name:string;epithet:string;english:string;role:string;weapon:string;ultimate:string;ultimateEn:string;description:string;ability:string;color:string;asset:string;speed:number;power:number;spread:number;}
export const HEROES:HeroDefinition[]=[
 {id:'rin',name:'린',epithet:'홍련의 무녀',english:'RIN',role:'광역 · 기동형',weapon:'홍련 부채',ultimate:'홍련만개',ultimateEn:'CRIMSON BLOOM',description:'흩날리는 꽃잎처럼, 피할 틈 없이.',ability:'넓게 퍼지는 부채탄 · 다방향 화염 결계',color:'#ed786e',asset:'rin.png',speed:470,power:3,spread:5},
 {id:'golem',name:'철귀',epithet:'깨어난 전쟁 병기',english:'TETSU',role:'관통 · 중장갑형',weapon:'천공 광선포',ultimate:'천공멸살포',ultimateEn:'HEAVEN BREAKER',description:'천 년의 침묵을 깨는 한 발.',ability:'적을 꿰뚫는 직선탄 · 거대 관통 광선',color:'#76d6df',asset:'golem.png',speed:340,power:5,spread:2},
 {id:'ryu',name:'무진',epithet:'폭뢰의 권왕',english:'MUJIN',role:'근접 · 폭발형',weapon:'폭뢰 권갑',ultimate:'패왕뇌격',ultimateEn:'THUNDER REIGN',description:'길이 없다면, 주먹으로 연다.',ability:'묵직한 파동탄 · 전장을 쪼개는 낙뢰',color:'#e9b26d',asset:'ryu.png',speed:400,power:5,spread:3}
];
