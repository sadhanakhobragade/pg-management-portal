// frontend/src/api/api.js

import axios from "axios";

// Use Render URL in production, localhost in development
const API_BASE_URL = import.meta.env.PROD
  ? "https://pg-management-portal.onrender.com/api"
  : "http://localhost:5000/api";

console.log("API_BASE_URL =>", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // keep as you had
});

export default api;
