import { ENEMIES, type Enemy, type EnemyKind, type FirePattern } from './types';
import type { BulletOpts, Ctx, Wave } from './stages';

/** Each chapter changes the player's task, rather than replaying the opening with a tint. */
export const STAGE_TACTICS = [
  { title:'부수고 길을 열어라', hint:'표식이 붙은 적을 격파하면 탄막이 사라져요. 가까이 다가가 근접 공격과 차지를 시험해 보세요.', objective:'표식 적 격파 → 탄막 제거 → 전진' },
  { title:'함포의 틈을 노려라', hint:'수송함은 포격 뒤 잠깐 쉬어요. 예고선을 피한 뒤 포신 쪽으로 접근해 함대를 끊으세요.', objective:'2초 간격 함포 사이로 접근 · 포격함 우선 격파' },
  { title:'대숲의 빈 길을 읽어라', hint:'위아래 교차 광선 사이에는 넓은 길이 남아요. 예고선을 보고 가운데로 이동한 뒤 발사원을 부수세요.', objective:'중앙 안전 통로 확보 · 광선 부적 격파' },
  { title:'용광로의 심장을 꺼라', hint:'상단과 하단의 화로탑이 회전 광선을 만들어요. 한쪽 탑부터 집중 공격하면 그 광선이 멎어요.', objective:'화로탑 파괴 → 회전 광선 차단' },
  { title:'별비 사이의 길을 따라라', hint:'별은 위에서 천천히 내려와요. 별이 없는 세로 길이 조금씩 움직이니 다음 빈틈을 먼저 찾으세요.', objective:'움직이는 별비 통로 따라가기' },
  { title:'눈보라의 문을 넘어라', hint:'얼음 장벽의 틈은 위아래로 바뀌어요. 해빙 광선이 예고되면 남겨진 세로 통로를 이용하세요.', objective:'장벽의 틈 이동 · 해빙 통로 확보' },
  { title:'추격의 주인을 끊어라', hint:'원혼탄은 잠시 멎은 뒤 다시 조준해요. 표식 호위령을 먼저 부수면 그 원혼탄도 함께 사라져요.', objective:'멈춘 원혼탄에 속지 말고 호위령 우선 격파' },
  { title:'배운 길을 하나로 엮어라', hint:'함포, 별비, 광선이 차례로 이어져요. 짧은 숨 돌릴 틈을 쓰고 표식 지휘관부터 끊으세요.', objective:'익힌 패턴의 연계 돌파 · 지휘관 격파' },
] as const;

/** World seconds. There is no second copy of the opening at 80 seconds. */
export const ENCOUNTER_BOSS_AT = [94,102,98,104,100,106,102,110] as const;
export const ENCOUNTER_LIMITS = {
  laserWarning:1.25,
  minimumGap:180,
  starGap:240,
  snowGap:190,
  sourceLead:1.8,
} as const;

const RED='#ff4767',ORANGE='#ff9a3c',VIOLET='#b779ff',BLUE='#58b4ff',CYAN='#3fe6d6',YELLOW='#ffd84a',PINK='#ff6fd8',WHITE='#e8f4ff';
const NONE:FirePattern={type:'none',every:10000};
type SourceFire=(e:Enemy,c:Ctx,index:number)=>void;
type SourceOptions={hp?:number;hold?:number;scale?:number;drop?:Enemy['drop'];kind?:EnemyKind};

function timeline(build:(at:(time:number,run:(c:Ctx)=>void)=>void)=>void):Wave[] {
  const waves:Wave[]=[];build((t,run)=>waves.push({t,run}));return waves.sort((a,b)=>a.t-b.t);
}
function announce(c:Ctx,title:string,hint:string):void { c.announce(title,hint); }
function start(c:Ctx,index:number):void { const tactic=STAGE_TACTICS[index];announce(c,tactic.title,tactic.hint); }

/** Every delayed source attack checks its source again; dead or escaped sources cannot fire. */
function sourceSalvos(c:Ctx,e:Enemy,count:number,period:number,fire:SourceFire,delay:number=ENCOUNTER_LIMITS.sourceLead):void {
  for(let i=0;i<count;i++)c.later(delay+i*period,()=>{
    if(e.hp<=0||e.x<=120||e.x>=c.W-40||e.y<30||e.y>c.H-30)return;
    fire(e,c,i);
  });
}
function source(c:Ctx,x:number,y:number,o:SourceOptions={}):Enemy {
  return c.enemy(o.kind??'turret',c.W+120,y,
    {type:'dive',speed:4.5,stopX:x,stopY:y,hold:o.hold??9,exit:'back'},
    {hp:o.hp??480,fire:NONE,mid:true,scale:o.scale??1,drop:o.drop??'gauge'});
}
function aimed(c:Ctx,e:Enemy,n=3,speed=250,color=RED,spread=.2,o:BulletOpts={}):void {
  const x=e.x-60,y=e.y;
  // A close approach is the reward window, not an unavoidable point-blank shot.
  if(x-c.player.x<180||Math.hypot(x-c.player.x,y-c.player.y)<240)return;
  c.fan(x,y,c.aim(x,y),n,spread,speed,{style:'rice',color,...o});
}
function train(c:Ctx,kind:EnemyKind,count:number,y:number,o:{speed?:number;sine?:number;gap?:number;fire?:FirePattern}={}):void {
  for(let i=0;i<count;i++)c.later(i*(o.gap??.36),()=>c.enemy(kind,c.W+80,y,
    {type:'line',speed:o.speed??310,sineAmp:o.sine??0,sineFreq:2},
    {hp:ENEMIES[kind].hp*.85,fire:o.fire??NONE}));
}
function arc(c:Ctx,kind:EnemyKind,count:number,top:boolean,depth=.58,fire:FirePattern=NONE):void {
  const sy=top?-65:c.H+65,cy=top?c.H*depth:c.H*(1-depth),ey=top?c.H*.2:c.H*.8;
  for(let i=0;i<count;i++)c.later(i*.32,()=>c.enemy(kind,c.W+60,sy,
    {type:'arc',speed:0,sx:c.W+60,sy,cx:c.W*.54,cy,ex:-140,ey,duration:5.1},
    {fire,hp:ENEMIES[kind].hp*.8}));
}

/** A destructible ship, with a readable broadside and a distinct quiet approach window. */
function cannonShip(c:Ctx,y:number,o:SourceOptions&{x?:number;cycles?:number;offset?:number}={}):Enemy {
  const e=source(c,o.x??c.W*.77,y,{hp:500,hold:10,...o});
  sourceSalvos(c,e,o.cycles??4,2,(ship,ctx)=>{
    ctx.laser(ship.x-65,ship.y,Math.PI,{owner:ship,width:40,warn:1.25,life:.48,length:ctx.W+100,color:CYAN});
  },o.offset??1.8);
  return e;
}
function convoy(c:Ctx,offset=0):void {
  cannonShip(c,c.H*.25,{x:c.W*.8,hp:600,cycles:5});
  c.later(1.1,()=>cannonShip(c,c.H*.75,{x:c.W*.7,hp:600,cycles:4,offset:2+offset}));
}

/** The entire central band remains at least 180 px wide even on the widest world. */
function bambooGates(c:Ctx,cycles=4,hold=12):void {
  for(const side of [-1,1]) {
    const y=c.H*(side<0?.15:.85),e=source(c,c.W*.8,y,{kind:'ember',hp:420,hold,scale:1.2});
    sourceSalvos(c,e,cycles,2.8,(gate,ctx,i)=>{
      // Cross only in the outer bands; their low angle never closes the middle corridor.
      for(const bend of [.025,.085])ctx.laser(gate.x-30,gate.y,Math.PI+side*bend,
        {owner:gate,width:28,warn:1.35,life:.72,length:ctx.W+120,color:i%2?PINK:CYAN});
    },2+(side>0?.35:0));
  }
}

