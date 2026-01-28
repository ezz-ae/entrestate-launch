import { defineConfig } from '@playwright/test';

const devJobsBase = process.env.DEV_JOBS_BASE_URL?.trim();
const resolvedBaseUrl = devJobsBase
  ? devJobsBase === 'local'
    ? 'http://localhost:3002'
    : devJobsBase
  : undefined;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  expect: { timeout: 5000 },
  use: {
    baseURL: resolvedBaseUrl,
    headless: true,
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
