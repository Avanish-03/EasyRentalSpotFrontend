import React, { useEffect, useState } from "react";
import {
  getAllPropertiesAdmin,
  approveProperty,
  rejectProperty,
} from "../../../api/adminApi";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 🔥 all | pending | approved | rejected

  useEffect(() => {
    loadProperties();
  }, [filter]);

  const loadProperties = async () => {
    try {
      setLoading(true);

      // ✅ send approvalStatus instead of status
      const params =
        filter === "all" ? {} : { approvalStatus: filter };

      const res = await getAllPropertiesAdmin(params);

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

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this property?")) return;
    await approveProperty(id);
    loadProperties();
  };

  const handleReject = async (id) => {
    const reason = prompt("Reason for rejection?");
    if (!reason) return;
    await rejectProperty(id, reason);
    loadProperties();
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          Property Management
        </h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="all">All Properties</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : properties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Approval</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {properties.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3 font-medium">{p.title}</td>

                  <td className="p-3">
                    {p.ownerId?.fullName || "Owner"}
                    <br />
                    <span className="text-xs text-gray-500">
                      {p.ownerId?.email}
                    </span>
                  </td>

                  <td className="p-3">
                    {p.locationId?.city || "N/A"}
                  </td>

                  <td className="p-3 font-semibold">
                    ₹{p.price}
                  </td>

                  <td className="p-3">
                    <StatusBadge status={p.approvalStatus} />
                  </td>

                  <td className="p-3 text-center space-x-2">
                    {p.approvalStatus === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(p._id)}
                          className="rounded bg-green-600 px-3 py-1 text-xs text-white"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(p._id)}
                          className="rounded bg-red-600 px-3 py-1 text-xs text-white"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------------- STATUS BADGE ---------------- */

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
