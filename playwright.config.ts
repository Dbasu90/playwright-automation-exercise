import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from a .env file into process.env by providing an Environment Value. If no Environment Value is provided, it defaults to `./env/.env.dev`.
const environmentPath =
    process.env.ENVIRONMENT == undefined ? `./env/.env.dev` : `./env/.env.${process.env.ENVIRONMENT}`;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config({
    path: environmentPath,
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    timeout: 60000,
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    globalSetup: './global-setup.ts',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('')`. */
        baseURL: process.env.URL,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        testIdAttribute: 'data-qa',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    /* Configure projects for major browsers */
    projects: [
        { name: 'setup', testMatch: 'auth.setup.ts' },

        { name: 'api', testMatch: 'apiTest.spec.ts' },

        {
            name: 'registration',
            testMatch: ['userRegistrationFlow.spec.ts', 'loginFlow.spec.ts'],
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'chromium',
            testDir: './tests/clientSite',
            testIgnore: ['loginFLow.spec.ts', 'userRegistrationFlow.spec.ts'],
            use: { ...devices['Desktop Chrome'], storageState: '.auth/userSession.json' },
            dependencies: ['setup'],
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});
