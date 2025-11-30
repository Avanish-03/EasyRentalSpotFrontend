import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    navigate("/listings");
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex flex-wrap items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold text-indigo-600 hover:text-indigo-700 transition">
          EasyRentalSpot
        </Link>

        {/* Search Box */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center mt-3 lg:mt-0 border border-gray-200 rounded-full overflow-hidden shadow-sm hover:shadow-md transition w-full max-w-md"
        >
          <input
            type="text"
            placeholder="Search rentals..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 w-full outline-none focus:ring-2 focus:ring-indigo-500 rounded-l-full"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-full hover:bg-indigo-700 transition"
          >
            Search
          </button>
        </form>

        {/* Menu Links */}
        <div className="hidden lg:flex items-center space-x-6 mt-3 lg:mt-0">
          <Link to="/listings" className="text-gray-700 hover:text-indigo-600 transition font-medium">
            Listings
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition font-medium">
            Contact
          </Link>
          <Link
            to="/login"
            className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 font-medium transition"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
