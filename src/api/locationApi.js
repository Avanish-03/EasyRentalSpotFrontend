import api from "./axios";

export const getAllLocations = () =>
  api.get("/locations");
