import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Import components
import StudentSidebar from './components/StudentSidebar';
import StudentHeader from './components/StudentHeader';
import StudentOverview from './components/StudentOverview';
import AcademicRecords from './components/AcademicRecords';
import Profile from './components/Profile';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar fixed at 256px */}
      <StudentSidebar />

      {/* Main Content with left margin equal to sidebar width */}
      <div className="ml-64 flex flex-col min-h-screen">
        <StudentHeader user={user} logout={logout} />
        
        <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/student/overview" replace />} />
              <Route path="/overview" element={<StudentOverview data={dashboardData} />} />
              <Route path="/academic" element={<AcademicRecords data={dashboardData} />} />
              <Route path="/profile" element={<Profile data={dashboardData} />} />
            </Routes>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
