import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public Pages
import LandingPage from "./pages/LandingPage";
import Listings from "./pages/Listings";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/forgot-password";

// Dashboard Pages
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import OwnerDashboard from "./pages/Dashboard/Owner/Dashboard";
import TenantDashboard from "./pages/Dashboard/Tenant/TenantDashboard";

// Misc
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/Dashboard/Admin/AdminLogin";
import AdminLayout from "./pages/Dashboard/Admin/AdminLayout";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  // HIDE NAVBAR/FOOTER FOR ALL DASHBOARD ROUTES
  const hideNavbarFooter =
    location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">

      {/* NAVBAR */}
      {!hideNavbarFooter && <Navbar onSearch={setSearchQuery} />}

      {/* MAIN */}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/listings" element={<Listings searchQuery={searchQuery} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* DASHBOARDS */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/owner"
            element={
              <ProtectedRoute>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/tenant"
            element={
              <ProtectedRoute>
                <TenantDashboard />
              </ProtectedRoute>
            }
          />

          {/* NOT FOUND */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* FOOTER */}
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}
