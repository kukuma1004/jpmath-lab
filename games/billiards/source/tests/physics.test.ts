import { describe, expect, it } from 'vitest';
import { PhysicsEngine } from '../src/physics/PhysicsEngine';
import { DEFAULT_PHYSICS, FIXED_DT, TABLE } from '../src/physics/config';
import type { PhysicsConfig } from '../src/physics/config';
import { createLayout, makeBall } from '../src/physics/presets';
import { applyCloth, clothSlip } from '../src/physics/SpinSystem';
import { resolveBallCollision, resolveCushionCollision } from '../src/physics/CollisionSystem';
import type { BallState } from '../src/physics/types';

const frictionless:Partial<PhysicsConfig>={slidingFriction:0,rollingFriction:0,spinDeceleration:0,ballFriction:0,cushionFriction:0,restSpeed:0,restAngularSpeed:0};
const run=(engine:PhysicsEngine,seconds:number)=>{for(let i=0;i<Math.ceil(seconds/FIXED_DT);i++)engine.step();};
const untilRest=(engine:PhysicsEngine)=>{for(let i=0;i<240*60&&!engine.settled;i++)engine.step();expect(engine.settled).toBe(true);};
const momentum=(balls:BallState[])=>balls.reduce((p,b)=>({x:p.x+TABLE.ballMass*b.velocity.x,z:p.z+TABLE.ballMass*b.velocity.z}),{x:0,z:0});

