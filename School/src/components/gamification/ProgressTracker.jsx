import React from 'react';
import './ProgressTracker.css';

const ProgressTracker = ({ stats }) => {
  if (!stats) {
    return (
      <div className="progress-tracker">
        <p>Loading progress data...</p>
      </div>
    );
  }

  const { current_level, experience_points, experience_to_next_level, total_points } = stats;
  const progressPercentage = experience_to_next_level
    ? Math.min((experience_points / (experience_points + experience_to_next_level)) * 100, 100)
    : 100;

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <div className="level-info">
          <div className="level-number">{current_level || 1}</div>
          <div className="level-label">Current Level</div>
        </div>
        <div className="points-info">
          <div className="total-points">{total_points?.toLocaleString() || 0}</div>
          <div className="points-label">Total Points</div>
        </div>
      </div>

      <div className="experience-bar">
        <div
          className="experience-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="experience-text">
        <span>{experience_points || 0} / {(experience_points || 0) + (experience_to_next_level || 0)} XP</span>
        <span>{experience_to_next_level || 0} XP to next level</span>
      </div>

      <div className="progress-milestones">
        <div className="milestone">
          <span className="milestone-icon">🎯</span>
          <span className="milestone-text">Next: Level {current_level + 1 || 2}</span>
        </div>
        <div className="milestone">
          <span className="milestone-icon">⭐</span>
          <span className="milestone-text">Keep it up!</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
