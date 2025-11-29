import React from "react";

export default function Payments({ payments, setPayments }) {
  const handleMarkPaid = (id) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: "Paid" } : p));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Payments</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-green-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Paid</h3>
          <p className="text-2xl font-bold text-green-600">{payments.filter(p => p.status === "Paid").length}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Pending Payments</h3>
          <p className="text-2xl font-bold text-yellow-600">{payments.filter(p => p.status === "Pending").length}</p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Overdue Payments</h3>
          <p className="text-2xl font-bold text-red-600">{payments.filter(p => p.status === "Overdue").length}</p>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">Property</th>
              <th className="py-3 px-6 text-left">Payment Date</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-6">{p.property}</td>
                <td className="py-3 px-6">{p.date}</td>
                <td className="py-3 px-6">{p.amount}</td>
                <td className={`py-3 px-6 font-semibold ${
                  p.status === "Paid" ? "text-green-600" :
                  p.status === "Pending" ? "text-yellow-500" : "text-red-500"
                }`}>{p.status}</td>
                <td className="py-3 px-6">
                  {p.status === "Pending" && (
                    <button
                      onClick={() => handleMarkPaid(p.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Mark Paid
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
