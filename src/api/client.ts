import axios from 'axios';

// Currently uses a placeholder base URL. 
// In production, this would be replaced with process.env.EXPO_PUBLIC_API_URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.kicks-sneakers.example.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Inject auth token here when auth is implemented
    // const token = useAuthStore.getState().token;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error normalization
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error normalisation
    let normalizedError = {
      message: 'An unexpected error occurred.',
      status: 500,
      originalError: error,
    };

    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      normalizedError.status = error.response.status;
      normalizedError.message = error.response.data?.message || `Server Error: ${error.response.status}`;
      
      if (normalizedError.status === 401) {
        // Handle token expiration/logout centrally
      }
    } else if (error.request) {
      // The request was made but no response was received (Network Error / Timeout)
      normalizedError.message = 'Network error. Please check your connection and try again.';
      normalizedError.status = 0;
    }

    return Promise.reject(normalizedError);
  }
);
