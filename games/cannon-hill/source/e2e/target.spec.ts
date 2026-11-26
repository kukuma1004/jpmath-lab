import { expect, test, type Page } from '@playwright/test';
import { formatTenths, ROUNDS, scoreShot } from '../src/game/target/course';

async function openRange(page: Page) {
  await page.goto('./');
  await page.getByRole('button', { name: /표적 10발/ }).click();
  await expect(page.locator('.target-fire')).toBeEnabled();
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 250));
}

test('왕복하는 힘 게이지에서 스페이스바를 뗀 순간의 힘으로 1발만 쏜다', async ({ page }) => {
  await openRange(page);
  const power = page.locator('[data-power]');
  const feedback = page.locator('[data-feedback]');
  const shots = page.locator('[data-shots] [data-hit]');
  await page.keyboard.down('Space');
  await expect(feedback).toHaveText('힘 모으는 중');
  await page.clock.runFor(2200);
  expect(Number(await power.textContent())).toBeGreaterThan(90);
  await page.keyboard.down('Space');
  await page.clock.runFor(1400);
  expect(Number(await power.textContent())).toBeCloseTo(50, -1);
  await expect(shots).toHaveCount(0);

  await page.keyboard.up('Space');
  await expect(feedback).toHaveText('비행 중');
  await expect(power).toHaveText('50.0');
  await page.clock.runFor(2500);
  await expect(shots).toHaveText([formatTenths(scoreShot(ROUNDS[0], { slope: 100, power: 500 }).points)]);
});

test('창을 벗어나 취소된 스페이스바는 발사하지 않고 다음 입력을 받을 수 있다', async ({ page }) => {
  await openRange(page);
  const fire = page.locator('.target-fire');
  await page.keyboard.down('Space');
  await page.clock.runFor(600);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.keyboard.up('Space');
  await page.clock.runFor(2500);
  await expect(page.locator('[data-shots] [data-hit]')).toHaveCount(0);
  await expect(page.locator('[data-power]')).toHaveText('0.0');
  await expect(fire).toBeEnabled();

  await page.keyboard.down('Space');
  await page.clock.runFor(1200);
  await page.keyboard.up('Space');
  await expect(page.locator('[data-power]')).toHaveText('50.0');
  await expect(fire).toBeDisabled();
});

test('모바일 발사 버튼은 터치를 놓는 순간 1발만 쏜다', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  try {
    await openRange(page);
    const rect = (await page.locator('.target-fire').boundingBox())!;
    const touchPoints = [{ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }];
    const session = await page.context().newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints });
    await page.clock.runFor(1200);
    await expect(page.locator('[data-feedback]')).toHaveText('힘 모으는 중');
    const shots = page.locator('[data-shots] [data-hit]');
    await expect(shots).toHaveCount(0);
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect(page.locator('[data-power]')).toHaveText('50.0');
    await page.clock.runFor(3000);
    await expect(shots).toHaveCount(1);
  } finally {
    await page.close();
  }
});
