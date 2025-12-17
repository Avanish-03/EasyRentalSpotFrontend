import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";

import OwnerMyProp from "./OwnerMyProp";
import Bookings from "./Bookings";
import Payments from "./Payments";
import Reviews from "./Reviews";
import Visits from "./Visits";
import Profile from "./Profile";
import DashboardHome from "./DashboardHome";

import Notifications from "./Notifications";
import Analytics from "./Analytics";
import Tenants from "./Tenants";
import Subscription from "./Subscription";

const Dashboard = () => {
  // ✅ ACTIVE TAB (Persisted)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("ownerActiveTab") || "home";
  });

  // ✅ Persist tab on change
  useEffect(() => {
    localStorage.setItem("ownerActiveTab", activeTab);
  }, [activeTab]);

  // 🔐 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("ownerActiveTab");
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <Sidebar
        role="Owner"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 ml-64 p-6">
        {activeTab === "home" && <DashboardHome />}

        {activeTab === "properties" && <OwnerMyProp />}

        {activeTab === "bookings" && <Bookings />}

        {activeTab === "payments" && <Payments />}

        {activeTab === "visits" && <Visits />}

        {activeTab === "reviews" && <Reviews />}

        {activeTab === "notifications" && <Notifications />}

        {activeTab === "analytics" && <Analytics />}

        {activeTab === "tenants" && <Tenants />}

        {activeTab === "subscription" && <Subscription />}

        {activeTab === "profile" && <Profile />}
      </div>
    </div>
  );
};

export default Dashboard;
