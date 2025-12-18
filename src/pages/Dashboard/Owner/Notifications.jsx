import React, { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
} from "lucide-react";

import {
  getOwnerNotifications,
  markNotificationRead,
  markAllOwnerNotificationsRead,
} from "../../../api/ownerApi";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getOwnerNotifications();
      setNotifications(
        Array.isArray(res.data?.notifications)
          ? res.data.notifications
          : []
      );
    } catch (err) {
      console.error("Failed to load notifications", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  const markAllRead = async () => {
    await markAllOwnerNotificationsRead();
    loadNotifications();
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-6 w-40 rounded bg-gray-200" />
        <div className="h-20 rounded-xl bg-gray-200" />
        <div className="h-20 rounded-xl bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white shadow">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-3">
            <Bell />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-white/80">
              Stay updated with recent activities
            </p>
          </div>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-purple-600 shadow hover:bg-gray-100 transition"
          >
            <CheckCircle size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {/* CONTENT */}
      {notifications.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow">
          <Bell className="mx-auto mb-3 text-gray-400" size={32} />
          <p className="text-gray-500">You have no notifications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`relative rounded-2xl border p-4 shadow transition hover:shadow-md ${
                n.isRead
                  ? "bg-white"
                  : "bg-purple-50 border-purple-200"
              }`}
            >
              {/* UNREAD DOT */}
              {!n.isRead && (
                <span className="absolute left-3 top-3 h-2 w-2 rounded-full bg-purple-600" />
              )}

              <p className="text-sm text-gray-800 pl-4">
                {n.message}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 pl-4">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(n.createdAt).toLocaleString()}
                </span>

                {!n.isRead && (
                  <button
                    onClick={() => markRead(n._id)}
                    className="text-purple-600 font-medium hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
