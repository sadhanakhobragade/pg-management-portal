//frontend/src/api/api.js

import axios from "axios";

// Always use Render backend for now
const API_BASE_URL = "https://pg-management-portal.onrender.com/api";

console.log("API_BASE_URL =>", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

export default api;
