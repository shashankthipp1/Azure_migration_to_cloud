const Marks = require('../models/Marks');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

const getMarks = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { studentId, subjectId, semester } = req.query;

    let query = {};

    // Students can only view their own marks
    if (role === 'student') {
      query.studentId = userId;
    } else if (studentId) {
      query.studentId = studentId;
    }

    if (subjectId) query.subject = subjectId;
    if (semester) query.semester = parseInt(semester);

    const marks = await Marks.find(query)
      .populate('studentId', 'name rollNo')
      .populate('subject', 'name code')
      .populate('updatedBy', 'name staffId')
      .sort({ createdAt: -1 });

    res.json({ marks });

  } catch (error) {
    console.error('Get marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addMarks = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    if (role === 'student') {
      return res.status(403).json({ message: 'Students cannot add marks' });
    }

    const { studentId, subjectId, internalMarks, externalMarks, semester, academicYear, examType } = req.body;

    // Check if marks already exist for this student and subject
    const existingMarks = await Marks.findOne({
      studentId,
      subject: subjectId,
      semester,
      academicYear,
      examType
    });

    if (existingMarks) {
      return res.status(400).json({ message: 'Marks already exist for this student and subject' });
    }

    const marks = new Marks({
      studentId,
      subject: subjectId,
      internalMarks,
      externalMarks,
      semester,
      academicYear,
      examType,
      updatedBy: userId
    });

    await marks.save();

    // Update student's marks array
    const student = await Student.findById(studentId);
    if (student) {
      const existingMarkIndex = student.marks.findIndex(
        mark => mark.subject.toString() === subjectId
      );

      if (existingMarkIndex >= 0) {
        student.marks[existingMarkIndex] = {
          subject: subjectId,
          internalMarks,
          externalMarks,
          total: marks.total,
          grade: marks.grade
        };
      } else {
        student.marks.push({
          subject: subjectId,
          internalMarks,
          externalMarks,
          total: marks.total,
          grade: marks.grade
        });
      }

      student.calculateCGPA();
      await student.save();
    }

    res.status(201).json({
      message: 'Marks added successfully',
      marks
    });

  } catch (error) {
    console.error('Add marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMarks = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { id } = req.params;

    if (role === 'student') {
      return res.status(403).json({ message: 'Students cannot update marks' });
    }

    const marks = await Marks.findByIdAndUpdate(
      id,
      { ...req.body, updatedBy: userId },
      { new: true, runValidators: true }
    );

    if (!marks) {
      return res.status(404).json({ message: 'Marks not found' });
    }

    // Update student's marks array
    const student = await Student.findById(marks.studentId);
    if (student) {
      const markIndex = student.marks.findIndex(
        mark => mark.subject.toString() === marks.subject.toString()
      );

      if (markIndex >= 0) {
        student.marks[markIndex] = {
          subject: marks.subject,
          internalMarks: marks.internalMarks,
          externalMarks: marks.externalMarks,
          total: marks.total,
          grade: marks.grade
        };
      }

      student.calculateCGPA();
      await student.save();
    }

    res.json({
      message: 'Marks updated successfully',
      marks
    });

  } catch (error) {
    console.error('Update marks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAttendance = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { studentId, subjectId, semester } = req.query;

    let query = {};

    if (role === 'student') {
      query.studentId = userId;
    } else if (studentId) {
      query.studentId = studentId;
    }

    if (subjectId) query.subject = subjectId;
    if (semester) query.semester = parseInt(semester);

    const attendance = await Attendance.find(query)
      .populate('studentId', 'name rollNo')
      .populate('subject', 'name code')
      .populate('updatedBy', 'name staffId')
      .sort({ createdAt: -1 });

    res.json({ attendance });

  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addAttendance = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    if (role === 'student') {
      return res.status(403).json({ message: 'Students cannot add attendance' });
    }

    const { studentId, subjectId, totalClasses, attendedClasses, semester, academicYear } = req.body;

    // Check if attendance already exists
    const existingAttendance = await Attendance.findOne({
      studentId,
      subject: subjectId,
      semester,
      academicYear
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already exists for this student and subject' });
    }

    const attendance = new Attendance({
      studentId,
      subject: subjectId,
      totalClasses,
      attendedClasses,
      semester,
      academicYear,
      updatedBy: userId
    });

    await attendance.save();

    // Update student's attendance array
    const student = await Student.findById(studentId);
    if (student) {
      const existingAttendanceIndex = student.attendance.findIndex(
        att => att.subject.toString() === subjectId
      );

      if (existingAttendanceIndex >= 0) {
        student.attendance[existingAttendanceIndex] = {
          subject: subjectId,
          totalClasses,
          attendedClasses,
          percentage: attendance.percentage
        };
      } else {
        student.attendance.push({
          subject: subjectId,
          totalClasses,
          attendedClasses,
          percentage: attendance.percentage
        });
      }

      student.calculateOverallAttendance();
      await student.save();
    }

    res.status(201).json({
      message: 'Attendance added successfully',
      attendance
    });

  } catch (error) {
    console.error('Add attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { id } = req.params;

    if (role === 'student') {
      return res.status(403).json({ message: 'Students cannot update attendance' });
    }

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { ...req.body, updatedBy: userId },
      { new: true, runValidators: true }
    );

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance not found' });
    }

    // Update student's attendance array
    const student = await Student.findById(attendance.studentId);
    if (student) {
      const attendanceIndex = student.attendance.findIndex(
        att => att.subject.toString() === attendance.subject.toString()
      );

      if (attendanceIndex >= 0) {
        student.attendance[attendanceIndex] = {
          subject: attendance.subject,
          totalClasses: attendance.totalClasses,
          attendedClasses: attendance.attendedClasses,
          percentage: attendance.percentage
        };
      }

      student.calculateOverallAttendance();
      await student.save();
    }

    res.json({
      message: 'Attendance updated successfully',
      attendance
    });

  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMarks,
  addMarks,
  updateMarks,
  getAttendance,
  addAttendance,
  updateAttendance
};
