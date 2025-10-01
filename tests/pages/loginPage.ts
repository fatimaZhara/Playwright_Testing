import { expect, type Locator, type Page } from "@playwright/test";
import { TIMEOUT } from "dns";
export class LoginPage {
    //Locators
    readonly page: Page;
    readonly username_tb: Locator;
    readonly password_tb: Locator;
    readonly login_btn: Locator;
    readonly invalidLoginMessage: Locator;

    //Variables

    readonly url: string = "https://www.saucedemo.com/";
    readonly invalidLoginMessageText: string = "Epic sadface: You can only access '/cart.html' when you are logged in.";


    //Constructors

    constructor(page: Page) {
        this.page = page;
        this.username_tb = page.getByPlaceholder('Username');
        this.password_tb = page.getByPlaceholder('Password');
        this.login_btn = page.getByRole('button', { name: 'Login' });
        this.invalidLoginMessage = page.locator('[data-test="error"]');


    }

    //Actions

    async open() {


        await this.page.goto(this.url);
    }

    async login(Username: string, Password: string) {


        await this.username_tb.fill(Username);
        await this.password_tb.fill(Password);
        await this.login_btn.waitFor({ state: 'visible', timeout: 60000 }); //
        await this.login_btn.click();
    }

    async loginWithEnterKey(Username: string, Password: string) {


        await this.username_tb.fill(Username);
        await this.password_tb.fill(Password);
        await this.login_btn.click();
    }


    //Assertions

    async assertInvalidLoginMessage() {

        await expect(this.invalidLoginMessage).toBeVisible();
    }


}