import { Page, Locator } from '@playwright/test';
import { UserDetails } from '../../types/userDetails';

export class NavbarComponent {
    readonly page: Page;
    readonly cartIcon: Locator;
    readonly productsLink: Locator;
    readonly loginLink: Locator;
    readonly logoutLink: Locator;
    readonly loggedInUser: Locator;
    readonly contactUs: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartIcon = page.locator('.nav .fa-shopping-cart');
        this.productsLink = page.locator('a[href="/products"]');
        this.loginLink = page.locator('a[href="/login"]');
        this.logoutLink = page.locator('a[href="/logout"]');
        this.loggedInUser = page.locator('.fa-user');
        this.contactUs = page.locator('a[href="/contact_us"]');
    }

    async clickOnCart() {
        await this.cartIcon.click();
    }

    async clickOnProducts() {
        await this.productsLink.click();
    }

    async clickLogin() {
        await this.loginLink.click();
    }
    async clickLogout() {
        await this.logoutLink.click();
    }

    async getLoggedInUserName(): Promise<string> {
        await this.loggedInUser.waitFor({ state: 'visible' });
        const userName = this.loggedInUser.locator('..').locator('b');
        return (await userName.textContent())?.trim() || '';
    }

    async submitContactUs(): Promise<Locator> {
        await this.contactUs.click();
        await this.page.getByTestId('name').fill(process.env.NAME!);
        await this.page.getByTestId('email').fill(process.env.EMAIL!);
        await this.page.getByTestId('subject').fill('This is a test subject');
        await this.page.getByTestId('message').fill('This is a test message for contacting');
        await this.page.locator('input[name="upload_file"]').setInputFiles('test-data/invoice.txt');
        await this.page.waitForLoadState('domcontentloaded');
        this.page.on('dialog', async (dialog) => {
            console.log(dialog.message());
            await dialog.accept();
        });
        await this.page.getByTestId('submit-button').click();
        return this.page.locator('.status.alert-success');
    }
}
