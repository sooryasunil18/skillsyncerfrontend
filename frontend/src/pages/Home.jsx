import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  Briefcase, 
  Award, 
  Zap,
  Target,
  TrendingUp,
  Shield,
  Brain,
  Sparkles,
  CheckCircle,
  Star
} from 'lucide-react';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const stats = [
    { number: "10,000+", label: "Active Users", icon: Users },
    { number: "5,000+", label: "Job Opportunities", icon: Briefcase },
    { number: "95%", label: "Success Rate", icon: Award },
    { number: "50+", label: "Partner Companies", icon: Target }
  ];

  const features = [
    { icon: Brain, title: "AI-Powered Matching", desc: "Smart algorithms match your skills with perfect opportunities" },
    { icon: TrendingUp, title: "Career Growth", desc: "Track your progress and unlock new career possibilities" },
    { icon: Shield, title: "Secure Platform", desc: "Your data is protected with enterprise-grade security" },
    { icon: Sparkles, title: "Personalized Experience", desc: "Get recommendations tailored to your unique profile" }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="gradient-bg pt-20 lg:pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Hero Content */}
            <motion.div variants={itemVariants} className="text-center lg:text-left">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg mb-6"
              >
                <Zap className="w-5 h-5 text-primary-600 mr-2" />
                <span className="text-sm font-semibold text-gray-700">AI-Powered Platform</span>
              </motion.div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Connect, Learn, and{' '}
                <span className="text-gradient">Grow Your Career</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Skillsyncer is the ultimate AI-powered platform connecting students, employers, 
                mentors, and admins. Find internships, projects, and mentorship opportunities 
                that match your skills perfectly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/auth" className="btn-primary inline-flex items-center text-lg px-8 py-4">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/how-it-works" className="btn-secondary inline-flex items-center text-lg px-8 py-4">
                    Watch Demo
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Hero Illustration */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="w-full max-w-lg mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl p-8 shadow-2xl">
                  {/* Illustration Elements */}
                  <div className="space-y-6">
                    {/* Profile Cards */}
                    <div className="flex justify-between">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                      >
                        <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-2">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-xs font-semibold text-gray-700">Students</div>
                      </motion.div>
                      
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                      >
                        <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center mb-2">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-xs font-semibold text-gray-700">Employers</div>
                      </motion.div>
                    </div>
                    
                    {/* Connection Lines */}
                    <div className="flex justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Zap className="w-8 h-8 text-white" />
                      </motion.div>
                    </div>
                    
                    <div className="flex justify-between">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                      >
                        <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-2">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-xs font-semibold text-gray-700">Mentors</div>
                      </motion.div>
                      
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                        className="bg-white rounded-xl p-4 shadow-lg"
                      >
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-xs font-semibold text-gray-700">Admins</div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Target className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Skillsyncer?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of career development with our cutting-edge platform
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-12">
            <Link to="/features" className="btn-primary inline-flex items-center text-lg px-8 py-4">
              Explore All Features
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of successful professionals who found their dream opportunities through Skillsyncer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center">
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;