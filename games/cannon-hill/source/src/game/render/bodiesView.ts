import Phaser from 'phaser';
import { CELL } from '../config/constants';
import type { Battle } from '../combat/battle';
import { weapon } from '../data/weapons';
import type { TerrainPainter } from './terrainPainter';

interface PView {
  img: Phaser.GameObjects.Image;
  glow: Phaser.GameObjects.Image;
  wake: Phaser.GameObjects.Image;
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
  private cloudFx: Phaser.GameObjects.Graphics;
  private cloudLabels = new Map<number, Phaser.GameObjects.Text>();
  onProjectileGone: (id: number) => void = () => {};

  constructor(private scene: Phaser.Scene, private layer: Phaser.GameObjects.Layer, private painter: TerrainPainter, private quality: number) {
    this.cloudFx = scene.add.graphics().setDepth(24);
    layer.add(this.cloudFx);
  }

  private trailFor(look: string, follow: Phaser.GameObjects.Image): Phaser.GameObjects.Particles.ParticleEmitter {
    const q = this.quality;
    let cfg: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig;
    let tex = 'smoke';
    switch (look) {
      case 'drill':
        tex = 'blast_cloud';
        cfg = { lifespan: 470, speed: { min: 12, max: 75 }, scale: { start: 0.12, end: 0.37 }, alpha: { start: 0.8, end: 0 }, tint: [0x73605b,0xac968a,0x665c60], frequency: 18 / q, gravityY: 75 };
        break;
      case 'poison':
        cfg = { lifespan: 650, speed: { min: 3, max: 22 }, scale: { start: 0.14, end: 0.5 }, alpha: { start: 0.5, end: 0 }, tint: [0x99d85a, 0x6f9746, 0xd0e395], frequency: 24 / q, gravityY: -18 };
        break;
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
        cfg = { lifespan: 760, speed: { min: 3, max: 19 }, scale: { start: 0.13, end: 0.66 }, alpha: { start: 0.7, end: 0 }, tint: [0xc79972, 0x9f7c70, 0x766570], frequency: 14 / q, gravityY: -22 };
    }
    const e = this.scene.add.particles(0, 0, tex, { ...cfg, follow });
    e.setDepth(29);
    this.layer.add(e);
    return e;
  }

