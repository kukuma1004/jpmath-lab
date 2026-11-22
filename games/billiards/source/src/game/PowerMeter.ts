/** First press starts an oscillating meter; a second press captures its current value. */
export class PowerMeter {
  running = false;
  power = .08;
  private travel = 0;
  constructor(readonly minimum = .08, readonly maximum = 1, readonly secondsToPeak = 1.15) {}
  start(): void { this.travel = 0; this.power = this.minimum; this.running = true; }
  update(delta: number): number {
    if (!this.running || !Number.isFinite(delta) || delta <= 0) return this.power;
    this.travel = (this.travel + delta / this.secondsToPeak) % 2;
    this.power = this.minimum + (this.maximum - this.minimum) * (1 - Math.abs(this.travel - 1));
    return this.power;
  }
  stop(): number { this.running = false; return this.power; }
  cancel(): void { this.running = false; }
}
