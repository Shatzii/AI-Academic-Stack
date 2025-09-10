import React, { useState, useEffect } from 'react';
import './Leaderboard.css';

const Leaderboard = ({ currentUserId }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [activeTab, setActiveTab] = useState('overall');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'overall', label: 'Overall', icon: '🏆' },
    { id: 'weekly', label: 'This Week', icon: '📅' },
    { id: 'monthly', label: 'This Month', icon: '📊' },
    { id: 'courses', label: 'By Course', icon: '📚' }
  ];

  useEffect(() => {
    fetchLeaderboardData(activeTab);
  }, [activeTab]);

  const fetchLeaderboardData = async (tab) => {
    setLoading(true);
    setError(null);

    try {
      // Mock data - replace with actual API call
      const mockData = generateMockLeaderboardData(tab);
      setLeaderboardData(mockData);
    } catch (err) {
      setError('Failed to load leaderboard data');
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockLeaderboardData = (tab) => {
    const baseUsers = [
      { id: 1, name: 'Alice Johnson', avatar: 'A', score: 2850, courses_completed: 12, streak: 15 },
      { id: 2, name: 'Bob Smith', avatar: 'B', score: 2720, courses_completed: 10, streak: 8 },
      { id: 3, name: 'Carol Davis', avatar: 'C', score: 2680, courses_completed: 11, streak: 22 },
      { id: 4, name: 'David Wilson', avatar: 'D', score: 2540, courses_completed: 9, streak: 5 },
      { id: 5, name: 'Emma Brown', avatar: 'E', score: 2490, courses_completed: 8, streak: 12 },
      { id: 6, name: 'Frank Miller', avatar: 'F', score: 2380, courses_completed: 7, streak: 3 },
      { id: 7, name: 'Grace Lee', avatar: 'G', score: 2250, courses_completed: 6, streak: 18 },
      { id: 8, name: 'Henry Taylor', avatar: 'H', score: 2120, courses_completed: 5, streak: 7 },
      { id: 9, name: 'Ivy Chen', avatar: 'I', score: 1980, courses_completed: 4, streak: 9 },
      { id: 10, name: 'Jack Anderson', avatar: 'J', score: 1850, courses_completed: 3, streak: 2 }
    ];

    // Simulate different rankings for different time periods
    if (tab === 'weekly') {
      return baseUsers.sort((a, b) => b.streak - a.streak);
    } else if (tab === 'monthly') {
      return baseUsers.sort((a, b) => b.courses_completed - a.courses_completed);
    } else if (tab === 'courses') {
      return baseUsers.sort((a, b) => b.courses_completed - a.courses_completed);
    }

    return baseUsers.sort((a, b) => b.score - a.score);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return rank;
    }
  };

  const getScoreLabel = (tab) => {
    switch (tab) {
      case 'weekly': return 'Streak Days';
      case 'monthly': return 'Courses This Month';
      case 'courses': return 'Courses Completed';
      default: return 'Total Points';
    }
  };

  const getScoreValue = (user, tab) => {
    switch (tab) {
      case 'weekly': return user.streak;
      case 'monthly': return user.courses_completed;
      case 'courses': return user.courses_completed;
      default: return user.score.toLocaleString();
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="error-container">
          <h3>⚠️ {error}</h3>
          <button onClick={() => fetchLeaderboardData(activeTab)}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`leaderboard-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="leaderboard-entries">
        <div className="leaderboard-header">
          <h3>{tabs.find(tab => tab.id === activeTab)?.label} Leaderboard</h3>
        </div>

        {leaderboardData.map((user, index) => {
          const rank = index + 1;
          const isCurrentUser = user.id === currentUserId;

          return (
            <div
              key={user.id}
              className={`leaderboard-entry ${isCurrentUser ? 'current-user' : ''}`}
            >
              <div className="rank">
                {getRankIcon(rank)}
              </div>

              <div className="user-info">
                <div className="user-avatar">
                  {user.avatar}
                </div>
                <div className="user-details">
                  <h4>{user.name}</h4>
                  <p>
                    {activeTab === 'courses' ? 'Courses completed' :
                     activeTab === 'weekly' ? 'Current streak' :
                     activeTab === 'monthly' ? 'This month' : 'Total score'}
                  </p>
                </div>
              </div>

              <div className="score">
                {getScoreValue(user, activeTab)}
                {activeTab !== 'courses' && activeTab !== 'weekly' && activeTab !== 'monthly' && (
                  <span className="score-unit"> pts</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {leaderboardData.length === 0 && (
        <div className="empty-state">
          <h3>🏆 Be the first to join the leaderboard!</h3>
          <p>Complete courses and earn points to see your ranking here.</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
