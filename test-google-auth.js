// Test script for Google Authentication API
const axios = require('axios');

const testGoogleAuth = async () => {
  try {
    console.log('Testing Google Authentication API...');
    
    // Test data (simulating what Firebase would send)
    const testData = {
      uid: 'google_test_uid_123',
      email: 'testuser@gmail.com',
      name: 'Test User',
      photoURL: 'https://lh3.googleusercontent.com/test-photo',
      role: 'jobseeker'
    };

    const response = await axios.post('http://localhost:5001/api/auth/google-signin', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Google Auth API Test Successful!');
    console.log('Response:', response.data);
    
    if (response.data.success) {
      console.log('✅ User created/signed in successfully');
      console.log('✅ Token generated:', !!response.data.data.token);
      console.log('✅ Profile completion:', response.data.data.profileCompletion + '%');
    }

  } catch (error) {
    console.error('❌ Google Auth API Test Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

// Run the test
testGoogleAuth();