import type { BulletStyle, Enemy, EnemyKind, EnemyPath, FirePattern, Laser, Bullet } from './types';

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
}
export interface BulletOpts {r?:number; style?:BulletStyle; color?:string; accel?:number; maxSpeed?:number; turn?:number; gravity?:number; wait?:number; reaim?:number; reaimSpeed?:number; split?:number; splitSpeed?:number;}

export interface Wave {t:number; run:(c:Ctx)=>void;}
export interface BossAttack {name:string; dur:number; run:(b:Enemy,c:Ctx,t:number,every:(period:number,offset?:number)=>number)=>void;}
export interface BossPhase {until:number; attacks:BossAttack[];}
export interface BossDef {kind:EnemyKind; name:string; title:string; hanja:string; phases:BossPhase[];}
export type Terrain='valley'|'clouds'|'forge'|'snow'|'storm';
export interface StageDef {
  chapter:string; name:string; sub:string; hanja:string; terrain:Terrain; bg?:string;
  sky:[string,string,string]; far:string; mid:string; near:string; fog:string; accent:string; light:string;
  weather:'petals'|'wisps'|'embers'|'snow'|'rain'; scroll:number; bossAt:number; waves:Wave[]; boss:BossDef; tint:string;
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
  for(let i=0;i<n;i++)c.later(i*(o.gap??.35),()=>c.enemy(kind,c.W+60,90+c.rand()*(c.H-180),{type:'chase',speed:300},{tint:o.tint}));
}
function ground(c:Ctx,kind:EnemyKind,n:number,o:{gap?:number;fire?:FirePattern;tint?:string}={}) {
  for(let i=0;i<n;i++)c.later(i*(o.gap??1.1),()=>c.enemy(kind,c.W+110,c.H-92,{type:'ground',speed:170},{fire:o.fire??{type:'fan',n:3,spread:.22,speed:300,every:1.5,delay:.8,style:'rice',color:ORANGE},tint:o.tint}));
}
const aim1=(color:string,speed=330,every=1.6,delay=.7):FirePattern=>({type:'aim',speed,every,delay,color,style:'orb'});
const fan3=(color:string,speed=300,every=1.8,delay=.6):FirePattern=>({type:'fan',n:3,spread:.2,speed,every,delay,color,style:'rice'});
const ringP=(color:string,n=12,speed=210,every=2.2,delay=.9):FirePattern=>({type:'ring',n,speed,every,delay,color,style:'orb'});
const streamP=(color:string,count=5,speed=420,every=2.4,delay=.8):FirePattern=>({type:'stream',count,speed,every,delay,color,style:'needle'});

/** Build a ~80s timeline of mixed formations that escalates through the stage. */
function timeline(build:(at:(t:number,run:(c:Ctx)=>void)=>void)=>void):Wave[] {const list:Wave[]=[];build((t,run)=>list.push({t,run}));return list.sort((a,b)=>a.t-b.t);}

// ───────────── bosses ─────────────
const hover=(b:Enemy,c:Ctx,t:number,amp=170,speed=.75,x?:number)=>{b.tx=x??c.W-270;b.ty=c.H/2+Math.sin(t*speed)*amp;};

