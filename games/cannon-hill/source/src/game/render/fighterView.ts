import Phaser from 'phaser';
import { BODY_BOX, PIVOT, WEAPON_BOX } from '../art/characters';
import { TEX } from '../art/textures';
import { bodyArt, weaponArt, type BodyArt, type WeaponArt } from '../art/artAssets';
import type { Battle } from '../combat/battle';
import type { Fighter } from '../combat/types';

const DEG = Math.PI / 180;
const FIGURE_SCALE = 1.19;
export const PLAYER_COLORS = [0x4f9cf0, 0xf05a4f, 0x61bb80, 0xc691ff];
const TAG_COLORS = ['#2f6ab8', '#b8382f', '#397652', '#7247a0'];

/** 캐릭터 한 명의 화면 표현. 상태(Idle·Aim·Charge·Fire·Hit·Fall·Victory·Defeat)는 시뮬레이션의 anim 값을 따른다. */
export class FighterView {
  c: Phaser.GameObjects.Container;
  private rig: Phaser.GameObjects.Container;
  private body: Phaser.GameObjects.Image;
  private wpn: Phaser.GameObjects.Image;
  private shadow: Phaser.GameObjects.Ellipse;
  private aura: Phaser.GameObjects.Image;
  private tag: Phaser.GameObjects.Text;
  private hpBg: Phaser.GameObjects.Rectangle;
  private hpFill: Phaser.GameObjects.Rectangle;
  private arrow: Phaser.GameObjects.Image;
  private stars: Phaser.GameObjects.Image[] = [];
  private facing: 1 | -1;
  private t = Math.random() * 10;
  private flash = 0;
  private stride = 0;
  private stepOffset = 0;
  private stepDust: Phaser.GameObjects.Particles.ParticleEmitter;
  private lastHp: number;
  /** 그려 받은 그림이 있으면 그것을, 없으면 코드로 그린 임시 그림을 쓴다 */
  private art: BodyArt | null;
  private wart: WeaponArt | null;

  constructor(scene: Phaser.Scene, layer: Phaser.GameObjects.Layer, private f: Fighter, label: string) {
    this.facing = f.angle <= 90 ? 1 : -1;
    this.lastHp = f.hp;
    const id = f.charId;
    this.c = scene.add.container(f.x, f.y).setDepth(20);
    this.shadow = scene.add.ellipse(3, 1, 34, 7, 0x18212d, 0.56);
    this.rig = scene.add.container(0, 0);
    this.aura = scene.add.image(0, -22, 'glow').setBlendMode(Phaser.BlendModes.ADD).setAlpha(0).setTint(PLAYER_COLORS[f.team]!);
    this.art = bodyArt(scene.textures, id);
    this.wart = weaponArt(scene.textures, id);
    this.body = this.art
      ? scene.add.image(0, 0, this.art.key).setOrigin(this.art.originX, 1).setScale(this.art.scale)
      : scene.add.image(0, 0, `char_${id}_normal`).setOrigin(BODY_BOX.footX / BODY_BOX.w, BODY_BOX.footY / BODY_BOX.h).setScale(1 / TEX);
    this.wpn = this.wart
      ? scene.add.image(0, 0, this.wart.key).setOrigin(this.wart.originX, this.wart.originY).setScale(this.wart.scale)
      : scene.add.image(0, 0, `wpn_${id}`).setOrigin(WEAPON_BOX.pivotX / WEAPON_BOX.w, WEAPON_BOX.pivotY / WEAPON_BOX.h).setScale(1 / TEX);
    if (this.art) this.shadow.setSize(Math.max(30, this.art.width * 0.72), 7);
    this.rig.add([this.aura, this.body, this.wpn]);
    this.tag = scene.add.text(0, -70, label, { fontFamily: 'Black Han Sans, sans-serif', fontSize: '13px', color: '#ffffff', backgroundColor: TAG_COLORS[f.team]!, padding: { x: 5, y: 2 } }).setOrigin(0.5, 1).setResolution(2);
    this.hpBg = scene.add.rectangle(0, -64, 40, 5, 0x000000, 0.6).setOrigin(0.5, 0.5);
    this.hpFill = scene.add.rectangle(-20, -64, 40, 5, 0x6ad07a).setOrigin(0, 0.5);
    this.arrow = scene.add.image(0, -92, 'arrowhead').setScale(0.7).setTint(PLAYER_COLORS[f.team]!).setVisible(false);
    for (let i = 0; i < 3; i++) this.stars.push(scene.add.image(0, -50, 'star').setScale(0.4).setTint(0xffe08a).setVisible(false));
    const head = -(this.art ? this.body.displayHeight : 64) * FIGURE_SCALE;
    this.hpBg.setPosition(0, head - 4).setStrokeStyle(1.5, 0x3a3029);
    this.hpFill.y = head - 4;
    this.tag.y = head - 9;
    this.c.add([this.shadow, this.rig, this.tag, this.hpBg, this.hpFill, this.arrow, ...this.stars]);
    this.stepDust = scene.add.particles(0, 0, 'blast_cloud', {
      emitting: false, speed: { min: 9, max: 23 }, angle: { min: 220, max: 320 },
      lifespan: 320, scale: { start: .12, end: .27 }, alpha: { start: .72, end: 0 },
      tint: [0xe7ceb0, 0xbea88e], gravityY: -22,
    }).setDepth(19);
    layer.add([this.stepDust, this.c]);
  }

