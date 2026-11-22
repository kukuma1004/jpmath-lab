import type { BallState, PhysicsEvent, ShotResult } from '../physics/types';
import { groupLabel, groupOf, numberOf, orderedEvents, otherBall, remainingGroup } from './events';
import { otherPlayer, outcome } from './types';
import type { BallGroup, DisciplineRules, PendingChoice, RuleContext, RuleOutcome } from './types';

type BallContact = Extract<PhysicsEvent, { type: 'ball-ball' }>;
type PocketEvent = Extract<PhysicsEvent, { type: 'pocket' }>;
const TIME_EPS = 1e-8;
const POOL_WIDTH = 2.54;
const HEAD_STRING = -POOL_WIDTH / 4;

function makeChoice(context: RuleContext, kind: PendingChoice['kind'], own: boolean, options: PendingChoice['options']): PendingChoice {
  return { kind, player: own ? context.state.currentPlayer : otherPlayer(context.state.currentPlayer), breaker: context.state.currentPlayer, options };
}

function firstContacts(events: PhysicsEvent[], cue: string): BallContact[] {
  const first = events.find(event => otherBall(event, cue) !== null);
  if (!first) return [];
  // WPA3.2: at genuinely indistinguishable simultaneous contacts the legal ball is assumed first.
  return events.filter((event): event is BallContact => event.type === 'ball-ball' && otherBall(event, cue) !== null && Math.abs(event.time - first.time) <= TIME_EPS);
}

/** Only a leave-and-return contact is a new rail contact for a ball initially frozen to a rail. */
function validRailAfterContact(event: PhysicsEvent, firstTime: number, events: PhysicsEvent[], balls: BallState[]): boolean {
  if (event.type !== 'cushion' || event.time + TIME_EPS < firstTime) return false;
  const ball = balls.find(ball => ball.id === event.ballId);
  if (!ball) return false;
  const radius = .028575, halfX = POOL_WIDTH / 2 - radius, halfZ = 1.27 / 2 - radius;
  const frozen = event.rail === 'left' ? Math.abs(ball.position.x + halfX) < 1e-7 : event.rail === 'right' ? Math.abs(ball.position.x - halfX) < 1e-7 : event.rail === 'top' ? Math.abs(ball.position.z + halfZ) < 1e-7 : Math.abs(ball.position.z - halfZ) < 1e-7;
  if (!frozen) return true;
  const firstMovement = ball.id === 'white' ? 0 : events.find(candidate => candidate.type === 'ball-ball' && (candidate.ballA === ball.id || candidate.ballB === ball.id))?.time;
  return firstMovement !== undefined && event.time > firstMovement + TIME_EPS;
}

