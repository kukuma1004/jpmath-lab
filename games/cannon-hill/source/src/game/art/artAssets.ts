import type Phaser from 'phaser';
import { ART } from './artData';

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
};

export const WEAPON_RIG: Record<string, WeaponRig> = {
  general: { width: 42, grip: [0.36, 0.6] },
  archer: { width: 30, grip: [0.27, 0.5] },
  dokkaebi: { width: 44, grip: [0.27, 0.48] },
  mudang: { width: 34, grip: [0.33, 0.42] },
  turtle: { width: 40, grip: [0.45, 0.5] },
  gumiho: { width: 28, grip: [0.3, 0.75] },
};

export const artKey = {
  char: (id: string) => `art_char_${id}`,
  wpn: (id: string) => `art_wpn_${id}`,
  bg: (id: string) => `art_bg_${id}`,
};

export function preloadArt(load: Phaser.Loader.LoaderPlugin): void {
  for (const id of Object.keys(ART.chars)) load.image(artKey.char(id), `art/char_${id}.webp`);
  for (const id of Object.keys(ART.weapons)) load.image(artKey.wpn(id), `art/wpn_${id}.webp`);
  for (const id of Object.keys(ART.bgs)) load.image(artKey.bg(id), `art/bg_${id}.webp`);
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
export function makeArtPortrait(textures: Phaser.Textures.TextureManager, id: string, size: number, opts: { flip?: boolean; bust?: boolean } = {}): string | null {
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
  // 그림 한 장(몸 키 = 1)을 놓을 틀
  let unit: number, ox: number, oy: number;
  if (opts.bust) {
    unit = size / 0.62; // 위쪽 62%가 정사각형에 들어오게
    ox = size / 2 - d.cx * (d.w / d.h) * unit;
    oy = size * 0.02;
  } else {
    unit = size * 0.92;
    const wpx = (d.w / d.h) * unit;
    ox = (size - wpx) / 2 - size * 0.04;
    oy = size - unit - size * 0.02;
  }
  const bw = (d.w / d.h) * unit;
  ctx.drawImage(body, ox, oy, bw, unit);
  const wd = ART.weapons[id], wr = WEAPON_RIG[id];
  const wimg = source(textures, artKey.wpn(id));
  if (wd && wr && wimg && !opts.bust) {
    const k = unit / rig.height; // 월드 px → 초상 px
    const ww = wr.width * k, wh = ww * (wd.h / wd.w);
    ctx.save();
    ctx.translate(ox + rig.hand[0] * bw, oy + rig.hand[1] * unit);
    ctx.rotate((-30 * Math.PI) / 180);
    ctx.drawImage(wimg, -wr.grip[0] * ww, -wr.grip[1] * wh, ww, wh);
    ctx.restore();
  }
  return c.toDataURL('image/png');
}

/** 전장 미리보기 뒤에 깔 그림 */
export function bgSource(textures: Phaser.Textures.TextureManager, mapId: string): CanvasImageSource | null {
  return ART.bgs[mapId] ? source(textures, artKey.bg(mapId)) : null;
}
