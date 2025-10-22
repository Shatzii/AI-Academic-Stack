import { useState, memo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useBranding } from '../../context/BrandingContext'
import { useDispatch } from 'react-redux'
import { logout } from '../../slices/authSlice'
import toast from 'react-hot-toast'
import ThemeToggle from '../common/ThemeToggle'
import { useAuth0 } from '@auth0/auth0-react'

const Navbar = memo(() => {
  const { user, isAuthenticated } = useAuth()
  const { branding } = useBranding()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { loginWithRedirect, logout: auth0Logout, isAuthenticated: isAuth0Authenticated, isLoading: isAuth0Loading, user: auth0User } = useAuth0()

  const auth0Enabled = Boolean(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID)

  const handleLogout = () => {
    if (auth0Enabled) {
      auth0Logout({ returnTo: window.location.origin })
    } else {
      dispatch(logout())
      toast.success('Logged out successfully')
      navigate('/')
    }
  }

  Navbar.displayName = 'Navbar'

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav id="navigation" className="navbar navbar-expand-lg" role="navigation" aria-label="Main navigation">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {branding?.small_logo_url && (
            <img
              src={branding.small_logo_url}
              alt={branding.school_name}
              height="30"
              className="me-2"
            />
          )}
          <i className="fas fa-graduation-cap me-2 text-primary"></i>
          <span className="fw-bold text-primary">{branding?.school_name || 'OpenEdTex'}</span>
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
              <Link className="nav-link px-3 py-2" to="/" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-home me-2"></i>Home
              </Link>
            </li>

            {(isAuthenticated || (auth0Enabled && isAuth0Authenticated)) && (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3 py-2" to="/courses" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-book me-2"></i>Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 py-2" to="/ai/chat" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-brain me-2"></i>AI Assistant
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 py-2" to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-chart-line me-2"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 py-2" to="/student-id" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-id-card me-2"></i>Student ID
                  </Link>
                </li>
                {user?.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link px-3 py-2" to="/admin/student-id" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-cog me-2"></i>Admin
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item d-flex align-items-center me-3">
              <ThemeToggle />
            </li>
            {(isAuthenticated || (auth0Enabled && isAuth0Authenticated)) ? (
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
                  {auth0Enabled ? (auth0User?.name || auth0User?.email) : (user?.first_name || user?.username)}
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
                  {!auth0Enabled && user?.role === 'admin' && (
                    <>
                      <li>
                        <Link className="dropdown-item" to="/admin/student-id" onClick={() => setIsMenuOpen(false)}>
                          <i className="fas fa-cog me-2"></i>Student ID Admin
                        </Link>
                      </li>
                      <li>
                        <a className="dropdown-item" href="http://localhost:8001/admin/" target="_blank" rel="noopener noreferrer">
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
                {auth0Enabled ? (
                  <li className="nav-item">
                    <button className="btn btn-primary" onClick={() => loginWithRedirect()} disabled={isAuth0Loading}>
                      <i className="fas fa-sign-in-alt me-1"></i>Login
                    </button>
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
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar
