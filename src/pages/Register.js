import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
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
            Create an Account
          </Typography>

          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#3B82F6' },
              },
            }}
          />

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

          <Button
            variant="contained"
            fullWidth
            onClick={handleRegister}
            sx={{
              mt: 3,
              py: 1.2,
              fontSize: '16px',
              borderRadius: 2,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #3B82F6, #2563EB)',
              '&:hover': { background: '#1E3A8A' },
            }}
          >
            Register
          </Button>
        </Container>
      </Paper>
    </Box>
  );
}
