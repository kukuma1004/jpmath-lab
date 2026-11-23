import { DT, WALK_SPEED } from '../config/constants';
import { Battle, type DryResult } from '../combat/battle';
import type { Difficulty, Fighter, Phase } from '../combat/types';
import { Rng, clamp, hashString } from '../utils/rng';

/**
 * AI는 실제 포탄 물리(battle.dryShot)로 후보를 거르고,
 * 상위 몇 개는 전투 전체를 복제해 붕괴·낙하까지 끝까지 돌려 본다.
 * 화면에 보이지 않는 정보(다음 턴 바람 등)는 쓰지 않는다.
 */

interface Level {
  angleLo: number;
  angleHi: number;
  angleStep: number;
  powerLo: number;
  powerStep: number;
  refine: number; // 다듬기 횟수
  refineTop: number;
  full: number; // 끝까지 돌려 볼 후보 수
  noiseAngle: number;
  noisePower: number;
  moves: number; // 고려하는 이동 위치 수(0이면 제자리)
  pickTop: number; // 상위 몇 개 중에서 고를지
}

const LEVELS: Record<Difficulty, Level> = {
  easy: { angleLo: 10, angleHi: 80, angleStep: 7, powerLo: 15, powerStep: 7, refine: 0, refineTop: 0, full: 0, noiseAngle: 6.5, noisePower: 8, moves: 1, pickTop: 3 },
  normal: { angleLo: 5, angleHi: 85, angleStep: 4, powerLo: 10, powerStep: 4, refine: 1, refineTop: 2, full: 2, noiseAngle: 2.3, noisePower: 3.2, moves: 1, pickTop: 1 },
  hard: { angleLo: 0, angleHi: 88, angleStep: 4, powerLo: 5, powerStep: 4, refine: 2, refineTop: 3, full: 4, noiseAngle: 0.9, noisePower: 1.4, moves: 2, pickTop: 1 },
};

export interface AIPlan {
  slot: 0 | 1;
  angle: number;
  power: number;
  walkDir: -1 | 0 | 1;
  walkSteps: number;
  score: number;
  exact: { angle: number; power: number };
}

interface Cand {
  pos: number;
  slot: 0 | 1;
  angle: number;
  power: number;
  score: number;
  full?: number;
}

interface Pos {
  x: number;
  y: number;
  dir: -1 | 0 | 1;
  steps: number;
}

/** 실제 걷기 코드로 이동 결과를 미리 계산한다 */
export function predictWalk(b: Battle, f: Fighter, dir: -1 | 1, maxDist: number): Pos | null {
  const copy: Fighter = { ...f, stats: { ...f.stats } };
  let left = Math.min(maxDist, f.moveLeft);
  let steps = 0;
  let stall = 0;
  while (left > 0.01 && steps < 600) {
    const moved = b.walk(copy, dir * Math.min(WALK_SPEED * DT, left));
    steps++;
    if (!copy.onGround) return null; // 낭떠러지로 걸어 나가는 자리는 버린다
    left -= Math.abs(moved);
    if (Math.abs(moved) < 0.01) {
      if (++stall > 3) break;
    } else stall = 0;
  }
  if (Math.abs(copy.x - f.x) < 12) return null;
  return { x: copy.x, y: copy.y, dir, steps };
}

/** 상대(들)에게 준 피해 − 우리 편(나 포함)이 입은 피해의 1.5배 */
function scoreDry(r: DryResult, allies: Fighter[], foes: Fighter[]): number {
  let enemy = 0, self = 0;
  for (const f of foes) enemy += r.damage[f.idx] ?? 0;
  for (const f of allies) self += r.damage[f.idx] ?? 0;
  let s = enemy - 1.5 * self + r.enemyGroundHit * 45;
  if (enemy <= 0) {
    let best = 1e9;
    for (const p of r.impacts) for (const foe of foes) best = Math.min(best, Math.hypot(p.x - foe.x, p.y - (foe.y - 20)));
    s -= best === 1e9 ? 400 : best / 5;
  }
  return s;
}

export class AIPlanner {
  done = false;
  plan: AIPlan | null = null;
  sims = 0;
  private it: Generator<void, AIPlan, void>;

  constructor(private b: Battle, private idx: number, private diff: Difficulty, private forceSlots?: (0 | 1)[]) {
    this.it = this.search();
  }

  /** 시간 예산(ms) 또는 시뮬레이션 횟수만큼 생각한다. 끝나면 true */
  work(budgetMs: number, maxSims = Infinity): boolean {
    if (this.done) return true;
    const t0 = performance.now();
    let n = 0;
    try {
      while (performance.now() - t0 < budgetMs && n < maxSims) {
        const r = this.it.next();
        n++;
        if (r.done) {
          this.plan = r.value;
          this.done = true;
          return true;
        }
      }
    } catch (err) {
      // 계산이 실패하면 기본 공격으로 복구한다
      console.warn('AI 계산 실패, 기본 공격으로 대신합니다', err);
      this.plan = this.fallback();
      this.done = true;
      return true;
    }
    return false;
  }

