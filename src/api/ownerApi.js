import api from "./axios";

/* ----------------------------------
   OWNER PROPERTY CRUD
---------------------------------- */
export const createProperty = (data) =>
  api.post("/properties", data);

export const updateProperty = (id, data) =>
  api.put(`/properties/${id}`, data);

export const deleteProperty = (id) =>
  api.delete(`/properties/${id}`);

// upload property images
export const uploadPropertyImages = (propertyId, formData) =>
  api.post(`/properties/upload/${propertyId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deletePropertyImage = (imageId) =>
  api.delete(`/properties/image/${imageId}`);

// fetch all owner properties
export const getOwnerProperties = () =>
  api.get("/properties/owner/all");

/* ----------------------------------
   OWNER DASHBOARD
---------------------------------- */
export const getOwnerDashboardStats = () =>
  api.get("/dashboard/owner/stats");

/* ----------------------------------
   OWNER BOOKINGS
---------------------------------- */
export const getOwnerBookings = () =>
  api.get("/dashboard/owner/bookings");

export const getOwnerBookingById = (id) =>
  api.get(`/dashboard/owner/bookings/${id}`);

export const updateOwnerBookingStatus = (id, status) =>
  api.put(`/dashboard/owner/bookings/${id}/status`, { status });

/* ----------------------------------
   OWNER PAYMENTS
---------------------------------- */
export const getOwnerPayments = () =>
  api.get("/dashboard/owner/payments");

/* ----------------------------------
   OWNER REVIEWS
---------------------------------- */
export const getOwnerReviews = () =>
  api.get("/dashboard/owner/reviews");

export const getOwnerReviewSummary = () =>
  api.get("/dashboard/owner/reviews/summary");

/* ----------------------------------
   OWNER VISITS
---------------------------------- */
export const getOwnerVisits = () =>
  api.get("/dashboard/owner/visits");

export const updateVisitStatus = (id, status) =>
  api.put(`/dashboard/owner/visits/${id}/status`, { status });

/* ----------------------------------
   OWNER SUBSCRIPTION
---------------------------------- */
export const createOwnerSubscription = (data) =>
  api.post("/subscriptions", data);

export const getActiveSubscription = () =>
  api.get("/subscriptions/active");

export const getSubscriptionHistory = () =>
  api.get("/subscriptions/history");

/* ----------------------------------
   OWNER PROFILE
---------------------------------- */
export const getOwnerProfile = () =>api.get("/profile");

export const updateOwnerProfile = (data) =>
  api.put("/profile", data);

export const updateOwnerAvatar = (formData) =>
  api.put("/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const changeOwnerPassword = (data) =>
  api.put("/profile/password", data);
