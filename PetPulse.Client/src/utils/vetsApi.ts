import axios from 'axios';

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

export type Vet = {
  id: string;
  fullName: string;
};

export type CreateVetDto = {
  firstName: string;
  lastName: string;
  yearsOfExperience: number;
};

export const vetsApi = {
  /**
   * Get all veterinarians
   */
  getVets: async (): Promise<Vet[]> => {
    const response = await apiClient.get<Vet[]>('/api/Vets');
    return response.data;
  },

  /**
   * Get a single veterinarian by ID
   */
  getVet: async (id: string): Promise<Vet> => {
    const response = await apiClient.get<Vet>(`/api/Vets/${id}`);
    return response.data;
  },

  /**
   * Create a new veterinarian (Admin only)
   */
  createVet: async (vet: CreateVetDto): Promise<Vet> => {
    const response = await apiClient.post<Vet>('/api/Vets', vet);
    return response.data;
  },

  /**
   * Update an existing veterinarian (Admin only)
   */
  updateVet: async (id: string, vet: CreateVetDto): Promise<void> => {
    await apiClient.put(`/api/Vets/${id}`, vet);
  },

  /**
   * Delete a veterinarian (Admin only)
   */
  deleteVet: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Vets/${id}`);
  },
};
