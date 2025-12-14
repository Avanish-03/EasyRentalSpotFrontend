import React, { useEffect, useState } from "react";
import { getOwnerBookings } from "../../../api/ownerApi";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await getOwnerBookings();

      // ✅ SAFETY CHECK
      setBookings(Array.isArray(res.data?.bookings) ? res.data.bookings : []);
    } catch (err) {
      console.error("Failed to load bookings", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading bookings...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Bookings</h1>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >
              <p className="font-semibold">
                Property: {b.propertyId?.title || "N/A"}
              </p>

              <p className="text-sm text-gray-600">
                Guest: {b.userId?.name || "N/A"}
              </p>

              <p className="text-sm">
                Amount: ₹{b.amount}
              </p>

              <span
                className={`inline-block mt-2 rounded px-2 py-1 text-xs
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
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No bookings found</p>
      )}
    </div>
  );
};

export default Bookings;
