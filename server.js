console.log('=== RAILWAY EXPRESS SERVER ===');
console.log('Node version:', process.version);
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`Starting Express server on port ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT,
    env: process.env.NODE_ENV || 'development'
  });
});

// Basic test endpoint
app.get('/test', (req, res) => {
  console.log('Test endpoint requested');
  res.status(200).send('Server is working!');
});

// Serve static files
app.use(express.static(__dirname));

// Root route
app.get('/', (req, res) => {
  console.log('Root route requested');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle SPA routing - serve index.html for all other routes
app.get('*', (req, res) => {
  console.log(`Serving index.html for route: ${req.path}`);
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

const server = app.listen(PORT, () => {
  console.log(`✅ Server successfully started on port ${PORT}`);
  console.log(`✅ Health check available at: /health`);
  console.log(`✅ Test endpoint available at: /test`);
  console.log(`✅ Static files served from: ${__dirname}`);
});

server.on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});