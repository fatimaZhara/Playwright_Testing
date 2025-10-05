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
exports.LoginPage = void 0;
const test_1 = require("@playwright/test");
class LoginPage {
    //Constructors
    constructor(page) {
        //Variables
        this.url = "https://www.saucedemo.com/";
        this.invalidLoginMessageText = "Epic sadface: You can only access '/cart.html' when you are logged in.";
        this.page = page;
        this.username_tb = page.getByPlaceholder('Username');
        this.password_tb = page.getByPlaceholder('Password');
        this.login_btn = page.getByRole('button', { name: 'Login' });
        this.invalidLoginMessage = page.locator('[data-test="error"]');
    }
    //Actions
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goto(this.url);
        });
    }
    login(Username, Password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.username_tb.fill(Username);
            yield this.password_tb.fill(Password);
            yield this.login_btn.waitFor({ state: 'visible', timeout: 60000 }); //
            yield this.login_btn.click();
        });
    }
    loginWithEnterKey(Username, Password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.username_tb.fill(Username);
            yield this.password_tb.fill(Password);
            yield this.login_btn.click();
        });
    }
    //Assertions
    assertInvalidLoginMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, test_1.expect)(this.invalidLoginMessage).toBeVisible();
        });
    }
}
exports.LoginPage = LoginPage;
//# sourceMappingURL=loginPage.js.map