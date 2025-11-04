import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

export default function MemberHeader() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) return;

    // 1️⃣ Load existing count
    loadNotifications();

    // 2️⃣ Real-time updates
    const socket = io("http://localhost:5000");
    socket.emit("register", user._id);

    socket.on("notification", (notif) => {
      if (notif.user === user._id) setCount((prev) => prev + 1);
    });

    return () => socket.disconnect();
  }, []);

  async function loadNotifications() {
  try {
    const res = await axios.get("http://localhost:5000/api/member/notifications", {
      headers: { Authorization: "Bearer " + token },
    });

    // count only unread notifications
    const unread = res.data.filter((n) => !n.read).length;
    setCount(unread);
  } catch (err) {
    console.error("Error fetching notification count:", err);
  }
}


  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">Member Dashboard</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/member/notifications")}
          className="relative text-gray-700 hover:text-blue-600 transition"
        >
          <Bell size={22} />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
