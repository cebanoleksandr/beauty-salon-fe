import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додавання JWT-токена до кожного запиту
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('beauty_access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обробка 401 (автоматичний логаут)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('beauty_access_token');
      // window.location.href = '/login'; // за потреби
    }
    return Promise.reject(error);
  }
);