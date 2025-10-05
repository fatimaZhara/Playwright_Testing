import { expect, type Locator, type Page } from "@playwright/test";
export class ProductPage {
    //Locators
    readonly page: Page;
    readonly add_to_cart_btn: Locator;
    readonly tittle: Locator;
    readonly cart_icon: Locator;
    readonly menue_btn: Locator;
    readonly sort_dropdown: Locator;
    readonly number_of_items_in_cart: Locator;
    readonly cartBadge: Locator;
    //Variables
    readonly url: string = "https://www.saucedemo.com/inventory.html";
    //constructor

    constructor(page: Page) {
        this.page = page;
        this.add_to_cart_btn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
        this.tittle = page.locator('[data-test="item-0-title-link"]');
        this.menue_btn = page.locator('#react-burger-menu-btn');
        this.sort_dropdown = page.locator('[data-test="product-sort-container"]');
        this.number_of_items_in_cart = page.locator('[data-test="shopping-cart-badge"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');


        this.cart_icon = page.locator('[data-test="shopping-cart-link"]');
    }

    //Actions

    async openProductDetails() {

        await this.tittle.click();


    }


    async addToCart(productId: string) {
        await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
    }


    async verifyProductsVisible() {
        await expect(this.tittle.first()).toBeVisible();
        await expect(this.add_to_cart_btn.first()).toBeVisible();
        await expect(this.cart_icon).toBeVisible();
        await expect(this.menue_btn).toBeVisible();
        await expect(this.sort_dropdown).toBeVisible();
    }

    async openMenue() {
        await this.menue_btn.click();
        await expect(this.page.locator('[data-test="inventory-sidebar-link"]')).toBeVisible();
        await expect(this.page.locator('[data-test="about-sidebar-link"]')).toBeVisible();
        await expect(this.page.locator('[data-test="logout-sidebar-link"]')).toBeVisible();
        await expect(this.page.locator('[data-test="reset-sidebar-link"]')).toBeVisible();

        // await expect(this.page.locator('#about_sidebar_link')).toBeVisible();

    }

    async clickAbout() {
        await this.page.locator('[data-test="about-sidebar-link"]').click();
        await expect(this.page).toHaveURL('https://saucelabs.com/');
    }
    async clickAllItems() {
        await this.page.locator('[data-test="inventory-sidebar-link"]').click();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    }
    async clickLogout() {
        await this.page.locator('[data-test="logout-sidebar-link"]').click();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/');
    }
    async clickResetAppState() {
        await this.page.locator('[data-test="reset-sidebar-link"]').click();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    }

    async sortProductsBy(option: "Name(A to Z)" | "Name(Z to A)" | "Price(low to high)" | "Price(high to low)") {
        await this.sort_dropdown.selectOption({ label: option });
    }
    async goToCart() {
        await this.cart_icon.click();
    }

    async verifyCartBadgeCount(expectedCount: number) {
        await expect(this.cartBadge).toHaveText(expectedCount.toString());
    }
    async assertMenuePagesUrl() {
        await expect(this.page).toHaveURL('https://saucelabs.com/');
        await
            expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(this.page).toHaveURL('https://www.saucedemo.com/');
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');

    }
    async sortProducts(sortOption: string) {
        await this.sort_dropdown.selectOption({ label: sortOption });
    }
    async assertProductsSortedByPriceLowToHigh() {

        const prices = await this.page.locator('.inventory_item_price').allTextContents();
        const priceValues = prices.map(price => parseFloat(price.replace('$', '')));
        const sortedPrices = [...priceValues].sort((a, b) => a - b);
        expect(priceValues).toEqual(sortedPrices);
    }
    async assertProductsSortedByPriceHighToLow() {
        const prices = await this.page.locator('.inventory_item_price').allTextContents();
        const priceValues = prices.map(price => parseFloat(price.replace('$', '')));
        const sortedPrices = [...priceValues].sort((a, b) => b - a);
        expect(priceValues).toEqual(sortedPrices);
    }
    async assertProductsSortedByNameAToZ() {
        const names = await this.page.locator('.inventory_item_name').allTextContents();
        const sortedNames = [...names].sort();
        expect(names).toEqual(sortedNames);
    }
    async assertProductsSortedByNameZToA() {
        const names = await this.page.locator('.inventory_item_name').allTextContents();
        const sortedNames = [...names].sort().reverse();
        expect(names).toEqual(sortedNames);
    }






    async assertProductsPageUrl() {

        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory-item.html?id=0');
    }
    async remveProductFromCart(productId: string) {
        await this.page.locator(`[data-test="remove-sauce-labs-backpack"]`).click();
        await expect(this.page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);

    }


}