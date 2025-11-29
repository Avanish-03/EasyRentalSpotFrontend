import api from './api';

export const createReview = (data) => api.post('/reviews', data);
export const getReviews = (params = {}) => api.get('/reviews', { params });
export const getReviewById = (id) => api.get(`/reviews/${id}`);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);