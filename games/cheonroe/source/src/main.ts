import './styles.css';
import './cabinet.css';
import { Engine } from './engine';
import { GameRenderer } from './renderer';
import { AudioSystem } from './audio';
import { bindRanking } from './ranking';
import { HEROES, WIDTH, HEIGHT, type HeroId, type Difficulty, type InputIntent, type GameEvent } from './types';

const icons={sound:'<path d="m11 5-6 4H2v6h3l6 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',muted:'<path d="m11 5-6 4H2v6h3l6 4V5Z"/><path d="m16 9 6 6m0-6-6 6"/>',full:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',pause:'<path d="M8 5v14M16 5v14"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3c-1 .5-1 1-1 2m0 3h.01"/>',motion:'<path d="M3 8h11a4 4 0 1 0-4-4M2 12h16a3 3 0 1 1-3 3M3 16h6"/>',arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>'};
const icon=(key:keyof typeof icons)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg>`;
const asset=(name:string)=>`${import.meta.env.BASE_URL}assets/${name}`;
const saved=(key:string,fallback:string)=>{try{return localStorage.getItem(key)||fallback;}catch{return fallback;}};
const save=(key:string,value:string)=>{try{localStorage.setItem(key,value);}catch{ /* Local scores are optional. */ }};
let selected:HeroId='rin',difficulty:Difficulty='normal',best=Number(saved('cheonroe-best','0'))||0;
let ready=false,lastPhase='menu',screenshotPaused=false,lastStamp=0,accumulator=0,hudAt=0,notifyAt=0;
const keys=new Set<string>();
const input:InputIntent={x:0,y:0,focus:false,charge:false,ultimate:false};
let touchTarget:InputIntent['target'],touchCharge=false,ultimatePending=false,touchFocus=false;
const engine=new Engine(20261120),audio=new AudioSystem();
const qaMode=new URLSearchParams(location.search).get('qa')==='1';
document.body.classList.toggle('touch-device',navigator.maxTouchPoints>0);
audio.muted=saved('cheonroe-muted','false')==='true';

document.querySelector<HTMLDivElement>('#app')!.innerHTML=`
<div class="shell">
 <header class="masthead">
  <a class="brand" href="#" aria-label="천뢰 처음으로"><span class="seal">天<br>雷</span><div><span class="brand-name">천뢰 <i>철화전선</i></span><span class="brand-en">IRON BLOSSOM</span></div></a>
  <div class="header-right"><a class="game-home" href="../">← 게임 목록</a><span class="edition">JP MATH LAB <b>第一章</b></span><button class="header-rank" id="open-ranking" aria-haspopup="dialog">랭킹</button><button class="icon-btn" id="motion" aria-label="화면 흔들림 줄이기" title="화면 흔들림 줄이기">${icon('motion')}</button><button class="icon-btn" id="sound" aria-label="소리 끄기" title="소리">${icon('sound')}</button><button class="icon-btn" id="help" aria-label="조작 방법" title="조작 방법">${icon('help')}</button></div>
 </header>
 <main>
  <section id="menu" aria-labelledby="choose-title">
   <div class="menu-heading"><div><p class="eyebrow"><span></span> THE SKY IS YOUR BATTLEFIELD</p><h1 id="choose-title">당신의 전사를 선택하라<span>.</span></h1></div><div class="chapter-note"><span>CHAPTER I</span><strong>붉은 달의 계곡</strong><small>홍련 계곡 · 기계 수호신 토벌</small></div></div>
   <div class="hero-grid" role="group" aria-label="캐릭터 선택">${HEROES.map((h,i)=>`
    <button class="hero-card ${i===0?'selected':''}" data-hero="${h.id}" aria-pressed="${i===0}" style="--hero-color:${h.color}">
     <span class="card-top"><span class="card-mark">${['花','鉄','拳'][i]}</span><span class="hero-role">${h.role}</span><span class="selected-mark">✓</span></span>
     <span class="hero-moon"></span><span class="hero-watermark" aria-hidden="true">${['紅蓮','鉄鬼','武震'][i]}</span>
     <img class="hero-art" src="${asset(h.asset)}" alt="${h.epithet} ${h.name} 캐릭터 원화" draggable="false">
     <span class="card-bottom"><span class="hero-epithet">${h.epithet}</span><span class="hero-name">${h.name}<small>${h.english}</small></span><span class="card-rule"></span><span class="ultimate-label">必殺 <b>${h.ultimate}</b><span>${h.ultimateEn}</span></span></span>
    </button>`).join('')}
   </div>
   <div class="deploy-row"><div class="selection-copy"><span id="chosen-quote">${HEROES[0].description}</span><p id="chosen-ability">${HEROES[0].ability}</p></div><div class="deployment"><div class="difficulty" role="group" aria-label="난이도"><button data-difficulty="story" aria-pressed="false">수련 <small>목숨 5</small></button><button class="active" data-difficulty="normal" aria-pressed="true">아케이드 <small>목숨 3</small></button></div><button id="start" class="primary" disabled><span id="start-label">원화 불러오는 중</span>${icon('arrow')}</button></div></div>
   <div class="menu-bottom"><span class="auto-note"><i></i> 자동 사격 · 가까이 붙으면 근접 공격 · 궁극기로 탄막 소거</span><span class="best">최고 기록 <b id="best">${best.toLocaleString('en-US').padStart(7,'0')}</b></span></div>
  </section>
  <section id="game" class="hidden" aria-label="천뢰 게임">
   <div id="arena">
    <div class="game-top"><div class="pilot"><span class="pilot-symbol" id="pilot-symbol">花</span><div><span class="micro" id="pilot-name">린 · 홍련의 무녀</span><div id="lives" class="lives" aria-label="남은 목숨"></div></div><span class="weapon-level" id="power">LV 1</span></div><div class="stage-title"><span>第一章</span><strong>붉은 달의 계곡</strong><div class="stage-progress"><i id="stage-fill"></i></div></div><div class="score-cluster"><span class="micro">SCORE <b id="score">0000000</b></span><div><button id="pause" class="icon-btn" aria-label="일시 정지">${icon('pause')}</button><button id="fullscreen" class="icon-btn" aria-label="전체 화면">${icon('full')}</button></div></div></div>
    <div id="playfield"><div id="canvas-host"></div><div id="world-labels" aria-hidden="true"></div><div class="field-vignette"></div>
     <div id="boss-hud" class="boss-hud hidden"><div><span>機神 · 羅刹</span><strong>나찰 · 계곡의 수호신</strong><span id="boss-phase">一式</span></div><div class="boss-track"><i id="boss-fill"></i></div></div>
     <div id="combo" class="combo hidden"><strong>0</strong><span>CHAIN</span></div>
     <div id="stage-intro" class="stage-intro hidden"><small>CHAPTER I</small><h2>붉은 달의 계곡</h2><span>기계 수호신을 격파하라</span></div>
     <div id="warning" class="warning hidden"><span>警告</span><strong>수호신 접근</strong><small>KEEP YOUR EYES ON THE GAPS</small></div>
     <div id="ultimate-cut" class="ultimate-cut hidden"><img id="ultimate-portrait" alt=""><div><small id="ultimate-en"></small><strong id="ultimate-name"></strong><span>敵弾消去 · 적 탄막 소거</span></div></div>
     <div id="notification" class="notification hidden" aria-live="polite"></div>
     <div id="overlay" class="game-overlay hidden"><div class="result-panel"><p class="eyebrow" id="result-eyebrow"></p><h2 id="result-title"></h2><p id="result-copy"></p><div id="result-stats" class="result-stats"></div><div class="result-actions"><button id="resume" class="primary hidden">전장으로 돌아가기 ${icon('arrow')}</button><button id="retry" class="primary">다시 출격 ${icon('arrow')}</button><button id="result-ranking" class="result-rank" aria-haspopup="dialog">점수 등록 · 랭킹</button></div><button id="return" class="text-btn">전사 다시 선택</button></div></div>
    </div>
    <div class="game-bottom"><div class="ultimate-status"><span class="micro">必殺 · <b id="ultimate-status-name">홍련만개</b></span><div id="stocks" class="stocks"></div></div><div class="charge-cluster"><span class="micro" id="charge-text">차지 공격 <b>Z 누르기</b></span><div class="charge-track"><i id="charge-fill"></i></div></div><div class="graze-status"><span class="micro">스친 탄 <b id="graze">0</b></span><small>작은 중심점만 피격 판정</small></div></div>
    <div class="touch-controls"><div class="touch-guide"><span class="drag-symbol">✥</span><span>전장을 드래그해 이동<small>기본 사격은 자동</small></span></div><button id="touch-focus" class="touch-action" aria-pressed="false">집중<small>느리게</small></button><button id="touch-charge" class="touch-action">차지<small>꾹 눌렀다 떼기</small></button><button id="touch-ultimate" class="touch-action ultimate-touch">필살<small id="touch-stock">3회</small></button></div>
   </div>
   <div class="control-strip"><span><kbd>W A S D</kbd> / <kbd>↑ ↓ ← →</kbd> 이동</span><span><kbd>SHIFT</kbd> 정밀 이동</span><span><kbd>Z</kbd> 홀드 & 릴리즈</span><span><kbd>X</kbd> / <kbd>SPACE</kbd> 궁극기</span><span><kbd>P</kbd> 일시 정지</span></div>
  </section>
 </main>
 <footer><span><a href="../">← JP Math Lab 게임</a><i>세 개의 운명, 하나의 전장.</i></span><span>천뢰: 철화전선 <b>FIRST PLAYABLE</b></span></footer>
</div>
<dialog id="help-dialog"><button id="help-close" class="icon-btn dialog-close" aria-label="도움말 닫기">${icon('close')}</button><p class="eyebrow">FIELD MANUAL</p><h2>탄막 속에도 길은 있다.</h2><p class="help-lead">기본 공격은 자동. 이동과 공격 타이밍에 집중하세요.</p><dl><div><dt>이동</dt><dd>방향키 / WASD · 모바일은 전장 드래그</dd></div><div><dt>정밀 회피</dt><dd>Shift를 누르면 천천히 이동하며 실제 피격 중심점이 나타납니다.</dd></div><div><dt>차지 공격</dt><dd>Z를 0.65초 이상 누른 뒤 떼세요. 모으는 동안 기본 사격은 멈춥니다.</dd></div><div><dt>근접 공격</dt><dd>적 앞 125 안으로 붙으면 자동으로 발동합니다. 근접 격파 점수는 2배.</dd></div><div><dt>궁극기</dt><dd>X / Space · 한 판에 3회. 적 탄막을 지우고 잠시 무적이 됩니다.</dd></div><div><dt>성장</dt><dd>P를 모으면 최대 3단계까지 사격 강화. 적 탄에 스치면 추가 점수.</dd></div></dl><p class="manual-note">수련: 목숨 5개 · 느린 적 탄 / 아케이드: 목숨 3개<br>첫 장은 약 2분. 마지막 수호신을 처치하면 클리어합니다.</p><button id="help-play" class="primary">알겠어 ${icon('arrow')}</button></dialog>`;

const $=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const view=new GameRenderer($('canvas-host'));
const ranking=bindRanking({getSelection:()=>({hero:selected,difficulty}),canPublish:!qaMode,beforeOpen:()=>{const wasPlaying=engine.state.phase==='playing';if(wasPlaying)togglePause();return()=>{if(wasPlaying&&engine.state.phase==='paused')togglePause();};}});
$('open-ranking').onclick=ranking.open;$('result-ranking').onclick=ranking.open;
let reducedMotion=saved('cheonroe-motion',String(view.reducedMotion))==='true';view.reducedMotion=reducedMotion;
function updateSettings(){
  $('sound').innerHTML=icon(audio.muted?'muted':'sound');$('sound').setAttribute('aria-label',audio.muted?'소리 켜기':'소리 끄기');$('sound').setAttribute('aria-pressed',String(!audio.muted));
  $('motion').setAttribute('aria-pressed',String(reducedMotion));document.documentElement.classList.toggle('reduced-motion',reducedMotion);
}
updateSettings();
$('sound').onclick=()=>{audio.setMuted(!audio.muted);save('cheonroe-muted',String(audio.muted));updateSettings();};
$('motion').onclick=()=>{reducedMotion=!reducedMotion;view.reducedMotion=reducedMotion;save('cheonroe-motion',String(reducedMotion));updateSettings();};
let helpWasPlaying=false;
function openHelp(){helpWasPlaying=engine.state.phase==='playing';if(helpWasPlaying)togglePause();$<HTMLDialogElement>('help-dialog').showModal();}
function closeHelp(){($('help-dialog') as HTMLDialogElement).close();if(helpWasPlaying&&engine.state.phase==='paused')togglePause();helpWasPlaying=false;}
$('help').onclick=openHelp;$('help-close').onclick=closeHelp;$('help-play').onclick=closeHelp;
$('help-dialog').addEventListener('cancel',e=>{e.preventDefault();closeHelp();});
document.querySelectorAll<HTMLButtonElement>('[data-hero]').forEach(card=>card.onclick=()=>selectHero(card.dataset.hero as HeroId));
function selectHero(id:HeroId){
  selected=id;const hero=HEROES.find(h=>h.id===id)!;
  document.querySelectorAll<HTMLButtonElement>('[data-hero]').forEach(card=>{const active=card.dataset.hero===id;card.classList.toggle('selected',active);card.setAttribute('aria-pressed',String(active));});
  $('chosen-quote').textContent=hero.description;$('chosen-ability').textContent=hero.ability;
  document.documentElement.style.setProperty('--accent',hero.color);view.select(id);
}
document.querySelectorAll<HTMLButtonElement>('[data-difficulty]').forEach(btn=>btn.onclick=()=>{difficulty=btn.dataset.difficulty as Difficulty;document.querySelectorAll<HTMLButtonElement>('[data-difficulty]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});});
function clearInputs(){keys.clear();input.x=0;input.y=0;input.focus=false;input.charge=false;input.ultimate=false;touchTarget=undefined;touchCharge=false;ultimatePending=false;document.querySelectorAll('.touch-action.pressed').forEach(el=>el.classList.remove('pressed'));}
function clearOverlays(){for(const id of ['stage-intro','warning','ultimate-cut','notification'])$(id).classList.add('hidden');introUntil=0;warningUntil=0;cutUntil=0;notifyAt=0;$('world-labels').replaceChildren();}
function startGame(){
  if(!ready)return;clearInputs();clearOverlays();engine.start(selected,difficulty);view.reset();view.select(selected);audio.reset();void audio.unlock();
  $('menu').classList.add('hidden');$('game').classList.remove('hidden');$('overlay').classList.add('hidden');lastPhase='playing';screenshotPaused=false;accumulator=0;
  document.body.classList.add('in-game');
  const hero=HEROES.find(h=>h.id===selected)!;$('pilot-name').textContent=`${hero.name} · ${hero.epithet}`;$('pilot-symbol').textContent=selected==='rin'?'花':selected==='golem'?'鉄':'拳';$('ultimate-status-name').textContent=hero.ultimate;
  $('stage-intro').classList.remove('hidden');introUntil=performance.now()+2600;updateHud();view.resize();
  $('start').blur();
}
let introUntil=0,warningUntil=0,cutUntil=0;
$('start').onclick=startGame;$('retry').onclick=startGame;
function menu(){
  clearInputs();clearOverlays();engine.state.phase='menu';audio.setActive(false);view.reset();$('menu').classList.remove('hidden');$('game').classList.add('hidden');lastPhase='menu';
  document.body.classList.remove('in-game');
  if(document.fullscreenElement)void document.exitFullscreen().catch(()=>{});
}
$('return').onclick=menu;
document.querySelector<HTMLAnchorElement>('.brand')!.onclick=e=>{e.preventDefault();if(engine.state.phase==='playing')togglePause();else if(engine.state.phase==='menu')window.scrollTo({top:0,behavior:'smooth'});};
function togglePause(){
  const s=engine.state;if(s.phase!=='playing'&&s.phase!=='paused')return;
  const paused=s.phase==='playing';engine.pause(paused);clearInputs();audio.setActive(!paused);syncPhase();
}
$('pause').onclick=togglePause;$('resume').onclick=togglePause;
$('fullscreen').onclick=()=>{if(!document.fullscreenElement)void $('arena').requestFullscreen().catch(()=>notice('전체 화면을 지원하지 않는 브라우저예요.'));else void document.exitFullscreen();};
const handled=new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyZ','KeyX','ShiftLeft','ShiftRight','KeyP','Escape','KeyW','KeyA','KeyS','KeyD']);
addEventListener('keydown',e=>{
  if(($('help-dialog') as HTMLDialogElement).open||ranking.isOpen)return;
  if(engine.state.phase!=='menu'&&handled.has(e.code))e.preventDefault();
  if(!e.repeat&&(e.code==='KeyP'||e.code==='Escape')){togglePause();return;}
  if(!e.repeat&&(e.code==='KeyX'||e.code==='Space')&&engine.state.phase==='playing')ultimatePending=true;
  if(engine.state.phase==='menu'&&e.code==='Enter'){if(!(e.target instanceof HTMLElement)||!e.target.closest('button,a,input,select,textarea'))startGame();return;}
  if((engine.state.phase==='gameover'||engine.state.phase==='victory')&&e.code==='KeyR'){startGame();return;}
  keys.add(e.code);
});
addEventListener('keyup',e=>keys.delete(e.code));
addEventListener('blur',()=>{clearInputs();if(engine.state.phase==='playing')togglePause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInputs();if(engine.state.phase==='playing')togglePause();}});
const field=$('playfield');let movePointer:number|null=null;
function setTarget(e:PointerEvent){const rect=field.getBoundingClientRect();touchTarget={x:(e.clientX-rect.left)/rect.width*WIDTH,y:(e.clientY-rect.top)/rect.height*HEIGHT};}
field.addEventListener('pointerdown',e=>{if(engine.state.phase!=='playing'||(e.target as HTMLElement).closest('button'))return;e.preventDefault();movePointer=e.pointerId;field.setPointerCapture(e.pointerId);setTarget(e);void audio.unlock();});
field.addEventListener('pointermove',e=>{if(movePointer===e.pointerId)setTarget(e);});
for(const name of ['pointerup','pointercancel','lostpointercapture'])field.addEventListener(name,(e)=>{if((e as PointerEvent).pointerId===movePointer){movePointer=null;touchTarget=undefined;}});
function holdButton(id:string,on:(down:boolean)=>void){const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);on(true);b.classList.add('pressed');});for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>{on(false);b.classList.remove('pressed');});}
holdButton('touch-charge',v=>touchCharge=v);
$('touch-ultimate').onclick=()=>{ultimatePending=true;};
$('touch-focus').onclick=()=>{touchFocus=!touchFocus;$('touch-focus').setAttribute('aria-pressed',String(touchFocus));};
function notice(text:string,duration=1600){$('notification').textContent=text;$('notification').classList.remove('hidden');notifyAt=performance.now()+duration;}
function floatText(e:GameEvent){
  if($('world-labels').childElementCount>14)return;
  const span=document.createElement('span');span.className='floating-score';span.textContent=e.kind==='kill'?`${e.text?'近接 ×2  ':''}+${e.value}`:e.kind==='pickup'?e.text||'GET!':'';
  span.style.left=`${e.x/WIDTH*100}%`;span.style.top=`${e.y/HEIGHT*100}%`;$('world-labels').append(span);setTimeout(()=>span.remove(),850);
}
function event(e:GameEvent){
  const s=engine.state;view.event(e,s.hero);audio.event(e,s.hero);
  if(e.kind==='kill'||e.kind==='pickup')floatText(e);
  if(e.kind==='hurt')notice('피격! 잠시 무적 · 중심점에 집중하세요',1400);
  if(e.kind==='charge')notice('차지 해방',650);
  if(e.kind==='pickup'&&e.text)notice(e.text,1000);
  if(e.kind==='boss') {warningUntil=performance.now()+2800;$('warning').classList.remove('hidden');}
  if(e.kind==='ultimate'){
    $('stage-intro').classList.add('hidden');introUntil=0;$('notification').classList.add('hidden');notifyAt=0;
    const hero=HEROES.find(h=>h.id===s.hero)!;$('ultimate-en').textContent=hero.ultimateEn;$('ultimate-name').textContent=hero.ultimate;$('ultimate-portrait').setAttribute('src',asset(hero.asset));
    $('ultimate-cut').classList.remove('hidden');cutUntil=performance.now()+(reducedMotion?650:1100);
  }
}
function syncPhase(){
  const s=engine.state;if(s.phase===lastPhase)return;lastPhase=s.phase;
  const overlay=$('overlay');
  if(s.phase==='playing'){overlay.classList.add('hidden');audio.setActive(true);return;}
  if(s.phase==='menu')return;
  overlay.classList.remove('hidden');const paused=s.phase==='paused',won=s.phase==='victory';
  $('result-eyebrow').textContent=paused?'PAUSE · 잠시 숨 고르기':won?'CHAPTER CLEAR · 第一章 完':'CONTINUE?';
  $('result-title').textContent=paused?'멈춘 시간.':won?'계곡에 고요가 돌아왔다.':'다시, 탄막 속으로.';
  $('result-copy').textContent=paused?'움직임을 읽으면, 길이 보인다.':won?'나찰 격파. 첫 번째 전설을 새겼습니다.':'Shift로 중심점을 보며 피하고, 위험할 때는 궁극기를 쓰세요.';
  $('resume').classList.toggle('hidden',!paused);$('retry').classList.toggle('hidden',paused);$('result-stats').classList.toggle('hidden',paused);
  if(!paused){
    ranking.record(s);
    $('result-stats').innerHTML=`<div><span>SCORE</span><strong>${s.score.toLocaleString()}</strong></div><div><span>격파</span><strong>${s.stats.kills}</strong></div><div><span>스친 탄</span><strong>${s.graze}</strong></div>`;
    if(s.score>best){best=s.score;save('cheonroe-best',String(best));$('best').textContent=String(best).padStart(7,'0');}
    if(won)setTimeout(()=>{if(engine.state.phase==='victory')audio.setActive(false);},1800);else audio.setActive(false);
  }
}
function updateHud(){
  const s=engine.state,p=s.player;
  $('score').textContent=String(Math.round(s.score)).padStart(7,'0');
  $('lives').innerHTML=Array.from({length:p.maxHp},(_,i)=>`<span class="life ${i>=p.hp?'lost':''}">◆</span>`).join('');$('lives').setAttribute('aria-label',`남은 목숨 ${p.hp}개`);
  $('power').textContent=`LV ${p.power}`;
  $('stocks').innerHTML=Array.from({length:3},(_,i)=>`<span class="stock ${i>=p.ultimateStock?'spent':''}">✦</span>`).join('');$('stocks').setAttribute('aria-label',`궁극기 ${p.ultimateStock}회`);
  $('touch-stock').textContent=`${p.ultimateStock}회`;$<HTMLButtonElement>('touch-ultimate').disabled=p.ultimateStock<=0||p.ultimateTimer>0;
  $('charge-fill').style.width=`${p.charge/1.3*100}%`;$('charge-text').innerHTML=p.charge>=1.29?'차지 완료 <b>떼서 발사!</b>':p.charge>0?'기 모으는 중 <b>0.65초 이상</b>':'차지 공격 <b>Z 누르기</b>';
  $('graze').textContent=String(s.graze);$('stage-fill').style.width=`${Math.min(100,s.time/70*100)}%`;
  const boss=s.enemies.find(e=>e.kind==='boss');$('boss-hud').classList.toggle('hidden',!boss);
  if(boss){$('boss-fill').style.width=`${Math.max(0,boss.hp/boss.maxHp*100)}%`;$('boss-phase').textContent=['','一式','二式','三式'][boss.phase]||'一式';}
  $('combo').classList.toggle('hidden',s.combo<3);$('combo').querySelector('strong')!.textContent=String(s.combo).padStart(2,'0');
}

function frame(now:number){
  const dt=Math.min(.05,(now-lastStamp)/1000||.016);lastStamp=now;
  const playing=engine.state.phase==='playing'&&!screenshotPaused;
  input.x=Number(keys.has('ArrowRight')||keys.has('KeyD'))-Number(keys.has('ArrowLeft')||keys.has('KeyA'));
  input.y=Number(keys.has('ArrowDown')||keys.has('KeyS'))-Number(keys.has('ArrowUp')||keys.has('KeyW'));
  input.focus=keys.has('ShiftLeft')||keys.has('ShiftRight')||touchFocus;input.charge=keys.has('KeyZ')||touchCharge;
  input.ultimate=keys.has('KeyX')||keys.has('Space')||ultimatePending;input.target=touchTarget;
  if(playing){accumulator+=dt;let stepped=false;while(accumulator>=1/120){engine.step(1/120,input);accumulator-=1/120;stepped=true;}if(stepped)ultimatePending=false;audio.tick(dt,engine.state.time);}
  else accumulator=0;
  for(const e of engine.state.events.splice(0))event(e);
  if(now-hudAt>65){updateHud();hudAt=now;}syncPhase();
  if(introUntil&&now>introUntil){$('stage-intro').classList.add('hidden');introUntil=0;}
  if(warningUntil&&now>warningUntil){$('warning').classList.add('hidden');warningUntil=0;}
  if(cutUntil&&now>cutUntil){$('ultimate-cut').classList.add('hidden');cutUntil=0;}
  if(notifyAt&&now>notifyAt){$('notification').classList.add('hidden');notifyAt=0;}
  view.render(engine.state,playing?dt:engine.state.phase==='menu'?dt:0,input.focus,screenshotPaused||engine.state.phase==='paused');
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

async function init(){
  try{await view.load(n=>{$('start-label').textContent=`전장 준비 ${Math.round(n*100)}%`;});ready=true;$<HTMLButtonElement>('start').disabled=false;$('start-label').textContent='전장으로';view.select(selected);}
  catch(error){$('start-label').textContent='새로고침해 다시 불러오기';$('chosen-ability').textContent='캐릭터 원화를 불러오지 못했습니다. 연결을 확인하고 새로고침해 주세요.';console.error(error);}
}
void init();

// Inspection and deterministic captures are opt-in and never appear in normal play.
if(qaMode){
  const win=window as unknown as Record<string,unknown>;
  win.__THREE_GAME_DIAGNOSTICS__={get renderer(){return view.renderer.info;},get state(){return view.diagnostics(engine.state).state;},get performance(){return view.diagnostics(engine.state).performance;},physics:{engine:'analytic',timestep:1/120}};
  const advance=(seconds:number,intent:Partial<InputIntent>={},invulnerable=false)=>{
    const empty:InputIntent={x:0,y:0,focus:false,charge:false,ultimate:false,...intent};
    for(let t=0;t<seconds;t+=1/120){if(invulnerable)engine.state.player.invulnerable=10;engine.step(1/120,empty);if(engine.state.events.length>300)engine.state.events.splice(0);}
    engine.state.events.splice(0);updateHud();syncPhase();
  };
  win.__THREE_GAME_TEST_HOOKS__={
    seed:(n:number)=>engine.seed(n),
    async setState(name:string){
      const states=['menu','active-play','boss','boss-phase2','boss-phase3','paused','gameover','victory','ultimate-rin','ultimate-golem','ultimate-ryu'];if(!states.includes(name))throw new Error(`Unknown state ${name}`);
      while(!ready)await new Promise(r=>setTimeout(r,40));
      screenshotPaused=false;
      if(name==='menu'){menu();return{state:name};}
      selectHero(name.startsWith('ultimate-')?name.slice(9) as HeroId:'rin');startGame();
      advance(name.startsWith('boss')?74:18,{},true);
      if(name==='boss-phase2'||name==='boss-phase3'){const boss=engine.state.enemies.find(e=>e.kind==='boss')!;boss.hp=boss.maxHp*(name==='boss-phase2'?.6:.3);boss.shotTimer=0;advance(1,{},true);}
      if(name.startsWith('ultimate-')){engine.step(1/120,{x:0,y:0,focus:false,charge:false,ultimate:true});for(const e of engine.state.events.splice(0))event(e);}
      if(name==='paused')togglePause();
      if(name==='gameover'){engine.state.player.hp=0;engine.state.phase='gameover';syncPhase();}
      if(name==='victory'){engine.state.bossDefeated=true;engine.state.phase='victory';syncPhase();}
      $('stage-intro').classList.add('hidden');$('warning').classList.add('hidden');updateHud();
      return{state:name};
    },
    setPausedForScreenshot:(value:boolean)=>{screenshotPaused=value;},
    setReducedMotion:(value:boolean)=>{view.reducedMotion=value;reducedMotion=value;updateSettings();},
    hideDebugUi:()=>{},
    advance,
    getState:()=>structuredClone(engine.state),
    getAudio:()=>({state:audio.context?.state,active:audio.active,muted:audio.muted}),
  };
}
