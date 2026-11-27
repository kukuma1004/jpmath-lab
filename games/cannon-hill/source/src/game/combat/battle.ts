import {
  ANGLE_SPEED, CELL, CHARGE_TIME, CHAR_CENTER_Y, CHAR_RADIUS, COLS, DT, FALL_DAMAGE_MAX, FALL_DAMAGE_PER_SPEED, PLAYER_CHARGE_TIME,
  FLIGHT_LIMIT, GRAVITY,
  MAX_BOULDERS, MAX_CHUNKS, MAX_LAUNCH_SPEED, MAX_LAUNCH_TILT, MIN_SETTLE_HOLD, MOVE_BUDGET, ROWS, SAFE_FALL_SPEED, SETTLE_LIMIT,
  STEP_DOWN, STEP_UP, TURN_LIMIT_DEFAULT, WALK_SPEED, WIND_ACC_PER_UNIT, WORLD_H, WORLD_W,
} from '../config/constants';
import { CHARACTERS, TRAIT, character } from '../data/characters';
import { findSpawnPoints, generateTerrain, mapDef } from '../data/maps';
import { WEAPONS, weapon, type WeaponDef } from '../data/weapons';
import { Mat, Terrain, type Component } from '../terrain/terrain';
import { Rng, clamp } from '../utils/rng';
import type {
  BattleConfig, Boulder, Chunk, DamageCause, Fighter, Phase, PoisonCloud, Projectile, Scheduled, SimEvent, Team, WeaponSlot,
} from './types';

const DEG = Math.PI / 180;
const TEAM_SIDES = [0, 1] as const;
const SOLO_SIDES = [0, 1, 2, 3] as const;
export const ULTIMATE_TURN = 3;
export const ULTIMATE_RECHARGE_TURNS = 3;

export interface DryResult {
  /** 장수별 피해(fighters 순서) */
  damage: number[];
  impacts: { x: number; y: number }[];
  enemyGroundHit: number; // 상대(들) 발밑을 얼마나 파는지(0..1 근사, 가장 큰 값)
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
    turnLimit: TURN_LIMIT_DEFAULT,
    ...partial,
  };
}

function newStats() {
  return { shots: 0, hits: 0, damageDealt: 0, damageTaken: 0, maxHit: 0, cellsDestroyed: 0 };
}

