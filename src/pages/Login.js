import React, {useState} from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'admin') window.location.href = '/admin/dashboard';
      else window.location.href = '/member/dashboard';
    } catch (err) { alert('Login failed: ' + (err.response?.data?.message || err.message)); }
  };
  return (
    <Container maxWidth='sm' style={{paddingTop:40}}>
      <Typography variant='h4' gutterBottom>SyncSpace</Typography>
      <TextField label='Email' fullWidth margin='normal' value={email} onChange={e=>setEmail(e.target.value)} />
      <TextField label='Password' type='password' fullWidth margin='normal' value={password} onChange={e=>setPassword(e.target.value)} />
      <div style={{display:'flex', gap:10, marginTop:10}}>
        <Button variant='contained' onClick={handleLogin}>Login</Button>
        <Button variant='outlined' onClick={()=> window.location.href = '/register'}>Create account</Button>
      </div>
      <div style={{marginTop:12, fontSize:12}}>Tip: initial admin seeded as <b>admin@syncspace.test</b> / <b>admin123</b></div>
    </Container>
  );
}
