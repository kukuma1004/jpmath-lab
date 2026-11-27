/**
 * 전장 배경(코드로 그린 임시 그림). 층마다 캔버스 하나.
 * 논리 크기 LAYER_W×LAYER_H를 RES 배율로 그려 두고 화면에서 늘려 쓴다(먼 배경은 조금 흐려도 된다).
 */
import { noise1, hash2 } from '../utils/rng';
import { VIEW_H } from '../config/constants';

export const LAYER_W = 2400;
export const LAYER_H = 900;
export const HORIZON = 620; // 화면 높이 720 기준 지평선

export interface BgLayers {
  sky: HTMLCanvasElement; // 화면 고정
  far: HTMLCanvasElement;
  mid: HTMLCanvasElement;
  near: HTMLCanvasElement;
  ambient: 'embers' | 'leaves' | 'fireflies' | 'clouds' | 'souls';
}

type C = CanvasRenderingContext2D;

function canvas(w: number, h: number, res: number): [HTMLCanvasElement, C] {
  const c = document.createElement('canvas');
  c.width = Math.ceil(w * res);
  c.height = Math.ceil(h * res);
  const ctx = c.getContext('2d')!;
  ctx.scale(res, res);
  return [c, ctx];
}

function ridge(ctx: C, base: number, amp: number, freq: number, seed: number, fill: string | CanvasGradient, sharp = 0.3) {
  ctx.beginPath();
  ctx.moveTo(0, LAYER_H);
  for (let x = 0; x <= LAYER_W; x += 6) {
    const n = noise1(x / freq, seed) * 0.65 + noise1(x / (freq / 3), seed + 5) * 0.25 + noise1(x / (freq / 9), seed + 9) * 0.1 * (1 + sharp * 3);
    ctx.lineTo(x, base - n * amp);
  }
  ctx.lineTo(LAYER_W, LAYER_H);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function vg(ctx: C, y0: number, y1: number, stops: [number, string][]): CanvasGradient {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  for (const [o, c] of stops) g.addColorStop(o, c);
  return g;
}

function mist(ctx: C, y: number, h: number, color: string) {
  const g = ctx.createLinearGradient(0, y - h, 0, y + h);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.5, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, y - h, LAYER_W, h * 2);
}

function glowDisk(ctx: C, x: number, y: number, r: number, core: string, halo: string) {
  const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 4);
  g.addColorStop(0, halo);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = core;
  ctx.fill();
}

function stars(ctx: C, w: number, h: number, n: number, seed: number) {
  for (let i = 0; i < n; i++) {
    const x = hash2(i, 1, seed) * w, y = hash2(i, 2, seed) * h;
    const a = 0.3 + hash2(i, 3, seed) * 0.7;
    ctx.fillStyle = `rgba(255,248,230,${a})`;
    ctx.fillRect(x, y, 1.6, 1.6);
  }
}

function cloud(ctx: C, x: number, y: number, s: number, light: string, shadow: string) {
  const blobs: [number, number, number][] = [[0, 0, 1], [-0.9, 0.25, 0.7], [0.9, 0.2, 0.75], [-0.4, -0.35, 0.65], [0.45, -0.3, 0.7], [1.6, 0.35, 0.5], [-1.6, 0.4, 0.45]];
  for (const pass of [0, 1]) {
    for (const [bx, by, r] of blobs) {
      ctx.beginPath();
      ctx.arc(x + bx * s, y + by * s + (pass ? 0 : s * 0.12), r * s, 0, Math.PI * 2);
      ctx.fillStyle = pass ? light : shadow;
      ctx.fill();
    }
  }
}

/** 기와지붕 하나(처마가 위로 휜) */
function roof(ctx: C, cx: number, y: number, w: number, h: number, tile: string, edge: string) {
  ctx.beginPath();
  ctx.moveTo(cx - w / 2 - h * 0.6, y + h * 0.2);
  ctx.quadraticCurveTo(cx - w / 2 + h * 0.2, y + h * 0.65, cx - w * 0.3, y + h * 0.1);
  ctx.lineTo(cx - w * 0.22, y - h * 0.55);
  ctx.lineTo(cx + w * 0.22, y - h * 0.55);
  ctx.lineTo(cx + w * 0.3, y + h * 0.1);
  ctx.quadraticCurveTo(cx + w / 2 - h * 0.2, y + h * 0.65, cx + w / 2 + h * 0.6, y + h * 0.2);
  ctx.quadraticCurveTo(cx + w / 2, y + h * 0.45, cx + w * 0.3, y + h * 0.45);
  ctx.lineTo(cx - w * 0.3, y + h * 0.45);
  ctx.quadraticCurveTo(cx - w / 2, y + h * 0.45, cx - w / 2 - h * 0.6, y + h * 0.2);
  ctx.closePath();
  ctx.fillStyle = tile;
  ctx.fill();
  ctx.strokeStyle = edge;
  ctx.lineWidth = 2;
  ctx.stroke();
}

