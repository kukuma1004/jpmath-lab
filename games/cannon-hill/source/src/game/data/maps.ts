import { CELL, COLS, ROWS, WORLD_H, WORLD_W } from '../config/constants';
import { Mat, Terrain } from '../terrain/terrain';
import { Rng, clamp, noise1, noise2 } from '../utils/rng';

export interface MatColor {
  base: string;
  dark: string;
  crust?: string; // 윗면 색(풀, 이끼, 재)
}

export interface MapDef {
  id: string;
  name: string;
  desc: string;
  features: string;
  voidBottom: boolean; // 바닥이 비어 있어 떨어지면 끝나는 전장
  spawn: [number, number]; // 1P가 설 수 있는 x 범위(px). 2P는 거울 위치 근처
  windBias: number; // 바람 세기 기본 치우침(0..1)
  colors: Record<number, MatColor>;
  sky: [string, string, string];
  generate(t: Terrain, rng: Rng, seed: number): void;
}

// ───────── 지형 그리기 도구 ─────────

type Pt = [number, number];

/** 꼭짓점 사이를 코사인 보간한 높이(px) */
function profile(x: number, pts: Pt[]): number {
  if (x <= pts[0]![0]) return pts[0]![1];
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i]!;
    const [x0, y0] = pts[i - 1]!;
    if (x <= x1) {
      const u = (x - x0) / (x1 - x0);
      const s = (1 - Math.cos(u * Math.PI)) / 2;
      return y0 + (y1 - y0) * s;
    }
  }
  return pts[pts.length - 1]![1];
}

type MatFn = (x: number, y: number, depth: number) => number;

function fillColumns(t: Terrain, surface: (x: number) => number, matFn: MatFn, x0 = 0, x1 = WORLD_W, bottom?: (x: number) => number): void {
  const c0 = Math.max(0, Math.floor(x0 / CELL));
  const c1 = Math.min(COLS - 1, Math.ceil(x1 / CELL));
  for (let cx = c0; cx <= c1; cx++) {
    const x = (cx + 0.5) * CELL;
    const top = surface(x);
    const bot = bottom ? bottom(x) : WORLD_H;
    const cy0 = Math.max(0, Math.floor(top / CELL));
    const cy1 = Math.min(ROWS - 1, Math.floor(bot / CELL));
    for (let cy = cy0; cy <= cy1; cy++) {
      const y = (cy + 0.5) * CELL;
      const m = matFn(x, y, y - top);
      if (m !== Mat.Empty) t.set(cx, cy, m);
    }
  }
}

function blob(t: Terrain, x: number, y: number, rx: number, ry: number, m: number, seed: number, rough = 0.25, overwrite = true): void {
  const c0 = Math.floor((x - rx * 1.4) / CELL), c1 = Math.ceil((x + rx * 1.4) / CELL);
  const r0 = Math.floor((y - ry * 1.4) / CELL), r1 = Math.ceil((y + ry * 1.4) / CELL);
  for (let cy = Math.max(0, r0); cy <= Math.min(ROWS - 1, r1); cy++) {
    for (let cx = Math.max(0, c0); cx <= Math.min(COLS - 1, c1); cx++) {
      const px = (cx + 0.5) * CELL, py = (cy + 0.5) * CELL;
      const dx = (px - x) / rx, dy = (py - y) / ry;
      const a = Math.atan2(dy, dx);
      const wob = 1 + rough * (noise1((a + Math.PI) * 2.2, seed) - 0.5) * 2;
      if (dx * dx + dy * dy <= wob * wob) {
        if (m === Mat.Empty) {
          const cur = t.get(cx, cy);
          if (cur !== Mat.Bedrock && cur !== Mat.Core) t.set(cx, cy, Mat.Empty);
        } else if (overwrite || t.get(cx, cy) === Mat.Empty) t.set(cx, cy, m);
      }
    }
  }
}

function rect(t: Terrain, x0: number, y0: number, x1: number, y1: number, m: number): void {
  for (let cy = Math.max(0, Math.floor(y0 / CELL)); cy <= Math.min(ROWS - 1, Math.floor(y1 / CELL)); cy++)
    for (let cx = Math.max(0, Math.floor(x0 / CELL)); cx <= Math.min(COLS - 1, Math.floor(x1 / CELL)); cx++) t.set(cx, cy, m);
}

