import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { positionFor, switchesFor } from './routes.mjs'
import { STAGES } from '../src/campaign.js'

const port = Number(process.env.BREAKWATER_TEST_PORT || '5197')
const dev = await createServer({ server: { host: '127.0.0.1', port, strictPort: true } })
await dev.listen()
const browser = await chromium.launch({ channel: 'msedge', args: ['--enable-unsafe-swiftshader'] })
const local = `http://127.0.0.1:${port}/?qa=1`
const reports = []
const rate = Number(process.env.BREAKWATER_TEST_RATE || '1')
const current = page => page.evaluate(() => window.__THREE_GAME_DIAGNOSTICS__.state)
const time = (page, at) => page.waitForFunction(t => window.__THREE_GAME_DIAGNOSTICS__.state.time >= t, at)

async function load(context, url = local) {
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', log => { if (log.type() === 'error') errors.push(log.text()) })
  await page.goto(url)
  await page.waitForFunction(() => document.querySelector('[data-stage="0"][aria-pressed]'))
  return { page, errors }
}

async function drag(page, target, touch = null) {
  const { x: left, y: top, width, height } = await page.locator('canvas').boundingBox()
  const prev = (await current(page)).x
  const x = left + width / 2
  const y = top + height * 0.66
  const dx = (target - prev) / 10.6 * width
  if (touch) {
    const send = (type, touchPoints) => touch.send('Input.dispatchTouchEvent', { type, touchPoints })
    await send('touchStart', [{ x, y }])
    for (let i = 1; i <= 4; i += 1) await send('touchMove', [{ x: x + dx * i / 4, y }])
    await send('touchEnd', [])
  } else {
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + dx, y)
    await page.mouse.up()
  }
}

try {
  const desktop = await browser.newContext({ viewport: { width: 1366, height: 850 } })
  const { page, errors } = await load(desktop)
  assert.equal(await page.locator('.stage-option:disabled').count(), STAGES.length - 1)
  await page.evaluate(rate => window.__THREE_GAME_TEST_HOOKS__.setClockRate(rate), rate)
  await page.getByRole('button', { name: '전투 시작' }).click()
  for (let index = 0; index < STAGES.length; index += 1) {
    assert.equal((await current(page)).stage, index)
    await drag(page, -2.13)
    for (const [at, side] of switchesFor(index).slice(1)) {
      await time(page, at)
      await drag(page, side)
    }
    await time(page, STAGES[index].time + 0.05)
    let warnings = 0
    const deadline = Date.now() + 42000
    while (Date.now() < deadline) {
      const state = await current(page)
      if (state.state !== 'playing') break
      warnings = Math.max(warnings, state.alarm?.zones.length || 0)
      const choice = positionFor(state)
      if (Math.abs(state.x - choice) > 0.37) await drag(page, choice)
      await page.waitForTimeout(55)
    }
    const result = await current(page)
    assert.equal(result.state, 'won', JSON.stringify(result))
    assert.equal(result.weapon, 3)
    assert.equal(result.cleared, index + 1)
    assert.equal(warnings, STAGES[index].attacks?.includes('outer') ? 2 : 1)
    const report = { stage: index + 1, won: true, time: +result.time.toFixed(2), survivors: result.squad, warnings }
    reports.push(report)
    console.log('desktop stage', JSON.stringify(report))
    if (index + 1 < STAGES.length) await page.getByRole('button', { name: '다음 전장' }).click()
  }
  await page.getByRole('heading', { name: '전 전선 돌파' }).waitFor()
  await page.reload()
  await page.waitForFunction(count => window.__THREE_GAME_DIAGNOSTICS__?.state.cleared === count, STAGES.length)
  assert.equal(await page.locator('.stage-option:not(:disabled)').count(), STAGES.length)
  assert.equal(await page.locator('.stage-option').filter({ hasText: '돌파 완료' }).count(), STAGES.length)
  await page.locator('.stage-option[data-stage="0"]').click()
  await page.getByRole('button', { name: '전투 시작' }).click()
  assert.equal((await current(page)).stage, 0)
  assert.equal((await current(page)).cleared, STAGES.length)
  assert.deepEqual(errors, [])
  reports.push({ persistedAfterReload: true, replayedFirst: true })
  await desktop.close()

  const mobile = await browser.newContext({ viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 })
  const { page: phone, errors: mobileErrors } = await load(mobile)
  const touch = await mobile.newCDPSession(phone)
  const layout = await phone.locator('#action').boundingBox()
  assert.ok(layout.y >= 0 && layout.y + layout.height < 568)
  assert.equal(await phone.evaluate(() => document.documentElement.scrollHeight <= innerHeight), true)
  await phone.getByRole('button', { name: '전투 시작' }).tap()
  await drag(phone, -2.13, touch)
  await phone.waitForFunction(() => document.getElementById('squad').textContent === '7')
  await phone.locator('#reward-recruit').filter({ hasText: '+6명' }).waitFor()
  await drag(phone, 2.13, touch)
  await phone.locator('#reward-weapon').filter({ hasText: '무기 강화' }).waitFor({ timeout: 5500 })
  await phone.getByRole('button', { name: '일시정지' }).tap()
  await phone.getByRole('button', { name: '전장 선택' }).tap()
  assert.equal(await phone.locator('#viewport').getAttribute('data-state'), 'ready')
  assert.equal(await phone.locator('.stage-option:disabled').count(), STAGES.length - 1)
  assert.deepEqual(mobileErrors, [])
  reports.push({ phone: '320×568 touch', firstRecruit: 7, rewardChips: true, returnedToMenu: true })
  await mobile.close()

  const offline = await browser.newContext({ offline: true, viewport: { width: 1280, height: 850 } })
  const { page: file, errors: fileErrors } = await load(offline, new URL('../dist/index.html', import.meta.url).href)
  assert.equal(await file.title(), '해협 돌파 · 여덟 전선')
  assert.equal(await file.evaluate(() => typeof window.__THREE_GAME_TEST_HOOKS__), 'undefined')
  await file.getByRole('button', { name: '전투 시작' }).click()
  await file.keyboard.down('ArrowLeft')
  await file.waitForTimeout(325)
  await file.keyboard.up('ArrowLeft')
  await file.waitForFunction(() => document.getElementById('squad').textContent === '7')
  assert.deepEqual(fileErrors, [])
  reports.push({ offline: true, firstRecruit: 7 })
  await offline.close()
} finally {
  for (const result of reports) console.log(JSON.stringify(result))
  await writeFile('artifacts/playtest-result.json', JSON.stringify(reports, null, 2))
  await browser.close()
  await dev.close()
}
