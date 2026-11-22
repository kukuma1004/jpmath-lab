import { ENEMIES, type BulletStyle, type Enemy, type EnemyKind, type EnemyPath, type FirePattern, type Laser, type Bullet } from './types';
import { authoredChapter as makeEncounterWaves, ENCOUNTER_BOSS_AT } from './encounters';
export { STAGE_TACTICS } from './encounters';

/** What a wave script or a boss attack may do. The engine implements it. */
export interface Ctx {
  W:number; H:number; time:number; hard:number;
  player:{x:number;y:number};
  rand():number;
  aim(x:number,y:number):number;
  enemy(kind:EnemyKind,x:number,y:number,path:EnemyPath,opts?:{fire?:FirePattern;hp?:number;tint?:string;drop?:Enemy['drop'];mid?:boolean;scale?:number}):Enemy;
  bullet(x:number,y:number,angle:number,speed:number,o?:BulletOpts):Bullet|undefined;
  ring(x:number,y:number,n:number,speed:number,o?:BulletOpts&{offset?:number;gap?:number;gapAt?:number}):void;
  fan(x:number,y:number,angle:number,n:number,spread:number,speed:number,o?:BulletOpts):void;
  laser(x:number,y:number,angle:number,o:{length?:number;width?:number;warn?:number;life?:number;color?:string;spin?:number;owner?:Enemy}):Laser;
  later(delay:number,run:()=>void):void;
  announce(text:string,sub:string):void;
}
export interface BulletOpts {owner?:Enemy;r?:number; style?:BulletStyle; color?:string; accel?:number; maxSpeed?:number; turn?:number; gravity?:number; wait?:number; reaim?:number; reaimSpeed?:number; split?:number; splitSpeed?:number;}

export interface Wave {t:number; run:(c:Ctx)=>void;}
export interface BossAttack {name:string; dur:number; run:(b:Enemy,c:Ctx,t:number,every:(period:number,offset?:number)=>number)=>void;}
export interface BossPhase {until:number; attacks:BossAttack[];}
export interface BossDef {kind:EnemyKind; name:string; title:string; mark:string; phases:BossPhase[];}
export type Terrain='valley'|'clouds'|'forge'|'snow'|'storm'|'bamboo'|'night'|'underworld';
export interface StageDef {
  /** chapter: 마당 label; mark: the short name on the chapter button. */
  chapter:string; name:string; sub:string; mark:string; terrain:Terrain; bg?:string;
  sky:[string,string,string]; far:string; mid:string; near:string; fog:string; accent:string; light:string;
  weather:'petals'|'wisps'|'embers'|'snow'|'rain'|'fireflies'|'souls'; scroll:number; bossAt:number; waves:Wave[]; boss:BossDef; tint:string;
}

const RED='#ff4767',ORANGE='#ff9a3c',VIOLET='#b779ff',BLUE='#58b4ff',CYAN='#3fe6d6',YELLOW='#ffd84a',PINK='#ff6fd8',WHITE='#e8f4ff';
const TAU=Math.PI*2;

// ───────────── formations ─────────────
function stream(c:Ctx,kind:EnemyKind,n:number,y:number,o:{gap?:number;speed?:number;sine?:number;fire?:FirePattern;tint?:string;hp?:number}={}) {
  for(let i=0;i<n;i++)c.later(i*(o.gap??.28),()=>c.enemy(kind,c.W+70,y,{type:'line',speed:o.speed??420,sineAmp:o.sine??0,sineFreq:3},{fire:o.fire,tint:o.tint,hp:o.hp}));
}
/** Enter from a top (or bottom) corner, dip across the field and leave on the far side. */
function swoop(c:Ctx,kind:EnemyKind,n:number,top:boolean,o:{gap?:number;dur?:number;fire?:FirePattern;tint?:string;depth?:number}={}) {
  const H=c.H,W=c.W,depth=o.depth??.95;
  const sy=top?-70:H+70,cy=top?H*depth:H*(1-depth),ey=top?H*.22:H*.78;
  for(let i=0;i<n;i++)c.later(i*(o.gap??.2),()=>c.enemy(kind,W*.95,sy,{type:'arc',speed:0,sx:W*.95,sy,cx:W*.22,cy,ex:-180,ey,duration:o.dur??2.8},{fire:o.fire,tint:o.tint}));
}
function dive(c:Ctx,kind:EnemyKind,x:number,y:number,o:{hold?:number;exit?:EnemyPath['exit'];fire?:FirePattern;tint?:string;hp?:number;drop?:Enemy['drop'];mid?:boolean;scale?:number;speed?:number}={}) {
  return c.enemy(kind,c.W+120,y,{type:'dive',speed:o.speed??6,stopX:x,stopY:y,hold:o.hold??2.2,exit:o.exit??'back'},{fire:o.fire,tint:o.tint,hp:o.hp,drop:o.drop,mid:o.mid,scale:o.scale});
}
function darts(c:Ctx,kind:EnemyKind,n:number,o:{gap?:number;tint?:string}={}) {
  // Rammers stay fragile: they must die to a well-aimed stream before they arrive.
  for(let i=0;i<n;i++)c.later(i*(o.gap??.35),()=>c.enemy(kind,c.W+60,90+c.rand()*(c.H-180),{type:'chase',speed:300},{tint:o.tint,hp:ENEMIES[kind].hp*.35}));
}
function ground(c:Ctx,kind:EnemyKind,n:number,o:{gap?:number;fire?:FirePattern;tint?:string}={}) {
  for(let i=0;i<n;i++)c.later(i*(o.gap??1.1),()=>c.enemy(kind,c.W+110,c.H-92,{type:'ground',speed:170},{fire:o.fire??{type:'fan',n:3,spread:.22,speed:300,every:1.5,delay:.8,style:'rice',color:ORANGE},tint:o.tint}));
}
/** Two aimed shots in a row: step aside, do not just stand still. */
const aim1=(color:string,speed=330,every=1.6,delay=.7):FirePattern=>({type:'stream',count:2,speed,every,delay,color,style:'orb'});
const fan3=(color:string,speed=300,every=1.8,delay=.6):FirePattern=>({type:'fan',n:3,spread:.2,speed,every,delay,color,style:'rice'});
const ringP=(color:string,n=12,speed=210,every=2.2,delay=.9):FirePattern=>({type:'ring',n,speed,every,delay,color,style:'orb'});
const streamP=(color:string,count=5,speed=420,every=2.4,delay=.8):FirePattern=>({type:'stream',count,speed,every,delay,color,style:'needle'});

