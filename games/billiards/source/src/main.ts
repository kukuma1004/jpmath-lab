import './style.css';
import './records.css';
import { SceneManager } from './render/SceneManager';
import { GameManager } from './game/GameManager';
import { AudioManager } from './game/AudioManager';
import type { PredictionRequest, PredictionResponse } from './game/PredictionWorker';
import type { PhysicsEvent, Vec2 } from './physics/types';
import { TABLE } from './physics/config';

const $ = <T extends HTMLElement = HTMLElement>(id: string): T => document.getElementById(id) as T;
const canvas = $<HTMLCanvasElement>('world');
const game = new GameManager();
const audio = new AudioManager();
const settingsKey = 'jpmath-billiards-settings-v1';
interface Settings { autoCamera: boolean; sound: boolean; assist: 'none'|'basic'|'advanced'; quality: 'high'|'low'; reducedMotion: boolean }
const defaults: Settings = { autoCamera: true, sound: false, assist: 'basic', quality: matchMedia('(max-width:800px)').matches ? 'low' : 'high', reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches };
let saved: Partial<Settings> = {};
try { saved = JSON.parse(localStorage.getItem(settingsKey) ?? '{}'); } catch { /* private browsing uses defaults */ }
const settings: Settings = { ...defaults, ...saved };
if (!['none','basic','advanced'].includes(settings.assist)) settings.assist = 'basic';
if (!['low','high'].includes(settings.quality)) settings.quality = defaults.quality;
let scene: SceneManager;
let prediction: Worker | null = null;
let requestId = 0;
let predictionTimer = 0;
let screenshotPaused = false;
let frameCount = 0;
let lastTime = performance.now();
let lastPhase = game.phase;
let aimEngaged = false;
const frameSamples: number[] = [];
const ballNames: Record<string,string> = { white: '흰 공', yellow: '노란 공', red: '빨간 공 1', red2: '빨간 공 2' };
document.body.dataset.started = 'false';
document.body.dataset.sound = 'off';

function saveSettings(): void { try { localStorage.setItem(settingsKey, JSON.stringify(settings)); } catch { /* storage optional */ } }
function soundUI(): void {
  document.body.dataset.sound = audio.enabled ? 'on' : 'off';
  $('sound').setAttribute('aria-label', audio.enabled ? '소리 끄기' : '소리 켜기');
  $('sound').setAttribute('aria-pressed', String(audio.enabled));
  $<HTMLInputElement>('sound-setting').checked = audio.enabled;
}
async function setSound(enabled: boolean): Promise<void> { await audio.setEnabled(enabled); settings.sound = audio.enabled; soundUI(); saveSettings(); }

function setCamera(mode: 'top'|'cue'): void {
  scene.setCamera(mode);
  $('camera-top').setAttribute('aria-pressed', String(mode === 'top'));
  $('camera-cue').setAttribute('aria-pressed', String(mode === 'cue'));
}

function basicGuide(): void {
  const ball = game.engine.balls.find(b => b.id === game.cueBall)!;
  const dx = Math.cos(game.angle), dz = Math.sin(game.angle);
  const halfX = TABLE.width / 2 - TABLE.ballRadius, halfZ = TABLE.height / 2 - TABLE.ballRadius;
  const tx = Math.abs(dx) > 1e-6 ? ((dx > 0 ? halfX : -halfX) - ball.position.x) / dx : 1e5;
  const tz = Math.abs(dz) > 1e-6 ? ((dz > 0 ? halfZ : -halfZ) - ball.position.z) / dz : 1e5;
  const length = Math.max(0, Math.min(.65, tx, tz));
  scene.setGuide([{ ...ball.position }, { x: ball.position.x + dx * length, z: ball.position.z + dz * length }]);
}

