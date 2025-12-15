// src/api/axiosConfig.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Puerto por defecto de Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el Token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;