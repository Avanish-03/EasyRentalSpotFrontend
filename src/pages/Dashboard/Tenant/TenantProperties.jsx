import React, { useEffect, useState } from "react";
import {
  getTenantProperties,
  getTenantFilters,
  addToWishlist,
  removeFromWishlist,
} from "../../../api/tenantApi";
import { Heart, MapPin, Bed, Bath, Ruler } from "lucide-react";

/* ================= CONFIG ================= */
const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800";

/* ================= COMPONENT ================= */
export default function TenantProperties() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [filtersData, setFiltersData] = useState({
    cities: [],
    bedrooms: [],
  });

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
    sort: "-createdAt",
  });

  const [page, setPage] = useState(1);

  /* ---------------- LOAD FILTER OPTIONS ---------------- */
  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const res = await getTenantFilters();
      setFiltersData(res.data || {});
    } catch (err) {
      console.error("Failed to load filters", err);
    }
  };

  /* ---------------- LOAD PROPERTIES ---------------- */
  useEffect(() => {
    loadProperties();
  }, [filters, query, page]);

  const loadProperties = async () => {
    try {
      setLoading(true);

      const res = await getTenantProperties({
        approvalStatus: "approved",
        status: "available",
        search: query,
        city: filters.city,
        bedrooms: filters.bedrooms,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: filters.sort,
        page,
        limit: 9,
      });

      setProperties(
        Array.isArray(res.data?.properties)
          ? res.data.properties
          : []
      );
    } catch (err) {
      console.error("Failed to load properties", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- WISHLIST (🔥 FIXED) ---------------- */
  const toggleWishlist = async (property) => {
    try {
      if (property.isWishlisted) {
        // ✅ backend expects BODY { propertyId }
        await removeFromWishlist({ propertyId: property._id });
      } else {
        await addToWishlist({ propertyId: property._id });
      }

      // reload list so isWishlisted updates
      loadProperties();
    } catch (err) {
      console.error("Wishlist error:", err);
      alert("Wishlist action failed");
    }
  };

  return (
    <div className="space-y-8 p-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
        <div>
          <h1 className="text-2xl font-bold">Browse Properties</h1>
          <p className="text-sm text-white/80">
            Find your next perfect home
          </p>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow">

        {/* SEARCH */}
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search by title or city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border pl-10 pr-4 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        {/* MIN PRICE */}
        <input
          type="number"
          placeholder="Min ₹"
          className="w-28 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters({ ...filters, minPrice: e.target.value })
          }
        />

        {/* MAX PRICE */}
        <input
          type="number"
          placeholder="Max ₹"
          className="w-28 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: e.target.value })
          }
        />

        {/* SORT */}
        <select
          className="ml-auto rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={filters.sort}
          onChange={(e) =>
            setFilters({ ...filters, sort: e.target.value })
          }
        >
          <option value="-createdAt">Newest</option>
          <option value="price">Price: Low → High</option>
          <option value="-price">Price: High → Low</option>
        </select>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : properties.length === 0 ? (
        <p className="text-center text-gray-500 py-20">
          No properties found
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <div
              key={p._id}
              className="rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow-lg transition"
            >
              {/* IMAGE */}
              <div className="relative h-44">
                <img
                  src={
                    p.images && p.images.length > 0
                      ? `${API_BASE}${p.images[0].imageUrl}`
                      : DEFAULT_IMG
                  }
                  alt={p.title}
                  className="h-full w-full object-cover"
                />

                <button
                  onClick={() => toggleWishlist(p)}
                  className="absolute top-3 right-3 rounded-full bg-white p-2 shadow"
                >
                  <Heart
                    size={18}
                    className={
                      p.isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }
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
                  {p.locationId?.city || "City"}
                </p>

                <p className="text-lg font-bold text-indigo-700">
                  ₹{p.price}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Bed size={14} /> {p.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath size={14} /> {p.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ruler size={14} /> {p.area} sqft
                  </span>
                </div>

                <button className="mt-3 w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center gap-3 pt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="rounded-lg border px-4 py-2 disabled:opacity-40"
        >
          Prev
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="rounded-lg border px-4 py-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}
