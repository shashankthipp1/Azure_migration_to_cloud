import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Analytics = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { departmentStats, topStudents } = data;

  // Prepare data for charts
  const departmentChartData = departmentStats.map(dept => ({
    name: dept.name,
    students: dept.totalStudents,
    teachers: dept.totalTeachers,
    ratio: dept.totalStudents / dept.totalTeachers
  }));

  const performanceData = topStudents.slice(0, 10).map(student => ({
    name: student.name.split(' ')[0], // First name only
    cgpa: student.cgpa,
    attendance: student.overallAttendance
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600">Comprehensive analytics and performance insights</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student-Teacher Ratio */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student-Teacher Ratio by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ratio" fill="#3B82F6" name="Student-Teacher Ratio" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Distribution</h3>
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

        {/* Performance Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Students Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cgpa" stroke="#3B82F6" name="CGPA" />
              <Line type="monotone" dataKey="attendance" stroke="#10B981" name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Comparison */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Comparison</h3>
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
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average CGPA</h3>
          <p className="text-3xl font-bold text-blue-600">
            {(topStudents.reduce((sum, student) => sum + student.cgpa, 0) / topStudents.length).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Top 10 students</p>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Attendance</h3>
          <p className="text-3xl font-bold text-green-600">
            {(topStudents.reduce((sum, student) => sum + student.overallAttendance, 0) / topStudents.length).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600 mt-1">Top 10 students</p>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Department</h3>
          <p className="text-2xl font-bold text-purple-600">
            {departmentChartData.reduce((best, dept) => 
              dept.students > best.students ? dept : best
            ).name}
          </p>
          <p className="text-sm text-gray-600 mt-1">Most students</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
