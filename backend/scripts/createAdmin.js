const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillsyncer');
    console.log('Connected to MongoDB');

    // Admin user details
    const adminEmail = 'sooryasunilsree18@gmail.com';
    const adminPassword = 'suryasunil@18';
    const adminName = 'Soorya Sunil';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      
      // Update the existing user to ensure it has admin role and correct password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      existingAdmin.name = adminName;
      await existingAdmin.save();
      
      console.log('Admin user updated successfully');
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const adminUser = new User({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        profile: {
          bio: 'System Administrator',
          location: 'System',
          phone: '+1234567890'
        }
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    }

    console.log('Admin Details:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
