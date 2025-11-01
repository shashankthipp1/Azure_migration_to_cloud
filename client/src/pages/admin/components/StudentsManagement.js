import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { studentsAPI } from '../../../services/api';
import toast from 'react-hot-toast';

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    rollNo: '',
    gender: '',
    department: '',
    year: '',
    section: '',
    password: '',
  });

  useEffect(() => {
    fetchStudents();
  }, [currentPage, departmentFilter, yearFilter, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        department: departmentFilter,
        year: yearFilter
      };

      const response = await studentsAPI.getAll(params);
      setStudents(response.data.students);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStudents();
  };

  const departments = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'];
  const years = [1, 2, 3, 4];

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-600">Manage student records and information</p>
        </div>
        <button
          className="btn-primary flex items-center space-x-2"
          onClick={() => {
            setForm({ name: '', email: '', rollNo: '', gender: '', department: '', year: '', section: '', password: '' });
            setShowAddModal(true);
          }}
        >
          <Plus className="w-5 h-5" />
          <span>Add Student</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="label">Search Students</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                placeholder="Search by name or roll number..."
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

          <div className="min-w-32">
            <label className="label">Year</label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>Year {year}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Students Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Student</th>
                <th className="table-header">Roll No</th>
                <th className="table-header">Department</th>
                <th className="table-header">Year</th>
                <th className="table-header">CGPA</th>
                <th className="table-header">Attendance</th>
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
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="table-cell text-center py-8 text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-600">
                            {student.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell font-mono">{student.rollNo}</td>
                    <td className="table-cell">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {student.department}
                      </span>
                    </td>
                    <td className="table-cell">Year {student.year}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.cgpa >= 8 ? 'bg-green-100 text-green-800' :
                        student.cgpa >= 6 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.cgpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.overallAttendance >= 75 ? 'bg-green-100 text-green-800' :
                        student.overallAttendance >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.overallAttendance.toFixed(1)}%
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
                            setEditingStudent(student);
                            setForm({
                              name: student.name || '',
                              email: student.email || '',
                              rollNo: student.rollNo || '',
                              gender: student.gender || '',
                              department: student.department || '',
                              year: student.year || '',
                              section: student.section || '',
                              password: '',
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
                              if (!window.confirm('Deactivate this student?')) return;
                              await studentsAPI.delete(student._id);
                              toast.success('Student deactivated');
                              fetchStudents();
                            } catch (err) {
                              console.error('Delete student failed:', err);
                              toast.error(err.response?.data?.message || 'Failed to deactivate student');
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
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{showAddModal ? 'Add Student' : 'Edit Student'}</h3>
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
                  const required = ['name', 'email', 'rollNo', 'gender', 'department', 'year', 'section', 'password'];
                  for (const k of required) {
                    if (!form[k]) { toast.error(`Missing ${k}`); return; }
                  }
                  await studentsAPI.create({ ...form, year: Number(form.year) });
                  toast.success('Student created');
                } else if (showEditModal && editingStudent) {
                  const payload = { name: form.name, email: form.email, rollNo: form.rollNo, gender: form.gender, department: form.department, year: Number(form.year), section: form.section };
                  await studentsAPI.update(editingStudent._id, payload);
                  toast.success('Student updated');
                }
                setShowAddModal(false);
                setShowEditModal(false);
                setEditingStudent(null);
                setCurrentPage(1);
                fetchStudents();
              } catch (err) {
                console.error('Save student failed:', err);
                toast.error(err.response?.data?.message || 'Failed to save student');
              }
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Name</label>
                <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="label">Roll No</label>
                <input className="input-field" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} required />
              </div>
              <div>
                <label className="label">Gender</label>
                <select className="input-field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="label">Department</label>
                <select className="input-field" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required>
                  <option value="">Select</option>
                  {departments.map(d => (<option key={d} value={d}>{d}</option>))}
                </select>
              </div>
              <div>
                <label className="label">Year</label>
                <select className="input-field" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required>
                  <option value="">Select</option>
                  {years.map(y => (<option key={y} value={y}>{y}</option>))}
                </select>
              </div>
              <div>
                <label className="label">Section</label>
                <select className="input-field" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} required>
                  <option value="">Select</option>
                  {['A','B','C','D'].map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
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

export default StudentsManagement;
