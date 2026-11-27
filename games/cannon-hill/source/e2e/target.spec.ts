import { expect, test, type Page } from '@playwright/test';
import { MAX_COURSE_SEED } from '../src/game/target/course';

async function openRange(page: Page, seed?: number) {
  if (seed !== undefined) {
    await page.addInitScript(value => { Math.random = () => value; }, (seed - 0.5) / MAX_COURSE_SEED);
  }
  await page.goto('./');
  await page.getByRole('button', { name: /표적 10발/ }).click();
  await expect(page.locator('.target-fire')).toBeEnabled();
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 250));
}

test('울트라와이드와 낮은 창에서 포대와 표적이 하단 조작판 위에 보인다', async ({page}) => {
  await page.goto('./');
  await page.getByRole('button', {name: /표적 10발/}).click();
  for (const [width, height] of [[3440, 1090], [2560, 830], [1920, 620], [1366, 575], [1920, 300]]) {
    await page.setViewportSize({width, height});
    const field = (await page.locator('.target-field').boundingBox())!;
    const canvas = (await page.locator('.target-field canvas[aria-label]').boundingBox())!;
    const controls = (await page.locator('.target-control').boundingBox())!;
    expect(canvas).toEqual(field);
    // The bottom edge of the lowest target is 70% down the field.
    expect(canvas.y + canvas.height * .7).toBeLessThan(controls.y);
    expect(controls.y + controls.height).toBeLessThanOrEqual(height);
  }
});

test('스페이스바 두 번째 입력의 왕복 게이지 힘으로 1발만 쏜다', async ({ page }) => {
  await openRange(page);
  const power = page.locator('[data-power]');
  const feedback = page.locator('[data-feedback]');
  const shots = page.locator('[data-shots] [data-hit]');
  await page.keyboard.down('Space');
  await expect(feedback).toHaveText('원하는 힘에서 다시 눌러 발사');
  await page.clock.runFor(2200);
  expect(Number(await power.textContent())).toBeGreaterThan(90);
  await page.keyboard.down('Space');
  await page.keyboard.up('Space');
  await page.clock.runFor(1400);
  expect(Number(await power.textContent())).toBeCloseTo(50, -1);
  await expect(shots).toHaveCount(0);

  await page.keyboard.press('Space');
  await expect(feedback).toHaveText('비행 중');
  await expect(power).toHaveText('50.0');
  await page.clock.runFor(2500);
  await expect(shots).toHaveCount(1);
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

  await page.keyboard.press('Space');
  await page.clock.runFor(1200);
  await page.keyboard.press('Space');
  await expect(page.locator('[data-power]')).toHaveText('50.0');
  await expect(fire).toBeDisabled();
});

test('모바일 발사 버튼은 두 번째 터치에서 1발만 쏜다', async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  try {
    await openRange(page);
    const fire = page.locator('.target-fire');
    await fire.tap();
    await page.clock.runFor(1200);
    await expect(page.locator('[data-feedback]')).toHaveText('원하는 힘에서 다시 눌러 발사');
    const shots = page.locator('[data-shots] [data-hit]');
    await expect(shots).toHaveCount(0);
    await fire.tap();
    await expect(page.locator('[data-power]')).toHaveText('50.0');
    await page.clock.runFor(3000);
    await expect(shots).toHaveCount(1);
  } finally {
    await page.close();
  }
});

test('낮은 직격은 돌벽에 충돌하고 돌벽을 넘겨 떨어진 탄은 득점한다', async ({ page }) => {
  await openRange(page, 2);
  const slope = page.locator('#target-slope');
  const feedback = page.locator('[data-feedback]');
  const shots = page.locator('[data-shots] [data-hit]');
  await expect(feedback).toHaveText('가운데 돌벽을 넘겨 표적을 맞히세요');
  await expect(page.locator('[data-distance]')).toHaveText('800 · -19');

  await slope.fill('28');
  await page.keyboard.press('Space');
  await page.clock.runFor(1877); // 78.2 matches the first target's center on a shallow path.
  await page.keyboard.press('Space');
  await page.clock.runFor(2600);
  await expect(shots.nth(0)).toHaveText('0.0');
  await expect(feedback).toContainText('돌벽에 맞았어요');

  await expect(page.locator('[data-distance]')).toHaveText('871 · -13');
  await slope.fill('100');
  await page.keyboard.press('Space');
  await page.clock.runFor(1502); // 62.6 clears the wall and descends onto the target.
  await page.keyboard.press('Space');
  await page.clock.runFor(2600);
  await expect(shots.nth(1)).toHaveAttribute('data-hit', 'center');
  await expect(shots.nth(1)).toHaveText('98.8');
});

test('열 발을 마치고 다시 도전하면 새 코스가 열리고 순위 선택에 기존 코스가 있다', async ({ page }) => {
  await openRange(page);
  const target = page.locator('[data-distance]');
  const first = await target.textContent();
  for (let index = 0; index < 10; index++) {
    await page.keyboard.press('Space');
    await page.clock.runFor(1750);
    await page.keyboard.press('Space');
    await page.clock.runFor(2700);
  }
  await expect(page.locator('[data-hit]')).toHaveCount(10);
  await expect(page.locator('[data-total]')).toHaveText(/\/ 1000.0점/);
  await page.locator('[data-action=retry]').click();
  await expect(page.locator('[data-hit]')).toHaveCount(0);
  await expect(page.locator('[data-round]')).toHaveText('1 / 10');
  await expect(target).not.toHaveText(first!);
  await page.getByRole('button', { name: '누적 순위' }).click();
  const boardCourse = page.getByLabel('순위 코스');
  await expect(boardCourse).toHaveValue('rampart');
  await expect(boardCourse.locator('option')).toHaveText(['돌벽 포격 코스', '이전 낙하 포격 코스', '이전 랜덤 코스', '이전 고정 코스']);
});
