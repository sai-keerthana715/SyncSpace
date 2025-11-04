import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MemberNotifications() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Always call hooks unconditionally
  useEffect(() => {
    if (!token) return; // just exit, don't wrap the hook
    loadNotifications();
    markAsRead();
  }, []);

  async function loadNotifications() {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/member/notifications",
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("❌ Error loading notifications:", err);
    }
  }

  async function markAsRead() {
    try {
      await axios.patch(
        "http://localhost:5000/api/member/notifications/mark-read",
        {},
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
    } catch (err) {
      console.error("❌ Error marking as read:", err);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        notifications.map((n, i) => (
          <div
            key={i}
            className={`p-3 border rounded-lg mb-2 ${
              n.read ? "bg-gray-50" : "bg-blue-50"
            }`}
          >
            <p>{n.message}</p>
            <small className="text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}
