import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  BarChart3
} from 'lucide-react';

const TeacherSidebar = () => {
  const menuItems = [
    { path: '/teacher/overview', icon: LayoutDashboard, label: 'Overview' },
    { path: '/teacher/marks', icon: BookOpen, label: 'Marks' },
    { path: '/teacher/attendance', icon: Calendar, label: 'Attendance' },
    { path: '/teacher/reports', icon: BarChart3, label: 'Reports' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Teacher Portal</h1>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TeacherSidebar;
