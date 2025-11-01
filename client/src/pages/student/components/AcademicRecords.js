import React from 'react';
import { BookOpen, Calendar, Award } from 'lucide-react';

const AcademicRecords = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { student, allMarks, allAttendance } = data;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Academic Records</h1>
        <p className="text-gray-600">Complete academic history and performance</p>
      </div>

      {/* Academic Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center mb-2">
            <Award className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Overall CGPA</h3>
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
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Subjects Completed</h3>
          <p className="text-3xl font-bold text-purple-600">{allMarks?.length || 0}</p>
          <p className="text-sm text-gray-600">Total Subjects</p>
        </div>
      </div>

      {/* Marks History */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marks History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Subject</th>
                <th className="table-header">Code</th>
                <th className="table-header">Semester</th>
                <th className="table-header">Internal</th>
                <th className="table-header">External</th>
                <th className="table-header">Total</th>
                <th className="table-header">Grade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allMarks?.map((mark) => (
                <tr key={mark._id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{mark.subject?.name}</td>
                  <td className="table-cell font-mono">{mark.subject?.code}</td>
                  <td className="table-cell">Sem {mark.semester}</td>
                  <td className="table-cell">{mark.internalMarks}</td>
                  <td className="table-cell">{mark.externalMarks}</td>
                  <td className="table-cell font-semibold">{mark.total}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      mark.grade === 'A+' || mark.grade === 'A' ? 'bg-green-100 text-green-800' :
                      mark.grade === 'B+' || mark.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                      mark.grade === 'C+' || mark.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {mark.grade}
                    </span>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="7" className="table-cell text-center py-8 text-gray-500">
                    No marks records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance History */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Subject</th>
                <th className="table-header">Code</th>
                <th className="table-header">Semester</th>
                <th className="table-header">Attended</th>
                <th className="table-header">Total</th>
                <th className="table-header">Percentage</th>
                <th className="table-header">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allAttendance?.map((attendance) => (
                <tr key={attendance._id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{attendance.subject?.name}</td>
                  <td className="table-cell font-mono">{attendance.subject?.code}</td>
                  <td className="table-cell">Sem {attendance.semester}</td>
                  <td className="table-cell">{attendance.attendedClasses}</td>
                  <td className="table-cell">{attendance.totalClasses}</td>
                  <td className="table-cell font-semibold">{attendance.percentage.toFixed(1)}%</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      attendance.percentage >= 75 ? 'bg-green-100 text-green-800' :
                      attendance.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {attendance.percentage >= 75 ? 'Good' :
                       attendance.percentage >= 60 ? 'Average' : 'Poor'}
                    </span>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="7" className="table-cell text-center py-8 text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AcademicRecords;
