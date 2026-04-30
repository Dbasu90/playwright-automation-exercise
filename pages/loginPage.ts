import { Page, Locator } from '@playwright/test';
import { SignupPage } from './signupPage';
import { NavbarComponent } from './components/navbarComponent';

export class LoginPage {
    readonly page: Page;
    readonly navBar: NavbarComponent;
    readonly name: Locator;
    readonly signUpEmail: Locator;
    readonly signUp: Locator;
    readonly signupError: Locator;
    readonly loginEmail: Locator;
    readonly password: Locator;
    readonly login: Locator;
    readonly loginError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navBar = new NavbarComponent(page);
        this.name = page.getByPlaceholder('Name');
        this.signUpEmail = page.getByTestId('signup-email');
        this.signUp = page.getByRole('button', { name: 'Signup' });
        this.signupError = page.locator('.signup-form p');
        this.loginEmail = page.getByTestId('login-email');
        this.password = page.getByPlaceholder('Password');
        this.login = page.getByRole('button', { name: 'Login' });
        this.loginError = page.locator('.login-form p');
    }

    async navigateToLoginPage(): Promise<void> {
        await this.page.goto('/');
        await Promise.all([this.page.waitForURL('/login'), this.navBar.clickLogin()]);
    }

    async signUpWithNameAndEmail(name: string, email: string): Promise<void> {
        await this.name.fill(name);
        await this.signUpEmail.fill(email);
        await this.signUp.click();
    }

    async onSignUpSucess(): Promise<SignupPage> {
        await this.page.waitForURL('/signup');
        return new SignupPage(this.page);
    }

    async getSignupError(): Promise<string> {
        await this.signupError.waitFor({ state: 'visible' });
        return (await this.signupError.textContent())?.trim() || '';
    }

    async loginWithUsernameAndPassword(email: string, password: string): Promise<void> {
        await this.loginEmail.fill(email);
        await this.password.fill(password);
        await this.login.click();
    }

    getLoggedIn(): Locator {
        return this.navBar.loggedInUser;
    }

    async getInvalidLoginError(): Promise<string> {
        await this.loginError.waitFor({ state: 'visible' });
        return (await this.loginError.textContent())?.trim() || '';
    }
}
