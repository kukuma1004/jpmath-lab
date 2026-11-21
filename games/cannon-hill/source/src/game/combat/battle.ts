import {
  ANGLE_SPEED, CELL, CHARGE_TIME, CHAR_CENTER_Y, CHAR_RADIUS, COLS, DT, FALL_DAMAGE_MAX, FALL_DAMAGE_PER_SPEED,
  FLIGHT_LIMIT, GAUGE_MAX, GAUGE_PER_DAMAGE_DEALT, GAUGE_PER_DAMAGE_TAKEN, GAUGE_PER_TURN, GAUGE_START, GRAVITY,
  MAX_BOULDERS, MAX_CHUNKS, MAX_LAUNCH_SPEED, MIN_SETTLE_HOLD, MOVE_BUDGET, ROWS, SAFE_FALL_SPEED, SETTLE_LIMIT,
  STEP_DOWN, STEP_UP, WALK_SPEED, WIND_ACC_PER_UNIT, WORLD_H, WORLD_W,
} from '../config/constants';
import { CHARACTERS, character } from '../data/characters';
import { findSpawns, generateTerrain, mapDef } from '../data/maps';
import { WEAPONS, weapon, type WeaponDef } from '../data/weapons';
import { Mat, Terrain, type Component } from '../terrain/terrain';
import { Rng, clamp } from '../utils/rng';
import type {
  BattleConfig, Boulder, Chunk, DamageCause, Fighter, Phase, Projectile, Scheduled, SimEvent,
} from './types';

const DEG = Math.PI / 180;

export interface DryResult {
  damage: [number, number];
  impacts: { x: number; y: number }[];
  enemyGroundHit: number; // 상대 발밑을 얼마나 파는지(0..1 근사)
  outOfWorld: boolean;
  flightTime: number;
}

export function defaultConfig(partial: Partial<BattleConfig> = {}): BattleConfig {
  return {
    mapId: 'sanseong',
    seed: 12345,
    chars: ['general', 'archer'],
    controllers: ['human', 'human'],
    difficulty: 'normal',
    turnTime: 30,
    turnLimit: 30,
    ...partial,
  };
}

function newStats() {
  return { shots: 0, hits: 0, damageDealt: 0, damageTaken: 0, maxHit: 0, cellsDestroyed: 0 };
}

export class Battle {
  cfg: BattleConfig;
  terrain: Terrain;
  fighters: [Fighter, Fighter];
  projectiles: Projectile[] = [];
  boulders: Boulder[] = [];
  chunks: Chunk[] = [];
  scheduled: Scheduled[] = [];
  events: SimEvent[] = [];
  rng: Rng;
  time = 0;
  stepNo = 0;
  phase: Phase = 'BATTLE_START';
  phaseT = 0;
  current: 0 | 1 = 0;
  turnNo = 0;
  wind = 0;
  timeLeft = 0;
  winner: 0 | 1 | -1 | null = null;
  endReason: 'hp' | 'fall' | 'limit' | 'draw' | '' = '';
  /** 발사 뒤 흐른 시간과 마지막 폭발 시각 */
  shotT = 0;
  lastBlastT = -99;
  settleT = 0;
  forced = false;
  nextId = 1;
  shotNo = 0;
  shotDamage = new Map<number, number>();
  shotHit = new Set<number>();
  quiet = false;
  dry: DryResult | null = null;
  // 사람이 누르고 있는 입력
  input = { move: 0 as -1 | 0 | 1, aim: 0 as -1 | 0 | 1, charge: false };
  /** 재현용 명령 기록 */
  log: { s: number; c: string; a: number[] }[] = [];
  recording = true;

  constructor(cfg: BattleConfig, empty = false) {
    this.cfg = cfg;
    this.rng = new Rng(cfg.seed);
    if (empty) {
      this.terrain = new Terrain();
      this.fighters = [this.makeFighter(0, cfg.chars[0], 0), this.makeFighter(1, cfg.chars[1], 0)];
      return;
    }
    const def = mapDef(cfg.mapId);
    this.terrain = generateTerrain(def, cfg.seed);
    const [x1, x2] = findSpawns(this.terrain, def, this.rng);
    this.fighters = [this.makeFighter(0, cfg.chars[0], x1), this.makeFighter(1, cfg.chars[1], x2)];
    this.fighters[0].angle = 50;
    this.fighters[1].angle = 130;
    this.current = this.rng.next() < 0.5 ? 0 : 1;
    this.wind = Math.round(this.rng.gauss() * 6 * (0.5 + def.windBias));
    this.emit({ type: 'battleStart', first: this.current });
  }

  private makeFighter(idx: 0 | 1, charId: string, x: number): Fighter {
    const def = character(charId);
    const y = x > 0 ? this.terrain.topSurface(x) : 0;
    return {
      idx, charId, x, y: Math.max(0, y), vx: 0, vy: 0, onGround: true,
      angle: idx === 0 ? 50 : 130, power: 0, lastPower: 70, chargeDir: 1, slot: 0,
      hp: def.hp, maxHp: def.hp, gauge: GAUGE_START, moveLeft: MOVE_BUDGET * def.moveMul,
      alive: true, deathCause: '', anim: 'idle', animT: 0, slope: 0, airPeakY: y, stats: newStats(),
    };
  }

  emit(e: SimEvent): void {
    if (!this.quiet) this.events.push(e);
  }

  drainEvents(): SimEvent[] {
    const e = this.events;
    this.events = [];
    return e;
  }

  get cur(): Fighter {
    return this.fighters[this.current];
  }

  get enemy(): Fighter {
    return this.fighters[(1 - this.current) as 0 | 1];
  }

  weaponOf(f: Fighter, slot: 0 | 1 = f.slot): WeaponDef {
    const d = character(f.charId);
    return weapon(slot === 1 ? d.special : d.normal);
  }

  canSpecial(f: Fighter): boolean {
    return f.gauge >= GAUGE_MAX;
  }

  isPlayerPhase(): boolean {
    return this.phase === 'AIM' || this.phase === 'MOVE' || this.phase === 'CHARGE';
  }

  /** 발사 뒤 모든 물리가 멈췄는가 */
  isQuiet(): boolean {
    if (this.projectiles.length || this.scheduled.length || this.chunks.length || this.boulders.length) return false;
    for (const f of this.fighters) if (f.alive && !f.onGround) return false;
    return true;
  }

  // ───────── 명령(사람·AI·시험이 같은 경로를 쓴다) ─────────

  private rec(c: string, a: number[]): void {
    if (this.recording) this.log.push({ s: this.stepNo, c, a });
  }

  setMove(dir: -1 | 0 | 1): void {
    if (this.input.move !== dir) this.rec('move', [dir]);
    this.input.move = dir;
  }

  setAim(dir: -1 | 0 | 1): void {
    if (this.input.aim !== dir) this.rec('aim', [dir]);
    this.input.aim = dir;
  }

  setCharge(held: boolean): void {
    if (this.input.charge === held) return;
    this.rec('charge', [held ? 1 : 0]);
    this.input.charge = held;
    if (held && (this.phase === 'AIM' || this.phase === 'MOVE')) {
      this.phase = 'CHARGE';
      this.phaseT = 0;
      this.cur.power = 0;
      this.cur.chargeDir = 1;
      this.cur.anim = 'charge';
    } else if (!held && this.phase === 'CHARGE') {
      this.fire(this.cur.power);
    }
  }

  selectWeapon(slot: 0 | 1): void {
    if (!this.isPlayerPhase() || this.phase === 'CHARGE') return;
    if (slot === 1 && !this.canSpecial(this.cur)) return;
    this.rec('slot', [slot]);
    this.cur.slot = slot;
  }

  setAngle(abs: number): void {
    if (!this.isPlayerPhase()) return;
    this.rec('angle', [abs]);
    this.cur.angle = clamp(abs, 0, 180);
  }

