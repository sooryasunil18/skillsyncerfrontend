const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Test the exact route pattern
app.put('/api/jobseeker/profile', (req, res) => {
  console.log('📝 Profile update request received:');
  console.log('   Method:', req.method);
  console.log('   Path:', req.path);
  console.log('   Headers:', req.headers);
  console.log('   Body:', JSON.stringify(req.body, null, 2));
  
  res.json({
    success: true,
    message: 'Debug route working - profile data received',
    receivedData: Object.keys(req.body),
    timestamp: new Date().toISOString()
  });
});

// Test route without auth
app.get('/api/jobseeker/test', (req, res) => {
  res.json({
    success: true,
    message: 'Jobseeker routes are working'
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

const PORT = 5002; // Use different port to avoid conflict

app.listen(PORT, () => {
  console.log(`🧪 Debug server running on port ${PORT}`);
  console.log(`🌐 Test: http://localhost:${PORT}/api/jobseeker/test`);
  console.log(`💾 Profile test: PUT http://localhost:${PORT}/api/jobseeker/profile`);
});

module.exports = app;