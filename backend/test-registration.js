// Test script to debug registration
const fetch = require('node-fetch');

const testData = {
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  role: "jobseeker"
};

console.log('Testing registration with data:', testData);

fetch('http://localhost:5001/api/auth/test-register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
  console.log('Response:', data);
})
.catch(error => {
  console.error('Error:', error);
});