/** Destroying the tower cancels both pending fire and its owned beam. */
function forgeTowers(c:Ctx,cycles=4,strong=false):void {
  for(const side of [-1,1]) {
    const e=source(c,c.W*.79,c.H*(side<0?.15:.85),{hp:strong?820:580,hold:14,scale:1.15,drop:side<0?'power':'gauge'});
    sourceSalvos(c,e,cycles,3.1,(tower,ctx,i)=>{
      const angle=Math.PI+side*(i%2?.11:.035);
      ctx.laser(tower.x-55,tower.y,angle,{owner:tower,width:46,warn:1.45,life:.85,spin:side*(i%2?-.055:.055),length:ctx.W+150,color:ORANGE});
      // The two sparks follow the beam's lane; the middle remains an approach route.
      ctx.later(1.65,()=>{if(tower.hp>0)ctx.fan(tower.x-60,tower.y,Math.PI+side*.17,2,.06,185,{style:'orb',color:RED,owner:tower});});
    },2+(side>0?.7:0));
  }
}

const STAR_ROUTE=[.26,.32,.41,.5,.6,.68,.61,.5,.39,.3];
/** Slow overhead rows leave an authored moving vertical corridor; no player-position targeting. */
function starfall(c:Ctx,rows:number,startIndex=0,period=1.25):void {
  for(let i=0;i<rows;i++)c.later(i*period,()=>{
    const centre=c.W*STAR_ROUTE[(i+startIndex)%STAR_ROUTE.length],half=ENCOUNTER_LIMITS.starGap/2;
    for(let x=30;x<c.W-15;x+=48)if(Math.abs(x-centre)>half)c.bullet(x,-18,Math.PI/2,145,
      {style:i%3===0?'rice':'orb',color:i%2?WHITE:YELLOW,r:5});
  });
}
function constellation(c:Ctx):void {
  const e=source(c,c.W*.83,c.H*.22,{kind:'storm',hp:780,hold:12,scale:1.25,drop:'life'});
  sourceSalvos(c,e,5,2.1,(star,ctx,i)=>{
    const centre=ctx.W*STAR_ROUTE[(i+2)%STAR_ROUTE.length];
    for(let x=36;x<ctx.W-15;x+=55)if(Math.abs(x-centre)>140)ctx.bullet(x,-15,Math.PI/2,160,{style:'rice',r:5,color:WHITE,owner:star});
  },2.2);
}

/** Leftward walls have a 190 px doorway, alternating high/low with a transition row. */
function snowWalls(c:Ctx,rows:number,startIndex=0,period=2.25):void {
  const route=[.27,.5,.73,.5];
  for(let i=0;i<rows;i++)c.later(i*period,()=>{
    const gap=c.H*route[(i+startIndex)%route.length];
    for(let y=22;y<c.H;y+=29)if(Math.abs(y-gap)>ENCOUNTER_LIMITS.snowGap/2)c.bullet(c.W+18,y,Math.PI,185,
      {style:'needle',color:i%2?CYAN:WHITE,r:4});
  });
}
/** Tall columns flank one broad, explicitly announced thaw passage. */
function thaw(c:Ctx,right=false):void {
  const safe=c.W*(right?.64:.3);
  announce(c,'해빙 통로',right?'오른쪽 빈 세로 길로 이동하세요.':'왼쪽 빈 세로 길로 이동하세요.');
  for(let x=c.W*.14;x<c.W*.95;x+=c.W*.18)if(Math.abs(x-safe)>125)c.laser(x,-20,Math.PI/2,
    {width:44,warn:1.5,life:.65,length:c.H+40,color:BLUE});
}

/** Escort spells are linked to their caster, including the delayed re-aiming projectiles. */
function ghostEscort(c:Ctx,y:number,o:SourceOptions&{cycles?:number;offset?:number}={}):Enemy {
  const ghost=source(c,c.W*.75,y,{kind:'ember',hp:470,hold:10,scale:1.22,...o});
  sourceSalvos(c,ghost,o.cycles??4,2.4,(e,ctx,i)=>{
    if(e.x-ctx.player.x<200)return;
    const a=ctx.aim(e.x-45,e.y);
    ctx.fan(e.x-45,e.y,a,5,.2,160,{style:'big',r:9,color:i%2?CYAN:VIOLET,accel:-185,wait:1.35,reaim:1,reaimSpeed:230,owner:e});
  },o.offset??2);
  return ghost;
}
function pursuingGhosts(c:Ctx,count:number,top:boolean):void {
  for(let i=0;i<count;i++)c.later(i*.75,()=>c.enemy('ember',c.W+70,c.H*(top?.22:.78),
    {type:'chase',speed:150},{hp:48,fire:NONE}));
}
function commander(c:Ctx,y:number,color:string):Enemy {
  const e=source(c,c.W*.8,y,{kind:'brute',hp:1000,hold:10,scale:1.2,drop:'life'});
  sourceSalvos(c,e,4,2.5,(unit,ctx,i)=>{
    aimed(ctx,unit,5,230,color,.17,{owner:unit});
    if(i%2)ctx.laser(unit.x-60,unit.y,Math.PI,{owner:unit,width:36,warn:1.3,life:.55,color,length:ctx.W+80});
  },2.2);
  return e;
}

