import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import axios from 'axios'

const StudentIDAdmin = () => {
  const { user } = useAuth()
  const dispatch = useDispatch()

  // State management
  const [activeTab, setActiveTab] = useState('cards')
  const [cards, setCards] = useState([])
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [accessPoints, setAccessPoints] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCard, setSelectedCard] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Form states
  const [newAccessPoint, setNewAccessPoint] = useState({
    name: '',
    location: '',
    access_point_type: 'rfid_reader',
    building: '',
    floor: '',
    room: '',
    is_active: true
  })

  // Load initial data
  useEffect(() => {
    loadCards()
    loadAccessPoints()
    loadStats()
  }, [])

  const loadCards = async () => {
    try {
      const response = await axios.get('/api/auth/id/id-cards/')
      setCards(response.data.results || response.data)
    } catch (error) {
      toast.error('Failed to load ID cards')
    }
  }

  const loadAccessPoints = async () => {
    try {
      const response = await axios.get('/api/auth/id/access-points/')
      setAccessPoints(response.data.results || response.data)
    } catch (error) {
      toast.error('Failed to load access points')
    }
  }

  const loadStats = async () => {
    try {
      const response = await axios.get('/api/auth/id/admin/stats/')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const loadAttendanceRecords = async (cardId = null) => {
    try {
      const url = cardId
        ? `/api/auth/attendance/?card=${cardId}`
        : '/api/auth/attendance/'
      const response = await axios.get(url)
      setAttendanceRecords(response.data.results || response.data)
    } catch (error) {
      toast.error('Failed to load attendance records')
    }
  }

  const updateCardStatus = async (cardId, status) => {
    try {
      await axios.patch(`/api/auth/id/id-cards/${cardId}/`, { status })
      toast.success(`Card status updated to ${status}`)
      loadCards()
    } catch (error) {
      toast.error('Failed to update card status')
    }
  }

  const deactivateCard = async (cardId) => {
    try {
      await axios.post(`/api/auth/id/id-cards/${cardId}/deactivate/`)
      toast.success('Card deactivated successfully')
      loadCards()
    } catch (error) {
      toast.error('Failed to deactivate card')
    }
  }

  const createAccessPoint = async () => {
    setLoading(true)
    try {
      await axios.post('/api/auth/id/access-points/', newAccessPoint)
      toast.success('Access point created successfully')
      setNewAccessPoint({
        name: '',
        location: '',
        access_point_type: 'rfid_reader',
        building: '',
        floor: '',
        room: '',
        is_active: true
      })
      loadAccessPoints()
    } catch (error) {
      toast.error('Failed to create access point')
    } finally {
      setLoading(false)
    }
  }

  const toggleAccessPoint = async (pointId, isActive) => {
    try {
      await axios.patch(`/api/auth/id/access-points/${pointId}/`, {
        is_active: isActive
      })
      toast.success(`Access point ${isActive ? 'activated' : 'deactivated'}`)
      loadAccessPoints()
    } catch (error) {
      toast.error('Failed to update access point')
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

  const filteredCards = cards.filter(card =>
    card.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.card_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="student-id-admin">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h2 fw-bold text-primary mb-2">
              <i className="fas fa-cogs me-2"></i>
              Student ID System Administration
            </h1>
            <p className="text-muted">Manage student ID cards, access points, and system settings</p>
          </div>
        </div>

        {/* Statistics Overview */}
        {stats && (
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card stats-card">
                <div className="card-body text-center">
                  <h3 className="text-white">{stats.total_cards}</h3>
                  <p className="text-white-50 mb-0">Total Cards</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card stats-card">
                <div className="card-body text-center">
                  <h3 className="text-white">{stats.active_cards}</h3>
                  <p className="text-white-50 mb-0">Active Cards</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card stats-card">
                <div className="card-body text-center">
                  <h3 className="text-white">{stats.total_access_points}</h3>
                  <p className="text-white-50 mb-0">Access Points</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card stats-card">
                <div className="card-body text-center">
                  <h3 className="text-white">{stats.total_records_today}</h3>
                  <p className="text-white-50 mb-0">Records Today</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'cards' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cards')}
                >
                  <i className="fas fa-id-card me-2"></i>
                  ID Cards
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
                  className={`nav-link ${activeTab === 'access-points' ? 'active' : ''}`}
                  onClick={() => setActiveTab('access-points')}
                >
                  <i className="fas fa-door-open me-2"></i>
                  Access Points
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reports')}
                >
                  <i className="fas fa-chart-bar me-2"></i>
                  Reports
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ID Cards Tab */}
        {activeTab === 'cards' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-id-card me-2"></i>
                      Student ID Cards
                    </h5>
                    <div className="input-group" style={{width: '300px'}}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or card number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="btn btn-outline-secondary" type="button">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Card Number</th>
                          <th>Status</th>
                          <th>Issued Date</th>
                          <th>Last Used</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCards.map((card) => (
                          <tr key={card.id}>
                            <td>
                              <div>
                                <strong>{card.student_name}</strong>
                                <br />
                                <small className="text-muted">{card.student_email}</small>
                              </div>
                            </td>
                            <td>
                              <code>{card.card_number}</code>
                            </td>
                            <td>
                              <span className={`badge bg-${getStatusColor(card.status)}`}>
                                {card.status.toUpperCase()}
                              </span>
                            </td>
                            <td>{formatDate(card.issued_date)}</td>
                            <td>{card.last_used ? formatDate(card.last_used) : '-'}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    setSelectedCard(card)
                                    loadAttendanceRecords(card.id)
                                    setActiveTab('attendance')
                                  }}
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                {card.status === 'active' && (
                                  <>
                                    <button
                                      className="btn btn-sm btn-outline-warning"
                                      onClick={() => updateCardStatus(card.id, 'inactive')}
                                    >
                                      <i className="fas fa-pause"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => deactivateCard(card.id)}
                                    >
                                      <i className="fas fa-ban"></i>
                                    </button>
                                  </>
                                )}
                                {card.status === 'inactive' && (
                                  <button
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => updateCardStatus(card.id, 'active')}
                                  >
                                    <i className="fas fa-play"></i>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                      <i className="fas fa-calendar-check me-2"></i>
                      Attendance Records
                      {selectedCard && (
                        <span className="ms-2 text-muted">
                          - {selectedCard.student_name} ({selectedCard.card_number})
                        </span>
                      )}
                    </h5>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setSelectedCard(null)
                        loadAttendanceRecords()
                      }}
                    >
                      <i className="fas fa-list me-2"></i>
                      All Records
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Timestamp</th>
                          <th>Type</th>
                          <th>Location</th>
                          <th>Classroom</th>
                          <th>Course</th>
                          <th>Valid</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceRecords.map((record) => (
                          <tr key={record.id}>
                            <td>{record.student_name || '-'}</td>
                            <td>
                              {formatDate(record.timestamp)}
                              <br />
                              <small className="text-muted">{formatTime(record.timestamp)}</small>
                            </td>
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
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Access Points Tab */}
        {activeTab === 'access-points' && (
          <div className="row">
            <div className="col-lg-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-door-open me-2"></i>
                    Access Points
                  </h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Location</th>
                          <th>Type</th>
                          <th>Status</th>
                          <th>Last Activity</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accessPoints.map((point) => (
                          <tr key={point.id}>
                            <td>
                              <strong>{point.name}</strong>
                              <br />
                              <small className="text-muted">
                                {point.building} {point.floor && `- ${point.floor}`} {point.room && `- ${point.room}`}
                              </small>
                            </td>
                            <td>{point.location}</td>
                            <td>
                              <span className="badge bg-info">
                                {point.access_point_type.replace('_', ' ').toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <span className={`badge bg-${point.is_active ? 'success' : 'secondary'}`}>
                                {point.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>{point.last_activity ? formatDate(point.last_activity) : '-'}</td>
                            <td>
                              <button
                                className={`btn btn-sm ${point.is_active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                onClick={() => toggleAccessPoint(point.id, !point.is_active)}
                              >
                                <i className={`fas ${point.is_active ? 'fa-pause' : 'fa-play'}`}></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-plus me-2"></i>
                    Add Access Point
                  </h5>
                </div>
                <div className="card-body">
                  <form onSubmit={(e) => { e.preventDefault(); createAccessPoint(); }}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAccessPoint.name}
                        onChange={(e) => setNewAccessPoint({...newAccessPoint, name: e.target.value})}
                        placeholder="Main Entrance Reader"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={newAccessPoint.location}
                        onChange={(e) => setNewAccessPoint({...newAccessPoint, location: e.target.value})}
                        placeholder="Front Door"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <select
                        className="form-select"
                        value={newAccessPoint.access_point_type}
                        onChange={(e) => setNewAccessPoint({...newAccessPoint, access_point_type: e.target.value})}
                      >
                        <option value="rfid_reader">RFID Reader</option>
                        <option value="nfc_reader">NFC Reader</option>
                        <option value="barcode_scanner">Barcode Scanner</option>
                        <option value="qr_scanner">QR Scanner</option>
                        <option value="turnstile">Turnstile</option>
                        <option value="door_lock">Door Lock</option>
                      </select>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Building</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newAccessPoint.building}
                            onChange={(e) => setNewAccessPoint({...newAccessPoint, building: e.target.value})}
                            placeholder="A"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Floor</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newAccessPoint.floor}
                            onChange={(e) => setNewAccessPoint({...newAccessPoint, floor: e.target.value})}
                            placeholder="1"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Room</label>
                          <input
                            type="text"
                            className="form-control"
                            value={newAccessPoint.room}
                            onChange={(e) => setNewAccessPoint({...newAccessPoint, room: e.target.value})}
                            placeholder="101"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus me-2"></i>
                          Add Access Point
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-chart-bar me-2"></i>
                    System Reports
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-title">
                            <i className="fas fa-download me-2"></i>
                            Export Attendance Data
                          </h6>
                          <p className="card-text text-muted">
                            Download attendance records in CSV or Excel format
                          </p>
                          <button className="btn btn-outline-primary">
                            <i className="fas fa-file-csv me-2"></i>
                            Export CSV
                          </button>
                          <button className="btn btn-outline-success ms-2">
                            <i className="fas fa-file-excel me-2"></i>
                            Export Excel
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-title">
                            <i className="fas fa-chart-pie me-2"></i>
                            Generate Analytics Report
                          </h6>
                          <p className="card-text text-muted">
                            Create detailed analytics reports for administrators
                          </p>
                          <button className="btn btn-outline-info">
                            <i className="fas fa-chart-line me-2"></i>
                            Generate Report
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-title">
                            <i className="fas fa-users me-2"></i>
                            Student Activity Report
                          </h6>
                          <p className="card-text text-muted">
                            View student activity patterns and attendance statistics
                          </p>
                          <button className="btn btn-outline-warning">
                            <i className="fas fa-user-clock me-2"></i>
                            View Report
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h6 className="card-title">
                            <i className="fas fa-shield-alt me-2"></i>
                            Security Audit Log
                          </h6>
                          <p className="card-text text-muted">
                            Review security events and access attempts
                          </p>
                          <button className="btn btn-outline-danger">
                            <i className="fas fa-lock me-2"></i>
                            View Audit Log
                          </button>
                        </div>
                      </div>
                    </div>
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

export default StudentIDAdmin
