// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 30000,
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    trace: 'on-first-retry',
  },

  projects: [
    // Project 1: Setup script executes login once
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },

    // Project 2: Runs authenticated & general UI tests
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Reuses saved session across tests in this project
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});