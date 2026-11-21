import Phaser from 'phaser';
import { CELL } from '../config/constants';
import type { Battle } from '../combat/battle';
import { weapon } from '../data/weapons';
import type { TerrainPainter } from './terrainPainter';

interface PView {
  img: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
  /** 밝은 하늘(구름 궁궐 등)에서도 포탄이 보이도록 깔아 두는 어두운 그늘 */
  shade: Phaser.GameObjects.Image;
  trail: Phaser.GameObjects.Particles.ParticleEmitter;
  look: string;
  seen: boolean;
}

let uid = 0;

/** 포탄·떨어지는 덩어리·낙석의 화면 표현. 시뮬레이션 목록과 id로 맞춘다. */
export class BodiesView {
  proj = new Map<number, PView>();
  private chunks = new Map<number, { img: Phaser.GameObjects.Image; key: string; seen: boolean }>();
  private boulders = new Map<number, { img: Phaser.GameObjects.Image; seen: boolean }>();
  onProjectileGone: (id: number) => void = () => {};

  constructor(private scene: Phaser.Scene, private layer: Phaser.GameObjects.Layer, private painter: TerrainPainter, private quality: number) {}

  private trailFor(look: string, follow: Phaser.GameObjects.Image): Phaser.GameObjects.Particles.ParticleEmitter {
    const q = this.quality;
    let cfg: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig;
    let tex = 'smoke';
    switch (look) {
      case 'arrow':
        tex = 'glow';
        cfg = { lifespan: 220, scale: { start: 0.18, end: 0 }, alpha: { start: 0.7, end: 0 }, blendMode: 'ADD', tint: 0xcfe8ff, frequency: 12 / q };
        break;
      case 'fox':
        tex = 'glow';
        cfg = { lifespan: 520, speed: { min: 5, max: 30 }, scale: { start: 0.5, end: 0 }, alpha: { start: 0.9, end: 0 }, blendMode: 'ADD', tint: [0x7fd8ff, 0x4f8cff, 0xff7ad9], frequency: 14 / q };
        break;
      case 'goblinfire':
        tex = 'glow';
        cfg = { lifespan: 480, speed: { min: 5, max: 40 }, scale: { start: 0.45, end: 0 }, alpha: { start: 0.9, end: 0 }, blendMode: 'ADD', tint: [0x6dff9e, 0x2ee6a6, 0xd0ffd0], frequency: 14 / q };
        break;
      case 'paper':
        tex = 'dot';
        cfg = { lifespan: 600, speed: { min: 10, max: 40 }, scale: { start: 0.6, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', tint: [0xffd36a, 0xff5a5a], frequency: 22 / q };
        break;
      case 'bomb':
        tex = 'dot';
        cfg = { lifespan: 420, speed: { min: 10, max: 60 }, scale: { start: 0.5, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', tint: [0x9cff6b, 0xe0ff9a], frequency: 24 / q };
        break;
      default:
        cfg = { lifespan: 900, speed: { min: 2, max: 16 }, scale: { start: 0.22, end: 0.7 }, alpha: { start: 0.5, end: 0 }, tint: [0xd8d0c8, 0xa89a90], frequency: 18 / q, gravityY: -14 };
    }
    const e = this.scene.add.particles(0, 0, tex, { ...cfg, follow });
    e.setDepth(29);
    this.layer.add(e);
    return e;
  }

  sync(b: Battle, t: number): void {
    // 포탄
    for (const v of this.proj.values()) v.seen = false;
    for (const p of b.projectiles) {
      let v = this.proj.get(p.id);
      const w = weapon(p.weaponId);
      const look = p.child === 'frag' ? 'ball' : w.look;
      if (!v) {
        const img = this.scene.add.image(p.x, p.y, `proj_${look}`).setDepth(31);
        if (p.child) img.setScale(look === 'ball' ? 0.45 : 0.7);
        const glow = this.scene.add.image(p.x, p.y, 'glow').setBlendMode(Phaser.BlendModes.ADD).setTint(w.glow).setScale(p.child ? 0.35 : 0.6).setAlpha(0.65).setDepth(30);
        const shade = this.scene.add.image(p.x, p.y, 'glow').setTint(0x0c1020).setScale(p.child ? 0.34 : 0.58).setAlpha(0.62).setDepth(29);
        this.layer.add([shade, glow, img]);
        v = { img, glow, shade, trail: this.trailFor(look, img), look, seen: true };
        this.proj.set(p.id, v);
      }
      v.seen = true;
      v.img.setPosition(p.x, p.y);
      v.glow.setPosition(p.x, p.y);
      v.shade.setPosition(p.x, p.y);
      if (look === 'arrow' || look === 'iron') v.img.setRotation(Math.atan2(p.vy, p.vx));
      else if (look === 'paper') v.img.setRotation(t * 12);
      else if (look === 'bomb' || look === 'megabomb' || look === 'ball') v.img.rotation += 0.05;
      if (p.stuck) {
        // 심지가 타는 진천뢰: 빨갛게 깜빡
        const blink = Math.sin(t * (10 + (1.2 - p.fuse) * 30)) > 0;
        v.glow.setTint(blink ? 0xff3a2a : 0xffd166).setScale(0.9 + (1.2 - p.fuse) * 0.6);
      }
    }
    for (const [id, v] of this.proj) {
      if (v.seen) continue;
      v.img.destroy();
      v.glow.destroy();
      v.shade.destroy();
      v.trail.stop();
      this.scene.time.delayedCall(1200, () => v.trail.destroy());
      this.proj.delete(id);
      this.onProjectileGone(id);
    }

    // 떨어지는 덩어리
    for (const v of this.chunks.values()) v.seen = false;
    for (const c of b.chunks) {
      let v = this.chunks.get(c.id);
      if (!v) {
        const key = `chunk_${++uid}`;
        const img = this.painter.paintChunk(c.cells, c.mats, c.minX, c.minY, c.maxX, c.maxY);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')!.putImageData(img, 0, 0);
        this.scene.textures.addCanvas(key, canvas);
        const im = this.scene.add.image(c.minX * CELL, c.minY * CELL, key).setOrigin(0, 0).setDepth(12);
        this.layer.add(im);
        v = { img: im, key, seen: true };
        this.chunks.set(c.id, v);
      }
      v.seen = true;
      v.img.y = (c.minY + c.dRow) * CELL + Math.min(CELL, c.acc);
    }
    for (const [id, v] of this.chunks) {
      if (v.seen) continue;
      v.img.destroy();
      this.scene.textures.remove(v.key);
      this.chunks.delete(id);
    }

    // 낙석
    for (const v of this.boulders.values()) v.seen = false;
    for (const r of b.boulders) {
      let v = this.boulders.get(r.id);
      if (!v) {
        const img = this.scene.add.image(r.x, r.y, 'boulder').setDepth(14);
        this.layer.add(img);
        v = { img, seen: true };
        this.boulders.set(r.id, v);
      }
      v.seen = true;
      v.img.setPosition(r.x, r.y).setRotation(r.rot).setScale((r.r * 2) / 36);
    }
    for (const [id, v] of this.boulders) {
      if (v.seen) continue;
      v.img.destroy();
      this.boulders.delete(id);
    }
  }

  /** 지금 가장 눈여겨볼 포탄 */
  lead(b: Battle): { x: number; y: number; vx: number; vy: number } | null {
    let best = null as null | { x: number; y: number; vx: number; vy: number };
    let age = -1;
    for (const p of b.projectiles) {
      if (p.age > age) { age = p.age; best = p; }
    }
    return best;
  }

  destroy(): void {
    for (const v of this.proj.values()) { v.img.destroy(); v.glow.destroy(); v.shade.destroy(); v.trail.destroy(); }
    for (const v of this.chunks.values()) { v.img.destroy(); this.scene.textures.remove(v.key); }
    for (const v of this.boulders.values()) v.img.destroy();
    this.proj.clear();
    this.chunks.clear();
    this.boulders.clear();
  }
}