/** Build a timeline of mixed formations (stage seconds, which run at TEMPO). */
function timeline(build:(at:(t:number,run:(c:Ctx)=>void)=>void)=>void):Wave[] {const list:Wave[]=[];build((t,run)=>list.push({t,run}));return list.sort((a,b)=>a.t-b.t);}

// ───────────── bosses ─────────────
const hover=(b:Enemy,c:Ctx,t:number,amp=170,speed=.75,x?:number)=>{b.tx=x??c.W-260;b.ty=c.H/2+Math.sin(t*speed)*amp*c.H/900;};
const ORD=['첫째','둘째','셋째','넷째','다섯째','여섯째','일곱째','여덟째','아홉째','열째','열한째','열두째','열셋째','열넷째'];
/** Seconds of attack script a boss has: its HP is sized so that every attack gets its turn. */
export const bossSeconds=(def:BossDef)=>def.phases.reduce((t,p)=>t+p.attacks.reduce((u,a)=>u+a.dur,0),0)*1.1;
/** Numbers the attacks in Korean and sets each phase's HP share from its attack time. */
function boss(def:BossDef):BossDef {
  const all=def.phases.flatMap(p=>p.attacks);
  all.forEach((a,i)=>{a.name=`${i===all.length-1?'마지막':ORD[i]} 수 · ${a.name}`;});
  const secs=def.phases.map(p=>p.attacks.reduce((t,a)=>t+a.dur,0)),total=secs.reduce((a,b)=>a+b,0);
  let left=1;def.phases.forEach((p,i)=>{left-=secs[i]/total;p.until=i===def.phases.length-1?0:left;});
  return def;
}

const BOSS1=boss({kind:'boss1',name:'도깨비 장군',title:'붉은 달 계곡의 수호신',mark:'첫째 수호신',phases:[
 {until:0,attacks:[
  {name:'홍련 부채',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,190,.9);if(ev(.85,.4))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),7,.17,320,{style:'rice',color:RED});if(ev(.85,.82))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),6,.17,260,{style:'orb',color:ORANGE});}},
  {name:'방울 꽃비',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,150,.6);const k=ev(.13);for(let i=0;i<k;i++)c.bullet(120+c.rand()*(c.W-480),-12,Math.PI/2+(c.rand()-.5)*.5,60,{accel:70,maxSpeed:180,color:PINK,r:6});if(ev(1.5,.5))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),3,.24,240,{style:'rice',color:RED});}},
  {name:'종소리 고리',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,60,.5);if(ev(1.1,.3)){const o=t*.7;c.ring(b.x-60,b.y+90,24,215,{offset:o,color:YELLOW,r:6});c.later(.16,()=>c.ring(b.x-60,b.y+90,24,265,{offset:o+TAU/48,color:ORANGE,r:6}));}}}
 ]},
 {until:0,attacks:[
  {name:'염주 나선',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,90,.6);const k=ev(.095);for(let i=0;i<k;i++)for(let a=0;a<2;a++)c.bullet(b.x-40,b.y,t*2.1+a*Math.PI,210,{color:VIOLET,r:6});if(ev(1.7,.5))c.fan(b.x-80,b.y,c.aim(b.x-80,b.y),3,.34,180,{style:'big',r:12,color:RED});}},
  {name:'겹 고리',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,100,.5);if(ev(1.3,.3)){const o=c.rand()*TAU;c.ring(b.x-60,b.y,36,150,{offset:o,color:YELLOW,r:6});c.later(.35,()=>c.ring(b.x-60,b.y,36,150,{offset:o+TAU/72,color:ORANGE,r:6}));}}},
  {name:'붉은 비',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,200,.7);const k=ev(.11);for(let i=0;i<k;i++)c.bullet(c.rand()*c.W*.85,-14,Math.PI/2+(c.rand()-.5)*.25,170+c.rand()*110,{style:'rice',color:ORANGE,r:5});if(ev(1.25,.4))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),5,.14,340,{style:'rice',color:RED});}}
 ]},
 {until:0,attacks:[
  {name:'도깨비불 광선',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,120,.45);if(ev(2.6,.2)){const a=c.aim(b.x-60,b.y);for(const d of [-.42,0,.42])c.laser(b.x-60,b.y,a+d,{width:46,warn:.95,life:1.35,spin:d===0?0:-d*.35,color:RED,owner:b});}if(ev(.85,.6))c.ring(b.x-60,b.y,16,200,{offset:t,color:PINK,r:6});}},
  {name:'백팔번뇌',dur:9,run:(b,c,t,ev)=>{b.tx=c.W-290;b.ty=c.H/2;const k=ev(.2);for(let i=0;i<k;i++){const flip=Math.floor(t/.2)%2?1:-1;c.ring(b.x-40,b.y,13,165,{offset:t*1.6*flip,color:flip>0?RED:YELLOW,accel:90,maxSpeed:300,r:6});}}}
 ]}
]});

