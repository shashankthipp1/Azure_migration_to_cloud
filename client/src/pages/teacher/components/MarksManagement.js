import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Save, X } from 'lucide-react';
import { marksAPI } from '../../../services/api';
import toast from 'react-hot-toast';

const MarksManagement = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMark, setEditingMark] = useState(null);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      const response = await marksAPI.getAll();
      setMarks(response.data.marks);
    } catch (error) {
      console.error('Error fetching marks:', error);
      toast.error('Failed to load marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marks Management</h1>
          <p className="text-gray-600">Manage student marks and grades</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Marks</span>
        </button>
      </div>

      {/* Marks Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Student</th>
                <th className="table-header">Subject</th>
                <th className="table-header">Semester</th>
                <th className="table-header">Internal</th>
                <th className="table-header">External</th>
                <th className="table-header">Total</th>
                <th className="table-header">Grade</th>
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
              ) : marks.length === 0 ? (
                <tr>
                  <td colSpan="8" className="table-cell text-center py-8 text-gray-500">
                    No marks found
                  </td>
                </tr>
              ) : (
                marks.map((mark) => (
                  <tr key={mark._id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-gray-900">{mark.studentId?.name}</p>
                        <p className="text-sm text-gray-500">{mark.studentId?.rollNo}</p>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <p className="font-medium text-gray-900">{mark.subject?.name}</p>
                        <p className="text-sm text-gray-500">{mark.subject?.code}</p>
                      </div>
                    </td>
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
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setEditingMark(mark)}
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

export default MarksManagement;
