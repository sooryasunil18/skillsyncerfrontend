const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply protection and role authorization to all routes
router.use(protect);
router.use(authorize('jobseeker'));

// @desc    Get jobseeker dashboard data
// @route   GET /api/jobseeker/dashboard
// @access  Private (Jobseeker only)
router.get('/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Dashboard statistics (you can expand this based on your needs)
    const dashboardData = {
      profile: {
        completionPercentage: user.profileCompletion,
        name: user.name,
        email: user.email,
        bio: user.profile.bio,
        skills: user.profile.skills || [],
        experience: user.profile.experience,
        location: user.profile.location,
        phone: user.profile.phone,
        resume: user.profile.resume,
        portfolio: user.profile.portfolio
      },
      stats: {
        profileViews: 0, // Implement later
        applicationsSubmitted: 0, // Implement later
        interviewsScheduled: 0, // Implement later
        jobsSaved: 0 // Implement later
      },
      recentActivity: [], // Implement later
      recommendations: [], // Implement later
      upcomingInterviews: [] // Implement later
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @desc    Get jobseeker profile
// @route   GET /api/jobseeker/profile
// @access  Private (Jobseeker only)
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user,
        profileCompletion: user.profileCompletion
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @desc    Update jobseeker profile
// @route   PUT /api/jobseeker/profile
// @access  Private (Jobseeker only)
router.put('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { name, profile } = req.body;

    // Update basic info
    if (name) user.name = name;

    // Update profile fields
    if (profile) {
      if (profile.bio !== undefined) user.profile.bio = profile.bio;
      if (profile.skills !== undefined) user.profile.skills = profile.skills;
      if (profile.experience !== undefined) user.profile.experience = profile.experience;
      if (profile.location !== undefined) user.profile.location = profile.location;
      if (profile.phone !== undefined) user.profile.phone = profile.phone;
      if (profile.resume !== undefined) user.profile.resume = profile.resume;
      if (profile.portfolio !== undefined) user.profile.portfolio = profile.portfolio;
    }

    // Calculate and update profile completion
    user.calculateProfileCompletion();
    
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
        profileCompletion: updatedUser.profileCompletion
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @desc    Get profile completion suggestions
// @route   GET /api/jobseeker/profile-suggestions
// @access  Private (Jobseeker only)
router.get('/profile-suggestions', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const suggestions = [];

    // Check what's missing and provide suggestions
    if (!user.profile.bio) {
      suggestions.push({
        field: 'bio',
        title: 'Add a Professional Bio',
        description: 'Write a brief description about yourself and your career goals',
        priority: 'high'
      });
    }

    if (!user.profile.skills || user.profile.skills.length === 0) {
      suggestions.push({
        field: 'skills',
        title: 'Add Your Skills',
        description: 'List your technical and soft skills to help employers find you',
        priority: 'high'
      });
    }

    if (!user.profile.phone) {
      suggestions.push({
        field: 'phone',
        title: 'Add Contact Number',
        description: 'Provide a phone number for employers to reach you',
        priority: 'medium'
      });
    }

    if (!user.profile.location) {
      suggestions.push({
        field: 'location',
        title: 'Add Your Location',
        description: 'Help employers find local talent by adding your location',
        priority: 'medium'
      });
    }

    if (!user.profile.resume) {
      suggestions.push({
        field: 'resume',
        title: 'Upload Your Resume',
        description: 'Upload your resume to make applications easier',
        priority: 'high'
      });
    }

    if (!user.profile.portfolio) {
      suggestions.push({
        field: 'portfolio',
        title: 'Add Portfolio Link',
        description: 'Showcase your work with a portfolio or personal website',
        priority: 'low'
      });
    }

    res.json({
      success: true,
      data: {
        profileCompletion: user.profileCompletion,
        suggestions,
        totalSuggestions: suggestions.length
      }
    });

  } catch (error) {
    console.error('Profile suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile suggestions'
    });
  }
});

// @desc    Get jobseeker statistics
// @route   GET /api/jobseeker/stats
// @access  Private (Jobseeker only)
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // For now, returning mock data. You can expand this when you add job applications, etc.
    const stats = {
      profileViews: 0,
      applicationsSubmitted: 0,
      interviewsScheduled: 0,
      jobsSaved: 0,
      profileCompletion: user.profileCompletion,
      memberSince: user.createdAt,
      lastLogin: user.lastLogin
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

module.exports = router;