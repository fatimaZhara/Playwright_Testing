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
let loginPage;
let productsPage;
test_1.test.beforeEach('This actions run before any test', (_a, testInfo_1) => __awaiter(void 0, [_a, testInfo_1], void 0, function* ({ page }, testInfo) {
    loginPage = new loginPage_1.LoginPage(page);
    yield loginPage.open();
    console.log(`test starts for: ${testInfo.title}`);
    yield page.goto('https://www.saucedemo.com/');
    yield loginPage.loginWithEnterKey('standard_user', 'secret_sauce');
}));
test_1.test.describe('Products Page Feature', () => {
    (0, test_1.test)('Open Product Details Page', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        productsPage = new productsPage_1.ProductPage(page);
        // await loginPage.loginWithEnterKey('standard_user', 'secret_sauce');
        yield productsPage.verifyProductsVisible();
        yield productsPage.openProductDetails();
    }));
    (0, test_1.test)('Add to Cart Button Visibility', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        productsPage = new productsPage_1.ProductPage(page);
        yield productsPage.addToCart('sauce-labs-backpack');
    }));
    (0, test_1.test)('Back to Products Page', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        productsPage = new productsPage_1.ProductPage(page);
        yield productsPage.verifyProductsVisible();
        yield productsPage.openProductDetails();
        yield productsPage.backToProductsPage();
        yield productsPage.verifyProductsVisible();
    }));
});
//# sourceMappingURL=productsPage.spec.js.map