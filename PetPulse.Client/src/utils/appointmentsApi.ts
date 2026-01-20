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

export type Treatment = {
  id: string;
  name: string;
  cost: number;
};

export type Appointment = {
  id: string;
  date: string;
  status: string;
  description: string;
  petName: string;
  ownerName: string;
  vetName: string;
  treatments: Treatment[];
};

export type CreateAppointmentDto = {
  date: string;
  description: string;
  petId: string;
  vetId: string;
};

export type AppointmentStatus = 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'NoShow';

export type GetAppointmentsParams = {
  page?: number;
  pageSize?: number;
  sortOrder?: 'date_desc' | 'date_asc' | 'status';
  filterDate?: string;
  filterPetId?: string;
};

export const appointmentsApi = {
  /**
   * Get all appointments with optional pagination, sorting, and filtering
   */
  getAppointments: async (params?: GetAppointmentsParams): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>('/api/Appointments', {
      params: {
        page: params?.page ?? 1,
        pageSize: params?.pageSize ?? 10,
        sortOrder: params?.sortOrder ?? 'date_desc',
        filterDate: params?.filterDate,
        filterPetId: params?.filterPetId,
      },
    });
    return response.data;
  },

  /**
   * Get a single appointment by ID
   */
  getAppointment: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get<Appointment>(`/api/Appointments/${id}`);
    return response.data;
  },

  /**
   * Create a new appointment
   */
  createAppointment: async (appointment: CreateAppointmentDto): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>('/api/Appointments', appointment);
    return response.data;
  },

  /**
   * Update appointment status
   */
  updateStatus: async (id: string, status: AppointmentStatus): Promise<void> => {
    await apiClient.put(`/api/Appointments/${id}/status`, status);
  },

  /**
   * Delete an appointment
   */
  deleteAppointment: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Appointments/${id}`);
  },
};
