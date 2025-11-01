const express = require('express');
const { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent, getAllTeachers, getDepartments, getSubjects } = require('../controllers/studentController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/students
// @desc    Get all students with filters
// @access  Private (Admin, Teacher)
router.get('/', authMiddleware, roleMiddleware(['admin', 'teacher']), getAllStudents);

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Private
router.get('/:id', authMiddleware, getStudentById);

// @route   POST /api/students
// @desc    Create new student
// @access  Private (Admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), createStudent);

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private
router.put('/:id', authMiddleware, updateStudent);

// @route   DELETE /api/students/:id
// @desc    Delete student
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteStudent);

module.exports = router;
