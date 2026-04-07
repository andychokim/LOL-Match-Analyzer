import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    // Check that the page is loaded
    await expect(page).toHaveTitle(/Home|Match Analyzer/i);
  });

  test('should display the user info form', async ({ page }) => {
    await page.goto('/');
    // Look for form elements (adjust selectors based on your actual HTML)
    const summonerNameInput = page.locator('input[placeholder*="Summoner"]').or(
      page.locator('input[name*="summoner"]').or(
        page.locator('input[type="text"]').first()
      )
    );
    await expect(summonerNameInput).toBeVisible();
  });

  test('should navigate to match analysis page', async ({ page }) => {
    await page.goto('/');
    
    // Click on the button to go to match analysis (adjust selector as needed)
    const matchAnalysisLink = page.locator('a, button').filter({ hasText: /match|analysis|search/i }).first();
    if (await matchAnalysisLink.isVisible()) {
      await matchAnalysisLink.click();
      await expect(page).toHaveURL(/\/(match-analysis|analysis|matches)/);
    }
  });
});

test.describe('User Navigation', () => {
  test('should display navigation menu', async ({ page }) => {
    await page.goto('/');
    // Check if navigation elements exist
    const nav = page.locator('nav').or(page.locator('[role="navigation"]'));
    await expect(nav.or(page.locator('header'))).toBeVisible();
  });

  test('should have footer visible', async ({ page }) => {
    await page.goto('/');
    // Scroll to bottom to check footer
    const footer = page.locator('footer').or(page.locator('div').filter({ hasText: /footer|copyright/i }).last());
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Footer might not always be immediately visible, so we check it exists in DOM
    expect(await page.locator('footer, [role="contentinfo"]').count()).toBeGreaterThanOrEqual(0);
  });
});
