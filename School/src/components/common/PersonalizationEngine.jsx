import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const PersonalizationEngine = () => {
  const { user } = useAuth()
  const dispatch = useDispatch()

  const [recommendations, setRecommendations] = useState([])
  const [learningPath, setLearningPath] = useState([])
  const [preferences, setPreferences] = useState({
    learningStyle: 'visual', // 'visual', 'auditory', 'kinesthetic', 'reading'
    pace: 'moderate', // 'slow', 'moderate', 'fast'
    difficulty: 'intermediate', // 'beginner', 'intermediate', 'advanced'
    subjects: [],
    goals: [],
    timeCommitment: 5 // hours per week
  })
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('recommendations')

  useEffect(() => {
    loadUserPreferences()
    generateRecommendations()
    generateLearningPath()
  }, [])

  const loadUserPreferences = async () => {
    // Mock API call - in real app, this would load user's learning preferences
    const mockPreferences = {
      learningStyle: 'visual',
      pace: 'moderate',
      difficulty: 'intermediate',
      subjects: ['Mathematics', 'Computer Science', 'Physics'],
      goals: ['Complete degree', 'Learn programming', 'Improve problem-solving'],
      timeCommitment: 5
    }
    setPreferences(mockPreferences)
  }

  const generateRecommendations = async () => {
    setLoading(true)
    try {
      // Mock AI-powered recommendations based on user behavior and preferences
      const mockRecommendations = [
        {
          id: 1,
          title: 'Advanced Algorithms',
          subject: 'Computer Science',
          difficulty: 'Advanced',
          estimatedTime: '8 hours',
          rating: 4.8,
          reason: 'Based on your interest in data structures and strong performance in intermediate algorithms',
          matchScore: 95,
          prerequisites: ['Data Structures', 'Basic Algorithms']
        },
        {
          id: 2,
          title: 'Quantum Physics Fundamentals',
          subject: 'Physics',
          difficulty: 'Intermediate',
          estimatedTime: '12 hours',
          rating: 4.6,
          reason: 'Complements your mathematics courses and aligns with your goal to improve problem-solving',
          matchScore: 88,
          prerequisites: ['Calculus', 'Basic Physics']
        },
        {
          id: 3,
          title: 'Machine Learning with Python',
          subject: 'Computer Science',
          difficulty: 'Intermediate',
          estimatedTime: '15 hours',
          rating: 4.9,
          reason: 'High demand skill in your field with strong correlation to your programming interests',
          matchScore: 92,
          prerequisites: ['Python Programming', 'Statistics']
        },
        {
          id: 4,
          title: 'Linear Algebra Applications',
          subject: 'Mathematics',
          difficulty: 'Intermediate',
          estimatedTime: '10 hours',
          rating: 4.7,
          reason: 'Essential foundation for advanced computer science and physics courses',
          matchScore: 85,
          prerequisites: ['Basic Algebra']
        }
      ]
      setRecommendations(mockRecommendations)
    } catch (error) {
      toast.error('Failed to generate recommendations')
    } finally {
      setLoading(false)
    }
  }

  const generateLearningPath = async () => {
    try {
      // Mock personalized learning path
      const mockLearningPath = [
        {
          phase: 'Foundation',
          duration: '4 weeks',
          courses: [
            { title: 'Python Programming Basics', completed: true, progress: 100 },
            { title: 'Data Structures', completed: true, progress: 100 },
            { title: 'Basic Algorithms', completed: false, progress: 75 }
          ]
        },
        {
          phase: 'Intermediate',
          duration: '6 weeks',
          courses: [
            { title: 'Advanced Algorithms', completed: false, progress: 0 },
            { title: 'Machine Learning Fundamentals', completed: false, progress: 0 },
            { title: 'Database Design', completed: false, progress: 0 }
          ]
        },
        {
          phase: 'Advanced',
          duration: '8 weeks',
          courses: [
            { title: 'Deep Learning', completed: false, progress: 0 },
            { title: 'Computer Vision', completed: false, progress: 0 },
            { title: 'Natural Language Processing', completed: false, progress: 0 }
          ]
        }
      ]
      setLearningPath(mockLearningPath)
    } catch (error) {
      toast.error('Failed to generate learning path')
    }
  }

  const updatePreferences = async () => {
    setLoading(true)
    try {
      // Mock API call - in real app, this would save preferences
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Preferences updated successfully!')
      generateRecommendations()
      generateLearningPath()
    } catch (error) {
      toast.error('Failed to update preferences')
    } finally {
      setLoading(false)
    }
  }

  const enrollInCourse = async (courseId) => {
    try {
      // Mock API call - in real app, this would enroll user in course
      toast.success('Successfully enrolled in course!')
      generateRecommendations() // Refresh recommendations
    } catch (error) {
      toast.error('Failed to enroll in course')
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'success'
      case 'intermediate': return 'warning'
      case 'advanced': return 'danger'
      default: return 'secondary'
    }
  }

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'success'
    if (score >= 80) return 'warning'
    return 'secondary'
  }

  return (
    <div className="personalization-page">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h2 fw-bold text-primary mb-2">
              <i className="fas fa-brain me-2"></i>
              AI Learning Assistant
            </h1>
            <p className="text-muted">Personalized course recommendations and learning paths tailored just for you</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'recommendations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recommendations')}
                >
                  <i className="fas fa-star me-2"></i>
                  Recommendations
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'learning-path' ? 'active' : ''}`}
                  onClick={() => setActiveTab('learning-path')}
                >
                  <i className="fas fa-road me-2"></i>
                  Learning Path
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'preferences' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preferences')}
                >
                  <i className="fas fa-cog me-2"></i>
                  Preferences
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-lightbulb me-2"></i>
                    AI-Powered Course Recommendations
                  </h5>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div className="text-center py-4">
                      <i className="fas fa-spinner fa-spin fa-2x text-primary mb-3"></i>
                      <p>Analyzing your learning patterns...</p>
                    </div>
                  ) : (
                    <div className="row">
                      {recommendations.map((rec) => (
                        <div key={rec.id} className="col-lg-6 mb-4">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="card-title">{rec.title}</h6>
                                <span className={`badge bg-${getMatchScoreColor(rec.matchScore)}`}>
                                  {rec.matchScore}% match
                                </span>
                              </div>

                              <div className="mb-2">
                                <small className="text-muted">
                                  <i className="fas fa-book me-1"></i>
                                  {rec.subject} •
                                  <span className={`badge bg-${getDifficultyColor(rec.difficulty)} ms-1`}>
                                    {rec.difficulty}
                                  </span>
                                </small>
                              </div>

                              <div className="mb-2">
                                <small className="text-muted">
                                  <i className="fas fa-clock me-1"></i>
                                  {rec.estimatedTime} •
                                  <i className="fas fa-star text-warning me-1"></i>
                                  {rec.rating}
                                </small>
                              </div>

                              <p className="card-text small mb-3">{rec.reason}</p>

                              {rec.prerequisites.length > 0 && (
                                <div className="mb-3">
                                  <small className="text-muted">
                                    <strong>Prerequisites:</strong> {rec.prerequisites.join(', ')}
                                  </small>
                                </div>
                              )}

                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => enrollInCourse(rec.id)}
                              >
                                <i className="fas fa-plus me-2"></i>
                                Enroll Now
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Path Tab */}
        {activeTab === 'learning-path' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-route me-2"></i>
                    Your Personalized Learning Path
                  </h5>
                </div>
                <div className="card-body">
                  <div className="timeline">
                    {learningPath.map((phase, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-marker">
                          <i className="fas fa-graduation-cap"></i>
                        </div>
                        <div className="timeline-content">
                          <h6 className="timeline-title">
                            {phase.phase}
                            <span className="badge bg-primary ms-2">{phase.duration}</span>
                          </h6>
                          <div className="timeline-courses">
                            {phase.courses.map((course, courseIndex) => (
                              <div key={courseIndex} className="course-item">
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className={course.completed ? 'text-decoration-line-through text-muted' : ''}>
                                    {course.title}
                                  </span>
                                  <div className="d-flex align-items-center">
                                    {course.completed ? (
                                      <i className="fas fa-check-circle text-success me-2"></i>
                                    ) : (
                                      <div className="progress me-2" style={{width: '60px'}}>
                                        <div
                                          className="progress-bar"
                                          style={{width: `${course.progress}%`}}
                                        ></div>
                                      </div>
                                    )}
                                    <small className="text-muted">{course.progress}%</small>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="row">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-sliders-h me-2"></i>
                    Learning Preferences
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Learning Style</label>
                        <select
                          className="form-select"
                          value={preferences.learningStyle}
                          onChange={(e) => setPreferences(prev => ({...prev, learningStyle: e.target.value}))}
                        >
                          <option value="visual">Visual (diagrams, videos)</option>
                          <option value="auditory">Auditory (lectures, discussions)</option>
                          <option value="kinesthetic">Kinesthetic (hands-on, projects)</option>
                          <option value="reading">Reading/Writing (textbooks, notes)</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Preferred Pace</label>
                        <select
                          className="form-select"
                          value={preferences.pace}
                          onChange={(e) => setPreferences(prev => ({...prev, pace: e.target.value}))}
                        >
                          <option value="slow">Slow (thorough understanding)</option>
                          <option value="moderate">Moderate (balanced pace)</option>
                          <option value="fast">Fast (quick progression)</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Difficulty Level</label>
                        <select
                          className="form-select"
                          value={preferences.difficulty}
                          onChange={(e) => setPreferences(prev => ({...prev, difficulty: e.target.value}))}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Time Commitment (hours/week)</label>
                        <input
                          type="range"
                          className="form-range"
                          min="1"
                          max="20"
                          value={preferences.timeCommitment}
                          onChange={(e) => setPreferences(prev => ({...prev, timeCommitment: parseInt(e.target.value)}))}
                        />
                        <div className="d-flex justify-content-between">
                          <small className="text-muted">1h</small>
                          <strong>{preferences.timeCommitment}h</strong>
                          <small className="text-muted">20h</small>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Preferred Subjects</label>
                        <div className="subject-tags">
                          {['Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Biology', 'English', 'History'].map((subject) => (
                            <div
                              key={subject}
                              className={`subject-tag ${preferences.subjects.includes(subject) ? 'active' : ''}`}
                              onClick={() => {
                                setPreferences(prev => ({
                                  ...prev,
                                  subjects: prev.subjects.includes(subject)
                                    ? prev.subjects.filter(s => s !== subject)
                                    : [...prev.subjects, subject]
                                }))
                              }}
                            >
                              {subject}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={updatePreferences}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Update Preferences
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    How It Works
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <h6>AI-Powered Analysis</h6>
                    <p className="small text-muted">
                      Our AI analyzes your learning patterns, performance, and preferences to provide personalized recommendations.
                    </p>
                  </div>

                  <div className="mb-3">
                    <h6>Adaptive Learning Paths</h6>
                    <p className="small text-muted">
                      Learning paths adjust based on your progress, helping you build knowledge systematically.
                    </p>
                  </div>

                  <div className="mb-3">
                    <h6>Continuous Improvement</h6>
                    <p className="small text-muted">
                      The system learns from your interactions to provide better recommendations over time.
                    </p>
                  </div>

                  <div className="alert alert-info">
                    <i className="fas fa-lightbulb me-2"></i>
                    <strong>Tip:</strong> Update your preferences regularly to get the most accurate recommendations.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 30px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e9ecef;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 30px;
        }

        .timeline-marker {
          position: absolute;
          left: -22px;
          top: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .timeline-content {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
        }

        .timeline-courses {
          margin-top: 10px;
        }

        .course-item {
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .course-item:last-child {
          border-bottom: none;
        }

        .subject-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .subject-tag {
          padding: 5px 10px;
          background: #e9ecef;
          border-radius: 15px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .subject-tag:hover {
          background: #dee2e6;
        }

        .subject-tag.active {
          background: #007bff;
          color: white;
        }
      `}</style>
    </div>
  )
}

export default PersonalizationEngine
