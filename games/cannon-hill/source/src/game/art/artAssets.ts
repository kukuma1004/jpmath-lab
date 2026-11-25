import type Phaser from 'phaser';
import { ART as BASE_ART, type ArtData } from './artData';
import { TEX } from './textures';
import { WEAPON_BOX } from './characters';

const ART: ArtData = { ...BASE_ART, chars: { ...BASE_ART.chars,
  hwacha: { w: 177, h: 240, footX: 0.525, cx: 0.59 },
  alchemist: { w: 207, h: 240, footX: 0.5, cx: 0.58 },
  driller: { w: 1199, h: 1312, footX: 0.5, cx: 0.58 },
}, bgs: { ...BASE_ART.bgs, bridge: { w: 1536, h: 1024 }, quarry: { w: 1536, h: 1024 } } };

/**
 * 그려 받은 그림(public/art)을 게임에 붙이는 자리 정보.
 * 그림 파일이 없거나 못 불러오면 코드로 그린 임시 그림(characters.ts·textures.ts·backgrounds.ts)을 그대로 쓴다.
 */

/** 장수 몸: 화면 키(월드 px), 앞손 위치(잘라 낸 그림 안의 가로·세로 비율, 오른쪽을 볼 때) */
export interface CharRig {
  height: number;
  hand: [number, number];
}

/** 무기: 화면 너비(월드 px), 쥐는 곳(그림 안의 가로·세로 비율). 그림은 모두 오른쪽을 향한다. */
export interface WeaponRig {
  width: number;
  grip: [number, number];
}

export const CHAR_RIG: Record<string, CharRig> = {
  general: { height: 60, hand: [0.93, 0.713] },
  archer: { height: 60, hand: [0.848, 0.696] },
  dokkaebi: { height: 56, hand: [0.917, 0.644] },
  mudang: { height: 60, hand: [0.907, 0.68] },
  turtle: { height: 58, hand: [0.76, 0.55] },
  gumiho: { height: 62, hand: [0.831, 0.645] },
  hwacha: { height: 64, hand: [0.946, 0.457] },
  alchemist: { height: 62, hand: [0.94, 0.55] },
  driller: { height: 64, hand: [0.9, 0.43] },
};

export const WEAPON_RIG: Record<string, WeaponRig> = {
  general: { width: 42, grip: [0.36, 0.6] },
  archer: { width: 30, grip: [0.27, 0.5] },
  dokkaebi: { width: 44, grip: [0.27, 0.48] },
  mudang: { width: 34, grip: [0.33, 0.42] },
  turtle: { width: 40, grip: [0.45, 0.5] },
  gumiho: { width: 28, grip: [0.3, 0.75] },
  hwacha: { width: 38, grip: [WEAPON_BOX.pivotX / WEAPON_BOX.w, WEAPON_BOX.pivotY / WEAPON_BOX.h] },
  alchemist: { width: 34, grip: [WEAPON_BOX.pivotX / WEAPON_BOX.w, WEAPON_BOX.pivotY / WEAPON_BOX.h] },
  driller: { width: 42, grip: [WEAPON_BOX.pivotX / WEAPON_BOX.w, WEAPON_BOX.pivotY / WEAPON_BOX.h] },
};

export const artKey = {
  char: (id: string) => `art_char_${id}`,
  wpn: (id: string) => `art_wpn_${id}`,
  bg: (id: string) => `art_bg_${id}`,
};

export function preloadArt(load: Phaser.Loader.LoaderPlugin): void {
  for (const id of Object.keys(ART.chars)) load.image(artKey.char(id), `art/char_${id}.${id === 'driller' ? 'png' : 'webp'}`);
  for (const id of Object.keys(ART.weapons)) load.image(artKey.wpn(id), `art/wpn_${id}.webp`);
  for (const id of Object.keys(ART.bgs)) load.image(artKey.bg(id), `art/bg_${id}.${id === 'bridge' || id === 'quarry' ? 'png' : 'webp'}`);
}

export interface BodyArt {
  key: string;
  scale: number;
  originX: number;
  /** 발에서 앞손까지(오른쪽을 볼 때) */
  handX: number;
  handY: number;
  width: number;
}

export function bodyArt(textures: Phaser.Textures.TextureManager, id: string): BodyArt | null {
  const d = ART.chars[id], rig = CHAR_RIG[id];
  if (!d || !rig || !textures.exists(artKey.char(id))) return null;
  const scale = rig.height / d.h;
  const width = d.w * scale;
  return {
    key: artKey.char(id),
    scale,
    originX: d.footX,
    handX: (rig.hand[0] - d.footX) * width,
    handY: -(1 - rig.hand[1]) * rig.height,
    width,
  };
}

