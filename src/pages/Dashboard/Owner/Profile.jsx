import React from "react";

export default function Profile({ user }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p><strong>Name:</strong> {user.fullName}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p className="text-gray-600 mt-4">You can later connect this to the backend to update details.</p>
    </div>
  );
}
