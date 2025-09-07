const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001';

async function testCompleteInternshipFlow() {
  try {
    console.log('🧪 Testing Complete Internship Flow...\n');

    // Test data
    const testEmployer = {
      name: 'Test Company',
      email: 'testcompany@example.com',
      password: 'TestPassword123',
      role: 'employer',
      company: {
        name: 'Test Company Inc.',
        description: 'A test company for internship postings'
      }
    };

    const testInternship = {
      title: 'Software Development Intern',
      industry: 'IT/Technology',
      location: 'Mumbai, Maharashtra',
      mode: 'Hybrid',
      startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      lastDateToApply: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      duration: '3 months',
      totalSeats: 5,
      description: 'Join our team as a software development intern and work on real projects.',
      skillsRequired: ['JavaScript', 'React', 'Node.js'],
      eligibility: 'Currently pursuing Computer Science or related field',
      stipend: {
        amount: 15000,
        currency: 'INR',
        type: 'Fixed'
      },
      benefits: ['Certificate', 'Letter of Recommendation', 'Stipend'],
      status: 'active'
    };

    let authToken = null;

    // Step 1: Register employer
    console.log('1. Registering test employer...');
    try {
      const registerResponse = await axios.post(`${API_BASE_URL}/api/auth/register`, testEmployer);
      console.log('✅ Employer registered:', registerResponse.data.message);
      authToken = registerResponse.data.token;
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ Employer already exists, trying to login...');
        // Try to login instead
        const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: testEmployer.email,
          password: testEmployer.password
        });
        console.log('✅ Employer logged in:', loginResponse.data.message);
        authToken = loginResponse.data.token;
      } else {
        throw error;
      }
    }

    if (!authToken) {
      console.log('❌ Failed to get authentication token');
      return;
    }

    // Step 2: Create internship posting
    console.log('\n2. Creating internship posting...');
    try {
      const createResponse = await axios.post(
        `${API_BASE_URL}/api/employer/internships`,
        testInternship,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Internship created:', createResponse.data.message);
      console.log('📋 Internship details:', {
        id: createResponse.data.data._id,
        title: createResponse.data.data.title,
        companyName: createResponse.data.data.companyName,
        status: createResponse.data.data.status
      });
    } catch (error) {
      console.log('❌ Failed to create internship:', error.response?.data?.message || error.message);
      return;
    }

    // Step 3: Get all internships
    console.log('\n3. Retrieving all internships...');
    try {
      const getResponse = await axios.get(
        `${API_BASE_URL}/api/employer/internships`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      
      if (getResponse.data.success) {
        const internships = getResponse.data.data;
        console.log(`✅ Retrieved ${internships.length} internship(s):`);
        
        internships.forEach((internship, index) => {
          console.log(`\n📋 Internship ${index + 1}:`);
          console.log(`   Title: ${internship.title}`);
          console.log(`   Company: ${internship.companyName}`);
          console.log(`   Location: ${internship.location}`);
          console.log(`   Status: ${internship.status}`);
          console.log(`   Posted: ${new Date(internship.postedAt).toLocaleDateString()}`);
          console.log(`   Seats: ${internship.availableSeats}/${internship.totalSeats}`);
          console.log(`   Applications: ${internship.applicationsCount || 0}`);
        });
      } else {
        console.log('❌ Failed to retrieve internships:', getResponse.data.message);
      }
    } catch (error) {
      console.log('❌ Failed to retrieve internships:', error.response?.data?.message || error.message);
    }

    console.log('\n🎉 Test completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('1. Open the frontend application');
    console.log('2. Login as the test employer (testcompany@example.com)');
    console.log('3. Navigate to Internship Postings section');
    console.log('4. Verify that the internship data is displayed correctly');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testCompleteInternshipFlow();
