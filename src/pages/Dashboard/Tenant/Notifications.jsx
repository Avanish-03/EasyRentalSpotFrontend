import React, { useEffect, useState } from "react";
import {
  getTenantNotifications,
  markNotificationRead,
  markAllTenantNotificationsRead,
  deleteTenantNotification,
  deleteAllTenantNotifications,
} from "../../../api/tenantApi";
import { Bell, Trash2, CheckCircle } from "lucide-react";

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  /* ---------------- LOAD ---------------- */
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getTenantNotifications();
      setNotifications(res.data?.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- ACTIONS ---------------- */
  const markRead = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  const markAllRead = async () => {
    await markAllTenantNotificationsRead();
    loadNotifications();
  };

  const removeOne = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    await deleteTenantNotification(id);
    loadNotifications();
  };

  const clearAll = async () => {
    if (!window.confirm("Clear all notifications?")) return;
    await deleteAllTenantNotifications();
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>

          {unreadCount > 0 && (
            <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
              {unreadCount} unread
            </span>
          )}
        </div>
      </div>

      {/* ================= ACTION BAR ================= */}
      {notifications.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              <CheckCircle size={16} />
              Mark all read
            </button>
          )}

          <button
            onClick={clearAll}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            <Trash2 size={16} />
            Clear all
          </button>
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {notifications.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <Bell size={36} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 font-medium">
            No notifications
          </p>
          <p className="text-sm text-gray-400 mt-1">
            You’re all caught up 🎉
          </p>
        </div>
      ) : (
        /* ================= LIST ================= */
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`flex justify-between items-start gap-4 rounded-xl border p-4 transition ${
                !n.isRead
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white hover:shadow"
              }`}
            >
              {/* CONTENT */}
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    !n.isRead
                      ? "text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  {n.title}
                </p>
                <p className="text-sm text-gray-600">
                  {n.message}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col gap-2 text-xs">
                {!n.isRead && (
                  <button
                    onClick={() => markRead(n._id)}
                    className="text-indigo-600 hover:underline"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => removeOne(n._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