export interface WeaponArt {
  key: string;
  scale: number;
  originX: number;
  originY: number;
}

export function weaponArt(textures: Phaser.Textures.TextureManager, id: string): WeaponArt | null {
  const d = ART.weapons[id], rig = WEAPON_RIG[id];
  if (!d && rig && textures.exists(`wpn_${id}`)) return { key: `wpn_${id}`, scale: rig.width / (WEAPON_BOX.w * TEX), originX: rig.grip[0], originY: rig.grip[1] };
  if (!d || !rig || !textures.exists(artKey.wpn(id))) return null;
  return { key: artKey.wpn(id), scale: rig.width / d.w, originX: rig.grip[0], originY: rig.grip[1] };
}

function source(textures: Phaser.Textures.TextureManager, key: string): CanvasImageSource | null {
  if (!textures.exists(key)) return null;
  return textures.get(key).getSourceImage() as CanvasImageSource;
}

/**
 * 고르기 화면·전투 화면 카드에 쓰는 초상(PNG dataURL). 몸 그림에 무기를 비스듬히 들려 그린다.
 * bust면 머리·어깨만 크게 보이도록 위쪽을 잘라 쓴다.
 */
export function makeArtPortrait(textures: Phaser.Textures.TextureManager, id: string, size: number, opts: { flip?: boolean; bust?: boolean; bodyOnly?: boolean } = {}): string | null {
  const d = ART.chars[id], rig = CHAR_RIG[id];
  const body = source(textures, artKey.char(id));
  if (!d || !rig || !body) return null;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  if (opts.flip) {
    ctx.translate(size, 0);
    ctx.scale(-1, 1);
  }
  const raw = source(textures, `wpn_${id}`) as HTMLCanvasElement | null;
  const wd = ART.weapons[id] ?? (raw ? { w: raw.width, h: raw.height } : null);
  const wr = WEAPON_RIG[id] ?? { width: WEAPON_BOX.w, grip: [WEAPON_BOX.pivotX / WEAPON_BOX.w, WEAPON_BOX.pivotY / WEAPON_BOX.h] };
  const wimg = opts.bodyOnly ? null : source(textures, artKey.wpn(id)) ?? raw;
  const aspect = d.w / d.h;
  const angle = -Math.PI / 6;
  let unit: number, ox: number, oy: number;
  if (opts.bust) {
    unit = size / .62;
    ox = size / 2 - d.cx * aspect * unit;
    oy = size * .02;
  } else {
    // Frame the combined silhouette, including all four rotated weapon corners.
    let left = 0, right = aspect, top = 0, bottom = 1;
    if (wd && wimg) {
      const width = wr.width / rig.height, height = width * wd.h / wd.w;
      for (const edgeX of [0, 1]) for (const edgeY of [0, 1]) {
        const dx = (edgeX - wr.grip[0]) * width, dy = (edgeY - wr.grip[1]) * height;
        const x = rig.hand[0] * aspect + dx * Math.cos(angle) - dy * Math.sin(angle);
        const y = rig.hand[1] + dx * Math.sin(angle) + dy * Math.cos(angle);
        left = Math.min(left,x); right = Math.max(right,x);
        top = Math.min(top,y); bottom = Math.max(bottom,y);
      }
    }
    unit = size * .96 / Math.max(right-left,bottom-top);
    ox = (size - unit*(right+left)) / 2;
    oy = (size - unit*(bottom+top)) / 2;
  }
  const bw = aspect * unit;
  ctx.drawImage(body, ox, oy, bw, unit);
  if (wd && wr && wimg && !opts.bust) {
    const k = unit / rig.height; // 월드 px → 초상 px
    const ww = wr.width * k, wh = ww * (wd.h / wd.w);
    ctx.save();
    ctx.translate(ox + rig.hand[0] * bw, oy + rig.hand[1] * unit);
    ctx.rotate(angle);
    ctx.drawImage(wimg, -wr.grip[0] * ww, -wr.grip[1] * wh, ww, wh);
    ctx.restore();
  }
  return c.toDataURL('image/png');
}

/** 전장 미리보기 뒤에 깔 그림 */
export function bgSource(textures: Phaser.Textures.TextureManager, mapId: string): CanvasImageSource | null {
  return ART.bgs[mapId] ? source(textures, artKey.bg(mapId)) : null;
}
