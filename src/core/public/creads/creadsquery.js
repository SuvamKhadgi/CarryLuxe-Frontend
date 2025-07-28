import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// Axios interceptor to include credentials in all requests
axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ['LOGIN'],
    mutationFn: (data) => {
      return axios.post('https://localhost:3000/api/creds/login', data);
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