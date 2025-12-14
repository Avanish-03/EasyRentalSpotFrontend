import React, { useEffect, useState } from "react";
import { getOwnerPayments } from "../../../api/ownerApi";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const res = await getOwnerPayments();
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-10">Loading payments...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payments</h1>

      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
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
                    <div className="font-medium">{p.tenant?.fullName}</div>
                    <div className="text-sm text-gray-500">{p.tenant?.email}</div>
                  </td>

                  <td className="p-3 border">{p.property?.title}</td>

                  <td className="p-3 border text-purple-600 font-semibold">
                    ₹{p.amount}
                  </td>

                  <td className="p-3 border capitalize">{p.paymentMethod}</td>

                  <td className="p-3 border">
                    <span
                      className={`px-2 py-1 text-xs rounded-full
                      ${
                        p.status === "success"
                          ? "bg-green-200 text-green-700"
                          : p.status === "pending"
                          ? "bg-yellow-200 text-yellow-700"
                          : "bg-red-200 text-red-700"
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
