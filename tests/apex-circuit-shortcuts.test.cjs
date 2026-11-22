const {test,before}=require('node:test');
const assert=require('node:assert/strict');
let tracks,createRace,vehicleSpecs,sampleDriver;
before(async()=>{
  ({tracks}=await import('../games/apex-circuit/track.js'));
  ({createRace,vehicleSpecs}=await import('../games/apex-circuit/race.js'));
  ({sampleDriver}=await import('../games/apex-circuit/bypass.js'));
});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function world(t,p){const f=sampleDriver(t,p,p.distance);return{x:f.x-f.dz*p.lane,y:f.y+f.bank*p.lane+p.air,z:f.z+f.dx*p.lane};}

test('expanded city and offshore tracks have real shorter roads with continuous endpoints',()=>{
  assert.ok(tracks.find(t=>t.id==='metro').length>1100,'city crosses several districts');
  assert.ok(tracks.find(t=>t.id==='windway').length>1000,'offshore route keeps an extended outer loop');
  for(const t of tracks)for(const s of t.shortcuts||[]){
    assert.ok(s.start>0&&s.end>s.start&&s.end<t.length,'branch remains inside one lap');
    assert.ok(s.length>50&&s.ratio>1.05&&s.halfWidth< t.halfWidth/2,'real narrow branch is physically shorter');
    for(const [distance,main]of [[0,s.start],[s.length,s.end]]){
      const p=s.sample(distance),a=t.point(main,s.entryLane,.025);
      assert.ok(Math.hypot(p.x-a.x,p.y-a.y,p.z-a.z)<.2,'branch ends join the corresponding main checkpoint');
    }
    for(let d=0;d<s.length;d+=.5){const p=s.sample(d);assert.ok(Object.values(p).every(Number.isFinite));assert.ok(Math.abs(Math.hypot(p.dx,p.dz)-1)<.0001,'lane frame is normalized');assert.ok(Math.abs(p.curve)*s.halfWidth<.85,'new branch inside shoulder does not fold');}
  }
});

test('normal steering traverses shortcuts continuously and saves time instead of teleporting',()=>{
  const spec=vehicleSpecs.find(s=>s.id==='model-3');
  for(const t of tracks)for(const route of t.shortcuts||[]){
    const times=[];
    for(const take of [false,true]){
      const r=createRace(t,spec),p=r.cars[0];p.distance=route.start-8;p.lane=take?route.entryLane:0;p.speed=38;r.boost=.8;
      r.cars.slice(1).forEach((c,i)=>c.distance=route.start-800-i*30);
      let entered=false,left=false,previous=world(t,p);
      for(let f=0;f<18000&&p.distance<route.end+14;f++){
        const s=sampleDriver(t,p,p.distance),aim=p.shortcut?0:take&&p.distance<route.start?route.entryLane:0;
        const outward=clamp(s.curve*p.speed**2*.185/spec.grip,-11,11);
        const steer=clamp((clamp((aim-p.lane)*4-p.lateralSpeed*.45,-11,11)-outward)/13.8,-1,1);
        const before=p.distance;r.step(1/60,{steer,boost:true});const now=world(t,p);
        assert.ok(p.distance>=before&&Number.isFinite(p.distance),'logical race progress is continuous forward');
        assert.ok(Math.hypot(now.x-previous.x,now.y-previous.y,now.z-previous.z)<3,'no world-space entry/exit teleport');
        if(p.shortcut)entered=true;if(entered&&!p.shortcut)left=true;previous=now;
      }
      assert.ok(p.distance>=route.end+14,'no branch soft lock');
      assert.equal(entered,take);if(take)assert.ok(left,'branch reconnects');times.push(r.time);
    }
    assert.ok(times[1]<times[0]-.25,'shorter physical road produces a measurable time gain');
  }
});

test('missed or airborne entries give no shortcut credit and retry clears branch ownership',()=>{
  const spec=vehicleSpecs[0];
  for(const t of tracks)for(const route of t.shortcuts||[]){
    for(const [lane,airborne]of [[0,false],[route.entryLane,true]]){
      const r=createRace(t,spec),p=r.cars[0];p.distance=route.start-.1;p.speed=38;p.lane=lane;p.airborne=airborne;p.air=airborne?2:0;
      r.step(1/60,{});assert.ok(!p.shortcut,'entry demands correct grounded lane');
    }
    const r=createRace(t,spec),p=r.cars[0];p.distance=route.start-.1;p.speed=38;p.lane=route.entryLane;r.step(1/60,{});
    assert.ok(p.shortcut);r.reset();assert.ok(!p.shortcut&&!p.airborne&&p.distance===-16,'retry discards route state');
  }
});
test('city bypass attaches at road height or clears the main driving volume',()=>{
  const t=tracks.find(t=>t.id==='metro'),s=t.shortcuts[0];
  const main=Array.from({length:Math.ceil(t.length/.5)},(_,i)=>({...t.sample(i*.5),distance:i*.5}));
  for(let d=0;d<s.length;d+=.5){
    const p=s.sample(d);let nearest,dist=Infinity;
    for(const m of main){const ds=Math.hypot(m.x-p.x,m.z-p.z);if(ds<dist){nearest=m;dist=ds;}}
    const lane=(p.x-nearest.x)*-nearest.dz+(p.z-nearest.z)*nearest.dx;
    if(Math.abs(lane)>t.halfWidth+s.halfWidth-.1)continue;
    const height=p.y-nearest.y-nearest.bank*lane;
    assert.ok(Math.abs(height)<.35||height>4.5,'no low branch deck intersects main-road vehicles at '+d.toFixed(1));
  }
});
test('branch cars collide at a shared merge but never with distant main-road traffic',()=>{
  const t=tracks.find(t=>t.id==='metro'),s=t.shortcuts[0],spec=vehicleSpecs[0];
  const shared=createRace(t,spec),p=shared.cars[0];p.distance=s.start+.05*s.ratio;p.shortcut=s;p.shortcutBase=0;p.speed=30;p.lane=0;
  shared.cars.slice(1).forEach((c,i)=>{c.distance=s.start-500-i*20;});
  const rival=shared.cars[1];rival.distance=s.start+.05;rival.lane=s.entryLane;rival.speed=30;
  shared.step(1/60,{});assert.ok(shared.events.includes('bump'),'overlapping cars still make contact at common road height');
  assert.ok(Math.abs(p.lane)<=s.halfWidth-2.35*.47,'contact cannot push the car outside branch bounds');
  const separate=createRace(t,spec),q=separate.cars[0];q.distance=s.start+s.length/2*s.ratio;q.shortcut=s;q.shortcutBase=0;q.speed=30;q.lane=0;
  separate.cars.slice(1).forEach((c,i)=>{c.distance=q.distance-500-i*20;});separate.cars[1].distance=q.distance;separate.cars[1].lane=0;separate.cars[1].speed=30;
  separate.step(1/60,{});assert.ok(!separate.events.includes('bump'),'equal logical progress on physically separated roads is not a collision');
});
