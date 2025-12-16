import React, { useEffect, useState } from "react";
import {
  getAllTicketsAdmin,
  updateTicketStatusAdmin,
  deleteTicketAdmin,
} from "../../../api/adminApi";

import {
  LifeBuoy,
  Grid,
  List,
  Trash2,
  CheckCircle,
  User,
} from "lucide-react";

/* ================= DUMMY DATA (UI PREVIEW ONLY) ================= */
const DUMMY_TICKETS = [
  {
    _id: "1",
    subject: "Payment not reflected",
    status: "open",
    userId: { email: "tenant1@mail.com" },
  },
  {
    _id: "2",
    subject: "Unable to contact property owner",
    status: "in_progress",
    userId: { email: "tenant2@mail.com" },
  },
];

/* ================= COMPONENT ================= */

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState("table"); // table | card
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTickets();
  }, [filter]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await getAllTicketsAdmin(
        filter === "all" ? {} : { status: filter }
      );

      const apiTickets = res.data.tickets || [];

      // 🔥 fallback dummy ONLY if no backend data
      setTickets(apiTickets.length > 0 ? apiTickets : DUMMY_TICKETS);
    } catch (err) {
      console.error("Load tickets failed", err);
      setTickets(DUMMY_TICKETS);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id, status) => {
    if (!window.confirm(`Mark ticket as ${status}?`)) return;
    await updateTicketStatusAdmin(id, status);
    loadTickets();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    await deleteTicketAdmin(id);
    loadTickets();
  };

  /* ================= FILTER + SEARCH ================= */
  const filteredTickets = tickets.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.subject?.toLowerCase().includes(q) ||
      t.userId?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2">
          <LifeBuoy className="text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Support Tickets
          </h1>
        </div>


      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="bg-white p-4 rounded-xl shadow flex flex-col justify-between lg:flex-row gap-4">

        <input
          type="text"
          placeholder="Search by subject or user email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full lg:w-1/3"
        />

        <div className="flex gap-2">
          {["all", "open", "in_progress", "closed"].map((s) => (
            <FilterPill
              key={s}
              active={filter === s}
              onClick={() => setFilter(s)}
            >
              {s.replace("_", " ")}
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
      ) : filteredTickets.length === 0 ? (
        <p className="text-gray-500">No tickets found.</p>
      ) : view === "table" ? (
        /* ================= TABLE VIEW ================= */
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t) => (
                <tr key={t._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-1">
                    <User size={14} /> {t.userId?.email}
                  </td>
                  <td className="p-3 font-medium">{t.subject}</td>
                  <td className="p-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="flex justify-center p-3 text-center space-x-2">
                    {t.status !== "closed" && (
                      <ActionBtn
                        color="green"
                        icon={<CheckCircle size={14} />}
                        onClick={() => changeStatus(t._id, "closed")}
                      >
                        Close
                      </ActionBtn>
                    )}
                    <ActionBtn
                      color="red"
                      icon={<Trash2 size={14} />}
                      onClick={() => remove(t._id)}
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
          {filteredTickets.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 space-y-3"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-800">
                  {t.subject}
                </h3>
                <StatusBadge status={t.status} />
              </div>

              <div className="text-sm text-gray-600 flex items-center gap-1">
                <User size={14} /> {t.userId?.email}
              </div>

              <div className="flex gap-2 pt-2">
                {t.status !== "closed" && (
                  <ActionBtn
                    color="green"
                    onClick={() => changeStatus(t._id, "closed")}
                  >
                    Close
                  </ActionBtn>
                )}
                <ActionBtn
                  color="red"
                  onClick={() => remove(t._id)}
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
    in_progress: "bg-blue-100 text-blue-700",
    closed: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-700"
        }`}
    >
      {status.replace("_", " ")}
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
