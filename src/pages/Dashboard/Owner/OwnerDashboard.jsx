import React, { useState } from "react";
import DashboardHome from "./DashboardHome";
import MyProperties from "./MyProperties";
import Payments from "./Payments";
import Profile from "./Profile";

export default function OwnerDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("home");

  const mockProperties = [
    { id: 1, name: "Sunshine Apartments", location: "Surat", rent: 12000 },
    { id: 2, name: "Green Valley Flats", location: "Ahmedabad", rent: 9500 },
  ];

  const mockPayments = [
    { id: 1, tenant: "Rahul Mehta", amount: 12000, status: "Paid" },
    { id: 2, tenant: "Anjali Sharma", amount: 9500, status: "Pending" },
  ];

  const user = { fullName: "Owner", role: "Owner" };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <DashboardHome user={user} properties={mockProperties} payments={mockPayments} />;
      case "properties":
        return <MyProperties properties={mockProperties} />;
      case "payments":
        return <Payments payments={mockPayments} />;
      case "profile":
        return <Profile user={user} />;
      default:
        return <DashboardHome user={user} properties={mockProperties} payments={mockPayments} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-purple-800 text-white flex flex-col p-5 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Owner Panel</h2>

        <button onClick={() => setActiveTab("home")} className="text-left hover:bg-purple-700 p-2 rounded">
          Dashboard Home
        </button>
        <button onClick={() => setActiveTab("properties")} className="text-left hover:bg-purple-700 p-2 rounded">
          My Properties
        </button>
        <button onClick={() => setActiveTab("payments")} className="text-left hover:bg-purple-700 p-2 rounded">
          Payments
        </button>
        <button onClick={() => setActiveTab("profile")} className="text-left hover:bg-purple-700 p-2 rounded">
          Profile
        </button>

        <div className="mt-auto">
          <button onClick={onLogout} className="w-full bg-red-500 hover:bg-red-600 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">{renderContent()}</div>
    </div>
  );
}
