'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Brain, 
  Target, 
  Star,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw
} from 'lucide-react'

interface Question {
  id: string
  type: 'multiple_choice' | 'short_answer' | 'drag_drop' | 'matching'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  subject: string
  adaptiveLevel: number
}

interface AssessmentResult {
  questionId: string
  userAnswer: string | string[]
  isCorrect: boolean
  timeSpent: number
  hintsUsed: number
}

export default function RealTimeAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState<string>('')
  const [results, setResults] = useState<AssessmentResult[]>([])
  const [timeSpent, setTimeSpent] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  const sampleQuestions: Question[] = [
    {
      id: 'q1',
      type: 'multiple_choice',
      question: 'What is the primary function of the heart in the human body?',
      options: [
        'To digest food',
        'To pump blood throughout the body',
        'To filter air for breathing',
        'To produce hormones'
      ],
      correctAnswer: 'To pump blood throughout the body',
      explanation: 'The heart is a muscular organ that pumps blood through the circulatory system, delivering oxygen and nutrients to all parts of the body.',
      difficulty: 'easy',
      subject: 'Science',
      adaptiveLevel: 1
    },
    {
      id: 'q2',
      type: 'short_answer',
      question: 'Explain the difference between renewable and non-renewable energy sources. Give one example of each.',
      options: [],
      correctAnswer: 'Renewable energy sources can be replenished naturally (like solar, wind). Non-renewable sources are finite (like coal, oil).',
      explanation: 'Renewable energy sources naturally replenish themselves and include solar, wind, hydroelectric, and geothermal energy. Non-renewable sources like fossil fuels take millions of years to form and will eventually be depleted.',
      difficulty: 'medium',
      subject: 'Science',
      adaptiveLevel: 2
    },
    {
      id: 'q3',
      type: 'multiple_choice',
      question: 'In Shakespeare\'s "Romeo and Juliet," what literary device is primarily used in the famous balcony scene?',
      options: [
        'Metaphor',
        'Dramatic irony',
        'Alliteration',
        'Onomatopoeia'
      ],
      correctAnswer: 'Dramatic irony',
      explanation: 'Dramatic irony occurs when the audience knows something the characters don\'t. In the balcony scene, we know both lovers are present, but they initially don\'t know the other is there.',
      difficulty: 'hard',
      subject: 'Literature',
      adaptiveLevel: 3
    }
  ]

  useEffect(() => {
    if (sampleQuestions.length > 0 && !currentQuestion) {
      setCurrentQuestion(sampleQuestions[0])
      setStartTime(new Date())
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (startTime && !isComplete) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [startTime, isComplete])

  const submitAnswer = () => {
    if (!currentQuestion || !userAnswer.trim()) return

    const isCorrect = checkAnswer(currentQuestion, userAnswer)
    const questionTime = timeSpent

    const result: AssessmentResult = {
      questionId: currentQuestion.id,
      userAnswer: userAnswer,
      isCorrect,
      timeSpent: questionTime,
      hintsUsed
    }

    setResults(prev => [...prev, result])
    setShowFeedback(true)

    // Reset for next question
    setTimeout(() => {
      nextQuestion()
    }, 3000)
  }

  const checkAnswer = (question: Question, answer: string): boolean => {
    if (question.type === 'multiple_choice') {
      return answer === question.correctAnswer
    } else if (question.type === 'short_answer') {
      // Simple keyword matching for demo - in real implementation use AI scoring
      const keywords = ['renewable', 'non-renewable', 'solar', 'wind', 'coal', 'oil']
      const answerLower = answer.toLowerCase()
      return keywords.some(keyword => answerLower.includes(keyword))
    }
    return false
  }

  const nextQuestion = () => {
    if (questionIndex + 1 < sampleQuestions.length) {
      setQuestionIndex(prev => prev + 1)
      setCurrentQuestion(sampleQuestions[questionIndex + 1])
      setUserAnswer('')
      setShowFeedback(false)
      setHintsUsed(0)
      setStartTime(new Date())
    } else {
      setIsComplete(true)
    }
  }

  const useHint = () => {
    setHintsUsed(prev => prev + 1)
    // In real implementation, show contextual hints
    alert('Hint: Consider the key terms in the question and think about what you\'ve learned in class.')
  }

  const restartAssessment = () => {
    setQuestionIndex(0)
    setCurrentQuestion(sampleQuestions[0])
    setUserAnswer('')
    setResults([])
    setTimeSpent(0)
    setShowFeedback(false)
    setHintsUsed(0)
    setIsComplete(false)
    setStartTime(new Date())
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const calculateScore = () => {
    const correct = results.filter(r => r.isCorrect).length
    return Math.round((correct / results.length) * 100)
  }

  const getPerformanceInsights = () => {
    if (results.length === 0) return []

    const avgTime = results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length
    const totalHints = results.reduce((sum, r) => sum + r.hintsUsed, 0)
    
    const insights = []
    
    if (avgTime > 120) {
      insights.push('Consider practicing time management techniques')
    }
    if (totalHints > 2) {
      insights.push('Review foundational concepts before the next assessment')
    }
    if (calculateScore() > 80) {
      insights.push('Excellent performance! Ready for more challenging material')
    }
    
    return insights
  }

  if (isComplete) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-6 w-6 text-yellow-500" />
            <span>Assessment Complete!</span>
          </CardTitle>
          <CardDescription>Your adaptive assessment results and personalized feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Overview */}
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <Card>
              <CardContent className="p-4">
                <div className="text-3xl font-bold text-green-600">{calculateScore()}%</div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-3xl font-bold text-blue-600">{formatTime(timeSpent)}</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-3xl font-bold text-purple-600">
                  {results.filter(r => r.isCorrect).length}/{results.length}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Question Breakdown</h3>
            {results.map((result, index) => {
              const question = sampleQuestions.find(q => q.id === result.questionId)
              return (
                <Card key={result.questionId} className={`border-l-4 ${result.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {result.isCorrect ? 
                            <CheckCircle className="h-5 w-5 text-green-600" /> : 
                            <XCircle className="h-5 w-5 text-red-600" />
                          }
                          <span className="font-medium">Question {index + 1}</span>
                          <Badge variant="outline">{question?.difficulty}</Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{question?.question}</p>
                        <div className="text-sm">
                          <div className="mb-1">
                            <span className="font-medium">Your answer: </span>
                            <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>
                              {result.userAnswer}
                            </span>
                          </div>
                          {!result.isCorrect && (
                            <div className="mb-1">
                              <span className="font-medium">Correct answer: </span>
                              <span className="text-green-600">{question?.correctAnswer}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{formatTime(result.timeSpent)}</div>
                        {result.hintsUsed > 0 && <div>{result.hintsUsed} hints used</div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Performance Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {getPerformanceInsights().map((insight, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{insight}</span>
                  </div>
                ))}
                {getPerformanceInsights().length === 0 && (
                  <p className="text-sm text-gray-600">Great job! Your performance shows good understanding of the material.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={restartAssessment} className="flex items-center space-x-2">
              <RotateCcw className="h-4 w-4" />
              <span>Take Another Assessment</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-blue-600" />
            <span>Adaptive Assessment</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{formatTime(timeSpent)}</span>
            </div>
            <Badge variant="outline">
              {questionIndex + 1} / {sampleQuestions.length}
            </Badge>
          </div>
        </div>
        <Progress value={((questionIndex + 1) / sampleQuestions.length) * 100} className="w-full" />
      </CardHeader>

      <CardContent className="space-y-6">
        {!showFeedback ? (
          <>
            {/* Question */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{currentQuestion.subject}</Badge>
                  <Badge variant="secondary">{currentQuestion.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
                
                {currentQuestion.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {currentQuestion.options?.map((option, index) => (
                      <Button
                        key={index}
                        variant={userAnswer === option ? 'default' : 'outline'}
                        className="w-full text-left justify-start h-auto p-4"
                        onClick={() => setUserAnswer(option)}
                      >
                        <span className="mr-3 w-6 h-6 rounded-full border flex items-center justify-center text-sm">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'short_answer' && (
                  <Textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full min-h-24"
                  />
                )}
              </CardContent>
            </Card>

            {/* Controls */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={useHint} disabled={hintsUsed >= 2}>
                <Lightbulb className="h-4 w-4 mr-2" />
                Hint ({2 - hintsUsed} left)
              </Button>
              
              <Button 
                onClick={submitAnswer} 
                disabled={!userAnswer.trim()}
                className="flex items-center space-x-2"
              >
                <span>Submit Answer</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <Card className={`border-l-4 ${results[results.length - 1]?.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                {results[results.length - 1]?.isCorrect ? (
                  <>
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="text-lg font-semibold text-green-600">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-6 w-6 text-red-600" />
                    <span className="text-lg font-semibold text-red-600">Not quite right</span>
                  </>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Your answer: </span>
                  <span className={results[results.length - 1]?.isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {userAnswer}
                  </span>
                </div>
                
                {!results[results.length - 1]?.isCorrect && (
                  <div>
                    <span className="font-medium">Correct answer: </span>
                    <span className="text-green-600">{currentQuestion.correctAnswer}</span>
                  </div>
                )}
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <span className="font-medium text-blue-800">Explanation: </span>
                      <span className="text-blue-700">{currentQuestion.explanation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}