function valley():Wave[] {return timeline(at=>{
  at(.8,c=>start(c,0));
  at(1.8,c=>train(c,'drone',4,c.H*.47,{speed:260}));
  at(6.5,c=>train(c,'drone',5,c.H*.25,{speed:300,fire:{type:'aim',every:2.5,delay:1.3,speed:215,color:RED}}));
  at(11,c=>arc(c,'wing',4,false,.48));
  at(16,c=>{
    announce(c,'표식 적을 노려라','차지를 모아 방패병을 격파하면 주변 탄막이 사라져요.');
    const e=source(c,c.W*.73,c.H*.5,{kind:'brute',hp:500,hold:8,drop:'power'});
    sourceSalvos(c,e,3,2.7,(unit,ctx)=>aimed(ctx,unit,3,210,RED));
  });
  at(25,c=>train(c,'drone',5,c.H*.62,{speed:290,sine:35}));
  at(29,c=>{
    announce(c,'위아래를 번갈아','사격선을 비켜서 다가가세요. 근접 공격도 탄을 지워요.');
    for(const side of [-1,1]){
      const e=source(c,c.W*.76,c.H*(side<0?.25:.75),{hp:350,hold:8});
      sourceSalvos(c,e,3,2.3,(unit,ctx)=>aimed(ctx,unit,3,230,ORANGE),2+(side>0?1:0));
    }
  });
  at(39,c=>arc(c,'wing',5,true,.55));
  at(44,c=>arc(c,'drone',5,false,.53));
  at(49,c=>{
    announce(c,'갈라진 꽃길','큰 적의 옆으로 비켜서 빈틈을 만들고 다시 공격하세요.');
    const e=source(c,c.W*.77,c.H*.5,{kind:'brute',hp:850,hold:10,drop:'life',scale:1.15});
    sourceSalvos(c,e,4,2.5,(unit,ctx,i)=>ctx.ring(unit.x-55,unit.y,14,155,
      {offset:.1,gap:5,gapAt:i%2?4:5,color:PINK,r:5,owner:unit}),2.1);
  });
  at(62,c=>train(c,'drone',6,c.H*.24,{speed:320,sine:45}));
  at(66,c=>train(c,'drone',6,c.H*.76,{speed:320,sine:45}));
  at(71,c=>{
    announce(c,'차지로 길을 열어라','이번에는 두 사격수를 빠르게 끊어 보세요.');
    for(const side of [-1,1]){
      const e=source(c,c.W*.78,c.H*(side<0?.28:.72),{kind:'wing',hp:380,hold:7,scale:1.15});
      sourceSalvos(c,e,3,2,(unit,ctx)=>aimed(ctx,unit,4,240,RED,.15),1.8+(side>0?.7:0));
    }
  });
  at(81,c=>{
    announce(c,'계곡 돌파','표식 장수를 격파해 마지막 길을 여세요.');
    commander(c,c.H*.5,ORANGE);
  });
  at(88,c=>announce(c,'고요한 종소리','무기를 모으고 도깨비 장군을 맞을 준비를 하세요.'));
});}

