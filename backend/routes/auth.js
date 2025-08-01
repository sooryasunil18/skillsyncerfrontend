const express = require('express');
const User = require('../models/User');
const { generateToken, protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Test registration data
// @route   POST /api/auth/test-register
// @access  Public
router.post('/test-register', (req, res) => {
  console.log('Test registration data received:', req.body);
  res.json({
    success: true,
    message: 'Data received successfully',
    received: req.body
  });
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'jobseeker' } = req.body;

    console.log('Registration attempt:', { name, email, role, hasPassword: !!password });

    // Validation
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    if (!name.trim() || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Calculate initial profile completion
    user.calculateProfileCompletion();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = await User.findById(user._id).select('-password');

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token,
        profileCompletion: userResponse.profileCompletion
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @desc    Register company/employer
// @route   POST /api/auth/register-company
// @access  Public
router.post('/register-company', async (req, res) => {
  try {
    const { companyName, email, phone, industry, password } = req.body;

    console.log('Company registration attempt:', { companyName, email, industry, hasPassword: !!password });

    // Validation
    if (!companyName || !email || !password || !phone || !industry) {
      console.log('Missing required fields:', { 
        companyName: !!companyName, 
        email: !!email, 
        password: !!password, 
        phone: !!phone, 
        industry: !!industry 
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide company name, email, phone, industry, and password'
      });
    }

    if (!companyName.trim() || companyName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Company name must be at least 2 characters long'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if company already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Company already exists with this email'
      });
    }

    // Create company user
    const user = await User.create({
      name: companyName,
      email,
      password,
      role: 'employer',
      company: {
        name: companyName,
        phone,
        industry,
        email
      }
    });

    // Calculate initial profile completion
    user.calculateProfileCompletion();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      data: {
        user: {
          id: user._id,
          companyName: user.name,
          email: user.email,
          role: user.role,
          industry: user.company.industry,
          profileCompletion: user.profileCompletion
        }
      }
    });

  } catch (error) {
    console.error('Company registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      return res.status(400).json({
        success: false,
        message: 'Company already exists with this email address'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.log('Validation errors:', errors);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during company registration'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user._id);

    // Get user without password
    const userResponse = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
        profileCompletion: userResponse.profileCompletion
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
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
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user data'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields based on role
    const { name, profile, company } = req.body;

    if (name) user.name = name;

    if (user.role === 'jobseeker' && profile) {
      if (profile.bio !== undefined) user.profile.bio = profile.bio;
      if (profile.skills !== undefined) user.profile.skills = profile.skills;
      if (profile.experience !== undefined) user.profile.experience = profile.experience;
      if (profile.location !== undefined) user.profile.location = profile.location;
      if (profile.phone !== undefined) user.profile.phone = profile.phone;
      if (profile.resume !== undefined) user.profile.resume = profile.resume;
      if (profile.portfolio !== undefined) user.profile.portfolio = profile.portfolio;
    }

    if (user.role === 'employer' && company) {
      if (company.name !== undefined) user.company.name = company.name;
      if (company.description !== undefined) user.company.description = company.description;
      if (company.website !== undefined) user.company.website = company.website;
      if (company.location !== undefined) user.company.location = company.location;
      if (company.size !== undefined) user.company.size = company.size;
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

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current password and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;