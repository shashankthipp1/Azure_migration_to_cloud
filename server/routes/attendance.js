const express = require('express');
const { getAttendance, addAttendance, updateAttendance } = require('../controllers/marksController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/attendance
// @desc    Get attendance with filters
// @access  Private
router.get('/', authMiddleware, getAttendance);

// @route   POST /api/attendance
// @desc    Add attendance
// @access  Private (Teacher, Admin)
router.post('/', authMiddleware, roleMiddleware(['teacher', 'admin']), addAttendance);

// @route   PUT /api/attendance/:id
// @desc    Update attendance
// @access  Private (Teacher, Admin)
router.put('/:id', authMiddleware, roleMiddleware(['teacher', 'admin']), updateAttendance);

module.exports = router;
