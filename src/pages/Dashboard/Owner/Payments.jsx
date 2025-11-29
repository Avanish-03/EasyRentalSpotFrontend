import React from "react";

export default function Payments({ payments }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Payments</h2>
      <table className="w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-purple-800 text-white">
          <tr>
            <th className="p-3 text-left">Tenant</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-100">
              <td className="p-3">{p.tenant}</td>
              <td className="p-3">₹{p.amount}</td>
              <td className={`p-3 font-semibold ${p.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                {p.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
