import React, { useEffect, useState } from "react";
import {
  getOwnerBookings,
  updateOwnerBookingStatus,
} from "../../../api/ownerApi";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getOwnerBookings();
      setBookings(
        Array.isArray(res.data?.bookings)
          ? res.data.bookings
          : []
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
      loadBookings(); // ✅ AUTO REFRESH
    } catch (err) {
      alert("Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
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
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              {/* PROPERTY */}
              <h2 className="text-lg font-semibold text-gray-800">
                {b.propertyId?.title || "Property"}
              </h2>

              {/* TENANT */}
              <p className="text-sm text-gray-500 mt-1">
                👤 {b.tenantId?.fullName || "Tenant"}
              </p>

              {/* DATES */}
              <p className="mt-2 text-sm text-gray-600">
                📅 {b.bookingStartDate?.slice(0, 10)} →{" "}
                {b.bookingEndDate?.slice(0, 10)}
              </p>

              {/* AMOUNT */}
              <p className="mt-3 text-lg font-bold text-purple-700">
                ₹{b.totalAmount}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block mt-2 rounded-full px-3 py-1 text-xs font-medium
                  ${
                    b.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : b.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >
                {b.status}
              </span>

              {/* ACTION BUTTONS */}
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
