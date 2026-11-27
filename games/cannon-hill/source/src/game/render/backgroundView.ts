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
  private valleyMist: Phaser.GameObjects.Image | null = null;
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
      let key = artKey.bg(mapId);
      if (mapId === 'windrift') {
        const source = scene.textures.get(key).getSourceImage() as HTMLImageElement;
        const canvas = document.createElement('canvas');
        canvas.width = source.width;
        canvas.height = source.height;
        const ctx = canvas.getContext('2d')!;
        ctx.filter = 'contrast(1.13) saturate(.96)';
        ctx.drawImage(source, 0, 0);
        ctx.filter = 'none';
        const depth = ctx.createLinearGradient(0, 0, 0, canvas.height);
        depth.addColorStop(0, 'rgba(36,31,64,.13)');
        depth.addColorStop(.30, 'rgba(36,31,64,0)');
        depth.addColorStop(.49, 'rgba(43,53,84,.19)');
        depth.addColorStop(.70, 'rgba(28,49,81,.39)');
        depth.addColorStop(1, 'rgba(20,40,66,.66)');
        ctx.fillStyle = depth;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Amber light is strongest beside the painted sun; the far valley stays cool.
        const dusk = ctx.createRadialGradient(canvas.width * .24, canvas.height * .24, 0,
          canvas.width * .24, canvas.height * .24, canvas.width * .40);
        dusk.addColorStop(0, 'rgba(253,161,69,.22)');
        dusk.addColorStop(.53, 'rgba(238,139,77,.11)');
        dusk.addColorStop(1, 'rgba(238,139,77,0)');
        ctx.globalCompositeOperation = 'soft-light';
        ctx.fillStyle = dusk;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        key = add('sunset', canvas);
      }
      this.painted = scene.add.image(0, 0, key).setOrigin(0, 0);
      layer.add(this.painted);
      {
        const banks: Record<string, [string, number]> = {
          bridge: ['224,199,224', .15], windrift: ['183,197,229', .14],
          quarry: ['185,215,224', .105], sanseong: ['177,151,192', .095],
          baekdu: ['205,161,186', .09], forest: ['102,184,186', .12],
          cloud: ['255,247,215', .13], underworld: ['159,122,191', .105],
        };
        const [mistColor, opacity] = banks[mapId] ?? banks.quarry!;
        // Overlapping lit banks follow the slopes and float ahead of the distant ridges.
        const fog = document.createElement('canvas');
        fog.width = 960;
        fog.height = 480;
        const mist = fog.getContext('2d')!;
        for (let bank = 0; bank < 6; bank++) {
          const side = bank % 2 === 0 ? 1 : -1;
          const level = Math.floor(bank / 2);
          for (let i = 0; i < 9; i++) {
            const u = i / 8;
            const x = side === 1 ? u * 360 : fog.width - u * 360;
            const y = (mapId === 'windrift' ? 173 : 250) + level * 103 + u * (52 - level * 14) + Math.sin(i * 2.3 + bank) * 5;
            mist.save();
            mist.translate(x, y);
            mist.rotate(side * (.11 - level * .035));
            mist.scale(85 + 22 * Math.cos(i + bank), 9 + level * 3);
            const haze = mist.createRadialGradient(0, 0, 0, 0, 0, 1);
            haze.addColorStop(0, 'rgba(' + mistColor + ',' + opacity + ')');
            haze.addColorStop(.5, 'rgba(' + mistColor + ',' + opacity * .44 + ')');
            haze.addColorStop(1, 'rgba(' + mistColor + ',0)');
            mist.fillStyle = haze;
            mist.fillRect(-1, -1, 2, 2);
            mist.restore();
          }
        }
        this.valleyMist = scene.add.image(0, 0, add('mist', fog)).setOrigin(.5, 0);
        layer.add(this.valleyMist);
      }
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
        cfg = { x: -160, y: { min: 120, max: VIEW_H - 40 }, speedX: { min: 18, max: 38 }, lifespan: 60000, scaleX: { min: 1.5, max: 2.9 }, scaleY: { min: 0.12, max: 0.27 }, tint: 0xc8deec, alpha: { min: 0.045, max: 0.12 }, frequency: 4500 / k };
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
      if (this.valleyMist) {
        this.valleyMist.setDisplaySize(this.viewW * 1.16, VIEW_H);
        this.valleyMist.setPosition(this.viewW * (.5 - .045 * ux) + Math.sin(this.t * .055) * 9, -uy * 11);
      }
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
    this.valleyMist?.destroy();
    for (const l of this.layers) l.img.destroy();
    this.ambient?.destroy();
    for (const k of this.keys) if (this.scene.textures.exists(k)) this.scene.textures.remove(k);
  }
}
