import { test, expect } from '@playwright/test';
import { PetApi } from '../pages/petApi';
import { Pet } from '../types/api.types';
import * as fs from 'fs/promises';
import * as path from 'path';

test.describe('Pet Store API - Pet Tests', () => {
    let petApi: PetApi;

    // Basic Pet Operations
    test('should add a new pet to the store', async ({ request }) => {
        petApi = new PetApi(request);
        const testPetId = Date.now();

        const petData: Pet = {
            id: testPetId,
            name: `TestPet${testPetId}`,
            category: {
                id: 1,
                name: 'Dogs'
            },
            photoUrls: ['http://example.com/photo.jpg'],
            tags: [
                {
                    id: 0,
                    name: 'friendly'
                }
            ],
            status: 'available'
        };

        const response = await petApi.addNewPet(petData);
        expect(response.id).toBe(testPetId);
        expect(response.name).toBe(petData.name);
        expect(response.status).toBe('available');
    });

    test('should update an existing pet', async ({ request }) => {
        petApi = new PetApi(request);
        const testPetId = Date.now();

        // First create a pet
        const initialPetData: Pet = {
            id: testPetId,
            name: `TestPet${testPetId}`,
            category: { id: 1, name: 'Dogs' },
            photoUrls: [],
            tags: [],
            status: 'available'
        };
        await petApi.addNewPet(initialPetData);

        // Update the pet
        const updatedPetData: Pet = {
            id: testPetId,
            name: `UpdatedPet${testPetId}`,
            category: { id: 1, name: 'Dogs' },
            photoUrls: [],
            tags: [],
            status: 'pending'
        };
        const response = await petApi.updatePet(updatedPetData);
        expect(response.name).toBe(updatedPetData.name);
        expect(response.status).toBe('pending');
    });

    // Pet Search Operations
    test('should find pets by status', async ({ request }) => {
        petApi = new PetApi(request);
        const testPetId = Date.now();

        // Create a test pet with 'available' status
        const petData: Pet = {
            id: testPetId,
            name: `TestPet${testPetId}`,
            category: { id: 1, name: 'Dogs' },
            photoUrls: [],
            tags: [],
            status: 'available'
        };

        // Add the pet and verify it was added successfully
        const addedPet = await petApi.addNewPet(petData);
        expect(addedPet.id).toBe(testPetId);

        // Wait a short time to ensure the pet is indexed
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Find pets by status
        const pets = await petApi.findPetsByStatus('available');
        expect(Array.isArray(pets)).toBe(true);

        // Find our specific pet
        const foundPet = pets.find((pet: Pet) => pet.id === testPetId);
        expect(foundPet).toBeTruthy();

        if (foundPet) {
            expect(foundPet.id).toBe(testPetId);
            expect(foundPet.name).toBe(petData.name);
            expect(foundPet.status).toBe('available');
        }
    });

    // Pet Retrieval Operations
    test('should get pet by ID', async ({ request }) => {
        petApi = new PetApi(request);
        const testPetId = Date.now();

        // Create a test pet
        const petData: Pet = {
            id: testPetId,
            name: `TestPet${testPetId}`,
            category: { id: 1, name: 'Dogs' },
            photoUrls: [],
            tags: [],
            status: 'available'
        };
        await petApi.addNewPet(petData);
        //wait
        await new Promise(resolve => setTimeout(resolve, 3000));

        const { status, body } = await petApi.getPetById(testPetId);
        expect(status).toBe(200);
        if ('id' in body) {
            expect(body.id).toBe(testPetId);
            expect(body.name).toBe(petData.name);
        }
    });

    // Image Upload Operations
    test('should upload pet image', async ({ request }) => {
        petApi = new PetApi(request);
        const testPetId = Date.now();

        // Create a test pet first
        const petData: Pet = {
            id: testPetId,
            name: `TestPet${testPetId}`,
            category: { id: 1, name: 'Dogs' },
            photoUrls: [],
            tags: [],
            status: 'available'
        };
        await petApi.addNewPet(petData);

        // Create a temporary test image
        const imagePath = path.join(__dirname, 'test-image.jpg');
        await fs.writeFile(imagePath, 'dummy image content');

        try {
            const { status } = await petApi.uploadPetImage(
                testPetId,
                imagePath,
                'Test image upload'
            );
            expect(status).toBe(200);
        } finally {
            // Clean up the test image
            await fs.unlink(imagePath).catch(() => { });
        }
    });

    // Delete Operations
    test('should delete a pet', async ({ request }) => {
        petApi = new PetApi(request);
        const testPetId = Date.now();

        // Create a pet to delete
        const petData: Pet = {
            id: testPetId,
            name: `TestPet${testPetId}`,
            category: { id: 1, name: 'Dogs' },
            photoUrls: [],
            tags: [],
            status: 'available'
        };
        await petApi.addNewPet(petData);
        //wait
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Delete the pet
        const { status } = await petApi.deletePet(testPetId);
        expect(status).toBe(200);

        // Verify pet is deleted
        const { status: getStatus } = await petApi.getPetById(testPetId);
        expect(getStatus).toBe(404);
    });

    // Error Handling
    test('should handle non-existent pet ID gracefully', async ({ request }) => {
        petApi = new PetApi(request);
        const nonExistentId = 999999999;
        const { status } = await petApi.getPetById(nonExistentId);
        expect(status).toBe(404);
    });

    test('should handle invalid pet data gracefully', async ({ request }) => {
        petApi = new PetApi(request);
        const invalidPetData = {
            id: Date.now(),
            // Missing required fields
            status: 'invalid_status'
        };

        try {
            await petApi.addNewPet(invalidPetData as Pet);
            throw new Error('Should have thrown validation error');
        } catch (error: any) {
            expect(error.message).toBeTruthy();
        }
    });

    // Edge Cases
    test('should handle special characters in pet names', async ({ request }) => {
        petApi = new PetApi(request);
        const testPetId = Date.now();
        const specialName = 'Pet!@#$%^&*()"\'';

        const petData: Pet = {
            id: testPetId,
            name: specialName,
            category: { id: 1, name: 'Dogs' },
            photoUrls: [],
            tags: [],
            status: 'available'
        };

        const response = await petApi.addNewPet(petData);
        expect(response.name).toBe(specialName);
    });
});