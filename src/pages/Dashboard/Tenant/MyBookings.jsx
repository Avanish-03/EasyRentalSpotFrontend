import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyBookings,
  cancelMyBooking,
  getTenantProperties,
} from "../../../api/tenantApi";
import BookingModal from "./BookingModal";


export default function MyBookings() {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  /* ---------------- LOAD BOOKINGS ---------------- */
  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      const list = Array.isArray(res.data.bookings) ? res.data.bookings : [];
      setBookings(list);

      // ✅ If no bookings → load properties
      if (list.length === 0) {
        loadApprovedProperties();
      }
    } catch (err) {
      console.error("Failed to load bookings", err);
      setBookings([]);
      loadApprovedProperties();
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOAD APPROVED PROPERTIES ---------------- */
  const loadApprovedProperties = async () => {
    try {
      const res = await getTenantProperties({
        approvalStatus: "approved",
        status: "available",
      });

      setProperties(
        Array.isArray(res.data.properties)
          ? res.data.properties
          : []
      );
    } catch (err) {
      console.error("Failed to load properties", err);
      setProperties([]);
    }
  };

  /* ---------------- CANCEL BOOKING ---------------- */
  const handleCancel = async (bookingId) => {
    const reason = prompt("Reason for cancellation?");
    if (!reason) return;

    try {
      setCancelingId(bookingId);
      await cancelMyBooking(bookingId, reason);
      alert("Booking cancelled successfully");
      loadBookings();
    } catch (err) {
      alert("Failed to cancel booking");
    } finally {
      setCancelingId(null);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>

      {/* ================= EMPTY STATE ================= */}
      {bookings.length === 0 ? (
        <>
          <p className="text-gray-500 text-lg">
            You haven’t booked any property yet
          </p>

          {/* -------- APPROVED PROPERTIES -------- */}
          {properties.length === 0 ? (
            <p className="text-gray-400 mt-6">
              No approved properties available right now
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {properties.map((p) => (
                <div
                  key={p._id}
                  className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {p.title}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    📍 {p.locationId?.city || "Location"}
                  </p>

                  <p className="mt-2 text-xl font-bold text-indigo-700">
                    ₹{p.price}
                  </p>

                  <div className="mt-2 flex gap-4 text-sm text-gray-600">
                    <span>🛏 {p.bedrooms}</span>
                    <span>🛁 {p.bathrooms}</span>
                    <span>📐 {p.area} sqft</span>
                  </div>

                  <button
                    onClick={() => setSelectedProperty(p)}
                    className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                  >
                    Book Now
                  </button>

                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* ================= BOOKINGS LIST ================= */
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {b.property?.title || "Property"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                📍 {b.property?.locationId?.city || "Location"}
              </p>

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>📅 From: {b.startDate?.slice(0, 10)}</p>
                <p>📅 To: {b.endDate?.slice(0, 10)}</p>
              </div>

              <p className="mt-3 text-lg font-bold text-purple-700">
                ₹{b.totalAmount}
              </p>

              <span
                className={`inline-block mt-3 rounded-full px-3 py-1 text-xs font-medium
                  ${b.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : b.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }
                `}
              >
                {b.status}
              </span>

              {(b.status === "pending" || b.status === "confirmed") && (
                <button
                  disabled={cancelingId === b._id}
                  onClick={() => handleCancel(b._id)}
                  className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                >
                  {cancelingId === b._id ? "Cancelling..." : "Cancel Booking"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {selectedProperty && (
        <BookingModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onSuccess={loadBookings}
        />
      )}

    </div>
  );
}
