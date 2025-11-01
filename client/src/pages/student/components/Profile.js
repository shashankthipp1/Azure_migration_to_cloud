import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Edit, Save, X } from 'lucide-react';
import { studentsAPI } from '../../../services/api';
import toast from 'react-hot-toast';

const Profile = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: data?.student?.name || '',
    email: data?.student?.email || '',
    phone: data?.student?.phone || '',
    address: data?.student?.address || '',
    dateOfBirth: data?.student?.dateOfBirth ? new Date(data.student.dateOfBirth).toISOString().split('T')[0] : ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      await studentsAPI.update(data.student._id, formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: data?.student?.name || '',
      email: data?.student?.email || '',
      phone: data?.student?.phone || '',
      address: data?.student?.address || '',
      dateOfBirth: data?.student?.dateOfBirth ? new Date(data.student.dateOfBirth).toISOString().split('T')[0] : ''
    });
    setIsEditing(false);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { student } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button onClick={handleCancel} className="btn-secondary flex items-center space-x-2">
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="card">
        <div className="flex items-start space-x-6">
          {/* Profile Picture */}
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-blue-600" />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                
                <div>
                  <label className="label">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{student.name}</p>
                  )}
                </div>

                <div>
                  <label className="label">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{student.email}</p>
                  )}
                </div>

                <div>
                  <label className="label">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{student.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="label">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Address</label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field"
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-900">{student.address || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Roll Number</p>
                      <p className="font-medium text-gray-900">{student.rollNo}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <p className="font-medium text-gray-900">{student.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Year & Section</p>
                      <p className="font-medium text-gray-900">Year {student.year} - Section {student.section}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Admission Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(student.admissionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Current CGPA</h3>
          <p className="text-3xl font-bold text-blue-600">{student.cgpa.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Out of 10.0</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Overall Attendance</h3>
          <p className="text-3xl font-bold text-green-600">{student.overallAttendance.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">All Semesters</p>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <User className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Gender</h3>
          <p className="text-2xl font-bold text-purple-600">{student.gender}</p>
          <p className="text-sm text-gray-600">Student</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
