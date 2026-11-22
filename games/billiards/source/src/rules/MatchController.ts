import type { BallState, ShotResult } from '../physics/types';
import { createPoolRack } from '../physics/pool';
import { EightBallRules } from './EightBallRules';
import { FourBallRules } from './FourBallRules';
import { ThreeCushionRules } from './ThreeCushionRules';
import { groupOf, numberOf } from './events';
import { createCaromOpening } from './layouts';
import { otherPlayer, oppositeGroup, outcome } from './types';
import type { BreakOption, DisciplineRules, MatchConfig, MatchState, PlayerIndex, PlayerState, RuleContext, RuleOutcome } from './types';

export type { MatchConfig, MatchState, RuleOutcome, PlayerState, BreakOption } from './types';

export const DEFAULT_MATCH: Readonly<MatchConfig> = Object.freeze({
  discipline: 'four-ball', mode: 'local', target: 10, difficulty: 'normal', profile: 'domestic',
  fourBallFoul: 'turn', equalInnings: false, callShots: true, playerNames: ['플레이어 1', '플레이어 2'] as [string, string],
});

function normalize(config: Partial<MatchConfig>, previous: MatchConfig = DEFAULT_MATCH): MatchConfig {
  const next = { ...previous, ...config, playerNames: [...(config.playerNames ?? previous.playerNames)] as [string, string] };
  if (!['four-ball', 'three-cushion', 'eight-ball'].includes(next.discipline)) next.discipline = 'four-ball';
  if (!['practice', 'local', 'ai'].includes(next.mode)) next.mode = 'local';
  if (!['easy', 'normal', 'hard', 'expert'].includes(next.difficulty)) next.difficulty = 'normal';
  if (!['domestic', 'wpa', 'casual'].includes(next.profile)) next.profile = next.discipline === 'eight-ball' ? 'wpa' : 'domestic';
  if (next.discipline === 'eight-ball' && next.profile === 'domestic') next.profile = 'wpa';
  if (next.discipline === 'four-ball') next.profile = 'domestic';
  if (!['off', 'turn', 'penalty'].includes(next.fourBallFoul)) next.fourBallFoul = 'turn';
  next.target = Number.isFinite(Number(next.target)) ? Math.max(1, Math.min(999, Math.floor(Number(next.target)))) : 10;
  next.equalInnings = !!next.equalInnings;
  next.callShots = !!next.callShots;
  next.playerNames = [0, 1].map(index => String(next.playerNames[index] ?? '').trim().slice(0, 24) || `플레이어 ${index + 1}`) as [string, string];
  return next;
}

/** Independent, event-driven match state. The caller applies respots/reracks in the physics world. */
export class MatchController {
  config: MatchConfig;
  state: MatchState;
  private turnStarted = false;
  private readonly rules: Record<MatchConfig['discipline'], DisciplineRules> = {
    'four-ball': new FourBallRules(), 'three-cushion': new ThreeCushionRules(), 'eight-ball': new EightBallRules(),
  };

  constructor(config: Partial<MatchConfig> = {}) {
    this.config = normalize(config);
    this.state = this.newState();
  }

  get cueBall(): string { return this.config.discipline === 'eight-ball' ? 'white' : this.state.currentPlayer === 0 ? 'white' : 'yellow'; }

  initialBalls(): BallState[] {
    return this.config.discipline === 'eight-ball' ? createPoolRack() : createCaromOpening(this.state.currentPlayer, this.config.discipline);
  }

  reset(config: Partial<MatchConfig> = {}): void {
    this.config = normalize(config, this.config);
    this.state = this.newState();
    this.turnStarted = false;
  }

  /** Called only after the physics engine has accepted a valid, nonoverlapping cue placement. */
  confirmPlacement(): void { this.state.ballInHand = false; }

