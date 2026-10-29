const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const html=fs.readFileSync(path.join(__dirname,'../games/bench-to-hall/index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const box={window:{},Date,Math,console};
vm.createContext(box);
vm.runInContext(script.split('// ---------- Persistence and screens ----------')[0]+script.slice(script.indexOf('const finite='),script.indexOf('function load()'))+'window.validate=validate;})();',box);
const E=box.window.BenchEngine;
const copy=x=>JSON.parse(JSON.stringify(x));

function completedCareer(){
 let p=E.createPlayer({name:'가상계약회귀',avatar:0,type:'batter',hand:'우투우타',nation:'대한민국',school:'검수고',styles:E.DATA.positions.batter.styles,style:0,focus:[0,1]});
 p.rng=913741;
 for(let year=0;year<11;year++){p=E.makeSeason(p).player;if(year<10)p=E.nextSeason(p,'KBO').player}
 return p;
}

test('noisy numbers are formatted without changing their source values',()=>{
 const raw=[28.700000000000003,15.600000000000001,31.700000000000003];
 const saved=raw.slice();
 assert.deepEqual(raw.map(E.displayNumber),['28.7','15.6','31.7']);
 assert.deepEqual(raw,saved);
 assert.equal(E.displayNumber(-.01),'0');
 assert.equal(E.displayRate(.301,'average'),'0.301');
 assert.equal(E.displayRate(3.145,'pitching'),'3.15');
});

test('one stored salary has an exact currency display',()=>{
 assert.equal(E.money(40700),'4억 700만');
 assert.equal(E.money(38100),'3억 8,100만');
 assert.equal(E.money(40700.25),'4억 700만 2,500');
});

for(const fa of [false,true])for(const source of ['club','requested']){
 test((fa?'FA':'ordinary renewal')+' retains '+source+' attribution and exact salary',()=>{
  const p=completedCareer();
  if(!fa)p.market.faLast=E.registeredSeasons(p);
  p.market.contract.endSeason=p.season;
  const m=E.buildMarket(p);m.baseOffer=38100;
  assert.equal(m.faEligible,fa);
  const rng=p.rng;
  assert.equal(source==='club'?E.acceptClubSalary(p,m):E.settleSalary(p,m,38100),true);
  if(source==='club')assert.equal(p.rng,rng);
  assert.equal(m.salaryAgreement,source);
  const next=E.nextSeason(p,'KBO',m).player,row=next.market.log.at(-1);
  assert.equal(next.salary,38100);
  assert.equal(next.market.contract.salary,38100);
  assert.equal(next.market.contract.agreement,source);
  assert.equal(row.agreement,source);
  assert.ok(row.text.includes(E.DATA.contractAgreements[source]));
  assert.equal(row.contract.salary,38100);
  assert.notEqual(row.contract,next.market.contract);
  const s={version:5,phase:'home',player:next,pending:null,hall:[],setup:null,offseason:null,roster:[],activeSlot:next.id};
  const restored=box.window.validate(E.packSave(copy(s)));
  assert.equal(restored.player.market.log.at(-1).agreement,source);
  assert.equal(restored.player.salary,38100);
 });
}

test('old pending agreements are identified only from clear saved evidence',()=>{
 assert.equal(E.salaryAgreementOf({salaryStatus:'accepted',salaryMessage:'구단 제시 연봉 3.8억원으로 잔류 합의.'}),'club');
 assert.equal(E.salaryAgreementOf({salaryStatus:'accepted',salaryMessage:'희망 연봉 3.8억원 승인.'}),'requested');
 assert.equal(E.salaryAgreementOf({salaryStatus:'accepted',salaryMessage:''}),'unknown');
});
