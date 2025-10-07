import { APIRequestContext } from '@playwright/test';
import { User } from '../types/api.types';
//import { env } from 'process';
import * as dotenv from 'dotenv';
dotenv.config();



export class UserApi {
    private readonly request: APIRequestContext;


    private readonly baseUrl = process.env.BASE_URL

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createUser(userData: User) {
        return await this.request.post(`${this.baseUrl}/user`, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: userData
        });
    }

    async getUserByUsername(username: string) {
        return await this.request.get(`${this.baseUrl}/user/${username}`, {
            headers: { 'accept': 'application/json' }
        });
    }

    async deleteUserByUsername(username: string) {
        return await this.request.delete(`${this.baseUrl}/user/${username}`, {
            headers: { 'accept': 'application/json' }
        });
    }

    async updateUserByUsername(username: string, userData: User) {
        return await this.request.put(`${this.baseUrl}/user/${username}`, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: userData
        });
    }

    async loginUser(username: string, password: string) {
        return await this.request.get(
            `${this.baseUrl}/user/login?username=${username}&password=${password}`,
            { headers: { 'accept': 'application/json' } }
        );
    }
}
