/**
 * 화면 없이 AI끼리 붙여 승률·턴 수·이상 상황을 본다.
 *   npx vite-node scripts/bot.ts -- --rounds=2 --diff=normal
 *   npx vite-node scripts/bot.ts -- --team=2 --games=60      (2:2, 장수 조합은 시드로 섞는다)
 * 1:1은 모든 장수 쌍을 양쪽 자리를 바꿔 가며, 전장을 돌려 가며 싸운다.
 */
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { AIActor } from '../src/game/ai/ai';
import { CHARACTERS } from '../src/game/data/characters';
import { MAPS } from '../src/game/data/maps';
import type { Difficulty } from '../src/game/combat/types';
import { DT } from '../src/game/config/constants';
import { Rng } from '../src/game/utils/rng';

const args = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')) as [string, string][]);
const rounds = Number(args.rounds ?? 1);
const diff = (args.diff ?? 'normal') as Difficulty;
const only = args.char;
const diffB = (args.vs ?? diff) as Difficulty; // 2편 난이도(실력 차이 확인용)
const teamSize = Number(args.team ?? 1);
const teamGames = Number(args.games ?? 60);
const turnLimit = Number(args.turns ?? 0);
const diffWins: Record<string, number> = {};

const ids = CHARACTERS.map((c) => c.id);
const stat: Record<string, { w: number; l: number; d: number; dealt: number; games: number }> = {};
for (const id of ids) stat[id] = { w: 0, l: 0, d: 0, dealt: 0, games: 0 };
const mapStat: Record<string, { games: number; turns: number; falls: number; limit: number }> = {};
const problems: string[] = [];
const ev: Record<string, number> = {};
let games = 0, totalTurns = 0, maxSettle = 0, friendly = 0;
const t0 = Date.now();

function play(chars: string[], mapIdx: number, seed: number): void {
  const map = MAPS[mapIdx % MAPS.length]!;
  const b = new Battle(defaultConfig({ mapId: map.id, seed, chars, controllers: chars.map(() => 'ai' as const), difficulty: diff, turnLimit }));
  b.recording = false;
  b.quiet = false; // 사건 수를 센다
  // 실력 비교일 때는 판마다 자리를 바꾼다
  const swap = diffB !== diff && games % 2 === 1;
  const dTeam = (team: number) => ((team === 0) !== swap ? diff : diffB);
  const actors = b.fighters.map((f) => new AIActor(f.idx, dTeam(f.team), 0));
  let steps = 0, settleSteps = 0, lastTurn = -1;
  while (b.phase !== 'GAME_OVER' && steps < 60 * 60 * 60) {
    for (const a of actors) a.update(b, 1e9);
    b.step();
    for (const e of b.drainEvents()) {
      const k = e.type === 'damage' ? `damage:${e.cause}` : e.type;
      ev[k] = (ev[k] ?? 0) + 1;
      if (e.type === 'damage' && e.cause === 'blast') {
        const shooter = b.cur;
        if (b.fighters[e.target]!.team === shooter.team && e.target !== shooter.idx) friendly++;
      }
    }
    steps++;
    if (['PROJECTILE_FLIGHT', 'EXPLOSION', 'TERRAIN_COLLAPSE', 'PHYSICS_SETTLING'].includes(b.phase)) settleSteps++;
    else if (settleSteps) { maxSettle = Math.max(maxSettle, settleSteps * DT); settleSteps = 0; }
    if (b.phase === 'AIM' && b.turnNo !== lastTurn) {
      lastTurn = b.turnNo;
      if (!b.cur.alive) problems.push(`쓰러진 장수 차례: ${map.id} seed ${seed} 턴 ${b.turnNo}`);
      for (const f of b.fighters) {
        if (f.alive && [2, 6, 10, 14, 18].some((k) => b.terrain.solidAt(f.x, f.y - k))) problems.push(`끼임: ${map.id} seed ${seed} 턴 ${b.turnNo} ${f.charId} (${f.x.toFixed(0)},${f.y.toFixed(0)})`);
        if (f.alive && !f.onGround) problems.push(`공중에서 턴 시작: ${map.id} seed ${seed} 턴 ${b.turnNo} ${f.charId}`);
      }
    }
  }
  if (b.phase !== 'GAME_OVER') problems.push(`끝나지 않음: ${map.id} seed ${seed} ${chars.join(',')} 단계 ${b.phase}`);
  if (b.winner === 0 || b.winner === 1) { const d = dTeam(b.winner); diffWins[d] = (diffWins[d] ?? 0) + 1; }
  games++;
  totalTurns += b.turnNo;
  const ms = (mapStat[map.id] ??= { games: 0, turns: 0, falls: 0, limit: 0 });
  ms.games++;
  ms.turns += b.turnNo;
  if (b.endReason === 'fall') ms.falls++;
  if (b.endReason === 'limit') ms.limit++;
  for (const f of b.fighters) {
    const s = stat[f.charId]!;
    s.games++;
    s.dealt += f.stats.damageDealt;
    if (b.winner === -1) s.d++;
    else if (b.winner === f.team) s.w++;
    else s.l++;
  }
  process.stdout.write(`\r${games}판 (${((Date.now() - t0) / 1000).toFixed(0)}초)`);
}

