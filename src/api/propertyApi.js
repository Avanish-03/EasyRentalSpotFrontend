import api from './api';

export const getProperties = (params) => api.get('/properties', { params });

export const getPropertyById = (id) => api.get(`/properties/${id}`);   
export const createProperty = (data) => api.post('/properties', data);
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data);
export const deleteProperty = (id) => api.delete(`/properties/${id}`);
export const searchProperties = (query) => api.get('/properties/search', { params: { q: query } });
