import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUserAchievements,
  fetchUserBadges,
  fetchGamificationStats,
  fetchLeaderboards,
  fetchAvailableRewards
} from '../../slices/gamificationSlice'
import { useAuth } from '../../context/AuthContext'
import AchievementCard from './AchievementCard'
import Leaderboard from './Leaderboard'
import RewardStore from './RewardStore'
import ProgressTracker from './ProgressTracker'
import StreakTracker from './StreakTracker'
import './GamificationDashboard.css'
import './AchievementCard.css'
import './Leaderboard.css'
import './RewardStore.css'
import './ProgressTracker.css'
import './StreakTracker.css'

const GamificationDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const {
    achievements,
    badges,
    stats,
    leaderboards,
    rewards,
    loading,
    error
  } = useSelector(state => state.gamification)

  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (user) {
      dispatch(fetchUserAchievements())
      dispatch(fetchUserBadges())
      dispatch(fetchGamificationStats())
      dispatch(fetchLeaderboards())
      dispatch(fetchAvailableRewards())
    }
  }, [dispatch, user])

  const handleRedeemReward = async () => {
    // const handleRedeemReward = async (reward) => {
    // Implement reward redemption logic
    // This would typically dispatch an action to redeem the reward
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'leaderboards', label: 'Leaderboards', icon: '🥇' },
    { id: 'rewards', label: 'Rewards', icon: '🎁' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} achievements={achievements} badges={badges} />
      case 'achievements':
        return <AchievementsTab achievements={achievements} />
      case 'leaderboards':
        return <Leaderboard currentUserId={user?.id} leaderboards={leaderboards} />
      case 'rewards':
        return <RewardStore userPoints={stats?.total_points || 0} onRedeemReward={handleRedeemReward} rewards={rewards} />
      default:
        return <OverviewTab stats={stats} achievements={achievements} badges={badges} />
    }
  }

  if (loading) {
    return (
      <div className="gamification-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your achievements and progress...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="gamification-dashboard">
        <div className="error-container">
          <h3>Unable to load gamification data</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="gamification-dashboard">
      <div className="dashboard-header">
        <h1>🎮 Gamification Center</h1>
        <p>Track your progress, earn achievements, and compete with others!</p>
      </div>

      <div className="dashboard-tabs">
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

      <div className="dashboard-content">
        {renderContent()}
      </div>

      {/* Quick Stats Banner */}
      {stats && (
        <div className="stats-banner">
          <div className="stat-item">
            <span className="stat-value">{stats.total_points?.toLocaleString() || 0}</span>
            <span className="stat-label">Total Points</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">Level {stats.current_level || 1}</span>
            <span className="stat-label">Current Level</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.current_streak || 0}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{achievements?.length || 0}</span>
            <span className="stat-label">Achievements</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Achievements Tab Component
const AchievementsTab = ({ achievements }) => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Achievements', icon: '🏆' },
    { id: 'learning', label: 'Learning', icon: '📚' },
    { id: 'social', label: 'Social', icon: '👥' },
    { id: 'streak', label: 'Streaks', icon: '🔥' },
    { id: 'completion', label: 'Completion', icon: '✅' }
  ]

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements?.filter(achievement => achievement.achievement.category === selectedCategory) || []

  return (
    <div className="achievement-showcase">
      <div className="achievement-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`filter-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="filter-icon">{category.icon}</span>
            <span className="filter-label">{category.label}</span>
          </button>
        ))}
      </div>

      <div className="achievements-grid">
        {filteredAchievements && filteredAchievements.length > 0 ? (
          filteredAchievements.map(userAchievement => (
            <AchievementCard
              key={userAchievement.id}
              achievement={userAchievement.achievement}
              isUnlocked={userAchievement.unlocked_at !== null}
              progress={userAchievement.progress || 0}
            />
          ))
        ) : (
          <div className="empty-state">
            <h3>🏆 No achievements in this category yet</h3>
            <p>Keep learning and completing courses to unlock achievements!</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Overview Tab Component
const OverviewTab = ({ stats, achievements, badges }) => {
  return (
    <div className="overview-tab">
      <div className="overview-grid">
        {/* Progress Tracker */}
        <div className="overview-section">
          <h3>📈 Your Progress</h3>
          <ProgressTracker stats={stats} />
        </div>

        {/* Streak Tracker */}
        <div className="overview-section">
          <h3>🔥 Learning Streak</h3>
          <StreakTracker stats={stats} />
        </div>

        {/* Recent Achievements */}
        <div className="overview-section">
          <h3>🏆 Recent Achievements</h3>
          {achievements && achievements.length > 0 ? (
            <div className="recent-achievements">
              {achievements.slice(0, 3).map(achievement => (
                <div key={achievement.id} className="achievement-item">
                  <span className="achievement-icon">{achievement.achievement.icon}</span>
                  <div className="achievement-info">
                    <h4>{achievement.achievement.name}</h4>
                    <p>{achievement.achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No achievements yet. Start learning to unlock your first achievement!</p>
          )}
        </div>

        {/* Badges Showcase */}
        <div className="overview-section">
          <h3>🎖️ Your Badges</h3>
          {badges && badges.length > 0 ? (
            <div className="badges-grid">
              {badges.slice(0, 6).map(badge => (
                <div
                  key={badge.id}
                  className="badge-item"
                  style={{ backgroundColor: badge.badge.color }}
                >
                  <span className="badge-icon">{badge.badge.icon}</span>
                  <span className="badge-name">{badge.badge.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>Earn badges by completing achievements and reaching milestones!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default GamificationDashboard
