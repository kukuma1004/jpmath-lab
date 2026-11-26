import Phaser from 'phaser';
import { CHAR_CENTER_Y, DT, VIEW_H, WORLD_H, WORLD_W } from '../config/constants';
import { Battle } from '../combat/battle';
import { AimAdvisor } from '../combat/aimAdvisor';
import { ShotReview } from '../combat/shotReview';
import type { BattleConfig, Projectile, SimEvent, WeaponSlot } from '../combat/types';
import { bodyArt } from '../art/artAssets';
import { AIActor, AIPlanner } from '../ai/ai';
import { mapDef } from '../data/maps';
import { weapon } from '../data/weapons';
import { TRAIT, character } from '../data/characters';
import { Mat } from '../terrain/terrain';
import { TerrainView } from '../render/terrainView';
import { BackgroundView } from '../render/backgroundView';
import { FighterView, PLAYER_COLORS } from '../render/fighterView';
import { BodiesView } from '../render/bodiesView';
import { Effects } from '../effects/effects';
import { input } from '../input/input';
import { audio } from '../audio/audio';
import { particleScale } from '../settings';
import type { App } from '../app';
import { playerLabel, type Mode } from '../ui/ui';

const DEG = Math.PI / 180;

export interface BattleData {
  cfg: BattleConfig;
  mode: Mode;
}

export class BattleScene extends Phaser.Scene {
  app!: App;
  battle!: Battle;
  mode: Mode = 'ai';
  /** 장수마다 붙는 이름(편 이름): AI 대전은 나/AI, 둘이서는 1P/2P */
  names: string[] = ['1P', '2P'];
  paused = false;
  timeScale = 1;
  private acc = 0;
  private bgCam!: Phaser.Cameras.Scene2D.Camera;
  private cam!: Phaser.Cameras.Scene2D.Camera;
  private bgLayer!: Phaser.GameObjects.Layer;
  private world!: Phaser.GameObjects.Layer;
  private bg!: BackgroundView;
  private terrainView!: TerrainView;
  private fighters: FighterView[] = [];
  private bodies!: BodiesView;
  effects!: Effects;
  private guide!: Phaser.GameObjects.Graphics;
  private bottomFx: Phaser.GameObjects.GameObject[] = [];
  private river: Phaser.GameObjects.Graphics | null = null;
  private actors: (AIActor | null)[] = [];
  private t = 0;
  // 카메라
  private camX = WORLD_W / 2;
  private camY = 760;
  private camZ = 0.6;
  private free = false;
  private camMode: 'auto' | 'enemy' | 'all' = 'auto';
  private followId: number | null = null;
  private followShot: Projectile | null = null;
  private ringOutLabel: Phaser.GameObjects.Text | null = null;
  private userZoom = 1;
  private lastPhase = '';
  private lastBlast = { x: WORLD_W / 2, y: 800 };
  private drag: { x: number; y: number; id: number } | null = null;
  private pinch: { d: number; z: number } | null = null;
  private resultTimer: Phaser.Time.TimerEvent | null = null;
  private rockSfxT = 0;
  private advisor = new AimAdvisor();
  private shotReview = new ShotReview();

  constructor() {
    super('battle');
  }

  init(data: BattleData): void {
    this.app = this.registry.get('app') as App;
    this.mode = data.mode;
    this.battle = new Battle(data.cfg);
    this.names = this.battle.fighters.map(f => playerLabel(data.mode, f.team, !!data.cfg.freeForAll));
    this.paused = false;
    this.acc = 0;
    this.t = 0;
    this.free = false;
    this.camMode = 'auto';
    this.lastPhase = '';
    this.followId = null;
    this.followShot = null;
    this.ringOutLabel = null;
    this.userZoom = 1;
    this.fighters = [];
    this.bottomFx = [];
    this.river = null;
    this.resultTimer = null;
    this.advisor.reset();
    this.shotReview.reset();
    this.actors = data.cfg.controllers.map((c, i) => (c === 'ai' ? new AIActor(i, data.cfg.difficulty) : null));
  }

  create(): void {
    const b = this.battle;
    const s = this.app.settings;
    const def = mapDef(b.cfg.mapId);
    const W = this.scale.width;

    // 카메라 둘: 아래는 배경(고정), 위는 월드(확대·이동)
    this.bgCam = this.cameras.main;
    this.bgCam.setBackgroundColor('#0d0a09');
    this.cam = this.cameras.add(0, 0, W, VIEW_H);
    this.bgLayer = this.add.layer();
    this.world = this.add.layer();
    this.cam.ignore(this.bgLayer);
    this.bgCam.ignore(this.world);

    this.bg = new BackgroundView(this, this.bgLayer, def.id, s.quality, W);
    this.makeBottom(def.id);
    if (def.ringOutY !== undefined) {
      const line = this.add.graphics().setDepth(8);
      line.lineStyle(2,0xffb589,0.5);
      for(let x=0;x<WORLD_W;x+=48) line.lineBetween(x,def.ringOutY,x+24,def.ringOutY);
      this.ringOutLabel = this.add.text(WORLD_W/2,def.ringOutY+12,'추락 시 탈락',{fontFamily:'sans-serif',fontSize:'18px',color:'#ffd1ac',stroke:'#302339',strokeThickness:5}).setOrigin(0.5,0).setDepth(8).setResolution(2);
      this.world.add([line,this.ringOutLabel]);
    }
    this.terrainView = new TerrainView(this, this.world, b.terrain, def, b.cfg.seed);
    this.bodies = new BodiesView(this, this.world, this.terrainView.painter, particleScale(s.quality));
    this.bodies.onProjectileGone = (id) => audio.whistleStop(id);
    this.effects = new Effects(this, this.world, def, particleScale(s.quality), s.shake, () => this.cam);
    this.guide = this.add.graphics().setDepth(25);
    this.world.add(this.guide);
    for (const f of b.fighters) this.fighters.push(new FighterView(this, this.world, f, this.names[f.idx]!));

    // 처음 카메라: 둘 다 보이게
    const ov = this.overview();
    this.camX = ov.x;
    this.camY = ov.y;
    this.camZ = ov.z;
    this.applyCamera();

    this.app.ui.showHud(b, this.names);
    input.active = true;
    input.reset();
    input.listeners = {
      weapon: (slot) => this.selectWeapon(slot),
      pause: () => this.app.pause(),
      camera: () => this.cycleCamera(),
      recenter: () => this.recenter(),
      zoom: (d) => { this.userZoom = Phaser.Math.Clamp(this.userZoom * (d > 0 ? 1.12 : 1 / 1.12), 0.6, 1.5); },
    };
    this.setupPointer();
    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', () => this.teardown());
    this.exposeQA();
  }

  private teardown(): void {
    this.scale.off('resize', this.onResize, this);
    input.active = false;
    input.reset();
    audio.stopAllWhistles();
    audio.charge(null);
    this.resultTimer?.remove();
    this.terrainView.destroy();
    this.bodies.destroy();
    this.bg.destroy();
    for (const f of this.fighters) f.destroy();
    this.fighters = [];
  }

  private onResize(size: Phaser.Structs.Size): void {
    this.bgCam.setSize(size.width, size.height);
    this.cam.setSize(size.width, size.height);
    this.bg.resize(size.width);
  }

  // ───────── 바닥(구름 바다·저승 강) ─────────

  private makeBottom(mapId: string): void {
    if (mapId === 'cloud') {
      for (let i = 0; i < 16; i++) {
        const img = this.add.image(i * 170 - 100, 1150 + (i % 3) * 26, 'puff').setScale(2.4 + (i % 2) * 0.6).setAlpha(0.95).setDepth(46);
        this.world.add(img);
        this.bottomFx.push(img);
      }
    } else if (mapId === 'underworld') {
      this.river = this.add.graphics().setDepth(46);
      this.world.add(this.river);
    } else if (mapId === 'quarry') {
      const gorge = this.add.graphics().setDepth(7);
      gorge.fillGradientStyle(0x182c40, 0x182c40, 0x182c40, 0x182c40, 0, 0, 0.92, 0.92);
      gorge.fillRect(0, 850, WORLD_W, 375);
      this.world.add(gorge);
    } else if (mapId === 'windrift') {
      const gorge = this.add.graphics().setDepth(7);
      const color = 0x102c3a;
      gorge.fillGradientStyle(color, color, color, color, 0, 0, 0.7, 0.7);
      gorge.fillRect(-400, 705, WORLD_W + 800, WORLD_H - 705);
      gorge.fillStyle(color, 0.7).fillRect(-400, WORLD_H, WORLD_W + 800, 600);
      this.world.add(gorge);
    }
  }

  private drawBottom(dt: number): void {
    if (this.bottomFx.length) {
      for (const [i, o] of this.bottomFx.entries()) {
        const img = o as Phaser.GameObjects.Image;
        img.x += dt * (8 + (i % 3) * 4);
        if (img.x > WORLD_W + 200) img.x = -200;
      }
    }
    if (this.river) {
      const g = this.river;
      g.clear();
      g.fillGradientStyle(0x1a1030, 0x1a1030, 0x05030a, 0x05030a, 0.92);
      g.fillRect(-400, 1140, WORLD_W + 800, 260);
      g.lineStyle(2, 0x8a6aff, 0.35);
      for (let k = 0; k < 6; k++) {
        const y = 1150 + k * 12;
        g.beginPath();
        for (let x = -400; x <= WORLD_W + 400; x += 40) {
          const yy = y + Math.sin(x * 0.01 + this.t * (1 + k * 0.3)) * 3;
          if (x === -400) g.moveTo(x, yy);
          else g.lineTo(x, yy);
        }
        g.strokePath();
      }
    }
  }

  // ───────── 카메라 ─────────

  private minZoom(): number {
    return this.scale.width / (WORLD_W + 240);
  }