function updateAim(): void {
  if (!scene) return;
  scene.setAim(game.cueBall, game.angle, game.power, game.tip);
  scene.setCueVisible((game.canAim || game.phase === 'stroking') && document.body.dataset.started === 'true');
  $('angle-label').textContent = `${((game.angle * 180 / Math.PI % 360 + 360) % 360).toFixed(1)}°`;
  $('power-value').innerHTML = `${Math.round(game.power * 100)}<span>%</span>`;
  const power = $<HTMLInputElement>('power');
  power.value = String(Math.round(game.power * 100));
  power.style.setProperty('--power', `${game.power * 100}%`);
  const dot = $('tip-dot');
  dot.style.left = `${50 + game.tip.x * 50}%`;
  dot.style.top = `${50 - game.tip.y * 50}%`;
  const spin = Math.hypot(game.tip.x, game.tip.y);
  const labels = [game.tip.y > .1 ? '밀기' : game.tip.y < -.1 ? '끌기' : '', game.tip.x > .1 ? '우회전' : game.tip.x < -.1 ? '좌회전' : ''].filter(Boolean);
  $('tip-label').textContent = spin < .1 ? '중앙 · 무회전 타격' : `${labels.join(' + ')} · ${Math.round(spin * 100)}%`;
  $('cue-white').setAttribute('aria-pressed', String(game.cueBall === 'white'));
  $('cue-yellow').setAttribute('aria-pressed', String(game.cueBall === 'yellow'));
  clearTimeout(predictionTimer);
  requestId++;
  if (!game.canAim || settings.assist === 'none') { scene.setGuide([]); return; }
  basicGuide();
  if (settings.assist === 'advanced' && prediction) predictionTimer = window.setTimeout(() => {
    prediction!.postMessage({ requestId, balls: game.engine.snapshot().balls, table: TABLE, shot: game.input } satisfies PredictionRequest);
  }, 70);
}

function recordLog(): void {
  const last = game.lastShot;
  const log = $('contact-log');
  log.replaceChildren();
  $('shot-number').textContent = game.shotCount ? `SHOT ${String(game.shotCount).padStart(2,'0')}` : '첫 샷을 기다리는 중';
  if (!last) { $('record-summary').textContent = '공이 모두 멈추면 접촉 순서를 확인할 수 있습니다.'; $('record-dialog-summary').textContent = $('record-summary').textContent; $('record-dialog-log').replaceChildren(); return; }
  const hits = last.events.filter(e => e.type === 'ball-ball');
  const rails = last.events.filter(e => e.type === 'cushion' && e.ballId === last.input.ballId);
  $('record-summary').textContent = `공 충돌 ${hits.length}회 · 수구 쿠션 ${rails.length}회 · ${last.events.at(-1)?.time.toFixed(1) ?? '0.0'}초\n자유 연습 기록이며 득점 판정은 하지 않습니다.`;
  for (const event of last.events.filter(e => e.type === 'ball-ball' || e.type === 'cushion').slice(0, 30)) {
    const item = document.createElement('li');
    const time = document.createElement('span');
    time.textContent = `${event.time.toFixed(3)}s`;
    const text = document.createElement('span');
    text.textContent = event.type === 'ball-ball' ? `${ballNames[event.ballA] ?? event.ballA} → ${ballNames[event.ballB] ?? event.ballB}` : event.type === 'cushion' ? `${ballNames[event.ballId] ?? event.ballId} · ${['left','right'].includes(event.rail) ? '단' : '장'}쿠션` : '';
    item.append(time, text); log.append(item);
  }
  $('record-dialog-summary').textContent = $('record-summary').textContent;
  $('record-dialog-log').replaceChildren(...[...log.children].map(item => item.cloneNode(true)));
}

function updateUI(): void {
  if (!scene) return;
  const started = game.phase !== 'menu';
  document.body.dataset.started = String(started);
  document.body.dataset.moving = String(game.busy);
  $('welcome').hidden = started;
  $<HTMLButtonElement>('shoot').disabled = !game.canAim;
  $<HTMLButtonElement>('replay').disabled = !game.canAim || !game.lastShot;
  for (const id of ['layout','cue-white','cue-yellow','reset-tip','power','aim-left','aim-right','reset-layout']) ($(id) as HTMLButtonElement | HTMLInputElement | HTMLSelectElement).disabled = !game.canAim;
  $('tip-pad').setAttribute('aria-disabled', String(!game.canAim));
  $('state-label').textContent = game.phase === 'menu' ? '나만의 한 수' : game.phase === 'stroking' ? '타격 준비' : game.phase === 'moving' ? game.replaying ? '이전 샷 재생 중' : '공이 움직이는 중' : '조준 준비';
  $('shoot-label').textContent = game.busy ? game.phase === 'stroking' ? '타격 준비' : '진행 중' : '샷';
  $('shot-banner').textContent = game.phase === 'moving' ? game.replaying ? '이전 샷을 같은 물리 상태에서 재현합니다.' : '공이 모두 멈추면 다음 샷이 열립니다.' : game.phase === 'stroking' ? '한 수에 집중하세요.' : game.lastShot ? '샷을 마쳤습니다. 기록을 확인하고 다음 수를 조준하세요.' : '방향과 당점을 정한 뒤 샷을 눌러 주세요.';
  recordLog();
  updateAim();
}

