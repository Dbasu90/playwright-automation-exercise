import { Page, Locator } from '@playwright/test';
import { NavbarComponent } from './components/navbarComponent';
import { CheckoutPage } from './checkoutPage';

export class CartPage {
    readonly page: Page;
    readonly navBar: NavbarComponent;
    readonly emptyCart: Locator;
    readonly cartDescription: Locator;
    readonly price: Locator;
    readonly quantity: Locator;
    readonly total: Locator;
    readonly removeBtn: Locator;
    readonly checkoutBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navBar = new NavbarComponent(page);
        this.emptyCart = page.getByText('Cart is empty!');
        this.cartDescription = page.locator('tbody tr td[class="cart_description"] a');
        this.price = page.locator('td[class="cart_price"] p');
        this.quantity = page.locator('td[class="cart_quantity"] button');
        this.total = page.locator('td[class="cart_total"] p');
        this.removeBtn = page.locator('td[class="cart_delete"] a');
        this.checkoutBtn = page.getByText('Proceed To Checkout');
    }

    async navigateToCartPage() {
        await this.page.goto('/');
        await Promise.all([
            this.navBar.clickOnCart(),
            this.page.waitForURL((url) => url.href.includes('/view_cart'), { timeout: 60000 }),
        ]);
    }

    getProductPrice(name: string): Locator {
        const tableRow = this.page.getByRole('row', { name: name });
        return tableRow.locator(this.price);
    }
    getProductQuantity(name: string): Locator {
        const tableRow = this.page.getByRole('row', { name: name });
        return tableRow.locator(this.quantity);
    }
    getProductTotal(name: string): Locator {
        const tableRow = this.page.getByRole('row', { name: name });
        return tableRow.locator(this.total);
    }

    async getExpectedProductTotal(productName: string): Promise<number> {
        const price = (await this.getProductPrice(productName).textContent())?.trim() || '';
        const quantity = (await this.getProductQuantity(productName).textContent())?.trim() || '';
        const total = parseInt(price?.split(' ')[1]) * parseInt(quantity);
        return total;
    }

    async clickOnRemove(name: string): Promise<void> {
        const tableRow = this.page.getByRole('row', { name: name });
        await tableRow.locator(this.removeBtn).click();
    }

    async proceedToCheckout(): Promise<CheckoutPage> {
        await Promise.all([this.checkoutBtn.click(), this.page.waitForURL('/checkout')]);
        return new CheckoutPage(this.page);
    }
}
