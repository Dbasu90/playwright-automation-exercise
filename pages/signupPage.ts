import { Page, Locator } from '@playwright/test';
import { UserDetails } from '../types/userDetails';

export class SignupPage {
    readonly page: Page;
    readonly name: Locator;
    readonly email: Locator;
    readonly password: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly address: Locator;
    readonly country: Locator;
    readonly state: Locator;
    readonly city: Locator;
    readonly zipcode: Locator;
    readonly mobile: Locator;
    readonly createAccount: Locator;
    readonly confirmation: Locator;
    readonly continue: Locator;

    constructor(page: Page) {
        this.page = page;
        this.name = page.getByLabel('Name');
        this.email = page.getByLabel('Email');
        this.password = page.getByLabel('Password');
        this.firstName = page.getByLabel('First name');
        this.lastName = page.getByLabel('Last name');
        this.address = page.getByTestId('address');
        this.country = page.getByLabel('Country');
        this.state = page.getByLabel('State');
        this.city = page.getByTestId('city');
        this.zipcode = page.getByTestId('zipcode');
        this.mobile = page.getByLabel('Mobile Number');
        this.createAccount = page.getByRole('button', { name: 'Create Account' });
        this.confirmation = page.locator('.title b');
        this.continue = page.getByRole('link', { name: 'Continue' });
    }

    async registerUserWithMandatoryDetails(userDetails: UserDetails): Promise<void> {
        await this.password.fill(userDetails.password);
        await this.firstName.fill(userDetails.firstName);
        await this.lastName.fill(userDetails.lastName);
        await this.address.fill(userDetails.address);
        await this.country.selectOption({ value: userDetails.country });
        await this.state.fill(userDetails.state);
        await this.city.fill(userDetails.city);
        await this.zipcode.fill(userDetails.zipcode);
        await this.mobile.fill(userDetails.mobile);
        await Promise.all([
            this.createAccount.click(),
            this.page.waitForSelector("//p[text()='Congratulations! Your new account has been successfully created!']"),
        ]);
    }

    async continueToHomePage() {
        await this.continue.click();
    }
}
