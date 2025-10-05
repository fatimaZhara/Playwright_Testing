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
let loginPage;
test_1.test.beforeEach('This actions run before any test', (_a, testInfo_1) => __awaiter(void 0, [_a, testInfo_1], void 0, function* ({ page }, testInfo) {
    loginPage = new loginPage_1.LoginPage(page);
    yield loginPage.open();
    console.log(`test starts for: ${testInfo.title}`);
    yield page.goto('https://www.saucedemo.com/');
}));
test_1.test.describe('Login Feature', () => {
    (0, test_1.test)('Successful Login', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield loginPage.loginWithEnterKey('standard_user', 'secret_sauce');
    }));
    (0, test_1.test)('Failed Login (Invalid password)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        // await page.goto('https://www.saucedemo.com/');
        yield loginPage.loginWithEnterKey('standard_user', '12345');
        yield loginPage.assertInvalidLoginMessage();
        yield page.getByText('Swag Labs').click();
    }));
    (0, test_1.test)('Failed Login (Invalid username)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield loginPage.loginWithEnterKey('Fatima', 'secret_sauce');
        yield loginPage.assertInvalidLoginMessage();
    }));
    (0, test_1.test)('Failed Login (Invalid username and password)', (_a) => __awaiter(void 0, [_a], void 0, function* ({ page }) {
        yield loginPage.loginWithEnterKey('Fatima', '12345');
        yield loginPage.assertInvalidLoginMessage();
    }));
});
//# sourceMappingURL=loginPage.spec.js.map