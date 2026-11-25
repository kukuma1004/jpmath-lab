import './style.css';
import {SceneManager} from './render/SceneManager';
import {GameManager} from './game/GameManager';
import {AudioManager} from './game/AudioManager';
import type {PredictionRequest,PredictionResponse} from './game/PredictionWorker';
import type {AIRequest,AIResponse} from './ai/types';
import type {MatchConfig,Discipline,BreakOption} from './rules/types';
import type {Vec2,BallState,ShotInput} from './physics/types';

import {TABLE} from './physics/config';

import {PhysicsEngine} from './physics/PhysicsEngine';
const $=<T extends HTMLElement=HTMLElement>(id:string):T=>document.getElementById(id) as T;
const canvas=$<HTMLCanvasElement>('world'),game=new GameManager(),audio=new AudioManager();
const titles:Record<Discipline,string>={'four-ball':'4구','three-cushion':'3구 · 3쿠션','eight-ball':'포켓볼 · 8볼'};
const rulesText:Record<Discipline,string>={
 'four-ball':'국내식 4구 · 두 빨간 공을 모두 맞히면 1점. 득점하면 계속 공격합니다. 상대 수구 접촉은 경기 옵션에서 정합니다.',
 'three-cushion':'3쿠션 · 두 번째 목적구를 맞히기 전 수구가 쿠션에 3회 이상 닿아야 1점. 초구는 빨간 공을 직접 먼저 맞혀야 합니다. 후구는 선택 사항입니다.',
 'eight-ball':'8볼 · 자기 그룹을 모두 넣은 뒤 지정 포켓에 8번을 넣으세요. WPA는 콜샷과 볼 인 핸드를 적용합니다. 브레이크 포켓인만으로 그룹이 정해지지 않습니다.'
};
interface Settings{autoCamera:boolean;sound:boolean;assist:'none'|'basic'|'advanced';quality:'high'|'low';reducedMotion:boolean}
const key='jpmath-billiards-settings-v1';
let stored:Partial<Settings>={};try{stored=JSON.parse(localStorage.getItem(key)??'{}')??{};}catch{}
const settings:Settings={autoCamera:stored.autoCamera!==false,sound:stored.sound===true,assist:['none','basic','advanced'].includes(stored.assist??'')?stored.assist!:'basic',quality:stored.quality==='high'||stored.quality==='low'?stored.quality:matchMedia('(max-width:900px)').matches?'low':'high',reducedMotion:stored.reducedMotion??matchMedia('(prefers-reduced-motion:reduce)').matches};
const save=()=>{try{localStorage.setItem(key,JSON.stringify(settings));}catch{}};
interface HistoryItem{date:string;discipline:Discipline;mode:string;names:[string,string];scores:[number,number];winner:string;innings:[number,number]}
const historyKey='jpmath-billiards-history-v1';
function readHistory():HistoryItem[]{try{const rows=JSON.parse(localStorage.getItem(historyKey)??'[]');return Array.isArray(rows)?rows.slice(0,12):[];}catch{return[];}}
let discipline:Discipline='four-ball',mode:MatchConfig['mode']='ai';
let scene:SceneManager,prediction:Worker|null=null,ai:Worker|null=null;
let predictionId=0,aiId=0,aiPending=false,aiResponse:AIResponse|null=null,aiTimeout=0,aiError=false;
let lastAI:AIResponse|null=null,aiTimer=0,predictionTimer=0,aimEngaged=false,advanced=false,editing=false,placement:Vec2|null=null;
let frameCount=0,lastTime=performance.now(),screenshotPaused=false,qaFreezeAI=false,lastPhase=game.phase;
let frameTimes:number[]=[];
const dialogs=['pause-dialog','help-dialog','record-dialog','result-dialog','history-dialog','confirm-dialog'];
function anyDialog():boolean{return dialogs.some(id=>$<HTMLDialogElement>(id).open);}
function closeDialog(id:string):void{$<HTMLDialogElement>(id).close();}
function openDialog(id:string):void{if(anyDialog())return;game.paused=true;refresh();$<HTMLDialogElement>(id).showModal();}
function resize():void{if(scene){const r=canvas.getBoundingClientRect();scene.resize(r.width,r.height);}}
function setCamera(value:'top'|'cue'):void{scene.setCamera(value);$('camera-top').setAttribute('aria-pressed',String(value==='top'));$('camera-cue').setAttribute('aria-pressed',String(value==='cue'));}
function soundUI():void{$('sound').setAttribute('aria-pressed',String(audio.enabled));$('sound').setAttribute('aria-label',audio.enabled?'소리 끄기':'소리 켜기');$<HTMLInputElement>('sound-setting').checked=audio.enabled;}
async function setSound(value:boolean):Promise<void>{await audio.setEnabled(value);settings.sound=audio.enabled;soundUI();save();}
function updateMenu():void{
 document.querySelectorAll<HTMLButtonElement>('[data-discipline]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.discipline===discipline)));
 document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
 $('difficulty-label').hidden=mode!=='ai';$('target-label').hidden=discipline==='eight-ball'||mode==='practice';$('target-custom').hidden=discipline==='eight-ball'||mode==='practice'||$<HTMLSelectElement>('target-preset').value!=='custom';
 $('profile-label').hidden=discipline!=='eight-ball';$('foul-label').hidden=discipline!=='four-ball';$('equal-label').hidden=discipline!=='three-cushion';$('call-label').hidden=discipline!=='eight-ball'||$<HTMLSelectElement>('profile').value!=='casual';
 $('rule-preview').textContent=rulesText[discipline];$('start').innerHTML=`${mode==='practice'?'자유 연습 시작':mode==='ai'?'AI와 경기 시작':'2인 경기 시작'} <span>↗</span>`;
}
function menuConfig():Partial<MatchConfig>{
 const preset=$<HTMLSelectElement>('target-preset').value;return{discipline,mode,target:Number(preset==='custom'?$<HTMLInputElement>('target-custom').value:preset),difficulty:$<HTMLSelectElement>('difficulty').value as MatchConfig['difficulty'],profile:discipline==='eight-ball'?$<HTMLSelectElement>('profile').value as MatchConfig['profile']:'domestic',fourBallFoul:$<HTMLSelectElement>('four-foul').value as MatchConfig['fourBallFoul'],equalInnings:$<HTMLInputElement>('equal-innings').checked,callShots:$<HTMLInputElement>('call-shots').checked,playerNames:[$<HTMLInputElement>('name-one').value,mode==='ai'?`AI · ${$<HTMLSelectElement>('difficulty').selectedOptions[0].textContent}`:$<HTMLInputElement>('name-two').value]};
}
function invalidateAI():void{aiId++;aiPending=false;aiResponse=null;aiError=false;clearTimeout(aiTimeout);clearTimeout(aiTimer);if(ai){ai.terminate();createAI();}}
function newGame(config:Partial<MatchConfig>):void{
 invalidateAI();editing=false;placement=null;aimEngaged=false;game.newMatch(config);scene.setStroke(null);scene.setBallPlacement(null);setCamera('top');refresh();if(settings.sound)void setSound(true);
}
function start():void{newGame(menuConfig());}
function nameBall(id:string):string{const b=game.engine.balls.find(b=>b.id===id);return id==='white'?'흰 수구':id==='yellow'?'노란 수구':b?.number?`${b.number}번 공`:id==='red2'?'빨간 공 2':'빨간 공';}
function callRequired():boolean{
 const c=game.match.config,s=game.match.state;if(c.discipline!=='eight-ball'||s.breakShot||game.safety||c.mode==='practice')return false;
 const group=s.players[s.currentPlayer].group;
 const clear=!!group&&!game.engine.balls.some(b=>!b.pocketed&&b.number&&(group==='solid'?b.number>=1&&b.number<=7:b.number>=9&&b.number<=15));
 return c.profile==='wpa'||c.callShots||clear||game.calledBall==='ball-8';
}
function updatePower():void{
 const percent=Math.round(game.power*100);$('power-value').innerHTML=`${percent}<span>%</span>`;$('power-gauge').style.setProperty('--power',`${percent}%`);$('power-gauge').setAttribute('aria-valuenow',String(percent));
 if(game.phase==='charging')scene.setAim(game.cueBall,game.angle,game.power,game.tip);
}
function refreshAim():void{
 if(!scene)return;scene.setAim(game.cueBall,game.angle,game.power,game.tip);scene.setCueVisible(['aiming','charging','ai-aim','stroking'].includes(game.phase)&&!game.paused);
 $('angle-label').textContent=`${((game.angle*180/Math.PI%360+360)%360).toFixed(1)}°`;
 $('tip-dot').style.left=`${50+game.tip.x*50}%`;$('tip-dot').style.top=`${50-game.tip.y*50}%`;
 const labels=[game.tip.y>.1?'밀기':game.tip.y<-.1?'끌기':'',game.tip.x>.1?'우회전':game.tip.x<-.1?'좌회전':''].filter(Boolean);$('tip-label').textContent=labels.length?labels.join(' + '):'중앙 · 무회전';
 $('cue-white').setAttribute('aria-pressed',String(game.cueBall==='white'));$('cue-yellow').setAttribute('aria-pressed',String(game.cueBall==='yellow'));
 clearTimeout(predictionTimer);predictionId++;
 if(!game.canAim||editing||settings.assist==='none'){scene.setGuide([]);return;}
 const b=game.engine.balls.find(b=>b.id===game.cueBall&&!b.pocketed);if(!b){scene.setGuide([]);return;}
 const t=game.engine.table,dx=Math.cos(game.angle),dz=Math.sin(game.angle),limitX=t.width/2-t.ballRadius,limitZ=t.height/2-t.ballRadius;
 const tx=Math.abs(dx)>1e-6?((dx>0?limitX:-limitX)-b.position.x)/dx:1e3,tz=Math.abs(dz)>1e-6?((dz>0?limitZ:-limitZ)-b.position.z)/dz:1e3;
 const length=Math.max(0,Math.min(.6,tx,tz));scene.setGuide([{...b.position},{x:b.position.x+dx*length,z:b.position.z+dz*length}]);
 if(settings.assist==='advanced'&&prediction)predictionTimer=window.setTimeout(()=>prediction!.postMessage({requestId:predictionId,balls:game.engine.snapshot().balls,table:game.engine.table,shot:game.input} satisfies PredictionRequest),90);
}
function scoreboard():void{
 const s=game.match.state,c=game.match.config;const el=$('scoreboard');el.replaceChildren();
 for(let i=0;i<2;i++){
  if(i===1){const center=document.createElement('div');center.className='match-center';center.textContent=c.mode==='practice'?'FREE PRACTICE':c.mode==='ai'?'VS AI':'LOCAL MATCH';const text=document.createElement('strong');text.textContent=c.discipline==='eight-ball'?(s.openTable?'오픈 테이블':'8볼'):`${c.target}점 / ${s.inning}이닝`;center.append(text);el.append(center);}
  const p=s.players[i],entry=document.createElement('div');entry.className='player-score'+(s.currentPlayer===i?' active':'');entry.setAttribute('aria-current',s.currentPlayer===i?'true':'false');
  const name=document.createElement('span');name.className='player-name';name.textContent=p.name;const score=document.createElement('strong');score.textContent=String(p.score);const info=document.createElement('small');info.textContent=c.discipline==='eight-ball'?p.group==='solid'?'● 솔리드 1–7':p.group==='stripe'?'◒ 스트라이프 9–15':'그룹 미정':`${i===0?'○ 흰 수구':'● 노란 수구'} · ${p.innings}이닝 · 연속 ${p.highRun}`;entry.append(name,score,info);el.append(entry);
 }
}
function recordLog():void{
 const last=game.lastShot,log=$('record-dialog-log');log.replaceChildren();
 if(!last){$('record-dialog-summary').textContent='샷이 끝나면 접촉과 판정이 표시됩니다.';return;}
 const contacts=last.events.filter(e=>e.type==='ball-ball'),cushions=last.events.filter(e=>e.type==='cushion'&&e.ballId===last.input.ballId),pots=last.events.filter(e=>e.type==='pocket');
 $('record-dialog-summary').textContent=`${game.lastOutcome?.message??''}\n공 충돌 ${contacts.length}회 · 수구 쿠션 ${cushions.length}회 · 포켓인 ${pots.length}회\n샷 ${game.shotCount} · ${last.events.at(-1)?.time.toFixed(2)??0}초 · 파워 ${Math.round(last.input.power*100)}%`;
 for(const e of last.events.filter(e=>['ball-ball','cushion','pocket'].includes(e.type)).slice(0,70)){
  const li=document.createElement('li'),time=document.createElement('time'),text=document.createElement('span');time.textContent=`${e.time.toFixed(3)}s`;
  text.textContent=e.type==='ball-ball'?`${nameBall(e.ballA)} → ${nameBall(e.ballB)}`:e.type==='cushion'?`${nameBall(e.ballId)} · ${e.rail==='left'||e.rail==='right'?'단':'장'}쿠션`:e.type==='pocket'?`${nameBall(e.ballId)} · ${e.pocketId} 포켓`:'';li.append(time,text);log.append(li);
 }
}
function refreshCalls():void{
 const select=$<HTMLSelectElement>('called-ball'),value=game.calledBall??'';select.replaceChildren(new Option('공 선택',''));
 for(const b of game.engine.balls.filter(b=>!b.pocketed&&b.number))select.append(new Option(`${b.number}번`,b.id));select.value=value;$<HTMLSelectElement>('called-pocket').value=game.calledPocket??'';$<HTMLInputElement>('safety').checked=game.safety;
 const editor=$<HTMLSelectElement>('edit-ball'),old=editor.value;editor.replaceChildren(...game.engine.balls.map(b=>new Option(nameBall(b.id)+(b.pocketed?' · 포켓됨':''),b.id)));if(old)editor.value=old;
}
function refresh():void{
 if(!scene)return;const c=game.match.config,s=game.match.state,playing=game.phase!=='menu',pool=c.discipline==='eight-ball';
 document.body.dataset.screen=playing?'game':'menu';document.body.dataset.phase=game.phase;$('welcome').hidden=playing;
 document.querySelector<HTMLElement>('.cue-console')!.inert=!playing;canvas.tabIndex=playing?0:-1;
 scene.setTable(game.engine.table);scene.sync(game.engine.balls);scene.setPaused(game.paused||screenshotPaused);scene.setCalledPocket(game.calledPocket??null);
 scoreboard();$('discipline-label').textContent=`${titles[c.discipline]} · ${c.mode==='practice'?'자유 연습':pool?c.profile==='wpa'?'WPA':'캐주얼':'캐롬'}`;
 const phaseLabels:Record<string,string>={menu:'나만의 한 수',aiming:game.isAITurn?'AI 차례':'조준 준비',charging:'세기 선택 중',stroking:'타격 준비',moving:game.replaying?'이전 샷 재생':'공이 움직이는 중',placing:'볼 인 핸드',choosing:'브레이크 선택',thinking:'AI 생각 중','ai-aim':'AI 조준 중',finished:'경기 종료'};
 $('state-label').textContent=phaseLabels[game.phase];$('current-name').textContent=s.players[s.currentPlayer].name;
 $('shoot-label').textContent=game.phase==='charging'?'지금 타격!':game.phase==='moving'?'진행 중':game.phase==='stroking'?'타격 준비':callRequired()&&(!game.calledBall||!game.calledPocket)?'콜샷 선택':'게이지 시작';
 $<HTMLButtonElement>('shoot').disabled=!game.canPressShot||editing;$('cancel-charge').hidden=game.phase!=='charging';
 $('power-hint').textContent=game.phase==='charging'?'원하는 세기에서 한 번 더 눌러 타격!':'한 번 눌러 시작 · 다시 눌러 타격';
 $('shot-banner').textContent=game.phase==='charging'?'게이지가 왕복합니다. 한 번 더 누르면 그 세기로 샷!':game.replaying?'직전 샷을 재현합니다. 점수와 공격권은 그대로 유지합니다.':game.phase==='moving'?'모든 공이 멈추면 다음 차례가 열립니다.':game.phase==='placing'?'당구대에서 위치를 고르고 ‘여기에 놓기’를 누르세요.':game.phase==='thinking'?'AI가 같은 물리엔진으로 샷을 비교합니다.':game.phase==='ai-aim'?'AI가 조준하고 있습니다.':s.message;
 $('advanced-controls').hidden=!advanced;$('collapse').setAttribute('aria-expanded',String(advanced));$('collapse').textContent=advanced?'세부 접기 ⌃':'당점 · 세부 ⌄';
 $('pool-calls').hidden=!pool||s.breakShot||!['aiming','charging'].includes(game.phase)||game.isAITurn;
 $('placement-controls').hidden=game.phase!=='placing'||game.isAITurn;$('placement-label').textContent=s.ballInHandZone==='head-string'?'왼쪽 헤드 스트링 위쪽에 수구를 놓으세요.':'겹치지 않는 위치에 수구를 놓으세요.';
 if(game.phase==='placing'&&!placement){const b=game.engine.balls.find(b=>b.id==='white');placement=b&&!b.pocketed&&b.position.x<-game.engine.table.width/4?{...b.position}:{x:-game.engine.table.width*.33,z:0};}
 const valid=placement?game.engine.validatePocketPlacement('white',placement,s.ballInHandZone==='head-string'?'kitchen':'anywhere'):false;
 scene.setBallPlacement(game.phase==='placing'&&!game.isAITurn?placement:null,valid);$<HTMLButtonElement>('confirm-placement').disabled=!valid||game.paused;
 $('choice-controls').hidden=game.phase!=='choosing'||game.isAITurn;const choice=$('choice-controls');choice.replaceChildren();if(s.pendingChoice){const p=document.createElement('p');p.textContent=s.message;choice.append(p);for(const o of s.pendingChoice.options){const b=document.createElement('button');b.textContent=o.label;b.onclick=()=>{game.chooseBreak(o.id);placement=null;};choice.append(b);}}
 $('ai-status').hidden=!game.isAITurn||game.phase==='menu';$('ai-retry').hidden=!aiError;
 $('practice-controls').hidden=c.mode!=='practice'||!advanced;$<HTMLSelectElement>('layout').disabled=!game.canAim||pool;
 $('cue-yellow').hidden=pool;$('cue-white').hidden=pool;$('edit-ball').hidden=!editing;$('edit-balls').setAttribute('aria-pressed',String(editing));
 for(const id of ['called-ball','called-pocket','safety','reset-tip','aim-left','aim-right','cue-white','cue-yellow','edit-balls'])($(id) as HTMLButtonElement).disabled=!game.canAim;
 $<HTMLButtonElement>('replay').disabled=!game.canReplay;$<HTMLButtonElement>('reset-layout').disabled=game.busy||game.phase==='thinking';$('tip-pad').setAttribute('aria-disabled',String(!game.canAim));
 $('aim-label').textContent=editing?'당구대에서 선택한 공의 새 위치를 누르세요.':game.phase==='placing'?'겹치지 않게 수구 놓기':(matchMedia('(pointer: coarse)').matches?'끌어서 조준 · 두 손가락으로 확대':'드래그하여 조준 · 휠로 확대');
 $('console-footnote').textContent=rulesText[c.discipline];$('help-rule').textContent=rulesText[c.discipline];
 refreshCalls();recordLog();updatePower();refreshAim();
}
function showResult():void{
 const s=game.match.state,w=s.winner;const title=w==='draw'?'같은 이닝, 무승부':`${s.players[w??0].name} 승리!`;$('result-title').textContent=title;$('result-summary').textContent=`${titles[game.match.config.discipline]} · ${s.players[0].score} : ${s.players[1].score}`;
 const stats=$('result-stats');stats.replaceChildren();for(const p of s.players){const d=document.createElement('div'),strong=document.createElement('strong');strong.textContent=p.name;d.append(strong,document.createElement('br'),document.createTextNode(`${p.score}점 · ${p.innings}이닝 · ${p.shots}샷`),document.createElement('br'),document.createTextNode(`최고 연속 ${p.highRun} · 파울 ${p.fouls}`));stats.append(d);}openDialog('result-dialog');
}
function saveHistory():void{const s=game.match.state,c=game.match.config;const entry:HistoryItem={date:new Date().toISOString(),discipline:c.discipline,mode:c.mode,names:[s.players[0].name,s.players[1].name],scores:[s.players[0].score,s.players[1].score],winner:s.winner==='draw'?'무승부':s.players[s.winner??0].name,innings:[s.players[0].innings,s.players[1].innings]};try{localStorage.setItem(historyKey,JSON.stringify([entry,...readHistory()].slice(0,12)));}catch{}}
function showHistory():void{const list=$('history-list');list.replaceChildren();for(const item of readHistory()){const el=document.createElement('div');el.className='history-entry';const winner=document.createElement('strong');winner.textContent=`${titles[item.discipline]??'당구'} · ${item.winner}`;const p=document.createElement('div');p.textContent=`${item.names?.join(' vs ')} · ${item.scores?.join(' : ')}`;const date=document.createElement('small');date.textContent=new Date(item.date).toLocaleString('ko-KR');el.append(winner,p,date);list.append(el);}if(!list.children.length)list.textContent='아직 끝낸 경기가 없습니다.';openDialog('history-dialog');}
function createAI():void{
 try{ai=new Worker(new URL('./ai/Worker.ts',import.meta.url),{type:'module'});ai.onmessage=({data}:MessageEvent<AIResponse>)=>{if(data.requestId!==aiId)return;clearTimeout(aiTimeout);aiResponse=data;};ai.onerror=()=>{aiPending=false;aiError=true;game.cancelThinking();$('ai-retry').hidden=false;};}catch{ai=null;aiError=true;}
}
function requestAI():void{
 if(qaFreezeAI||!game.isAITurn||game.paused||aiPending||aiError||!['aiming','placing','choosing'].includes(game.phase))return;
 if(!ai){aiError=true;refresh();return;}aiPending=true;aiId++;game.beginThinking();const request:AIRequest={requestId:aiId,balls:game.engine.snapshot().balls,table:game.engine.table,config:structuredClone(game.match.config),state:structuredClone(game.match.state),seed:7103+game.shotCount*971};ai.postMessage(request);
 aiTimeout=window.setTimeout(()=>{aiPending=false;aiError=true;game.cancelThinking();refresh();},30000);
}
function consumeAI():void{
 if(!aiResponse||game.paused)return;const result=aiResponse;aiResponse=null;aiPending=false;lastAI=result;
 if(result.error){aiError=true;game.cancelThinking();refresh();return;}
 if(result.choice){game.chooseBreak(result.choice);placement=null;return;}
 if(game.match.state.ballInHand){if(!result.placement||!game.placeCue(result.placement)){aiError=true;game.cancelThinking();refresh();return;}}
 if(!game.executeAI(result.shot)){aiError=true;game.cancelThinking();refresh();}
}
function pressShot():void{if(editing)return;if(game.phase==='aiming'&&callRequired()&&(!game.calledBall||!game.calledPocket)){$('shot-banner').textContent='넣을 공과 지정 포켓을 먼저 선택하세요. 수비샷은 콜샷 없이 선언할 수 있습니다.';$(game.calledBall?'called-pocket':'called-ball').focus();return;}if(game.pressShot()){scene.setGuide([]);void audio.setEnabled(audio.enabled);canvas.focus({preventScroll:true});}}
function beginAim():void{if(!aimEngaged&&settings.autoCamera)setCamera('cue');aimEngaged=true;}
function changeAim(amount:number):void{if(game.canAim&&!editing&&amount!==0){game.angle+=amount;refreshAim();}}
function bindInputs():void{
 document.querySelectorAll<HTMLButtonElement>('[data-discipline]').forEach(b=>b.onclick=()=>{discipline=b.dataset.discipline as Discipline;newGame({discipline,mode:'practice'});game.toMenu();updateMenu();});
 document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode as MatchConfig['mode'];updateMenu();});
 for(const id of ['profile','target-preset'])$(id).onchange=updateMenu;
 $('start').onclick=start;$('shoot').onclick=pressShot;$('cancel-charge').onclick=()=>game.cancelCharge();
 $('camera-top').onclick=()=>setCamera('top');$('camera-cue').onclick=()=>setCamera('cue');$('reset-camera').onclick=()=>{scene.resetCamera();setCamera('top');};
 $('assist').onchange=e=>{settings.assist=(e.target as HTMLSelectElement).value as Settings['assist'];save();refreshAim();};
 $('sound').onclick=()=>void setSound(!audio.enabled);$('menu').onclick=()=>openDialog('pause-dialog');$('help').onclick=()=>openDialog('help-dialog');$('history').onclick=showHistory;
 $('resume').onclick=()=>closeDialog('pause-dialog');$('help-done').onclick=()=>closeDialog('help-dialog');$('record-done').onclick=()=>closeDialog('record-dialog');$('open-record').onclick=()=>openDialog('record-dialog');
 $('back-title').onclick=()=>{closeDialog('pause-dialog');invalidateAI();game.toMenu();updateMenu();};
 $('new-practice')?.addEventListener('click',()=>newGame(game.match.config));
 $('reset-layout').onclick=()=>{if(game.match.config.mode==='practice'){placement=null;game.reset();setCamera('top');}else openDialog('confirm-dialog');};
 $('restart-confirm').onclick=()=>{closeDialog('pause-dialog');openDialog('confirm-dialog');};$('confirm-restart').onclick=()=>{closeDialog('confirm-dialog');newGame(game.match.config);};$('keep-playing').onclick=()=>closeDialog('confirm-dialog');
 $('rematch').onclick=()=>{closeDialog('result-dialog');newGame(game.match.config);};$('result-menu').onclick=()=>{closeDialog('result-dialog');invalidateAI();game.toMenu();};$('result-record').onclick=()=>{closeDialog('result-dialog');openDialog('record-dialog');};
 $('replay').onclick=()=>{if(game.replay()){scene.setStroke(null);scene.sync(game.engine.balls);setCamera('top');}};
 $('collapse').onclick=()=>{advanced=!advanced;if(!advanced)editing=false;refresh();};
 $('layout').onchange=e=>{if(game.canAim){placement=null;aimEngaged=false;game.reset((e.target as HTMLSelectElement).value as typeof game.layout);setCamera('top');}};
 for(const cue of ['white','yellow'] as const)$(`cue-${cue}`).onclick=()=>{game.selectPracticeCue(cue);};
 $('called-ball').onchange=e=>{game.calledBall=(e.target as HTMLSelectElement).value||undefined;refresh();};$('called-pocket').onchange=e=>{game.calledPocket=(e.target as HTMLSelectElement).value||undefined;scene.setCalledPocket(game.calledPocket??null);refresh();};$('safety').onchange=e=>{game.safety=(e.target as HTMLInputElement).checked;refresh();};
 $('confirm-placement').onclick=()=>{if(placement&&game.placeCue(placement)){placement=null;scene.setBallPlacement(null);refresh();}};
 $('edit-balls').onclick=()=>{if(game.canAim){editing=!editing;setCamera('top');refresh();}};
 $('ai-retry').onclick=()=>{invalidateAI();game.cancelThinking();refresh();};
 $('auto-camera').onchange=e=>{settings.autoCamera=(e.target as HTMLInputElement).checked;save();};$('sound-setting').onchange=e=>void setSound((e.target as HTMLInputElement).checked);
 $('quality').onchange=e=>{settings.quality=(e.target as HTMLSelectElement).value as Settings['quality'];scene.setQuality(settings.quality);save();};$('reduce-motion').onchange=e=>{settings.reducedMotion=(e.target as HTMLInputElement).checked;scene.setReducedMotion(settings.reducedMotion);save();};
 for(const id of dialogs)$<HTMLDialogElement>(id).addEventListener('close',()=>{game.paused=anyDialog();lastTime=performance.now();refresh();});
 const setTip=(x:number,y:number)=>{if(!game.canAim)return;const len=Math.hypot(x,y),factor=len>.75?.75/len:1;game.tip={x:x*factor,y:y*factor};refreshAim();};
 const pad=$('tip-pad');let tipDrag=false;const tip=(e:PointerEvent)=>{const r=pad.getBoundingClientRect();setTip((e.clientX-r.left-r.width/2)/(r.width/2),-(e.clientY-r.top-r.height/2)/(r.height/2));};
 pad.onpointerdown=e=>{if(!game.canAim)return;tipDrag=true;pad.setPointerCapture(e.pointerId);tip(e);};pad.onpointermove=e=>{if(tipDrag)tip(e);};pad.onpointerup=pad.onpointercancel=pad.onlostpointercapture=()=>tipDrag=false;
 pad.onkeydown=e=>{const d:Record<string,[number,number]>={ArrowLeft:[-.04,0],ArrowRight:[.04,0],ArrowUp:[0,.04],ArrowDown:[0,-.04]};if(d[e.key]){e.preventDefault();setTip(game.tip.x+d[e.key][0],game.tip.y+d[e.key][1]);}};
 $('reset-tip').onclick=()=>setTip(0,0);$('aim-left').onclick=()=>changeAim(-Math.PI/360);$('aim-right').onclick=()=>changeAim(Math.PI/360);
 const pointers=new Map<number,{x:number;y:number}>();let multiTouch=false,distance=0,right=false,moved=0,startPoint={x:0,y:0};
 const clear=()=>{pointers.clear();multiTouch=false;distance=0;right=false;tipDrag=false;};
 canvas.oncontextmenu=e=>e.preventDefault();canvas.onpointerdown=e=>{if(game.phase==='menu'||game.paused||game.isAITurn)return;canvas.focus({preventScroll:true});canvas.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});right=e.button===2;startPoint={x:e.clientX,y:e.clientY};moved=0;if(pointers.size===1)multiTouch=false;if(pointers.size===2){multiTouch=true;const[a,b]=[...pointers.values()];distance=Math.hypot(a.x-b.x,a.y-b.y);}};
 canvas.onpointermove=e=>{const p=pointers.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;moved+=Math.abs(dx)+Math.abs(dy);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const[a,b]=[...pointers.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(distance)scene.zoom((distance-d)*7);distance=d;return;}if(multiTouch)return;if(right)scene.orbit(dx,dy);else if(game.phase==='placing'||editing){const point=scene.screenToTable(e.clientX,e.clientY);if(point){placement=point;scene.setBallPlacement(point,game.engine.validatePocketPlacement(editing?$<HTMLSelectElement>('edit-ball').value:'white',point,game.match.state.ballInHandZone==='head-string'&&!editing?'kitchen':'anywhere'));}}else if(moved>=4&&dx!==0&&game.canAim){beginAim();changeAim(dx*(e.shiftKey?.0004:.006));}};
 canvas.onpointerup=e=>{if(pointers.has(e.pointerId)&&!multiTouch&&!right&&pointers.size===1){const point=scene.screenToTable(e.clientX,e.clientY);if(point&&game.phase==='placing'){placement=point;refresh();}else if(point&&editing){const id=$<HTMLSelectElement>('edit-ball').value;if(!game.movePracticeBall(id,point)){$('shot-banner').textContent='공이 겹치거나 테이블을 벗어난 위치에는 놓을 수 없습니다.';}scene.setBallPlacement(null);}else if(point&&moved<4&&game.canAim&&scene.cameraMode==='top'){const pocket=game.engine.table.pockets?.find(p=>Math.hypot(p.x-point.x,p.z-point.z)<p.radius+.045);if(pocket&&!game.match.state.breakShot){game.calledPocket=pocket.id;scene.setCalledPocket(pocket.id);$<HTMLSelectElement>('called-pocket').value=pocket.id;pointers.delete(e.pointerId);distance=0;return;}const cue=game.engine.balls.find(b=>b.id===game.cueBall)!;if(Math.hypot(point.x-cue.position.x,point.z-cue.position.z)>.05){game.angle=Math.atan2(point.z-cue.position.z,point.x-cue.position.x);refreshAim();}}}pointers.delete(e.pointerId);distance=0;if(!pointers.size)right=false;};
 canvas.onpointercancel=canvas.onlostpointercapture=e=>{pointers.delete(e.pointerId);distance=0;};canvas.addEventListener('wheel',e=>{e.preventDefault();scene.zoom(e.deltaY);},{passive:false});
 window.addEventListener('keydown',e=>{if(anyDialog()||e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target===pad)return;if(e.code==='Escape'){e.preventDefault();if(game.phase==='charging')game.cancelCharge();else openDialog('pause-dialog');return;}if(game.phase==='menu')return;if(e.code==='Space'&&e.target instanceof HTMLButtonElement)return;if(e.code==='Space'){e.preventDefault();if(!e.repeat)pressShot();}if(e.code==='KeyV'&&!e.repeat)setCamera(scene.cameraMode==='top'?'cue':'top');if(e.code==='KeyR'){scene.resetCamera();setCamera('top');}if(e.code==='ArrowLeft'||e.code==='ArrowRight'){e.preventDefault();changeAim((e.code==='ArrowLeft'?-1:1)*Math.PI/(e.shiftKey?18000:360));}});
 window.addEventListener('blur',clear);document.addEventListener('visibilitychange',()=>{clear();lastTime=performance.now();if(document.hidden&&game.phase!=='menu'&&!anyDialog())openDialog('pause-dialog');});
}
function frame(now:number):void{
 const dt=Math.min((now-lastTime)/1000,.1);lastTime=now;if(!screenshotPaused)game.update(dt);
 if(lastPhase!==game.phase){if(game.phase==='moving'){scene.setStroke(null);scene.setCueVisible(false);if(settings.autoCamera)setCamera('top');}lastPhase=game.phase;}
 if(game.phase==='stroking')scene.setStroke(Math.min(1,game.strokeProgress));else scene.setStroke(null);
 updatePower();scene.sync(game.engine.balls);scene.setPaused(game.paused||screenshotPaused);scene.update(dt);scene.render();
 audio.updateRolling(game.engine.balls.reduce((v,b)=>v+Math.hypot(b.velocity.x,b.velocity.z),0),game.paused||screenshotPaused);
 if(!screenshotPaused){consumeAI();requestAI();}frameCount++;if(frameTimes.length>=120)frameTimes.shift();frameTimes.push(dt*1000);requestAnimationFrame(frame);
}
function installQA():void{
 if(!new URLSearchParams(location.search).has('qa'))return;const w=window as unknown as Record<string,unknown>;
 Object.defineProperty(w,'__THREE_GAME_DIAGNOSTICS__',{get:()=>({...scene.diagnostics(),renderer:scene.diagnostics(),gameState:game.phase,frameCount,frameMs:frameTimes.reduce((a,b)=>a+b,0)/Math.max(1,frameTimes.length),physics:{engine:'dedicated-billiards',timestep:1/240,balls:game.engine.balls.length,settled:game.engine.settled,energy:game.engine.energy(),time:game.engine.time,safetyStops:game.engine.safetyStops},simulationState:game.engine.snapshot(),match:structuredClone(game.match.state),config:game.match.config,shotCount:game.shotCount,contacts:game.lastShot?.events??[],lastOutcome:game.lastOutcome,paused:game.paused,angle:game.angle,power:game.power,tip:{...game.tip},predictionWorker:!!prediction,aiWorker:!!ai,aiPending,lastAI})});
 w.__THREE_GAME_TEST_HOOKS__={
  async setState(name:string){
   if(!['active-play','cue-view','spin-view','pause','title','pool-play','pool-cue','charging','finished'].includes(name))throw new Error(`Unknown test state:${name}`);
   screenshotPaused=false;qaFreezeAI=true;for(const id of dialogs)if($<HTMLDialogElement>(id).open)closeDialog(id);
   newGame({discipline:name.startsWith('pool')?'eight-ball':'four-ball',mode:'practice'});
   if(game.phase==='placing')game.placeCue({x:-.85,z:0});
   if(name==='title')game.toMenu();if(name==='spin-view'){game.reset('spin');game.tip={x:.3,y:-.5};}
   if(name==='charging'){game.pressShot();game.update(.6);}
   if(name==='active-play'||name==='pool-play'){game.shoot({ballId:'white',angle:0,power:.65,tip:{x:0,y:0}});for(let i=0;i<360;i++)game.update(1/240);}
   if(name==='finished'){const response=await fetch(new URL('./artifacts/bot-matches/four-ball.json',location.href));if(!response.ok)throw new Error('Missing physical match fixture');const data=await response.json();game.newMatch(data.config);game.match.state=data.finalTurnState;game.engine.reset(data.finalShot.before.balls);game.cueBall=game.match.cueBall;game.phase='aiming';game.shoot(data.finalShot.input);for(let i=0;i<240*60&&game.busy;i++)game.update(1/240);if((game.phase as string)!=='finished')throw new Error('Physical result fixture failed');}
   setCamera(name.includes('cue')?'cue':'top');refresh();resize();for(let i=0;i<100;i++)scene.update(1/60);if(name==='pause')openDialog('pause-dialog');if(name==='finished')await new Promise(resolve=>setTimeout(resolve,200));return{state:name};
  },
  setPausedForScreenshot(value:boolean){screenshotPaused=value;scene.setPaused(value);},setReducedMotion(value:boolean){scene.setReducedMotion(value);},hideDebugUi(){},
  newMatch(config:Partial<MatchConfig>){qaFreezeAI=false;newGame(config);},
  fixture(balls:BallState[],input?:ShotInput){invalidateAI();game.engine.reset(balls);game.match.confirmPlacement();game.phase='aiming';placement=null;if(input){game.angle=input.angle;game.power=input.power;game.tip={...input.tip};game.calledBall=input.calledBall;game.calledPocket=input.calledPocket;}refresh();},
  setMatch(state:Partial<typeof game.match.state>){Object.assign(game.match.state,state);game.cueBall=game.match.cueBall;refresh();},
  freezeAI(value:boolean){qaFreezeAI=value;},shot(input:ShotInput){return game.shoot(input);},game
 };
}
try{
 scene=new SceneManager(canvas,TABLE);scene.setQuality(settings.quality);scene.setReducedMotion(settings.reducedMotion);scene.sync(game.engine.balls);
 $<HTMLInputElement>('auto-camera').checked=settings.autoCamera;$<HTMLInputElement>('reduce-motion').checked=settings.reducedMotion;$<HTMLSelectElement>('quality').value=settings.quality;$<HTMLSelectElement>('assist').value=settings.assist;soundUI();
 prediction=new Worker(new URL('./game/PredictionWorker.ts',import.meta.url),{type:'module'});prediction.onmessage=({data}:MessageEvent<PredictionResponse>)=>{if(data.requestId!==predictionId||!game.canAim||editing||settings.assist!=='advanced')return;scene.setGuide(data.paths.find(p=>p.id===game.cueBall)?.points??[],data.paths.filter(p=>p.id!==game.cueBall&&p.points.length>1).map(p=>p.points));};prediction.onerror=()=>{prediction?.terminate();prediction=null;settings.assist='basic';$<HTMLSelectElement>('assist').value='basic';refreshAim();};createAI();
 game.onChange=refresh;game.onEvent=e=>audio.play(e);game.onFinished=()=>{aimEngaged=false;placement=null;if(!game.replaying&&game.lastOutcome?.scored)audio.feedback('score');if(settings.autoCamera)setCamera('top');refresh();};game.onMatchEnd=()=>{saveHistory();audio.feedback('win');window.setTimeout(showResult,150);};
 bindInputs();new ResizeObserver(resize).observe(canvas);window.addEventListener('resize',resize);updateMenu();resize();refresh();installQA();requestAnimationFrame(frame);
}catch(error){$('error').hidden=false;$('error').textContent='3D 화면을 열지 못했습니다. WebGL 2를 지원하는 최신 브라우저에서 다시 열어 주세요.';console.error(error);}