  runToEnd(): AIPlan {
    while (!this.work(1e9, 1e9));
    return this.plan!;
  }

  private fallback(): AIPlan {
    const me = this.b.fighters[this.idx]!;
    const foe = this.b.nearestEnemy(me);
    const angle = foe.x > me.x ? 55 : 125;
    return { slot: 0, angle, power: 72, walkDir: 0, walkSteps: 0, score: 0, exact: { angle, power: 72 } };
  }

  private *search(): Generator<void, AIPlan, void> {
    const b = this.b;
    const lv = LEVELS[this.diff];
    const me = b.fighters[this.idx]!;
    const foes = b.enemiesOf(me).filter((f) => f.alive);
    const allies = b.alliesOf(me).filter((f) => f.alive);
    const rng = new Rng(hashString(`${b.cfg.seed}:${b.turnNo}:${this.idx}:${this.diff}`));

    const positions: Pos[] = [{ x: me.x, y: me.y, dir: 0, steps: 0 }];
    const inGas = b.clouds.some((c) => (c.turns[me.idx] ?? 0) > 0 && b.inCloud(me, c));
    if (lv.moves > 0 || inGas) {
      for (const dir of [-1, 1] as const) {
        const p = predictWalk(b, me, dir, Math.min(me.moveLeft, inGas ? 150 : 95));
        if (p) positions.push(p);
      }
    }
    const slots: (0 | 1)[] = [0, 1];
    if (this.forceSlots) slots.splice(0, slots.length, ...this.forceSlots);
    const gasPenalty = positions.map((p) => b.clouds.reduce((sum, c) =>
      sum + ((c.turns[me.idx] ?? 0) > 0 && b.inCloud({ ...me, x: p.x, y: p.y }, c) ? c.damage * 1.4 : 0), 0));

    // 쏠 방향: 가장 가까운 상대 쪽 먼저, 상대가 양쪽에 있으면 반대쪽도 본다
    const dirsAt = (px: number): (1 | -1)[] => {
      const near = b.nearestEnemy(me, px);
      const first: 1 | -1 = near.x >= px ? 1 : -1;
      const out: (1 | -1)[] = [first];
      if (foes.some((f) => (f.x >= px ? 1 : -1) !== first)) out.push(-first as 1 | -1);
      return out;
    };
    const toAbs = (rel: number, dir: 1 | -1) => (dir > 0 ? rel : 180 - rel);
    const all: Cand[] = [];
    const evalDry = (c: Cand) => {
      const pos = positions[c.pos]!;
      const r = b.dryShot(this.idx, c.slot, c.angle, c.power, { x: pos.x, y: pos.y });
      this.sims++;
      c.score = scoreDry(r, allies, foes) - gasPenalty[c.pos]!;
      if (pos.dir !== 0) c.score -= 6; // 같은 값이면 덜 움직인다
      return c;
    };

    for (let pi = 0; pi < positions.length; pi++) {
      const px = positions[pi]!.x;
      for (const dir of dirsAt(px)) {
        for (const slot of slots) {
          for (let rel = lv.angleLo; rel <= lv.angleHi + 1e-6; rel += lv.angleStep) {
            for (let pw = lv.powerLo; pw <= 100 + 1e-6; pw += lv.powerStep) {
              all.push(evalDry({ pos: pi, slot, angle: toAbs(rel, dir), power: Math.min(100, pw), score: 0 }));
              yield;
            }
          }
        }
      }
    }
    all.sort((a, b2) => b2.score - a.score);

    // 다듬기: 좋은 후보 둘레를 촘촘히
    let top = all.slice(0, Math.max(1, lv.refineTop));
    let da = lv.angleStep / 2, dp = lv.powerStep / 2;
    for (let r = 0; r < lv.refine; r++) {
      const extra: Cand[] = [];
      for (const c of top) {
        for (const ka of [-1, 0, 1]) {
          for (const kp of [-1, 0, 1]) {
            if (!ka && !kp) continue;
            extra.push(evalDry({ ...c, angle: clamp(c.angle + ka * da, 0, 180), power: clamp(c.power + kp * dp, 5, 100), score: 0 }));
            yield;
          }
        }
      }
      all.push(...extra);
      all.sort((a, b2) => b2.score - a.score);
      top = all.slice(0, Math.max(1, lv.refineTop));
      da /= 2;
      dp /= 2;
    }

    // 끝까지 돌려 보기: 지형 붕괴·낙사까지 반영
    const distinct: Cand[] = [];
    for (const c of all) {
      if (distinct.length >= lv.full) break;
      if (distinct.some((d) => d.pos === c.pos && d.slot === c.slot && Math.abs(d.angle - c.angle) < 2 && Math.abs(d.power - c.power) < 3)) continue;
      distinct.push(c);
    }
    for (const c of distinct) {
      const pos = positions[c.pos]!;
      const sim = b.clone();
      const f = sim.fighters[this.idx]!;
      f.x = pos.x;
      f.y = pos.y;
      if (pos.dir !== 0) f.moved = true;
      f.slot = c.slot;
      f.angle = c.angle;
      sim.phase = 'AIM' as Phase;
      const hp0 = sim.fighters.map((x) => x.hp);
      sim.fireNow(c.power);
      let n = 0;
      while (n < 900 && sim.phase !== 'TURN_END' && sim.phase !== 'GAME_OVER') {
        sim.step();
        n++;
        if (n % 90 === 0) yield;
      }
      let gain = 0;
      for (const e of foes) {
        const sf = sim.fighters[e.idx]!;
        gain += (hp0[e.idx]! - sf.hp) + (sf.alive ? 0 : 1500);
      }
      for (const a of allies) {
        const sa = sim.fighters[a.idx]!;
        gain -= 1.5 * (hp0[a.idx]! - sa.hp) + (sa.alive ? 0 : a.idx === this.idx ? 2500 : 2000);
      }
      c.full = gain - gasPenalty[c.pos]! - (pos.dir !== 0 ? 6 : 0);
      yield;
    }
    let pool: Cand[];
    if (distinct.length) {
      pool = [...distinct].sort((a, b2) => (b2.full ?? -1e9) - (a.full ?? -1e9));
      // 끝까지 돌린 결과가 모두 헛방이면 대략 점수 1위를 쓴다
      if ((pool[0]!.full ?? 0) <= 0 && all[0]!.score > (pool[0]!.full ?? 0)) pool = [all[0]!, ...pool];
    } else pool = all.slice(0, lv.pickTop);
    const pick = pool[Math.min(pool.length - 1, Math.floor(rng.next() * Math.max(1, Math.min(lv.pickTop, pool.length))))]!;

    // 사람처럼 오차를 섞는다(어려움도 완벽하지 않다)
    const angle = clamp(pick.angle + rng.gauss() * lv.noiseAngle, 0, 180);
    const power = clamp(pick.power + rng.gauss() * lv.noisePower, 5, 100);
    const pos = positions[pick.pos]!;
    return {
      slot: pick.slot, angle, power, walkDir: pos.dir, walkSteps: pos.steps, score: pick.full ?? pick.score,
      exact: { angle: pick.angle, power: pick.power },
    };
  }
}

