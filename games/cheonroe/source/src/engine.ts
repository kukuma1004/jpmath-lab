import { ENEMIES, GAUGE_MAX, GAUGE_PER_STOCK, GRAZE_R, HEIGHT, PLAYER_R, SCORE_CAP, TEMPO, heroDef,
  type Bullet, type Difficulty, type Enemy, type EnemyKind, type EnemyPath, type FirePattern, type GameEvent, type GameState, type HeroId,
  type InputIntent, type Laser, type Shot, type ShotKind, type Pickup } from './types';
import { STAGES, bossSeconds, type BulletOpts, type Ctx } from './stages';
export { HEIGHT, TEMPO };

const TAU=Math.PI*2;
const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
const d2=(ax:number,ay:number,bx:number,by:number)=>(ax-bx)**2+(ay-by)**2;
function segDist2(px:number,py:number,ax:number,ay:number,bx:number,by:number) {
  const sx=bx-ax,sy=by-ay,len=sx*sx+sy*sy,t=len?clamp(((px-ax)*sx+(py-ay)*sy)/len,0,1):0;
  return d2(px,py,ax+t*sx,ay+t*sy);
}
const NO_INPUT:InputIntent={x:0,y:0,focus:false,charge:false,ultimate:false,dash:false};
const EXTENDS=[200000,600000,1200000,2000000,3000000];
export const DASH_MAX=2, DASH_RECHARGE=2.2, DASH_TIME=.13, DASH_SPEED=1650, DASH_IFRAMES=.3;
export const ULT_TIME=3.2;
/** Boss HP is sized from its attack script: this much damage per world second, for every second of attacks. */
export const BOSS_DPS=250;
/** Melee reach in front of the hit core, and the radius of bullets the swing knocks away. */
export const MELEE_REACH:{[k in HeroId]:number}={rin:150,golem:150,ryu:190}, MELEE_CANCEL=105;

/** World-space hit circles [x,y,r] of an enemy, derived from the drawn sprite. */
export function hitCircles(e:Enemy):[number,number,number][] {
  const def=ENEMIES[e.kind],w=def.w*e.scale,h=w*def.aspect;
  return def.hit.map(([fx,fy,fr])=>[e.x+(fx-.5)*w,e.y+(fy-.5)*h,fr*w]);
}
/** Where the hero's shots leave, relative to the hit core. */
export function muzzleOffset(hero:HeroId):[number,number] {
  const d=heroDef(hero),w=d.spriteH*.955;
  return [(d.muzzle[0]-d.core[0])*w,(d.muzzle[1]-d.core[1])*d.spriteH*.5];
}

/** Pure, seeded simulation. Coordinates are pixels, y points down, world height HEIGHT. No browser dependencies. */
export class Engine {
  state:GameState;
  readonly ctx:Ctx;
  private rs=42;
  private seed0=42;
  private nextId=1;
  private worldW=1280;
  private dropCount=0;
  private waveIndex=0;
  private pending:{at:number;run:()=>void}[]=[];
  private clears:{x:number;y:number;r:number;gold:boolean}[]=[];
  private wasCharge=false;
  private wasUlt=false;
  private wasDash=false;
  private focusing=false;
  private warned=false;
  private stageHits=0;
  private stageGraze=0;
  private stageKills=0;
  private ultTick=0;
  private strikeTick=0;
  private bloomTick=0;
  private pierceHits=new Map<number,Set<number>>();

  constructor(seed=42) {
    this.seed(seed);
    this.state=this.empty('rin','normal',0);
    this.state.phase='menu';
    this.ctx=this.makeCtx();
  }
  seed(n:number):void {this.seed0=(n>>>0)||42;this.rs=this.seed0;}
  setWorld(w:number):void {this.worldW=clamp(Math.round(w),1040,1520);this.state.worldW=this.worldW;}
  get W():number {return this.state.worldW;}
  get stageDef() {return STAGES[this.state.stage];}
  private random():number {
    let a=this.rs+=0x6D2B79F5;
    a=Math.imul(a^(a>>>15),a|1);a^=a+Math.imul(a^(a>>>7),a|61);
    return ((a^(a>>>14))>>>0)/4294967296;
  }
  /** 0 on the first chapter, 1 on the last, whatever the chapter count. */
  private depth():number {return this.state.stage/Math.max(1,STAGES.length-1);}
  private hardness():number {const s=this.state,f=this.depth();return s.difficulty==='story'?.8+f*.08:1+f*.1;}
  private empty(hero:HeroId,difficulty:Difficulty,stage:number):GameState {
    const hp=difficulty==='story'?5:3;
    return {phase:'playing',hero,difficulty,time:0,score:0,combo:0,comboTimer:0,graze:0,stage,stageTime:0,startStage:stage,
      bossActive:false,bossDefeated:false,clearTimer:0,transition:0,attackName:'',attackTime:0,bossName:'',bossTitle:'',bossPhases:0,
      player:{x:260,y:HEIGHT/2,hp,maxHp:hp,invulnerable:2.4,charge:0,power:1,shotTimer:.1,gauge:difficulty==='story'?200:100,ultimateTimer:0,nearTimer:0,
        dashCharges:DASH_MAX,dashRecharge:0,dashTime:0,dashVX:0,dashVY:0,dashIframes:0,perfectThisDash:false,faceX:0,faceY:-1,moving:0,missileTimer:.5},
      enemies:[],shots:[],bullets:[],lasers:[],pickups:[],events:[],slow:0,hitstop:0,worldW:this.worldW,nextExtend:0,
      stats:{kills:0,shots:0,damageTaken:0,ultimates:0,chargeShots:0,nearKills:0,perfects:0,dashes:0,cancels:0,stagesCleared:0}};
  }
  /** Arcade always starts at chapter one; practice may start at any chapter. */
  start(hero:HeroId,difficulty:Difficulty,stage=0):void {
    this.rs=this.seed0;this.nextId=1;this.dropCount=0;this.wasCharge=false;this.wasUlt=false;this.wasDash=false;this.pierceHits.clear();
    const first=difficulty==='normal'?0:clamp(stage|0,0,STAGES.length-1);
    this.state=this.empty(hero,difficulty,first);
    this.beginStage(first);
  }
  pause(paused:boolean):void {
    if(paused&&this.state.phase==='playing')this.state.phase='paused';
    else if(!paused&&this.state.phase==='paused')this.state.phase='playing';
  }
  private event(e:GameEvent):void {this.state.events.push(e);}

