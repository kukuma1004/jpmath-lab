/**
 * 캐릭터 그림(코드로 그린 임시 그림). 나중에 그림 파일로 바꿀 때는
 * BootScene이 만드는 텍스처 이름(char_<id>_<mood>, wpn_<id>)만 맞추면 된다.
 * 좌표: 발끝 가운데가 (0,0), 위가 음수. 오른쪽을 본다.
 */
export type Mood = 'normal' | 'hurt' | 'happy';

export const BODY_BOX = { w: 76, h: 76, footX: 38, footY: 70 };
export const WEAPON_BOX = { w: 56, h: 28, pivotX: 12, pivotY: 14 };

/** 무기 회전 중심(발 기준) */
export const PIVOT: Record<string, { x: number; y: number }> = {
  general: { x: 2, y: -27 },
  archer: { x: 5, y: -25 },
  dokkaebi: { x: 5, y: -21 },
  mudang: { x: 6, y: -24 },
  turtle: { x: 2, y: -31 },
  gumiho: { x: 6, y: -24 },
};

type C = CanvasRenderingContext2D;

const INK = '#1c1418';

function outline(ctx: C, w = 1.6, color = INK) {
  ctx.lineWidth = w;
  ctx.strokeStyle = color;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}

function fillStroke(ctx: C, fill: string | CanvasGradient, w = 1.6) {
  ctx.fillStyle = fill;
  ctx.fill();
  outline(ctx, w);
  ctx.stroke();
}

function vgrad(ctx: C, y0: number, y1: number, a: string, b: string): CanvasGradient {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  return g;
}

function rgrad(ctx: C, x: number, y: number, r: number, a: string, b: string): CanvasGradient {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, a);
  g.addColorStop(1, b);
  return g;
}

