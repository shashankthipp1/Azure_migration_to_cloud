const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard
// @desc    Get dashboard statistics based on user role
// @access  Private
router.get('/', authMiddleware, getDashboardStats);

module.exports = router;
