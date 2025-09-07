const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:5001/api';
let authToken = '';
let jobseekerId = '';
let employerToken = '';
let adminToken = '';

// Test data
const testJobseeker = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  role: 'jobseeker'
};

const testEmployer = {
  name: 'Jane Smith',
  email: 'jane.smith@company.com',
  password: 'password123',
  role: 'company'
};

const profileUpdateData = {
  name: 'John Doe Updated',
  profile: {
    bio: 'Experienced software developer with 5+ years in full-stack development. Passionate about creating scalable web applications and learning new technologies.',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'AWS'],
    experience: '3-5',
    location: 'San Francisco, CA',
    phone: '+1234567890',
    resume: 'https://example.com/resume.pdf',
    portfolio: 'https://johndoe.dev',
    profilePicture: 'https://example.com/profile.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
      website: 'https://johndoe.dev'
    },
    jobPreferences: {
      jobType: 'full-time',
      workMode: 'hybrid',
      expectedSalary: {
        min: 80000,
        max: 120000,
        currency: 'USD'
      },
      availableFrom: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    isProfilePublic: true
  }
};

// Helper function to make authenticated requests
const makeRequest = async (method, url, data = null, token = authToken) => {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      data
    };
    
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status
    };
  }
};

// Test functions
const testRegisterJobseeker = async () => {
  console.log('\n🔹 Testing Jobseeker Registration...');
  const result = await makeRequest('POST', '/auth/register', testJobseeker, null);
  
  if (result.success) {
    authToken = result.data.data.token;
    jobseekerId = result.data.data.user._id;
    console.log('✅ Jobseeker registered successfully');
    console.log(`   User ID: ${jobseekerId}`);
  } else {
    console.log('❌ Registration failed:', result.error.message);
  }
  
  return result.success;
};

const testRegisterEmployer = async () => {
  console.log('\n🔹 Testing Employer Registration...');
  const result = await makeRequest('POST', '/auth/register', testEmployer, null);
  
  if (result.success) {
    employerToken = result.data.data.token;
    console.log('✅ Employer registered successfully');
  } else {
    console.log('❌ Employer registration failed:', result.error.message);
  }
  
  return result.success;
};

const testGetProfile = async () => {
  console.log('\n🔹 Testing Get Profile...');
  const result = await makeRequest('GET', '/jobseeker/profile');
  
  if (result.success) {
    console.log('✅ Profile retrieved successfully');
    console.log(`   Profile completion: ${result.data.data.profileCompletion}%`);
  } else {
    console.log('❌ Get profile failed:', result.error.message);
  }
  
  return result.success;
};

const testUpdateProfile = async () => {
  console.log('\n🔹 Testing Profile Update...');
  const result = await makeRequest('PUT', '/jobseeker/profile', profileUpdateData);
  
  if (result.success) {
    console.log('✅ Profile updated successfully');
    console.log(`   New profile completion: ${result.data.data.profileCompletion}%`);
    console.log(`   Updated name: ${result.data.data.user.name}`);
    console.log(`   Skills: ${result.data.data.user.profile.skills.join(', ')}`);
  } else {
    console.log('❌ Profile update failed:', result.error.message);
    if (result.error.errors) {
      console.log('   Validation errors:', result.error.errors);
    }
  }
  
  return result.success;
};

const testGetProfileSuggestions = async () => {
  console.log('\n🔹 Testing Profile Suggestions...');
  const result = await makeRequest('GET', '/jobseeker/profile-suggestions');
  
  if (result.success) {
    console.log('✅ Profile suggestions retrieved successfully');
    console.log(`   Total suggestions: ${result.data.data.totalSuggestions}`);
    result.data.data.suggestions.forEach((suggestion, index) => {
      console.log(`   ${index + 1}. ${suggestion.title} (${suggestion.priority})`);
    });
  } else {
    console.log('❌ Get suggestions failed:', result.error.message);
  }
  
  return result.success;
};

const testToggleProfileVisibility = async () => {
  console.log('\n🔹 Testing Profile Visibility Toggle...');
  const result = await makeRequest('PATCH', '/jobseeker/profile/visibility', { isPublic: false });
  
  if (result.success) {
    console.log('✅ Profile visibility updated successfully');
    console.log(`   Profile is now: ${result.data.data.isProfilePublic ? 'Public' : 'Private'}`);
  } else {
    console.log('❌ Toggle visibility failed:', result.error.message);
  }
  
  return result.success;
};