const BOSS2=boss({kind:'boss2',name:'철갑 거북선',title:'구름바다의 기함',mark:'둘째 수호신',phases:[
 {until:0,attacks:[
  {name:'측면 일제사격',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,150,.5);if(ev(1.5,.3))for(let i=0;i<6;i++){const px=b.x-170+i*62,py=b.y+70;c.later(i*.06,()=>c.fan(px,py,Math.PI-.15+i*.03,3,.22,330,{style:'rice',color:ORANGE}));}}},
  {name:'닻 사슬',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,140,.6);if(ev(1.2,.3)){const x=b.x-200,y=b.y+40,a=c.aim(x,y);for(let i=0;i<7;i++)c.later(i*.07,()=>c.bullet(x,y,a,190+i*12,{color:BLUE,r:i===0?11:6,style:i===0?'big':'orb'}));}if(ev(2.4,1.2))c.ring(b.x,b.y,20,150,{offset:t,color:CYAN,r:5});}},
  {name:'프로펠러 돌풍',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,110,.8);const k=ev(.11);for(let i=0;i<k;i++){c.ring(b.x+170,b.y-70,5,210,{offset:t*3.1,color:CYAN,r:5});c.ring(b.x+170,b.y+70,5,210,{offset:-t*3.1,color:BLUE,r:5});}}}
 ]},
 {until:0,attacks:[
  {name:'연 띄우기',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,170,.6);if(ev(2.4,.4))for(let i=0;i<3;i++)dive(c,'kite',c.W*.45+i*120,120+c.rand()*(c.H-240),{hold:1.6,fire:aim1(PINK,300,1,.5),exit:i%2?'up':'down',speed:8});if(ev(1.6,1))for(let i=0;i<7;i++)c.later(i*.07,()=>c.bullet(b.x-200,b.y,c.aim(b.x-200,b.y),500,{style:'needle',color:WHITE,r:4}));}},
  {name:'바람개비',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,90,.5);if(ev(.42)){const f=Math.floor(t/.42)%2?1:-1;c.ring(b.x-100,b.y,12,165,{offset:t*.9,turn:.42*f,color:f>0?CYAN:WHITE,r:6});}}},
  {name:'정지 폭뢰',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,120,.5);if(ev(1.4,.3))c.ring(b.x-140,b.y,14,260,{offset:t,style:'big',r:12,color:VIOLET,accel:-260,wait:.95,reaim:1,reaimSpeed:280});}}
 ]},
 {until:0,attacks:[
  {name:'주포 「뇌운」',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,210,.42);if(ev(3,.2))c.laser(b.x-230,b.y+10,Math.PI,{width:96,warn:1.1,life:1.7,color:CYAN,owner:b,length:2600});if(ev(1.3,.9))c.fan(b.x-120,b.y+80,c.aim(b.x-120,b.y+80),5,.2,300,{style:'rice',color:ORANGE});}},
  {name:'함포 그물',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,160,.45);if(ev(1.25,.2))for(const s of [-1,1])c.fan(b.x-160,b.y+s*90,Math.PI-s*.32,9,.11,190,{style:'rice',color:s>0?ORANGE:BLUE});if(ev(2.5,1))c.bullet(b.x-200,b.y,c.aim(b.x-200,b.y),330,{style:'big',r:13,color:VIOLET});}},
  {name:'폭풍 함대',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,60,.4,c.W-230);if(ev(.62)){const gap=c.H/2+Math.sin(t*.9)*c.H*.29;for(let y=26;y<c.H;y+=36)if(Math.abs(y-gap)>90)c.bullet(c.W+20,y,Math.PI,240,{style:'rice',color:BLUE,r:5});}if(ev(.55,.25))c.bullet(b.x-200,b.y,c.aim(b.x-200,b.y),420,{style:'needle',color:WHITE,r:4});}}
 ]}
]});

