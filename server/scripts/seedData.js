const mongoose = require('mongoose');
const config = require('../config/config');

// Import models
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Marks = require('../models/Marks');
const Attendance = require('../models/Attendance');

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
.then(() => {
  console.log('Connected to MongoDB for seeding');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Department data
const departments = [
  { name: 'CSE', fullName: 'Computer Science and Engineering', establishedYear: 2010 },
  { name: 'ECE', fullName: 'Electronics and Communication Engineering', establishedYear: 2012 },
  { name: 'MECH', fullName: 'Mechanical Engineering', establishedYear: 2008 },
  { name: 'CIVIL', fullName: 'Civil Engineering', establishedYear: 2005 },
  { name: 'EEE', fullName: 'Electrical and Electronics Engineering', establishedYear: 2007 }
];

// Subject data for each department
const subjectsData = {
  CSE: [
    { name: 'Data Structures', code: 'CSE101', semester: 1, year: 1 },
    { name: 'Programming Fundamentals', code: 'CSE102', semester: 1, year: 1 },
    { name: 'Computer Networks', code: 'CSE201', semester: 3, year: 2 },
    { name: 'Database Management', code: 'CSE202', semester: 4, year: 2 },
    { name: 'Operating Systems', code: 'CSE301', semester: 5, year: 3 },
    { name: 'Software Engineering', code: 'CSE302', semester: 6, year: 3 },
    { name: 'Machine Learning', code: 'CSE401', semester: 7, year: 4 },
    { name: 'Web Development', code: 'CSE402', semester: 8, year: 4 }
  ],
  ECE: [
    { name: 'Digital Electronics', code: 'ECE101', semester: 1, year: 1 },
    { name: 'Circuit Analysis', code: 'ECE102', semester: 1, year: 1 },
    { name: 'Microprocessors', code: 'ECE201', semester: 3, year: 2 },
    { name: 'Communication Systems', code: 'ECE202', semester: 4, year: 2 },
    { name: 'VLSI Design', code: 'ECE301', semester: 5, year: 3 },
    { name: 'Signal Processing', code: 'ECE302', semester: 6, year: 3 },
    { name: 'Embedded Systems', code: 'ECE401', semester: 7, year: 4 },
    { name: 'Wireless Communication', code: 'ECE402', semester: 8, year: 4 }
  ],
  MECH: [
    { name: 'Engineering Mechanics', code: 'MECH101', semester: 1, year: 1 },
    { name: 'Thermodynamics', code: 'MECH102', semester: 1, year: 1 },
    { name: 'Machine Design', code: 'MECH201', semester: 3, year: 2 },
    { name: 'Heat Transfer', code: 'MECH202', semester: 4, year: 2 },
    { name: 'Manufacturing Technology', code: 'MECH301', semester: 5, year: 3 },
    { name: 'Fluid Mechanics', code: 'MECH302', semester: 6, year: 3 },
    { name: 'Automotive Engineering', code: 'MECH401', semester: 7, year: 4 },
    { name: 'Robotics', code: 'MECH402', semester: 8, year: 4 }
  ],
  CIVIL: [
    { name: 'Engineering Drawing', code: 'CIVIL101', semester: 1, year: 1 },
    { name: 'Surveying', code: 'CIVIL102', semester: 1, year: 1 },
    { name: 'Structural Analysis', code: 'CIVIL201', semester: 3, year: 2 },
    { name: 'Concrete Technology', code: 'CIVIL202', semester: 4, year: 2 },
    { name: 'Geotechnical Engineering', code: 'CIVIL301', semester: 5, year: 3 },
    { name: 'Transportation Engineering', code: 'CIVIL302', semester: 6, year: 3 },
    { name: 'Environmental Engineering', code: 'CIVIL401', semester: 7, year: 4 },
    { name: 'Project Management', code: 'CIVIL402', semester: 8, year: 4 }
  ],
  EEE: [
    { name: 'Basic Electrical Engineering', code: 'EEE101', semester: 1, year: 1 },
    { name: 'Electromagnetic Theory', code: 'EEE102', semester: 1, year: 1 },
    { name: 'Power Systems', code: 'EEE201', semester: 3, year: 2 },
    { name: 'Control Systems', code: 'EEE202', semester: 4, year: 2 },
    { name: 'Power Electronics', code: 'EEE301', semester: 5, year: 3 },
    { name: 'Renewable Energy', code: 'EEE302', semester: 6, year: 3 },
    { name: 'Smart Grid Technology', code: 'EEE401', semester: 7, year: 4 },
    { name: 'Electric Vehicles', code: 'EEE402', semester: 8, year: 4 }
  ]
};

const sections = ['A', 'B', 'C', 'D'];
const academicYear = '2024-25';

// Generate unique data
const firstNames = [
  'Aarav', 'Arjun', 'Rohan', 'Krishna', 'Vikram', 'Rajesh', 'Suresh', 'Manoj', 'Deepak', 'Naveen',
  'Priya', 'Anita', 'Sunita', 'Kavita', 'Rekha', 'Meera', 'Sita', 'Radha', 'Ganga', 'Yamuna',
  'Amit', 'Rahul', 'Vishal', 'Sandeep', 'Pradeep', 'Ashok', 'Vinod', 'Sanjay', 'Ajay', 'Vijay',
  'Neha', 'Pooja', 'Shilpa', 'Ritu', 'Suman', 'Geeta', 'Lata', 'Usha', 'Kiran', 'Seema',
  'Ravi', 'Kumar', 'Sharma', 'Patel', 'Singh', 'Gupta', 'Verma', 'Jain', 'Agarwal', 'Mishra',
  'Pandey', 'Tiwari', 'Choudhary', 'Reddy', 'Nair', 'Menon', 'Iyer', 'Rao', 'Joshi', 'Desai',
  'Malhotra', 'Chopra', 'Bansal', 'Khanna', 'Saxena', 'Goyal', 'Arora', 'Kapoor', 'Mehta', 'Bhatia'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Patel', 'Jain', 'Agarwal', 'Mishra',
  'Pandey', 'Tiwari', 'Choudhary', 'Reddy', 'Nair', 'Menon', 'Iyer', 'Rao', 'Joshi', 'Desai',
  'Malhotra', 'Chopra', 'Bansal', 'Khanna', 'Saxena', 'Goyal', 'Arora', 'Kapoor', 'Mehta', 'Bhatia',
  'Aggarwal', 'Bhardwaj', 'Chaudhary', 'Dixit', 'Garg', 'Hegde', 'Iyer', 'Jain', 'Kumar', 'Lal'
];

let nameCounter = 0;
const generateUniqueName = () => {
  const firstName = firstNames[nameCounter % firstNames.length];
  const lastName = lastNames[Math.floor(nameCounter / firstNames.length) % lastNames.length];
  nameCounter++;
  return `${firstName} ${lastName}`;
};

const generateEmail = (name, type, index) => {
  const domain = type === 'student' ? 'student.college.edu' : 'college.edu';
  const username = name.toLowerCase().replace(/\s+/g, '.');
  return `${username}${index}@${domain}`;
};

const generateRollNumber = (department, globalIndex) => {
  const deptCode = department;
  const yearCode = '24';
  const rollNum = (globalIndex + 1).toString().padStart(3, '0');
  return `${deptCode}${yearCode}${rollNum}`;
};

const generateStaffId = (department, index) => {
  const deptCode = department;
  const staffNum = (index + 1).toString().padStart(3, '0');
  return `${deptCode}${staffNum}`;
};

const generatePhoneNumber = () => {
  return `+91 9${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
};

const generateAddress = () => {
  const streets = ['Main Street', 'Park Avenue', 'Garden Road', 'Central Avenue', 'University Road'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  return `${number}, ${street}, ${city}`;
};

const generateDate = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    console.log('Clearing existing data...');
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Admin.deleteMany({});
    await Department.deleteMany({});
    await Subject.deleteMany({});
    await Marks.deleteMany({});
    await Attendance.deleteMany({});

    console.log('Cleared existing data');

    // Create departments
    console.log('Creating departments...');
    const createdDepartments = await Department.insertMany(departments);
    console.log(`Created ${createdDepartments.length} departments`);

    // Create admin
    console.log('Creating admin...');
    const admin = new Admin({
      username: 'admin',
      password: 'admin123',
      email: 'admin@college.edu',
      name: 'System Administrator',
      role: 'Super Admin',
      permissions: ['user_management', 'academic_management', 'financial_management', 'system_settings']
    });
    await admin.save();
    console.log('Created admin user');

    // Create subjects
    console.log('Creating subjects...');
    const createdSubjects = [];
    for (const dept of createdDepartments) {
      const deptSubjects = subjectsData[dept.name];
      for (const subjData of deptSubjects) {
        const subject = new Subject({
          ...subjData,
          department: dept.name
        });
        await subject.save();
        createdSubjects.push(subject);
      }
    }
    console.log(`Created ${createdSubjects.length} subjects`);

    // Create teachers (50 teachers - 10 per department)
    console.log('Creating teachers...');
    const teachers = [];
    let teacherCounter = 0;
    for (const dept of createdDepartments) {
      for (let i = 0; i < 10; i++) {
        const name = generateUniqueName();
        const teacher = new Teacher({
          name,
          staffId: generateStaffId(dept.name, i),
          email: generateEmail(name, 'teacher', teacherCounter),
          password: 'teacher123',
          department: dept.name,
          contact: generatePhoneNumber(),
          qualification: ['M.Tech', 'Ph.D', 'M.E', 'B.Tech'][Math.floor(Math.random() * 4)],
          designation: ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer'][Math.floor(Math.random() * 4)],
          experience: Math.floor(Math.random() * 20) + 1,
          address: generateAddress(),
          salary: Math.floor(Math.random() * 100000) + 50000
        });

        // Assign 2-3 subjects to each teacher
        const deptSubjectsForTeacher = createdSubjects.filter(s => s.department === dept.name);
        const numSubjects = Math.floor(Math.random() * 2) + 2; // 2-3 subjects
        const subjectsToAssign = deptSubjectsForTeacher.slice(0, numSubjects);
        teacher.subjectsHandled = subjectsToAssign.map(s => s._id);

        await teacher.save();
        teachers.push(teacher);
        teacherCounter++;

        // Update subjects with assigned teacher
        for (const subject of subjectsToAssign) {
          subject.teacherAssigned = teacher._id;
          await subject.save();
        }
      }
    }
    console.log(`Created ${teachers.length} teachers`);

    // Create students (500+ students - 25-35 per section)
    console.log('Creating students...');
    const students = [];
    let studentCounter = 0;

    for (const dept of createdDepartments) {
      for (let year = 1; year <= 4; year++) {
        for (const section of sections) {
          const studentsPerSection = Math.floor(Math.random() * 11) + 25; // 25-35 students
          
          for (let i = 0; i < studentsPerSection; i++) {
            const name = generateUniqueName();
            let rollNo;
            
            // Ensure the first CSE student gets CSE2024001
            if (dept.name === 'CSE' && studentCounter === 0) {
              rollNo = 'CSE2024001';
            } else {
              rollNo = generateRollNumber(dept.name, studentCounter);
            }
            
            const student = new Student({
              name,
              rollNo,
              email: generateEmail(name, 'student', studentCounter),
              password: 'student123',
              gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
              department: dept.name,
              year,
              section,
              phone: generatePhoneNumber(),
              address: generateAddress(),
              dateOfBirth: generateDate('1995-01-01', '2005-12-31'),
              admissionDate: generateDate('2020-01-01', '2024-01-01')
            });

            // Assign subjects based on year
            const yearSubjects = createdSubjects.filter(s => 
              s.department === dept.name && s.year === year
            );
            student.subjects = yearSubjects.map(s => s._id);

            await student.save();
            students.push(student);
            studentCounter++;
          }
        }
      }
    }
    console.log(`Created ${students.length} students`);

    // Generate marks and attendance for students
    console.log('Generating marks and attendance...');
    for (const student of students) {
      for (const subjectId of student.subjects) {
        const subject = createdSubjects.find(s => s._id.toString() === subjectId.toString());
        if (!subject) continue;

        // Generate marks
        const internalMarks = Math.floor(Math.random() * 36) + 15; // 15-50
        const externalMarks = Math.floor(Math.random() * 31) + 20; // 20-50
        const total = internalMarks + externalMarks;

        let grade = 'F';
        if (total >= 90) grade = 'A+';
        else if (total >= 80) grade = 'A';
        else if (total >= 70) grade = 'B+';
        else if (total >= 60) grade = 'B';
        else if (total >= 50) grade = 'C+';
        else if (total >= 40) grade = 'C';
        else if (total >= 30) grade = 'D';

        const marks = new Marks({
          studentId: student._id,
          subject: subjectId,
          internalMarks,
          externalMarks,
          total,
          grade,
          semester: subject.semester,
          academicYear,
          examType: 'Final',
          updatedBy: teachers.find(t => t.subjectsHandled.includes(subjectId))?._id
        });
        await marks.save();

        // Update student's marks array
        student.marks.push({
          subject: subjectId,
          internalMarks,
          externalMarks,
          total,
          grade
        });

        // Generate attendance
        const totalClasses = Math.floor(Math.random() * 21) + 40; // 40-60
        const minAttended = Math.floor(totalClasses * 0.6);
        const attendedClasses = Math.floor(Math.random() * (totalClasses - minAttended + 1)) + minAttended;
        const percentage = (attendedClasses / totalClasses) * 100;

        const attendance = new Attendance({
          studentId: student._id,
          subject: subjectId,
          totalClasses,
          attendedClasses,
          percentage,
          semester: subject.semester,
          academicYear,
          updatedBy: teachers.find(t => t.subjectsHandled.includes(subjectId))?._id
        });
        await attendance.save();

        // Update student's attendance array
        student.attendance.push({
          subject: subjectId,
          totalClasses,
          attendedClasses,
          percentage
        });
      }

      // Calculate CGPA and overall attendance
      student.calculateCGPA();
      student.calculateOverallAttendance();
      await student.save();
    }

    // Update department statistics
    console.log('Updating department statistics...');
    for (const dept of createdDepartments) {
      const deptStudents = students.filter(s => s.department === dept.name);
      const deptTeachers = teachers.filter(t => t.department === dept.name);
      
      dept.totalStudents = deptStudents.length;
      dept.totalTeachers = deptTeachers.length;
      await dept.save();
    }

    console.log('Database seeding completed successfully!');
    console.log('\n=== SUMMARY ===');
    console.log(`Departments: ${createdDepartments.length}`);
    console.log(`Subjects: ${createdSubjects.length}`);
    console.log(`Teachers: ${teachers.length}`);
    console.log(`Students: ${students.length}`);
    console.log(`Admin: 1`);
    console.log('\n=== DEFAULT LOGIN CREDENTIALS ===');
    console.log('Admin:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('\nTeacher (Sample):');
    console.log(`  Email: ${teachers[0].email}`);
    console.log('  Password: teacher123');
    console.log('\nStudent (Sample):');
    console.log(`  Roll No: ${students[0].rollNo}`);
    console.log('  Password: student123');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

// Run seeding
seedDatabase();