/** 문루·전각(붉은 기둥, 단청 띠, 겹지붕) */
function pavilion(ctx: C, cx: number, base: number, w: number, s: { pillar: string; dan: string; tile: string; edge: string; wall?: string }, floors = 2) {
  let y = base;
  for (let f = 0; f < floors; f++) {
    const fw = w * (1 - f * 0.28);
    const ph = 26 * (w / 120) * (f ? 0.75 : 1);
    if (s.wall) { ctx.fillStyle = s.wall; ctx.fillRect(cx - fw * 0.42, y - ph, fw * 0.84, ph); }
    ctx.fillStyle = s.pillar;
    const n = 4;
    for (let i = 0; i <= n; i++) ctx.fillRect(cx - fw * 0.4 + (i * fw * 0.8) / n - 2, y - ph, 4, ph);
    ctx.fillStyle = s.dan;
    ctx.fillRect(cx - fw * 0.44, y - ph - 5, fw * 0.88, 5);
    roof(ctx, cx, y - ph - 10, fw, 18 * (w / 120), s.tile, s.edge);
    y -= ph + 22 * (w / 120);
  }
}

function pine(ctx: C, x: number, base: number, h: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = h * 0.06;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, base);
  ctx.bezierCurveTo(x + h * 0.15, base - h * 0.4, x - h * 0.12, base - h * 0.6, x + h * 0.05, base - h);
  ctx.stroke();
  ctx.fillStyle = color;
  for (let i = 0; i < 4; i++) {
    const yy = base - h * (0.45 + i * 0.16);
    const xx = x + Math.sin(i * 2.1) * h * 0.08;
    const ww = h * (0.42 - i * 0.07);
    ctx.beginPath();
    ctx.ellipse(xx, yy, ww, h * 0.07, (i % 2 ? 0.08 : -0.08), 0, Math.PI * 2);
    ctx.fill();
  }
}

function fortressWall(ctx: C, y: (x: number) => number, color: string, crenel: string) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, LAYER_H);
  for (let x = 0; x <= LAYER_W; x += 8) ctx.lineTo(x, y(x) - 16);
  ctx.lineTo(LAYER_W, LAYER_H);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = crenel;
  for (let x = 0; x < LAYER_W; x += 18) ctx.fillRect(x, y(x) - 24, 11, 9);
}

// ───────── 전장별 ─────────

function skyCanvas(top: string, mid: string, bottom: string, extra?: (ctx: C) => void): HTMLCanvasElement {
  const [c, ctx] = canvas(1280, 720, 0.5);
  ctx.fillStyle = vg(ctx, 0, 720, [[0, top], [0.62, mid], [1, bottom]]);
  ctx.fillRect(0, 0, 1280, 720);
  extra?.(ctx);
  return c;
}

function baekdu(): BgLayers {
  const sky = skyCanvas('#2b1a2e', '#7a3b2e', '#e0874a', (ctx) => {
    stars(ctx, 1280, 260, 70, 4);
    glowDisk(ctx, 930, 470, 46, '#ffcf7a', 'rgba(255,150,70,0.45)');
  });
  const [far, f] = canvas(LAYER_W, LAYER_H, 0.4);
  ridge(f, HORIZON - 60, 160, 420, 11, vg(f, 360, HORIZON, [[0, '#4a2a38'], [1, '#2e1a26']]));
  // 백두산(가운데 넓은 화산)
  f.beginPath();
  f.moveTo(700, HORIZON);
  f.quadraticCurveTo(1000, 280, 1120, 268);
  f.lineTo(1280, 266);
  f.quadraticCurveTo(1400, 280, 1700, HORIZON);
  f.closePath();
  f.fillStyle = vg(f, 260, HORIZON, [[0, '#553044'], [1, '#2e1a26']]);
  f.fill();
  f.fillStyle = 'rgba(255,225,215,0.22)';
  for (let i = 0; i < 9; i++) f.fillRect(1110 + i * 20, 270 + (i % 3) * 6, 9, 30 + (i % 4) * 14);
  mist(f, HORIZON - 30, 50, 'rgba(255,140,90,0.25)');
  const [mid, m] = canvas(LAYER_W, LAYER_H, 0.5);
  ridge(m, HORIZON + 40, 150, 260, 21, vg(m, 400, HORIZON + 200, [[0, '#2e1c26'], [1, '#160c12']]), 0.8);
  // 용암 틈
  m.strokeStyle = 'rgba(255,120,40,0.8)';
  m.lineWidth = 3;
  for (let i = 0; i < 14; i++) {
    const x = hash2(i, 5, 2) * LAYER_W, y = HORIZON + 40 + hash2(i, 6, 2) * 140;
    m.beginPath(); m.moveTo(x, y);
    for (let k = 1; k < 5; k++) m.lineTo(x + k * 14 + Math.sin(k * 3 + i) * 8, y + k * 10);
    m.stroke();
  }
  for (let i = 0; i < 5; i++) cloud(m, 300 + i * 480, 330 + (i % 2) * 40, 40, 'rgba(90,70,80,0.55)', 'rgba(50,35,45,0.55)');
  const [near, n] = canvas(LAYER_W, LAYER_H, 0.5);
  ridge(n, HORIZON + 170, 110, 180, 31, '#0e070b', 1);
  return { sky, far, mid, near, ambient: 'embers' };
}