/** 계획을 실제 입력으로 옮긴다. 사람과 같은 명령만 쓴다. */
export class AIActor {
  planner: AIPlanner | null = null;
  plan: AIPlan | null = null;
  stage: 'idle' | 'think' | 'walk' | 'aim' | 'charge' | 'done' = 'idle';
  private turnKey = -1;
  private walked = 0;
  private waitT = 0;
  thinkT = 0;

  constructor(public idx: number, public diff: Difficulty, public minThink = 0.18) {}

  /** 시뮬레이션 한 걸음 전에 부른다. budgetMs는 이번 프레임에 생각할 시간 */
  update(b: Battle, budgetMs: number, maxSims = Infinity): void {
    if (b.current !== this.idx || !b.isPlayerPhase()) {
      if (b.phase === 'TURN_START' || b.phase === 'TURN_END') this.stage = 'idle';
      return;
    }
    if (this.turnKey !== b.turnNo) {
      this.turnKey = b.turnNo;
      this.stage = 'think';
      this.planner = new AIPlanner(b, this.idx, this.diff);
      this.plan = null;
      this.walked = 0;
      this.thinkT = 0;
    }
    const f = b.fighters[this.idx]!;
    switch (this.stage) {
      case 'think':
        this.thinkT += DT;
        if (this.planner!.work(budgetMs, maxSims) && this.thinkT >= this.minThink) {
          this.plan = this.planner!.plan;
          this.stage = this.plan!.walkDir !== 0 ? 'walk' : 'aim';
          b.selectWeapon(this.plan!.slot);
        }
        break;
      case 'walk':
        if (this.walked < this.plan!.walkSteps && f.moveLeft > 0) {
          b.setMove(this.plan!.walkDir);
          this.walked++;
        } else {
          b.setMove(0);
          this.stage = 'aim';
          this.waitT = 0;
        }
        break;
      case 'aim': {
        const d = this.plan!.angle - f.angle;
        if (Math.abs(d) > 1.2) { b.setAim(0); b.setAngle(f.angle + clamp(d, -150 * DT, 150 * DT)); }
        else {
          b.setAim(0);
          b.setAngle(this.plan!.angle);
          this.waitT += DT;
          if (this.waitT > 0.08) {
            b.selectWeapon(this.plan!.slot);
            b.setCharge(true);
            this.stage = 'charge';
          }
        }
        break;
      }
      case 'charge':
        if (f.power >= this.plan!.power - 0.6 || f.chargeDir < 0) {
          b.fireNow(this.plan!.power);
          this.stage = 'done';
        }
        break;
      default:
        break;
    }
  }
}
