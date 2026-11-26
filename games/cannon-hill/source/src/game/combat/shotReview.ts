import type {Battle} from './battle';
import type {SimEvent} from './types';
import {weapon} from '../data/weapons';
import {CHAR_CENTER_Y} from '../config/constants';

type Shot = Extract<SimEvent, {type: 'fire'}>;
type Point = {x: number; y: number};

export class ShotReview {
  private latest = new Map<number, {shot: Shot; target: Point; impact?: Point; impacts: number}>();
  private activeOwner: number | null = null;

  reset(): void {
    this.latest.clear();
    this.activeOwner = null;
  }

  record(battle: Battle, event: SimEvent): void {
    if (event.type === 'fire') {
      const shooter = battle.fighters[event.owner]!;
      const foe = battle.nearestEnemy(shooter);
      this.activeOwner = event.owner;
      this.latest.set(event.owner, {shot: event, target: {x: foe.x, y: foe.y - CHAR_CENTER_Y}, impacts: 0});
    } else if (event.type === 'explode' && this.activeOwner !== null) {
      const record = this.latest.get(this.activeOwner)!;
      record.impact ??= {x: event.x, y: event.y};
      record.impacts++;
    }
  }

  summary(battle: Battle): string {
    const record = this.latest.get(battle.current);
    if (!record) return '';
    const {shot, impact, target, impacts} = record;
    const damage = battle.shotDamage.get(shot.shot) ?? 0;
    const direction = shot.angle <= 90 ? 1 : -1;
    const angle = Math.round(Math.min(shot.angle, 180 - shot.angle));
    const wind = shot.wind ? `${shot.wind > 0 ? '→' : '←'}${Math.abs(shot.wind)}` : '잔잔';
    let outcome = damage > 0 ? `${damage} 피해` : '빗나감';

    // 깊이 뚫거나 튀는 탄의 최종 폭발로 힘을 판단하면 잘못된 안내가 될 수 있다.
    const shell = weapon(shot.weaponId);
    if (!damage && impact && impacts === 1 && shell.pattern === 'single' && !shell.homing &&
        (shell.behavior === 'shell' || shell.behavior === 'mega') && Math.abs(impact.y - target.y) < 100 &&
        (target.x - shot.x) * direction > 0) {
      const offset = (impact.x - target.x) * direction;
      if (offset < -60) outcome = '짧게 떨어짐';
      else if (offset > 60) outcome = '상대를 지나침';
    }
    return `지난 포격 ${direction > 0 ? '→' : '←'}${angle}° · 힘 ${Math.round(shot.power)} · 바람 ${wind} · ${outcome}`;
  }
}
