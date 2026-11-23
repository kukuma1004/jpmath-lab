import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {build}=createRequire(path.join(root,'games/cheonroe/source/package.json'))('esbuild');
const out=path.join(root,'.dream-loop/cheonroe-melee');await mkdir(out,{recursive:true});
await build({entryPoints:[path.join(root,'games/cheonroe/source/src/engine.ts')],bundle:true,format:'esm',platform:'node',outfile:path.join(out,'engine.mjs'),logLevel:'error'});
const {Engine}=await import(pathToFileURL(path.join(out,'engine.mjs')));
const idle={x:0,y:0,focus:false,charge:false,ultimate:false,dash:false};
const heroes=['rin','golem','ryu','hanui','arang'];
function fixture(hero='rin',difficulty='normal',rank=1){
 const e=new Engine(42);e.start(hero,difficulty);e.waveIndex=e.stageDef.waves.length;
 const p=e.state.player;p.invulnerable=0;p.awakening=rank;
 const target=e.ctx.enemy('brute',p.x+115,p.y,{type:'line',speed:0},{hp:1e7,fire:{type:'none'}});
 e.state.events=[];return {e,p,target};
}
for(const hero of heroes)test(`${hero} automatic melee deals damage without deleting bullets or farming gold`,()=>{
 for(const difficulty of ['normal','story'])for(const rank of [1,8]){
  const {e,p,target}=fixture(hero,difficulty,rank),bullet=e.ctx.bullet(p.x+40,p.y,Math.PI,0,{r:6});
  const hp=target.hp;e.step(1/120,idle);
  assert(e.state.events.some(ev=>ev.kind==='near'),'must actually swing');assert(target.hp<hp,'close damage must remain');
  assert(e.state.bullets.some(b=>b.id===bullet.id),'swing must not cancel a nearby bullet');
  assert.equal(e.state.stats.cancels,0);assert.equal(e.state.pickups.filter(p=>p.kind==='gold').length,0);
  assert.equal(p.invulnerable,0);assert.equal(p.dashIframes,0);
 }
});
const metrics=[];
test('standing beside a durable enemy under aimed fire is unsafe for every hero, mode and awakening',()=>{
 for(const hero of heroes)for(const difficulty of ['normal','story'])for(const rank of [1,8]){
  const {e,p,target}=fixture(hero,difficulty,rank);let swings=0;
  for(let tick=0;tick<240;tick++){
   if(tick%18===0)e.ctx.bullet(p.x+100,p.y,Math.PI,190,{r:6});
   e.step(1/120,idle);swings+=e.state.events.splice(0).filter(ev=>ev.kind==='near').length;
  }
  const row={hero,difficulty,rank,swings,hits:e.state.stats.damageTaken,damage:Math.round(target.maxHp-target.hp)};metrics.push(row);
  assert(swings>=3,'fixture must sustain close attacks');assert(row.damage>0);
 }
 assert(metrics.every(row=>row.hits>0),'no hero/mode/awakening may camp safely');
});
test('melee still awards its close-kill score bonus',()=>{
 const near=fixture(),far=fixture();near.target.hp=1;near.e.step(1/120,idle);
 far.target.hp=1;far.e.damageEnemy(far.target,20,false,far.target.x,far.target.y);
 assert.equal(near.e.state.stats.nearKills,1);assert.equal(near.e.state.stats.kills,1);
 assert.equal(near.e.state.score,far.e.state.score*1.5);
});
test('enemy contact and active beams remain dangerous while swinging',()=>{
 const contact=fixture();contact.target.x=contact.p.x;contact.e.step(1/120,idle);assert.equal(contact.e.state.stats.damageTaken,1);
 const beam=fixture();beam.e.ctx.laser(0,beam.p.y,0,{length:1200,width:20,warn:0,life:2});beam.e.step(1/120,idle);
 assert(beam.e.state.events.some(ev=>ev.kind==='near'));assert.equal(beam.e.state.stats.damageTaken,1);assert.equal(beam.e.state.lasers.length,1);
});
test('limited ultimate defense and dash invulnerability still work',()=>{
 for(const hero of heroes){
  const ult=fixture(hero);ult.p.gauge=100;ult.e.ctx.bullet(ult.p.x+40,ult.p.y,Math.PI,0);ult.e.step(1/120,{...idle,ultimate:true});
  assert.equal(ult.e.state.stats.ultimates,1);assert.equal(ult.p.gauge,0);assert.equal(ult.e.state.bullets.length,0);assert(ult.p.invulnerable>0);
  const dash=fixture(hero);dash.e.ctx.bullet(dash.p.x,dash.p.y,0,0);dash.e.step(1/120,{...idle,x:-1,dash:true});assert(dash.p.dashIframes>0);assert.equal(dash.e.state.stats.damageTaken,0);
 }
});
after(async()=>{await writeFile(path.join(out,'camping-metrics.json'),JSON.stringify({durationSeconds:2,bulletEveryTicks:18,timestep:1/120,metrics},null,2));});
