import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from "../shared/interfaces/apiInterface";
import { API_ENDPOINTS } from './apiEndpoints';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api/v1';


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

// Fire-and-forget activity log for POST requests
const LOGS_ENDPOINT = '/logs';

function formatActionSuccess(endpoint: string): string {
  switch (endpoint) {
    case API_ENDPOINTS.AUTH.LOGIN:
      return 'login-success';
    case API_ENDPOINTS.AUTH.REGISTER:
      return 'register-success';
    case API_ENDPOINTS.AUTH.LOGOUT:
      return 'logout-success';
    case API_ENDPOINTS.AUTH.VERIFY_OTP:
      return 'verify-otp-success';
    case API_ENDPOINTS.AUTH.RESEND_OTP:
      return 'resend-otp-success';
    case API_ENDPOINTS.AUTH.FORGOT_PASSWORD:
      return 'forgot-password-success';
    case API_ENDPOINTS.AUTH.RESET_PASSWORD:
      return 'reset-password-success';
    case API_ENDPOINTS.SUBSCRIPTIONS.CREATE_SUBSCRIPTION:
      return 'subscription-create-success';
    case '/subscriptions/clientSecret':
      return 'subscription-client-secret-success';
    default: {
      const cleaned = endpoint.replace(/^\/+/, '');
      const parts = cleaned.split('/');
      const last = parts[parts.length - 1] || 'post';
      return `${last}-success`;
    }
  }
}

function formatService(endpoint: string): string {
  switch (endpoint) {
    case API_ENDPOINTS.AUTH.LOGIN:
      return 'authentication-login';
    case API_ENDPOINTS.AUTH.REGISTER:
      return 'authentication-register';
    case API_ENDPOINTS.AUTH.LOGOUT:
      return 'authentication-logout';
    case API_ENDPOINTS.AUTH.VERIFY_OTP:
      return 'authentication-verify-otp';
    case API_ENDPOINTS.AUTH.RESEND_OTP:
      return 'authentication-resend-otp';
    case API_ENDPOINTS.AUTH.FORGOT_PASSWORD:
      return 'authentication-forgot-password';
    case API_ENDPOINTS.AUTH.RESET_PASSWORD:
      return 'authentication-reset-password';
    case API_ENDPOINTS.SUBSCRIPTIONS.CREATE_SUBSCRIPTION:
      return 'stripe-subscription-create';
    case '/subscriptions/clientSecret':
      return 'stripe-subscription-client-secret';
    default: {
      const cleaned = endpoint.replace(/^\/+/, '');
      return cleaned.replace(/\//g, '-').toLowerCase() || 'unknown';
    }
  }
}

async function logActivityPost(endpoint: string, opts?: { description?: string; bookingId?: string; tokenOverride?: string }) {
  try {
    const token = opts?.tokenOverride || localStorage.getItem('token');
    if (!token) return; // protected route requires auth
    if (endpoint.startsWith(LOGS_ENDPOINT)) return; // avoid recursion

    const payload = {
      action: formatActionSuccess(endpoint),
      service: formatService(endpoint),
      fullRequestUrl: `${API_BASE_URL}${endpoint}`,
      date: new Date().toISOString(),
      // ...(opts?.description ? { description: opts.description } : {}),
      ...(opts?.bookingId ? { bookingId: opts.bookingId } : {}),
    };

    // Use axiosInstance directly to bypass apiClient.post to avoid recursion
    await axiosInstance.post<ApiResponse<unknown>>(LOGS_ENDPOINT, payload, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch {
    // Ignore logging failures
  }
}

export async function apiRequest<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance({
      url: endpoint,
      ...options,
    }); 
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

  post: async <T, D = Record<string, unknown>>(endpoint: string, data?: D) => {
    try {
      const result = await apiRequest<T>(endpoint, {
        method: 'POST',
        data,
      });
      // Non-blocking activity log on success only
      const bookingId = data && typeof data === 'object' && typeof (data as Record<string, unknown>).bookingId === 'string'
        ? (data as Record<string, unknown>).bookingId as string
        : undefined;
      // Try to extract token from response for public endpoints like login/register
      const possibleBody: unknown = (result as unknown as { body?: unknown })?.body ?? result;
      const tokenOverride = (possibleBody as Record<string, unknown>)?.authToken as string
        || (possibleBody as Record<string, unknown>)?.token as string
        || undefined;

      void logActivityPost(endpoint, { description: `POST ${endpoint} success`, bookingId, tokenOverride }).catch(() => undefined);
      return result;
    } catch (err) {
      // Do not log failures for action-success metric
      throw err;
    }
  },

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
