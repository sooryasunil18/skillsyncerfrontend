import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../config/api';
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Building,
  FileText,
  Award,
  Clock,
  CheckCircle,
  X,
  Send,
  UserCheck
} from 'lucide-react';

const MentorRequestForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeEmail: '',
    employeePhone: '',
    employeePosition: '',
    employeeDepartment: '',
    justification: '',
    expertise: '',
    yearsOfExperience: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    }
    
    if (!formData.employeeEmail.trim()) {
      newErrors.employeeEmail = 'Employee email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.employeeEmail)) {
      newErrors.employeeEmail = 'Please enter a valid email address';
    }
    
    if (!formData.employeePhone.trim()) {
      newErrors.employeePhone = 'Employee phone is required';
    }
    
    if (!formData.employeePosition.trim()) {
      newErrors.employeePosition = 'Employee position is required';
    }
    
    if (!formData.employeeDepartment.trim()) {
      newErrors.employeeDepartment = 'Employee department is required';
    }
    
    if (!formData.justification.trim()) {
      newErrors.justification = 'Justification is required';
    } else if (formData.justification.length < 50) {
      newErrors.justification = 'Justification must be at least 50 characters';
    }
    
    if (!formData.yearsOfExperience) {
      newErrors.yearsOfExperience = 'Years of experience is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/mentor/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          expertise: formData.expertise ? formData.expertise.split(',').map(skill => skill.trim()).filter(skill => skill) : []
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess && onSuccess(data.data);
          onClose();
        }, 2000);
      } else {
        setErrors({ submit: data.message || 'Failed to submit mentor request' });
      }
    } catch (error) {
      console.error('Error submitting mentor request:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
          <p className="text-gray-600 mb-6">
            Your mentor request has been submitted successfully. The admin will review it and notify you of the decision.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
          >
            Close
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Submit Mentor Request</h3>
              <p className="text-sm text-gray-600 mt-1">Request to assign an employee as a mentor</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Information Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Assign Employee as Mentor</h3>
                <p className="text-blue-700 text-sm">
                  You can request to assign any employee as a mentor, whether they're already registered on the platform or not. Existing employees will be notified of their new mentor role.
                </p>
              </div>
            </div>
          </div>

          {/* Employee Information */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-600" />
              Employee Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange('employeeName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.employeeName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter employee's full name"
                />
                {errors.employeeName && (
                  <p className="text-red-500 text-sm mt-1">{errors.employeeName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.employeeEmail}
                  onChange={(e) => handleInputChange('employeeEmail', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.employeeEmail ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter employee's email"
                />
                {errors.employeeEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.employeeEmail}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.employeePhone}
                  onChange={(e) => handleInputChange('employeePhone', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.employeePhone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.employeePhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.employeePhone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  value={formData.employeePosition}
                  onChange={(e) => handleInputChange('employeePosition', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.employeePosition ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Senior Developer, Team Lead"
                />
                {errors.employeePosition && (
                  <p className="text-red-500 text-sm mt-1">{errors.employeePosition}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.employeeDepartment}
                  onChange={(e) => handleInputChange('employeeDepartment', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.employeeDepartment ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Engineering, Marketing, Sales"
                />
                {errors.employeeDepartment && (
                  <p className="text-red-500 text-sm mt-1">{errors.employeeDepartment}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <select
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.yearsOfExperience ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
                {errors.yearsOfExperience && (
                  <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>
                )}
              </div>
            </div>
          </div>

          {/* Expertise and Justification */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-indigo-600" />
              Expertise & Justification
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Expertise
                </label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) => handleInputChange('expertise', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., React, Node.js, Python, Machine Learning (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple areas with commas</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justification for Mentorship *
                </label>
                <textarea
                  value={formData.justification}
                  onChange={(e) => handleInputChange('justification', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.justification ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Explain why this employee should be assigned as a mentor. Include their qualifications, experience, and how they can help guide others..."
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.justification && (
                    <p className="text-red-500 text-sm">{errors.justification}</p>
                  )}
                  <p className="text-xs text-gray-500 ml-auto">
                    {formData.justification.length}/1000 characters (minimum 50)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default MentorRequestForm;
