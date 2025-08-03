import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BasicInfoSection, 
  QualificationsSection, 
  JobPreferencesSection, 
  ProfilePreview,
  validateEmail,
  validatePhone,
  validateRequired,
  validateMinLength
} from './ProfileFormSections';
import {
  User,
  GraduationCap,
  Target,
  Save,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader
} from 'lucide-react';

const EnhancedJobseekerProfile = ({ onClose, initialData = {} }) => {
  const [profileActiveSection, setProfileActiveSection] = useState('basic');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    resume: null,
    skills: [],
    education: [],
    workExperience: [],
    certifications: [],
    jobTitles: [],
    jobTypes: [],
    workSchedule: [],
    minimumBasePay: '',
    relocationPreferences: [],
    remotePreferences: '',
    readyToWork: false,
    ...initialData
  });

  // Form state
  const [newSkill, setNewSkill] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');

  // Options
  const jobTypeOptions = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship', 'Temporary'];
  const workScheduleOptions = ['Day shift', 'Night shift', 'Morning shift', 'Evening shift', 'Rotational shift', 'Flexible hours'];
  const remoteOptions = ['Remote', 'Hybrid work', 'In-person'];

  // Load last saved time from localStorage
  useEffect(() => {
    const savedTime = localStorage.getItem('profileLastSaved');
    if (savedTime) {
      setLastSaved(new Date(savedTime));
    }
  }, []);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [profileData]);

  // Validation functions
  const validateBasicInfo = () => {
    const nameValid = validateRequired(profileData.name) && validateMinLength(profileData.name, 2);
    const emailValid = validateRequired(profileData.email) && validateEmail(profileData.email);
    const phoneValid = validateRequired(profileData.phone) && validatePhone(profileData.phone);
    const locationValid = validateRequired(profileData.location);
    
    return nameValid && emailValid && phoneValid && locationValid;
  };

  const getProfileCompleteness = () => {
    let completed = 0;
    let total = 8;

    if (validateBasicInfo()) completed++;
    if (profileData.skills.length > 0) completed++;
    if (profileData.education.length > 0) completed++;
    if (profileData.workExperience.length > 0) completed++;
    if (profileData.jobTitles.length > 0) completed++;
    if (profileData.jobTypes.length > 0) completed++;
    if (profileData.minimumBasePay) completed++;
    if (profileData.remotePreferences) completed++;

    return Math.round((completed / total) * 100);
  };

  // Event handlers
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field, value) => {
    if (value && value.trim()) {
      setProfileData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field, index) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Education handlers
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: '',
      field: '',
      institution: '',
      year: ''
    };
    setProfileData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Work experience handlers
  const addWorkExperience = () => {
    const newExperience = {
      id: Date.now(),
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setProfileData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newExperience]
    }));
  };

  const updateWorkExperience = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeWorkExperience = (id) => {
    setProfileData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id)
    }));
  };

  // Certification handlers
  const addCertification = () => {
    const newCertification = {
      id: Date.now(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: ''
    };
    setProfileData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCertification]
    }));
  };

  const updateCertification = (id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (id) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  // Save functionality
  const handleSaveProfile = async () => {
    if (!validateBasicInfo()) {
      setSaveStatus('error');
      setProfileActiveSection('basic');
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would make the actual API call
      // const response = await fetch('/api/profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData)
      // });

      const now = new Date();
      setLastSaved(now);
      localStorage.setItem('profileLastSaved', now.toISOString());
      setHasUnsavedChanges(false);
      setSaveStatus('success');
      
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const sectionTabs = [
    { id: 'basic', name: 'Basic Info', icon: User },
    { id: 'qualifications', name: 'Qualifications', icon: GraduationCap },
    { id: 'preferences', name: 'Job Preferences', icon: Target }
  ];

  const completeness = getProfileCompleteness();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {isPreviewMode ? 'Profile Preview' : 'Complete Your Profile'}
              </h2>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                  <span className="text-sm">{completeness}% complete</span>
                </div>
                
                {lastSaved && (
                  <div className="flex items-center space-x-1 text-blue-100 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                {isPreviewMode ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
              </button>
              
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Only show in edit mode */}
        {!isPreviewMode && (
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex space-x-0">
              {sectionTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setProfileActiveSection(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                    profileActiveSection === tab.id
                      ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {isPreviewMode ? (
              <ProfilePreview
                profileData={profileData}
                onEdit={(section) => {
                  setIsPreviewMode(false);
                  setProfileActiveSection(section);
                }}
              />
            ) : (
              <>
                {profileActiveSection === 'basic' && (
                  <BasicInfoSection
                    profileData={profileData}
                    handleInputChange={handleInputChange}
                  />
                )}

                {profileActiveSection === 'qualifications' && (
                  <QualificationsSection
                    profileData={profileData}
                    newSkill={newSkill}
                    setNewSkill={setNewSkill}
                    handleArrayAdd={handleArrayAdd}
                    handleArrayRemove={handleArrayRemove}
                    addEducation={addEducation}
                    updateEducation={updateEducation}
                    removeEducation={removeEducation}
                    addWorkExperience={addWorkExperience}
                    updateWorkExperience={updateWorkExperience}
                    removeWorkExperience={removeWorkExperience}
                    addCertification={addCertification}
                    updateCertification={updateCertification}
                    removeCertification={removeCertification}
                  />
                )}

                {profileActiveSection === 'preferences' && (
                  <JobPreferencesSection
                    profileData={profileData}
                    newJobTitle={newJobTitle}
                    setNewJobTitle={setNewJobTitle}
                    handleArrayAdd={handleArrayAdd}
                    handleArrayRemove={handleArrayRemove}
                    handleInputChange={handleInputChange}
                    jobTypeOptions={jobTypeOptions}
                    workScheduleOptions={workScheduleOptions}
                    remoteOptions={remoteOptions}
                  />
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Ready to work checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ready-to-work"
                  checked={profileData.readyToWork}
                  onChange={(e) => handleInputChange('readyToWork', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="ready-to-work" className="text-sm font-medium text-gray-700">
                  I'm ready to work immediately
                </label>
              </div>

              {/* Unsaved changes indicator */}
              {hasUnsavedChanges && (
                <div className="flex items-center space-x-1 text-amber-600 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Unsaved changes</span>
                </div>
              )}

              {/* Save status */}
              {saveStatus === 'success' && (
                <div className="flex items-center space-x-1 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Profile saved successfully!</span>
                </div>
              )}

              {saveStatus === 'error' && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Error saving profile. Please check required fields.</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {!isPreviewMode && (
                <button
                  onClick={() => setIsPreviewMode(true)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
              )}

              <button
                onClick={handleSaveProfile}
                disabled={isSaving || !validateBasicInfo()}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  isSaving || !validateBasicInfo()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSaving ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedJobseekerProfile;
