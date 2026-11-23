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
  make(scene, 'blast_cloud', 68, 68, (ctx) => {
    const lobes: [number, number, number][] = [[34, 43, 21], [47, 36, 15], [19, 33, 15], [34, 24, 18], [31, 38, 14]];
    for (const [x, y, r] of lobes) {
      const shade = ctx.createRadialGradient(x - r * .4, y - r * .5, 1, x, y, r);
      shade.addColorStop(0, '#fff8e7');
      shade.addColorStop(.66, '#c0aea1');
      shade.addColorStop(.9, '#968783');
      shade.addColorStop(1, 'rgba(122,112,110,0)');
      ctx.fillStyle = shade;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  });
  make(scene, 'shock_crescent', 180, 180, (ctx) => {
    ctx.shadowColor = '#ff8b28';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#fff5cb';
    ctx.beginPath();
    ctx.moveTo(104, 5);
    ctx.bezierCurveTo(25, 28, 18, 101, 63, 142);
    ctx.bezierCurveTo(27, 92, 40, 35, 104, 5);
    ctx.fill();
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
  // Tapered strokes point toward the leading edge; the render view follows velocity.
  make(scene, 'ember_wake', 112, 30, (ctx) => {
    const fade = ctx.createLinearGradient(0,0,112,0);
    fade.addColorStop(0,'rgba(255,255,255,0)'); fade.addColorStop(0.48,'rgba(255,255,255,.52)');
    fade.addColorStop(1,'white'); ctx.fillStyle=fade;
    for (let j=0;j<7;j++) {
      const a = 4+j*3.4, tip = (j*19)%41;
      ctx.beginPath();ctx.moveTo(111,15);
      ctx.quadraticCurveTo(68,a-3,tip,a+(j%2?3:-3));
      ctx.quadraticCurveTo(63,a+2,100,18);ctx.fill();
    }
  });
  make(scene, 'cannon_wake', 128, 32, (ctx) => {
    const flame = ctx.createLinearGradient(0,0,128,0);
    flame.addColorStop(0,'rgba(222,69,22,0)');
    flame.addColorStop(.35,'rgba(248,79,14,.67)');
    flame.addColorStop(.73,'#ff9a25');
    flame.addColorStop(1,'#fff7b2');
    ctx.fillStyle = flame;
    for (let j=0; j<8; j++) {
      const start = (j*17)%49, y = 3+j*3.7;
      ctx.beginPath();ctx.moveTo(126,16);
      ctx.quadraticCurveTo(72,y-2,start,y+(j%2?3:-3));
      ctx.quadraticCurveTo(72,y+4,115,19);ctx.fill();
    }
    ctx.fillStyle='#ffe798';
    ctx.beginPath();ctx.moveTo(79,13);ctx.lineTo(123,14);ctx.lineTo(125,19);ctx.fill();
    for (let j=0; j<12; j++) {
      const x=(j*23)%78, y=(j*13)%31;
      ctx.fillStyle=j%3?'#ee752d':'#ffc76a';
      ctx.fillRect(x,y,1+j%4,1);
    }
  });
  make(scene, 'impact_streaks', 320, 320, (ctx) => {
    // Detached, curved tips leave open space between the impact and the ejecta.
    for (let i = 0; i < 9; i++) {
      const side = i % 2 ? 1 : -1;
      const dx = side * (35 + (i * 37) % 115), dy = -(20 + (i * 53) % 111);
      const x = 160 + dx, y = 160 + dy;
      const tailX = x - dx * .39, tailY = y - dy * .37 + 3;
      const trail = ctx.createLinearGradient(tailX, tailY, x, y);
      trail.addColorStop(0, 'rgba(255,119,32,0)');
      trail.addColorStop(.72, '#ff8e31');
      trail.addColorStop(1, '#fff7be');
      ctx.fillStyle = trail;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.quadraticCurveTo(x - dx * .14, y - 6, x + side * 3, y);
      ctx.quadraticCurveTo(x - dx * .12, y - 2, tailX, tailY);
      ctx.fill();
    }
  });
  make(scene, 'blast_fan', 240, 240, (ctx) => {
    const light=ctx.createRadialGradient(120,120,0,120,120,115);
    light.addColorStop(0,'white');light.addColorStop(0.24,'rgba(255,255,255,.95)');
    light.addColorStop(0.67,'rgba(255,255,255,.6)');light.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=light;
    for(let j=0;j<22;j++) {
      const a=Math.PI*(1.05+0.9*((j*13)%23)/22), length=38+(j*37)%79;
      const dx=Math.cos(a),dy=Math.sin(a),width=1+(j*7)%5;
      ctx.beginPath();ctx.moveTo(120-dy*width,120+dx*width);
      ctx.lineTo(120+dx*length,120+dy*length);
      ctx.lineTo(120+dy*width,120-dx*width);ctx.fill();
    }
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
  make(scene, 'proj_drill', 42, 20, (ctx) => {
    const metal=ctx.createLinearGradient(0,1,0,19);metal.addColorStop(0,'#e7f6f7');metal.addColorStop(0.45,'#91adb6');metal.addColorStop(1,'#304652');
    ctx.fillStyle=metal;ctx.strokeStyle='#172c39';ctx.lineWidth=1.6;
    ctx.beginPath();ctx.moveTo(9,1);ctx.lineTo(41,10);ctx.lineTo(9,19);ctx.closePath();ctx.fill();ctx.stroke();
    for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(10+i*5,2+i*1.4);ctx.lineTo(15+i*5,17-i*1.4);ctx.stroke();}
    ctx.fillStyle='#cc9b48';ctx.fillRect(3,4,8,12);ctx.fillStyle='#415767';ctx.fillRect(0,6,4,8);
  });
  make(scene, 'proj_ball', 24, 24, (ctx) => {
    // radial은 네모를 칠하므로 둥글게 잘라 둔다(안 그러면 돌 때 네모가 보인다)
    ctx.beginPath(); ctx.arc(12, 12, 11, 0, Math.PI * 2); ctx.clip();
    radial(ctx, 12, 12, 11, [[0, '#523127'], [0.53, '#73331b'], [0.77, '#de6424'], [0.9, '#ffce64'], [1, '#ffed99']]);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath(); ctx.arc(8, 8, 3, 0, Math.PI * 2); ctx.fill();
  });
  make(scene, 'proj_megabomb', 36, 36, (ctx) => {
    ctx.beginPath(); ctx.arc(18, 20, 14, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(13, 14, 2, 18, 20, 15);
    g.addColorStop(0, '#ffba88'); g.addColorStop(0.36, '#bd3830'); g.addColorStop(1, '#4b1722');
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
  make(scene, 'proj_rocket', 36, 14, (ctx) => {
    ctx.beginPath();ctx.moveTo(5,3);ctx.lineTo(26,3);ctx.lineTo(35,7);ctx.lineTo(26,11);ctx.lineTo(5,11);ctx.closePath();
    const g=ctx.createLinearGradient(0,3,0,11);g.addColorStop(0,'#f5d58b');g.addColorStop(0.5,'#c96e37');g.addColorStop(1,'#5d3332');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#362126';ctx.lineWidth=1.2;ctx.stroke();
    ctx.fillStyle='#a43831';ctx.beginPath();ctx.moveTo(9,7);ctx.lineTo(0,0);ctx.lineTo(2,7);ctx.lineTo(0,14);ctx.closePath();ctx.fill();
    ctx.fillStyle='#fff1b2';ctx.fillRect(22,4,3,5);
  });
  make(scene, 'proj_poison', 28, 28, (ctx) => {
    ctx.beginPath();ctx.moveTo(9,3);ctx.lineTo(19,3);ctx.lineTo(18,8);ctx.bezierCurveTo(30,14,26,25,14,26);ctx.bezierCurveTo(2,25,-2,14,10,8);ctx.closePath();
    const g=ctx.createRadialGradient(10,11,1,14,17,15);g.addColorStop(0,'#dbef97');g.addColorStop(0.5,'#84ab4a');g.addColorStop(1,'#304f3d');ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#253629';ctx.lineWidth=1.6;ctx.stroke();
    ctx.fillStyle='#8a5c3c';ctx.fillRect(9,1,10,4);ctx.fillStyle='#e1c78e';ctx.fillRect(7,10,14,3);
    ctx.fillStyle='#f0f2bf';ctx.beginPath();ctx.ellipse(9,17,2,4,-0.4,0,Math.PI*2);ctx.fill();
  });
}
