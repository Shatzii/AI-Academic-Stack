'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function SecondaryParentPortal() {
  const [activeTab, setActiveTab] = useState('overview')

  const studentData = {
    name: 'Marcus Williams',
    grade: '10th Grade',
    gpa: 3.85,
    credits: { completed: 16, required: 24 },
    graduationYear: '2027',
    rank: '15/142'
  }

  const courses = [
    { name: 'Advanced Biology', grade: 'A-', teacher: 'Dr. Chen', progress: 87 },
    { name: 'Algebra II', grade: 'B+', teacher: 'Ms. Rodriguez', progress: 82 },
    { name: 'World History', grade: 'A', teacher: 'Mr. Johnson', progress: 94 },
    { name: 'English Literature', grade: 'B', teacher: 'Mrs. Davis', progress: 78 }
  ]

  const recentActivities = [
    { date: 'Today', activity: 'Submitted Biology Lab Report', type: 'assignment', grade: 'A-' },
    { date: 'Yesterday', activity: 'Attended Virtual Tutoring Session', type: 'support', grade: 'Excellent' },
    { date: 'Jan 22', activity: 'Completed Algebra II Quiz', type: 'assessment', grade: 'B+' },
    { date: 'Jan 21', activity: 'Participated in Study Group', type: 'collaboration', grade: 'Active' }
  ]

  const upcomingEvents = [
    { date: 'Jan 26', event: 'Parent-Teacher Conferences', time: '4:00 PM' },
    { date: 'Jan 30', event: 'College Fair', time: '10:00 AM' },
    { date: 'Feb 5', event: 'SAT Prep Workshop', time: '2:00 PM' },
    { date: 'Feb 12', event: 'Science Fair', time: '6:00 PM' }
  ]

  const accommodations = [
    { name: 'Extended Test Time', active: true, effectiveness: 'High' },
    { name: 'Note-taking Assistance', active: true, effectiveness: 'Medium' },
    { name: 'Preferential Seating', active: false, effectiveness: 'N/A' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/schools/secondary-school" className="text-white font-semibold text-lg hover:text-purple-300">
              ← Stage Prep Academy
            </Link>
            <h1 className="text-2xl font-bold text-white">Parent Portal</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{studentData.name}'s Parent</div>
                <div className="text-sm text-purple-200">{studentData.grade} Family</div>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                P
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">{studentData.name}</h2>
              <p className="text-lg text-purple-200">{studentData.grade} • Class Rank: {studentData.rank}</p>
              <p className="text-purple-300">Graduation: {studentData.graduationYear}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{studentData.gpa}</div>
              <div className="text-purple-200">Cumulative GPA</div>
              <div className="text-sm text-purple-300 mt-1">{studentData.credits.completed}/{studentData.credits.required} Credits</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">{course.name}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">{course.grade}</span>
                  <span className="text-purple-300 text-sm">{course.progress}%</span>
                </div>
                <div className="text-purple-200 text-sm">{course.teacher}</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{width: `${course.progress}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'academics', name: 'Academics', icon: '📚' },
                { id: 'college', name: 'College Prep', icon: '🎓' },
                { id: 'communication', name: 'Messages', icon: '💬' }
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
                  <h3 className="text-xl font-bold text-white mb-6">Recent Activities</h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              activity.type === 'assignment' ? 'bg-blue-500/30 text-blue-200' :
                              activity.type === 'assessment' ? 'bg-green-500/30 text-green-200' :
                              activity.type === 'support' ? 'bg-purple-500/30 text-purple-200' :
                              'bg-yellow-500/30 text-yellow-200'
                            }`}>
                              {activity.type}
                            </span>
                            <span className="text-purple-300 text-sm">{activity.date}</span>
                          </div>
                          <span className="text-white font-bold">{activity.grade}</span>
                        </div>
                        <h4 className="text-white font-semibold">{activity.activity}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Upcoming Events</h3>
                  <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-purple-300 text-sm font-medium">{event.date}</div>
                        <div className="text-white font-semibold">{event.event}</div>
                        <div className="text-purple-200 text-sm">{event.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'academics' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Academic Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Current Courses</h4>
                    <div className="space-y-4">
                      {courses.map((course, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="text-white font-semibold">{course.name}</h5>
                            <span className="text-purple-300 font-bold">{course.grade}</span>
                          </div>
                          <div className="text-purple-200 text-sm mb-2">{course.teacher}</div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{width: `${course.progress}%`}}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Accommodations</h4>
                    <div className="space-y-4">
                      {accommodations.map((accommodation, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-white font-semibold">{accommodation.name}</h5>
                            <span className={`px-2 py-1 rounded text-xs ${
                              accommodation.active ? 'bg-green-500/30 text-green-200' : 'bg-gray-500/30 text-gray-200'
                            }`}>
                              {accommodation.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="text-purple-200 text-sm">
                            Effectiveness: {accommodation.effectiveness}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'college' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">College Preparation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">SAT/ACT Prep</h4>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">1480</div>
                        <div className="text-sm text-purple-200">Latest SAT Score</div>
                      </div>
                      <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                        Register for Next Test
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">College Planning</h4>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">8</div>
                        <div className="text-sm text-purple-200">Colleges on List</div>
                      </div>
                      <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                        View College List
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Scholarships</h4>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">5</div>
                        <div className="text-sm text-purple-200">Applications Started</div>
                      </div>
                      <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
                        Find More Scholarships
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'communication' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Messages & Communication</h3>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                    New Message
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-semibold">From: Dr. Chen (Biology)</h4>
                        <p className="text-purple-200 text-sm">Today, 3:15 PM</p>
                      </div>
                      <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded text-xs">Teacher Update</span>
                    </div>
                    <p className="text-white">Marcus showed excellent understanding in today's lab on cellular respiration. His analytical skills and attention to detail are really improving. Great work!</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-semibold">From: College Counselor</h4>
                        <p className="text-purple-200 text-sm">Yesterday, 1:30 PM</p>
                      </div>
                      <span className="bg-green-500/30 text-green-200 px-2 py-1 rounded text-xs">College Prep</span>
                    </div>
                    <p className="text-white">Marcus is on track for his college applications. We should schedule a meeting to discuss his personal statement and finalize his college list.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Parent Resources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-blue-600/20 text-blue-200 p-4 rounded-lg hover:bg-blue-600/30 transition-colors">
              📊 Grade Reports
            </button>
            <button className="bg-green-600/20 text-green-200 p-4 rounded-lg hover:bg-green-600/30 transition-colors">
              🎓 College Planning
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              📅 Schedule Meeting
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              💰 Financial Aid
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}