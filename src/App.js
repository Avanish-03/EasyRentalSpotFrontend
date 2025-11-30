import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Listings from "./pages/Listings";
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/forgot-password';
import NotFound from './pages/NotFound';

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/Dashboard/Admin/AdminDashboard";
import OwnerDashboard from "./pages/Dashboard/Owner/OwnerDashboard";
import TenantDashboard from "./pages/Dashboard/Tenant/TenantDashboard";

import { useLocation } from "react-router-dom";

export default function App() {

  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const hideNavbarFooter = location.pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
       {!hideNavbarFooter && <Navbar onSearch={setSearchQuery} />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/listings" element={<Listings searchQuery={searchQuery} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/owner" element={
            <ProtectedRoute>
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/tenant" element={
            <ProtectedRoute>
              <TenantDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}