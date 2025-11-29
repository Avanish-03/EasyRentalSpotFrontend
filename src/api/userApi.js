import api from "./axios";

// Get all users
export const getUsers = () => api.get("/users");

// Get user by ID
export const getUserById = (id) => api.get(`/users/${id}`);

// Update user
export const updateUser = (id, data) => api.put(`/users/${id}`, data);

// Delete user
export const deleteUser = (id) => api.delete(`/users/${id}`);
