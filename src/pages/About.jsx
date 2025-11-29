import React from 'react';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">About EasyRentalSpot</h1>
      <p className="mt-4 text-gray-700">EasyRentalSpot helps tenants and landlords connect quickly. This is a demo frontend — integrate with your backend APIs for full functionality.</p>

      <section className="mt-8">
        <h2 className="font-semibold text-xl">Our Mission</h2>
        <p className="mt-2 text-gray-600">To make renting transparent, fast and secure for everyone.</p>
      </section>
    </div>
  );
}