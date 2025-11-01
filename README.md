# 🎓 College Management System

A comprehensive full-stack college management system built with React.js, Node.js, Express.js, and MongoDB Atlas. This system provides a complete solution for educational institutions to manage students, teachers, academic records, and administrative tasks.

## ✨ Features

### 🔐 Multi-Role Authentication
- **Admin Portal**: Complete system administration and control
- **Teacher Portal**: Class management, marks entry, attendance tracking
- **Student Portal**: Personal academic records and profile management

### 👥 User Management
- Student registration and profile management
- Teacher staff management
- Department-based organization
- Role-based access control

### 📊 Academic Management
- **Marks Management**: Internal and external marks tracking
- **Attendance System**: Class-wise attendance monitoring
- **Grade Calculation**: Automatic CGPA and grade computation
- **Subject Management**: Department-wise subject allocation

### 📈 Analytics & Reports
- **Real-time Dashboards**: Role-specific analytics
- **Performance Charts**: Visual representation of academic data
- **Department Statistics**: Student and teacher distribution
- **Trend Analysis**: Performance tracking over time

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on all devices
- **Professional Interface**: Clean, modern design
- **Interactive Charts**: Recharts integration for data visualization
- **Intuitive Navigation**: Easy-to-use interface

## 🛠 Tech Stack

- **Frontend**: React.js 18, Tailwind CSS, Recharts, Axios, React Router
- **Backend**: Node.js, Express.js, MongoDB Atlas, JWT, bcrypt
- **Database**: MongoDB Atlas with comprehensive data models
- **Authentication**: JWT-based secure authentication
- **Charts**: Recharts for data visualization
- **Styling**: Tailwind CSS with custom components

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (connection string provided)

### Installation

1. **Clone and Setup**
   ```bash
   # Run the setup script (Linux/Mac)
   chmod +x setup.sh
   ./setup.sh
   
   # Or manually install dependencies
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

2. **Start the Backend Server**
   ```bash
   cd server
   npm start
   ```

3. **Start the Frontend (New Terminal)**
   ```bash
   cd client
   npm start
   ```

4. **Seed the Database**
   ```bash
   cd server
   npm run seed
   ```

### 🌐 Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔑 Default Login Credentials

### 👨‍💼 Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Access**: Complete system control, user management, analytics

### 👨‍🏫 Teacher (Sample)
- **Email**: `john.doe@college.edu`
- **Password**: `teacher123`
- **Access**: Marks management, attendance tracking, student reports

### 👨‍🎓 Student (Sample)
- **Roll No**: `CSE2024001`
- **Password**: `student123`
- **Access**: Personal records, marks, attendance, profile management

## 📊 Database Structure

The system includes comprehensive data models:

- **Students**: 500+ realistic student records
- **Teachers**: 50+ faculty members across departments
- **Departments**: CSE, ECE, MECH, CIVIL, EEE
- **Subjects**: 20+ subjects with proper allocation
- **Marks**: Complete academic performance data
- **Attendance**: Detailed attendance tracking

## 📁 Project Structure

```
college-management-system/
├── server/                          # Backend API
│   ├── models/                      # MongoDB models
│   │   ├── Student.js              # Student data model
│   │   ├── Teacher.js              # Teacher data model
│   │   ├── Admin.js                # Admin data model
│   │   ├── Department.js           # Department data model
│   │   ├── Subject.js              # Subject data model
│   │   ├── Marks.js                # Marks data model
│   │   └── Attendance.js           # Attendance data model
│   ├── routes/                      # API routes
│   │   ├── auth.js                 # Authentication routes
│   │   ├── students.js             # Student management routes
│   │   ├── teachers.js             # Teacher management routes
│   │   ├── marks.js                # Marks management routes
│   │   ├── attendance.js           # Attendance management routes
│   │   ├── dashboard.js            # Dashboard data routes
│   │   └── departments.js          # Department routes
│   ├── controllers/                 # Route controllers
│   ├── middleware/                  # Authentication middleware
│   ├── scripts/                     # Database seeding scripts
│   │   └── seedData.js            # Populate database with sample data
│   ├── config/                      # Configuration files
│   └── server.js                    # Express server entry point
├── client/                          # Frontend React App
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   └── ProtectedRoute.js   # Route protection component
│   │   ├── pages/                   # Page components
│   │   │   ├── LoginPage.js         # Multi-role login page
│   │   │   ├── admin/               # Admin dashboard pages
│   │   │   ├── teacher/             # Teacher dashboard pages
│   │   │   └── student/             # Student dashboard pages
│   │   ├── contexts/                # React contexts
│   │   │   └── AuthContext.js      # Authentication context
│   │   ├── services/                # API services
│   │   │   └── api.js              # Axios API configuration
│   │   ├── App.js                   # Main App component
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Tailwind CSS styles
│   ├── public/                      # Static assets
│   ├── tailwind.config.js           # Tailwind configuration
│   └── package.json                 # Frontend dependencies
├── package.json                     # Root package.json
├── env.example                      # Environment variables template
├── azure-build.sh                   # Build script for Azure
├── .deployment                      # Azure deployment configuration
├── DEPLOY_AZURE.md                  # Azure deployment guide
└── README.md                        # Project documentation
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login (student/teacher/admin)
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Dashboard
- `GET /api/dashboard` - Role-specific dashboard data

