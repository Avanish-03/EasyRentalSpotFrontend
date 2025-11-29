import api from './api';


export const createAdminAction = (data) => api.post('/admin-actions', data);
export const getAdminActions = (params) => api.get('/admin-actions', { params });
export const getAdminActionById = (id) => api.get(`/admin-actions/${id}`);
export const deleteAdminAction = (id) => api.delete(`/admin-actions/${id}`);
