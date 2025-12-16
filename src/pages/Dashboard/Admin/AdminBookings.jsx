import React, { useEffect, useState } from "react";
import {
  getAllBookingsAdmin,
  updateBookingStatusAdmin,
  deleteBookingAdmin,
} from "../../../api/adminApi";

import {
  CalendarCheck,
  Grid,
  List,
  Trash2,
  User,
  Home,
  IndianRupee,
} from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("table"); // table | card
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const params =
        filter === "all" ? {} : { status: filter };
      const res = await getAllBookingsAdmin(params);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    if (!window.confirm(`Change booking status to "${status}"?`)) return;
    await updateBookingStatusAdmin(id, status);
    loadBookings();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    await deleteBookingAdmin(id);
    loadBookings();
  };

  /* ---------------- FILTER + SEARCH ---------------- */
  const filteredBookings = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.propertyId?.title?.toLowerCase().includes(q) ||
      b.userId?.fullName?.toLowerCase().includes(q) ||
      b.userId?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2">
          <CalendarCheck className="text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Bookings Management
          </h1>
        </div>


      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between lg:flex-row gap-4">

        <input
          type="text"
          placeholder="Search by property, user, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full lg:w-1/3"
        />

        <div className="flex flex-wrap gap-2">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(
            (s) => (
              <FilterPill
                key={s}
                active={filter === s}
                onClick={() => setFilter(s)}
              >
                {s}
              </FilterPill>
            )
          )}
        </div>

        {/* VIEW TOGGLE */}
        <div className="flex gap-2">
          <ViewBtn active={view === "table"} onClick={() => setView("table")}>
            <List size={16} /> Table
          </ViewBtn>
          <ViewBtn active={view === "card"} onClick={() => setView("card")}>
            <Grid size={16} /> Cards
          </ViewBtn>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : view === "table" ? (
        /* ================= TABLE VIEW ================= */
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm">
            <thead className="bg-purple-200">
              <tr>
                <th className="p-3 text-left">Property</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">
                    {b.propertyId?.title}
                  </td>
                  <td className="p-3">
                    {b.userId?.fullName}
                    <div className="text-xs text-gray-500">
                      {b.userId?.email}
                    </div>
                  </td>
                  <td className="p-3 font-semibold">
                    ₹{b.totalAmount}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="flex justify-center p-3 text-center space-x-2">
                    <select
                      value={b.status}
                      onChange={(e) =>
                        handleStatusChange(b._id, e.target.value)
                      }
                      className="border px-2 py-1 rounded text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <ActionBtn
                      color="red"
                      icon={<Trash2 size={14} />}
                      onClick={() => handleDelete(b._id)}
                    >
                      Delete
                    </ActionBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ================= CARD VIEW ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 space-y-3"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-800">
                  {b.propertyId?.title}
                </h3>
                <StatusBadge status={b.status} />
              </div>

              <div className="text-sm text-gray-600 flex items-center gap-1">
                <User size={14} /> {b.userId?.fullName}
              </div>

              <div className="text-sm text-gray-600">
                {b.userId?.email}
              </div>

              <div className="text-lg font-bold flex items-center gap-1">
                <IndianRupee size={16} /> {b.totalAmount}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={b.status}
                  onChange={(e) =>
                    handleStatusChange(b._id, e.target.value)
                  }
                  className="border px-2 py-1 rounded text-xs w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <ActionBtn
                  color="red"
                  onClick={() => handleDelete(b._id)}
                >
                  Delete
                </ActionBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function ViewBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${active
        ? "bg-purple-600 text-white"
        : "bg-gray-100 text-gray-700"
        }`}
    >
      {children}
    </button>
  );
}

function FilterPill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs capitalize ${active
        ? "bg-purple-600 text-white"
        : "bg-gray-100 text-gray-700"
        }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"
        }`}
    >
      {status}
    </span>
  );
}

function ActionBtn({ color, children, onClick, icon }) {
  const colors = {
    red: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs text-white rounded flex items-center gap-1 ${colors[color]}`}
    >
      {icon}
      {children}
    </button>
  );
}
