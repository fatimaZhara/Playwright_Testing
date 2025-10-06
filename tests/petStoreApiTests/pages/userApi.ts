import { APIRequestContext } from '@playwright/test';

export class UserApi {
    constructor(private request: APIRequestContext) { }

    async createUser(userData: any) {
        const response = await this.request.post('https://petstore.swagger.io/v2/user', {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: userData
        });
        return response;
    }

    async getUserByUsername(username: string) {
        const response = await this.request.get(`https://petstore.swagger.io/v2/user/${username}`, {
            headers: {
                'accept': 'application/json'
            }
        });
        return response;
    }

    //delete user by username
    async deleteUserByUsername(username: string) {
        const response = await this.request.delete(`https://petstore.swagger.io/v2/user/${username}`, {
            headers: {
                'accept': 'application/json'
            }
        });
        return response;
    }

    //UPDATE user by username
    async updateUserByUsername(username: string, userData: any) {
        const response = await this.request.put(`https://petstore.swagger.io/v2/user/${username}`, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: userData
        });
        return response;
    }

    //login user by username and password
    async loginUser(username: string, password: string) {
        const response = await this.request.get(`https://petstore.swagger.io/v2/user/login?username=${username}&password=${password}`, {
            headers: {
                'accept': 'application/json'
            }
        });
        return response;
    }
}
