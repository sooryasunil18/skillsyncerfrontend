const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/skillsyncer');

const User = require('./models/User');
const InternshipPosting = require('./models/InternshipPosting');
const InternshipApplication = require('./models/InternshipApplication');

async function testCompleteFlow() {
  try {
    console.log('🔍 Testing Complete Application Flow...\n');

    // 1. Create or find test users
    console.log('1. Setting up test users...');
    
    // Find or create jobseeker
    let jobseeker = await User.findOne({ email: 'jobseeker@test.com' }).select('+password');
    if (!jobseeker) {
      const salt = await require('bcryptjs').genSalt(12);
      const hashedPassword = await require('bcryptjs').hash('password123', salt);
      
      jobseeker = new User({
        name: 'Test Jobseeker',
        email: 'jobseeker@test.com',
        password: hashedPassword,
        role: 'jobseeker',
        isActive: true,
        profile: {
          bio: 'Test jobseeker profile',
          skills: ['JavaScript', 'React'],
          experience: '1-3',
          location: 'Test City'
        }
      });
      await jobseeker.save();
      console.log('✅ Jobseeker created:', jobseeker._id);
    } else {
      console.log('✅ Jobseeker found:', jobseeker._id);
    }

    // Find or create employer
    let employer = await User.findOne({ email: 'employer@test.com' });
    if (!employer) {
      const salt = await require('bcryptjs').genSalt(12);
      const hashedPassword = await require('bcryptjs').hash('password123', salt);
      
      employer = new User({
        name: 'Test Employer',
        email: 'employer@test.com',
        password: hashedPassword,
        role: 'employer',
        isActive: true,
        company: {
          name: 'Test Company',
          industry: 'technology',
          size: '51-200',
          website: 'https://testcompany.com'
        }
      });
      await employer.save();
      console.log('✅ Employer created:', employer._id);
    } else {
      console.log('✅ Employer found:', employer._id);
    }

    // 2. Create test internship
    console.log('\n2. Creating test internship...');
    let internship = await InternshipPosting.findOne({ title: 'Software Development Intern' });
    if (!internship) {
      internship = new InternshipPosting({
        title: 'Software Development Intern',
        companyName: 'Test Company',
        employerId: employer._id,
        description: 'Test internship description',
        skillsRequired: ['JavaScript', 'React'],
        stipend: { type: 'Fixed', amount: 5000 },
        duration: '3 months',
        startDate: new Date('2024-02-01'),
        lastDateToApply: new Date('2024-01-25'),
        location: 'Remote',
        mode: 'Online',
        eligibility: 'Both',
        totalSeats: 5,
        availableSeats: 5,
        status: 'active',
        applications: [],
        applicationsCount: 0
      });
      await internship.save();
      console.log('✅ Internship created:', internship._id);
    } else {
      console.log('✅ Internship found:', internship._id);
    }

    // 3. Test application submission
    console.log('\n3. Testing application submission...');
    const applicationData = {
      internshipId: internship._id,
      jobseekerId: jobseeker._id,
      employerId: employer._id,
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
        linkedinProfile: '',
        githubPortfolio: ''
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
        softSkills: []
      },
      projects: [],
      additionalInfo: {
        whyJoinInternship: 'I want to learn and grow in software development',
        achievementsCertifications: '',
        resumeUrl: 'https://example.com/resume.pdf',
        portfolioUrl: ''
      },
      declarations: {
        informationTruthful: true,
        consentToShare: true
      }
    };

    // Create application
    const application = new InternshipApplication(applicationData);
    await application.save();
    console.log('✅ Application created:', application._id);

    // 4. Test jobseeker applications endpoint
    console.log('\n4. Testing jobseeker applications endpoint...');
    const jobseekerApplications = await InternshipApplication.getApplicationsForJobseeker(jobseeker._id);
    console.log('✅ Jobseeker applications:', jobseekerApplications.length);

    // 5. Test employer applications endpoint
    console.log('\n5. Testing employer applications endpoint...');
    const employerApplications = await InternshipApplication.getApplicationsForEmployer(employer._id);
    console.log('✅ Employer applications:', employerApplications.length);

    // 6. Generate tokens for testing
    console.log('\n6. Generating test tokens...');
    const jobseekerToken = jwt.sign({ userId: jobseeker._id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d'
    });
    const employerToken = jwt.sign({ userId: employer._id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d'
    });

    console.log('✅ Jobseeker token:', jobseekerToken.substring(0, 50) + '...');
    console.log('✅ Employer token:', employerToken.substring(0, 50) + '...');

    console.log('\n🎉 Complete flow test successful!');
    console.log('\nTest Data Summary:');
    console.log('- Jobseeker ID:', jobseeker._id);
    console.log('- Employer ID:', employer._id);
    console.log('- Internship ID:', internship._id);
    console.log('- Application ID:', application._id);
    console.log('- Jobseeker Applications Count:', jobseekerApplications.length);
    console.log('- Employer Applications Count:', employerApplications.length);

  } catch (error) {
    console.error('\n❌ Error in complete flow test:');
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

testCompleteFlow();
