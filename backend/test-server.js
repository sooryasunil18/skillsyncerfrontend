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

// Test health endpoint
app.get('/api/health', (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Test server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Test jobseeker endpoint without auth
app.get('/api/jobseeker/test-no-auth', (req, res) => {
  res.json({
    success: true,
    message: 'Jobseeker test endpoint working (no auth required)',
    timestamp: new Date().toISOString()
  });
});

// Test profile endpoint without auth
app.post('/api/jobseeker/profile/test-save', (req, res) => {
  console.log('Received profile data:', JSON.stringify(req.body, null, 2));
  
  res.json({
    success: true,
    message: 'Test profile save successful',
    receivedData: Object.keys(req.body),
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/jobseeker/test-no-auth`);
  console.log(`💾 Test save: POST http://localhost:${PORT}/api/jobseeker/profile/test-save`);
});

module.exports = app;