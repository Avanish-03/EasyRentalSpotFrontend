import React, { useEffect, useMemo, useState } from "react";
import {
  getOwnerBookings,
  updateOwnerBookingStatus,
} from "../../../api/ownerApi";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // 🔎 FILTER STATES
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("none");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getOwnerBookings();
      setBookings(
        Array.isArray(res.data?.bookings) ? res.data.bookings : []
      );
    } catch (err) {
      console.error("Failed to load bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UPDATE STATUS ---------- */
  const handleStatusUpdate = async (bookingId, status) => {
    const confirmMsg =
      status === "confirmed"
        ? "Approve this booking?"
        : "Cancel this booking?";

    if (!window.confirm(confirmMsg)) return;

    try {
      setUpdatingId(bookingId);
      await updateOwnerBookingStatus(bookingId, status);
      loadBookings();
    } catch (err) {
      alert("Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------- FILTERED BOOKINGS ---------- */
  const filteredBookings = useMemo(() => {
    let list = [...bookings];

    if (search) {
      list = list.filter(
        (b) =>
          b.propertyId?.title
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          b.tenantId?.fullName
            ?.toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      list = list.filter((b) => b.status === status);
    }

    if (sort === "low") {
      list.sort((a, b) => a.totalAmount - b.totalAmount);
    }

    if (sort === "high") {
      list.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    return list;
  }, [bookings, search, status, sort]);

  /* ---------- STATS ---------- */
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800">
        Bookings
      </h1>

      {/* 🔢 QUICK STATS */}
      <div className="flex gap-4 text-sm">
        <Stat label="Total" value={stats.total} />
        <Stat label="Pending" value={stats.pending} color="yellow" />
        <Stat label="Confirmed" value={stats.confirmed} color="green" />
        <Stat label="Cancelled" value={stats.cancelled} color="red" />
      </div>

      {/* 🔎 FILTER BAR */}
      <div className="flex flex-wrap gap-4 rounded-xl bg-white p-4 shadow">
        <input
          type="text"
          placeholder="Search property or tenant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="none">Sort by Amount</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {/* BOOKINGS LIST */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow">
          No bookings found
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="rounded-xl bg-white p-5 shadow hover:shadow-lg transition"
            >
              {/* PROPERTY */}
              <h2 className="text-lg font-semibold truncate">
                {b.propertyId?.title || "Property"}
              </h2>

              {/* TENANT */}
              <p className="mt-1 text-sm text-gray-500">
                👤 {b.tenantId?.fullName || "Tenant"}
              </p>

              {/* DATES */}
              <p className="mt-2 text-sm text-gray-600">
                📅 {b.bookingStartDate?.slice(0, 10)} →{" "}
                {b.bookingEndDate?.slice(0, 10)}
              </p>

              {/* AMOUNT */}
              <p className="mt-3 text-2xl font-bold text-purple-700">
                ₹{b.totalAmount}
              </p>

              {/* STATUS */}
              <StatusBadge status={b.status} />

              {/* ACTIONS */}
              {b.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <button
                    disabled={updatingId === b._id}
                    onClick={() =>
                      handleStatusUpdate(b._id, "confirmed")
                    }
                    className="flex-1 rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    Approve
                  </button>

                  <button
                    disabled={updatingId === b._id}
                    onClick={() =>
                      handleStatusUpdate(b._id, "cancelled")
                    }
                    className="flex-1 rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;

/* ---------- SMALL UI ---------- */

const Stat = ({ label, value, color = "gray" }) => {
  const colors = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-medium ${colors[color]}`}
    >
      {label}: {value}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
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
