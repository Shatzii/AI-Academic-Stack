'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function LanguageTeacherPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const teacherData = {
    name: 'Professor Lingua',
    languages: ['Spanish', 'French', 'German'],
    totalStudents: 124,
    averageProgress: 78
  }

  const students = [
    { id: 1, name: 'Alex Chen', language: 'Spanish', level: 'Intermediate', progress: 85, streak: 42 },
    { id: 2, name: 'Maria Lopez', language: 'French', level: 'Beginner', progress: 67, streak: 18 },
    { id: 3, name: 'David Kim', language: 'German', level: 'Advanced', progress: 92, streak: 75 },
    { id: 4, name: 'Sophie Martin', language: 'Spanish', level: 'Advanced', progress: 88, streak: 63 }
  ]

  const lessons = [
    { title: 'Spanish Conversation Practice', level: 'Intermediate', scheduled: 42, completed: 38 },
    { title: 'French Grammar Fundamentals', level: 'Beginner', scheduled: 35, completed: 32 },
    { title: 'German Business Language', level: 'Advanced', scheduled: 28, completed: 26 }
  ]

  const culturalActivities = [
    { activity: 'Spanish Film Festival', participants: 45, date: 'Jan 30' },
    { activity: 'French Cooking Class', participants: 28, date: 'Feb 5' },
    { activity: 'German Literature Circle', participants: 22, date: 'Feb 8' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/schools/language-school" className="text-white font-semibold text-lg hover:text-emerald-300">
              ← Language Learning School
            </Link>
            <h1 className="text-2xl font-bold text-white">Teacher Portal</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{teacherData.name}</div>
                <div className="text-sm text-emerald-200">Language Instructor</div>
              </div>
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                PL
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
              <div className="text-emerald-200 text-sm">Active Learners</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{teacherData.languages.length}</div>
              <div className="text-emerald-200 text-sm">Languages Taught</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{teacherData.averageProgress}%</div>
              <div className="text-emerald-200 text-sm">Avg Progress</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">35</div>
              <div className="text-emerald-200 text-sm">Day Avg Streak</div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: '🌍' },
                { id: 'students', name: 'Students', icon: '👥' },
                { id: 'lessons', name: 'Lessons', icon: '📚' },
                { id: 'culture', name: 'Cultural Activities', icon: '🎭' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-emerald-400 text-emerald-300'
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
                  <h3 className="text-xl font-bold text-white mb-6">Languages Overview</h3>
                  <div className="space-y-4">
                    {teacherData.languages.map((language, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-white mb-1">{language}</h4>
                            <div className="text-emerald-200 text-sm">
                              {index === 0 ? '68 students • 4 levels' : 
                               index === 1 ? '35 students • 3 levels' : 
                               '21 students • 2 levels'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-300">
                              {index === 0 ? '82%' : index === 1 ? '74%' : '89%'}
                            </div>
                            <div className="text-emerald-200 text-xs">Avg Progress</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Recent Lessons</h3>
                  <div className="space-y-4">
                    {lessons.map((lesson, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">{lesson.title}</h4>
                        <div className="text-emerald-200 text-sm mb-2">{lesson.level} Level</div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white">Completion: {lesson.completed}/{lesson.scheduled}</span>
                          <span className="text-emerald-300">{Math.round((lesson.completed / lesson.scheduled) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Student Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {students.map((student) => (
                    <div key={student.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{student.name}</h4>
                          <p className="text-emerald-200 text-sm">{student.language} • {student.level}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-emerald-300">{student.progress}%</span>
                          <div className="text-xs text-emerald-200">{student.streak} day streak</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              student.progress >= 85 ? 'bg-green-500' :
                              student.progress >= 75 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{width: `${student.progress}%`}}
                          ></div>
                        </div>
                      </div>

                      <button className="w-full bg-emerald-600 text-white py-2 rounded hover:bg-emerald-700">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'lessons' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Lesson Management</h3>
                  <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
                    Create New Lesson
                  </button>
                </div>
                
                <div className="space-y-6">
                  {lessons.map((lesson, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{lesson.title}</h4>
                          <p className="text-emerald-200">{lesson.level} Level</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{lesson.completed}/{lesson.scheduled}</div>
                          <div className="text-emerald-200 text-sm">Completed</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="w-full bg-white/20 rounded-full h-3">
                          <div 
                            className="bg-emerald-500 h-3 rounded-full" 
                            style={{width: `${(lesson.completed / lesson.scheduled) * 100}%`}}
                          ></div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                          View Progress
                        </button>
                        <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                          Send Reminders
                        </button>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                          Grade Assignments
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'culture' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Cultural Immersion Activities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Upcoming Events</h4>
                    <div className="space-y-4">
                      {culturalActivities.map((activity, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-white font-semibold">{activity.activity}</h5>
                            <span className="text-emerald-300 text-sm">{activity.date}</span>
                          </div>
                          <div className="text-emerald-200 text-sm">
                            {activity.participants} participants registered
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Activity Types</h4>
                    <div className="space-y-3">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h5 className="text-white font-semibold mb-2">Film & Media</h5>
                        <p className="text-emerald-200 text-sm">Foreign films with subtitles and discussion groups</p>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h5 className="text-white font-semibold mb-2">Cooking Classes</h5>
                        <p className="text-emerald-200 text-sm">Traditional recipes while practicing vocabulary</p>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h5 className="text-white font-semibold mb-2">Conversation Circles</h5>
                        <p className="text-emerald-200 text-sm">Native speaker sessions and peer practice</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Teaching Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button className="bg-blue-600/20 text-blue-200 p-4 rounded-lg hover:bg-blue-600/30 transition-colors">
              📊 Progress Analytics
            </button>
            <button className="bg-green-600/20 text-green-200 p-4 rounded-lg hover:bg-green-600/30 transition-colors">
              🎤 Pronunciation Tools
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              📝 Grammar Builder
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              🌍 Cultural Resources
            </button>
            <button className="bg-pink-600/20 text-pink-200 p-4 rounded-lg hover:bg-pink-600/30 transition-colors">
              💬 Conversation Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}