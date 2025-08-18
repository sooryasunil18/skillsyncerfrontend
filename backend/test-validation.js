const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

async function testValidation() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Test data similar to what frontend sends
    const testData = {
      name: 'Test User Updated',
      email: 'test@example.com',
      role: 'jobseeker',
      profile: {
        phone: '+1234567890',
        location: 'New York, NY',
        skills: ['JavaScript', 'React'],
        education: [{
          id: 1641234567890,
          degree: 'Bachelor of Science',
          institution: 'Test University',
          year: '2020',
          field: 'Computer Science'
        }],
        workExperience: [{
          id: 1641234567891,
          title: 'Software Developer',
          company: 'Test Company',
          startDate: '2020-01',
          endDate: '2023-01',
          current: false,
          description: 'Developed web applications'
        }],
        certifications: [],
        jobTitles: ['Software Developer'],
        jobTypes: ['Full-time'],
        workSchedule: ['Day shift'],
        minimumBasePay: '$70000',
        relocationPreferences: [],
        remotePreferences: 'Remote',
        readyToWork: true
      }
    };
    
    console.log('\n🧪 Testing user validation...');
    
    // Create a new user instance
    const user = new User(testData);
    
    // Try to validate
    try {
      await user.validate();
      console.log('✅ User validation passed!');
      
      // Try to save
      await user.save();
      console.log('✅ User saved successfully!');
      
      // Clean up - remove test user
      await User.findByIdAndDelete(user._id);
      console.log('🧹 Test user cleaned up');
      
    } catch (validationError) {
      console.log('\n❌ Validation failed:');
      console.log('Error name:', validationError.name);
      console.log('Error message:', validationError.message);
      
      if (validationError.errors) {
        console.log('\n📋 Specific validation errors:');
        Object.keys(validationError.errors).forEach((key, index) => {
          const error = validationError.errors[key];
          console.log(`   ${index + 1}. Field: ${key}`);
          console.log(`      Message: ${error.message}`);
          console.log(`      Value: ${error.value}`);
          console.log(`      Kind: ${error.kind}`);
          console.log('');
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

testValidation();