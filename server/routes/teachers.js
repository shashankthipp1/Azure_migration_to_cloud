const express = require('express');
const { getAllTeachers, createTeacher, updateTeacher, deleteTeacher } = require('../controllers/studentController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/teachers
// @desc    Get all teachers with filters
// @access  Private (Admin, Teacher)
router.get('/', authMiddleware, roleMiddleware(['admin', 'teacher']), getAllTeachers);

// @route   POST /api/teachers
// @desc    Create new teacher
// @access  Private (Admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), createTeacher);

// @route   PUT /api/teachers/:id
// @desc    Update a teacher
// @access  Private (Admin only)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateTeacher);

// @route   DELETE /api/teachers/:id
// @desc    Deactivate a teacher
// @access  Private (Admin only)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteTeacher);

module.exports = router;