function shade(hex: string, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  if (k >= 0) { r += (255 - r) * k; g += (255 - g) * k; b += (255 - b) * k; }
  else { r *= 1 + k; g *= 1 + k; b *= 1 + k; }
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

function ellipse(ctx: C, x: number, y: number, rx: number, ry: number, rot = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
}

function rr(ctx: C, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** 눈. 오른쪽을 보는 얼굴 */
function eye(ctx: C, x: number, y: number, mood: Mood, s = 1, iris = INK) {
  ctx.save();
  if (mood === 'hurt') {
    outline(ctx, 1.4 * s);
    ctx.beginPath();
    ctx.moveTo(x - 2 * s, y - 2 * s); ctx.lineTo(x + 1.5 * s, y); ctx.lineTo(x - 2 * s, y + 2 * s);
    ctx.stroke();
  } else if (mood === 'happy') {
    outline(ctx, 1.4 * s);
    ctx.beginPath();
    ctx.arc(x, y + 0.8 * s, 2.2 * s, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  } else {
    ellipse(ctx, x, y, 2.1 * s, 2.5 * s);
    ctx.fillStyle = '#fff';
    ctx.fill();
    outline(ctx, 0.9 * s);
    ctx.stroke();
    ellipse(ctx, x + 0.7 * s, y + 0.2 * s, 1.25 * s, 1.7 * s);
    ctx.fillStyle = iris;
    ctx.fill();
    ellipse(ctx, x + 1.1 * s, y - 0.6 * s, 0.45 * s, 0.45 * s);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
  ctx.restore();
}

function mouth(ctx: C, x: number, y: number, mood: Mood, w = 3) {
  outline(ctx, 1.1);
  ctx.beginPath();
  if (mood === 'hurt') {
    ellipse(ctx, x, y, w * 0.45, w * 0.55);
    ctx.fillStyle = '#5a1a1a';
    ctx.fill();
    ctx.stroke();
    return;
  }
  if (mood === 'happy') {
    ctx.moveTo(x - w, y - 0.5);
    ctx.quadraticCurveTo(x, y + w * 0.9, x + w, y - 0.5);
    ctx.closePath();
    ctx.fillStyle = '#7a2424';
    ctx.fill();
    ctx.stroke();
    return;
  }
  ctx.moveTo(x - w * 0.7, y);
  ctx.quadraticCurveTo(x, y + w * 0.35, x + w * 0.7, y - 0.3);
  ctx.stroke();
}

function blush(ctx: C, x: number, y: number) {
  ellipse(ctx, x, y, 2.2, 1.3);
  ctx.fillStyle = 'rgba(240,110,110,0.45)';
  ctx.fill();
}

function legs(ctx: C, pants: string, shoe: string, spread = 5, h = 8) {
  for (const sx of [-spread, spread - 4]) {
    rr(ctx, sx - 0.5, -h, 5, h - 2, 2);
    fillStroke(ctx, pants, 1.3);
    rr(ctx, sx - 1.2, -3.2, 6.6, 3.4, 1.6);
    fillStroke(ctx, shoe, 1.3);
  }
}

// ───────── 화포장군 ─────────
function general(ctx: C, mood: Mood) {
  const P = { red: '#b8322a', blue: '#2b3a67', gold: '#e8b64a', skin: '#e9b98f', dark: '#3a1712' };
  // 상모(붉은 술)
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.bezierCurveTo(-6, -58, -16, -56, -19, -47);
  ctx.bezierCurveTo(-14, -50, -8, -49, -2, -46);
  fillStroke(ctx, vgrad(ctx, -58, -46, '#ff5a4a', '#a01e18'), 1.3);
  legs(ctx, '#3a2a30', '#2a1d18', 6, 9);
  // 갑옷 몸통
  ctx.beginPath();
  ctx.moveTo(-10, -25);
  ctx.quadraticCurveTo(0, -28, 10, -25);
  ctx.lineTo(13, -7);
  ctx.quadraticCurveTo(0, -4, -13, -7);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -27, -5, shade(P.red, 0.15), shade(P.red, -0.25)));
  // 두정(금 단추)
  ctx.fillStyle = P.gold;
  for (let r = 0; r < 3; r++) for (let c = -2; c <= 2; c++) {
    if (c === 0) continue;
    ellipse(ctx, c * 4 + (r % 2) * 0.6, -21 + r * 5, 0.9, 0.9);
    ctx.fill();
  }
  // 가운데 띠와 밑단
  rr(ctx, -1.6, -26, 3.2, 20, 1);
  fillStroke(ctx, P.blue, 1);
  ctx.beginPath();
  ctx.moveTo(-13, -7);
  ctx.quadraticCurveTo(0, -4, 13, -7);
  ctx.lineTo(13.4, -5);
  ctx.quadraticCurveTo(0, -2, -13.4, -5);
  ctx.closePath();
  fillStroke(ctx, P.blue, 1);
  // 허리띠
  rr(ctx, -12, -15.5, 24, 3.6, 1.5);
  fillStroke(ctx, '#2a1810', 1.1);
  rr(ctx, -2.2, -16.2, 4.4, 5, 1);
  fillStroke(ctx, P.gold, 1);
  // 어깨 갑
  ellipse(ctx, -9, -24, 5, 3.6, -0.3);
  fillStroke(ctx, shade(P.red, -0.1), 1.3);
  // 얼굴
  ellipse(ctx, 1, -34, 9.2, 9);
  fillStroke(ctx, rgrad(ctx, 1, -34, 9, shade(P.skin, 0.15), shade(P.skin, -0.1)));
  // 흰 수염
  ctx.beginPath();
  ctx.moveTo(-4, -31);
  ctx.quadraticCurveTo(2, -29, 9, -31);
  ctx.quadraticCurveTo(8, -24, 3, -19);
  ctx.quadraticCurveTo(-1, -24, -4, -31);
  fillStroke(ctx, vgrad(ctx, -31, -19, '#ffffff', '#cfcfd6'), 1.2);
  // 콧수염
  ctx.beginPath();
  ctx.moveTo(1, -31.5);
  ctx.quadraticCurveTo(5, -33, 10, -30);
  ctx.quadraticCurveTo(5, -31, 1, -30);
  fillStroke(ctx, '#f4f4f6', 1);
  eye(ctx, 5, -36, mood, 1);
  // 짙은 흰 눈썹
  outline(ctx, 2, '#f2f2f2');
  ctx.beginPath();
  ctx.moveTo(1.5, -40.5); ctx.lineTo(8, -39);
  ctx.stroke();
  outline(ctx, 0.8);
  ctx.stroke();
  if (mood !== 'normal') mouth(ctx, 6, -29.5, mood, 2.6);
  // 투구
  ctx.beginPath();
  ctx.moveTo(-9.5, -36);
  ctx.quadraticCurveTo(-9, -48, 1, -48);
  ctx.quadraticCurveTo(11, -48, 11, -37);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -48, -36, '#5a2a22', P.dark));
  rr(ctx, -10.5, -38.5, 22.5, 3.4, 1.5);
  fillStroke(ctx, vgrad(ctx, -38.5, -35, '#ffe08a', '#b88328'), 1.1);
  // 볼가리개
  ctx.beginPath();
  ctx.moveTo(-10, -36); ctx.lineTo(-11.5, -27); ctx.lineTo(-6, -27); ctx.lineTo(-5.5, -36);
  ctx.closePath();
  fillStroke(ctx, P.blue, 1.2);
  // 꼭대기 장식
  ctx.beginPath();
  ctx.moveTo(-1.6, -48); ctx.lineTo(0.5, -53); ctx.lineTo(2.6, -48);
  ctx.closePath();
  fillStroke(ctx, P.gold, 1.1);
}

