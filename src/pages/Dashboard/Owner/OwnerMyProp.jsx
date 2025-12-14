import React, { useEffect, useState } from "react";
import { getOwnerProperties } from "../../../api/ownerApi";
import AddPropertyModal from "./AddPropertyModal";
import EditPropertyModal from "./EditPropertyModal";

export default function OwnerMyProp({ activeTab }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProperty, setEditProperty] = useState(null);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await getOwnerProperties();

      const list = Array.isArray(res.data?.properties)
        ? res.data.properties
        : [];

      setProperties(list);
    } catch (err) {
      console.error("Failed to load properties", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 FIRST LOAD
  useEffect(() => {
    loadProperties();
  }, []);

  // 🔥 AUTO REFRESH WHEN TAB BECOMES ACTIVE
  useEffect(() => {
    if (activeTab === "properties") {
      loadProperties();
    }
  }, [activeTab]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          My Properties
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          + Add Property
        </button>
      </div>

      {/* PROPERTY LIST */}
      {properties.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <div
              key={p._id}
              className="rounded-xl bg-white p-4 shadow"
            >
              <div className="mb-2 flex justify-between">
                <h2 className="font-semibold text-lg">
                  {p.title}
                </h2>

                <span
                  className={`rounded-full px-2 py-1 text-xs
                    ${
                      p.approvalStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : p.approvalStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {p.approvalStatus}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                📍 {p.locationId?.city || "Location not set"}
              </p>

              <p className="mt-2 text-xl font-bold text-purple-700">
                ₹{p.price}
              </p>

              <div className="mt-3 flex gap-4 text-sm text-gray-600">
                <span>🛏 {p.bedrooms}</span>
                <span>🛁 {p.bathrooms}</span>
                <span>📐 {p.area} sqft</span>
              </div>

              <button
                onClick={() => setEditProperty(p)}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                ✏️ Edit
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-20 text-center text-gray-500">
          No properties found
        </div>
      )}

      {/* MODALS */}
      {showModal && (
        <AddPropertyModal
          onClose={() => setShowModal(false)}
          onSuccess={loadProperties}
        />
      )}

      {editProperty && (
        <EditPropertyModal
          property={editProperty}
          onClose={() => setEditProperty(null)}
          onSuccess={loadProperties}
        />
      )}
    </div>
  );
}
