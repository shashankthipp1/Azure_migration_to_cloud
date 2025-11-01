import React from 'react';
import { Users, GraduationCap, Building2, BookOpen, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Overview = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { overview, departmentStats, topStudents, recentStudents } = data;

  const departmentChartData = departmentStats.map(dept => ({
    name: dept.name,
    students: dept.totalStudents,
    teachers: dept.totalTeachers
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const statsCards = [
    {
      title: 'Total Students',
      value: overview.totalStudents,
      icon: Users,
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Teachers',
      value: overview.totalTeachers,
      icon: GraduationCap,
      color: 'green',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Departments',
      value: overview.totalDepartments,
      icon: Building2,
      color: 'purple',
      change: '0%',
      changeType: 'neutral'
    },
    {
      title: 'Subjects',
      value: overview.totalSubjects,
      icon: BookOpen,
      color: 'orange',
      change: '+8%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-600">Welcome to the College Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Statistics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="students" fill="#3B82F6" name="Students" />
              <Bar dataKey="teachers" fill="#10B981" name="Teachers" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Distribution by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, students }) => `${name}: ${students}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="students"
              >
                {departmentChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Students and Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Students */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Students</h3>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {topStudents.slice(0, 5).map((student, index) => (
              <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.rollNo} • {student.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{student.cgpa.toFixed(2)} CGPA</p>
                  <p className="text-sm text-gray-600">{student.overallAttendance.toFixed(1)}% Attendance</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recently Admitted Students</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            {recentStudents.map((student, index) => (
              <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.rollNo} • {student.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {new Date(student.admissionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
