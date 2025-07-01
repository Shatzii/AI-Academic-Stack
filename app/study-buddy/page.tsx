'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface StudyPlan {
  id: string
  subject: string
  topic: string
  estimatedTime: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  completed: boolean
  neurodivergentAdaptations: string[]
}

interface StudySession {
  isActive: boolean
  startTime: Date | null
  currentTopic: string
  breaksDue: number
  focusScore: number
}

export default function StudyBuddyPage() {
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [currentSession, setCurrentSession] = useState<StudySession>({
    isActive: false,
    startTime: null,
    currentTopic: '',
    breaksDue: 0,
    focusScore: 85
  })
  const [newTopic, setNewTopic] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const [learningSupport, setLearningSupport] = useState<string[]>(['ADHD Support'])

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art', 'Programming', 'Law']
  const supportOptions = ['ADHD Support', 'Dyslexia Support', 'Autism Support', 'Visual Learning', 'Kinesthetic Learning']

  useEffect(() => {
    generateInitialPlan()
  }, [])

  const generateInitialPlan = () => {
    const mockPlans: StudyPlan[] = [
      {
        id: '1',
        subject: 'Mathematics',
        topic: 'Linear Equations',
        estimatedTime: 30,
        difficulty: 'Medium',
        completed: false,
        neurodivergentAdaptations: ['Visual charts', 'Step-by-step breakdown', 'Movement breaks']
      },
      {
        id: '2',
        subject: 'Science',
        topic: 'Photosynthesis',
        estimatedTime: 25,
        difficulty: 'Easy',
        completed: true,
        neurodivergentAdaptations: ['Diagrams', 'Real-world examples', 'Hands-on activities']
      },
      {
        id: '3',
        subject: 'English',
        topic: 'Essay Structure',
        estimatedTime: 45,
        difficulty: 'Hard',
        completed: false,
        neurodivergentAdaptations: ['Templates', 'Voice-to-text', 'Extended time']
      }
    ]
    setStudyPlans(mockPlans)
  }

  const startStudySession = (topic: string) => {
    setCurrentSession({
      isActive: true,
      startTime: new Date(),
      currentTopic: topic,
      breaksDue: 0,
      focusScore: 85
    })
  }

  const endStudySession = () => {
    setCurrentSession(prev => ({
      ...prev,
      isActive: false,
      startTime: null,
      currentTopic: ''
    }))
  }

  const addStudyTopic = async () => {
    if (!newTopic.trim()) return

    const newPlan: StudyPlan = {
      id: Date.now().toString(),
      subject: selectedSubject,
      topic: newTopic,
      estimatedTime: 30,
      difficulty: 'Medium',
      completed: false,
      neurodivergentAdaptations: learningSupport
    }

    setStudyPlans(prev => [...prev, newPlan])
    setNewTopic('')
  }

  const completeTopic = (id: string) => {
    setStudyPlans(prev => 
      prev.map(plan => 
        plan.id === id ? { ...plan, completed: true } : plan
      )
    )
  }

  const getSessionDuration = () => {
    if (!currentSession.startTime) return '0:00'
    const now = new Date()
    const diff = now.getTime() - currentSession.startTime.getTime()
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-rose-900 to-red-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-xl hover:text-pink-300 transition-colors">
              ← The Universal One School
            </Link>
            <div className="text-white font-bold text-xl">
              AI Study Buddy
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Personalized Study Companion</h1>
          <p className="text-pink-200">AI-powered study planning with neurodivergent support</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Session Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Current Session</h3>
              
              {currentSession.isActive ? (
                <div className="space-y-4">
                  <div className="bg-green-500/20 p-4 rounded-lg">
                    <div className="text-green-300 font-medium">Studying: {currentSession.currentTopic}</div>
                    <div className="text-white text-2xl font-bold">{getSessionDuration()}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-white">
                      <span>Focus Score</span>
                      <span>{currentSession.focusScore}%</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2">
                      <div 
                        className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${currentSession.focusScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button className="w-full bg-yellow-600 text-white py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors">
                      Take Break (5 min)
                    </button>
                    <button 
                      onClick={endStudySession}
                      className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      End Session
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white/60">
                  <div className="text-4xl mb-4">📚</div>
                  <p>No active study session</p>
                  <p className="text-sm mt-2">Select a topic below to start studying</p>
                </div>
              )}
            </div>

            {/* Add New Topic */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mt-6">
              <h3 className="text-white font-bold text-lg mb-4">Add Study Topic</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2 text-sm">Subject</label>
                  <select 
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-sm">Topic</label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Enter topic to study..."
                    className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-pink-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-sm">Learning Support</label>
                  <div className="space-y-2">
                    {supportOptions.map(option => (
                      <label key={option} className="flex items-center text-white/80 text-sm">
                        <input
                          type="checkbox"
                          checked={learningSupport.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLearningSupport(prev => [...prev, option])
                            } else {
                              setLearningSupport(prev => prev.filter(s => s !== option))
                            }
                          }}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={addStudyTopic}
                  className="w-full bg-pink-600 text-white py-2 rounded-lg font-medium hover:bg-pink-700 transition-colors"
                >
                  Add Topic
                </button>
              </div>
            </div>
          </div>

          {/* Study Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Your Study Plan</h3>
              
              <div className="space-y-4">
                {studyPlans.map((plan) => (
                  <div key={plan.id} className={`p-4 rounded-lg border ${
                    plan.completed 
                      ? 'bg-green-500/20 border-green-500/30' 
                      : 'bg-white/5 border-white/20'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-medium">{plan.topic}</h4>
                        <p className="text-white/60 text-sm">{plan.subject}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          plan.difficulty === 'Easy' ? 'bg-green-500/30 text-green-300' :
                          plan.difficulty === 'Medium' ? 'bg-yellow-500/30 text-yellow-300' :
                          'bg-red-500/30 text-red-300'
                        }`}>
                          {plan.difficulty}
                        </span>
                        <span className="text-white/60 text-sm">{plan.estimatedTime} min</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-white/70 text-sm mb-2">Adaptations:</p>
                      <div className="flex flex-wrap gap-2">
                        {plan.neurodivergentAdaptations.map((adaptation, index) => (
                          <span key={index} className="bg-pink-500/20 text-pink-300 text-xs px-2 py-1 rounded">
                            {adaptation}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {!plan.completed && !currentSession.isActive && (
                        <button
                          onClick={() => startStudySession(plan.topic)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Start Studying
                        </button>
                      )}
                      {!plan.completed && (
                        <button
                          onClick={() => completeTopic(plan.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                      {plan.completed && (
                        <span className="text-green-300 text-sm font-medium">✓ Completed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Tips */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mt-6">
              <h3 className="text-white font-bold text-lg mb-4">AI Study Tips</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-500/20 p-4 rounded-lg">
                  <h4 className="text-blue-300 font-medium mb-2">ADHD Support</h4>
                  <p className="text-white/80 text-sm">Take 5-minute breaks every 25 minutes. Use timers and eliminate distractions.</p>
                </div>
                <div className="bg-purple-500/20 p-4 rounded-lg">
                  <h4 className="text-purple-300 font-medium mb-2">Visual Learning</h4>
                  <p className="text-white/80 text-sm">Create mind maps and diagrams. Use colors and visual organizers.</p>
                </div>
                <div className="bg-green-500/20 p-4 rounded-lg">
                  <h4 className="text-green-300 font-medium mb-2">Memory Tips</h4>
                  <p className="text-white/80 text-sm">Review material within 24 hours. Use spaced repetition for better retention.</p>
                </div>
                <div className="bg-orange-500/20 p-4 rounded-lg">
                  <h4 className="text-orange-300 font-medium mb-2">Focus Techniques</h4>
                  <p className="text-white/80 text-sm">Try the Pomodoro Technique. Study in a quiet, organized space.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}