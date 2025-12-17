import React, { useEffect, useState } from "react";
import {
  getActiveSubscription,
  getSubscriptionHistory,
} from "../../../api/ownerApi";

const Subscription = () => {
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);

      const [activeRes, historyRes] = await Promise.all([
        getActiveSubscription(),
        getSubscriptionHistory(),
      ]);

      setActivePlan(activeRes.data?.subscription || null);
      setHistory(
        Array.isArray(historyRes.data?.subscriptions)
          ? historyRes.data.subscriptions
          : []
      );
    } catch (err) {
      console.error("Failed to load subscription", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">
        Subscription
      </h1>

      {/* 🔥 ACTIVE PLAN */}
      <div className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow">
        {activePlan ? (
          <>
            <h2 className="text-lg font-semibold">
              {activePlan.planName}
            </h2>

            <p className="mt-1 text-sm opacity-90">
              Status: {activePlan.status}
            </p>

            <p className="mt-2 text-sm">
              Valid till:{" "}
              <span className="font-medium">
                {new Date(activePlan.endDate).toDateString()}
              </span>
            </p>

            <p className="mt-2 text-xl font-bold">
              ₹{activePlan.amount}
            </p>
          </>
        ) : (
          <p>No active subscription</p>
        )}
      </div>

      {/* 📜 HISTORY */}
      <div className="rounded-xl bg-white p-5 shadow">
        <h2 className="mb-4 font-semibold text-gray-800">
          Subscription History
        </h2>

        {history.length === 0 ? (
          <p className="text-gray-500">No subscription history</p>
        ) : (
          <div className="space-y-3">
            {history.map((s) => (
              <div
                key={s._id}
                className="flex justify-between border-b pb-2 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {s.planName}
                  </p>
                  <p className="text-gray-500">
                    {new Date(s.startDate).toDateString()} →{" "}
                    {new Date(s.endDate).toDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-purple-600">
                    ₹{s.amount}
                  </p>
                  <p className="text-xs capitalize text-gray-500">
                    {s.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🚀 UPGRADE (FUTURE) */}
      <button
        disabled
        className="rounded bg-gray-300 px-5 py-2 text-sm text-gray-600"
      >
        Upgrade Plan (Coming Soon)
      </button>
    </div>
  );
};

export default Subscription;