  apply(result: ShotResult): RuleOutcome {
    if (this.state.status === 'finished') return outcome({ message: '이미 끝난 경기입니다.' });
    if (this.state.pendingChoice) return outcome({ message: '브레이크 처리 방법을 먼저 선택해 주세요.' });
    const state = this.state, shooter = state.currentPlayer, player = state.players[shooter];
    if (!this.turnStarted) { player.innings++; this.turnStarted = true; }
    player.shots++; state.shotNumber++;
    const context: RuleContext = { config: this.config, state, cueBall: this.cueBall };
    const resultRule = this.rules[this.config.discipline].evaluate(result, context);
    state.openingRequired = false;
    state.ballInHand = false;
    state.headStringRestriction = false;
    if (resultRule.foul) player.fouls++;
    if (resultRule.assignedGroup) {
      player.group = resultRule.assignedGroup;
      state.players[otherPlayer(shooter)].group = oppositeGroup(resultRule.assignedGroup);
      state.openTable = false;
    }
    if (this.config.discipline === 'eight-ball') {
      state.breakShot = false;
      this.updatePoolProgress(result);
    } else player.score = Math.max(0, player.score + resultRule.points);
    if (resultRule.scored && !resultRule.foul) {
      player.run += Math.max(1, resultRule.points);
      player.highRun = Math.max(player.highRun, player.run);
    }
    state.message = resultRule.message;

    if (this.config.mode === 'practice') {
      // A free drill has feedback and statistics, but no competitive finish or forced handover.
      state.status = 'playing'; state.winner = null;
      delete resultRule.winner;
      if (resultRule.choice) {
        delete resultRule.choice;
      }
      if (this.config.discipline === 'eight-ball' && result.events.some(event => event.type === 'pocket' && event.ballId === 'ball-8')) resultRule.respots = ['ball-8'];
      if (resultRule.foul && this.config.discipline === 'eight-ball') { resultRule.ballInHand = true; resultRule.ballInHandZone = 'anywhere'; }
      this.applyBallInHand(resultRule);
      resultRule.retainTurn = true;
      state.message = resultRule.message = `${resultRule.message} 자유 연습을 계속합니다.`;
      return resultRule;
    }

    if (resultRule.choice) {
      player.run = 0;
      state.pendingChoice = structuredClone(resultRule.choice);
      state.currentPlayer = resultRule.choice.player;
      // A legal break-eight is still this shooter's inning when he elects to spot.
      this.turnStarted = resultRule.choice.player === shooter && !resultRule.foul;
      this.updateInning();
      return resultRule;
    }

    if (resultRule.winner !== undefined) { this.finish(resultRule.winner); return resultRule; }
    if (this.config.discipline !== 'eight-ball' && player.score >= this.config.target) {
      if (state.equalizing) {
        resultRule.winner = 'draw';
        this.finish('draw');
        state.message = resultRule.message = '후구에서 목표 점수 도달 · 같은 이닝, 무승부입니다.';
      } else if (this.config.discipline === 'three-cushion' && this.config.equalInnings && shooter === 0 && player.innings > state.players[1].innings) {
        player.run = 0;
        state.currentPlayer = 1;
        state.equalizing = true;
        state.openingRequired = true;
        this.turnStarted = false;
        resultRule.retainTurn = false;
        resultRule.openingLayoutFor = 1;
        state.message = resultRule.message = `${state.players[0].name} 목표 도달 · 후구는 초구 배치에서 같은 이닝을 마칩니다.`;
        this.updateInning();
      } else {
        resultRule.winner = shooter; this.finish(shooter);
        state.message = resultRule.message = `${player.name} ${this.config.target}점 도달 · 승리!`;
      }
      return resultRule;
    }
    if (!resultRule.retainTurn) {
      player.run = 0;
      if (state.equalizing) {
        resultRule.winner = 0; this.finish(0);
        state.message = resultRule.message = `후구 종료 · ${state.players[0].name} 승리!`;
        return resultRule;
      }
      state.currentPlayer = otherPlayer(shooter);
      this.turnStarted = false;
    }
    this.applyBallInHand(resultRule);
    this.updateInning();
    return resultRule;
  }

