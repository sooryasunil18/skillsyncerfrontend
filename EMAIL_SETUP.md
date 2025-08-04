# Email Setup Instructions for SkillSyncer

This guide will help you set up email functionality for sending mentor credentials.

## Gmail Setup (Recommended for Development)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to "Security"
3. Enable "2-Step Verification"

### Step 2: Generate App Password
1. In Google Account settings, go to "Security"
2. Under "2-Step Verification", click on "App passwords"
3. Select "Mail" as the app and "Other" as the device
4. Enter "SkillSyncer" as the device name
5. Copy the 16-character app password generated

### Step 3: Update Environment Variables
Update your `.env` file in the backend directory:

```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password
FRONTEND_URL=http://localhost:3000
```

## Alternative Email Services

### SendGrid (Recommended for Production)
1. Sign up at https://sendgrid.com/
2. Get your API key
3. Update the email service to use SendGrid API

### AWS SES (Production)
1. Set up AWS SES in your AWS account
2. Verify your domain
3. Update the email service configuration

## Testing Email Functionality

### Method 1: Test Endpoint
Use the test endpoint to verify email configuration:

```bash
POST http://localhost:5001/api/admin/test-email
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json

{
  "email": "test@example.com"
}
```

### Method 2: Create a Mentor
1. Log in to the admin dashboard
2. Go to the Mentors section
3. Add a new mentor
4. Check if the mentor receives the credentials email

## Email Template Features

The mentor credentials email includes:
- ✅ Professional HTML template
- ✅ SkillSyncer branding
- ✅ Login credentials (username/password)
- ✅ Security instructions
- ✅ Next steps guidance
- ✅ Direct login link
- ✅ Responsive design

## Troubleshooting

### Common Issues:

1. **"Invalid login" error**
   - Make sure you're using an App Password, not your regular Gmail password
   - Verify 2-factor authentication is enabled

2. **"Connection refused" error**
   - Check your internet connection
   - Verify Gmail SMTP settings

3. **Email not received**
   - Check spam/junk folder
   - Verify the recipient email address
   - Check Gmail sending limits

### Debug Steps:
1. Check backend console logs for email errors
2. Use the test endpoint to verify configuration
3. Verify environment variables are loaded correctly

## Security Considerations

- ✅ App passwords are more secure than regular passwords
- ✅ Passwords are sent only once via email
- ✅ Users are instructed to change passwords immediately
- ✅ Email service errors don't prevent mentor creation
- ✅ Sensitive credentials are not logged

## Production Recommendations

1. Use a dedicated email service (SendGrid, AWS SES)
2. Set up proper domain authentication (SPF, DKIM)
3. Implement email templates with your branding
4. Add email delivery tracking
5. Set up email bounce handling
6. Use environment-specific configurations