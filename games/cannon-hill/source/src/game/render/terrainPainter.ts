import { CliffRelief } from './cliffRelief';
import { CELL, COLS, ROWS, WORLD_H, WORLD_W } from '../config/constants';
import type { MapDef } from '../data/maps';
import { Mat, MAT_COUNT, type Terrain } from '../terrain/terrain';
import { hash2, noise1, noise2 } from '../utils/rng';

type RGB = [number, number, number];

function hex(h: string): RGB {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

interface SurfaceLight {
  top: RGB;
  side: RGB;
  reach: number;
  joint: number;
}

// Light reflected by each landscape onto the receding face of a broken shelf.
const SURFACE_LIGHT: Record<string, SurfaceLight> = {
  quarry: { top: [230, 201, 149], side: [82, 101, 119], reach: 7, joint: 36 },
  sanseong: { top: [210, 158, 89], side: [95, 66, 65], reach: 5, joint: 23 },
  baekdu: { top: [222, 205, 218], side: [81, 65, 84], reach: 5, joint: 19 },
  forest: { top: [154, 155, 86], side: [58, 69, 77], reach: 5, joint: 26 },
  meadow: { top: [183, 188, 108], side: [104, 90, 72], reach: 4, joint: 20 },
  cloud: { top: [240, 222, 178], side: [116, 128, 159], reach: 6, joint: 22 },
  underworld: { top: [190, 126, 160], side: [74, 59, 92], reach: 6, joint: 14 },
};

/** 겉흙을 판단할 때 위로 살펴보는 깊이(셀) */
const DEPTH_CAP = 12;
/** 공기에서 이만큼(셀) 떨어질 때까지 점점 어두워진다 */
const DIST_CAP = 40;

function smooth(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/**
 * 셀 격자를 그림으로 바꾼다. 화면 표현과 충돌 데이터가 같은 셀 배열에서 나오므로 늘 일치한다.
 * 그린 배경·장수 그림과 어울리도록: 공기와 닿는 가장자리에 굵은 먹선, 겉에서 속으로 갈수록 어두운 음영,
 * 잔 점무늬 대신 큰 붓자국 같은 색 얼룩, 배경 안개 빛을 조금 섞는다.
 */
export class TerrainPainter {
  private surfaceLight: SurfaceLight | undefined;
  private _relief?: CliffRelief;
  private get relief(): CliffRelief {
    return this._relief ??= new CliffRelief(this.seed);
  }
  private base: RGB[] = [];
  private dark: RGB[] = [];
  private ink: RGB[] = [];
  private crust: (RGB | null)[] = [];
  private fog: RGB;
  private _soft: Int8Array | null = null;
  private _strata: Float32Array | null = null;

  constructor(public terrain: Terrain, public def: MapDef, private seed: number) {
    this.surfaceLight = SURFACE_LIGHT[def.id];
    for (let m = 0; m < MAT_COUNT; m++) {
      const c = def.colors[m];
      this.base[m] = c ? hex(c.base) : [0, 0, 0];
      this.dark[m] = c ? hex(c.dark) : [0, 0, 0];
      const d = this.dark[m]!;
      this.ink[m] = [d[0] * 0.45, d[1] * 0.45, d[2] * 0.5];
      this.crust[m] = c?.crust ? hex(c.crust) : null;
    }
    this.fog = hex(def.sky[1]);
  }

  /** 큰 붓자국 같은 색 얼룩(셀마다 한 번만 계산) */
  private get soft(): Int8Array {
    if (this._soft) return this._soft;
    const seed = this.seed;
    const v = new Int8Array(COLS * ROWS);
    for (let cy = 0; cy < ROWS; cy++) {
      for (let cx = 0; cx < COLS; cx++) {
        const a = noise2(cx / 13, cy / 11, seed) - 0.5;
        const b = noise2(cx / 41, cy / 29, seed + 5) - 0.5;
        v[cy * COLS + cx] = (a * 18 + b * 26 + (hash2(cx, cy, seed) - 0.5) * 3) | 0;
      }
    }
    this._soft = v;
    return v;
  }

  private get strata(): Float32Array {
    if (this._strata) return this._strata;
    const st = new Float32Array(WORLD_W);
    for (let x = 0; x < WORLD_W; x++) st[x] = noise1(x / 60, this.seed + 9) * 7;
    this._strata = st;
    return st;
  }

  /** 월드 영역(px)을 ImageData에 그린다. dst는 그 영역 크기 */
  private distBuf = new Uint16Array(0);

  /**
   * 영역 둘레(여백 포함)에서 각 셀이 가장 가까운 공기까지 얼마나 먼지(셀×2 단위) 근사로 잰다.
   * 열마다 위에서만 재면 기둥 아래에 세로 줄무늬가 생기므로, 사방(동굴·옆벽 포함)을 본다.
   */
  private distances(cx0: number, cy0: number, cx1: number, cy1: number): { d: Uint16Array; x0: number; y0: number; w: number } {
    const t = this.terrain.cells;
    const M = DIST_CAP + 2;
    const x0 = cx0 - M, y0 = cy0 - M, x1 = cx1 + M, y1 = cy1 + M;
    const w = x1 - x0 + 1, h = y1 - y0 + 1;
    if (this.distBuf.length < w * h) this.distBuf = new Uint16Array(w * h);
    const d = this.distBuf;
    const INF = 60000;
    for (let y = 0; y < h; y++) {
      const cy = y0 + y;
      for (let x = 0; x < w; x++) {
        const cx = x0 + x;
        // 위쪽 바깥과 양옆 바깥은 공기, 아래쪽 바깥은 땅
        const empty = cy < 0 || cx < 0 || cx >= COLS ? true : cy >= ROWS ? false : t[cy * COLS + cx] === Mat.Empty;
        d[y * w + x] = empty ? 0 : INF;
      }
    }
    // 앞뒤 두 번 훑기(가로·세로 2, 대각 3)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        let v = d[i]!;
        if (!v) continue;
        if (x > 0) v = Math.min(v, d[i - 1]! + 2);
        if (y > 0) {
          v = Math.min(v, d[i - w]! + 2);
          if (x > 0) v = Math.min(v, d[i - w - 1]! + 3);
          if (x < w - 1) v = Math.min(v, d[i - w + 1]! + 3);
        }
        d[i] = v;
      }
    }
    for (let y = h - 1; y >= 0; y--) {
      for (let x = w - 1; x >= 0; x--) {
        const i = y * w + x;
        let v = d[i]!;
        if (!v) continue;
        if (x < w - 1) v = Math.min(v, d[i + 1]! + 2);
        if (y < h - 1) {
          v = Math.min(v, d[i + w]! + 2);
          if (x < w - 1) v = Math.min(v, d[i + w + 1]! + 3);
          if (x > 0) v = Math.min(v, d[i + w - 1]! + 3);
        }
        d[i] = v;
      }
    }
    return { d, x0, y0, w };
  }

  paint(dst: ImageData, px0: number, py0: number): void {
    const t = this.terrain.cells;
    const w = dst.width, h = dst.height;
    const data = dst.data;
    data.fill(0);
    const cx0 = Math.floor(px0 / CELL), cy0 = Math.floor(py0 / CELL);
    const cx1 = Math.min(COLS - 1, Math.floor((px0 + w - 1) / CELL));
    const cy1 = Math.min(ROWS - 1, Math.floor((py0 + h - 1) / CELL));
    const dist = this.distances(cx0, cy0, cx1, cy1);
    for (let cx = cx0; cx <= cx1; cx++) {
      // 이 칸 위로 이어진 땅의 두께(표면에서 얼마나 깊은가)
      let depth = 0;
      for (let k = 1; k <= DEPTH_CAP; k++) {
        const cy = cy0 - k;
        if (cy < 0 || t[cy * COLS + cx] === Mat.Empty) break;
        depth++;
      }
      for (let cy = cy0; cy <= cy1; cy++) {
        const m = t[cy * COLS + cx]!;
        if (m === Mat.Empty) {
          depth = 0;
          if (this.surfaceLight) this.paintSurfaceDepth(dst, px0, py0, cx, cy, this.surfaceLight);
          if (this.def.id === 'windrift') this.paintLedgeDepth(dst, px0, py0, cx, cy);
          if (this.def.id === 'bridge' && cy * CELL > 440 && cy * CELL < 870)
            this.paintBridgeDepth(dst, px0, py0, cx, cy);
          continue;
        }
        depth++;
        const air = dist.d[(cy - dist.y0) * dist.w + (cx - dist.x0)]! / 2;
        const col = this.cellColor(t, cx, cy, m, depth, air);
        for (let sy = 0; sy < CELL; sy++) {
          const py = cy * CELL + sy - py0;
          if (py < 0 || py >= h) continue;
          for (let sx = 0; sx < CELL; sx++) {
            const px = cx * CELL + sx - px0;
            if (px < 0 || px >= w) continue;
            const o = (py * w + px) * 4;
            data[o] = col[0];
            data[o + 1] = col[1];
            data[o + 2] = col[2];
            data[o + 3] = 255;
          }
        }
      }
    }
  }

  private paintSurfaceDepth(dst: ImageData, x0: number, y0: number, cx: number, cy: number, light: SurfaceLight): void {
    const cells = this.terrain.cells;
    for (let step = 1; step <= light.reach; step++) {
      const x = cx - Math.round(step * .67), y = cy + step;
      if (x < 0 || y >= ROWS) return;
      const i = y * COLS + x, m = cells[i]!;
      if (!m) continue;
      const side = cells[i - COLS] === m && x + 1 < COLS && cells[i + 1] !== m;
      const palette = side ? light.side : light.top;
      const grain = this.relief.light(x, y, true);
      const dressed = m === Mat.Wall || m === Mat.Wood || this.def.id === 'underworld' && m === Mat.Rock;
      const u = cx + step * .67 + (dressed ? 0 : Math.sin(x * .093) * 2.4);
      const phase = ((u % light.joint) + light.joint) % light.joint;
      const shade = phase < 1 ? -39 : phase < 2 ? 14 : grain * .31 + 19 * step / light.reach + (side ? -13 : 4);
      const base = this.base[m]!;
      const wash = m === Mat.Leaf || m === Mat.Wood ? .26 : m === Mat.Wall ? .44 : .72;
      const r = base[0] * (1 - wash) + palette[0] * wash + shade;
      const g = base[1] * (1 - wash) + palette[1] * wash + shade * .89;
      const b = base[2] * (1 - wash) + palette[2] * wash + shade * .78;
      for (let dy = 0; dy < CELL; dy++) for (let dx = 0; dx < CELL; dx++) {
        const px = cx * CELL - x0 + dx, py = cy * CELL - y0 + dy;
        if (px < 0 || px >= dst.width || py < 0 || py >= dst.height) continue;
        const j = (py * dst.width + px) * 4;
        dst.data[j] = r; dst.data[j + 1] = g; dst.data[j + 2] = b; dst.data[j + 3] = 255;
      }
      return;
    }
  }

  // Sample the live silhouette along two short projections. Upper faces
  // recede into the scene, while a fragmented keel sits below the front lip.
  private paintLedgeDepth(dst: ImageData, x0: number, y0: number, cx: number, cy: number): void {
    const cells = this.terrain.cells;
    const material = (x: number, y: number) =>
      x < 0 || x >= COLS || y < 0 || y >= ROWS ? Mat.Empty : cells[y * COLS + x];
    const backX = cx - 4, backY = cy + 4;
    const top = material(backX, backY) !== Mat.Empty;
    if (!top) {
      let nearby = false;
      for (let d = 1; d <= 13; d += 3) {
        if (material(cx - 3, cy - d) !== Mat.Empty) { nearby = true; break; }
      }
      if (!nearby) return;
    }
    const fracture = this.relief.light(cx, cy, true);
    const facet = Math.floor((cx + Math.sin(cx * .067) * 4) / 9);
    const block = Math.sin(facet * 17.9);
    const keel = 3 + Math.round((1 + block) * 1.7);
    if (!top && material(cx - 3, cy - 3) === Mat.Empty && material(cx - 3, cy - keel) === Mat.Empty) return;
    let r: number, g: number, b: number;
    if (top && material(backX, cy) !== Mat.Empty) {
      // The displaced vertical edge faces away from the sun.
      const shade = fracture * .38 + block * 10;
      r = 87 + shade; g = 81 + shade; b = 95 + shade;
    } else if (top) {
      const seam = Math.floor((cx + cy * .79) / 15) !== Math.floor((cx + cy * .79 - 1) / 15);
      const bevel = material(backX, backY - 1) === Mat.Empty;
      const light = seam ? -48 : bevel ? 29 : fracture * .46 + block * 12;
      r = 215 + light; g = 161 + light * .8; b = 113 + light * .68;
    } else {
      const shade = fracture * .48 + block * 13;
      r = 54 + shade; g = 57 + shade; b = 69 + shade;
    }
    for (let sy = 0; sy < CELL; sy++) for (let sx = 0; sx < CELL; sx++) {
      const x = cx * CELL + sx - x0, y = cy * CELL + sy - y0;
      if (x < 0 || x >= dst.width || y < 0 || y >= dst.height) continue;
      const i = (y * dst.width + x) * 4;
      dst.data[i] = r; dst.data[i+1] = g; dst.data[i+2] = b; dst.data[i+3] = 255;
    }
  }

  // Trace a short oblique ray back to the current collision mask. Each exposed
  // timber, splinter or stone face gains depth, even at a freshly broken edge.
  private paintBridgeDepth(dst: ImageData, x0: number, y0: number, cx: number, cy: number): void {
    const cells = this.terrain.cells;
    for (let step = 1; step <= 7; step++) {
      const x = cx - Math.round(step * .72), y = cy + step;
      if (x < 0 || y >= ROWS) return;
      const i = y * COLS + x, material = cells[i];
      if (!material) continue;
      const wood = material === Mat.Wood;
      const side = x + 1 < COLS && cells[i + 1] !== material && cells[i - COLS] === material;
      const u = x * CELL;
      const joint = u % 40, board = Math.floor(u / 40);
      let light: number;
      if (wood) {
        light = joint < 2 ? -85 : joint < 4 ? 25 : step === 7 ? 23 :
          (hash2(board, 0, 35) - .5) * 48 + Math.sin(u * .66 + step * .29 + Math.sin(u * .12)) * 9;
        if (!side && this.bridgeLashing(x, y)) light = (u % 6 < 2 ? -46 : 15) - step;
      } else {
        light = this.relief.light(x >> 1, y, true) * .75;
      }
      const r = (side ? (wood ? 100 : 85) : (wood ? 227 : 215)) + light;
      const g = (side ? (wood ? 55 : 71) : (wood ? 157 : 153)) + light * .83;
      const b = (side ? (wood ? 42 : 88) : (wood ? 81 : 118)) + light * .61;
      const localX = cx * CELL - x0, localY = cy * CELL - y0;
      for (let sy = 0; sy < CELL; sy++) for (let sx = 0; sx < CELL; sx++) {
        const px = localX + sx, py = localY + sy;
        if (px < 0 || py < 0 || px >= dst.width || py >= dst.height) continue;
        const j = (py * dst.width + px) * 4;
        dst.data[j] = r; dst.data[j+1] = g; dst.data[j+2] = b; dst.data[j+3] = 255;
      }
      return;
    }
  }

  private tmp: RGB = [0, 0, 0];

  // Locate the uprights in the live mask so their deck bindings disappear with them.
  private bridgeLashing(cx: number, cy: number): boolean {
    const x = cx * CELL;
    const deckY = 600 + 90 * Math.sin((x - 320) / 1760 * Math.PI);
    if (Math.abs(cy * CELL - deckY) > 12) return false;
    const row = Math.floor((deckY - 24) / CELL) * COLS;
    return this.terrain.cells[row + cx] === Mat.Wood;
  }

  /** 공기와 얼마나 가까운가: 1이면 바로 옆이 비었다, 2면 한 칸 건너, 0이면 멀다 */
  // The length and tilt of exposed beds distinguish cut granite, basalt and shale.
  // Sample in world space so detached material retains the original fracture lines.
  private materialRelief(x: number, y: number, stone: boolean): number {
    const fold = this.strata[x * CELL]!;
    // At tactical zoom major planes span several smaller fractures.
    const broad = this.relief.light(Math.floor(x * .34 + y * .09), Math.floor(y * .39 + fold), true);
    return broad * .52 + this.fineMaterialRelief(x, y, fold, stone) * .72;
  }

  private fineMaterialRelief(x: number, y: number, fold: number, stone: boolean): number {
    switch (this.def.id) {
      case 'bridge':
        if (stone) return this.relief.light(Math.floor(x * .48 + y * .15), Math.floor(y * .22 - x * .11), true) * .59;
        break;
      case 'windrift':
        return this.relief.light(Math.floor(x * .76 + y * .31), Math.floor(y * .94 + fold * .42), stone);
      case 'sanseong':
        return this.relief.light(Math.floor(x * .86 - y * .14), Math.floor(y * .83 + fold * .65), stone);
      case 'baekdu':
        return this.relief.light(Math.floor(x * .72 - y * .18), Math.floor(y * .78 + fold), stone);
      case 'quarry':
        return this.relief.light(Math.floor(x * .71 + y * .16), Math.floor(y * .88 + fold * .30), stone);
      case 'cloud':
        return this.relief.light(Math.floor(x * .80 + y * .24), Math.floor(y * .65 + fold * .32), stone);
      case 'underworld':
        return this.relief.light(Math.floor(x * .78 - y * .28), Math.floor(y * .95 + fold), stone);
      case 'forest':
        return this.relief.light(Math.floor(x * .87 + y * .13), Math.floor(y * .75 + fold), stone);
    }
    return this.relief.light(x, y, stone);
  }

  private edgeDist(t: Uint8Array, cx: number, cy: number): number {
    const at = (x: number, y: number) => (x < 0 || x >= COLS || y < 0 ? Mat.Empty : y >= ROWS ? 1 : t[y * COLS + x]!);
    if (at(cx - 1, cy) === Mat.Empty || at(cx + 1, cy) === Mat.Empty || at(cx, cy - 1) === Mat.Empty || at(cx, cy + 1) === Mat.Empty) return 1;
    if (at(cx - 2, cy) === Mat.Empty || at(cx + 2, cy) === Mat.Empty || at(cx, cy - 2) === Mat.Empty || at(cx, cy + 2) === Mat.Empty
      || at(cx - 1, cy - 1) === Mat.Empty || at(cx + 1, cy - 1) === Mat.Empty || at(cx - 1, cy + 1) === Mat.Empty || at(cx + 1, cy + 1) === Mat.Empty) return 2;
    return 0;
  }

  /** depth: 위쪽 공기에서 몇 칸째인가(겉흙용), air: 가장 가까운 공기까지 거리(셀) */
  private cellColor(t: Uint8Array, cx: number, cy: number, m: number, depth: number, air: number): RGB {
    const i = cy * COLS + cx;
    const v = this.soft[i]!;
    const base = this.base[m]!;
    let r = base[0], gg = base[1], b = base[2];
    const px = cx * CELL, py = cy * CELL;

    // 재질 무늬(잔 점 대신 부드럽게)
    switch (m) {
      case Mat.Rock: {
        const s = Math.sin(py * 0.12 + this.strata[px]!) * 7;
        r += s; gg += s; b += s;
        if (Math.abs(noise2(cx / 11, cy / 11, 77) - 0.5) < 0.016) { r -= 22; gg -= 22; b -= 20; }
        break;
      }
      case Mat.Wall: {
        const row = Math.floor(py / 14);
        const offset = (row & 1) * 12 + Math.floor(hash2(row,0,9)*5);
        const joint = (px + offset) % 24, level = py % 14;
        const chipped = (joint < 4 || joint > 20) && (level < 3 || level > 10);
        const tone = (hash2(Math.floor((px + offset)/24),row,5) - 0.65) * 44;
        const bevel = chipped || joint < 2 || level > 11 ? -54
          : level < 2 || joint < 4 ? 27 : joint > 19 || level > 9 ? -19 : 0;
        r += tone + bevel + hash2(cx,cy,83)*9;
        gg += tone + bevel * 0.9 - 7;
        b += tone + bevel * 0.65 - 14;
        break;
      }
      case Mat.Wood: {
        if (this.def.id === 'bridge') {
          const deckY = 600 + 90 * Math.sin((px - 320) / 1760 * Math.PI);
          const deckOffset = py - deckY;
          const deck = Math.abs(deckOffset) <= 12;
          const upright = !deck && !(py >= 470 && py <= 490 || py >= 778 && py <= 798);
          const joint = px % 40;
          let light: number;
          if (upright) {
            let radial = 0;
            while (radial < 9 && t[i - radial - 1] === m) radial++;
            const round = Math.sin((radial + 1) / 9 * Math.PI) * 41 - 17;
            const collar = Math.min(Math.abs(py - deckY) - 7, Math.abs(py - 490) - 2);
            if (collar >= 0 && collar < 22) {
              const twist = (Math.floor(py + Math.abs(radial - 4) * .52) % 6) / 6;
              light = round + (twist < .32 ? -62 : twist > .67 ? 36 : 3);
              r = 193 + light; gg = 133 + light * .88; b = 75 + light * .65;
              break;
            }
            light = round + Math.sin(px * .72 + Math.sin(py * .034)) * 13;
          } else {
            if (deck && this.bridgeLashing(cx, cy)) {
              const cord = (px + Math.round((deckOffset + 12) * .65)) % 6;
              const turn = cord < 2 ? -53 : cord < 4 ? 25 : 0;
              const round = 18 - Math.abs(deckOffset) * 2.7;
              r = 185 + turn + round; gg = 125 + turn + round; b = 65 + turn * .73 + round;
              break;
            }
            const knot = Math.sin(px * .077 + Math.sin(py * .24)) * 2.4;
            light = (hash2(Math.floor(px / 40), 0, 35) - .5) * 42 +
              (joint < 2 ? -73 : joint < 4 ? 23 : 0) + Math.sin(py * .81 + knot) * 12;
            if (joint === 8 && depth >= 2 && depth <= 3) light -= 52;
          }
          r = 165 + light; gg = 96 + light * .83; b = 49 + light * .6;
          break;
        }
        const plank=Math.floor(px/18),seam=px%18<2;
        const grain=Math.sin(py*1.4+noise1(px/23,3)*4)*5;
        const s=seam?-25:grain+(hash2(plank,Math.floor(py/24),3)-0.5)*21;
        r += s; gg += s * 0.8; b += s * 0.6;
        break;
      }
      case Mat.Leaf: {
        const n = noise2(cx / 4, cy / 4, 31);
        if (n > 0.6) { r += 26; gg += 30; b += 26; }
        else if (n < 0.32) { r -= 16; gg -= 16; b -= 12; }
        break;
      }
      case Mat.Core: {
        const s = Math.sin((px + py) * 0.05 + noise1(py / 30, 8) * 3) * 7;
        r += s; gg += s; b += s;
        break;
      }
      default:
        break;
    }
    const stone = m === Mat.Rock || m === Mat.Bedrock || m === Mat.Core;
    const grain = this.materialRelief(cx, cy, stone);
    if (stone || m === Mat.Dirt) {
      const cap = stone && depth <= 3 + ((v + 32) >> 3);
      const overhang = m === Mat.Dirt && cy > 8 && t[i - COLS * 5] === Mat.Rock;
      const slope = cap ? 40 + grain * 0.44 : overhang ? -46 : 0;
      r += grain * 1.14 + slope + (stone ? 9 : 21);
      gg += grain * 0.91 + slope * 0.76 + (stone ? 1 : 8);
      b += grain * 0.74 + slope * 0.18 - (stone ? 0 : 3);
      if (this.def.id === 'bridge') {
        const slopeX = px + (py - 570) * .36 + 14 * Math.sin(py * .022 + px * .006);
        const ridge = noise1(slopeX / 64, 61);
        const fissure = slopeX / 63 + ridge * .82;
        const face = fissure - Math.floor(fissure);
        const facet = face < .075 ? -42 : face < .17 ? 29 : 18 - face * 45;
        const shade = facet + Math.sin(py * .021 + ridge * 4) * 11;
        const haze = Math.max(0, Math.min(.75, (py - 665) / 225));
        r = (r + shade + 6) * (1 - haze) + 82 * haze;
        gg = (gg + shade * .70 - 4) * (1 - haze) + 88 * haze;
        b = (b + shade * .36 + 6) * (1 - haze) + 143 * haze;
        const moss = stone && face > .075 && face < .22 && py < 685 &&
          Math.sin(py * .067 + ridge * 6) + Math.sin(slopeX * .035) > 1.18;
        if (moss) {
          r += 18; gg += 21; b -= 20;
        }
      }
      if (this.def.id === 'sanseong') {
        // Sunset catches projecting shelves above the cooler recesses.
        const sun = Math.max(0, Math.min(1, (grain + slope + 24) / 72));
        r += (stone ? 3 : -10) + 24 * sun;
        gg -= (stone ? 20 : 13) - 7 * sun;
        b -= (stone ? 33 : 13) + 9 * sun;
      }
    } else if (m === Mat.Wall) {
      const bevel = t[i-1] !== m || t[i-2] !== m ? 38 : t[i+2] !== m ? -28 : 0;
      r += grain * 0.66 + bevel + 10; gg += grain * 0.55 + bevel * 0.8; b += grain * 0.48 + bevel * 0.52 - 6;
    }
    if (this.surfaceLight && (stone || m === Mat.Dirt)) {
      // Cool the recessed face; the fractured bevel reflects local sky light.
      const facet = stone ? grain : this.relief.light(cx, cy, true);
      const exposure = Math.max(0, 1 - (depth - 1) / 11);
      const bevel = Math.max(0, facet) * .37 + exposure * 12;
      r += bevel - (1 - exposure) * 10;
      gg += bevel * .82 - (1 - exposure) * 8;
      b += bevel * .68;
      if (this.def.id === 'quarry' && stone) {
        r -= 7; gg += 4; b += 8;
      } else if (this.def.id === 'baekdu' && stone) {
        // Strong warm rim over the shadowed purple flank of each basalt slab.
        const rim = Math.max(0, facet - 13) * .38;
        r += rim + exposure * 17 - 5; gg += rim * .55 - 6; b += 3;
      } else if (this.def.id === 'cloud' && m === Mat.Core) {
        // The core is pale calcite with a honey-coloured shaded face.
        const crystal = Math.max(-1, Math.min(1, facet / 40));
        r += 14 + crystal * 8; gg += 8 + crystal * 12; b += crystal * 17 - 4;
      } else if (this.def.id === 'forest' && exposure > 0) {
        r += 23 * exposure; gg += 33 * exposure; b -= 14 * exposure;
      } else if (this.def.id === 'underworld' && stone && px > 905 && px < WORLD_W - 905) {
        const seam = (cx + Math.floor(cy * .52)) % 14;
        const block = seam < 1 ? -40 : seam < 2 ? 22 : 0;
        r += block + 17 * exposure; gg += block * .75; b += block * .8 + 8;
      }
    }
    if (this.def.id === 'forest' && m === Mat.Leaf) {
      const petal = this.relief.light(Math.floor(cx * 1.3), Math.floor(cy * .78), true);
      const sheen = petal * .65 + Math.max(0, 12 - depth) * 1.7;
      r += sheen + 12; gg += sheen * .70; b += sheen * .87;
    }
    r += v; gg += v; b += v;

    // 겉흙(풀·눈·이끼): 맨 위 몇 칸
    const crust = this.crust[m];
    const thick = 2 + ((hash2(cx >> 1, 0, 3) * 2) | 0);
    if (crust && depth <= thick) {
      const k = depth <= 2 ? 1.35 : depth === thick ? 0.72 : 1;
      r = crust[0] * k + v * 0.5;
      gg = crust[1] * k + v * 0.5;
      b = crust[2] * k + v * 0.5;
      if (this.def.id === 'forest' && m !== Mat.Leaf) {
        r += 54; gg += 15; b -= 48;
      }
      if (this.def.id === 'sanseong') { const speck = hash2(cx,cy,52) * 46; r += 43 + speck; gg += speck * 0.5 - 12; b -= 25; }
    } else {
      // 겉에서 조금 들어간 곳은 살짝 밝고, 공기에서 멀수록(땅속 깊이) 어둡다
      const lift = air < 10 ? 9 * (1 - air / 10) : 0;
      const shade = 1 - (stone || m === Mat.Dirt ? .19 : .065) * smooth(4, DIST_CAP, air);
      r = (r + lift) * shade;
      gg = (gg + lift) * shade;
      b = (b + lift) * shade * 1.02;
    }

    // Sky-facing shelves catch warm light. Overhangs pick up cool reflected light.
    if (stone || m === Mat.Dirt) {
      const below = i + COLS * 4;
      if (depth > 3 && below < t.length && t[below] === Mat.Empty) {
        r *= .60; gg *= .67; b *= .78;
      } else if (depth <= 3) {
        r += 12; gg += 6;
      }
    }

    // 먹선: 공기와 닿은 가장자리는 굵고 진하게
    const e = this.edgeDist(t, cx, cy);
    if (e === 1 && depth > 1) {
      const ink = this.ink[m]!;
      r = ink[0]; gg = ink[1]; b = ink[2];
    } else if (e === 2 && depth > 2) {
      const dk = this.dark[m]!;
      r = r * 0.55 + dk[0] * 0.45;
      gg = gg * 0.55 + dk[1] * 0.45;
      b = b * 0.55 + dk[2] * 0.45;
    }

    // 배경 안개 빛을 조금, 아래로 갈수록 조금 어둡게
    const fog = this.fog;
    const fk = 0.045 + 0.045 * (py / WORLD_H);
    const fade = 1 - 0.065 * (py / WORLD_H);
    const o = this.tmp;
    o[0] = Math.max(0, Math.min(255, (r * (1 - fk) + fog[0] * fk) * fade));
    o[1] = Math.max(0, Math.min(255, (gg * (1 - fk) + fog[1] * fk) * fade));
    o[2] = Math.max(0, Math.min(255, (b * (1 - fk) + fog[2] * fk) * fade));
    return o;
  }

  /** Paint sparse surface growth and roots in world coordinates across tile edges. */
  dressSurface(ctx: CanvasRenderingContext2D, x0: number, y0: number, size: number): void {
    const cells = this.terrain.cells;
    const autumn = this.def.id === 'sanseong';
    ctx.save();
    ctx.translate(-x0, -y0);
    for (let x = Math.max(0, Math.floor((x0-22)/8)*8); x < Math.min(WORLD_W, x0+size+22); x += 8) {
      const cx = x / CELL;
      for (let cy = Math.max(1, (y0-32)/CELL); cy < Math.min(ROWS,(y0+size+24)/CELL); cy++) {
        const i = cy*COLS+cx;
        if (cells[i] !== Mat.Dirt || cells[i-COLS] !== Mat.Empty) continue;
        const y = cy*CELL;
        const n = hash2(cx,cy,this.seed);
        if (this.def.id === 'windrift') {
          // Tufts gather at broken ends of a shelf, where the bare slabs give way to soil.
          const edge = this.terrain.matAt(x - 19, y + 4) === Mat.Empty
            || this.terrain.matAt(x + 19, y + 4) === Mat.Empty;
          if (!edge && n > .12) continue;
          ctx.fillStyle = '#787141';
          ctx.beginPath();
          ctx.ellipse(x, y - 1, 5 + n * 3, 2.6, -.12, 0, Math.PI * 2);
          ctx.fill();
          for (let blade = 0; blade < 7; blade++) {
            const bend = hash2(cx, blade, this.seed + 23);
            const root = x + blade * 1.5 - 5;
            const tip = root + bend * 6 - 1;
            const height = 2 + bend * 6;
            ctx.fillStyle = blade % 3 === 0 ? '#82804b' : blade % 3 === 1 ? '#e0b75c' : '#ffe6a0';
            ctx.beginPath();
            ctx.moveTo(root - 1, y);
            ctx.quadraticCurveTo(root + 1, y - height * .8, tip, y - height);
            ctx.lineTo(root + 1.3, y);
            ctx.fill();
          }
          continue;
        }
        if (n < 0.29) {
          const length = 2 + n * 20;
          for (let j=0;j<4;j++) {
            const wind = hash2(cx,j,this.seed+3);
            const dx = (wind-0.38)*13, dy = -length*(0.5+wind);
            ctx.fillStyle = autumn ? ['#b49839','#dec65d','#85772e','#e7bc58'][j]! : this.def.colors[Mat.Dirt]!.crust!;
            ctx.beginPath();ctx.moveTo(x+j-2,y+2);
            ctx.quadraticCurveTo(x+j+dx*0.4,y+dy*0.8,x+j+dx,y+dy);
            ctx.quadraticCurveTo(x+j+dx*0.5+2,y+dy*0.7,x+j+1,y+2);ctx.fill();
          }
        } else if (n > 0.85) {
          const length = 10+(n-0.85)*119;
          ctx.lineWidth = 1.3;
          ctx.strokeStyle = autumn ? '#ad804f' : this.def.colors[Mat.Dirt]!.dark;
          ctx.beginPath();ctx.moveTo(x,y+4);
          ctx.bezierCurveTo(x+3,y+length*0.3,x-8,y+length*0.67,x-11,y+length);
          ctx.moveTo(x+1,y+length*0.45);ctx.lineTo(x+7,y+length*0.8);ctx.stroke();
        }
      }
    }
    // Clip embedded pebbles against newly carved holes.
    ctx.globalCompositeOperation = 'source-atop';
    for (let gy = Math.floor((y0-14)/19); gy <= Math.ceil((y0+size+14)/19); gy++) {
      for (let gx = Math.floor((x0-18)/25); gx <= Math.ceil((x0+size+18)/25); gx++) {
        const choice = hash2(gx,gy,this.seed+41);
        if (choice < 0.49) continue;
        const x = gx*25 + hash2(gx,gy,91)*23, y = gy*19 + hash2(gx,gy,63)*17;
        const material = this.terrain.matAt(x, y);
        if (material === Mat.Rock && choice > .82) {
          // Fine mineral planes break up the cell-sized relief when the camera moves in.
          const width = 7 + choice * 5;
          if (this.terrain.matAt(x - width, y + 2) !== material ||
              this.terrain.matAt(x + width, y - 2) !== material) continue;
          const rise = hash2(gx, gy, 29) * 4;
          ctx.beginPath();
          ctx.moveTo(x - width, y + 2);
          ctx.lineTo(x - 3, y - rise);
          ctx.lineTo(x + width, y - 2);
          ctx.lineTo(x + 2, y + .5);
          ctx.closePath();
          ctx.fillStyle = 'rgba(255,226,195,.20)';
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(x - width, y + 2);
          ctx.lineTo(x + 2, y + .5);
          ctx.lineTo(x + width, y - 2);
          ctx.lineTo(x + 3, y + 2);
          ctx.closePath();
          ctx.fillStyle = 'rgba(32,35,56,.29)';
          ctx.fill();
          continue;
        }
        if (material !== Mat.Dirt) continue;
        const radius = 1.3 + 9*Math.pow(choice,8);
        ctx.save(); ctx.translate(x,y);ctx.rotate((hash2(gx,gy,19)-0.6)*0.8);ctx.scale(radius,radius*0.64);
        ctx.fillStyle = 'rgba(42,22,22,.50)';
        ctx.beginPath();ctx.ellipse(0,0.44,1.24,0.66,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle = autumn ? '#695050' : this.def.colors[Mat.Dirt]!.dark;
        ctx.beginPath();ctx.moveTo(-1,.35);ctx.lineTo(-.76,-.38);ctx.lineTo(.08,-.94);
        ctx.lineTo(.72,-.63);ctx.lineTo(1,.18);ctx.lineTo(.53,.65);ctx.lineTo(-.48,.72);ctx.fill();
        ctx.fillStyle = autumn ? '#ad826c' : 'rgba(255,234,200,.34)';
        ctx.beginPath();ctx.moveTo(-1,.35);ctx.lineTo(-.7,-.42);ctx.lineTo(.08,-.94);
        ctx.lineTo(.42,-.72);ctx.lineTo(-.38,-.15);ctx.fill();ctx.restore();
      }
    }
    ctx.restore();
  }

  /** 떨어지는 덩어리 그림(셀 목록만으로). 땅과 같은 먹선·얼룩을 쓴다 */
  paintChunk(cells: Int32Array, mats: Uint8Array, minX: number, minY: number, maxX: number, maxY: number): ImageData {
    const w = (maxX - minX + 1) * CELL, h = (maxY - minY + 1) * CELL;
    const img = new ImageData(Math.max(1, w), Math.max(1, h));
    const cw = maxX - minX + 1;
    const mask = new Uint8Array(cw * (maxY - minY + 1));
    for (let k = 0; k < cells.length; k++) {
      const id = cells[k]!;
      mask[(((id / COLS) | 0) - minY) * cw + (id % COLS) - minX] = mats[k]!;
    }
    const at = (lx: number, ly: number) => (lx < 0 || ly < 0 || lx >= cw || ly > maxY - minY ? 0 : mask[ly * cw + lx]!);
    for (let ly = 0; ly <= maxY - minY; ly++) {
      for (let lx = 0; lx < cw; lx++) {
        const m = mask[ly * cw + lx]!;
        if (!m) continue;
        const base = this.base[m]!, dk = this.dark[m]!, ink = this.ink[m]!;
        const v = this.soft[(ly + minY) * COLS + lx + minX]! + this.materialRelief(lx + minX, ly + minY, m === Mat.Rock || m === Mat.Core || m === Mat.Bedrock);
        let r = base[0] + v, g = base[1] + v, b = base[2] + v;
        const e1 = !at(lx - 1, ly) || !at(lx + 1, ly) || !at(lx, ly - 1) || !at(lx, ly + 1);
        const e2 = !e1 && (!at(lx - 2, ly) || !at(lx + 2, ly) || !at(lx, ly - 2) || !at(lx, ly + 2));
        if (e1) { r = ink[0]; g = ink[1]; b = ink[2]; }
        else if (e2) { r = r * 0.55 + dk[0] * 0.45; g = g * 0.55 + dk[1] * 0.45; b = b * 0.55 + dk[2] * 0.45; }
        const fog = this.fog;
        r = r * 0.9 + fog[0] * 0.1; g = g * 0.9 + fog[1] * 0.1; b = b * 0.9 + fog[2] * 0.1;
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
