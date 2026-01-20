import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

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

export type Vaccine = {
  id: string;
  name: string;
  dateAdministered: string;
  expiryDate: string;
  petId: string;
  petName?: string;
};

export type CreateVaccineDto = {
  name: string;
  dateAdministered: string;
  expiryDate: string;
  petId: string;
};

export const vaccinesApi = {
  /**
   * Get all vaccines for a specific pet
   */
  getVaccines: async (petId: string): Promise<Vaccine[]> => {
    const response = await apiClient.get<Vaccine[]>('/api/Vaccines', {
      params: { petId },
    });
    return response.data;
  },

  /**
   * Create a new vaccine
   */
  createVaccine: async (vaccine: CreateVaccineDto): Promise<Vaccine> => {
    const response = await apiClient.post<Vaccine>('/api/Vaccines', vaccine);
    return response.data;
  },

  /**
   * Delete a vaccine
   */
  deleteVaccine: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Vaccines/${id}`);
  },
};
