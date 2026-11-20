import './styles.css';
import { Engine, DASH_MAX, DASH_RECHARGE } from './engine';
import { GameRenderer } from './renderer';
import { AudioSystem } from './audio';
import { bindRanking } from './ranking';
import { STAGES } from './stages';
import { HEROES, HEIGHT, GAUGE_PER_STOCK, GAUGE_MAX, heroDef, type HeroId, type Difficulty, type InputIntent, type GameEvent } from './types';

const icons={sound:'<path d="m11 5-6 4H2v6h3l6 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',muted:'<path d="m11 5-6 4H2v6h3l6 4V5Z"/><path d="m16 9 6 6m0-6-6 6"/>',
  full:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',exit:'<path d="M3 8h5V3m8 0v5h5M3 16h5v5m8 0v-5h5"/>',pause:'<path d="M8 5v14M16 5v14"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3c-1 .5-1 1-1 2m0 3h.01"/>',arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',
  rank:'<path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4a3 3 0 0 0 3 4m10-4h3a3 3 0 0 1-3 4"/>',back:'<path d="M20 12H5m6-6-6 6 6 6"/>'};
const icon=(key:keyof typeof icons)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg>`;
const asset=(name:string)=>`${import.meta.env.BASE_URL}assets/${name}`;
const saved=(key:string,fallback:string)=>{try{return localStorage.getItem(key)||fallback;}catch{return fallback;}};
const save=(key:string,value:string)=>{try{localStorage.setItem(key,value);}catch{/* Local settings are optional. */}};
const params=new URLSearchParams(location.search),qaMode=params.get('qa')==='1';
const pad=(n:number)=>String(Math.round(n)).padStart(7,'0');
const MARKS=['花','鉄','拳'];

let selected:HeroId=(saved('cheonroe-hero','rin') as HeroId),difficulty:Difficulty=(saved('cheonroe-difficulty','normal') as Difficulty),chosenStage=0;
if(!HEROES.some(h=>h.id===selected))selected='rin';if(difficulty!=='normal'&&difficulty!=='story')difficulty='normal';
let best=Number(saved('cheonroe-best','0'))||0,ready=false,lastPhase='menu',screenshotPaused=false,lastStamp=0,accumulator=0,hudAt=0;
const keys=new Set<string>();
let dragDX=0,dragDY=0,touchCharge=false,dashPending=false,ultimatePending=false,touchFocus=false;
const engine=new Engine(20261120),audio=new AudioSystem();
audio.muted=saved('cheonroe-muted','false')==='true';
const touch=matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0;
document.body.classList.toggle('touch-device',touch);

document.querySelector<HTMLDivElement>('#app')!.innerHTML=`
<div id="stage-host" class="stage-host"></div>
<div id="world-labels" class="world-labels" aria-hidden="true"></div>
<div id="hud" class="hud hidden" aria-label="전투 정보">
 <div class="hud-left">
  <div class="pilot"><span class="pilot-seal" id="pilot-seal">花</span><div><span class="pilot-name" id="pilot-name">린</span><div id="lives" class="lives" aria-label="남은 목숨"></div></div><span class="power" id="power">LV 1</span></div>
  <div class="meter ult-meter"><span class="meter-label">必殺 <b id="ult-name">홍련만개</b></span><div class="gauge"><i class="gauge-fill" id="gauge-fill"></i><i class="tick" style="left:33.3%"></i><i class="tick" style="left:66.6%"></i></div><b class="stock" id="gauge-stock">×1</b></div>
  <div class="meter"><span class="meter-label">회피</span><div id="dash-pips" class="dash-pips"></div><span class="meter-label">차지</span><div class="charge"><i id="charge-fill"></i></div></div>
 </div>
 <div class="hud-center"><div class="stage-line"><span id="stage-num">第一章</span><strong id="stage-name">붉은 달의 계곡</strong></div><div class="stage-progress"><i id="stage-fill"></i></div></div>
 <div class="hud-right"><div class="score"><span>SCORE</span><b id="score">0000000</b><small>HI <b id="hi">0000000</b></small></div>
  <div class="hud-buttons"><button id="pause" class="icon-btn" aria-label="일시 정지">${icon('pause')}</button><button id="fullscreen" class="icon-btn fs-btn" aria-label="전체 화면">${icon('full')}</button></div></div>
 <div id="boss-hud" class="boss-hud hidden"><div class="boss-names"><span id="boss-hanja"></span><strong id="boss-title"></strong><span id="boss-phase" class="boss-phase"></span></div><div class="boss-track"><i id="boss-fill"></i></div><div id="attack-name" class="attack-name"></div></div>
 <div id="combo" class="combo hidden"><strong>0</strong><span>CHAIN</span></div>
 <div class="graze-chip"><span>스친 탄</span><b id="graze">0</b></div>
