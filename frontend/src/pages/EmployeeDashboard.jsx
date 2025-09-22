import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  Building,
  Shield,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Home,
  Calendar,
  CheckCircle,
  Target,
  Briefcase,
  Activity,
  ChevronRight,
  ArrowRight,
  BarChart3,
  Star,
  Rocket,
  Sparkles,
  BadgeCheck,
  Heart,
  Eye
} from 'lucide-react';

// Animation helpers
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut', delay } },
});

import { employerApi } from '../utils/api';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState({ name: '', email: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  
  // Applications state (read-only view for employee)
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [applicationFilters, setApplicationFilters] = useState({
    status: '',
    internshipId: '',
    search: ''
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [error, setError] = useState(null);
  const [secondaryRoles, setSecondaryRoles] = useState([]);

  useEffect(() => {
    const init = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      const name = localStorage.getItem('userName');
      const email = localStorage.getItem('userEmail');

      if (!token) {
        navigate('/auth');
        return;
      }
      
      // Check if user has employee role (primary or secondary)
      const storedSecondaryRoles = localStorage.getItem('secondaryRoles');
      const secondaryRoles = storedSecondaryRoles ? JSON.parse(storedSecondaryRoles) : [];
      const hasEmployeeRole = role === 'employee' || secondaryRoles.includes('employee');
      
      
      
      if (!hasEmployeeRole) {
        navigate('/auth');
        return;
      }
      setUser({ name: name || 'Employee', email: email || '' });
      setSecondaryRoles(secondaryRoles);
    };

    init();
    fetchUserData(); // Fetch updated user data including secondary roles

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  // Load applications when Applications section is active
  useEffect(() => {
    if (activeSection === 'applications') {
      loadApplications();
    }
  }, [activeSection, applicationFilters]);

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
    if (role === 'mentor') {
      navigate('/mentor-dashboard');
    }
    // Add other role switches as needed
  };

  // Fetch user data to get updated secondary roles
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        // Update secondary roles from server response
        if (data.data.user.secondaryRoles && data.data.user.secondaryRoles.length > 0) {
          setSecondaryRoles(data.data.user.secondaryRoles);
          localStorage.setItem('secondaryRoles', JSON.stringify(data.data.user.secondaryRoles));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Load applications from employer API (employee allowed by backend)
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
      const response = await employerApi.getDetailedApplications(applicationFilters);
      if (response.success && response.data) {
        const payload = response.data.success ? response.data.data : response.data;
        const applicationsArray = Array.isArray(payload?.applications) ? payload.applications : (Array.isArray(payload) ? payload : []);
        setApplications(applicationsArray);
      } else {
        setError(`Failed to load applications: ${response.data?.message || response.message || 'No data received'}`);
        setApplications([]);
      }
    } catch (e) {
      setError(`Error loading applications: ${e.message || 'Network error'}`);
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  };

  const formatTime = (date) =>
    date.toLocaleString('en-US', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  // Mocked computed profile completion for visual ring (replace with real value when backend wired)
  const profileCompletion = 72;
  const ringStyle = useMemo(() => ({
    backgroundImage: `conic-gradient(#0ea5e9 ${profileCompletion}%, #e5e7eb 0)`
  }), [profileCompletion]);

  const menu = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Preferences', icon: Settings },
  ];

  const Sidebar = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 pt-5 pb-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-sm ring-1 ring-white/15">
          <Home className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-[11px] text-white/60">SkillSyncer</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white">Employee</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">Approved</span>
          </div>
        </div>
      </div>
      <div className="px-4"><div className="h-px w-full bg-white/10" /></div>
      <nav className="mt-4 px-2 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
              className={`group w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition
                ${isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'}
              `}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-gray-900' : 'text-white/70 group-hover:text-white'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive ? (
                <span className="text-[10px] uppercase tracking-wider text-gray-500">Active</span>
              ) : (
                <ChevronRight className="h-4 w-4 opacity-50" />
              )}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto p-3">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-3">
          <p className="text-[11px] text-white/70">Signed in as</p>
          <p className="text-sm font-medium text-white truncate">{user.email}</p>
          <button
            onClick={handleLogout}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white text-gray-900 px-3 py-2 text-sm font-medium hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );

  const TopBar = () => (
    <div className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-900 text-white">Employee</span>
            </div>
            <p className="text-xs text-gray-500">{formatTime(currentTime)}</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-gray-700 w-48"
            />
          </div>
          
          {/* Role Switcher */}
          {secondaryRoles.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-xs font-medium">Current Role</p>
                  <p className="text-gray-900 text-sm font-semibold">Employee</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">Switch to:</span>
                  {secondaryRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-gray-700 text-xs font-medium hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                    >
                      {role === 'mentor' && <User className="h-3.5 w-3.5" />}
                      {role === 'employee' && <Briefcase className="h-3.5 w-3.5" />}
                      {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <button className="relative p-2 rounded-lg hover:bg-gray-100" title="Notifications">
            <Bell className="h-5 w-5 text-gray-700" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-black"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>
    </div>
  );

  const Overview = () => (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div {...fadeUp(0)} className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="absolute inset-0 opacity-80" style={{ backgroundImage: 'radial-gradient(circle at 0% 0%, #dbeafe 0, transparent 35%), radial-gradient(circle at 100% 0%, #fce7f3 0, transparent 35%), radial-gradient(circle at 100% 100%, #dcfce7 0, transparent 35%)' }} />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-2.5 py-1 text-[11px]">
                <Sparkles className="h-3.5 w-3.5" /> Welcome back
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-gray-900">Your Employee Workspace</h2>
              <p className="mt-2 text-gray-600 max-w-2xl">
                Access company details, manage your profile, and keep your account secure. Quick links help you get started fast.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button onClick={() => setActiveSection('profile')} className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-3 py-2 text-sm hover:bg-black">
                  <User className="h-4 w-4" /> Update Profile
                </button>
                <button onClick={() => setActiveSection('security')} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
                  <Shield className="h-4 w-4" /> Change Password
                </button>
              </div>
            </div>
            {/* Profile Completion Ring */}
            <div className="shrink-0">
              <div className="relative h-28 w-28 rounded-full" style={ringStyle}>
                <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center shadow">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{profileCompletion}%</div>
                    <div className="text-[11px] text-gray-500">Complete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { title: 'Status', value: 'Active', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Role', value: 'Employee', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
          { title: 'Company Link', value: 'Verified', icon: Building, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Join Date', value: 'Recently Verified', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((c, idx) => {
          const Icon = c.icon;
          return (
            <motion.div key={c.title} {...fadeUp(0.05 + idx * 0.05)} className="bg-white rounded-2xl shadow-sm p-5 border group hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{c.title}</p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{c.value}</p>
                </div>
                <div className={`h-10 w-10 ${c.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${c.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Content Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <motion.div {...fadeUp(0.25)} className="xl:col-span-2 bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Activity className="h-5 w-5 text-gray-700" /> Recent Activity</h3>
            <button className="text-sm text-gray-600 hover:text-gray-900">View all</button>
          </div>
          <div className="space-y-3">
            {[{t:'Account verified by admin',i:BadgeCheck,c:'text-blue-600 bg-blue-50'}, {t:'Password changed',i:Shield,c:'text-emerald-600 bg-emerald-50'}, {t:'Profile updated',i:User,c:'text-purple-600 bg-purple-50'}, {t:'Joined company workspace',i:Building,c:'text-amber-600 bg-amber-50'}].map((item, i) => {
              const Icon = item.i;
              return (
                <div key={i} className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg ${item.c.split(' ')[1]} flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${item.c.split(' ')[0]}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.t}</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div {...fadeUp(0.3)} className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-gray-700" /> Security Tips
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" /> Change your password after the first login.</li>
            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" /> Enable email alerts for suspicious activity.</li>
            <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" /> Keep your profile details up to date.</li>
          </ul>
          <button onClick={() => setActiveSection('security')} className="mt-4 inline-flex items-center gap-2 text-sm text-gray-900 font-medium hover:underline">
            Review security settings <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div {...fadeUp(0.35)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'My Profile', desc: 'Update your personal details', icon: User, action: () => setActiveSection('profile'), color: 'from-gray-900 to-black' },
          { title: 'Company', desc: 'View linked company info', icon: Building, action: () => setActiveSection('company'), color: 'from-blue-600 to-indigo-600' },
          { title: 'Preferences', desc: 'Customize your experience', icon: Settings, action: () => setActiveSection('settings'), color: 'from-emerald-600 to-teal-600' },
        ].map((q, idx) => {
          const Icon = q.icon;
          return (
            <button key={q.title} onClick={q.action} className="group text-left">
              <div className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md`}>
                <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${q.color} opacity-20`} />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{q.title}</p>
                    <p className="text-sm text-gray-600">{q.desc}</p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </motion.div>
    </div>
  );

  const Profile = () => (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)} className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        <p className="text-sm text-gray-500 mb-4">Keep your personal details accurate and up to date.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input className="w-full rounded-lg border px-3 py-2 text-sm" defaultValue={user.name} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input className="w-full rounded-lg border px-3 py-2 text-sm bg-gray-50" defaultValue={user.email} disabled />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Phone</label>
            <input className="w-full rounded-lg border px-3 py-2 text-sm" placeholder="Add phone number" />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-black">Save Changes</button>
          <button className="inline-flex items-center gap-2 border px-3 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </motion.div>

      <motion.div {...fadeUp(0.05)} className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
        <p className="text-sm text-gray-500 mb-4">Customize your dashboard experience.</p>
        <div className="space-y-3 text-sm text-gray-700">
          <label className="flex items-center gap-3"><input type="checkbox" className="h-4 w-4" defaultChecked /> Show tips and guidance on dashboard</label>
          <label className="flex items-center gap-3"><input type="checkbox" className="h-4 w-4" /> Enable compact layout on small screens</label>
        </div>
      </motion.div>
    </div>
  );

  const Company = () => (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)} className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
        <p className="text-sm text-gray-500 mb-4">Linked company details will appear here once fetched.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4"><p className="text-xs text-gray-500">Company</p><p className="text-sm font-medium text-gray-900">Linked to your account</p></div>
          <div className="rounded-xl border p-4"><p className="text-xs text-gray-500">Department</p><p className="text-sm font-medium text-gray-900">—</p></div>
          <div className="rounded-xl border p-4"><p className="text-xs text-gray-500">Position</p><p className="text-sm font-medium text-gray-900">—</p></div>
          <div className="rounded-xl border p-4"><p className="text-xs text-gray-500">Employee ID</p><p className="text-sm font-medium text-gray-900">—</p></div>
        </div>
      </motion.div>
    </div>
  );

  const Security = () => (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)} className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900">Password</h3>
        <p className="text-sm text-gray-500 mb-4">Change your password regularly to keep your account secure.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="password" className="rounded-lg border px-3 py-2 text-sm" placeholder="Current password" />
          <input type="password" className="rounded-lg border px-3 py-2 text-sm" placeholder="New password" />
          <input type="password" className="rounded-lg border px-3 py-2 text-sm" placeholder="Confirm new password" />
        </div>
        <button className="mt-4 inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm hover:bg-black">Update Password</button>
      </motion.div>

      <motion.div {...fadeUp(0.05)} className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900">Security Controls</h3>
        <div className="mt-3 space-y-3 text-sm text-gray-700">
          <label className="flex items-center gap-3"><input type="checkbox" className="h-4 w-4" defaultChecked /> Email me about new device logins</label>
          <label className="flex items-center gap-3"><input type="checkbox" className="h-4 w-4" /> Email me about password changes</label>
        </div>
      </motion.div>
    </div>
  );

  const NotificationsPanel = () => (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)} className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        <p className="text-sm text-gray-500 mb-4">Control how you receive updates and alerts.</p>
        <div className="space-y-3 text-sm text-gray-700">
          <label className="flex items-center justify-between gap-3"><span>Email notifications</span><input type="checkbox" className="h-4 w-4" defaultChecked /></label>
          <label className="flex items-center justify-between gap-3"><span>Security alerts</span><input type="checkbox" className="h-4 w-4" defaultChecked /></label>
          <label className="flex items-center justify-between gap-3"><span>Product updates</span><input type="checkbox" className="h-4 w-4" /></label>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -16, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -16, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed z-50 inset-y-0 left-0 w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white border-r border-white/10 p-2 rounded-r-2xl shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between p-2">
                <span className="text-sm font-medium text-white/80">Navigation</span>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <Sidebar />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white border-r border-white/10 p-2">
          <Sidebar />
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <main className="px-4 sm:px-6 lg:px-8 py-6">
            {activeSection === 'overview' && <Overview />}
            {activeSection === 'applications' && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Briefcase className="h-5 w-5 text-gray-700" /> Applications</h3>
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded-lg px-2 py-1 text-sm"
                      value={applicationFilters.status}
                      onChange={(e) => setApplicationFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                      <option value="accepted">Accepted</option>
                    </select>
                  </div>
                </div>
                {error && (
                  <div className="mb-3 rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">{error}</div>
                )}
                {loadingApplications ? (
                  <div className="text-sm text-gray-600">Loading applications...</div>
                ) : applications.length === 0 ? (
                  <div className="text-sm text-gray-600">No applications found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-600">
                          <th className="py-2 pr-4">Candidate</th>
                          <th className="py-2 pr-4">Email</th>
                          <th className="py-2 pr-4">Internship</th>
                          <th className="py-2 pr-4">Status</th>
                          <th className="py-2 pr-4">Applied</th>
                          <th className="py-2 pr-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map(app => (
                          <tr key={app._id} className="border-t">
                            <td className="py-2 pr-4">{app.jobseekerId?.name || 'N/A'}</td>
                            <td className="py-2 pr-4">{app.jobseekerId?.email || 'N/A'}</td>
                            <td className="py-2 pr-4">{app.internshipId?.title || 'N/A'}</td>
                            <td className="py-2 pr-4">
                              <span className="px-2 py-0.5 rounded text-xs bg-gray-100 border">{app.status}</span>
                            </td>
                            <td className="py-2 pr-4">{new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</td>
                            <td className="py-2 pr-4">
                              <button
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                onClick={async () => {
                                  try {
                                    const res = await employerApi.getApplicationDetails(app._id);
                                    const payload = res.success && res.data?.success ? res.data.data : res.data;
                                    setSelectedApplication(payload || app);
                                  } catch {
                                    setSelectedApplication(app);
                                  } finally {
                                    setShowApplicationModal(true);
                                  }
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

                {/* Details Modal */}
                <AnimatePresence>
                  {showApplicationModal && selectedApplication && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 12, opacity: 0 }}
                        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border p-6"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">Application Details</h4>
                          <button className="rounded-lg p-2 hover:bg-gray-100" onClick={() => setShowApplicationModal(false)}>
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="space-y-3 text-sm text-gray-700">
                          <p><strong>Candidate:</strong> {selectedApplication.jobseekerId?.name} ({selectedApplication.jobseekerId?.email})</p>
                          <p><strong>Internship:</strong> {selectedApplication.internshipId?.title} — {selectedApplication.internshipId?.companyName}</p>
                          <p><strong>Status:</strong> {selectedApplication.status}</p>
                          {selectedApplication.employerNotes && (
                            <p><strong>Employer Notes:</strong> {selectedApplication.employerNotes}</p>
                          )}
                          {selectedApplication.additionalInfo?.resumeUrl && (
                            <p><a className="text-blue-600 hover:underline" target="_blank" rel="noreferrer" href={selectedApplication.additionalInfo.resumeUrl}>View Resume</a></p>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            {activeSection === 'profile' && <Profile />}
            {activeSection === 'company' && <Company />}
            {activeSection === 'security' && <Security />}
            {activeSection === 'notifications' && <NotificationsPanel />}
            {activeSection === 'settings' && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
                <p className="text-sm text-gray-500">Adjust your experience and appearance.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;