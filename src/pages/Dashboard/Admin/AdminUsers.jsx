import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUserByAdmin,
} from "../../../api/adminApi";

import { Users, Grid, List, Trash2, Ban, CheckCircle } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("table"); // table | card
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id) => {
    if (!window.confirm("Block this user?")) return;
    await blockUser(id);
    loadUsers();
  };

  const handleUnblock = async (id) => {
    if (!window.confirm("Unblock this user?")) return;
    await unblockUser(id);
    loadUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    await deleteUserByAdmin(id);
    loadUsers();
  };

  /* ---------------- FILTERED USERS ---------------- */
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    const matchRole =
      roleFilter === "all" ||
      u.role?.name?.toLowerCase() === roleFilter;

    return matchSearch && matchRole;
  });

  return (
    <div className="p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Users Management
          </h1>
        </div>

        
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-4 rounded-xl shadow flex justify-between flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full sm:w-1/2 outline-none"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full sm:w-48"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
          <option value="tenant">Tenant</option>
        </select>

        {/* VIEW TOGGLE */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${
              view === "table"
                ? "bg-purple-600 text-white"
                : "bg-gray-100"
            }`}
          >
            <List size={16} /> Table
          </button>
          <button
            onClick={() => setView("card")}
            className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${
              view === "card"
                ? "bg-purple-600 text-white"
                : "bg-gray-100"
            }`}
          >
            <Grid size={16} /> Cards
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : view === "table" ? (
        /* ================= TABLE VIEW ================= */
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm">
            <thead className="bg-purple-200">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{u.fullName}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3 capitalize">
                    {u.role?.name || "N/A"}
                  </td>
                  <td className="p-3">
                    {u.isBlocked ? (
                      <Badge color="red" text="Blocked" />
                    ) : (
                      <Badge color="green" text="Active" />
                    )}
                  </td>
                  <td className="flex justify-center p-3 text-center space-x-2">
                    {u.isBlocked ? (
                      <ActionBtn
                        color="green"
                        icon={<CheckCircle size={14} />}
                        label="Active"
                        onClick={() => handleUnblock(u._id)}
                      />
                    ) : (
                      <ActionBtn
                        color="yellow"
                        icon={<Ban size={14} />}
                        label="InActive"
                        onClick={() => handleBlock(u._id)}
                      />
                    )}
                    <ActionBtn
                      color="red"
                      icon={<Trash2 size={14} />}
                      label="Delete"
                      onClick={() => handleDelete(u._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ================= CARD VIEW ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((u) => (
            <div
              key={u._id}
              className="bg-white rounded-xl shadow p-5 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {u.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
                {u.isBlocked ? (
                  <Badge color="red" text="Blocked" />
                ) : (
                  <Badge color="green" text="Active" />
                )}
              </div>

              <p className="text-sm capitalize">
                Role:{" "}
                <span className="font-medium">
                  {u.role?.name || "N/A"}
                </span>
              </p>

              <div className="flex gap-2 pt-2">
                {u.isBlocked ? (
                  <ActionBtn
                    color="green"
                    label="Unblock"
                    onClick={() => handleUnblock(u._id)}
                  />
                ) : (
                  <ActionBtn
                    color="yellow"
                    label="Block"
                    onClick={() => handleBlock(u._id)}
                  />
                )}
                <ActionBtn
                  color="red"
                  label="Delete"
                  onClick={() => handleDelete(u._id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE UI ================= */

function Badge({ color, text }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full font-medium ${colors[color]}`}
    >
      {text}
    </span>
  );
}

function ActionBtn({ label, onClick, color, icon }) {
  const colors = {
    green: "bg-green-600 hover:bg-green-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
    red: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs text-white rounded flex items-center gap-1 ${colors[color]}`}
    >
      {icon}
      {label}
    </button>
  );
}
