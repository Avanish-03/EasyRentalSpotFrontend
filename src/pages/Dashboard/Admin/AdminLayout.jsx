import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";

// pages
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";
import AdminProperties from "./AdminProperties";
import AdminBookings from "./AdminBookings";
import AdminReports from "./AdminReports";
import AdminSupport from "./AdminSupport";
import AdminProfile from "./AdminProfile";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Admin") {
      navigate("/admin/login");
    }
  }, [navigate]);

  /* ---------------- TAB RENDER ---------------- */
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <AdminDashboard />;

      case "users":
        return <AdminUsers />;

      case "properties":
        return <AdminProperties />;

      case "bookings":
        return <AdminBookings />;

      case "reports":
        return <AdminReports />;

      case "support":
        return <AdminSupport />;

      case "profile":
        return <AdminProfile />;

      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <Sidebar
        role="Admin"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto ml-64">
        {renderContent()}
      </div>
    </div>
  );
}
