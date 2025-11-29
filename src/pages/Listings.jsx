import React, { useState, useEffect } from "react";

const sampleListings = [
  { id: 1, title: "2BHK Flat in Surat", price: 12000 },
  { id: 2, title: "1BHK PG in Mumbai", price: 8000 },
  { id: 3, title: "3BHK Villa in Pune", price: 25000 },
];

export default function Listings({ searchQuery }) {
  const [listings, setListings] = useState(sampleListings);
  const [filtered, setFiltered] = useState(sampleListings);

  useEffect(() => {
    if (!searchQuery) {
      setFiltered(listings);
    } else {
      setFiltered(
        listings.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, listings]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Rentals</h1>
      {filtered.length === 0 ? (
        <p>No rentals found.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="border p-4 rounded-lg shadow hover:shadow-md"
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-gray-600">₹{item.price} / month</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