  update(b: Battle, dt: number, isCurrent: boolean, showArrow: boolean): void {
    const f = b.fighters[this.f.idx]!;
    this.f = f;
    this.t += dt;
    const t = this.t;
    if (f.alive) this.facing = f.angle <= 90 ? 1 : -1;
    const fc = this.facing;
    const travel = f.x - this.c.x;
    const groundRise = this.c.y - f.y;
    const walking = f.alive && f.onGround && isCurrent && b.isPlayerPhase() && Math.abs(travel) > .01;
    this.stepOffset *= Math.exp(-dt * 15);
    if (walking) {
      this.stepOffset = Phaser.Math.Clamp(this.stepOffset + groundRise * .65, -7, 6);
      const lastStep = Math.floor(this.stride / Math.PI);
      this.stride += Math.hypot(travel, Math.min(8, Math.abs(groundRise))) * Math.PI / 10;
      if (Math.floor(this.stride / Math.PI) !== lastStep)
        this.stepDust.explode(2, f.x - Math.sign(travel) * 9, f.y - 1);
    }
    this.c.setPosition(f.x, f.y);
    if (f.hp < this.lastHp) this.flash = 0.35;
    this.lastHp = f.hp;
    this.flash = Math.max(0, this.flash - dt);

    // 표정
    const mood = !f.alive || f.anim === 'hit' || f.anim === 'fall' ? 'hurt' : f.anim === 'victory' ? 'happy' : 'normal';
    if (this.art) {
      // 원점(발)을 기준으로 뒤집도록 flipX 대신 음수 배율을 쓴다
      this.body.setScale(fc * this.art.scale, this.art.scale);
    } else {
      const key = `char_${f.charId}_${mood}`;
      if (this.body.texture.key !== key) this.body.setTexture(key);
      this.body.setFlipX(fc < 0);
    }

    // 무기
    const pv = this.art ? { x: this.art.handX, y: this.art.handY } : PIVOT[f.charId]!;
    let recoil = 0;
    if (f.anim === 'fire') recoil = Math.max(0, 1 - f.animT / 0.25) * 6;
    const a = b.launchAngle(f) * DEG;
    this.wpn.setPosition(fc * pv.x - Math.cos(a) * recoil, pv.y + Math.sin(a) * recoil);
    if (this.wart) this.wpn.setScale(this.wart.scale, fc * this.wart.scale);
    else this.wpn.setFlipY(fc < 0);

    // 몸짓
    let bob = Math.sin(t * 2.6) * 1.1;
    let rot = 0;
    let sx = 1, sy = 1;
    let ox = 0;
    this.aura.setAlpha(0);
    switch (f.anim) {
      case 'charge': {
        const p = f.power / 100;
        ox = Math.sin(t * 60) * (0.4 + p * 1.2);
        sy = 1 - p * 0.06;
        sx = 1 + p * 0.04;
        this.aura.setAlpha(0.35 + p * 0.5).setScale(0.7 + p * 0.9 + Math.sin(t * 20) * 0.05);
        break;
      }
      case 'fire':
        sx = 1 + Math.max(0, 0.08 - f.animT * 0.3);
        ox = -fc * Math.max(0, 1 - f.animT / 0.2) * 3;
        break;
      case 'hit':
        rot = -fc * Math.sin(f.animT * 30) * 0.12 * Math.max(0, 1 - f.animT / 0.5);
        break;
      case 'fall':
        rot = Math.sin(t * 14) * 0.22;
        bob = 0;
        break;
      case 'victory':
        bob = -Math.abs(Math.sin(t * 5)) * 12;
        sy = 1 + Math.sin(t * 10) * 0.03;
        this.aura.setAlpha(0.35).setTint(0xffd36a).setScale(1.3 + Math.sin(t * 4) * 0.1);
        break;
      case 'defeat':
        rot = -fc * Math.min(1, f.animT * 3) * 1.45;
        bob = 0;
        break;
      default:
        break;
    }
    if (f.anim !== 'victory') this.aura.setTint(PLAYER_COLORS[f.team]!);
    // 화포장군이 자리를 잡고 있으면 둘레가 금빛으로 은은하게
    if (isCurrent && b.isPlayerPhase() && f.anim !== 'charge' && b.steadyReady(f)) {
      this.aura.setTint(0xffc94a).setAlpha(0.28 + Math.sin(t * 4) * 0.08).setScale(1.25);
    }
    const lean = f.onGround && f.alive ? f.slope * DEG * 0.55 : 0;
    if (walking) {
      const lift = Math.abs(Math.sin(this.stride));
      bob -= lift * (3.6 + Math.min(2, Math.abs(f.slope) * .055));
      rot += Math.sign(travel) * (.055 + Math.cos(this.stride) * .035);
      sy *= .95 + lift * .08;
      sx *= 1.04 - lift * .06;
    }
    if (f.onGround && f.alive) {
      bob += Math.min(0, this.stepOffset);
      sy *= 1 - Math.max(0, this.stepOffset) * .015;
      sx *= 1 + Math.max(0, this.stepOffset) * .009;
    }
    this.wpn.setRotation(-a - lean);
    this.rig.setPosition(ox, bob);
    this.rig.setRotation(rot + lean);
    this.rig.setScale(sx * FIGURE_SCALE, sy * FIGURE_SCALE);
    this.shadow.setVisible(f.onGround);
    this.shadow.setRotation(f.onGround ? f.slope * DEG : 0);
    this.shadow.setScale(1 - Math.min(0.4, Math.abs(bob) / 30), 1);

    // 맞으면 번쩍
    if (this.flash > 0) {
      const on = Math.floor(this.flash * 30) % 2 === 0;
      this.body.setTint(on ? 0xff6a6a : 0xffffff);
      this.wpn.setTint(on ? 0xff6a6a : 0xffffff);
    } else if (!f.alive) {
      this.body.setTint(0x8a8a96);
      this.wpn.setTint(0x8a8a96);
    } else {
      this.body.setTint(0xfff7e9, 0xfff6ea, 0xe4e2e3, 0xdbdfe8);
      this.wpn.setTint(0xfffaf0, 0xffffff, 0xece8e5, 0xd7dce3);
    }

    // 기절 별
    const dizzy = !f.alive && f.deathCause === 'hp';
    this.stars.forEach((s, i) => {
      s.setVisible(dizzy);
      if (dizzy) {
        const aa = t * 3 + (i * Math.PI * 2) / 3;
        s.setPosition(Math.cos(aa) * 14 - fc * 12, -22 + Math.sin(aa) * 4);
      }
    });

    // 이름표·체력
    const hpk = Math.max(0, f.hp / f.maxHp);
    this.hpFill.width = 40 * hpk;
    this.hpFill.fillColor = hpk > 0.5 ? 0x6ad07a : hpk > 0.25 ? 0xffb36a : 0xff6a5a;
    const show = f.alive;
    this.tag.setVisible(show);
    this.hpBg.setVisible(show);
    this.hpFill.setVisible(show);
    this.tag.setAlpha(isCurrent ? 1 : 0.8);
    this.arrow.setVisible(showArrow && f.alive);
    if (showArrow) this.arrow.y = this.tag.y - this.tag.displayHeight - 9 + Math.sin(t * 6) * 4;
  }

  setMarkerScale(scale: number): void {
    this.tag.setScale(scale);
    this.arrow.setScale(.7 * Math.sqrt(scale));
    this.hpBg.setScale(scale, Math.sqrt(scale));
    this.hpFill.setScale(scale, Math.sqrt(scale));
    this.hpFill.x = -20 * scale;
  }

  destroy(): void {
    this.stepDust.destroy();
    this.c.destroy(true);
  }
}
