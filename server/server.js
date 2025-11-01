// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const config = require('./config/config');
const Admin = require('./models/Admin');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const marksRoutes = require('./routes/marks');
const attendanceRoutes = require('./routes/attendance');
const dashboardRoutes = require('./routes/dashboard');
const departmentRoutes = require('./routes/departments');

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      
      if (config.NODE_ENV === 'development') {
        // In development, allow localhost origins
        try {
          const url = new URL(origin);
          if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
            return callback(null, true);
          }
        } catch (err) {
          // Invalid URL, deny
        }
      }
      
      // In production, allow configured frontend URL and Azure domains
      const allowedOrigins = [
        config.FRONTEND_URL,
      ];
      
      // Check exact match first
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Allow Azure Web App domains (*.azurewebsites.net)
      if (origin.endsWith('.azurewebsites.net')) {
        return callback(null, true);
      }
      
      // Deny by default in production
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ Logging (for development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`➡️  ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ✅ MongoDB Connection
mongoose
  .connect(config.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected successfully');

    // One-time admin seed
    const exists = await Admin.findOne({ username: 'admin' });
    if (!exists) {
      await Admin.create({
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com',
        name: 'Default Admin',
        isActive: true,
      });
      console.log('👤 Default admin user created (admin/admin123)');
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/departments', departmentRoutes);

// ✅ Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    message: 'College Management System API is running',
    timestamp: new Date().toISOString(),
    status: 'OK',
  });
});

// ✅ Serve React Frontend (Build Folder) - Production only
if (config.NODE_ENV === 'production') {
  // Check multiple possible locations for build folder
  const possiblePaths = [
    path.join(__dirname, '../client/build'),
    path.join(__dirname, 'client-build'),
    path.join(__dirname, '../client-build'),
  ];
  
  const fs = require('fs');
  let clientBuildPath = null;
  
  for (const buildPath of possiblePaths) {
    if (fs.existsSync(buildPath)) {
      clientBuildPath = buildPath;
      console.log(`✅ Found client build at: ${clientBuildPath}`);
      break;
    }
  }
  
  if (clientBuildPath) {
    app.use(express.static(clientBuildPath));

    // Serve React app for all non-API routes
    app.get('*', (req, res) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'Route not found' });
      }
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
  } else {
    console.warn('⚠️  Client build folder not found. Frontend will not be served.');
    console.warn('   Checked paths:', possiblePaths);
  }
}

// ✅ 404 for unknown API routes (after frontend serve)
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error',
  });
});

// ✅ Start Server with retry if port is in use
const startServer = (port, attemptsLeft = 3) => {
  const server = app
    .listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`🌍 Environment: ${config.NODE_ENV}`);
      console.log(`🧩 Health Check: http://localhost:${port}/api/health`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
        const nextPort = port + 1;
        console.warn(`⚠️  Port ${port} in use. Retrying on ${nextPort}... (${attemptsLeft - 1} attempts left)`);
        startServer(nextPort, attemptsLeft - 1);
      } else {
        console.error('❌ Failed to start server:', err.message);
        process.exit(1);
      }
    });
  return server;
};

startServer(Number(config.PORT));

module.exports = app;
