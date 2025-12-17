import React, { useEffect, useState } from "react";
import {
  getOwnerDashboardStats,
  getOwnerBookings,
  getOwnerVisits,
  getOwnerReviewSummary,
  getOwnerPayments,
} from "../../../api/ownerApi";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  Bar,
  AreaChart,
  BarChart,
} from "recharts";

import {
  Building,
  Calendar,
  IndianRupee,
  Star,
} from "lucide-react";

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

  const [bookingChart, setBookingChart] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        bookingsRes,
        visitsRes,
        reviewsRes,
        paymentsRes,
      ] = await Promise.all([
        getOwnerDashboardStats(),
        getOwnerBookings(),
        getOwnerVisits(),
        getOwnerReviewSummary(),
        getOwnerPayments(), // 🔥 REVENUE SOURCE
      ]);

      /* ---------- STATS ---------- */
      const s = statsRes.data?.stats || statsRes.data || {};

      const payments = Array.isArray(paymentsRes.data?.payments)
        ? paymentsRes.data.payments
        : [];

      const successfulPayments = payments.filter(
        (p) => p.status === "success"
      );

      const totalRevenue = successfulPayments.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      setStats({
        totalProperties: s.totalProperties || 0,
        totalBookings: s.totalBookings || 0,
        totalRevenue,
      });

      /* ---------- BOOKINGS ---------- */
      const bookingList = Array.isArray(bookingsRes.data?.bookings)
        ? bookingsRes.data.bookings
        : [];
      setBookings(bookingList);
      setBookingChart(buildBookingChart(bookingList));

      /* ---------- REVENUE ---------- */
      setRevenueChart(buildRevenueChart(successfulPayments));

      /* ---------- VISITS ---------- */
      setVisits(
        Array.isArray(visitsRes.data?.visits) ? visitsRes.data.visits : []
      );

      /* ---------- REVIEWS ---------- */
      setReviews({
        avgRating: reviewsRes.data?.avgRating || 0,
        totalReviews: reviewsRes.data?.totalReviews || 0,
      });
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="text-sm opacity-90">
          Here’s what’s happening with your properties today
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat
          title="Total Properties"
          value={stats.totalProperties}
          icon={<Building />}
          color="from-indigo-500 to-indigo-700"
        />
        <Stat
          title="Bookings"
          value={stats.totalBookings}
          icon={<Calendar />}
          color="from-emerald-500 to-emerald-700"
        />
        <Stat
          title="Revenue"
          value={`₹${stats.totalRevenue}`}
          icon={<IndianRupee />}
          color="from-purple-500 to-purple-700"
        />
      </div>

      {/* GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BOOKINGS GRAPH */}
        <Card title="Bookings Trend">
          {bookingChart.length === 0 ? (
            <Empty text="No booking data available" />
          ) : (
            <ChartArea data={bookingChart} dataKey="bookings" color="#6366f1" />
          )}
        </Card>

        {/* REVENUE GRAPH */}
        <Card title="Revenue Trend">
          {revenueChart.length === 0 ? (
            <Empty text="No revenue data available" />
          ) : (
            <ChartBar data={revenueChart} />
          )}
        </Card>
      </div>

      {/* BOOKINGS + VISITS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Latest Bookings">
          {bookings.slice(0, 5).map((b) => (
            <Row
              key={b._id}
              left={b.propertyId?.title || "Property"}
              right={<StatusBadge status={b.status} />}
            />
          ))}
        </Card>

        <Card title="Upcoming Visits">
          {visits.slice(0, 5).map((v) => (
            <Row
              key={v._id}
              left={v.propertyId?.title || "Property"}
              right={v.visitDate?.slice(0, 10)}
            />
          ))}
        </Card>
      </div>

      {/* REVIEWS */}
      <Card title="Reviews Overview">
        <div className="flex items-center gap-2 text-yellow-500">
          <Star />
          <span className="text-xl font-bold">{reviews.avgRating}</span>
          <span className="text-sm text-gray-600">
            ({reviews.totalReviews} reviews)
          </span>
        </div>
      </Card>
    </div>
  );
}

/* ---------- HELPERS ---------- */

const buildBookingChart = (bookings) => {
  const map = {};
  bookings.forEach((b) => {
    const date = new Date(b.createdAt).toISOString().slice(0, 10);
    map[date] = map[date] || { date, bookings: 0 };
    map[date].bookings += 1;
  });
  return Object.values(map).slice(-10);
};

const buildRevenueChart = (payments) => {
  const map = {};
  payments.forEach((p) => {
    const date = new Date(p.paymentDate).toISOString().slice(0, 10);
    map[date] = map[date] || { date, revenue: 0 };
    map[date].revenue += p.amount;
  });
  return Object.values(map).slice(-10);
};

/* ---------- UI ---------- */

const ChartArea = ({ data, dataKey, color }) => (
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area dataKey={dataKey} stroke={color} fill="url(#grad)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const ChartBar = ({ data }) => (
  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenue" fill="#22c55e" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const Card = ({ title, children }) => (
  <div className="rounded-xl bg-white p-5 shadow">
    <h2 className="mb-3 font-semibold">{title}</h2>
    {children}
  </div>
);

const Stat = ({ title, value, icon, color }) => (
  <div className={`rounded-xl bg-gradient-to-r ${color} p-5 text-white flex justify-between`}>
    <div>
      <p className="text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
    {icon}
  </div>
);

const Row = ({ left, right }) => (
  <div className="flex justify-between border-b py-2 text-sm">
    <span>{left}</span>
    <span>{right}</span>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs ${map[status]}`}>
      {status}
    </span>
  );
};

const Empty = ({ text }) => (
  <p className="text-sm text-gray-500">{text}</p>
);
