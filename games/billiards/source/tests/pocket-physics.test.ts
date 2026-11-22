import { describe,expect,it } from 'vitest';
import { PhysicsEngine } from '../src/physics/PhysicsEngine';
import { DEFAULT_PHYSICS,FIXED_DT,TABLE } from '../src/physics/config';
import type { PhysicsConfig } from '../src/physics/config';
import { makeBall } from '../src/physics/presets';
import { POOL_TABLE,canPlaceBall,createPoolRack,getPocketGeometry,getRailSegments,isInsideTableOrPocketApproach } from '../src/physics/pool';

const noCloth:Partial<PhysicsConfig>={slidingFriction:0,rollingFriction:0,spinDeceleration:0,ballFriction:0,cushionFriction:0,restSpeed:0,restAngularSpeed:0};
const run=(engine:PhysicsEngine,time:number)=>{for(let i=0;i<Math.ceil(time/FIXED_DT);i++)engine.step();};

describe('pool table/rack and renderer geometry contract',()=>{
  it('uses the separate pool size and legal eight-ball rack constraints',()=>{
    expect(POOL_TABLE.width).toBe(2.54);expect(POOL_TABLE.height).toBe(1.27);expect(POOL_TABLE.ballRadius).toBe(.028575);expect(POOL_TABLE.ballMass).toBe(.17);
    expect(TABLE.width).not.toBe(POOL_TABLE.width);
    const rack=createPoolRack(),engine=new PhysicsEngine(rack,POOL_TABLE);
    expect(rack).toHaveLength(16);expect(engine.settled).toBe(true);
    expect(rack.find(b=>b.number===1)?.position.x).toBeCloseTo(POOL_TABLE.width/4,12);
    const eight=rack.find(b=>b.number===8)!;expect(eight.position.z).toBeCloseTo(0,12);
    expect(rack.slice(11)[0].number!<=7).not.toBe(rack.slice(11)[4].number!<=7);
    expect(new Set(rack.map(b=>b.id)).size).toBe(16);expect(new Set(rack.slice(1).map(b=>b.number)).size).toBe(15);
  });

  it('provides six true nose gaps and twelve angled jaw faces matching renderer endpoints',()=>{
    const segments=getRailSegments(POOL_TABLE),pockets=getPocketGeometry(POOL_TABLE);
    expect(pockets.map(p=>p.pocket.id)).toEqual(['tl','tm','tr','bl','bm','br']);
    expect(segments.filter(s=>s.kind==='rail')).toHaveLength(6);expect(segments.filter(s=>s.kind==='jaw')).toHaveLength(12);
    for(const segment of segments){expect(Math.hypot(segment.normal.x,segment.normal.z)).toBeCloseTo(1,12);expect(Math.hypot(segment.a.x-segment.b.x,segment.a.z-segment.b.z)).toBeGreaterThan(0);}
    for(const geometry of pockets){
      const {outward:n,mouth,throat}=geometry;
      expect((throat.center.x-mouth.center.x)*n.x+(throat.center.z-mouth.center.z)*n.z).toBeGreaterThan(0);
      expect(segments.some(s=>s.id===`jaw-${geometry.pocket.id}-a`&&s.a.x===mouth.a.x&&s.b.x===throat.a.x)).toBe(true);
    }
    expect(getRailSegments(TABLE)).toHaveLength(4);
  });
});

describe('swept pocket throat and jaw collisions',()=>{
  it.each(['tl','tm','tr','bl','bm','br'])('pots a centred approach through %s without phantom cushion contact',id=>{
    const geometry=getPocketGeometry(POOL_TABLE).find(g=>g.pocket.id===id)!;
    const ball=makeBall('ball-1','pool',geometry.throat.center.x-geometry.outward.x*.4,geometry.throat.center.z-geometry.outward.z*.4);ball.number=1;ball.velocity={...geometry.outward};
    const engine=new PhysicsEngine([ball],POOL_TABLE,noCloth);run(engine,.6);
    const pots=engine.events.filter(e=>e.type==='pocket');expect(pots).toHaveLength(1);
    expect(pots[0].type==='pocket'&&pots[0].pocketId).toBe(id);expect(pots[0].time).toBeCloseTo(.4,10);
    expect(engine.events.filter(e=>e.type==='cushion')).toHaveLength(0);expect(engine.balls[0].pocketed).toBe(true);expect(engine.settled).toBe(true);expect(engine.energy()).toBe(0);
  });

  it('captures a fast ball at the throat before it tunnels through the table in one tick',()=>{
    const ball=makeBall('white','white',0,-.5);ball.velocity.z=-100;
    const engine=new PhysicsEngine([ball],POOL_TABLE,noCloth);engine.step();
    const event=engine.events.find(e=>e.type==='pocket');expect(event?.type==='pocket'&&event.pocketId).toBe('tm');
    expect(event?.time).toBeCloseTo((.6765-.5)/100,10);expect(engine.balls[0].pocketed).toBe(true);expect(engine.events.filter(e=>e.type==='pocket')).toHaveLength(1);
    run(engine,1);expect(engine.events.filter(e=>e.type==='pocket')).toHaveLength(1);
  });

  it('a ball grazing the side-pocket jaw is reflected rather than swallowed by a capture circle',()=>{
    const ball=makeBall('ball-2','pool',.060,-.35);ball.number=2;ball.velocity.z=-1.5;
    const engine=new PhysicsEngine([ball],POOL_TABLE,noCloth);run(engine,.5);
    expect(engine.events.some(e=>e.type==='cushion')).toBe(true);expect(engine.balls[0].pocketed).not.toBe(true);
    expect(engine.balls[0].position.z).toBeGreaterThan(-POOL_TABLE.height/2);
    expect(engine.safetyStops).toBe(0);
  });

  it('a high-speed off-centre mouth shot collides with finite rounded jaw geometry',()=>{
    const ball=makeBall('ball-2','pool',.063,-.5);ball.velocity.z=-100;
    const engine=new PhysicsEngine([ball],POOL_TABLE,noCloth);engine.step();
    expect(engine.events.some(e=>e.type==='cushion')).toBe(true);expect(engine.balls[0].pocketed).not.toBe(true);
    expect(engine.balls[0].position.z).toBeGreaterThan(-.71);expect(engine.safetyStops).toBe(0);
  });

  it('solid cushion beside a pocket remains collidable and reports the physical centre',()=>{
    const ball=makeBall('white','white',.18,-.3);ball.velocity.z=-1;
    const engine=new PhysicsEngine([ball],POOL_TABLE,noCloth);run(engine,.5);
    expect(engine.balls[0].velocity.z).toBeCloseTo(DEFAULT_PHYSICS.cushionRestitution,12);
    const hit=engine.events.find(e=>e.type==='cushion');expect(hit?.type==='cushion'&&hit.position?.z).toBeCloseTo(-POOL_TABLE.height/2+POOL_TABLE.ballRadius,10);
    expect(engine.events.some(e=>e.type==='pocket')).toBe(false);
  });

  it('records scratch exactly once and ignores pocketed bodies in collisions and rest',()=>{
    const white=makeBall('white','white',0,-.3);white.velocity.z=-1;
    const ghost=makeBall('ball-1','pool',0,-.52);ghost.number=1;ghost.pocketed=true;ghost.pocketId='tm';ghost.velocity={x:500,z:500};ghost.angularVelocity.y=10000;
    const engine=new PhysicsEngine([white,ghost],POOL_TABLE,noCloth);run(engine,.6);
    expect(engine.events.filter(e=>e.type==='ball-ball')).toHaveLength(0);expect(engine.events.filter(e=>e.type==='pocket')).toHaveLength(1);
    expect(engine.events.find(e=>e.type==='pocket')?.type==='pocket'&&engine.events.find(e=>e.type==='pocket')?.ballId).toBe('white');
    expect(engine.settled).toBe(true);expect(engine.energy()).toBe(0);expect(engine.balls[1].position).toEqual(ghost.position);
  });

  it('orders a real cue/object impact before the object pot and keeps independent clones',()=>{
    const cue=makeBall('white','white',0,-.2),object=makeBall('ball-1','pool',0,-.4);cue.velocity.z=-1;object.number=1;
    const engine=new PhysicsEngine([cue,object],POOL_TABLE,noCloth),copy=engine.clone();run(engine,1);run(copy,1);
    const events=engine.events.filter(e=>e.type==='ball-ball'||e.type==='pocket');expect(events[0].type).toBe('ball-ball');expect(events[1].type).toBe('pocket');
    expect(events[1].time).toBeGreaterThan(events[0].time);expect(engine.snapshot()).toEqual(copy.snapshot());expect(engine.events).toEqual(copy.events);
    expect(engine.events.find(e=>e.type==='ball-ball')?.type==='ball-ball'&&engine.events.find(e=>e.type==='ball-ball')?.positionA).toBeDefined();
    copy.table.pockets![0].x+=.1;expect(copy.table.pockets![0].x).not.toBe(engine.table.pockets![0].x);
    const cloneAfterContact=engine.clone();
    const clonedHit=cloneAfterContact.events.find(e=>e.type==='ball-ball');
    if(clonedHit?.type!=='ball-ball'||!clonedHit.positionA)throw new Error('Missing physical impact coordinate');
    clonedHit.positionA.x+=100;
    const originalHit=engine.events.find(e=>e.type==='ball-ball');
    expect(originalHit?.type==='ball-ball'&&originalHit.positionA?.x).not.toBe(clonedHit.positionA.x);
  });
});

