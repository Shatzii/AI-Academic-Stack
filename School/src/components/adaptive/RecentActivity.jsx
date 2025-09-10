import React from 'react'

const RecentActivity = ({ metrics }) => {
  // Sort metrics by last practiced date
  const recentMetrics = metrics
    .filter(metric => metric.last_practiced)
    .sort((a, b) => new Date(b.last_practiced) - new Date(a.last_practiced))
    .slice(0, 5) // Show only 5 most recent

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const getActivityIcon = (accuracy) => {
    if (accuracy >= 0.8) return '🎉'
    if (accuracy >= 0.6) return '👍'
    if (accuracy >= 0.4) return '🤔'
    return '📚'
  }

  const getActivityMessage = (metric) => {
    const accuracy = metric.accuracy_rate
    if (accuracy >= 0.8) return 'Excellent performance!'
    if (accuracy >= 0.6) return 'Good work!'
    if (accuracy >= 0.4) return 'Keep practicing!'
    return 'Focus on this topic'
  }

  return (
    <div className="recent-activity">
      {recentMetrics.length > 0 ? (
        <div className="activity-list">
          {recentMetrics.map((metric, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                {getActivityIcon(metric.accuracy_rate)}
              </div>

              <div className="activity-content">
                <div className="activity-header">
                  <h4>{metric.subject} - {metric.topic}</h4>
                  <span className="activity-date">
                    {formatDate(metric.last_practiced)}
                  </span>
                </div>

                <div className="activity-stats">
                  <span className="accuracy">
                    {Math.round(metric.accuracy_rate * 100)}% accuracy
                  </span>
                  <span className="questions">
                    {metric.total_questions} questions
                  </span>
                </div>

                <p className="activity-message">
                  {getActivityMessage(metric)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-activity">
          <p>No recent activity. Start practicing to see your progress!</p>
        </div>
      )}
    </div>
  )
}

export default RecentActivity
