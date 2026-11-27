import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { availableParallelism } from 'node:os';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from 'vite';

const maps = ['quarry', 'windrift', 'bridge', 'sanseong', 'baekdu', 'forest', 'cloud', 'underworld'];
const startsPerMap = 5;
const turnLimit = 0;
const maxSteps = 60 * 60 * 45;
const difficulty = 'easy';

if (isMainThread) {
  const out = resolve(process.argv[2] ?? '.balance-results');
  mkdirSync(out, {recursive:true});
  const {output} = await build({
    configFile:false, logLevel:'error',
    build:{ssr:true,write:false,rollupOptions:{input:resolve('scripts/balance-battle.ts')}},
  });
  const engine = output.find(chunk=>chunk.type==='chunk').code;
  const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(engine).toString('base64');
  const {characters} = await import(moduleUrl);
  const ids = characters.map(character=>character.id);
  const jobs = [];
  for (const [mapIndex,map] of maps.entries()) {
    for (let round=0;round<startsPerMap;round++) {
      const offset=1+(round+mapIndex*5)%Math.floor(ids.length/2);
      for (const [i,a] of ids.entries()) {
        const b=ids[(i+offset)%ids.length];
        const seed=43019+mapIndex*104729+round*13399+i*797;
        jobs.push({map,seed,chars:[a,b]});
      }
    }
  }
  let next = 0;
  const results=[];
  const count = Math.min(8, Math.max(1, availableParallelism() - 2));
  const mapCount=new Map();
  await Promise.all(Array.from({length:count},()=>new Promise((done,fail)=>{
    const worker=new Worker(new URL(import.meta.url),{workerData:{moduleUrl}});
    function send() {
      worker.postMessage(jobs[next++]??null);
    }
    worker.on('error',fail);
    worker.on('exit',code=>code===0?done():fail(Error('Balance worker exited with status '+code)));
    worker.on('message',game=>{
      results.push(game);
      const map=game.map;
      const n=(mapCount.get(map)??0)+1;
      mapCount.set(map,n);
      if(n%15===0)console.log(map,n+'/75');
      send();
    });
    send();
  })));
  if(results.length!==maps.length*ids.length*startsPerMap)throw Error('Incomplete match results');
  results.sort((a,b)=>maps.indexOf(a.map)-maps.indexOf(b.map)||a.seed-b.seed||a.chars[0].localeCompare(b.chars[0]));
  const rated=results.filter(game=>game.winner!==null);
  const standings=characters.map(({id,name})=>{
    const many=games=>{
      const rows=games.filter(game=>game.chars.includes(id));
      return {
        games:rows.length,
        wins:rows.filter(game=>game.winner===game.chars.indexOf(id)).length,
        losses:rows.filter(game=>game.winner!==null&&game.winner>=0&&game.winner!==game.chars.indexOf(id)).length,
        draws:rows.filter(game=>game.winner===-1).length,
        unfinished:rows.filter(game=>game.winner===null).length,
        first:rows.filter(game=>game.first===game.chars.indexOf(id)).length,
        damage:rows.reduce((n,g)=>n+g.stats[g.chars.indexOf(id)].damageDealt,0),
        shots:rows.reduce((n,g)=>n+g.stats[g.chars.indexOf(id)].shots,0),
      };
    };
    return {id,name,...many(results),byMap:Object.fromEntries(maps.map(map=>[map,many(results.filter(g=>g.map===map))]))};
  });
  for(const player of standings)for(const [map,row] of Object.entries(player.byMap)){
    if(row.games!==10 || row.first!==5)throw Error(`${player.name} / ${map} ${row.games} games, ${row.first} openings`);
  }
  const summary={
    difficulty,turnLimit,total:results.length,completed:rated.length,
    byMap:Object.fromEntries(maps.map(map=>{
      const games=results.filter(g=>g.map===map);
      return [map,{firstWins:games.filter(g=>g.winner===g.first).length,turns:games.reduce((n,g)=>n+g.turns,0)/games.length,
        outcomes:games.reduce((r,g)=>(r[g.reason]=(r[g.reason]??0)+1,r),{})}];
    })),
    standings:standings.sort((a,b)=>b.wins-a.wins),results,
  };
  writeFileSync(resolve(out,'balance.json'),JSON.stringify(summary,null,2)+'\n');
  const csv=[
    ['character','map','games','wins','losses','draws','unfinished','first','damage','shots'],
    ...summary.standings.flatMap(row=>Object.entries(row.byMap).map(([map,r])=>
      [row.name,map,r.games,r.wins,r.losses,r.draws,r.unfinished,r.first,r.damage,r.shots])),
  ].map(row=>row.join(',')).join('\n');
  writeFileSync(resolve(out,'balance.csv'),'\uFEFF'+csv+'\n');
  console.log(JSON.stringify({total:summary.total,completed:summary.completed,out}));
} else {
  const {play} = await import(workerData.moduleUrl);
  parentPort.on('message',job=>{
    if(!job){parentPort.close();return;}
    const {map,seed,chars}=job;
    parentPort.postMessage(play(map,seed,chars,difficulty,turnLimit,maxSteps));
  });
}
