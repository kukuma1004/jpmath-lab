const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.join(__dirname,'../games/bench-to-hall'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1],copy=v=>JSON.parse(JSON.stringify(v));
function load(rolls=[0]){let at=0;const box={window:{},Date,Math,console,crypto:{getRandomValues(a){a[0]=Math.floor(rolls[at++%rolls.length]*4294967296);return a}}};vm.createContext(box);vm.runInContext(script.split('// ---------- Persistence and screens ----------')[0]+script.slice(script.indexOf('const finite='),script.indexOf('function load()'))+'window.validate=validate;})();',box);return {E:box.window.BenchEngine,V:box.window.validate,draws:()=>at}}
function player(E,avatar=0){const p=E.createPlayer({name:'가상의상검수',avatar,type:'batter',hand:'우투우타',nation:'대한민국',school:'가상검수고',styles:E.DATA.positions.batter.styles,style:0,focus:[0,1]});Object.assign(p,{age:27,season:12,league:'KBO',team:E.DATA.teams.KBO[0],bank:3000000,rng:31791});p.health.injury=null;p.health.rehabSeason=0;return p}
const state=p=>({version:5,phase:'home',player:p,pending:null,hall:[],setup:null,offseason:null,roster:[],activeSlot:'slot-'+p.id});

test('all new outfit art resolves to the selected adult identity and survives an actual save',()=>{
 const {E}=load(),scenes=['coastal-dress','track-day','swim-break','harbor-style','garden-dinner','tennis-day'];
 for(const avatar of E.DATA.careWomen)for(const scene of scenes){const pool=copy(E.carePool(avatar,'custom',2)),index=pool.indexOf(scene);assert(index>=0);const {E:A,V,draws}=load([0,(index+.5)/pool.length]),p=player(A,avatar);assert(A.buyItem(p,'custom'));const row=p.shop.purchases.at(-1);assert.equal(row.moment.scene,scene);assert.equal(p.rng,31791);const art=A.careArtInfo(p,row);assert.equal(art.file,`assets/care/avatar-${avatar}-moments-fashion-v1.webp`);assert.equal(art.column,scenes.indexOf(scene)%3);assert.equal(art.row,Math.floor(scenes.indexOf(scene)/3));assert(fs.existsSync(path.join(root,art.file)));const saved=A.unpackSave(A.packSave(state(p)));assert(V(saved));const n=draws();assert.deepEqual(copy(A.careMoments(saved.player)),copy(A.careMoments(p)));A.careArtInfo(saved.player,row);assert.equal(draws(),n)}
 for(const avatar of [0,2,4,7,8,10,12,13,15,18,20])assert.equal(E.careSceneCount(avatar),6);
 const p=player(E,22);p.age=20;p.season=5;assert.equal(E.planCareMoment(p,'camp').scene,'routine');p.age=27;p.season=12;p.health.rehabSeason=12;assert.equal(E.planCareMoment(p,'camp').scene,'lounge');
});

test('all thirty fictional adults unlock story outfits by shared history without changing fees, stats or RNG',()=>{
 const {E,V}=load();
 for(const club of E.DATA.clubLife)for(const m of club.members){const p=player(E),stats=copy(p.stats),rng=p.rng;assert.equal(E.clubArtInfo(p,m.id,'summer'),null);assert.equal(E.clubArtInfo(p,m.id,'celebration'),null);
  for(let visit=0;visit<4;visit++){const bank=p.bank;assert(E.meetClubCharacter(p,m.id,m.favorite));assert.equal(p.bank,bank-E.DATA.clubActivities[m.favorite].price);assert.deepEqual(copy(p.stats),stats);assert.equal(p.rng,rng);const row=p.clubLife.history.at(-1);assert.equal(row.look,[undefined,undefined,'summer','celebration'][visit]);if(row.look){const art=E.clubArtInfo(p,m.id,row.look);assert.equal(art.file,`assets/club-life/club-${club.id}-stories-v1.webp`);assert.equal(art.column,club.members.indexOf(m));assert.equal(art.row,visit-2);assert(fs.existsSync(path.join(root,art.file)))}assert(V(E.unpackSave(E.packSave(state(p)))));const snapshot=copy(p);assert(!E.meetClubCharacter(p,m.id,m.favorite));assert.deepEqual(copy(p),snapshot);p.age++;p.season++}
  // Old saves have no look field and keep their original scene. No retroactive grants.
  const legacy=copy(p);for(const row of legacy.clubLife.history)delete row.look;assert(V(E.unpackSave(E.packSave(state(legacy)))));assert.equal(E.clubArtInfo(legacy,m.id,'summer'),null);assert.equal(E.clubArtInfo(legacy,m.id,'celebration'),null);assert.equal(E.clubArtInfo(legacy,m.id,'outing').file,`assets/club-life/club-${club.id}-v1.webp`);
  const forged=copy(legacy);forged.clubLife.history[0].look='celebration';assert.throws(()=>V(state(forged)));p.age=20;assert.equal(E.clubArtInfo(p,m.id,'summer'),null);
 }
 const p=player(E,22);assert(!E.meetClubCharacter(p,'kia-0','coffee'));assert.equal(E.clubArtInfo(p,'kia-0','celebration'),null);
});

test('every shipped new atlas matches its catalog hash and keeps the six-panel dimensions',()=>{
 for(const [folder,name,count]of[['care','fashion-catalog.json',13],['club-life','story-catalog.json',10]]){const catalog=JSON.parse(fs.readFileSync(path.join(root,'assets',folder,name),'utf8'));assert.equal(catalog.assets.length,count);for(const a of catalog.assets){assert.equal(a.width,1536);assert.equal(a.height,1024);assert.equal(a.columns,3);assert.equal(a.rows,2);const bytes=fs.readFileSync(path.join(root,'assets',folder,a.file));assert.equal(bytes.length,a.bytes);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256)}}
});