function clouds():Wave[] {return timeline(at=>{
  at(.8,c=>start(c,1));
  at(1.5,c=>cannonShip(c,c.H*.29,{cycles:3,hold:8}));
  at(3,c=>train(c,'kite',4,c.H*.72,{speed:300}));
  at(11,c=>{
    announce(c,'함포 뒤의 빈틈','푸른 예고선이 꺼진 뒤 포신 앞을 가로지르세요.');
    cannonShip(c,c.H*.7,{cycles:4,hold:10,x:c.W*.72});
  });
  at(18,c=>convoy(c));
  at(30,c=>{
    announce(c,'보급 항로','포격이 잠시 멎었어요. 작은 수송기를 격파하며 힘을 모으세요.');
    train(c,'kite',7,c.H*.5,{speed:280,sine:50,gap:.45});
  });
  at(36,c=>{
    announce(c,'호위함 대형','위아래 포격함 중 하나를 먼저 부수면 이동할 길이 넓어져요.');
    convoy(c,.25);
    c.later(5,()=>train(c,'drone',4,c.H*.5,{speed:300}));
  });
  at(51,c=>{arc(c,'kite',5,true,.6);c.later(2.3,()=>arc(c,'kite',5,false,.6));});
  at(59,c=>{
    announce(c,'교대 포격','서로 다른 박자의 함포예요. 한 번 피하고 다시 공격하세요.');
    cannonShip(c,c.H*.2,{cycles:4,hold:10,x:c.W*.82});
    cannonShip(c,c.H*.8,{cycles:4,hold:10,x:c.W*.71,offset:2.8});
  });
  at(73,c=>train(c,'wing',6,c.H*.48,{speed:350,sine:70}));
  at(80,c=>{
    announce(c,'봉쇄 함대','가까운 함선부터 격침해 거북선으로 가는 길을 여세요.');
    convoy(c,.4);
    c.later(4,()=>cannonShip(c,c.H*.5,{hp:650,hold:8,cycles:3,x:c.W*.84}));
  });
  at(96,c=>announce(c,'구름 너머의 기함','함포가 멎었어요. 다가오는 거북선을 준비하세요.'));
});}

function bamboo():Wave[] {return timeline(at=>{
  at(.8,c=>start(c,2));
  at(1.5,c=>bambooGates(c,3,9));
  at(5,c=>train(c,'kite',4,c.H*.5,{speed:280,sine:25}));
  at(14,c=>{
    announce(c,'엇갈린 부적','광선은 바깥쪽에서 교차해요. 중앙 길을 지키며 부적을 끊으세요.');
    bambooGates(c,3,10);
  });
  at(20,c=>arc(c,'wing',4,true,.42));
  at(27,c=>arc(c,'wing',4,false,.42));
  at(34,c=>{
    announce(c,'대숲의 매듭','두 광선 부적을 부수면 숲의 결계가 풀려요.');
    bambooGates(c,5,15);
    c.later(4.2,()=>train(c,'ember',4,c.H*.5,{speed:250,sine:36}));
  });
  at(51,c=>{
    announce(c,'바람이 열린 길','잠시 결계가 멎었어요. 흩어진 작은 적을 노리세요.');
    arc(c,'kite',6,true,.7);
  });
  at(59,c=>{arc(c,'kite',6,false,.7);});
  at(66,c=>{
    bambooGates(c,3,10);
    c.later(3.5,()=>train(c,'ember',4,c.H*.5,{speed:300}));
  });
  at(81,c=>{
    announce(c,'여우의 봉인문','바깥 결계에 닿지 말고 가운데로 빠져나가세요.');
    bambooGates(c,4,12);
  });
  at(93,c=>announce(c,'달빛이 멎는 자리','결계 너머 구미호가 기다리고 있어요.'));
});}

function forge():Wave[] {return timeline(at=>{
  at(.8,c=>start(c,3));
  at(1.5,c=>forgeTowers(c,3));
  at(7,c=>train(c,'ember',4,c.H*.5,{speed:260,sine:20}));
  at(17,c=>{
    announce(c,'식은 화로','첫 화로가 멎었어요. 날아오는 쇳조각을 정리하세요.');
    arc(c,'drone',5,true,.62);c.later(2.5,()=>arc(c,'drone',5,false,.62));
  });
  at(28,c=>forgeTowers(c,3));
  at(40,c=>{
    announce(c,'쌍화로 가동','회전하는 광선의 주인인 화로탑을 먼저 부수세요.');
    forgeTowers(c,5,true);
  });
  at(56,c=>{
    announce(c,'제련로 냉각','쉬는 동안 적을 정리하고 궁극기 기운을 모으세요.');
    train(c,'ember',7,c.H*.42,{speed:280,sine:80,gap:.42});
  });
  at(66,c=>{
    const e=source(c,c.W*.8,c.H*.5,{kind:'brute',hp:1050,hold:9,drop:'life',scale:1.2});
    sourceSalvos(c,e,3,2.6,(unit,ctx)=>aimed(ctx,unit,5,220,ORANGE,.19,{owner:unit}),2);
  });
  at(81,c=>{
    announce(c,'불가사리의 심장부','남은 두 화로를 꺼서 괴수가 있는 제련로로 들어가세요.');
    forgeTowers(c,5,true);
  });
  at(99,c=>announce(c,'용광로 침묵','광선이 멎었어요. 쇠를 먹는 괴수가 다가옵니다.'));
});}

