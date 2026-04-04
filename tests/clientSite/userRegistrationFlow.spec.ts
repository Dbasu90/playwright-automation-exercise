import { test, expect } from '../../fixtures/baseTest';
import { SignupPage } from '../../pages/signupPage';

test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();
});

test.describe('Verify User Registration Flow', () => {
    test('Verify new user can register successfully', async ({ loginPage, userDetails }) => {
        let signUpPage: SignupPage;
        await test.step('Enter name and email and click on Signup', async () => {
            await loginPage.signUpWithNameAndEmail(userDetails.name, userDetails.email);
        });
        await test.step('Fill the registration form to create account', async () => {
            signUpPage = await loginPage.onSignUpSucess();
            await signUpPage.registerUserWithMandatoryDetails(userDetails);
            expect(signUpPage.confirmation).toHaveText('Account Created!');
        });
        await test.step('Continue to Homepage', async () => {
            await signUpPage.continueToHomePage();
            expect(await loginPage.navBar.getLoggedInUserName()).toEqual(userDetails.name);
        });
    });

    test('Verify error on registration with already registered email', async ({ loginPage, userDetails }) => {
        await loginPage.signUpWithNameAndEmail(userDetails.name, process.env.EMAIL!);
        const errorMsg = await loginPage.getSignupError();
        expect(errorMsg).toEqual('Email Address already exist!');
    });
});
