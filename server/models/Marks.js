const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
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
  internalMarks: {
    type: Number,
    required: true,
    min: 0,
    max: 50,
    default: 0
  },
  externalMarks: {
    type: Number,
    required: true,
    min: 0,
    max: 50,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  grade: {
    type: String,
    required: true,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    default: 'F'
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
  examType: {
    type: String,
    enum: ['Midterm', 'Final', 'Assignment', 'Quiz'],
    default: 'Final'
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

// Calculate total and grade before saving
marksSchema.pre('save', function(next) {
  this.total = this.internalMarks + this.externalMarks;
  
  // Calculate grade based on total marks
  if (this.total >= 90) this.grade = 'A+';
  else if (this.total >= 80) this.grade = 'A';
  else if (this.total >= 70) this.grade = 'B+';
  else if (this.total >= 60) this.grade = 'B';
  else if (this.total >= 50) this.grade = 'C+';
  else if (this.total >= 40) this.grade = 'C';
  else if (this.total >= 30) this.grade = 'D';
  else this.grade = 'F';
  
  next();
});

module.exports = mongoose.model('Marks', marksSchema);
