import api from "./axios";

export const getAllAmenities = (params = {}) => api.get("/amenities", { params });
export const getAmenityById = (amenityId) => api.get(`/amenities/${amenityId}`);
export const createAmenity = (data) => api.post("/amenities", data);
export const updateAmenity = (amenityId, data) => api.put(`/amenities/${amenityId}`, data);
export const deleteAmenity = (amenityId) => api.delete(`/amenities/${amenityId}`);
