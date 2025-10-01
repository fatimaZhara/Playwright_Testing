import { expect, type Locator, type Page } from "@playwright/test";
export class productPage {
    //Locators
    readonly page: Page;
    readonly add_to_cart_btn: Locator;
    readonly tittle: Locator;
    readonly cart_icon: Locator;
    //Variables
    readonly url: string = "https://www.saucedemo.com/inventory.html";
    //constructor

    constructor(page: Page) {
        this.page = page;
        this.add_to_cart_btn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
        this.tittle = page.locator('[data-test="item-0-title-link"]');

        this.cart_icon = page.locator('data-test="shopping-cart-link"');
    }

    //Actions
    async addToCart() {
        await this.add_to_cart_btn.first().click();
    }

    async openProductDetails() {

        await this.tittle.click();


    }

    async verifyProductsVisible() {
        await expect(this.tittle.first()).toBeVisible();
    }

    async backToProductsPage() {
        await this.page.goBack();
    }


}