function generalWeapon(ctx: C) {
  // 총통(청동 포신)
  rr(ctx, -6, -3.6, 33, 7.2, 3);
  fillStroke(ctx, vgrad(ctx, -3.6, 3.6, '#f0c070', '#7a4a1a'));
  ctx.fillStyle = 'rgba(60,30,10,0.55)';
  for (const x of [5, 14, 22]) { ctx.fillRect(x, -3.6, 2, 7.2); }
  rr(ctx, 26, -4.8, 5, 9.6, 2);
  fillStroke(ctx, vgrad(ctx, -4.8, 4.8, '#ffd890', '#8a5a22'), 1.3);
  // 손(붉은 소매)
  ellipse(ctx, 1, 2.5, 4.5, 4);
  fillStroke(ctx, '#b8322a', 1.3);
  ellipse(ctx, 3.5, 2, 2.8, 2.6);
  fillStroke(ctx, '#e9b98f', 1.1);
}

// ───────── 신궁 ─────────
function archer(ctx: C, mood: Mood) {
  const P = { white: '#f2efe6', blue: '#3f7cac', skin: '#efc49c' };
  legs(ctx, '#e6e1d4', '#2a2a30', 5, 8);
  // 도포
  ctx.beginPath();
  ctx.moveTo(-8, -25);
  ctx.quadraticCurveTo(0, -27, 8, -25);
  ctx.lineTo(11, -5);
  ctx.quadraticCurveTo(0, -3, -12, -5);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -27, -4, '#ffffff', '#d6d2c6'));
  // 쾌자(푸른 조끼)
  ctx.beginPath();
  ctx.moveTo(-8, -24);
  ctx.lineTo(-10, -8);
  ctx.lineTo(-3, -9);
  ctx.lineTo(1, -24);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -24, -8, shade(P.blue, 0.1), shade(P.blue, -0.3)), 1.2);
  // 세조대(붉은 띠)
  rr(ctx, -10, -15.5, 20, 3, 1.5);
  fillStroke(ctx, '#b33a3a', 1.1);
  ctx.beginPath();
  ctx.moveTo(-6, -13); ctx.lineTo(-8, -6); ctx.lineTo(-5, -6.5); ctx.lineTo(-4, -13);
  fillStroke(ctx, '#b33a3a', 1);
  // 얼굴
  ellipse(ctx, 1, -33, 8.6, 8.8);
  fillStroke(ctx, rgrad(ctx, 1, -33, 9, shade(P.skin, 0.15), shade(P.skin, -0.08)));
  // 머리카락(옆)
  ctx.beginPath();
  ctx.moveTo(-7.6, -36);
  ctx.quadraticCurveTo(-8, -28, -5, -27);
  ctx.quadraticCurveTo(-3, -32, -3, -38);
  ctx.closePath();
  fillStroke(ctx, '#1a1a20', 1);
  eye(ctx, 4.8, -34.5, mood, 1);
  outline(ctx, 1.2);
  ctx.beginPath(); ctx.moveTo(2.4, -38.5); ctx.lineTo(7.4, -38); ctx.stroke();
  mouth(ctx, 5.5, -28.6, mood, 2.2);
  if (mood === 'happy') blush(ctx, 3, -30.5);
  // 갓끈(구슬)
  ctx.fillStyle = '#c8a46a';
  for (let i = 0; i < 6; i++) { ellipse(ctx, -5.5 + i * 0.9, -38 + i * 2.2, 0.8, 0.8); ctx.fill(); }
  // 갓: 양태(넓은 챙)
  ellipse(ctx, 0.5, -40.5, 16, 3.4);
  ctx.fillStyle = 'rgba(22,22,28,0.78)';
  ctx.fill();
  outline(ctx, 1.3);
  ctx.stroke();
  // 대우(모자 몸)
  ctx.beginPath();
  ctx.moveTo(-5.5, -41);
  ctx.lineTo(-4.8, -51);
  ctx.quadraticCurveTo(0.5, -53, 5.8, -51);
  ctx.lineTo(6.5, -41);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -53, -41, '#3a3a44', '#101016'), 1.3);
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(-3, -49); ctx.lineTo(-3, -42); ctx.stroke();
}