function resize(): void {
  if (!scene) return;
  const bounds = canvas.getBoundingClientRect();
  scene.resize(bounds.width, bounds.height);
}

function start(): void {
  game.start(); aimEngaged = false; setCamera('top'); resize();
  if (settings.sound) void setSound(true);
}

function anyDialogOpen(): boolean { return ['pause-dialog','help-dialog','record-dialog'].some(id => $<HTMLDialogElement>(id).open); }

function openDialog(id: 'pause-dialog'|'help-dialog'|'record-dialog'): void {
  if (anyDialogOpen()) return;
  game.paused = true; updateUI();
  $<HTMLDialogElement>(id).showModal();
}

function shoot(): void {
  if (game.shoot()) { scene.setGuide([]); void audio.setEnabled(audio.enabled); canvas.focus({ preventScroll: true }); }
}

function setupInput(): void {
  $('start').onclick = start;
  $('shoot').onclick = shoot;
  $('replay').onclick = () => { if (game.replay()) { scene.sync(game.engine.balls); scene.setAim(game.cueBall,game.angle,game.power,game.tip); setCamera('top'); } };
  $('reset-layout').onclick = () => { if (game.canAim) { game.reset(); aimEngaged = false; scene.sync(game.engine.balls); setCamera('top'); } };
  $('camera-top').onclick = () => setCamera('top');
  $('camera-cue').onclick = () => setCamera('cue');
  $('reset-camera').onclick = () => { scene.resetCamera(); setCamera('top'); };
  $('sound').onclick = () => void setSound(!audio.enabled);
  $('menu').onclick = () => openDialog('pause-dialog');
  $('help').onclick = () => openDialog('help-dialog');
  $('open-record').onclick = () => openDialog('record-dialog');
  $('record-done').onclick = () => $<HTMLDialogElement>('record-dialog').close();
  $('resume').onclick = () => $<HTMLDialogElement>('pause-dialog').close();
  $('help-done').onclick = () => $<HTMLDialogElement>('help-dialog').close();
  for (const id of ['pause-dialog','help-dialog','record-dialog']) $<HTMLDialogElement>(id).addEventListener('close', () => { game.paused = false; lastTime = performance.now(); updateUI(); });
  $('new-practice').onclick = () => { game.reset(); aimEngaged = false; $<HTMLDialogElement>('pause-dialog').close(); setCamera('top'); };
  $('back-title').onclick = () => { game.reset(); game.phase = 'menu'; $<HTMLDialogElement>('pause-dialog').close(); updateUI(); setCamera('top'); };
  $('auto-camera').onchange = e => { settings.autoCamera = (e.target as HTMLInputElement).checked; saveSettings(); };
  $('sound-setting').onchange = e => void setSound((e.target as HTMLInputElement).checked);
  $('quality').onchange = e => { settings.quality = (e.target as HTMLSelectElement).value as 'high'|'low'; scene.setQuality(settings.quality); saveSettings(); };
  $('reduce-motion').onchange = e => { settings.reducedMotion = (e.target as HTMLInputElement).checked; scene.setReducedMotion(settings.reducedMotion); saveSettings(); };
  $('layout').onchange = e => { if (!game.canAim) return; game.reset((e.target as HTMLSelectElement).value as typeof game.layout); aimEngaged = false; scene.sync(game.engine.balls); setCamera('top'); };
  for (const cue of ['white','yellow']) $(`cue-${cue}`).onclick = () => { if (game.canAim) { game.cueBall = cue; updateAim(); } };
  $('power').oninput = e => { if (game.canAim) { game.power = Number((e.target as HTMLInputElement).value) / 100; updateAim(); } };
  $('assist').onchange = e => { settings.assist = (e.target as HTMLSelectElement).value as Settings['assist']; saveSettings(); updateAim(); };
  $('reset-tip').onclick = () => { if (game.canAim) { game.tip = { x: 0, y: 0 }; updateAim(); } };
  $('collapse').onclick = () => { const collapsed = document.querySelector('.cue-console')!.classList.toggle('collapsed'); $('collapse').setAttribute('aria-expanded',String(!collapsed)); $('collapse').setAttribute('aria-label',collapsed ? '세부 컨트롤 펼치기' : '세부 컨트롤 접기'); resize(); };
  const engageAim = (): void => { if (!aimEngaged && settings.autoCamera) setCamera('cue'); aimEngaged = true; };
  const nudge = (direction: number, small = false): void => { if (game.canAim) { engageAim(); game.angle += direction * (small ? .0001745329 : .001745329); updateAim(); } };
  $('aim-left').onclick = () => nudge(-1);
  $('aim-right').onclick = () => nudge(1);
  const pad = $('tip-pad');
  const setTip = (x: number, y: number): void => { const len = Math.hypot(x,y); const factor = len > .75 ? .75 / len : 1; game.tip = { x: x * factor, y: y * factor }; updateAim(); };
  const tipPointer = (e: PointerEvent): void => { if (!game.canAim) return; const r = pad.getBoundingClientRect(); setTip((e.clientX-r.left-r.width/2)/(r.width/2),-(e.clientY-r.top-r.height/2)/(r.height/2)); };
  let tipDragging = false;
  pad.onpointerdown = e => { if (!game.canAim) return; tipDragging = true; pad.setPointerCapture(e.pointerId); tipPointer(e); };
  pad.onpointermove = e => { if (tipDragging) tipPointer(e); };
  pad.onpointerup = pad.onpointercancel = pad.onlostpointercapture = () => { tipDragging = false; };
  pad.onkeydown = e => { const delta: Record<string,[number,number]> = { ArrowLeft:[-.025,0], ArrowRight:[.025,0], ArrowUp:[0,.025], ArrowDown:[0,-.025] }; if (delta[e.key] && game.canAim) { e.preventDefault(); setTip(game.tip.x+delta[e.key][0],game.tip.y+delta[e.key][1]); } };
  const pointers = new Map<number,{x:number;y:number}>();
  let lastDistance = 0;
  let rightDrag = false;
  const clearPointers = (): void => { pointers.clear(); lastDistance = 0; rightDrag = false; tipDragging = false; };
  canvas.oncontextmenu = e => e.preventDefault();
  canvas.onpointerdown = e => { if (game.phase === 'menu' || game.paused) return; canvas.focus({ preventScroll:true }); canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}); rightDrag = e.button === 2; if (pointers.size === 2) { const [a,b]=[...pointers.values()]; lastDistance=Math.hypot(a.x-b.x,a.y-b.y); } };
  canvas.onpointermove = e => {
    const previous = pointers.get(e.pointerId); if (!previous) return;
    const dx=e.clientX-previous.x,dy=e.clientY-previous.y;
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if (pointers.size === 2) { const [a,b]=[...pointers.values()]; const dist=Math.hypot(a.x-b.x,a.y-b.y); if (lastDistance) scene.zoom((lastDistance-dist)*7); lastDistance=dist; return; }
    if (rightDrag) scene.orbit(dx,dy);
    else if (game.canAim) { engageAim(); game.angle += dx * (e.shiftKey ? .0003 : .004); updateAim(); }
  };
  const releasePointer=(e:PointerEvent):void=>{pointers.delete(e.pointerId);lastDistance=0;if(!pointers.size)rightDrag=false;};
  canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=releasePointer;
  canvas.addEventListener('wheel',e=>{e.preventDefault();scene.zoom(e.deltaY);},{passive:false});
  window.addEventListener('keydown', e => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target === pad || anyDialogOpen()) return;
    if (e.code === 'Escape') { e.preventDefault(); openDialog('pause-dialog'); return; }
    if (game.phase === 'menu') return;
    if (e.code === 'Space' && e.target instanceof HTMLButtonElement) return;
    if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) shoot(); }
    if (e.code === 'KeyV' && !e.repeat) { e.preventDefault(); setCamera(scene.cameraMode === 'top' ? 'cue' : 'top'); }
    if (e.code === 'KeyR') { scene.resetCamera(); setCamera('top'); }
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') { e.preventDefault(); nudge(e.code === 'ArrowLeft'?-1:1,e.shiftKey); }
  });
  window.addEventListener('blur',clearPointers);
  document.addEventListener('visibilitychange',()=>{ clearPointers(); lastTime=performance.now(); if (document.hidden && game.phase !== 'menu') openDialog('pause-dialog'); });
}

