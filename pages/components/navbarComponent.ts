import { Page, Locator } from '@playwright/test';

export class NavbarComponent {
    readonly page: Page;
    readonly cartIcon: Locator;
    readonly productsLink: Locator;
    readonly loginLink: Locator;
    readonly logoutLink: Locator;
    readonly loggedInUser: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartIcon = page.locator('.nav .fa-shopping-cart');
        this.productsLink = page.locator('a[href="/products"]');
        this.loginLink = page.locator('a[href="/login"]');
        this.logoutLink = page.locator('a[href="/logout"]');
        this.loggedInUser = page.locator('.fa-user');
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
}
