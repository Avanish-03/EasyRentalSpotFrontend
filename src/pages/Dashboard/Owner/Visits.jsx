import React, { useEffect, useState } from "react";
import {
  getOwnerVisits,
  updateVisitStatus,
} from "../../../api/ownerApi";

const Visits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    try {
      setLoading(true);
      const res = await getOwnerVisits();
      setVisits(
        Array.isArray(res.data?.visits) ? res.data.visits : []
      );
    } catch (err) {
      console.error("Failed to load visits", err);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    if (!window.confirm(`Mark visit as ${status}?`)) return;

    try {
      setUpdatingId(id);
      await updateVisitStatus(id, status);
      loadVisits();
    } catch {
      alert("Failed to update visit");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading visits...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Property Visits
      </h1>

      {visits.length === 0 ? (
        <p className="text-gray-500">No visit requests</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visits.map((v) => (
            <div
              key={v._id}
              className="rounded-xl bg-white p-4 shadow"
            >
              <h2 className="font-semibold">
                {v.propertyId?.title || "Property"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                👤 {v.tenantId?.fullName || "Tenant"}
              </p>

              <p className="mt-2 text-sm">
                📅 {v.visitDate?.slice(0, 10)}
              </p>

              <StatusBadge status={v.status} />

              {v.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <button
                    disabled={updatingId === v._id}
                    onClick={() =>
                      handleStatus(v._id, "approved")
                    }
                    className="flex-1 rounded bg-green-600 px-3 py-2 text-sm text-white"
                  >
                    Approve
                  </button>

                  <button
                    disabled={updatingId === v._id}
                    onClick={() =>
                      handleStatus(v._id, "cancelled")
                    }
                    className="flex-1 rounded bg-red-600 px-3 py-2 text-sm text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Visits;

const StatusBadge = ({ status }) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};
