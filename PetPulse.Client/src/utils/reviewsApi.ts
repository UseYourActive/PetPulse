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

export type Review = {
  id: string;
  rating: number;
  comment: string;
  vetId: string;
  vetName?: string;
  userId?: string;
  userName?: string;
  ownerName?: string;
  datePosted?: string;
  createdAt?: string;
};

export type CreateReviewDto = {
  rating: number;
  comment: string;
  vetId: string;
  ownerId: string;
};

export const reviewsApi = {
  /**
   * Get all reviews for a specific veterinarian
   */
  getReviews: async (vetId: string): Promise<Review[]> => {
    const response = await apiClient.get<Review[]>('/api/Reviews', {
      params: { vetId },
    });
    return response.data;
  },

  /**
   * Create a new review
   */
  createReview: async (review: CreateReviewDto): Promise<Review> => {
    // Ensure rating is an integer as the API expects System.Int32
    const reviewData = {
      ...review,
      rating: Math.round(review.rating),
    };
    const response = await apiClient.post<Review>('/api/Reviews', reviewData);
    return response.data;
  },

  /**
   * Delete a review
   */
  deleteReview: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/Reviews/${id}`);
  },
};
