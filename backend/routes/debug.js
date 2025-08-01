const express = require('express');
const User = require('../models/User');

const router = express.Router();

// @desc    Get all users (for debugging)
// @route   GET /api/debug/users
// @access  Public (remove in production)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Debug users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// @desc    Clear all users (for debugging)
// @route   DELETE /api/debug/users
// @access  Public (remove in production)
router.delete('/users', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({
      success: true,
      message: 'All users deleted'
    });
  } catch (error) {
    console.error('Debug clear users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing users',
      error: error.message
    });
  }
});

module.exports = router;