</div>
<div id="stage-intro" class="stage-intro hidden"><small id="intro-num">第一章</small><h2 id="intro-name">붉은 달의 계곡</h2><span id="intro-sub"></span></div>
<div id="warning" class="warning hidden"><span>警告</span><strong id="warning-name">수호신 접근</strong><small>KEEP YOUR EYES ON THE GAPS</small></div>
<div id="clear-panel" class="clear-panel hidden"><small>CHAPTER CLEAR</small><h2 id="clear-name"></h2><p id="clear-bonus"></p><span id="clear-detail"></span></div>
<div id="ultimate-cut" class="ultimate-cut hidden"><img id="ultimate-portrait" alt=""><div><small id="ultimate-en"></small><strong id="ultimate-name"></strong><span>敵弾消去 · 탄막이 금화로</span></div></div>
<div id="notification" class="notification hidden" aria-live="polite"></div>
<div id="touch-controls" class="touch-controls hidden">
 <button id="touch-focus" class="touch-btn small" aria-pressed="false">집중</button>
 <div class="touch-cluster"><button id="touch-ult" class="touch-btn ult">필살<small id="touch-stock">×1</small></button><button id="touch-charge" class="touch-btn">차지</button><button id="touch-dash" class="touch-btn dash">회피</button></div>
</div>
<section id="menu" class="menu" aria-labelledby="title">
 <div class="menu-top"><a class="back-link" href="../">${icon('back')}<span>게임 목록</span></a><div class="menu-tools"><button class="tool-btn" id="open-ranking">${icon('rank')}<span>랭킹</span></button><button class="icon-btn" id="sound" aria-label="소리">${icon('sound')}</button><button class="icon-btn" id="help" aria-label="조작 방법">${icon('help')}</button><button class="icon-btn fs-btn" id="menu-fullscreen" aria-label="전체 화면">${icon('full')}</button></div></div>
 <div class="menu-body">
  <div class="title-block"><span class="seal">天<br>雷</span><div><p class="eyebrow">JP MATH LAB ORIGINAL SHOOTER</p><h1 id="title">천뢰 <i>철화전선</i></h1><p class="tagline">다섯 개의 전장, 다섯의 수호신. 탄막 사이의 길을 읽어라.</p></div></div>
  <div class="hero-row" role="group" aria-label="전사 선택">${HEROES.map((h,i)=>`
   <button class="hero-card" data-hero="${h.id}" aria-pressed="false" style="--hero:${h.color}">
    <span class="hero-mark">${MARKS[i]}</span><img src="${asset(h.asset)}" alt="${h.epithet} ${h.name}" draggable="false">
    <span class="hero-info"><span class="hero-role">${h.role}</span><strong>${h.name}<small>${h.english}</small></strong><span class="hero-ult">必殺 ${h.ultimate}</span></span>
   </button>`).join('')}</div>
  <div class="deploy">
   <div class="hero-copy"><b id="chosen-quote"></b><span id="chosen-ability"></span></div>
   <div class="mode" role="group" aria-label="난이도"><button data-difficulty="normal">아케이드<small>목숨 3 · 1장부터</small></button><button data-difficulty="story">수련<small>목숨 5 · 장 선택</small></button></div>
   <div class="chapters" id="chapters" role="group" aria-label="시작할 장">${STAGES.map((s,i)=>`<button data-stage="${i}" title="${s.chapter} ${s.name}"><span>${s.hanja}</span><small>${s.chapter}</small></button>`).join('')}</div>
   <button id="start" class="start" disabled><span id="start-label">전장 준비 중</span>${icon('arrow')}</button>
  </div>
  <p class="menu-foot"><span>최고 기록 <b id="best">0000000</b></span><span class="key-hint"><kbd>방향키</kbd> 이동 <kbd>Shift</kbd> 집중 <kbd>C</kbd> 회피 <kbd>Z</kbd> 차지 <kbd>X</kbd> 필살 <kbd>F</kbd> 전체화면</span></p>
 </div>
