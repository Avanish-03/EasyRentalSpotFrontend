//reportApi.js
import api from './api';

export const getBookingReport = (params = {}) => api.get('/reports/bookings', { params });
export const getPaymentReport = (params = {}) => api.get('/reports/payments', { params });
export const getPropertyReport = (params = {}) => api.get('/reports/properties', { params });
export const getUserReport = (params = {}) => api.get('/reports/users', { params });