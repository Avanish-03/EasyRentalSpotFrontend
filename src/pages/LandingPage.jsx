import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/**
 * LandingPage.jsx
 * Single-file premium landing page using Tailwind CSS (no Bootstrap).
 *
 * Notes:
 * - Replace placeholder images (unsplash) with your assets.
 * - Hook search form to your API or client-side filter as needed.
 * - Testimonials slider is a small JS-driven carousel (no external deps).
 */

export default function LandingPage() {
  // --- demo data (replace with real data) ---
  const listings = [
    {
      id: 1,
      title: "Modern 2 BHK Apartment",
      location: "Sector 45, Gurgaon",
      price: "₹22,500 / month",
      beds: 2,
      baths: 2,
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
      badge: "Featured",
    },
    {
      id: 2,
      title: "Cozy Studio near Metro",
      location: "Koramangala, Bangalore",
      price: "₹15,000 / month",
      beds: 1,
      baths: 1,
      img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80",
      badge: "New",
    },
    {
      id: 3,
      title: "Luxury 3 BHK Penthouse",
      location: "Bandra West, Mumbai",
      price: "₹1,25,000 / month",
      beds: 3,
      baths: 3,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQod62dRwU1IEkSCEW5j9iP0gNyMv_MgEtNwg&s",
      badge: "Featured",
    },
    {
      id: 4,
      title: "Family Apartment with Balcony",
      location: "Salt Lake, Kolkata",
      price: "₹28,000 / month",
      beds: 2,
      baths: 2,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjnvoQwqaA2-AX4Ly_lf17in9WyzHuhnkPfg&s",
      badge: "",
    },
  ];


  //   {
  //     id: 1,
  //     name: "Asha R.",
  //     role: "Verified Renter",
  //     rating: 5,
  //     quote:
  //       "Found my flat within a week. Listings were accurate and the agent was prompt. Highly recommend!",
  //     avatar:
  //       "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  //   },
  //   {
  //     id: 2,
  //     name: "Rohit K.",
  //     role: "Home Buyer",
  //     rating: 5,
  //     quote:
  //       "Seamless experience from search to move-in. Transparent process and helpful team.",
  //     avatar:
  //       "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=80",
  //   },
  //   {
  //     id: 3,
  //     name: "Priya S.",
  //     role: "Landlord",
  //     rating: 4,
  //     quote:
  //       "Listing my property was simple and I got multiple inquiries within days.",
  //     avatar:
  //       "https://images.unsplash.com/photo-1545996124-1b0a2f7f50ab?w=200&q=80",
  //   },
  // ];

  // --- search state (demo only) ---
  const [query, setQuery] = useState({
    location: "",
    type: "rent",
    minPrice: "",
    maxPrice: "",
    beds: "",
  });

  const handleSearchChange = (e) =>
    setQuery((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Hook this to your search API or client-side filter
    alert(
      `Searching: location='${query.location}', type='${query.type}', beds='${query.beds}'`
    );
  };


  return (
    <main className="font-inter antialiased text-gray-800">
      {/* ========== HERO ========== */}
      <header
        className="relative bg-cover bg-center h-[70vh]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(17,24,39,0.45), rgba(17,24,39,0.45)), url('https://images.unsplash.com/photo-1501183638710-841dd1904471?w=2000&q=80')",
        }}
        aria-label="Hero banner with search"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-36 pb-20 text-center">
            <h1 className="text-white text-3xl text-transparent from-blue-500 leading-tight to-teal-300 sm:text-4xl md:text-9xl font-extrabold leading-tight">
              Find Your Dream Home in Your City
            </h1>
            <p className="mt-4 text-indigo-100 max-w-2xl mx-auto text-sm sm:text-base">
              Buy • Sell • Rent — Trusted local experts helping thousands find
              the right home.
            </p>

            <p className="mt-4 text-indigo-200 text-xs">
              Over <strong>5,200</strong> verified listings • <strong>Trusted</strong> agents
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== FEATURED LISTINGS (Casual View) ========== */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
            <Link
              to="/listings"
              className="text-indigo-600 hover:underline text-sm font-medium"
            >
              View all listings →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((l) => (
              <article
                key={l.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                {/* Listing Image */}
                <img
                  src={l.img}
                  alt={`${l.title} — ${l.location}`}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{l.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{l.location}</p>

                  <div className="mt-3 flex justify-between items-center">
                    <div>
                      <p className="text-indigo-600 font-bold">{l.price}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {l.beds} Beds • {l.baths} Baths
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>



        {/* ========== WHY CHOOSE US (Premium Upgrade) ========== */}
        <section className="mt-20 py-12 px-6 bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">


            {/* LEFT CONTENT */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1400"
                alt="Modern rental home"
                className="w-full rounded-xl shadow-xl object-cover"
              />

              {/* Premium gradient glow */}
              <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-indigo-300/20 blur-2xl rounded-full"></div>
            </div>

            {/* RIGHT IMAGE */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Why Choose EasyRentalSpot?</h2>
              <p className="mt-3 text-gray-600 max-w-lg">
                Renting a home shouldn’t be stressful. Our platform ensures transparency, security, and verified listings — helping you move in with confidence.
              </p>

              {/* ICON CARDS */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">

                {[
                  {
                    title: "Verified Properties",
                    desc: "All listings are verified for ownership and accuracy.",
                    icon: (
                      <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2"
                        viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                  },
                  {
                    title: "Zero Brokerage",
                    desc: "Direct deals with owners — save money on every rental.",
                    icon: (
                      <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2"
                        viewBox="0 0 24 24">
                        <path d="M12 8c-1.1 0-2 .9-2 2m2-2a2 2 0 110 4m-2 2h4m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                  },
                  {
                    title: "Safe & Secure",
                    desc: "Secure payments, verified tenants & protected documents.",
                    icon: (
                      <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2"
                        viewBox="0 0 24 24">
                        <path d="M12 11c-1.657 0-3-1.567-3-3.5S10.343 4 12 4s3 1.567 3 3.5S13.657 11 12 11z"
                          strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.5 20a6.5 6.5 0 0113 0v.5H5.5V20z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                  },
                  {
                    title: "24/7 Assistance",
                    desc: "We support both renters and owners at every step.",
                    icon: (
                      <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2"
                        viewBox="0 0 24 24">
                        <path d="M18.364 5.636a9 9 0 11-12.728 0" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ),
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-indigo-100">{item.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>



          </div>
        </section>


        {/* ========== HOW IT WORKS (Enhanced) ========== */}
        <section className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* LEFT: Steps */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
              <p className="mt-3 text-gray-500">
                Renting a home on EasyRentalSpot is simple, transparent, and fast.
                Follow these easy steps to get started.
              </p>

              <div className="mt-10 space-y-8">

                {[
                  {
                    step: "1",
                    title: "Search Properties",
                    desc: "Find homes using filters like location, budget, amenities, and more."
                  },
                  {
                    step: "2",
                    title: "Schedule a Visit",
                    desc: "Instantly contact owners or agents to book a site visit."
                  },
                  {
                    step: "3",
                    title: "Finalize the Deal",
                    desc: "Negotiate terms, sign the rental agreement, and pay securely."
                  },
                  {
                    step: "4",
                    title: "Move Into Your New Home",
                    desc: "Get your keys and enjoy a smooth move-in experience."
                  }
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                      {s.step}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">{s.title}</h3>
                      <p classname="mt-1 text-gray-500 text-sm">{s.desc}</p>
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* RIGHT: Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200"
                alt="How it works"
                className="rounded-2xl shadow-xl w-full object-cover"
              />

              {/* Gradient overlay effect (optional premium look) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-transparent rounded-2xl"></div>
            </div>

          </div>
        </section>


        {/* ========== CTA BANNER ========== */}
        <section className="mt-16 rounded-xl overflow-hidden">
          <div className="bg-indigo-600 text-white p-8 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">Ready to list or rent your property?</h3>
              <p className="mt-1 text-sm text-indigo-100">Create an account & reach thousands of potential renters and buyers.</p>
            </div>
            <div className="flex gap-3">
              <Link to="/register" className="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium">
                Create account
              </Link>
              <Link to="/contact" className="border border-white px-4 py-2 rounded-md text-white">
                Contact sales
              </Link>
            </div>
          </div>
        </section>


      </div>
    </main>
  );
}
