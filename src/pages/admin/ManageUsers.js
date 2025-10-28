import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField } from '@mui/material';

export default function ManageUsers() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/members', { headers: { Authorization: 'Bearer ' + token } });
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteUser(id) {
    // For safety: not implemented in backend. If you wish, add DELETE /api/admin/users/:id
    alert('Delete not implemented on backend; you can implement DELETE endpoint to enable this.');
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Manage Users</h3>

      <div className="mb-4 flex gap-2">
        <TextField label="Search by name or email" value={query} onChange={(e)=>setQuery(e.target.value)} />
        <Button variant="contained" onClick={()=>{}}>Search</Button>
      </div>

      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Workspaces</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.filter(m => (m.name + m.email).toLowerCase().includes(query.toLowerCase()))
              .map(m => (
              <tr key={m._id} className="border-t">
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.email}</td>
                <td className="p-3">{(m.workspaces || []).length}</td>
                <td className="p-3">
                  <Button size="small" onClick={()=>alert('Open profile / assign directly from workspaces page')}>View</Button>
                  <Button size="small" color="error" onClick={()=>deleteUser(m._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
