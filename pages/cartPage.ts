import { Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartDescription: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartDescription = page.locator('tbody tr td[class="cart_description"] a');
    }
}
