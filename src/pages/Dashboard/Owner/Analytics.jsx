import React, { useEffect, useMemo, useState } from "react";
import {
  getOwnerBookings,
  getOwnerPayments,
  getOwnerVisits,
} from "../../../api/ownerApi";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [bRes, pRes, vRes] = await Promise.all([
        getOwnerBookings(),
        getOwnerPayments(),
        getOwnerVisits(),
      ]);

      setBookings(bRes.data?.bookings || []);
      setPayments(pRes.data?.payments || []);
      setVisits(vRes.data?.visits || []);
    } catch (err) {
      console.error("Analytics load error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- MONTH-WISE REVENUE ---------- */
  const revenueData = useMemo(() => {
    const map = {};
    payments
      .filter((p) => p.status === "success")
      .forEach((p) => {
        const month = new Date(p.paymentDate).toLocaleString("default", {
          month: "short",
        });
        map[month] = (map[month] || 0) + p.amount;
      });

    return Object.keys(map).map((m) => ({
      month: m,
      revenue: map[m],
    }));
  }, [payments]);

  /* ---------- FUNNEL ---------- */
  const funnel = {
    visits: visits.length,
    bookings: bookings.length,
    payments: payments.filter((p) => p.status === "success").length,
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Analytics
      </h1>

      {/* 🔢 FUNNEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Metric title="Visits" value={funnel.visits} />
        <Metric title="Bookings" value={funnel.bookings} />
        <Metric title="Payments" value={funnel.payments} />
      </div>

      {/* 📊 REVENUE GRAPH */}
      <div className="rounded-xl bg-white p-5 shadow">
        <h2 className="mb-3 font-semibold">
          Monthly Revenue
        </h2>

        {revenueData.length === 0 ? (
          <p className="text-gray-500">No revenue data</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;

/* ---------- UI ---------- */

const Metric = ({ title, value }) => (
  <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white shadow">
    <p className="text-sm opacity-90">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);
