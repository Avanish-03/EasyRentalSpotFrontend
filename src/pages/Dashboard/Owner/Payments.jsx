import React, { useEffect, useMemo, useState } from "react";
import { getOwnerPayments } from "../../../api/ownerApi";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🔎 UI STATES
  const [view, setView] = useState("cards"); // cards | table
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await getOwnerPayments();

      const paymentList = Array.isArray(res.data?.payments)
        ? res.data.payments
        : [];

      setPayments(paymentList);
      setRevenue(res.data?.revenue || 0);
    } catch (err) {
      console.error("Failed to load payments", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- FILTERED PAYMENTS ---------- */
  const filteredPayments = useMemo(() => {
    let list = [...payments];

    if (status !== "all") {
      list = list.filter((p) => p.status === status);
    }

    if (method !== "all") {
      list = list.filter((p) => p.paymentMethod === method);
    }

    return list;
  }, [payments, status, method]);

  /* ---------- STATS ---------- */
  const stats = {
    success: payments.filter((p) => p.status === "success").length,
    pending: payments.filter((p) => p.status === "pending").length,
    failed: payments.filter((p) => p.status === "failed").length,
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>

        {/* VIEW TOGGLE */}
        <div className="flex rounded-lg border overflow-hidden">
          <button
            onClick={() => setView("cards")}
            className={`px-4 py-2 text-sm ${
              view === "cards"
                ? "bg-green-600 text-white"
                : "bg-white"
            }`}
          >
            Card View
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 text-sm ${
              view === "table"
                ? "bg-green-600 text-white"
                : "bg-white"
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* 💰 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Total Revenue" value={`₹${revenue}`} />
        <SummaryCard title="Success" value={stats.success} color="green" />
        <SummaryCard title="Pending" value={stats.pending} color="yellow" />
        <SummaryCard title="Failed" value={stats.failed} color="red" />
      </div>

      {/* 🔎 FILTER BAR */}
      <div className="flex flex-wrap gap-4 rounded-xl bg-white p-4 shadow">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Methods</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
          <option value="netbanking">Net Banking</option>
          <option value="cash">Cash</option>
        </select>
      </div>

      {/* CONTENT */}
      {filteredPayments.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow">
          No payments found
        </div>
      ) : view === "cards" ? (
        /* 🧱 CARD VIEW */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPayments.map((p) => (
            <div
              key={p._id}
              className="rounded-xl bg-white p-5 shadow hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg truncate">
                {p.bookingId?.propertyId?.title || "Property"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                👤 {p.payerId?.fullName || "Tenant"}
              </p>

              <p className="mt-3 text-2xl font-bold text-green-700">
                ₹{p.amount}
              </p>

              <div className="mt-2 flex justify-between text-sm text-gray-600">
                <span className="capitalize">{p.paymentMethod}</span>
                <span>
                  {new Date(p.paymentDate).toLocaleDateString()}
                </span>
              </div>

              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
      ) : (
        /* 📊 TABLE VIEW */
        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Tenant</th>
                <th className="p-3 border">Property</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Method</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p._id} className="border">
                  <td className="p-3 border">
                    <div className="font-medium">
                      {p.payerId?.fullName || "Tenant"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {p.payerId?.email}
                    </div>
                  </td>

                  <td className="p-3 border">
                    {p.bookingId?.propertyId?.title || "Property"}
                  </td>

                  <td className="p-3 border font-semibold text-green-700">
                    ₹{p.amount}
                  </td>

                  <td className="p-3 border capitalize">
                    {p.paymentMethod}
                  </td>

                  <td className="p-3 border">
                    <StatusBadge status={p.status} />
                  </td>

                  <td className="p-3 border">
                    {new Date(p.paymentDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const SummaryCard = ({ title, value, color = "green" }) => {
  const colors = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div className={`rounded-xl p-4 font-semibold ${colors[color]}`}>
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-2xl">{value}</p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    success: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};
