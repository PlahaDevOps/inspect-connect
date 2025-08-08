import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from "../shared/interfaces/apiInterface";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
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
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || `HTTP error! status: ${error.response.status}`;
      const customError = new Error(message) as Error & { status: number };
      customError.status = error.response.status;
      return Promise.reject(customError);
    } else if (error.request) {
      return Promise.reject(new Error('Network error occurred'));
    } else {
      return Promise.reject(error);
    }
  }
);

export function createApiError(status: number, message: string): Error & { status: number } {
  const error = new Error(message);
  (error as unknown as { status: number }).status = status;
  return error as Error & { status: number };
}

export async function apiRequest<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance({
      url: endpoint,
      ...options,
    });
    console.log("response",response);
    return response.data;
  } catch (error) {
    if ((error as Error & { status?: number }).status) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

export const apiClient = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),

  post: <T, D = unknown>(endpoint: string, data?: D) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      data,
    }),

  put: <T, D = unknown>(endpoint: string, data?: D) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      data,
    }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, {
      method: 'DELETE',
    }),
};
