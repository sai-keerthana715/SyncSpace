import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import io from "socket.io-client";

export default function MemberNotifications() {
  const [items, setItems] = useState([]);
  const socketRef = React.useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.on("notification", (n) => setItems((prev) => [n, ...prev]));
    return () => socketRef.current.disconnect();
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Notifications</h3>
      <List>
        {items.length === 0 && <p>No notifications yet.</p>}
        {items.map((n, i) => (
          <ListItem key={i} divider>
            <ListItemText primary={n.message || "New update received."} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
