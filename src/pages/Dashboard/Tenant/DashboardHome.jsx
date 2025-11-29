import React from "react";

export default function DashboardHome({ user, bookings, payments, savedListings, openNewBooking }) {
  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Welcome, {user?.fullName}!</h2>
          <p className="text-gray-600">Here’s a quick overview of your tenant account.</p>
        </div>
        <button
          onClick={openNewBooking}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          New Booking
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
          <p className="text-2xl font-bold text-purple-600">{bookings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
          <p className="text-2xl font-bold text-red-500">{payments.filter(p => p.status === "Pending").length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Saved Listings</h3>
          <p className="text-2xl font-bold text-green-500">{savedListings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-lg font-semibold mb-2">Upcoming Visits</h3>
          <p className="text-2xl font-bold text-blue-500">2</p>
        </div>
      </div>
    </div>
  );
}
