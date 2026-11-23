import { hash2, noise2 } from '../utils/rng';

// Lighting atlas in world-cell units. Tilt the beds and fracture each into
// irregular plates. The same relief travels with detached pieces of earth.
const W = 512, H = 256;
export class CliffRelief {
  private rock = new Int8Array(W * H);
  private earth = new Int8Array(W * H);
  constructor(seed: number) {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const fold = noise2(x / 62, y / 48, seed) * 8;
      const u = (x + y * 0.47 + fold) / 21;
      const v = (y + fold + x * 0.08) / 10;
      const col = Math.floor(u), row = Math.floor(v);
      let best = 8, second = 8, dx = 0, dy = 0, tone = 0;
      for (let j = row - 1; j <= row + 1; j++) for (let i = col - 1; i <= col + 1; i++) {
        const a = u - i - 0.12 - hash2(i, j, seed) * 0.76;
        const b = v - j - 0.12 - hash2(i, j, seed + 1) * 0.76;
        const d = a * a + b * b;
        if (d < best) {
          second = best; best = d; dx = a; dy = b; tone = hash2(i, j, seed + 2);
        } else if (d < second) second = d;
      }
      const seam = second - best;
      const grit = (hash2(x,y,seed) - 0.5) * 12;
      const lit = dx * 0.55 + dy < -0.18;
      const face = lit ? 21 : dx - dy > 0.35 ? -21 : -5;
      const cut = seam < 0.08 ? -40 : seam < 0.19 && lit ? 32 : 0;
      const i = y * W + x;
      this.rock[i] = face + cut + (tone - 0.5) * 36 + grit;
      const band = (y * 0.12 + x * 0.017 + fold * 0.44) % 3.7;
      // Broad diagonal shelves carry the same fracture through the soil,
      // while the gaps expose softer, finer sediment.
      const bed = Math.sin((y + x * 0.24 + fold * 1.9) / 6.7);
      const gravel = (bed > 0.38 && tone > 0.20) || (tone > 0.77 && best < 0.20);
      this.earth[i] = gravel ? face * 0.88 + cut * 0.68 + grit + bed * 10 : (band < 0.20 ? -30 : band < 0.39 ? 18 : (band - 2) * 5) + grit + (tone-0.5)*12;
    }
  }
  light(x: number, y: number, stone: boolean): number {
    // Mirror alternate patches to avoid a lighting seam at the atlas boundary.
    const u = x & (W - 1), v = y & (H - 1);
    return (stone ? this.rock : this.earth)[((y & H) ? H - 1 - v : v) * W + ((x & W) ? W - 1 - u : u)]!;
  }
}
