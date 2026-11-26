import Phaser from 'phaser';
import type { DamageCause } from '../combat/types';
import { Mat } from '../terrain/terrain';
import type { MapDef } from '../data/maps';

type Emitter = Phaser.GameObjects.Particles.ParticleEmitter;

const WEAPON_TINTS: Record<string, number[]> = {
  drill: [0xfff6c9, 0xffcd7b, 0xd39556, 0x92847a],
  poison: [0xe0f3b1, 0xb6df6b, 0x7bac4b, 0x58823d],
  rocket: [0xfff4cf, 0xffc264, 0xff894d, 0xd85334],
  fox: [0xe6f6ff, 0x7fd8ff, 0x4f8cff, 0xff7ad9],
  goblinfire: [0xe6ffe6, 0x6dff9e, 0x2ee6a6],
  paper: [0xfff4b0, 0xffd36a, 0xff5a5a],
  default: [0xfff2c0, 0xffb04a, 0xff6a2a, 0xe0402a],
};

/**
 * 폭발·파편·먼지·피해 숫자. 입자는 미리 만든 발생기를 재사용(오브젝트 풀).
 * 이펙트는 화면 표현일 뿐 시뮬레이션 결과를 바꾸지 않는다.
 */
export class Effects {
  private fire: Emitter;
  private smoke: Emitter;
  private spark: Emitter;
  private debris: Emitter;
  private dust: Emitter;
  private glowEm: Emitter;
  private texts: Phaser.GameObjects.Text[] = [];
  private flashes: Phaser.GameObjects.Image[] = [];
  private matColor: (m: number) => number;

