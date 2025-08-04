const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For development, we'll use Gmail SMTP
  // In production, you should use a proper email service like SendGrid, AWS SES, etc.
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Send mentor credentials email
const sendMentorCredentials = async (mentorData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'SkillSyncer <noreply@skillsyncer.com>',
      to: mentorData.email,
      subject: 'Welcome to SkillSyncer - Your Mentor Account Details',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SkillSyncer - Your Mentor Journey Begins</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.6;
              color: #2d3748;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 20px;
            }
            .email-wrapper {
              max-width: 650px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 40px 30px;
              text-align: center;
              color: white;
            }
            .logo {
              font-size: 32px;
              font-weight: 800;
              margin-bottom: 10px;
              letter-spacing: -1px;
            }
            .header-subtitle {
              font-size: 18px;
              opacity: 0.9;
              font-weight: 300;
            }
            .content {
              padding: 40px 30px;
            }
            .welcome-section {
              text-align: center;
              margin-bottom: 40px;
            }
            .welcome-title {
              font-size: 28px;
              font-weight: 700;
              color: #1a202c;
              margin-bottom: 15px;
            }
            .welcome-message {
              font-size: 16px;
              color: #4a5568;
              line-height: 1.7;
              max-width: 500px;
              margin: 0 auto;
            }
            .credentials-section {
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              border-radius: 16px;
              padding: 30px;
              margin: 40px 0;
              border: 1px solid #e2e8f0;
            }
            .credentials-title {
              font-size: 20px;
              font-weight: 600;
              color: #2d3748;
              margin-bottom: 20px;
              text-align: center;
            }
            .credential-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: white;
              padding: 20px;
              border-radius: 12px;
              margin-bottom: 15px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }
            .credential-row:last-child {
              margin-bottom: 0;
            }
            .credential-label {
              font-weight: 600;
              color: #4a5568;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .credential-value {
              font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
              font-size: 16px;
              font-weight: 600;
              color: #1a202c;
              background: #f7fafc;
              padding: 8px 16px;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .login-section {
              text-align: center;
              margin: 40px 0;
            }
            .login-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              transition: transform 0.2s ease;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }
            .login-button:hover {
              transform: translateY(-2px);
            }
            .security-notice {
              background: linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%);
              border: 1px solid #f6ad55;
              border-radius: 12px;
              padding: 25px;
              margin: 30px 0;
            }
            .security-notice h3 {
              color: #c05621;
              font-size: 18px;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .security-notice ul {
              list-style: none;
              padding: 0;
            }
            .security-notice li {
              color: #744210;
              margin-bottom: 8px;
              padding-left: 20px;
              position: relative;
            }
            .security-notice li:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #c05621;
              font-weight: bold;
            }
            .next-steps {
              background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
              border: 1px solid #4fd1c7;
              border-radius: 12px;
              padding: 25px;
              margin: 30px 0;
            }
            .next-steps h3 {
              color: #234e52;
              font-size: 18px;
              margin-bottom: 15px;
            }
            .next-steps ol {
              color: #2d3748;
              padding-left: 20px;
            }
            .next-steps li {
              margin-bottom: 8px;
              font-weight: 500;
            }
            .footer {
              background: #f8fafc;
              padding: 30px;
              text-align: center;
              border-top: 1px solid #e2e8f0;
            }
            .footer-content {
              color: #718096;
              font-size: 14px;
              line-height: 1.6;
            }
            .footer-brand {
              font-weight: 600;
              color: #4a5568;
              margin-bottom: 10px;
            }
            @media (max-width: 600px) {
              .email-wrapper {
                margin: 10px;
                border-radius: 16px;
              }
              .content {
                padding: 30px 20px;
              }
              .credential-row {
                flex-direction: column;
                gap: 10px;
                text-align: center;
              }
              .welcome-title {
                font-size: 24px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-wrapper">
            <div class="header">
              <div class="logo">🚀 SkillSyncer</div>
              <div class="header-subtitle">Empowering Careers Through Mentorship</div>
            </div>
            
            <div class="content">
              <div class="welcome-section">
                <h1 class="welcome-title">Welcome Aboard, ${mentorData.name}! 🎉</h1>
                <p class="welcome-message">
                  Congratulations! You've been successfully registered as a mentor on SkillSyncer. 
                  We're thrilled to have you join our community of experienced professionals 
                  dedicated to guiding the next generation of talent.
                </p>
              </div>
              
              <div class="credentials-section">
                <h2 class="credentials-title">🔐 Your Login Credentials</h2>
                
                <div class="credential-row">
                  <div class="credential-label">Email Address</div>
                  <div class="credential-value">${mentorData.email}</div>
                </div>
                
                <div class="credential-row">
                  <div class="credential-label">Password</div>
                  <div class="credential-value">${mentorData.password}</div>
                </div>
              </div>
              
              <div class="login-section">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="login-button">
                  🚀 Access Your Dashboard
                </a>
              </div>
              
              <div class="security-notice">
                <h3>🛡️ Security First</h3>
                <ul>
                  <li>Change your password immediately after first login</li>
                  <li>Use a strong, unique password with special characters</li>
                  <li>Never share your credentials with anyone</li>
                  <li>Log out from shared devices</li>
                </ul>
              </div>
              
              <div class="next-steps">
                <h3>🎯 Your Next Steps</h3>
                <ol>
                  <li><strong>Complete your profile</strong> - Add your expertise and experience</li>
                  <li><strong>Set your availability</strong> - Choose when you're free to mentor</li>
                  <li><strong>Define your specialties</strong> - Help us match you with the right mentees</li>
                  <li><strong>Start mentoring</strong> - Begin making a difference in someone's career</li>
                </ol>
              </div>
            </div>
            
            <div class="footer">
              <div class="footer-content">
                <div class="footer-brand">SkillSyncer Team</div>
                <p>Need help? Contact us at <strong>support@skillsyncer.com</strong></p>
                <p>Visit us at <strong>${process.env.FRONTEND_URL || 'http://localhost:3000'}</strong></p>
                <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                  This email was sent because you were registered as a mentor on SkillSyncer platform.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Mentor credentials email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending mentor credentials email:', error);
    return { success: false, error: error.message };
  }
};

// Send general notification email
const sendNotificationEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'SkillSyncer <noreply@skillsyncer.com>',
      to,
      subject,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Notification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending notification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendMentorCredentials,
  sendNotificationEmail
};