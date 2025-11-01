const express = require('express');
const { getDepartments, getSubjects, createDepartment, updateDepartment, deleteDepartment, createSubject, updateSubject, deleteSubject } = require('../controllers/studentController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/departments
// @desc    Get all departments
// @access  Private
router.get('/', authMiddleware, getDepartments);

// @route   GET /api/subjects
// @desc    Get subjects with filters
// @access  Private
router.get('/subjects', authMiddleware, getSubjects);

// Department CRUD (admin only)
router.post('/', authMiddleware, roleMiddleware(['admin']), createDepartment);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateDepartment);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteDepartment);

// Subject CRUD (admin only)
router.post('/subjects', authMiddleware, roleMiddleware(['admin']), createSubject);
router.put('/subjects/:id', authMiddleware, roleMiddleware(['admin']), updateSubject);
router.delete('/subjects/:id', authMiddleware, roleMiddleware(['admin']), deleteSubject);

module.exports = router;
