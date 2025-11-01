import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rollNo: '',
    staffId: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const credentials = {
        role,
        password: formData.password
      };

      // Add role-specific credentials
      if (role === 'student') {
        credentials.rollNo = formData.rollNo;
      } else if (role === 'teacher') {
        credentials.email = formData.email;
      } else if (role === 'admin') {
        credentials.username = formData.username;
      }

      const result = await login(credentials);
      
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}!`);
        navigate(`/${role}`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleCards = [
    {
      id: 'student',
      title: 'Student Login',
      icon: GraduationCap,
      description: 'Access your academic records, marks, and attendance',
      color: 'blue'
    },
    {
      id: 'teacher',
      title: 'Teacher Login',
      icon: User,
      description: 'Manage classes, marks, and student attendance',
      color: 'green'
    },
    {
      id: 'admin',
      title: 'Admin Login',
      icon: Shield,
      description: 'Complete system administration and management',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">College Management System</h1>
          </div>
          <p className="text-lg text-gray-600">Choose your role to access the portal</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Role Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Your Role</h2>
            {roleCards.map((card) => {
              const Icon = card.icon;
              const isSelected = role === card.id;
              
              return (
                <div
                  key={card.id}
                  onClick={() => setRole(card.id)}
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? `border-${card.color}-500 bg-${card.color}-50`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${
                      isSelected ? `bg-${card.color}-100` : 'bg-gray-100'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        isSelected ? `text-${card.color}-600` : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold ${
                        isSelected ? `text-${card.color}-900` : 'text-gray-900'
                      }`}>
                        {card.title}
                      </h3>
                      <p className={`text-sm ${
                        isSelected ? `text-${card.color}-700` : 'text-gray-600'
                      }`}>
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {role === 'student' && 'Student Login'}
              {role === 'teacher' && 'Teacher Login'}
              {role === 'admin' && 'Admin Login'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Login Fields */}
              {role === 'student' && (
                <div>
                  <label className="label">Roll Number</label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your roll number"
                    required
                  />
                </div>
              )}

              {/* Teacher Login Fields */}
              {role === 'teacher' && (
                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              )}

              {/* Admin Login Fields */}
              {role === 'admin' && (
                <div>
                  <label className="label">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              )}

              {/* Password Field */}
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</h3>
              <div className="text-xs text-gray-600 space-y-1">
                {role === 'student' && (
                  <>
                    <p><strong>Roll No:</strong> CSE2024001</p>
                    <p><strong>Password:</strong> student123</p>
                  </>
                )}
                {role === 'teacher' && (
                  <>
                    <p><strong>Email:</strong> john.doe@college.edu</p>
                    <p><strong>Password:</strong> teacher123</p>
                  </>
                )}
                {role === 'admin' && (
                  <>
                    <p><strong>Username:</strong> admin</p>
                    <p><strong>Password:</strong> admin123</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
