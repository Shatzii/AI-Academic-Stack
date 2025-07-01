'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  X, 
  GraduationCap, 
  School, 
  Brain, 
  ChevronDown,
  User,
  Settings,
  LogOut,
  Home,
  BookOpen,
  Users,
  BarChart3
} from 'lucide-react';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const schoolLinks = [
    { href: '/schools/primary-school', title: 'SuperHero School', description: 'K-6 Elementary', badge: 'K-6' },
    { href: '/schools/secondary-school', title: 'Stage Prep School', description: '7-12 Theater Arts', badge: '7-12' },
    { href: '/schools/law-school', title: 'Future Legal Professionals', description: 'Law & Justice', badge: 'Law' },
    { href: '/schools/language-school', title: 'Global Language Academy', description: 'World Languages', badge: 'Lang' }
  ];

  const aiFeatures = [
    { href: '/ai-tutor', title: 'AI Personal Tutor', description: 'One-on-one AI assistance' },
    { href: '/ai-analytics', title: 'Learning Analytics', description: 'Performance insights' },
    { href: '/ai-content-creator', title: 'Content Creator', description: 'Generate materials' },
    { href: '/virtual-classroom', title: 'Virtual Classroom', description: 'Interactive learning' },
    { href: '/study-buddy', title: 'Study Buddy', description: 'Personalized planning' },
    { href: '/adaptive-assessment', title: 'Adaptive Assessment', description: 'Smart testing' }
  ];

  const adminLinks = [
    { href: '/admin', title: 'Dashboard', icon: Home },
    { href: '/admin/students', title: 'Students', icon: Users },
    { href: '/admin/courses', title: 'Courses', icon: BookOpen },
    { href: '/admin/analytics', title: 'Analytics', icon: BarChart3 }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">Universal One School</span>
                <p className="text-xs text-gray-600 -mt-1">AI Education Platform</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Schools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <School className="h-4 w-4" />
                  <span>Schools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="start">
                <div className="p-2">
                  <h3 className="font-medium text-sm text-gray-900 mb-2">Choose Your School</h3>
                  {schoolLinks.map((school) => (
                    <DropdownMenuItem key={school.href} asChild>
                      <Link href={school.href} className="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-50">
                        <div>
                          <div className="font-medium text-sm">{school.title}</div>
                          <div className="text-xs text-gray-600">{school.description}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">{school.badge}</Badge>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* AI Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <Brain className="h-4 w-4" />
                  <span>AI Features</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="start">
                <div className="p-2">
                  <h3 className="font-medium text-sm text-gray-900 mb-2">AI-Powered Learning</h3>
                  <div className="grid grid-cols-1 gap-1">
                    {aiFeatures.map((feature) => (
                      <DropdownMenuItem key={feature.href} asChild>
                        <Link href={feature.href} className="flex flex-col items-start w-full p-2 rounded-md hover:bg-gray-50">
                          <div className="font-medium text-sm">{feature.title}</div>
                          <div className="text-xs text-gray-600">{feature.description}</div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Navigation Links */}
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
            
            <Link href="/demo" className="text-gray-700 hover:text-blue-600 font-medium">
              Demo
            </Link>

            {/* Admin Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {adminLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{link.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Account</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth" className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 pb-4">
            <div className="pt-4 space-y-3">
              {/* Schools Section */}
              <div>
                <h3 className="font-medium text-gray-900 px-3 mb-2">Schools</h3>
                {schoolLinks.map((school) => (
                  <Link
                    key={school.href}
                    href={school.href}
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{school.title}</div>
                        <div className="text-xs text-gray-600">{school.description}</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">{school.badge}</Badge>
                    </div>
                  </Link>
                ))}
              </div>

              {/* AI Features Section */}
              <div>
                <h3 className="font-medium text-gray-900 px-3 mb-2 mt-4">AI Features</h3>
                {aiFeatures.map((feature) => (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="font-medium text-sm">{feature.title}</div>
                    <div className="text-xs text-gray-600">{feature.description}</div>
                  </Link>
                ))}
              </div>

              {/* Other Links */}
              <div className="border-t border-gray-200 pt-4">
                <Link href="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/demo" className="block px-3 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
                  Demo
                </Link>
                <Link href="/admin" className="block px-3 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
                  Admin
                </Link>
                <Link href="/auth" className="block px-3 py-2 text-gray-700 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}