  // ───────────── stage flow ─────────────
  private beginStage(i:number):void {
    const s=this.state;s.stage=i;s.stageTime=0;s.bossActive=false;s.bossDefeated=false;s.clearTimer=0;s.transition=0;
    s.attackName='';s.bossName='';s.bossTitle='';s.bossPhases=0;s.attackTime=0;
    this.waveIndex=0;this.pending=[];this.warned=false;this.stageHits=0;this.stageGraze=s.graze;this.stageKills=s.stats.kills;
    s.enemies=[];s.bullets=[];s.lasers=[];s.player.invulnerable=Math.max(s.player.invulnerable,2);
    const st=STAGES[i];this.event({kind:'stage',x:this.W/2,y:HEIGHT/2,value:i,text:st.name,sub:st.chapter});
  }
  private updateStage(g:number,dt:number):void {
    const s=this.state,st=this.stageDef;
    if(s.transition>0){s.transition-=dt;if(s.transition<=0)this.beginStage(s.stage+1);return;}
    if(s.clearTimer>0){s.clearTimer-=dt;if(s.clearTimer<=0)this.finishStage();return;}
    s.stageTime+=g;
    while(this.waveIndex<st.waves.length&&st.waves[this.waveIndex].t<=s.stageTime)st.waves[this.waveIndex++].run(this.ctx);
    if(this.pending.length) {
      const due=this.pending.filter(p=>p.at<=s.stageTime);
      if(due.length){this.pending=this.pending.filter(p=>p.at>s.stageTime);for(const d of due)d.run();}
    }
    if(!this.warned&&s.stageTime>=st.bossAt-3.6){this.warned=true;this.event({kind:'warning',x:this.W*.7,y:HEIGHT/2,text:st.boss.name,sub:st.boss.title});}
    if(!s.bossActive&&!s.bossDefeated&&s.stageTime>=st.bossAt)this.spawnBoss();
  }
  private spawnBoss():void {
    const s=this.state,def=this.stageDef.boss,hp=Math.round(BOSS_DPS*bossSeconds(def)*(s.difficulty==='story'?.75:1));
    const e=this.spawnEnemy(def.kind,this.W+330,HEIGHT/2,{type:'boss',speed:0});
    e.hp=e.maxHp=hp;e.boss=true;e.shield=2.6;e.tx=this.W-270;e.ty=HEIGHT/2;
    s.bossActive=true;s.bossName=def.name;s.bossTitle=def.title;s.bossPhases=def.phases.length;s.attackName=def.phases[0].attacks[0].name;s.attackTime=0;
    this.event({kind:'boss',x:e.x,y:e.y,text:def.name,sub:def.title});
  }
  private bossDefeated(e:Enemy):void {
    const s=this.state;
    s.bossActive=false;s.bossDefeated=true;s.attackName='';s.lasers=[];this.pending=[];
    this.clears.push({x:0,y:0,r:-1,gold:true});
    for(const other of s.enemies)this.event({kind:'kill',x:other.x,y:other.y,value:0,enemy:other.kind});
    s.enemies=[];
    s.hitstop=.42;s.slow=1.6;s.clearTimer=3.4;s.player.invulnerable=Math.max(s.player.invulnerable,6);
    this.event({kind:'explode',x:e.x,y:e.y,big:true,enemy:e.kind});
  }
  private finishStage():void {
    const s=this.state,st=this.stageDef;
    const clear=15000*(s.stage+1),grazeBonus=(s.graze-this.stageGraze)*25,noMiss=this.stageHits===0?60000:0;
    const bonus=clear+grazeBonus+noMiss;
    this.addScore(bonus);s.stats.stagesCleared++;
    this.event({kind:'stageclear',x:this.W/2,y:HEIGHT/2,value:bonus,text:`${st.chapter} ${st.name}`,
      sub:`돌파 ${clear.toLocaleString()} · 스친 탄 ${grazeBonus.toLocaleString()} · 무피격 ${noMiss?noMiss.toLocaleString():'—'} · 격파 ${s.stats.kills-this.stageKills}`});
    if(s.stage>=STAGES.length-1){s.phase='victory';this.event({kind:'victory',x:s.player.x,y:s.player.y,value:s.score});}
    else s.transition=4.2;
  }