function thickLine(t: Terrain, x0: number, y0: number, x1: number, y1: number, w: number, m: number, sag = 0): void {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const steps = Math.ceil(len / (CELL * 0.6));
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const x = x0 + (x1 - x0) * u;
    const y = y0 + (y1 - y0) * u + sag * Math.sin(u * Math.PI);
    rect(t, x - CELL, y - w / 2, x + CELL, y + w / 2, m);
  }
}

function mirrorPts(half: Pt[]): Pt[] {
  const out = [...half];
  for (let i = half.length - 2; i >= 0; i--) out.push([WORLD_W - half[i]![0], half[i]![1]]);
  return out;
}

function surfaceNoise(seed: number, amp: number, freq = 90): (x: number) => number {
  return (x) => (noise1(x / freq, seed) - 0.5) * amp + (noise1(x / (freq / 4), seed + 7) - 0.5) * amp * 0.28;
}

/** 좌우 대칭에 가깝게 만들되 시드에 따라 조금씩 다르게 */
function symNoise(seed: number, amp: number, freq = 90): (x: number) => number {
  const n = surfaceNoise(seed, amp, freq);
  const m = surfaceNoise(seed + 101, amp * 0.35, freq);
  return (x) => (n(x) + n(WORLD_W - x)) * 0.5 + m(x);
}

// ───────── 전장 다섯 곳 ─────────

const baekdu: MapDef = {
  id: 'baekdu', name: '백두산 화산지대', desc: '검은 바위와 잿빛 비탈. 바위 기둥이 무너지면 낙석이 쏟아집니다.',
  features: '단단한 암석 · 바위 기둥 · 낙석 위험 큼', voidBottom: false, spawn: [230, 560], windBias: 0.5,
  sky: ['#2b1a2e', '#7a3b2e', '#e0874a'],
  colors: {
    [Mat.Dirt]: { base: '#6b5248', dark: '#3d2c27', crust: '#8f8a84' },
    [Mat.Rock]: { base: '#4a4450', dark: '#2a2630', crust: '#6f6878' },
    [Mat.Bedrock]: { base: '#26202a', dark: '#141016' },
    [Mat.Core]: { base: '#3b2f33', dark: '#1d1619' },
    [Mat.Wall]: { base: '#7a6a5e', dark: '#4a3e36' },
    [Mat.Wood]: { base: '#6e4a30', dark: '#3e2919' },
    [Mat.Leaf]: { base: '#4f6a3a', dark: '#2c3d20' },
  },
  generate(t, rng, seed) {
    const pts = mirrorPts([[0, 640], [180, 660], [420, 690], [640, 715], [820, 700], [960, 530], [1090, 395], [1150, 352], [1200, 392]]);
    const nz = symNoise(seed, 34);
    const surf = (x: number) => profile(x, pts) + nz(x);
    fillColumns(t, surf, (x, y, d) => {
      if (y > 1150 - 18 * noise1(x / 70, seed + 3)) return Mat.Bedrock;
      const steep = y < 600;
      if (d < 12 && !steep) return Mat.Dirt;
      if (steep) return noise2(x / 40, y / 40, seed + 5) > 0.72 ? Mat.Dirt : Mat.Rock;
      return noise2(x / 180, y / 30, seed + 9) > 0.5 || noise2(x / 60, y / 60, seed + 19) > 0.74 ? Mat.Rock : Mat.Dirt;
    });
    // 바위 기둥(낙석의 근원)
    for (const sx of [760 + rng.range(-30, 30), 1640 + rng.range(-30, 30)]) {
      const base = surf(sx);
      const h = rng.range(110, 150);
      blob(t, sx, base - h * 0.5, 18, h * 0.55, Mat.Rock, seed + (sx | 0), 0.18);
      blob(t, sx + rng.range(-8, 8), base - h, 30, 18, Mat.Rock, seed + 31 + (sx | 0), 0.3);
    }
    // 화산 옆구리 바위 처마
    blob(t, 1010, 486, 78, 15, Mat.Rock, seed + 41, 0.2);
    blob(t, 1390, 486, 78, 15, Mat.Rock, seed + 42, 0.2);
    // 고원 아래 동굴(무너질 천장)
    blob(t, 520 + rng.range(-40, 40), 830, 115, 40, Mat.Empty, seed + 51, 0.3);
    blob(t, 1880 + rng.range(-40, 40), 830, 115, 40, Mat.Empty, seed + 52, 0.3);
    // 분화구 아래 빈 굴
    blob(t, 1200, 520, 60, 38, Mat.Empty, seed + 53, 0.25);
  },
};

