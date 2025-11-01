const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'],
    trim: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  totalTeachers: {
    type: Number,
    default: 0
  },
  headOfDepartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  establishedYear: {
    type: Number,
    default: 2020
  },
  location: {
    type: String,
    trim: true
  },
  contactInfo: {
    phone: String,
    email: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema);
