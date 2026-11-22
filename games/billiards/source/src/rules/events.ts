import type { BallState, PhysicsEvent, ShotResult } from '../physics/types';
import type { BallGroup } from './types';

export const orderedEvents = (result: ShotResult): PhysicsEvent[] => result.events.slice().sort((a, b) => a.time - b.time || a.sequence - b.sequence);
export function otherBall(event: PhysicsEvent, cue: string): string | null {
  return event.type !== 'ball-ball' ? null : event.ballA === cue ? event.ballB : event.ballB === cue ? event.ballA : null;
}
export function numberOf(id: string, balls: BallState[] = []): number {
  const stored = balls.find(ball => ball.id === id)?.number;
  if (stored !== undefined) return stored;
  const match = /^ball-(\d+)$/.exec(id);
  return match ? Number(match[1]) : 0;
}
export function groupOf(number: number): BallGroup | null {
  return number >= 1 && number <= 7 ? 'solid' : number >= 9 && number <= 15 ? 'stripe' : null;
}
export const remainingGroup = (balls: BallState[], group: BallGroup): BallState[] => balls.filter(ball => !ball.pocketed && groupOf(numberOf(ball.id, balls)) === group);
export const groupLabel = (group: BallGroup): string => group === 'solid' ? '솔리드' : '스트라이프';
