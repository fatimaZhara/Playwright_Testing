import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { Pet, ApiResponse } from '../types/api.types';
import * as dotenv from 'dotenv';
dotenv.config();

export class PetApi {
    private readonly request: APIRequestContext;
    // private readonly baseUrl: string = 'https://petstore.swagger.io/v2';
    private readonly baseUrl = process.env.BASE_URL

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async addNewPet(petData: Pet): Promise<Pet> {
        const response = await this.request.post(`${this.baseUrl}/pet`, {
            data: petData,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok()) {
            throw new Error(`Failed to add pet: ${response.statusText()}`);
        }

        try {
            return await response.json();
        } catch (error) {
            throw new Error(`Invalid JSON response when adding pet: ${response.statusText()}`);
        }
    }

    async getPetById(petId: number): Promise<{ status: number; body: Pet | ApiResponse }> {
        const response = await this.request.get(`${this.baseUrl}/pet/${petId}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        let body;
        try {
            body = await response.json();
        } catch (error) {
            throw new Error(`Invalid JSON response when getting pet: ${response.statusText()}`);
        }

        return {
            status: response.status(),
            body
        };
    }

    async updatePet(petData: Pet): Promise<Pet> {
        const response = await this.request.put(`${this.baseUrl}/pet`, {
            data: petData,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok()) {
            throw new Error(`Failed to update pet: ${response.statusText()}`);
        }

        try {
            return await response.json();
        } catch (error) {
            throw new Error(`Invalid JSON response when updating pet: ${response.statusText()}`);
        }
    }

    async deletePet(petId: number): Promise<{ status: number; body: ApiResponse }> {
        const response = await this.request.delete(`${this.baseUrl}/pet/${petId}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        let body;
        try {
            body = await response.json();
        } catch (error) {
            throw new Error(`Invalid JSON response when deleting pet: ${response.statusText()}`);
        }

        return {
            status: response.status(),
            body
        };
    }

    async findPetsByStatus(status: 'available' | 'pending' | 'sold'): Promise<Pet[]> {
        const response = await this.request.get(`${this.baseUrl}/pet/findByStatus`, {
            params: { status },
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok()) {
            throw new Error(`Failed to find pets by status: ${response.statusText()}`);
        }

        try {
            return await response.json();
        } catch (error) {
            throw new Error(`Invalid JSON response when finding pets: ${response.statusText()}`);
        }
    }

    async uploadPetImage(petId: number, imagePath: string, additionalMetadata?: string) {
        const response = await this.request.post(`${this.baseUrl}/pet/${petId}/uploadImage`, {
            multipart: {
                file: {
                    name: 'pet.jpg',
                    mimeType: 'image/jpeg',
                    buffer: await require('fs').promises.readFile(imagePath)
                },
                additionalMetadata: additionalMetadata || ''
            }
        });
        return {
            status: response.status(),
            body: await response.json()
        };
    }
}
