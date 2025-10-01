import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { productPage } from '../pages/productsPage';
let loginPage: LoginPage;
let productsPage: productPage;
test.beforeEach('This actions run before any test', async ({ page }, testInfo) => {

    loginPage = new LoginPage(page);
    await loginPage.open();
    console.log(`test starts for: ${testInfo.title}`);
    await page.goto('https://www.saucedemo.com/');
    await loginPage.loginWithEnterKey('standard_user', 'secret_sauce');


})
test.describe('Products Page Feature', () => {
    test('Open Product Details Page', async ({ page }) => {

        productsPage = new productPage(page);
        // await loginPage.loginWithEnterKey('standard_user', 'secret_sauce');
        await productsPage.verifyProductsVisible();
        await productsPage.openProductDetails();

    });

    test('Add to Cart Button Visibility', async ({ page }) => {

        productsPage = new productPage(page);
        await productsPage.addToCart();

    });

    test('Back to Products Page', async ({ page }) => {

        productsPage = new productPage(page);
        await productsPage.verifyProductsVisible();
        await productsPage.openProductDetails();
        await productsPage.backToProductsPage();
        await productsPage.verifyProductsVisible();


    });





});
