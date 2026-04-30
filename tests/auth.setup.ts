import { test as setup, expect } from '../fixtures/baseTest';

const authFile = '.auth/userSession.json';

setup('User Authorization via UI', async ({ loginPage, page }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.loginWithUsernameAndPassword(process.env.EMAIL!, process.env.PASSWORD!);
    await page.waitForResponse('https://automationexercise.com/cdn-cgi/rum?');
    await expect(loginPage.getLoggedIn()).toBeVisible();
    await page.context().storageState({ path: authFile });
});
