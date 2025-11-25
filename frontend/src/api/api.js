// frontend/src/api/api.js

import axios from "axios";

// Decide backend URL based on where the frontend is running
const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api" // local dev
    : "https://pg-management-portal.onrender.com/api"; // deployed backend

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

export default api;
