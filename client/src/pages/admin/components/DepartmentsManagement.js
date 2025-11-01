import React, { useState, useEffect } from 'react';
import { Building2, Users, GraduationCap, BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { departmentsAPI } from '../../../services/api';
import toast from 'react-hot-toast';

const DepartmentsManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [deptResponse, subjResponse] = await Promise.all([
        departmentsAPI.getAll(),
        departmentsAPI.getSubjects()
      ]);
      
      setDepartments(deptResponse.data.departments);
      setSubjects(subjResponse.data.subjects);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load department data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Departments Management</h1>
        <p className="text-gray-600">Overview of all departments and their statistics</p>
      </div>

      {/* Department Header */}
      <div className="flex items-center justify-between">
        <div />
        <button
          className="btn-primary flex items-center space-x-2"
          onClick={async () => {
            try {
              const name = prompt('Department code (CSE/ECE/MECH/CIVIL/EEE)');
              const fullName = prompt('Full name');
              const establishedYear = Number(prompt('Established year')) || undefined;
              if (!name || !fullName) return;
              await departmentsAPI.createDepartment({ name, fullName, establishedYear });
              toast.success('Department created');
              fetchData();
            } catch (err) {
              console.error('Create department failed:', err);
              toast.error(err.response?.data?.message || 'Failed to create department');
            }
          }}
        >
          <Plus className="w-5 h-5" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptSubjects = subjects.filter(subj => subj.department === dept.name);
          
          return (
            <div key={dept._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{dept.fullName}</h3>
                    <p className="text-sm text-gray-600">{dept.name}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-1 text-green-600 hover:bg-green-100 rounded"
                  onClick={async () => {
                    try {
                      const fullName = prompt('Full name', dept.fullName);
                      const establishedYear = Number(prompt('Established year', dept.establishedYear));
                      if (!fullName) return;
                      await departmentsAPI.updateDepartment(dept._id, { fullName, establishedYear });
                      toast.success('Department updated');
                      fetchData();
                    } catch (err) {
                      console.error('Update department failed:', err);
                      toast.error(err.response?.data?.message || 'Failed to update department');
                    }
                  }}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                  onClick={async () => {
                    try {
                      if (!window.confirm('Deactivate this department?')) return;
                      await departmentsAPI.deleteDepartment(dept._id);
                      toast.success('Department deactivated');
                      fetchData();
                    } catch (err) {
                      console.error('Delete department failed:', err);
                      toast.error(err.response?.data?.message || 'Failed to deactivate department');
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Students</span>
                  </div>
                  <span className="font-semibold text-gray-900">{dept.totalStudents}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Teachers</span>
                  </div>
                  <span className="font-semibold text-gray-900">{dept.totalTeachers}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Subjects</span>
                  </div>
                  <span className="font-semibold text-gray-900">{deptSubjects.length}</span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Established: {dept.establishedYear}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subjects Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Subjects by Department</h3>
          <button
            className="btn-primary flex items-center space-x-2"
            onClick={async () => {
              try {
                const name = prompt('Subject name');
                const code = prompt('Subject code');
                const department = prompt('Department (CSE/ECE/MECH/CIVIL/EEE)');
                const semester = Number(prompt('Semester (1-8)'));
                const year = Number(prompt('Year (1-4)'));
                if (!name || !code || !department || !semester || !year) return;
                await departmentsAPI.createSubject({ name, code, department, semester, year });
                toast.success('Subject created');
                fetchData();
              } catch (err) {
                console.error('Create subject failed:', err);
                toast.error(err.response?.data?.message || 'Failed to create subject');
              }
            }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Subject</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Subject</th>
                <th className="table-header">Code</th>
                <th className="table-header">Department</th>
                <th className="table-header">Semester</th>
                <th className="table-header">Year</th>
                <th className="table-header">Teacher</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject._id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{subject.name}</td>
                  <td className="table-cell font-mono">{subject.code}</td>
                  <td className="table-cell">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {subject.department}
                    </span>
                  </td>
                  <td className="table-cell">Sem {subject.semester}</td>
                  <td className="table-cell">Year {subject.year}</td>
                  <td className="table-cell">
                    {subject.teacherAssigned ? (
                      <span className="text-sm text-gray-900">
                        {subject.teacherAssigned.name}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 italic">Not assigned</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        onClick={async () => {
                          try {
                            const name = prompt('Subject name', subject.name);
                            const semester = Number(prompt('Semester (1-8)', subject.semester));
                            const year = Number(prompt('Year (1-4)', subject.year));
                            if (!name || !semester || !year) return;
                            await departmentsAPI.updateSubject(subject._id, { name, semester, year });
                            toast.success('Subject updated');
                            fetchData();
                          } catch (err) {
                            console.error('Update subject failed:', err);
                            toast.error(err.response?.data?.message || 'Failed to update subject');
                          }
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                        onClick={async () => {
                          try {
                            if (!window.confirm('Deactivate this subject?')) return;
                            await departmentsAPI.deleteSubject(subject._id);
                            toast.success('Subject deactivated');
                            fetchData();
                          } catch (err) {
                            console.error('Delete subject failed:', err);
                            toast.error(err.response?.data?.message || 'Failed to deactivate subject');
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsManagement;
