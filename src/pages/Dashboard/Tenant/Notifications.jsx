import React, { useEffect, useState } from "react";
import {
  getTenantNotifications,
  markNotificationRead,
  markAllTenantNotificationsRead,
  deleteTenantNotification,
  deleteAllTenantNotifications,
} from "../../../api/tenantApi";

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getTenantNotifications();
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  const markAllRead = async () => {
    await markAllTenantNotificationsRead();
    loadNotifications();
  };

  const removeOne = async (id) => {
    await deleteTenantNotification(id);
    loadNotifications();
  };

  const clearAll = async () => {
    await deleteAllTenantNotifications();
    loadNotifications();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>

        {notifications.length > 0 && (
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
              >
                Mark all read
              </button>
            )}

            <button
              onClick={clearAll}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* LIST */}
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n._id}
              className={`flex justify-between items-start p-4 rounded border
                ${!n.isRead ? "bg-indigo-50 border-indigo-300" : "bg-white"}
              `}
            >
              <div>
                <p className={`font-medium ${!n.isRead ? "text-gray-900" : "text-gray-700"}`}>
                  {n.title}
                </p>
                <p className="text-sm text-gray-600">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col gap-1 text-xs">
                {!n.isRead && (
                  <button
                    onClick={() => markRead(n._id)}
                    className="text-blue-600 hover:underline"
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
