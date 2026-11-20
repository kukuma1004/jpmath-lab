const {test,before}=require('node:test');
const assert=require('node:assert/strict');
let createRace,vehicleSpecs,tracks;
before(async()=>{
  ({createRace,vehicleSpecs}=await import('../games/apex-circuit/race.js'));
  ({tracks}=await import('../games/apex-circuit/track.js'));
});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function drive(track,trained=false,id='model-3'){
  const spec=vehicleSpecs.find(v=>v.id===id),race=createRace(track,spec);
  let boostFrames=0,boostEnded=false,wasBoosting=false;
  const previous=race.cars.map(c=>c.distance);
  for(let frame=0;frame<18000&&!race.finished;frame++){
    const p=race.cars[0],curve=track.sample(p.distance+8).curve;
    let steer=0,brake=false;
    if(trained){
      let aim=-clamp(track.sample(p.distance+7).curve*145,-4.4,4.4);
      const traffic=race.cars.slice(1).find(c=>c.distance-p.distance>0&&c.distance-p.distance<15&&Math.abs(c.lane-aim)<2.5);
      if(traffic)aim=traffic.lane>0?-4.4:4.4;
      if(race.boost<.86){
        let nextPad;
        for(const pad of track.pads){
          const gap=((pad.distance-p.distance)%track.length+track.length)%track.length;
          if(!nextPad||gap<nextPad.gap)nextPad={lane:pad.lane,gap};
        }
        if(nextPad&&nextPad.gap<32)aim=nextPad.lane;
      }
      const bend=track.sample(p.distance+7).curve;
      brake=Math.abs(bend)>.007&&Math.abs(bend)<.075&&p.speed>27&&(race.boost<.72||Math.abs(bend)>.045)&&frame%53<32;
      const outward=clamp(track.sample(p.distance).curve*p.speed**2*(brake?.065:.155)/spec.grip,-11,11);
      steer=clamp((clamp((aim-p.lane)*4-p.lateralSpeed*.45,-11,11)-outward)/(brake?11.5:13.8),-1,1);
      if(brake&&Math.abs(steer)<.22)steer=steer<0?-.23:.23;
    }
    const boost=trained?!brake&&race.boost>.16&&(Math.abs(track.sample(p.distance+7).curve)<.045||race.boost>.8):frame%240<160;
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
test('expert lines and drift can win every course while untimed boost loses the same races',()=>{
  for(const track of tracks){
    const expert=drive(track,true,'nova').race;
    assert.equal(expert.place,1,track.id+' can be won through steering/drift/boost inputs');
    assert.ok(drive(track).race.place>1,track.id+' requires more than repeated boost');
    assert.ok(expert.cars.slice(1).some(c=>c.padCharges>0),track.id+' rivals collect real charging pads');
    assert.ok(expert.cars.slice(1).some(c=>c.driftExits>0),track.id+' rivals use corner-exit kicks');
  }
});
test('ten arcade profiles differ in measured acceleration, steering and boost endurance',()=>{
  assert.equal(vehicleSpecs.length,10);
  const signatures=new Set(vehicleSpecs.map(s=>[s.topSpeed,s.acceleration,s.grip,s.boostDrain].join(':')));
  assert.equal(signatures.size,10,'every car has its own driving profile');
  // A flat isolated fixture measures actual input response without traffic or pad pickups.
  const straight={length:10000,halfWidth:8,pads:[],gaps:[],sample(d,out={}){return Object.assign(out,{curve:0,slope:0,y:0});}};
  const stats=Object.fromEntries(vehicleSpecs.map(spec=>{
    const r=createRace(straight,spec);r.cars.slice(1).forEach(c=>c.distance=-1000);
    for(let f=0;f<60;f++)r.step(1/60,{});
    const speed=r.cars[0].speed;r.boost=1;
    for(let f=0;f<60;f++)r.step(1/60,{boost:true});
    return [spec.id,{speed,charge:r.boost}];
  }));
  assert.ok(stats['ioniq-5-n'].speed>stats.cybertruck.speed+5,'corner hatch reaccelerates faster than heavy truck');
  assert.ok(stats.cybertruck.charge>stats.raptor.charge+.2,'truck boost lasts materially longer than the power prototype');
  assert.ok(vehicleSpecs.find(s=>s.id==='raptor').topSpeed>vehicleSpecs.find(s=>s.id==='nova').topSpeed+8,'speed and grip classes trade top speed');
});
test('road opponents use the actual models visible on their grid',()=>{
  const roster=vehicleSpecs.filter(s=>s.cosmetic),start=roster.findIndex(s=>s.id==='model-y');
  const r=createRace(tracks[0],roster[start]);
  assert.deepEqual(r.cars.map(c=>c.vehicleId),Array.from({length:5},(_,i)=>roster[(start+i)%roster.length].id));
  const straight={length:10000,halfWidth:8,pads:[],gaps:[],sample(d,out={}){return Object.assign(out,{curve:0,slope:0,y:0});}};
  const grid=createRace(straight,roster[start]);
  for(let f=0;f<60;f++)grid.step(1/60,{});
  const truck=grid.cars.find(c=>c.vehicleId==='cybertruck'),hatch=grid.cars.find(c=>c.vehicleId==='ioniq-5-n');
  assert.ok(hatch.speed>truck.speed+6,'CPU models retain their different launch acceleration');
});
test('hands-off steering keeps the chosen line and corner drifting preserves more pace',()=>{
  const flat={length:10000,halfWidth:8,pads:[],gaps:[],sample(d,out={}){return Object.assign(out,{curve:0,slope:0,y:0});}};
  const spec=vehicleSpecs[0],r=createRace(flat,spec),p=r.cars[0];
  p.lane=3;p.speed=34;r.cars.slice(1).forEach(c=>c.distance=-1000);
  for(let f=0;f<60;f++)r.step(1/60,{});
  assert.ok(p.lane>2.5&&p.lane<3,'releasing steering no longer pulls the car quickly back to center');
  const corner={...flat,sample(d,out={}){return Object.assign(out,{curve:.02,slope:0,y:0});}};
  const coast=createRace(corner,spec),slide=createRace(corner,spec);
  for(const race of [coast,slide]){race.cars[0].speed=40;race.cars.slice(1).forEach(c=>c.distance=-1000);}
  for(let f=0;f<30;f++){coast.step(1/60,{});slide.step(1/60,{steer:-.5,brake:true});}
  assert.ok(coast.cars[0].lane>1,'unsteered fast corner pushes the car outward');
  assert.ok(slide.drifting&&slide.cars[0].speed>coast.cars[0].speed+2,'active drift earns corner speed instead of automatic corner help');
});
test('holding boost against a curved outer rail cannot act as automatic cornering',()=>{
  const corner={length:10000,halfWidth:8,pads:[],gaps:[],sample(d,out={}){return Object.assign(out,{curve:.04,slope:0,y:0});}};
  const spec=vehicleSpecs.find(s=>s.id==='cybertruck'),r=createRace(corner,spec),p=r.cars[0];
  p.lane=corner.halfWidth-2.35*.52;p.speed=spec.topSpeed;r.boost=1;
  r.cars.slice(1).forEach(c=>c.distance=-1000);let hits=0;
  for(let f=0;f<120;f++){r.step(1/60,{boost:true});if(r.events.includes('wall'))hits++;}
  assert.ok(p.speed<spec.cruiseSpeed*.9,'sustained rail friction beats full turbo');
  assert.equal(hits,1,'continuous scraping does not spam impact events');
  for(let f=0;f<30;f++)r.step(1/60,{steer:-1,brake:true});
  assert.ok(p.lane<corner.halfWidth-2,'steer/drift away from the rail recovers control');
});
test('new courses have distinct routes, bounded grade and a genuine foundry drop',()=>{
  assert.equal(tracks.length,7);
  for(const id of ['windway','foundry']){
    const t=tracks.find(t=>t.id===id);assert.ok(t&&t.length>500&&t.pads.length>=3);
    for(let d=0;d<t.length;d+=2){const p=t.sample(d);assert.ok(Number.isFinite(p.curve)&&Math.abs(p.slope)<1.2,id+' finite driveable grade');}
  }
  const t=tracks.find(t=>t.id==='foundry'),r=createRace(t,vehicleSpecs[0]),p=r.cars[0],gap=t.gaps[0];
  assert.ok(gap.end>gap.start&&gap.drop>=15,'authored road cut');p.distance=gap.start-.2;p.speed=34;
  r.step(1/60,{});assert.ok(p.airborne&&p.air>0);
  for(let f=0;f<300&&p.airborne;f++)r.step(1/60,{});
  assert.ok(!p.airborne&&p.air===0,'real drop returns to the catch road');
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
  assert.ok(race.boost>.39,'boost visibly refills while drift is held, before release');
  assert.ok(p.speed>spec.cruiseSpeed*.85,'drift does not crawl');
  const speed=p.speed,charge=race.boost;
  race.step(1/60,{});
  assert.ok(race.events.includes('drift')&&p.speed>speed+4&&race.boost>charge,'clean release awards exit speed and charge');
  const straight=createRace(track,spec),s=straight.cars[0];s.distance=distance;s.speed=spec.cruiseSpeed;
  straight.cars.slice(1).forEach(c=>{c.distance=distance-100;});
  for(let i=0;i<30;i++)straight.step(1/60,{brake:true});
  assert.ok(!straight.drifting&&s.speed<spec.cruiseSpeed*.8,'brake alone still slows');
});
test('continuous roads keep tires down while genuine course gaps still launch',()=>{
  const course=tracks.find(t=>t.id==='sunset'),race=createRace(course,vehicleSpecs[0]),p=race.cars[0];
  const ramp=course.ramps[0];p.distance=ramp.start+ramp.length/2-34/60;p.speed=34;
  race.cars.slice(1).forEach(c=>{c.distance=p.distance-100;});race.step(1/60,{});
  assert.equal(p.air,0);assert.equal(p.airborne,false);
  const summit=tracks.find(t=>t.id==='summit'),jump=createRace(summit,vehicleSpecs[0]),car=jump.cars[0];
  car.distance=summit.gaps[0].start-.2;car.speed=34;jump.step(1/60,{});
  assert.ok(car.flight&&car.airborne&&car.air>0,'22m gap remains a genuine jump');
});
test('rival turbo scales with the selected power car and spends a bounded reserve',()=>{
  const race=createRace(tracks[0],vehicleSpecs.find(v=>v.id==='raptor'));let peak=0,spent=false;
  for(let i=0;i<1200;i++){
    race.step(1/60,{});
    race.cars.slice(1).forEach(c=>{peak=Math.max(peak,c.speed);spent ||= c.boostReserve<.2;assert.ok(c.boostReserve>=0&&c.boostReserve<=1);});
  }
  assert.ok(peak>57&&peak<63,'power car does not get free 62 versus 51 m/s superiority');
  assert.ok(spent,'rivals spend actual fuel');
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