function frame(now: number): void {
  const delta = Math.min((now-lastTime)/1000,.1); lastTime=now;
  if (!screenshotPaused) game.update(delta);
  if (game.phase !== lastPhase) {
    if (game.phase === 'stroking') scene.setCueVisible(true);
    if (game.phase === 'moving') { scene.setCueVisible(false); scene.setStroke(null); if(settings.autoCamera)setCamera('top'); }
    lastPhase=game.phase;
  }
  if (game.phase === 'stroking') scene.setStroke(Math.min(1,game.strokeProgress));
  scene.sync(game.engine.balls);
  scene.update(delta);
  scene.render();
  if (frameSamples.length >= 180) frameSamples.shift();
  if (delta > 0) frameSamples.push(delta*1000);
  frameCount++;
  requestAnimationFrame(frame);
}

function installTestHooks(): void {
  if (!new URLSearchParams(location.search).has('qa')) return;
  const target=window as unknown as Record<string,unknown>;
  Object.defineProperty(target,'__THREE_GAME_DIAGNOSTICS__',{get:()=>({ ...scene.diagnostics(), renderer:scene.diagnostics(), gameState: game.phase, frameCount, frameMs: frameSamples.reduce((a,b)=>a+b,0)/Math.max(1,frameSamples.length), physics: { engine:'dedicated-billiards', timestep:1/240, balls:game.engine.balls.length, energy:game.engine.energy(), settled:game.engine.settled, time:game.engine.time, safetyStops:game.engine.safetyStops }, simulationState:game.engine.snapshot(), shotCount:game.shotCount, contacts:game.lastShot?.events ?? [], paused:game.paused, angle:game.angle, tip:{...game.tip}, power:game.power, predictionWorker:!!prediction })});
  target.__THREE_GAME_TEST_HOOKS__ = {
    async setState(name:string) {
      if (!['active-play','cue-view','spin-view','pause','title'].includes(name)) throw new Error(`Unknown state: ${name}`);
      screenshotPaused=false;
      for(const id of ['pause-dialog','help-dialog','record-dialog']) if($<HTMLDialogElement>(id).open)$<HTMLDialogElement>(id).close();
      game.reset(name === 'spin-view' ? 'spin' : 'opening');
      $<HTMLSelectElement>('layout').value=game.layout;
      if(name==='title'){game.phase='menu';updateUI();}
      scene.sync(game.engine.balls);
      setCamera(name==='cue-view'?'cue':'top');
      if(name==='active-play'){game.shoot();for(let i=0;i<170;i++)game.update(1/240);scene.sync(game.engine.balls);scene.setCueVisible(false);}
      if(name==='spin-view'){game.tip={x:.3,y:-.55};updateAim();}
      if(name==='pause')openDialog('pause-dialog');
      for(let i=0;i<100;i++)scene.update(1/60);
      return {state:name};
    },
    setPausedForScreenshot(value:boolean){screenshotPaused=value;},
    setReducedMotion(value:boolean){scene.setReducedMotion(value);},
    // A deterministic scene has no stochastic simulation or assets; seed is intentionally irrelevant.
    hideDebugUi(){ document.body.classList.add('qa-capture'); }
  };
}