const sanseong: MapDef = {
  id: 'sanseong', name: '조선 산성', desc: '언덕 위 성벽 사이로 포탄이 오갑니다. 성벽도 부서집니다.',
  features: '부서지는 성벽 · 높낮이 다른 발판', voidBottom: false, spawn: [260, 560], windBias: 0.45,
  sky: ['#1d2b4a', '#5a6f9a', '#f2c48a'],
  colors: {
    [Mat.Dirt]: { base: '#7a5a3a', dark: '#4a3320', crust: '#5f8c3e' },
    [Mat.Rock]: { base: '#6a6660', dark: '#3e3b37', crust: '#7c8a5c' },
    [Mat.Bedrock]: { base: '#2f2a26', dark: '#1a1714' },
    [Mat.Core]: { base: '#4a443c', dark: '#29251f' },
    [Mat.Wall]: { base: '#b7ab96', dark: '#6d6455' },
    [Mat.Wood]: { base: '#7a4e2e', dark: '#432a17' },
    [Mat.Leaf]: { base: '#4e7a3a', dark: '#2b4620' },
  },
  generate(t, rng, seed) {
    const pts = mirrorPts([[0, 600], [200, 590], [420, 600], [620, 628], [760, 700], [900, 795], [1060, 856], [1200, 828]]);
    const nz = symNoise(seed, 26);
    const surf = (x: number) => profile(x, pts) + nz(x);
    fillColumns(t, surf, (x, y, d) => {
      if (y > 1150 - 16 * noise1(x / 60, seed + 3)) return Mat.Bedrock;
      if (d < 10) return Mat.Dirt;
      if (y > 930 + 50 * noise1(x / 120, seed)) return noise2(x / 160, y / 28, seed + 1) > 0.3 ? Mat.Rock : Mat.Dirt;
      return noise2(x / 200, y / 24, seed + 2) > 0.66 ? Mat.Rock : Mat.Dirt;
    });
    const wall = (x0: number, w: number, h: number) => {
      const base = Math.max(surf(x0), surf(x0 + w));
      rect(t, x0, base - h, x0 + w, base + 26, Mat.Wall);
      for (let x = x0; x < x0 + w; x += 18) rect(t, x, base - h - 14, x + 10, base - h, Mat.Wall);
    };
    const jitter = rng.range(-20, 20);
    wall(700 + jitter, 40, rng.range(100, 125));
    wall(1660 - jitter, 40, rng.range(100, 125));
    // 가운데 망루
    const cb = surf(1200);
    rect(t, 1168, cb - 150, 1232, cb + 30, Mat.Wall);
    for (let x = 1162; x < 1238; x += 19) rect(t, x, cb - 166, x + 10, cb - 150, Mat.Wall);
    blob(t, 1200, cb - 20, 16, 26, Mat.Empty, seed + 9, 0.05); // 성문 구멍
    // 언덕 속 돌무더기
    blob(t, 420, 760, 70, 40, Mat.Rock, seed + 11, 0.3, false);
    blob(t, 1980, 760, 70, 40, Mat.Rock, seed + 12, 0.3, false);
    // 계곡 아래 굴
    blob(t, 1200, 960, 150, 34, Mat.Empty, seed + 13, 0.35);
  },
};

