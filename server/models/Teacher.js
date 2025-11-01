const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  staffId: {
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
  department: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE']
  },
  subjectsHandled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  contact: {
    type: String,
    trim: true
  },
  qualification: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    default: 0
  },
  designation: {
    type: String,
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'],
    default: 'Lecturer'
  },
  dateOfJoining: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    default: 0
  },
  address: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
teacherSchema.pre('save', async function(next) {
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
teacherSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Teacher', teacherSchema);
