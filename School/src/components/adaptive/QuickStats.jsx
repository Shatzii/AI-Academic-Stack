const QuickStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Study Streak',
      value: `${stats.currentStreak} days`,
      icon: '🔥',
      color: 'streak'
    },
    {
      label: 'Average Accuracy',
      value: `${stats.averageAccuracy}%`,
      icon: '🎯',
      color: 'accuracy'
    },
    {
      label: 'Topics Mastered',
      value: stats.topicsMastered,
      icon: '🏆',
      color: 'mastered'
    },
    {
      label: 'Total Study Time',
      value: `${stats.totalStudyTime}h`,
      icon: '⏰',
      color: 'time'
    }
  ]

  return (
    <div className="quick-stats">
      {statItems.map((stat, index) => (
        <div key={index} className={`stat-card ${stat.color}`}>
          <div className="stat-icon">
            {stat.icon}
          </div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuickStats
