import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import axios from 'axios'

const StudentIDSystem = () => {
  const { user } = useAuth()
  const dispatch = useDispatch()

  // State management
  const [activeTab, setActiveTab] = useState('my-card')
  const [myCard, setMyCard] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)

  // Form states
  const [newCardData, setNewCardData] = useState({
    card_type: 'standard',
    expiry_date: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_info: ''
  })

  // Load initial data
  useEffect(() => {
    loadMyCard()
    loadAttendanceRecords()
    loadStats()
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

  const loadAttendanceRecords = async () => {
    try {
      const response = await axios.get('/api/auth/attendance/')
      setAttendanceRecords(response.data.results || response.data)
    } catch (error) {
      toast.error('Failed to load attendance records')
    }
  }

  const loadStats = async () => {
    try {
      const response = await axios.get('/api/auth/attendance/stats/')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const requestNewCard = async () => {
    setLoading(true)
    try {
      const response = await axios.post('/api/auth/id/id-cards/', {
        student: user.id,
        ...newCardData
      })
      setMyCard(response.data)
      toast.success('ID card requested successfully!')
      setActiveTab('my-card')
    } catch (error) {
      toast.error('Failed to request ID card')
    } finally {
      setLoading(false)
    }
  }

  const reportCardLost = async () => {
    if (!myCard) return

    try {
      await axios.post(`/api/auth/id/id-cards/${myCard.id}/report_lost/`)
      toast.success('Card reported as lost. Please contact administration.')
      loadMyCard()
    } catch (error) {
      toast.error('Failed to report lost card')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'secondary'
      case 'lost': return 'danger'
      case 'stolen': return 'danger'
      case 'expired': return 'warning'
      default: return 'secondary'
    }
  }

  const getAttendanceTypeColor = (type) => {
    switch (type) {
      case 'check_in': return 'success'
      case 'check_out': return 'info'
      case 'class_entry': return 'primary'
      case 'class_exit': return 'secondary'
      case 'building_entry': return 'warning'
      case 'building_exit': return 'dark'
      default: return 'secondary'
    }
  }

  return (
    <div className="student-id-system">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h2 fw-bold text-primary mb-2">
              <i className="fas fa-id-card me-2"></i>
              Student ID System
            </h1>
            <p className="text-muted">Manage your student ID card and view attendance records</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'my-card' ? 'active' : ''}`}
                  onClick={() => setActiveTab('my-card')}
                >
                  <i className="fas fa-credit-card me-2"></i>
                  My ID Card
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('attendance')}
                >
                  <i className="fas fa-calendar-check me-2"></i>
                  Attendance
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'request' ? 'active' : ''}`}
                  onClick={() => setActiveTab('request')}
                >
                  <i className="fas fa-plus me-2"></i>
                  Request Card
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'stats' ? 'active' : ''}`}
                  onClick={() => setActiveTab('stats')}
                >
                  <i className="fas fa-chart-bar me-2"></i>
                  Statistics
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* My ID Card Tab */}
        {activeTab === 'my-card' && (
          <div className="row">
            <div className="col-lg-8">
              {myCard ? (
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-credit-card me-2"></i>
                      Your Student ID Card
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="mb-3">
                          <strong>Card Number:</strong> {myCard.card_number}
                        </div>
                        <div className="mb-3">
                          <strong>Status:</strong>
                          <span className={`badge bg-${getStatusColor(myCard.status)} ms-2`}>
                            {myCard.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="mb-3">
                          <strong>Issued Date:</strong> {formatDate(myCard.issued_date)}
                        </div>
                        {myCard.expiry_date && (
                          <div className="mb-3">
                            <strong>Expiry Date:</strong> {formatDate(myCard.expiry_date)}
                          </div>
                        )}
                        {myCard.last_used && (
                          <div className="mb-3">
                            <strong>Last Used:</strong> {formatDate(myCard.last_used)}
                          </div>
                        )}
                        <div className="mb-3">
                          <strong>Card Type:</strong> {myCard.card_type}
                        </div>
                      </div>
                      <div className="col-md-4">
                        {myCard.card_image && (
                          <div className="text-center">
                            <img
                              src={myCard.card_image}
                              alt="ID Card"
                              className="img-fluid rounded shadow"
                              style={{maxWidth: '200px'}}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* QR Code and Barcode */}
                    <div className="row mt-4">
                      {myCard.qr_code && (
                        <div className="col-md-6">
                          <h6>QR Code</h6>
                          <img
                            src={myCard.qr_code}
                            alt="QR Code"
                            className="img-fluid"
                            style={{maxWidth: '150px'}}
                          />
                        </div>
                      )}
                      {myCard.barcode_image && (
                        <div className="col-md-6">
                          <h6>Barcode</h6>
                          <img
                            src={myCard.barcode_image}
                            alt="Barcode"
                            className="img-fluid"
                            style={{maxWidth: '200px'}}
                          />
                        </div>
                      )}
                    </div>

                    {/* Emergency Contact */}
                    {(myCard.emergency_contact_name || myCard.emergency_contact_phone) && (
                      <div className="mt-4">
                        <h6>Emergency Contact</h6>
                        <div className="row">
                          {myCard.emergency_contact_name && (
                            <div className="col-md-6">
                              <strong>Name:</strong> {myCard.emergency_contact_name}
                            </div>
                          )}
                          {myCard.emergency_contact_phone && (
                            <div className="col-md-6">
                              <strong>Phone:</strong> {myCard.emergency_contact_phone}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4">
                      <button
                        className="btn btn-danger me-2"
                        onClick={reportCardLost}
                      >
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Report Lost/Stolen
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() => window.print()}
                      >
                        <i className="fas fa-print me-2"></i>
                        Print Card
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fas fa-id-card fa-3x text-muted mb-3"></i>
                    <h5>No Active ID Card</h5>
                    <p className="text-muted">You don&apos;t have an active student ID card yet.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => setActiveTab('request')}
                    >
                      Request New Card
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    Card Information
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <h6>How to Use Your Card</h6>
                    <ul className="small text-muted">
                      <li>Tap your card on RFID readers for building access</li>
                      <li>Scan QR code for digital check-ins</li>
                      <li>Use barcode for manual entry when needed</li>
                      <li>Keep emergency contact information updated</li>
                    </ul>
                  </div>

                  <div className="mb-3">
                    <h6>Security Tips</h6>
                    <ul className="small text-muted">
                      <li>Report lost cards immediately</li>
                      <li>Don&apos;t share your card with others</li>
                      <li>Keep emergency contacts current</li>
                      <li>Check expiry date regularly</li>
                    </ul>
                  </div>

                  <div className="alert alert-info">
                    <i className="fas fa-lightbulb me-2"></i>
                    <strong>Pro Tip:</strong> Your card automatically tracks attendance when you enter classrooms or buildings.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-calendar-check me-2"></i>
                    Attendance Records
                  </h5>
                </div>
                <div className="card-body">
                  {attendanceRecords.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Classroom</th>
                            <th>Course</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceRecords.map((record) => (
                            <tr key={record.id}>
                              <td>{formatDate(record.timestamp)}</td>
                              <td>{formatTime(record.timestamp)}</td>
                              <td>
                                <span className={`badge bg-${getAttendanceTypeColor(record.attendance_type)}`}>
                                  {record.attendance_type.replace('_', ' ').toUpperCase()}
                                </span>
                              </td>
                              <td>{record.location || '-'}</td>
                              <td>{record.classroom_name || '-'}</td>
                              <td>{record.course_title || '-'}</td>
                              <td>
                                <span className={`badge bg-${record.is_valid ? 'success' : 'danger'}`}>
                                  {record.is_valid ? 'Valid' : 'Invalid'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                      <h5>No Attendance Records</h5>
                      <p className="text-muted">Your attendance records will appear here once you start using your ID card.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Card Tab */}
        {activeTab === 'request' && (
          <div className="row">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-plus me-2"></i>
                    Request New ID Card
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={(e) => { e.preventDefault(); requestNewCard(); }}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Card Type</label>
                          <select
                            className="form-select"
                            value={newCardData.card_type}
                            onChange={(e) => setNewCardData({...newCardData, card_type: e.target.value})}
                          >
                            <option value="standard">Standard Student</option>
                            <option value="staff">Staff/Faculty</option>
                            <option value="temporary">Temporary</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Expiry Date (Optional)</label>
                          <input
                            type="date"
                            className="form-control"
                            value={newCardData.expiry_date}
                            onChange={(e) => setNewCardData({...newCardData, expiry_date: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Emergency Contact Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newCardData.emergency_contact_name}
                            onChange={(e) => setNewCardData({...newCardData, emergency_contact_name: e.target.value})}
                            placeholder="Parent/Guardian name"
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Emergency Contact Phone</label>
                          <input
                            type="tel"
                            className="form-control"
                            value={newCardData.emergency_contact_phone}
                            onChange={(e) => setNewCardData({...newCardData, emergency_contact_phone: e.target.value})}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Medical Information (Optional)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={newCardData.medical_info}
                        onChange={(e) => setNewCardData({...newCardData, medical_info: e.target.value})}
                        placeholder="Allergies, medications, conditions..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Requesting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus me-2"></i>
                          Request ID Card
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-question-circle me-2"></i>
                    Card Request Process
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <h6>What happens next?</h6>
                    <ol className="small text-muted">
                      <li>Your request is submitted for approval</li>
                      <li>Administration reviews your information</li>
                      <li>Card is generated with unique identifiers</li>
                      <li>You receive notification when ready for pickup</li>
                      <li>Card is activated and ready to use</li>
                    </ol>
                  </div>

                  <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>Important:</strong> Keep emergency contact information current for your safety.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="row">
            <div className="col-12">
              {stats ? (
                <div className="row">
                  <div className="col-md-3 mb-4">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3 className="text-primary">{stats.summary.total_records}</h3>
                        <p className="text-muted mb-0">Total Records</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-4">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3 className="text-success">{stats.summary.valid_records}</h3>
                        <p className="text-muted mb-0">Valid Records</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-4">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3 className="text-danger">{stats.summary.invalid_records}</h3>
                        <p className="text-muted mb-0">Invalid Records</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-4">
                    <div className="card text-center">
                      <div className="card-body">
                        <h3 className="text-info">{stats.summary.validity_rate.toFixed(1)}%</h3>
                        <p className="text-muted mb-0">Validity Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fas fa-chart-bar fa-3x text-muted mb-3"></i>
                    <h5>Loading Statistics...</h5>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentIDSystem
