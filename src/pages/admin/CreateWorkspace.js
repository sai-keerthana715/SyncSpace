import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';

export default function CreateWorkspace() {
  const [workspaces, setWorkspaces] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: 'Bearer ' + token } };

  // Load workspaces when page opens
  useEffect(() => {
    loadWorkspaces();
  }, []);

  async function loadWorkspaces() {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/workspaces', authHeader);
      setWorkspaces(res.data);
    } catch (err) {
      console.error('Error loading workspaces:', err);
    }
  }

  async function createWorkspace() {
    if (!name.trim()) return alert('Enter a workspace name');
    try {
      await axios.post(
        'http://localhost:5000/api/admin/workspaces',
        { name, description },
        authHeader
      );
      setName('');
      setDescription('');
      loadWorkspaces(); // refresh after create
    } catch (err) {
      alert('Failed to create workspace: ' + (err.response?.data?.message || err.message));
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Create Workspace</h2>

      {/* Create Form */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <TextField
          label="Workspace Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={createWorkspace}>
          Create
        </Button>
      </div>

      {/* Workspace List */}
      <h3 className="text-lg font-medium mb-3">Existing Workspaces</h3>
      {workspaces.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No workspaces created yet.
        </Typography>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws) => (
            <Card key={ws._id} className="shadow-md border border-gray-100">
              <CardContent>
                <Typography variant="h6">{ws.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {ws.description || 'No description provided.'}
                </Typography>
                <Typography variant="caption" className="block mt-2 text-gray-600">
                  Members Assigned: {ws.members?.length || 0}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
