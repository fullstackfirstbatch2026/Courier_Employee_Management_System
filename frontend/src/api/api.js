import axios from 'axios';

// Central API configuration using Vite environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent, user-friendly error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Unable to connect to the backend server. Please check whether the backend server is running.';

    if (error.response) {
      const data = error.response.data;
      if (typeof data === 'string' && data.trim()) {
        message = data;
      } else if (data && typeof data === 'object') {
        if (data.message) {
          message = data.message;
        } else if (data.error) {
          message = data.error;
        } else if (data.errors) {
          if (Array.isArray(data.errors)) {
            message = data.errors.map((e) => e.defaultMessage || e.message || String(e)).join(', ');
          } else if (typeof data.errors === 'object') {
            message = Object.entries(data.errors)
              .map(([field, msg]) => `${field}: ${msg}`)
              .join(', ');
          }
        }
      } else if (error.response.status === 404) {
        message = 'Requested resource not found.';
      } else if (error.response.status === 409) {
        message = 'A conflict occurred with existing data (e.g. duplicate email or tracking number).';
      } else if (error.response.status === 400) {
        message = 'Invalid request parameters or payload.';
      } else if (error.response.status >= 500) {
        message = 'A server error occurred. Please verify backend logs.';
      }
    } else if (error.request) {
      message = 'Unable to reach backend server at ' + API_BASE_URL + '. Please ensure the Spring Boot application is running.';
    }

    const customError = new Error(message);
    customError.status = error.response ? error.response.status : null;
    customError.originalError = error;
    return Promise.reject(customError);
  }
);

export default api;
