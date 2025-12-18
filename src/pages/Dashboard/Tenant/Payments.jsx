import React, { useEffect, useMemo, useState } from "react";
import { getMyBookings } from "../../../api/tenantApi";
import PaymentModal from "./PaymentModal";
import { MapPin, Calendar, IndianRupee, CreditCard } from "lucide-react";

export default function Payments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [filter, setFilter] = useState("all"); // all | pending | paid

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(
        Array.isArray(res.data.bookings) ? res.data.bookings : []
      );
    } catch (err) {
      console.error("Failed to load bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTERED DATA ================= */

  const pendingPayments = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.status === "confirmed" &&
          b.paymentStatus !== "paid"
      ),
    [bookings]
  );

  const paymentHistory = useMemo(
    () =>
      bookings.filter((b) => b.paymentStatus === "paid"),
    [bookings]
  );

  const visibleData =
    filter === "pending"
      ? pendingPayments
      : filter === "paid"
      ? paymentHistory
      : bookings;

  /* ================= STATS ================= */
  const stats = {
    total: bookings.length,
    pending: pendingPayments.length,
    paid: paymentHistory.length,
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-white/80">
          View and manage your booking payments
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Bookings" value={stats.total} />
        <StatCard title="Pending Payments" value={stats.pending} />
        <StatCard title="Paid Payments" value={stats.paid} />
      </div>

      {/* ================= FILTERS ================= */}
      <div className="flex flex-wrap gap-2">
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterBtn>
        <FilterBtn
          active={filter === "pending"}
          onClick={() => setFilter("pending")}
        >
          Pending
        </FilterBtn>
        <FilterBtn
          active={filter === "paid"}
          onClick={() => setFilter("paid")}
        >
          Paid
        </FilterBtn>
      </div>

      {/* ================= PAYMENTS GRID ================= */}
      {visibleData.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <CreditCard className="mx-auto mb-3 text-gray-400" size={32} />
          <p className="text-gray-500">
            No payments found for selected filter
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleData.map((b) => {
            const isPaid = b.paymentStatus === "paid";

            return (
              <div
                key={b._id}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                  isPaid ? "border-green-200" : "border-yellow-200"
                }`}
              >
                {/* PROPERTY */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {b.propertyId?.title || "Property"}
                </h3>

                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={14} />
                  {b.propertyId?.locationId?.city || "Location"}
                </p>

                {/* DATES */}
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

                {/* AMOUNT */}
                <p
                  className={`mt-4 flex items-center gap-1 text-xl font-bold ${
                    isPaid ? "text-green-600" : "text-indigo-700"
                  }`}
                >
                  <IndianRupee size={18} />
                  {b.totalAmount}
                </p>

                {/* STATUS */}
                {isPaid ? (
                  <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Payment Successful
                  </span>
                ) : (
                  <span className="mt-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                    Payment Pending
                  </span>
                )}

                {/* ACTION */}
                {!isPaid && (
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ================= PAYMENT MODAL ================= */}
      {selectedBooking && (
        <PaymentModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSuccess={() => {
            setSelectedBooking(null);
            loadBookings(); // re-fetch updated data
          }}
        />
      )}
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

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