### Student Management
- `GET /api/students` - Get all students (with filters)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student (admin only)
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student (admin only)

### Teacher Management
- `GET /api/teachers` - Get all teachers (with filters)

### Academic Records
- `GET /api/marks` - Get marks (with filters)
- `POST /api/marks` - Add marks (teacher/admin)
- `PUT /api/marks/:id` - Update marks (teacher/admin)
- `GET /api/attendance` - Get attendance (with filters)
- `POST /api/attendance` - Add attendance (teacher/admin)
- `PUT /api/attendance/:id` - Update attendance (teacher/admin)

### Departments & Subjects
- `GET /api/departments` - Get all departments
- `GET /api/departments/subjects` - Get subjects (with filters)

## 🎯 Key Features Implemented

### ✅ Admin Dashboard
- **Overview**: Total statistics, department-wise data, top performers
- **Student Management**: CRUD operations, search, filters, pagination
- **Teacher Management**: Faculty records, department allocation
- **Department Management**: Department statistics, subject overview
- **Analytics**: Charts, performance trends, comprehensive reports

### ✅ Teacher Dashboard
- **Overview**: Teaching statistics, subjects handled, recent activity
- **Marks Management**: Add/edit student marks, grade calculation
- **Attendance Management**: Track student attendance, percentage calculation
- **Reports**: Performance analytics, student progress tracking

### ✅ Student Dashboard
- **Overview**: Personal statistics, performance charts, current semester data
- **Academic Records**: Complete marks history, attendance records
- **Profile Management**: Update personal information, view academic details

### ✅ Authentication & Security
- **JWT-based Authentication**: Secure token-based login system
- **Role-based Access Control**: Different permissions for each role
- **Password Hashing**: bcrypt for secure password storage
- **Protected Routes**: Route protection based on user roles

### ✅ Data Visualization
- **Recharts Integration**: Interactive charts and graphs
- **Performance Analytics**: CGPA trends, attendance patterns
- **Department Statistics**: Student-teacher ratios, distribution charts
- **Real-time Updates**: Dynamic data visualization

## 🚀 Deployment to Azure

The application can be deployed directly to Azure App Service from GitHub.

### Quick Deploy from GitHub

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy via Azure Portal:**
   - Create a new Web App in Azure Portal
   - Configure GitHub deployment
   - Set environment variables
   - Done! Azure will build and deploy automatically

3. **Detailed Instructions:**
   See `DEPLOY_AZURE.md` for complete step-by-step deployment guide.

### Environment Variables

For local development, copy `env.example` to `server/.env` and fill in your values:
```bash
# On Linux/Mac
cp env.example server/.env

# On Windows
copy env.example server\.env
```

Then edit `server/.env` with your actual values:
```env
NODE_ENV=development
PORT=8080
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000
```

For Azure deployment, set these in Azure App Settings:
- `NODE_ENV=production`
- `PORT=8080`
- `MONGODB_URI=your-mongodb-atlas-uri`
- `JWT_SECRET=your-jwt-secret`
- `FRONTEND_URL=https://your-app.azurewebsites.net`

**Important:** Never commit `.env` files to GitHub. Use Azure App Settings for production secrets.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for educational institutions
- Comprehensive feature set for complete college management
- Production-ready with proper error handling and validation

---

**🎓 Ready to revolutionize your college management system!**
