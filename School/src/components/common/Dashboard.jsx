import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCourses } from '../../slices/coursesSlice'
import { fetchClassrooms } from '../../slices/classroomsSlice'
import { fetchAnalyticsSummary } from '../../slices/analyticsSlice'
import { useAuth } from '../../context/AuthContext.jsx'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { courses, loading: coursesLoading } = useSelector(state => state.courses)
  const { classrooms, loading: classroomsLoading } = useSelector(state => state.classrooms)
  const { analytics, loading: analyticsLoading } = useSelector(state => state.analytics)

  useEffect(() => {
    dispatch(fetchCourses())
    dispatch(fetchClassrooms())
    dispatch(fetchAnalyticsSummary())
  }, [dispatch])

  const recentCourses = courses?.slice(0, 3) || []
  const recentClassrooms = classrooms?.slice(0, 3) || []

  return (
    <div className="dashboard-page">
      <div className="container-fluid">
        {/* Welcome Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="welcome-card bg-primary text-white rounded-3 p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h1 className="display-5 fw-bold mb-2">
                    Welcome back, {user?.first_name || 'Student'}!
                  </h1>
                  <p className="lead mb-0">
                    Ready to continue your learning journey? Here's what's happening today.
                  </p>
                </div>
                <div className="col-md-4 text-center">
                  <div className="welcome-icon">
                    <i className="fas fa-rocket fa-4x text-warning"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row mb-4">
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card stat-card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="stat-icon mb-2">
                  <i className="fas fa-book fa-2x text-primary"></i>
                </div>
                <h4 className="fw-bold mb-1">{courses?.length || 0}</h4>
                <p className="text-muted mb-0">Enrolled Courses</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card stat-card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="stat-icon mb-2">
                  <i className="fas fa-users fa-2x text-success"></i>
                </div>
                <h4 className="fw-bold mb-1">{classrooms?.length || 0}</h4>
                <p className="text-muted mb-0">Active Classrooms</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card stat-card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="stat-icon mb-2">
                  <i className="fas fa-brain fa-2x text-info"></i>
                </div>
                <h4 className="fw-bold mb-1">{analytics?.total_questions_asked || 0}</h4>
                <p className="text-muted mb-0">AI Interactions</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-3">
            <div className="card stat-card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="stat-icon mb-2">
                  <i className="fas fa-trophy fa-2x text-warning"></i>
                </div>
                <h4 className="fw-bold mb-1">{analytics?.average_score || 0}%</h4>
                <p className="text-muted mb-0">Average Score</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Recent Courses */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <i className="fas fa-book text-primary me-2"></i>
                    Recent Courses
                  </h5>
                  <Link to="/courses" className="btn btn-outline-primary btn-sm">
                    View All
                  </Link>
                </div>
              </div>
              <div className="card-body">
                {coursesLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : recentCourses.length > 0 ? (
                  <div className="course-list">
                    {recentCourses.map(course => (
                      <div key={course.id} className="course-item d-flex align-items-center mb-3 p-3 border rounded">
                        <div className="course-icon me-3">
                          <i className="fas fa-graduation-cap fa-2x text-primary"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-semibold">{course.title}</h6>
                          <p className="text-muted small mb-1">{course.subject}</p>
                          <div className="progress" style={{ height: '6px' }}>
                            <div
                              className="progress-bar bg-success"
                              style={{ width: `${course.progress || 0}%` }}
                            ></div>
                          </div>
                          <small className="text-muted">{course.progress || 0}% Complete</small>
                        </div>
                        <Link to={`/courses/${course.id}`} className="btn btn-sm btn-outline-primary ms-3">
                          Continue
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-book fa-3x text-muted mb-3"></i>
                    <h6 className="text-muted">No courses enrolled yet</h6>
                    <Link to="/courses" className="btn btn-primary">
                      Browse Courses
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Classrooms */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <i className="fas fa-users text-success me-2"></i>
                    Active Classrooms
                  </h5>
                  <Link to="/courses" className="btn btn-outline-success btn-sm">
                    View All
                  </Link>
                </div>
              </div>
              <div className="card-body">
                {classroomsLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : recentClassrooms.length > 0 ? (
                  <div className="classroom-list">
                    {recentClassrooms.map(classroom => (
                      <div key={classroom.id} className="classroom-item d-flex align-items-center mb-3 p-3 border rounded">
                        <div className="classroom-icon me-3">
                          <i className="fas fa-chalkboard-teacher fa-2x text-success"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-semibold">{classroom.name}</h6>
                          <p className="text-muted small mb-1">{classroom.subject}</p>
                          <small className="text-muted">
                            <i className="fas fa-users me-1"></i>
                            {classroom.students_count || 0} students
                          </small>
                        </div>
                        <Link to={`/classrooms/${classroom.id}`} className="btn btn-sm btn-outline-success ms-3">
                          Join
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-users fa-3x text-muted mb-3"></i>
                    <h6 className="text-muted">No active classrooms</h6>
                    <Link to="/courses" className="btn btn-success">
                      Browse Courses
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="fas fa-bolt text-warning me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-lg-3 col-md-6">
                    <Link to="/ai/chat" className="text-decoration-none">
                      <div className="quick-action-card text-center p-4 border rounded hover-shadow">
                        <i className="fas fa-brain fa-3x text-info mb-3"></i>
                        <h6 className="fw-semibold">AI Assistant</h6>
                        <p className="text-muted small mb-0">Get help with your studies</p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <Link to="/courses" className="text-decoration-none">
                      <div className="quick-action-card text-center p-4 border rounded hover-shadow">
                        <i className="fas fa-search fa-3x text-primary mb-3"></i>
                        <h6 className="fw-semibold">Browse Courses</h6>
                        <p className="text-muted small mb-0">Find new courses to enroll</p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <Link to="/achievements" className="text-decoration-none">
                      <div className="quick-action-card text-center p-4 border rounded hover-shadow">
                        <i className="fas fa-trophy fa-3x text-success mb-3"></i>
                        <h6 className="fw-semibold">Achievements</h6>
                        <p className="text-muted small mb-0">View your accomplishments</p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <Link to="/accessibility" className="text-decoration-none">
                      <div className="quick-action-card text-center p-4 border rounded hover-shadow">
                        <i className="fas fa-cog fa-3x text-secondary mb-3"></i>
                        <h6 className="fw-semibold">Settings</h6>
                        <p className="text-muted small mb-0">Customize your experience</p>
                      </div>
                    </Link>
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

export default Dashboard
