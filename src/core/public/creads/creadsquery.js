import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { getCSRFToken, refreshCSRFToken } from '../../../utils/csrf';
import { performLogin } from './loginHelper';

// Axios interceptor to include credentials and CSRF token in all requests
axios.interceptors.request.use(async (config) => {
  config.withCredentials = true;

  // Skip CSRF token for login and signup endpoints
  const isAuthEndpoint = config.url?.includes('/api/creds/login') ||
    config.url?.includes('/api/creds/signup') ||
    config.url?.includes('/api/creds/logout') ||
    config.url?.includes('/login') ||
    config.url?.includes('/signup') ||
    config.url?.includes('/logout');

  // Add CSRF token to non-GET requests (except auth endpoints)
  if (config.method !== 'get' && !isAuthEndpoint) {
    try {
      console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
      const csrfToken = await getCSRFToken();
      console.log('CSRF token retrieved:', csrfToken ? 'Present' : 'Missing');

      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
        console.log('CSRF token added to request headers');
      } else {
        console.warn('No CSRF token available for request');
      }
    } catch (error) {
      console.error('Failed to get CSRF token:', error);
    }
  } else if (isAuthEndpoint) {
    console.log(`Skipping CSRF token for auth endpoint: ${config.url}`);
  }

  return config;
});

// Response interceptor to handle CSRF token errors
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403 &&
      error.response?.data?.error === 'CSRF_TOKEN_MISMATCH') {
      // Clear the stored token and try to fetch a new one
      try {
        console.log('CSRF token mismatch detected, refreshing token...');
        const newToken = await refreshCSRFToken();
        // Retry the original request with the new token
        const originalRequest = error.config;
        originalRequest.headers['X-CSRF-Token'] = newToken;
        console.log('Retrying request with new CSRF token');
        return axios(originalRequest);
      } catch (retryError) {
        console.error('Failed to retry request with new CSRF token:', retryError);
      }
    }
    return Promise.reject(error);
  }
);

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ['LOGIN'],
    mutationFn: (data) => {
      return performLogin(data);
    },
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationKey: ['SIGNUP'],
    mutationFn: (data) => {
      return axios.post('https://localhost:3000/api/creds/signup', data);
    },
  });
};