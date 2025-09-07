// Test Script for Internship Posting System
// This script demonstrates the complete functionality of the internship posting system

const API_BASE_URL = 'http://localhost:5003';

// Test data for internship posting
const testInternship = {
  title: 'Software Developer Intern',
  industry: 'IT/Technology',
  location: 'Mumbai, Maharashtra',
  mode: 'Hybrid',
  startDate: '2025-10-01',
  lastDateToApply: '2025-09-15',
  duration: '6 months',
  totalSeats: 5,
  description: 'We are looking for talented software developer interns to join our dynamic team. You will work on real-world projects using modern technologies like React, Node.js, and MongoDB.',
  skillsRequired: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
  certifications: ['AWS Certified Developer', 'MongoDB Certified Developer'],
  eligibility: 'Currently pursuing or completed B.Tech in Computer Science or related field. Strong programming fundamentals and eagerness to learn.',
  stipend: {
    amount: 25000,
    currency: 'INR',
    type: 'Fixed'
  },
  benefits: ['Certificate of Completion', 'Letter of Recommendation', 'Potential Full-time Offer']
};

// Test functions
async function testHealthCheck() {
  console.log('🏥 Testing Health Check...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data.message);
    return true;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    return false;
  }
}

async function testEmployerRoutes() {
  console.log('\n👔 Testing Employer Routes...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/employer/test`);
    const data = await response.json();
    console.log('✅ Employer Routes:', data.message);
    return true;
  } catch (error) {
    console.error('❌ Employer Routes Failed:', error.message);
    return false;
  }
}

async function testInternshipTitles() {
  console.log('\n📋 Testing Internship Titles API...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/employer/internship-titles?industry=IT/Technology`);
    const data = await response.json();
    if (data.success && Array.isArray(data.data)) {
      console.log(`✅ Internship Titles (${data.data.length} titles):`);
      console.log('   Sample titles:', data.data.slice(0, 5).join(', '));
      return true;
    } else {
      console.error('❌ Invalid response format');
      return false;
    }
  } catch (error) {
    console.error('❌ Internship Titles API Failed:', error.message);
    return false;
  }
}

async function testIndiaLocations() {
  console.log('\n🗺️ Testing India Locations API...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/employer/india-locations`);
    const data = await response.json();
    if (data.success && Array.isArray(data.data)) {
      console.log(`✅ India Locations (${data.data.length} locations):`);
      console.log('   Sample locations:', data.data.slice(0, 5).join(', '));
      return true;
    } else {
      console.error('❌ Invalid response format');
      return false;
    }
  } catch (error) {
    console.error('❌ India Locations API Failed:', error.message);
    return false;
  }
}

async function testDatabaseConnection() {
  console.log('\n🗄️ Testing Database Connection...');
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    if (data.database === 'Connected') {
      console.log('✅ Database: Connected to MongoDB');
      return true;
    } else {
      console.log('⚠️ Database: Not connected');
      return false;
    }
  } catch (error) {
    console.error('❌ Database Test Failed:', error.message);
    return false;
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting Internship Posting System Tests...\n');
  
  const tests = [
    testHealthCheck,
    testEmployerRoutes,
    testInternshipTitles,
    testIndiaLocations,
    testDatabaseConnection
  ];
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    const result = await test();
    if (result) passedTests++;
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! The internship posting system is working correctly.');
    console.log('\n🌐 Access Points:');
    console.log('   Backend API: http://localhost:5003');
    console.log('   Frontend App: http://localhost:5173');
    console.log('   Health Check: http://localhost:5003/api/health');
    console.log('\n📝 Next Steps:');
    console.log('   1. Open http://localhost:5173 in your browser');
    console.log('   2. Register/Login as an employer');
    console.log('   3. Navigate to "Internship Postings" section');
    console.log('   4. Create, view, edit, and delete internship postings');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the backend server and try again.');
  }
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, testInternship };
