import Phaser from 'phaser';
import { WORLD_W } from '../config/constants';
import { BackgroundView } from '../render/backgroundView';
import type { App } from '../app';

/** 타이틀: 산성 저녁 하늘, 천천히 흐르는 배경, 가끔 날아가는 포탄 */
export class TitleScene extends Phaser.Scene {
  private bg!: BackgroundView;
  private t = 0;
  private nextShot = 1.2;
  private layer!: Phaser.GameObjects.Layer;

  constructor() {
    super('title');
  }

  create(): void {
    const app = this.registry.get('app') as App;
    this.layer = this.add.layer();
    this.bg = new BackgroundView(this, this.layer, 'sanseong', app.settings.quality, this.scale.width);
    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', () => {
      this.scale.off('resize', this.onResize, this);
      this.bg.destroy();
    });
  }

  private onResize(size: Phaser.Structs.Size): void {
    this.cameras.main.setSize(size.width, size.height);
    this.bg.resize(size.width);
  }

  private shot(): void {
    const w = this.scale.width;
    const fromLeft = Math.random() < 0.5;
    const x0 = fromLeft ? w * 0.12 : w * 0.88;
    const x1 = fromLeft ? w * (0.6 + Math.random() * 0.3) : w * (0.1 + Math.random() * 0.3);
    const y0 = 600, peak = 220 + Math.random() * 120, y1 = 590;
    const img = this.add.image(x0, y0, 'glow').setTint(0xffb04a).setBlendMode(Phaser.BlendModes.ADD).setScale(0.45);
    const trail = this.add.particles(0, 0, 'glow', { follow: img, lifespan: 500, scale: { start: 0.3, end: 0 }, alpha: { start: 0.7, end: 0 }, blendMode: 'ADD', tint: [0xffd36a, 0xff7a3a], frequency: 20 });
    this.layer.add([trail, img]);
    const dur = 1500 + Math.random() * 500;
    this.tweens.addCounter({
      from: 0, to: 1, duration: dur,
      onUpdate: (tw) => {
        const u = tw.getValue() ?? 0;
        img.x = x0 + (x1 - x0) * u;
        img.y = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * (peak * 2 - (y0 + y1) / 2) + u * u * y1;
      },
      onComplete: () => {
        trail.stop();
        const boom = this.add.image(img.x, img.y, 'glow').setTint(0xffa040).setBlendMode(Phaser.BlendModes.ADD).setScale(0.3);
        this.layer.add(boom);
        this.tweens.add({ targets: boom, scale: 2.6, alpha: 0, duration: 520, ease: 'Cubic.easeOut', onComplete: () => boom.destroy() });
        img.destroy();
        this.time.delayedCall(800, () => trail.destroy());
      },
    });
  }

  update(_time: number, delta: number): void {
    const dt = Math.min(0.1, delta / 1000);
    this.t += dt;
    const camX = WORLD_W / 2 + Math.sin(this.t * 0.06) * 900;
    this.bg.update(camX, 760, 0.85, dt);
    this.nextShot -= dt;
    if (this.nextShot <= 0) {
      this.nextShot = 2.2 + Math.random() * 2;
      this.shot();
    }
  }
}
