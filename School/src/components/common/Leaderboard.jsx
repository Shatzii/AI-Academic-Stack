import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const Leaderboard = () => {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [timeframe, setTimeframe] = useState('weekly')
  const [category, setCategory] = useState('points')

  useEffect(() => {
    loadLeaderboard()
  }, [timeframe, category])

  const loadLeaderboard = () => {
    // Mock leaderboard data - in real app, this would come from API
    const mockLeaderboard = [
      {
        id: 1,
        name: 'Sarah Johnson',
        avatar: null,
        points: 2450,
        coursesCompleted: 12,
        studyStreak: 28,
        rank: 1,
        change: '+2'
      },
      {
        id: 2,
        name: 'Michael Chen',
        avatar: null,
        points: 2380,
        coursesCompleted: 10,
        studyStreak: 21,
        rank: 2,
        change: '-1'
      },
      {
        id: 3,
        name: 'Emma Davis',
        avatar: null,
        points: 2290,
        coursesCompleted: 11,
        studyStreak: 15,
        rank: 3,
        change: '+1'
      },
      {
        id: 4,
        name: 'Alex Rodriguez',
        avatar: null,
        points: 2150,
        coursesCompleted: 9,
        studyStreak: 18,
        rank: 4,
        change: '0'
      },
      {
        id: 5,
        name: 'Lisa Wang',
        avatar: null,
        points: 2080,
        coursesCompleted: 8,
        studyStreak: 25,
        rank: 5,
        change: '+3'
      }
    ]
    setLeaderboard(mockLeaderboard)
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `#${rank}`
    }
  }

  const getChangeIcon = (change) => {
    if (change.startsWith('+')) return '📈'
    if (change.startsWith('-')) return '📉'
    return '➡️'
  }

  const getChangeColor = (change) => {
    if (change.startsWith('+')) return 'text-success'
    if (change.startsWith('-')) return 'text-danger'
    return 'text-muted'
  }

  return (
    <div className="leaderboard-page">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h2 fw-bold text-primary mb-2">
              <i className="fas fa-crown me-2"></i>
              Leaderboard
            </h1>
            <p className="text-muted">See how you rank among fellow learners</p>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title fw-bold">Timeframe</h6>
                <div className="btn-group w-100" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="timeframe"
                    id="daily"
                    checked={timeframe === 'daily'}
                    onChange={() => setTimeframe('daily')}
                  />
                  <label className="btn btn-outline-primary" htmlFor="daily">Daily</label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="timeframe"
                    id="weekly"
                    checked={timeframe === 'weekly'}
                    onChange={() => setTimeframe('weekly')}
                  />
                  <label className="btn btn-outline-primary" htmlFor="weekly">Weekly</label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="timeframe"
                    id="monthly"
                    checked={timeframe === 'monthly'}
                    onChange={() => setTimeframe('monthly')}
                  />
                  <label className="btn btn-outline-primary" htmlFor="monthly">Monthly</label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="timeframe"
                    id="alltime"
                    checked={timeframe === 'alltime'}
                    onChange={() => setTimeframe('alltime')}
                  />
                  <label className="btn btn-outline-primary" htmlFor="alltime">All Time</label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title fw-bold">Category</h6>
                <div className="btn-group w-100" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="category"
                    id="points"
                    checked={category === 'points'}
                    onChange={() => setCategory('points')}
                  />
                  <label className="btn btn-outline-success" htmlFor="points">Points</label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="category"
                    id="courses"
                    checked={category === 'courses'}
                    onChange={() => setCategory('courses')}
                  />
                  <label className="btn btn-outline-success" htmlFor="courses">Courses</label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="category"
                    id="streak"
                    checked={category === 'streak'}
                    onChange={() => setCategory('streak')}
                  />
                  <label className="btn btn-outline-success" htmlFor="streak">Streak</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">
                  <i className="fas fa-trophy me-2"></i>
                  Top Learners - {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} {category.charAt(0).toUpperCase() + category.slice(1)}
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0">Rank</th>
                        <th className="border-0">Learner</th>
                        <th className="border-0 text-center">Points</th>
                        <th className="border-0 text-center">Courses</th>
                        <th className="border-0 text-center">Streak</th>
                        <th className="border-0 text-center">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((learner) => (
                        <tr key={learner.id} className={learner.name === user?.first_name + ' ' + user?.last_name ? 'table-primary' : ''}>
                          <td className="fw-bold">
                            <span className="rank-icon me-2">{getRankIcon(learner.rank)}</span>
                            {learner.rank}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle me-3">
                                {learner.avatar ? (
                                  <img src={learner.avatar} alt={learner.name} className="rounded-circle" width="40" height="40" />
                                ) : (
                                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                                    <i className="fas fa-user"></i>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="fw-bold">{learner.name}</div>
                                {learner.name === user?.first_name + ' ' + user?.last_name && (
                                  <small className="text-primary">(You)</small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-center fw-bold text-primary">
                            {learner.points.toLocaleString()}
                          </td>
                          <td className="text-center">
                            {learner.coursesCompleted}
                          </td>
                          <td className="text-center">
                            <span className="badge bg-warning text-dark">
                              <i className="fas fa-fire me-1"></i>
                              {learner.studyStreak}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className={`fw-bold ${getChangeColor(learner.change)}`}>
                              <i className="me-1">{getChangeIcon(learner.change)}</i>
                              {learner.change}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card bg-light">
              <div className="card-body text-center">
                <h5 className="card-title">Ready to climb the ranks?</h5>
                <p className="card-text">Complete courses, maintain study streaks, and earn achievements to boost your ranking!</p>
                <Link to="/courses" className="btn btn-primary me-2">
                  <i className="fas fa-book me-2"></i>
                  Browse Courses
                </Link>
                <Link to="/achievements" className="btn btn-outline-primary">
                  <i className="fas fa-trophy me-2"></i>
                  View Achievements
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
