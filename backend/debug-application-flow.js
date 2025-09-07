const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/skillsyncer');

const User = require('./backend/models/User');
const InternshipPosting = require('./backend/models/InternshipPosting');
const InternshipApplication = require('./backend/models/InternshipApplication');

async function debugApplicationFlow() {
  try {
    console.log('🔍 Debugging Application Flow...\n');

    // 1. Create test users
    console.log('1. Creating test users...');
    
    // Create jobseeker
    const jobseeker = new User({
      name: 'Test Jobseeker',
      email: 'jobseeker@test.com',
      password: 'password123',
      role: 'jobseeker',
      isActive: true,
      profile: {
        bio: 'Test jobseeker profile',
        skills: ['JavaScript', 'React'],
        experience: '1 year',
        location: 'Test City'
      }
    });
    await jobseeker.save();
    console.log('✅ Jobseeker created:', jobseeker._id);

    // Create employer
    const employer = new User({
      name: 'Test Employer',
      email: 'employer@test.com',
      password: 'password123',
      role: 'employer',
      isActive: true,
      company: {
        name: 'Test Company',
        industry: 'Technology',
        size: '50-100',
        website: 'https://testcompany.com'
      }
    });
    await employer.save();
    console.log('✅ Employer created:', employer._id);

    // 2. Create test internship
    console.log('\n2. Creating test internship...');
    const internship = new InternshipPosting({
      title: 'Software Development Intern',
      companyName: 'Test Company',
      employerId: employer._id,
      description: 'Test internship description',
      requirements: ['JavaScript', 'React'],
      stipend: { type: 'Paid', amount: 5000 },
      duration: '3 months',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-05-01'),
      mode: 'Online',
      eligibility: 'Both',
      availableSeats: 5,
      status: 'active',
      applications: [],
      applicationsCount: 0
    });
    await internship.save();
    console.log('✅ Internship created:', internship._id);

    // 3. Generate JWT token
    console.log('\n3. Generating JWT token...');
    const token = jwt.sign({ userId: jobseeker._id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d'
    });
    console.log('✅ Token generated');

    // 4. Test application data
    console.log('\n4. Testing application data...');
    const applicationData = {
      internshipDetails: {
        title: internship.title,
        type: internship.stipend?.type === 'Unpaid' ? 'Unpaid' : 'Paid',
        duration: internship.duration,
        startDate: internship.startDate,
        workMode: internship.mode === 'Online' ? 'Remote' : 
                 internship.mode === 'Offline' ? 'Onsite' : 
                 internship.mode === 'Hybrid' ? 'Hybrid' : 'Onsite',
        eligibility: internship.eligibility || 'Both'
      },
      personalDetails: {
        fullName: 'John Doe',
        dateOfBirth: new Date('2000-01-01'),
        gender: 'Male',
        contactNumber: '1234567890',
        emailAddress: 'john@example.com',
        linkedinProfile: 'https://linkedin.com/in/johndoe',
        githubPortfolio: 'https://github.com/johndoe'
      },
      educationDetails: {
        highestQualification: 'Bachelor\'s Degree',
        institutionName: 'Test University',
        yearOfGraduation: 2024,
        cgpaPercentage: '8.5'
      },
      workExperience: {
        totalYearsExperience: 0,
        currentLastCompany: '',
        currentLastDesignation: '',
        relevantExperienceDescription: ''
      },
      skills: {
        technicalSkills: ['JavaScript', 'React'],
        softSkills: ['Communication', 'Teamwork']
      },
      projects: [{
        projectName: 'Test Project',
        role: 'Developer',
        duration: '2 months',
        technologiesUsed: ['React', 'Node.js'],
        description: 'A test project description'
      }],
      additionalInfo: {
        whyJoinInternship: 'I want to learn and grow in software development',
        achievementsCertifications: 'Some achievements',
        resumeUrl: 'https://example.com/resume.pdf',
        portfolioUrl: 'https://example.com/portfolio'
      },
      declarations: {
        informationTruthful: true,
        consentToShare: true
      }
    };

    // 5. Test validation
    console.log('\n5. Testing application validation...');
    const application = new InternshipApplication({
      internshipId: internship._id,
      jobseekerId: jobseeker._id,
      employerId: employer._id,
      ...applicationData
    });

    await application.validate();
    console.log('✅ Application validation passed');

    // 6. Test saving
    console.log('\n6. Testing application save...');
    await application.save();
    console.log('✅ Application saved successfully');

    console.log('\n🎉 All tests passed! The application flow is working correctly.');
    console.log('\nApplication ID:', application._id);
    console.log('Jobseeker ID:', jobseeker._id);
    console.log('Internship ID:', internship._id);
    console.log('Token:', token);

  } catch (error) {
    console.error('\n❌ Error in application flow:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.errors) {
      console.error('\nValidation errors:');
      Object.keys(error.errors).forEach(field => {
        const fieldError = error.errors[field];
        console.error(`  ${field}: ${fieldError.message} (value: ${JSON.stringify(fieldError.value)})`);
      });
    }
    
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
  } finally {
    mongoose.connection.close();
  }
}

debugApplicationFlow();
