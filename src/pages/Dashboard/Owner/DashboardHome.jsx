import React, { useEffect, useState } from "react";
import {
  getOwnerDashboardStats,
  getOwnerBookings,
  getOwnerVisits,
  getOwnerReviewSummary,
} from "../../../api/ownerApi";

export default function DashboardHome() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [bookings, setBookings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [reviews, setReviews] = useState({
    avgRating: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    /* ---------- STATS ---------- */
    try {
      const res = await getOwnerDashboardStats();
      const s = res.data?.stats || res.data || {};
      setStats({
        totalProperties: s.totalProperties || 0,
        totalBookings: s.totalBookings || 0,
        totalRevenue: s.totalRevenue || 0,
      });
    } catch (err) {
      console.error("Stats error:", err);
    }

    /* ---------- BOOKINGS ---------- */
    try {
      const res = await getOwnerBookings();
      setBookings(Array.isArray(res.data?.bookings) ? res.data.bookings : []);
    } catch (err) {
      console.error("Bookings error:", err);
    }

    /* ---------- VISITS ---------- */
    try {
      const res = await getOwnerVisits();
      setVisits(Array.isArray(res.data?.visits) ? res.data.visits : []);
    } catch (err) {
      console.error("Visits error:", err);
    }

    /* ---------- REVIEWS ---------- */
    try {
      const res = await getOwnerReviewSummary();
      setReviews({
        avgRating: res.data?.avgRating || 0,
        totalReviews: res.data?.totalReviews || 0,
      });
    } catch (err) {
      console.error("Reviews error:", err);
    }

    // 🔥 GUARANTEED loader off
    setLoading(false);
  };

  /* ---------- LOADER ---------- */
  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, Owner 👋
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Properties" value={stats.totalProperties} />
        <StatCard title="Total Bookings" value={stats.totalBookings} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} />
      </div>

      <Section title="Latest Bookings">
        {bookings.length === 0
          ? <Empty text="No bookings yet" />
          : bookings.slice(0, 5).map(b => (
              <Row
                key={b._id}
                left={b.propertyId?.title || "Property"}
                right={b.status}
              />
            ))}
      </Section>

      <Section title="Recent Visits">
        {visits.length === 0
          ? <Empty text="No visits yet" />
          : visits.slice(0, 5).map(v => (
              <Row
                key={v._id}
                left={v.propertyId?.title || "Property"}
                right={v.visitDate?.slice(0,10)}
              />
            ))}
      </Section>

      <Section title="Reviews Summary">
        <p>⭐ {reviews.avgRating}/5</p>
        <p>Total Reviews: {reviews.totalReviews}</p>
      </Section>
    </div>
  );
}

/* ---------- UI ---------- */

const Section = ({ title, children }) => (
  <div className="bg-white p-4 rounded shadow">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    {children}
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded">
    <p className="text-sm">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const Row = ({ left, right }) => (
  <div className="flex justify-between border-b py-2 text-sm">
    <span>{left}</span>
    <span className="capitalize">{right}</span>
  </div>
);

const Empty = ({ text }) => (
  <p className="text-gray-500 text-sm">{text}</p>
);
