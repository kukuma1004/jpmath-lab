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
  ringOutY?: number; // 이 선 아래로 떨어지면 체력과 무관하게 탈락
  spawn: [number, number]; // 1P가 설 수 있는 x 범위(px). 2P는 거울 위치 근처
  spawnTiers?: readonly [readonly [number, number], readonly [number, number]];
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
    [Mat.Dirt]: { base: '#6a4a52', dark: '#38242c', crust: '#e3d9ee' },
    [Mat.Rock]: { base: '#4d4560', dark: '#272138', crust: '#d6cde6' },
    [Mat.Bedrock]: { base: '#2a2032', dark: '#140e1a' },
    [Mat.Core]: { base: '#4a3040', dark: '#24141e' },
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
    [Mat.Dirt]: { base: '#7a5844', dark: '#3e2a24', crust: '#5c8a4a' },
    [Mat.Rock]: { base: '#68667a', dark: '#34324a', crust: '#6f8a62' },
    [Mat.Bedrock]: { base: '#2c2838', dark: '#15121c' },
    [Mat.Core]: { base: '#4a4458', dark: '#24202e' },
    [Mat.Wall]: { base: '#c2b8a8', dark: '#6a6070' },
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
    [Mat.Dirt]: { base: '#46385a', dark: '#211a33', crust: '#3e8a86' },
    [Mat.Rock]: { base: '#4c5878', dark: '#232a44', crust: '#4a8a8e' },
    [Mat.Bedrock]: { base: '#1a1a2c', dark: '#0c0c16' },
    [Mat.Core]: { base: '#2c2c48', dark: '#141424' },
    [Mat.Wall]: { base: '#7a7690', dark: '#3e3a52' },
    [Mat.Wood]: { base: '#55402e', dark: '#2a1c14' },
    [Mat.Leaf]: { base: '#6a4aa8', dark: '#33205e', crust: '#9a7ad8' },
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
    [Mat.Dirt]: { base: '#a07e5e', dark: '#5e4434', crust: '#7cc86a' },
    [Mat.Rock]: { base: '#a8b0c6', dark: '#5a6286', crust: '#86c67a' },
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
    [Mat.Dirt]: { base: '#4a3452', dark: '#22142a', crust: '#8a4a8e' },
    [Mat.Rock]: { base: '#55506e', dark: '#26203e', crust: '#7a5a9a' },
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

const bridge: MapDef = {
  id: 'bridge', name: '벼랑 외나무다리', desc: '협곡 위의 나무다리를 끊어 상대를 떨어뜨리세요. 아래 추락선을 넘으면 남은 체력과 무관하게 탈락합니다.',
  features: '끊기는 나무다리 · 위아래 발판 · 추락 시 탈락', voidBottom: true, ringOutY: 900, spawn: [400, 900], windBias: 0.45,
  sky: ['#614578', '#9c849f', '#d6a57c'],
  colors: {
    [Mat.Dirt]: { base: '#8d654c', dark: '#423641', crust: '#bf9d52' },
    [Mat.Rock]: { base: '#666580', dark: '#373447', crust: '#b6a384' },
    [Mat.Bedrock]: { base: '#353244', dark: '#181b2b' },
    [Mat.Core]: { base: '#4d455a', dark: '#272335' },
    [Mat.Wall]: { base: '#9c8d7d', dark: '#544a50' },
    [Mat.Wood]: { base: '#aa783f', dark: '#55372b' },
    [Mat.Leaf]: { base: '#b97849', dark: '#5e3b3e' },
  },
  generate(t) {
    fillColumns(t, () => 570, (_x,y,d) => y > 820 ? Mat.Core : d < 8 ? Mat.Dirt : Mat.Rock, 0, 350, () => 850);
    fillColumns(t, () => 570, (_x,y,d) => y > 820 ? Mat.Core : d < 8 ? Mat.Dirt : Mat.Rock, 2050, WORLD_W, () => 850);
    thickLine(t, 320, 600, 2080, 600, 16, Mat.Wood, 90);
    rect(t, 730, 472, 930, 488, Mat.Wood);
    rect(t, 770, 480, 784, 675, Mat.Wood);
    rect(t, 876, 480, 890, 680, Mat.Wood);
    rect(t, 1420, 780, 1640, 796, Mat.Wood);
    rect(t, 1460, 674, 1474, 788, Mat.Wood);
    rect(t, 1586, 668, 1600, 788, Mat.Wood);
  },
};

