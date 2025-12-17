import React, { useEffect, useState } from "react";
import {
  getTenantProperties,
  getTenantFilters,
  addToWishlist,
  removeFromWishlist,
} from "../../../api/tenantApi";

const DEFAULT_IMG =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800";

export default function TenantProperties() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [filtersData, setFiltersData] = useState({ cities: [], bedrooms: [] });

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
        Array.isArray(res.data.properties)
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

  /* ---------------- WISHLIST ---------------- */
  const toggleWishlist = async (property) => {
    try {
      if (property.isWishlisted) {
        await removeFromWishlist(property._id);
      } else {
        await addToWishlist({ propertyId: property._id });
      }
      loadProperties();
    } catch (err) {
      alert("Wishlist action failed");
    }
  };

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Browse Properties
        </h1>

        <input
          type="text"
          placeholder="Search by title or city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-lg border px-4 py-2 text-sm w-72"
        />
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-white p-4 rounded-xl shadow">

        <select
          className="border rounded px-3 py-2 text-sm"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        >
          <option value="">All Cities</option>
          {filtersData.cities?.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="border rounded px-3 py-2 text-sm"
          value={filters.bedrooms}
          onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
        >
          <option value="">Bedrooms</option>
          {filtersData.bedrooms?.map((b) => (
            <option key={b} value={b}>{b}+ BHK</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min ₹"
          className="border rounded px-3 py-2 text-sm"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />

        <input
          type="number"
          placeholder="Max ₹"
          className="border rounded px-3 py-2 text-sm"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />

        <select
          className="border rounded px-3 py-2 text-sm"
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="-createdAt">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
        </select>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : properties.length === 0 ? (
        <p className="text-gray-500 text-center py-20">
          No properties found
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
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
                  onClick={() => toggleWishlist(p)}
                  className="absolute top-3 right-3 text-xl"
                >
                  {p.isWishlisted ? "❤️" : "🤍"}
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

                <p className="text-lg font-bold text-indigo-700">
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
          ))}
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center gap-3 pt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded border disabled:opacity-40"
        >
          Prev
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded border"
        >
          Next
        </button>
      </div>

    </div>
  );
}