export class Battle {
  cfg: BattleConfig;
  readonly ringOutY: number;
  terrain: Terrain;
  fighters: Fighter[];
  projectiles: Projectile[] = [];
  boulders: Boulder[] = [];
  chunks: Chunk[] = [];
  scheduled: Scheduled[] = [];
  clouds: PoisonCloud[] = [];
  events: SimEvent[] = [];
  rng: Rng;
  time = 0;
  stepNo = 0;
  phase: Phase = 'BATTLE_START';
  phaseT = 0;
  current = 0;
  /** 편마다 다음에 쏠 장수를 고를 때 어디부터 볼지(편 안의 순번) */
  teamPtr: number[] = [0, 0];
  turnNo = 0;
  wind = 0;
  timeLeft = 0;
  /** 이긴 편, 무승부 -1, 아직 null */
  winner: Team | -1 | null = null;
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
    this.ringOutY = mapDef(cfg.mapId).ringOutY ?? WORLD_H + 30;
    this.rng = new Rng(cfg.seed);
    if (empty) {
      this.terrain = new Terrain();
      this.fighters = cfg.chars.map((id, i) => this.makeFighter(i, id, 0));
      return;
    }
    const def = mapDef(cfg.mapId);
    this.terrain = generateTerrain(def, cfg.seed);
    const spawns = findSpawnPoints(this.terrain, def, this.rng, cfg.chars.length > 2 ? 4 : 2);
    if (cfg.freeForAll) {
      for (let i = spawns.length - 1; i > 0; i--) {
        const j = this.rng.int(0, i);
        [spawns[i], spawns[j]] = [spawns[j]!, spawns[i]!];
      }
    }
    this.fighters = cfg.chars.map((id, i) => {
      const p = spawns[i]!, f = this.makeFighter(i, id, p.x);
      f.y = p.y; f.airPeakY = p.y;
      return f;
    });
    for (const f of this.fighters) f.angle = this.nearestEnemy(f).x > f.x ? 50 : 130;
    // 먼저 쏠 편을 고른다(그 편의 첫 장수부터)
    this.current = cfg.starterMatch ? 0 : cfg.freeForAll ? this.rng.int(0, 3) : this.rng.next() < 0.5 ? 0 : 1;
    this.wind = cfg.starterMatch ? 0 : Math.round(this.rng.gauss() * 6 * (0.5 + def.windBias));
    this.emit({ type: 'battleStart', first: this.current });
  }

  private makeFighter(idx: number, charId: string, x: number): Fighter {
    const def = character(charId);
    const y = x > 0 ? this.terrain.topSurface(x) : 0;
    const team = (this.cfg.freeForAll ? idx : idx % 2) as Team;
    return {
      idx, team, charId, x, y: Math.max(0, y), vx: 0, vy: 0, onGround: true,
      angle: team === 0 ? 50 : 130, power: 0, lastPower: 70, chargeDir: 1, slot: 0,
      turnsTaken: 0, nextUltimateTurn: ULTIMATE_TURN,
      hp: def.hp, maxHp: def.hp,
      moveLeft: MOVE_BUDGET * def.moveMul, moved: false,
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

  get sides(): readonly Team[] {
    return this.cfg.freeForAll ? SOLO_SIDES : TEAM_SIDES;
  }

  /** 지금 차례인 장수에게 가장 가까운 살아 있는 상대(없으면 아무 상대) */
  get enemy(): Fighter {
    return this.nearestEnemy(this.cur);
  }

  nearestEnemy(f: Fighter, x = f.x): Fighter {
    let best: Fighter | null = null, bd = Infinity;
    for (const e of this.fighters) {
      if (e.team === f.team || !e.alive) continue;
      const d = Math.abs(e.x - x);
      if (d < bd) { bd = d; best = e; }
    }
    return best ?? this.fighters.find((e) => e.team !== f.team)!;
  }

  enemiesOf(f: Fighter): Fighter[] {
    return this.fighters.filter((e) => e.team !== f.team);
  }

  alliesOf(f: Fighter): Fighter[] {
    return this.fighters.filter((e) => e.team === f.team);
  }

  get teamSize(): number {
    return this.fighters.length / 2;
  }

  weaponOf(f: Fighter, slot: WeaponSlot = f.slot): WeaponDef {
    const d = character(f.charId);
    return weapon(slot === 2 ? d.ultimate : slot === 1 ? d.special : d.normal);
  }

  ultimateReady(f: Fighter): boolean {
    return f.alive && f.turnsTaken >= f.nextUltimateTurn;
  }

  traitOf(f: Fighter): string {
    return character(f.charId).trait.id;
  }

  /** 화포장군이 이번 차례에 자리를 지키고 있는가 */
  steadyReady(f: Fighter): boolean {
    return this.traitOf(f) === 'steady' && !f.moved;
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

  selectWeapon(slot: WeaponSlot): void {
    if (!this.isPlayerPhase() || this.phase === 'CHARGE') return;
    if (slot === 2 && !this.ultimateReady(this.cur)) return;
    this.rec('slot', [slot]);
    this.cur.slot = slot;
  }

  cancelCharge(): void {
    if (this.phase !== 'CHARGE') return;
    this.rec('cancelCharge', []);
    this.input.charge = false;
    this.cur.power = 0;
    this.setAnim(this.cur, 'idle');
    this.setPhase('AIM');
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
      case 'slot': this.selectWeapon(a[0] as WeaponSlot); break;
      case 'cancelCharge': this.cancelCharge(); break;
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
        if (this.phaseT >= 0.55) this.startTurn(this.current, true);
        break;
      case 'TURN_START':
        if (this.phaseT >= 0.18) this.setPhase('AIM');
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
        if (this.phaseT >= 0.12) {
          const limit = this.forced ? 0.2 : SETTLE_LIMIT;
          if (!this.isQuiet() && this.phaseT > limit) this.forceStabilize();
          if (this.isQuiet() || this.phaseT > limit) this.resolveTurnEnd();
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

  private startTurn(player: number, first = false): void {
    this.current = player;
    // 이 편의 다음 차례는 이 장수 다음 사람부터
    const me = this.fighters[player]!;
    if (!this.cfg.freeForAll) {
      const mates = this.alliesOf(me);
      this.teamPtr[me.team] = (mates.indexOf(me) + 1) % mates.length;
    }
    if (!first) this.turnNo++;
    else this.turnNo = 1;
    const f = this.cur;
    f.moveLeft = MOVE_BUDGET * character(f.charId).moveMul;
    f.moved = false;
    // 무당: 차례가 시작되면 자신과 가까운 같은 편을 조금 채운다
    if (this.traitOf(f) === 'blessing' && f.alive) {
      for (const a of this.alliesOf(f)) {
        if (!a.alive || Math.abs(a.x - f.x) > TRAIT.blessRange) continue;
        const amount = Math.min(TRAIT.blessHeal, a.maxHp - a.hp);
        if (amount <= 0) continue;
        a.hp += amount;
        this.emit({ type: 'heal', target: a.idx, amount, x: a.x, y: a.y - 40 });
      }
    }
    this.tickClouds(f);
    if (!f.alive) { this.toTurnEnd(); return; }
    f.turnsTaken++;
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
      const chargeTime = this.cfg.controllers[f.idx] === 'human' ? (this.cfg.starterMatch ? 2.8 : PLAYER_CHARGE_TIME) : CHARGE_TIME;
      f.power += (f.chargeDir * 100 * dt) / chargeTime;
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
      if (Math.abs(moved) > 0.01) f.moved = true;
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
      const startX = f.x;
      const nx = clamp(startX + dir * s, 10, WORLD_W - 10);
      if (nx === startX) break;
      let ny = f.y;
      if (t.solidAt(nx, f.y - 1)) {
        // 짧은 둔턱은 한 걸음으로 오른다. 24px를 넘는 벽이나 머리가 닿을 천장은 막힌다.
        let ok = false;
        for (let up = 1; up <= STEP_UP; up++) {
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
          moved += Math.abs(nx - startX);
          break;
        }
      }
      // 머리가 막히면 못 간다
      let blocked = false;
      for (let height = 2; height <= 36; height += CELL) {
        if (t.solidAt(nx, ny - height)) { blocked = true; break; }
      }
      if (blocked) break;
      f.x = nx;
      f.y = ny;
      moved += Math.abs(nx - startX);
      remain -= s;
    }
    return moved;
  }

  /** 발 아래의 경사. 낭떠러지나 한쪽에만 있는 둔턱은 포신을 기울이지 않는다. */
  groundSlope(f: Fighter): number {
    if (!f.onGround) return 0;
    const left = this.terrain.surfaceBelow(f.x - 16, f.y - STEP_UP - 1, STEP_UP * 2 + 2);
    const right = this.terrain.surfaceBelow(f.x + 16, f.y - STEP_UP - 1, STEP_UP * 2 + 2);
    if (left < 0 || right < 0) return 0;
    const a = f.y - left, b = right - f.y;
    if (a * b <= 0) return 0;
    const rise = Math.sign(a) * Math.min(Math.abs(a), Math.abs(b));
    return clamp(Math.atan2(rise, 16) / DEG, -MAX_LAUNCH_TILT, MAX_LAUNCH_TILT);
  }

  /** 조준 입력은 몸 기준이다. 탄 계산에서는 지면 기울기를 반영한 월드 각도를 쓴다. */
  launchAngle(f: Fighter, angle = f.angle): number {
    return clamp(angle - this.groundSlope(f), 0, 180);
  }

  private fire(power: number): void {
    const f = this.cur;
    const slot = f.slot === 2 && !this.ultimateReady(f) ? 0 : f.slot;
    const w = this.weaponOf(f, slot);
    if (slot === 2) f.nextUltimateTurn = f.turnsTaken + ULTIMATE_RECHARGE_TURNS;
    if (f.slot === 2) f.slot = 0;
    f.power = power;
    f.lastPower = power;
    this.input = { move: 0, aim: 0, charge: false };
    const shot = ++this.shotNo;
    f.stats.shots++;
    this.shotDamage.set(shot, 0);
    const angle = this.launchAngle(f);
    const [mx, my] = this.muzzle(f, angle);
    if (slot === 2) this.emit({ type: 'ultimate', owner: f.idx, weaponId: w.id, x: f.x, y: f.y - 56 });
    this.emit({ type: 'fire', owner: f.idx, weaponId: w.id, x: mx, y: my, angle, power, shot, wind: this.wind });
    if (this.steadyReady(f)) this.emit({ type: 'trait', who: f.idx, kind: 'steady', x: f.x, y: f.y - 70 });
    this.setAnim(f, 'fire');
    if (w.pattern === 'triple') {
      const n = w.count ?? 3;
      for (let i = 0; i < n; i++) this.spawnShot(f, w, angle + (i - (n - 1) / 2) * (w.spreadDeg ?? 3), power, shot);
    } else {
      this.spawnShot(f, w, angle, power, shot);
      if (w.pattern === 'echo') {
        const facing = angle <= 90 ? 1 : -1;
        for (const [x, y] of this.echoOrigins(mx, my, facing, w.count ?? 2)) {
          this.emit({ type: 'shadow', owner: f.idx, x, y, facing });
          this.spawnShot(f, w, angle, power, shot, [x, y]);
        }
      }
      if (w.pattern === 'salvo') {
        const n = w.count ?? 3;
        for (let i = 1; i < n; i++) {
          this.scheduled.push({
            t: this.time + i * (w.salvoGap ?? 0.3), kind: 'salvo', owner: f.idx, shot, weaponId: w.id, x: 0,
            angle, power: clamp(power + (i % 2 === 1 ? 1 : -1) * Math.ceil(i / 2) * (w.salvoPowerStep ?? 3), 0, 100),
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

  muzzle(f: Fighter, angle = this.launchAngle(f)): [number, number] {
    const a = angle * DEG;
    return [f.x + Math.cos(a) * 26, f.y - CHAR_CENTER_Y - 4 - Math.sin(a) * 26];
  }

  private echoOrigins(x: number, y: number, facing: 1 | -1, count: number): [number, number][] {
    const origins: [number, number][] = [[x - 102 * facing, y - 42]];
    if (count > 2) origins.push([x + 116 * facing, y - 60]);
    return origins.filter(([ox, oy]) => {
      if (ox < CELL || ox > WORLD_W - CELL || oy < 0) return false;
      const steps = Math.ceil(Math.hypot(ox - x, oy - y) / CELL);
      for (let i = 1; i <= steps; i++) {
        if (this.terrain.solidAt(x + (ox - x) * i / steps, y + (oy - y) * i / steps)) return false;
      }
      return true;
    });
  }

  private spawnShot(f: Fighter, w: WeaponDef, angle: number, power: number, shot: number, origin = this.muzzle(f, angle)): void {
    const [mx, my] = origin;
    const sp = (power / 100) * MAX_LAUNCH_SPEED;
    const a = angle * DEG;
    const p = this.newProjectile(f.idx, shot, w.id, mx, my, Math.cos(a) * sp, -Math.sin(a) * sp);
    if (this.steadyReady(f)) p.boost = TRAIT.steadyDamage;
    this.projectiles.push(p);
    this.emit({ type: 'launch', id: p.id, weaponId: w.id });
  }

  newProjectile(owner: number, shot: number, weaponId: string, x: number, y: number, vx: number, vy: number, child: Projectile['child'] = ''): Projectile {
    return {
      id: this.nextId++, owner, shot, weaponId, x, y, px: x, py: y, vx, vy, age: 0, bounces: 0, pierced: 0,
      carveAcc: 0, child, boost: 1, stuck: false, fuse: 0, split: false, dead: false,
      seekTarget: -1, homingAdjusted: false, drilling: false,
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
    if (!p.drilling) {
      p.vx += this.wind * WIND_ACC_PER_UNIT * dt;
      p.vy += GRAVITY * dt;
      if (w.homing && !p.child && p.age > 0.25) this.seek(p, w.homing, dt);
    }
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
      if (w.behavior === 'drill' && (p.drilling || m !== Mat.Empty)) {
        if (m === Mat.Bedrock || m === Mat.Core) {
          this.impact(p, w, ox, oy, -1, false);
          return;
        }
        if (!p.drilling) {
          p.drilling = true;
          const speed = Math.hypot(p.vx, p.vy) || 1;
          const cut = w.shelfCut && p.vy > 0 && this.cutShelf(p, w.shelfCut);
          const drill = cut && w.shelfCut?.followThrough ? weapon(w.shelfCut.followThrough) : w;
          p.weaponId = drill.id;
          if (drill.drillExit) p.drillExitAt = this.findDrillExit(p.x, p.y, p.vx / speed, p.vy / speed, drill.drillDepth ?? 280, drill.drillExit.gap);
          p.vx = p.vx / speed * (drill.drillSpeed ?? 420);
          p.vy = p.vy / speed * (drill.drillSpeed ?? 420);
          if (drill.burstRadius && drill.burstCarve && drill.burstDamage) {
            this.explode(p.x, p.y, drill.burstRadius, drill.burstCarve, drill.rockMul, drill.burstDamage, 1, 0, p, -1, drill.id, false);
          }
          this.emit({ type: 'debris', x: p.x, y: p.y, count: 14, mat: m });
          // 다음 걸음부터 굴착 속도를 써서 진입 순간의 고속 이동을 막는다.
          break;
        }
        p.pierced += Math.hypot(sx, sy);
        if (w.drillExit && p.drillExitAt !== undefined && p.pierced >= p.drillExitAt && m === Mat.Empty) {
          p.dead = true;
          this.explode(p.x, p.y, w.drillExit.radius, w.carve, w.rockMul, w.drillExit.damage, 1, w.knockback, p, -1, w.id, true);
          this.emit({ type: 'drillBreak', kind: 'exit', x: p.x, y: p.y });
          return;
        }
        p.carveAcc += Math.hypot(sx, sy);
        if (p.carveAcc >= 6) {
          p.carveAcc = 0;
          if (!this.dry) this.carve(p.x, p.y, w.drillRadius ?? 14, 1, p.owner);
        }
        if (p.pierced >= (w.drillDepth ?? 280)) {
          this.impact(p, w, p.x, p.y, -1, false);
          return;
        }
        continue;
      }
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

  /** Sample the original wall before the entrance burst and drill erase the route. */
  private findDrillExit(x: number, y: number, dx: number, dy: number, depth: number, gap: number): number | undefined {
    let open = 0;
    for (let distance = 1; distance <= depth + gap - 1; distance++) {
      const px = x + dx * distance, py = y + dy * distance;
      if (px < 0 || px >= WORLD_W || py >= WORLD_H) return;
      const mat = this.terrain.matAt(px, py);
      if (mat === Mat.Bedrock || mat === Mat.Core) return;
      open = mat === Mat.Empty ? open + 1 : 0;
      if (open === gap) return distance - gap + 1;
    }
  }

  /** 유도 부적: 가까운 상대 쪽으로 휘어 든다(같은 편은 노리지 않는다) */
  private seek(p: Projectile, {range, turnRate}: NonNullable<WeaponDef['homing']>, dt: number): void {
    const owner = this.fighters[p.owner];
    if (!owner) return;
    const speed = Math.hypot(p.vx, p.vy);
    const cosineTo = (f: Fighter, distance: number) => distance <= 1 ? 1 :
      ((f.x - p.x) * p.vx + (f.y - CHAR_CENTER_Y - p.y) * p.vy) / (distance * Math.max(1, speed));
    const distanceTo = (f: Fighter) => Math.hypot(f.x - p.x, f.y - CHAR_CENTER_Y - p.y);
    const previous = this.fighters[p.seekTarget ?? -1];
    const previousDistance = previous ? distanceTo(previous) : Infinity;
    let best = previous?.alive && previous.team !== owner.team && previousDistance < range * 1.15 &&
      cosineTo(previous, previousDistance) > 0 ? previous : null;
    if (!best) {
      let distance = range;
      for (const f of this.fighters) {
        if (!f.alive || f.team === owner.team) continue;
        const d = distanceTo(f);
        if (d < distance && cosineTo(f, d) >= 0.5) { distance = d; best = f; }
      }
    }
    if (best && best.idx !== p.seekTarget) this.emit({ type: 'seekLock', x: best.x, y: best.y });
    p.seekTarget = best?.idx ?? -1;
    if (!best) return;
    const dx = best.x - p.x, dy = best.y - CHAR_CENTER_Y - p.y;
    const heading = Math.atan2(p.vy, p.vx);
    const desired = Math.atan2(dy, dx);
    const delta = Math.atan2(Math.sin(desired - heading), Math.cos(desired - heading));
    const angle = heading + clamp(delta, -turnRate * dt, turnRate * dt);
    const steerSpeed = Math.max(220, speed);
    const vx = Math.cos(angle) * steerSpeed;
    const vy = Math.sin(angle) * steerSpeed;
    if (!p.homingAdjusted && Math.abs(vx - p.vx) + Math.abs(vy - p.vy) > 1e-6) p.homingAdjusted = true;
    p.vx = vx;
    p.vy = vy;
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
      this.explode(p.x, p.y, w.burstRadius ?? 34, w.burstCarve ?? 28, w.rockMul, w.burstDamage ?? 50, w.directBonus, w.knockback * 0.2, p, -1, w.id, false);
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
        if (w.cloudRadius) this.makeCloud(p, w, x, y);
    }
  }

  inCloud(f: Fighter, c: PoisonCloud): boolean {
    return Math.hypot((f.x - c.x) / c.radius, (f.y - CHAR_CENTER_Y - c.y) / (c.radius * 0.55)) <= 1;
  }

  private makeCloud(p: Projectile, w: WeaponDef, x: number, y: number): void {
    const c: PoisonCloud = { id: this.nextId, owner: p.owner, shot: p.shot, x, y: y - 28,
      radius: w.cloudRadius!, damage: w.cloudDamage ?? 48,
      turns: this.fighters.map((f) => f.alive ? w.cloudTurns ?? 3 : 0) };
    if (this.dry) {
      for (const f of this.fighters) if (f.alive && this.inCloud(f, c)) {
        this.dry.damage[f.idx] += c.damage * 1.5 * (this.traitOf(f) === 'antidote' ? TRAIT.poisonResistance : 1);
      }
      return;
    }
    this.nextId++;
    if (this.clouds.length >= 6) this.clouds.shift();
    this.clouds.push(c);
  }

  private tickClouds(f: Fighter): void {
    for (const c of this.clouds) {
      if ((c.turns[f.idx] ?? 0) <= 0) continue;
      c.turns[f.idx] = (c.turns[f.idx] ?? 0) - 1;
      if (f.alive && this.inCloud(f, c)) {
        this.applyDamage(f, c.damage, f.x, f.y - 40, false, 'poison', c.owner, c.shot);
      }
    }
    this.clouds = this.clouds.filter((c) => this.fighters.some((a) => a.alive && (c.turns[a.idx] ?? 0) > 0));
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
      q.boost = p.boost;
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
      q.boost = p.boost;
      this.projectiles.push(q);
    }
  }

  private lightningStrike(x: number, owner: number, shot: number, w: WeaponDef): void {
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
    // 특기: 화포장군 자리 잡기(피해·폭발), 신궁 직격, 도깨비 밀어내기
    const shooter = this.fighters[p.owner];
    const st = shooter ? this.traitOf(shooter) : '';
    if (p.boost !== 1) {
      damage *= p.boost;
      radius *= TRAIT.steadyBlast;
      carve *= TRAIT.steadyBlast;
    }
    if (st === 'eagle') directBonus *= TRAIT.eagleDirect;
    if (p.homingAdjusted) directBonus = 1;
    if (st === 'shove') knockback *= TRAIT.shoveKnock;
    if (st === 'engineer') rockMul = Math.min(1, rockMul * TRAIT.engineerRock);
    if (this.dry) {
      const r = this.dry;
      r.impacts.push({ x, y });
      for (const f of this.fighters) {
        if (!f.alive) continue;
        r.damage[f.idx] += this.blastDamageTo(f, x, y, radius, damage, directBonus, f.idx === target);
      }
      const owner = this.fighters[p.owner]!;
      for (const e of this.fighters) {
        if (e.team === owner.team || !e.alive) continue;
        const dx = Math.abs(e.x - x), dy = Math.abs(e.y + 6 - y);
        if (dx < carve && dy < carve) r.enemyGroundHit = Math.max(r.enemyGroundHit, 1 - Math.hypot(dx, dy) / (carve * 1.4));
      }
      return;
    }
    this.lastBlastT = this.time;
    this.emit({ type: 'explode', x, y, radius, weaponId, big });
    for (const f of this.fighters) {
      if (!f.alive) continue;
      const direct = f.idx === target;
      const dmg = this.blastDamageTo(f, x, y, radius, damage, directBonus, direct);
      if (dmg > 0) {
        this.applyDamage(f, dmg, x, y, direct && !p.homingAdjusted && dmg >= 100, 'blast', p.owner, p.shot);
        // 밀려남
        const cx = f.x, cy = f.y - CHAR_CENTER_Y;
        const dist = Math.max(1, Math.hypot(cx - x, cy - y));
        const k = clamp(1 - Math.max(0, dist - CHAR_RADIUS) / radius, 0, 1);
        let imp = knockback * k;
        if (this.traitOf(f) === 'ironclad') {
          if (imp > 160) this.emit({ type: 'trait', who: f.idx, kind: 'iron', x: f.x, y: f.y - 70 });
          imp *= TRAIT.ironKnock;
        } else if (st === 'shove' && shooter && f.team !== shooter.team && imp > 200) {
          this.emit({ type: 'trait', who: f.idx, kind: 'shove', x: f.x, y: f.y - 70 });
        }
        if (direct && st === 'eagle') this.emit({ type: 'trait', who: f.idx, kind: 'eagle', x: f.x, y: f.y - 74 });
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
    if (target >= 0) {
      const tf = this.fighters[target]!;
      kx = tf.x;
      ky = Math.max(y, tf.y - 8);
    }
    const removed = this.carve(kx, ky, carve, rockMul, p.owner);
    if (removed > 0) this.emit({ type: 'debris', x: kx, y: ky, count: Math.min(40, 6 + (removed >> 5)), mat: Mat.Dirt });
  }

  private cutShelf(p: Projectile, cut: NonNullable<WeaponDef['shelfCut']>): boolean {
    const shelf = this.terrain.shelfTopAndBottom(p.x, p.y, cut.maxThickness);
    if (!shelf) return false;
    const y = (shelf.top + shelf.bottom) / 2;
    if (this.dry) {
      for (const enemy of this.enemiesOf(this.fighters[p.owner]!)) {
        if (!enemy.alive || Math.abs(enemy.y - shelf.top) > 28) continue;
        const distance = Math.abs(enemy.x - p.x);
        if (distance < cut.radius) {
          this.dry.enemyGroundHit = Math.max(this.dry.enemyGroundHit, 1 - distance / (cut.radius * 1.4));
        }
      }
      return true;
    }
    const material = this.terrain.matAt(p.x, p.y);
    if (this.carve(p.x, y, cut.radius, 1, p.owner) === 0) return false;
    this.emit({ type: 'debris', x: p.x, y: shelf.bottom - CELL, count: 24, mat: material });
    this.emit({ type: 'drillBreak', kind: 'shelf', x: p.x, y: shelf.top });
    return true;
  }

  private carve(x: number, y: number, r: number, rockMul: number, owner: number): number {
    const removed = this.terrain.carveCircle(x, y, r, rockMul);
    this.fighters[owner]!.stats.cellsDestroyed += removed;
    return removed;
  }

  applyDamage(f: Fighter, dmg: number, x: number, y: number, crit: boolean, cause: DamageCause, from: number, shot = 0): void {
    if (!f.alive || dmg <= 0) return;
    // 거북선 장수: 떨어짐·깔림·낙석 피해 절반
    if ((cause === 'fall' || cause === 'crush' || cause === 'rock') && this.traitOf(f) === 'ironclad') dmg *= TRAIT.ironEnv;
    if (cause === 'fall' && this.traitOf(f) === 'foxstep') dmg *= TRAIT.foxFall;
    if ((cause === 'fall' || cause === 'crush' || cause === 'rock') && this.traitOf(f) === 'hardhat') dmg *= TRAIT.hardhatEnv;
    if (cause === 'poison' && this.traitOf(f) === 'antidote') dmg *= TRAIT.poisonResistance;
    dmg = Math.round(dmg);
    if (dmg <= 0) return;
    this.emit({ type: 'damage', target: f.idx, amount: dmg, x, y, crit, cause });
    // 기록은 실제로 깎인 만큼만(넘친 피해는 빼고)
    dmg = Math.min(dmg, f.hp);
    f.hp = Math.max(0, f.hp - dmg);
    f.stats.damageTaken += dmg;
    if (from >= 0) {
      const src = this.fighters[from]!;
      // 같은 편을 맞힌 것은 공으로 치지 않는다(자기 자신 포함)
      if (src.team !== f.team) {
        src.stats.damageDealt += dmg;
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
      minX: c.minX, minY: c.minY, maxX: c.maxX, maxY: c.maxY, dRow: 0, acc: 0, vy: 0, hit: this.fighters.map(() => false),
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
        restT: 0, age: 0, cool: this.fighters.map(() => 0), dead: false,
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
              r: this.rng.range(5, 8), rot: 0, restT: 0, age: 0, cool: this.fighters.map(() => 0), dead: false,
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
      for (let k = 0; k < b.cool.length; k++) b.cool[k] = Math.max(0, b.cool[k]! - dt);
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
          if (!f.alive || (b.cool[f.idx] ?? 0) > 0) continue;
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
      // 착지 뒤 겹친 몸을 꺼내면서 발이 한 그리드 칸 위로 올라갈 수 있다.
      if ((t.solidAt(x, f.y) || t.solidAt(x, f.y + CELL)) && (dx === 0 || !t.solidAt(x, f.y - 4))) return true;
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
    if (f.y > this.ringOutY) {
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
        f.slope = this.groundSlope(f);
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
    if (this.time - this.lastBlastT < 0.12) this.setPhase('EXPLOSION');
    else if (this.chunks.length || this.boulders.length) this.setPhase('TERRAIN_COLLAPSE');
    else this.setPhase('PHYSICS_SETTLING');
    if (this.settleT > SETTLE_LIMIT && !this.forced) {
      this.forced = true;
      this.forceStabilize();
    }
    // 강제 안정화 뒤에도 멈추지 않으면 그냥 턴을 넘긴다(무한 대기 방지)
    if ((this.isQuiet() && this.settleT >= MIN_SETTLE_HOLD) || this.settleT > SETTLE_LIMIT + 0.3) this.toTurnEnd();
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
        if (s < 0 || s > this.ringOutY) {
          f.y = this.ringOutY + 40;
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

  teamAlive(team: Team): boolean {
    return this.fighters.some((f) => f.team === team && f.alive);
  }

  /** 편의 남은 체력 비율(합계) */
  teamHpRatio(team: Team): number {
    let hp = 0, max = 0;
    for (const f of this.fighters) if (f.team === team) { hp += f.hp; max += f.maxHp; }
    return max ? hp / max : 0;
  }

  /** 다음 차례: 상대 편에서, 그 편이 지난번에 쏜 장수 다음 사람(쓰러진 장수는 건너뛴다) */
  nextPlayer(): number {
    if (this.cfg.freeForAll) {
      for (let step = 1; step < this.fighters.length; step++) {
        const next = (this.current + step) % this.fighters.length;
        if (this.fighters[next]!.alive) return next;
      }
      return this.current;
    }
    const team = (1 - this.cur.team) as Team;
    const mates = this.fighters.filter((f) => f.team === team);
    for (let k = 0; k < mates.length; k++) {
      const f = mates[(this.teamPtr[team]! + k) % mates.length]!;
      if (f.alive) return f.idx;
    }
    return this.fighters.find((f) => f.alive)?.idx ?? this.current;
  }

  private resolveTurnEnd(): void {
    const alive = this.sides.filter(team => this.teamAlive(team));
    if (alive.length === 0) return this.endGame(-1, 'draw');
    if (alive.length === 1) {
      const w = alive[0]!;
      const losers = this.fighters.filter((f) => f.team !== w);
      return this.endGame(w, losers.every((f) => f.deathCause === 'fall') ? 'fall' : 'hp');
    }
    if (this.cfg.turnLimit > 0 && this.turnNo >= this.cfg.turnLimit) {
      const ratios = alive.map(team => this.teamHpRatio(team));
      const max = Math.max(...ratios);
      const leaders = alive.filter((_, i) => Math.abs(ratios[i]! - max) < 1e-9);
      return leaders.length === 1 ? this.endGame(leaders[0]!, 'limit') : this.endGame(-1, 'draw');
    }
    this.startTurn(this.nextPlayer());
  }

  private endGame(winner: Team | -1, reason: 'hp' | 'fall' | 'limit' | 'draw'): void {
    this.winner = winner;
    this.endReason = winner === -1 ? 'draw' : reason;
    this.setPhase('GAME_OVER');
    for (const f of this.fighters) {
      if (winner === f.team) { f.anim = 'victory'; f.animT = 0; }
      else if (f.alive && winner !== -1) { f.anim = 'defeat'; f.animT = 0; }
    }
    this.emit({ type: 'gameOver', winner, reason: this.endReason as 'hp' | 'fall' | 'limit' | 'draw' });
  }

  // ───────── 예상 궤적·AI용 ─────────

  /** 지형을 바꾸지 않고 한 발을 끝까지 따라가 본다 */
  dryShot(fIdx: number, slot: WeaponSlot, angle: number, power: number, from?: { x: number; y: number }): DryResult {
    const f = this.fighters[fIdx]!;
    const saved = { x: f.x, y: f.y, angle: f.angle, proj: this.projectiles, sched: this.scheduled, quiet: this.quiet, rng: this.rng.state, nextId: this.nextId };
    if (from) { f.x = from.x; f.y = from.y; }
    f.angle = angle;
    const res: DryResult = { damage: this.fighters.map(() => 0), impacts: [], enemyGroundHit: 0, outOfWorld: false, flightTime: 0 };
    this.dry = res;
    this.quiet = true;
    this.projectiles = [];
    this.scheduled = [];
    const w = this.weaponOf(f, slot);
    const sp = (power / 100) * MAX_LAUNCH_SPEED;
    const launch = this.launchAngle(f, angle);
    const angles = w.pattern === 'triple' ? Array.from({length:w.count??3},(_,i)=>launch+(i-((w.count??3)-1)/2)*(w.spreadDeg??3)) : [launch];
    const powers = w.pattern === 'salvo' ? Array.from({length:w.count??3},(_,i)=>clamp(power+(i===0?0:(i%2===1?1:-1)*Math.ceil(i/2)*(w.salvoPowerStep??3)),0,100)) : [power];
    const steady = this.steadyReady(f) && (!from || (Math.abs(from.x - saved.x) < 0.5 && Math.abs(from.y - saved.y) < 0.5));
    for (const a of angles) {
      for (const pw of powers) {
        const [mx, my] = this.muzzle(f, a);
        const s = pw === power ? sp : (pw / 100) * MAX_LAUNCH_SPEED;
        const vx = Math.cos(a * DEG) * s, vy = -Math.sin(a * DEG) * s;
        const q = this.newProjectile(fIdx, 0, w.id, mx, my, vx, vy);
        if (steady) q.boost = TRAIT.steadyDamage;
        this.projectiles.push(q);
        if (w.pattern === 'echo') {
          for (const [x, y] of this.echoOrigins(mx, my, a <= 90 ? 1 : -1, w.count ?? 2)) {
            this.projectiles.push(this.newProjectile(fIdx, 0, w.id, x, y, vx, vy));
          }
        }
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
    const angle = this.launchAngle(f);
    const [mx, my] = this.muzzle(f, angle);
    const sp = (power / 100) * MAX_LAUNCH_SPEED;
    const a = angle * DEG;
    let vx = Math.cos(a) * sp, vy = -Math.sin(a) * sp, x = mx, y = my;
    const pts = [{ x, y }];
    for (let t = 0; t < maxT; t += DT) {
      vx += this.wind * WIND_ACC_PER_UNIT * DT;
      vy += GRAVITY * DT;
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
    b.fighters = this.fighters.map((f) => ({ ...f, stats: { ...f.stats } }));
    b.teamPtr = [...this.teamPtr];
    b.projectiles = this.projectiles.map((p) => ({ ...p }));
    b.boulders = this.boulders.map((x) => ({ ...x, cool: [...x.cool] }));
    b.chunks = this.chunks.map((c) => ({ ...c, hit: [...c.hit] }));
    b.scheduled = this.scheduled.map((s) => ({ ...s }));
    b.clouds = this.clouds.map((c) => ({ ...c, turns: [...c.turns] }));
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
    const f = this.fighters.map((x) => `${x.x.toFixed(3)},${x.y.toFixed(3)},${x.hp},${x.alive ? 1 : 0},${x.slot},${x.turnsTaken},${x.nextUltimateTurn}`).join('|');
    const gas = this.clouds.map((c) => `${c.id},${c.x.toFixed(2)},${c.y.toFixed(2)},${c.turns.join(',')}`).join('|');
    return `${this.terrain.checksum()}:${f}:${gas}:${this.wind}:${this.turnNo}:${this.phase}:${this.rng.state}`;
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
      clouds: this.clouds,
      rng: this.rng.state,
      s: [this.time, this.stepNo, this.phaseT, this.current, this.turnNo, this.wind, this.timeLeft, this.shotT, this.lastBlastT, this.settleT, this.nextId, this.shotNo],
      phase: this.phase,
      winner: this.winner,
      endReason: this.endReason,
      shotDamage: [...this.shotDamage],
      shotHit: [...this.shotHit],
      teamPtr: this.teamPtr,
    });
  }

  static deserialize(json: string): Battle {
    const o = JSON.parse(json);
    const b = new Battle(o.cfg, true);
    b.terrain = Terrain.deserialize(o.terrain);
    b.fighters = o.fighters.map(({ ultimateUsed, ...f }: Fighter & { ultimateUsed?: boolean }) => {
      const turnsTaken = f.turnsTaken ?? 0;
      const nextUltimateTurn = f.nextUltimateTurn ?? (ultimateUsed ? turnsTaken + ULTIMATE_RECHARGE_TURNS : ULTIMATE_TURN);
      return { ...f, turnsTaken, nextUltimateTurn };
    });
    b.projectiles = (o.projectiles as Projectile[]).map(p => ({
      ...p, homingAdjusted: p.homingAdjusted ?? ((p.seekTarget ?? -1) >= 0),
    }));
    b.boulders = o.boulders;
    b.chunks = o.chunks.map((c: Chunk & { cells: number[]; mats: number[]; bottom: number[] }) => ({ ...c, cells: Int32Array.from(c.cells), mats: Uint8Array.from(c.mats), bottom: Int32Array.from(c.bottom) }));
    b.scheduled = o.scheduled;
    b.clouds = o.clouds ?? [];
    b.rng.state = o.rng;
    [b.time, b.stepNo, b.phaseT, b.current, b.turnNo, b.wind, b.timeLeft, b.shotT, b.lastBlastT, b.settleT, b.nextId, b.shotNo] = o.s;
    b.phase = o.phase;
    b.winner = o.winner;
    b.endReason = o.endReason;
    b.shotDamage = new Map(o.shotDamage);
    b.shotHit = new Set(o.shotHit);
    b.teamPtr = o.teamPtr ?? [0, 0];
    return b;
  }
}

export const ALL_CHARACTER_IDS = CHARACTERS.map((c) => c.id);
export const ALL_WEAPON_IDS = Object.keys(WEAPONS);
