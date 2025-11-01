const express = require('express');
const { getMarks, addMarks, updateMarks } = require('../controllers/marksController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/marks
// @desc    Get marks with filters
// @access  Private
router.get('/', authMiddleware, getMarks);

// @route   POST /api/marks
// @desc    Add marks
// @access  Private (Teacher, Admin)
router.post('/', authMiddleware, roleMiddleware(['teacher', 'admin']), addMarks);

// @route   PUT /api/marks/:id
// @desc    Update marks
// @access  Private (Teacher, Admin)
router.put('/:id', authMiddleware, roleMiddleware(['teacher', 'admin']), updateMarks);

module.exports = router;