function sanseong(): BgLayers {
  const sky = skyCanvas('#1d2b4a', '#5a6f9a', '#f2c48a', (ctx) => {
    stars(ctx, 1280, 200, 40, 7);
    glowDisk(ctx, 260, 170, 26, '#fff4d8', 'rgba(255,240,200,0.3)');
    for (let i = 0; i < 4; i++) cloud(ctx, 200 + i * 320, 260 + (i % 2) * 50, 26, 'rgba(255,220,200,0.5)', 'rgba(140,130,170,0.45)');
  });
  const [far, f] = canvas(LAYER_W, LAYER_H, 0.4);
  ridge(f, HORIZON - 120, 200, 500, 3, vg(f, 300, HORIZON, [[0, '#5a6a92'], [1, '#7a86a6']]));
  mist(f, HORIZON - 120, 40, 'rgba(255,230,210,0.35)');
  ridge(f, HORIZON - 40, 170, 360, 8, vg(f, 360, HORIZON + 100, [[0, '#3c4a72'], [1, '#56628a']]));
  mist(f, HORIZON - 30, 50, 'rgba(250,220,200,0.35)');
  const [mid, m] = canvas(LAYER_W, LAYER_H, 0.5);
  const ry = (x: number) => HORIZON + 30 - (noise1(x / 300, 41) * 0.7 + noise1(x / 90, 42) * 0.3) * 120;
  ctx2Ridge(m, ry, vg(m, 400, HORIZON + 200, [[0, '#26304e'], [1, '#141a2e']]));
  fortressWall(m, ry, '#3a4466', '#2c3454');
  pavilion(m, 1200, ry(1200) - 18, 160, { pillar: '#8a2a2a', dan: '#2f7a6a', tile: '#20263a', edge: '#0e1220', wall: '#cfc2a8' });
  pavilion(m, 420, ry(420) - 18, 90, { pillar: '#7a2a2a', dan: '#2f6a5a', tile: '#20263a', edge: '#0e1220' }, 1);
  pavilion(m, 1980, ry(1980) - 18, 90, { pillar: '#7a2a2a', dan: '#2f6a5a', tile: '#20263a', edge: '#0e1220' }, 1);
  for (const x of [120, 300, 700, 860, 1560, 1720, 2160, 2320]) pine(m, x, ry(x) - 10, 70 + (x % 5) * 8, '#141a2c');
  const [near, n] = canvas(LAYER_W, LAYER_H, 0.5);
  ridge(n, HORIZON + 190, 70, 200, 51, '#0b0e1a', 0.6);
  for (const x of [80, 640, 1100, 1700, 2250]) pine(n, x, HORIZON + 180, 150, '#070a12');
  return { sky, far, mid, near, ambient: 'leaves' };
}

function ctx2Ridge(ctx: C, y: (x: number) => number, fill: CanvasGradient) {
  ctx.beginPath();
  ctx.moveTo(0, LAYER_H);
  for (let x = 0; x <= LAYER_W; x += 8) ctx.lineTo(x, y(x));
  ctx.lineTo(LAYER_W, LAYER_H);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function tree(ctx: C, x: number, base: number, h: number, trunk: string, leaf: string) {
  ctx.fillStyle = trunk;
  ctx.beginPath();
  ctx.moveTo(x - h * 0.05, base);
  ctx.quadraticCurveTo(x - h * 0.02, base - h * 0.5, x - h * 0.03, base - h * 0.8);
  ctx.lineTo(x + h * 0.03, base - h * 0.8);
  ctx.quadraticCurveTo(x + h * 0.04, base - h * 0.4, x + h * 0.07, base);
  ctx.fill();
  ctx.fillStyle = leaf;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(x + Math.sin(i * 1.7) * h * 0.18, base - h * (0.7 + 0.06 * (i % 3)) - (i % 2) * h * 0.1, h * (0.16 + 0.03 * (i % 2)), 0, Math.PI * 2);
    ctx.fill();
  }
}

