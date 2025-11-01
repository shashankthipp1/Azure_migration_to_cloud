const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE']
  },
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  section: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  marks: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    internalMarks: {
      type: Number,
      default: 0,
      min: 0,
      max: 50
    },
    externalMarks: {
      type: Number,
      default: 0,
      min: 0,
      max: 50
    },
    total: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
      default: 'F'
    }
  }],
  attendance: [{
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    totalClasses: {
      type: Number,
      default: 0
    },
    attendedClasses: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  }],
  overallAttendance: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  cgpa: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  admissionDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
studentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate CGPA
studentSchema.methods.calculateCGPA = function() {
  if (this.marks.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  this.marks.forEach(mark => {
    const points = this.getGradePoints(mark.grade);
    totalPoints += points * 3; // Assuming 3 credits per subject
    totalCredits += 3;
  });
  
  this.cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  return this.cgpa;
};

// Get grade points
studentSchema.methods.getGradePoints = function(grade) {
  const gradePoints = {
    'A+': 10, 'A': 9, 'B+': 8, 'B': 7, 'C+': 6, 'C': 5, 'D': 4, 'F': 0
  };
  return gradePoints[grade] || 0;
};

// Calculate overall attendance
studentSchema.methods.calculateOverallAttendance = function() {
  if (this.attendance.length === 0) return 0;
  
  let totalClasses = 0;
  let attendedClasses = 0;
  
  this.attendance.forEach(att => {
    totalClasses += att.totalClasses;
    attendedClasses += att.attendedClasses;
  });
  
  this.overallAttendance = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
  return this.overallAttendance;
};

module.exports = mongoose.model('Student', studentSchema);