function archerWeapon(ctx: C) {
  // 화살
  outline(ctx, 1.3, '#5a3a20');
  ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(28, 0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(32, 0); ctx.lineTo(26, -3); ctx.lineTo(26, 3); ctx.closePath();
  fillStroke(ctx, '#d8dde6', 1);
  ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-12, -3.5); ctx.lineTo(-5, 0); ctx.lineTo(-12, 3.5); ctx.closePath();
  fillStroke(ctx, '#e8e0c8', 0.9);
  // 각궁
  ctx.beginPath();
  ctx.moveTo(3, -16);
  ctx.bezierCurveTo(7, -17, 13, -9, 12, 0);
  ctx.bezierCurveTo(13, 9, 7, 17, 3, 16);
  ctx.bezierCurveTo(6, 13, 9, 7, 9, 0);
  ctx.bezierCurveTo(9, -7, 6, -13, 3, -16);
  fillStroke(ctx, vgrad(ctx, -16, 16, '#7a3a20', '#3a1a10'), 1.3);
  outline(ctx, 0.8, '#e6e0d0');
  ctx.beginPath(); ctx.moveTo(3, -16); ctx.lineTo(-6, 0); ctx.lineTo(3, 16); ctx.stroke();
  // 손
  ellipse(ctx, 10.5, 0, 3, 3);
  fillStroke(ctx, '#efc49c', 1.1);
}

// ───────── 도깨비 ─────────
function dokkaebi(ctx: C, mood: Mood) {
  const P = { vest: '#4a6b3a', pants: '#c46a2b', skin: '#6fa3c9', hair: '#1f2d3d' };
  legs(ctx, P.pants, '#3a2418', 6, 9);
  // 배
  ellipse(ctx, 0, -14, 12.5, 10);
  fillStroke(ctx, rgrad(ctx, 0, -14, 12, shade(P.skin, 0.2), shade(P.skin, -0.2)));
  // 잠방이 띠·조끼
  ctx.beginPath();
  ctx.moveTo(-12, -14); ctx.quadraticCurveTo(-13, -24, -6, -25); ctx.lineTo(-4, -8); ctx.quadraticCurveTo(-10, -8, -12, -14);
  fillStroke(ctx, P.vest, 1.3);
  ctx.beginPath();
  ctx.moveTo(12, -14); ctx.quadraticCurveTo(12.5, -23, 7, -25); ctx.lineTo(6, -9); ctx.quadraticCurveTo(10, -9, 12, -14);
  fillStroke(ctx, P.vest, 1.3);
  rr(ctx, -12, -8.5, 24, 3, 1.2);
  fillStroke(ctx, P.pants, 1.1);
  // 배꼽
  ellipse(ctx, 0.5, -12, 0.9, 0.7);
  ctx.fillStyle = INK;
  ctx.fill();
  // 머리
  ellipse(ctx, 1, -33, 11.5, 10.5);
  fillStroke(ctx, rgrad(ctx, 1, -33, 11, shade(P.skin, 0.22), shade(P.skin, -0.12)));
  // 덥수룩한 머리털(뿔 없음)
  ctx.beginPath();
  ctx.moveTo(-10, -32);
  const spikes: [number, number][] = [[-13, -40], [-8, -41], [-9, -48], [-3, -44], [-1, -51], [3, -45], [7, -50], [8, -43], [13, -45], [11, -38]];
  for (const [x, y] of spikes) ctx.lineTo(x, y);
  ctx.quadraticCurveTo(4, -41, -2, -40);
  ctx.quadraticCurveTo(-7, -38, -10, -32);
  fillStroke(ctx, vgrad(ctx, -51, -32, '#3b4f6b', P.hair), 1.3);
  // 눈썹·코·입
  outline(ctx, 2.2, P.hair);
  ctx.beginPath(); ctx.moveTo(0, -38); ctx.lineTo(5, -37); ctx.moveTo(7, -37); ctx.lineTo(11.5, -38.5); ctx.stroke();
  eye(ctx, 3.6, -34, mood, 1.25);
  eye(ctx, 9, -34.4, mood, 1.15);
  ellipse(ctx, 9.5, -30, 2.8, 2.2);
  fillStroke(ctx, shade(P.skin, -0.05), 1.1);
  if (mood === 'hurt') mouth(ctx, 5, -25.5, mood, 3);
  else {
    ctx.beginPath();
    ctx.moveTo(-1, -27.5);
    ctx.quadraticCurveTo(5, mood === 'happy' ? -21 : -23, 11, -27.5);
    ctx.quadraticCurveTo(5, -25.5, -1, -27.5);
    fillStroke(ctx, '#7a2424', 1.1);
    // 송곳니(위로)
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(1, -27); ctx.lineTo(2, -29.5); ctx.lineTo(3, -26.6); ctx.fill();
    ctx.beginPath(); ctx.moveTo(8, -26.8); ctx.lineTo(9, -29.4); ctx.lineTo(10, -27.2); ctx.fill();
  }
  blush(ctx, -3, -29);
}