  chooseBreak(option: BreakOption): RuleOutcome {
    const pending = this.state.pendingChoice;
    if (!pending || !pending.options.some(candidate => candidate.id === option)) throw new Error('허용되지 않은 브레이크 선택입니다.');
    const state = this.state;
    state.pendingChoice = null;
    const next = pending.player;
    const result = outcome();
    state.openTable = true;
    state.players[0].group = state.players[1].group = null;
    if (option === 'rerack-self' || option === 'rerack-opponent') {
      state.currentPlayer = option === 'rerack-self' ? next : pending.breaker;
      state.breakShot = true;
      state.players[0].score = state.players[1].score = 0;
      result.rerack = true;
      result.ballInHand = true;
      result.ballInHandZone = 'head-string';
      result.retainTurn = state.currentPlayer === pending.breaker;
      result.message = '공을 다시 배치했습니다. 헤드 스트링 위쪽에서 브레이크하세요.';
    } else {
      state.currentPlayer = next;
      state.breakShot = false;
      result.retainTurn = next === pending.breaker;
      if (option === 'spot') {
        result.respots = ['ball-8'];
        if (pending.kind === 'break-eight-foul') { result.ballInHand = true; result.ballInHandZone = 'head-string'; }
        result.message = pending.kind === 'break-eight-foul' ? '8번 공 재배치 · 헤드 스트링 볼 인 핸드.' : '8번 공을 재배치했습니다. 현재 배치에서 계속 공격하세요.';
      } else if (option === 'ball-in-hand') {
        result.ballInHand = true;
        result.ballInHandZone = 'head-string';
        result.message = '현재 배치 유지 · 헤드 스트링 위쪽에서 볼 인 핸드.';
      } else result.message = '현재 배치를 받아들였습니다. 오픈 테이블에서 공격하세요.';
    }
    this.turnStarted = option === 'spot' && pending.kind === 'break-eight' && next === pending.breaker;
    this.applyBallInHand(result);
    state.message = result.message;
    this.updateInning();
    return result;
  }

  private newState(): MatchState {
    const pool = this.config.discipline === 'eight-ball';
    const player = (name: string): PlayerState => ({ name, score: 0, innings: 0, shots: 0, highRun: 0, run: 0, fouls: 0, group: null });
    return { players: [player(this.config.playerNames[0]), player(this.config.playerNames[1])], currentPlayer: 0, inning: 1, shotNumber: 0, status: 'playing', winner: null, breakShot: pool, openTable: pool, ballInHand: pool, ballInHandZone: pool ? 'head-string' : 'anywhere', headStringRestriction: pool, openingRequired: this.config.discipline === 'three-cushion', equalizing: false, pendingChoice: null, message: pool ? '헤드 스트링 위쪽에서 브레이크를 준비하세요.' : this.config.discipline === 'three-cushion' ? '초구는 빨간 공을 직접 먼저 맞히세요.' : '두 빨간 공을 모두 맞혀 1점을 만드세요.' };
  }

  private applyBallInHand(result: RuleOutcome): void {
    this.state.ballInHand = !!result.ballInHand;
    this.state.ballInHandZone = result.ballInHandZone ?? 'anywhere';
    this.state.headStringRestriction = !!result.ballInHand && result.ballInHandZone === 'head-string';
  }

  private updatePoolProgress(result: ShotResult): void {
    for (const player of this.state.players) if (player.group) {
      player.score = result.after.balls.filter(ball => groupOf(numberOf(ball.id, result.after.balls)) === player.group && ball.pocketed).length;
    }
  }

  private updateInning(): void { this.state.inning = this.state.players[this.state.currentPlayer].innings + (this.turnStarted ? 0 : 1); }

  private finish(winner: PlayerIndex | 'draw'): void { this.state.status = 'finished'; this.state.winner = winner; this.state.pendingChoice = null; this.state.ballInHand = false; this.state.headStringRestriction = false; }
}
