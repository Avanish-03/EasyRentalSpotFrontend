import React, { useEffect, useState } from "react";
import {
  getAllBookingsAdmin,
  updateBookingStatusAdmin,
  deleteBookingAdmin,
} from "../../../api/adminApi";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadBookings();
  }, [filter]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookingsAdmin(
        filter ? { status: filter } : {}
      );
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

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Bookings Management
        </h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Property</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-3">
                    {b.propertyId?.title || "Property"}
                  </td>
                  <td className="p-3">
                    {b.userId?.fullName}
                    <br />
                    <span className="text-xs text-gray-500">
                      {b.userId?.email}
                    </span>
                  </td>
                  <td className="p-3">₹{b.totalAmount}</td>
                  <td className="p-3 capitalize">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="p-3 text-center space-x-2">
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

                    <button
                      onClick={() => handleDelete(b._id)}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
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

/* -------- UI -------- */

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}
