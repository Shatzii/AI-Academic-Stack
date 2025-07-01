'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export default function PrimaryStudentDashboard() {
  const [selectedHero, setSelectedHero] = useState('lightning')

  const studentData = {
    name: 'Emma Johnson',
    grade: 'Kindergarten',
    heroName: 'Lightning Learner',
    superPowers: ['Reading', 'Math', 'Science'],
    level: 5,
    points: 1250,
    badges: ['First Day Hero', 'Reading Champion', 'Math Explorer']
  }

  const heroThemes = {
    lightning: { color: 'from-yellow-400 to-orange-500', icon: '⚡', name: 'Lightning Learner' },
    water: { color: 'from-blue-400 to-cyan-500', icon: '💧', name: 'Water Warrior' },
    earth: { color: 'from-green-400 to-emerald-500', icon: '🌱', name: 'Earth Guardian' },
    fire: { color: 'from-red-400 to-pink-500', icon: '🔥', name: 'Fire Phoenix' }
  }

  const assignments = [
    { subject: 'Reading', title: 'Superhero Story Time', dueDate: 'Today', status: 'new', difficulty: 'easy' },
    { subject: 'Math', title: 'Counting Super Powers', dueDate: 'Tomorrow', status: 'in_progress', difficulty: 'medium' },
    { subject: 'Science', title: 'Weather Heroes', dueDate: 'Friday', status: 'new', difficulty: 'easy' }
  ]

  const achievements = [
    { name: 'Reading Champion', icon: '📚', description: 'Read 10 books this month', earned: true },
    { name: 'Math Explorer', icon: '🧮', description: 'Solved 50 math problems', earned: true },
    { name: 'Science Hero', icon: '🔬', description: 'Complete 5 experiments', earned: false, progress: 60 },
    { name: 'Art Master', icon: '🎨', description: 'Create 8 artworks', earned: false, progress: 25 }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${heroThemes[selectedHero].color}`}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/schools/primary-school" className="text-indigo-600 font-semibold text-lg hover:text-indigo-500">
              ← SuperHero School
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Hero Dashboard</h1>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="font-semibold text-gray-900">{studentData.name}</div>
                <div className="text-sm text-gray-600">{studentData.grade}</div>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {studentData.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Profile Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-6xl">{heroThemes[selectedHero].icon}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{heroThemes[selectedHero].name}</h2>
                <p className="text-lg text-gray-600">Level {studentData.level} Hero</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">{studentData.points} Points</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
          </div>

          {/* Hero Theme Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Choose Your Hero Theme:</h3>
            <div className="flex space-x-4">
              {Object.entries(heroThemes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setSelectedHero(key)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedHero === key 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{theme.icon}</div>
                  <div className="text-xs font-medium">{theme.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Super Powers */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Your Super Powers:</h3>
            <div className="flex space-x-3">
              {studentData.superPowers.map((power, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full text-sm font-medium"
                >
                  {power}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Missions (Assignments) */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">🎯 Today's Hero Missions</h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {assignments.filter(a => a.status === 'new').length} New
                </span>
              </div>
              
              <div className="space-y-4">
                {assignments.map((assignment, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          assignment.status === 'new' ? 'bg-blue-500' :
                          assignment.status === 'in_progress' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                          {assignment.subject}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        assignment.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        assignment.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {assignment.difficulty}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{assignment.title}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Due: {assignment.dueDate}</span>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Start Mission
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Achievements */}
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Hero Badges</h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    achievement.earned ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`text-2xl ${achievement.earned ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                        <p className="text-xs text-gray-600">{achievement.description}</p>
                        {!achievement.earned && achievement.progress && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{width: `${achievement.progress}%`}}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{achievement.progress}% complete</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tools */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🛠️ Hero Tools</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  📚 Reading Adventures
                </button>
                <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  🧮 Math Magic
                </button>
                <button className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  🔬 Science Lab
                </button>
                <button className="w-full text-left p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
                  🎨 Art Studio
                </button>
                <button className="w-full text-left p-3 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors">
                  🎵 Music Room
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">📈 Hero Progress This Week</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📖</div>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Books Read</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🧮</div>
              <div className="text-2xl font-bold text-green-600">85</div>
              <div className="text-sm text-gray-600">Math Problems</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔬</div>
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">Experiments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-yellow-600">95%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}