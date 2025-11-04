import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'admin') window.location.href = '/admin/dashboard';
      else window.location.href = '/member/dashboard';
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 5,
          borderRadius: 4,
          width: 420,
          textAlign: 'center',
          backgroundColor: '#ffffffee',
          backdropFilter: 'blur(6px)',
        }}
      >
        <Container maxWidth="sm" sx={{ paddingTop: 2 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              background: 'linear-gradient(90deg, #3B82F6, #6366F1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            SyncSpace
          </Typography>

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#3B82F6' },
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#3B82F6' },
              },
            }}
          />

          <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{
                px: 4,
                py: 1,
                background: 'linear-gradient(90deg, #3B82F6, #2563EB)',
                color: '#fff',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  background: '#1E3A8A',
                },
              }}
            >
              Login
            </Button>

            <Button
              variant="outlined"
              onClick={() => (window.location.href = '/register')}
              sx={{
                borderColor: '#3B82F6',
                color: '#3B82F6',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#EFF6FF',
                },
              }}
            >
              Create account
            </Button>
          </div>

          <div style={{ marginTop: 15, fontSize: 13, color: 'gray' }}>
            Tip: initial admin seeded as <b>admin@syncspace.test</b> / <b>admin123</b>
          </div>
        </Container>
      </Paper>
    </Box>
  );
}
