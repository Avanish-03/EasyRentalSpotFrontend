import api from './api';

export const createNotification = (data) => api.post('/notifications', data);
export const getNotifications = (params = {}) => api.get('/notifications', { params });
export const getNotificationById = (id) => api.get(`/notifications/${id}`);
export const markAsRead = (id) => api.patch(`/notifications/${id}/read`);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
