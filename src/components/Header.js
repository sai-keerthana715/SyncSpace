// ✅ inside Header.jsx or AdminHeader.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { Bell } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔹 Load unread notifications count
  async function loadUnreadCount() {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/notifications", {
        headers: { Authorization: "Bearer " + token },
      });
      const unread = res.data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("❌ Error loading notifications:", err);
    }
  }

  // 🔹 Mark all as read when opening the page
  async function openNotifications() {
    try {
      await axios.patch(
        "http://localhost:5000/api/admin/notifications/mark-read",
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
      setUnreadCount(0);
      navigate("/admin/notifications");
    } catch (err) {
      console.error("❌ Error marking notifications as read:", err);
      navigate("/admin/notifications");
    }
  }

  // 🔹 Socket for real-time notifications
  useEffect(() => {
    loadUnreadCount();
    const socket = io("http://localhost:5000");
    if (user?._id) socket.emit("register", user._id);

    socket.on("notification", () => {
      setUnreadCount((prev) => prev + 1);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-xl font-semibold text-blue-600">Admin Dashboard</h1>

      <div
  className="relative cursor-pointer bg-blue-50 p-2 rounded-full hover:bg-blue-100 transition"
  onClick={openNotifications}
>
   <Bell size={22} />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
      {unreadCount}
    </span>
  )}
</div>

    </header>
  );
}
