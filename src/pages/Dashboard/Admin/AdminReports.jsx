import React, { useEffect, useState } from "react";
import {
  getAllReports,
  updateReportStatus,
  deleteReportAdmin,
} from "../../../api/adminApi";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [filter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await getAllReports(filter ? { status: filter } : {});
      setReports(res.data.reports || []);
    } catch (err) {
      console.error("Load reports failed", err);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    await updateReportStatus(id, status);
    loadReports();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    await deleteReportAdmin(id);
    loadReports();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports</h1>
        <select
          className="border px-3 py-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Reporter</th>
                <th className="p-3">Target</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r._id} className="border-t">
                  <td className="p-3">{r.type}</td>
                  <td className="p-3">{r.reportedBy?.email}</td>
                  <td className="p-3">
                    {r.propertyId?.title || r.targetUser?.email}
                  </td>
                  <td className="p-3 capitalize">{r.status}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => changeStatus(r._id, "resolved")}
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => remove(r._id)}
                      className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
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
