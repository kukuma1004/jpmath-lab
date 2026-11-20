import { HEROES, HEIGHT, WIDTH, type Difficulty, type Enemy, type EnemyKind, type GameEvent, type GameState, type HeroId, type InputIntent, type Projectile } from './types';

const clamp = (v:number, lo:number, hi:number) => Math.max(lo,Math.min(hi,v));
const distanceSquared = (x:number,y:number,px:number,py:number) => (x-px)**2+(y-py)**2;
const NO_INPUT:InputIntent={x:0,y:0,focus:false,charge:false,ultimate:false};

/** Pure, seeded simulation. Coordinates are pixels, y points down. No browser dependencies. */
export class Engine {
  state:GameState;
  private randomState=42;
  private initialSeed=42;
  private nextId=1;
  private waveAt=1.25;
  private wasCharge=false;
  private wasUltimate=false;
  private warned=false;
  private ultimateTick=0;
  private piercingHits = new Map<number,Set<number>>();

  constructor(seed=42) {
    this.seed(seed);
    this.state=this.empty('rin','normal');
    this.state.phase='menu';
  }
  seed(seed:number):void { this.initialSeed=(seed>>>0)||42; this.randomState=this.initialSeed; }
  private random():number {
    let a=this.randomState+=0x6D2B79F5;
    a=Math.imul(a^(a>>>15),a|1); a^=a+Math.imul(a^(a>>>7),a|61);
    return ((a^(a>>>14))>>>0)/4294967296;
  }
  private empty(hero:HeroId,difficulty:Difficulty):GameState {
    const hp=difficulty==='story'?5:3;
    return {phase:'playing',hero,difficulty,time:0,score:0,combo:0,comboTimer:0,graze:0,wave:0,bossActive:false,bossDefeated:false,
      player:{x:230,y:450,hp,maxHp:hp,invulnerable:2.5,charge:0,power:1,shotTimer:.12,ultimateStock:3,ultimateTimer:0,nearTimer:0},
      enemies:[],bullets:[],pickups:[],events:[],stats:{kills:0,shots:0,damageTaken:0,ultimates:0,chargeShots:0,nearKills:0}};
  }
  start(hero:HeroId,difficulty:Difficulty):void {
    this.randomState=this.initialSeed; this.nextId=1; this.waveAt=1.25;
    this.wasCharge=false; this.wasUltimate=false; this.warned=false; this.ultimateTick=0; this.piercingHits.clear();
    this.state=this.empty(hero,difficulty);
  }
  pause(paused:boolean):void {
    if(paused&&this.state.phase==='playing')this.state.phase='paused';
    else if(!paused&&this.state.phase==='paused')this.state.phase='playing';
  }
  private event(event:GameEvent):void {this.state.events.push(event);}
  private projectile(kind:Projectile['kind'],x:number,y:number,angle:number,speed:number,r:number,damage:number):Projectile {
    const bullet:Projectile={id:this.nextId++,kind,x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,r,damage,age:0,grazed:false,angle};
    this.state.bullets.push(bullet); return bullet;
  }
  private autoShoot():void {
    const s=this.state,p=s.player;
    if(s.hero==='rin') {
      const n=3+(p.power-1)*2;
      for(let i=0;i<n;i++)this.projectile('shot',p.x+38,p.y-2,(i-(n-1)/2)*.10,1080,8,3.6);
      p.shotTimer+=.145;
    }else if(s.hero==='golem') {
      const n=p.power>=3?2:1;
      for(let i=0;i<n;i++)this.projectile('shot',p.x+42,p.y+(i-(n-1)/2)*22,0,1400,10,8.7+(p.power-1)*2.4);
      p.shotTimer+=.15;
    }else {
      const n=2+(p.power>=2?1:0);
      for(let i=0;i<n;i++)this.projectile('shot',p.x+45,p.y+(i-(n-1)/2)*13,(i-(n-1)/2)*.055,1000,12,5.4+(p.power-1)*1.3);
      p.shotTimer+=.18;
    }
    s.stats.shots++; this.event({kind:'shot',x:p.x+36,y:p.y});
  }
  private chargeShot():void {
    const s=this.state,p=s.player,power=p.charge/1.3;
    if(s.hero==='rin')for(let i=-3;i<=3;i++)this.projectile('charge',p.x+42,p.y,i*.11,850,19+power*7,18+power*18);
    else if(s.hero==='golem')this.projectile('charge',p.x+48,p.y,0,1480,30+power*8,90+power*80);
    else for(let i=-1;i<=1;i++)this.projectile('charge',p.x+44,p.y+i*16,i*.07,980,28,30+power*35);
    s.stats.chargeShots++;this.event({kind:'charge',x:p.x+40,y:p.y,value:power});
  }
  private activateUltimate():void {
    const s=this.state,p=s.player;
    if(p.ultimateStock<=0||p.ultimateTimer>0)return;
    p.ultimateStock--;p.ultimateTimer=3;p.invulnerable=Math.max(p.invulnerable,3.4);this.ultimateTick=0;
    // The initial flash erases every hostile shot; new shots are swept away throughout the attack.
    s.bullets=s.bullets.filter(b=>b.kind!=='enemy');
    s.stats.ultimates++;this.event({kind:'ultimate',x:p.x,y:p.y,text:HEROES.find(h=>h.id===s.hero)!.ultimate});
    for(const enemy of [...s.enemies])this.damageEnemy(enemy,s.hero==='golem'?170:s.hero==='ryu'?230:200,false);
  }
  private updateUltimate(dt:number):void {
    const s=this.state,p=s.player;
    if(p.ultimateTimer<=0)return;
    p.ultimateTimer=Math.max(0,p.ultimateTimer-dt);this.ultimateTick-=dt;
    s.bullets=s.bullets.filter(b=>b.kind!=='enemy');
    if(this.ultimateTick<=0){
      this.ultimateTick+=.18;
      for(const e of [...s.enemies]) {
        // Beam is most powerful in the forward lane; blossoms and lightning cover the field.
        const damage=s.hero==='golem'?(e.x>p.x&&Math.abs(e.y-p.y)<160?33:11):s.hero==='ryu'?19:17;
        this.damageEnemy(e,damage,false);
      }
    }
  }
  private makeEnemy(kind:EnemyKind,x:number,y:number):Enemy {
    const values:Record<EnemyKind,[number,number,number]>={drone:[15,28,-155],wing:[24,33,-180],turret:[70,43,-85],brute:[160,63,-70],boss:[2150,115,0]};
    const [hp,r,vx]=values[kind];const modifier=this.state.difficulty==='story'?.8:1;
    const e:Enemy={id:this.nextId++,kind,x,y,vx,vy:0,hp:hp*modifier,maxHp:hp*modifier,r,age:0,shotTimer:.7+this.random()*.9,phase:1,flash:0,seed:this.random()*Math.PI*2};
    this.state.enemies.push(e);return e;
  }
  private spawnWave():void {
    const s=this.state; s.wave++;
    const center=180+this.random()*540;
    if(s.time<12)for(let i=0;i<4;i++)this.makeEnemy('drone',WIDTH+50+i*95,clamp(center+Math.sin(i*.9)*65,130,760));
    else if(s.time<28) {
      for(let i=0;i<4;i++)this.makeEnemy(i===1?'turret':'wing',WIDTH+50+i*110,clamp(center+(i-1.5)*95,130,770));
    }else if(s.time<43) {
      this.makeEnemy('brute',WIDTH+40,center);
      for(let i=0;i<3;i++)this.makeEnemy('drone',WIDTH+180+i*95,clamp(870-center+(i-1)*75,130,770));
    }else {
      for(let i=0;i<5;i++)this.makeEnemy(i===2?'turret':'wing',WIDTH+40+i*100,clamp(center+(i-2)*95,130,770));
      if(s.wave%2===0)this.makeEnemy('brute',WIDTH+200,clamp(850-center,160,720));
    }
    this.waveAt+=s.time<12?4.2:s.time<28?4.8:s.time<43?5:4.5;
  }
  private enemyShoot(enemy:Enemy):void {
    const s=this.state,p=s.player,slow=s.difficulty==='story'?.78:1;
    const hostileCount=s.bullets.reduce((n,b)=>n+(b.kind==='enemy'?1:0),0);
    if(hostileCount>=230)return;
    const aim=Math.atan2(p.y-enemy.y,p.x-enemy.x);
    if(enemy.kind==='boss') {
      const phase=enemy.hp/enemy.maxHp>.67?1:enemy.hp/enemy.maxHp>.34?2:3;
      enemy.phase=phase;
      const cycle=Math.floor(enemy.age/3.1);
      if(phase===1) {
        // Aimed seven-shot fans are wide enough to sidestep before the next volley.
        for(let i=-3;i<=3;i++)this.projectile('enemy',enemy.x-80,enemy.y+i*4,aim+i*.13,215*slow,10,1);
        enemy.shotTimer+=1.15;
      }else if(phase===2) {
        // Rotating rings leave an authored large gap toward a changing escape lane.
        for(let i=0;i<18;i++) {
          if(i%9===cycle%9)continue;
          const a=(i/18)*Math.PI*2+enemy.age*.11;
          this.projectile('enemy',enemy.x-35,enemy.y,a,185*slow,10,1);
        }
        enemy.shotTimer+=1.35;
      }else {
        const base=Math.PI+Math.sin(enemy.age*.8)*.48;
        for(let i=-5;i<=5;i++)this.projectile('enemy',enemy.x-80,enemy.y,base+i*.115,230*slow,9,1);
        if(cycle%2===0)for(let i=-1;i<=1;i++)this.projectile('enemy',enemy.x-80,enemy.y,aim+i*.21,270*slow,12,1);
        enemy.shotTimer+=.85;
      }
      return;
    }
    if(enemy.kind==='drone') {
      this.projectile('enemy',enemy.x-20,enemy.y,aim,195*slow,9,1);enemy.shotTimer+=2.7;
    }else if(enemy.kind==='wing') {
      for(let i=-1;i<=1;i++)this.projectile('enemy',enemy.x-20,enemy.y,aim+i*.16,205*slow,9,1);
      enemy.shotTimer+=2.25;
    }else if(enemy.kind==='turret') {
      for(let i=-2;i<=2;i++)this.projectile('enemy',enemy.x-25,enemy.y,Math.PI+i*.20,185*slow,11,1);
      enemy.shotTimer+=2.1;
    }else {
      for(let i=-3;i<=3;i++)this.projectile('enemy',enemy.x-40,enemy.y,aim+i*.15,165*slow,13,1);
      enemy.shotTimer+=1.8;
    }
  }
  private damageEnemy(enemy:Enemy,damage:number,near:boolean):void {
    if(enemy.hp<=0||!this.state.enemies.includes(enemy))return;
    enemy.hp-=damage;enemy.flash=.09;
    this.event({kind:'hit',x:enemy.x-10,y:enemy.y,value:damage,enemy:enemy.kind});
    if(enemy.hp<=0)this.killEnemy(enemy,near);
  }
  private killEnemy(enemy:Enemy,near:boolean):void {
    const s=this.state;s.enemies=s.enemies.filter(e=>e.id!==enemy.id);
    s.stats.kills++;s.combo++;s.comboTimer=3.5;
    if(near)s.stats.nearKills++;
    const value=(enemy.kind==='boss'?25000:enemy.kind==='brute'?1400:enemy.kind==='turret'?700:250)*(near?2:1)*(1+Math.floor(Math.min(s.combo,60)/10)*.25);
    s.score+=Math.round(value);
    this.event({kind:'kill',x:enemy.x,y:enemy.y,value:Math.round(value),enemy:enemy.kind,text:near?'近接 ×2':undefined});
    if(enemy.kind==='boss') {
      s.bossActive=false;s.bossDefeated=true;s.phase='victory';s.bullets=[];
      this.event({kind:'victory',x:enemy.x,y:enemy.y,value:s.score});return;
    }
    const pickupKind=s.stats.kills%11===0?'health':s.stats.kills%4===0?'power':'gold';
    s.pickups.push({id:this.nextId++,kind:pickupKind,x:enemy.x,y:enemy.y,age:0});
  }
  private hurt():void {
    const s=this.state,p=s.player;
    if(p.invulnerable>0||s.phase!=='playing')return;
    p.hp--;p.invulnerable=2.5;p.power=Math.max(1,p.power-1);p.charge=0;s.combo=0;s.comboTimer=0;s.stats.damageTaken++;
    // A small local clear communicates the hit and prevents unavoidable follow-up contact.
    s.bullets=s.bullets.filter(b=>b.kind!=='enemy'||distanceSquared(b.x,b.y,p.x,p.y)>200**2);
    this.event({kind:'hurt',x:p.x,y:p.y,value:p.hp});
    if(p.hp<=0){s.phase='gameover';this.event({kind:'gameover',x:p.x,y:p.y,value:s.score});}
  }
  private advanceBullets(dt:number):void {
    const s=this.state,p=s.player;
    const removed=new Set<number>();
    for(const bullet of s.bullets) {
      const ox=bullet.x,oy=bullet.y;bullet.x+=bullet.vx*dt;bullet.y+=bullet.vy*dt;bullet.age+=dt;
      if(bullet.x<-110||bullet.x>WIDTH+220||bullet.y<-100||bullet.y>HEIGHT+100||bullet.age>12){removed.add(bullet.id);continue;}
      if(bullet.kind==='enemy') {
        const d=distanceSquared(bullet.x,bullet.y,p.x,p.y);
        if(d<(bullet.r+7)**2&&p.invulnerable<=0){removed.add(bullet.id);this.hurt();}
        else if(!bullet.grazed&&d<(bullet.r+31)**2&&p.invulnerable<=0){bullet.grazed=true;s.graze++;s.score+=50;this.event({kind:'graze',x:bullet.x,y:bullet.y,value:50});}
      }else {
        const pierced=bullet.kind==='charge'||(s.hero==='golem'&&bullet.kind==='shot');
        let hits=this.piercingHits.get(bullet.id);
        if(!hits&&pierced){hits=new Set<number>();this.piercingHits.set(bullet.id,hits);}
        for(const enemy of [...s.enemies]) {
          if(hits?.has(enemy.id))continue;
          // Segment-distance prevents fast beam projectiles from tunnelling between fixed steps.
          const sx=bullet.x-ox,sy=bullet.y-oy,len=sx*sx+sy*sy;
          const t=len?clamp(((enemy.x-ox)*sx+(enemy.y-oy)*sy)/len,0,1):0;
          if(distanceSquared(ox+t*sx,oy+t*sy,enemy.x,enemy.y)<(bullet.r+enemy.r)**2) {
            this.damageEnemy(enemy,bullet.damage,false);hits?.add(enemy.id);
            if(!pierced){removed.add(bullet.id);break;}
          }
        }
      }
    }
    s.bullets=s.bullets.filter(b=>!removed.has(b.id));
    const live=new Set(s.bullets.map(b=>b.id));
    for(const id of this.piercingHits.keys())if(!live.has(id))this.piercingHits.delete(id);
  }
  step(dt:number,input:InputIntent=NO_INPUT):void {
    const s=this.state;if(s.phase!=='playing'||!Number.isFinite(dt)||dt<=0)return;
    dt=Math.min(dt,.05);const p=s.player;s.time+=dt;
    p.invulnerable=Math.max(0,p.invulnerable-dt);p.nearTimer=Math.max(0,p.nearTimer-dt);
    s.comboTimer=Math.max(0,s.comboTimer-dt);if(s.comboTimer===0)s.combo=0;
    const def=HEROES.find(h=>h.id===s.hero)!;const speed=def.speed*(input.focus?.44:1);
    if(input.target) {
      const dx=input.target.x-p.x,dy=input.target.y-p.y,d=Math.hypot(dx,dy),travel=speed*dt;
      if(d>travel){p.x+=dx/d*travel;p.y+=dy/d*travel;}else {p.x=input.target.x;p.y=input.target.y;}
    }else {
      const length=Math.max(1,Math.hypot(input.x,input.y));p.x+=input.x/length*speed*dt;p.y+=input.y/length*speed*dt;
    }
    p.x=clamp(p.x,55,1480);p.y=clamp(p.y,100,800);
    if(input.charge)p.charge=Math.min(1.3,p.charge+dt);
    else if(this.wasCharge){if(p.charge>=.65)this.chargeShot();p.charge=0;}
    this.wasCharge=input.charge;
    if(input.ultimate&&!this.wasUltimate)this.activateUltimate();this.wasUltimate=input.ultimate;
    this.updateUltimate(dt);
    if(s.phase!=='playing')return;
    p.shotTimer-=dt;if(p.shotTimer<=0&&!input.charge)this.autoShoot();
    // Holding charge suppresses basic fire, with no accumulated burst on release.
    if(input.charge)p.shotTimer=Math.max(p.shotTimer,0);
    if(s.time<65&&s.time>=this.waveAt)this.spawnWave();
    if(s.time>=65&&!this.warned){this.warned=true;this.event({kind:'boss',x:WIDTH*.75,y:HEIGHT/2,text:'WARNING'});}
    if(s.time>=70&&!s.bossActive&&!s.bossDefeated) {
      s.bossActive=true;s.enemies=[];s.bullets=s.bullets.filter(b=>b.kind!=='enemy');
      const boss=this.makeEnemy('boss',WIDTH+130,450);boss.shotTimer=2.7;
      this.event({kind:'boss',x:1280,y:450,text:'機神 · 나찰'});
    }
    for(const enemy of [...s.enemies]) {
      enemy.age+=dt;enemy.flash=Math.max(0,enemy.flash-dt);
      if(enemy.kind==='boss') {
        enemy.x+=(1280-enemy.x)*Math.min(1,dt*1.8);enemy.y=450+Math.sin(enemy.age*.58)*165;
        enemy.phase=enemy.hp/enemy.maxHp>.67?1:enemy.hp/enemy.maxHp>.34?2:3;
      }else {
        enemy.x+=enemy.vx*dt;
        if(enemy.kind==='drone'||enemy.kind==='wing')enemy.y+=Math.sin(enemy.age*2+enemy.seed)*dt*65;
      }
      enemy.shotTimer-=dt;if(enemy.shotTimer<=0&&enemy.x<1530&&enemy.x>80)this.enemyShoot(enemy);
      const dx=enemy.x-p.x,dy=enemy.y-p.y;
      if(dx>-15&&dx<125&&Math.abs(dy)<65&&p.nearTimer<=0&&enemy.kind!=='boss') {
        p.nearTimer=s.hero==='ryu'?.20:.32;
        this.event({kind:'near',x:enemy.x,y:enemy.y,value:s.hero==='ryu'?90:55});
        this.damageEnemy(enemy,s.hero==='ryu'?90:55,true);
      }
      if(enemy.hp>0&&distanceSquared(enemy.x,enemy.y,p.x,p.y)<(enemy.r*.7+7)**2)this.hurt();
    }
    s.enemies=s.enemies.filter(e=>e.x>-150&&e.hp>0);
    this.advanceBullets(dt);
    for(const pickup of s.pickups) {
      pickup.age+=dt;pickup.x-=80*dt;
      const d=Math.hypot(pickup.x-p.x,pickup.y-p.y);
      if(d<160){const travel=Math.min(d,430*dt);if(d>0){pickup.x+=(p.x-pickup.x)/d*travel;pickup.y+=(p.y-pickup.y)/d*travel;}}
      if(d<31) {
        pickup.age=99;const value=pickup.kind==='gold'?150:pickup.kind==='power'?300:100;
        s.score+=value;
        if(pickup.kind==='power')p.power=Math.min(3,p.power+1);
        if(pickup.kind==='health')p.hp=Math.min(p.maxHp,p.hp+1);
        this.event({kind:'pickup',x:pickup.x,y:pickup.y,value,text:pickup.kind==='gold'?'금화 +150':pickup.kind==='power'?'사격 강화':'목숨 회복'});
      }
    }
    s.pickups=s.pickups.filter(item=>item.age<20&&item.x>-60);
  }
}
