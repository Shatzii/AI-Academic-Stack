import React from 'react'

const RecommendationCard = ({ recommendation }) => {
  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'review':
        return '🔄'
      case 'practice':
        return '📝'
      case 'advance':
        return '⬆️'
      case 'exploration':
        return '🗺️'
      default:
        return '💡'
    }
  }

  const getRecommendationColor = (type) => {
    switch (type) {
      case 'review':
        return 'review'
      case 'practice':
        return 'practice'
      case 'advance':
        return 'advance'
      case 'exploration':
        return 'exploration'
      default:
        return 'default'
    }
  }

  return (
    <div className={`recommendation-card ${getRecommendationColor(recommendation.type)}`}>
      <div className="recommendation-header">
        <div className="recommendation-icon">
          {getRecommendationIcon(recommendation.type)}
        </div>
        <div className="recommendation-type">
          {recommendation.type.charAt(0).toUpperCase() + recommendation.type.slice(1)}
        </div>
      </div>

      <div className="recommendation-content">
        <h4>{recommendation.subject}</h4>
        <h3>{recommendation.topic}</h3>
        <p className="recommendation-reason">{recommendation.reason}</p>
      </div>

      <div className="recommendation-actions">
        <button className="btn-primary">
          Start Learning
        </button>
        <button className="btn-secondary">
          View Details
        </button>
      </div>
    </div>
  )
}

export default RecommendationCard
