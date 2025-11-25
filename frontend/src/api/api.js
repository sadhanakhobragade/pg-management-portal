// frontend/src/api/api.js

import axios from "axios";

// Use Vercel env in production, fallback to localhost for local dev
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // or true if you ever use cookies
});

export default api;
