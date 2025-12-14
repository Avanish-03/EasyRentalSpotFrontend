import React, { useEffect, useState } from "react";
import {
  getOwnerDashboardStats,
  getOwnerBookings,
  getOwnerVisits,
  getOwnerReviewSummary,
  getOwnerPayments,
} from "../../../api/ownerApi";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        statsRes,
        bookingsRes,
        visitsRes,
        reviewsRes,
        paymentsRes,
      ] = await Promise.allSettled([
        getOwnerDashboardStats(),
        getOwnerBookings(),
        getOwnerVisits(),
        getOwnerReviewSummary(),
        getOwnerPayments(),
      ]);

      // ✅ STATS
      if (statsRes.status === "fulfilled") {
        setStats(statsRes.value.data);
      } else {
        setStats({
          totalProperties: 0,
          totalBookings: 0,
          totalRevenue: 0,
        });
      }

      // ✅ BOOKINGS
      if (bookingsRes.status === "fulfilled") {
        setBookings(
          Array.isArray(bookingsRes.value.data?.bookings)
            ? bookingsRes.value.data.bookings
            : []
        );
      }

      // ✅ VISITS
      if (visitsRes.status === "fulfilled") {
        setVisits(
          Array.isArray(visitsRes.value.data?.visits)
            ? visitsRes.value.data.visits
            : []
        );
      }

      // ✅ REVIEWS
      if (reviewsRes.status === "fulfilled") {
        setSummary(reviewsRes.value.data || null);
      }

      // ✅ PAYMENTS
      if (paymentsRes.status === "fulfilled") {
        setPayments(
          Array.isArray(paymentsRes.value.data?.payments)
            ? paymentsRes.value.data.payments
            : []
        );
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, Owner 👋
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Properties"
          value={stats?.totalProperties || 0}
          color="from-purple-500 to-purple-700"
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          color="from-blue-500 to-blue-700"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue || 0}`}
          color="from-green-500 to-green-700"
        />
      </div>

      {/* LATEST BOOKINGS */}
      <Section title="Latest Bookings">
        <Card>
          {bookings.length === 0 ? (
            <Empty text="No bookings yet." />
          ) : (
            <ul className="divide-y">
              {bookings.slice(0, 5).map((b) => (
                <li key={b._id} className="py-2 flex justify-between">
                  <span>{b.propertyId?.title || "Property"}</span>
                  <span className="font-medium">{b.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Section>

      {/* VISITS */}
      <Section title="Recent Property Visits">
        <Card>
          {visits.length === 0 ? (
            <Empty text="No visit requests." />
          ) : (
            <ul className="divide-y">
              {visits.slice(0, 5).map((v) => (
                <li key={v._id} className="py-2 flex justify-between">
                  <span>{v.propertyId?.title || "Property"}</span>
                  <span>{v.date}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Section>

      {/* REVIEWS */}
      <Section title="Reviews Summary">
        <Card>
          {summary ? (
            <>
              <p className="text-lg font-bold">
                ⭐ {summary.avgRating}/5
              </p>
              <p>Total Reviews: {summary.totalReviews}</p>
            </>
          ) : (
            <Empty text="No reviews yet." />
          )}
        </Card>
      </Section>

      {/* PAYMENTS */}
      <Section title="Recent Payments">
        <Card>
          {payments.length === 0 ? (
            <Empty text="No payments found." />
          ) : (
            <ul className="divide-y">
              {payments.slice(0, 5).map((p) => (
                <li key={p._id} className="py-2 flex justify-between">
                  <span>{p.bookingId?.propertyId?.title}</span>
                  <span className="font-medium text-green-600">
                    ₹{p.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Section>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function Section({ title, children }) {
  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold text-gray-700">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {children}
    </div>
  );
}

function Empty({ text }) {
  return <p className="text-gray-500">{text}</p>;
}

function StatCard({ title, value, color }) {
  return (
    <div
      className={`rounded-lg p-5 text-white shadow bg-gradient-to-r ${color}`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
