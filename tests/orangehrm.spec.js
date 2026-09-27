// tests/orangehrm.spec.js
const { test, expect } = require('@playwright/test');

test.describe('OrangeHRM Test Suite - Storage State & Pass/Fail Scenarios', () => {

  // --- POSITIVE SCENARIOS (USES SAVED AUTH STATE) ---

  test('Positive: Access Dashboard directly without logging in', async ({ page }) => {
    // Directly visits protected page without filling credentials
    await page.goto('/web/index.php/dashboard/index');

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.locator('.oxd-userdropdown-name')).toBeVisible();
  });

  test('Positive: Navigate to Admin module and search employee', async ({ page }) => {
    await page.goto('/web/index.php/admin/viewSystemUsers');

    // Search for Admin role
    await page.getByPlaceholder('Type for hints...').first().fill('Admin');
    await page.getByRole('button', { name: 'Search' }).click();

    // Verify system users table rendered
    await expect(page.locator('.oxd-table')).toBeVisible();
  });

  test('Positive: Navigate to Directory page', async ({ page }) => {
    await page.goto('/web/index.php/directory/viewDirectory');

    await expect(page.getByRole('heading', { name: 'Directory' })).toBeVisible();
  });

  // --- NEGATIVE SCENARIOS (CLEAR STORAGE STATE TO TEST LOGIN ERRORS) ---

  test.describe('Negative Login Scenarios', () => {
    // Clear storage state so test starts as unauthenticated
    test.use({ storageState: { cookies: [], origins: [] } });

    test('Negative: Invalid Credentials Error', async ({ page }) => {
      await page.goto('/web/index.php/auth/login');

      await page.getByPlaceholder('Username').fill('Admin');
      await page.getByPlaceholder('Password').fill('WrongPassword123');
      await page.getByRole('button', { name: 'Login' }).click();

      const alert = page.locator('.oxd-alert-content-text');
      await expect(alert).toBeVisible();
      await expect(alert).toHaveText('Invalid credentials');
    });

    test('Negative: Empty Credentials Validation', async ({ page }) => {
      await page.goto('/web/index.php/auth/login');

      await page.getByRole('button', { name: 'Login' }).click();

      const requiredMessages = page.locator('.oxd-input-field-error-message');
      await expect(requiredMessages.first()).toBeVisible();
      await expect(requiredMessages.first()).toHaveText('Required');
    });
  });

  // --- INTENTIONALLY FAILING SCENARIOS ---

  test('Failed Case: Incorrect Dashboard Heading Assertion', async ({ page }) => {
    await page.goto('/web/index.php/dashboard/index');

    // Fails on purpose: Actual heading is "Dashboard", not "Analytics Hub"
    await expect(page.getByRole('heading', { name: 'Analytics Hub' })).toBeVisible();
  });

  test('Failed Case: Non-existent element timeout', async ({ page }) => {
    await page.goto('/web/index.php/dashboard/index');

    // Fails on purpose: Element does not exist
    await expect(page.locator('#non-existent-orangehrm-element')).toBeVisible({ timeout: 3000 });
  });

}); 