import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUserByAdmin,
} from "../../../api/adminApi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3">{u.fullName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">
                    {u.role?.name || "N/A"}
                  </td>
                  <td className="p-3">
                    {u.isBlocked ? (
                      <span className="text-red-600 font-medium">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    {u.isBlocked ? (
                      <button
                        onClick={() => handleUnblock(u._id)}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(u._id)}
                        className="px-3 py-1 text-xs bg-yellow-600 text-white rounded"
                      >
                        Block
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(u._id)}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded"
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
