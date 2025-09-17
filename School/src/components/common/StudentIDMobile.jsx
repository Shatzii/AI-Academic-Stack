import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import axios from 'axios'

const StudentIDMobile = () => {
  const { user } = useAuth()
  const [myCard, setMyCard] = useState(null)
  const [recentAttendance, setRecentAttendance] = useState([])
  const [loading, setLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showBarcode, setShowBarcode] = useState(false)

  useEffect(() => {
    loadMyCard()
    loadRecentAttendance()
  }, [])

  const loadMyCard = async () => {
    try {
      const response = await axios.get('/api/auth/id/my_card/')
      setMyCard(response.data)
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load ID card')
      }
    }
  }

  const loadRecentAttendance = async () => {
    try {
      const response = await axios.get('/api/auth/attendance/?limit=5')
      setRecentAttendance(response.data.results || response.data)
    } catch (error) {
      console.error('Failed to load recent attendance:', error)
    }
  }

  const reportCardLost = async () => {
    if (!myCard) return

    const confirmed = window.confirm(
      'Are you sure you want to report this card as lost? This will deactivate your card immediately.'
    )

    if (!confirmed) return

    try {
      await axios.post(`/api/auth/id/id-cards/${myCard.id}/report_lost/`)
      toast.success('Card reported as lost. Please contact administration for a replacement.')
      loadMyCard()
    } catch (error) {
      toast.error('Failed to report lost card')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }

  const getAttendanceTypeIcon = (type) => {
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

  if (!myCard) {
    return (
      <div className="mobile-id-container">
        <div className="no-card-state">
          <div className="icon-container">
            <i className="fas fa-id-card fa-4x text-muted"></i>
          </div>
          <h3>No Active ID Card</h3>
          <p className="text-muted">You don&apos;t have an active student ID card yet.</p>
          <p className="text-muted small">
            Please contact your school administration to request a new card.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => window.location.href = '/student-id'}
          >
            <i className="fas fa-external-link-alt me-2"></i>
            Open Full System
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-id-container">
      {/* Digital ID Card Display */}
      <div className="digital-card">
        <div className="card-header">
          <div className="school-logo">
            <i className="fas fa-graduation-cap fa-2x"></i>
          </div>
          <div className="card-status">
            <span className={`status-badge ${myCard.status}`}>
              {myCard.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="card-body">
          <div className="student-photo">
            {myCard.card_image ? (
              <img src={myCard.card_image} alt="Student" className="photo" />
            ) : (
              <div className="photo-placeholder">
                <i className="fas fa-user fa-3x"></i>
              </div>
            )}
          </div>

          <div className="student-info">
            <h4 className="student-name">{user?.first_name} {user?.last_name}</h4>
            <p className="student-id">ID: {myCard.card_number}</p>
            <p className="student-email">{user?.email}</p>
            <p className="card-type">{myCard.card_type} Card</p>
          </div>
        </div>

        <div className="card-footer">
          <div className="validity-info">
            <small>
              <i className="fas fa-calendar me-1"></i>
              Valid until: {myCard.expiry_date ? formatDate(myCard.expiry_date) : 'No expiry'}
            </small>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="action-buttons">
          <button
            className="action-btn qr-btn"
            onClick={() => setShowQR(!showQR)}
          >
            <i className="fas fa-qrcode"></i>
            <span>QR Code</span>
          </button>

          <button
            className="action-btn barcode-btn"
            onClick={() => setShowBarcode(!showBarcode)}
          >
            <i className="fas fa-barcode"></i>
            <span>Barcode</span>
          </button>

          <button
            className="action-btn attendance-btn"
            onClick={() => window.location.href = '/student-id'}
          >
            <i className="fas fa-calendar-check"></i>
            <span>Attendance</span>
          </button>

          <button
            className="action-btn emergency-btn"
            onClick={() => {
              if (myCard.emergency_contact_phone) {
                window.location.href = `tel:${myCard.emergency_contact_phone}`
              } else {
                toast.error('No emergency contact phone number available')
              }
            }}
          >
            <i className="fas fa-phone"></i>
            <span>Emergency</span>
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="modal-overlay" onClick={() => setShowQR(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>QR Code</h5>
              <button
                className="close-btn"
                onClick={() => setShowQR(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body text-center">
              {myCard.qr_code ? (
                <img
                  src={myCard.qr_code}
                  alt="QR Code"
                  className="qr-code-display"
                />
              ) : (
                <div className="qr-placeholder">
                  <i className="fas fa-qrcode fa-5x text-muted"></i>
                  <p>QR Code not available</p>
                </div>
              )}
              <p className="mt-3 text-muted small">
                Scan this QR code for digital check-ins
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Barcode Modal */}
      {showBarcode && (
        <div className="modal-overlay" onClick={() => setShowBarcode(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Barcode</h5>
              <button
                className="close-btn"
                onClick={() => setShowBarcode(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body text-center">
              {myCard.barcode_image ? (
                <img
                  src={myCard.barcode_image}
                  alt="Barcode"
                  className="barcode-display"
                />
              ) : (
                <div className="barcode-placeholder">
                  <i className="fas fa-barcode fa-5x text-muted"></i>
                  <p>Barcode not available</p>
                </div>
              )}
              <p className="mt-3 text-muted small">
                Use this barcode for manual entry
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Attendance */}
      <div className="recent-activity">
        <h5 className="section-title">
          <i className="fas fa-history me-2"></i>
          Recent Activity
        </h5>

        {recentAttendance.length > 0 ? (
          <div className="activity-list">
            {recentAttendance.map((record) => (
              <div key={record.id} className="activity-item">
                <div className="activity-icon">
                  <i className={getAttendanceTypeIcon(record.attendance_type)}></i>
                </div>
                <div className="activity-details">
                  <div className="activity-type">
                    {record.attendance_type.replace('_', ' ').toUpperCase()}
                  </div>
                  <div className="activity-meta">
                    {formatDate(record.timestamp)} at {formatTime(record.timestamp)}
                    {record.location && (
                      <span className="location"> • {record.location}</span>
                    )}
                  </div>
                </div>
                <div className="activity-status">
                  <span className={`status-indicator ${record.is_valid ? 'valid' : 'invalid'}`}>
                    {record.is_valid ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-activity">
            <i className="fas fa-calendar-times fa-2x text-muted"></i>
            <p>No recent activity</p>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      {(myCard.emergency_contact_name || myCard.emergency_contact_phone) && (
        <div className="emergency-contact">
          <h5 className="section-title">
            <i className="fas fa-phone me-2"></i>
            Emergency Contact
          </h5>
          <div className="contact-card">
            {myCard.emergency_contact_name && (
              <div className="contact-item">
                <i className="fas fa-user"></i>
                <span>{myCard.emergency_contact_name}</span>
              </div>
            )}
            {myCard.emergency_contact_phone && (
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <span>{myCard.emergency_contact_phone}</span>
                <button
                  className="call-btn"
                  onClick={() => window.location.href = `tel:${myCard.emergency_contact_phone}`}
                >
                  <i className="fas fa-phone"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Report Lost Card */}
      <div className="danger-zone">
        <button
          className="btn btn-danger btn-lg w-100"
          onClick={reportCardLost}
        >
          <i className="fas fa-exclamation-triangle me-2"></i>
          Report Card Lost/Stolen
        </button>
      </div>

      {/* Footer */}
      <div className="mobile-footer">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => window.location.href = '/student-id'}
        >
          <i className="fas fa-external-link-alt me-1"></i>
          Full System
        </button>
        <span className="version">v1.0.0</span>
      </div>
    </div>
  )
}

export default StudentIDMobile
