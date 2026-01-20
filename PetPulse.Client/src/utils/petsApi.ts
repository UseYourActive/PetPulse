import axios from 'axios';
import type { Appointment } from './appointmentsApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include authorization token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export type Pet = {
  id: string;
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
  getPet: async (id: string): Promise<Pet> => {
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
  updatePet: async (id: string, pet: Partial<Omit<Pet, 'id' | 'ownerName'>>): Promise<Pet> => {
    const response = await apiClient.put<Pet>(`/api/Pets/${id}`, pet);
    return response.data;
  },

  /**
   * Delete a pet
   */
  deletePet: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Pets/${id}`);
  },

  /**
   * Get appointments for a specific pet
   */
  getPetAppointments: async (id: string): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>(`/api/Pets/${id}/appointments`);
    return response.data;
  },
};
