import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/productsPage';
let loginPage: LoginPage;
let productsPage: ProductPage;
test.beforeEach('This actions run before any test', async ({ page }, testInfo) => {

    loginPage = new LoginPage(page);
    productsPage = new ProductPage(page);
    await loginPage.open();
    console.log(`test starts for: ${testInfo.title}`);
    await page.goto('https://www.saucedemo.com/');
    await loginPage.loginWithEnterKey('standard_user', 'secret_sauce');


})
test.describe('Products Page Feature', () => {
    test('1.Open Product Details Page', async ({ page }) => {

        //productsPage = new ProductPage(page);
        await productsPage.verifyProductsVisible();


    });

    test(' 2.Cart Icon Button increase when added single product', async ({ page }) => {

        // productsPage = new ProductPage(page);
        await productsPage.addToCart('sauce-labs-backpack');
        await productsPage.verifyCartBadgeCount(1);


    });
    test(' 3.Cart Icon Button increase by 1 when added multiple products', async ({ page }) => {

        await productsPage.addToCart("sauce-labs-backpack");
        await productsPage.verifyCartBadgeCount(1);

        await productsPage.addToCart("sauce-labs-bike-light");
        await productsPage.verifyCartBadgeCount(2);

        await productsPage.addToCart("sauce-labs-bolt-t-shirt");
        await productsPage.verifyCartBadgeCount(3);

    });

    test(' 4. Navigate to product details page', async ({ page }) => {
        await productsPage.openProductDetails();
        await productsPage.assertProductsPageUrl();

    });

    test(' 5. Navigate to cart page', async ({ page }) => {

        await productsPage.goToCart();
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');




    });

    test(' 6. verify sort process', async ({ page }) => {

        await productsPage.sortProducts('Price (low to high)');
        await productsPage.assertProductsSortedByPriceLowToHigh();
        await productsPage.sortProducts('Price (high to low)');
        await productsPage.assertProductsSortedByPriceHighToLow();
        await productsPage.sortProducts('Name (A to Z)');
        await productsPage.assertProductsSortedByNameAToZ();
        await productsPage.sortProducts('Name (Z to A)');
        await productsPage.assertProductsSortedByNameZToA();



    });
    test(' 7. Verify number of cart icaon decrease qwhen remove product ', async ({ page }) => {


        await productsPage.addToCart("sauce-labs-backpack");
        await productsPage.verifyCartBadgeCount(1);
        await productsPage.remveProductFromCart("sauce-labs-backpack");

        //S   await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);




    });
    test(' 8. Open menu and test navigations ', async ({ page }) => {
        await productsPage.openMenue();
        await page.locator('[data-test="about-sidebar-link"]').click();

    });

    test(' 9. Verify About menu pages URLs', async ({ page }) => {
        await productsPage.openMenue();
        // await productsPage.clickAllItems();
        await productsPage.clickAbout();
        // await productsPage.clickLogout();
        //await productsPage.clickResetAppState();


    });

    test(' 10. Verify AllItems menu pages URLs', async ({ page }) => {
        await productsPage.openMenue();
        await productsPage.clickAllItems();



    });
    test(' 11. Verify Logout menu pages URLs', async ({ page }) => {
        await productsPage.openMenue();
        await productsPage.clickLogout();



    });
    test(' 12. Verify Reset App State menu pages URLs', async ({ page }) => {
        await productsPage.openMenue();
        await productsPage.clickResetAppState();



    });


});
