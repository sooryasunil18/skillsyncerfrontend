import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { dashboardApi } from '../utils/api';
import EnhancedJobseekerProfile from '../components/EnhancedJobseekerProfile';
import {
  BasicInfoSection,
  QualificationsSection,
  JobPreferencesSection,
  ProfilePreview
} from '../components/ProfileFormSections';
import {
  User,
  Settings,
  FileText,
  BarChart3,
  BookmarkIcon,
  Calendar,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  LogOut,
  Search,
  Bell,
  Star,
  Award,
  MapPin,
  Clock,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Target,
  Activity,
  Users,
  Menu,
  X,
  Home,
  UserCircle,
  Plus,
  Edit,
  Save,
  Upload,
  Download,
  Code,
  Languages,
  Shield,
  DollarSign,
  Globe,
  Eye,
  Loader,
  AlertTriangle
} from 'lucide-react';

const JobseekerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    // Initialize with localStorage data if available
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');
    if (storedUserName && storedUserEmail) {
      return {
        name: storedUserName,
        email: storedUserEmail
      };
    }
    return null;
  });
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showEnhancedProfile, setShowEnhancedProfile] = useState(false);

  // Profile form state
  const [profileActiveSection, setProfileActiveSection] = useState('basic');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null
  const [profileData, setProfileData] = useState({
    // Basic Information
    name: '',
    email: '',
    phone: '',
    location: '',
    resume: null,

    // Education
    education: [],

    // Skills
    skills: [],

    // Work Experience
    workExperience: [],

    // Certifications
    certifications: [],

    // Job Preferences
    jobTitles: [],
    jobTypes: [],
    workSchedule: [],
    minimumBasePay: '',
    relocationPreferences: [],
    remotePreferences: '',

    // Ready to work
    readyToWork: false
  });

  const [newSkill, setNewSkill] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');

  // Profile form options
  const jobTypeOptions = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Temporary'
  ];

  const workScheduleOptions = [
    'Day shift',
    'Night shift',
    'Morning shift',
    'Evening shift',
    'Rotational shift',
    'Flexible hours'
  ];

  const remoteOptions = [
    'Remote',
    'Hybrid work',
    'In-person'
  ];

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

  // Profile form handlers
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field, value) => {
    if (value.trim()) {
      setProfileData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const handleArrayRemove = (field, index) => {
    setProfileData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setProfileData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        degree: '',
        institution: '',
        year: '',
        field: ''
      }]
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

  const addWorkExperience = () => {
    setProfileData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        id: Date.now(),
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
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

  const addCertification = () => {
    setProfileData(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        id: Date.now(),
        name: '',
        issuer: '',
        date: '',
        expiryDate: '',
        credentialId: ''
      }]
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

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/jobseeker/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          profile: {
            phone: profileData.phone,
            location: profileData.location,
            resume: profileData.resume,
            education: profileData.education,
            skills: profileData.skills,
            workExperience: profileData.workExperience,
            certifications: profileData.certifications,
            jobTitles: profileData.jobTitles,
            jobTypes: profileData.jobTypes,
            workSchedule: profileData.workSchedule,
            minimumBasePay: profileData.minimumBasePay,
            relocationPreferences: profileData.relocationPreferences,
            remotePreferences: profileData.remotePreferences,
            readyToWork: profileData.readyToWork
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update user data with the response
        setUser(result.data.user);
        setDashboardData(prev => ({
          ...prev,
          profile: result.data.user
        }));

        const now = new Date();
        setLastSaved(now);
        localStorage.setItem('profileLastSaved', now.toISOString());
        setHasUnsavedChanges(false);
        setSaveStatus('success');

        // Refresh dashboard data to get updated quick actions
        fetchDashboardData();

        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        throw new Error(result.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const result = await dashboardApi.getJobseekerDashboard();

      if (result.success) {
        setDashboardData(result.data);
        setUser(result.data.profile);
        
        // Populate profile form with actual data
        if (result.data.profile) {
          setProfileData({
            name: result.data.profile.name || '',
            email: result.data.profile.email || '',
            phone: result.data.profile.phone || '',
            location: result.data.profile.location || '',
            resume: result.data.profile.resume || null,
            education: result.data.profile.education || [],
            skills: result.data.profile.skills || [],
            workExperience: result.data.profile.workExperience || [],
            certifications: result.data.profile.certifications || [],
            jobTitles: result.data.profile.jobTitles || [],
            jobTypes: result.data.profile.jobTypes || [],
            workSchedule: result.data.profile.workSchedule || [],
            minimumBasePay: result.data.profile.minimumBasePay || '',
            relocationPreferences: result.data.profile.relocationPreferences || [],
            remotePreferences: result.data.profile.remotePreferences || '',
            readyToWork: result.data.profile.readyToWork || false
          });
        }
        
        // Reset unsaved changes flag when loading fresh data
        setHasUnsavedChanges(false);
      } else {
        setError(result.data?.message || 'Failed to load dashboard');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError(error.message || 'Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    // Redirect to home page
    navigate('/', { replace: true });
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const sideNavItems = [
    {
      name: 'Dashboard',
      icon: Home,
      section: 'dashboard',
      current: activeSection === 'dashboard'
    },
    {
      name: 'Profile',
      icon: UserCircle,
      section: 'profile',
      current: activeSection === 'profile'
    },
    {
      name: 'Find Jobs',
      icon: Search,
      section: 'jobs',
      current: activeSection === 'jobs'
    },
    {
      name: 'Applications',
      icon: FileText,
      section: 'applications',
      current: activeSection === 'applications'
    },
    {
      name: 'Saved Jobs',
      icon: BookmarkIcon,
      section: 'saved',
      current: activeSection === 'saved'
    },
    {
      name: 'Settings',
      icon: Settings,
      section: 'settings',
      current: activeSection === 'settings'
    }
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        const sectionTabs = [
          { id: 'basic', name: 'Basic Info', icon: User },
          { id: 'qualifications', name: 'Qualifications', icon: GraduationCap },
          { id: 'preferences', name: 'Job Preferences', icon: Target },
          { id: 'view', name: 'View Profile', icon: Eye }
        ];

        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {isPreviewMode ? 'Profile Preview' : 'Complete Your Profile'}
                    </h2>
                    <div className="flex items-center space-x-4 mt-2">
                      <p className="text-blue-100">
                        {isPreviewMode ? 'Review your profile information' : 'Help employers find you with a complete profile'}
                      </p>
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

                      {profileActiveSection === 'view' && (
                        <ProfilePreview
                          profileData={profileData}
                          onEdit={null}
                        />
                      )}
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
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
                        <span>Error saving profile. Please try again.</span>
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
                      disabled={isSaving}
                      className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        isSaving
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isSaving ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      <span>{isSaving ? 'Saving...' : 'Update Profile'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );

      case 'jobs':
        return (
          <div className="space-y-8">
            {/* Job Search Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Search className="w-6 h-6 mr-3 text-blue-600" />
                Find Your Perfect Job
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Job title or keywords"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <input 
                    type="text" 
                    placeholder="Location"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option>All Industries</option>
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Education</option>
                  </select>
                </div>
                <div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium shadow-lg transition-all duration-200"
                  >
                    <Search className="w-5 h-5 inline mr-2" />
                    Search Jobs
                  </motion.button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm text-gray-600">Popular searches:</span>
                {['Remote Developer', 'Marketing Manager', 'Data Analyst', 'UX Designer', 'Project Manager'].map((tag) => (
                  <motion.button
                    key={tag}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Job Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Recommended for You
              </h3>
              
              <div className="space-y-4">
                {[
                  { title: 'Senior Software Engineer', company: 'TechCorp Inc.', location: 'San Francisco, CA', salary: '$120k - $160k', type: 'Full-time' },
                  { title: 'Product Manager', company: 'InnovateLab', location: 'New York, NY', salary: '$100k - $140k', type: 'Full-time' },
                  { title: 'UX Designer', company: 'DesignStudio', location: 'Remote', salary: '$80k - $110k', type: 'Contract' }
                ].map((job, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.01, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                    className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{job.title}</h4>
                        <p className="text-blue-600 font-medium">{job.company}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {job.type}
                          </span>
                          <span className="font-medium text-green-600">{job.salary}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <BookmarkIcon className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Apply
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        );
      
      case 'applications':
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-blue-600" />
                My Applications
              </h2>
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600">Start applying to jobs to see your applications here.</p>
              </div>
            </motion.div>
          </div>
        );
      
      case 'saved':
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BookmarkIcon className="w-6 h-6 mr-3 text-blue-600" />
                Saved Jobs
              </h2>
              <div className="text-center py-12">
                <BookmarkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Saved Jobs</h3>
                <p className="text-gray-600">Save interesting jobs to view them later.</p>
              </div>
            </motion.div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-blue-600" />
                Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive job alerts and updates</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Profile Visibility</h4>
                        <p className="text-sm text-gray-600">Make profile visible to recruiters</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input 
                          type="checkbox" 
                          defaultChecked 
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Check if user is logged in and is a jobseeker
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (userRole !== 'jobseeker') {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Professional Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-32 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-lg shadow-xl border-b border-white/20 lg:ml-64 relative z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-3 text-gray-600 hover:text-blue-600 transition-colors bg-white rounded-xl shadow-lg"
                onClick={toggleSidePanel}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
              
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {getGreeting()}, {user?.name?.split(' ')[0] || localStorage.getItem('userName')?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-gray-600 font-medium">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right mr-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                  <p className="text-sm font-bold text-gray-900">
                    Welcome back, <span className="text-blue-600">{user?.name?.split(' ')[0] || 'User'}</span>!
                  </p>
                  <p className="text-xs text-gray-600">
                    {activeSection === 'dashboard' ? '📊 Dashboard Overview' : 
                     activeSection === 'profile' ? '👤 Profile Management' :
                     activeSection === 'jobs' ? '🔍 Job Search' :
                     activeSection === 'applications' ? '📄 My Applications' :
                     activeSection === 'saved' ? '🔖 Saved Jobs' :
                     activeSection === 'settings' ? '⚙️ Account Settings' : '📊 Dashboard'}
                  </p>
                </div>
              </div>
              
              {/* Notification Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 text-gray-600 hover:text-blue-600 transition-colors bg-white/60 backdrop-blur-sm rounded-xl shadow-lg"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </span>
              </motion.button>

              {/* Settings Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-gray-600 hover:text-green-600 transition-colors bg-white/60 backdrop-blur-sm rounded-xl shadow-lg"
                title="Settings"
                onClick={() => setActiveSection('settings')}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {isSidePanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidePanel}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            />

            {/* Enhanced Mobile Side Panel */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-white/95 to-blue-50/95 backdrop-blur-xl shadow-2xl z-50 lg:hidden border-r border-white/20"
            >
              {/* Enhanced Panel Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-gray-900">SkillSyncer</span>
                    <p className="text-xs text-gray-600">Jobseeker Portal</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleSidePanel}
                  className="p-2.5 text-gray-400 hover:text-gray-600 transition-all duration-300 bg-white/60 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Enhanced Mobile User Info */}
              <div className="p-6 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="h-7 w-7 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{user?.name || localStorage.getItem('userName') || 'User'}</h3>
                    <p className="text-sm text-gray-600 truncate">{user?.email || localStorage.getItem('userEmail') || 'user@example.com'}</p>
                    <div className="flex items-center mt-1">
                      <div className="h-1.5 w-16 bg-gray-200 rounded-full mr-2">
                        <div 
                          className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500" 
                          style={{width: `${dashboardData?.profile?.completionPercentage || 0}%`}}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {dashboardData?.profile?.completionPercentage || 0}% Complete
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Mobile Navigation */}
              <nav className="flex-1 p-4">
                <div className="space-y-1">
                  {sideNavItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.button
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setActiveSection(item.section);
                          setIsSidePanelOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 group ${
                          item.current
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                            : 'text-gray-700 hover:bg-white/60 hover:shadow-md hover:text-blue-600'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                          item.current 
                            ? 'bg-white/20' 
                            : 'group-hover:bg-blue-100'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="font-medium">{item.name}</span>
                        {item.current && (
                          <motion.div
                            layoutId="mobileActiveIndicator"
                            className="ml-auto w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </nav>

              {/* Enhanced Mobile Sign Out */}
              <div className="p-4 border-t border-gray-200/50">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleLogout();
                    setIsSidePanelOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group"
                >
                  <div className="p-1.5 rounded-lg group-hover:bg-red-100 transition-all duration-300">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Sign Out</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Professional Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white/95 to-blue-50/95 backdrop-blur-xl shadow-2xl border-r border-white/20 hidden lg:block">
        {/* Professional Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">SkillSyncer</span>
              <p className="text-xs text-gray-600">Jobseeker Portal</p>
            </div>
          </div>
        </div>

        {/* Enhanced User Profile Section */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{user?.name || localStorage.getItem('userName') || 'User'}</h3>
              <p className="text-sm text-gray-600 truncate">{user?.email || localStorage.getItem('userEmail') || 'user@example.com'}</p>
              <div className="flex items-center mt-1">
                <div className="h-1.5 w-16 bg-gray-200 rounded-full mr-2">
                  <div 
                    className={`h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500`}
                    style={{width: `${dashboardData?.profile?.completionPercentage || 0}%`}}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">
                  {dashboardData?.profile?.completionPercentage || 0}% Complete
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {sideNavItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(item.section)}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 group ${
                    item.current
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-white/60 hover:shadow-md hover:text-blue-600'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                    item.current 
                      ? 'bg-white/20' 
                      : 'group-hover:bg-blue-100'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {item.current && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Enhanced Sign Out */}
        <div className="p-4 border-t border-gray-200/50">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group"
          >
            <div className="p-1.5 rounded-lg group-hover:bg-red-100 transition-all duration-300">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </div>
      </div>

      <div className="lg:ml-64 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        {activeSection !== 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <nav className="flex items-center space-x-2 text-sm">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveSection('dashboard')}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Dashboard
              </motion.button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium">
                {activeSection === 'profile' ? 'Profile' :
                 activeSection === 'jobs' ? 'Find Jobs' :
                 activeSection === 'applications' ? 'Applications' :
                 activeSection === 'saved' ? 'Saved Jobs' :
                 activeSection === 'settings' ? 'Settings' : 'Current Section'}
              </span>
            </nav>
          </motion.div>
        )}

        {activeSection === 'dashboard' ? (
          <>
            {/* Enhanced Profile Completion Alert */}
            {dashboardData?.profile?.completionPercentage < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Boost Your Profile! 🚀
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Complete your profile to unlock better job matches and increase visibility
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                        style={{ width: `${dashboardData.profile.completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {dashboardData.profile.completionPercentage}% Complete
                    </span>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEnhancedProfile(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200"
              >
                Complete Now
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Profile Completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Profile</p>
                    <p className={`text-3xl font-bold ${getCompletionColor(dashboardData?.profile?.completionPercentage || 75)}`}>
                      {dashboardData?.profile?.completionPercentage || 75}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: `${dashboardData?.profile?.completionPercentage || 75}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-sm"
                ></motion.div>
              </div>
              <p className="text-xs text-gray-500 font-medium">Complete your profile to get noticed</p>
            </div>
          </motion.div>

          {/* Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Applications</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {dashboardData?.stats?.applicationsSubmitted || 12}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="font-medium">+2 this week</span>
              </div>
            </div>
          </motion.div>

          {/* Saved Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <BookmarkIcon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Saved Jobs</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {dashboardData?.stats?.jobsSaved || 8}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
                <Star className="w-4 h-4 mr-2" />
                <span className="font-medium">Browse more jobs</span>
              </div>
            </div>
          </motion.div>

          {/* Interviews */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-14 w-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Interviews</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {dashboardData?.stats?.interviewsScheduled || 3}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-sm text-orange-600 bg-orange-50 rounded-lg px-3 py-2">
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-medium">Next: Tomorrow 2PM</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
          >
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Profile Overview
                </h2>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-6">
                <div className="h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900">{user?.name || localStorage.getItem('userName') || 'User'}</h3>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2" />
                    {user?.email || localStorage.getItem('userEmail') || 'user@example.com'}
                  </p>
                  {user?.phone && (
                    <p className="text-gray-600 flex items-center mt-1">
                      <Phone className="w-4 h-4 mr-2" />
                      {user.phone}
                    </p>
                  )}
                  {user?.location && (
                    <p className="text-gray-600 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-2" />
                      {user.location}
                    </p>
                  )}
                  
                  {user?.bio && (
                    <p className="text-gray-700 mt-3 p-3 bg-gray-50 rounded-lg">{user.bio}</p>
                  )}
                  
                  {/* Skills Section */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Skills & Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user?.skills?.length > 0 ? (
                        user.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200 hover:shadow-md transition-all duration-200"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm italic">No skills added yet - Add skills to improve your profile!</span>
                      )}
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 grid grid-cols-2 gap-6">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="flex items-center">
                        <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-medium text-gray-700">Experience</span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {user?.experience || 'Not specified'}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <div className="flex items-center">
                        <GraduationCap className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium text-gray-700">Education</span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {user?.education || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Quick Actions & Recent Activity */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
            >
              <div className="p-6 border-b border-gray-200/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Quick Actions
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {/* Dynamic Quick Actions based on profile completion */}
                {dashboardData?.quickActions?.length > 0 ? (
                  dashboardData.quickActions.map((action, index) => {
                    const getActionIcon = (iconName) => {
                      const icons = {
                        'user': User,
                        'code': Code,
                        'file-text': FileText,
                        'map-pin': MapPin,
                        'phone': Phone,
                        'briefcase': Briefcase,
                        'camera': User, // fallback
                        'link': Globe,
                        'settings': Settings,
                        'award': Award
                      };
                      return icons[iconName] || User;
                    };

                    const ActionIcon = getActionIcon(action.icon);
                    const priorityColors = {
                      high: 'from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600',
                      medium: 'from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
                      low: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
                    };

                    return (
                      <motion.button
                        key={action.id}
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveSection('profile')}
                        className={`w-full bg-gradient-to-r ${priorityColors[action.priority]} text-white rounded-xl py-3 px-4 flex items-center justify-center font-medium transition-all duration-200 shadow-lg`}
                      >
                        <ActionIcon className="w-4 h-4 mr-2" />
                        {action.title}
                      </motion.button>
                    );
                  })
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection('profile')}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl py-3 px-4 flex items-center justify-center font-medium transition-all duration-200 shadow-lg"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Complete Profile
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection('jobs')}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-xl py-3 px-4 flex items-center justify-center font-medium transition-all duration-200 shadow-lg"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Find Jobs
                    </motion.button>
                  </>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection('applications')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl py-3 px-4 flex items-center justify-center font-medium transition-all duration-200 shadow-lg"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Applications
                </motion.button>
              </div>
            </motion.div>

            {/* Career Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20"
            >
              <div className="p-6 border-b border-gray-200/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-orange-600" />
                  Career Achievements
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Profile Optimizer</p>
                      <p className="text-xs text-gray-600">Completed profile setup</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                    <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Active Seeker</p>
                      <p className="text-xs text-gray-600">Regular platform engagement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Team Player</p>
                      <p className="text-xs text-gray-600">Strong collaboration skills</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

            {/* Enhanced Footer */}
            <motion.footer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">SkillSyncer</h3>
                    <p className="text-sm text-gray-600">Your career growth partner</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Last updated: {formatTime(currentTime)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    © 2024 SkillSyncer. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.footer>
          </>
        ) : (
          renderSectionContent()
        )}
      </div>

      {/* Enhanced Profile Modal */}
      {showEnhancedProfile && (
        <EnhancedJobseekerProfile
          onClose={() => setShowEnhancedProfile(false)}
          initialData={dashboardData?.profile || {}}
        />
      )}
    </div>
  );
};

export default JobseekerDashboard;