function forest(): BgLayers {
  const sky = skyCanvas('#0d1a24', '#1f3d4a', '#4f7a6a', (ctx) => {
    stars(ctx, 1280, 320, 110, 9);
    glowDisk(ctx, 980, 150, 40, '#f6f2d6', 'rgba(200,240,220,0.35)');
  });
  const [far, f] = canvas(LAYER_W, LAYER_H, 0.4);
  ridge(f, HORIZON - 40, 120, 400, 5, '#1a3a40');
  for (let i = 0; i < 30; i++) tree(f, i * 82 + hash2(i, 1, 4) * 40, HORIZON + 20, 220 + hash2(i, 2, 4) * 120, '#14303a', '#183840');
  mist(f, HORIZON - 20, 60, 'rgba(140,200,180,0.25)');
  const [mid, m] = canvas(LAYER_W, LAYER_H, 0.5);
  ridge(m, HORIZON + 60, 60, 300, 15, '#0d2228');
  for (let i = 0; i < 18; i++) tree(m, i * 140 + hash2(i, 3, 6) * 70, HORIZON + 60, 260 + hash2(i, 4, 6) * 160, '#0a1a20', '#0e2a2c');
  // 도깨비 등불
  for (let i = 0; i < 16; i++) {
    const x = hash2(i, 9, 2) * LAYER_W, y = HORIZON - 120 + hash2(i, 8, 2) * 200;
    const g = m.createRadialGradient(x, y, 1, x, y, 26);
    g.addColorStop(0, 'rgba(160,255,220,0.9)');
    g.addColorStop(1, 'rgba(60,200,180,0)');
    m.fillStyle = g;
    m.fillRect(x - 26, y - 26, 52, 52);
  }
  const [near, n] = canvas(LAYER_W, LAYER_H, 0.5);
  ridge(n, HORIZON + 200, 50, 160, 25, '#04100f', 0.4);
  for (const x of [60, 520, 980, 1500, 2000, 2340]) tree(n, x, HORIZON + 200, 420, '#030b0b', '#06120f');
  return { sky, far, mid, near, ambient: 'fireflies' };
}

function cloudPalace(): BgLayers {
  const sky = skyCanvas('#3a6ea8', '#8fbbe0', '#f6e6c8', (ctx) => {
    glowDisk(ctx, 1040, 120, 34, '#fffbe8', 'rgba(255,250,220,0.5)');
  });
  const [far, f] = canvas(LAYER_W, LAYER_H, 0.4);
  for (let i = 0; i < 9; i++) cloud(f, 140 + i * 270, HORIZON - 60 + (i % 3) * 40, 70 + (i % 2) * 20, 'rgba(255,255,255,0.92)', 'rgba(170,190,220,0.9)');
  const [mid, m] = canvas(LAYER_W, LAYER_H, 0.5);
  // 먼 구름 위 궁궐
  for (const [x, y, s] of [[380, HORIZON - 70, 120], [1220, HORIZON - 150, 200], [2020, HORIZON - 80, 130]] as [number, number, number][]) {
    cloud(m, x, y + 30, s * 0.55, 'rgba(255,255,255,0.95)', 'rgba(190,205,230,0.95)');
    pavilion(m, x, y, s, { pillar: '#b8322a', dan: '#2f8a7a', tile: '#3d4a5c', edge: '#1f2733', wall: '#efe6d0' }, s > 150 ? 3 : 2);
  }
  // 학
  m.strokeStyle = '#ffffff';
  m.lineWidth = 3;
  for (let i = 0; i < 6; i++) {
    const x = 300 + i * 360, y = HORIZON - 300 + (i % 3) * 40;
    m.beginPath(); m.moveTo(x - 18, y - 6); m.quadraticCurveTo(x - 6, y - 12, x, y); m.quadraticCurveTo(x + 6, y - 12, x + 18, y - 6); m.stroke();
  }
  const [near, n] = canvas(LAYER_W, LAYER_H, 0.5);
  for (let i = 0; i < 8; i++) cloud(n, 150 + i * 310, HORIZON + 230 + (i % 2) * 30, 90, 'rgba(255,255,255,0.97)', 'rgba(200,214,236,0.97)');
  return { sky, far, mid, near, ambient: 'clouds' };
}

