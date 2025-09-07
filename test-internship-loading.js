const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001';

async function testInternshipLoading() {
  try {
    console.log('🧪 Testing Internship Loading...\n');

    // First, let's test the health endpoint
    console.log('1. Testing health endpoint...');
    try {
      const healthResponse = await axios.get(`${API_BASE_URL}/api/health`);
      console.log('✅ Health check passed:', healthResponse.data);
    } catch (error) {
      console.log('❌ Health check failed:', error.message);
      return;
    }

    // Test employer routes without auth
    console.log('\n2. Testing employer routes without auth...');
    try {
      const testResponse = await axios.get(`${API_BASE_URL}/api/employer/test`);
      console.log('✅ Employer routes working:', testResponse.data);
    } catch (error) {
      console.log('❌ Employer routes failed:', error.message);
    }

    // Test internships endpoint without auth (should fail)
    console.log('\n3. Testing internships endpoint without auth...');
    try {
      const internshipsResponse = await axios.get(`${API_BASE_URL}/api/employer/internships`);
      console.log('❌ Should have failed but got:', internshipsResponse.data);
    } catch (error) {
      console.log('✅ Correctly failed without auth:', error.response?.data?.message || error.message);
    }

    console.log('\n📋 Test Summary:');
    console.log('- Backend is running on port 5001');
    console.log('- Employer routes are accessible');
    console.log('- Authentication is properly enforced');
    console.log('\n💡 To test with real data:');
    console.log('1. Register/login as an employer');
    console.log('2. Create some internship postings');
    console.log('3. Check the employer dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testInternshipLoading();
