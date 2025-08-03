# Jobseeker Profile API Documentation

## Overview
This API provides comprehensive jobseeker profile management functionality with MongoDB integration. It supports profile creation, updates, viewing, and search capabilities for different user roles.

## Database Configuration
- **Database**: MongoDB
- **Collection**: `skillsyncer`
- **Connection**: Configured in `backend/server.js`

## Authentication
All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### 1. Get Jobseeker Profile (Own Profile)
**GET** `/api/jobseeker/profile`
- **Access**: Jobseeker only
- **Description**: Get the authenticated jobseeker's own profile

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "jobseeker",
      "profile": {
        "bio": "Software developer...",
        "skills": ["JavaScript", "React", "Node.js"],
        "experience": "3-5",
        "location": "San Francisco, CA",
        "phone": "+1234567890",
        "resume": "https://example.com/resume.pdf",
        "portfolio": "https://johndoe.dev",
        "profilePicture": "https://example.com/profile.jpg",
        "socialLinks": {
          "linkedin": "https://linkedin.com/in/johndoe",
          "github": "https://github.com/johndoe",
          "twitter": "https://twitter.com/johndoe",
          "website": "https://johndoe.dev"
        },
        "jobPreferences": {
          "jobType": "full-time",
          "workMode": "hybrid",
          "expectedSalary": {
            "min": 80000,
            "max": 120000,
            "currency": "USD"
          },
          "availableFrom": "2024-02-01T00:00:00.000Z"
        },
        "isProfilePublic": true,
        "profileViews": 25,
        "lastProfileUpdate": "2024-01-15T10:30:00.000Z"
      },
      "profileCompletion": 85,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "profileCompletion": 85
  }
}
```

### 2. Update Jobseeker Profile
**PUT** `/api/jobseeker/profile`
- **Access**: Jobseeker only
- **Description**: Update the authenticated jobseeker's profile

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "profile": {
    "bio": "Experienced software developer with 5+ years...",
    "skills": ["JavaScript", "React", "Node.js", "MongoDB", "Python"],
    "experience": "3-5",
    "location": "San Francisco, CA",
    "phone": "+1234567890",
    "resume": "https://example.com/resume.pdf",
    "portfolio": "https://johndoe.dev",
    "profilePicture": "https://example.com/profile.jpg",
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/johndoe",
      "github": "https://github.com/johndoe",
      "twitter": "https://twitter.com/johndoe",
      "website": "https://johndoe.dev"
    },
    "jobPreferences": {
      "jobType": "full-time",
      "workMode": "hybrid",
      "expectedSalary": {
        "min": 80000,
        "max": 120000,
        "currency": "USD"
      },
      "availableFrom": "2024-02-01T00:00:00.000Z"
    },
    "isProfilePublic": true
  }
}
```

**Validation Rules:**
- `bio`: Max 500 characters
- `skills`: Array of strings, max 20 skills, each max 50 characters
- `experience`: Must be one of: 'fresher', '0-1', '1-3', '3-5', '5-10', '10+'
- `phone`: Valid phone number format
- `socialLinks`: Valid URLs for respective platforms
- `jobType`: 'full-time', 'part-time', 'contract', 'internship', 'freelance'
- `workMode`: 'remote', 'onsite', 'hybrid'
- `expectedSalary.currency`: 'USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'

### 3. View Jobseeker Profile (By ID)
**GET** `/api/jobseeker/view/:id`
- **Access**: Employer, Admin, or Profile Owner
- **Description**: View a specific jobseeker's profile

**Response:**
```json
{
  "success": true,
  "data": {
    "jobseeker": {
      "_id": "jobseeker_id",
      "name": "John Doe",
      "email": "john@example.com", // Only visible to admins
      "role": "jobseeker",
      "profile": {
        // Profile data (phone visible to employers/admins)
      },
      "profileCompletion": 85,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "viewerRole": "employer",
    "canContact": true
  }
}
```

### 4. Search Jobseekers
**GET** `/api/jobseeker/search`
- **Access**: Employer, Admin only
- **Description**: Search and filter jobseekers

**Query Parameters:**
- `skills`: Comma-separated skills (e.g., "JavaScript,React,Node.js")
- `experience`: Experience level
- `location`: Location (partial match)
- `jobType`: Preferred job type
- `workMode`: Preferred work mode
- `minSalary`: Minimum expected salary
- `maxSalary`: Maximum expected salary
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `sortBy`: Sort field (default: 'profileCompletion')
- `sortOrder`: 'asc' or 'desc' (default: 'desc')

