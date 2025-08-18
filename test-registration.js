const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testRegistration() {
  try {
    console.log('🔧 Testing user registration...');
    
    const userData = {
      name: 'Test Jobseeker',
      email: 'test.jobseeker@example.com',
      password: 'Password123!',
      role: 'jobseeker'
    };

    console.log('Registering user:', userData.email);
    
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    
    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.log('❌ Registration failed:', error.response?.data?.message || error.message);
    
    if (error.response?.data) {
      console.log('Error details:', error.response.data);
    }
    
    return null;
  }
}

async function testLogin() {
  try {
    console.log('\n🔧 Testing user login...');
    
    const loginData = {
      email: 'test.jobseeker@example.com',
      password: 'Password123!'
    };

    console.log('Logging in user:', loginData.email);
    
    const response = await axios.post(`${BASE_URL}/auth/login`, loginData);
    
    console.log('✅ Login successful!');
    console.log('Token received:', !!response.data.token);
    console.log('User data:', response.data.user);
    
    return response.data.token;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testJobseekerEndpoint(token) {
  try {
    console.log('\n🔧 Testing jobseeker endpoint...');
    
    const response = await axios.get(`${BASE_URL}/jobseeker/test`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Jobseeker endpoint works!');
    console.log('Response:', response.data);
    
    return true;
  } catch (error) {
    console.log('❌ Jobseeker endpoint failed:', error.response?.data?.message || error.message);
    if (error.response?.status === 404) {
      console.log('💡 This suggests the /api/jobseeker/test route is not found');
    }
    return false;
  }
}

async function testProfileSave(token) {
  try {
    console.log('\n🔧 Testing profile save endpoint...');
    
    const profileData = {
      personalInfo: {
        bio: 'Test bio for profile save',
        profilePicture: null
      },
      skills: {
        technical: [
          { name: 'JavaScript', level: 'advanced', yearsOfExperience: 3 }
        ]
      }
    };
    
    const response = await axios.post(`${BASE_URL}/jobseeker/profile/extended`, profileData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Profile save works!');
    console.log('Response:', response.data.message);
    
    return true;
  } catch (error) {
    console.log('❌ Profile save failed:', error.response?.data?.message || error.message);
    console.log('Status:', error.response?.status);
    if (error.response?.status === 404) {
      console.log('💡 This suggests the /api/jobseeker/profile/extended route is not found');
    }
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Registration and Authentication Tests...\n');

  // Test registration
  const registrationResult = await testRegistration();
  
  // Test login
  const token = await testLogin();
  
  if (token) {
    // Test jobseeker endpoint
    await testJobseekerEndpoint(token);
    
    // Test profile save
    await testProfileSave(token);
  }
  
  console.log('\n🎉 Tests completed!');
}

runTests().catch(error => {
  console.error('Test runner error:', error.message);
  process.exit(1);
});