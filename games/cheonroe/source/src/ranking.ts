import { HEROES, type Difficulty, type GameState, type HeroId } from './types';
import { fromState, validRun, validNickname, type RunRecord, type PublicRecord } from './ranking-model';
import { loadOnline, publishOnline, deleteOnline } from './ranking-api';
import './ranking.css';

const key='jp-math-lab:cheonroe:v1:runs',profile='jp-math-lab:cheonroe:v1:ranking-profile';
const heroName=(id:HeroId)=>HEROES.find(h=>h.id===id)!.name;
const modeName=(id:Difficulty)=>id==='normal'?'아케이드':'수련';
const read=(name:string)=>{try{return localStorage.getItem(name);}catch{return null;}};
const write=(name:string,value:string)=>{try{localStorage.setItem(name,value);return true;}catch{return false;}};
function json(name:string):Record<string,unknown>{try{const v=JSON.parse(read(name)||'{}');return v&&typeof v==='object'&&!Array.isArray(v)?v:{};}catch{return {};}}
interface Options{getSelection:()=>{hero:HeroId;difficulty:Difficulty};beforeOpen:()=>()=>void;canPublish:boolean;}
export function bindRanking(options:Options){
  document.body.insertAdjacentHTML('beforeend',`<dialog id="ranking-dialog" class="ranking-dialog" aria-labelledby="ranking-title">
   <div class="rank-heading"><div><p class="eyebrow">JP MATH LAB · 천뢰 시즌 1</p><h2 id="ranking-title">철화전선 랭킹</h2></div><button type="button" class="icon-btn" id="rank-close" aria-label="랭킹 닫기">×</button></div>
   <div class="rank-modes" role="group" aria-label="랭킹 종류"><button data-rank-scope="online" aria-pressed="true">공개 랭킹</button><button data-rank-scope="local" aria-pressed="false">내 기록</button><button id="rank-refresh" class="rank-refresh" type="button">새로고침 ↻</button></div>
   <div class="rank-filters"><label>난이도<select id="rank-difficulty"><option value="normal">아케이드 · 목숨 3</option><option value="story">수련 · 목숨 5</option></select></label><label>전사<select id="rank-hero"><option value="all">전체 전사</option>${HEROES.map(h=>`<option value="${h.id}">${h.name} · ${h.epithet}</option>`).join('')}</select></label></div>
   <p class="rank-scope-note" id="rank-scope-note">난이도별 상위 100개 · 같은 점수는 공동 순위</p>
   <p class="rank-status" id="rank-status" role="status" aria-live="polite"></p>
   <div class="rank-list-wrap"><table class="rank-table" id="rank-table"><thead><tr><th scope="col">순위</th><th scope="col">닉네임 / 전사</th><th scope="col" aria-sort="descending">점수</th><th scope="col">결과</th></tr></thead><tbody id="rank-rows"></tbody></table><p id="rank-empty" class="rank-empty">아직 등록된 기록이 없어요.</p></div>
   <form id="rank-form" class="rank-form"><div class="rank-best" id="rank-best"></div><div class="rank-register-row"><label>공개 닉네임<input id="rank-nickname" maxlength="12" autocomplete="nickname" required placeholder="최대 12자"></label><button id="rank-submit" class="primary" type="submit">최고 점수 등록 <span>↗</span></button></div><p class="rank-publish-note" id="rank-publish-note">닉네임·전사·점수가 공개돼요. 난이도·전사별 최고 기록 1개를 보관합니다.</p></form>
   <div class="rank-footer"><span>한 판이 끝나면 점수를 등록할 수 있어요.</span><button type="button" id="rank-delete">내 공개 기록 삭제</button></div>
  </dialog>`);
  const $=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
  const dialog=$<HTMLDialogElement>('ranking-dialog'),difficulty=$<HTMLSelectElement>('rank-difficulty'),hero=$<HTMLSelectElement>('rank-hero');
  const nickname=$<HTMLInputElement>('rank-nickname'),submit=$<HTMLButtonElement>('rank-submit'),remove=$<HTMLButtonElement>('rank-delete');
  const cachedProfile=json(profile);nickname.value=typeof cachedProfile.nickname==='string'?cachedProfile.nickname:'';
  let owner=typeof cachedProfile.uid==='string'?cachedProfile.uid:'',scope:'online'|'local'='online',busy=false,requestId=0,rows:PublicRecord[]=[],status='',closeAction=()=>{};
  let memory:Record<string,RunRecord>={};
  function localRuns(){const best=new Map<string,RunRecord>();for(const value of [...Object.values(json(key)),...Object.values(memory)])if(validRun(value)){const k=`${value.difficulty}:${value.hero}`,old=best.get(k);if(!old||value.score>old.score)best.set(k,value);}return [...best.values()];}
  function candidate(){return localRuns().filter(r=>r.difficulty===difficulty.value&&(hero.value==='all'||r.hero===hero.value)).sort((a,b)=>b.score-a.score)[0];}
  function markOwner(uid:string){owner=uid;write(profile,JSON.stringify({uid,nickname:nickname.value.trim()}));}
  function render(){
    const selected=candidate(),mode=difficulty.value as Difficulty,local=scope==='local';
    const list=local?localRuns().filter(r=>r.difficulty===mode&&(hero.value==='all'||r.hero===hero.value)).sort((a,b)=>b.score-a.score).map(r=>({...r,nickname:'내 기록',submittedAt:0,uid:r.hero})):rows;
    $('rank-status').textContent=status;$('rank-empty').hidden=Boolean(list.length)||Boolean(status);$('rank-empty').textContent=local?'아직 완주하거나 도전한 기록이 없어요.':'아직 공개 기록이 없어요. 첫 번째 점수에 도전하세요.';
    $('rank-table').hidden=!list.length;$('rank-form').classList.toggle('hidden',local);$('rank-scope-note').textContent=`${modeName(mode)} · ${hero.value==='all'?'전체 전사':heroName(hero.value as HeroId)} · ${local?'이 브라우저의 기록':'상위 100개 / 같은 점수는 공동 순위'}`;
    document.querySelectorAll<HTMLButtonElement>('[data-rank-scope]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.rankScope===scope));b.disabled=busy;});
    let last=-1,rank=0;const children=list.map((r,index)=>{
      if(r.score!==last)rank=index+1;last=r.score;
      const tr=document.createElement('tr');if(!local&&owner===r.uid)tr.classList.add('rank-own');
      const n=document.createElement('td');n.className='rank-place';n.textContent=String(rank).padStart(2,'0');
      const who=document.createElement('td'),name=document.createElement('strong'),details=document.createElement('span');name.textContent=r.nickname+(!local&&owner===r.uid?' · 나':'');details.textContent=`${heroName(r.hero)} · ${r.kills}격파 · 스친 탄 ${r.graze}`;who.append(name,details);
      const score=document.createElement('td');score.className='rank-score';score.textContent=r.score.toLocaleString();
      const result=document.createElement('td');result.className=r.cleared?'rank-clear':'';result.textContent=r.cleared?'클리어':'도전';tr.append(n,who,score,result);return tr;
    });$('rank-rows').replaceChildren(...children);
    $('rank-best').textContent=selected?`내 최고 · ${heroName(selected.hero)}  ${selected.score.toLocaleString()}점${selected.cleared?' · 클리어':''}`:'10초 이상 플레이한 뒤 한 판을 마치면 최고 기록이 남아요.';
    submit.disabled=busy||!selected||!options.canPublish;nickname.disabled=busy;difficulty.disabled=busy;hero.disabled=busy;$<HTMLButtonElement>('rank-refresh').disabled=busy;
    remove.hidden=local||!owner;remove.disabled=busy||hero.value==='all'||!options.canPublish;remove.title=hero.value==='all'?'전사를 선택하면 해당 전사의 공개 기록을 삭제할 수 있어요.':'';
    $('rank-publish-note').textContent=!options.canPublish?'검수 모드에서는 공개 기록을 등록하지 않습니다.':'닉네임·전사·점수가 공개돼요. 난이도·전사별 최고 1개를 보관하며, 갱신은 10초 간격입니다.';
  }
  async function refresh(){
    const id=++requestId,mode=difficulty.value as Difficulty,filter=hero.value as HeroId|'all';rows=[];
    if(scope==='local'){status='';render();return;}
    status='공개 랭킹을 불러오는 중…';render();
    try{const result=await loadOnline(mode,filter);if(id!==requestId||!dialog.open)return;rows=result;status='';}
    catch(error){if(id!==requestId||!dialog.open)return;status=error instanceof Error?error.message:'순위표에 연결하지 못했어요. 다시 시도해 주세요.';}
    render();
  }
  function open(){const current=options.getSelection();difficulty.value=current.difficulty;hero.value='all';scope='online';closeAction=options.beforeOpen();dialog.showModal();void refresh();}
  function close(){++requestId;dialog.close();closeAction();closeAction=()=>{};}
  $('rank-close').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  $('rank-refresh').onclick=()=>void refresh();difficulty.onchange=()=>void refresh();hero.onchange=()=>void refresh();
  document.querySelectorAll<HTMLButtonElement>('[data-rank-scope]').forEach(b=>b.onclick=()=>{scope=b.dataset.rankScope as 'online'|'local';void refresh();});
  nickname.oninput=()=>nickname.setCustomValidity('');
  $('rank-form').onsubmit=async e=>{
    e.preventDefault();const run=candidate(),name=nickname.value.trim();nickname.setCustomValidity(validNickname(name)?'':'닉네임은 한글·영문·숫자와 공백 _ . - 를 사용해 1~12자로 입력해 주세요.');
    if(busy||!run||!options.canPublish||!$<HTMLFormElement>('rank-form').reportValidity())return;
    busy=true;status='최고 점수를 등록하는 중…';render();
    try{const result=await publishOnline({...run},name,markOwner);write(profile,JSON.stringify({uid:result.uid,nickname:name}));await refresh();status=result.kept?'더 높은 공개 기록이 있어 기존 점수를 보관했어요.':'공개 랭킹에 등록했어요.';}
    catch(error){status=error instanceof Error?error.message:'등록하지 못했어요. 내 기록은 보관돼 있어요.';}
    finally{busy=false;render();}
  };
  remove.onclick=async()=>{
    if(busy||hero.value==='all'||!options.canPublish)return;const mode=difficulty.value as Difficulty,id=hero.value as HeroId;busy=true;status='내 공개 기록을 삭제하는 중…';render();
    try{await deleteOnline(mode,id);await refresh();status='선택한 전사의 공개 기록을 삭제했어요. 내 기록은 보관돼 있어요.';}
    catch(error){status=error instanceof Error?error.message:'삭제하지 못했어요. 다시 시도해 주세요.';}
    finally{busy=false;render();}
  };
  addEventListener('storage',e=>{if(e.key===key&&dialog.open)render();});
  return{
    open,
    get isOpen(){return dialog.open;},
    record(state:GameState){
      if(!options.canPublish)return;const run=fromState(state);if(!run)return;
      const store=()=>{const latest=Object.fromEntries(localRuns().map(r=>[`${r.difficulty}:${r.hero}`,r]));const k=`${run.difficulty}:${run.hero}`;if(!latest[k]||run.score>latest[k].score)latest[k]={...run};memory=latest;write(key,JSON.stringify(latest));};
      if(navigator.locks?.request)void navigator.locks.request(key,store).catch(store);else store();
    }
  };
}