  constructor(private scene: Phaser.Scene, private layer: Phaser.GameObjects.Layer, def: MapDef, public quality: number, public shakeK: number, private cam: () => Phaser.Cameras.Scene2D.Camera) {
    const add = (tex: string, cfg: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig, depth: number) => {
      const e = scene.add.particles(0, 0, tex, { ...cfg, emitting: false });
      e.setDepth(depth);
      layer.add(e);
      return e;
    };
    this.smoke = add('blast_cloud', { angle: { min: 202, max: 338 }, speed: { min: 28, max: 96 }, lifespan: { min: 900, max: 1800 }, scale: { start: 0.28, end: 1.2 }, alpha: { start: 0.85, end: 0 }, gravityY: -40, tint: [0x6a5e58, 0x4a4440, 0x8a7e76], rotate: { min: 0, max: 360 } }, 38);
    this.fire = add('glow', { speed: { min: 60, max: 300 }, lifespan: { min: 260, max: 620 }, scale: { start: 0.9, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', tint: WEAPON_TINTS.default }, 41);
    this.spark = add('spark', { speed: { min: 220, max: 560 }, lifespan: { min: 380, max: 900 }, scale: { start: 0.7, end: 0.1 }, alpha: { start: 1, end: 0 }, gravityY: 700, blendMode: 'ADD',
      angle: { min: 195, max: 345 },
      rotate: { onUpdate: (particle: Phaser.GameObjects.Particles.Particle) => Math.atan2(particle.velocityY, particle.velocityX) * 180 / Math.PI },
      tint: [0xffda76, 0xff832a] }, 42);
    this.debris = add('shard', { speed: { min: 120, max: 420 }, angle: { min: 200, max: 340 }, lifespan: { min: 700, max: 1400 }, scale: { min: 0.5, max: 1.3 }, gravityY: 900, rotate: { min: 0, max: 360 } }, 39);
    this.dust = add('smoke', { speed: { min: 30, max: 140 }, angle: { min: 180, max: 360 }, lifespan: { min: 700, max: 1400 }, scale: { start: 0.35, end: 1.1 }, alpha: { start: 0.5, end: 0 }, gravityY: -12, tint: [0xa89078, 0x8a7460, 0xc0a890] }, 37);
    this.glowEm = add('glow', { speed: { min: 40, max: 220 }, lifespan: { min: 300, max: 800 }, scale: { start: 0.7, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' }, 43);
    const cols: Record<number, number> = {};
    for (const [m, c] of Object.entries(def.colors)) cols[Number(m)] = parseInt(c.base.slice(1), 16);
    this.matColor = (m) => cols[m] ?? 0x6a5040;
  }

  private n(k: number): number {
    return Math.max(1, Math.round(k * this.quality));
  }

  private flash(x: number, y: number, scale: number, tint: number, dur: number, tex = 'glow', alpha = 1, depth = 44): void {
    let img = this.flashes.find((f) => !f.active);
    if (!img) {
      img = this.scene.add.image(0, 0, tex);
      this.layer.add(img);
      this.flashes.push(img);
    }
    img.setTexture(tex).setActive(true).setVisible(true).setPosition(x, y).setTint(tint).setAlpha(alpha).setScale(scale * 0.25).setDepth(depth).setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({ targets: img, scale, alpha: { value: 0, ease: 'Quad.easeIn' }, duration: dur, ease: 'Cubic.easeOut', onComplete: () => img!.setActive(false).setVisible(false) });
  }

  shake(power: number): void {
    if (this.shakeK <= 0) return;
    this.cam().shake(Math.min(600, 140 + power * 4), Math.min(0.022, power * 0.00018) * this.shakeK);
  }

  /** Pressure pushes a rolling bank of smoke away from the contact point. */
  private smokeBank(x: number, y: number, radius: number, direction: number): void {
    const count = this.n(8);
    for (let i = 0; i < count; i++) {
      const t = (i + 1) / count;
      const spread = radius * (0.25 + t * 1.55);
      const height = radius * (0.16 + t * .67);
      const cloud = this.scene.add.image(x + direction * spread * .48, y - height * .35, 'blast_cloud')
        .setDepth(18).setAngle(direction * (i % 3 - 1) * 18)
        .setTint(0xffe4bb, 0xf0ceb1, 0xa6a4aa, 0x93949c)
        .setScale(radius / 68 * (.52 + .36 * t)).setAlpha(.80);
      this.layer.add(cloud);
      this.scene.tweens.add({
        targets: cloud, x: x + direction * spread * 1.55, y: y - height * (1 + i % 2 * .55),
        scale: radius / 68 * (.82 + .8 * t), duration: 1000 + 390 * t,
        alpha: { value: 0, ease: 'Quad.easeIn' }, ease: 'Cubic.easeOut',
        onComplete: () => cloud.destroy(),
      });
    }
  }

  explosion(x: number, y: number, r: number, look: string, big: boolean, mat: number): void {
    const tints = WEAPON_TINTS[look] ?? WEAPON_TINTS.default!;
    this.flash(x - r * .12, y - r * .55, r / 52, tints[1]!, 480, 'shock_crescent', 0.94);
    const plumeDirection = this.cam().midPoint.x < x ? 1 : -1;
    this.smokeBank(x, y, r, plumeDirection);
    if (big || look === 'drill') {
      this.smokeBank(x, y, r * .58, -plumeDirection);
    }
    this.flash(x, y, r / 48, tints[1]!, 155, 'glow', .75);
    this.flash(x, y, r / 48, 0xffefc9, 95);
    if (this.quality >= 0.6) this.flash(x, y, r / 46, 0xfff4e0, 350, 'ring', 0.42, 36);
    this.flash(x, y, r / 48, tints[1]!, 330, 'blast_fan', .88, 43);
    this.flash(x, y, r / 60, 0xffcc81, 570, 'impact_streaks', 1, 42);
    this.dust.explode(this.n(5 + r * 0.14), x, y);
    this.fire.particleTint = 0xffffff;
    this.fire.setConfig({ speed: { min: 60, max: 120 + r * 3.2 }, lifespan: { min: 240, max: 520 + r * 3 }, scale: { start: 0.11 + r / 350, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', tint: tints, emitting: false });
    this.fire.explode(this.n(4 + r * 0.13), x, y);
    for (const side of [-1, 1]) {
      this.smoke.explode(this.n(2 + r * .05), x + side * r * .38, y - 5);
    }
    this.smoke.explode(this.n(3), x, y - 12);
    this.spark.explode(this.n(6 + r * 0.12), x, y);
    this.debris.particleTint = this.matColor(mat);
    this.debris.explode(this.n(6 + r * 0.25), x, y);
    if (big) {
      this.flash(x, y, r / 32, 0xffb552, 300, 'glow', 0.4);
      this.smoke.explode(this.n(10), x, y - 20);
    }
    this.shake(r * (big ? 1.6 : 1));
  }

  muzzle(x: number, y: number, angleDeg: number, look: string): void {
    const tints = WEAPON_TINTS[look] ?? WEAPON_TINTS.default!;
    this.flash(x, y, 1.1, tints[1]!, 180);
    this.glowEm.setConfig({ speed: { min: 80, max: 260 }, angle: { min: -angleDeg - 20, max: -angleDeg + 20 }, lifespan: { min: 120, max: 320 }, scale: { start: 0.5, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', tint: tints, emitting: false });
    this.glowEm.explode(this.n(10), x, y);
    if (look === 'ball' || look === 'iron' || look === 'megabomb') {
      const angle = Phaser.Math.DegToRad(angleDeg);
      const dx = Math.cos(angle), dy = -Math.sin(angle);
      const jet = this.scene.add.image(x, y, 'cannon_wake').setOrigin(1, .5)
        .setRotation(Math.atan2(dy, dx) + Math.PI).setScale(.14, .45).setDepth(40);
      this.layer.add(jet);
      this.scene.tweens.add({ targets: jet, scaleX: .68, scaleY: .85, alpha: { value: 0, ease: 'Quad.easeIn' },
        duration: 245, ease: 'Quad.easeOut', onComplete: () => jet.destroy() });
      this.smokeBank(x - dx * 8, y + 15, 23, dx >= 0 ? -1 : 1);
      for (let step = 1; step <= 3; step++) {
        this.smoke.explode(this.n(2), x + dx * step * 9, y + dy * step * 9);
      }
      this.spark.explode(this.n(4), x, y);
      this.shake(18);
    }
  }

  lightning(x: number, y: number, topY: number): void {
    const g = this.scene.add.graphics().setDepth(45).setBlendMode(Phaser.BlendModes.ADD);
    this.layer.add(g);
    const draw = (w: number, col: number, a: number) => {
      g.lineStyle(w, col, a);
      g.beginPath();
      let px = x + (Math.random() - 0.5) * 30, py = topY;
      g.moveTo(px, py);
      const steps = 14;
      for (let i = 1; i <= steps; i++) {
        const ny = topY + ((y - topY) * i) / steps;
        const nx = x + (i === steps ? 0 : (Math.random() - 0.5) * 36 * (1 - i / steps + 0.3));
        g.lineTo(nx, ny);
        px = nx; py = ny;
      }
      g.strokePath();
    };
    draw(10, 0x6a8aff, 0.35);
    draw(4, 0xcfe0ff, 0.9);
    draw(1.6, 0xffffff, 1);
    this.flash(x, y, 2.4, 0xcfe0ff, 300);
    this.scene.tweens.add({ targets: g, alpha: 0, duration: 320, delay: 60, onComplete: () => g.destroy() });
    this.glowEm.setConfig({ speed: { min: 60, max: 260 }, lifespan: { min: 200, max: 500 }, scale: { start: 0.5, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', tint: [0xffffff, 0xa8c8ff, 0x6a8aff], emitting: false });
    this.glowEm.explode(this.n(14), x, y);
    this.shake(40);
  }

  bounce(x: number, y: number, look: string): void {
    const tints = WEAPON_TINTS[look] ?? WEAPON_TINTS.default!;
    this.flash(x, y, 0.8, tints[1]!, 200, 'ring', 0.7);
    this.dust.explode(this.n(4), x, y);
  }

  split(x: number, y: number): void {
    this.flash(x, y, 2, 0xff7ad9, 300);
    this.glowEm.setConfig({ speed: { min: 80, max: 240 }, lifespan: { min: 300, max: 700 }, scale: { start: 0.6, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', tint: WEAPON_TINTS.fox, emitting: false });
    this.glowEm.explode(this.n(18), x, y);
  }

  fuse(x: number, y: number): void {
    this.spark.explode(this.n(6), x, y - 8);
  }

  debrisPuff(x: number, y: number, count: number, mat: number): void {
    this.debris.particleTint = this.matColor(mat === Mat.Rock ? Mat.Rock : mat);
    this.debris.explode(this.n(Math.min(30, count)), x, y);
    this.dust.explode(this.n(Math.min(8, 2 + count / 6)), x, y);
  }

  chunkLand(x: number, y: number, size: number, speed: number): void {
    const k = Math.min(30, 4 + Math.sqrt(size) * 0.6);
    for (let i = 0; i < 3; i++) this.dust.explode(this.n(k / 3), x + (i - 1) * Math.sqrt(size) * 1.4, y);
    this.debris.particleTint = 0x8a7a6a;
    this.debris.explode(this.n(k / 2), x, y);
    this.shake(Math.min(70, (Math.sqrt(size) * speed) / 80));
  }

  rockHit(x: number, y: number, speed: number): void {
    this.dust.explode(this.n(Math.min(5, 1 + speed / 200)), x, y);
  }

  land(x: number, y: number, speed: number): void {
    if (speed < 140) return;
    this.dust.explode(this.n(Math.min(8, 2 + speed / 150)), x, y);
    if (speed > 430) this.shake(speed / 30);
  }

  soul(x: number, y: number): void {
    const img = this.scene.add.image(x, y - 20, 'glow').setTint(0xcfe0ff).setBlendMode(Phaser.BlendModes.ADD).setScale(0.8).setDepth(46);
    this.layer.add(img);
    this.scene.tweens.add({ targets: img, y: y - 140, alpha: 0, scale: 1.4, duration: 1800, ease: 'Sine.easeOut', onComplete: () => img.destroy() });
  }

  damage(x: number, y: number, amount: number, crit: boolean, cause: DamageCause): void {
    let t = this.texts.find((x2) => !x2.active);
    if (!t) {
      t = this.scene.add.text(0, 0, '', { fontFamily: 'Black Han Sans, sans-serif', fontSize: '26px', color: '#fff', stroke: '#1a1210', strokeThickness: 6 }).setOrigin(0.5).setResolution(2).setDepth(50);
      this.layer.add(t);
      this.texts.push(t);
    }
    const prefix = cause === 'fall' ? '낙하 ' : cause === 'rock' ? '낙석 ' : cause === 'crush' ? '깔림 ' : cause === 'lightning' ? '벼락 ' : cause === 'poison' ? '독 ' : '';
    t.setText(`${crit ? '치명타! ' : prefix}-${amount}`);
    t.setColor(crit ? '#ffd36a' : cause === 'poison' ? '#c7ed91' : cause === 'blast' ? '#ffffff' : '#ffd0c0');
    t.setFontSize(crit ? 34 : amount >= 120 ? 30 : 24);
    t.setActive(true).setVisible(true).setPosition(x + (Math.random() - 0.5) * 16, y - 30).setAlpha(1).setScale(0.6);
    this.scene.tweens.add({ targets: t, scale: 1, duration: 160, ease: 'Back.easeOut' });
    this.scene.tweens.add({ targets: t, y: y - 90, alpha: 0, duration: 1300, delay: 450, ease: 'Sine.easeIn', onComplete: () => t!.setActive(false).setVisible(false) });
  }

  label(x: number, y: number, text: string, color = '#ffffff'): void {
    const t = this.scene.add.text(x, y, text, { fontFamily: 'Black Han Sans, sans-serif', fontSize: '30px', color, stroke: '#1a1210', strokeThickness: 7 }).setOrigin(0.5).setResolution(2).setDepth(51);
    this.layer.add(t);
    this.scene.tweens.add({ targets: t, y: y - 60, alpha: 0, duration: 1800, delay: 600, onComplete: () => t.destroy() });
  }

  /** 무당의 회복: 초록 숫자와 위로 오르는 빛 */
  heal(x: number, y: number, amount: number): void {
    const t = this.scene.add.text(x, y, `+${amount}`, { fontFamily: 'Black Han Sans, sans-serif', fontSize: '26px', color: '#8dffb0', stroke: '#0d2a18', strokeThickness: 6 }).setOrigin(0.5).setResolution(2).setDepth(51);
    this.layer.add(t);
    this.scene.tweens.add({ targets: t, y: y - 50, alpha: 0, duration: 1400, delay: 400, onComplete: () => t.destroy() });
    this.glowEm.setConfig({ speed: { min: 20, max: 70 }, angle: { min: 250, max: 290 }, gravityY: -60, lifespan: { min: 600, max: 1100 }, scale: { start: 0.3, end: 0 }, alpha: { start: 0.9, end: 0 }, blendMode: 'ADD', tint: [0x8dffb0, 0xd8ffe0, 0xfff1a0], emitting: false });
    this.glowEm.explode(this.n(18), x, y + 30);
  }

  confetti(x: number, y: number): void {
    this.glowEm.setConfig({ speed: { min: 120, max: 380 }, angle: { min: 220, max: 320 }, gravityY: 300, lifespan: { min: 800, max: 1600 }, scale: { start: 0.4, end: 0.1 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', tint: [0xffd36a, 0xff7a6a, 0x7fd8ff, 0x9cff6b], emitting: false });
    this.glowEm.explode(this.n(40), x, y);
  }
}
