import { PhysicsEngine } from '../physics/PhysicsEngine';
import { FIXED_DT, TABLE } from '../physics/config';
import { POOL_TABLE, createPoolRack } from '../physics/pool';
import { createLayout } from '../physics/presets';
import { PowerMeter } from './PowerMeter';
import { MatchController } from '../rules/MatchController';
import { createCaromOpening } from '../rules/layouts';
import type { BreakOption, MatchConfig, RuleOutcome } from '../rules/types';
import type { PhysicsEvent, PhysicsSnapshot, ShotInput, ShotResult, Vec2 } from '../physics/types';

export type GamePhase = 'menu'|'aiming'|'charging'|'stroking'|'moving'|'placing'|'choosing'|'thinking'|'ai-aim'|'finished';
export type LayoutName = 'opening'|'collision'|'cushion'|'spin'|'three';
interface ReplayReturn { engine: PhysicsEngine; phase: GamePhase; cue: string; angle: number; power: number; tip: {x:number;y:number}; calledBall?: string; calledPocket?: string; safety: boolean }

/** Single owner of shot, match, replay and physical rule actions. UI dispatches intents only. */
export class GameManager {
  match = new MatchController({ mode: 'practice' });
  engine = new PhysicsEngine(createLayout('opening'), TABLE);
  phase: GamePhase = 'menu';
  paused = false;
  layout: LayoutName = 'opening';
  cueBall = 'white';
  angle = -.16;
  power = .45;
  tip = { x: 0, y: 0 };
  calledBall: string | undefined;
  calledPocket: string | undefined;
  safety = false;
  readonly meter = new PowerMeter();
  shotCount = 0;
  lastShot: ShotResult | null = null;
  lastOutcome: RuleOutcome | null = null;
  replaying = false;
  strokeProgress = 0;
  private accumulator = 0;
  private pending: ShotInput | null = null;
  private before: PhysicsSnapshot | null = null;
  private eventOffset = 0;
  private shotStartTime = 0;
  private replayReturn: ReplayReturn | null = null;
  private aiShot: ShotInput | null = null;
  private aiElapsed = 0;
  onEvent: (event: PhysicsEvent) => void = () => {};
  onChange: () => void = () => {};
  onFinished: () => void = () => {};
  onMatchEnd: () => void = () => {};

  get isAITurn(): boolean { return this.match.config.mode === 'ai' && this.match.state.currentPlayer === 1 && this.match.state.status === 'playing'; }
  get canAim(): boolean { return this.phase === 'aiming' && !this.paused && !this.isAITurn; }
  get busy(): boolean { return this.phase === 'stroking' || this.phase === 'moving'; }
  get canPressShot(): boolean { return !this.paused && !this.isAITurn && (this.phase === 'aiming' || this.phase === 'charging'); }
  get canReplay(): boolean { return !this.paused && !this.isAITurn && !this.replaying && !!this.lastShot && !this.busy && this.phase !== 'menu' && this.phase !== 'charging'; }
  get input(): ShotInput { return { ballId: this.cueBall, angle: this.angle, power: this.power, tip: {...this.tip}, calledBall: this.calledBall, calledPocket: this.calledPocket, safety: this.safety }; }

  start(config?: Partial<MatchConfig>): void {
    if (config) { this.newMatch(config); return; }
    this.phase = 'aiming'; this.paused = false; this.onChange();
  }
  newMatch(config: Partial<MatchConfig> = this.match.config): void {
    this.match = new MatchController(config);
    this.engine = new PhysicsEngine(this.match.initialBalls(), this.match.config.discipline === 'eight-ball' ? POOL_TABLE : TABLE);
    this.clearShot(); this.layout = 'opening'; this.cueBall = this.match.cueBall; this.angle = this.match.config.discipline === 'eight-ball' ? 0 : -.12;
    this.paused = false; this.phase = this.nextPhase(); this.onChange();
  }
  pressShot(): boolean {
    if (!this.canPressShot || !this.engine.settled) return false;
    if (this.phase === 'aiming') { this.meter.start(); this.power = this.meter.power; this.phase = 'charging'; this.onChange(); return true; }
    this.power = this.meter.stop(); this.phase = 'aiming'; return this.shoot();
  }
  cancelCharge(): void { if (this.phase === 'charging') { this.meter.cancel(); this.phase = 'aiming'; this.onChange(); } }

