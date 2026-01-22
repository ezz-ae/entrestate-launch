import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'http://localhost:3002';

test.describe('Learning dashboard (dev) flows', () => {
  test('shows a dev job and supports retry via API', async ({ page, request }) => {
    // Create a job via the dev API
    const createRes = await request.post(`${BASE}/api/dev/jobs`, {
      data: { type: 'e2e', name: 'playwright-job' }
    });
    expect(createRes.ok()).toBeTruthy();
    const createJson = await createRes.json();
    expect(createJson.job).toBeTruthy();
    const jobId = createJson.job.id;

  // Sign into dev-login so the dashboard can be accessed (dev HttpOnly cookie)
  await page.goto(`${BASE}/dev-login`);
  // submit the default dev-login form to set HttpOnly cookies and redirect
  await page.click('text=Sign in');
  // wait until redirected to /dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });

  // Open the learning dashboard UI and confirm the job appears
  await page.goto(`${BASE}/dashboard/chat-agent/learning`);
    // Wait for the job list entry to appear
    await page.waitForSelector(`text=${createJson.job.name}`, { timeout: 10000 });
  // Ensure the job list entry is visible (we won't rely on opening the details panel)
  const jobLocator = page.locator(`text=${createJson.job.name}`);
  await expect(jobLocator.first()).toBeVisible({ timeout: 10000 });

    // Request a retry via API (simulates user action or server retry)
    const retryRes = await request.post(`${BASE}/api/dev/jobs/${encodeURIComponent(jobId)}/retry`);
    expect(retryRes.ok()).toBeTruthy();
    const retryJson = await retryRes.json();
    expect(retryJson.job).toBeTruthy();

    // Wait for the new retry job to show in the UI
    await page.waitForSelector(`text=${retryJson.job.name}`, { timeout: 10000 });

    // Optional: assert logs endpoint returns an array
    const logsRes = await request.get(`${BASE}/api/dev/jobs/${encodeURIComponent(jobId)}/logs`);
    expect(logsRes.ok()).toBeTruthy();
    const logsJson = await logsRes.json();
    expect(Array.isArray(logsJson.logs)).toBeTruthy();
  });
});
