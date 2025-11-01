import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Save, X } from 'lucide-react';
import { attendanceAPI } from '../../../services/api';
import toast from 'react-hot-toast';

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceAPI.getAll();
      setAttendance(response.data.attendance);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600">Manage student attendance records</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Attendance</span>
        </button>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Student</th>
                <th className="table-header">Subject</th>
                <th className="table-header">Semester</th>
                <th className="table-header">Attended</th>
                <th className="table-header">Total</th>
                <th className="table-header">Percentage</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="table-cell text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : attendance.length === 0 ? (
                <tr>
                  <td colSpan="8" className="table-cell text-center py-8 text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendance.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-gray-900">{record.studentId?.name}</p>
                        <p className="text-sm text-gray-500">{record.studentId?.rollNo}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-gray-900">{record.subject?.name}</p>
                        <p className="text-sm text-gray-500">{record.subject?.code}</p>
                      </div>
                    </td>
                    <td className="table-cell">Sem {record.semester}</td>
                    <td className="table-cell">{record.attendedClasses}</td>
                    <td className="table-cell">{record.totalClasses}</td>
                    <td className="table-cell font-semibold">{record.percentage.toFixed(1)}%</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        record.percentage >= 75 ? 'bg-green-100 text-green-800' :
                        record.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.percentage >= 75 ? 'Good' :
                         record.percentage >= 60 ? 'Average' : 'Poor'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setEditingAttendance(record)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;