  reset(layout: LayoutName = this.layout): void {
    if (this.match.config.mode !== 'practice') { this.newMatch(); return; }
    this.layout = layout;
    this.match.reset({discipline: layout === 'three' ? 'three-cushion' : this.match.config.discipline});
    const balls = this.match.config.discipline === 'eight-ball' ? createPoolRack() : createLayout(layout === 'three' ? 'opening' : layout, this.match.config.discipline === 'three-cushion' ? 3 : 4);
    this.engine = new PhysicsEngine(balls,this.match.config.discipline === 'eight-ball' ? POOL_TABLE : TABLE);
    this.clearShot(); this.cueBall = 'white'; this.angle = layout === 'opening' || layout === 'three' ? -.16 : 0;
    this.phase = this.nextPhase(); this.onChange();
  }
  toMenu(): void { this.cancelCharge(); this.aiShot = null; this.phase = 'menu'; this.paused = false; this.onChange(); }

  /** Human captured gauge and AI share the same immutable ShotInput. */
  shoot(input?: ShotInput, automated = false): boolean {
    if (this.paused || !this.engine.settled || this.phase !== 'aiming' || (!automated && this.isAITurn)) return false;
    const shot = input ?? this.input;
    if (!this.replaying && (this.match.state.ballInHand || this.match.state.pendingChoice || this.match.state.status !== 'playing')) return false;
    if (!this.engine.balls.some(b => b.id === shot.ballId && !b.pocketed) || shot.power <= 0 || shot.power > 1 || !Number.isFinite(shot.angle) || Math.hypot(shot.tip.x,shot.tip.y) > .75) return false;
    if (!this.replaying && this.match.config.mode !== 'practice' && shot.ballId !== this.match.cueBall) return false;
    this.pending = structuredClone(shot); this.before = this.engine.snapshot(); this.strokeProgress = 0; this.accumulator = 0;
    this.phase = 'stroking'; this.onChange(); return true;
  }
  beginThinking(): boolean {
    if (!this.isAITurn || this.paused || !['aiming','placing','choosing'].includes(this.phase)) return false;
    this.phase = 'thinking'; this.onChange(); return true;
  }
  executeAI(input: ShotInput): boolean {
    if (!this.isAITurn || !['thinking','aiming'].includes(this.phase) || this.match.state.ballInHand || this.match.state.pendingChoice) return false;
    this.aiShot = structuredClone(input); this.cueBall=input.ballId; this.angle=input.angle; this.power=input.power; this.tip={...input.tip}; this.calledBall=input.calledBall; this.calledPocket=input.calledPocket; this.safety=!!input.safety;
    this.aiElapsed=0; this.phase='ai-aim'; this.onChange(); return true;
  }
  cancelThinking(): void { if (this.phase==='thinking') { this.phase=this.nextPhase(); this.onChange(); } }
  placeCue(point: Vec2): boolean {
    if (this.paused || !this.match.state.ballInHand || !['placing','thinking'].includes(this.phase)) return false;
    if (!this.engine.placeBall('white',point,this.match.state.ballInHandZone === 'head-string' ? 'kitchen' : 'anywhere')) return false;
    this.match.confirmPlacement(); this.phase='aiming'; this.onChange(); return true;
  }
  chooseBreak(option: BreakOption): void { const result=this.match.chooseBreak(option); this.applyPhysicalOutcome(result); this.cueBall=this.match.cueBall; this.phase=this.nextPhase(); this.onChange(); }