  // ───────────── spawning ─────────────
  private makeCtx():Ctx {
    const self=this;
    return {
      get W(){return self.W;},H:HEIGHT,get time(){return self.state.stageTime;},get hard(){return self.hardness();},
      get player(){return self.state.player;},
      rand:()=>self.random(),
      aim:(x,y)=>Math.atan2(self.state.player.y-y,self.state.player.x-x),
      enemy:(kind,x,y,path,o={})=>self.spawnEnemy(kind,x,y,path,o),
      bullet:(x,y,a,v,o={})=>self.bullet(x,y,a,v,o),
      ring:(x,y,n,v,o={})=>{
        const off=o.offset??0;
        for(let i=0;i<n;i++){if(o.gap&&(((i-(o.gapAt??0))%n)+n)%n<o.gap)continue;self.bullet(x,y,off+i/n*TAU,v,o);}
      },
      fan:(x,y,a,n,spread,v,o={})=>{for(let i=0;i<n;i++)self.bullet(x,y,a+(i-(n-1)/2)*spread,v,o);},
      laser:(x,y,a,o)=>self.laser(x,y,a,o),
      later:(delay,run)=>{self.pending.push({at:self.state.stageTime+delay,run});},
    };
  }
  private spawnEnemy(kind:EnemyKind,x:number,y:number,path:EnemyPath,o:{fire?:FirePattern;hp?:number;tint?:string;drop?:Enemy['drop'];mid?:boolean;scale?:number}={}):Enemy {
    const s=this.state,def=ENEMIES[kind];
    const hp=(o.hp??def.hp)*(s.difficulty==='story'?.8:1)*(1+this.depth()*.35);
    const e:Enemy={id:this.nextId++,kind,x,y,vx:0,vy:0,hp,maxHp:hp,age:0,shotTimer:(o.fire?.delay??1)*.6,flash:0,seed:this.random()*TAU,
      tint:o.tint??'#ffffff',boss:false,mid:!!o.mid,scale:o.scale??1,path:{...path,sx:path.sx??x,sy:path.sy??y},fire:o.fire,fireCount:0,drop:o.drop,
      phase:0,attack:0,attackTime:0,tx:x,ty:y,shield:0,spin:0};
    s.enemies.push(e);return e;
  }
  private bullet(x:number,y:number,a:number,v:number,o:BulletOpts={},raw=false):Bullet|undefined {
    const s=this.state;if(s.bullets.length>=1400)return undefined;
    const h=raw?1:this.hardness(),style=o.style??'orb';
    const b:Bullet={id:this.nextId++,x,y,a,v:v*h,gy:0,r:o.r??(style==='big'?13:style==='needle'?4:6),style,color:o.color??'#ff4767',age:0,grazed:false,
      accel:(o.accel??0)*h,turn:o.turn??0,maxSpeed:(o.maxSpeed??0)*h,gravity:o.gravity??0,wait:o.wait??0,reaim:o.reaim??0,reaimSpeed:(o.reaimSpeed??0)*h,
      split:o.split??0,splitSpeed:(o.splitSpeed??0)*h};
    s.bullets.push(b);return b;
  }
  private laser(x:number,y:number,a:number,o:{length?:number;width?:number;warn?:number;life?:number;color?:string;spin?:number;owner?:Enemy}):Laser {
    const story=this.state.difficulty==='story';
    const l:Laser={id:this.nextId++,x,y,angle:a,length:o.length??2400,width:o.width??44,warn:(o.warn??1)*(story?1.25:1),life:o.life??1.2,age:0,
      color:o.color??'#ff4767',spin:(o.spin??0)*(story?.8:1),owner:o.owner?.id,ox:o.owner?x-o.owner.x:0,oy:o.owner?y-o.owner.y:0,grazeTick:0};
    this.state.lasers.push(l);return l;
  }
  private drop(kind:Pickup['kind'],x:number,y:number,magnet=false):void {
    this.state.pickups.push({id:this.nextId++,kind,x,y,vx:0,vy:0,age:0,magnet});
  }

  // ───────────── scoring ─────────────
  private addScore(v:number):void {
    const s=this.state;s.score=Math.min(SCORE_CAP,s.score+Math.round(v));
    while(s.nextExtend<EXTENDS.length&&s.score>=EXTENDS[s.nextExtend]) {
      s.nextExtend++;s.player.hp=Math.min(9,s.player.hp+1);s.player.maxHp=Math.max(s.player.maxHp,s.player.hp);
      this.event({kind:'extend',x:s.player.x,y:s.player.y,text:'목숨 +1'});
    }
  }
  private gainGauge(v:number):void {const p=this.state.player;p.gauge=Math.min(GAUGE_MAX,p.gauge+v);}
  private grazeAt(x:number,y:number):void {
    const s=this.state;s.graze++;this.addScore(40+10*s.stage);this.gainGauge(1.6);this.event({kind:'graze',x,y});
  }
  private perfect():void {
    const s=this.state,p=s.player;
    p.perfectThisDash=true;s.stats.perfects++;p.dashCharges=Math.min(DASH_MAX,p.dashCharges+1);
    s.slow=Math.max(s.slow,.5);this.gainGauge(14);this.addScore(2000+500*s.stage);
    this.clears.push({x:p.x,y:p.y,r:100,gold:true});
    this.event({kind:'perfect',x:p.x,y:p.y,text:'완벽 회피!'});
  }
  private flushClears():void {
    const s=this.state;
    for(const c of this.clears) {
      let n=0;const keep:Bullet[]=[];
      for(const b of s.bullets) {
        if(c.r>=0&&d2(b.x,b.y,c.x,c.y)>c.r*c.r){keep.push(b);continue;}
        n++;if(c.gold&&n<=140)this.drop('gold',b.x,b.y,true);
      }
      s.bullets=keep;
      if(n){s.stats.cancels+=n;this.event({kind:'cancel',x:c.r<0?this.W/2:c.x,y:c.r<0?HEIGHT/2:c.y,value:n});}
    }
    this.clears=[];
  }

