'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface ClassSession {
  id: string
  title: string
  instructor: string
  subject: string
  participants: number
  maxParticipants: number
  startTime: string
  duration: number
  isLive: boolean
  description: string
  gradeLevel: string
}

export default function VirtualClassroomPage() {
  const [activeSessions, setActiveSessions] = useState<ClassSession[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<ClassSession[]>([])
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [selectedGrade, setSelectedGrade] = useState('All')
  const [isLoading, setIsLoading] = useState(true)

  const subjects = ['All', 'Mathematics', 'Science', 'English', 'History', 'Art', 'Music', 'Programming', 'Law']
  const grades = ['All', 'K-2', '3-5', '6-8', '9-12', 'College', 'Adult']

  useEffect(() => {
    fetchClassSessions()
  }, [selectedSubject, selectedGrade])

  const fetchClassSessions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/virtual-classroom?subject=${selectedSubject}&grade=${selectedGrade}`)
      const data = await response.json()
      setActiveSessions(data.active || mockActiveSessions)
      setUpcomingSessions(data.upcoming || mockUpcomingSessions)
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
      setActiveSessions(mockActiveSessions)
      setUpcomingSessions(mockUpcomingSessions)
    } finally {
      setIsLoading(false)
    }
  }

  const mockActiveSessions: ClassSession[] = [
    {
      id: '1',
      title: 'Interactive Algebra for ADHD Learners',
      instructor: 'Professor Martinez',
      subject: 'Mathematics',
      participants: 8,
      maxParticipants: 12,
      startTime: '10:00 AM',
      duration: 45,
      isLive: true,
      description: 'Visual and kinesthetic approach to solving linear equations',
      gradeLevel: '6-8'
    },
    {
      id: '2',
      title: 'Creative Writing with AI Support',
      instructor: 'Ms. Johnson',
      subject: 'English',
      participants: 6,
      maxParticipants: 10,
      startTime: '11:15 AM',
      duration: 60,
      isLive: true,
      description: 'Using AI tools to overcome writing blocks and enhance creativity',
      gradeLevel: '9-12'
    }
  ]

  const mockUpcomingSessions: ClassSession[] = [
    {
      id: '3',
      title: 'Physics Through Virtual Experiments',
      instructor: 'Dr. Chen',
      subject: 'Science',
      participants: 0,
      maxParticipants: 15,
      startTime: '2:00 PM',
      duration: 90,
      isLive: false,
      description: 'Hands-on physics concepts using VR simulations',
      gradeLevel: '9-12'
    },
    {
      id: '4',
      title: 'Art Therapy and Expression',
      instructor: 'Ms. Rivera',
      subject: 'Art',
      participants: 3,
      maxParticipants: 8,
      startTime: '3:30 PM',
      duration: 75,
      isLive: false,
      description: 'Therapeutic art techniques for emotional regulation',
      gradeLevel: 'All'
    }
  ]

  const joinSession = async (sessionId: string) => {
    // In a real implementation, this would handle joining the virtual classroom
    alert(`Joining session ${sessionId}. In production, this would open the virtual classroom interface.`)
  }

  const createSession = () => {
    alert('Session creation interface would open here. Teachers can create custom sessions with AI assistance.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-xl hover:text-violet-300 transition-colors">
              ← The Universal One School
            </Link>
            <div className="text-white font-bold text-xl">
              Virtual Classroom Hub
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Virtual Learning Sessions</h1>
          <p className="text-violet-200">Join live AI-enhanced classes designed for neurodivergent learners</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">Subject Filter</label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/30 focus:border-violet-400"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/80 mb-2 text-sm font-medium">Grade Level</label>
            <select 
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/30 focus:border-violet-400"
            >
              {grades.map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={createSession}
              className="w-full p-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
            >
              Create New Session
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-violet-400 border-t-transparent rounded-full"></div>
            <span className="text-white ml-3">Loading sessions...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Live Sessions */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                Live Sessions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSessions.map((session) => (
                  <div key={session.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-violet-400 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-white font-bold text-lg">{session.title}</h3>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">LIVE</span>
                    </div>
                    <p className="text-violet-200 text-sm mb-3">{session.description}</p>
                    <div className="space-y-2 text-white/80 text-sm mb-4">
                      <div>Instructor: {session.instructor}</div>
                      <div>Subject: {session.subject}</div>
                      <div>Grade: {session.gradeLevel}</div>
                      <div>Participants: {session.participants}/{session.maxParticipants}</div>
                      <div>Duration: {session.duration} minutes</div>
                    </div>
                    <button
                      onClick={() => joinSession(session.id)}
                      className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Join Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                Upcoming Sessions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-blue-400 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-white font-bold text-lg">{session.title}</h3>
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{session.startTime}</span>
                    </div>
                    <p className="text-blue-200 text-sm mb-3">{session.description}</p>
                    <div className="space-y-2 text-white/80 text-sm mb-4">
                      <div>Instructor: {session.instructor}</div>
                      <div>Subject: {session.subject}</div>
                      <div>Grade: {session.gradeLevel}</div>
                      <div>Registered: {session.participants}/{session.maxParticipants}</div>
                      <div>Duration: {session.duration} minutes</div>
                    </div>
                    <button
                      onClick={() => joinSession(session.id)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Register
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="text-white font-bold mb-2">AI Teaching Assistant</h3>
            <p className="text-white/70 text-sm">Every session includes an AI assistant for personalized support</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-white font-bold mb-2">Adaptive Learning</h3>
            <p className="text-white/70 text-sm">Content automatically adjusts to each student's learning style</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-white font-bold mb-2">Real-time Analytics</h3>
            <p className="text-white/70 text-sm">Track engagement and comprehension in real-time</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-3">🧩</div>
            <h3 className="text-white font-bold mb-2">Neurodivergent Support</h3>
            <p className="text-white/70 text-sm">Specialized tools for ADHD, dyslexia, and autism support</p>
          </div>
        </div>
      </div>
    </div>
  )
}