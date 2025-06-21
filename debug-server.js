// Minimal debug server for Railway
console.log('=== RAILWAY DEBUG SERVER ===');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Memory usage:', process.memoryUsage());
console.log('Environment variables:');
console.log('- PORT:', process.env.PORT);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('- PWD:', process.env.PWD);

const http = require('http');
const PORT = process.env.PORT || 3000;

console.log(`Attempting to start server on port ${PORT}`);

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.headers.host}`);
  
  // Always return 200 with debug info
  res.writeHead(200, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  
  const response = {
    status: 'OK - Railway Debug Server',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'undefined',
    railway_env: process.env.RAILWAY_ENVIRONMENT || 'undefined',
    url: req.url,
    method: req.method,
    headers: req.headers,
    memory: process.memoryUsage(),
    uptime: process.uptime()
  };
  
  res.end(JSON.stringify(response, null, 2));
});

server.on('error', (err) => {
  console.error('❌ SERVER ERROR:', err);
  console.error('Error code:', err.code);
  console.error('Error message:', err.message);
  console.error('Stack trace:', err.stack);
  process.exit(1);
});

server.on('listening', () => {
  const addr = server.address();
  console.log(`✅ Debug server listening on ${addr.address}:${addr.port}`);
  console.log(`✅ Try: curl http://localhost:${addr.port}/test`);
});

// Bind to all interfaces
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server bound successfully to 0.0.0.0:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📡 Received SIGTERM signal');
  server.close(() => {
    console.log('🛑 Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📡 Received SIGINT signal');
  server.close(() => {
    console.log('🛑 Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 UNHANDLED REJECTION at:', promise, 'reason:', reason);
  process.exit(1);
});

console.log('🚀 Debug server setup complete');