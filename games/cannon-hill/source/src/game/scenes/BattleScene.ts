import Phaser from 'phaser';
import { DT, VIEW_H, WORLD_H, WORLD_W } from '../config/constants';
import { Battle } from '../combat/battle';
import type { BattleConfig, SimEvent } from '../combat/types';
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
import type { Mode } from '../ui/ui';

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
  private camMode: 'auto' | 'self' | 'enemy' | 'all' = 'auto';
  private userZoom = 1;
  private lastPhase = '';
  private lastBlast = { x: WORLD_W / 2, y: 800 };
  private drag: { x: number; y: number; id: number } | null = null;
  private pinch: { d: number; z: number } | null = null;
  private resultTimer: Phaser.Time.TimerEvent | null = null;
  private rockSfxT = 0;

  constructor() {
    super('battle');
  }

  init(data: BattleData): void {
    this.app = this.registry.get('app') as App;
    this.mode = data.mode;
    this.battle = new Battle(data.cfg);
    const teamNames = data.mode === 'ai' ? ['나', 'AI'] : ['1P', '2P'];
    this.names = this.battle.fighters.map((f) => teamNames[f.team]!);
    this.paused = false;
    this.acc = 0;
    this.t = 0;
    this.free = false;
    this.camMode = 'auto';
    this.userZoom = 1;
    this.fighters = [];
    this.bottomFx = [];
    this.river = null;
    this.resultTimer = null;
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
    this.terrainView = new TerrainView(this, this.world, b.terrain, def, b.cfg.seed);
    this.bodies = new BodiesView(this, this.world, this.terrainView.painter, particleScale(s.quality));
    this.bodies.onProjectileGone = (id) => audio.whistleStop(id);
    this.effects = new Effects(this, this.world, def, particleScale(s.quality), s.shake, () => this.cam);
    this.guide = this.add.graphics().setDepth(25);
    this.world.add(this.guide);
    for (const f of b.fighters) this.fighters.push(new FighterView(this, this.world, f, this.names[f.idx]!));
    if (b.fighters.length > 2) this.app.ui.toast(this.mode === 'ai' ? '2:2 — 내 편 장수 둘을 번갈아 조종해요' : '2:2 — 편마다 장수 둘이 번갈아 쏩니다');

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
    return Math.max(0.42, this.scale.width / (WORLD_W + 240));
  }

  /** 살아 있는 장수가 모두 보이게 */
  private overview(): { x: number; y: number; z: number } {
    const live = this.battle.fighters.filter((f) => f.alive && f.y < WORLD_H);
    const fs = live.length ? live : this.battle.fighters;
    const x0 = Math.min(...fs.map((f) => f.x)), x1 = Math.max(...fs.map((f) => f.x));
    const y0 = Math.min(...fs.map((f) => f.y)), y1 = Math.max(...fs.map((f) => f.y));
    const dx = x1 - x0 + 560;
    const dy = y1 - y0 + 520;
    const z = Phaser.Math.Clamp(Math.min(this.scale.width / dx, VIEW_H / dy), this.minZoom(), 1);
    return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 - 80, z };
  }

  /** Tab·「보기」 단추: 따라가기 → 상대 보기 → 전체 보기 */
  cycleCamera(): void {
    const order: typeof this.camMode[] = ['auto', 'enemy', 'all'];
    this.camMode = order[(order.indexOf(this.camMode) + 1) % order.length]!;
    this.free = false;
    this.app.ui.toast(this.camMode === 'auto' ? '카메라: 따라가기' : this.camMode === 'enemy' ? '카메라: 상대 보기' : '카메라: 전체 보기');
  }

  /** C·「내 장수로」 단추: 둘러보기를 끝내고 지금 차례 장수를 따라간다 */
  recenter(): void {
    this.free = false;
    this.camMode = 'auto';
  }

  private target(): { x: number; y: number; z: number; k: number } {
    const b = this.battle;
    const f = b.cur;
    const mobile = this.scale.width < 1100;
    // 세로 휴대폰처럼 화면이 좁으면 더 가까이
    const narrow = this.scale.displaySize.width < 560;
    const zBase = narrow ? 1.25 : mobile ? 1.0 : 1.12;
    if (this.camMode === 'all') return { ...this.overview(), k: 4 };
    if (this.camMode === 'enemy' && b.isPlayerPhase()) return { x: b.enemy.x, y: b.enemy.y - 90, z: zBase, k: 4 };
    switch (b.phase) {
      case 'BATTLE_START':
        return { ...this.overview(), k: 2 };
      case 'TURN_START':
        return { x: f.x + (f.angle <= 90 ? 1 : -1) * 120, y: f.y - 100, z: zBase, k: 3 };
      case 'AIM':
      case 'MOVE':
      case 'CHARGE':
        return { x: f.x + (f.angle <= 90 ? 1 : -1) * 140, y: f.y - 110, z: zBase, k: 4 };
      case 'PROJECTILE_FLIGHT': {
        const p = this.bodies.lead(b);
        if (p) return { x: p.x + p.vx * 0.22, y: p.y + p.vy * 0.12, z: 0.95, k: 6 };
        return { x: this.lastBlast.x, y: this.lastBlast.y - 60, z: 1.0, k: 4 };
      }
      case 'EXPLOSION':
      case 'TERRAIN_COLLAPSE': {
        let sx = 0, sy = 0, n = 0;
        for (const r of b.boulders) { sx += r.x; sy += r.y; n++; }
        for (const c of b.chunks) { sx += ((c.minX + c.maxX) / 2) * 2; sy += (c.minY + c.dRow) * 2; n++; }
        if (n) return { x: (sx / n + this.lastBlast.x) / 2, y: (sy / n + this.lastBlast.y) / 2 - 40, z: 0.9, k: 3 };
        return { x: this.lastBlast.x, y: this.lastBlast.y - 60, z: 1.0, k: 3 };
      }
      case 'PHYSICS_SETTLING':
      case 'TURN_END': {
        const air = b.fighters.find((x) => !x.onGround && x.y < WORLD_H + 20);
        if (air) return { x: air.x, y: air.y - 60, z: 0.95, k: 5 };
        return { x: this.lastBlast.x, y: this.lastBlast.y - 60, z: 1.0, k: 2.5 };
      }
      case 'GAME_OVER': {
        const ws = b.winner === 0 || b.winner === 1 ? b.fighters.filter((x) => x.team === b.winner && x.alive) : [];
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
    if (b.phase !== this.lastPhase) {
      if (b.phase === 'TURN_START' || b.phase === 'PROJECTILE_FLIGHT') { this.free = false; if (b.phase === 'TURN_START') this.camMode = 'auto'; }
      this.lastPhase = b.phase;
    }
    // 키보드 I/J/K/L로 둘러보기
    const pan = input.pan;
    if (input.active && (pan.x || pan.y)) {
      this.free = true;
      this.camX += (pan.x * 620 * dt) / this.camZ;
      this.camY += (pan.y * 620 * dt) / this.camZ;
    }
    this.app.ui.setFreeCam(this.free);
    if (!this.free) {
      const t = this.target();
      const k = 1 - Math.exp(-dt * t.k);
      this.camX += (t.x - this.camX) * k;
      this.camY += (t.y - this.camY) * k;
      const z = Phaser.Math.Clamp(t.z * this.userZoom, this.minZoom(), 1.4);
      this.camZ += (z - this.camZ) * (1 - Math.exp(-dt * 2.5));
    }
    this.applyCamera();
  }

  private applyCamera(): void {
    const W = this.scale.width;
    const z = Phaser.Math.Clamp(this.camZ, this.minZoom(), 1.5);
    const hw = W / 2 / z, hh = VIEW_H / 2 / z;
    const x0 = -120 + hw, x1 = WORLD_W + 120 - hw;
    this.camX = x0 < x1 ? Phaser.Math.Clamp(this.camX, x0, x1) : WORLD_W / 2;
    const y0 = -300 + hh, y1 = WORLD_H + 60 - hh;
    this.camY = y0 < y1 ? Phaser.Math.Clamp(this.camY, y0, y1) : WORLD_H / 2;
    this.cam.setZoom(z);
    this.cam.centerOn(this.camX, this.camY);
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

  selectWeapon(slot: 0 | 1): void {
    const b = this.battle;
    if (this.actors[b.current] || !b.isPlayerPhase()) return;
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
    b.setMove(input.move);
    b.setAim(input.aimDir(f.angle <= 90 ? 1 : -1));
    b.setCharge(input.charge);
  }

  // ───────── 사건 → 화면·소리 ─────────

  private handle(events: SimEvent[]): void {
    const b = this.battle;
    const ui = this.app.ui;
    for (const e of events) {
      switch (e.type) {
        case 'battleStart':
          ui.banner('싸움 시작!', `${this.names[e.first]} 먼저 쏩니다`);
          this.time.delayedCall(2200, () => ui.toast('화면을 끌면 둘러볼 수 있어요 · 「보기」로 전체 보기'));
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
        case 'launch':
          audio.whistleStart(e.id);
          break;
        case 'explode': {
          this.lastBlast = { x: e.x, y: e.y };
          const m = b.terrain.matAt(e.x, e.y + e.radius * 0.8) || Mat.Dirt;
          this.effects.explosion(e.x, e.y, e.radius, weapon(e.weaponId).look, e.big, m);
          audio.explode(e.radius);
          break;
        }
        case 'damage':
          this.effects.damage(e.x, e.y, e.amount, e.crit, e.cause);
          audio.hit();
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
          if (w === 0 || w === 1) for (const f of b.fighters) if (f.team === w && f.alive) this.effects.confetti(f.x, f.y - 40);
          const iWon = this.mode === 'local' ? w !== -1 : w === 0;
          this.time.delayedCall(500, () => (iWon ? audio.victory() : audio.defeat()));
          this.resultTimer = this.time.delayedCall(1900, () => this.app.ui.showResult(b, this.names));
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
    const a = f.angle * DEG;
    const [mx, my] = b.muzzle(f);
    // 각도 호
    const fc = f.angle <= 90 ? 1 : -1;
    const cx = f.x, cy = f.y - 24;
    g.lineStyle(2, 0xffffff, 0.25);
    g.beginPath();
    g.arc(cx, cy, 46, fc > 0 ? -Math.PI / 2 : Math.PI, fc > 0 ? 0 : -Math.PI / 2, false);
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
      this.acc += dt * this.timeScale;
      const maxSteps = Math.ceil(6 * this.timeScale);
      let n = 0;
      const budget = { ms: 7 };
      while (this.acc >= DT && n < maxSteps) {
        this.applyInputs(budget);
        b.step();
        this.acc -= DT;
        n++;
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
    const status = actor && b.isPlayerPhase()
      ? actor.stage === 'think' ? `${character(b.cur.charId).name} AI가 궁리하는 중…` : actor.stage === 'walk' ? '자리를 옮기는 중…' : '조준하는 중…'
      : b.phase === 'TERRAIN_COLLAPSE' ? '땅이 무너지는 중…'
      : !b.isPlayerPhase() && (b.shotDamage.get(b.shotNo) ?? 0) > 0 ? `이번 포격: 상대에게 합계 ${b.shotDamage.get(b.shotNo)} 피해`
      : b.clouds.some((c) => (c.turns[b.current] ?? 0) > 0 && b.inCloud(b.cur, c)) ? '독무 속! 다음 자기 차례가 오기 전에 구름 밖으로 움직이세요'
      : b.isPlayerPhase() && b.steadyReady(b.cur) ? '자리 잡은 포격 — 움직이지 않고 쏘면 피해 +15%'
      : '';
    this.app.ui.updateHud(b, { names: this.names, humanTurn: this.humanTurn(), status });
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
      fire(angle: number, power: number, slot: 0 | 1 = 0) {
        const b = scene.battle;
        if (!b.isPlayerPhase()) return false;
        b.selectWeapon(slot);
        b.setAngle(angle);
        b.fireNow(power);
        return true;
      },
      aimFire(slot?: 0 | 1) {
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