  /** AI·시험용: 지정한 힘으로 바로 쏜다 */
  fireNow(power: number): void {
    if (!this.isPlayerPhase()) return;
    this.rec('fire', [power]);
    this.input.charge = false;
    this.fire(clamp(power, 0, 100));
  }

  /** 턴 넘기기(시간 초과와 같음) */
  skipTurn(): void {
    if (!this.isPlayerPhase()) return;
    this.rec('skip', []);
    this.input = { move: 0, aim: 0, charge: false };
    this.emit({ type: 'timeout', player: this.current });
    this.toTurnEnd();
  }

  applyCommand(c: string, a: number[]): void {
    const rec = this.recording;
    this.recording = false;
    switch (c) {
      case 'move': this.setMove(a[0] as -1 | 0 | 1); break;
      case 'aim': this.setAim(a[0] as -1 | 0 | 1); break;
      case 'charge': this.setCharge(a[0] === 1); break;
      case 'slot': this.selectWeapon(a[0] as 0 | 1); break;
      case 'angle': this.setAngle(a[0]!); break;
      case 'fire': this.fireNow(a[0]!); break;
      case 'skip': this.skipTurn(); break;
    }
    this.recording = rec;
    if (rec) this.log.push({ s: this.stepNo, c, a });
  }

  // ───────── 한 걸음(고정 시간 간격) ─────────

  step(): void {
    const dt = DT;
    this.time += dt;
    this.stepNo++;
    this.phaseT += dt;

    switch (this.phase) {
      case 'BATTLE_START':
        if (this.phaseT >= 1.4) this.startTurn(this.current, true);
        break;
      case 'TURN_START':
        if (this.phaseT >= 0.9) this.setPhase('AIM');
        break;
      case 'AIM':
      case 'MOVE':
      case 'CHARGE':
        this.playerStep(dt);
        break;
      case 'PROJECTILE_FLIGHT':
      case 'EXPLOSION':
      case 'TERRAIN_COLLAPSE':
      case 'PHYSICS_SETTLING':
        this.shotT += dt;
        break;
      case 'TURN_END':
        // 걷다 떨어지는 중이라면 내려앉을 때까지 기다린다(오래 걸리면 강제 정착)
        if (this.phaseT >= 0.6) {
          if (!this.isQuiet() && this.phaseT > SETTLE_LIMIT) this.forceStabilize();
          if (this.isQuiet() || this.phaseT > SETTLE_LIMIT) this.resolveTurnEnd();
        }
        break;
      case 'GAME_OVER':
        break;
    }

    this.stepScheduled();
    this.stepProjectiles(dt);
    this.stepChunks(dt);
    this.stepBoulders(dt);
    for (const f of this.fighters) this.stepFighterPhysics(f, dt);
    this.runStability();
    for (const f of this.fighters) {
      f.animT += dt;
      if ((f.anim === 'fire' && f.animT > 0.45) || (f.anim === 'hit' && f.animT > 0.5)) this.setAnim(f, 'idle');
    }

    if (this.phase === 'PROJECTILE_FLIGHT' || this.phase === 'EXPLOSION' || this.phase === 'TERRAIN_COLLAPSE' || this.phase === 'PHYSICS_SETTLING') {
      this.updateAfterShotPhase(dt);
    }
  }

  setPhase(p: Phase): void {
    if (this.phase === p) return;
    this.phase = p;
    this.phaseT = 0;
  }

  private setAnim(f: Fighter, a: Fighter['anim']): void {
    if (f.anim === a) return;
    if (!f.alive && a !== 'defeat' && a !== 'fall') return;
    f.anim = a;
    f.animT = 0;
  }

  private startTurn(player: 0 | 1, first = false): void {
    this.current = player;
    if (!first) this.turnNo++;
    else this.turnNo = 1;
    const f = this.cur;
    f.moveLeft = MOVE_BUDGET * character(f.charId).moveMul;
    f.gauge = Math.min(GAUGE_MAX, f.gauge + (first ? 0 : GAUGE_PER_TURN));
    if (f.slot === 1 && !this.canSpecial(f)) f.slot = 0;
    f.power = 0;
    this.timeLeft = this.cfg.turnTime;
    const prevWind = this.wind;
    if (!first) {
      const def = mapDef(this.cfg.mapId);
      const target = this.rng.gauss() * 10 * (0.55 + def.windBias * 0.6);
      this.wind = Math.round(clamp(prevWind * 0.35 + target * 0.65, -10, 10));
    }
    this.input = { move: 0, aim: 0, charge: false };
    this.setPhase('TURN_START');
    this.emit({ type: 'turn', player, turnNo: this.turnNo, wind: this.wind, prevWind });
  }

  private playerStep(dt: number): void {
    const f = this.cur;
    if (!f.alive) {
      this.toTurnEnd();
      return;
    }
    this.timeLeft -= dt;
    if (this.phase === 'CHARGE') {
      f.power += (f.chargeDir * 100 * dt) / CHARGE_TIME;
      if (f.power >= 100) { f.power = 100; f.chargeDir = -1; }
      if (f.power <= 0) { f.power = 0; f.chargeDir = 1; }
      if (this.timeLeft <= 0) this.fire(f.power);
      return;
    }
    // 조준
    if (this.input.aim !== 0) {
      f.angle = clamp(f.angle + this.input.aim * ANGLE_SPEED * dt, 0, 180);
      this.setAnim(f, 'aim');
    }
    // 이동
    if (this.input.move !== 0 && f.onGround && f.moveLeft > 0) {
      const dir = this.input.move;
      const facing = f.angle <= 90 ? 1 : -1;
      if (facing !== dir) f.angle = 180 - f.angle;
      const moved = this.walk(f, dir * Math.min(WALK_SPEED * dt, f.moveLeft));
      f.moveLeft = Math.max(0, f.moveLeft - Math.abs(moved));
      this.setPhase('MOVE');
    } else if (this.phase === 'MOVE') {
      this.setPhase('AIM');
    }
    if (this.timeLeft <= 0) {
      this.emit({ type: 'timeout', player: this.current });
      this.toTurnEnd();
    }
  }

  /** 땅을 따라 걷는다. 실제로 움직인 거리를 돌려준다. */
  walk(f: Fighter, dx: number): number {
    const t = this.terrain;
    const dir = Math.sign(dx);
    let remain = Math.abs(dx);
    let moved = 0;
    while (remain > 0) {
      const s = Math.min(1, remain);
      const nx = clamp(f.x + dir * s, 10, WORLD_W - 10);
      if (nx === f.x) break;
      let ny = f.y;
      if (t.solidAt(nx, f.y - 1)) {
        // 오르막: 이번 걸음으로 오를 수 있는 높이에는 기울기 한계가 있다
        const maxUp = Math.min(STEP_UP, Math.ceil(s * 2.2) + 1);
        let ok = false;
        for (let up = 1; up <= maxUp; up++) {
          if (!t.solidAt(nx, f.y - 1 - up)) { ny = f.y - up; ok = true; break; }
        }
        if (!ok) break;
      } else {
        let found = false;
        for (let down = 0; down <= STEP_DOWN; down++) {
          if (t.solidAt(nx, f.y + down)) { ny = f.y + down; found = true; break; }
        }
        if (!found) {
          // 낭떠러지: 걸어 나가 떨어진다
          f.x = nx;
          f.onGround = false;
          f.airPeakY = f.y;
          moved += s;
          break;
        }
      }
      // 머리가 막히면 못 간다
      if (t.solidAt(nx, ny - 36) || t.solidAt(nx, ny - 20)) break;
      f.x = nx;
      f.y = ny;
      moved += s;
      remain -= s;
    }
    return moved;
  }

