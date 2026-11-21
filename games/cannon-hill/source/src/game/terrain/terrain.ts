import { CELL, COLS, ROWS, WORLD_H, WORLD_W } from '../config/constants';

export const enum Mat {
  Empty = 0,
  Dirt = 1,
  Rock = 2,
  Bedrock = 3, // 기반암: 부서지지 않고 지지점이 된다
  Core = 4, // 파괴 불가능한 구조물(구름돌 기둥, 성 주춧돌)
  Wall = 5, // 성벽 벽돌
  Wood = 6, // 다리·나무
  Leaf = 7, // 나뭇잎·덤불
}

export const MAT_COUNT = 8;

export function isAnchor(m: number): boolean {
  return m === Mat.Bedrock || m === Mat.Core;
}

export function isHard(m: number): boolean {
  return m === Mat.Rock || m === Mat.Wall;
}

export interface CellRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** 지지점을 잃은 지형 덩어리 */
export interface Component {
  cells: Int32Array; // 셀 번호(cy*COLS+cx)
  mats: Uint8Array;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  hardCount: number;
}

const N = COLS * ROWS;

export class Terrain {
  cells: Uint8Array;
  /** 화면이 다시 그려야 할 영역(셀 좌표). 렌더러가 비운다. */
  dirty: CellRect[] = [];
  /** 안정성 검사가 필요한 영역(셀 좌표). 시뮬레이션이 비운다. */
  pending: CellRect[] = [];
  removedTotal = 0;

  // 안정성 검사용 작업 버퍼(모든 지형이 공유)
  private static mark = new Int32Array(N);
  private static stack = new Int32Array(N);
  private static label = 1;

  constructor(cells?: Uint8Array) {
    this.cells = cells ?? new Uint8Array(N);
  }

  clone(): Terrain {
    const t = new Terrain(new Uint8Array(this.cells));
    t.removedTotal = this.removedTotal;
    return t;
  }

