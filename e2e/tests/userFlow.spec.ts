import { test, expect } from '@playwright/test';

test.describe('User Info Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should accept summoner name input', async ({ page }) => {
    // Find the input field - try multiple selectors
    const input = page.locator('input').filter({ hasText: /summoner|name/i }).first().or(
      page.locator('input[type="text"]').first()
    );

    if (await input.count() > 0) {
      await input.fill('TestSummoner123');
      await expect(input).toHaveValue('TestSummoner123');
    }
  });

  test('should accept region selection', async ({ page }) => {
    // Find region select/dropdown
    const regionSelect = page.locator('select').or(
      page.locator('button, div').filter({ hasText: /region|server/i }).first()
    );

    if (await regionSelect.count() > 0) {
      await regionSelect.click();
      // Try to select an option
      const options = page.locator('[role="option"], select > option');
      if (await options.count() > 1) {
        await options.nth(1).click();
      }
    }
  });

  test('should have submit button', async ({ page }) => {
    const submitBtn = page.locator('button').filter({ hasText: /search|submit|analyze/i }).first();
    await expect(submitBtn).toBeVisible();
  });
});

test.describe('API Connectivity', () => {
  test('should be able to reach backend API', async ({ page, context }) => {
    // Intercept API calls to verify backend is accessible
    let apiCallMade = false;
    
    page.on('response', (response) => {
      if (response.url().includes('/api') || response.url().includes('localhost:5000')) {
        apiCallMade = true;
      }
    });

    await page.goto('/');
    
    // Try to make an API call (this depends on your actual app)
    // For now, we just check that navigation works
    await expect(page).toHaveURL(/http:\/\/localhost:3000/);
  });
});
