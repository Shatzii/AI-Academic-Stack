import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { Link } from 'react-router-dom'
import { fetchCourses } from '../../slices/coursesSlice'
import { fetchAnalyticsSummary } from '../../slices/analyticsSlice'
// import { useAuth } from '../../context/AuthContext.jsx'
// import toast from 'react-hot-toast'

const AchievementSystem = () => {
  const dispatch = useDispatch()
  // const { user } = useAuth()
  // const { courses } = useSelector(state => state.courses)
  // const { analytics } = useSelector(state => state.analytics)

  const [achievements, setAchievements] = useState([])
  const [userProgress] = useState({
    coursesCompleted: 0,
    totalStudyTime: 0,
    streakDays: 0,
    points: 0
  })

  useEffect(() => {
    dispatch(fetchCourses())
    dispatch(fetchAnalyticsSummary())
    loadAchievements()
  }, [dispatch])

  const loadAchievements = () => {
    // Mock achievements data - in real app, this would come from API
    const mockAchievements = [
      {
        id: 1,
        title: 'First Steps',
        description: 'Complete your first course',
        icon: '🎓',
        unlocked: userProgress.coursesCompleted > 0,
        points: 100
      },
      {
        id: 2,
        title: 'Dedicated Learner',
        description: 'Study for 10 hours total',
        icon: '📚',
        unlocked: userProgress.totalStudyTime >= 10,
        points: 250
      },
      {
        id: 3,
        title: 'Streak Master',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        unlocked: userProgress.streakDays >= 7,
        points: 500
      },
      {
        id: 4,
        title: 'Knowledge Seeker',
        description: 'Complete 5 courses',
        icon: '🧠',
        unlocked: userProgress.coursesCompleted >= 5,
        points: 750
      },
      {
        id: 5,
        title: 'Expert Level',
        description: 'Earn 5000 points',
        icon: '⭐',
        unlocked: userProgress.points >= 5000,
        points: 1000
      }
    ]
    setAchievements(mockAchievements)
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)

  return (
    <div className="achievements-page">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h2 fw-bold text-primary mb-2">
              <i className="fas fa-trophy me-2"></i>
              Achievements & Progress
            </h1>
            <p className="text-muted">Track your learning journey and unlock rewards</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card h-100 border-primary">
              <div className="card-body text-center">
                <div className="display-4 text-primary mb-2">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h5 className="card-title">{userProgress.coursesCompleted}</h5>
                <p className="card-text text-muted">Courses Completed</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100 border-success">
              <div className="card-body text-center">
                <div className="display-4 text-success mb-2">
                  <i className="fas fa-clock"></i>
                </div>
                <h5 className="card-title">{userProgress.totalStudyTime}h</h5>
                <p className="card-text text-muted">Study Time</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100 border-warning">
              <div className="card-body text-center">
                <div className="display-4 text-warning mb-2">
                  <i className="fas fa-fire"></i>
                </div>
                <h5 className="card-title">{userProgress.streakDays}</h5>
                <p className="card-text text-muted">Day Streak</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card h-100 border-info">
              <div className="card-body text-center">
                <div className="display-4 text-info mb-2">
                  <i className="fas fa-star"></i>
                </div>
                <h5 className="card-title">{userProgress.points.toLocaleString()}</h5>
                <p className="card-text text-muted">Points Earned</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Achievements */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="h4 fw-bold text-success mb-3">
              <i className="fas fa-unlock me-2"></i>
              Unlocked Achievements ({unlockedAchievements.length})
            </h3>
            <div className="row">
              {unlockedAchievements.map(achievement => (
                <div key={achievement.id} className="col-md-4 mb-3">
                  <div className="card h-100 border-success bg-light">
                    <div className="card-body text-center">
                      <div className="achievement-icon mb-3">
                        <span style={{ fontSize: '3rem' }}>{achievement.icon}</span>
                      </div>
                      <h5 className="card-title fw-bold">{achievement.title}</h5>
                      <p className="card-text text-muted">{achievement.description}</p>
                      <span className="badge bg-success">+{achievement.points} points</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Locked Achievements */}
        <div className="row">
          <div className="col-12">
            <h3 className="h4 fw-bold text-muted mb-3">
              <i className="fas fa-lock me-2"></i>
              Locked Achievements ({lockedAchievements.length})
            </h3>
            <div className="row">
              {lockedAchievements.map(achievement => (
                <div key={achievement.id} className="col-md-4 mb-3">
                  <div className="card h-100 border-secondary bg-light opacity-50">
                    <div className="card-body text-center">
                      <div className="achievement-icon mb-3">
                        <span style={{ fontSize: '3rem', filter: 'grayscale(100%)' }}>{achievement.icon}</span>
                      </div>
                      <h5 className="card-title fw-bold text-muted">{achievement.title}</h5>
                      <p className="card-text text-muted">{achievement.description}</p>
                      <span className="badge bg-secondary">{achievement.points} points</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementSystem
