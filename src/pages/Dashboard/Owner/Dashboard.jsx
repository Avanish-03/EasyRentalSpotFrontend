import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";

import {
  getOwnerDashboardStats,
  getOwnerBookings,
  getOwnerVisits,
  getOwnerReviewSummary,
  getOwnerPayments,
} from "../../../api/ownerApi";

import OwnerMyProp from "./OwnerMyProp";
import Bookings from "./Bookings";
import Payments from "./Payments";
import Reviews from "./Reviews";
import Visits from "./Visits";
import Profile from "./Profile";
import DashboardHome from "./DashboardHome";

const Dashboard = () => {

  // ✅ ACTIVE TAB — Persisted
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("ownerActiveTab") || "home";
  });

  // Dashboard Data
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);

  // 🔐 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("ownerActiveTab");
    window.location.href = "/login";
  };

  // ✅ Persist active tab
  useEffect(() => {
    localStorage.setItem("ownerActiveTab", activeTab);
  }, [activeTab]);

  // Load dashboard stats once
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, b, v, r, p] = await Promise.all([
        getOwnerDashboardStats(),
        getOwnerBookings(),
        getOwnerVisits(),
        getOwnerReviewSummary(),
        getOwnerPayments(),
      ]);

      setStats(s.data);
      setBookings(b.data);
      setVisits(v.data);
      setSummary(r.data);
      setPayments(p.data);
    } catch (err) {
      console.log("Dashboard loading error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 🔹 SIDEBAR */}
      <Sidebar
        role="Owner"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* 🔹 MAIN CONTENT */}
      <div className="flex-1 p-6 ml-64">

        {activeTab === "home" && <DashboardHome stats={stats} />}

        {/* 🔥 PASS activeTab HERE (IMPORTANT FIX) */}
        {activeTab === "properties" && (
          <OwnerMyProp activeTab={activeTab} />
        )}

        {activeTab === "bookings" && (
          <Bookings bookings={bookings} />
        )}

        {activeTab === "payments" && (
          <Payments payments={payments} />
        )}

        {activeTab === "visits" && (
          <Visits visits={visits} />
        )}

        {activeTab === "reviews" && (
          <Reviews summary={summary} />
        )}

        {activeTab === "profile" && <Profile />}

      </div>
    </div>
  );
};

export default Dashboard;
