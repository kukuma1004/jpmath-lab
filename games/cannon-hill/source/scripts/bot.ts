/**
 * 화면 없이 AI끼리 붙여 승률·턴 수·이상 상황을 본다.
 *   npx vite-node scripts/bot.ts -- --rounds=2 --diff=normal
 * 모든 장수 쌍을 양쪽 자리를 바꿔 가며, 전장을 돌려 가며 싸운다.
 */
import { Battle, defaultConfig } from '../src/game/combat/battle';
import { AIActor } from '../src/game/ai/ai';
import { CHARACTERS } from '../src/game/data/characters';
import { MAPS } from '../src/game/data/maps';
import type { Difficulty } from '../src/game/combat/types';
import { DT } from '../src/game/config/constants';

const args = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')) as [string, string][]);
const rounds = Number(args.rounds ?? 1);
const diff = (args.diff ?? 'normal') as Difficulty;
const only = args.char;
const diffB = (args.vs ?? diff) as Difficulty; // 2P 난이도(실력 차이 확인용)
const diffWins: Record<string, number> = {};

const ids = CHARACTERS.map((c) => c.id);
const stat: Record<string, { w: number; l: number; d: number; dealt: number; games: number }> = {};
for (const id of ids) stat[id] = { w: 0, l: 0, d: 0, dealt: 0, games: 0 };
const mapStat: Record<string, { games: number; turns: number; falls: number }> = {};
const problems: string[] = [];
const ev: Record<string, number> = {};
let games = 0, totalTurns = 0, maxSettle = 0;
const t0 = Date.now();

for (let r = 0; r < rounds; r++) {
  for (let i = 0; i < ids.length; i++) {
    for (let j = 0; j < ids.length; j++) {
      if (i === j) continue;
      if (only && ids[i] !== only && ids[j] !== only) continue;
      const map = MAPS[(games + r) % MAPS.length]!;
      const seed = 1000 + games * 7919 + r;
      const b = new Battle(defaultConfig({ mapId: map.id, seed, chars: [ids[i]!, ids[j]!], controllers: ['ai', 'ai'], difficulty: diff, turnLimit: 30 }));
      b.recording = false;
      b.quiet = false; // 사건 수를 센다
      // 실력 비교일 때는 판마다 자리를 바꾼다
      const swap = diffB !== diff && games % 2 === 1;
      const dA = swap ? diffB : diff, dB = swap ? diff : diffB;
      const actors = [new AIActor(0, dA, 0), new AIActor(1, dB, 0)];
      let steps = 0, settleSteps = 0, lastTurn = -1;
      while (b.phase !== 'GAME_OVER' && steps < 60 * 60 * 40) {
        for (const a of actors) a.update(b, 1e9);
        b.step();
        for (const e of b.drainEvents()) {
          const k = e.type === 'damage' ? `damage:${e.cause}` : e.type;
          ev[k] = (ev[k] ?? 0) + 1;
        }
        steps++;
        if (['PROJECTILE_FLIGHT', 'EXPLOSION', 'TERRAIN_COLLAPSE', 'PHYSICS_SETTLING'].includes(b.phase)) settleSteps++;
        else if (settleSteps) { maxSettle = Math.max(maxSettle, settleSteps * DT); settleSteps = 0; }
        if (b.phase === 'AIM' && b.turnNo !== lastTurn) {
          lastTurn = b.turnNo;
          for (const f of b.fighters) {
            if (f.alive && [2, 6, 10, 14, 18].some((k) => b.terrain.solidAt(f.x, f.y - k))) problems.push(`끼임: ${map.id} seed ${seed} 턴 ${b.turnNo} ${f.charId} (${f.x.toFixed(0)},${f.y.toFixed(0)})`);
            if (f.alive && !f.onGround) problems.push(`공중에서 턴 시작: ${map.id} seed ${seed} 턴 ${b.turnNo} ${f.charId}`);
          }
        }
      }
      if (b.phase !== 'GAME_OVER') problems.push(`끝나지 않음: ${map.id} seed ${seed} ${ids[i]} vs ${ids[j]} 단계 ${b.phase}`);
      if (b.winner === 0 || b.winner === 1) { const d = b.winner === 0 ? dA : dB; diffWins[d] = (diffWins[d] ?? 0) + 1; }
      games++;
      totalTurns += b.turnNo;
      const ms = (mapStat[map.id] ??= { games: 0, turns: 0, falls: 0 });
      ms.games++;
      ms.turns += b.turnNo;
      if (b.endReason === 'fall') ms.falls++;
      for (const k of [0, 1] as const) {
        const s = stat[b.fighters[k].charId]!;
        s.games++;
        s.dealt += b.fighters[k].stats.damageDealt;
        if (b.winner === -1) s.d++;
        else if (b.winner === k) s.w++;
        else s.l++;
      }
      process.stdout.write(`\r${games}판 (${((Date.now() - t0) / 1000).toFixed(0)}초)`);
    }
  }
}

console.log(`\n\n난이도 ${diff}, ${games}판, 평균 ${(totalTurns / games).toFixed(1)}턴, 가장 긴 정착 ${maxSettle.toFixed(1)}초, ${((Date.now() - t0) / 1000).toFixed(0)}초 걸림\n`);
console.log('장수         승  패  무  승률   한 판 평균 피해');
for (const id of ids) {
  const s = stat[id]!;
  if (!s.games) continue;
  const name = CHARACTERS.find((c) => c.id === id)!.name.padEnd(8, '　');
  console.log(`${name} ${String(s.w).padStart(3)} ${String(s.l).padStart(3)} ${String(s.d).padStart(3)}  ${((s.w / s.games) * 100).toFixed(0).padStart(3)}%   ${(s.dealt / s.games).toFixed(0)}`);
}
console.log('\n전장        판  평균 턴  낙사로 끝');
for (const [id, m] of Object.entries(mapStat)) console.log(`${id.padEnd(11)} ${String(m.games).padStart(3)}  ${(m.turns / m.games).toFixed(1).padStart(6)}  ${m.falls}`);
console.log('\n사건 수: ' + ['boulder', 'rockHit', 'chunk', 'chunkLand', 'fuse', 'bounce', 'split', 'lightning', 'forced', 'damage:blast', 'damage:rock', 'damage:crush', 'damage:fall', 'death'].map((k) => `${k} ${ev[k] ?? 0}`).join(', '));
if (diffB !== diff) console.log(`\n실력별 승리: ${JSON.stringify(diffWins)}`);
if (problems.length) {
  console.log(`\n문제 ${problems.length}건:`);
  for (const p of problems.slice(0, 30)) console.log(' - ' + p);
} else console.log('\n문제 없음');
