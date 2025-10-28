import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import io from 'socket.io-client';

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const socketRef = React.useRef(null);

  useEffect(()=>{
    // load initial notifications (we don't have a dedicated endpoint; this is demo)
    // you could create GET /api/admin/notifications on backend to persist notifications
    async function load() {
      try {
        const token = localStorage.getItem('token');
        // example: fetch recent member registrations (admin can check logs)
        const members = await axios.get('http://localhost:5000/api/admin/members', { headers: { Authorization: 'Bearer ' + token } });
        setItems(members.data.slice(-5).map(m => ({ id: m._id, text: `New member registered: ${m.name} (${m.email})` })));
      } catch (err) { console.error(err); }
    }
    load();

    // socket realtime push (server should emit 'notification' events)
    socketRef.current = io('http://localhost:5000');
    socketRef.current.on('notification', (n) => setItems(prev => [n, ...prev]));
    return () => socketRef.current.disconnect();
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Notifications</h3>
      <List>
        {items.map(i => (
          <ListItem key={i.id || i._id} divider>
            <ListItemText primary={i.text || i.message || JSON.stringify(i)} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
