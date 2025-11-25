// frontend/src/api/api.js

import axios from 'axios';

// Define the base URL for your Express backend
const API_BASE_URL = "https://pg-management-portal.onrender.com";


// Create an Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            // Set the Authorization header if a token exists
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// We don't need a response interceptor yet, but it's where you'd handle
// 401 (Unauthorized) errors globally.

export default api;