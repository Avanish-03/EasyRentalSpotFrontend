import React, { useEffect, useMemo, useState } from "react";
import { getOwnerBookings } from "../../../api/ownerApi";
import { Users, Mail, Phone, Search } from "lucide-react";

const Tenants = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const res = await getOwnerBookings();
      setBookings(
        Array.isArray(res.data?.bookings)
          ? res.data.bookings
          : []
      );
    } catch (err) {
      console.error("Failed to load tenants", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UNIQUE TENANTS ---------- */
  const tenants = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      const t = b.tenantId;
      if (!t) return;

      if (!map[t._id]) {
        map[t._id] = {
          ...t,
          totalBookings: 1,
        };
      } else {
        map[t._id].totalBookings += 1;
      }
    });
    return Object.values(map);
  }, [bookings]);

  /* ---------- SEARCH FILTER ---------- */
  const filteredTenants = useMemo(() => {
    return tenants.filter((t) =>
      `${t.fullName} ${t.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [tenants, search]);

  /* ---------- METRICS ---------- */
  const totalBookings = tenants.reduce(
    (sum, t) => sum + t.totalBookings,
    0
  );

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-3">
            <Users />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Tenants</h1>
            <p className="text-sm text-white/80">
              All tenants who booked your properties
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Metric title="Total Tenants" value={tenants.length} />
        <Metric title="Total Bookings" value={totalBookings} />
      </div>

      {/* SEARCH */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search tenant by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* TENANT LIST */}
      {filteredTenants.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <Users className="mx-auto mb-3 text-gray-400" size={32} />
          <p className="text-gray-500">No tenants found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTenants.map((t) => (
            <div
              key={t._id}
              className="rounded-2xl bg-white p-5 shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {t.fullName}
              </h2>

              <div className="mt-2 space-y-1 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <Mail size={14} /> {t.email}
                </p>

                {t.phone && (
                  <p className="flex items-center gap-2">
                    <Phone size={14} /> {t.phone}
                  </p>
                )}
              </div>

              <div className="mt-4 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600">
                Total Bookings: {t.totalBookings}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tenants;

/* ---------- UI COMPONENT ---------- */
const Metric = ({ title, value }) => (
  <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white shadow">
    <p className="text-sm opacity-90">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);
