import React from 'react';
import './AchievementCard.css';

const AchievementCard = ({ achievement, isUnlocked, progress, onClick }) => {
  const getIcon = (iconName) => {
    const icons = {
      'trophy': '🏆',
      'star': '⭐',
      'medal': '🏅',
      'fire': '🔥',
      'book': '📚',
      'brain': '🧠',
      'target': '🎯',
      'rocket': '🚀',
      'lightbulb': '💡',
      'graduation': '🎓',
      'certificate': '📜',
      'crown': '👑',
      'diamond': '💎',
      'heart': '❤️',
      'thumbs-up': '👍',
      'clap': '👏',
      'party': '🎉',
      'confetti': '🎊',
      'gift': '🎁',
      'key': '🔑'
    };
    return icons[iconName] || '🏆';
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'common': '#95a5a6',
      'uncommon': '#27ae60',
      'rare': '#3498db',
      'epic': '#9b59b6',
      'legendary': '#e74c3c'
    };
    return colors[rarity] || '#95a5a6';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
      onClick={onClick}
      style={{
        borderLeftColor: isUnlocked ? getRarityColor(achievement.rarity) : '#95a5a6'
      }}
    >
      <div className="achievement-header">
        <div className="achievement-card-icon">
          {getIcon(achievement.icon)}
        </div>
        <div className="achievement-details">
          <h3>{achievement.name}</h3>
          <p>{achievement.description}</p>
          {isUnlocked && achievement.unlocked_at && (
            <small className="unlock-date">
              Unlocked on {formatDate(achievement.unlocked_at)}
            </small>
          )}
        </div>
      </div>

      {!isUnlocked && achievement.requirements && (
        <div className="achievement-requirements">
          <h4>Requirements:</h4>
          <ul>
            {achievement.requirements.map((req, index) => (
              <li key={index} className={req.completed ? 'completed' : ''}>
                {req.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {achievement.progress_required > 1 && (
        <div className="achievement-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min((progress / achievement.progress_required) * 100, 100)}%`,
                background: isUnlocked ? '#27ae60' : getRarityColor(achievement.rarity)
              }}
            ></div>
          </div>
          <div className="progress-text">
            {progress || 0} / {achievement.progress_required}
          </div>
        </div>
      )}

      <div className="achievement-footer">
        <div className="achievement-points">
          <span className="points-value">{achievement.points}</span>
          <span className="points-label">points</span>
        </div>
        <div className="achievement-rarity" style={{ color: getRarityColor(achievement.rarity) }}>
          {achievement.rarity}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;
