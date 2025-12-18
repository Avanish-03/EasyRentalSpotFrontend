import React, { useEffect, useMemo, useState } from "react";
import {
  getMyBookings,
  cancelMyBooking,
  getTenantProperties,
} from "../../../api/tenantApi";
import BookingModal from "./BookingModal";
import {
  Calendar,
  MapPin,
  IndianRupee,
  XCircle,
} from "lucide-react";

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

      if (list.length === 0) loadApprovedProperties();
    } catch (err) {
      console.error("Failed to load bookings", err);
      setBookings([]);
      loadApprovedProperties();
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOAD PROPERTIES ---------------- */
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

  /* ---------------- CANCEL ---------------- */
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

  /* ---------------- FILTER ---------------- */
  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    if (filter === "paid")
      return bookings.filter((b) => b.paymentStatus === "paid");
    if (filter === "unpaid")
      return bookings.filter((b) => b.paymentStatus !== "paid");

    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  /* ---------------- STATS ---------------- */
  const stats = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-sm text-white/80">
          Manage and track your property bookings
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="All" value={stats.all} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Confirmed" value={stats.confirmed} />
        <StatCard title="Cancelled" value={stats.cancelled} />
      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "cancelled", "paid", "unpaid"].map(
          (f) => (
            <FilterBtn
              key={f}
              active={filter === f}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </FilterBtn>
          )
        )}
      </div>

      {/* ================= BOOKINGS ================= */}
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
                className={`rounded-2xl border p-5 transition shadow-sm ${
                  isPast
                    ? "bg-gray-50 opacity-70"
                    : "bg-white hover:shadow-md"
                }`}
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {b.propertyId?.title}
                </h2>

                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={14} />
                  {b.propertyId?.locationId?.city}
                </p>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-1">
                    <Calendar size={14} /> From:{" "}
                    {b.bookingStartDate?.slice(0, 10)}
                  </p>
                  <p className="flex items-center gap-1">
                    <Calendar size={14} /> To:{" "}
                    {b.bookingEndDate?.slice(0, 10)}
                  </p>
                </div>

                <p className="mt-3 flex items-center gap-1 text-lg font-bold text-indigo-700">
                  <IndianRupee size={18} /> {b.totalAmount}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={b.status} />
                  <PaymentBadge status={b.paymentStatus} />
                  {isPast && (
                    <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium">
                      Expired
                    </span>
                  )}
                </div>

                {!isPast &&
                  (b.status === "pending" ||
                    b.status === "confirmed") && (
                    <button
                      disabled={cancelingId === b._id}
                      onClick={() => handleCancel(b._id)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      <XCircle size={16} />
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

      {/* ================= CTA ================= */}
      {bookings.length === 0 && properties.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <div
              key={p._id}
              className="rounded-xl border bg-white p-4 shadow"
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
                className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white"
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

/* ================= UI ================= */

const StatCard = ({ title, value }) => (
  <div className="rounded-xl bg-white p-4 shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-indigo-600">{value}</p>
  </div>
);

function FilterBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-indigo-600 text-white shadow"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