const forest: MapDef = {
  id: 'forest', name: '도깨비 숲', desc: '구불구불한 숲길과 굵은 나무. 나무 밑동을 맞히면 쓰러집니다.',
  features: '쓰러지는 나무 · 바위 덩이 · 굴곡진 지형', voidBottom: false, spawn: [240, 560], windBias: 0.35,
  sky: ['#0d1a24', '#1f3d4a', '#4f7a6a'],
  colors: {
    [Mat.Dirt]: { base: '#4a3a2c', dark: '#2a2018', crust: '#3f7a4a' },
    [Mat.Rock]: { base: '#55605c', dark: '#2f3634', crust: '#5f7f62' },
    [Mat.Bedrock]: { base: '#1d2220', dark: '#0f1211' },
    [Mat.Core]: { base: '#2e3633', dark: '#161b19' },
    [Mat.Wall]: { base: '#7e7a6a', dark: '#4a473e' },
    [Mat.Wood]: { base: '#5a3a26', dark: '#2e1d12' },
    [Mat.Leaf]: { base: '#2f6a4a', dark: '#173a28', crust: '#5aa86a' },
  },
  generate(t, rng, seed) {
    const pts = mirrorPts([[0, 700], [160, 680], [330, 640], [520, 690], [700, 625], [880, 700], [1040, 760], [1200, 702]]);
    const nz = symNoise(seed, 44, 70);
    const surf = (x: number) => profile(x, pts) + nz(x);
    fillColumns(t, surf, (x, y, d) => {
      if (y > 1150 - 20 * noise1(x / 60, seed + 3)) return Mat.Bedrock;
      if (d < 9) return Mat.Dirt;
      return noise2(x / 150, y / 28, seed + 4) > 0.64 ? Mat.Rock : Mat.Dirt;
    });
    // 나무
    const spots = [700, 1060, 1340, 1700];
    for (const s of spots) {
      const x = s + rng.range(-35, 35);
      const base = surf(x);
      const h = rng.range(110, 175);
      rect(t, x - 8, base - h, x + 8, base + 14, Mat.Wood);
      rect(t, x - 14, base - 12, x + 14, base + 10, Mat.Wood); // 뿌리
      const cy = base - h;
      blob(t, x, cy - 10, rng.range(36, 48), rng.range(26, 34), Mat.Leaf, seed + (x | 0), 0.35);
      blob(t, x - 26, cy + 10, 24, 18, Mat.Leaf, seed + 3 + (x | 0), 0.35);
      blob(t, x + 26, cy + 8, 24, 18, Mat.Leaf, seed + 5 + (x | 0), 0.35);
    }
    // 바위 덩이
    for (const s of [610, 1790]) blob(t, s + rng.range(-25, 25), surf(s) - 8, 34, 26, Mat.Rock, seed + s, 0.3);
    // 굴
    blob(t, 1200, 870, 170, 38, Mat.Empty, seed + 21, 0.35);
    blob(t, 640, 900, 90, 30, Mat.Empty, seed + 22, 0.35);
    blob(t, 1760, 900, 90, 30, Mat.Empty, seed + 23, 0.35);
  },
};

