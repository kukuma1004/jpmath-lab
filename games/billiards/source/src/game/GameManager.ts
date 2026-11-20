import { PhysicsEngine } from '../physics/PhysicsEngine';
import { FIXED_DT, TABLE } from '../physics/config';
import { createLayout } from '../physics/presets';
import type { PhysicsEvent, PhysicsSnapshot, ShotInput, ShotResult } from '../physics/types';

export type GamePhase = 'menu' | 'aiming' | 'stroking' | 'moving';
export type LayoutName = 'opening'|'collision'|'cushion'|'spin'|'three';

/** Single owner for shot lifecycle. Rendering and controls never advance physics. */
export class GameManager {
  engine = new PhysicsEngine(createLayout('opening'), TABLE);
  phase: GamePhase = 'menu';
  paused = false;
  layout: LayoutName = 'opening';
  cueBall = 'white';
  angle = -.16;
  power = .45;
  tip = { x: 0, y: 0 };
  shotCount = 0;
  lastShot: ShotResult | null = null;
  replaying = false;
  strokeProgress = 0;
  private accumulator = 0;
  private pending: ShotInput | null = null;
  private before: PhysicsSnapshot | null = null;
  private eventOffset = 0;
  private shotStartTime = 0;
  onEvent: (event: PhysicsEvent) => void = () => {};
  onChange: () => void = () => {};
  onFinished: () => void = () => {};

  get canAim(): boolean { return this.phase === 'aiming' && !this.paused; }
  get busy(): boolean { return this.phase === 'stroking' || this.phase === 'moving'; }
  get input(): ShotInput { return { ballId: this.cueBall, angle: this.angle, power: this.power, tip: { ...this.tip } }; }

  start(): void { this.phase = 'aiming'; this.paused = false; this.onChange(); }

  reset(layout: LayoutName = this.layout): void {
    this.layout = layout;
    this.engine.reset(createLayout(layout === 'three' ? 'opening' : layout, layout === 'three' ? 3 : 4));
    this.phase = 'aiming';
    this.pending = null;
    this.before = null;
    this.accumulator = 0;
    this.lastShot = null;
    this.shotCount = 0;
    this.replaying = false;
    this.strokeProgress = 0;
    this.cueBall = 'white';
    this.tip = { x: 0, y: 0 };
    this.angle = layout === 'opening' || layout === 'three' ? -.16 : 0;
    this.onChange();
  }

  shoot(): boolean {
    if (!this.canAim || !this.engine.settled) return false;
    this.pending = this.input;
    this.before = this.engine.snapshot();
    this.strokeProgress = 0;
    this.accumulator = 0;
    this.phase = 'stroking';
    this.onChange();
    return true;
  }

  replay(): boolean {
    if (!this.canAim || !this.lastShot) return false;
    const last = this.lastShot;
    this.engine.reset(last.before.balls);
    this.cueBall = last.input.ballId;
    this.angle = last.input.angle;
    this.power = last.input.power;
    this.tip = { ...last.input.tip };
    this.replaying = true;
    return this.shoot();
  }

  update(delta: number): void {
    if (this.paused) return;
    if (this.phase === 'stroking') {
      this.strokeProgress += delta / .48;
      if (this.strokeProgress >= 1 && this.pending) {
        this.engine.events.length = 0;
        this.eventOffset = 0;
        this.shotStartTime = this.engine.time;
        if (!this.engine.strike(this.pending)) { this.phase = 'aiming'; this.onChange(); return; }
        if (!this.replaying) this.shotCount++;
        this.phase = 'moving';
        this.onChange();
      }
    }
    if (this.phase !== 'moving') return;
    this.accumulator += Math.min(delta, .1);
    while (this.accumulator >= FIXED_DT && !this.engine.settled) {
      this.engine.step(FIXED_DT);
      this.accumulator -= FIXED_DT;
    }
    for (; this.eventOffset < this.engine.events.length; this.eventOffset++) this.onEvent(this.engine.events[this.eventOffset]);
    if (this.engine.settled && this.pending && this.before) {
      const events = this.engine.events.map(e => ({ ...e, time: e.time - this.shotStartTime }));
      if (!this.replaying) this.lastShot = { input: this.pending, before: this.before, after: this.engine.snapshot(), events };
      this.phase = 'aiming';
      this.replaying = false;
      this.pending = null;
      this.accumulator = 0;
      this.onChange();
      this.onFinished();
    }
  }
}
