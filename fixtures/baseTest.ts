import { test as base } from '@playwright/test';
import { UserDetails } from '../types/userDetails';
import { userDetailsFactory } from '../utils/userDetailsFactory';
import { LoginPage } from '../pages/loginPage';
import { SignupPage } from '../pages/signupPage';
import { ProductsPage } from '../pages/productsPage';
import { ProductDetailsPage } from '../pages/productDetailsPage';

export type TestInfo = {
    userDetails: UserDetails;
    loginPage: LoginPage;
    signupPage: SignupPage;
    productsPage: ProductsPage;
    productDetailsPage: ProductDetailsPage;
};

export const test = base.extend<TestInfo>({
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
});

export const expect = base.expect;
