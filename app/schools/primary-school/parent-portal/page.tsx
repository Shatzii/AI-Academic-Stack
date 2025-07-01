'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function PrimaryParentPortal() {
  const [activeTab, setActiveTab] = useState('overview')

  const childData = {
    name: 'Emma Wilson',
    grade: 'Kindergarten',
    heroName: 'Lightning Learner',
    teacher: 'Mrs. Johnson',
    progress: 92,
    streakDays: 15
  }

  const weeklyProgress = [
    { subject: 'Reading', current: 95, previous: 88, trend: 'up' },
    { subject: 'Math', current: 87, previous: 82, trend: 'up' },
    { subject: 'Science', current: 93, previous: 90, trend: 'up' },
    { subject: 'Social Studies', current: 89, previous: 91, trend: 'down' }
  ]

  const recentActivities = [
    { date: 'Today', activity: 'Completed "Superhero Reading Adventure"', type: 'assignment', score: 'A+' },
    { date: 'Yesterday', activity: 'Practiced math with Dean Wonder AI', type: 'practice', score: '95%' },
    { date: 'Jan 22', activity: 'Science experiment: Weather Heroes', type: 'lab', score: 'Excellent' },
    { date: 'Jan 21', activity: 'Used sensory break during focus time', type: 'accommodation', score: 'Helpful' }
  ]

  const accommodations = [
    { name: 'Movement Breaks', active: true, frequency: 'Every 15 minutes', effectiveness: 'High' },
    { name: 'Visual Cues', active: true, frequency: 'As needed', effectiveness: 'Medium' },
    { name: 'Extended Time', active: false, frequency: 'Test situations', effectiveness: 'N/A' }
  ]

  const upcomingEvents = [
    { date: 'Jan 26', event: 'Parent-Teacher Conference', time: '3:00 PM' },
    { date: 'Jan 28', event: 'Superhero Showcase', time: '10:00 AM' },
    { date: 'Feb 1', event: 'IEP Review Meeting', time: '2:30 PM' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/schools/primary-school" className="text-white font-semibold text-lg hover:text-green-300">
              ← SuperHero School
            </Link>
            <h1 className="text-2xl font-bold text-white">Parent Portal</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{childData.name}'s Parent</div>
                <div className="text-sm text-green-200">Kindergarten Family</div>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                P
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Child Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-6xl">⚡</div>
              <div>
                <h2 className="text-3xl font-bold text-white">{childData.name}</h2>
                <p className="text-lg text-green-200">{childData.heroName} • {childData.grade}</p>
                <p className="text-green-300">Teacher: {childData.teacher}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{childData.progress}%</div>
              <div className="text-green-200">Overall Progress</div>
              <div className="text-sm text-green-300 mt-1">{childData.streakDays} day learning streak! 🔥</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {weeklyProgress.map((subject, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">{subject.subject}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">{subject.current}%</span>
                  <span className={`text-sm ${subject.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {subject.trend === 'up' ? '↗' : '↘'} {Math.abs(subject.current - subject.previous)}%
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{width: `${subject.current}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'activities', name: 'Recent Activities', icon: '📚' },
                { id: 'accommodations', name: 'Accommodations', icon: '🛠️' },
                { id: 'communication', name: 'Messages', icon: '💬' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-green-400 text-green-300'
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
                  <h3 className="text-xl font-bold text-white mb-6">This Week's Highlights</h3>
                  <div className="space-y-4">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">🏆 Amazing Progress in Reading!</h4>
                      <p className="text-green-200 text-sm">Emma has shown exceptional improvement in phonics and sight word recognition. She's reading above grade level!</p>
                    </div>
                    
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">🧮 Math Hero Skills Developing</h4>
                      <p className="text-blue-200 text-sm">Strong number sense and basic addition/subtraction. Ready to advance to more complex problems.</p>
                    </div>

                    <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">🔬 Science Curiosity Shining</h4>
                      <p className="text-purple-200 text-sm">Emma asks thoughtful questions and shows genuine excitement about experiments and discoveries.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Upcoming Events</h3>
                  <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-green-300 text-sm font-medium">{event.date}</div>
                        <div className="text-white font-semibold">{event.event}</div>
                        <div className="text-green-200 text-sm">{event.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Recent Learning Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            activity.type === 'assignment' ? 'bg-blue-500/30 text-blue-200' :
                            activity.type === 'practice' ? 'bg-green-500/30 text-green-200' :
                            activity.type === 'lab' ? 'bg-purple-500/30 text-purple-200' :
                            'bg-yellow-500/30 text-yellow-200'
                          }`}>
                            {activity.type}
                          </span>
                          <span className="text-green-300 text-sm">{activity.date}</span>
                        </div>
                        <span className="text-white font-bold">{activity.score}</span>
                      </div>
                      <h4 className="text-white font-semibold">{activity.activity}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'accommodations' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Learning Accommodations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {accommodations.map((accommodation, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold text-white">{accommodation.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          accommodation.active ? 'bg-green-500/30 text-green-200' : 'bg-gray-500/30 text-gray-200'
                        }`}>
                          {accommodation.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-200">Frequency:</span>
                          <span className="text-white">{accommodation.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-200">Effectiveness:</span>
                          <span className={`${
                            accommodation.effectiveness === 'High' ? 'text-green-400' :
                            accommodation.effectiveness === 'Medium' ? 'text-yellow-400' :
                            'text-gray-400'
                          }`}>
                            {accommodation.effectiveness}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'communication' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Messages & Communication</h3>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    New Message
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-semibold">From: Mrs. Johnson</h4>
                        <p className="text-green-200 text-sm">Today, 2:30 PM</p>
                      </div>
                      <span className="bg-blue-500/30 text-blue-200 px-2 py-1 rounded text-xs">Teacher Note</span>
                    </div>
                    <p className="text-white">Emma had a wonderful day today! She helped a classmate with their reading and showed great leadership skills. Her kindness really shines through.</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-semibold">From: Dean Wonder AI</h4>
                        <p className="text-green-200 text-sm">Yesterday, 10:15 AM</p>
                      </div>
                      <span className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded text-xs">AI Update</span>
                    </div>
                    <p className="text-white">Emma completed her math practice session with 95% accuracy! She's mastering addition and ready for more challenging problems.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6">Parent Resources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-blue-600/20 text-blue-200 p-4 rounded-lg hover:bg-blue-600/30 transition-colors">
              📊 Progress Reports
            </button>
            <button className="bg-green-600/20 text-green-200 p-4 rounded-lg hover:bg-green-600/30 transition-colors">
              🏠 Home Activities
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              📅 Schedule Meeting
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              📚 Parent Guides
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}