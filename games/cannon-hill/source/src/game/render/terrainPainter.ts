import { CELL, COLS, ROWS, WORLD_H, WORLD_W } from '../config/constants';
import type { MapDef } from '../data/maps';
import { Mat, MAT_COUNT, type Terrain } from '../terrain/terrain';
import { hash2, noise1, noise2 } from '../utils/rng';

type RGB = [number, number, number];

function hex(h: string): RGB {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * 셀 격자를 그림으로 바꾼다. 화면 표현과 충돌 데이터가 같은 셀 배열에서 나오므로 늘 일치한다.
 * 결 무늬(grain)는 셀 단위로 한 번만 계산해 둔다.
 */
export class TerrainPainter {
  private base: RGB[] = [];
  private dark: RGB[] = [];
  private crust: (RGB | null)[] = [];
  private _grain: Int8Array | null = null;
  private _strata: Float32Array | null = null;

  constructor(public terrain: Terrain, public def: MapDef, private seed: number) {
    for (let m = 0; m < MAT_COUNT; m++) {
      const c = def.colors[m];
      this.base[m] = c ? hex(c.base) : [0, 0, 0];
      this.dark[m] = c ? hex(c.dark) : [0, 0, 0];
      this.crust[m] = c?.crust ? hex(c.crust) : null;
    }
  }

  /** 결 무늬는 처음 그릴 때 한 번만 계산한다 */
  private get grain(): Int8Array {
    if (this._grain) return this._grain;
    const seed = this.seed;
    const grain = new Int8Array(COLS * ROWS);
    for (let cy = 0; cy < ROWS; cy++) {
      for (let cx = 0; cx < COLS; cx++) {
        const v = (noise2(cx / 5, cy / 5, seed) - 0.5) * 34 + (hash2(cx, cy, seed) - 0.5) * 16;
        grain[cy * COLS + cx] = v | 0;
      }
    }
    this._grain = grain;
    return grain;
  }

  private get strata(): Float32Array {
    if (this._strata) return this._strata;
    const st = new Float32Array(WORLD_W);
    for (let x = 0; x < WORLD_W; x++) st[x] = noise1(x / 60, this.seed + 9) * 7;
    this._strata = st;
    return st;
  }

  /** 월드 영역(px)을 ImageData에 그린다. dst는 그 영역 크기 */
  paint(dst: ImageData, px0: number, py0: number): void {
    const t = this.terrain.cells;
    const w = dst.width, h = dst.height;
    const data = dst.data;
    data.fill(0);
    const cx0 = Math.floor(px0 / CELL), cy0 = Math.floor(py0 / CELL);
    const cx1 = Math.min(COLS - 1, Math.floor((px0 + w - 1) / CELL));
    const cy1 = Math.min(ROWS - 1, Math.floor((py0 + h - 1) / CELL));
    for (let cy = cy0; cy <= cy1; cy++) {
      for (let cx = cx0; cx <= cx1; cx++) {
        const i = cy * COLS + cx;
        const m = t[i]!;
        if (m === Mat.Empty) continue;
        const col = this.cellColor(t, cx, cy, m);
        // 셀 하나 = 2×2 화소
        for (let sy = 0; sy < CELL; sy++) {
          const py = cy * CELL + sy - py0;
          if (py < 0 || py >= h) continue;
          for (let sx = 0; sx < CELL; sx++) {
            const px = cx * CELL + sx - px0;
            if (px < 0 || px >= w) continue;
            const o = (py * w + px) * 4;
            const j = ((sx + sy) & 1) * 3; // 아주 작은 화소 흔들림
            data[o] = Math.min(255, col[0] + j);
            data[o + 1] = Math.min(255, col[1] + j);
            data[o + 2] = Math.min(255, col[2] + j);
            data[o + 3] = 255;
          }
        }
      }
    }
  }

  private tmp: RGB = [0, 0, 0];

  private cellColor(t: Uint8Array, cx: number, cy: number, m: number): RGB {
    const i = cy * COLS + cx;
    const g = this.grain[i]!;
    const base = this.base[m]!;
    let r = base[0], gg = base[1], b = base[2];
    const px = cx * CELL, py = cy * CELL;

    // 재질 무늬
    switch (m) {
      case Mat.Rock: {
        const s = Math.sin(py * 0.16 + this.strata[px]!) * 9;
        r += s; gg += s; b += s;
        if (Math.abs(noise2(cx / 9, cy / 9, 77) - 0.5) < 0.018) { r -= 26; gg -= 26; b -= 26; }
        break;
      }
      case Mat.Wall: {
        const row = Math.floor(py / 10);
        const off = (row & 1) * 11;
        const mortar = py % 10 < 2 || (px + off) % 22 < 2;
        if (mortar) { r = r * 0.62 + 40; gg = gg * 0.62 + 40; b = b * 0.62 + 40; }
        else {
          const k = (hash2(Math.floor((px + off) / 22), row, 5) - 0.5) * 26;
          r += k; gg += k; b += k;
        }
        break;
      }
      case Mat.Wood: {
        const s = Math.sin(px * 0.9 + noise1(py / 14, 3) * 5) * 10;
        r += s; gg += s * 0.8; b += s * 0.6;
        break;
      }
      case Mat.Leaf: {
        const v = noise2(cx / 3, cy / 3, 31);
        if (v > 0.62) { r += 22; gg += 34; b += 18; }
        else if (v < 0.3) { r -= 14; gg -= 16; b -= 10; }
        break;
      }
      case Mat.Core: {
        const s = Math.sin((px + py) * 0.06 + noise1(py / 30, 8) * 3) * 8;
        r += s; gg += s; b += s;
        break;
      }
      case Mat.Bedrock: {
        if (hash2(cx, cy, 91) > 0.93) { r += 18; gg += 18; b += 18; }
        break;
      }
      default:
        if (hash2(cx, cy, 13) > 0.985) { r += 30; gg += 26; b += 20; }
    }
    r += g; gg += g; b += g;

    // 노출면: 위쪽이 비어 있으면 겉흙(풀·이끼), 옆이 비어 있으면 가장자리 어둡게
    const up1 = cy > 0 ? t[i - COLS]! : 0;
    let topDist = 99;
    for (let k = 1; k <= 5; k++) {
      if (cy - k < 0 || t[i - k * COLS] === Mat.Empty) { topDist = k; break; }
    }
    const crust = this.crust[m];
    if (crust && topDist <= 3 + ((hash2(cx, 0, 3) * 2.4) | 0)) {
      const k = topDist === 1 ? 1.12 : 1;
      r = crust[0] * k + g * 0.6;
      gg = crust[1] * k + g * 0.6;
      b = crust[2] * k + g * 0.6;
    } else if (topDist === 1 && up1 === Mat.Empty) {
      r += 16; gg += 16; b += 16;
    }
    const left = cx > 0 ? t[i - 1]! : m;
    const right = cx < COLS - 1 ? t[i + 1]! : m;
    const down = cy < ROWS - 1 ? t[i + COLS]! : m;
    const dk = this.dark[m]!;
    if (left === Mat.Empty || right === Mat.Empty || (down === Mat.Empty && topDist !== 1)) {
      r = r * 0.5 + dk[0] * 0.5;
      gg = gg * 0.5 + dk[1] * 0.5;
      b = b * 0.5 + dk[2] * 0.5;
    } else if (cy < ROWS - 2 && t[i + 2 * COLS] === Mat.Empty) {
      r = r * 0.78 + dk[0] * 0.22;
      gg = gg * 0.78 + dk[1] * 0.22;
      b = b * 0.78 + dk[2] * 0.22;
    }
    // 아래로 갈수록 조금 어둡게
    const fade = 1 - 0.2 * (py / WORLD_H);
    const o = this.tmp;
    o[0] = Math.max(0, Math.min(255, r * fade));
    o[1] = Math.max(0, Math.min(255, gg * fade));
    o[2] = Math.max(0, Math.min(255, b * fade));
    return o;
  }

  /** 떨어지는 덩어리 그림(셀 목록만으로) */
  paintChunk(cells: Int32Array, mats: Uint8Array, minX: number, minY: number, maxX: number, maxY: number): ImageData {
    const w = (maxX - minX + 1) * CELL, h = (maxY - minY + 1) * CELL;
    const img = new ImageData(Math.max(1, w), Math.max(1, h));
    const cw = maxX - minX + 1;
    const mask = new Uint8Array(cw * (maxY - minY + 1));
    for (let k = 0; k < cells.length; k++) {
      const id = cells[k]!;
      mask[(((id / COLS) | 0) - minY) * cw + (id % COLS) - minX] = mats[k]!;
    }
    for (let ly = 0; ly <= maxY - minY; ly++) {
      for (let lx = 0; lx < cw; lx++) {
        const m = mask[ly * cw + lx]!;
        if (!m) continue;
        const base = this.base[m]!, dk = this.dark[m]!;
        const gcell = this.grain[(ly + minY) * COLS + lx + minX]!;
        let r = base[0] + gcell, g = base[1] + gcell, b = base[2] + gcell;
        const edge = lx === 0 || ly === 0 || lx === cw - 1 || ly === maxY - minY || !mask[ly * cw + lx - 1] || !mask[ly * cw + lx + 1] || !mask[(ly - 1) * cw + lx] || !mask[(ly + 1) * cw + lx];
        if (edge) { r = r * 0.5 + dk[0] * 0.5; g = g * 0.5 + dk[1] * 0.5; b = b * 0.5 + dk[2] * 0.5; }
        for (let sy = 0; sy < CELL; sy++) for (let sx = 0; sx < CELL; sx++) {
          const o = ((ly * CELL + sy) * w + lx * CELL + sx) * 4;
          img.data[o] = r; img.data[o + 1] = g; img.data[o + 2] = b; img.data[o + 3] = 255;
        }
      }
    }
    return img;
  }

  /** 지형을 작게 줄인 미리보기(전장 고르기 화면) */
  thumbnail(w: number, h: number, sky: [string, string, string], bg: CanvasImageSource | null = null): string {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, sky[0]);
    g.addColorStop(0.6, sky[1]);
    g.addColorStop(1, sky[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    if (bg) {
      // 그려 받은 배경: 가로를 꽉 채우고 위쪽 하늘 위주로
      const bw = (bg as HTMLImageElement).width || w, bh = (bg as HTMLImageElement).height || h;
      const dh = (bh / bw) * w;
      ctx.drawImage(bg, 0, -(dh - h) * 0.35, w, dh);
    }
    const img = ctx.getImageData(0, 0, w, h);
    const t = this.terrain.cells;
    const sx = COLS / w, sy = ROWS / h;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const cx = Math.floor(x * sx), cy = Math.floor(y * sy);
        const m = t[cy * COLS + cx]!;
        if (!m) continue;
        const above = cy - 3 >= 0 ? t[(cy - 3) * COLS + cx]! : 0;
        const col = above === 0 && this.crust[m] ? this.crust[m]! : this.base[m]!;
        const o = (y * w + x) * 4;
        img.data[o] = col[0]; img.data[o + 1] = col[1]; img.data[o + 2] = col[2]; img.data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  }
}
