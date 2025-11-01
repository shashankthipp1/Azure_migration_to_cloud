import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardAPI } from '../../services/api'; // ✅ removed unused APIs
import toast from 'react-hot-toast';

// Import components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import StudentsManagement from './components/StudentsManagement';
import TeachersManagement from './components/TeachersManagement';
import DepartmentsManagement from './components/DepartmentsManagement';
import Analytics from './components/Analytics';

const AdminDashboard = () => {
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
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <Header user={user} logout={logout} />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/overview" replace />} />
            <Route path="/overview" element={<Overview data={dashboardData} />} />
            <Route path="/students" element={<StudentsManagement />} />
            <Route path="/teachers" element={<TeachersManagement />} />
            <Route path="/departments" element={<DepartmentsManagement />} />
            <Route path="/analytics" element={<Analytics data={dashboardData} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
