import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'
import axios from 'axios'

const HardwareIntegration = () => {
  const { user } = useAuth()
  const [accessPoints, setAccessPoints] = useState([])
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [scanMode, setScanMode] = useState(false)
  const [lastScan, setLastScan] = useState(null)
  const [scanHistory, setScanHistory] = useState([])
  const [loading, setLoading] = useState(false)

  // WebSocket connection for real-time updates
  const [wsConnection, setWsConnection] = useState(null)

  useEffect(() => {
    loadAccessPoints()
    initializeWebSocket()
    return () => {
      if (wsConnection) {
        wsConnection.close()
      }
    }
  }, [])

  const loadAccessPoints = async () => {
    try {
      const response = await axios.get('/api/auth/id/access-points/')
      setAccessPoints(response.data.results || response.data)
    } catch (error) {
      toast.error('Failed to load access points')
    }
  }

  const initializeWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:8001/ws/hardware/')

      ws.onopen = () => {
        console.log('WebSocket connected')
        setConnectionStatus('connected')
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        handleWebSocketMessage(data)
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setConnectionStatus('disconnected')
        // Attempt to reconnect after 5 seconds
        setTimeout(initializeWebSocket, 5000)
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus('error')
      }

      setWsConnection(ws)
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error)
      setConnectionStatus('error')
    }
  }

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'card_scan':
        handleCardScan(data)
        break
      case 'access_granted':
        handleAccessGranted(data)
        break
      case 'access_denied':
        handleAccessDenied(data)
        break
      case 'device_status':
        handleDeviceStatus(data)
        break
      default:
        console.log('Unknown message type:', data.type)
    }
  }

  const handleCardScan = (data) => {
    setLastScan({
      card_number: data.card_number,
      timestamp: new Date(),
      access_point: data.access_point,
      scan_type: data.scan_type
    })

    // Add to scan history
    setScanHistory(prev => [{
      ...data,
      timestamp: new Date(),
      id: Date.now()
    }, ...prev.slice(0, 9)]) // Keep last 10 scans

    // Show notification
    toast.success(`Card scanned: ${data.card_number}`)
  }

  const handleAccessGranted = (data) => {
    toast.success(`Access granted for ${data.student_name}`)
    playSound('access-granted')
  }

  const handleAccessDenied = (data) => {
    toast.error(`Access denied: ${data.reason}`)
    playSound('access-denied')
  }

  const handleDeviceStatus = (data) => {
    // Update device status in the list
    setAccessPoints(prev => prev.map(point =>
      point.id === data.device_id
        ? { ...point, status: data.status, last_activity: new Date() }
        : point
    ))
  }

  const playSound = (soundType) => {
    // Create audio context for sound feedback
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      if (soundType === 'access-granted') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } else if (soundType === 'access-denied') {
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      }
    } catch (error) {
      console.error('Failed to play sound:', error)
    }
  }

  const connectToDevice = async (pointId) => {
    setLoading(true)
    try {
      const response = await axios.post(`/api/auth/id/access-points/${pointId}/connect/`)
      setSelectedPoint(pointId)
      toast.success('Connected to device successfully')
    } catch (error) {
      toast.error('Failed to connect to device')
    } finally {
      setLoading(false)
    }
  }

  const disconnectFromDevice = async (pointId) => {
    try {
      await axios.post(`/api/auth/id/access-points/${pointId}/disconnect/`)
      setSelectedPoint(null)
      toast.success('Disconnected from device')
    } catch (error) {
      toast.error('Failed to disconnect from device')
    }
  }

  const testDevice = async (pointId) => {
    try {
      const response = await axios.post(`/api/auth/id/access-points/${pointId}/test/`)
      toast.success('Device test successful')
    } catch (error) {
      toast.error('Device test failed')
    }
  }

  const simulateScan = async (pointId, cardNumber) => {
    if (!cardNumber) {
      toast.error('Please enter a card number')
      return
    }

    try {
      await axios.post(`/api/auth/id/access-points/${pointId}/simulate_scan/`, {
        card_number: cardNumber
      })
      toast.success('Scan simulation sent')
    } catch (error) {
      toast.error('Failed to simulate scan')
    }
  }

  const getDeviceTypeIcon = (type) => {
    switch (type) {
      case 'rfid_reader': return 'fas fa-wifi'
      case 'nfc_reader': return 'fas fa-mobile-alt'
      case 'barcode_scanner': return 'fas fa-barcode'
      case 'qr_scanner': return 'fas fa-qrcode'
      case 'turnstile': return 'fas fa-arrows-alt-h'
      case 'door_lock': return 'fas fa-lock'
      default: return 'fas fa-question-circle'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'success'
      case 'offline': return 'secondary'
      case 'error': return 'danger'
      case 'maintenance': return 'warning'
      default: return 'secondary'
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }

  return (
    <div className="hardware-integration">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h2 fw-bold text-primary mb-2">
              <i className="fas fa-microchip me-2"></i>
              Hardware Integration
            </h1>
            <p className="text-muted">Connect and manage physical access points and scanning devices</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="connection-status">
              <div className="status-indicator">
                <div className={`status-light ${connectionStatus}`}></div>
                <span className="status-text">
                  WebSocket: {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
                </span>
              </div>
              {connectionStatus === 'disconnected' && (
                <button
                  className="btn btn-sm btn-outline-primary ms-3"
                  onClick={initializeWebSocket}
                >
                  <i className="fas fa-sync me-1"></i>
                  Reconnect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Access Points Grid */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="access-points-grid">
              {accessPoints.map((point) => (
                <div key={point.id} className="access-point-card">
                  <div className="card-header">
                    <div className="device-icon">
                      <i className={getDeviceTypeIcon(point.access_point_type)}></i>
                    </div>
                    <div className="device-info">
                      <h6 className="device-name">{point.name}</h6>
                      <p className="device-location">{point.location}</p>
                    </div>
                    <div className="device-status">
                      <span className={`badge bg-${getStatusColor(point.status || 'offline')}`}>
                        {point.status || 'offline'}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="device-details">
                      <div className="detail-item">
                        <span className="label">Type:</span>
                        <span className="value">{point.access_point_type.replace('_', ' ')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Building:</span>
                        <span className="value">{point.building || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Floor:</span>
                        <span className="value">{point.floor || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Room:</span>
                        <span className="value">{point.room || '-'}</span>
                      </div>
                      {point.last_activity && (
                        <div className="detail-item">
                          <span className="label">Last Activity:</span>
                          <span className="value">{formatTime(new Date(point.last_activity))}</span>
                        </div>
                      )}
                    </div>

                    <div className="device-actions">
                      {selectedPoint === point.id ? (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => disconnectFromDevice(point.id)}
                        >
                          <i className="fas fa-unlink me-1"></i>
                          Disconnect
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => connectToDevice(point.id)}
                          disabled={loading}
                        >
                          <i className="fas fa-link me-1"></i>
                          Connect
                        </button>
                      )}

                      <button
                        className="btn btn-sm btn-outline-info ms-2"
                        onClick={() => testDevice(point.id)}
                      >
                        <i className="fas fa-vial me-1"></i>
                        Test
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scan Testing Section */}
        {selectedPoint && (
          <div className="row mb-4">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-flask me-2"></i>
                    Scan Testing
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Test Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter card number to simulate"
                      id="testCardNumber"
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      const cardNumber = document.getElementById('testCardNumber').value
                      simulateScan(selectedPoint, cardNumber)
                    }}
                  >
                    <i className="fas fa-play me-2"></i>
                    Simulate Scan
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-eye me-2"></i>
                    Live Monitoring
                  </h5>
                </div>
                <div className="card-body">
                  {lastScan ? (
                    <div className="last-scan-info">
                      <div className="scan-details">
                        <h6>Last Scan</h6>
                        <p><strong>Card:</strong> {lastScan.card_number}</p>
                        <p><strong>Time:</strong> {formatTime(lastScan.timestamp)}</p>
                        <p><strong>Type:</strong> {lastScan.scan_type}</p>
                        <p><strong>Point:</strong> {lastScan.access_point}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="no-scan-info">
                      <i className="fas fa-waveform-path fa-2x text-muted mb-2"></i>
                      <p className="text-muted">Waiting for scans...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scan History */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-history me-2"></i>
                  Recent Scan History
                </h5>
              </div>
              <div className="card-body">
                {scanHistory.length > 0 ? (
                  <div className="scan-history-list">
                    {scanHistory.map((scan) => (
                      <div key={scan.id} className="scan-history-item">
                        <div className="scan-icon">
                          <i className={getDeviceTypeIcon(scan.device_type || 'rfid_reader')}></i>
                        </div>
                        <div className="scan-details">
                          <div className="scan-card-number">{scan.card_number}</div>
                          <div className="scan-meta">
                            {formatTime(scan.timestamp)} • {scan.access_point_name || 'Unknown Point'}
                          </div>
                        </div>
                        <div className="scan-status">
                          <span className="badge bg-success">Processed</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-inbox fa-2x text-muted mb-2"></i>
                    <p className="text-muted">No scan history available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HardwareIntegration
