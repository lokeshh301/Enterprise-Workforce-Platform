import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8081/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to standardize error handling
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.response?.data?.error || 'An unexpected error occurred',
      fieldErrors: error.response?.data?.errors || null,
    };
    return Promise.reject(customError);
  }
);

export default axiosClient;