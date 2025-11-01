const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Department = require('../models/Department');
const Subject = require('../models/Subject');

const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, year, search } = req.query;
    const query = { isActive: true };

    // Filter by department
    if (department) {
      query.department = department;
    }

    // Filter by year
    if (year) {
      query.year = parseInt(year);
    }

    // Search by name or roll number
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .populate('subjects')
      .sort({ rollNo: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    let student;
    if (role === 'student' && id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    student = await Student.findById(id)
      .populate('subjects')
      .populate('marks.subject')
      .populate('attendance.subject');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ student });

  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createStudent = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const studentData = req.body;
    const student = new Student(studentData);
    await student.save();

    res.status(201).json({
      message: 'Student created successfully',
      student
    });

  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    // Students can only update their own profile
    if (role === 'student' && id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      message: 'Student updated successfully',
      student
    });

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deactivated successfully' });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, search } = req.query;
    const query = { isActive: true };

    if (department) {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { staffId: { $regex: search, $options: 'i' } }
      ];
    }

    const teachers = await Teacher.find(query)
      .populate('subjectsHandled')
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Teacher.countDocuments(query);

    res.json({
      teachers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create teacher (Admin only)
const createTeacher = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const required = ['name', 'staffId', 'email', 'password', 'department'];
    for (const key of required) {
      if (!req.body[key]) {
        return res.status(400).json({ message: `Missing required field: ${key}` });
      }
    }

    const teacher = new Teacher({
      name: req.body.name,
      staffId: req.body.staffId,
      email: req.body.email,
      password: req.body.password,
      department: req.body.department,
      contact: req.body.contact,
      qualification: req.body.qualification,
      designation: req.body.designation,
      experience: req.body.experience,
      address: req.body.address,
    });

    await teacher.save();

    res.status(201).json({
      message: 'Teacher created successfully',
      teacher,
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update teacher
const updateTeacher = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { id } = req.params;
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Teacher updated successfully', teacher });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete (deactivate) teacher
const deleteTeacher = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { id } = req.params;
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.json({ message: 'Teacher deactivated successfully' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .populate('headOfDepartment', 'name email');

    res.json({ departments });

  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getSubjects = async (req, res) => {
  try {
    const { department, semester, year } = req.query;
    const query = { isActive: true };

    if (department) query.department = department;
    if (semester) query.semester = parseInt(semester);
    if (year) query.year = parseInt(year);

    const subjects = await Subject.find(query)
      .populate('teacherAssigned', 'name staffId');

    res.json({ subjects });

  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create department (Admin only)
const createDepartment = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ message: 'Access denied. Admin only.' });

    const { name, fullName, establishedYear, description } = req.body;
    if (!name || !fullName) return res.status(400).json({ message: 'name and fullName are required' });

    const department = new Department({ name, fullName, establishedYear, description });
    await department.save();
    res.status(201).json({ message: 'Department created successfully', department });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update department (Admin only)
const updateDepartment = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ message: 'Access denied. Admin only.' });
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department updated successfully', department });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete (deactivate) department (Admin only)
const deleteDepartment = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ message: 'Access denied. Admin only.' });
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json({ message: 'Department deactivated successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create subject (Admin only)
const createSubject = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ message: 'Access denied. Admin only.' });
    const required = ['name', 'code', 'department', 'semester', 'year'];
    for (const k of required) if (!req.body[k]) return res.status(400).json({ message: `Missing ${k}` });
    const subject = new Subject(req.body);
    await subject.save();
    res.status(201).json({ message: 'Subject created successfully', subject });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update subject (Admin only)
const updateSubject = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ message: 'Access denied. Admin only.' });
    const { id } = req.params;
    const subject = await Subject.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject updated successfully', subject });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete (deactivate) subject (Admin only)
const deleteSubject = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ message: 'Access denied. Admin only.' });
    const { id } = req.params;
    const subject = await Subject.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.json({ message: 'Subject deactivated successfully' });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getDepartments,
  getSubjects,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  createSubject,
  updateSubject,
  deleteSubject
};
