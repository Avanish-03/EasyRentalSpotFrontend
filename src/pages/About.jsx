import React from "react";
import logo from '../assets/logo.png';

export default function About() {
  return (
    <div className="w-full bg-gray-50">
      {/* HERO SECTION */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200')] bg-cover bg-center h-64 flex items-center">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-6">
          <h1 className="text-white text-4xl font-bold">About EasyRentalSpot</h1>
          <p className="text-gray-200 mt-2 text-lg">
            Your trusted platform for seamless rental experiences.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="container mx-auto px-6 lg:px-16 py-16 grid lg:grid-cols-2 gap-12 items-center">

        {/* TEXT CONTENT */}
        <div className="space-y-6">
          <h2 className="text-4xl font-extrabold leading-snug">
            Who <span className="text-blue-600">We Are</span>
          </h2>

          <p className="text-gray-600 leading-relaxed text-lg">
            At <span className="font-semibold text-gray-900">EasyRentalSpot</span>, we blend
            modern design, secure technology, and user-centric experience to transform the
            rental process. Whether you're looking for a home or listing your property,
            our platform makes every step simple, fast, and transparent.
          </p>

          <p className="text-gray-600 leading-relaxed text-lg">
            With advanced search tools, clean UI, and seamless communication features,
            we help thousands find the right home — without confusion, delays, or stress.
          </p>

          {/* HIGHLIGHT BOX */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-md shadow-sm">
            <p className="text-gray-700 text-base">
              “A smarter, faster, more transparent way to rent — built for the modern world.”
            </p>
          </div>
        </div>

        {/* IMAGE WITH EFFECTS */}
        <div className="relative">
          <div className="absolute -top-5 -left-5 w-40 h-40 bg-blue-200 opacity-30 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-5 -right-5 w-40 h-40 bg-blue-300 opacity-20 rounded-full blur-2xl"></div>

          <img
            src={logo}
            alt="About EasyRentalSpot"
            className="rounded-2xl border border-gray-200 transform hover:scale-105 transition duration-500"
          />
        </div>
      </section>


      {/* MISSION */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 px-10">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
            Our Mission
          </h2>
          <p className="max-w-3xl mx-auto text-center text-gray-600 leading-relaxed text-lg">
            We aim to make renting transparent, fast, and secure for everyone.
            Tenants find their dream homes, landlords find reliable tenants — all
            through a smooth, stress-free experience.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-500 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast & Easy</h3>
              <p className="text-gray-600">Find listings quickly with powerful search tools.</p>
            </div>

            {/* Card 2 */}
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-500 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 11c0-1.105-.895-2-2-2s-2 .895-2 2 .895 2 2 2 2-.895 2-2zM12 5v2m0 10v2m4-4h2M6 12H4m15.364 2.364l1.414 1.414M4.222 4.222l1.414 1.414m12.728 0l-1.414 1.414M4.222 19.778l1.414-1.414"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Built with modern authentication & safe data handling.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition duration-500 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-full mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-3-3v6m9 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Trusted Experience</h3>
              <p className="text-gray-600">
                Designed to build trust between landlords and tenants.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