describe('solid-sphere impulse and continuous collisions',()=>{
  it('head-on collision obeys equal-mass restitution and conserves linear momentum',()=>{
    const a=makeBall('a','white',-0.2,0),b=makeBall('b','red',0,0);a.velocity.x=2;
    const engine=new PhysicsEngine([a,b],TABLE,frictionless),initial=momentum(engine.balls);
    run(engine,0.09);
    expect(engine.balls[0].velocity.x).toBeCloseTo((1-DEFAULT_PHYSICS.ballRestitution),10);
    expect(engine.balls[1].velocity.x).toBeCloseTo((1+DEFAULT_PHYSICS.ballRestitution),10);
    expect(momentum(engine.balls).x).toBeCloseTo(initial.x,12);
    const contact=engine.events.find(e=>e.type==='ball-ball');
    expect(contact?.time).toBeCloseTo((0.2-2*TABLE.ballRadius)/2,12);
    expect(engine.events.filter(e=>e.type==='ball-ball')).toHaveLength(1);
  });

  it('oblique elastic frictionless collision conserves both momentum components and energy',()=>{
    const a=makeBall('a','white',-0.2,0),b=makeBall('b','red',0,0.035);a.velocity.x=2;
    const engine=new PhysicsEngine([a,b],TABLE,{...frictionless,ballRestitution:1}),energy=engine.energy(),p=momentum(engine.balls);
    run(engine,0.15);
    expect(engine.events.some(e=>e.type==='ball-ball')).toBe(true);
    expect(engine.energy()).toBeCloseTo(energy,11);
    expect(momentum(engine.balls).x).toBeCloseTo(p.x,11);
    expect(momentum(engine.balls).z).toBeCloseTo(p.z,11);
    expect(engine.balls[1].velocity.z).toBeGreaterThan(0);
    expect(engine.balls[0].velocity.x*engine.balls[1].velocity.x+engine.balls[0].velocity.z*engine.balls[1].velocity.z).toBeCloseTo(0,10);
  });

  it('sweeps high-speed balls that would pass through one another in one 240Hz tick',()=>{
    const a=makeBall('a','white',-0.18,0),b=makeBall('b','red',0.12,0);a.velocity.x=100;b.velocity.x=-100;
    const engine=new PhysicsEngine([a,b],TABLE,{...frictionless,ballRestitution:1});engine.step();
    expect(engine.balls[0].velocity.x).toBeCloseTo(-100,9);expect(engine.balls[1].velocity.x).toBeCloseTo(100,9);
    expect(engine.balls[0].position.x).toBeLessThan(engine.balls[1].position.x);
    expect(engine.events.filter(e=>e.type==='ball-ball')).toHaveLength(1);
  });

  it('resolves simultaneous corner cushions once each, in stable chronological order',()=>{
    const ball=makeBall('a','white',TABLE.width/2-TABLE.ballRadius-0.01,TABLE.height/2-TABLE.ballRadius-0.01);
    ball.velocity.x=ball.velocity.z=4;
    const engine=new PhysicsEngine([ball],TABLE,{...frictionless,cushionRestitution:1});engine.step();
    const hits=engine.events.filter(e=>e.type==='cushion');expect(hits).toHaveLength(2);
    expect(hits[0].time).toBeCloseTo(0.0025,12);expect(hits[1].time).toBeCloseTo(0.0025,12);
    expect(hits[1].sequence).toBeGreaterThan(hits[0].sequence);
    expect(engine.balls[0].velocity).toEqual({x:-4,z:-4});
    run(engine,.03);expect(engine.events.filter(e=>e.type==='cushion')).toHaveLength(2);
  });

  it('transmits a simultaneous touching-ball cluster without overlapping or repeated rule contacts',()=>{
    const d=2*TABLE.ballRadius;
    const balls=[makeBall('a','white',-d,0),makeBall('b','red',0,0),makeBall('c','yellow',d,0)];balls[0].velocity.x=2;
    const engine=new PhysicsEngine(balls,TABLE,frictionless),energy=engine.energy();run(engine,.2);
    expect(engine.energy()).toBeLessThanOrEqual(energy+1e-10);
    for(let i=0;i<2;i++)expect(engine.balls[i+1].position.x-engine.balls[i].position.x).toBeGreaterThanOrEqual(d-1e-8);
    const contacts=engine.events.filter(e=>e.type==='ball-ball');expect(contacts.length).toBeGreaterThanOrEqual(2);
    expect(new Set(contacts.map(e=>e.type==='ball-ball'?`${e.ballA}:${e.ballB}`:'')).size).toBe(contacts.length);
  });

  it('ball contact friction transfers side rotation without increasing energy',()=>{
    const a=makeBall('a','white',-TABLE.ballRadius,0),b=makeBall('b','red',TABLE.ballRadius,0);
    a.velocity.x=2;a.angularVelocity.y=70;
    const engine=new PhysicsEngine([a,b]),before=engine.energy();
    resolveBallCollision(engine.balls[0],engine.balls[1],TABLE,{...DEFAULT_PHYSICS,ballFriction:.15});
    expect(engine.balls[1].angularVelocity.y).not.toBe(0);expect(engine.energy()).toBeLessThan(before);
    expect(momentum(engine.balls).z).toBeCloseTo(0,12);
  });

  it('passive point-contact impulses dissipate energy for arbitrary spin and impact directions',()=>{
    let state=1459;const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/2**32;};
    let maxGain=0,maxMomentumError=0;
    for(let sample=0;sample<800;sample++){
      const angle=random()*Math.PI*2,nx=Math.cos(angle),nz=Math.sin(angle),r=TABLE.ballRadius;
      const a=makeBall('a','white',-r*nx,-r*nz),b=makeBall('b','red',r*nx,r*nz);
      a.velocity={x:4*nx+random()-0.5,z:4*nz+random()-.5};b.velocity={x:-2*nx+random()-.5,z:-2*nz+random()-.5};
      for(const ball of [a,b])ball.angularVelocity={x:(random()-.5)*400,y:(random()-.5)*400,z:(random()-.5)*400};
      const engine=new PhysicsEngine([a,b]),before=engine.energy(),p=momentum(engine.balls);
      resolveBallCollision(engine.balls[0],engine.balls[1],TABLE,DEFAULT_PHYSICS);
      maxGain=Math.max(maxGain,engine.energy()-before);const after=momentum(engine.balls);maxMomentumError=Math.max(maxMomentumError,Math.abs(after.x-p.x),Math.abs(after.z-p.z));
      const railBall=makeBall('c','white',0,0);railBall.velocity={x:-random()*6-.01,z:(random()-.5)*6};railBall.angularVelocity={x:(random()-.5)*400,y:(random()-.5)*400,z:(random()-.5)*400};
      const railEngine=new PhysicsEngine([railBall]),railBefore=railEngine.energy();resolveCushionCollision(railEngine.balls[0],'left',TABLE,DEFAULT_PHYSICS);maxGain=Math.max(maxGain,railEngine.energy()-railBefore);
    }
    expect(maxGain).toBeLessThanOrEqual(1e-10);expect(maxMomentumError).toBeLessThan(1e-12);
  });

  it('keeps a 16-ball touching rack stable for the future pocketball rules module',()=>{
    const radius=TABLE.ballRadius,balls=[makeBall('cue','white',-.80,0)];
    let id=1;
    for(let row=0;row<5;row++)for(let column=0;column<=row;column++)balls.push(makeBall(`rack${id++}`,'red',.05+row*Math.sqrt(3)*radius,(column-row/2)*2*radius));
    const engine=new PhysicsEngine(balls);engine.strike({ballId:'cue',angle:0,power:1,tip:{x:0,y:0}});run(engine,8);
    expect(engine.safetyStops).toBe(0);expect(engine.events.filter(e=>e.type==='ball-ball').length).toBeGreaterThan(10);
    for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++)expect(Math.hypot(engine.balls[i].position.x-engine.balls[j].position.x,engine.balls[i].position.z-engine.balls[j].position.z)).toBeGreaterThanOrEqual(2*radius-1e-8);
  });
});

