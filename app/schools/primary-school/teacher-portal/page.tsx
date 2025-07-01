'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function PrimaryTeacherPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const teacherData = {
    name: 'Mrs. Sarah Johnson',
    classes: ['Kindergarten A', '1st Grade B'],
    totalStudents: 28,
    averageProgress: 87
  }

  const students = [
    { id: 1, name: 'Emma Wilson', grade: 'K', heroName: 'Lightning Learner', progress: 92, accommodations: ['ADHD Support', 'Extended Time'] },
    { id: 2, name: 'Marcus Brown', grade: 'K', heroName: 'Math Hero', progress: 85, accommodations: ['Dyslexia Font', 'Audio Support'] },
    { id: 3, name: 'Lily Chen', grade: '1', heroName: 'Reading Star', progress: 94, accommodations: ['Sensory Breaks'] },
    { id: 4, name: 'Alex Rodriguez', grade: '1', heroName: 'Science Explorer', progress: 78, accommodations: ['Visual Cues', 'Movement Breaks'] }
  ]

  const assignments = [
    { title: 'Superhero Reading Adventure', subject: 'Reading', dueDate: 'Today', submitted: 18, total: 22 },
    { title: 'Math Powers Challenge', subject: 'Math', dueDate: 'Tomorrow', submitted: 15, total: 22 },
    { title: 'Science Hero Lab', subject: 'Science', dueDate: 'Friday', submitted: 8, total: 22 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/schools/primary-school" className="text-white font-semibold text-lg hover:text-purple-300">
              ← SuperHero School
            </Link>
            <h1 className="text-2xl font-bold text-white">Teacher Portal</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{teacherData.name}</div>
                <div className="text-sm text-purple-200">K-1 Teacher</div>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                SJ
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
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
              <div className="text-3xl font-bold text-white mb-2">{teacherData.averageProgress}%</div>
              <div className="text-purple-200 text-sm">Avg Progress</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">3</div>
              <div className="text-purple-200 text-sm">Active Alerts</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: '📊' },
                { id: 'students', name: 'Students', icon: '👥' },
                { id: 'assignments', name: 'Assignments', icon: '📝' },
                { id: 'accommodations', name: 'Accommodations', icon: '🛠️' }
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
                        <div className="text-purple-200 text-sm">14 students • Average progress: 85%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Assignment Status</h3>
                  <div className="space-y-4">
                    {assignments.map((assignment, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">{assignment.title}</h4>
                        <div className="text-purple-200 text-sm mb-3">{assignment.subject} • Due: {assignment.dueDate}</div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white text-sm">Submitted</span>
                          <span className="text-purple-300 font-semibold">{assignment.submitted}/{assignment.total}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{width: `${(assignment.submitted / assignment.total) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">My Students</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {students.map((student) => (
                    <div key={student.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{student.name}</h4>
                          <p className="text-purple-200 text-sm">Grade {student.grade} • {student.heroName}</p>
                        </div>
                        <span className="text-2xl font-bold text-purple-300">{student.progress}%</span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-purple-200 mb-1">
                          <span>Progress</span>
                          <span>{student.progress}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              student.progress >= 90 ? 'bg-green-500' :
                              student.progress >= 80 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{width: `${student.progress}%`}}
                          ></div>
                        </div>
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
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button className="bg-blue-600/20 text-blue-200 p-4 rounded-lg hover:bg-blue-600/30 transition-colors">
              📊 View Analytics
            </button>
            <button className="bg-green-600/20 text-green-200 p-4 rounded-lg hover:bg-green-600/30 transition-colors">
              💬 Parent Messages
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              📝 Lesson Plans
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              🏆 Reward System
            </button>
            <button className="bg-pink-600/20 text-pink-200 p-4 rounded-lg hover:bg-pink-600/30 transition-colors">
              🛠️ IEP Management
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}