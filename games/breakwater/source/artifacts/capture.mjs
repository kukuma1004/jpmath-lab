import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { chromium } from 'playwright'
import { STAGES } from '../src/campaign.js'
import { switchesFor } from './routes.mjs'

const directory = process.argv[2] ?? '.dream-loop/final'
const profiles = {
  ...Object.fromEntries(STAGES.map((chapter, index) => [`stage-${index + 1}`, {
    index, at: chapter.time + 3.94, turns: switchesFor(index),
  }])),
  'storm-supplies': { index: 4, at: 14.47, turns: switchesFor(4).slice(0, 3) },
  'storm-opening': { index: 4, at: 1.9, turns: [[0, -0.35]] },
  'storm-recruit': { index: 4, at: 3.55, turns: switchesFor(4) },
  'storm-windup': { index: 4, at: 50.48, turns: switchesFor(4) },
}
const names = process.argv.slice(3)
const desktop = process.env.BREAKWATER_CAPTURE_DESKTOP === '1'
const motion = process.env.BREAKWATER_CAPTURE_MOTION === '1'
await mkdir(directory, { recursive: true })
const server = await createServer({ server: { host: '127.0.0.1', port: 5196, strictPort: true } })
await server.listen()
const browser = await chromium.launch({ channel: 'msedge', args: ['--enable-unsafe-swiftshader'] })

try {
  const context = await browser.newContext(desktop
    ? { viewport: { width: 1280, height: 800 } }
    : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('http://127.0.0.1:5196/?qa=1')
  await page.waitForFunction(() => window.__THREE_GAME_DIAGNOSTICS__?.state.frame > 3)
  await page.screenshot({ path: `${directory}/ready.png`, scale: 'css' })
  const reports = []
  for (const name of names.length ? names : Object.keys(profiles)) {
    await page.evaluate(({ name, profile }) => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__
      hooks.setState(name, profile)
      hooks.setPausedForScreenshot(true)
    }, { name, profile: profiles[name] })
    await page.waitForTimeout(350)
    await page.screenshot({ path: `${directory}/${name}.png`, scale: 'css' })
    const report = await page.evaluate(() => {
      const { state, renderer } = window.__THREE_GAME_DIAGNOSTICS__
      return {
        stage: state.stage, squad: state.squad, enemies: state.enemies.length, hasBoss: Boolean(state.boss),
        warningZones: state.alarm?.zones.length, pickups: state.pickups.map(({ kind }) => kind),
        draws: renderer.render.calls, triangles: renderer.render.triangles,
        geometries: renderer.memory.geometries, textures: renderer.memory.textures,
        fits: document.documentElement.scrollHeight <= innerHeight,
      }
    })
    assert.ok(report.fits && report.draws > 0 && report.draws <= 150 && report.triangles < 300000)
    if (name.startsWith('stage-')) assert.ok(report.hasBoss && report.squad >= 25)
    reports.push({ name, ...report })
    console.log(name, JSON.stringify(report))
  }
  if (motion) {
    await page.evaluate(() => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__
      hooks.setState('storm-motion', { index: 4, at: 2.9, turns: [[0, -2.13]] })
      hooks.setReducedMotion(false)
      hooks.setPausedForScreenshot(false)
    })
    const canvas = page.locator('canvas')
    await page.locator('#reward-recruit').filter({ hasText: '+8명' }).waitFor()
    const times = []
    for (let index = 0; index < 3; index += 1) {
      if (index === 1) await page.keyboard.down('ArrowRight')
      times.push(await page.evaluate(() => window.__THREE_GAME_DIAGNOSTICS__.state.time))
      await canvas.screenshot({ path: `${directory}/motion-${index + 1}.png`, scale: 'css' })
      if (index === 1) await page.keyboard.up('ArrowRight')
      await page.waitForTimeout(220)
    }
    assert.ok(times[0] < times[1] && times[1] < times[2])
    reports.push({ name: 'storm-motion', times, unpaused: true })
    await page.evaluate(turns => {
      const hooks = window.__THREE_GAME_TEST_HOOKS__
      hooks.setState('boss-motion', { index: 4, at: 49.35, turns })
    }, switchesFor(4))
    await page.waitForFunction(() => window.__THREE_GAME_DIAGNOSTICS__.state.alarm?.ttl > 0.28)
    await canvas.screenshot({ path: `${directory}/boss-motion-windup.png`, scale: 'css' })
    await page.waitForFunction(() => {
      const { state } = window.__THREE_GAME_DIAGNOSTICS__
      return state.state === 'playing' && state.time > 50.85 && !state.alarm
    })
    await canvas.screenshot({ path: `${directory}/boss-motion-recovery.png`, scale: 'css' })
    reports.push({ name: 'boss-motion', windup: true, recoveredAfterStrike: true })
  }
  await writeFile(`${directory}/metrics.json`, JSON.stringify(reports, null, 2))
  assert.deepEqual(errors, [])
} finally {
  await browser.close()
  await server.close()
}
