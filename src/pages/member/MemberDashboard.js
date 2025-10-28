import React from "react";

export default function MemberDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-2">Welcome, {user?.name}</h2>
      <p className="text-gray-600">
        This is your personal dashboard. View your workspaces, notifications, and communicate with your admin.
      </p>
    </div>
  );
}