const cloud: MapDef = {
  id: 'cloud', name: '구름 궁궐', desc: '하늘에 뜬 섬과 나무다리. 발밑이 사라지면 구름 아래로 떨어집니다.',
  features: '떠 있는 섬 · 나무다리 · 낙사 위험 큼', voidBottom: true, spawn: [250, 560], windBias: 0.65,
  sky: ['#3a6ea8', '#8fbbe0', '#f6e6c8'],
  colors: {
    [Mat.Dirt]: { base: '#8a6a4a', dark: '#5a4230', crust: '#7fbf6a' },
    [Mat.Rock]: { base: '#9aa3b8', dark: '#5f6680', crust: '#c9d3e6' },
    [Mat.Bedrock]: { base: '#4a5070', dark: '#2a2f45' },
    [Mat.Core]: { base: '#d9c9a0', dark: '#8a7a50' },
    [Mat.Wall]: { base: '#3d4a5c', dark: '#1f2733' },
    [Mat.Wood]: { base: '#9a5a32', dark: '#5a3018' },
    [Mat.Leaf]: { base: '#5a9a5a', dark: '#2f5a32' },
  },
  generate(t, rng, seed) {
    const islands: [number, number, number, number][] = [
      [110, 720, 640, 250],
      [850, 1050, 592, 125],
      [1108, 1292, 542, 150],
      [1350, 1550, 592, 125],
      [1680, 2290, 640, 250],
    ];
    islands.forEach(([x0, x1, top, thick], k) => {
      const nz = surfaceNoise(seed + k * 13, 16, 60);
      const w = x1 - x0;
      const surf = (x: number) => {
        const u = (x - x0) / w;
        const edge = Math.min(u, 1 - u);
        return top + nz(x) + (edge < 0.08 ? (0.08 - edge) * 260 : 0);
      };
      const bottom = (x: number) => {
        const u = clamp((x - x0) / w, 0, 1);
        return top + thick * Math.pow(Math.sin(u * Math.PI), 0.7) + (noise1(x / 30, seed + k) - 0.5) * 30;
      };
      fillColumns(t, surf, (x, y, d) => {
        if (d < 10) return Mat.Dirt;
        return noise2(x / 140, y / 30, seed + k * 7) > 0.45 ? Mat.Rock : Mat.Dirt;
      }, x0, x1, bottom);
      blob(t, (x0 + x1) / 2, top + thick * 0.52, Math.max(18, w * 0.11), thick * 0.2, Mat.Core, seed + 70 + k, 0.15);
    });
    // 나무다리
    thickLine(t, 700, 648, 862, 600, 8, Mat.Wood, 6);
    thickLine(t, 1040, 600, 1116, 552, 8, Mat.Wood, 3);
    thickLine(t, 1284, 552, 1360, 600, 8, Mat.Wood, 3);
    thickLine(t, 1538, 600, 1700, 648, 8, Mat.Wood, 6);
    // 정자: 나무 기둥 둘, 기와 지붕
    const top = 542 + rng.range(-2, 2);
    rect(t, 1142, top - 74, 1152, top + 4, Mat.Wood);
    rect(t, 1248, top - 74, 1258, top + 4, Mat.Wood);
    for (let i = 0; i < 26; i++) {
      const y = top - 100 + i;
      const inset = Math.max(0, 26 - i) * 1.6 - Math.max(0, i - 18) * 2.2;
      rect(t, 1108 + inset, y, 1292 - inset, y + 1, Mat.Wall);
    }
  },
};

const underworld: MapDef = {
  id: 'underworld', name: '저승의 강', desc: '어두운 강 위로 가느다란 돌다리. 절벽 끝은 얇아서 쉽게 무너집니다.',
  features: '얇은 돌다리 · 깎아지른 절벽 · 강에 빠지면 끝', voidBottom: true, spawn: [220, 560], windBias: 0.55,
  sky: ['#0b0814', '#2a1838', '#5a2f4a'],
  colors: {
    [Mat.Dirt]: { base: '#3e3242', dark: '#211a24', crust: '#6a4a7a' },
    [Mat.Rock]: { base: '#4c4a5e', dark: '#26243a', crust: '#6e6a8e' },
    [Mat.Bedrock]: { base: '#18141f', dark: '#0b090f' },
    [Mat.Core]: { base: '#2a2238', dark: '#15111c' },
    [Mat.Wall]: { base: '#5a4e5e', dark: '#30283a' },
    [Mat.Wood]: { base: '#4a3226', dark: '#271a12' },
    [Mat.Leaf]: { base: '#3a4a5a', dark: '#1d2630' },
  },
  generate(t, rng, seed) {
    const nz = symNoise(seed, 30);
    const left = (x: number) => profile(x, [[0, 600], [200, 588], [420, 612], [640, 592], [820, 604], [890, 628]]) + nz(x);
    const mat: MatFn = (x, y, d) => {
      if (y > 1150 && (x < 760 || x > WORLD_W - 760)) return Mat.Bedrock;
      if (d < 10) return Mat.Dirt;
      return noise2(x / 170, y / 30, seed + 6) > 0.5 ? Mat.Rock : Mat.Dirt;
    };
    const cliffL = 905 + rng.range(-12, 12);
    const cliffR = WORLD_W - 905 + rng.range(-12, 12);
    fillColumns(t, left, mat, 0, cliffL);
    fillColumns(t, (x) => left(WORLD_W - x), mat, cliffR, WORLD_W);
    // 절벽 아래 파인 곳(처마처럼 튀어나온 땅)
    blob(t, cliffL - 40, 780, 70, 55, Mat.Empty, seed + 31, 0.3);
    blob(t, cliffR + 40, 780, 70, 55, Mat.Empty, seed + 32, 0.3);
    // 절벽 벽에 붙은 얇은 선반
    rect(t, cliffL - 10, 880, cliffL + 80, 894, Mat.Dirt);
    rect(t, cliffR - 80, 880, cliffR + 10, 894, Mat.Dirt);
    // 강을 건너는 얇은 돌다리
    thickLine(t, cliffL - 30, 690, cliffR + 30, 690, 16, Mat.Rock, 42);
    // 가운데 돌기둥(다리를 떠받치는 저승 돌)
    rect(t, 1188, 735, 1212, 760, Mat.Core);
  },
};

