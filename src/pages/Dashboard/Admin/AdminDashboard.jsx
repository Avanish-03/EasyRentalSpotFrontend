import React from "react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </header>

      {/* Content */}
      <main className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-2xl font-bold">1200</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">Active Bookings</h2>
          <p className="text-2xl font-bold">320</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-2">Pending Reports</h2>
          <p className="text-2xl font-bold">15</p>
        </div>
      </main>
    </div>
  );
}
