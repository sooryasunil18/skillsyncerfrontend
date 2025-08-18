// Simple test script to check API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`)
};

let authToken = null;

async function testHealthCheck() {
  try {
    log.info('Testing health check endpoint...');
    const response = await axios.get(`${BASE_URL}/health`);
    log.success('Health check passed');
    console.log('Health data:', response.data);
    return true;
  } catch (error) {
    log.error(`Health check failed: ${error.message}`);
    return false;
  }
}

async function loginUser() {
  try {
    log.info('Attempting to login...');
    
    // First try to register if user doesn't exist
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
        name: 'Test Jobseeker',
        email: 'test@example.com',
        password: 'password123',
        role: 'jobseeker'
      });
      log.success('User registered successfully');
    } catch (registerError) {
      log.warning('User might already exist, continuing with login...');
    }

    // Now try to login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });

    authToken = loginResponse.data.token;
    log.success('Login successful');
    return true;
  } catch (error) {
    log.error(`Login failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testJobseekerEndpoints() {
  if (!authToken) {
    log.error('No auth token available for jobseeker tests');
    return;
  }

  const headers = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  };

  // Test jobseeker test endpoint
  try {
    log.info('Testing jobseeker test endpoint...');
    const response = await axios.get(`${BASE_URL}/jobseeker/test`, { headers });
    log.success('Jobseeker test endpoint works');
    console.log('Test response:', response.data);
  } catch (error) {
    log.error(`Jobseeker test endpoint failed: ${error.response?.data?.message || error.message}`);
  }

  // Test dashboard endpoint
  try {
    log.info('Testing jobseeker dashboard endpoint...');
    const response = await axios.get(`${BASE_URL}/jobseeker/dashboard`, { headers });
    log.success('Dashboard endpoint works');
    console.log('Dashboard data keys:', Object.keys(response.data.data || {}));
  } catch (error) {
    log.error(`Dashboard endpoint failed: ${error.response?.data?.message || error.message}`);
  }

  // Test profile complete endpoint
  try {
    log.info('Testing complete profile endpoint...');
    const response = await axios.get(`${BASE_URL}/jobseeker/profile/complete`, { headers });
    log.success('Complete profile endpoint works');
    console.log('Profile data keys:', Object.keys(response.data.data || {}));
  } catch (error) {
    log.error(`Complete profile endpoint failed: ${error.response?.data?.message || error.message}`);
  }

  // Test profile extended save endpoint
  try {
    log.info('Testing extended profile save endpoint...');
    
    const testProfileData = {
      personalInfo: {
        bio: 'This is a test bio for API testing.',
        profilePicture: null,
      },
      skills: {
        technical: [
          { name: 'JavaScript', level: 'advanced', yearsOfExperience: 3 },
          { name: 'React', level: 'intermediate', yearsOfExperience: 2 }
        ],
        soft: ['Communication', 'Problem Solving']
      },
      education: [{
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        institution: 'Test University',
        startDate: new Date('2020-09-01'),
        endDate: new Date('2024-06-01'),
        currentlyStudying: false
      }],
      jobPreferences: {
        jobTitles: ['Frontend Developer', 'Full Stack Developer'],
        jobTypes: ['full-time'],
        workMode: 'remote',
        expectedSalary: {
          min: 50000,
          max: 70000,
          currency: 'USD'
        }
      },
      profileSettings: {
        isPublic: true,
        profileSearchable: true
      }
    };

    const response = await axios.post(`${BASE_URL}/jobseeker/profile/extended`, testProfileData, { headers });
    log.success('Extended profile save works');
    console.log('Save response:', response.data.message);
    console.log('Profile completion:', response.data.data?.profileCompletion);
  } catch (error) {
    log.error(`Extended profile save failed: ${error.response?.data?.message || error.message}`);
    if (error.response?.data?.errors) {
      console.log('Validation errors:', error.response.data.errors);
    }
  }

  // Test profile view endpoint
  try {
    log.info('Testing profile view endpoint...');
    const response = await axios.get(`${BASE_URL}/jobseeker/profile/view`, { headers });
    log.success('Profile view endpoint works');
    console.log('Profile view keys:', Object.keys(response.data.data?.profile || {}));
  } catch (error) {
    log.error(`Profile view endpoint failed: ${error.response?.data?.message || error.message}`);
  }
}

async function runTests() {
  console.log('\n🚀 Starting SkillSyncer API Tests...\n');

  // Test health check
  const healthOk = await testHealthCheck();
  console.log('');

  if (!healthOk) {
    log.error('Health check failed - make sure backend server is running on port 5001');
    return;
  }

  // Test authentication
  const loginOk = await loginUser();
  console.log('');

  if (!loginOk) {
    log.error('Authentication failed - cannot proceed with protected endpoint tests');
    return;
  }

  // Test jobseeker endpoints
  await testJobseekerEndpoints();
  
  console.log('\n🎉 API tests completed!');
  console.log('\nIf you saw ✅ for most tests, your backend is working correctly!');
  console.log('If you saw ❌ errors, check the server logs and fix the issues.\n');
}

// Handle graceful shutdown
process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run tests
runTests().catch(error => {
  log.error('Test runner failed:', error.message);
  process.exit(1);
});