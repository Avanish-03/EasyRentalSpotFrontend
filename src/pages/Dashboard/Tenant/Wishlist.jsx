import React, { useEffect, useState } from "react";
import {
  getTenantWishlist,
  removeFromWishlist,
} from "../../../api/tenantApi";

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800";

export default function Wishlist() {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  /* ---------------- LOAD WISHLIST ---------------- */
  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await getTenantWishlist();

      setWishlist(
        Array.isArray(res.data.wishlist)
          ? res.data.wishlist
          : []
      );
    } catch (err) {
      console.error("Failed to load wishlist", err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- REMOVE ---------------- */
  const handleRemove = async (propertyId) => {
    if (!window.confirm("Remove from wishlist?")) return;

    try {
      await removeFromWishlist(propertyId);
      loadWishlist();
    } catch (err) {
      alert("Failed to remove from wishlist");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <h1 className="text-2xl font-bold text-gray-800">
        My Wishlist
      </h1>

      {/* ================= EMPTY ================= */}
      {wishlist.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <p className="text-gray-500 text-lg">
            ❤️ Your wishlist is empty
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Browse properties and save your favorites
          </p>
        </div>
      ) : (
        /* ================= GRID ================= */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => {
            const p = item.propertyId || item; // API safe

            return (
              <div
                key={p._id}
                className="rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                {/* IMAGE */}
                <div className="relative h-44">
                  <img
                    src={p.images?.[0] || DEFAULT_IMG}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />

                  <button
                    onClick={() => handleRemove(p._id)}
                    className="absolute top-3 right-3 text-xl"
                    title="Remove from wishlist"
                  >
                    ❤️
                  </button>
                </div>

                {/* BODY */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-gray-800">
                    {p.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    📍 {p.locationId?.city || "City"}
                  </p>

                  <p className="text-lg font-bold text-pink-600">
                    ₹{p.price}
                  </p>

                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>🛏 {p.bedrooms}</span>
                    <span>🛁 {p.bathrooms}</span>
                    <span>📐 {p.area} sqft</span>
                  </div>

                  <button
                    className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