  // ───────────── damage ─────────────
  private hurt():void {
    const s=this.state,p=s.player;
    if(p.invulnerable>0||p.dashIframes>0||p.ultimateTimer>0||s.phase!=='playing'||s.clearTimer>0||s.transition>0)return;
    p.hp--;p.invulnerable=2.4;p.power=Math.max(1,p.power-1);p.charge=0;s.combo=0;s.comboTimer=0;s.stats.damageTaken++;this.stageHits++;
    this.clears.push({x:p.x,y:p.y,r:220,gold:false});
    this.gainGauge(60);s.hitstop=.2;
    this.event({kind:'hurt',x:p.x,y:p.y,value:p.hp});
    if(p.hp<=0){s.phase='gameover';this.event({kind:'gameover',x:p.x,y:p.y,value:s.score});}
  }
  private damageEnemy(e:Enemy,dmg:number,near:boolean,hx:number,hy:number):void {
    const s=this.state;
    if(e.hp<=0||!s.enemies.includes(e))return;
    if(e.boss&&e.shield>0){e.flash=.03;return;}
    e.hp-=dmg;e.flash=.07;
    this.event({kind:'hit',x:hx,y:hy,value:dmg,enemy:e.kind});
    if(e.boss) {
      const def=this.stageDef.boss,ph=def.phases[e.phase];
      if(e.phase<def.phases.length-1&&e.hp/e.maxHp<=ph.until){this.bossPhaseBreak(e);return;}
    }
    if(e.hp<=0)this.killEnemy(e,near);
  }
  private bossPhaseBreak(e:Enemy):void {
    const s=this.state,def=this.stageDef.boss;
    e.hp=Math.max(1,Math.min(e.hp,e.maxHp*def.phases[e.phase].until));
    e.phase++;e.attack=0;e.attackTime=0;e.shield=1.7;e.tx=this.W-280;e.ty=HEIGHT/2;
    this.clears.push({x:0,y:0,r:-1,gold:true});s.lasers=[];this.pending=[];
    this.gainGauge(25);this.addScore(10000*(s.stage+1));
    s.attackName=def.phases[e.phase].attacks[0].name;s.attackTime=0;s.hitstop=.14;s.slow=.6;
    this.event({kind:'phase',x:e.x,y:e.y,value:e.phase,text:s.attackName});
  }
  private killEnemy(e:Enemy,near:boolean):void {
    const s=this.state,def=ENEMIES[e.kind];
    s.enemies=s.enemies.filter(x=>x!==e);
    s.stats.kills=Math.min(1000,s.stats.kills+1);s.combo++;s.comboTimer=2.6;if(near)s.stats.nearKills++;
    const value=Math.round(def.score*(e.mid?4:1)*(1+Math.min(s.combo,100)*.02)*(near?1.5:1));
    this.addScore(value);
    const big=e.boss||e.mid||e.kind==='brute'||e.kind==='turret';
    this.gainGauge(e.boss?0:big?4:.8);
    this.event({kind:'kill',x:e.x,y:e.y,value,enemy:e.kind,big,text:near?'근접 ×1.5':undefined});
    if(e.boss){this.bossDefeated(e);return;}
    this.dropCount++;
    if(e.drop)this.drop(e.drop,e.x,e.y);
    else if(this.dropCount%13===0)this.drop(s.player.power<4?'power':'gauge',e.x,e.y);
    else if(this.dropCount%29===0)this.drop('gauge',e.x,e.y);
    else this.drop('gold',e.x,e.y);
    if(big)s.hitstop=Math.max(s.hitstop,e.mid?.14:.05);
    if(e.mid)this.clears.push({x:0,y:0,r:-1,gold:true});
  }

