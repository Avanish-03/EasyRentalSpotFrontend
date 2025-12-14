import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";

import DashboardHome from "./DashboardHome";
import Bookings from "./MyBookings";
import Payments from "./Payments";
import Wishlist from "./Wishlist";
import Profile from "./Profile";

export default function TenantDashboard() {

  // 🔁 Persist active tab
  const [activeTab, setActiveTab] = useState(() =>
    localStorage.getItem("tenantActiveTab") || "home"
  );

  useEffect(() => {
    localStorage.setItem("tenantActiveTab", activeTab);
  }, [activeTab]);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar
        role="Tenant"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 ml-64">

        {activeTab === "home" && <DashboardHome />}
        {activeTab === "bookings" && <Bookings />}
        {activeTab === "payments" && <Payments />}
        {activeTab === "wishlist" && <Wishlist />}
        {activeTab === "profile" && <Profile />}

      </div>
    </div>
  );
}
