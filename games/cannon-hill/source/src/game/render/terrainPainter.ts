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
        if (m === Mat.Empty) { depth = 0; continue; }
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

  private tmp: RGB = [0, 0, 0];

  /** 공기와 얼마나 가까운가: 1이면 바로 옆이 비었다, 2면 한 칸 건너, 0이면 멀다 */
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
    const grain = this.relief.light(cx, cy, stone);
    if (stone || m === Mat.Dirt) {
      const cap = stone && t[i - COLS * (3 + ((v + 32) >> 3))] !== m;
      const overhang = m === Mat.Dirt && cy > 8 && t[i - COLS * 5] === Mat.Rock;
      const slope = cap ? 40 + grain * 0.44 : overhang ? -46 : 0;
      r += grain * 1.14 + slope + (stone ? 9 : 21);
      gg += grain * 0.91 + slope * 0.76 + (stone ? 1 : 8);
      b += grain * 0.74 + slope * 0.18 - (stone ? 0 : 3);
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
    r += v; gg += v; b += v;

    // 겉흙(풀·눈·이끼): 맨 위 몇 칸
    const crust = this.crust[m];
    const thick = 2 + ((hash2(cx >> 1, 0, 3) * 2) | 0);
    if (crust && depth <= thick) {
      const k = depth <= 2 ? 1.35 : depth === thick ? 0.72 : 1;
      r = crust[0] * k + v * 0.5;
      gg = crust[1] * k + v * 0.5;
      b = crust[2] * k + v * 0.5;
      if (this.def.id === 'sanseong') { const speck = hash2(cx,cy,52) * 46; r += 43 + speck; gg += speck * 0.5 - 12; b -= 25; }
    } else {
      // 겉에서 조금 들어간 곳은 살짝 밝고, 공기에서 멀수록(땅속 깊이) 어둡다
      const lift = air < 10 ? 9 * (1 - air / 10) : 0;
      const shade = 1 - 0.065 * smooth(4, DIST_CAP, air);
      r = (r + lift) * shade;
      gg = (gg + lift) * shade;
      b = (b + lift) * shade * 1.02;
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
        if (cells[Math.floor(y/CELL)*COLS+Math.floor(x/CELL)] !== Mat.Dirt) continue;
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
        const v = this.soft[(ly + minY) * COLS + lx + minX]! + this.relief.light(lx + minX, ly + minY, m === Mat.Rock || m === Mat.Core || m === Mat.Bedrock);
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
