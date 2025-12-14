import api from "./axios";

// Register
export const registerUser = (data) => api.post("/auth/register", data);

// Login (tenant / owner)
export const loginUser = (data) => api.post("/auth/login", data);

// Admin login
export const adminLogin = (data) => api.post("/admin/auth/login", data);

// Get current user
export const getProfile = () => api.get("/auth/me");
