import api from "./axios";

export const getAllPlans = (params = {}) => api.get("/subscriptions/plans", { params });
export const getPlanById = (planId) => api.get(`/subscriptions/plans/${planId}`);
export const createPlan = (data) => api.post("/subscriptions/plans", data);
export const updatePlan = (planId, data) => api.put(`/subscriptions/plans/${planId}`, data);
export const deletePlan = (planId) => api.delete(`/subscriptions/plans/${planId}`);
export const purchasePlan = (userId, planId) => api.post(`/subscriptions/purchase`, { userId, planId });
export const getUserSubscriptions = (userId, params = {}) =>
  api.get(`/subscriptions/user/${userId}`, { params });
export const isSubscriptionActive = (userId) =>
  api.get(`/subscriptions/user/${userId}/active`);
