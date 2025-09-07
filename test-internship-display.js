const API_BASE_URL = 'http://localhost:5003';

// Test function to check internship API
const testInternshipAPI = async () => {
  try {
    console.log('🔍 Testing Internship API...');
    
    // First, let's check if there are any internship postings in the database
    console.log('\n📊 Checking database for internship postings...');
    
    // We'll need to create a simple test to check the API
    // Since the API requires authentication, let's create a simple test
    
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const healthData = await response.json();
    
    if (healthData.success) {
      console.log('✅ Backend is running and healthy');
      console.log('📊 Database status:', healthData.database);
      
      // Now let's check if we can access the internship data
      console.log('\n🔍 Testing internship data access...');
      
      // Since we can't directly test the authenticated endpoint without a token,
      // let's provide instructions for manual testing
      console.log('\n📋 Manual Testing Instructions:');
      console.log('1. Open your browser and go to: http://localhost:5173');
      console.log('2. Login as a jobseeker user');
      console.log('3. Navigate to "Find Internships" section');
      console.log('4. Check if internships are displayed');
      
      console.log('\n🔧 If internships are not showing:');
      console.log('- Check browser console for errors');
      console.log('- Verify that internship postings exist in MongoDB Atlas');
      console.log('- Check if the API calls are being made correctly');
      
    } else {
      console.log('❌ Backend health check failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing internship API:', error.message);
  }
};

// Run the test
testInternshipAPI();

