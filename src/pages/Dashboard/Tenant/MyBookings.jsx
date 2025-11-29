import React from "react";

export default function MyBookings({ bookings, setBookings }) {
  const handleCancel = (id) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">Property</th>
              <th className="py-3 px-6 text-left">Booking Date</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-6">{b.property}</td>
                <td className="py-3 px-6">{b.date}</td>
                <td className={`py-3 px-6 font-semibold ${
                  b.status === "Confirmed" ? "text-green-600" : "text-yellow-500"
                }`}>{b.status}</td>
                <td className="py-3 px-6">{b.amount}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
