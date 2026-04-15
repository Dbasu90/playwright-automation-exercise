import { test, expect } from '../../fixtures/baseTest';
import { CardInfo } from '../../types/cardInfo';
import cardDetails from '../../test-data/cardDetails.json';
import { CheckoutPage } from '../../pages/checkoutPage';

test.beforeEach(async ({ cartPage, page }) => {
    await page.route('**/*google_vignette*', (route) => route.abort());
    await cartPage.navigateToCartPage();
});

test.describe('Validate Checkout Flow', () => {
    test('Verify order summary on checkout and place order', async ({ cartPage, userDetails, productsPage }) => {
        const card: CardInfo = cardDetails;
        let checkout: CheckoutPage;
        const productName = 'Winter Top';
        await test.step('Verify address and order summary is displayed', async () => {
            if (await cartPage.emptyCart.isVisible()) {
                productsPage.addProductToCart(productName);
            }
            checkout = await cartPage.proceedToCheckout();
            expect(checkout.addressDetails).toBeVisible();
        });
        await test.step('Verify address and order summary is displayed', async () => {
            const actualAddress = await checkout.getDeliveryAddress();
            const expectedAddress = `${userDetails.city} ${userDetails.state}`;
            expect(checkout.billingAddress).toBeVisible();
            expect(actualAddress).toContain(expectedAddress);
            const expectedTotal = await checkout.getExpectedOrderAmount(cartPage);
            expect(await checkout.getOrderSummary()).toEqual(`Rs. ${expectedTotal}`);
        });
        await test.step('Enter order comment if any and click on Place Order', async () => {
            await checkout.enterOrderComment('This is a test order');
            await checkout.placeOrder();
        });
        await test.step('Enter payment details and confirm', async () => {
            await checkout.enterPaymentDetails(card);
        });
        await test.step('Verify order has been placed', async () => {
            const confirmation = await checkout.getOrderConfirmation();
            expect(confirmation).toEqual('Congratulations! Your order has been confirmed!');
        });
    });
});
