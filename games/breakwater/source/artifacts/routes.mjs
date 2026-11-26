import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import { newCombat, tickCombat, LANES } from '../src/combat.js'
import { STAGES } from '../src/campaign.js'

export function switchesFor(stage) {
  const pace = STAGES[stage].pace ?? 1
  const swap = { 1: 7.05, 5: 15.8, 7: 24.45 }[stage] ?? Infinity
  const { recruit, upgrade } = LANES
  return [
    [0, recruit], [3.57 / pace, upgrade], [7.05, recruit], [11.1, upgrade],
    [15.8, recruit], [19.56, upgrade], [24.45, recruit], [stage < 3 ? 35.2 : 43.05, 0],
  ].map(([at, x]) => [at, at >= swap ? -x : x])
}

export function positionFor(run) {
  if (run.boss) {
    if (!run.alarm) return run.boss.x
    return [0, -2.15, 2.15, -3.18, 3.18].filter(x =>
      run.alarm.zones.every(zone => Math.abs(zone.x - x) > zone.width / 2 + 0.22))
      .sort((a, b) => Math.abs(a - run.boss.x) - Math.abs(b - run.boss.x))[0] ?? 0
  }
  return switchesFor(run.stage).findLast(([at]) => run.time >= at)?.[1] ?? 0
}

export function proveCampaign() {
  const reports = []
  for (let stage = 0; stage < STAGES.length; stage += 1) {
    const run = newCombat(stage)
    let count = 0
    let max = 1
    let bossLoss = 0
    let maxZones = 0
    let left = 0
    let right = 0
    const attackTypes = new Set()
    const tiers = []
    const gates = []
    while (run.time < 90 && run.state === 'playing') {
      tickCombat(run, 1 / 60, positionFor(run), 0, (event, data) => {
        if (event === 'alarm') {
          maxZones = Math.max(maxZones, data.zones.length)
          attackTypes.add(data.attack)
        }
        if (event === 'upgrade') tiers.push(data.level)
        if (event === 'recruit') gates.push(data.people)
        if (event === 'hurt' && data.boss) bossLoss += data.loss
        if (event === 'flank') data.side < 0 ? left += 1 : right += 1
      })
      max = Math.max(max, run.count)
      count = Math.max(count, run.enemies.filter(enemy => enemy.z > -44).length)
    }
    const report = { stage: stage + 1, state: run.state, time: +run.time.toFixed(2), survivors: run.count, max, enemies: count, tier: run.weapon, bossLoss, attacks: [...attackTypes], maxZones, left, right, tiers, gates }
    assert.equal(run.state, 'won', JSON.stringify(report))
    assert.equal(run.weapon, 3)
    assert.deepEqual(tiers, [1, 2, 3])
    assert.ok(gates.length >= 3 && gates[0] === (STAGES[stage].openingAid ?? 6))
    assert.equal(bossLoss, 0)
    assert.ok(max >= 22 && left >= 2 && right >= 2)
    if (STAGES[stage].attacks?.includes('outer')) assert.ok(attackTypes.has('outer'))
    assert.equal(maxZones, attackTypes.has('outer') ? 2 : 1)
    if (stage >= 3) {
      const reserve = newCombat(stage)
      const swapAfterSecond = stage === 5
      const swapBeforeReserve = stage === 5 || stage === 7
      let recoveredAt = 0
      while (reserve.time < 90 && reserve.state === 'playing') {
        let x = positionFor(reserve)
        if (reserve.time >= 18.25 && reserve.time < 24.45) x = swapAfterSecond ? LANES.upgrade : LANES.recruit
        if (reserve.time >= 27.8 && reserve.time < 33) x = swapBeforeReserve ? LANES.recruit : LANES.upgrade
        tickCombat(reserve, 1 / 60, x, 0, (type, data) => {
          if (type === 'upgrade' && data.level === 3) recoveredAt = reserve.time
        })
      }
      assert.ok(recoveredAt > 28.45 && recoveredAt < 34)
      assert.equal(reserve.state, 'won')
      report.reserveUpgradeAt = +recoveredAt.toFixed(2)
    }
    reports.push(report)
  }
  const passive = newCombat(0)
  while (passive.time < 12 && passive.state === 'playing') tickCombat(passive, 1 / 60, 0, 0, () => {})
  assert.equal(passive.state, 'lost')
  console.log(JSON.stringify(reports, null, 2))
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) proveCampaign()
