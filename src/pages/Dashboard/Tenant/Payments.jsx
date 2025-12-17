import React, { useEffect, useState, useMemo } from "react";
import { getMyBookings } from "../../../api/tenantApi";
import PaymentModal from "./PaymentModal";

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

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Payments
        </h1>

        {/* FILTER PILLS */}
        <div className="flex gap-2">
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
      </div>

      {/* ================= PAYMENTS GRID ================= */}
      {visibleData.length === 0 ? (
        <p className="text-gray-500">
          No payments found for selected filter
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleData.map((b) => {
            const isPaid = b.paymentStatus === "paid";

            return (
              <div
                key={b._id}
                className={`rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition ${
                  isPaid ? "border-green-200" : "border-yellow-200"
                }`}
              >
                {/* PROPERTY */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {b.propertyId?.title || "Property"}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  📍 {b.propertyId?.locationId?.city || "Location"}
                </p>

                {/* DATES */}
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>📅 From: {b.bookingStartDate?.slice(0, 10)}</p>
                  <p>📅 To: {b.bookingEndDate?.slice(0, 10)}</p>
                </div>

                {/* AMOUNT */}
                <p
                  className={`mt-4 text-xl font-bold ${
                    isPaid
                      ? "text-green-600"
                      : "text-indigo-700"
                  }`}
                >
                  ₹{b.totalAmount}
                </p>

                {/* STATUS */}
                {isPaid ? (
                  <span className="inline-block mt-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Payment Successful
                  </span>
                ) : (
                  <span className="inline-block mt-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                    Payment Pending
                  </span>
                )}

                {/* ACTION */}
                {!isPaid && (
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
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
            // 🔥 VERY IMPORTANT
            setSelectedBooking(null);
            loadBookings(); // re-fetch → backend updated data
          }}
        />
      )}
    </div>
  );
}

/* ================= UI ================= */

function FilterBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-gray-100 text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}