  // ───────────── player ─────────────
  private shot(kind:ShotKind,x:number,y:number,a:number,speed:number,r:number,damage:number,life:number,pierce:boolean):void {
    const s:Shot={id:this.nextId++,kind,x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r,damage,age:0,life,pierce};
    this.state.shots.push(s);
  }
  private autoShoot():void {
    const s=this.state,p=s.player,pw=p.power,[ox,oy]=muzzleOffset(s.hero),mx=p.x+ox,my=p.y+oy;
    if(s.hero==='rin') {
      // Focusing gathers the fan into a narrow, boss-killing stream.
      const n=[3,5,7,7][pw-1],spread=this.focusing?.022:pw>=4?.1:.085;
      for(let i=0;i<n;i++)this.shot('shot',mx,my,(i-(n-1)/2)*spread,1350,10,3,1.2,false);
      if(pw>=3&&s.stats.shots%2===0)for(const k of [-1,1])this.shot('homing',mx-10,my+k*12,k*.7,760,9,3.4,1.6,false);
      p.shotTimer+=.085;
    }else if(s.hero==='golem') {
      const offs=[[0],[-12,12],[-12,12],[-20,0,20]][pw-1];
      for(const o of offs)this.shot('shot',mx,my+o,0,1800,11,5.4+pw*.5,1,true);
      p.shotTimer+=.11;
    }else {
      const offs=[[0],[-16,16],[-16,16],[-26,0,26]][pw-1];
      for(const o of offs)this.shot('wave',mx,my+o,o*.0018,1050,16,9+pw*.6,.86,false);
      p.shotTimer+=.13;
    }
    s.stats.shots++;this.event({kind:'shot',x:mx,y:my});
  }
  private chargeShot():void {
    const s=this.state,p=s.player,f=p.charge/1.2,[ox,oy]=muzzleOffset(s.hero),mx=p.x+ox,my=p.y+oy;
    if(s.hero==='rin')for(let i=-4;i<=4;i++)this.shot('charge',mx,my,i*.1,1050,20,16+22*f,1.4,true);
    else if(s.hero==='golem')this.shot('charge',mx,my,0,2100,34+10*f,110+170*f,1,true);
    else for(let i=-1;i<=1;i++)this.shot('charge',mx,my+i*32,i*.05,1150,30,45+70*f,.9,true);
    s.stats.chargeShots++;this.event({kind:'charge',x:mx,y:my,value:f});
  }
  private activateUltimate():void {
    const s=this.state,p=s.player;
    if(p.gauge<GAUGE_PER_STOCK||p.ultimateTimer>0||s.clearTimer>0||s.transition>0)return;
    p.gauge-=GAUGE_PER_STOCK;p.ultimateTimer=ULT_TIME;p.invulnerable=Math.max(p.invulnerable,ULT_TIME+.5);
    this.ultTick=.25;this.strikeTick=.3;this.bloomTick=0;
    this.clears.push({x:0,y:0,r:-1,gold:true});s.lasers=[];
    s.stats.ultimates++;s.hitstop=.3;
    this.event({kind:'ultimate',x:p.x,y:p.y,text:heroDef(s.hero).ultimate});
  }
  private inGolemLane(e:Enemy):boolean {
    const p=this.state.player;
    return hitCircles(e).some(([cx,cy,r])=>cx>p.x-40&&Math.abs(cy-p.y)<130+r);
  }
  private updateUltimate(g:number):void {
    const s=this.state,p=s.player;
    if(p.ultimateTimer<=0)return;
    p.ultimateTimer=Math.max(0,p.ultimateTimer-g);
    if(s.bullets.length)this.clears.push({x:0,y:0,r:-1,gold:true});
    s.lasers=[];
    this.ultTick-=g;
    if(this.ultTick<=0) {
      this.ultTick+=.1;
      for(const e of [...s.enemies]) {
        let dmg:number;
        if(s.hero==='rin')dmg=e.boss?13:30;
        else if(s.hero==='golem')dmg=this.inGolemLane(e)?(e.boss?14:60):(e.boss?2:10);
        else dmg=e.boss?2:8;
        this.damageEnemy(e,dmg,false,e.x,e.y);
      }
    }
    if(s.hero==='rin') {
      this.bloomTick-=g;
      if(this.bloomTick<=0){this.bloomTick+=.28;const list=s.enemies.length?s.enemies:null;const t=list?list[Math.floor(this.random()*list.length)]:null;
        this.event({kind:'bloom',x:t?t.x:this.W*(.4+this.random()*.5),y:t?t.y:120+this.random()*(HEIGHT-240)});}
    }else if(s.hero==='ryu') {
      this.strikeTick-=g;
      if(this.strikeTick<=0) {
        this.strikeTick+=.13;
        const boss=s.enemies.find(e=>e.boss),others=s.enemies.filter(e=>!e.boss&&e.x<this.W);
        const pickBoss=boss&&(!others.length||this.random()<.5);
        const t=pickBoss?boss:others.length?others[Math.floor(this.random()*others.length)]:null;
        const x=t?t.x+(this.random()-.5)*40:this.W*(.35+this.random()*.55),y=t?t.y:150+this.random()*(HEIGHT-300);
        if(t)this.damageEnemy(t,t.boss?34:80,false,x,y);
        this.event({kind:'strike',x,y});
      }
    }
  }
  private updatePlayer(dt:number,g:number,input:InputIntent):void {
    const s=this.state,p=s.player,def=heroDef(s.hero),W=this.W,pd=dt*(s.slow>0?.72:1);
    p.invulnerable=Math.max(0,p.invulnerable-dt);p.dashIframes=Math.max(0,p.dashIframes-dt);p.nearTimer=Math.max(0,p.nearTimer-g);
    if(p.dashCharges<DASH_MAX){p.dashRecharge-=dt;if(p.dashRecharge<=0){p.dashCharges++;p.dashRecharge=p.dashCharges<DASH_MAX?DASH_RECHARGE:0;}}
    const mx=input.x,my=input.y,drag=input.drag;this.focusing=input.focus;
    if(mx||my){const l=Math.hypot(mx,my);p.faceX=mx/l;p.faceY=my/l;}
    else if(drag){const l=Math.hypot(drag.dx,drag.dy);if(l>2){p.faceX=drag.dx/l;p.faceY=drag.dy/l;}}
    if(input.dash&&!this.wasDash&&p.dashCharges>0&&p.dashTime<=0) {
      p.dashCharges--;if(p.dashRecharge<=0)p.dashRecharge=DASH_RECHARGE;
      p.dashVX=p.faceX*DASH_SPEED;p.dashVY=p.faceY*DASH_SPEED;p.dashTime=DASH_TIME;p.dashIframes=DASH_IFRAMES;p.perfectThisDash=false;s.stats.dashes++;
      this.event({kind:'dash',x:p.x,y:p.y,value:Math.atan2(p.faceY,p.faceX)});
    }
    this.wasDash=input.dash;
    const ox=p.x,oy=p.y;
    if(p.dashTime>0){const t=Math.min(p.dashTime,pd);p.x+=p.dashVX*t;p.y+=p.dashVY*t;p.dashTime-=pd;}
    else if(drag&&(drag.dx||drag.dy)){p.x+=drag.dx;p.y+=drag.dy;}
    else if(mx||my) {
      const l=Math.max(1,Math.hypot(mx,my)),sp=def.speed*(input.focus?.42:1)*(p.ultimateTimer>0&&s.hero==='golem'?.6:1);
      p.x+=mx/l*sp*pd;p.y+=my/l*sp*pd;
    }
    p.x=clamp(p.x,40,W-90);p.y=clamp(p.y,34,HEIGHT-34);
    p.moving=Math.hypot(p.x-ox,p.y-oy)/Math.max(dt,1e-4);
    if(input.charge)p.charge=Math.min(1.2,p.charge+g);
    else if(this.wasCharge){if(p.charge>=.45)this.chargeShot();p.charge=0;}
    this.wasCharge=input.charge;
    if(input.ultimate&&!this.wasUlt)this.activateUltimate();
    this.wasUlt=input.ultimate;
    this.updateUltimate(g);
    p.shotTimer-=g;
    if(p.shotTimer<=0){if(input.charge)p.shotTimer=0;else this.autoShoot();}
    if(s.hero==='golem'&&p.power>=3&&!input.charge) {
      p.missileTimer-=g;
      if(p.missileTimer<=0){p.missileTimer+=.5;for(const k of [-1,1])this.shot('homing',p.x+10,p.y+k*30,k*1.1,620,11,6+p.power,2.2,false);}
    }
  }

