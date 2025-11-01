const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Marks = require('../models/Marks');
const Attendance = require('../models/Attendance');

const getDashboardStats = async (req, res) => {
  try {
    const { role, id } = req.user;

    if (role === 'admin') {
      // Admin dashboard - overall statistics
      const totalStudents = await Student.countDocuments({ isActive: true });
      const totalTeachers = await Teacher.countDocuments({ isActive: true });
      const totalDepartments = await Department.countDocuments({ isActive: true });
      const totalSubjects = await Subject.countDocuments({ isActive: true });

      // Department-wise statistics
      const departmentStats = await Department.aggregate([
        {
          $lookup: {
            from: 'students',
            localField: 'name',
            foreignField: 'department',
            as: 'students'
          }
        },
        {
          $lookup: {
            from: 'teachers',
            localField: 'name',
            foreignField: 'department',
            as: 'teachers'
          }
        },
        {
          $project: {
            name: 1,
            fullName: 1,
            totalStudents: { $size: '$students' },
            totalTeachers: { $size: '$teachers' }
          }
        }
      ]);

      // Top performing students
      const topStudents = await Student.find({ isActive: true })
        .sort({ cgpa: -1 })
        .limit(10)
        .select('name rollNo department cgpa overallAttendance');

      // Recent activities
      const recentStudents = await Student.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name rollNo department admissionDate');

      res.json({
        overview: {
          totalStudents,
          totalTeachers,
          totalDepartments,
          totalSubjects
        },
        departmentStats,
        topStudents,
        recentStudents
      });

    } else if (role === 'teacher') {
      // Teacher dashboard - classes and subjects handled
      const teacher = await Teacher.findById(id).populate('subjectsHandled');
      
      const subjectsHandled = teacher.subjectsHandled;
      const subjectIds = subjectsHandled.map(subject => subject._id);

      // Students enrolled in teacher's subjects
      const studentsInSubjects = await Student.find({
        subjects: { $in: subjectIds },
        isActive: true
      }).populate('subjects');

      // Marks and attendance for teacher's subjects
      const marksData = await Marks.find({
        subject: { $in: subjectIds }
      }).populate('studentId subject');

      const attendanceData = await Attendance.find({
        subject: { $in: subjectIds }
      }).populate('studentId subject');

      res.json({
        teacher: {
          name: teacher.name,
          department: teacher.department,
          designation: teacher.designation
        },
        subjectsHandled,
        studentsCount: studentsInSubjects.length,
        marksData,
        attendanceData
      });

    } else if (role === 'student') {
      // Student dashboard - personal information and performance
      const student = await Student.findById(id)
        .populate('subjects')
        .populate('marks.subject')
        .populate('attendance.subject');

      // Calculate current semester performance
      const currentSemester = student.year * 2; // Assuming 2 semesters per year
      const currentMarks = student.marks.filter(mark => 
        mark.subject && mark.subject.semester === currentSemester
      );

      const currentAttendance = student.attendance.filter(att => 
        att.subject && att.subject.semester === currentSemester
      );

      // Performance trends
      const performanceTrend = await Marks.aggregate([
        { $match: { studentId: student._id } },
        {
          $group: {
            _id: '$semester',
            avgMarks: { $avg: '$total' },
            totalSubjects: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      res.json({
        student: {
          name: student.name,
          rollNo: student.rollNo,
          department: student.department,
          year: student.year,
          section: student.section,
          cgpa: student.cgpa,
          overallAttendance: student.overallAttendance
        },
        subjects: student.subjects,
        currentMarks,
        currentAttendance,
        performanceTrend,
        allMarks: student.marks,
        allAttendance: student.attendance
      });
    }

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats
};