const BOSS1:BossDef={kind:'boss1',name:'나찰',title:'계곡의 수호신',hanja:'機神 · 羅刹',phases:[
 {until:.66,attacks:[
  {name:'一式 · 홍련 부채',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,190,.9);if(ev(.85,.4))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),7,.17,320,{style:'rice',color:RED});if(ev(.85,.82))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),6,.17,260,{style:'orb',color:ORANGE});}},
  {name:'二式 · 종소리 고리',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,60,.5);if(ev(1.1,.3)){const o=t*.7;c.ring(b.x-60,b.y+90,24,215,{offset:o,color:YELLOW,r:6});c.later(.16,()=>c.ring(b.x-60,b.y+90,24,265,{offset:o+TAU/48,color:ORANGE,r:6}));}}}
 ]},
 {until:.33,attacks:[
  {name:'三式 · 염주 나선',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,90,.6);const k=ev(.095);for(let i=0;i<k;i++)for(let a=0;a<2;a++)c.bullet(b.x-40,b.y,t*2.1+a*Math.PI,210,{color:VIOLET,r:6});if(ev(1.7,.5))c.fan(b.x-80,b.y,c.aim(b.x-80,b.y),3,.34,180,{style:'big',r:12,color:RED});}},
  {name:'四式 · 붉은 비',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,200,.7);const k=ev(.11);for(let i=0;i<k;i++)c.bullet(c.rand()*c.W*.85,-14,Math.PI/2+(c.rand()-.5)*.25,170+c.rand()*110,{style:'rice',color:ORANGE,r:5});if(ev(1.25,.4))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),5,.14,340,{style:'rice',color:RED});}}
 ]},
 {until:0,attacks:[
  {name:'五式 · 나찰 광선',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,120,.45);if(ev(2.6,.2)){const a=c.aim(b.x-60,b.y);for(const d of [-.42,0,.42])c.laser(b.x-60,b.y,a+d,{width:46,warn:.95,life:1.35,spin:d===0?0:-d*.35,color:RED,owner:b});}if(ev(.85,.6))c.ring(b.x-60,b.y,16,200,{offset:t,color:PINK,r:6});}},
  {name:'終式 · 백팔번뇌',dur:9,run:(b,c,t,ev)=>{b.tx=c.W-300;b.ty=c.H/2;const k=ev(.2);for(let i=0;i<k;i++){const flip=Math.floor(t/.2)%2?1:-1;c.ring(b.x-40,b.y,13,165,{offset:t*1.6*flip,color:flip>0?RED:YELLOW,accel:90,maxSpeed:300,r:6});}}}
 ]}
]};

const BOSS2:BossDef={kind:'boss2',name:'질풍함',title:'구름바다의 기함',hanja:'嵐艦 · 疾風',phases:[
 {until:.66,attacks:[
  {name:'一式 · 측면 일제사격',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,150,.5);if(ev(1.5,.3))for(let i=0;i<6;i++){const px=b.x-170+i*62,py=b.y+70;c.later(i*.06,()=>c.fan(px,py,Math.PI-.15+i*.03,3,.22,330,{style:'rice',color:ORANGE}));}}},
  {name:'二式 · 프로펠러 돌풍',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,110,.8);const k=ev(.11);for(let i=0;i<k;i++){c.ring(b.x+170,b.y-70,5,210,{offset:t*3.1,color:CYAN,r:5});c.ring(b.x+170,b.y+70,5,210,{offset:-t*3.1,color:BLUE,r:5});}}}
 ]},
 {until:.33,attacks:[
  {name:'三式 · 연 띄우기',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,170,.6);if(ev(2.4,.4))for(let i=0;i<3;i++)dive(c,'kite',c.W*.45+i*120,150+c.rand()*(c.H-300),{hold:1.6,fire:aim1(PINK,360,1,.5),exit:i%2?'up':'down',speed:8});if(ev(1.6,1))for(let i=0;i<7;i++)c.later(i*.07,()=>c.bullet(b.x-200,b.y,c.aim(b.x-200,b.y),560,{style:'needle',color:WHITE,r:4}));}},
  {name:'四式 · 정지 폭뢰',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,120,.5);if(ev(1.4,.3))c.ring(b.x-140,b.y,14,260,{offset:t,style:'big',r:12,color:VIOLET,accel:-260,wait:.95,reaim:1,reaimSpeed:300});}}
 ]},
 {until:0,attacks:[
  {name:'五式 · 주포 「뇌운」',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,210,.42);if(ev(3,.2))c.laser(b.x-230,b.y+10,Math.PI,{width:96,warn:1.1,life:1.7,color:CYAN,owner:b,length:2600});if(ev(1.3,.9))c.fan(b.x-120,b.y+80,c.aim(b.x-120,b.y+80),5,.2,300,{style:'rice',color:ORANGE});}},
  {name:'終式 · 폭풍 함대',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,60,.4,c.W-230);if(ev(.62)){const gap=c.H/2+Math.sin(t*.9)*260;for(let y=30;y<c.H;y+=38)if(Math.abs(y-gap)>95)c.bullet(c.W+20,y,Math.PI,250,{style:'rice',color:BLUE,r:5});}if(ev(.55,.25))c.bullet(b.x-200,b.y,c.aim(b.x-200,b.y),470,{style:'needle',color:WHITE,r:4});}}
 ]}
]};

