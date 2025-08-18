const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

async function testProfileSave() {
  console.log('🧪 Testing Profile Save Functionality...\n');
  
  try {
    // First, login to get a token (you'll need to update these credentials)
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      email: 'test@example.com', // Update with actual jobseeker email
      password: 'testpassword'   // Update with actual password
    });
    
    if (!loginResponse.data.success) {
      console.log('❌ Login failed. Please update the test credentials.');
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Test profile save
    const profileData = {
      name: 'Test User Updated',
      profile: {
        phone: '+1234567890',
        location: 'New York, NY',
        skills: ['JavaScript', 'React', 'Node.js'],
        education: [{
          id: Date.now(),
          degree: 'Bachelor of Science',
          institution: 'Test University',
          year: '2020',
          field: 'Computer Science'
        }],
        workExperience: [{
          id: Date.now(),
          title: 'Software Developer',
          company: 'Test Company',
          startDate: '2020-01',
          endDate: '2023-01',
          current: false,
          description: 'Developed web applications'
        }],
        jobTitles: ['Software Developer', 'Full Stack Developer'],
        jobTypes: ['Full-time', 'Remote'],
        workSchedule: ['Day shift', 'Flexible hours'],
        minimumBasePay: '$70000',
        remotePreferences: 'Remote',
        readyToWork: true
      }
    };
    
    console.log('📤 Sending profile update...');
    
    const response = await axios.put('http://localhost:5001/api/jobseeker/profile', profileData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log('✅ Profile saved successfully!');
      console.log('📊 Profile completion:', response.data.data.profileCompletion + '%');
      console.log('📝 Updated fields:');
      console.log('   - Name:', response.data.data.user.name);
      console.log('   - Phone:', response.data.data.user.profile.phone);
      console.log('   - Location:', response.data.data.user.profile.location);
      console.log('   - Skills:', response.data.data.user.profile.skills.length, 'skills');
      console.log('   - Education:', response.data.data.user.profile.education?.length || 0, 'entries');
      console.log('   - Work Experience:', response.data.data.user.profile.workExperience?.length || 0, 'entries');
      console.log('   - Job Titles:', response.data.data.user.profile.jobTitles?.length || 0, 'titles');
    } else {
      console.log('❌ Profile save failed:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Error testing profile save:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Message:', error.response.data?.message);
      console.error('   Details:', error.response.data);
    } else {
      console.error('   ', error.message);
    }
  }
}

console.log('⚠️  IMPORTANT: Update the login credentials in this test file before running!');
console.log('   - Line 12: Update email with actual jobseeker email');
console.log('   - Line 13: Update password with actual password\n');

// Uncomment the line below after updating credentials
// testProfileSave();