const nodemailer = require('nodemailer');

// Create transporter using the email configuration from .env
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send mentor credentials email
const sendMentorCredentials = async (mentorEmail, mentorName, tempPassword) => {
  console.log('🔄 Attempting to send mentor credentials email...');
  console.log('📧 To:', mentorEmail);
  console.log('👤 Name:', mentorName);
  console.log('📧 From:', process.env.EMAIL_USER);
  
  try {
    const transporter = createTransporter();
    
    // Verify transporter configuration
    console.log('🔍 Verifying transporter...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mentorEmail,
      subject: 'Welcome to SkillSyncer - Mentor Account Created',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Welcome to SkillSyncer!</h2>
          <p>Dear ${mentorName},</p>
          <p>Your mentor account has been created successfully. Here are your login credentials:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${mentorEmail}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          
          <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
          
          <p>You can log in at: <a href="${process.env.FRONTEND_URL}/auth">${process.env.FRONTEND_URL}/auth</a></p>
          
          <p>Welcome to the SkillSyncer community!</p>
          
          <p>Best regards,<br>SkillSyncer Team</p>
        </div>
      `
    };

    console.log('📤 Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Error sending mentor credentials email:', error);
    console.error('❌ Error details:', error.message);
    return false;
  }
};

// Send notification email
const sendNotificationEmail = async (recipientEmail, subject, message) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">SkillSyncer Notification</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            ${message}
          </div>
          <p>Best regards,<br>SkillSyncer Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Notification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending notification email:', error);
    return false;
  }
};

// Send welcome email for new registrations
const sendWelcomeEmail = async (userEmail, userName, userRole) => {
  try {
    const transporter = createTransporter();
    
    const roleSpecificContent = {
      jobseeker: {
        title: 'Welcome to SkillSyncer - Your Career Journey Starts Here!',
        content: `
          <p>As a job seeker, you now have access to:</p>
          <ul>
            <li>Browse and apply for job opportunities</li>
            <li>Build and showcase your professional profile</li>
            <li>Connect with mentors and industry professionals</li>
            <li>Access career development resources</li>
          </ul>
        `
      },
      employer: {
        title: 'Welcome to SkillSyncer - Find Your Next Great Hire!',
        content: `
          <p>As an employer, you can now:</p>
          <ul>
            <li>Post job openings and internship opportunities</li>
            <li>Search and connect with talented candidates</li>
            <li>Manage your hiring process efficiently</li>
            <li>Build your company's talent pipeline</li>
          </ul>
        `
      },
      mentor: {
        title: 'Welcome to SkillSyncer - Share Your Expertise!',
        content: `
          <p>As a mentor, you can:</p>
          <ul>
            <li>Guide and support job seekers in their career journey</li>
            <li>Share your industry knowledge and experience</li>
            <li>Build meaningful professional relationships</li>
            <li>Contribute to the next generation's success</li>
          </ul>
        `
      }
    };

    const content = roleSpecificContent[userRole] || roleSpecificContent.jobseeker;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: content.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">${content.title}</h2>
          <p>Dear ${userName},</p>
          <p>Welcome to SkillSyncer! We're excited to have you join our community.</p>
          
          ${content.content}
          
          <p>Get started by logging into your account: <a href="${process.env.FRONTEND_URL}/auth">${process.env.FRONTEND_URL}/auth</a></p>
          
          <p>If you have any questions, feel free to reach out to our support team.</p>
          
          <p>Best regards,<br>SkillSyncer Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

module.exports = {
  sendMentorCredentials,
  sendNotificationEmail,
  sendWelcomeEmail,
  createTransporter
};