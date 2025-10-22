import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../slices/authSlice'
import { useBranding } from '../../context/BrandingContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error } = useSelector(state => state.auth)
  const { branding } = useBranding()

  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const result = await dispatch(loginUser(formData)).unwrap()
      toast.success('Login successful!')
      navigate(from, { replace: true })
    } catch (error) {
      // Error is handled by the slice and displayed via toast
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Welcome Back
                  </h2>
                  <p className="text-muted">Sign in to your {branding?.school_name || 'OpenEdTex'} account</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      <i className="fas fa-envelope me-2"></i>Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="fas fa-lock me-2"></i>Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control form-control-lg"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="mb-0">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                      Sign up here
                    </Link>
                  </p>
                </div>

                <hr className="my-4" />

                <div className="text-center">
                  <small className="text-muted">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </small>
                </div>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="card mt-4 border-warning">
              <div className="card-body">
                <h6 className="card-title text-warning">
                  <i className="fas fa-info-circle me-2"></i>
                  Demo Credentials
                </h6>
                <div className="row">
                  <div className="col-6">
                    <small className="text-muted d-block">Student:</small>
                    <code>student@example.com</code><br />
                    <code>password123</code>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block">Teacher:</small>
                    <code>teacher@example.com</code><br />
                    <code>password123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
