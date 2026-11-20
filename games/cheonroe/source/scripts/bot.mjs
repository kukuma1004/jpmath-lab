// Headless playtest: a dodging bot with a reaction delay plays every chapter.
// Usage: node scripts/bot.mjs [hero|all] [normal|story] [--god]
import {build} from 'esbuild';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=await mkdtemp(path.join(tmpdir(),'cheonroe-bot-'));
const out=path.join(dir,'engine.mjs');
await build({entryPoints:[path.join(root,'src/engine.ts')],bundle:true,format:'esm',platform:'node',outfile:out,logLevel:'error'});
const {Engine,hitCircles,HEIGHT}=await import(pathToFileURL(out).href);
await rm(dir,{recursive:true,force:true});

const args=process.argv.slice(2),god=args.includes('--god');
const heroArg=args.find(a=>['rin','golem','ryu','hanui','arang','all'].includes(a))||'all';
const diff=args.find(a=>['normal','story'].includes(a))||'normal';
const heroes=heroArg==='all'?['rin','golem','ryu','hanui','arang']:[heroArg];
const DT=1/120,REACT=Number((args.find(a=>a.startsWith('--react='))||'--react=.06').slice(8));

function danger(s,x,y,t) {
  let d=0;
  for(const b of s.bullets){
    const bx=b.x+Math.cos(b.a)*b.v*t,by=b.y+Math.sin(b.a)*b.v*t+b.gy*t;
    const dd=(bx-x)**2+(by-y)**2,lim=(b.r+4+7)**2;
    if(dd<lim)d+=1000;else d+=60/(dd/100+1);
  }
  for(const l of s.lasers){
    const ex=l.x+Math.cos(l.angle)*l.length,ey=l.y+Math.sin(l.angle)*l.length,sx=ex-l.x,sy=ey-l.y,len=sx*sx+sy*sy;
    const u=Math.max(0,Math.min(1,((x-l.x)*sx+(y-l.y)*sy)/len)),dd=(l.x+u*sx-x)**2+(l.y+u*sy-y)**2;
    if(dd<(l.width*.3+18)**2)d+=l.age>l.warn-.35?1500:300;
  }
  for(const e of s.enemies)for(const [cx,cy,r] of hitCircles(e)){const dd=(cx-x)**2+(cy-y)**2;if(dd<(r+30)**2)d+=800;}
  return d;
}
function plan(s) {
  const p=s.player,target=s.enemies.find(e=>e.boss)||s.enemies.filter(e=>e.x<s.worldW-40).sort((a,b)=>a.x-b.x)[0];
  let best={x:0,y:0,focus:false,score:Infinity};
  for(const focus of [false,true])for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){
    const sp=(focus?.42:1)*400,l=Math.hypot(i,j)||1,nx=p.x+i/l*sp*.12,ny=p.y+j/l*sp*.12;
    if(nx<45||nx>s.worldW-95||ny<40||ny>HEIGHT-40)continue;
    let sc=danger(s,nx,ny,.12)+danger(s,nx,ny,.06)*.5;
    sc+=Math.abs(nx-260)*.02;if(target)sc+=Math.abs(ny-target.y)*.03;else sc+=Math.abs(ny-HEIGHT/2)*.01;
    if(sc<best.score)best={x:i,y:j,focus,score:sc};
  }
  return best;
}
function run(hero) {
  const e=new Engine(20261120);e.setWorld(1280);e.start(hero,diff,0);
  const s=()=>e.state;let decide=0,intent={x:0,y:0,focus:false,charge:false,ultimate:false,dash:false},last='';
  const report=[],hurtBy={};let stageStart=0,bossSpawn=null,hitsAt=0,grazeAt=0,bulletSum=0,bulletN=0,attacks=new Set();
  for(let i=0;i<120*60*45&&s().phase==='playing';i++){
    if(!s().bossActive&&!s().clearTimer&&!s().transition&&i%12===0){bulletSum+=s().bullets.length;bulletN++;}
    if(god)s().player.invulnerable=1;
    decide-=DT;
    if(decide<=0){decide+=REACT;const b=plan(s());const here=danger(s(),s().player.x,s().player.y,.05);
      intent={x:b.x,y:b.y,focus:b.focus,charge:false,ultimate:!god&&here>900&&s().player.gauge>=100,dash:!god&&here>900&&s().player.dashCharges>0&&!intent.dash};}
    e.step(DT,intent);
    for(const ev of s().events.splice(0)){
      if(ev.kind==='boss'){bossSpawn=s().time;attacks=new Set([s().attackName]);}
      if(ev.kind==='attack'||ev.kind==='phase')attacks.add(ev.text);
      if(ev.kind==='hurt'){const k=s().bossActive?s().attackName:`${s().stage+1}마당 도중 ${Math.round(s().stageTime)}s`;hurtBy[k]=(hurtBy[k]||0)+1;}
      if(ev.kind==='stageclear'){const t=s().time-stageStart;report.push({stage:s().stage+1,toBoss:+((bossSpawn??s().time)-stageStart).toFixed(0),boss:bossSpawn?+(s().time-bossSpawn-3.4).toFixed(0):null,attacks:attacks.size,hits:s().stats.damageTaken-hitsAt,bullets:+(bulletSum/Math.max(1,bulletN)).toFixed(0),grazePerMin:+((s().graze-grazeAt)/t*60).toFixed(0)});}
      if(ev.kind==='stage'){stageStart=s().time;bossSpawn=null;hitsAt=s().stats.damageTaken;grazeAt=s().graze;bulletSum=0;bulletN=0;}
    }
  }
  const st=s();
  return {hero,diff,phase:st.phase,stageReached:st.stage+1,score:st.score,time:+st.time.toFixed(0),kills:st.stats.kills,graze:st.graze,hits:st.stats.damageTaken,perfects:st.stats.perfects,ults:st.stats.ultimates,stages:report,hurtBy,
    boss:st.bossActive?{name:st.bossName,hp:Math.round((st.enemies.find(x=>x.boss)?.hp||0)),attack:st.attackName}:null};
}
for(const h of heroes)console.log(JSON.stringify(run(h)));
