import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import axios from 'axios'

const AdaptivePracticeRecommendations = () => {
  const { user } = useAuth()
  const [practiceSet, setPracticeSet] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sessionActive, setSessionActive] = useState(false)
  const [stats, setStats] = useState({
    streak: 7,
    questionsToday: 12,
    accuracy: 85,
    nextReview: '2 hours'
  })

  useEffect(() => {
    generatePracticeSet()
  }, [])

  const generatePracticeSet = async () => {
    setLoading(true)
    try {
      // Mock spaced repetition algorithm
      const mockPracticeSet = [
        {
          id: 1,
          question: 'Solve for x: 2x + 5 = 13',
          subject: 'Mathematics',
          topic: 'Linear Equations',
          difficulty: 'easy',
          dueDate: new Date(),
          repetitionLevel: 3,
          lastAttempted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          priority: 'high',
          options: ['x = 4', 'x = 8', 'x = 6', 'x = 9'],
          correctAnswer: 0,
          explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4'
        },
        {
          id: 2,
          question: 'What is the powerhouse of the cell?',
          subject: 'Biology',
          topic: 'Cell Biology',
          difficulty: 'easy',
          dueDate: new Date(),
          repetitionLevel: 5,
          lastAttempted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          priority: 'medium',
          options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi Apparatus'],
          correctAnswer: 1,
          explanation: 'Mitochondria produce ATP through cellular respiration'
        },
        {
          id: 3,
          question: 'Factor: x² - 9',
          subject: 'Mathematics',
          topic: 'Factoring',
          difficulty: 'medium',
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          repetitionLevel: 2,
          lastAttempted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          priority: 'high',
          options: ['(x-3)(x+3)', '(x-9)(x+1)', '(x-3)(x-3)', 'Cannot be factored'],
          correctAnswer: 0,
          explanation: 'This is a difference of squares: a² - b² = (a-b)(a+b)'
        }
      ]

      setPracticeSet(mockPracticeSet)
    } catch (error) {
      console.error('Error generating practice set:', error)
    } finally {
      setLoading(false)
    }
  }

  const startPractice = (question) => {
    setCurrentQuestion(question)
    setSessionActive(true)
  }

  const submitAnswer = (answerIndex) => {
    // Handle answer submission and update spaced repetition schedule
    console.log('Answer submitted:', answerIndex)
    setSessionActive(false)
    setCurrentQuestion(null)
    generatePracticeSet()
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success'
      case 'medium':
        return 'warning'
      case 'hard':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getDueStatus = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffHours = (due - now) / (1000 * 60 * 60)

    if (diffHours < 0) return { text: 'Overdue', color: 'danger' }
    if (diffHours < 24) return { text: 'Due Today', color: 'warning' }
    return { text: 'Upcoming', color: 'info' }
  }

  if (loading) {
    return (
      <div className="adaptive-practice">
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading practice questions...</span>
          </div>
          <p>Generating personalized practice set...</p>
        </div>
      </div>
    )
  }

  if (sessionActive && currentQuestion) {
    return (
      <div className="practice-session">
        <div className="session-header">
          <button className="btn btn-outline-secondary" onClick={() => setSessionActive(false)}>
            <i className="fas fa-arrow-left me-2"></i>Back to Queue
          </button>
          <div className="question-meta">
            <span className="subject-badge">{currentQuestion.subject}</span>
            <span className={`difficulty-badge badge bg-${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty}
            </span>
          </div>
        </div>

        <div className="question-card">
          <div className="question-header">
            <h3>Question #{currentQuestion.id}</h3>
            <span className="topic">{currentQuestion.topic}</span>
          </div>

          <div className="question-text">
            {currentQuestion.question}
          </div>

          <div className="options-list">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                className="option-btn"
                onClick={() => submitAnswer(idx)}
              >
                <span className="option-label">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          <div className="question-info">
            <div className="info-item">
              <i className="fas fa-redo me-2"></i>
              <span>Repetition #{currentQuestion.repetitionLevel}</span>
            </div>
            <div className="info-item">
              <i className="fas fa-clock me-2"></i>
              <span>Last attempted: {new Date(currentQuestion.lastAttempted).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <style>{`
          .practice-session {
            padding: 20px;
            max-width: 900px;
            margin: 0 auto;
          }

          .session-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }

          .question-meta {
            display: flex;
            gap: 10px;
          }

          .question-card {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .question-header {
            margin-bottom: 30px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 15px;
          }

          .question-header h3 {
            margin: 0 0 5px 0;
            color: #2c3e50;
          }

          .topic {
            color: #666;
            font-size: 0.95rem;
          }

          .question-text {
            font-size: 1.3rem;
            color: #2c3e50;
            margin-bottom: 30px;
            line-height: 1.6;
          }

          .options-list {
            display: grid;
            gap: 15px;
            margin-bottom: 30px;
          }

          .option-btn {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 20px;
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
            text-align: left;
          }

          .option-btn:hover {
            border-color: #007bff;
            background: #f8f9fa;
            transform: translateX(5px);
          }

          .option-label {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background: #007bff;
            color: white;
            border-radius: 50%;
            font-weight: 700;
            font-size: 1.1rem;
          }

          .option-text {
            flex: 1;
            font-size: 1.1rem;
            color: #2c3e50;
          }

          .question-info {
            display: flex;
            gap: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
          }

          .info-item {
            display: flex;
            align-items: center;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="adaptive-practice">
      <div className="header">
        <h2>
          <i className="fas fa-brain me-2"></i>
          Adaptive Practice
        </h2>
        <p className="subtitle">Spaced repetition powered by AI for optimal retention</p>
      </div>

      {/* Stats Dashboard */}
      <div className="stats-grid">
        <div className="stat-card">
          <i className="fas fa-fire icon"></i>
          <div>
            <div className="stat-value">{stats.streak} days</div>
            <div className="stat-label">Current Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-check-circle icon"></i>
          <div>
            <div className="stat-value">{stats.questionsToday}</div>
            <div className="stat-label">Questions Today</div>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-chart-line icon"></i>
          <div>
            <div className="stat-value">{stats.accuracy}%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
        </div>
        <div className="stat-card">
          <i className="fas fa-clock icon"></i>
          <div>
            <div className="stat-value">{stats.nextReview}</div>
            <div className="stat-label">Next Review</div>
          </div>
        </div>
      </div>

      {/* Practice Queue */}
      <div className="queue-section">
        <div className="queue-header">
          <h3>
            <i className="fas fa-list-check me-2"></i>
            Your Practice Queue ({practiceSet.length})
          </h3>
          <button className="btn btn-primary" onClick={() => startPractice(practiceSet[0])}>
            <i className="fas fa-play me-2"></i>
            Start Practice Session
          </button>
        </div>

        <div className="practice-list">
          {practiceSet.map((item) => {
            const dueStatus = getDueStatus(item.dueDate)
            return (
              <div key={item.id} className="practice-card">
                <div className="card-header">
                  <div>
                    <h4>{item.topic}</h4>
                    <p className="subject">{item.subject}</p>
                  </div>
                  <div className="card-badges">
                    <span className={`badge bg-${dueStatus.color}`}>{dueStatus.text}</span>
                    <span className={`badge bg-${getDifficultyColor(item.difficulty)}`}>
                      {item.difficulty}
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="question-preview">{item.question}</div>
                  
                  <div className="card-meta">
                    <div className="meta-item">
                      <i className="fas fa-redo"></i>
                      <span>Rep. #{item.repetitionLevel}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-exclamation-circle"></i>
                      <span>{item.priority} priority</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-calendar"></i>
                      <span>Last: {new Date(item.lastAttempted).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <button className="btn btn-outline-primary w-100" onClick={() => startPractice(item)}>
                  Practice Now
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Algorithm Info */}
      <div className="info-section">
        <h3>How Spaced Repetition Works</h3>
        <div className="info-grid">
          <div className="info-card">
            <i className="fas fa-1 number"></i>
            <h4>Review at optimal intervals</h4>
            <p>Questions appear just before you're likely to forget them</p>
          </div>
          <div className="info-card">
            <i className="fas fa-2 number"></i>
            <h4>Focus on weak areas</h4>
            <p>More practice on topics where you struggle</p>
          </div>
          <div className="info-card">
            <i className="fas fa-3 number"></i>
            <h4>Gradually increase difficulty</h4>
            <p>Build confidence before advancing to harder questions</p>
          </div>
          <div className="info-card">
            <i className="fas fa-4 number"></i>
            <h4>Mixed review for retention</h4>
            <p>Interleave different topics to strengthen connections</p>
          </div>
        </div>
      </div>

      <style>{`
        .adaptive-practice {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 30px;
        }

        .header h2 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #666;
          font-size: 1.1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .stat-card .icon {
          font-size: 3rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .queue-section {
          margin-bottom: 40px;
        }

        .queue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .queue-header h3 {
          color: #2c3e50;
          margin: 0;
        }

        .practice-list {
          display: grid;
          gap: 20px;
        }

        .practice-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .card-header h4 {
          margin: 0 0 5px 0;
          color: #2c3e50;
        }

        .card-header .subject {
          color: #666;
          margin: 0;
        }

        .card-badges {
          display: flex;
          gap: 8px;
        }

        .question-preview {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
          color: #2c3e50;
        }

        .card-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
          font-size: 0.9rem;
          color: #666;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .info-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .info-section h3 {
          color: #2c3e50;
          margin-bottom: 25px;
          text-align: center;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .info-card {
          text-align: center;
          padding: 20px;
        }

        .info-card .number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background: #007bff;
          color: white;
          border-radius: 50%;
          font-size: 1.5rem;
          margin-bottom: 15px;
        }

        .info-card h4 {
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 1.1rem;
        }

        .info-card p {
          color: #666;
          margin: 0;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        @media (max-width: 768px) {
          .queue-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .card-header {
            flex-direction: column;
          }

          .card-meta {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  )
}

export default AdaptivePracticeRecommendations
