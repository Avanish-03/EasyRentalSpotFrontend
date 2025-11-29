import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Agar login hi nahi hai
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Agar role allowed nahi hai
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect based on user’s real role
    if (user.role === "owner") return <Navigate to="/dashboard/owner" replace />;
    if (user.role === "tenant") return <Navigate to="/dashboard/tenant" replace />;
    if (user.role === "admin") return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/" replace />;
  }

  // Access allowed
  return children;
}