function night():Wave[] {return timeline(at=>{
  at(.8,c=>start(c,4));
  at(1.5,c=>starfall(c,8));
  at(5,c=>train(c,'kite',4,c.H*.72,{speed:240,sine:25}));
  at(15,c=>{
    announce(c,'별자리 이동','빈 세로 길이 오른쪽으로 이어져요. 다음 줄의 틈을 보세요.');
    starfall(c,9,3);
  });
  at(21,c=>train(c,'storm',3,c.H*.2,{speed:240}));
  at(31,c=>{
    announce(c,'별을 부르는 자','표식 별지기를 격파하면 그가 부른 별비가 사라져요.');
    constellation(c);
  });
  at(46,c=>{
    announce(c,'긴 별빛 사이','별비가 잠시 쉬어요. 날아오는 까마귀 떼를 정리하세요.');
    arc(c,'wing',5,true,.65);c.later(2.5,()=>arc(c,'wing',5,false,.65));
  });
  at(58,c=>starfall(c,10,5));
  at(66,c=>train(c,'kite',4,c.H*.7,{speed:280}));
  at(78,c=>{
    announce(c,'첨성대의 마지막 별','서로 다른 속도의 별비 속에서 표식 별지기를 노리세요.');
    constellation(c);starfall(c,9,0,1.4);
  });
  at(95,c=>announce(c,'삼족오의 그림자','별이 잦아들었어요. 태양의 까마귀를 맞을 준비를 하세요.'));
});}

function snow():Wave[] {return timeline(at=>{
  at(.8,c=>start(c,5));
  at(1.5,c=>snowWalls(c,5));
  at(5,c=>train(c,'frost',3,c.H*.15,{speed:245}));
  at(15,c=>thaw(c,false));
  at(19,c=>{
    announce(c,'엇갈린 눈문','장벽이 아래와 위로 번갈아 열려요. 벽이 올 때마다 빈 문을 찾으세요.');
    snowWalls(c,5,2);
  });
  at(33,c=>{
    announce(c,'고개를 지키는 얼음핵','표식 얼음핵부터 부수고 해빙 길을 확보하세요.');
    const e=source(c,c.W*.8,c.H*.5,{kind:'frost',hp:820,hold:12,scale:1.55,drop:'life'});
    sourceSalvos(c,e,4,2.7,(unit,ctx,i)=>{
      const gap=ctx.H*(i%2?.68:.32);
      for(let y=24;y<ctx.H;y+=32)if(Math.abs(y-gap)>110)ctx.bullet(unit.x-40,y,Math.PI,175,{style:'needle',color:CYAN,r:4,owner:unit});
    },2.2);
    c.later(5,()=>thaw(c,true));
  });
  at(49,c=>{
    announce(c,'눈보라가 멎는 고개','틈이 넓어졌어요. 작은 얼음새를 격파하며 정비하세요.');
    arc(c,'frost',5,true,.58);c.later(2.8,()=>arc(c,'frost',5,false,.58));
  });
  at(62,c=>snowWalls(c,5,1));
  at(75,c=>thaw(c,true));
  at(81,c=>{
    announce(c,'빙룡의 문턱','마지막 눈문을 넘고, 예고된 해빙 기둥을 피하세요.');
    snowWalls(c,6,0);
    c.later(6,()=>thaw(c,false));
  });
  at(101,c=>announce(c,'설산의 깊은 숨','장벽이 걷혔어요. 얼음 속의 용이 깨어납니다.'));
});}

