import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Box, Stack, CssBaseline, Container } from '@mui/material';

const Home = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }} />
      </Container>
    </React.Fragment>
  );
};

export default Home;
