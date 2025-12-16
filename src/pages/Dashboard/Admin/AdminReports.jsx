import React, { useEffect, useState } from "react";
import {
  getAllReports,
  updateReportStatus,
  deleteReportAdmin,
} from "../../../api/adminApi";

import {
  AlertTriangle,
  Grid,
  List,
  Trash2,
  CheckCircle,
  User,
  Home,
} from "lucide-react";

/* ================= DUMMY DATA (UI PREVIEW ONLY) ================= */
const DUMMY_REPORTS = [
  {
    _id: "1",
    type: "Property Fraud",
    status: "open",
    reportedBy: { email: "tenant1@mail.com" },
    propertyId: { title: "2BHK Flat – Andheri" },
  },
  {
    _id: "2",
    type: "User Misbehavior",
    status: "resolved",
    reportedBy: { email: "owner1@mail.com" },
    targetUser: { email: "tenant2@mail.com" },
  },
  {
    _id: "3",
    type: "Fake Listing",
    status: "open",
    reportedBy: { email: "tenant3@mail.com" },
    propertyId: { title: "Studio Apartment – Pune" },
  },
];

/* ================= COMPONENT ================= */

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("table"); // table | card
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadReports();
  }, [filter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await getAllReports(
        filter === "all" ? {} : { status: filter }
      );

      const apiReports = res.data.reports || [];

      // 🔥 if no backend data → show dummy preview
      setReports(apiReports.length > 0 ? apiReports : DUMMY_REPORTS);
    } catch (err) {
      console.error("Load reports failed", err);
      setReports(DUMMY_REPORTS); // fallback preview
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    if (!window.confirm(`Mark report as ${status}?`)) return;
    await updateReportStatus(id, status);
    loadReports();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    await deleteReportAdmin(id);
    loadReports();
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredReports = reports.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.type?.toLowerCase().includes(q) ||
      r.reportedBy?.email?.toLowerCase().includes(q) ||
      r.propertyId?.title?.toLowerCase().includes(q) ||
      r.targetUser?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-red-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Reports Management
          </h1>
        </div>


      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between lg:flex-row gap-4">

        <input
          type="text"
          placeholder="Search by type, reporter, property..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full lg:w-1/3"
        />

        <div className="flex gap-2">
          {["all", "open", "resolved", "closed"].map((s) => (
            <FilterPill
              key={s}
              active={filter === s}
              onClick={() => setFilter(s)}
            >
              {s}
            </FilterPill>
          ))}
        </div>

        {/* VIEW TOGGLE */}
        <div className="flex gap-2">
          <ViewBtn active={view === "table"} onClick={() => setView("table")}>
            <List size={16} /> Table
          </ViewBtn>
          <ViewBtn active={view === "card"} onClick={() => setView("card")}>
            <Grid size={16} /> Cards
          </ViewBtn>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
        </div>
      ) : filteredReports.length === 0 ? (
        <p className="text-gray-500">No reports found.</p>
      ) : view === "table" ? (
        /* ================= TABLE VIEW ================= */
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Reporter</th>
                <th className="p-3 text-left">Target</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{r.type}</td>
                  <td className="p-3">{r.reportedBy?.email}</td>
                  <td className="p-3">
                    {r.propertyId ? (
                      <span className="flex items-center gap-1">
                        <Home size={14} /> {r.propertyId.title}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <User size={14} /> {r.targetUser?.email}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="flex justify-center p-3 text-center space-x-2">
                    {r.status !== "resolved" && (
                      <ActionBtn
                        color="green"
                        icon={<CheckCircle size={14} />}
                        onClick={() => changeStatus(r._id, "resolved")}
                      >
                        Resolve
                      </ActionBtn>
                    )}
                    <ActionBtn
                      color="red"
                      icon={<Trash2 size={14} />}
                      onClick={() => remove(r._id)}
                    >
                      Delete
                    </ActionBtn>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ================= CARD VIEW ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 space-y-3"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-800">{r.type}</h3>
                <StatusBadge status={r.status} />
              </div>

              <div className="text-sm text-gray-600">
                Reporter: {r.reportedBy?.email}
              </div>

              <div className="text-sm">
                {r.propertyId ? (
                  <span className="flex items-center gap-1">
                    <Home size={14} /> {r.propertyId.title}
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <User size={14} /> {r.targetUser?.email}
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                {r.status !== "resolved" && (
                  <ActionBtn
                    color="green"
                    onClick={() => changeStatus(r._id, "resolved")}
                  >
                    Resolve
                  </ActionBtn>
                )}
                <ActionBtn
                  color="red"
                  onClick={() => remove(r._id)}
                >
                  Delete
                </ActionBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function ViewBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${active
        ? "bg-purple-600 text-white"
        : "bg-gray-100 text-gray-700"
        }`}
    >
      {children}
    </button>
  );
}

function FilterPill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs capitalize ${active
        ? "bg-purple-600 text-white"
        : "bg-gray-100 text-gray-700"
        }`}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const colors = {
    open: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"
        }`}
    >
      {status}
    </span>
  );
}

function ActionBtn({ color, children, onClick, icon }) {
  const colors = {
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs text-white rounded flex items-center gap-1 ${colors[color]}`}
    >
      {icon}
      {children}
    </button>
  );
}
