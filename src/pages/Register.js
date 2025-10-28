import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      alert('Registered! You can now log in.');
      window.location.href = '/';
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Container maxWidth='sm' style={{ paddingTop: 40 }}>
      <Typography variant='h4' gutterBottom>Create an Account</Typography>
      <TextField label='Name' fullWidth margin='normal' value={name} onChange={e=>setName(e.target.value)} />
      <TextField label='Email' fullWidth margin='normal' value={email} onChange={e=>setEmail(e.target.value)} />
      <TextField label='Password' type='password' fullWidth margin='normal' value={password} onChange={e=>setPassword(e.target.value)} />
      <Button variant='contained' onClick={handleRegister}>Register</Button>
    </Container>
  );
}
