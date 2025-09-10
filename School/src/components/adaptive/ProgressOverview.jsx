import React from 'react'

const ProgressOverview = ({ metrics, goals }) => {
  // Calculate subject-wise progress
  const subjectProgress = metrics.reduce((acc, metric) => {
    if (!acc[metric.subject]) {
      acc[metric.subject] = {
        totalTopics: 0,
        masteredTopics: 0,
        averageAccuracy: 0,
        totalQuestions: 0,
        totalCorrect: 0
      }
    }

    acc[metric.subject].totalTopics += 1
    if (metric.mastery_level >= 0.8) {
      acc[metric.subject].masteredTopics += 1
    }
    acc[metric.subject].totalQuestions += metric.total_questions
    acc[metric.subject].totalCorrect += metric.correct_answers

    return acc
  }, {})

  // Calculate averages
  Object.keys(subjectProgress).forEach(subject => {
    const data = subjectProgress[subject]
    data.averageAccuracy = data.totalQuestions > 0
      ? (data.totalCorrect / data.totalQuestions) * 100
      : 0
  })

  const subjects = Object.entries(subjectProgress)

  return (
    <div className="progress-overview">
      {subjects.length > 0 ? (
        <div className="subjects-progress">
          {subjects.map(([subject, data]) => (
            <div key={subject} className="subject-progress-card">
              <div className="subject-header">
                <h4>{subject}</h4>
                <span className="accuracy-badge">
                  {Math.round(data.averageAccuracy)}% accuracy
                </span>
              </div>

              <div className="progress-metrics">
                <div className="metric">
                  <span className="metric-label">Topics Mastered</span>
                  <span className="metric-value">
                    {data.masteredTopics}/{data.totalTopics}
                  </span>
                </div>

                <div className="metric">
                  <span className="metric-label">Mastery Rate</span>
                  <span className="metric-value">
                    {Math.round((data.masteredTopics / data.totalTopics) * 100)}%
                  </span>
                </div>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(data.masteredTopics / data.totalTopics) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-progress">
          <p>Start practicing to see your progress here!</p>
        </div>
      )}

      {/* Goals Progress Summary */}
      {goals.length > 0 && (
        <div className="goals-summary">
          <h4>🎯 Goals Progress</h4>
          <div className="goals-stats">
            <div className="goal-stat">
              <span className="stat-number">{goals.filter(g => g.is_completed).length}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="goal-stat">
              <span className="stat-number">{goals.filter(g => !g.is_completed).length}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="goal-stat">
              <span className="stat-number">
                {goals.length > 0 ? Math.round(
                  goals.reduce((sum, goal) => sum + goal.current_progress, 0) / goals.length * 100
                ) : 0}%
              </span>
              <span className="stat-label">Avg Progress</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressOverview
