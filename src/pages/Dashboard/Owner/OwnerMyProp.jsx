import React, { useEffect, useMemo, useState } from "react";
import { getOwnerProperties } from "../../../api/ownerApi";
import AddPropertyModal from "./AddPropertyModal";
import EditPropertyModal from "./EditPropertyModal";
import UploadPropertyImages from "./UploadPropertyImages";
import PropertyImagesModal from "./PropertyImagesModal";

export default function OwnerMyProp({ activeTab }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewProperty, setViewProperty] = useState(null);

  // 🔥 MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [uploadPropertyId, setUploadPropertyId] = useState(null);

  // 🔎 FILTER STATES
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("none");

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

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    if (activeTab === "properties") {
      loadProperties();
    }
  }, [activeTab]);

  /* ---------- FILTERED LIST ---------- */
  const filteredProperties = useMemo(() => {
    let list = [...properties];

    if (search) {
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.locationId?.city?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== "all") {
      list = list.filter((p) => p.approvalStatus === status);
    }

    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    return list;
  }, [properties, search, status, sort]);

  /* ---------- COUNTS ---------- */
  const stats = {
    total: properties.length,
    approved: properties.filter((p) => p.approvalStatus === "approved").length,
    pending: properties.filter((p) => p.approvalStatus === "pending").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">My Properties</h1>

        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          + Add Property
        </button>
      </div>

      {/* QUICK STATS */}
      <div className="flex gap-4 text-sm">
        <Stat label="Total" value={stats.total} />
        <Stat label="Approved" value={stats.approved} color="green" />
        <Stat label="Pending" value={stats.pending} color="yellow" />
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="Search by title or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="none">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>

      {/* PROPERTY LIST */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((p) => (
            <div
              key={p._id}
              className="rounded-xl bg-white p-5 shadow hover:shadow-lg transition"
            >
              <div className="mb-2 flex justify-between items-center">
                <h2 className="font-semibold text-lg truncate">{p.title}</h2>
                <StatusBadge status={p.approvalStatus} />
              </div>

              <p className="text-sm text-gray-500">
                📍 {p.locationId?.city || "Location not set"}
              </p>

              <p className="mt-3 text-2xl font-bold text-purple-700">
                ₹{p.price}
              </p>

              <div className="mt-3 flex gap-4 text-sm text-gray-600">
                <span>🛏 {p.bedrooms}</span>
                <span>🛁 {p.bathrooms}</span>
                <span>📐 {p.area} sqft</span>
              </div>

              <div className="mt-4 flex gap-4 text-sm">
                <button
                  onClick={() => setEditProperty(p)}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => setUploadPropertyId(p._id)}
                  className="text-purple-600 hover:underline"
                >
                  📸 Upload Images
                </button>

                <button
                  onClick={() => {
                    if (p.images && p.images.length > 0) {
                      setViewProperty(p);   
                    }
                  }}
                  className="text-purple-600 hover:underline"
                >
                  📸 Images
                </button>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow">
          No properties match your filters
        </div>
      )}

      {/* ADD PROPERTY MODAL */}
      {showModal && (
        <AddPropertyModal
          onClose={() => setShowModal(false)}
          onSuccess={(createdProperty) => {
            loadProperties();
            setShowModal(false);
            setUploadPropertyId(createdProperty._id); // 🔥 open upload modal
          }}
        />
      )}

      {/* EDIT PROPERTY MODAL */}
      {editProperty && (
        <EditPropertyModal
          property={editProperty}
          onClose={() => setEditProperty(null)}
          onSuccess={loadProperties}
        />
      )}

      {/* 🔥 UPLOAD IMAGE MODAL */}
      {uploadPropertyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Upload Property Images
              </h2>
              <button onClick={() => setUploadPropertyId(null)}>✕</button>
            </div>

            <UploadPropertyImages
              propertyId={uploadPropertyId}
              onDone={() => {
                setUploadPropertyId(null);
                loadProperties();
              }}
            />
          </div>
        </div>
      )}

      {/* 👁️ VIEW PROPERTY IMAGES */}
      {viewProperty && (
        <PropertyImagesModal
          property={viewProperty}
          onClose={() => setViewProperty(null)}
        />
      )}

    </div>
  );
}

/* ---------- SMALL UI ---------- */

const Stat = ({ label, value, color = "gray" }) => {
  const colors = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`rounded-full px-4 py-1 text-xs font-medium ${colors[color]}`}
    >
      {label}: {value}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${map[status] || "bg-gray-100 text-gray-700"
        }`}
    >
      {status}
    </span>
  );
};
