const API_BASE_URL = 'http://localhost:5001';

// Helper function to make API requests
const makeRequest = async (method, endpoint, data = null, token = null) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    console.log(`🔄 ${method} ${url}`);
    const response = await fetch(url, options);
    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result.data || result };
    } else {
      return { success: false, error: result };
    }
  } catch (error) {
    return { success: false, error: { message: error.message } };
  }
};

// Test data
const testInternship = {
  title: 'Software Developer',
  industry: 'IT/Technology',
  location: 'Mumbai, Maharashtra',
  mode: 'Offline',
  startDate: '2024-06-01',
  lastDateToApply: '2024-05-15',
  duration: '3 months',
  totalSeats: 5,
  description: 'We are looking for talented software developers to join our team. You will work on real projects, learn modern technologies, and gain hands-on experience in a professional environment.',
  skillsRequired: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
  certifications: ['AWS Certified Developer', 'MongoDB Developer Certificate'],
  eligibility: 'Students in 3rd or 4th year of Computer Science or related fields. Recent graduates are also welcome to apply.',
  stipend: {
    amount: 15000,
    currency: 'INR',
    type: 'Fixed'
  },
  benefits: ['Certificate of Completion', 'Letter of Recommendation', 'Potential Job Offer']
};

let employerToken = '';

// Test functions
const testHealthCheck = async () => {
  console.log('\n🔹 Testing Health Check...');
  const result = await makeRequest('GET', '/api/health');
  
  if (result.success) {
    console.log('✅ Health check successful');
    console.log('📊 Database status:', result.data.database);
  } else {
    console.log('❌ Health check failed:', result.error.message);
  }
};

const testEmployerLogin = async () => {
  console.log('\n🔹 Testing Employer Login...');
  const loginData = {
    email: 'test@employer.com',
    password: 'Password123'
  };
  
  const result = await makeRequest('POST', '/api/auth/login', loginData);
  
  if (result.success) {
    employerToken = result.data.token;
    console.log('✅ Employer login successful');
    console.log('🔑 Token received');
  } else {
    console.log('❌ Employer login failed:', result.error.message);
  }
};

const testGetInternshipTitles = async () => {
  console.log('\n🔹 Testing Get Internship Titles...');
  const result = await makeRequest('GET', '/api/employer/internship-titles?industry=IT/Technology', null, employerToken);
  
  if (result.success) {
    console.log('✅ Internship titles retrieved successfully');
    console.log('📋 Titles count:', result.data.length);
    console.log('📋 Sample titles:', result.data.slice(0, 3));
  } else {
    console.log('❌ Get internship titles failed:', result.error.message);
  }
};

const testGetIndiaLocations = async () => {
  console.log('\n🔹 Testing Get India Locations...');
  const result = await makeRequest('GET', '/api/employer/india-locations', null, employerToken);
  
  if (result.success) {
    console.log('✅ India locations retrieved successfully');
    console.log('📍 Locations count:', result.data.length);
    console.log('📍 Sample locations:', result.data.slice(0, 3));
  } else {
    console.log('❌ Get India locations failed:', result.error.message);
  }
};

const testCreateInternship = async () => {
  console.log('\n🔹 Testing Create Internship...');
  const result = await makeRequest('POST', '/api/employer/internships', testInternship, employerToken);
  
  if (result.success) {
    console.log('✅ Internship created successfully');
    console.log('🆔 Internship ID:', result.data._id);
    console.log('📝 Title:', result.data.title);
    return result.data._id;
  } else {
    console.log('❌ Create internship failed:', result.error.message);
    return null;
  }
};

const testGetInternships = async () => {
  console.log('\n🔹 Testing Get Internships...');
  const result = await makeRequest('GET', '/api/employer/internships', null, employerToken);
  
  if (result.success) {
    console.log('✅ Internships retrieved successfully');
    console.log('📊 Total internships:', result.data.length);
    if (result.data.length > 0) {
      console.log('📝 Latest internship:', result.data[0].title);
    }
  } else {
    console.log('❌ Get internships failed:', result.error.message);
  }
};

const testUpdateInternship = async (internshipId) => {
  if (!internshipId) {
    console.log('⚠️ Skipping update test - no internship ID available');
    return;
  }
  
  console.log('\n🔹 Testing Update Internship...');
  const updateData = {
    ...testInternship,
    title: 'Updated Software Development Intern',
    description: 'Updated description for the internship position.'
  };
  
  const result = await makeRequest('PUT', `/api/employer/internships/${internshipId}`, updateData, employerToken);
  
  if (result.success) {
    console.log('✅ Internship updated successfully');
    console.log('📝 Updated title:', result.data.title);
  } else {
    console.log('❌ Update internship failed:', result.error.message);
  }
};

const testDeleteInternship = async (internshipId) => {
  if (!internshipId) {
    console.log('⚠️ Skipping delete test - no internship ID available');
    return;
  }
  
  console.log('\n🔹 Testing Delete Internship...');
  const result = await makeRequest('DELETE', `/api/employer/internships/${internshipId}`, null, employerToken);
  
  if (result.success) {
    console.log('✅ Internship deleted successfully');
  } else {
    console.log('❌ Delete internship failed:', result.error.message);
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting Internship API Tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Employer Login', fn: testEmployerLogin },
    { name: 'Get Internship Titles', fn: testGetInternshipTitles },
    { name: 'Get India Locations', fn: testGetIndiaLocations },
    { name: 'Create Internship', fn: testCreateInternship },
    { name: 'Get Internships', fn: testGetInternships },
    { name: 'Update Internship', fn: () => testUpdateInternship(internshipId) },
    { name: 'Delete Internship', fn: () => testDeleteInternship(internshipId) }
  ];
  
  let internshipId = null;
  
  for (const test of tests) {
    try {
      if (test.name === 'Create Internship') {
        internshipId = await test.fn();
      } else {
        await test.fn();
      }
    } catch (error) {
      console.log(`❌ Test "${test.name}" failed with error:`, error.message);
    }
  }
  
  console.log('\n🎉 All tests completed!');
};

// Run the tests
runTests().catch(console.error);
