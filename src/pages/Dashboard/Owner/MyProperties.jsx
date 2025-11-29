import React from "react";

export default function MyProperties({ properties }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p className="text-gray-600">{p.location}</p>
            <p className="text-purple-600 font-bold mt-2">₹{p.rent} / month</p>
          </div>
        ))}
      </div>
    </div>
  );
}