if (teamSize === 2) {
  const rng = new Rng(4242);
  for (let g = 0; g < teamGames; g++) {
    const pick = () => ids[Math.floor(rng.next() * ids.length)]!;
    let chars = [pick(), pick(), pick(), pick()];
    if (only && !chars.includes(only)) chars[g % 4] = only;
    play(chars, g, 7000 + g * 104729);
  }
} else {
  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < ids.length; j++) {
        if (i === j) continue;
        if (only && ids[i] !== only && ids[j] !== only) continue;
        play([ids[i]!, ids[j]!], games + r, 1000 + games * 7919 + r);
      }
    }
  }
}

console.log(`\n\n${teamSize === 2 ? '2:2' : '1:1'} 난이도 ${diff}, ${games}판, 평균 ${(totalTurns / games).toFixed(1)}턴, 가장 긴 정착 ${maxSettle.toFixed(1)}초, ${((Date.now() - t0) / 1000).toFixed(0)}초 걸림\n`);
console.log('장수         승  패  무  승률   한 판 평균 피해');
for (const id of ids) {
  const s = stat[id]!;
  if (!s.games) continue;
  const name = CHARACTERS.find((c) => c.id === id)!.name.padEnd(8, '　');
  console.log(`${name} ${String(s.w).padStart(3)} ${String(s.l).padStart(3)} ${String(s.d).padStart(3)}  ${((s.w / s.games) * 100).toFixed(0).padStart(3)}%   ${(s.dealt / s.games).toFixed(0)}`);
}
console.log('\n전장        판  평균 턴  낙사로 끝  턴 다 씀');
for (const [id, m] of Object.entries(mapStat)) console.log(`${id.padEnd(11)} ${String(m.games).padStart(3)}  ${(m.turns / m.games).toFixed(1).padStart(6)}  ${String(m.falls).padStart(8)}  ${String(m.limit).padStart(7)}`);
console.log('\n사건 수: ' + ['boulder', 'rockHit', 'chunk', 'chunkLand', 'fuse', 'bounce', 'split', 'lightning', 'forced', 'damage:blast', 'damage:rock', 'damage:crush', 'damage:fall', 'death'].map((k) => `${k} ${ev[k] ?? 0}`).join(', '));
if (teamSize === 2) console.log(`같은 편 맞힘(쏜 사람 제외): ${friendly}번`);
if (diffB !== diff) console.log(`\n실력별 승리: ${JSON.stringify(diffWins)}`);
if (problems.length) {
  console.log(`\n문제 ${problems.length}건:`);
  for (const p of problems.slice(0, 30)) console.log(' - ' + p);
} else console.log('\n문제 없음');