  // ───────────── world ─────────────
  private enemyFire(e:Enemy):void {
    const f=e.fire;if(!f||f.type==='none')return;
    const s=this.state,p=s.player,c=this.ctx;
    if(d2(e.x,e.y,p.x,p.y)<160**2)return; // never fire point-blank: there is no time to react
    const mx=e.x-ENEMIES[e.kind].w*e.scale*.28,my=e.y,a=c.aim(mx,my),v=f.speed??300,o:BulletOpts={style:f.style,color:f.color};
    if(f.type==='aim')c.fan(mx,my,a,f.n??1,f.spread??.12,v,o);
    else if(f.type==='fan')c.fan(mx,my,a,f.n??3,f.spread??.2,v,o);
    else if(f.type==='ring')c.ring(e.x,e.y,f.n??12,v,{...o,offset:e.age});
    else if(f.type==='spiral'){const n=f.n??3;for(let i=0;i<n;i++)c.bullet(e.x,e.y,e.age*2.3+i/n*TAU,v,o);}
    else if(f.type==='stream') {
      const count=f.count??5;
      for(let i=0;i<count;i++)c.later(i*.07,()=>{if(s.enemies.includes(e))c.bullet(e.x-ENEMIES[e.kind].w*e.scale*.28,e.y,a,v,{...o,style:f.style??'needle',r:4});});
    }
  }
  private updateBoss(e:Enemy,g:number):void {
    const s=this.state,def=this.stageDef.boss;
    e.x+=(e.tx-e.x)*Math.min(1,2.4*g);e.y+=(e.ty-e.y)*Math.min(1,2.4*g);
    if(e.shield>0){e.shield-=g;return;}
    const phase=def.phases[e.phase],atk=phase.attacks[e.attack%phase.attacks.length];
    const t0=e.attackTime,t1=t0+g;e.attackTime=t1;s.attackTime=t1;
    const every=(period:number,offset=0)=>{const f=(x:number)=>x<offset?-1:Math.floor((x-offset)/period);return Math.max(0,f(t1)-f(t0));};
    atk.run(e,this.ctx,t1,every);
    if(t1>=atk.dur) {
      e.attack=(e.attack+1)%phase.attacks.length;e.attackTime=0;
      const next=phase.attacks[e.attack];s.attackName=next.name;s.attackTime=0;
      this.event({kind:'attack',x:e.x,y:e.y,text:next.name});
    }
  }
  private updateEnemies(g:number):void {
    const s=this.state,p=s.player,W=this.W;
    const canHit=p.invulnerable<=0&&p.dashIframes<=0&&p.ultimateTimer<=0;
    for(const e of [...s.enemies]) {
      e.age+=g;e.flash=Math.max(0,e.flash-g);
      const path=e.path;
      if(path.type==='line'){e.x-=path.speed*g;e.y=path.sy!+Math.sin(e.age*(path.sineFreq??3))*(path.sineAmp??0);}
      else if(path.type==='ground')e.x-=path.speed*g;
      else if(path.type==='dive') {
        if(e.phase===0) {
          const k=Math.min(1,path.speed*g);e.x+=(path.stopX!-e.x)*k;e.y+=(path.stopY!-e.y)*k;
          if(Math.abs(e.x-path.stopX!)<8){e.phase=1;e.attackTime=0;}
        }else if(e.phase===1) {
          e.attackTime+=g;e.y+=Math.sin(e.age*2+e.seed)*14*g;
          if(e.attackTime>=(path.hold??2))e.phase=2;
        }else {
          const acc=1000*g,ex=path.exit??'back';
          if(ex==='up')e.vy-=acc;else if(ex==='down')e.vy+=acc;else if(ex==='left')e.vx-=acc;else e.vx+=acc*.8;
          e.x+=e.vx*g;e.y+=e.vy*g;
        }
      }else if(path.type==='arc') {
        const t=e.age/(path.duration??2.8);
        if(t>=1)e.x=-9999;
        else{const u=1-t;e.x=u*u*path.sx!+2*u*t*path.cx!+t*t*path.ex!;e.y=u*u*path.sy!+2*u*t*path.cy!+t*t*path.ey!;}
      }else if(path.type==='chase') {
        if(e.age<.6)e.x-=path.speed*g;
        else {
          if(!e.attack){e.attack=1;e.spin=Math.atan2(p.y-e.y,p.x-e.x);e.vx=path.speed;}
          e.vx=Math.min(760,e.vx+1000*g);e.x+=Math.cos(e.spin)*e.vx*g;e.y+=Math.sin(e.spin)*e.vx*g;
        }
      }else this.updateBoss(e,g);
      if(s.phase!=='playing')return;
      if(e.fire&&!e.boss) {
        e.shotTimer-=g;
        if(e.shotTimer<=0) {
          const inField=e.x>70&&e.x<W-30&&e.y>20&&e.y<HEIGHT-20;
          if(inField){this.enemyFire(e);e.fireCount++;e.shotTimer+=(e.fire.every??2)*(s.difficulty==='story'?1.25:1);}
          else e.shotTimer=.1;
        }
      }
      const circles=hitCircles(e);
      if(canHit&&!(e.boss&&e.age<2.2))for(const [cx,cy,r] of circles)if(d2(cx,cy,p.x,p.y)<(r*(e.boss?.85:.72)+PLAYER_R)**2){this.hurt();break;}
      if(p.nearTimer<=0&&e.hp>0&&s.enemies.includes(e)&&s.clearTimer<=0) {
        const reach=MELEE_REACH[s.hero];
        const c=circles.find(([cx,cy,r])=>cx-r-p.x>-30&&cx-r-p.x<reach&&Math.abs(cy-p.y)<70+r*.6);
        if(c) {
          p.nearTimer=s.hero==='ryu'?.16:s.hero==='golem'?.32:.24;
          const dmg=(s.hero==='ryu'?46:s.hero==='golem'?60:30)*(e.boss?.5:1);
          const hx=Math.max(p.x+40,c[0]-c[2]*.5),hy=clamp(c[1],p.y-70,p.y+70);
          this.clears.push({x:hx,y:hy,r:MELEE_CANCEL,gold:true});
          this.event({kind:'near',x:hx,y:hy,value:dmg});
          this.damageEnemy(e,dmg,true,hx,hy);
        }
      }
    }
    s.enemies=s.enemies.filter(e=>e.hp>0&&!(e.x<-9000||(e.age>1&&(e.x<-280||e.x>W+460||e.y<-340||e.y>HEIGHT+340))));
  }
  private updateBullets(g:number):void {
    const s=this.state,p=s.player,W=this.W;
    const canHit=p.invulnerable<=0&&p.dashIframes<=0&&p.ultimateTimer<=0&&s.clearTimer<=0&&s.transition<=0;
    const canGraze=p.invulnerable<=0&&p.ultimateTimer<=0;
    const list=s.bullets;s.bullets=[];
    for(const b of list) {
      b.age+=g;
      if(b.wait>0&&b.age>=b.wait) {
        if(b.split>0){for(let i=0;i<b.split;i++)this.bullet(b.x,b.y,i/b.split*TAU+b.age,b.splitSpeed,{r:6,color:b.color},true);continue;}
        if(b.reaim){b.a=Math.atan2(p.y-b.y,p.x-b.x);b.v=b.reaimSpeed;b.accel=0;}
        b.wait=0;
      }
      if(b.accel){b.v+=b.accel*g;if(b.v<0)b.v=0;if(b.maxSpeed&&b.v>b.maxSpeed)b.v=b.maxSpeed;}
      if(b.turn)b.a+=b.turn*g;
      if(b.gravity)b.gy+=b.gravity*g;
      b.x+=Math.cos(b.a)*b.v*g;b.y+=Math.sin(b.a)*b.v*g+b.gy*g;
      if(b.x<-90||b.x>W+160||b.y>HEIGHT+90||b.y<(b.gravity?-700:-140)||b.age>16)continue;
      const dd=d2(b.x,b.y,p.x,p.y);
      if(dd<(b.r+44)**2) {
        if(canHit&&dd<(b.r+PLAYER_R)**2){this.hurt();continue;}
        if(p.dashIframes>0&&!p.perfectThisDash&&dd<(b.r+22)**2){this.perfect();}
        if(canGraze&&!b.grazed&&dd<(b.r+GRAZE_R)**2){b.grazed=true;this.grazeAt(b.x,b.y);}
      }
      s.bullets.push(b);
    }
  }
  private updateLasers(g:number):void {
    const s=this.state,p=s.player;
    const canHit=p.invulnerable<=0&&p.dashIframes<=0&&p.ultimateTimer<=0&&s.clearTimer<=0&&s.transition<=0;
    const canGraze=p.invulnerable<=0&&p.ultimateTimer<=0;
    s.lasers=s.lasers.filter(l=>{
      l.age+=g;
      if(l.owner!==undefined){const o=s.enemies.find(e=>e.id===l.owner);if(o){l.x=o.x+l.ox;l.y=o.y+l.oy;}else if(l.age<l.warn)return false;}
      if(l.age>=l.warn)l.angle+=l.spin*g;
      if(l.age>=l.warn+l.life)return false;
      if(l.age>=l.warn) {
        // The collision core opens with the drawn beam and is exactly its bright centre band.
        const open=Math.min(1,(l.age-l.warn)/.12,(l.warn+l.life-l.age)/.15),core=l.width*.3*open;
        const dd=segDist2(p.x,p.y,l.x,l.y,l.x+Math.cos(l.angle)*l.length,l.y+Math.sin(l.angle)*l.length);
        if(canHit&&dd<(core+PLAYER_R)**2)this.hurt();
        else if(p.dashIframes>0&&!p.perfectThisDash&&dd<(core+22)**2)this.perfect();
        else if(canGraze&&dd<(l.width*.5+GRAZE_R)**2){l.grazeTick-=g;if(l.grazeTick<=0){l.grazeTick=.1;this.grazeAt(p.x,p.y);}}
      }
      return true;
    });
  }
  private nearestEnemy(x:number,y:number):Enemy|undefined {
    let best:Enemy|undefined,bd=Infinity;
    for(const e of this.state.enemies){if(e.x>this.W-10||e.x<x-60)continue;const d=d2(e.x,e.y,x,y);if(d<bd){bd=d;best=e;}}
    return best;
  }
  private updateShots(g:number):void {
    const s=this.state,W=this.W,keep:Shot[]=[];
    for(const sh of s.shots) {
      const ox=sh.x,oy=sh.y;sh.age+=g;
      if(sh.kind==='homing') {
        const t=this.nearestEnemy(sh.x,sh.y);
        if(t){const want=Math.atan2(t.y-sh.y,t.x-sh.x),cur=Math.atan2(sh.vy,sh.vx);let d=want-cur;d=Math.atan2(Math.sin(d),Math.cos(d));
          const na=cur+clamp(d,-7*g,7*g),sp=Math.hypot(sh.vx,sh.vy)+500*g;sh.vx=Math.cos(na)*sp;sh.vy=Math.sin(na)*sp;}
      }
      sh.x+=sh.vx*g;sh.y+=sh.vy*g;
      if(sh.age>sh.life||sh.x>W+120||sh.x<-80||sh.y<-80||sh.y>HEIGHT+80){this.pierceHits.delete(sh.id);continue;}
      let alive=true,hits=this.pierceHits.get(sh.id);
      for(const e of s.enemies) {
        if(e.hp<=0||hits?.has(e.id))continue;
        const reach=ENEMIES[e.kind].w*e.scale*.75+sh.r+Math.abs(sh.vx*g);
        if(Math.abs(e.x-sh.x)>reach||Math.abs(e.y-sh.y)>reach)continue;
        let hit=false;
        for(const [cx,cy,r] of hitCircles(e))if(segDist2(cx,cy,ox,oy,sh.x,sh.y)<(r+sh.r)**2){hit=true;break;}
        if(!hit)continue;
        if(sh.pierce){if(!hits){hits=new Set();this.pierceHits.set(sh.id,hits);}hits.add(e.id);}
        this.damageEnemy(e,sh.damage,false,sh.x,sh.y);
        if(!sh.pierce){alive=false;break;}
      }
      if(alive)keep.push(sh);else this.pierceHits.delete(sh.id);
    }
    s.shots=keep;
  }
  private updatePickups(g:number):void {
    const s=this.state,p=s.player;
    s.pickups=s.pickups.filter(it=>{
      it.age+=g;
      const dx=p.x-it.x,dy=p.y-it.y,d=Math.hypot(dx,dy);
      if(it.magnet||d<200){it.magnet=true;const sp=Math.min(1700,650+it.age*900),step=Math.min(d,sp*g);if(d>0){it.x+=dx/d*step;it.y+=dy/d*step;}}
      else{it.x-=90*g;it.y+=Math.sin(it.age*3)*24*g;}
      if(d<36){this.collect(it);return false;}
      return it.age<16&&it.x>-60;
    });
  }
  private collect(it:Pickup):void {
    const s=this.state,p=s.player;
    if(it.kind==='gold'){this.addScore(60+20*s.stage);this.event({kind:'pickup',x:it.x,y:it.y,enemy:undefined,value:60+20*s.stage});return;}
    let text='';
    if(it.kind==='power'){if(p.power<4){p.power++;text=`사격 강화 ${p.power}단`;}else{this.addScore(5000);text='+5,000';}}
    else if(it.kind==='gauge'){this.gainGauge(35);text='필살 게이지 +35';}
    else {p.hp=Math.min(9,p.hp+1);p.maxHp=Math.max(p.maxHp,p.hp);text='목숨 +1';}
    this.event({kind:'pickup',x:it.x,y:it.y,text,big:true});
  }

  step(dt:number,input:InputIntent=NO_INPUT):void {
    const s=this.state;if(s.phase!=='playing'||!Number.isFinite(dt)||dt<=0)return;
    dt=Math.min(dt,.05);
    if(s.hitstop>0){s.hitstop=Math.max(0,s.hitstop-dt);return;}
    s.time+=dt;
    const pg=dt*(s.slow>0?.33:1),g=pg*TEMPO;s.slow=Math.max(0,s.slow-dt);
    s.comboTimer=Math.max(0,s.comboTimer-pg);if(s.comboTimer===0)s.combo=0;
    this.updatePlayer(dt,pg,input);
    if(s.phase!=='playing')return;
    this.updateStage(g,dt);
    if(s.phase!=='playing')return;
    this.updateEnemies(g);
    if(s.phase!=='playing')return;
    this.updateBullets(g);
    this.updateLasers(g);
    this.updateShots(pg);
    this.updatePickups(pg);
    this.flushClears();
  }
}
