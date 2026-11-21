import Phaser from 'phaser';
import { VIEW_H, WORLD_W } from '../config/constants';
import { LAYER_W, backgroundFor, type BgLayers } from '../art/backgrounds';
import { artKey } from '../art/artAssets';
import type { Quality } from '../settings';

let uid = 0;

/**
 * 화면 고정 카메라(bgCam)에 그리는 여러 겹의 배경. 월드 카메라 위치에 따라 겹마다 다르게 움직인다.
 */
export class BackgroundView {
  private sky: Phaser.GameObjects.Image;
  private layers: { img: Phaser.GameObjects.Image; f: number; fy: number }[] = [];
  /** 그려 받은 배경 한 장(있으면 겹 배경 대신 쓴다) */
  private painted: Phaser.GameObjects.Image | null = null;
  private ambient: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private keys: string[] = [];
  private bg: BgLayers;
  private t = 0;

  constructor(private scene: Phaser.Scene, private layer: Phaser.GameObjects.Layer, mapId: string, quality: Quality, private viewW: number) {
    this.bg = backgroundFor(mapId);
    const id = ++uid;
    const add = (name: string, c: HTMLCanvasElement) => {
      const key = `bg_${mapId}_${name}_${id}`;
      if (!scene.textures.exists(key)) scene.textures.addCanvas(key, c);
      this.keys.push(key);
      return key;
    };
    this.sky = scene.add.image(0, 0, add('sky', this.bg.sky)).setOrigin(0, 0);
    layer.add(this.sky);
    const spec: [keyof BgLayers, number, number][] = [['far', 0.06, 0.04], ['mid', 0.16, 0.1], ['near', 0.3, 0.2]];
    if (scene.textures.exists(artKey.bg(mapId))) {
      this.painted = scene.add.image(0, 0, artKey.bg(mapId)).setOrigin(0, 0);
      layer.add(this.painted);
      spec.length = 0;
    }
    for (const [name, f, fy] of spec) {
      const c = this.bg[name] as HTMLCanvasElement;
      const img = scene.add.image(0, 0, add(name, c)).setOrigin(0, 0);
      img.setScale(LAYER_W / c.width);
      layer.add(img);
      this.layers.push({ img, f, fy });
    }
    this.makeAmbient(quality);
    this.resize(viewW);
  }

  private makeAmbient(q: Quality): void {
    const k = q === 'low' ? 0.35 : q === 'high' ? 1.4 : 1;
    const w = this.viewW;
    let cfg: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig;
    let tex = 'dot';
    switch (this.bg.ambient) {
      case 'embers':
        cfg = { x: { min: 0, max: w }, y: VIEW_H + 10, speedY: { min: -90, max: -40 }, speedX: { min: -20, max: 20 }, lifespan: 6000, scale: { start: 0.5, end: 0 }, alpha: { start: 0.9, end: 0 }, tint: [0xffb04a, 0xff6a2a, 0xffe08a], blendMode: 'ADD', frequency: 160 / k };
        break;
      case 'leaves':
        tex = 'leaf';
        cfg = { x: { min: -50, max: w }, y: -20, speedY: { min: 30, max: 70 }, speedX: { min: 10, max: 50 }, rotate: { min: 0, max: 360 }, lifespan: 14000, scale: { min: 0.5, max: 0.9 }, alpha: 0.75, tint: [0xd8572a, 0xe8b64a, 0xc8323c], frequency: 600 / k };
        break;
      case 'fireflies':
        cfg = { x: { min: 0, max: w }, y: { min: 200, max: VIEW_H }, speedY: { min: -14, max: 14 }, speedX: { min: -14, max: 14 }, lifespan: 4200, scale: { start: 0.25, end: 0.05 }, alpha: { start: 1, end: 0, ease: 'Sine.easeIn' }, tint: [0xd8ff8a, 0x8affd0, 0x6ae0ff], blendMode: 'ADD', frequency: 180 / k };
        break;
      case 'clouds':
        tex = 'puff';
        cfg = { x: -160, y: { min: 120, max: VIEW_H - 40 }, speedX: { min: 18, max: 38 }, lifespan: 60000, scale: { min: 0.6, max: 1.3 }, alpha: { min: 0.35, max: 0.7 }, frequency: 2600 / k };
        break;
      case 'souls':
      default:
        cfg = { x: { min: 0, max: w }, y: VIEW_H + 10, speedY: { min: -40, max: -18 }, speedX: { min: -10, max: 10 }, lifespan: 9000, scale: { start: 0.6, end: 0.2 }, alpha: { start: 0.7, end: 0 }, tint: [0xa8c8ff, 0xd0b0ff, 0xffffff], blendMode: 'ADD', frequency: 400 / k };
    }
    this.ambient = this.scene.add.particles(0, 0, tex, cfg);
    this.layer.add(this.ambient);
    // 처음부터 화면에 조금 깔려 있게
    this.ambient.fastForward(this.bg.ambient === 'clouds' ? 30000 : 4000);
  }

  resize(w: number): void {
    this.viewW = w;
    this.sky.setDisplaySize(w, VIEW_H);
  }

  /** camX/camY는 월드 카메라가 보는 가운데 */
  update(camX: number, camY: number, zoom: number, dt: number): void {
    this.t += dt;
    const p = this.painted;
    if (p) {
      // 화면보다 조금 크게 깔고, 카메라를 따라 남는 폭 안에서만 천천히 밀린다(가장자리가 드러나지 않게)
      const s = Math.max((this.viewW * 1.14) / p.width, (VIEW_H * 1.1) / p.height) * (0.97 + zoom * 0.03);
      p.setScale(s);
      const w = p.width * s, h = p.height * s;
      const slackX = (w - this.viewW) / 2, slackY = h - VIEW_H;
      const ux = Phaser.Math.Clamp((camX - WORLD_W / 2) / (WORLD_W / 2), -1, 1);
      const uy = Phaser.Math.Clamp((camY - 760) / 500, -1, 1);
      p.x = this.viewW / 2 - w / 2 - ux * slackX * 0.9;
      p.y = -slackY * (0.55 + uy * 0.4);
    }
    for (const { img, f, fy } of this.layers) {
      const s = 0.92 + zoom * 0.1;
      img.setScale((LAYER_W / (img.width)) * s);
      const w = LAYER_W * s;
      img.x = this.viewW / 2 - w / 2 - (camX - WORLD_W / 2) * f;
      img.y = -40 - (camY - 760) * fy + (1 - s) * 360;
    }
  }

  destroy(): void {
    this.sky.destroy();
    this.painted?.destroy();
    for (const l of this.layers) l.img.destroy();
    this.ambient?.destroy();
    for (const k of this.keys) if (this.scene.textures.exists(k)) this.scene.textures.remove(k);
  }
}
