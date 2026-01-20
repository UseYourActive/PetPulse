import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export type Pet = {
  id: number;
  name: string;
  type: string;
  age: number;
  ownerId: string;
  ownerName: string;
};

export const petsApi = {
  /**
   * Get all pets (filtered by current user on backend)
   */
  getPets: async (ownerId?: string): Promise<Pet[]> => {
    const response = await apiClient.get<Pet[]>('/api/Pets');
    return response.data;
  },

  /**
   * Get a single pet by ID
   */
  getPet: async (id: number): Promise<Pet> => {
    const response = await apiClient.get<Pet>(`/api/Pets/${id}`);
    return response.data;
  },

  /**
   * Create a new pet
   */
  createPet: async (pet: Omit<Pet, 'id' | 'ownerName'>): Promise<Pet> => {
    const response = await apiClient.post<Pet>('/api/Pets', pet);
    return response.data;
  },

  /**
   * Update an existing pet
   */
  updatePet: async (id: number, pet: Partial<Omit<Pet, 'id' | 'ownerName'>>): Promise<Pet> => {
    const response = await apiClient.put<Pet>(`/api/Pets/${id}`, pet);
    return response.data;
  },

  /**
   * Delete a pet
   */
  deletePet: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/Pets/${id}`);
  },
};
