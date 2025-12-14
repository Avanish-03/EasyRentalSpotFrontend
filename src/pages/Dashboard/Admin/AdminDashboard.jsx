import React, { useEffect, useState } from "react";
import {
  getAdminDashboardSummary,
  getAdminBookingsTrend,
  getAdminRevenueTrend,
  getAdminPropertyStatus,
  getAdminTopOwners,
  getAdminReportsStats,
} from "../../../api/adminApi";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell,
} from "recharts";

/* ---------- SAFETY UTILS ---------- */
const safeArray = (v) => Array.isArray(v) ? v : [];
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    users: 0,
    properties: 0,
    bookings: 0,
    pendingApprovals: 0,
    revenue: 0,
  });

  const [bookingsTrend, setBookingsTrend] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [propertyStatus, setPropertyStatus] = useState([]);
  const [topOwners, setTopOwners] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        s,
        bt,
        rt,
        ps,
        to,
        rs,
      ] = await Promise.all([
        getAdminDashboardSummary(),
        getAdminBookingsTrend(),
        getAdminRevenueTrend(),
        getAdminPropertyStatus(),
        getAdminTopOwners(),
        getAdminReportsStats(),
      ]);

      /* ---------- NORMALIZATION ---------- */
      setSummary(s?.data?.summary || summary);

      setBookingsTrend(
        safeArray(bt?.data?.data || bt?.data)
      );

      setRevenueTrend(
        safeArray(rt?.data?.data || rt?.data)
      );

      setPropertyStatus(
        safeArray(ps?.data?.data || ps?.data)
      );

      setTopOwners(
        safeArray(to?.data?.owners || to?.data?.data || to?.data)
      );

      setReports(
        safeArray(rs?.data?.reports || rs?.data?.data || rs?.data)
      );

    } catch (err) {
      console.error("ADMIN DASHBOARD LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">

      {/* ===== HEADER ===== */}
      <h1 className="text-2xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Users" value={summary.users} />
        <StatCard title="Properties" value={summary.properties} />
        <StatCard title="Bookings" value={summary.bookings} />
        <StatCard title="Pending" value={summary.pendingApprovals} />
        <StatCard title="Revenue" value={`₹${summary.revenue}`} />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <ChartCard title="Bookings Trend">
          {bookingsTrend.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={bookingsTrend}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="count" stroke="#6366f1" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Revenue Trend">
          {revenueTrend.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueTrend}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ===== PIE + TABLE ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <ChartCard title="Property Status">
          {propertyStatus.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={propertyStatus}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={90}
                  label
                >
                  {propertyStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <TableCard title="Top Owners">
          {topOwners.length === 0 ? (
            <Empty />
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Owner</th>
                  <th className="p-2">Properties</th>
                  <th className="p-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topOwners.map(o => (
                  <tr key={o._id} className="border-t">
                    <td className="p-2">{o.name || o.fullName}</td>
                    <td className="p-2 text-center">{o.totalProperties || 0}</td>
                    <td className="p-2 text-center">₹{o.totalRevenue || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableCard>
      </div>

      {/* ===== REPORTS ===== */}
      <TableCard title="Recent Reports">
        {reports.length === 0 ? (
          <Empty />
        ) : (
          <ul className="space-y-2 text-sm">
            {reports.map(r => (
              <li key={r._id} className="flex justify-between border-b pb-1">
                <span>{r.type}</span>
                <span className="capitalize text-gray-500">{r.status}</span>
              </li>
            ))}
          </ul>
        )}
      </TableCard>

    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 p-5 text-white shadow">
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}

function TableCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Empty() {
  return (
    <div className="text-gray-400 text-sm text-center py-10">
      No data available
    </div>
  );
}