</section>
<div id="overlay" class="game-overlay hidden"><div class="result-panel"><p class="eyebrow" id="result-eyebrow"></p><h2 id="result-title"></h2><p id="result-copy"></p><div id="result-stats" class="result-stats"></div>
 <div class="result-actions"><button id="resume" class="primary hidden">전장으로 돌아가기 ${icon('arrow')}</button><button id="retry" class="primary">다시 출격 ${icon('arrow')}</button><button id="result-ranking" class="result-rank" aria-haspopup="dialog">점수 등록 · 랭킹</button></div>
 <button id="return" class="text-btn">전사 다시 선택</button></div></div>
<div id="rotate-hint" class="rotate-hint"><span>⟲</span>가로로 돌려 주세요</div>
<dialog id="help-dialog"><button id="help-close" class="icon-btn dialog-close" aria-label="도움말 닫기">${icon('close')}</button><p class="eyebrow">FIELD MANUAL</p><h2>탄막 속에도 길은 있다.</h2>
 <p class="help-lead">사격은 자동입니다. 피하는 데 집중하세요. 판정은 전사 가슴의 <b>작은 흰 점</b> 하나뿐입니다.</p>
 <dl><div><dt>이동</dt><dd>방향키 / WASD · 모바일은 화면 아무 곳이나 드래그(손가락은 전사를 가리지 않아요)</dd></div>
 <div><dt>집중</dt><dd>Shift를 누르는 동안 천천히 움직이고 스침 범위가 보입니다. 린은 부채탄이 한 줄로 모여 보스에게 강해집니다.</dd></div>
 <div><dt>회피</dt><dd>C(또는 K) · 이동 방향으로 순간 돌진하며 잠깐 무적. 2회 저장, 1.5초마다 회복. 탄을 아슬아슬하게 넘기면 <b>완벽 회피</b> — 시간이 느려지고 회피가 바로 돌아옵니다.</dd></div>
 <div><dt>스침</dt><dd>탄이 몸 가까이 스치면 점수와 필살 게이지가 찹니다.</dd></div>
 <div><dt>차지</dt><dd>Z를 누르고 있다가 떼면 강한 공격. 적에게 바짝 붙으면 근접 공격이 자동으로 나갑니다.</dd></div>
 <div><dt>필살기</dt><dd>X / Space · 게이지 100마다 1회. 화면의 탄을 모두 금화로 바꾸고 잠시 무적.</dd></div></dl>
 <p class="manual-note">아케이드: 목숨 3, 1장부터 끝까지 · 수련: 목숨 5, 느린 탄, 원하는 장부터<br>P 일시 정지 · F 전체 화면 · 한 장은 약 2분, 다섯 장을 모두 돌파하면 클리어</p>
 <button id="help-play" class="primary">알겠어 ${icon('arrow')}</button></dialog>`;

const $=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
const view=new GameRenderer($('stage-host'));
view.showHitboxes=params.get('hitbox')==='1';
const ranking=bindRanking({getSelection:()=>({hero:selected,difficulty}),canPublish:!qaMode,beforeOpen:()=>{const wasPlaying=engine.state.phase==='playing';if(wasPlaying)togglePause();return()=>{if(wasPlaying&&engine.state.phase==='paused')togglePause();};}});
$('open-ranking').onclick=ranking.open;$('result-ranking').onclick=ranking.open;
let reducedMotion=saved('cheonroe-motion',String(view.reducedMotion))==='true';view.reducedMotion=reducedMotion;

function worldWidth(){return Math.max(1300,Math.min(1900,HEIGHT*innerWidth/Math.max(1,innerHeight)));}
function syncWorld(){const w=worldWidth();engine.setWorld(w);view.setWorld(engine.W);}
syncWorld();addEventListener('resize',syncWorld);

function updateSettings(){
  $('sound').innerHTML=icon(audio.muted?'muted':'sound');$('sound').setAttribute('aria-label',audio.muted?'소리 켜기':'소리 끄기');
  const fs=!!document.fullscreenElement;document.querySelectorAll('.fs-btn').forEach(b=>{b.innerHTML=icon(fs?'exit':'full');b.setAttribute('aria-label',fs?'전체 화면 끝내기':'전체 화면');});
  document.documentElement.classList.toggle('reduced-motion',reducedMotion);
}
updateSettings();
document.addEventListener('fullscreenchange',()=>{updateSettings();if(!document.fullscreenElement&&engine.state.phase==='playing')togglePause();});
$('sound').onclick=()=>{audio.setMuted(!audio.muted);save('cheonroe-muted',String(audio.muted));updateSettings();};
async function enterFullscreen(){
  if(document.fullscreenElement||!document.documentElement.requestFullscreen)return;
  try{await document.documentElement.requestFullscreen({navigationUI:'hide'});}catch{/* iOS Safari: the CSS layout already fills the screen. */}
  try{await (screen.orientation as ScreenOrientation&{lock?:(o:string)=>Promise<void>}).lock?.('landscape');}catch{/* Desktop browsers refuse orientation locks. */}
}
function toggleFullscreen(){if(document.fullscreenElement)void document.exitFullscreen();else void enterFullscreen();}
$('fullscreen').onclick=toggleFullscreen;$('menu-fullscreen').onclick=toggleFullscreen;
let helpWasPlaying=false;
function openHelp(){helpWasPlaying=engine.state.phase==='playing';if(helpWasPlaying)togglePause();$<HTMLDialogElement>('help-dialog').showModal();}
function closeHelp(){$<HTMLDialogElement>('help-dialog').close();if(helpWasPlaying&&engine.state.phase==='paused')togglePause();helpWasPlaying=false;}
$('help').onclick=openHelp;$('help-close').onclick=closeHelp;$('help-play').onclick=closeHelp;
$('help-dialog').addEventListener('cancel',e=>{e.preventDefault();closeHelp();});

function selectHero(id:HeroId){
  selected=id;save('cheonroe-hero',id);const h=heroDef(id);
  document.querySelectorAll<HTMLButtonElement>('[data-hero]').forEach(c=>{const on=c.dataset.hero===id;c.classList.toggle('selected',on);c.setAttribute('aria-pressed',String(on));});
  $('chosen-quote').textContent=h.description;$('chosen-ability').textContent=h.ability;document.documentElement.style.setProperty('--accent',h.color);
}
function selectDifficulty(d:Difficulty){
  difficulty=d;save('cheonroe-difficulty',d);
  document.querySelectorAll<HTMLButtonElement>('[data-difficulty]').forEach(b=>{const on=b.dataset.difficulty===d;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
  $('chapters').classList.toggle('locked',d==='normal');if(d==='normal')chosenStage=0;selectStage(chosenStage);
}
function selectStage(i:number){
  chosenStage=difficulty==='normal'?0:i;
  document.querySelectorAll<HTMLButtonElement>('[data-stage]').forEach(b=>{const on=Number(b.dataset.stage)===chosenStage;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));b.disabled=difficulty==='normal'&&b.dataset.stage!=='0';});
  if(engine.state.phase==='menu'){engine.state.stage=chosenStage;}
}
document.querySelectorAll<HTMLButtonElement>('[data-hero]').forEach(c=>c.onclick=()=>selectHero(c.dataset.hero as HeroId));
document.querySelectorAll<HTMLButtonElement>('[data-difficulty]').forEach(b=>b.onclick=()=>selectDifficulty(b.dataset.difficulty as Difficulty));
document.querySelectorAll<HTMLButtonElement>('[data-stage]').forEach(b=>b.onclick=()=>selectStage(Number(b.dataset.stage)));
selectHero(selected);selectDifficulty(difficulty);
$('best').textContent=pad(best);$('hi').textContent=pad(best);

function clearInputs(){keys.clear();dragDX=0;dragDY=0;touchCharge=false;dashPending=false;ultimatePending=false;movePointer=null;document.querySelectorAll('.touch-btn.pressed').forEach(el=>el.classList.remove('pressed'));}
let introUntil=0,warningUntil=0,cutUntil=0,clearUntil=0,notifyAt=0;
function clearOverlays(){for(const id of ['stage-intro','warning','ultimate-cut','notification','clear-panel'])$(id).classList.add('hidden');introUntil=warningUntil=cutUntil=clearUntil=notifyAt=0;$('world-labels').replaceChildren();}
function startGame(){
  if(!ready)return;clearInputs();clearOverlays();void enterFullscreen();syncWorld();
  engine.start(selected,difficulty,chosenStage);view.reset();audio.reset();void audio.unlock();
  document.body.classList.add('in-game');$('menu').classList.add('hidden');$('hud').classList.remove('hidden');$('overlay').classList.add('hidden');
  $('touch-controls').classList.toggle('hidden',!touch);
  lastPhase='playing';screenshotPaused=false;accumulator=0;
  const h=heroDef(selected);$('pilot-name').textContent=`${h.name} · ${h.epithet}`;$('pilot-seal').textContent=MARKS[HEROES.indexOf(h)];$('ult-name').textContent=h.ultimate;
  for(const e of engine.state.events.splice(0))onEvent(e);
  updateHud();$('start').blur();
}
$('start').onclick=startGame;$('retry').onclick=startGame;
function menu(){
  clearInputs();clearOverlays();engine.state.phase='menu';engine.state.stage=chosenStage;audio.setActive(false);view.reset();
  document.body.classList.remove('in-game');$('menu').classList.remove('hidden');$('hud').classList.add('hidden');$('overlay').classList.add('hidden');$('touch-controls').classList.add('hidden');lastPhase='menu';
}
$('return').onclick=menu;
function togglePause(){
  const s=engine.state;if(s.phase!=='playing'&&s.phase!=='paused')return;
  const paused=s.phase==='playing';engine.pause(paused);clearInputs();audio.setActive(!paused);syncPhase();
}
$('pause').onclick=togglePause;$('resume').onclick=togglePause;

const handled=new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyZ','KeyX','KeyC','KeyK','ShiftLeft','ShiftRight','KeyP','Escape','KeyW','KeyA','KeyS','KeyD','KeyF']);
addEventListener('keydown',e=>{
  if($<HTMLDialogElement>('help-dialog').open||ranking.isOpen)return;
  const playing=engine.state.phase==='playing';
  if(engine.state.phase!=='menu'&&handled.has(e.code))e.preventDefault();
  if(!e.repeat&&e.code==='KeyF'){toggleFullscreen();return;}
  if(!e.repeat&&(e.code==='KeyP'||e.code==='Escape')){togglePause();return;}
  if(!e.repeat&&playing&&(e.code==='KeyX'||e.code==='Space'))ultimatePending=true;
  if(!e.repeat&&playing&&(e.code==='KeyC'||e.code==='KeyK'))dashPending=true;
  if(engine.state.phase==='menu'&&e.code==='Enter'){if(!(e.target instanceof HTMLElement)||!e.target.closest('button,a,input,select,textarea'))startGame();return;}
  if((engine.state.phase==='gameover'||engine.state.phase==='victory')&&e.code==='KeyR'){startGame();return;}
  keys.add(e.code);
});
addEventListener('keyup',e=>keys.delete(e.code));
addEventListener('blur',()=>{clearInputs();if(engine.state.phase==='playing')togglePause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInputs();if(engine.state.phase==='playing')togglePause();}});

// Relative drag: the finger can rest anywhere, so it never covers the character.
const host=$('stage-host');let movePointer:number|null=null,lastX=0,lastY=0;
host.addEventListener('pointerdown',e=>{if(engine.state.phase!=='playing')return;e.preventDefault();movePointer=e.pointerId;host.setPointerCapture(e.pointerId);lastX=e.clientX;lastY=e.clientY;void audio.unlock();});
host.addEventListener('pointermove',e=>{if(movePointer!==e.pointerId)return;const k=view.worldPerPixel()*(e.pointerType==='mouse'?1:1.25);dragDX+=(e.clientX-lastX)*k;dragDY+=(e.clientY-lastY)*k;lastX=e.clientX;lastY=e.clientY;});
for(const name of ['pointerup','pointercancel','lostpointercapture'])host.addEventListener(name,e=>{if((e as PointerEvent).pointerId===movePointer)movePointer=null;});
function holdButton(id:string,on:(down:boolean)=>void){const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();b.setPointerCapture(e.pointerId);on(true);b.classList.add('pressed');});for(const name of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(name,()=>{on(false);b.classList.remove('pressed');});}
holdButton('touch-charge',v=>touchCharge=v);
holdButton('touch-dash',v=>{if(v)dashPending=true;});
holdButton('touch-ult',v=>{if(v)ultimatePending=true;});
$('touch-focus').onclick=()=>{touchFocus=!touchFocus;$('touch-focus').setAttribute('aria-pressed',String(touchFocus));};

function notice(text:string,duration=1400){$('notification').textContent=text;$('notification').classList.remove('hidden');notifyAt=performance.now()+duration;}
function label(x:number,y:number,text:string,cls=''){
  const box=$('world-labels');if(box.childElementCount>18)return;
  const {left,top}=view.toScreen(x,y);const span=document.createElement('span');span.className=`floating ${cls}`;span.textContent=text;
  span.style.left=`${left*100}%`;span.style.top=`${top*100}%`;box.append(span);setTimeout(()=>span.remove(),cls?1100:800);
}
function retrigger(el:HTMLElement){el.classList.remove('show');void el.offsetWidth;el.classList.add('show');}
function onEvent(e:GameEvent){
  const s=engine.state;view.event(e,s);audio.event(e,s.hero,s.stage);
  switch(e.kind){
    case 'kill':if(e.value&&(e.big||Math.random()<.35))label(e.x,e.y,`${e.text?e.text+'  ':''}+${e.value.toLocaleString()}`);break;
    case 'pickup':if(e.text)label(e.x,e.y-30,e.text,'item');break;
    case 'perfect':label(e.x,e.y-70,'완벽 회피!','perfect');break;
    case 'hurt':notice(s.player.hp>0?'피격! 잠시 무적 · 흰 점만 피하면 돼요':'격추',1300);break;
    case 'extend':notice('목숨 +1  EXTEND',1600);break;
    case 'stage':{
      const st=STAGES[e.value??0];$('intro-num').textContent=st.chapter;$('intro-name').textContent=st.name;$('intro-sub').textContent=st.sub;
      $('stage-num').textContent=st.chapter;$('stage-name').textContent=st.name;$('clear-panel').classList.add('hidden');
      $('stage-intro').classList.remove('hidden');retrigger($('stage-intro'));introUntil=performance.now()+3000;break;}
    case 'warning':$('warning-name').textContent=`${e.text} · ${e.sub}`;$('warning').classList.remove('hidden');warningUntil=performance.now()+3400;break;
    case 'attack':case 'phase':{const el=$('attack-name');el.textContent=e.text||'';retrigger(el);if(e.kind==='phase')notice('수호신의 형태가 바뀐다',1100);break;}
    case 'boss':{const el=$('attack-name');el.textContent=s.attackName;retrigger(el);break;}
    case 'stageclear':$('clear-name').textContent=e.text||'';$('clear-bonus').textContent=`+${(e.value??0).toLocaleString()}`;$('clear-detail').textContent=e.sub||'';$('clear-panel').classList.remove('hidden');retrigger($('clear-panel'));clearUntil=performance.now()+3800;break;
    case 'ultimate':{
      $('stage-intro').classList.add('hidden');introUntil=0;
      const h=heroDef(s.hero);$('ultimate-en').textContent=h.ultimateEn;$('ultimate-name').textContent=h.ultimate;$('ultimate-portrait').setAttribute('src',asset(h.asset));
      $('ultimate-cut').classList.remove('hidden');retrigger($('ultimate-cut'));cutUntil=performance.now()+(reducedMotion?700:1250);break;}
  }
}
function syncPhase(){
  const s=engine.state;if(s.phase===lastPhase)return;lastPhase=s.phase;
  const overlay=$('overlay');
  if(s.phase==='playing'){overlay.classList.add('hidden');audio.setActive(true);return;}
  if(s.phase==='menu')return;
  overlay.classList.remove('hidden');const paused=s.phase==='paused',won=s.phase==='victory';
  $('result-eyebrow').textContent=paused?'PAUSE · 잠시 숨 고르기':won?'ALL CHAPTERS CLEAR · 天雷 完':`${STAGES[s.stage].chapter} · ${STAGES[s.stage].name}`;
  $('result-title').textContent=paused?'멈춘 시간.':won?'하늘에 고요가 돌아왔다.':'다시, 탄막 속으로.';
  $('result-copy').textContent=paused?'움직임을 읽으면, 길이 보인다.':won?'다섯 수호신을 모두 쓰러뜨렸습니다.':'회피(C)로 탄 사이를 뚫고, 위험하면 필살기로 탄막을 지우세요.';
  $('resume').classList.toggle('hidden',!paused);$('retry').classList.toggle('hidden',paused);$('result-stats').classList.toggle('hidden',paused);
  if(!paused){
    ranking.record(s);
    $('result-stats').innerHTML=`<div><span>SCORE</span><strong>${s.score.toLocaleString()}</strong></div><div><span>도달</span><strong>${s.stats.stagesCleared>=STAGES.length?'완주':`${s.stage+1}장`}</strong></div><div><span>격파</span><strong>${s.stats.kills}</strong></div><div><span>스친 탄</span><strong>${s.graze}</strong></div><div><span>완벽 회피</span><strong>${s.stats.perfects}</strong></div>`;
    if(s.score>best){best=s.score;save('cheonroe-best',String(best));$('best').textContent=pad(best);$('hi').textContent=pad(best);}
    if(won)setTimeout(()=>{if(engine.state.phase==='victory')audio.setActive(false);},2400);else audio.setActive(false);
  }
}
function updateHud(){
  const s=engine.state,p=s.player;
  $('score').textContent=pad(s.score);if(s.score>best)$('hi').textContent=pad(s.score);
  $('lives').innerHTML=Array.from({length:Math.max(p.maxHp,p.hp)},(_,i)=>`<span class="life ${i>=p.hp?'lost':''}">◆</span>`).join('');$('lives').setAttribute('aria-label',`남은 목숨 ${p.hp}개`);
  $('power').textContent=p.power>=4?'LV MAX':`LV ${p.power}`;
  $('gauge-fill').style.width=`${p.gauge/GAUGE_MAX*100}%`;const stock=Math.floor(p.gauge/GAUGE_PER_STOCK);$('gauge-stock').textContent=`×${stock}`;$('gauge-stock').classList.toggle('ready',stock>0);
  $('touch-stock').textContent=`×${stock}`;$('touch-ult').classList.toggle('ready',stock>0&&p.ultimateTimer<=0);
  $('dash-pips').innerHTML=Array.from({length:DASH_MAX},(_,i)=>{const fill=i<p.dashCharges?1:i===p.dashCharges?1-p.dashRecharge/DASH_RECHARGE:0;return `<i style="--f:${fill}" class="${i<p.dashCharges?'full':''}"></i>`;}).join('');
  $('touch-dash').classList.toggle('ready',p.dashCharges>0);
  $('charge-fill').style.width=`${p.charge/1.2*100}%`;
  $('graze').textContent=String(s.graze);
  const st=STAGES[s.stage];$('stage-fill').style.width=`${Math.min(100,s.bossDefeated?100:s.stageTime/st.bossAt*100)}%`;
  const boss=s.enemies.find(e=>e.boss);$('boss-hud').classList.toggle('hidden',!boss);
  if(boss){$('boss-fill').style.width=`${Math.max(0,boss.hp/boss.maxHp*100)}%`;$('boss-hanja').textContent=st.boss.hanja;$('boss-title').textContent=`${st.boss.name} · ${st.boss.title}`;
    $('boss-phase').textContent='◆'.repeat(Math.max(0,s.bossPhases-boss.phase-1))+'◇'.repeat(Math.min(s.bossPhases,boss.phase+1));}
  $('combo').classList.toggle('hidden',s.combo<5);$('combo').querySelector('strong')!.textContent=String(s.combo);
}

function frame(now:number){
  const dt=Math.min(.05,(now-lastStamp)/1000||.016);lastStamp=now;
  const playing=engine.state.phase==='playing'&&!screenshotPaused;
  const input:InputIntent={
    x:Number(keys.has('ArrowRight')||keys.has('KeyD'))-Number(keys.has('ArrowLeft')||keys.has('KeyA')),
    y:Number(keys.has('ArrowDown')||keys.has('KeyS'))-Number(keys.has('ArrowUp')||keys.has('KeyW')),
    focus:keys.has('ShiftLeft')||keys.has('ShiftRight')||touchFocus,charge:keys.has('KeyZ')||touchCharge,
    ultimate:keys.has('KeyX')||keys.has('Space')||ultimatePending,dash:keys.has('KeyC')||keys.has('KeyK')||dashPending,
    drag:{dx:dragDX,dy:dragDY}};
  if(playing){
    accumulator+=dt;let stepped=false;
    while(accumulator>=1/120){engine.step(1/120,input);accumulator-=1/120;if(!stepped){stepped=true;input.drag={dx:0,dy:0};dragDX=0;dragDY=0;}}
    if(stepped&&engine.state.hitstop<=0){ultimatePending=false;dashPending=false;}
    audio.tick(dt,engine.state);
  }else{accumulator=0;dragDX=0;dragDY=0;}
  for(const e of engine.state.events.splice(0))onEvent(e);
  if(now-hudAt>60){updateHud();hudAt=now;}syncPhase();
  if(introUntil&&now>introUntil){$('stage-intro').classList.add('hidden');introUntil=0;}
  if(warningUntil&&now>warningUntil){$('warning').classList.add('hidden');warningUntil=0;}
  if(cutUntil&&now>cutUntil){$('ultimate-cut').classList.add('hidden');cutUntil=0;}
  if(clearUntil&&now>clearUntil){$('clear-panel').classList.add('hidden');clearUntil=0;}
  if(notifyAt&&now>notifyAt){$('notification').classList.add('hidden');notifyAt=0;}
  view.render(engine.state,playing||engine.state.phase==='menu'?dt:0,input.focus,screenshotPaused||engine.state.phase==='paused');
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

async function init(){
  try{await view.load(n=>{$('start-label').textContent=`전장 준비 ${Math.round(n*100)}%`;});ready=true;$<HTMLButtonElement>('start').disabled=false;$('start-label').textContent='출격';}
  catch(error){$('start-label').textContent='새로고침해 다시 불러오기';$('chosen-ability').textContent='원화를 불러오지 못했습니다. 연결을 확인하고 새로고침해 주세요.';console.error(error);}
}
void init();

// Inspection and deterministic captures are opt-in and never appear in normal play.
if(qaMode){
  const win=window as unknown as Record<string,unknown>;
  win.__CHEONROE_VIEW__=view;
  win.__THREE_GAME_DIAGNOSTICS__={get renderer(){return view.renderer.info;},get state(){return view.diagnostics(engine.state).state;},get performance(){return view.diagnostics(engine.state).performance;}};
  const advance=(seconds:number,intent:Partial<InputIntent>={},invulnerable=false)=>{
    const empty:InputIntent={x:0,y:0,focus:false,charge:false,ultimate:false,dash:false,...intent};
    for(let t=0;t<seconds;t+=1/120){if(invulnerable)engine.state.player.invulnerable=Math.max(engine.state.player.invulnerable,.5);engine.step(1/120,empty);if(engine.state.events.length>400)engine.state.events.splice(0,300);}
    for(const e of engine.state.events.splice(0))if(['stage','boss','attack','phase','warning'].includes(e.kind))onEvent(e);updateHud();syncPhase();
  };
  win.__THREE_GAME_TEST_HOOKS__={
    seed:(n:number)=>engine.seed(n),
    async setState(name:string,opts:{hero?:HeroId;stage?:number}={}){
      while(!ready)await new Promise(r=>setTimeout(r,40));
      screenshotPaused=false;
      if(name==='menu'){menu();return{state:name};}
      const stage=opts.stage??0;selectHero(opts.hero??(name.startsWith('ultimate-')?name.slice(9) as HeroId:'rin'));
      selectDifficulty(stage>0?'story':'normal');selectStage(stage);startGame();
      advance(name.startsWith('boss')?STAGES[stage].bossAt+4:16,{},true);
      if(name==='boss-phase2'||name==='boss-phase3'){const boss=engine.state.enemies.find(e=>e.boss)!;boss.hp=boss.maxHp*(name==='boss-phase2'?.6:.3)+1;advance(.1,{},true);boss.hp-=2;engine.state.shots.push({id:9e6,kind:'shot',x:boss.x,y:boss.y,vx:1,vy:0,r:200,damage:1,age:0,life:1,pierce:false});advance(2.5,{},true);}
      if(name.startsWith('ultimate-')){engine.state.player.gauge=300;engine.step(1/120,{x:0,y:0,focus:false,charge:false,ultimate:true,dash:false});for(const e of engine.state.events.splice(0))onEvent(e);}
      if(name==='paused')togglePause();
      if(name==='gameover'){engine.state.player.hp=0;engine.state.phase='gameover';syncPhase();}
      if(name==='victory'){engine.state.phase='victory';syncPhase();}
      $('stage-intro').classList.add('hidden');$('warning').classList.add('hidden');updateHud();
      return{state:name};
    },
    setPausedForScreenshot:(value:boolean)=>{screenshotPaused=value;},
    setReducedMotion:(value:boolean)=>{view.reducedMotion=value;reducedMotion=value;updateSettings();},
    showHitboxes:(value:boolean)=>{view.showHitboxes=value;},
    /** Render frames synchronously (a hidden tab throttles requestAnimationFrame). */
    renderFrames:(n=30,play=false,intent:Partial<InputIntent>={})=>{for(let i=0;i<n;i++){if(play){engine.step(1/60,{x:0,y:0,focus:false,charge:false,ultimate:false,dash:false,...intent});for(const e of engine.state.events.splice(0))onEvent(e);}view.render(engine.state,1/60,!!intent.focus,false);}updateHud();},
    defeatBoss:()=>{const b=engine.state.enemies.find(e=>e.boss);if(!b)return false;b.phase=engine.stageDef.boss.phases.length-1;b.shield=0;b.hp=1;engine.state.shots.push({id:9e7,kind:'shot',x:b.x,y:b.y,vx:1,vy:0,r:300,damage:5,age:0,life:1,pierce:false});return true;},
    advance,
    getState:()=>structuredClone(engine.state),
    getAudio:()=>({state:audio.context?.state,active:audio.active,muted:audio.muted}),
  };
}
