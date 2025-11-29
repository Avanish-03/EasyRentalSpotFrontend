import React from "react";

export default function DashboardHome({ user, properties, payments }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Welcome, {user.fullName} 👋</h2>
      <p className="text-gray-600 mb-8">Here’s your owner account summary:</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">My Properties</h3>
          <p className="text-2xl font-bold text-purple-600">{properties.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Total Tenants</h3>
          <p className="text-2xl font-bold text-green-600">{payments.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
          <p className="text-2xl font-bold text-red-600">{payments.filter(p => p.status === "Pending").length}</p>
        </div>
      </div>
    </div>
  );
}
