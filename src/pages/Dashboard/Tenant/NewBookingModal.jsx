import React, { useState, useEffect } from "react";

export default function NewBookingModal({ closeModal, addBooking }) {
  const [property, setProperty] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("");
  const [amount, setAmount] = useState("");

  // Temporary property data (Surat & Gujarat)
  const propertyOptions = [
    { id: 1, name: "Gurukul Residency, Surat", basePrice: 12000 },
    { id: 2, name: "Diamond Apartment, Surat", basePrice: 15000 },
    { id: 3, name: "City View Flats, Ahmedabad", basePrice: 18000 },
    { id: 4, name: "Riverfront Residency, Vadodara", basePrice: 13000 },
    { id: 5, name: "Shivalik Homes, Surat", basePrice: 14000 },
  ];

  // Update amount dynamically based on property & duration
  useEffect(() => {
    if (!property || !duration) {
      setAmount("");
      return;
    }
    const selectedProperty = propertyOptions.find((p) => p.name === property);
    if (!selectedProperty) return;

    let calculatedAmount = 0;
    if (duration === "day") calculatedAmount = selectedProperty.basePrice / 30; // approximate per day
    if (duration === "month") calculatedAmount = selectedProperty.basePrice;
    if (duration === "year") calculatedAmount = selectedProperty.basePrice * 12; // 12 months

    setAmount(`₹${calculatedAmount.toLocaleString()}`);
  }, [property, duration]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!property || !date || !duration) return;

    addBooking({
      id: Date.now(),
      property,
      date,
      duration,
      status: "Pending",
      amount,
    });

    // Reset form
    setProperty(""); 
    setDate(""); 
    setDuration(""); 
    setAmount("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <h2 className="text-2xl font-bold mb-4">New Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Property Dropdown */}
          <select
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Property</option>
            {propertyOptions.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} (₹{p.basePrice.toLocaleString()})
              </option>
            ))}
          </select>

          {/* Date */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Duration Dropdown */}
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Duration</option>
            <option value="day">1 Day</option>
            <option value="month">1 Month</option>
            <option value="year">1 Year</option>
          </select>

          {/* Amount (Read Only) */}
          {amount && (
            <p className="text-gray-700 font-semibold">Payment: {amount}</p>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