describe('ball in hand, long pool simulation and invariants',()=>{
  it('recognizes a legal rounded rail-end rebound without allowing regular rail penetration',()=>{
    const point={x:1.2422888336959883,z:-.5527824896932575};
    expect(isInsideTableOrPocketApproach(POOL_TABLE,point)).toBe(true);
    expect(isInsideTableOrPocketApproach(POOL_TABLE,{x:1.26,z:0})).toBe(false);
    expect(isInsideTableOrPocketApproach(POOL_TABLE,{x:1.5,z:0})).toBe(false);
  });
  it('restores a scratched cue only at clear legal settled positions',()=>{
    const rack=createPoolRack();rack[0].pocketed=true;rack[0].position={x:-4,z:2};
    const engine=new PhysicsEngine(rack,POOL_TABLE);
    expect(engine.placeBall('white',{x:0,z:0})).toBe(true);expect(engine.balls[0].pocketed).toBeUndefined();
    const object=engine.balls.find(b=>b.number===1)!;
    expect(engine.placeBall('white',object.position)).toBe(false);expect(engine.placeBall('white',{x:1.4,z:0})).toBe(false);
    expect(engine.placeBall('white',{x:NaN,z:0})).toBe(false);expect(engine.placeBall('white',{x:0,z:0},'kitchen')).toBe(false);
    expect(engine.placeBall('white',{x:-.8,z:.2},'kitchen')).toBe(true);
    expect(canPlaceBall(POOL_TABLE,engine.balls,'white',{x:.7,z:-.605})).toBe(true);
    // A centre .030 m inside the side-mouth plane leaves the whole R=.028575 m
    // sphere supported by cloth; it is legal even when aligned with the mouth.
    expect(canPlaceBall(POOL_TABLE,engine.balls,'white',{x:0,z:-.605})).toBe(true);
    expect(canPlaceBall(POOL_TABLE,engine.balls,'white',{x:0,z:-.62})).toBe(false);
    engine.strike({ballId:'white',angle:0,power:.4,tip:{x:0,y:0}});expect(engine.placeBall('white',{x:-.8,z:0})).toBe(false);
  });

  it('never strikes an already pocketed ball or accepts an imperceptible below-rest impulse',()=>{
    const ball=makeBall('white','white',0,0);ball.pocketed=true;
    const engine=new PhysicsEngine([ball],POOL_TABLE);
    expect(engine.strike({ballId:'white',angle:0,power:.5,tip:{x:0,y:0}})).toBe(false);
    engine.placeBall('white',{x:0,z:0});expect(engine.strike({ballId:'white',angle:0,power:1e-9,tip:{x:0,y:0}})).toBe(false);
  });

  it('breaks a full rack, settles all live balls and preserves finite passive energy',()=>{
    const engine=new PhysicsEngine(createPoolRack(),POOL_TABLE);engine.strike({ballId:'white',angle:0,power:1,tip:{x:0,y:.05}});
    let energy=engine.energy(),maxGain=0;
    for(let tick=0;tick<240*45&&!engine.settled;tick++){
      engine.step();const next=engine.energy();maxGain=Math.max(maxGain,next-energy);energy=next;
      for(const ball of engine.balls)expect(Number.isFinite(ball.position.x+ball.position.z)).toBe(true);
    }
    expect(engine.settled).toBe(true);expect(engine.safetyStops).toBe(0);expect(maxGain).toBeLessThan(1e-9);
    expect(engine.events.filter(e=>e.type==='ball-ball').length).toBeGreaterThan(12);
    for(let i=1;i<engine.events.length;i++){expect(engine.events[i].time).toBeGreaterThanOrEqual(engine.events[i-1].time-1e-9);expect(engine.events[i].sequence).toBeGreaterThan(engine.events[i-1].sequence);}
  });

  it('keeps seeded full-rack shots inside real rails or pocket approaches with no overlaps or energy gain',()=>{
    for(let seed=1;seed<=12;seed++){
      const engine=new PhysicsEngine(createPoolRack(),POOL_TABLE);
      engine.strike({ballId:'white',angle:(seed-6.5)*.013,power:.35+seed*.05,tip:{x:(seed%3-1)*.23,y:(seed%4-1.5)*.12}});
      let energy=engine.energy();
      for(let tick=0;tick<240*45&&!engine.settled;tick++){
        engine.step();const next=engine.energy();if(next>energy+1e-9)throw new Error(`Energy gain in seed ${seed} tick ${tick}`);energy=next;
        for(const ball of engine.balls)if(!ball.pocketed&&!isInsideTableOrPocketApproach(engine.table,ball.position))throw new Error(`Escaped ball ${ball.id} in seed ${seed} tick ${tick}: ${JSON.stringify({ball,events:engine.events.slice(-6)})}`);
        for(let i=0;i<engine.balls.length;i++)for(let j=i+1;j<engine.balls.length;j++){
          const a=engine.balls[i],b=engine.balls[j];if(a.pocketed||b.pocketed)continue;
          if(Math.hypot(a.position.x-b.position.x,a.position.z-b.position.z)<2*POOL_TABLE.ballRadius-1e-7)throw new Error(`Overlap in seed ${seed} tick ${tick}`);
        }
      }
      expect(engine.settled).toBe(true);expect(engine.safetyStops).toBe(0);
    }
  });
});
