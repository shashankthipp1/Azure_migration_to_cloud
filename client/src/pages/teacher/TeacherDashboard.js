import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardAPI, marksAPI, attendanceAPI } from '../../services/api';
import toast from 'react-hot-toast';

// Import components
import TeacherSidebar from './components/TeacherSidebar';
import TeacherHeader from './components/TeacherHeader';
import TeacherOverview from './components/TeacherOverview';
import MarksManagement from './components/MarksManagement';
import AttendanceManagement from './components/AttendanceManagement';
import Reports from './components/Reports';

const TeacherDashboard = () => {
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
      <TeacherSidebar />

      {/* Main Content with left margin equal to sidebar width */}
      <div className="ml-64 flex flex-col min-h-screen">
        <TeacherHeader user={user} logout={logout} />
        
        <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/teacher/overview" replace />} />
              <Route path="/overview" element={<TeacherOverview data={dashboardData} />} />
              <Route path="/marks" element={<MarksManagement />} />
              <Route path="/attendance" element={<AttendanceManagement />} />
              <Route path="/reports" element={<Reports data={dashboardData} />} />
            </Routes>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
