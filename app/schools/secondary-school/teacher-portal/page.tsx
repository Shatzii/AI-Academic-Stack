'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function SecondaryTeacherPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const teacherData = {
    name: 'Mr. David Chen',
    department: 'Mathematics',
    classes: ['Algebra II - Period 3', 'Pre-Calculus - Period 5', 'Statistics - Period 7'],
    totalStudents: 89,
    averageGPA: 3.2
  }

  const students = [
    { id: 1, name: 'Sofia Martinez', grade: '11th', course: 'Pre-Calculus', gpa: 3.8, accommodations: ['Extended Time', 'Calculator'] },
    { id: 2, name: 'James Wilson', grade: '10th', course: 'Algebra II', gpa: 3.1, accommodations: ['ADHD Support', 'Movement Breaks'] },
    { id: 3, name: 'Maya Patel', grade: '12th', course: 'Statistics', gpa: 4.0, accommodations: ['None'] },
    { id: 4, name: 'Alex Johnson', grade: '11th', course: 'Pre-Calculus', gpa: 2.9, accommodations: ['Dyslexia Support', 'Audio Instructions'] }
  ]

  const assignments = [
    { title: 'Quadratic Functions Project', course: 'Algebra II', dueDate: 'Jan 26', submitted: 24, total: 28, avgScore: 85 },
    { title: 'Calculus Derivatives Quiz', course: 'Pre-Calculus', dueDate: 'Jan 28', submitted: 18, total: 22, avgScore: 78 },
    { title: 'Statistics Data Analysis', course: 'Statistics', dueDate: 'Feb 1', submitted: 15, total: 19, avgScore: 92 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/schools/secondary-school" className="text-white font-semibold text-lg hover:text-purple-300">
              ← Stage Prep Academy
            </Link>
            <h1 className="text-2xl font-bold text-white">Teacher Portal</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{teacherData.name}</div>
                <div className="text-sm text-purple-200">{teacherData.department}</div>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                DC
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{teacherData.totalStudents}</div>
              <div className="text-purple-200 text-sm">Total Students</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{teacherData.classes.length}</div>
              <div className="text-purple-200 text-sm">Classes</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{teacherData.averageGPA}</div>
              <div className="text-purple-200 text-sm">Average GPA</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">12</div>
              <div className="text-purple-200 text-sm">IEP Students</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: '📊' },
                { id: 'students', name: 'Students', icon: '👥' },
                { id: 'assignments', name: 'Assignments', icon: '📝' },
                { id: 'grades', name: 'Gradebook', icon: '📋' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-400 text-purple-300'
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
                  <h3 className="text-xl font-bold text-white mb-6">My Classes</h3>
                  <div className="space-y-4">
                    {teacherData.classes.map((className, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">{className}</h4>
                        <div className="text-purple-200 text-sm">
                          {index === 0 ? '28 students • Avg: 85%' : 
                           index === 1 ? '22 students • Avg: 78%' : 
                           '19 students • Avg: 92%'}
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
                        <div className="text-purple-200 text-sm mb-2">{assignment.course} • Due: {assignment.dueDate}</div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white">Submitted: {assignment.submitted}/{assignment.total}</span>
                          <span className="text-purple-300">Avg: {assignment.avgScore}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Student Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {students.map((student) => (
                    <div key={student.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{student.name}</h4>
                          <p className="text-purple-200 text-sm">{student.grade} • {student.course}</p>
                        </div>
                        <span className="text-2xl font-bold text-purple-300">{student.gpa}</span>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="text-white font-medium mb-2">Accommodations:</h5>
                        <div className="flex flex-wrap gap-2">
                          {student.accommodations.map((acc, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-500/30 text-blue-200 rounded text-xs">
                              {acc}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                        View Progress
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button className="bg-blue-600/20 text-blue-200 p-4 rounded-lg hover:bg-blue-600/30 transition-colors">
              📊 Grade Analytics
            </button>
            <button className="bg-green-600/20 text-green-200 p-4 rounded-lg hover:bg-green-600/30 transition-colors">
              💬 Parent Contact
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              📝 Lesson Plans
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              📅 Schedule
            </button>
            <button className="bg-pink-600/20 text-pink-200 p-4 rounded-lg hover:bg-pink-600/30 transition-colors">
              🎓 College Prep
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}