import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query); 
    }
    navigate("/listings");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        EasyRentalSpot
      </Link>

      {/* Search Box */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center border rounded-lg overflow-hidden"
      >
        <input
          type="text"
          placeholder="Search rentals..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 outline-none w-64"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Menu Links */}
      <div className="space-x-6">
        <Link to="/listings" className="hover:text-blue-600">
          Listings
        </Link>
        <Link to="/about" className="hover:text-blue-600">
          About
        </Link>
        <Link to="/contact" className="hover:text-blue-600">
          Contact
        </Link>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
