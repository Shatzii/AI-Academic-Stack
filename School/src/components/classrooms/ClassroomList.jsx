import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api'

const ClassroomList = () => {
  const { user, isAuthenticated } = useAuth()
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, active, scheduled, completed
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchClassrooms()
  }, [filter])

  const fetchClassrooms = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter !== 'all') {
        params.append('status', filter)
      }
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await api.get(`/classrooms/?${params}`)
      setClassrooms(response.data)
    } catch (err) {
      setError('Failed to load classrooms')
      console.error('Error fetching classrooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchClassrooms()
  }

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: 'badge-warning',
      active: 'badge-success',
      completed: 'badge-secondary',
      cancelled: 'badge-danger'
    }
    return badges[status] || 'badge-secondary'
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading classrooms...</span>
          </div>
          <p className="mt-2">Loading classrooms...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="classroom-list-page">
      <div className="container mt-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-2">
                  <i className="fas fa-chalkboard-teacher me-2 text-primary"></i>
                  Virtual Classrooms
                </h1>
                <p className="text-muted mb-0">
                  Join live sessions, participate in discussions, and collaborate with peers
                </p>
              </div>
              {isAuthenticated && user?.is_teacher && (
                <Link to="/classrooms/create" className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  Create Classroom
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-8">
            <form onSubmit={handleSearch} className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search classrooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-outline-primary">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Classrooms</option>
              <option value="scheduled">Scheduled</option>
              <option value="active">Active Now</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Classrooms Grid */}
        {classrooms.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-chalkboard fa-3x text-muted mb-3"></i>
            <h3 className="text-muted">No classrooms found</h3>
            <p className="text-muted">
              {filter !== 'all' ? `No ${filter} classrooms available.` : 'No classrooms are currently available.'}
            </p>
            {isAuthenticated && user?.is_teacher && (
              <Link to="/classrooms/create" className="btn btn-primary mt-3">
                <i className="fas fa-plus me-2"></i>
                Create Your First Classroom
              </Link>
            )}
          </div>
        ) : (
          <div className="row">
            {classrooms.map((classroom) => (
              <div key={classroom.id} className="col-lg-4 col-md-6 mb-4">
                <div className="card classroom-card h-100">
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="card-title mb-1">{classroom.title}</h5>
                        <p className="card-subtitle text-muted mb-0">
                          {classroom.course?.title || 'General Course'}
                        </p>
                      </div>
                      <span className={`badge ${getStatusBadge(classroom.status)}`}>
                        {classroom.status}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <p className="card-text text-truncate">
                      {classroom.description || 'No description available'}
                    </p>

                    <div className="classroom-info mb-3">
                      <div className="info-item">
                        <i className="fas fa-user-tie me-2"></i>
                        <span>{classroom.instructor?.full_name || 'Instructor'}</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-calendar me-2"></i>
                        <span>{formatDateTime(classroom.scheduled_at)}</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-clock me-2"></i>
                        <span>{classroom.duration_minutes} minutes</span>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-users me-2"></i>
                        <span>{classroom.total_participants || 0} participants</span>
                      </div>
                    </div>

                    {classroom.status === 'active' && (
                      <div className="live-indicator mb-3">
                        <span className="badge bg-danger">
                          <i className="fas fa-circle me-1"></i>
                          LIVE NOW
                        </span>
                      </div>
                    )}

                    <div className="classroom-features">
                      {classroom.is_recording_enabled && (
                        <span className="feature-tag">
                          <i className="fas fa-video me-1"></i>
                          Recording
                        </span>
                      )}
                      {classroom.max_participants && (
                        <span className="feature-tag">
                          <i className="fas fa-users me-1"></i>
                          Max {classroom.max_participants}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-footer">
                    <div className="d-flex gap-2">
                      <Link
                        to={`/classrooms/${classroom.id}`}
                        className="btn btn-primary flex-fill"
                      >
                        {classroom.status === 'active' ? 'Join Now' : 'View Details'}
                      </Link>
                      {isAuthenticated && classroom.status === 'active' && (
                        <button className="btn btn-outline-success">
                          <i className="fas fa-hand-paper"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {classrooms.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="stats-summary">
                <h4>Quick Stats</h4>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">
                      {classrooms.filter(c => c.status === 'active').length}
                    </div>
                    <div className="stat-label">Active Now</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {classrooms.filter(c => c.status === 'scheduled').length}
                    </div>
                    <div className="stat-label">Scheduled</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {classrooms.reduce((sum, c) => sum + (c.total_participants || 0), 0)}
                    </div>
                    <div className="stat-label">Total Participants</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassroomList
