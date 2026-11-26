import {describe,it,expect} from 'vitest';
import {PhysicsEngine} from '../src/physics/PhysicsEngine';
import {FIXED_DT,TABLE} from '../src/physics/config';
import {POOL_TABLE} from '../src/physics/pool';
import {makeBall} from '../src/physics/presets';

describe('stronger stroke range',()=>{
 for(const [label,table,oldMaximum,newMaximum] of [['carom',TABLE,4.5,6.5],['pool',POOL_TABLE,7.5,9.5]] as const){
  it(`${label} provides a stronger top end while retaining proportional soft strokes`,()=>{
   for(const power of [.08,.25,.5,1]){
    const engine=new PhysicsEngine([makeBall('white','white',0,0)],table);
    expect(engine.strike({ballId:'white',angle:0,power,tip:{x:0,y:0}})).toBe(true);
    expect(engine.balls[0].velocity.x).toBeCloseTo(newMaximum*power,12);
    if(power===1)expect(engine.balls[0].velocity.x).toBeGreaterThan(oldMaximum);
   }
  });
  it(`${label} reaches a real cushion sooner and the stronger shot still settles safely`,()=>{
   const balls=[makeBall('white','white',0,.2)],input={ballId:'white',angle:0,power:1,tip:{x:0,y:0}};
   const stronger=new PhysicsEngine(balls,table),previous=new PhysicsEngine(balls,table,{maxShotSpeed:oldMaximum});
   for(const engine of [stronger,previous]){
    expect(engine.strike(input)).toBe(true);
    let energy=engine.energy();
    for(let tick=0;tick<240*60&&!engine.settled;tick++){
     engine.step(FIXED_DT);expect(engine.energy()).toBeLessThanOrEqual(energy+1e-8);energy=engine.energy();
     expect(Number.isFinite(engine.balls[0].position.x)).toBe(true);
    }
    expect(engine.settled).toBe(true);expect(engine.safetyStops).toBe(0);
   }
   const contact=(engine:PhysicsEngine)=>engine.events.find(e=>e.type==='cushion')?.time;
   expect(contact(stronger)).toBeDefined();expect(contact(previous)).toBeDefined();
   expect(contact(stronger)!).toBeLessThan(contact(previous)!*.85);
  });
 }
});
