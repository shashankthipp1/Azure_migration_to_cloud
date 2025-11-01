const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

const login = async (req, res) => {
  try {
    const { email, password, role, rollNo, staffId, username } = req.body;
    
    // Debug logging only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Login attempt:', { role, email, username, rollNo, hasPassword: !!password });
    }

    let user = null;
    let userRole = role;

    // Determine login method based on role
    if (role === 'student') {
      if (!rollNo || !password) {
        return res.status(400).json({ message: 'Roll number and password are required' });
      }
      user = await Student.findOne({ rollNo }).populate('subjects');
      userRole = 'student';
    } else if (role === 'teacher') {
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      user = await Teacher.findOne({ email }).populate('subjectsHandled');
      userRole = 'teacher';
    } else if (role === 'admin') {
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      user = await Admin.findOne({ username });
      userRole = 'admin';
    } else {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    if (!user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('User not found for:', { role, email, username, rollNo });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      if (process.env.NODE_ENV === 'development') {
        console.log('User account is deactivated:', user.email || user.username || user.rollNo);
      }
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Invalid password for:', user.email || user.username || user.rollNo);
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Login successful for:', user.email || user.username || user.rollNo);
    }

    // Update last login for admin
    if (role === 'admin') {
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const tokenPayload = {
      id: user._id,
      role: userRole,
      email: user.email || user.username,
      name: user.name
    };

    const token = generateToken(tokenPayload);

    // Prepare user data for response
    let userData = {
      id: user._id,
      name: user.name,
      email: user.email || user.username,
      role: userRole
    };

    // Add role-specific data
    if (role === 'student') {
      userData = {
        ...userData,
        rollNo: user.rollNo,
        department: user.department,
        year: user.year,
        section: user.section,
        cgpa: user.cgpa,
        overallAttendance: user.overallAttendance,
        subjects: user.subjects
      };
    } else if (role === 'teacher') {
      userData = {
        ...userData,
        staffId: user.staffId,
        department: user.department,
        designation: user.designation,
        subjectsHandled: user.subjectsHandled
      };
    } else if (role === 'admin') {
      userData = {
        ...userData,
        username: user.username,
        permissions: user.permissions
      };
    }

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const register = async (req, res) => {
  try {
    const { role } = req.body;

    if (role === 'student') {
      const { name, rollNo, email, password, gender, department, year, section } = req.body;

      // Check if student already exists
      const existingStudent = await Student.findOne({ 
        $or: [{ email }, { rollNo }] 
      });

      if (existingStudent) {
        return res.status(400).json({ message: 'Student with this email or roll number already exists' });
      }

      const student = new Student({
        name,
        rollNo,
        email,
        password,
        gender,
        department,
        year,
        section
      });

      await student.save();

      res.status(201).json({
        message: 'Student registered successfully',
        student: {
          id: student._id,
          name: student.name,
          rollNo: student.rollNo,
          email: student.email,
          department: student.department,
          year: student.year,
          section: student.section
        }
      });

    } else if (role === 'teacher') {
      const { name, staffId, email, password, department, contact, qualification, designation } = req.body;

      // Check if teacher already exists
      const existingTeacher = await Teacher.findOne({ 
        $or: [{ email }, { staffId }] 
      });

      if (existingTeacher) {
        return res.status(400).json({ message: 'Teacher with this email or staff ID already exists' });
      }

      const teacher = new Teacher({
        name,
        staffId,
        email,
        password,
        department,
        contact,
        qualification,
        designation
      });

      await teacher.save();

      res.status(201).json({
        message: 'Teacher registered successfully',
        teacher: {
          id: teacher._id,
          name: teacher.name,
          staffId: teacher.staffId,
          email: teacher.email,
          department: teacher.department,
          designation: teacher.designation
        }
      });

    } else {
      return res.status(400).json({ message: 'Invalid role for registration' });
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const getProfile = async (req, res) => {
  try {
    const { role, id } = req.user;

    let user = null;

    if (role === 'student') {
      user = await Student.findById(id).populate('subjects');
    } else if (role === 'teacher') {
      user = await Teacher.findById(id).populate('subjectsHandled');
    } else if (role === 'admin') {
      user = await Admin.findById(id);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  register,
  getProfile
};
