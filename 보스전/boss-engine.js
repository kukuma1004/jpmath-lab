/* 보스전 2.2 공통 엔진.

   미적분 계산 스킬과 기하 내신 스킬이 같은 엔진을 나눠 쓴다.
   로드맵 원칙 2: 64개의 엔진을 복사하지 않고 공통 엔진과 설정으로 만든다.

   페이지가 넘겨야 하는 것 (api):
     root          보스 화면이 들어 있는 요소
     config        보스 설정 한 벌 (보스전/boss-catalog.js 의 규칙을 따른다)
     skillId·skillTitle
     levels        [{id,name,...}] 난이도 목록
     level()       지금 고른 난이도 id
     makeBossQuestion(level, state)   문제 하나. 기믹별 분기는 페이지가 맡는다
     setMath·fillAnswers·markAnswers  페이지의 조판·선택지 그리기
     rec()·save()·updateStats()       기록 저장
     telemetry     없으면 null

   엔진이 돌려주는 것:
     panelHtml()   보스 화면 HTML
     mount()       버튼을 잇는다
     reset()       전투 전 상태로
     state         지금 전투 상태 (읽기용)
*/
(function () {
  'use strict';

  function create(api) {
    const root = api.root || document;
    const $ = (s, r = root) => r.querySelector(s);
    const $$ = (s, r = root) => [...r.querySelectorAll(s)];
    const cfg = api.config;
    // 연출에서 쓰는 잔돌림. 페이지의 것과 같은 식이다.
    const ri = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
    const pick = (arr) => arr[ri(0, arr.length - 1)];

    // 난이도를 고르면 그것이 곧 시작 PHASE 다. 체력과 시간도 여기 맞춘다.
    const BOSS_V2_HP = cfg.hp || 2600;
    const BOSS_V2_BASE_TIME = cfg.baseTime || 38;
    const BOSS_V2_MIN_TIME = cfg.minTime || 24;
    /* 대단원 총력전은 난이도를 올리면 문제 자체가 어려워진다(멤버 스킬이
       전부 레벨을 갖는다). 거기에 체력을 얹어 판을 길게 만든다.
       기본은 지금까지의 고정 난이도와 같게 두고(관문 가감 0), 심화에서만
       관문을 하나 늘린다 — 문제까지 어려워진 위에 관문까지 늘리면 과하다. */
    const LEVEL_HP = cfg.mechanic === 'degree-grade' ? [1, 1.2, 1.65]
      /* 대단원의 체력. 시간을 고정한 뒤로는 이 배수가 곧 난이도다.
         1.7 로 두었더니 심화가 문제당 2.9초라 손이 못 따라갔다. */
      : cfg.unitOf ? [1, 1.25, 1.5] : [1, 1, 1];
    const LEVEL_LOCK = [0, 0, 1];   // 대단원 관문 단계 가감
    /* 대단원은 난이도를 올려도 시간을 늘리지 않는다. 스킬 보스는 문제가
       어려워진 만큼 시간을 얹어 주지만, 대단원에서 그렇게 했더니 심화가
       오히려 쉬웠다 — 체력과 관문이 늘어난 것보다 시간이 더 넉넉해졌다. */
    const LEVEL_TIME = cfg.unitOf ? [1, 1, 1] : [1, 1.2, 1.45];
    const bossLevelIndex = () => bossStartPhase() - 1;
    const bossMaxHp = () => Math.round(BOSS_V2_HP * LEVEL_HP[bossLevelIndex()]);
    const bossBaseTime = () => Math.round(BOSS_V2_BASE_TIME * LEVEL_TIME[bossLevelIndex()]);
    const currentBossV2Limit = () => Math.max(
      Math.round(BOSS_V2_MIN_TIME * LEVEL_TIME[bossLevelIndex()]),
      bossBaseTime() - (api.rec().bossClears || 0) * 2);

    const bossSessionId = api.telemetry ? api.telemetry.makeSessionId() : '';
    let bossSessionPlayIndex = 0, bossActivePlay = null;

    let boss = {};
    function stopBossTimer(){boss.running=false;cancelAnimationFrame(boss.raf)}
    function renderBossHud(){
      const stage=$('[data-boss-stage]');
      if(true){
        const hp=Math.max(0,boss.hp);$('[data-boss-hp]').style.width=`${hp/boss.maxHp*100}%`;$('[data-boss-hp-text]').textContent=`${hp} / ${boss.maxHp}`;$('[data-boss-time]').textContent=boss.time.toFixed(1);$('[data-boss-timer]').style.width=`${boss.time/boss.limit*100}%`;
        $('[data-boss-damage]').textContent=boss.damage;$('[data-boss-combo]').textContent=`×${bossMultiplier().toFixed(2)}`;
        updateComboHeat();
        const shieldBattle=cfg.mechanic==='factor-shield',reflectBattle=cfg.mechanic==='conjugate-reflect',gradeBattle=cfg.mechanic==='degree-grade',chaosBattle=cfg.mechanic==='chaos-split',sideBattle=cfg.mechanic==='side-switch',stitchBattle=cfg.mechanic==='continuity-stitch',squeezeBattle=cfg.mechanic==='squeeze-walls',forbiddenBattle=cfg.mechanic==='forbidden-seal',differenceBattle=cfg.mechanic==='h-collapse',productBattle=cfg.mechanic==='product-blades',sniperBattle=cfg.mechanic==='sniper-lock',stepBattle=cfg.mechanic==='step-lock',wallGap=Number.isFinite(boss.wallGap)?boss.wallGap:100;$('[data-boss-state-label]').textContent=shieldBattle?'SHIELD':reflectBattle?'MIRROR':gradeBattle?'GRADE':chaosBattle?'BODIES':sideBattle?'방향':stitchBattle?'봉합':squeezeBattle?'벽 간격':forbiddenBattle?'정석 봉인':differenceBattle?'h 거리':productBattle?'쌍날':sniperBattle?'조준':stepBattle?cfg.lockLabel:'PHASE';$('[data-boss-phase]').textContent=shieldBattle?boss.shield:reflectBattle?`${boss.reflectCharge}/2`:gradeBattle?boss.attackGrade:chaosBattle?boss.splitCount:sideBattle?(boss.targetSide==='right'?'우 →':'← 좌'):stitchBattle?`${boss.stitches}/3`:squeezeBattle?`${Math.round(wallGap)}%`:forbiddenBattle?`${boss.orthodoxSeal}/3`:differenceBattle?hDistanceLabel():productBattle?bladeStateLabel():sniperBattle?sniperLockLabel():stepBattle?stepLockLabel():boss.phase;
        stage.classList.toggle('boss-reflect-ready',reflectBattle&&boss.reflectCharge===1);
        stage.classList.toggle('boss-chaos-split',chaosBattle&&boss.splitCount>1);if(chaosBattle)stage.dataset.bodies=String(boss.splitCount);else delete stage.dataset.bodies;
        stage.classList.toggle('boss-side-left',sideBattle&&boss.targetSide!=='right');stage.classList.toggle('boss-side-right',sideBattle&&boss.targetSide==='right');
        stage.classList.toggle('boss-stitch-sealed',stitchBattle&&boss.stitches===3);stage.classList.toggle('boss-regenerating',stitchBattle&&boss.stitches<3&&boss.running);
        stage.classList.toggle('boss-walls-danger',squeezeBattle&&wallGap<=35&&boss.running);stage.classList.toggle('boss-walls-crushed',squeezeBattle&&boss.wallCrushed);if(squeezeBattle){const wallShift=8+Math.max(0,Math.min(100,wallGap))*.97;stage.style.setProperty('--wall-left',`-${wallShift}%`);stage.style.setProperty('--wall-right',`${wallShift}%`)}
        stage.classList.toggle('boss-forbidden-charged',forbiddenBattle&&boss.forbiddenPower>0);stage.classList.toggle('boss-seal-open',forbiddenBattle&&boss.orthodoxSeal===0);
        stage.classList.toggle('boss-h-core-open',differenceBattle&&boss.hStep===3);if(differenceBattle){const ringScales=[1,.82,.64,.46],innerScales=[1,.76,.52,.3];stage.style.setProperty('--h-ring-scale',ringScales[Math.max(0,Math.min(3,boss.hStep))]);stage.style.setProperty('--h-inner-scale',innerScales[Math.max(0,Math.min(3,boss.hStep))]);stage.dataset.hStep=String(boss.hStep);const questionCue=$('.question-topline>span',$('[data-boss-body]'));if(questionCue)questionCue.textContent=questionCue.textContent.replace(/ · h=[^·]+$/,` · h=${hDistanceLabel()}`)}else delete stage.dataset.hStep;
        stage.classList.toggle('boss-sniper-aimed',sniperBattle&&boss.sniperLock===1);stage.classList.toggle('boss-sniper-locked',sniperBattle&&boss.sniperLock===2);stage.classList.toggle('boss-blade-left-ready',productBattle&&boss.leftBladeReady&&!boss.rightBladeReady);stage.classList.toggle('boss-blade-dual-ready',productBattle&&boss.leftBladeReady&&boss.rightBladeReady);
        stage.classList.toggle('boss-danger',boss.time<=8&&boss.running);stage.classList.toggle('boss-phase-two',boss.phase===2);stage.classList.toggle('boss-phase-three',boss.phase===3);
        const clearedRatio=1-hp/boss.maxHp;$$('.boss-node').forEach((node,index)=>node.className='boss-node '+(clearedRatio>=(index+1)/3?'done':clearedRatio>=index/3?'active':''));
        return;
      }
      const hp=Math.max(0,3-boss.index);$('[data-boss-hp]').style.width=`${hp/3*100}%`;$('[data-boss-hp-text]').textContent=`${hp} / 3`;$('[data-boss-time]').textContent=boss.time.toFixed(1);$('[data-boss-timer]').style.width=`${boss.limit?boss.time/boss.limit*100:0}%`;stage.classList.toggle('boss-danger',boss.time<=Math.min(4,boss.limit*.34)&&boss.running)
    }
    /* 각성 문턱. 열 번을 이어 맞히면 무대가 달아오른다.
       배수가 오르는 자리(4·7·10…)와 겹치게 두어, 눈에 띄는 보상이 겹쳐 온다. */
    const OVERDRIVE_COMBO=8;
    function bossMultiplier(){return 1+Math.min(1.5,Math.floor(Math.max(0,boss.combo-1)/3)*.25)}
    function bossStartPhase(){return api.level()==='deep'?3:api.level()==='applied'?2:1}
    function bossQuestionLevel(){return cfg?.mechanic==='degree-grade'?(boss.phase===3?'deep':boss.phase===2?'applied':'basic'):api.level()}
    function squeezeSafeWindow(){return cfg?.safeWindows?.[Math.max(0,Math.min(2,boss.phase-1))]||5}
    function hDistanceLabel(){return ['1','0.1','0.01','0'][Math.max(0,Math.min(3,boss.hStep||0))]}
    /* 관문 수는 대단원 보스에서만 난이도를 탄다. 나머지는 설정값 그대로다. */
    function lockStepCount(){
      const base=cfg.lockSteps||3;
      return cfg.unitOf?Math.max(2,base+LEVEL_LOCK[bossLevelIndex()]):base;
    }
    function stepLockLabel(){return `${boss.lockStep||0}/${lockStepCount()}`}
    function sniperLockLabel(){return ['0/2','접점 1/2','기울기 2/2'][Math.max(0,Math.min(2,boss.sniperLock||0))]}
    function bladeStateLabel(){return boss.leftBladeReady?(boss.rightBladeReady?'연계!':'우 대기'):'좌 대기'}
    function startBossV2(){
      stopBossTimer();bossSessionPlayIndex++;const limit=currentBossV2Limit(),startPhase=bossStartPhase();boss={running:true,raf:0,time:limit,limit,last:performance.now(),hp:bossMaxHp(),maxHp:bossMaxHp(),damage:0,combo:0,bestCombo:0,overdriveShown:false,correct:0,attempts:0,phase:startPhase,shield:cfg.mechanic==='factor-shield'?3:0,reflectCharge:0,attackGrade:'C',splitCount:1,nextSide:'left',targetSide:'left',lastSide:null,boundaryStreak:0,stitches:0,regenBuffer:0,healed:0,reopenOnNext:false,wallGap:100,wallCrushed:false,wallEscapes:0,orthodoxSeal:3,forbiddenPower:0,sealBreaks:0,resealOnNext:false,lastForbidden:false,hStep:0,hCoreHits:0,hResetOnNext:false,leftBladeReady:false,rightBladeReady:false,nextBlade:'left',bladePairs:0,bladesResetOnNext:false,productPair:null,sniperLock:0,sniperTarget:null,sniperShots:0,sniperResetOnNext:false,lockStep:0,lockBreaks:0,lockResetOnNext:false,questionStartedAt:0,q:null,locked:false};
      api.rec().bossAttempts=(api.rec().bossAttempts||0)+1;api.save();
      bossActivePlay=api.telemetry?api.telemetry.startPlay({gameId:cfg.gameId,sessionId:bossSessionId,retry:bossSessionPlayIndex>1,sessionPlayIndex:bossSessionPlayIndex,dateKey:new Date().toISOString().slice(0,10)}):null;
      const monster=$('[data-boss-monster]');monster.classList.remove('boss-hit','boss-attack','boss-defeated');$('[data-boss-mood]').textContent=cfg.mechanic==='factor-shield'?'석문 보호막 3칸':cfg.mechanic==='conjugate-reflect'?'거울 충전 0 / 2':cfg.mechanic==='degree-grade'?'하위 차수 장갑 · C GRADE':cfg.mechanic==='chaos-split'?'혼돈 코어 안정 · 1 BODY':cfg.mechanic==='side-switch'?'왼쪽 가면 봉인 · ← 좌극한':cfg.mechanic==='continuity-stitch'?'재생축 가동 · 봉합 0/3':cfg.mechanic==='squeeze-walls'?'상·하한 벽 전개 · 간격 100%':cfg.mechanic==='forbidden-seal'?'금단 두루마리 봉인 · 정석 0/3':cfg.mechanic==='h-collapse'?'할선 고리 전개 · h=1':cfg.mechanic==='sniper-lock'?'조준경 개방 · 조준 0/2':cfg.mechanic==='step-lock'?cfg.moodStart:cfg.mechanic==='product-blades'?'청록 왼날 대기 · u′v':'기본 방어';if(startPhase>1)$('[data-boss-mood]').textContent+=` · ${api.levels[startPhase-1].name} 시작`;$('[data-boss-start]').classList.add('hidden');$('[data-boss-status]').className='boss-status hidden';// 지난 판의 열기·각성·무결점 자국을 지우고 새로 시작한다
      $('[data-boss-stage]').classList.remove('boss-heat-1','boss-heat-2','boss-heat-3','boss-overdrive','boss-flawless');lastComboTier=0;renderBossV2();renderBossHud();boss.raf=requestAnimationFrame(tickBoss)
    }
    function startBossTimer(){stopBossTimer();boss.running=true;boss.last=performance.now();boss.raf=requestAnimationFrame(tickBoss)}
    function tickBoss(now){if(!boss.running)return;const elapsed=(now-boss.last)/1000;boss.time=Math.max(0,boss.time-elapsed);boss.last=now;if(true&&cfg.mechanic==='continuity-stitch'&&boss.stitches<3&&boss.hp<boss.maxHp){boss.regenBuffer+=elapsed;if(boss.regenBuffer>=1){const ticks=Math.floor(boss.regenBuffer),heal=ticks*(cfg.regenRate+Math.max(0,boss.phase-1)*2);boss.regenBuffer-=ticks;const actual=Math.min(heal,boss.maxHp-boss.hp);boss.hp+=actual;boss.healed+=actual;if(actual>0)launchBossHealFx(actual)}}if(true&&cfg.mechanic==='squeeze-walls'&&boss.questionStartedAt&&!boss.wallCrushed){const questionElapsed=(now-boss.questionStartedAt)/1000,windowLimit=squeezeSafeWindow();boss.wallGap=Math.max(0,100-questionElapsed/windowLimit*100);if(boss.wallGap<=0){boss.wallCrushed=true;boss.time=Math.max(0,boss.time-2);const stage=$('[data-boss-stage]'),monster=$('[data-boss-monster]');stage.classList.add('boss-wall-slam');monster.classList.remove('boss-hit');monster.classList.add('boss-attack');$('[data-boss-mood]').textContent='쌍벽 충돌 · 시간 −2초';launchBossFx(false,0,2);setTimeout(()=>{stage.classList.remove('boss-wall-slam');monster.classList.remove('boss-attack')},620)}}renderBossHud();if(boss.time<=0){finishBossV2(false);return}boss.raf=requestAnimationFrame(tickBoss)}
    function renderBossV2(){
      if(!boss.running)return;boss.locked=false;const level=bossQuestionLevel(),sideBattle=cfg.mechanic==='side-switch',stitchBattle=cfg.mechanic==='continuity-stitch',squeezeBattle=cfg.mechanic==='squeeze-walls',forbiddenBattle=cfg.mechanic==='forbidden-seal',differenceBattle=cfg.mechanic==='h-collapse',productBattle=cfg.mechanic==='product-blades',sniperBattle=cfg.mechanic==='sniper-lock',stepBattle=cfg.mechanic==='step-lock';if(stitchBattle&&boss.reopenOnNext){boss.stitches=0;boss.reopenOnNext=false;boss.regenBuffer=0}if(squeezeBattle){boss.wallGap=100;boss.wallCrushed=false}if(forbiddenBattle&&boss.resealOnNext){boss.orthodoxSeal=3;boss.resealOnNext=false}if(differenceBattle&&boss.hResetOnNext){boss.hStep=0;boss.hResetOnNext=false}if(stepBattle&&boss.lockResetOnNext){boss.lockStep=0;boss.lockResetOnNext=false}if(sniperBattle&&boss.sniperResetOnNext){boss.sniperLock=0;boss.sniperTarget=null;boss.sniperResetOnNext=false}if(productBattle&&boss.bladesResetOnNext){boss.leftBladeReady=false;boss.rightBladeReady=false;boss.nextBlade='left';boss.productPair=null;boss.bladesResetOnNext=false}$('[data-boss-stage]').classList.remove('boss-stitch-complete','boss-wall-slam','boss-seal-break','boss-forbidden-cast','boss-h-collapse','boss-h-rebound','boss-blade-cross','boss-blade-break','boss-sniper-fire','boss-sniper-miss','boss-step-finish','boss-step-break');boss.q=api.makeBossQuestion(level,boss);if(sideBattle)boss.targetSide=boss.q.side||boss.nextSide;boss.attackGrade=level==='deep'?'A':level==='applied'?'B':'C';boss.questionStartedAt=performance.now();const levelName=api.levels.find(l=>l.id===level).name,directionCue=sideBattle?` · ${boss.targetSide==='left'?'← 좌극한':'우극한 →'}`:stitchBattle?` · 금실 ${boss.stitches}/3`:squeezeBattle?` · 압착 ${squeezeSafeWindow().toFixed(1)}초`:forbiddenBattle?` · 정석 ${3-boss.orthodoxSeal}/3`:differenceBattle?` · h=${hDistanceLabel()}`:productBattle?` · ${boss.nextBlade==='left'?'청록 u′v':'금빛 uv′'}`:sniperBattle?` · 조준 ${sniperLockLabel()}`:stepBattle?` · ${cfg.lockLabel} ${stepLockLabel()}`:'';const body=$('[data-boss-body]');body.innerHTML=`<div class="question-topline"><span>PHASE ${boss.phase} · ${levelName} 문제${directionCue}</span><span data-live-combo></span></div><div class="question-equation"></div><div class="question-prompt"></div><div class="answer-grid"></div>`;
      api.setMath($('div.question-equation',body),boss.q.equation);$('div.question-prompt',body).textContent=boss.q.prompt;$('[data-live-combo]').textContent=`COMBO ${boss.combo}`;const box=$('.answer-grid',body);api.fillAnswers(box,boss.q,(v,b)=>resolveBossV2(v,b));renderBossHud();
    }
    function launchBossFx(ok,damage,penalty=2){
      const layer=$('[data-boss-fx]');if(!layer)return;
      const shot=document.createElement('i'),impact=document.createElement('b');
      shot.className=`boss-projectile ${ok?'player-strike':'boss-counter'}`;shot.textContent=ok?(cfg?.mechanic==='factor-shield'?'(x−a)':cfg?.mechanic==='conjugate-reflect'?'√±':cfg?.mechanic==='degree-grade'?'∞/∞':cfg?.mechanic==='chaos-split'?'∞−∞':cfg?.mechanic==='side-switch'?(boss.q?.side==='left'?'←':'→'):cfg?.mechanic==='continuity-stitch'?'∪':cfg?.mechanic==='squeeze-walls'?'≤·≤':cfg?.mechanic==='forbidden-seal'?'정석':cfg?.mechanic==='h-collapse'?'h→0':cfg?.mechanic==='product-blades'?(boss.q?.blade==='left'?'u′v':'uv′'):pick(['f′','Δx','dy','∫'])):cfg?.mechanic==='forbidden-seal'&&boss.lastForbidden?'L’H':cfg?.mechanic==='h-collapse'?'Δh':cfg?.mechanic==='product-blades'?'×':'×';
      /* 한 방의 크기를 눈에 보이게 한다.

         지금까지는 30 데미지든 500 데미지든 같은 크기의 숫자가 떴다.
         마무리 공격이 평타의 두세 배인데 화면이 똑같으니 손맛이 없었다.
         평타 한 방(cfg.baseDamage)을 기준으로 재어 세 등급으로 나눈다. */
      const base=cfg?.baseDamage||150,ratio=ok?damage/base:0;
      const grade=ratio>=1.9?'crit':ratio>=1.15?'heavy':'';
      impact.className=`boss-impact ${ok?'player-impact':'counter-impact'} ${grade?'boss-impact-'+grade:''}`.trim();
      impact.textContent=ok?`−${damage}`:`−${penalty}초`;
      layer.append(shot,impact);

      if(grade){
        // 큰 한 방에는 고리가 퍼지고 무대가 흔들린다
        const burst=document.createElement('u');
        burst.className=`boss-burst boss-burst-${grade}`;
        layer.append(burst);setTimeout(()=>burst.remove(),720);
        const stage=$('[data-boss-stage]');
        if(stage){
          stage.classList.remove('boss-shake','boss-shake-hard');
          void stage.offsetWidth;                       // 같은 흔들림을 다시 태우려면 한 번 끊어야 한다
          stage.classList.add(grade==='crit'?'boss-shake-hard':'boss-shake');
          setTimeout(()=>stage.classList.remove('boss-shake','boss-shake-hard'),grade==='crit'?520:340);
        }
      }
      setTimeout(()=>{shot.remove();impact.remove()},900);
    }

    /* 콤보가 오르면 배수가 4·7·10… 에서 한 칸씩 올라간다. 그동안 화면에는
       작은 숫자 하나만 바뀌어 아무도 알아채지 못했다. 칸이 오르는 순간을
       크게 알리고, 무대의 열기도 같이 올린다. */
    let lastComboTier=0;
    function updateComboHeat(){
      const stage=$('[data-boss-stage]');if(!stage)return;
      const tier=Math.round((bossMultiplier()-1)/.25);   // 0 ~ 6
      stage.classList.remove('boss-heat-1','boss-heat-2','boss-heat-3');
      if(tier>=1)stage.classList.add('boss-heat-'+Math.min(3,tier));   // 콤보 4·7·10 에서 한 칸씩
      // 각성. 콤보 열 번을 이어야 열리는 숨은 상태다.
      stage.classList.toggle('boss-overdrive',boss.combo>=OVERDRIVE_COMBO);
      /* 각성은 배수가 오르는 자리와 어긋난 콤보에서 열린다. 배수가 오를 때만
         알리도록 짜 두었더니 각성이 조용히 켜져 아무도 못 봤다. */
      const 각성열림=boss.combo>=OVERDRIVE_COMBO&&!boss.overdriveShown&&boss.running;
      if(각성열림){boss.overdriveShown=true;announceCombo(tier,'각성')}
      else if(tier>lastComboTier&&boss.running)announceCombo(tier);
      if(boss.combo===0)boss.overdriveShown=false;
      lastComboTier=tier;
    }
    function announceCombo(tier,label){
      const layer=$('[data-boss-fx]');if(!layer)return;
      const tag=document.createElement('s');
      tag.className='boss-combo-up'+(label?' boss-combo-awake':'');
      tag.innerHTML=label
        ?`<em>${label}</em><b>${boss.combo} COMBO</b>`
        :`<em>COMBO ×${bossMultiplier().toFixed(2)}</em><b>${boss.combo}연속</b>`;
      layer.append(tag);setTimeout(()=>tag.remove(),1150);
    }
    function launchBossHealFx(amount){
      const layer=$('[data-boss-fx]'),stage=$('[data-boss-stage]');if(!layer||!amount)return;const impact=document.createElement('b');impact.className='boss-impact boss-heal-impact';impact.textContent=`+${amount} HP`;layer.append(impact);stage.classList.remove('boss-heal-pulse');void stage.offsetWidth;stage.classList.add('boss-heal-pulse');setTimeout(()=>{impact.remove();stage.classList.remove('boss-heal-pulse')},820)
    }
    function resolveBossV2(value,button){
      if(!boss.running||boss.locked)return;boss.locked=true;boss.attempts++;const q=boss.q,box=$('.answer-grid',$('[data-boss-body]')),ok=String(value)===q.correct,answerSeconds=(performance.now()-boss.questionStartedAt)/1000;api.markAnswers(box,q,value,button);const st=$('[data-boss-status]'),monster=$('[data-boss-monster]');
      if(ok){
        boss.combo++;boss.correct++;boss.bestCombo=Math.max(boss.bestCombo||0,boss.combo);
        const shieldBattle=cfg.mechanic==='factor-shield',reflectBattle=cfg.mechanic==='conjugate-reflect',gradeBattle=cfg.mechanic==='degree-grade',chaosBattle=cfg.mechanic==='chaos-split',sideBattle=cfg.mechanic==='side-switch',stitchBattle=cfg.mechanic==='continuity-stitch',squeezeBattle=cfg.mechanic==='squeeze-walls',forbiddenBattle=cfg.mechanic==='forbidden-seal',differenceBattle=cfg.mechanic==='h-collapse',productBattle=cfg.mechanic==='product-blades',sniperBattle=cfg.mechanic==='sniper-lock',stepBattle=cfg.mechanic==='step-lock',breakingShield=shieldBattle&&boss.shield>0,reflecting=reflectBattle&&boss.reflectCharge===1,chaosLimit=boss.phase===3?3.5:boss.phase===2?4.1:4.8,fastFusion=chaosBattle&&answerSeconds<=chaosLimit,boundaryCrossing=sideBattle&&boss.lastSide&&boss.lastSide!==q.side,completingStitch=stitchBattle&&boss.stitches===2,withinSqueezeWindow=squeezeBattle&&!boss.wallCrushed&&answerSeconds<=squeezeSafeWindow(),breakingForbiddenSeal=forbiddenBattle&&boss.orthodoxSeal===1,exposingHCore=differenceBattle&&boss.hStep===2,completingProduct=productBattle&&q.blade==='right'&&boss.leftBladeReady,firingSniper=sniperBattle&&boss.sniperLock===2,finishingStep=stepBattle&&boss.lockStep===(lockStepCount())-1;
        if(breakingShield)boss.shield--;if(reflectBattle)boss.reflectCharge=reflecting?0:1;
        let chaosPenalty=0;if(chaosBattle){if(fastFusion){boss.splitCount=Math.max(1,boss.splitCount-1);boss.time=Math.min(boss.limit,boss.time+1)}else{boss.splitCount=Math.min(4,boss.splitCount+1);chaosPenalty=boss.splitCount;boss.time=Math.max(0,boss.time-chaosPenalty)}}
        if(sideBattle){boss.boundaryStreak++;boss.lastSide=q.side;boss.nextSide=q.side==='left'?'right':'left'}
        if(stitchBattle)boss.stitches=Math.min(3,boss.stitches+1);
        if(squeezeBattle&&withinSqueezeWindow){boss.wallEscapes++;boss.wallGap=100;boss.time=Math.min(boss.limit,boss.time+1.2);$('[data-boss-stage]').classList.add('boss-wall-repel')}
        if(forbiddenBattle){boss.orthodoxSeal=Math.max(0,boss.orthodoxSeal-1);boss.lastForbidden=false;if(breakingForbiddenSeal){boss.sealBreaks++;boss.forbiddenPower=Math.max(0,boss.forbiddenPower-1);$('[data-boss-stage]').classList.add('boss-seal-break')}}
        if(stepBattle){if(finishingStep){boss.lockResetOnNext=true;$('[data-boss-stage]').classList.add('boss-step-finish')}else boss.lockStep=Math.min((lockStepCount())-1,(boss.lockStep||0)+1)}
        if(sniperBattle){if(firingSniper){boss.sniperShots+=1;boss.sniperResetOnNext=true;$('[data-boss-stage]').classList.add('boss-sniper-fire')}else boss.sniperLock=Math.min(2,boss.sniperLock+1)}
        if(differenceBattle){boss.hStep=Math.min(3,boss.hStep+1);$('[data-boss-stage]').classList.add('boss-h-collapse');if(exposingHCore)boss.hCoreHits++}
        if(productBattle){if(q.blade==='left'){boss.leftBladeReady=true;boss.nextBlade='right'}else{boss.rightBladeReady=true;if(completingProduct){boss.bladePairs++;$('[data-boss-stage]').classList.add('boss-blade-cross')}}}
        const gradeMultiplier=gradeBattle?(q.level==='deep'?1.8:q.level==='applied'?1:.55):1;
        const hit=Math.max(1,Math.round((breakingShield?70:reflectBattle?(reflecting?cfg.baseDamage*2.15:85):chaosBattle?cfg.baseDamage*(fastFusion?1.35:.72):sideBattle?cfg.baseDamage*(boundaryCrossing?1.7:.8):stitchBattle?cfg.baseDamage*(completingStitch?2.7:.8):squeezeBattle?cfg.baseDamage*(withinSqueezeWindow?1.35:.65):forbiddenBattle?(breakingForbiddenSeal?cfg.baseDamage*2.8:78):differenceBattle?(exposingHCore?cfg.baseDamage*2.9:92):productBattle?(completingProduct?cfg.baseDamage*2.4:90):sniperBattle?(firingSniper?cfg.baseDamage*2.75:88):stepBattle?(finishingStep?cfg.baseDamage*cfg.finishMultiplier:cfg.tapDamage):cfg.baseDamage*gradeMultiplier)*bossMultiplier()));
        const nextHp=boss.hp-hit,requiresFinisher=stitchBattle&&!completingStitch||forbiddenBattle&&!breakingForbiddenSeal||differenceBattle&&!exposingHCore||productBattle&&!completingProduct||sniperBattle&&!firingSniper||stepBattle&&!finishingStep;boss.hp=requiresFinisher?Math.max(1,nextHp):Math.max(0,nextHp);boss.damage+=hit;launchBossFx(true,hit);monster.classList.remove('boss-attack');monster.classList.add('boss-hit');if(sideBattle)$('[data-boss-stage]').classList.toggle('boss-boundary-cross',!!boundaryCrossing);if(stitchBattle&&completingStitch)$('[data-boss-stage]').classList.add('boss-stitch-complete');
        st.textContent=breakingShield?`보호막 파괴 · ${boss.shield}칸 남음 · ${q.explanation}`:reflectBattle?(reflecting?`켤레 반사! ${hit} DAMAGE · ${q.explanation}`:`첫 거울 충전 · 다음 정답이 반사 공격이 됩니다. · ${q.explanation}`):gradeBattle?`${boss.attackGrade}등급 ${boss.attackGrade==='A'?'최고차항 관통':boss.attackGrade==='B'?'정규 공격':'감쇠 공격'} · ${hit} DAMAGE · ${q.explanation}`:chaosBattle?(fastFusion?`빠른 융합! ${answerSeconds.toFixed(1)}초 · ${hit} DAMAGE · 시간 +1초 · ${boss.splitCount} ${boss.splitCount===1?'BODY':'BODIES'}`:`분열 발생 · ${answerSeconds.toFixed(1)}초 · ${hit} DAMAGE · 시간 −${chaosPenalty}초 · ${boss.splitCount} BODIES`):sideBattle?(boundaryCrossing?`경계 관통! ${q.side==='left'?'우→좌':'좌→우'} · ${hit} DAMAGE · ${q.explanation}`:`${q.side==='left'?'왼쪽':'오른쪽'} 가면 파괴 · ${hit} DAMAGE · ${q.explanation}`):stitchBattle?(completingStitch?`봉합 완료! 재생 차단 · ${hit} DAMAGE · ${q.explanation}`:`금실 봉합 ${boss.stitches}/3 · ${hit} DAMAGE · ${q.explanation}`):squeezeBattle?(withinSqueezeWindow?`압착 회피! ${answerSeconds.toFixed(1)}초 · ${hit} DAMAGE · 시간 +1.2초 · ${q.explanation}`:`쌍벽 충돌 후 반격 · ${answerSeconds.toFixed(1)}초 · ${hit} DAMAGE · ${q.explanation}`):forbiddenBattle?(breakingForbiddenSeal?`정석 봉인 해제! ${q.sealMethod} · ${hit} DAMAGE · ${q.explanation}`:`정석 각인 ${3-boss.orthodoxSeal}/3 · ${q.sealMethod} · ${hit} DAMAGE · ${q.explanation}`):differenceBattle?(exposingHCore?`h→0 완성! 접선 코어 노출 · ${hit} DAMAGE · ${q.explanation}`:`할선 고리 수축 · h=${hDistanceLabel()} · ${hit} DAMAGE · ${q.explanation}`):stepBattle?(finishingStep?`${cfg.finishText} ${hit} DAMAGE · ${q.explanation}`:`${cfg.lockLabel} ${stepLockLabel()} · ${hit} DAMAGE · ${q.explanation}`):sniperBattle?(firingSniper?`조준 완료 · 접선 레이저 발사! ${hit} DAMAGE · ${q.explanation}`:`${q.sniperStep} 고정 · 조준 ${sniperLockLabel()} · ${hit} DAMAGE · ${q.explanation}`):productBattle?(completingProduct?`쌍날 교차 베기! ${hit} DAMAGE · ${q.explanation}`:`청록 왼날 충전 · ${hit} DAMAGE · 다음은 금빛 uv′ · ${q.explanation}`):`${hit} DAMAGE · ${q.explanation}`;if(chaosBattle)st.textContent+=` · ${q.explanation}`;st.className=chaosBattle&&!fastFusion||squeezeBattle&&!withinSqueezeWindow?'boss-status bad':'boss-status good';
        const ratio=boss.hp/boss.maxHp,nextPhase=Math.max(bossStartPhase(),ratio<=.34?3:ratio<=.67?2:1);
        if(nextPhase!==boss.phase){boss.phase=nextPhase;if(shieldBattle){boss.shield=nextPhase===2?2:1;$('[data-boss-mood]').textContent=`석문 재결합 · 보호막 ${boss.shield}칸`}else if(reflectBattle){boss.reflectCharge=0;$('[data-boss-mood]').textContent=`거울 재정렬 · PHASE ${nextPhase}`}else if(gradeBattle)$('[data-boss-mood]').textContent=`${nextPhase===2?'중간 차수 장갑 균열':'최고차항 코어 노출'} · PHASE ${nextPhase}`;else if(chaosBattle)$('[data-boss-mood]').textContent=`예고 단축 · ${nextPhase===2?'4.1':'3.5'}초 · PHASE ${nextPhase}`;else if(sideBattle)$('[data-boss-mood]').textContent=`가면 격상 · ${boss.nextSide==='left'?'← 좌극한':'우극한 →'} · PHASE ${nextPhase}`;else if(stitchBattle)$('[data-boss-mood]').textContent=`재생축 격상 · 봉합 완료 · PHASE ${nextPhase}`;else if(squeezeBattle)$('[data-boss-mood]').textContent=`쌍벽 가속 · 안전창 ${squeezeSafeWindow().toFixed(1)}초 · PHASE ${nextPhase}`;else if(forbiddenBattle)$('[data-boss-mood]').textContent=`금단 문양 격상 · 정석 봉인 ${boss.orthodoxSeal}/3 · PHASE ${nextPhase}`;else if(differenceBattle)$('[data-boss-mood]').textContent=`할선 고리 격상 · h=${hDistanceLabel()} · PHASE ${nextPhase}`;else if(stepBattle)$('[data-boss-mood]').textContent=`${cfg.lockLabel} 격상 · ${stepLockLabel()} · PHASE ${nextPhase}`;else if(sniperBattle)$('[data-boss-mood]').textContent=`조준경 격상 · 조준 ${sniperLockLabel()} · PHASE ${nextPhase}`;else if(productBattle)$('[data-boss-mood]').textContent=`쌍날 격상 · ${bladeStateLabel()} · PHASE ${nextPhase}`;else $('[data-boss-mood]').textContent=`${nextPhase===2?'응용 장갑 전개':'심화 코어 폭주'} · PHASE ${nextPhase}`}
        else if(shieldBattle)$('[data-boss-mood]').textContent=boss.shield?`공통인수 봉인 · ${boss.shield}칸`:`코어 노출 · ${boss.combo} COMBO`;
        else if(reflectBattle)$('[data-boss-mood]').textContent=reflecting?`켤레 반사 성공 · ${boss.combo} COMBO`:'은빛 거울 충전 · 다음 공격 반사';
        else if(gradeBattle)$('[data-boss-mood]').textContent=`${boss.attackGrade} GRADE · ${hit} DAMAGE`;
        else if(chaosBattle)$('[data-boss-mood]').textContent=fastFusion?`혼돈 융합 · ${boss.splitCount} ${boss.splitCount===1?'BODY':'BODIES'}`:`미정형 분열 · ${boss.splitCount} BODIES`;
        else if(sideBattle)$('[data-boss-mood]').textContent=`다음 가면 · ${boss.nextSide==='left'?'← 좌극한':'우극한 →'}${boundaryCrossing?' · 경계 관통':''}`;
        else if(stitchBattle)$('[data-boss-mood]').textContent=completingStitch?'금실 완성 · 재생 차단':`곡선 봉합 중 · ${boss.stitches}/3`;
        else if(squeezeBattle)$('[data-boss-mood]').textContent=withinSqueezeWindow?`쌍벽 밀어내기 · ${boss.wallEscapes}회 회피`:'압착 후 간신히 반격';
        else if(forbiddenBattle)$('[data-boss-mood]').textContent=breakingForbiddenSeal?`정석 봉인 붕괴 · ${boss.sealBreaks}회 해제`:`${q.sealMethod} 각인 · 정석 ${3-boss.orthodoxSeal}/3`;
        else if(differenceBattle)$('[data-boss-mood]').textContent=exposingHCore?`접선 코어 노출 · ${boss.hCoreHits}회 관통`:`할선 고리 수축 · h=${hDistanceLabel()}`;
        else if(productBattle)$('[data-boss-mood]').textContent=completingProduct?`쌍날 교차 · ${boss.bladePairs}회 연계`:'청록 왼날 충전 · 다음은 금빛 오른날';
        else if(sniperBattle)$('[data-boss-mood]').textContent=firingSniper?`접선 레이저 명중 · ${boss.sniperShots}회 발사`:`${q.sniperStep} 고정 · 조준 ${sniperLockLabel()}`;
        else $('[data-boss-mood]').textContent=`${boss.combo} COMBO · 공격 적중`;
        if(completingStitch)boss.reopenOnNext=true;if(breakingForbiddenSeal)boss.resealOnNext=true;if(exposingHCore)boss.hResetOnNext=true;if(completingProduct)boss.bladesResetOnNext=true;if(boss.hp<=0)cancelAnimationFrame(boss.raf);renderBossHud();setTimeout(()=>{monster.classList.remove('boss-hit');$('[data-boss-stage]').classList.remove('boss-boundary-cross','boss-wall-repel','boss-seal-break','boss-h-collapse','boss-blade-cross');if(!boss.running)return;if(boss.hp<=0)finishBossV2(true);else{st.className='boss-status hidden';renderBossV2()}},620)
      }else{
        boss.combo=0;const reflectBattle=cfg.mechanic==='conjugate-reflect',chaosBattle=cfg.mechanic==='chaos-split',sideBattle=cfg.mechanic==='side-switch',stitchBattle=cfg.mechanic==='continuity-stitch',squeezeBattle=cfg.mechanic==='squeeze-walls',forbiddenBattle=cfg.mechanic==='forbidden-seal',differenceBattle=cfg.mechanic==='h-collapse',productBattle=cfg.mechanic==='product-blades',sniperBattle=cfg.mechanic==='sniper-lock',stepBattle=cfg.mechanic==='step-lock',usedForbidden=forbiddenBattle&&String(value).includes('로피탈');if(chaosBattle)boss.splitCount=Math.min(4,boss.splitCount+1);if(sideBattle){boss.boundaryStreak=0;boss.lastSide=null;boss.nextSide=q.side;boss.targetSide=q.side}let healBurst=0;if(stitchBattle){boss.stitches=0;boss.reopenOnNext=false;boss.regenBuffer=0;healBurst=Math.min(90+boss.phase*20,boss.maxHp-boss.hp);boss.hp+=healBurst;boss.healed+=healBurst}if(forbiddenBattle){boss.lastForbidden=usedForbidden;boss.orthodoxSeal=Math.min(3,boss.orthodoxSeal+1);boss.resealOnNext=false;if(usedForbidden){boss.forbiddenPower=Math.min(3,boss.forbiddenPower+1);healBurst=Math.min(120+boss.forbiddenPower*40,boss.maxHp-boss.hp);boss.hp+=healBurst;boss.healed+=healBurst;$('[data-boss-stage]').classList.add('boss-forbidden-cast')}}if(differenceBattle){boss.hStep=Math.max(0,boss.hStep-1);boss.hResetOnNext=false;$('[data-boss-stage]').classList.add('boss-h-rebound')}if(stepBattle){boss.lockStep=0;boss.lockBreaks+=1;boss.lockResetOnNext=false;$('[data-boss-stage]').classList.add('boss-step-break')}if(sniperBattle){boss.sniperLock=0;boss.sniperTarget=null;boss.sniperResetOnNext=false;$('[data-boss-stage]').classList.add('boss-sniper-miss')}if(productBattle){boss.leftBladeReady=false;boss.rightBladeReady=false;boss.nextBlade='left';boss.bladesResetOnNext=false;boss.productPair=null;$('[data-boss-stage]').classList.add('boss-blade-break')}if(healBurst>0)launchBossHealFx(healBurst);const penalty=reflectBattle?3:chaosBattle?2+boss.splitCount:sideBattle?3:squeezeBattle?(boss.wallCrushed?3:4):forbiddenBattle?(usedForbidden?4:3):differenceBattle?3:productBattle?3:sniperBattle?3:stepBattle?3:2;boss.time=Math.max(0,boss.time-penalty);if(cfg.mechanic==='factor-shield')boss.shield=Math.min(3,boss.shield+1);if(reflectBattle)boss.reflectCharge=0;if(squeezeBattle){boss.wallGap=0;boss.wallCrushed=true;$('[data-boss-stage]').classList.add('boss-wall-slam')}launchBossFx(false,0,penalty);monster.classList.remove('boss-hit');monster.classList.add('boss-attack');
        $('[data-boss-mood]').textContent=cfg.mechanic==='factor-shield'?`봉인 복구 · 보호막 ${boss.shield}칸`:reflectBattle?'반사 역류 · 거울 충전 소멸':chaosBattle?`오답 분열 · ${boss.splitCount} BODIES`:sideBattle?`${q.side==='left'?'왼쪽':'오른쪽'} 가면 재봉인`:stitchBattle?'금실 파열 · 재생축 재가동':squeezeBattle?'오답 압착 · 쌍벽 충돌':forbiddenBattle?(usedForbidden?`금단 지름길 흡수 · 마력 ${boss.forbiddenPower}/3`:`정석 봉인 복구 · ${boss.orthodoxSeal}/3`):differenceBattle?`할선 고리 팽창 · h=${hDistanceLabel()}`:productBattle?'쌍날 연계 파괴 · 왼날부터 재시작':sniperBattle?'조준 실패 · 접점부터 다시 포착':'철갑 반격 · COMBO RESET';
        st.textContent=`오답 · 시간 −${penalty}초${cfg.mechanic==='factor-shield'?' · 보호막 +1':reflectBattle?' · 거울 충전 초기화':chaosBattle?` · ${boss.splitCount}개로 분열`:sideBattle?' · 같은 방향을 다시 공격':stitchBattle?` · 봉합 0/3 · HP +${healBurst}`:squeezeBattle?' · 벽 간격 0%':forbiddenBattle?(usedForbidden?` · 로피탈 지름길 사용 · HP +${healBurst}`:` · 정석 봉인 ${boss.orthodoxSeal}/3`):differenceBattle?` · h가 ${hDistanceLabel()}로 다시 벌어짐`:productBattle?' · 쌍날 충전 초기화':sniperBattle?' · 조준 0/2로 초기화':''} · ${q.explanation}`;st.className='boss-status bad';renderBossHud();setTimeout(()=>{monster.classList.remove('boss-attack');$('[data-boss-stage]').classList.remove('boss-wall-slam','boss-forbidden-cast','boss-h-rebound','boss-blade-break','boss-sniper-miss');if(!boss.running)return;st.className='boss-status hidden';renderBossV2()},760)
      }
    }
    function finishBossV2(cleared){
      if(!boss.running)return;stopBossTimer();const r=api.rec(),previousBest=r.bossBestDamage||0,personalBest=boss.damage>previousBest;r.bossBestDamage=Math.max(previousBest,boss.damage);if(cleared)r.bossClears++;api.save();api.updateStats();if(api.telemetry&&bossActivePlay){api.telemetry.finishPlay(bossActivePlay.playId,{score:boss.damage,accuracy:boss.attempts?Math.round(boss.correct/boss.attempts*100):0,playTime:Math.round((boss.limit-boss.time)*10)/10,retry:bossSessionPlayIndex>1,sessionPlayIndex:bossSessionPlayIndex,personalBest});bossActivePlay=null}const monster=$('[data-boss-monster]');monster.classList.remove('boss-hit','boss-attack');if(cleared)monster.classList.add('boss-defeated');const defeatText=cfg.mechanic==='factor-shield'?'석문 붕괴':cfg.mechanic==='conjugate-reflect'?'거울 연성 해제':cfg.mechanic==='degree-grade'?'최고차항 코어 붕괴':cfg.mechanic==='chaos-split'?'혼돈 코어 융합':cfg.mechanic==='side-switch'?'경계선 절단':cfg.mechanic==='continuity-stitch'?'재생축 정지':cfg.mechanic==='squeeze-walls'?'쌍벽 분쇄':cfg.mechanic==='forbidden-seal'?'금단 문양 봉인':cfg.mechanic==='h-collapse'?'접선 코어 소멸':cfg.mechanic==='product-blades'?'쌍날 코어 절단':cfg.mechanic==='sniper-lock'?'조준선 절단':cfg.mechanic==='step-lock'?cfg.defeatText:'철갑 파괴';$('[data-boss-mood]').textContent=cleared?`${defeatText} · 승리`:'시간 종료 · 전투 기록 저장';if(cleared)$$('.boss-node').forEach(x=>x.className='boss-node done');renderBossHud();const nextLimit=currentBossV2Limit(),nextLevel=api.levels.find(level=>level.id===api.level())?.name||'기본';/* 무결점 격파. 한 번도 틀리지 않고 이긴 사람에게만 보이는 것이라
   따로 안내하지 않는다 — 해내면 저절로 알게 된다. */
const flawless=cleared&&boss.attempts>0&&boss.correct===boss.attempts;
if(flawless){
  const stage=$('[data-boss-stage]');if(stage)stage.classList.add('boss-flawless');
  const layer=$('[data-boss-fx]');
  if(layer){const tag=document.createElement('s');tag.className='boss-combo-up boss-combo-awake boss-flawless-tag';
    tag.innerHTML='<em>무결점</em><b>FLAWLESS</b>';layer.append(tag);setTimeout(()=>tag.remove(),1800)}
}
if(cleared&&boss.bestCombo>(r.bossBestCombo||0))r.bossBestCombo=boss.bestCombo;
$('[data-boss-body]').innerHTML=`<div class="boss-result-v2${flawless?' boss-result-flawless':''}"><span>${flawless?'FLAWLESS CLEAR':cleared?'BOSS CLEAR':'TIME OVER'}</span><strong>${boss.damage} DAMAGE</strong><p>${boss.correct}문제 정답 · 최고 콤보 ${boss.bestCombo} · 최고 데미지 ${r.bossBestDamage}</p><small>${cleared?`다음 전투 제한시간은 ${nextLimit.toFixed(0)}초입니다. 선택한 ${nextLevel} 난이도로 다시 시작합니다.`:'남은 HP '+Math.max(0,boss.hp)+' · 콤보를 유지하면 더 큰 데미지를 줄 수 있습니다.'}</small></div>`;$('[data-boss-status]').className='boss-status hidden';const start=$('[data-boss-start]');start.textContent=cleared?'더 빠른 보스 도전':'바로 다시 도전';start.classList.remove('hidden');if(window.jpMotionFeedback)window.jpMotionFeedback(cleared?'success':'info',cleared?'보스 클리어!':`${boss.damage} 데미지 · 다시 도전하세요.`)
    }

    // ── 화면 ────────────────────────────────────────────────────────
    // 보스 이름·초상·상태 칸은 모두 설정에서 나온다. 페이지는 껍데기만 두른다.
    const bossName = cfg?cfg.name:fallbackBossNames[skill.group];
    const bossDifficultyCopy = cfg?.mechanic==='degree-grade'?'난도 상승: <b>기본 → 응용 → 심화</b>':'선택 난이도 <b>고정</b> · 전투 단계만 상승';
    const initialBossStateLabel = cfg?.mechanic==='factor-shield'?'SHIELD':cfg?.mechanic==='conjugate-reflect'?'MIRROR':cfg?.mechanic==='degree-grade'?'GRADE':cfg?.mechanic==='chaos-split'?'BODIES':cfg?.mechanic==='side-switch'?'방향':cfg?.mechanic==='continuity-stitch'?'봉합':cfg?.mechanic==='squeeze-walls'?'벽 간격':cfg?.mechanic==='forbidden-seal'?'정석 봉인':cfg?.mechanic==='h-collapse'?'h 거리':cfg?.mechanic==='product-blades'?'쌍날':cfg?.mechanic==='sniper-lock'?'조준':cfg?.mechanic==='step-lock'?cfg.lockLabel:'PHASE';
    const initialBossStateValue = cfg?.mechanic==='factor-shield'?3:cfg?.mechanic==='conjugate-reflect'?'0/2':cfg?.mechanic==='degree-grade'?'C':cfg?.mechanic==='side-switch'?'← 좌':cfg?.mechanic==='continuity-stitch'?'0/3':cfg?.mechanic==='squeeze-walls'?'100%':cfg?.mechanic==='forbidden-seal'?'3/3':cfg?.mechanic==='h-collapse'?'1':cfg?.mechanic==='product-blades'?'좌 대기':cfg?.mechanic==='sniper-lock'?'0/2':cfg?.mechanic==='step-lock'?`0/${lockStepCount()}`:1;
    /* 대단원 보스는 전용 초상을 먼저 쓴다. 예전 데이터의 모자이크는
       혹시 전용 파일을 아직 붙이지 못한 경우에만 안전망으로 남긴다. */
    const bossPicture = cfg.theme==='unit'&&cfg.art
      ? `<img class="boss-art" src="${cfg.art}" alt="${cfg.alt}">`
      : cfg.mosaic&&cfg.mosaic.length
      ?`<div class="boss-art-mosaic" role="img" aria-label="${cfg.alt}">`
        +cfg.mosaic.map(src=>`<i style="background-image:url('${src}')"></i>`).join('')
        +'</div>'
      : true&&cfg.mobileArt?`<picture class="boss-art-picture"><source media="(max-width:700px)" srcset="${cfg.mobileArt}"><img class="boss-art" src="${cfg.art}" alt="${cfg.alt}"></picture>`:true?`<img class="boss-art" src="${cfg.art}" alt="${cfg.alt}">`:'';
    const bossVisual = true?`<div class="boss-art-frame">${bossPicture}</div>`:'<svg class="boss-creature" viewBox="0 0 240 190" role="img" aria-hidden="true"><path class="boss-wing" d="M73 73C36 44 16 62 27 91c8 22 29 30 52 27M167 73c37-29 57-11 46 18-8 22-29 30-52 27"/><path class="boss-horn" d="M86 50 63 16l42 23M154 50l23-34-42 23"/><path class="boss-body-shape" d="M120 34c-45 0-70 31-64 75 5 39 27 64 64 64s59-25 64-64c6-44-19-75-64-75Z"/><path class="boss-mask" d="M76 78c29-17 59-17 88 0l-11 47c-22 17-44 17-66 0Z"/><path class="boss-eye" d="m88 87 23 8-25 7Zm64 0-23 8 25 7Z"/><path class="boss-core" d="m120 117 13 18-13 15-13-15Z"/></svg>';

    function startCopy() {
      return `<strong>HP ${bossMaxHp()} · 첫 제한시간 ${bossBaseTime()}초</strong><p>${cfg.start}</p>`;
    }

    function stageHtml() {
      return `<div class="boss-stage boss-v2 boss-${cfg.theme}"${cfg.accent ? ` style="--boss-accent:${cfg.accent}"` : ''} data-boss-stage>`
        + '<div class="boss-arena"><div class="boss-fx-layer" data-boss-fx aria-hidden="true"></div>'
        + `<div class="boss-monster" data-boss-monster aria-label="${bossName}"><div class="boss-aura"></div>${bossVisual}`
        + `<strong>${bossName}</strong><span data-boss-mood>도전자를 기다리는 중</span></div>`
        + `<div class="boss-dashboard"><div class="boss-hp-label"><span>BOSS HP</span><strong data-boss-hp-text>${bossMaxHp()} / ${bossMaxHp()}</strong></div>`
        + '<div class="boss-hp-track"><div data-boss-hp></div></div>'
        + `<div class="boss-clock"><span>남은 시간</span><strong data-boss-time>${bossBaseTime()}.0</strong><em>SEC</em></div>`
        + '<div class="boss-timer-track"><div data-boss-timer></div></div>'
        + '<div class="boss-combat-stats"><div><span>DAMAGE</span><b data-boss-damage>0</b></div>'
        + '<div><span>COMBO</span><b data-boss-combo>×1.0</b></div>'
        + `<div><span data-boss-state-label>${initialBossStateLabel}</span><b data-boss-phase>${initialBossStateValue}</b></div></div>`
        + `<small class="boss-limit-copy">${bossDifficultyCopy}</small></div></div>`
        + '<div class="boss-progress"><i class="boss-node"></i><i class="boss-node"></i><i class="boss-node"></i></div>'
        + `<div data-boss-body><div class="boss-start-copy">${startCopy()}</div></div>`
        + '<div class="boss-status hidden" data-boss-status></div>'
        + `<button class="primary-action boss-action" data-boss-start>⚔ ${bossBaseTime()}초 전투 시작</button></div>`;
    }

    // 전투 전 상태로 되돌린다. 난이도를 바꿀 때마다 부른다.
    function reset() {
      stopBossTimer();
      const limit = currentBossV2Limit();
      boss = {running:false,raf:0,time:limit,limit,hp:bossMaxHp(),maxHp:bossMaxHp(),damage:0,combo:0,bestCombo:0,overdriveShown:false,correct:0,attempts:0,phase:bossStartPhase(),shield:cfg.mechanic==='factor-shield'?3:0,reflectCharge:0,attackGrade:'C',splitCount:1,nextSide:'left',targetSide:'left',lastSide:null,boundaryStreak:0,stitches:0,regenBuffer:0,healed:0,reopenOnNext:false,wallGap:100,wallCrushed:false,wallEscapes:0,orthodoxSeal:3,forbiddenPower:0,sealBreaks:0,resealOnNext:false,lastForbidden:false,hStep:0,hCoreHits:0,hResetOnNext:false,leftBladeReady:false,rightBladeReady:false,nextBlade:'left',bladePairs:0,bladesResetOnNext:false,productPair:null,sniperLock:0,sniperTarget:null,sniperShots:0,sniperResetOnNext:false,lockStep:0,lockBreaks:0,lockResetOnNext:false,questionStartedAt:0,q:null,locked:false};
      $('[data-boss-body]').innerHTML = `<div class="boss-start-copy">${startCopy()}</div>`;
      $('[data-boss-status]').className = 'boss-status hidden';
      const st = $('[data-boss-start]');
      st.textContent = `⚔ ${limit}초 전투 시작`;
      st.classList.remove('hidden');
      $$('.boss-node').forEach((x) => { x.className = 'boss-node' });
      const monster = $('[data-boss-monster]');
      if (monster) monster.classList.remove('boss-hit', 'boss-attack', 'boss-defeated');
      const mood = $('[data-boss-mood]');
      if (mood) mood.textContent = '도전자를 기다리는 중';
      renderBossHud();
    }

    function mount() {
      $('[data-boss-start]').addEventListener('click', startBossV2);
      reset();
    }

    return {
      state: () => boss,
      stageHtml: stageHtml,
      startCopy: startCopy,
      mount: mount,
      reset: reset,
      stop: stopBossTimer,
      limit: currentBossV2Limit,
      maxHp: bossMaxHp,
      baseTime: bossBaseTime,
      startPhase: bossStartPhase,
      questionLevel: bossQuestionLevel
    };
  }

  window.JPBossEngine = { create: create };
}());
