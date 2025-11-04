import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import axios from "axios";
import io from "socket.io-client";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const socketRef = React.useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    async function load() {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/notifications", {
          headers: { Authorization: "Bearer " + token },
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("❌ Error loading notifications:", err);
      }
    }
    load();

    // 🔥 Connect to socket.io
    socketRef.current = io("http://localhost:5000");
    socketRef.current.on("notification", (notif) => {
      console.log("🔔 New notification received:", notif);
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Notifications</h3>
      <List>
        {notifications.length === 0 && (
          <ListItem><ListItemText primary="No notifications yet" /></ListItem>
        )}
        {notifications.map((n) => (
          <ListItem key={n._id} divider>
            <ListItemText
              primary={n.message}
              secondary={new Date(n.createdAt).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
