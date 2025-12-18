import React, { useEffect, useState } from "react";
import {
  getTenantWishlist,
  removeFromWishlist,
} from "../../../api/tenantApi";
import PropertyDetailsModal from "./PropertyDetailsModal";
import { Heart, MapPin } from "lucide-react";

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await getTenantWishlist();
      setWishlist(res.data?.wishlist || []);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (propertyId) => {
    await removeFromWishlist({ propertyId });
    loadWishlist();
    setSelected(null);
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <p className="text-sm text-white/80">
          Your favorite properties in one place
        </p>
      </div>

      {/* EMPTY */}
      {wishlist.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <Heart size={36} className="mx-auto mb-3 text-pink-400" />
          <p className="text-gray-600 font-medium">
            Your wishlist is empty
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((w) => {
            const p = w.propertyId;

            const imageUrl =
              p.images && p.images.length > 0
                ? `${API_BASE}/uploads/properties/${p.images[0]}`
                : DEFAULT_IMG;

            return (
              <div
                key={w._id}
                className="rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                {/* IMAGE */}
                <div className="relative h-44">
                  <img
                    src={imageUrl}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />

                  <button
                    onClick={() => handleRemove(p._id)}
                    className="absolute top-3 right-3 rounded-full bg-white p-2 shadow"
                    title="Remove from wishlist"
                  >
                    <Heart
                      size={18}
                      className="fill-pink-500 text-pink-500"
                    />
                  </button>
                </div>

                {/* BODY */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-gray-800">
                    {p.title}
                  </h3>

                  <p className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={14} />
                    {p.city || "Surat"}
                  </p>

                  <p className="text-lg font-bold text-indigo-700">
                    ₹{p.price}
                  </p>

                  <button
                    onClick={() => setSelected(p)}
                    className="mt-3 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {selected && (
        <PropertyDetailsModal
          property={selected}
          onClose={() => setSelected(null)}
          onRemoveWishlist={handleRemove}
        />
      )}
    </div>
  );
}
