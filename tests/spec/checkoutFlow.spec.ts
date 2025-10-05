import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/productsPage';
import { CartPage } from '../pages/cartPage';

test.describe('Checkout Flow', () => {
    let loginPage: LoginPage;
    let productsPage: ProductPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductPage(page);
        cartPage = new CartPage(page);

        // Login and add items to cart
        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');
        await productsPage.addToCart('sauce-labs-backpack');
        await productsPage.addToCart('sauce-labs-bike-light');
    });

    test('should navigate correctly when canceling from checkout step one', async () => {
        // Go to cart and checkout
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await cartPage.verifyOnCheckoutStepOne();

        // Click cancel and verify navigation to cart
        await cartPage.cancelCheckout();
        await cartPage.verifyOnCartPage();
    });

    test('should navigate to step two after filling valid information', async () => {
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();

        // Fill checkout info and verify navigation
        await cartPage.fillCheckoutInfo('John', 'Doe', '12345');
        await cartPage.verifyOnCheckoutStepTwo();
    });

    test('should navigate to inventory when canceling from step two', async () => {
        // Navigate to step two
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await cartPage.fillCheckoutInfo('John', 'Doe', '12345');
        await cartPage.verifyOnCheckoutStepTwo();

        // Cancel and verify navigation
        await cartPage.cancelCheckout();
        await cartPage.verifyOnInventoryPage();
    });

    test('should navigate to complete page and back home', async () => {
        // Navigate to step two
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await cartPage.fillCheckoutInfo('John', 'Doe', '12345');
        await cartPage.verifyOnCheckoutStepTwo();

        // Complete checkout and verify
        await cartPage.completeCheckout();
        await cartPage.verifyOnCheckoutComplete();

        // Go back home and verify
        await cartPage.goBackHome();
        await cartPage.verifyOnInventoryPage();
    });

    test('should verify cart contents and order on step two', async () => {
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await cartPage.fillCheckoutInfo('John', 'Doe', '12345');

        // Verify number of items
        const itemCount = await cartPage.getCartItemsCount();
        expect(itemCount).toBe(2);

        // Verify last added item (Bike Light) appears at bottom
        const lastItem = await cartPage.getLastAddedItem();
        const lastName = await cartPage.getItemNameFromElement(lastItem!);
        expect(lastName).toContain('Bike Light');

        // Verify cart badge
        const badgeCount = await cartPage.getCartBadgeCount();
        expect(badgeCount).toBe(2);
    });

    test('should verify payment and shipping information', async () => {
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await cartPage.fillCheckoutInfo('John', 'Doe', '12345');

        // Verify information sections
        const paymentInfo = await cartPage.getPaymentInformation();
        expect(paymentInfo).toBeTruthy();

        const shippingInfo = await cartPage.getShippingInformation();
        expect(shippingInfo).toBeTruthy();
    });

    test('should verify price calculations', async () => {
        await cartPage.goToCart();
        await cartPage.proceedToCheckout();
        await cartPage.fillCheckoutInfo('John', 'Doe', '12345');

        // Get all price components
        const subtotal = await cartPage.getSubTotal();
        const tax = await cartPage.getTaxAmount();
        const total = await cartPage.getTotalAmount();

        // Verify calculations
        expect(subtotal).toBeGreaterThan(0);
        expect(tax).toBeGreaterThan(0);
        expect(total).toBe(Number((subtotal + tax).toFixed(2)));

        // Verify tax is approximately 8%
        const taxRate = Number((tax / subtotal).toFixed(2));
        expect(taxRate).toBeCloseTo(0.08, 1); // Allow some floating point variance
    });

    test('should maintain cart contents through navigation', async () => {
        // Start at cart
        await cartPage.goToCart();
        const initialCount = await cartPage.getCartBadgeCount();

        // Navigate through checkout steps
        await cartPage.proceedToCheckout();
        await cartPage.fillCheckoutInfo('John', 'Doe', '12345');
        const stepTwoCount = await cartPage.getCartBadgeCount();
        expect(stepTwoCount).toBe(initialCount);

        // Cancel back to inventory
        await cartPage.cancelCheckout();
        const finalCount = await cartPage.getCartBadgeCount();
        expect(finalCount).toBe(initialCount);
    });
});
