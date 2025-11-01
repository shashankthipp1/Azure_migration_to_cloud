import React from 'react';
import { TrendingUp, BookOpen, Calendar, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const StudentOverview = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { student, subjects, currentMarks, currentAttendance, performanceTrend } = data;

  const statsCards = [
    {
      title: 'Current CGPA',
      value: student.cgpa.toFixed(2),
      icon: Award,
      color: 'blue',
      suffix: '/10'
    },
    {
      title: 'Overall Attendance',
      value: student.overallAttendance.toFixed(1),
      icon: Calendar,
      color: 'green',
      suffix: '%'
    },
    {
      title: 'Subjects Enrolled',
      value: subjects?.length || 0,
      icon: BookOpen,
      color: 'purple',
      suffix: ''
    },
    {
      title: 'Current Semester',
      value: student.year * 2,
      icon: TrendingUp,
      color: 'orange',
      suffix: ''
    }
  ];

  // Prepare performance trend data
  const trendData = performanceTrend?.map(item => ({
    semester: `Sem ${item._id}`,
    avgMarks: item.avgMarks,
    subjects: item.totalSubjects
  })) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-600">Your academic performance and progress</p>
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
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}{stat.suffix}
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
        {/* Performance Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="avgMarks" stroke="#3B82F6" name="Average Marks" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Current Semester Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Semester Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentMarks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject.name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#10B981" name="Marks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Current Semester Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Marks */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Semester Marks</h3>
          <div className="space-y-3">
            {currentMarks?.map((mark) => (
              <div key={mark._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{mark.subject?.name}</p>
                  <p className="text-sm text-gray-600">{mark.subject?.code}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{mark.total}/100</p>
                  <p className={`text-sm px-2 py-1 rounded-full ${
                    mark.grade === 'A+' || mark.grade === 'A' ? 'bg-green-100 text-green-800' :
                    mark.grade === 'B+' || mark.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                    mark.grade === 'C+' || mark.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {mark.grade}
                  </p>
                </div>
              </div>
            )) || (
              <div className="text-center py-4 text-gray-500">No marks available for current semester</div>
            )}
          </div>
        </div>

        {/* Current Attendance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Semester Attendance</h3>
          <div className="space-y-3">
            {currentAttendance?.map((attendance) => (
              <div key={attendance._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{attendance.subject?.name}</p>
                  <p className="text-sm text-gray-600">{attendance.subject?.code}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    attendance.percentage >= 75 ? 'text-green-600' :
                    attendance.percentage >= 60 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {attendance.percentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">
                    {attendance.attendedClasses}/{attendance.totalClasses}
                  </p>
                </div>
              </div>
            )) || (
              <div className="text-center py-4 text-gray-500">No attendance records for current semester</div>
            )}
          </div>
        </div>
      </div>

      {/* Subjects Enrolled */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subjects Enrolled</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects?.map((subject) => (
            <div key={subject._id} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">{subject.name}</h4>
              <p className="text-sm text-gray-600">{subject.code}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Sem {subject.semester}</span>
                <span className="text-xs text-gray-500">{subject.credits} credits</span>
              </div>
            </div>
          )) || (
            <div className="col-span-full text-center py-8 text-gray-500">
              No subjects enrolled
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
