const {test,before}=require('node:test');
const assert=require('node:assert/strict');
let tracks,courseRecordId;
before(async()=>({tracks,courseRecordId}=await import('../games/apex-circuit/track.js')));

test('revised slaloms offer frequent turn changes without folding or crossing the road',()=>{
  for(const id of ['windway','foundry']){
    const t=tracks.find(t=>t.id===id);let span=0,longest=0,changes=0,lastSign=0;
    const points=[];
    for(let d=0;d<t.length*2;d++){
      const p=t.sample(d),curve=Math.abs(p.curve);
      span=curve<.006?span+1:0;longest=Math.max(longest,span);
      assert.ok(curve*t.halfWidth<.85,id+' inside road edge stays unfolded');
      if(d<t.length&&curve>.012){const sign=Math.sign(p.curve);if(lastSign&&sign!==lastSign)changes++;lastSign=sign;}
      if(d<t.length&&d%2===0)points.push({...p,d});
    }
    assert.ok(longest<=(id==='windway'?35:80),id+' no prolonged idle straight');
    assert.ok(changes>=8,id+' at least eight drift-side decisions per lap');
    for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
      const a=points[i],b=points[j],arc=Math.min(b.d-a.d,t.length-b.d+a.d);
      if(arc>45)assert.ok(Math.hypot(a.x-b.x,a.z-b.z)>2*t.halfWidth+4,id+' distant road sections stay separate');
    }
  }
});
test('the revised foundry retains a straight 18m drop and safe high-speed catch',()=>{
  const t=tracks.find(t=>t.id==='foundry'),gap=t.gaps[0];
  assert.ok(Math.abs(t.sample(gap.start).y-t.sample(gap.end).y-18)<.02);
  assert.ok(Math.abs(t.sample(gap.end+16).curve)<.012);
  for(const p of t.pads)assert.ok(!t.gaps.some(g=>p.distance>g.start-10&&p.distance<g.end+10),'charging pads stay on solid road');
});
test('course revisions give new records their own keys and retain the original scoreboards',()=>{
  for(const id of ['windway','foundry']){
    const t=tracks.find(t=>t.id===id);
    assert.equal(courseRecordId(id),id+'-slalom');
    assert.equal(courseRecordId(id+'-slalom'),id+'-slalom');
    assert.deepEqual(t.previousRecords.map(r=>r.id),[id]);
  }
  for(const id of ['sunset','summit','metro','frost','redrock'])assert.equal(courseRecordId(id),id,'unmodified course keeps its record key');
});
