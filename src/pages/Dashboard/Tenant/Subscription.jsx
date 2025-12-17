import React, { useEffect, useState } from "react";
import {
  getSubscriptionPlans,
  getMySubscription,
  purchaseTenantSubscription,
  cancelTenantSubscription,
} from "../../../api/tenantApi";

export default function Subscription() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([]);
  const [mySub, setMySub] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [plansRes, myRes] = await Promise.all([
        getSubscriptionPlans(),
        getMySubscription(),
      ]);

      setPlans(
        Array.isArray(plansRes.data.plans)
          ? plansRes.data.plans
          : []
      );

      setMySub(myRes.data.subscription || null);
    } catch (err) {
      console.error("Failed to load subscription data", err);
      setPlans([]);
      setMySub(null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- BUY / UPGRADE ---------------- */
  const handlePurchase = async (planId) => {
    try {
      setProcessingId(planId);
      await purchaseTenantSubscription({ planId });
      alert("Subscription activated successfully 🎉");
      loadAll();
    } catch (err) {
      alert("Subscription purchase failed");
    } finally {
      setProcessingId(null);
    }
  };

  /* ---------------- CANCEL ---------------- */
  const handleCancel = async () => {
    if (!window.confirm("Cancel your active subscription?")) return;

    try {
      setProcessingId("cancel");
      await cancelTenantSubscription();
      alert("Subscription cancelled");
      loadAll();
    } catch {
      alert("Failed to cancel subscription");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <h1 className="text-2xl font-bold text-gray-800">
        Subscription
      </h1>

      {/* ================= CURRENT SUBSCRIPTION ================= */}
      <div className="rounded-xl bg-white p-6 shadow space-y-3">
        <h2 className="text-lg font-semibold text-gray-700">
          Current Plan
        </h2>

        {mySub ? (
          <>
            <p className="text-gray-800 font-medium">
              {mySub.plan?.name}
            </p>

            <p className="text-sm text-gray-500">
              Valid till:{" "}
              {new Date(mySub.expiresAt).toLocaleDateString()}
            </p>

            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Active
            </span>

            <div>
              <button
                disabled={processingId === "cancel"}
                onClick={handleCancel}
                className="mt-4 rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
              >
                Cancel Subscription
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">
            You don’t have an active subscription
          </p>
        )}
      </div>

      {/* ================= PLANS ================= */}
      <div>
        <h2 className="mb-5 text-xl font-semibold text-gray-800">
          Available Plans
        </h2>

        {plans.length === 0 ? (
          <p className="text-gray-500">No plans available</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => {
              const isActive = mySub?.plan?._id === p._id;

              return (
                <div
                  key={p._id}
                  className={`rounded-xl border bg-white p-6 shadow-sm transition
                    ${isActive ? "border-purple-500 shadow-md" : "hover:shadow-md"}
                  `}
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {p.name}
                  </h3>

                  <p className="mt-2 text-3xl font-bold text-purple-700">
                    ₹{p.price}
                  </p>

                  <p className="text-sm text-gray-500">
                    Duration: {p.durationInDays} days
                  </p>

                  <ul className="mt-4 space-y-1 text-sm text-gray-600">
                    {p.features?.map((f, i) => (
                      <li key={i}>✔ {f}</li>
                    ))}
                  </ul>

                  {isActive ? (
                    <span className="mt-5 inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                      Current Plan
                    </span>
                  ) : (
                    <button
                      disabled={processingId === p._id}
                      onClick={() => handlePurchase(p._id)}
                      className="mt-5 w-full rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700 disabled:opacity-60"
                    >
                      {processingId === p._id
                        ? "Processing..."
                        : "Subscribe"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
