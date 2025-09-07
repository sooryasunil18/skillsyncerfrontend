const http = require('http');

// First login to get a fresh token
function loginAndGetToken() {
  return new Promise((resolve, reject) => {
    const loginData = JSON.stringify({
      email: 'jobseeker@test.com',
      password: 'password123'
    });

    const options = {
      hostname: 'localhost',
      port: 5003,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success && result.token) {
            resolve(result.token);
          } else {
            reject(new Error('Login failed: ' + result.message));
          }
        } catch (e) {
          reject(new Error('Could not parse login response: ' + data));
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(loginData);
    req.end();
  });
}

// Test application submission with fresh token
function testApplicationSubmission(token) {
  return new Promise((resolve, reject) => {
    const applicationData = {
      internshipDetails: {
        title: "Software Development Intern",
        type: "Paid",
        duration: "3 months",
        startDate: "2024-02-01T00:00:00.000Z",
        workMode: "Remote",
        eligibility: "Both"
      },
      personalDetails: {
        fullName: "John Doe",
        dateOfBirth: "2000-01-01",
        gender: "Male",
        contactNumber: "1234567890",
        emailAddress: "john@example.com",
        linkedinProfile: "",
        githubPortfolio: ""
      },
      educationDetails: {
        highestQualification: "Bachelor's Degree",
        institutionName: "Test University",
        yearOfGraduation: "2024",
        cgpaPercentage: "8.5"
      },
      workExperience: {
        totalYearsExperience: 0,
        currentLastCompany: "",
        currentLastDesignation: "",
        relevantExperienceDescription: ""
      },
      skills: {
        technicalSkills: ["JavaScript", "React"],
        softSkills: []
      },
      projects: [],
      additionalInfo: {
        whyJoinInternship: "I want to learn and grow in software development",
        achievementsCertifications: "",
        resumeUrl: "https://example.com/resume.pdf",
        portfolioUrl: ""
      },
      declarations: {
        informationTruthful: true,
        consentToShare: true
      }
    };

    const postData = JSON.stringify(applicationData);

    const options = {
      hostname: 'localhost',
      port: 5003,
      path: '/api/jobseeker/internships/68bc7b3b8638571a53939eda/apply-detailed',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Headers: ${JSON.stringify(res.headers)}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('Response Body:', data);
        try {
          const parsed = JSON.parse(data);
          console.log('Parsed Response:', JSON.stringify(parsed, null, 2));
          resolve(parsed);
        } catch (e) {
          console.log('Could not parse response as JSON');
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runTest() {
  try {
    console.log('Step 1: Logging in...');
    const token = await loginAndGetToken();
    console.log('✅ Login successful! Token:', token.substring(0, 50) + '...');
    
    console.log('\nStep 2: Testing application submission...');
    const result = await testApplicationSubmission(token);
    
    if (result.success) {
      console.log('✅ Application submitted successfully!');
    } else {
      console.log('❌ Application submission failed:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runTest();
