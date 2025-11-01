const mongoose = require('mongoose');
const config = require('../config/config');

// Import models
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Department = require('../models/Department');
const Subject = require('../models/Subject');

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
.then(async () => {
  console.log('Connected to MongoDB');
  
  // Check current data
  const studentCount = await Student.countDocuments();
  const teacherCount = await Teacher.countDocuments();
  const adminCount = await Admin.countDocuments();
  const deptCount = await Department.countDocuments();
  const subjectCount = await Subject.countDocuments();
  
  console.log('\n=== CURRENT DATABASE STATUS ===');
  console.log(`Students: ${studentCount}`);
  console.log(`Teachers: ${teacherCount}`);
  console.log(`Admins: ${adminCount}`);
  console.log(`Departments: ${deptCount}`);
  console.log(`Subjects: ${subjectCount}`);
  
  if (studentCount > 0) {
    const firstStudent = await Student.findOne();
    console.log(`\nFirst Student: ${firstStudent.name} (${firstStudent.rollNo})`);
  }
  
  if (teacherCount > 0) {
    const firstTeacher = await Teacher.findOne();
    console.log(`First Teacher: ${firstTeacher.name} (${firstTeacher.email})`);
  }
  
  mongoose.connection.close();
  process.exit(0);
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});
