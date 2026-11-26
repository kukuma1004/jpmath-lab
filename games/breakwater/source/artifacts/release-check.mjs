import assert from 'node:assert/strict'
import { chromium } from 'playwright'

const browser = await chromium.launch({ channel: 'msedge', args: ['--enable-unsafe-swiftshader'] })
try {
  const context = await browser.newContext({
    offline: true, viewport: { width: 320, height: 568 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', log => { if (log.type() === 'error') errors.push(log.text()) })
  const touch = await context.newCDPSession(page)
  await page.goto(new URL('../dist/index.html', import.meta.url).href)
  await page.locator('[data-stage="0"][aria-pressed="true"]').waitFor()
  assert.equal(await page.title(), '해협 돌파 · 여덟 전선')
  assert.equal(await page.evaluate(() => typeof window.__THREE_GAME_TEST_HOOKS__), 'undefined')
  assert.equal(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight), true)
  assert.equal(await page.locator('.stage-option').count(), 8)
  for (const option of await page.locator('.stage-option').all()) {
    const rect = await option.boundingBox()
    assert.ok(rect.width >= 44 && rect.height >= 44 && rect.y + rect.height < 568)
  }

  await page.getByRole('button', { name: '전투 시작' }).tap()
  await page.getByRole('button', { name: '다시 도전' }).waitFor({ timeout: 13000 })
  await page.getByRole('button', { name: '다시 도전' }).tap()
  const canvas = page.locator('canvas')
  const { x, y, width, height } = await canvas.boundingBox()
  const row = y + height * 0.66
  const center = x + width / 2
  const swipe = async distance => {
    const send = (type, touchPoints) => touch.send('Input.dispatchTouchEvent', { type, touchPoints })
    await send('touchStart', [{ x: center, y: row }])
    for (let i = 1; i <= 4; i += 1) await send('touchMove', [{ x: center + distance * i / 4, y: row }])
    await send('touchEnd', [])
  }
  await swipe(-width * 0.2)
  await page.locator('#reward-recruit').filter({ hasText: '+6명 증원' }).waitFor()
  await swipe(width * 0.4)
  await page.locator('#reward-weapon').filter({ hasText: '2/4' }).waitFor({ timeout: 6500 })
  assert.equal(await page.locator('#weapon').textContent(), '삼연발')
  await page.getByRole('button', { name: '일시정지' }).tap()
  await page.getByRole('button', { name: '전장 선택' }).tap()

  await page.evaluate(() => localStorage.setItem('breakwater-campaign-cleared-v1', '3'))
  await page.reload()
  await page.locator('[data-stage="3"][aria-pressed="true"]').waitFor()
  assert.equal(await page.locator('.stage-option').filter({ hasText: '돌파 완료' }).count(), 3)
  assert.equal(await page.locator('.stage-option:not(:disabled)').count(), 4)
  await page.locator('[data-stage="0"]').tap()
  await page.locator('[data-stage="0"][aria-pressed="true"]').waitFor()

  await page.evaluate(() => localStorage.setItem('breakwater-campaign-cleared-v1', '4'))
  await page.reload()
  await page.locator('[data-stage="4"][aria-pressed="true"]').waitFor()
  await page.getByRole('button', { name: '전투 시작' }).tap()
  await page.locator('#viewport[data-state="playing"]').waitFor()
  await swipe(-width * 0.2)
  await page.locator('#reward-recruit').filter({ hasText: '+8명 증원' }).waitFor()
  assert.deepEqual(errors, [])
  console.log(JSON.stringify({ offline: true, viewport: [320, 568], allCardsFit: true,
    touchRetry: true, touchRecruit: 7, touchUpgrade: '삼연발', legacyProgress: 3, selectedReplay: true, stormRecruit: 9 }))
} finally {
  await browser.close()
}
