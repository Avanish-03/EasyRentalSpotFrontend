import React, { useEffect, useMemo, useState } from "react";
import { getOwnerBookings } from "../../../api/ownerApi";

const Tenants = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

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
      if (t && !map[t._id]) {
        map[t._id] = {
          ...t,
          totalBookings: 1,
        };
      } else if (t) {
        map[t._id].totalBookings += 1;
      }
    });
    return Object.values(map);
  }, [bookings]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Tenants
      </h1>

      {tenants.length === 0 ? (
        <p className="text-gray-500">No tenants yet</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tenants.map((t) => (
            <div
              key={t._id}
              className="rounded-xl bg-white p-4 shadow"
            >
              <h2 className="font-semibold text-lg">
                {t.fullName}
              </h2>

              <p className="text-sm text-gray-500">
                📧 {t.email}
              </p>

              {t.phone && (
                <p className="text-sm text-gray-500">
                  📞 {t.phone}
                </p>
              )}

              <p className="mt-2 text-sm font-medium text-indigo-600">
                Total Bookings: {t.totalBookings}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tenants;
