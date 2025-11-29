import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // apna backend ka base URL yaha daalna
  headers: {
    "Content-Type": "application/json",
  },
});

// Agar token chahiye (auth wali APIs ke liye)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
