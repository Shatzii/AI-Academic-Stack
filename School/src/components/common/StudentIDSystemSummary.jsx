import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import axios from 'axios'

const StudentIDSystemSummary = () => {
  const { user } = useAuth()
  const [systemStats, setSystemStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSystemSummary()
  }, [])

  const loadSystemSummary = async () => {
    try {
      setLoading(true)

      // Load various system statistics
      const [statsResponse, activityResponse] = await Promise.all([
        axios.get('/api/auth/id/admin/stats/'),
        axios.get('/api/auth/attendance/?limit=10')
      ])

      setSystemStats(statsResponse.data)
      setRecentActivity(activityResponse.data.results || activityResponse.data)
    } catch (error) {
      console.error('Failed to load system summary:', error)
      toast.error('Failed to load system summary')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }

  const getActivityTypeIcon = (type) => {
    switch (type) {
      case 'check_in': return 'fas fa-sign-in-alt text-success'
      case 'check_out': return 'fas fa-sign-out-alt text-info'
      case 'class_entry': return 'fas fa-chalkboard-teacher text-primary'
      case 'class_exit': return 'fas fa-door-open text-secondary'
      case 'building_entry': return 'fas fa-building text-warning'
      case 'building_exit': return 'fas fa-walking text-dark'
      default: return 'fas fa-question-circle text-muted'
    }
  }

  if (loading) {
    return (
      <div className="system-summary-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin fa-3x"></i>
          <h4>Loading System Summary...</h4>
        </div>
      </div>
    )
  }

  return (
    <div className="student-id-system-summary">
      <div className="container-fluid">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="system-header">
              <div className="header-content">
                <h1 className="system-title">
                  <i className="fas fa-graduation-cap me-3"></i>
                  Student ID System
                </h1>
                <p className="system-subtitle">
                  Comprehensive student identification and attendance management platform
                </p>
                <div className="system-status">
                  <span className="status-badge online">
                    <i className="fas fa-circle me-2"></i>
                    System Online
                  </span>
                </div>
              </div>
              <div className="header-visual">
                <div className="system-icon">
                  <i className="fas fa-id-card"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Overview Cards */}
        {systemStats && (
          <div className="row mb-4">
            <div className="col-xl-3 col-md-6 mb-4">
              <div className="summary-card primary">
                <div className="card-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="card-content">
                  <h3>{systemStats.total_students || 0}</h3>
                  <p>Total Students</p>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="summary-card success">
                <div className="card-icon">
                  <i className="fas fa-id-card"></i>
                </div>
                <div className="card-content">
                  <h3>{systemStats.active_cards || 0}</h3>
                  <p>Active Cards</p>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="summary-card info">
                <div className="card-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="card-content">
                  <h3>{systemStats.total_records_today || 0}</h3>
                  <p>Today&apos;s Records</p>
                </div>
              </div>
            </div>

            <div className="col-xl-3 col-md-6 mb-4">
              <div className="summary-card warning">
                <div className="card-icon">
                  <i className="fas fa-door-open"></i>
                </div>
                <div className="card-content">
                  <h3>{systemStats.total_access_points || 0}</h3>
                  <p>Access Points</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Components Grid */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="section-title">
              <i className="fas fa-cogs me-2"></i>
              System Components
            </h3>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-lg-6 mb-4">
            <div className="component-card">
              <div className="component-header">
                <div className="component-icon">
                  <i className="fas fa-server"></i>
                </div>
                <div className="component-info">
                  <h5>Backend API</h5>
                  <p>Django REST Framework</p>
                </div>
                <div className="component-status">
                  <span className="status-dot online"></span>
                </div>
              </div>
              <div className="component-features">
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  User Authentication & Authorization
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  ID Card Management
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Attendance Tracking API
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Access Control System
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Hardware Integration
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="component-card">
              <div className="component-header">
                <div className="component-icon">
                  <i className="fas fa-desktop"></i>
                </div>
                <div className="component-info">
                  <h5>Frontend Portal</h5>
                  <p>React + Bootstrap 5</p>
                </div>
                <div className="component-status">
                  <span className="status-dot online"></span>
                </div>
              </div>
              <div className="component-features">
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Student Dashboard
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Admin Management Panel
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Real-time Notifications
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Mobile-Responsive Design
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Accessibility Compliant
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="component-card">
              <div className="component-header">
                <div className="component-icon">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className="component-info">
                  <h5>Mobile Application</h5>
                  <p>Progressive Web App</p>
                </div>
                <div className="component-status">
                  <span className="status-dot online"></span>
                </div>
              </div>
              <div className="component-features">
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Digital ID Card Display
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  QR Code Generation
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Emergency Contact Access
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Offline Functionality
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Push Notifications
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="component-card">
              <div className="component-header">
                <div className="component-icon">
                  <i className="fas fa-microchip"></i>
                </div>
                <div className="component-info">
                  <h5>Hardware Integration</h5>
                  <p>RFID/NFC/Barcode</p>
                </div>
                <div className="component-status">
                  <span className="status-dot online"></span>
                </div>
              </div>
              <div className="component-features">
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  RFID Reader Support
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  NFC Tag Reading
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Barcode Scanner Integration
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Real-time WebSocket Communication
                </div>
                <div className="feature-item">
                  <i className="fas fa-check text-success me-2"></i>
                  Device Status Monitoring
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="section-title">
              <i className="fas fa-history me-2"></i>
              Recent Activity
            </h3>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="activity-timeline">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={activity.id || index} className="activity-item">
                    <div className="activity-marker">
                      <i className={getActivityTypeIcon(activity.attendance_type)}></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <h6 className="activity-title">
                          {activity.attendance_type.replace('_', ' ').toUpperCase()}
                        </h6>
                        <span className="activity-time">
                          {formatDate(activity.timestamp)} at {formatTime(activity.timestamp)}
                        </span>
                      </div>
                      <div className="activity-details">
                        {activity.student_name && (
                          <span className="detail-item">
                            <i className="fas fa-user me-1"></i>
                            {activity.student_name}
                          </span>
                        )}
                        {activity.location && (
                          <span className="detail-item">
                            <i className="fas fa-map-marker-alt me-1"></i>
                            {activity.location}
                          </span>
                        )}
                        {activity.classroom_name && (
                          <span className="detail-item">
                            <i className="fas fa-chalkboard me-1"></i>
                            {activity.classroom_name}
                          </span>
                        )}
                        {activity.course_title && (
                          <span className="detail-item">
                            <i className="fas fa-book me-1"></i>
                            {activity.course_title}
                          </span>
                        )}
                      </div>
                      <div className="activity-status">
                        <span className={`status-indicator ${activity.is_valid ? 'valid' : 'invalid'}`}>
                          {activity.is_valid ? '✓ Valid' : '✗ Invalid'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-activity">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <h5>No Recent Activity</h5>
                  <p className="text-muted">Activity will appear here as students use their ID cards.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="quick-actions-panel">
              <h3 className="section-title">
                <i className="fas fa-bolt me-2"></i>
                Quick Actions
              </h3>
              <div className="actions-grid">
                <button
                  className="action-button primary"
                  onClick={() => window.location.href = '/student-id'}
                >
                  <i className="fas fa-id-card"></i>
                  <span>Student Portal</span>
                </button>

                <button
                  className="action-button success"
                  onClick={() => window.location.href = '/admin/student-id'}
                >
                  <i className="fas fa-cogs"></i>
                  <span>Admin Panel</span>
                </button>

                <button
                  className="action-button info"
                  onClick={() => window.location.href = '/hardware'}
                >
                  <i className="fas fa-microchip"></i>
                  <span>Hardware Control</span>
                </button>

                <button
                  className="action-button warning"
                  onClick={() => window.open('/STUDENT_ID_SYSTEM_README.md', '_blank')}
                >
                  <i className="fas fa-book"></i>
                  <span>Documentation</span>
                </button>

                <button
                  className="action-button secondary"
                  onClick={() => window.location.href = '/mobile-id'}
                >
                  <i className="fas fa-mobile-alt"></i>
                  <span>Mobile App</span>
                </button>

                <button
                  className="action-button dark"
                  onClick={() => loadSystemSummary()}
                >
                  <i className="fas fa-sync-alt"></i>
                  <span>Refresh Data</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="system-health">
              <h3 className="section-title">
                <i className="fas fa-heartbeat me-2"></i>
                System Health
              </h3>
              <div className="health-indicators">
                <div className="health-item">
                  <span className="health-label">Database</span>
                  <span className="health-status online">
                    <i className="fas fa-circle me-1"></i>
                    Online
                  </span>
                </div>

                <div className="health-item">
                  <span className="health-label">API Services</span>
                  <span className="health-status online">
                    <i className="fas fa-circle me-1"></i>
                    Online
                  </span>
                </div>

                <div className="health-item">
                  <span className="health-label">WebSocket</span>
                  <span className="health-status online">
                    <i className="fas fa-circle me-1"></i>
                    Connected
                  </span>
                </div>

                <div className="health-item">
                  <span className="health-label">Hardware</span>
                  <span className="health-status warning">
                    <i className="fas fa-circle me-1"></i>
                    Partial
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentIDSystemSummary
