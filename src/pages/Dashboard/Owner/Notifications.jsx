import React, { useEffect, useState } from "react";
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

  if (loading) {
    return <div className="p-6">Loading notifications...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Notifications
        </h1>

        {notifications.length > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-purple-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`rounded-lg border p-4 shadow-sm ${
                n.isRead ? "bg-white" : "bg-purple-50"
              }`}
            >
              <p className="text-sm text-gray-800">
                {n.message}
              </p>

              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>
                  {new Date(n.createdAt).toLocaleString()}
                </span>

                {!n.isRead && (
                  <button
                    onClick={() => markRead(n._id)}
                    className="text-purple-600 hover:underline"
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
