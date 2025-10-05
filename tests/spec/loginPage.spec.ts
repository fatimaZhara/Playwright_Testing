import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
let loginPage: LoginPage;




test.beforeEach('This actions run before any test', async ({ page }, testInfo) => {

    loginPage = new LoginPage(page);
    await loginPage.open();
    console.log(`test starts for: ${testInfo.title}`);
    await page.goto('https://www.saucedemo.com/');


})

test.describe('Login Feature', () => {

    test('Successful Login', async ({ page }) => {
        await loginPage.loginWithEnterKey('standard_user', 'secret_sauce');
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    });


    test('Failed Login (Invalid password)', async ({ page }) => {
        // await page.goto('https://www.saucedemo.com/');
        await loginPage.loginWithEnterKey('standard_user', '12345');
        await loginPage.assertInvalidLoginMessage();
        // await page.getByText('Swag Labs').click();

    });

    test('Failed Login (Invalid username)', async ({ page }) => {
        await loginPage.loginWithEnterKey('Fatima', 'secret_sauce');
        await loginPage.assertInvalidLoginMessage();

    });
    test('Failed Login (Invalid username and password)', async ({ page }) => {
        await loginPage.loginWithEnterKey('Fatima', '12345');
        await loginPage.assertInvalidLoginMessage();
    });









});


