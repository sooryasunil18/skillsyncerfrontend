const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all users (for admin dashboard)
router.get('/users', [protect, adminAuth], async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.isActive = status === 'active';
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch users with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page * limit < totalUsers,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get all employers/companies
router.get('/companies', [protect, adminAuth], async (req, res) => {
  try {
    const { status, industry, page = 1, limit = 10 } = req.query;
    
    // Build filter object for employers
    const filter = { role: 'employer' };
    if (status) filter.isActive = status === 'active';
    if (industry) filter['company.industry'] = industry;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch employers with company data
    const companies = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalCompanies = await User.countDocuments(filter);
    
    // Transform data to include company information
    const transformedCompanies = companies.map(user => ({
      id: user._id,
      name: user.company?.name || user.name,
      email: user.email,
      industry: user.company?.industry || 'Not specified',
      location: user.company?.location || 'Not specified',
      phone: user.company?.phone || 'Not provided',
      website: user.company?.website || 'Not provided',
      size: user.company?.size || 'Not specified',
      description: user.company?.description || 'No description',
      status: user.isActive ? 'active' : 'inactive',
      verified: user.isEmailVerified,
      joinDate: user.createdAt,
      lastLogin: user.lastLogin,
      profileCompletion: user.profileCompletion
    }));
    
    res.json({
      success: true,
      data: {
        companies: transformedCompanies,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCompanies / limit),
          totalCompanies,
          hasNext: page * limit < totalCompanies,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching companies',
      error: error.message
    });
  }
});

// Get dashboard statistics
router.get('/stats', [protect, adminAuth], async (req, res) => {
  try {
    // Get user counts by role
    const totalUsers = await User.countDocuments();
    const jobseekers = await User.countDocuments({ role: 'jobseeker' });
    const employers = await User.countDocuments({ role: 'employer' });
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    
    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    // Get industry distribution for companies
    const industryStats = await User.aggregate([
      { $match: { role: 'employer' } },
      { $group: { _id: '$company.industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          jobseekers,
          employers,
          activeUsers,
          verifiedUsers,
          recentRegistrations
        },
        industryDistribution: industryStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// Update user status (activate/deactivate)
router.patch('/users/:userId/status', [protect, adminAuth], async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
});

// Delete user
router.delete('/users/:userId', [protect, adminAuth], async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

module.exports = router;
