import { Page, Locator } from '@playwright/test';
import { CartPage } from './cartPage';

export class ProductDetailsPage {
    readonly page: Page;
    readonly productName: Locator;
    readonly productPrice: Locator;
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly productAdded: Locator;
    readonly successMsg: Locator;
    readonly viewCart: Locator;
    readonly continue: Locator;
    readonly reviewName: Locator;
    readonly reviewEmail: Locator;
    readonly reviewText: Locator;
    readonly reviewSubmit: Locator;
    readonly reviewSuccess: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productName = page.locator('.product-information h2');
        this.productPrice = page.locator('.product-information span span');
        this.quantityInput = page.locator('input#quantity');
        this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
        this.productAdded = page.locator('.modal-content h4');
        this.successMsg = page.locator('.modal-content .modal-body p').first();
        this.viewCart = page.locator('.modal-content .modal-body a[href="/view_cart"]');
        this.continue = page.locator('.modal-content .modal-footer').getByRole('button', { name: 'Continue Shopping' });
        this.reviewName = page.getByPlaceholder('Your Name');
        this.reviewEmail = page.getByPlaceholder('Email Address', { exact: true });
        this.reviewText = page.getByPlaceholder('Add Review Here!').or(page.locator('#review'));
        this.reviewSubmit = page.getByRole('button', { name: 'Submit' });
        this.reviewSuccess = page.locator('div#review-section .alert-success');
    }

    async getProductName(): Promise<string> {
        await this.productName.waitFor({ state: 'visible' });
        return (await this.productName.textContent())?.trim() || '';
    }

    async getProductPrice(): Promise<string> {
        await this.productPrice.waitFor({ state: 'visible' });
        return (await this.productPrice.textContent())?.trim() || '';
    }

    async selectQuantity(value: number): Promise<void> {
        await this.quantityInput.fill(value.toString());
    }

    async addToCart(): Promise<void> {
        await Promise.all([this.addToCartButton.click(), this.productAdded.waitFor({ state: 'visible' })]);
    }

    async clickOnViewCart(): Promise<CartPage> {
        await Promise.all([this.viewCart.click(), this.page.waitForURL('/view_cart')]);
        return new CartPage(this.page);
    }

    async continueShopping(): Promise<void> {
        await this.continue.click();
    }

    async writeReview(name: string, email: string, review: string): Promise<void> {
        await this.reviewName.fill(name);
        await this.reviewEmail.fill(email);
        await this.reviewText.fill(review);
        await this.reviewSubmit.click();
    }

    async getReviewSuccessMessage(): Promise<string> {
        await this.reviewSuccess.waitFor({ state: 'visible' });
        return (await this.reviewSuccess.textContent())?.trim() || '';
    }
}
