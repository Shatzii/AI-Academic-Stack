import React from 'react';
import { Link, useLocation } from 'wouter';

interface UniversalHeaderProps {
  schoolType?: 'primary' | 'secondary' | 'law' | 'language' | 'main';
  isAuthenticated?: boolean;
  user?: {
    name: string;
    role: 'student' | 'teacher' | 'admin';
  };
  onLogout?: () => void;
}

export const UniversalHeader: React.FC<UniversalHeaderProps> = ({
  schoolType = 'main',
  isAuthenticated = false,
  user,
  onLogout
}) => {
  const [location] = useLocation();

  const getThemeClasses = () => {
    switch (schoolType) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-500 to-purple-600 text-white';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-800 to-gray-900 text-white';
      case 'law':
        return 'bg-gradient-to-r from-indigo-800 to-blue-900 text-white';
      case 'language':
        return 'bg-gradient-to-r from-green-600 to-teal-600 text-white';
      default:
        return 'bg-white text-gray-800 border-b border-gray-200';
    }
  };

  const getSchoolName = () => {
    switch (schoolType) {
      case 'primary':
        return 'SuperHero Academy';
      case 'secondary':
        return 'Secondary School';
      case 'law':
        return 'Law School';
      case 'language':
        return 'Language School';
      default:
        return 'Universal One School';
    }
  };

  const getNavItems = () => {
    const baseItems = [
      { path: '/', label: 'Home' },
      { path: '/curriculum', label: 'Curriculum' },
      { path: '/progress', label: 'Progress' }
    ];

    switch (schoolType) {
      case 'primary':
        return [
          ...baseItems,
          { path: '/adventures', label: 'Adventures' },
          { path: '/powers', label: 'My Powers' }
        ];
      case 'secondary':
        return [
          ...baseItems,
          { path: '/projects', label: 'Projects' },
          { path: '/career', label: 'Career Path' }
        ];
      case 'law':
        return [
          ...baseItems,
          { path: '/cases', label: 'Case Studies' },
          { path: '/courtroom', label: 'Courtroom' }
        ];
      case 'language':
        return [
          ...baseItems,
          { path: '/conversation', label: 'Conversation' },
          { path: '/culture', label: 'Culture' }
        ];
      default:
        return [
          { path: '/', label: 'Home' },
          { path: '/schools', label: 'Schools' },
          { path: '/about', label: 'About' }
        ];
    }
  };

  return (
    <header className={`${getThemeClasses()} shadow-lg transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and School Name */}
          <div className="flex items-center space-x-3">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <span className="text-xl font-bold">
                    {schoolType === 'primary' ? '🦸' : 
                     schoolType === 'secondary' ? '🎓' :
                     schoolType === 'law' ? '⚖️' :
                     schoolType === 'language' ? '🌍' : '🏫'}
                  </span>
                </div>
                <span className="ml-3 text-xl font-bold">{getSchoolName()}</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            {getNavItems().map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location === item.path
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <span className="font-medium">{user.name}</span>
                  <span className="block text-xs opacity-75 capitalize">{user.role}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link href="/login">
                  <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md text-sm transition-colors duration-200">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-white text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md text-sm transition-colors duration-200">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};