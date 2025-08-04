const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // For development, we'll use Gmail SMTP
  // In production, you should use a proper email service like SendGrid, AWS SES, etc.
  return nodemailer.createTransporter({
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
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SkillSyncer</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 30px;
              border-radius: 8px;
              font-size: 24px;
              font-weight: bold;
              display: inline-block;
              margin-bottom: 20px;
            }
            .welcome-text {
              font-size: 18px;
              color: #4a5568;
              margin-bottom: 30px;
            }
            .credentials-box {
              background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
              border: 2px solid #e2e8f0;
              border-radius: 8px;
              padding: 25px;
              margin: 25px 0;
            }
            .credential-item {
              margin: 15px 0;
              padding: 10px;
              background: white;
              border-radius: 6px;
              border-left: 4px solid #667eea;
            }
            .credential-label {
              font-weight: bold;
              color: #2d3748;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .credential-value {
              font-size: 16px;
              color: #1a202c;
              font-family: 'Courier New', monospace;
              background: #f7fafc;
              padding: 8px 12px;
              border-radius: 4px;
              margin-top: 5px;
            }
            .login-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .instructions {
              background: #fff5f5;
              border: 1px solid #fed7d7;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
            }
            .instructions h3 {
              color: #c53030;
              margin-top: 0;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #718096;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">SkillSyncer</div>
              <h1 style="color: #2d3748; margin: 0;">Welcome to SkillSyncer!</h1>
            </div>
            
            <div class="welcome-text">
              <p>Dear <strong>${mentorData.name}</strong>,</p>
              <p>Congratulations! You have been successfully registered as a mentor on SkillSyncer platform. We're excited to have you join our community of experienced professionals helping job seekers achieve their career goals.</p>
            </div>
            
            <div class="credentials-box">
              <h3 style="margin-top: 0; color: #2d3748;">Your Login Credentials</h3>
              
              <div class="credential-item">
                <div class="credential-label">Username/Email</div>
                <div class="credential-value">${mentorData.email}</div>
              </div>
              
              <div class="credential-item">
                <div class="credential-label">Temporary Password</div>
                <div class="credential-value">${mentorData.password}</div>
              </div>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="login-button">
                Login to Your Account
              </a>
            </div>
            
            <div class="instructions">
              <h3>🔒 Important Security Instructions</h3>
              <ul>
                <li><strong>Change your password immediately</strong> after your first login</li>
                <li>Keep your login credentials secure and don't share them with anyone</li>
                <li>Use a strong, unique password for your account</li>
                <li>Enable two-factor authentication if available</li>
              </ul>
            </div>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #2d3748;">Next Steps</h3>
              <ol style="color: #4a5568;">
                <li>Log in to your mentor dashboard</li>
                <li>Complete your mentor profile</li>
                <li>Add your expertise areas and experience</li>
                <li>Start connecting with job seekers who need your guidance</li>
              </ol>
            </div>
            
            <div class="footer">
              <p>If you have any questions or need assistance, please contact our support team.</p>
              <p><strong>SkillSyncer Team</strong><br>
              Email: support@skillsyncer.com<br>
              Website: ${process.env.FRONTEND_URL || 'http://localhost:3000'}</p>
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