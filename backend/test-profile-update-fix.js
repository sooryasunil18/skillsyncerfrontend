const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

async function testProfileUpdate() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Step 1: Create a user with password first (simulating registration)
    console.log('\n🔧 Creating test user with password...');
    const testUser = new User({
      name: 'Test User',
      email: 'profile-test@example.com',
      password: 'testpassword123',
      role: 'jobseeker'
    });
    
    await testUser.save();
    console.log('✅ Test user created with ID:', testUser._id);
    
    // Step 2: Now update just the profile (like the frontend does)
    console.log('\n📝 Testing profile update...');
    
    const user = await User.findById(testUser._id);
    
    // Update profile fields (without touching password)
    user.name = 'Updated Test User';
    user.profile.phone = '+1234567890';
    user.profile.location = 'New York, NY';
    user.profile.skills = ['JavaScript', 'React', 'Node.js'];
    user.profile.education = [{
      id: 1641234567890,
      degree: 'Bachelor of Science',
      institution: 'Test University',
      year: '2020',
      field: 'Computer Science'
    }];
    user.profile.workExperience = [{
      id: 1641234567891,
      title: 'Software Developer',
      company: 'Test Company',
      startDate: '2020-01',
      endDate: '2023-01',
      current: false,
      description: 'Developed web applications'
    }];
    user.profile.jobTitles = ['Software Developer'];
    user.profile.jobTypes = ['Full-time'];
    user.profile.readyToWork = true;
    
    // Calculate profile completion
    user.calculateProfileCompletion();
    
    try {
      // Save with validateModifiedOnly (the fix)
      await user.save({ validateModifiedOnly: true });
      console.log('✅ Profile update successful!');
      console.log('📊 Profile completion:', user.profileCompletion + '%');
      console.log('📝 Updated fields:');
      console.log('   - Name:', user.name);
      console.log('   - Phone:', user.profile.phone);
      console.log('   - Skills:', user.profile.skills.length, 'skills');
      console.log('   - Education entries:', user.profile.education.length);
      console.log('   - Work experience entries:', user.profile.workExperience.length);
      
    } catch (updateError) {
      console.log('\n❌ Profile update failed:');
      console.log('Error:', updateError.message);
      if (updateError.errors) {
        Object.keys(updateError.errors).forEach(key => {
          console.log(`   - ${key}: ${updateError.errors[key].message}`);
        });
      }
    }
    
    // Cleanup
    await User.findByIdAndDelete(testUser._id);
    console.log('🧹 Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

testProfileUpdate();