**Example:**
```
GET /api/jobseeker/search?skills=JavaScript,React&experience=3-5&location=San Francisco&page=1&limit=10
```

### 5. Toggle Profile Visibility
**PATCH** `/api/jobseeker/profile/visibility`
- **Access**: Jobseeker only
- **Description**: Make profile public or private

**Request Body:**
```json
{
  "isPublic": true
}
```

### 6. Get Profile Suggestions
**GET** `/api/jobseeker/profile-suggestions`
- **Access**: Jobseeker only
- **Description**: Get suggestions to improve profile completion

**Response:**
```json
{
  "success": true,
  "data": {
    "profileCompletion": 65,
    "suggestions": [
      {
        "field": "bio",
        "title": "Add a Professional Bio",
        "description": "Write a brief description about yourself and your career goals",
        "priority": "high",
        "weight": 15
      }
    ],
    "totalSuggestions": 3
  }
}
```

### 7. Get Dashboard Data
**GET** `/api/jobseeker/dashboard`
- **Access**: Jobseeker only
- **Description**: Get dashboard overview data

### 8. Get Statistics
**GET** `/api/jobseeker/stats`
- **Access**: Jobseeker only
- **Description**: Get profile statistics

## Profile Completion Calculation

The profile completion percentage is calculated based on 12 fields:
1. Name (basic)
2. Email (basic)
3. Bio
4. Skills
5. Experience
6. Location
7. Phone
8. Resume
9. Portfolio
10. Profile Picture
11. Social Links (any one counts)
12. Job Preferences (any preference counts)

**Formula**: `(completed_fields / 12) * 100`

## Error Handling

### Validation Errors (400)
```json
{
  "success": false,
  "message": "Profile validation failed",
  "errors": [
    "Bio cannot exceed 500 characters",
    "Invalid LinkedIn URL format"
  ]
}
```

### Authentication Errors (401)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Authorization Errors (403)
```json
{
  "success": false,
  "message": "Access denied. Role 'employer' is not authorized for this action."
}
```

### Not Found Errors (404)
```json
{
  "success": false,
  "message": "Jobseeker not found"
}
```

## Usage Examples

### 1. Complete Profile Update Flow
```javascript
// 1. Get current profile
const profile = await fetch('/api/jobseeker/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// 2. Update profile
const updateData = {
  name: "Updated Name",
  profile: {
    bio: "New bio...",
    skills: ["JavaScript", "React"],
    // ... other fields
  }
};

const updated = await fetch('/api/jobseeker/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updateData)
});

// 3. Get suggestions for improvement
const suggestions = await fetch('/api/jobseeker/profile-suggestions', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 2. Employer Searching Jobseekers
```javascript
// Search for React developers in San Francisco
const searchResults = await fetch('/api/jobseeker/search?skills=React&location=San Francisco&experience=3-5', {
  headers: { 'Authorization': `Bearer ${employerToken}` }
});

// View specific jobseeker profile
const jobseekerProfile = await fetch(`/api/jobseeker/view/${jobseekerId}`, {
  headers: { 'Authorization': `Bearer ${employerToken}` }
});
```

## Testing

Run the comprehensive test suite:
```bash
node test-profile-api.js
```

This will test all endpoints and validate the complete functionality.

## Security Features

1. **JWT Authentication**: All endpoints require valid JWT tokens
2. **Role-based Access Control**: Different access levels for jobseekers, employers, and admins
3. **Data Validation**: Comprehensive input validation and sanitization
4. **Profile Privacy**: Jobseekers can control profile visibility
5. **Selective Data Exposure**: Different data visibility based on viewer role

## Performance Considerations

1. **Database Indexing**: Indexes on role, email, and search fields
2. **Pagination**: Search results are paginated
3. **Selective Fields**: Only necessary fields are returned
4. **Profile Views Tracking**: Efficient view counting without blocking requests

## Future Enhancements

1. **File Upload**: Direct file upload for resumes and profile pictures
2. **Advanced Search**: Full-text search capabilities
3. **Profile Analytics**: Detailed view analytics and insights
4. **Recommendations**: AI-powered job recommendations
5. **Messaging System**: Direct communication between employers and jobseekers