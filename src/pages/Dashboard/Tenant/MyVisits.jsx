import React, { useEffect, useMemo, useState } from "react";
import { getMyVisits, cancelVisit } from "../../../api/tenantApi";
import {
  MapPin,
  Calendar,
  Clock,
  XCircle,
} from "lucide-react";

export default function MyVisits() {
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadVisits();
  }, []);

  /* ---------------- LOAD VISITS ---------------- */
  const loadVisits = async () => {
    try {
      setLoading(true);
      const res = await getMyVisits();
      setVisits(
        Array.isArray(res.data.visits)
          ? res.data.visits
          : []
      );
    } catch (err) {
      console.error("Failed to load visits", err);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CANCEL ---------------- */
  const handleCancel = async (id) => {
    const reason = prompt("Reason for cancelling visit?");
    if (!reason) return;

    try {
      await cancelVisit(id, reason);
      loadVisits();
    } catch {
      alert("Failed to cancel visit");
    }
  };

  /* ---------------- HELPERS ---------------- */
  const isPast = (date) => new Date(date) < new Date();

  /* ---------------- FILTERED DATA ---------------- */
  const filteredVisits = useMemo(() => {
    if (filter === "all") return visits;
    return visits.filter((v) => v.status === filter);
  }, [visits, filter]);

  /* ---------------- STATS ---------------- */
  const stats = {
    all: visits.length,
    scheduled: visits.filter((v) => v.status === "scheduled").length,
    completed: visits.filter((v) => v.status === "completed").length,
    cancelled: visits.filter((v) => v.status === "cancelled").length,
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
        <h1 className="text-2xl font-bold">My Visits</h1>
        <p className="text-sm text-white/80">
          Track and manage your property visits
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="All" value={stats.all} />
        <StatCard title="Scheduled" value={stats.scheduled} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Cancelled" value={stats.cancelled} />
      </div>

      {/* ================= FILTER PILLS ================= */}
      <div className="flex flex-wrap gap-2">
        {["all", "scheduled", "completed", "cancelled"].map((f) => (
          <FilterBtn
            key={f}
            active={filter === f}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </FilterBtn>
        ))}
      </div>

      {/* ================= EMPTY ================= */}
      {filteredVisits.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <p className="text-gray-500 text-lg">
            No visits found
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Schedule a visit to inspect properties
          </p>
        </div>
      ) : (
        /* ================= VISITS GRID ================= */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVisits.map((v) => {
            const past = isPast(v.visitDate);

            return (
              <div
                key={v._id}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                  past
                    ? "opacity-60"
                    : "hover:shadow-md"
                }`}
              >
                {/* PROPERTY */}
                <h3 className="text-lg font-semibold text-gray-800">
                  {v.propertyId?.title || "Property"}
                </h3>

                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={14} />
                  {v.propertyId?.locationId?.city || "City"}
                </p>

                {/* DATE / TIME */}
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-1">
                    <Calendar size={14} />
                    {v.visitDate?.slice(0, 10)}
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock size={14} />
                    {v.timeSlot || "N/A"}
                  </p>
                </div>

                {/* STATUS */}
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={v.status} />
                  {past && (
                    <span className="text-xs font-medium text-red-500">
                      Expired
                    </span>
                  )}
                </div>

                {/* ACTION */}
                {!past && v.status === "scheduled" && (
                  <button
                    onClick={() => handleCancel(v._id)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
                    <XCircle size={16} />
                    Cancel Visit
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

const StatCard = ({ title, value }) => (
  <div className="rounded-xl bg-white p-4 shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-indigo-600">{value}</p>
  </div>
);

const FilterBtn = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
      active
        ? "bg-indigo-600 text-white shadow"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

function StatusBadge({ status }) {
  const colors = {
    scheduled: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
