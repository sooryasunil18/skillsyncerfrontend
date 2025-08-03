const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const debugAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsyncer');
    console.log('Connected to MongoDB');

    const adminEmail = 'sooryasunilsree18@gmail.com';
    const adminPassword = 'suryasunil@18';

    console.log('🔍 Testing bcrypt directly...');
    
    // Test bcrypt directly
    const salt = await bcrypt.genSalt(10);
    console.log('Salt generated:', salt);
    
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    console.log('Hashed password:', hashedPassword);
    
    const directComparison = await bcrypt.compare(adminPassword, hashedPassword);
    console.log('Direct bcrypt comparison:', directComparison ? '✅ Works' : '❌ Failed');

    // Delete existing admin user and create fresh
    console.log('🗑️ Removing existing admin user...');
    await User.deleteOne({ email: adminEmail });
    
    console.log('👤 Creating fresh admin user...');
    const adminUser = new User({
      name: 'Soorya Sunil',
      email: adminEmail,
      password: adminPassword, // Let the pre-save middleware handle hashing
      role: 'admin',
      isActive: true,
      isVerified: true,
      profile: {
        bio: 'System Administrator',
        location: 'System',
        phone: '+1234567890'
      }
    });

    await adminUser.save();
    console.log('✅ Fresh admin user created');

    // Test login immediately
    const freshUser = await User.findOne({ email: adminEmail }).select('+password');
    console.log('🔍 Fresh user found:', freshUser ? 'Yes' : 'No');
    
    if (freshUser) {
      console.log('- Password hash length:', freshUser.password.length);
      console.log('- Password starts with $2a$ or $2b$:', freshUser.password.startsWith('$2a$') || freshUser.password.startsWith('$2b$'));
      
      const passwordTest = await freshUser.comparePassword(adminPassword);
      console.log('- Password comparison result:', passwordTest ? '✅ Success' : '❌ Failed');
      
      // Try manual comparison
      const manualTest = await bcrypt.compare(adminPassword, freshUser.password);
      console.log('- Manual bcrypt comparison:', manualTest ? '✅ Success' : '❌ Failed');
    }

    console.log('\n🎯 Admin Login Details:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugAdminUser();