  replay(): boolean {
    if (!this.canReplay || !this.lastShot) return false;
    const last=this.lastShot;
    this.replayReturn={engine:this.engine,phase:this.phase,cue:this.cueBall,angle:this.angle,power:this.power,tip:{...this.tip},calledBall:this.calledBall,calledPocket:this.calledPocket,safety:this.safety};
    this.engine=new PhysicsEngine(last.before.balls,this.engine.table); this.cueBall=last.input.ballId; this.angle=last.input.angle; this.power=last.input.power; this.tip={...last.input.tip}; this.replaying=true; this.phase='aiming';
    return this.shoot(last.input);
  }
  movePracticeBall(id: string, point: Vec2): boolean {
    if (this.match.config.mode !== 'practice' || !this.canAim || !this.engine.placeBall(id,point)) return false;
    this.lastShot=null; this.lastOutcome=null; this.onChange(); return true;
  }
  selectPracticeCue(id:'white'|'yellow'):boolean {
    if(!this.canAim||this.match.config.mode!=='practice'||!this.engine.balls.some(b=>b.id===id&&!b.pocketed))return false;
    if(this.match.config.discipline==='eight-ball'&&id!=='white')return false;
    this.match.state.currentPlayer=id==='yellow'?1:0;this.cueBall=id;this.onChange();return true;
  }
  update(delta: number): void {
    if (this.paused) return;
    if (this.phase==='charging') { this.power=this.meter.update(delta); return; }
    if (this.phase==='ai-aim') { this.aiElapsed+=delta; if(this.aiElapsed>=.65&&this.aiShot) { const shot=this.aiShot;this.aiShot=null;this.phase='aiming';this.shoot(shot,true); } return; }
    if (this.phase==='stroking') {
      this.strokeProgress+=delta/.48;
      if(this.strokeProgress>=1&&this.pending) {
        this.engine.events.length=0; this.eventOffset=0; this.shotStartTime=this.engine.time;
        if(!this.engine.strike(this.pending)){this.phase=this.replayReturn?.phase??this.nextPhase();this.replaying=false;this.pending=null;this.onChange();return;}
        if(!this.replaying)this.shotCount++; this.phase='moving'; this.onChange();
      }
    }
    if(this.phase!=='moving')return;
    this.accumulator+=Math.min(delta,.1);
    while(this.accumulator>=FIXED_DT&&!this.engine.settled){this.engine.step(FIXED_DT);this.accumulator-=FIXED_DT;}
    for(;this.eventOffset<this.engine.events.length;this.eventOffset++)this.onEvent(this.engine.events[this.eventOffset]);
    if(this.engine.settled&&this.pending&&this.before) {
      if(this.replaying&&this.replayReturn) {
        const back=this.replayReturn; this.engine=back.engine;this.cueBall=back.cue;this.angle=back.angle;this.power=back.power;this.tip=back.tip;this.calledBall=back.calledBall;this.calledPocket=back.calledPocket;this.safety=back.safety;this.phase=back.phase;this.replayReturn=null;
      }else{
        const events=this.engine.events.map(e=>({...e,time:e.time-this.shotStartTime}));
        this.lastShot={input:structuredClone(this.pending),before:this.before,after:this.engine.snapshot(),events};
        this.lastOutcome=this.match.apply(this.lastShot);this.applyPhysicalOutcome(this.lastOutcome);
        this.cueBall=this.match.cueBall;this.tip={x:0,y:0};this.calledBall=undefined;this.calledPocket=undefined;this.safety=false;this.phase=this.nextPhase();
        if(this.phase==='finished')this.onMatchEnd();
      }
      this.replaying=false;this.pending=null;this.accumulator=0;this.onChange();this.onFinished();
    }
  }
  private nextPhase(): GamePhase { return this.match.state.status==='finished'?'finished':this.match.state.pendingChoice?'choosing':this.match.state.ballInHand?'placing':'aiming'; }
  private clearShot(): void { this.pending=null;this.before=null;this.accumulator=0;this.lastShot=null;this.lastOutcome=null;this.shotCount=0;this.replaying=false;this.replayReturn=null;this.strokeProgress=0;this.meter.cancel();this.tip={x:0,y:0};this.calledBall=undefined;this.calledPocket=undefined;this.safety=false;this.aiShot=null; }
  private applyPhysicalOutcome(result: RuleOutcome): void {
    if(result.rerack){this.engine.reset(createPoolRack());return;}
    if(result.openingLayoutFor!==undefined){this.engine.reset(createCaromOpening(result.openingLayoutFor,this.match.config.discipline));return;}
    for(const id of result.respots){
      const t=this.engine.table,r=t.ballRadius;const candidates:Vec2[]=[];
      for(let n=0;n<Math.ceil(t.width/(r*.15));n++){const x=t.width/4+n*r*.15;if(x<=t.width/2-r)candidates.push({x,z:0});} for(let x=t.width/4-r*.15;x>=-t.width/2+r;x-=r*.15)candidates.push({x,z:0});
      for(let x=t.width/2-r;x>-t.width/2+r;x-=r*2.1)for(let z=0;z<t.height/2-r;z+=r*2.1)candidates.push({x,z});
      if(!candidates.some(p=>this.engine.placeBall(id,p)))throw new Error('공을 재배치할 공간을 찾지 못했습니다.');
    }
  }
}
