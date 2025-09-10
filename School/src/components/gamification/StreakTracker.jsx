import React from 'react';
import './StreakTracker.css';

const StreakTracker = ({ stats }) => {
  if (!stats) {
    return (
      <div className="streak-tracker">
        <p>Loading streak data...</p>
      </div>
    );
  }

  const { current_streak, longest_streak, last_activity_date } = stats;
  const streak = current_streak || 0;
  const longest = longest_streak || 0;

  const getStreakIcon = (days) => {
    if (days === 0) return '😴';
    if (days < 7) return '🔥';
    if (days < 30) return '🚀';
    if (days < 100) return '⭐';
    return '👑';
  };

  const getStreakMessage = (days) => {
    if (days === 0) return 'Start your learning streak today!';
    if (days === 1) return 'Great start! Keep it going!';
    if (days < 7) return 'You\'re on fire!';
    if (days < 30) return 'Amazing consistency!';
    if (days < 100) return 'You\'re a learning legend!';
    return 'Absolute mastery!';
  };

  const getStreakColor = (days) => {
    if (days === 0) return '#95a5a6';
    if (days < 7) return '#e74c3c';
    if (days < 30) return '#f39c12';
    if (days < 100) return '#27ae60';
    return '#9b59b6';
  };

  const isStreakActive = () => {
    if (!last_activity_date) return false;
    const lastActivity = new Date(last_activity_date);
    const today = new Date();
    const diffTime = Math.abs(today - lastActivity);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1; // Consider streak active if last activity was yesterday or today
  };

  const streakActive = isStreakActive();

  return (
    <div className="streak-tracker">
      <div className="streak-main">
        <div className="streak-icon" style={{ color: getStreakColor(streak) }}>
          {getStreakIcon(streak)}
        </div>
        <div className="streak-info">
          <div className="streak-number" style={{ color: getStreakColor(streak) }}>
            {streak}
          </div>
          <div className="streak-label">Day Streak</div>
          <div className="streak-message">
            {getStreakMessage(streak)}
          </div>
        </div>
      </div>

      <div className="streak-stats">
        <div className="streak-stat">
          <div className="streak-stat-value">{longest}</div>
          <div className="streak-stat-label">Longest Streak</div>
        </div>
        <div className="streak-stat">
          <div className="streak-stat-value" style={{ color: streakActive ? '#27ae60' : '#e74c3c' }}>
            {streakActive ? 'Active' : 'Broken'}
          </div>
          <div className="streak-stat-label">Status</div>
        </div>
      </div>

      {!streakActive && streak > 0 && (
        <div className="streak-warning">
          <span className="warning-icon">⚠️</span>
          <span className="warning-text">Complete a lesson today to continue your streak!</span>
        </div>
      )}

      {streak >= 7 && (
        <div className="streak-milestone">
          <span className="milestone-icon">🎉</span>
          <span className="milestone-text">
            {streak >= 30 ? 'Month Champion!' :
             streak >= 14 ? 'Two Week Warrior!' : 'Week Winner!'}
          </span>
        </div>
      )}
    </div>
  );
};

export default StreakTracker;
