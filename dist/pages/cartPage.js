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
exports.CartPage = void 0;
class CartPage {
    constructor(page) {
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
    }
    goToCart() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto('https://www.saucedemo.com/cart.html');
        });
    }
    getCartItemsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.cartItem.count();
            return items;
        });
    }
    removeItem() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.removeButton.click();
        });
    }
    proceedToCheckout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkoutButton.click();
        });
    }
    continueShopping() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.continueShoppingButton.click();
        });
    }
    fillCheckoutInfo(firstName, lastName, postalCode) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.firstNameInput.fill(firstName);
            yield this.lastNameInput.fill(lastName);
            yield this.postalCodeInput.fill(postalCode);
            yield this.continueButton.click();
        });
    }
    completeCheckout() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.finishButton.click();
        });
    }
    getOrderConfirmationMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderCompleteHeader.textContent();
        });
    }
    getErrorMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.errorMessage.textContent();
        });
    }
    getItemPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            const priceText = yield this.itemPrice.first().textContent();
            return parseFloat((priceText === null || priceText === void 0 ? void 0 : priceText.replace('$', '')) || '0');
        });
    }
    getTotalPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalText = yield this.itemTotal.textContent();
            return parseFloat((totalText === null || totalText === void 0 ? void 0 : totalText.split('$')[1]) || '0');
        });
    }
}
exports.CartPage = CartPage;
//# sourceMappingURL=cartPage.js.map