export class EightBallRules implements DisciplineRules {
  evaluate(result: ShotResult, context: RuleContext): RuleOutcome {
    const { state, config } = context, shooter = state.currentPlayer, opponent = otherPlayer(shooter);
    const cue = 'white', balls = result.before.balls;
    const events = orderedEvents(result);
    const pots = events.filter((event): event is PocketEvent => event.type === 'pocket');
    const objectPots = pots.filter(event => numberOf(event.ballId, balls) > 0);
    const eight = objectPots.find(event => numberOf(event.ballId, balls) === 8);
    const scratch = pots.some(event => event.ballId === cue);
    const contacts = firstContacts(events, cue);
    const firstTime = contacts[0]?.time ?? Infinity;
    const foulBase = result.input.ballId !== cue ? '다른 공을 수구로 타격했습니다.' : scratch ? '수구 포켓인' : contacts.length === 0 ? '목적구 미접촉' : null;
    if (state.breakShot) return this.evaluateBreak(result, context, events, objectPots, !!eight, foulBase);

    let group: BallGroup | null = state.players[shooter].group;
    let temporaryGroup: BallGroup | undefined;
    if (!group && result.input.calledBall && numberOf(result.input.calledBall, balls) === 8) {
      temporaryGroup = (['solid', 'stripe'] as const).find(candidate => remainingGroup(balls, candidate).length === 0);
      if (temporaryGroup) group = temporaryGroup;
    }
    const groupClear = !!group && remainingGroup(balls, group).length === 0;
    const legalFirst = contacts.some(event => {
      const number = numberOf(otherBall(event, cue)!, balls);
      return group ? groupClear ? number === 8 : groupOf(number) === group : number !== 8 && number >= 1 && number <= 15;
    });
    let foul = foulBase ?? (!legalFirst ? '잘못된 첫 목적구 접촉' : null);
    if (!foul && state.headStringRestriction) {
      const cueBefore = balls.find(ball => ball.id === cue)!;
      const contactOutsideKitchen = contacts.some(event => {
        const physicalPosition = event.ballA === cue ? event.positionB : event.positionA;
        return (physicalPosition?.x ?? balls.find(ball => ball.id === otherBall(event, cue))?.position.x ?? -Infinity) >= HEAD_STRING - TIME_EPS;
      });
      const crossedBeforeContact = events.some(event => event.type === 'cushion' && event.ballId === cue && event.time <= firstTime + TIME_EPS && (event as PhysicsEvent & { position?: { x: number } }).position?.x !== undefined && (event as PhysicsEvent & { position: { x: number } }).position.x >= HEAD_STRING - TIME_EPS);
      if (cueBefore.position.x >= HEAD_STRING - TIME_EPS) foul = '헤드 스트링 위쪽에서 수구를 놓아야 합니다.';
      else if (!contactOutsideKitchen && !crossedBeforeContact) foul = '헤드 스트링을 넘기 전에 같은 구역의 공을 먼저 맞혔습니다.';
    }
    if (!foul && objectPots.length === 0 && !events.some(event => validRailAfterContact(event, firstTime, events, balls))) foul = '목적구 접촉 후 쿠션 미접촉';

    if (eight) {
      const called = result.input.calledBall === eight.ballId && result.input.calledPocket === eight.pocketId && !result.input.safety;
      if (foul || !groupClear || !called) {
        const reason = foul ?? (!groupClear ? '자기 그룹을 모두 넣기 전 8번 포켓인' : '8번 공 지정 포켓 불일치');
        return outcome({ foul: reason, winner: opponent, message: `${reason} · ${state.players[opponent].name} 승리.` });
      }
      return outcome({ scored: true, points: 1, winner: shooter, assignedGroup: temporaryGroup, message: `지정 포켓에 8번 공 성공 · ${state.players[shooter].name} 승리!` });
    }
    if (foul) return outcome({ foul, ballInHand: true, ballInHandZone: 'anywhere', message: `${foul} · 상대의 볼 인 핸드.` });
    if (result.input.safety) return outcome({ message: '세이프티 선언 · 포켓된 공은 유지하고 공격권 전환.' });

    const requireCall = config.profile === 'wpa' || config.callShots;
    const calledPot = objectPots.find(event => event.ballId === result.input.calledBall && event.pocketId === result.input.calledPocket);
    const usefulPot = requireCall ? calledPot : objectPots.find(event => groupOf(numberOf(event.ballId, balls)) !== null && (!group || groupOf(numberOf(event.ballId, balls)) === group));
    const selectedGroup = usefulPot ? groupOf(numberOf(usefulPot.ballId, balls)) : null;
    const validPot = !!usefulPot && !!selectedGroup && (!group || selectedGroup === group);
    if (!group && validPot) return outcome({ scored: true, points: objectPots.filter(event => groupOf(numberOf(event.ballId, balls)) === selectedGroup).length, retainTurn: true, assignedGroup: selectedGroup!, message: `${groupLabel(selectedGroup!)} 그룹 확정 · 계속 공격하세요.` });
    if (validPot) return outcome({ scored: true, points: objectPots.filter(event => groupOf(numberOf(event.ballId, balls)) === group).length, retainTurn: true, message: '정상 포켓인 · 계속 공격하세요.' });
    return outcome({ message: objectPots.length ? '지정한 공과 포켓을 완성하지 못했습니다. 공은 유지하고 공격권 전환.' : '포켓인 없이 샷 종료 · 공격권 전환.' });
  }