const BOSS3=boss({kind:'boss3',name:'불가사리',title:'쇠를 먹는 괴수',mark:'넷째 수호신',phases:[
 {until:0,attacks:[
  {name:'화로 분출',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,130,.6);const k=ev(.16);for(let i=0;i<k;i++)c.bullet(b.x-40,b.y-90,-Math.PI/2-.35-c.rand()*1.1,300+c.rand()*150,{gravity:360,style:'orb',color:ORANGE,r:7});if(ev(1.4,.5))c.fan(b.x-100,b.y,c.aim(b.x-100,b.y),5,.16,320,{style:'rice',color:RED});}},
  {name:'불티 그물',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,150,.6);const k=ev(.16);for(let i=0;i<k;i++){const up=c.rand()<.5;c.bullet(c.W+10,c.rand()*c.H,Math.PI+(up?-.38:.38),170,{style:'rice',color:up?ORANGE:RED,r:5});}if(ev(1.6,.6)){const a=c.aim(b.x-100,b.y);for(const d of [-.3,0,.3])c.bullet(b.x-100,b.y,a+d,240,{style:'orb',color:YELLOW,r:7});}}},
  {name:'쇠바늘 사격',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,180,.8);if(ev(.9,.2))c.fan(b.x-100,b.y,c.aim(b.x-100,b.y),5,.2,330,{style:'rice',color:YELLOW});if(ev(1.8,.6))c.ring(b.x-60,b.y,22,170,{offset:t,color:ORANGE,r:6});}}
 ]},
 {until:0,attacks:[
  {name:'용광로 고리',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,140,.5);if(ev(1.6,.3))c.ring(b.x-80,b.y,9,230,{offset:t*.8,style:'big',r:14,color:RED,accel:-180,wait:.9,split:8,splitSpeed:200});}},
  {name:'쇠 발톱',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,130,.55);const k=ev(.2);for(let i=0;i<k;i++)for(const s of [-1,1])c.bullet(b.x-80,b.y+s*60,Math.PI+s*1.1,190,{turn:-s*.95,accel:30,maxSpeed:300,color:s>0?RED:ORANGE,r:6});if(ev(2,.7))c.fan(b.x-100,b.y,c.aim(b.x-100,b.y),5,.13,260,{style:'needle',color:WHITE,r:4});}},
  {name:'쇳물 비',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,200,.65);const k=ev(.09);for(let i=0;i<k;i++)c.bullet(c.rand()*c.W*.9,-14,Math.PI/2+(c.rand()-.5)*.3,170+c.rand()*110,{style:'orb',color:ORANGE,r:6,accel:40,maxSpeed:310});if(ev(1.1,.5))c.fan(b.x-100,b.y,c.aim(b.x-100,b.y),3,.18,360,{style:'needle',color:WHITE,r:4});}}
 ]},
 {until:0,attacks:[
  {name:'십자 그물',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,90,.5);if(ev(2.8,.2)){const px=c.player.x,py=c.player.y;for(const dx of [-180,0,180])c.laser(px+dx,-20,Math.PI/2,{width:40,warn:1.05,life:.8,length:1000,color:ORANGE});c.later(1.4,()=>{for(const dy of [-140,0,140])c.laser(-20,py+dy,0,{width:40,warn:1.05,life:.8,length:2600,color:RED});});}if(ev(.12))c.bullet(b.x-60,b.y,t*2.6,200,{color:YELLOW,r:5});}},
  {name:'쇳물 장막',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,70,.4);if(ev(.5)){const gap=c.H/2+Math.sin(t*.8)*c.H*.32;for(let y=24;y<c.H;y+=34)if(Math.abs(y-gap)>80)c.bullet(c.W+16,y,Math.PI,200,{style:'orb',color:ORANGE,r:6});}if(ev(1.4,.7))c.bullet(b.x-100,b.y,c.aim(b.x-100,b.y),300,{style:'big',r:12,color:RED});}},
  {name:'업화',dur:10,run:(b,c,t,ev)=>{b.tx=c.W-290;b.ty=c.H/2+Math.sin(t*.5)*72;const k=ev(.06);for(let i=0;i<k;i++)for(let a=0;a<3;a++){c.bullet(b.x-50,b.y,t*2.1+a*TAU/3,240,{color:RED,r:6});}if(ev(.3))for(let a=0;a<2;a++)c.bullet(b.x-50,b.y,-t*1.1+a*Math.PI,170,{style:'big',r:12,color:ORANGE});}}
 ]}
]});

