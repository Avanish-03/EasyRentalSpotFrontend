import api from "./axios";

/* ----------------------------------
   ROLES
---------------------------------- */
export const getRoles = () => api.get("/roles");

/* ----------------------------------
   USERS (public CRUD)
---------------------------------- */
export const getUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

/* ----------------------------------
   AMENITIES
---------------------------------- */
export const getAmenities = () => api.get("/amenities");

/* ----------------------------------
   LOCATIONS
---------------------------------- */
export const getLocations = () => api.get("/locations");

/* ----------------------------------
   PROPERTY (public)
---------------------------------- */
export const getPropertyPublic = (id) =>
  api.get(`/properties/${id}`);

/* ----------------------------------
   REVIEWS (public)
---------------------------------- */
export const getPropertyReviewsPublic = (propertyId) =>
  api.get(`/reviews/property/${propertyId}`);
