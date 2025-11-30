import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="relative w-full py-10 flex items-center justify-center bg-gray-100 overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://htmldemo.net/khonike/khonike/assets/images/property/property-9.jpg')",
        }}
      ></div>

      {/* Floating 404 Text */}
      <h1 className="absolute text-[180px] md:text-[220px] font-extrabold text-gray-200 tracking-widest select-none">
        404
      </h1>

      {/* Glassmorphic Card */}
      <div className="relative z-10 bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-10 text-center max-w-md border border-white/40">
        <h2 className="text-3xl font-bold text-gray-800">404 Not Found</h2>
        <p className="mt-3 text-gray-600">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back Home Button */}
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium text-lg hover:bg-indigo-700 transition shadow-md"
        >
          <FaHome size={18} />
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
