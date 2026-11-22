import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),require=createRequire(path.join(root,'games/cheonroe/source/package.json'));
const {build}=require('esbuild'),out=path.join(root,'.dream-loop/cheonroe-growth');await mkdir(out,{recursive:true});
await build({entryPoints:[path.join(root,'games/cheonroe/source/src/engine.ts')],bundle:true,format:'esm',platform:'node',outfile:path.join(out,'engine.mjs'),logLevel:'error'});
await build({entryPoints:[path.join(root,'games/cheonroe/source/src/progression.ts')],bundle:true,format:'esm',platform:'node',outfile:path.join(out,'progression.mjs'),logLevel:'error'});
await build({entryPoints:[path.join(root,'games/cheonroe/source/src/stages.ts')],bundle:true,format:'esm',platform:'node',outfile:path.join(out,'stages.mjs'),logLevel:'error'});
const {Engine,HEIGHT}=await import(pathToFileURL(path.join(out,'engine.mjs'))),{getAwakening,supportPositions}=await import(pathToFileURL(path.join(out,'progression.mjs'))),{STAGES,STAGE_TACTICS}=await import(pathToFileURL(path.join(out,'stages.mjs')));
const heroes=['rin','golem','ryu','hanui','arang'],idle={x:0,y:0,focus:false,charge:false,ultimate:false,dash:false};
const step=(e,sec,intent=idle)=>{for(let t=0;t<sec;t+=1/120){e.step(1/120,intent);e.state.events.splice(0);}};

test('run awakening unlocks distinct support sockets and charge speed across eight tiers',()=>{
 for(const hero of heroes){let damage=0;for(let r=1;r<=8;r++){
  const a=getAwakening(hero,r);assert.equal(a.rank,r);assert(a.damageMultiplier>damage);damage=a.damageMultiplier;assert.equal(supportPositions(hero,r).length,a.supportCount);assert.equal(new Set(supportPositions(hero,r).map(o=>`${o.x}:${o.y}`)).size,a.supportCount);assert(a.chargeName.length>0);assert(a.nextUnlock.length>0);
 }assert.equal(getAwakening(hero,1).supportCount,0);assert.equal(getAwakening(hero,8).supportCount,4);assert.equal(getAwakening(hero,3).signatureEvery,0);assert(getAwakening(hero,4).signatureEvery>0);assert.equal(getAwakening(hero,8).damageMultiplier,2.12);}
});
test('normal run always starts at1; practice receives the expected stage rank',()=>{
 const e=new Engine();for(const hero of heroes){e.start(hero,'normal',7);assert.equal(e.state.stage,0);assert.equal(e.state.player.awakening,1);for(let i=0;i<8;i++){e.start(hero,'story',i);assert.equal(e.state.player.awakening,i+1);}}
});
test('real boss defeat awards permanent awakening and carries it through transition; retry resets',()=>{
 const e=new Engine();e.start('rin','normal');for(let stage=0;stage<8;stage++){
  assert.equal(e.state.stage,stage);assert.equal(e.state.player.awakening,stage+1);
  e.spawnBoss();const b=e.state.enemies.find(v=>v.boss);b.phase=e.stageDef.boss.phases.length-1;b.shield=0;b.hp=1;e.damageEnemy(b,20,false,b.x,b.y);
  assert(e.state.clearTimer>0);let awakened=0;for(let t=0;t<8.2;t+=1/120){e.state.player.invulnerable=3;e.step(1/120,idle);awakened+=e.state.events.splice(0).filter(ev=>ev.kind==='awaken').length;}
  assert.equal(e.state.stats.stagesCleared,stage+1);assert.equal(awakened,stage<7?1:0);
 }assert.equal(e.state.phase,'victory');assert.equal(e.state.player.awakening,8);e.start('rin','normal');assert.equal(e.state.player.awakening,1);assert.equal(e.state.score,0);
});
test('damage lowers only temporary weapon power; pause leaves rank and timers unchanged',()=>{
 const e=new Engine();e.start('arang','story',5);e.state.player.power=4;e.state.player.invulnerable=0;e.hurt();assert.equal(e.state.player.power,3);assert.equal(e.state.player.awakening,6);e.state.events.splice(0);e.pause(true);const before=structuredClone(e.state);step(e,2);assert.deepEqual(e.state,before);e.pause(false);step(e,.6);assert.equal(e.state.player.awakening,6);
});
const metrics=[];
function dps(hero,rank){const e=new Engine(42);e.start(hero,'normal');const p=e.state.player;p.power=4;p.awakening=rank;p.invulnerable=999;const target=e.ctx.enemy('brute',670,HEIGHT/2,{type:'line',speed:0},{hp:1e7,fire:{type:'none'}});const hp=target.hp;let hits=0,peak=0;
 for(let t=0;t<14;t+=1/120){e.updatePlayer(1/120,1/120,{...idle,focus:true});e.updateShots(1/120);e.flushClears();for(const ev of e.state.events.splice(0))if(ev.kind==='hit')hits++;peak=Math.max(peak,e.state.shots.length);}
 return {damage:Math.round(hp-target.hp),hits,peak};}
