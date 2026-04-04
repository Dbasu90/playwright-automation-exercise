import { test, expect } from '../../fixtures/baseTest';
import { ProductDetailsPage } from '../../pages/productDetailsPage';

test.beforeEach(async ({ productsPage }) => {
    await productsPage.navigateToProductPage();
});

test.describe('Verify Products browsing, search and filter', () => {
    test('Verify product list loads', async ({ productsPage }) => {
        const count = await productsPage.getProductListCount();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test('Verify search product by product name', async ({ productsPage }) => {
        const productName = 'Summer White Top';
        const searchText = 'Green';
        await test.step('Enter a valid product name in the search bar', async () => {
            await productsPage.searchForProduct(productName);
        });
        await test.step('Verify search results contain matching product', async () => {
            const searchResult = await productsPage.getSearchResults();
            expect(searchResult).toContain(productName);
        });
        await test.step('Enter partial text in the search bar', async () => {
            await productsPage.searchForProduct(searchText);
        });
        await test.step('Verify search results contain matching products', async () => {
            const searchResult = await productsPage.getSearchResults();
            expect(searchResult.every((item: string) => item.includes(searchText))).toBeTruthy();
        });
        await test.step('Enter non existing product in the search bar', async () => {
            await productsPage.searchForProduct('Tiger');
        });
        await test.step('Verify search results do not show any products', async () => {
            const searchResult = await productsPage.getSearchResults();
            expect(searchResult).toContain('No products were found that match your search.');
        });
    });

    test('Verify filtering of products', async ({ productsPage }) => {
        const category = 'Women';
        const subCategory = 'Dress';
        const brand = 'Mast & Harbour';
        await test.step(`Filter products by ${category} and select ${subCategory}`, async () => {
            await productsPage.filterByCategory(category, subCategory);
        });
        await test.step('Verify Product list updates with category items', async () => {
            await productsPage.filterByCategory(category, subCategory);
            const filteredProducts = await productsPage.productCard.all();
            for (const filter of filteredProducts) {
                expect(await filter.locator('p').textContent()).toContain(subCategory);
            }
        });
        await test.step(`Filter products by ${brand}`, async () => {
            await productsPage.filterByBrand(brand);
        });
        await test.step(`Verify products are displayed as per brand filter`, async () => {
            const actualCount = await productsPage.productCard.count();
            const expectedCount = await productsPage.brandProductCount(brand).textContent();
            await expect(productsPage.filteredTitle).toContainText(brand);
            expect(`(${actualCount})`).toEqual(expectedCount);
        });
    });
});

test.describe('Add Products to Cart', () => {
    const productName = 'Winter Top';
    const anotherProduct = 'Men Tshirt';
    let productDetails: ProductDetailsPage;
    let price: string;
    test.beforeEach(async ({ productsPage }) => {
        await test.step('Enter a valid product name in the search bar', async () => {
            await productsPage.searchForProduct(productName);
        });
        await test.step('View product details page', async () => {
            await productsPage.hoverProduct(productName);
            price = (await productsPage.productPrice(productName).textContent())?.trim() || '';
            productDetails = await productsPage.openProduct(productName);
        });
    });
    test('Verify product details page and add product to cart', async ({ productsPage }) => {
        await test.step('Verify Product name and price are visible on product details page', async () => {
            expect(await productDetails.getProductName()).toEqual(productName);
            expect(await productDetails.getProductPrice()).toEqual(price);
        });
        await test.step('Update quantity and add the product to the cart', async () => {
            await productDetails.selectQuantity(2);
            await productDetails.addToCart();
        });
        await test.step('Verify Cart modal appears', async () => {
            await expect(productDetails.productAdded).toHaveText('Added!');
            await expect(productDetails.successMsg).toHaveText('Your product has been added to cart.');
        });
        await test.step('Continue shopping and add a different product to the cart', async () => {
            await productDetails.continueShopping();
            await productsPage.filterByBrand('H&M');
            await productsPage.hoverProduct(anotherProduct);
            await productsPage.quickAddToCart(anotherProduct);
        });
        await test.step('Verify Cart contains both items', async () => {
            const cartPage = await productDetails.clickOnViewCart();
            const productNames = await cartPage.cartDescription.allTextContents();
            expect(productNames).toEqual([productName, anotherProduct]);
        });
    });
    test('Verfiy user can submit a review for a product', async ({ productsPage }) => {
        await test.step('Submit product review', async () => {
            await productDetails.writeReview(
                process.env.NAME!,
                process.env.EMAIL!,
                `This is a test review for product ${productName}`
            );
            const confirmMsg = await productDetails.getReviewSuccessMessage();
            expect(confirmMsg).toEqual('Thank you for your review.');
        });
    });
});
