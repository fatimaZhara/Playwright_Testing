import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/productsPage';
import { CartPage } from '../pages/cartPage';

// Increase timeout for all tests in this file
test.setTimeout(45000);

test.describe('Cart Page Features', () => {
    let loginPage: LoginPage;
    let productsPage: ProductPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductPage(page);
        cartPage = new CartPage(page);

        // Login with valid credentials
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');

        // Add an item to cart before each test
        await productsPage.addToCart('sauce-labs-backpack');
    });

    // Positive Test Cases
    test('should display correct number of items in cart', async () => {
        await cartPage.goToCart();
        const itemCount = await cartPage.getCartItemsCount();
        expect(itemCount).toBe(1);
    });

    test('should allow removing items from cart', async () => {
        await cartPage.goToCart();
        await cartPage.removeItem('sauce-labs-backpack');
        const finalCount = await cartPage.getCartItemsCount();
        expect(finalCount).toBe(0);
    });

    test('should allow continuing shopping', async () => {
        await cartPage.goToCart();
        await cartPage.continueShopping();
        await expect(productsPage.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    });

    test('should complete checkout process successfully', async () => {
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await cartPage.fillCheckoutInfo('John', 'Doe', '12345');
        await cartPage.completeCheckout();
        const confirmMessage = await cartPage.getOrderConfirmationMessage();
        expect(confirmMessage).toBe('Thank you for your order!');
    });

    test('should display correct item price', async () => {
        await cartPage.goToCart();
        const itemPrice = await cartPage.getItemPrice();
        expect(itemPrice).toBeGreaterThan(0);
    });

    test('should add new products to the bottom of cart', async () => {
        // First item is already added in beforeEach
        await cartPage.goToCart();
        const firstItem = await cartPage.getLastAddedItem();
        const firstName = await cartPage.getItemNameFromElement(firstItem!);
        expect(firstName).toContain('Sauce Labs Backpack');

        // Add a second item
        await cartPage.continueShopping();
        await productsPage.addToCart('sauce-labs-bike-light');
        await cartPage.goToCart();

        // Verify the new item is at the bottom
        const lastItem = await cartPage.getLastAddedItem();
        const lastName = await cartPage.getItemNameFromElement(lastItem!);
        expect(lastName).toContain('Bike Light');
    });

    // Negative Test Cases
    test('should show error for missing first name during checkout', async () => {
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await cartPage.fillCheckoutInfo('', 'Doe', '12345');
        const errorMessage = await cartPage.getErrorMessage();
        expect(errorMessage).toBe('Error: First Name is required');
    });

    test('should show error for missing last name during checkout', async () => {
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await cartPage.fillCheckoutInfo('John', '', '12345');
        const errorMessage = await cartPage.getErrorMessage();
        expect(errorMessage).toBe('Error: Last Name is required');
    });

    test('should show error for missing postal code during checkout', async () => {
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await cartPage.fillCheckoutInfo('John', 'Doe', '');
        const errorMessage = await cartPage.getErrorMessage();
        expect(errorMessage).toBe('Error: Postal Code is required');
    });

    test('should handle empty cart checkout process', async () => {
        await cartPage.goToCart();
        await cartPage.removeItem('sauce-labs-backpack');

        // Verify empty cart state
        const itemCount = await cartPage.getCartItemsCount();
        expect(itemCount).toBe(0);

        // Verify cart badge is not visible
        expect(await cartPage.verifyCartBadgeUpdate(0)).toBeTruthy();

        // Should allow proceeding to checkout with empty cart
        await cartPage.proceedToCheckout();
        await cartPage.verifyOnCheckoutStepOne();

        // Should allow completing checkout
        await cartPage.fillCheckoutInfo('John', 'Doe', '12345');
        await cartPage.verifyOnCheckoutStepTwo();

        // Verify empty cart totals
        const subtotal = await cartPage.getSubTotal();
        const tax = await cartPage.getTaxAmount();
        const total = await cartPage.getTotalAmount();

        expect(subtotal).toBe(0);
        expect(tax).toBe(0);
        expect(total).toBe(0);

        // Should complete checkout successfully
        await cartPage.completeCheckout();
        await cartPage.verifyOnCheckoutComplete();
    });
});