import api from "./axios";

export const getAllLocations = (params = {}) => api.get("/locations", { params });
export const getLocationById = (locationId) => api.get(`/locations/${locationId}`);
export const createLocation = (data) => api.post("/locations", data);
export const updateLocation = (locationId, data) => api.put(`/locations/${locationId}`, data);
export const deleteLocation = (locationId) => api.delete(`/locations/${locationId}`);
