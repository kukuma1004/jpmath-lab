import type { ShotResult } from '../physics/types';
import { orderedEvents, otherBall } from './events';
import { outcome } from './types';
import type { DisciplineRules, RuleContext, RuleOutcome } from './types';

/** UMB carom: cue-ball cushions are counted only before the second distinct object contact. */
export class ThreeCushionRules implements DisciplineRules {
  evaluate(result: ShotResult, context: RuleContext): RuleOutcome {
    const cue = context.cueBall;
    if (result.input.ballId !== cue) return outcome({ foul: '다른 수구를 타격했습니다.', message: '수구 착오 · 공격권 전환.' });
    const targets = new Set(result.before.balls.filter(ball => ball.id !== cue).map(ball => ball.id));
    const hit = new Set<string>();
    let cushions = 0;
    let firstOwnEvent = true;
    let cannonCushions: number | null = null;
    for (const event of orderedEvents(result)) {
      const target = otherBall(event, cue);
      if (event.type === 'cushion' && event.ballId === cue) {
        if (firstOwnEvent && context.state.openingRequired) return outcome({ foul: '초구는 빨간 공을 직접 먼저 맞혀야 합니다.', message: '초구 순서 위반 · 빨간 공을 쿠션보다 먼저 맞혀야 합니다.' });
        firstOwnEvent = false;
        if (cannonCushions === null) cushions++;
      }
      if (!target || !targets.has(target)) continue;
      if (firstOwnEvent && context.state.openingRequired && result.before.balls.find(ball => ball.id === target)?.color !== 'red') {
        return outcome({ foul: '초구는 빨간 공을 직접 먼저 맞혀야 합니다.', message: '초구 순서 위반 · 빨간 공부터 직접 맞혀야 합니다.' });
      }
      firstOwnEvent = false;
      hit.add(target);
      if (hit.size === 2 && cannonCushions === null) cannonCushions = cushions;
    }
    const scored = cannonCushions !== null && cannonCushions >= 3;
    return outcome({ scored, points: scored ? 1 : 0, retainTurn: scored, message: scored ? `${cannonCushions}쿠션 후 두 목적구 적중 · 1점!` : cannonCushions !== null ? `두 번째 목적구 전 ${cannonCushions}쿠션 · 3쿠션 미달, 공격권 전환.` : '두 목적구를 모두 맞히지 못했습니다. 공격권 전환.' });
  }
}
