import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const TwoFactorAuth = () => {
  const { user } = useAuth()
  const [isEnabled, setIsEnabled] = useState(false)
  const [method, setMethod] = useState('app') // 'app', 'sms', 'email'
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState([])
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    check2FAStatus()
  }, [])

  const check2FAStatus = async () => {
    // Mock API call - in real app, this would check user's 2FA status
    setIsEnabled(false)
  }

  const enable2FA = async () => {
    setLoading(true)
    try {
      // Mock API call - in real app, this would generate QR code and secret
      const mockSecret = 'JBSWY3DPEHPK3PXP' // Mock TOTP secret
      const mockQrCode = `otpauth://totp/OpenEdTex:${user?.email}?secret=${mockSecret}&issuer=OpenEdTex`
      const mockBackupCodes = [
        '1234-5678-9012',
        '3456-7890-1234',
        '5678-9012-3456',
        '7890-1234-5678',
        '9012-3456-7890'
      ]

      setSecret(mockSecret)
      setQrCode(mockQrCode)
      setBackupCodes(mockBackupCodes)
      toast.success('2FA setup initiated. Please scan the QR code.')
    } catch (error) {
      toast.error('Failed to enable 2FA')
    } finally {
      setLoading(false)
    }
  }

  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code')
      return
    }

    setLoading(true)
    try {
      // Mock API call - in real app, this would verify the TOTP code
      // For demo purposes, accept any 6-digit code
      setIsEnabled(true)
      setShowBackupCodes(true)
      toast.success('2FA enabled successfully!')
    } catch (error) {
      toast.error('Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  const disable2FA = async () => {
    setLoading(true)
    try {
      // Mock API call - in real app, this would disable 2FA
      setIsEnabled(false)
      setQrCode('')
      setSecret('')
      setBackupCodes([])
      setShowBackupCodes(false)
      toast.success('2FA disabled successfully')
    } catch (error) {
      toast.error('Failed to disable 2FA')
    } finally {
      setLoading(false)
    }
  }

  const regenerateBackupCodes = async () => {
    setLoading(true)
    try {
      // Mock API call - in real app, this would regenerate backup codes
      const newBackupCodes = [
        'abcd-efgh-ijkl',
        'efgh-ijkl-mnop',
        'ijkl-mnop-qrst',
        'mnop-qrst-uvwx',
        'qrst-uvwx-yzab'
      ]
      setBackupCodes(newBackupCodes)
      toast.success('Backup codes regenerated')
    } catch (error) {
      toast.error('Failed to regenerate backup codes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="twofa-page">
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="h2 fw-bold text-primary mb-2">
              <i className="fas fa-shield-alt me-2"></i>
              Two-Factor Authentication
            </h1>
            <p className="text-muted">Add an extra layer of security to your account</p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-mobile-alt me-2"></i>
                  Authentication Method
                </h5>
              </div>
              <div className="card-body">
                {!isEnabled ? (
                  <div>
                    <div className="alert alert-info">
                      <i className="fas fa-info-circle me-2"></i>
                      Two-factor authentication is not currently enabled for your account.
                      Enable it to add an extra layer of security.
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">Choose your preferred method:</h6>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <div className={`card h-100 ${method === 'app' ? 'border-primary' : ''} cursor-pointer`}
                               onClick={() => setMethod('app')}>
                            <div className="card-body text-center">
                              <i className="fas fa-mobile-alt fa-2x text-primary mb-2"></i>
                              <h6 className="card-title">Authenticator App</h6>
                              <p className="card-text small text-muted">
                                Use Google Authenticator, Authy, or similar apps
                              </p>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="method"
                                  id="app"
                                  checked={method === 'app'}
                                  onChange={() => setMethod('app')}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className={`card h-100 ${method === 'sms' ? 'border-primary' : ''} cursor-pointer`}
                               onClick={() => setMethod('sms')}>
                            <div className="card-body text-center">
                              <i className="fas fa-sms fa-2x text-success mb-2"></i>
                              <h6 className="card-title">SMS</h6>
                              <p className="card-text small text-muted">
                                Receive codes via text message
                              </p>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="method"
                                  id="sms"
                                  checked={method === 'sms'}
                                  onChange={() => setMethod('sms')}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className={`card h-100 ${method === 'email' ? 'border-primary' : ''} cursor-pointer`}
                               onClick={() => setMethod('email')}>
                            <div className="card-body text-center">
                              <i className="fas fa-envelope fa-2x text-warning mb-2"></i>
                              <h6 className="card-title">Email</h6>
                              <p className="card-text small text-muted">
                                Receive codes via email
                              </p>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="method"
                                  id="email"
                                  checked={method === 'email'}
                                  onChange={() => setMethod('email')}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={enable2FA}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Setting up...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-shield-alt me-2"></i>
                          Enable 2FA
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="alert alert-success">
                      <i className="fas fa-check-circle me-2"></i>
                      Two-factor authentication is enabled for your account.
                    </div>

                    <div className="mb-4">
                      <h6 className="fw-bold mb-3">Current Method: {method === 'app' ? 'Authenticator App' : method === 'sms' ? 'SMS' : 'Email'}</h6>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-danger"
                        onClick={disable2FA}
                        disabled={loading}
                      >
                        <i className="fas fa-times me-2"></i>
                        Disable 2FA
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        onClick={regenerateBackupCodes}
                        disabled={loading}
                      >
                        <i className="fas fa-refresh me-2"></i>
                        Regenerate Backup Codes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* QR Code Setup */}
            {qrCode && !isEnabled && (
              <div className="card mt-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-qrcode me-2"></i>
                    Setup Authenticator App
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p>1. Install an authenticator app (Google Authenticator, Authy, etc.)</p>
                      <p>2. Scan the QR code with your app:</p>
                      <div className="text-center my-3">
                        <div className="bg-light p-3 rounded" style={{width: '200px', height: '200px', margin: '0 auto'}}>
                          <i className="fas fa-qrcode fa-5x text-muted"></i>
                          <p className="mt-2 small text-muted">QR Code Placeholder</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <p>3. Or enter this code manually:</p>
                      <div className="bg-light p-3 rounded mb-3">
                        <code className="text-break">{secret}</code>
                      </div>
                      <p>4. Enter the 6-digit code from your app:</p>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control text-center"
                          placeholder="000000"
                          maxLength="6"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        />
                        <button
                          className="btn btn-primary"
                          onClick={verifyAndEnable}
                          disabled={loading || verificationCode.length !== 6}
                        >
                          {loading ? 'Verifying...' : 'Verify & Enable'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Codes */}
            {showBackupCodes && backupCodes.length > 0 && (
              <div className="card mt-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-key me-2"></i>
                    Backup Codes
                  </h5>
                </div>
                <div className="card-body">
                  <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    <strong>Important:</strong> Save these backup codes in a safe place.
                    You can use them to access your account if you lose your device.
                  </div>
                  <div className="row">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="col-md-4 mb-2">
                        <div className="bg-light p-2 rounded text-center">
                          <code>{code}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => navigator.clipboard.writeText(backupCodes.join('\n'))}
                    >
                      <i className="fas fa-copy me-2"></i>
                      Copy All Codes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-info-circle me-2"></i>
                  Why Enable 2FA?
                </h5>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <i className="fas fa-check text-success me-2"></i>
                    <strong>Enhanced Security:</strong> Adds an extra layer of protection beyond your password
                  </li>
                  <li className="mb-3">
                    <i className="fas fa-check text-success me-2"></i>
                    <strong>Account Protection:</strong> Prevents unauthorized access even if your password is compromised
                  </li>
                  <li className="mb-3">
                    <i className="fas fa-check text-success me-2"></i>
                    <strong>Peace of Mind:</strong> Know that your learning progress and personal data are secure
                  </li>
                  <li className="mb-3">
                    <i className="fas fa-check text-success me-2"></i>
                    <strong>Industry Standard:</strong> Used by leading educational platforms worldwide
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorAuth
