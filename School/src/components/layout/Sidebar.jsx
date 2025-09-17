import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return null
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const menuItems = [
    {
      path: '/dashboard',
      icon: 'fas fa-tachometer-alt',
      label: 'Dashboard',
      roles: ['student', 'teacher', 'admin']
    },
    {
      path: '/achievements',
      icon: 'fas fa-trophy',
      label: 'Achievements',
      roles: ['student', 'teacher', 'admin']
    },
    {
      path: '/leaderboard',
      icon: 'fas fa-crown',
      label: 'Leaderboard',
      roles: ['student', 'teacher', 'admin']
    },
    {
      path: '/courses',
      icon: 'fas fa-book',
      label: 'Courses',
      roles: ['student', 'teacher', 'admin']
    },
    {
      path: '/ai/chat',
      icon: 'fas fa-brain',
      label: 'AI Assistant',
      roles: ['student', 'teacher', 'admin']
    },
    {
      path: '/achievements',
      icon: 'fas fa-trophy',
      label: 'Achievements',
      roles: ['student', 'teacher', 'admin']
    },
    {
      path: '/leaderboard',
      icon: 'fas fa-crown',
      label: 'Leaderboard',
      roles: ['student', 'teacher', 'admin']
    },
    {
      path: '/accessibility',
      icon: 'fas fa-universal-access',
      label: 'Accessibility',
      roles: ['student', 'teacher', 'admin']
    },
    {
      path: '/personalization',
      icon: 'fas fa-brain',
      label: 'AI Learning',
      roles: ['student', 'teacher', 'admin']
    },
    {
      path: '/internationalization',
      icon: 'fas fa-globe',
      label: 'Languages',
      roles: ['student', 'teacher', 'admin']
    },
    {
      path: '/2fa',
      icon: 'fas fa-shield-alt',
      label: 'Security (2FA)',
      roles: ['student', 'teacher', 'admin']
    }
  ]

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(user?.role || 'student')
  )

  return (
    <aside className="sidebar">
      <div className="sidebar-header p-4">
        <div className="d-flex align-items-center">
          <div className="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
            <i className="fas fa-user"></i>
          </div>
          <div className="user-details">
            <h6 className="user-name mb-0 fw-semibold text-white">
              {user?.first_name} {user?.last_name}
            </h6>
            <span className="user-role text-capitalize text-white-50 small">
              {user?.role || 'Student'}
            </span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="list-unstyled">
          {filteredMenuItems.map((item) => (
            <li key={item.path} className="mb-1">
              <Link
                to={item.path}
                className={`sidebar-nav-link d-flex align-items-center text-decoration-none px-4 py-3 rounded-end ${
                  isActive(item.path) ? 'active' : ''
                }`}
              >
                <i className={`${item.icon} me-3`} style={{width: '20px', textAlign: 'center'}}></i>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-label">Courses</span>
            <span className="stat-value">{user?.enrollments_count || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{user?.completed_courses_count || 0}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
