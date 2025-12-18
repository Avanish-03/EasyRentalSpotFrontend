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
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* =====================================================
   ANALYTICS COMPONENT
===================================================== */
const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [visits, setVisits] = useState([]);

  const [view, setView] = useState("daily");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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

  /* =====================================================
     FILTER PAYMENTS BY DATE RANGE
  ===================================================== */
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (p.status !== "success") return false;

      const d = new Date(p.paymentDate);
      if (fromDate && d < new Date(fromDate)) return false;
      if (toDate && d > new Date(toDate)) return false;

      return true;
    });
  }, [payments, fromDate, toDate]);

  /* =====================================================
     REVENUE DATA
  ===================================================== */
  const dailyRevenue = useMemo(() => {
    const map = {};
    filteredPayments.forEach((p) => {
      const day = new Date(p.paymentDate).toLocaleDateString();
      map[day] = (map[day] || 0) + p.amount;
    });
    return Object.keys(map).map((d) => ({
      label: d,
      revenue: map[d],
    }));
  }, [filteredPayments]);

  const monthlyRevenue = useMemo(() => {
    const map = {};
    filteredPayments.forEach((p) => {
      const m = new Date(p.paymentDate).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      map[m] = (map[m] || 0) + p.amount;
    });
    return Object.keys(map).map((m) => ({
      label: m,
      revenue: map[m],
    }));
  }, [filteredPayments]);

  const yearlyRevenue = useMemo(() => {
    const map = {};
    filteredPayments.forEach((p) => {
      const y = new Date(p.paymentDate).getFullYear();
      map[y] = (map[y] || 0) + p.amount;
    });
    return Object.keys(map).map((y) => ({
      label: y,
      revenue: map[y],
    }));
  }, [filteredPayments]);

  /* =====================================================
     TOTAL METRICS
  ===================================================== */
  const totalRevenue = filteredPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const funnel = {
    visits: visits.length,
    bookings: bookings.length,
    payments: filteredPayments.length,
  };

  /* =====================================================
     EXPORT CSV
  ===================================================== */
  const exportCSV = () => {
    const rows = filteredPayments.map((p) => ({
      Date: new Date(p.paymentDate).toLocaleDateString(),
      Amount: p.amount,
      Status: p.status,
    }));

    const csv =
      "Date,Amount,Status\n" +
      rows.map((r) => `${r.Date},${r.Amount},${r.Status}`).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics-revenue.csv";
    a.click();

    URL.revokeObjectURL(url);
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

      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Metric title="Visits" value={funnel.visits} />
        <Metric title="Bookings" value={funnel.bookings} />
        <Metric title="Payments" value={funnel.payments} />
        <Metric title="Total Revenue" value={`₹ ${totalRevenue}`} />
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        />

        <button
          onClick={exportCSV}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          Export CSV
        </button>
      </div>

      {/* CHART */}
      <div className="rounded-2xl bg-white p-6 shadow space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Revenue Analytics</h2>

          <div className="flex rounded-lg border overflow-hidden text-sm">
            {["daily", "monthly", "yearly"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 capitalize ${
                  view === v
                    ? "bg-purple-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* DAILY = LINE */}
        {view === "daily" && (
          <ChartLine data={dailyRevenue} />
        )}

        {/* MONTHLY / YEARLY = BAR */}
        {view === "monthly" && (
          <ChartBar data={monthlyRevenue} />
        )}

        {view === "yearly" && (
          <ChartBar data={yearlyRevenue} />
        )}
      </div>
    </div>
  );
};

export default Analytics;

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

const Metric = ({ title, value }) => (
  <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white shadow">
    <p className="text-sm opacity-90">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const ChartLine = ({ data }) => {
  if (data.length === 0)
    return <p className="text-gray-500">No data</p>;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#8b5cf6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const ChartBar = ({ data }) => {
  if (data.length === 0)
    return <p className="text-gray-500">No data</p>;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="revenue"
            fill="#8b5cf6"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
