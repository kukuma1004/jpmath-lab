import type { ShotResult } from '../physics/types';
import { orderedEvents, otherBall } from './events';
import { outcome } from './types';
import type { DisciplineRules, RuleContext, RuleOutcome } from './types';

/** An explicitly named Korean house-rule profile; this is not a UMB four-ball discipline. */
export class FourBallRules implements DisciplineRules {
  evaluate(result: ShotResult, context: RuleContext): RuleOutcome {
    if (result.input.ballId !== context.cueBall) return outcome({ foul: '다른 수구를 타격했습니다.', message: '수구 착오 · 상대에게 공격권이 넘어갑니다.' });
    const contacts = orderedEvents(result).map(event => otherBall(event, context.cueBall)).filter((id): id is string => !!id);
    const opponentCue = context.cueBall === 'white' ? 'yellow' : 'white';
    if (context.config.fourBallFoul !== 'off' && contacts.includes(opponentCue)) {
      const penalty = context.config.fourBallFoul === 'penalty';
      return outcome({ foul: '상대 수구 접촉', points: penalty ? -1 : 0, message: penalty ? '상대 수구 접촉 · 1점 감점 후 공격권 전환' : '상대 수구 접촉 · 공격권 전환' });
    }
    const redIds = result.before.balls.filter(ball => ball.color === 'red' || ball.color === 'red2').map(ball => ball.id);
    const scored = redIds.length === 2 && redIds.every(id => contacts.includes(id));
    return outcome({ scored, points: scored ? 1 : 0, retainTurn: scored, message: scored ? '두 빨간 공 적중 · 1점! 계속 공격하세요.' : '두 빨간 공을 모두 맞히지 못했습니다. 공격권 전환.' });
  }
}
