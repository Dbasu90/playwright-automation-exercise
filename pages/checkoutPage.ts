import { Page, Locator } from '@playwright/test';
import { CardInfo } from '../types/cardInfo';
import { NavbarComponent } from './components/navbarComponent';
import { CartPage } from './cartPage';

export class CheckoutPage {
    readonly page: Page;
    readonly addressDetails: Locator;
    readonly deliveryAddress: Locator;
    readonly billingAddress: Locator;
    readonly reviewOrder: Locator;
    readonly totalAmount: Locator;
    readonly addComment: Locator;
    readonly placeOrderBtn: Locator;
    readonly nameOnCard: Locator;
    readonly cardNumber: Locator;
    readonly cvc: Locator;
    readonly expMonth: Locator;
    readonly expYear: Locator;
    readonly payAndConfirm: Locator;
    readonly orderConfirmation: Locator;
    readonly downloadInvoiceBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addressDetails = page.getByText('Address Details');
        this.deliveryAddress = page.getByText('Your delivery address');
        this.billingAddress = page.getByText('Your billing address');
        this.reviewOrder = page.getByText('Review Your Order');
        this.totalAmount = page.getByRole('row', { name: 'Total Amount' }).locator("td p[class='cart_total_price']");
        this.addComment = page.locator("textarea[name='message']");
        this.placeOrderBtn = page.getByRole('link', { name: 'Place Order' });
        this.nameOnCard = page.getByTestId('name-on-card');
        this.cardNumber = page.getByTestId('card-number');
        this.cvc = page.getByTestId('cvc');
        this.expMonth = page.getByTestId('expiry-month');
        this.expYear = page.getByTestId('expiry-year');
        this.payAndConfirm = page.getByRole('button', { name: 'Pay and Confirm Order' });
        this.orderConfirmation = page.locator('[data-qa="order-placed"]').locator('+ p');
        this.downloadInvoiceBtn = page.getByRole('link', { name: 'Download Invoice' });
    }

    async getDeliveryAddress(): Promise<string> {
        await this.deliveryAddress.waitFor({ state: 'visible' });
        const address = this.page.locator('#address_delivery').locator('.address_city');
        return (await address.textContent())?.trim() || '';
    }

    async getExpectedOrderAmount(cartPage: CartPage): Promise<number> {
        const productsList = await cartPage.cartDescription.allTextContents();
        let expectedTotal = 0;
        for (const productName of productsList) {
            const total = await cartPage.getExpectedProductTotal(productName);
            expectedTotal += total;
        }
        return expectedTotal;
    }

    async getOrderSummary(): Promise<string> {
        await this.reviewOrder.waitFor({ state: 'visible' });
        return (await this.totalAmount.textContent())?.trim() || '';
    }

    async enterOrderComment(message: string): Promise<void> {
        await this.addComment.fill(message);
    }

    async placeOrder(): Promise<void> {
        await this.page.route('**/*google_vignette*', (route) => route.abort());
        await Promise.all([this.placeOrderBtn.click(), this.page.waitForURL('/payment')]);
    }

    async enterPaymentDetails(cardInfo: CardInfo): Promise<void> {
        await this.nameOnCard.fill(cardInfo.nameOnCard);
        await this.cardNumber.fill(cardInfo.cardNumber);
        await this.cvc.fill(cardInfo.cvv);
        await this.expMonth.fill(cardInfo.expMonth);
        await this.expYear.fill(cardInfo.expYear);
        await this.payAndConfirm.click();
    }

    async getOrderConfirmation(): Promise<string> {
        return (await this.orderConfirmation.textContent())?.trim() || '';
    }

    async downloadInvoice(): Promise<void> {
        const [download] = await Promise.all([this.page.waitForEvent('download'), this.downloadInvoiceBtn.click()]);
        await download.saveAs(download.suggestedFilename());
    }
}
