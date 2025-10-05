"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const loginPage_1 = require("../pages/loginPage");
const productsPage_1 = require("../pages/productsPage");
const cartPage_1 = require("../pages/cartPage");
test_1.test.describe("Cart Page Features", () => {
    let loginPage;
    let productsPage;
    let cartPage;
    test_1.test.beforeEach((_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        loginPage = new loginPage_1.LoginPage(page);
        productsPage = new productsPage_1.ProductPage(page);
        cartPage = new cartPage_1.CartPage(page);
        // Login with valid credentials
        yield loginPage.open();
        yield loginPage.login("standard_user", "secret_sauce");
        // Add an item to cart before each test
        yield productsPage.addToCart("sauce-labs-backpack");
    }));
    // Positive Test Cases
    (0, test_1.test)("should display correct number of items in cart", () => __awaiter(void 0, void 0, void 0, function* () {
        yield cartPage.goToCart();
        const itemCount = yield cartPage.getCartItemsCount();
        (0, test_1.expect)(itemCount).toBe(1);
    }));
    (0, test_1.test)("should allow removing items from cart", () => __awaiter(void 0, void 0, void 0, function* () {
        yield cartPage.goToCart();
        const initialCount = yield cartPage.getCartItemsCount();
        yield cartPage.removeItem();
        const finalCount = yield cartPage.getCartItemsCount();
        (0, test_1.expect)(finalCount).toBe(initialCount - 1);
    }));
    (0, test_1.test)("should allow continuing shopping", () => __awaiter(void 0, void 0, void 0, function* () {
        yield cartPage.goToCart();
        yield cartPage.continueShopping();
        yield (0, test_1.expect)(productsPage.page).toHaveURL("https://www.saucedemo.com/inventory.html");
    }));
    (0, test_1.test)("should complete checkout process successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        yield cartPage.goToCart();
        yield cartPage.proceedToCheckout();
        yield cartPage.fillCheckoutInfo("John", "Doe", "12345");
        yield cartPage.completeCheckout();
        const confirmMessage = yield cartPage.getOrderConfirmationMessage();
        (0, test_1.expect)(confirmMessage).toBe("Thank you for your order!");
    }));
    (0, test_1.test)("should display correct item total", () => __awaiter(void 0, void 0, void 0, function* () {
        yield cartPage.goToCart();
        const itemPrice = yield cartPage.getItemPrice();
        const totalPrice = yield cartPage.getTotalPrice();
        (0, test_1.expect)(totalPrice).toBe(itemPrice);
    }));
    // Negative Test Cases
    (0, test_1.test)("should show error for missing first name during checkout", () => __awaiter(void 0, void 0, void 0, function* () {
        yield cartPage.goToCart();
        yield cartPage.proceedToCheckout();
        yield cartPage.fillCheckoutInfo("", "Doe", "12345");
        const errorMessage = yield cartPage.getErrorMessage();
        (0, test_1.expect)(errorMessage).toBe("Error: First Name is required");
    }));
    (0, test_1.test)("should show error for missing last name during checkout", () => __awaiter(void 0, void 0, void 0, function* () {
        yield cartPage.goToCart();
        yield cartPage.proceedToCheckout();
        yield cartPage.fillCheckoutInfo("John", "", "12345");
        const errorMessage = yield cartPage.getErrorMessage();
        (0, test_1.expect)(errorMessage).toBe("Error: Last Name is required");
    }));
    (0, test_1.test)("should show error for missing postal code during checkout", () => __awaiter(void 0, void 0, void 0, function* () {
        yield cartPage.goToCart();
        yield cartPage.proceedToCheckout();
        yield cartPage.fillCheckoutInfo("John", "Doe", "");
        const errorMessage = yield cartPage.getErrorMessage();
        (0, test_1.expect)(errorMessage).toBe("Error: Postal Code is required");
    }));
    (0, test_1.test)("should handle empty cart checkout attempt", () => __awaiter(void 0, void 0, void 0, function* () {
        yield cartPage.goToCart();
        yield cartPage.removeItem();
        yield cartPage.proceedToCheckout();
        yield cartPage.fillCheckoutInfo("John", "Doe", "12345");
        yield (0, test_1.expect)(cartPage.itemTotal).toBeVisible();
        const totalPrice = yield cartPage.getTotalPrice();
        (0, test_1.expect)(totalPrice).toBe(0);
    }));
});
//# sourceMappingURL=cartPage.spec.js.map