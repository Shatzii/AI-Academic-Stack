'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface StudentMetrics {
  engagementScore: number
  comprehensionRate: number
  progressVelocity: number
  strengthAreas: string[]
  improvementAreas: string[]
  recommendedActions: string[]
  learningPatterns: {
    peakHours: string[]
    preferredSubjects: string[]
    strugglingSubjects: string[]
  }
}

export default function AIAnalyticsPage() {
  const [metrics, setMetrics] = useState<StudentMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')

  useEffect(() => {
    fetchAnalytics()
  }, [selectedTimeframe])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/ai-analytics?timeframe=${selectedTimeframe}`)
      const data = await response.json()
      setMetrics(data.metrics)
    } catch (error) {
      console.error('Analytics fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const mockMetrics: StudentMetrics = {
    engagementScore: 85,
    comprehensionRate: 78,
    progressVelocity: 92,
    strengthAreas: ['Mathematics', 'Visual Learning', 'Problem Solving'],
    improvementAreas: ['Reading Comprehension', 'Time Management', 'Written Expression'],
    recommendedActions: [
      'Increase reading practice with audio support',
      'Implement structured study schedule',
      'Use visual aids for complex concepts',
      'Practice writing with speech-to-text tools'
    ],
    learningPatterns: {
      peakHours: ['9:00 AM - 11:00 AM', '2:00 PM - 4:00 PM'],
      preferredSubjects: ['Math', 'Science', 'Art'],
      strugglingSubjects: ['English Literature', 'History']
    }
  }

  const displayMetrics = metrics || mockMetrics

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-xl hover:text-emerald-300 transition-colors">
              ← The Universal One School
            </Link>
            <div className="text-white font-bold text-xl">
              AI Learning Analytics
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white mb-2">Learning Analytics Dashboard</h1>
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="p-2 rounded-lg bg-black/30 text-white border border-white/30"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="semester">This Semester</option>
            </select>
          </div>
          <p className="text-emerald-200">AI-powered insights into learning patterns and progress</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full"></div>
            <span className="text-white ml-3">Analyzing learning data...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Key Metrics */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>Engagement Score</span>
                    <span>{displayMetrics.engagementScore}%</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${displayMetrics.engagementScore}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>Comprehension Rate</span>
                    <span>{displayMetrics.comprehensionRate}%</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${displayMetrics.comprehensionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>Progress Velocity</span>
                    <span>{displayMetrics.progressVelocity}%</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div 
                      className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${displayMetrics.progressVelocity}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Strength Areas</h3>
              <div className="space-y-2">
                {displayMetrics.strengthAreas.map((strength, index) => (
                  <div key={index} className="flex items-center bg-emerald-500/20 p-3 rounded-lg">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    <span className="text-white">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Areas */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Growth Opportunities</h3>
              <div className="space-y-2">
                {displayMetrics.improvementAreas.map((area, index) => (
                  <div key={index} className="flex items-center bg-yellow-500/20 p-3 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                    <span className="text-white">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Patterns */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 md:col-span-2">
              <h3 className="text-white font-bold text-lg mb-4">Learning Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-emerald-300 font-medium mb-2">Peak Learning Hours</h4>
                  {displayMetrics.learningPatterns.peakHours.map((hour, index) => (
                    <div key={index} className="text-white/80 text-sm mb-1">{hour}</div>
                  ))}
                </div>
                <div>
                  <h4 className="text-emerald-300 font-medium mb-2">Preferred Subjects</h4>
                  {displayMetrics.learningPatterns.preferredSubjects.map((subject, index) => (
                    <div key={index} className="text-white/80 text-sm mb-1">{subject}</div>
                  ))}
                </div>
                <div>
                  <h4 className="text-emerald-300 font-medium mb-2">Challenge Areas</h4>
                  {displayMetrics.learningPatterns.strugglingSubjects.map((subject, index) => (
                    <div key={index} className="text-white/80 text-sm mb-1">{subject}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">AI Recommendations</h3>
              <div className="space-y-3">
                {displayMetrics.recommendedActions.map((action, index) => (
                  <div key={index} className="flex items-start bg-blue-500/20 p-3 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span className="text-white text-sm">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link 
            href="/ai-tutor"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Start AI Tutoring Session
          </Link>
          <Link 
            href="/virtual-classroom"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
          >
            Join Virtual Classroom
          </Link>
          <Link 
            href="/study-buddy"
            className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors"
          >
            AI Study Buddy
          </Link>
        </div>
      </div>
    </div>
  )
}