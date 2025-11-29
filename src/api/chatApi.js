import api from './api';

export const createChat = (data) => api.post('/chats', data);
export const getChats = (params = {}) => api.get('/chats', {params});
export const getChatById = (id) => api.get(`/chats/${chatId}`);
export const updateChat = (id, data) => api.put(`/chats/${id}`, data);
export const deleteChat = (id) => api.delete(`/chats/${id}`);