// import React, { useEffect, useState } from 'react';
// import { Container, Typography, Button, TextField, Select, MenuItem } from '@mui/material';
// import axios from 'axios';

// export default function AdminDashboard(){
//   const [members, setMembers] = useState([]);
//   const [workspaces, setWorkspaces] = useState([]);
//   const [wsName, setWsName] = useState('');
//   const [wsDesc, setWsDesc] = useState('');
//   const [selectedWs, setSelectedWs] = useState('');
//   const [selectedMember, setSelectedMember] = useState('');

//   useEffect(()=>{ loadMembers(); loadWorkspaces(); }, []);

//   const authHeader = ()=> ({ headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });

//   async function loadMembers(){
//     try {
//       const res = await axios.get('http://localhost:5000/api/admin/members', authHeader());
//       setMembers(res.data);
//     } catch (err) { console.error(err); }
//   }
//   async function loadWorkspaces(){
//     try {
//       const res = await axios.get('http://localhost:5000/api/admin/workspaces', authHeader());
//       setWorkspaces(res.data);
//     } catch (err) { console.error(err); }
//   }
//   async function createWorkspace(){
//     try {
//       const res = await axios.post('http://localhost:5000/api/admin/workspaces', { name: wsName, description: wsDesc }, authHeader());
//       setWsName(''); setWsDesc('');
//       loadWorkspaces();
//     } catch (err) { alert('Create workspace failed'); }
//   }
//   async function assignMember(){
//     if (!selectedWs || !selectedMember) return alert('Select workspace and member');
//     try {
//       await axios.post(`http://localhost:5000/api/admin/workspaces/${selectedWs}/assign`, { userId: selectedMember }, authHeader());
//       alert('Assigned');
//       loadWorkspaces(); loadMembers();
//     } catch (err) { alert('Assign failed'); }
//   }
//   function handleLogout(){ localStorage.clear(); window.location.href = '/'; }

//   return (
//     <Container style={{paddingTop:30}}>
//       <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
//         <Typography variant='h4'>Admin Dashboard</Typography>
//         <div>
//           <Button variant='outlined' onClick={handleLogout}>Logout</Button>
//         </div>
//       </div>

//       <section style={{marginTop:20}}>
//         <Typography variant='h6'>Create Workspace</Typography>
//         <TextField label='Name' value={wsName} onChange={e=>setWsName(e.target.value)} style={{marginRight:8}} />
//         <TextField label='Description' value={wsDesc} onChange={e=>setWsDesc(e.target.value)} style={{marginRight:8}} />
//         <Button variant='contained' onClick={createWorkspace}>Create</Button>
//       </section>

//       <section style={{marginTop:20}}>
//         <Typography variant='h6'>Assign Member to Workspace</Typography>
//         <Select value={selectedWs} onChange={e=>setSelectedWs(e.target.value)} displayEmpty style={{minWidth:200, marginRight:8}}>
//           <MenuItem value=''>Select Workspace</MenuItem>
//           {workspaces.map(w=> <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
//         </Select>
//         <Select value={selectedMember} onChange={e=>setSelectedMember(e.target.value)} displayEmpty style={{minWidth:200, marginRight:8}}>
//           <MenuItem value=''>Select Member</MenuItem>
//           {members.map(m=> <MenuItem key={m._id} value={m._id}>{m.name} ({m.email})</MenuItem>)}
//         </Select>
//         <Button variant='contained' onClick={assignMember}>Assign</Button>
//       </section>

//       <section style={{marginTop:30}}>
//         <Typography variant='h6'>Members</Typography>
//         <ul>{members.map(m=> <li key={m._id}>{m.name} — {m.email}</li>)}</ul>
//       </section>

//       <section style={{marginTop:30}}>
//         <Typography variant='h6'>Workspaces</Typography>
//         <ul>{workspaces.map(w=> <li key={w._id}>{w.name} — Members: {w.members.length}</li>)}</ul>
//       </section>
//     </Container>
//   );
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography } from '@mui/material';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ users: 0, workspaces: 0, tasks: 0 });

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const members = await axios.get('http://localhost:5000/api/admin/members', { headers: { Authorization: 'Bearer ' + token } });
        const workspaces = await axios.get('http://localhost:5000/api/admin/workspaces', { headers: { Authorization: 'Bearer ' + token } });
        // tasks count could be fetched from a future endpoint, here we approximate 0
        setStats({ users: members.data.length, workspaces: workspaces.data.length, tasks: 0 });
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Overview</h3>
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Members</Typography>
            <Typography variant="h4">{stats.users}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Workspaces</Typography>
            <Typography variant="h4">{stats.workspaces}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="subtitle2">Tasks</Typography>
            <Typography variant="h4">{stats.tasks}</Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
