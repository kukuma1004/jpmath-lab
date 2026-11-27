import { WIND_MAX } from '../config/constants';

type Trace = Pick<CanvasRenderingContext2D, 'moveTo' | 'lineTo' | 'closePath'>;
type Draw = (x: number, y: number, length: number, bend: number, thickness: number, alpha: number) => void;

/** Swept ribbon with a thin tail and a pointed leading edge. */
export function traceWind(path: Trace, x: number, y: number, length: number, bend: number, thickness: number): void {
  path.moveTo(x - length, y + bend);
  path.lineTo(x - length * .62, y + bend * .82 - thickness * .42);
  path.lineTo(x - length * .28, y + bend * .52 - thickness);
  path.lineTo(x, y);
  path.lineTo(x - length * .28, y + bend * .52 + thickness);
  path.lineTo(x - length * .62, y + bend * .82 + thickness * .42);
  path.closePath();
}

/** Visualizes the signed wind shared by battle physics and the target course. */
export class WindStreaks {
  private readonly motion = matchMedia('(prefers-reduced-motion: reduce)');
  private wind = NaN;
  private width = 0;
  private height = 0;
  private still = false;
  private elapsed = 0;
  private nextFrame = 0;

  constructor(private readonly clear: () => void, private readonly draw: Draw, private readonly sparse = false) {}

  update(wind: number, width: number, height: number, dt: number): void {
    const still = this.motion.matches;
    const stateChanged = wind !== this.wind || width !== this.width || height !== this.height || still !== this.still;
    if (wind !== this.wind) this.elapsed = 0;
    this.wind = wind;
    this.width = width;
    this.height = height;
    this.still = still;
    if (!still) this.elapsed += dt;
    if (!stateChanged && (!wind || still || this.elapsed < this.nextFrame)) return;
    this.nextFrame = this.elapsed + 1 / 30;
    this.clear();
    if (!wind || !width || !height) return;

    const direction = Math.sign(wind);
    const strength = Math.min(1, Math.abs(wind) / WIND_MAX);
    const scale = Math.min(width / 960, height / 600);
    const count = (this.sparse ? 5 : 8) + Math.round(strength * (this.sparse ? 3 : 6));
    for (let i = 0; i < count; i++) {
      const depth = .7 + ((i * 19) % 37) / 52;
      const period = (3.9 - 2 * strength) / depth;
      const phase = still ? .5 : (this.elapsed / period + ((i * 37 + 13) % 97) / 97) % 1;
      const opacity = (still ? .75 : Math.sin(Math.PI * phase)) * (.35 + strength * .4);
      const progress = .5 - .5 * Math.cos(Math.PI * phase);
      const span = Math.min(width * .21, (90 + strength * 155) * scale) * depth;
      const x = width * (.12 + ((i * 43 + 11) % 89) / 116) + direction * (progress - .5) * span;
      const y = height * (.24 + ((i * 29 + 7) % 83) / 165);
      const length = direction * (27 + strength * 82) * depth * scale;
      this.draw(x, y, length, (3.5 + depth * 4) * scale, (1.1 + strength * .95) * scale, opacity);
      if (strength >= .4 && i % 3 === 0) {
        this.draw(x - length * .3, y + 10 * depth * scale, length * .58, 4 * scale, .9 * scale, opacity * .63);
      }
    }
  }
}