const BOSS3:BossDef={kind:'boss3',name:'염주',title:'용광로의 거미 전차',hanja:'炎蛛 · 鐵脚',phases:[
 {until:.66,attacks:[
  {name:'一式 · 화로 분출',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,130,.6);const k=ev(.16);for(let i=0;i<k;i++)c.bullet(b.x-40,b.y-90,-Math.PI/2-.35-c.rand()*1.1,330+c.rand()*170,{gravity:420,style:'orb',color:ORANGE,r:7});if(ev(1.4,.5))c.fan(b.x-100,b.y,c.aim(b.x-100,b.y),5,.16,320,{style:'rice',color:RED});}},
  {name:'二式 · 거미줄 사격',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,180,.8);if(ev(.9,.2))c.fan(b.x-100,b.y,c.aim(b.x-100,b.y),5,.2,360,{style:'rice',color:YELLOW});if(ev(1.8,.6))c.ring(b.x-60,b.y,22,170,{offset:t,color:ORANGE,r:6});}}
 ]},
 {until:.33,attacks:[
  {name:'三式 · 용광로 고리',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,140,.5);if(ev(1.6,.3))c.ring(b.x-80,b.y,9,230,{offset:t*.8,style:'big',r:14,color:RED,accel:-180,wait:.9,split:8,splitSpeed:210});}},
  {name:'四式 · 쇳물 비',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,200,.65);const k=ev(.09);for(let i=0;i<k;i++)c.bullet(c.rand()*c.W*.9,-14,Math.PI/2+(c.rand()-.5)*.3,180+c.rand()*120,{style:'orb',color:ORANGE,r:6,accel:40,maxSpeed:330});if(ev(1.1,.5))c.fan(b.x-100,b.y,c.aim(b.x-100,b.y),3,.18,380,{style:'needle',color:WHITE,r:4});}}
 ]},
 {until:0,attacks:[
  {name:'五式 · 십자 그물',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,90,.5);if(ev(2.8,.2)){const px=c.player.x,py=c.player.y;for(const dx of [-180,0,180])c.laser(px+dx,-20,Math.PI/2,{width:40,warn:1.05,life:.8,length:1000,color:ORANGE});c.later(1.4,()=>{for(const dy of [-150,0,150])c.laser(-20,py+dy,0,{width:40,warn:1.05,life:.8,length:2600,color:RED});});}if(ev(.12))c.bullet(b.x-60,b.y,t*2.6,200,{color:YELLOW,r:5});}},
  {name:'終式 · 업화',dur:10,run:(b,c,t,ev)=>{b.tx=c.W-300;b.ty=c.H/2+Math.sin(t*.5)*90;const k=ev(.06);for(let i=0;i<k;i++)for(let a=0;a<3;a++){c.bullet(b.x-50,b.y,t*2.1+a*TAU/3,250,{color:RED,r:6});}if(ev(.3))for(let a=0;a<2;a++)c.bullet(b.x-50,b.y,-t*1.1+a*Math.PI,170,{style:'big',r:12,color:ORANGE});}}
 ]}
]};

const BOSS4:BossDef={kind:'boss4',name:'빙룡',title:'설산의 기계 용',hanja:'氷龍 · 白嶺',phases:[
 {until:.66,attacks:[
  {name:'一式 · 서리 송곳',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,170,.6);if(ev(1.3,.3))c.fan(b.x-150,b.y-40,Math.PI,13,.17,420,{style:'needle',color:CYAN,r:4,accel:-500,wait:.75,reaim:1,reaimSpeed:380});}},
  {name:'二式 · 빙결 고리',dur:7,run:(b,c,t,ev)=>{hover(b,c,t,80,.5);if(ev(.75,.2))c.ring(b.x-80,b.y,32,190,{offset:t*.4,gap:4,gapAt:Math.floor(t*2),color:BLUE,r:6});}}
 ]},
 {until:.33,attacks:[
  {name:'三式 · 눈보라 숨결',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,150,.55);const k=ev(.04);for(let i=0;i<k;i++)c.bullet(b.x-190,b.y-50,Math.PI+Math.sin(t*1.7)*.75,340,{style:'rice',color:CYAN,r:5});const s=ev(.2);for(let i=0;i<s;i++)c.bullet(c.W+10,c.rand()*c.H,Math.PI+(c.rand()-.5)*.4,140+c.rand()*80,{color:WHITE,r:5});}},
  {name:'四式 · 빙정 낙하',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,180,.7);if(ev(.7,.3))c.bullet(150+c.rand()*(c.W-450),-20,Math.PI/2,300,{style:'big',r:14,color:BLUE,accel:-260,wait:1,split:7,splitSpeed:200});if(ev(1.5,.8))c.fan(b.x-150,b.y,c.aim(b.x-150,b.y),3,.25,330,{style:'rice',color:CYAN});}}
 ]},
 {until:0,attacks:[
  {name:'五式 · 오로라 광선',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,110,.45);if(ev(3.2,.2)){const a=c.aim(b.x-150,b.y);for(let i=-2;i<=2;i++)c.laser(b.x-150,b.y-40,a+i*.34,{width:40,warn:1,life:1.5,spin:(i%2?1:-1)*.22,color:i%2?CYAN:VIOLET,owner:b});}if(ev(.95,.5))c.ring(b.x-80,b.y,18,180,{offset:t,color:WHITE,r:5});}},
  {name:'終式 · 절대영도',dur:10,run:(b,c,t,ev)=>{b.tx=c.W-290;b.ty=c.H/2;if(ev(.42)){const f=Math.floor(t/.42)%2;c.ring(b.x-60,b.y,20,f?150:230,{offset:f?t*.3:-t*.3,color:f?BLUE:CYAN,r:6});}if(ev(1.7,.9))c.fan(b.x-150,b.y,c.aim(b.x-150,b.y),5,.12,400,{style:'needle',color:WHITE,r:4});}}
 ]}
]};

