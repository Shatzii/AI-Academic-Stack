'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function LawTeacherPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const professorData = {
    name: 'Professor Barrett',
    title: 'Constitutional Law Professor',
    courses: ['Constitutional Law I', 'Constitutional Law II', 'Civil Rights Law'],
    totalStudents: 156,
    barPassRate: 94
  }

  const students = [
    { id: 1, name: 'Sarah Kim', year: '3L', course: 'Constitutional Law II', gpa: 3.8, barPrep: 85 },
    { id: 2, name: 'Michael Chen', year: '2L', course: 'Constitutional Law I', gpa: 3.6, barPrep: 78 },
    { id: 3, name: 'Emma Rodriguez', year: '3L', course: 'Civil Rights Law', gpa: 3.9, barPrep: 92 },
    { id: 4, name: 'David Johnson', year: '2L', course: 'Constitutional Law I', gpa: 3.4, barPrep: 71 }
  ]

  const assignments = [
    { title: 'Due Process Analysis Brief', course: 'Constitutional Law II', dueDate: 'Jan 28', submitted: 42, total: 48 },
    { title: 'First Amendment Case Study', course: 'Constitutional Law I', dueDate: 'Feb 1', submitted: 38, total: 52 },
    { title: 'Civil Rights Movement Research', course: 'Civil Rights Law', dueDate: 'Feb 5', submitted: 28, total: 35 }
  ]

  const barPrepProgress = [
    { subject: 'Constitutional Law', avgScore: 82, students: 48 },
    { subject: 'Civil Procedure', avgScore: 79, students: 52 },
    { subject: 'Contracts', avgScore: 85, students: 48 },
    { subject: 'Torts', avgScore: 81, students: 52 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/schools/law-school" className="text-white font-semibold text-lg hover:text-blue-300">
              ← The Lawyer Makers
            </Link>
            <h1 className="text-2xl font-bold text-white">Professor Portal</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{professorData.name}</div>
                <div className="text-sm text-blue-200">{professorData.title}</div>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                PB
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{professorData.totalStudents}</div>
              <div className="text-blue-200 text-sm">Total Students</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{professorData.courses.length}</div>
              <div className="text-blue-200 text-sm">Courses</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{professorData.barPassRate}%</div>
              <div className="text-blue-200 text-sm">Bar Pass Rate</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">3L</div>
              <div className="text-blue-200 text-sm">Graduating Class</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: '⚖️' },
                { id: 'students', name: 'Students', icon: '👥' },
                { id: 'assignments', name: 'Assignments', icon: '📝' },
                { id: 'bar-prep', name: 'Bar Prep', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-300'
                      : 'border-transparent text-white/70 hover:text-white hover:border-white/30'
                  }`}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">My Courses</h3>
                  <div className="space-y-4">
                    {professorData.courses.map((course, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">{course}</h4>
                        <div className="text-blue-200 text-sm">
                          {index === 0 ? '52 students • 3L Focus' : 
                           index === 1 ? '48 students • 3L Advanced' : 
                           '35 students • 2L/3L Elective'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Recent Assignments</h3>
                  <div className="space-y-4">
                    {assignments.map((assignment, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">{assignment.title}</h4>
                        <div className="text-blue-200 text-sm mb-2">{assignment.course} • Due: {assignment.dueDate}</div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white">Submitted: {assignment.submitted}/{assignment.total}</span>
                          <span className="text-blue-300">{Math.round((assignment.submitted / assignment.total) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Student Progress Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {students.map((student) => (
                    <div key={student.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{student.name}</h4>
                          <p className="text-blue-200 text-sm">{student.year} • {student.course}</p>
                        </div>
                        <span className="text-2xl font-bold text-blue-300">{student.gpa}</span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-blue-200 mb-1">
                          <span>Bar Prep Progress</span>
                          <span>{student.barPrep}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              student.barPrep >= 85 ? 'bg-green-500' :
                              student.barPrep >= 75 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{width: `${student.barPrep}%`}}
                          ></div>
                        </div>
                      </div>

                      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bar-prep' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Bar Examination Preparation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Subject Performance</h4>
                    <div className="space-y-4">
                      {barPrepProgress.map((subject, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="text-white font-semibold">{subject.subject}</h5>
                            <span className="text-blue-300 font-bold">{subject.avgScore}%</span>
                          </div>
                          <div className="text-blue-200 text-sm mb-2">{subject.students} students enrolled</div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                subject.avgScore >= 85 ? 'bg-green-500' :
                                subject.avgScore >= 75 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{width: `${subject.avgScore}%`}}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Upcoming Bar Exam</h4>
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-white mb-2">July 2025</div>
                        <div className="text-blue-200">Texas Bar Examination</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-200">Eligible Students</span>
                          <span className="text-white">84</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Prep Completion</span>
                          <span className="text-green-400">78%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Expected Pass Rate</span>
                          <span className="text-white">94%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-white/5 rounded-lg p-6 border border-white/10">
                      <h5 className="text-white font-semibold mb-3">Preparation Schedule</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-200">MBE Practice</span>
                          <span className="text-white">Daily</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Essay Writing</span>
                          <span className="text-white">3x/week</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-200">Mock Exams</span>
                          <span className="text-white">Weekly</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Professor Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button className="bg-blue-600/20 text-blue-200 p-4 rounded-lg hover:bg-blue-600/30 transition-colors">
              📊 Grade Analytics
            </button>
            <button className="bg-green-600/20 text-green-200 p-4 rounded-lg hover:bg-green-600/30 transition-colors">
              ⚖️ Case Library
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              📝 Exam Builder
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              📚 Curriculum
            </button>
            <button className="bg-pink-600/20 text-pink-200 p-4 rounded-lg hover:bg-pink-600/30 transition-colors">
              🎓 Bar Prep Tools
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}