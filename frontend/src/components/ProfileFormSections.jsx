import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  GraduationCap,
  Plus,
  X,
  Code,
  Briefcase,
  Award,
  Target,
  Clock,
  DollarSign,
  Globe,
  Save,
  Eye,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.toString().trim().length >= minLength;
};

// Validation component
const ValidationMessage = ({ isValid, message, showSuccess = false }) => {
  if (isValid && !showSuccess) return null;

  return (
    <div className={`flex items-center mt-1 text-sm ${
      isValid ? 'text-green-600' : 'text-red-600'
    }`}>
      {isValid ? (
        <CheckCircle className="w-3 h-3 mr-1" />
      ) : (
        <AlertCircle className="w-3 h-3 mr-1" />
      )}
      {message}
    </div>
  );
};

export const BasicInfoSection = ({ profileData, handleInputChange, errors = {} }) => {
  const nameValid = validateRequired(profileData.name) && validateMinLength(profileData.name, 2);
  const emailValid = validateRequired(profileData.email) && validateEmail(profileData.email);
  const phoneValid = validateRequired(profileData.phone) && validatePhone(profileData.phone);
  const locationValid = validateRequired(profileData.location);

  return (
    <motion.div
      key="basic"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Full Name *
          </label>
          <input
            type="text"
            value={profileData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              profileData.name && !nameValid
                ? 'border-red-300 focus:border-red-500'
                : profileData.name && nameValid
                ? 'border-green-300 focus:border-green-500'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Enter your full name"
          />
          <ValidationMessage
            isValid={nameValid || !profileData.name}
            message={!validateRequired(profileData.name) ? "Name is required" : "Name must be at least 2 characters"}
            showSuccess={nameValid && profileData.name}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </label>
          <input
            type="email"
            value={profileData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              profileData.email && !emailValid
                ? 'border-red-300 focus:border-red-500'
                : profileData.email && emailValid
                ? 'border-green-300 focus:border-green-500'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Enter your email"
          />
          <ValidationMessage
            isValid={emailValid || !profileData.email}
            message={!validateRequired(profileData.email) ? "Email is required" : "Please enter a valid email address"}
            showSuccess={emailValid && profileData.email}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={profileData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              profileData.phone && !phoneValid
                ? 'border-red-300 focus:border-red-500'
                : profileData.phone && phoneValid
                ? 'border-green-300 focus:border-green-500'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Enter your phone number"
          />
          <ValidationMessage
            isValid={phoneValid || !profileData.phone}
            message={!validateRequired(profileData.phone) ? "Phone number is required" : "Please enter a valid phone number"}
            showSuccess={phoneValid && profileData.phone}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Current City Location *
          </label>
          <input
            type="text"
            value={profileData.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
              profileData.location && !locationValid
                ? 'border-red-300 focus:border-red-500'
                : profileData.location && locationValid
                ? 'border-green-300 focus:border-green-500'
                : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Enter your current city"
          />
          <ValidationMessage
            isValid={locationValid || !profileData.location}
            message="Location is required"
            showSuccess={locationValid && profileData.location}
          />
        </div>
      </div>

    {/* Resume Upload */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <FileText className="w-4 h-4 inline mr-2" />
        Resume
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 mb-2">Upload your resume (PDF, DOC, DOCX)</p>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          id="resume-upload"
          onChange={(e) => handleInputChange('resume', e.target.files[0])}
        />
        <label
          htmlFor="resume-upload"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          Choose File
        </label>
        {profileData.resume && (
          <p className="text-green-600 mt-2">✓ {profileData.resume.name}</p>
        )}
      </div>
    </div>
  </motion.div>
  );
};

export const QualificationsSection = ({
  profileData, 
  newSkill, 
  setNewSkill, 
  handleArrayAdd, 
  handleArrayRemove,
  addEducation,
  updateEducation,
  removeEducation,
  addWorkExperience,
  updateWorkExperience,
  removeWorkExperience,
  addCertification,
  updateCertification,
  removeCertification
}) => (
  <motion.div
    key="qualifications"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-8"
  >
    {/* Education */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <GraduationCap className="w-5 h-5 mr-2" />
          Education
        </h3>
        <button
          onClick={addEducation}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>
      
      {profileData.education.map((edu) => (
        <div key={edu.id} className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Degree (e.g., Bachelor's, Master's)"
              value={edu.degree}
              onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={edu.field}
              onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Institution Name"
              value={edu.institution}
              onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Graduation Year"
              value={edu.year}
              onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => removeEducation(edu.id)}
            className="mt-2 text-red-600 hover:text-red-800 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Remove</span>
          </button>
        </div>
      ))}
    </div>

    {/* Skills */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Code className="w-5 h-5 mr-2" />
          Skills
        </h3>
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Add a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleArrayAdd('skills', newSkill);
              setNewSkill('');
            }
          }}
        />
        <button
          onClick={() => {
            handleArrayAdd('skills', newSkill);
            setNewSkill('');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {profileData.skills.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
          >
            {skill}
            <button
              onClick={() => handleArrayRemove('skills', index)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

export const JobPreferencesSection = ({ 
  profileData, 
  newJobTitle, 
  setNewJobTitle, 
  handleArrayAdd, 
  handleArrayRemove,
  handleInputChange,
  jobTypeOptions,
  workScheduleOptions,
  remoteOptions
}) => (
  <motion.div
    key="preferences"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-8"
  >
    {/* Job Titles */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
        <Target className="w-5 h-5 mr-2" />
        Job Titles
      </h3>
      <p className="text-gray-600 mb-4">What job titles are you interested in?</p>
      
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Add a job title"
          value={newJobTitle}
          onChange={(e) => setNewJobTitle(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleArrayAdd('jobTitles', newJobTitle);
              setNewJobTitle('');
            }
          }}
        />
        <button
          onClick={() => {
            handleArrayAdd('jobTitles', newJobTitle);
            setNewJobTitle('');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {profileData.jobTitles.map((title, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
          >
            {title}
            <button
              onClick={() => handleArrayRemove('jobTitles', index)}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>

    {/* Job Types */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
        <Briefcase className="w-5 h-5 mr-2" />
        Job Types
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {jobTypeOptions.map((type) => (
          <label key={type} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={profileData.jobTypes.includes(type)}
              onChange={(e) => {
                if (e.target.checked) {
                  handleArrayAdd('jobTypes', type);
                } else {
                  const index = profileData.jobTypes.indexOf(type);
                  handleArrayRemove('jobTypes', index);
                }
              }}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{type}</span>
          </label>
        ))}
      </div>
    </div>
  </motion.div>
);

// Profile Preview Component
export const ProfilePreview = ({ profileData, onEdit }) => (
  <motion.div
    key="preview"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-8"
  >
    {/* Basic Information Preview */}
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Basic Information
        </h3>
        <button
          onClick={() => onEdit('basic')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-500">Full Name</span>
          <p className="font-medium">{profileData.name || 'Not provided'}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Email</span>
          <p className="font-medium">{profileData.email || 'Not provided'}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Phone</span>
          <p className="font-medium">{profileData.phone || 'Not provided'}</p>
        </div>
        <div>
          <span className="text-sm text-gray-500">Location</span>
          <p className="font-medium">{profileData.location || 'Not provided'}</p>
        </div>
      </div>

      {profileData.resume && (
        <div className="mt-4">
          <span className="text-sm text-gray-500">Resume</span>
          <p className="font-medium text-green-600">✓ {profileData.resume.name}</p>
        </div>
      )}
    </div>

    {/* Skills Preview */}
    {profileData.skills && profileData.skills.length > 0 && (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Skills
          </h3>
          <button
            onClick={() => onEdit('qualifications')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {profileData.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Education Preview */}
    {profileData.education && profileData.education.length > 0 && (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Education
          </h3>
          <button
            onClick={() => onEdit('qualifications')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
        </div>

        <div className="space-y-4">
          {profileData.education.map((edu, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">{edu.degree} in {edu.field}</h4>
              <p className="text-gray-600">{edu.institution}</p>
              <p className="text-sm text-gray-500">{edu.year}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Work Experience Preview */}
    {profileData.workExperience && profileData.workExperience.length > 0 && (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Work Experience
          </h3>
          <button
            onClick={() => onEdit('qualifications')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
        </div>

        <div className="space-y-4">
          {profileData.workExperience.map((exp, index) => (
            <div key={index} className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium">{exp.title}</h4>
              <p className="text-gray-600">{exp.company}</p>
              <p className="text-sm text-gray-500">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </p>
              {exp.description && (
                <p className="text-gray-700 mt-2">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Job Preferences Preview */}
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Job Preferences
        </h3>
        <button
          onClick={() => onEdit('preferences')}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileData.jobTitles && profileData.jobTitles.length > 0 && (
          <div>
            <span className="text-sm text-gray-500">Preferred Job Titles</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {profileData.jobTitles.map((title, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>
        )}

        {profileData.jobTypes && profileData.jobTypes.length > 0 && (
          <div>
            <span className="text-sm text-gray-500">Job Types</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {profileData.jobTypes.map((type, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        {profileData.minimumBasePay && (
          <div>
            <span className="text-sm text-gray-500">Minimum Base Pay</span>
            <p className="font-medium">₹{profileData.minimumBasePay} per month</p>
          </div>
        )}

        {profileData.remotePreferences && (
          <div>
            <span className="text-sm text-gray-500">Remote Work Preference</span>
            <p className="font-medium">{profileData.remotePreferences}</p>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);