describe('cloth, strike and spin',()=>{
  it('central sliding sphere approaches the analytic 5/7 rolling speed and no-slip constraint',()=>{
    const ball=makeBall('a','white',0,0);ball.velocity.x=2;
    const transition=2/(3.5*DEFAULT_PHYSICS.slidingFriction*DEFAULT_PHYSICS.gravity);
    applyCloth(ball,transition,TABLE.ballRadius,{...DEFAULT_PHYSICS,rollingFriction:0});
    expect(ball.velocity.x).toBeCloseTo(2*5/7,11);
    expect(ball.angularVelocity.z).toBeCloseTo(-ball.velocity.x/TABLE.ballRadius,10);
    expect(Math.hypot(...Object.values(clothSlip(ball,TABLE.ballRadius)))).toBeLessThan(1e-10);
  });

  it('rolling deceleration uses μrg and preserves the rolling constraint',()=>{
    const ball=makeBall('a','white',0,0);ball.velocity.x=1;ball.angularVelocity.z=-1/TABLE.ballRadius;
    applyCloth(ball,.5,TABLE.ballRadius,DEFAULT_PHYSICS);
    expect(ball.velocity.x).toBeCloseTo(1-DEFAULT_PHYSICS.rollingFriction*DEFAULT_PHYSICS.gravity*.5,12);
    expect(clothSlip(ball,TABLE.ballRadius).x).toBeCloseTo(0,12);
  });

  it('cue torque sign and magnitude follow r×J/I for top, draw and side offsets',()=>{
    const engine=new PhysicsEngine([makeBall('a','white',0,0)]);
    expect(engine.strike({ballId:'a',angle:0,power:.5,tip:{x:.3,y:.4}})).toBe(true);
    expect(engine.balls[0].velocity.x).toBeCloseTo(3.25,12);
    expect(engine.balls[0].angularVelocity.z).toBeCloseTo(-2.5*3.25*.4/TABLE.ballRadius,10);
    expect(engine.balls[0].angularVelocity.y).toBeCloseTo(2.5*3.25*.3/TABLE.ballRadius,10);
  });

  it('draw reverses and follow continues after a nearby head-on object-ball impact',()=>{
    const shoot=(tipY:number)=>{
      const cue=makeBall('a','white',-0.16,0),object=makeBall('b','red',0,0);
      const engine=new PhysicsEngine([cue,object]);engine.strike({ballId:'a',angle:0,power:.45,tip:{x:0,y:tipY}});run(engine,.45);return engine;
    };
    const draw=shoot(-.6),follow=shoot(.6);
    expect(draw.events.some(e=>e.type==='ball-ball')).toBe(true);expect(follow.events.some(e=>e.type==='ball-ball')).toBe(true);
    expect(draw.balls[0].velocity.x).toBeLessThan(-.1);expect(follow.balls[0].velocity.x).toBeGreaterThan(.1);
  });

  it('opposite side rotation changes cushion tangent response through contact friction',()=>{
    const bounce=(spin:number)=>{const ball=makeBall('a','white',0,0);ball.velocity.x=-2;ball.angularVelocity.y=spin;resolveCushionCollision(ball,'left',TABLE,DEFAULT_PHYSICS);return ball;};
    const left=bounce(60),right=bounce(-60),center=bounce(0);
    expect(center.velocity.z).toBe(0);expect(left.velocity.z).toBeLessThan(0);expect(right.velocity.z).toBeGreaterThan(0);
    expect(left.velocity.x).toBeCloseTo(right.velocity.x,12);
    expect(left.angularVelocity.y).toBeLessThan(60);
  });

  it('vertical-axis spin does not arbitrarily bend a freely travelling ball',()=>{
    const ball=makeBall('a','white',-.4,0);ball.velocity.x=1;ball.angularVelocity.y=50;
    const engine=new PhysicsEngine([ball]);run(engine,.4);expect(engine.balls[0].position.z).toBe(0);expect(engine.balls[0].velocity.z).toBe(0);
  });

  it('a ball still spinning in place is not settled; it naturally comes to rest',()=>{
    const ball=makeBall('a','white',0,0);ball.angularVelocity.y=12;
    const engine=new PhysicsEngine([ball]);expect(engine.settled).toBe(false);untilRest(engine);
    expect(engine.balls[0].angularVelocity.y).toBe(0);expect(engine.events.filter(e=>e.type==='rest')).toHaveLength(1);
    run(engine,1);expect(engine.events.filter(e=>e.type==='rest')).toHaveLength(1);
  });

  it('low-speed rolling never reverses or remains in perpetual micro-motion',()=>{
    const ball=makeBall('a','white',0,0);ball.velocity.x=.008;ball.angularVelocity.z=-.008/TABLE.ballRadius;
    const engine=new PhysicsEngine([ball]);untilRest(engine);expect(engine.balls[0].position.x).toBeGreaterThanOrEqual(0);
    expect(engine.balls[0].velocity.x).toBe(0);
  });
});