function underworld(): BgLayers {
  const sky = skyCanvas('#0b0814', '#2a1838', '#5a2f4a', (ctx) => {
    stars(ctx, 1280, 300, 60, 13);
    glowDisk(ctx, 320, 200, 30, '#d4565a', 'rgba(200,60,80,0.3)');
  });
  const [far, f] = canvas(LAYER_W, LAYER_H, 0.4);
  ridge(f, HORIZON - 30, 260, 260, 17, '#1e1228', 1);
  // 저승 문
  f.fillStyle = '#140b1a';
  f.fillRect(1120, HORIZON - 300, 26, 300);
  f.fillRect(1254, HORIZON - 300, 26, 300);
  roof(f, 1200, HORIZON - 310, 240, 30, '#140b1a', '#0a050c');
  f.fillRect(1100, HORIZON - 270, 200, 14);
  mist(f, HORIZON - 20, 70, 'rgba(150,80,140,0.25)');
  const [mid, m] = canvas(LAYER_W, LAYER_H, 0.5);
  ridge(m, HORIZON + 40, 140, 220, 27, '#120a18', 0.9);
  // 붉은 꽃밭
  for (let i = 0; i < 140; i++) {
    const x = hash2(i, 1, 33) * LAYER_W, y = HORIZON + 60 + hash2(i, 2, 33) * 120;
    m.fillStyle = `rgba(${200 + (i % 40)},40,60,0.8)`;
    m.beginPath(); m.arc(x, y, 3 + (i % 3), 0, Math.PI * 2); m.fill();
  }
  // 강 위 연등
  for (let i = 0; i < 12; i++) {
    const x = 120 + i * 200 + hash2(i, 4, 9) * 60, y = HORIZON + 160 + (i % 3) * 18;
    const g = m.createRadialGradient(x, y, 1, x, y, 30);
    g.addColorStop(0, 'rgba(255,190,110,0.9)');
    g.addColorStop(1, 'rgba(255,120,60,0)');
    m.fillStyle = g;
    m.fillRect(x - 30, y - 30, 60, 60);
    m.fillStyle = '#ffb46a';
    m.fillRect(x - 5, y - 6, 10, 9);
  }
  const [near, n] = canvas(LAYER_W, LAYER_H, 0.5);
  ridge(n, HORIZON + 210, 80, 140, 37, '#050208', 1);
  return { sky, far, mid, near, ambient: 'souls' };
}

function windRift(): BgLayers {
  const [sky, s] = canvas(LAYER_W, VIEW_H, 0.5);
  s.fillStyle = vg(s, 0, VIEW_H, [[0, '#4d577c'], [0.42, '#b095ad'], [0.73, '#e3ba9c'], [1, '#77829b']]);
  s.fillRect(0, 0, LAYER_W, VIEW_H);
  const [far, f] = canvas(LAYER_W, LAYER_H, 0.5);
  ridge(f, 490, 160, 220, 227, '#8d849b');
  const [mid, m] = canvas(LAYER_W, LAYER_H, 0.5);
  ridge(m, 610, 125, 290, 228, '#6b7591');
  const [near, n] = canvas(LAYER_W, LAYER_H, 0.5);
  mist(n, 650, 180, 'rgba(196,189,208,0.32)');
  return { sky, far, mid, near, ambient: 'clouds' };
}

function meadow(): BgLayers {
  const [sky, s] = canvas(LAYER_W, VIEW_H, .5);
  s.fillStyle = vg(s, 0, VIEW_H, [[0,'#8eb7d7'],[.65,'#dfe5bf'],[1,'#ccbd83']]);
  s.fillRect(0,0,LAYER_W,VIEW_H);
  const [far, f] = canvas(LAYER_W,LAYER_H,.5);
  ridge(f, 544, 100, 320, 63, '#a6beb4', 0);
  const [mid, m] = canvas(LAYER_W,LAYER_H,.5);
  ridge(m, 614, 96, 280, 64, '#9caa7f', 0);
  const [near, n] = canvas(LAYER_W,LAYER_H,.5);
  ridge(n, 718, 110, 220, 65, '#a9aa69', 0);
  return {sky,far,mid,near,ambient:'clouds'};
}

const BUILDERS: Record<string, () => BgLayers> = {
  baekdu, sanseong, forest, cloud: cloudPalace, underworld, bridge: sanseong, quarry: sanseong, windrift: windRift, meadow,
};

const cache = new Map<string, BgLayers>();

export function backgroundFor(mapId: string): BgLayers {
  let b = cache.get(mapId);
  if (!b) {
    b = (BUILDERS[mapId] ?? sanseong)();
    cache.set(mapId, b);
  }
  return b;
}
