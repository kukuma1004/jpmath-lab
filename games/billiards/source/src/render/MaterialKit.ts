import * as THREE from 'three';

/** Small deterministic, generated textures; no downloaded assets or runtime network requests. */
function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function woodTexture() {
  const texture = canvasTexture(512, 512, ctx => {
    ctx.fillStyle = '#503627'; ctx.fillRect(0, 0, 512, 512);
    for (let j = 0; j < 240; j++) {
      const x = j * 2.3;
      ctx.strokeStyle = j % 3 ? `rgba(17,8,5,${.09 + (j % 5) * .014})` : 'rgba(194,139,88,.14)';
      ctx.lineWidth = .6 + (j % 4) * .25;
      ctx.beginPath();
      for (let y = 0; y <= 512; y += 8) {
        const xx = x + Math.sin(y * .014 + j * .26) * 2.2 + Math.sin(y * .033 + j) * .8;
        y === 0 ? ctx.moveTo(xx, y) : ctx.lineTo(xx, y);
      }
      ctx.stroke();
    }
  });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

export function clothTexture() {
  const texture = canvasTexture(256, 256, ctx => {
    ctx.fillStyle = '#9cb9bf'; ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 2) {
      ctx.fillStyle = y % 4 ? '#a6c1c6' : '#9ab4bb'; ctx.fillRect(0, y, 256, 1);
    }
    for (let x = 0; x < 256; x += 2) {
      ctx.fillStyle = x % 4 ? 'rgba(220,238,240,.08)' : 'rgba(40,66,79,.08)';
      ctx.fillRect(x, 0, 1, 256);
    }
  });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 10);
  return texture;
}

export function shadowTexture() {
  return canvasTexture(64, 64, ctx => {
    const grad = ctx.createRadialGradient(32, 32, 4, 32, 32, 31);
    grad.addColorStop(0, 'rgba(0,5,9,.58)'); grad.addColorStop(.48, 'rgba(0,5,9,.24)'); grad.addColorStop(1, 'rgba(0,5,9,0)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 64, 64);
  });
}

export function ballTexture(color: string, dots: string) {
  return canvasTexture(512, 256, ctx => {
    ctx.fillStyle = color; ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = dots;
    // Equatorial and off-equatorial spots make draw/follow and side spin legible.
    for (const [x, y] of [[64, 128], [192, 128], [320, 128], [448, 128], [128, 70], [384, 186]]) {
      ctx.beginPath(); ctx.ellipse(x, y, 4.5, 5.5, 0, 0, Math.PI * 2); ctx.fill();
    }
  });
}

const POOL_COLORS = ['#f0b52d', '#2353a8', '#bf2f32', '#743d8c', '#dd742b', '#286746', '#792e39', '#101417'];

/** Standard 1–7 solids, black 8 and 9–15 striped companions. */
export function poolBallTexture(number: number) {
  const color = POOL_COLORS[(number - 1) % 8];
  return canvasTexture(512, 256, ctx => {
    ctx.fillStyle = number < 9 ? color : '#f7f0dc'; ctx.fillRect(0, 0, 512, 256);
    if (number > 8) { ctx.fillStyle = color; ctx.fillRect(0, 77, 512, 102); }
    for (const x of [128, 384]) {
      ctx.fillStyle = '#faf5e7'; ctx.beginPath(); ctx.arc(x, 128, 27, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#172022'; ctx.font = '700 37px Arial, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(number), x, 130, 46);
    }
  });
}

export function labelTexture(text: string, size = 512) {
  return canvasTexture(size, size / 4, ctx => {
    ctx.clearRect(0, 0, size, size / 4);
    ctx.fillStyle = '#dcc797'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `500 ${size * .058}px Georgia, serif`;
    ctx.fillText(text, size / 2, size / 8);
  });
}

export class MaterialKit {
  readonly woodMap = woodTexture();
  readonly clothMap = clothTexture();
  readonly shadowMap = shadowTexture();
  readonly walnut = new THREE.MeshStandardMaterial({ color: 0x695343, map: this.woodMap, metalness: .03, roughness: .32 });
  readonly darkWood = new THREE.MeshStandardMaterial({ color: 0x302823, map: this.woodMap, roughness: .43 });
  readonly brass = new THREE.MeshStandardMaterial({ color: 0xb59a67, metalness: .8, roughness: .27 });
  readonly darkBrass = new THREE.MeshStandardMaterial({ color: 0x786443, metalness: .7, roughness: .36 });
  readonly cloth = new THREE.MeshPhysicalMaterial({ color: 0x07517d, map: this.clothMap, bumpMap: this.clothMap, bumpScale: .00012, roughness: .94, sheen: .24, sheenColor: new THREE.Color(0x31607e), sheenRoughness: .8 });
  readonly cushion = new THREE.MeshPhysicalMaterial({ color: 0x073c5d, map: this.clothMap, roughness: .9, sheen: .2, sheenColor: new THREE.Color(0x275570) });
  readonly rubber = new THREE.MeshStandardMaterial({ color: 0x15191a, roughness: .77 });
  readonly ivory = new THREE.MeshStandardMaterial({ color: 0xe0d3ad, roughness: .31, metalness: .03 });
  readonly floor = new THREE.MeshStandardMaterial({ color: 0x615448, roughness: .68, map: this.woodMap });
  readonly leather = new THREE.MeshStandardMaterial({ color: 0x253531, roughness: .72 });
  readonly wall = new THREE.MeshStandardMaterial({ color: 0x232d2c, roughness: .94 });
  readonly light = new THREE.MeshBasicMaterial({ color: 0xffedca, toneMapped: false });

  dispose() {
    for (const value of Object.values(this)) {
      if (value instanceof THREE.Material || value instanceof THREE.Texture) value.dispose();
    }
  }
}
