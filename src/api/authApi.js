import api from "./axios";

// Register user
export const registerUser = (data) => api.post("/auth/register", data);

// Login user
export const loginUser = (data) => api.post("/auth/login", data);

// Get current logged in user
export const getProfile = () =>
  api.get("/auth/me", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
