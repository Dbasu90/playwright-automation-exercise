import { test as base } from '@playwright/test';
import { UserDetails } from '../types/userDetails';
import { userDetailsFactory } from '../utils/userDetailsFactory';
import { LoginPage } from '../pages/loginPage';
import { SignupPage } from '../pages/signupPage';
import { ProductsPage } from '../pages/productsPage';
import { ProductDetailsPage } from '../pages/productDetailsPage';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';

export type TestInfo = {
    userDetails: UserDetails;
    loginPage: LoginPage;
    signupPage: SignupPage;
    productsPage: ProductsPage;
    productDetailsPage: ProductDetailsPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
};

export const test = base.extend<TestInfo>({
    page: async ({ page }, use) => {
        const adPatterns = ['**/*google_vignette*', '**/*pagead2.googlesyndication.com/*', '**/*doubleclick.net/*'];
        for (const pattern of adPatterns) {
            await page.route(pattern, (route) => route.abort());
        }
        await use(page);
    },
    userDetails: async ({}, use) => {
        const details = userDetailsFactory();
        await use(details);
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    signupPage: async ({ page }, use) => {
        await use(new SignupPage(page));
    },
    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },
    productDetailsPage: async ({ page }, use) => {
        await use(new ProductDetailsPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
});

export const expect = base.expect;
