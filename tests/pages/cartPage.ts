import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartItemsList: Locator;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;
    readonly cartItem: Locator;
    readonly removeButton: Locator;
    readonly cartBadge: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly orderCompleteHeader: Locator;
    readonly errorMessage: Locator;
    readonly itemPrice: Locator;
    readonly itemTotal: Locator;
    readonly tax: Locator;
    readonly totalPrice: Locator;
    readonly cancelButton: Locator;
    readonly backHomeButton: Locator;
    readonly shippingInfo: Locator;
    readonly paymentInfo: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItemsList = page.locator('.cart_list');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
        this.cartItem = page.locator('.cart_item');
        this.removeButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.firstNameInput = page.locator('[data-test="firstName"]');
        this.lastNameInput = page.locator('[data-test="lastName"]');
        this.postalCodeInput = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.orderCompleteHeader = page.locator('.complete-header');
        this.errorMessage = page.locator('[data-test="error"]');
        this.itemPrice = page.locator('.inventory_item_price');
        this.itemTotal = page.locator('.summary_subtotal_label');
        this.tax = page.locator('.summary_tax_label');
        this.totalPrice = page.locator('.summary_total_label');
        this.cancelButton = page.locator('[data-test="cancel"]');
        this.backHomeButton = page.locator('[data-test="back-to-products"]');
        this.shippingInfo = page.locator('.summary_info_label').first();
        this.paymentInfo = page.locator('.summary_info_label').nth(1);


    }

    async goToCart() {
        await this.page.goto('https://www.saucedemo.com/cart.html');
    }

    async getCartItemsCount() {
        try {
            await this.cartItem.first().waitFor({ state: 'visible', timeout: 5000 });
            return await this.cartItem.count();
        } catch {
            return 0;
        }
    }

    async removeItem(productId: string) {
        const removeButton = this.page.locator(`[data-test="remove-${productId}"]`);
        await removeButton.waitFor({ state: 'visible', timeout: 5000 });
        await removeButton.click();
        // Wait for cart badge to update
        await this.page.waitForTimeout(500);
    }

    async proceedToCheckout() {
        // Wait for cart items to load
        await this.page.waitForLoadState('networkidle');

        // Verify checkout button is available and click it
        await this.checkoutButton.waitFor({ state: 'visible', timeout: 5000 });
        if (!(await this.checkoutButton.isEnabled())) {
            throw new Error('Checkout button is disabled');
        }
        await this.checkoutButton.click();
    }

    async verifyCartBadgeUpdate(expectedCount: number) {
        if (expectedCount === 0) {
            try {
                await this.cartBadge.waitFor({ state: 'hidden', timeout: 5000 });
                return true;
            } catch {
                return false;
            }
        } else {
            await this.cartBadge.waitFor({ state: 'visible', timeout: 5000 });
            const count = await this.getCartBadgeCount();
            return count === expectedCount;
        }
    }

    async isCheckoutButtonEnabled() {
        await this.checkoutButton.waitFor({ state: 'visible', timeout: 5000 });
        return await this.checkoutButton.isEnabled();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    async completeCheckout() {
        await this.finishButton.click();
    }

    async getOrderConfirmationMessage() {
        return await this.orderCompleteHeader.textContent();
    }

    async getErrorMessage() {
        try {
            await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
            return await this.errorMessage.textContent() || '';
        } catch (error) {
            return '';
        }
    }

    async getItemPrice() {
        await this.itemPrice.first().waitFor({ state: 'visible', timeout: 5000 });
        const priceText = await this.itemPrice.first().textContent();
        const value = Number(priceText?.replace('$', '') || '0');
        return Number(value.toFixed(2)); // Ensure 2 decimal places
    }

    // New methods for checkout flow
    async getSubTotal() {
        await this.itemTotal.waitFor({ state: 'visible', timeout: 10000 });
        const subtotalText = await this.itemTotal.textContent();
        const value = Number(subtotalText?.replace('Item total: $', '') || '0');
        return Number(value.toFixed(2)); // Ensure 2 decimal places
    }

    async getTaxAmount() {
        await this.tax.waitFor({ state: 'visible', timeout: 10000 });
        const taxText = await this.tax.textContent();
        const value = Number(taxText?.replace('Tax: $', '') || '0');
        return Number(value.toFixed(2)); // Ensure 2 decimal places
    }

    async getTotalAmount() {
        // Verify we're on checkout step two before accessing the total
        await this.verifyOnCheckoutStepTwo();
        await this.totalPrice.waitFor({ state: 'visible', timeout: 5000 });
        const totalText = await this.totalPrice.textContent();
        const value = Number(totalText?.replace('Total: $', '') || '0');
        return Number(value.toFixed(2)); // Ensure 2 decimal places
    }

    async getShippingInformation() {
        await this.shippingInfo.waitFor({ state: 'visible', timeout: 10000 });
        return await this.shippingInfo.textContent() || '';
    }

    async getPaymentInformation() {
        await this.paymentInfo.waitFor({ state: 'visible', timeout: 10000 });
        return await this.paymentInfo.textContent() || '';
    }

    async cancelCheckout() {
        await this.cancelButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.cancelButton.click();
    }

    async goBackHome() {
        await this.backHomeButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.backHomeButton.click();
    }

    async getCartBadgeCount() {
        try {
            await this.cartBadge.waitFor({ state: 'visible', timeout: 5000 });
            const badgeText = await this.cartBadge.textContent();
            return Number(badgeText || '0');
        } catch (error) {
            // If badge is not visible (empty cart), return 0
            return 0;
        }
    }

    async verifyOnCheckoutStepOne() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    }

    async verifyOnCheckoutStepTwo() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    }

    async verifyOnCheckoutComplete() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    }

    async verifyOnCartPage() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
    }

    async verifyOnInventoryPage() {
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    }

    async getLastAddedItem() {
        try {
            await this.cartItem.first().waitFor({ state: 'visible', timeout: 5000 });
            const items = await this.cartItem.all();
            if (items.length === 0) {
                return null;
            }
            return items[items.length - 1];
        } catch {
            return null;
        }
    }

    async getItemNameFromElement(itemElement: Locator) {
        const nameElement = itemElement.locator('.inventory_item_name');
        await nameElement.waitFor({ state: 'visible', timeout: 5000 });
        return await nameElement.textContent();
    }

    async getAllCartItems() {
        try {
            await this.cartItem.first().waitFor({ state: 'visible', timeout: 5000 });
            return await this.cartItem.all();
        } catch {
            return [];
        }
    }
}