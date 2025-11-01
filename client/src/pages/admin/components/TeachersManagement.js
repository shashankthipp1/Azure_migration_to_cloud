import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { teachersAPI } from '../../../services/api';
import toast from 'react-hot-toast';

const TeachersManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    staffId: '',
    department: '',
    password: '',
    designation: '',
  });

  useEffect(() => {
    fetchTeachers();
  }, [currentPage, departmentFilter, searchTerm]);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        department: departmentFilter
      };

      const response = await teachersAPI.getAll(params);
      setTeachers(response.data.teachers);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTeachers();
  };

  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'];

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers Management</h1>
          <p className="text-gray-600">Manage faculty records and information</p>
        </div>
        <button
          className="btn-primary flex items-center space-x-2"
          onClick={() => {
            setForm({ name: '', email: '', staffId: '', department: '', password: '', designation: '' });
            setShowAddModal(true);
          }}
        >
          <Plus className="w-5 h-5" />
          <span>Add Teacher</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="label">Search Teachers</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by name or staff ID..."
              />
            </div>
          </div>

          <div className="min-w-48">
            <label className="label">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Teachers Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Teacher</th>
                <th className="table-header">Staff ID</th>
                <th className="table-header">Department</th>
                <th className="table-header">Designation</th>
                <th className="table-header">Experience</th>
                <th className="table-header">Subjects</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="table-cell text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="table-cell text-center py-8 text-gray-500">
                    No teachers found
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-green-600">
                            {teacher.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{teacher.name}</p>
                          <p className="text-sm text-gray-500">{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell font-mono">{teacher.staffId}</td>
                    <td className="table-cell">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {teacher.department}
                      </span>
                    </td>
                    <td className="table-cell">{teacher.designation}</td>
                    <td className="table-cell">{teacher.experience} years</td>
                    <td className="table-cell">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {teacher.subjectsHandled?.length || 0} subjects
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                          onClick={() => {
                            setEditingTeacher(teacher);
                            setForm({
                              name: teacher.name || '',
                              email: teacher.email || '',
                              staffId: teacher.staffId || '',
                              department: teacher.department || '',
                              password: '',
                              designation: teacher.designation || '',
                            });
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          onClick={async () => {
                            try {
                              if (!window.confirm('Deactivate this teacher?')) return;
                              await teachersAPI.delete(teacher._id);
                              toast.success('Teacher deactivated');
                              fetchTeachers();
                            } catch (err) {
                              console.error('Delete teacher failed:', err);
                              toast.error(err.response?.data?.message || 'Failed to deactivate teacher');
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Add/Edit Modal */}
    {(showAddModal || showEditModal) && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{showAddModal ? 'Add Teacher' : 'Edit Teacher'}</h3>
            <button className="p-1" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <form
            className="p-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                if (showAddModal) {
                  const required = ['name', 'email', 'staffId', 'department', 'password'];
                  for (const k of required) {
                    if (!form[k]) {
                      toast.error(`Missing ${k}`);
                      return;
                    }
                  }
                  await teachersAPI.create(form);
                  toast.success('Teacher created');
                } else if (showEditModal && editingTeacher) {
                  const payload = { name: form.name, email: form.email, staffId: form.staffId, department: form.department, designation: form.designation };
                  await teachersAPI.update(editingTeacher._id, payload);
                  toast.success('Teacher updated');
                }
                setShowAddModal(false);
                setShowEditModal(false);
                setEditingTeacher(null);
                fetchTeachers();
              } catch (err) {
                console.error('Save teacher failed:', err);
                toast.error(err.response?.data?.message || 'Failed to save teacher');
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Name</label>
                <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="label">Staff ID</label>
                <input className="input-field" value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })} required />
              </div>
              <div>
                <label className="label">Department</label>
                <select className="input-field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required>
                  <option value="">Select</option>
                  {departments.map(d => (<option key={d} value={d}>{d}</option>))}
                </select>
              </div>
              <div>
                <label className="label">Designation</label>
                <input className="input-field" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
              </div>
              {showAddModal && (
                <div>
                  <label className="label">Temporary Password</label>
                  <input type="password" className="input-field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button type="button" className="px-4 py-2 border rounded" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {showAddModal ? 'Create' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </>
  );
};

export default TeachersManagement;
