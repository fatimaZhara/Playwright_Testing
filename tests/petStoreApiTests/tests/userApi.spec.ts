import { test, expect, request } from '@playwright/test';
import { UserApi } from '../pages/userApi';

test.describe('User API Tests', () => {
    let apiContext;
    let userApi: UserApi;

    test.beforeAll(async () => {
        apiContext = await request.newContext();
        userApi = new UserApi(apiContext);
    });

    test('Should create a new user successfully', async () => {
        const userData = {
            id: 9,
            username: "fatima",
            firstName: "Abu",
            lastName: "cc",
            email: "string",
            password: "string",
            phone: "string",
            userStatus: 2
        };

        const response = await userApi.createUser(userData);

        console.log('Response status:', response.status());
        console.log('Response body:', await response.json());


        expect(response.status()).toBe(200);
    });

    test('Should retrieve user details by username', async () => {
        const username = "fatima";
        const response = await userApi.getUserByUsername(username);
        console.log('Response status:', response.status());

        expect(response.status()).toBe(200);
    });

    test('Should delete user by username', async () => {
        const username = "fatima";
        const response = await userApi.deleteUserByUsername(username);
        console.log('Response status:', response.status());
        expect(response.status()).toBe(200);
    });

    test('Should update user details by username', async () => {
        const username = "fatima";
        const updatedUserData = {
            id: 9,
            username: "leena",
            firstName: "AbuUpdated",
            lastName: "ccUpdated",
            email: "string",
            password: "string",
            phone: "string",
            userStatus: 2
        };

        const response = await userApi.updateUserByUsername(username, updatedUserData);
        console.log('Response status:', response.status());
        expect(response.status()).toBe(200);
    });

    test('Should login user with valid credentials', async () => {
        const username = "fatima";
        const password = "string";
        const response = await userApi.loginUser(username, password);
        console.log('Response status:', response.status());
        expect(response.status()).toBe(200);
    });
    //Verify login API rejects invalid credentials
    test('Should reject login with invalid credentials', async () => {
        const username = "aaa";
        const password = "66";
        const response = await userApi.loginUser(username, password);
        console.log('Response status:', response.status());
        expect(response.status()).toBe(400); // 
    });


});