const BOSS4=boss({kind:'boss4',name:'빙룡',title:'설산의 기계 용',mark:'여섯째 수호신',phases:[
 {until:0,attacks:[
  {name:'서리 송곳',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,170,.6);if(ev(1.3,.3))c.fan(b.x-150,b.y-40,Math.PI,13,.17,400,{style:'needle',color:CYAN,r:4,accel:-500,wait:.75,reaim:1,reaimSpeed:340});}},
  {name:'고드름 장막',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,150,.5);const k=ev(.07);for(let i=0;i<k;i++){const x=40+(c.time*173)%(c.W-340);c.bullet(x,-12,Math.PI/2,110,{style:'needle',color:CYAN,r:4,accel:120,maxSpeed:320});}if(ev(1.6,.6))c.fan(b.x-150,b.y,c.aim(b.x-150,b.y),3,.2,260,{style:'rice',color:WHITE});}},
  {name:'빙결 고리',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,80,.5);if(ev(.75,.2))c.ring(b.x-80,b.y,32,180,{offset:t*.4,gap:4,gapAt:Math.floor(t*2),color:BLUE,r:6});}}
 ]},
 {until:0,attacks:[
  {name:'눈보라 숨결',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,150,.55);const k=ev(.05);for(let i=0;i<k;i++)c.bullet(b.x-190,b.y-50,Math.PI+Math.sin(t*1.4)*.75,270,{style:'rice',color:CYAN,r:5});const s=ev(.36);for(let i=0;i<s;i++)c.bullet(c.W+10,c.rand()*c.H,Math.PI+(c.rand()-.5)*.3,120+c.rand()*60,{color:WHITE,r:5});}},
  {name:'눈송이 꽃',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,160,.6);if(ev(1.1,.2)){const x=b.x-180,y=b.y,a=c.aim(x,y);c.bullet(x,y,a,260,{style:'big',r:14,color:BLUE,accel:-200,wait:1.1,split:12,splitSpeed:150});}if(ev(.6,.4))c.ring(b.x-60,b.y,8,170,{offset:t*1.3,color:CYAN,r:5});}},
  {name:'빙정 낙하',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,180,.7);if(ev(.7,.3))c.bullet(150+c.rand()*(c.W-450),-20,Math.PI/2,280,{style:'big',r:14,color:BLUE,accel:-260,wait:1,split:7,splitSpeed:190});if(ev(1.5,.8))c.fan(b.x-150,b.y,c.aim(b.x-150,b.y),3,.25,320,{style:'rice',color:CYAN});}}
 ]},
 {until:0,attacks:[
  {name:'오로라 광선',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,110,.45);if(ev(3.2,.2)){const a=c.aim(b.x-150,b.y);for(let i=-2;i<=2;i++)c.laser(b.x-150,b.y-40,a+i*.34,{width:40,warn:1,life:1.5,spin:(i%2?1:-1)*.22,color:i%2?CYAN:VIOLET,owner:b});}if(ev(.95,.5))c.ring(b.x-80,b.y,18,180,{offset:t,color:WHITE,r:5});}},
  {name:'얼음 거울',dur:8,run:(b,c,t,ev)=>{b.tx=c.W-290;b.ty=c.H/2;const k=ev(.1);for(let i=0;i<k;i++){const w=Math.sin(t*1.3)*1.3;c.bullet(b.x-60,b.y,Math.PI+w,220,{color:CYAN,r:6});c.bullet(b.x-60,b.y,Math.PI-w,220,{color:VIOLET,r:6});}}},
  {name:'절대영도',dur:10,run:(b,c,t,ev)=>{b.tx=c.W-290;b.ty=c.H/2;if(ev(.42)){const f=Math.floor(t/.42)%2;c.ring(b.x-60,b.y,20,f?150:220,{offset:f?t*.3:-t*.3,color:f?BLUE:CYAN,r:6});}if(ev(1.7,.9))c.fan(b.x-150,b.y,c.aim(b.x-150,b.y),5,.12,380,{style:'needle',color:WHITE,r:4});}}
 ]}
]});

const BOSS5=boss({kind:'boss5',name:'뇌공',title:'천둥 궁궐의 주인',mark:'마지막 수호신',phases:[
 {until:0,attacks:[
  {name:'뇌고 연타',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,140,.5);for(let d=0;d<8;d++)if(ev(1.6,d*.2)){const a=d/8*TAU+t*.2,x=b.x+Math.cos(a)*190,y=b.y+Math.sin(a)*150;c.ring(x,y,9,190,{offset:a,color:d%2?YELLOW:VIOLET,r:6});}}},
  {name:'북 장단',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,120,.5);for(const off of [0,.3,.6,1.2,1.5,1.8,2.4,2.7])if(ev(3.2,off))c.ring(b.x-80,b.y,18,180,{offset:t*2,color:off<1?YELLOW:off<2?VIOLET:PINK,r:6});}},
  {name:'천둥 화살',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,200,.7);if(ev(1.3,.2)){const base=c.aim(b.x-120,b.y);for(let i=0;i<8;i++)c.later(i*.06,()=>{for(const d of [-.32,0,.32])c.bullet(b.x-120,b.y,base+d,500,{style:'needle',color:YELLOW,r:4});});}}}
 ]},
 {until:0,attacks:[
  {name:'낙뢰',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,150,.5);if(ev(.95,.2)){const px=c.player.x;c.laser(px,-20,Math.PI/2,{width:62,warn:.75,life:.45,length:1000,color:YELLOW});}if(ev(1.2,.6))c.ring(b.x-60,b.y,20,170,{offset:t,color:VIOLET,r:6});}},
  {name:'징 울림',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,140,.5);if(ev(2,.3))c.ring(b.x-60,b.y,40,120,{offset:c.rand()*TAU,color:YELLOW,r:6,accel:40,maxSpeed:260});if(ev(.9,.8))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),3,.18,300,{style:'needle',color:WHITE,r:4});}},
  {name:'번개 그물',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,120,.6);if(ev(2.4,.2)){const py=c.player.y;for(const s of [-1,1])c.laser(0,py+s*-420,s*.42,{width:36,warn:1,life:1,length:2800,color:VIOLET});}if(ev(.8,.5))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),7,.15,290,{style:'rice',color:YELLOW});}}
 ]},
 {until:0,attacks:[
  {name:'뇌운 나선',dur:9,run:(b,c,t,ev)=>{b.tx=c.W-310;b.ty=c.H/2+Math.sin(t*.6)*56;const k=ev(.07);for(let i=0;i<k;i++){for(let a=0;a<2;a++)c.bullet(b.x-50,b.y,t*2.4+a*Math.PI,230,{color:YELLOW,r:6});c.bullet(b.x-50,b.y,-t*1.3,170,{color:VIOLET,r:6});}}},
  {name:'폭풍의 눈',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,100,.5);if(ev(.5))c.ring(b.x-60,b.y,16,190,{offset:t,turn:(Math.floor(t/.5)%2?1:-1)*.55,color:PINK,r:6});if(ev(1.6,.8))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),3,.15,400,{style:'needle',color:WHITE,r:4});}}
 ]},
 {until:0,attacks:[
  {name:'천뢰',dur:12,run:(b,c,t,ev)=>{b.tx=c.W-300;b.ty=c.H/2+Math.sin(t*.7)*96;const k=ev(.09);for(let i=0;i<k;i++)for(let a=0;a<3;a++)c.bullet(b.x-50,b.y,t*1.9+a*TAU/3,220,{color:a===0?YELLOW:VIOLET,r:6});if(ev(1.6,.4))c.laser(c.player.x,-20,Math.PI/2,{width:58,warn:.8,life:.45,length:1000,color:YELLOW});if(ev(2.2,1.2))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),5,.13,360,{style:'needle',color:WHITE,r:4});}}
 ]}
]});

