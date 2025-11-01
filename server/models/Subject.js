const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE']
  },
  teacherAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  credits: {
    type: Number,
    default: 3,
    min: 1,
    max: 6
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  description: {
    type: String,
    trim: true
  },
  totalClasses: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subject', subjectSchema);
