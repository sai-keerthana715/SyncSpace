import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, MenuItem, Button } from '@mui/material';

export default function AssignWorkspace() {
  const [members, setMembers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedWs, setSelectedWs] = useState('');

  useEffect(()=> { load(); }, []);

  async function load() {
    try {
      const token = localStorage.getItem('token');
      const m = await axios.get('http://localhost:5000/api/admin/members', { headers: { Authorization: 'Bearer ' + token } });
      const w = await axios.get('http://localhost:5000/api/admin/workspaces', { headers: { Authorization: 'Bearer ' + token } });
      setMembers(m.data); setWorkspaces(w.data);
    } catch (err) { console.error(err); }
  }

  async function assign() {
    if (!selectedMember || !selectedWs) return alert('Select both');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/admin/workspaces/${selectedWs}/assign`, { userId: selectedMember }, { headers: { Authorization: 'Bearer ' + token } });
      alert('Assigned');
      setSelectedMember(''); setSelectedWs('');
    } catch (err) { alert('Assign failed: ' + (err.response?.data?.message || err.message)); }
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Assign Member to Workspace</h3>
      <div className="flex gap-3 items-center">
        <Select value={selectedWs} onChange={(e)=>setSelectedWs(e.target.value)} displayEmpty style={{minWidth:240}}>
          <MenuItem value="">Select Workspace</MenuItem>
          {workspaces.map(w => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
        </Select>
        <Select value={selectedMember} onChange={(e)=>setSelectedMember(e.target.value)} displayEmpty style={{minWidth:320}}>
          <MenuItem value="">Select Member</MenuItem>
          {members.map(m => <MenuItem key={m._id} value={m._id}>{m.name} — {m.email}</MenuItem>)}
        </Select>
        <Button variant="contained" onClick={assign}>Assign</Button>
      </div>
    </div>
  );
}
