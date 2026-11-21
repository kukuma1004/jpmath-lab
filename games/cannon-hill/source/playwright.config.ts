import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

// 이 PC에 이미 받아 둔 헤드리스 크롬을 쓴다(없으면 Playwright 기본값)
const local = process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium_headless_shell-1243', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe') : '';
const executablePath = process.env.PW_CHROME || (local && existsSync(local) ? local : undefined);

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:5213/',
    browserName: 'chromium',
    viewport: { width: 1440, height: 900 },
    launchOptions: { executablePath, args: ['--autoplay-policy=no-user-gesture-required'] },
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:5213/',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