export const MAPS: MapDef[] = [baekdu, sanseong, forest, cloud, underworld];

export function mapDef(id: string): MapDef {
  const m = MAPS.find((x) => x.id === id);
  if (!m) throw new Error(`알 수 없는 전장: ${id}`);
  return m;
}

export function generateTerrain(def: MapDef, seed: number): Terrain {
  const t = new Terrain();
  def.generate(t, new Rng(seed ^ 0x5eed), seed);
  // 생성 직후 떠 있는 조각(지지점 없는 덩어리)은 지운다
  t.extractUnsupported([{ x0: 0, y0: 0, x1: COLS - 1, y1: ROWS - 1 }]);
  t.dirty.length = 0;
  t.pending.length = 0;
  t.removedTotal = 0;
  return t;
}

/** 서 있을 자리 평가: 밑이 단단하고, 머리 위가 트이고, 평평할수록 좋다 */
export function spotScore(t: Terrain, x: number): number {
  const y = t.topSurface(x);
  if (y < 0) return -1;
  // 머리 위 70px가 비어 있어야 한다(topSurface이므로 항상 비어 있음)
  let depth = 0;
  for (let d = 0; d < 60; d += CELL) if (t.solidAt(x, y + d)) depth += CELL;
  if (depth < 40) return -1;
  const yl = t.topSurface(x - 12), yr = t.topSurface(x + 12);
  if (yl < 0 || yr < 0) return -1;
  const slope = Math.abs(yl - yr);
  if (slope > 14) return -1;
  // 양옆 40px 안에 낭떠러지가 없어야 한다
  for (const dx of [-40, 40]) {
    const yy = t.topSurface(x + dx);
    if (yy < 0 || yy - y > 120) return -1;
  }
  return 100 - slope * 3;
}

export function findSpawns(t: Terrain, def: MapDef, rng: Rng): [number, number] {
  const [a, b] = def.spawn;
  const tries: number[] = [];
  for (let x = a; x <= b; x += 6) tries.push(x);
  // 시드에 따라 섞는다
  for (let i = tries.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [tries[i], tries[j]] = [tries[j]!, tries[i]!];
  }
  let best: [number, number] = [a, WORLD_W - a];
  let bestScore = -Infinity;
  for (const x1 of tries.slice(0, 40)) {
    const s1 = spotScore(t, x1);
    if (s1 < 0) continue;
    // 2P는 거울 위치에서 ±40px 안에서 찾는다
    for (let off = 0; off <= 40; off += 4) {
      for (const sgn of [1, -1]) {
        const x2 = WORLD_W - x1 + sgn * off;
        const s2 = spotScore(t, x2);
        if (s2 < 0) continue;
        const hdiff = Math.abs(t.topSurface(x1) - t.topSurface(x2));
        const score = s1 + s2 - hdiff * 0.8 - off * 0.3 + rng.next() * 6;
        if (score > bestScore) {
          bestScore = score;
          best = [x1, x2];
        }
      }
    }
  }
  return best;
}