const BOSS6=boss({kind:'boss6',name:'구미호',title:'대숲의 아홉 꼬리',mark:'셋째 수호신',phases:[
 {until:0,attacks:[
  {name:'여우불 꼬리',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,150,.6);if(ev(1.3,.3))for(let i=0;i<9;i++){const y=b.y-160+i*40,x=b.x+120;c.bullet(x,y,Math.PI+(i-4)*.06,240,{color:CYAN,r:7,accel:-300,wait:.8,reaim:1,reaimSpeed:250});}}},
  {name:'홀림 안개',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,120,.5);const k=ev(.16);for(let i=0;i<k;i++){const s=c.rand()<.5?1:-1;c.bullet(b.x-60,b.y+s*40,Math.PI+s*.5,170,{turn:-s*.42,color:PINK,r:6});}if(ev(1.6,.6))c.fan(b.x-100,b.y,c.aim(b.x-100,b.y),3,.2,260,{style:'rice',color:WHITE});}},
  {name:'꼬리 휘두르기',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,90,.45);const k=ev(.05);for(let i=0;i<k;i++){const a=Math.PI+Math.sin(t*1.6)*1.1;c.bullet(b.x+40,b.y,a,250,{style:'rice',color:ORANGE,r:5});}}}
 ]},
 {until:0,attacks:[
  {name:'아홉 갈래',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,70,.4);const k=ev(.16);for(let i=0;i<k;i++)for(let a=0;a<9;a++)c.bullet(b.x-40,b.y,t*.7+a*TAU/9,170,{color:a%3?CYAN:PINK,r:6});}},
  {name:'여우 구슬',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,160,.6);if(ev(1.2,.3)){const x=b.x-140,y=b.y,a=c.aim(x,y);c.bullet(x,y,a,280,{style:'big',r:15,color:PINK,accel:-260,wait:1,split:14,splitSpeed:160});}}},
  {name:'둔갑',dur:8,run:(b,c,t,ev)=>{if(ev(1.6)){b.tx=c.W-200-c.rand()*260;b.ty=110+c.rand()*(c.H-220);}if(ev(1.6,.7)){c.fan(b.x-100,b.y,c.aim(b.x-100,b.y),7,.14,270,{style:'rice',color:CYAN});c.ring(b.x,b.y,14,150,{offset:t,color:PINK,r:6});}}}
 ]},
 {until:0,attacks:[
  {name:'천년 여우비',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,130,.5);const k=ev(.1);for(let i=0;i<k;i++)c.bullet(c.rand()*c.W*.9,-14,Math.PI/2+.35,170+c.rand()*80,{style:'rice',color:CYAN,r:5});if(ev(1.3,.5))c.fan(b.x-100,b.y,c.aim(b.x-100,b.y),5,.15,300,{style:'needle',color:WHITE,r:4});}},
  {name:'구미호 진혼',dur:10,run:(b,c,t,ev)=>{b.tx=c.W-280;b.ty=c.H/2;const k=ev(.11);for(let i=0;i<k;i++)for(let a=0;a<3;a++){c.bullet(b.x-40,b.y,t*1.8+a*TAU/3,210,{turn:.25,color:CYAN,r:6});c.bullet(b.x-40,b.y,-t*1.8+a*TAU/3,210,{turn:-.25,color:PINK,r:6});}}}
 ]}
]});

const BOSS7=boss({kind:'boss7',name:'삼족오',title:'해를 품은 세발까마귀',mark:'다섯째 수호신',phases:[
 {until:0,attacks:[
  {name:'세 발 불꽃',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,160,.6);if(ev(1.2,.3)){const a=c.aim(b.x-120,b.y);for(let i=0;i<6;i++)c.later(i*.08,()=>{for(const d of [-.3,0,.3])c.bullet(b.x-120,b.y,a+d,280,{color:ORANGE,r:6});});}}},
  {name:'해무리',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,100,.5);if(ev(.8,.2))c.ring(b.x-60,b.y,30,170,{offset:t*.5,gap:5,gapAt:Math.floor(t*3),color:YELLOW,r:6});}},
  {name:'깃털 비',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,140,.5);const k=ev(.09);for(let i=0;i<k;i++)c.bullet(c.W*.2+c.rand()*c.W*.8,-14,Math.PI/2+.55,190+c.rand()*60,{style:'needle',color:WHITE,r:4});if(ev(1.5,.4))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),5,.16,280,{style:'rice',color:RED});}}
 ]},
 {until:0,attacks:[
  {name:'태양 고리',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,120,.5);if(ev(1.4,.3))c.ring(b.x-60,b.y,24,280,{offset:t,style:'big',r:11,color:ORANGE,accel:-320,wait:.85,reaim:1,reaimSpeed:230});}},
  {name:'날개 바람',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,60,.4,c.W-230);if(ev(.6)){const gap=c.H/2+Math.sin(t*1.1)*c.H*.3;for(let y=26;y<c.H;y+=36)if(Math.abs(y-gap)>88)c.bullet(c.W+20,y,Math.PI+Math.sin(t*1.1+y*.01)*.1,230,{style:'rice',color:YELLOW,r:5});}}},
  {name:'불새 돌진',dur:8,run:(b,c,t,ev)=>{const ph=Math.floor(t/2)%2;b.tx=c.W-260;b.ty=ph?c.H*.18:c.H*.82;const k=ev(.12);for(let i=0;i<k;i++)c.bullet(b.x-60,b.y,Math.PI+(c.rand()-.5)*.9,150+c.rand()*90,{color:RED,r:6});}}
 ]},
 {until:0,attacks:[
  {name:'일식',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,80,.4);if(ev(3.2,.2))for(let i=0;i<3;i++)c.laser(b.x-60,b.y,Math.PI+(i-1)*.6,{width:36,warn:1.3,life:1.6,spin:.18,color:ORANGE,owner:b});if(ev(.9,.6))c.ring(b.x-60,b.y,16,170,{offset:t,color:YELLOW,r:6});}},
  {name:'해를 품다',dur:10,run:(b,c,t,ev)=>{b.tx=c.W-290;b.ty=c.H/2+Math.sin(t*.6)*80;const k=ev(.09);for(let i=0;i<k;i++)for(let a=0;a<3;a++)c.bullet(b.x-50,b.y,t*1.7+a*TAU/3,220,{color:a?ORANGE:YELLOW,r:6});if(ev(1.8,.8))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),3,.18,340,{style:'needle',color:WHITE,r:4});}}
 ]}
]});

const BOSS8=boss({kind:'boss8',name:'저승차사',title:'저승길의 문지기',mark:'일곱째 수호신',phases:[
 {until:0,attacks:[
  {name:'명부 낭독',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,110,.45);if(ev(.9)){const off=(Math.floor(t/.9)%2)*30;for(let y=30+off;y<c.H;y+=60)c.bullet(c.W+16,y,Math.PI,180,{style:'rice',color:VIOLET,r:5});}if(ev(1.7,.5))c.bullet(b.x-120,b.y,c.aim(b.x-120,b.y),300,{style:'big',r:12,color:CYAN});}},
  {name:'쇠사슬',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,150,.6);if(ev(1.1,.3)){const x=b.x-120,y=b.y-60,a=c.aim(x,y);for(let i=0;i<9;i++)c.later(i*.06,()=>c.bullet(x,y,a,220+i*10,{color:WHITE,r:5}));}if(ev(1.1,.85)){const x=b.x-120,y=b.y+60,a=c.aim(x,y);for(let i=0;i<9;i++)c.later(i*.06,()=>c.bullet(x,y,a,220+i*10,{color:CYAN,r:5}));}}},
  {name:'저승 문',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,90,.4);if(ev(2.4,.2)){const py=c.player.y;for(const dy of [-130,130])c.laser(-20,py+dy,0,{width:42,warn:1.1,life:1,length:2600,color:VIOLET});}if(ev(.7,.5))c.ring(b.x-60,b.y,12,160,{offset:t,color:CYAN,r:6});}}
 ]},
 {until:0,attacks:[
  {name:'원혼 소환',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,140,.5);if(ev(2.6,.4))for(let i=0;i<3;i++)dive(c,'ember',c.W*.5+i*110,110+c.rand()*(c.H-220),{hold:1.8,fire:aim1(CYAN,260,1.1,.5),exit:i%2?'up':'down',speed:8,tint:'#9fe8ff'});if(ev(1.5,1))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),5,.15,270,{style:'rice',color:VIOLET});}},
  {name:'갓 그림자',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,100,.5);if(ev(1.5,.3))c.ring(b.x-60,b.y,12,240,{offset:t,style:'big',r:13,color:VIOLET,accel:-280,wait:.9,reaim:1,reaimSpeed:250});}},
  {name:'삼도천 물결',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,120,.5);const k=ev(.07);for(let i=0;i<k;i++){const w=Math.sin(t*2.2);c.bullet(b.x-80,b.y,Math.PI+w*.6,230,{color:CYAN,r:6});c.bullet(b.x-80,b.y,Math.PI-w*.6,230,{color:BLUE,r:6});}}}
 ]},
 {until:0,attacks:[
  {name:'저승 꽃길',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,140,.5);const k=ev(.12);for(let i=0;i<k;i++)c.bullet(b.x-40,b.y-100,-Math.PI/2-.3-c.rand()*1.2,260+c.rand()*120,{gravity:300,color:RED,r:6});if(ev(1.2,.5))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),3,.2,320,{style:'needle',color:WHITE,r:4});}},
  {name:'명부 심판',dur:10,run:(b,c,t,ev)=>{b.tx=c.W-290;b.ty=c.H/2;const k=ev(.1);for(let i=0;i<k;i++){const f=Math.floor(t/1.5)%2?1:-1;for(let a=0;a<4;a++)c.bullet(b.x-40,b.y,f*t*1.4+a*TAU/4,200,{color:f>0?VIOLET:CYAN,r:6});}if(ev(2.2,1))c.laser(c.player.x,-20,Math.PI/2,{width:54,warn:.85,life:.45,length:1000,color:VIOLET});}}
 ]}
]});

