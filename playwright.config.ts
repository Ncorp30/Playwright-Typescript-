import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    // Test directory
    testDir: './tests',

    // Run tests in files in parallel
    fullyParallel: true,

    // Fail the build on CI if you accidentally left test.only in the source code
    forbidOnly: !!process.env.CI,

    // Retry on CI only
    retries: process.env.CI ? 2 : 1,

    // Opt out of parallel tests on CI
    workers: process.env.CI ? 1 : undefined,

    // Reporter to use
    reporter: [
        ['html', { open: 'never' }],
        ['list']
    ],

    // Shared settings for all the projects below
    use: {
        // Base URL to use in actions like `await page.goto('/')`
        baseURL: 'https://happy-beach-030e0a900.2.azurestaticapps.net',

        // Collect trace when retrying the failed test
        trace: 'on-first-retry',

        // Capture screenshot always for debugging
        screenshot: 'on',

        // Record video always for debugging
        video: 'on',

        // Default timeout for actions
        actionTimeout: 10000,

        // Default navigation timeout
        navigationTimeout: 30000,
    },

    // Global test timeout
    timeout: 60000,

    // Expect timeout
    expect: {
        timeout: 10000,
    },

    // Configure projects for major browsers
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'chromium-slow',
            use: {
                ...devices['Desktop Chrome'],
                headless: false, // Always run headed for visual inspection
                launchOptions: {
                    slowMo: 3000, // 3000ms delay between actions
                },
            },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'edge',
            use: { ...devices['Desktop Edge'], channel: 'msedge' },
        },
    ],
});
