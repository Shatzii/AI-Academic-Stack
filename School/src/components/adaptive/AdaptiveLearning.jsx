import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLearningProfile } from '../../slices/adaptiveSlice'
import { useAuth } from '../../context/AuthContext.jsx'
import LearningDashboard from './LearningDashboard'
import StudyPlanner from './StudyPlanner'
import PerformanceTracker from './PerformanceTracker'
import LearningGoals from './LearningGoals'
import './AdaptiveLearning.css'

const AdaptiveLearning = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { profile, loading, error } = useSelector(state => state.adaptive)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    if (user) {
      dispatch(fetchLearningProfile())
    }
  }, [dispatch, user])

  const tabs = [
    { id: 'dashboard', label: 'Learning Dashboard', icon: '📊' },
    { id: 'planner', label: 'Study Planner', icon: '📅' },
    { id: 'performance', label: 'Performance', icon: '📈' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <LearningDashboard />
      case 'planner':
        return <StudyPlanner />
      case 'performance':
        return <PerformanceTracker />
      case 'goals':
        return <LearningGoals />
      default:
        return <LearningDashboard />
    }
  }

  if (loading) {
    return (
      <div className="adaptive-learning-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your personalized learning experience...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="adaptive-learning-container">
        <div className="error-message">
          <h3>Unable to load learning profile</h3>
          <p>{error}</p>
          <button onClick={() => dispatch(fetchLearningProfile())}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="adaptive-learning-container">
      <div className="adaptive-header">
        <h1>🎓 Adaptive Learning</h1>
        <p>Your personalized learning journey powered by AI</p>
      </div>

      <div className="adaptive-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="adaptive-content">
        {renderContent()}
      </div>

      {/* Learning Profile Summary */}
      {profile && (
        <div className="profile-summary">
          <h3>Your Learning Profile</h3>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-label">Learning Style:</span>
              <span className="stat-value">{profile.learning_style}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Difficulty:</span>
              <span className="stat-value">{profile.difficulty_preference}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Learning Pace:</span>
              <span className="stat-value">{profile.learning_pace}x</span>
            </div>
            {profile.strengths && profile.strengths.length > 0 && (
              <div className="stat-item">
                <span className="stat-label">Strengths:</span>
                <span className="stat-value">{profile.strengths.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdaptiveLearning
