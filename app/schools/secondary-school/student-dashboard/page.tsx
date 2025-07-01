'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function SecondaryStudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const studentData = {
    name: 'Marcus Williams',
    grade: '10th Grade',
    gpa: 3.85,
    credits: { completed: 16, required: 24 },
    graduation: '2027'
  }

  const courses = [
    { id: 1, name: 'Advanced Biology', grade: 'A-', progress: 87, teacher: 'Dr. Chen', period: '1st' },
    { id: 2, name: 'Algebra II', grade: 'B+', progress: 82, teacher: 'Ms. Rodriguez', period: '2nd' },
    { id: 3, name: 'World History', grade: 'A', progress: 94, teacher: 'Mr. Johnson', period: '3rd' },
    { id: 4, name: 'English Literature', grade: 'B', progress: 78, teacher: 'Mrs. Davis', period: '4th' }
  ]

  const assignments = [
    { subject: 'Biology', title: 'Cellular Respiration Lab Report', due: 'Tomorrow', status: 'pending' },
    { subject: 'Algebra II', title: 'Quadratic Functions Quiz', due: 'Friday', status: 'completed' },
    { subject: 'History', title: 'WWI Research Paper', due: 'Next Week', status: 'in_progress' },
    { subject: 'English', title: 'Shakespeare Essay', due: 'Monday', status: 'pending' }
  ]

  const achievements = [
    { name: 'Honor Roll', icon: '🏆', description: 'Maintained 3.5+ GPA', earned: true },
    { name: 'STEM Scholar', icon: '🔬', description: 'Excellence in Science & Math', earned: true },
    { name: 'Leadership Award', icon: '👑', description: 'Student Council Member', earned: false, progress: 75 },
    { name: 'Community Service', icon: '🤝', description: '50+ volunteer hours', earned: false, progress: 60 }
  ]

  const upcomingEvents = [
    { date: 'Jan 25', event: 'College Fair', time: '10:00 AM' },
    { date: 'Jan 28', event: 'SAT Prep Session', time: '3:30 PM' },
    { date: 'Feb 1', event: 'Career Exploration Day', time: '9:00 AM' },
    { date: 'Feb 5', event: 'Science Fair Judging', time: '1:00 PM' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/schools/secondary-school" className="text-white font-semibold text-lg hover:text-purple-300">
              ← Stage Prep Academy
            </Link>
            <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{studentData.name}</div>
                <div className="text-sm text-purple-200">{studentData.grade}</div>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {studentData.name.charAt(0)}
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
              <div className="text-3xl font-bold text-white mb-2">{studentData.gpa}</div>
              <div className="text-purple-200 text-sm">Current GPA</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {studentData.credits.completed}/{studentData.credits.required}
              </div>
              <div className="text-purple-200 text-sm">Credits Earned</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{courses.length}</div>
              <div className="text-purple-200 text-sm">Active Courses</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{studentData.graduation}</div>
              <div className="text-purple-200 text-sm">Graduation Year</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'courses', name: 'Courses', icon: '📚' },
                { id: 'assignments', name: 'Assignments', icon: '📝' },
                { id: 'progress', name: 'Progress', icon: '📈' }
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
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-6">Recent Assignments</h3>
                  <div className="space-y-4">
                    {assignments.slice(0, 3).map((assignment, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm">
                            {assignment.subject}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            assignment.status === 'completed' ? 'bg-green-500/30 text-green-200' :
                            assignment.status === 'in_progress' ? 'bg-yellow-500/30 text-yellow-200' :
                            'bg-red-500/30 text-red-200'
                          }`}>
                            {assignment.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="font-semibold text-white mb-1">{assignment.title}</h4>
                        <p className="text-purple-200 text-sm">Due: {assignment.due}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Upcoming Events</h3>
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-purple-300 text-sm font-medium">{event.date}</div>
                        <div className="text-white font-semibold">{event.event}</div>
                        <div className="text-purple-200 text-sm">{event.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Current Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{course.name}</h4>
                          <p className="text-purple-200 text-sm">{course.teacher} • {course.period} Period</p>
                        </div>
                        <span className="text-2xl font-bold text-purple-300">{course.grade}</span>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-purple-200 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{width: `${course.progress}%`}}
                          ></div>
                        </div>
                      </div>
                      <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                        View Course Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">All Assignments</h3>
                <div className="space-y-4">
                  {assignments.map((assignment, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm">
                            {assignment.subject}
                          </span>
                          <h4 className="text-lg font-semibold text-white">{assignment.title}</h4>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          assignment.status === 'completed' ? 'bg-green-500/30 text-green-200' :
                          assignment.status === 'in_progress' ? 'bg-yellow-500/30 text-yellow-200' :
                          'bg-red-500/30 text-red-200'
                        }`}>
                          {assignment.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200">Due: {assignment.due}</span>
                        <div className="space-x-2">
                          <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                            View Details
                          </button>
                          {assignment.status === 'pending' && (
                            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                              Submit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Academic Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Grade Trends</h4>
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <div key={course.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">{course.name}</span>
                            <span className="text-purple-300 font-bold">{course.grade}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                course.progress >= 90 ? 'bg-green-500' :
                                course.progress >= 80 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{width: `${course.progress}%`}}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Achievements</h4>
                    <div className="space-y-3">
                      {achievements.map((achievement, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${
                          achievement.earned 
                            ? 'bg-yellow-500/20 border-yellow-500/30' 
                            : 'bg-white/5 border-white/10'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`text-2xl ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-white">{achievement.name}</h5>
                              <p className="text-sm text-purple-200">{achievement.description}</p>
                              {!achievement.earned && achievement.progress && (
                                <div className="mt-2">
                                  <div className="w-full bg-white/10 rounded-full h-2">
                                    <div 
                                      className="bg-purple-500 h-2 rounded-full" 
                                      style={{width: `${achievement.progress}%`}}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-purple-300">{achievement.progress}% complete</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-blue-600/20 text-blue-200 p-4 rounded-lg hover:bg-blue-600/30 transition-colors">
              📝 Submit Assignment
            </button>
            <button className="bg-green-600/20 text-green-200 p-4 rounded-lg hover:bg-green-600/30 transition-colors">
              📚 View Syllabus
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              💬 Message Teacher
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              📅 View Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}