function dokkaebiWeapon(ctx: C) {
  // 도깨비 방망이
  ctx.beginPath();
  ctx.moveTo(-4, -2.4);
  ctx.lineTo(16, -4.5);
  ctx.quadraticCurveTo(30, -7, 31, 0);
  ctx.quadraticCurveTo(30, 7, 16, 4.5);
  ctx.lineTo(-4, 2.4);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -7, 7, '#d49a5a', '#7a4a22'));
  ctx.fillStyle = '#f4d35e';
  for (const [x, y] of [[18, -3], [23, 2], [27, -2.5], [21, -0.5], [26, 3.5]] as [number, number][]) {
    ellipse(ctx, x, y, 1.3, 1.3);
    ctx.fill();
    outline(ctx, 0.6);
    ctx.stroke();
  }
  ellipse(ctx, 1, 0, 4.2, 3.8);
  fillStroke(ctx, '#6fa3c9', 1.2);
}

// ───────── 무당 ─────────
function mudang(ctx: C, mood: Mood) {
  const P = { red: '#c8323c', blue: '#2f5d9c', gold: '#f7d354', skin: '#f0c7a0' };
  // 치마
  ctx.beginPath();
  ctx.moveTo(-8, -16);
  ctx.lineTo(8, -16);
  ctx.quadraticCurveTo(12, -6, 13, -1);
  ctx.quadraticCurveTo(0, 1, -13, -1);
  ctx.quadraticCurveTo(-12, -6, -8, -16);
  fillStroke(ctx, vgrad(ctx, -16, 0, shade(P.blue, 0.1), shade(P.blue, -0.3)));
  // 홍철릭
  ctx.beginPath();
  ctx.moveTo(-8, -26);
  ctx.quadraticCurveTo(0, -28, 8, -26);
  ctx.lineTo(11, -8);
  ctx.quadraticCurveTo(0, -6, -11, -8);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -28, -6, shade(P.red, 0.15), shade(P.red, -0.25)));
  // 흰 동정
  ctx.beginPath(); ctx.moveTo(-4, -26); ctx.lineTo(1, -19); ctx.lineTo(5, -26);
  outline(ctx, 2.6, '#f6f2ea'); ctx.stroke();
  outline(ctx, 0.6); ctx.stroke();
  // 색동 소매(뒤쪽 팔)
  ctx.save();
  ctx.translate(-9, -22);
  ctx.rotate(0.4);
  const st = ['#c8323c', '#f7d354', '#3a9a5a', '#2f5d9c', '#f6f2ea'];
  st.forEach((c, i) => { rr(ctx, -3, i * 2.6, 6, 2.8, 0.8); ctx.fillStyle = c; ctx.fill(); });
  rr(ctx, -3, 0, 6, 13, 1.5);
  outline(ctx, 1.2); ctx.stroke();
  ctx.restore();
  // 띠
  rr(ctx, -10, -16.5, 20, 2.8, 1.2);
  fillStroke(ctx, P.gold, 1);
  // 얼굴
  ellipse(ctx, 1, -34, 8.4, 8.6);
  fillStroke(ctx, rgrad(ctx, 1, -34, 9, shade(P.skin, 0.15), shade(P.skin, -0.08)));
  ctx.beginPath();
  ctx.moveTo(-7.2, -37); ctx.quadraticCurveTo(-9, -26, -5.5, -22); ctx.quadraticCurveTo(-4, -30, -2, -38);
  fillStroke(ctx, '#141018', 1);
  eye(ctx, 4.6, -35, mood, 1);
  if (mood === 'normal') {
    // 붉은 눈화장
    ctx.strokeStyle = 'rgba(200,40,60,0.7)';
    ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(6.5, -37.5); ctx.lineTo(8.6, -36.5); ctx.stroke();
  }
  mouth(ctx, 5.4, -29.4, mood, 2);
  ellipse(ctx, 5.4, -29.2, 1.1, 0.6);
  ctx.fillStyle = '#c8323c';
  if (mood === 'normal') ctx.fill();
  // 전립(검은 벙거지) + 공작깃·붉은 술
  ellipse(ctx, 0.5, -41, 13, 3);
  fillStroke(ctx, '#18141c', 1.3);
  ctx.beginPath();
  ctx.moveTo(-6, -41.5); ctx.quadraticCurveTo(0.5, -51, 7, -41.5);
  fillStroke(ctx, vgrad(ctx, -50, -41, '#3a3044', '#141018'), 1.3);
  ctx.beginPath();
  ctx.moveTo(1, -48);
  ctx.bezierCurveTo(-4, -55, -9, -57, -12, -52);
  ctx.bezierCurveTo(-8, -53, -4, -51, 0, -47);
  fillStroke(ctx, vgrad(ctx, -57, -47, '#3ad0a0', '#1a5a7a'), 1);
  ellipse(ctx, -10.5, -53, 1.6, 1.6);
  ctx.fillStyle = '#f7d354'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(7, -42); ctx.quadraticCurveTo(10, -36, 9, -31);
  outline(ctx, 2, '#d0283a'); ctx.stroke();
}

