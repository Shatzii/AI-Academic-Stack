'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function LanguageParentPortal() {
  const [activeTab, setActiveTab] = useState('overview')

  const studentData = {
    name: 'Isabella Chen',
    primaryLanguage: 'Spanish',
    level: 'Intermediate',
    streak: 47,
    totalProgress: 73
  }

  const languageProgress = [
    { language: 'Spanish', level: 'Intermediate', progress: 73, hours: 156, fluency: 'Conversational' },
    { language: 'French', level: 'Beginner', progress: 28, hours: 42, fluency: 'Basic Phrases' }
  ]

  const recentActivities = [
    { date: 'Today', activity: 'Completed Spanish Conversation Practice', type: 'speaking', score: 'Excellent' },
    { date: 'Yesterday', activity: 'Cultural Video: Mexican Traditions', type: 'culture', score: 'Watched' },
    { date: 'Jan 22', activity: 'Grammar Quiz: Past Tense', type: 'grammar', score: '85%' },
    { date: 'Jan 21', activity: 'Vocabulary Flash Cards', type: 'vocabulary', score: '92%' }
  ]

  const culturalEvents = [
    { date: 'Jan 30', event: 'Spanish Film Night', time: '6:00 PM', description: 'Family movie with subtitles' },
    { date: 'Feb 5', event: 'Cooking Class: Paella', time: '4:00 PM', description: 'Interactive cooking session' },
    { date: 'Feb 12', event: 'Conversation Circle', time: '5:30 PM', description: 'Practice with native speakers' },
    { date: 'Feb 18', event: 'Cultural Fair', time: '2:00 PM', description: 'Spanish-speaking countries showcase' }
  ]

  const weeklyGoals = [
    { goal: 'Complete 5 lessons', current: 4, target: 5, category: 'lessons' },
    { goal: '30 minutes speaking practice', current: 25, target: 30, category: 'speaking' },
    { goal: 'Learn 20 new words', current: 18, target: 20, category: 'vocabulary' },
    { goal: 'Cultural activity', current: 1, target: 1, category: 'culture' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-emerald-900">
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/schools/language-school" className="text-white font-semibold text-lg hover:text-teal-300">
              ← Language Learning School
            </Link>
            <h1 className="text-2xl font-bold text-white">Parent Portal</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{studentData.name}'s Family</div>
                <div className="text-sm text-teal-200">Language Learning Parent</div>
              </div>
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
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
              <p className="text-lg text-teal-200">{studentData.primaryLanguage} • {studentData.level} Level</p>
              <p className="text-teal-300">{studentData.streak} day learning streak</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{studentData.totalProgress}%</div>
              <div className="text-teal-200">Overall Progress</div>
              <div className="text-sm text-green-400 mt-1">On Track</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {languageProgress.map((lang, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-semibold">{lang.language}</h4>
                    <p className="text-teal-200 text-sm">{lang.level} • {lang.hours} hours studied</p>
                  </div>
                  <span className="text-2xl font-bold text-white">{lang.progress}%</span>
                </div>
                <div className="mb-2">
                  <div className="text-teal-300 text-sm mb-1">Fluency: {lang.fluency}</div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full" 
                      style={{width: `${lang.progress}%`}}
                    ></div>
                  </div>
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
                { id: 'progress', name: 'Progress', icon: '📈' },
                { id: 'culture', name: 'Cultural Activities', icon: '🌍' },
                { id: 'communication', name: 'Parent Mode', icon: '🗣️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-teal-400 text-teal-300'
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
                              activity.type === 'speaking' ? 'bg-blue-500/30 text-blue-200' :
                              activity.type === 'culture' ? 'bg-purple-500/30 text-purple-200' :
                              activity.type === 'grammar' ? 'bg-green-500/30 text-green-200' :
                              'bg-yellow-500/30 text-yellow-200'
                            }`}>
                              {activity.type}
                            </span>
                            <span className="text-teal-300 text-sm">{activity.date}</span>
                          </div>
                          <span className="text-white font-bold">{activity.score}</span>
                        </div>
                        <h4 className="text-white font-semibold">{activity.activity}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Weekly Goals</h3>
                  <div className="space-y-4">
                    {weeklyGoals.map((goal, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white font-semibold text-sm">{goal.goal}</h4>
                          <span className="text-teal-300 text-sm">{goal.current}/{goal.target}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              goal.current >= goal.target ? 'bg-green-500' :
                              goal.current / goal.target >= 0.8 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{width: `${Math.min((goal.current / goal.target) * 100, 100)}%`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Detailed Progress Report</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Skill Breakdown</h4>
                    <div className="space-y-4">
                      {[
                        { skill: 'Listening', score: 78, improvement: '+5%' },
                        { skill: 'Speaking', score: 72, improvement: '+8%' },
                        { skill: 'Reading', score: 81, improvement: '+3%' },
                        { skill: 'Writing', score: 69, improvement: '+12%' }
                      ].map((skill, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="text-white font-semibold">{skill.skill}</h5>
                            <div className="flex items-center space-x-2">
                              <span className="text-teal-300 font-bold">{skill.score}%</span>
                              <span className="text-green-400 text-sm">{skill.improvement}</span>
                            </div>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-teal-500 h-2 rounded-full" 
                              style={{width: `${skill.score}%`}}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Learning Milestones</h4>
                    <div className="space-y-4">
                      {[
                        { milestone: 'First Conversation', date: 'Dec 15', status: 'completed' },
                        { milestone: '500 Words Learned', date: 'Jan 8', status: 'completed' },
                        { milestone: 'Grammar Mastery', date: 'Jan 25', status: 'in-progress' },
                        { milestone: 'Cultural Presentation', date: 'Feb 15', status: 'upcoming' }
                      ].map((milestone, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="text-white font-semibold">{milestone.milestone}</h5>
                              <div className="text-teal-200 text-sm">{milestone.date}</div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              milestone.status === 'completed' ? 'bg-green-500/30 text-green-200' :
                              milestone.status === 'in-progress' ? 'bg-yellow-500/30 text-yellow-200' :
                              'bg-blue-500/30 text-blue-200'
                            }`}>
                              {milestone.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'culture' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Cultural Immersion Events</h3>
                <div className="space-y-6">
                  {culturalEvents.map((event, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{event.event}</h4>
                          <p className="text-teal-200">{event.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-teal-300 font-medium">{event.date}</div>
                          <div className="text-white text-sm">{event.time}</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                          Register Family
                        </button>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                          More Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'communication' && (
              <div>
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">🌟 Parent Translation Mode</h3>
                  <p className="text-yellow-200 mb-4">
                    Access all platform content in your preferred language. Isabella's progress reports and assignments can be translated to help you stay engaged in her learning journey.
                  </p>
                  <div className="flex space-x-4">
                    <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                      Enable Translation
                    </button>
                    <select className="bg-white/10 text-white border border-white/20 rounded px-3 py-2">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="zh">中文</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-6">Communication with Teachers</h3>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-semibold">From: Professor Lingua</h4>
                        <p className="text-teal-200 text-sm">Today, 2:30 PM</p>
                      </div>
                      <span className="bg-teal-500/30 text-teal-200 px-2 py-1 rounded text-xs">Progress Update</span>
                    </div>
                    <p className="text-white mb-3">Isabella showed excellent progress in today's conversation practice. Her confidence in speaking Spanish has noticeably improved!</p>
                    <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
                      Translate to Mandarin
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-semibold">From: Cultural Activities Coordinator</h4>
                        <p className="text-teal-200 text-sm">Yesterday, 4:15 PM</p>
                      </div>
                      <span className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded text-xs">Event Invitation</span>
                    </div>
                    <p className="text-white mb-3">We're excited to invite your family to our upcoming Spanish Film Night. Isabella has been selected to help introduce the movie!</p>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                      RSVP for Family
                    </button>
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
              📊 Progress Reports
            </button>
            <button className="bg-green-600/20 text-green-200 p-4 rounded-lg hover:bg-green-600/30 transition-colors">
              🌍 Cultural Calendar
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              🗣️ Home Practice Tips
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              📚 Family Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}