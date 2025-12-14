import api from "./axios";

/* ----------------------------------
   TENANT DASHBOARD
---------------------------------- */
export const getTenantDashboard = () =>
  api.get("/tenant/dashboard");

/* ----------------------------------
   TENANT PROFILE
---------------------------------- */
export const getTenantProfile = () =>
  api.get("/tenant/profile");

export const updateTenantProfile = (data) =>
  api.put("/tenant/profile", data);

export const updateTenantAvatar = (formData) =>
  api.put("/tenant/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const changeTenantPassword = (data) =>
  api.put("/tenant/profile/change-password", data);

/* ----------------------------------
   TENANT SUBSCRIPTIONS
---------------------------------- */
export const getSubscriptionPlans = () =>
  api.get("/tenant/subscriptions/plans");

export const getMySubscription = () =>
  api.get("/tenant/subscriptions/me");

export const purchaseTenantSubscription = (data) =>
  api.post("/tenant/subscriptions/purchase", data);

export const cancelTenantSubscription = () =>
  api.put("/tenant/subscriptions/cancel");

/* ----------------------------------
   TENANT PROPERTY BROWSING
---------------------------------- */
export const getTenantProperties = (params) =>
  api.get("/tenant/properties", { params });

export const getTenantFilters = () =>
  api.get("/tenant/properties/filters");

export const getTenantPropertyById = (id) =>
  api.get(`/tenant/properties/${id}`);

export const getSimilarProperties = (id) =>
  api.get(`/tenant/properties/${id}/similar`);

/* ----------------------------------
   TENANT WISHLIST
---------------------------------- */
export const addToWishlist = (data) =>
  api.post("/tenant/wishlist", data);

export const removeFromWishlist = (id) =>
  api.delete(`/tenant/wishlist/${id}`);

export const getTenantWishlist = () =>
  api.get("/tenant/wishlist");

/* ----------------------------------
   TENANT REVIEWS
---------------------------------- */
export const addReview = (data) =>
  api.post("/tenant/reviews", data);

export const updateReview = (id, data) =>
  api.put(`/tenant/reviews/${id}`, data);

export const deleteReview = (id) =>
  api.delete(`/tenant/reviews/${id}`);

export const getMyReviews = () =>
  api.get("/tenant/reviews/my");

export const getPropertyReviews = (propertyId) =>
  api.get(`/tenant/reviews/property/${propertyId}`);

/* ----------------------------------
   TENANT BOOKINGS
---------------------------------- */
export const createBooking = (data) =>
  api.post("/tenant/bookings", data);

export const checkAvailability = (data) =>
  api.post("/tenant/bookings/check-availability", data);

export const getMyBookings = () =>
  api.get("/tenant/bookings");

export const getMyBookingById = (id) =>
  api.get(`/tenant/bookings/${id}`);

export const cancelMyBooking = (id, reason) =>
  api.put(`/tenant/bookings/${id}/cancel`, { reason });

/* ----------------------------------
   TENANT PAYMENTS
---------------------------------- */
export const initiatePayment = (data) =>
  api.post("/tenant/payments/initiate", data);

export const confirmPaymentClient = (data) =>
  api.post("/tenant/payments/confirm", data);

export const getMyPayments = () =>
  api.get("/tenant/payments");

export const requestPaymentRefund = (id) =>
  api.post(`/tenant/payments/${id}/refund`);

/* ----------------------------------
   TENANT VISITS
---------------------------------- */
export const scheduleVisit = (data) =>
  api.post("/tenant/visits", data);

export const getMyVisits = () =>
  api.get("/tenant/visits");

export const getVisitById = (id) =>
  api.get(`/tenant/visits/${id}`);

export const cancelVisit = (id, reason) =>
  api.put(`/tenant/visits/${id}/cancel`, { reason });

/* ----------------------------------
   TENANT NOTIFICATIONS
---------------------------------- */
export const getTenantNotifications = () =>
  api.get("/tenant/notifications");

export const markNotificationRead = (id) =>
  api.put(`/tenant/notifications/${id}/read`);

export const markAllTenantNotificationsRead = () =>
  api.put("/tenant/notifications/read-all");

export const deleteTenantNotification = (id) =>
  api.delete(`/tenant/notifications/${id}`);

export const deleteAllTenantNotifications = () =>
  api.delete("/tenant/notifications");
