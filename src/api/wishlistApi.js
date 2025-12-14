//wishlistApi.js
import api from './api';

export const addToWishlist = (data) => api.post('/wishlist', data);
export const getWishList = (params = {}) => api.get('/wishlist', { params});
export const getWishListById = (id) => api.get(`/wishlist/${id}`);
export const deleteWishList = (id) => api.delete(`/wishlist/${id}`);