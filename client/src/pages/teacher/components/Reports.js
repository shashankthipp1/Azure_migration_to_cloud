import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Reports = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { marksData, attendanceData } = data;

  // Prepare data for charts
  const marksChartData = marksData?.reduce((acc, mark) => {
    const subjectName = mark.subject?.name || 'Unknown';
    const existing = acc.find(item => item.subject === subjectName);
    if (existing) {
      existing.totalMarks += mark.total;
      existing.count += 1;
      existing.average = existing.totalMarks / existing.count;
    } else {
      acc.push({
        subject: subjectName,
        totalMarks: mark.total,
        count: 1,
        average: mark.total
      });
    }
    return acc;
  }, []) || [];

  const attendanceChartData = attendanceData?.reduce((acc, record) => {
    const subjectName = record.subject?.name || 'Unknown';
    const existing = acc.find(item => item.subject === subjectName);
    if (existing) {
      existing.totalAttendance += record.percentage;
      existing.count += 1;
      existing.average = existing.totalAttendance / existing.count;
    } else {
      acc.push({
        subject: subjectName,
        totalAttendance: record.percentage,
        count: 1,
        average: record.percentage
      });
    }
    return acc;
  }, []) || [];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">Teaching performance and student analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900">Total Marks</h3>
          <p className="text-3xl font-bold text-blue-600">{marksData?.length || 0}</p>
          <p className="text-sm text-gray-600">Records</p>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900">Attendance Records</h3>
          <p className="text-3xl font-bold text-green-600">{attendanceData?.length || 0}</p>
          <p className="text-sm text-gray-600">Records</p>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900">Average Marks</h3>
          <p className="text-3xl font-bold text-purple-600">
            {marksData?.length > 0 ? 
              (marksData.reduce((sum, mark) => sum + mark.total, 0) / marksData.length).toFixed(1) : 
              '0'
            }
          </p>
          <p className="text-sm text-gray-600">Out of 100</p>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-semibold text-gray-900">Average Attendance</h3>
          <p className="text-3xl font-bold text-orange-600">
            {attendanceData?.length > 0 ? 
              (attendanceData.reduce((sum, record) => sum + record.percentage, 0) / attendanceData.length).toFixed(1) : 
              '0'
            }%
          </p>
          <p className="text-sm text-gray-600">Overall</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marks Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Marks Distribution by Subject</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={marksChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="average" fill="#3B82F6" name="Average Marks" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Distribution by Subject</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={attendanceChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ subject, average }) => `${subject}: ${average.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="average"
              >
                {attendanceChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Students</h3>
          <div className="space-y-3">
            {marksData?.slice(0, 5).map((mark, index) => (
              <div key={mark._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{mark.studentId?.name}</p>
                    <p className="text-sm text-gray-600">{mark.subject?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{mark.total}/100</p>
                  <p className="text-sm text-gray-600">{mark.grade}</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-4 text-gray-500">No marks data available</div>
            )}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h3>
          <div className="space-y-3">
            {attendanceChartData.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{record.subject}</p>
                  <p className="text-sm text-gray-600">{record.count} records</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    record.average >= 75 ? 'text-green-600' :
                    record.average >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {record.average.toFixed(1)}%
                  </p>
                </div>
              </div>
            )) || (
              <div className="text-center py-4 text-gray-500">No attendance data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
