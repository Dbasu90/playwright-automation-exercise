import { test as setup, expect } from '../fixtures/baseTest';

const authFile = '.auth/userSession.json';

setup('User Authorization via UI', async ({ loginPage, page }) => {
    await loginPage.navigateToLoginPage();
    await loginPage.loginWithUsernameAndPassword(process.env.EMAIL!, process.env.PASSWORD!);
    expect(await loginPage.isLoggedIn()).toBeTruthy();
    await page.context().storageState({ path: authFile });
});
