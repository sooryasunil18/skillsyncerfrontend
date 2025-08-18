const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testProfileUpdate() {
  console.log('🧪 Testing Profile Update...\n');
  
  try {
    // First, login to get a token
    console.log('🔐 Attempting login...');
    
    // You'll need to update these credentials with actual ones
    const loginData = {
      email: 'test@example.com', // UPDATE THIS
      password: 'testpassword'    // UPDATE THIS
    };
    
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', loginData);
    
    if (!loginResponse.data.success) {
      console.log('❌ Login failed:', loginResponse.data.message);
      console.log('⚠️  Please update the credentials in this test file');
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    console.log('👤 User:', loginResponse.data.user.name, '(' + loginResponse.data.user.email + ')');
    
    // Test the exact profile update request that frontend sends
    const profileData = {
      name: 'Test User Updated',
      profile: {
        phone: '+1234567890',
        location: 'New York, NY',
        resume: null,
        education: [{
          id: 1641234567890,
          degree: 'Bachelor of Science',
          institution: 'Test University',
          year: '2020',
          field: 'Computer Science'
        }],
        skills: ['JavaScript', 'React', 'Node.js'],
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
    
    console.log('\n📤 Sending profile update...');
    console.log('📝 Data structure:', {
      name: profileData.name,
      profileKeys: Object.keys(profileData.profile),
      educationCount: profileData.profile.education?.length || 0,
      workExperienceCount: profileData.profile.workExperience?.length || 0,
      skillsCount: profileData.profile.skills?.length || 0
    });
    
    const response = await axios.put('http://localhost:5001/api/jobseeker/profile', profileData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Profile update successful!');
    console.log('📊 Response:', response.data);
    
  } catch (error) {
    console.error('\n❌ Error occurred:');
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data?.message);
      console.error('   Full response:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.data?.errors) {
        console.error('   Validation errors:');
        error.response.data.errors.forEach((err, index) => {
          console.error(`     ${index + 1}. Field: ${err.field}, Message: ${err.message}`);
        });
      }
    } else {
      console.error('   Error:', error.message);
    }
  }
}

console.log('⚠️  IMPORTANT: Update the login credentials before running!');
console.log('   - Line 15: Update email with actual jobseeker email');
console.log('   - Line 16: Update password with actual password');
console.log('\nTo run this test:');
console.log('   1. Update credentials above');
console.log('   2. Uncomment the line below');
console.log('   3. Run: node test-profile-update.js\n');

// Uncomment after updating credentials:
// testProfileUpdate();