  /** 살아 있는 장수가 모두 보이게 */
  private overview(): { x: number; y: number; z: number } {
    const live = this.battle.fighters.filter((f) => f.alive && f.y < WORLD_H);
    const fs = live.length ? live : this.battle.fighters;
    const x0 = Math.min(...fs.map((f) => f.x)), x1 = Math.max(...fs.map((f) => f.x));
    const y0 = Math.min(...fs.map((f) => f.y)), y1 = Math.max(...fs.map((f) => f.y));
    const map = this.battle.cfg.mapId;
    if (this.camMode === 'all' || map === 'windrift' || (map === 'quarry' && !this.battle.cfg.starterMatch)) {
      const ringOut = mapDef(map).ringOutY;
      const fieldBottom = Math.max(y1 + 85, ringOut ?? y1 + 180);
      const z = Math.min(this.scale.width / (WORLD_W + 48), VIEW_H / (fieldBottom - y0 + 230));
      return { x: WORLD_W / 2, y: (y0 + fieldBottom - 125) / 2, z };
    }
    const z = Phaser.Math.Clamp(Math.min(this.scale.width / (x1 - x0 + 430), VIEW_H / (y1 - y0 + 440)), this.minZoom(), 1);
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 - 80, z };
  }

  /** Tab: 따라가기 → 상대 보기 → 전체 보기 */
  cycleCamera(): void {
    const order: typeof this.camMode[] = ['auto', 'enemy', 'all'];
    this.camMode = order[(order.indexOf(this.camMode) + 1) % order.length]!;
    this.free = false;
    this.userZoom = 1;
    this.app.ui.toast(this.camMode === 'auto' ? '카메라: 따라가기' : this.camMode === 'enemy' ? '카메라: 상대 보기' : '카메라: 전체 보기');
  }

  toggleOverview(): void {
    if (!this.free && this.camMode === 'all') {
      this.recenter();
      return;
    }
    this.free = false;
    this.camMode = 'all';
    this.userZoom = 1;
  }

  /** C·「내 장수로」 단추: 둘러보기를 끝내고 지금 차례 장수를 따라간다 */
  recenter(): void {
    this.free = false;
    this.camMode = 'auto';
    this.userZoom = 1;
  }

  private trackProjectile(b: Battle): Projectile | null {
    const shots = b.projectiles;
    const following = shots.find(p => p.id === this.followId);
    if (following) return following;
    const main = shots.filter(p => p.child !== 'frag');
    const candidates = main.length ? main : shots;
    if (!candidates.length) return null;
    let next = candidates[Math.floor(candidates.length / 2)]!;
    if (this.followId !== null) {
      // When a shell bursts, keep following the nearest surviving part of the volley.
      const distance = (p: Projectile) => Math.hypot(p.x - this.camX, p.y - this.camY);
      for (const p of candidates) if (distance(p) < distance(next)) next = p;
    }
    this.followId = next.id;
    return next;
  }

  private target(): { x: number; y: number; z: number; k: number } {
    const b = this.battle;
    const f = b.cur;
    const mobile = this.scale.width < 1100;
    // 세로 휴대폰처럼 화면이 좁으면 더 가까이
    const narrow = this.scale.displaySize.width < 560;
    const portrait = this.app.portraitBattle;
    const displayScale = this.scale.displaySize.width / this.scale.width;
    const zBase = portrait ? Phaser.Math.Clamp(.49 / Math.max(.1, displayScale), 1.23, 1.4)
      : narrow ? 1.18 : mobile ? 1.0 : 1.12;
    const aimLead = Math.min(140, this.scale.width * .14);
    if (this.camMode === 'all' && b.phase !== 'GAME_OVER') return { ...this.overview(), k: 10 };
    if (this.camMode === 'enemy' && b.isPlayerPhase()) return { x: b.enemy.x, y: b.enemy.y - 90, z: zBase, k: 4 };
    if (!portrait && b.cfg.starterMatch && this.camMode === 'auto' && this.humanTurn() &&
        (b.phase === 'TURN_START' || b.isPlayerPhase())) return { ...this.overview(), k: 5 };
    switch (b.phase) {
      case 'BATTLE_START':
        return { ...this.overview(), k: 2 };
      case 'TURN_START':
        return { x: f.x + (f.angle <= 90 ? 1 : -1) * aimLead, y: f.y - 100, z: zBase, k: 3 };
      case 'AIM':
      case 'MOVE':
      case 'CHARGE':
        return { x: f.x + (f.angle <= 90 ? 1 : -1) * aimLead, y: f.y - 110, z: zBase, k: 4 };
      case 'PROJECTILE_FLIGHT': {
        const p = this.followShot;
        if (p) {
          const z = portrait ? 1.16 : 1.03;
          const leadX = Phaser.Math.Clamp(p.vx * .095, -aimLead, aimLead);
          const leadY = Phaser.Math.Clamp(p.vy * .07, -68, 68);
          return { x: p.x + leadX, y: p.y + leadY, z, k: 12 };
        }
        return { x: this.lastBlast.x, y: this.lastBlast.y - 65, z: zBase, k: 8 };
      }
      case 'EXPLOSION':
      case 'TERRAIN_COLLAPSE': {
        let sx = 0, sy = 0, n = 0;
        for (const r of b.boulders) { sx += r.x; sy += r.y; n++; }
        for (const c of b.chunks) { sx += ((c.minX + c.maxX) / 2) * 2; sy += (c.minY + c.dRow) * 2; n++; }
        if (n) return { x: this.lastBlast.x + Phaser.Math.Clamp((sx / n - this.lastBlast.x) * .25, -110, 110),
          y: this.lastBlast.y - 65 + Phaser.Math.Clamp((sy / n - this.lastBlast.y) * .25, -50, 75), z: portrait ? 1.07 : 0.95, k: 8 };
        return { x: this.lastBlast.x, y: this.lastBlast.y - 65, z: portrait ? 1.12 : 1.0, k: 8 };
      }
      case 'PHYSICS_SETTLING':
      case 'TURN_END': {
        const air = b.fighters.find((x) => !x.onGround && x.y < WORLD_H + 20);
        if (air) return { x: air.x, y: air.y - 60, z: 0.95, k: 5 };
        return { x: this.lastBlast.x, y: this.lastBlast.y - 60, z: 1.0, k: 2.5 };
      }
      case 'GAME_OVER': {
        const ws = b.fighters.filter(x => x.team === b.winner && x.alive);
        if (ws.length === 1) return { x: ws[0]!.x, y: ws[0]!.y - 70, z: 1.15, k: 2 };
        if (ws.length > 1) {
          const cx = ws.reduce((s, x) => s + x.x, 0) / ws.length, cy = ws.reduce((s, x) => s + x.y, 0) / ws.length;
          const spread = Math.max(...ws.map((x) => x.x)) - Math.min(...ws.map((x) => x.x));
          return { x: cx, y: cy - 70, z: Phaser.Math.Clamp(this.scale.width / (spread + 500), this.minZoom(), 1.15), k: 2 };
        }
        return { ...this.overview(), k: 2 };
      }
    }
    return { x: this.camX, y: this.camY, z: this.camZ, k: 3 };
  }

  private updateCamera(dt: number): void {
    const b = this.battle;
    this.followShot = null;
    if (b.phase !== this.lastPhase) {
      if (b.phase === 'TURN_START' || b.phase === 'PROJECTILE_FLIGHT') {
        this.free = false;
        this.followId = null;
        if (b.phase === 'TURN_START' && this.camMode === 'enemy') this.camMode = 'auto';
      }
      this.lastPhase = b.phase;
    }
    // 키보드 I/J/K/L로 둘러보기
    const pan = input.pan;
    if (input.active && (pan.x || pan.y)) {
      this.free = true;
      this.camX += (pan.x * 620 * dt) / this.camZ;
      this.camY += (pan.y * 620 * dt) / this.camZ;
    }
    this.app.ui.setCameraMode(this.camMode, this.free);
    if (!this.free) {
      if (b.phase === 'PROJECTILE_FLIGHT' && this.camMode !== 'all') this.followShot = this.trackProjectile(b);
      const t = this.target();
      const k = 1 - Math.exp(-dt * (b.phase === 'TURN_START' || b.isPlayerPhase() ? Math.max(8,t.k) : t.k));
      this.camX += (t.x - this.camX) * k;
      this.camY += (t.y - this.camY) * k;
      const z = Phaser.Math.Clamp(t.z * this.userZoom, this.minZoom(), 1.4);
      this.camZ += (z - this.camZ) * (1 - Math.exp(-dt * 6));
      if (this.followShot) {
        const xRoom = this.scale.width * .34 / this.camZ;
        const yRoom = VIEW_H * .33 / this.camZ;
        this.camX = Phaser.Math.Clamp(this.camX, this.followShot.x - xRoom, this.followShot.x + xRoom);
        this.camY = Phaser.Math.Clamp(this.camY, this.followShot.y - yRoom, this.followShot.y + yRoom);
      }
    }
    this.applyCamera();
  }

  private applyCamera(): void {
    const W = this.scale.width;
    const z = Phaser.Math.Clamp(this.camZ, this.minZoom(), 1.5);
    const hw = W / 2 / z, hh = VIEW_H / 2 / z;
    const x0 = -120 + hw, x1 = WORLD_W + 120 - hw;
    this.camX = x0 < x1 ? Phaser.Math.Clamp(this.camX, x0, x1) : WORLD_W / 2;
    const shot = this.followShot;
    const y0 = Math.min(-300, shot ? shot.y - hh : -300) + hh;
    const y1 = Math.max(WORLD_H + 60, shot ? shot.y + hh : WORLD_H + 60) - hh;
    if (y0 < y1) this.camY = Phaser.Math.Clamp(this.camY, y0, y1);
    this.cam.setZoom(z);
    this.cam.centerOn(this.camX, this.camY);
    const cssScale = this.scale.displaySize.width / W * z;
    if (cssScale > 0) {
      const markerScale = Phaser.Math.Clamp(.72 / cssScale, 1, 3.6);
      for (const fighter of this.fighters) fighter.setMarkerScale(markerScale);
      this.ringOutLabel?.setScale(Phaser.Math.Clamp(.55 / cssScale, 1, 4));
    }
  }

  private setupPointer(): void {
    this.input.addPointer(1);
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      audio.unlock();
      if (this.drag && this.drag.id !== p.id) {
        const p2 = this.input.manager.pointers.find((q) => q.isDown && q.id !== p.id);
        if (p2) this.pinch = { d: Phaser.Math.Distance.Between(p.x, p.y, p2.x, p2.y), z: this.userZoom };
        return;
      }
      this.drag = { x: p.x, y: p.y, id: p.id };
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.pinch) {
        const ps = this.input.manager.pointers.filter((q) => q.isDown);
        if (ps.length >= 2) {
          const d = Phaser.Math.Distance.Between(ps[0]!.x, ps[0]!.y, ps[1]!.x, ps[1]!.y);
          this.userZoom = Phaser.Math.Clamp(this.pinch.z * (d / this.pinch.d), 0.6, 1.5);
          this.camZ = Phaser.Math.Clamp(this.camZ * (d / this.pinch.d) ** 0.05, this.minZoom(), 1.5);
        }
        return;
      }
      if (!this.drag || this.drag.id !== p.id || !p.isDown) return;
      const dx = p.x - this.drag.x, dy = p.y - this.drag.y;
      if (!this.free && Math.hypot(dx, dy) < 8) return;
      this.free = true;
      this.camX -= dx / this.camZ;
      this.camY -= dy / this.camZ;
      this.drag.x = p.x;
      this.drag.y = p.y;
    });
    const up = (p: Phaser.Input.Pointer) => {
      if (this.drag?.id === p.id) this.drag = null;
      if (this.input.manager.pointers.filter((q) => q.isDown).length < 2) this.pinch = null;
    };
    this.input.on('pointerup', up);
    this.input.on('pointerupoutside', up);
    this.input.on('wheel', (_p: unknown, _o: unknown, _dx: number, dy: number) => {
      this.userZoom = Phaser.Math.Clamp(this.userZoom * (dy > 0 ? 1 / 1.1 : 1.1), 0.6, 1.5);
      if (this.free) this.camZ = Phaser.Math.Clamp(this.camZ * (dy > 0 ? 1 / 1.1 : 1.1), this.minZoom(), 1.5);
    });
  }

  // ───────── 입력 ─────────

  selectWeapon(slot: WeaponSlot): void {
    const b = this.battle;
    if (this.paused || this.actors[b.current] || !b.isPlayerPhase()) return;
    b.selectWeapon(slot);
  }

  flip(): void {
    const b = this.battle;
    if (this.actors[b.current] || !b.isPlayerPhase() || b.phase === 'CHARGE') return;
    b.setAngle(180 - b.cur.angle);
  }

  private humanTurn(): boolean {
    return !this.actors[this.battle.current];
  }

  private applyInputs(budget: { ms: number }): void {
    const b = this.battle;
    const actor = this.actors[b.current];
    for (const a of this.actors) if (a && a !== actor) a.update(b, 0);
    if (actor) {
      const t0 = performance.now();
      actor.update(b, Math.max(0.5, budget.ms));
      budget.ms -= performance.now() - t0;
      return;
    }
    if (!b.isPlayerPhase()) return;
    const f = b.cur;
    if (input.takeChargeCancellation()) b.cancelCharge();
    b.setMove(input.move);
    b.setAim(input.aimDir(f.angle <= 90 ? 1 : -1));
    b.setCharge(input.charge);
  }

  // ───────── 사건 → 화면·소리 ─────────

  private handle(events: SimEvent[]): void {
    const b = this.battle;
    const ui = this.app.ui;
    for (const e of events) {
      this.shotReview.record(b, e);
      switch (e.type) {
        case 'battleStart':
          ui.battleIntro(b, this.names, e.first);
          if (b.fighters.length > 2) {
            this.time.delayedCall(2700, () => ui.toast(b.cfg.freeForAll ? '개인전 · 마지막 한 명이 이겨요'
              : this.mode === 'ai' ? '2:2 · 내 편 장수 둘을 번갈아 조종해요' : '2:2 · 편마다 장수 둘이 번갈아 쏩니다'));
          }
          break;
        case 'turn': {
          input.newTurn();
          const w = e.wind === 0 ? '바람 잔잔' : `바람 ${e.wind > 0 ? '→' : '←'} ${Math.abs(e.wind)}`;
          const pf = b.fighters[e.player]!;
          const who = b.fighters.length > 2 ? `${this.names[e.player]} · ${character(pf.charId).name}` : this.names[e.player]!;
          if (e.turnNo > 1) ui.banner(`${who} 차례`, w, `p${pf.team + 1}`);
          audio.turn();
          if (e.wind !== e.prevWind && Math.abs(e.wind - e.prevWind) >= 3) audio.wind();
          break;
        }
        case 'fire': {
          const look = weapon(e.weaponId).look;
          this.effects.muzzle(e.x, e.y, e.angle, look);
          audio.fire(look);
          break;
        }
        case 'ultimate': {
          const w = weapon(e.weaponId);
          ui.banner(w.name, `${character(b.fighters[e.owner]!.charId).name}의 궁극기`, 'ultimate-banner');
          // Silhouettes stay distinct against both bright snow and dark forest arenas.
          const marks = this.add.graphics().setPosition(e.x, e.y).setDepth(26);
          marks.lineStyle(4, w.glow, 0.95);
          switch (e.weaponId) {
            case 'fullTide':
              for (const side of [-1, 1]) {
                for (const offset of [0, 15]) {
                  marks.beginPath().arc(side * (38 + offset), 8, 23, Math.PI, Math.PI * 1.95).strokePath();
                }
              }
              break;
            case 'whiteSky':
              for (const x of [-46, -23, 0, 23, 46]) {
                const y = -53 - (46 - Math.abs(x)) / 2;
                marks.fillStyle(w.glow, 0.9).fillTriangle(x - 4, y, x + 5, y, x - 2, y + 24);
              }
              break;
            case 'beaconRain':
              for (const lean of [-2, -1, 0, 1, 2]) {
                marks.lineBetween(lean * 10, -28, lean * 24, -65 + Math.abs(lean) * 5);
                marks.fillStyle(0xffe8a0).fillCircle(lean * 24, -65 + Math.abs(lean) * 5, 4);
              }
              break;
            case 'cliffBreak':
              for (const side of [-1, 1]) {
                marks.beginPath().moveTo(side * 12, 12).lineTo(side * 32, 1)
                  .lineTo(side * 40, 12).lineTo(side * 65, -3).strokePath();
              }
              break;
            case 'inkAmbush':
              for (const x of [-43, 0, 43]) {
                marks.fillStyle(0x24172f).fillCircle(x, -40, 10).strokeCircle(x, -40, 10);
                marks.fillStyle(0xf4dcff).fillTriangle(x - 6, -42, x + 6, -44, x - 1, -38);
              }
              break;
            case 'fanFestival':
              for (const radius of [28, 44, 60]) {
                marks.beginPath().arc(0, 16, radius, Math.PI * 1.1, Math.PI * 1.9).strokePath();
              }
              break;
          }
          this.tweens.add({targets: marks, y: e.y - 14, scale: 1.18, alpha: 0, delay: 180, duration: 450, onComplete: () => marks.destroy()});
          const seal = this.add.circle(e.x, e.y + 26, 36, w.glow, 0.10).setStrokeStyle(2, w.glow, 0.95).setDepth(25);
          this.tweens.add({targets: seal, scaleX: 2.6, scaleY: 2.6, alpha: 0, duration: 390, onComplete: () => seal.destroy()});
          audio.split();
          break;
        }
        case 'shadow': {
          const f = b.fighters[e.owner]!;
          const art = bodyArt(this.textures, f.charId);
          if (!art) break;
          const echo = this.add.image(e.x, e.y + CHAR_CENTER_Y, art.key)
            .setOrigin(art.originX, 1).setScale(art.scale * 1.05).setFlipX(e.facing < 0)
            .setTintFill(0x8e5acd).setAlpha(.65).setDepth(21);
          this.tweens.add({targets: echo, alpha: 0, y: echo.y - 14, duration: 420, onComplete: () => echo.destroy()});
          break;
        }
        case 'launch':
          audio.whistleStart(e.id);
          break;
        case 'explode': {
          this.lastBlast = { x: e.x, y: e.y };
          const m = b.terrain.matAt(e.x, e.y + e.radius * 0.8) || Mat.Dirt;
          const look = weapon(e.weaponId).look;
          this.effects.explosion(e.x, e.y, e.radius, look, e.big, m);
          if (look === 'fan') {
            const ring = this.add.ellipse(e.x, e.y, e.radius, e.radius * 0.42, 0x8ee2c2, 0.1)
              .setStrokeStyle(2, 0xffdf9a, 0.9).setDepth(28);
            this.tweens.add({ targets: ring, scaleX: 2, scaleY: 2, alpha: 0, duration: 330, onComplete: () => ring.destroy() });
          }
          audio.explode(e.radius);
          break;
        }
        case 'damage':
          this.effects.damage(e.x, e.y, e.amount, e.crit, e.cause);
          audio.hit();
          break;
        case 'drillBreak':
          this.effects.label(e.x, e.y - 36, e.kind === 'exit' ? '관통 폭발!' : '발판 절단!', '#ffdf91');
          break;
        case 'seekLock':
          this.effects.label(e.x, e.y - 64, '표적 포착!', '#ffdf91');
          break;
        case 'bounce':
          this.effects.bounce(e.x, e.y, weapon(e.weaponId).look);
          audio.bounce();
          break;
        case 'lightning':
          this.lastBlast = { x: e.x, y: Math.min(e.y, WORLD_H) };
          this.effects.lightning(e.x, Math.min(e.y, WORLD_H), this.cam.worldView.y - 40);
          audio.thunder();
          break;
        case 'split':
          this.effects.split(e.x, e.y);
          audio.split();
          break;
        case 'fuse':
          this.effects.fuse(e.x, e.y);
          audio.fuse();
          break;
        case 'debris':
          this.effects.debrisPuff(e.x, e.y, e.count, e.mat);
          break;
        case 'chunkLand':
          this.effects.chunkLand(e.x, e.y, e.size, e.speed);
          audio.rumble(e.size);
          break;
        case 'rockHit':
          this.effects.rockHit(e.x, e.y, e.speed);
          if (this.t - this.rockSfxT > 0.08) { audio.rock(e.speed); this.rockSfxT = this.t; }
          break;
        case 'land':
          this.effects.land(b.fighters[e.target]!.x, b.fighters[e.target]!.y, e.speed);
          audio.land(e.speed);
          break;
        case 'death': {
          const f = b.fighters[e.target]!;
          this.effects.soul(f.x, Math.min(f.y, WORLD_H));
          this.effects.label(f.x, Math.min(f.y, WORLD_H - 40) - 70, e.cause === 'fall' ? '낙사!' : '쓰러짐!', '#ffd0c0');
          break;
        }
        case 'timeout':
          ui.toast('시간이 다 됐어요. 차례를 넘깁니다');
          break;
        case 'heal':
          this.effects.heal(e.x, e.y, e.amount);
          break;
        case 'trait': {
          const text = e.kind === 'steady' ? '자리 잡은 포격!' : e.kind === 'eagle' ? '명중!' : e.kind === 'shove' ? '날려 버렸다!' : '철갑!';
          const color = e.kind === 'steady' ? '#ffd36a' : e.kind === 'eagle' ? '#9ad8ff' : e.kind === 'shove' ? '#a8ff8a' : '#d8dde6';
          this.effects.label(e.x, e.y, text, color);
          break;
        }
        case 'gameOver': {
          const w = e.winner;
          for (const f of b.fighters) if (f.team === w && f.alive) this.effects.confetti(f.x, f.y - 40);
          const iWon = this.mode === 'local' ? w !== -1 : w === 0;
          this.time.delayedCall(220, () => (iWon ? audio.victory() : audio.defeat()));
          this.resultTimer = this.time.delayedCall(900, () => this.app.ui.showResult(b, this.names));
          break;
        }
        default:
          break;
      }
    }
  }

  // ───────── 조준 안내·예상 궤적 ─────────

  private drawGuide(): void {
    const g = this.guide;
    g.clear();
    const b = this.battle;
    if (!b.isPlayerPhase()) return;
    const f = b.cur;
    if (!f.alive) return;
    const col = PLAYER_COLORS[f.team]!;
    const launchAngle = b.launchAngle(f);
    const a = launchAngle * DEG;
    const [mx, my] = b.muzzle(f, launchAngle);
    // 각도 호
    const fc = f.angle <= 90 ? 1 : -1;
    const cx = f.x, cy = f.y - 24;
    g.lineStyle(2, 0xffffff, 0.25);
    g.beginPath();
    const tilt = (f.angle - launchAngle) * DEG;
    g.arc(cx, cy, 46, (fc > 0 ? -Math.PI / 2 : Math.PI) + tilt, (fc > 0 ? 0 : -Math.PI / 2) + tilt, false);
    g.strokePath();
    g.lineStyle(3, col, 0.9);
    g.beginPath();
    g.moveTo(mx + Math.cos(a) * 6, my - Math.sin(a) * 6);
    g.lineTo(mx + Math.cos(a) * 34, my - Math.sin(a) * 34);
    g.strokePath();
    g.fillStyle(col, 1);
    g.fillCircle(mx + Math.cos(a) * 38, my - Math.sin(a) * 38, 3.5);
    // 예상 궤적(실제 물리와 같은 계산, 처음 1.1초)
    if (this.app.settings.trajectory && this.humanTurn()) {
      const power = b.phase === 'CHARGE' ? f.power : f.lastPower;
      const pts = b.previewPath(b.traitOf(f) === 'eagle' ? TRAIT.eaglePreview : 1.1, power);
      for (let i = 2; i < pts.length; i += 3) {
        const p = pts[i]!;
        const k = 1 - i / pts.length;
        g.fillStyle(0xffffff, 0.15 + k * 0.6);
        g.fillCircle(p.x, p.y, 1.6 + k * 1.8);
      }
    }
  }

  // ───────── 한 프레임 ─────────

  update(_time: number, delta: number): void {
    const dt = Math.min(0.1, delta / 1000); // 탭에서 돌아와도 폭주하지 않게
    const b = this.battle;
    this.t += dt;
    if (!this.paused) {
      const fastSettle = !b.projectiles.length && !b.scheduled.length &&
        (b.phase === 'EXPLOSION' || b.phase === 'TERRAIN_COLLAPSE' || b.phase === 'PHYSICS_SETTLING');
      const rate = this.timeScale * (fastSettle ? 2.4 : 1);
      this.acc += dt * rate;
      const maxSteps = Math.ceil(6 * rate);
      let n = 0;
      const budget = { ms: 7 };
      while (this.acc >= DT && n < maxSteps) {
        this.applyInputs(budget);
        b.step();
        this.acc -= DT;
        n++;
        if (fastSettle && (b.phase === 'TURN_START' || b.isPlayerPhase() || b.phase === 'GAME_OVER')) { this.acc = 0; break; }
      }
      if (n >= maxSteps) this.acc = 0;
    }
    this.handle(b.drainEvents());

    // 그리기
    this.terrainView.flush(this.app.settings.quality === 'low' ? 6 : 12);
    this.bodies.sync(b, this.t);
    for (const p of b.projectiles) audio.whistleUpdate(p.id, p.vy);
    const showArrow = b.isPlayerPhase() || b.phase === 'TURN_START';
    this.fighters.forEach((v, i) => v.update(b, dt, b.current === i, showArrow && b.current === i));
    this.drawGuide();
    this.drawBottom(dt);
    this.updateCamera(dt);
    const wv = this.cam.worldView;
    this.bg.update(wv.centerX, wv.centerY, this.camZ, dt);
    if (b.phase === 'CHARGE' && !this.paused) audio.charge(b.cur.power);
    else audio.charge(null);

    const actor = this.actors[b.current];
    const previousShot = !actor && b.isPlayerPhase() ? this.shotReview.summary(b) : '';
    const status = actor && b.isPlayerPhase()
      ? actor.stage === 'think' ? `${character(b.cur.charId).name} AI가 궁리하는 중…` : actor.stage === 'walk' ? '자리를 옮기는 중…' : '조준하는 중…'
      : b.phase === 'TERRAIN_COLLAPSE' ? '땅이 무너지는 중…'
      : !b.isPlayerPhase() && (b.shotDamage.get(b.shotNo) ?? 0) > 0 ? `이번 포격: 상대에게 합계 ${b.shotDamage.get(b.shotNo)} 피해`
      : b.clouds.some((c) => (c.turns[b.current] ?? 0) > 0 && b.inCloud(b.cur, c)) ? '독무 속! 다음 자기 차례가 오기 전에 구름 밖으로 움직이세요'
      : previousShot || (
        b.isPlayerPhase() && b.cur.charId === 'driller' && b.cur.slot === 1 ? '철편 세 발로 조준선과 양옆을 함께 맞힙니다 · 드러난 상대를 노리세요'
      : b.isPlayerPhase() && b.cfg.mapId === 'windrift' ? '협곡 너머로 장거리 포격 · 맞은편 발판을 끊으면 낙사'
      : b.isPlayerPhase() && b.cfg.mapId === 'bridge' ? '다리를 끊어 상대를 추락시키세요'
      : b.isPlayerPhase() && b.cfg.mapId === 'quarry' && b.cur.charId === 'driller' ? '발판 윗면에 맞혀 밑면까지 절단 · 상대 발밑과 지지점 사이를 노리세요'
      : b.isPlayerPhase() && b.cfg.mapId === 'quarry' && b.turnNo <= 2 ? '중앙 쪽으로 한 단씩 착지 · 마지막 단 밖은 추락'
      : b.isPlayerPhase() && b.cur.slot === 2 ? `${b.weaponOf(b.cur).name} · 스페이스바를 떼면 궁극기를 발사합니다`
      : b.isPlayerPhase() && b.cur.charId === 'mudang' && b.cur.slot === 0 ? '추적 부적탄 · 비행 중 가까운 적을 자동 추적'
      : b.isPlayerPhase() && b.cur.charId === 'driller' && b.cur.slot === 0 ? '엄폐 뒤 출구 폭발 · 벽을 관통해 뒤에 숨은 적을 노리세요'
      : b.isPlayerPhase() && b.steadyReady(b.cur) ? '자리 잡은 포격 — 움직이지 않고 쏘면 피해 +15%'
      : '');
    const aimHint=this.advisor.update(b,this.app.settings.aimHints&&this.humanTurn());
    this.app.ui.updateHud(b, { names: this.names, humanTurn: this.humanTurn(), status, aimHint });
  }

  // ───────── 시험용 손잡이(?qa=1) ─────────

  private exposeQA(): void {
    if (!new URLSearchParams(location.search).has('qa')) return;
    const scene = this;
    (window as unknown as { __wr: unknown }).__wr = {
      get battle() { return scene.battle; },
      get scene() { return scene; },
      state() {
        const b = scene.battle;
        return {
          phase: b.phase, current: b.current, turnNo: b.turnNo, wind: b.wind, winner: b.winner, endReason: b.endReason,
          hp: b.fighters.map((f) => f.hp), alive: b.fighters.map((f) => f.alive), shots: b.fighters.map((f) => f.stats.shots),
          x: b.fighters.map((f) => f.x), angle: b.fighters.map((f) => f.angle), power: b.cur.power, slot: b.cur.slot,
          mode: scene.mode, controllers: b.cfg.controllers, paused: scene.paused, projectiles: b.projectiles.length,
        };
      },
      speed(k: number) { scene.timeScale = k; },
      /** 숨은 창에서도 화면을 n프레임 돌린다(그리기 포함) */
      frames(n: number) {
        const g = scene.game;
        let t = performance.now();
        for (let i = 0; i < n; i++) { t += 1000 / 60; g.step(t, 1000 / 60); }
      },
      step(n: number) { for (let i = 0; i < n; i++) scene.battle.step(); },
      fire(angle: number, power: number, slot: WeaponSlot = 0) {
        const b = scene.battle;
        if (!b.isPlayerPhase()) return false;
        b.selectWeapon(slot);
        b.setAngle(angle);
        b.fireNow(power);
        return true;
      },
      aimFire(slot?: WeaponSlot) {
        const b = scene.battle;
        if (!b.isPlayerPhase()) return false;
        // 제자리에서 쏘는 계획만(보통 난이도는 움직이지 않는다), 오차 없이
        const plan = new AIPlanner(b, b.current, 'normal', slot === undefined ? undefined : [slot]).runToEnd();
        b.selectWeapon(plan.slot);
        b.setAngle(plan.exact.angle);
        b.fireNow(plan.exact.power);
        return true;
      },
      skip() { scene.battle.skipTurn(); },
      kill(i: number) { const f = scene.battle.fighters[i]!; scene.battle.applyDamage(f, f.hp, f.x, f.y, false, 'blast', -1); },
      setHp(i: number, hp: number) { scene.battle.fighters[i]!.hp = hp; },
      /** 카메라를 한 곳에 고정해 크게 본다(그림 확인용) */
      look(x: number, y: number, z = 1.5) { scene.free = true; scene.camX = x; scene.camY = y; scene.camZ = z; },
    };
  }
}
