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

    // Generate profile completion suggestions for quick actions
    const quickActions = [];
    
    if (!user.profile.bio) {
      quickActions.push({
        id: 'add-bio',
        title: 'Add Professional Bio',
        description: 'Tell employers about yourself',
        icon: 'user',
        priority: 'high',
        action: 'complete-profile',
        field: 'bio'
      });
    }
    
    if (!user.profile.skills || user.profile.skills.length === 0) {
      quickActions.push({
        id: 'add-skills',
        title: 'Add Your Skills',
        description: 'List your technical abilities',
        icon: 'code',
        priority: 'high',
        action: 'complete-profile',
        field: 'skills'
      });
    }
    
    if (!user.profile.resume) {
      quickActions.push({
        id: 'upload-resume',
        title: 'Upload Resume',
        description: 'Make applications easier',
        icon: 'file-text',
        priority: 'high',
        action: 'complete-profile',
        field: 'resume'
      });
    }
    
    if (!user.profile.location) {
      quickActions.push({
        id: 'add-location',
        title: 'Add Location',
        description: 'Help employers find local talent',
        icon: 'map-pin',
        priority: 'medium',
        action: 'complete-profile',
        field: 'location'
      });
    }
    
    if (!user.profile.phone) {
      quickActions.push({
        id: 'add-phone',
        title: 'Add Phone Number',
        description: 'Let employers contact you',
        icon: 'phone',
        priority: 'medium',
        action: 'complete-profile',
        field: 'phone'
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
        portfolio: user.profile.portfolio,
        profilePicture: user.profile.profilePicture,
        socialLinks: user.profile.socialLinks || {},
        jobPreferences: user.profile.jobPreferences || {},
        isProfilePublic: user.profile.isProfilePublic
      },
      quickActions: quickActions.slice(0, 4), // Show top 4 quick actions
      stats: {
        profileViews: 0, // Implement later
        applicationsSubmitted: 0, // Implement later
        interviewsScheduled: 0, // Implement later
        jobsSaved: 0, // Implement later
        profileCompletion: user.profileCompletion
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
      if (profile.profilePicture !== undefined) user.profile.profilePicture = profile.profilePicture;
      
      // Update social links
      if (profile.socialLinks !== undefined) {
        if (!user.profile.socialLinks) user.profile.socialLinks = {};
        if (profile.socialLinks.linkedin !== undefined) user.profile.socialLinks.linkedin = profile.socialLinks.linkedin;
        if (profile.socialLinks.github !== undefined) user.profile.socialLinks.github = profile.socialLinks.github;
        if (profile.socialLinks.twitter !== undefined) user.profile.socialLinks.twitter = profile.socialLinks.twitter;
        if (profile.socialLinks.website !== undefined) user.profile.socialLinks.website = profile.socialLinks.website;
      }
      
      // Update job preferences
      if (profile.jobPreferences !== undefined) {
        if (!user.profile.jobPreferences) user.profile.jobPreferences = {};
        if (profile.jobPreferences.jobType !== undefined) user.profile.jobPreferences.jobType = profile.jobPreferences.jobType;
        if (profile.jobPreferences.workMode !== undefined) user.profile.jobPreferences.workMode = profile.jobPreferences.workMode;
        if (profile.jobPreferences.availableFrom !== undefined) user.profile.jobPreferences.availableFrom = profile.jobPreferences.availableFrom;
        
        // Update expected salary
        if (profile.jobPreferences.expectedSalary !== undefined) {
          if (!user.profile.jobPreferences.expectedSalary) user.profile.jobPreferences.expectedSalary = {};
          if (profile.jobPreferences.expectedSalary.min !== undefined) user.profile.jobPreferences.expectedSalary.min = profile.jobPreferences.expectedSalary.min;
          if (profile.jobPreferences.expectedSalary.max !== undefined) user.profile.jobPreferences.expectedSalary.max = profile.jobPreferences.expectedSalary.max;
          if (profile.jobPreferences.expectedSalary.currency !== undefined) user.profile.jobPreferences.expectedSalary.currency = profile.jobPreferences.expectedSalary.currency;
        }
      }
      
      // Update profile visibility
      if (profile.isProfilePublic !== undefined) user.profile.isProfilePublic = profile.isProfilePublic;
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

// @desc    Get full profile view (formatted for display)
// @route   GET /api/jobseeker/profile/view
// @access  Private (Jobseeker only)
router.get('/profile/view', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Format profile data for display
    const profileView = {
      basicInfo: {
        name: user.name,
        email: user.email,
        phone: user.profile.phone || null,
        location: user.profile.location || null,
        profilePicture: user.profile.profilePicture || null,
        memberSince: user.createdAt
      },
      professionalInfo: {
        bio: user.profile.bio || null,
        skills: user.profile.skills || [],
        experience: user.profile.experience || null,
        resume: user.profile.resume || null,
        portfolio: user.profile.portfolio || null
      },
      socialLinks: user.profile.socialLinks || {},
      jobPreferences: {
        jobType: user.profile.jobPreferences?.jobType || null,
        workMode: user.profile.jobPreferences?.workMode || null,
        expectedSalary: user.profile.jobPreferences?.expectedSalary || null,
        availableFrom: user.profile.jobPreferences?.availableFrom || null
      },
      settings: {
        isProfilePublic: user.profile.isProfilePublic || false
      },
      stats: {
        profileCompletion: user.profileCompletion,
        lastUpdated: user.profile.lastUpdated || user.updatedAt
      }
    };

    res.json({
      success: true,
      data: profileView
    });

  } catch (error) {
    console.error('Profile view error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile view'
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
        priority: 'high',
        weight: 15,
        icon: 'user'
      });
    }

    if (!user.profile.skills || user.profile.skills.length === 0) {
      suggestions.push({
        field: 'skills',
        title: 'Add Your Skills',
        description: 'List your technical and soft skills to help employers find you',
        priority: 'high',
        weight: 20,
        icon: 'code'
      });
    }

    if (!user.profile.phone) {
      suggestions.push({
        field: 'phone',
        title: 'Add Contact Number',
        description: 'Provide a phone number for employers to reach you',
        priority: 'medium',
        weight: 10,
        icon: 'phone'
      });
    }

    if (!user.profile.location) {
      suggestions.push({
        field: 'location',
        title: 'Add Your Location',
        description: 'Help employers find local talent by adding your location',
        priority: 'medium',
        weight: 10,
        icon: 'map-pin'
      });
    }

    if (!user.profile.resume) {
      suggestions.push({
        field: 'resume',
        title: 'Upload Your Resume',
        description: 'Upload your resume to make applications easier',
        priority: 'high',
        weight: 15,
        icon: 'file-text'
      });
    }

    if (!user.profile.portfolio) {
      suggestions.push({
        field: 'portfolio',
        title: 'Add Portfolio Link',
        description: 'Showcase your work with a portfolio or personal website',
        priority: 'medium',
        weight: 10,
        icon: 'briefcase'
      });
    }

    if (!user.profile.profilePicture) {
      suggestions.push({
        field: 'profilePicture',
        title: 'Add Profile Picture',
        description: 'Add a professional profile picture to make your profile more personal',
        priority: 'low',
        weight: 5,
        icon: 'camera'
      });
    }

    if (!user.profile.socialLinks || Object.keys(user.profile.socialLinks).length === 0) {
      suggestions.push({
        field: 'socialLinks',
        title: 'Add Social Media Links',
        description: 'Connect your LinkedIn, GitHub, or other professional profiles',
        priority: 'medium',
        weight: 10,
        icon: 'link'
      });
    }

    if (!user.profile.jobPreferences || 
        (!user.profile.jobPreferences.jobType && 
         !user.profile.jobPreferences.workMode && 
         !user.profile.jobPreferences.expectedSalary)) {
      suggestions.push({
        field: 'jobPreferences',
        title: 'Set Job Preferences',
        description: 'Specify your preferred job type, work mode, and salary expectations',
        priority: 'medium',
        weight: 5,
        icon: 'settings'
      });
    }

    if (!user.profile.experience) {
      suggestions.push({
        field: 'experience',
        title: 'Add Experience Level',
        description: 'Let employers know your experience level',
        priority: 'medium',
        weight: 8,
        icon: 'award'
      });
    }

    // Sort suggestions by priority and weight
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    suggestions.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.weight - a.weight;
    });

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

// @desc    Toggle profile visibility
// @route   PATCH /api/jobseeker/profile/visibility
// @access  Private (Jobseeker only)
router.patch('/profile/visibility', async (req, res) => {
  try {
    const { isPublic } = req.body;
    
    if (typeof isPublic !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isPublic must be a boolean value'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.profile.isProfilePublic = isPublic;
    await user.save();

    res.json({
      success: true,
      message: `Profile is now ${isPublic ? 'public' : 'private'}`,
      data: {
        isProfilePublic: user.profile.isProfilePublic
      }
    });

  } catch (error) {
    console.error('Profile visibility toggle error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile visibility'
    });
  }
});

module.exports = router;