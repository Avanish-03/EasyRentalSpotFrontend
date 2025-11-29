import React from "react";

export default function SavedListings({ savedListings, setSavedListings }) {
  const handleRemove = (id) => {
    setSavedListings(savedListings.filter(s => s.id !== id));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Saved Listings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedListings.map(s => (
          <div key={s.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
              <p className="text-gray-600 mb-2">{s.location}</p>
              <p className="text-purple-600 font-bold mb-4">{s.price}</p>
              <div className="flex justify-between">
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">View</button>
                <button onClick={() => handleRemove(s.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
