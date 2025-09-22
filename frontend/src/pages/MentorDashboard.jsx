import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config/api';
import {
  Users,
  User,
  GraduationCap,
  Settings,
  LogOut,
  BarChart3,
  Activity,
  Search,
  Filter,
  Eye,
  Edit,
  RefreshCw,
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
  Bell,
  Menu,
  X,
  Home,
  Star,
  Award,
  Target,
  Zap,
  Globe,
  BookOpen,
  MessageCircle,
  Video,
  Briefcase
} from 'lucide-react';

const MentorDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [mentorData, setMentorData] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(2);
  const [secondaryRoles, setSecondaryRoles] = useState([]);
  const navigate = useNavigate();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch mentor data on component mount
  useEffect(() => {
    const init = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      
      if (!token) {
        navigate('/auth');
        return;
      }
      
      // Check if user has mentor role (primary or secondary)
      const storedSecondaryRoles = localStorage.getItem('secondaryRoles');
      const secondaryRoles = storedSecondaryRoles ? JSON.parse(storedSecondaryRoles) : [];
      const hasMentorRole = role === 'mentor' || secondaryRoles.includes('mentor');
      
      
      if (!hasMentorRole) {
        navigate('/auth');
        return;
      }
      
      setSecondaryRoles(secondaryRoles);
    };
    
    init();
    fetchMentorData();
  }, [navigate]);

  const fetchMentorData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setMentorData(data.data.user);
        // Update secondary roles from server response
        if (data.data.user.secondaryRoles && data.data.user.secondaryRoles.length > 0) {
          setSecondaryRoles(data.data.user.secondaryRoles);
          localStorage.setItem('secondaryRoles', JSON.stringify(data.data.user.secondaryRoles));
        }
      }
    } catch (error) {
      console.error('Error fetching mentor data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('secondaryRoles');
    navigate('/auth');
  };

  const handleRoleSwitch = (role) => {
    if (role === 'employee') {
      navigate('/employee-dashboard');
    }
    // Add other role switches as needed
  };

  const handleMigration = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/mentor/migrate-to-dual-role`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Migration response:', data);
      
      if (data.success) {
        // Update local state
        setSecondaryRoles(data.data.secondaryRoles);
        localStorage.setItem('secondaryRoles', JSON.stringify(data.data.secondaryRoles));
        localStorage.setItem('userRole', data.data.primaryRole);
        
        // Refresh the page to show updated roles
        window.location.reload();
      } else {
        console.error('Migration failed:', data.message);
        alert('Migration failed: ' + data.message);
      }
    } catch (error) {
      console.error('Migration error:', error);
      alert('Migration error: ' + error.message);
    }
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
    { id: 'mentees', name: 'My Mentees', icon: Users, color: 'from-green-500 to-green-600' },
    { id: 'sessions', name: 'Sessions', icon: Video, color: 'from-purple-500 to-purple-600' },
    { id: 'resources', name: 'Resources', icon: BookOpen, color: 'from-orange-500 to-orange-600' },
    { id: 'messages', name: 'Messages', icon: MessageCircle, color: 'from-pink-500 to-pink-600' },
    { id: 'profile', name: 'Profile', icon: User, color: 'from-indigo-500 to-indigo-600' },
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
                <p className="text-xs text-gray-500 font-medium">Mentor Portal</p>
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

        {/* Mentor Profile */}
        <div className="p-4 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{mentorData.name || 'Mentor'}</p>
                <p className="text-xs text-gray-500">{currentTime.toLocaleTimeString()}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">Available</span>
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
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      Welcome back, <span className="text-yellow-300">{mentorData.name?.split(' ')[0] || 'Mentor'}</span>! 🎓
                    </h1>
                    <p className="text-blue-100 text-lg">
                      {currentTime.getHours() < 12 ? 'Good morning' : 
                       currentTime.getHours() < 17 ? 'Good afternoon' : 'Good evening'}! Ready to inspire and guide today?
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
                    
                    
                    {/* Role Switcher for Overview */}
                    {secondaryRoles.length > 0 && (
                      <div className="mt-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-white/90 text-sm font-medium">Current Role</p>
                                <p className="text-white text-lg font-semibold">Mentor</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white/70 text-sm">Switch to:</span>
                              {secondaryRoles.map((role) => {
                                const switchToRole = role === 'mentor' ? 'employee' : role;
                                return (
                                  <button
                                    key={switchToRole}
                                    onClick={() => handleRoleSwitch(switchToRole)}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-all duration-200 backdrop-blur-sm border border-white/30 hover:border-white/50"
                                  >
                                    {switchToRole === 'employee' && <Briefcase className="h-4 w-4" />}
                                    {switchToRole === 'mentor' && <GraduationCap className="h-4 w-4" />}
                                    {switchToRole.charAt(0).toUpperCase() + switchToRole.slice(1)} Dashboard
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
                  {activeSection === 'mentees' && 'My Mentees'}
                  {activeSection === 'sessions' && 'Mentoring Sessions'}
                  {activeSection === 'resources' && 'Learning Resources'}
                  {activeSection === 'messages' && 'Messages'}
                  {activeSection === 'profile' && 'My Profile'}
                  {activeSection === 'settings' && 'Settings'}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {activeSection === 'mentees' && <span>Manage your mentees and track their progress</span>}
                  {activeSection === 'sessions' && <span>Schedule and manage mentoring sessions</span>}
                  {activeSection === 'resources' && <span>Share resources and materials with mentees</span>}
                  {activeSection === 'messages' && <span>Communicate with your mentees</span>}
                  {activeSection === 'profile' && <span>Update your profile and expertise</span>}
                  {activeSection === 'settings' && <span>Configure your preferences</span>}
                </div>
              </div>
              
              {/* Header Actions */}
              <div className="flex items-center space-x-4">
                {/* Role Switcher */}
                {secondaryRoles.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-medium">Current Role</p>
                          <p className="text-gray-900 text-lg font-semibold">Mentor</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm">Switch to:</span>
                        {secondaryRoles.map((role) => {
                          const switchToRole = role === 'mentor' ? 'employee' : role;
                          return (
                            <button
                              key={switchToRole}
                              onClick={() => handleRoleSwitch(switchToRole)}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                            >
                              {switchToRole === 'employee' && <Briefcase className="h-4 w-4" />}
                              {switchToRole === 'mentor' && <GraduationCap className="h-4 w-4" />}
                              {switchToRole.charAt(0).toUpperCase() + switchToRole.slice(1)} Dashboard
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
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
                        month: 'short', 
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
              className="space-y-8"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Mentees</p>
                      <p className="text-3xl font-bold text-gray-900">12</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +2 this month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sessions This Week</p>
                      <p className="text-3xl font-bold text-gray-900">8</p>
                      <p className="text-xs text-blue-600 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        3 upcoming
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Resources Shared</p>
                      <p className="text-3xl font-bold text-gray-900">45</p>
                      <p className="text-xs text-purple-600 flex items-center mt-1">
                        <BookOpen className="w-3 h-3 mr-1" />
                        5 new this week
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-3xl font-bold text-gray-900">94%</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <Star className="w-3 h-3 mr-1" />
                        Excellent rating
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Session completed with John Doe</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">New message from Sarah Smith</p>
                      <p className="text-sm text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Resource shared: React Best Practices</p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Other Sections - Placeholder */}
        {activeSection !== 'overview' && (
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12 text-center border border-white/20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <GraduationCap className="w-12 h-12 text-white" />
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-gray-900 mb-3"
              >
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                This section is coming soon! We're working hard to bring you amazing mentoring features.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Stay Tuned
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;