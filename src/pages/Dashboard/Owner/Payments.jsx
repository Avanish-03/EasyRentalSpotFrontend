import React, { useEffect, useState } from "react";
import { getOwnerPayments } from "../../../api/ownerApi";

export default function Payments() {
  const [payments, setPayments] = useState([]);   // ✅ ARRAY
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);

      const res = await getOwnerPayments();

      // ✅ CRITICAL FIX
      const paymentList = Array.isArray(res.data?.payments)
        ? res.data.payments
        : [];

      setPayments(paymentList);
      setRevenue(res.data?.revenue || 0);

    } catch (err) {
      console.error("Failed to load payments", err);
      setPayments([]); // ✅ fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading payments...</div>;
  }

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">Payments</h1>

      {/* REVENUE */}
      <div className="bg-green-100 text-green-700 p-4 rounded-lg font-semibold">
        Total Revenue: ₹{revenue}
      </div>

      {/* TABLE */}
      {payments.length === 0 ? (
        <p className="text-gray-500">No payments found</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Tenant</th>
                <th className="p-3 border">Property</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Method</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border">
                  <td className="p-3 border">
                    <div className="font-medium">
                      {p.payerId?.fullName || "Tenant"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {p.payerId?.email}
                    </div>
                  </td>

                  <td className="p-3 border">
                    {p.bookingId?.propertyId?.title || "Property"}
                  </td>

                  <td className="p-3 border font-semibold text-purple-600">
                    ₹{p.amount}
                  </td>

                  <td className="p-3 border capitalize">
                    {p.paymentMethod}
                  </td>

                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 text-xs rounded-full
                        ${
                          p.status === "success"
                            ? "bg-green-100 text-green-700"
                            : p.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="p-3 border">
                    {new Date(p.paymentDate).toLocaleDateString()}
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