  get(cx: number, cy: number): number {
    if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) return Mat.Empty;
    return this.cells[cy * COLS + cx]!;
  }

  set(cx: number, cy: number, m: number): void {
    if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) return;
    this.cells[cy * COLS + cx] = m;
  }

  /** 월드 좌표(px)가 막혀 있는가 */
  solidAt(x: number, y: number): boolean {
    if (x < 0 || x >= WORLD_W || y < 0 || y >= WORLD_H) return false;
    return this.cells[((y / CELL) | 0) * COLS + ((x / CELL) | 0)]! !== Mat.Empty;
  }

  matAt(x: number, y: number): number {
    if (x < 0 || x >= WORLD_W || y < 0 || y >= WORLD_H) return Mat.Empty;
    return this.cells[((y / CELL) | 0) * COLS + ((x / CELL) | 0)]!;
  }

  /** x 열에서 y 아래로 처음 막힌 지점(px). 없으면 -1 */
  surfaceBelow(x: number, y: number, maxDepth = WORLD_H): number {
    const cx = (x / CELL) | 0;
    if (cx < 0 || cx >= COLS) return -1;
    let cy = Math.max(0, (y / CELL) | 0);
    const end = Math.min(ROWS, cy + Math.ceil(maxDepth / CELL));
    for (; cy < end; cy++) if (this.cells[cy * COLS + cx] !== Mat.Empty) return cy * CELL;
    return -1;
  }

  /** 맨 위 지면(px). 없으면 -1 */
  topSurface(x: number): number {
    return this.surfaceBelow(x, 0);
  }

  markDirty(r: CellRect, stability: boolean): void {
    const rr = {
      x0: Math.max(0, r.x0),
      y0: Math.max(0, r.y0),
      x1: Math.min(COLS - 1, r.x1),
      y1: Math.min(ROWS - 1, r.y1),
    };
    if (rr.x0 > rr.x1 || rr.y0 > rr.y1) return;
    this.dirty.push(rr);
    if (stability) this.pending.push(rr);
  }

  /**
   * 원형으로 지형을 판다. rockMul은 암석·성벽 반경 비율. 기반암·구조물은 남는다.
   * 지운 셀 수를 돌려준다.
   */
  carveCircle(px: number, py: number, r: number, rockMul: number): number {
    if (r <= 0) return 0;
    const cx0 = Math.floor((px - r) / CELL);
    const cx1 = Math.floor((px + r) / CELL);
    const cy0 = Math.floor((py - r) / CELL);
    const cy1 = Math.floor((py + r) / CELL);
    const r2 = r * r;
    const rr = r * Math.min(1, rockMul);
    const rr2 = rr * rr;
    const wr = r * Math.min(1, rockMul * 1.08);
    const wr2 = wr * wr;
    const wood2 = r * r * 1.1;
    let removed = 0;
    for (let cy = Math.max(0, cy0); cy <= Math.min(ROWS - 1, cy1); cy++) {
      const dy = (cy + 0.5) * CELL - py;
      for (let cx = Math.max(0, cx0); cx <= Math.min(COLS - 1, cx1); cx++) {
        const i = cy * COLS + cx;
        const m = this.cells[i]!;
        if (m === Mat.Empty || m === Mat.Bedrock || m === Mat.Core) continue;
        const dx = (cx + 0.5) * CELL - px;
        const d2 = dx * dx + dy * dy;
        let lim = r2;
        if (m === Mat.Rock) lim = rr2;
        else if (m === Mat.Wall) lim = wr2;
        else if (m === Mat.Wood || m === Mat.Leaf) lim = wood2;
        if (d2 <= lim) {
          this.cells[i] = Mat.Empty;
          removed++;
        }
      }
    }
    if (removed > 0) {
      this.removedTotal += removed;
      this.markDirty({ x0: cx0 - 2, y0: cy0 - 2, x1: cx1 + 2, y1: cy1 + 2 }, true);
    }
    return removed;
  }

  /** 셀 목록을 지정한 위치에 다시 붙인다(낙하한 덩어리가 내려앉을 때) */
  stamp(cells: Int32Array, mats: Uint8Array, dCol: number, dRow: number): void {
    let minX = COLS, minY = ROWS, maxX = -1, maxY = -1;
    for (let k = 0; k < cells.length; k++) {
      const c = cells[k]!;
      const cx = (c % COLS) + dCol;
      const cy = ((c / COLS) | 0) + dRow;
      if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) continue;
      const i = cy * COLS + cx;
      if (this.cells[i] === Mat.Empty) this.cells[i] = mats[k]!;
      if (cx < minX) minX = cx;
      if (cy < minY) minY = cy;
      if (cx > maxX) maxX = cx;
      if (cy > maxY) maxY = cy;
    }
    if (maxX >= 0) this.markDirty({ x0: minX - 2, y0: minY - 2, x1: maxX + 2, y1: maxY + 2 }, false);
  }

  /** 원 모양으로 셀을 채운다(낙석이 멈춰 쌓일 때) */
  fillCircle(px: number, py: number, r: number, m: number): void {
    const cx0 = Math.floor((px - r) / CELL);
    const cx1 = Math.floor((px + r) / CELL);
    const cy0 = Math.floor((py - r) / CELL);
    const cy1 = Math.floor((py + r) / CELL);
    const r2 = r * r;
    for (let cy = Math.max(0, cy0); cy <= Math.min(ROWS - 1, cy1); cy++) {
      for (let cx = Math.max(0, cx0); cx <= Math.min(COLS - 1, cx1); cx++) {
        const dx = (cx + 0.5) * CELL - px;
        const dy = (cy + 0.5) * CELL - py;
        if (dx * dx + dy * dy <= r2) {
          const i = cy * COLS + cx;
          if (this.cells[i] === Mat.Empty) this.cells[i] = m;
        }
      }
    }
    this.markDirty({ x0: cx0 - 2, y0: cy0 - 2, x1: cx1 + 2, y1: cy1 + 2 }, false);
  }

  /**
   * 바뀐 영역 둘레에서 출발해 기반암·구조물과 이어지지 않은 덩어리를 찾는다.
   * 전체 지도를 매번 훑지 않고, 바뀐 영역의 고체 셀에서만 탐색을 시작한다.
   * 찾은 덩어리는 지형에서 지운다.
   */
  extractUnsupported(regions: CellRect[]): Component[] {
    if (regions.length === 0) return [];
    const mark = Terrain.mark;
    const stack = Terrain.stack;
    const cells = this.cells;
    const labelStart = Terrain.label;
    if (labelStart > 2_000_000_000) {
      mark.fill(0);
      Terrain.label = 1;
    }
    const start = Terrain.label;
    const supported: boolean[] = [];
    const out: Component[] = [];

    for (const r of regions) {
      const x0 = Math.max(0, r.x0 - 1), x1 = Math.min(COLS - 1, r.x1 + 1);
      const y0 = Math.max(0, r.y0 - 1), y1 = Math.min(ROWS - 1, r.y1 + 1);
      for (let cy = y0; cy <= y1; cy++) {
        for (let cx = x0; cx <= x1; cx++) {
          const seed = cy * COLS + cx;
          if (cells[seed] === Mat.Empty || mark[seed]! >= start) continue;
          const lab = Terrain.label++;
          supported[lab - start] = false;
          let sp = 0;
          stack[sp++] = seed;
          mark[seed] = lab;
          let anchored = false;
          // 깊이 우선 탐색. 아래쪽을 먼저 보도록 아래 이웃을 마지막에 넣는다.
          const list: number[] = [];
          while (sp > 0) {
            const c = stack[--sp]!;
            list.push(c);
            if (isAnchor(cells[c]!)) {
              anchored = true;
              break;
            }
            const ccx = c % COLS;
            const ccy = (c / COLS) | 0;
            // 위, 왼쪽, 오른쪽, 아래 순서로 넣는다(아래가 먼저 꺼내짐)
            if (ccy > 0) {
              const n = c - COLS;
              if (cells[n] !== Mat.Empty) {
                const mk = mark[n]!;
                if (mk < start) { mark[n] = lab; stack[sp++] = n; }
                else if (mk !== lab && supported[mk - start]) { anchored = true; break; }
              }
            }
            if (ccx > 0) {
              const n = c - 1;
              if (cells[n] !== Mat.Empty) {
                const mk = mark[n]!;
                if (mk < start) { mark[n] = lab; stack[sp++] = n; }
                else if (mk !== lab && supported[mk - start]) { anchored = true; break; }
              }
            }
            if (ccx < COLS - 1) {
              const n = c + 1;
              if (cells[n] !== Mat.Empty) {
                const mk = mark[n]!;
                if (mk < start) { mark[n] = lab; stack[sp++] = n; }
                else if (mk !== lab && supported[mk - start]) { anchored = true; break; }
              }
            }
            if (ccy < ROWS - 1) {
              const n = c + COLS;
              if (cells[n] !== Mat.Empty) {
                const mk = mark[n]!;
                if (mk < start) { mark[n] = lab; stack[sp++] = n; }
                else if (mk !== lab && supported[mk - start]) { anchored = true; break; }
              }
            }
          }
          if (anchored) {
            supported[lab - start] = true;
            continue;
          }
          // 지지점 없음: 덩어리로 떼어 낸다
          const n = list.length;
          const ids = new Int32Array(n);
          const mats = new Uint8Array(n);
          let minX = COLS, minY = ROWS, maxX = -1, maxY = -1, hard = 0;
          for (let k = 0; k < n; k++) {
            const c = list[k]!;
            ids[k] = c;
            const m = cells[c]!;
            mats[k] = m;
            if (isHard(m)) hard++;
            const ccx = c % COLS;
            const ccy = (c / COLS) | 0;
            if (ccx < minX) minX = ccx;
            if (ccy < minY) minY = ccy;
            if (ccx > maxX) maxX = ccx;
            if (ccy > maxY) maxY = ccy;
          }
          for (let k = 0; k < n; k++) cells[ids[k]!] = Mat.Empty;
          this.markDirty({ x0: minX - 2, y0: minY - 2, x1: maxX + 2, y1: maxY + 2 }, false);
          out.push({ cells: ids, mats, minX, minY, maxX, maxY, hardCount: hard });
        }
      }
    }
    return out;
  }

  countSolid(): number {
    let n = 0;
    for (let i = 0; i < N; i++) if (this.cells[i] !== Mat.Empty) n++;
    return n;
  }

  checksum(): number {
    let h = 2166136261 >>> 0;
    const c = this.cells;
    for (let i = 0; i < N; i += 1) {
      h ^= c[i]! + (i & 7);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  /** 짧은 문자열로 직렬화(연속 길이 부호화) */
  serialize(): string {
    const out: number[] = [];
    const c = this.cells;
    let cur = c[0]!;
    let run = 0;
    for (let i = 0; i < N; i++) {
      if (c[i] === cur && run < 65535) run++;
      else {
        out.push(cur, run);
        cur = c[i]!;
        run = 1;
      }
    }
    out.push(cur, run);
    return out.join(',');
  }

  static deserialize(s: string): Terrain {
    const parts = s.split(',').map(Number);
    const cells = new Uint8Array(N);
    let i = 0;
    for (let k = 0; k < parts.length; k += 2) {
      const m = parts[k]!;
      const run = parts[k + 1]!;
      cells.fill(m, i, i + run);
      i += run;
    }
    return new Terrain(cells);
  }
}
