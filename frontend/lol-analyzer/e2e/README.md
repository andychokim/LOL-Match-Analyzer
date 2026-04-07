# E2E Testing with Playwright

This directory contains end-to-end (E2E) tests for the LOL Match Analyzer application using Playwright.

## Setup

Playwright is already installed as a dev dependency. The configuration automatically starts both the frontend (port 3000) and backend (port 5000) servers before running tests.

## Running Tests

### Run all E2E tests
```bash
npm run e2e
```

### Run tests with UI mode (interactive)
```bash
npm run e2e:ui
```

### Debug tests
```bash
npm run e2e:debug
```

### Generate tests interactively
```bash
npm run e2e:codegen
```

This opens a browser where you can interact with the app, and Playwright records your actions as test code.

## Test Files

- **home.spec.ts** - Tests for loading and basic page functionality
- **userFlow.spec.ts** - Tests for user interactions and API connectivity

## Configuration

The `playwright.config.ts` file configures:
- **Test directory**: `e2e/` folder
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit (coverage across all major browsers)
- **Reporters**: HTML report (view with `npx playwright show-report`)
- **Web servers**: Automatically starts backend and frontend servers
- **Screenshots**: Captured on test failures
- **Traces**: Recorded on first retry for debugging

## Key Features

1. **Multi-browser testing** - Tests run against Chromium, Firefox, and WebKit
2. **Automatic server startup** - Backend and frontend start automatically before tests
3. **Failure artifacts** - Screenshots and traces captured for failed tests
4. **CI/CD ready** - Configuration includes CI optimizations
5. **Interactive debugging** - UI mode and debug mode for development

## Writing New Tests

Example test structure:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    // Your test steps here
    await expect(page).toHaveTitle(/expected title/);
  });
});
```

## Tips

- Use `page.goto('/')` to navigate (base URL is automatic)
- Use `page.locator()` with flexible selectors for robust tests
- Check the HTML report: `npx playwright show-report`
- Use codegen to quickly capture user workflows: `npm run e2e:codegen`

## Customization

To modify test configuration:
1. Edit `playwright.config.ts` for global settings
2. Add new test files in the `e2e/` directory
3. Use `test.beforeEach()` and `test.afterEach()` for setup/teardown

## Troubleshooting

**Port already in use?**
- Kill process on port 3000: `npx kill-port 3000`
- Kill process on port 5000: `npx kill-port 5000`

**Backend or frontend not starting?**
- Check that both `npm start` and `npm run dev` work independently first
- Verify `.env` file is in the backend directory if needed

**Tests timing out?**
- Increase timeout in `playwright.config.ts` under the `use` section
- Check if servers are starting properly