  private fire(power: number): void {
    const f = this.cur;
    let slot = f.slot;
    if (slot === 1 && !this.canSpecial(f)) slot = 0;
    const w = this.weaponOf(f, slot);
    if (slot === 1) f.gauge -= GAUGE_MAX;
    f.slot = 0;
    f.power = power;
    f.lastPower = power;
    this.input = { move: 0, aim: 0, charge: false };
    const shot = ++this.shotNo;
    f.stats.shots++;
    this.shotDamage.set(shot, 0);
    const [mx, my] = this.muzzle(f);
    this.emit({ type: 'fire', owner: f.idx, weaponId: w.id, x: mx, y: my, angle: f.angle, power });
    this.setAnim(f, 'fire');
    if (w.pattern === 'triple') {
      const n = w.count ?? 3;
      for (let i = 0; i < n; i++) this.spawnShot(f, w, f.angle + (i - (n - 1) / 2) * (w.spreadDeg ?? 3), power, shot);
    } else {
      this.spawnShot(f, w, f.angle, power, shot);
      if (w.pattern === 'salvo') {
        const n = w.count ?? 3;
        for (let i = 1; i < n; i++) {
          this.scheduled.push({
            t: this.time + i * (w.salvoGap ?? 0.3), kind: 'salvo', owner: f.idx, shot, weaponId: w.id, x: 0,
            angle: f.angle, power: clamp(power + (i % 2 === 1 ? 1 : -1) * Math.ceil(i / 2) * (w.salvoPowerStep ?? 3), 0, 100),
          });
        }
      }
    }
    this.shotT = 0;
    this.settleT = 0;
    this.forced = false;
    this.lastBlastT = -99;
    this.setPhase('PROJECTILE_FLIGHT');
  }

  muzzle(f: Fighter, angle = f.angle): [number, number] {
    const a = angle * DEG;
    return [f.x + Math.cos(a) * 26, f.y - CHAR_CENTER_Y - 4 - Math.sin(a) * 26];
  }

  private spawnShot(f: Fighter, w: WeaponDef, angle: number, power: number, shot: number): void {
    const [mx, my] = this.muzzle(f, angle);
    const sp = (power / 100) * MAX_LAUNCH_SPEED * w.speedMul;
    const a = angle * DEG;
    const p = this.newProjectile(f.idx, shot, w.id, mx, my, Math.cos(a) * sp, -Math.sin(a) * sp);
    this.projectiles.push(p);
    this.emit({ type: 'launch', id: p.id, weaponId: w.id });
  }

  newProjectile(owner: 0 | 1, shot: number, weaponId: string, x: number, y: number, vx: number, vy: number, child: Projectile['child'] = ''): Projectile {
    return {
      id: this.nextId++, owner, shot, weaponId, x, y, px: x, py: y, vx, vy, age: 0, bounces: 0, pierced: 0,
      carveAcc: 0, child, stuck: false, fuse: 0, split: false, dead: false,
    };
  }

  private stepScheduled(): void {
    if (!this.scheduled.length) return;
    const due = this.scheduled.filter((s) => s.t <= this.time + 1e-9);
    if (!due.length) return;
    this.scheduled = this.scheduled.filter((s) => s.t > this.time + 1e-9);
    for (const s of due) {
      const w = weapon(s.weaponId);
      if (s.kind === 'salvo') {
        const f = this.fighters[s.owner];
        if (f.alive) this.spawnShot(f, w, s.angle, s.power, s.shot);
      } else if (s.kind === 'strike') {
        this.lightningStrike(s.x, s.owner, s.shot, w);
      }
    }
  }

  // ───────── 포탄 ─────────

  private stepProjectiles(dt: number): void {
    if (!this.projectiles.length) return;
    for (const p of this.projectiles) {
      if (p.dead) continue;
      this.stepProjectile(p, dt);
    }
    this.projectiles = this.projectiles.filter((p) => !p.dead);
  }

  /** 포탄 한 걸음. 예상 궤적·AI·실전이 모두 이 함수를 쓴다. */
  stepProjectile(p: Projectile, dt: number): void {
    const w = weapon(p.weaponId);
    p.age += dt;
    if (p.age > FLIGHT_LIMIT) { p.dead = true; return; }
    if (p.stuck) {
      p.fuse -= dt;
      if (p.fuse <= 0) this.megaBlast(p, w);
      return;
    }
    if ((w.behavior === 'bounce' || w.behavior === 'bounceBurst') && w.fuse && p.age >= w.fuse && !p.child) {
      this.impact(p, w, p.x, p.y, -1, true);
      return;
    }
    if (w.behavior === 'split' && !p.child && !p.split && p.age > 0.2 && p.vy >= 0) {
      this.splitShot(p, w);
      return;
    }
    p.vx += this.wind * WIND_ACC_PER_UNIT * w.windMul * dt;
    p.vy += GRAVITY * w.gravityMul * dt;
    const dist = Math.hypot(p.vx, p.vy) * dt;
    const n = Math.max(1, Math.ceil(dist / 1.5));
    const sx = (p.vx * dt) / n;
    const sy = (p.vy * dt) / n;
    p.px = p.x;
    p.py = p.y;
    for (let i = 0; i < n; i++) {
      const ox = p.x, oy = p.y;
      p.x += sx;
      p.y += sy;
      if (p.x < -60 || p.x > WORLD_W + 60 || p.y > WORLD_H + 60) {
        p.dead = true;
        if (this.dry) this.dry.outOfWorld = true;
        return;
      }
      // 캐릭터 판정
      for (const f of this.fighters) {
        if (!f.alive) continue;
        if (f.idx === p.owner && p.age < 0.3 && !p.child) continue;
        const dx = p.x - f.x, dy = p.y - (f.y - CHAR_CENTER_Y);
        if (dx * dx + dy * dy < (CHAR_RADIUS + 3) * (CHAR_RADIUS + 3)) {
          this.impact(p, w, p.x, p.y, f.idx, false);
          return;
        }
      }
      if (p.y < 0) continue;
      const m = this.terrain.matAt(p.x, p.y);
      if (m === Mat.Empty) continue;
      if (w.behavior === 'pierce' && m !== Mat.Bedrock && m !== Mat.Core && p.pierced < (w.pierceDepth ?? 60)) {
        p.pierced += Math.hypot(sx, sy);
        p.carveAcc += Math.hypot(sx, sy);
        if (p.carveAcc >= 6) {
          p.carveAcc = 0;
          if (!this.dry) this.carve(p.x, p.y, 5, 1, p.owner);
        }
        p.vx *= 0.995;
        p.vy *= 0.995;
        if (p.pierced >= (w.pierceDepth ?? 60)) {
          this.impact(p, w, p.x, p.y, -1, false);
          return;
        }
        continue;
      }
      if ((w.behavior === 'bounce' || w.behavior === 'bounceBurst') && !p.child && p.bounces < (w.bounces ?? 0)) {
        p.x = ox;
        p.y = oy;
        this.bounce(p, w);
        return;
      }
      this.impact(p, w, p.x, p.y, -1, false);
      return;
    }
  }

  private bounce(p: Projectile, w: WeaponDef): void {
    const [nx, ny] = this.normalAt(p.x, p.y, p.vx, p.vy);
    const vn = p.vx * nx + p.vy * ny;
    const e = w.restitution ?? 0.5;
    p.vx = (p.vx - 2 * vn * nx) * e;
    p.vy = (p.vy - 2 * vn * ny) * e;
    // 너무 느려지면 살짝 띄운다
    if (Math.hypot(p.vx, p.vy) < 90) {
      p.vx += nx * 90;
      p.vy += ny * 90;
    }
    p.x += nx * 2;
    p.y += ny * 2;
    p.bounces++;
    this.emit({ type: 'bounce', x: p.x, y: p.y, weaponId: w.id });
    if (w.behavior === 'bounceBurst') {
      this.explode(p.x, p.y, w.burstRadius ?? 34, w.burstCarve ?? 28, w.rockMul, w.burstDamage ?? 50, w.directBonus, w.knockback * 0.6, p, -1, w.id, false);
    }
  }

