const API_BASE_URL = 'http://localhost:5001';

async function createTestEmployer() {
  console.log('👨‍💼 Creating test employer account...\n');

  const testEmployer = {
    name: 'Test Company Inc.',
    email: 'employer@testcompany.com',
    password: 'TestPassword123!',
    role: 'employer',
    company: {
      name: 'Test Company Inc.',
      website: 'https://testcompany.com',
      size: '11-50 employees',
      industry: 'Technology',
      description: 'A leading technology company focused on innovation and growth.'
    }
  };

  try {
    console.log('1. Registering employer account...');
    const registerResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmployer)
    });

    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Employer account created successfully!');
      console.log('Account details:', {
        name: testEmployer.name,
        email: testEmployer.email,
        role: testEmployer.role
      });
    } else {
      console.log('❌ Registration failed:', registerData.message);
      
      // Try to login if account already exists
      console.log('\n2. Trying to login with existing account...');
      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmployer.email,
          password: testEmployer.password
        })
      });

      const loginData = await loginResponse.json();
      
      if (loginResponse.ok) {
        console.log('✅ Login successful!');
        console.log('Token received:', loginData.token ? 'Yes' : 'No');
        console.log('User role:', loginData.user?.role);
      } else {
        console.log('❌ Login failed:', loginData.message);
      }
    }

    console.log('\n📝 Test Account Credentials:');
    console.log('Email:', testEmployer.email);
    console.log('Password:', testEmployer.password);
    console.log('Role:', testEmployer.role);
    
    console.log('\n💡 Next Steps:');
    console.log('1. Use these credentials to login to the frontend');
    console.log('2. Navigate to the employer dashboard');
    console.log('3. Click on "Internship Postings"');
    console.log('4. Verify the white screen issue is fixed');

  } catch (error) {
    console.error('❌ Error creating test employer:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running');
    console.log('2. Check if the API endpoint is accessible');
    console.log('3. Verify the database connection');
  }
}

createTestEmployer();