function underworld():Wave[] {return timeline(at=>{
  at(.8,c=>start(c,6));
  at(1.5,c=>ghostEscort(c,c.H*.33,{cycles:3,hold:8}));
  at(4,c=>pursuingGhosts(c,3,false));
  at(12,c=>{
    announce(c,'멈춘 뒤 다시 날아온다','원혼탄은 한 번 더 조준해요. 멈춘 탄에서 떨어지거나 호위령을 격파하세요.');
    ghostEscort(c,c.H*.7,{cycles:4,hold:10});
  });
  at(19,c=>pursuingGhosts(c,4,true));
  at(29,c=>{
    announce(c,'삼도천 호위령','위아래 호위령을 끊으면 원혼의 길이 열려요.');
    ghostEscort(c,c.H*.24,{cycles:5,hold:13,hp:650});
    c.later(1.5,()=>ghostEscort(c,c.H*.76,{cycles:4,hold:12,hp:650,offset:2.6}));
  });
  at(46,c=>{
    announce(c,'강을 건너는 등불','추격이 잠시 끊겼어요. 작은 등불을 정리하세요.');
    train(c,'ember',7,c.H*.5,{speed:220,sine:60,gap:.48});
  });
  at(58,c=>{
    ghostEscort(c,c.H*.5,{cycles:4,hp:740,hold:11,drop:'life'});
    c.later(2,()=>pursuingGhosts(c,3,true));
  });
  at(72,c=>pursuingGhosts(c,5,false));
  at(81,c=>{
    announce(c,'차사의 마지막 호위','표식 호위령의 탄을 끊고 삼도천을 빠져나가세요.');
    ghostEscort(c,c.H*.25,{cycles:5,hold:13,hp:650});
    c.later(1.5,()=>ghostEscort(c,c.H*.75,{cycles:4,hold:12,hp:650,offset:2.6}));
  });
  at(97,c=>announce(c,'저승 명부의 끝','호위령의 주문이 멎었어요. 저승차사가 길을 막습니다.'));
});}

function palace():Wave[] {return timeline(at=>{
  at(.8,c=>start(c,7));
  at(1.5,c=>{
    announce(c,'첫 관문 · 함포','구름바다에서 익힌 포격의 틈을 다시 이용하세요.');
    cannonShip(c,c.H*.3,{cycles:3,hold:8,hp:650});
    c.later(2.4,()=>train(c,'storm',4,c.H*.74,{speed:290}));
  });
  at(13,c=>{
    announce(c,'둘째 관문 · 별비','지금은 위에서 내려오는 별의 빈 길을 따라가세요.');
    starfall(c,8,1);
  });
  at(27,c=>{
    announce(c,'셋째 관문 · 결계','가운데 길을 남긴 광선이에요. 발사원을 노리세요.');
    bambooGates(c,3,10);
  });
  at(40,c=>{
    announce(c,'궁성 지휘관','표식 지휘관을 끊으면 탄막이 지워지고 목숨을 얻어요.');
    commander(c,c.H*.5,YELLOW);
    c.later(4,()=>train(c,'wing',4,c.H*.2,{speed:300}));
  });
  at(55,c=>{
    announce(c,'폭풍의 눈','짧은 고요예요. 보급기를 격파하며 차지와 궁극기를 준비하세요.');
    train(c,'kite',7,c.H*.5,{speed:230,sine:70,gap:.48});
  });
  at(66,c=>{
    announce(c,'최후 관문 · 눈문','앞에서 오는 얼음 장벽의 틈을 먼저 찾으세요.');
    snowWalls(c,4,1,2.4);
  });
  at(79,c=>{
    announce(c,'뇌공의 근위대','광선 발사원을 끊은 뒤 마지막 지휘관에게 접근하세요.');
    forgeTowers(c,3,true);
    c.later(5,()=>commander(c,c.H*.5,VIOLET));
  });
  at(101,c=>announce(c,'천뢰궁의 정적','모든 관문을 넘었어요. 뇌공과의 마지막 결전을 준비하세요.'));
});}

export function authoredChapter(index:number):Wave[] {
  const builders=[valley,clouds,bamboo,forge,night,snow,underworld,palace];
  if(!Number.isInteger(index)||index<0||index>=builders.length)throw new RangeError('Unknown authored chapter.');
  return builders[index]();
}
