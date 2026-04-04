import { Page, Locator } from '@playwright/test';
import { NavbarComponent } from './components/navbarComponent';
import { ProductDetailsPage } from './productDetailsPage';

export class ProductsPage {
    readonly page: Page;
    readonly navBar: NavbarComponent;
    readonly searchProduct: Locator;
    readonly searchBtn: Locator;
    readonly allProducts: Locator;
    readonly productCard: Locator;
    readonly productOverlay: Locator;
    readonly category: Locator;
    readonly brands: Locator;
    readonly filteredTitle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navBar = new NavbarComponent(page);
        this.searchProduct = page.getByPlaceholder('Search Product');
        this.searchBtn = page.locator('#submit_search');
        this.allProducts = page.getByText('All Products');
        this.productCard = page.locator('.product-image-wrapper .productinfo');
        this.productOverlay = page.locator('.product-image-wrapper .product-overlay .overlay-content');
        this.category = page.getByText('Category');
        this.brands = page.getByText('Brands');
        this.filteredTitle = page.locator('.title.text-center');
    }

    viewProduct(name: string): Locator {
        return this.productCard
            .filter({ has: this.page.getByText(name) })
            .locator('..')
            .locator('..')
            .locator('.choose')
            .getByRole('link', { name: 'View Product' });
    }

    productName(name: string): Locator {
        return this.productCard.filter({ has: this.page.getByText(name) }).locator('p');
    }

    productPrice(name: string): Locator {
        return this.productOverlay.filter({ has: this.page.getByText(name) }).locator('h2');
    }

    addToCart(name: string): Locator {
        return this.productOverlay
            .filter({ has: this.page.getByText(name) })
            .getByRole('link', { name: 'Add to cart' });
    }

    expandCategory(categoryName: string): Locator {
        return this.page.locator('.category-products .panel-title').getByRole('link', { name: categoryName });
    }

    selectSubCategory(subCategoryName: string): Locator {
        return this.page.locator('.category-products .in ul li').getByRole('link', { name: subCategoryName });
    }

    selectBrandName(brand: string): Locator {
        return this.page.locator('.brands-name ul li').getByRole('link', { name: brand });
    }

    brandProductCount(brand: string): Locator {
        return this.page.locator('.brands-name ul li').getByRole('link', { name: brand }).locator('span');
    }

    async navigateToProductPage(): Promise<void> {
        await this.page.goto('/');
        await Promise.all([this.navBar.clickOnProducts(), this.page.waitForURL('/products')]);
    }

    async getProductListCount(): Promise<number> {
        await this.allProducts.waitFor({ state: 'visible' });
        return await this.productCard.count();
    }

    async hoverProduct(productName: string): Promise<void> {
        const product = this.productCard.filter({ has: this.page.getByText(productName) });
        await product.hover();
    }

    async quickAddToCart(productName: string): Promise<void> {
        const addBtn = this.addToCart(productName);
        await addBtn.waitFor({ state: 'visible' });
        await addBtn.click();
    }

    async openProduct(productName: string): Promise<ProductDetailsPage> {
        const viewBtn = this.viewProduct(productName);
        await viewBtn.click();
        return new ProductDetailsPage(this.page);
    }

    async searchForProduct(searchText: string): Promise<void> {
        await this.searchProduct.fill(searchText);
        await this.searchBtn.click();
    }

    async getSearchResults(): Promise<string[]> {
        try {
            await this.page.getByText('Searched Products').waitFor({ state: 'visible', timeout: 5000 });
            const products = await this.productCard.all();
            if (products.length === 0) {
                return ['No products were found that match your search.'];
            } else {
                const names: string[] = [];
                for (const product of products) {
                    const name = await product.locator('p').textContent();
                    if (name) names.push(name.trim());
                }
                return names;
            }
        } catch {
            return ['No products were found that match your search.'];
        }
    }

    async filterByCategory(category: string, subCategory: string): Promise<void> {
        await this.category.waitFor({ state: 'visible' });
        await this.expandCategory(category).click();
        await this.selectSubCategory(subCategory).click();
    }

    async filterByBrand(brand: string): Promise<void> {
        await this.brands.waitFor({ state: 'visible' });
        await this.selectBrandName(brand).click();
    }
}
