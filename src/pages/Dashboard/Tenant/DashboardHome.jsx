import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTenantDashboard,
  getTenantProperties,
} from "../../../api/tenantApi";

export default function TenantDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  const [stats, setStats] = useState({
    bookings: { total: 0, active: 0, pending: 0 },
    payments: { pending: 0, totalSpent: 0 },
    visits: { upcomingCount: 0 },
    notifications: { unread: 0 },
    reviews: { written: 0 },
    subscription: { active: false },
  });

  useEffect(() => {
    loadDashboard();
    loadApprovedProperties();
  }, []);

  /* ---------------- LOAD DASHBOARD STATS ---------------- */
  const loadDashboard = async () => {
    try {
      const res = await getTenantDashboard();
      setStats(res.data.dashboard);
    } catch (err) {
      console.error("Failed to load tenant dashboard", err);
    }
  };

  /* ---------------- LOAD APPROVED PROPERTIES ---------------- */
  const loadApprovedProperties = async () => {
    try {
      const res = await getTenantProperties({
        approvalStatus: "approved",
        status: "available",
      });

      setProperties(
        Array.isArray(res.data.properties)
          ? res.data.properties
          : []
      );
    } catch (err) {
      console.error("Failed to load approved properties", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800">
        Tenant Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Bookings" value={stats.bookings.total} color="from-indigo-500 to-indigo-700" />
        <StatCard title="Active Bookings" value={stats.bookings.active} color="from-blue-500 to-blue-700" />
        <StatCard title="Payments Made" value={`₹${stats.payments.totalSpent}`} color="from-green-500 to-green-700" />
        <StatCard title="Wishlist" value={stats.reviews.written} color="from-pink-500 to-pink-700" />
        <StatCard title="Upcoming Visits" value={stats.visits.upcomingCount} color="from-yellow-500 to-yellow-700" />
      </div>

      {/* ================= APPROVED PROPERTIES ================= */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Available Properties
        </h2>

        {properties.length === 0 ? (
          <p className="text-gray-500">
            No approved properties available right now
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <div
                key={p._id}
                className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {p.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  📍 {p.locationId?.city || "Location"}
                </p>

                <p className="mt-2 text-xl font-bold text-indigo-700">
                  ₹{p.price}
                </p>

                <div className="mt-2 flex gap-4 text-sm text-gray-600">
                  <span>🛏 {p.bedrooms}</span>
                  <span>🛁 {p.bathrooms}</span>
                  <span>📐 {p.area} sqft</span>
                </div>

                <button
                  onClick={() => navigate(`/property/${p._id}`)}
                  className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                >
                  View & Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SUBSCRIPTION */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Subscription Status
        </h2>

        {stats.subscription.active ? (
          <p className="text-green-600 font-medium">
            ✅ Active Subscription
          </p>
        ) : (
          <p className="text-red-600 font-medium">
            ❌ No Active Subscription
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- UI COMPONENT ---------------- */
function StatCard({ title, value, color }) {
  return (
    <div className={`rounded-xl bg-gradient-to-r ${color} p-5 text-white shadow`}>
      <p className="text-sm opacity-80">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
