// tests/auth.setup.js
const { test: setup, expect } = require('@playwright/test');

const authFile = 'playwright/.auth/user.json';

setup('authenticate user', async ({ page }) => {
  // 1. Go to login page
  await page.goto('https://www.saucedemo.com/');

  // 2. Perform login
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // 3. Verify login success
  await expect(page.locator('.title')).toHaveText('Products');

  // 4. Save storage state to file
  await page.context().storageState({ path: authFile });
});