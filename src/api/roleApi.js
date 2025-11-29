import api from "./axios";

// Get all roles
export const getRoles = () => api.get("/roles");

// Create role
export const createRole = (data) => api.post("/roles", data);

// Update role
export const updateRole = (id, data) => api.put(`/roles/${id}`, data);

// Delete role
export const deleteRole = (id) => api.delete(`/roles/${id}`);
