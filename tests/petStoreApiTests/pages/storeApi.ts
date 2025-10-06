import { APIRequestContext, expect } from '@playwright/test';

export class StoreApi {
    private request: APIRequestContext;
    private baseUrl: string = 'https://petstore.swagger.io/v2';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async placeOrder(orderData: any) {
        const response = await this.request.post(`${this.baseUrl}/store/order`, {
            data: orderData
        });
        expect(response.status()).toBe(200);
        return await response.json();
    }

    async getOrderById(orderId: number) {
        const response = await this.request.get(`${this.baseUrl}/store/order/${orderId}`);
        return {
            status: response.status(),
            body: await response.json()
        };
    }

    async deleteOrder(orderId: number) {
        const response = await this.request.delete(`${this.baseUrl}/store/order/${orderId}`);
        return {
            status: response.status(),
            body: await response.json()
        };
    }

    async getInventory() {
        const response = await this.request.get(`${this.baseUrl}/store/inventory`);
        expect(response.status()).toBe(200);
        return await response.json();
    }
}
