const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/skillsyncer', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const InternshipApplication = require('./backend/models/InternshipApplication');

// Test data that matches what the frontend sends
const testApplicationData = {
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
    linkedinProfile: "https://linkedin.com/in/johndoe",
    githubPortfolio: "https://github.com/johndoe"
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
    softSkills: ["Communication", "Teamwork"]
  },
  projects: [{
    projectName: "Test Project",
    role: "Developer",
    duration: "2 months",
    technologiesUsed: ["React", "Node.js"],
    description: "A test project description"
  }],
  additionalInfo: {
    whyJoinInternship: "I want to learn and grow in software development",
    achievementsCertifications: "Some achievements",
    resumeUrl: "https://example.com/resume.pdf",
    portfolioUrl: "https://example.com/portfolio"
  },
  declarations: {
    informationTruthful: true,
    consentToShare: true
  }
};

async function testValidation() {
  try {
    console.log('Testing application validation...');
    
    const application = new InternshipApplication(testApplicationData);
    
    // Validate without saving
    await application.validate();
    console.log('✅ Validation passed!');
    
  } catch (error) {
    console.error('❌ Validation failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.errors) {
      console.error('Validation errors:');
      Object.keys(error.errors).forEach(field => {
        const fieldError = error.errors[field];
        console.error(`  ${field}: ${fieldError.message} (value: ${fieldError.value})`);
      });
    }
  } finally {
    mongoose.connection.close();
  }
}

testValidation();
