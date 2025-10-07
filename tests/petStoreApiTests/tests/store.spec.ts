import { test, expect } from '@playwright/test';
import { StoreApi } from '../pages/storeApi';
import { Order } from '../types/api.types';

test.describe('Pet Store API - Store Tests', () => {
    let storeApi: StoreApi;

    // Order Management
    test('should place an order for a pet', async ({ request }) => {
        storeApi = new StoreApi(request);
        const testOrderId = Date.now();

        const orderData: Order = {
            id: testOrderId,
            petId: 1,
            quantity: 1,
            shipDate: new Date().toISOString(),
            status: 'placed',
            complete: true
        };

        const response = await storeApi.placeOrder(orderData);
        expect(response.id).toBe(testOrderId);
        expect(response.status).toBe('placed');
    });

    test('should retrieve order by ID', async ({ request }) => {
        storeApi = new StoreApi(request);
        const testOrderId = Date.now();

        // Create an order first
        const orderData: Order = {
            id: testOrderId,
            petId: 1,
            quantity: 1,
            shipDate: new Date().toISOString(),
            status: 'placed',
            complete: true
        };
        await storeApi.placeOrder(orderData);
        //wait
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Retrieve the order
        const { status, body } = await storeApi.getOrderById(testOrderId);
        expect(status).toBe(200);
        expect(body.id).toBe(testOrderId);
    });

    test('should delete order by ID', async ({ request }) => {
        storeApi = new StoreApi(request);
        const testOrderId = Date.now();

        // Create an order first
        const orderData: Order = {
            id: testOrderId,
            petId: 1,
            quantity: 1,
            shipDate: new Date().toISOString(),
            status: 'placed',
            complete: true
        };
        await storeApi.placeOrder(orderData);

        // Delete the order
        const { status } = await storeApi.deleteOrder(testOrderId);
        expect(status).toBe(200);

        // Verify order is deleted
        const { status: getStatus } = await storeApi.getOrderById(testOrderId);
        expect(getStatus).toBe(404);
    });

    // Inventory Management
    test('should get store inventory', async ({ request }) => {
        storeApi = new StoreApi(request);
        const inventory = await storeApi.getInventory();
        expect(inventory).toBeDefined();
        expect(Object.keys(inventory).length).toBeGreaterThan(0);
    });

    // Error Handling
    test('should handle non-existent order ID gracefully', async ({ request }) => {
        storeApi = new StoreApi(request);
        const nonExistentId = 999999999;
        const { status } = await storeApi.getOrderById(nonExistentId);
        expect(status).toBe(404);
    });

    test('should handle invalid order data', async ({ request }) => {
        storeApi = new StoreApi(request);
        const invalidOrderData = {
            id: Date.now(),
            petId: -1, // Invalid pet ID
            quantity: 0, // Invalid quantity
            shipDate: 'invalid-date',
            status: 'invalid-status',
            complete: true
        };

        try {
            await storeApi.placeOrder(invalidOrderData as Order);
        } catch (error: any) {
            expect(error.message).toBeTruthy();
        }
    });

    // Edge Cases
    test('should handle large order quantities', async ({ request }) => {
        storeApi = new StoreApi(request);
        const testOrderId = Date.now();

        const orderData: Order = {
            id: testOrderId,
            petId: 1,
            quantity: 999999, // Large quantity
            shipDate: new Date().toISOString(),
            status: 'placed',
            complete: true
        };

        const response = await storeApi.placeOrder(orderData);
        expect(response.id).toBe(testOrderId);
        expect(response.quantity).toBe(999999);
    });

    test('should handle multiple orders for the same pet', async ({ request }) => {
        storeApi = new StoreApi(request);
        const petId = 1;

        // Place multiple orders for the same pet
        const orders = await Promise.all([
            storeApi.placeOrder({
                id: Date.now(),
                petId,
                quantity: 1,
                shipDate: new Date().toISOString(),
                status: 'placed',
                complete: true
            }),
            storeApi.placeOrder({
                id: Date.now() + 1,
                petId,
                quantity: 1,
                shipDate: new Date().toISOString(),
                status: 'placed',
                complete: true
            })
        ]);

        expect(orders.length).toBe(2);
        expect(orders.every(order => order.petId === petId)).toBe(true);
    });
});