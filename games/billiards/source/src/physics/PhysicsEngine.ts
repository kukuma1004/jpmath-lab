import type { BallState, PhysicsEvent, PhysicsSnapshot, ShotInput, TableConfig } from './types';
import { DEFAULT_PHYSICS, FIXED_DT, TABLE } from './config';
import type { PhysicsConfig } from './config';
import { applyCloth, integrateOrientation } from './SpinSystem';
import { correctPositions, earliestContact, resolveBallCollision, resolveCushionCollision } from './CollisionSystem';

const copyBalls=(balls: BallState[]):BallState[]=>balls.map(b=>({...b,position:{...b.position},velocity:{...b.velocity},angularVelocity:{...b.angularVelocity},orientation:{...b.orientation}}));

/** Pure deterministic physics. Rendering, scorekeeping and real-time accumulators live outside. */
export class PhysicsEngine {
  balls: BallState[];
  time=0;
  events: PhysicsEvent[]=[];
  /** Degenerate-cluster guard trips. Normal play/test coverage must leave this at zero. */
  safetyStops=0;
  readonly table: TableConfig;
  readonly config: PhysicsConfig;
  private sequence=0;
  private hadMotion=false;
  private activeContacts=new Set<string>();

  constructor(balls: BallState[],table:TableConfig=TABLE,config:Partial<PhysicsConfig>={}){
    this.table={...table};this.config={...DEFAULT_PHYSICS,...config};
    if(!Object.values(this.table).every(n=>Number.isFinite(n)&&n>0)||this.table.width<=2*this.table.ballRadius||this.table.height<=2*this.table.ballRadius)throw new Error('Invalid table dimensions');
    if(!Object.values(this.config).every(n=>Number.isFinite(n)&&n>=0)||this.config.ballRestitution>1||this.config.cushionRestitution>1)throw new Error('Invalid physics coefficients');
    this.balls=[];this.reset(balls);
  }

  get settled():boolean{
    return this.balls.every(b=>Math.hypot(b.velocity.x,b.velocity.z)<=this.config.restSpeed
      &&Math.hypot(b.angularVelocity.x,b.angularVelocity.y,b.angularVelocity.z)<=this.config.restAngularSpeed);
  }

