import React, { useEffect, useState } from "react";
import { getMyVisits, cancelVisit } from "../../../api/tenantApi";

export default function MyVisits() {
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadVisits();
  }, [filter]);

  /* ---------------- LOAD VISITS ---------------- */
  const loadVisits = async () => {
    try {
      setLoading(true);
      const res = await getMyVisits();

      let list = Array.isArray(res.data.visits)
        ? res.data.visits
        : [];

      if (filter) {
        list = list.filter((v) => v.status === filter);
      }

      setVisits(list);
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
    } catch (err) {
      alert("Failed to cancel visit");
    }
  };

  /* ---------------- HELPERS ---------------- */
  const isPast = (date) => new Date(date) < new Date();

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          My Visits
        </h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* ================= EMPTY ================= */}
      {visits.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow">
          <p className="text-gray-500 text-lg">
            No visits found
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Schedule a visit to inspect properties
          </p>
        </div>
      ) : (
        /* ================= LIST ================= */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visits.map((v) => {
            const past = isPast(v.visitDate);

            return (
              <div
                key={v._id}
                className={`rounded-xl border bg-white p-5 shadow-sm transition
                  ${past ? "opacity-60" : "hover:shadow-md"}
                `}
              >
                {/* PROPERTY */}
                <h3 className="font-semibold text-gray-800">
                  {v.propertyId?.title || "Property"}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  📍 {v.propertyId?.locationId?.city || "City"}
                </p>

                {/* DATE / TIME */}
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>📅 Date: {v.visitDate?.slice(0, 10)}</p>
                  <p>⏰ Time: {v.timeSlot || "N/A"}</p>
                </div>

                {/* STATUS */}
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={v.status} />

                  {past && (
                    <span className="text-xs text-red-500 font-medium">
                      Expired
                    </span>
                  )}
                </div>

                {/* ACTION */}
                {!past && v.status === "scheduled" && (
                  <button
                    onClick={() => handleCancel(v._id)}
                    className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                  >
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

/* ---------------- STATUS BADGE ---------------- */
function StatusBadge({ status }) {
  const colors = {
    scheduled: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium
        ${colors[status] || "bg-gray-100 text-gray-600"}
      `}
    >
      {status}
    </span>
  );
}
