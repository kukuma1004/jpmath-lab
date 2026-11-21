import type Phaser from 'phaser';
import { CHARACTERS } from '../data/characters';
import { makeBodyCanvas, makeWeaponCanvas, type Mood } from './characters';

export const TEX = 2.5; // 캐릭터 텍스처 배율(화면에서는 1/TEX로 줄여 그린다)

type C = CanvasRenderingContext2D;

function make(scene: Phaser.Scene, key: string, w: number, h: number, draw: (ctx: C) => void): void {
  if (scene.textures.exists(key)) return;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  scene.textures.addCanvas(key, c);
}

function radial(ctx: C, x: number, y: number, r: number, stops: [number, string][]) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  for (const [o, c] of stops) g.addColorStop(o, c);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

export function makeTextures(scene: Phaser.Scene): void {
  // 캐릭터
  for (const c of CHARACTERS) {
    for (const mood of ['normal', 'hurt', 'happy'] as Mood[]) {
      const key = `char_${c.id}_${mood}`;
      if (!scene.textures.exists(key)) scene.textures.addCanvas(key, makeBodyCanvas(c.id, mood, TEX));
    }
    if (!scene.textures.exists(`wpn_${c.id}`)) scene.textures.addCanvas(`wpn_${c.id}`, makeWeaponCanvas(c.id, TEX));
  }

  // 입자
  make(scene, 'glow', 64, 64, (ctx) => radial(ctx, 32, 32, 32, [[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,0.55)'], [1, 'rgba(255,255,255,0)']]));
  make(scene, 'dot', 12, 12, (ctx) => radial(ctx, 6, 6, 6, [[0, 'rgba(255,255,255,1)'], [0.6, 'rgba(255,255,255,0.9)'], [1, 'rgba(255,255,255,0)']]));
  make(scene, 'spark', 32, 8, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 32, 0);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.7, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0.2)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(16, 4, 16, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  make(scene, 'smoke', 64, 64, (ctx) => {
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      radial(ctx, 32 + Math.cos(a) * 9, 32 + Math.sin(a) * 9, 20, [[0, 'rgba(255,255,255,0.55)'], [1, 'rgba(255,255,255,0)']]);
    }
    radial(ctx, 32, 32, 24, [[0, 'rgba(255,255,255,0.7)'], [1, 'rgba(255,255,255,0)']]);
  });
  make(scene, 'shard', 10, 10, (ctx) => {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(1, 3); ctx.lineTo(6, 0); ctx.lineTo(10, 4); ctx.lineTo(7, 10); ctx.lineTo(2, 8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.moveTo(6, 5); ctx.lineTo(10, 4); ctx.lineTo(7, 10); ctx.closePath(); ctx.fill();
  });
  make(scene, 'ring', 128, 128, (ctx) => {
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(64, 64, 58, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.arc(64, 64, 52, 0, Math.PI * 2); ctx.stroke();
  });
  make(scene, 'star', 24, 24, (ctx) => {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 ? 3 : 12;
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      ctx.lineTo(12 + Math.cos(a) * r, 12 + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  });
  make(scene, 'leaf', 16, 12, (ctx) => {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(1, 6); ctx.quadraticCurveTo(8, -2, 15, 6); ctx.quadraticCurveTo(8, 14, 1, 6);
    ctx.fill();
  });
  make(scene, 'puff', 160, 100, (ctx) => {
    for (const [x, y, r] of [[50, 60, 34], [80, 46, 40], [112, 60, 32], [80, 66, 34], [30, 68, 22], [134, 70, 20]] as [number, number, number][]) {
      radial(ctx, x, y, r, [[0, 'rgba(255,255,255,0.95)'], [0.7, 'rgba(255,255,255,0.6)'], [1, 'rgba(255,255,255,0)']]);
    }
  });
  make(scene, 'arrowhead', 24, 18, (ctx) => {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(2, 2); ctx.lineTo(22, 2); ctx.lineTo(12, 16); ctx.closePath();
    ctx.fill(); ctx.stroke();
  });
  // 낙석
  make(scene, 'boulder', 40, 40, (ctx) => {
    ctx.beginPath();
    const pts = 11;
    for (let i = 0; i < pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const r = 17 + Math.sin(i * 2.3) * 2.5;
      ctx.lineTo(20 + Math.cos(a) * r, 20 + Math.sin(a) * r);
    }
    ctx.closePath();
    const g = ctx.createRadialGradient(14, 12, 2, 20, 20, 20);
    g.addColorStop(0, '#b8b0a8');
    g.addColorStop(1, '#4a4440');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = '#1e1a18';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = 'rgba(30,26,24,0.6)';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(12, 22); ctx.lineTo(19, 18); ctx.lineTo(25, 26); ctx.stroke();
  });

  // 포탄
  make(scene, 'proj_ball', 24, 24, (ctx) => {
    // radial은 네모를 칠하므로 둥글게 잘라 둔다(안 그러면 돌 때 네모가 보인다)
    ctx.beginPath(); ctx.arc(12, 12, 11, 0, Math.PI * 2); ctx.clip();
    radial(ctx, 12, 12, 11, [[0, '#7a6a60'], [0.6, '#3a3330'], [1, '#120e0c']]);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.arc(8, 8, 3, 0, Math.PI * 2); ctx.fill();
  });
  make(scene, 'proj_megabomb', 36, 36, (ctx) => {
    ctx.beginPath(); ctx.arc(18, 20, 14, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(13, 14, 2, 18, 20, 15);
    g.addColorStop(0, '#6a5e58'); g.addColorStop(1, '#141010');
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#c8a040'; ctx.fillRect(14, 3, 8, 5);
    ctx.strokeStyle = 'rgba(232,182,74,0.8)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(18, 20, 9, 0.3, 2.2); ctx.stroke();
  });
  make(scene, 'proj_arrow', 44, 10, (ctx) => {
    ctx.strokeStyle = '#6a4424'; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(6, 5); ctx.lineTo(36, 5); ctx.stroke();
    ctx.fillStyle = '#e8eef6';
    ctx.beginPath(); ctx.moveTo(44, 5); ctx.lineTo(34, 0.5); ctx.lineTo(34, 9.5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f4ead0';
    ctx.beginPath(); ctx.moveTo(10, 5); ctx.lineTo(2, 0); ctx.lineTo(5, 5); ctx.lineTo(2, 10); ctx.closePath(); ctx.fill();
  });
  make(scene, 'proj_bomb', 28, 28, (ctx) => {
    ctx.beginPath(); ctx.arc(14, 15, 11, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(10, 10, 1, 14, 15, 12);
    g.addColorStop(0, '#7a5aa8'); g.addColorStop(1, '#2a1a40');
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = '#120a1c'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#9cff6b';
    ctx.beginPath(); ctx.arc(10.5, 14, 2, 0, Math.PI * 2); ctx.arc(17.5, 14, 2, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#9cff6b'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(14, 17, 4, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = '#d0a050'; ctx.fillRect(12, 2, 4, 4);
  });
  make(scene, 'proj_goblinfire', 28, 28, (ctx) => {
    radial(ctx, 14, 14, 14, [[0, 'rgba(240,255,240,1)'], [0.35, 'rgba(110,255,158,0.95)'], [1, 'rgba(46,230,166,0)']]);
  });
  make(scene, 'proj_paper', 16, 22, (ctx) => {
    ctx.fillStyle = '#f7d354'; ctx.fillRect(1, 1, 14, 20);
    ctx.strokeStyle = '#a07a1a'; ctx.lineWidth = 1; ctx.strokeRect(1, 1, 14, 20);
    ctx.strokeStyle = '#c8323c'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(8, 3); ctx.lineTo(8, 19); ctx.moveTo(4, 7); ctx.lineTo(12, 7); ctx.moveTo(4, 12); ctx.lineTo(12, 15); ctx.moveTo(12, 11); ctx.lineTo(4, 16); ctx.stroke();
  });
  make(scene, 'proj_iron', 28, 14, (ctx) => {
    ctx.beginPath(); ctx.moveTo(2, 2); ctx.lineTo(18, 2); ctx.quadraticCurveTo(27, 7, 18, 12); ctx.lineTo(2, 12); ctx.closePath();
    const g = ctx.createLinearGradient(0, 2, 0, 12);
    g.addColorStop(0, '#b8c0c8'); g.addColorStop(1, '#3a4048');
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = '#1a1e22'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = '#c89040'; ctx.fillRect(5, 2, 2, 10);
  });
  make(scene, 'proj_fox', 28, 28, (ctx) => {
    radial(ctx, 14, 14, 14, [[0, 'rgba(240,250,255,1)'], [0.35, 'rgba(127,216,255,0.95)'], [1, 'rgba(79,140,255,0)']]);
  });
}
