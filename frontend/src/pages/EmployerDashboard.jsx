import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Navigate } from 'react-router-dom';
import InternshipPostingForm from '../components/InternshipPostingForm';
import MentorRequestForm from '../components/MentorRequestForm';
import { employerApi } from '../utils/api';
import { API_BASE_URL } from '../config/api';
import {
  Users,
  Building,
  Briefcase,
  FileText,
  Settings,
  Bell,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Activity,
  TrendingUp,
  UserCheck,
  Calendar,
  MapPin,
  DollarSign,
  Award,
  Target,
  CheckCircle,
  X,
  Menu,
  Home,
  LogOut,
  BarChart3,
  Clock,
  Star,
  Filter,
  Download,
  Share2,
  MessageSquare,
  Zap,
  Globe,
  Smartphone,
  Mail,
  Phone,
  ExternalLink,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Shield,
  Crown,
  Sparkles,
  Rocket,
  Heart,
  Bookmark,
  User,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">We encountered an error while loading the dashboard.</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Reload Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const EmployerDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [internships, setInternships] = useState([]);
  const [showInternshipForm, setShowInternshipForm] = useState(false);
  const [editingInternship, setEditingInternship] = useState(null);
  const [viewingInternship, setViewingInternship] = useState(null);
  const [loadingInternships, setLoadingInternships] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [internshipToDelete, setInternshipToDelete] = useState(null);
  
  // Applications state
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationFilters, setApplicationFilters] = useState({
    status: '',
    internshipId: '',
    search: ''
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({ applicationId: null, newStatus: '', notes: '' });
  const [showMentorRequestForm, setShowMentorRequestForm] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  
  // Mentor requests state
  const [mentorRequests, setMentorRequests] = useState([]);
  const [loadingMentorRequests, setLoadingMentorRequests] = useState(false);
  const [mentorRequestFilters, setMentorRequestFilters] = useState({
    status: '',
    search: ''
  });
  const [selectedMentorRequest, setSelectedMentorRequest] = useState(null);
  const [showMentorRequestModal, setShowMentorRequestModal] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = React.useRef(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        
        // Get user info from localStorage
        const userRole = localStorage.getItem('userRole');
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        const token = localStorage.getItem('token');
        
        if (!token || !userRole || (userRole !== 'employer' && userRole !== 'company')) {
          navigate('/auth');
          return;
        }

        setUser({
          name: userName,
          email: userEmail,
          role: userRole
        });

        // Enhanced mock dashboard data for employer
        setDashboardData({
          stats: {
            activeInternships: 12,
            totalApplications: 245,
            shortlistedCount: 0,
            rejectedCount: 0,
            totalViews: 1847,
            responseRate: 76,
            avgTimeToHire: 14,
            topSkillsInDemand: ['React', 'Node.js', 'Python', 'AWS']
          },
          chartData: {
            applicationsThisMonth: [65, 78, 82, 95, 102, 118, 125, 142, 158, 165, 178, 185, 192, 208, 215, 228, 235, 245],
            hiringPipeline: {
              applied: 245,
              screening: 89,
              interview: 34,
              finalRound: 12,
              offer: 8,
              hired: 6
            },
            topPerformingJobs: [
              { title: 'Senior Full Stack Developer', applications: 45, quality: 92 },
              { title: 'DevOps Engineer', applications: 38, quality: 88 },
              { title: 'UX/UI Designer', applications: 42, quality: 85 },
              { title: 'Product Manager', applications: 35, quality: 90 }
            ]
          },
          recentApplications: [
            { 
              id: 1, 
              candidateName: 'Sarah Chen', 
              position: 'Senior Full Stack Developer', 
              appliedDate: '2024-01-15', 
              status: 'interview',
              experience: '5+ years',
              skills: ['React', 'Node.js', 'AWS'],
              location: 'San Francisco, CA',
              avatar: '👩‍💻'
            },
            { 
              id: 2, 
              candidateName: 'Marcus Rodriguez', 
              position: 'DevOps Engineer', 
              appliedDate: '2024-01-14', 
              status: 'pending',
              experience: '3+ years',
              skills: ['Docker', 'Kubernetes', 'AWS'],
              location: 'Austin, TX',
              avatar: '👨‍💻'
            },
            { 
              id: 3, 
              candidateName: 'Emily Watson', 
              position: 'UX Designer', 
              appliedDate: '2024-01-13', 
              status: 'hired',
              experience: '4+ years',
              skills: ['Figma', 'User Research', 'Prototyping'],
              location: 'Remote',
              avatar: '👩‍🎨'
            },
            { 
              id: 4, 
              candidateName: 'David Kim', 
              position: 'Product Manager', 
              appliedDate: '2024-01-12', 
              status: 'interview',
              experience: '6+ years',
              skills: ['Agile', 'Analytics', 'Strategy'],
              location: 'Seattle, WA',
              avatar: '👨‍💼'
            }
          ],
          activeInternshipsList: [
            { 
              id: 1, 
              title: 'Senior Full Stack Developer', 
              applications: 45, 
              views: 287, 
              posted: '2024-01-10', 
              status: 'active',
              urgency: 'high',
              department: 'Engineering',
              salary: '$120k - $160k'
            },
            { 
              id: 2, 
              title: 'DevOps Engineer', 
              applications: 38, 
              views: 203, 
              posted: '2024-01-08', 
              status: 'active',
              urgency: 'medium',
              department: 'Engineering',
              salary: '$110k - $140k'
            },
            { 
              id: 3, 
              title: 'UX/UI Designer', 
              applications: 42, 
              views: 189, 
              posted: '2024-01-05', 
              status: 'active',
              urgency: 'low',
              department: 'Design',
              salary: '$90k - $120k'
            }
          ],
          insights: [
            {
              title: "Peak Application Times",
              description: "Most applications come in between 9AM-11AM on weekdays",
              icon: Clock,
              trend: "up"
            },
            {
              title: "Top Referral Sources",
              description: "LinkedIn drives 60% of quality applications",
              icon: Globe,
              trend: "up"
            },
            {
              title: "Interview Success Rate",
              description: "76% of interviewed candidates receive offers",
              icon: TrendingUp,
              trend: "up"
            }
          ]
        });

        // Fetch real recent applications for the dashboard overview
        try {
          const appsResponse = await employerApi.getDetailedApplications({ page: 1, limit: 5 });
          const payload = appsResponse?.data?.success ? appsResponse.data.data : appsResponse.data;
          const applicationsArray = Array.isArray(payload?.applications) ? payload.applications : (Array.isArray(payload) ? payload : []);
          if (Array.isArray(applicationsArray) && applicationsArray.length > 0) {
            const recent = applicationsArray.slice(0, 4).map(app => ({
              id: app._id,
              candidateName: app.personalDetails?.fullName || app?.jobseeker?.name || 'Candidate',
              position: app.internshipDetails?.title || app?.internship?.title || 'Internship',
              appliedDate: app.appliedAt ? new Date(app.appliedAt).toISOString().slice(0, 10) : '',
              status: app.status || 'pending',
              experience: typeof app.workExperience?.totalYearsExperience === 'number' ? `${app.workExperience.totalYearsExperience}+ years` : '',
              skills: Array.isArray(app.skills?.technicalSkills) ? app.skills.technicalSkills.slice(0, 3) : [],
              location: app.internshipId?.location || app.internshipDetails?.location || '',
              avatar: '👤'
            }));
            setDashboardData(prev => ({
              ...(prev || {}),
              recentApplications: recent,
              stats: {
                ...(prev?.stats || {}),
                totalApplications: (payload?.pagination?.totalItems) || applicationsArray.length || 0,
              }
            }));
          }
        } catch (e) {
          console.log('Failed to load recent applications for dashboard:', e.message);
        }

        // Update time every minute
        const timeInterval = setInterval(() => {
          setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timeInterval);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setError('Failed to initialize dashboard. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const token = localStorage.getItem('token');
      const resp = await fetch(`${API_BASE_URL}/api/employer/employees`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await resp.json();
      if (data?.success) {
        setEmployees(data.data || []);
      }
    } catch (e) {
      // non-fatal
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'employees') {
      loadEmployees();
    }
  }, [activeSection]);

  // Load internships when internships section is active or when component mounts
  useEffect(() => {
    if (activeSection === 'internships') {
      loadInternships();
    }
  }, [activeSection]);

  // Load applications when applications section is active
  useEffect(() => {
    if (activeSection === 'applications') {
      loadApplications();
    }
  }, [activeSection, applicationFilters]);

  // Load mentor requests when mentor-requests section is active
  useEffect(() => {
    if (activeSection === 'mentor-requests') {
      loadMentorRequests();
    }
  }, [activeSection, mentorRequestFilters]);

  // Load internships on component mount if user is already on internships section
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'employer' || userRole === 'company') {
      loadInternships();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/');
  };

  // Load internships with better error handling
  const loadInternships = async () => {
    setLoadingInternships(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoadingInternships(false);
        return;
      }

      console.log('Loading internships...');
      const response = await employerApi.getInternships();
      console.log('Internships response:', response);
      
      if (response.success && response.data) {
        // Handle double-wrapped response: apiRequest wraps backend response
        const internshipsData = response.data.success ? response.data.data : response.data;
        console.log('Internships data:', internshipsData);
        console.log('Is array:', Array.isArray(internshipsData));
        console.log('Number of internships:', Array.isArray(internshipsData) ? internshipsData.length : 0);
        
        if (Array.isArray(internshipsData)) {
          setInternships(internshipsData);
          // Update dashboard counts based on backend data
          setDashboardData(prev => ({
            ...(prev || {}),
            stats: {
              ...(prev?.stats || {}),
              activeInternships: internshipsData.filter(i => i.status === 'active').length || 0,
              totalApplications: internshipsData.reduce((sum, i) => sum + (Array.isArray(i.applications) ? i.applications.length : 0), 0) || 0
            }
          }));

          console.log('Successfully set internships:', internshipsData.length, 'items');
          if (internshipsData.length > 0) {
            setSuccessMessage(`Successfully loaded ${internshipsData.length} internship posting${internshipsData.length > 1 ? 's' : ''}`);
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
          }
        } else {
          console.warn('Response data is not an array:', internshipsData);
          setInternships([]);
        }
      } else {
        console.error('Failed to load internships:', response.data?.message || response.message || 'No data received');
        setError(`Failed to load internships: ${response.data?.message || response.message || 'No data received'}`);
        setInternships([]);
        // Clear error message after 5 seconds
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error loading internships:', error);
      setError(`Error loading internships: ${error.message || 'Network error'}`);
      setInternships([]);
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoadingInternships(false);
    }
  };

  // Load applications with filters
  const loadApplications = async () => {
    setLoadingApplications(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoadingApplications(false);
        return;
      }

      console.log('Loading applications...');
      const response = await employerApi.getDetailedApplications(applicationFilters);
      console.log('Applications response:', response);
      
      if (response.success && response.data) {
        const payload = response.data.success ? response.data.data : response.data;
        const applicationsArray = Array.isArray(payload?.applications) ? payload.applications : (Array.isArray(payload) ? payload : []);
        console.log('Applications data (normalized):', applicationsArray);
        setApplications(applicationsArray);
        // Update KPIs from applications by status
        const shortlisted = applicationsArray.filter(a => a.status === 'shortlisted').length;
        const rejected = applicationsArray.filter(a => a.status === 'rejected').length;
        setDashboardData(prev => ({
          ...(prev || {}),
          stats: {
            ...(prev?.stats || {}),
            totalApplications: (payload?.pagination?.totalItems) || applicationsArray.length || 0,
            shortlistedCount: shortlisted,
            rejectedCount: rejected,
          },
          recentApplications: applicationsArray.slice(0, 4).map(app => ({
            id: app._id,
            candidateName: app.personalDetails?.fullName || app?.jobseeker?.name || 'Candidate',
            position: app.internshipDetails?.title || app?.internship?.title || 'Internship',
            appliedDate: app.appliedAt ? new Date(app.appliedAt).toISOString().slice(0, 10) : '',
            status: app.status || 'pending',
            experience: typeof app.workExperience?.totalYearsExperience === 'number' ? `${app.workExperience.totalYearsExperience}+ years` : '',
            skills: Array.isArray(app.skills?.technicalSkills) ? app.skills.technicalSkills.slice(0, 3) : [],
            location: app.internshipId?.location || app.internshipDetails?.location || '',
            avatar: '👤'
          }))
        }));
      } else {
        console.error('Failed to load applications:', response.data?.message || response.message || 'No data received');
        setError(`Failed to load applications: ${response.data?.message || response.message || 'No data received'}`);
        setApplications([]);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setError(`Error loading applications: ${error.message || 'Network error'}`);
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  // Load mentor requests with filters
  const loadMentorRequests = async () => {
    setLoadingMentorRequests(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        setLoadingMentorRequests(false);
        return;
      }

      const response = await employerApi.getMentorRequests(mentorRequestFilters);
      if (response.success && response.data) {
        const payload = response.data.success ? response.data.data : response.data;
        const requestsArray = Array.isArray(payload?.requests) ? payload.requests : (Array.isArray(payload) ? payload : []);
        setMentorRequests(requestsArray);
      } else {
        console.error('Failed to load mentor requests:', response.data?.message || response.message || 'No data received');
        setError(`Failed to load mentor requests: ${response.data?.message || response.message || 'No data received'}`);
        setMentorRequests([]);
      }
    } catch (error) {
      console.error('Error loading mentor requests:', error);
      setError(`Error loading mentor requests: ${error.message || 'Network error'}`);
      setMentorRequests([]);
    } finally {
      setLoadingMentorRequests(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, status, notes = '') => {
    try {
      const response = await employerApi.updateApplicationStatus(applicationId, status, notes);
      if (response.success) {
        setSuccessMessage(`Application ${status} successfully!`);
        setTimeout(() => setSuccessMessage(null), 3000);
        loadApplications(); // Reload applications
      } else {
        setError(`Failed to update application: ${response.data?.message || response.message}`);
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      setError(`Error updating application: ${error.message}`);
      setTimeout(() => setError(null), 5000);
    }
  };

  // Handle status update with modal
  const handleStatusUpdate = (applicationId, newStatus) => {
    setStatusUpdateData({ applicationId, newStatus, notes: '' });
    setShowStatusModal(true);
  };

  // Confirm status update
  const confirmStatusUpdate = async () => {
    await updateApplicationStatus(statusUpdateData.applicationId, statusUpdateData.newStatus, statusUpdateData.notes);
    setShowStatusModal(false);
    setStatusUpdateData({ applicationId: null, newStatus: '', notes: '' });
  };

  // View full application details
  const viewApplicationDetails = async (applicationId) => {
    try {
      const response = await employerApi.getApplicationDetails(applicationId);
      if (response.success && response.data) {
        const payload = response.data.success ? response.data.data : response.data;
        setSelectedApplication(payload);
      } else {
        // Fallback to existing item from list
        setSelectedApplication(applications.find(a => a._id === applicationId) || null);
      }
    } catch (e) {
      // Fallback to existing item from list on error
      setSelectedApplication(applications.find(a => a._id === applicationId) || null);
    } finally {
      setShowApplicationModal(true);
    }
  };

  // Handle internship form success
  const handleInternshipSuccess = (internship) => {
    // Show success message
    const isEditing = editingInternship !== null;
    const message = isEditing 
      ? 'Internship posting updated successfully!' 
      : 'Internship posting created successfully!';
    
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
    
    // Reload internships to get the latest data from the database
    loadInternships();
    setEditingInternship(null);
    setShowInternshipForm(false);
  };

  // Handle internship form cancel
  const handleInternshipCancel = () => {
    setShowInternshipForm(false);
    setEditingInternship(null);
  };

  // View internship details
  const handleViewInternship = (internship) => {
    setViewingInternship(internship);
  };

  // Edit internship
  const handleEditInternship = (internship) => {
    setEditingInternship(internship);
    setShowInternshipForm(true);
  };

  // Delete internship - show confirmation dialog
  const handleDeleteInternship = (internshipId) => {
    setInternshipToDelete(internshipId);
    setShowDeleteConfirmation(true);
  };

  // Confirm delete internship
  const confirmDeleteInternship = async () => {
    if (!internshipToDelete) return;
    
    try {
      const response = await employerApi.deleteInternship(internshipToDelete);
      if (response.success && (response.data.success || response.data.message)) {
        setSuccessMessage('Internship posting deleted successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
        // Reload internships to get the latest data from the database
        loadInternships();
      } else {
        setError(response.data?.message || response.message || 'Failed to delete internship');
        setTimeout(() => setError(null), 5000);
      }
    } catch (error) {
      console.error('Error deleting internship:', error);
      setError('Failed to delete internship. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setShowDeleteConfirmation(false);
      setInternshipToDelete(null);
    }
  };

  // Cancel delete internship
  const cancelDeleteInternship = () => {
    setShowDeleteConfirmation(false);
    setInternshipToDelete(null);
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
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

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const navigationItems = [
    { name: 'Dashboard', icon: Home, section: 'dashboard', current: activeSection === 'dashboard' },
    { name: 'Company Profile', icon: Building, section: 'profile', current: activeSection === 'profile' },
    { name: 'Internship Postings', icon: Plus, section: 'internships', current: activeSection === 'internships' },
    { name: 'Applications Received', icon: FileText, section: 'applications', current: activeSection === 'applications' },
    { name: 'Mentor Requests', icon: UserCheck, section: 'mentor-requests', current: activeSection === 'mentor-requests' },
    { name: 'Employees', icon: Users, section: 'employees', current: activeSection === 'employees' }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'employees':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-blue-600" />
                  Employees
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadEmployees}
                  disabled={loadingEmployees}
                  className="bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 inline mr-2 ${loadingEmployees ? 'animate-spin' : ''}`} />
                  Refresh
                </motion.button>
              </div>
              {loadingEmployees ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading employees...</p>
                  </div>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Employees Found</h3>
                  <p className="text-gray-600">Approved employee requests will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                  <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-gray-600">
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Name</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Email</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Joined</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {employees.map((emp) => (
                        <tr key={emp._id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 whitespace-nowrap text-gray-900 font-medium">{emp.name}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-gray-600">{emp.email}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-gray-600">{emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : '-'}</td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${emp.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {emp.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        );
      case 'internships':
        return (
          <div className="space-y-8">
            {showInternshipForm ? (
              <InternshipPostingForm
                onSuccess={handleInternshipSuccess}
                onCancel={handleInternshipCancel}
                editData={editingInternship}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Plus className="w-6 h-6 mr-3 text-blue-600" />
                    Manage Internship Postings
                  </h2>
                  
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={loadInternships}
                      disabled={loadingInternships}
                      className="bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 inline mr-2 ${loadingInternships ? 'animate-spin' : ''}`} />
                      Refresh
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowInternshipForm(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Post New Internship
                    </motion.button>
                  </div>
                </div>
                
                {/* Success Message Display */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-green-800">Success</h3>
                        <p className="text-sm text-green-700 mt-1">{successMessage}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-red-800">Error Loading Internships</h3>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                        <button
                          onClick={loadInternships}
                          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                        >
                          Try again
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {loadingInternships ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading internship postings...</p>
                    </div>
                  </div>
                ) : (!Array.isArray(internships) || internships.length === 0) ? (
                  <div className="text-center py-12">
                    <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Internship Postings Yet</h3>
                    <p className="text-gray-600 mb-6">Create your first internship posting to start attracting talented interns.</p>
                    <div className="flex items-center justify-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowInternshipForm(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Plus className="w-4 h-4 inline mr-2" />
                        Create First Internship
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={loadInternships}
                        className="bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <RefreshCw className="w-4 h-4 inline mr-2" />
                        Refresh
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(internships) && internships.map((internship, index) => (
                      <motion.div
                        key={internship._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{internship.title || 'Untitled Internship'}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                internship.status === 'active' ? 'bg-green-100 text-green-800' : 
                                internship.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                internship.status === 'closed' ? 'bg-red-100 text-red-800' :
                                internship.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {internship.status || 'active'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-6 mb-3 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                {internship.companyName || user?.name || 'Company Name'}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {internship.location || 'Location'}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {internship.duration || 'Duration'}
                              </span>
                              <span className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {internship.availableSeats || 0}/{internship.totalSeats || 1} seats
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Industry: {internship.industry || 'Not specified'}</span>
                              <span>Mode: {internship.mode || 'Not specified'}</span>
                              <span>Posted: {internship.postedAt ? new Date(internship.postedAt).toLocaleDateString() : 'Recently'}</span>
                              {internship.applicationsCount > 0 && (
                                <span className="flex items-center">
                                  <FileText className="w-4 h-4 mr-1" />
                                  {internship.applicationsCount} applications
                                </span>
                              )}
                            </div>
                            {internship.skillsRequired && internship.skillsRequired.length > 0 && (
                              <div className="flex items-center space-x-2 mt-3">
                                <span className="text-sm text-gray-600">Skills:</span>
                                <div className="flex flex-wrap gap-1">
                                  {internship.skillsRequired.slice(0, 3).map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                      {skill}
                                    </span>
                                  ))}
                                  {internship.skillsRequired.length > 3 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                      +{internship.skillsRequired.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleViewInternship(internship)}
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleEditInternship(internship)}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleDeleteInternship(internship._id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        );

      case 'post-job':
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Plus className="w-6 h-6 mr-3 text-blue-600" />
                Post New Job
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Senior Frontend Developer"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Engineering</option>
                      <option>Design</option>
                      <option>Product</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>HR</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                    <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      placeholder="San Francisco, CA or Remote"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary</label>
                      <input 
                        type="number" 
                        placeholder="80000"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary</label>
                      <input 
                        type="number" 
                        placeholder="120000"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                    <textarea 
                      rows="6"
                      placeholder="Describe the role, responsibilities, and what you're looking for..."
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                    <textarea 
                      rows="4"
                      placeholder="List required skills, experience, education..."
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                    <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>Entry Level (0-1 years)</option>
                      <option>Junior (1-3 years)</option>
                      <option>Mid Level (3-5 years)</option>
                      <option>Senior (5-8 years)</option>
                      <option>Lead (8+ years)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Post Job
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-200 text-gray-700 py-3 px-8 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
                >
                  Save as Draft
                </motion.button>
              </div>
            </motion.div>
          </div>
        );

      case 'jobs':
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Briefcase className="w-6 h-6 mr-3 text-blue-600" />
                  Manage Internships
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection('post-job')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Post New Internship
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {dashboardData?.activeInternshipsList?.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {job.views} views
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {job.applications} applications
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Posted {new Date(job.posted).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 text-gray-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
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
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-blue-600" />
                  Internship Applications
                </h2>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadApplications}
                    disabled={loadingApplications}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 inline mr-2 ${loadingApplications ? 'animate-spin' : ''}`} />
                    Refresh
                  </motion.button>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={applicationFilters.status}
                    onChange={(e) => setApplicationFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Selected</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internship</label>
                  <select
                    value={applicationFilters.internshipId}
                    onChange={(e) => setApplicationFilters(prev => ({ ...prev, internshipId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Internships</option>
                    {internships.map(internship => (
                      <option key={internship._id} value={internship._id}>
                        {internship.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    value={applicationFilters.search}
                    onChange={(e) => setApplicationFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Search by name or email..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {loadingApplications ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-600">Applications for your internships will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                  <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-gray-600">
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Candidate</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Email</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Internship</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Applied</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Experience</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {applications.map((application) => (
                        <tr key={application._id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 whitespace-nowrap font-medium text-gray-900">{application.personalDetails?.fullName || 'N/A'}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-gray-600">{application.personalDetails?.emailAddress || 'N/A'}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-blue-600">{application.internshipDetails?.title || 'Internship'}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-gray-600">{new Date(application.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-3 whitespace-nowrap text-gray-600">{
                            (application.workExperience?.totalYearsExperience ?? 0) <= 0
                              ? 'Fresher'
                              : `${application.workExperience.totalYearsExperience} yrs`
                          }</td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              application.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                              application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {application.status || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                onClick={() => viewApplicationDetails(application._id)}
                              >
                                <Eye className="h-4 w-4" /> View
                              </button>
                              {application.status === 'pending' && (
                                <>
                                  <button
                                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                    onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                                  >
                                    <CheckCircle className="h-4 w-4" /> Shortlist
                                  </button>
                                  <button
                                    className="inline-flex items-center gap-1 text-red-600 hover:underline"
                                    onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                  >
                                    <X className="h-4 w-4" /> Reject
                                  </button>
                                </>
                              )}
                              {application.status === 'shortlisted' && (
                                <>
                                  <button
                                    className="inline-flex items-center gap-1 text-green-600 hover:underline"
                                    onClick={() => handleStatusUpdate(application._id, 'accepted')}
                                  >
                                    <Award className="h-4 w-4" /> Select
                                  </button>
                                  <button
                                    className="inline-flex items-center gap-1 text-red-600 hover:underline"
                                    onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                  >
                                    <X className="h-4 w-4" /> Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Building className="w-6 h-6 mr-3 text-blue-600" />
                Company Profile
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input 
                      type="text" 
                      value={user?.name || ''}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      value={user?.email || ''}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 bg-gray-50"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                    <input 
                      type="url" 
                      placeholder="https://yourcompany.com"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                    <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option>51-200 employees</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                    <textarea 
                      rows="6"
                      placeholder="Tell candidates about your company, culture, and mission..."
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      placeholder="San Francisco, CA"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Building className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Upload your company logo</p>
                      <input type="file" className="hidden" accept="image/*" />
                      <button className="mt-2 text-blue-600 hover:text-blue-500">Choose file</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Update Profile
                </motion.button>
              </div>
            </motion.div>
          </div>
        );

      case 'mentor-requests':
        const totalRequests = mentorRequests.length;
        const pendingRequests = mentorRequests.filter(req => req.status === 'pending').length;
        const approvedRequests = mentorRequests.filter(req => req.status === 'approved').length;
        const rejectedRequests = mentorRequests.filter(req => req.status === 'rejected').length;

        return (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <UserCheck className="w-6 h-6 mr-3 text-indigo-600" />
                  Mentor Requests
                  <span className="ml-3 inline-flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 text-indigo-700">{totalRequests} total</span>
                    {pendingRequests > 0 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">{pendingRequests} pending</span>
                    )}
                  </span>
                </h2>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMentorRequests}
                    disabled={loadingMentorRequests}
                    className="bg-white text-gray-700 px-4 py-2 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <RefreshCw className={`w-4 h-4 inline mr-2 ${loadingMentorRequests ? 'animate-spin' : ''}`} />
                    Refresh
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMentorRequestForm(true)}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Submit Mentor Request</span>
                  </motion.button>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Request Employee as Mentor</h3>
                    <p className="text-blue-700 text-sm">
                      Submit a request to assign one of your employees as a mentor. The admin will review and approve the request.
                    </p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={mentorRequestFilters.status}
                    onChange={(e) => setMentorRequestFilters(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by employee name or email..."
                      className="border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm w-64 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400"
                      value={mentorRequestFilters.search}
                      onChange={(e) => setMentorRequestFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium">Total Requests</p>
                      <p className="text-3xl font-bold">{totalRequests}</p>
                    </div>
                    <FileText className="w-8 h-8 text-indigo-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium">Pending</p>
                      <p className="text-3xl font-bold">{pendingRequests}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Approved</p>
                      <p className="text-3xl font-bold">{approvedRequests}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">Rejected</p>
                      <p className="text-3xl font-bold">{rejectedRequests}</p>
                    </div>
                    <X className="w-8 h-8 text-red-200" />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentor Requests</h3>
                {error && (
                  <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">{error}</div>
                )}
                {loadingMentorRequests ? (
                  <div className="text-center py-10">
                    <div className="inline-flex items-center space-x-2 text-gray-600">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Loading mentor requests...</span>
                    </div>
                  </div>
                ) : mentorRequests.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-10 text-center border border-dashed border-gray-200">
                    <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-1 font-medium">No mentor requests submitted yet</p>
                    <p className="text-gray-500 mb-4 text-sm">Create your first request to get started.</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowMentorRequestForm(true)}
                      className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Submit Your First Request
                    </motion.button>
                  </div>
                ) : (
                  <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
                    <table className="min-w-full text-sm divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr className="text-left text-gray-600">
                          <th className="py-3 pr-4 font-semibold text-xs uppercase tracking-wide">Employee</th>
                          <th className="py-3 pr-4 font-semibold text-xs uppercase tracking-wide">Email</th>
                          <th className="py-3 pr-4 font-semibold text-xs uppercase tracking-wide">Experience</th>
                          <th className="py-3 pr-4 font-semibold text-xs uppercase tracking-wide">Status</th>
                          <th className="py-3 pr-4 font-semibold text-xs uppercase tracking-wide">Submitted</th>
                          <th className="py-3 pr-4 font-semibold text-xs uppercase tracking-wide">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {mentorRequests.map(request => (
                          <tr key={request._id} className="hover:bg-gray-50">
                            <td className="py-3 pr-4 font-medium whitespace-nowrap">{request.employeeName}</td>
                            <td className="py-3 pr-4 whitespace-nowrap">{request.employeeEmail}</td>
                            <td className="py-3 pr-4 whitespace-nowrap">{request.yearsOfExperience}</td>
                            <td className="py-3 pr-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 pr-4 whitespace-nowrap">{new Date(request.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 pr-4 whitespace-nowrap">
                              <button
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                onClick={() => {
                                  setSelectedMentorRequest(request);
                                  setShowMentorRequestModal(true);
                                }}
                              >
                                <Eye className="h-4 w-4" /> View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  // Check if user is logged in and is an employer
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading employer dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== 'employer' && user.role !== 'company') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 relative">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200 lg:ml-56 relative">
        <div className="px-3 sm:px-5 lg:px-6 py-3 lg:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-2 lg:p-3 text-gray-600 hover:text-blue-600 transition-colors bg-white rounded-xl shadow-md"
                onClick={toggleSidePanel}
              >
                <Menu className="w-5 h-5" />
              </motion.button>

              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="h-10 w-10 lg:h-14 lg:w-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow">
                  <span className="inline-flex items-center justify-center h-10 w-10 lg:h-14 lg:w-14 rounded-full bg-white/10 ring-2 ring-white/20">
                    <Building className="h-5 w-5 lg:h-7 lg:w-7 text-white" />
                  </span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 tracking-tight">
                    {getGreeting()}, <span className="text-blue-700">{user?.name?.split(' ')[0] || localStorage.getItem('userName')?.split(' ')[0] || 'Company'}</span>
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {formatDate(currentTime)} • {formatTime(currentTime)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="hidden sm:flex items-center mr-2">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs font-medium">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  System Online
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-600 hover:text-blue-700 transition-colors bg-white rounded-lg border border-gray-200 shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-green-700 transition-colors bg-white rounded-lg border border-gray-200 shadow-sm"
                title="Refresh Dashboard"
                onClick={() => window.location.reload()}
              >
                <Activity className="w-5 h-5" />
              </motion.button>

              {/* Profile avatar with dropdown */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  Welcome back, <span className="text-blue-700">{user?.name?.split(' ')[0] || 'Company'}</span>
                </p>
                <p className="text-xs text-gray-600">
                  {activeSection === 'dashboard' ? 'Dashboard Overview' :
                   activeSection === 'internships' ? 'Manage Internship Postings' :
                   activeSection === 'post-job' ? 'Post New Job' :
                   activeSection === 'applications' ? 'Applications Received' :
                   activeSection === 'profile' ? 'Company Profile' : 'Dashboard'}
                </p>
                </div>
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(prev => !prev)}
                  className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center ring-2 ring-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  title="Profile"
                >
                  <span className="text-sm font-semibold">
                    {(user?.name || localStorage.getItem('userName') || 'C').slice(0,1).toUpperCase()}
                  </span>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                    <button
                      onClick={() => { setIsProfileMenuOpen(false); setActiveSection('profile'); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => { setIsProfileMenuOpen(false); navigate('/settings'); }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => { setIsProfileMenuOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidePanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidePanel}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 w-56 bg-white shadow-sm z-40 hidden lg:block border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-center h-20 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">SkillSyncer</span>
                <p className="text-xs text-indigo-100">Employer Portal</p>
              </div>
            </div>
          </div>

          {/* User Info removed per request */}

          {/* Desktop Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveSection(item.section)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    item.current
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {item.section === 'applications' && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full"></span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: isSidePanelOpen ? 0 : '-100%' }}
        className="fixed inset-y-0 left-0 z-50 w-56 bg-white shadow-2xl border-r border-gray-200 lg:hidden"
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SkillSyncer</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-white/80 hover:text-white bg-white/10 rounded-lg"
              onClick={toggleSidePanel}
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Mobile User Info removed per request */}

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveSection(item.section);
                    setIsSidePanelOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    item.current
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                  {item.section === 'applications' && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">12</span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Mobile Sign Out Button */}
          <div className="p-4 border-t border-gray-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                handleLogout();
                setIsSidePanelOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quick Navigation Bar - Mobile/Tablet */}
      <div className="lg:ml-56 bg-white/80 backdrop-blur-sm border-b border-gray-200 lg:hidden">
        <div className="px-4 py-3">
          <div className="flex space-x-1 overflow-x-auto">
            {navigationItems.map((item) => (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  item.current
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
                {item.section === 'applications' && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    12
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:ml-56 max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-3 lg:py-6">
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
                {activeSection === 'internships' ? 'Internship Postings' :
                 activeSection === 'post-job' ? 'Post Job' :
                 activeSection === 'jobs' ? 'Manage Jobs' :
                 activeSection === 'applications' ? 'Applications' :
                 activeSection === 'candidates' ? 'Candidates' :
                 activeSection === 'analytics' ? 'Analytics' :
                 activeSection === 'profile' ? 'Company Profile' :
                 activeSection === 'settings' ? 'Settings' : 'Current Section'}
              </span>
            </nav>
          </motion.div>
        )}

        {/* Application Details Modal */}
        <AnimatePresence>
          {showApplicationModal && selectedApplication && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowApplicationModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-white rounded-t-2xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                  <button
                    onClick={() => setShowApplicationModal(false)}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-4 space-y-3 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Candidate:</span> {selectedApplication.personalDetails?.fullName || 'N/A'}
                  </p>
                  <p>
                    <span className="font-semibold">Position:</span> {selectedApplication.internshipDetails?.title || selectedApplication.internshipId?.title || 'Internship'}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <p className="flex items-center"><Mail className="w-4 h-4 mr-1" /> {selectedApplication.personalDetails?.emailAddress || '—'}</p>
                    <p className="flex items-center"><Phone className="w-4 h-4 mr-1" /> {selectedApplication.personalDetails?.contactNumber || '—'}</p>
                    <p className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {selectedApplication.internshipId?.location || '—'}</p>
                    <p className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {selectedApplication.internshipId?.duration || selectedApplication.internshipDetails?.duration || '—'}</p>
                  </div>

                  {selectedApplication.additionalInfo?.resumeUrl && (
                    <div className="mt-4">
                      <a href={selectedApplication.additionalInfo.resumeUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                        View Submitted Resume
                      </a>
                    </div>
                  )}

                  {/* Internship details extra */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <p><span className="font-semibold">Type:</span> {selectedApplication.internshipDetails?.type || '—'}</p>
                    <p><span className="font-semibold">Start Date:</span> {selectedApplication.internshipDetails?.startDate ? new Date(selectedApplication.internshipDetails.startDate).toLocaleDateString() : '—'}</p>
                    <p><span className="font-semibold">Work Mode:</span> {selectedApplication.internshipDetails?.workMode || selectedApplication.internshipId?.mode || '—'}</p>
                    <p><span className="font-semibold">Eligibility:</span> {selectedApplication.internshipDetails?.eligibility || '—'}</p>
                  </div>

                  {/* Education Details */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <p><span className="font-semibold">Qualification:</span> {selectedApplication.educationDetails?.highestQualification || '—'}</p>
                      <p><span className="font-semibold">Institution:</span> {selectedApplication.educationDetails?.institutionName || '—'}</p>
                      <p><span className="font-semibold">Graduation Year:</span> {selectedApplication.educationDetails?.yearOfGraduation || '—'}</p>
                      <p><span className="font-semibold">CGPA/Percentage:</span> {selectedApplication.educationDetails?.cgpaPercentage || '—'}</p>
                    </div>
                  </div>

                  {/* Work Experience */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Work Experience</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <p><span className="font-semibold">Total Years:</span> {(() => {
                      const yrs = selectedApplication.workExperience?.totalYearsExperience;
                      if (yrs === null || yrs === undefined) return '—';
                      return yrs <= 0 ? 'Fresher' : `${yrs} years`;
                    })()}</p>
                      <p><span className="font-semibold">Company:</span> {selectedApplication.workExperience?.currentLastCompany || '—'}</p>
                      <p><span className="font-semibold">Designation:</span> {selectedApplication.workExperience?.currentLastDesignation || '—'}</p>
                    </div>
                    {selectedApplication.workExperience?.relevantExperienceDescription && (
                      <p className="mt-2"><span className="font-semibold">Description:</span> {selectedApplication.workExperience.relevantExperienceDescription}</p>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Skills</h4>
                    <p><span className="font-semibold">Technical:</span> {Array.isArray(selectedApplication.skills?.technicalSkills) && selectedApplication.skills.technicalSkills.length > 0 ? selectedApplication.skills.technicalSkills.join(', ') : '—'}</p>
                    <p className="mt-1"><span className="font-semibold">Soft:</span> {Array.isArray(selectedApplication.skills?.softSkills) && selectedApplication.skills.softSkills.length > 0 ? selectedApplication.skills.softSkills.join(', ') : '—'}</p>
                  </div>

                  {/* Projects */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Projects</h4>
                    {Array.isArray(selectedApplication.projects) && selectedApplication.projects.length > 0 ? (
                      <div className="space-y-2">
                        {selectedApplication.projects.map((proj, i) => (
                          <div key={i} className="border border-gray-200 rounded-lg p-3">
                            <p><span className="font-semibold">Name:</span> {proj.projectName || '—'}</p>
                            <p><span className="font-semibold">Role:</span> {proj.role || '—'}</p>
                            <p><span className="font-semibold">Duration:</span> {proj.duration || '—'}</p>
                            <p><span className="font-semibold">Technologies:</span> {Array.isArray(proj.technologiesUsed) && proj.technologiesUsed.length > 0 ? proj.technologiesUsed.join(', ') : '—'}</p>
                            {proj.description && <p><span className="font-semibold">Description:</span> {proj.description}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>—</p>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Additional Info</h4>
                    <p><span className="font-semibold">Why Join:</span> {selectedApplication.additionalInfo?.whyJoinInternship || '—'}</p>
                    {selectedApplication.additionalInfo?.achievementsCertifications && (
                      <p className="mt-1"><span className="font-semibold">Achievements/Certifications:</span> {selectedApplication.additionalInfo.achievementsCertifications}</p>
                    )}
                    {selectedApplication.additionalInfo?.portfolioUrl && (
                      <p className="mt-1"><span className="font-semibold">Portfolio:</span> <a href={selectedApplication.additionalInfo.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{selectedApplication.additionalInfo.portfolioUrl}</a></p>
                    )}
                  </div>

                  {/* Declarations */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Declarations</h4>
                    <p><span className="font-semibold">Information Truthful:</span> {selectedApplication.declarations?.informationTruthful ? 'Yes' : 'No'}</p>
                    <p><span className="font-semibold">Consent To Share:</span> {selectedApplication.declarations?.consentToShare ? 'Yes' : 'No'}</p>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedApplication.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      selectedApplication.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                      selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      selectedApplication.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedApplication.status || 'pending'}
                    </span>
                    {selectedApplication.status === 'pending' || selectedApplication.status === 'shortlisted' ? (
                      <div className="flex items-center space-x-2">
                        {selectedApplication.status === 'pending' && (
                          <motion.button whileHover={{ scale: 1.05 }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors" onClick={() => { handleStatusUpdate(selectedApplication._id, 'shortlisted'); }}>
                            <CheckCircle className="w-4 h-4 inline mr-1" /> Shortlist
                          </motion.button>
                        )}
                        {selectedApplication.status === 'shortlisted' && (
                          <motion.button whileHover={{ scale: 1.05 }} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors" onClick={() => { handleStatusUpdate(selectedApplication._id, 'accepted'); }}>
                            <Award className="w-4 h-4 inline mr-1" /> Select
                          </motion.button>
                        )}
                        {(selectedApplication.status === 'pending' || selectedApplication.status === 'shortlisted') && (
                          <motion.button whileHover={{ scale: 1.05 }} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors" onClick={() => { handleStatusUpdate(selectedApplication._id, 'rejected'); }}>
                            <X className="w-4 h-4 inline mr-1" /> Reject
                          </motion.button>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mentor Request Details Modal */}
        <AnimatePresence>
          {showMentorRequestModal && selectedMentorRequest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => setShowMentorRequestModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Mentor Request Details</h3>
                  <button onClick={() => setShowMentorRequestModal(false)} className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-sm text-gray-700">
                  {/* Employee Information */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Employee Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <p><span className="font-semibold">Name:</span> {selectedMentorRequest.employeeName}</p>
                      <p><span className="font-semibold">Email:</span> {selectedMentorRequest.employeeEmail}</p>
                      <p><span className="font-semibold">Phone:</span> {selectedMentorRequest.employeePhone}</p>
                    {/* Position and Department hidden per request */}
                      <p><span className="font-semibold">Experience:</span> {selectedMentorRequest.yearsOfExperience}</p>
                    </div>
                  </div>

                  {/* Expertise Areas */}
                  {selectedMentorRequest.expertise && selectedMentorRequest.expertise.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Expertise Areas</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMentorRequest.expertise.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Justification */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Justification for Mentorship</h4>
                    <p className="bg-gray-50 rounded-lg p-3 border border-gray-100">{selectedMentorRequest.justification}</p>
                  </div>

                  {/* Request Information */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Request Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <p><span className="font-semibold">Submitted:</span> {new Date(selectedMentorRequest.createdAt).toLocaleDateString()}</p>
                      <p><span className="font-semibold">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedMentorRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          selectedMentorRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedMentorRequest.status.charAt(0).toUpperCase() + selectedMentorRequest.status.slice(1)}
                        </span>
                      </p>
                      {selectedMentorRequest.reviewedAt && (
                        <p><span className="font-semibold">Reviewed:</span> {new Date(selectedMentorRequest.reviewedAt).toLocaleDateString()}</p>
                      )}
                      {selectedMentorRequest.reviewedBy && (
                        <p><span className="font-semibold">Reviewed By:</span> {selectedMentorRequest.reviewedBy.name || 'Admin'}</p>
                      )}
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {selectedMentorRequest.adminNotes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Admin Notes</h4>
                      <p className="bg-blue-50 border border-blue-200 rounded-lg p-3">{selectedMentorRequest.adminNotes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeSection === 'dashboard' ? (
          <>
            {/* Dashboard Section Header */}
            <div className="mb-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                Dashboard Overview
              </h2>
              <p className="text-gray-600">
                Welcome to your employer dashboard. Here's an overview of your hiring activities.
              </p>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="relative bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 lg:w-20 lg:h-20 bg-blue-50 rounded-full -mr-8 lg:-mr-10 -mt-8 lg:-mt-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <div className="h-10 w-10 lg:h-14 lg:w-14 rounded-xl lg:rounded-2xl flex items-center justify-center bg-blue-50 border border-blue-100">
                      <Briefcase className="h-5 w-5 lg:h-7 lg:w-7 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-xs lg:text-sm text-blue-700 font-medium mb-1">
                        <ArrowUpRight className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                        +12%
                      </div>
                      <span className="text-xs text-gray-500">vs last week</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Active Internships</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                      {dashboardData?.stats?.activeInternships || 0}
                    </p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 lg:h-2">
                      <div className="bg-blue-600 h-1.5 lg:h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ y: -5 }}
                className="relative bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-full -mr-10 -mt-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-emerald-50 border border-emerald-100">
                      <Users className="h-7 w-7 text-emerald-600" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-emerald-700 font-medium mb-1">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        +24%
                      </div>
                      <span className="text-xs text-gray-500">vs last week</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {dashboardData?.stats?.totalApplications || 0}
                    </p>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ y: -5 }}
                className="relative bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-full -mr-10 -mt-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-orange-50 border border-orange-100">
                      <Calendar className="h-7 w-7 text-orange-600" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-orange-700 font-medium mb-1">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        +5
                      </div>
                      <span className="text-xs text-gray-500">this week</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Shortlisted</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {dashboardData?.stats?.shortlistedCount || 0}
                    </p>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ y: -5 }}
                className="relative bg-white rounded-3xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -mr-10 -mt-10"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-purple-50 border border-purple-100">
                      <Crown className="h-7 w-7 text-purple-600" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-purple-700 font-medium mb-1">
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        +3
                      </div>
                      <span className="text-xs text-gray-500">this month</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {dashboardData?.stats?.rejectedCount || 0}
                    </p>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Secondary Stats Row removed per request */}

            {/* Enhanced Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Quick Actions</h3>
                  <p className="text-gray-600">Streamline your hiring process with one-click actions</p>
                </div>
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection('internships')}
                  className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="relative">
                    <Plus className="w-8 h-8 mb-3" />
                    <p className="font-bold text-lg mb-1">Post Internship</p>
                    <p className="text-sm opacity-90">Create and publish internship openings</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection('applications')}
                  className="relative bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="relative">
                    <FileText className="w-8 h-8 mb-3" />
                    <p className="font-bold text-lg mb-1">Review Applications</p>
                    <p className="text-sm opacity-90">Manage candidate applications</p>
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      12
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection('analytics')}
                  className="relative bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="relative">
                    <BarChart3 className="w-8 h-8 mb-3" />
                    <p className="font-bold text-lg mb-1">View Analytics</p>
                    <p className="text-sm opacity-90">Hiring insights & metrics</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection('internships')}
                  className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="relative">
                    <Briefcase className="w-8 h-8 mb-3" />
                    <p className="font-bold text-lg mb-1">Manage Internships</p>
                    <p className="text-sm opacity-90">Edit & monitor internship posts</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>

            {/* Enhanced Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-8">
              {/* Recent Applications - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="xl:col-span-2 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Recent Applications</h3>
                    <p className="text-gray-600">Latest candidate applications for review</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Filter className="w-4 h-4 text-gray-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {dashboardData?.recentApplications?.map((application, index) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                          {application.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{application.candidateName}</h4>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-600">{application.experience}</span>
                          </div>
                          <p className="text-blue-600 font-medium text-sm mb-1">{application.position}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {application.location}
                            </span>
                            <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-2">
                            {application.skills.slice(0, 3).map((skill, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wide ${
                          application.status === 'hired' ? 'bg-green-100 text-green-800' :
                          application.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <ArrowUpRight className="w-4 h-4 text-blue-600" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Hiring Pipeline & Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="space-y-6"
              >
                {/* Hiring Pipeline */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-purple-600" />
                    Hiring Pipeline
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(dashboardData?.chartData?.hiringPipeline || {}).map(([stage, count], index) => (
                      <div key={stage} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-indigo-500' :
                            index === 2 ? 'bg-purple-500' :
                            index === 3 ? 'bg-pink-500' :
                            index === 4 ? 'bg-green-500' : 'bg-emerald-500'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700 capitalize">{stage}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Insights */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-amber-600" />
                    Key Insights
                  </h3>
                  <div className="space-y-4">
                    {dashboardData?.insights?.map((insight, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100">
                        <div className="flex items-start space-x-3">
                          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <insight.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">{insight.title}</h4>
                            <p className="text-xs text-gray-600">{insight.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Footer */}
            <motion.footer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-16 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">SkillSyncer Employer</h3>
                    <p className="text-gray-600">Your hiring success partner</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">System Online</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center lg:text-left">
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-3">
                      <p className="text-lg font-bold text-blue-600">{dashboardData?.stats?.activeInternships || 0}</p>
                      <p className="text-xs text-gray-600">Active Internships</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3">
                      <p className="text-lg font-bold text-green-600">{dashboardData?.stats?.totalApplications || 0}</p>
                      <p className="text-xs text-gray-600">Applications</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Last updated: {formatTime(currentTime)}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatDate(currentTime)}
                    </p>
                    <div className="flex items-center justify-end space-x-2 text-xs text-gray-500">
                      <Shield className="w-3 h-3" />
                      <span>© 2024 SkillSyncer. All rights reserved.</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Footer Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export Data</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share Report</span>
                    </motion.button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">4.9/5 Platform Rating</span>
                  </div>
                </div>
              </div>
            </motion.footer>
          </>
        ) : (
          renderSectionContent()
        )}
      </div>
    </div>

    {/* View Internship Details Modal */}
    <AnimatePresence>
      {viewingInternship && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setViewingInternship(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Internship Details</h2>
                <button
                  onClick={() => setViewingInternship(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Title</label>
                        <p className="text-gray-900">{viewingInternship.title}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Company</label>
                        <p className="text-gray-900">{viewingInternship.companyName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Industry</label>
                        <p className="text-gray-900">{viewingInternship.industry}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Location</label>
                        <p className="text-gray-900 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {viewingInternship.location}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Mode</label>
                        <p className="text-gray-900">{viewingInternship.mode}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline & Capacity</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Duration</label>
                        <p className="text-gray-900 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {viewingInternship.duration}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Start Date</label>
                        <p className="text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {viewingInternship.startDate ? new Date(viewingInternship.startDate).toLocaleDateString() : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Last Date to Apply</label>
                        <p className="text-gray-900 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {viewingInternship.lastDateToApply ? new Date(viewingInternship.lastDateToApply).toLocaleDateString() : 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Available Seats</label>
                        <p className="text-gray-900 flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {viewingInternship.availableSeats || 0} / {viewingInternship.totalSeats || 1}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          viewingInternship.status === 'active' ? 'bg-green-100 text-green-800' : 
                          viewingInternship.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          viewingInternship.status === 'closed' ? 'bg-red-100 text-red-800' :
                          viewingInternship.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {viewingInternship.status || 'active'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{viewingInternship.description}</p>
                  </div>
                </div>

                {/* Skills Required */}
                {viewingInternship.skillsRequired && viewingInternship.skillsRequired.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingInternship.skillsRequired.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligibility */}
                {viewingInternship.eligibility && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Eligibility Criteria</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{viewingInternship.eligibility}</p>
                    </div>
                  </div>
                )}

                {/* Stipend */}
                {viewingInternship.stipend && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Stipend</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-gray-700 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {viewingInternship.stipend.currency} {viewingInternship.stipend.amount?.toLocaleString()} 
                        <span className="ml-2 text-sm text-gray-600">({viewingInternship.stipend.type})</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {viewingInternship.benefits && viewingInternship.benefits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                    <div className="space-y-2">
                      {viewingInternship.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {viewingInternship.certifications && viewingInternship.certifications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications Offered</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingInternship.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center"
                        >
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Posted Date */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Posted on: {viewingInternship.postedAt ? new Date(viewingInternship.postedAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setViewingInternship(null);
                    handleEditInternship(viewingInternship);
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4 inline mr-2" />
                  Edit Internship
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewingInternship(null)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Delete Confirmation Modal */}
    <AnimatePresence>
      {showDeleteConfirmation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={cancelDeleteInternship}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Confirm Deletion
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <p className="text-gray-700 text-base leading-relaxed">
                Are you sure you want to delete this internship posting? This action cannot be undone and will permanently remove the posting along with all associated applications.
              </p>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={cancelDeleteInternship}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmDeleteInternship}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Posting
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Mentor Request Form Modal */}
    {showMentorRequestForm && (
      <MentorRequestForm
        onClose={() => setShowMentorRequestForm(false)}
        onSuccess={(data) => {
          setShowMentorRequestForm(false);
          setSuccessMessage('Mentor request submitted successfully!');
          // Refresh mentor requests if we're on the mentor-requests section
          if (activeSection === 'mentor-requests') {
            loadMentorRequests();
          }
        }}
      />
    )}

    {/* Status Update Modal */}
    {showStatusModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowStatusModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">
                Update Application Status
              </h3>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={statusUpdateData.newStatus}
                onChange={(e) => setStatusUpdateData(prev => ({ ...prev, newStatus: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={statusUpdateData.notes}
                onChange={(e) => setStatusUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes for the candidate..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowStatusModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmStatusUpdate}
                disabled={!statusUpdateData.newStatus}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Status
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}

    </ErrorBoundary>
  );
};

export default EmployerDashboard;