for(const hero of heroes)test(`${hero} gains actual equal-power damage and new signature contacts`,()=>{
 const first=dps(hero,1),middle=dps(hero,4),last=dps(hero,8);assert(first.damage>0);assert(middle.damage>first.damage*1.4);assert(last.damage>first.damage*2);assert(last.peak<500);
 metrics.push({hero,rank1:first,rank4:middle,rank8:last,damageRatio:+(last.damage/first.damage).toFixed(2)});
});
test('signature effects give different useful contact behavior across all five heroes',()=>{
 for(const hero of heroes){const e=new Engine();e.start(hero,'normal');e.state.player.awakening=4;const target=e.ctx.enemy('brute',600,360,{type:'line',speed:0},{hp:1e5});e.signatureAttack();assert(e.state.shots.length>0);assert(e.shotEffects.size>0);const effects=[...e.shotEffects.values()];
  if(hero==='hanui')assert(e.state.shots.every(s=>Math.abs(s.vx)<1&&s.vy>0));if(hero==='arang')assert(effects.every(s=>s.cancel>0));if(hero==='golem')assert(e.state.shots.some(s=>s.pierce));if(hero==='ryu')assert(effects.some(s=>s.splash>=140));if(hero==='rin')assert(e.state.shots.every(s=>s.kind==='homing'));
  for(let t=0;t<2.5;t+=1/120){e.updateShots(1/120);e.flushClears();}assert(target.hp<target.maxHp,`${hero} signature must actually hit`);
 }
});
test('owned bullets and active lasers stop when the firing source is defeated',()=>{
 const e=new Engine();e.start('rin','normal');const src=e.ctx.enemy('turret',900,180,{type:'line',speed:0},{hp:100});const other=e.ctx.enemy('drone',1000,600,{type:'line',speed:0},{hp:100});
 e.ctx.bullet(800,180,Math.PI,100,{owner:src});e.ctx.bullet(800,600,Math.PI,100,{owner:other});e.ctx.laser(880,180,Math.PI,{owner:src,warn:1.25,life:1});e.updateLasers(1.4);assert.equal(e.state.lasers.length,1);src.hp=0;e.state.enemies=e.state.enemies.filter(v=>v!==src);e.updateBullets(.01);e.updateLasers(.01);assert.equal(e.state.lasers.length,0);assert.equal(e.state.bullets.length,1);assert.equal(e.state.bullets[0].owner,other.id);
});
test('charge progression changes projectile patterns or contact effects for every hero',()=>{
 for(const hero of heroes){const pattern=rank=>{const e=new Engine();e.start(hero,'normal');e.state.player.awakening=rank;e.state.player.charge=1.2;e.chargeShot();return {shots:e.state.shots.map(s=>({kind:s.kind,r:s.r,x:Math.round(s.x),y:Math.round(s.y),pierce:s.pierce})),effects:[...e.shotEffects.values()]};};assert.notDeepEqual(pattern(1),pattern(8),`${hero} needs a real charge evolution`);}
});
test('all eight stages have their own opening, goals and paced boss schedule',()=>{
 assert.equal(STAGES.length,8);assert.equal(new Set(STAGE_TACTICS.map(t=>t.objective)).size,8);const signatures=[];
 for(let stage=0;stage<8;stage++){
  const e=new Engine(42);e.start('rin','story',stage);const observations=[];for(let t=0;t<12;t+=1/30){e.state.player.invulnerable=999;e.state.player.shotTimer=999;e.step(1/30,{...idle,charge:true});for(const v of e.state.events.splice(0))if(v.kind==='encounter')observations.push(v.text);}
  const enemies=e.state.enemies.map(v=>`${v.kind}:${v.path.type}:${v.mid}:${Math.round(v.path.sy||0)}`).sort();signatures.push(JSON.stringify([enemies,e.state.lasers.length,e.state.bullets.map(b=>b.style).slice(0,5)]));assert(observations.length>0);assert(STAGES[stage].waves.every((w,i,all)=>w.t<STAGES[stage].bossAt&&(!i||w.t>=all[i-1].t)));assert(STAGES[stage].bossAt>=90&&STAGES[stage].bossAt<=112);
 }assert.equal(new Set(signatures).size,8);
});
test('entire authored encounter scripts are bounded and telegraph hazards across eight stages',()=>{
 for(let stage=0;stage<8;stage++){
  const e=new Engine(42);e.start('golem','story',stage);let maxBullets=0,maxLasers=0,announcements=0,sources=0;
  for(let t=0;t<(STAGES[stage].bossAt-.5)/.66;t+=1/30){e.state.player.invulnerable=999;e.state.player.shotTimer=999;e.step(1/30,{...idle,charge:true});maxBullets=Math.max(maxBullets,e.state.bullets.length);maxLasers=Math.max(maxLasers,e.state.lasers.length);sources=Math.max(sources,e.state.enemies.filter(v=>v.mid).length);for(const l of e.state.lasers)assert(l.warn>=1.25);for(const v of e.state.events.splice(0))if(v.kind==='encounter')announcements++;}
  assert(maxBullets<500,`${stage} bounded bullets ${maxBullets}`);assert(maxLasers<24);assert(announcements>=4);assert(sources>0);
 }
});
test('long maximum-rank simulation bounds projectiles/effect metadata and remains deterministic',async()=>{
 for(const hero of heroes){const run=()=>{const e=new Engine(21);e.start(hero,'story',7);e.state.player.power=4;for(let t=0;t<70;t+=1/60){e.state.player.invulnerable=99;e.step(1/60,idle);e.state.events.splice(0);assert(e.state.shots.length<=500);assert(e.shotEffects.size<=e.state.shots.length);}return e.state;};assert.deepEqual(run(),run());}
 await writeFile(path.join(out,'simulation-metrics.json'),JSON.stringify({metrics},null,2));
});
