import React, { useState, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useBranding } from '../../context/BrandingContext.jsx'
import { useDispatch } from 'react-redux'
import { logout } from '../../slices/authSlice'
import toast from 'react-hot-toast'

const Navbar = memo(() => {
  const { user, isAuthenticated } = useAuth()
  const { branding } = useBranding()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav id="navigation" className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: branding?.primary_color || '#007bff' }} role="navigation" aria-label="Main navigation">
      <div className="container">
        <Link className="navbar-brand" to="/">
          {branding?.small_logo_url && (
            <img
              src={branding.small_logo_url}
              alt={branding.school_name}
              height="30"
              className="me-2"
            />
          )}
          <i className="fas fa-graduation-cap me-2"></i>
          {branding?.school_name || 'OpenEdTex'}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-home me-1"></i>Home
              </Link>
            </li>

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/courses" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-book me-1"></i>Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ai/chat" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-brain me-1"></i>AI Assistant
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-chart-line me-1"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/student-id" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-id-card me-1"></i>Student ID
                  </Link>
                </li>
                {user?.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/student-id" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-cog me-1"></i>Admin
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-user me-1"></i>
                  {user?.first_name || user?.username}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-chart-line me-2"></i>Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/student-id" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-id-card me-2"></i>Student ID
                    </Link>
                  </li>
                  {user?.role === 'admin' && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/admin/student-id" onClick={() => setIsMenuOpen(false)}>
                          <i className="fas fa-cog me-2"></i>Student ID Admin
                        </Link>
                      </li>
                      <li>
                        <a className="dropdown-item" href="http://localhost:8000/admin/" target="_blank" rel="noopener noreferrer">
                          <i className="fas fa-user-shield me-2"></i>Django Admin
                        </a>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-sign-in-alt me-1"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-user-plus me-1"></i>Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
})

export default Navbar
