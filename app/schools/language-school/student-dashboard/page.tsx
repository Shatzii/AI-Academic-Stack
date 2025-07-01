'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function LanguageStudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedLanguage, setSelectedLanguage] = useState('spanish')

  const studentData = {
    name: 'Alex Chen',
    nativeLanguage: 'English',
    targetLanguage: 'Spanish',
    level: 'Intermediate',
    streakDays: 42,
    totalPoints: 2850
  }

  const languages = {
    spanish: { name: 'Spanish', flag: '🇪🇸', progress: 65 },
    french: { name: 'French', flag: '🇫🇷', progress: 30 },
    german: { name: 'German', flag: '🇩🇪', progress: 15 },
    chinese: { name: 'Mandarin', flag: '🇨🇳', progress: 10 }
  }

  const todayLessons = [
    { id: 1, title: 'Past Tense Conjugations', type: 'Grammar', duration: '15 min', completed: false, difficulty: 'Medium' },
    { id: 2, title: 'Restaurant Vocabulary', type: 'Vocabulary', duration: '10 min', completed: true, difficulty: 'Easy' },
    { id: 3, title: 'Conversation Practice', type: 'Speaking', duration: '20 min', completed: false, difficulty: 'Hard' },
    { id: 4, title: 'Listening Exercise', type: 'Listening', duration: '12 min', completed: false, difficulty: 'Medium' }
  ]

  const achievements = [
    { name: 'Week Warrior', icon: '🔥', description: '7-day learning streak', earned: true },
    { name: 'Vocabulary Master', icon: '📚', description: '500 words learned', earned: true },
    { name: 'Speaking Star', icon: '🎤', description: '50 speaking exercises', earned: false, progress: 78 },
    { name: 'Culture Explorer', icon: '🌍', description: 'Complete cultural lessons', earned: false, progress: 40 }
  ]

  const culturalContent = [
    { title: 'Mexican Day of the Dead', type: 'Cultural', status: 'available', image: '💀' },
    { title: 'Spanish Flamenco Dance', type: 'Cultural', status: 'completed', image: '💃' },
    { title: 'Latin American Cuisine', type: 'Cultural', status: 'in_progress', image: '🥘' },
    { title: 'Spanish Literature', type: 'Cultural', status: 'locked', image: '📖' }
  ]

  const conversationPartners = [
    { name: 'Maria', country: 'Mexico', status: 'online', level: 'Native' },
    { name: 'Carlos', country: 'Spain', status: 'offline', level: 'Native' },
    { name: 'Sofia', country: 'Argentina', status: 'online', level: 'Native' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/schools/language-school" className="text-white font-semibold text-lg hover:text-emerald-300">
              ← Language Learning School
            </Link>
            <h1 className="text-2xl font-bold text-white">Language Dashboard</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-white">{studentData.name}</div>
                <div className="text-sm text-emerald-200">{studentData.level} • {studentData.streakDays} day streak</div>
              </div>
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                {studentData.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-white">{studentData.streakDays}</div>
              <div className="text-emerald-200 text-sm">Day Streak</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-white">{studentData.totalPoints}</div>
              <div className="text-emerald-200 text-sm">Total Points</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl mb-2">{languages[selectedLanguage].flag}</div>
              <div className="text-2xl font-bold text-white">{languages[selectedLanguage].progress}%</div>
              <div className="text-emerald-200 text-sm">{languages[selectedLanguage].name}</div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-white">{studentData.level}</div>
              <div className="text-emerald-200 text-sm">Current Level</div>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Choose Your Language</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(languages).map(([key, lang]) => (
              <button
                key={key}
                onClick={() => setSelectedLanguage(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedLanguage === key 
                    ? 'border-emerald-400 bg-emerald-500/20' 
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <div className="text-white font-semibold">{lang.name}</div>
                <div className="text-emerald-200 text-sm">{lang.progress}% Complete</div>
                <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                  <div 
                    className="bg-emerald-400 h-2 rounded-full" 
                    style={{width: `${lang.progress}%`}}
                  ></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 mb-8">
          <div className="border-b border-white/20">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Today\'s Lessons', icon: '📚' },
                { id: 'practice', name: 'Practice', icon: '🎯' },
                { id: 'culture', name: 'Culture', icon: '🌍' },
                { id: 'social', name: 'Conversation', icon: '💬' }
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
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-6">Today's Learning Plan</h3>
                  <div className="space-y-4">
                    {todayLessons.map((lesson) => (
                      <div key={lesson.id} className={`rounded-lg p-4 border ${
                        lesson.completed 
                          ? 'bg-green-500/20 border-green-500/30' 
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              lesson.completed 
                                ? 'border-green-400 bg-green-400' 
                                : 'border-white/40'
                            }`}>
                              {lesson.completed && <span className="text-white text-xs">✓</span>}
                            </div>
                            <span className="px-3 py-1 bg-emerald-500/30 text-emerald-200 rounded-full text-sm">
                              {lesson.type}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              lesson.difficulty === 'Easy' ? 'bg-green-500/30 text-green-200' :
                              lesson.difficulty === 'Medium' ? 'bg-yellow-500/30 text-yellow-200' :
                              'bg-red-500/30 text-red-200'
                            }`}>
                              {lesson.difficulty}
                            </span>
                            <span className="text-emerald-200 text-sm">{lesson.duration}</span>
                          </div>
                        </div>
                        <h4 className="font-semibold text-white mb-2">{lesson.title}</h4>
                        {!lesson.completed && (
                          <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
                            Start Lesson
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Achievements</h3>
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
                            <p className="text-sm text-emerald-200">{achievement.description}</p>
                            {!achievement.earned && achievement.progress && (
                              <div className="mt-2">
                                <div className="w-full bg-white/20 rounded-full h-2">
                                  <div 
                                    className="bg-emerald-400 h-2 rounded-full" 
                                    style={{width: `${achievement.progress}%`}}
                                  ></div>
                                </div>
                                <span className="text-xs text-emerald-300">{achievement.progress}% complete</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'practice' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Practice Exercises</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="text-4xl mb-4 text-center">📝</div>
                    <h4 className="text-lg font-semibold text-white mb-2">Grammar Practice</h4>
                    <p className="text-emerald-200 text-sm mb-4">Master verb conjugations and sentence structure</p>
                    <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                      Start Practice
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="text-4xl mb-4 text-center">🗣️</div>
                    <h4 className="text-lg font-semibold text-white mb-2">Speaking Practice</h4>
                    <p className="text-emerald-200 text-sm mb-4">Improve pronunciation with AI feedback</p>
                    <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                      Start Speaking
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="text-4xl mb-4 text-center">👂</div>
                    <h4 className="text-lg font-semibold text-white mb-2">Listening Practice</h4>
                    <p className="text-emerald-200 text-sm mb-4">Train your ear with native speakers</p>
                    <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                      Start Listening
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="text-4xl mb-4 text-center">📖</div>
                    <h4 className="text-lg font-semibold text-white mb-2">Reading Practice</h4>
                    <p className="text-emerald-200 text-sm mb-4">Comprehension with graded texts</p>
                    <button className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
                      Start Reading
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="text-4xl mb-4 text-center">✍️</div>
                    <h4 className="text-lg font-semibold text-white mb-2">Writing Practice</h4>
                    <p className="text-emerald-200 text-sm mb-4">Express yourself in writing</p>
                    <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                      Start Writing
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                    <div className="text-4xl mb-4 text-center">🎮</div>
                    <h4 className="text-lg font-semibold text-white mb-2">Language Games</h4>
                    <p className="text-emerald-200 text-sm mb-4">Learn through fun activities</p>
                    <button className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700">
                      Play Games
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'culture' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Cultural Immersion</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {culturalContent.map((content, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{content.image}</div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-2">{content.title}</h4>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                            content.status === 'completed' ? 'bg-green-500/30 text-green-200' :
                            content.status === 'in_progress' ? 'bg-yellow-500/30 text-yellow-200' :
                            content.status === 'available' ? 'bg-blue-500/30 text-blue-200' :
                            'bg-gray-500/30 text-gray-200'
                          }`}>
                            {content.status.replace('_', ' ')}
                          </span>
                          <div className="mt-3">
                            <button 
                              className={`px-4 py-2 rounded ${
                                content.status === 'locked' 
                                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                              }`}
                              disabled={content.status === 'locked'}
                            >
                              {content.status === 'completed' ? 'Review' :
                               content.status === 'in_progress' ? 'Continue' :
                               content.status === 'available' ? 'Start' : 'Locked'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-6">Language Exchange</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Available Conversation Partners</h4>
                    <div className="space-y-4">
                      {conversationPartners.map((partner, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                                {partner.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-white font-semibold">{partner.name}</div>
                                <div className="text-emerald-200 text-sm">{partner.country} • {partner.level}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`w-3 h-3 rounded-full ${
                                partner.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                              }`}></span>
                              <button 
                                className={`px-3 py-1 rounded text-sm ${
                                  partner.status === 'online' 
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                                }`}
                                disabled={partner.status !== 'online'}
                              >
                                {partner.status === 'online' ? 'Chat Now' : 'Offline'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Group Activities</h4>
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h5 className="text-white font-semibold mb-2">Spanish Book Club</h5>
                        <p className="text-emerald-200 text-sm mb-3">Discussing "Cien años de soledad"</p>
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-300 text-sm">Next: Today 7:00 PM</span>
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                            Join
                          </button>
                        </div>
                      </div>

                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <h5 className="text-white font-semibold mb-2">Conversation Circle</h5>
                        <p className="text-emerald-200 text-sm mb-3">Practice speaking with peers</p>
                        <div className="flex justify-between items-center">
                          <span className="text-emerald-300 text-sm">Next: Tomorrow 6:00 PM</span>
                          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                            Join
                          </button>
                        </div>
                      </div>
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button className="bg-blue-600/20 text-blue-200 p-4 rounded-lg hover:bg-blue-600/30 transition-colors">
              📚 Daily Lesson
            </button>
            <button className="bg-green-600/20 text-green-200 p-4 rounded-lg hover:bg-green-600/30 transition-colors">
              🎤 Voice Practice
            </button>
            <button className="bg-purple-600/20 text-purple-200 p-4 rounded-lg hover:bg-purple-600/30 transition-colors">
              💬 Live Chat
            </button>
            <button className="bg-yellow-600/20 text-yellow-200 p-4 rounded-lg hover:bg-yellow-600/30 transition-colors">
              🌍 Culture Quiz
            </button>
            <button className="bg-pink-600/20 text-pink-200 p-4 rounded-lg hover:bg-pink-600/30 transition-colors">
              🎯 Practice Test
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}