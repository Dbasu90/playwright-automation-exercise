import { test, expect } from '../../fixtures/baseTest';

test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();
});

test.describe('Verify Login Flow', () => {
    test('Verify login with valid credentials', async ({ loginPage }) => {
        await loginPage.loginWithUsernameAndPassword(process.env.EMAIL!, process.env.PASSWORD!);
        await expect(loginPage.getLoggedIn()).toBeVisible();
        expect(await loginPage.navBar.getLoggedInUserName()).toEqual(process.env.NAME!);
    });

    test('Verify login with invalid password', async ({ loginPage, userDetails }) => {
        await loginPage.loginWithUsernameAndPassword(userDetails.email, 'pass123');
        const errorMsg = await loginPage.getInvalidLoginError();
        expect(errorMsg).toEqual('Your email or password is incorrect!');
    });
});
