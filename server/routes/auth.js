const express = require('express');
const { login, register, getProfile } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user (student, teacher, admin)
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/register
// @desc    Register new user (student, teacher)
// @access  Public
router.post('/register', register);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