function mudangWeapon(ctx: C) {
  // 부채(펼친 것)와 부적
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 24, -0.75, 0.75);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -18, 18, '#fff3d6', '#f0d9a0'), 1.3);
  ctx.save();
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 24, -0.75, 0.75); ctx.closePath(); ctx.clip();
  ellipse(ctx, 15, 0, 5, 5);
  ctx.fillStyle = '#c8323c'; ctx.fill();
  ctx.beginPath(); ctx.arc(15, 0, 5, -Math.PI / 2, Math.PI / 2); ctx.fillStyle = '#2f5d9c'; ctx.fill();
  ctx.strokeStyle = 'rgba(120,80,30,0.45)';
  ctx.lineWidth = 0.6;
  for (let a = -0.7; a <= 0.71; a += 0.175) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 24, Math.sin(a) * 24); ctx.stroke(); }
  ctx.restore();
  // 매달린 부적
  rr(ctx, 21, 9, 4, 9, 0.6);
  fillStroke(ctx, '#f7d354', 0.8);
  ctx.strokeStyle = '#c8323c'; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(22, 11); ctx.lineTo(24, 13); ctx.lineTo(22, 15); ctx.stroke();
  ellipse(ctx, 1, 0, 3.4, 3.2);
  fillStroke(ctx, '#f0c7a0', 1.1);
}

// ───────── 거북선 장수 ─────────
function turtle(ctx: C, mood: Mood) {
  const P = { wood: '#7a4a2a', navy: '#2c4f6e', gold: '#d9a441', skin: '#e3b48c' };
  // 선체
  ctx.beginPath();
  ctx.moveTo(-22, -15);
  ctx.lineTo(21, -15);
  ctx.quadraticCurveTo(20, -4, 13, -1);
  ctx.lineTo(-15, -1);
  ctx.quadraticCurveTo(-21, -5, -22, -15);
  fillStroke(ctx, vgrad(ctx, -15, -1, shade(P.wood, 0.15), shade(P.wood, -0.35)));
  // 판자 줄과 단청 띠
  ctx.strokeStyle = 'rgba(30,15,8,0.5)'; ctx.lineWidth = 0.7;
  for (const y of [-10, -6]) { ctx.beginPath(); ctx.moveTo(-20, y); ctx.lineTo(18, y); ctx.stroke(); }
  rr(ctx, -21, -16, 42, 3.2, 1);
  fillStroke(ctx, '#c8323c', 1);
  ctx.fillStyle = '#3a9a8a';
  for (let x = -19; x < 19; x += 6) { ctx.fillRect(x, -15.6, 3, 2.4); }
  // 노 구멍
  ctx.fillStyle = '#1a0e08';
  for (let x = -14; x < 14; x += 7) { ellipse(ctx, x, -8, 1.3, 1.3); ctx.fill(); }
  // 철 지붕(거북 등)
  ctx.beginPath();
  ctx.moveTo(-19, -15);
  ctx.quadraticCurveTo(-17, -31, 0, -31);
  ctx.quadraticCurveTo(16, -31, 18, -15);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -31, -15, '#6a7a82', '#2e383e'));
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 0.8;
  for (const [x, y] of [[-10, -22], [-1, -25], [8, -22], [-5, -18], [4, -18], [13, -18], [-14, -18]] as [number, number][]) {
    ctx.beginPath();
    for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; ctx.lineTo(x + Math.cos(a) * 3.2, y + Math.sin(a) * 2.6); }
    ctx.closePath(); ctx.stroke();
  }
  // 쇠못
  ctx.fillStyle = '#c9d0d4';
  for (const [x, y] of [[-12, -25], [-4, -28.5], [5, -28.5], [12, -25], [-16, -19], [16, -19]] as [number, number][]) {
    ctx.beginPath(); ctx.moveTo(x - 1.2, y + 1); ctx.lineTo(x, y - 2.4); ctx.lineTo(x + 1.2, y + 1); ctx.closePath(); ctx.fill();
    outline(ctx, 0.5); ctx.stroke();
  }
  // 용머리
  ctx.beginPath();
  ctx.moveTo(18, -20);
  ctx.quadraticCurveTo(24, -27, 30, -22);
  ctx.lineTo(31, -18);
  ctx.lineTo(26, -17);
  ctx.lineTo(30, -14);
  ctx.quadraticCurveTo(23, -12, 18, -14);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -27, -12, '#e8b64a', '#9a5a1a'), 1.3);
  ellipse(ctx, 25.5, -21.5, 1.2, 1.2); ctx.fillStyle = INK; ctx.fill();
  ctx.beginPath(); ctx.moveTo(22, -25); ctx.lineTo(20, -30); ctx.lineTo(24, -26); ctx.fillStyle = '#c8323c'; ctx.fill();
  // 장수(뚜껑 위로 고개를 내민)
  ellipse(ctx, -4, -35, 7, 7);
  fillStroke(ctx, rgrad(ctx, -4, -35, 7, shade(P.skin, 0.15), shade(P.skin, -0.1)));
  eye(ctx, -0.5, -36, mood, 0.9);
  ctx.beginPath(); ctx.moveTo(-3, -31.5); ctx.quadraticCurveTo(0, -30.5, 2.5, -31.5);
  outline(ctx, 1.2, '#3a2418'); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-11.5, -37); ctx.quadraticCurveTo(-11, -45, -4, -45); ctx.quadraticCurveTo(3, -45, 3.5, -37);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -45, -37, shade(P.navy, 0.2), shade(P.navy, -0.3)), 1.2);
  rr(ctx, -12, -38.5, 16, 2.6, 1);
  fillStroke(ctx, P.gold, 1);
  ctx.beginPath(); ctx.moveTo(-4, -45); ctx.quadraticCurveTo(-9, -51, -13, -47); ctx.quadraticCurveTo(-9, -48, -5, -44);
  fillStroke(ctx, '#d0283a', 1);
}

