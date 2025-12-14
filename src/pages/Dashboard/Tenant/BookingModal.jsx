import React, { useState } from "react";
import {
  checkAvailability,
  createBooking,
} from "../../../api/tenantApi";

export default function BookingModal({ property, onClose, onSuccess }) {
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
  });

  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");

  /* ---------- DATE VALIDATION ---------- */
  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);

    if (!dates.startDate || !dates.endDate) {
      return "Please select both start and end dates";
    }

    if (start < today) {
      return "Start date cannot be in the past";
    }

    if (end <= start) {
      return "End date must be after start date";
    }

    return "";
  };

  /* ---------- CHECK AVAILABILITY ---------- */
  const handleCheckAvailability = async () => {
    const validationError = validateDates();
    if (validationError) {
      setError(validationError);
      setAvailable(null);
      return;
    }

    try {
      setError("");
      setChecking(true);

      const res = await checkAvailability({
        propertyId: property._id,
        bookingStartDate: dates.startDate,
        bookingEndDate: dates.endDate,
      });

      setAvailable(res.data.available);
    } catch (err) {
      alert(err.response?.data?.message || "Availability check failed");
    } finally {
      setChecking(false);
    }
  };


  /* ---------- CREATE BOOKING ---------- */
  const handleBooking = async () => {
    if (!dates.startDate || !dates.endDate) {
      return alert("Please select dates");
    }

    const days =
      (new Date(dates.endDate) - new Date(dates.startDate)) /
      (1000 * 60 * 60 * 24);

    if (days <= 0) {
      return alert("Invalid booking dates");
    }

    const totalAmount = Math.ceil(days) * property.price;

    try {
      setBooking(true);

      await createBooking({
        propertyId: property._id,
        bookingStartDate: dates.startDate,
        bookingEndDate: dates.endDate,
        totalAmount, // ✅ REQUIRED FIELD
      });

      alert("Booking successful 🎉");
      onSuccess(); // refresh bookings
      onClose();   // close modal
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-lg font-semibold">
            Book {property.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={dates.startDate}
            onChange={(e) =>
              setDates({ ...dates, startDate: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="date"
            min={dates.startDate || new Date().toISOString().split("T")[0]}
            value={dates.endDate}
            onChange={(e) =>
              setDates({ ...dates, endDate: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-600 font-medium">
              ⚠️ {error}
            </p>
          )}

          <button
            onClick={handleCheckAvailability}
            disabled={checking}
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {checking ? "Checking..." : "Check Availability"}
          </button>

          {available === true && (
            <p className="text-green-600 font-medium">Property Available</p>
          )}
          {dates.startDate && dates.endDate && (
            <p className="text-sm text-gray-600">
              Total Price:{" "}
              <span className="font-semibold text-indigo-600">
                ₹{Math.ceil(
                  (new Date(dates.endDate) - new Date(dates.startDate)) /
                  (1000 * 60 * 60 * 24)
                ) * property.price}
              </span>
            </p>
          )}


          {available === false && (
            <p className="text-red-600 font-medium">
              ❌ Property Not Available
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t px-5 py-4">
          <button
            onClick={onClose}
            className="rounded bg-gray-200 px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={!available || booking}
            onClick={handleBooking}
            className="rounded bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {booking ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      </div>
    </div>
  );
}