// Each independent shelf reaches inward far enough to catch a walk off the shelf above.
const quarryLedges = [
  { start: 0, edge: 640, top: 442, thickness: 82 },
  { start: 348, edge: 858, top: 568, thickness: 74 },
  { start: 656, edge: 994, top: 692, thickness: 68 },
  { start: 868, edge: 1082, top: 822, thickness: 62 },
] as const;

const quarry: MapDef = {
  id: 'quarry', name: '층층 채석장', desc: '양끝의 긴 고지 아래로 짧아지는 네 개의 발판입니다. 중앙 쪽 끝에서 내려가면 바로 아래 발판에 닿습니다. 마지막 단 밖은 협곡입니다.',
  features: '분리된 네 발판 · 한 단씩 착지 · 중앙 협곡 낙사', voidBottom: true, ringOutY: 1060,
  spawn: [390, 816], spawnTiers: [[390, 530], [706, 816]], windBias: 0.3,
  sky: ['#7cadd1', '#c9dddc', '#d9b991'],
  colors: {
    [Mat.Dirt]: { base: '#ae8a5e', dark: '#5a463e', crust: '#eed296' },
    [Mat.Rock]: { base: '#758998', dark: '#33485b', crust: '#c9bd9d' },
    [Mat.Bedrock]: { base: '#344758', dark: '#1d2c3d' },
    [Mat.Core]: { base: '#637f8c', dark: '#344957' },
    [Mat.Wall]: { base: '#a49e8e', dark: '#565c60' },
    [Mat.Wood]: { base: '#8f6b44', dark: '#4b3a2d' },
    [Mat.Leaf]: { base: '#749373', dark: '#354f4e' },
  },
  generate(t, _rng, seed) {
    for (const { start, edge, top, thickness } of quarryLedges) {
      const span = edge - start;
      const base = (x: number) => {
        const bevel = Math.max(0, 24 - Math.min(x - start, edge - x) * 0.46);
        return top + thickness - bevel + (noise1(x / 34, seed + top) - 0.5) * 12;
      };
      fillColumns(t, () => top, (x, y, depth) => {
        if (depth < 12) return Mat.Dirt;
        const seam = thickness * 0.56 + (noise1(x / 52, seed + 7) - 0.5) * 15;
        return Math.abs(y - top - seam) < 4 ? Mat.Dirt : Mat.Rock;
      }, start, edge - CELL, base);
      // A short embedded support holds the outer end; the landing end can break off.
      rect(t, start + span * 0.15, top + 26, start + span * 0.28, top + 38, Mat.Core);
    }
  },
};

const windrift: MapDef = {
  id: 'windrift', name: '바람칼 협곡',
  desc: '넓은 협곡 양쪽에 위아래로 얇은 돌 발판이 놓여 있습니다. 협곡 너머로 포탄을 쏘고, 상대 발밑을 끊어 추락을 노리세요.',
  features: '장거리 포격 · 얇은 발판 · 추락 시 탈락',
  voidBottom: true, ringOutY: 1010, spawn: [301, 590],
  spawnTiers: [[301, 349], [533, 589]], windBias: 0.28,
  sky: ['#5b6486', '#b59cae', '#e4be9e'],
  colors: {
    [Mat.Dirt]: { base: '#b57b62', dark: '#62424c', crust: '#f1c18e' },
    [Mat.Rock]: { base: '#797a94', dark: '#3c405b', crust: '#d4ab89' },
    [Mat.Core]: { base: '#56536b', dark: '#303146' },
  },
  generate(t, _rng, seed) {
    const ledges = [
      { start: 236, end: 430, top: 432, thickness: 36 },
      { start: 476, end: 640, top: 600, thickness: 28 },
    ];
    for (const { start, end, top, thickness } of ledges) {
      const underside = (x: number) => {
        const bevel = Math.max(0, 8 - Math.min(x - start, end - x) * 0.42);
        return top + thickness - bevel + (noise1(x / 29, seed + top) - 0.5) * 5;
      };
      fillColumns(t, () => top, (_x, _y, depth) => depth < 6 ? Mat.Dirt : Mat.Rock, start, end - CELL, underside);
      rect(t, start + 12, top + 10, start + 26, top + 16, Mat.Core);
    }
  },
};

export const MAPS: MapDef[] = [quarry, windrift, bridge, sanseong, baekdu, forest, cloud, underworld];

export function mapDef(id: string): MapDef {
  const m = MAPS.find((x) => x.id === id);
  if (!m) throw new Error(`알 수 없는 전장: ${id}`);
  return m;
}

