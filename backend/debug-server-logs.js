const http = require('http');

// Test the API endpoint directly
function testApiEndpoint() {
  const postData = JSON.stringify({
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
  });

  const options = {
    hostname: 'localhost',
    port: 5003,
    path: '/api/jobseeker/internships/68bc7b3b8638571a53939eda/apply-detailed',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGJjN2IwNjM1ODVlYzUwNWI3OTBkZDIiLCJpYXQiOjE3NTcxODI3NzksImV4cCI6MTc1Nzc4NzU3OX0.iamYrRXtRFW14_tiaATdgFd_73JoAvRxFwusRc-hFtc'
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
      } catch (e) {
        console.log('Could not parse response as JSON');
      }
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

console.log('Testing API endpoint...');
testApiEndpoint();