describe('determinism, safety and long-running shots',()=>{
  it('is settled at creation and rejects bad input and mid-shot duplicate strikes',()=>{
    const engine=new PhysicsEngine(createLayout('opening'));
    expect(engine.settled).toBe(true);
    for(const shot of [
      {ballId:'missing',angle:0,power:.5,tip:{x:0,y:0}},
      {ballId:'white',angle:NaN,power:.5,tip:{x:0,y:0}},
      {ballId:'white',angle:0,power:1.1,tip:{x:0,y:0}},
      {ballId:'white',angle:0,power:0,tip:{x:0,y:0}},
      {ballId:'white',angle:0,power:.5,tip:{x:.6,y:.6}},
    ])expect(engine.strike(shot)).toBe(false);
    const shot={ballId:'white',angle:0,power:.5,tip:{x:0,y:0}};
    expect(engine.strike(shot)).toBe(true);expect(engine.strike(shot)).toBe(false);
  });

  it('clones are independent and equal inputs produce byte-equal state/event histories',()=>{
    const first=new PhysicsEngine(createLayout('collision')),second=first.clone();
    const input={ballId:'white',angle:.03,power:.8,tip:{x:.25,y:-.4}};
    first.strike(input);second.strike(input);run(first,20);run(second,20);
    expect(first.snapshot()).toEqual(second.snapshot());expect(first.events).toEqual(second.events);
    second.balls[0].position.x+=.01;expect(first.balls[0].position.x).not.toBe(second.balls[0].position.x);
  });

  it('all supported practice layouts have valid nonoverlapping balls',()=>{
    for(const name of ['opening','collision','cushion','spin'] as const)for(const count of [3,4] as const){
      const engine=new PhysicsEngine(createLayout(name,count));expect(engine.balls).toHaveLength(count);expect(engine.settled).toBe(true);
    }
  });

  it('keeps passive energy non-increasing, states finite and balls separated over many seeded shots',()=>{
    let seed=92035;
    let maxEnergyGain=0,maxOverlap=0,maxBoundaryViolation=0,maxQuaternionError=0,finite=true;
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
    for(let shot=0;shot<24;shot++){
      const engine=new PhysicsEngine(createLayout((['opening','collision','cushion','spin'] as const)[shot%4]));
      const angle=random()*Math.PI*2,tipAngle=random()*Math.PI*2,tipRadius=random()*.72;
      engine.strike({ballId:'white',angle,power:.2+random()*.8,tip:{x:Math.cos(tipAngle)*tipRadius,y:Math.sin(tipAngle)*tipRadius}});
      let energy=engine.energy();
      for(let step=0;step<240*45&&!engine.settled;step++){
        engine.step();const next=engine.energy();maxEnergyGain=Math.max(maxEnergyGain,next-energy);energy=next;
        for(const ball of engine.balls){
          finite=finite&&Number.isFinite(ball.position.x+ball.position.z+ball.angularVelocity.y);
          maxBoundaryViolation=Math.max(maxBoundaryViolation,Math.abs(ball.position.x)-(TABLE.width/2-TABLE.ballRadius),Math.abs(ball.position.z)-(TABLE.height/2-TABLE.ballRadius));
          maxQuaternionError=Math.max(maxQuaternionError,Math.abs(Math.hypot(...Object.values(ball.orientation))-1));
        }
        for(let i=0;i<engine.balls.length;i++)for(let j=i+1;j<engine.balls.length;j++)maxOverlap=Math.max(maxOverlap,2*TABLE.ballRadius-Math.hypot(engine.balls[i].position.x-engine.balls[j].position.x,engine.balls[i].position.z-engine.balls[j].position.z));
      }
      expect(engine.settled).toBe(true);
      expect(engine.safetyStops).toBe(0);
      for(let i=1;i<engine.events.length;i++){expect(engine.events[i].time).toBeGreaterThanOrEqual(engine.events[i-1].time-1e-10);expect(engine.events[i].sequence).toBeGreaterThan(engine.events[i-1].sequence);}
    }
    expect(maxEnergyGain).toBeLessThanOrEqual(1e-9);expect(maxOverlap).toBeLessThanOrEqual(1e-8);expect(maxBoundaryViolation).toBeLessThanOrEqual(1e-8);expect(maxQuaternionError).toBeLessThan(1e-9);expect(finite).toBe(true);
  });

  it('rejects nonfinite, overlapping and out-of-table initial states',()=>{
    expect(()=>new PhysicsEngine([makeBall('a','white',2,0)])).toThrow();
    expect(()=>new PhysicsEngine([makeBall('a','white',0,0),makeBall('b','red',.01,0)])).toThrow();
    expect(()=>new PhysicsEngine([makeBall('a','white',NaN,0)])).toThrow();
    const bad=makeBall('a','white',0,0);bad.orientation.w=0;expect(()=>new PhysicsEngine([bad])).toThrow();
  });
});
