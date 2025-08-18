// Test script for enhanced registration validation
const axios = require('axios');

const testCases = [
  {
    name: 'Valid Jobseeker Registration',
    endpoint: '/api/auth/register',
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123',
      role: 'jobseeker'
    },
    shouldPass: true
  },
  {
    name: 'Invalid Name (too short)',
    endpoint: '/api/auth/register',
    data: {
      name: 'J',
      email: 'john@example.com',
      password: 'Password123',
      role: 'jobseeker'
    },
    shouldPass: false
  },
  {
    name: 'Invalid Name (contains numbers)',
    endpoint: '/api/auth/register',
    data: {
      name: 'John123',
      email: 'john@example.com',
      password: 'Password123',
      role: 'jobseeker'
    },
    shouldPass: false
  },
  {
    name: 'Invalid Email Format',
    endpoint: '/api/auth/register',
    data: {
      name: 'John Doe',
      email: 'invalid-email',
      password: 'Password123',
      role: 'jobseeker'
    },
    shouldPass: false
  },
  {
    name: 'Weak Password (no uppercase)',
    endpoint: '/api/auth/register',
    data: {
      name: 'John Doe',
      email: 'john2@example.com',
      password: 'password123',
      role: 'jobseeker'
    },
    shouldPass: false
  },
  {
    name: 'Weak Password (no numbers)',
    endpoint: '/api/auth/register',
    data: {
      name: 'John Doe',
      email: 'john3@example.com',
      password: 'Password',
      role: 'jobseeker'
    },
    shouldPass: false
  },
  {
    name: 'Valid Company Registration',
    endpoint: '/api/auth/register-company',
    data: {
      companyName: 'Tech Solutions Pvt Ltd',
      email: 'contact@techsolutions.com',
      phone: '9876543210',
      industry: 'technology',
      password: 'CompanyPass123'
    },
    shouldPass: true
  },
  {
    name: 'Invalid Company Phone',
    endpoint: '/api/auth/register-company',
    data: {
      companyName: 'Tech Solutions',
      email: 'contact2@techsolutions.com',
      phone: '1234567890', // Invalid: starts with 1
      industry: 'technology',
      password: 'CompanyPass123'
    },
    shouldPass: false
  }
];

const runTests = async () => {
  console.log('🧪 Running Registration Validation Tests...\n');
  
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      const response = await axios.post(`http://localhost:5001${testCase.endpoint}`, testCase.data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (testCase.shouldPass && response.data.success) {
        console.log(`✅ ${testCase.name}: PASSED`);
        passed++;
      } else if (!testCase.shouldPass && response.data.success) {
        console.log(`❌ ${testCase.name}: FAILED (Should have been rejected)`);
        failed++;
      } else {
        console.log(`❌ ${testCase.name}: UNEXPECTED RESULT`);
        failed++;
      }

    } catch (error) {
      if (!testCase.shouldPass && error.response && error.response.status >= 400) {
        console.log(`✅ ${testCase.name}: PASSED (Correctly rejected: ${error.response.data.message})`);
        passed++;
      } else if (testCase.shouldPass) {
        console.log(`❌ ${testCase.name}: FAILED (${error.response?.data?.message || error.message})`);
        failed++;
      } else {
        console.log(`❌ ${testCase.name}: UNEXPECTED ERROR`);
        failed++;
      }
    }
  }

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All validation tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Check the validation logic.');
  }
};

runTests();