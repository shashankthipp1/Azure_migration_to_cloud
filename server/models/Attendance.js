const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  totalClasses: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  attendedClasses: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  percentage: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    max: 100
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  academicYear: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Late', 'Excused'],
    default: 'Present'
  },
  remarks: {
    type: String,
    trim: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }
}, {
  timestamps: true
});

// Calculate percentage before saving
attendanceSchema.pre('save', function(next) {
  if (this.totalClasses > 0) {
    this.percentage = (this.attendedClasses / this.totalClasses) * 100;
  } else {
    this.percentage = 0;
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
