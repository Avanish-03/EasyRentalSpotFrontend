import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Find your next rental — fast & easy</h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Search and list houses, flats, and rooms. Trusted by renters and landlords across the city.</p>

          <div className="mt-8 flex justify-center gap-4">
            <Link to="/register" className="px-6 py-3 bg-indigo-600 text-white rounded shadow">Get Started</Link>
            <Link to="/about" className="px-6 py-3 border border-gray-300 rounded">Learn more</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center">Why EasyRentalSpot?</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg">Verified Listings</h3>
              <p className="mt-2 text-gray-600">We verify each listing so you can rent with confidence.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg">Fast Messaging</h3>
              <p className="mt-2 text-gray-600">Contact owners instantly through in-app messaging.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg">Secure Payments</h3>
              <p className="mt-2 text-gray-600">Safe and reliable payment options for rent and deposits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold">Ready to list or rent?</h3>
          <div className="mt-4 flex justify-center gap-4">
            <Link to="/register" className="px-5 py-3 bg-white text-indigo-600 rounded">Create account</Link>
            <Link to="/login" className="px-5 py-3 border border-white rounded">Login</Link>
          </div>
        </div>
      </section>
    </div>
  );
}