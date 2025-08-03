// Test script to verify profile update functionality
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:5001';

async function testProfileUpdate() {
  try {
    console.log('🧪 Testing Profile Update Functionality...\n');

    // First, let's try to login with a test user
    console.log('1. Testing login...');
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed. Creating test user first...');
      
      // Create test user
      const registerResponse = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'jobseeker'
        })
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        console.log('❌ Registration failed:', errorData);
        return;
      }

      console.log('✅ Test user created successfully');
      
      // Try login again
      const loginRetry = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      if (!loginRetry.ok) {
        console.log('❌ Login retry failed');
        return;
      }

      const loginData = await loginRetry.json();
      var token = loginData.token;
    } else {
      const loginData = await loginResponse.json();
      var token = loginData.token;
    }

    console.log('✅ Login successful');

    // 2. Get current profile
    console.log('\n2. Getting current profile...');
    const profileResponse = await fetch(`${API_BASE}/api/jobseeker/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.json();
      console.log('❌ Failed to get profile:', profileResponse.status, errorData);
      return;
    }

    const profileData = await profileResponse.json();
    console.log('✅ Current profile:', JSON.stringify(profileData.data.user.profile, null, 2));

    // 3. Update profile
    console.log('\n3. Updating profile...');
    const updateData = {
      name: 'Test User Updated',
      profile: {
        bio: 'This is a test bio updated via API',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        experience: '1-3',
        location: 'Test City, Test Country',
        phone: '+1234567890',
        portfolio: 'https://testuser.portfolio.com'
      }
    };

    const updateResponse = await fetch(`${API_BASE}/api/jobseeker/profile`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.log('❌ Profile update failed:', errorData);
      return;
    }

    const updateResult = await updateResponse.json();
    console.log('✅ Profile updated successfully');
    console.log('📊 Profile completion:', updateResult.data.profileCompletion + '%');

    // 4. Verify the update by getting profile again
    console.log('\n4. Verifying update...');
    const verifyResponse = await fetch(`${API_BASE}/api/jobseeker/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!verifyResponse.ok) {
      console.log('❌ Failed to verify profile');
      return;
    }

    const verifyData = await verifyResponse.json();
    console.log('✅ Updated profile:', JSON.stringify(verifyData.data.user.profile, null, 2));
    console.log('📊 Profile completion:', verifyData.data.profileCompletion + '%');

    console.log('\n🎉 Profile update test completed successfully!');

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testProfileUpdate();