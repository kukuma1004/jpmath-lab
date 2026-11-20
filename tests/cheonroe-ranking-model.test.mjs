import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require=createRequire(new URL('../games/cheonroe/source/package.json',import.meta.url));
let ts;
try{ts=require('typescript');}
catch{ts=createRequire(new URL('../../cheonroe/package.json',import.meta.url))('typescript');}
const source=await readFile(new URL('../games/cheonroe/source/src/ranking-model.ts',import.meta.url),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText;
const modelUrl=`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const {validRun,fromState,compareRecords,validNickname}=await import(modelUrl);
const run={hero:'rin',difficulty:'normal',score:12345,durationMs:10234,kills:25,graze:8,cleared:false};
const state={phase:'gameover',hero:'rin',difficulty:'normal',time:10.2349,score:12345,stats:{kills:25},graze:8};

test('ended run exports exact stats and floored milliseconds',()=>{
  assert.deepEqual(fromState(state),run);
  assert.deepEqual(fromState({...state,phase:'victory'}),{...run,cleared:true});
  assert.deepEqual(fromState({...state,hero:'ryu',difficulty:'story',time:11.501,score:91919,stats:{kills:45},graze:99}),{hero:'ryu',difficulty:'story',score:91919,durationMs:11501,kills:45,graze:99,cleared:false});
});
test('only completed runs of at least 10 seconds with positive score qualify',()=>{
  for(const phase of ['menu','playing','paused'])assert.equal(fromState({...state,phase}),null);
  for(const time of [0,9.9999,NaN,Infinity])assert.equal(fromState({...state,time}),null);
  for(const score of [0,-1,1.5,NaN,Infinity,10000000])assert.equal(fromState({...state,score}),null);
  assert.deepEqual(fromState({...state,time:10}),{...run,durationMs:10000});
});
test('all heroes and difficulty combinations are valid independently',()=>{
  for(const hero of ['rin','golem','ryu'])for(const difficulty of ['story','normal'])assert.equal(validRun({...run,hero,difficulty}),true);
  for(const hero of ['all','rin/ryu','RIN','',null])assert.equal(validRun({...run,hero}),false);
  for(const difficulty of ['easy','NORMAL','',null])assert.equal(validRun({...run,difficulty}),false);
});
test('each numeric boundary is enforced, with no coercion',()=>{
  const ranges={score:[1,9999999],durationMs:[10000,3600000],kills:[0,1000],graze:[0,100000]};
  for(const [field,[min,max]] of Object.entries(ranges)) {
    assert.equal(validRun({...run,[field]:min}),true,`${field} minimum`);
    assert.equal(validRun({...run,[field]:max}),true,`${field} maximum`);
    for(const bad of [min-1,max+1,min+.5,NaN,Infinity,-Infinity,String(min),null,undefined])assert.equal(validRun({...run,[field]:bad}),false,`${field} rejects ${bad}`);
  }
  for(const bad of [0,1,'false',null,undefined])assert.equal(validRun({...run,cleared:bad}),false);
  for(const bad of [null,[],{},true,'record'])assert.equal(validRun(bad),false);
});
test('nickname permits the agreed Korean/Latin symbols and rejects blank or markup',()=>{
  for(const name of ['린','무진 01','철귀_2','Sky.-9','ㄱㅏ','123456789012'])assert.equal(validNickname(name),true,name);
  for(const name of ['', ' ', '            ', '1234567890123','<img>','a/b','😎','漢字','line\nbreak','tab\tname'])assert.equal(validNickname(name),false,name);
});
test('records sort by score then earliest timestamp then uid',()=>{
  const publicRun=(score,submittedAt,uid)=>({...run,score,submittedAt,uid,nickname:'전사'});
  const rows=[publicRun(100,200,'b'),publicRun(200,500,'c'),publicRun(100,100,'z'),publicRun(100,200,'a')];
  assert.deepEqual(rows.sort(compareRecords).map(row=>row.uid),['c','z','a','b']);
  assert.equal(compareRecords(rows[0],rows[0]),0);
});
test('rules fragment isolates Cheonroe, validates schema, owner and bounded score queries',async()=>{
  const rules=JSON.parse(await readFile(new URL('../games/cheonroe/server/ranking.rules.fragment.json',import.meta.url),'utf8'));
  assert.deepEqual(Object.keys(rules),['cheonroeV1']);
  const hero=rules.cheonroeV1.$season.$difficulty.$hero,owner=hero.$uid;
  assert.deepEqual(hero['.indexOn'],['score']);
  for(const phrase of ["$season == 'season-20261120-1'","query.orderByChild == 'score'","query.limitToLast >= 1","query.limitToLast <= 100"])assert(hero['.read'].includes(phrase));
  for(const phrase of ['$uid == auth.uid','!newData.exists()','now - data.child(\'submittedAt\').val() >= 10000'])assert(owner['.write'].includes(phrase));
  assert(owner.submittedAt['.validate'].includes('newData.val() == now'));
  assert.equal(owner.$other['.validate'],false);
  assert.deepEqual(Object.keys(owner).filter(key=>!key.startsWith('.')&&key!=='$other').sort(),['nickname','hero','difficulty','score','durationMs','kills','graze','cleared','submittedAt'].sort());
});
test('public load uses only scoped score queries, filters malformed records and sorts all heroes',async()=>{
  const apiSource=await readFile(new URL('../games/cheonroe/source/src/ranking-api.ts',import.meta.url),'utf8');
  const apiCode=ts.transpileModule(apiSource,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText.replace("from './ranking-model'",`from '${modelUrl}'`);
  const {loadOnline}=await import(`data:text/javascript;base64,${Buffer.from(apiCode).toString('base64')}`);
  const previousFetch=globalThis.fetch,requested=[];
  try {
    globalThis.fetch=async url=>{
      const target=new URL(url);requested.push(target);
      const hero=target.pathname.split('/').at(-1).replace('.json','');
      return new Response(JSON.stringify({
        [`uid_${hero}`]:{...run,hero,score:hero==='golem'?90000:10000,nickname:'전사',submittedAt:1000},
        wrongScope:{...run,hero,difficulty:'story',nickname:'전사',submittedAt:1000},
        markup:{...run,hero,nickname:'<script>',submittedAt:1000},
        fractional:{...run,hero,score:1.2,nickname:'전사',submittedAt:1000},
        extra:{...run,hero,nickname:'전사',submittedAt:1000,secret:'unexpected'}
      }),{status:200});
    };
    const rows=await loadOnline('normal','all');
    assert.equal(requested.length,3);
    assert.deepEqual(rows.map(row=>row.uid),['uid_golem','uid_rin','uid_ryu']);
    for(const target of requested) {
      assert(target.pathname.startsWith('/cheonroeV1/season-20261120-1/normal/'));
      assert.equal(target.searchParams.get('orderBy'),'"score"');
      assert.equal(target.searchParams.get('limitToLast'),'100');
      assert.equal(target.searchParams.has('auth'),false);
    }
    await assert.rejects(()=>loadOnline('other','rin'),/분류/);
    assert.equal(requested.length,3);
    globalThis.fetch=async()=>new Response('{"error":"Permission denied"}',{status:403});
    await assert.rejects(()=>loadOnline('normal','rin'),/온라인 랭킹을 사용할 수 없어요/);
  }finally{globalThis.fetch=previousFetch;}
});
