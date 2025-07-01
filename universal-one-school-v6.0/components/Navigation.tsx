'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, GraduationCap, Users, BookOpen, BarChart3, Settings } from 'lucide-react';

const mainNavItems = [
  { href: '/', label: 'Home', icon: GraduationCap },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/ai-tutor', label: 'AI Tutor', icon: Users },
  { href: '/curriculum-generator', label: 'Curriculum', icon: BookOpen },
];

const schoolLinks = [
  { href: '/schools/primary-school', label: 'SuperHero School (K-6)' },
  { href: '/schools/secondary-school', label: 'Stage Prep School (7-12)' },
  { href: '/schools/law-school', label: 'Legal Professionals' },
  { href: '/schools/language-school', label: 'Language Academy' },
];

const aiFeatures = [
  { href: '/ai-tutor', label: 'AI Personal Tutor' },
  { href: '/ai-analytics', label: 'Learning Analytics' },
  { href: '/ai-content-creator', label: 'Content Creator' },
  { href: '/virtual-classroom', label: 'Virtual Classroom' },
  { href: '/study-buddy', label: 'Study Buddy' },
  { href: '/adaptive-assessment', label: 'Adaptive Assessment' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="bg-white shadow-lg border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Universal One School</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Schools Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveDropdown('schools')}
                onMouseLeave={() => setActiveDropdown(null)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <span>Schools</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {activeDropdown === 'schools' && (
                <div
                  onMouseEnter={() => setActiveDropdown('schools')}
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border py-2 z-50"
                >
                  {schoolLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* AI Features Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveDropdown('ai')}
                onMouseLeave={() => setActiveDropdown(null)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <span>AI Features</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {activeDropdown === 'ai' && (
                <div
                  onMouseEnter={() => setActiveDropdown('ai')}
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border py-2 z-50"
                >
                  {aiFeatures.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/auth"
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-semibold text-gray-900">Schools</div>
                {schoolLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-6 py-2 text-gray-700 hover:text-blue-600 text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-semibold text-gray-900">AI Features</div>
                {aiFeatures.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-6 py-2 text-gray-700 hover:text-blue-600 text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  href="/auth"
                  className="block mx-3 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium text-center hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}