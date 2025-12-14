import React, { useEffect, useState } from "react";
import {
  getAllTicketsAdmin,
  updateTicketStatusAdmin,
  deleteTicketAdmin,
} from "../../../api/adminApi";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await getAllTicketsAdmin(filter ? { status: filter } : {});
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error("Load tickets failed", err);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    await updateTicketStatusAdmin(id, status);
    loadTickets();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    await deleteTicketAdmin(id);
    loadTickets();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <select
          className="border px-3 py-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(t => (
                <tr key={t._id} className="border-t">
                  <td className="p-3">{t.userId?.email}</td>
                  <td className="p-3">{t.subject}</td>
                  <td className="p-3 capitalize">{t.status}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => changeStatus(t._id, "closed")}
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => remove(t._id)}
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