const BOSS5:BossDef={kind:'boss5',name:'뇌제',title:'천뢰궁의 주인',hanja:'雷帝 · 天雷',phases:[
 {until:.75,attacks:[
  {name:'一式 · 뇌고 연타',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,140,.5);for(let d=0;d<8;d++)if(ev(1.6,d*.2)){const a=d/8*TAU+t*.2,x=b.x+Math.cos(a)*190,y=b.y+Math.sin(a)*150;c.ring(x,y,9,190,{offset:a,color:d%2?YELLOW:VIOLET,r:6});}}},
  {name:'二式 · 천둥 화살',dur:8,run:(b,c,t,ev)=>{hover(b,c,t,200,.7);if(ev(1.3,.2)){const base=c.aim(b.x-120,b.y);for(let i=0;i<8;i++)c.later(i*.06,()=>{for(const d of [-.32,0,.32])c.bullet(b.x-120,b.y,base+d,560,{style:'needle',color:YELLOW,r:4});});}}}
 ]},
 {until:.5,attacks:[
  {name:'三式 · 낙뢰',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,150,.5);if(ev(.95,.2)){const px=c.player.x;c.laser(px,-20,Math.PI/2,{width:62,warn:.75,life:.45,length:1000,color:YELLOW});}if(ev(1.2,.6))c.ring(b.x-60,b.y,20,170,{offset:t,color:VIOLET,r:6});}},
  {name:'四式 · 번개 그물',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,120,.6);if(ev(2.4,.2)){const py=c.player.y;for(const s of [-1,1])c.laser(0,py+s*-420,s*.42,{width:36,warn:1,life:1,length:2800,color:VIOLET});}if(ev(.8,.5))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),7,.15,300,{style:'rice',color:YELLOW});}}
 ]},
 {until:.22,attacks:[
  {name:'五式 · 뇌운 나선',dur:9,run:(b,c,t,ev)=>{b.tx=c.W-310;b.ty=c.H/2+Math.sin(t*.6)*70;const k=ev(.07);for(let i=0;i<k;i++){for(let a=0;a<2;a++)c.bullet(b.x-50,b.y,t*2.4+a*Math.PI,240,{color:YELLOW,r:6});c.bullet(b.x-50,b.y,-t*1.3,180,{color:VIOLET,r:6});}}},
  {name:'六式 · 폭풍의 눈',dur:9,run:(b,c,t,ev)=>{hover(b,c,t,100,.5);if(ev(.5))c.ring(b.x-60,b.y,16,200,{offset:t,turn:(Math.floor(t/.5)%2?1:-1)*.55,color:PINK,r:6});if(ev(1.6,.8))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),3,.15,420,{style:'needle',color:WHITE,r:4});}}
 ]},
 {until:0,attacks:[
  {name:'終式 · 천뢰',dur:12,run:(b,c,t,ev)=>{b.tx=c.W-300;b.ty=c.H/2+Math.sin(t*.7)*120;const k=ev(.09);for(let i=0;i<k;i++)for(let a=0;a<3;a++)c.bullet(b.x-50,b.y,t*1.9+a*TAU/3,230,{color:a===0?YELLOW:VIOLET,r:6});if(ev(1.6,.4))c.laser(c.player.x,-20,Math.PI/2,{width:58,warn:.8,life:.45,length:1000,color:YELLOW});if(ev(2.2,1.2))c.fan(b.x-120,b.y,c.aim(b.x-120,b.y),5,.13,380,{style:'needle',color:WHITE,r:4});}}
 ]}
]};

