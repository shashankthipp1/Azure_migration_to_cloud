// Load environment variables
require('dotenv').config();

// Centralized configuration (env-first, with safe defaults)
const config = {
  // Use one canonical variable name across the app
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me-in-.env',
  PORT: process.env.PORT || 8080,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};

module.exports = config;