export function generateTerrain(def: MapDef, seed: number): Terrain {
  const t = new Terrain();
  def.generate(t, new Rng(seed ^ 0x5eed), seed);
  // 충돌 지형도 중앙을 기준으로 반사한다. 높이뿐 아니라 발판 두께·재질·지지점도 같다.
  for (let cy=0;cy<ROWS;cy++) {
    const row=cy*COLS;
    for(let cx=0;cx<COLS/2;cx++) t.cells[row+COLS-1-cx]=t.cells[row+cx]!;
  }
  // 생성 직후 떠 있는 조각(지지점 없는 덩어리)은 지운다
  t.extractUnsupported([{ x0: 0, y0: 0, x1: COLS - 1, y1: ROWS - 1 }]);
  t.dirty.length = 0;
  t.pending.length = 0;
  t.removedTotal = 0;
  return t;
}

export interface SpawnPoint { x: number; y: number; }

/** 발을 받치되 몸과 머리가 끼지 않는 자리. 얇은 다리와 높은 발판도 허용한다. */
export function spotScore(t: Terrain, x: number, y = t.topSurface(x)): number {
  if (y < 160 || y > 1000 || !t.solidAt(x, y)) return -1;
  for (const dx of [-12, 0, 12]) {
    for (const up of [8, 20, 36, 52]) if (t.solidAt(x + dx, y - up)) return -1;
    const support = t.surfaceBelow(x + dx, y - 6, 20);
    if (support < 0 || Math.abs(support - y) > 6) return -1;
  }
  let depth = 0;
  for (let d = 0; d < 16; d += CELL) if (t.solidAt(x, y + d)) depth += CELL;
  return depth >= 10 ? 100 : -1;
}

/** 셀 중심을 골라 x ↔ WORLD_W-x가 정확히 반대편 셀 중심이 되게 한다. */
function symmetricSpawnCandidates(t: Terrain): SpawnPoint[] {
  const pool: SpawnPoint[] = [];
  const minX=300+CELL/2, maxX=(WORLD_W-380)/2;
  for(let x=minX;x<=maxX;x+=8){
    const y=t.topSurface(x), mirrorX=WORLD_W-x;
    if(spotScore(t,x,y)<0 || t.topSurface(mirrorX)!==y || spotScore(t,mirrorX,y)<0)continue;
    pool.push({x,y});
  }
  return pool;
}

/** 같은 높이·발판의 거울 위치를 한 쌍으로 뽑는다. 두 팀의 좌우와 아군 순서만 섞는다. */
export function findSpawnPoints(t: Terrain, def: MapDef, rng: Rng, count: 2 | 4): SpawnPoint[] {
  const pool=symmetricSpawnCandidates(t);
  const pick = (choices: SpawnPoint[]) => choices[Math.floor(rng.next() * choices.length)]!;
  const tiers = def.spawnTiers?.map(([start, end]) => pool.filter(point => point.x >= start && point.x <= end));
  let left: SpawnPoint[];
  if (tiers?.[0]?.length && tiers[1]?.length) {
    left = count === 2
      ? [pick(rng.next() < 0.5 ? tiers[0] : tiers[1])]
      : [pick(tiers[0]), pick(tiers[1])];
    if (count === 4 && rng.next() < 0.5) left.reverse();
  } else if(count===2 && pool.length){
    const inner=pool.filter(p=>p.x>650),outer=pool.filter(p=>p.x<=650);
    const preferred=rng.next()<0.65?inner:outer;
    const choices=preferred.length?preferred:pool;
    left=[pick(choices)];
  }else{
    const pairs: [SpawnPoint,SpawnPoint][]=[];
    for(let i=0;i<pool.length;i++)for(let j=i+1;j<pool.length;j++){
      const a=pool[i]!,b=pool[j]!;
      if(Math.abs(a.x-b.x)>=160)pairs.push([a,b]);
    }
    if(!pairs.length)throw new Error(`${def.id}: 장수 ${count}명이 안전하게 설 대칭 자리를 찾지 못했습니다`);
    left=[...pairs[Math.floor(rng.next()*pairs.length)]!];
    if(rng.next()<0.5)left.reverse();
  }
  const swapSides=rng.next()<0.5;
  return left.flatMap(p=>{
    const q={x:WORLD_W-p.x,y:p.y};
    return swapSides?[q,{...p}]:[{...p},q];
  });
}