  private evaluateBreak(result: ShotResult, context: RuleContext, events: PhysicsEvent[], pots: PocketEvent[], eight: boolean, foul: string | null): RuleOutcome {
    const { state, config } = context;
    const cue = result.before.balls.find(ball => ball.id === 'white');
    if (cue && cue.position.x >= HEAD_STRING - TIME_EPS) foul ??= '브레이크 수구는 헤드 스트링 위쪽에 놓아야 합니다.';
    const objectRails = new Set(events.filter(event => event.type === 'cushion' && numberOf(event.ballId, result.before.balls) > 0).map(event => event.type === 'cushion' ? event.ballId : ''));
    const illegal = pots.length === 0 && objectRails.size < 4;
    if (config.profile === 'casual') {
      if (eight) return outcome({ respots: ['ball-8'], retainTurn: !foul, foul, ballInHand: !!foul, ballInHandZone: 'anywhere', message: foul ? '8번 공 재배치 · 상대의 볼 인 핸드.' : '브레이크 8번 공 재배치 · 계속 공격하세요.' });
      if (foul || illegal) return outcome({ foul: foul ?? '브레이크 강도 부족', ballInHand: true, ballInHandZone: 'anywhere', message: '브레이크 파울 · 상대의 볼 인 핸드.' });
      return outcome({ scored: pots.length > 0, points: 0, retainTurn: pots.length > 0, message: pots.length ? '정상 브레이크 · 오픈 테이블에서 계속 공격.' : '정상 브레이크 · 오픈 테이블, 공격권 전환.' });
    }
    if (eight) {
      const choice = makeChoice(context, foul ? 'break-eight-foul' : 'break-eight', !foul, [
        { id: 'spot', label: foul ? '8번 재배치 · 헤드 스트링 볼 인 핸드' : '8번 재배치 · 현재 배치에서 계속' },
        { id: 'rerack-self', label: '다시 랙을 짜고 직접 브레이크' },
      ]);
      return outcome({ foul, choice, message: foul ? '브레이크 8번 포켓인 + 파울 · 상대가 처리 방법을 고릅니다.' : '브레이크 8번 포켓인 · 재배치 또는 다시 브레이크를 고르세요.' });
    }
    if (foul) {
      const options: PendingChoice['options'] = [{ id: 'ball-in-hand', label: '헤드 스트링 위쪽에서 볼 인 핸드' }];
      if (!events.some(event => event.type === 'pocket' && event.ballId === 'white')) options.unshift({ id: 'accept', label: '현재 배치 그대로 진행' });
      return outcome({ foul, choice: makeChoice(context, 'break-foul', false, options), message: `${foul} · 상대가 현재 배치 또는 헤드 스트링 볼 인 핸드를 선택합니다.` });
    }
    // WPA4.3(d) gives incoming options for an illegal break; it is distinct from a standard foul.
    if (illegal) return outcome({ choice: makeChoice(context, 'illegal-break', false, [
      { id: 'accept', label: '현재 배치 그대로 진행' },
      { id: 'rerack-self', label: '새 랙에서 직접 브레이크' },
      { id: 'rerack-opponent', label: '새 랙에서 상대가 다시 브레이크' },
    ]), message: '불충분한 브레이크 · 다음 플레이어가 처리 방법을 고릅니다.' });
    return outcome({ scored: pots.length > 0, points: 0, retainTurn: pots.length > 0, message: pots.length ? '정상 브레이크 · 그룹은 아직 정해지지 않았습니다.' : '정상 브레이크 · 오픈 테이블, 공격권 전환.' });
  }
}