const testViewProfileAsEmployer = async () => {
  console.log('\n🔹 Testing View Profile as Employer...');
  
  // First make profile public
  await makeRequest('PATCH', '/jobseeker/profile/visibility', { isPublic: true });
  
  const result = await makeRequest('GET', `/jobseeker/view/${jobseekerId}`, null, employerToken);
  
  if (result.success) {
    console.log('✅ Profile viewed by employer successfully');
    console.log(`   Jobseeker name: ${result.data.data.jobseeker.name}`);
    console.log(`   Can contact: ${result.data.data.canContact}`);
    console.log(`   Viewer role: ${result.data.data.viewerRole}`);
  } else {
    console.log('❌ View profile as employer failed:', result.error.message);
  }
  
  return result.success;
};

const testSearchJobseekers = async () => {
  console.log('\n🔹 Testing Search Jobseekers...');
  const result = await makeRequest('GET', '/jobseeker/search?skills=JavaScript,React&experience=3-5&location=San Francisco', null, employerToken);
  
  if (result.success) {
    console.log('✅ Jobseeker search successful');
    console.log(`   Found ${result.data.data.jobseekers.length} jobseekers`);
    console.log(`   Total count: ${result.data.data.pagination.totalCount}`);
  } else {
    console.log('❌ Search jobseekers failed:', result.error.message);
  }
  
  return result.success;
};

const testGetDashboard = async () => {
  console.log('\n🔹 Testing Dashboard...');
  const result = await makeRequest('GET', '/jobseeker/dashboard');
  
  if (result.success) {
    console.log('✅ Dashboard retrieved successfully');
    console.log(`   Profile completion: ${result.data.data.profile.completionPercentage}%`);
    console.log(`   Skills count: ${result.data.data.profile.skills.length}`);
  } else {
    console.log('❌ Get dashboard failed:', result.error.message);
  }
  
  return result.success;
};

const testGetStats = async () => {
  console.log('\n🔹 Testing Stats...');
  const result = await makeRequest('GET', '/jobseeker/stats');
  
  if (result.success) {
    console.log('✅ Stats retrieved successfully');
    console.log(`   Profile views: ${result.data.data.profileViews}`);
    console.log(`   Profile completion: ${result.data.data.profileCompletion}%`);
  } else {
    console.log('❌ Get stats failed:', result.error.message);
  }
  
  return result.success;
};

const testInvalidProfileUpdate = async () => {
  console.log('\n🔹 Testing Invalid Profile Update...');
  const invalidData = {
    profile: {
      bio: 'A'.repeat(600), // Too long
      skills: 'invalid', // Should be array
      experience: 'invalid-experience',
      phone: 'invalid-phone',
      socialLinks: {
        linkedin: 'invalid-url'
      }
    }
  };
  
  const result = await makeRequest('PUT', '/jobseeker/profile', invalidData);
  
  if (!result.success && result.error.errors) {
    console.log('✅ Validation working correctly');
    console.log('   Validation errors caught:', result.error.errors.length);
  } else {
    console.log('❌ Validation should have failed');
  }
  
  return !result.success;
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting Jobseeker Profile API Tests...');
  console.log('=' .repeat(50));
  
  const tests = [
    { name: 'Register Jobseeker', fn: testRegisterJobseeker },
    { name: 'Register Employer', fn: testRegisterEmployer },
    { name: 'Get Initial Profile', fn: testGetProfile },
    { name: 'Get Initial Suggestions', fn: testGetProfileSuggestions },
    { name: 'Update Profile', fn: testUpdateProfile },
    { name: 'Get Updated Suggestions', fn: testGetProfileSuggestions },
    { name: 'Toggle Profile Visibility', fn: testToggleProfileVisibility },
    { name: 'View Profile as Employer', fn: testViewProfileAsEmployer },
    { name: 'Search Jobseekers', fn: testSearchJobseekers },
    { name: 'Get Dashboard', fn: testGetDashboard },
    { name: 'Get Stats', fn: testGetStats },
    { name: 'Test Invalid Update', fn: testInvalidProfileUpdate }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} threw an error:`, error.message);
      failed++;
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your jobseeker profile API is working perfectly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the error messages above.');
  }
};

// Check if server is running
const checkServer = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running');
    return true;
  } catch (error) {
    console.log('❌ Server is not running. Please start the server first.');
    console.log('   Run: npm run dev (in the backend directory)');
    return false;
  }
};

// Run the tests
const main = async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
};

main().catch(console.error);