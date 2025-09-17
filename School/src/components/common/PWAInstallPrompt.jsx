import { useState, useEffect } from 'react'
import PWAService from './PWAService'
import './PWAInstallPrompt.css'

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const pwaService = PWAService()

  useEffect(() => {
    // Show install prompt after user has been on site for a while
    const timer = setTimeout(() => {
      if (pwaService.isInstallable && !localStorage.getItem('pwa-prompt-dismissed')) {
        setShowPrompt(true)
      }
    }, 30000) // Show after 30 seconds

    // Update offline status
    setIsOffline(pwaService.isOffline)

    return () => clearTimeout(timer)
  }, [pwaService.isInstallable, pwaService.isOffline])

  const handleInstall = async () => {
    await pwaService.installPWA()
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  const handleShare = async () => {
    await pwaService.shareContent(
      'OpenEdTex - AI-Powered Learning',
      'Experience the future of education with AI-powered learning assistant and interactive courses.',
      window.location.href
    )
  }

  if (!showPrompt && !isOffline) return null

  return (
    <>
      {/* Install Prompt */}
      {showPrompt && (
        <div className="pwa-install-prompt">
          <div className="prompt-content">
            <div className="prompt-icon">📱</div>
            <div className="prompt-text">
              <h3>Install OpenEdTex</h3>
              <p>Get the full experience with offline access, push notifications, and native app feel!</p>
            </div>
            <div className="prompt-actions">
              <button className="btn-install" onClick={handleInstall}>
                Install App
              </button>
              <button className="btn-dismiss" onClick={handleDismiss}>
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Indicator */}
      {isOffline && (
        <div className="offline-indicator">
          <div className="offline-content">
            <div className="offline-icon">📶</div>
            <div className="offline-text">
              <h4>You&apos;re Offline</h4>
              <p>Some features may be limited. Content will sync when you&apos;re back online.</p>
            </div>
            <button className="btn-share" onClick={handleShare}>
              Share
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default PWAInstallPrompt
