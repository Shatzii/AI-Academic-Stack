import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchPerformanceMetrics,
  getRecommendation,
  fetchLearningGoals
} from '../../slices/adaptiveSlice'
import { useAuth } from '../../context/AuthContext.jsx'
import RecommendationCard from './RecommendationCard'
import ProgressOverview from './ProgressOverview'
import QuickStats from './QuickStats'
import RecentActivity from './RecentActivity'

const LearningDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const {
    metrics,
    recommendation,
    goals,
    loading
  } = useSelector(state => state.adaptive)

  const [dashboardData, setDashboardData] = useState({
    totalStudyTime: 0,
    averageAccuracy: 0,
    topicsMastered: 0,
    currentStreak: 0
  })

  useEffect(() => {
    dispatch(fetchPerformanceMetrics())
    dispatch(getRecommendation())
    dispatch(fetchLearningGoals())
  }, [dispatch])

  useEffect(() => {
    if (metrics.length > 0) {
      calculateDashboardStats()
    }
  }, [metrics])

  const calculateDashboardStats = () => {
    const totalQuestions = metrics.reduce((sum, metric) => sum + metric.total_questions, 0)
    const totalCorrect = metrics.reduce((sum, metric) => sum + metric.correct_answers, 0)
    const averageAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0

    const topicsMastered = metrics.filter(metric => metric.mastery_level >= 0.8).length
    const currentStreak = calculateStreak()

    setDashboardData({
      totalStudyTime: 0, // This would come from study sessions
      averageAccuracy: Math.round(averageAccuracy),
      topicsMastered,
      currentStreak
    })
  }

  const calculateStreak = () => {
    // Simple streak calculation - in a real app, this would be more sophisticated
    const recentMetrics = metrics
      .filter(metric => metric.last_practiced)
      .sort((a, b) => new Date(b.last_practiced) - new Date(a.last_practiced))
      .slice(0, 7) // Last 7 days

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)

      const hasActivity = recentMetrics.some(metric => {
        const metricDate = new Date(metric.last_practiced)
        metricDate.setHours(0, 0, 0, 0)
        return metricDate.getTime() === checkDate.getTime()
      })

      if (hasActivity) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your learning dashboard...</p>
      </div>
    )
  }

  return (
    <div className="learning-dashboard">
      <div className="dashboard-header">
        <h2>📊 Your Learning Dashboard</h2>
        <p>Welcome back, {user?.username}! Here's your personalized learning overview.</p>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={dashboardData} />

      <div className="dashboard-grid">
        {/* Recommendation Card */}
        <div className="dashboard-section recommendation-section">
          <h3>🎯 Next Recommendation</h3>
          {recommendation ? (
            <RecommendationCard recommendation={recommendation} />
          ) : (
            <div className="no-recommendation">
              <p>Complete some practice questions to get personalized recommendations!</p>
            </div>
          )}
        </div>

        {/* Progress Overview */}
        <div className="dashboard-section progress-section">
          <h3>📈 Progress Overview</h3>
          <ProgressOverview metrics={metrics} goals={goals} />
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section activity-section">
          <h3>🔥 Recent Activity</h3>
          <RecentActivity metrics={metrics} />
        </div>

        {/* Learning Goals Preview */}
        <div className="dashboard-section goals-preview">
          <h3>🎯 Active Goals</h3>
          {goals.length > 0 ? (
            <div className="goals-list">
              {goals.slice(0, 3).map(goal => (
                <div key={goal.id} className="goal-item">
                  <div className="goal-header">
                    <h4>{goal.title}</h4>
                    <span className={`goal-status ${goal.is_completed ? 'completed' : 'active'}`}>
                      {goal.is_completed ? '✅ Completed' : '🔄 Active'}
                    </span>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${goal.current_progress * 100}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {Math.round(goal.current_progress * 100)}%
                    </span>
                  </div>
                  <p className="goal-subject">{goal.subject}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-goals">
              <p>No active goals. Set some learning goals to track your progress!</p>
            </div>
          )}
        </div>
      </div>

      {/* Motivational Message */}
      <div className="motivational-banner">
        <div className="banner-content">
          <h3>🚀 Keep Learning!</h3>
          <p>
            {dashboardData.currentStreak > 0
              ? `You're on a ${dashboardData.currentStreak}-day learning streak! Keep it up!`
              : "Start your learning journey today and build a consistent study habit!"
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default LearningDashboard