// ───────────── stages ─────────────
export const STAGES:StageDef[]=[
 {chapter:'첫째 마당',name:'붉은 달의 계곡',sub:'산사 계곡 · 도깨비 장군 토벌',mark:'붉은 달',terrain:'valley',bg:'k-valley.webp',
  sky:['#c98577','#5d5470','#1f2a3e'],far:'#4c4a63',mid:'#2f3550',near:'#151d2c',fog:'#3a3f5a',accent:'#ff7d72',light:'#ffd6b8',
  weather:'petals',scroll:190,bossAt:ENCOUNTER_BOSS_AT[0],tint:'#ffffff',boss:BOSS1,
  waves:makeEncounterWaves(0)},
 {chapter:'둘째 마당',name:'구름바다 하늘길',sub:'하늘 항로 · 거북선 격침',mark:'구름바다',terrain:'clouds',bg:'k-clouds.webp',
  sky:['#f1c79a','#7aa3c8','#2b4a74'],far:'#e8eef7',mid:'#d7b4c4',near:'#f7e4e8',fog:'#f3d9dc',accent:'#6fd3ff',light:'#fff3d6',
  weather:'wisps',scroll:240,bossAt:ENCOUNTER_BOSS_AT[1],tint:'#ffffff',boss:BOSS2,
  waves:makeEncounterWaves(1)},
 {chapter:'셋째 마당',name:'달빛 대숲',sub:'대나무 숲 · 구미호 퇴치',mark:'대숲',terrain:'bamboo',bg:'k-bamboo.webp',
  sky:['#24405a','#152536','#0a1018'],far:'#1d3340',mid:'#13242c',near:'#08120f',fog:'#2c4c50',accent:'#8fffe0',light:'#e6fff4',
  weather:'fireflies',scroll:200,bossAt:ENCOUNTER_BOSS_AT[2],tint:'#e8fff6',boss:BOSS6,
  waves:makeEncounterWaves(2)},
 {chapter:'넷째 마당',name:'불꽃 제련성',sub:'쇠의 성 · 불가사리 퇴치',mark:'불꽃성',terrain:'forge',bg:'k-forge.webp',
  sky:['#ff9c55','#7a2f2a','#1d1013'],far:'#4a1f1d',mid:'#2d1414',near:'#120909',fog:'#7e3424',accent:'#ff8a3c',light:'#ffd07a',
  weather:'embers',scroll:220,bossAt:ENCOUNTER_BOSS_AT[3],tint:'#ffd7c2',boss:BOSS3,
  waves:makeEncounterWaves(3)},
 {chapter:'다섯째 마당',name:'별밤 서라벌',sub:'첨성대의 밤 · 삼족오 강림',mark:'서라벌',terrain:'night',bg:'k-night.webp',
  sky:['#3a3060','#1c1a40','#0a0a20'],far:'#2a2850',mid:'#1a1838',near:'#0c0b1c',fog:'#4a3f7a',accent:'#ffd27a',light:'#fff3c8',
  weather:'fireflies',scroll:220,bossAt:ENCOUNTER_BOSS_AT[4],tint:'#f2ecff',boss:BOSS7,
  waves:makeEncounterWaves(4)},
 {chapter:'여섯째 마당',name:'백설 산사',sub:'눈보라 고개 · 기계 용 봉인',mark:'흰 고개',terrain:'snow',bg:'k-snow.webp',
  sky:['#cfe0f2','#7d93b6','#26324d'],far:'#a9bad3',mid:'#6e819f',near:'#2c3850',fog:'#dbe7f4',accent:'#9fe0ff',light:'#ffffff',
  weather:'snow',scroll:250,bossAt:ENCOUNTER_BOSS_AT[5],tint:'#dcecff',boss:BOSS4,
  waves:makeEncounterWaves(5)},
 {chapter:'일곱째 마당',name:'저승길',sub:'삼도천 건너 · 저승차사와의 담판',mark:'저승길',terrain:'underworld',bg:'k-underworld.webp',
  sky:['#1d2e3a','#141c2c','#06080f'],far:'#1a2633',mid:'#101823',near:'#05080d',fog:'#2c4a52',accent:'#9ff0ff',light:'#e0fbff',
  weather:'souls',scroll:230,bossAt:ENCOUNTER_BOSS_AT[6],tint:'#dff6ff',boss:BOSS8,
  waves:makeEncounterWaves(6)},
 {chapter:'마지막 마당',name:'천뢰궁',sub:'뇌운 위의 궁궐 · 뇌공 결전',mark:'천둥궁',terrain:'storm',bg:'k-palace.webp',
  sky:['#8c79c9','#3a2d63','#0d0b1d'],far:'#3c3266',mid:'#241d44',near:'#0e0b1e',fog:'#5b4a9a',accent:'#ffd84a',light:'#fff6c4',
  weather:'rain',scroll:280,bossAt:ENCOUNTER_BOSS_AT[7],tint:'#e8dcff',boss:BOSS5,
  waves:makeEncounterWaves(7)}
];
