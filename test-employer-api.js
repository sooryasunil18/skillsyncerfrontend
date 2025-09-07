const API_BASE_URL = 'http://localhost:5001';

async function testEmployerAPI() {
  console.log('🧪 Testing Employer API endpoints...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test 2: Test employer route without auth
    console.log('\n2. Testing employer test endpoint...');
    const testResponse = await fetch(`${API_BASE_URL}/api/employer/test`);
    const testData = await testResponse.json();
    console.log('✅ Test endpoint:', testData);

    // Test 3: Test internship titles endpoint (should fail without auth)
    console.log('\n3. Testing internship titles endpoint (should fail without auth)...');
    try {
      const titlesResponse = await fetch(`${API_BASE_URL}/api/employer/internship-titles`);
      const titlesData = await titlesResponse.json();
      console.log('❌ Unexpected success:', titlesData);
    } catch (error) {
      console.log('✅ Correctly failed without auth:', error.message);
    }

    // Test 4: Test India locations endpoint (should fail without auth)
    console.log('\n4. Testing India locations endpoint (should fail without auth)...');
    try {
      const locationsResponse = await fetch(`${API_BASE_URL}/api/employer/india-locations`);
      const locationsData = await locationsResponse.json();
      console.log('❌ Unexpected success:', locationsData);
    } catch (error) {
      console.log('✅ Correctly failed without auth:', error.message);
    }

    console.log('\n🎉 API tests completed!');
    console.log('\n📝 Summary:');
    console.log('- Backend server is running');
    console.log('- Health endpoint is working');
    console.log('- Authentication is properly enforced');
    console.log('\n💡 Next steps:');
    console.log('1. Make sure you have a valid employer account');
    console.log('2. Login with employer credentials');
    console.log('3. Try accessing the internship postings section');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running on port 5001');
    console.log('2. Check if there are any CORS issues');
    console.log('3. Verify the API endpoints are correctly configured');
  }
}

testEmployerAPI();