// ───────────── stages ─────────────
export const STAGES:StageDef[]=[
 {chapter:'第一章',name:'붉은 달의 계곡',sub:'홍련 계곡 · 기계 수호신 토벌',hanja:'紅月',terrain:'valley',bg:'shrine-valley.webp',
  sky:['#c98577','#5d5470','#1f2a3e'],far:'#4c4a63',mid:'#2f3550',near:'#151d2c',fog:'#3a3f5a',accent:'#ff7d72',light:'#ffd6b8',
  weather:'petals',scroll:430,bossAt:78,tint:'#ffffff',boss:BOSS1,
  waves:timeline(at=>{
   at(1.5,c=>stream(c,'drone',6,c.H*.3,{fire:aim1(RED,320,9,1.2)}));
   at(4.5,c=>stream(c,'drone',6,c.H*.7,{fire:aim1(RED,320,9,1.2)}));
   at(8,c=>swoop(c,'wing',5,true,{fire:fan3(ORANGE,300,9,1)}));
   at(12,c=>{dive(c,'drone',c.W*.62,c.H*.25,{fire:fan3(RED),hold:2});dive(c,'drone',c.W*.62,c.H*.75,{fire:fan3(RED),hold:2});});
   at(15,c=>swoop(c,'wing',5,false,{fire:fan3(ORANGE,300,9,1)}));
   at(18,c=>darts(c,'drone',6));
   at(21,c=>ground(c,'turret',3));
   at(24,c=>{stream(c,'drone',5,c.H*.2,{sine:60});stream(c,'drone',5,c.H*.8,{sine:60});});
   at(28,c=>dive(c,'brute',c.W*.68,c.H*.5,{hold:4,fire:ringP(PINK,14,200,1.6,.6),drop:'power'}));
   at(33,c=>swoop(c,'wing',6,true,{fire:fan3(ORANGE,320,9,.8)}));
   at(36,c=>swoop(c,'wing',6,false,{fire:fan3(ORANGE,320,9,.8)}));
   at(40,c=>{for(let i=0;i<4;i++)dive(c,'drone',c.W*(.55+i*.08),c.H*(.18+i*.21),{hold:2.2,fire:streamP(RED,4,400,3,.6),exit:i<2?'up':'down'});});
   at(45,c=>darts(c,'wing',7,{gap:.3}));
   at(49,c=>{ground(c,'turret',2);stream(c,'drone',6,c.H*.35,{sine:90});});
   at(54,c=>{dive(c,'brute',c.W*.7,c.H*.3,{hold:3.5,fire:fan3(RED,280,1.2,.5),drop:'gauge'});dive(c,'brute',c.W*.7,c.H*.72,{hold:3.5,fire:aim1(ORANGE,340,1,.8)});});
   at(60,c=>{swoop(c,'wing',5,true,{fire:aim1(RED,360,9,.8)});swoop(c,'wing',5,false,{fire:aim1(RED,360,9,.8)});});
   at(65,c=>darts(c,'drone',9,{gap:.25}));
   at(69,c=>{for(let i=0;i<3;i++)dive(c,'turret',c.W*.62,c.H*(.22+i*.28),{hold:3,fire:ringP(YELLOW,10,200,1.8,.7)});});
   at(74,c=>stream(c,'drone',8,c.H*.5,{sine:180,gap:.2}));
  })},
 {chapter:'第二章',name:'구름바다 하늘길',sub:'하늘 항로 · 폭풍 기함 격침',hanja:'雲海',terrain:'clouds',bg:'cloud-sea.webp',
  sky:['#f1c79a','#7aa3c8','#2b4a74'],far:'#e8eef7',mid:'#d7b4c4',near:'#f7e4e8',fog:'#f3d9dc',accent:'#6fd3ff',light:'#fff3d6',
  weather:'wisps',scroll:560,bossAt:80,tint:'#ffffff',boss:BOSS2,
  waves:timeline(at=>{
   at(1.5,c=>{stream(c,'kite',7,c.H*.25,{sine:70,fire:aim1(PINK,340,9,1)});});
   at(4,c=>stream(c,'kite',7,c.H*.75,{sine:70,fire:aim1(PINK,340,9,1)}));
   at(7,c=>swoop(c,'wing',6,true,{fire:fan3(BLUE)}));
   at(10,c=>darts(c,'kite',8,{gap:.28}));
   at(13,c=>{for(let i=0;i<3;i++)dive(c,'drone',c.W*.6,c.H*(.2+i*.3),{fire:streamP(BLUE,5,430),tint:'#bfe6ff'});});
   at(17,c=>swoop(c,'wing',6,false,{fire:fan3(BLUE)}));
   at(20,c=>{stream(c,'kite',6,c.H*.15,{sine:40});stream(c,'kite',6,c.H*.5,{sine:40});stream(c,'kite',6,c.H*.85,{sine:40});});
   at(25,c=>darts(c,'wing',7,{gap:.3}));
   at(29,c=>{swoop(c,'kite',7,true,{fire:aim1(PINK,360,9,.7)});swoop(c,'kite',7,false,{fire:aim1(PINK,360,9,.7)});});
   at(35,c=>dive(c,'brute',c.W*.66,c.H*.5,{hold:11,mid:true,scale:1.35,hp:900,fire:{type:'spiral',n:3,speed:220,every:.12,delay:1,color:CYAN},drop:'life',tint:'#cfe8ff'}));
   at(48,c=>darts(c,'kite',10,{gap:.22}));
   at(52,c=>{for(let i=0;i<4;i++)dive(c,'wing',c.W*(.5+i*.1),c.H*(.15+i*.23),{fire:ringP(CYAN,12,190,1.6,.6),hold:2.6});});
   at(58,c=>{stream(c,'drone',7,c.H*.3,{sine:120,tint:'#bfe6ff',fire:aim1(BLUE,360,9,.9)});stream(c,'drone',7,c.H*.7,{sine:120,tint:'#bfe6ff',fire:aim1(BLUE,360,9,.9)});});
   at(64,c=>{swoop(c,'wing',7,true,{fire:fan3(CYAN,330,9,.6)});});
   at(67,c=>{swoop(c,'wing',7,false,{fire:fan3(CYAN,330,9,.6)});});
   at(71,c=>darts(c,'kite',12,{gap:.2}));
   at(75,c=>{for(let i=0;i<2;i++)dive(c,'turret',c.W*.66,c.H*(.3+i*.4),{hold:3,fire:streamP(WHITE,6,450,1.6,.5),tint:'#d8eaff'});});
  })},
 {chapter:'第三章',name:'불꽃 제련성',sub:'용광로 도시 · 거미 전차 파괴',hanja:'炎都',terrain:'forge',bg:'forge-city.webp',
  sky:['#ff9c55','#7a2f2a','#1d1013'],far:'#4a1f1d',mid:'#2d1414',near:'#120909',fog:'#7e3424',accent:'#ff8a3c',light:'#ffd07a',
  weather:'embers',scroll:520,bossAt:80,tint:'#ffd7c2',boss:BOSS3,
  waves:timeline(at=>{
   at(1.5,c=>stream(c,'ember',7,c.H*.3,{sine:80,fire:aim1(ORANGE,340,9,1)}));
   at(4,c=>stream(c,'ember',7,c.H*.7,{sine:80,fire:aim1(ORANGE,340,9,1)}));
   at(7,c=>ground(c,'turret',3,{tint:'#ffb38a'}));
   at(10,c=>darts(c,'ember',8,{gap:.3}));
   at(13,c=>{swoop(c,'wing',6,true,{fire:fan3(RED),tint:'#ffb38a'});swoop(c,'wing',6,false,{fire:fan3(RED),tint:'#ffb38a'});});
   at(19,c=>{for(let i=0;i<3;i++)dive(c,'ember',c.W*.58,c.H*(.2+i*.3),{fire:ringP(ORANGE,14,210,1.4,.5),hold:2.4});});
   at(23,c=>{ground(c,'turret',3,{tint:'#ffb38a',fire:{type:'ring',n:10,speed:200,every:1.8,delay:.8,color:RED}});stream(c,'ember',6,c.H*.25,{sine:60});});
   at(29,c=>darts(c,'wing',8,{gap:.26}));
   at(34,c=>dive(c,'brute',c.W*.66,c.H*.5,{hold:11,mid:true,scale:1.4,hp:1000,fire:{type:'ring',n:18,speed:210,every:.7,delay:1,color:ORANGE},drop:'life',tint:'#ffb08a'}));
   at(47,c=>{stream(c,'ember',8,c.H*.2,{sine:100,fire:aim1(RED,360,9,.8)});stream(c,'ember',8,c.H*.8,{sine:100,fire:aim1(RED,360,9,.8)});});
   at(53,c=>{for(let i=0;i<4;i++)dive(c,'drone',c.W*(.5+i*.1),c.H*(.18+i*.21),{fire:streamP(YELLOW,5,450,2.2,.5),tint:'#ffb38a'});});
   at(58,c=>darts(c,'ember',10,{gap:.22}));
   at(62,c=>ground(c,'turret',4,{tint:'#ffb38a',gap:.9}));
   at(65,c=>{swoop(c,'wing',7,true,{fire:fan3(ORANGE,340,9,.6),tint:'#ffb38a'});});
   at(68,c=>{swoop(c,'wing',7,false,{fire:fan3(ORANGE,340,9,.6),tint:'#ffb38a'});});
   at(72,c=>{dive(c,'brute',c.W*.7,c.H*.28,{hold:4,fire:fan3(RED,300,1,.5),tint:'#ffb08a'});dive(c,'brute',c.W*.7,c.H*.72,{hold:4,fire:fan3(RED,300,1,.5),tint:'#ffb08a'});});
  })},
 {chapter:'第四章',name:'백설 산사',sub:'눈보라 고개 · 기계 용 봉인',hanja:'白嶺',terrain:'snow',bg:'snow-temple.webp',
  sky:['#cfe0f2','#7d93b6','#26324d'],far:'#a9bad3',mid:'#6e819f',near:'#2c3850',fog:'#dbe7f4',accent:'#9fe0ff',light:'#ffffff',
  weather:'snow',scroll:600,bossAt:80,tint:'#dcecff',boss:BOSS4,
  waves:timeline(at=>{
   at(1.5,c=>stream(c,'frost',8,c.H*.3,{sine:90,fire:aim1(CYAN,360,9,1)}));
   at(4,c=>stream(c,'frost',8,c.H*.7,{sine:90,fire:aim1(CYAN,360,9,1)}));
   at(7.5,c=>{swoop(c,'wing',6,true,{fire:fan3(BLUE,340),tint:'#cfe6ff'});swoop(c,'wing',6,false,{fire:fan3(BLUE,340),tint:'#cfe6ff'});});
   at(13,c=>darts(c,'frost',10,{gap:.25}));
   at(17,c=>{for(let i=0;i<3;i++)dive(c,'turret',c.W*.6,c.H*(.2+i*.3),{fire:{type:'fan',n:9,spread:.12,speed:380,every:1.6,delay:.5,color:CYAN,style:'needle'},hold:2.6,tint:'#cfe6ff'});});
   at(22,c=>{stream(c,'frost',7,c.H*.15,{sine:50});stream(c,'frost',7,c.H*.5,{sine:50});stream(c,'frost',7,c.H*.85,{sine:50});});
   at(27,c=>darts(c,'wing',9,{gap:.24}));
   at(32,c=>dive(c,'brute',c.W*.66,c.H*.5,{hold:12,mid:true,scale:1.4,hp:1150,fire:{type:'spiral',n:4,speed:230,every:.11,delay:1,color:BLUE},drop:'life',tint:'#cfe6ff'}));
   at(46,c=>{for(let i=0;i<4;i++)dive(c,'frost',c.W*(.5+i*.1),c.H*(.16+i*.22),{fire:ringP(WHITE,16,200,1.3,.5),hold:2.4});});
   at(51,c=>darts(c,'frost',12,{gap:.2}));
   at(55,c=>{swoop(c,'wing',8,true,{fire:fan3(CYAN,360,9,.5),tint:'#cfe6ff'});});
   at(58,c=>{swoop(c,'wing',8,false,{fire:fan3(CYAN,360,9,.5),tint:'#cfe6ff'});});
   at(62,c=>{stream(c,'drone',8,c.H*.3,{sine:160,tint:'#cfe6ff',fire:streamP(WHITE,3,460,9,.8)});stream(c,'drone',8,c.H*.7,{sine:160,tint:'#cfe6ff',fire:streamP(WHITE,3,460,9,.8)});});
   at(68,c=>{dive(c,'brute',c.W*.7,c.H*.3,{hold:4,fire:ringP(CYAN,16,220,1.1,.5),tint:'#cfe6ff'});dive(c,'brute',c.W*.7,c.H*.7,{hold:4,fire:ringP(BLUE,16,220,1.1,.9),tint:'#cfe6ff'});});
   at(74,c=>darts(c,'frost',12,{gap:.18}));
  })},
 {chapter:'終章',name:'천뢰궁',sub:'뇌운 위의 궁전 · 뇌제 결전',hanja:'天雷',terrain:'storm',bg:'thunder-palace.webp',
  sky:['#8c79c9','#3a2d63','#0d0b1d'],far:'#3c3266',mid:'#241d44',near:'#0e0b1e',fog:'#5b4a9a',accent:'#ffd84a',light:'#fff6c4',
  weather:'rain',scroll:660,bossAt:82,tint:'#e8dcff',boss:BOSS5,
  waves:timeline(at=>{
   at(1.5,c=>{stream(c,'storm',7,c.H*.25,{sine:80,fire:aim1(YELLOW,380,9,1)});stream(c,'storm',7,c.H*.75,{sine:80,fire:aim1(VIOLET,380,9,1)});});
   at(6,c=>darts(c,'storm',10,{gap:.25}));
   at(10,c=>{swoop(c,'wing',7,true,{fire:fan3(YELLOW,360),tint:'#d9c8ff'});swoop(c,'wing',7,false,{fire:fan3(VIOLET,360),tint:'#d9c8ff'});});
   at(15,c=>{for(let i=0;i<4;i++)dive(c,'storm',c.W*(.5+i*.1),c.H*(.16+i*.22),{fire:ringP(YELLOW,14,220,1.3,.5),hold:2.4});});
   at(20,c=>ground(c,'turret',4,{tint:'#d9c8ff',fire:{type:'stream',count:4,speed:460,every:1.6,delay:.6,color:YELLOW,style:'needle'},gap:.9}));
   at(25,c=>darts(c,'wing',10,{gap:.22}));
   at(30,c=>dive(c,'brute',c.W*.66,c.H*.5,{hold:12,mid:true,scale:1.45,hp:1300,fire:{type:'spiral',n:5,speed:230,every:.12,delay:1,color:VIOLET},drop:'life',tint:'#d9c8ff'}));
   at(44,c=>{stream(c,'storm',8,c.H*.15,{sine:60});stream(c,'storm',8,c.H*.5,{sine:60});stream(c,'storm',8,c.H*.85,{sine:60});});
   at(49,c=>{for(let i=0;i<3;i++)dive(c,'turret',c.W*.62,c.H*(.2+i*.3),{fire:{type:'fan',n:7,spread:.16,speed:360,every:1.2,delay:.4,color:VIOLET,style:'rice'},hold:3,tint:'#d9c8ff'});});
   at(55,c=>darts(c,'storm',14,{gap:.17}));
   at(60,c=>{swoop(c,'wing',8,true,{fire:fan3(YELLOW,380,9,.5),tint:'#d9c8ff'});swoop(c,'wing',8,false,{fire:fan3(YELLOW,380,9,.5),tint:'#d9c8ff'});});
   at(66,c=>{dive(c,'brute',c.W*.72,c.H*.28,{hold:4,fire:{type:'spiral',n:3,speed:220,every:.14,delay:.5,color:YELLOW},tint:'#d9c8ff'});dive(c,'brute',c.W*.72,c.H*.72,{hold:4,fire:{type:'spiral',n:3,speed:220,every:.14,delay:.5,color:VIOLET},tint:'#d9c8ff'});});
   at(72,c=>{stream(c,'storm',10,c.H*.35,{sine:200,gap:.18,fire:aim1(YELLOW,400,9,.7)});stream(c,'storm',10,c.H*.65,{sine:200,gap:.18,fire:aim1(VIOLET,400,9,.7)});});
  })}
];