  reset(balls:BallState[]):void{
    if(new Set(balls.map(b=>b.id)).size!==balls.length)throw new Error('Ball IDs must be unique');
    for(const ball of balls){
      const values=[...Object.values(ball.position),...Object.values(ball.velocity),...Object.values(ball.angularVelocity),...Object.values(ball.orientation)];
      if(!values.every(Number.isFinite))throw new Error('Ball state must be finite');
      if(Math.hypot(...Object.values(ball.orientation))<1e-12)throw new Error('Ball orientation must have nonzero length');
      if(Math.abs(ball.position.x)>this.table.width/2-this.table.ballRadius+1e-8||Math.abs(ball.position.z)>this.table.height/2-this.table.ballRadius+1e-8)throw new Error('Ball outside table');
    }
    for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){
      if(Math.hypot(balls[i].position.x-balls[j].position.x,balls[i].position.z-balls[j].position.z)<2*this.table.ballRadius-1e-8)throw new Error('Initial balls overlap');
    }
    this.balls=copyBalls(balls);
    for(const ball of this.balls){const q=ball.orientation,n=Math.hypot(q.x,q.y,q.z,q.w);q.x/=n;q.y/=n;q.z/=n;q.w/=n;}
    this.time=0;this.events=[];this.sequence=0;this.safetyStops=0;this.activeContacts.clear();this.hadMotion=!this.settled;
  }

  snapshot():PhysicsSnapshot{return {balls:copyBalls(this.balls),time:this.time};}

  clone():PhysicsEngine{
    const copy=new PhysicsEngine(this.balls,this.table,this.config);
    copy.time=this.time;copy.events=this.events.map(e=>({...e}));copy.sequence=this.sequence;copy.safetyStops=this.safetyStops;copy.hadMotion=this.hadMotion;copy.activeContacts=new Set(this.activeContacts);
    return copy;
  }

  energy():number{
    const m=this.table.ballMass,inertia=0.4*m*this.table.ballRadius**2;
    return this.balls.reduce((energy,b)=>energy+0.5*m*(b.velocity.x**2+b.velocity.z**2)+0.5*inertia*(b.angularVelocity.x**2+b.angularVelocity.y**2+b.angularVelocity.z**2),0);
  }

  strike(input:ShotInput):boolean{
    const ball=this.balls.find(b=>b.id===input.ballId);
    if(!ball||!this.settled||![input.angle,input.power,input.tip.x,input.tip.y].every(Number.isFinite)
      ||input.power<=0||input.power>1||Math.hypot(input.tip.x,input.tip.y)>0.75+1e-10)return false;
    const {angle,power,tip}=input,d={x:Math.cos(angle),z:Math.sin(angle)},speed=this.config.maxShotSpeed*power;
    // Fixed requested cue impulse J=mv d; offset r gives Δω=(r×J)/I.
    // Panel right is d×up=(-sinθ,0,cosθ), top is +Y.
    ball.velocity.x=speed*d.x;ball.velocity.z=speed*d.z;
    const k=2.5*speed/this.table.ballRadius;
    ball.angularVelocity.x=k*tip.y*d.z;
    ball.angularVelocity.y=k*tip.x;
    ball.angularVelocity.z=-k*tip.y*d.x;
    this.hadMotion=true;
    this.events.push({type:'shot',time:this.time,sequence:this.sequence++,ballId:ball.id,speed});
    return true;
  }

  step(dt=FIXED_DT):void{
    if(!Number.isFinite(dt)||dt<0||dt>2)throw new Error('Step duration must be between 0 and 2 seconds');
    let remaining=dt;
    while(remaining>1e-12){
      const quantum=Math.min(remaining,FIXED_DT);this.fixedStep(quantum);remaining-=quantum;
    }
  }

  private fixedStep(dt:number):void{
    if(this.settled&&!this.hadMotion)return;
    this.hadMotion=this.hadMotion||!this.settled;
    for(const ball of this.balls)applyCloth(ball,dt/2,this.table.ballRadius,this.config);
    let remaining=dt,elapsed=0,collisions=0;
    while(remaining>1e-12){
      this.releaseSeparatedContacts();
      const contact=earliestContact(this.balls,this.table,remaining);
      if(!contact){this.advance(remaining);elapsed+=remaining;remaining=0;break;}
      const travel=contact.time;
      if(travel>0){this.advance(travel);elapsed+=travel;remaining-=travel;}
      const a=this.balls[contact.a];
      if(contact.b!==undefined){
        const b=this.balls[contact.b],speed=resolveBallCollision(a,b,this.table,this.config),key=`b:${contact.a}:${contact.b}`;
        if(speed>1e-9&&!this.activeContacts.has(key))this.events.push({type:'ball-ball',time:this.time+elapsed,sequence:this.sequence++,ballA:a.id,ballB:b.id,speed});
        this.activeContacts.add(key);
      }else if(contact.rail){
        const speed=resolveCushionCollision(a,contact.rail,this.table,this.config),key=`r:${contact.a}:${contact.rail}`;
        if(speed>1e-9&&!this.activeContacts.has(key))this.events.push({type:'cushion',time:this.time+elapsed,sequence:this.sequence++,ballId:a.id,rail:contact.rail,speed});
        this.activeContacts.add(key);
      }
      if(++collisions>128){
        // Degenerate compressed clusters: do not integrate through unresolved contacts.
        // Dissipative freeze is a rare safety valve, never a source of energy or rule contacts.
        this.safetyStops++;
        for(const ball of this.balls){ball.velocity.x=ball.velocity.z=0;ball.angularVelocity.x=ball.angularVelocity.y=ball.angularVelocity.z=0;}
        elapsed+=remaining;remaining=0;break;
      }
    }
    correctPositions(this.balls,this.table);
    for(const ball of this.balls)applyCloth(ball,dt/2,this.table.ballRadius,this.config);
    this.time+=dt;
    if(this.settled&&this.hadMotion){
      for(const ball of this.balls){ball.velocity.x=ball.velocity.z=0;ball.angularVelocity.x=ball.angularVelocity.y=ball.angularVelocity.z=0;}
      this.events.push({type:'rest',time:this.time,sequence:this.sequence++});this.hadMotion=false;
    }
  }

  private advance(dt:number):void{
    for(const ball of this.balls){ball.position.x+=ball.velocity.x*dt;ball.position.z+=ball.velocity.z*dt;integrateOrientation(ball,dt);}
  }

  private releaseSeparatedContacts():void{
    const r=this.table.ballRadius,x=this.table.width/2-r,z=this.table.height/2-r;
    for(const key of this.activeContacts){
      const [type,aIndex,bOrRail]=key.split(':'),a=this.balls[Number(aIndex)];
      if(!a){this.activeContacts.delete(key);continue;}
      if(type==='b'){
        const b=this.balls[Number(bOrRail)];
        if(!b||Math.hypot(a.position.x-b.position.x,a.position.z-b.position.z)>2*r+1e-7)this.activeContacts.delete(key);
      }else{
        const gap=bOrRail==='left'?a.position.x+x:bOrRail==='right'?x-a.position.x:bOrRail==='top'?a.position.z+z:z-a.position.z;
        if(gap>1e-7)this.activeContacts.delete(key);
      }
    }
  }
}
