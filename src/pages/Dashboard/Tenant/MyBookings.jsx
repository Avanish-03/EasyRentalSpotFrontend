import React, { useEffect, useMemo, useState } from "react";
import {
  getMyBookings,
  cancelMyBooking,
  getTenantProperties,
} from "../../../api/tenantApi";
import BookingModal from "./BookingModal";

export default function MyBookings() {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadBookings();
  }, []);

  /* ---------------- LOAD BOOKINGS ---------------- */
  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      const list = Array.isArray(res.data.bookings)
        ? res.data.bookings
        : [];
      setBookings(list);

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
    } catch {
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
      alert("Booking cancelled");
      loadBookings();
    } catch {
      alert("Failed to cancel booking");
    } finally {
      setCancelingId(null);
    }
  };

  /* ---------------- FILTERED DATA ---------------- */
  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;

    if (filter === "paid") {
      return bookings.filter((b) => b.paymentStatus === "paid");
    }

    if (filter === "unpaid") {
      return bookings.filter((b) => b.paymentStatus !== "paid");
    }

    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

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

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          My Bookings
        </h1>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-2">
          <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>All</FilterBtn>
          <FilterBtn active={filter === "pending"} onClick={() => setFilter("pending")}>Pending</FilterBtn>
          <FilterBtn active={filter === "confirmed"} onClick={() => setFilter("confirmed")}>Confirmed</FilterBtn>
          <FilterBtn active={filter === "cancelled"} onClick={() => setFilter("cancelled")}>Cancelled</FilterBtn>
          <FilterBtn active={filter === "paid"} onClick={() => setFilter("paid")}>Paid</FilterBtn>
          <FilterBtn active={filter === "unpaid"} onClick={() => setFilter("unpaid")}>Unpaid</FilterBtn>
        </div>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {filteredBookings.length === 0 ? (
        <p className="text-gray-500 text-lg">
          No bookings found for selected filter
        </p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookings.map((b) => {
            const isPast =
              new Date(b.bookingEndDate) < new Date();

            return (
              <div
                key={b._id}
                className={`rounded-xl border p-5 shadow-sm transition
                  ${isPast
                    ? "bg-gray-50 opacity-70"
                    : "bg-white hover:shadow-md"}
                `}
              >
                {/* PROPERTY */}
                <h2 className="text-lg font-semibold text-gray-800">
                  {b.propertyId?.title || "Property"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  📍 {b.propertyId?.locationId?.city || "Location"}
                </p>

                {/* DATES */}
                <div
                  className={`mt-3 text-sm space-y-1 ${
                    isPast ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <p>📅 From: {b.bookingStartDate?.slice(0, 10)}</p>
                  <p>📅 To: {b.bookingEndDate?.slice(0, 10)}</p>
                </div>

                {/* AMOUNT */}
                <p className="mt-3 text-lg font-bold text-purple-700">
                  ₹{b.totalAmount}
                </p>

                {/* BADGES */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={b.status} />
                  <PaymentBadge status={b.paymentStatus} />
                  {isPast && (
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-600">
                      Expired
                    </span>
                  )}
                </div>

                {/* ACTION */}
                {!isPast &&
                  (b.status === "pending" ||
                    b.status === "confirmed") && (
                    <button
                      disabled={cancelingId === b._id}
                      onClick={() => handleCancel(b._id)}
                      className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {cancelingId === b._id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================= BOOK PROPERTY CTA ================= */}
      {bookings.length === 0 && properties.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <div
              key={p._id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-500">
                📍 {p.locationId?.city}
              </p>
              <p className="mt-2 font-bold text-indigo-700">
                ₹{p.price}
              </p>
              <button
                onClick={() => setSelectedProperty(p)}
                className="mt-3 w-full rounded bg-indigo-600 px-4 py-2 text-white"
              >
                Book Now
              </button>
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

/* ================= UI COMPONENTS ================= */

function FilterBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        status === "paid"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {status === "paid" ? "Paid" : "Unpaid"}
    </span>
  );
}
