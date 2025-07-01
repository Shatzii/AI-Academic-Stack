'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface Question {
  id: string
  type: 'multiple-choice' | 'short-answer' | 'drag-drop' | 'matching'
  difficulty: number
  subject: string
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  adaptations: string[]
}

interface AssessmentSession {
  isActive: boolean
  currentQuestion: Question | null
  questionIndex: number
  totalQuestions: number
  score: number
  difficultyLevel: number
  answers: Array<{ questionId: string, answer: string, correct: boolean, timeSpent: number }>
  startTime: Date | null
  adaptiveAdjustments: string[]
}

export default function AdaptiveAssessmentPage() {
  const [session, setSession] = useState<AssessmentSession>({
    isActive: false,
    currentQuestion: null,
    questionIndex: 0,
    totalQuestions: 10,
    score: 0,
    difficultyLevel: 5,
    answers: [],
    startTime: null,
    adaptiveAdjustments: []
  })
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null)
  const [assessmentSettings, setAssessmentSettings] = useState({
    subject: 'Mathematics',
    gradeLevel: '6-8',
    neurodivergentSupport: ['ADHD Support'],
    timeLimit: 30
  })

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Programming']
  const gradeLevels = ['K-2', '3-5', '6-8', '9-12', 'College']
  const supportOptions = ['ADHD Support', 'Dyslexia Support', 'Autism Support', 'Extended Time', 'Read Aloud']

  const mockQuestions: Question[] = [
    {
      id: '1',
      type: 'multiple-choice',
      difficulty: 5,
      subject: 'Mathematics',
      question: 'What is the solution to 2x + 5 = 13?',
      options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
      correctAnswer: 'x = 4',
      explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
      adaptations: ['Visual equation breakdown', 'Step-by-step guidance']
    },
    {
      id: '2',
      type: 'multiple-choice',
      difficulty: 3,
      subject: 'Mathematics',
      question: 'Which of these is equivalent to 15/25?',
      options: ['2/3', '3/5', '1/2', '4/5'],
      correctAnswer: '3/5',
      explanation: 'Simplify by dividing both numerator and denominator by 5: 15÷5 = 3, 25÷5 = 5',
      adaptations: ['Visual fraction diagrams', 'Color-coded steps']
    },
    {
      id: '3',
      type: 'short-answer',
      difficulty: 7,
      subject: 'Mathematics',
      question: 'If a rectangle has a length of 8 cm and a width of 5 cm, what is its perimeter?',
      correctAnswer: '26',
      explanation: 'Perimeter = 2(length + width) = 2(8 + 5) = 2(13) = 26 cm',
      adaptations: ['Formula reference card', 'Visual rectangle diagram']
    }
  ]

  const startAssessment = () => {
    setSession(prev => ({
      ...prev,
      isActive: true,
      currentQuestion: mockQuestions[0],
      questionIndex: 0,
      score: 0,
      answers: [],
      startTime: new Date(),
      adaptiveAdjustments: []
    }))
    setQuestionStartTime(new Date())
    setSelectedAnswer('')
  }

  const submitAnswer = () => {
    if (!session.currentQuestion || !questionStartTime) return

    const timeSpent = new Date().getTime() - questionStartTime.getTime()
    const isCorrect = selectedAnswer === session.currentQuestion.correctAnswer

    const newAnswer = {
      questionId: session.currentQuestion.id,
      answer: selectedAnswer,
      correct: isCorrect,
      timeSpent: Math.round(timeSpent / 1000)
    }

    const newAnswers = [...session.answers, newAnswer]
    const newScore = newAnswers.filter(a => a.correct).length
    
    // Adaptive difficulty adjustment
    let newDifficulty = session.difficultyLevel
    let adjustments = [...session.adaptiveAdjustments]
    
    if (isCorrect && timeSpent < 15000) {
      newDifficulty = Math.min(10, newDifficulty + 1)
      adjustments.push('Increased difficulty due to quick correct answer')
    } else if (!isCorrect || timeSpent > 45000) {
      newDifficulty = Math.max(1, newDifficulty - 1)
      adjustments.push('Decreased difficulty to support learning')
    }

    setSession(prev => ({
      ...prev,
      answers: newAnswers,
      score: newScore,
      questionIndex: prev.questionIndex + 1,
      difficultyLevel: newDifficulty,
      adaptiveAdjustments: adjustments
    }))

    // Load next question or end assessment
    setTimeout(() => {
      if (session.questionIndex + 1 < session.totalQuestions) {
        const nextQuestion = getAdaptiveQuestion(newDifficulty)
        setSession(prev => ({
          ...prev,
          currentQuestion: nextQuestion
        }))
        setQuestionStartTime(new Date())
        setSelectedAnswer('')
      } else {
        endAssessment()
      }
    }, 2000)
  }

  const getAdaptiveQuestion = (difficulty: number): Question => {
    const availableQuestions = mockQuestions.filter(q => 
      Math.abs(q.difficulty - difficulty) <= 2 &&
      !session.answers.some(a => a.questionId === q.id)
    )
    return availableQuestions[0] || mockQuestions[session.questionIndex + 1] || mockQuestions[0]
  }

  const endAssessment = () => {
    setSession(prev => ({
      ...prev,
      isActive: false,
      currentQuestion: null
    }))
  }

  const getPerformanceAnalysis = () => {
    const accuracy = session.answers.length > 0 ? (session.score / session.answers.length) * 100 : 0
    const avgTime = session.answers.length > 0 
      ? session.answers.reduce((sum, a) => sum + a.timeSpent, 0) / session.answers.length 
      : 0

    return {
      accuracy: Math.round(accuracy),
      averageTime: Math.round(avgTime),
      finalDifficulty: session.difficultyLevel,
      adaptiveChanges: session.adaptiveAdjustments.length
    }
  }

  const analysis = getPerformanceAnalysis()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-green-900 to-emerald-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="text-white font-bold text-xl hover:text-teal-300 transition-colors">
              ← The Universal One School
            </Link>
            <div className="text-white font-bold text-xl">
              Adaptive Assessment Engine
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI-Powered Adaptive Assessment</h1>
          <p className="text-teal-200">Real-time difficulty adjustment based on performance and learning patterns</p>
        </div>

        {!session.isActive && session.answers.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Settings Panel */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Assessment Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">Subject</label>
                  <select 
                    value={assessmentSettings.subject}
                    onChange={(e) => setAssessmentSettings(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-teal-400"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">Grade Level</label>
                  <select 
                    value={assessmentSettings.gradeLevel}
                    onChange={(e) => setAssessmentSettings(prev => ({ ...prev, gradeLevel: e.target.value }))}
                    className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-teal-400"
                  >
                    {gradeLevels.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">Neurodivergent Support</label>
                  <div className="space-y-2">
                    {supportOptions.map(option => (
                      <label key={option} className="flex items-center text-white/80 text-sm">
                        <input
                          type="checkbox"
                          checked={assessmentSettings.neurodivergentSupport.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssessmentSettings(prev => ({
                                ...prev,
                                neurodivergentSupport: [...prev.neurodivergentSupport, option]
                              }))
                            } else {
                              setAssessmentSettings(prev => ({
                                ...prev,
                                neurodivergentSupport: prev.neurodivergentSupport.filter(s => s !== option)
                              }))
                            }
                          }}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-sm font-medium">Time Limit per Question (seconds)</label>
                  <input
                    type="number"
                    value={assessmentSettings.timeLimit}
                    onChange={(e) => setAssessmentSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    className="w-full p-2 rounded-lg bg-black/30 text-white border border-white/30 focus:border-teal-400"
                    min="15"
                    max="120"
                  />
                </div>
              </div>

              <button
                onClick={startAssessment}
                className="w-full mt-6 bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-teal-700 hover:to-emerald-700 transition-colors"
              >
                Start Adaptive Assessment
              </button>
            </div>

            {/* Features Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-lg mb-4">Adaptive Features</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-teal-300 font-medium">Real-time Difficulty Adjustment</h4>
                    <p className="text-white/70 text-sm">Questions adapt based on your performance and response time</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-emerald-300 font-medium">Neurodivergent Accommodations</h4>
                    <p className="text-white/70 text-sm">Built-in support for ADHD, dyslexia, and autism needs</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-green-300 font-medium">Learning Analytics</h4>
                    <p className="text-white/70 text-sm">Detailed insights into learning patterns and progress</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-cyan-300 font-medium">Instant Feedback</h4>
                    <p className="text-white/70 text-sm">Immediate explanations and adaptive next steps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : session.isActive ? (
          /* Active Assessment */
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-xl">Question {session.questionIndex + 1} of {session.totalQuestions}</h3>
              <div className="text-white/70">
                Difficulty: {session.difficultyLevel}/10
              </div>
            </div>

            {session.currentQuestion && (
              <div className="space-y-6">
                <div className="bg-black/20 p-6 rounded-lg">
                  <h4 className="text-white text-lg mb-4">{session.currentQuestion.question}</h4>
                  
                  {session.currentQuestion.type === 'multiple-choice' && session.currentQuestion.options ? (
                    <div className="space-y-3">
                      {session.currentQuestion.options.map((option, index) => (
                        <label key={index} className="flex items-center p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors">
                          <input
                            type="radio"
                            name="answer"
                            value={option}
                            checked={selectedAnswer === option}
                            onChange={(e) => setSelectedAnswer(e.target.value)}
                            className="mr-3"
                          />
                          <span className="text-white">{option}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      placeholder="Enter your answer..."
                      className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/30 focus:border-teal-400 focus:outline-none"
                    />
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-white/60 text-sm">
                    Accommodations: {session.currentQuestion.adaptations.join(', ')}
                  </div>
                  <button
                    onClick={submitAnswer}
                    disabled={!selectedAnswer}
                    className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">Assessment Complete!</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-300">{analysis.accuracy}%</div>
                  <div className="text-white/70 text-sm">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-300">{analysis.averageTime}s</div>
                  <div className="text-white/70 text-sm">Avg Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">{analysis.finalDifficulty}/10</div>
                  <div className="text-white/70 text-sm">Final Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-300">{analysis.adaptiveChanges}</div>
                  <div className="text-white/70 text-sm">Adaptations</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setSession({
                    isActive: false,
                    currentQuestion: null,
                    questionIndex: 0,
                    totalQuestions: 10,
                    score: 0,
                    difficultyLevel: 5,
                    answers: [],
                    startTime: null,
                    adaptiveAdjustments: []
                  })}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                >
                  New Assessment
                </button>
                <Link 
                  href="/ai-analytics"
                  className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  View Detailed Analytics
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}