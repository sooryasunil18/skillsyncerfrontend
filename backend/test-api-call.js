const fetch = require('node-fetch');

async function testApiCall() {
  try {
    console.log('Testing API call...');
    
    // First, let's try to login to get a token
    const loginResponse = await fetch('http://localhost:5003/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'jobseeker@test.com',
        password: 'password123'
      })
    });

    const loginResult = await loginResponse.json();
    console.log('Login response:', loginResult);

    if (!loginResult.success) {
      console.error('Login failed:', loginResult.message);
      return;
    }

    const token = loginResult.token;
    console.log('Token obtained:', token.substring(0, 50) + '...');

    // Now test the application submission
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

    console.log('Sending application data:', JSON.stringify(applicationData, null, 2));

    const response = await fetch('http://localhost:5003/api/jobseeker/internships/68bc7b3b8638571a53939eda/apply-detailed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(applicationData)
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('✅ Application submitted successfully!');
    } else {
      console.log('❌ Application submission failed');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testApiCall();
