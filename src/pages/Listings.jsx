import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBed, FaBath, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

const sampleListings = [
  {
    id: 1,
    title: "Modern 2BHK Flat in Surat",
    price: 12000,
    location: "Adajan, Surat",
    beds: 2,
    baths: 2,
    img: "https://htmldemo.net/khonike/khonike/assets/images/property/property-1.jpg",
    badge: "Popular",
  },
  {
    id: 2,
    title: "Affordable 1BHK PG in Mumbai",
    price: 8000,
    location: "Andheri West, Mumbai",
    beds: 1,
    baths: 1,
    img: "https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=800",
    badge: "Trending",
  },
  {
    id: 3,
    title: "Luxury 3BHK Villa in Pune",
    price: 25000,
    location: "Koregaon Park, Pune",
    beds: 3,
    baths: 3,
    img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=800",
    badge: "Premium",
  },
  {
    id: 4,
    title: "Luxury 3BHK Villa in Pune",
    price: 25000,
    location: "Koregaon Park, Pune",
    beds: 3,
    baths: 3,
    img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=800",
    badge: "Premium",
  },
  {
    id: 5,
    title: "Luxury 3BHK Villa in Pune",
    price: 25000,
    location: "Koregaon Park, Pune",
    beds: 3,
    baths: 3,
    img: "https://htmldemo.net/khonike/khonike/assets/images/property/property-5.jpg",
    badge: "Trending",
  },
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
    <div className="px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Properties</h1>

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-lg">No rentals found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-56 object-cover group-hover:scale-110 duration-500"
                />

                {/* Badge */}
                {item.badge && (
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    {item.badge}
                  </span>
                )}

                {/* Favorite Icon */}
                <span className="absolute top-3 right-3 bg-white rounded-full p-2 shadow text-gray-600 hover:text-red-500 cursor-pointer">
                  <FaHeart size={16} />
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                  {item.title}
                </h2>

                {/* Location */}
                <p className="flex items-center text-gray-500 text-sm mt-2">
                  <FaMapMarkerAlt className="mr-1 text-indigo-600" /> {item.location}
                </p>

                {/* Price */}
                <div className="mt-4">
                  <p className="text-2xl font-bold text-indigo-600">
                    ₹{item.price}
                    <span className="text-gray-600 text-sm font-normal"> / month</span>
                  </p>
                </div>

                {/* Property Details */}
                <div className="flex items-center gap-6 mt-5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaBed className="text-indigo-600" /> {item.beds} Beds
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBath className="text-indigo-600" /> {item.baths} Bath
                  </div>
                </div>

                {/* Bottom Button */}
                <div className="mt-6">
                  <Link
                    to={`/listings/${item.id}`}
                    className="block text-center w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