try {
  scene = new SceneManager(canvas,TABLE);
  scene.setQuality(settings.quality);
  scene.setReducedMotion(settings.reducedMotion);
  scene.sync(game.engine.balls);
  $<HTMLInputElement>('auto-camera').checked=settings.autoCamera;
  $<HTMLInputElement>('reduce-motion').checked=settings.reducedMotion;
  $<HTMLSelectElement>('quality').value=settings.quality;
  $<HTMLSelectElement>('assist').value=settings.assist;
  try {
    prediction = new Worker(new URL('./game/PredictionWorker.ts',import.meta.url),{type:'module'});
    prediction.onmessage=({data}:MessageEvent<PredictionResponse>)=>{
      if(data.requestId!==requestId||!game.canAim||settings.assist!=='advanced')return;
      const main=data.paths.find(p=>p.id===game.cueBall)?.points??[];
      const other=data.paths.filter(p=>p.id!==game.cueBall&&p.points.length>1).map(p=>p.points);
      scene.setGuide(main,other);
    };
    prediction.onerror=()=>{prediction?.terminate();prediction=null;settings.assist='basic';$<HTMLSelectElement>('assist').value='basic';updateAim();};
  }catch{ prediction=null; }
  game.onChange=updateUI;
  game.onEvent=e=>audio.play(e);
  game.onFinished=()=>{aimEngaged=false;if(settings.autoCamera)setCamera('top');updateAim();};
  setupInput();
  new ResizeObserver(resize).observe(canvas);
  window.addEventListener('resize',resize);
  resize();updateUI();installTestHooks();requestAnimationFrame(frame);
} catch (error) {
  const el=$('error'); el.hidden=false; el.textContent='3D 화면을 열지 못했습니다. WebGL 2를 지원하는 최신 브라우저에서 다시 열어 주세요.';
  console.error(error);
}
