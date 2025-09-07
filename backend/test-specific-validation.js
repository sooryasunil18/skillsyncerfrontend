const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/skillsyncer');

const InternshipApplication = require('./models/InternshipApplication');

// Test with the exact data structure that might be causing issues
const testData = {
  internshipId: new mongoose.Types.ObjectId(),
  jobseekerId: new mongoose.Types.ObjectId(),
  employerId: new mongoose.Types.ObjectId(),
  internshipDetails: {
    title: "Software Development Intern",
    type: "Paid",
    duration: "3 months",
    startDate: new Date('2024-02-01'),
    workMode: "Remote",
    eligibility: "Both"
  },
  personalDetails: {
    fullName: "John Doe",
    dateOfBirth: new Date('2000-01-01'),
    gender: "Male",
    contactNumber: "1234567890",
    emailAddress: "john@example.com",
    linkedinProfile: "",
    githubPortfolio: ""
  },
  educationDetails: {
    highestQualification: "Bachelor's Degree",
    institutionName: "Test University",
    yearOfGraduation: 2024,
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

async function testValidation() {
  try {
    console.log('Testing validation with empty/nil values...');
    console.log('Data being tested:', JSON.stringify(testData, null, 2));
    
    const application = new InternshipApplication(testData);
    
    // Validate without saving
    await application.validate();
    console.log('✅ Validation passed!');
    
    // Try to save
    await application.save();
    console.log('✅ Save successful!');
    
  } catch (error) {
    console.error('❌ Validation/Save failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.errors) {
      console.error('\nDetailed validation errors:');
      Object.keys(error.errors).forEach(field => {
        const fieldError = error.errors[field];
        console.error(`  ${field}: ${fieldError.message}`);
        console.error(`    Value: ${JSON.stringify(fieldError.value)}`);
        console.error(`    Path: ${fieldError.path}`);
        console.error(`    Kind: ${fieldError.kind}`);
        console.error('---');
      });
    }
  } finally {
    mongoose.connection.close();
  }
}

testValidation();
