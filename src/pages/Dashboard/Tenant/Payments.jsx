import React, { useEffect, useState } from "react";
import { getMyBookings } from "../../../api/tenantApi";
import PaymentModal from "./PaymentModal";

export default function Payments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(Array.isArray(res.data.bookings) ? res.data.bookings : []);
    } catch (err) {
      console.error("Failed to load bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTERS ---------------- */
  const pendingPayments = bookings.filter(
    (b) => b.status === "confirmed" && b.paymentStatus !== "paid"
  );

  const paymentHistory = bookings.filter(
    (b) => b.paymentStatus === "paid"
  );

  if (loading) {
    return <div className="p-6">Loading payments...</div>;
  }

  return (
    <div className="p-6 space-y-12">
      <h1 className="text-3xl font-bold text-gray-800">Payments</h1>

      {/* ================= PENDING PAYMENTS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-5 text-gray-700">
          Pending Payments
        </h2>

        {pendingPayments.length === 0 ? (
          <p className="text-gray-500">No pending payments 🎉</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingPayments.map((b) => (
              <div
                key={b._id}
                className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-lg transition"
              >
                {/* PROPERTY */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {b.property?.title || "Property"}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  📍 {b.property?.locationId?.city || "Location"}
                </p>

                {/* DATES */}
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>📅 From: {b.startDate?.slice(0, 10)}</p>
                  <p>📅 To: {b.endDate?.slice(0, 10)}</p>
                </div>

                {/* AMOUNT */}
                <p className="mt-4 text-xl font-bold text-indigo-700">
                  ₹{b.totalAmount}
                </p>

                {/* STATUS */}
                <span className="inline-block mt-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                  Payment Pending
                </span>

                {/* ACTION */}
                <button
                  onClick={() => setSelectedBooking(b)}
                  className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                >
                  Pay Now
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= PAYMENT HISTORY ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-5 text-gray-700">
          Payment History
        </h2>

        {paymentHistory.length === 0 ? (
          <p className="text-gray-500">No payments made yet</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paymentHistory.map((b) => (
              <div
                key={b._id}
                className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {b.property?.title || "Property"}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  📍 {b.property?.locationId?.city || "Location"}
                </p>

                <p className="mt-3 text-xl font-bold text-green-600">
                  ₹{b.totalAmount}
                </p>

                <span className="inline-block mt-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Payment Successful
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= PAYMENT MODAL ================= */}
      {selectedBooking && (
        <PaymentModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSuccess={loadBookings}
        />
      )}
    </div>
  );
}