function turtleWeapon(ctx: C) {
  rr(ctx, -4, -3.4, 30, 6.8, 2.5);
  fillStroke(ctx, vgrad(ctx, -3.4, 3.4, '#8a949e', '#2a3036'));
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  for (const x of [6, 15]) ctx.fillRect(x, -3.4, 2, 6.8);
  rr(ctx, 24, -4.6, 5, 9.2, 2);
  fillStroke(ctx, vgrad(ctx, -4.6, 4.6, '#a8b0b8', '#3a4046'), 1.2);
  ellipse(ctx, 0, 0, 5, 5);
  fillStroke(ctx, '#4a3a2a', 1.2);
}

// ───────── 구미호 ─────────
function gumiho(ctx: C, mood: Mood) {
  const P = { white: '#f6eee8', pink: '#e48aa8', blue: '#7fd8ff', skin: '#f7d6c2' };
  // 아홉 꼬리
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * (0.62 + i * 0.075);
    const len = 22 + (i % 3) * 2;
    const bx = -3, by = -13;
    const tx = bx + Math.cos(a) * len, ty = by - Math.sin(a) * len;
    const mx = bx + Math.cos(a + 0.25) * len * 0.55, my = by - Math.sin(a + 0.25) * len * 0.55;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.quadraticCurveTo(mx - 4, my - 3, tx, ty);
    ctx.quadraticCurveTo(mx + 4, my + 4, bx + 1, by + 2);
    const g = ctx.createLinearGradient(bx, by, tx, ty);
    g.addColorStop(0, P.white);
    g.addColorStop(0.7, '#fbe4ee');
    g.addColorStop(1, P.pink);
    fillStroke(ctx, g, 1.1);
  }
  // 치마
  ctx.beginPath();
  ctx.moveTo(-7, -16);
  ctx.lineTo(7, -16);
  ctx.quadraticCurveTo(13, -5, 13, -1);
  ctx.quadraticCurveTo(0, 1, -12, -1);
  ctx.quadraticCurveTo(-12, -6, -7, -16);
  fillStroke(ctx, vgrad(ctx, -16, 0, shade(P.pink, 0.2), shade(P.pink, -0.25)));
  // 저고리
  ctx.beginPath();
  ctx.moveTo(-7, -26);
  ctx.quadraticCurveTo(0, -28, 7, -26);
  ctx.lineTo(9, -15);
  ctx.quadraticCurveTo(0, -13, -9, -15);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -28, -13, '#ffffff', '#e9dfe6'));
  // 고름
  ctx.beginPath(); ctx.moveTo(1, -20); ctx.quadraticCurveTo(4, -14, 2, -10); ctx.quadraticCurveTo(5, -14, 3, -20);
  fillStroke(ctx, '#c83a6a', 1);
  // 긴 머리(뒤)
  ctx.beginPath();
  ctx.moveTo(-6, -40);
  ctx.quadraticCurveTo(-14, -30, -11, -16);
  ctx.quadraticCurveTo(-6, -22, -3, -30);
  ctx.closePath();
  fillStroke(ctx, vgrad(ctx, -40, -16, '#2a1a30', '#120a16'), 1.1);
  // 얼굴
  ellipse(ctx, 1, -34, 8.2, 8.4);
  fillStroke(ctx, rgrad(ctx, 1, -34, 9, shade(P.skin, 0.2), shade(P.skin, -0.05)));
  // 앞머리
  ctx.beginPath();
  ctx.moveTo(-7.5, -35);
  ctx.quadraticCurveTo(-6, -44, 2, -43);
  ctx.quadraticCurveTo(9, -42, 9, -37);
  ctx.quadraticCurveTo(4, -40, 1, -37);
  ctx.quadraticCurveTo(-3, -39, -7.5, -35);
  fillStroke(ctx, vgrad(ctx, -44, -35, '#3a2440', '#160c1a'), 1.1);
  // 여우 귀
  for (const [x, rot] of [[-3, -0.35], [5, 0.25]] as [number, number][]) {
    ctx.save();
    ctx.translate(x, -42);
    ctx.rotate(rot);
    ctx.beginPath(); ctx.moveTo(-3.6, 1); ctx.lineTo(0, -8); ctx.lineTo(3.6, 1); ctx.closePath();
    fillStroke(ctx, P.white, 1.2);
    ctx.beginPath(); ctx.moveTo(-1.8, 0); ctx.lineTo(0, -5); ctx.lineTo(1.8, 0); ctx.closePath();
    ctx.fillStyle = P.pink; ctx.fill();
    ctx.restore();
  }
  // 금빛 눈
  if (mood === 'normal') {
    ctx.beginPath();
    ctx.moveTo(2.2, -34.5); ctx.quadraticCurveTo(5, -37.5, 7.8, -35.2); ctx.quadraticCurveTo(5, -33.2, 2.2, -34.5);
    fillStroke(ctx, '#ffd36a', 0.9);
    ellipse(ctx, 5.4, -35, 0.7, 1.4);
    ctx.fillStyle = INK; ctx.fill();
    outline(ctx, 1.2);
    ctx.beginPath(); ctx.moveTo(1.8, -34.6); ctx.lineTo(8.4, -35.6); ctx.stroke();
  } else eye(ctx, 5, -35, mood, 1);
  mouth(ctx, 5.2, -29.6, mood, 1.8);
  blush(ctx, 3, -31);
}

