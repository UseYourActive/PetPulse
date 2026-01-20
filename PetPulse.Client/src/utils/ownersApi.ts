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

export type Owner = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type CreateOwnerDto = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export const ownersApi = {
  /**
   * Get all owners
   */
  getOwners: async (): Promise<Owner[]> => {
    const response = await apiClient.get<Owner[]>('/api/Owners');
    return response.data;
  },

  /**
   * Get a single owner by ID
   */
  getOwner: async (id: string): Promise<Owner> => {
    const response = await apiClient.get<Owner>(`/api/Owners/${id}`);
    return response.data;
  },

  /**
   * Create a new owner
   */
  createOwner: async (owner: CreateOwnerDto): Promise<Owner> => {
    const response = await apiClient.post<Owner>('/api/Owners', owner);
    return response.data;
  },

  /**
   * Update an existing owner
   */
  updateOwner: async (id: string, owner: CreateOwnerDto): Promise<void> => {
    await apiClient.put(`/api/Owners/${id}`, owner);
  },

  /**
   * Delete an owner
   */
  deleteOwner: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Owners/${id}`);
  },
};
