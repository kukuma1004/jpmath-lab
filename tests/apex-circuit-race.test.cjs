const {test,before}=require('node:test');
const assert=require('node:assert/strict');
let createRace,vehicleSpecs,tracks;
before(async()=>{
  ({createRace,vehicleSpecs}=await import('../games/apex-circuit/race.js'));
  ({tracks}=await import('../games/apex-circuit/track.js'));
});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function drive(track,trained=false){
  const race=createRace(track,vehicleSpecs.find(v=>v.id==='model-3'));
  let boostFrames=0,boostEnded=false,wasBoosting=false;
  const previous=race.cars.map(c=>c.distance);
  for(let frame=0;frame<18000&&!race.finished;frame++){
    const p=race.cars[0],curve=track.sample(p.distance+8).curve;
    let steer=0,brake=false;
    if(trained){
      let aim=-Math.sign(curve)*Math.min(2.7,Math.abs(curve)*100);
      const traffic=race.cars.slice(1).find(c=>c.distance-p.distance>0&&c.distance-p.distance<15&&Math.abs(c.lane-aim)<2.5);
      if(traffic)aim=traffic.lane>0?-2.9:2.9;
      steer=clamp((aim-p.lane)*.5-p.lateralSpeed*.10,-1,1);
      brake=Math.abs(curve)>.008&&Math.abs(curve)<.05&&Math.abs(steer)>.22&&Math.abs(p.lane)<2.8&&frame%95<31;
    }
    const boost=trained?!brake&&frame%190<135:frame%240<160;
    race.step(1/60,{steer,brake,boost});
    let active=false;
    race.cars.forEach((car,i)=>{
      assert.ok(Number.isFinite(car.distance)&&Number.isFinite(car.speed)&&Number.isFinite(car.lane),track.id+' finite race');
      assert.ok(car.distance>=previous[i]&&car.distance-previous[i]<3,track.id+' continuous forward progress');
      assert.ok(Math.abs(car.lane)<=track.halfWidth&&car.speed>=0&&car.speed<80,track.id+' bounded racing');
      previous[i]=car.distance;
      if(i){
        assert.ok(car.boostReserve>=0&&car.boostReserve<=1,track.id+' finite CPU boost reserve');
        if(car.boosting){boostFrames++;active=true;}
      }
    });
    if(wasBoosting&&!active)boostEnded=true;
    wasBoosting=active;
  }
  assert.ok(race.finished,track.id+' finishes three laps');
  return {race,boostFrames,boostEnded};
}
test('rivals contest repeated boosts with bounded rechargeable boost and continuous progress',()=>{
  let easyWins=0;
  for(const track of tracks){
    const {race,boostFrames,boostEnded}=drive(track);
    easyWins+=Number(race.place===1);
    assert.ok(boostFrames>0&&boostEnded,track.id+' CPU boost starts and ends');
  }
  assert.ok(easyWins<=2,'repeated boosts without steering do not win every course');
});
test('racing line control, overtaking and timed drift keep every course winnable',()=>{
  for(const track of tracks)assert.equal(drive(track,true).race.place,1,track.id+' can be won through the input system');
});
test('clean corner drift preserves pace and rewards release while straight braking slows',()=>{
  const track=tracks.find(t=>t.id==='redrock'),spec=vehicleSpecs.find(v=>v.id==='model-3');
  let distance=0;
  while(distance<track.length){const bend=Math.abs(track.sample(distance).curve);if(bend>.01&&bend<.025)break;distance+=1;}
  assert.ok(distance<track.length,'real test corner exists');
  const race=createRace(track,spec),p=race.cars[0];
  p.distance=distance;p.speed=spec.cruiseSpeed;race.boost=.2;
  race.cars.slice(1).forEach(c=>{c.distance=distance-100;});
  const steer=-Math.sign(track.sample(distance).curve)*.4;
  for(let i=0;i<30;i++)race.step(1/60,{steer,brake:true});
  assert.ok(race.drifting&&race.driftPower>0,'brake and steering charge a slide');
  assert.ok(p.speed>spec.cruiseSpeed*.85,'drift does not crawl');
  const speed=p.speed,charge=race.boost;
  race.step(1/60,{});
  assert.ok(race.events.includes('drift')&&p.speed>speed+4&&race.boost>charge,'clean release awards exit speed and charge');
  const straight=createRace(track,spec),s=straight.cars[0];s.distance=distance;s.speed=spec.cruiseSpeed;
  straight.cars.slice(1).forEach(c=>{c.distance=distance-100;});
  for(let i=0;i<30;i++)straight.step(1/60,{brake:true});
  assert.ok(!straight.drifting&&s.speed<spec.cruiseSpeed*.8,'brake alone still slows');
});
test('rail scraping and reset cannot retain a drift reward or CPU boost state',()=>{
  const track=tracks[0],race=createRace(track,vehicleSpecs[0]),p=race.cars[0];
  p.speed=34;p.lane=track.halfWidth-2.35*.52;
  for(let i=0;i<45;i++)race.step(1/60,{steer:1,brake:true});
  race.step(1/60,{});
  assert.ok(!race.events.includes('drift'),'wall sliding gives no drift exit reward');
  race.reset();
  assert.ok(!race.drifting&&!race.boosting&&race.driftPower===0&&race.time===0);
  assert.ok(race.cars.every(c=>!c.boosting&&c.speed===0),'restart clears held turbo and motion');
});
