# E2E Testing with Playwright

This directory contains end-to-end (E2E) tests for the LOL Match Analyzer application using Playwright.

## What are E2E Tests?

E2E tests simulate real user interactions with your entire application - testing the frontend UI, API calls to the backend, and the full workflow. They're different from:
- **Unit tests** (test individual functions)
- **Integration tests** (test components/services together)
- **E2E tests** (test the complete user journey across the whole app)

## Project Structure

```
e2e/
├── package.json              # Dependencies for E2E testing only
├── tsconfig.json             # TypeScript config for this directory
├── playwright.config.ts      # Playwright configuration
└── tests/
    ├── home.spec.ts         # Tests for home page
    └── userFlow.spec.ts     # Tests for user interactions
```

## Installation

Install dependencies (only needed once):
```bash
cd e2e
npm install
```

## Running Tests

From the `e2e` directory:

```bash
# Run all tests
npm test

# Run tests with interactive UI (great for learning!)
npm run test:ui

# Debug tests step-by-step
npm run test:debug

# Generate tests by recording your clicks
npm run codegen
```

## How It Works

The `playwright.config.ts` automatically:
1. Starts your backend API server (`npm run dev` on port 5000)
2. Starts your React frontend (`npm start` on port 3000)
3. Runs your tests against the running apps
4. Captures screenshots and traces if tests fail

## Learning Resources

- **Playwright Official Docs**: https://playwright.dev/docs/intro
- **Best Practices**: https://playwright.dev/docs/best-practices
- **Locators Guide**: https://playwright.dev/docs/locators (how to find elements)
- **API Reference**: https://playwright.dev/docs/api/class-page

## Key Concepts for Beginners

### Locators (How to find elements)
```typescript
// Find by role (recommended)
page.locator('button').filter({ hasText: /Search/i })

// Find by CSS selector
page.locator('input[type="text"]')

// Find by placeholder
page.locator('input[placeholder="Enter summoner name"]')

// Find by text
page.locator('text=Sign In')
```

### Common Actions
```typescript
await page.goto('/')           // Navigate to a page
await page.click('button')     // Click a button
await page.fill('input', 'text') // Fill an input
await page.screenshot()        // Take a screenshot
await page.waitForLoadState()  // Wait for page to load
```

### Assertions (Checking if things work)
```typescript
await expect(page).toHaveURL('/matches')  // Check URL
await expect(button).toBeVisible()        // Check visibility
await expect(input).toHaveValue('text')   // Check input value
await expect(page).toHaveTitle(/Home/)    // Check page title
```

## Example Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Setup runs before each test
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test steps
    const button = page.locator('button', { hasText: /Click me/i });
    await button.click();
    
    // Assert the result
    await expect(page).toHaveURL(/\/new-page/);
  });
});
```

## Tips for Success

1. **Use `npm run test:ui`** during development - you can watch tests run with visual feedback
2. **Use `npm run codegen`** to record your clicks and let Playwright generate code
3. **Be specific with locators** - prefer finding elements by role or text rather than CSS classes
4. **Test user workflows** not implementation - think about what users actually do
5. **Keep tests independent** - each test should work on its own
6. **Use `test.beforeEach()`** for common setup that all tests need

## Troubleshooting

**Tests timeout waiting for servers?**
- Make sure ports 3000 and 5000 are available
- Check that both `npm start` and `npm run dev` work independently

**Can't find element?**
- Use `npm run test:ui` to see what the page looks like when test runs
- Use `npm run codegen` to interactively find elements

**Tests pass locally but fail in CI?**
- Set `CI=true` when running: `CI=true npm test`
- Check file paths - use relative paths in tests, not absolute paths

## Next Steps

1. Review the existing tests in `tests/` directory
2. Run `npm run test:ui` to see tests in action
3. Try modifying a test to practice
4. Run `npm run codegen` to record a new user workflow
5. Write a test for a feature you use
