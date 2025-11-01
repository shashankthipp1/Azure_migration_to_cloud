import React from 'react';
import { BookOpen, Users, TrendingUp, Calendar } from 'lucide-react';

const TeacherOverview = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { teacher, subjectsHandled, studentsCount, marksData, attendanceData } = data;

  const statsCards = [
    {
      title: 'Subjects Handled',
      value: subjectsHandled?.length || 0,
      icon: BookOpen,
      color: 'blue'
    },
    {
      title: 'Total Students',
      value: studentsCount || 0,
      icon: Users,
      color: 'green'
    },
    {
      title: 'Marks Entered',
      value: marksData?.length || 0,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Attendance Records',
      value: attendanceData?.length || 0,
      icon: Calendar,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-600">Your teaching dashboard and quick insights</p>
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
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subjects Handled */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subjects Handled</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectsHandled?.map((subject) => (
            <div key={subject._id} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900">{subject.name}</h4>
              <p className="text-sm text-gray-600">{subject.code}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Sem {subject.semester}</span>
                <span className="text-xs text-gray-500">Year {subject.year}</span>
              </div>
            </div>
          )) || (
            <div className="col-span-full text-center py-8 text-gray-500">
              No subjects assigned yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Marks */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Marks Entry</h3>
          <div className="space-y-3">
            {marksData?.slice(0, 5).map((mark) => (
              <div key={mark._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{mark.studentId?.name}</p>
                  <p className="text-sm text-gray-600">{mark.subject?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{mark.total}/100</p>
                  <p className="text-sm text-gray-600">{mark.grade}</p>
                </div>
              </div>
            )) || (
              <div className="text-center py-4 text-gray-500">No marks entered yet</div>
            )}
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h3>
          <div className="space-y-3">
            {attendanceData?.slice(0, 5).map((attendance) => (
              <div key={attendance._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{attendance.studentId?.name}</p>
                  <p className="text-sm text-gray-600">{attendance.subject?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{attendance.percentage.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">
                    {attendance.attendedClasses}/{attendance.totalClasses}
                  </p>
                </div>
              </div>
            )) || (
              <div className="text-center py-4 text-gray-500">No attendance recorded yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherOverview;
