const dotenv = require('dotenv');
const { sendMentorCredentials } = require('./utils/emailService');

// Load environment variables
dotenv.config();

async function testEmail() {
  console.log('🧪 Testing Email Configuration...\n');
  
  console.log('📧 Email User:', process.env.EMAIL_USER);
  console.log('🔐 Email Pass Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 'Not set');
  console.log('🌐 Frontend URL:', process.env.FRONTEND_URL);
  console.log('\n');
  
  // Test with your own email first
  const testEmail = process.env.EMAIL_USER; // Send to yourself for testing
  const testName = 'Test Mentor';
  const testPassword = 'TestPass123';
  
  console.log('🔄 Sending test email to:', testEmail);
  
  try {
    const result = await sendMentorCredentials(testEmail, testName, testPassword);
    
    if (result) {
      console.log('\n✅ SUCCESS: Test email sent successfully!');
      console.log('📧 Check your inbox/spam folder for the email.');
    } else {
      console.log('\n❌ FAILED: Test email was not sent.');
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
  }
}

testEmail();