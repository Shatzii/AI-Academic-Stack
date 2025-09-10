import React, { useState, useEffect } from 'react';
import './RewardStore.css';

const RewardStore = ({ userPoints, onRedeemReward }) => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Rewards', icon: '🎁' },
    { id: 'digital', label: 'Digital', icon: '💻' },
    { id: 'physical', label: 'Physical', icon: '📦' },
    { id: 'experience', label: 'Experiences', icon: '🎭' },
    { id: 'certificates', label: 'Certificates', icon: '🏆' }
  ];

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock data - replace with actual API call
      const mockRewards = generateMockRewards();
      setRewards(mockRewards);
    } catch (err) {
      setError('Failed to load rewards');
      console.error('Rewards fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRewards = () => {
    return [
      {
        id: 1,
        name: 'Premium Course Access',
        description: 'Get access to premium courses for one month',
        cost: 500,
        category: 'digital',
        icon: '📚',
        rarity: 'rare',
        available: true,
        redeemed: false
      },
      {
        id: 2,
        name: 'Custom Certificate',
        description: 'Personalized certificate with your achievements',
        cost: 300,
        category: 'certificates',
        icon: '🏆',
        rarity: 'uncommon',
        available: true,
        redeemed: false
      },
      {
        id: 3,
        name: 'Study Break Voucher',
        description: '$10 coffee shop voucher for study breaks',
        cost: 200,
        category: 'physical',
        icon: '☕',
        rarity: 'common',
        available: true,
        redeemed: false
      },
      {
        id: 4,
        name: 'Virtual Mentor Session',
        description: '30-minute session with a subject expert',
        cost: 800,
        category: 'experience',
        icon: '👨‍🏫',
        rarity: 'epic',
        available: true,
        redeemed: false
      },
      {
        id: 5,
        name: 'Exclusive Webinar Access',
        description: 'Access to exclusive educational webinars',
        cost: 150,
        category: 'digital',
        icon: '🎥',
        rarity: 'common',
        available: true,
        redeemed: false
      },
      {
        id: 6,
        name: 'Achievement Badge Set',
        description: 'Complete set of digital achievement badges',
        cost: 400,
        category: 'digital',
        icon: '🎖️',
        rarity: 'rare',
        available: true,
        redeemed: false
      },
      {
        id: 7,
        name: 'Book Recommendation',
        description: 'Personalized book recommendation with delivery',
        cost: 250,
        category: 'physical',
        icon: '📖',
        rarity: 'uncommon',
        available: true,
        redeemed: false
      },
      {
        id: 8,
        name: 'Online Course Platform Subscription',
        description: '1-month subscription to external learning platform',
        cost: 600,
        category: 'digital',
        icon: '🎓',
        rarity: 'epic',
        available: true,
        redeemed: false
      },
      {
        id: 9,
        name: 'Study Group Leadership',
        description: 'Lead a study group session for bonus points',
        cost: 100,
        category: 'experience',
        icon: '👥',
        rarity: 'common',
        available: true,
        redeemed: false
      },
      {
        id: 10,
        name: 'Custom Profile Theme',
        description: 'Unlock a premium profile customization theme',
        cost: 350,
        category: 'digital',
        icon: '🎨',
        rarity: 'rare',
        available: true,
        redeemed: false
      }
    ];
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

  const filteredRewards = selectedCategory === 'all'
    ? rewards
    : rewards.filter(reward => reward.category === selectedCategory);

  const handleRedeem = async (reward) => {
    if (userPoints < reward.cost) {
      alert('Not enough points to redeem this reward!');
      return;
    }

    try {
      // Call the redeem function passed from parent
      await onRedeemReward(reward);
      alert(`Successfully redeemed: ${reward.name}!`);
    } catch (err) {
      console.error('Redemption error:', err);
      alert('Failed to redeem reward. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="reward-store">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading rewards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reward-store">
        <div className="error-container">
          <h3>⚠️ {error}</h3>
          <button onClick={fetchRewards}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="reward-store">
      <div className="store-header">
        <h2>Reward Store</h2>
        <div className="points-display">
          <span className="points-icon">💰</span>
          <span className="points-value">{userPoints.toLocaleString()}</span>
          <span className="points-label">Points</span>
        </div>
      </div>

      <div className="store-categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>

      <div className="rewards-grid">
        {filteredRewards.map(reward => (
          <div key={reward.id} className={`reward-card ${reward.rarity}`}>
            <div className="reward-header">
              <div className="reward-icon">{reward.icon}</div>
              <div className="reward-rarity" style={{ color: getRarityColor(reward.rarity) }}>
                {reward.rarity}
              </div>
            </div>

            <div className="reward-details">
              <h3>{reward.name}</h3>
              <p>{reward.description}</p>
            </div>

            <div className="reward-cost">
              <div className="cost-display">
                <span className="cost-value">{reward.cost}</span>
                <span className="cost-unit">points</span>
              </div>
              <button
                className={`btn-redeem ${userPoints >= reward.cost ? 'available' : 'disabled'}`}
                onClick={() => handleRedeem(reward)}
                disabled={userPoints < reward.cost}
              >
                {userPoints >= reward.cost ? 'Redeem' : 'Not Enough'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRewards.length === 0 && (
        <div className="empty-state">
          <h3>🎁 No rewards available in this category</h3>
          <p>Check back later for new rewards!</p>
        </div>
      )}
    </div>
  );
};

export default RewardStore;
