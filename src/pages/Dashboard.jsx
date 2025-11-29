import React from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold">Welcome to Dashboard 🎉</h1>
      {user && (
        <p className="mt-4 text-lg">
          Logged in as <span className="font-semibold">{user.name}</span>
        </p>
      )}
    </div>
  );
}
