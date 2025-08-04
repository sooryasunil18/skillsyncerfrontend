import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  User,
  Building,
  Briefcase,
  Settings,
  LogOut,
  BarChart3,
  PieChart,
  Activity,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Bell,
  Menu,
  X,
  Home,
  Star,
  Award,
  Target,
  Zap,
  Globe,
  DollarSign,
  GraduationCap,
  Plus
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentUsersLoading, setRecentUsersLoading] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [mentorFormData, setMentorFormData] = useState({
    name: '',
    email: '',
    password: '',
    expertise: '',
    experience: '',
    bio: '',
    phone: '',
    location: ''
  });
  const navigate = useNavigate();

  // API Functions
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filters.role && { role: filters.role }),
        ...(filters.status && { status: filters.status })
      });

      const response = await fetch(`http://localhost:5001/api/admin/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      setRecentUsersLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/admin/users?page=1&limit=5&sortBy=createdAt&sortOrder=desc', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setRecentUsers(data.data.users);
      }
    } catch (error) {
      console.error('Error fetching recent users:', error);
    } finally {
      setRecentUsersLoading(false);
    }
  };

  const fetchCompanies = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      const response = await fetch(`http://localhost:5001/api/admin/companies?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setCompanies(data.data.companies);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        role: 'mentor'
      });

      const response = await fetch(`http://localhost:5001/api/admin/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setMentors(data.data.users);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const addMentor = async (mentorData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/admin/mentors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: mentorData.name,
          email: mentorData.email,
          password: mentorData.password,
          mentorProfile: {
            bio: mentorData.bio,
            expertise: mentorData.expertise ? [mentorData.expertise] : [],
            yearsOfExperience: mentorData.experience,
            location: mentorData.location,
            phone: mentorData.phone
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        setShowMentorForm(false);
        setMentorFormData({
          name: '',
          email: '',
          password: '',
          expertise: '',
          experience: '',
          bio: '',
          phone: '',
          location: ''
        });
        fetchMentors(currentPage);
        
        // Show custom success popup
        setSuccessMessage('Mentor added successfully! Username & password will be mailed shortly.');
        setShowSuccessPopup(true);
      } else {
        alert(data.message || 'Error adding mentor');
      }
    } catch (error) {
      console.error('Error adding mentor:', error);
      alert('Error adding mentor');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, isActive) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers(currentPage);
        if (activeSection === 'mentors') {
          fetchMentors(currentPage);
        }
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch data on component mount and section change
  useEffect(() => {
    fetchStats();
    fetchRecentUsers(); // Always fetch recent users for dashboard
    if (activeSection === 'users') {
      fetchUsers(currentPage);
    } else if (activeSection === 'companies') {
      fetchCompanies(currentPage);
    } else if (activeSection === 'mentors') {
      fetchMentors(currentPage);
    }
  }, [activeSection, currentPage, filters]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/auth');
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleMentorFormChange = (key, value) => {
    setMentorFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleMentorFormSubmit = (e) => {
    e.preventDefault();
    if (!mentorFormData.name || !mentorFormData.email || !mentorFormData.password || !mentorFormData.expertise) {
      alert('Please fill in all required fields');
      return;
    }
    addMentor(mentorFormData);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sidebarItems = [
    { id: 'overview', name: 'Overview', icon: Home, color: 'from-blue-500 to-blue-600' },
    { id: 'users', name: 'Users', icon: Users, color: 'from-green-500 to-green-600' },
    { id: 'companies', name: 'Companies', icon: Building, color: 'from-purple-500 to-purple-600' },
    { id: 'mentors', name: 'Mentors', icon: GraduationCap, color: 'from-indigo-500 to-indigo-600' },
    { id: 'jobs', name: 'Jobs', icon: Briefcase, color: 'from-orange-500 to-orange-600' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'from-pink-500 to-pink-600' },
    { id: 'settings', name: 'Settings', icon: Settings, color: 'from-gray-500 to-gray-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-white shadow-lg relative transition-all duration-300 border-r border-gray-200`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SkillSyncer
                </h1>
                <p className="text-xs text-gray-500 font-medium">Admin Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-all duration-200"
        >
          {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>

        {/* Admin Profile */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{localStorage.getItem('userName') || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{currentTime.toLocaleTimeString()}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 space-y-2">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'} transition-colors`} />
                {!sidebarCollapsed && (
                  <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                )}
                {isActive && !sidebarCollapsed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {!sidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Welcome Header */}
          {activeSection === 'overview' && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      Welcome back, <span className="text-yellow-300">{localStorage.getItem('userName')?.split(' ')[0] || 'Admin'}</span>! 👋
                    </h1>
                    <p className="text-blue-100 text-lg">
                      {currentTime.getHours() < 12 ? 'Good morning' : 
                       currentTime.getHours() < 17 ? 'Good afternoon' : 'Good evening'}! Here's your platform overview for today.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                      <p className="text-white/90 text-sm font-medium">
                        {currentTime.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-white font-bold text-lg">
                        {currentTime.toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Headers for other pages */}
          {activeSection !== 'overview' && (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {activeSection === 'users' && 'User Management'}
                  {activeSection === 'companies' && 'Company Management'}
                  {activeSection === 'mentors' && 'Mentor Management'}
                  {activeSection === 'jobs' && 'Job Management'}
                  {activeSection === 'analytics' && 'Analytics'}
                  {activeSection === 'settings' && 'Settings'}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {activeSection === 'users' && <span>Manage user accounts and permissions</span>}
                  {activeSection === 'companies' && <span>Oversee company registrations and verifications</span>}
                  {activeSection === 'mentors' && <span>Add and manage mentors on the platform</span>}
                  {activeSection === 'jobs' && <span>Monitor job postings and applications</span>}
                  {activeSection === 'analytics' && <span>Analyze platform data and trends</span>}
                  {activeSection === 'settings' && <span>Configure system settings and preferences</span>}
                </div>
              </div>
              
              {/* Header Actions for other sections */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {notifications}
                      </span>
                    )}
                  </button>
                </div>
                <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {currentTime.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <AnimatePresence mode="wait">
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Top Action Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <select className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none">
                      <option>Last 30 days</option>
                      <option>Last 7 days</option>
                      <option>Today</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => {
                      fetchStats();
                      fetchRecentUsers();
                    }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg px-4 py-2 shadow-md border border-gray-300 transition-all duration-200 hover:shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Refresh</span>
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Export Report</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Add User</span>
                  </button>
                </div>
              </motion.div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: 'Total Users',
                    value: stats.overview?.totalUsers || 1247,
                    change: '+12%',
                    changeType: 'positive',
                    icon: Users,
                    color: 'blue'
                  },
                  {
                    title: 'Active Jobs',
                    value: stats.overview?.activeJobs || 89,
                    change: '+8%',
                    changeType: 'positive',
                    icon: Briefcase,
                    color: 'green'
                  },
                  {
                    title: 'Companies',
                    value: stats.overview?.employers || 156,
                    change: '+15%',
                    changeType: 'positive',
                    icon: Building,
                    color: 'purple'
                  },
                  {
                    title: 'Mentors',
                    value: stats.overview?.mentors || 23,
                    change: '+18%',
                    changeType: 'positive',
                    icon: GraduationCap,
                    color: 'indigo'
                  }
                ].map((metric, index) => (
                  <motion.div
                    key={metric.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`bg-gradient-to-br ${
                      metric.color === 'blue' ? 'from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200' :
                      metric.color === 'green' ? 'from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200' :
                      metric.color === 'purple' ? 'from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200' :
                      metric.color === 'indigo' ? 'from-indigo-50 to-indigo-100 border-indigo-200 hover:from-indigo-100 hover:to-indigo-200' :
                      'from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-200'
                    } rounded-xl border-2 p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                      metric.color === 'blue' ? 'from-blue-400 to-blue-600' :
                      metric.color === 'green' ? 'from-green-400 to-green-600' :
                      metric.color === 'purple' ? 'from-purple-400 to-purple-600' :
                      metric.color === 'indigo' ? 'from-indigo-400 to-indigo-600' :
                      'from-orange-400 to-orange-600'
                    }`}></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${
                          metric.color === 'blue' ? 'bg-blue-500 text-white shadow-blue-200' :
                          metric.color === 'green' ? 'bg-green-500 text-white shadow-green-200' :
                          metric.color === 'purple' ? 'bg-purple-500 text-white shadow-purple-200' :
                          metric.color === 'indigo' ? 'bg-indigo-500 text-white shadow-indigo-200' :
                          'bg-orange-500 text-white shadow-orange-200'
                        } shadow-lg transition-all duration-300 group-hover:scale-110`}>
                          <metric.icon className="w-6 h-6" />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          metric.changeType === 'positive' 
                            ? 'bg-emerald-500 text-white shadow-emerald-200' 
                            : 'bg-red-500 text-white shadow-red-200'
                        } shadow-lg transition-all duration-300`}>
                          {metric.changeType === 'positive' ? (
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 inline mr-1" />
                          )}
                          {metric.change}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
                          {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                        </p>
                        <p className="text-xs text-gray-500">vs last month</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Users Table */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50/30 rounded-xl border-2 border-blue-100 shadow-lg"
                >
                  <div className="px-6 py-4 border-b border-blue-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Recent Users
                      </h3>
                      <button 
                        onClick={() => setActiveSection('users')}
                        className="text-sm text-blue-100 hover:text-white font-medium bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        View all
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentUsersLoading ? (
                          <tr>
                            <td colSpan="4" className="px-6 py-8 text-center">
                              <div className="flex flex-col items-center">
                                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                                <p className="text-gray-500 text-sm">Loading recent users...</p>
                              </div>
                            </td>
                          </tr>
                        ) : recentUsers.length > 0 ? recentUsers.map((user, index) => (
                          <tr key={user._id || index} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                                    user.role === 'employer' 
                                      ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                                      : user.role === 'mentor'
                                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600'
                                      : 'bg-gradient-to-r from-blue-500 to-blue-600'
                                  }`}>
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.name || 'Unknown User'}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                user.role === 'employer' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : user.role === 'mentor'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : user.role === 'admin'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role === 'employer' ? 'Employer' : 
                                 user.role === 'mentor' ? 'Mentor' :
                                 user.role === 'admin' ? 'Admin' : 'Job Seeker'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                user.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-8 text-center">
                              <div className="flex flex-col items-center">
                                <Users className="w-12 h-12 text-gray-300 mb-4" />
                                <p className="text-gray-500 text-sm">No recent users found</p>
                                <button 
                                  onClick={fetchRecentUsers}
                                  className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                  Refresh
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Activity Feed */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-white to-green-50/30 rounded-xl border-2 border-green-100 shadow-lg"
                >
                  <div className="px-6 py-4 border-b border-green-200 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-xl">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Activity Feed
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {/* Dynamic activities based on recent users */}
                      {recentUsers.slice(0, 3).map((user, index) => (
                        <motion.div 
                          key={user._id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex-shrink-0">
                            <div className={`p-2 rounded-lg ${
                              user.role === 'employer' ? 'bg-purple-100' : 'bg-blue-100'
                            }`}>
                              {user.role === 'employer' ? (
                                <Building className="w-4 h-4 text-purple-600" />
                              ) : (
                                <UserCheck className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-medium">
                              {user.role === 'employer' ? 'New company registered' : 'New user registered'}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {user.name} ({user.email})
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Static activities */}
                      {[
                        { icon: Shield, text: 'System backup completed', time: '1 hour ago', color: 'text-green-500', bg: 'bg-green-100' },
                        { icon: BarChart3, text: 'Analytics report generated', time: '2 hours ago', color: 'text-blue-500', bg: 'bg-blue-100' }
                      ].map((activity, index) => (
                        <motion.div 
                          key={`static-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (recentUsers.length + index) * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        >
                          <div className="flex-shrink-0">
                            <div className={`p-2 rounded-lg ${activity.bg}`}>
                              <activity.icon className={`w-4 h-4 ${activity.color}`} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 font-medium">{activity.text}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* System Status */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-white to-purple-50/30 rounded-xl border-2 border-purple-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="px-6 py-4 border-b border-purple-200 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      System Status
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-200 font-medium">All Systems Operational</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { label: 'API Status', status: 'Operational', color: 'green', icon: CheckCircle, detail: 'All endpoints responding' },
                      { label: 'Database', status: 'Connected', color: 'green', icon: CheckCircle, detail: 'MongoDB cluster healthy' },
                      { label: 'Response Time', status: '< 200ms', color: 'blue', icon: Zap, detail: 'Average response time' },
                      { label: 'Uptime', status: '99.9%', color: 'green', icon: Activity, detail: 'Last 30 days' }
                    ].map((item, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                      >
                        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-transform duration-200 group-hover:scale-110 ${
                          item.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                          item.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                          'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <item.icon className={`w-7 h-7 ${
                            item.color === 'green' ? 'text-green-600' :
                            item.color === 'blue' ? 'text-blue-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{item.label}</p>
                        <p className={`text-lg font-bold mb-1 ${
                          item.color === 'green' ? 'text-green-600' :
                          item.color === 'blue' ? 'text-blue-600' :
                          'text-gray-600'
                        }`}>
                          {item.status}
                        </p>
                        <p className="text-xs text-gray-500">{item.detail}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>


            </motion.div>
          </AnimatePresence>
        )}

        {/* Users Section */}
        {activeSection === 'users' && (
          <AnimatePresence mode="wait">
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Filters and Search */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200 w-full sm:w-64"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                      />
                    </div>
                    <select
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                      value={filters.role}
                      onChange={(e) => handleFilterChange('role', e.target.value)}
                    >
                      <option value="">All Roles</option>
                      <option value="jobseeker">Job Seekers</option>
                      <option value="employer">Employers</option>
                    </select>
                    <select
                      className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-200"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fetchUsers(currentPage)}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="font-medium">Refresh</span>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Download className="w-4 h-4" />
                      <span className="font-medium">Export</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Users Table */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20"
              >
                <div className="px-6 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Registered Users</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage all registered users on the platform</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {pagination.totalUsers || 0} Total
                      </div>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
                    </div>
                    <span className="mt-4 text-gray-600 font-medium">Loading users...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200/50">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Verification</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white/50 divide-y divide-gray-200/30">
                        {users.map((user, index) => (
                          <motion.tr 
                            key={user._id} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-blue-50/50 transition-all duration-200 group"
                          >
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12">
                                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                                    <span className="text-white font-bold text-sm">
                                      {user.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                                    {user.name}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center mt-1">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${
                                user.role === 'jobseeker'
                                  ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
                                  : user.role === 'employer'
                                  ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800'
                                  : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                              }`}>
                                {user.role === 'jobseeker' && <User className="w-3 h-3 mr-1" />}
                                {user.role === 'employer' && <Building className="w-3 h-3 mr-1" />}
                                {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${
                                user.isActive ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800'
                              }`}>
                                {user.isActive ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                                <span className="font-medium">{formatDate(user.createdAt)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${
                                user.isEmailVerified ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800' : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800'
                              }`}>
                                {user.isEmailVerified ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                {user.isEmailVerified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                                >
                                  <Eye className="w-4 h-4" />
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition-all duration-200"
                                >
                                  <Edit className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateUserStatus(user._id, !user.isActive)}
                                  className={`p-2 rounded-lg transition-all duration-200 ${
                                    user.isActive 
                                      ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-100' 
                                      : 'text-green-600 hover:text-green-800 hover:bg-green-100'
                                  }`}
                                >
                                  {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                </motion.button>
                                <motion.button 
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 flex items-center justify-between border-t border-gray-200/50">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={!pagination.hasPrev}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 shadow-sm"
                      >
                        Previous
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                        disabled={!pagination.hasNext}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 shadow-sm"
                      >
                        Next
                      </motion.button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700 font-medium">
                          Showing <span className="font-bold text-blue-600">{((currentPage - 1) * 10) + 1}</span> to{' '}
                          <span className="font-bold text-blue-600">{Math.min(currentPage * 10, pagination.totalUsers)}</span> of{' '}
                          <span className="font-bold text-blue-600">{pagination.totalUsers}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-xl shadow-sm -space-x-px">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={!pagination.hasPrev}
                            className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </motion.button>
                          {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => (
                            <motion.button
                              key={index + 1}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setCurrentPage(index + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                                currentPage === index + 1
                                  ? 'z-10 bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 text-white shadow-lg'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {index + 1}
                            </motion.button>
                          ))}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                            disabled={!pagination.hasNext}
                            className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </motion.button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Companies Section */}
        {activeSection === 'companies' && (
          <AnimatePresence mode="wait">
            <motion.div 
              key="companies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Companies Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Companies & Employers</h3>
                    <p className="text-sm text-gray-600 mt-1">Manage registered companies and employers</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchCompanies(currentPage)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="font-medium">Refresh</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Companies Table */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20"
              >
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading companies...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {companies.map((company) => (
                        <tr key={company.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                                  <Building className="w-5 h-5 text-white" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{company.name}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {company.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {company.industry}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {company.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {company.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {company.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                                {company.status}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                company.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {company.verified ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                {company.verified ? 'Verified' : 'Pending'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(company.joinDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 p-1 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900 p-1 rounded">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900 p-1 rounded">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination for Companies */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                      disabled={!pagination.hasNext}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * 10, pagination.totalCompanies)}</span> of{' '}
                        <span className="font-medium">{pagination.totalCompanies}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={!pagination.hasPrev}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => (
                          <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === index + 1
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                          disabled={!pagination.hasNext}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Mentors Section */}
        {activeSection === 'mentors' && (
          <AnimatePresence mode="wait">
            <motion.div 
              key="mentors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Mentors Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Mentors Management</h3>
                    <p className="text-sm text-gray-600 mt-1">Add and manage mentors on the platform</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowMentorForm(true)}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Add Mentor</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fetchMentors(currentPage)}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="font-medium">Refresh</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Add Mentor Form Modal */}
              {showMentorForm && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                  >
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">Add New Mentor</h3>
                        <button
                          onClick={() => setShowMentorForm(false)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    
                    <form onSubmit={handleMentorFormSubmit} className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={mentorFormData.name}
                            onChange={(e) => handleMentorFormChange('name', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter mentor's full name"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={mentorFormData.email}
                            onChange={(e) => handleMentorFormChange('email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter mentor's email"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password *
                          </label>
                          <input
                            type="password"
                            value={mentorFormData.password}
                            onChange={(e) => handleMentorFormChange('password', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter password"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expertise Area *
                          </label>
                          <input
                            type="text"
                            value={mentorFormData.expertise}
                            onChange={(e) => handleMentorFormChange('expertise', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="e.g., Web Development, Data Science"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Experience Level
                          </label>
                          <select
                            value={mentorFormData.experience}
                            onChange={(e) => handleMentorFormChange('experience', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="">Select experience</option>
                            <option value="1-3">1-3 years</option>
                            <option value="3-5">3-5 years</option>
                            <option value="5-10">5-10 years</option>
                            <option value="10+">10+ years</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={mentorFormData.phone}
                            onChange={(e) => handleMentorFormChange('phone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={mentorFormData.location}
                          onChange={(e) => handleMentorFormChange('location', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter location"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={mentorFormData.bio}
                          onChange={(e) => handleMentorFormChange('bio', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter mentor's bio and background"
                        />
                      </div>
                      
                      <div className="flex items-center justify-end space-x-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowMentorForm(false)}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50"
                        >
                          {loading ? 'Adding...' : 'Add Mentor'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </motion.div>
              )}

              {/* Mentors Table */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20"
              >
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <span className="ml-2 text-gray-600">Loading mentors...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mentor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expertise
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Experience
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mentors.map((mentor, index) => (
                        <motion.tr 
                          key={mentor._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                <GraduationCap className="w-5 h-5 text-white" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{mentor.name}</div>
                                <div className="text-sm text-gray-500">{mentor.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{mentor.profile?.expertise || 'Not specified'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{mentor.profile?.experience || 'Not specified'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              mentor.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {mentor.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(mentor.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateUserStatus(mentor._id, !mentor.isActive)}
                                className={`p-2 rounded-lg transition-colors ${
                                  mentor.isActive 
                                    ? 'text-red-600 hover:bg-red-50' 
                                    : 'text-green-600 hover:bg-green-50'
                                }`}
                                title={mentor.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {mentor.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </button>
                              <button
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {mentors.length === 0 && (
                    <div className="text-center py-12">
                      <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No mentors found</p>
                      <button
                        onClick={() => setShowMentorForm(true)}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Add First Mentor
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                      disabled={!pagination.hasNext}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{((currentPage - 1) * 10) + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * 10, pagination.totalUsers || 0)}
                        </span>{' '}
                        of <span className="font-medium">{pagination.totalUsers || 0}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={!pagination.hasPrev}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                          disabled={!pagination.hasNext}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Jobs Section */}
        {activeSection === 'jobs' && (
          <AnimatePresence mode="wait">
            <motion.div 
              key="jobs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-white/20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Briefcase className="w-12 h-12 text-white" />
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-3"
              >
                Job Management
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6 text-lg"
              >
                Job posting management features are coming soon.
              </motion.p>
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                Coming Soon
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <AnimatePresence mode="wait">
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-white/20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                  className="w-24 h-24 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <BarChart3 className="w-12 h-12 text-white" />
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900 mb-3"
                >
                  Advanced Analytics
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 mb-6 text-lg"
                >
                  Detailed analytics and reporting features are under development.
                </motion.p>
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-xl hover:from-pink-700 hover:to-pink-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Coming Soon
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <AnimatePresence mode="wait">
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-white/20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                  className="w-24 h-24 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                >
                  <Settings className="w-12 h-12 text-white" />
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900 mb-3"
                >
                  System Settings
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 mb-6 text-lg"
                >
                  Platform configuration and settings management.
                </motion.p>
                <motion.button 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  Coming Soon
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Success!</h3>
              <p className="text-gray-600 mb-6">{successMessage}</p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium"
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