  /** 지형 표면의 바깥쪽 법선 */
  normalAt(x: number, y: number, vx: number, vy: number): [number, number] {
    let nx = 0, ny = 0;
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      const dx = Math.cos(a), dy = Math.sin(a);
      if (this.terrain.solidAt(x + dx * 5, y + dy * 5)) {
        nx -= dx;
        ny -= dy;
      }
    }
    const l = Math.hypot(nx, ny);
    if (l < 1e-6) {
      const v = Math.hypot(vx, vy) || 1;
      return [-vx / v, -vy / v];
    }
    return [nx / l, ny / l];
  }

  private impact(p: Projectile, w: WeaponDef, x: number, y: number, target: number, timeout: boolean): void {
    if (p.child === 'split') {
      p.dead = true;
      this.explode(x, y, w.childRadius ?? 36, w.childCarve ?? 30, w.rockMul, w.childDamage ?? 60, w.directBonus, w.knockback * 0.6, p, target, w.id, false);
      return;
    }
    if (p.child === 'frag') {
      p.dead = true;
      this.explode(x, y, w.fragRadius ?? 20, w.fragCarve ?? 14, w.rockMul, w.fragDamage ?? 16, 1, w.knockback * 0.25, p, target, w.id, false);
      return;
    }
    switch (w.behavior) {
      case 'mega':
        if (target >= 0 || timeout) {
          p.x = x;
          p.y = y;
          this.megaBlast(p, w, target);
        } else {
          p.stuck = true;
          p.fuse = w.fuse ?? 1;
          p.x = x;
          p.y = y;
          this.emit({ type: 'fuse', x, y });
          if (this.dry) this.megaBlast(p, w);
        }
        return;
      case 'lightning': {
        p.dead = true;
        this.explode(x, y, w.radius, w.carve, w.rockMul, w.damage, w.directBonus, w.knockback, p, target, w.id, false);
        const n = w.strikes ?? 3;
        const sp = w.strikeSpacing ?? 60;
        const order = [0, -1, 1, -2, 2];
        for (let i = 0; i < n; i++) {
          const sx = x + order[i]! * sp;
          if (this.dry) this.lightningStrike(sx, p.owner, p.shot, w);
          else this.scheduled.push({ t: this.time + (w.strikeDelay ?? 0.4) + i * (w.strikeGap ?? 0.2), kind: 'strike', owner: p.owner, shot: p.shot, weaponId: w.id, x: sx, angle: 0, power: 0 });
        }
        return;
      }
      case 'bounceBurst':
      case 'bounce':
      case 'shell':
      case 'pierce':
      case 'split':
      default:
        p.dead = true;
        this.explode(x, y, w.radius, w.carve, w.rockMul, w.damage, w.directBonus, w.knockback, p, target, w.id, w.radius >= 60);
    }
  }

  private megaBlast(p: Projectile, w: WeaponDef, target = -1): void {
    p.dead = true;
    this.explode(p.x, p.y, w.radius, w.carve, w.rockMul, w.damage, w.directBonus, w.knockback, p, target, w.id, true);
    if (this.dry) return;
    const n = w.fragments ?? 0;
    for (let i = 0; i < n; i++) {
      const a = (-Math.PI * (0.12 + 0.76 * (i + this.rng.next() * 0.8) / n));
      const sp = this.rng.range(240, 420);
      const q = this.newProjectile(p.owner, p.shot, w.id, p.x, p.y - 6, Math.cos(a) * sp, Math.sin(a) * sp, 'frag');
      q.age = 0.3;
      this.projectiles.push(q);
    }
  }

  private splitShot(p: Projectile, w: WeaponDef): void {
    p.dead = true;
    p.split = true;
    const n = w.childCount ?? 5;
    const spread = w.childSpread ?? 70;
    this.emit({ type: 'split', x: p.x, y: p.y });
    for (let i = 0; i < n; i++) {
      const q = this.newProjectile(p.owner, p.shot, w.id, p.x, p.y, p.vx + (i - (n - 1) / 2) * spread, p.vy - 30, 'split');
      q.age = p.age;
      this.projectiles.push(q);
    }
  }

  private lightningStrike(x: number, owner: 0 | 1, shot: number, w: WeaponDef): void {
    // 하늘에서 수직으로: 가장 먼저 닿는 캐릭터나 지면
    let hitY = this.terrain.topSurface(x);
    if (hitY < 0) hitY = WORLD_H + 40;
    let target = -1;
    for (const f of this.fighters) {
      if (!f.alive) continue;
      if (Math.abs(f.x - x) <= CHAR_RADIUS + 4) {
        const cy = f.y - CHAR_CENTER_Y;
        if (cy < hitY) { hitY = cy; target = f.idx; }
      }
    }
    this.emit({ type: 'lightning', x, y: hitY });
    if (hitY > WORLD_H) return;
    const fake = this.newProjectile(owner, shot, w.id, x, hitY, 0, 0);
    this.explode(x, hitY, w.strikeRadius ?? 34, w.strikeCarve ?? 28, w.rockMul, w.strikeDamage ?? 80, w.directBonus, w.knockback * 0.5, fake, target, w.id, false);
  }

  // ───────── 폭발과 피해 ─────────

  blastDamageTo(f: Fighter, x: number, y: number, radius: number, damage: number, directBonus: number, direct: boolean): number {
    const cx = f.x, cy = f.y - CHAR_CENTER_Y;
    const d = direct ? 0 : Math.max(0, Math.hypot(cx - x, cy - y) - CHAR_RADIUS);
    if (d >= radius) return 0;
    const k = 1 - d / radius;
    let dmg = damage * Math.pow(k, 0.75);
    if (direct) dmg *= directBonus;
    dmg *= 1 - character(f.charId).defense;
    return Math.round(dmg);
  }

  private explode(
    x: number, y: number, radius: number, carve: number, rockMul: number, damage: number, directBonus: number,
    knockback: number, p: Projectile, target: number, weaponId: string, big: boolean,
  ): void {
    if (this.dry) {
      const r = this.dry;
      r.impacts.push({ x, y });
      for (const f of this.fighters) {
        if (!f.alive) continue;
        r.damage[f.idx] += this.blastDamageTo(f, x, y, radius, damage, directBonus, f.idx === target);
      }
      const e = this.fighters[(1 - p.owner) as 0 | 1];
      const dx = Math.abs(e.x - x), dy = Math.abs(e.y + 6 - y);
      if (dx < carve && dy < carve) r.enemyGroundHit = Math.max(r.enemyGroundHit, 1 - Math.hypot(dx, dy) / (carve * 1.4));
      return;
    }
    this.lastBlastT = this.time;
    this.emit({ type: 'explode', x, y, radius, weaponId, big });
    for (const f of this.fighters) {
      if (!f.alive) continue;
      const direct = f.idx === target;
      const dmg = this.blastDamageTo(f, x, y, radius, damage, directBonus, direct);
      if (dmg > 0) {
        this.applyDamage(f, dmg, x, y, direct && dmg >= 100, 'blast', p.owner, p.shot);
        // 밀려남
        const cx = f.x, cy = f.y - CHAR_CENTER_Y;
        const dist = Math.max(1, Math.hypot(cx - x, cy - y));
        const k = clamp(1 - Math.max(0, dist - CHAR_RADIUS) / radius, 0, 1);
        const imp = knockback * k;
        if (imp > 40) {
          const ux = (cx - x) / dist;
          f.vx += ux * imp * 0.55;
          f.vy -= imp * 0.55 + 40 * k;
          f.onGround = false;
          f.airPeakY = f.y;
        }
      }
    }
    // 사람을 직접 맞혔으면 구덩이는 그 발밑에 판다(땅을 무너뜨리는 재미가 줄지 않게)
    let kx = x, ky = y;
    if (target === 0 || target === 1) {
      const tf = this.fighters[target];
      kx = tf.x;
      ky = Math.max(y, tf.y - 8);
    }
    const removed = this.carve(kx, ky, carve, rockMul, p.owner);
    if (removed > 0) this.emit({ type: 'debris', x: kx, y: ky, count: Math.min(40, 6 + (removed >> 5)), mat: Mat.Dirt });
  }

  private carve(x: number, y: number, r: number, rockMul: number, owner: 0 | 1): number {
    const removed = this.terrain.carveCircle(x, y, r, rockMul);
    this.fighters[owner].stats.cellsDestroyed += removed;
    return removed;
  }

  applyDamage(f: Fighter, dmg: number, x: number, y: number, crit: boolean, cause: DamageCause, from: number, shot = 0): void {
    if (!f.alive || dmg <= 0) return;
    dmg = Math.round(dmg);
    this.emit({ type: 'damage', target: f.idx, amount: dmg, x, y, crit, cause });
    // 기록은 실제로 깎인 만큼만(넘친 피해는 빼고)
    dmg = Math.min(dmg, f.hp);
    f.hp = Math.max(0, f.hp - dmg);
    f.stats.damageTaken += dmg;
    f.gauge = Math.min(GAUGE_MAX, f.gauge + dmg * GAUGE_PER_DAMAGE_TAKEN);
    if (from === 0 || from === 1) {
      const src = this.fighters[from as 0 | 1];
      if (src.idx !== f.idx) {
        src.stats.damageDealt += dmg;
        src.gauge = Math.min(GAUGE_MAX, src.gauge + dmg * GAUGE_PER_DAMAGE_DEALT);
        if (shot) {
          const total = (this.shotDamage.get(shot) ?? 0) + dmg;
          this.shotDamage.set(shot, total);
          src.stats.maxHit = Math.max(src.stats.maxHit, total);
          if (!this.shotHit.has(shot)) {
            this.shotHit.add(shot);
            src.stats.hits++;
          }
        }
      }
    }
    this.setAnim(f, 'hit');
    if (f.hp <= 0) this.kill(f, 'hp');
  }

  /** 붕괴·낙석·낙하 피해를 누구 탓으로 셀지: 발사 뒤라면 그 턴에 쏜 쪽 */
  private envSource(): [number, number] {
    const after = this.phase === 'PROJECTILE_FLIGHT' || this.phase === 'EXPLOSION' || this.phase === 'TERRAIN_COLLAPSE' || this.phase === 'PHYSICS_SETTLING';
    return after ? [this.current, this.shotNo] : [-1, 0];
  }

  private kill(f: Fighter, cause: 'hp' | 'fall'): void {
    if (!f.alive) return;
    f.alive = false;
    f.hp = 0;
    f.deathCause = cause;
    f.anim = 'defeat';
    f.animT = 0;
    this.emit({ type: 'death', target: f.idx, cause });
  }

  // ───────── 지형 안정성 ─────────

  private runStability(): void {
    const t = this.terrain;
    if (!t.pending.length) return;
    const regions = t.pending;
    t.pending = [];
    const comps = t.extractUnsupported(regions);
    for (const c of comps) this.spawnFromComponent(c);
  }

  private spawnFromComponent(c: Component): void {
    const n = c.cells.length;
    const cx = ((c.minX + c.maxX + 1) / 2) * CELL;
    const cy = ((c.minY + c.maxY + 1) / 2) * CELL;
    const mainMat = c.hardCount * 2 >= n ? Mat.Rock : c.mats[0]!;
    if (n < 16) {
      this.emit({ type: 'debris', x: cx, y: cy, count: Math.max(2, n >> 1), mat: mainMat });
      return;
    }
    if (c.hardCount >= n * 0.45 && n <= 1100) {
      this.makeBoulders(c);
      return;
    }
    if (this.chunks.length >= MAX_CHUNKS) {
      this.emit({ type: 'debris', x: cx, y: cy, count: 30, mat: mainMat });
      return;
    }
    // 덩어리: 바로 아래가 비어 있는 셀을 미리 골라 둔다
    const w = c.maxX - c.minX + 1, h = c.maxY - c.minY + 1;
    const mask = new Uint8Array(w * h);
    for (let k = 0; k < n; k++) {
      const id = c.cells[k]!;
      mask[(((id / COLS) | 0) - c.minY) * w + (id % COLS) - c.minX] = 1;
    }
    const bottom: number[] = [];
    for (let k = 0; k < n; k++) {
      const id = c.cells[k]!;
      const lx = (id % COLS) - c.minX, ly = ((id / COLS) | 0) - c.minY;
      if (ly + 1 >= h || !mask[(ly + 1) * w + lx]) bottom.push(k);
    }
    const ch: Chunk = {
      id: this.nextId++, cells: c.cells, mats: c.mats, bottom: Int32Array.from(bottom),
      minX: c.minX, minY: c.minY, maxX: c.maxX, maxY: c.maxY, dRow: 0, acc: 0, vy: 0, hit: [false, false],
      hard: c.hardCount, dead: false,
    };
    this.chunks.push(ch);
    this.emit({ type: 'chunk', id: ch.id });
  }

  private makeBoulders(c: Component): void {
    const n = c.cells.length;
    const k = clamp(Math.round(n / 150), 1, 4);
    const order = Array.from(c.cells).sort((a, b) => (a % COLS) - (b % COLS));
    const per = Math.ceil(n / k);
    for (let g = 0; g < k; g++) {
      const part = order.slice(g * per, (g + 1) * per);
      if (!part.length) continue;
      if (this.boulders.length >= MAX_BOULDERS) {
        this.emit({ type: 'debris', x: (part[0]! % COLS) * CELL, y: ((part[0]! / COLS) | 0) * CELL, count: 16, mat: Mat.Rock });
        continue;
      }
      let sx = 0, sy = 0;
      for (const id of part) { sx += (id % COLS) + 0.5; sy += ((id / COLS) | 0) + 0.5; }
      const x = (sx / part.length) * CELL, y = (sy / part.length) * CELL;
      const r = clamp(Math.sqrt((part.length * CELL * CELL) / Math.PI) * 0.92, 5, 20);
      const b: Boulder = {
        id: this.nextId++, x, y, vx: this.rng.range(-30, 30), vy: 0, r, rot: this.rng.range(0, 6.28),
        restT: 0, age: 0, cool: [0, 0], dead: false,
      };
      this.boulders.push(b);
      this.emit({ type: 'boulder', id: b.id });
    }
  }

  // ───────── 떨어지는 덩어리 ─────────

  private stepChunks(dt: number): void {
    if (!this.chunks.length) return;
    const t = this.terrain;
    for (const ch of this.chunks) {
      if (ch.dead) continue;
      ch.vy = Math.min(900, ch.vy + GRAVITY * dt);
      ch.acc += ch.vy * dt;
      let landed = false;
      while (ch.acc >= CELL && !landed) {
        // 한 칸 내려갈 수 있는가
        for (let b = 0; b < ch.bottom.length; b++) {
          const id = ch.cells[ch.bottom[b]!]!;
          const cx = id % COLS;
          const cy = ((id / COLS) | 0) + ch.dRow + 1;
          if (cy >= ROWS) continue;
          if (cy >= 0 && t.cells[cy * COLS + cx] !== Mat.Empty) { landed = true; break; }
        }
        if (landed) break;
        ch.dRow++;
        ch.acc -= CELL;
        this.chunkCrush(ch);
        if (ch.minY + ch.dRow >= ROWS) { ch.dead = true; break; }
      }
      if (landed) {
        t.stamp(ch.cells, ch.mats, 0, ch.dRow);
        ch.dead = true;
        const x = ((ch.minX + ch.maxX + 1) / 2) * CELL;
        const y = (ch.maxY + ch.dRow + 1) * CELL;
        this.emit({ type: 'chunkLand', id: ch.id, x, y, speed: ch.vy, size: ch.cells.length });
        if (ch.vy > 360 && ch.hard > ch.cells.length * 0.35 && this.boulders.length < MAX_BOULDERS - 2) {
          for (let i = 0; i < 2; i++) {
            const bx = (ch.minX + this.rng.next() * (ch.maxX - ch.minX + 1)) * CELL;
            this.boulders.push({
              id: this.nextId++, x: bx, y: y - 10, vx: this.rng.range(-160, 160), vy: -this.rng.range(80, 180),
              r: this.rng.range(5, 8), rot: 0, restT: 0, age: 0, cool: [0, 0], dead: false,
            });
          }
        }
        // 덩어리 속에 파묻힌 캐릭터를 꺼낸다
        for (const f of this.fighters) if (f.alive) this.unstick(f);
      }
    }
    this.chunks = this.chunks.filter((c) => !c.dead);
  }

  private chunkCrush(ch: Chunk): void {
    for (const f of this.fighters) {
      if (!f.alive || ch.hit[f.idx]) continue;
      const x0 = ch.minX * CELL, x1 = (ch.maxX + 1) * CELL;
      if (f.x < x0 - 8 || f.x > x1 + 8) continue;
      // 덩어리 셀이 캐릭터 몸통 원 안에 들어왔는가
      const cx = f.x, cy = f.y - CHAR_CENTER_Y;
      for (let b = 0; b < ch.bottom.length; b++) {
        const id = ch.cells[ch.bottom[b]!]!;
        const px = ((id % COLS) + 0.5) * CELL;
        const py = (((id / COLS) | 0) + ch.dRow + 0.5) * CELL;
        if ((px - cx) ** 2 + (py - cy) ** 2 < (CHAR_RADIUS + 2) ** 2) {
          ch.hit[f.idx] = true;
          const dmg = Math.min(190, (ch.vy / 600) * (36 + Math.sqrt(ch.cells.length) * 3.2));
          if (dmg >= 4) this.applyDamage(f, dmg, cx, cy - 10, false, 'crush', ...this.envSource());
          break;
        }
      }
    }
  }

  // ───────── 낙석 ─────────

  private stepBoulders(dt: number): void {
    if (!this.boulders.length) return;
    const t = this.terrain;
    for (const b of this.boulders) {
      if (b.dead) continue;
      b.age += dt;
      b.cool[0] = Math.max(0, b.cool[0] - dt);
      b.cool[1] = Math.max(0, b.cool[1] - dt);
      b.vy += GRAVITY * dt;
      const sp = Math.hypot(b.vx, b.vy);
      const n = Math.max(1, Math.ceil((sp * dt) / Math.max(2, b.r * 0.5)));
      let contact = false;
      for (let i = 0; i < n; i++) {
        b.x += (b.vx * dt) / n;
        b.y += (b.vy * dt) / n;
        // 지형과의 충돌: 원 둘레 표본
        let nx = 0, ny = 0, hits = 0;
        for (let k = 0; k < 12; k++) {
          const a = (k / 12) * Math.PI * 2;
          const dx = Math.cos(a), dy = Math.sin(a);
          if (t.solidAt(b.x + dx * b.r, b.y + dy * b.r)) { nx -= dx; ny -= dy; hits++; }
        }
        if (hits) {
          contact = true;
          const l = Math.hypot(nx, ny) || 1;
          nx /= l; ny /= l;
          // 밖으로 밀어낸다
          for (let s = 0; s < b.r + 4; s++) {
            let any = false;
            for (let k = 0; k < 8; k++) {
              const a = (k / 8) * Math.PI * 2;
              if (t.solidAt(b.x + Math.cos(a) * b.r, b.y + Math.sin(a) * b.r)) { any = true; break; }
            }
            if (!any) break;
            b.x += nx;
            b.y += ny;
          }
          const vn = b.vx * nx + b.vy * ny;
          if (vn < 0) {
            const impactSp = -vn;
            b.vx -= 1.35 * vn * nx;
            b.vy -= 1.35 * vn * ny;
            // 굴러가는 마찰
            const tx = -ny, ty = nx;
            const vt = b.vx * tx + b.vy * ty;
            b.vx -= tx * vt * 0.08;
            b.vy -= ty * vt * 0.08;
            if (impactSp > 220) this.emit({ type: 'rockHit', x: b.x, y: b.y + b.r, speed: impactSp });
          }
        }
        // 캐릭터와 충돌
        for (const f of this.fighters) {
          if (!f.alive || b.cool[f.idx] > 0) continue;
          const cx = f.x, cy = f.y - CHAR_CENTER_Y;
          const dx = b.x - cx, dy = b.y - cy;
          const d = Math.hypot(dx, dy);
          if (d < b.r + CHAR_RADIUS) {
            const rel = Math.hypot(b.vx, b.vy);
            b.cool[f.idx] = 0.7;
            if (rel > 100) {
              const dmg = Math.min(150, (rel - 100) * 0.14 * Math.pow(b.r / 10, 1.5) + 10);
              this.applyDamage(f, dmg, cx, cy - 8, false, 'rock', ...this.envSource());
              this.emit({ type: 'rockHit', x: b.x, y: b.y, speed: rel });
            }
            const ux = dx / (d || 1), uy = dy / (d || 1);
            const vn = b.vx * ux + b.vy * uy;
            if (vn < 0) { b.vx -= 1.3 * vn * ux; b.vy -= 1.3 * vn * uy; }
          }
        }
      }
      b.rot += (b.vx * dt) / b.r;
      if (b.y > WORLD_H + 40 || b.x < -40 || b.x > WORLD_W + 40) { b.dead = true; continue; }
      if (contact && Math.hypot(b.vx, b.vy) < 34) {
        b.restT += dt;
        b.vx *= 0.8;
      } else b.restT = Math.max(0, b.restT - dt * 0.5);
      if (b.restT > 0.35 || b.age > 6.5) this.settleBoulder(b, b.age > 6.5);
    }
    this.boulders = this.boulders.filter((b) => !b.dead);
  }

  private settleBoulder(b: Boulder, forced: boolean): void {
    b.dead = true;
    if (b.y > WORLD_H || b.x < 0 || b.x > WORLD_W) return;
    // 땅에 닿아 있을 때만 바위로 남긴다(공중에서 강제로 멈춘 것은 지운다)
    const touching = this.terrain.solidAt(b.x, b.y + b.r + 2) || this.terrain.solidAt(b.x - b.r * 0.7, b.y + b.r * 0.7 + 2) || this.terrain.solidAt(b.x + b.r * 0.7, b.y + b.r * 0.7 + 2);
    // 공중에서 강제로 멈췄거나 캐릭터와 겹친 채라면 바위로 굳히지 않고 부순다
    const onFighter = this.fighters.some((f) => f.alive && Math.hypot(f.x - b.x, f.y - CHAR_CENTER_Y - b.y) < b.r + CHAR_RADIUS);
    if ((!touching && forced) || onFighter) {
      this.emit({ type: 'debris', x: b.x, y: b.y, count: 10, mat: Mat.Rock });
      return;
    }
    this.terrain.fillCircle(b.x, b.y, b.r * 0.92, Mat.Rock);
    for (const f of this.fighters) if (f.alive) this.unstick(f);
  }

  // ───────── 캐릭터 물리 ─────────

  /** 발밑 받침. 옆에 선 벽(발 위까지 막힌 기둥)은 받침으로 치지 않는다 */
  private hasSupport(f: Fighter): boolean {
    const t = this.terrain;
    for (const dx of [-6, 0, 6]) {
      const x = f.x + dx;
      if ((t.solidAt(x, f.y) || t.solidAt(x, f.y + 1)) && (dx === 0 || !t.solidAt(x, f.y - 4))) return true;
    }
    return false;
  }

  private bodyBlocked(x: number, y: number): boolean {
    const t = this.terrain;
    return t.solidAt(x, y - 6) || t.solidAt(x, y - 20) || t.solidAt(x, y - 34);
  }

  /** 지형 속에 끼면 위로 꺼낸다 */
  unstick(f: Fighter): void {
    const t = this.terrain;
    // 발·허리가 땅속에 묻혔을 때만 꺼낸다. 머리만 바위턱에 닿는 것은 그대로 둔다
    // (얇은 턱을 뚫고 올라갔다가 다시 떨어지기를 되풀이하지 않게).
    const fits = (x: number, y: number) => {
      for (let k = 1; k <= 18; k += 2) if (t.solidAt(x, y - k)) return false;
      return true;
    };
    if (fits(f.x, f.y)) return;
    // 1) 조금 위로
    for (let up = 1; up <= 14; up++) if (fits(f.x, f.y - up)) { f.y -= up; f.vy = Math.min(0, f.vy); return; }
    // 2) 옆으로(같은 높이 근처에 설 자리)
    for (let dx = 2; dx <= 70; dx += 2) {
      for (const sgn of [1, -1]) {
        const x = clamp(f.x + sgn * dx, 10, WORLD_W - 10);
        for (let dy = -14; dy <= 14; dy += 2) {
          const y = f.y + dy;
          if (fits(x, y) && t.solidAt(x, y + 1)) { f.x = x; f.y = y; f.vy = Math.min(0, f.vy); return; }
        }
      }
    }
    // 3) 위로 크게
    for (let up = 15; up < 320; up++) {
      if (fits(f.x, f.y - up)) { f.y -= up; f.vy = Math.min(0, f.vy); return; }
    }
    const top = t.topSurface(f.x);
    if (top >= 0) f.y = top;
  }

  stepFighterPhysics(f: Fighter, dt: number): void {
    if (f.y > WORLD_H + 30) {
      if (f.alive) this.kill(f, 'fall');
      f.onGround = false;
      return;
    }
    if (f.onGround) {
      if (!this.hasSupport(f)) {
        f.onGround = false;
        f.airPeakY = f.y;
        f.vy = Math.max(f.vy, 0);
      } else {
        // 기울기(화면용)
        const t = this.terrain;
        const yl = t.surfaceBelow(f.x - 9, f.y - 14, 40);
        const yr = t.surfaceBelow(f.x + 9, f.y - 14, 40);
        if (yl >= 0 && yr >= 0) f.slope = clamp(Math.atan2(yr - yl, 18) / DEG, -28, 28);
        return;
      }
    }
    // 공중
    f.vy = Math.min(1400, f.vy + GRAVITY * dt);
    f.vx *= 0.995;
    if (f.alive) this.setAnim(f, 'fall');
    // 가로 이동
    if (Math.abs(f.vx) > 0.5) {
      const nx = clamp(f.x + f.vx * dt, 10, WORLD_W - 10);
      if (this.bodyBlocked(nx, f.y)) f.vx = 0;
      else f.x = nx;
    }
    const dy = f.vy * dt;
    if (dy < 0) {
      if (this.terrain.solidAt(f.x, f.y - 38 + dy)) f.vy = 0;
      else f.y += dy;
      f.airPeakY = Math.min(f.airPeakY, f.y);
      return;
    }
    // 아래로: 칸 단위로 쓸어 내려가며 착지점을 찾는다
    const steps = Math.max(1, Math.ceil(dy / 1));
    const sdy = dy / steps;
    for (let i = 0; i < steps; i++) {
      const ny = f.y + sdy;
      let landY = -1;
      for (const dx of [-6, 0, 6]) {
        const x = f.x + dx;
        // 옆 벽(지금 발 높이보다 위까지 막힌 기둥)에는 내려앉지 않는다
        if (dx !== 0 && this.terrain.solidAt(x, f.y - 3)) continue;
        if (this.terrain.solidAt(x, ny)) {
          const s = this.terrain.surfaceBelow(x, f.y - 2, sdy + 4);
          const cand = s >= 0 ? s : Math.floor(ny);
          if (landY < 0 || cand < landY) landY = cand;
        }
      }
      if (landY >= 0) {
        f.y = landY;
        this.land(f);
        return;
      }
      f.y = ny;
    }
  }

  private land(f: Fighter): void {
    const speed = f.vy;
    f.onGround = true;
    f.vx = 0;
    f.vy = 0;
    this.unstick(f);
    if (!f.alive) return;
    this.emit({ type: 'land', target: f.idx, speed });
    if (speed > SAFE_FALL_SPEED) {
      const dmg = Math.min(FALL_DAMAGE_MAX, (speed - SAFE_FALL_SPEED) * FALL_DAMAGE_PER_SPEED);
      if (dmg >= 1) this.applyDamage(f, dmg, f.x, f.y - 10, false, 'fall', ...this.envSource());
    }
    if (f.alive && f.anim === 'fall') this.setAnim(f, 'idle');
  }

  // ───────── 발사 뒤 단계 판정과 강제 안정화 ─────────

  private updateAfterShotPhase(dt: number): void {
    if (this.projectiles.length || this.scheduled.length) {
      this.setPhase('PROJECTILE_FLIGHT');
      return;
    }
    this.settleT += dt;
    if (this.time - this.lastBlastT < 0.3) this.setPhase('EXPLOSION');
    else if (this.chunks.length || this.boulders.length) this.setPhase('TERRAIN_COLLAPSE');
    else this.setPhase('PHYSICS_SETTLING');
    if (this.settleT > SETTLE_LIMIT && !this.forced) {
      this.forced = true;
      this.forceStabilize();
    }
    // 강제 안정화 뒤에도 멈추지 않으면 그냥 턴을 넘긴다(무한 대기 방지)
    if ((this.isQuiet() && this.settleT >= MIN_SETTLE_HOLD) || this.settleT > SETTLE_LIMIT + 1.5) this.toTurnEnd();
  }

  forceStabilize(): void {
    this.emit({ type: 'forced' });
    this.projectiles = [];
    this.scheduled = [];
    const t = this.terrain;
    for (const ch of this.chunks) {
      // 바로 떨어뜨린다
      let guard = ROWS + 10;
      let landed = false;
      while (guard-- > 0 && !landed) {
        for (let b = 0; b < ch.bottom.length; b++) {
          const id = ch.cells[ch.bottom[b]!]!;
          const cy = ((id / COLS) | 0) + ch.dRow + 1;
          if (cy >= ROWS) continue;
          if (cy >= 0 && t.cells[cy * COLS + (id % COLS)] !== Mat.Empty) { landed = true; break; }
        }
        if (!landed) {
          ch.dRow++;
          if (ch.minY + ch.dRow >= ROWS) break;
        }
      }
      if (landed) t.stamp(ch.cells, ch.mats, 0, ch.dRow);
    }
    this.chunks = [];
    for (const b of this.boulders) if (!b.dead) this.settleBoulder(b, true);
    this.boulders = [];
    for (const f of this.fighters) {
      if (!f.alive) continue;
      this.unstick(f);
      if (!f.onGround) {
        const s = t.surfaceBelow(f.x, f.y);
        if (s < 0) {
          f.y = WORLD_H + 40;
          this.kill(f, 'fall');
        } else {
          const h = s - f.airPeakY;
          f.y = s;
          f.vy = h > 0 ? Math.sqrt(2 * GRAVITY * h) : 0;
          this.land(f);
        }
      }
    }
    t.pending = [];
  }

  private toTurnEnd(): void {
    this.input = { move: 0, aim: 0, charge: false };
    this.setPhase('TURN_END');
  }

  private resolveTurnEnd(): void {
    const [a, b] = this.fighters;
    const deadA = !a.alive, deadB = !b.alive;
    if (deadA || deadB) {
      if (deadA && deadB) return this.endGame(-1, 'draw');
      const w = deadA ? 1 : 0;
      const loser = deadA ? a : b;
      return this.endGame(w, loser.deathCause === 'fall' ? 'fall' : 'hp');
    }
    if (this.turnNo >= this.cfg.turnLimit) {
      const ra = a.hp / a.maxHp, rb = b.hp / b.maxHp;
      if (Math.abs(ra - rb) < 1e-9) return this.endGame(-1, 'draw');
      return this.endGame(ra > rb ? 0 : 1, 'limit');
    }
    this.startTurn((1 - this.current) as 0 | 1);
  }

  private endGame(winner: 0 | 1 | -1, reason: 'hp' | 'fall' | 'limit' | 'draw'): void {
    this.winner = winner;
    this.endReason = winner === -1 ? 'draw' : reason;
    this.setPhase('GAME_OVER');
    for (const f of this.fighters) {
      if (winner === f.idx) { f.anim = 'victory'; f.animT = 0; }
      else if (f.alive && winner !== -1) { f.anim = 'defeat'; f.animT = 0; }
    }
    this.emit({ type: 'gameOver', winner, reason: this.endReason as 'hp' | 'fall' | 'limit' | 'draw' });
  }

  // ───────── 예상 궤적·AI용 ─────────

  /** 지형을 바꾸지 않고 한 발을 끝까지 따라가 본다 */
  dryShot(fIdx: 0 | 1, slot: 0 | 1, angle: number, power: number, from?: { x: number; y: number }): DryResult {
    const f = this.fighters[fIdx];
    const saved = { x: f.x, y: f.y, angle: f.angle, proj: this.projectiles, sched: this.scheduled, quiet: this.quiet, rng: this.rng.state, nextId: this.nextId };
    if (from) { f.x = from.x; f.y = from.y; }
    f.angle = angle;
    const res: DryResult = { damage: [0, 0], impacts: [], enemyGroundHit: 0, outOfWorld: false, flightTime: 0 };
    this.dry = res;
    this.quiet = true;
    this.projectiles = [];
    this.scheduled = [];
    const w = this.weaponOf(f, slot);
    const sp = (power / 100) * MAX_LAUNCH_SPEED * w.speedMul;
    const angles = w.pattern === 'triple' ? [-1, 0, 1].map((k) => angle + k * (w.spreadDeg ?? 3)) : [angle];
    const powers = w.pattern === 'salvo' ? [power, clamp(power + (w.salvoPowerStep ?? 3), 0, 100), clamp(power - (w.salvoPowerStep ?? 3), 0, 100)] : [power];
    for (const a of angles) {
      for (const pw of powers) {
        const [mx, my] = this.muzzle(f, a);
        const s = pw === power ? sp : (pw / 100) * MAX_LAUNCH_SPEED * w.speedMul;
        this.projectiles.push(this.newProjectile(fIdx, 0, w.id, mx, my, Math.cos(a * DEG) * s, -Math.sin(a * DEG) * s));
      }
    }
    let steps = 0;
    while (this.projectiles.length && steps < FLIGHT_LIMIT / DT) {
      for (const p of this.projectiles) if (!p.dead) this.stepProjectile(p, DT);
      this.projectiles = this.projectiles.filter((p) => !p.dead);
      steps++;
    }
    res.flightTime = steps * DT;
    this.dry = null;
    this.quiet = saved.quiet;
    this.projectiles = saved.proj;
    this.scheduled = saved.sched;
    this.rng.state = saved.rng;
    this.nextId = saved.nextId;
    f.x = saved.x;
    f.y = saved.y;
    f.angle = saved.angle;
    return res;
  }

  /** 화면에 그릴 예상 궤적(실제 물리와 같은 계산). 처음 maxT초까지 */
  previewPath(maxT: number, power: number): { x: number; y: number }[] {
    const f = this.cur;
    const w = this.weaponOf(f);
    const [mx, my] = this.muzzle(f);
    const sp = (power / 100) * MAX_LAUNCH_SPEED * w.speedMul;
    const a = f.angle * DEG;
    let vx = Math.cos(a) * sp, vy = -Math.sin(a) * sp, x = mx, y = my;
    const pts = [{ x, y }];
    for (let t = 0; t < maxT; t += DT) {
      vx += this.wind * WIND_ACC_PER_UNIT * w.windMul * DT;
      vy += GRAVITY * w.gravityMul * DT;
      x += vx * DT;
      y += vy * DT;
      pts.push({ x, y });
      if (y > 0 && this.terrain.solidAt(x, y)) break;
    }
    return pts;
  }

  clone(): Battle {
    const b = new Battle(this.cfg, true);
    b.terrain = this.terrain.clone();
    b.fighters = this.fighters.map((f) => ({ ...f, stats: { ...f.stats } })) as [Fighter, Fighter];
    b.projectiles = this.projectiles.map((p) => ({ ...p }));
    b.boulders = this.boulders.map((x) => ({ ...x, cool: [...x.cool] as [number, number] }));
    b.chunks = this.chunks.map((c) => ({ ...c, hit: [...c.hit] as [boolean, boolean] }));
    b.scheduled = this.scheduled.map((s) => ({ ...s }));
    b.rng = new Rng(0);
    b.rng.state = this.rng.state;
    b.time = this.time;
    b.stepNo = this.stepNo;
    b.phase = this.phase;
    b.phaseT = this.phaseT;
    b.current = this.current;
    b.turnNo = this.turnNo;
    b.wind = this.wind;
    b.timeLeft = this.timeLeft;
    b.winner = this.winner;
    b.endReason = this.endReason;
    b.shotT = this.shotT;
    b.lastBlastT = this.lastBlastT;
    b.settleT = this.settleT;
    b.forced = this.forced;
    b.nextId = this.nextId;
    b.shotNo = this.shotNo;
    b.shotDamage = new Map(this.shotDamage);
    b.shotHit = new Set(this.shotHit);
    b.input = { ...this.input };
    b.recording = false;
    b.quiet = true;
    return b;
  }

  /** 상태 요약 해시(재현 시험용) */
  hash(): string {
    const f = this.fighters.map((x) => `${x.x.toFixed(3)},${x.y.toFixed(3)},${x.hp},${x.alive ? 1 : 0},${x.gauge.toFixed(3)}`).join('|');
    return `${this.terrain.checksum()}:${f}:${this.wind}:${this.turnNo}:${this.phase}:${this.rng.state}`;
  }

  serialize(): string {
    return JSON.stringify({
      cfg: this.cfg,
      terrain: this.terrain.serialize(),
      fighters: this.fighters,
      projectiles: this.projectiles,
      boulders: this.boulders,
      chunks: this.chunks.map((c) => ({ ...c, cells: Array.from(c.cells), mats: Array.from(c.mats), bottom: Array.from(c.bottom) })),
      scheduled: this.scheduled,
      rng: this.rng.state,
      s: [this.time, this.stepNo, this.phaseT, this.current, this.turnNo, this.wind, this.timeLeft, this.shotT, this.lastBlastT, this.settleT, this.nextId, this.shotNo],
      phase: this.phase,
      winner: this.winner,
      endReason: this.endReason,
      shotDamage: [...this.shotDamage],
      shotHit: [...this.shotHit],
    });
  }

  static deserialize(json: string): Battle {
    const o = JSON.parse(json);
    const b = new Battle(o.cfg, true);
    b.terrain = Terrain.deserialize(o.terrain);
    b.fighters = o.fighters;
    b.projectiles = o.projectiles;
    b.boulders = o.boulders;
    b.chunks = o.chunks.map((c: Chunk & { cells: number[]; mats: number[]; bottom: number[] }) => ({ ...c, cells: Int32Array.from(c.cells), mats: Uint8Array.from(c.mats), bottom: Int32Array.from(c.bottom) }));
    b.scheduled = o.scheduled;
    b.rng.state = o.rng;
    [b.time, b.stepNo, b.phaseT, b.current, b.turnNo, b.wind, b.timeLeft, b.shotT, b.lastBlastT, b.settleT, b.nextId, b.shotNo] = o.s;
    b.phase = o.phase;
    b.winner = o.winner;
    b.endReason = o.endReason;
    b.shotDamage = new Map(o.shotDamage);
    b.shotHit = new Set(o.shotHit);
    return b;
  }
}

export const ALL_CHARACTER_IDS = CHARACTERS.map((c) => c.id);
export const ALL_WEAPON_IDS = Object.keys(WEAPONS);