function gumihoWeapon(ctx: C) {
  // 손바닥 위 여우불
  const g = ctx.createRadialGradient(14, 0, 1, 14, 0, 12);
  g.addColorStop(0, 'rgba(230,250,255,1)');
  g.addColorStop(0.4, 'rgba(127,216,255,0.95)');
  g.addColorStop(1, 'rgba(79,140,255,0)');
  ctx.fillStyle = g;
  ellipse(ctx, 14, 0, 12, 12);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(22, 0);
  ctx.quadraticCurveTo(14, -10, 6, -5);
  ctx.quadraticCurveTo(10, -2, 8, 0);
  ctx.quadraticCurveTo(10, 3, 6, 5);
  ctx.quadraticCurveTo(14, 10, 22, 0);
  ctx.fillStyle = 'rgba(200,240,255,0.95)';
  ctx.fill();
  ellipse(ctx, 1, 0, 3.3, 3.1);
  fillStroke(ctx, '#f7d6c2', 1.1);
}

const BODY: Record<string, (c: C, m: Mood) => void> = { general, archer, dokkaebi, mudang, turtle, gumiho };
const WEAPON: Record<string, (c: C) => void> = {
  general: generalWeapon, archer: archerWeapon, dokkaebi: dokkaebiWeapon,
  mudang: mudangWeapon, turtle: turtleWeapon, gumiho: gumihoWeapon,
};

export function drawBody(ctx: C, id: string, mood: Mood): void {
  BODY[id]?.(ctx, mood);
}

export function drawWeapon(ctx: C, id: string): void {
  WEAPON[id]?.(ctx);
}

export function makeBodyCanvas(id: string, mood: Mood, scale: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.ceil(BODY_BOX.w * scale);
  c.height = Math.ceil(BODY_BOX.h * scale);
  const ctx = c.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.translate(BODY_BOX.footX, BODY_BOX.footY);
  drawBody(ctx, id, mood);
  return c;
}

export function makeWeaponCanvas(id: string, scale: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.ceil(WEAPON_BOX.w * scale);
  c.height = Math.ceil(WEAPON_BOX.h * scale);
  const ctx = c.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.translate(WEAPON_BOX.pivotX, WEAPON_BOX.pivotY);
  drawWeapon(ctx, id);
  return c;
}

/** 고르기 화면용 초상(몸 + 무기를 비스듬히) */
export function makePortrait(id: string, size: number, mood: Mood = 'normal', flip = false): string {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const s = size / 64;
  ctx.scale(s, s);
  ctx.translate(32, 60);
  if (flip) ctx.scale(-1, 1);
  const pv = PIVOT[id]!;
  // 무기를 몸 뒤에 먼저(장수 포는 위에)
  const drawW = () => {
    ctx.save();
    ctx.translate(pv.x, pv.y);
    ctx.rotate((-35 * Math.PI) / 180);
    drawWeapon(ctx, id);
    ctx.restore();
  };
  if (id === 'turtle') {
    drawBody(ctx, id, mood);
    drawW();
  } else {
    drawBody(ctx, id, mood);
    drawW();
  }
  return c.toDataURL('image/png');
}
