const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['jobseeker', 'employer', 'mentor', 'admin'],
    default: 'jobseeker',
    required: true
  },
  // Jobseeker and Mentor specific fields
  profile: {
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    skills: [{
      type: String,
      trim: true
    }],
    experience: {
      type: String,
      enum: ['fresher', '0-1', '1-3', '3-5', '5-10', '10+'],
      default: 'fresher'
    },
    location: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    resume: {
      type: String, // URL to resume file
    },
    portfolio: {
      type: String, // URL to portfolio
    },
    // Mentor specific fields
    expertise: {
      type: String,
      trim: true
    }
  },
  // Employer specific fields
  company: {
    name: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      maxlength: [500, 'Company description cannot exceed 500 characters']
    },
    industry: {
      type: String,
      enum: ['technology', 'healthcare', 'finance', 'education', 'retail', 'manufacturing', 'consulting', 'media', 'real-estate', 'automotive', 'food', 'nonprofit', 'government', 'other'],
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  profileCompletion: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completion
userSchema.methods.calculateProfileCompletion = function() {
  let completion = 0;
  let totalFields = 6; // Default for employer
  
  if (this.role === 'jobseeker') {
    totalFields = 8;
  } else if (this.role === 'mentor') {
    totalFields = 7;
  }
  
  // Basic fields (common for all)
  if (this.name) completion++;
  if (this.email) completion++;
  
  if (this.role === 'jobseeker') {
    if (this.profile.bio) completion++;
    if (this.profile.skills && this.profile.skills.length > 0) completion++;
    if (this.profile.experience) completion++;
    if (this.profile.location) completion++;
    if (this.profile.phone) completion++;
    if (this.profile.resume) completion++;
  } else if (this.role === 'mentor') {
    if (this.profile.bio) completion++;
    if (this.profile.expertise) completion++;
    if (this.profile.experience) completion++;
    if (this.profile.location) completion++;
    if (this.profile.phone) completion++;
  } else if (this.role === 'employer') {
    if (this.company.name) completion++;
    if (this.company.description) completion++;
    if (this.company.location) completion++;
    if (this.company.website) completion++;
  }
  
  this.profileCompletion = Math.round((completion / totalFields) * 100);
  return this.profileCompletion;
};

// Update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Index for better query performance
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);