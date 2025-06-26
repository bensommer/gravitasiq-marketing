const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('RAILWAY TEST - ROOT WORKING!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'RAILWAY TEST - HEALTH WORKING!' });
});

app.listen(PORT, () => {
  console.log(`Minimal test server running on port ${PORT}`);
});