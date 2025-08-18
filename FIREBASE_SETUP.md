# Firebase Google Sign-in Setup Guide

## Prerequisites
- Google account
- Firebase project

## Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "skillsyncer-auth")
4. Follow the setup wizard

## Step 2: Enable Google Authentication
1. In your Firebase project, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Toggle **Enable**
4. Add your project's authorized domains:
   - `localhost` (for development)
   - Your production domain (when deployed)
5. Click **Save**

## Step 3: Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click **Web app** icon (`</>`)
4. Register your app with a name (e.g., "Skillsyncer Web")
5. Copy the Firebase configuration object

## Step 4: Update Frontend Configuration
Replace the placeholder values in `frontend/src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
  measurementId: "your-actual-measurement-id"
};
```

## Step 5: Test the Implementation
1. Start your backend server: `npm run dev` (in backend directory)
2. Start your frontend server: `npm run dev` (in frontend directory)
3. Navigate to the auth page
4. Try signing in/up with Google as a jobseeker

## Features Implemented
- ✅ Google Sign-in button appears for jobseekers only
- ✅ Google Sign-in button appears on both login and signup forms
- ✅ Automatic account creation for new Google users
- ✅ Existing account linking for returning users
- ✅ Profile picture from Google account
- ✅ Email verification bypass for Google users
- ✅ Proper error handling and user feedback

## Security Notes
- Google users don't need passwords (handled automatically)
- Email verification is automatically set to true for Google users
- Firebase handles the OAuth flow securely
- User data is validated on both frontend and backend

## Troubleshooting
- If popup is blocked, check browser popup settings
- Ensure localhost is in authorized domains for development
- Check browser console for detailed error messages
- Verify Firebase configuration values are correct