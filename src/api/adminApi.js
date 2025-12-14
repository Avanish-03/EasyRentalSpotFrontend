import api from "./axios";

// ----------------------
// ADMIN AUTH
// ----------------------
export const adminLogin = (data) => api.post("/admin/auth/login");
export const getAdminProfile = () => api.get("/admin/auth/me");
export const updateAdminProfile = (data) => api.put("/admin/auth/me", data);
export const adminChangePassword = (data) => api.put("/admin/auth/change-password", data);

// ----------------------
// ADMIN USERS
// ----------------------
export const getAllUsers = () => api.get("/admin/users");
export const getUserById = (id) => api.get(`/admin/users/${id}`);
export const updateUserByAdmin = (id, data) => api.put(`/admin/users/${id}`, data);
export const blockUser = (id) => api.put(`/admin/users/${id}/block`);
export const unblockUser = (id) => api.put(`/admin/users/${id}/unblock`);
export const deleteUserByAdmin = (id) => api.delete(`/admin/users/${id}`);

// ----------------------
// ADMIN PROPERTIES
// ----------------------
export const getAllPropertiesAdmin = (params) =>
  api.get("/admin/properties", { params });

export const getPropertyByIdAdmin = (id) =>
  api.get(`/admin/properties/${id}`);

export const approveProperty = (id) =>
  api.put(`/admin/properties/${id}/approve`);

export const rejectProperty = (id, reason) =>
  api.put(`/admin/properties/${id}/reject`, { reason });

export const changePropertyStatusAdmin = (id, status) =>
  api.put(`/admin/properties/${id}/status`, { status });

export const deletePropertyAdmin = (id) =>
  api.delete(`/admin/properties/${id}`);

// ----------------------
// ADMIN BOOKINGS
// ----------------------
export const getAllBookingsAdmin = (params) =>
  api.get("/admin/bookings", { params });

export const getBookingByIdAdmin = (id) =>
  api.get(`/admin/bookings/${id}`);

export const updateBookingStatusAdmin = (id, status) =>
  api.put(`/admin/bookings/${id}/status`, { status });

export const deleteBookingAdmin = (id) =>
  api.delete(`/admin/bookings/${id}`);

// ----------------------
// ADMIN NOTIFICATIONS
// ----------------------
export const getAdminNotifications = (params) =>
  api.get("/admin/notifications", { params });

export const sendNotificationToUser = (data) =>
  api.post("/admin/notifications/send", data);

export const broadcastNotification = (data) =>
  api.post("/admin/notifications/broadcast", data);

export const adminMarkNotificationRead = (id) =>
  api.put(`/admin/notifications/${id}/mark-read`);

export const adminDeleteNotification = (id) =>
  api.delete(`/admin/notifications/${id}`);

// ----------------------
// ADMIN REPORTS
// ----------------------
export const getAllReports = (params) =>
  api.get("/admin/reports", { params });

export const getReportById = (id) =>
  api.get(`/admin/reports/${id}`);

export const updateReportStatus = (id, status) =>
  api.put(`/admin/reports/${id}/status`, { status });

export const deleteReportAdmin = (id) =>
  api.delete(`/admin/reports/${id}`);

// ----------------------
// ADMIN SUPPORT TICKETS
// ----------------------
export const getAllTicketsAdmin = (params) =>
  api.get("/admin/support", { params });

export const getTicketByIdAdmin = (id) =>
  api.get(`/admin/support/${id}`);

export const updateTicketStatusAdmin = (id, status) =>
  api.put(`/admin/support/${id}/status`, { status });

export const assignTicketAdmin = (id, userId) =>
  api.put(`/admin/support/${id}/assign`, { userId });

export const deleteTicketAdmin = (id) =>
  api.delete(`/admin/support/${id}`);

// ----------------------
// ADMIN DASHBOARD
// ----------------------
export const getAdminDashboardSummary = () =>
  api.get("/admin/dashboard/summary");

export const getAdminBookingsTrend = () =>
  api.get("/admin/dashboard/bookings-trend");

export const getAdminRevenueTrend = () =>
  api.get("/admin/dashboard/revenue-trend");

export const getAdminPropertyStatus = () =>
  api.get("/admin/dashboard/property-status");

export const getAdminTopOwners = () =>
  api.get("/admin/dashboard/top-owners");

export const getAdminReportsStats = () =>
  api.get("/admin/dashboard/reports");
