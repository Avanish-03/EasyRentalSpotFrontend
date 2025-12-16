import React, { useEffect, useState } from "react";
import {
  getAllPropertiesAdmin,
  approveProperty,
  rejectProperty,
} from "../../../api/adminApi";

import {
  Home,
  Grid,
  List,
  CheckCircle,
  XCircle,
  MapPin,
  IndianRupee,
  User,
} from "lucide-react";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("table"); // table | card
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadProperties();
  }, [filter]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const params = filter === "all" ? {} : { approvalStatus: filter };
      const res = await getAllPropertiesAdmin(params);
      setProperties(res.data.properties || []);
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

  /* ---------------- FILTER + SEARCH ---------------- */
  const filteredProperties = properties.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.ownerId?.fullName?.toLowerCase().includes(q) ||
      p.locationId?.city?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Home className="text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Property Management
          </h1>
        </div>


      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between lg:flex-row gap-4">

        <input
          type="text"
          placeholder="Search by title, owner, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full lg:w-1/3 outline-none"
        />

        <div className="flex flex-wrap gap-2">
          {["all", "pending", "approved", "rejected"].map((s) => (
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
      ) : filteredProperties.length === 0 ? (
        <p className="text-gray-500">No properties found.</p>
      ) : view === "table" ? (
        /* ================= TABLE VIEW ================= */
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm">
            <thead className="bg-purple-200">
              <tr>
                <th className="p-3 text-left">Property</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-left">City</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3">
                    {p.ownerId?.fullName}
                    <div className="text-xs text-gray-500">
                      {p.ownerId?.email}
                    </div>
                  </td>
                  <td className="p-3">{p.locationId?.city}</td>
                  <td className="p-3 font-semibold">₹{p.price}</td>
                  <td className="p-3">
                    <StatusBadge status={p.approvalStatus} />
                  </td>
                  <td className="flex justify-center p-3 text-center space-x-2">
                    {p.approvalStatus === "pending" && (
                      <>
                        <ActionBtn
                          color="green"
                          icon={<CheckCircle size={14} />}
                          onClick={() => handleApprove(p._id)}
                        >
                          Approve
                        </ActionBtn>
                        <ActionBtn
                          color="red"
                          icon={<XCircle size={14} />}
                          onClick={() => handleReject(p._id)}
                        >
                          Reject
                        </ActionBtn>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ================= CARD VIEW ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 space-y-3"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-800">
                  {p.title}
                </h3>
                <StatusBadge status={p.approvalStatus} />
              </div>

              <div className="text-sm text-gray-600 flex items-center gap-1">
                <MapPin size={14} /> {p.locationId?.city}
              </div>

              <div className="text-sm flex items-center gap-1">
                <User size={14} />
                {p.ownerId?.fullName}
              </div>

              <div className="text-lg font-bold flex items-center gap-1">
                <IndianRupee size={16} /> {p.price}
              </div>

              {p.approvalStatus === "pending" && (
                <div className="flex gap-2 pt-2">
                  <ActionBtn
                    color="green"
                    onClick={() => handleApprove(p._id)}
                  >
                    Approve
                  </ActionBtn>
                  <ActionBtn
                    color="red"
                    onClick={() => handleReject(p._id)}
                  >
                    Reject
                  </ActionBtn>
                </div>
              )}
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
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
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