  sync(b: Battle, t: number): void {
    this.cloudFx.clear();
    const seenClouds = new Set<number>();
    for (const c of b.clouds) {
      seenClouds.add(c.id);
      const r = c.radius, g = this.cloudFx;
      g.fillStyle(0x96c754, 0.12);g.fillEllipse(c.x,c.y,r*2,r*1.1);
      g.lineStyle(1.5,0xb5e277,0.55);g.strokeEllipse(c.x,c.y,r*2,r*1.1);
      const n = this.quality < 0.6 ? 5 : 10;
      for (let i=0;i<n;i++) {
        const u = i / (n-1), sway = Math.sin(t*1.3+i*2.1+c.id)*4;
        const x=c.x+(u-0.5)*r*1.65, y=c.y+Math.sin(i*2.6+t*0.7)*r*0.22;
        g.fillStyle(i%2 ? 0x77954e : 0xc0df79,0.12);
        g.fillEllipse(x+sway,y,r*(0.45+0.07*Math.sin(i+t)),r*0.45);
      }
      let label = this.cloudLabels.get(c.id);
      if (!label) {
        label=this.scene.add.text(c.x,c.y-r*0.63,`독무 · ${c.damage}/차례`,{fontFamily:'sans-serif',fontSize:'13px',fontStyle:'bold',color:'#d8f5b1',stroke:'#25321d',strokeThickness:4}).setOrigin(0.5).setDepth(28);
        this.layer.add(label);this.cloudLabels.set(c.id,label);
      }
    }
    for (const [id,label] of this.cloudLabels) if(!seenClouds.has(id)){label.destroy();this.cloudLabels.delete(id);}
    // 포탄
    for (const v of this.proj.values()) v.seen = false;
    for (const p of b.projectiles) {
      let v = this.proj.get(p.id);
      const w = weapon(p.weaponId);
      const look = p.child === 'frag' ? 'ball' : w.look;
      if (!v) {
        const img = this.scene.add.image(p.x, p.y, `proj_${look}`).setDepth(31);
        img.setScale((p.child ? look === 'ball' ? 0.45 : 0.7 : 1) * (w.renderScale ?? 1));
        const glow = this.scene.add.image(p.x, p.y, 'glow').setBlendMode(Phaser.BlendModes.ADD).setTint(w.glow).setScale(p.child ? 0.35 : 0.6).setAlpha(0.65).setDepth(30);
        const shade = this.scene.add.image(p.x, p.y, 'glow').setTint(0x0c1020).setScale(p.child ? 0.34 : 0.58).setAlpha(0.62).setDepth(29);
        const wake = this.scene.add.image(p.x,p.y,look === 'ball' || look === 'megabomb' ? 'cannon_wake' : 'ember_wake').setOrigin(1,0.5)
          .setTint(look === 'ball' || look === 'megabomb' ? 0xffffff : w.glow).setDepth(30)
          .setBlendMode(Phaser.BlendModes.ADD);
        this.layer.add([shade, glow, wake, img]);
        v = { img, glow, shade, wake, trail: this.trailFor(look, img), look, seen: true };
        this.proj.set(p.id, v);
      }
      v.seen = true;
      v.img.setPosition(p.x, p.y);
      v.glow.setPosition(p.x, p.y);
      v.shade.setPosition(p.x, p.y);
      const heading = Math.atan2(p.vy,p.vx);
      const speed = Math.hypot(p.vx,p.vy);
      const size = p.child ? 0.48 : 1;
      v.wake.setPosition(p.x,p.y).setRotation(heading).setVisible(!p.stuck && speed > 38)
        .setScale(size * Math.min(1.35, speed / 510), size * (look === 'arrow' ? 0.2 : 0.66 + 0.11*Math.sin(t*30)))
        .setAlpha(look === 'paper' ? 0.52 : 0.96);
      if (look === 'arrow' || look === 'iron' || look === 'rocket' || look === 'drill') v.img.setRotation(Math.atan2(p.vy, p.vx));
      else if (look === 'paper') v.img.setRotation((p.seekTarget ?? -1)>=0 ? heading+Math.PI/2 : t * 12);
      else if (look === 'bomb' || look === 'megabomb' || look === 'ball' || look === 'poison') v.img.setRotation(t * 3);
      if ((p.seekTarget ?? -1)>=0) {
        const target=b.fighters[p.seekTarget!]!;
        const x=target.x,y=target.y-30,g=this.cloudFx,r=28+Math.sin(t*9)*3;
        g.lineStyle(2,0xffdf79,0.85);
        for(const [dx,dy] of [[-1,-1],[1,-1],[-1,1],[1,1]]){
          g.beginPath();g.moveTo(x+dx*r,y+dy*(r-8));g.lineTo(x+dx*r,y+dy*r);g.lineTo(x+dx*(r-8),y+dy*r);g.strokePath();
        }
        g.lineStyle(1.5,0xffdf79,0.3);g.lineBetween(p.x,p.y,x,y);
        v.glow.setTint(0xffde76).setScale(0.8+0.12*Math.sin(t*18));
      }
      if (look === 'drill' && speed > 38 && !p.stuck) {
        // Short corkscrew shavings follow the bit along its actual direction of travel.
        const dx = Math.cos(heading), dy = Math.sin(heading);
        const length = Math.min(62, speed * .12);
        const g = this.cloudFx;
        for (let i = 0; i < 12; i++) {
          const u = i / 12, v = (i + 1) / 12;
          const a = Math.sin(t * 31 - u * 13) * (3 + u * 5);
          const b = Math.sin(t * 31 - v * 13) * (3 + v * 5);
          g.lineStyle(2.3 - u, i % 6 < 3 ? 0xffde96 : 0x9f7054, .92 - u * .72);
          g.lineBetween(p.x - dx * length * u - dy * a, p.y - dy * length * u + dx * a,
            p.x - dx * length * v - dy * b, p.y - dy * length * v + dx * b);
        }
      }
      if(p.drilling){
        const g=this.cloudFx;g.lineStyle(2,0xffc879,0.9);
        g.strokeEllipse(p.x,p.y,19+Math.sin(t*40)*4,19);
        v.glow.setScale(0.8).setTint(0xffc879);
      }
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
      v.shade.destroy(); v.wake.destroy();
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
    this.cloudFx.destroy();
    for (const label of this.cloudLabels.values()) label.destroy();
    this.cloudLabels.clear();
    for (const v of this.proj.values()) { v.img.destroy(); v.glow.destroy(); v.shade.destroy(); v.wake.destroy(); v.trail.destroy(); }
    for (const v of this.chunks.values()) { v.img.destroy(); this.scene.textures.remove(v.key); }
    for (const v of this.boulders.values()) v.img.destroy();
    this.proj.clear();
    this.chunks.clear();
    this.boulders.clear();
  }
}
